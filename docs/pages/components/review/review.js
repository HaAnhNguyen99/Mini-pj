let isNewestFirst = true; // Default to sorting by newest first

// Sort by newest/oldest
document.querySelector('.sort_btn').addEventListener('click', () => {
  isNewestFirst = !isNewestFirst;
  const sortText = isNewestFirst ? 'Mới Nhất' : 'Cũ Nhất';
  document.querySelector('.sort_btn span').textContent = sortText;
  getReviews();
});

let selectedRating = null; // Store the currently selected star rating for filtering

document.querySelectorAll('filter_star').forEach((star) => {
  star.addEventListener('click', (event) => {
    const selectedValue = parseInt(event.target.getAttribute('data-value'));

    // Reset tất cả các ngôi sao về màu mặc định
    document.querySelectorAll('.star-rating .star').forEach((star) => {
      star.style.color = '#CCCCCC'; // Màu mặc định cho các ngôi sao chưa chọn
    });

    // Đổi màu cho các ngôi sao từ 1 đến giá trị được chọn
    for (let i = 1; i <= selectedValue; i++) {
      const start = document.querySelector(`.star[data-value="${i}"]`);
      start.style.color = '#ee4d2d'; // Màu cho các ngôi sao đã chọn
    }
  });
});

// Thêm màu cho sao đã chọn
document.querySelectorAll('.filter_star').forEach((star) => {
  star.addEventListener('click', (e) => {
    const selectedValue = parseInt(event.target.getAttribute('data-value'));

    // Reset tất cả các ngôi sao về màu mặc định
    document.querySelectorAll('.filter_star').forEach((star) => {
      star.style.color = '#CCCCCC'; // Màu mặc định cho các ngôi sao chưa chọn
    });

    // Đổi màu cho các ngôi sao từ 1 đến giá trị được chọn
    for (let i = 1; i <= selectedValue; i++) {
      const start = document.querySelector(`.filter_star[data-value="${i}"]`);

      start.style.color = '#ee4d2d'; // Màu cho các ngôi sao đã chọn
    }

    const rating = parseInt(e.target.getAttribute('data-value'));

    // Toggle star selection
    if (selectedRating === rating) {
      selectedRating = null;
    } else {
      selectedRating = rating;
    }

    // Update UI
    document.querySelectorAll('.filter_star').forEach((star) => {
      star.classList.remove('selected');
    });
    if (selectedRating) {
      e.target.classList.add('selected');
    }

    // Re-fetch and filter reviews based on the selected rating
    getReviews();
  });
});

