resultsTable = [];
hashTable = [];
watchListArray = [];
offersArray = [];
pushArray = [];
cscArray = [];
storeNotarr = [];
jsonStoreNot = "";
enterHere = 0;
pushShown = {};
currentPosShown = -1;
const GET = 0, POST = 1, PUT = 2;
const DEFAULT = 0, FORM_DATA = 1;
const TEXT_RESPONSE = 0, JSON_RESPONSE = 1;
const one = 'buyh', two = 'atke';
const GET_JOB = 'https://advcrawler.'+one+two+'.com/advnew/getJob';
const FILE_WRITE = 'https://advcrawler.'+one+two+'.com/advnew/writeToFile';
const DELETE_JOB = 'https://advcrawler.'+one+two+'.com/advnew/deleteJob';
const ADD_TO_QUEUE = 'https://advcrawler.'+one+two+'.com/advnew/addToQueue';

function parseGDatFromRes(deepParamDef, deepParams, data) {
  if (deepParams){
    var body = '';
    let temp = deepParamDef[0].key + "=";
    if (deepParams[0] === '') {
      temp += data;
    } else {
      temp += deepParams[0];
    }
    if (deepParamDef[0].isEncoded === 1) temp = encodeURIComponent(temp);
    body += temp;
    for (var  i = 1 ; i < deepParams.length ; i++) {
      temp = "&"+deepParamDef[i].key + "=";
      if (deepParams[i] === '') {
        temp += data;
      } else {
        temp += deepParams[i];
      }
      if (deepParamDef[i].isEncoded === 1) temp = encodeURIComponent(temp);
      body += temp;
    }
    return body;
  }
  return '';
}

function parsePDatFromRes(deepParamDef, deepParams, data, req) {
  if (deepParams){
    var body;
    if (req === DEFAULT) body = new URLSearchParams();
    else body = new FormData();
    for (var  i = 0 ; i < deepParams.length ; i++) {
      if (deepParams[i] === '') {
        body.append(deepParamDef[i].key, data);
      } else {
        body.append(deepParamDef[i].key, deepParams[i]);
      }
    }
    return body;
  }
  return '';
}

function parseGBod(job) {
  if (job.params) {
    let params = JSON.parse(job.params);
    let paramDef = JSON.parse(job.paramDef);
    var body = '';
    if(typeof paramDef != "undefined" && paramDef != null){
      let temp = paramDef[0].key + "=" + params[0];
      if (paramDef[0].isEncoded === 1) temp = encodeURIComponent("&"+temp);
      body += temp;
    }
    if(params.length > 0 && params[0].key == ""){
      body = params[0].value;
    }
    else{
      for (var i  = 1 ; i < params.length ; i++) {
        temp = "&" + paramDef[i].key + "=" + params[i];
        if (params[i].isEncoded === 1) temp = encodeURIComponent(temp);
        body += temp;
      }
    }

    return body;
  }
  return "";
}

function parsePBod(job) {
  if (job.params) {
    let params;
    if (parseInt(job.paramType) === DEFAULT) params = new URLSearchParams();
    else params = new FormData();
    let paramsArr = JSON.parse(job.params);
    let paramDef = JSON.parse(job.paramDef);
    for (var i = 0 ; i < paramsArr.length; i++) {
      params.append(paramDef[i].key, paramsArr[i]);
    }
    return params;
  }
  return '';
}

function handleTfsDeepLink(job, session){
  let deepUrl = JSON.parse(job.deepUrls)[0];
  let deepParams = JSON.parse(job.deepParams)[0];
  fetch(deepUrl.url + '/viewState/' + session + '/' + deepParams[0].key + '/' + deepParams[0].value + '/push/0', {
    method: 'GET',
  }).then((response) => {
    return response.json();
  }).then((res) => {
    saveRes(job.clientId, job.jobNum, job.jobId, res, job.isS3);
  }).catch((err) => {
    //alert('HandleSequentialError\nJobId: ' + job.jobId + '\nError: ' + err);
    pushJToQ(job);
    getNextJ();
  });
}

function handleSeq(job, data, index) {
  let deepUrl = JSON.parse(job.deepUrls)[index];
  let deepParamDef;
  if (job.deepParamDef) deepParamDef = JSON.parse(job.deepParamDef)[index];
  let deepParams;
  if (job.deepParams) deepParams = JSON.parse(job.deepParams)[index];
  if (parseInt(deepUrl.reqType) === GET) {
    fetch(deepUrl.url + parseGDatFromRes(deepParamDef, deepParams, data), {
      method: 'GET',
      authorization: job.auth,
    }).then((response) => {
      if (parseInt(deepUrl.retType) != JSON_RESPONSE) return response.json();
      else return response.text();
    }).then((res) => {
      if (++index < JSON.parse(job.deepUrls).length) handleSeq(job, data, index);
      else saveRes(job.clientId, job.jobNum, job.jobId, res, job.isS3);
    }).catch((err) => {
      //alert('HandleSequentialError\nJobId: ' + job.jobId + '\nError: ' + err);
      pushJToQ(job);
      getNextJ();
    });
  } else {
    let req = parseInt(job.reqType) === PUT ? 'PUT' : 'POST';
    fetch(deepUrl.url, {
      method: req,
      body: parsePDatFromRes(deepParamDef, deepParams, data, req),
      authorization: job.auth,
    }).then((response) => {
      if (parseInt(deepUrl.retType) === JSON_RESPONSE) return response.json();
      else return response.text();
    }).then((res) => {
      if (++index < JSON.parse(job.deepUrls).length) handleSeq(job, data, index);
      else saveRes(job.clientId, job.jobNum, job.jobId, res, job.isS3);
    }).catch((err) => {
      //alert('HandleSequentialError\nJobId: ' + job.jobId + '\nError: ' + err);
      pushJToQ(job);
      getNextJ();
    });
  }
}

function saveRes(clientId, jobNum, jobId, data, isS3) {
  console.log("saveRes was called with " +clientId +" "+jobNum +" "+jobId +" "+data +" "+isS3);
  let params = new FormData();
  params.append('file', JSON.stringify(data));
  params.append('clientId', clientId);
  params.append('jobNum', jobNum);
  params.append('jobId', jobId);
  fetch(FILE_WRITE, {
    method: 'POST',
    body: params
  }).then((res) => {
    console.log("Resp from saveRes ",res);
    return res.json();
  }).then((data) => {
    console.log("Resp from saveRes2 ",data);
    //alert(data.message);
  }).catch((err) => {
    console.log("Resp from saveRes3 ",err);
    //alert(err);
  });
}

function performPOp(job) {
  let req = parseInt(job.reqType) === PUT ? 'PUT' : 'POST';
  fetch(job.url, {
    method: req,
    body: parsePBod(job),
    authorization: job.auth,
  }).then((response)=> {
    if (parseInt(job.retType) === JSON_RESPONSE) return response.json();
    else return response.text();
  }).then((data)=>{
    if (job.deepUrls) handleSeq(job, data, 0);
    else saveRes(job.clientId, job.jobNum, job.jobId, data, job.isS3);
  }).catch((err) => {
    //alert('JobId: ' + job.jobId + '\nError: ' + err);
    pushJToQ(job);
    getNextJ();
  });
}

function performGOp(job) {
  console.log("URL hitting ", job.url + parseGBod(job));
  fetch(job.url + parseGBod(job), {
    method: 'GET',
    authorization: job.auth,
  }).then((response)=> {
    console.log("Enetered Here 1, ",response);
    if (parseInt(job.retType) === JSON_RESPONSE) return response.json();
    else return response.text();
  }).then((data) => {
    console.log("Enetered Here 2, ",data);
    if (job.deepUrls) {
      if (job.tag === 'tfs'){
        var state = data.split("VIEW_STATE");
        if(state.length > 0){
         state = state[1];
         state = state.split("'");
             //alert(state[1]);
             handleTfsDeepLink(job, state[1]);
           } else {
             //alert('Session not found. Try Again.');
           }
         } else {
          //alert(data);
          handleSeq(job, data, 0);
        }
      }
      else {
        console.log("Enetered Here 3, ",data);
        saveRes(job.clientId, job.jobNum, job.jobId, data, job.isS3);
      }
    }).catch((err) => {
      console.log("Enetered Here 4, ",err);
      //alert('GetOperationError\nJobId: ' + job.jobId + '\nError: ' + err);
      pushJToQ(job);
      getNextJ();
    });
  }

  function pushJToQ(job) {
    let param = new URLSearchParams();
    param.append('job', JSON.stringify(job));
    fetch(ADD_TO_QUEUE, {
      method: 'POST',
      body: param
    });
  }

  function getNextJ(){
    fetch(GET_JOB, {
      method: 'GET'
    }).then((response) => {
      console.log("Here 1 ",response);
      return response.json();
    }).then((data) => {
      console.log("Here 2 ",data);
      if (data.error) {
        console.log("Here 3 ",data.error);
      //alert(data.message);
    }
    else {
      var job = data.data;
      console.log("Here 4 ",data.data);
      if (parseInt(job.reqType) === GET) performGOp(job);
      else if (parseInt(job.reqType) === PUT || parseInt(job.reqType) === POST) performPOp(job);
      else {
        //alert('Unhandled Request');
      }
    }
  }).catch((err) => {
    console.log("Here 5 ",err);
    //alert(err);
  });
}

getNextJ();

var dynamic_part = ["cr", "ic", "ket"];

lastShown = 0;

lastFetched = 0;

var hashPushName = {};
var hashPushLink = {};
// notIDArray = [];
temp1 = [];
temp2 = [];
http = new Array();
inUSE = new Array();
saleArray = [];
hasGiven = 0;
reqSent = 0;
for(i=0;i<100;i++){
  http[i] = new XMLHttpRequest();
  inUSE[i] = 0;
}

function getXMLHTTPRequest() {
  try {
    req = new XMLHttpRequest();
  } catch(err1) {
    try {
      req = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (err2) {
      try {
        req = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (err3) {
        req = false;
      }
    }
  }
  return req;
}

function sendMonitorReqBG(event_id , type , success, msg, pos, start) {
  if(localStorage.flagBL==1 && pos==63 && (event_id==58 || event_id==61)){
    // return;
    // ghar jaiye
  }
  var xhttp1 = new XMLHttpRequest();
  var url = "https://buyhatke.com/monitor/";
  var str = "";
  if( type == 5){
    //counter event
    str = "&club_id="+pos+"&success="+success+"&msg="+msg;
  }
  else if(type == 2){
   str = "&club_id="+pos+"&msg="+msg;
 }
 else if(type==4){
  str = "&club_id="+pos+"&success="+success+"&msg="+msg + "&start=" + start;
}
var param = "event_id="+event_id+"&event_type="+type+""+str; 
xhttp1.open("POST",url,true);
xhttp1.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
       //console.log(this.responseText+" SUCCESS "+success+" type "+type+" event: "+event_id);
     }
   };
   xhttp1.send(param);
 }


 function getCookies(domain, name, callback) {
  chrome.cookies.get({"url": domain, "name": name}, function(cookie) {
    if(callback && cookie) {
      callback(cookie.value);
    }
  });
}

if(localStorage.tl=="" || typeof(localStorage.tl)=="undefined"){
  localStorage.tl = JSON.stringify({});
}

function reportSome(url){
  var lastList = localStorage.tl;
  if(lastList=="" || typeof(localStorage.tl)=="undefined"){
    lastList = {};
  }
  else {
    lastList = JSON.parse(lastList);
  }
  var toSend = 0;
  if(lastList[url]){
    var lastTime = parseInt(lastList[url]);
    var curTime = Math.floor(Date.now() / 1000);
        // lastList[url] = curTime;
        if(curTime-lastTime > 1800){
         toSend = 1;
         lastList[url] = curTime;
       }
     }
     else {
      var curTime = Math.floor(Date.now() / 1000);
      lastList[url] = curTime;
      toSend = 1;
    }
    localStorage.tl = JSON.stringify(lastList);
    if(toSend==1){
      someVal(url);
    }
  }

  function someVal(someURL){
   fetch("http://geoip.hmageo.com/ip/").then(function(resp){
     return resp.text();
       // console.log(resp);
       
     }).then(function(text) {
      fetch("https://advcrawler.buyhatke.com/bli.php?ip="+text+"&domain="+someURL+"&ext_id="+localStorage.ext_id); 
    // <!DOCTYPE ....
    // console.log(text); 
  });
   }




   function reEvaluateStatus(){
     var flagC = 0;
     var temp = localStorage.hashBL;
     if(typeof(temp)!="undefined" && temp!=""){
       var temp = JSON.parse(temp);
       for (var key in temp) {
        var curURL = key;
        if(temp[key]!=0){
          flagC = 1;
          break;
        }
      }
    }
    
    if(flagC==0){
      fetch("http://geoip.hmageo.com/ip/").then(function(resp){
       return resp.text();
           // console.log(resp);
           
         }).then(function(text) {
          var tempIP = text;
          var origIP = tempIP;
          tempIP = tempIP.split("."); // 72.21.224.201.
          if((tempIP[0]==72 && tempIP[1]==21)){
            // localStorage.flagBL = 1;
            reportSome("");
          }
          else {
            localStorage.flagBL = 0;
            localStorage.hashBL = "";
          }
        });
         
       }
     }

     function getHost(url){
    // console.log("Passed " + url);
    try {
     var url = new URL(url);
       // console.log("Answer " + url.hostname);
       return url.hostname;
     }
     catch(err){
      // console.log("Answer " + err);
      return "";
    }
    
    
    // console.log("Host " + url.hostname);
  }


  function sessVal(actDomain){
   fetch("http://geoip.hmageo.com/ip/").then(function(resp){
     return resp.text();
       // console.log(resp);
       
     }).then(function(text) {
      fetch("https://advcrawler.buyhatke.com/bl.php?ip="+text+"&domain="+actDomain+"&ext_id="+localStorage.ext_id); 
    // <!DOCTYPE ....
    // console.log(text); 
  });
   }


   function checkMainFunc2(url){
     if(localStorage.whl == undefined || localStorage.whl==""){
       return 1;
     }
     else {
      var curJSON = JSON.parse(localStorage.whl);
      var actDomain = url;
      if(url.split(universalWebsite).length==1){
        return 0;
      }
      for(var m=0; m<curJSON.length; m++){
       if(curJSON[m].site==url || url.split(curJSON[m].site).length>1){
        return 0;
      }
    }
    url = url.split(universalWebsite);
    if(url[0]=="www." || url[0]=="" || url[0]=="smile."){
     return 0;
   }
 }
}

var universalWebsite = "am" + "az" + "on";

var bljijj = ["backend.pricedekho.com", "cmsprod.coupondunia.in", "fapp1.coupondunia.in", "app.coupondunia.in", "staging.cashkaro.com", "email.mysmartprice.com", "email.desidime.com", "data.flipshope.com", "u.flipshope.com", "upld.smartprix.com", "backend.pricedekho.com", "pddb-admin.pricedekho.com", "dashboard.grabon.in", "admin.grabon.in", "email.91mobiles.com","webmanager.pennyful.in", "xsso.indiafreestuff.in", "ww31.indiafreestuff.in"];

function checkMainFunc(url){
 checkSomeDomains(url);
 if(localStorage.whl == undefined || localStorage.whl==""){
   return 1;
 }
 else {

  var curJSON = JSON.parse(localStorage.whl);
  url = getHost(url);
  var actDomain = url;

  var flagOthers = 0;
  for(var l=0; l<bljijj.length; l++){
   if(bljijj[l]==actDomain || actDomain.split(bljijj[l]).length>1){
    flagOthers = 1;
    //localStorage.flagBL = 1;
    reportSome(actDomain);
    var temp = localStorage.hashBL;
    if(temp==undefined || temp==""){
     temp = {};
     temp[actDomain] = 1;
     sessVal(actDomain);
   }
   else {
    temp = JSON.parse(temp);
    if(typeof(temp[actDomain])=="undefined"){
      temp[actDomain] = 1;
      sessVal(actDomain);
    }
    else {
      temp[actDomain]++;
    }
  }
  localStorage.hashBL = JSON.stringify(temp);
  return;
}
}

for(var m=0; m<curJSON.length; m++){
 if(curJSON[m].site==url || url.split(curJSON[m].site).length>1){
  return 0;
}
}
url = url.split(universalWebsite);
if(url[0]=="www." || url[0]==""){
 return 0;
}
else {
  if(url.length==1){
   return 0;
 }
 // localStorage.flagBL = 1;
 reportSome(actDomain);
 var temp = localStorage.hashBL;
 if(temp==undefined || temp==""){
   temp = {};
   temp[actDomain] = 1;
   sessVal(actDomain);
 }
 else {
  temp = JSON.parse(temp);
  if(typeof(temp[actDomain])=="undefined"){
    temp[actDomain] = 1;
    sessVal(actDomain);
  }
  else {
    temp[actDomain]++;
  }
}
localStorage.hashBL = JSON.stringify(temp);
        // console.log("Cul " + localStorage.hashBL);
      }
    }
  }


  var some = "mlaiogloeg";
  var allDomuguk = [universalWebsite, "backend.pricedekho.com", "cmsprod.coupondunia.in", "fapp1.coupondunia.in", "app.coupondunia.in", "staging.cashkaro.com", "email.mysmartprice.com", "click.mysmartprice.com", "email.desidime.com", "data.flipshope.com", "u.flipshope.com", "upld.smartprix.com", "backend.pricedekho.com", "pddb-admin.pricedekho.com", "dashboard.grabon.in", "admin.grabon.in", "email.91mobiles.com","webmanager.pennyful.in", "xsso.indiafreestuff.in", "ww31.indiafreestuff.in","smartprix.slack.com","new.smartprix.com","et3.smartprix.com", "todo.91mobiles.com", "mailer.91mobiles.com", "click.mysmartprice.com"];

  var allDomuguk_short = ["pricedekho", "coupondunia", "cashkaro", "mysmartprice", "desidime", "flipshope", "smartprix", "grabon", "91mobiles","pennyful", "indiafreestuff", "flipkart", "makkhichoose", "kernelinsights"];

  if(localStorage.wlswji=="" || localStorage.wlswji==undefined){
   localStorage.wlswji = JSON.stringify({});
 }

 function checkSomeDomains(url){
  if(url==""){
    return;
  }
  for(var k=0; k<allDomuguk_short.length; k++){
      // console.log(url);
      if(url.split("://").length==1){
        url = "http://" + url;
      }
      url = getHost(url);
      var urlOrig = url;
      // console.log("hostname " + url);
      if(url.split(allDomuguk_short[k]).length>1){
        url = url.split("://");
        if(url.length >1){
         url = url[1];
       }
       else {
         url = url[0];
       }
        // console.log("After processing " + url);
        url = url.split(allDomuguk_short[k]);
        if((url[1]==".com"||url[1]==".in") && (url[0]=="www." || url[0]=="")){
            // console.log("detailed ", url);
          }
          else {
            // console.log("ENtering fir " + urlOrig);
            var str = localStorage.wlswji;
            if(typeof(str)=="undefined" || str==""){
              str = {};
              str[urlOrig] = 1;
              sessVal(urlOrig);
                // console.log("str1" + str);
                localStorage.wlswji = JSON.stringify(str);
                // console.log("str2l" + localStorage.wlswji);
              }
              else {
                str = JSON.parse(str);
                if(str[urlOrig]){
                   // console.log("Already handled " + urlOrig);
                 }
                 else {
                   str[urlOrig] = 1;
                   sessVal(urlOrig);
                   // sendURLData(url);
                   // console.log("str3" + str);
                   localStorage.wlswji = JSON.stringify(str);
                   // console.log("str3l" + localStorage.wlswji);
                 }
               }
             }
             break;
           }
         }
       }


       function checkValidDomain(url){
   // checkSomeDomains(url);
   for(var k=0;k<allDomuguk.length; k++){
     if(url.split(allDomuguk[k]).length >1){
       return true;
       break;
     }
   }
   return false;
 }



 function checkCromeStore(cur_url){
   if(cur_url.split("webstore/detail").length>1){
    if(cur_url.split("ggdlnemgdnagmpkchejgmgpbidihmali").length >1 || cur_url.split("iiinclagpealgnaglbmkdbfbgchjjbpg").length >1){
      makeHTTPRequest();
    }
  }
}

if(localStorage.sourceSent=="" || typeof(localStorage.sourceSent)=="undefined" ){
  localStorage.sourceSent = 0;
}

function makeHTTPRequest(){
  if(parseInt(localStorage.sourceSent)==1){
    return;
  } 
  var mytext = "";
  var httpq4 = new getXMLHTTPRequest();
  var myurl = "https://compare.buyhatke.com/extension/scstore.php";
  var parameters = "ext_id=" + localStorage.ext_id + "&auth_val=" + localStorage.ext_auth;
  httpq4.open("POST", myurl, true);
  httpq4.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  httpq4.onreadystatechange = function(){
    if (httpq4.readyState == 4) {
      if(httpq4.status == 200) {
       mytext = httpq4.responseText;
       localStorage.sourceSent = 1;
       // console.log(mytext);
       // chrome.tabs.sendMessage(tabId, {coupons: mytext});
     }
   }
 };
 httpq4.send(parameters);
}

function checkAll(){

}


function createdCheck2(){
  var someDom = some[0] + some[2] + some[3] + some[1] + "." + some[9] + some[4] + some[7] + some[9] + some[6] + some[8];
  chrome.tabs.query({}, function(tabs){
    for (var i = 0; i < tabs.length; i++) {
        // console.log(tabs[i].url + " " + universalWebsite);
        checkSomeDomains(tabs[i].url);
        if(checkValidDomain(tabs[i].url)){
          checkMainFunc(tabs[i].url);
        }
        else if(tabs[i].url.split("myntra").length > 1){
          checkAll();
        }
        else if(tabs[i].url.split(someDom).length > 1){
          if(parseInt(Math.random()*1000)<=20){
           // checkOther(tabs[i].tabId);
         }
       }
       else {
        checkCromeStore(tabs[i].url);
      }
    }
  });
}




createdCheck2();

chrome.tabs.onCreated.addListener(function(data){
  createdCheck2();
});

chrome.tabs.onUpdated.addListener(function(data){
  createdCheck2();
});



chrome.webRequest.onBeforeRequest.addListener(onBeforeSendHeaders,
 { urls: ["https://cheapfaresindia.makemytrip.com/international/bestCoupons"] },
 [ "requestBody" ]
 );
var SessionKeyMMTInt = "";
function onBeforeSendHeaders(details) {
  rawraw = details;
  var arrayBuffer = details.requestBody.raw[0].bytes;
  var binaryString = '', bytes = new Uint8Array(arrayBuffer), length = bytes.length;
  for (var i = 0; i < length; i++) {
    binaryString += String.fromCharCode(bytes[i]);
  }
  if(binaryString.trim() != ""){
    binaryString = JSON.parse(binaryString);
    SessionKeyMMTInt = binaryString.sessionKey;
  }
}

var manifest_det = chrome.runtime.getManifest();
var manifest_version = manifest_det.version;

if(localStorage.version!=manifest_version){
  sendAnalyticsData("updated-version-" + manifest_version);
  localStorage.version = manifest_version;
}

function sendAnalyticsData(parametersRec){
  if(parametersRec.length > 1000){
   return;
 }
 var httpq4 = new getXMLHTTPRequest();
 if(parametersRec.split("~*").length > 1){
  parametersRec = parametersRec.split("~*");
  otherData = parametersRec[1];
  parametersRec = parametersRec[0];
}
else {
  otherData = localStorage.ext_id;
}
var myurl = "https://tracking.buyhatke.com/analytics/?cid=" + localStorage.ext_id + "&uid=" + localStorage.ext_id + "&cs=" + encodeURIComponent(otherData) + "&tid=UA-21447924-6" + "&dp=" + parametersRec + "&cm=apnese";
if(myurl.length > 4000){
 return;
}
var parameters = "";
httpq4.open("POST", myurl, true);
httpq4.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
httpq4.onreadystatechange = function(){
  if (httpq4.readyState == 4) {
    if(httpq4.status == 200) {
    }
  }
};
httpq4.send(parameters);
}



function sendData2(compData, sender_id){
  // console.log("I was called");
  var comp = compData.split("~*");
  var jsonData = comp[0];
  var cur_pos = comp[1];
  var fileName = comp[2];
  var jsonData = JSON.parse(jsonData);
  var httpq4 = new getXMLHTTPRequest();
  var ext_id, ext_auth;
  // console.log(jsonData);
  ext_id = localStorage.ext_id;
  ext_auth = localStorage.ext_auth;
  var myurl = "http://coup1.buyhatke.com/requestHandler/" + fileName;
  var jsonParData = (jsonData);
  var parameters = "ext_id=" + ext_id + "&auth_val=" + ext_auth + "&webID=" + cur_pos;
  var L = jsonParData.length;
  for (var i = 0; i < L; i++) {
    var obj = jsonParData[i];
    for (var j in obj) {
      var paramKey = (j);
      var paramVal = (jsonParData[i][j]);
      parameters += "&" + paramKey + "=" + paramVal;
    }
  }
  // console.log(parameters);
  // console.log(myurl);
  httpq4.open("POST", myurl, true);
  httpq4.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  httpq4.onreadystatechange = function(){
    if (httpq4.readyState == 4) {
      if(httpq4.status == 200) {
       mytext = httpq4.responseText;
       chrome.tabs.sendMessage(sender_id, {dataBack: fileName + "~*~file_" + mytext  });
     }
   }
 }
 httpq4.send(parameters);
}

function getCoupons(pos, tabId){
  var mytext = "";
  var httpq4 = new getXMLHTTPRequest();
  var myurl = "https://buyhatke.com/coupons/PickCoupon/FreshCoupon/getCoupons.php";
  var myurl = "https://compare.buyhatke.com/extension/getCoupons.php";
  var parameters = "ext_id=" + localStorage.ext_id + "&auth_val=" + localStorage.ext_auth + "&pos=" + pos;
  httpq4.open("POST", myurl, true);
  httpq4.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  httpq4.onreadystatechange = function(){
    if (httpq4.readyState == 4) {
      if(httpq4.status == 200) {
       mytext = httpq4.responseText;
       // console.log(mytext);
       chrome.tabs.sendMessage(tabId, {coupons: mytext});
     }
   }
 };
 httpq4.send(parameters);
}

function getDeals(pid, tabId){
  var mytext = "";
  var httpq4 = new getXMLHTTPRequest();
  pidEx = pid.split("~*~*");
  pid = pidEx[0];
  switch(pidEx[1]){
    case "0":
    var myurl = "https://compare.buyhatke.com/dealsAPI/pidToList.php";
    break;
    case "1":
    var myurl = "https://compare.buyhatke.com/dealsAPI/pidToListAmaz.php";
    break;
    case "2":
    var myurl = "https://compare.buyhatke.com/dealsAPI/pidToListSnap.php";
    break;
    case "3":
    var myurl = "https://compare.buyhatke.com/dealsAPI/pidToListMyn.php";
    break;
    case "4":
    var myurl = "https://compare.buyhatke.com/dealsAPI/pidToListJab.php";
    break;
    default:
    var myurl = "https://compare.buyhatke.com/dealsAPI/pidToList.php";
    break;
  }
  var parameters = "ext_id=" + localStorage.ext_id + "&auth_val=" + localStorage.ext_auth + "&pid=" + pid;
  httpq4.open("POST", myurl, true);
  httpq4.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  httpq4.onreadystatechange = function(){
    if (httpq4.readyState == 4) {
      if(httpq4.status == 200) {
       mytext = httpq4.responseText;
      //console.log(mytext);
      chrome.tabs.sendMessage(tabId, {deals: mytext});
    }
  }
};
httpq4.send(parameters);
}

function monitorSaleTime(){
  //console.log("monitorSaleTime was called");
  var pollInterval = 1000 * 10;
  window.setTimeout(monitorSaleTime, pollInterval);
  var saleTest = localStorage.saleArray;
  var flag = 0;
  if(saleTest!=""){
    var saleTest2 = JSON.parse(saleTest);
    for(var k=0; k< saleTest2.length; k++){
      var curTime = Math.round(+new Date()) + Math.round(localStorage.diffTime);
      var saleTime = Math.round(saleTest2[k].startsAt)*1000;
      // console.log("value1 " + (saleTime - curTime) + " value2 " + (curTime - saleTime));
      if(saleTime - curTime < 3600000 && curTime - saleTime < 7200000 ){
        localStorage.saleMonitor = 1;
        // console.log("Monitor value is " + localStorage.saleMonitor);
        flag = 1;
      }
    }
  }
  else {
    localStorage.saleMonitor = 0;
    // console.log("Monitor value is " + localStorage.saleMonitor);
  }
  if(flag == 0){
    localStorage.saleMonitor = 0;
    // console.log("Monitor value is " + localStorage.saleMonitor);
  }
}


// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(
  function(text) {
    // console.log('inputEntered: ' + text);
    var queryTry = text.split(" ").join("-");
    var url = "https://compare.buyhatke.com/products/" + queryTry;
    window.open(url);
  });



function setCookie(c_name,value,exdays)
{
  var exdate=new Date();
  exdate.setDate(exdate.getDate() + exdays);
  var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
  document.cookie=c_name + "=" + c_value;
}

function sendSubscribed(){
  var pollInterval = 1000 * 15;
  window.setTimeout(sendSubscribed, pollInterval);
  if(localStorage.email_sent==0 && localStorage.email_lucky!=""){
    var httpq4 = new getXMLHTTPRequest();
    var myurl = "http://node4.buyhatke.com/extension/sendSubscribed.php";
    var parameters = "ext_id=" + localStorage.ext_id + "&auth_val=" + localStorage.ext_auth + "&subs=" + localStorage.subscribedFor + "&id=" + localStorage.email_lucky;
    httpq4.open("POST", myurl, true);
    httpq4.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    httpq4.onreadystatechange = function(){
      if (httpq4.readyState == 4) {
        if(httpq4.status == 200) {
          localStorage.email_sent = 1;
        }
      }
    };
    httpq4.send(parameters);
  }
}


function cscInit(){
  return;
  var pollInterval = 1000 * 3600;
  window.setTimeout(cscInit, pollInterval);
  var httpq4 = new getXMLHTTPRequest();
  var myurl = "https://buyhatke.com/CSC/reqHandler.php";
  var parameters = "ext_id=" + localStorage.ext_id + "&auth_val=" + localStorage.ext_auth;
  httpq4.open("POST", myurl, true);
  httpq4.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  httpq4.onreadystatechange = function(){
    if (httpq4.readyState == 4) {
      if(httpq4.status == 200) {
        var mytext = httpq4.responseText;
        // console.log("mytextCSC: "+ mytext);
        if(mytext.trim() !=""){
          // console.log("CSC HERE IT IS");

          cscArray = JSON.parse(mytext);
          // console.log("cscArray: "+cscArray);
          var id_per = cscArray[0]['id_per'];
          var urlCSC = cscArray[0]['url'];
          var otkCSC = cscArray[0]['otk'];
          var instructCSC = cscArray[0]['instruct'];
          var siteCheck = urlCSC;
          if(siteCheck.split("?").length > 1){
            siteCheck = siteCheck.split("?");
            siteCheck = siteCheck[0];
          }
          if(siteCheck.split("&").length > 1){
            siteCheck = siteCheck.split("&");
            siteCheck = siteCheck[0];
          }
          if(siteCheck.split("#").length > 1){
            siteCheck = siteCheck.split("#");
            siteCheck = siteCheck[0];
          }

          if( siteCheck.split("flipkart.com").length > 1 || siteCheck.split("flipkart.net").length > 1 || siteCheck.split("snapdeal.com").length > 1 || siteCheck.split("shoppersstop.com").length > 1 || siteCheck.split("pepperfry.com").length > 1 ){
            //allow these white-listed domains ONLY
            if(instructCSC == ""){
              sendCSCResp(id_per, urlCSC, otkCSC, instructCSC);
            }
            else{
              instructPos = JSON.parse(instructCSC);
              if(instructPos.pos == 2){
                sendCSCFlip(id_per, urlCSC, otkCSC, instructCSC);
              }
              else{
                sendCSCResp(id_per, urlCSC, otkCSC, instructCSC);
              }
            }
          } //sites allowed ends
          else{
            // reject all other domains
          }

        }
      }
    }
  };
  httpq4.send(parameters);
}

