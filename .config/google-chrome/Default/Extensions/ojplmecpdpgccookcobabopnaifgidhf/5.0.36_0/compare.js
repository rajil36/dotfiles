var myDiv = "<div id='helloSaysPrashant'></div>";
var ext_id = '';
var ext_auth = '';
var flagEscape = -1;


  flagEscape = 0;

function checkNew(){

if(flagEscape==0){



$(document).on('change', '.fttype-1', function(){
   changeSubsType();
});



if(localStorage.register==1){
   sendRegisterValues();
}




setExtNameCook();



 getExtID();




setExtIDCook();








getTypes();







setExt_authCook();

$('#footer').after(myDiv);

console.log("Not escaping");

}
else if(flagEscape==1){
  console.log("Escaping");
}
else {
   console.log("retrying ...");
   setTimeout(function(){checkNew()},3000);
}
}

checkNew();




function changeSubsType(){
   var type = ""; 
   for(var k=0;k<document.getElementsByClassName('fttype-1').length;k++){
        if(document.getElementsByClassName('fttype-1')[k].checked){
          if(type==""){
            type = document.getElementsByClassName('fttype-1')[k].value;
          }
          else {
            type += "," + document.getElementsByClassName('fttype-1')[k].value;
          }
        }
   }
   if(type==""){
      type = 0;
   }
   var jsonArr = [{'setNotifType': type}];
   jsonArr = JSON.stringify(jsonArr);
   sendMessage(0, jsonArr, 0, doNothing, []);
   console.log("Subs type changed " + type);
}

function setExt_authCook(){
   if(ext_auth==''){
      setTimeout(function(){setExt_authCook();}, 1000);
   }
   else {
      setCookie("ext_auth", ext_auth, 100000);
   }
}

function getTypes(){
   // Gets all current alerts list
   var jsonArr = [{'getTypesCurrent': 'haiKya'}];
   jsonArr = JSON.stringify(jsonArr);
   var passBack = [];
   passBack = JSON.stringify(passBack);
   sendMessage(0, jsonArr, 0, setTypes, passBack);
 }


function setTypes(data, passBack){
   console.log(data);
   for(var k=0;k<document.getElementsByClassName('fttype-1').length;k++){
        if(data.split(document.getElementsByClassName('fttype-1')[k].value).length>1){
            document.getElementsByClassName('fttype-1')[k].checked = true;
        }
   }
}



function setExtIDCook(){
   if(ext_id==''){
      setTimeout(function(){setExtIDCook();}, 1000);
   }
   else {
      setCookie("ext_id", ext_id, 100000);
   }
}

function setExtID(data, passBack){
  ext_id = data; 
}

function getExtID(){
   // Gets all current alerts list
   var jsonArr = [{'extId': 'haiKya'}];
   jsonArr = JSON.stringify(jsonArr);
   var passBack = [];
   passBack = JSON.stringify(passBack);
   sendMessage(0, jsonArr, 0, setExtID, passBack);
 }

 function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+d.toGMTString();
  document.cookie = cname + "=" + cvalue + "; " + expires + "; path=.buyhatke.com" ;
}

function setExtNameCook(){
   if(extName==''){
      setTimeout(function(){setExtNameCook();}, 1000);
   }
   else {
      setCookie("ext_name", extName, 100000);
   }
}

function sendRegisterValues(){
   var jsonArr = [{'regisDone': 'setValue'}];
   jsonArr = JSON.stringify(jsonArr);
   var passBack = [];
   passBack = JSON.stringify(passBack);
   sendMessage(0, jsonArr, 0, doNothing, passBack);
}

