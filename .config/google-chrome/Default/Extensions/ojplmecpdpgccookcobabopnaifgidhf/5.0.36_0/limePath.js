var cart_items = '#cart_items';
var payment_page = '#PaymentOptions';
var check_items = "#sms-mail-sent";
var success_msg = "#success-message";
var tags = ["utm_source","utm_campaign","utm_medium"];
var website = 424;
var allPaths = new Object();
var allPathsGen = new Object();

//productname
var subPaths = new Object;
// subPaths["path"] = ["#product-overlay .product-hdr-container[0] .p_name[0]"];
subPaths["cartPath"] = [".cart_row[-] .desc[0] .scProdHref[0]"]
subPaths["inputType"] = "text";
allPaths["productName"] = subPaths;

// document.querySelector("#product-overlay").querySelector(".product-hdr-container").querySelector(".p_name").innerText


subPaths = new Object;
subPaths["cartPath"] = [".cart_row[-] .desc[0] .scProdHref[0]"];
subPaths["inputType"] = "url";
allPaths["pid"] = subPaths;


subPaths = new Object;
subPaths["cartPath"] = [".cart_row[-] .desc[0] .cart_item_descr[0]"];
subPaths["inputType"] = "text";
allPaths["size"] = subPaths;

subPaths = new Object;
subPaths["cartPath"] = [".cart_row[-] .price[0] span[1]"];
subPaths["inputType"] = "text";
allPaths["price"] = subPaths;

// document.querySelectorAll(".cart_row")[0].querySelectorAll(".subtotal")[1].querySelector(".lrpnk")
// <span class=​"lrpnk">​598​</span>​

// querySelector('.desc').querySelector('.cart_item_descr').


subPaths = new Object;
subPaths["cartPath"] = ["#item_quantity_~$~"];
subPaths["inputType"] = "dropdown";
allPaths["quantity"] = subPaths;

//brand
subPaths = new Object;
subPaths["path"] = ["#product-overlay .brandinfo[0] .sUsrNme[0]"];
subPaths["inputType"] = "text";
allPaths["brand"] = subPaths;

// docu ment.querySelector('#product-overlay').querySelector('.product-hdr-container').querySelector('.brandinfo').querySelector('.sUsrNme')

//brand
// subPaths = new Object;
// subPaths["path"] = ["#productDetails .priceData[0] .psp[0] .price[0]"];
// subPaths["inputType"] = "text";
// allPaths["price"] = subPaths;

// document.querySelector('#productDetails').querySelector(".priceData").querySelector(".psp").querySelector('.price')


subPaths = new Object;
// subPaths["path"] = ["#delivery-return .otherdetails[0] .options[0] .options[0] span[1]"];
subPaths["cartPath"] = [".cart_row[-] .est-delivery[0] span[0]"];
subPaths["inputType"] = "text";
allPaths["shippingDays"] = subPaths;

// document.querySelector('#delivery-return').querySelector('.otherdetails').querySelector('.options').querySelector('.options').querySelectorAll('span')[1]

subPaths = new Object;
subPaths["path"] = ["#rg-gallery .rg-image-wrapper[0] .product_image[0]"];
subPaths["inputType"] = "image";
allPaths["image"] = subPaths;

// '#rg-gallery').querySelector('.rg-image-wrapper').querySelectorAll('.product_image')

subPaths = new Object;
// subPaths["path"] = [".right-block .orderTotalsThankyou[0] .totals[0] .shippingthanks .amt"];
subPaths["cartPath"] = [".cart_row[-] .price[0] .shipping-charge[0]"];
subPaths["inputType"] = "text";
allPaths["shippingCost"] = subPaths;


subPaths = new Object;
subPaths["path"] = [".right-block .orderTotalsThankyou[0] .totals[0] .subtotalthanks[0] .priceFormat[0]"];
subPaths["inputType"] = "text";
allPathsGen["subtotal"] = subPaths;


subPaths = new Object;
subPaths["path"] = [".cart_items_footer .order[0] .subtotalprice[0] .scPr[0]"];
subPaths["inputType"] = "text";
allPathsGen["total"] = subPaths;

// document.querySelector(".cart_items_footer").querySelector(".order").querySelector(".subtotalprice").querySelector(".scPr")

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
subPaths["path"] = [".ship-add .order-address1[0]"];
subPaths["inputType"] = "text";
allPathsGen["address1"] = subPaths;

// document.querySelector(".ship-add").querySelector(".order-state")


subPaths = new Object;
subPaths["path"] = [".ship-add .order-address2[0]"];
subPaths["inputType"] = "text";
allPathsGen["address2"] = subPaths;


subPaths = new Object;
subPaths["path"] = [".ship-add .order-city[0]"];
subPaths["inputType"] = "text";
allPathsGen["city"] = subPaths;

subPaths = new Object;
subPaths["path"] = [".ship-add .order-state[0]"];
subPaths["inputType"] = "text";
allPathsGen["state"] = subPaths;

// document.querySelector(".ship-add").querySelector(".order-state")
subPaths = new Object;
subPaths["path"] = [".ship-add .order-mobile[0]"];
subPaths["inputType"] = "text";
allPathsGen["phoneNumber"] = subPaths;


subPaths = new Object;
subPaths["path"] = [".checkout-success .checkout-success-body"];
subPaths["inputType"] = "text";
allPathsGen["orderid"] = subPaths;

subPaths = new Object;
subPaths["path"] = ["#ck_user span[0]"];
subPaths["inputType"] = "text";
allPathsGen["username"] = subPaths;


allPaths = JSON.stringify(allPaths);
allPathsGen = JSON.stringify(allPathsGen);