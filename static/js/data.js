$(document).on("click", "#button", function(e) {
  $.post("get_data", function(data_response, status) {
    charts = JSON.parse(data_response)["charts"];
    console.log(charts);
    $.each(charts, function(index, chart) {
      var container = document.getElementById("chartContainer");
      var new_canvas = document.createElement("canvas");
      ctx = new_canvas.getContext("2d");
      var scatterChart = new Chart(ctx, {
        type: "scatter",
        data: chart["data"],
      });
      container.appendChild(new_canvas);
    });
  });
});
