function toggleNavbar(collapseID) {
  document.getElementById(collapseID).classList.toggle("hidden");
  document.getElementById(collapseID).classList.toggle("block");
}


function messagehandle(event) {
event.preventDefault(); // Prevent the default form submission

const form = document.getElementById('messageForm');

// Get the email, message, and name values from the form fields
const email = form.querySelector('input[name="email"]').value;
const message = form.querySelector('textarea[name="message"]').value;
const name = form.querySelector('input[name="name"]').value;

fetch('/landing', {
method: 'POST',
body: JSON.stringify({ email, message, name }), // Updated the field names
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
      window.location.href = '/landing'; // Correct the redirection URL
    });
  } else {
    // Display an error pop-up
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: data.message
    });
  }
});
}

const form = document.getElementById('messageForm');
form.addEventListener('submit', messagehandle); // Attach the event listener
