function updatePlaceholder() {
  const inputElement = document.getElementById('search');
  if (window.innerWidth <= 600) {
    inputElement.placeholder = 'Tìm kiếm khoá học';
  } else {
    inputElement.placeholder = 'Tìm kiếm khoá học, bài viết, video, ...';
  }
}

// Gọi hàm khi tải trang
updatePlaceholder();

// Gọi hàm khi thay đổi kích thước màn hình
window.addEventListener('resize', updatePlaceholder);
