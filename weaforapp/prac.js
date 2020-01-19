
var da = new Date();
var h = da.getHours();
console.log(h);
//console.log(da);
var m = (da.getMonth()+1 < 9 ? "0"+(da.getMonth()+1):da.getMonth()+1);
var d = (da.getDate() < 9 ? "0"+da.getDate():da.getDate());
var dummyDate = da.getFullYear()+"-"+m+"-"+d;
//var parts = dummyDate.split("-");
//var mydate = new Date(parts[0],parts[1],parts[2]);
console.log(dummyDate);
//console.log(dummyDate);
