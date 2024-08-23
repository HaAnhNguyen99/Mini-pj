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
async function getReviews() {
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug');
  let token = localStorage.getItem('user');
  if (token) {
    token = token.replace(/\\\"/g, '').replace(/\"/g, ''); // Clean token
  }
  const url = 'https://onlinecourse.up.railway.app/api/reviews/get-all';
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
    }
    const data = await response.json();
    if (data) {
    }
  } catch (error) {
    console.error('Registration failed:', error.message);
  }
}
getReviews();
const btnReview = document.querySelector('.submit_review');
const inputReview = document.querySelector('.wysiwyg-editor');
const btnSubmitReview = document.querySelector('.avatar_user');
const btnCancel = document.querySelector('.cancel');

const btnReport = document.querySelector('.btnReport');
const btnDelete = document.querySelector('#btnDelete');

function toggleShowReview(btnReview, inputReview, btnSubmitReview, btnCancel) {
  btnReview.addEventListener('click', () => {
    btnSubmitReview.classList.add('none');
    inputReview.classList.remove('none');
  });
  btnCancel.addEventListener('click', () => {
    btnSubmitReview.classList.remove('none');
    inputReview.classList.add('none');
  });
}
toggleShowReview(btnReview, inputReview, btnSubmitReview, btnCancel);

function toggleShowReport(btnReport, btnDelete) {
  btnReport.addEventListener('click', () => {
    btnDelete.classList.remove('none');
  });
  btnCancel.addEventListener('click', () => {
    btnSubmitReview.classList.remove('none');
    inputReview.classList.add('none');
  });
  document.addEventListener('click', (event) => {
    if (
      !btnReport.contains(event.target) &&
      !btnDelete.contains(event.target)
    ) {
      btnDelete.classList.add('none');
    }
  });
}
toggleShowReport(btnReport, btnDelete);
// Focus editor when submit button is clicked
document.querySelector('.submit').addEventListener('click', function () {
  document.getElementById('editor').focus();
});
