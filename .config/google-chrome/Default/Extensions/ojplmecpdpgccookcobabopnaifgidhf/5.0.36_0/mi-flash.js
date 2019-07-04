var imgLogo = chrome.extension.getURL("logo.png");
var variant = "";
var prodName = "";
var varCode = "";
var saleTime = "";
var int = "";
var timer = "";
var clickTimer = "";
var line1 = 0;
var reqArray = [];
var prodArray = [];
var statusFlag = 0;
if(window.location.href.split("choosePro").length > 1){
  statusFlag = 1;
  getSelProd();
  buyNow();
}
// console.log("statusFlag " + statusFlag);

prodIdSelected = "";
selIndexDone = 0;

function getSelProd(){

      prodIdSelected = getCookie("mi-flash");
      selIndexDone = 1;
      // console.log('i got called', prodIdSelected  );
}

var buyT = "";

function buyNowTimeout(){
  buyT = setInterval(function(){
      // console.log('here');
      if(prodIdSelected!="" && $("[data-goods-id='"+prodIdSelected+"'] .btn-buy").length>0){
            $("[data-goods-id='"+prodIdSelected+"'] .btn-buy")[0].click();
            clearInterval(buyT);
      }
  }, 100);
}

function buyNow(){
  buyNowTimeout();
  
  // console.log("selectedIndex " + selectedIndex);
  if(prodIdSelected==""){
    prodIdSelected = getCookie('mi-flash');
  }
  
  if(statusFlag==1 && selIndexDone==1 && $("[data-goods-id='"+prodIdSelected+"'] .btn-buy").length>0){
      setTimeout(function(){buyNow();},1000);
      $("[data-goods-id='"+prodIdSelected+"'] .btn-buy")[0].click();
    }
    else if(selIndexDone==1 && prodIdSelected==""){
      document.getElementsByClassName('btn-buy')[0].click();
      setTimeout(function(){buyNow();},1000);
    }
    else {
      setTimeout(function(){buyNow();},10);
    }
}

buyNow();
variantStr ="";
var json = [{'getFlashSalesData': 'true'}];
json = JSON.stringify(json);
sendMessage(0, json, 0, showSalesData, []);

function showSalesData(data){
    var i = 0, link;
    var dummy = [];
    var salesData = data;
    salesData = JSON.parse(salesData);
    salesData = salesData[0];
    for( i = 0; i < salesData.length ; i++){
      link = salesData[i].url;
      if(link.split('?').length > 1)
        link = link.split('?')[0];
      if(link.split('#').length > 1)
        link = link.split('#')[link.split('#').length - 1];
      else if(link.split('/').length > 1)
        link = link.split('/')[link.split('/').length - 1];
      if(window.location.href.split(link).length > 1 ){
            prodName = salesData[i].title;
            varCode = salesData[i].code ;
            salesData[i].all_variants = JSON.parse(salesData[i].all_variants);
            for( var j =0; j < salesData[i].all_variants.length ; j++){
              if(j==0)
                dummy.push(salesData[i].all_variants[j].space);
              else if( dummy.indexOf(salesData[i].all_variants[j].space) == -1)
                dummy.push(salesData[i].all_variants[j].space);      
            }

            for(var j =0; j < dummy.length ; j++){
              var x = [];
              for(var k = 0 ; k < salesData[i].all_variants.length ; k++){
                if(salesData[i].all_variants[k].space == dummy[j])
                { var y =[];
                  y.push(salesData[i].all_variants[k].space);
                  y.push(salesData[i].all_variants[k].color);
                  y.push(salesData[i].all_variants[k].gid);
                  x.push(y);
                }   
              }
              prodArray.push(x);
            }
            
            // console.log("prod ",prodArray);
      }   
    }

    
}


  

