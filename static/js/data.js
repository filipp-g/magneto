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

var chart;
$(document).ready(function() {
    var ctx = $("#canvas");
    chart = new Chart(ctx, {
        type: "scatter",
        options: {
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    type: "linear",
                    position: "left",
                    ticks: {
                        suggestedMax: 1400,
                        min: 0,
                        stepSize: 200
                    }
                }],
                xAxes: [{
                    labelString: "Stations",
                    ticks: {
                        max: 25,
                        min: 0,
                        stepSize: 1,
                        // Include a dollar sign in the ticks
                        callback: function(value, index, values) {
                            return names[value];
                        }
                    }
                }]
            }
        }
    });

    redrawChart("01-01");
});

function updateChart(data) {
    chart.data.labels.pop();
    chart.data.datasets.pop();
    chart.data.labels.push(data_parsed["data"]["label"]);
    chart.data.datasets.push(data_parsed["data"]["datasets"]);

    chart.update({
        duration: 800,
        easing: "easeOutElastic"
    });
}

function redrawChart(date) {
    $.post("get_data", { date: date }, function(data_response, status) {
        data_parsed = JSON.parse(data_response);
        updateChart(data_parsed);
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


$(document).ready(function() {
    $('#interpol-radio-box').change(function() {
        selected_value = $("input[name='interpol']:checked");
        console.log(selected_value[0].id);
    });
});