import { showLoader, hideLoader } from '../components/loader/loader.js';

const closeBtn = document.querySelector('.close-btn');
const mainContent = document.querySelector('.container');
const formGroups = document.querySelectorAll('.form-group');
const overlay = document.querySelector('#overlay');
let userData = null; // Declare globally

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

  // Handle file input preview
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

  // Ensure the change image form is hidden on page load
  const pictureGroup = document.getElementById('picture-group');
  if (pictureGroup) {
    pictureGroup.classList.add('none');
  }

  // Initial loading of user information
  getInfoUser();
});
const profileForm = document.querySelector('#profile-form');
if (profileForm) {
  profileForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Tạo FormData object để chứa dữ liệu cần cập nhật
    const formData = new FormData();

    // Kiểm tra xem trường name có đang hiển thị và có thay đổi không
    const nameGroup = document.getElementById('name-group');
    const nameInput = document.getElementById('name');
    if (
      !nameGroup.classList.contains('none') &&
      nameInput &&
      nameInput.value !== userData.full_name
    ) {
      formData.append('full_name', nameInput.value);
    }

    // Kiểm tra xem trường avatar có đang hiển thị và có file được chọn không
    const pictureGroup = document.getElementById('picture-group');
    const fileInput = document.getElementById('file-input');

    if (
      !pictureGroup.classList.contains('none') &&
      fileInput &&
      fileInput.files.length > 0
    ) {
      formData.append('image', fileInput.files[0]); // Chỉ lấy file đầu tiên
    }

    // Chỉ gửi dữ liệu nếu có trường hợp cần cập nhật
    if (formData.has('full_name') || formData.has('image')) {
      // Gọi hàm updateInfor để gửi yêu cầu cập nhật
      await updateInfor(formData);

      // Sau khi cập nhật thành công, cập nhật thông tin trên trang
      await getInfoUser();

      // Ẩn overlay sau khi cập nhật
      toggleOverlay();
    }
  });
}

const updateInfor = async (formValue) => {
  let token = localStorage.getItem('user');
  if (token) {
    token = token.replace(/\\\"/g, '').replace(/\"/g, ''); // Clean token
  }
  const url = 'https://onlinecourse.up.railway.app/api/users/update-profile';
  try {
    const response = await fetch(url, {
      method: 'PUT',
      body: formValue,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Failed to fetch user info:', error.message);
  } // Assign userData
};

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

// GET INFORMATION USER
async function getInfoUser() {
  let token = localStorage.getItem('user');
  if (token) {
    token = token.replace(/\\\"/g, '').replace(/\"/g, ''); // Clean token
  }
  const url = 'https://onlinecourse.up.railway.app/api/users/my-info';
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }
    const data = await response.json();
    userData = data; // Assign userData

    if (data) {
      const inforUserContainer = document.querySelector(
        '#infor_user_container'
      );
      let html = `
        <div class="profile-wrapper">
            <div class="profile-background">
              <div class="profile-info">
                <div class="avatar-upload" id="picture-wrapper">
                  <div class="avatar-preview">
                    <img id="avatar-preview" src="${data.avatar}" alt="Avatar" />
                  </div>
                  <input type="file" id="file-input-preview" accept="image/*" style="display: none" />
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
                  <img src="../../assets/icons/arrow_right.svg" alt="Edit Button" />
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
      inforUserContainer.innerHTML = html;

      // Handle name edit overlay toggle
      const nameWrapper = document.querySelector('#name-wrapper');
      if (nameWrapper) {
        nameWrapper.addEventListener('click', () => {
          toggleOverlay();
          document.getElementById('name-group').classList.remove('none');
          document.getElementById('name').value = userData.full_name;
        });
      }

      // Handle picture change overlay toggle
      const pictureWrapper = document.querySelector('#picture-wrapper');
      if (pictureWrapper) {
        pictureWrapper.addEventListener('click', () => {
          toggleOverlay();
          document.getElementById('picture-group').classList.remove('none');
          document.getElementById('avatar-image').src = userData.avatar;
        });
      }
    }
  } catch (error) {
    console.error('Failed to fetch user info:', error.message);
  }
}
getInfoUser();
