document.addEventListener('DOMContentLoaded', function () {
  // Loading components
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

  ['footer'].forEach((component) => {
    loadComponent(component);
    try {
      loadScript(component);
    } catch (e) {}
  });

  // Loading services
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

  [].forEach((service) => {
    try {
      loadServices(service);
    } catch (e) {}
  });
});

// Step 1: Kiểm tra tham số `vnp_ResponseCode` trong URL
window.addEventListener('load', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const responseCode = urlParams.get('vnp_ResponseCode');

  if (responseCode) {
    // Step 2: Nếu `vnp_ResponseCode` tồn tại, thực hiện fetch API
    const API = 'https://onlinecourse.up.railway.app/api/orders/create';
    let token = localStorage.getItem('user');
    token = token.replace(/"/g, '');
    const course_id = Number(localStorage.getItem('course_id'));

    try {
      const response = await fetch(API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ course_id: course_id }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data from API');
      }

      const data = await response.json();
      console.log(data);

      // Start the countdown and redirect process
      await redirectToHome(10);
    } catch (error) {
      console.error('Error:', error);
    }
  } else {
    console.log('vnp_ResponseCode not found in URL.');
  }
});

async function redirectToHome(time) {
  let countdownElement = document.getElementById('countdown');
  let timeLeft = time;

  // Update the countdown every second
  const countdownInterval = setInterval(() => {
    timeLeft--;
    countdownElement.textContent = timeLeft;

    // When the countdown reaches 0, redirect to the homepage
    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      window.location.href = '/Frontend/pages/Default/index.html'; // Change this URL to your homepage if it's different
    }
  }, 1000);
}
