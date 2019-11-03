import copy
import math
import numpy as np
import matplotlib.pyplot as plt
from matplotlib import pyplot

from Interpolation.csaparser import parse_txt
from Interpolation.interpolation import interpol3d, interpol2d, interpol2dNoTime, estimate_value_3d

data1 = parse_txt("../data/dataset1.txt")
data2_full = parse_txt("../data/dataset2_full.txt")
data2_holed = parse_txt("../data/dataset2_holed.txt")
datasets = [data1, data2_full, data2_holed]


def calc_error(result_values, actual_values):
    deviation = []
    for key in result_values['MEA']['data']:
        x = result_values['MEA']['data'][key]
        y = actual_values['MEA']['data'][key]
        deviation.append(math.fabs(x - y))

    sum = 0
    average_deviation = 0
    for dev in deviation:
        sum += dev * dev
        average_deviation += dev
    standard_deviation = math.sqrt(sum / (len(deviation) - 1))
    average_deviation /= len(deviation)
    print("SD: ", standard_deviation)
    print("Average Deviation:", average_deviation)
    print("Standard Error: ", standard_deviation / math.sqrt(len(deviation)))
    print()


# Calls interpol and fills any NaN values with estimate
def get_interpol(data, method):
    output = copy.deepcopy(data)
    grid = interpol2d(output, method)
    station_index = 0
    for site, values in output.items():
        time_cnt = 0
        for time, value in values['data'].items():
            if np.math.isnan(value):
                output[site]['data'][time] = grid[station_index][time_cnt]
            time_cnt = time_cnt + 1
        station_index = station_index + 1
    return output


def get_interpol3D(data, method):
    output = copy.deepcopy(data)
    grid = interpol3d(output, method)
    for site, values in output.items():
        time_cnt = 0
        for time, value in values['data'].items():
            if np.math.isnan(value):
                output[site]['data'][time] = estimate_value_3d(grid, values['lat'], values['long'], time_cnt)
            time_cnt = time_cnt + 1
    return output


def compare_methods():
    # Create a test set removing MEA data
    data2_holed_test = copy.deepcopy(data2_full)
    for key in data2_holed_test['MEA']['data']:
        data2_holed_test['MEA']['data'][key] = np.nan

    print("Nearest 2D")
    nearest_test = get_interpol(data2_holed_test, 'nearest')
    calc_error(nearest_test, data2_full)

    print("Bilinear 2D")
    linear_test = get_interpol(data2_holed_test, 'linear')
    calc_error(linear_test, data2_full)

    print("Cubic 2D")
    cubic_test = get_interpol(data2_holed_test, 'cubic')
    calc_error(cubic_test, data2_full)

    print("Nearest 3D")
    nearest_3d = get_interpol3D(data2_holed_test, 'nearest')
    calc_error(nearest_3d, data2_full)

    print("Trilinear 3D")
    trilinear = get_interpol3D(data2_holed_test, 'linear')
    calc_error(trilinear, data2_full)


def run_linear_on_datasethole():
    result = get_interpol(data2_holed, 'linear')
    print(result)
    print(result['MEA'])


def run_trilinear_on_datasethole():
    result = get_interpol3D(data2_holed, 'linear')
    print(result)
    print(result['MEA'])


def noTimeInterpol():
    plt.subplot(331)
    plt.imshow(interpol2dNoTime(data2_full, "28-10", 'nearest').T, cmap=pyplot.cm.Greens)
    plt.title('Nearest 2D')
    plt.subplot(332)
    plt.imshow(interpol2dNoTime(data2_full, "28-10", 'linear').T, cmap=pyplot.cm.Greens)
    plt.title('Bilinear 2D')
    plt.subplot(333)
    plt.imshow(interpol2dNoTime(data2_full, "28-10", 'cubic').T, cmap=pyplot.cm.Greens)
    plt.title('Cubic 2D')
    plt.show()


def calc_max_lat_long():
    max_lat = max_long = -99999999
    min_lat = min_long = 999999999

    for dataset in datasets:
        for station, values in dataset.items():
            max_lat = max(max_lat, values['lat'])
            min_lat = min(min_lat, values['lat'])

            max_long = max(max_long, values['long'])
            min_long = min(min_long, values['long'])
    print(min_lat, max_lat)
    print(min_long, max_long)


grid = interpol3d(data2_full, 'linear')

f = open('data2_full_3d_linear_large.txt', 'w')
f.write(str(grid.tolist()))