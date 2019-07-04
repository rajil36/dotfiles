url = window.location.href;
var generatedData = new Array();
// var cart_items = '.items-in-cart';
// var alreadyPresent = new Object();
// var cur_page = 'https://www.voonik.com/checkout/payment';
waitTillCart()
// var payment_page = '.deliver-to-address';
// console.log("checking waitTillCart");
// var alreadyEntered = 0;
var callCart;
// var alreadyPresentTemp;
function waitTillCart()
{
	// if(typeof returnPID === "function")
	// console.log("callimg waitTillCart");
	if(document.querySelector(cart_items)!=undefined && document.querySelectorAll(cart_items).length >= 1 && isVisible(document.querySelector(cart_items)))
	{
		// console.log("came to cart page ");
		alreadyPresentTemp = getCookie("prodDetails");
		if(alreadyPresentTemp != "")
		{
			if(alreadyPresentTemp.length > 0)
			{
				alreadyPresentTemp = JSON.parse(alreadyPresentTemp);
				alreadyPresent = alreadyPresentTemp.products;
				
			}
		}
		else //define the cookie
		{
			// console.log("am not in getCookie");
			// var finalDetails = new Object();
			finalDetails = new Object();
			finalDetailsNew = new Object();
			finalDetailsNew["products"] = finalDetails;
			finalDetailsTemp = JSON.stringify(finalDetailsNew);
			setCookie("prodDetails",finalDetailsTemp,1);
			alreadyPresentTemp = getCookie("prodDetails");
			alreadyPresentTemp = JSON.parse(alreadyPresentTemp);
			alreadyPresent = alreadyPresentTemp.products;
		}
		
		// console.log("prev cookie "+ alreadyPresent);
		extractPostLoad();
		// console.log("cart page before alreadyEntered");
		// alreadyEntered = 1;
		 clearInterval(callCart);
	     callCart = setInterval(function(){urlChange();},2000);

		// if(url.split(cur_page) > 1)
	}
	else
	{
		setTimeout(waitTillCart, 2000);
	}
}

var curl=window.location.href;

function urlChange()
{
	// console.log("curl "+curl);
	// console.log("window url "+window.location.href);
   if(window.location.href==curl)
   {
   

   }
   else
   {
    curl=window.location.href;
    alreadyPresentTemp = getCookie("prodDetails");
		if(alreadyPresentTemp.length > 0)
		{
			alreadyPresentTemp = JSON.parse(alreadyPresentTemp);
			alreadyPresent = alreadyPresentTemp.products;
			
		}
		else
		{
			finalDetails = new Object();
			finalDetailsNew = new Object();
			finalDetailsNew["products"] = finalDetails;
			finalDetailsTemp = JSON.stringify(finalDetailsNew);
			setCookie("prodDetails",finalDetailsTemp,1);
			alreadyPresentTemp = getCookie("prodDetails");
			alreadyPresentTemp = JSON.parse(alreadyPresentTemp);
			alreadyPresent = alreadyPresentTemp.products;

		}
		extractPostLoad();
   }

}

waitTillPayment();
function waitTillPayment()
{
	// if(document.querySelectorAll(payment_page).length >= 1)
	if(document.querySelector(payment_page)!=undefined && document.querySelectorAll(payment_page).length >= 1 && isVisible(document.querySelector(payment_page)))
	{

		clearInterval(callCart);
		// console.log("came to payment page");
		alreadyPresentTemp = getCookie("prodDetails");
		if(alreadyPresentTemp.length > 0)
		{
			alreadyPresentTemp = JSON.parse(alreadyPresentTemp);
			alreadyPresent = alreadyPresentTemp.products;
			
			
		}
		else
		{
			finalDetails = new Object();
			finalDetailsNew = new Object();
			finalDetailsNew["products"] = finalDetails;
			finalDetailsTemp = JSON.stringify(finalDetailsNew);
			setCookie("prodDetails",finalDetailsTemp,1);
			alreadyPresentTemp = getCookie("prodDetails");
			alreadyPresentTemp = JSON.parse(alreadyPresentTemp);
			alreadyPresent = alreadyPresentTemp.products;

		}
		
		extractPostLoad();
	}
	else
	{
		setTimeout(waitTillPayment,2000);
	}

}


