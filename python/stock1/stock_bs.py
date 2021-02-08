from bs4 import BeautifulSoup
import pandas as pd
import requests
from datetime import datetime

#-カレントディレクトリを現在実行するファイルに指定
import os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
path = os.getcwd()

#初期設定
startdate=1983
enddate=2020
data=[]
year= []
for date in range(startdate,enddate+1):
    year.append(date)
basedatenum=6501 #日立製作所



#<!-- 関数 -->
def get_dfs(stock_number):
    dfs = []
    for y in year:
        try:
            print(y)
            url = 'https://kabuoji3.com/stock/{}/{}/'.format(stock_number,y)
            #！重要！ヘッダーにユーザーエージェントを記載
            headers = {
                 "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36 Edg/84.0.522.58"
                }
            print(url)
            soup = BeautifulSoup(requests.get(url, headers = headers).content,'html.parser')
            #soup = BeautifulSoup(requests.get(url).content,'html.parser')
            tag_tr = soup.find_all('tr')
            head = [h.text for h in tag_tr[0].find_all('th')]
            data = []
            for i in range(1,len(tag_tr)):
                data.append([d.text for d in tag_tr[i].find_all('td')])
            df = pd.DataFrame(data, columns = head)
            col = ['始値','高値','安値','終値','出来高','終値調整']
            for c in col:
                df[c] = df[c].astype(float)
            df['日付'] = [datetime.strptime(i,'%Y-%m-%d') for i in df['日付']]
            dfs.append(df)
        except IndexError:
            print('No data')
    return dfs

def concatenate(dfs):
    data = pd.concat(dfs,axis=0)
    data = data.reset_index(drop=True)
    col = ['始値','高値','安値','終値','出来高','終値調整']
    for c in col:
        data[c] = data[c].astype(float)
    return data


#<!--- 実行プログラム -->
#作成したコードリストを読み込む
code_list = pd.read_csv('codetest.csv')
data_int = pd.DataFrame()

#複数のデータフレームをcsvで保存
for i in range(len(code_list)):
    data_empty=[]
    adjust=0
    k = code_list.loc[i,'code']
    v = code_list.loc[i,'name']
    print(k,v)
    dfs = get_dfs(k)
    data = concatenate(dfs)
    #初期日付を取得
    if k == basedatenum:
        data_int['date']=data['日付']
    #初期日付が異なる場合の処理
    if not data['日付'].loc[0] == data_int['date'].loc[0]:
        adjust =data_int.loc[data_int['date']==data['日付'].loc[0]].index.values[0]
        data_empty=pd.DataFrame(data=["NaN" for s in range(adjust)],columns=['空白'])
        print(data_empty)
        print(data['終値'])
        #統合
        data_int[v]=data_empty['空白'].append(data['終値'],ignore_index=True)
    else:
        data_int[v]=data['終値']
    print(data_int)
    data_int.to_csv('stock_data.csv')
