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
