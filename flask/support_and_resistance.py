from datetime import datetime
import yfinance as yf
import datetime

def is_support(dataFrame, row, param_1, param_2):
    for i in range(row-param_1+1, row+1):
        if(dataFrame.Low[i]>dataFrame.Low[i-1]):
            return False
    for i in range(row+1,row+param_2+1):
        if(dataFrame.Low[i]<dataFrame.Low[i-1]):
            return False
    return True


def is_resistance(dataFrame, row, param_1, param_2):
    for i in range(row-param_1+1, row+1):
        if(dataFrame.High[i]<dataFrame.High[i-1]):
            return False
    for i in range(row+1,row+param_2+1):
        if(dataFrame.High[i]>dataFrame.High[i-1]):
            return False
    return True


def snr_main(ticker_name):
    stocks = [ticker_name]
    start = datetime.datetime(2022,1,9)
    end = datetime.datetime(2022,10,9)
    df = yf.download(stocks, start=start, end=end)
    print(df.shape[0])
    df['Date'] = df.index
    df['Date'] = df['Date'].apply(lambda x: str(x.date()))
    df=df[df['Volume']!=0]
    df.reset_index(drop=True, inplace=True)
    df.isna().sum()

    Support_Ressistance_Values = list()
    param_1=2
    param_2=3
    for row in range(3, df.shape[0]- param_2):
        if is_support(df, row, param_1, param_2):
            Support_Ressistance_Values.append((row,df.Low[row],1))
        if is_resistance(df, row, param_1, param_2):
            Support_Ressistance_Values.append((row,df.High[row],2))

    sensitivity = 0.1



    Final_Supports = [val[1] for val in Support_Ressistance_Values if val[2]==1]
    Final_Ressistances = [val[1] for val in Support_Ressistance_Values if val[2]==2]
    Final_Supports.sort()
    Final_Ressistances.sort()

    for i in range(1,len(Final_Supports)):
        if(i>=len(Final_Supports)):
            break
        if abs(Final_Supports[i]-Final_Supports[i-1])<=(df['High'].mean())*sensitivity:Final_Supports.pop(i)

    for i in range(1,len(Final_Ressistances)):
        if(i>=len(Final_Ressistances)):
            break
        if abs(Final_Ressistances[i]-Final_Ressistances[i-1])<=(df['High'].mean())*sensitivity:Final_Ressistances.pop(i)
    print(Final_Ressistances)
    print(Final_Supports)


    Xaxis_Start = 0
    Xaxis_End = 200
    count=0
    df_partial = df[Xaxis_Start:Xaxis_End]
    df_partial = df[['Date','Low','Close','Open','High']]
    support_array = df_partial.to_numpy().tolist()
    support_temp = ['Date','Low','Close','Open','High']
    support_count = 1
    for i in Final_Supports:
        temp_name = "Support" + str(support_count)
        support_temp.append(temp_name)
        support_count += 1
        for j in support_array:
            j.append(i)
    support_array.insert(0,support_temp)

    resistance_array = df_partial.to_numpy().tolist()
    resistance_temp = ['Date','Low','Close','Open','High']
    resistance_count = 1
    for i in Final_Ressistances:
        temp_name = "Resistance" + str(resistance_count)
        resistance_temp.append(temp_name)
        resistance_count += 1
        for j in resistance_array:
            j.append(i)
    resistance_array.insert(0,resistance_temp)

    return({"support": support_array, "resistance": resistance_array})