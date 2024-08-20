import { showLoader, hideLoader } from '../components/loader/loader.js';
const detailAPI = `https://onlinecourse.up.railway.app/api/courses/get`;
// Lấy toàn bộ URL hiện tại
const urlParams = new URLSearchParams(window.location.search);
const slug = urlParams.get('slug');
const content = document.querySelector('.course-content');

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

  ['sidebar', 'footer'].forEach((component) => {
    loadComponent(component);
    try {
      loadScript(component);
    } catch (e) {}
  });
});
const wrapper = document.querySelectorAll('.wrapper');
const close_btn = document.querySelector('.close-btn');
const overlay = document.querySelector('#tv');
const name = document.querySelector('#name-wrapper');
const email = document.querySelector('#email-wrapper');
const picture = document.querySelector('#picture-wrapper');
const title = document.querySelector('.overlay-content .title h2');
const desc = document.querySelector('.overlay-content .title p');
const email_container = document.querySelector('.form-group.email');
const name_container = document.querySelector('.form-group.name');
const picture_container = document.querySelector('.form-group.picture');

wrapper.forEach((element) => {
  element.addEventListener('click', (e) => {
    overlay.classList.toggle('none');
    name_container.classList.add('none');
    picture_container.classList.add('none');
    email_container.classList.add('none');
  });
});

close_btn.addEventListener('click', (e) => {
  overlay.classList.toggle('none');
});

name.addEventListener('click', (e) => {
  e.preventDefault();
  name_container.classList.toggle('none');
});

email.addEventListener('click', () => {
  console.log(true);
  title.textContent = 'Cập nhật email của bạn';
  desc.textContent =
    'Vui lòng nhập email mới để đăng nhập vào hộp thư. Tên email của bạn sẽ được hiển thị trên trang cá nhân, đăng nhập và đăng ký khoá học';
  console.log(email_container);
  email_container.classList.toggle('none');
});

picture.addEventListener('click', (e) => {
  e.preventDefault();
  picture_container.classList.toggle('none');
});
