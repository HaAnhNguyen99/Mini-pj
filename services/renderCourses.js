function getRandomTime() {
  const minutes = Math.floor(Math.random() * (59 - 10 + 1)) + 10;

  const formattedTime = minutes.toString().padStart(2, '0') + ':00';

  return formattedTime;
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function render(courseContainer, courses) {
  courseContainer.innerHTML = courses
    .map((course) => {
      const isPaidCourse = Number(course.new_price) > 0;
      const oldPrice =
        Number(course.old_price) > 0
          ? Number(course.old_price).toLocaleString('vi-VN') + 'đ'
          : '';
      const newPrice = isPaidCourse
        ? Number(course.new_price).toLocaleString('vi-VN') + 'đ'
        : 'Miễn phí';

      return `
        <div class="course">
          ${
            isPaidCourse
              ? `<div class="pre-icon"><i class="fa-solid fa-crown"></i></div>`
              : ''
          }
          <a class="top-card" id="course-detail" data-course-id="${
            course.slug
          }" href="${path}pages/Course_Detail/detail.html?slug=${course.slug}" 
            style="background-image: url('${
              course.thumbnail
            }'); background-size: cover; background-position: center;">
          </a>
          <div class="bot-card">
            <h3 class="title">${course.title}</h3>
            <div class="prices">
              <p class="price oldPrice">${oldPrice}</p>
              <p class="price newPrice">${newPrice}</p>
            </div>

            <div class="more-inf">
              <div class="author">
                <img
                  src="https://ucarecdn.com/de6e9dd2-260e-4242-835c-3ab479d5ccf9/-/preview/499x500/"
                  alt="Author Image"
                  width="20px"
                  height="20px" />
              </div>
              <span class="author-name">Nguyễn Phương Nam</span>
              <div class="total-duration">
                <i class="fa-solid fa-play"></i> ${getRandomNumber(1, 10)}
              </div>
              <div class="total-minute">
                <i class="fa-solid fa-clock"></i>
                <span id="total-minute">${getRandomTime()}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    })
    .join('');
}
