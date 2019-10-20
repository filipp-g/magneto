// import grid-cache from 'grid-cache.js'

let map;
let markers = [];
let circles = [];
let num_sites = 0;
let total_activity = 0;

// let grid = JSON.parse(fs.readFileSync('./grid-cache.js').toString());

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 59.991699, lng: -101.407434},
        zoom: 3.5,
        fullscreenControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        scaleControl: true,
    });
    createMarkers("01-01");
}

function saveImg() {

    var zoom = map.zoom;
    var centre = map.getBounds().getCenter();
    var spherical = google.maps.geometry.spherical;
    bounds = map.getBounds();
    var cor1 = bounds.getNorthEast();
    var cor2 = bounds.getSouthWest();
    var cor3 = new google.maps.LatLng(cor2.lat(), cor1.lng()); 
    var cor4 = new google.maps.LatLng(cor1.lat(), cor2.lng());

    var width = distanceInPx(cor1, cor4);
    var height = distanceInPx(cor1, cor3);

    var imgUrl = "https://maps.googleapis.com/maps/api/staticmap?center=" + 
        centre.lat() + "," + centre.lng() + "&zoom=" + zoom + 
        "&size=" + width + "x" + height + "&maptype=terrain&key=AIzaSyDLieeiefNfkqBmCwm0FMLiQiXhqTM8p_k"; 
    
    for (let i = 0; i < markers.length; i++) {
        imgUrl += "&markers=color:red|" + markers[i].getPosition().lat() + "," + markers[i].getPosition().lng();
    }

    imgUrl += ".jpg";

    var link = document.getElementById('staticLink');
    link.setAttribute("href", imgUrl);
    link.style.display="block"; 
}

function distanceInPx(pos1, pos2) {
    var p1 = map.getProjection().fromLatLngToPoint(pos1);
    var p2 = map.getProjection().fromLatLngToPoint(pos2);

    var pixelSize = Math.pow(2, -map.getZoom());

    var d = Math.sqrt((p1.x-p2.x)*(p1.x-p2.x) + (p1.y-p2.y)*(p1.y-p2.y))/pixelSize;

    return Math.round(d);
}


function heatMapMaker(lat, lng, time) {
    return (grid[lat - 30][-30 - lng][time]);
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
        document.getElementById("staticLink").addEventListener("click", function(){
            // document.getElementById("demo").innerHTML = "Hello World";
            saveImg();
        });

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