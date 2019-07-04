
var arrayMsg = [];
function getPos(){
  return 2265;
}
var cur_url = window.location.href;


function checkIcon(){

if(cur_url.split("checkout.firstcry").length > 1){
  if($('#divCoupon').length > 0 && $("#couponClick").length == 0){
    var selectorACIcon = "#divCoupon:eq(0)";
    var position = "after";
    var parent = "none";
    var method = "POST";
    var api = "https://checkout.firstcry.com/CartService/CheckoutService.svc/json/GetCart";

    var postFields = {};
     
    var details = [{'postFields': postFields, "api": api, "method": method, "api_case": 1,"site":2265}];
    details = JSON.stringify(details);
    arrayMsg = [];
    displayACIcon(selectorACIcon, parent, position, 2265, details);
    keepCheckingACIcon(selectorACIcon, parent, position, 2265, details);
    }
  }
  else{
    setTimeout(checkIcon, 500);
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
  var couponAt = 2265;
  var csaving = 0;
  var ecashing = 0;
  var savingsObject = {};
  nowCode = code;
  
   if(typeof(resp) == "object" && code != ""){

      let csaving = 0;
      for(let i=0; i < resp.GetCartResult.pOrderSummary.PurchaseOrderItemList.length; i++){

        if( resp.GetCartResult.pOrderSummary.PurchaseOrderItemList[i].AppliedOfferList != null ){
          csaving += resp.GetCartResult.pOrderSummary.PurchaseOrderItemList[i].AppliedOfferList[0].SavingValue;
        }

      }
     
      
          if(isNaN(csaving)){
            csaving = 0
          }
          else if(csaving > bestSaving){
            bestSaving = csaving;
            bestCoupon = code;
          }
          // displayEachSavings(csaving);
          cpnMsg = "SUCCESS";
          if(resp.GetCartResult.pOrderSummary.Coupons[0].Msg){
            cpnMsg = resp.GetCartResult.pOrderSummary.Coupons[0].Msg;
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
 // displayFinalSavings();
  if(localStorage.retryPostLoad==1 || ( parseInt(bestSaving) != 0 && bestCoupon.trim() != "")){
     

    if($('.fc_ckot_sp.btnla.btnl_a').length > 0){

      $('.fc_ckot_sp.btnla.btnl_a')[1].click();
      
      if($('#CouponCode').length > 0){
              $('#CouponCode')[0].value = bestCoupon;
              $('.ip_cp1')[0].click();
              displayFinalSavings();
      }
      else{

        setTimeout(applyBestCoupon, 500);
      }


    }
    else{
      setTimeout(applyBestCoupon, 500);
    }


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
        arrayMsg.push([bestCoupon, "Success", 2265, 1]);
      }
      arrayMsg = JSON.stringify(arrayMsg);
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