/*
var redmiNote4 = [];
redmiNote4.push([['2G+32G', 'Black', '4170300003'],['2G+32G', 'Dark Grey', '4170300002'],['2G+32G', 'Gold', '4170300001']]);
redmiNote4.push([['3G+32G', 'Black', '4165100014'],['3G+32G', 'Dark Grey', '4165100013'],['3G+32G', 'Gold', '4171100017']]);
redmiNote4.push([['4G+64G', 'Black', '4171100014'],['4G+64G', 'Dark Grey', '4170500005'],['4G+64G', 'Gold', '4171100018']]);

var redmi4 = [];
redmi4.push([['2G+16G', 'Black', '4172400002'],['2G+16G', 'Gold', '4172400004']]);
redmi4.push([['3G+32G', 'Black', '4170900016'],['3G+32G', 'Gold', '4170900014']]);
redmi4.push([['4G+64G', 'Black', '4172000015'],['4G+64G', 'Gold', '4172000014']]);


var redmi4A = [];
redmi4A.push([['2G+16G', 'Dark Grey', '4171100019'],['2G+16G', 'Gold', '4171100020']]);

var redmiY1 = [];
redmiY1.push([['3G+32G', 'Dark Grey', '4174400023'],['3G+32G', 'Gold', '4174400022']]);
redmiY1.push([['4G+64G', 'Dark Grey', '4174400032'],['4G+64G', 'Gold', '4174400031']]);

var redmiY1Lite = [];
redmiY1Lite.push([['2G+16G', 'Dark Grey', '4174400027'],['2G+16G', 'Gold', '4174400025']]);

var redmi5A = [];

redmi5A.push([['2G+16G', 'Dark Grey', '4174600002'],['2G+16G', 'Gold', '4174600001'],['2G+16G', 'Rose Gold', '4174600003']]);
redmi5A.push([['3G+32G', 'Dark Grey', '4174600005'],['3G+32G', 'Gold', '4174600004']]);

var redmiNote5 = [];

redmiNote5.push([['3G+32G', 'Black', '4180500026'],['3G+32G', 'Gold', '4180500028']]);
redmiNote5.push([['4G+64G', 'Black', '4180500025'],['4G+64G', 'Gold', '4180500027']]);

var redmiNote5Pro = [];

redmiNote5Pro.push([['4G+64G', 'Black', '4180500017'],['4G+64G', 'Gold', '4180500019']]);
redmiNote5Pro.push([['6G+64G', 'Black', '4180500018'],['6G+64G', 'Gold', '4180500020']]);

var redmiNote6Pro = [];

redmiNote6Pro.push([['4G+64G', 'Black', '4184100005'],['4G+64G', 'Blue', '4184100003'],['4G+64G', 'Red', '4184100004'],['4G+64G', 'Rose Gold', '4184100006']]);
redmiNote6Pro.push([['6G+64G', 'Black', '4184100007'],['6G+64G', 'Blue', '4184100009'],['6G+64G', 'Red', '4184100008'],['6G+64G', 'Rose Gold', '4184100010']]);

var redmi6A = [];

redmi6A.push([['2G+16G', 'Black', '4183400017'],['2G+16G', 'Blue', '4183400019'],['2G+16G', 'Gold', '4183400021'],['2G+16G', 'Rose Gold', '4183400023']]);
redmi6A.push([['2G+32G', 'Black', '4183400018'],['2G+32G', 'Blue', '4183400020'],['2G+32G', 'Gold', '4183400022'],['2G+32G', 'Rose Gold', '4183400024']]);

var redmi6Pro = [];

redmi6Pro.push([['3G+32G', 'Black', '4183400033'],['3G+32G', 'Blue', '4183400039'],['3G+32G', 'Gold', '4183400037'],['3G+32G', 'Red', '4183400035']]);
redmi6Pro.push([['4G+64G', 'Black', '4183400034'],['4G+64G', 'Blue', '4183400040'],['4G+64G', 'Gold', '4183400038'],['4G+64G', 'Red', '4183400036']]);

var miTV = [];

miTV.push([['138.8 CM', 'Black', '4174700006']]);
//miTV.push([['3G+32G', 'Dark Grey', '4174600005'],['3G+32G', 'Gold', '4174600004']]);
*/
if(window.location.href.split("hdindex/terms/index").length > 1){
    int = setInterval(function(){
        document.querySelector('.J_btnNext').click();
        clearInterval(int);
    }, 100);
}
//http://www.mi.com/in/hdindex/choosePro/index.html?pro=REDMI4A&_1490855400

/*
if(window.location.href.split("openbuy/#REDMI4A").length > 1 || window.location.href.split("openbuy/index.html#REDMI4A").length > 1 || window.location.href.split("choosePro/index.html?pro=REDMI4A").length > 1){
variant = "redmi4A";
prodName = "Redmi 4A";
varCode = "f122";
}
else if(window.location.href.split("openbuy/#REDMI4").length > 1 || window.location.href.split("openbuy/index.html#REDMI4").length > 1 || window.location.href.split("choosePro/index.html?pro=REDMI4").length > 1){
variant = "redmi4";
prodName = "Redmi 4";
varCode = "f123";
}
else if(window.location.href.split("openbuy/#REDMI5A").length > 1 || window.location.href.split("openbuy/#redmi-5a").length > 1 || window.location.href.split("openbuy/index.html#REDMI5A").length > 1 || window.location.href.split("openbuy/index.html#redmi-5a").length > 1  || window.location.href.split("choosePro/index.html?pro=REDMI5A").length > 1 || window.location.href.split("choosePro/index.html?pro=rdemi-5a").length > 1){
variant = "redmi5A";
prodName = "Redmi 5A";
varCode = "f124";
}
else if(window.location.href.split("openbuy/#REDMIY1").length > 1 || window.location.href.split("openbuy/#redmi-y1").length > 1 || window.location.href.split("openbuy/index.html#REDMIY1").length > 1 || window.location.href.split("openbuy/index.html#redmi-y1").length > 1  || window.location.href.split("choosePro/index.html?pro=REDMIY1").length > 1 || window.location.href.split("choosePro/index.html?pro=rdemi-y1").length > 1){
variant = "redmiY1";
prodName = "Redmi Y1";
varCode = "f123";
}
else if(window.location.href.split("openbuy/#REDMIY1").length > 1 || window.location.href.split("openbuy/#redmi-y1-lite").length > 1 || window.location.href.split("openbuy/index.html#REDMIY1-LITE").length > 1 || window.location.href.split("openbuy/index.html#redmi-y1-lite").length > 1  || window.location.href.split("choosePro/index.html?pro=REDMIY1-LITE").length > 1 || window.location.href.split("choosePro/index.html?pro=rdemi-y1-lite").length > 1){
variant = "redmiY1L";
prodName = "Redmi Y1 Lite";
varCode = "f122";
}
else if(window.location.href.split("REDMI4A").length > 1){
variant = "redmi4A";
prodName = "Redmi 4A";
varCode = "f107";
}
else if(window.location.href.split("REDMI4").length > 1){
variant = "redmi4";
prodName = "Redmi 4";
varCode = "f108";
}
else if(window.location.href.split("HMN4").length > 1){
variant = "redmiNote4";
prodName = "Redmi Note 4";
varCode = "f109";
}
else if(window.location.href.split("mi-led-smart-tv-4-55").length > 1){
variant = "miTV";
prodName = "MI LED Smart TV";
varCode = "f122";
}
else if(window.location.href.split("redmi-note-5-pro").length > 1){
variant = "redmiNote5Pro";
prodName = "Redmi Note 5 Pro";
varCode = "f123";
}
else if(window.location.href.split("redmi-note5").length > 1){
variant = "redmiNote5";
prodName = "Redmi Note 5";
varCode = "f124";
}
else if(window.location.href.split("redmi-6a").length > 1){
variant = "redmi6A";
prodName = "Redmi 6A";
varCode = "f128";
}
else if(window.location.href.split("redmi-note-6-pro").length > 1){
variant = "redmiNote6Pro";
prodName = "Redmi Note 6 Pro";
varCode = "f108";
}
else if(window.location.href.split("redmi-6-pro").length > 1){
variant = "redmi6Pro";
prodName = "Redmi  6 Pro";
varCode = "f109";
}
*/