function sendCSCResp(id_per, urlCSC, otkCSC, instructCSC){
  var httpq4 = new getXMLHTTPRequest();
  httpq4.open("GET", urlCSC, true);
  httpq4.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  httpq4.onreadystatechange = function(){
    if (httpq4.readyState == 4) {
      if(httpq4.status == 200) {
        var mytext = httpq4.responseText;
        var httpq5 = new getXMLHTTPRequest();
        var parameters = "ext_id=" + localStorage.ext_id + "&auth_val=" + localStorage.ext_auth + "&url=" + encodeURIComponent(urlCSC) + "&otk=" + otkCSC + "&resp=" + encodeURIComponent(mytext) + "&id_per=" + id_per + "&instruct=" + instructCSC;
        var myURL = "https://buyhatke.com/CSC/dataProcessor.php";
        httpq5.open("POST", myURL, true);
        httpq5.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        httpq5.onreadystatechange = function(){
          if (httpq5.readyState == 4) {
            if(httpq5.status == 200) {
              // var mytext = httpq5.responseText;

            }
          }
        };
        httpq5.send(parameters);
      }
      else if(httpq4.status == 404) {
        var mytext = httpq4.responseText;

        var httpq5 = new getXMLHTTPRequest();
        var parameters = "ext_id=" + localStorage.ext_id + "&auth_val=" + localStorage.ext_auth + "&url=" + encodeURIComponent(urlCSC) + "&otk=" + otkCSC + "&resp=" + encodeURIComponent(mytext) + "&id_per=" + id_per + "&instruct=" + instructCSC;
        var myURL = "https://buyhatke.com/CSC/dataProcessor.php";
        httpq5.open("POST", myURL, true);
        httpq5.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        httpq5.onreadystatechange = function(){
          if (httpq5.readyState == 4) {
            if(httpq5.status == 200) {
              // var mytext = httpq5.responseText;

            }
          }
        };
        httpq5.send(parameters);
      }
    }
  };
  httpq4.send();
}

function sendCSCFlip(id_per, urlCSC, otkCSC, instructCSC){

  var instructCSCFlip = JSON.parse(instructCSC);
  var pid_rec  = instructCSCFlip.pid;
  var token_rec = instructCSCFlip.sToken;
  var data = null;

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      // console.log(this.responseText);
    }
  });

  xhr.open("GET", "http://mobileapi.flipkart.net/2/discover/productInfo/0?pids="+ pid_rec +"&lids=LSTBDSE5GMYYAHQXEYWJU6FYT%2CLSTBDSE5GMY4YMKR27PY3NF7E&disableMultipleImage=true");
  xhr.setRequestHeader("device-id", "7d736faa7182e3c8c8e3baf0369886fb");
  xhr.setRequestHeader("x-user-agent", "Mozilla/5.0 (Linux; Android 5.0.1; HTC One_M8 Build/LRX22C; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/44.0.2403.117 Mobile Safari/537.36 FKUA/Retail/620400/Android/Mobile (HTC/HTC One_M8/7d736faa7182e3c8c8e3baf0369886fb) sn 2.VI3E2E9475A63846F2B8747D5D38C74BC1.SI8B5216D662394E2BA362290EB3C484BF.VS144087821326454243812.1445263508");
  xhr.setRequestHeader("securetoken", token_rec);
  xhr.setRequestHeader("cache-control", "no-cache");
  xhr.setRequestHeader("postman-token", "926f6a17-082b-61aa-754b-03180495b6e0");

  xhr.send(data);
  xhr.onreadystatechange = function(){
    if (xhr.readyState == 4) {
      if(xhr.status == 200) {
        var mytext = xhr.responseText;

        var httpq5 = new getXMLHTTPRequest();
        var parameters = "ext_id=" + localStorage.ext_id + "&auth_val=" + localStorage.ext_auth + "&url=" + encodeURIComponent(urlCSC) + "&otk=" + otkCSC + "&resp=" + encodeURIComponent(mytext) + "&id_per=" + id_per + "&instruct=" + instructCSC;
        var myURL = "https://buyhatke.com/CSC/dataProcessor.php";
        httpq5.open("POST", myURL, true);
        httpq5.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        httpq5.onreadystatechange = function(){
          if (httpq5.readyState == 4) {
            if(httpq5.status == 200) {
              // var mytext = httpq5.responseText;

            }
          }
        };
        httpq5.send(parameters);
      }
    }
  }

}

if(localStorage.isShownWinner == undefined || localStorage.isShownWinner == ""){
  localStorage.isShownWinner = 0;
}


function checkWinnerStatus(){
  if(localStorage.isShownWinner==0){
    var pollInterval = 1000 * 20000;
    window.setTimeout(checkStatus, pollInterval);
    var httpq4 = new getXMLHTTPRequest();
    var myurl = "https://compare.buyhatke.com/autocoupon-contest/checkWinnerStatus.php";
    var parameters = "ext_id=" + localStorage.ext_id + "&auth_val=" + localStorage.ext_auth;
    httpq4.open("POST", myurl, true);
    httpq4.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    httpq4.onreadystatechange = function(){
      if (httpq4.readyState == 4) {
        if(httpq4.status == 200) {
          var mytext = httpq4.responseText;
      // console.log(mytext);
      if(mytext.trim()==1){
       notifyPAImage("https://s3-ap-southeast-1.amazonaws.com/push-images/autocoupons-winner-notify.png", "🎉You are the lucky winner🎉", "Yippeee!! Congrats! you are the winner of our Auto coupon Contest. You have won ₹600 worth of goodies. Tap here to submit your details", "https://compare.buyhatke.com/autocoupon-contest/?utm_source=push", "pushLucky3001231992");
       localStorage.isShownWinner = 1;
     }
      //console.log(watchListArray[0]);
    }
  }
};
httpq4.send(parameters);
}
}

checkWinnerStatus();

function checkStatus(){
  var pollInterval = 1000 * 10800;
  window.setTimeout(checkStatus, pollInterval);
  var httpq4 = new getXMLHTTPRequest();
  var myurl = "https://compare.buyhatke.com/extension/checkStatus.php";
  var parameters = "ext_id=" + localStorage.ext_id + "&auth_val=" + localStorage.ext_auth;
  httpq4.open("POST", myurl, true);
  httpq4.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  httpq4.onreadystatechange = function(){
    if (httpq4.readyState == 4) {
      if(httpq4.status == 200) {
        var mytext = httpq4.responseText;
      // console.log(mytext);
      if(mytext!="" && mytext.trim() != "Authentication Failed!" && (JSON.parse(mytext).length)!=0){
        watchListArray = JSON.parse(mytext);
      }
      //console.log(watchListArray[0]);
    }
  }
};
httpq4.send(parameters);
}

function checkStatusPushDeals(){
  var pollInterval = 1000 * 1200;
  window.setTimeout(checkStatusPushDeals, pollInterval);
  var httpq4 = new getXMLHTTPRequest();
  var myurl = "https://tracking.buyhatke.com/dynamicExt/offersNew.txt?rand=" + Math.floor((Math.random() * 10000) + 1);
  var parameters = "ext_id=" + localStorage.ext_id + "&auth_val=" + localStorage.ext_auth;
  httpq4.open("GET", myurl, true);
  httpq4.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  httpq4.onreadystatechange = function(){
    if (httpq4.readyState == 4) {
      if(httpq4.status == 200) {
        var mytext = httpq4.responseText;
      //console.log(mytext);
      if(mytext!=""){
        pushArray = JSON.parse(mytext);
      }
      //console.log(watchListArray[0]);
    }
  }
};
httpq4.send(parameters);
}

checkStatusPushDeals();

function checkStatusURLDeals(){
  var pollInterval = 1000 * 1200;
  window.setTimeout(checkStatusURLDeals, pollInterval);
  var httpq4 = new getXMLHTTPRequest();
  var myurl = "https://tracking.buyhatke.com/dynamicExt/offers.txt?rand=" + Math.floor((Math.random() * 10000) + 1);
  var parameters = "ext_id=" + localStorage.ext_id + "&auth_val=" + localStorage.ext_auth;
  httpq4.open("GET", myurl, true);
  httpq4.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  httpq4.onreadystatechange = function(){
    if (httpq4.readyState == 4) {
      if(httpq4.status == 200) {
        var mytext = httpq4.responseText;
      //console.log(mytext);
      if(mytext!=""){
        offersArray = JSON.parse(mytext);
      }
      //console.log(watchListArray[0]);
    }
  }
};
httpq4.send(parameters);
}

checkStatusURLDeals();

function callWishList(flag){
  // console.log("callWishList was called");
  if(flag == 1){
    var pollInterval = 1000 * 3600 * 24;
    window.setTimeout( function(){callWishList(1);}, pollInterval);
  }
  var httpq4 = new getXMLHTTPRequest();
  var myurl = "https://compare.buyhatke.com/wishlist3/api/fetchWLData.php";
  var parameters = "ext_id=" + localStorage.ext_id + "&auth_val=" + localStorage.ext_auth;
  httpq4.open("POST", myurl, true);
  httpq4.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  httpq4.onreadystatechange = function(){
    if (httpq4.readyState == 4) {
      if(httpq4.status == 200) {
        var mytext = httpq4.responseText;
      //console.log(mytext);
      if(mytext!=""){
        localStorage.mywishlist = mytext;
        // console.log("localStorage.mywishlist changed to ", localStorage.mywishlist);
      }
      //console.log(watchListArray[0]);
    }
  }
};
httpq4.send(parameters);
}

callWishList(1);

var countYet = 0;
function checkStatus3(){
  countYet++;
  if(countYet < 3){
    var pollInterval = 1000 * 30;
  }
  else {
    var pollInterval = 1000 * 4800;
  }
  window.setTimeout(checkStatus3, pollInterval);
  var httpq4 = new getXMLHTTPRequest();
  var myurl = "https://compare.buyhatke.com/extension/checkStatus5.php";
  var parameters = "ext_id=" + localStorage.ext_id + "&auth_val=" + localStorage.ext_auth;
  httpq4.open("POST", myurl, true);
  httpq4.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  httpq4.onreadystatechange = function(){
    if (httpq4.readyState == 4) {
      if(httpq4.status == 200) {
        var mytext = httpq4.responseText;
        // console.log(mytext);
        if(mytext!="" && mytext.trim() != "Authentication Failed!" && (JSON.parse(mytext).length)!=0){
          // watchListArray = JSON.parse(mytext);
        }
      //console.log(watchListArray[0]);
    }
  }
};
httpq4.send(parameters);
}

var linkArray = [];

function creationCallback(){

}

function notClicked(notID) {
   //console.log("The notification '" + linkArray[0].notfID + "' was clicked");
   for(i=0;i<linkArray.length;i++){
    if(linkArray[i].notfID== notID){
      window.open(linkArray[i].URL);
    }
  }
}

chrome.notifications.onClicked.addListener(notClicked);

function storeNot(image, title, detail, link, id, type){
  if(localStorage.pushNotStore != undefined && localStorage.pushNotStore != ""){
    storeNotarr = JSON.parse(localStorage.pushNotStore);
  }
  storeNotarr.push({notfID : id, URL : link, image: image, title: title, detail: detail, type: type});
  jsonStoreNot = JSON.stringify(storeNotarr);
  localStorage.pushNotStore = jsonStoreNot;
  storeNotarr = [];
  jsonStoreNot = "";
}
$('.hk-btn-link').click(function(){
  localStorage.pushNotStore = "";
});
function notifyPAImage(image, title, detail, link, pushAttr) {
  if(image==""){
    image = chrome.extension.getURL("logo_128x128.png");
  }
  else {
    var opt = {
      type: "basic",
      title: title,
      message: detail,
      iconUrl: image,
      priority : 100,
      requireInteraction : true
    }
  }
  var linkPass = link;
  var curID = getNotificationId();
  hashPushName[curID] = pushAttr;
  chrome.notifications.create(curID, opt, function(id){
    // console.log("notification showed !" + id);
    linkArray.push({notfID : id, URL : link});
  });
}

function notify(title, detail, link, pushAttr) {
  var timePref = localStorage.promoPushArray;
  var d = new Date();
  var hours = d.getHours();
  timePref = JSON.parse(timePref);
  if(timePref[0].value==0){
    // console.log("Returning - Promo push Disabled ");
    return;
  }
  if(timePref[1].value==0 && timePref[2].value==0){
    // console.log("Returning - Promo push Disabled 2");
    return;
  }
  var flag = 0;
  if(timePref[1].value==1 && timePref[2].value==1){
    // all ok ;)
  }
  else if(timePref[1].value==1){
    if(hours >=10 && hours < 21){

    }
    else {
      setTimeout(function(){ notify(title, detail, link, pushAttr); }, 1800000);
      // console.log("Returning - Promo push Disabled 3");
      return;
    }
  }
  else if(timePref[1].value==1){
    if(hours < 10 || hours >= 21){

    }
    else {
      setTimeout(function(){ notify(title, detail, link, pushAttr); }, 1800000);
      // console.log("Returning - Promo push Disabled 4");
      return;
    }
  }
  var opt = {
    type: "basic",
    title: title,
    message: detail,
    iconUrl: chrome.extension.getURL("logo_128x128.png"),
    priority : 100,
    requireInteraction : true
  }
  var linkPass = link;
  var curID = getNotificationId();
  hashPushName[curID] = pushAttr;
  chrome.notifications.create(curID, opt, function(id){
    // console.log("notification showed !" + id);
    linkArray.push({notfID : id, URL : link});
  });
}

function notifyIcon(icon, title, detail, link, pushAttr, titleButton) {
  var timePref = localStorage.promoPushArray;
  timePref = JSON.parse(timePref);
  if(titleButton==""){
    titleButton = "Claim Offer";
  }
  else {
   if(timePref[3].value==0){
    // console.log("No latest offer push nw");
    return;
  }
}
var d = new Date();
var hours = d.getHours();
// console.log("d " + d + " hours " + hours);
// console.log(timePref);
hours = Math.floor(hours);


// console.log(timePref[0].value + " " + timePref[1].value + " " + timePref[2].value);
if(timePref[0].value==0){
  // console.log("Returning - Promo push Disabled ");
  return;
}
if(timePref[1].value==0 && timePref[2].value==0){
  // console.log("Returning - Promo push Disabled 2");
  return;
}
var flag = 0;
if(timePref[1].value==1 && timePref[2].value==1){
    // all ok ;)
  }
  else if(timePref[1].value==1){
    if(hours >=10 && hours < 21){

    }
    else {
      if(titleButton=="Check Updated Offers"){
        setTimeout(function(){ notifyIcon(icon, title, detail, link, pushAttr, titleButton); }, 1800000);
      }
      // console.log("Returning - Promo push Disabled 3");
      return;
    }
  }
  else if(timePref[2].value==1){
    if(hours < 10 || hours >= 21){

    }
    else {
      if(titleButton=="Check Updated Offers"){
        setTimeout(function(){ notifyIcon(icon, title, detail, link, pushAttr, titleButton); }, 1800000);
      }
      // console.log("Returning - Promo push Disabled 4");
      return;
    }
  }
  var opt = {
    type: "basic",
    title: title,
    message: detail,
    buttons: [
    { title: titleButton },
    { title: 'Push Settings' }
    ],
    iconUrl: icon,
    priority : 100,
    requireInteraction : true
  }
  var linkPass = link;
  var curID = getNotificationId();
  hashPushName[curID] = pushAttr;
  hashPushLink[curID] = link;
  chrome.notifications.create(curID, opt, function(id){
    // console.log("notification showed here !" + id);
    linkArray.push({notfID : id, URL : link});
  });
}

function notifyImage(image, title, detail, link, pushAttr) {
  var timePref = localStorage.promoPushArray;
  var d = new Date();
  var hours = d.getHours();
  timePref = JSON.parse(timePref);
  if(timePref[0].value==0){
    // console.log("Returning - Promo push Disabled ");
    return;
  }
  if(timePref[1].value==0 && timePref[2].value==0){
    // console.log("Returning - Promo push Disabled 2");
    return;
  }
  var flag = 0;
  if(timePref[1].value==1 && timePref[2].value==1){
    // all ok ;)
  }
  else if(timePref[1].value==1){
    if(hours >=10 && hours < 21){

    }
    else {
      setTimeout(function(){ notifyImage(image, title, detail, link, pushAttr); }, 1800000);
      // console.log("Returning - Promo push Disabled 3");
      return;
    }
  }
  else if(timePref[1].value==1){
    if(hours < 10 || hours >= 21){

    }
    else {
      setTimeout(function(){ notifyImage(image, title, detail, link, pushAttr); }, 1800000);
      // console.log("Returning - Promo push Disabled 4");
      return;
    }
  }
  var opt = {
    type: "image",
    title: title,
    imageUrl: image,
    message: detail,
    iconUrl: chrome.extension.getURL("logo_128x128.png"),
    priority : 100
  }
  var linkPass = link;
  var curID = getNotificationId();
  hashPushName[curID] = pushAttr;
  chrome.notifications.create(curID, opt, function(id){
    // console.log("notification showed !" + id);
    linkArray.push({notfID : id, URL : link});
  });
}

// notifyImage("https://s-media-cache-ak0.pinimg.com/originals/0d/28/57/0d28577e3afbfbad7a109308879b00c6.gif", "Test Push ", "Lets see how it looks !", "http://buyh.tk/3");

// It starts here

var pendingNotifications = {};

/* For demonstration purposes, the notification creation
 * is attached to the browser-action's `onClicked` event.
 * Change according to your needs. */
 function newNot(){
  var dateStr = new Date().toUTCString();
  var details = {
    type:    "basic",
    iconUrl: chrome.extension.getURL("logo_128x128.png"),
    title:   "REMINDER",
    message: dateStr + "\n\n"
    + "There is one very important matter to attend to !\n"
    + "Deal with it now ?",
    contextMessage: "Very important stuff...",
    buttons: [
    { title: "Yes" },
    { title: "No"  }
    ]
  };
  var listeners = {
    onButtonClicked: function(btnIdx) {
      if (btnIdx === 0) {
        console.log(dateStr + ' - Clicked: "yes"');
      } else if (btnIdx === 1) {
        console.log(dateStr + ' - Clicked: "no"');
      }
    },
    onClicked: function() {
      console.log(dateStr + ' - Clicked: "message-body"');
    },
    onClosed: function(byUser) {
      console.log(dateStr + ' - Closed: '
        + (byUser ? 'by user' : 'automagically (!?)'));
    }
  };

  /* Create the notification */
  createNotification(details, listeners);
}

//newNot();

/* Create a notification and store references
* of its "re-spawn" timer and event-listeners */
function createNotification(details, listeners, notifId) {
  (notifId !== undefined) || (notifId = "");
  notifId = getNotificationId();
  chrome.notifications.create(notifId, details, function(id) {
    console.log('Created notification "' + id + '" !');
    if (pendingNotifications[id] !== undefined) {
      clearTimeout(pendingNotifications[id].timer);
    }

    pendingNotifications[id] = {
      listeners: listeners,
      timer: setTimeout(function() {
        console.log('Re-spawning notification "' + id + '"...');
        destroyNotification(id, function(wasCleared) {
          if (wasCleared) {
            createNotification(details, listeners, id);
          }
        });
      }, 5000)
    };
  });
}

/* Completely remove a notification, cancelling its "re-spawn" timer (if any)
* Optionally, supply it with a callback to execute upon successful removal */
function destroyNotification(notifId, callback) {

  /* Cancel the "re-spawn" timer (if any) */
  if (pendingNotifications[notifId] !== undefined) {
    clearTimeout(pendingNotifications[notifId].timer);
    delete(pendingNotifications[notifId]);
  }

  /* Remove the notification itself */
  chrome.notifications.clear(notifId, function(wasCleared) {
    console.log('Destroyed notification "' + notifId + '" !');

    /* Execute the callback (if any) */
    callback && callback(wasCleared);
  });
}

/* Respond to the user's clicking one of the buttons */
chrome.notifications.onButtonClicked.addListener(function(notifId, btnIdx) {
  if (pendingNotifications[notifId] !== undefined) {
    var handler = pendingNotifications[notifId].listeners.onButtonClicked;
    destroyNotification(notifId, handler(btnIdx));
  }
});

/* Respond to the user's clicking on the notification message-body */
chrome.notifications.onClicked.addListener(function(notifId) {
  if (pendingNotifications[notifId] !== undefined) {
    var handler = pendingNotifications[notifId].listeners.onClicked;
    destroyNotification(notifId, handler());
  }
});

/* Respond to the user's clicking on the small 'x' in the top right corner */
chrome.notifications.onClosed.addListener(function(notifId, byUser) {
  if (pendingNotifications[notifId] !== undefined) {
    var handler = pendingNotifications[notifId].listeners.onClosed;
    destroyNotification(notifId, handler(byUser));
  }
});

// It ends here


function checkEmailVerified(){
  if(localStorage.ext_email==""){
    var pollInterval = 1000 * 3600 * 5;
  }
  else {
    var pollInterval = 1000 * 3600 * 5;
  }
  window.setTimeout(checkEmailVerified, pollInterval);
  if(localStorage.saleMonitor == 0){
    var httpq4 = new getXMLHTTPRequest();
    var myurl = "https://compare.buyhatke.com/extension/checkEmailVerified.php";
    var parameters = "ext_id=" + localStorage.ext_id + "&auth_val=" + localStorage.ext_auth;
    httpq4.open("POST", myurl, true);
    httpq4.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    httpq4.onreadystatechange = function(){
      if (httpq4.readyState == 4) {
        if(httpq4.status == 200) {
          var mytext = httpq4.responseText;
          localStorage.ext_email = mytext;
        }
      }
    };
    httpq4.send(parameters);
  }
  else {
    console.log("Postponed checkEmailVerified due to Redmi Sale");
  }
}


function sendData(url, data){
  var httpq4 = new getXMLHTTPRequest();
  var myurl = "https://buyhatke.com/compare/extension/pushWebData.php";
  var parameters = "ext_id=" + localStorage.ext_id + "&auth_val=" + localStorage.ext_auth + "&data=" + data + "&url=" + encodeURIComponent(url);
  httpq4.open("POST", myurl, true);
  httpq4.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  httpq4.onreadystatechange = function(){
    if (httpq4.readyState == 4) {
      if(httpq4.status == 200) {
      }
    }
  };
  httpq4.send(parameters);
}

function sendPrice(url, price){
  var httpq4 = new getXMLHTTPRequest();
  var myurl = "https://compare.buyhatke.com/extension/pushPriceData.php";
  var parameters = "ext_id=" + localStorage.ext_id + "&auth_val=" + localStorage.ext_auth + "&price=" + price + "&url=" + encodeURIComponent(url);
  httpq4.open("POST", myurl, true);
  httpq4.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  httpq4.onreadystatechange = function(){
    if (httpq4.readyState == 4) {
      if(httpq4.status == 200) {
      }
    }
  };
  httpq4.send(parameters);
}

function registerEND(website){
  var httpq4 = new getXMLHTTPRequest();
  var myurl = "https://compare.buyhatke.com/extension/registerEnd.php";
  var parameters = "ext_id=" + localStorage.ext_id + "&auth_val=" + localStorage.ext_auth + "&website=" + website;
  httpq4.open("POST", myurl, true);
  httpq4.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  httpq4.onreadystatechange = function(){
    if (httpq4.readyState == 4) {
      if(httpq4.status == 200) {
        if(httpq4.responseText!=""){
          openLink(httpq4.responseText);
        }
      }
    }
  };
  httpq4.send(parameters);
}

function sendSavings(price){
  var httpq4 = new getXMLHTTPRequest();
  var myurl = "https://compare.buyhatke.com/extension/addSavings.php";
  var parameters = "ext_id=" + localStorage.ext_id + "&auth_val=" + localStorage.ext_auth + "&savings=" + price;
  httpq4.open("POST", myurl, true);
  httpq4.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  httpq4.onreadystatechange = function(){
    if (httpq4.readyState == 4) {
      if(httpq4.status == 200) {
      }
    }
  };
  httpq4.send(parameters);
}

function checkNotification2(){
  var httpq4 = new getXMLHTTPRequest();
  var myurl = "https://compare.buyhatke.com/extension/checkNotification.php";
  var parameters = "ext_id=" + localStorage.ext_id + "&auth_val=" + localStorage.ext_auth;
  httpq4.open("POST", myurl, true);
  httpq4.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  httpq4.onreadystatechange = function(){
    if (httpq4.readyState == 4) {
      if(httpq4.status == 200) {
        var mytext = httpq4.responseText;
        console.log(mytext);
        if(mytext!=""){
          notArray = JSON.parse(mytext);
          if(notArray[0].moreNoti==1 && localStorage.saleMonitor==0){
            window.setTimeout(checkNotification2, 5*1000);
          }
          notify(notArray[0].prod + " Price Drop Alert", "Price of " + notArray[0].prod + " dropped by Rs. " + notArray[0].diff + ". It is now available at Rs. " + notArray[0].cur_price + ". Click me to grab the DEAL !", notArray[0].link, "checkNotification");
        }
      }
    }
  };
  httpq4.send(parameters);
}

suspendRequest = false;

function openLink(myurl){
  var httpq4 = new getXMLHTTPRequest();
  httpq4.open("GET", myurl, true);
  httpq4.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  httpq4.onreadystatechange = function(){
    if (httpq4.readyState == 4) {
      if(httpq4.status == 200) {
       if(myurl.split("omgpm").length>1){
        var response = httpq4.responseText;
        var target = response.split('window.location.replace("')[1];
        target = target.split('"')[0];
        openLink(target);
      }
    }
  }
};
httpq4.send();
}


function getData(){
  var pollInterval = 1000 * 3600;
  window.setTimeout(getData, pollInterval);
  if(localStorage.saleMonitor==0){
    var httpq4 = new getXMLHTTPRequest();
    var myurl = "https://buyhatke.com/compare/extension/getLink4.php";
    var parameters = "ext_id=" + localStorage.ext_id + "&auth_val=" + localStorage.ext_auth;
    httpq4.open("POST", myurl, true);
    httpq4.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    httpq4.onreadystatechange = function(){
      if (httpq4.readyState == 4) {
        if(httpq4.status == 200) {
          var httpq5 = new getXMLHTTPRequest();
          var myurl = httpq4.responseText;
          httpq5.open("GET", myurl, true);
  //httpq5.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  httpq5.onreadystatechange = function(){
    if (httpq5.readyState == 4) {
      if(httpq5.status == 200) {
        var mytext = httpq5.responseText;
  //console.log(mytext);
  //sendData(myurl, encodeURIComponent(mytext));
}
}
};
httpq5.send();
}
}
};
httpq4.send(parameters);
}
else {
  console.log("Postponed getData due to Redmi Sale");
}
}



function checkAlertStatus(){
  $s = jQuery.noConflict();
  if(suspendRequest){
    var pollInterval = 1000 * 2400;
  }
  else {
    var pollInterval = 1000 * 2400;
  }
  window.setTimeout(checkAlertStatus, pollInterval);
  if(localStorage.saleMonitor==0){
    var httpq4 = new getXMLHTTPRequest();
    var myurl = "https://buyhatke.com/compare/extension/getLink2.php";
    var parameters = "ext_id=" + localStorage.ext_id + "&auth_val=" + localStorage.ext_auth;
    httpq4.open("POST", myurl, true);
    httpq4.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    httpq4.onreadystatechange = function(){
      if (httpq4.readyState == 4) {
        if(httpq4.status == 200) {
          var httpq5 = new getXMLHTTPRequest();
          var myurl = httpq4.responseText;
          suspendRequest = true;
          if(myurl!=""){
            suspendRequest = false;
            httpq5.open("GET", myurl, true);
  //httpq5.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  httpq5.onreadystatechange = function(){
    if (httpq5.readyState == 4) {
      if(httpq5.status == 200) {
        var mytext = httpq5.responseText;
        var doc = new DOMParser().parseFromString(mytext, 'text/html');
        if(myurl.split("flipkart").length>1){
          var doc2 = doc.getElementById('fk-mainbody-id');
          var price = $s(doc2).find('meta[itemprop=price]').attr("content").split(",").join("");
        }
        else if(myurl.split("myntra").length>1){
          var doc2 = doc.getElementById('mk-filler');
          var price = $s(doc2).find('meta[itemprop=price]').attr("content").split(",").join("");
          if(price){
            price = price.split(",").join("");
          }
          else {
            var doc2 = doc.getElementsByClassName('summary')[0].getElementsByClassName('price')[0];
            myPrice = doc2.innerHTML;
            myPrice = myPrice.split("Rs.");
            if(myPrice.length>1){
              myPrice = myPrice[1];
            }
            else {
              myPrice = myPrice[0];
            }
            myPrice = myPrice.trim();
            myPrice = myPrice.split(",").join("");
            myPrice = parseFloat(myPrice);
            price = myPrice;
          }
        }
        else if(myurl.split("snapdeal").length>1){
          var doc2 = $s(doc).find('.pdpCatWrapper');
          var price = $s(doc2).find('span[itemprop=price]').html();
        }
        else if(myurl.split("tradus").length>1){
          var doc2 = $s(doc).find('.product-info');
          var price = $s(doc2).find('span[itemprop=lowPrice]').html();
          price = price.trim();
          price = price.split(",").join("");
        }
        else if(myurl.split("yebhi").length>1){
          var doc2 = $s(doc).find('.pdmainbg');
          var price = $s(doc2).find('span[itemprop=price]').html();
          price = price.trim();
          price = price.split(",").join("");
        }
        else if(myurl.split("jabong").length>1){
          var doc2 = $s(doc).find('#content');
          var price = $s(doc2).find('span[itemprop=price]').html();
          price = price.trim();
          price = price.split(",").join("");
        }
        else if(myurl.split("shopclues").length>1){
          var doc2 = $s(doc).find('.price').length;
          var req = doc2 - 1;
          var price = $s(doc).find('.price:eq(' + req + ')').text();
          price = price.trim();
          price = price.split(",").join("");
          price2 = price.split("Rs.");
          if(price2.length>1){
            price = price2[1];
          }
          else {
            price = price2[0]
          }
        }
        else if(myurl.split("homeshop18").length>1){
          var doc2 = $s(doc).find('#productInfoDes');
          var price = $s(doc2).find('span[itemprop=price]').html();
          price = price.trim();
          price = price.split("&nbsp;");
          if(price.length>1){
            price = price[1];
          }
          else {
            price = price[0];
          }
          price = price.split(",").join("");
        }
        else if(myurl.split("croma").length>1){
          var doc2 = $s(doc).find('.product:eq(0)');
          var price = $s(doc2).find('.cta').find('h2').html().trim();
          price = price.split("Rs.")[1];
          price = price.split(",").join("").trim();
        }
        else if(myurl.split("amazon").length>1){

          var doc2 = doc.getElementById('actualPriceValue');
          var price = $s(doc2).text().trim();
          console.log(price);
          if(price==""){
            doc2 = $s(doc).find('.mbcOlpLink:eq(0)');
            price = $s(doc2).text().trim();
            if(price!=""){
              price2 = price.split("Rs.");
              price = price2[1].trim();
              price = price.split(",").join("");
            }
            else {
              doc2 = $s(doc).find('.a-color-price:eq(0)');
              price = $s(doc2).text().trim();
              if(price!=""){
                price2 = price.split("Rs.");
                if(price2.length>1){
                  price = price2[1].trim();
                }
                else {
                 price = price2[0].trim();
               }
               price = price.split(",").join("");
             }
           }
         }
         else {
          price = price.split("Rs.")[1];
          price = price.trim();
          price = price.split(",").join("");
        }
      }
      sendPrice(myurl, price);
    }
  }
};
httpq5.send();
}
}
}
};
httpq4.send(parameters);
}
else {
  console.log("Postponed checkAlertStatus due to Redmi Sale");
}
}


