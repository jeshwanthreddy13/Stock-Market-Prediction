from flask import Flask,request
import yfinance as yf
from lstm import call
from datetime import datetime,timedelta,date
from dateutil.relativedelta import relativedelta
import json
from rl.src.get_data import load_data
import os
import numpy as np
import pandas as pd


app = Flask(__name__)

@app.route("/members" , methods = ['GET'])
def members():
    data = request.get_json() 
    ticker = (data["ticker"]).upper()
    df = yf.download(tickers=ticker, period='1d', interval='2m')
    df['Date'] = df.index
    print(df)
    df = df.reset_index()
    for i in ['Open', 'High', 'Close', 'Low']: 
        df[i]  =  df[i].astype('float64')
    return df.to_json(orient='records')

@app.route("/predictions" , methods = ['GET'])
def predictions():
    tickers=['AAPL','TSLA','MSFT','VZ','AMZN','BA','MS','DB','JPM','META','INTC','GS','HPE','TCS','WMT','T','TGT','WFC','V']
    yesterday=datetime.now()-timedelta(1)
    end_date=datetime.strftime(yesterday,'%Y-%m-%d')
    fp = []
    fp = (call(end_date,fp,tickers))
    return json.dumps({"stocks" : fp})

@app.route("/download_data", methods = ['GET'])
def download():
    result=load_data("2010-01-01", 
              datetime.now().strftime("%Y-%m-%d"), 
              '',False,
              'train')
    return json.dumps({"message": "done"})

@app.route("/get_recommendations", methods = ['POST'])
def recommendations():
    data=request.get_json()
    print(type(data['tickers']))
    with open("rl\portfolios_and_tickers\initial_portfolio_subset.json", "r") as jsonFile:
        change = json.load(jsonFile)

    change["Bank_account"] = data['amount']

    with open("rl\portfolios_and_tickers\initial_portfolio_subset.json", "w") as jsonFile:
        json.dump(change, jsonFile)

    with open('rl\portfolios_and_tickers\\userdata.txt', 'w+') as f:
    
        for items in data['tickers']:
            f.write('%s\n' %items)
    x=(datetime.now()+relativedelta(years=-1)).strftime("%Y-%m-%d")
    print(type(x))
    os.system(r"python rl\src\\main.py --initial_cash "+str(data['amount'])+" --mode train --n_episodes 5  --plot --initial_date "+x+" --final_date "+datetime.now().strftime("%Y-%m-%d"))
    os.system(r"python rl\src\\main.py --initial_cash "+str(data['amount'])+" --mode test --n_episodes 1 --plot --initial_date "+x+" --final_date "+datetime.now().strftime("%Y-%m-%d"))
    b = np.load('rl\saved_outputs\last_output\logs\\test_portfolio_content_history.npy')
    c = np.load('rl\saved_outputs\last_output\logs\\test_portfolio_value_history.npy')
    with open('rl\\portfolios_and_tickers\\userdata.txt', 'r') as f:
        lines = f.readlines()
        tickers_b = []
        for l in lines:
            tickers_b.append(l.replace("\n", ""))
    df_b = pd.DataFrame(data=b[-1], columns=tickers_b)
    print(df_b)
    print(c)
    
    return json.dumps({"message": "done"})

    