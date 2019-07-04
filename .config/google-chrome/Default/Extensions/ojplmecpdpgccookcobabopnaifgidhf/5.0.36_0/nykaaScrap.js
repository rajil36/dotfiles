$ = jQuery.noConflict();
var arrayToSend = [];
function getCategory(){
  var categories = getBreadCrumb();
  var index = 2;
  var category = "";
  if(categories != "" && categories != undefined){
    categories = categories.split("*~");
    category = categories[index];
  }
  return category;
}
function sendPairs(){
  arrayToSend = [];
  if($('.card-wrapper-container').length > 0){
    var slider = $('.card-wrapper-container');
    var sliderLength = slider.length;
    var link;
    var price;
    var PID;
    var prod = "";
    var image = "";
    var oos = 100;
    for(i=0;i<sliderLength;i++){
      price = "";
      PID = "";
      prod = "";
      image = "";
      oos = 100;
      if(document.querySelectorAll('.card-wrapper-container')[i].getElementsByTagName('a').length > 0){
        link = document.querySelectorAll('.card-wrapper-container')[i].getElementsByTagName('a')[0].getAttribute('href').trim();
        if(link != ""){
          if(link.split("nykaa.com").length < 2){
            link = "http://www.nykaa.com"+link;
          }
          PID = returnPID(link);
        }
        else{
          PID = "";
        }
      }
      if(PID != "" && document.querySelectorAll('.card-wrapper-container')[i].getElementsByClassName('card-img').length > 0 && document.querySelectorAll('.card-wrapper-container')[i].getElementsByClassName('card-img')[0].getElementsByTagName('img').length > 0){
        image = document.querySelectorAll('.card-wrapper-container')[i].getElementsByClassName('card-img')[0].getElementsByTagName('img')[0];
        image = image.getAttribute('src').trim();

        if(prod == "" && document.querySelectorAll('.card-wrapper-container')[i].getElementsByClassName('card-img')[0].getElementsByTagName('img')[0].hasAttribute('alt')){
          prod = document.querySelectorAll('.card-wrapper-container')[i].getElementsByClassName('card-img')[0].getElementsByTagName('img')[0].getAttribute('alt').trim();
        }
      }

      if(PID != "" && document.querySelectorAll('.card-wrapper-container')[i].getElementsByClassName('m-content__product-list__title').length > 0 ){
        prod = document.querySelectorAll('.card-wrapper-container')[i].getElementsByClassName('m-content__product-list__title')[0].innerText.trim();
      }
      
      if(PID!="" && document.querySelectorAll('.card-wrapper-container')[i].getElementsByClassName('post-card__content-price-offer').length > 0){
        price = document.querySelectorAll('.card-wrapper-container')[i].getElementsByClassName('post-card__content-price-offer')[0].innerText.trim();
        price = filter_price(price);
      }

      if(PID != "" && price != "" && !isNaN(price)  && price != 0  ){
        arrayToSend.push([PID, price, prod, image, oos]);
      }
    }

  }
  if($('.slick-slide').length > 0){
    var slider = $('.slick-slide').length;
    var sliderLength = slider;
    var link;
    var price;
    var PID;
    var prod = "";
    var image = "";
    var oos = 100;
    for(i=0;i<sliderLength;i++){
      price = "";
      PID = "";
      prod = "";
      image = "";
      oos = 100;

      if(document.querySelectorAll('.slick-slide')[i].getElementsByTagName('a').length > 0){
       link = document.querySelectorAll('.slick-slide')[i].getElementsByTagName('a')[0].getAttribute('href').trim();
       if(link != ""){
        if(link.split("nykaa.com").length < 2){
          link = "http://www.nykaa.com"+link;
        }
        PID = returnPID(link);
      }
      else{
        PID = "";
      }

    }
    if(PID != "" && document.querySelectorAll('.slick-slide')[i].getElementsByClassName('post-card__content-price-offer').length > 0){
      price = document.querySelectorAll('.slick-slide')[i].getElementsByClassName('post-card__content-price-offer')[0].innerText.trim();
      price = filter_price(price);
    }

    if(PID != "" && document.querySelectorAll('.slick-slide')[i].getElementsByClassName('m-content__product-list__title').length >0){
      prod = document.querySelectorAll('.slick-slide')[i].getElementsByClassName('m-content__product-list__title')[0].innerText.trim();
    }
    if(PID!= "" && document.querySelectorAll('.slick-slide')[i].getElementsByClassName('listing-img').length > 0){
      image = document.querySelectorAll('.slick-slide')[i].getElementsByClassName('listing-img')[0].getAttribute('src').trim();
      if(prod == "" && document.querySelectorAll('.slick-slide')[i].getElementsByClassName('listing-img')[0].hasAttribute('src')){
        prod = document.querySelectorAll('.slick-slide')[i].getElementsByClassName('listing-img')[0].getAttribute('alt').trim()
      }
    }


    if(PID != "" && price != "" && !isNaN(price)  && price != 0  ){
      arrayToSend.push([PID, price, prod, image, oos]);
    }
  }

}
if($('.slides .main-sl').length > 0){
  var slider = $('.slides .main-sl');
  var sliderLength = slider.length;
  var link;
  var price;
  var PID;
  var prod = "";
  var image = "";
  var oos = 100;
  for(i=0;i<sliderLength;i++){
    price = "";
    PID = "";
    prod = "";
    image = "";
    oos = 100;
    if($('.slides .main-sl:eq('+ i +') .left-img-second a').length > 0){
      link = $('.slides .main-sl:eq('+ i +') .left-img-second:eq(0) a:eq(0)').attr('href');
      if(link != ""){
        if(link.split("nykaa.com").length < 2){
          link = "http://www.nykaa.com"+link;
        }
        PID = returnPID(link);
      }
      else{
        PID = "";
      }
    }
    if(PID != ""){
      if($('.slides .main-sl:eq('+ i +')').find('.left-img-second img').length > 0){
        image = $('.slides .main-sl:eq('+ i +')').find('.left-img-second:eq(0) img:eq(0)').attr("src");

      }
      if($('.slides .main-sl:eq('+ i +')').find('.right-div-second h3').length > 0){
        prod = $('.slides .main-sl:eq('+ i +')').find('.right-div-second h3:eq(0)').text().trim();
        prod = prod.split("   ").join("").trim();
      }

      if($('.slides .main-sl:eq('+ i +')').find('.right-div-second .rs').length > 0){
        price = $('.slides .main-sl:eq('+ i +')').find('.right-div-second .rs').html();
        price = price.split(">");
        price = price[price.length - 1];
      }
      price = filter_price(price);
    }
    if(PID != "" && price != "" && !isNaN(price)  && price != 0  ) {
      arrayToSend.push([PID, price, prod, image, oos]);
    }

    } // for ends

  }


  if($('.product-box').length > 0){
    var slider = $('.product-box');
    var sliderLength = slider.length;
    var link;
    var price;
    var PID;
    var prod = "";
    var image = "";
    var oos = 100;
    for(i=0;i<sliderLength;i++){
      price = "";
      PID = "";
      prod = "";
      image = "";
      oos = 100;
      if($('.product-box:eq('+ i +') .product-image a').length > 0){
        link = $('.product-box:eq('+ i +') .product-image:eq(0) a:eq(0)').attr('href');
        if(link != ""){
          if(link.split("nykaa.com").length < 2){
            link = "http://www.nykaa.com"+link;
          }
          PID = returnPID(link);
        }
        else{
          PID = "";
        }
      }
      if(PID != ""){
        if($('.product-box:eq('+ i +')').find('.product-image img').length > 0){
          image = $('.product-box:eq('+ i +')').find('.product-image:eq(0) img:eq(0)').attr("src");
          
        }
        if($('.product-box:eq('+ i +')').find('.product-image a').attr("title")){
          prod = $('.product-box:eq('+ i +')').find('.product-image:eq(0) a').attr("title").trim();
          prod = prod.split("   ").join("").trim();
        }
        if($('.product-box:eq('+ i +')').find('.price-box .special-price').length > 0){
          price = $('.product-box:eq('+ i +')').find('.price-box .special-price').text().trim();
        }
        else  if($('.product-box:eq('+ i +')').find('.price-box .regular-price').length > 0){
          price = $('.product-box:eq('+ i +')').find('.price-box .regular-price').text().trim();
        }
        price = filter_price(price);
      }
      if(PID != "" && price != "" && !isNaN(price) ){
        arrayToSend.push([PID, price, prod, image, oos]);
      }

    } // for ends

  }

  arrayToSend = JSON.stringify(arrayToSend);
  var jsonArr = [{'pairsNykaa': arrayToSend}];
  jsonArr = JSON.stringify(jsonArr);
  sendMessage(0, jsonArr, 0, doNothing, []);
}


