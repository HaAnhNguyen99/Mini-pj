const freeCourse = [];
const premiumCourse = [];
let totalleaners = 0;

(async function fetchCourses() {
  try {
    const response = await fetch(
      'https://66b83ef23ce57325ac76b541.mockapi.io/courses'
    );
    const courses = await response.json();
    const preContainer = document.querySelector('.premium-courses');
    const freeContainer = document.querySelector('.free-courses');

    courses.forEach((course) => {
      if (Number(course.price) > 0) {
        premiumCourse.push(course);
      } else {
        freeCourse.push(course);
        totalleaners += Number(course.total_learners);
      }
    });
    const totalleaners_container = document.querySelector('#total');
    totalleaners_container.textContent = totalleaners;

    render(preContainer, premiumCourse);
    render(freeContainer, freeCourse);
  } catch (error) {
    console.error('Error fetching courses:', error);
  }
})();
