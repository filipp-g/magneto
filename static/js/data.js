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
            scales: {
                yAxes: [{
                    type: "linear",
                    position: "left",
                    ticks: {
                        max: 600,
                        min: 0,
                        stepSize: 200,
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
});

var redraw_cache = {};

function updateChart(data) {
    chart.data.labels.pop();
    chart.data.datasets.pop();
    chart.data.labels.push(data_parsed["data"]["label"]);
    chart.data.datasets.push(data_parsed["data"]["datasets"]);

    chart.update({
        duration: 800,
        easing: "easeOutBounce"
    });
}

function redrawChart(date) {
    if (date in redraw_cache) {
        updateChart(redraw_cache[date]);
    } else {
        $.post("get_data", { date: date }, function(data_response, status) {
            data_parsed = JSON.parse(data_response);
            redraw_cache[date] = data_parsed;
            updateChart(data_parsed);
        });
    }
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