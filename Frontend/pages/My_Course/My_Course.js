document.addEventListener('DOMContentLoaded', function () {
  function loadComponent(component) {
    return fetch(`../components/${component}/${component}.html`)
      .then((response) => response.text())
      .then((html) => {
        const container = document.querySelector(`#${component}`);
        if (!container) throw new Error(`Container for ${component} not found`);
        container.innerHTML = html;
      })
      .catch((error) => {
        console.error(`Failed to load ${component}:`, error);
      });
  }

  function loadScript(component) {
    return fetch(`../components/${component}/${component}.js`)
      .then((response) => {
        if (!response.ok) {
          console.warn(`No script found for ${component}`);
          return null;
        }
        return response.text();
      })
      .then((js) => {
        if (js) {
          const script = document.createElement('script');
          script.text = js;
          document.body.appendChild(script);
        }
      })
      .catch((error) => {
        console.error(`Failed to load script for ${component}:`, error);
      });
  }

  function loadServices(service) {
    return fetch(`../../services/${service}.js`)
      .then((response) => response.text())
      .then((js) => {
        const script = document.createElement('script');
        script.text = js;
        document.body.appendChild(script);
      })
      .catch((error) => {
        console.error(`Failed to load service ${service}:`, error);
      });
  }

  // Loading components and scripts sequentially
  const components = ['nav', 'sidebar', 'footer', 'Sign_Up', 'Sign_In'];

  components.forEach((component) => {
    loadComponent(component)
      .then(() => loadScript(component))
      .catch((error) => console.error(`Error loading ${component}:`, error));
  });

  // Loading services
  const services = ['renderCourses', 'env'];
  services.forEach((service) => {
    loadServices(service).catch((error) =>
      console.error(`Error loading service ${service}:`, error)
    );
  });
});

async function getMyCourse() {
  let token = localStorage.getItem('user');
  const myCourses = document.querySelector('.myCourse__list');

  if (token) {
    token = token.replace(/\\\"/g, ''); // Remove backslashes
    token = token.replace(/\"/g, ''); // Remove double quotes
  }
  const url = 'https://onlinecourse.up.railway.app/api/orders/my-course';
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Add Bearer token here
      },
    });
    if (response.status === 404) {
      const heading = document.createElement('h1');
      heading.textContent = 'Bạn chưa đăng ký khóa học nào !';
      heading.className = 'notifi_course';
      document.querySelector('.myCourse').append(heading);
    }
    const responseText = await response.text();
    const data = responseText ? JSON.parse(responseText) : null;

    if (data) {
      data.forEach((course, index) => {
        let html = `
          <div class="myCourse__item" key=${index}>
            <div class="myCourse_item__inner">
              <img src="${course.course_thumbnail}" alt="Course Thumbnail"/>
              <div class="item_infor">
                <h1>${course.course_title}</h1>
                <div class="item_paymentDate">
                  <span>Ngày mua </span>
                  <span>${new Date(
                    course.date_purchase
                  ).toLocaleDateString()}</span>
                </div>
              </div>
            </div> 
          </div>
        `;
        myCourses.innerHTML += html;
      });
    }
  } catch (error) {
    console.error('Fetching course data failed:', error.message);
  }
}

getMyCourse();
