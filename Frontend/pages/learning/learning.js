import { showLoader, hideLoader } from '../components/loader/loader.js';
const baseAPI = `https://onlinecourse.up.railway.app/api/course/learning`;
const content = document.querySelector('.container');
let course_id = null;
let videoTime = null;
let currentTime = null;
let current_lesson_isLearnded;

// Get token form local storage
let token = localStorage.getItem('user');
token = token.replace(/"/g, '');

// Lấy toàn bộ URL hiện tại
const urlParams = new URLSearchParams(window.location.search);
const slug = urlParams.get('slug');

document.addEventListener('DOMContentLoaded', function () {
  async function initializeComponents() {
    const components = [
      'learning_bottom',
      'learning-header',
      'comments',
      'toastMessage',
    ];

    for (const component of components) {
      await loadComponent(component);
      await loadScript(component);
    }
  }

  async function initializeServices() {
    const services = ['renderChapter', 'env', 'convertSeconds'];

    for (const service of services) {
      await loadServices(service);
    }
  }

  // Initialize components and services
  initializeComponents()
    .then(() => initializeServices())
    .then(fetchCourses)
    .catch((error) => console.error('Initialization failed:', error));
});

async function fetchCourses() {
  try {
    if (slug) {
      content.style.opacity = '0';
      const API_CourseLink = `${baseAPI}/${slug}`;
      const response = await fetch(API_CourseLink, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const course = await response.json();
      if (course.errors) {
        toast({
          title: 'Đăng nhập lại',
          message: 'Vui lòng đăng nhập lại để học tiếp',
          type: 'warning',
          duration: 5000,
        });
      }
      console.log(course);

      // render video source
      const source = document.querySelector('source');
      source.src = course.lesson_url;
      const videoElement = document.querySelector('video');
      videoElement.load();

      // asign current_time to video time
      videoTime = course.current_time
        ? seekToTimeInVideo(course.current_time)
        : 0;
      // Seek time in video
      videoElement.currentTime = videoTime;

      // asign current course to id
      course_id = course.lesson_current;
      const container = document.querySelector('.content');
      renderChapter(container, course.chapter);

      // Handles the collapse/expand functionality for panel headers
      const headers = document.querySelectorAll('.panel-header');
      headers.forEach((header) => {
        header.addEventListener('click', () => {
          const panelContent = header.nextElementSibling;
          panelContent.classList.toggle('collapse');
        });
      });

      current_lesson_isLearnded = course.chapter.some((chapter) =>
        chapter.lessons.some(
          (lesson) => lesson.id === course_id && lesson.is_done === true
        )
      );

      // Handle on click event for select course
      const panelItems = document.querySelectorAll('.panel-item');

      panelItems.forEach((item) => {
        item.addEventListener('click', async function () {
          currentTime = formatTime(currentTime);
          const targetLesson = this.id;

          Promise.all([
            current_lesson_isLearnded
              ? Promise.resolve(null)
              : updateCourse(course_id, token, currentTime),
            updateCurrentLesson(targetLesson),
          ])
            .then(([result1, result2]) => {
              // let data = await result1.json();
              // console.log(data);

              // console.log('API 1 result:', data);
              // if (data.errors)
              if (result2.errors) {
                toast({
                  title: 'Có lỗi xảy ra',
                  message: result2.errors,
                  type: 'error',
                  duration: 5000,
                });
                return;
              }
              console.log(result2);
              window.location.reload();

              // Nếu cả hai hàm đều thành công, reload trang
              console.log(`all done`);
            })
            .catch((error) => {
              toast({
                title: 'Có lỗi xảy ra',
                message: error,
                type: 'error',
                duration: 5000,
              });
            });
        });
      });

      // handle change background color for panelItems
      updatePanelItemBackground(course.total_lesson_done_of_course);

      // render
      content.style.opacity = '1';
      content.classList.remove('none');
      const learned_courses = document.querySelector('#learned-lessons');
      const total_courses = document.querySelector('#unfinished-Lessons');
      const progress = document.querySelector('.progress-percent');
      const progressCircle = document.querySelector('.progress-circle');

      const percent = Number(course.average_lesson);
      progressCircle.style.background = `conic-gradient(var(--colors-default-50) ${percent}%, #4e4e4e 0%)`;
      progress.textContent = percent + '%';
      total_courses.textContent = course.total_lesson_of_course;
      learned_courses.textContent = course.total_lesson_done_of_course;

      // handle button next/back lesson
      const prevButton = document.querySelector('#prev-lesson');
      const nextButton = document.querySelector('#next-lesson');
      if (course.lesson_current === 1) {
        prevButton.disabled = true;
      } else if (course.lesson_current === course.total_lesson_of_course) {
        nextButton.disabled = true;
      }
      const currentLesson = parseInt(course.lesson_current);
      prevButton.addEventListener('click', () => {
        updateCurrentLesson(course.lesson_pre);
      });
      nextButton.addEventListener('click', () => {
        window.location.reload();
      });
    } else {
      console.log('Course ID not found in the URL');
    }
  } catch (error) {
    console.error('Error fetching courses:', error);
  }
}

async function loadComponent(component) {
  return fetch(`../components/${component}/${component}.html`)
    .then((response) => response.text())
    .then((html) => {
      const container = document.querySelector(`#${component}`);
      if (!container) throw new Error(`Container for ${component} not found`);
      container.innerHTML = html;
    })
    .catch((error) => {
      console.error(`Failed to load ${component}:`, error);
    });
}

async function loadScript(component) {
  return fetch(`../components/${component}/${component}.js`)
    .then((response) => {
      if (!response.ok) {
        console.warn(`No script found for ${component}`);
        return null;
      }
      return response.text();
    })
    .then((js) => {
      if (js) {
        const script = document.createElement('script');
        script.text = js;
        document.body.appendChild(script);
      }
    })
    .catch((error) => {
      console.error(`Failed to load script for ${component}:`, error);
    });
}

async function loadServices(service) {
  return fetch(`../../services/${service}.js`)
    .then((response) => response.text())
    .then((js) => {
      const script = document.createElement('script');
      script.text = js;
      document.body.appendChild(script);
    })
    .catch((error) => {
      console.error(`Failed to load service ${service}:`, error);
    });
}

document.getElementById('playButton').addEventListener('click', function () {
  const videoPlayer = document.getElementById('videoPlayer');
  const thumbnail = document.getElementById('thumbnail');
  const playButton = document.getElementById('playButton');

  // Hide the thumbnail and play button, show the video player
  thumbnail.style.display = 'none';
  playButton.style.display = 'none';
  videoPlayer.style.display = 'block';

  // Play the video
  videoPlayer.play();
});

const blurElement = document.querySelector('.blur');
const rightContainer = document.querySelector('.right-container');
const limit = 100;

rightContainer.addEventListener('scroll', function () {
  // Kiểm tra nếu cuộn tới cuối của right-container
  if (
    rightContainer.scrollTop + rightContainer.clientHeight >=
    rightContainer.scrollHeight
  ) {
    blurElement.style.opacity = '0';
  } else {
    blurElement.style.opacity = '1';
  }
});

// Hàm riêng để call API
async function updateCourse(id, token, currentTime) {
  const body = currentTime
    ? JSON.stringify({ current_time: currentTime })
    : undefined;
  return fetch(
    `https://onlinecourse.up.railway.app/api/course/learning/update/${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body,
    }
  ).then((response) => response && response.json());
}

// Update current lesson to server
async function updateCurrentLesson(lessonID) {
  const targetAPI = `https://onlinecourse.up.railway.app/api/course/learning/java-the-complete-java-developer-course?id=${lessonID}`;
  try {
    const response = await fetch(targetAPI, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    if (!response.bodyUsed) {
      console.warn('No data returned from the API.');
      return;
    }
    const data = await response.json();
    console.log('API Response Data:', data);
    return data;
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

// NEED TO DO

//Handle back button on click
// const backButton = document.querySelectorAll('.left .back-btn');
// backButton.forEach((element) => {
//   element.addEventListener('click', function () {
//     console.log('click');
//   });
// });

// Check if the video is done send PUT request to server update done lesson
const video = document.querySelector('video');
video.ontimeupdate = (evt) => {
  if (video.duration === evt.target.currentTime) {
    console.log(video.duration);
    console.log(evt.target.currentTime);

    // Gọi hàm updateCourse với id tương ứng
    updateCourse(course_id, token);
  }
  currentTime = evt.target.currentTime;
};

let pauseStartTime = null;
let pauseCheckInterval = null;
let apiCalled = false;

// handle pause 10s automatically send PUT request to update current learning time
video.onpause = (evt) => {
  if (apiCalled) return;
  if (video.duration === evt.target.currentTime) return;
  if (current_lesson_isLearnded) return;

  pauseStartTime = new Date();
  const pauseTime = 10;

  pauseCheckInterval = setInterval(() => {
    const currentTime = new Date();
    const pauseDuration = (currentTime - pauseStartTime) / 1000;

    if (pauseDuration > pauseTime) {
      clearInterval(pauseCheckInterval);
      apiCalled = true;
      const formattedTime = formatTime(video.currentTime);
      updateCourse(course_id, token, formattedTime).then(() => {
        video.onplay = () => {
          apiCalled = false;
        };
      });
    }
  }, 1000);
};

video.onplay = () => {
  clearInterval(pauseCheckInterval);
  pauseCheckInterval = null;
  apiCalled = false;
};

function updatePanelItemBackground(total_lesson_done_of_course) {
  // console.log(total_lesson_done_of_course);
  const panelItems = document.querySelectorAll('.panel-item');
  panelItems.forEach((item) => {
    const itemId = Number(item.id);
    // console.log('itemId: ' + itemId);
    itemId <= total_lesson_done_of_course && item.classList.add('learned');
  });
}
