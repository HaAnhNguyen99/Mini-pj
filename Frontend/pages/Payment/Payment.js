import { showLoader, hideLoader } from '../components/loader/loader.js';
document.addEventListener('DOMContentLoaded', function () {});

const title = document.querySelectorAll('#course-title');
const chapter = document.querySelector('#chapter');
const oldPrice = document.querySelector('.old-price');
const newPrice = document.querySelectorAll('.new-price');
const lessons = document.querySelector('#total-lessons');

const urlParams = new URLSearchParams(window.location.search);
const slug = urlParams.get('slug');
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
  const urlParams = new URLSearchParams(window.location.search);
  const vnp_PayUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
  const vnp_ReturnUrl = 'http://localhost:/TechWorld/payment_info';
  const vnp_TmnCode = 'HUWJVPVM';
  const secretKey = 'JTQDOZVNOADCXAQDJTKVQDJXOPTJTPLF';
  const vnp_ApiUrl =
    'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction';
  const vnp_Version = '2.1.0';
  const vnp_Command = 'pay';

  const API_VNPAY = `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=${coursePrice}&vnp_Command=pay&vnp_CreateDate=20210801153333&vnp_CurrCode=VND&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh+toan+don+hang+%3A5&vnp_OrderType=other&vnp_ReturnUrl=https%3A%2F%2Fdomainmerchant.vn%2FReturnUrl&vnp_TmnCode=DEMOV210&vnp_TxnRef=5&vnp_Version=2.1.0&vnp_SecureHash=3e0d61a0c0534b2e36680b3f7277743e8784cc4e1d68fa7d276e79c23be7d6318d338b477910a27992f5057bb1582bd44bd82ae8009ffaf6d141219218625c42`;
  const response = await fetch(API_VNPAY);
  const data = await response.json();
  console.log(data);
  window.location.href = `${API_VNPAY}`;
});
