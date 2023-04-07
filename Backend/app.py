from flask import Flask,request
from flask_ngrok import run_with_ngrok
from LatAndLong import get_destination
from flask_cors import CORS
app = Flask(__name__)
run_with_ngrok(app)
app = Flask(__name__)
import numpy as np
model = pickle.load(open('ML model/Untitled7.pickle', 'rb'))
arr = np.zeros(113)
app.secret_key = 'Tahve bqltuyej tbrjereq qobfd MvIaTq cmanmvpcuxsz iesh tihkel CnTu dretpyauritompeanstd '
CORS(app,origins='*')

@app.route('/FetchData',methods = ['POST'])
def fetchData():
    amatureBuilt = request.json['amatureBuilt']
    destination = request.json['destination']
    enginetype = request.json['engineType']
    noOfEngines = request.json['noOfEngines']
    curLat = request.json['Latitude']
    curLong = request.json['Longitude']
    weatherCondition = request.json['weatherCondition']
    if(Aircraft_damage == 'Destroyed'):
      arr[0] = 1
    if(Aircraft_damage == 'Minor'):
      arr[1] = 1
    if(Aircraft_damage == 'Substantial'):
      arr[2] = 1  
    if(Weather_Condition == 'IMC'):
      arr[3] = 1
    if(Weather_Condition == 'UNK'):
      arr[4] = 1
    if(Weather_Condition == 'VMC'):
      arr[6] = 1
    if(Aircraft_Category == 'Airplane'):
      arr[7] = 1
    if(Aircraft_Category == 'Helicopter'):
      arr[9] = 1
    if(Make == "Boeing"):
      arr[37] = 1
    if(Make == "CESSNA"):
      arr[38] = 1
    
    from sklearn.preprocessing import MinMaxScaler
    from sklearn import preprocessing

    min_max_scaler = preprocessing.MinMaxScaler()
    arr_scaled = min_max_scaler.fit_transform(arr)
    
    lat,long = get_destination(curLat,curLong)
    returner = {{-lat,long},{lat,-long},{lat,long},{-lat,-long}}
    return returner

if __name__ == "__main__":
  app.run()