function returnColorStr(color){
   switch(color){
      case 'Black':
        return '<div class="hk-c-radio hk-u-text--singleLine"> <input type="radio" name="color" value="hk-color--black" id="hk-color--black" class="hk-c-radio__input--radio"> <label for="hk-color--black" class="hk-c-radio__label"> <span class="hk-c-check__labelText hk-u-text--white"><div style="background:#000000; border-radius: 100%; height:20px;display:inline-block;width: 20px;vertical-align:middle;"></div> Black </span> </label></div>';
        break;
      case 'Dark Grey':
      return '<div class="hk-c-radio hk-u-text--singleLine"> <input type="radio" name="color" value="hk-color--grey" id="hk-color--grey" class="hk-c-radio__input--radio"> <label for="hk-color--grey" class="hk-c-radio__label"> <span class="hk-c-check__labelText hk-u-text--white"><div style="background:#808080; border-radius: 100%; height:20px;display:inline-block;width: 20px;vertical-align:middle;"></div> Grey </span> </label></div>';
      break;
      case 'Gold':
      return '<div class="hk-c-radio hk-u-text--singleLine"> <input type="radio" name="color" value="hk-color--gold" id="hk-color--gold" class="hk-c-radio__input--radio"> <label for="hk-color--gold" class="hk-c-radio__label"> <span class="hk-c-check__labelText hk-u-text--white"><div style="background:#EBDBAE; border-radius: 100%; height:20px;display:inline-block;width: 20px;vertical-align:middle;"></div> Gold </span> </label></div>';
      break;
      case 'Rose Gold':
      return '<div class="hk-c-radio hk-u-text--singleLine"> <input type="radio" name="color" value="hk-color--rosegold" id="hk-color--rosegold" class="hk-c-radio__input--radio"> <label for="hk-color--rosegold" class="hk-c-radio__label"> <span class="hk-c-check__labelText hk-u-text--white"><div style="background:#b76e79; border-radius: 100%; height:20px;display:inline-block;width: 20px;vertical-align:middle;"></div> Rose Gold </span> </label></div>';
      break;
      case 'Blue':
      return '<div class="hk-c-radio hk-u-text--singleLine"> <input type="radio" name="color" value="hk-color--blue" id="hk-color--blue" class="hk-c-radio__input--radio"> <label for="hk-color--blue" class="hk-c-radio__label"> <span class="hk-c-check__labelText hk-u-text--white"><div style="background:#8aabc6; border-radius: 100%; height:20px;display:inline-block;width: 20px;vertical-align:middle;"></div> Blue </span> </label></div>';
      break;


   }
}
var storage = "";
function fillData(){
  if(varCode != ""){
    reqArray = prodArray;
    // console.log("req ",reqArray);
     storage = '';
    line1 = reqArray.length;
    for(var l =0; l<reqArray.length; l++){
      storage += '<div class="hk-c-radio hk-u-text--singleLine"> <input type="radio" name="storage" value="hk-sto--32_2g' +  l + '" id="hk-sto--32_2g' + l + '" class="hk-c-radio__input--radio"> <label for="hk-sto--32_2g' + l + '" class="hk-c-radio__label"> <span class="hk-c-check__labelText hk-u-text--white"> ' + reqArray[l][0][0] + ' </span> </label></div>';
    }
    var color = '';
    for( var l =0; l< reqArray[0].length; l++){
      color +=  returnColorStr(reqArray[0][l][1]);
    }
    variantStr ='<div class="hk-u-text--white"><div class="hk-u-margin__1 hk-u-text__align--center"> <b> Select your Variant for ' + prodName + ':</b></div><div class="hk-u-margin__1"> Storage:<div class="hk-u-margin__1"> ' + storage + '</div></div><div class="hk-u-margin__1"> Color:<div class="hk-u-margin__1"> ' + color + '</div></div></div>';
      getTime(varCode);
  }
  else setTimeout(fillData, 2000);
}
fillData();

