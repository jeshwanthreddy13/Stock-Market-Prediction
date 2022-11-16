import pandas as pd
import pandas_datareader as web
from datetime import datetime,timedelta

def bands(ticker,end_date):
    print(type(ticker))
    bars = web.DataReader(ticker, data_source='yahoo', start='2018-01-01', end=end_date)

    df = pd.DataFrame(bars)
    df['close'] = df.filter(['Close'])

    df['sma'] = df['close'].rolling(20).mean()
    # SD
    df['sd'] = df['close'].rolling(20).std()
    # lower band and Upper band
    df['lb'] = df['sma'] - 2.3 * df['sd']
    df['ub'] = df['sma'] + 1.5 * df['sd']
    df.dropna(inplace=True)
    close = df['Close'].tolist()
    sma = df['sma'].tolist()
    lb = df['lb'].tolist()
    ub = df['ub'].tolist()
    
    return {"close": close, "sma": sma, "lb": lb, "ub": ub}