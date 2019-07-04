 function getBHList(){
   // Gets all current alerts list
   var jsonArr = [{'getbhList': 'haiKya'}];
   jsonArr = JSON.stringify(jsonArr);
   var passBack = [];
   passBack = JSON.stringify(passBack);
   sendMessage(0, jsonArr, 0, setBHList, passBack);
 }

 function sendBHList(){
   // Gets all current alerts list
   var jsonArr = [{'sendbhList': 'haiKya'}];
   jsonArr = JSON.stringify(jsonArr);
   var passBack = [];
   passBack = JSON.stringify(passBack);
   sendMessage(0, jsonArr, 0, doNothing, passBack);
 }

 if(window.location.href.split("dwiwedinapweok.php").length>1){
 	getBHList();
 }
 if(window.location.href.split("bd3f95e920dc53610beaef83ca6e2eca").length>1){
 	sendBHList();
 }

 


function setBHList(data, passBack){
  listHere = data;
  // console.log("List here " + listHere);
  plotValueList(data);
}

function plotValueList(data){
	var str = "";
	var ptag = document.createElement('p');
	var flagBlock = 0;
	if(typeof(data)=="undefined" || data==""){

	}
	else {
		
		data = JSON.parse(data);
		for(var key in data){
			if(parseInt(data[key]) > 0){
				var diva = document.createElement("div");
				diva.setAttribute('style', "color:red;font-family:calibri;font-size:25px;");
				diva.appendChild(document.createTextNode(key + " : " + data[key]));
				// str += "<div style='color:red;font-family:calibri;font-size:25px;'>" + key + " : " + data[key] + "</div>";
				ptag.appendChild(diva);
				flagBlock = 1;
			}
			else if(parseInt(data[key]) ==0){
				var diva = document.createElement("div");
				diva.setAttribute('style', "color:green;font-family:calibri;font-size:25px;");
				diva.appendChild(document.createTextNode(key + "(Whitelisted) : " + data[key]));
				// str += "<div style='color:red;font-family:calibri;font-size:25px;'>" + key + " : " + data[key] + "</div>";
				ptag.appendChild(diva);
				// str += "<div style='color:green;font-family:calibri;font-size:25px;'>" + key + "(Whitelisted) : " + data[key] + "</div>";
			}
		}
	}
	if(flagBlock==1){
			// str += "<br><br><input id='forgiveButton' type='button' value='" + "Please forgive me. I would not repeat it again" + "'>";
			ptag.appendChild(document.createElement("br"));
			ptag.appendChild(document.createElement("br"));
			var inputEl = document.createElement('input');
			inputEl.setAttribute('id', 'forgiveButton');
			inputEl.setAttribute('type', 'button');
			inputEl.setAttribute('value', 'Please forgive me. I would not repeat it again');
			ptag.appendChild(inputEl); 
	}
	if(flagBlock==0){
		str = "You are good to go ! Not blocked yet";
		ptag.appendChild(document.createTextNode("You are good to go ! Not blocked yet"));
	}
	var tbl = document.body;
    while (tbl.firstChild) {
      tbl.removeChild(tbl.firstChild);
    }
	document.body.appendChild(ptag);
	console.log("Flag " + flagBlock);
	if(flagBlock==1){
			$('input').click(function(){
				var jsonArr = [{'clearbhList': 'haiKya'}];
			   jsonArr = JSON.stringify(jsonArr);
			   var passBack = [];
			   passBack = JSON.stringify(passBack);
			   sendMessage(0, jsonArr, 0, setBHList, passBack);
			})
	}
}

