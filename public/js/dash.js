

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(sendLocation);
  } else {
    alert('Geolocation is not supported by this browser.');
  }
}

async function sendLocation(position) {
  const { latitude, longitude } = position.coords;

  // Make an API request to OpenCage Geocoding using fetch
  try {
    const apiKey = "39a5aeb3daa64655b405c79ad98952ba"
    const apiUrl = `https://api.opencagedata.com/geocode/v1/json?key=${apiKey}&q=${latitude},${longitude}`;
    const response = await fetch(apiUrl);
    if (response.ok) {
      const data = await response.json();
      if (data.results.length > 0) {
        const location = data.results[0].formatted;

        // Set the value of the "location" input field with the retrieved address
        const locationInput = document.getElementById('location');
        locationInput.value = location;
      } else {
        console.log('Address not found.');
      }
    } else {
      console.error('Error fetching address:', response.status);
    }
  } catch (error) {
    console.error('Error fetching address:', error);
  }

}

function deleteImage(button) {
  var res = confirm("Are you sure you want to delete this Image?")

  if (res) {
    deletecurrnetImage(button)
  }
}


function deletecurrnetImage(button) {
  const imageId = button.getAttribute('data-id');

  // Make an HTTP DELETE request to the server to delete the image by its _id
  fetch(`/deleteImage/${imageId}`, {
    method: 'DELETE',
  })
    .then((response) => {
      if (response.status === 204) {
        // The image was successfully deleted
        // You can update the UI or perform any other necessary actions
        location.reload(); // Refresh the page to reflect the updated image list
      } else {
        // Handle error response
        console.error('Failed to delete image');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}


let slideIndex = [1, 1];
showSlides(1, 0);
showSlides(1, 1);

function plusSlides(n, no) {
  showSlides(slideIndex[no] += n, no);
}

function showSlides(n, no) {
  let i;
  let x = document.getElementsByClassName('mySlides1');
  let y = document.getElementsByClassName('mySlides2');
  let z = document.getElementsByClassName('mySlides3');
  if (n > x.length) { slideIndex[no] = 1 }
  if (n < 1) { slideIndex[no] = x.length }
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
    y[i].style.display = "none";
    z[i].style.display = "none";
  }
  x[slideIndex[no] - 1].style.display = "block";
  y[slideIndex[no] - 1].style.display = "block";
  z[slideIndex[no] - 1].style.display = "block";

}


function editProfile() {
  const myForm = document.querySelector('#myForm')
  myForm.style.display = "block";
  myForm.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
}



// JavaScript functions to open and close the image modal
function openImage(image) {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');

  modal.style.display = 'block';

  // Adding the 'show' class to trigger the transition
  modal.classList.add('show');

  modalImg.src = image.src;
}

function closeImageModal() {
  const modal = document.getElementById('imageModal');

  // Removing the 'show' class to trigger the transition
  modal.classList.remove('show');

  // Setting a timeout to hide the modal after the transition
  setTimeout(() => {
    modal.style.display = 'none';
  }, 300); // Adjust the timeout to match your transition duration (0.3s in this example)
}

function openPhoneDialer(phoneNumber) {
  // Use the 'tel:' link to initiate a phone call with the received phone number
  window.location.href = `tel:${phoneNumber}`;
}



const shareButton = document.getElementById('share-button');

// Check if the Web Share API is available in the browser

function sharebutton() {
  if (navigator.share) {
    console.log('eee');
    // Get the current URL
    const currentUrl = window.location.href;

    // Call the share() method with the current URL
    navigator.share({
      title: 'Share Title',
      text: 'Share Description',
      url: currentUrl, // Use the current URL
    })
      .then(() => console.log('Shared successfully'))
      .catch((error) => console.error('Error sharing:', error));
  } else {
    // Web Share API is not supported in this browser, provide a fallback
    // You can provide a fallback sharing method here, like opening a share dialog or copying the link to the clipboard.
    alert('Web Share API is not supported in this browser.');
  }
}
