var chart;
var station_chart;

const names = [
    "BACK",
    "FCHP",
    "FCHU",
    "FSIM",
    "FSMI",
    "GILL",
    "LGRR",
    "MCMU",
    "MSTK",
    "NORM",
    "POLS",
    "RABB",
    "THRF",
    "VULC",
    "WEYB",
    "WGRY",
    "BLC",
    "BRD",
    "CBB",
    "FCC",
    "IQA",
    "MEA",
    "OTT",
    "RES",
    "STJ",
    "VIC"
];

Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {
        s = "0" + s;
    }
    return s;
};

function intToDate(x) {
    return Math.floor(x / 24 + 1).pad(2) + "-" + ((x % 24) + 1).pad(2);
}

function redrawChart(date) {
    $.post("get_outliers", { date: date }, function(data_response, status) {
        updateChart(data_response);
    });
}

// Doesnt not wait for user to release mouse
$(document).on("input", "#date-slider", function(e) {
    date = intToDate(e.target.value);
    $("#current-date").text(date);
});

// Waits for user to release mouse
$(document).on("change", "#date-slider", function(e) {
    date = intToDate(e.target.value);
    redrawChart(date);
});

function searchbystation(){
    console.log("here");
    var st_no=$("select[name='selectst'] option:selected").index()
    //var st_no=$('#selectstation').val();
    console.log(st_no);
    $.post("get_by_station", { station_no: st_no }, function(data_response, status) {
        updateStationChart(data_response);
    });
}

function updateStationChart(new_chart_data){
    station_chart.data=new_chart_data.data;
    station_chart.update({
        duration: 800,
        easing: "easeOutElastic"
    });
}

function updateChart(new_chart_data) {
    //console.log("here");
    //new_chart_data.data.labels=names;
    chart.data=new_chart_data.data;

    chart.update({
        duration: 800,
        easing: "easeOutElastic"
    });
}

$(document).ready(function() {
    var ctx = $("#canvas");
    chart = new Chart(ctx, {
        type: "scatter"
    });
    var ctx = $("#st_canvas");
    station_chart = new Chart(ctx, {
        type: "scatter",
    });


    redrawChart("01-01");
});


