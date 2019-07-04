var addToCart = '#add_to_cart';
var cart_items = '#cart_form';
var payment_page = '#payment_form';
var check_items = ".oc-payment-dtls-section";
var tags = ["utm_source","utm_campaign","utm_medium"];
var website = 333;
var allPaths = new Object();
var allPathsGen = new Object();
var subPaths = new Object;
// subPaths["path"] = ["#product-overlay .product-hdr-container[0] .p_name[0]"];
subPaths["cartPath"] = [".ck-sku-row-top[-] .ck-sku-title[0]"]
subPaths["inputType"] = "text";
allPaths["productName"] = subPaths;

// document.querySelectorAll(".ck-sku-row-top")[1].querySelector(".ck-sku-title").
// document.querySelector("#product-overlay").querySelector(".product-hdr-container").querySelector(".p_name").innerText


subPaths = new Object;
subPaths["cartPath"] = [".ck-sku-row-top[-] .ck-sku-title[0]"];
subPaths["inputType"] = "url";
allPaths["pid"] = subPaths;


// subPaths = new Object;
// subPaths["cartPath"] = [".cart_row[-] .desc[0] .cart_item_descr[0]"];
// subPaths["inputType"] = "text";
// allPaths["size"] = subPaths;

subPaths = new Object;
subPaths["cartPath"] = [".ck-sku-row-top[-] .ck-sku-qty-wrap[0] .final_pricing[0]"];
subPaths["inputType"] = "text";
allPaths["price"] = subPaths;
// document.querySelectorAll(".ck-sku-row-top")[1].querySelector(".ck-sku-qty-wrap").querySelector(".final_pricing")
// document.querySelectorAll(".cart_row")[0].querySelectorAll(".subtotal")[1].querySelector(".lrpnk")
// <span class=​"lrpnk">​598​</span>​

// querySelector('.desc').querySelector('.cart_item_descr').


subPaths = new Object;
subPaths["cartPath"] = [".quntity-input[-]"];
subPaths["inputType"] = "input";
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
subPaths["cartPath"] = [".ck-sku-row-top[-] .ck-sku-dtl-range-txt[0]"];
subPaths["inputType"] = "text";
allPaths["shippingDays"] = subPaths;


// = document.querySelectorAll(".ck-sku-row-top")[0]
// <div class=​"ck-sku-row-top pf-white">​…​</div>​
// r.querySelector(".ck-sku-dtl-range-txt"


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
subPaths["path"] = ["#total_pay_coupon"];
subPaths["inputType"] = "text";
allPathsGen["total"] = subPaths;

// document.querySelector(".cart_items_footer").querySelector(".order").querySelector(".subtotalprice").querySelector(".scPr")

subPaths = new Object;
subPaths["path"] = [".oc-payment-dtls-section .oc-pay-mode[0] .oc-payment-dtls-right[0] .font-13[0]"];
subPaths["inputType"] = "text";
allPathsGen["paymentMethod"] = subPaths;

// document.querySelector(".oc-payment-dtls-section").querySelector(".oc-pay-mode").querySelector(".oc-payment-dtls-right").querySelector(".font-13").innerText

subPaths = new Object;
subPaths["path"] = [".right-block .payment[0] address"];
subPaths["inputType"] = "text";
allPathsGen["email"] = subPaths;


subPaths = new Object;
subPaths["path"] = [".ck-add-detail"];
subPaths["inputType"] = "text";
allPathsGen["address"] = subPaths;

// document.querySelector(".ck-add-detail").innerText

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
subPaths["path"] = [".pf-col .font-14"];
subPaths["inputType"] = "text";
allPathsGen["orderid"] = subPaths;


// (anonymous) @ VM149401:1
// document.querySelector(".pf-col").querySelector(".font-14")

allPaths = JSON.stringify(allPaths);
allPathsGen = JSON.stringify(allPathsGen);