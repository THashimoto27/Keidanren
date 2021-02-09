//初期設定
var charttype; //グラフのタイプを決める変数
charttype = 'line';
main();

function main(){
  // 1) ajaxでCSVファイルをロード
  var req = new XMLHttpRequest();
  var filePath = 'https://thashimoto27.github.io/Keidanren/graph2/graph_data.csv';
  req.overrideMimeType('text/plain; charset=Shift_JIS'); //文字化け処理
  req.open("get", filePath, true);
  req.onload = function() {
    // 2) CSVデータ変換の呼び出し
    data = csv2Array(req.responseText);
    // 3) chart.jsデータ準備、4) chart.js描画の呼び出し
    drawChart(data,charttype); // グラフ描画関数（下）を呼び出す
  }
  req.send(null);    
}

// 2) CSVから２次元配列に変換
function csv2Array(str) {
    var csvData = [];
    var lines = str.split("\n");
    for (var i = 0; i < lines.length; ++i) {
      var cells = lines[i].split(",");
      csvData.push(cells);
    }
    console.log(csvData);
    return csvData;
  }
  
//グラフ描画関数
   function drawChart(data, charttype){
    // 3)chart.jsのdataset用の配列を用意
        var tmpLabels = [], tmpData1 = []
        for (var row in data) {
            tmpLabels.push(data[row][0])
            tmpData1.push(data[row][1])
        };
        
    // 4)グラフ描画
       var ctx = document.getElementById('myChart').getContext('2d');
        window.myChart = new Chart(ctx, {
        type: charttype, //グラフのタイプ
        data: {
            labels: tmpLabels, // 左軸
            datasets: [{
                label: '出勤者割合',
                data: tmpData1, //データ
                backgroundColor: 'rgba(112,182,255,1)', //背景色
                hoverBackgroundColor: 'rgba(7,129,255,1)', //ホバー時のグラフの色
                fill: false,
            }]
            },
            options: {
                title: { //タイトル
                display: true,
                text: '事業継続上テレワーク実施が困難な従業員を除く対象事業拠点*の従業員数に対する現在の出勤者*の削減割合',
                padding: 8,
                fontSize: 20, //フォントサイズ
                fontStyle: 'normal'
            },
            legend: { // 凡例
                position: 'bottom',
                labels: {
                fontSize: 14,
                padding: 10
                }
                },
            scales: {
            xAxes: [{ //X軸
            　   scaleLabel: {
                fontSize: 12
                },
                ticks: {
                    fontSize: 10
                },
                categoryPercentage: 0.6
                }],
            yAxes: [{ //Y軸
                scaleLabel: {
                display: true,
                labelString: '社数',
                fontSize: 12
                },
                ticks: {
                min: 0,
                max: 200, //Y軸の最大値
                stepSize: 50, //Y軸のステップ数
                beginAtZero: true,
                }
                }]
            },
            　  maintainAspectRatio: false
            }
        });
    }

//ボタンクリック時の動作
document.getElementById('barb').onclick = function() {
    // すでにグラフ（インスタンス）が生成されている場合は、グラフを破棄する
   if (myChart) {myChart.destroy();}
   drawChart(data,'bar'); // グラフを再描画
   }
   document.getElementById('lineb').onclick = function() {
   // すでにグラフ（インスタンス）が生成されている場合は、グラフを破棄する
   if (myChart) {myChart.destroy();}
   drawChart(data,'line'); // グラフを再描画
   }