// General function to show and hide forms
function toggleVisibility(
  triggerBtn,
  closeBtn,
  form,
  mark,
  formSignUpOptionsEmail,
  formSignUpOptions,
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

    formSignUpOptions.classList.remove('hide');
    formSignUpOptionsEmail.classList.add('hide');
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
    btnBack.classList.add('hide');
  });
}

// Selectors
const btnSignUp = document.querySelector('#sign-up');
const btnCloseUp = document.querySelector('.sign-up__btnClose');
const formSignUp = document.querySelector('.sign-up--wrapper');
const markSignUp = document.querySelector('.mark-up');
const btnBack = document.querySelector('.sign-up__btnBack');
const btnSignUpEmail = document.querySelector('#btnSign_Up--Email');
const formSignUpOptions = document.querySelector('.sign-up__options');
const formSignUpOptionsEmail = document.querySelector('#sign-up__withEmail');

// Usage of the functions
toggleVisibility(
  btnSignUp,
  btnCloseUp,
  formSignUp,
  markSignUp,
  formSignUpOptionsEmail,
  formSignUpOptions
);
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

// Work with server api ----- REGISTER ACCOUNT --------
document.querySelector('#register_account').addEventListener('click', (e) => {
  e.preventDefault();

  const inputFullName = document
    .querySelector('#fullname-sign-up')
    .value.trim();
  const inputEmail_Sign_Up = document
    .querySelector('#email-sign-up')
    .value.trim();
  const inputPassword_Sign_Up = document
    .querySelector('#password-sign-up')
    .value.trim();

  // Clear previous error messages
  document.querySelector('#error-fullname-sign-up').textContent = '';
  document.querySelector('#error-email-sign-up').textContent = '';
  document.querySelector('#error-password-sign-up').textContent = '';

  let hasError = false;

  // Validation checks
  if (!inputFullName) {
    document.querySelector('#error-fullname-sign-up').textContent =
      'Vui lòng nhập họ và tên của bạn.';
    hasError = true;
  }
  if (!inputEmail_Sign_Up) {
    document.querySelector('#error-email-sign-up').textContent =
      'Vui lòng nhập địa chỉ email của bạn.';
    hasError = true;
  }
  if (!inputPassword_Sign_Up) {
    document.querySelector('#error-password-sign-up').textContent =
      'Vui lòng nhập mật khẩu của bạn.';
    hasError = true;
  }

  // Stop the submission if there's an error
  if (hasError) {
    return;
  }

  const accountNewUser = {
    full_name: inputFullName,
    email: inputEmail_Sign_Up,
    password: inputPassword_Sign_Up,
  };

  async function registerUser() {
    const url = 'https://onlinecourse.up.railway.app/api/users/register';
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(accountNewUser),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        if (response.status === 409) {
          toast({
            title: 'Error',
            message: 'Email đã được đăng ký trước đó',
            type: 'error',
            duration: 5000,
          });
          document.querySelector('#email-sign-up').focus();
          return;
        }
        if (response.status === 400) {
          const json = await response.json();
          json.errors.forEach((e) => {
            toast({
              title: 'Lỗi',
              message: e,
              type: 'error',
              duration: 5000,
            });
          });
          return;
        }
      }

      const json = await response.json();
      console.log('User registered successfully:', json);
      if (json.status === 500 || json.status === 1001) {
        toast({
          title: 'Lỗi',
          message: 'Email đã đăng ký trước đó',
          type: 'error',
          duration: 5000,
        });
        return;
      }
      if (json.errors) {
        json.errors.forEach((e) => {
          toast({
            title: 'Lỗi',
            message: e,
            type: 'error',
            duration: 5000,
          });
        });
        return;
      }
      toast({
        title: 'Đăng ký thành công',
        message: 'Vui lòng kiểm tra mã xác thực qua email',
        type: 'success',
        duration: 5000,
      });
      // Wait for 1 minute (60000 milliseconds) before checking email verification status

      setTimeout(async () => {
        if (json.id) {
          await checkEmailVerification(inputEmail_Sign_Up);
        }
      }, 2000);
    } catch (error) {
      console.error('Registration failed:', error.message);
    }
  }

  async function checkEmailVerification(email) {
    // const verificationUrl = `https://onlinecourse.up.railway.app/api/users/verify?email=${email}`; // Replace with your actual API endpoint
    const verificationUrl = `https://onlinecourse.up.railway.app/api/users/verify?email=hjhj199975@gmail.com`; // Replace with your actual API endpoint
    try {
      const response = await fetch(verificationUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
      }
      const data = await response;
      console.log('data', data);

      // Show success or error toast based on verification status
      if (response.status === 200) {
        // toast({
        //   title: 'Success',
        //   message: 'Email đã được xác thực thành công !',
        //   type: 'success',
        //   duration: 5000,
        // });
        formSignUp.classList.remove('show');
        markSignUp.classList.remove('show');
      } else if (response.status !== 200) {
        toast({
          title: 'Error',
          message: 'Email xác thực thất bại !',
          type: 'error',
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Errors:', error.message);
    }
  }

  registerUser();
});
