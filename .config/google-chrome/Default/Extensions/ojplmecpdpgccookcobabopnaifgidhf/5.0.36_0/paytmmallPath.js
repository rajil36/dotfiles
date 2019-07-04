var cart_items = "._2bai";
var check_items = ".R1au";
var payment_page = "#merchant-payment-modes";

// https://paytmmall.com/?utm_source=admitad&utm_medium=affiliate&utm_campaign=admitad&utm_term=47f46026f53feac8db40fbd3865a154b_370202_extension~sideCoupons~2702433~

var tags = ["utm_term","utm_source","utm_medium","utm_campaign"];
var website=1331;
var allPaths = new Object();
var allPathsGen = new Object();

//productname
var subPaths = new Object;

subPaths = new Object;
subPaths["cartPath"] = ["._3Gpv[-] ._2FgR[0] ._1l0W[0]"];
subPaths["inputType"] = "text";
allPaths["productName"] = subPaths;


subPaths = new Object;
subPaths["cartPath"] = ["._3Gpv[-] ._2FgR[0] ._1l0W[0] a[0]"];
subPaths["inputType"] = "url";
allPaths["pid"] = subPaths;

subPaths = new Object;
subPaths["cartPath"] = ["._3Gpv[-] .BPid[0]"];
subPaths["inputType"] = "text";
allPaths["size"] = subPaths;


subPaths = new Object;
subPaths["cartPath"] = ["._23s_[-] ._23o4[0]"];  //showAllGeneral check
subPaths["inputType"] = "text";   
allPaths["quantity"] = subPaths;


subPaths = new Object;
subPaths["cartPath"] = ["._3AB4[-] ._7l_E[0]"];
subPaths["inputType"] = "text";
allPaths["price"] = subPaths;

// document.querySelectorAll("._3AB4")[1].querySelector("._7l_E").innerText
// "₹2299.00"
// document.querySelectorAll(".desktop")[2].querySelector(".price").querySelectorAll(".priceFormat")[1].innerText

subPaths = new Object;
subPaths["path"] = ["._3Gpv[-] ._3IXx[0]"];
subPaths["inputType"] = "text";
allPaths["shippingDays"] = subPaths;



// (".aCNg3Z")[0].querySelector("._3aZm8l")

// subPaths = new Object;
// subPaths["path"] = [".PaJLWc[-] ._2u3tZM[0] img[0]"];
// subPaths["inputType"] = "image";
// allPaths["image"] = subPaths;

// document.querySelectorAll(".PaJLWc")[1].querySelector("._2u3tZM").querySelector("img")

subPaths = new Object;
// subPaths["path"] = ["._2u_h[-] ._3_-n[0]"];
subPaths["path"] = ["._3rPj ._1f8F[1]"];
subPaths["inputType"] = "text";
allPathsGen["shippingCost"] = subPaths;
// _3_-n
// document.querySelectorAll("._2u_h")[0].querySelector("._3_-n").innerText
// document.querySelector("._3hdphw").querySelectorAll("._1oTPyP")[1]
// _3hdphw

subPaths = new Object;
subPaths["path"] = ["._3rPj ._1f8F[0]"];
subPaths["inputType"] = "text";
allPathsGen["subtotal"] = subPaths;

// document.querySelector("._3rPj").querySelectorAll("._1f8F")[2]

subPaths = new Object;
// subPaths["path"] = [".right-block .orderTotalsThankyou[0] .totals[0] #total .amt[0]"];
// subPaths["path"] = ["._2v_qcT ._1oTPyP[0]"];
subPaths["path"] = ["._3rPj ._1f8F[2]"];

subPaths["inputType"] = "text";
allPathsGen["total"] = subPaths;





subPaths = new Object;
subPaths["path"] = ["._1brAgx"];
subPaths["inputType"] = "text";
allPathsGen["paymentMethod"] = subPaths;

subPaths = new Object;
subPaths["path"] = ["._3OsVcL .wRBMLW[0]"];
subPaths["inputType"] = "text";
allPathsGen["email"] = subPaths;


subPaths = new Object;
subPaths["path"] = ["._30qV ._1bTI[0]"];
subPaths["inputType"] = "text";
allPathsGen["address"] = subPaths;

// document.querySelector("._30qV").querySelector("._1bTI").innerText

subPaths = new Object;
subPaths["path"] = ["._30qV ._1LPR[0]"];
subPaths["inputType"] = "text";
allPathsGen["username"] = subPaths;

// document.querySelector("._30qV").querySelector("._1LPR").innerText

// subPaths = new Object;
// subPaths["path"] = ["._3OsVcL ._1GAUB_[0] ._3eXX5M[0]"];
// subPaths["inputType"] = "text";
// allPathsGen["phoneNumber"] = subPaths;


subPaths = new Object;
subPaths["path"] = ["._1Ac- ._2eGT[0]"];
subPaths["inputType"] = "text";
allPathsGen["orderid"] = subPaths;

// document.querySelector("._1Ac-").querySelector("._2eGT")

// .querySelector("._2m1Usk").querySelectorAll("._293HKL")[0].querySelectorAll("div")[1].querySelector("div")

allPaths = JSON.stringify(allPaths);
allPathsGen = JSON.stringify(allPathsGen);