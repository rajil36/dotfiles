var s = document.createElement('div');
     s.id="proddetails";
var b=document.createElement('div');
  b.id="coupdet";     

(document.body || document.documentElement).appendChild(s);
(document.body || document.documentElement).appendChild(b);

document.getElementById("proddetails").innerText=JSON.stringify(analyticsLayer);

document.getElementById("proddetails").style.display="none";

if(dataLayer && dataLayer[1].transactionPromoCode)
{
// console.log("coupon code"+dataLayer[1].transactionPromoCode);
document.getElementById("coupdet").innerText=dataLayer[1].transactionPromoCode;

document.getElementById("coupdet").style.display="none";
}