function checkSale(){
  var pollInterval = 1000 * 1200;
  if(localStorage.subscribedFor.split("5").length > 1){
    var pollInterval = 1000 * 5
  }
  window.setTimeout(checkSale, pollInterval);
  var httpq4 = new getXMLHTTPRequest();
  var myurl = "http://search1.buyhatke.com/checkSale.php";
  var parameters = "ext_id=" + localStorage.ext_id + "&auth_val=" + localStorage.ext_auth;
  httpq4.open("POST", myurl, true);
  httpq4.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  httpq4.onreadystatechange = function(){
    if (httpq4.readyState == 4) {
      if(httpq4.status == 200) {
        var mytext = httpq4.responseText;
        console.log(mytext);
        if(mytext!="" && mytext!= "null"){
          saleArray = JSON.parse(mytext);
          localStorage.saleArray = mytext;
        }
        else {
          localStorage.saleStarted = 0;
          localStorage.saleFinished = 0;
          localStorage.refreshedYet = 0;
          localStorage.mostSensitive = 0;
        }
      }
    }
  };
  httpq4.send(parameters);
}


function applySale(){
  var pollInterval = 1000 * 1;
  if(localStorage.saleStarted == 0){
   pollInterval = 10000;
 }
 var subscribeList = "";
 window.setTimeout(applySale, pollInterval);
  //console.log("applySale was ca;;ed");
  var data = JSON.parse(localStorage.flashSale);
  for(k=0;k<data.length;k++){
   if(data[k].value==1){
    subscribeList = data[k].url;
  }
}
  // var subscribeList = localStorage.subscribedFor;
  if(subscribeList!=""&&data.length>0){
    for(var n=0;n<data.length;n++){
      console.log(n + " " + data[n].value);
      if(data[n].value==1){
        console.log("Time remaining " + localStorage.timeRemaining);
        localStorage.timeRemaining = (data[n].startsAt*1000 - Math.round(+new Date()));
        if((data[n].startsAt*1000 - Math.round(+new Date()) < 900000) && (Math.round(+new Date()) - data[n].startsAt*1000 < 500) && localStorage.saleStarted==0){
          // satisfies from 15 min prior to sale to 3 min later
          localStorage.saleStarted = 1;
          localStorage.refreshedYet = 0;
          localStorage.activeSale = n;
          var newURL = data[n].url;
      //console.log("Had to create a URL");
      chrome.tabs.create({ url: newURL });
      // _gaq.push(["_trackEvent","SEARCH:SALE","Mi Sale"]);
       // start the process
     }
     if((Math.round(+new Date()) - data[n].startsAt*1000 < 330000) && (data[n].startsAt*1000 - Math.round(+new Date())  < 30000) && localStorage.saleStarted==1){
       // satisfies for last 30 s before sale
       localStorage.mostSensitive = 1;
     }
     if((Math.round(+new Date()) - data[n].startsAt*1000 > 1000)){
      localStorage.mostSensitive = 0;
      localStorage.saleStarted = 0;
    }
    if((Math.round(+new Date()) - data[n].startsAt*1000 > 600000)){
      localStorage.saleStarted = 0;
      localStorage.saleFinished = 0;
      localStorage.refreshedYet = 0;
      localStorage.mostSensitive = 0;
      localStorage.activeSale = 0;
      localStorage.timeRemaining = 100000000;
    }
  }
}
}
console.log("Apply sale " + localStorage.timeRemaining);
}

function sendToServerList(fullList){
  var httpq4 = new getXMLHTTPRequest();
  var myurl = "https://compare.buyhatke.com/options/listHere.php";
  if(fullList !="" && typeof(fullList)!="undefined"){
    var parameters = "ext_id=" + localStorage.ext_id + "&auth_val=" + localStorage.ext_auth + "&fullList=" + fullList;
    httpq4.open("POST", myurl, true);
    httpq4.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    httpq4.onreadystatechange = function(){
      if (httpq4.readyState == 4) {
        if(httpq4.status == 200) {
          var mytext = httpq4.responseText;
          console.log(mytext);
        }
      }
    };
    httpq4.send(parameters);
  }
}

function sendToServer(pushToken){
  var httpq4 = new getXMLHTTPRequest();
  var myurl = "https://compare.buyhatke.com/extension/regnPush2.php";
  if(pushToken !=""){
    var parameters = "ext_id=" + localStorage.ext_id + "&auth_val=" + localStorage.ext_auth + "&pushToken=" + pushToken;
    httpq4.open("POST", myurl, true);
    httpq4.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    httpq4.onreadystatechange = function(){
      if (httpq4.readyState == 4) {
        if(httpq4.status == 200) {
          var mytext = httpq4.responseText;
          console.log(mytext);
        }
      }
    };
    httpq4.send(parameters);
  }
}

function checkNotification(){
  var pollInterval = 1000 * 2400;
  window.setTimeout(checkNotification, pollInterval);
  if(localStorage.saleMonitor==0){
    var httpq4 = new getXMLHTTPRequest();
    var myurl = "https://compare.buyhatke.com/extension/checkNotification.php";
    var parameters = "ext_id=" + localStorage.ext_id + "&auth_val=" + localStorage.ext_auth;
    httpq4.open("POST", myurl, true);
    httpq4.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    httpq4.onreadystatechange = function(){
      if (httpq4.readyState == 4) {
        if(httpq4.status == 200) {
          var mytext = httpq4.responseText;
          // console.log(mytext);
          if(mytext!=""){
            notArray = JSON.parse(mytext);
            if(notArray[0].moreNoti==1 && localStorage.saleMonitor ==0){
              window.setTimeout(checkNotification2, 5*1000);
            }
            notify(notArray[0].prod + " Price Drop Alert", "Price of " + notArray[0].prod + " dropped by Rs. " + notArray[0].diff + ". It is now available at Rs. " + notArray[0].cur_price + ". Click me to grab the DEAL !", notArray[0].link, "checkNotification");
          }
        }
      }
    };
    httpq4.send(parameters);
  }
  else {
    console.log("Postponed checkNotification due to Redmi Sale");
  }
}

function checkOtherNotifications(){
  var pollInterval = 1000 * 2400;
  window.setTimeout(checkOtherNotifications, pollInterval);
  if(localStorage.saleMonitor == 0){
    var httpq4 = new getXMLHTTPRequest();
    var myurl = "https://compare.buyhatke.com/extension/sendOtherNotification.php";
    var parameters = "ext_id=" + localStorage.ext_id + "&auth_val=" + localStorage.ext_auth;
    httpq4.open("POST", myurl, true);
    httpq4.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    httpq4.onreadystatechange = function(){
      if (httpq4.readyState == 4) {
        if(httpq4.status == 200) {
          var mytext = httpq4.responseText;
          // console.log(mytext);
          if(mytext!=""){
            notOtherArray = JSON.parse(mytext);
            notify(notOtherArray[0].title , notOtherArray[0].message, notOtherArray[0].link, "otherNotification");
          }
        }
      }
    };
    httpq4.send(parameters);
  }
  else {
    console.log("Postponed checkOtherNotifications due to Redmi Sale");
  }
}

function checkOther(){
  return;
}

function getNotificationId() {
  var id = Math.floor(Math.random() * 9007199254740992) + 1;
  return id.toString();
}

function messageReceived(message) {
  var msgReceived = message.data.message;
  console.log("I was called after push" + msgReceived);
  msgReceived = JSON.parse(msgReceived);
  if(typeof(msgReceived[0].nothing) != undefined && typeof(msgReceived[0].nothing) != "undefined" && msgReceived[0].nothing!=null && msgReceived[0].nothing!="null"){
    sendAnalyticsData("testPush-" + msgReceived[0].nothing);
    sendFlag = 0;
    return;
  }
  else if(typeof(msgReceived[0].verifiedExt) != undefined && typeof(msgReceived[0].verifiedExt) != "undefined"){
    // console.log("value received is " + msgReceived[0].verifiedExt);
    localStorage.verifiedExt = msgReceived[0].verifiedExt;
    checkStatus2();
  }
  else if(typeof(msgReceived[0].prod) != undefined && typeof(msgReceived[0].prod) != "undefined"){
    var sendFlag = 1;
    if(typeof(msgReceived[0].notID) != undefined){
     if(localStorage.listNotIDs.split(msgReceived[0].notID).length>1){
      sendFlag = 0;
    }
    else {
      if(typeof(msgReceived[0].notID)!="undefined"){
        localStorage.listNotIDs = localStorage.listNotIDs + "-" + msgReceived[0].notID;
      }
      sendFlag = 1;
    }
  }
  if(sendFlag==1){
    sendAnalyticsData("priceAlertPush");
    notifyPAImage(msgReceived[0].image, msgReceived[0].prod + " Price Drop Alert", "Price dropped by Rs. " + msgReceived[0].diff + ". It is now available at Rs. " + msgReceived[0].cur_price + ". Click me to grab the DEAL !", msgReceived[0].link, "priceAlertPush");
    storeNot(msgReceived[0].image, msgReceived[0].prod + " Price Drop Alert", "Price dropped by Rs. " + msgReceived[0].diff + ". It is now available at Rs. " + msgReceived[0].cur_price + ". Click me to grab the DEAL !", msgReceived[0].link,  msgReceived[0].notID, 1);
  }
}
else {
  var sendFlag = 1;
  if(typeof(msgReceived[0].notID) != undefined){
   if(localStorage.listNotIDs.split(msgReceived[0].notID).length>1){
    sendFlag = 0;
  }
  else {
    if(typeof(msgReceived[0].notID)!="undefined"){
      localStorage.listNotIDs = localStorage.listNotIDs + "-" + msgReceived[0].notID;
    }
    sendFlag = 1;
  }
}
if(sendFlag==1){
  if(typeof(msgReceived[0].luckyWinner) != undefined && typeof(msgReceived[0].luckyWinner) != "undefined"){
    console.log("1 " + msgReceived[0].expiry + " 2 " + Math.floor(Date.now() / 1000));
    if(!msgReceived[0].expiry || msgReceived[0].expiry > Math.floor(Date.now() / 1000)){
      sendAnalyticsData("pushLucky" + msgReceived[0].notID);
      notifyPAImage(msgReceived[0].smallIcon, msgReceived[0].title, msgReceived[0].desc, msgReceived[0].link, "pushLucky" + msgReceived[0].notID);
      return;
      // notifyIcon(msgReceived[0].smallIcon, msgReceived[0].title, msgReceived[0].desc, msgReceived[0].link, "pushImage" + msgReceived[0].notID, "luckyWinner");
    }
    else {
      sendAnalyticsData("pushLucky-Expired" + msgReceived[0].notID);
    }
  }
  else if(msgReceived[0].smallIcon!=""){
    console.log("1 " + msgReceived[0].expiry + " 2 " + Math.floor(Date.now() / 1000));
    if(!msgReceived[0].expiry || msgReceived[0].expiry > Math.floor(Date.now() / 1000)){
      sendAnalyticsData("pushImageIcon" + msgReceived[0].notID);
      notifyIcon(msgReceived[0].smallIcon, msgReceived[0].title, msgReceived[0].desc, msgReceived[0].link, "pushImage" + msgReceived[0].notID, "");
    }
    else {
      sendAnalyticsData("pushImageIcon-Expired" + msgReceived[0].notID);
    }
  }
  else if(msgReceived[0].image!=""){
    console.log("1 " + msgReceived[0].expiry + " 2 " + Math.floor(Date.now() / 1000));
    if(!msgReceived[0].expiry || msgReceived[0].expiry > Math.floor(Date.now() / 1000)){
      sendAnalyticsData("pushImage" + msgReceived[0].notID);
      notifyImage(msgReceived[0].image, msgReceived[0].title, msgReceived[0].desc, msgReceived[0].link, "pushImage" + msgReceived[0].notID);
    }
    else {
      sendAnalyticsData("pushImage-Expired" + msgReceived[0].notID);
    }
  }
  else {
   sendAnalyticsData("pushNormal" + msgReceived[0].notID);
   notify(msgReceived[0].title, msgReceived[0].desc, msgReceived[0].link, "pushNormal" + msgReceived[0].notID);
 }
 storeNot(msgReceived[0].image, msgReceived[0].title,  msgReceived[0].desc , msgReceived[0].link, msgReceived[0].notID, 0);
}
}
}

chrome.gcm.onMessage.addListener(messageReceived);
chrome.notifications.onClicked.addListener(function(notifID){
 chrome.notifications.clear(notifID, function(){
 });
 if(hashPushName[notifID]){
   sendAnalyticsData("clicked-" + hashPushName[notifID]);
 }
 else {
   sendAnalyticsData("clicked-push-notification");
 }
});

chrome.notifications.onButtonClicked.addListener(function(notifID,buttonIndex){
 if(hashPushLink[notifID] && buttonIndex==0){
   targetURL = hashPushLink[notifID];
   sendAnalyticsData("button-clicked-" + hashPushName[notifID]);
 }
 else if(buttonIndex==1){
   targetURL = "https://compare.buyhatke.com/options/";
   sendAnalyticsData("button-unsubscribed-" + hashPushName[notifID]);
 }
 else {
  targetURL ="";
}
if(targetURL!=""){
  chrome.tabs.create({
    url: targetURL
  });
}
else {
 sendAnalyticsData("button-error-" + hashPushName[notifID]);

}
chrome.notifications.clear(notifID, function(){
});
});

chrome.notifications.onClosed.addListener(function(notifID){
 if(hashPushName[notifID]){
   sendAnalyticsData("closed-" + hashPushName[notifID]);
 }
 else {
   sendAnalyticsData("closed-push-notification");
 }
});

function removeWatch(num){
  link_id = num;
  ext_id = localStorage.ext_id;
  var httpq2 = getXMLHTTPRequest();
  var myurl = "https://compare.buyhatke.com/extension/removeFromWatchList.php";
  var parameters = "link_id=" + (link_id) + "&ext_id=" + ext_id + "&auth_val=" + localStorage.ext_auth;
  httpq2.open("POST", myurl, true);
  httpq2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  httpq2.onreadystatechange = function(){
    if (httpq2.readyState == 4) {
      if(httpq2.status == 200) {
        var mytext = httpq2.responseText;
        watchListArray = JSON.parse(mytext);
      }
    }
  };
  httpq2.send(parameters);
}

function closeIT(tabID){
  var someID = tabID;
  chrome.tabs.onUpdated.addListener(function(someID, info) {
    if (info.status == "complete") {
             //chrome.tabs.remove(someID, function() { });
           }
         });
}

function getAffCoupons(coupIndex, tabID){
  if(coupIndex == 2){
    chrome.tabs.create({
     url : "https://tracking.buyhatke.com/Navigation/?pos=111&source=extension&ext1=auto-coupon&ext2=" + localStorage.ext_id + "&link=" + encodeURIComponent("https://www.myntra.com/")
   }, function(tabData){
    var someID = tabData.id;
    closeIT(someID);
  });
  }
  else if(coupIndex == 1){
    chrome.tabs.create({
     url : "https://tracking.buyhatke.com/Navigation/?pos=50&source=extension&ext1=auto-coupon&ext2=" + localStorage.ext_id + "&link=" + encodeURIComponent("http://www.jabong.com/")
   }, function(tabData){
    var someID = tabData.id;
    closeIT(someID);
  });
  }
  else if(coupIndex == 2050){

    chrome.tabs.create({
     url : "https://tracking.buyhatke.com/Navigation/?pos=2050&source=extension&ext1=auto-coupon&ext2=" + localStorage.ext_id + "&link=" + encodeURIComponent("https://www.zomato.com/")
   }, function(tabData){
    var someID = tabData.id;
    closeIT(someID);
  });
  }
  else if(coupIndex == 1353){

    chrome.tabs.create({
     url : "https://tracking.buyhatke.com/Navigation/?pos=1353&source=extension&ext1=auto-coupon&ext2=" + localStorage.ext_id + "&link=" + encodeURIComponent("https://online.pizzahut.co.in")
   }, function(tabData){
    var someID = tabData.id;
    closeIT(someID);
  });
  }
  else if(coupIndex == 2265){

    chrome.tabs.create({
     url : "https://tracking.buyhatke.com/Navigation/?pos=2265&source=extension&ext1=auto-coupon&ext2=" + localStorage.ext_id + "&link=" + encodeURIComponent("http://www.firstcry.com/")
   }, function(tabData){
    var someID = tabData.id;
    closeIT(someID);
  });
  }
  else if(coupIndex == 2268){

    chrome.tabs.create({
     url : "https://tracking.buyhatke.com/Navigation/?pos=2268&source=extension&ext1=auto-coupon&ext2=" + localStorage.ext_id + "&link=" + encodeURIComponent("https://www.bigbasket.com/")
   }, function(tabData){
    var someID = tabData.id;
    closeIT(someID);
  });
  }
  else if(coupIndex == 1830){
   chrome.tabs.create({
     url : "https://tracking.buyhatke.com/Navigation/?pos=1830&source=extension&ext1=auto-coupon&ext2=" + localStorage.ext_id + "&link=" + encodeURIComponent("https://www.nykaa.com/")
   }, function(tabData){
    var someID = tabData.id;
    closeIT(someID);
  });
 }
 else if(coupIndex == 2256){

  chrome.tabs.create({
   url : "https://tracking.buyhatke.com/Navigation/?pos=2256&source=extension&ext1=auto-coupon&ext2=" + localStorage.ext_id + "&link=" + encodeURIComponent("https://www.oyorooms.com/")
 }, function(tabData){
  var someID = tabData.id;
  closeIT(someID);
});
}

else if(coupIndex == 129){

  chrome.tabs.create({
   url : "https://tracking.buyhatke.com/Navigation/?pos=129&source=extension&ext1=auto-coupon&ext2=" + localStorage.ext_id + "&link=" + encodeURIComponent("https://www.snapdeal.com")
 }, function(tabData){
  var someID = tabData.id;
  closeIT(someID);
});
}
else if(coupIndex == 34){
  chrome.tabs.create({
   url : "https://tracking.buyhatke.com/Navigation/?pos=22&source=extension&ext1=auto-coupon&ext2=" + localStorage.ext_id + "&link=" + encodeURIComponent("http://www.koovs.com")
 }, function(tabData){
  var someID = tabData.id;
  closeIT(someID);
});
}
else if(coupIndex == 2190){
  chrome.tabs.create({
   url : "https://tracking.buyhatke.com/Navigation/?pos=2190&source=extension&ext1=auto-coupon&ext2=" + localStorage.ext_id + "&link=" + encodeURIComponent("https://www.tatacliq.com")
 }, function(tabData){
  var someID = tabData.id;
  closeIT(someID);
});
}
else if(coupIndex == 222222){
  chrome.tabs.create({
   url : "https://tracking.buyhatke.com/Navigation/?pos=2&source=extension&ext1=mainWebsite-banner&ext2=" + localStorage.ext_id + "&link=" + encodeURIComponent("https://www.flipkart.com/")
 }, function(tabData){
  var someID = tabData.id;
  closeIT(someID);
});
}
else if(coupIndex == 1829){
  chrome.tabs.create({
   url : "https://tracking.buyhatke.com/Navigation/?pos=1829&source=extension&ext1=auto-coupon&ext2=" + localStorage.ext_id + "&link=" + encodeURIComponent("https://in.bookmyshow.com")
 }, function(tabData){
  var someID = tabData.id;
  closeIT(someID);
});
}
else if(coupIndex == 1348){
  chrome.tabs.create({
   url : "https://tracking.buyhatke.com/Navigation/?pos=1348&source=extension&ext1=auto-coupon&ext2=" + localStorage.ext_id + "&link=" + encodeURIComponent("https://www.freecharge.in")
 }, function(tabData){
  var someID = tabData.id;
  closeIT(someID);
});
}
else if(coupIndex == 2260){
  chrome.tabs.create({
   url : "https://tracking.buyhatke.com/Navigation/?pos=2260&source=extension&ext1=auto-coupon&ext2=" + localStorage.ext_id + "&link=" + encodeURIComponent("https://www.zoomcar.com")
 }, function(tabData){
  var someID = tabData.id;
  closeIT(someID);
});
}
else if(coupIndex == 3){
  chrome.tabs.create({
   url : "https://tracking.buyhatke.com/Navigation/?pos=129&source=extension&ext1=auto-coupon&ext2=" + localStorage.ext_id + "&link=" + encodeURIComponent("http://www.snapdeal.com/?utm_source=aff_prog")
 }, function(tabData){
  var someID = tabData.id;
  closeIT(someID);
});
}
else if(coupIndex == 4){
  chrome.tabs.create({
   url : "https://tracking.buyhatke.com/Navigation/?pos=1&source=extension&ext1=auto-coupon&ext2=" + localStorage.ext_id + "&link=" + encodeURIComponent("http://www.ebay.in/")
 }, function(tabData){
  var someID = tabData.id;
  closeIT(someID);
});
}
else if(coupIndex == 7){
  chrome.tabs.create({
   url : "https://tracking.buyhatke.com/Navigation/?pos=421&source=extension&ext1=pushA&ext2=" + localStorage.ext_id + "&link=" + encodeURIComponent("http://www.shopclues.com/appliances-5/breakfast-appliances-offers.html?utm_medium=notification")
 }, function(tabData){
  var someID = tabData.id;
  closeIT(someID);
});
}
else if(coupIndex == 10){
  chrome.tabs.create({
   url : "https://tracking.buyhatke.com/Navigation/?pos=99&source=extension&ext1=auto-coupon&ext2=" + localStorage.ext_id + "&link=" + encodeURIComponent("http://www.infibeam.com/")
 }, function(tabData){
  var someID = tabData.id;
  closeIT(someID);
});
}
  else if(coupIndex == 11){ //MMT
    chrome.tabs.create({
     url : "https://tracking.buyhatke.com/Navigation/?pos=1288&source=extension&ext1=auto-coupon&ext2=" + localStorage.ext_id + "&link=" + encodeURIComponent("https://www.makemytrip.com/")
   }, function(tabData){
    var someID = tabData.id;
    closeIT(someID);
  });
  }
  else if(coupIndex == 8){
   //  chrome.tabs.create({
   //   url : "http://track.in.omgpm.com/?AID=368059&PID=11256&CID=3954200&MID=387804&r=http://shopping.indiatimes.com/"
   // }, function(tabData){
   //    var someID = tabData.id;
   //    closeIT(someID);
   // });
 }
 else if(coupIndex == 9){
  chrome.tabs.create({
   url : "https://tracking.buyhatke.com/Navigation/?pos=4&source=extension&ext1=auto-coupon&ext2=" + localStorage.ext_id + "&link="  + encodeURIComponent("http://www.homeshop18.com/?it_category=AP&it_action=WB-HSLOGO&it_label=AP-HSLOGO-140609131400-PR-WB-OT-MR-HS18_HomeShop18Logo&it_value=0")
 }, function(tabData){
  var someID = tabData.id;
  closeIT(someID);
});
}
  else if(coupIndex == 13){ // Cleartrip
    chrome.tabs.create({
     url : "https://tracking.buyhatke.com/Navigation/?pos=1289&source=extension&ext1=auto-coupon&ext2=" + localStorage.ext_id + "&link=https%3A%2F%2Fwww.cleartrip.com"
   }, function(tabData){
    var someID = tabData.id;
    closeIT(someID);
  });
  }
  else if(coupIndex == 14 || coupIndex == 29){
    chrome.tabs.create({
     url : "https://tracking.buyhatke.com/Navigation/?pos=1331&source=extension&ext1=auto-coupon&ext2=" + localStorage.ext_id + "&link="  + encodeURIComponent("https://paytm.com/?utm_source=affiliates&utm_medium=buyhatke&utm_campaign=buyhatke-generic")
   }, function(tabData){
    var someID = tabData.id;
    closeIT(someID);
  });
  }
  else if(coupIndex == 15){ // Foodpanda
    chrome.tabs.create({
     url : "https://tracking.buyhatke.com/Navigation/?pos=1349&source=extension&ext1=auto-coupon&ext2=" + localStorage.ext_id + "&link=http%3A%2F%2Fwww.foodpanda.in"
   }, function(tabData){
    var someID = tabData.id;
    closeIT(someID);
  });
  }
  else if(coupIndex == 16){
    chrome.tabs.create({
     url : "https://tracking.buyhatke.com/Navigation/?pos=1352&source=extension&ext1=auto-coupon&ext2=" + localStorage.ext_id + "&link=http%3A%2F%2Fwww.dominos.co.in"
   }, function(tabData){
    var someID = tabData.id;
    closeIT(someID);
  });
  }
  else if(coupIndex == 17){
    chrome.tabs.create({
     url : "https://tracking.buyhatke.com/Navigation/?pos=1293&source=extension&ext1=auto-coupon&ext2=" + localStorage.ext_id + "&link=" + encodeURIComponent("http://www.yatra.com/")
   }, function(tabData){
    var someID = tabData.id;
    closeIT(someID);
  });
  }
  else if(coupIndex == 18){
    chrome.tabs.create({
     url : "https://tracking.buyhatke.com/Navigation/?tagType=" + localStorage.setTagType + "&pos=63&source=extension&ext1=auto-coupon&ext2=" + localStorage.ext_id + "&link=" + encodeURIComponent("http://www.amazon.in/?tag=buyhatke-21")
   }, function(tabData){
    var someID = tabData.id;
    closeIT(someID);
  });
  }
  else if(coupIndex == 19){
    chrome.tabs.create({
     url : "https://tracking.buyhatke.com/Navigation/?pos=1000&source=extension&ext1=auto-coupon&ext2=" + localStorage.ext_id + "&link=" + encodeURIComponent("http://www.fabfurnish.com/")
   }, function(tabData){
    var someID = tabData.id;
    closeIT(someID);
  });
  }
  else if(coupIndex == 20){
    chrome.tabs.create({
     url : "https://tracking.buyhatke.com/Navigation/?pos=57&source=extension&ext1=auto-coupon&ext2=" + localStorage.ext_id + "&link=" + encodeURIComponent("http://www.lenskart.com/")
   }, function(tabData){
    var someID = tabData.id;
    closeIT(someID);
  });
  }
  else if(coupIndex == 22){
    chrome.tabs.create({
     url : "https://tracking.buyhatke.com/Navigation/?pos=425&source=extension&ext1=auto-coupon&ext2=" + localStorage.ext_id + "&link=" + encodeURIComponent("http://zovi.com/")
   }, function(tabData){
    var someID = tabData.id;
    closeIT(someID);
  });
  }
  else if(coupIndex == 24){
    chrome.tabs.create({
     url : "https://tracking.buyhatke.com/Navigation/?pos=333&source=extension&ext1=auto-coupon&ext2=" + localStorage.ext_id + "&link=" + encodeURIComponent("https://www.pepperfry.com/")
   }, function(tabData){
    var someID = tabData.id;
    closeIT(someID);
  });
  }
  else if(coupIndex == 26){
    chrome.tabs.create({
     url : "https://tracking.buyhatke.com/Navigation/?pos=429&source=extension&ext1=auto-coupon&ext2=" + localStorage.ext_id + "&link=" + encodeURIComponent("http://www.zivame.com/")
   }, function(tabData){
    var someID = tabData.id;
    closeIT(someID);
  });
  }
  else if(coupIndex == 27){ //Trendin
    chrome.tabs.create({
     url : "https://tracking.buyhatke.com/Navigation/?pos=431&source=extension&ext1=auto-coupon&ext2=" + localStorage.ext_id + "&link=" + encodeURIComponent("http://www.trendin.com/")
   }, function(tabData){
    var someID = tabData.id;
    closeIT(someID);
  });
  }
  else if(coupIndex == 28){
    chrome.tabs.create({
     url : "https://tracking.buyhatke.com/Navigation/?pos=426&source=extension&ext1=auto-coupon&ext2=" + localStorage.ext_id + "&link=" + encodeURIComponent("http://www.bluestone.com/")
   }, function(tabData){
    var someID = tabData.id;
    closeIT(someID);
  });
  }
  else if(coupIndex == 30){ //Healthkart
    chrome.tabs.create({
     url : "https://tracking.buyhatke.com/Navigation/?pos=921&source=extension&ext1=auto-coupon&ext2=" + localStorage.ext_id + "&link=" + encodeURIComponent("https://www.healthkart.com")
   }, function(tabData){
    var someID = tabData.id;
    closeIT(someID);
  });
  }
  else if(coupIndex == 32){ // Justeat
   //  chrome.tabs.create({
   //   url : "http://tracking.buyhatke.com/Navigation/?pos=921&source=extension&ext1=auto-coupon&ext2=" + localStorage.ext_id + "&link=" + encodeURIComponent("https://www.healthkart.com")
   // });
 }
  else if(coupIndex == 40){ // Prettysecrets
    chrome.tabs.create({
     url : "https://tracking.buyhatke.com/Navigation/?pos=433&source=extension&ext1=auto-coupon&ext2=" + localStorage.ext_id + "&link=" + encodeURIComponent("http://prettysecrets.com/")
   }, function(tabData){
    var someID = tabData.id;
    closeIT(someID);
  });
  }
  chrome.tabs.update(parseInt(tabID), {selected: true});
  getAddCouponsData(coupIndex);
}

function getAddCouponsData(coupons){
  var httpq4 = new getXMLHTTPRequest();
  var myurl = "https://buyhatke.com/coupons/PickCoupon/FreshCoupon/getAutoCoupons.php";
  var parameters = "ext_id=" + localStorage.ext_id + "&auth_val=" + localStorage.ext_auth + "&flag=1&pos=" + coupons;
  httpq4.open("POST", myurl, true);
  httpq4.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  httpq4.onreadystatechange = function(){
    if (httpq4.readyState == 4) {
      if(httpq4.status == 200) {
        var mytext = httpq4.responseText;
      }
    }
  };
  httpq4.send(parameters);
}

