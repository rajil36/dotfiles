
console.log("coming inside of thissss");
var cur_url = window.location.href;

if(cur_url.split(".bigrock.in/checkout.php").length > 1){ // the url of the page where we want to display our ICON
	
    console.log("there you go!");
	if($(".cart-coupon-wrap").length > 0 && $("#couponClick").length == 0){ 
		var selectorACIcon = ".cart-coupon-wrap:eq(0)"; 
		var position = "after"; 
		var parent = "none";
		var method = "POST"; 
		var api = "https://www.bigrock.in/discount.php"; 
		var action = "apply";
		var domain ="";
		var goRhUe86a0 = "84d330f3ef712d8f608967a421f56c86";


		var postFields = {"action": action, "couponcode": "**", "domain":domain, "goRhUe86a0":goRhUe86a0 };
		var details = [{'postFields': postFields, "api": api, "method": method, "api_case": 1, "site": 21}]; 
		details = JSON.stringify(details);
		arrayMsg = [];
		displayACIcon(selectorACIcon, parent, position, 21, details); 
		console.log("done applying the coupon");
		keepCheckingACIcon(selectorACIcon, parent, position, 21, details);
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
	var code = data[0].code.trim();
	var cpnMsg = "";
	var couponAt = 50;
	var csaving = 0;
	var ecashing = 0;
	var savingsObject = {};
	nowCode = code;
	if(typeof(resp) == "object" && code != ""){
		if(resp.error){
			if(resp.msg && resp.msg.error){
				cpnMsg = resp.msg.error[0].trim();
				cpnMsg = cpnMsg.replace(/(<([^>]+)>)/ig,"");
				arrayMsg.push([code, encodeURIComponent(cpnMsg), couponAt ]);
			}
			// console.log("code: "+nowCode+" nowSaving "+nowSaving);
		}
	}
	else if(typeof(resp) == "string" && code != ""){
		wrapper= document.createElement('div');
		$(wrapper).html(resp);
		if($(wrapper).find(".summary-content").length > 0 && $(wrapper).find(".summary-content .left").length > 0){
			var divs = $(wrapper).find(".summary-content .left").length;
			for(var d=0;d<divs;d++){
				if($(wrapper).find(".summary-content .left:eq("+d+")").text().toLowerCase().split("coupon ").length > 1 || $(wrapper).find(".summary-content .left:eq("+d+")").text().trim() == "Coupon Discount"){
					var csaving = $(wrapper).find(".summary-content .right:eq("+d+") .standard-price:eq(0)").text().trim();
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
					arrayMsg.push([code, encodeURIComponent(cpnMsg), couponAt ]);
					// console.log("code: "+nowCode+" nowSaving "+nowSaving);
				}
			}
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
	if(localStorage.retryPostLoad==1){
		bestCoupon = localStorage.bestCouponHere;
		bestSaving = localStorage.bestSavingHere;
	}
	var allowNow = 0;
	if(localStorage.retryPostLoad==1 || ( parseInt(bestSaving) != 0 && bestCoupon.trim() != "")){
		if(document.getElementsByClassName("remove-coupon").length > 0 && clickedRemove == 0){
			document.getElementsByClassName("remove-coupon")[0].click();
			clickedRemove = 1;
			localStorage.bestCouponHere = bestCoupon;
			localStorage.bestSavingHere = bestSaving;
		}
		if(localStorage.retryPostLoad==1){
			bestCoupon = localStorage.bestCouponHere;
			bestSaving = localStorage.bestSavingHere;
			$(".hdc-sav-amt").text(parseInt(bestSaving));
		}
		if($(".have-a-coupon").length > 0){
			if(mainClick < 5){
				document.getElementsByClassName("have-a-coupon")[0].click();
				mainClick++;
			}
			if($("#applyCoupon").length > 0 && $(".apply-coupon-block:eq(0) .input-group-addon:eq(0)").length > 0){
				$("#applyCoupon").val(bestCoupon.trim());
				document.getElementsByClassName("apply-coupon-block")[0].getElementsByClassName("input-group-addon")[0].click();
				localStorage.retryPostLoad = 0;
				displayFinalSavings();
			}
			else{
				setTimeout(applyBestCoupon, 1000);
			}
		}
		else{
			if(timerStart > 7){
				localStorage.retryPostLoad = 1;
				window.location.reload();
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

