//自定义md5
var crypto = require("crypto");
//1、定义md5加密
    function _md5(pwd){
        var md5 = crypto.createHash("md5");
        var hash = md5.update(pwd).digest("base64");
        return hash;
    };

module.exports = function(pwd){
    return  _md5(_md5(pwd).substr(4,9))+_md5("wl");
}

