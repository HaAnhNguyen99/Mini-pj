import { showLoader, hideLoader } from '../components/loader/loader.js';
document.addEventListener('DOMContentLoaded', function () {});

const title = document.querySelectorAll('#course-title');
const chapter = document.querySelector('#chapter');
const oldPrice = document.querySelector('.old-price');
const newPrice = document.querySelectorAll('.new-price');
const lessons = document.querySelector('#total-lessons');

const urlParams = new URLSearchParams(window.location.search);
const slug = urlParams.get('slug');

let courseID = null;
let coursePrice = null;
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

  ['footer', 'loader'].forEach((component) => {
    loadComponent(component);
    try {
      loadScript(component);
    } catch (e) {}
  });

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
(async function fetchCourses() {
  try {
    if (slug) {
      const loader = document.querySelector('#loader');
      const content = document.querySelector('main');
      showLoader();
      content.style.opacity = '0';
      const API_CourseLink = `https://onlinecourse.up.railway.app/api/courses/get/${slug}`;
      const response = await fetch(API_CourseLink);
      const course = await response.json();

      courseID = course.id;
      console.log(course.id);
      // total courses
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

      coursePrice = course.new_price;
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

const paymentbtn = document.querySelector('#paymentbtn');
paymentbtn.addEventListener('click', async (e) => {
  localStorage.setItem('course_id', courseID);
  const urlParams = new URLSearchParams(window.location.search);

  let token = localStorage.getItem('user');
  token = token.replace(/"/g, '');
  const API_VNPAY = `https://onlinecourse.up.railway.app/api/orders/vn-pay?amount=${coursePrice}`;

  try {
    const response = await fetch(API_VNPAY, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    window.location.href = `${data.paymentUrl}`;

    if (!response.ok) {
      throw new Error('Failed to fetch data from API');
    }
  } catch (error) {
    console.error('Error:', error);
  }
});