function isVisible( elem ) 
{ 
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
}


function extractPostLoad()
{
	// document.querySelector(placeOrder).click(function(){ 
		// var finalData = new Object();
		//add something to cookie
		for(var key in alreadyPresent)
			{
				alreadyPresent[key]["flag"] = 0;
			}

		// console.log("alreadyPresent at extractPostLoad "+JSON.stringify(alreadyPresent));
		// console.log("am here in extractPostLoad");
		hostName = window.location.host;
		var phoneNumber = "";
		// console.log("allPaths "+allPaths);

		allPathsTemp = JSON.parse(allPaths);
		var genData = new Array();
		var allPids = new Array();
		for (key in allPathsTemp) {
			
			if(allPathsTemp[key]['cartPath'] != undefined)
			{
				var inputType = allPathsTemp[key]["inputType"];
				allPathsKey = allPathsTemp[key]['cartPath'];
				var allGenVals = new Array();
				for(var ap=0;ap < allPathsKey.length;ap++)
			    {
			    	// var finalValue = "";
			    	// console.log("current Path "+allPathsKey[ap]);
			    	// console.log("inputType = "+inputType);
			    	// console.log("key = "+key);
			    	// console.log("allPathsKey[ap] "+allPathsKey[ap]);
			    	allValues = showAllGeneral(inputType,key,allPathsKey[ap]);
			    	// console.log("allValues "+JSON.stringify(allValues));
			    	for(var av=0;av<allValues.length;av++)
		    		{
		    			// search for those pids in cookie

		    			finalValTemp = getProperData(key,allValues[av]);
		    			// finalValTemp = allValues[av];
		    			if(typeof finalValTemp == "string" && finalValTemp.split("~@~").length > 1)
		    			{
		    				phNo = finalValTemp.split("~@~")[0];
		    				if(phNo.trim()!="")
		    				{
		    					// finalData["phoneNumber"] = phNo;
		    					phoneNumber = phNo;
		    				}
		    				value = finalValTemp.split("~@~")[1];
		    				// value = getProperData(key,value);
		    			}
		    			else
		    			{
		    				value = finalValTemp;
		    			}

		    			// finalData[key+"_"+av] = value;
		    			if(key == "pid")
		    			{
		    				if(website == 2)
		    				{

		    				}
		    				else
		    				{
		    					value = value.split("?")[0];
			    				value = value.trim();
			    				if(value.toLowerCase().split(hostName.toLowerCase()).length > 1)
								{

								}
								else
								{
									value = hostName+value
								}

		    				}
		    				
		    				value = returnPID(value);
		    				// console.log("pid value = " + value);
		    				allGenVals[av] = value;
		    			}
		    			else
		    			{
		    				allGenVals[av] = value;

		    			}
		    			// console.log("current Values "+value);
		    		}

		    		// console.log("allGenVals "+JSON.stringify(allGenVals));
		    		// console.log("-------------------------------------------------------------------------");
			    }
				
			   generatedData[key] =  allGenVals;

			}

		}

		allPathsTemp = JSON.parse(allPathsGen);
		for (key in allPathsTemp) {
			
			if(allPathsTemp[key]['path'] != undefined)
			{
				    allPathsKey = allPathsTemp[key]['path'];
				    var finalValue = "";
				    for(var ap=0;ap < allPathsKey.length;ap++)
				    {
				    	// var finalValue = "";
				    	// console.log("current Path "+allPathsKey[ap]);
				    	value = getPathValue(key,allPathsKey[ap]);
				    	// console.log("current value "+value);
				    	if(value!="")
				    	{
				    		finalValue  = getProperData(key,value);

				    		// console.log("after properValue "+ finalValue);
				    		if(typeof finalValue == "string" && finalValue.split("~@~").length > 1)
			    			{
			    				phNo = finalValue.split("~@~")[0];
			    				if(phNo.trim()!="")
			    				{
			    					// finalData["phoneNumber"] = phNo;
			    					phoneNumber = phNo.trim();
			    				}
			    				value = finalValue.split("~@~")[1];
			    				finalValue = value;
			    				// value = getProperData(key,value);
			    			}
			    			else
			    			{
			    				value = finalValue;
			    			}

							if(key.toLowerCase().split("price").length > 1)
							{
								if(ap==0){
									minPrice = parseInt(finalValue);
								}
								else
								{

									minPrice = Math.min(minPrice,finalValue);
								}
								finalValue = minPrice;
							}
							else
							{
								break;	
							}
				    	}
						

				    }
				    // console.log("finalValue "+finalValue);
				   	genData[key] = finalValue;
			}

		}
		// console.log("generated Data ");
		// console.log(genData);

		allPids = generatedData["pid"];

		var finalPIDList = new Object();
		for(ep=0;ep<allPids.length;ep++)
		{
			// console.log("allPids[allIndexes] "+allPids[ep]);
			if(allPids[ep]=="" || allPids[ep]==0)
			{
				continue;
			}
			var curPid =allPids[ep];
			var formatedData = new Object();
			for(var eachKey in generatedData)
			{
				if(eachKey == "pid" || eachKey == "")
				{
					continue;
				}
				attrVals = generatedData[eachKey];
				// console.log("allVals "+attrVals[ep]);
				eachKeyVal = attrVals[ep];
				// console.log("eachKey "+eachKey);
				formatedData[eachKey] = eachKeyVal;
			}
			// console.log("-----------------------------------");
			// console.log("allPids[ep] "+ allPids[ep]);
			// console.log(JSON.stringify(formatedData));
			finalPIDList[curPid] = formatedData;
		}
		// console.log("finalPIDList ");
		// console.log(JSON.stringify(finalPIDList));
		var modifiedData = new Object();
		if(Object.keys(finalPIDList).length === 0)
		{
			for(var key in alreadyPresent)
			{
				alreadyPresent[key]["flag"] = 1;
			}
			modifiedData = alreadyPresent;
		}
		else
		{
			for(var key in finalPIDList)
			{
				kvPairs = finalPIDList[key];
				// for(var ap=0;ap<alreadyPresent.length;ap++)
				// {
					
					if(!(alreadyPresent[key]))
					{
						// console.log("kvPairs "+ JSON.stringify(kvPairs));
						// console.log("key "+key);
						// alreadyPresent[key] = kvPairs;
						modifiedData[key] = kvPairs;
						modifiedData[key]["flag"] = 1;
					}
					else{

						apVals = alreadyPresent[key];
						// console.log("else part of key match");
						// console.log(apVals);
						for(var keyin in kvPairs)
						{
							if(!(keyin in apVals))
							// if(typeof apVals[keyin] == "undefined")
							{
								apVals[keyin] = new Object();
								apVals[keyin] = kvPairs[keyin];
							}
							else
							{
								apVals[keyin] = kvPairs[keyin];
							}
						}
						apVals["flag"] = 1;
						modifiedData[key] = apVals;
						// modifiedData[key]["flag"] = 1;
					}
										// }
					// else
					// {
					// 	//insert it
						

					// }
					
				// }
		
			}
		}

		for(var key in modifiedData)
		{

			if(modifiedData[key]["flag"] == 0)
			{
				// var test = {'red':'#FF0000', 'blue':'#0000FF'};
				delete modifiedData[key]; // or use => delete test['blue'];
				// console.log(test);
			}
		}
		// var pData = new Object();
		alreadyPresentTemp["products"] = modifiedData;
		if(phoneNumber!="")
		{
			alreadyPresentTemp["phoneNumber"] = phoneNumber;
		}
		// console.log("genData");
		// console.log(genData);
		for(key in genData)
		{
			if(genData[key]=="")
			{
				continue;
			}
			alreadyPresentTemp[key] = genData[key];
		}
		// for(var ep in alreadyPresentTemp["products"])
		// {
		// 	console.log("each Product "+ JSON.stringify(ep));
		// }
		finalDetailsNew = JSON.stringify(alreadyPresentTemp);
		// console.log("yo in cart page");
		// console.log("finalDetailsNew "+finalDetailsNew);
		setCookie("prodDetails",finalDetailsNew,1);

		//update with recent value



	// });

}

