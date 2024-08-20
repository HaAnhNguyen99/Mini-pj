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
  const inputEmail_Sign_In = document
    .querySelector('#email_sign_in')
    .value.trim();
  const inputPassword_Sign_In = document
    .querySelector('#password_sign_in')
    .value.trim();

  document.querySelector('#error-email-sign-in').textContent = '';
  document.querySelector('#error-password-sign-in').textContent = '';

  let hasError = false;

  // Validation checks
  if (!inputEmail_Sign_In) {
    document.querySelector('#error-email-sign-in').textContent =
      'Vui lòng nhập email của bạn.';
    hasError = true;
  }
  if (!inputPassword_Sign_In) {
    document.querySelector('#error-password-sign-in').textContent =
      'Vui lòng nhập password của bạn.';
    hasError = true;
  }
  if (hasError) {
    return;
  }
  const accountNewUser = {
    email: inputEmail_Sign_In,
    password: inputPassword_Sign_In,
  };
  async function loginUser() {
    const url = 'https://onlinecourse.up.railway.app/api/auth/token';
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(accountNewUser),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        if (response.status === 404) {
          toast({
            title: 'Error',
            message: 'Email không tồn tại',
            type: 'error',
            duration: 5000,
          });
          document.querySelector('#email_sign_in').focus();
        } else if (response.status === 400) {
          toast({
            title: 'Error',
            message: 'Sai mật khẩu',
            type: 'error',
            duration: 5000,
          });
          document.querySelector('#password_sign_in').focus();
        } else if (response.status === 401) {
          toast({
            title: 'Error',
            message: 'Email chưa được xác thực',
            type: 'error',
            duration: 5000,
          });
          document.querySelector('#password_sign_in').focus();
        }
      }
      const data = await response.json();

      if (data.token) {
        formSignIn.classList.remove('show');
        markSignIn.classList.remove('show');
        localStorage.setItem('user', JSON.stringify(data.token));
        location.reload();
      }
    } catch (error) {
      console.error('Registration failed:', error.message);
    }
  }
  loginUser();
});
