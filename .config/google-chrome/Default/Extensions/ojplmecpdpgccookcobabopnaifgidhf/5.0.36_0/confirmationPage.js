waitTillCheck()

function waitTillCheck()
{
	// if(typeof returnPID === "function")
	if(document.querySelector(check_items)!=undefined && document.querySelectorAll(check_items).length >= 1 && isVisible(document.querySelector(check_items)))
	{
		// console.log("in check items ");
		if(typeof success_msg == "undefined")
		{
			// console.log("in thankyou page");
			alreadyPresentTemp = getCookie("prodDetails");

			if(alreadyPresentTemp.length > 0)
			{
				// console.log("alreadyPresent Temp "+alreadyPresentTemp);
				alreadyPresentTemp = JSON.parse(alreadyPresentTemp);
				alreadyPresent = alreadyPresentTemp.products;
				finalData = alreadyPresent;

				
			}
			else
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
				finalData = alreadyPresent;

			}

			extractPostLoad1();
		}
		else if(document.querySelectorAll(success_msg).length >=1 && document.querySelector(success_msg).innerText.trim()!="")
		{
			// console.log("in thankyou page");
			alreadyPresentTemp = getCookie("prodDetails");

			if(alreadyPresentTemp.length > 0)
			{
				
				alreadyPresentTemp = JSON.parse(alreadyPresentTemp);
				alreadyPresent = alreadyPresentTemp.products;
				finalData = alreadyPresent;

				
			}
			else
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
				finalData = alreadyPresent;


			}

			extractPostLoad1();
		}
		else
		{
			setTimeout(waitTillCheck, 2000);

		}

	}
	else
	{
		setTimeout(waitTillCheck, 2000);
	}
}


function extractPostLoad1()
{
	
		var phoneNumber = "";
		// var pData = new Object();
		// pData["products"] = finalData;

		// console.log("length of finalData = "+ finalData.length);
		if(Object.keys(finalData).length == 0)
		{
			//do something
			    var phoneNumber = "";
				// console.log("allPaths "+allPaths);
				var generatedData = new Array();
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
		}
		else
		{
				var phoneNumber = "";
				// var pData = new Object();
				// pData["products"] = finalData;

				//general details
				generatedData = new Array();
				allPathsTemp = JSON.parse(allPathsGen);
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
					    	allValues = showAllGeneral(inputType,key,allPathsKey[ap]);
					    	for(var av=0;av<allValues.length;av++)
				    		{
				    			// search for those pids in cookie

				    			finalValTemp = getProperData(key,allValues[av]);
				    			// finalValTemp = allValues[av];
				    			if(finalValTemp.split("~@~").length > 1)
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
				    				value = returnPID(value)
				    				allGenVals[av] = value;
				    			}
				    			else
				    			{
				    				allGenVals[av] = value;

				    			}
				    			// console.log("current Values "+value);
				    		}

					    }
						
					   generatedData[key] =  allGenVals;

					}
					else if(allPathsTemp[key]['path'] != undefined)
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
						   	generatedData[key] = finalValue;
					}

				}

				// console.log(JSON.stringify(generatedData));
				// console.log(generatedData);
				//generatedData contains address ,subtotal,total
				

				for(var key in generatedData)
				{
					if(generatedData[key]=="" || typeof generatedData[key]=="undefined")
					{
						continue;
					}
					alreadyPresentTemp[key] = generatedData[key];
				}
		}


		// console.log("alreadyPresent Temp "+ JSON.stringify(alreadyPresentTemp));
		if(typeof alreadyPresentTemp["orderid"] ==  "undefined")
		{
			url = window.location.href;
			// console.log("current url "+url);
			var orderID = getOrderID(url);
			if(orderID !=0)
			{
				alreadyPresentTemp["orderid"] = orderID;
			}
		}

		if(typeof alreadyPresentTemp["orderid"] != "undefined" && alreadyPresentTemp["orderid"]!="")
		{
			finalDetailsNew = JSON.stringify(alreadyPresentTemp);
			// console.log("ready to send to server "+finalDetailsNew);
			sendInfo(alreadyPresentTemp);
			setCookie("prodDetails",'',-1);
			//remember to uncomment it
		}
		



	// });

}

