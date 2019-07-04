var check = setInterval(() => {
    var cur_url = window.location.href;
    if (cur_url.split("freecharge.in/desktop/recharge/").length > 1 && cur_url.split('amount').length > 1) {
        if ($(".clearfix").length > 0) {
            clearInterval(check);

            getLookupId().then((lookupID) => {

                var selectorACIcon = ".clearfix";
                var position = "after";
                var parent = "none";
                var method = "POST";
                var api = "https://www.freecharge.in/promocode/apply.htm";
                var postFields = { "lookupID": lookupID, couponCode: "**" };
                var details = [{ 'postFields': postFields, "api": api, "method": method, "api_case": 1, site: 1348 }];
                details = JSON.stringify(details);
                arrayMsg = [];
                displayACIcon(selectorACIcon, parent, position, 1348, details);
                keepCheckingACIcon(selectorACIcon, parent, position, 1348, details);
            });
        }
    }
}, 1000);

function getLookupId() {
    return new Promise((resolve) => {
    	try{
        var xhr = new XMLHttpRequest();
        var productType;
        if($('#app').next()[0].innerHTML.split('"productCode":"')[1])
        {
        	var productType = $('#app').next()[0].innerHTML.split('"productCode":"')[1].split('"')[0];
        }
        else productType ="X";
        var data, serviceNumber, operatorName, operator, amount, circleName, rechargePlanType;
        var serviceProvider, serviceRegion, billAmount, billNumber, billDate, dueDate,additionalInfo1, additionalInfo2, additionalInfo3;
        if (productType == "D") {
            operator = $('[name="operator"]').val();
            operatorName = operator;
            circleName = "33";
            serviceNumber = $('[name="number"]').val();
            rechargePlanType = $('#app').next()[0].innerHTML.split('"rechargeType":"')[1].split('"')[0];
            amount = document.getElementsByClassName('rec-amt-cont')[0].innerText.split('₹')[1].split('\n')[0];
            data = "serviceNumber=" + serviceNumber + "&operatorName=" + operatorName + "&circleName=" +
                circleName + "&amount=" + amount + "&productType=" + productType + "&operator=" +
                operator + "&rechargePlanType=" + rechargePlanType;
        }
        else if ((productType == "V") || (productType == "C")) {
            amount = document.getElementsByClassName('rec-amt-cont')[0].innerText.split('₹')[1].split('\n')[0];
            circleName = $('[name="circle"]').val();
            operator = $('[name="operator"]').val();
            operatorName = operator;
            serviceNumber = $('[name="number"]').val();
            data = "amount=" + amount + "&circleName=" + circleName + "&operator=" + operator +
                "&operatorName=" + operatorName + "&productType=" + productType + "&rechargePlanType=" +
                "&serviceNumber=" + serviceNumber;
        }
        //5898794111 - ele
        else if(productType == "E") {
            serviceProvider = document.getElementsByClassName('select-container')[0].children[0].value;
            serviceRegion = -1;
            billAmount = document.getElementsByClassName('bill-details-container')[0].children[0].children[7].innerText.split("₹")[1].trim();
            dueDate = document.getElementsByClassName('bill-details-container')[0].children[0].children[3].innerText.split(":")[1].trim();
            billDate = document.getElementsByClassName('bill-details-container')[0].children[0].children[1].innerText.split(":")[1].trim();
            billNumber = document.getElementsByClassName('bill-details-container')[0].children[0].children[2].innerText.split(":")[1].trim();
            additionalInfo1 = document.getElementsByClassName('bill-details-container')[0].children[0].children[4].innerText.split(":")[1].trim();
            additionalInfo2 = document.getElementsByClassName('bill-details-container')[0].children[0].children[5].innerText.split(":")[1].trim();
            additionalInfo3 = document.getElementsByClassName('bill-details-container')[0].children[0].children[6].innerText.split(":")[1].trim();
            data = "serviceProvider=" + serviceProvider + "&serviceRegion="+ serviceRegion +"&billAmount=" + billAmount + "&additionalInfo1=" + additionalInfo1 + "&additionalInfo2=" + additionalInfo2 + "&additionalInfo3=" + additionalInfo3 + "&billDate=" + billDate + "&billNumber=" + billNumber + "&dueDate=" + dueDate;
        }
        else if(productType == "L") {
            //all exc bsnl and mtnl
            serviceProvider = document.getElementsByClassName('select-container')[0].children[0].value;
            amount = document.getElementsByClassName('rec-amt-cont')[0].innerText.split('₹')[1].split('\n')[0];
            additionalInfo1 = document.getElementsByClassName('input-container')[0].children[0].value;
            data ="serviceProvider=" + serviceProvider + "&billAmount=" + amount +"&additionalInfo1=" + additionalInfo1;;
        }
        else if(productType == "X") {
        	serviceNumber = $('[name="number"]').val();
        	circleName = "33";
	       	amount = document.getElementsByClassName('rec-amt-cont')[0].innerText.split('₹')[1].split('\n')[0];
        	operator = "89";
        	rechargePlanType = "topup";
        	data = "serviceNumber=" + serviceNumber + "&operatorName=&circleName=" + circleName + 
        	"&amount=" + amount + "&productType=X&operator=" + operator + "&rechargePlanType=" + rechargePlanType;
        	// console.log("data ",data);
        }
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                var res = JSON.parse(this.responseText);
                // res = JSON.parse(res);
                // console.log('jkds',res.lookupId);
                return resolve(res.lookupId);
            }
        });
        if((productType == "E") || (productType == "L"))
        {
            xhr.open("POST", "https://www.freecharge.in/rest/bill/v2/createBill");
        }
        else if(productType == "X")
        {
        	xhr.open("POST","https://www.freecharge.in/rest/recharge/credits/save");
        }
        else
        {
            xhr.open("POST", "https://www.freecharge.in/rest/recharge/v3/save?fcAppType=web");
        }
        xhr.setRequestHeader("content-type", 'application/x-www-form-urlencoded')
        xhr.setRequestHeader("csrfrequestidentifier",
            $('#app').next()[0].innerHTML.split('"csrfRequestIdentifier":"')[1].split('",')[0]);
        xhr.send(data);
    	}
    	catch(e)
    	{
    		resolve("");
    	}
    });
}

