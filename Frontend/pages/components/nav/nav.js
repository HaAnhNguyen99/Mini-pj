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

// LOGOUT USER
const btnLogout = document.querySelector('#logout');

btnLogout.addEventListener('click', () => {
  localStorage.removeItem('user');
  location.reload();
  logoutUser();
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
    noResults.style.display = 'none';

    results.forEach((result) => {
      const accountItem = document.createElement('div');
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
  }
});

document.addEventListener('click', function (event) {
  const searchContainer = document.getElementById('search-container');
  if (!searchContainer.contains(event.target)) {
    document.getElementById('search-result-container').classList.add('none');
  }
});
