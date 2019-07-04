function dispAutoIcon(){

	if($(".applyPromoButton").length > 0){

		if($("#couponClick").length == 0){
			var selectorACIcon = ".applyPromoButton:eq(0)";
			var position = "after";
			var parent = "none";
			var method = "POST";
			if($(".checkout-shipping-saved-addresses").length > 0 && $(".checkout-shipping-saved-addresses").attr("search-pincode")){
				var pincode = $(".checkout-shipping-saved-addresses").attr("search-pincode");
			}
			else{
				var pincode = 560047;
			}
			if(getCookie("_bs")){
				var addressId = getCookie("_bs");
			}
			else {
				var addressId = "0efe196a-7393-494c-843a-d6acefdbf108";
			}
			if(localStorage.PaymentInfoData){
				var inform  = [];
				var info = localStorage.PaymentInfoData;
				info = JSON.parse(info);
				info = info.value;
				info = JSON.parse(info);
				info = info["products"];
				fin = 0;
				for(inf=0;inf<info.length;inf++){
					if(info[inf].skuId){
						if(info[inf].delivery && info[inf].delivery.deliveryType){
							var deliveryType = info[inf].delivery.deliveryType;
						}
						else{
							var deliveryType = "standard";
						}
						inform[fin] = {"skuId" : info[inf].skuId, "shippingMethod" : deliveryType};
						fin++;
					}
				}
			}
			else {
				var info = [];
			}
			var api = "https://api.nnnow.com/d/api/shipping/update/v3/"+pincode;
			var postFields = {"couponCode":"**","shippingMethods": JSON.stringify(inform),"addressId": addressId};
			var details = [{'postFields': postFields, "api": api, "method": method, "api_case": 1, "site": 2192}];
			details = JSON.stringify(details);
			arrayMsg = [];
		//	console.log("111");
		displayACIcon(selectorACIcon, parent, position, 2192, details);
		keepCheckingACIcon(selectorACIcon, parent, position, 2192, details);
	}
}
else{
	setTimeout(dispAutoIcon, 500);
}
}
// dispAutoIcon();

function createData(){
	var inform  = [];
	if(getCookie("_bs")){
		var addressId = getCookie("_bs");
	}
	else {
		var addressId = "0efe196a-7393-494c-843a-d6acefdbf108";
	}
	if(localStorage.PaymentInfoData){
		var info = localStorage.PaymentInfoData;
		info = JSON.parse(info);
		info = info.value;
		info = JSON.parse(info);
		info = info["products"];
		fin = 0;
		for(inf=0;inf<info.length;inf++){
			//console.log(info[inf]);
			if(info[inf].skuId){
				if(info[inf].delivery && info[inf].delivery.deliveryType){
					var deliveryType = info[inf].delivery.deliveryType;
				}
				else{
					var deliveryType = "standard";
				}
				inform[fin] = {"skuId" : info[inf].skuId, "shippingMethod" : deliveryType};
				fin++;
			}
		}
	}
	else {
		var info = [];
	}
	return JSON.stringify(inform)+"~*~"+addressId;
}