function sendInfo(finalDetailsToSend)
{
	allProducts = finalDetailsToSend.products;
	var products=[];
	var orderid = finalDetailsToSend.orderid;
	var couponcode = getCookie('coupCode');
	setCookie('coupCode','',-1);
	for(var key in allProducts)
	{
		var curPid = key;
		var prodName = "";
		var price = 0;
		var shipDays = "";
		var size = "";
		var quantity = "";
		var deliverydate = "";
		var sellername = "";
		if(typeof allProducts[key]["productName"] !="undefined")
		{
			 prodName = allProducts[key]["productName"];
		}
		if(typeof allProducts[key]["price"] !="undefined")
		{
			 price = allProducts[key]["price"];
		}
		if(typeof allProducts[key]["shippingDays"] !="undefined")
		{
			//calculate delivery date curDate+shipping days
			 shipDays = allProducts[key]["shippingDays"];
			 if(isNaN(parseInt(shipDays)))
			 {
			 		shipDays = 0;
			 }
			 else
			 {

			 	shipDays = parseInt(shipDays);
			 }
			 var dt = new Date();
			 dt.setDate(dt.getDate() + shipDays);
			 deliverydate = dt.getDate()+"-"+(dt.getMonth()+1)+"-"+dt.getFullYear()

		}
		if(typeof allProducts[key]["size"] !="undefined")
		{
			 size = allProducts[key]["size"];
		}
		if(typeof allProducts[key]["quantity"] !="undefined")
		{
			 quantity = allProducts[key]["quantity"];
		}

		if(typeof allProducts[key]["sellerName"] !="undefined")
		{
			 sellername = allProducts[key]["sellerName"];
		}

			// console.log("name "+prodName);
			// console.log("pid "+ curPid);
			// console.log("quantity "+quantity);
			// console.log("size "+size);
			// console.log("price "+price);
			// // console.log("sellername "+pr);
			// console.log("deliverydate "+deliverydate);
			// console.log("orderid "+orderid);

			var product = {
							"name":encodeURIComponent(prodName),
							"pid":encodeURIComponent(curPid),
							"quantity":encodeURIComponent(quantity),
							"size":encodeURIComponent(size),
							"price":encodeURIComponent(price),
							"sellername":encodeURIComponent(sellername),
							"deliverydate":encodeURIComponent(deliverydate),
							"orderid":encodeURIComponent(orderid)
			}
			products.push(product);

	}
	products = JSON.stringify(products);
	products = encodeURIComponent(products);
	
	//Total amount (More than on order)
	try
	{
		
		var amount = 0;
		var paymentMethod = "";
		var address = "";
		var address1 = "";
		var address2 = "";
		var city = "";
		var state = "";
		var phoneNumber ="";
		var pincode = "";
		var email = "";
		var username = "";
		if(typeof finalDetailsToSend["total"] != "undefined")
		{
			 amount = finalDetailsToSend["total"];
		}
		if(typeof finalDetailsToSend["paymentMethod"] != "undefined")
		{
			 paymentMethod = finalDetailsToSend["paymentMethod"];
		}
		if(typeof finalDetailsToSend["username"] != "undefined")
		{
			 username = finalDetailsToSend["username"];
		}

		if(typeof finalDetailsToSend["address"] != "undefined")
		{
			address = " "+finalDetailsToSend["address"]+" ";
			var pincodeReg = '[^0-9A-Z]+([0-9]{6})[^0-9A-Z]+';
			var pincodeTemp = new RegExp(pincodeReg, "gi");
			matches = pincodeTemp.exec(address);
			if(matches)
			{
				if(matches[1]!="undefined")
				{
					pincode = matches[1];
				}
			}

		}
		if(typeof finalDetailsToSend["address1"] != "undefined")
		{
			address1 = " "+finalDetailsToSend["address1"]+" ";
			// address = finalDetailsToSend["address"];
			var pincodeReg = '[^0-9A-Z]+([0-9]{6})[^0-9A-Z]+';
			var pincodeTemp = new RegExp(pincodeReg, "gi");
			matches = pincodeTemp.exec(address1);
			if(matches)
			{
				if(matches[1]!="undefined")
				{
					pincode = matches[1];
				}
			}
		}
		if(typeof finalDetailsToSend["address2"] != "undefined")
		{
			address2 = " "+finalDetailsToSend["address2"]+" ";
			var pincodeReg = '[^0-9A-Z]+([0-9]{6})[^0-9A-Z]+';
			var pincodeTemp = new RegExp(pincodeReg, "gi");
			matches = pincodeTemp.exec(address2);
			if(matches)
			{
				if(matches[1]!="undefined")
				{
					pincode = matches[1];
				}
			}
		}
		if(typeof finalDetailsToSend["city"] != "undefined")
		{
			 city = finalDetailsToSend["city"];
		}
		if(typeof finalDetailsToSend["state"] != "undefined")
		{
			 state = finalDetailsToSend["state"];
		}
		if(typeof finalDetailsToSend["phoneNumber"] != "undefined")
		{
			 phoneNumber = finalDetailsToSend["phoneNumber"];
		}
		if(typeof finalDetailsToSend["email"] != "undefined")
		{
			 email = finalDetailsToSend["email"];
		}

		// console.log("address1 "+address1);
		// console.log("address2 "+address2);
		// console.log("address "+address);
		// console.log("city "+city);
		// console.log("state "+state);
		// console.log("phoneNumber "+phoneNumber);
		// console.log("pincode "+pincode);
		// console.log("paymentMethod "+paymentMethod);
		// console.log("amount "+amount);


		var addressobject=
		{
			
			"fullname":'',
			"address1":encodeURIComponent(address1),
			"address2":encodeURIComponent(address2),
			"address":encodeURIComponent(address),
			"landmark":'',
			"city":encodeURIComponent(city),
			"state":encodeURIComponent(state),
			"mobilenumber":encodeURIComponent(phoneNumber),
			"pincode":encodeURIComponent(pincode)

		}

	}
	catch(error)
	{

		var addressobject=
		{
			
			"fullname":"err",
			"address1":"err",
			"address2":"err",
			"address":"err",
			"landmark":"err",
			"city":"err",
			"state":"err",
			"mobilenumber":"err",
			"pincode":"err"

		}

	}


	addressobject=JSON.stringify(addressobject);
	addressobject=encodeURIComponent(addressobject);
	//aff
	// var tags =["aff_id","aff_sub","aff_sub2","aff_sub3","cid"];
	
	// var tags= 
	var aff={};
	var affparam1=localStorage[tags[0]];
	var affparam2=localStorage[tags[1]];
	for(var i=0;i<tags.length;i++)
	{
		//console.log(localStorage[tags[i]]);
		if(localStorage[tags[i]]!=undefined||localStorage[tags[i]]!="")
		{
		aff[tags[i]]=localStorage[tags[i]];
		localStorage[tags[i]]="";
		}

		if(localStorage[tags[i]+"path"]!=undefined||localStorage[tags[i]+"path"]!="")
		{
		aff[tags[i]+"path"]=localStorage[tags[i]+"path"];

		localStorage[tags[i]+"path"]="";
		}

	}
	//console.log(aff);
	affobject=JSON.stringify(aff);
	//console.log(affobject);
	affobject=encodeURIComponent(affobject);
	var clienttime=Date.now();
	var date=Date.now();
	// var email=$("#login_email_id").val();
	var bankname="";
	
	if(website == 1331)
	{

	}
	var jsonArr = [{'modeofpayment':paymentMethod,'orderid':orderid,'bankname':bankname,'email':email,'date':date,'amount':amount,'username':username,'mobile':phoneNumber,'address':addressobject,'products':products,'website':website,'aff':affobject,'param1':affparam1,'param2':affparam2,'couponcode':couponcode}];
    jsonArr = JSON.stringify(jsonArr);
    // console.log(jsonArr);

    // console.log("here1");
    sendMessage(1, jsonArr,25,doNothing, []);
    // console.log("here");
    //console.log("type");
}


