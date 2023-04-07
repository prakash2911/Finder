from flask import Flask,request
from flask_ngrok import run_with_ngrok
from LatAndLong import get_destination
from flask_cors import CORS
app = Flask(__name__)
run_with_ngrok(app)
app = Flask(__name__)
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
    
    lat,long = get_destination(curLat,curLong)
    returner = {{-lat,long},{lat,-long},{lat,long},{-lat,-long}}
    return returner

if __name__ == "__main__":
  app.run()