# Given a path to data file. parse it into a map
import csv


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
                        (int(''.join(row[0].split('-'))),
                         float(-1 if row[i] == "" else row[i])))

                    header_index = header_index + 1
        return stations


# Goes through each station and calculates the maximum difference between two stations for each time slow
# Outputs an array of all timeslots containing the max deference
def get_max_delta(data):
    output = []
    for station, values in data.items():
        for data in values['data']:
            pass




full = parse_txt("../data/dataset2_full.txt")
get_max_delta(full)
