from flask import Flask, render_template, request
from requests import get_chart

app = Flask(__name__)


@app.route('/')
def request_home():
    return render_template('home.html')


@app.route('/data')
def request_data():
    return render_template('data.html')


@app.route('/get_data', methods=["POST"])
def route_get_data():
    if request.method == "POST":
        date = request.form['date']
        return get_chart(date)


if __name__ == '__main__':
    app.run(debug=True)
