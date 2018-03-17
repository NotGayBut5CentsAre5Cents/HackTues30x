import sys
import pickle
import numpy as np
from sklearn.externals import joblib
import pandas as pd

model = joblib.load('models/' + sys.argv[1] + '.pkl') 

data = sys.argv[2:]

print(model.predict(data)[0])
sys.stdout.flush()