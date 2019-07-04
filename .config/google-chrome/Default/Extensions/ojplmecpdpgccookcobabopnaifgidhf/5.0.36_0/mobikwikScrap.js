

var arrayMsg = [];
function getPos(){
  return 1820;
}
var cur_url = window.location.href;


function getdets(n){
    
    return new Promise(function(resolve, reject){

        var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://rapi.mobikwik.com/recharge/infobip/getconnectiondetails?cn="+n+"",
      "method": "GET",
      "headers": {
        "x-mclient": "0",
        "accept": "application/json, text/plain, */*",
        "origin": "https://www.mobikwik.com",
        "authorization": "/BcV/O61TzFE5LOIwD6lvA==.7ceicbl1gvnanpu1fnrilgjlpo",
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36",
        "dnt": "1",
        "referer": "https://www.mobikwik.com/",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "en-GB,en;q=0.9,en-US;q=0.8,ur;q=0.7",
        "cache-control": "no-cache",
        "postman-token": "7ff1deea-8846-e51b-927e-420d7ed683b2"
      }
    }
    console.log("b4 making the req");
    $.ajax(settings).done(function (response) {
      console.log(response);
      resolve(response.data);
     
    });






    })
  

}

console.log("inside mobikwik 111");
async function checkIcon(){

//console.log("inside mobikwik 222");

if(cur_url.split("mobikwik.com/dth").length > 1 || cur_url.split("mobikwik.com/mobile").length > 1 ){

//console.log("my vals", cur_url.split("mobikwik.com/dth").length > 1 || cur_url.split("mobikwik.com/mobile").length > 1, $(".col-md-12.ft13").length > 0);


  if($(".col-md-12.ft13").length > 0 && $("#couponClick").length == 0){

    console.log("insdie");
    var selectorACIcon = ".col-md-12.ft13:eq(0)";
    var position = "after";
    var parent = "none";
    var method = "POST";
    var api = "https://webapi.mobikwik.com/p/coupons/validate";
    var order_items = JSON.parse(localStorage.getItem("zomatoOrder"));
    var user_dets = JSON.parse(localStorage.getItem("zomatoOrder_Address"));

    var n = $('.col-md-6.ft13.tright')[0].innerText;
    let opId;
    let circleId;
    try{
    console.log("argument for getting circle and operator", n);
    let mydata = await getdets(n);
    console.log("this is my stuff", mydata, mydata.operatorId, mydata.circleId);
    opId = mydata.operatorId;
    circleId = mydata.circleId;
    console.log("changed now", opId, circleId);
    } 
    catch(err){
      opId = 1;
      circleId = 10;

    }
    let x = $('.col-md-6.ft13.tright').length - 2
    let amount = $('.col-md-6.ft13.tright')[x];
    
    var postFields = {
    "code":"**",
    "amount":parseInt(amount.innerText.match(/\d/g).join("")),
    "meta":{
    "beneficiaryNo":$('.col-md-6.ft13.tright')[0].innerText,
    "operator":opId,
    "circle":circleId
     }
    };
   

   // var postFields = {"voucher_code": "**", "paymentmethod": "cod" };
    var details = [{'postFields': postFields, "api": api, "method": method, "api_case": 1,"site":1820}];
    details = JSON.stringify(details);
    arrayMsg = [];
    displayACIcon(selectorACIcon, parent, position, 1820, details);
    keepCheckingACIcon(selectorACIcon, parent, position, 1820, details);
  }
  else{
    setTimeout(checkIcon, 500);
  }
}


}
checkIcon();

