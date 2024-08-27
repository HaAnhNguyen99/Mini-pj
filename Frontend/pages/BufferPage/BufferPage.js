let token = localStorage.getItem('user');
if (token) {
  token = token.replace(/\\\"/g, '');
  token = token.replace(/\"/g, '');
}
const urlParams = new URLSearchParams(window.location.search);
const email = urlParams.get('email');
console.log(email);

// Load components and scripts sequentially
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
  const components = ['nav', 'footer', 'Sign_Up', 'Sign_In', 'toastMessage'];

  components.forEach((component) => {
    loadComponent(component)
      .then(() => loadScript(component))
      .catch((error) => console.error(`Error loading ${component}:`, error));
  });

  // Loading services
  const services = ['env'];
  services.forEach((service) => {
    loadServices(service).catch((error) =>
      console.error(`Error loading service ${service}:`, error)
    );
  });
});

// Check email verification
async function checkEmailVerification(email) {
  const verificationUrl = `https://onlinecourse.up.railway.app/api/users/verify?email=${email}`;
  try {
    const response = await fetch(verificationUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
    }
    const data = await response;
    console.log('data', data);

    // Show success or error toast based on verification status
    if (response.status === 200) {
      toast({
        title: 'Success',
        message: 'Email đã được xác thực thành công !',
        type: 'success',
        duration: 5000,
      });
      window.location.href = DEFAULT_PAGE;
    } else if (response.status !== 200) {
      toast({
        title: 'Error',
        message: 'Email xác thực thất bại !',
        type: 'error',
        duration: 5000,
      });
      const displayText = document.querySelector('h1#text');
      displayText.innerHTML = 'Email đã được xác thực!';
    }
  } catch (error) {
    console.error('Errors:', error.message);
  }
}

checkEmailVerification(email);
