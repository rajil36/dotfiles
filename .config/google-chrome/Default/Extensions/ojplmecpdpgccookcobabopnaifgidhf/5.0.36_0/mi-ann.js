var globalIndex = [];


function startInterval(index){
   if($('.J_seckillBtn').length <= index){
   	  return;
   }
   globalIndex[index] = setInterval(function(){
   	   var text = $('.J_seckillBtn')[index].innerText;
   	   if(text.split("Buy").length > 1){
   	   	   $('.J_seckillBtn')[index].click();
   	   	   clearInterval(globalIndex[index]);
   	   }
   }, 10);
}

var imgLogo = chrome.extension.getURL("logo.png");
var loc = window.location.href;
if(loc.split("mi.com/in/3rdanniversary").length>1){


$('body').append('<div id="pop-alert-ams" class="hk-green" style="display:block;height:160px!important;"><div id="p-logo"><img src="' + imgLogo + '"></div><div id="p-msg"><a target="_blank" style="text-decoration:none;color:white;font-size:14px;font-family:calibri" href="http://bit.ly/2sEtPIP"><p>We will try to add products at Rs 1 Flash Sale to your cart as soon as it is available for sale. Make sure you system timing is correct. Match it with http://bit.ly/2sEtPIP</p><p><a href="http://bit.ly/2sjz41k" style="text-decoration:none;color:white;font-size:13px;font-family:calibri" target="_blank"><div>Now that I have got your attention, why not let us know how we can improve your shopping experience. Tap here to rate us.  </div></a></p></a></div></div>'); 

	startInterval(0);
	startInterval(1);
	startInterval(2);
	startInterval(3);
	startInterval(4);
	startInterval(5);

}

