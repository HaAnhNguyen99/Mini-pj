// Selectors
const btnSignUp = document.querySelector('#sign-up');
const btnCloseUp = document.querySelector('.sign-up__btnClose');
const formSignUp = document.querySelector('.sign-up--wrapper');
const markSignUp = document.querySelector('.mark-up');
const btnBack = document.querySelector('.sign-up__btnBack');
const btnSignUpEmail = document.querySelector('#btnSign_Up--Emaill');
const formSignUpOptions = document.querySelector('.sign-up__options');
const formSignUpOptionsEmail = document.querySelector('#sign-up__withEmaill');
console.log(formSignUp);

// General function to show and hide forms
function toggleVisibility(
  triggerBtn,
  closeBtn,
  form,
  mark,
  hideOnMarkClick = true
) {
  // Show form
  triggerBtn.addEventListener('click', function () {
    form.classList.add('show');
    mark.classList.add('show');
  });

  // Hide form when close button is clicked
  closeBtn?.addEventListener('click', function () {
    form.classList.remove('show');
    mark.classList.remove('show');
  });

  // Hide form when clicking outside (on the mark)
  if (hideOnMarkClick) {
    mark.addEventListener('click', function () {
      form.classList.remove('show');
      mark.classList.remove('show');
    });

    form.addEventListener('click', function (event) {
      event.stopPropagation();
    });
  }
}

// General function to toggle between different form options (e.g., Email or Phone)
function toggleFormOptions(triggerBtn, targetForm, currentForm, mark, btnBack) {
  // Show target form and hide the current form
  triggerBtn.addEventListener('click', function () {
    currentForm.classList.add('hide');
    targetForm.classList.remove('hide');
    targetForm.classList.add('active__email');
    btnBack.classList.remove('hide');
  });
  btnBack.addEventListener('click', function () {
    currentForm.classList.remove('hide');
    targetForm.classList.add('hide');
    targetForm.classList.remove('active__email');
    btnBack.classList.add('hide');
  });
  // Revert to the original form if the mark is clicked
  mark.addEventListener('click', function () {
    targetForm.classList.add('hide');
    currentForm.classList.remove('hide');
  });
}

// Usage of the functions
toggleVisibility(btnSignUp, btnCloseUp, formSignUp, markSignUp);
toggleFormOptions(
  btnSignUpEmail,
  formSignUpOptionsEmail,
  formSignUpOptions,
  markSignUp,
  btnBack
);

// Additional logic for hiding specific forms when the mark is clicked
markSignUp.addEventListener('click', function () {
  formSignUp.classList.remove('show');
  markSignUp.classList.remove('show');

  formSignUpOptions.classList.remove('hide');
  formSignUpOptionsEmail.classList.add('hide');
});
