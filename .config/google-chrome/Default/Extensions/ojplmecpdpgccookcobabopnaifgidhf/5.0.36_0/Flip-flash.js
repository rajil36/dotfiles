var imgLogo = chrome.extension.getURL("logo.png");
var variant = "";
var prodName = "";
var varCode = "";
var saleTime = "";
var eid = "";

if(parseInt(Date.now()/1000)-localStorage.bookingTime >900){
  localStorage.bookingStarted = 0;
}
// Something's not right. Please try again.
function checkForOOS(){
 // if(document.querySelectorAll('._3hgEev').length > 0 && (document.querySelectorAll('._3hgEev')[0].innerText.split('Out Of Stock').length>1 || document.querySelectorAll('._3hgEev')[0].innerText.split('try again').length>1)){
   if(document.querySelectorAll('._37bjSl').length > 0 && document.querySelectorAll('._37bjSl')[0].innerText.split('out of stock').length>1){
    if(!document.getElementById('pop-alert-ams')){
      $('body').append('<div id="pop-alert-ams" class="hk-green" style="display:block;height:150px!important;"><div id="p-logo"><img src="' + imgLogo + '"></div><div id="p-msg"><a target="_blank" style="text-decoration:none;color:white;font-size:14px;font-family:calibri" href="https://compare.buyhatke.com/options/#mi-details"><p>Product is currently out of stock.Don\'t close this tab. We are refreshing to check when it would be in stock. As soon as it is in stock we will add it to your cart.</a></p></div></div></div>'); 
    }
    else {
      $('#pop-alert-ams').html('<div id="p-logo"><img src="' + imgLogo + '"></div><div id="p-msg"><a target="_blank" style="text-decoration:none;color:white;font-size:14px;font-family:calibri" href="https://compare.buyhatke.com/options/#mi-details"><p>Product is currently out of stock.Don\'t close this tab. We are refreshing to check when it would be in stock. As soon as it is in stock we will add it to your cart.</a></p></div></div>'); 
    }
    if(localStorage[varCode] != undefined)
        localStorage[varCode] = localStorage[varCode]-1 ; //so that the booking can be tried more than 10 times in oos case
    setTimeout(function(){window.location.reload();},5000);
  }
  else {
    setTimeout(function(){checkForOOS();},1000);
  }
}

/*if(window.location.href.split("/checkout/init").length>1){
 if(localStorage.bookingStarted==1){
   checkForOOS();
 }
}*/

function getProdFS(){
  if(getPID()!=""){
    var json = [{'getFlashSalesData': 'true'}];
    json = JSON.stringify(json);
    sendMessage(0, json, 0, showSalesData, []);
  }
  else setTimeout(getProdFS, 2000);
}

function showSalesData(data){
   var i = 0, link;
   var salesData = data;
   salesData = JSON.parse(salesData);
   salesData = salesData[1];
   for(i = 0; i < salesData.length ; i++){
      if(salesData[i].pid == ""){
         link = salesData[i].url;
         if(link.split('pid=').length > 1){
            link = link.split('pid=')[1];
            link = link.split('&')[0];
            link = link.trim();
            if(window.location.href.split(link).length > 1){
              prodName = salesData[i].title ; 
              varCode = salesData[i].code ;
              if(salesData[i].sid != "")
                eid = salesData[i].sid;
              else
              {
                if(document.querySelectorAll('._2_KrJI').length > 0 && document.querySelectorAll('._2_KrJI')[0].hasAttribute('id')){
                   eid = document.querySelectorAll('._2_KrJI')[0].getAttribute('id').trim();
                  if(eid.split('_').length > 1){
                    eid = eid.split('_')[1];
                    eid = eid.trim();
                  }
                }
              } 
            } 
         }
      }else{
         if(getPID() == salesData[i].pid){
            prodName = salesData[i].title ; 
            varCode = salesData[i].code ;
            if(salesData[i].sid != "")
              eid = salesData[i].sid;
            else
            {
              if(document.querySelectorAll('._2_KrJI').length > 0 && document.querySelectorAll('._2_KrJI')[0].hasAttribute('id')){
                 eid = document.querySelectorAll('._2_KrJI')[0].getAttribute('id').trim();
                 if(eid.split('_').length > 1){
                  eid = eid.split('_')[1];
                  eid = eid.trim();
                 }
              }
            }
         }
      }
   } 
   // console.log('varCode',varCode);
   // console.log('eid', eid);
   if(varCode!="" ){
      getTime(varCode);
    }
}

