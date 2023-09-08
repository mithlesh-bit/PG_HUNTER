const http = new XMLHttpRequest()
let result = document.querySelector([res])

document.querySelector([share]).addEventListener("click",()=>{
  findMyCordinates()

})

function findMyCordinates() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (postion)=>{
        const bdcAPI =  `https://api-bdc.net/data/reverse-geocode-with-timezone?
        latitude=${postion.coords.latitude}&longitude=${postion.coords.longitude}`   
        getAPI(bdcAPI)
      },
      (error)=>{
        console.log(error.message);
      }
    );
  } else {
    alert('Geolocation is not supported by this browser.');
  }
}

function getAPI(bdcAPI){
  http.open('GET', bdcAPI)
  http.send()
  http.onreadystatechange = () => {
    if (this.readyState === 4 && http.status === 200) {
      result.innerHTML = this.responseText
    }
  }
}