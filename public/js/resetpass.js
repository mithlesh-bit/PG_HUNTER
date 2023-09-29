document.addEventListener("DOMContentLoaded", function () {
  const resetPasswordForm = document.getElementById("resetPasswordForm");
  resetPasswordForm.addEventListener("submit", function (e) {
    e.preventDefault();
    // Get the form data
    const formData = new FormData(resetPasswordForm);
    const password = formData.get("password");
    const password2 = formData.get("password2");
console.log("hii");
    // Get the _id and token from the URL
    const pathSegments = window.location.pathname.split('/');
const _id = pathSegments[2];
const token = pathSegments[3]; 
    // Send a POST request to the server
    fetch(`/reset-pass/:_id/:token`, {
      method: "POST",
      body: JSON.stringify({ password, password2, _id , token}),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          // Password updated successfully
          Swal.fire({
            icon: "success",
            title: "Success",
            text: data.message,
          }).then(() => {
            // Redirect or perform other actions after displaying the success message
            window.location.href = "/";
          });
        } else {
          // Password update failed
          Swal.fire({
            icon: "error",
            title: "Error",
            text: data.message,
          });
        }
      })
      .catch((error) => {
        // An error occurred while updating the password
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while updating the password",
        });
      });
  });
});