import { showLoader, hideLoader } from '../components/loader/loader.js';
const closeBtn = document.querySelector('.close-btn');
const mainContent = document.querySelector('.container');
const formGroups = document.querySelectorAll('.form-group');
const overlay = document.querySelector('#overlay');
const toggleOverlay = () => {
  overlay.classList.toggle('none');
  mainContent.classList.toggle('blur');
  formGroups.forEach((group) => group.classList.add('none'));
};
document.addEventListener('DOMContentLoaded', () => {
  // Load components
  const components = ['sidebar', 'footer'];
  components.forEach(loadComponent);

  // Handle overlay toggle
  if (closeBtn) {
    closeBtn.addEventListener('click', toggleOverlay);
  }

  // Handle file input
  const handleFileInput = (inputId, previewId) => {
    const fileInput = document.getElementById(inputId);
    if (fileInput) {
      fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            document.getElementById(previewId).src = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  handleFileInput('file-input', 'avatar-image');
  handleFileInput('file-input-preview', 'avatar-preview');

  // Helper functions
  function loadComponent(component) {
    return fetch(`../components/${component}/${component}.html`)
      .then((response) => response.text())
      .then((html) => {
        const container = document.getElementById(component);
        if (container) container.innerHTML = html;
      })
      .catch((error) => console.error(`Failed to load ${component}:`, error));
  }

  function loadScript(component) {
    return fetch(`../components/${component}/${component}.js`)
      .then((response) => (response.ok ? response.text() : null))
      .then((js) => {
        if (js) {
          const script = document.createElement('script');
          script.text = js;
          document.body.appendChild(script);
        }
      })
      .catch((error) =>
        console.error(`Failed to load script for ${component}:`, error)
      );
  }
<<<<<<< Updated upstream
});

// GET INFORMATION USER
async function getInfoUser() {
  let token = localStorage.getItem('user');
  if (token) {
    token = token.replace(/\\\"/g, ''); // Remove backslashes
    token = token.replace(/\"/g, ''); // Remove double quotes
  }
  const url = 'https://onlinecourse.up.railway.app/api/users/my-info';
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Add Bearer token here
      },
    });
    if (!response.ok) {
      throw new Error(`Have error ${response.status}`);
    }
    const data = await response.json();
    let userData = data; // Lưu dữ liệu người dùng vào biến userData
=======

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
const form_group = document.querySelectorAll('.form-group');
const main_content = document.querySelector('.container');

wrapper.forEach((element) => {
  element.addEventListener('click', (e) => {
    overlay.classList.toggle('none');
    main_content.classList.toggle('blur');
    form_group.forEach((group) => {
      group.classList.add('none');
    });
  });
});

close_btn.addEventListener('click', (e) => {
  overlay.classList.toggle('none');
  main_content.classList.toggle('blur');
});
>>>>>>> Stashed changes

    if (data) {
      const infor_user_container = document.querySelector(
        '#infor_user_container'
      );
      let html = `
        <div class="profile-wrapper">
            <div class="profile-background">
              <div class="profile-info">
                <div class="avatar-upload" id="picture-wrapper">
                  <div class="avatar-preview">
                    <img
                      id="avatar-preview"
                      src=${data.avatar}
                      alt="Avatar" />
                  </div>
                  <input
                    type="file"
                    id="file-input-preview"
                    accept="image/*"
                    style="display: none" />
                </div>
                <div class="name">
                  <h1>${data.full_name}</h1>
                </div>
              </div>
            </div>
          </div>
          <div class="profile-details">
            <div class="header">
              <h2>Thông tin cá nhân</h2>
              <p>Quản lý thông tin cá nhân của bạn</p>
            </div>
            <div class="contents">
              <div class="wrapper" id="name-wrapper">
                <div class="left">
                  <h4>Họ và tên</h4>
                  <p id="name-display">${data.full_name}</p>
                </div>
                <button>
                  <img
                    src="../../assets/icons/arrow_right.svg"
                    alt="Edit Button" />
                </button>
              </div>
              <div class="email" disabled>
                <div class="left">
                  <h4>Email</h4>
                  <p id="email-display">${data.email}</p>
                </div>
              </div>
            </div>
          </div>
      
      `;
      infor_user_container.innerHTML = html;
    }

<<<<<<< Updated upstream
    // Re-select elements after they are added to DOM
    const nameWrapper = document.querySelector('#name-wrapper');
    const pictureWrapper = document.querySelector('#picture-wrapper');

    if (nameWrapper) {
      nameWrapper.addEventListener('click', () => {
        toggleOverlay();
        document.getElementById('name-group').classList.remove('none');
        document.getElementById('name').value = userData.full_name;
      });
    }

    if (pictureWrapper) {
      pictureWrapper.addEventListener('click', () => {
        toggleOverlay();
        document.getElementById('picture-group').classList.remove('none');
        document.getElementById('avatar-image').src = userData.avatar;
      });
    }
  } catch (error) {
    console.error('Registration failed:', error.message);
  }
}

getInfoUser();
=======
email.addEventListener('click', () => {
  title.textContent = 'Cập nhật email của bạn';
  desc.textContent =
    'Vui lòng nhập email mới để đăng nhập vào hộp thư. Tên email của bạn sẽ được hiển thị trên trang cá nhân, đăng nhập và đăng ký khoá học';
  email_container.classList.toggle('none');
});

picture.addEventListener('click', (e) => {
  e.preventDefault();
  picture_container.classList.toggle('none');
});

const upload_btn = document.querySelector('button#btn_upload');
const avatar_container = document.querySelector('.avatar-preview');
avatar_container.addEventListener('click', (e) => {
  document.getElementById('file-input').click();
});
upload_btn.addEventListener('click', function () {
  document.getElementById('file-input').click();
});

document
  .getElementById('file-input')
  .addEventListener('change', function (event) {
    const file = event.target.files[0]; // Lấy file người dùng chọn

    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        document.getElementById('avatar-image').src = e.target.result; // Cập nhật ảnh hiển thị
      };

      reader.readAsDataURL(file); // Đọc file và trả về URL
    }
  });
>>>>>>> Stashed changes
