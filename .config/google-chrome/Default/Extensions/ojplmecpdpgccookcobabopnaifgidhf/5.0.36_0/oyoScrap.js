//console.log("inside my oyo");

var arrayMsg = [];
function getPos(){
  return 2256;
}
var cur_url = window.location.href;
var oyoflag = $('#js-valueAddons').length;


function checkIcon(){


  if($('#js-valueAddons').length > 0 && $("#couponClick").length == 0 && cur_url.split("oyorooms.com").length > 1){
  //  console.log("22", $('#js-valueAddons').length > 0 && $("#couponClick").length == 0 && cur_url.split("oyorooms.com").length > 1);
    var selectorACIcon = "#js-valueAddons:eq(0)";
    var position = "after";
    var parent = "none";
    var method = "POST";
    var api = "https://www.oyorooms.com/apply-coupon";

    
    var user = JSON.parse(localStorage.getItem("userQuery")).user;

    var postFields =   {
    "actualPrice": $('#js-total-price-inc-tax')[0].innerText,
    "actualPriceIncTax": $('#js-total-price-inc-tax')[0].innerText,
    "amount": ($('#manage-modal').next()[0].innerText.split("window.tariff")[1].split(",")[0].trim()).match(/\d+/g)[0],
    "amountExcTax": ($('#manage-modal').next()[0].innerText.split("window.tariff")[1].split(",")[0].trim()).match(/\d+/g)[0],
    "checkin": $('#js-checkin')[0].value,
    "checkout":$('#js-checkout')[0].value,
    "code": "**",
    "country_code": user.country_code,
    "guest_name": user.first_name,
    "guest_phone": user.phone,
    "hotel_id": ($('#manage-modal').next()[0].innerText.split("id:")[1].split(",")[0].trim()).match(/\d+/g)[0],
    "room_category_id": JSON.parse(localStorage.getItem("userQuery")).rooms,
    "room_count[]": [
      "1",
      "0",
      "0"
    ],
    "rooms": JSON.parse(localStorage.getItem("userQuery")).rooms,
    "slasherPriceIncludingTax": $('#js-bookingAmount')[0].innerText.trim()
  }
    
    //console.log("my obj", postFields);
    var details = [{'postFields': postFields, "api": api, "method": method, "api_case": 1,"site":2256}];
    details = JSON.stringify(details);
    arrayMsg = [];
    displayACIcon(selectorACIcon, parent, position, 2256, details);
    keepCheckingACIcon(selectorACIcon, parent, position, 2256, details);
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
  var couponAt = 2256;
  var csaving = 0;
  var ecashing = 0;
  var savingsObject = {};
  nowCode = code;


  // console.log("this is my obj", resp.response.discount);

  
   if(typeof(resp) == "object" && code != ""){


      try{
      var x = resp.response.discount; 

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
          cpnMsg = "SUCCESS";

          if(resp.response.error.message){
            cpnMsg = resp.response.error.message;
          }
          console.log("this is my cpnMsg", cpnMsg);
          arrayMsg.push([code, encodeURIComponent(cpnMsg), couponAt ]);
          // console.log("code: "+nowCode+" nowSaving "+nowSaving);
        }
        catch(err){
          //console.log("hii error");
        }
        
      
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
       
   //  console.log("my sa are", bestCoupon.trim());

    if($('#js-clear-applied-coupon').length > 0){
          $('#js-clear-applied-coupon')[0].click();
          if($('#js-apply-coupon').length > 0 && $('#js-booking-coupon-val').length > 0 ){
          $('#js-booking-coupon-val')[0].value = bestCoupon.trim();
          $('#js-apply-coupon')[0].click();
          displayFinalSavings();

           }
           else{
              setTimeout(applyBestCoupon, 1000);
           }

    }
    else{
      setTimeout(applyBestCoupon, 1000);
    }



    if($('#js-apply-coupon').length > 0 && $('#js-booking-coupon-val').length > 0 ){
      $('#js-booking-coupon-val')[0].value = bestCoupon.trim();
      $('#js-apply-coupon')[0].click();
      displayFinalSavings();

       }
       else{
          setTimeout(applyBestCoupon, 1000);
       }

    //document.getElementById('promo_code').value = bestCoupon.trim();

   // $('.ui.button')[2].click();

        
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
        arrayMsg.push([bestCoupon, "Success", 2256, 1]);
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


