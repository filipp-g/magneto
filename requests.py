import json

# Very basic example of how to load data to chart.js
# Need to add user data to post request to process data and need to split to multiple graphs
from tools.csaparser import parse_txt


def _build_chart(type, data, options):
    output = {'type': type,
              'data': data}
    if options is not None:
        output['options'] = options

    return output


def get_chart(date):
    ly = []
    for station, values in get_chart.data.items():
        ly.append(values['data'].get(date))

    lx = range(0, len(ly) - 1)
    data = [{'x': x, 'y': y} for x, y in zip(lx, ly)]
    chart = _build_chart('line', {
        'datasets': {
            'label': 'data',
            'data': data}
    }, None)
    return json.dumps(chart)


get_chart.data = parse_txt('data/dataset1.txt')
