// click on a button then add class "choose" and remove class "choose" previous a
document.querySelector('#sidebar a').addEventListener('click', function () {
  const currentChoose = document.querySelector('.choose');
  if (currentChoose) {
    currentChoose.classList.remove('choose');
  }
  this.classList.add('choose');
});
