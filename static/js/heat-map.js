let map;
let heatmap;
let pointArray;
let infowindow;

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
    pointArray = new google.maps.MVCArray();
    heatmap = new google.maps.visualization.HeatmapLayer({
        map: map,
        data: pointArray,
        radius: 15,
        opacity: 0.4
    });
    constructArray(pointArray, 0);
    createMarkers();
}

async function constructArray(pointArray, day) {
    insertFakePoint();
    while (grid === "") {
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    for (let lat = 45; lat <= 75; lat++) {
        for (let long = -52; long >= -139; long--) {
            pointArray.push({
                location: new google.maps.LatLng(lat, long),
                // pass in day as number, don't need parseInt() for lat, long
                weight: grid[lat - 30][-30 - long][day]
            });
        }
    }
}

// we insert a fake point in antarctica with a high weight value so that the other
// points have a constant point of reference. without this the map colors itself
// relative to the highest value for that day, ie. will color the whole map red if
// all weights are zero, since zero is the highest number on that map
function insertFakePoint() {
    pointArray.push({
        location: new google.maps.LatLng(-80, 80),
        weight: 1000
    });
}

function updatePointArray(day) {
    infowindow.close();
    pointArray.clear();
    constructArray(pointArray, day);
}

function createMarkers() {
    infowindow = new google.maps.InfoWindow();

    for (let key in heatmap_json) {
        let coords = new google.maps.LatLng(heatmap_json[key]["lat"], heatmap_json[key]["long"]);
        let marker = new google.maps.Marker({
            position: coords,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                strokeWeight: 1,
                fillOpacity: .2,
                scale: 6
            },
            map: map
        });
        marker.addListener('click', function () {
            infowindow.setContent(getPopupInfo(key));
            infowindow.open(map, marker);
            map.panTo(coords);
        });
    }
}

function getPopupInfo(siteName) {
    return '<div id="infowindow"><h6>' + siteName + '</h6>'
        + '<p>' + 'magnetic field: '
        + heatmap_json[siteName]["data"][intToDate($("#heatmap-date-slider")[0].value)]
        + '</p>';
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

// Does not wait for user to release mouse
$(document).on("input", "#heatmap-date-slider", function (e) {
    let date = intToDate(e.target.value);
    $("#heatmap-current-date").text(date);
    updatePointArray(e.target.valueAsNumber);
});

$(document).ready(function () {
    let slider = $("#heatmap-date-slider");
    slider[0].value = 0;
    slider.focus();
});
