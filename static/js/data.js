window.onload = function() {};
data = null;
$(document).on("click", "#button", function(e) {
  console.log("click");
  $.post("get_data", function(data_response, status) {
    data_json = JSON.parse(data_response);
    data = data_json;
    var ctx = document.getElementById("canvas").getContext("2d");

    var scatterChart = new Chart(ctx, {
      type: "scatter",
      data: {
        datasets: data_json
      },
      options: {
        scales: {
          xAxes: [
            {
              type: "linear",
              position: "bottom"
            }
          ]
        }
      }
    });
  });
});
