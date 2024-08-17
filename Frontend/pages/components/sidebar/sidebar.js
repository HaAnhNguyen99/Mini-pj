// click on a button then add class "choose" and remove class "choose" previous a
// document.querySelector('#sidebar a').addEventListener('click', function () {
//   const currentChoose = document.querySelector('.choose');
//   if (currentChoose) {
//     currentChoose.classList.remove('choose');
//   }
//   this.classList.add('choose');
// });

document.addEventListener('click', function () {
  const btnBack = document.getElementById('btnBack');

  // Check if the current URL is the homepage
  const isHomePage =
    window.location.pathname === '/' ||
    window.location.pathname === '/index.html';

  if (!isHomePage) {
    btnBack.classList.remove('hidden');
  }

  // Add event listener to the Back button
  btnBack.addEventListener('click', function () {
    window.history.back();
  });
});
