var array = [];
array = details;
function serachforRoom() {
  var searchInput = document.getElementById('roomSearch').value; // Get the value from the input field
  
  // Your search logic here
  if (searchInput == "") {
    array = details;
  } else {
    details.forEach(function (item) {
      // Check if item and item.location are defined
      if (item && item.location && typeof item.location === 'string') {
        // Check if item.location contains 'searchInput' (case-insensitive)
        if (item.location.toLowerCase().includes(searchInput.toLowerCase())) {
          array.push(item);
        }
      }
    });
  }

}