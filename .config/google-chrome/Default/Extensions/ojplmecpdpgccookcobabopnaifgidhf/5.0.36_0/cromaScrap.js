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

function getDetails(url){
	finalJSON = {};
      // var specialPat = /[^a-z0-9]+$/gi;
      var prodName = getProd();
      if(prodName ==""){
      	setTimeout(getDetails, 100);
      	return;
      }
      else {

      	var filters = getSpecs();
      	var prodName = getProd();
      	lastProd = prodName;
      	var myPrice = getPrice();

      	finalJSON["category"] = 0;
      	finalJSON["filters"] = filters;
      	finalJSON["filteredName"]  = prodName;
      	finalJSON["prodName"] = prodName;
      	finalJSON["price"] = myPrice;


      	var finalJSONTemp = JSON.stringify(finalJSON);
      	msgToSend = finalJSONTemp;
      	sendSearchMessageNew(msgToSend, 1, url);

      }
  }


  function getSpecs()
  {

  	var ourAtts = [];
  	ourAtts["model no"] = "model";
  	ourAtts["part number"] = "serialno";
  	ourAtts["processor name"] = "processor";
  	ourAtts["system memory"] = "ram";
  	ourAtts["operating system"] = "os";
  	ourAtts["hdd disk capacity"] = "hdd";
  	ourAtts["ssd"] = "hdd";
  	ourAtts["series"] = "lapseries";
  	ourAtts["model name"] = "modelname";
  	ourAtts["brand"] = "brand";

  	var attributeVal ={};
  	var attributes = [];
  	var attrVal = "";
  	for(var attribute in ourAtts)
  	{
  		if(!attributeVal[attribute])
  		{
  			attrVal = pickValue(attribute);
  			if(attrVal!="")
  			{

  				var key  = ourAtts[attribute];
  				attributeVal[key] = attrVal;

  			}
  		}

  	}

  	attributeVal["pid"] = getPID();
  	attributeVal = JSON.stringify(attributeVal);
  	return attributeVal;
  }





  function pickValue(attrName)
  {
  	var myVar = document.querySelectorAll('#specification table');
  	var noTables = myVar.length;
  	for(var i=0;i<noTables;i++)
  	{
  		var allRows = myVar[i].querySelectorAll('tr');
  		for(var j=0;j<allRows.length;j++)
  		{
  			var key =allRows[j].querySelectorAll('td')[0].textContent;


  			if(key.toLowerCase().indexOf(attrName) >= 0)
  			{
  				var value =allRows[j].querySelectorAll('td')[1].textContent;
  				value = " "+value+" ";
  				value = value.replace(/wi-fi/ig," ");
  				value = value.replace(/wifi/ig," ");
  				value = value.replace(/ wi fi /ig," ");
		                 // value = value.replace(/[^0-9A-Z]3g[^0-9A-Z]/ig," ");
		                 value = value.replace(/([^0-9A-Z])3g([^0-9A-Z])/ig,"$1 $2");
		                 // value = value.replace(/ 4g /ig," ");
		                 value = value.replace(/([^0-9A-Z])4g([^0-9A-Z])/ig,"$1 $2");
		                 // value = value.replace(spclSymbols," ");
		                 value = value.replace(/\s\s+/g,' ');
		                 value = value.replace(/[^0-9A-Z\-\/\s]/gi,' ');
		                 value = value.trim();

		                 if(key.toLowerCase().indexOf("hdd disk capacity") >= 0 || key.toLowerCase().indexOf("ssd") >= 0)
		                 {
		                 	value = value.replace(/(.)*([0-9]+)[^0-9A-Za-z]*GB(.)*/ig,' $2GB ');
		                 	value = value.replace(/(.)*([0-9]+)[^0-9A-Za-z]*TB(.)*/ig,' $2TB ');

		                 }
		                 return value;
		             }
		         }

		     }
		     return "";
		 }


		 var arrayToSend
		 function sendPairs(){
		 	arrayToSend = [];
		 	if($('.productGrid .gBox').length > 0){
		 		var slider = $('.productGrid .gBox');
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
		 			if($('.productGrid .gBox:eq('+ i +') a').length > 0){
		 				link = $('.productGrid .gBox:eq('+ i +') a:eq(0)').attr('href');
		 				if(link && link != ""){
		 					if(link.split("croma.").length < 2){
		 						link = "https://www.croma.com"+link;
		 					}
		 					PID = returnPID(link);
		 				}
		 				else{
		 					PID = "";
		 				}
		 			}
		 			if(PID != ""){
		 				if($('.productGrid .gBox:eq('+ i +')').find('.productMainLink').length > 0 && $('.productGrid .gBox:eq('+ i +')').find('.productMainLink').attr("title")){
		 					prod = $('.productGrid .gBox:eq('+ i +')').find('.productMainLink:eq(0)').attr("title").trim();
		 				}
		 				if($('.productGrid .gBox:eq('+ i +')').find('.productGridItemPromotion img').length > 0 && $('.productGrid .gBox:eq('+ i +')').find('.productGridItemPromotion img').attr("data-blzsrc")){
		 					image = $('.productGrid .gBox:eq('+ i +')').find('.productGridItemPromotion img:eq(0)').attr("data-blzsrc");
		 					if(image.split("croma.com").length < 2){
		 						image = "https://www.croma.com"+image;
		 					}
		 					if(image.split("data:image").length > 1){
		 						image = "";
		 					}
		 				}
		 				else if($('.productGrid .gBox:eq('+ i +')').find('.productGridItemPromotion img').length > 0 && $('.productGrid .gBox:eq('+ i +')').find('.productGridItemPromotion img').attr("src")){
		 					image = $('.productGrid .gBox:eq('+ i +')').find('.productGridItemPromotion img:eq(0)').attr("src");
		 					if(image.split("croma.com").length < 2){
		 						image = "https://www.croma.com"+image;
		 					}

		 					if(image.split("data:image").length > 1){
		 						image = "";
		 					}
		 				}
		 				else if($('.productGrid .gBox:eq('+ i +')').find('img').length > 0 && $('.productGrid .gBox:eq('+ i +')').find('img').attr("data-blzsrc")){
		 					image = $('.productGrid .gBox:eq('+ i +')').find('img:eq(0)').attr("data-blzsrc");
		 					if(image.split("croma.com").length < 2){
		 						image = "https://www.croma.com"+image;
		 					}

		 					if(image.split("data:image").length > 1){
		 						image = "";
		 					}
		 				}
		 				else if($('.productGrid .gBox:eq('+ i +')').find('img').length > 0 && $('.productGrid .gBox:eq('+ i +')').find('img').attr("src")){
		 					image = $('.productGrid .gBox:eq('+ i +')').find('img:eq(0)').attr("src");
		 					if(image.split("croma.com").length < 2){
		 						image = "https://www.croma.com"+image;
		 					}

		 					if(image.split("data:image").length > 1){
		 						image = "";
		 					}
		 				}
		 				if($('.productGrid .gBox:eq('+ i +')').find('.productGridItemPromotion h3').length > 0){
		 					price = $('.productGrid .gBox:eq('+ i +')').find('.productGridItemPromotion h3:eq(0)').text();
		 					price = filter_price(price);
		 				}
		 				else if($('.productGrid .gBox:eq('+ i +')').find('h3').length > 0){
		 					price = $('.productGrid .gBox:eq('+ i +')').find('h3:eq(0)').text();
		 					price = filter_price(price);
		 				}
		 				if($('.productGrid .gBox:eq('+ i +')').find('.addToCartButton').length > 0 && $('.productGrid .gBox:eq('+ i +')').find('.addToCartButton').attr("disabled") && $('.productGrid .gBox:eq('+ i +')').find('.addToCartButton').attr("disabled") == "disabled"){
		 					oos = 1;
		 				}
		 				else {
		 					oos = 0;
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

		 	if($('.jcarousel-item').length > 0){
		 		var slider = $('.jcarousel-item');
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
		 			if($('.jcarousel-item:eq('+ i +') a').length > 0){
		 				link = $('.jcarousel-item:eq('+ i +') a:eq(0)').attr('href');
		 				if(link && link != ""){
		 					if(link.split("croma.").length < 2){
		 						link = "https://www.croma.com"+link;
		 					}
		 					PID = returnPID(link);
		 				}
		 				else{
		 					PID = "";
		 				}
		 			}
		 			if(PID != ""){
		 				if($('.jcarousel-item:eq('+ i +')').find('h2 .productMainLink').length > 0 && $('.jcarousel-item:eq('+ i +')').find('h2 .productMainLink:eq(0)').attr("title")){
		 					prod = $('.jcarousel-item:eq('+ i +')').find('h2 .productMainLink:eq(0)').attr("title").trim();
		 				}
		 				else if($('.jcarousel-item:eq('+ i +')').find('.productMainLink').length > 1 && $('.jcarousel-item:eq('+ i +')').find('h2 .productMainLink:eq(1)').attr("title")){
		 					prod = $('.jcarousel-item:eq('+ i +')').find('h2 .productMainLink:eq(1)').attr("title").trim();
		 				}
		 				if($('.jcarousel-item:eq('+ i +') .productMainLink').length > 1 && $('.jcarousel-item:eq('+ i +') .productMainLink:eq(1) h2').length > 0 ){
		 					prod = $('.jcarousel-item:eq('+ i +') .productMainLink:eq(1) h2').text().trim();
		 				}
		 				if($('.jcarousel-item:eq('+ i +')').find('.productGridItemPromotion img').length > 0 && $('.jcarousel-item:eq('+ i +')').find('.productGridItemPromotion img').attr("data-blzsrc")){
		 					image = $('.jcarousel-item:eq('+ i +')').find('.productGridItemPromotion img:eq(0)').attr("data-blzsrc");
		 					if(image.split("croma.com").length < 2){
		 						image = "https://www.croma.com"+image;
		 					}
		 					if(image.split("data:image").length > 1){
		 						image = "";
		 					}
		 				}
		 				else if($('.jcarousel-item:eq('+ i +')').find('.productGridItemPromotion img').length > 0 && $('.jcarousel-item:eq('+ i +')').find('.productGridItemPromotion img').attr("src")){
		 					image = $('.jcarousel-item:eq('+ i +')').find('.productGridItemPromotion img:eq(0)').attr("src");
		 					if(image.split("croma.com").length < 2){
		 						image = "https://www.croma.com"+image;
		 					}
		 					if(image.split("data:image").length > 1){
		 						image = "";
		 					}
		 				}
		 				else if($('.jcarousel-item:eq('+ i +')').find('img').length > 0 && $('.jcarousel-item:eq('+ i +')').find('img').attr("data-blzsrc")){
		 					image = $('.jcarousel-item:eq('+ i +')').find('img:eq(0)').attr("data-blzsrc");
		 					if(image.split("croma.com").length < 2){
		 						image = "https://www.croma.com"+image;
		 					}
		 					if(image.split("data:image").length > 1){
		 						image = "";
		 					}
		 				}
		 				else if($('.jcarousel-item:eq('+ i +')').find('img').length > 0 && $('.jcarousel-item:eq('+ i +')').find('img').attr("src")){
		 					image = $('.jcarousel-item:eq('+ i +')').find('img:eq(0)').attr("src");
		 					if(image.split("croma.com").length < 2){
		 						image = "https://www.croma.com"+image;
		 					}
		 					if(image.split("data:image").length > 1){
		 						image = "";
		 					}
		 				}
		 				if($('.jcarousel-item:eq('+ i +')').find('h3').length > 0){
		 					price = $('.jcarousel-item:eq('+ i +')').find('h3:eq(0)').text();
		 					price = filter_price(price);
		 				}
		 			}
		 			else{
		 				price = "";
		 			}
		 			if(PID != "" && price != ""){
		 				arrayToSend.push([PID, price, prod, image, oos]);
		 			}

    } // for ends

}

if($('.item-dy').length  > 0){
	var slider = $('.item-dy');
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
		if($('.item-dy').attr('href')){
			link = $('.item-dy').attr('href').trim();
			if(link && link != ""){
				if(link.split("croma.").length < 2){
					link = "https://www.croma.com"+link;
				}
				PID = returnPID(link);
			}
			else{
				PID = "";
			}
		}

		if(PID != ""){
			if($('.item-dy:eq('+i+') .item-dy__name').length > 0){
				prod = $('.item-dy:eq('+i+') .item-dy__name').text().trim();
			}

			if($('.item-dy:eq('+i+') .item-dy__price').length > 0){
				price = $('.item-dy:eq('+i+') .item-dy__price').text().trim();
				price = filter_price(price);
			}
			else price = "";

			if($('.item-dy:eq('+i+') .item-dy__img').length > 0){
				image = $('.item-dy:eq('+i+') .item-dy__img').attr('src').trim();
				if(image.split("croma.com").length < 2){
					image = "https://www.croma.com"+image;
				}
				if(image.split("data:image").length > 1){
					image = "";
				}
				if(prod == ""){

				}
			}

			if(PID != "" && price != ""){
				arrayToSend.push([PID, price, prod, image, oos]);
			}

		}
	}
}

if($('.dy-item-shadow').length > 0){
	var slider = $('.dy-item-shadow');
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
		if($('.dy-item-shadow:eq('+ i +') a').length > 0){
			link = $('.dy-item-shadow:eq('+ i +') a:eq(0)').attr('href');
			if(link && link != ""){
				if(link.split("croma.").length < 2){
					link = "https://www.croma.com"+link;
				}
				PID = returnPID(link);
			}
			else{
				PID = "";
			}
		}
		if(PID != ""){
			if($('.dy-item-shadow:eq('+i+') .wishImg').length > 0 && $('.dy-item-shadow:eq('+i+') .wishImg img').length > 0 ){
				image = $('.dy-item-shadow:eq('+i+') .wishImg img').attr('src').trim();
				if(image.split("croma.com").length < 2){
					image = "https://www.croma.com"+image;
				}
				if(image.split("data:image").length > 1){
					image = "";
				}
			}

			if($('.dy-item-shadow:eq('+i+') .wishMeta').length > 0 && $('.dy-item-shadow:eq('+i+') .wishMeta h4').length > 0){
				prod = $('.dy-item-shadow:eq('+i+') .wishMeta h4 a').text().trim();
				price =  $('.dy-item-shadow:eq('+i+') .wishMeta h4 p').text().trim();
				price = filter_price(price);
			}

			if(PID != "" && price != ""){
				arrayToSend.push([PID, price, prod, image, oos]);
			}

		}

	}

}

if($('.product__list--item').length > 0){
	var slider = $('.product__list--item');
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
		if($('.product__list--item:eq('+ i +') a').length > 0){
			link = $('.product__list--item:eq('+ i +') a:eq(0)').attr('href');
			if(link && link != ""){
				if(link.split("croma.").length < 2){
					link = "https://www.croma.com"+link;
				}
				PID = returnPID(link);
			}
			else{
				PID = "";
			}
		}
		if(PID != ""){
			if($('.product__list--item:eq('+ i +')').find('.product__list--name').length > 0){
				prod = $('.product__list--item:eq('+ i +')').find('.product__list--name:eq(0)').text().trim();
			}

			if($('.product__list--item:eq('+ i +')').find('._primaryImg').length > 0 && $('.product__list--item:eq('+ i +')').find('._primaryImg').attr("src")){
				image = $('.product__list--item:eq('+ i +')').find('._primaryImg:eq(0)').attr("src");
				if(image.split("croma.com").length < 2 && image != ""){
					image = "https://www.croma.com"+image;
				}
				if(image.split("data:image").length > 1 && image != ""){
					image = "";
				}
			}
			else if($('.product__list--item:eq('+ i +')').find('.productGridItemPromotion img').length > 0 && $('.product__list--item:eq('+ i +')').find('.productGridItemPromotion img').attr("data-blzsrc")){
				image = $('.product__list--item:eq('+ i +')').find('.productGridItemPromotion img:eq(0)').attr("data-blzsrc");
				if(image.split("croma.com").length < 2){
					image = "https://www.croma.com"+image;
				}
				if(image.split("data:image").length > 1){
					image = "";
				}
			}
			else if($('.product__list--item:eq('+ i +')').find('.productGridItemPromotion img').length > 0 && $('.product__list--item:eq('+ i +')').find('.productGridItemPromotion img').attr("src")){
				image = $('.product__list--item:eq('+ i +')').find('.productGridItemPromotion img:eq(0)').attr("src");
				if(image.split("croma.com").length < 2){
					image = "https://www.croma.com"+image;
				}
				if(image.split("data:image").length > 1){
					image = "";
				}
			}
			else if($('.product__list--item:eq('+ i +')').find('img').length > 0 && $('.product__list--item:eq('+ i +')').find('img').attr("data-blzsrc")){
				image = $('.product__list--item:eq('+ i +')').find('img:eq(0)').attr("data-blzsrc");
				if(image.split("croma.com").length < 2){
					image = "https://www.croma.com"+image;
				}
				if(image.split("data:image").length > 1){
					image = "";
				}
			}
			else if($('.product__list--item:eq('+ i +')').find('img').length > 0 && $('.product__list--item:eq('+ i +')').find('img').attr("src")){
				image = $('.product__list--item:eq('+ i +')').find('img:eq(0)').attr("src");
				if(image.split("croma.com").length < 2){
					image = "https://www.croma.com"+image;
				}
				if(image.split("data:image").length > 1){
					image = "";
				}
			}
			if($('.product__list--item:eq('+ i +')').find('.pdpPrice').length > 0){
				price = $('.product__list--item:eq('+ i +')').find('.pdpPrice:eq(0)').text().trim();
				price = filter_price(price);
			}
			else if($('.product__list--item:eq('+ i +')').find('h3').length > 0){
				price = $('.product__list--item:eq('+ i +')').find('h3:eq(0)').text();
				price = filter_price(price);
			}
			if($('.product__list--item:eq('+ i +')').find('.btnexplink').length > 0){
				var oos1 = $('.product__list--item:eq('+ i +')').find('.btnexplink:eq(0)').text().trim();
				if(oos1.toUpperCase().trim() == "OUT OF STOCK"){
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

    } // for ends

}


if($('.carousel__item').length > 0){
	var slider = $('.carousel__item');
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
		if($('.carousel__item:eq('+ i +') a').length > 0){
			link = $('.carousel__item:eq('+ i +') a:eq(0)').attr('href');
			if(link && link != ""){
				if(link.split("croma.").length < 2){
					link = "https://www.croma.com"+link;
				}
				PID = returnPID(link);
			}
			else{
				PID = "";
			}
		}
		if(PID != ""){
			if($('.carousel__item:eq('+ i +')').find('.carousel__item--name_moob').length > 0){
				prod = $('.carousel__item:eq('+ i +')').find('.carousel__item--name_moob:eq(0)').text().trim();
			}
			else if($('.carousel__item:eq('+ i +')').find('.productMainLink').length > 1 && $('.carousel__item:eq('+ i +')').find('h2 .productMainLink:eq(1)').attr("title")){
				prod = $('.carousel__item:eq('+ i +')').find('h2 .productMainLink:eq(1)').attr("title").trim();
			}
			if($('.carousel__item:eq('+ i +') .productMainLink').length > 1 && $('.carousel__item:eq('+ i +') .productMainLink:eq(1) h2').length > 0 ){
				prod = $('.carousel__item:eq('+ i +') .productMainLink:eq(1) h2').text().trim();
			}
			if($('.carousel__item:eq('+ i +')').find('.specialimage').length > 0 && $('.carousel__item:eq('+ i +')').find('.specialimage').attr("src")){
				image = $('.carousel__item:eq('+ i +')').find('.specialimage:eq(0)').attr("src");
				if(image.split("croma.com").length < 2 && image != ""){
					image = "https://www.croma.com"+image;
				}
				if(image.split("data:image").length > 1 && image != ""){
					image = "";
				}
			}
			else if($('.carousel__item:eq('+ i +')').find('.productGridItemPromotion img').length > 0 && $('.carousel__item:eq('+ i +')').find('.productGridItemPromotion img').attr("data-blzsrc")){
				image = $('.carousel__item:eq('+ i +')').find('.productGridItemPromotion img:eq(0)').attr("data-blzsrc");
				if(image.split("croma.com").length < 2){
					image = "https://www.croma.com"+image;
				}
				if(image.split("data:image").length > 1){
					image = "";
				}
			}
			else if($('.carousel__item:eq('+ i +')').find('.productGridItemPromotion img').length > 0 && $('.carousel__item:eq('+ i +')').find('.productGridItemPromotion img').attr("src")){
				image = $('.carousel__item:eq('+ i +')').find('.productGridItemPromotion img:eq(0)').attr("src");
				if(image.split("croma.com").length < 2){
					image = "https://www.croma.com"+image;
				}
				if(image.split("data:image").length > 1){
					image = "";
				}
			}
			else if($('.carousel__item:eq('+ i +')').find('img').length > 0 && $('.carousel__item:eq('+ i +')').find('img').attr("data-blzsrc")){
				image = $('.carousel__item:eq('+ i +')').find('img:eq(0)').attr("data-blzsrc");
				if(image.split("croma.com").length < 2){
					image = "https://www.croma.com"+image;
				}
				if(image.split("data:image").length > 1){
					image = "";
				}
			}
			else if($('.carousel__item:eq('+ i +')').find('img').length > 0 && $('.carousel__item:eq('+ i +')').find('img').attr("src")){
				image = $('.carousel__item:eq('+ i +')').find('img:eq(0)').attr("src");
				if(image.split("croma.com").length < 2){
					image = "https://www.croma.com"+image;
				}
				if(image.split("data:image").length > 1){
					image = "";
				}
			}
			if($('.carousel__item:eq('+ i +')').find('.pdpPrice').length > 0){
				price = $('.carousel__item:eq('+ i +')').find('.pdpPrice:eq(0)').text().trim();
				price = filter_price(price);
			}
			else if($('.carousel__item:eq('+ i +')').find('h3').length > 0){
				price = $('.carousel__item:eq('+ i +')').find('h3:eq(0)').text();
				price = filter_price(price);
			}
			if($('.carousel__item:eq('+ i +')').find('.btnexplink').length > 0){
				var oos1 = $('.carousel__item:eq('+ i +')').find('.btnexplink:eq(0)').text().trim();
				if(oos1.toUpperCase().trim() == "OUT OF STOCK"){
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

    } // for ends

}


if(arrayToSend.length > 0){
	arrayToSend = JSON.stringify(arrayToSend);
	var jsonArr = [{'pairsCroma': arrayToSend}];
	jsonArr = JSON.stringify(jsonArr);
	sendMessage(0, jsonArr, 0, doNothing, []);
}
}

function sendCurrent(){
	curData = [];
	var prod = "";
	var image = "";
	var myPrice = "";
	var cur_url = "";
	var current_status = 0;
	var avail = getAvailability();
	var link = "";
	var PID = "";

	prod = getProd();
	if(avail == 0){
		current_status = 1;
	}

	myPrice = getPrice();
	image = getImage();
	PID = returnPID(window.location.href);
	var breadcrumbF = getBreadCrumb();
	cur_url = window.location.href;
	curData.push([prod, image, myPrice, cur_url, current_status, PID, breadcrumbF, 1]);
	curData = JSON.stringify(curData);
	var jsonArr = [{'curDataCroma': curData}];
	jsonArr = JSON.stringify(jsonArr);
	if($('.productDetailsPanel').length>0 || $("#currentPageType").length > 0){
		sendMessage(0, jsonArr, 0, doNothing, []);
	}
}

var pollInterval = 1000 * 15;
window.setTimeout(sendCurrent, 5000);
window.setTimeout(sendPairs, 5000);
window.setTimeout(sendPairs, pollInterval);


//avail (1 = available, 0 = oos, -1 = permanently disconnected )
var check_prod_pg = "";

function getProd(){
	var prod = "";

	if($(".productDescription h1").length > 0){
		prod = $(".productDescription h1:eq(0)").text().trim();
	}
	else if($(".productDescriptionCss h1").length > 0){
		prod = $(".productDescriptionCss h1:eq(0)").text().trim();
	}
	else if($("h1").length > 0){
		prod = $("h1:eq(0)").text().trim();
	}
	if($('.productDetailsPanel').length>0 || $("#currentPageType").length > 0){
		return prod;
	}
	else {
		return "";
	}
}

function getImage(){
	var image = "";
	if($("#imageLink").length > 0 && $("#imageLink img").length > 0){
		image = $("#imageLink img:eq(0)").attr("src");
		if(image.split("croma.com/").length < 2){
			image = "https://www.croma.com" + image;
		}
	}
	else if($(".productImage").length > 0 && $(".productImage ._pdp_im").length > 0){
		image = $(".productImage ._pdp_im:eq(0)").attr("src");
		if(image.split("croma.com/").length < 2){
			image = "https://www.croma.com" + image;
		}
	}

	// //console.log("image: "+image);
	return image;
}

function getPrice(){
	var price = "";
	if($(".product-details-price").length > 0 && $(".product-details-price .pdpPrice").length > 0)
	{
		price = $(".product-details-price:eq(0) .pdpPrice:eq(0)").text().trim();
	}
	else if($(".cta h2").length > 0)
	{
		price = $(".cta h2").text().trim();
	}
	else{
		price = "";
	}

	price = filter_price(price);
	return price;
}

function getAvailability(){
	var avail = 1;
	if($(".addToCartButton.outOfStock").length > 0){
		avail = 0;
	}
	return avail;

}


function getPID(){
	var link = window.location.href;
	var pid = link;

	if(pid.split("/p/").length > 1){
		pid = pid.split("/p/")[1];

		if(pid.split("#").length > 1){
			pid = pid.split("#")[0];
		}
		if(pid.split("&").length > 1){
			pid = pid.split("&")[0];
		}
		if(pid.split("?").length > 1){
			pid = pid.split("?")[0];
		}
		if(pid.split("/").length > 1){
			pid = pid.split("/")[0];
		}
	}
	else{
		pid = "";
	}
	return pid;

}

function returnPID(link){
	var pid = link;
	if(pid.split("/p/").length > 1){
		pid = pid.split("/p/")[1];

		if(pid.split("#").length > 1){
			pid = pid.split("#")[0];
		}
		if(pid.split("&").length > 1){
			pid = pid.split("&")[0];
		}
		if(pid.split("?").length > 1){
			pid = pid.split("?")[0];
		}
		if(pid.split("/").length > 1){
			pid = pid.split("/")[0];
		}
	}
	else{
		pid = "";
	}
	if(link.split('croma.com').length < 2){
		pid = "";
	}
	if(link == ""){
		pid = "";
	}
	return pid;
}


function getBreadCrumb(){
	var breadcrumb = "";
	var bread_final = "Home*~";
	if($('#breadcrumb').length > 0 && $('#breadcrumb').find("a").length > 0){
		var len_bread = $('#breadcrumb').find('a').length;
		for(i=1;i<len_bread;i++){
			breadcrumb = $('#breadcrumb').find('a:eq('+ i +')').text().trim();
			bread_final += breadcrumb + "*~";
		}
	}
	else if($('.breadcrumb').length > 0 && $('.breadcrumb').find("a").length > 0){
		var len_bread = $('.breadcrumb').find('a').length;
		for(i=1;i<len_bread;i++){
			breadcrumb = $('.breadcrumb').find('a:eq('+ i +')').text().trim();
			bread_final += breadcrumb + "*~";
		}
	}

	return bread_final;
}



// function getModel(){
// 	var model = "";
// 	if($(".SpecificationsDiv .w50p").length > 0){
// 		var spec_len = $(".SpecificationsDiv .w50p").length;
// 		for(var i=0;i<spec_len;i++){
// 			if($(".SpecificationsDiv .w50p:eq("+i+") caption:eq(0)").text().trim().toUpperCase() == "GENERAL"){
// 				var key_len = $(".SpecificationsDiv .w50p:eq("+i+") th").length;

// 				for(var j=1;j<key_len;j++){
// 					if($(".SpecificationsDiv .w50p:eq("+i+") th:eq("+j+")").text().trim().toUpperCase() == "MODEL NO.:"){
// 						var model = $(".SpecificationsDiv .w50p:eq("+i+") td:eq("+j+")").text().trim();
// 					}
// 				}
// 				break;
// 			}
// 		}
// 	}
// 	return model;
// }


// function getIntStorage(){
// 	var intMem = "";
// 	if($(".SpecificationsDiv .w50p").length > 0){
// 		var spec_len = $(".SpecificationsDiv .w50p").length;
// 		for(var i=0;i<spec_len;i++){
// 			if($(".SpecificationsDiv .w50p:eq("+i+") caption:eq(0)").text().trim().toUpperCase() == "MEMORY"){
// 				var key_len = $(".SpecificationsDiv .w50p:eq("+i+") th").length;

// 				for(var j=0;j<key_len;j++){
// 					if($(".SpecificationsDiv .w50p:eq("+i+") th:eq("+j+")").text().trim().toUpperCase() == "INTERNAL MEMORY:"){
// 						var intMem = $(".SpecificationsDiv .w50p:eq("+i+") td:eq("+j+")").text().trim();
// 					}
// 				}
// 				break;
// 			}
// 		}
// 	}
// 	return intMem;
// }

// function sendMobile(){
// 	var breadCrumb = getBreadCrumb();
//   // console.log("getBreadCrumb: " + breadCrumb);
//   if(breadCrumb.split("*~").length > 1 && breadCrumb.split("*~")[2].trim().toUpperCase() == "MOBILE PHONES" && getProd() != ""){
//   	var PID = getPID();
//   	var pos = 71;
//   	var price = getPrice();
//   	var image = getImage();
//   	var avail = getAvailability();
//   	var mainTitle = getProd();
//   	var modelName = getModel();
//   	var color = "";
//   	var intStorage = getIntStorage();
//   	var link = window.location.href;

//   	var jsonArr = [{'PID': encodeURIComponent(PID), 'pos': pos, 'price': price, 'image': image, 'avail': avail, 'mainTitle': encodeURIComponent(mainTitle), 'modelName': encodeURIComponent(modelName), 'color': encodeURIComponent(color), 'intStorage': encodeURIComponent(intStorage), 'link': encodeURIComponent(link) }];
//   	jsonArr = JSON.stringify(jsonArr);
//     // console.log("jsonArr: "+jsonArr);
//     sendMessage(1, jsonArr, 19, doNothing, []);

// }
// }
// sendMobile();
