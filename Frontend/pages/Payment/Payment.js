document.addEventListener('DOMContentLoaded', function () {});
import { showLoader, hideLoader } from '../components/loader/loader.js';

const title = document.querySelectorAll('#course-title');
const chapter = document.querySelector('#chapter');
const oldPrice = document.querySelector('.old-price');
const newPrice = document.querySelectorAll('.new-price');
const lessons = document.querySelector('#total-lessons');

const urlParams = new URLSearchParams(window.location.search);
const slug = urlParams.get('slug');

(async function fetchCourses() {
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
        // const right_content = document.querySelector('.right-content');
        // content.innerHTML =
        //   '<p>Sorry, an error occurred while loading the content.</p>';
        // console.log(error);
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
  ['nav', 'footer', 'logo', 'loader'].forEach((component) => {
    loadComponent(component);
    try {
      loadScript(component);
    } catch (e) {}
  });

  // Loading services
  [].forEach((service) => {
    try {
      loadServices(service);
    } catch (e) {}
  });

  try {
    if (slug) {
      const loader = document.querySelector('#loader');
      console.log(loader);
      const content = document.querySelector('main');
      showLoader();
      content.style.opacity = '0';
      const API_CourseLink = `https://onlinecourse.up.railway.app/api/courses/get/${slug}`;
      const response = await fetch(API_CourseLink);
      const course = await response.json();
      let totalCourse = 0;
      course.chapter.map((x) => {
        return (totalCourse += x.lessons.length);
      });
      lessons.textContent = totalCourse;

      title.forEach((title) => {
        title.textContent = course.title;
      });

      chapter.textContent = course.chapter.length;

      oldPrice.textContent = course.old_price
        ? `${course.old_price} đ`
        : 'Miễn phí';

      newPrice.forEach((price) => {
        price.textContent = `${Number(course.new_price).toLocaleString()} đ`;
      });
      content.style.opacity = '1';
      hideLoader();
    }
  } catch (error) {
    console.error('Error:', error);
  }
})();
