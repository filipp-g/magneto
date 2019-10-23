let map;
let circles = [];
let site_keys = [];
let num_sites = 0;
let infowindow;

function initMap() {
    site_keys = Object.keys(map_json);
    num_sites = site_keys.length;

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 59.991699, lng: -101.407434},
        zoom: 3.2,
        fullscreenControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        scaleControl: true,
    });
    createCircles(0);
}

function createCircles(day) {
    infowindow = new google.maps.InfoWindow();
    let dayStr = intToDate(day);
    let total_activity = 0;

    for (let key of site_keys) {
        let reading = map_json[key]["data"][dayStr];
        let coords = new google.maps.LatLng(map_json[key]["lat"], map_json[key]["long"]);
        let circle = new google.maps.Circle({
            map: map,
            radius: reading * 1000,     // displays on map in meters
            center: coords,
            fillColor: 'red',
            fillOpacity: .2,
            strokeColor: 'white',
            strokeWeight: .5
        });
        circle.addListener('click', function () {
            infowindow.setPosition(coords);
            infowindow.setContent(getPopupInfo(key, circle));
            infowindow.open(map);
            map.panTo(coords);
        });
        total_activity += reading;
        circles.push(circle);
    }
    setAverageActivity(total_activity);
    document.getElementById("staticLink")
        .addEventListener("click", function () {
            saveImg();
        });
}

function setAverageActivity(activity) {
    $("#map-average-activity").text((activity / num_sites).toFixed(4));
}

function updateMarkers(day) {
    infowindow.close();
    let total_activity = 0;
    let dayStr = intToDate(day);
    for (let i = 0; i < site_keys.length; i++) {
        let reading = map_json[site_keys[i]]["data"][dayStr];
        circles[i].setRadius(reading * 1000);
        total_activity += reading;
    }
    setAverageActivity(total_activity);
}

function getPopupInfo(siteName, circle) {
    return '<div id="infowindow"><h6>' + siteName + '</h6>'
        + '<p>' + 'magnetic field: ' + (circle.getRadius() / 1000) + '</p>';
}

function saveImg() {
    let zoom = map.zoom;
    let centre = map.getBounds().getCenter();
    let spherical = google.maps.geometry.spherical;
    let bounds = map.getBounds();
    let cor1 = bounds.getNorthEast();
    let cor2 = bounds.getSouthWest();
    let cor3 = new google.maps.LatLng(cor2.lat(), cor1.lng());
    let cor4 = new google.maps.LatLng(cor1.lat(), cor2.lng());

    let width = distanceInPx(cor1, cor4);
    let height = distanceInPx(cor1, cor3);

    let imgUrl = "https://maps.googleapis.com/maps/api/staticmap?center=" +
        centre.lat() + "," + centre.lng() + "&zoom=" + zoom +
        "&size=" + width + "x" + height + "&maptype=terrain&key=AIzaSyDLieeiefNfkqBmCwm0FMLiQiXhqTM8p_k";

    for (let i = 0; i < circles.length; i++) {
        imgUrl += "&markers=color:red|" + circles[i].getCenter().lat() + "," + circles[i].getCenter().lng();
    }
    imgUrl += ".jpg";
    let link = document.getElementById('staticLink');
    link.setAttribute("href", imgUrl);
    link.style.display = "block";
}

function distanceInPx(pos1, pos2) {
    let p1 = map.getProjection().fromLatLngToPoint(pos1);
    let p2 = map.getProjection().fromLatLngToPoint(pos2);
    let pixelSize = Math.pow(2, -map.getZoom());
    let d = Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y)) / pixelSize;
    return Math.round(d);
}

Number.prototype.pad = function (size) {
    let s = String(this);
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
    updateMarkers(e.target.value);
});

$(document).ready(function () {
    let slider = $("#map-date-slider");
    slider[0].value = 0;
    slider.focus();
});