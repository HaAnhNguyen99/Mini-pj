document.addEventListener('DOMContentLoaded', function () {
  function loadComponent(component) {
    fetch(`../components/${component}/${component}.html`)
      .then((response) => response.text())
      .then((html) => {
        const container = document.querySelector(`#${component}`);
        const temp = document.createElement('template');
        temp.innerHTML = html;
        container.replaceWith(temp.content);
      })
      .catch((error) => {
        const right_content = document.querySelector('.right-content');
        content.innerHTML =
          '<p>Sorry, an error occurred while loading the content.</p>';
        console.log(error);
      });
  }

  function loadScript(component) {
    fetch(`../components/${component}/${component}.js`)
      .then((response) => {
        if (!response.ok) {
          return 404;
        }
        return response.text();
      })
      .then((js) => {
        if (!js || js === 404) {
          return;
        }
        const script = document.createElement('script');
        script.text = js;
        document.body?.appendChild(script);
      })
      .catch((error) => {});
  }

  function loadServices(service) {
    fetch(`../../services/${service}.js`)
      .then((response) => response.text())
      .then((js) => {
        const script = document.createElement('script');
        script.text = js;
        document.body?.appendChild(script);
      })
      .catch((error) => {});
  }

  // Loading components
  ['nav', 'sidebar', 'footer', 'review', 'Sign_In', 'Sign_Up'].forEach(
    (component) => {
      loadComponent(component);
      try {
        loadScript(component);
      } catch (e) {}
    }
  );

  // Loading services
  [
    'renderCourses',
    'env',
    'convertSeconds',
    'renderChapter',
    'renderTarget',
    'renderRequire',
  ].forEach((service) => {
    try {
      loadServices(service);
    } catch (e) {}
  });
});

(async function fetchCourses() {
  try {
    // Lấy toàn bộ URL hiện tại
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id');
    if (courseId) {
      // const API =
      //   'https://onlinecourse.up.railway.app/api/courses/get/the-complete-javascript-course';
      const API_CourseLink = `https://66b83ef23ce57325ac76b541.mockapi.io/courses/${courseId}`;
      // Bạn có thể sử dụng courseId để fetch dữ liệu hoặc xử lý khác ở đây
      const response = await fetch(API_CourseLink);
      const course = await response.json();
      const container = document.querySelector('.course-container');

      //render duration to layout
      const counts = renderChapter(container, course.chapter);
      let durationContainer = document.querySelectorAll('.duration');
      let duration = convertSeconds(counts.durationCount);
      durationContainer.forEach((x) => {
        x.textContent = duration.hours
          ? `${duration.hours} giờ ${
              duration.minutes >= 10 ? duration.minutes : `0${duration.minutes}`
            } phút`
          : `${duration.minutes} phút`;
      });

      //render lessions
      let lessionsContainer = document.querySelectorAll('.lessions');
      lessionsContainer.forEach((x) => {
        x.textContent = counts.lessionCount;
      });

      //render chapters
      let chapterContainer = document.querySelector('.chapters');
      chapterContainer.textContent = counts.chapterCount;

      //render target
      const targetContainer = document.querySelector('.content-details');
      renderTarget(targetContainer, course.target);

      //render descriptions
      const descriptionContainer = document.querySelector('p#course-desc');
      descriptionContainer.textContent = course.decs;

      //render title
      const titleContainer = document.querySelector('h1#course-title');
      titleContainer.textContent = course.title;

      //render price
      const priceContainer = document.querySelector('span#course-price');
      priceContainer.textContent =
        course.price > 0
          ? `${course.price.toLocaleString('vi-VN')}đ`
          : 'Miễn phí';

      //render img
      const imgContainer = document.querySelector('div#course-img');
      imgContainer.style.backgroundImage = `url(${course.thumbnail})`;

      //render required
      const requiredContainer = document.querySelector('div.require-items');
      console.log(requiredContainer);
      renderRequire(requiredContainer, course.require);

      /**
       * Handles the collapse/expand functionality for panel headers.
       * When a panel header is clicked, it toggles the 'collapse' class on the next sibling element,
       * which is assumed to be the panel content.
       */
      const headers = document.querySelectorAll('.panel-header');

      headers.forEach((header) => {
        header.addEventListener('click', () => {
          const panelContent = header.nextElementSibling; // Assuming .panel-body is the next sibling
          panelContent.classList.toggle('collapse');
        });
      });
    } else {
      console.log('Course ID not found in the URL');
    }
  } catch (error) {
    console.error('Error fetching courses:', error);
  }
})();

// payment

const API_Payment = {
  User_ID: 'number',
  Course_ID: 'number',
  token: 'string',
};

// User ID

const User_ID_API = {
  User_ID: 'number',
  Name: 'string',
  Email: 'string',
  Avatar: 'img link',
  token: 'string',
};
