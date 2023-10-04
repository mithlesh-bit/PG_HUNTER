
const signbtn = document.querySelector("#signupbtn"),
  loginbtn = document.querySelector("#loginbtn"),
  home = document.querySelector(".home"),
  forgot = document.querySelector("#forgot"),
  formContainer = document.querySelector(".form_container"),
  formCloseBtn = document.querySelector(".form_close"),
  loginform = document.querySelector("#loginform"),
  loginlink = document.querySelector("#login"),
  signuplink = document.querySelector("#signup"),
  forgotlink = document.querySelector("#forgotlink");
  
const pwShowHide = document.querySelectorAll(".pw_hide")


signbtn.addEventListener("click", () => signuppage())
signuplink.addEventListener("click", () => signuppage())
loginbtn.addEventListener("click", () => loginpage());
loginlink.addEventListener("click", () => loginpage());
forgotlink.addEventListener("click", () => forgetpage());

console.log(loginlink);
function forgetpage() {
  loginform.style.display = "none";
  forgot.style.display = "block";
}

function signuppage() {
  goback()
  close_mob_bar()
  forgot.style.display = "none";
  home.classList.add("show")
  formContainer.classList.add("active");
  loginform.style.display = "none";
  forgot.style.display = "none";
  
}

function loginpage() {
  goback()
  close_mob_bar()
  forgot.style.display = "none";
  home.classList.add("show")
  formContainer.classList.remove("active");
  loginform.style.display = "block";

}



formCloseBtn.addEventListener("click", () => {
  home.classList.remove("show")
  gofront()
})


pwShowHide.forEach((icon) => {
  icon.addEventListener("click", () => {
    let getPwInput = icon.parentElement.querySelector("input");
    if (getPwInput.type === "password") {
      console.log(getPwInput.type);
      getPwInput.type = "text";
      console.log(getPwInput.type);
      icon.classList.replace("uil-eye-slash", "uil-eye");
    } else {
      getPwInput.type = "password";
      icon.classList.replace("uil-eye", "uil-eye-slash");
    }
    console.log(getPwInput.type);
    console.log(getPwInput);
  });
});

function showpassword(){

}




function handleLoginFormSubmission() {

  const form = document.getElementById('loginForm');


  const loginnowtext = document.querySelector("#loginnowtext")
  loginnowtext.innerHTML = `<span class="loader"></span>`
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
  signupBtnText.innerHTML = `<span class="loader"></span>`
  signupBtnText.disabled = true;

  // Get the email and password values from the form fields
  const name = form.querySelector('input[name="name"]').value;
  const email = form.querySelector('input[name="email"]').value;
  const contact = form.querySelector('input[name="contact"]').value;
  const password = form.querySelector('input[name="pass"]').value;
  const repassword = form.querySelector('input[name="repass"]').value;


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
  resetBtnText.innerHTML = `<span class="loader"></span>`
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

function goback(){
  document.querySelector('.serarchform').classList.add('active');
}

function gofront(){
  document.querySelector('.serarchform').classList.remove('active');
}



// This code will be in script.js

// This function creates a new YouTube player in the specified container
function onYouTubeIframeAPIReady() {
  var player;
  player = new YT.Player('player', {
    videoId: 'Arwcr-09iug', // Replace 'VIDEO_ID_HERE' with the actual YouTube video ID
    playerVars: {
      autoplay: 1, // Auto-play the video when the player loads
      controls: 1, // Show video controls
      modestbranding: 1, // Hide YouTube logo
      rel: 0, // Don't show related videos at the end
      showinfo: 0, // Hide video title and uploader info
      fs: 1, // Show full-screen button
      cc_load_policy: 0, // Hide closed captions by default
      iv_load_policy: 3, // Hide video annotations by default
      autohide: 0 // Don't auto-hide video controls
    },
    events: {
      onReady: onPlayerReady
    }
  });
}

// The API will call this function when the video player is ready
function onPlayerReady(event) {
  // You can do something here when the video player is ready
}


function playvid(){
  close_mob_bar()
  var element = document.querySelector("#player");
  if (element) {
    element.scrollIntoView({
      behavior: "smooth", // Adds smooth scrolling behavior
      block: "start" // Scrolls to the top of the element
    });
  }
}