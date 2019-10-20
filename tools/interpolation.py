from matplotlib import cm
from mpl_toolkits.mplot3d import Axes3D, proj3d
from scipy.interpolate import griddata
import matplotlib.pyplot as plt
import numpy as np
from tools.csaparser import parse_txt

full = parse_txt("../data/dataset2_full.txt")


def rev_lookup(grid, lat, long, time):
    return grid[int(lat) - 30][-30 - int(long)][time]


def interpol4d():
    points = []
    lvalues = []
    for site, values in full.items():
        time_cnt = 0
        for time, value in values['data'].items():
            points.append([values['lat'], values['long'], time_cnt])
            lvalues.append(value)
            time_cnt = time_cnt + 1

    # We have 12648 points
    # long , lat, time
    grid_x, grid_y, grid_z = np.mgrid[30:90:60j, -30:-190:160j, 0:743]
    points = np.array(points)
    lvalues = np.array(lvalues)
    grid_z0 = griddata(points, lvalues, (grid_x, grid_y, grid_z), method='linear')

    return grid_z0


def interpol3d(time):
    points = []
    lvalues = []
    for site, values in full.items():
        points.append([values['lat'],values['long']])
        lvalues.append(values['data'][time])

        # We have 12648 points
        # Latitude , long,
    grid_x, grid_y = np.mgrid[30:90, 30:190]

    points = np.array(points)
    lvalues = np.array(lvalues)
    grid_z0 = griddata(points, lvalues, (grid_x, grid_y), method='nearest')
    print(grid_z0)
    plt.subplot(222)
    plt.imshow(grid_z0.T, extent=(0, 1, 0, 1), origin='lower')
    plt.show()


# interpol3d("01-01")
result = interpol4d()
avg = 0
for loc, value in full.items():
    long = value['long']
    lat = value['lat']
    time_cnt = 0
    for time, ac_result in value['data'].items():
        print("Actual ", ac_result)
        print("Interpolated ", rev_lookup(result,lat,long,time_cnt))

        time_cnt = time_cnt + 1
