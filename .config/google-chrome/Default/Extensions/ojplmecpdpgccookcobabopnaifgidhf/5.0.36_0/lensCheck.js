var url =window.location.href;

var urlcheck= "lenskart.com/checkout/onepage/success";

// https://www.lenskart.com/checkout/onepage/

if((url.split('lenskart.com/checkout/onepage/').length > 1) && url.split(urlcheck).length <= 1)
// if(document.querySelectorAll('.gift-voucher-apply').length > 1)
{
		getCouponCart(url,'text','.code-apply');
}

// var myInterval = setInterval(function()
// 	{ 

// 		if(document.getElementsByClassName('code-apply').length > 0)
// 		{
// 			// console.log("found coupon");
// 			var coupCode = document.getElementsByClassName('code-apply')[0].innerText;
// 	    	// console.log("coupCode "+coupCode);
// 	    	setCookie1('coupCode',coupCode);
// 	    	// clearInterval(myInterval);

// 		}
// 		// else if(document.getElementsByClassName('error').length > 0)
// 		// {
// 		// 	// console.log("coupon not valid");
// 		// 	setCookie1("coupCode","");
// 		// 	// clearInterval(myInterval);
// 		// }
// 		else
// 		{
// 			setCookie1("coupCode","");			
// 		}
		

// 	}, 10000);

// }

