import json

# Very basic example of how to load data to chart.js
# Need to add user data to post request to process data and need to split to multiple graphs
from our_tools.csaparser import parse_txt
from our_tools.outliers import calc_outliers

from otools import parse_to_json

def get_outliers_chart(date):
    int_date_day=int(date.split('-')[0])
    int_date_hour=int(date.split('-')[1])

    int_date=(24*(int_date_day-1))+int_date_hour
  
    resp=parse_to_json.to_json_from_mat(int_date)
    return resp

def get_stations_chart(station_no):
    resp=parse_to_json.to_json_by_station(int(station_no))
    return resp


def get_chart(date, outlier_method,interpol_method):
    ly = []
    for station, values in get_chart.data.items():
        ly.append(values['data'].get(date))

    lx = range(0, len(ly) - 1)

    good, outliers = calc_outliers([(x,y) for x,y in zip(lx,ly)], outlier_method)

    chart = {'datasets': [
        {
            'label': 'Good',
            'data': [{'x': x, 'y': y} for x, y in good],
            'pointBackgroundColor': '#007bff'
        },
        {
            'label': 'Outlier',
            'data': [{'x': x, 'y': y} for x, y in outliers],
            'pointBackgroundColor': '#ff0000'
        }
    ]
    }
    return json.dumps(chart)


get_chart.data = parse_txt('data/dataset1.txt')
