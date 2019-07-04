/*var s = document.createElement('script');
s.src = "https://ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular.min.js";
(document.head || document.documentElement).appendChild(s);
console.log("appended angular successfully");*/

var arrayMsg = [];
function getPos(){
	return 2268;
}
var cur_url = window.location.href;

if(cur_url.split(".bigbasket.com/co/checkout/").length > 1){
	if($(".input-group").length > 0 && $("#couponClick").length == 0){
		var selectorACIcon = ".input-group:eq(0)";
		var position = "after";
		var parent = "none";
		var method = "POST";
		var api = "https://www.bigbasket.com/order/apply-evoucher/";
		var postFields = {"voucher_code": "**", "paymentmethod": "cod" };
		var details = [{'postFields': postFields, "api": api, "method": method, "api_case": 1,"site":2268}];
		details = JSON.stringify(details);
		arrayMsg = [];
		displayACIcon(selectorACIcon, parent, position, 2268, details);
		keepCheckingACIcon(selectorACIcon, parent, position, 2268, details);
	}
}

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
	var couponAt = 2268;
	var csaving = 0;
	var ecashing = 0;
	var savingsObject = {};
	nowCode = code;
	
	 if(typeof(resp) == "object" && code != ""){
		
			var x = resp.result;
			//x.innerText();
			x = parseFloat(x);

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
					if(resp.message){
						cpnMsg = resp.message;
						cpnMsg = cpnMsg.trim();
					//	console.log("for"+ code.trim()+ "message is"+cpnMsg);
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
	angular.element(document.querySelector('[qa="enterCodeCKO"]')).val(bestCoupon.trim()).triggerHandler('input');
	displayFinalSavings();
	if(localStorage.retryPostLoad==1 || ( parseInt(bestSaving) != 0 && bestCoupon.trim() != "")){
		
		if($(".have-a-coupon").length > 0){
			if(mainClick < 5){
				mainClick++;
			}
		//	if($(".input-group").length > 0 && $(".input-group-btn").length > 0){
				/*$("#applyCoupon").val(bestCoupon.trim());*/
				//console.log("from apply best");
				//$('.input-group input').val(bestCoupon.trim());
			//	console.log(bestCoupon.trim(), "writing this thing in there");

								/*var s = document.createElement('script');
				// TODO: add "script.js" to web_accessible_resources in manifest.json
				s.src = chrome.extension.getURL('script.js');
				s.onload = function() {
				    this.remove();
				};
				(document.head || document.documentElement).appendChild(s);

				angular.element(document.querySelector('[qa="enterCodeCKO"]')).val(bestCoupon.trim());
				//document.querySelector('[qa="applyBtnCKO"]').click();*/
				//console.log("From best savings");
				 displayFinalSavings();
				/*$('.btn.btn-default.btn-voucher').click();*/
				localStorage.retryPostLoad = 0;
				//displayFinalSavings();
			//}
		/*	else{
				setTimeout(applyBestCoupon, 1000);
			}*/
		}
		/*else{
			if(timerStart > 7){
				localStorage.retryPostLoad = 1;
				window.location.reload();
			}
			timerStart++;
			setTimeout(applyBestCoupon, 1000);
		}*/
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
				arrayMsg.push([bestCoupon, "Success", 2268, 1]);
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


