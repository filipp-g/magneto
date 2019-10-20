
from math import radians, sin, cos, acos

def distance_between_points(slat, slon, elat, elon):
    return 6371.01 * acos(sin(slat)*sin(elat) + cos(slat)*cos(elat)*cos(slon - elon))