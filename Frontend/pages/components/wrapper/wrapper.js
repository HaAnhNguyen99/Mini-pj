const freeCourse = [];
const premiumCourse = [];
let totalleaners = 0;

(async function fetchCourses() {
  try {
    const response = await fetch(
      'https://onlinecourse.up.railway.app/api/courses/home-page'
    );
    const courses = await response.json();
    console.log(courses);

    const preContainer = document.querySelector('.premium-courses');
    const freeContainer = document.querySelector('.free-courses');
    const container = document.querySelector('#wrapper');
    container.classList.toggle = 'hidden';

    // Filter courses by price
    courses.forEach((course) => {
      if (Number(course.new_price) > 0) {
        premiumCourse.push(course);
      } else {
        freeCourse.push(course);
        totalleaners += Number(course.total_learners);
      }
    });

    // Update total learner count
    const totalleaners_container = document.querySelector('#total');
    totalleaners_container.textContent = totalleaners;

    // Render courses
    render(preContainer, premiumCourse);
    render(freeContainer, freeCourse);
    container.classList.toggle = 'hidden';
  } catch (error) {
    console.error('Error fetching courses:', error);
  }
})();
