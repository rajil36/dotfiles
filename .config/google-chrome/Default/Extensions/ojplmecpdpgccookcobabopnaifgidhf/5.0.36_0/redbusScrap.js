
var arrayMsg = [];
function getPos(){
  return 1290;
}
var cur_url = window.location.href;




function checkIcon(){

if(cur_url.split("redbus.in/Pay/PaymentDetails?OrderId").length > 1 ){
 // console.log("22", $('.offer-block.pass-wraper.clearfix').length > 0 , $("#couponClick").length == 0);
  if($('.offer-block.pass-wraper.clearfix').length > 0 && $("#couponClick").length == 0){

    
var p = document.getElementById('CashBackTemplateOtherCountry').nextElementSibling.nextElementSibling.innerHTML.trim().split("var offerRequired=")[0].trim()
var x = p.split("var s = JSON.stringify(")[1].slice(0, -2);
var obj = JSON.parse(x);


    var selectorACIcon = ".offer-block.pass-wraper.clearfix:eq(0)";
    var position = "after";
    var parent = "none";
    var method = "POST";
    var api = "https://www.redbus.in/Pay/OfferFareBreakup";

  var seat = "";
for(i=0; i< obj.Trips[0].PaxList.length; i++){
seat +=obj.Trips[0].PaxList[i].SeatNo;
}

  var postFields = {
    "DiscountComponent": "",
    "FareBreakUp[Onward][0][DisplayName]": obj.FareBreakUp.Onward[0].DisplayName,
    "FareBreakUp[Onward][0][Type]": obj.FareBreakUp.Onward[0].Type,
    "FareBreakUp[Onward][0][Value][amountDisp]": "",
    "FareBreakUp[Onward][0][Value][amount]": obj.FareBreakUp.Onward[0].Value.amount,
    "FareBreakUp[Onward][0][Value][currencyTypeDisp]": "",
    "FareBreakUp[Onward][0][Value][currencyType]": "INR",
    "FareBreakUp[Onward][1][DisplayName]": obj.FareBreakUp.Onward[1].DisplayName,
    "FareBreakUp[Onward][1][Type]": "SERVICE_TAX",
    "FareBreakUp[Onward][1][Value][amountDisp]": "",
    "FareBreakUp[Onward][1][Value][amount]": obj.FareBreakUp.Onward[1].Value.amount,
    "FareBreakUp[Onward][1][Value][currencyTypeDisp]": "",
    "FareBreakUp[Onward][1][Value][currencyType]": "INR",
    "FareBreakUp[Onward][2][DisplayName]": "Insurance",
    "FareBreakUp[Onward][2][Type]": "INSURANCE_CHARGES",
    "FareBreakUp[Onward][2][Value][amountDisp]": "",
    "FareBreakUp[Onward][2][Value][amount]": obj.FareBreakUp.Onward[2].Value.amount,
    "FareBreakUp[Onward][2][Value][currencyTypeDisp]": "",
    "FareBreakUp[Onward][2][Value][currencyType]": "INR",
    "FareBreakUp[RescheduleBreakUp]": "",
    "FareBreakUp[SubractionComponent]": "",
    "FareBreakUp[TotalTripFare][amountDisp]": "",
    "FareBreakUp[TotalTripFare][amount]": obj.FareBreakUp.TotalTripFare.amount,
    "FareBreakUp[TotalTripFare][currencyType]": "INR",
    "IsInsuranceSelected": "true",
    "IsWalletChecked": "false",
    "OfferRequest[ActualFare]": "",
    "OfferRequest[AdditionalVariables]": "",
    "OfferRequest[Amenities]": "",
    "OfferRequest[BUType]": obj.Trips[0].BusType, // obj.OfferRequest.BUType
    "OfferRequest[BaseFare]": "1250",            // obj.OfferRequest.BaseFare
    "OfferRequest[BoardingPointId]": obj.Trips[0].BPDetails.Id, // obj.OfferRequest.BoardingPointId
    "OfferRequest[CARDNO]": "",
    "OfferRequest[CartId]": "12389957920131330",  // obj.OfferRequest.CartId
    "OfferRequest[CashCouponCode]": "",
    "OfferRequest[Currency]": "INR",
    "OfferRequest[DateOfIssue]": "",
    "OfferRequest[DateOfReturn]": "",
    "OfferRequest[DateOfTravel]": obj.Trips[0].DateOfJourney,  // obj.OfferRequest.DateOfTravel
    "OfferRequest[DelType]": "",
    "OfferRequest[HD_CITY]": "",
    "OfferRequest[HD_CITY_AREA]": "",
    "OfferRequest[IsReturnTrip]": "false",  // obj.OfferRequest.IsReturnTrip
    "OfferRequest[NETBANKING_BANK]": "",
    "OfferRequest[NoOfTravellers]": obj.Trips[0].PaxList.length,   // from here
    "OfferRequest[NoOfUnits]": "1",
    "OfferRequest[OS]": "",
    "OfferRequest[OfferCode]": "**", // promocode
    "OfferRequest[OfferType]": "",
    "OfferRequest[OperatorId]": "3601",
    "OfferRequest[OperatorType]": "",
    "OfferRequest[PGType]": "",
    "OfferRequest[PaymentType]": "",
    "OfferRequest[RTOperatorId]": "",
    "OfferRequest[RemainingFare]": "",
    "OfferRequest[RouteId]": obj.Trips[0].RouteId,
    "OfferRequest[TIN]": "",
    "OfferRequest[TotalFare]": obj.Trips[0].Fare.amount,
    "OfferRequest[TransactionType]": "",
    "OfferRequest[Units]": seat,
    "OfferRequest[Version]": "",
    "OfferRequest[age]": obj.Trips[0].PaxList[0].Age,
    "OfferRequest[delcharges]": "",
    "OfferRequest[destinationId]": obj.Trips[0].DestinationId,
    "OfferRequest[emailId]": obj.Trips[0].EmailId,
    "OfferRequest[hash]": "",
    "OfferRequest[mobileNo]": obj.Trips[0].MobileNo,
    "OfferRequest[opRating]": "4.4",
    "OfferRequest[otp]": "",
    "OfferRequest[referralNo]": "",
    "OfferRequest[salesChannel]": obj.salesChannel,
    "OfferRequest[sortOrder]": "",
    "OfferRequest[sorting]": "",
    "OfferRequest[sourceId]": obj.Trips[0].SourceId,
    "OfferRequest[trafficSource]": "google / cpc / (not set)",
    "OfferRequest[userId]": "",
    "OrderId": obj.Orderdetails.OrderId
  }

   

   // var postFields = {"voucher_code": "**", "paymentmethod": "cod" };
    var details = [{'postFields': postFields, "api": api, "method": method, "api_case": 1,"site":1290}];
    details = JSON.stringify(details);
    arrayMsg = [];
    displayACIcon(selectorACIcon, parent, position, 1290, details);
    keepCheckingACIcon(selectorACIcon, parent, position, 1290, details);
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
  var couponAt = 1290;
  var csaving = 0;
  var ecashing = 0;
  var savingsObject = {};
  nowCode = code;
  
   if(typeof(resp) == "object" && code != "" && resp.offerResponse.status == "200"){
    
      var x = resp.offerResponse.data.Value;

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
          if(resp.offerResponse.data.Message){
            cpnMsg = resp.offerResponse.data.Message;
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
async function applyBestCoupon(){
  //angular.element(document.querySelector('[qa="enterCodeCKO"]')).val(bestCoupon.trim()).triggerHandler('input');
  displayFinalSavings();
  if(localStorage.retryPostLoad==1 || ( parseInt(bestSaving) != 0 && bestCoupon.trim() != "")){
    
    // if($(".have-a-coupon").length > 0){
    //   if(mainClick < 5){
    //     mainClick++;
    //   }
       

   await $('.custom-checkbox-rnd')[0].click();
   $('#offercode')[0].value = bestCoupon.trim();

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
        arrayMsg.push([bestCoupon, "Success", 1290, 1]);
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