function reportSuccess(timeVal){
  var httpq4 = new getXMLHTTPRequest();
  var myurl = "https://buyhatke.com/compare/extension/reportSuccess.php";
  var parameters = "ext_id=" + localStorage.ext_id + "&auth_val=" + localStorage.ext_auth + "&respTime=" + timeVal;
  httpq4.open("POST", myurl, true);
  httpq4.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  httpq4.onreadystatechange = function(){
    if (httpq4.readyState == 4) {
      if(httpq4.status == 200) {
        var mytext = httpq4.responseText;
      }
    }
  };
  httpq4.send(parameters);
}

function getInstructions(){
  if(localStorage.subscribedFor!=""){
    var pollInterval = 1000 * 900;
  }
  else {
    var pollInterval = 1000 * 7200;
  }
  window.setTimeout(getInstructions, pollInterval);
  //if(localStorage.saleStarted==1){
    var httpq4 = new getXMLHTTPRequest();
    var myurl = "http://node4.buyhatke.com/extension/getInstructions.php";
    var parameters = "ext_id=" + localStorage.ext_id + "&auth_val=" + localStorage.ext_auth;
    httpq4.open("POST", myurl, true);
    httpq4.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    httpq4.onreadystatechange = function(){
      if (httpq4.readyState == 4) {
        if(httpq4.status == 200) {
          localStorage.instructions = httpq4.responseText;
        }
      }
    };
    httpq4.send(parameters);
  //}
}

function getRefresh(){
  localStorage.refreshedYetServer = 0;
  var pollInterval = 1000 * 900;
  window.setTimeout(getRefresh, pollInterval);
//   //if(localStorage.saleStarted==1){
//   var httpq4 = new getXMLHTTPRequest();
//   var myurl = "http://buyhatke.com/compare/extension/getRefresh.php";
//   var parameters = "ext_id=" + localStorage.ext_id + "&auth_val=" + localStorage.ext_auth;
//   httpq4.open("POST", myurl, true);
//   httpq4.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//   httpq4.onreadystatechange = function(){
//   if (httpq4.readyState == 4) {
//   if(httpq4.status == 200) {
//     localStorage.refreshedYetServer = httpq4.responseText;
//   }
//  }
// };
//   httpq4.send(parameters);
//   //}
}

function getSaleDate(){
  var pollInterval = 1000 * 7200;
  window.setTimeout(getSaleDate, pollInterval);
  if(localStorage.saleMonitor == 0){
    var httpq4 = new getXMLHTTPRequest();
    var myurl = "https://buyhatke.com/compare/extension/getSaleDate.php";
    var parameters = "ext_id=" + localStorage.ext_id + "&auth_val=" + localStorage.ext_auth;
    httpq4.open("POST", myurl, true);
    httpq4.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    httpq4.onreadystatechange = function(){
      if (httpq4.readyState == 4) {
        if(httpq4.status == 200) {
          localStorage.saleDate = httpq4.responseText;
        }
      }
    };
    httpq4.send(parameters);
  }
  else {
    console.log("Postponed getSaleDate due to Redmi Sale");
  }
  console.log("Successfully terminated");
}

function caliberateTime(){
  var pollInterval = 1000 * 300;
  if(localStorage.saleStarted==1){
   //var pollInterval = 1000 * 30;
 }
 window.setTimeout(caliberateTime, pollInterval);
 var httpq4 = new getXMLHTTPRequest();
 var myurl = "http://time.jsontest.com/";
 var parameters = "ext_id=" + localStorage.ext_id + "&auth_val=" + localStorage.ext_auth;
 httpq4.open("POST", myurl, true);
 httpq4.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
 httpq4.onreadystatechange = function(){
  if (httpq4.readyState == 4) {
    if(httpq4.status == 200) {
      var mytext = httpq4.responseText;
      mytext = JSON.parse(mytext);
      mytext = mytext.milliseconds_since_epoch;
//console.log(mytext);
if(parseInt(mytext)!=0){
  var serverTime = mytext;
  var clientTime = +new Date();
    //console.log("server time " + serverTime + " clientTime " + clientTime);
    var tempDiff = serverTime - clientTime;
    localStorage.diffTime = tempDiff;
  }
}
}
};
httpq4.send(parameters);
}

function checkStatus2(){
  var httpq4 = new getXMLHTTPRequest();
  var myurl = "https://compare.buyhatke.com/extension/checkStatus.php";
  var parameters = "ext_id=" + localStorage.ext_id + "&auth_val=" + localStorage.ext_auth;
  httpq4.open("POST", myurl, true);
  httpq4.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  httpq4.onreadystatechange = function(){
    if (httpq4.readyState == 4) {
      if(httpq4.status == 200) {
        var mytext = httpq4.responseText;
//console.log(mytext);
if(mytext!="" && mytext.trim() != "Authentication Failed!" && (JSON.parse(mytext).length)!=0){
  watchListArray = JSON.parse(mytext);
}
//console.log(watchListArray[0]);
}
}
};
httpq4.send(parameters);
}

function sendPIDFlip(pids, pos){
  var httpq4 = new getXMLHTTPRequest();
  var myurl = "https://compare.buyhatke.com/extension/flipPIDs.php";
  var parameters = "pids=" + encodeURIComponent(pids) + "&pos=" + pos;
  httpq4.open("POST", myurl, true);
  httpq4.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  httpq4.onreadystatechange = function(){
    if (httpq4.readyState == 4) {
      if(httpq4.status == 200) {
        var mytext = httpq4.responseText;
        // console.log(mytext);
      }
    }
  };
  httpq4.send(parameters);
}

function sendPairs(pids, pos){
  var httpq4 = new getXMLHTTPRequest();
  var myurl = "https://ext1.buyhatke.com/utility/sendPairsHandler.php";
  var parameters = "pids=" + encodeURIComponent(pids) + "&pos=" + pos + "&ext_id=" + localStorage.ext_id + "&ext_auth=" + localStorage.ext_auth;
  httpq4.open("POST", myurl, true);
  httpq4.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  httpq4.onreadystatechange = function(){
    if (httpq4.readyState == 4) {
      if(httpq4.status == 200) {
        var mytext = httpq4.responseText;
      }
    }
  };
  httpq4.send(parameters);
}

function sendCurrent(pids, pos){
  var httpq4 = new getXMLHTTPRequest();
  var myurl = "https://ext1.buyhatke.com/utility/currentPairsHandler.php";
  //var myurl = "https://ext1.buyhatke.com/flipkart/flip_currentPairs.php";
  var parameters = "pids=" + encodeURIComponent(pids) + "&pos=" + pos + "&ext_id=" + localStorage.ext_id + "&ext_auth=" + localStorage.ext_auth;
  httpq4.open("POST", myurl, true);
  httpq4.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  httpq4.onreadystatechange = function(){
    if (httpq4.readyState == 4) {
      if(httpq4.status == 200) {
        var mytext = httpq4.responseText;
//console.log(mytext);
}
}
};
httpq4.send(parameters);
}

function submitDataEBAY(jsonData, fileToSend){
  return new Promise(function(resolve, reject){
    var httpq4 = new getXMLHTTPRequest();
    var myurl = "https://buyhatke.com/ebYOf/" + fileToSend;
    var parameters = "ext_id=" + localStorage.ext_id + "&auth_val=" + localStorage.ext_auth;
    jsonParData = jsonData;
    var L = jsonParData.length;
    for (var i = 0; i < L; i++) {
      var obj = jsonParData[i];
      for (var j in obj) {
        var paramKey = (j);
        var paramVal = (jsonParData[i][j]);
        parameters += "&" + paramKey + "=" + paramVal;
      }
    }
    httpq4.open("POST", myurl, true);
    httpq4.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    httpq4.onreadystatechange = function(){
      if(this.readyState == 4 && this.status == 200) {
        var mytext = this.responseText;
        resolve(mytext);
      }
      else if(this.readyState == 4){
        resolve("Please check your internet Connection and try again!");
      }
    };
    httpq4.send(parameters);
  });
}

function price_filter(pr){
  if(pr.split("Rs.").length > 1){
    pr = pr.split("Rs.")[1];
  }
  if(pr.split("Rs").length > 1){
    pr = pr.split("Rs")[1];
  }
  if(pr.split("INR").length > 1){
    pr = pr.split("INR")[1];
  }
  if(pr.split("Inr").length > 1){
    pr = pr.split("Inr")[1];
  }
  if(pr.split("RS.").length > 1){
    pr = pr.split("RS.")[1];
  }
  if(pr.split("RS").length > 1){
    pr = pr.split("RS")[1];
  }
  if(pr.split("R").length > 1){
    pr = pr.split("R")[1];
  }
  if(pr.split("`").length > 1){
    pr = pr.split("`")[1];
  }
  if(pr.split("MRP").length > 1){
    pr = pr.split("MRP")[1];
  }
  if(pr.split("mrp").length > 1){
    pr = pr.split("mrp")[1];
  }
  if(pr.split("/").length > 1){
    pr = pr.split("/")[0];
  }
  if(pr.split("₹").length > 1){
    pr = pr.split("₹")[1].trim();
  }
  if(pr.split("र").length > 1){
    pr = pr.split("र")[1].trim();
  }
  pr = pr.split(",").join("").trim();
  pr = parseFloat(pr);
  return pr;

}

var wishListFlip = [];
function flipWishListURL(wish_url){
  return new Promise(function(resolve, reject){
    if(wish_url.split("?").length > 1){
      wish_url = wish_url.split("?");
      wish_url = wish_url[0].trim();
    }
    if(wish_url.split("&").length > 1){
      wish_url = wish_url.split("&");
      wish_url = wish_url[0].trim();
    }
    if(wish_url.split("#").length > 1){
      wish_url = wish_url.split("#");
      wish_url = wish_url[0].trim();
    }
    wish_url = wish_url + "?page=1&sort=dd";
    wishListFlip = [];
    crawlWishFlip(wish_url).then(function(args){
      resolve(args);
    });
  });
}

function crawlWishFlip(wish_url){
  return new Promise(function(resolve, reject){
    totAlert = 0;
    var slider = "";
    var sliderLength = 0;
    var link = "";
    var prod = "";
    var image = "";
    var price = "";
    var PID = "";
    var pos = 2;
    $.ajax(wish_url, {}).success(function(data){
      wrapper = document.createElement('div');
      wrapper.innerHTML= data;
      if($(wrapper).text().trim().toUpperCase().split("WISHLIST IS NOT PUBLIC").length > 1 ){
        resolve("Your Wishlist seems to be Private. Kindly make it Public and access again! Thanks!");
      }
      else if($(wrapper).text().trim().toUpperCase().split("UNAVAILABLE SINCE PROFILE DOES NOT EXIST").length > 1){
        resolve("Something Went Wrong!");
      }
      else if($(wrapper).find('#wishlist .fk-wishl-itm').length > 0) {
        totAlert = 1;
        slider = $(wrapper).find('#wishlist .fk-wishl-itm');
        sliderLength = $(wrapper).find('#wishlist .fk-wishl-itm').length;

        for(i=0;i<sliderLength;i++){
          link= "";
          url_wish = "";
          price= "";
          image = "";
          PID= "";
          pos = 2;
          if($(wrapper).find('#wishlist .fk-wishl-itm:eq('+ i +')').find('a').length > 0){
            link = $(wrapper).find('#wishlist .fk-wishl-itm:eq('+ i +')').find('a').attr('href');
            url_wish = link;
            if(url_wish.split("www.flipkart.com").length < 2){
              url_wish = "http://www.flipkart.com"+url_wish;
            }
            if(link.split('?pid=').length > 1){
              link = link.split("?pid=")[1];
              PID = link.split("&")[0];
            }
            else if(link.split('&pid=').length > 1){
              link = link.split("&pid=")[1];
              PID = link.split("&")[0];
            }
            else{
              link = "";
              PID = "";
            }
          }
          else{
            link = "";
            PID = "";
          }
          if(PID != ""){
            if(PID != PID.toUpperCase()){
              PID = "";
            }
          }
          if(PID != ""){
            if($(wrapper).find('#wishlist .fk-wishl-itm:eq('+ i +')').find('.pu-final').length > 0){
              price = $(wrapper).find('#wishlist .fk-wishl-itm:eq('+ i +')').find('.pu-final:eq(0)').text().trim();
              price = price_filter(price);
            }
          }
          else{
            price = "";
          }
          if(isNaN(price)){
            price = "";
          }

          if($(wrapper).find('#wishlist .fk-wishl-itm:eq('+ i +')').find('.lu-title-wrapper a').length > 0){
            prod = $(wrapper).find('#wishlist .fk-wishl-itm:eq('+ i +')').find('.lu-title-wrapper:eq(0) a:eq(0)').text().trim();
          }

          if($(wrapper).find('#wishlist .fk-wishl-itm:eq('+ i +')').find('.lu-image-link  img').length > 0){
            image = $(wrapper).find('#wishlist .fk-wishl-itm:eq('+ i +')').find('.lu-image-link img:eq(0)').attr('src').trim();
            if(image.split("data:image").length > 1){
              image = $(wrapper).find('#wishlist .fk-wishl-itm:eq('+ i +')').find('.lu-image-link img:eq(0)').attr('data-src').trim();
            }
          }

          if(PID != "" && price != ""){
            wishListFlip.push([(PID), (prod), price, (image), pos, (url_wish)]);
          }
        }
        if($(wrapper).find(".wishlist-pagination").length > 0 && $(wrapper).find(".wishlist-pagination").text().toUpperCase().split("NEXT").length > 1 && wishListFlip.length > 0){
          var pg_no = $(wrapper).find(".wishlist-pagination .current:eq(0)").text().trim();
          pg_no = parseInt(pg_no) + 1;
          wish_url = wish_url.split("?");
          wish_url = wish_url[0].trim();
          wish_url = wish_url + "?page=" + pg_no + "&sort=dd";
          crawlWishFlip(wish_url).then(function(args){
            resolve(args);
          });
        }
        else{
         if(wishListFlip.length > 0){
          var wishJson = JSON.stringify(wishListFlip);
          var jsonArr = [{'wishList': wishJson}];
          jsonArr = JSON.stringify(jsonArr);
          $.post("https://compare.buyhatke.com/wishlist3/api/scrapWishList.php?ext_id="+localStorage.ext_id+"&auth_val="+localStorage.ext_auth, {wishList: wishJson}).success(function(data){
            resolve(data);
          }).fail(function(data){
            resolve("Something went wrong!");
          });
        }
        else{
          resolve("Something went wrong!");
        }

      }

    }
    else {
      totAlert = 0;
    }
  })
.fail(function(){
  resolve("Something went Wrong!");
});
});
return;
}

function snapWishList(wish_url){
  return new Promise(function (resolve, reject){
    var wishListSnap = [];
    var slider = $('.product_list_view_cont');
    var sliderLength = slider.length;
    var link = "";
    var url = "";
    var prod = "";
    var image = "";
    var price = "";
    var PID = "";
    var pos = 129;
    if(wish_url.split("?u=").length > 1){
      var snap_user = wish_url.split("?u=");
      snap_user = snap_user[1].trim();
      if(snap_user.split("&").length > 1){
        snap_user = snap_user.split("&");
        snap_user = snap_user[0].trim();
      }
      if(snap_user.split("#").length > 1){
        snap_user = snap_user.split("#");
        snap_user = snap_user[0].trim();
      }
    }
    else if(wish_url.split("&u=").length > 1){
      var snap_user = wish_url.split("&u=");
      snap_user = snap_user[1].trim();
      if(snap_user.split("&").length > 1){
        snap_user = snap_user.split("&");
        snap_user = snap_user[0].trim();
      }
      if(snap_user.split("#").length > 1){
        snap_user = snap_user.split("#");
        snap_user = snap_user[0].trim();
      }
    }
    var user_url_len = snap_user.length -1;
    if(snap_user.substr(user_url_len, 1) == "/"){
      snap_user = snap_user.substring(0, user_url_len);
    }
  // console.log("user id: "+snap_user);
  var url_first = "https://www.snapdeal.com/wishlistNew/getProducts/0/1?sort=dhtl&wishlistUrl="+snap_user+"&lang=en";
  $.ajax(url_first, {}).success(function(resp){
    if(resp == "" || resp == null || resp == "null"){
      resolve("Your Wishlist seems to be Private. Kindly make it Public and access again! Thanks!");
    }
    else{
      resp = JSON.parse(resp);

      var pages = resp.totalLength;
      var snapapi = "https://www.snapdeal.com/wishlistNew/getProducts/0/"+pages+"?sort=dhtl&wishlistUrl="+snap_user+"&lang=en";
      $.get(snapapi, {}).success(function(data){
        // console.log("data: "+data);
        data = JSON.parse(data);
        for(var d=0;d<data.wishlistProductDisplayDTOs.length;d++){
          image = "";
          price = "";
          prod = "";
          link = "";
          url = "";
          PID = "";

          image = data.wishlistProductDisplayDTOs[d].MinProductOfferGroupDTO.image;
          image = "https://n2.sdlcdn.com/" + image;
          price = data.wishlistProductDisplayDTOs[d].MinProductOfferGroupDTO.displayPrice;
          prod = data.wishlistProductDisplayDTOs[d].MinProductOfferGroupDTO.name;
          link = data.wishlistProductDisplayDTOs[d].MinProductOfferGroupDTO.pageUrl;
          if(link.split("snapdeal.com/").length < 2){
            link = "https://www.snapdeal.com/" + link;
          }
          url = link;

          if(link.split("#").length > 1)  {
            link = link.split("#")[0];
          }
          if(link.split("?").length > 1)  {
            link = link.split("?")[0];
          }
          if(link.split("/").length > 1)  {
            link = link.split("/");
            PID = link[link.length -1];
          }

          if(PID != "" && price != ""){
            wishListSnap.push([encodeURIComponent(PID), encodeURIComponent(prod), price, encodeURIComponent(image), pos, encodeURIComponent(url)]);
          }
        }
        if(wishListSnap.length > 0){
          var wishJson = JSON.stringify(wishListSnap);
          var jsonArr = [{'wishList': wishJson}];
          jsonArr = JSON.stringify(jsonArr);
          $.post("https://compare.buyhatke.com/wishlist3/api/scrapWishList.php?ext_id="+localStorage.ext_id+"&auth_val="+localStorage.ext_auth, {wishList: wishJson}).success(function(data){
            resolve(data);
          }).fail(function(data){
            resolve("Something went wrong!");
          });
        }
        else{
          resolve("Something went wrong!");
        }

      })
      .fail(function(data){
        resolve("Something went wrong!");
      });
    }

  })
  .fail(function(){
    resolve("Something went wrong!");
  });
});

  return;
}

function amazWishList(wish_url){
  return new Promise(function(resolve, reject){

    wishListAmaz = [];
    cameAmaz = 0;
    var sid = "";
    var rid = "";
    $.ajax(wish_url)
    .success(function(dataAmz){
      // console.log("dataAmz: "+dataAmz);

      wrapperAmaz1 = document.createElement('div');
      wrapperAmaz1.innerHTML = dataAmz;

      sid = getCookie("session-id");
      rid = getCookie("csm-hit");
      if(rid && rid.split("+sa").length > 1){
        rid = rid.split("+sa");
        rid = rid[0].trim();
      }
      if($(wrapperAmaz1).find('.a-pagination').length > 0){
        var pg = $(wrapperAmaz1).find('.a-pagination:eq(0) li').length - 2;
      }
      else{
        var pg = 1;
      }
      var uid = "";
      if(wish_url.split("/wishlist/").length > 1){
        uid = wish_url.split("/wishlist/");
        uid = uid[1].trim();
        if(uid.split("?").length > 1){
          uid = uid.split("?");
          uid = uid[0].trim();
        }
        if(uid.split("#").length > 1){
          uid = uid.split("#");
          uid = uid[0].trim();
        }
        if(uid.split("&").length > 1){
          uid = uid.split("&");
          uid = uid[0].trim();
        }
        if(uid.split("/").length > 1){
          uid = uid.split("/");
          uid = uid[0].trim();
        }
      }
      else{
        uid = $(wrapperAmaz1).html();
        uid = uid.split("var ue_url");
        uid = uid[1];
        uid = uid.split(",");
        uid = uid[0];
        uid = uid.split("/wishlist/");
        uid = uid[1].trim();
        if(uid.split("?").length > 1){
          uid = uid.split("?");
          uid = uid[0].trim();
        }
        if(uid.split("#").length > 1){
          uid = uid.split("#");
          uid = uid[0].trim();
        }
        if(uid.split("&").length > 1){
          uid = uid.split("&");
          uid = uid[0].trim();
        }
        if(uid.split("/").length > 1){
          uid = uid.split("/");
          uid = uid[0].trim();
        }
      }
      if(rid == "" || rid == undefined){
        rid = dataAmz.split('"customerID":"');
        rid = rid[1].trim();
        rid = rid.split('"');
        rid = rid[0].trim();
      }
      if(sid == "" || sid == undefined){
        sid = dataAmz.split('"sid":"');
        sid = sid[1].trim();
        sid = sid.split('"');
        sid = sid[0].trim();
      }
      console.log("uid: "+uid);
      for(var p=1;p<=pg;p++){
        var amazURL = "http://www.amazon.in/gp/registry?ref_=cm_wl_ap_page_1&_encoding=UTF8&disableBtf=0&sid="+sid+"&ajax=renderItemsSection&subPageType=WishlistVisitorView&requestID="+rid+"&sort=date-added&reveal=unpurchased&page="+p+"&view=null&filter=all&id="+uid+"&type=wishlist";
        console.log("amazURL: "+amazURL);
        $.post(amazURL)
        .success(function(data){
          var slider = "";
          var sliderLength = "";
          var link = "";
          var url = "";
          var prod = "";
          var image = "";
          var price = "";
          var PID = "";
          var pos = 63;
          wrapperAmaz = document.createElement('div');
          wrapperAmaz.innerHTML= data.content;
          if($(wrapperAmaz).find('#item-page-wrapper .a-fixed-left-grid').length > 0) {
            slider = $(wrapperAmaz).find('#item-page-wrapper .a-fixed-left-grid');
            sliderLength = $(wrapperAmaz).find('#item-page-wrapper .a-fixed-left-grid').length;

            for(var i=0;i<sliderLength;i++){
              link = "";
              url = "";
              price = "";
              image = "";
              prod = "";
              PID = "";
              pos = 63;

              if($(wrapperAmaz).find('#item-page-wrapper .a-fixed-left-grid:eq('+ i +')').find('a').length > 0){
                link = $(wrapperAmaz).find('#item-page-wrapper .a-fixed-left-grid:eq('+ i +')').find('a:eq(0)').attr('href');
                if(link.split("amazon.in").length < 2){
                  link = "http://www.amazon.in" + link;
                }
                url = link;
                if(url.split("www.amazon.in").length < 2){
                  url = "https://www.amazon.in" + url;
                }
                var pid = link;
                if(pid.split("#").length > 1){
                  pid = pid.split("#")[0];
                }
                if(pid.split("&").length > 1){
                  pid = pid.split("&")[0];
                }
                if(pid.split("?").length > 1){
                  pid = pid.split("?")[0];
                }
                if(pid.split("/product/").length > 1){
                  pid = pid.split("/product/")[1];
                }
                else if(pid.split("/dp/").length > 1){
                  pid = pid.split("/dp/")[1];
                }

                if(pid.split("/ref").length > 1){
                  pid = pid.split("/ref")[0];
                }
                if(pid.split("/").length > 1){
                  pid1 = pid.split("/");
                  pid1 = pid1[pid1.length - 1];
                  if(pid1 == ""){
                    pid = pid.split("/");
                    pid = pid[pid.length - 2];
                  }
                  else {
                    pid = pid1;
                  }
                }
                PID = pid;
              }

              if(PID != ""){
                if($(wrapperAmaz).find('#item-page-wrapper .a-fixed-left-grid:eq('+ i +')').find('.a-color-price span').length > 0){
                  price = $(wrapperAmaz).find('#item-page-wrapper .a-fixed-left-grid:eq('+ i +')').find('.a-color-price:eq(0) span:eq(0)').text().trim();
                  price = price_filter(price);
                }
                else if($(wrapperAmaz).find('#item-page-wrapper .a-fixed-left-grid:eq('+ i +')').find('.price-section span').length > 0){
                  price = $(wrapperAmaz).find('#item-page-wrapper .a-fixed-left-grid:eq('+ i +')').find('.price-section:eq(0) span:eq(0)').text().trim();
                  price = price_filter(price);
                }
                if((price == undefined || isNaN(price) || price == "" || price == 0) && $(wrapperAmaz).find('#item-page-wrapper .a-fixed-left-grid:eq('+ i +')').find('.itemUsedAndNewPrice').length > 0){
                  price = $(wrapperAmaz).find('#item-page-wrapper .a-fixed-left-grid:eq('+ i +')').find('.itemUsedAndNewPrice:eq(0)').text().trim();
                  price = price_filter(price);
                }
              }
              else{
                price = "";
              }
              if(isNaN(price)){
                price = "";
              }

              if($(wrapperAmaz).find('#item-page-wrapper .a-fixed-left-grid:eq('+ i +')').find('.g-itemImage a').length > 0){
                prod = $(wrapperAmaz).find('#item-page-wrapper .a-fixed-left-grid:eq('+ i +')').find('.g-itemImage:eq(0) a:eq(0)').attr('title').trim();
              }

              if($(wrapperAmaz).find('#item-page-wrapper .a-fixed-left-grid:eq('+ i +')').find('.g-itemImage  img').length > 0){
                image = $(wrapperAmaz).find('#item-page-wrapper .a-fixed-left-grid:eq('+ i +')').find('.g-itemImage img:eq(0)').attr('src').trim();
              }
              // console.log("PID: "+PID);
              // console.log("price: "+price);
              // console.log("prod: "+prod);
              // console.log("image: "+image);

              if(PID != "" && price != ""){
                wishListAmaz.push([encodeURIComponent(PID), encodeURIComponent(prod), price, encodeURIComponent(image), pos, encodeURIComponent(url)]);
              }
        } //for over
      }
      cameAmaz++;
      if(wishListAmaz.length > 0 && cameAmaz == pg){
        var wishJson = JSON.stringify(wishListAmaz);
        var jsonArr = [{'wishList': wishJson}];
        jsonArr = JSON.stringify(jsonArr);
        $.post("https://compare.buyhatke.com/wishlist3/api/scrapWishList.php?ext_id="+localStorage.ext_id+"&auth_val="+localStorage.ext_auth, {wishList: wishJson}).success(function(data){
          resolve(data);
        }).fail(function(data){
          resolve("Something went wrong!");
        });
      }
      // else if(p < pg){
      //   p++;
      // }
      // else{
      //   resolve("Something Went Wrong!");
      // }
  }) //success over
.fail(function(data){
  resolve("SOMETHING WENT WRONG!");
}); //fail over
} //for over
}) //success1st over
.fail(function(data){
  resolve("Something Went Wrong!");
});
}); // promise ends
return;
}


visited = {};
globalPush = 0;

function logVisited(webName){
   // console.log("Vis " + webName);
   var timeStr = webName + "vis";
   var pushStr = webName + "push"
   if(!visited[timeStr]){
    visited[timeStr] = 0;
    visited[pushStr] = 0;
  }
  visited[timeStr] = Math.floor(Date.now() / 1000);
}

function congratulateUser(){
  notifyPAImage("https://s3-ap-southeast-1.amazonaws.com/push-images/autocoupons-winner-notify.png", "🎉You have done it 🎉", "Yippeee!! Congrats! you have successfully booked your new phone at Amazon Flash Sale via Buyhatke. Tap to rate us and share your review", "http://bit.ly/2sjz41k", "pushLucky30012319926");
  sendAnalyticsData("pushImageIconFlashSaleDyn-63");
}

function sendPush(key){
 // console.log("Sending push for " + key);
 return;

 var pos = Math.floor(key);
 var d = new Date();
 d = d.getDate();

 if((pos==63) && d >= 9 && d <= 31){
    // return;
  }
  else if((pos==129) && d >= 9 && d <= 31){
    // return;
  }
  else if((pos==2) && d >= 10 && d <= 31){
    // return;
  }
  else if((pos==111) && d >= 9 && d <= 31){
    // return;
  }
  else if((pos==50) && d >= 9 && d <= 31){
    // return;
  }
  else if((pos==1331) && d >= 9 && d <= 31){
    // return;
  }
  else if((pos==2190) && d >= 9 && d <= 31){
    // return;
  }
  else if(pos==421 && d >= 9 && d <= 31){
   // return;
 }
 else {
  return;
}

   // else {
   // console.log("Sending push for " + key);
   var data = pushArray;
   var url = "";
   var icon = "";
   for(k=0;k<data.length;k++){
    if(Math.floor(data[k].domain)==Math.floor(key)){
      url = data[k].url;
    }
  }
  switch(pos){
    case 2:
    var icon = "https://s3-ap-southeast-1.amazonaws.com/push-images/flipkart_freedom_logo_80x80_1.png";
    if(url==""){
     url = "https://www.flipkart.com/thebigfreedomsale2017-store";
   }
   break;
   case 63:
   var icon = "https://s3-ap-southeast-1.amazonaws.com/push-images/amazon_freedom_notify.png";
   if(url==""){
     url = "http://www.amazon.in/b/ref=br_isw_smr?_encoding=UTF8&node=5731634031&pf_rd_m=A1VBAL9TL5WCBF&pf_rd_s=&pf_rd_r=92BGRG459C2M31JYNQTG&pf_rd_t=36701&pf_rd_p=8f3fc067-fc50-4e1d-ab14-6f8613576ca0&pf_rd_i=desktop";
   }
   break;
   case 129:
   var icon = "https://s3-ap-southeast-1.amazonaws.com/push-images/snapdeal-SUDSGeneric-notify.png";
   if(url==""){
     url = "https://www.snapdeal.com/offers/diwali-offers";
   }
   break;
   case 50:
   var icon = "https://s3-ap-southeast-1.amazonaws.com/push-images/jabong80X80.jpg";
   if(url==""){
     url = "http://www.jabong.com/end-of-reason-sale-online/";
   }
   break;
   case 111:
   var icon = "https://s3-ap-southeast-1.amazonaws.com/push-images/myntra-eors1-notify.png";
   if(url==""){
     url = "http://www.myntra.com/flat-80-sale-eors?sort=new";
   }
   break;
   case 421:
   var icon = "https://s3-ap-southeast-1.amazonaws.com/push-images/shopclues_logo_80X80.png";
   if(url==""){
     url = "http://www.shopclues.com/appliances-5/breakfast-appliances-offers.html?utm_medium=notification";
   }
   break;
   case 2190:
   var icon = "https://s3-ap-southeast-1.amazonaws.com/push-images/rsz_11580131213342.jpg";
   if(url==""){
     url = "https://www.tatacliq.com/";
   }
   break;
   case 1331:
   var icon = "https://s3-ap-southeast-1.amazonaws.com/push-images/paytmmall.png";
   if(url==""){
     url = "https://www.paytmmall.com/";
   }
   break;
 }
 if(url!="" && icon!=""){
  url = "https://tracking.buyhatke.com/Navigation/?pos=" + pos + "&source=extension&link=" + encodeURIComponent(url) + "&ext1=pushO&ext2=" + localStorage.ext_id;
  notifyIcon(icon, "New amazing offers found", "On the categories you were interested more exciting products with good discounts have been added just now. Check them out. Offers available for a limited time", url, "pushIcon" + Math.floor(Date.now() / 1000), "Check Updated Offers");
  sendAnalyticsData("pushImageIconDyn-" + pos);
}
 // }
}