function sendCurrent(){
  curData = [];   
  var prod = getProd();
  var image = getImage();
  var myPrice = getPrice();
  var PID = getPID();
  var cur_url = "";
  var current_status = 0;
  var avail = getAvailability();
  if(avail == 1){
    current_status = 0;
  }
  else if(avail == 0){
    current_status = 1;
  }
  cur_url = window.location.href;
  if(PID != "")
    curData.push([prod, image, myPrice, cur_url, current_status, PID]);
  curData = JSON.stringify(curData);
  var jsonArr = [{'curDataNykaa': curData}];
  jsonArr = JSON.stringify(jsonArr);
  if($('.product-view').length > 0 || $(".product_description").length > 0){
    sendMessage(0, jsonArr, 0, doNothing, []);
  }
}

var pollInterval = 1000 * 15;
window.setTimeout(sendCurrent, 5000);
window.setTimeout(sendPairs, 5000);
window.setTimeout(sendPairs, pollInterval);

var check_prod_pg = 1;

function getProd(){
  var prod = "";
  if($('.product-view .product-name').length > 0){
    prod = $('.product-view:eq(0) .product-name:eq(0)').text().trim();
    prod = prod.split("   ").join("").trim();
  }
  if(prod == "" && $('.product-title').length >0){
    prod = $('.product-title').text().trim();
    prod = prod.split("   ").join("").trim();

  }
  if($('.product-view').length > 0 || $('.product_description').length > 0){
    return prod;
  }
  else{
    return "";
  }
}

