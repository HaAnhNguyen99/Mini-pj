function updatePlaceholder() {
  const inputElement = document.querySelector('.search input#search');
  if (window.innerWidth <= 600) {
    inputElement.placeholder = 'Tìm kiếm...';
  } else {
    inputElement.placeholder = 'Tìm kiếm khoá học, bài viết, video, ...';
  }
}

// Gọi hàm khi thay đổi kích thước màn hình
window.addEventListener('resize', updatePlaceholder);

// SHOW AND HIDE USE WHEN LOGIN
const btn_nav_links = document.querySelector('.nav-links');
const avt_User = document.querySelector('.Profile_user');

const currentUser = localStorage.getItem('user');

if (currentUser && btn_nav_links && avt_User) {
  btn_nav_links.classList.add('none');
  avt_User.classList.remove('none');
}

// Select the image element inside the Profile_user div
const profileImage = document.querySelector('.Profile_user img');
// Select the slide element
const slide = document.querySelector('.slide');

// Add click event listener to the image
profileImage.addEventListener('click', function (event) {
  event.preventDefault(); // Prevent default behavior if needed
  // Toggle the 'active' class on the slide
  slide.classList.toggle('active');
});

document.addEventListener('click', function (event) {
  const isClickInside =
    slide.contains(event.target) || profileImage.contains(event.target);

  if (!isClickInside) {
    slide.classList.remove('active');
  }
});
