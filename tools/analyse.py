# Goes through each station and calculates the maximum difference between two stations for each time slow
# Outputs an array of all timeslots containing the max deference
import json

from scipy.interpolate import interp1d

from tools.csaparser import parse_txt
import numpy as np
from scipy import interpolate


def get_max_delta(data):
    output = []

    # date, min, max
    cache = {}

    for station, values in data.items():
        for x, y in values['data']:
            if x not in cache:
                cache[x] = {'min': 9999999, 'max': -1}
            cache[x]['min'] = min(cache[x]['min'], y)
            cache[x]['max'] = max(cache[x]['max'], y)
    return cache


def hide():
    full = parse_txt("../data/dataset2_full.txt")
    deltas = get_max_delta(full)
    # for time, val in deltas.items():
    #    print(str(time) + " Min: " + str(val['min']) + " Max: " + str(val['max']))
    print(json.dumps(full))
    a, y = zip(*full['DAWS']['data'])
    x = range(0, len(y))
    f = interp1d(x, y)
    f2 = interp1d(x, y, kind='cubic')
    xnew = np.linspace(1, len(y)-1, num=41, endpoint=True)
    import matplotlib.pyplot as plt
    print(xnew)
    plt.plot(x, y, 'o', xnew, f(xnew), '-', xnew, f2(xnew), '--')
    plt.legend(['data', 'linear', 'cubic'], loc='best')
    plt.show()


full = parse_txt("../data/dataset2_full.txt")
r = [station for station, e in full.items()]
print(r)

exit()
import numpy as np
from scipy.interpolate import griddata
import matplotlib.pyplot as plt
import numpy.ma as ma
from numpy.random import uniform, seed
# make up some randomly distributed data
seed(1234)
npts = 200
x = uniform(-2,2,npts)
y = uniform(-2,2,npts)
z = x*np.exp(-x**2-y**2)
# define grid.
xi = np.linspace(-2.1,2.1,100)
yi = np.linspace(-2.1,2.1,100)
# grid the data.
zi = griddata((x, y), z, (xi[None,:], yi[:,None]), method='cubic')
# contour the gridded data, plotting dots at the randomly spaced data points.
CS = plt.contour(xi,yi,zi,15,linewidths=0.5,colors='k')
CS = plt.contourf(xi,yi,zi,15,cmap=plt.cm.jet)
plt.colorbar() # draw colorbar
# plot data points.
plt.scatter(x,y,marker='o',c='b',s=5)
plt.xlim(-2,2)
plt.ylim(-2,2)
plt.title('griddata test (%d points)' % npts)
plt.show()