function getOrderID(url)
{
	if(url.split("checkout").length > 1)
	{
		var nextPart = url.split("checkout/")[1];
		var reqPart = nextPart.split("/")[0];
		if(reqPart!="")
		{
			if(reqPart.split("=").length > 1 || reqPart.split("&").length > 1 || reqPart.split("?").length > 1 || reqPart.split("#").length > 1)
			{
				return 0;
			}
			reqPart = " "+reqPart+" ";
			var alphaNum1 = '[^0-9A-Z]+([0-9]+[A-Z]+[0-9A-Z]+)[^0-9A-Z]+';
			var phoneMatch = new RegExp(alphaNum1, "gi");
			matches = phoneMatch.exec(url);
			var phoneNumber = "";
			var orderID = 0;
			if(matches)    // 22-24 jul
			{
				if(matches[1] != "undefined")
				{
					var orderID = matches[1];
				}
			}
			var alphaNum1 = '[^0-9A-Z]+([0-9]+)[^0-9A-Z]+';
			var phoneMatch = new RegExp(alphaNum1, "gi");
			matches = phoneMatch.exec(url);
			var phoneNumber = "";
			if(matches)    // 22-24 jul
			{
				if(matches[1] != "undefined")
				{
					var orderID = matches[1];
				}
			}

			var alphaNum1 = '[^0-9A-Z]+([A-Z]+[0-9]+[0-9A-Z]+)[^0-9A-Z]+';
			var phoneMatch = new RegExp(alphaNum1, "gi");
			matches = phoneMatch.exec(url);
			var phoneNumber = "";
			if(matches)    // 22-24 jul
			{
				if(matches[1] != "undefined")
				{
					var orderID = matches[1];
				}
			}
			return orderID;
		}
		return 0;
	}
	else if(url.split("reference_id").length > 1)
	{
		var nextPart = url.split("reference_id")[1];
		var reqPart = nextPart.split("&")[0];
		if(reqPart!="")
		{
			if(reqPart.split("=").length > 1 || reqPart.split("&").length > 1 || reqPart.split("?").length > 1 || reqPart.split("#").length > 1)
			{
				return 0;
			}
			reqPart = " "+reqPart+" ";
			var alphaNum1 = '[^0-9A-Z]+([0-9]+[A-Z]+[0-9A-Z]+)[^0-9A-Z]+';
			var phoneMatch = new RegExp(alphaNum1, "gi");
			matches = phoneMatch.exec(url);
			var phoneNumber = "";
			var orderID = 0;
			if(matches)    // 22-24 jul
			{
				if(matches[1] != "undefined")
				{
					var orderID = matches[1];
				}
			}
			var alphaNum1 = '[^0-9A-Z]+([0-9]+)[^0-9A-Z]+';
			var phoneMatch = new RegExp(alphaNum1, "gi");
			matches = phoneMatch.exec(url);
			var phoneNumber = "";
			if(matches)    // 22-24 jul
			{
				if(matches[1] != "undefined")
				{
					var orderID = matches[1];
				}
			}

			var alphaNum1 = '[^0-9A-Z]+([A-Z]+[0-9]+[0-9A-Z]+)[^0-9A-Z]+';
			var phoneMatch = new RegExp(alphaNum1, "gi");
			matches = phoneMatch.exec(url);
			var phoneNumber = "";
			if(matches)    // 22-24 jul
			{
				if(matches[1] != "undefined")
				{
					var orderID = matches[1];
				}
			}
			return orderID;
		}
	}
	return 0;
}

