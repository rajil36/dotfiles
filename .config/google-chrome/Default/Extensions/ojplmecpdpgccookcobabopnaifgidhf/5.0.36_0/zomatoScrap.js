

var arrayMsg = [];
function getPos(){
  return 2050;
}
var cur_url = window.location.href;
var zomaflag = cur_url.split("zomato.com").length;



function checkIcon(){

if(cur_url.split("/order/verify").length > 1 && zomaflag > 1){
  if($(".promo_section.pos-relative").length > 0 && $("#couponClick").length == 0){
    var selectorACIcon = ".promo_section.pos-relative:eq(0)";
    var position = "after";
    var parent = "none";
    var method = "POST";
    var api = "https://www.zomato.com/php/o2_handler.php";
    var order_items = JSON.parse(localStorage.getItem("zomatoOrder"));
    var user_dets = JSON.parse(localStorage.getItem("zomatoOrder_Address"));
    
     var postFields = {
    "address_id": user_dets.id,
    "card_bin": "",
    "case": "calculatecart",
    "csrfToken": $('#logout')[0].toString().split("ctoken=")[1], 
    "payment_method_id": "0",
    "payment_method_type": "card",
    "res_id": JSON.parse(localStorage.getItem("zomatoOrder_RES")),
    "user_id": user_dets.user_id,
    "voucher_code": "**"
    }

   

    for(var iter = 0; iter< order_items.length; iter++){
  
    postFields["order[dishes]["+iter+"][alwaysShowOnCheckout]"] = order_items[iter].alwaysShowOnCheckout;
    postFields["order[dishes]["+iter+"][bogoItemsCount]"] = order_items[iter].bogoItemsCount;
    postFields["order[dishes]["+iter+"][comment]"] = order_items[iter].comment;
    postFields["order[dishes]["+iter+"][duration_id]"] = order_items[iter].duration_id;
    postFields["order[dishes]["+iter+"][is_bogo_active]"] = order_items[iter].is_bogo_active;
    postFields["order[dishes]["+iter+"][item_id]"] = order_items[iter].item_id;
    postFields["order[dishes]["+iter+"][item_name]"] = order_items[iter].item_name;
    postFields["order[dishes]["+iter+"][mrp_item]"] = order_items[iter].mrp_item;
    postFields["order[dishes]["+iter+"][quantity]"] = order_items[iter].quantity;
    postFields["order[dishes]["+iter+"][tags]"] = order_items[iter].tags;
    postFields["order[dishes]["+iter+"][tax_inclusive]"] = order_items[iter].tax_inclusive;
    postFields["order[dishes]["+iter+"][total_cost]"] = order_items[iter].total_cost;
    postFields["order[dishes]["+iter+"][type]"] = order_items[iter].type;
    postFields["order[dishes]["+iter+"][unit_cost]"] = order_items[iter].unit_cost;

  
  
    
      }

   // var postFields = {"voucher_code": "**", "paymentmethod": "cod" };
    var details = [{'postFields': postFields, "api": api, "method": method, "api_case": 1,"site":2050}];
    details = JSON.stringify(details);
    arrayMsg = [];
    displayACIcon(selectorACIcon, parent, position, 2050, details);
    keepCheckingACIcon(selectorACIcon, parent, position, 2050, details);
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
  var couponAt = 2050;
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
        
      
    }

    cpnMsg = "SUCCESS";
    if(resp.message != undefined){
      cpnMsg = resp.message;
      cpnMsg = cpnMsg.trim();
      console.log("for"+ code.trim()+ "message is"+cpnMsg);
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
      if(typeof bestCoupon != "undefined" && bestCoupon != ""){
        arrayMsg.push([bestCoupon, "Success", 2050, 1]);
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