function getImage(){
  var image = "";
  var image1 = "";
  if($('.zoomWindowContainer .zoomWindow').length > 0){
    image1 = $('.zoomWindowContainer:eq(0) .zoomWindow:eq(0)').attr('style');
    if(image1.split('url("').length > 1){
      image1 = image1.split('url("');
      //  
      image1 = image1[1];
      image1 = image1.split('"');
      image = image1[0].trim();

    }
  }
  if(image =="" && $('.post-card__img-wrap1').length > 0 && document.querySelectorAll('.post-card__img-wrap1')[0].getElementsByTagName('img').length >0){
    image = document.querySelectorAll('.post-card__img-wrap1')[0].getElementsByTagName('img')[0].getAttribute('src').trim();
  }
  return image;
}

function getPrice(){
  price = "";
  if($('.price-box .special-price .price').length > 0)
  {
    price = $('.price-box .special-price:eq(0) .price:eq(0)').text().trim();
  }
  else if($('.price-box .regular-price .price').length > 0)
  {
    price = $('.price-box .regular-price:eq(0) .price:eq(0)').text().trim();
  }
  else if($('.product-des__details-price .post-card__content-price-offer').length > 0){
    price = $('.post-card__content-price-offer:eq(0)').text().trim();

  }
  price = filter_price(price);
  return price;
}

function getAvailability(){
  var avail = 1;
  if($(".product-shop .out-of-stock").css("display") == "block"){
    avail = 0;
  }
  if(document.getElementsByClassName('out_of_stock').length > 0)
    avail = 0;
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
  if(pid.split(".com//").length > 1){
    pid = pid.split(".com//");
    pid = pid[pid.length-1];
    pid = pid.trim();
  }
  else if(pid.split(".com/").length > 1){
    pid = pid.split(".com/");
    pid = pid[pid.length-1];
    pid = pid.trim();
  }
  return pid;



}

