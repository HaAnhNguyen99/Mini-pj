import { showLoader, hideLoader } from '../components/loader/loader.js';
const baseAPI = `https://onlinecourse.up.railway.app/api/courses/get`;

// Lấy toàn bộ URL hiện tại
const urlParams = new URLSearchParams(window.location.search);
const slug = urlParams.get('slug');

document.addEventListener('DOMContentLoaded', function () {
  async function initializeComponents() {
    const components = ['learning_bottom', 'footer', 'learning-header'];

    for (const component of components) {
      await loadComponent(component);
      await loadScript(component);
    }
  }

  async function initializeServices() {
    const services = ['renderChapter', 'env'];

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
    console.log(slug);
    if (slug) {
      content.style.opacity = '0';
      const API_CourseLink = `${detailAPI}/${slug}`;
      const response = await fetch(API_CourseLink);
      const course = await response.json();
      console.log(course);
      const container = document.querySelector('.content');

      // Render duration to layout
      const counts = renderChapter(container, course.chapter);

      let durationContainer = document.querySelectorAll('.duration');
      let duration = counts.durationCount;
      durationContainer.forEach((x) => {
        x.textContent = duration;
      });

      // Handles the collapse/expand functionality for panel headers
      const headers = document.querySelectorAll('.panel-header');
      headers.forEach((header) => {
        header.addEventListener('click', () => {
          const panelContent = header.nextElementSibling;
          panelContent.classList.toggle('collapse');
        });
      });

      content.style.opacity = '1';
      content.classList.toggle('none');
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
