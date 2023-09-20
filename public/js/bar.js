function mob_bar() {
  const mobile_nav = document.querySelector('.mobile-nav');
  const close_mob_bar = document.querySelector('.close_baaar');
  const baaar = document.querySelector('.baaar');
  mobile_nav.style.display = "block";
  close_mob_bar.style.display = "block";
  baaar.style.display = "none";
}

function close_mob_bar() {
  const mobile_nav = document.querySelector('.mobile-nav');
  const close_mob_bar = document.querySelector('.close_baaar');
  const baaar = document.querySelector('.baaar');
  mobile_nav.style.display = "none";
  close_mob_bar.style.display = "none";
  baaar.style.display = "block";
}


function handleWindowSizeChange() {
  const screenWidth = window.innerWidth;
  const mobile_nav = document.querySelector('.mobile-nav');
  const close_mob_bar = document.querySelector('.close_baaar');
  const baaar = document.querySelector('.baaar');

  if (screenWidth >= 731) {
    mobile_nav.style.display = "none";
    close_mob_bar.style.display = "none";
    baaar.style.display = "block";
  }
}

// Attach an event listener to the window's resize event
window.addEventListener('resize', handleWindowSizeChange);

// Call the function initially to handle the initial screen size
handleWindowSizeChange();