/*
switch(variant){
  case 'redmi4':
      reqArray = redmi4;
     var storage = '';
     line1 = reqArray.length;
     for(var l =0; l<reqArray.length; l++){
        storage += '<div class="hk-c-radio hk-u-text--singleLine"> <input type="radio" name="storage" value="hk-sto--32_2g' +  l + '" id="hk-sto--32_2g' + l + '" class="hk-c-radio__input--radio"> <label for="hk-sto--32_2g' + l + '" class="hk-c-radio__label"> <span class="hk-c-check__labelText hk-u-text--white"> ' + reqArray[l][0][0] + ' </span> </label></div>';
     }
     var color = '';
     for( var l =0; l< reqArray[0].length; l++){
        color +=  returnColorStr(reqArray[0][l][1]);
     }
     variantStr ='<div class="hk-u-text--white"><div class="hk-u-margin__1 hk-u-text__align--center"> <b> Select your Variant for ' + prodName + ':</b></div><div class="hk-u-margin__1"> Storage:<div class="hk-u-margin__1"> ' + storage + '</div></div><div class="hk-u-margin__1"> Color:<div class="hk-u-margin__1"> ' + color + '</div></div></div>';
  break;
  case 'redmiNote4':
      reqArray = redmiNote4;
     var storage = '';
     line1 = reqArray.length;
     for(var l =0; l<reqArray.length; l++){
        storage += '<div class="hk-c-radio hk-u-text--singleLine"> <input type="radio" name="storage" value="hk-sto--32_2g' +  l + '" id="hk-sto--32_2g' + l + '" class="hk-c-radio__input--radio"> <label for="hk-sto--32_2g' + l + '" class="hk-c-radio__label"> <span class="hk-c-check__labelText hk-u-text--white"> ' + reqArray[l][0][0] + ' </span> </label></div>';
     }
     var color = '';
     for( var l =0; l< reqArray[0].length; l++){
        color +=  returnColorStr(reqArray[0][l][1]);
     }
     variantStr ='<div class="hk-u-text--white"><div class="hk-u-margin__1 hk-u-text__align--center"> <b> Select your Variant for ' + prodName + ':</b></div><div class="hk-u-margin__1"> Storage:<div class="hk-u-margin__1"> ' + storage + '</div></div><div class="hk-u-margin__1"> Color:<div class="hk-u-margin__1"> ' + color + '</div></div></div>';
  break;
  case 'redmi4A':
      reqArray = redmi4A;
     var storage = '';
     line1 = reqArray.length;
     for(var l =0; l<reqArray.length; l++){
        storage += '<div class="hk-c-radio hk-u-text--singleLine"> <input type="radio" name="storage" value="hk-sto--32_2g' +  l + '" id="hk-sto--32_2g' + l + '" class="hk-c-radio__input--radio"> <label for="hk-sto--32_2g' + l + '" class="hk-c-radio__label"> <span class="hk-c-check__labelText hk-u-text--white"> ' + reqArray[l][0][0] + ' </span> </label></div>';
     }
     var color = '';
     for( var l =0; l< reqArray[0].length; l++){
        color +=  returnColorStr(reqArray[0][l][1]);
     }
     variantStr ='<div class="hk-u-text--white"><div class="hk-u-margin__1 hk-u-text__align--center"> <b> Select your Variant for ' + prodName + ':</b></div><div class="hk-u-margin__1"> Storage:<div class="hk-u-margin__1"> ' + storage + '</div></div><div class="hk-u-margin__1"> Color:<div class="hk-u-margin__1"> ' + color + '</div></div></div>';
  break;
  case 'redmi5A':
      reqArray = redmi5A;
     var storage = '';
     line1 = reqArray.length;
     for(var l =0; l<reqArray.length; l++){
        storage += '<div class="hk-c-radio hk-u-text--singleLine"> <input type="radio" name="storage" value="hk-sto--32_2g' +  l + '" id="hk-sto--32_2g' + l + '" class="hk-c-radio__input--radio"> <label for="hk-sto--32_2g' + l + '" class="hk-c-radio__label"> <span class="hk-c-check__labelText hk-u-text--white"> ' + reqArray[l][0][0] + ' </span> </label></div>';
     }
     var color = '';
     for( var l =0; l< reqArray[0].length; l++){
        color +=  returnColorStr(reqArray[0][l][1]);
     }
     variantStr ='<div class="hk-u-text--white"><div class="hk-u-margin__1 hk-u-text__align--center"> <b> Select your Variant for ' + prodName + ':</b></div><div class="hk-u-margin__1"> Storage:<div class="hk-u-margin__1"> ' + storage + '</div></div><div class="hk-u-margin__1"> Color:<div class="hk-u-margin__1"> ' + color + '</div></div></div>';
  break;
  case 'redmiY1':
      reqArray = redmiY1;
     var storage = '';
     line1 = reqArray.length;
     for(var l =0; l<reqArray.length; l++){
        storage += '<div class="hk-c-radio hk-u-text--singleLine"> <input type="radio" name="storage" value="hk-sto--32_2g' +  l + '" id="hk-sto--32_2g' + l + '" class="hk-c-radio__input--radio"> <label for="hk-sto--32_2g' + l + '" class="hk-c-radio__label"> <span class="hk-c-check__labelText hk-u-text--white"> ' + reqArray[l][0][0] + ' </span> </label></div>';
     }
     var color = '';
     for( var l =0; l< reqArray[0].length; l++){
        color +=  returnColorStr(reqArray[0][l][1]);
     }
     variantStr ='<div class="hk-u-text--white"><div class="hk-u-margin__1 hk-u-text__align--center"> <b> Select your Variant for ' + prodName + ':</b></div><div class="hk-u-margin__1"> Storage:<div class="hk-u-margin__1"> ' + storage + '</div></div><div class="hk-u-margin__1"> Color:<div class="hk-u-margin__1"> ' + color + '</div></div></div>';
  break;
  case 'redmiY1L':
      reqArray = redmiY1L;
     var storage = '';
     line1 = reqArray.length;
     for(var l =0; l<reqArray.length; l++){
        storage += '<div class="hk-c-radio hk-u-text--singleLine"> <input type="radio" name="storage" value="hk-sto--32_2g' +  l + '" id="hk-sto--32_2g' + l + '" class="hk-c-radio__input--radio"> <label for="hk-sto--32_2g' + l + '" class="hk-c-radio__label"> <span class="hk-c-check__labelText hk-u-text--white"> ' + reqArray[l][0][0] + ' </span> </label></div>';
     }
     var color = '';
     for( var l =0; l< reqArray[0].length; l++){
        color +=  returnColorStr(reqArray[0][l][1]);
     }
     variantStr ='<div class="hk-u-text--white"><div class="hk-u-margin__1 hk-u-text__align--center"> <b> Select your Variant for ' + prodName + ':</b></div><div class="hk-u-margin__1"> Storage:<div class="hk-u-margin__1"> ' + storage + '</div></div><div class="hk-u-margin__1"> Color:<div class="hk-u-margin__1"> ' + color + '</div></div></div>';
  break;
  case 'redmiNote5':
      reqArray = redmiNote5;
     var storage = '';
     line1 = reqArray.length;
     for(var l =0; l<reqArray.length; l++){
        storage += '<div class="hk-c-radio hk-u-text--singleLine"> <input type="radio" name="storage" value="hk-sto--32_2g' +  l + '" id="hk-sto--32_2g' + l + '" class="hk-c-radio__input--radio"> <label for="hk-sto--32_2g' + l + '" class="hk-c-radio__label"> <span class="hk-c-check__labelText hk-u-text--white"> ' + reqArray[l][0][0] + ' </span> </label></div>';
     }
     var color = '';
     for( var l =0; l< reqArray[0].length; l++){
        color +=  returnColorStr(reqArray[0][l][1]);
     }
     variantStr ='<div class="hk-u-text--white"><div class="hk-u-margin__1 hk-u-text__align--center"> <b> Select your Variant for ' + prodName + ':</b></div><div class="hk-u-margin__1"> Storage:<div class="hk-u-margin__1"> ' + storage + '</div></div><div class="hk-u-margin__1"> Color:<div class="hk-u-margin__1"> ' + color + '</div></div></div>';
  break;
  case 'redmiNote5Pro':
      reqArray = redmiNote5Pro;
     var storage = '';
     line1 = reqArray.length;
     for(var l =0; l<reqArray.length; l++){
        storage += '<div class="hk-c-radio hk-u-text--singleLine"> <input type="radio" name="storage" value="hk-sto--32_2g' +  l + '" id="hk-sto--32_2g' + l + '" class="hk-c-radio__input--radio"> <label for="hk-sto--32_2g' + l + '" class="hk-c-radio__label"> <span class="hk-c-check__labelText hk-u-text--white"> ' + reqArray[l][0][0] + ' </span> </label></div>';
     }
     var color = '';
     for( var l =0; l< reqArray[0].length; l++){
        color +=  returnColorStr(reqArray[0][l][1]);
     }
     variantStr ='<div class="hk-u-text--white"><div class="hk-u-margin__1 hk-u-text__align--center"> <b> Select your Variant for ' + prodName + ':</b></div><div class="hk-u-margin__1"> Storage:<div class="hk-u-margin__1"> ' + storage + '</div></div><div class="hk-u-margin__1"> Color:<div class="hk-u-margin__1"> ' + color + '</div></div></div>';
  break;
  case 'redmiNote6Pro':
       reqArray = redmiNote6Pro;
       var storage = '';
     line1 = reqArray.length;
     for(var l =0; l<reqArray.length; l++){
        storage += '<div class="hk-c-radio hk-u-text--singleLine"> <input type="radio" name="storage" value="hk-sto--32_2g' +  l + '" id="hk-sto--32_2g' + l + '" class="hk-c-radio__input--radio"> <label for="hk-sto--32_2g' + l + '" class="hk-c-radio__label"> <span class="hk-c-check__labelText hk-u-text--white"> ' + reqArray[l][0][0] + ' </span> </label></div>';
     }
     var color = '';
     for( var l =0; l< reqArray[0].length; l++){
        color +=  returnColorStr(reqArray[0][l][1]);
     }
     variantStr ='<div class="hk-u-text--white"><div class="hk-u-margin__1 hk-u-text__align--center"> <b> Select your Variant for ' + prodName + ':</b></div><div class="hk-u-margin__1"> Storage:<div class="hk-u-margin__1"> ' + storage + '</div></div><div class="hk-u-margin__1"> Color:<div class="hk-u-margin__1"> ' + color + '</div></div></div>';
  break;
  case 'redmi6Pro':
       reqArray = redmi6Pro;
       var storage = '';
     line1 = reqArray.length;
     for(var l =0; l<reqArray.length; l++){
        storage += '<div class="hk-c-radio hk-u-text--singleLine"> <input type="radio" name="storage" value="hk-sto--32_2g' +  l + '" id="hk-sto--32_2g' + l + '" class="hk-c-radio__input--radio"> <label for="hk-sto--32_2g' + l + '" class="hk-c-radio__label"> <span class="hk-c-check__labelText hk-u-text--white"> ' + reqArray[l][0][0] + ' </span> </label></div>';
     }
     var color = '';
     for( var l =0; l< reqArray[0].length; l++){
        color +=  returnColorStr(reqArray[0][l][1]);
     }
     variantStr ='<div class="hk-u-text--white"><div class="hk-u-margin__1 hk-u-text__align--center"> <b> Select your Variant for ' + prodName + ':</b></div><div class="hk-u-margin__1"> Storage:<div class="hk-u-margin__1"> ' + storage + '</div></div><div class="hk-u-margin__1"> Color:<div class="hk-u-margin__1"> ' + color + '</div></div></div>';
  break;
   case 'redmi6A':
       reqArray = redmi6A;
       var storage = '';
     line1 = reqArray.length;
     for(var l =0; l<reqArray.length; l++){
        storage += '<div class="hk-c-radio hk-u-text--singleLine"> <input type="radio" name="storage" value="hk-sto--32_2g' +  l + '" id="hk-sto--32_2g' + l + '" class="hk-c-radio__input--radio"> <label for="hk-sto--32_2g' + l + '" class="hk-c-radio__label"> <span class="hk-c-check__labelText hk-u-text--white"> ' + reqArray[l][0][0] + ' </span> </label></div>';
     }
     var color = '';
     for( var l =0; l< reqArray[0].length; l++){
        color +=  returnColorStr(reqArray[0][l][1]);
     }
     variantStr ='<div class="hk-u-text--white"><div class="hk-u-margin__1 hk-u-text__align--center"> <b> Select your Variant for ' + prodName + ':</b></div><div class="hk-u-margin__1"> Storage:<div class="hk-u-margin__1"> ' + storage + '</div></div><div class="hk-u-margin__1"> Color:<div class="hk-u-margin__1"> ' + color + '</div></div></div>';
  break;
  case 'miTV':
      reqArray = miTV;
     var storage = '';
     line1 = reqArray.length;
     for(var l =0; l<reqArray.length; l++){
        storage += '<div class="hk-c-radio hk-u-text--singleLine"> <input type="radio" name="storage" value="hk-sto--32_2g' +  l + '" id="hk-sto--32_2g' + l + '" class="hk-c-radio__input--radio"> <label for="hk-sto--32_2g' + l + '" class="hk-c-radio__label"> <span class="hk-c-check__labelText hk-u-text--white"> ' + reqArray[l][0][0] + ' </span> </label></div>';
     }
     var color = '';
     for( var l =0; l< reqArray[0].length; l++){
        color +=  returnColorStr(reqArray[0][l][1]);
     }
     variantStr ='<div class="hk-u-text--white"><div class="hk-u-margin__1 hk-u-text__align--center"> <b> Select your Variant for ' + prodName + ':</b></div><div class="hk-u-margin__1"> Storage:<div class="hk-u-margin__1"> ' + storage + '</div></div><div class="hk-u-margin__1"> Color:<div class="hk-u-margin__1"> ' + color + '</div></div></div>';
  break;
}
if(varCode!=""){
    getTime(varCode);
}

*/