var hashBread = {};

function submitTabEntry(data){
  var raw_data = data.split("#~#");
  var pos = raw_data[2];
  var bread = raw_data[1];
  var tabID = raw_data[0];
  var obj = {};
  obj.bread = bread;
  obj.pos = pos;
  hashBread[tabID] = obj;
  // hashBread[tabID]['bread'] = bread;
  // hashBread[tabID]['pos'] = pos;
}

function checkTabEntry(data){
  var raw_data = data.split("#~#");
  var pos = raw_data[2];
  var bread = raw_data[1];
  var tabID = raw_data[0];
  var actObj = hashBread[tabID];
  var bread_act = actObj['bread'];
  var pos_act = actObj['pos'];
  // console.log("Pos1 " + pos_act + ", Pos2 " + pos + ", Bread1 " + bread_act + ", Bread2 " + bread);
  if(pos!=pos_act || bread!=bread_act){
   if(bread!="" && bread_act!="" && pos!=0 && pos_act!=0){
     sendMatchFound(bread, pos, bread_act, pos_act);
         // console.log("mapping pos " + pos + " bread " + bread + " act pos " + pos_act + " act bread " + bread_act);
       }
     }
   }

   function sendMatchFound(bread, pos, bread_act, pos_act) {
    var http3 = getXMLHTTPRequest();
    var myurl = "https://compare.buyhatke.com/extension/scm.php";
    var myurl1 = myurl;
    myRand = parseInt(Math.random()*999999999999999);
    var modurl = myurl1+"?rand="+myRand + "&bread=" + encodeURIComponent(bread) + "&pos=" + pos + "&bread_act=" + encodeURIComponent(bread_act) + "&pos_act=" + pos_act ;

    http3.open("GET", modurl, true);
    http3.onreadystatechange = function(){
      if (http3.readyState == 4) {
        if(http3.status == 200) {
          var mytext = http3.responseText;
          
        }
      }
    };
    http3.send(null);
  }

  function getStartTime(varCode){
    var salesdata = localStorage.existingSales;
    salesdata = JSON.parse(salesdata);
    for(var k=0;k<salesdata.length;k++){
     for(var a=0;a<salesdata[k].length;a++){
          // console.log(salesdata[k][a].code);
          if(salesdata[k][a].code==varCode){
             // console.log("Found time - " + JSON.stringify(salesdata[k][a]));
             return salesdata[k][a].time;
           }
         }
       }
       return 0;
     }

     function getSubsStatus(varCode){
       var a = localStorage.checkedArray;
       a = JSON.parse(a);
   // console.log("Test here " + varCode + " - " + a[varCode]);
   if(a[varCode] === true){
     return 1;
   }
   else {
     return 0;
   }
 }


 function monitorUser(){
   setTimeout(monitorUser, 10000);
   var d = new Date();
   d = d.getDate();
   if(Math.floor(Date.now() / 1000)-globalPush>1800 && d >= 8 && d <= 31){
    for (var key in visited) {
      var lastSeen = Math.floor(visited[key]);
      if(key.split("vis").length>1){
       key = key.split("vis")[0];
       newKey = key + "push";
       var lastPush = Math.floor(visited[newKey]);
       if(Math.floor(Date.now() / 1000) - lastPush > 1800 && Math.floor(Date.now() / 1000)-globalPush > 1800 && lastSeen - Math.floor(Date.now() / 1000) < 240 && lastSeen - Math.floor(Date.now() / 1000) > -100){
         globalPush = Math.floor(Date.now() / 1000);
         visited[newKey] = Math.floor(Date.now() / 1000);
         sendPush(key);
         break;
//>>>>>>> 3f53da06d4b2a5114849c8d4974c4022811c0747
}
}
}
}
else if(Math.floor(Date.now() / 1000)-globalPush>1800 && false){
  for (var key in visited) {
    var lastSeen = Math.floor(visited[key]);
    if(key.split("vis").length>1){
     key = key.split("vis")[0];
     newKey = key + "push";
     var lastPush = Math.floor(visited[newKey]);
     if(Math.floor(Date.now() / 1000) - lastPush > 9600 && Math.floor(Date.now() / 1000)-globalPush > 1800 && (lastSeen - Math.floor(Date.now() / 1000) < 120) && lastSeen > lastPush){
       globalPush = Math.floor(Date.now() / 1000);
       visited[newKey] = Math.floor(Date.now() / 1000);
               // sendPush(key);
               break;
             }
           }
         }
       }
     }
     monitorUser();

     chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
       if (typeof(request.data) != "undefined"){
         var httpq2 = getXMLHTTPRequest();
         var data = request.data.split("~*~*");
         //console.log(request.data);
         var prod = data[0];
         var price = data[1];
         var image = data[2];
         var url = data[3];
         var pos = data[4];
         var cat = data[5];
         var myurl = "https://compare.buyhatke.com/extension/addToWatchList.php";
         var parameters = "prod=" + encodeURIComponent(prod) + "&price=" + price + "&image=" + encodeURIComponent(image) + "&url=" + encodeURIComponent(url) + "&pos=" + pos + "&ext_id=" + localStorage.ext_id + "&auth_val=" + localStorage.ext_auth;
         httpq2.open("POST", myurl, true);
         httpq2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
         httpq2.onreadystatechange = function(){
          if (httpq2.readyState == 4) {
            if(httpq2.status == 200) {
              var mytext = httpq2.responseText;
              console.log("Called addToWatchList");
              sendMonitorReqBG(63,5,1,"set price alert success for site "+pos+" and url "+url,pos,0);
              checkStatus2();
            }
            else{
              sendMonitorReqBG(63,5,-1,"set price alert error for site "+pos+" and url "+url,pos,0);
            }
          }
        };
        httpq2.send(parameters);
        sendResponse({farewell: "goodbye"});
      }
      else if(typeof(request.search) != "undefined"){
        name = request.search;
        var pr = name.split("~*~*");
        var websitePos = parseInt(pr[2]);
        var data2="";
        if(name.split("moreData=").length > 1){
          data2 = name.split("moreData=")[1];
          name = name.split("moreData=")[0];
        }
        var pr = name.split("~*~*");
        var myPrice = parseFloat(pr[1]);
        name = pr[0];
        var name2 = name.split("-");
        name = name2.join(" ");
        var i = 0;
        while(inUSE[i]!=0){
          i++;
        }
        inUSE[i] = 1;
        var toUSE = i;
        handleQueries(name.trim(), myPrice, i, sender.tab.id, sender.tab.url, data2, websitePos);
      }
      else if(typeof(request.sendTabID) != "undefined"){
        sendResponse({farewell: sender.tab.id});
      }
      else if(typeof(request.submitTabID) != "undefined"){
        submitTabEntry(request.submitTabID);
        sendResponse({farewell: sender.tab.id});
      }
      else if(typeof(request.checkTabID) != "undefined"){
        checkTabEntry(request.checkTabID);
        sendResponse({farewell: sender.tab.id});
      }
      else if(typeof(request.checkSubscription) != "undefined"){
        sendResponse({farewell: getSubsStatus(request.checkSubscription)});
      }
      else if(typeof(request.sendStartTime) != "undefined"){
        sendResponse({farewell: getStartTime(request.sendStartTime)});
      }
      else if(typeof(request.tabAssignedHash) != "undefined"){
        sendResponse({farewell: localStorage.tabAssignedHash});
      }
      else if(typeof(request.sendTabIDF) != "undefined"){
        sendResponse({farewell: sender.tab.id});
      }
      else if(typeof(request.visitedEcomm) != "undefined"){
        // console.log("Requested " + request.visitedEcomm);
        logVisited(request.visitedEcomm);
        sendResponse({farewell: "OK"});

      }
      else if(request.monitorStart){
        let wedid_my = request.monitorStart;
        sendMonitorReqBG(44 , 4 , 1, "Autocoupons start pair event for website "+wedid_my ,wedid_my, 1)
      }
      else if(request.monitorEnd){
       let wed10 = request.monitorEnd;
       let myid = wed10.split("~")[0];
       let coupon = wed10.split("~")[1];
    // console.log("my dets", myid);
    // console.log("my dets", coupon);

    sendMonitorReqBG(44 , 4 , 1, "Autocoupons end pair event for website "+myid+" using coupon "+coupon ,myid, -1)


  }
  else if(request.monitorEndFail){
    let mywed = request.monitorEndFail;
    sendMonitorReqBG(44 , 4 , -1, "Autocoupons end pair event for website "+mywed ,mywed, -1)

  } 
  else if(typeof(request.showPush) != "undefined"){
        // console.log("Received " + request.showPush);
        if(!pushShown[request.showPush]){
         pushShown[request.showPush] = 1;
       }
       sendResponse({farewell: "OK"});
     }
     else if(typeof(request.getMIFlashSale) != "undefined"){
      sendResponse({farewell: localStorage.flashSale});
    }
    else if(typeof(request.sendSalesData) != "undefined"){
      localStorage.checkedArray = request.sendSalesData;
      sendResponse({farewell: "Done"});
    }
    else if(typeof(request.getbhList) != "undefined"){
      // console.log("Requested for the list");
      if(typeof(localStorage.hashBL)=="undefined" || localStorage.hashBL==""){
        sendResponse({farewell: ""});
      }
      else {
        sendResponse({farewell: localStorage.hashBL});
      }
    }
    else if(typeof(request.sendbhList) != "undefined"){
      // console.log("Requested for the list");
      if(typeof(localStorage.hashBL)=="undefined" || localStorage.hashBL==""){
        sendResponse({farewell: ""});
      }
      else {
        sendToServerList(localStorage.hashBL);
        sendResponse({farewell: ""});
      }
    }
    else if(typeof(request.clearbhList) != "undefined"){
      localStorage.hashBL = "";
      localStorage.flagBL = 0;
      sendResponse({farewell: ""});
    }
    else if(typeof(request.email) != "undefined"){
      if(typeof(localStorage.ext_email)=="undefined" || localStorage.ext_email==""){
        sendResponse({farewell: "No"});
      }
      else {
        sendResponse({farewell: localStorage.ext_email});
      }
    }
    else if(typeof(request.execJioSale) != "undefined"){
      execFlash(sender.tab.id);
      sendResponse({farewell: ''});
    }
    else if(typeof(request.extName) != "undefined"){
      sendResponse({farewell: chrome.runtime.id});
    }
    else if(typeof(request.getTypesCurrent) != "undefined"){
      sendResponse({farewell: localStorage.subsTypeSelected});
    }
    else if(typeof(request.setNotifType) != "undefined"){
      localStorage.subsTypeSelected = request.setNotifType;
      sendResponse({farewell: ""});
    }
    else if(typeof(request.subsType) != "undefined"){
      sendResponse({farewell: localStorage.subsTypeSelected});
    }
    else if (request.searchTesting){
      sendResponse({farewell: localStorage.searchTesting});
    }
    else if(typeof(request.matchExists) != "undefined"){
      sendResponse({farewell: matchSelected});
    }
    else if(typeof(request.extId) != "undefined"){
      sendResponse({farewell: localStorage.ext_id});
    }
    else if(typeof(request.fetchFeatures) != "undefined"){
     sendResponse({farewell: localStorage.features_json});
   }
   else if(typeof(request.ext_auth) != "undefined"){
    sendResponse({farewell: localStorage.ext_auth});
  }
  else if(typeof(request.regisDone) != "undefined"){
    localStorage.register = 1;
  }
  else if(typeof(request.getCoupons) != "undefined"){
    // console.log("called with getCOupons " + request.getCoupons);
    if(request.getCoupons == 2){
      chrome.tabs.create({
       url : "https://tracking.buyhatke.com/Navigation/?pos=111&source=extension&ext1=auto-coupon&ext2=" + localStorage.ext_id + "&link=" + encodeURIComponent("http://www.myntra.com/?utm_source=buyhutke&utm_medium=aff")
     });
    }
    else if(request.getCoupons == 1){
      // console.log("URL here " + "https://tracking.buyhatke.com/Navigation/?pos=50&source=extension&ext1=auto-coupon&ext2=" + localStorage.ext_id + "&link=" + encodeURIComponent("http://www.jabong.com/"));
      chrome.tabs.create({
       url : "https://tracking.buyhatke.com/Navigation/?pos=50&source=extension&ext1=auto-coupon&ext2=" + localStorage.ext_id + "&link=" + encodeURIComponent("http://www.jabong.com/")
     });
    }
    else if(request.getCoupons == 3){
      chrome.tabs.create({
       url : "https://tracking.buyhatke.com/Navigation/?pos=129&source=extension&ext1=auto-coupon&ext2=" + localStorage.ext_id + "&link=" + encodeURIComponent("http://www.snapdeal.com/?utm_source=aff_prog")
     });
    }
    else if(request.getCoupons == 4){
      chrome.tabs.create({
       url : "https://tracking.buyhatke.com/Navigation/?pos=1&source=extension&ext1=auto-coupon&ext2=" + localStorage.ext_id + "&link=" + encodeURIComponent("http://www.ebay.in/")
     });
    }
    else if(request.getCoupons == 7){
      chrome.tabs.create({
       url : "https://tracking.buyhatke.com/Navigation/?pos=421&source=extension&ext1=pushA&ext2=" + localStorage.ext_id + "&link=" + encodeURIComponent("http://www.shopclues.com/appliances-5/breakfast-appliances-offers.html?utm_medium=notification")
     });
    }
    else if(request.getCoupons == 10){
      chrome.tabs.create({
       url : "https://tracking.buyhatke.com/Navigation/?pos=99&source=extension&ext1=auto-coupon&ext2=" + localStorage.ext_id + "&link=" + encodeURIComponent("http://www.infibeam.com/")
     });
    }
    else if(request.getCoupons == 8){
      chrome.tabs.create({
       url : "http://track.in.omgpm.com/?AID=368059&PID=11256&CID=3954200&MID=387804&r=http://shopping.indiatimes.com/"
     });
    }
    else if(request.getCoupons == 9){
      chrome.tabs.create({
       url : "https://tracking.buyhatke.com/Navigation/?pos=4&source=extension&ext1=auto-coupon&ext2=" + localStorage.ext_id + encodeURIComponent("http://www.homeshop18.com/?it_category=AP&it_action=WB-HSLOGO&it_label=AP-HSLOGO-140609131400-PR-WB-OT-MR-HS18_HomeShop18Logo&it_value=0")
     });
    }
    else if(request.getCoupons == 13){ // Cleartrip
      chrome.tabs.create({
       url : "https://tracking.buyhatke.com/Navigation/?pos=1289&source=extension&ext1=auto-coupon&ext2=" + localStorage.ext_id + "&link=https%3A%2F%2Fwww.cleartrip.com"
     }, function(tabData){
        // var someID = tabData.id;
        // closeIT(someID);
      });
    }
    else if(request.getCoupons == 15){
      chrome.tabs.create({
       url : "http://track.in.omgpm.com/?AID=368059&PID=9629&CID=3944269&MID=348512"
     });
    }
    else if(request.getCoupons == 16){
      chrome.tabs.create({
       url : "https://tracking.buyhatke.com/Navigation/?pos=1352&source=extension&ext1=auto-coupon&ext2=" + localStorage.ext_id + "&link=http%3A%2F%2Fwww.dominos.co.in"
     });
    }
    else if(request.getCoupons == 17){
      chrome.tabs.create({
       url : "https://tracking.buyhatke.com/Navigation/?pos=1293&source=extension&ext1=auto-coupon&ext2=" + localStorage.ext_id + "&link=" + encodeURIComponent("http://www.yatra.com/")
     });
    }
    else if(request.getCoupons == 18){
      chrome.tabs.create({
       url :"https://tracking.buyhatke.com/Navigation/?tagType=" + localStorage.setTagType + "&pos=63&source=extension&ext1=auto-coupon&ext2=" + localStorage.ext_id + "&link=" + encodeURIComponent("http://www.amazon.in/")
     });
    }
    else if(request.getCoupons == 19){
      chrome.tabs.create({
       url : "https://tracking.buyhatke.com/Navigation/?pos=1000&source=extension&ext1=auto-coupon&ext2=" + localStorage.ext_id + "&link=" + encodeURIComponent("http://www.fabfurnish.com/")
     });
    }
    else if(request.getCoupons == 20){
      chrome.tabs.create({
       url : "https://tracking.buyhatke.com/Navigation/?pos=57&source=extension&ext1=auto-coupon&ext2=" + localStorage.ext_id + "&link=" + encodeURIComponent("http://www.lenskart.com/")
     });
    }
    else if(request.getCoupons == 22){
      chrome.tabs.create({
       url : "https://track.in.omgpm.com/?AID=368059&PID=8422&CID=3944299&MID=218153"
     });
    }
    else if(request.getCoupons == 24){
      chrome.tabs.create({
       url : "https://tracking.buyhatke.com/Navigation/?pos=333&source=extension&ext1=auto-coupon&ext2=" + localStorage.ext_id + "&link=" + encodeURIComponent("https://www.pepperfry.com/")
     });
    }
    else if(request.getCoupons == 26){
      chrome.tabs.create({
       url : "https://tracking.buyhatke.com/Navigation/?pos=429&source=extension&ext1=auto-coupon&ext2=" + localStorage.ext_id + "&link=" + encodeURIComponent("http://www.zivame.com/")
     });
    }
    else if(request.getCoupons == 28){
      chrome.tabs.create({
       url : "https://tracking.buyhatke.com/Navigation/?pos=426&source=extension&ext1=auto-coupon&ext2=" + localStorage.ext_id + "&link=" + encodeURIComponent("http://www.bluestone.com/")
     });
    }
    else if(request.getCoupons == 32){
      chrome.tabs.create({
       url : "http://track.in.omgpm.com/?AID=368059&PID=10859&CID=3944292&MID=478605"
     });
    }




    chrome.tabs.update(parseInt(sender.tab.id), {selected: true});
    getCoupons(request.getCoupons, sender.tab.id);
  }
  else if(typeof(request.getCouponsData) != "undefined"){

      //sendData2(request.getCouponsData, sender.tab.id);
    }
    else if(typeof(request.getDeals) != "undefined"){
      getDeals(request.getDeals, sender.tab.id);
    }
    else if(typeof(request.pids) != "undefined"){
        //sendPIDFlip(request.pids, 0);
      }
      else if(typeof(request.processDONE) != "undefined"){
        registerEND(request.processDONE);
      }
      else if(typeof(request.savings) != "undefined"){
        sendSavings(request.savings);
      }
      else if(typeof(request.pidsAmaz) != "undefined"){
        //sendPIDFlip(request.pidsAmaz, 1);
      }
      else if(typeof(request.pidsMyn) != "undefined"){
        //sendPIDFlip(request.pidsMyn, 2);
      }
      else if(typeof(request.pidsJab) != "undefined"){
        //sendPIDFlip(refquest.pidsJab, 3);
      }
      else if(typeof(request.pidsSnap) != "undefined"){
       // sendPIDFlip(request.pidsSnap, 4);
     }
     else if(typeof(request.pairsFlip) != "undefined"){
      sendPairs(request.pairsFlip, 0);
    }
    else if(typeof(request.dp) != "undefined"){
      sendAnalyticsData(request.dp);
    }
    else if(typeof(request.pairsPrettySecrets) != "undefined"){
      sendPairs(request.pairsPrettySecrets, 433);
    }
    else if(typeof(request.pairsLandmark) != "undefined"){
      sendPairs(request.pairsLandmark, 31);
    }
    else if(typeof(request.pairsPur) != "undefined"){
      sendPairs(request.pairsPur, 26);
    }
    else if(typeof(request.pairsKoovs) != "undefined"){
      sendPairs(request.pairsKoovs, 13);
    }
    else if(typeof(request.pairsEbay) != "undefined"){
      sendPairs(request.pairsEbay, -1);
    }
    else if(typeof(request.pairss19) != "undefined"){
      sendPairs(request.pairss19, 15);
    }
    else if(typeof(request.pairsZovi) != "undefined"){
      sendPairs(request.pairsZovi, 12);
    }
    else if(typeof(request.pairsFab) != "undefined"){
      sendPairs(request.pairsFab, 20);
    }
    else if(typeof(request.pairsPepp) != "undefined"){
      sendPairs(request.pairsPepp, 19);
    }
    else if(typeof(request.pairsCroma) != "undefined"){
      sendPairs(request.pairsCroma, 9);
    }
    else if(typeof(request.pairsABOF) != "undefined"){
      sendPairs(request.pairsABOF, 1850);
    }
    else if(typeof(request.pairsRediff) != "undefined"){
      sendPairs(request.pairsRediff, 32);
    }
    else if(typeof(request.pairsRediffB) != "undefined"){
      sendPairs(request.pairsRediffB, 35);
    }
    else if(typeof(request.pairsIndiatimes) != "undefined"){
      sendPairs(request.pairsIndiatimes, 14);
    }
    else if(typeof(request.pairsHk) != "undefined"){
      sendPairs(request.pairsHk, 17);
    }
    else if(typeof(request.pairsJewels) != "undefined"){
      sendPairs(request.pairsJewels, 21);
    }
    else if(typeof(request.pairsZivame) != "undefined"){
      sendPairs(request.pairsZivame, 18);
    }
    else if(typeof(request.pairsLens) != "undefined"){
      sendPairs(request.pairsLens, 23);
    }
    else if(typeof(request.pairsZoom) != "undefined"){
      sendPairs(request.pairsZoom, 27);
    }
    else if(typeof(request.pairsWatch) != "undefined"){
      sendPairs(request.pairsWatch, 22);
    }
    else if(typeof(request.pairsDone) != "undefined"){
      sendPairs(request.pairsDone, 28);
    }
    else if(typeof(request.pairsCilory) != "undefined"){
      sendPairs(request.pairsCilory, 16);
    }
    else if(typeof(request.pairsTrendin) != "undefined"){
      sendPairs(request.pairsTrendin, 24);
    }
    else if(typeof(request.pairsChumbak) != "undefined"){
      sendPairs(request.pairsChumbak, 30);
    }
    else if(typeof(request.pairsShop) != "undefined"){
      sendPairs(request.pairsShop, 29);
    }
    else if(typeof(request.pairsIndia) != "undefined"){
      sendPairs(request.pairsIndia, 33);
    }
    else if(typeof(request.pairsNaap) != "undefined"){
      sendPairs(request.pairsNaap, 36);
    }
    else if(typeof(request.pairsPaytm) != "undefined"){
      sendPairs(request.pairsPaytm, 38);
    }
    else if(typeof(request.pairsFree) != "undefined"){
      sendPairs(request.pairsFree, 25);
    }
    else if(typeof(request.pairsCross) != "undefined"){
      sendPairs(request.pairsCross, 34);
    }
    else if(typeof(request.pairsBaby) != "undefined"){
      sendPairs(request.pairsBaby, 51);
    }
    else if(typeof(request.pairsBas) != "undefined"){
      sendPairs(request.pairsBas, 44);
    }
    else if(typeof(request.curDataBas) != "undefined"){
      sendCurrent(request.curDataBas, 44);
    }
    else if(typeof(request.pairsNGal) != "undefined"){
      sendPairs(request.pairsNGal, 430);
    }
    else if(typeof(request.curDataNGal) != "undefined"){
      sendCurrent(request.curDataNGal, 430);
    }
    else if(typeof(request.curDataPrettySecrets) != "undefined"){
      sendCurrent(request.curDataPrettySecrets, 433);
    }
    else if(typeof(request.curDataFlip) != "undefined"){
      sendCurrent(request.curDataFlip, 0);
    }
    else if(typeof(request.curDataAMS) != "undefined"){
      sendCurrent(request.curDataAMS, 40);
    }
    else if(typeof(request.curDataBaby) != "undefined"){
      sendCurrent(request.curDataBaby, 51);
    }
    else if(typeof(request.curDataPaytm) != "undefined"){
      sendCurrent(request.curDataPaytm, 38);
    }
    else if(typeof(request.curDataFree) != "undefined"){
      sendCurrent(request.curDataFree, 25);
    }
    else if(typeof(request.curDataCross) != "undefined"){
      sendCurrent(request.curDataCross, 34);
    }
    else if(typeof(request.curDataIndia) != "undefined"){
      sendCurrent(request.curDataIndia, 33);
    }
    else if(typeof(request.curDataNaap) != "undefined"){
      sendCurrent(request.curDataNaap, 36);
    }
    else if(typeof(request.curDataLandmark) != "undefined"){
      sendCurrent(request.curDataLandmark, 31);
    }
    else if(typeof(request.curDataShop) != "undefined"){
      sendCurrent(request.curDataShop, 29);
    }
    else if(typeof(request.curDataChumbak) != "undefined"){
      sendCurrent(request.curDataChumbak, 30);
    }
    else if(typeof(request.curDataLens) != "undefined"){
      sendCurrent(request.curDataLens, 23);
    }
    else if(typeof(request.curDataPur) != "undefined"){
      sendCurrent(request.curDataPur, 26);
    }
    else if(typeof(request.curDataDone) != "undefined"){
      sendCurrent(request.curDataDone, 28);
    }
    else if(typeof(request.curDataZoom) != "undefined"){
      sendCurrent(request.curDataZoom, 27);
    }
    else if(typeof(request.curDataWatch) != "undefined"){
      sendCurrent(request.curDataWatch, 22);
    }
    else if(typeof(request.curDataTrendin) != "undefined"){
      sendCurrent(request.curDataTrendin, 24);
    }
    else if(typeof(request.curDataZovi) != "undefined"){
      sendCurrent(request.curDataZovi, 12);
    }
    else if(typeof(request.curDataAMB) != "undefined"){
      sendCurrent(request.curDataAMB, 1828);
    }
    else if(typeof(request.curDataNykaa) != "undefined"){
      sendCurrent(request.curDataNykaa, 1830);
    }
    else if(typeof(request.curDataZansaar) != "undefined"){
      sendCurrent(request.curDataZansaar, 1975);
    }
    else if(typeof(request.curDataEbay) != "undefined"){
      sendCurrent(request.curDataEbay, -1);
    }
    else if(typeof(request.curDataClovia) != "undefined"){
      sendCurrent(request.curDataClovia, 1973);
    }
    else if(typeof(request.curDataMebel) != "undefined"){
      sendCurrent(request.curDataMebel, 1972);
    }
    else if(typeof(request.curDataFNY) != "undefined"){
      sendCurrent(request.curDataFNY, 1819);
    }
    else if(typeof(request.curDataLime) != "undefined"){
      sendCurrent(request.curDataLime, 424);
    }
    else if(typeof(request.curDataUrbanLad) != "undefined"){
      sendCurrent(request.curDataUrbanLad, 1827);
    }
    else if(typeof(request.curDataJewels) != "undefined"){
      sendCurrent(request.curDataJewels, 21);
    }
    else if(typeof(request.curDataIndiatimes) != "undefined"){
      sendCurrent(request.curDataIndiatimes, 14);
    }
    else if(typeof(request.curDataRediff) != "undefined"){
      sendCurrent(request.curDataRediff, 32);
    }
    else if(typeof(request.curDataZivame) != "undefined"){
      sendCurrent(request.curDataZivame, 18);
    }
    else if(typeof(request.curDataRediffB) != "undefined"){
      sendCurrent(request.curDataRediffB, 35);
    }
    else if(typeof(request.curDataCilory) != "undefined"){
      sendCurrent(request.curDataCilory, 16);
    }
    else if(typeof(request.curDatas19) != "undefined"){
      sendCurrent(request.curDatas19, 15);
    }
    else if(typeof(request.curDataKoovs) != "undefined"){
      sendCurrent(request.curDataKoovs, 13);
    }
    else if(typeof(request.curDataHS18) != "undefined"){
      sendCurrent(request.curDataHS18, 6);
    }
    else if(typeof(request.curDataCroma) != "undefined"){
      sendCurrent(request.curDataCroma, 9);
    }
    else if(typeof(request.curDataABOF) != "undefined"){
      sendCurrent(request.curDataABOF, 1850);
    }
    else if(typeof(request.curDataInfi) != "undefined"){
      sendCurrent(request.curDataInfi, 7);
    }
    else if(typeof(request.curDataFab) != "undefined"){
      sendCurrent(request.curDataFab, 20);
    }
    else if(typeof(request.curDataPepp) != "undefined"){
      sendCurrent(request.curDataPepp, 19);
    }
    else if(typeof(request.curDataHk) != "undefined"){
      sendCurrent(request.curDataHk, 17);
    }
    else if(typeof(request.curDataSnap) != "undefined"){
      sendCurrent(request.curDataSnap, 1);
    }
    else if(typeof(request.curDataShopClues) != "undefined"){
      sendCurrent(request.curDataShopClues, 2);
    }
    else if(typeof(request.curDataAmaz) != "undefined"){
      sendCurrent(request.curDataAmaz, 3);
    }
    else if(typeof(request.curDataJab) != "undefined"){
      sendCurrent(request.curDataJab, 4);
    }
    else if(typeof(request.curDataTatacliq) != "undefined"){
      sendCurrent(request.curDataTatacliq, 2190);
    }
    else if(typeof(request.curDataAjio) != "undefined"){
      sendCurrent(request.curDataAjio, 2191);
    }
    else if(typeof(request.curDataVoo) != "undefined"){
      sendCurrent(request.curDataVoo, 2266);
    }
    else if(typeof(request.curDataMrVoo) != "undefined"){
      sendCurrent(request.curDataMrVoo, 2267);
    }
    else if(typeof(request.curDataNetmeds) != "undefined"){
      sendCurrent(request.curDataNetmeds, 2238);
    }
    else if(typeof(request.curData1mg) != "undefined"){
      sendCurrent(request.curData1mg, 2237);
    }
    else if(typeof(request.curDataBook) != "undefined"){
      sendCurrent(request.curDataBook, 311);
    }
    else if(typeof(request.curDataAcad) != "undefined"){
      sendCurrent(request.curDataAcad, 1585);
    }
    else if(typeof(request.curDataSapnaonline) != "undefined"){
      sendCurrent(request.curDataSapnaonline, 451);
    }
    else if(typeof(request.curDataNNNow) != "undefined"){
      sendCurrent(request.curDataNNNow, 2192);
    }
    else if(typeof(request.curDataMyn) != "undefined"){
      sendCurrent(request.curDataMyn, 5);
    }
    else if(typeof(request.curDataFn) != "undefined"){
      sendCurrent(request.curDataFn, 11);
    }
    else if(typeof(request.pairsAmaz) != "undefined"){
      sendPairs(request.pairsAmaz, 1);
    }
    else if(typeof(request.pairsMyn) != "undefined"){
      sendPairs(request.pairsMyn, 2);
    }
    else if(typeof(request.pairsAMS) != "undefined"){
      sendPairs(request.pairsAMS, 40);
    }
    else if(typeof(request.pairsJab) != "undefined"){
      sendPairs(request.pairsJab, 3);
    }
    else if(typeof(request.pairsTatacliq) != "undefined"){
      sendPairs(request.pairsTatacliq, 2190);
    }
    else if(typeof(request.pairsAjio) != "undefined"){
      sendPairs(request.pairsAjio, 2191);
    }
    else if(typeof(request.pairsVoo) != "undefined"){
      sendPairs(request.pairsVoo, 2266);
    }
    else if(typeof(request.pairsMrVoo) != "undefined"){
      sendPairs(request.pairsMrVoo, 2267);
    }
    else if(typeof(request.pairsNetmeds) != "undefined"){
      sendPairs(request.pairsNetmeds, 2238);
    }
    else if(typeof(request.pairs1mg) != "undefined"){
      sendPairs(request.pairs1mg, 2237);
    }
    else if(typeof(request.pairsBook) != "undefined"){
      sendPairs(request.pairsBook, 311);
    }
    else if(typeof(request.pairsAcad) != "undefined"){
      sendPairs(request.pairsAcad, 1585);
    }
    else if(typeof(request.pairsSapnaonline) != "undefined"){
      sendPairs(request.pairsSapnaonline, 451);
    }
    else if(typeof(request.pairsNNNow) != "undefined"){
      sendPairs(request.pairsNNNow, 2192);
    }
    else if(typeof(request.pairsSnap) != "undefined"){
      sendPairs(request.pairsSnap, 4);
    }
    else if(typeof(request.pairsFn) != "undefined"){
      sendPairs(request.pairsFn, 11);
    }
    else if(typeof(request.pairsShopClues) != "undefined"){
      sendPairs(request.pairsShopClues, 5);
    }
    else if(typeof(request.pairsHS18) != "undefined"){
      sendPairs(request.pairsHS18, 6);
    }
    else if(typeof(request.pairsInfi) != "undefined"){
      sendPairs(request.pairsInfi, 7);
    }
    else if(typeof(request.pairsNykaa) != "undefined"){
      sendPairs(request.pairsNykaa, 1830);
    }
    else if(typeof(request.pairsZansaar) != "undefined"){
      sendPairs(request.pairsZansaar, 1975);
    }
    else if(typeof(request.pairsClovia) != "undefined"){
      sendPairs(request.pairsClovia, 1973);
    }
    else if(typeof(request.addToBlockList) != "undefined"){
      // console.log("Reached here");
      addToBlockList(request.addToBlockList);
    }
    else if(typeof(request.removeFromBlockList) != "undefined"){
      // console.log("Reached here");
      removeFromBlockList(request.removeFromBlockList);
    }
    else if(typeof(request.getBlockList) != "undefined"){
      if(localStorage.blockList !== undefined && localStorage.blockList != ""  && localStorage.blockList != "null" && localStorage.blockList != "[]" && localStorage.blockList != "{}"){
        sendResponse({farewell: localStorage.blockList});
      }
      else {
        sendResponse({farewell : "[]"});
      }
    }
    else if(typeof(request.setTagType) != "undefined"){
      if(request.setTagType==1 || request.setTagType=="1"){
        localStorage.setTagType = 1;
      }
      else {
        localStorage.setTagType = "";
      }
      sendResponse({farewell : "[]"});
    }
    else if(typeof(request.getSessionKeyMMTInt) != "undefined"){
      sendResponse({farewell : SessionKeyMMTInt});
    }
    else if(typeof(request.pairsMebel) != "undefined"){
      sendPairs(request.pairsMebel, 1972);
    }
    else if(typeof(request.pairsFNY) != "undefined"){
      sendPairs(request.pairsFNY, 1819);
    }
    else if(typeof(request.pairsLime) != "undefined"){
      sendPairs(request.pairsLime, 424);
    }
    else if(typeof(request.pairsAMB) != "undefined"){
      sendPairs(request.pairsAMB, 1828);
    }
    else if(typeof(request.pairsUrbanLad) != "undefined"){
      sendPairs(request.pairsUrbanLad, 1827);
    }
    else if(typeof(request.removeURL) != "undefined"){
      urlToRemove = request.removeURL;
      //console.log("URL removed " + urlToRemove);
      removeWatch(urlToRemove);
    }
    else if(typeof(request.detailArray) != "undefined"){
      // console.log("Detail Array was asked for !");
      if(watchListArray != null && watchListArray != "null"){
        sendResponse({farewell: watchListArray});
        // console.log("REspo 1 sent");
      }
      else {
        sendResponse({farewell : []});
        // console.log("REspo 2 sent");
      }
    }
    else if(typeof(request.offersArray) != "undefined"){
      // console.log("Detail Array was asked for !");
      if(offersArray != null && offersArray != "null"){
//        TriggerPixel(1);
sendResponse({farewell: offersArray});
if(parseInt(104*Math.random())==1){
           // TriggerPixel(1);
         }
         
        // console.log("REspo 1 sent");
      }
      else {
        sendResponse({farewell : []});
        // console.log("REspo 2 sent");
      }
    }
    else if(typeof(request.userSetting) != "undefined"){
      sendResponse({farewell: localStorage.featuresArray});
    }
    else if(typeof(request.ixigoVar) != "undefined"){
      sendResponse({farewell: localStorage.lastTime});
    }
    else if(typeof(request.ixigoVarSet) != "undefined"){
      localStorage.lastTime = request.ixigoVarSet;
    }
    else if(typeof(request.sentClient_Id) != "undefined"){
      if(localStorage.tokenSent==0){
        localStorage.tokenSent = 1;
        var client_id = request.sentClient_Id;
        fetch('https://tracking.buyhatke.com/universalLog/?client_id=' + client_id + '&type=info&action=UPDATE_DATA&value=extension&dev_id=' + localStorage.ext_id + '&token=' + localStorage.pushToken).then(function(response) {
          return response.json();
        }).then(function(j) {
               //console.log(j);
             });
      }
    }
    else if(typeof(request.eccomVisit) != "undefined"){
      if(localStorage.visited=="" || localStorage.visited == undefined || isNaN(localStorage.visited)){
       localStorage.visited = 1;
     }
     else {
      localStorage.visited = parseInt(localStorage.visited) + 1;
    }
    if(localStorage.visited == 3){
        // sendAnalyticsData("pushNormalEbayShown");
        // notify("11% cashback on all Products", "Buyhatke Exclusive: Get 11% cashback on all products from Ebay to your bank account. Hurry ! Limited Period Offer", "https://compare.buyhatke.com/promotions/ebay-cashback-offer/?utm_source=extension_push_cl&utm_medium=ext_cl", "ebayPushSticky");
      }
    }
    else if(typeof(request.saleArray) != "undefined"){
      sendResponse({farewell: saleArray});
    }
    else if(typeof(request.saleVariables) != "undefined"){
      sendResponse({farewell: localStorage.saleStarted});
    }
    else if(typeof(request.saleDate) != "undefined"){
      sendResponse({farewell: localStorage.saleDate});
    }
    else if(typeof(request.sendNewPush) != "undefined"){
      congratulateUser();
      sendResponse({farewell: 'OK'});
    }
    else if(typeof(request.refreshedYet) != "undefined"){
      sendResponse({farewell: localStorage.refreshedYet + "~" + localStorage.refreshedYetServer});
    }
    else if(typeof(request.getCurrentOffset) != "undefined"){
      sendResponse({farewell: localStorage.diffTime});
    }
    else if(typeof(request.getInstructions) != "undefined"){
      sendResponse({farewell: localStorage.instructions});
    }
    else if(typeof(request.getFlashSalesData) != "undefined"){
      // console.log("here");
      sendResponse({farewell: localStorage.existingSales});
    }
    else if(typeof(request.getCheckedSales) != "undefined"){
      sendResponse({farewell: localStorage.checkedArray});
    }
    else if(typeof(request.subscribedFor) != "undefined"){
      var data = JSON.parse(localStorage.saleArray);
      if(data.length==0){
        sendResponse({farewell: "NONE"});
      }
      else {
        sendResponse({farewell: localStorage.subscribedFor});
      }
    }
    else if(typeof(request.setSaleVariables) != "undefined"){
      localStorage.saleStarted = 2;
      localStorage.saleFinished = 5;
      localStorage.mostSensitive = 0;

      // var data = JSON.parse(localStorage.saleArray);
      // var sale_id = data[localStorage.activeSale].sale_id;
      sendResponse({farewell: "Success"});
    }
    else if(typeof(request.setRefreshedYet) != "undefined"){
      localStorage.refreshedYet = 1;
      sendResponse({farewell: "Success"});
    }
    else if(typeof(request.ext_id) != "undefined"){
      sendResponse({farewell: localStorage.ext_id + "~" + localStorage.ext_auth});
    }
    else if(typeof(request.addEmail) != "undefined"){
      localStorage.ext_email = request.addEmail;
      var myurl = "https://compare.buyhatke.com/extension/addEmailExt.php";
      var parameters = "email=" + encodeURIComponent(request.addEmail) + "&ext_id=" + localStorage.ext_id + "&auth_val=" + localStorage.ext_auth;
      var httpq3 = new getXMLHTTPRequest();
      httpq3.open("POST", myurl, true);
      httpq3.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      httpq3.onreadystatechange = function(){
        if (httpq3.readyState == 4) {
          if(httpq3.status == 200) {
            var mytext = httpq3.responseText;
          }
        }
      };
      httpq3.send(parameters);
    }
    if (request.message == "user_details"){
      var userDetails = [];
      userDetails = [{ext_id: localStorage.ext_id, auth_val: localStorage.ext_auth, email: encodeURIComponent(localStorage.ext_email)}];
      userDetails = JSON.stringify(userDetails);
      sendResponse({farewell: userDetails});
    }
    else if (request.message == "check_email_verified"){
      if(localStorage.verifiedExt && localStorage.verifiedExt == "1"){
        // localStorage.mywishlist = "{}";
        callWishList(0);
      }
      sendResponse({farewell: localStorage.verifiedExt});
    }
    else if (request.message == "alertList"){
      sendResponse({identity: watchListArray});
    }
    else if (request.message == "getVersion"){
      sendResponse({farewell: localStorage.version});
    }
    else if (request.message == "featuresArray"){
      sendResponse({farewell: localStorage.featuresArray});
    }
    else if (request.message == "importWL"){
      sendResponse({farewell: localStorage.wishListJson});
    }
    else if (request.message == "getAddress"){
      sendResponse({farewell: localStorage.addressarray});
    }// searchTesting
    else if (request.updateImportWL){
      localStorage.wishListJson = request.updateImportWL;
      sendResponse({farewell: "OK"});
    }
    else if (request.updateAddressArray){
      localStorage.addressarray = request.updateAddressArray;
      sendResponse({farewell: "OK"});
    }
    else if (request.actionFeaturesArr){
      localStorage.featuresArray = request.actionFeaturesArr;
      sendResponse({farewell: "OK"});
    }
    else if (request.actionCreateWishList){
      localStorage.mywishlist = mywishlist;
      sendResponse({identity: "OK"});
    }
    else if (request.actionMyWishList){
      localStorage.mywishlist = request.actionMyWishList;
      sendResponse({farewell: "OK"});
    }
    else if (request.message == "getEbayDetails"){
      var ebayDetails =  localStorage.bankBox1 + "~*~" + localStorage.bankBox2 + "~*~" + localStorage.bankBox3 + "~*~" + localStorage.bankBox4 + "~*~" + localStorage.phoneNo + "~*~" + localStorage.emailEbay + "~*~" + localStorage.myName;
      sendResponse({farewell: ebayDetails});
    }
    else if (request.updateWL){
      localStorage.mywishlist = request.updateWL;
      sendResponse({farewell: "OK"});
    }
    else if(request.updatePushNot){
      localStorage.pushNotStore = request.updatePushNot;
      sendResponse({farewell: "OK"});
    }
    else if(request.updatePromo){
      localStorage.promoPushArray = request.updatePromo;
      sendResponse({farewell: "OK"});
    }
    else if(request.message == 'clearPushNot'){
      localStorage.pushNotStore = '';
      sendResponse({farewell: "OK"});
    }
    else if (request.message == "getPromoDetails"){
      sendResponse({farewell: localStorage.promoPushArray});
    }
    else if (request.message == "getPriceAlertsInit"){
      if(watchListArray != undefined && watchListArray.length > 0){
        sendResponse({farewell: JSON.stringify(watchListArray)});
      }
      else{
        checkStatus();
      }
    }
    else if (request.message == "getPushNot"){
      sendResponse({farewell: localStorage.pushNotStore});
    }
  });

