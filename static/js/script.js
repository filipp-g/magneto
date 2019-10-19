var map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 59.991699, lng: -101.407434 },
    zoom: 1
  });
}
