# Takes in a list of Y values
# Returns a list of 0's and 1's
# 1 means the matching value in Y is an outlier
import numpy as np


def zscore(dataset, threshold=3):
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
def IQR(dataset):
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


dataset = [10, 12, 12, 13, 12, 11, 14, 13, 15, 10, 10, 10, 100, 12, 14, 13, 12, 10, 10, 11, 12, 15, 12, 13, 12, 11, 14,
           13, 15, 10, 15, 12, 10, 14, 13, 15, 10]
outliers = IQR(dataset)
for data, is_outlier in zip(dataset, outliers):
    print(data, is_outlier)
