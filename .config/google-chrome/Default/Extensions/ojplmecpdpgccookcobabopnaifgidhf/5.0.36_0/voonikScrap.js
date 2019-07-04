var arrayMsg = [];
function getPos(){
	return 2266;
}

function sendPairs(){
	arrayToSend = [];
	dropToSend = [];
	if($('.product-grid').length > 0){
		var slider = $('.product-grid');
		var sliderLength = slider.length;
		var link;
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
			if($('.product-grid:eq('+ i +') a').length > 0){
				link = $('.product-grid:eq('+ i +') a:eq(0)').attr('href');
				if(link == "javascript:void(0);" || link == ""){
					link = $('.product-grid:eq('+ i +') a:eq(1)').attr('href');
				}
				if(link == "javascript:void(0);" || link == ""){
					link = $('.product-grid:eq('+ i +') a:eq(2)').attr('href');
				}
				if(link != "" && link.split("voonik.com").length < 2){
					PID = link;
					PID = PID.split("recommendations/");
					PID = PID[1];
					PID = PID.trim()
				}
				else{
					PID = returnPID(link);
				}
			}
			if(PID != ""){
				if($('.product-grid:eq('+ i +')').find('a').length > 0 && $('.product-grid:eq('+ i +')').find('a:eq(0) img').length > 0 && $('.product-grid:eq('+ i +')').find('a:eq(0) img:eq(0)').attr("title")){
					prod = $('.product-grid:eq('+ i +')').find('a:eq(0) img:eq(0)').attr("title");
				}
				if($('.product-grid:eq('+ i +')').find('a').length > 0 && $('.product-grid:eq('+ i +')').find('a:eq(0) img').length > 0 && $('.product-grid:eq('+ i +')').find('a:eq(0) img:eq(0)').attr("src")){
					image = $('.product-grid:eq('+ i +')').find('a:eq(0) img:eq(0)').attr("src");
					if(image != "" && image.split("http").length < 2){
						image = "https:"+image;
					}
				}
				if($('.product-grid:eq('+ i +')').find('.product-info').length > 0 && $('.product-grid:eq('+ i +')').find('.product-info finalprice').length > 0){
					price = $('.product-grid:eq('+ i +')').find('.product-info:eq(0) finalprice:eq(0)').text();
					price = filter_price(price);
				}
			}

			else{
				price = "";
			}
			if(PID != "" && PID != "0" && PID != 0 && price != "" && price != 0 && !isNaN(price)){
				arrayToSend.push([PID, price, prod, image, oos]);
				dropToSend.push(PID);
			}

    } // for ends

}


if($('.grid-list li').length > 0){
	var slider = $('.grid-list li');
	var sliderLength = slider.length;
	var link;
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
		if($('.grid-list li:eq('+ i +') a').length > 0){
			link = $('.grid-list li:eq('+ i +') a:eq(0)').attr('href');
			if(link == "javascript:void(0);" || link == ""){
				link = $('.grid-list li:eq('+ i +') a:eq(1)').attr('href');
			}
			if(link == "javascript:void(0);" || link == ""){
				link = $('.grid-list li:eq('+ i +') a:eq(2)').attr('href');
			}
			if(link != "" && link.split("voonik.com").length < 2){
				PID = link;
				PID = PID.split("recommendations/");
				PID = PID[1];
				PID = PID.trim()
			}
			else{
				PID = returnPID(link);
			}
		}
		if(PID != ""){
			if($('.grid-list li:eq('+ i +')').find('a').length > 0 && $('.grid-list li:eq('+ i +')').find('a:eq(0) img').length > 0 && $('.grid-list li:eq('+ i +')').find('a:eq(0) img:eq(0)').attr("alt")){
				prod = $('.grid-list li:eq('+ i +')').find('a:eq(0) img:eq(0)').attr("alt");
			}
			else if($('.grid-list li:eq('+ i +')').find('a').length > 0 && $('.grid-list li:eq('+ i +')').find('a:eq(0) img').length > 0 && $('.grid-list li:eq('+ i +')').find('a:eq(0) img:eq(0)').attr("title")){
				prod = $('.grid-list li:eq('+ i +')').find('a:eq(0) img:eq(0)').attr("title");
			}
			if($('.grid-list li:eq('+ i +')').find('a').length > 0 && $('.grid-list li:eq('+ i +')').find('a:eq(0) img').length > 0 && $('.grid-list li:eq('+ i +')').find('a:eq(0) img:eq(0)').attr("src")){
				image = $('.grid-list li:eq('+ i +')').find('a:eq(0) img:eq(0)').attr("src");
				if(image != "" && image.split("http").length < 2){
					image = "https:"+image;
				}
			}
			if($('.grid-list li:eq('+ i +')').find('.item-price').length > 0 && $('.grid-list li:eq('+ i +')').find('.item-price .price').length > 0 && $('.grid-list li:eq('+ i +')').find('.item-price .price:eq(0) span').length > 1){
				price = $('.grid-list li:eq('+ i +')').find('.item-price:eq(0) .price:eq(0) span:eq(1)').text();
				price = filter_price(price);
			}
			else if($('.grid-list li:eq('+ i +')').find('.item-price').length > 0 && $('.grid-list li:eq('+ i +')').find('.item-price .price').length > 0 && $('.grid-list li:eq('+ i +')').find('.item-price .price:eq(0) span').length > 0){
				price = $('.grid-list li:eq('+ i +')').find('.item-price:eq(0) .price:eq(0) span').text();
				price = filter_price(price);
			}
		}

		else{
			price = "";
		}
		if(PID != "" && PID != "0" && PID != 0 && price != "" && price != 0 && !isNaN(price)){
			arrayToSend.push([PID, price, prod, image, oos]);
			dropToSend.push(PID);
		}

    } // for ends

}
if(arrayToSend.length > 0){
	arrayToSend = JSON.stringify(arrayToSend);
	var jsonArr = [{'pairsVoo': arrayToSend}];
	jsonArr = JSON.stringify(jsonArr);
	sendMessage(0, jsonArr, 0, doNothing, []);
}
if(dropToSend.length > 0){
	dropToSend = JSON.stringify(dropToSend);
	var jsonArr = [{'pids': dropToSend, 'pos': 2266}];
	jsonArr = JSON.stringify(jsonArr);
	var passBack = ['.product-grid', '.grid-list li'];
	sendMessage(1, jsonArr, 30, displayRecentDrops, passBack);
}
}

