import { showLoader, hideLoader } from '../components/loader/loader.js';
const baseAPI = `https://onlinecourse.up.railway.app/api/course/learning`;
const content = document.querySelector('.container');
// Get token form local storage
let token = localStorage.getItem('user');
token = token.replace(/"/g, '');
console.log(token);

// Lấy toàn bộ URL hiện tại
const urlParams = new URLSearchParams(window.location.search);
const slug = urlParams.get('slug');

document.addEventListener('DOMContentLoaded', function () {
  async function initializeComponents() {
    const components = ['learning_bottom', 'learning-header'];

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
      console.log(course);
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

      // Handle on click event for select course
      const panelItems = document.querySelectorAll('.panel-item');

      panelItems.forEach((item) => {
        item.addEventListener('click', async function () {
          const id = this.id;
          await updateCourse(id, token);
        });
      });

      // handle change background color for panelItems
      updatePanelItemBackground(course.total_lesson_done_of_course);

      // render
      content.style.opacity = '1';
      content.classList.toggle('none');
      const learned_courses = document.querySelector('#learned-lessons');
      const total_courses = document.querySelector('#unfinished-Lessons');
      const progress = document.querySelector('.progress-percent');
      const progressCircle = document.querySelector('.progress-circle');

      const percent = Number(course.average_lesson);
      progressCircle.style.background = `conic-gradient(#f56545 ${percent}%, #4e4e4e 0%)`;
      progress.textContent = percent + '%';
      total_courses.textContent = course.total_lesson_of_course;
      learned_courses.textContent = course.total_lesson_done_of_course;

      // handle button next/back lesson
      const prevButton = document.querySelector('#prev-lesson');
      const nextButton = document.querySelector('#next-lesson');

      console.log('lesson_current: ' + course.lesson_current);

      // render video source
      let source = document.querySelector('source');
      source.src = course.lesson_url;
      console.log(document.querySelector('source'));
      const videoElement = document.querySelector('video');
      console.log(videoElement);
      videoElement.load();

      if (course.lesson_current === 1) {
        prevButton.disabled = true;
      } else if (course.lesson_current === course.total_lesson_of_course) {
        nextButton.disabled = true;
      }

      const currentLesson = parseInt(course.lesson_current);
      prevButton.addEventListener('click', () => {
        updateCourse(currentLesson - 1, token);
      });

      nextButton.addEventListener('click', () => {
        updateCourse(currentLesson + 1, token);
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
  // console.log(typeof rightContainer.scrollHeight);
  if (
    rightContainer.scrollTop + rightContainer.clientHeight >=
    rightContainer.scrollHeight
  ) {
    blurElement.style.opacity = '0';
  } else {
    blurElement.style.opacity = '1';
  }
});

const video = document.querySelector('video');

// Hàm riêng để call API
async function updateCourse(id, token) {
  console.log('id_clicked_lesson: ' + id);
  fetch(
    `https://onlinecourse.up.railway.app/api/course/learning/update/${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        courseId: id,
      }),
    }
  )
    .then((response) => response.json())
    .then((data) => {
      console.log('API response:', data);

      // Xử lý phản hồi từ API
      // window.location.reload();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

// Check if the video is done
video.ontimeupdate = (evt) => {
  if (video.duration === evt.target.currentTime) {
    console.log(video.duration);
    console.log(evt.target.currentTime);

    // Gọi hàm updateCourse với id tương ứng
    updateCourse(slug, token);
  }
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
