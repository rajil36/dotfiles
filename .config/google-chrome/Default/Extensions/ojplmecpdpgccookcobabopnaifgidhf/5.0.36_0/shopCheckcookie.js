
$("body").append("<div id='proddetails' style='display:none;'></div>");

$("#proddetails").html(JSON.stringify(prodsJson));

$("body").append("<div id='proddata' style='display:none;'></div>");

$("#proddata").html(JSON.stringify(digitalData));

$("body").append("<div id='prodemail' style='display:none;'></div>");
$("#prodemail").html(email);
// $("body").append("<div id='coupDet' style='display:none;'></div>");
// if(typeof dd_couponCode!=="undefined")
// {
// 		$("#coupDet").html(dd_couponCode);
// }
