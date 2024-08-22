import { showLoader, hideLoader } from '../components/loader/loader.js';

const closeBtn = document.querySelector('.close-btn');
const mainContent = document.querySelector('.container');
const formGroups = document.querySelectorAll('.form-group');
const overlay = document.querySelector('#overlay');
const profileForm = document.querySelector('#profile-form');
const pictureGroup = document.getElementById('picture-group');
const nameGroup = document.getElementById('name-group');
const nameInput = document.getElementById('name');
const fileInput = document.getElementById('file-input');
const avatarPreview = document.getElementById('avatar-preview');
const fileInputPreview = document.getElementById('file-input-preview');
let userData = null; // Declare globally

const toggleOverlay = () => {
  overlay.classList.toggle('none');
  mainContent.classList.toggle('blur');
  formGroups.forEach((group) => group.classList.toggle('none'));
};

const handleFileInput = (inputId, previewId) => {
  const fileInput = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  if (fileInput) {
    fileInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          preview.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }
};

const loadComponent = async (component) => {
  try {
    const response = await fetch(
      `../components/${component}/${component}.html`
    );
    const html = await response.text();
    const container = document.getElementById(component);
    if (container) container.innerHTML = html;
  } catch (error) {
    console.error(`Failed to load ${component}:`, error);
  }
};

const loadScript = async (component) => {
  try {
    const response = await fetch(`../components/${component}/${component}.js`);
    const js = response.ok ? await response.text() : null;
    if (js) {
      const script = document.createElement('script');
      script.text = js;
      document.body.appendChild(script);
    }
  } catch (error) {
    console.error(`Failed to load script for ${component}:`, error);
  }
};

const getInfoUser = async () => {
  const token = localStorage
    .getItem('user')
    ?.replace(/\\\"/g, '')
    .replace(/\"/g, '');
  const url = 'https://onlinecourse.up.railway.app/api/users/my-info';
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    userData = await response.json();
    if (userData) {
      updateUserProfile();

      ['sidebar', 'footer'].forEach((component) => {
        loadComponent(component);
        try {
          loadScript(component);
        } catch (e) {}
      });
    }
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
    console.error('Failed to fetch user info:', error.message);
  }
};

const updateUserProfile = () => {
  const inforUserContainer = document.querySelector('#infor_user_container');
  if (inforUserContainer) {
    inforUserContainer.innerHTML = `
      <div class="profile-wrapper">
        <div class="profile-background">
          <div class="profile-info">
            <div class="avatar-upload" id="picture-wrapper">
              <div class="avatar-preview">
                <img id="avatar-preview" src="${userData.avatar}" alt="Avatar" />
              </div>
              <input type="file" id="file-input-preview" accept="image/*" style="display: none" />
            </div>
            <div class="name">
              <h1>${userData.full_name}</h1>
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
              <p id="name-display">${userData.full_name}</p>
            </div>
            <button>
              <img src="../../assets/icons/arrow_right.svg" alt="Edit Button" />
            </button>
          </div>
          <div class="email" disabled>
            <div class="left">
              <h4>Email</h4>
              <p id="email-display">${userData.email}</p>
            </div>
          </div>
        </div>
      </div>
    `;
    document.querySelector('#name-wrapper').addEventListener('click', () => {
      toggleOverlay();
      nameGroup.classList.remove('none');
      nameInput.value = userData.full_name;
    });
    document.querySelector('#picture-wrapper').addEventListener('click', () => {
      toggleOverlay();
      pictureGroup.classList.remove('none');
      avatarPreview.src = userData.avatar;
    });
  }
};

const updateInfor = async (formData) => {
  const token = localStorage
    .getItem('user')
    ?.replace(/\\\"/g, '')
    .replace(/\"/g, '');
  const url = 'https://onlinecourse.up.railway.app/api/users/update-profile';
  try {
    const response = await fetch(url, {
      method: 'PUT',
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    console.log(await response.json());
  } catch (error) {
    console.error('Failed to update user info:', error.message);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const components = ['sidebar', 'footer'];
  components.forEach(loadComponent);
  if (closeBtn) closeBtn.addEventListener('click', toggleOverlay);
  handleFileInput('file-input', 'avatar-image');
  handleFileInput('file-input-preview', 'avatar-preview');
  if (pictureGroup) pictureGroup.classList.add('none');
  getInfoUser();
});

if (profileForm) {
  profileForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData();
    if (
      !nameGroup.classList.contains('none') &&
      nameInput &&
      nameInput.value !== userData.full_name
    ) {
      formData.append('full_name', nameInput.value);
    }
    if (
      !pictureGroup.classList.contains('none') &&
      fileInput &&
      fileInput.files.length > 0
    ) {
      formData.append('avatar', fileInput.files[0]);
    }
    if (formData.has('full_name') || formData.has('avatar')) {
      await updateInfor(formData);
      await getInfoUser();
      toggleOverlay();
    }
  });
}
