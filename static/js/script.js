let map;
let markers = [];
let circles = [];
let num_sites = 0;
let total_activity = 0;

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
                let content = '<div id="infowindow"><h6>' + key + '</h6>'
                    + '<p>' + 'magnetic field: ' + (magneto_json[key]["data"][day]).toLocaleString()
                    + '</p>'/*'Location'*/;
                infowindow.setContent(content);
                infowindow.open(map, marker);
                map.panTo(marker.position);
            }
        })(marker, num_sites));

        num_sites++;
        total_activity += magneto_json[key]["data"][day];
        setAverageActivity();

        markers.push(marker);
        circles.push(circle);
    }
}

function clearMarkers() {
    num_sites = 0;
    total_activity = 0;
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
        circles[i].setMap(null);
    }
    markers = [];
    circles = [];
}

Number.prototype.pad = function (size) {
    var s = String(this);
    while (s.length < (size || 2)) {
        s = "0" + s;
    }
    return s;
};

function intToDate(x) {
    return Math.floor(x / 24 + 1).pad(2) + "-" + ((x % 24) + 1).pad(2);
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

function setAverageActivity() {
    $("#map-average-activity").text((total_activity / num_sites).toFixed(4));
}

$(document).ready(function () {
    let slider = $("#map-date-slider");
    slider[0].value = 0;
    slider.focus();
});