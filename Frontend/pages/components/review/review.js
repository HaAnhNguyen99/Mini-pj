document.getElementById('imageButton').addEventListener('click', function () {
  document.getElementById('imageInput').click();
});

document.getElementById('imageInput').addEventListener('change', function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      insertImageAtCursor(e.target.result);
    };
    reader.readAsDataURL(file);
  }
});

function insertImageAtCursor(imageSrc) {
  const img = document.createElement('img');
  img.src = imageSrc;

  const editor = document.getElementById('editor');
  const selection = window.getSelection();

  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    range.deleteContents();

    const node = range.createContextualFragment(img.outerHTML);
    range.insertNode(node);

    // Move the cursor after the inserted image
    range.setStartAfter(node);
    range.setEndAfter(node);
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

function execCmd(command, value = null) {
  document.execCommand(command, false, value);
}

document
  .getElementById('editor')
  .addEventListener('mousedown', function (event) {
    if (event.target.tagName === 'IMG') {
      const img = event.target;

      // Xác định xem có phải đang kéo để thay đổi kích thước hay không
      const isResizing =
        event.target === img &&
        event.offsetX >= img.clientWidth - 10 &&
        event.offsetY >= img.clientHeight - 10;

      if (isResizing) {
        // Setup resize handling
        const startX = event.clientX;
        const startY = event.clientY;
        const startWidth = img.clientWidth;
        const startHeight = img.clientHeight;
        const aspectRatio = startWidth / startHeight;

        function onMouseMove(e) {
          const deltaX = e.clientX - startX;
          const deltaY = e.clientY - startY;

          let newWidth, newHeight;
          if (event.shiftKey) {
            // Giữ tỷ lệ
            const delta = Math.max(deltaX, deltaY);
            newWidth = startWidth + delta;
            newHeight = newWidth / aspectRatio;
          } else {
            newWidth = startWidth + deltaX;
            newHeight = startHeight + deltaY;
          }

          img.style.width = `${Math.max(newWidth, 20)}px`; // Kích thước tối thiểu
          img.style.height = `${Math.max(newHeight, 20)}px`; // Kích thước tối thiểu
        }

        function onMouseUp() {
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        // Ngăn chặn lựa chọn văn bản khi kéo
        event.preventDefault();
      }
    }
  });
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('editor').focus();
});

// Focus editor when submit button is clicked
document.querySelector('.submit').addEventListener('click', function () {
  document.getElementById('editor').focus();
});

const API = {
  id: '3',
  price: 2999000,
  title: 'Lập trình C++ cơ bản, nâng cao',
  isRegister: false,
  decs: 'Khóa học lập trình C++ từ cơ bản tới nâng cao dành cho người mới bắt đầu. Mục tiêu của khóa học này nhằm giúp các bạn nắm được các khái niệm căn cơ của lập trình, giúp các bạn có nền tảng vững chắc để chinh phục con đường trở thành một lập trình viên.',
  target: [
    'Biết cách xây dựng giao diện web với HTML, CSS',
    'Biết cách phân tích giao diện website',
    'Biết cách làm giao diện web responsive',
    'Sở hữu 2 giao diện web khi học xong khóa học',
    'Làm chủ Flexbox khi dựng bố cục website',
  ],
  thumbnail:
    'https://res.cloudinary.com/dqnoopa0x/image/upload/v1723534318/w6km8a8dxmphrkelzgl5.jpg',
  require: [
    'Khi học nếu có khúc mắc hãy tham gia hỏi/đáp tại group FB: Học lập trình web (fullstack.edu.vn)',
    'Không được nóng vội, bình tĩnh học, làm bài tập sau mỗi bài học',
    'Ý thức tự học cao, trách nhiệm cao, kiên trì bền bỉ không ngại cái khó',
  ],
  chapter: [
    {
      id: 1,
      chapter_title: 'Bắt đầu',
      lessions: [
        {
          id: 1,
          lession_title: 'Bạn sẽ làm được gì sau khóa học?',
          duration: 195,
          isDone: false,
        },
        {
          id: 2,
          lession_title: 'Tìm hiểu về HTML, CSS',
          duration: 562,
          isDone: false,
        },
        {
          id: 3,
          lession_title: 'Cài đặt VS Code, Page Ruler extension',
          duration: 947,
          isDone: false,
        },
      ],
    },
  ],
  review: [
    {
      fullname: 'Nguyen Van A',
      content:
        'Khóa học rất thú vị và d�� học. Chắc chắn bạn s�� thành công trong lập trình web.',
      rating: 5,
      createdAt: '2023-06-10T14:30:00',
    },
    {
      fullname: 'Nguyen Van A',
      content:
        'Khóa học rất thú vị và d�� học. Chắc chắn bạn s�� thành công trong lập trình web.',
      rating: 5,
      createdAt: '2023-06-10T14:30:00',
    },
  ],
};
