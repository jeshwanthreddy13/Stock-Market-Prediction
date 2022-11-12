from flask import Flask,request
import yfinance as yf
from lstm import call
from datetime import datetime,timedelta,date
import json
from rl.src.get_data import load_data


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

    