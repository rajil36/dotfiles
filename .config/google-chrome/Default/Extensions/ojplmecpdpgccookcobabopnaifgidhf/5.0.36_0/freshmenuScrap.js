var cur_url = window.location.href;
function checkIcon(){

if(cur_url.split("freshmenu.com/checkout").length > 1){
  
  //pickAppliedCpn(checkPick, selector, attr, webID, homeLink);
  //

  //("Hello out");

  if( $('#hk-killerDIV').length > 0 ){
    $('#hk-killerDIV').remove();
  }

  if($(".fm-cash-b-cont.fm-cu-po").length > 0 && $("#couponClick").length == 0){
  //  console.log("Hello");
    var selectorACIcon = ".fm-cash-b-cont.fm-cu-po:eq(0)";
    var position = "after";
    var parent = "none";
    var method = "POST";
    
    var api = "https://www.freshmenu.com/api/cart/offerCode";
    var postFields = {};

    var details = [{'postFields': postFields, "api": api, "method": method, "api_case": 1,"site":2262}];
    details = JSON.stringify(details);
    arrayMsg = [];
    
        // if($('.payment__promo-container.payment__promo-bottom-margin')!=""){
        // console.log("12345");
    displayACIcon(selectorACIcon, parent, position, 2262, details);
    keepCheckingACIcon(selectorACIcon, parent, position, 2262, details);
      
       
    
  }
   
  else{
            setTimeout(checkIcon,500);
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
  //console.log("hello world",resp.cart);
 // console.log("this is my discoubt", resp.cart.offer.amount );
  var code = data[0].code.trim();
  var cpnMsg = "";
  var couponAt = 2262;
  var csaving = 0;
  var ecashing = 0;
  var savingsObject = {};
  nowCode = code;
  //console.log("111");
  if(typeof(resp) == "object" && code != "" /*&& resp.data && resp.data.cartMeta*/ ){
                     
                   if(resp.cart && resp.cart.offer && resp.cart.offer.amount){
                   var x = resp.cart.offer.amount;
                  // console.log("start saving", x);
                   x = parseFloat(x);
               }
               else{
                x = 0;
               }
          var csaving = x;
          csaving = filter_price(csaving);
          if(isNaN(csaving)){
            csaving = 0
          }
          else if(csaving > bestSaving){
            bestSaving = csaving;
            bestCoupon = code;
          }
          cpnMsg = "SUCCESS";
          arrayMsg.push([code, encodeURIComponent(cpnMsg), couponAt ]);

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
    }
  }
}

var mainClick = 0;
var clickedRemove = 0;
var deleteAC = 0;
var timerStart = 0;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function applyBestCoupon(){

        
         if( $('.fm-rem').length > 0){
          $('.fm-rem')[0].click();
         }




       if( $('.fm-cash-b-cont.fm-cu-po').length > 0 && bestCoupon.trim() != ""){
        
        $('.fm-cash-b-cont.fm-cu-po')[0].click();

        if($('.modal-title').length > 0){
         // console.log(" I didnt sleep yet");
          displayFinalCouponCopy();
          //angular.element(document.querySelector('[name="offerCode"]')).val(bestCoupon.trim()).triggerHandler('input');
          //$('.btn-apply.variant')[0].click();
      //    displayFinalSavings();

        }
      else{
         //setTimeout(applyBestCoupon, 1000);
         sleep(1500);
       //  console.log("after sleep");
           if($('.modal-title').length > 0){
            displayFinalCouponCopy();
       // angular.element(document.querySelector('[name="offerCode"]')).val(bestCoupon.trim()).triggerHandler('input');
       // $('.btn-apply.variant')[0].click();
     //   displayFinalSavings();
//
        }

      }

       }
       else{

        setTimeout(applyBestCoupon, 1000);

       }

  
  
}

if(localStorage.retryPostLoad==1){
  //applyBestCoupon();
}


