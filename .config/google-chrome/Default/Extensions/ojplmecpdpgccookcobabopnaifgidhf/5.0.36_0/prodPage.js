// console.log("in limeroad ProdPage");
// var prodDetails = new Object();
prodDetailsTemp = getCookie("prodDetails");
if(prodDetailsTemp.length > 0)
{
	// console.log("am here in getCookie pp");
	// console.log("prodDetailsTemp "+prodDetailsTemp);
	var alreadyPresent = JSON.parse(prodDetailsTemp);
	finalDetails = alreadyPresent.products;
	if(Object.keys(finalDetails).length === 0)
	{
		var finalDetails = new Object();
	}
	else
	{
		// console.log("cookie value is");
		// console.log(JSON.stringify(finalDetails));
	}
	
}
else
{	
	// console.log("am not in getCookie");
	// var finalDetails = new Object();


	finalDetails = new Object();
	finalDetailsNew = new Object();
	finalDetailsNew["products"] = finalDetails;
	finalDetailsTemp = JSON.stringify(finalDetailsNew);
	// console.log("am here in setCookie pp");
	setCookie("prodDetails",finalDetailsTemp,1);

}
// var addToCart = '#add_to_cart';

function waitForPid(){

	if(typeof returnPID === "function")
	{
		pid = returnPID(url);
		prodDetails["pid"] = pid;
	}
	else
	{
		setTimeout(waitForPid, 2000);
	}
}



function getPathValue(key,path)
{
		var inEles = path.split(" ");var finalVal = "";
		this.document = document;
		var parentEle = this.document;
	     var classNotFound = 0;
	     // var key = "name";

	    parentEleLatest =document.querySelectorAll(inEles[0]);
		if(parentEleLatest.length > 1)
		{
			for(var out=0;out < parentEleLatest.length;out++)
			{
    			 parentEle = parentEleLatest[out]; var notComplete = true;
    			 for(var inner=1;inner<inEles.length;inner++)
    			 {
    			 		
    			 	if(inEles[inner].split("[").length > 1)
    				{
    					index = inEles[inner].split("[")[1];
    					index = index.split("]")[0];
    					pickClass = inEles[inner].split("[")[0];
    				}
    				else
    				{
    					index = 0;
    					pickClass = inEles[inner];
    				}
    				parentEle = parentEle.querySelectorAll(pickClass)[index];
    				if(parentEle == undefined)
    				{
    					notComplete = false;
    					break;
    				}
    			 }
    			 if(notComplete == true)
    			 {
    			 	 pIndx = out;
    			 	 break;
    			 }
			}
			if(typeof pIndx == "undefined")
			{
				return "";
			}
			else
			{
			parentEle = document.querySelectorAll(inEles[0])[pIndx];
			}
		}
		else if(parentEleLatest.length == 1)
		{
			//only 1 parent class
			if(inEles[0].split("#").length > 1)
			{
			parentEle = document.querySelector(inEles[0]);
			}
			else
			{
			parentEle = document.querySelectorAll(inEles[0])[0];
			}
		}


		for(var k =1;k<inEles.length;k++)
		{
			if(inEles[k].trim()=="")
			{
				continue;
			}
			if(inEles[k].split("#").length > 1)  //picked ele is id
			{
				// var pickID = inEles[k].split("#")[1].trim();
				parentEle = parentEle.querySelector(inEles[k].trim());
				// console.log(parentEle);
			}
			else if(inEles[k].split(".").length > 1) //picked ele is Class
			{
				if(inEles[k].split("[").length > 1)
				{
					index = inEles[k].split("[")[1];
					index = index.split("]")[0];
					pickClass = inEles[k].split("[")[0];
				}
				else
				{
					index = 0;
					pickClass = inEles[k];
				}
				parentEle = parentEle.querySelectorAll(pickClass)[index];

			}
			// else if(inEles[k].split("Tag~").length > 1) //picked ele is tag
			else
			{
				// tagTemp = inEles[k].split("Tag~")[1];
				tagTemp = inEles[k];
				if(tagTemp.split("[").length > 1)
				{
					index = tagTemp.split("[")[1];
					index = index.split("]")[0];
					pickClass = tagTemp.split("[")[0];
				}
				else
				{
					index = 0;
					pickClass = tagTemp;
				}
				parentEle = parentEle.querySelectorAll(pickClass)[index];

			}
			if(parentEle == null || parentEle == undefined)
			{
				// console.log("rejected "+inEles[k]);
				classNotFound = 1;
				break;
			}
    	
		}
		if(classNotFound == 0)
		{
			if(key == "image")
    		{
    			
    				// console.log("parentEle in key "+parentEle);
    				if(parentEle.getElementsByTagName('img')[0] != undefined)
					{
						finalVal = parentEle.getElementsByTagName('img')[0].getAttribute('src');
					}
					else
					{
						finalVal = parentEle.getAttribute("src");
					}
					imgLogo = finalVal;
					// console.log("imgLogo in key image is "+imgLogo);
    		}
    		else if(key.split("pid").length > 1)
    		{
    				if(parentEle.getElementsByTagName('a')[0] != undefined)
					{
						finalVal = parentEle.getElementsByTagName('a')[0].getAttribute('href');
					}
					else
					{
						finalVal = parentEle.getAttribute("href");
					}
					finalVal = window.location.host+finalVal;

					hostName = window.location.host;
					if(finalVal.toLowerCase().split(hostName.toLowerCase()).length > 1)
					{

					}
					else
					{
						finalVal = hostName+finalVal;
					}
    		}
    		else
    		{
    				// console.log("parentEle = ");
    			 //   console.log(parentEle);
		            var finalVal = parentEle.innerText;
		            // console.log("finalVal 1 = "+finalVal);

    		}
    		// console.log("finalVal = "+finalVal);

		}
		return finalVal;

}

