
var arrayMsg = [];
function getPos(){
  return 2261;
}
var cur_url = window.location.href;




function checkIcon(){

if(cur_url.split("abhibus.com/passengerinfo").length > 1 ){
  if($('#coupondiv').length > 0 && $("#couponClick").length == 0){


    var selectorACIcon = "#coupondiv:eq(0)";
    var position = "after";
    var parent = "none";
    var method = "POST";
    var api = "https://www.abhibus.com//coupon";

//   var seat = "";
// for(i=0; i< obj.Trips[0].PaxList.length; i++){
// seat +=obj.Trips[0].PaxList[i].SeatNo;
// }


var returned = "";
var onward = "";
var numpass = "";
var onwardfare = "";
var returnfare = "";
var Totfare = 0;
 try{
 returned = $('#rlt_rtn_meta')[0].value
}
catch(err){
  //console.log("no return");
}

 try{
  onward = $('#rlt_onw_meta')[0].value;
  }
catch(err){
  //console.log("no return");
}

try{
 numpass = $('[name="NumPass"]')[0].value

}
catch(err){
 // console.log("no return");
}

try{

 onwardfare = $('#hdnfare')[0].value;
 }
catch(err){
 // console.log("no return");
}

try{
 returnfare = $('#hdnrtn_fare')[0].value;
 }
catch(err){
 // console.log("no return");
  returnfare = 0;
}

try{
if(onwardfare!=null || onwardfare != undefined ){
Totfare += parseInt(onwardfare);
 //console.log("my Totfare1", Totfare);
}
}
catch(err){
  //console.log("no return");
}

try{
if(returnfare!=null || returnfare != undefined || returnfare !=0){
Totfare += parseInt(returnfare);
//console.log("my Totfare2", Totfare);

}
}
catch(err){
 // console.log("no return");
}
  var postFields = {
    "couponcode": "**",
    "returned": returned,
    "onward": onward,
    "numpass": numpass,
    "onwardfare": onwardfare,
    "returnfare": returnfare,
    "Totfare": Totfare
  }

  //console.log("my obj", postFields);

   

   // var postFields = {"voucher_code": "**", "paymentmethod": "cod" };
    var details = [{'postFields': postFields, "api": api, "method": method, "api_case": 1,"site":2261}];
    details = JSON.stringify(details);
    arrayMsg = [];
    displayACIcon(selectorACIcon, parent, position, 2261, details);
    keepCheckingACIcon(selectorACIcon, parent, position, 2261, details);
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
  var couponAt = 2261;
  var csaving = 0;
  var ecashing = 0;
  var savingsObject = {};
  nowCode = code;

  //console.log("now code", resp, typeof resp);
  
   if(typeof(resp) == "string" && code != ""){
    
    // console.log("coming in???", resp.includes("now code VALID##"), resp);
      if(resp.includes("VALID##")){
        //console.log("oh yhhh??");
        resp.split("now code VALID##");
        csaving = parseInt(resp.split("VALID##")[1].split("#")[0]);
       // console.log("my csaving", csaving);

      }
      

      // csaving = x;
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
          
          arrayMsg.push([code, encodeURIComponent(resp), couponAt ]);
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
       

   $('#couponcode')[0].value =  bestCoupon.trim();
   $('.btnab.pay')[0].click();

    if( document.getElementById('promo_code')){
    document.getElementById('promo_code').value = bestCoupon.trim();
    }

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
        arrayMsg.push([bestCoupon, "Success", 2261, 1]);
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


