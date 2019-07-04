var cart_items = ".TFpAof";
var check_items = "._3LB-i9";
var payment_page = "._2onfBH";
var tags = ["affid","affExtParam1","affExtParam2"];
var website=2;
var allPaths = new Object();
var allPathsGen = new Object();

//productname
var subPaths = new Object;
// subPaths["path"] = [".product-info .product-detail[0] .product-name[0]"];
// subPaths["inputType"] = "text";
// allPaths["productName"] = subPaths;


subPaths = new Object;
subPaths["cartPath"] = ["._1a2TnI[-] .NPoy5u[0]"];
subPaths["inputType"] = "text";
allPaths["productName"] = subPaths;


subPaths = new Object;
subPaths["cartPath"] = ["._1a2TnI[-] .NPoy5u[0]"];
// document.querySelectorAll("._1a2TnI")[1].querySelector(".col-8-12").querySelector(".NPoy5u")
subPaths["inputType"] = "url";
allPaths["pid"] = subPaths;

subPaths = new Object;
subPaths["cartPath"] = ["._1a2TnI[-] ._3Vj7el[0] ._3PqwaQ[1]"];
subPaths["inputType"] = "text";
allPaths["size"] = subPaths;



subPaths = new Object;
subPaths["cartPath"] = ["._1a2TnI[-] .row._3Vj7el[1] ._14N9bh[0]"];
subPaths["inputType"] = "text";
allPaths["sellerName"] = subPaths;


// document.querySelectorAll("._1a2TnI")[1].querySelector("._3Vj7el").querySelectorAll("._3PqwaQ")[1].innerText

subPaths = new Object;
subPaths["cartPath"] = ["._2csFM9[-]"];
subPaths["inputType"] = "input";
allPaths["quantity"] = subPaths;

//brand
// subPaths = new Object;
// subPaths["path"] = [".product-detail .company[0] span[0]"];
// subPaths["inputType"] = "text";
// allPaths["brand"] = subPaths;

//brand
subPaths = new Object;
// document.querySelectorAll("._1a2TnI")[1].querySelector("._3J2y9G").querySelectorAll(".f3C4Tt")[0]
subPaths["cartPath"] = ["._1a2TnI[-] ._3J2y9G[0] .f3C4Tt[0]"];
subPaths["inputType"] = "text";
allPaths["price"] = subPaths;

// "₹2299.00"
// document.querySelectorAll(".desktop")[2].querySelector(".price").querySelectorAll(".priceFormat")[1].innerText

subPaths = new Object;
// ("._13NzEc")[1].querySelector("._1XR3uz").
subPaths["path"] = ["._13NzEc[-] ._1XR3uz[0]"];
subPaths["inputType"] = "text";
allPaths["shippingDays"] = subPaths;

// (".aCNg3Z")[0].querySelector("._3aZm8l")

// subPaths = new Object;
// subPaths["path"] = [".PaJLWc[-] ._2u3tZM[0] img[0]"];
// subPaths["inputType"] = "image";
// allPaths["image"] = subPaths;

// document.querySelectorAll(".PaJLWc")[1].querySelector("._2u3tZM").querySelector("img")

subPaths = new Object;
subPaths["path"] = ["._3hdphw ._1oTPyP[1]"];
subPaths["inputType"] = "text";
allPathsGen["shippingCost"] = subPaths;

// document.querySelector("._3hdphw").querySelectorAll("._1oTPyP")[1]
// _3hdphw

subPaths = new Object;
subPaths["path"] = ["._3hdphw ._1oTPyP[0] div[1]"];
subPaths["inputType"] = "text";
allPathsGen["subtotal"] = subPaths;


subPaths = new Object;
// subPaths["path"] = [".right-block .orderTotalsThankyou[0] .totals[0] #total .amt[0]"];
// document.querySelector("._3ieKAO").querySelector("._3_BtmJ")
subPaths["path"] = ["._3ieKAO ._3_BtmJ[0]"];
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
subPaths["path"] = ["._3OsVcL ._3N_1fR[0]"];
// "_3OsVcL wRBMLW[0]"
subPaths["inputType"] = "text";
allPathsGen["address"] = subPaths;

subPaths = new Object;
subPaths["path"] = ["._18LZd2 ._1MbX3l[0]"];
subPaths["inputType"] = "text";
allPathsGen["username"] = subPaths;

subPaths = new Object;
subPaths["path"] = ["._3OsVcL ._1GAUB_[0] ._3eXX5M[0]"];
// "_3OsVcL wRBMLW[0]"
// document.querySelector("._3OsVcL").querySelector("._1GAUB_").querySelector("._3eXX5M")
subPaths["inputType"] = "text";
allPathsGen["phoneNumber"] = subPaths;


subPaths = new Object;
subPaths["path"] = ["._2m1Usk ._293HKL[0] div[1] div[0]"];
subPaths["inputType"] = "text";
allPathsGen["orderid"] = subPaths;

// .querySelector("._2m1Usk").querySelectorAll("._293HKL")[0].querySelectorAll("div")[1].querySelector("div")

allPaths = JSON.stringify(allPaths);
allPathsGen = JSON.stringify(allPathsGen);