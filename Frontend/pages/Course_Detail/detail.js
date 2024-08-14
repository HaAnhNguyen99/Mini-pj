document.addEventListener('DOMContentLoaded', function () {
  function loadComponent(component) {
    fetch(`../components/${component}/${component}.html`)
      .then((response) => response.text())
      .then((html) => {
        const container = document.querySelector(`#${component}`);
        const temp = document.createElement('template');
        temp.innerHTML = html;
        container.replaceWith(temp.content);
      })
      .catch((error) => {
        // content.innerHTML =
        //   '<p>Sorry, an error occurred while loading the content.</p>';
        console.log(error);
      });
  }

  function loadScript(component) {
    fetch(`../components/${component}/${component}.js`)
      .then((response) => {
        if (!response.ok) {
          return 404;
        }
        return response.text();
      })
      .then((js) => {
        if (!js || js === 404) {
          return;
        }
        const script = document.createElement('script');
        script.text = js;
        document.body?.appendChild(script);
      })
      .catch((error) => {});
  }

  function loadServices(service) {
    fetch(`../../services/${service}.js`)
      .then((response) => response.text())
      .then((js) => {
        const script = document.createElement('script');
        script.text = js;
        document.body?.appendChild(script);
      })
      .catch((error) => {});
  }

  // Loading components
  ['nav', 'sidebar', 'footer'].forEach((component) => {
    loadComponent(component);
    try {
      loadScript(component);
    } catch (e) {}
  });

  // Loading services
  ['renderCourses'].forEach((service) => {
    try {
      loadServices(service);
    } catch (e) {}
  });
});

(async function fetchCourses() {
  try {
    // Lấy toàn bộ URL hiện tại
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id');
    if (courseId) {
      console.log(`Course ID: ${courseId}`);
      // Bạn có thể sử dụng courseId để fetch dữ liệu hoặc xử lý khác ở đây
      const response = await fetch(
        `https://66b83ef23ce57325ac76b541.mockapi.io/courses/${courseId}`
      );
      const course = await response.json();
      console.log(course);
    } else {
      console.log('Course ID not found in the URL');
    }
  } catch (error) {
    console.error('Error fetching courses:', error);
  }
})();

const header = document.querySelector('.panel-header');
header.addEventListener('click', () => {
  const panelContent = document.querySelector('.panel-body');
  //click to add collapse, if already collapse remove it
  panelContent.classList.toggle('collapse');
  //change icon collapse/expand
});

const CourseDetail_API = {
  id: 1,
  title: 'string',
  price: 'number',
  decs: 'string',
  target: ['string', 'string'],
  thumbnail: 'img link',
  require: ['string', 'string', 'string'],
  chapter: [
    {
      id: 1,
      chapter_title: 'Chapter 1',
      lessions: [
        {
          id: 1,
          lession_title: 'lession 1',
          duration: 'second (type: number)',
          isDone: true,
        },
        {
          id: 2,
          lession_title: 'lession 2',
          duration: 'second (type: number)',
          isDone: true,
        },
        {
          id: 3,
          lession_title: 'lession 3',
          duration: 'second (type: number)',
          isDone: true,
        },
      ],
    },

    {
      id: 2,
      chapter_title: 'Chapter 2',
      lessions: [
        {
          id: 1,
          lession_title: 'lession 1',
          duration: 'second (type: number)',
          isDone: false,
        },
        {
          id: 2,
          lession_title: 'lession 2',
          duration: 'second (type: number)',
          isDone: false,
        },
        {
          id: 3,
          lession_title: 'lession 3',
          duration: 'second (type: number)',
          isDone: false,
        },
      ],
    },
  ],
};

// payment

const API_Payment = {
  User_ID: 'number',
  Course_ID: 'number',
  token: 'string',
};

// User ID

const User_ID_API = {
  User_ID: 'number',
  Name: 'string',
  Email: 'string',
  Avatar: 'img link',
  token: 'string',
};
