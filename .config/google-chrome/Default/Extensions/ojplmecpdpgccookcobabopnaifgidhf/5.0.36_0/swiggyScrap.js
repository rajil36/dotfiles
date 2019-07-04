/*var arrayMsg = [];
function getPos(){
  return 1822;
}
if(!localStorage.savings){
  localStorage.savings = "";
}
if(!localStorage.bestSaving){
  localStorage.bestSaving = 0;
}
if(!localStorage.bestCoupon){
  localStorage.bestCoupon = "";
}
var cur_url = window.location.href;
if(cur_url.split(".swiggy.com/checkout").length > 1){
  if($(".add-coupon").length > 0 && $("#couponClick").length == 0){
    var selectorACIcon = ".add-coupon:eq(0)";
    var position = "after";
    var parent = "none";
    var method = "POST";
    var api = "https://www.swiggy.com/api/cart/update";
    var postFields = {};
    var details = [{'postFields': postFields, "api": api, "method": method, "api_case": 1, "site": 1822}];
    details = JSON.stringify(details);
    arrayMsg = [];
    // localStorage.swiggyPostFields = createData();
    getCartData().then(function(args){
      if(localStorage.cartData && (localStorage.cartData).trim() != ""){
        var cart = {};
        var cartData = localStorage.cartData;
        cartData = JSON.parse(cartData);
        if(!cartData.cartItems || !cartData.cartItems[0].name){
          cartData.cartItems = JSON.parse(args);
        }
        cartData = JSON.stringify(cartData);
        var csrf = $("body").html().split('App.csrfToken ');
        csrf = csrf[1];
        csrf = csrf.split(";");
        csrf = csrf[0];
        csrf = csrf.split('=');
        csrf = csrf[1];
        csrf = csrf.split('"');
        csrf = csrf[1];
        csrf = csrf.trim();
        cart = {"cart": JSON.parse(cartData), "_csrf": csrf};
        localStorage.swiggyPostFields = JSON.stringify(cart);
        return JSON.stringify(cart);
      }
      else{
        setTimeout(createData, 500);
      }
    });
    if(localStorage.showFinalSavings && localStorage.showFinalSavings == 1){
      displayFinalSavings();
      $(".hk-aCoup__netSavings b:eq(0)").text(localStorage.bestSaving);
      $(".hk-js-autoCoup__bestCouponTill").text(localStorage.bestCoupon.toUpperCase());
      if($("#order-coupon").length > 0 && $(".apply-coupon").length > 0 && $(".final-total:eq(0) .coupon-code").length == 0){
        $("#order-coupon").val(localStorage.bestCoupon.trim());
      }
    }
    displayACIcon(selectorACIcon, parent, position, 1822, details);
    if($("#couponClick").length > 0){
      $("#couponClick").css("float", "right");
      $("#couponClick").css("margin-top", "-45px");
    }
  }
}

savings = [];
bestSaving = 0;
bestCoupon = "";
localStorage.swiggyPostFields = "";

function getCartData(){
  return new Promise(function(resolve, reject){
    $.get("https://www.swiggy.com/api/cart")
    .success(function(dataSwig){
      if(dataSwig.data && dataSwig.data != null){
        dataSwig = dataSwig.data.cart_menu_items;
      }
      else{
        dataSwig = "";
      }
      resolve(JSON.stringify(dataSwig));
    })
    .fail(function(data){
      resolve("");
    });
  });
}



savings = [];
bestSaving = 0;
bestCoupon = "";
bestECoupon = "";
bestEcash = 0;

function startSaving(data){
  data = JSON.parse(data);
  var nowCode = "";
  var nowSaving = "";
  var resp = data[0].data;
  var code = data[0].code.trim();
  var csaving = 0;
  var ecashsaving = 0;
  nowCode = code;
  respYatra = resp;
  var savingsObject = {};
  if(resp != "" && code != ""){
    if(resp.data.coupon_code && resp.data.coupon_code.toUpperCase().trim() == code.toUpperCase().trim() && resp.data.coupon_discount_total){
      csaving = resp.data.coupon_discount_total;
      csaving = filter_price(csaving);
      if(isNaN(csaving)){
        csaving = 0
      }
      else if(csaving > bestSaving){
        bestSaving = csaving;
        bestCoupon = code;
        localStorage.bestSaving = bestSaving;
        localStorage.bestCoupon = code;
      }
      if(isNaN(ecashsaving)){
        ecashsaving = 0
      }
    }
    if(resp.data.coupon_error_message){
      cpnMsg = resp.data.coupon_error_message.trim();
      cpnMsg = cpnMsg.replace(/(<([^>]+)>)/ig,"");
      arrayMsg.push([code, encodeURIComponent(cpnMsg), 1822 ]);
    }
  }
  var savingsLen = savings.length;
  savingsObject["code"] = code;
  savingsObject["saving"] = csaving;
  savingsObject["ecash"] = ecashsaving;
  savings[savingsLen] = savingsObject;
  localStorage.savings = JSON.stringify(savings);
  displayEachCpnSaving(code, csaving, ecashsaving);
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
  else{
    displayAutoSaving(bestSaving);
  }
}
var deleteAC = 0;
var clickedRemove = 0;

function applyBestCoupon(){
  if((parseInt(bestSaving) != 0 && bestCoupon.trim() != "")){

   if($(".final-total").length > 0 && $(".final-total:eq(0) .coupon-code").length > 0 && $(".final-total:eq(0) .coupon-code:eq(0)").find(".icon-swgy-cross").length > 0 && clickedRemove == 0){
    clickedRemove = 1;
    document.getElementsByClassName("final-total")[0].getElementsByClassName("coupon-code")[0].getElementsByClassName("icon-swgy-cross")[0].click();
    applyBestCoupon();
  }
  else{
    var finalPostFieldSpcl = localStorage.swiggyPostFields;
    finalPostFieldSpcl = JSON.parse(finalPostFieldSpcl);
    finalPostFieldSpcl.cart.couponCode = bestCoupon;
    finalPostFieldSpcl = JSON.stringify(finalPostFieldSpcl);
    $.ajax({
      type: "POST",
      url: api,
      dataType: "json",
      data: finalPostFieldSpcl,
      contentType: "application/json"
    }).success(function(dataa){
     localStorage.showFinalSavings = 1;
     window.location.reload();
   });
  }
}
else{
  displayNoSavings();
}
if(deleteAC == 0){
  if(arrayMsg.length > 0 && arrayMsg.length != ""){
    arrayMsg = JSON.stringify(arrayMsg);
    var jsonArr = [{'cpn_msg': arrayMsg}];
    jsonArr = JSON.stringify(jsonArr);
    deleteAC = 1;
    sendMessage(1, jsonArr, 12, doNothing, []);
    arrayMsg = [];
  }
}
}
*/


