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

  ['footer', 'review', 'loader'].forEach((component) => {
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

  [
    'convertSeconds',
    'renderChapter',
    'renderTarget',
    'renderRequire',
    'env',
  ].forEach((service) => {
    try {
      loadServices(service);
    } catch (e) {}
  });
});