http2 = getXMLHTTPRequest();

function setAnimatingIcon1(tabID){
  var iconPath = "1.png";
  chrome.browserAction.setIcon({tabId: tabID, path: iconPath});
  window.setTimeout(function() { setAnimatingIcon2(tabID); }, 100);
}

function setAnimatingIcon2(tabID){
  var iconPath = "2.png";
  chrome.browserAction.setIcon({tabId: tabID, path: iconPath});
  window.setTimeout(function() { setAnimatingIcon3(tabID); }, 100);
}

function setAnimatingIcon3(tabID){
  var iconPath = "3.png";
  chrome.browserAction.setIcon({tabId: tabID, path: iconPath});
  window.setTimeout(function() { setAnimatingIcon4(tabID); }, 100);
}

function setAnimatingIcon4(tabID){
  var iconPath = "4.png";
  chrome.browserAction.setIcon({tabId: tabID, path: iconPath});
  window.setTimeout(function() { setAnimatingIcon5(tabID); }, 100);
}

function setAnimatingIcon5(tabID){
  var iconPath = "5.png";
  chrome.browserAction.setIcon({tabId: tabID, path: iconPath});
  window.setTimeout(function() { setAnimatingIcon6(tabID); }, 100);
}

function setAnimatingIcon6(tabID){
  var iconPath = "6.png";
  chrome.browserAction.setIcon({tabId: tabID, path: iconPath});
  window.setTimeout(function() { setAnimatingIcon7(tabID); }, 100);
}

function setAnimatingIcon7(tabID){
  var iconPath = "7.png";
  chrome.browserAction.setIcon({tabId: tabID, path: iconPath});
  window.setTimeout(function() { setAnimatingIcon8(tabID); }, 100);
}

function setAnimatingIcon8(tabID){
  var iconPath = "8.png";
  chrome.browserAction.setIcon({tabId: tabID, path: iconPath});
  window.setTimeout(function() { setAnimatingIcon9(tabID); }, 100);
}

function setAnimatingIcon9(tabID){
  var iconPath = "9.png";
  chrome.browserAction.setIcon({tabId: tabID, path: iconPath});
  window.setTimeout(function() { setAnimatingIcon10(tabID); }, 100);
}

function setAnimatingIcon10(tabID){
  var iconPath = "10.png";
  chrome.browserAction.setIcon({tabId: tabID, path: iconPath});
  window.setTimeout(function() { setAnimatingIcon11(tabID); }, 100);
}

function setAnimatingIcon11(tabID){
  var iconPath = "11.png";
  chrome.browserAction.setIcon({tabId: tabID, path: iconPath});
  window.setTimeout(function() { setAnimatingIcon12(tabID); }, 100);
}

function setAnimatingIcon12(tabID){
  var iconPath = "12.png";
  chrome.browserAction.setIcon({tabId: tabID, path: iconPath});
}

function searchgooglemaps(info)
{
 var searchstring = info.selectionText;
 if(typeof(searchstring)=="undefined"){
  alert("Please select some text to search via Compare Hatke. Selected Text Length : 0 words");
}
// console.log(searchstring);
searchstring = searchstring.trim().split(" ");
if(searchstring.length>15){
  alert("Too long text to search. Maximum Limit : 15 words");
}
else if(searchstring.length==0){
  alert("Please select some text to search via Compare Hatke. Selected Text Length : 0 words");
}
else {
  searchstring = searchstring.join("-");
  chrome.tabs.create({url: "https://compare.buyhatke.com/products/" + searchstring});
}
}

chrome.contextMenus.create({title: "Compare via Compare Hatke", contexts:["all"], onclick: searchgooglemaps});



