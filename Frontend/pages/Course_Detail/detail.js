import { showLoader, hideLoader } from '../components/loader/loader.js';
const detailAPI = `https://onlinecourse.up.railway.app/api/courses/get`;

// Lấy toàn bộ URL hiện tại
const urlParams = new URLSearchParams(window.location.search);
const slug = urlParams.get('slug');
const content = document.querySelector('.course-content');

document.addEventListener('DOMContentLoaded', function () {
  async function initializeComponents() {
    const components = [
      'nav',
      'sidebar',
      'footer',
      'review',
      'Sign_In',
      'Sign_Up',
      'loader',
      'btnBack',
      'toastMessage',
    ];

    for (const component of components) {
      await loadComponent(component);
      await loadScript(component);
    }
  }

  async function initializeServices() {
    const services = [
      'convertSeconds',
      'renderChapter',
      'renderTarget',
      'renderRequire',
      'env',
    ];

    for (const service of services) {
      await loadServices(service);
    }
  }

  // Initialize components and services
  initializeComponents()
    .then(() => initializeServices())
    .then(fetchCourses)
    .then(() => {
      // Add event listeners after everything is loaded
      const registerButton = document.querySelector('#registerCourse');
      if (registerButton) {
        registerButton.addEventListener('click', function () {
          window.location.href = `${baseUrl}Frontend/pages/Payment/Payment.html?slug=${slug}`;
        });
      } else {
        console.error('Register course button not found.');
      }
    })
    .catch((error) => console.error('Initialization failed:', error));
});

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

async function fetchCourses() {
  try {
    if (slug) {
      showLoader();
      content.style.opacity = '0';
      const API_CourseLink = `${detailAPI}/${slug}`;
      const response = await fetch(API_CourseLink);
      const course = await response.json();
      const container = document.querySelector('.course-container');

      // Render duration to layout
      const counts = renderChapter(container, course.chapter);

      let durationContainer = document.querySelectorAll('.duration');
      let duration = counts.durationCount;
      durationContainer.forEach((x) => {
        x.textContent = duration;
      });

      // Render lessons
      let lessonsContainer = document.querySelectorAll('.lessons');
      lessonsContainer.forEach((x) => {
        x.textContent = counts.lessionCount;
      });

      // Render chapters
      let chapterContainer = document.querySelector('.chapters');
      chapterContainer.textContent = counts.chapterCount;

      // Render target
      const targetContainer = document.querySelector('.content-details');
      renderTarget(targetContainer, course.target);

      // Render descriptions
      const descriptionContainer = document.querySelector('p#course-desc');
      descriptionContainer.textContent = course.decs;

      // Render title
      const titleContainer = document.querySelector('h1#course-title');
      titleContainer.textContent = course.title;

      // Render price
      const priceContainer = document.querySelector('span#course-price');
      priceContainer.textContent =
        course.new_price > 0
          ? `${course.new_price.toLocaleString('vi-VN')}đ`
          : 'Miễn phí';

      // Render image
      const imgContainer = document.querySelector('div#course-img');
      imgContainer.style.backgroundImage = `url(${course.thumbnail})`;

      // Render required
      const requiredContainer = document.querySelector('div.require-items');
      renderRequire(requiredContainer, course.require);

      // Handles the collapse/expand functionality for panel headers
      const headers = document.querySelectorAll('.panel-header');
      headers.forEach((header) => {
        header.addEventListener('click', () => {
          const panelContent = header.nextElementSibling;
          panelContent.classList.toggle('collapse');
        });
      });

      hideLoader();

      content.style.opacity = '1';
      content.classList.toggle('none');
    } else {
      console.log('Course ID not found in the URL');
    }
    hideLoader();
  } catch (error) {
    console.error('Error fetching courses:', error);
  }
}
