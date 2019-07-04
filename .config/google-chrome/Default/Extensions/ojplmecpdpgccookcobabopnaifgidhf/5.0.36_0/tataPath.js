var cart_items = ".cart-top-block";
var check_items = ".orderBoxes";
var payment_page = "#makePaymentDiv";
var tags = ["aff_id","aff_sub","aff_sub2","aff_sub3","cid"];
var website=2190;
var allPaths = new Object();
var allPathsGen = new Object();

//productname
var subPaths = new Object;
// subPaths["path"] = [".product-info .product-detail[0] .product-name[0]"];
// subPaths["inputType"] = "text";
// allPaths["productName"] = subPaths;

subPaths = new Object;
subPaths["cartPath"] = [".item[-] .productItemInfo[0] .product[0] .product-name[0] a[0]"];
subPaths["inputType"] = "text";
allPaths["productName"] = subPaths;


subPaths = new Object;
subPaths["cartPath"] = [".item[-] .productItemInfo[0] .product[0] .product-name[0] a[0]"];
subPaths["inputType"] = "url";
allPaths["pid"] = subPaths;

subPaths = new Object;
subPaths["cartPath"] = [".item[-] .productItemInfo[0] .product[0] .cart-product-info[0] .size[0]"];
subPaths["inputType"] = "text";
allPaths["size"] = subPaths;


subPaths = new Object;
subPaths["cartPath"] = ["#quantity_~$~"];
subPaths["inputType"] = "dropdown";
allPaths["quantity"] = subPaths;

//brand
subPaths = new Object;
subPaths["path"] = [".product-detail .company[0] span[0]"];
subPaths["inputType"] = "text";
allPaths["brand"] = subPaths;

//brand
subPaths = new Object;
subPaths["cartPath"] = [".desktop[-] .price[0] .priceFormat[1]"];
subPaths["inputType"] = "text";
allPaths["price"] = subPaths;

// "₹2299.00"
// document.querySelectorAll(".desktop")[2].querySelector(".price").querySelectorAll(".priceFormat")[1].innerText

subPaths = new Object;
subPaths["path"] = ["#expressDate"];
subPaths["inputType"] = "text";
allPaths["shippingDays"] = subPaths;


subPaths = new Object;
subPaths["path"] = ["#zoomId","#addiImage0 .thumb[0]"];
subPaths["inputType"] = "image";
allPaths["image"] = subPaths;


subPaths = new Object;
subPaths["path"] = [".right-block .orderTotalsThankyou[0] .totals[0] .shippingthanks .amt"];
subPaths["inputType"] = "text";
allPathsGen["shippingCost"] = subPaths;


subPaths = new Object;
subPaths["path"] = [".right-block .orderTotalsThankyou[0] .totals[0] .subtotalthanks[0] .priceFormat[0]"];
subPaths["inputType"] = "text";
allPathsGen["subtotal"] = subPaths;


subPaths = new Object;
// subPaths["path"] = [".right-block .orderTotalsThankyou[0] .totals[0] #total .amt[0]"];
subPaths["path"] = [".cart-bottom-block .totals[0] #total .priceFormat[0]"];
subPaths["inputType"] = "text";
allPathsGen["total"] = subPaths;


subPaths = new Object;
subPaths["path"] = [".right-block .payment[0] .title[0]"];
subPaths["inputType"] = "text";
allPathsGen["paymentMethod"] = subPaths;

subPaths = new Object;
subPaths["path"] = [".right-block .payment[0] address"];
subPaths["inputType"] = "text";
allPathsGen["email"] = subPaths;


subPaths = new Object;
subPaths["path"] = [".left-block .address address"];
subPaths["inputType"] = "text";
allPathsGen["address"] = subPaths;

subPaths = new Object;
subPaths["path"] = [".checkout-success .checkout-success-body"];
subPaths["inputType"] = "text";
allPathsGen["orderid"] = subPaths;

allPaths = JSON.stringify(allPaths);
allPathsGen = JSON.stringify(allPathsGen);