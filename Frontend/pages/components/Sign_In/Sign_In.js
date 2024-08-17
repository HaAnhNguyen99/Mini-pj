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
function toggleFormOptions(
  triggerBtn,
  targetForm,
  currentForm,
  mark,
  btnInBack
) {
  // Show target form and hide the current form
  triggerBtn.addEventListener('click', function () {
    currentForm.classList.add('hide');
    targetForm.classList.remove('hide');
    targetForm.classList.add('active__email');
    btnInBack.classList.remove('hide');
  });
  btnInBack.addEventListener('click', function () {
    currentForm.classList.remove('hide');
    targetForm.classList.add('hide');
    targetForm.classList.remove('active__email');
    btnInBack.classList.add('hide');
  });
  // Revert to the original form if the mark is clicked
  mark.addEventListener('click', function () {
    targetForm.classList.add('hide');
    currentForm.classList.remove('hide');
    btnInBack.classList.add('hide');
  });
}

// Selectors
const btnSignIn = document.querySelector('#sign-in');
const btnCloseIn = document.querySelector('.sign-in__btnClose');
const formSignIn = document.querySelector('.sign-in--wrapper');
const markSignIn = document.querySelector('.mark-in');
const btnInBack = document.querySelector('.sign-in__btnBack');
const btnSignInEmail = document.querySelector('#btnSign_In--Emaill');
const formSignInOptions = document.querySelector('.sign-in__options');
const formSignInOptionsEmail = document.querySelector('#sign-in__withEmaill');

// Usage of the functions
toggleVisibility(btnSignIn, btnCloseIn, formSignIn, markSignIn);
toggleFormOptions(
  btnSignInEmail,
  formSignInOptionsEmail,
  formSignInOptions,
  markSignIn,
  btnInBack
);

// Additional logic for hiding specific forms when the mark is clicked
markSignIn.addEventListener('click', function () {
  formSignIn.classList.remove('show');
  markSignIn.classList.remove('show');

  formSignInOptions.classList.remove('hide');
  formSignInOptionsEmail.classList.add('hide');
});

// LOGIN

document.querySelector('#login').addEventListener('click', () => {
  const inputEmail_Sign_In = document.querySelector('#email_sign_in').value;
  const inputPassword_Sign_In =
    document.querySelector('#password_sign_in').value;
  const accountNewUser = {
    email: inputEmail_Sign_In,
    password: inputPassword_Sign_In,
  };
});
