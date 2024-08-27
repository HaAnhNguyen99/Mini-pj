// SHOW AND HIDE USE WHEN LOGIN
const btn_nav_links = document.querySelector('.nav-links');
const avt_User = document.querySelector('.Profile_user');

const currentUser = localStorage.getItem('user');

if (currentUser && btn_nav_links && avt_User) {
  btn_nav_links.classList.add('none');
  avt_User.classList.remove('none');
}

// Select the image element inside the Profile_user div
const profileImage = document.querySelector('.Profile_user');
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

// LOGOUT USER
const btnLogout = document.querySelector('#logout');

btnLogout.addEventListener('click', () => {
  window.location.href =
    'http://127.0.0.1:3000/Frontend/pages/Default/index.html';
  localStorage.removeItem('user');
});

// Debounce function to delay API call
function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}

// API request function
async function search(query) {
  try {
    const response = await fetch(
      `https://onlinecourse.up.railway.app/api/courses/search?keyword=${query}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

// Function to handle input change and trigger search
function handleSearch(event) {
  const searchValue = event.target.value.trim();
  document.querySelector('#clear-btn').style.display = 'block';
  if (searchValue) {
    search(searchValue).then((result) => {
      updateSearchResults(result);
    });
  } else {
    clearSearchResults();
  }
}

// Function to update the search result display
function updateSearchResults(results) {
  const searchResultContainer = document.getElementById(
    'search-result-container'
  );
  const accountItems = document.getElementById('account-items');
  const noResults = document.getElementById('no-results');

  accountItems.innerHTML = ''; // Clear previous results

  if (results.length > 0) {
    searchResultContainer.classList.remove('none');
    searchResultContainer.classList.add('visible');
    noResults.style.display = 'none';

    results.forEach((result) => {
      const accountItem = document.createElement('a');
      accountItem.href = `http://127.0.0.1:3000/Frontend/pages/Course_Detail/detail.html?slug=${result.slug}`;
      accountItem.className = 'account-item';

      // Create image element
      const img = document.createElement('img');
      img.src = result.thumbnail; // URL of the user's image
      img.alt = result.title; // Alt text for the image
      img.className = 'account-image'; // Add a class for styling if needed

      // Create name element
      const name = document.createElement('div');
      name.className = 'account-name';
      name.textContent = result.title; // The user's name

      // Append image and name to accountItem
      accountItem.appendChild(img);
      accountItem.appendChild(name);

      // Append accountItem to the accountItems container
      accountItems.appendChild(accountItem);
    });
  } else {
    searchResultContainer.style.display = 'block';
    noResults.style.display = 'block';
  }
}

// Function to clear search results
function clearSearchResults() {
  document.getElementById('account-items').innerHTML = '';
  document.getElementById('no-results').style.display = 'none';
  document.getElementById('search-result-container').classList.add('none');
  document
    .getElementById('search-result-container')
    .classList.remove('visible');
  document.querySelector('#clear-btn').style.display = 'none';
}

// Add event listeners
document
  .getElementById('search-input')
  .addEventListener('input', debounce(handleSearch, 500));

document.getElementById('clear-btn').addEventListener('click', function () {
  document.getElementById('search-input').value = '';
  clearSearchResults();
  document.getElementById('search-input').focus();
});

document.getElementById('search-input').addEventListener('focus', function () {
  const searchValue = this.value.trim();
  if (searchValue) {
    document.getElementById('search-result-container').classList.remove('none');
    document.getElementById('search-result-container').classList.add('visible');
  }
});

document.addEventListener('click', function (event) {
  const searchContainer = document.getElementById('search-container');
  if (!searchContainer.contains(event.target)) {
    document.getElementById('search-result-container').classList.add('none');
    document
      .getElementById('search-result-container')
      .classList.remove('visible');
  }
});

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1]; // Lấy phần payload (phần thứ 2)
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Chuyển đổi Base64Url thành Base64
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    ); // Giải mã Base64 thành chuỗi JSON

    return JSON.parse(jsonPayload); // Chuyển chuỗi JSON thành đối tượng JavaScript
  } catch (error) {
    console.error('Invalid token', error);
    return null;
  }
}

// Ví dụ sử dụng
const checkOutDecodedToken = () => {
  const token = localStorage.getItem('user'); // Giả sử `user` có chứa token
  const decodedToken = parseJwt(token);
  const date = new Date();
  if (decodedToken.exp < date.getTime() / 1000) {
    toast({
      title: 'Warning',
      message: 'Hết hạn đang nhập vuii lòng đăng nhập lại',
      type: 'warning',
      duration: 5000,
    });
    setTimeout(() => {
      window.location.href =
        'http://127.0.0.1:3000/Frontend/pages/Default/index.html';
      localStorage.removeItem('user');
    }, 4000);
  }
};
checkOutDecodedToken();

(async function getInfoUser() {
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
      // Handle picture change overlay toggle
      const pictureWrapper = document.querySelector('.Profile_user');
      if (pictureWrapper) {
        pictureWrapper.style.backgroundImage = `url(${userData.avatar})`;
      }
    }
  } catch (error) {
    console.error('Failed to fetch user info:', error.message);
  }
})();
