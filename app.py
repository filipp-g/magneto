import json

from flask import Flask, render_template, request

from requests import get_chart

app = Flask(__name__)

with open('sample.json', 'r') as file:
    input_data = json.load(file)


@app.route('/')
def request_home():
    return render_template('home.html', magneto_json=input_data)


@app.route('/data')
def request_data():
    return render_template('data.html')


@app.route('/get_data', methods=["POST"])
def route_get_data():
    if request.method == "POST":
        date = request.form['date']
        interpol = request.form['interpol']
        outlier = request.form['outlier']
        return get_chart(date, outlier,interpol)


@app.route('/about')
def request_about():
    return render_template('about.html')

@app.route('/outliers')
def request_outliers():
    return render_template('outliers.html')

@app.route('/get_outliers', methods=["POST"])
def route_get_outliers():
    if request.method == "POST":
        date=request.form['date']
        return get_outliers_chart(date)

@app.route('/get_by_station', methods=["POST"])
def route_get_by_station():
    if request.method == "POST":
        st_no=request.form['station_no']
        return get_stations_chart(st_no)


if __name__ == '__main__':
    app.run(debug=True)
