import json



# Very basic example of how to load data to chart.js
# Need to add user data to post request to process data and need to split to multiple graphs
from tools.csaparser import parse_txt


def get_charts():
    output = {'charts': []}
    parsed = parse_txt("data/dataset1.txt")
    for station, values in parsed.items():
        data = []

        for x, y in values['data']:
            data.append({'x': x, 'y': y})

        output['charts'].append({
            'options':
                {'title': {
                    'display': 'true',
                    'text': station}
                },

            'label': station,
            'data': {
                'datasets': [{
                    'label': 'Scatter Dataset',
                    'data': data
                }]
            },

        })
    return json.dumps(output)