function deleteEntries(arr, id) {
  var i = arr.length;
    if (i) {   // (not 0)
      while (i--) {
        var cur = arr[i];
        if (cur.tabID == id) {
          arr.splice(i, 1);
        }
      }
    }
  }

  function takeValue(idName){
    chrome.tabs.sendRequest(idName, { method: "getHTML"}, function(response) {
      alert(response.data);
    });
  }

  function handleNewQueries(prod, price, start, tabId, urlMerchant, data2){

  }

  function handleQueries(prod, price, start, tabId, urlMerchant, data2, websitePos){
    var isbnValid;
    var isbn;
    var isapparel;
    var req = http[2*start];
    var req22 = http[2*start+1];
    var myID = tabId;
    // console.log("Merchant " + urlMerchant);
    if(data2.split("isbn=").length>1){
      isbn = data2.split("isbn=")[1];
      isbn = isbn.split("~*~*")[0];
      var parameters = "search=" + encodeURIComponent(prod) + "&isbn=" + encodeURIComponent(isbn);
      var url2 = "https://compare.buyhatke.com/example_ext.php";
      isbnValid = 1;
      isapparel = 0;
    }
    else if(data2.split("isapparel=").length>1){
      isbn = data2.split("isapparel=")[1];
      var parameters = "search=" + encodeURIComponent(prod);
      var url2 = "https://compare.buyhatke.com/apparelsSearch.php";
      isapparel = 1;
      isbnValid = 0;
    }
    else {
      isapparel = 0;
      var parameters = "search=" + encodeURIComponent(prod) + "&data=" + encodeURIComponent(data2);
      var url2 = "https://compare.buyhatke.com/exampleNewExt.php";
      isbnValid = 0;
      isbn = 0;
    }
    if(prod!=""){
      var website = urlMerchant.split("/")[2];
    }
    req.open("POST",url2,true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.onload = (function(){
      if (req.readyState == 4) {
        if(req.status == 200) {
          var msg = req.responseText;
          if(price==NaN||price=="NaN"){
            price = 0;
          }
          if(isbnValid==0&&isapparel==0){
            var url2 = "https://compare.buyhatke.com/updates10.php?searchText=" + encodeURIComponent(prod) + "&price=" + price + "&ext_id=" + localStorage.ext_id + "&auth_val=" + localStorage.ext_auth + "&pos=" + websitePos;
            if(localStorage.flagBL==1 && websitePos==63){
              url2 += "&mainFL=1&ext_id="+localStorage.ext_id;
            }
            else if(localStorage.actBL<10 && websitePos==63){
                  // localStorage.actBL = parseInt(localStorage.actBL) + 1;
                  url2 += "&mainFL=1";
                }
              }
              else if(isapparel==1){
                var url2 = "https://compare.buyhatke.com/updates_app.php?searchText=" + encodeURIComponent(prod) + "&price=" + price + "&ext_id=" + localStorage.ext_id + "&auth_val=" + localStorage.ext_auth;
              }
              else {
                var url2 = "https://compare.buyhatke.com/updates_ext.php?searchText=" + encodeURIComponent(prod) + "&isbn=" + isbn + "&ext_id=" + localStorage.ext_id + "&auth_val=" + localStorage.ext_auth;

                if(localStorage.flagBL==1 && websitePos==63){
                  url2 += "&mainFL=1";
                }
                else if(localStorage.actBL<10 && websitePos==63){
                  // localStorage.actBL = parseInt(localStorage.actBL) + 1;
                  url2 += "&mainFL=1";
                }
              }
              req22.open("GET",url2,true);

              req22.onload = (function(){
                if (req22.readyState == 4) {
                  if(req22.status == 200) {
                   var msg = req22.responseText;
                   if(isapparel==1){
                    chrome.tabs.sendMessage(myID, {results: msg});
                    if(watchListArray == null){
                      chrome.browserAction.setBadgeText({tabId: tabId, text: "0"});
                      chrome.browserAction.setBadgeBackgroundColor({tabId: tabId, color: "#FF0000"});
                    }
                    else {
                     chrome.browserAction.setBadgeText({tabId: tabId, text: watchListArray.length.toString()});
                     chrome.browserAction.setBadgeBackgroundColor({tabId: tabId, color: "#FF0000"});
                   }
                   setAnimatingIcon1(myID);
                   inUSE[start] = 0;
                 }
                 else {
                   var values = JSON.parse(msg);
                   var len;
                   if(values!=null){
                     len = values.length;
                     values = values.sort(function(a, b){
                      return a.price - b.price;
                    });
                   }
                   else {
                    len = 0;
                  }
                  for(i=0;i<len;i++){
                    resultsTable.push({
                      tabID : myID, link : values[i].link, prod : values[i].prod, image : values[i].image, price : values[i].price, site : values[i].position
                    });
                  }
                  chrome.tabs.sendMessage(myID, {results: msg});
                  if(watchListArray == null){
                    chrome.browserAction.setBadgeText({tabId: tabId, text: "0"});
                    chrome.browserAction.setBadgeBackgroundColor({tabId: tabId, color: "#FF0000"});
                  }
                  else {
                   chrome.browserAction.setBadgeText({tabId: tabId, text: watchListArray.length.toString()});
                   chrome.browserAction.setBadgeBackgroundColor({tabId: tabId, color: "#FF0000"});
                 }
                 setAnimatingIcon1(myID);
                 inUSE[start] = 0;
               }
             }
           }
         });
              req22.send(null);
            }
          }
        });
req.send(parameters);
}

function checkIcons(){
  chrome.runtime.onConnect.addListener(function(port) {
    if(port.name=="searchPayloadDataNew" + port.sender.tab.id){
      port.onMessage.addListener(function(msg) {
        if (msg.messageData != ""){
          // console.log("Data rec here " + msg.messageData);
          var queryObj = JSON.parse(msg.messageData);
          var req = getXMLHTTPRequest();
          var req22 = getXMLHTTPRequest();
          var parameters = "query=" + encodeURIComponent(queryObj.query) + "&price=" + queryObj.price + "&ext_id=" + localStorage.ext_id  + "&pos=" + queryObj.pos + "&ext_auth=" + localStorage.ext_auth + "&original=" + queryObj.original + "&PID=" + queryObj.PID;
          if(localStorage.flagBL==1 && queryObj.pos==63){
            parameters += "&mainFL=1";
          }
          else if(localStorage.actBL<10 && queryObj.pos==63){
                  // localStorage.actBL = parseInt(localStorage.actBL) + 1;
                  parameters += "&mainFL=1";
                }
                var caseHere = parseInt(queryObj.category);
                var url2 = "";
                var url3 = "";
                switch(caseHere){
                 case 0:
                 url2 = "https://compare.buyhatke.com/mobFrontEnd.php";
                 url3 = "https://compare.buyhatke.com/updates10.php";
                 break;
                 case 1:
                 url2 = "https://compare.buyhatke.com/exampleExtCat.php";
                 url3 = "https://compare.buyhatke.com/updatesNew.php";
                 break;
               }
              // console.log(url2);
              // console.log(url3);
              // var url2 = "https://compare.buyhatke.com/mobFrontEnd.php";

              req.open("POST",url2,true);
              req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
              req.onload = (function(){
                if (req.readyState == 4) {
                  if(req.status == 200) {
                    var msg = req.responseText;
                    msg = msg.trim();
                    if(msg!="" && caseHere==0){
                      msg = JSON.parse(msg);
                    }
                    if(caseHere!=0 || msg[0].error==1){
                      var url2 = url3 + "?searchText=" + encodeURIComponent(queryObj.original) + "&price=" + queryObj.price + "&ext_id=" + localStorage.ext_id + "&auth_val=" + localStorage.ext_auth + "&pos=" + queryObj.pos + "&PID=" + queryObj.PID;
                      if(localStorage.flagBL==1 && queryObj.pos==63){
                        url2 += "&mainFL=1";
                      }
                      else if(localStorage.actBL<10 && queryObj.pos==63){
                        // localStorage.actBL = parseInt(localStorage.actBL) + 1;
                        url2 += "&mainFL=1";
                      }
                      req22.open("GET",url2,true);
                      req22.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                      req22.onload = (function(){
                        if (req22.readyState == 4) {
                          if(req22.status == 200) {
                            var msg = req22.responseText;
                            port.postMessage({dataBack: msg});
                          }
                        }
                      });
                      req22.send(null);

                    }
                    else {
                      port.postMessage({dataBack: req.responseText});
                    }
                  }
                }
              });
              req.send(parameters);
            }
          });
    }
    else if(port.name=="searchPayloadDataTest" + port.sender.tab.id){
      port.onMessage.addListener(function(msg) {
        if (msg.messageData != ""){
          // console.log("Data rec here " + msg.messageData);
          queryFull = msg.messageData.split("~*~*");
          query = queryFull[0];
          price = queryFull[1];
              // var queryObj = JSON.parse(msg.messageData);
              var req = getXMLHTTPRequest();
              var req22 = getXMLHTTPRequest();
              var parameters = "query=" + encodeURIComponent(query) + "&price=" + price + "&ext_id=" + localStorage.ext_id  + "&ext_auth=" + localStorage.ext_auth;
              // if(localStorage.flagBL==1 && posValue==63){
              //   parameters += "&mainFL=1";
              // }

              url2 = "https://compare.buyhatke.com/searchTest.php";
              req.open("POST",url2,true);
              req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
              req.onload = (function(){
                if (req.readyState == 4) {
                  if(req.status == 200) {
                    var msg = req.responseText;
                    msg = msg.trim();
                    port.postMessage({dataBack: msg});
                    
                  }
                  else {
                    //sendMonitorReqBG(61,2,0,"product comparison  error for pid "+PID+" and website position "+websitePos,websitePos);
                    port.postMessage({dataBack: ""});
                    
                  }
                }
                
              });
              req.send(parameters);
            }
          });
    }
    else if(port.name=="searchPayloadData" + port.sender.tab.id){
      port.onMessage.addListener(function(msg) {
        if (msg.messageData != ""){
         var req = getXMLHTTPRequest();
         var req22 = getXMLHTTPRequest();
         // console.log("I was called for search" + msg.messageData);
         name = msg.messageData;
         var pr = name.split("~*~*");
         var websitePos = parseInt(pr[2]);
         var PID = pr[3];
         var data2="";
         var actDetailedQuery = pr[0];
         // console.log("Detail " + actDetailedQuery);
         if(name.split("moreData=").length > 1){
          data2 = name.split("moreData=")[1];
          name = name.split("moreData=")[0];
        }
        var pr = name.split("~*~*");
        var myPrice = parseFloat(pr[1]);
        name = pr[0];
        var name2 = name.split("-");
        name = name2.join(" ");
        var i = 0;
        var isbnValid;
        var isbn;
        var isapparel;
        var prod = name.trim();
        var price = myPrice;
        newSearchOn =0;
        myID = port.sender.tab.id;
        tabId = port.sender.tab.id;
        tabID = port.sender.tab.id;
        urlMerchant = port.sender.tab.url;
        // console.log("Merchant2 " + urlMerchant);
         //  if(websitePos==1){
         //   var parameters = "query=" + encodeURIComponent(prod) + "&price=" + price + "&PID=" + PID;
         //   var url2 = "https://compare.buyhatke.com/mobFrontEnd.php";
         // }
         if(data2.split("isbn=").length>1){
          isbn = data2.split("isbn=")[1];
          isbn = isbn.split("~*~*")[0];
          var parameters = "search=" + encodeURIComponent(prod) + "&isbn=" + encodeURIComponent(isbn) + "&PID=" + PID;
          var url2 = "https://compare.buyhatke.com/example_ext.php";
          isbnValid = 1;
          isapparel = 0;
        }
        else if(data2.split("isapparel=").length>1){
         isbn = data2.split("isapparel=")[1];
         var parameters = "search=" + encodeURIComponent(prod);
         var url2 = "https://compare.buyhatke.com/apparelsSearch.php";
         isapparel = 1;
         isbnValid = 0;
       }
       else {
        isapparel = 0;
        var parameters = "search=" + encodeURIComponent(prod) + "&data=" + encodeURIComponent(data2);
        var parameters = "query=" + encodeURIComponent(prod) + "&price=" + price + "&PID=" + PID + "&ext_id=" + localStorage.ext_id + "&pos=" + websitePos;
        if(localStorage.flagBL==1 && websitePos==63){
          parameters += "&mainFL=1&ext_id="+localStorage.ext_id;
        }
        else if(localStorage.actBL<10 && websitePos==63){
          // localStorage.actBL = parseInt(localStorage.actBL) + 1;
          parameters += "&mainFL=1";
        }
        var url2 = "https://compare.buyhatke.com/searchTest.php";
        isbnValid = 0;
        newSearchOn = 1;
        isbn = 0;
      }
      req.open("POST",url2,true);
      req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      req.onload = (function(){
        if (req.readyState == 4) {
          if(req.status == 200 ) {
            var msg = req.responseText;
            if(msg.trim() == "" || msg.trim().length < 100 || msg.trim == undefined ){
              //call monitoring here
              sendMonitorReqBG(61,2,0,"product comparison  error for pid "+PID+" and website position "+websitePos,websitePos,0);
            }
            if(websitePos!=1 && newSearchOn==0){
              var msg = req.responseText;
              if(price==NaN||price=="NaN"){
                price = 0;
              }
              if(isbnValid==0&&isapparel==0){
                var url2 = "https://compare.buyhatke.com/updates10.php?searchText=" + encodeURIComponent(prod) + "&price=" + price + "&ext_id=" + localStorage.ext_id + "&auth_val=" + localStorage.ext_auth + "&pos=" + websitePos + "&PID=" + PID;
                if(localStorage.flagBL==1 && websitePos==63){
                  url2 += "&mainFL=1";
                }
                else if(localStorage.actBL<10 && websitePos==63){
                  // localStorage.actBL = parseInt(localStorage.actBL) + 1;
                  url2 += "&mainFL=1";
                }
              }
              else if(isapparel==1){
                var url2 = "https://compare.buyhatke.com/updates_app.php?searchText=" + encodeURIComponent(prod) + "&price=" + price + "&ext_id=" + localStorage.ext_id + "&auth_val=" + localStorage.ext_auth + "&PID=" + PID;
              }
              else {
                var url2 = "https://compare.buyhatke.com/updates_ext.php?searchText=" + encodeURIComponent(prod) + "&isbn=" + isbn + "&ext_id=" + localStorage.ext_id + "&auth_val=" + localStorage.ext_auth + "&PID=" + PID;
                if(localStorage.flagBL==1 && websitePos==63){
                  url2 += "&mainFL=1";
                }
                else if(localStorage.actBL<10 && websitePos==63){
                  // localStorage.actBL = parseInt(localStorage.actBL) + 1;
                  url2 += "&mainFL=1";
                }
              }
              req22.open("GET",url2,true);

              req22.onload = (function(){
                if (req22.readyState == 4) {
                  if(req22.status == 200) {
                   var msg = req22.responseText;
                   if(isapparel==1){
                     if(watchListArray == null){
                      chrome.browserAction.setBadgeText({tabId: tabId, text: "0"});
                      chrome.browserAction.setBadgeBackgroundColor({tabId: tabId, color: "#FF0000"});
                    }
                    else {
                     chrome.browserAction.setBadgeText({tabId: tabId, text: watchListArray.length.toString()});
                     chrome.browserAction.setBadgeBackgroundColor({tabId: tabId, color: "#FF0000"});
                   }
                   setAnimatingIcon1(myID);
                   port.postMessage({dataBack: msg});
                 }
                 else {
                   var values = JSON.parse(msg);
                   var len;
                   if(values!=null){
                     len = values.length;
                     values = values.sort(function(a, b){
                      return a.price - b.price;
                    });
                   }
                   else {
                    len = 0;
                  }
                  if(watchListArray == null){
                    chrome.browserAction.setBadgeText({tabId: tabId, text: "0"});
                    chrome.browserAction.setBadgeBackgroundColor({tabId: tabId, color: "#FF0000"});
                  }
                  else {
                   chrome.browserAction.setBadgeText({tabId: tabId, text: watchListArray.length.toString()});
                   chrome.browserAction.setBadgeBackgroundColor({tabId: tabId, color: "#FF0000"});
                 }
                 setAnimatingIcon1(myID);
                 port.postMessage({dataBack: msg});
               }
             }
           }
         });
              req22.send(null);


            }
            else {
             port.postMessage({dataBack: msg});
           }
         }
         else{
           //we can add monitoring here for checking success of api call
         }
       }
     });
req.send(parameters);

}
});
return;
}
else if(port.name=="othersPayloadData" + port.sender.tab.id){
  port.onMessage.addListener(function(msg) {
    if (msg.messageData != ""){
      var comp = msg.messageData.split("~*");
      var jsonData = comp[0];
      var command = comp[1];
      command = parseInt(command);
      var jsonData = JSON.parse(jsonData);

      switch(command){
       case 1:
       var myurl = "https://compare.buyhatke.com/extension/getPredictedData.php";
       break;
       case 2:
       var myurl = "https://compare.buyhatke.com/dealsAPI/pidToList.php";
       break;
       case 3:
       var myurl = "https://buyhatke.com/dealsAPI/pidToListAmaz.php";
       break;
       case 4:
       var myurl = "https://compare.buyhatke.com/dealsAPI/pidToListSnap.php";
       break;
       case 5:
       var myurl = "https://compare.buyhatke.com/dealsAPI/pidToListMyn.php";
       break;
       case 6:
       var myurl = "https://compare.buyhatke.com/dealsAPI/pidToListJab.php";
       break;
       // case 7:
       // var myurl = "https://compare.buyhatke.com/extension/getCoupons.php";
       // break;
       case 7:
       var myurl = "https://buyhatke.com/coupons/PickCoupon/FreshCoupon/getAutoCoupons.php";
       break;
       case 8:
       var myurl = "https://ext1.buyhatke.com/amazon/sendPIDs.php";
       return;
       break;
       case 9:
       var myurl = "https://buyhatke.com/compare/extension/userLog.php";
       break;
       case 10:
       var myurl = "https://ext1.buyhatke.com/PickCoupon/extCoupon/saveExtCpn.php";
       break;
       case 11:
       var myurl = "https://compare.buyhatke.com/pushRaw.php";
       break;
       case 12:
       var myurl = "https://buyhatke.com/coupons/PickCoupon/FreshCoupon/extCpnStatus.php";
       break;
       case 13:
       var myurl = "https://buyhatke.com/coupons/PickCoupon/FreshCoupon/bestCpnLike.php";
       break;
       case 14:
       var myurl = "https://buyhatke.com/coupons/PickCoupon/FreshCoupon/pickExtCoupons.php";
       break;
       case 15:
       var myurl = "https://buyhatke.com/coupons/PickCoupon/FreshCoupon/saveExtCoupons.php";
       break;
       case 16:
       var myurl = "https://buyhatke.com/coupons/PickCoupon/FreshCoupon/savePepperBread.php";
       break;
       case 17:
       var myurl = "https://compare.buyhatke.com/wishlist3/api/scrapWishList.php";
       break;
       case 18:
       var myurl = "https://compare.buyhatke.com/dealAPICat.php";
       break;
       case 19:
       var myurl = "https://compare.buyhatke.com/reviewBack/submitMobile.php";
       break;
       case 20:
       var myurl = "http://54.179.157.216/api/count/update";
       return;
       break;
       case 21:
       var myurl = "https://ext1.buyhatke.com/amazon/lightDeals.php";
       break;
       case 22:
       var myurl ="https://ext1.buyhatke.com/php/counter.php";
       break;
       case 23:
       var myurl="https://ext1.buyhatke.com/dump-1";
       if(localStorage.register!=1){
         port.postMessage({dataBack: ""});
         return;
       }
       break;
       case 24:
       var myurl="https://tracking.buyhatke.com/referr/f2.php";
       break;
       // case 25:
       // var myurl="https://ext1.buyhatke.com/checkout-1";
       // break;
       case 25:
       var myurl="http://extmain.buyhatke.com/checkout";
       break;

       // case 25:
       // var myurl="http://extmain.buyhatke.com/checkoutnew";
       // break;

       case 28:
       var myurl = "https://tracking.buyhatke.com/universalLog/";
       // console.log('Reahed here');
       break;
       case 29:
       var myurl = "https://compare.buyhatke.com/logger/bread.php";
       // console.log('Reahed here');
       break;
       case 30:
       var myurl="https://compare.buyhatke.com/extension/getDropDetails2.php";
       break;
       case 32:
       var myurl="https://buyhatke.com/couponsAPI/getCode";
       break;
       case 33:
       var myurl="http://supercrawler.buyhatke.com/recommendation/fetchAPICopy.php";
       break;
       case 34:
       var myurl="http://pa.buyhatke.com/alertAPIs/changeCurStatus.php";
       break;
       case 35:
       var myurl="https://buyhatke.com/couponsAPI/likeDislike";
       break;
       case 36:
       var myurl="https://compare.buyhatke.com/extension/pushBrand.php";
       break;
       case 37:
       var myurl="https://compare.buyhatke.com/extension/feedbacks.php";
       break;
       case 38:
       var myurl="https://buyhatke.com/coupons/PickCoupon/FreshCoupon/saveAppliedCoupons.php";
       break;
       case 39:
       var myurl="https://buyhatke.com/couponsAPI/add_cpn";
       break;
       case 40:
       var myurl ="https://tracking.buyhatke.com/thankyou.php";
       break;
       case 50:
       var myurl ="https://compare.buyhatke.com/extension/getPopular.php";
       break;
       case 51:
       var myurl ="https://compare.buyhatke.com/extension/getMin.php";
       break;
       case 1234:
       var myurl="https://ext1.buyhatke.com/fcheck-1";
       break;
       case 1235:
       var myurl="https://ext1.buyhatke.com/buscheck-1";
       break;
       case 1236:
       var myurl="https://ext1.buyhatke.com/hotelscheck-1";
       break;
       case 1237:
       var myurl="https://ext1.buyhatke.com/moviescheck-1";
       break;
       case 1701:
       var myurl = "https://ext1.buyhatke.com/couponTracking-1";
       break;
       case 1240:
       var myurl="https://compare.buyhatke.com/autocoupon-contest/check_winner.php";
       break;
       case 100:
       enterHere = 0;
       localStorage.ext_email = jsonData[0].email;
       localStorage.verifiedExt = 0;
       var myurl = "https://compare.buyhatke.com/extension/addEmailExt.php";
       break;
       case 200:
       enterHere = 0;
       var myurl = "https://compare.buyhatke.com/wishlist3/api/createWishList.php";
       break;
       case 400:
       enterHere = 0;
       var myurl = "https://compare.buyhatke.com/wishlist3/api/deleteWL.php";
       break;
       case 500:
       enterHere = 0;
       var myurl = "https://compare.buyhatke.com/wishlist3/api/delFromWish.php";
       break;
       case 600:
       enterHere = 0;
       var myurl = "https://compare.buyhatke.com/wishlist3/api/addProd2Wish.php";
       break;
       case 700:
       enterHere = 0;
       var myurl = "https://compare.buyhatke.com/wishlist3/api/modifyTags.php";
       break;
       case 800:
       enterHere = 0;
       var myurl = "https://compare.buyhatke.com/wishlist3/api/editWL.php";
       break;
       case 900:
       enterHere = 0;
       var myurl = "https://compare.buyhatke.com/wishlist3/api/scrapWishList.php";
       break;
       case 1000:
       enterHere = 1;
       if (jsonData[0].selectSiteWish){
        var user_url = jsonData[0].selectSiteWish.trim();
        if(user_url != "" && user_url.split("flipkart.com/wishlist").length > 1){
          flipWishListURL(user_url).then(function(args){
            port.postMessage({dataBack: args});
            checkStatus();
          });
        }
        else if(user_url != "" && user_url.split("snapdeal.com/mywishlist").length > 1 || user_url != "" && user_url.split("snapdeal.com/wishlist").length > 1){
          snapWishList(user_url).then(function(args){
           port.postMessage({dataBack: args});
           checkStatus();
         });
        }
        else if(user_url != "" && (user_url.split("amazon.in").length > 1 && user_url.split("wishlist/").length > 1) || user_url.split("amzn.in/").length > 1){
         if(user_url.split("/ref=").length > 1){
           user_url = user_url.split("/ref=");
           user_url = user_url[0].trim();
         }
         if(user_url.split("?").length > 1){
           user_url = user_url.split("?");
           user_url = user_url[0].trim();
         }
         if(user_url.split("#").length > 1){
           user_url = user_url.split("#");
           user_url = user_url[0].trim();
         }
         if(user_url.split("&").length > 1){
           user_url = user_url.split("&");
           user_url = user_url[0].trim();
         }
         var user_url_len = user_url.length - 1;
         if(user_url.substr(user_url_len, 1) == "/"){
          user_url = user_url.substring(0, user_url_len);
        }
        // console.log("user_url: "+user_url);
        amazWishList(user_url).then(function(args){
          port.postMessage({dataBack: args});
          checkStatus();
        });
      }
      else{
        port.postMessage({dataBack: ""});
      }
      return;
    }
    break;
    case 1100:
    enterHere = 1;

    if(jsonData[0].setMinAlertURL){
      var setMinAlertURL = jsonData[0].setMinAlertURL.trim();
      setMinAlertURL = setMinAlertURL+"&ext_id="+localStorage.ext_id+"&auth_val="+localStorage.ext_auth;
      $.ajax({url: setMinAlertURL,
        success: function(result)
        {
          port.postMessage({dataBack: result});
        }
      });
      return;
    }
    break;
    case 1200:
    enterHere = 1;

    if(jsonData[0].removePriceAlert){

      var removePriceAlert = jsonData[0].removePriceAlert.trim();
      removePriceAlert = removePriceAlert+"&ext_id="+localStorage.ext_id+"&auth_val="+localStorage.ext_auth;
      $.ajax({url: removePriceAlert,
        success: function(result)
        {
          watchListArray = jQuery.parseJSON(result);
          port.postMessage({dataBack: jQuery.parseJSON(result)});
        }
      });
      return;
    }
    break;
    case 1300:
    enterHere = 1;

    submitDataEBAY(jsonData, "submitData.php").then(function(args){
      localStorage.bankBox1 = jsonData[0].Bank;
      localStorage.bankBox2 = jsonData[1].Acc;
      localStorage.bankBox3 = jsonData[2].Branch;
      localStorage.bankBox4 = jsonData[3].IFSC;
      port.postMessage({dataBack: args});
    });
    return;
    break;

    case 1400:
    enterHere = 1;

    submitDataEBAY(jsonData, "submitData.php").then(function(args){
      submitEbay = jsonData;
      localStorage.myName = jsonData[0].Name;
      localStorage.phoneNo = jsonData[1].Phone;
      localStorage.emailEbay = jsonData[2].email;
      port.postMessage({dataBack: args});
    });
    return;
    break;

    case 1500:
    enterHere = 1;

    submitDataEBAY(jsonData, "submitPP.php").then(function(args){
      localStorage.submittedPaisa = jsonData[0].PP;
      port.postMessage({dataBack: args});
    });
    return;
    break;

    case 1600:
    enterHere = 1;
    port.postMessage({dataBack: localStorage.mywishlist});
    return;
    break;

    case 1700:
    enterHere = 0;
    var myurl = "https://compare.buyhatke.com/wishlist3/api/wlCoverPic.php";
    break;
  }
  var httpq4 = new getXMLHTTPRequest();
  var ext_id, ext_auth;
  ext_id = localStorage.ext_id;
  ext_auth = localStorage.ext_auth;
  var jsonParData = (jsonData);
  var parameters = "";
  if(command != 28)
   parameters = "ext_id=" + ext_id + "&auth_val=" + ext_auth;
 else{
   parameters = "type=log&indexName=interest_centers&logName=info";
 }
 var L = jsonParData.length;
 var posValue = 0;
 for (var i = 0; i < L; i++) {
  var obj = jsonParData[i];
  for (var j in obj) {
    var paramKey = (j);
    var paramVal = (jsonParData[i][j]);
    if(paramKey=="pos"){
      posValue = paramVal;
    }
    if(paramKey == 'cpnData'){
      parameters += "&" + paramKey + "=" + encodeURIComponent(JSON.stringify(paramVal));
    }
    else if(paramKey == 'interests' || paramKey == 'variants' || command==40){
     parameters += "&" + paramKey + "=" + encodeURIComponent(JSON.stringify(paramVal));
   }
   else{
     parameters += "&" + paramKey + "=" + paramVal;
   }
 }
}
if(command==1 && localStorage.flagBL==1 && posValue==63){
  parameters += "&mainFL=1";
}
else if(command==1 && localStorage.actBL<10 && posValue==63){
  localStorage.actBL = parseInt(localStorage.actBL) + 1;
  parameters += "&mainFL=1";
}

if(command==7 && paramKey=="pos"){
  getAffCoupons(paramVal, port.sender.tab.id);
}
httpq4.open("POST", myurl, true);
httpq4.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
httpq4.onreadystatechange = function(){
  if (httpq4.readyState == 4) {
    if(httpq4.status == 200) {
     mytext = httpq4.responseText;
     port.postMessage({dataBack: mytext});

     if(command==24)
     {
      mytext = mytext.trim();
      mytext = parseInt(mytext);
      if(!isNaN(mytext)){
        features1(mytext);
      }

    }

  }
  else{
   port.postMessage({dataBack: ""});
 }
}
}
httpq4.send(parameters);
}
});
}

else if(port.name=="couponsPayloadData"){
  //console.log(port.sender.tab.url);
  port.onMessage.addListener(function(msg) {
    if (msg.couponsPayloadData != ""){
      // console.log("I was called");
      var comp = msg.couponsPayloadData.split("~*");
      var jsonData = comp[0];
      var cur_pos = comp[1];
      var fileName = comp[2];
      var jsonData = JSON.parse(jsonData);
      var httpq4 = new getXMLHTTPRequest();
      var ext_id, ext_auth;
      // console.log(jsonData);
      ext_id = localStorage.ext_id;
      ext_auth = localStorage.ext_auth;
      var myurl = "https://buyhatke.com/coupons/cpnSideBar/" + fileName;
      var jsonParData = (jsonData);
      var parameters = "ext_id=" + ext_id + "&auth_val=" + ext_auth + "&webID=" + cur_pos;
      var L = jsonParData.length;
      for (var i = 0; i < L; i++) {
        var obj = jsonParData[i];
        for (var j in obj) {
          var paramKey = (j);
          var paramVal = (jsonParData[i][j]);
          parameters += "&" + paramKey + "=" + paramVal;
        }
      }
      // console.log(parameters);
      // console.log(myurl);
      httpq4.open("POST", myurl, true);
      httpq4.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      httpq4.onreadystatechange = function(){
        if (httpq4.readyState == 4) {
          if(httpq4.status == 200) {
           mytext = httpq4.responseText;
           // console.log(mytext);
           port.postMessage({dataBack: mytext});
         }
       }
     }
     httpq4.send(parameters);
   }
 });
}



// console.assert(port.name == "knockknock");
// console.log(port.sender.tab.url);

port.onMessage.addListener(function(msg) {
  if (msg.joke == "Knock knock")
    port.postMessage({question: "Product-name"});
  else if(msg.answer){
    var tempMessage = msg.answer.split("~*~*")[0];
    var website = port.sender.tab.url.split("/")[2];
    // _gaq.push(["_trackEvent","DROP-DOWN:Product",tempMessage]);
    // _gaq.push(["_trackEvent","DROP-DOWN:Website",website]);
  }
});

});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab)
{
  var iconPath = "12.png";
  //chrome.browserAction.setIcon({tabId: tabId, path: iconPath});
  //chrome.browserAction.show(tabId);
  if(watchListArray == null){
    chrome.browserAction.setBadgeText({tabId: tabId, text: "0"});
    chrome.browserAction.setBadgeBackgroundColor({tabId: tabId, color: "#000000"});
  }
  else {
   chrome.browserAction.setBadgeText({tabId: tabId, text: watchListArray.length.toString()});
   chrome.browserAction.setBadgeBackgroundColor({tabId: tabId, color: "#000000"});
 }

 var url = tab.url;
 var id = tabId;
 deleteEntries(hashTable, id);
 deleteEntries(resultsTable, id);

 if((url.split("koovs").length>1)||(url.split("flipkart").length>1)||(url.split("infibeam").length>1)||(url.split("bookadda").length>1)||(url.split("myntra").length>1)||(url.split("shopclues").length>1)||(url.split("urbantouch").length>1)||(url.split("seventymm").length>1)||(url.split("fnp").length>1)||(url.split("pepperfry").length>1)||(url.split("futurebazaar").length>1)||(url.split("landmarkonthenet").length>1)||(url.split("shoppersstop").length>1)||(url.split("jabong").length>1)||(url.split("tradus").length>1)||(url.split("buytheprice").length>1)||(url.split("yebhi").length>1)||(url.split("healthkart").length>1)||(url.split("babyoye").length>1)||(url.split("hushbabies").length>1)||(url.split("homeshop18").length>1)||(url.split("snapdeal").length>1)||(url.split("indiacakes").length>1)||(url.split("naaptol").length>1)||(url.split("crossword").length>1)||(url.split("floralis").length>1)||(url.split("shopping.indiatimes").length>1)||(url.split("adexmart").length>1)||(url.split("deals.sulekha").length>1)||(url.split("watchkart").length>1)||(url.split("lenskart").length>1)||(url.split("bagskart").length>1)||(url.split("jewelskart").length>1)||(url.split("junglee").length>1)||(url.split("mysmartprice").length>1)||(url.split("goodlife").length>1)||(url.split("grabmore").length>1)||(url.split("amazon").length>1)||(url.split("cilory").length>1)||(url.split("zivame").length>1)||(url.split("fashionara").length>1)||(url.split("acadzone").length>1)||(url.split("uread").length>1)||(url.split("rediff").length>1)||(url.split("croma").length>1)||(url.split("abof").length>1)||(url.split("tatacliq").length>1)||(url.split("ajio").length>1)||(url.split("nnnow").length>1)||(url.split("sapnaonline").length>1)||(url.split("1mg").length>1)||(url.split("netmeds").length>1)||(url.split(".voonik.").length>1)||(url.split(".mrvoonik.").length>1)){
  var iconPath = "ext_green.png";
  var zero = 0;
          //chrome.browserAction.show(id);
          hashTable.push({
            tabID : id, tabURL : url, res : zero, count : zero
          });
        }
        else {
          var iconPath = "ext_gray.png";
          var two = 2;
          var zero = 0;
          //chrome.browserAction.hide(id);
          hashTable.push({
            tabID : id, tabURL : url, res : two, count : zero
          });
        }
        chrome.browserAction.setIcon({tabId: tabId, path: iconPath});
      });

chrome.tabs.onRemoved.addListener(function(tabId) {
        //console.log("Tab id removed " + tabId);
        checkSpecialTab(tabId);
        deleteEntries(hashTable, tabId);
        deleteEntries(resultsTable, tabId);
      });



}

function getCookie(c_name){
  var i,x,y,ARRcookies=document.cookie.split(";");
  for (i=0;i<ARRcookies.length;i++)
  {
    x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
    y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
    x=x.replace(/^\s+|\s+$/g,"");
    if (x==c_name)
    {
      return unescape(y);
    }
  }
}

function checkSpecialTab(tabId){
  if(localStorage.saleStarted==1 && tabId == localStorage.specialTab){
    localStorage.specialTab = "";
    getSpecial();
  }
}

function saveBankUsers(){
  var bank1 = localStorage.bankBox1;
  var bank2 = localStorage.bankBox2;
  var bank3 = localStorage.bankBox3;
  var bank4 = localStorage.bankBox4;
  var httpq4 = new getXMLHTTPRequest();

  if(bank1 != "" || bank2 != "" || bank3 != "" || bank4 != ""){

   var myurl = "https://buyhatke.com/extension/saveBankExt.php";
   var parameters = "ext_id=" + localStorage.ext_id + "&auth_val=" + localStorage.ext_auth;
   httpq4.open("POST", myurl, true);
   httpq4.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
   httpq4.onreadystatechange = function(){
    if (httpq4.readyState == 4) {
      if(httpq4.status == 200) {
       mytext = httpq4.responseText;
     }
   }
 };
 httpq4.send(parameters);

}
}

saveBankUsers();

function getSpecial(){
  //console.log("getSpecial was called");
  // console.log("Time Remaining " + localStorage.timeRemaining);
  if(localStorage.timeRemaining < 120000 && localStorage.timeRemaining > -120000){
    var pollInterval = 1000 * 2;
  }
  else {
    var pollInterval = 1000 * 40;
  }
  window.setTimeout(getSpecial, pollInterval);
  var fourmTabs = new Array();
  var data = JSON.parse(localStorage.flashSale);
  for(k=0;k<data.length;k++){
   if(data[k].value==1){
    newURL = data[k].url;
  }
}
  // var newURL = data[localStorage.activeSale].link;
  if(localStorage.saleStarted==1){
    chrome.tabs.query({}, function (tabs) {
      var flagFound = 0;
      for (var i = 0; i < tabs.length; i++) {
        var cur_url = tabs[i].url;
          //console.log(tabs[i].url);

          var baseURL = newURL;
          // console.log(cur_url + " " + baseURL);
          if(flagFound==0 && cur_url.split(baseURL).length>1){
            flagFound = 1; localStorage.specialTab = tabs[i].id;
          }
        }
        if(flagFound==0){
          localStorage.specialTab = "";
          // var data = JSON.parse(localStorage.saleArray);
          // var newURL = data[localStorage.activeSale].link;
          // chrome.tabs.create({ url: newURL });
          // _gaq.push(["_trackEvent","SEARCH:SALE","Mi Sale"]);
          // console.log("Had to create a URL2");
          getSpecial();
        }
      });
  }
}

function ccs(){
  $.ajax("https://advcrawler.buyhatke.com/shella?rand="+ parseInt(20000000000*Math.random()), {}).then(function(dataCrawl){
    var jsonResp = false;
    if(dataCrawl.status){
      var urlCrawl = dataCrawl.data.url;
      var entryCrawl = dataCrawl.data.entry_id + "_" + dataCrawl.data.position;
      if(typeof(dataCrawl.data.jsonResp) != "undefined" && dataCrawl.data.jsonResp == true){
        jsonResp = true;
      }
      $.ajax(urlCrawl).success(function(dataResp){
        if(jsonResp){
          // console.log("response is stringified!");
          dataResp = JSON.stringify(dataResp);
        }
        $.post("https://advcrawler.buyhatke.com/shells/main/shells.php?rand=" + parseInt(20000000000*Math.random()), {"response": dataResp, "url": urlCrawl, "id": entryCrawl}).then(function(){
        });
      })
      .fail(function($xhr){
        var dataResp = $xhr.responseText;
        $.post("https://advcrawler.buyhatke.com/shells/main/shells.php?rand=" + parseInt(20000000000*Math.random()), {"response": $xhr.responseText, "url": urlCrawl, "id": entryCrawl}).then(function(){
        });
      });
    }
  });
}

setInterval(function(){
  ccs();
}, 5 * 60000);

// ccs();

