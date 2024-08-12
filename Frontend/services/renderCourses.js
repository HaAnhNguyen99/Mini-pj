async function render(courseContainer, courses) {
  console.log(true);
  courseContainer.innerHTML = courses
    .map(
      (course) =>
        `
            <div class="course">
            ${
              Number(course.price) > 0
                ? `<div class="pre-icon"><i class="fa-solid fa-crown"></i></div>`
                : ''
            }

              <a class="top-card" href="https://${course.title}">
                <img src="${
                  course.course_img
                }" alt="Course Image" loading="lazy" />
              </a>
              <div class="bot-card">
                <h3 class="title">${course.title}</h3>
                <p class="price">${
                  Number(course.price) > 0
                    ? Number(course.price).toLocaleString('vi-VN') + 'đ'
                    : 'Miễn phí'
                }</p>

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
                   ${course.total_duration}</div>
                  <div class="total-minute">
                    <i class="fa-solid fa-clock"></i>
                    <span id="total-minute">${course.total_minute}</span>
                  </div>
                </div>
              </div>
            </div>
        `
    )
    .join('');
}
