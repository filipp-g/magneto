import csv


def parse_txt(csv_reader):
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
            for i in xrange(4, len(row), 4):
                station_headers.append(row[i])
                stations[row[i]] = {'long': row[i + 1],
                                    'lat': row[i + 2],
                                    'site_id': row[i + 3] if i + 3 < len(row) else '',
                                    'data': []}
        if index > 3:
            header_index = 0
            for i in xrange(4, len(row), 4):
                stations[station_headers[header_index]]['data'].append((row[0], row[i]))
                header_index = header_index + 1
    return stations


# Path: The path to a CSV file containing the questionable data
# Returns a pair of two lists. First list is valid data second is questionable
def validate_dataset(path):
    with open(path) as csv_file:
        csv_reader = csv.reader(csv_file, delimiter='\t')
        parsed = parse_txt(csv_reader)
        for location, values in parsed.items():
            print(location)


validate_dataset('data/dataset1.txt')