function getTime(varCode){
   var jsonArr = [{'sendStartTime': varCode}];
   jsonArr = JSON.stringify(jsonArr);
   var passBack = [];
   passBack['code'] = varCode;
   passBack = JSON.stringify(passBack);
   sendMessage(0, jsonArr, 0, startAutoBook, passBack);
 }

function startAutoBook(data, passBack){
  // console.log("Data Received " + data);
  saleTime = data;
  if(data!=0){
    // passBack = JSON.parse(passBack);
    var currentTime = Math.floor(Date.now() / 1000);
    if(data - currentTime > 3600){
        // More than 1 hr. Ask to subscribe/check already subscribed
       // sale over - nothing to do 
       // console.log("Case 1");
       checkSubscription(passBack);
    }
    else if(data - currentTime > 0 ){
         // console.log("Case 2");
        //  Ask for variant. Focus on sale
        //checkSubscription(passBack);
        startSale();
    }
    else if(currentTime - data >0){
       // sale over - nothing to do 
       //console.log("Case 3");
       // checkSubscription(passBack);
    }
  }
}

function startSale(){

  if(window.location.href.split("/hdindex/version/").length>1){
    // console.log('case 1 of startsale');
    if(!document.getElementById('pop-alert-ams')){
      $('body').append('<div id="pop-alert-ams" class="hk-green" style="display:block;height:150px!important;"><div id="p-logo"><img src="' + imgLogo + '"></div><div id="p-msg"><a target="_blank" style="text-decoration:none;color:white;font-size:14px;font-family:calibri" href="https://compare.buyhatke.com/options/#mi-details"><p>We will add ' + prodName + ' to the cart as soon as it is available for sale. Make sure you system timing is correct. Match it with http://bit.ly/2sEtPIP <br>Time Remaining : <span id="ourTimer"></span></p></a></div></div>'); 
    }
    else {
      $('#pop-alert-ams').html('<div id="p-logo"><img src="' + imgLogo + '"></div><div id="p-msg"><a target="_blank" style="text-decoration:none;color:white;font-size:14px;font-family:calibri" href="https://compare.buyhatke.com/options/#mi-details"><p>We will add ' + prodName + ' to the cart as soon as it is available for sale. Make sure you system timing is correct. Match it with http://bit.ly/2sEtPIP <br>Time Remaining : <span id="ourTimer"></span></p></a></div>'); 
    }
      
      attachMicroPhone();
      timer = setInterval(function(){
          var timeRemaining = Math.floor(Date.now() / 1000) - saleTime;
          if(timeRemaining >0){

          }
          else {
            clickTimer = setInterval(function(){
               document.querySelector('.section-total .btn-large').click();
               clearInterval(clickTimer);
            }, 100);
            timeRemaining = -1*timeRemaining;
            var hours = Math.floor(timeRemaining/3600);
            var remTime = timeRemaining - hours*3600;
            var minRemain = Math.floor(remTime/60);
            remTime = remTime - minRemain*60;
            if(hours < 10){
               hours = '0' + hours;
            }
            if(minRemain < 10){
               minRemain = '0' + minRemain;
            }
            if(remTime < 10){
               remTime = '0' + remTime;
            }
            document.getElementById('ourTimer').innerText = hours + ":" + minRemain + ":" + remTime;
          }
      },200);  
  }
  else if(window.location.href.split("/openbuy").length>1 ){
    // console.log('case 2 of startsale');
    if(!document.getElementById('pop-alert-ams')){
      $('body').append('<div id="pop-alert-ams" class="hk-green" style="display:block;height:auto;"><div id="p-logo"><img src="' + imgLogo + '"></div><div id="p-msg"><a target="_blank" style="text-decoration:none;color:white;font-size:14px;font-family:calibri" href="https://compare.buyhatke.com/options/#mi-details"><p>We will add ' + prodName + ' to the cart as soon as it is available for sale. Make sure you system timing is correct. Match it with http://bit.ly/2sEtPIP <br>Time Remaining : <span id="ourTimer"></span></p></a></div>' + variantStr + '</div>'); 
    }
    else {
      $('#pop-alert-ams').html('<div id="p-logo"><img src="' + imgLogo + '"></div><div id="p-msg"><a target="_blank" style="text-decoration:none;color:white;font-size:14px;font-family:calibri" href="https://compare.buyhatke.com/options/#mi-details"><p>We will add ' + prodName + ' to the cart as soon as it is available for sale. Make sure you system timing is correct. Match it with http://bit.ly/2sEtPIP <br>Time Remaining : <span id="ourTimer"></span></p></a></div>' + variantStr);
    } 

      attachMicroPhone();
      timer = setInterval(function(){
          var timeRemaining = Math.floor(Date.now() / 1000) - saleTime;
          if(timeRemaining >0){
            //console.log('nooo');
          }
          else {
            // clickTimer = setInterval(function(){
            //    document.querySelector('.section-total .btn-large').click();
            //    clearInterval(clickTimer);
            // }, 100);
            //console.log('yooo');
            timeRemaining = -1*timeRemaining;
            var hours = Math.floor(timeRemaining/3600);
            var remTime = timeRemaining - hours*3600;
            var minRemain = Math.floor(remTime/60);
            remTime = remTime - minRemain*60;
            if(hours < 10){
               hours = '0' + hours;
            }
            if(minRemain < 10){
               minRemain = '0' + minRemain;
            }
            if(remTime < 10){
               remTime = '0' + remTime;
            }
            document.getElementById('ourTimer').innerText = hours + ":" + minRemain + ":" + remTime;
          }
      },200);  
  }
}

