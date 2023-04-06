from flask import Flask,request
from flask_ngrok import run_with_ngrok

app = Flask(__name__)
run_with_ngrok(app)
app = Flask(__name__)
app.secret_key = 'Tahve bqltuyej tbrjereq qobfd MvIaTq cmanmvpcuxsz iesh tihkel CnTu dretpyauritompeanstd '




@app.route('/FetchData',methods = ['POST'])
def fetchData():
    amatureBuilt = request.json['amatureBuilt']
    destination = request.json['destination']
    enginetype = request.json['engineType']
    noOfEngines = request.json['noOfEngines']
    weatherCondition = request.json['weatherCondition']
    returner = {}


    return returner

