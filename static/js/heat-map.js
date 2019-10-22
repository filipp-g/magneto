let heatmap;
let heatMapData = [];
let markers = [];
let circles = [];
let num_sites = 0;
let total_activity = 0;

let grid = "";
$.get("static/data/grid-cache.txt", {}, function (content) {
    grid = JSON.parse(content);
});

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: {lat: 59.991699, lng: -101.407434},
        zoom: 3.2,
        fullscreenControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        scaleControl: true
    });

    heatmap = new google.maps.visualization.HeatmapLayer({
        map: map,
        radius: 15,
        opacity: 0.4
    });

    createMarkers(0);
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

    let imgUrl =
        "https://maps.googleapis.com/maps/api/staticmap?center=" +
        centre.lat() +
        "," +
        centre.lng() +
        "&zoom=" +
        zoom +
        "&size=" +
        width +
        "x" +
        height +
        "&maptype=terrain&key=AIzaSyDLieeiefNfkqBmCwm0FMLiQiXhqTM8p_k";

    for (let i = 0; i < markers.length; i++) {
        imgUrl +=
            "&markers=color:red|" +
            markers[i].getPosition().lat() +
            "," +
            markers[i].getPosition().lng();
    }

    imgUrl += ".jpg";

    let link = document.getElementById("staticLink");
    link.setAttribute("href", imgUrl);
    link.style.display = "block";
}

function distanceInPx(pos1, pos2) {
    let p1 = map.getProjection().fromLatLngToPoint(pos1);
    let p2 = map.getProjection().fromLatLngToPoint(pos2);

    let pixelSize = Math.pow(2, -map.getZoom());

    let d =
        Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y)) /
        pixelSize;

    return Math.round(d);
}

function heatMapMaker(lat, lng, time) {
    return grid[parseInt(lat) - 30][-30 - parseInt(lng)][parseInt(time)];
}

function createMarkers(day) {
    clearMarkers();
    let infowindow = new google.maps.InfoWindow();
    let dayStr = intToDate(day);

    if (grid != "") {
        for (lat = 45; lat <= 75; lat++) {
            for (long = -52; long >= -139; long--) {
                heatMapData.push({
                    location: new google.maps.LatLng(lat, long),
                    weight: heatMapMaker(lat, long, day)
                });
            }
        }
        heatmap.setData(heatMapData);
    }

    for (let key in heatmap_json) {
        let marker = new google.maps.Marker({
            position: new google.maps.LatLng(
                heatmap_json[key]["lat"],
                heatmap_json[key]["long"]
            ),
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 0
            },
            map: map
        });
        let circle = new google.maps.Circle({
            map: map,
            radius: 50000, // 10 miles in metres
            fillColor: "black",
            fillOpacity: 1,
            strokeColor: "white",
            strokeWeight: 0.5
        });
        circle.bindTo("center", marker, "position");

        google.maps.event.addListener(
            circle,
            "click",
            (function (marker, i) {
                return function () {
                    let content =
                        '<div id="infowindow"><h6>' +
                        key +
                        "</h6>" +
                        "<p>" +
                        "magnetic field: " +
                        heatmap_json[key]["data"][dayStr].toLocaleString() +
                        "</p>"; /*'Location'*/
                    infowindow.setContent(content);
                    infowindow.open(map, marker);
                    map.panTo(marker.position);
                };
            })(marker, num_sites)
        );

        num_sites++;
        total_activity += heatmap_json[key]["data"][dayStr];
        setAverageActivity();

        markers.push(marker);
        circles.push(circle);
    }
    document.getElementById("staticLink").addEventListener("click", function () {
        // document.getElementById("demo").innerHTML = "Hello World";
        saveImg();
    });
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
    heatMapData = [];
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
$(document).on("input", "#heatmap-date-slider", function (e) {
    let date = intToDate(e.target.value);
    $("#heatmap-current-date").text(date);
});

// Waits for user to release mouse
$(document).on("change", "#heatmap-date-slider", function (e) {
    createMarkers(e.target.value);
});

function setAverageActivity() {
    $("#map-average-activity").text((total_activity / num_sites).toFixed(4));
}

$(document).ready(function () {
    let slider = $("#heatmap-date-slider");
    slider[0].value = 0;
    slider.focus();
});