function sendCurrent(){
	curData = [];
	var prod = "";
	var image = "";
	var myPrice = "";
	var cur_url = "";
	var current_status = 0;
	var link = "";
	var PID = "";
	var brand = "";
	var name = "";
	var prod1 = "";
	var breadcrumb_str = "";

	breadcrumb_str = getBreadCrumb();
	prod = getProd();
	if(getAvailability() == 1){
		current_status = 0;
	}
	else if(getAvailability() == 0){
		current_status = 1;
	}
	else if(getAvailability() == -1){
		current_status = 2;
	}
	myPrice = getPrice();
	image = getImage();
	PID = getPID();
	cur_url = window.location.href;
	curData.push([prod, image, myPrice, cur_url, current_status, PID, breadcrumb_str]);
	curData = JSON.stringify(curData);
	var jsonArr = [{'curDataVoo': curData}];
	jsonArr = JSON.stringify(jsonArr);
	if($('.product-details-page').length > 0){
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
	if($(".product-details-page").length > 0 && $(".product-details-page:eq(0)").find(".breadcrumb").length > 0 &&  $(".product-details-page:eq(0)").find(".breadcrumb:eq(0) .product_title").length > 0){
		prod = $(".product-details-page:eq(0)").find(".breadcrumb:eq(0) .product_title:eq(0)").text().trim();
	}
	else if($(".product-details-page").length > 0 && $(".product-details-page:eq(0)").find("h1").length > 0){
		prod = $(".product-details-page:eq(0)").find("h1:eq(0)").text().trim();
	}
	if($('.product-details-page').length > 0){
		return prod;
	}
	else{
		return "";
	}
}

function getImage(){
	var image = "";

	if($('meta[property="og:image"]').length > 0 && $('meta[property="og:image"]').attr('content')){
		image = $('meta[property="og:image"]').attr('content').trim();
		if(image != "" && image.split("http").length < 2){
			image = "https:"+image;
		}
	}
	else if($('#pdpMainImage').length > 0 && $('#pdpMainImage').attr("src")){
		image = $('#pdpMainImage').attr('src');
		if(image != "" && image.split("http").length < 2){
			image = "https:"+image;
		}
	}
	// //console.log("image: "+image);
	return image;
}

function getPrice(){
	var price = "";
	if($(".product-details-page").length > 0 && $(".product-details-page:eq(0)").find(".product-details").length > 0 &&  $(".product-details-page:eq(0)").find(".product-details:eq(0) .primo_unsubcribed").length > 0){
		price = $(".product-details-page:eq(0)").find(".product-details:eq(0) .primo_unsubcribed:eq(0) span:eq(0)").text().trim();
		price = filter_price(price);
	}
	if(isNaN(price)){
		price = 0;
	}
	return price;
}

function getAvailability(){
	var avail = 1;
	if($(".product-details-page").length > 0 && $(".product-details-page:eq(0)").find(".available-sizes").length > 0 &&  $(".product-details-page:eq(0)").find(".available-sizes:eq(0) .voonik-clear-btn").length > 0 && $(".product-details-page:eq(0)").find(".available-sizes:eq(0) .voonik-clear-btn").text().trim().toUpperCase() == "SOLD OUT"){
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
	if(pid.split("voonik.com/recommendations/").length > 1){
		pid = pid.split("voonik.com/recommendations/")[1];
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
	if(pid.split("voonik.com/recommendations/").length > 1){
		pid = pid.split("voonik.com/recommendations/")[1];
	}
	if(link.split('voonik.com/recommendations/').length < 2){
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
	var len_bread = $('.breadcrumbs').find('a').length;

	for(i=0;i<len_bread;i++){
		breadcrumb = $('.breadcrumbs').find('a:eq('+ i +')').text().trim();
		bread_final += breadcrumb + "*~";
	}

	if(bread_final == ""){
		len_bread = $('.breadcrumb').find('a').length;

		for(i=0;i<len_bread;i++){
			breadcrumb = $('.breadcrumb').find('a:eq('+ i +')').text().trim();
			bread_final += breadcrumb + "*~";
		}
	}

	return bread_final;


}

function getCategory(){
	var categories = getBreadCrumb();
	var index = 1;
	var category = "";
	if(categories != "" && categories != undefined){
		categories = categories.split("*~");
		category = categories[index];
	}
	return category;
}
