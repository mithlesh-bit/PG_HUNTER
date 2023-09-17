
const signbtn = document.querySelector("#signupbtn"),
  loginbtn = document.querySelector("#loginbtn"),
  home = document.querySelector(".home"),
  forgot = document.querySelector("#forgot"),
  formContainer = document.querySelector(".form_container"),
  formCloseBtn = document.querySelector(".form_close"),
  pwShowHide = document.querySelectorAll(".pw_hide"),
  loginform = document.querySelector("#loginform"),
  loginlink = document.querySelector("#login"),
  signuplink = document.querySelector("#signup"),
  forgotlink = document.querySelector("#forgotlink");


signbtn.addEventListener("click", () => signuppage())
signuplink.addEventListener("click", () => signuppage())
loginbtn.addEventListener("click", () => loginpage());
loginlink.addEventListener("click", () => loginpage());
forgotlink.addEventListener("click", () => forgetpage());

function forgetpage() {
  loginform.style.display = "none";
  forgot.style.display = "block";
}

function signuppage() {
  close_mob_bar()
  home.classList.add("show")
  formContainer.classList.add("active");
  loginform.style.display = "none";
  forgot.style.display = "none";

}

function loginpage() {
  close_mob_bar()
  home.classList.add("show")
  formContainer.classList.remove("active");
  loginform.style.display = "block";

}



formCloseBtn.addEventListener("click", () => {
  home.classList.remove("show")
})


pwShowHide.forEach((icon) => {
  icon.addEventListener("click", () => {
    let getPwInput = icon.parentElement.querySelector("input");
    if (getPwInput.type === "password") {
      getPwInput.type = "text";
      icon.classList.replace("uil-eye-slash", "uil-eye");
    } else {
      getPwInput.type = "password";
      icon.classList.replace("uil-eye", "uil-eye-slash");
    }
  });
});




function handleLoginFormSubmission() {

  const form = document.getElementById('loginForm');


  const loginnowtext = document.querySelector("#loginnowtext")
  loginnowtext.innerHTML = "Processing..."
  loginnowtext.disabled = true;
  // loginnowtext = "Processing..."
  // Get the email and password values from the form fields
  const email = form.querySelector('input[name="email"]').value;
  const password = form.querySelector('input[name="pass"]').value;


  fetch('/login', {
    method: 'POST',
    body: JSON.stringify({ email: email, pass: password }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(data => {
      console.log(data.success);
      if (data.success) { // Compare to the boolean value true
        // Display a success pop-up
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: data.message
        }).then(() => {
          // Redirect or perform other actions after displaying the pop-up
          window.location.href = '/';
        });
      } else {
        // Display an error pop-up
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.message
        });
      }
      loginnowtext.innerHTML = "Login Now"
      loginnowtext.disabled = false;
    });
}

pwShowHide.forEach((icon) => {
  icon.addEventListener("click", () => {
    let getPwInput = icon.parentElement.querySelector("input");
    if (getPwInput.type === "password") {
      getPwInput.type = "text";
      icon.classList.replace("uil-eye-slash", "uil-eye");
    } else {
      getPwInput.type = "password";
      icon.classList.replace("uil-eye", "uil-eye-slash");
    }
  });
});

// register handle
function registerhandle() {

  const form = document.getElementById('registerForm');

  const signupBtnText = document.querySelector('#signupBtnText')
  signupBtnText.innerHTML = "Processing..."
  signupBtnText.disabled = true;

  // Get the email and password values from the form fields
  const name = form.querySelector('input[name="name"]').value;
  const email = form.querySelector('input[name="email"]').value;
  const contact = form.querySelector('input[name="contact"]').value;
  const password = form.querySelector('input[name="pass"]').value;
  const repassword = form.querySelector('input[name="repass"]').value;

  console.log("1");

  fetch('/register', {
    method: 'POST',
    body: JSON.stringify({ name: name, email: email, contact: contact, pass: password, repass: repassword }),
    headers: {
      'Content-Type': 'application/json'
    }

  })
    .then(response => response.json())
    .then(data => {
      console.log("2");
      if (data.success) {

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: data.message
        }).then(() => {
          window.location.href = '/';
          console.log("3");
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.message
        });
      }
      signupBtnText.innerHTML = "Signup Now"
      signupBtnText.disabled = false;
    });
}

function forgothandle() {
  const form = document.getElementById('forgotPass');
  const resetBtnText = document.querySelector('#resetBtnText')
  resetBtnText.innerHTML = "Processing..."
  resetBtnText.disabled = true;
  const email = form.querySelector('input[name="email"]').value;
  fetch('/forgot-pass', {
    method: 'POST',
    body: JSON.stringify({ email }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: data.message
        }).then(() => {
          window.location.href = '/';
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.message
        });
      }
      resetBtnText.innerHTML = "Send"
      resetBtnText.disabled = false;
    });
}