getProdFS();
/*
function getPostdataFS(){

  if(getPID()!=""){
    prodName =  getProd();
    switch(getPID()){
     case "MOBF28FTKDWY5EHE":
     varCode = "f118";
     eid = "LSTMOBF28FTKDWY5EHEWLTAYU";
     break;

     case "MOBF28FTVG9GMYQM":
     varCode = "f117";
     eid = "LSTMOBF28FTVG9GMYQMJIDQXI";
     break;

     case "TVSF2BVARHHNNGZG":
     varCode = "f116";
     eid = "LSTTVSF2BVARHHNNGZGF45N0U";
     break;

     case "MOBF28FTQPHUPX83":
     varCode = "f115";
     eid = "LSTMOBF28FTQPHUPX83BUJJ2C";
     break;

     case "MOBF28FTHZYYGXFY":
     varCode = "f114";
     eid = "LSTMOBF28FTHZYYGXFYWCJUUS";
     break;

     case "MOBF28FTXZYZ6UYJ":
     varCode = "f113";
     eid = "LSTMOBF28FTXZYZ6UYJSQJJLU";
     break;

     case "MOBF28FTGXFYNXX2":
     varCode = "f112";
     eid = "LSTMOBF28FTGXFYNXX2RKBHLZ";

     break;

     case "MOBF28FTHEP6NDYB": 
     varCode = "f111";
     eid = "LSTMOBF28FTHEP6NDYBDVDLFX";
     break;

     case "MOBF28FTQYA9BFW5":
     varCode = "f110";
     eid = "LSTMOBF28FTQYA9BFW5XJRGOI";
     break;
   }
 }
 else{
  setTimeout(getPostdataFS, 200);
}
return eid;
}
//getPostdataFS();

if(varCode!=""){
  console.log('i am called');
  getTime(varCode);
}*/

function getTime(varCode){
  var jsonArr = [{'sendStartTime': varCode}];
  jsonArr = JSON.stringify(jsonArr);
  var passBack = {};
  passBack['code'] = varCode;
  passBack = JSON.stringify(passBack);
  // console.log('i am passback ', passBack);
  sendMessage(0, jsonArr, 0, startAutoBook, passBack);
}

var refreshedOnce = 0;

function post(path, params, method) {
  // console.log('posttt');
  // console.log(params);
  localStorage.bookingStarted = 1;
  localStorage.bookingTime = parseInt(Date.now()/1000);
  method = method || "post"; 
  var form = document.createElement("form");
  form.setAttribute("method", method);
  form.setAttribute("action", path);

  for(var key in params) {
    if(params.hasOwnProperty(key)) {
      var hiddenField = document.createElement("input");
      hiddenField.setAttribute("type", "hidden");
      hiddenField.setAttribute("name", key);
      hiddenField.setAttribute("value", params[key]);

      form.appendChild(hiddenField);
    }
  }

  document.body.appendChild(form);
  form.submit();

}

function PostData() {
  var data = {};
   data['cartRequest'] = {};
   data['checkoutType'] = "PHYSICAL";
   data['cartRequest']['cartContext'] = {};
   data['cartRequest']['cartContext'] [eid] = {};
   data['cartRequest']['cartContext'] [eid]['quantity'] = 1;
   data = JSON.stringify(data);
   localStorage.bookingStarted = 1;
   localStorage.bookingTime = parseInt(Date.now()/1000);
   //console.log('wanna see me',data);
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
 if (this.readyState === 4) {
  //console.log(xhr.response);
  var jsonResponse = JSON.parse(xhr.response);
   // console.log(jsonResponse['STATUS_CODE']);
   if(jsonResponse['STATUS_CODE'] >= 400 ){
        checkForOOS(); 
   }
   else{
      window.location.href="https://www.flipkart.com/checkout/init";
   }

 }
});

