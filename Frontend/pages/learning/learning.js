import { showLoader, hideLoader } from '../components/loader/loader.js';
const baseAPI = `https://onlinecourse.up.railway.app/api/courses/get`;
const content = document.querySelector('.container');
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
      console.log(API_CourseLink);
      const response = await fetch(API_CourseLink);
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
      const selectCourse = document.querySelector('.panel-item');
      selectCourse.addEventListener('click', () => {});

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
