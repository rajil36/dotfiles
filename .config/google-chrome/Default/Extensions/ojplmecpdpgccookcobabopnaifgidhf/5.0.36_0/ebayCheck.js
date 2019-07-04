var url =window.location.href;

var urlcheck= "ebay.in/OrderConfir";

var couponPage = "order2.ebay.in/ReviewOrder";

// document.querySelector('#roCoupon').querySelector('.xo-r-cpn').querySelector('span').innerText
var couponDiv = "#roCoupon .xo-r-cpn[0] span[0]";
if(couponPage!="" && url.split(couponPage).length > 1)
{
			getCouponTrack();
}

function getCouponTrack()
{
	var myInterval = setInterval(function()
	  { 
	  	
	  	var coupCode = getPathValue('coupCode',couponDiv);
	  	if(coupCode!="")
	  	{
	  		setCookie('coupCode',coupCode);
	  	}
	  	else
	  	{
	  		setCookie('coupCode','');
	  	}
	    
	  }, 10000);


}


function getPathValue(key,path)
{
		var inEles = path.split(" ");var finalVal = "";
		this.document = document;
		var parentEle = this.document;
	     var classNotFound = 0;
	     // var key = "name";

	    parentEleLatest =document.querySelectorAll(inEles[0]);
		if(parentEleLatest.length > 1)
		{
			for(var out=0;out < parentEleLatest.length;out++)
			{
    			 parentEle = parentEleLatest[out]; var notComplete = true;
    			 for(var inner=1;inner<inEles.length;inner++)
    			 {
    			 		
    			 	if(inEles[inner].split("[").length > 1)
    				{
    					index = inEles[inner].split("[")[1];
    					index = index.split("]")[0];
    					pickClass = inEles[inner].split("[")[0];
    				}
    				else
    				{
    					index = 0;
    					pickClass = inEles[inner];
    				}
    				parentEle = parentEle.querySelectorAll(pickClass)[index];
    				if(parentEle == undefined)
    				{
    					notComplete = false;
    					break;
    				}
    			 }
    			 if(notComplete == true)
    			 {
    			 	 pIndx = out;
    			 	 break;
    			 }
			}
			if(typeof pIndx == "undefined")
			{
				return "";
			}
			else
			{
			parentEle = document.querySelectorAll(inEles[0])[pIndx];
			}
		}
		else if(parentEleLatest.length == 1)
		{
			//only 1 parent class
			if(inEles[0].split("#").length > 1)
			{
			parentEle = document.querySelector(inEles[0]);
			}
			else
			{
			parentEle = document.querySelectorAll(inEles[0])[0];
			}
		}


		for(var k =1;k<inEles.length;k++)
		{
			if(inEles[k].trim()=="")
			{
				continue;
			}
			if(inEles[k].split("#").length > 1)  //picked ele is id
			{
				// var pickID = inEles[k].split("#")[1].trim();
				parentEle = parentEle.querySelector(inEles[k].trim());
				// console.log(parentEle);
			}
			else if(inEles[k].split(".").length > 1) //picked ele is Class
			{
				if(inEles[k].split("[").length > 1)
				{
					index = inEles[k].split("[")[1];
					index = index.split("]")[0];
					pickClass = inEles[k].split("[")[0];
				}
				else
				{
					index = 0;
					pickClass = inEles[k];
				}
				parentEle = parentEle.querySelectorAll(pickClass)[index];

			}
			// else if(inEles[k].split("Tag~").length > 1) //picked ele is tag
			else
			{
				// tagTemp = inEles[k].split("Tag~")[1];
				tagTemp = inEles[k];
				if(tagTemp.split("[").length > 1)
				{
					index = tagTemp.split("[")[1];
					index = index.split("]")[0];
					pickClass = tagTemp.split("[")[0];
				}
				else
				{
					index = 0;
					pickClass = tagTemp;
				}
				parentEle = parentEle.querySelectorAll(pickClass)[index];

			}
			if(parentEle == null || parentEle == undefined)
			{
				// console.log("rejected "+inEles[k]);
				classNotFound = 1;
				break;
			}
    	
		}
		if(classNotFound == 0)
		{
			if(key == "image")
    		{
    			
    				// console.log("parentEle in key "+parentEle);
    				if(parentEle.getElementsByTagName('img')[0] != undefined)
					{
						finalVal = parentEle.getElementsByTagName('img')[0].getAttribute('src');
					}
					else
					{
						finalVal = parentEle.getAttribute("src");
					}
					imgLogo = finalVal;
					// console.log("imgLogo in key image is "+imgLogo);
    		}
    		else if(key.split("pid").length > 1)
    		{
    				if(parentEle.getElementsByTagName('a')[0] != undefined)
					{
						finalVal = parentEle.getElementsByTagName('a')[0].getAttribute('href');
					}
					else
					{
						finalVal = parentEle.getAttribute("href");
					}
					finalVal = window.location.host+finalVal;

					hostName = window.location.host;
					if(finalVal.toLowerCase().split(hostName.toLowerCase()).length > 1)
					{

					}
					else
					{
						finalVal = hostName+finalVal;
					}
    		}
    		else
    		{
    				// console.log("parentEle = ");
    			 //   console.log(parentEle);
		            var finalVal = parentEle.innerText;
		            // console.log("finalVal 1 = "+finalVal);

    		}
    		// console.log("finalVal = "+finalVal);

		}
		return finalVal;

}

