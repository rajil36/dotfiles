var arrayMsg = [];
function getPos(){
  return 2057;
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

function createData(){
  var cart = JSON.parse(localStorage.cart);
  var cart_id = cart.id;
  var mappingdata = cart.items;
  var m = 0;
  var mapping = [];
  for(mapId in mappingdata){
    var item = mappingdata[mapId];
    mapping[m] = item.products;
    m++;
  }

  var items = [];
  m2 = 0;
  for(var m1=0;m1<mapping.length;m1++){
    var products = mapping[m1];
    for(prod in products){
      price_cart = products[prod].details.newPrice;
      quantity = products[prod].count;
      items[m2] = {"mapping_id" : prod, "price" : price_cart, "quantity" : quantity};
      m2++;
    }
  }

  var postFields = {
    "id": cart_id,
    "items": items,
    "promo_code": "**"
  };
  postFields = JSON.stringify(postFields);
  localStorage.grofersPostFields = postFields;
}

var cur_url = window.location.href;
function checkIcon(){



if(cur_url.split("grofers.com/checkout").length > 1){
  
  //pickAppliedCpn(checkPick, selector, attr, webID, homeLink);
  //console.log("Hello out");

  if($(".payment-invoice").length > 0 && $("#couponClick").length == 0){
  //  console.log("Hello");
    var selectorACIcon = ".payment-invoice:eq(0)";
    var position = "after";
    var parent = "none";
    var method = "POST";
    var cart = JSON.parse(localStorage.cart);
      var cart_id = cart.id;
      var api = "https://grofers.com/cart/"+cart_id+"/payments_and_offers/";
    //  console.log("api",api);
        var postFields = {};
        //var api = "https://grofers.com/v3/cart/"+cart_id;
    //var api = "https://www.jabong.com/cart/applycoupon/";//https://www.jabong.com/cart/applycoupon
    //var csrf = $("input[name='_csrf']").val().trim();
    //var postFields = {"couponcode": "**", "_csrf": encodeURIComponent(csrf)};
    //console.log("111");
    var details = [{'postFields': postFields, "api": api, "method": method, "api_case": 1,"site":2057}];
    details = JSON.stringify(details);
    arrayMsg = [];
    
        // if($('.payment__promo-container.payment__promo-bottom-margin')!=""){
       // console.log("12345");
    displayACIcon(selectorACIcon, parent, position, 2057, details);
    keepCheckingACIcon(selectorACIcon, parent, position, 2057, details);
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
  var couponAt = 2057;
  var csaving = 0;
  var ecashing = 0;
  var savingsObject = {};
  nowCode = code;
  
  if(typeof(resp) == "object" && code != "" && resp.offers && resp.offers.applied_promo.length > 0){
    
                  // console.log(resp.offers);
                   if(resp.offers.applied_promo[0].amount){
                   var x = resp.offers.applied_promo[0].amount;
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
          // displayEachSavings(csaving);
          cpnMsg = "SUCCESS";
          if(resp.offers.applied_promo[0].type == "invalid"){
            cpnMsg = resp.offers.applied_promo[0].message.trim();
            //console.log("for "+code.trim()+"message is "+cpnMsg);

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
      // setTimeout(function(){if(JSON.parse(features_json)[4]==0){ft(4);}},100);
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

  
     if($('.btn.btn--inverted.payment__promo-btn.display--table-cell.vertical-align--middle')){
        $('.btn.btn--inverted.payment__promo-btn.display--table-cell.vertical-align--middle').click();
        if($('.promo__remove-btn')){
          $('.promo__remove-btn').click();
          //console.log("from inside of edit the coupon");
          if($('.promo__form input')){
         // console.log("now writing to it");
              await sleep(3000);
          var x = $('.promo__form input');
          x.value = bestCoupon.trim();
          //console.log("now this is what I've written to it", x.value);
          displayFinalSavings();
        
          }
         
        //  console.log("hello from inside the cdit coupon");
        }
      }
    

    //console.log("1");
  if(localStorage.retryPostLoad==1){
    bestCoupon = localStorage.bestCouponHere;
    bestSaving = localStorage.bestSavingHere;
  }
  var allowNow = 0;
  //console.log("inside the apply best coupon 2");

  if($('.display--table-cell.vertical-align--middle') && $('.btn.btn--inverted.payment__promo-btn.display--table-cell.vertical-align--middle') && clickedRemove == 0){
      
      //console.log("inside the apply best coupon");
      $('.btn.btn--inverted.payment__promo-btn.display--table-cell.vertical-align--middle').click();
      if($('.promo__remove-btn').length > 0){
        //console.log("3");
      $('.promo__remove-btn').click();
      //console.log(bestCoupon.trim(), "edit");
      if($(".promo__form").length > 0 && $(".btn.promo-btn.promo-btn--inverted").length > 0){ 
      $('.promo__form input').val(bestCoupon.trim());
      displayFinalSavings();
      //return;
      
            
    }
       
      //$('.modal-close__btn').click();
      
      clickedRemove = 1;
      localStorage.bestCouponHere = bestCoupon;
      localStorage.bestSavingHere = bestSaving;
    }
    }

  if(localStorage.retryPostLoad==1 || ( parseInt(bestSaving) != 0 && bestCoupon.trim() != "")){
    
    
    if($('.payment__promo-container.payment__promo-bottom-margin')){
    document.getElementsByClassName("payment__promo-container payment__promo-bottom-margin")[0].click();
       }
        
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
      if(typeof bestCoupon != "undefined"){
        arrayMsg.push([bestCoupon, "Success", 2057, 1]);
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
