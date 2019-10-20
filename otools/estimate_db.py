import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures

def estimate_by_station(i, j, raw_station_data):
    y=np.transpose(np.array(raw_station_data[i, :]))
    x=np.array(range(1, len(y)+1))
    b=np.array(np.ones(len(x)))
    X=np.transpose(np.matrix([x, b]))

    poly2=PolynomialFeatures(degree=3)
    X_poly=poly2.fit_transform(X)
    poly2.fit(X_poly, y)

    lin2=LinearRegression()
    lin2.fit(X_poly, y)

    return lin2.predict(poly2.fit_transform(np.matrix([(j+1), 1])))

def get_extremes_for_station(i, raw_station_data):
    extremes=[]
    y=np.transpose(np.array(raw_station_data[i, :]))
    x=np.array(range(1, len(y)+1))
    b=np.array(np.ones(len(x)))
    X=np.transpose(np.matrix([x, b]))

    poly2=PolynomialFeatures(degree=3)
    X_poly=poly2.fit_transform(X)
    poly2.fit(X_poly, y)

    lin2=LinearRegression()
    lin2.fit(X_poly, y)
    predictions=lin2.predict(poly2.fit_transform(X))
    differences=y-predictions

    diff_mean=differences.mean()
    diff_stddev=differences.std()
    for i in range(0, len(differences)):
        if(abs(differences[i]-diff_mean)>diff_stddev):
            extremes.append(1)
        else:
            extremes.append(0)
    return extremes


def get_extremes_for_time(j, raw_station_data):
    extremes=[]
    y=np.array((raw_station_data[:,j]))
    x=np.array(range(1, len(y)+1))
    b=np.array(np.ones(len(x)))
    X=np.transpose(np.matrix([x,b]))

    poly2=PolynomialFeatures(degree=3)
    X_poly=poly2.fit_transform(X)
    poly2.fit(X_poly, y)

    lin2=LinearRegression()
    lin2.fit(X_poly, y)

    predictions=lin2.predict(poly2.fit_transform(X))
    differences=y-predictions

    diff_mean=differences.mean()
    diff_stddev=differences.std()
    for i in range(0, len(differences)):
        if(abs(differences[i]-diff_mean)>diff_stddev):
            extremes.append(1)
        else:
            extremes.append(0)
    return extremes