if(url.split(urlcheck).length > 1)
{

$(document).ready(function() {

		var couponcode = getCookie('coupCode');
		setCookie('coupCode',-1,'');
		var orderid = "";
		if(document.querySelectorAll('.success-header').length > 0)
		{
		      var parent = document.querySelector('.success-header');
		      if(parent.querySelectorAll('.margin-b20').length > 0)
		      {
		      	var parent1 = parent.querySelector('.margin-b20');
		      	if(parent1.querySelectorAll('span').length > 2)
		      	{
		      		orderid = parent1.querySelectorAll('span')[2].innerText;
		      	}
		      }

		}

		if(orderid == "")
		{	
			if(document.querySelectorAll('.success-header').length > 0)
			{
			      var parent = document.querySelector('.success-header');
			      if(parent.querySelectorAll('p').length > 0)
			      {
			      	var parent1 = parent.querySelector('p');
			      	if(parent1.querySelectorAll('strong').length > 0)
			      	{
			      		orderid = parent1.querySelector('strong').innerText;
			      	}
			      }
			}
		}
		//For more than one products

		//Total amount (More than one order)

		//General for all
		var username = "";
		if(document.querySelectorAll('.delivery-details').length > 0)
		{
			var parent = document.querySelector('.delivery-details');
			if(parent.querySelectorAll('span').length > 0)
			{
				username = parent.querySelector('span').innerText;
			}
		}

		var mobile = "";
		if(document.querySelectorAll('.delivery-details').length > 0)
		{
			var parent = document.querySelector('.delivery-details');
			if(parent.querySelectorAll('span').length > 2)
			{
				mobile = parent.querySelectorAll('span')[2].innerText;
			}
		}

		var addressobject = "";
		if(document.querySelectorAll('.delivery-details').length > 0)
		{
			var parent = document.querySelector('.delivery-details');
			if(parent.querySelectorAll('p').length > 0)
			{
				addressobject = parent.querySelector('p').innerText;
			}
		}

		var deliveryDate = "";
		if(document.querySelectorAll('.order-delivrd').length > 0)
		{
			var parent = document.querySelector('.order-delivrd');
			if(parent.querySelectorAll('strong').length > 0)
			{
				deliveryDate = parent.querySelector('strong').innerText;
			}
		}
		var modeofpayment = "";
		if(document.querySelectorAll('.delivery-payment').length > 0)
		{
			var parent = document.querySelector('.delivery-payment');
			if(parent.querySelectorAll('span').length > 2)
			{
				modeofpayment = parent.querySelectorAll('span')[2].innerText;
			}
		}


		var price = "";
		if(document.querySelectorAll('.delivery-payment').length > 0)
		{
		      var parent = document.querySelector('.delivery-payment');
		      if(parent.querySelectorAll('h4').length > 0)
		      {
		      	var parent1 = parent.querySelector('h4');
		      	if(parent1.querySelectorAll('span').length > 2)
		      	{
		      		price = parent1.querySelectorAll('span')[2].innerText;
		      	}
		      }

		}

		// console.log("price "+price);
		// console.log("modeofpayment "+modeofpayment);
		// console.log("addressobject "+addressobject);



		var products = [];
		if(document.querySelectorAll('.edit-summary').length > 0)
		{
					var parent = document.querySelector('.edit-summary');
					var allProducts = parent.childNodes;
					var numProd = allProducts.length;

					for(var i=0;i<numProd;i++)
					{
						var prodName ="";
						if(allProducts[i].querySelectorAll('.summary-right').length > 0)
						{
							var parent = allProducts[i].querySelector('.summary-right');
							if(parent.querySelectorAll('span').length > 1)
							{
								prodName = parent.querySelectorAll('span')[1].innerText;
							}
						}
						if(allProducts[i].querySelectorAll('img').length > 0)
						{
							var img = allProducts[i].querySelector('img').getAttribute('src').split('/');
							if(img[img.length-1].split("glasses").length > 1)
							{
									var pid = img[img.length-1].split("glasses")[0];
									pid = pid+"glasses";
							}
							else
							{

								pid = "";

							}
								
						}
						
						var product =   {
										"name":encodeURIComponent(prodName),
										"pid":encodeURIComponent(pid),
										"quantity":'',
										"size":'',
										"price":price,
										"sellername":'',
										"deliverydate":encodeURIComponent(deliveryDate),
										"orderid":encodeURIComponent(orderid)
										
									}
						products.push(product);

					}

		}

		if(products.length <= 0)
		{
			if(document.querySelectorAll('.slick-track').length > 0)
			{
					var parent = document.querySelector('.slick-track');
					var allProducts = parent.childNodes;
					var numProd = allProducts.length;

					for(var i=0;i<numProd;i++)
					{
						var prodName ="";
						if(allProducts[i].querySelectorAll('p').length > 0)
						{
							prodName = allProducts[i].querySelector('p').innerText;
						}
						var pid = "";
						var product =   {
										"name":encodeURIComponent(prodName),
										"pid":encodeURIComponent(pid),
										"quantity":'',
										"size":'',
										"price":price,
										"sellername":'',
										"deliverydate":encodeURIComponent(deliveryDate),
										"orderid":encodeURIComponent(orderid)
										
									}

						products.push(product);
					}
			}
		}
		
		products=JSON.stringify(products);
		products=encodeURIComponent(products);

		// console.log("modeofpayment "+modeofpayment);
		// console.log("orderid "+orderid);
		// console.log("products ")
		// console.log(products);


		var fullname=username;
		var clienttime=Date.now();
		var date=Date.now();
		var email= "";
		var bankname="";
		var website=57;
		var amount = price;
		var jsonArr = [{'modeofpayment':modeofpayment,'orderid':orderid,'bankname':bankname,'email':email,'date':date,'amount':amount,'username':username,'mobile':mobile,'address':addressobject,'products':products,'website':website,'couponcode':couponcode}];
		    jsonArr = JSON.stringify(jsonArr);
		    // console.log(jsonArr);
    sendMessage(1, jsonArr,25,doNothing, []);

 });


    //console.log("type");





}


// function setCookie1(cname, cvalue, exdays) {
//   var d = new Date();
//   var dom=window
//   d.setTime(d.getTime() + (exdays*24*60*60*1000));
//   var expires = "expires="+d.toGMTString();
//   document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/;domain="+"."+window.location.host.split(".")[1]+"."+window.location.host.split(".")[2];
// }