if(url.split(urlcheck).length>1)
{


var nooforder=1;

var orderid=$(".xo-oc-ppc b").text();
//For more than one products
var noofproducts= $(".xo-oc-odi").length;
var products=[];
var k=0;
var couponcode = getCookie('coupCode');
setCookie('coupCode','',-1);
for (var i=0;i<noofproducts;i++)

{

var productname=$(".xo-oc-h50").eq(i).text();
var productcode=$(".xo-oc-h50").eq(i).text().split("(")[1].split(")")[0];
var productsize;
var deliverydate=$(".xo-oc-edd").eq(i).text().trim().split("Delivery:")[1];
var quantity=parseFloat($("li span:contains('Qty')").eq(i).parent().text().split("Qty :")[1]);
var sellername=$(".xo-oc-vcd p").eq(i).text();
var productprice=parseFloat($("li span:contains('Price')").eq(i).parent().text().split("Price :")[1].split("Rs.")[1]);

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
products.push(product);				

}

products=JSON.stringify(products);
// console.log("products");
// console.log(products);

products=encodeURIComponent(products);


//Total amount (More than on order)

var amount=parseFloat($(".xo-oc-cpa").text().split("Rs.")[1]);
//General for all
var username=$("#gh-eb-u").text().split("Hi ")[1].split("!")[0];
var mobile=$(".xo-oc-rec b").text();
var fullname= $(".xo-spb p").eq(0).text();
var address1= $(".xo-spb p").eq(1).text();
var address2= '';
var address= $(".xo-spb p").eq(0).text();
var landmark= "";
var city=$(".xo-spb p").eq(2).text();
var state=$(".xo-spb p").eq(3).text().split(",")[0];
var mobilenumber=$(".xo-oc-rec b").text();
var pincode=$(".xo-spb p").eq(3).text().split(",")[1];


var addressobject=
{
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

//aff
var tags=["source","aff_sub","aff_source","offer_id","aff_sub2"];
var aff={};
var affparam1=getCookie(tags[0]);
var affparam2=getCookie(tags[1]);
for(var i=0;i<tags.length;i++)
{
  //console.log(localStorage[tags[i]]);
if(getCookie(tags[i])!=undefined||getCookie(tags[i])!="")
{
aff[tags[i]]=getCookie(tags[i]);
setCookie(tags[i],"");
}

if(getCookie(tags[i]+"path")!=undefined||getCookie(tags[i]+"path")!="")
{
aff[tags[i]+"path"]=getCookie(tags[i]+"path");

setCookie(tags[i]+"path","");
}

}
//console.log(aff);
affobject=JSON.stringify(aff);
//console.log(affobject);
affobject=encodeURIComponent(affobject);

//aff

var clienttime=Date.now();
var date=Date.now();
var email='';
var bankname="bhuwan";
var modeofpayment=$(".xo-oc-sp").text().split("Mode:")[1].replace(/[^\x20-\x7E]/gmi, " ");
var website= 1;
var jsonArr = [{'modeofpayment':modeofpayment,'orderid':orderid,'bankname':bankname,'email':email,'date':date,'amount':amount,'username':username,'mobile':mobile,'address':addressobject,'products':products,'website':website,'aff':affobject,'param1':affparam1,'param2':affparam2,'couponcode':couponcode}];
    jsonArr = JSON.stringify(jsonArr);
    sendMessage(1, jsonArr,25,doNothing, []);
    //console.log("type");


}
