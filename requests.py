import csv
import json


# Given a path to data file. parse it into a map
def parse_txt(path):
    with open(path) as csv_file:
        csv_reader = csv.reader(csv_file, delimiter='\t')
        index = -1
        station_headers = []
        stations = dict()
        for row in csv_reader:
            index = index + 1
            # Ignore first line
            if index is 0:
                continue

            # Parse the locations
            if index is 1:
                for i in range(4, len(row), 4):
                    station_headers.append(row[i])
                    stations[row[i]] = {
                        'long': row[i + 1],
                        'lat': row[i + 2],
                        'site_id': row[i + 3] if i + 3 < len(row) else '',
                        'data': []
                    }
            if index > 3:
                header_index = 0
                for i in range(4, len(row), 4):
                    stations[station_headers[header_index]]['data'].append(
                        (int(''.join(row[0].split('-'))), float(row[i])))
                    header_index = header_index + 1
        return stations


# Very basic example of how to load data to chart.js
# Need to add user data to post request to process data and need to split to multiple graphs
def get_data():
    output = []
    for station, values in parse_txt("data/dataset1.txt").items():
        data = []
        for x, y in values['data']:
            data.append({'x': x, 'y': y})

        output.append({
            'label': station,
            'data': data
        })

    return json.dumps(output)