xhr.open("POST", "https://www.flipkart.com/api/5/checkout?loginFlow=false");
xhr.setRequestHeader("x-user-agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36 FKUA/website/41/website/Desktop");
xhr.setRequestHeader("origin", "https://www.flipkart.com");
xhr.setRequestHeader("user-agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36");
xhr.setRequestHeader("content-type", "application/json");
xhr.setRequestHeader("accept", "*/*");
//xhr.setRequestHeader("referer", "https://www.flipkart.com/redmi-note-5-pro-black-64-gb/p/itmf2fc3xgmxnhpx?pid=MOBF28FTQPHUPX83&srno=s_1_1&otracker=AS_QueryStore_OrganicAutoSuggest_0_5&lid=LSTMOBF28FTQPHUPX83BUJJ2C&fm=SEARCH&iid=1871f693-71bd-4f01-999a-165709938839.MOBF28FTQPHUPX83.SEARCH&ppt=Homepage&ppn=Homepage&ssid=oua1vpz8qo0000001544526814703&qH=286b43aac83aafdc");
xhr.setRequestHeader("accept-encoding", "gzip, deflate, br");
xhr.setRequestHeader("accept-language", "en-US,en;q=0.9,hi;q=0.8");
//xhr.setRequestHeader("cookie", "s_ch_list=%5B%5B%27Internal%2520Originated%27%2C%271500820770668%27%5D%5D; __utma=19769839.2071629750.1497442361.1499683767.1500820771.4; bhInfV_cl_id=McXUpiQOSYh3EnDJHq1pnnSM1NdTyQi7hHwn1MwlneD4ZXUClw; T=TI149621904419030734705882866718619415845526760505360718995429596581; _ga=GA1.2.2071629750.1497442361; AMCV_55CFEDA0570C3FA17F000101%40AdobeOrg=-227196251%7CMCIDTS%7C17568%7CMCMID%7C04640763384351710486542386115108583029%7CMCOPTOUT-1517839161s%7CNONE%7CMCAID%7C2CA1C65505037DB2-40001197E0005697; s_nr=1517831961409-New; _mkto_trk=id:021-QVV-957&token:_mch-flipkart.com-1517831961682-31403; VID=2.VI3F7C7AA7B47F49839BA8AA5F89AA26DE.1536309936.VS153630993675532738728; NSID=2.SI72BDAFFA4B94404DBBDE6112FE8D5CC1.1536309936.VI3F7C7AA7B47F49839BA8AA5F89AA26DE; AMCVS_17EB401053DAF4840A490D4C%40AdobeOrg=1; s_cc=true; ext_name=ancenpcmddjhpljoemneakililnfnbin; JSESSIONID=18jmnpdcz16vf1m7hvddy5nclv; AMCV_17EB401053DAF4840A490D4C%40AdobeOrg=-227196251%7CMCIDTS%7C17877%7CMCMID%7C30101258090266350023885010077720849622%7CMCAAMLH-1544641259%7C3%7CMCAAMB-1545131586%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1544533986s%7CNONE%7CMCAID%7CNONE; SN=2.VI3F7C7AA7B47F49839BA8AA5F89AA26DE.SI72BDAFFA4B94404DBBDE6112FE8D5CC1.VS153630993675532738728.1544526816; S=d1t16HT8/MBo/P1g/RA4XPz8/E2VLFiuc8NtYP3oRMuXmwGhIhLFPRhPdTMAtvDXrt6R6WBRfMaIvkX2qXdZZBO6ymQ==; gpv_pn=Mobile%3ARedmi%20Note%205%20Pro%20%28Black%2C%2064%20GB%29; gpv_pn_t=FLIPKART%3AProduct%20Page; s_sq=flipkart-prd%3D%2526pid%253DMobile%25253ARedmi%252520Note%2525205%252520Pro%252520%252528Black%25252C%25252064%252520GB%252529%2526pidt%253D1%2526oid%253Dfunction%252528%252529%25257B%25257D%2526oidt%253D2%2526ot%253DBUTTON");
xhr.setRequestHeader("cache-control", "no-cache");

