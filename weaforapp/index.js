
var express = require("express");
var app = express();
var server = require("http").createServer(app);
var bodyParser = require("body-parser");
const fs = require("fs");
const http = require("http");
//
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);
//
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/',(req, res)=>{
    res.sendFile(__dirname + '/boxes.html');
});

//json city datas to find id
const jsoData = JSON.parse(fs.readFileSync('../city.list.json','utf8'));
const APIKEY = "323b25b8032f8debefb04fbdfe23fce7";

jsoData.sort((a,b) => {
    return  a["name"] < b["name"] ? -1:1;
})

app.post('/submit',(req, res)=>{
    //var t0 = process.hrtime();
    const x = req.body.city;
    const date = req.body.date;
    var time = req.body.time;
    const days = req.body.days;
    //console.log(typeof(days));
    var idx = getIdx(jsoData, x);
    //console.log(idx);
    const id = jsoData[idx]["id"];
    
    const search_url = "http://api.openweathermap.org/data/2.5/forecast?id="+id+"&APPID="+APIKEY;
                
    http.get(search_url, res2 => {
        var bd = "";
        res2.on('data',(chunk) => {
                bd += chunk;
        })
        res2.on('end',() => {
            const out = JSON.parse(bd);
            //console.log(JSON.stringify(out,null,4));
            //if(!days && date && time){
                //console.log("inside");
                time = "0"+time;
                if(days == 1){
                const currObj = daysNotGiven(out,date,time);
               
                //if(typeof(currObj) == Object){ 
                    res.render('outt.html',{weather:JSON.stringify(currObj["weather"][0]["main"])});
                //}
            //}
                }else{
            //else if(days && date && time){
                const currObj = daysGiven(out,date,time,days);
               
                //if(typeof(currObj) == Object){
                var cc = buildOutput(currObj);
                        res.writeHead(200, {
                            'Content-Type': 'text/html',
                            'Content-Length': cc.length,
                            'Expires': new Date().toUTCString()
                        });
                        res.end(cc); 
                    //res.send(currObj);
                //}
                }

            //}
                            
        })
    })
                               
});


//have to deal with input par

function daysNotGiven(out, date,time){
    [y,m,d] = date.split("-");
    var t = y+"-"+m+"-"+d+" "+time+":00:00";
    console.log(t);
            //console.log(t);
            var currObj = out["list"];
            //console.log(currObj);
            

            for(var i in currObj){
                                
                if(currObj[i].hasOwnProperty("dt_txt")){
                    if(currObj[i]["dt_txt"].localeCompare(t) == 0){
                        //console.log("inside");
                        return currObj[i];
                        //var t1 = process.hrtime();
                        //var time_taken = t1[0] - t0[0];
                        
                        
                    }
                }
            }


}

function daysGiven(out,date,time,days){
    var result = [];
    for(var j=0;j<days;j++){
        [y,m,d] = date.split("-");
        var d = Number(d)+j;
        var t = y+"-"+m+"-"+d+" "+time+":00:00";
        console.log(t);
        //
        var currObj = out["list"];
            //console.log(currObj);
            
            for(var i in currObj){
                                
                if(currObj[i].hasOwnProperty("dt_txt")){
                    if(currObj[i]["dt_txt"].localeCompare(t) == 0){
                        //console.log("inside");
                        console.log(currObj[i]["weather"][0]["main"]);
                        result.push({day:currObj[i]["dt_txt"].split(" ")[0], forc:currObj[i]["weather"][0]["main"]});
                        break;
                        //var t1 = process.hrtime();
                        //var time_taken = t1[0] - t0[0];
                        //var cc = buildOutput(x,date,time,currObj[i]);
                        //res.writeHead(200, {
                          //  'Content-Type': 'text/html',
                           // 'Content-Length': cc.length,
                           // 'Expires': new Date().toUTCString()
                        //});
                        //res.end(cc);
                        
                    }
                }
            }



    }
    return result;
}

function buildOutput(dataObj){
     //console.log(dataObj)
     //console.log(typeof dataObj);
     var res = "<!DOCTYPE html>" + "<body>";
     for(var i=0;i<dataObj.length;i++){
        res += "<h1>" + "Day:"+ JSON.stringify(dataObj[i]["day"]) + " Forecast:" +  JSON.stringify(dataObj[i]["forc"])+ "</h1>";
     }
     res += "</body></html>";
     return res;
 }

function getIdx(jsoData, x){
    var low = 0;
    var high = jsoData.length-1;
    while(low <= high){
        var mid = Math.floor(low + (high - low) / 2);
        var k = jsoData[mid]["name"];
        if(k.localeCompare(x) == 0){
            return mid;
        }
        else if(k.localeCompare(x) >= 1){
            high = mid-1;
            //console.log(high);
        }
        else{
            low = mid+1;
            //console.log(low);
        }
        
        
    }
}

function getIdx2(jsoData, x){
    
    for(var keys in jsoData){
        var k = jsoData[keys]["name"];
        if(k.localeCompare(x) == 0){
            return keys;
        }
    }
}
server.listen(3000);