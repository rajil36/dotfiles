var arrayMsg = [];
function isapplicable(productId, code) {
  return new Promise((resolve) => {
    var z = {
      "action": "applypromo",
      "item_map": { [productId + "pid"]: code }
    };
    let cartId = localStorage.getItem('cartId');
    let token = JSON.parse(localStorage.getItem('sessionValue')).user.sso_token_enc;
    let RequestURL = "https://paytmmall.com/proxy/cart-direct?channel=web" +
      "&child_site_id=6&site_id=2&version=2&cartid=" + cartId +
      "&token=" + token + "&v2=true";
    var xhr = new XMLHttpRequest();
    z = JSON.stringify(z);
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        try {
          result = JSON.parse(this.responseText);
          arrayMsg.push([code, result.status.message.message, 1429]);
          if (result.status.code == 200) {
            resolve(true);
          }
          else resolve(false);
        }
        catch (e) {
          arrayMsg.push([code, result.status.message.message, 1429]);
          resolve(false);
        }
      }
    }
    xhr.open("POST", RequestURL);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.setRequestHeader('X-Requested-With', "XMLHttpRequest");
    xhr.send(z);
  });
}

function getBest(res, productId) {
  return new Promise(async (resolve) => {
    var maxsav = -1, maxcode = -1;
    for (let i = 0; i < res.length; i++) {
      let ans = await isapplicable(productId, res[i].code);
      if (ans) {
        if (res[i].totalSaving > maxsav) {
          maxsav = res[i].totalSaving;
          maxcode = res[i].code;
        }
      }
    }
    toSend = { "maxsaving": maxsav, "maxcode": maxcode };
    resolve(toSend);
  })
}

function callForOne(productId, childSiteId, siteId, version, parentId, price,
  merchantId, brandId) {
  return new Promise((resolve) => {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        // Typical action to be performed when the document is ready:
        // console.log(this.responseText);
        let res = JSON.parse(this.responseText);
        resolve(res.codes);
      }
    }
    let RequestURL = "https://paytmmall.com/papi/v1/promosearch/product/" +
      productId + "/offers?channel=web&child_site_id=" + childSiteId +
      "&site_id=" + siteId + "&version=" + version + "&parent_id=" + parentId 
      + "&price=" + price + "&merchant_id=" + merchantId 
      + "&brand_id=" + brandId;
    // console.log(RequestURL);
    xhr.open("GET", RequestURL);
    xhr.send();
  });
}
function sleep(ms) {
  // console.log("gonna sleep");
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getListOfProducts() {
  return new Promise((resolve) => {
    let cartId = localStorage.getItem('cartId');
    let token = JSON.parse(localStorage.getItem('sessionValue')).user.sso_token_enc;
    let RequestURL = "https://paytmmall.com/proxy/cart-direct?channel=web" +
      "&child_site_id=6&site_id=2&version=2&cartid=" + cartId +
      "&token=" + token + "&v2=true";
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        try {
          let result = JSON.parse(this.responseText);
          resolve(result.cart.cart_items);
        }
        catch (e) {
          resolve([]);
        }
      }
    }
    xhr.open("GET", RequestURL);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader('X-Requested-With', "XMLHttpRequest");
    xhr.send();
  });
}

function applyBest(offers, i) {
  return new Promise(async (resolve) => {
    document.getElementsByClassName('gOwE')[i].children[0].children[0].click();
    await sleep(1000);
    if (document.getElementsByClassName('vqzn')[0]) {
      document.getElementsByClassName('vqzn')[0].click();
      await sleep(1000);
      document.getElementsByClassName('_-naE')[1].click();
      await sleep(1000);
      document.getElementsByClassName('gOwE')[i].children[0].children[0].click();
    }
    await sleep(1000);
    let disc = document.getElementsByClassName('_2gze');
    let j;
    for (j = 0; j < disc.length; j++) {
      if (document.getElementsByClassName('_3xZn')[j].innerText ==
        offers.maxcode.trim()) {
        // console.log('wow', j);
        document.getElementsByClassName('_2ExE')[j].click();
        resolve();
      }
    }
  });
}
async function callAPIs() {
  let childSiteId = 6;
  let siteId = 2;
  let version = 2;
  let recentProducts = JSON.parse(localStorage.getItem('recentProducts'));
  var inCart = {};
  products = await getListOfProducts();
  for (i = 0; i < products.length; i++) {
    if (products[i].product_id) {
      inCart[products[i].product_id] = {
        index: i,
        merchantId: products[0].merchant_id,
        brandId: products[0].brand_id
      };
    }
  }
  for (let i = 0; i < recentProducts.length; ++i) {
    try {
      let parentId = recentProducts[i].parent_id;
      let price = recentProducts[i].offer_price;
      let productId = recentProducts[i].id;
      if (inCart[productId] == undefined)
        continue;
      let merchantId = inCart[productId].merchantId;
      let brandId = inCart[productId].brandId;
      let res = await callForOne(productId, childSiteId, siteId, version, parentId, price, merchantId, brandId);
      let offers = await getBest(res, productId);
      arrayMsg.push([offers.maxcode, "Success", 1429, 1]);
      if (offers.maxcode != -1) {
        await applyBest(offers, inCart[productId].index);
      }
    }
    catch (e) { 
      //console.log(e)
    }
  }
  await sendToBkg();
}

function sendToBkg() {
  return new Promise((resolve) => {
    arrayMsg = JSON.stringify(arrayMsg); // add arraymsg for delete coupon
    var jsonArr = [{'cpn_msg': arrayMsg}];
    jsonArr = JSON.stringify(jsonArr);
    sendMessage(1, jsonArr, 12, doNothing, resolve());
    arrayMsg = [];
    resolve();
  });
}

function addIcon() {
  var img = document.createElement("img");
  var imageURL = returnResource("apply-coupon.png");
  img.id = "hello";
  img.addEventListener('click', callAPIs);
  img.src = imageURL;
  var src = $("._3rPj")[0];
  src.prepend(img);
}
if (window.location.href.includes("https://paytmmall.com/cart")) {
  setTimeout(() => {
    addIcon();
  }, 3000);
}
else {
  var checker = setInterval(() => {
    if(window.location.href.includes('https://paytmmall.com/cart')) {
      // console.log('kafi sahi');
      clearInterval(checker);
      document.location.reload();
    }
  },500);
}
//add affilate 




