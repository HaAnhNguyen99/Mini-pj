document.addEventListener('DOMContentLoaded', function () {
  const backButton = document.getElementById('backButton');

  // Check if the current page is the homepage
  if (window.location.pathname !== '/') {
    backButton.style.display = 'block'; // Show the back button
  }

  // Add click event to navigate to the previous page
  backButton.addEventListener('click', function () {
    window.history.back(); // Go back to the previous page
  });
});
