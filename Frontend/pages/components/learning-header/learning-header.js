const learned_lessons = document.querySelector('#learned-lessons');
const unfinished_lessons = document.querySelector('#unfinished-Lessons');
const home_btn = document.querySelector('#btn-home');
// Lấy toàn bộ URL hiện tại
const urlParams = new URLSearchParams(window.location.search);
const slug = urlParams.get('slug');
home_btn.addEventListener('click', function () {
  window.location.href = `http://127.0.0.1:3000/Frontend/pages/Course_Detail/detail.html?slug=${slug}`;
});
