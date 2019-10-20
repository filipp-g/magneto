# Takes in a list of Y values
# Returns a list of 0's and 1's
# 1 means the matching value in Y is an outlier
import numpy as np


def zscore(points, threshold=3):
    dataset = [y for x, y in points]
    mean = np.mean(dataset)
    std = np.std(dataset)
    outliers = []
    for y in dataset:
        z_score = (y - mean) / std
        if np.abs(z_score) > threshold:
            outliers.append(1)
        else:
            outliers.append(0)
    return outliers


# inter quartile range
def IQR(points):
    dataset = [y for x, y in points]
    outliers = []
    sorted_data = sorted(dataset)
    q1, q3 = np.percentile(sorted_data, [25, 75])
    iqr = q3 - q1
    lower_bound = q1 - (1.5 * iqr)
    upper_bound = q3 + (1.5 * iqr)

    for data in dataset:
        if data > upper_bound or data < lower_bound:
            outliers.append(1)
        else:
            outliers.append(0)
    return outliers


def _seperate(data, outlier_list):
    output = ([], [])
    for e, outlier in zip(data, outlier_list):
        if outlier == 1:
            output[1].append(e)
        else:
            output[0].append(e)
    return output


# Take points as a list of pairs
# returns a pair of lists with ([good points],[outliers])
def calc_outliers(points, method):
    if "zscore" in method:
        return _seperate(points, zscore(points))
    elif "IQR" in method:
        return _seperate(points, IQR(points))
    return (points, [])
