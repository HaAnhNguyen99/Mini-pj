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
