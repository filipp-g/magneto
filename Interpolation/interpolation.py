import json
from scipy.interpolate import griddata
import numpy as np


def estimate_value_3d(grid, lat, long, time):
    return grid[int(lat) - 30][-30 - int(long)][time]


# Return a grid of values estimating measurements at points all over Canada
def interpol3d(data,method):
    points = []
    lvalues = []
    for site, values in data.items():
        time_cnt = 0
        for time, value in values['data'].items():
            if not np.math.isnan(value):
                points.append([values['lat'], values['long'], time_cnt])
                lvalues.append(value)
            time_cnt = time_cnt + 1

    grid_longitude, grid_latitude, grid_time = np.mgrid[30:90:500j, -30:-190:500j, 0:744]
    points = np.array(points)
    lvalues = np.array(lvalues)
    return griddata(points, lvalues, (grid_longitude, grid_latitude, grid_time), method=method)


def interpol2dNoTime(data, time, method):
    points = []
    lvalues = []
    for site, values in data.items():
        value = values['data'][time]
        if not np.math.isnan(value):
            points.append([values['lat'], values['long']])
            lvalues.append(value)

    # long 45.4 74.69
    # lat -139.11 -52.68
    grid_longitude, grid_latitude = np.mgrid[45:75:2000j, -52:-139:2000j]
    points = np.array(points)
    lvalues = np.array(lvalues)
    return griddata(points, lvalues, (grid_longitude, grid_latitude), method=method)


# Return a grid of values estimating results at stations
def interpol2d(data, method='linear'):
    points = []
    lvalues = []
    station_index = 0
    for site, values in data.items():
        time_cnt = 0
        for time, value in values['data'].items():
            if not np.math.isnan(value):
                points.append([station_index, time_cnt])
                lvalues.append(value)
            time_cnt = time_cnt + 1
        station_index = station_index + 1

    # Sample points at all stations from all times
    grid_stations, grid_time = np.mgrid[0:station_index, 0:744]
    points = np.array(points)
    lvalues = np.array(lvalues)
    return griddata(points, lvalues, (grid_stations, grid_time), method=method)
