async function render(courseContainer, courses) {
  courseContainer.innerHTML = courses
    .map(
      (course) =>
        `
            <div class="course">
            ${
              Number(course.new_price) > 0
                ? `<div class="pre-icon"><i class="fa-solid fa-crown"></i></div>`
                : ''
            }

              <a class="top-card" id="course-detail" data-course-id="${
                course.slug
              }" href="${path}pages/Course_Detail/detail.html?slug=${
          course.slug
        }">
                <img src="${
                  course.thumbnail
                }" alt="Course Image" loading="lazy" />
              </a>
              <div class="bot-card">
                <h3 class="title">${course.title}</h3>
                <div class="prices">
                  <p class="price oldPrice">${
                    Number(course.old_price) > 0
                      ? Number(course.new_price).toLocaleString('vi-VN') + 'đ'
                      : ''
                  }</p>
                  <p class="price newPrice">${
                    Number(course.new_price) > 0
                      ? Number(course.new_price).toLocaleString('vi-VN') + 'đ'
                      : 'Miễn phí'
                  }</p>
                </div>

                <div class="more-inf">
                  <div class="author">
                    <img
                      src="https://ucarecdn.com/de6e9dd2-260e-4242-835c-3ab479d5ccf9/-/preview/499x500/"
                      alt="Author Image"
                      width="20px"
                      height="20px" />
                  </div>
                  <div class="total-duration">
                  <i class="fa-solid fa-play"></i>
                   ${course.total_learners}</div>
                  <div class="total-minute">
                    <i class="fa-solid fa-clock"></i>
                    <span id="total-minute">${course.total_learners}</span>
                  </div>
                </div>
              </div>
            </div>
        `
    )
    .join('');
}
