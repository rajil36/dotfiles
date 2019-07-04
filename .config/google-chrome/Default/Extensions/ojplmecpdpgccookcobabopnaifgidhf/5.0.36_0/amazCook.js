//For more than one products
// var url =window.location.href;

var urlcheck1= "amazon.in/gp/buy/spc/handlers/display.html";

callCart = setInterval(function(){urlChange();},5000);
var clearScrapLoop;
function urlChange()
{
	
   // if(window.location.href==urlcheck)
   if(window.location.href.split(urlcheck1).length>1)  	
   {
   	clearInterval(callCart);
   	scrapOrderDetails();

   }

}


function scrapOrderDetails()
{
	var noofproducts= $(".asin-title").length;
	var products=[];
	var k=0;
	for (var i=0;i<noofproducts;i++)
	{

		var productname = "";
		var productcode = "";
		var quantity = 0;
		var sellername = "";
		var productprice = 0;
		if($(".asin-title:eq("+i+")").length > 0){
			productname=$(".asin-title").eq(i).text().trim();
		}
		if($("input[name='dupOrderCheckArgs']:eq("+i+")").length > 0 && $("input[name='dupOrderCheckArgs']:eq("+i+")").val().split("|1|").length > 1){
			productcode=$("input[name='dupOrderCheckArgs']").eq(i).val().split("|1|")[0];
		}
		var productsize;
		var deliverydate='';
		if($(".quantity-display:eq("+i+")").length > 0){
			quantity= parseFloat($(".quantity-display").eq(i).text());
		}
		if($(".a-color-secondary:contains('Sold by')").eq(i) && $(".a-color-secondary:contains('Sold by')").eq(i).text().trim().split("Sold by: ").length > 0){
			sellername= $(".a-color-secondary:contains('Sold by')").eq(i).text().trim().split("Sold by: ")[0];
		}
		if($("#spc-orders .a-row:contains('Quantity') .a-color-price.a-spacing-micro").eq(i)){
			productprice=parseFloat($("#spc-orders .a-row:contains('Quantity') .a-color-price.a-spacing-micro").eq(i).text().trim().split("Rs. ")[1].trim().replace(",",''));
		}
		var orderid='';

		var product =   {
			"name":encodeURIComponent(productname),
			"pid":encodeURIComponent(productcode),
			"quantity":encodeURIComponent(quantity),
			"size":'',
			"price":encodeURIComponent(productprice),
			"sellername":encodeURIComponent(sellername),
			"deliverydate":encodeURIComponent(deliverydate),
			"orderid":encodeURIComponent(orderid)

		}
		if(productname != "" && quantity > 0 && productprice > 0){
			products.push(product);
		}
		
	}
	products=JSON.stringify(products);
	products=encodeURIComponent(products);
	localStorage.proddetails=products;
	var totalprice=parseFloat($("tr:contains('Order Total')").text().trim().split("Rs. ")[1].replace(/,/g, ""));
				//setCookie("totalprice",totalprice);
				localStorage.totalprice=totalprice;


				var fullname= $(".displayAddressFullName").text();
				var address1= $(".displayAddressAddressLine1").text();
				var address2= $(".displayAddressAddressLine2").text();
				var address= $(".displayAddressAddressLine1").text()+","+$(".displayAddressAddressLine2").text();
				var landmark= "";
				var city=$(".displayAddressCityStateOrRegionPostalCode").text().split(",")[0];
				var state=$(".displayAddressCityStateOrRegionPostalCode").text().split(",")[1].split(" ")[1];
				var mobilenumber=$("span:contains('Phone:')").text().split("Phone: ")[1];
				var pincode=$(".displayAddressCityStateOrRegionPostalCode").text().split(",")[1].split(" ")[2];


				var addressobject=
				{
					"type":'',
					"fullname":encodeURIComponent(fullname),
					"address1":encodeURIComponent(address1),
					"address2":encodeURIComponent(address2),
					"address":encodeURIComponent(address),
					"landmark":encodeURIComponent(landmark),
					"city":encodeURIComponent(city),
					"state":encodeURIComponent(state),
					"mobilenumber":encodeURIComponent(mobilenumber),
					"pincode":encodeURIComponent(pincode)

				}

				addressobject=JSON.stringify(addressobject);

				addressobject=encodeURIComponent(addressobject);



				//setCookie("addressobject",addressobject);
				localStorage.addressobject=addressobject;
				var mode=$("#payment-information").text().trim();

				//setCookie("mode",mode);

				localStorage.mode=mode;
		// }


	}

	function setCookie(cname, cvalue, exdays) 
	{
		var d = new Date();
		d.setTime(d.getTime() + (exdays*24*60*60*1000));
		var expires = "expires="+d.toGMTString();
		document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
	}


//setCookie("proddetails",products);


