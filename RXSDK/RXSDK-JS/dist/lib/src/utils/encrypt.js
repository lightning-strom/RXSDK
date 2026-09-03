"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSignature = void 0;
// @ts-ignore
var md5_min_1 = require("blueimp-md5/js/md5.min");
var v4_1 = require("uuid/v4");
var encrypt = function (data) {
    return (0, md5_min_1.default)(data).toUpperCase();
};
var getSignature = function (_a) {
    var openid = _a.openid, token = _a.token, appid = _a.appid;
    var nonce = (0, v4_1.default)();
    var ts = Math.floor(new Date().getTime() / 1000);
    var signTemp = "appid=".concat(appid, "&nonce=").concat(nonce, "&openid=").concat(openid, "&ts=").concat(ts);
    var sign = encrypt("".concat(signTemp).concat(token));
    return {
        sign: sign,
        nonce: nonce,
        openid: openid,
        ts: ts,
        appid: appid,
    };
};
exports.getSignature = getSignature;
//# sourceMappingURL=encrypt.js.map