// Get reviews from BE
async function getReviews() {
  const urlParams = new URLSearchParams(window.location.search);
  const listReviewContainer = document.querySelector('.list_review');
  const slug = urlParams.get('slug');
  let token = localStorage.getItem('user');
  if (token) {
    token = token.replace(/\\\"/g, '').replace(/\"/g, ''); // Clean token
  }
  const url = `https://onlinecourse.up.railway.app/api/reviews/get-all?slug=${slug}`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 404) {
      // No reviews found, handle the UI accordingly
      listReviewContainer.innerHTML = `<h1 class="noReview" style="margin-bottom: 10px">Chưa có review nào cho khóa học này!</h1>`;
      return;
    }

    let data = await response.json();
    const idReviews = data.map((item) => item.id);

    // Sort reviews based on the current sorting order
    data.sort((a, b) => {
      return isNewestFirst
        ? new Date(b.created_time) - new Date(a.created_time)
        : new Date(a.created_time) - new Date(b.created_time);
    });

    // Filter reviews by the selected rating
    if (selectedRating) {
      data = data.filter((review) => review.rating === selectedRating);
    }

    // Sort reviews based on the current sorting order
    data.sort((a, b) => {
      return isNewestFirst
        ? new Date(b.created_time) - new Date(a.created_time)
        : new Date(a.created_time) - new Date(b.created_time);
    });

    if (data && data.length > 0) {
      let html = ''; // Initialize empty html to accumulate reviews
      data.forEach((review, index) => {
        // Build stars based on rating
        let stars = '';
        for (let i = 1; i <= 5; i++) {
          stars += `<span class="star" data-value="${i}" style="color: ${
            i <= review.rating ? '#ee4d2d' : '#CCCCCC'
          }">&#9733;</span>`;
        }

        html += `
            <div class="list_review__item" key=${index}>
              <div class="author">
                <img src="${review.thumbnail}" alt="profile picture">
                <div class="author_infor">
                  <div class="author_infor__name">
                    <span>${review.full_name}</span>
                    <div>${
                      Math.abs(parseInt(review.time_ago)) < 60
                        ? review.time_ago
                        : 'Vừa mới'
                    }</div>
                  </div>
                  <div id="star-container">
                    ${stars} <!-- Display stars -->
                  </div>
                </div>
              </div>
              <div class="content_reviews">
                <span>${review.comment}</span>
                <div class="btnReport">
                  <img src="../../assets/icons/dots.svg" alt="" class="moreBtn">
                  <div id="btnDelete" class="btnDelete none" data-id="${
                    review.id
                  }">
                    Xóa bình luận
                  </div>
                </div>
              </div>
            </div>
          `;
      });
      listReviewContainer.innerHTML = html; // Insert all reviews into the container

      document.querySelectorAll('#btnDelete').forEach((btn) => {
        btn.addEventListener('click', () => {
          const reviewId = btn.getAttribute('data-id');
          deleteReviews(reviewId);
        });
      });
    }
  } catch (error) {
    console.error('Failed to fetch reviews:', error.message);
  }
  toggleShowReport();
}
getReviews();

const btnReview = document.querySelector('.submit_review');
const inputReview = document.querySelector('.wysiwyg-editor');
const btnSubmitReview = document.querySelector('.avatar_user');
const btnCancel = document.querySelector('.cancelReviews');

// IF YOU HAVE LOGIN
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

function toggleShowReport() {
  // Select all btnReport and btnDelete elements
  const btnReports = document.querySelectorAll('.btnReport');
  const btnDeletes = document.querySelectorAll('.btnDelete');

  // Loop through each btnReport and attach the click event
  btnReports.forEach((btnReport, index) => {
    const btnDelete = btnDeletes[index];

    btnReport.addEventListener('click', (event) => {
      event.stopPropagation(); // Prevent the click from bubbling up to the document
      btnDelete.classList.toggle('none'); // Toggle visibility
    });

    // Hide btnDelete when clicking outside
    document.addEventListener('click', (event) => {
      if (
        !btnReport.contains(event.target) &&
        !btnDelete.contains(event.target)
      ) {
        btnDelete.classList.add('none');
      }
    });
  });
}
toggleShowReport();

// CREATE REVIEWS
async function createReviews(value) {
  let token = localStorage.getItem('user');
  if (token) {
    token = token.replace(/\\\"/g, '').replace(/\"/g, ''); // Clean token
  }
  const url = 'https://onlinecourse.up.railway.app/api/reviews/save';
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(value),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      alert('Chưa mua khóa học vui lòng mua khóa học');
    }
    const data = await response.json();
    if (data) {
      getReviews();
    }
  } catch (error) {
    console.error('Failed to fetch reviews:', error.message);
  }
}
// DELETE REVIEWS
async function deleteReviews(id) {
  let token = localStorage.getItem('user');
  if (token) {
    token = token.replace(/\\\"/g, '').replace(/\"/g, ''); // Clean token
  }
  const url = `https://onlinecourse.up.railway.app/api/reviews/delete/${id}`;
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 403) {
      toast({
        title: 'Warning',
        message: 'Bạn không thể xóa review của người khác !!!',
        type: 'warning',
        duration: 5000,
      });
    }
    const data = await response.json();

    if (data) {
      getReviews();
    }
  } catch (error) {
    console.error('Failed to fetch reviews:', error.message);
  }
}
