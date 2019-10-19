var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 59.991699, lng: -101.407434},
        zoom: 3.5,
    });

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
            radius: magneto_json[key]["data"][0][0] * 1000,    // 10 miles in metres
            fillColor: 'red',
            fillOpacity: .2,
            strokeColor: 'white',
            strokeWeight: .5
        });
        circle.bindTo('center', marker, 'position');
    }
}
