var alertPosition = 2266;
onBreadcrumbProdChange();

function onBreadcrumbProdChange(oldBreadcrumb){
  // console.log("I was called");
  var breadcrumb = getBreadCrumb(1);
  var currProd = getProd();
  var currPrice = getPrice();
  if(currProd.trim()!="" && currPrice!=0){
   breadcrumb = breadcrumb + "~*" + currProd;

   if(breadcrumb != oldBreadcrumb){
     oldBreadcrumb = breadcrumb;
       // console.log("Change found");
       setTimeout(function(){onBreadcrumbProdChange(oldBreadcrumb);}, 500);
       if((getPID().trim())!=""){
        // console.log("entering here ");
        $(".hk-yellow-bar-main-div").css("display", "none");
        $(".hk-main-graph").css("display", "none");
        $(".hk-main-watch").css("display", "none");
        callVoonik();
        plotAllData();
        var pollInterval = 1000 * 15;
        window.setTimeout(sendCurrent, 5000);
        window.setTimeout(sendPairs, 5000);
        window.setTimeout(sendPairs, pollInterval);
      }

      else {

        $(".hk-yellow-bar-main-div").css("display", "none");
        $(".hk-main-graph").css("display", "none");
        $(".hk-main-watch").css("display", "none");
      }
    }
    else {
      setTimeout(function(){onBreadcrumbProdChange(oldBreadcrumb);}, 500);
    }

  }
  else {
    setTimeout(function(){onBreadcrumbProdChange(oldBreadcrumb);}, 500);
  }

}
function reportPurchase(){
  var curURL = window.location.href;
  if(curURL.split('.voonik.com/checkout/bag').length>1){
    var jsonArr = [{'processDONE': "Voonik"}];
    jsonArr = JSON.stringify(jsonArr);
    sendMessage(0, jsonArr, 0, doNothing, []);
  }
}

function sendTrack(){
  var prod = getProd();
  var webID = getCurrentPosition(window.location.href);
  var url = window.location.href;
  var prToSend = getPrice();
  url = encodeURIComponent(url);
  prod = encodeURIComponent(prod);
  if(prod!=""){
    var jsonArr = [{'prod': prod, 'url': url, 'webID': webID, 'isBook': 0, 'price': prToSend }];
    jsonArr = JSON.stringify(jsonArr);
    sendMessage(1, jsonArr, 11, doNothing, []);
  }
}

function callVoonik(){
  sendTrack();
  reportPurchase();
  pidFlipkart = getPID();
  var selector = [];
  selector.push({selector: '.related-products:eq(0)', attr: 'none', pos: 'before'});
  selector.push({selector: '.sold-by-other-sellers:eq(0)', attr: 'none', pos: 'before'});
  selector = JSON.stringify(selector);
  height = "auto";
  var passBack = [{selectors: selector, height: height}];
  passBack = JSON.stringify(passBack);
  addGraphBase(passBack);

  var csURL = returnResource("cs-buyh.png");
  var title = getProd();
  var prod = title;
  var price = getPrice();
  var myPrice = price;
  title = title.split("(")[0];
  var titleS = title.split(" ");
  if(titleS.length<15){
    title = titleS.join("-");
  }
  else {
    title = titleS[0] + "-" + titleS[1] + "-" + titleS[2] + "-" + titleS[3] + "-" + titleS[4];
  }
  var url = "http://compare.buyhatke.com/products/" + title;
  var final2send = url.split("products/");
  var msgToSend = final2send[1] + "~*~*" + price;
  msgToSend = msgToSend + "moreData=";
  sendSearchMessage(msgToSend, url);
}
callVoonik();
function filterResults(data, url){
  if(data && data != null && data.trim() != "" && data != "null"){
    var results2 = JSON.parse(data);
    var message = results2;
    var results = message;
    results.sort(compare);
    var origPrice = getPrice();
    origProd = getProd();
    var countArray = Array();
    for (var i = 0; i <= results.length - 1; i++) {
      var current = results[i].prod;
      countArray[i] = 0;
      currentArray = origProd.split(" ");
      var totalLen = currentArray.length;
      for(var k=0; k< currentArray.length; k++){
        if(current.toUpperCase().indexOf(currentArray[k].toUpperCase())!=-1){
          countArray[i] = countArray[i] + 1;
        }
      }
      results[i].score = countArray[i];
    }
    indexSelected = 0; notFound = 1;
    for(k=0; k< results.length; k++){
      if(results[k].score/totalLen > .5){
        indexSelected = k;
        notFound = 0;
        break;
      }
    }

    var posResults = [];
    posResults.push({selector: 'body', attr: 'none', pos: 'before'});
    posResults = JSON.stringify(posResults);
    var posSpecs = [];
    posSpecs.push({selector: 'body', attr: 'none', cssAttr: 'margin-top', preVal: '45px', postVal: '0px'});
    posSpecs.push({selector: '.faded-bg:eq(0)', attr: 'none', cssAttr: 'top', preVal: '145px', postVal: 'initial'});
    posSpecs = JSON.stringify(posSpecs);
    showResultsNew(results, indexSelected, posSpecs, posResults, url);
  }
}