function returnPID(link){

  var pid = link;
  if(link == ""){
    pid = 0;
  }
  if(pid.split("#").length > 1){
    pid = pid.split("#")[0];
  }
  if(pid.split("&").length > 1){
    pid = pid.split("&")[0];
  }
  if(pid.split("?").length > 1){
    pid = pid.split("?")[0];
  }
  if(pid.split(".com//").length > 1){
    pid = pid.split(".com//");
    pid = pid[pid.length-1];
    pid = pid.trim();
  }
  else if(pid.split(".com/").length > 1){
    pid = pid.split(".com/");
    pid = pid[pid.length-1];
    pid = pid.trim();
  }
  if(link.split('nykaa.com').length < 2){
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
  if($('.breadcrumb-cat').length > 0){
    var len_bread = $('.breadcrumb-cat').find('a').length;

    for(i=0;i<len_bread;i++){
      breadcrumb = $('.breadcrumb-cat').find('a:eq('+ i +')').text().trim();
      bread_final += breadcrumb + "*~";
    }
  }
  return bread_final;
}


// /////////////// WISH TO WATCH LIST STARTS ///////////////

var cur_url = window.location.href;
if(cur_url.split("/wishlist").length > 1 && (cur_url.split("nykaa.com").length > 1)){
  if($('#my-wishlist').length>0){
    importWishGlobal('#my-wishlist', 'before', nykWishList);
  }
}

function nykWishList(){
  wishListNyk = [];
  var link = "";
  var url = "";
  var prod = "";
  var image = "";
  var price = "";
  var PID = "";
  var pos = 1830;
  var brand = "";

  if($('#my-wishlist .product-box').length > 0) {
    var slider = $('#my-wishlist .product-box');
    var sliderLength = $('#my-wishlist .product-box').length;

    for(i=0;i<sliderLength;i++){
      link = "";
      url = "";
      prod = "";
      image = "";
      price = "";
      PID = "";
      if($('#my-wishlist .product-box:eq('+ i +')').find('.product-name a').length > 0){
        link = $('#my-wishlist .product-box:eq('+ i +')').find('.product-name a').attr('href');
        url = link;
        if(link.split("www.nykaa.com").length < 2){
         link = "https://www.nykaa.com"+link;
         url = link;
       }
       PID = returnPID(link);

     }
     else{
      link = "";
      PID = "";
    }
    price = 0;

    if($('#my-wishlist .product-box:eq('+ i +')').find('.product-name a').length > 0){
      prod = $('#my-wishlist .product-box:eq('+ i +')').find('.product-name a:eq(0)').text().trim();
      if(prod.split("...").length > 1){
        prod = prod.split("...");
        prod = prod[0].trim();
      }
    }

    if($('#my-wishlist .product-box:eq('+ i +')').find('.product-image img').length > 0){
      image = $('#my-wishlist .product-box:eq('+ i +')').find('.product-image img:eq(0)').attr('src').trim();
      if(image.split("http").length < 2){
        image = "http:"+image;
      }
    }
    if($('#my-wishlist .product-box:eq('+ i +')').find('.price-box').length > 0){
      price = $('#my-wishlist .product-box:eq('+ i +')').find('.price-box:eq(0) h3:eq(0)').text().trim();
      price = filter_price(price);
    }

    if(PID != "" && PID != 0 && price != "" && !isNaN(price)){
      wishListNyk.push([encodeURIComponent(PID), encodeURIComponent(prod), price, encodeURIComponent(image), pos, encodeURIComponent(url)]);
    }
  }

  wishJson = JSON.stringify(wishListNyk);
  var jsonArr = [{'wishList': wishJson}];
  jsonArr = JSON.stringify(jsonArr);
  sendMessage(1, jsonArr, 17, alertWLResp, []);  
}
else{
  errorInWL();
}

}
// /////////////// WISH TO WATCH LIST ENDS ///////////////


var cur_url = window.location.href;

function checkIcon(){
  
if(cur_url.split("nykaa.com").length > 1){
  
  if(jQuery(".coupon-btn-wrap").length > 0  && $("#couponClick").length == 0){
  //  console.log("hello from here");
    var selectorACIcon = ".coupon-btn-wrap:eq(0)";
    var position = "before";
    var parent = "none";
    var method = "POST";
    var api = "https://www.nykaa.com/app-api/index.php/cart/apply_promocode";//https://www.jabong.com/cart/applycoupon

       
    var postFields = {
      "code": "**",
      "source": "react",
      "app_version": "9.9.9"
    }

    //var postFields = {"source": source, "code":"**", "cartValue[value]": cartValue,"cartValue[title]":title, "is_guest":is_guest };
    var details = [{'postFields': postFields, "api": api, "method": method, "api_case": 1}];
    details = JSON.stringify(details);
    arrayMsg = [];
    displayACIcon(selectorACIcon, parent, position, 1830, details);
    keepCheckingACIcon(selectorACIcon, parent, position, 1830, details);
  }
  else{
    setTimeout(checkIcon, 500);
  }
}
}
checkIcon();


savings = [];
bestSaving = 0;
bestCoupon = "";
function startSaving(data){

  data = JSON.parse(data);
  var nowCode = "";
  var nowSaving = "";
  var resp = data[0].data;
  //console.log("hello world",resp);
  var code = data[0].code.trim();
  var cpnMsg = "";
  var couponAt = 50;
  var csaving = 0;
  var ecashing = 0;
  var savingsObject = {};
  nowCode = code;

  


          if(resp.status!="fail" && resp.discounts && resp.discounts.value){
                     var temp = resp.discounts.value;
           }

           var csaving = temp;
           csaving = filter_price(csaving);
           if(isNaN(csaving)){
            csaving = 0
          }
          else if(csaving > bestSaving){
            bestSaving = csaving;
            bestCoupon = code;
          }
          // displayEachSavings(csaving);
          cpnMsg = "SUCCESS";
          arrayMsg.push([code, encodeURIComponent(cpnMsg), couponAt ]);
          // console.log("code: "+nowCode+" nowSaving "+nowSaving);



  //}
  savingsLen = savings.length;
  savingsObject["code"] = code;
  savingsObject["saving"] = csaving;
  savingsObject["ecash"] = ecashing;
  savings[savingsLen] = savingsObject;
  localStorage.savings = JSON.stringify(savings);
  displayEachCpnSaving(code, csaving, ecashing);
  doneSavingCheck++;
  if(doneSavingCheckFn() == 1){
    applyBestCoupon();
    if(localStorage.anaSent!=1 && parseInt(bestSaving) != 0 && bestSaving!="" && !isNaN(parseInt(bestSaving))){
      localStorage.anaSent = 1;
      var host=window.location.host;
      var jsonArr = [{'type': 'finish1','website':host}];
      jsonArr = JSON.stringify(jsonArr);
      sendMessage(1, jsonArr,22,doNothing, []);
      tracer(1,4);
      setTimeout(function(){if(JSON.parse(features_json)[4]==0){ft(4);}},100);
    }
  }
}

var mainClick = 0;
var clickedRemove = 0;
var deleteAC = 0;
var timerStart = 0;
function applyBestCoupon(){
  if(localStorage.retryPostLoad==1){
    bestCoupon = localStorage.bestCouponHere;
    bestSaving = localStorage.bestSavingHere;
  }
  var allowNow = 0;
  if(localStorage.retryPostLoad==1 || ( parseInt(bestSaving) != 0 && bestCoupon.trim() != "")){
    /*
    if(document.getElementsByClassName("remove-coupon").length > 0 && clickedRemove == 0){
      document.getElementsByClassName("remove-coupon")[0].click();
      clickedRemove = 1;
      localStorage.bestCouponHere = bestCoupon;
      localStorage.bestSavingHere = bestSaving;
    }*/
    /*
    if(localStorage.retryPostLoad==1){
      bestCoupon = localStorage.bestCouponHere;
      bestSaving = localStorage.bestSavingHere;
      $(".hdc-sav-amt").text(parseInt(bestSaving));
    }*/
    
    /*if($(".have-a-coupon").length > 0){
      if(mainClick < 5){
        document.getElementsByClassName("have-a-coupon")[0].click();
        mainClick++;
      }*/
      if(jQuery("#discountcode-form").length > 0 && jQuery("#discountcode-form button").length > 0){

        jQuery('#coupon_code').val(bestCoupon.trim());
        jQuery('#discountcode-form button').click();
        localStorage.retryPostLoad = 0;
        displayFinalSavings();
      }
      else{
        setTimeout(applyBestCoupon, 1000);
      }
    //}
  //  else{
    if(timerStart > 7){
      localStorage.retryPostLoad = 1;
      window.location.reload();
    }
    timerStart++;
    setTimeout(applyBestCoupon, 1000);
  //  }
}
else if(localStorage.retryPostLoad==1){
  setTimeout(applyBestCoupon, 1000);
}
else{
  displayNoSavings();
}
if(deleteAC == 0){
  if(arrayMsg.length > 0 && arrayMsg.length != ""){
    if(typeof bestCoupon != "undefined"){
      arrayMsg.push([bestCoupon, "Success", 1830, 1]);
    }
    arrayMsg = JSON.stringify(arrayMsg);
    var jsonArr = [{'cpn_msg': arrayMsg}];
    jsonArr = JSON.stringify(jsonArr);
    deleteAC = 1;
    sendMessage(1, jsonArr, 12, doNothing, []);
    arrayMsg = [];
  }
}
}

if(localStorage.retryPostLoad==1){
  applyBestCoupon();
}