function getProperData(field,value)
{
	var field = field.toLowerCase();
	value = " "+value+" ";
	// var keyArray = [];
	

	if(field.split("mobile").length > 1 || field.split("phone").length > 1 || field.split("landline").length > 1)
	{
			var phoneNumberRegex = '(([0-9][0-9](?:\\s|\\-)*[0-9]{8,10})|[^0-9A-Z]+([0-9]{3}(?:\\s|\\-)*[0-9]{4}(?:\\s|\\-)*[0-9]{4})[^0-9A-Z]+)';
			var phoneMatch = new RegExp(phoneNumberRegex, "gi");
			matches = phoneMatch.exec(value);

		var phoneNumber = "";
		if(matches)    // 22-24 jul
		{
			if(matches[1] != "undefined")
			{
				var phoneNumber = matches[1];
			}
			else if(matches[2] != "undefined")
			{
				var phoneNumber = matches[2];
			}		

		}
		return phoneNumber;

	}

	// if(field == "price")
	if(field == "price" || field.toLowerCase().split("subtotal").length > 1 || field.toLowerCase().split("total").length > 1 || field.toLowerCase().split("discount").length > 1 || field.toLowerCase().split("price").length > 1 || field.split("number").length > 1)
			    		
	{

		    // value = value.split("Rs.").join("");
			if(value.toLowerCase().split("from").length > 1)
			{
				value = value.toLowerCase().split("from")[1];
			}
			var modiValue = value.replace(/[^0-9.\s]/gi,'');
			modiValue = modiValue.replace(/\s{2,}/,' ');
			modiValue = modiValue.trim();
			modiValue = modiValue.replace(/^\.+/,'');
			modiValue = parseFloat(modiValue);			
		
			if(isNaN(modiValue))
			{
				return 0;
			}
			else
			{
				return modiValue;
			}

	}
	else if(field == "shippingcost")
	{
			if(value.toLowerCase().indexOf("free") !== -1)
				{
					return 0;
				}

			
			var modiValue = value.replace(/[^0-9.\s]/gi,'');
			modiValue = modiValue.replace(/\s{2,}/,' ');
			modiValue = modiValue.trim();
			modiValue = modiValue.replace(/^\.+/,'');
			modiValue = parseFloat(modiValue);			
		
			if(isNaN(modiValue))
			{
				return 0;
			}
			else
			{
				return modiValue;
			}
	}
	else if(field == "shippingdays")
	{
		   		var monthShorts = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
		   		var monthNames = ["january", "february", "march", "april", "may", "june","july", "august", "september", "october", "november", "december"];
				var retMonth = inArray(value,monthNames);
				var found = 0;
				if(retMonth.split("~")[0]=="1")
				{




						//extract date
						// console.log("case 1");
						var reqMonth = retMonth.split("~")[1];


						//check for jul 22 - 24
						findDate3 = '[^0-9A-Z]+(([0-9]+)(?:th|st|rd|nd)*[\\s]*(-)[\\s]*([0-9]+)(th|st|rd|nd)*)[^0-9A-Z]*'+reqMonth+'[^0-9A-Z]+';
						findDate4 = '[^0-9A-Z]+'+reqMonth+'[^0-9A-Z]*(([0-9]+)[\\s]*(-)[\\s]*([0-9]+))[^0-9A-Z]+';
						var matcher3 = new RegExp(findDate3, "gi");
						var matcher4 = new RegExp(findDate4, "gi");
						
						findDate1 = '[^0-9A-Z]+(([0-9]+)[^0-9A-Z]*(?:th|st|rd|nd)*[^0-9A-Z]*'+reqMonth+')[^0-9A-Z]+';
						findDate2 = '[^0-9A-Z]+('+reqMonth+'[^0-9A-Z]*(([0-9])+)[^0-9A-Z]*(?:th|st|rd|nd)*)[^0-9A-Z]+';
						var matcher1 = new RegExp(findDate1, "gi");
						var matcher2 = new RegExp(findDate2, "gi");

						matches = matcher3.exec(value);
						if(matches)    // 22-24 jul
						{
							// var deliveryDate = parseInt(matches[2]); // reqDate
							// console.log("22-24 jul case");
							found = 1;
							var deliveryDate = matches[1];
		              		deliveryDate = deliveryDate.replace(/[^0-9\-]/g,'');
							var today = new Date();
							var dd = today.getDate();
							var param1 = deliveryDate.split("-")[0];
							var param2 = deliveryDate.split("-")[1];
							var remdays1 = param1 - dd;
							var remdays2 = param2 - dd;

							if(remdays1 < 0)
							{
								remdays11 = param1-0;
								remdays12 = 30-dd;
								remdays1 = remdays11+remdays12;

							}
							if(remdays2 < 0)
							{
								remdays21 = param2-0;
								remdays22 = 30-dd;
								remdays2 = remdays21+remdays22;

							}
							var remdays = remdays1+"-"+remdays2;
							return remdays;
						}
						else
						{   
							matches = matcher4.exec(value);
							if(matches)    //jul 22 - 24
							{
								found = 1;
								// var deliveryDate = parseInt(matches[2]); // reqDate
								var deliveryDate = matches[1];
			              		deliveryDate = deliveryDate.replace(/[^0-9\-]/g,'');
								var today = new Date();
								var dd = today.getDate();
								var param1 = deliveryDate.split("-")[0];
								var param2 = deliveryDate.split("-")[1];
								var remdays1 = param1 - dd;
								var remdays2 = param2 - dd;

								if(remdays1 < 0)
								{
									remdays11 = param1-0;
									remdays12 = 30-dd;
									remdays1 = remdays11+remdays12;

								}
								if(remdays2 < 0)
								{
									remdays21 = param2-0;
									remdays22 = 30-dd;
									remdays2 = remdays21+remdays22;

								}

								var remdays = remdays1+"-"+remdays2;
								return remdays;
							}
							else      // 22 jul 
							{
								matches = matcher1.exec(value);
								if(matches)
								{
									found = 1;
									var deliveryDate = parseInt(matches[2]); // reqDate
									var today = new Date();
									var dd = today.getDate();
									var remdays = deliveryDate - dd;

									if(remdays < 0)
									{
										remdays11 = deliveryDate-0;
										remdays12 = 30-dd;
										remdays = remdays11+remdays12;

									}
						
									return remdays;
								}
								else
								{
									matches = matcher2.exec(value);
									if(matches)
									{
										found = 1;
										var deliveryDate = parseInt(matches[2]); // reqDate
										var today = new Date();
										var dd = today.getDate();
										var remdays = deliveryDate - dd;
										if(remdays < 0)
										{
											remdays11 = deliveryDate-0;
											remdays12 = 30-dd;
											remdays = remdays11+remdays12;

										}
										return remdays;
									}
								}
							}

						}



				}
				else if(inArray(value,monthShorts).split("~")[0] == "1")
				{
					//extract date
						// console.log("case 2");
						var retMonth = inArray(value,monthShorts);
					    var reqMonth = retMonth.split("~")[1];
						// console.log("case 1");
						var reqMonth = retMonth.split("~")[1];


						//check for jul 22 - 24
						findDate3 = '[^0-9A-Z]+(([0-9]+)(?:th|st|rd|nd)*[\\s]*(-)[\\s]*([0-9]+)(?:th|st|rd|nd)*)[^0-9A-Z]*'+reqMonth+'[^0-9A-Z]+';
						findDate4 = '[^0-9A-Z]+'+reqMonth+'[^0-9A-Z]*(([0-9]+)(?:th|st|rd|nd)*[\\s]*(-)[\\s]*([0-9]+)(?:th|st|rd|nd)*)[^0-9A-Z]+';
						var matcher3 = new RegExp(findDate3, "gi");
						var matcher4 = new RegExp(findDate4, "gi");
						
						findDate1 = '[^0-9A-Z]+(([0-9]+)[^0-9A-Z]*(?:th|st|rd|nd)*[^0-9A-Z]*'+reqMonth+')[^0-9A-Z]+';
						findDate2 = '[^0-9A-Z]+('+reqMonth+'[^0-9A-Z]*(([0-9])+)[^0-9A-Z]*(?:th|st|rd|nd)*)[^0-9A-Z]+';
						var matcher1 = new RegExp(findDate1, "gi");
						var matcher2 = new RegExp(findDate2, "gi");

						matches = matcher3.exec(value);
						if(matches)    // 22-24 jul
						{
							// var deliveryDate = parseInt(matches[2]); // reqDate
							// console.log("22-24 jul case");
							found = 1;
							var deliveryDate = matches[1];
		              		deliveryDate = deliveryDate.replace(/[^0-9\-]/g,'');
							var today = new Date();
							var dd = today.getDate();
							var param1 = deliveryDate.split("-")[0];
							var param2 = deliveryDate.split("-")[1];
							var remdays1 = param1 - dd;
							var remdays2 = param2 - dd;
							if(remdays1 < 0)
								{
									remdays11 = param1-0;
									remdays12 = 30-dd;
									remdays1 = remdays11+remdays12;

								}
								if(remdays2 < 0)
								{
									remdays21 = param2-0;
									remdays22 = 30-dd;
									remdays2 = remdays21+remdays22;

								}

							var remdays = remdays1+"-"+remdays2;
							return remdays;
						}
						else
						{   
							matches = matcher4.exec(value);

							if(matches)    //jul 22 - 24
							{
								// var deliveryDate = parseInt(matches[2]); // reqDate
								found = 1;
								var deliveryDate = matches[1];
			              		deliveryDate = deliveryDate.replace(/[^0-9\-]/g,'');
								var today = new Date();
								var dd = today.getDate();
								var param1 = deliveryDate.split("-")[0];
								var param2 = deliveryDate.split("-")[1];
								var remdays1 = param1 - dd;
								var remdays2 = param2 - dd;
								if(remdays1 < 0)
								{
									remdays11 = param1-0;
									remdays12 = 30-dd;
									remdays1 = remdays11+remdays12;

								}
								if(remdays2 < 0)
								{
									remdays21 = param2-0;
									remdays22 = 30-dd;
									remdays2 = remdays21+remdays22;

								}
								var remdays = remdays1+"-"+remdays2;
								return remdays;
							}
							else      // 22 jul 
							{
								matches = matcher1.exec(value);
								if(matches)
								{
									found = 1;
									var deliveryDate = parseInt(matches[2]); // reqDate
									var today = new Date();
									var dd = today.getDate();
									var remdays = deliveryDate - dd;
									if(remdays < 0)
									{
										remdays11 = deliveryDate-0;
										remdays12 = 30-dd;
										remdays = remdays11+remdays12;

									}
									return remdays;
								}
								else
								{
									matches = matcher2.exec(value);
									if(matches)
									{
										found = 1;
										var deliveryDate = parseInt(matches[2]); // reqDate
										var today = new Date();
										var dd = today.getDate();
										var remdays = deliveryDate - dd;
										if(remdays < 0)
										{
											remdays11 = deliveryDate-0;
											remdays12 = 30-dd;
											remdays = remdays11+remdays12;

										}
										return remdays;
									}
								}
							}

						}

				}

				if(found == 0)
				{
						if(value.toLowerCase().split("tomorrow").length > 1)
						{
								return 1;
						}
						else if(value.toLowerCase().split("today").length > 1)
						{
								return 1;
						}
						else if(value.toLowerCase().split("day").length > 1)  //2 - 4 business days
						   {
						   		days = value.toLowerCase().split("day")[0];
						   		// value.replace
				              regex = /(?:[^0-9A-Z\s]*)([0-9]+)[\s]*(-)[\s]*([0-9]+)(?:[^0-9A-Z\s]*)/gi;
				              matches = regex.exec(value);
				              if(matches)
				              {
				              		reqValue = matches[0];
				              		reqValue = reqValue.replace(/\s+/g,'');
				              		return reqValue;
				              }
				              else
				              {
				              		value1 = days.replace(/[^0-9\s]/g,'');
				              		value1 = value1.trim();
				              		// parseInt(value1);
				              		if(isNaN(parseInt(value1)))
				              		{
				              			if(value.toLowerCase().split("same").length > 1)
				              			{
				              				return 1;
				              			}
				              			else
				              			{
				              				return 0;
				              			}
				              		}
				              		else
				              		{
				              			return parseInt(value1);
				              		}
				              }
				              
						   }
						 else if(value.toLowerCase().split("week").length > 1)
						 {
						 	  // weeks = value.split("week");
						   	
				              regex = /(?:[^0-9A-Z\s]*)(([0-9]+)[\s]*(-)[\s]*([0-9]+))[^0-9A-Z]*(week|weeks)/gi;  // 1 - 3 weeks
				              matches = regex.exec(value);
				              if(matches)
				              {
				              		reqValue = matches[1];
				              		reqValue = reqValue.replace(/\s+/g,'');
				              		reqValue1 = reqValue.split("-");
				              		param1 = reqValue1[0]*7;
				              		param2 = reqValue1[1]*7;
				              		return param1+"-"+param2;
				              }
				              else     // 1 week
				              {
				              		regex = /(?:[^0-9A-Z\s]*)([0-9]+)[^0-9A-Z]*(week|weeks)/gi;  // 1 week
				              		matches = regex.exec(value);
				              		if(matches)
				              		{
				              			  reqValue = matches[1];
				              			  reqValue = reqValue.replace(/\s+/g,'');
				              			  reqValue = reqValue*7;
				              			  return reqValue;
				              		}

				              }
						 }
						 else if(value.toLowerCase().split("hour").length > 1)
						 {
						 	  regex = /(?:[^0-9A-Z\s]*)(([0-9]+)[\s]*(-)[\s]*([0-9]+))[^0-9A-Z]*(hour|hours)/gi;  // 1 - 3 weeks
				              matches = regex.exec(value);
				              if(matches)
				              {
				              		reqValue = matches[1];
				              		reqValue = reqValue.replace(/\s+/g,'');
				              		reqValue1 = reqValue.split("-");

				              		param1 = reqValue1[0]/24;
				              		param2 = reqValue1[1]/24;
				              		param1 = parseInt(param1);
				              		param2 = parseInt(param2);
				              		if(param1 == 0 && param2 == 0)
				              		{
				              			return 1;
				              		}
				              		return param1+"-"+param2;
				              }
				              else     // 1 week
				              {
				              		regex = /(?:[^0-9A-Z\s]*)([0-9]+)[^0-9A-Z]*(hour|hours)/gi;  // 1 week
				              		matches = regex.exec(value);
				              		if(matches)
				              		{
				              			  reqValue = matches[1];
				              			  reqValue = reqValue.replace(/\s+/g,'');
				              			  reqValue = reqValue/24;
				              			  if(parseInt(reqValue)==0)
				              			  {
				              			  	return 1;
				              			  }
				              			  return reqValue;
				              		}

				              }
						 }
				}
			

			

	}
	else if(field == "image")
	{
		if(value.split(".png").length > 1 || value.split(".jpg").length > 1 || value.split(".jpeg").length >1 || value.split(".gif").length > 1 || value.split(".webp").length > 1 )
		{
			return value;
		}
		else
		{
			return "invalid image selected ";
		}
	}
	else if(field == "outstock")
	{
		
		 	return value;
		 
	}
	else if(field == "instock")
	{
		 
		 	return value;
		
	}
	else if(field == "address")
	{
		var phoneNumberRegex = '(([0-9][0-9](?:\\s|\\-)*[0-9]{8,10})|[^0-9A-Z]+([0-9]{3}(?:\\s|\\-)*[0-9]{4}(?:\\s|\\-)*[0-9]{4})[^0-9A-Z]+)';
		var phoneMatch = new RegExp(phoneNumberRegex, "gi");
		matches = phoneMatch.exec(value);
		if(matches)    // 22-24 jul
		{
			if(matches[1] != "undefined")
			{
				var phoneNumber = matches[1];
			}
			else if(matches[2] != "undefined")
			{
				var phoneNumber = matches[2];
			}
			else
			{
				phoneNumber ="";
			}
			// keyArray["phoneNumber"] = phoneNumber;
			value = phoneNumber+"~@~"+value;
		}
	}
	else if(field == "orderid")
	{
		var orderidRegex = '([^0-9A-Z\-]+(([0-9\-]+[A-Z]+|[A-Z]+[0-9\-]+)[0-9A-Z\-]{7,})|([0-9\-]{7,})[^0-9A-Z\-]+)';
		var orderid = new RegExp(orderidRegex, "gi");
		matches = orderid.exec(value);
		var orderid = "";

		if(matches)    // 22-24 jul
		{
			if(typeof matches[2] !== "undefined")
			{
				orderid = matches[2];
			}
			else if(typeof matches[4] !== "undefined")
			{
				orderid = matches[4];
			}

		}

		return orderid;

	}
	value = value.replace(/\r?\n|\r/g,' ');
	value = value.trim();
	// keyArray[field] = value;
	return value;

}


function inArray(needle, haystack) {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(needle.toLowerCase().indexOf(haystack[i]) !== -1) return "1~"+haystack[i];
    }
    return "0~";
}

function inArray1(needle, haystack) {
	needle = needle.toLowerCase();
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(needle.indexOf(haystack[i]) !== -1) return 1;
    }
    return 0;
}