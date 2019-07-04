var url =window.location.href;

var urlcheck= "koovs.com/checkout/succes";
var couponPage = "koovs.com/checkout/cart";
if(url.split(couponPage).length > 1)
{
    getCouponCart(couponPage,'text','.applied-coupon-box .row[0]');

}


if(url.split(urlcheck).length>1)
{

var s = document.createElement('script');
var couponcode = getCookie('coupCode');
setCookie('coupCode',-1,'');
     s.id="koovs12";
 //  console.log(pincode);
// TODO: add "script.js" to web_accessible_resources in manifest.json
s.src = chrome.extension.getURL('koovsCheckcookie.js');
s.onload = function() {
    //this.remove();
   // console.log(pincode);
  // console.log("bhuwan");
var orderid=$(".suceessordernumber").text();
//For more than one products

var orderDetails = JSON.parse(getCookie('orderDetails'));
var orderid = orderDetails.orderData.orderId;
// console.log("orderid "+orderid);
var fullname = orderDetails.orderData.address.name;
var address = orderDetails.orderData.address.address;
var city = orderDetails.orderData.address.city;
var state = orderDetails.orderData.address.state;
var mobilenumber = orderDetails.orderData.address.mobile;
var pincode = orderDetails.orderData.address.zip;
var email = orderDetails.orderData.address.email;
var noofproducts = orderDetails.orderData.orderItems.length;
var orderItems = orderDetails.orderData.orderItems;
var amount = orderDetails.orderData.totalPrice;
// var productsdetails=JSON.parse(getCookie("products"));

// var noofproducts= JSON.parse(getCookie("products")).length;
var products=[];
var k=0;
 

for (var i=0;i<noofproducts;i++)
{


var productname=orderItems[i].product.productName;
var productcode=orderItems[i].product.id;
var productsize=orderItems[i].product.sizeCode;
var deliverydate='';
var quantity=parseFloat(orderItems[i].qty);
var sellername="none";
var productprice=parseFloat(orderItems[i].payAmount);

var product =   {
          "name":encodeURIComponent(productname),
          "pid":encodeURIComponent(productcode),
          "quantity":encodeURIComponent(quantity),
          "size":encodeURIComponent(productsize),
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



//Total amount (More than one order)
var landmark = "";
var address1 = "";
var address2 = "";

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
var tags=["utm_source","utm_campaign","utm_medium","admitad_uid"];
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
username = email;
affobject=encodeURIComponent(affobject);
var website=22;
var clienttime=Date.now();
var date=Date.now();
var modeofpayment = orderDetails.orderData.paymentModeV2;
var bankname = "";
var jsonArr = [{'modeofpayment':modeofpayment,'orderid':orderid,'bankname':bankname,'email':email,'date':date,'amount':amount,'username':username,'mobile':mobilenumber,'address':addressobject,'products':products,'website':website,'aff':affobject,'param1':affparam1,'param2':affparam2,'couponcode':couponcode}];
    jsonArr = JSON.stringify(jsonArr);
    // console.log(jsonArr);
    sendMessage(1, jsonArr,25,doNothing, []);
    //console.log("type");


};
(document.head || document.documentElement).appendChild(s);




}

