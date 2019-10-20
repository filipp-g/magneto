let map;
let markers = [];
let circles = [];

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 59.991699, lng: -101.407434},
        zoom: 3.5,
        fullscreenControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        scaleControl: true
    });
    createMarkers("01-01");
}

function createMarkers(day) {
    clearMarkers();
    let i = 0;
    let infowindow = new google.maps.InfoWindow();
    for (let key in magneto_json) {
        let marker = new google.maps.Marker({
            position: new google.maps.LatLng(magneto_json[key]["lat"], magneto_json[key]["long"]),
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 0
            },
            map: map
        });
        let circle = new google.maps.Circle({
            map: map,
            radius: magneto_json[key]["data"][day] * 1000,    // 10 miles in metres
            fillColor: 'red',
            fillOpacity: .2,
            strokeColor: 'white',
            strokeWeight: .5
        });
        circle.bindTo('center', marker, 'position');

        google.maps.event.addListener(circle, 'click', (function (marker, i) {
            return function () {
                infowindow.setContent('<div id="infowindow"><h6>' + key + '</h6>' + '<p>' + 'magnetic field: ' + (magneto_json[key]["data"][0][1]).toLocaleString() + '</p>'/*'Location'*/);
                infowindow.open(map, marker);
                map.panTo(marker.position);
            }
        })(marker, i));
        markers.push(marker);
        circles.push(circle);
        i++;
    }
}

function clearMarkers() {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
        circles[i].setMap(null);
    }
    markers = [];
    circles = [];
}

// Doesnt not wait for user to release mouse
$(document).on("input", "#map-date-slider", function (e) {
    let date = intToDate(e.target.value);
    $("#map-current-date").text(date);
});

// Waits for user to release mouse
$(document).on("change", "#map-date-slider", function (e) {
    let date = intToDate(e.target.value);
    createMarkers(date);
});
