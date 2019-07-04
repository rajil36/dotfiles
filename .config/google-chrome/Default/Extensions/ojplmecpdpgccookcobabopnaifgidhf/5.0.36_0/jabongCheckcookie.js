function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+d.toGMTString();
  document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1);
    if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
  }
  return "";
}



$("body").append("<div id='proddetails' style='display:none;'></div>");
$("#proddetails").html(JSON.stringify(globalConfig));

// // if(document.getElementsByClassName('remove-coupon').length > 0)
// // {
    
// // }


// // document.on

// $(document).on('click', '.input-group-addon', function() 
// {


//     $("body").append("<div id='coupdet' style='display:none;'></div>");
//     var coupCode = document.getElementsByClassName('remove-coupon')[0].getAttribute('data-coupon');
//     $('#coupdet').text(coupCode);
//     console.log("coupCode "+coupCode);

// });