savings = [];
bestSaving = 0;
bestCoupon = "";
function startSaving(data){

  data = JSON.parse(data);
  var nowCode = "";
  var nowSaving = "";
  var resp = data[0].data;
  //console.log("hello world",resp);
  var code = data[0].code.trim();
  var cpnMsg = "";
  var couponAt = 1820;
  var csaving = 0;
  var ecashing = 0;
  var savingsObject = {};
  nowCode = code;
  
   if(typeof(resp) == "object" && code != "" && resp.status == "success"){
    
      var x = resp.order.items[2].item.unitCost;

      csaving = x;
     // console.log("this is my csaving", csaving);
      
          if(isNaN(csaving)){
            csaving = 0
          }
          else if(csaving > bestSaving){
            bestSaving = csaving;
            bestCoupon = code;
          }
          //console.log("csaving",csaving);
          // displayEachSavings(csaving);
          cpnMsg = "SUCCESS";
          if(resp.message){
            cpnMsg = resp.message;
            cpnMsg = cpnMsg.trim();
          //  console.log("for"+ code.trim()+ "message is"+cpnMsg);
          }
          arrayMsg.push([code, encodeURIComponent(cpnMsg), couponAt ]);
          // console.log("code: "+nowCode+" nowSaving "+nowSaving);
        
      
    }

  
  savingsLen = savings.length;
  savingsObject["code"] = code;
  savingsObject["saving"] = csaving;
  savingsObject["ecash"] = ecashing;
  savings[savingsLen] = savingsObject;
  localStorage.savings = JSON.stringify(savings);
  displayEachCpnSaving(code, csaving, ecashing);
  doneSavingCheck++;
  if(doneSavingCheckFn() == 1){
    applyBestCoupon();
    if(localStorage.anaSent!=1 && parseInt(bestSaving) != 0 && bestSaving!="" && !isNaN(parseInt(bestSaving))){
      localStorage.anaSent = 1;
      var host=window.location.host;
      var jsonArr = [{'type': 'finish1','website':host}];
      jsonArr = JSON.stringify(jsonArr);
      sendMessage(1, jsonArr,22,doNothing, []);
      tracer(1,4);
      setTimeout(function(){if(JSON.parse(features_json)[4]==0){ft(4);}},100);
    }
  }




}
var mainClick = 0;
var clickedRemove = 0;
var deleteAC = 0;
var timerStart = 0;
function applyBestCoupon(){
  //angular.element(document.querySelector('[qa="enterCodeCKO"]')).val(bestCoupon.trim()).triggerHandler('input');
  displayFinalSavings();
  if(localStorage.retryPostLoad==1 || ( parseInt(bestSaving) != 0 && bestCoupon.trim() != "")){
    
    // if($(".have-a-coupon").length > 0){
    //   if(mainClick < 5){
    //     mainClick++;
    //   }
       

    if(document.getElementsByClassName('promo_detail mt5 mr20') && document.getElementsByClassName('promo_detail mt5 mr20').length > 0 ){
    if(document.getElementsByClassName('promo_detail mt5 mr20')[0].textContent == "Applied successfully."){
      document.getElementsByClassName('ui button remove_promo')[0].click();
     }
    }
    document.getElementById('promo_code').value = bestCoupon.trim();

   // $('.ui.button')[2].click();

         displayFinalSavings();
        /*$('.btn.btn-default.btn-voucher').click();*/
   localStorage.retryPostLoad = 0;

    }

  else if(localStorage.retryPostLoad==1){
    setTimeout(applyBestCoupon, 1000);
  }
  else{
    displayNoSavings();
  }
  if(deleteAC == 0){
    if(arrayMsg.length > 0 && arrayMsg.length != ""){
      if(typeof bestCoupon != "undefined"){
        arrayMsg.push([bestCoupon, "Success", 1820, 1]);
      }
      arrayMsg = JSON.stringify(arrayMsg); // add arraymsg for delete coupon
      var jsonArr = [{'cpn_msg': arrayMsg}];
      jsonArr = JSON.stringify(jsonArr);
      deleteAC = 1;
      sendMessage(1, jsonArr, 12, doNothing, []);
      arrayMsg = [];
    }
  }
}

if(localStorage.retryPostLoad==1){
  applyBestCoupon();
}


