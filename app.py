from flask import Flask, render_template, request
from requests import get_charts
import json
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
        # user_input_1 = request.form['user_input_1']
        # user_input_2 = request.form['user_input_2']
        return get_charts()


if __name__ == '__main__':
    app.run(debug=True)