savings = [];
bestSaving = 0;
bestCoupon = "";

function startSaving(data1) {
    if (document.getElementsByClassName('clearfix').length > 1) {
        document.getElementsByClassName('clearfix')[0].children[2].click();
    }
    data1 = JSON.parse(data1);
    var nowCode = "";
    var nowSaving = "";
    var resp = data1[0].data;
    var code = data1[0].code.trim();
    var csaving = 0;
    var ecashing = 0;
    var savingsObject = {};
    var cpnMsg = "";
    nowCode = code;
   // console.log('print',resp);
    respYatra = resp;
    if (resp != "" && code != "") {
        if (resp.status && resp.status == "failure" && resp.errors) {
            cpnMsg = resp.errors;
            arrayMsg.push([code, encodeURIComponent(cpnMsg), 1348]);
        }
        else {
            // wrapper= document.createElement('div');
            // $(wrapper).html(resp);
            // if($(wrapper).find(".order-summary-span").length > 0 && $(wrapper).find(".order-summary-span .coupon").length > 0){
            //   var csaving = $(wrapper).find(".order-summary-span .coupon:eq(0) span:eq(0)").text().trim();
            //   csaving = filter_price(csaving);
            try {
                var csaving;
                console.log("this is my savings", csaving);
                var productType =  $('#app').next()[0].innerHTML.split('"productCode":"')[1].split('"')[0];
                var tempString = resp.successMsg;
                if (tempString.split('upto').length > 1 || tempString.split('up to').length > 1) {
                    csaving = parseInt(tempString.split("Rs.")[1].split(" ")[0].trim());
                    let originalCost;
                    if(productType=="E")
                    originalCost = document.getElementsByClassName('bill-details-container')[0].children[0].children[7].innerText.split("₹")[1].trim();
                    else
                    originalCost = document.getElementsByClassName('rec-amt-cont')[0].innerText.split('₹')[1].split('\n')[0];
                    if (tempString.split('%').length > 1) {
                        let percent = tempString.split('%')[0].split(' ').slice(-1)[0]
                        csaving = Math.min(csaving, (percent / 100.0) * originalCost);
                    }
                }
                else {
                    let originalCost;
                    if(productType=="E")
                    originalCost = document.getElementsByClassName('bill-details-container')[0].children[0].children[7].innerText.split("₹")[1].trim();
                    else
                    originalCost = document.getElementsByClassName('rec-amt-cont')[0].innerText.split('₹')[1].split('\n')[0];
                    if (tempString.split('%').length > 1) {
                        let percent = tempString.split('%')[0].split(' ').slice(-1)[0]
                        csaving = (percent / 100.0) * originalCost;
                    }
                    else {
                        csaving = parseInt(tempString.split("Rs.")[1].split(" ")[0].trim());
                    }
                }
                csaving = Math.round(csaving);
                if (isNaN(csaving)) {
                    csaving = 0
                }
                else if (csaving > bestSaving) {
                    bestSaving = csaving;
                    bestCoupon = code;

                }
                if (csaving > 0) {
                    cpnMsg = "SUCCESS";
                    arrayMsg.push([code, encodeURIComponent(cpnMsg), 1348]);
                }
            }
            catch (e) { }
            //}
        }
    }
    var savingsLen = savings.length;
    savingsObject["code"] = code;
    savingsObject["saving"] = csaving;
    savingsObject["ecash"] = ecashing;
    savings[savingsLen] = savingsObject;
    localStorage.savings = JSON.stringify(savings);
    displayEachCpnSaving(code, csaving, ecashing);
    doneSavingCheck++;
    // console.log("doneSavingCheck: "+doneSavingCheck);
    // console.log("doneSavingCheckFn: "+doneSavingCheckFn());
    if (doneSavingCheckFn() == 1) {
        // console.log("calling applyBestCoupon from here");
        applyBestCoupon();
        if (localStorage.anaSent != 1 && parseInt(bestSaving) != 0 && bestSaving != "" && !isNaN(parseInt(bestSaving))) {
            localStorage.anaSent = 1;
            var host = window.location.host;
            var jsonArr = [{ 'type': 'finish1', 'website': host }];
            jsonArr = JSON.stringify(jsonArr);
            sendMessage(1, jsonArr, 22, doNothing, []);
            tracer(1, 4);
            setTimeout(function () { if (JSON.parse(features_json)[4] == 0) { ft(4); } }, 100);
        }
    }
}

