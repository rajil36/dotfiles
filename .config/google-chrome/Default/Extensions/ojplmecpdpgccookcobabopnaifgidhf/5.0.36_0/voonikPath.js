var addToCart = '.voonik-clear-btn';
var cart_items = '.items-in-cart';
var payment_page = '.deliver-to-address';
var check_items = ".thankyou_order_no";
var delete_items = ".save_to_wishlist";
var tags =["aff_id","utm_source"];
var website = 2266;
var allPaths = new Object();
var allPathsGen = new Object();

//productname
var subPaths = new Object;
// subPaths["path"] = [".product-details .pdp-det-box[0] h1[0]"];
subPaths["path"] = [];
subPaths["inputType"] = "text";
allPaths["productName"] = subPaths;


var subPaths = new Object;
// subPaths["path"] = [".product-details .pdp-det-box[0] h1[0]"];
subPaths["cartPath"] = [".item-details[-] .item_name"];
subPaths["inputType"] = "text";
allPaths["productName"] = subPaths;

// document.querySelectorAll(".item-details")[1].querySelector(".item_name").innerText


// document.querySelector('.product-details').querySelector(".pdp-det-box").querySelector("h1")


// document.querySelector("#product-overlay").querySelector(".product-hdr-container").querySelector(".p_name").innerText


subPaths = new Object;
subPaths["cartPath"] = [".cart-list-of-items_main[-] .item-details[0] .item_name[0]"];
subPaths["inputType"] = "url";
allPaths["pid"] = subPaths;

// document.querySelector('.cart-list-of-items_main').querySelector(".item-details").querySelector(".item_name")

subPaths = new Object;
subPaths["cartPath"] = [".size-select[-]"];
subPaths["inputType"] = "dropdown";
allPaths["size"] = subPaths;


subPaths = new Object;
subPaths["cartPath"] = [".save_to_wishlist[-] p[2]"];
// toltal-amount-per-item
subPaths["inputType"] = "text";
allPaths["price"] = subPaths;

// document.querySelectorAll(".save_to_wishlist")[1].querySelectorAll("p")[2].querySelectorAll("span")[1]
// document.querySelectorAll(".cart_row")[0].querySelectorAll(".subtotal")[1].querySelector(".lrpnk")
// <span class=​"lrpnk">​598​</span>​

// querySelector('.desc').querySelector('.cart_item_descr').


subPaths = new Object;
subPaths["cartPath"] = [".qty-selection[-] .qty"];
subPaths["inputType"] = "input";
allPaths["quantity"] = subPaths;

//brand
subPaths = new Object;
subPaths["path"] = [];
subPaths["inputType"] = "text";
allPaths["brand"] = subPaths;

// docu ment.querySelector('#product-overlay').querySelector('.product-hdr-container').querySelector('.brandinfo').querySelector('.sUsrNme')

//brand
// subPaths = new Object;
// // subPaths["path"] = [".product-details .primo_unsubcribed[0] span[0]"];
// subPaths["path"] = [];
// subPaths["inputType"] = "text";
// allPaths["price"] = subPaths;

// document.querySelector(".product-details").querySelector(".primo_unsubcribed").querySelector("span")
// document.querySelector('.product-details').querySelector(".primo_unsubcribed").querySelector("span")

// document.querySelector('#productDetails').querySelector(".priceData").querySelector(".psp").querySelector('.price')
//--------------

subPaths = new Object;
subPaths["path"] = [".delivery-text-msg datecolor[0]"];
subPaths["inputType"] = "text";
allPaths["shippingDays"] = subPaths;

// document.querySelector(".delivery-text-msg").querySelector("datecolor").innerText

// document.querySelector('#delivery-return').querySelector('.otherdetails').querySelector('.options').querySelector('.options').querySelectorAll('span')[1]

subPaths = new Object;
// subPaths["path"] = ["#img-1 #bg-1 img"];
subPaths["path"] = [];
subPaths["inputType"] = "image";
allPaths["image"] = subPaths;

// document.querySelector("#img-1").querySelector("#bg-1")
// '#rg-gallery').querySelector('.rg-image-wrapper').querySelectorAll('.product_image')

subPaths = new Object;
subPaths["path"] = [".right-block .orderTotalsThankyou[0] .totals[0] .shippingthanks .amt"];
subPaths["inputType"] = "text";
allPathsGen["shippingCost"] = subPaths;


subPaths = new Object;
subPaths["path"] = [".right-block .orderTotalsThankyou[0] .totals[0] .subtotalthanks[0] .priceFormat[0]"];
subPaths["inputType"] = "text";
allPathsGen["subtotal"] = subPaths;


subPaths = new Object;
subPaths["path"] = [".you_save_amount .you-save-right[0] .order_total_amount[0] b[0]"];
subPaths["inputType"] = "text";
allPathsGen["total"] = subPaths;

// document.querySelector(".you_save_amount").querySelector(".you-save-right").querySelector(".order_total_amount").querySelector("b")

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
subPaths["path"] = [".cart-left-section .deliver-to-address[0] div[0]"];
subPaths["inputType"] = "text";
allPathsGen["address"] = subPaths;

// document.querySelector(".deliver-to-address").querySelector("div").innerText
// subPaths = new Object;
// subPaths["path"] = [".ship-add .order-address1[0]"];
// subPaths["inputType"] = "text";
// allPathsGen["address1"] = subPaths;

// // document.querySelector(".ship-add").querySelector(".order-state")


// subPaths = new Object;
// subPaths["path"] = [".ship-add .order-address2[0]"];
// subPaths["inputType"] = "text";
// allPathsGen["address2"] = subPaths;


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
subPaths["path"] = [".thankyou_order_no"];
subPaths["inputType"] = "text";
allPathsGen["orderid"] = subPaths;

allPaths = JSON.stringify(allPaths);
allPathsGen = JSON.stringify(allPathsGen);