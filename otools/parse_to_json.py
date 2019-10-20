import json
import otools.extrememagnets as extrememagnets
import otools.requests as r
import numpy as np


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

path='data/dataset1.txt'
(names,raw_data)=get_stations_data(path)
raw_station_data=get_stations_matrix(raw_data)


def to_json_from_mat(time_period):
    json_data={}
    data_points_positive=[]
    data_points_negative=[]
    extremes=extrememagnets.find_outliers(raw_station_data)

    j=time_period
    for i in range(0, extremes.shape[0]-1):
        #for j in range(0, extremes.shape[1]-1):
        if(extremes[i,j]==1):
            data_points_negative.append({
                'x' : (i+1),
                'y' : raw_station_data[i,j]
            })
        else:
            data_points_positive.append({
                'x' : (i+1),
                'y' : raw_station_data[i,j]
            })
    negative_set={}
    negative_set['label']='good'
    negative_set['borderColor']='#3366ff'
    negative_set['data']=data_points_negative

    positive_set={}
    positive_set['label']='bad'
    positive_set['borderColor']='#ff5050'
    positive_set['data']=data_points_positive

    json_data['data']={'datasets': [positive_set, negative_set]}
    return json_data       

def to_json_by_station(station_no):
    json_data={}
    data_points_positive=[]
    data_points_negative=[]
    extremes=extrememagnets.find_outliers(raw_station_data)

    i=station_no
    for j in range(0, extremes.shape[1]-1):
        #for j in range(0, extremes.shape[1]-1):
        if(extremes[i,j]==1):
            data_points_negative.append({
                'x' : j,
                'y' : raw_station_data[i,j]
            })
        else:
            data_points_positive.append({
                'x' : j,
                'y' : raw_station_data[i,j]
            })
    negative_set={}
    negative_set['label']='good'
    negative_set['borderColor']='#3366ff'
    negative_set['data']=data_points_negative

    positive_set={}
    positive_set['label']='bad'
    positive_set['borderColor']='#ff5050'
    positive_set['data']=data_points_positive

    json_data['data']={'datasets': [positive_set, negative_set]}
    return json_data       