xhr.send(data);
  
}

function addToCart(){
  if(eid != ""){
    //console.log('i am heree for adding to cart');
    PostData();
    //requestPayloadFS(eid);
  }
else{
  setTimeout(addToCart, 300);
}
}


function startSale(){
  if(!document.getElementById('pop-alert-ams')){
    $('body').append('<div id="pop-alert-ams" class="hk-green" style="display:block;height:150px!important;"><div id="p-logo"><img src="' + imgLogo + '"></div><div id="p-msg"><a target="_blank" style="text-decoration:none;color:white;font-size:14px;font-family:calibri" href="https://compare.buyhatke.com/options/#mi-details"><p>We will add ' + prodName + ' to the cart as soon as it is available for sale. Make sure you system timing is correct. Match it with http://bit.ly/2sEtPIP <br>Time Remaining : <span id="ourTimer"></span></a></p></div></div></div>'); 
  }
  else {
    $('#pop-alert-ams').html('<div id="p-logo"><img src="' + imgLogo + '"></div><div id="p-msg"><a target="_blank" style="text-decoration:none;color:white;font-size:14px;font-family:calibri" href="https://compare.buyhatke.com/options/#mi-details"><p>We will add ' + prodName + ' to the cart as soon as it is available for sale. Make sure you system timing is correct. Match it with http://bit.ly/2sEtPIP <br>Time Remaining : <span id="ourTimer"></span></a></p></div></div>');
  }
  // console.log('i m here');
  timer = setInterval(function(){
    var timeRemaining = Math.floor(Date.now() / 1000) - saleTime;
    if((timeRemaining >= 0 && timeRemaining < 3600) || 1){
     addToCart();
     // console.log('hyyy');
     clearInterval(timer);
     if(localStorage[varCode]==undefined){
       localStorage[varCode] =1;
     }
     else {
       localStorage[varCode] = 1 + parseInt(localStorage[varCode]);
     }
   }
   else {
    timeRemaining = -1*timeRemaining;
    if(timeRemaining < 3 && refreshedOnce==0){

    }
    var hours = Math.floor(timeRemaining/3600);
    var remTime = timeRemaining - hours*3600;
    var minRemain = Math.floor(remTime/60);
    remTime = remTime - minRemain*60;
    if(hours < 10){
     hours = '0' + hours;
   }
   if(minRemain < 10){
     minRemain = '0' + minRemain;
   }
   if(remTime < 10){
     remTime = '0' + remTime;
   }
   document.getElementById('ourTimer').innerText = hours + ":" + minRemain + ":" + remTime;
 }
},200);  
}

function startAutoBook(data, passBack){
	// console.log("Data Received " + data);
	// console.log("eid "+eid);
  // data = 1499086086;
  saleTime = data - 10;
  if(data!=0){
		// passBack = JSON.parse(passBack);
		var currentTime = Math.floor(Date.now() / 1000);
		if(data - currentTime > 3600){
			  // More than 1 hr. Ask to subscribe/check already subscribed
			 // sale over - nothing to do 
			 // console.log("Case 1");
			 checkSubscription(passBack);
      }
      else if(data - currentTime > 0 || (currentTime - data > 0 && currentTime - data < 3600) || 1){

       // console.log("Case 2");
			  //  Ask for variant. Focus on sale
        if(localStorage[varCode]==undefined || localStorage[varCode]<=10){
         // console.log('lalalala');
         startSale();
       }
     }
     else if(currentTime - data >0){
			 // sale over - nothing to do 
			 // console.log("Case 3");
			 // checkSubscription(passBack);
      }
    }
  }

  function timeConverter(t) {     
   var a = new Date(t * 1000);
   var today = new Date();
   var yesterday = new Date(Date.now() - 86400000);
   var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
   var year = a.getFullYear();
   var month = months[a.getMonth()];
   var date = a.getDate();
   var hour = a.getHours();
   var min = a.getMinutes();
   if(min<10){
     min = '0' + min;
   }
   if(hour >=12){
     var last = "PM";
   }
   else {
     var last = "AM";
   }
   if (a.setHours(0,0,0,0) == today.setHours(0,0,0,0))
    return 'today, ' + hour + ':' + min + " " + last;
  else if (a.setHours(0,0,0,0) == yesterday.setHours(0,0,0,0))
    return 'yesterday, ' + hour + ':' + min + " " + last;
  else if (year == today.getFullYear())
    return date + ' ' + month + ', ' + hour + ':' + min + " " + last;
  else
    return date + ' ' + month + ' ' + year + ', ' + hour + ':' + min + " " + last;
}