savings = [];
bestSaving = 0;
bestCoupon = "";
arrayMsg = [];
function startSaving(data){

	data = JSON.parse(data);
	var nowCode = "";
	var nowSaving = "";
	var resp = data[0].data;
	var code = data[0].code.trim();
	// console.log("these are my dets", code, resp);
	// console.log("also check this out", resp.data);
	// console.log("and this too", resp.data.overview.discounts);
	var cpnMsg = "";
	var couponAt = 2192;
	var csaving = 0;
	var ecashing = 0;
	var savingsObject = {};
	nowCode = code;
	//resp = JSON.parse(resp);


	//respYatra = resp;
	if(!resp.status){
		if(resp.message && resp.message){
			cpnMsg = resp.message.trim();
			cpnMsg = cpnMsg.replace(/(<([^>]+)>)/ig,"");
			arrayMsg.push([code, encodeURIComponent(cpnMsg), couponAt ]);
		}
    // console.log("code: "+nowCode+" nowSaving "+nowSaving);
}
else if(resp.data.overview && code != ""){
	if(resp.data.overview.discounts > 0){
		var csaving = resp.data.overview.discounts;
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
		if(localStorage.retryPostLoad==1){
			bestCoupon = localStorage.bestCouponHere;
			bestSaving = localStorage.bestSavingHere;
			$(".hdc-sav-amt").text(parseInt(bestSaving));
		}
		if($(".applyPromoButton").length > 0){
			document.getElementsByClassName("applyPromoButton")[0].click();


			if($("#input-coupon-text").length > 0 && $(".applyPromoButton").length > 0){
				angular.element(document.querySelector('[id="input-coupon-text"]')).val(bestCoupon.trim()).triggerHandler('input');
				angular.element(document.querySelector('[id="input-coupon-text"]'))[0].value = bestCoupon.trim();


	       //  console.log("just appplied it!");
	       $("#input-coupon-text").val(bestCoupon.trim());
	       document.getElementsByClassName("applyPromoButton")[0].click();
	       localStorage.retryPostLoad = 0;
	       displayFinalSavings();
	   }
	   else{
	   	setTimeout(applyBestCoupon, 1000);
	   }
	}
	else{
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








function getPos(){
	return 2192;
}
function sendPairs(){
	arrayToSend = [];
	if($('.nw-productlist-eachproduct').length > 0){
		var slider = $('.nw-productlist-eachproduct');
		var sliderLength = slider.length;
		var link = "";
		var price;
		var PID;
		var prod = "";
		var image = "";
		var oos = 0;
		for(i=0;i<sliderLength;i++){
			price = "";
			PID = "";
			prod = "";
			image = "";
			oos = 0;
			if($('.nw-productlist-eachproduct:eq('+ i +')').length > 0 && $('.nw-productlist-eachproduct:eq('+ i +') [itemprop="url"]')){
				link = $('.nw-productlist-eachproduct:eq('+ i +') [itemprop="url"]:eq(0)').text().trim();
				if(link != ""){
					if(link.split("nnnow.com").length < 2){
						link = "https://www.nnnow.com/"+link;
						link = link.split(".com//");
						link = link.join(".com/");
						PID = returnPID(link);
					}
					else{
						PID = returnPID(link);
					}
				}
				else{
					PID = "";
				}
			}
			if(PID != ""){
				if($('.nw-productlist-eachproduct:eq('+ i +')').find('.nw-productview-brandtxt').length > 0){
					prod = $('.nw-productlist-eachproduct:eq('+ i +')').find('.nw-productview-brandtxt:eq(0)').text().trim();

					if($('.nw-productlist-eachproduct:eq('+ i +')').find('.nw-productview-producttitle').length > 0){
						prod = prod + " " +$('.nw-productlist-eachproduct:eq('+ i +')').find('.nw-productview-producttitle:eq(0)').text().trim();
					}
					prod = prod.trim();

				}
				if($('.nw-productlist-eachproduct:eq('+ i +') [itemprop="image"]').length > 0){
					image = $('.nw-productlist-eachproduct:eq('+ i +') [itemprop="image"]:eq(0)').text().trim();
				}
				
				if($('.nw-productlist-eachproduct:eq('+ i +')').find('.nw-priceblock-sellingprice').length > 0){
					price = $('.nw-productlist-eachproduct:eq('+ i +')').find('.nw-priceblock-sellingprice:eq(0)').text();
					if(price.split(" - ").length > 1){
						price = price.split(" - ");
						price = price[0].trim();
					}
					price = filter_price(price);
				}

				if($('.nw-productlist-eachproduct:eq('+ i +')').find('.nw-productview-outofstock.nwc-hide').length == 0){
					oos1 = $('.nw-productlist-eachproduct:eq('+ i +')').find('.nw-productview-outofstock.nwc-hide:eq(0)').text();
					if(oos1.toUpperCase().split("OUT OF STOCK").length > 1){
						oos = 1;
					}
				}
			}
			else{
				price = "";
			}
			if(PID != "" && price != ""){
				arrayToSend.push([PID, price, prod, image, oos]);
			}

		}
	}

	if($('.nw-pdpcarouselitem').length > 0){
		var slider = $('.nw-pdpcarouselitem');
		var sliderLength = slider.length;
		var link = "";
		var price;
		var PID;
		var prod = "";
		var image = "";
		var oos = 0;
		for(i=0;i<sliderLength;i++){
			price = "";
			PID = "";
			prod = "";
			image = "";
			oos = 0;
			if($('.nw-pdpcarouselitem:eq('+ i +')').length > 0 && $('.nw-pdpcarouselitem:eq('+ i +') .nw-productview') && $('.nw-pdpcarouselitem:eq('+ i +') .nw-productview:eq(0)').attr("href")){
				link = $('.nw-pdpcarouselitem:eq('+ i +') .nw-productview:eq(0)').attr("href").trim();
				if(link != ""){
					if(link.split("nnnow.com").length < 2){
						link = "https://www.nnnow.com/"+link;
						link = link.split(".com//");
						link = link.join(".com/");
						PID = returnPID(link);
					}
					else{
						PID = returnPID(link);
					}
				}
				else{
					PID = "";
				}
			}
			if(PID != ""){
				if($('.nw-pdpcarouselitem:eq('+ i +')').find('.nw-productview-brandtxt').length > 0){
					prod = $('.nw-pdpcarouselitem:eq('+ i +')').find('.nw-productview-brandtxt:eq(0)').text().trim();

					if($('.nw-pdpcarouselitem:eq('+ i +')').find('.nw-productview-producttitle').length > 0){
						prod = prod + " " +$('.nw-pdpcarouselitem:eq('+ i +')').find('.nw-productview-producttitle:eq(0)').text().trim();
					}
					prod = prod.trim();

				}
				if($('.nw-pdpcarouselitem:eq('+ i +') .nw-productview-imgmain').length > 0 && $('.nw-pdpcarouselitem:eq('+ i +') .nw-productview-imgmain img').length > 0 && $('.nw-pdpcarouselitem:eq('+ i +') .nw-productview-imgmain').attr("src")){
					image = $('.nw-pdpcarouselitem:eq('+ i +') .nw-productview-imgmain:eq(0) img:eq(0)').attr("src").trim();
				}
				if(image == "" && $('.nw-pdpcarouselitem:eq('+ i +')').find('.nwc-hide').length > 1){
					var image1 = $('.nw-pdpcarouselitem:eq('+ i +')').find('.nwc-hide:eq(1)').text().trim();
					if(image1.split("jpg").length > 1 || image1.split("png").length > 1 || image1.split("jpeg").length > 1 ){
						image = image1;
					}
				}
				
				if($('.nw-pdpcarouselitem:eq('+ i +')').find('.nw-priceblock-sellingprice').length > 0){
					price = $('.nw-pdpcarouselitem:eq('+ i +')').find('.nw-priceblock-sellingprice:eq(0)').text();
					if(price.split(" - ").length > 1){
						price = price.split(" - ");
						price = price[0].trim();
					}
					price = filter_price(price);
				}

				if($('.nw-pdpcarouselitem:eq('+ i +')').find('.nw-productview-outofstock.nwc-hide').length == 0){
					oos1 = $('.nw-pdpcarouselitem:eq('+ i +')').find('.nw-productview-outofstock.nwc-hide:eq(0)').text();
					if(oos1.toUpperCase().split("OUT OF STOCK").length > 1){
						oos = 1;
					}
				}
			}
			else{
				price = "";
			}
			if(PID != "" && price != ""){
				arrayToSend.push([PID, price, prod, image, oos]);
			}

		}
	}
	if(arrayToSend.length > 0){
		arrayToSend = JSON.stringify(arrayToSend);
		var jsonArr = [{'pairsNNNow': arrayToSend}];
		jsonArr = JSON.stringify(jsonArr);
		sendMessage(0, jsonArr, 0, doNothing, []);  
	}
}

function sendCurrent(){
	curData = [];   
	var prod = getProd();
	var image = getImage();
	var myPrice = getPrice();
	var cur_url = window.location.href;
	var current_status = 0;
	var link = window.location.href;
	var PID = getPID();
	var breadcrumb_str = getBreadCrumb();
	var avail = getAvailability();
	if(avail == 0){
		current_status = 1;
	}
	else{
		current_status = 0;
	}

	curData.push([prod, image, myPrice, cur_url, current_status, PID, breadcrumb_str]);
	curData = JSON.stringify(curData);
	var jsonArr = [{'curDataNNNow': curData}];
	jsonArr = JSON.stringify(jsonArr);
	if($("#pdp-page").length > 0 || $(".nw-pdp-container").length > 0){
		sendMessage(0, jsonArr, 0, doNothing, []);
	}
}

var pollInterval = 1000 * 15;
window.setTimeout(sendCurrent, 5000);
window.setTimeout(sendPairs, 5000);
window.setTimeout(sendPairs, pollInterval);

//avail (1 = available, 0 = oos, -1 = permanently disconnected )
var check_prod_pg = 1;


function getProd(){
	var prod = "";
	var brand = "";
	if($("#pdp-page").length > 0){
		if($("#pdp-page:eq(0) .description").length > 0 && $("#pdp-page:eq(0) .description:eq(0) h1").length > 0){
			brand = $("#pdp-page:eq(0) .description:eq(0) h1:eq(0)").text().trim();
			if($("#pdp-page:eq(0) .description:eq(0) h1").length > 1){
				prod = $("#pdp-page:eq(0) .description:eq(0) h1:eq(1)").text().trim();
			}
		}
	}
	if(prod.trim() == ""){
		if($(".nw-product-brandtxt").length > 0){
			brand = $(".nw-product-brandtxt:eq(0)").text().trim();
		}
		if($(".nw-product-title").length > 0){
			prod = $(".nw-product-title:eq(0)").text().trim();
		}
	}

	if(brand != ""){
		prod = brand+" "+prod;
		prod = prod.trim();
	}
	if($("#pdp-page").length > 0 || $(".nw-pdp-container").length > 0){
		return prod;
	}
	else{
		return "";
	}
}

function getImage(){
	var image = "";
	if($('.primary-img-container').length > 0 && $('.primary-img-container:eq(0) .primary-img-img.zoom').length > 0){
		image = $('.primary-img-container:eq(0) .primary-img-img.zoom:eq(0)').attr("ng-src").trim();
	}
	else if($('#pdp-carousel').length > 0 && $('#pdp-carousel:eq(0) .nwc-img').length > 0){
		image = $('#pdp-carousel:eq(0) .nwc-img:eq(0)').attr("src").trim();
	}
	return image;
}

function getPrice(){
	price = "";
	if($('.price-container').length > 0 && $('.price-container:eq(0) .original-price').length > 0)
	{
		price = $('.price-container:eq(0) .original-price:eq(0)').text().trim();
	}
	else if($('.price-container').length > 0 && $('.price-container:eq(0) .price').length > 0)
	{
		price = $('.price-container:eq(0) .price:eq(0)').text().trim();
	}
	else if($('.nw-product-price').length > 0 && $('.nw-product-price:eq(0) .nw-priceblock-sellingprice').length > 0)
	{
		price = $('.nw-product-price:eq(0) .nw-priceblock-sellingprice:eq(0)').text().trim();
	}
	price = filter_price(price);
	if(isNaN(price)){
		price = 0;
	}
	return price;
}

function getAvailability(){
	var avail = 1;
	if($('.price-container:eq(0) .inStock').length > 0){
		avail = 1;
	}
	else if($('.info-panel:eq(0) .outofstock').length > 0){
		avail = 0;
	}
	else if($('.nw-product-stock').length > 0 && $('.nw-product-stock').text().toUpperCase().split("OUT OF STOCK").length > 1){
		avail = 0;
	}

	return avail;

}
function getPID(){

	var link = window.location.href;
	var pid = link;

	if(pid.split("#").length > 1){
		pid = pid.split("#")[0];
	}
	if(pid.split("&").length > 1){
		pid = pid.split("&")[0];
	}
	if(pid.split("?").length > 1){
		pid = pid.split("?")[0];
	}
	if(pid.split(".com/").length > 1){
		pid = pid.split(".com/");
		pid = pid[1];
		if(pid.split("/").length > 1){
			pid = pid.split("/");
			pid = pid[0];
		}
	}
	else{
		pid = "";
	}
	return pid;
}
function returnPID(link){

	var pid = link;
	if(pid.split("#").length > 1){
		pid = pid.split("#")[0];
	}
	if(pid.split("&").length > 1){
		pid = pid.split("&")[0];
	}
	if(pid.split("?").length > 1){
		pid = pid.split("?")[0];
	}
	if(pid.split(".com/").length > 1){
		pid = pid.split(".com/");
		pid = pid[1];
		if(pid.split("/").length > 1){
			pid = pid.split("/");
			pid = pid[0];
		}
	}
	else{
		pid = 0;
	}
	if(link.split('nnnow.com').length < 2){
		pid = 0;
	}
	if(link == ""){
		pid = 0;
	}
	return pid;
}

function getBreadCrumb(){
	var breadcrumb = "";
	var bread_final = "";
	var len_bread = $('.nw-breadcrumblist-item').length;

	for(var i=0;i<len_bread;i++){
		breadcrumb = $('.nw-breadcrumblist-item:eq('+ i +')').find('a:eq(0)').text().trim();
		bread_final += breadcrumb + "*~";
	}
	return bread_final;
}

function getCategory(){
	return "";
}



