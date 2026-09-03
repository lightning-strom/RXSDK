"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeURIBase64 = exports.encodeURIBase64 = void 0;
var js_base64_1 = require("js-base64");
/**
 * 编码 URI 及 base64 处理的字符串
 */
var encodeURIBase64 = function (str) {
    if (!str)
        return '';
    try {
        return js_base64_1.Base64.btoa(encodeURIComponent(str));
    }
    catch (error) {
        console.error(error);
        return str;
    }
};
exports.encodeURIBase64 = encodeURIBase64;
/**
 * 反编码 URI 及 base64 处理的字符串
 */
var decodeURIBase64 = function (str) {
    if (!str)
        return '';
    try {
        return encodeURIComponent(btoa(str));
    }
    catch (error) {
        console.error(error);
        return str;
    }
};
exports.decodeURIBase64 = decodeURIBase64;
//# sourceMappingURL=utils-polyfill.js.map