function checkSubscription(passBack){
	var passBack = JSON.parse(passBack);
  // console.log('here', passBack );
  var jsonArr = [{'checkSubscription': passBack.code}];
  jsonArr = JSON.stringify(jsonArr);
  var passBack = [];
  passBack = JSON.stringify(passBack);
  sendMessage(0, jsonArr, 0, showSubsMessage, passBack);
}


function showSubsMessage(data, passBack){
	if(data==1){
      // console.log("FOund subscribed");
      if(!document.getElementById('pop-alert-ams')){
        $('body').append('<div id="pop-alert-ams" class="hk-green" style="display:block;height:120px!important;color:white;font-size:1em;font-family:calibri"><a target="_blank" style="text-decoration:none;color:white;font-size:1em;font-family:calibri" href="https://compare.buyhatke.com/options/#mi-details"><div id="p-logo"><img src="' + imgLogo + '"></div><div id="p-msg"><p>You are subscribed to ' + prodName + ' Flash Sale starting  ' + timeConverter(saleTime) + '.&nbsp;&nbsp;<br> We will open the page automatically at sale time and book it for you.</p></div></div></a></div>');
      }
      else {
        $('#pop-alert-ams').html('<a target="_blank" style="text-decoration:none;color:white;font-size:1em;font-family:calibri" href="https://compare.buyhatke.com/options/#mi-details"><div id="p-logo"><img src="' + imgLogo + '"></div><div id="p-msg"><p>You are subscribed to ' + prodName + ' Flash Sale starting  ' + timeConverter(saleTime) + '.&nbsp;&nbsp;<br> We will open the page automatically at sale time and book it for you.</p></div></div></a>');
      }
    }
    else {
	  // console.log("Found unsuscribed");
	  // a = "what about this";
    if(!document.getElementById('pop-alert-ams')){
     $('body').append('<div id="pop-alert-ams" class="hk-green" style="display:block;height:180px!important;color:white;font-size:1em;font-family:calibri"><div id="p-logo"><img src="' + imgLogo + '"></div><div id="p-msg"><a id="subscribeNow" target="_blank" style="text-decoration:none;color:white;font-size:1em;font-family:calibri" href="https://compare.buyhatke.com/options/#mi-details"><p>Click me to subscribe to autobook ' + prodName + ' during flash Sale starting  ' + timeConverter(saleTime) + '.&nbsp;&nbsp;<br> We will open the page automatically at sale time and book it for you.</p></a><a href="http://bit.ly/2sjz41k" style="text-decoration:none;color:white;font-size:13px;font-family:calibri" target="_blank">Now that I have got your attention, why not let us know how we can improve your shopping experience. Tap here to rate us.  </a></div></div></div>');
   }
   else {
     $('#pop-alert-ams').html('<a id="subscribeNow" target="_blank" style="text-decoration:none;color:white;font-size:1em;font-family:calibri" href="https://compare.buyhatke.com/options/#mi-details"><div id="p-logo"><img src="' + imgLogo + '"></div><div id="p-msg"><p>Click me to subscribe to autobook ' + prodName + ' during flash Sale starting  ' + timeConverter(saleTime) + '.&nbsp;&nbsp;<br> We will open the page automatically at sale time and book it for you.</p></div></div></a>');
   }
 }
}



