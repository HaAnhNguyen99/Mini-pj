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
  const components = [
    'nav',
    'sidebar',
    'wrapper',
    'slider',
    'footer',
    'Sign_Up',
    'Sign_In',
    'toastMessage',
  ];

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