var cur_url = window.location.href;
function checkIcon(){

if(cur_url.split("swiggy.com/checkout").length > 1){
  
  //pickAppliedCpn(checkPick, selector, attr, webID, homeLink);
  //console.log("Hello out");

  if($("._2JQh7").length > 0 && $("#couponClick").length == 0){
  //  console.log("Hello");
    var selectorACIcon = "._2JQh7:eq(0)";
    var position = "after";
    var parent = "none";
    var method = "POST";
    
      var api = "https://www.swiggy.com/dapi/cart/applyCoupon";
    //  console.log("api",api);
        var postFields = {};

    var details = [{'postFields': postFields, "api": api, "method": method, "api_case": 1,"site":1822}];
    details = JSON.stringify(details);
    arrayMsg = [];

    displayACIcon(selectorACIcon, parent, position, 1822, details);
    keepCheckingACIcon(selectorACIcon, parent, position, 1822, details);
      
       
    
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
  //console.log("hello world",resp);
  var code = data[0].code.trim();
  var cpnMsg = "";
  var couponAt = 1822;
  var csaving = 0;
  var ecashing = 0;
  var savingsObject = {};
  nowCode = code;
  
  if(typeof(resp) == "object" && code != "" && resp.data && resp.data.cartMeta ){
    
                   if(resp.data && resp.data.cartMeta && resp.data.cartMeta.coupon_discount_total){
                   var x = resp.data.cartMeta.coupon_discount_total;
                   console.log("start saving", x);
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
          if(resp.data.cartMeta.coupon_error_message)
          {
            cpnMsg = resp.data.cartMeta.coupon_error_message;
          }
          if(resp.data.cartMeta.coupon_success_message){
            cpnMsg = resp.data.cartMeta.coupon_success_message;
          }
          console.log("code", code, cpnMsg);
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

       

       document.getElementsByClassName('_2aJip')[0].click();
      await sleep(4000);

        $('._381fS._1oTLG').val(bestCoupon.trim());
        displayFinalSavings();
  if(localStorage.retryPostLoad==1){
    bestCoupon = localStorage.bestCouponHere;
    bestSaving = localStorage.bestSavingHere;
  }
  var allowNow = 0;

  if($('.display--table-cell.vertical-align--middle') && $('.btn.btn--inverted.payment__promo-btn.display--table-cell.vertical-align--middle') && clickedRemove == 0){
      
      $('.btn.btn--inverted.payment__promo-btn.display--table-cell.vertical-align--middle').click();
      if($('.promo__remove-btn').length > 0){
      $('.promo__remove-btn').click();
      if($(".promo__form").length > 0 && $(".btn.promo-btn.promo-btn--inverted").length > 0){ 
      $('.promo__form input').val(bestCoupon.trim());
      displayFinalSavings();
      
            
    }
       
      
      clickedRemove = 1;
      localStorage.bestCouponHere = bestCoupon;
      localStorage.bestSavingHere = bestSaving;
    }
    }

  if(localStorage.retryPostLoad==1 || ( parseInt(bestSaving) != 0 && bestCoupon.trim() != "")){
    

      if($(".promo__form").length > 0 && $(".btn.promo-btn.promo-btn--inverted").length > 0){     
        $('.promo__form input').val(bestCoupon.trim());
        
        

        localStorage.retryPostLoad = 0;
        displayFinalSavings();
    if($(".payment__promo-container.payment__promo-bottom-margin").length > 0){
      /*if(mainClick < 5){*/
        
      }
      else{
        setTimeout(applyBestCoupon, 1000);
      }
    }
    else{
      if(timerStart > 7){
        localStorage.retryPostLoad = 1;
        //window.location.reload();
      }
      timerStart++;
      setTimeout(applyBestCoupon, 1000);
    }
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
        arrayMsg.push([bestCoupon, "Success", 1822, 1]);
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
  //applyBestCoupon();
}


