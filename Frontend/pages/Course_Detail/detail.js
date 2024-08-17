const detailAPI = `https://onlinecourse.up.railway.app/api/courses/get`;
document.addEventListener('DOMContentLoaded', function () {
  // Loading components
  function loadComponent(component) {
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

  function loadScript(component) {
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

  ['nav', 'sidebar', 'footer', 'review', 'Sign_In', 'Sign_Up'].forEach(
    (component) => {
      loadComponent(component);
      try {
        loadScript(component);
      } catch (e) {}
    }
  );

  // Loading services
  function loadServices(service) {
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

  [
    'convertSeconds',
    'renderChapter',
    'renderTarget',
    'renderRequire',
    'env',
  ].forEach((service) => {
    try {
      loadServices(service);
    } catch (e) {}
  });
});

// Lấy toàn bộ URL hiện tại
const urlParams = new URLSearchParams(window.location.search);
const slug = urlParams.get('slug');

(async function fetchCourses() {
  try {
    if (slug) {
      const API_CourseLink = `${detailAPI}/${slug}`;
      // const API_CourseLink = `https://66b83ef23ce57325ac76b541.mockapi.io/courses/${courseId}`;
      const response = await fetch(API_CourseLink);
      const course = await response.json();
      const container = document.querySelector('.course-container');

      //render duration to layout
      const counts = renderChapter(container, course.chapter);

      let durationContainer = document.querySelectorAll('.duration');
      let duration = counts.durationCount;
      durationContainer.forEach((x) => {
        x.textContent = duration;
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
        course.new_price > 0
          ? `${course.new_price.toLocaleString('vi-VN')}đ`
          : 'Miễn phí';

      //render img
      const imgContainer = document.querySelector('div#course-img');
      imgContainer.style.backgroundImage = `url(${course.thumbnail})`;

      //render required
      const requiredContainer = document.querySelector('div.require-items');
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

//navigate button "Đăng ký"
document
  .querySelector('#registerCourse')
  .addEventListener('click', function () {
    window.location.href = `${baseUrl}Frontend/pages/Payment/Payment.html?slug=${slug}`;
  });

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
