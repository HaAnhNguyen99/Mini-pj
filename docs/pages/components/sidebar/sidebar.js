// Function to handle sidebar state
function updateSidebarState() {
  const sidebarLinks = document.querySelectorAll('#sidebar a');
  const storedActiveLink = localStorage.getItem('activeLink');

  if (storedActiveLink) {
    sidebarLinks.forEach((link) => {
      if (link.href === storedActiveLink) {
        link.classList.add('choose');
      } else {
        link.classList.remove('choose');
      }
    });
  }

  sidebarLinks.forEach((link) => {
    link.addEventListener('click', function (event) {
      sidebarLinks.forEach((link) => link.classList.remove('choose'));
      this.classList.add('choose');
      localStorage.setItem('activeLink', this.href);
    });
  });
}

updateSidebarState();
