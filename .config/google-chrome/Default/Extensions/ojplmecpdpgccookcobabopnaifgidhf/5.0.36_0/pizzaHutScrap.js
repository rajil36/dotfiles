

var arrayMsg = [];
function getPos(){
  return 1353;
}
var cur_url = window.location.href;


function checkIcon(){

if(cur_url.split("online.pizzahut.co.in/products?category").length > 1 ){
  if($(".promotion-button").length > 0 && $("#couponClick").length == 0){
    var selectorACIcon = ".promotion-button:eq(0)";
    var position = "before";
    var parent = "none";
    var method = "POST";
    var api = "https://online.pizzahut.co.in/api/cart//coupons/**?langCode=en";

    
     var postFields = {};


   // var postFields = {"voucher_code": "**", "paymentmethod": "cod" };
    var details = [{'postFields': postFields, "api": api, "method": method, "api_case": 1,"site":1353}];
    details = JSON.stringify(details);
    arrayMsg = [];
    displayACIcon(selectorACIcon, parent, position, 1353, details);
    keepCheckingACIcon(selectorACIcon, parent, position, 1353, details);
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
  var couponAt = 1353;
  var csaving = 0;
  var ecashing = 0;
  var savingsObject = {};
  nowCode = code;
  
   if(typeof(resp) == "object" && code != "" && resp.status.code == 200){
    
      var x = resp.body.PromotionDiscount;

      csaving = x;
      
          if(isNaN(csaving)){
            csaving = 0
          }
          else if(csaving > bestSaving){
            bestSaving = csaving;
            bestCoupon = code;
          }
          //console.log("csaving",csaving);
          // displayEachSavings(csaving);
          // cpnMsg = "SUCCESS";
          // if(resp.message){
          //   cpnMsg = resp.message;
          //   console.log("my cpnmsg", cpnMsg);
          //   console.log("for"+ code.trim()+ "message is"+cpnMsg);
          // }
          // arrayMsg.push([code, encodeURIComponent(cpnMsg), couponAt ]);
          // console.log("code: "+nowCode+" nowSaving "+nowSaving);
        
      
    }

    cpnMsg = "SUCCESS";
    if(resp.responseText != undefined){
      cpnMsg = (resp.responseText);
    }
    arrayMsg.push([code, encodeURIComponent(cpnMsg), couponAt ]);

  
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
    
   

         displayFinalSavings();
         displayFinalCouponCopy();

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
      if(typeof bestCoupon != "undefined" && bestCoupon != ""){
        arrayMsg.push([bestCoupon, "Success", 1353, 1]);
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


 