function timeConverter(t) {     
   var a = new Date(t * 1000);
    var today = new Date();
    var yesterday = new Date(Date.now() - 86400000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    if(min<10){
      min = '0' + min;
    }
    if(hour >=12){
      var last = "PM";
    }
    else {
      var last = "AM";
    }
    if (a.setHours(0,0,0,0) == today.setHours(0,0,0,0))
        return 'today, ' + hour + ':' + min + " " + last;
    else if (a.setHours(0,0,0,0) == yesterday.setHours(0,0,0,0))
        return 'yesterday, ' + hour + ':' + min + " " + last;
    else if (year == today.getFullYear())
        return date + ' ' + month + ', ' + hour + ':' + min + " " + last;
    else
        return date + ' ' + month + ' ' + year + ', ' + hour + ':' + min + " " + last;
}

function checkSubscription(passBack){
  var passBack = JSON.parse(passBack);
  var jsonArr = [{'checkSubscription': varCode}];
   jsonArr = JSON.stringify(jsonArr);
   var passBack = [];
   passBack = JSON.stringify(passBack);
   sendMessage(0, jsonArr, 0, showSubsMessage, passBack);
}


function showSubsMessage(data, passBack){
  if(data==1){
       // console.log("FOund subscribed");
       if(!document.getElementById('pop-alert-ams')){
      $('body').append('<div id="pop-alert-ams" class="hk-green" style="display:block;height:235px!important;"><div id="p-logo"><img src="' + imgLogo + '"></div><div id="p-msg"><a target="_blank" style="text-decoration:none;color:white;font-size:14px;font-family:calibri" href="https://compare.buyhatke.com/options/#mi-details"><p>You are subscribed to ' + prodName + ' Flash Sale starting  ' + timeConverter(saleTime) + '.&nbsp;&nbsp;<br>Click me to change subscription settings.</p></a></div>' + variantStr + '</div>');
    }
    else{
      $('#pop-alert-ams').html('<div id="p-logo"><img src="' + imgLogo + '"></div><div id="p-msg"><a target="_blank" style="text-decoration:none;color:white;font-size:14px;font-family:calibri" href="https://compare.buyhatke.com/options/#mi-details"><p>You are subscribed to ' + prodName + ' Flash Sale starting  ' + timeConverter(saleTime) + '.&nbsp;&nbsp;<br>Click me to change subscription settings.</p></a></div>' + variantStr);
    }



      attachMicroPhone();
  }
  else {
     // console.log("Found unsuscribed");
    // a = "what about this";
    if(!document.getElementById('pop-alert-ams')){
    $('body').append('<div id="pop-alert-ams" class="hk-green" style="display:block;height:auto;"><div id="p-logo"><img src="' + imgLogo + '"></div><div id="p-msg"><a id="subscribeNow" target="_blank" style="text-decoration:none;color:white;font-size:14px;font-family:calibri" href="https://compare.buyhatke.com/options/#mi-details"><p>Click me to subscribe to autobook ' + prodName + ' during flash Sale starting  ' + timeConverter(saleTime) + '.&nbsp;&nbsp;<br> We will give variant selection option on the day of sale on this page.</p></a></div>' + variantStr + '</div>');
  }
  else{
    $('#pop-alert-ams').html('<div id="p-logo"><img src="' + imgLogo + '"></div><div id="p-msg"><a id="subscribeNow" target="_blank" style="text-decoration:none;color:white;font-size:14px;font-family:calibri" href="https://compare.buyhatke.com/options/#mi-details"><p>Click me to subscribe to autobook ' + prodName + ' during flash Sale starting  ' + timeConverter(saleTime) + '.&nbsp;&nbsp;<br> We will give variant selection option on the day of sale on this page.</p></a></div>' + variantStr);
  } 



    attachMicroPhone();
  }
}

function attachMicroPhone(){
  checkCurrent();
  $('.hk-c-radio').click(function(){
      saveVariant();
  })
} 

function saveVariant(){
  index1 = -1;
  index2 = -1;
  for(var m=0; m<$('.hk-c-radio input').length; m++){
     if($('.hk-c-radio input')[m].checked){
        if(m<line1){
           index1 = m;
        }
        else {
            index2 = m - line1;
        }
     }
  }
  if(index1==-1||index2==-1){
     setCookie('mi-flash', reqArray[0][0][2]);
  }
  else {
     setCookie('mi-flash', reqArray[index1][index2][2]);
  }
  // console.log("I was called " + index1 + ", " + index2);
}

function checkCurrent(){
   var pid = getCookie('mi-flash');
   // console.log(pid);
   if(pid!=""){
      var dim1 = reqArray.length;
      var dim2 = reqArray[0].length;
      for(var m=0;m<dim1; m++){
         for(var j=0;j<dim2; j++){
           if(reqArray[m][j][2]==pid){
              index1 = m;
              index2 = j;
              // console.log("Reverse " + m + " , " + (dim1 + j));
              $('.hk-c-radio input')[m].checked = true;
              $('.hk-c-radio input')[dim1+j].checked = true;
              break;
           }
         }
      }
   }
}


