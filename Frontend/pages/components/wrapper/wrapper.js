const freeCourse = [];
const premiumCourse = [];
let totalleaners = 0;

(async function fetchCourses() {
  try {
    const response = await fetch(
      'https://onlinecourse.up.railway.app/api/courses/home-page'
    );
    const courses = await response.json();

    const preContainer = document.querySelector('.premium-courses');
    const freeContainer = document.querySelector('.free-courses');
    preContainer.style.opacity = '0';
    freeContainer.style.opacity = '0';

    // Filter courses by price
    courses.forEach((course) => {
      if (Number(course.new_price) > 0) {
        premiumCourse.push(course);
      } else {
        freeCourse.push(course);
        totalleaners += Number(course.total_learners);
      }
    });
    const totalleaners_container = document.querySelector('#total');
    totalleaners_container.textContent = totalleaners;

    // Render courses
    render(preContainer, premiumCourse);
    render(freeContainer, freeCourse);
    preContainer.style.opacity = '1';
    freeContainer.style.opacity = '1';
  } catch (error) {
    console.error('Error fetching courses:', error);
  }
})();
