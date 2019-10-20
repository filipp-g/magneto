import requests as r
import numpy as np
import matplotlib.pyplot as plt
import json
import otools.longlat_dist as lld
from math import sqrt
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
import otools.estimate_db as est

def get_stations_coordinates(raw_data):
    stations_coords={}
    stations_coords["lon"]=[]
    stations_coords["lat"]=[]
    for i in range(0, len(raw_data)):
        stations_coords["lon"].append(raw_data[i]["long"])
        stations_coords["lat"].append(raw_data[i]["lat"])
    return stations_coords

def get_stations_matrix(raw_data):
    raw_station_db=[]
    for i in range(0, len(raw_data)):
        raw_station_db.append(np.array(raw_data[i]["data"]))
    raw_station_data=np.matrix(raw_station_db)
    return raw_station_data


def get_stations_data(path):
    stations=r.parse_txt(path)
    names=list(stations.keys())
    raw_data=list(stations.values())
    return (names, raw_data)

def get_station_extremes(raw_station_data):
    se=[]
    for i in range(0, raw_station_data.shape[0]):
        se.append(est.get_extremes_for_station(i, raw_station_data))
    return se

def get_extremes_for_time(raw_station_data):
    te=[]
    for i in range(0, raw_station_data.shape[1]):
        te.append(est.get_extremes_for_time(i, raw_station_data))
    return te

def find_outliers(raw_station_data):
    se=np.matrix(get_station_extremes(raw_station_data))
    te=np.matrix(get_extremes_for_time(raw_station_data))
    
    te_t=np.transpose(te)
    common_ex=np.multiply(se, te_t)
    return common_ex

def get_outliers(names, raw_station_data):
    outliers=find_outliers(raw_station_data)
    extremes=[]
    for i in range(0, outliers.shape[0]):
        for j in range(0, outliers.shape[1]):
            if(outliers[i,j]==1):
                print(names[j]+" "+str(i))
