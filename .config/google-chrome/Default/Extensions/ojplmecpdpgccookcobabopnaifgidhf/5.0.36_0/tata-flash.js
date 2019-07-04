var jsonArr = [{'execJioSale': 'haiKya'}];
jsonArr = JSON.stringify(jsonArr);
var passBack = [];
passBack = JSON.stringify(passBack);
sendMessage(0, jsonArr, 0, setEmail, passBack);