function showAllGeneral(inputType,key,generalPath) 
{
	// ".productItemInfo[-] .product[0] .cart-product-info[0] .product-name[0] a[0] "
	var selector = this.document;
	var allPaths = generalPath.split(" ");
	var valueArray = [];var va=0;
	for(var i=0;i<allPaths.length;i++)
	{

		if(allPaths[i].trim()=="")
		{
			continue;
		}
		if(allPaths[i].split("[-").length > 1)
		{
			var temp = allPaths[i].split("[-")[0];

			var mulPaths = selector.querySelectorAll(temp);
			for(var j=0;j<mulPaths.length;j++)
			{
				// if(mulPaths[j].className.split("delete").length > 1 || mulPaths[j].className.split("remove").length > 1)
				// {
				// 	console.log("in delete/remove in mulPaths ");
				// 	valueArray = [];
				// 	return valueArray;
				// 	// continue;
				// }
				var eachPath = selector.querySelectorAll(temp)[j];var valid = true;

				var eleTill = eachPath;
				for(var k=i+1;k<allPaths.length;k++)
				{
					// if(eleTill.className.split("delete").length > 1 || eleTill.className.split("remove").length > 1)
					// {
					// 	console.log("in delete/remove in allPaths ");
					// 	valueArray = [];
					// 	return valueArray;
					// 	// break;
					// }

					if(allPaths[k].trim()=="")
					{
						continue;
					}
					if(allPaths[k].split("[").length > 1)
					{
						var eachChild = allPaths[k].split("[")[0];
						var eachIndex = allPaths[k].split("[")[1];
						eachIndex = eachIndex.split("]")[0];
					}
					else
					{
						var eachChild = allPaths[k];
						var eachIndex = 0;
					}
					eleTill = eleTill.querySelectorAll(eachChild)[eachIndex];
					if(eleTill==undefined)
					{
						valid = false;
						valueArray[va++] = "";
						break;
					}
				}
				if(valid == true)
				{
					properIndex = j;


					// if(key.split("pid").length > 1)
					if(inputType == "url")
					{
						if(eleTill.getElementsByTagName('a')[0] != undefined)
						{
							value = eleTill.getElementsByTagName('a')[0].getAttribute('href');
						}
						else
						{
							value = eleTill.getAttribute("href");
						}
						
						hostName = window.location.host;
						if(value.toLowerCase().split(hostName.toLowerCase()).length > 1)
						{

						}
						else
						{
							value = hostName+value;
						}

						protocol = window.location.protocol;
						if(value.toLowerCase().split(protocol.toLowerCase()).length > 1)
						{

						}
						else
						{
							value = protocol+"//"+value;
						}

						valueArray[va++] = value;
					}
					else if(inputType == "dropdown")
					{
						 // allElements[0].options[allElements[0].selectedIndex].value
						 // value = eleTill.options[eleTill.selectedIndex].value;
						 // valueArray[va++] = value;

						 value = eleTill.options[eleTill.selectedIndex].innerText;
						 valueArray[va++] = value;

					}
					else if(inputType == "text")
					{
						if(key == "size")
						{
							if(eleTill.innerText.toLowerCase().split("size:").length > 1)
							{
								val = eleTill.innerText.toLowerCase().split("size:")[1];
								valueArray[va++] = val;

							}
							else if(eleTill.innerText.toLowerCase().split("size :").length > 1)
							{
								val = eleTill.innerText.toLowerCase().split("size :")[1];
								valueArray[va++] = val;
							}
							else if(eleTill)
							{
								val = eleTill.innerText.toLowerCase();
								valueArray[va++] = val;
								// valueArray[va++] = "";
							}
						}
						else if(website == 2 && key == "price")
						{
							if( eleTill.innerText.toLowerCase().split("offers").length > 1)
							{

								val = eleTill.innerText.toLowerCase().split("offers")[0];
								val = val.trim();
								val = val.slice(0, -1)
								valueArray[va++] = val;
							}
							else
							{
								valueArray[va++] = eleTill.innerText;
							}
						}
						else
						{
							valueArray[va++] = eleTill.innerText;

						}

					}
					else if(inputType == "input")
					{
						value = eleTill.value;
						valueArray[va++] = value;
					}

				}
			}
			return valueArray;
		}
		else if(allPaths[i].split("~$~").length > 1)
		{
			if(allPaths[i].split('#').length > 1)
			{
				var temp = allPaths[i].split("~$~")[0];
				temp = temp.split("#")[1];
				var mulPaths = document.querySelectorAll("[id^='"+temp+"']");
			}
			else if(allPaths[i].split('.').length > 1){
				var temp = allPaths[i].split("~$~")[0];
				temp = temp.split(".")[1];
				var mulPaths = document.querySelectorAll("[class^='"+temp+"']");
			}
			// var mulPaths = selector.querySelectorAll(temp);
			for(var j=0;j<mulPaths.length;j++)
			{
				// var eachPath = selector.querySelectorAll(temp)[j];
				var eachPath = mulPaths[j];
				var valid = true;
				var eleTill = eachPath;
				for(var k=i+1;k<allPaths.length;k++)
				{
					if(allPaths[k].trim()=="")
					{
						continue;
					}
					if(allPaths[k].split("[").length > 1)
					{
						var eachChild = allPaths[k].split("[")[0];
						var eachIndex = allPaths[k].split("[")[1];
						eachIndex = eachIndex.split("]")[0];
					}
					else
					{
						var eachChild = allPaths[k];
						var eachIndex = 0;
					}
					eleTill = eleTill.querySelectorAll(eachChild)[eachIndex];
					if(eleTill==undefined)
					{
						valid = false;
						break;
					}
				}
				if(valid == true)
				{
					properIndex = j;


					// if(key.split("pid").length > 1)
					if(inputType == "url")
					{
						if(eleTill.getElementsByTagName('a')[0] != undefined)
						{
							value = eleTill.getElementsByTagName('a')[0].getAttribute('href');
						}
						else
						{
							value = eleTill.getAttribute("href");
						}
						
						hostName = window.location.host;
						if(value.toLowerCase().split(hostName.toLowerCase()).length > 1)
						{

						}
						else
						{
							value = hostName+value;
						}

						valueArray[va++] = value;
					}
					else if(inputType == "dropdown")
					{
						 // allElements[0].options[allElements[0].selectedIndex].value
						 value = eleTill.options[eleTill.selectedIndex].value;
						 valueArray[va++] = value;

					}
					else if(inputType == "text")
					{
						if(key == "size")
						{
							if(eleTill.innerText.toLowerCase().split("size:").length > 1)
							{
								val = eleTill.innerText.toLowerCase().split("size:")[1];
								valueArray[va++] = val;

							}
							else if(eleTill.innerText.toLowerCase().split("size :").length > 1)
							{
								val = eleTill.innerText.toLowerCase().split("size :")[1];
								valueArray[va++] = val;
							}
							else if(eleTill)
							{
								val = eleTill.innerText.toLowerCase();
								valueArray[va++] = val;
								// valueArray[va++] = "";
							}
						}
						else
						{
							valueArray[va++] = eleTill.innerText;

						}

					}

				}
			}
			return valueArray;


		}
		else
		{
			if(allPaths[i].split("[").length > 1)
			{
				pickClass = allPaths[i].split("[")[0];
				pickIndex = allPaths[i].split("[")[1];
				pickIndex = pickIndex.split("]")[0];
			}
			else
			{
				pickIndex = 0;
				pickClass = allPaths[i];
			}
			selector = selector.querySelectorAll(pickClass)[pickIndex];
		}
	}

	return valueArray;

}
