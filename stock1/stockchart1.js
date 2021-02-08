//初期設定
var checkcount=new Array([0,"hitachi"]); //チェックボックリストの数
var maxcheck=5;
main();

function main(){
  // 1) ajaxでCSVファイルをロード
  var req = new XMLHttpRequest();
  var filePath = 'https://thashimoto27.github.io/Keidanren/stock1/stock_data.csv';
  req.overrideMimeType('text/plain; charset=Shift_JIS'); //文字化け処理
  req.open("get", filePath, true);
  req.onload = function() {
    // 2) CSVデータ変換の呼び出し
    data = csv2Array(req.responseText);
    // 3) chart.jsデータ準備、4) chart.js描画の呼び出し
    drawChart(data); // グラフ描画関数（下）を呼び出す
  }
  req.send(null);    
}

//チェックボックスのクリック時の動作
function click_cb(id){
    //既にチェックされているかどうかを判定
    if(document.getElementById(id).checked){
        ChartaddData(myChart,id);   //【関数】新しいチェックだったらデータを追加
   
    }else{
        ChartremoveData(myChart,id); //【関数】既にチェックされていたらデータを削除
    }
    maxcheckbox(); //【関数】チェックボックスの最大値判定（３つまで）
}


// 2) CSVから２次元配列に変換
function csv2Array(str) {
    var csvData = [];
    var lines = str.split("\n");
    for (var i = 0; i < lines.length; ++i) {
      var cells = lines[i].split(",");
      csvData.push(cells);
    }
    return csvData;
  }
  
//グラフ描画関数
   function drawChart(data){
    // 3)chart.jsのdataset用の配列を用意
    //初期値を取得
    var tmpDate=[],tmpLabel=[],tmpData=[]
    for (var raw in data) {
        if(raw==0){tmpLabel.push(data[raw][2])}
        else{
            if(judgestartofmonth(data[raw][1])){
                tmpDate.push(toDate(data[raw][1]));tmpData.push(data[raw][2]); 
            }
        }

    }

    // 4)グラフ描画
       var ctx = document.getElementById('myChart').getContext('2d');
        window.myChart = new Chart(ctx, {
        type: 'line', //グラフのタイプ
        data: {
            labels: tmpDate, // 左軸
            datasets: [{
                label: tmpLabel,
                data: tmpData, //データ
                borderColor: '#1D95FF', //線の色
                backgroundColor: '#1D95FF',
                hoverBackgroundColor: 'rgba(7,129,255,1)', //ホバー時のグラフの色
                fill: false,
                pointRadius:0,
            }]
            },
            options: {
                title: { //タイトル
                display: true,
                text: '経団連幹部企業の株価チャート',
                fontSize: 20, //フォントサイズ
                fontStyle: 'bold'
            },
            legend: { // 凡例
                position: 'bottom',
                labels: {
                fontSize: 12,
                padding: 10,
                }
                },
            scales: {
            xAxes: [
                {type:'time',
                time:{unit:'month'}},{ //X軸
            　   display: false
                }],
            yAxes: [{ //Y軸
                scaleLabel: {
                display: true,
                labelString: '株価',
                fontSize: 12
                },
                ticks: {
                beginAtZero: true,
                }
                }]
            },
            　  maintainAspectRatio: false
            }
        })
}

//【関数】チェック時にデータ追加
function ChartaddData(chart, id) {
    //IDの列数判定
    var tmpD=[];
    for(var column in data)
    {
        tmpD.push(data[0][column])
    }
    //データ追加
    var column  =Number(tmpD.indexOf(id));　//tmpD.indexOf(id)→列数
        tmpLabel=[],tmpData=[]
        for (var raw in data) {
            if(raw==0){tmpLabel.push(data[raw][column])}
            else{
                if(judgestartofmonth(data[raw][1])){
                    tmpData.push(data[raw][column]);
                }else{}
            }
        }
        //checkcount
        for(let i=0 ;i<maxcheck;i++){
            if(checkcount.findIndex(item => item[0]==i)==-1){
                checkcount.push([i,id])
                graphupdate(chart,i);
                break;
            }
        }
        console.log(tmpData)
}

//【関数】チェック時にデータを削除
function ChartremoveData(chart,id){
    tmpLabel=[];
    for(var num=1 in chart.data.datasets)
    {
        tmpLabel.push(chart.data.datasets[num].label[0]);
    }
    chart.data.datasets.splice(tmpLabel.indexOf(id),1);
    chart.update();

    checkcount.splice(checkcount.findIndex(item => item[1]==id),1)//チェック判定
}

//月初判定システム
function judgestartofmonth(date){
    try{var datearray = date.split("-")}catch{}
    try{if(datearray[2]==1){return true;
    }else{return false}}catch{}
}



//チェックボックス判定
function maxcheckbox(){
    	//チェックカウント用変数
	var check_count = 0;
	// 箇所チェック数カウント
	$(".input_item ul li").each(function(){
		var parent_checkbox = $(this).children("input[type='checkbox']");
		if(parent_checkbox.prop('checked')){
			check_count = check_count+1;
		}
	});
	// 0個のとき（チェックがすべて外れたとき）
	if(check_count == 0){
		$(".input_item ul li").each(function(){
			$(this).find(".locked").removeClass("locked");
		});
	// 3個以上の時（チェック可能上限数）
	}else if(check_count > maxcheck-1){
		$(".input_item ul li").each(function(){
			// チェックされていないチェックボックスをロックする
			if(!$(this).children("input[type='checkbox']").prop('checked')){
				$(this).children("input[type='checkbox']").prop('disabled',true);
				$(this).addClass("locked");
			}
		});
	}else{
		$(".input_item ul li").each(function(){
			// チェックされていないチェックボックスを選択可能にする
			if(!$(this).children("input[type='checkbox']").prop('checked')){
				$(this).children("input[type='checkbox']").prop('disabled',false);
				$(this).removeClass("locked");
			}
		});
	}
	return false;
}

//チェックボックス選択企業
function checklist(){
    const arr1 = [];
	const item = document.chk_ctl.item;

	for (let i = 0; i < item.length; i++){
		if(item[i].checked){ //(color1[i].checked === true)と同じ
			arr1.push(item[i].value);
		}
	}
    return arr1
}

function graphupdate(chart,checkcount_i){
        // グラフ追加色
        var bcolor
        if(checkcount_i==0){
            bcolor= '#1D95FF'
        }else if(checkcount_i==1){
            bcolor= '#4FB2BE'
        }else if(checkcount_i==2){
            bcolor= '#EE4D4D'
        }else if(checkcount_i==3){
            bcolor= '#F8DC1D'
        }else {
            bcolor= '#EE864C'
        }
        //データの追加
        chart.data.datasets.push({label: tmpLabel, data:tmpData, borderColor:bcolor,pointRadius:0,fill:false})
        chart.update();
}

function toDate(string){
    try{var datearray = string.split("-")}catch{}
    try{
        return new Date(datearray[0],datearray[1],datearray[2])}
    catch{}
}