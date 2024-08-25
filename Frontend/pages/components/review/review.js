let isNewestFirst = true; // Default to sorting by newest first

document.querySelector('.sort_btn').addEventListener('click', () => {
  isNewestFirst = !isNewestFirst; // Toggle the sorting order
  const sortText = isNewestFirst ? 'Mới Nhất' : 'Cũ Nhất';
  document.querySelector('.sort_btn span').textContent = sortText;
  getReviews(); // Fetch and sort reviews again based on the new order
});

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
      listReviewContainer.innerHTML = `<h1 class="noReview">Chưa có review nào cho khóa học này!</h1>`;
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
