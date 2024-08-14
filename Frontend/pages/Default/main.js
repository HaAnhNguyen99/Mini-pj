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
        content.innerHTML =
          '<p>Sorry, an error occurred while loading the content.</p>';
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
    fetch(`../../../services/${service}.js`)
      .then((response) => response.text())
      .then((js) => {
        const script = document.createElement('script');
        script.text = js;
        document.body?.appendChild(script);
      })
      .catch((error) => {});
  }

  // Loading components
  ['nav', 'sidebar', 'wrapper', 'slider', 'footer'].forEach((component) => {
    loadComponent(component);
    try {
      loadScript(component);
    } catch (e) {}
  });

  // Loading services
  ['renderCourses', 'newsService'].forEach((service) => {
    try {
      loadServices(service);
    } catch (e) {}
  });
});