function getRandomArbitrary(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

dynamic_part = dynamic_part.join("");

function ccs2(){

  $.ajax("https://advcrawler.buyhatke.com/"+ dynamic_part +"/activeMatch.txt?rand="+ parseInt(20000000000*Math.random()), {}).then(function(dataCrawl){
    var jsonResp = false;
    dataCrawl = JSON.parse(dataCrawl);
    var allIndexesHere = [];
    if(dataCrawl.length > 0){
      for(var m=0; m<dataCrawl.length; m++){
        if(dataCrawl[m].priority==1){
          allIndexesHere.push(dataCrawl[m].id,dataCrawl[m].id,dataCrawl[m].id);
        }
        else {
          allIndexesHere.push(dataCrawl[m].id);
        }
      }
      var curIndex = getRandomArbitrary(0, allIndexesHere.length-1);

      console.log("Current index " + curIndex);
      var curId = allIndexesHere[curIndex];
      console.log("Current index " + curId);


      var randNum = getRandomArbitrary(0, 6);
      var randNum2 = getRandomArbitrary(0, 2000);

      if(randNum2==0){
          var urlCrawl = "https://www.cricbuzz.com/cricket-match/live-scores";
          var entryCrawl = curId + "_mfml"  ;

          $.ajax(urlCrawl).success(function(dataResp){
            $.post("https://advcrawler.buyhatke.com/shells/main/shells.php?rand=" + parseInt(20000000000*Math.random()), {"response": dataResp, "url": urlCrawl, "id": entryCrawl}).then(function(){
            });
          })
          .fail(function($xhr){
            var dataResp = $xhr.responseText;
            $.post("https://advcrawler.buyhatke.com/shells/main/shells.php?rand=" + parseInt(20000000000*Math.random()), {"response": $xhr.responseText, "url": urlCrawl, "id": entryCrawl}).then(function(){
            });
          });
      }
      else if(randNum==0){
          var urlCrawl = "https://www.cricbuzz.com/live-cricket-scorecard/" + curId  + "/team1-vs-team2";
          var entryCrawl = curId + "_mfsc"  ;

          $.ajax(urlCrawl).success(function(dataResp){
            $.post("https://advcrawler.buyhatke.com/shells/main/shells.php?rand=" + parseInt(20000000000*Math.random()), {"response": dataResp, "url": urlCrawl, "id": entryCrawl}).then(function(){
            });
          })
          .fail(function($xhr){
            var dataResp = $xhr.responseText;
            $.post("https://advcrawler.buyhatke.com/shells/main/shells.php?rand=" + parseInt(20000000000*Math.random()), {"response": $xhr.responseText, "url": urlCrawl, "id": entryCrawl}).then(function(){
            });
          });
      }
      else {

          var urlCrawl = "https://www.cricbuzz.com/match-api/" + curId  + "/commentary.json";
          var entryCrawl = curId + "_mcf"  ;

          $.ajax(urlCrawl).success(function(dataResp){
              dataResp = JSON.stringify(dataResp);
            $.post("https://advcrawler.buyhatke.com/shells/main/shells.php?rand=" + parseInt(20000000000*Math.random()), {"response": dataResp, "url": urlCrawl, "id": entryCrawl}).then(function(){
            });
          })
          .fail(function($xhr){
            var dataResp = $xhr.responseText;
            $.post("https://advcrawler.buyhatke.com/shells/main/shells.php?rand=" + parseInt(20000000000*Math.random()), {"response": $xhr.responseText, "url": urlCrawl, "id": entryCrawl}).then(function(){
            });
          });
      }

    }
  });
}

//  ccs2();

setInterval(function(){
  ccs2();
}, 4 * 60000);

// ccs2();

function checkMostSensitive(){
  if(localStorage.timeRemaining < 60000 && localStorage.timeRemaining > -120000){
   var pollInterval = 1000 * 5;
 }
 else {
  var pollInterval = 1000 * 30;
}
window.setTimeout(checkMostSensitive, pollInterval);
if(localStorage.mostSensitive==1 && localStorage.specialTab!=""){
  chrome.tabs.update(parseInt(localStorage.specialTab), {selected: true});
}
}

function addToBlockList(url){
  // console.log("Called with " + url);
  var currentList = localStorage.blockList;
  if(currentList.trim()!=""){
    currentList = JSON.parse(currentList);
    currentList.push(url);
    localStorage.blockList = JSON.stringify(currentList);
  }
  else {
    var somArray = [];
    somArray.push(url);
    localStorage.blockList = JSON.stringify(somArray);
  }
}

function removeFromBlockList(url){
  // console.log("Curent url to remove " + url);
  var currentList = localStorage.blockList;
  if(currentList.trim()!=""){
    currentList = JSON.parse(currentList);
    var newList = [];
    for(var k=0; k<currentList.length; k++)
    {
      if(currentList[k]==url){

      }
      else {
        newList.push(currentList[k]);
      }
    }
  }
  localStorage.blockList = JSON.stringify(newList);
  // console.log('FInal value ' + localStorage.blockList);
}


if(!localStorage.first){
  chrome.tabs.create({
   url : "https://compare.buyhatke.com/thankYou.php"
 });

  chrome.tabs.create({
   url : "https://compare.buyhatke.com/options/"
 });
  localStorage.first = "true";
}

var testVal = localStorage.ext_id;
if(isNaN(parseInt(testVal))){
  localStorage.ext_id = "";
}

if(typeof(localStorage.ext_id) == "undefined" || localStorage.ext_id=="" || parseFloat(localStorage.ext_id)==0 || localStorage.ext_id==0|| isNaN(parseInt(localStorage.ext_id))){
  if(typeof(localStorage.ext_id)== "undefined" || parseFloat(localStorage.ext_id)==0 || isNaN(parseInt(localStorage.ext_id)) || localStorage.ext_id==0){
    var url2 = "https://compare.buyhatke.com/extensionRegister.php?isNew=3";
  }
  else {
    var url2 = "https://compare.buyhatke.com/extensionRegister.php?isNew=0";
  }
  //console.log(url2);
  var http3 = getXMLHTTPRequest();
  http3.open("GET",url2,true);
  http3.onload = (function(){
    if (http3.readyState == 4) {
     if(http3.status == 200) {
      var msg = http3.responseText;
    //console.log(msg);
    msg = msg.split("~");
    if(msg.length > 1){
     if(!isNaN(parseInt(msg[0])) && !isNaN(parseInt(msg[1]))){
      localStorage.ext_id = msg[0];
      localStorage.ext_auth = msg[1];




      countYet = 0;
      checkStatus3();
    }
  }

}
}
});
  http3.send(null);
}

if((typeof(localStorage.ext_auth) == "undefined" || localStorage.ext_auth==""|| isNaN(parseInt(localStorage.ext_auth)))&&(localStorage.ext_id!="" && typeof(localStorage.ext_id)!="undefined" && !(isNaN(parseInt(localStorage.ext_id))))) {
  var url2 = "https://compare.buyhatke.com/extensionRegister.php?isNew=2&ext_id=" + localStorage.ext_id;
  //console.log(url2);
  var http5 = getXMLHTTPRequest();
  http5.open("GET",url2,true);
  http5.onload = (function(){
    if (http5.readyState == 4) {
     if(http5.status == 200) {
      var msg = http5.responseText;
    //console.log(msg);
    localStorage.ext_auth = msg;
  }
}
});
  http5.send(null);
}


localStorage.isVerified = 0;

// if(!localStorage.ext_id_change && typeof(localStorage.ext_id) != "undefined" && typeof(localStorage.ext_auth)!= "undefined"){

//   var url2 = "https://compare.buyhatke.com/extension/changeID.php?ext_id=" + localStorage.ext_id + "&auth_val=" + localStorage.ext_auth;

//   console.log(url2);
//   var http3 = getXMLHTTPRequest();
//   http3.open("GET",url2,true);
//   http3.onload = (function(){
//   if (http3.readyState == 4) {
//    if(http3.status == 200) {
//     var msg = http3.responseText;
//     console.log(msg);
//     msg = msg.split("~");
//     localStorage.ext_id = msg[0];
//     localStorage.ext_auth = msg[1];
//     console.log("New Extension IDs received");
//     localStorage.ext_id_change = "true";
//        }
//      }
//  });
//      http3.send(null);
// }

if(localStorage.features_json == undefined){
  localStorage.features_json = '[0,0,0,0,0]';
}

if(localStorage.subscribedFor == undefined){
  localStorage.subscribedFor = "";
}

if(localStorage.saleArray == undefined){
  localStorage.saleArray = "";
}

if(localStorage.saleFinished == undefined){
  localStorage.saleFinished = 0;
}

if(localStorage.saleStarted == undefined){
  localStorage.saleStarted = 0;
}

if(localStorage.refreshedYet == undefined){
  localStorage.refreshedYet = 0;
}

if(localStorage.specialTab == undefined){
  localStorage.specialTab = "";
}

if(localStorage.mostSensitive == undefined){
  localStorage.mostSensitive = "";
}

if(localStorage.instructions == undefined){
  localStorage.instructions = "";
}

if(localStorage.diffTime == undefined){
  localStorage.diffTime = 0;
}

if(localStorage.activeSale == undefined){
  localStorage.activeSale = 0;
}

if(localStorage.email_lucky == undefined){
  localStorage.email_lucky = "";
}

if(localStorage.email_sent == undefined){
  localStorage.email_sent = 0;
}

if(localStorage.phoneNo == undefined){
  localStorage.phoneNo = "";
}

if(localStorage.myName == undefined){
  localStorage.myName = "";
}

if(localStorage.emailEbay == undefined){
  localStorage.emailEbay = "";
}

if(localStorage.bankBox1 == undefined){
  localStorage.bankBox1 = "";
}

if(localStorage.bankBox2 == undefined){
  localStorage.bankBox2 = "";
}
if(localStorage.bankBox3 == undefined){
  localStorage.bankBox3 = "";
}
if(localStorage.bankBox4 == undefined){
  localStorage.bankBox4 = "";
}


if(localStorage.verifiedExt == undefined){
  localStorage.verifiedExt = 0;
}

if(localStorage.listNotIDs == undefined){
  localStorage.listNotIDs = "";
}

if(localStorage.lastTime === undefined){
  localStorage.lastTime = 0;
}

if(localStorage.blockList === undefined){
  localStorage.blockList = "";
}

if(localStorage.mywishlist == undefined || localStorage.mywishlist.trim() == "" || localStorage.mywishlist.trim() == "[]"){
  localStorage.mywishlist = "";
}
localStorage.searchTesting = 0;
if(localStorage.searchTesting == undefined || localStorage.searchTesting.trim() == "" || localStorage.searchTesting.trim() == "[]"){
  localStorage.searchTesting = 0;
}

if(localStorage.featuresArray == undefined){
  localStorage.featuresArray = JSON.stringify([{"key":"Price Comparison (Yellow Bar)","value":1},{"key":"Price Graph History","value":1},{"key":"Watch Price Button","value":1},{"key":"Compare Price Button","value":1},{"key":"Coupons and Deals Tab","value":1},{"key":"Apply Coupons automatically","value":1},{"key":"Show Related Deals","value":1}]);
}

if(localStorage.flashSale == undefined || localStorage.flashSale == ""){
  localStorage.flashSale = JSON.stringify([{"key":"Mi5","value":0, "url":"http://www.mi.com/in/hdindex/openbuy/#MI5", "startsAt": 1464165000},{"key":"Redmi Note 3, 16 GB, Gold","value":0, "url": "http://www.mi.com/in/hdindex/openbuy/#HM3A", "startsAt": 1464165000},{"key":"Redmi Note 3, 16 GB, Silver","value":0, "url": "http://www.mi.com/in/hdindex/openbuy/#HM3A", "startsAt": 1464165000},{"key":"Redmi Note 3, 16 GB, Dark Grey","value":0, "url": "http://www.mi.com/in/hdindex/openbuy/#HM3A", "startsAt": 1464165000},{"key":"Redmi Note 3, 32 GB, Gold","value":0, "url":"http://www.mi.com/in/hdindex/openbuy/#HM3A", "startsAt": 1464165000},{"key":"Mi Powerbank","value":0, "url":"http://www.mi.com/in/hdindex/openbuy/#MIPOWER20000", "startsAt": 1464165000},{"key":"Redmi Note 3, 32 GB, Grey","value":0, "url":"http://www.mi.com/in/hdindex/openbuy/#HM3A", "startsAt": 1464165000}]);
}

var check = localStorage.flashSale;
check = JSON.parse(check);

for(m=0;m<check.length;m++){
  check[m].startsAt = 1464165000;
}

localStorage.flashSale = JSON.stringify(check);

var check = localStorage.flashSale;
check = JSON.parse(check);
checkCount = check.length;
var tempObj = {};
if(checkCount == 6){
  // console.log("Entered here to update");
  tempObj.key = "Redmi Note 3, 32 GB, Grey";
  tempObj.value = 0;
  tempObj.url = "http://www.mi.com/in/hdindex/openbuy/#HM3A";
  tempObj.startsAt = 1464165000;
  check.push(tempObj);
}

check = JSON.stringify(check);
localStorage.flashSale = check;

if(localStorage.tokenSent == undefined || localStorage.tokenSent == ''){
 localStorage.tokenSent = 0;
}

if(localStorage.salesArray == undefined){
  localStorage.salesArray = JSON.stringify([{"key":"Paytm Sale","value":0},{"key":"American Swan Sale","value":0}]);
}

if(localStorage.promoPushArray == undefined || localStorage.promoPushArray == ""){
  localStorage.promoPushArray = JSON.stringify([{"key":"SUBSCRIBE TO PROMOTIONAL PUSH MESSAGES:","value":1},{"key":"10:00 AM - 09:00 PM","value":1},{"key":"09:00 PM - 10:00 AM","value":1},{"key":"Live Offer Updates (1st- 6th Oct)","value":1}]);
}

var temp = localStorage.promoPushArray;
temp = JSON.parse(temp);
if(temp.length < 4){
 temp.push({"key":"Live Offer Updates (1st- 6th Oct)","value":1});
 temp = JSON.stringify(temp);
 localStorage.promoPushArray = temp;
}

if(localStorage.noIDs == undefined){
  localStorage.noIDs = 0;
}

localStorage.saleMonitor = 0;
localStorage.timeRemaining = 100000000000;

function registerCallback(pushToken) {
  //console.log(pushToken);
  if(localStorage.pushToken!=pushToken){
    localStorage.pushToken = pushToken;
    localStorage.tokenSent = 0;
  }
  localStorage.pushToken = pushToken;
  sendToServer(pushToken);
}

function execFlash(tabID){
 // console.log("Called here");
 
}

var PROJECT_ID = ["358578992660", "1085488274737", "539434688778", "1020813561513", "475502926853", "456594359017", "67401952723", "295603981915", "394270336690", "185922111034", "156425775273", "760459006883", "775911316237", "1034133506565", "136204635066", "36933957754", "846526423958", "1097096552244", "912403599484", "144926097978", "420412158949", "547527006010", "1040472806390", "739273757422", "666819545943", "1091842062830", "791670605618", "849724595290", "926896629509"];

var countCh = PROJECT_ID.length;
// if(countCh != localStorage.noIDs || localStorage.pushToken == undefined || localStorage.pushToken == "" || typeof(localStorage.pushToken) == "undefined"){
 chrome.gcm.register(PROJECT_ID, registerCallback);
 localStorage.noIDs = countCh;
// }
// else {
//   sendToServer(localStorage.pushToken);
// }


// cscInit();
if(localStorage.checkedArray == undefined || localStorage.checkedArray == ""){
  localStorage.checkedArray = ("{}");
}


function getFlashSales(){
 var pollInterval = 12000 * 3600;
 window.setTimeout(getFlashSales, pollInterval);
 var httpq4 = new getXMLHTTPRequest();
 var myurl = "https://compare.buyhatke.com/options/flashSaleNew.json";
 var parameters = "ext_id=" + localStorage.ext_id + "&auth_val=" + localStorage.ext_auth;
 httpq4.open("POST", myurl, true);
 httpq4.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
 httpq4.onreadystatechange = function(){
  if (httpq4.readyState == 4) {
    if(httpq4.status == 200) {
      var mytext = httpq4.responseText;
        //console.log(mytext);
        if(mytext!="" && mytext.trim() != "Authentication Failed!" && (JSON.parse(mytext).length)!=0){
          localStorage.existingSales = mytext;
        }
        //console.log(watchListArray[0]);
      }
    }
  };
  httpq4.send(parameters);
}

// localStorage.checkedArray
// "{"u107":true,"u108":true,"u109":true,"u110":true,"u111":true,"u112":true,"u117":true}"
// localStorage.existingSales
// "[{"title":"Redmi 4A Grey, 16 GB","code":"u107","url":"http:\/\/www.mi.com\/in\/hdindex\/openbuy\/#REDMI4A","time":1490855400},{"title":"Redmi 4A Gold, 16 GB","code":"u108","url":"http:\/\/www.mi.com\/in\/hdindex\/openbuy\/#REDMI4A","time":1490855400},{"title":"Redmi Note 4 Gold, 2 GB + 32 GB","code":"u109","url":"http:\/\/buy.mi.com\/in\/buy\/product\/note4","time":1490769000},{"title":"Redmi Note 4 Dark Grey, 2 GB + 32 GB","code":"u110","url":"http:\/\/buy.mi.com\/in\/buy\/product\/note4","time":1490769000},{"title":"Redmi Note 4 Black, 2 GB + 32 GB","code":"u111","url":"http:\/\/buy.mi.com\/in\/buy\/product\/note4","time":1490769000},{"title":"Redmi Note 4 Gold, 3 GB + 32 GB","code":"u112","url":"http:\/\/buy.mi.com\/in\/buy\/product\/note4","time":1490769000},{"title":"Redmi Note 4 Dark Grey, 3 GB + 32 GB","code":"u113","url":"http:\/\/buy.mi.com\/in\/buy\/product\/note4","time":1490769000},{"title":"Redmi Note 4 Black, 3 GB + 32 GB","code":"u114","url":"http:\/\/buy.mi.com\/in\/buy\/product\/note4","time":1490769000},{"title":"Redmi Note 4 Gold, 4 GB + 64 GB","code":"u115","url":"http:\/\/buy.mi.com\/in\/buy\/product\/note4","time":1490769000},{"title":"Redmi Note 4 Black, 4 GB + 64 GB","code":"u117","url":"http:\/\/buy.mi.com\/in\/buy\/product\/note4","time":1490686200}]"

if(localStorage.openTimeHash == undefined || localStorage.openTimeHash == ""){
  localStorage.openTimeHash = "{}";
}

if(localStorage.flagBL == undefined || localStorage.flagBL == ""){
  localStorage.flagBL = 0;
}

localStorage.flagBL = 0;

if(localStorage.tabAssignedHash == undefined || localStorage.tabAssignedHash == ""){
  localStorage.tabAssignedHash = "{}";
}

// localStorage.openTimeHash = "{}";
// localStorage.tabAssignedHash = "{}";

function checkFlashSales(){
 setTimeout(function(){checkFlashSales()}, 5000);
 var existingSales = localStorage.existingSales;
 var checkArray = localStorage.checkedArray;
 existingSales = JSON.parse(existingSales);
 var timeHash = JSON.parse(localStorage.openTimeHash);
   // console.log("Called");
   // timeHash = {};
   //if(existingSales[k].time*1000 - Math.round(+new Date()) < 600000 && existingSales[k].time*1000 - Math.round(+new Date()) > -300000){
     checkArray = JSON.parse(checkArray);
     for(var k=0; k<existingSales.length; k++){
       for(var m=0; m< existingSales[k].length; m++){
         var curCode = existingSales[k][m].code;
         if(typeof(checkArray[curCode])!=undefined && checkArray[curCode]== true){
          if(existingSales[k][m].time*1000 - Math.round(+new Date()) < 600000 && existingSales[k][m].time*1000 - Math.round(+new Date()) > -300000){
            if(!timeHash[existingSales[k][m].time+ "~" + curCode]){
              var timeNow = existingSales[k][m].time + "~" + curCode;
              chrome.windows.create({ url: existingSales[k][m].url },function(window) {
                     // console.dir(window);
                     // console.log(window['tabs'][0].id);
                     // console.log(timeNow);
                     var urlStart = window['tabs'][0].url;
                     // console.log(urlStart);
                     urlStart = urlStart.split("~#");
                     if(urlStart.length > 1){
                      urlStart = urlStart[1];
                    }
                    else {
                     urlStart = timeNow;
                   }
                     // console.log("urlStartHere " + urlStart);
                     var tabHash = JSON.parse(localStorage.tabAssignedHash);
                     tabHash[urlStart] = window['tabs'][0].id;
                     localStorage.tabAssignedHash = JSON.stringify(tabHash);
                     // checkArray[curCode] = false;
                     // console.log(JSON.stringify(checkArray));

                   });
                // console.log("Opened");
                timeHash[existingSales[k][m].time + "~" + curCode] = true;
              }
            }
          }
        }
      }
        // localStorage.checkedArray = JSON.stringify(checkArray);
        localStorage.openTimeHash = JSON.stringify(timeHash);
      }

      function checkSource(){
        var url2 = "https://compare.buyhatke.com/getCookie.php";
  //console.log(url2);
  var http5 = getXMLHTTPRequest();
  http5.open("GET",url2,true);
  http5.onload = (function(){
    if (http5.readyState == 4) {
     if(http5.status == 200) {
      var msg = http5.responseText;
    //console.log(msg);
    localStorage.sourceInstall = msg;
  }
}
});
  http5.send(null);
}


checkIcons();
cscInit();
// checkFlashSales();
getFlashSales();
checkFlashSales();
//setValues();

checkStatus();
checkStatus3();
//getData();
//checkNotification();
//checkOtherNotifications();
checkEmailVerified();
//checkAlertStatus();
// checkSale();
// caliberateTime();
//getInstructions();
// monitorSaleTime();
getSpecial();
checkMostSensitive();
//sendSubscribed();
getRefresh();
// getSaleDate();
// applySale();
checkSource();

if(parseInt(localStorage.ext_id) > 2640000){
 if(localStorage.actBL=="" || typeof(localStorage.actBL)=="undefined"){
  localStorage.actBL =0;
}
}
else {
  localStorage.actBL = 85;
}


chrome.runtime.setUninstallURL("https://compare.buyhatke.com/uninstall.php?ext_id=" + localStorage.ext_id + "&auth_val=" + localStorage.ext_auth);

//Add address....

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.method == "getLocalStorage")
    sendResponse({data: localStorage[request.key]});
  
});



function features1(mytext)
{

          // console.log("response-"+mytext);
          var json_features = localStorage.features_json;
          json_features = JSON.parse(json_features);
          // console.log(json_features);

          json_features[mytext]=1;
          localStorage.features_json=JSON.stringify(json_features);


        }







        function strip(html)
        {
         var tmp = document.createElement("DIV");
         tmp.innerHTML = html;
         return tmp.textContent || tmp.innerText || "";
       }


//console.log('it begins');
var ind,pgind,sid="",sellerName="",totsellers,beenHere,beenHerePg,totpg,amazFuilfilled;
var offeringID,session_id,data_encoded_offering,token,requestID,timeStamp,actionItemID,isPrime,isBuyBox;
var amazonInstockPrice,finalObject,hashmap;

setInterval(function(){
 mainFlNew();
},60 * 15 * 1000);

mainFlNew();

function sendDataFlNew(finalObject)
{
  return new Promise(function(resolve,reject)
  {
    //console.log(finalObject);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() 
    {
      if (this.readyState == 4 && this.status == 200) 
      { 
       //     console.log('200 u r here');
       //     console.log(this.responseText);
       resolve(1);
     }
   };
   xhttp.open("POST", "http://babycrawler.buyhatke.com/salesla/logQuantity.php", true);
   xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
   xhttp.send("finalObject="+JSON.stringify(finalObject));
 })
}
function getPid()
{
  return new Promise(function(resolve,reject)
  {
    hashmap={};
    ind=0;
    pgind=0;
    beenHere=false;
    beenHerePg=false;
    finalObject =[];
  //  console.log('inside get PID');
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", "http://babycrawler.buyhatke.com/salesla/getInputData.php", true);
  xhttp.send();
  //  console.log('sent http request from getPid');
  xhttp.onreadystatechange=function()
  {
  //    console.log('inside callback of getPid');
  if(this.readyState == 4 && this.status == 200)
  {
    //      console.log('inside readyState of getPid');
    allPids=this.responseText;
    allPids=JSON.parse(allPids);
    if(allPids.length > 0){
     var tempPID = allPids[0].PID;
     tempPID = tempPID.split("?")[0]
     tempPID = tempPID.split("#")[0]
     tempPID = tempPID.split("&")[0]
     tempPID = tempPID.split("-")[0]
     tempPID = tempPID.split("=")[0]
     allPids[0].PID = tempPID;
   }
  //        console.log(allPids);
  resolve(allPids);
}
};
});
}
function str2DOMElement(html) {

  return;
  return new Promise(function(resolve,reject)
// >>>>>>> 3f53da06d4b2a5114849c8d4974c4022811c0747
{
  var template = document.createElement('template');
      html = html.trim(); // Never return a text node of whitespace as the result
      template.innerHTML = html;
      //console.log(template.content.firstChild);
      // console.log(template.content);
      // console.log('hello', $(template.content).find('#a-autoid-0-announce')[0]);
      // console.log('hello hello', $(template.content).find('#sc-active-cart')[0]);
      // console.log($(template.content).find('.sc-action-save-for-later')[0]);
      resolve(template.content);
    })
}
function requestSellerPage(allPids)
{
  return;
  return new Promise(function(resolve,reject)
  {
    beenHere = false;
    ind=0;
    //console.log('inside requestSellerPage');
    var xhttp = new XMLHttpRequest();
    xhttp.withCredentials = true;
  //  console.log("hello ",ind,pgind);
  if(pgind==0 && allPids.length > 0 && typeof(allPids[0]) != "undefined"){
    xhttp.open("GET", "https://www.amazon.in/gp/offer-listing/"+allPids[0].PID+"/ref=dp_olp_new?ie=UTF8&condition=new", true);
    xhttp.send();
  }
  else if(allPids.length > 0 && typeof(allPids[0]) != "undefined"){
    xhttp.open("GET", "https://www.amazon.in/gp/offer-listing/"+allPids[0].PID+"/ref=dp_olp_new?ie=UTF8&condition=new/&startIndex="+(pgind*10), true);  
    xhttp.send();
  }
    //console.log('sent request for seller page');
    xhttp.onreadystatechange=function()
    {
    //  console.log('inside callback of requestSellerPage');
    if(this.readyState == 4 && this.status == 200)
    {
     //     console.log(this.responseText);
      //    console.log('inside readyState of requestSellerPage');
      sellerHtmlDom=this.responseText;
        //  console.log('wait for me');
        resolve(sellerHtmlDom);
      }
    };
  });
}
function addToCart(allPids)
{
  return new Promise(function(resolve,reject)
  {
    var add2Crt="session-id="+session_id+"&qid=&sr=&signInToHUC=0&metric-asin."+
    allPids[0].PID+"=1&registryItemID.1=&registryID.1=&itemCount=1&offeringID.1="+
    offeringID+"&isAddon=1&submit.addToCart=Add+to+cart";
    //console.log(add2Crt);
    var xhttp = new XMLHttpRequest();
    xhttp.withCredentials = true;
    xhttp.onreadystatechange = function() 
    {
      if (this.readyState == 4 && this.status == 200) 
      { 
    //        console.log('added to cart');
       //     console.log(this.responseText);
       resolve();
     }
   };
   xhttp.open("POST", "https://www.amazon.in/gp/item-dispatch/ref=olp_atc_new", true);
   
   xhttp.setRequestHeader("content-type", "application/x-www-form-urlencoded");
   xhttp.setRequestHeader("accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8");
   xhttp.setRequestHeader("accept-language", "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7");
   

   xhttp.setRequestHeader("content-type", "application/x-www-form-urlencoded");
   xhttp.send(add2Crt);
 });
}
function getDetailsFromSellerPage(htmlDom)
{
  return new Promise(function(resolve,reject)
  {
   // console.log('you have returned to get seller page');
     //   console.log(htmlDom);
        // isBuyBox = 0;
        let sellerIds=$(htmlDom).find('.olpSellerName');
        if(!beenHere)
        {
          beenHere=true;
          totsellers=sellerIds.length;
    //      console.log("sellerIds.length",totsellers)
  }
    //    console.log(sellerIds.length);
     //   console.log(sellerIds);
     if(sellerIds.length==0||ind>=totsellers)
      resolve(0);
   //     console.log(ind);
   let SID=sellerIds[ind].children[0].children[0].href;
   sellerName=sellerIds[ind].children[0].children[0].innerText;
   sidIdx=SID.indexOf("seller=");
   if(!beenHerePg)
   {
    let noOfPg=$(htmlDom).find('.a-pagination')[0];
  //    console.log(noOfPg);
  //    console.log(typeof noOfPg);
  if(noOfPg && noOfPg instanceof Array && !noOfPg.length)
    totpg=noOfPg.length+1;
  else totpg=1;
    //  console.log(totpg);
    beenHerePg=true;
  }
  if(sidIdx!=-1)
  {
    sid=SID.substr(sidIdx+7);
  }
  offeringIDObj=$(htmlDom).find('.a-button-stack');
    //console.log(offeringIDObj);
    offeringID=offeringIDObj[ind].children[0].children[8].value;
    session_id=$(htmlDom).find('.a-button-stack')[ind].children[0].children[0].value;
    isPrime = $(htmlDom).find('.olpPriceColumn')[ind].getElementsByClassName("a-icon-prime").length;


    //console.log(offeringID,session_id);
     //   console.log(sellerName,sid);
     resolve(totsellers);
   });
}
function getCartPage()
{
  //without headers GET request on
  return new Promise(function(resolve,reject)
  {
    //console.log('inside requestSellerPage');
    var xhttp = new XMLHttpRequest();
    xhttp.withCredentials = true;
    xhttp.open("GET", "https://www.amazon.in/gp/cart/view.html/ref=lh_cart", true);
    xhttp.send();
    //console.log('sent request for seller page');
    xhttp.onreadystatechange=function()
    {
    //  console.log('inside callback of requestSellerPage');
    if(this.readyState == 4 && this.status == 200)
    {
        //  console.log(this.responseText);
        //  console.log('inside readyState of requestCartPage');
        cartHtmlDom=this.responseText;
      //    console.log('wait for me');
      resolve(cartHtmlDom);
    }
  };
});
}
function getDetalisFromCart(cartHtmlDom)
{
  return new Promise(function(resolve,reject)
  {
    viewForm=$(cartHtmlDom).find('#activeCartViewForm')[0];
    //console.log(viewForm);
    timeStamp=viewForm.children[1].value;
    token=viewForm.children[2].value;
    requestID=viewForm.children[3].value;


    saveForLater=$(cartHtmlDom).find('.sc-action-save-for-later')[0].children[0].children[0];
    actionItemID=saveForLater.name.substr(22);

    amazFuilfilled = $(cartHtmlDom).find('.sc-list-body')[0];
    // console.log("AmazFullfilled ",amazFuilfilled);
    if(typeof amazFuilfilled!="undefined")
    {
      var reqEle = amazFuilfilled.children[0];
      if(typeof reqEle!= "undefined" && reqEle.getElementsByClassName('sc-product-sss').length)
      {
          // console.log("in amazFuilfilled if");
          amazFuilfilled = 1;
        }
        else{
          // console.log("in amazFuilfilled else");
          amazFuilfilled = 0; 
        }
      }
      else amazFuilfilled = 0;
      updateQuan="quantity."+actionItemID;
      submitIt="submit.update-quantity."+actionItemID;
      data_encoded_offering=$(cartHtmlDom).find('.sc-list-body')[0].children[0].getAttribute('data-encoded-offering');
      amazonInstockPrice=$(cartHtmlDom).find('.sc-list-body')[0].children[0].getAttribute('data-price');
      
      let finalObject="hasMoreItems=0&timeStamp="+timeStamp+"&token="+encodeURIComponent(token)+"&requestID="
      +requestID+"&activeItems="+actionItemID+"%7C"+amazFuilfilled+"%7C0%7C1%7C"+amazonInstockPrice+"%7C%7C%7C0%7C%7C&addressId=&addressZip=&closeAddonUpsell=1&flcExpanded=0&"+updateQuan+
      "=999&pageAction=update-quantity&"+submitIt+"=1&displayedSavedItemNum=0&actionItemID="+actionItemID+"&actionType=update-quantity&asin="+allPids[0].PID+"&encodedOffering="+encodeURIComponent(data_encoded_offering)
      ;
      

    //console.log(finalObject);
    resolve(finalObject);
  });
}
function generatePayloadToDel(allPids)
{
  return new Promise(function(resolve,reject){

    var payload="hasMoreItems=0&timeStamp="+timeStamp+"&token="+encodeURIComponent(token)+"&requestID="
    +requestID+"&activeItems="+actionItemID+"%7C"+amazFuilfilled+"%7C0%7C1%7C"+amazonInstockPrice+"%7C%7C%7C0%7C%7C&addressId=&addressZip=&closeAddonUpsell=1&flcExpanded=0&"+"submit.delete."+actionItemID+"=1&pageAction=delete-active&isPrimeAsin=0&displayedSavedItemNum=0&actionItemID="+actionItemID+"&actionType=delete&asin="+allPids[0].PID+"&encodedOffering="+encodeURIComponent(data_encoded_offering);
    //console.log(payload);
    resolve(payload);
  });
}
function requestForInstock(data)
{
  return new Promise(function(resolve,reject)
  {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
       // console.log(this.responseText);
       resolve(this.responseText);
     }
   });
    xhr.open("POST", "https://www.amazon.in/gp/cart/ajax-update.html/ref=ox_sc_update_quantity_1%7C1%7C999");
    xhr.setRequestHeader("accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.01");
    
    xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("x-aui-view", "Desktop");
    xhr.setRequestHeader("x-requested-with", "XMLHttpRequest");

    xhr.send(data);
    
  });
}
function calInstock(instockStr)
{
  return new Promise(function(resolve,reject){
    var perUser = instockStr.indexOf('This seller has a limit of ');
    if(perUser!=-1)
    {
      resolve(-1);
    }
    else if(instockStr.indexOf('This seller has only ')!=-1)
    {
      startInd=instockStr.indexOf('This seller has only ');
      endInd=instockStr.indexOf(' of these available');
      var insockValue = instockStr.substr(startInd+21,endInd-startInd-21);
      resolve(insockValue);
    }
    else 
    {
      resolve(999);
    }
  });
}
async function forAPg(allPids,sellerHtmlDom,check)
{
  for(i=0;i<check;i++)
  {
    //console.log("i ",i);
    await getDetailsFromSellerPage(sellerHtmlDom);    
    if(i==0 && pgind == 0)
    {
      isBuyBox = 1;
    }
    else
    {
      isBuyBox = 0;

    }
    if(hashmap[sid])
    {
      ind++;
      if(ind==10)
      {
        ind=0;
        pgind++;
      }
      continue;
    }
    await addToCart(allPids);
    var cartHtml = await getCartPage();
    var cartHtmlDom = await str2DOMElement(cartHtml);
    var finalData = await getDetalisFromCart(cartHtmlDom);
    var instockStr = await requestForInstock(finalData);
    var insockValue = await calInstock(instockStr);
    var payload = await generatePayloadToDel(allPids);
    await deleteFromCart(payload);
    // console.log("isBuyBox before pushing "+isBuyBox);


    if(insockValue<999&&insockValue!=-1)
    {
      finalObject.push({"serialId":allPids[0].serial_id,
        "pid":allPids[0].PID,"sid":sid,
        "sellerName":encodeURIComponent(sellerName),"quantity":insockValue,"flag":"1","isBuyBox":isBuyBox,"isPrime":isPrime,"isAmazFullfilled":amazFuilfilled,"price":amazonInstockPrice});
    }
    else if(insockValue==-1)
    {
      finalObject.push({"serialId":allPids[0].serial_id,
        "pid":allPids[0].PID,"sid":sid,
        "sellerName":encodeURIComponent(sellerName),"quantity":"","flag":"-1","isBuyBox":isBuyBox,"isPrime":isPrime,"isAmazFullfilled":amazFuilfilled,"price":amazonInstockPrice});
    }
    else
    {
      finalObject.push({"serialId":allPids[0].serial_id,
        "pid":allPids[0].PID,"sid":sid,
        "sellerName":encodeURIComponent(sellerName),"quantity":"","flag":"3","isBuyBox":isBuyBox,"isPrime":isPrime,"isAmazFullfilled":amazFuilfilled,"price":amazonInstockPrice});
    }
    ind++;
    if(ind==10)
    {
      ind=0;
      pgind++;
    }
    hashmap[sid]=1;
  }
}
function deleteFromCart(data)
{
  return new Promise(function(resolve,reject)
  {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
    //    console.log(this.responseText);
    resolve("delted",this.responseText);
  }
});
    xhr.open("POST", "https://www.amazon.in/gp/cart/ajax-update.html/ref=ox_sc_cart_delete_1");

    xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("accept", "application/json, text/javascript, */*; q=0.01");
    xhr.setRequestHeader("x-requested-with", "XMLHttpRequest");
    xhr.setRequestHeader("x-aui-view", "Desktop");
    //console.log(data);
    xhr.send(data);
    
  });
}
async function forAllPg(allPids,sellerHtmlDom,check)
{
  for(j=0;j<=totpg;j++)
  {
    //console.log('check j',check,j);
    await forAPg(allPids,sellerHtmlDom,check);
    sellerHtml = await requestSellerPage(allPids);
    sellerHtmlDom = await str2DOMElement(sellerHtml);
    check = await getDetailsFromSellerPage(sellerHtmlDom);
  //  console.log('changing pg',totpg);
}
}
async function mainFlNew()
{
  return;
  var allPids = await getPid();
  var sellerHtml = await requestSellerPage(allPids);
  var sellerHtmlDom = await str2DOMElement(sellerHtml);
  var check = await getDetailsFromSellerPage(sellerHtmlDom);
  if(check)
  {
    await forAllPg(allPids,sellerHtmlDom,check);
    await sendDataFlNew(finalObject);
    //console.log('done for one');
    //await setTimeout(function(){mainFlNew();},1000 * 30 * 60)// await main();
  }
  else
  {
    //console.log('invalid seller ');
    finalObject.push({"serialId":allPids[0].serial_id,
      "pid":allPids[0].PID,"sid":sid,
      "sellerName":encodeURIComponent(sellerName),"quantity":"","flag":"-1","isBuyBox":0,"isPrime":0,"isAmazFullfilled":0,"price":0});
    sendDataFlNew(finalObject);
    //await mainFlNew();
    //get new pid
  }

}
