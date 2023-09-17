

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
let slideId = ["mySlides1", "mySlides2"]
showSlides(1, 0);
showSlides(1, 1);

function plusSlides(n, no) {
  showSlides(slideIndex[no] += n, no);
}

function showSlides(n, no) {
  let i;
  let x = document.getElementsByClassName(slideId[no]);
  if (n > x.length) { slideIndex[no] = 1 }
  if (n < 1) { slideIndex[no] = x.length }
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  x[slideIndex[no] - 1].style.display = "block";
}


function editProfile() {
  const myForm = document.querySelector('#myForm')
  myForm.style.display = "block";
  myForm.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
}