var deleteAC = 0;
function applyBestCoupon() {
    if (parseInt(bestSaving) != 0 && bestCoupon.trim() != "") {
        if (document.getElementsByClassName('clearfix').length > 1) {
            document.getElementsByClassName('clearfix')[1].children[2].click();
        }
        if (document.getElementsByClassName('_1621M').length > 0 && document.querySelectorAll('._2J9pm').length > 0) {
            var event = new Event('input', {
                'bubbles': true,
                'cancelable': true
            });
            var inputElement = document.querySelector('._1621M').querySelector('input');
            inputElement.value = bestCoupon;
            inputElement.dispatchEvent(event);
            document.querySelectorAll('._2J9pm')[0].click();
            displayFinalSavings();
        }
        else {
            setTimeout(applyBestCoupon, 1000);
        }
    }
    else {
        // console.log("Show no savings popup");
        displayNoSavings();
    }
    if (deleteAC == 0) {
        if (arrayMsg.length > 0 && arrayMsg.length != "") {
            if (typeof bestCoupon != "undefined") {
                arrayMsg.push([bestCoupon, "Success", 1348, 1]);
            }
            arrayMsg = JSON.stringify(arrayMsg);
            var jsonArr = [{ 'cpn_msg': arrayMsg }];
            jsonArr = JSON.stringify(jsonArr);
            // console.log("cpn_msg JSON: "+jsonArr);
            deleteAC = 1;
            sendMessage(1, jsonArr, 1348, doNothing, []);
            arrayMsg = [];
        }
    }
}

if (localStorage.retryPostLoad == 1) {
    applyBestCoupon();
}

// function addCoupon(code) {
//     var event = new Event('input', {
//         'bubbles': true,
//         'cancelable': true
//     });
//     var inputElement = document.querySelector('._1621M').querySelector('input');
//     inputElement.value = code;
//     inputElement.dispatchEvent(event);
//     document.querySelectorAll('._2J9pm')[0].click();
// }
// function removeCoupon() {
//     try {
//         if (document.getElementsByClassName('clearfix').length > 1) {

//             document.getElementsByClassName('clearfix')[0].children[2].click();
//         }
//     }
//     catch (e) { }
// }

// ele 5898794111

//landline
//acc 9034492627
// no 8026662447