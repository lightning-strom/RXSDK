"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackDecrypt = exports.trackEncrypt = exports.aesDecryptBase64String = exports.aesEncryptBase64String = exports.isJsonString = exports.removeKeyFromObject = exports.checkNeedAesEncrypt = exports.handleTrackError = exports.expiredVoucherCode = exports.isDropOrder = exports.getDevicecode = exports.removeStorageByPrefix = exports.removeStorageSync = exports.customSetStorageSync = exports.customGetStorageSync = exports.getSearchQueries = exports.generateMD5 = exports.AesDecryptBase64String = exports.AesEncryptBase64String = exports.cpkey = void 0;
var utils_1 = require("@/utils/utils");
var is_1 = require("@/utils/is");
var v4_1 = require("uuid/v4");
var apis_1 = require("@/rpk/apis");
var day_1 = require("@/utils/day");
var config_1 = require("@/config");
// @ts-ignore
var index_crypto_js_1 = require("../index.crypto.js");
exports.cpkey = '4ca7dacc9332d74e1292c83f0aa3b376';
function crypto() {
    return (0, index_crypto_js_1.cryptoJS)();
}
/**
 * AES-CBC 加密字符串
 * @param {string} data 需要加密的字符串
 * @param {string} key 加密密钥
 * @param {string} iv 初始化向量
 * @returns {string} 加密后的 Base64 编码字符串
 */
function AesEncryptBase64String(data, key, iv) {
    var CryptoJS = crypto();
    // 将密钥和初始化向量转换为 WordArray
    var keyWordArray = CryptoJS.enc.Utf8.parse(key);
    var ivWordArray = CryptoJS.enc.Utf8.parse(iv);
    // 使用 AES-CBC 加密
    var encrypted = CryptoJS.AES.encrypt(data, keyWordArray, {
        iv: ivWordArray,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    // 返回 Base64 编码的加密结果
    return encrypted.toString();
}
exports.AesEncryptBase64String = AesEncryptBase64String;
/**
 * AES-CBC 解密字符串
 * @param {string} encryptedData 加密后的 Base64 编码字符串
 * @param {string} key 加密密钥
 * @param {string} iv 初始化向量
 * @returns {string} 解密后的原始字符串
 */
function AesDecryptBase64String(encryptedData, key, iv) {
    var CryptoJS = crypto();
    // 将密钥和初始化向量转换为 WordArray
    var keyWordArray = CryptoJS.enc.Utf8.parse(key);
    var ivWordArray = CryptoJS.enc.Utf8.parse(iv);
    // 使用 AES-CBC 解密
    var decrypted = CryptoJS.AES.decrypt(encryptedData, keyWordArray, {
        iv: ivWordArray,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    // 将解密结果转换为 UTF-8 字符串
    return decrypted.toString(CryptoJS.enc.Utf8);
}
exports.AesDecryptBase64String = AesDecryptBase64String;
/**
 * 生成 MD5 加密字符串
 * @param {string} message - 需要加密的字符串
 * @returns {string} - 加密后的 MD5 字符串
 */
function generateMD5(message) {
    var CryptoJS = crypto();
    if (CryptoJS)
        return CryptoJS.MD5(message).toString();
    return '';
}
exports.generateMD5 = generateMD5;
function getQueryParams() {
    var url = window.location.href;
    var index = url.indexOf('?');
    if (index === -1)
        return {};
    var queryString = url.substring(index + 1);
    var params = {};
    var pairs = queryString.split('&');
    for (var _i = 0, pairs_1 = pairs; _i < pairs_1.length; _i++) {
        var pair = pairs_1[_i];
        var _a = pair.split('='), key = _a[0], value = _a[1];
        params[key] = decodeURIComponent(value || '');
    }
    return params;
}
function getSearchQueries(ifStringify) {
    var query = {};
    switch (process.env.TYPE) {
        case 'baidu':
            var _a = swan.getLaunchOptionsSync(), baiduQuery = _a.query, baiduReferrerInfo = _a.referrerInfo;
            var baiduExtra = (baiduReferrerInfo === null || baiduReferrerInfo === void 0 ? void 0 : baiduReferrerInfo.extraData) || {};
            query = __assign(__assign({}, baiduQuery), baiduExtra);
            break;
        case 'alipay':
            var _b = my.getLaunchOptionsSync(), aliQuery = _b.query, aliReferrerInfo = _b.referrerInfo;
            var aliExtra = (aliReferrerInfo === null || aliReferrerInfo === void 0 ? void 0 : aliReferrerInfo.extraData) || {};
            query = __assign(__assign({}, aliQuery), aliExtra);
            break;
        case 'taobao':
            // 淘宝暂时没有 getLaunchOptionsSync 方法
            query = {};
            break;
        case 'ks':
            var ksQuery = ks.getLaunchOptionsSync().query;
            query = __assign({}, ksQuery);
            break;
        case 'bilibili':
            var _c = bl.getLaunchOptionsSync(), blQuery = _c.query, blReferrerInfo = _c.referrerInfo;
            var blExtra = (blReferrerInfo === null || blReferrerInfo === void 0 ? void 0 : blReferrerInfo.extraData) || {};
            query = __assign(__assign({}, blQuery), blExtra);
            break;
        case 'jd':
            var _d = jd.getLaunchOptionsSync(), jdQuery = _d.query, jdReferrerInfo = _d.referrerInfo;
            var jdExtra = (jdReferrerInfo === null || jdReferrerInfo === void 0 ? void 0 : jdReferrerInfo.extraData) || {};
            query = __assign(__assign({}, jdQuery), jdExtra);
            break;
        case 'douyin':
            var _e = tt.getLaunchOptionsSync(), ttQuery = _e.query, ttReferrerInfo = _e.referrerInfo;
            var ttExtra = (ttReferrerInfo === null || ttReferrerInfo === void 0 ? void 0 : ttReferrerInfo.extraData) || {};
            query = __assign(__assign({}, ttQuery), ttExtra);
            break;
        case 'gamebox':
            var _f = gamebox.getLaunchOptionsSync(), gameboxQuery = _f.query, gameboxReferrerInfo = _f.referrerInfo;
            var gameboxExtra = (gameboxReferrerInfo === null || gameboxReferrerInfo === void 0 ? void 0 : gameboxReferrerInfo.extraData) || {};
            query = __assign(__assign({}, gameboxQuery), gameboxExtra);
            break;
        case 'meituan':
            var mtQuery = wx.getLaunchOptionsSync().query;
            query = __assign({}, mtQuery);
            break;
        case '4399':
            var _g = gamebox.getLaunchOptionsSync(), gamebox4399Query = _g.query, gamebox4399ReferrerInfo = _g.referrerInfo;
            var gamebox4399Extra = (gamebox4399ReferrerInfo === null || gamebox4399ReferrerInfo === void 0 ? void 0 : gamebox4399ReferrerInfo.extraData) || {};
            query = __assign(__assign({}, gamebox4399Query), gamebox4399Extra);
            break;
        case 'mgtv':
            var _h = mgtv.getLaunchOptionsSync(), mgtvQuery = _h.query, mgtvPath = _h.path;
            var deviceInfo = mgtv.getDeviceInfo();
            var compare = (0, is_1.compareVersions)(deviceInfo.SDKVersion, '1.2.9');
            if (compare === -1 && mgtvPath) {
                var mgQuery = utils_1.qs.parse(decodeURIComponent(mgtvPath));
                query = __assign(__assign({}, mgQuery), mgtvQuery);
            }
            else {
                query = __assign({}, mgtvQuery);
            }
            break;
        default:
            query = getQueryParams();
    }
    return ifStringify ? utils_1.qs.stringify(query) : query;
}
exports.getSearchQueries = getSearchQueries;
var customGetStorageSync = function (key) {
    switch (process.env.TYPE) {
        case 'baidu':
            return swan.getStorageSync(key);
        case 'alipay':
            var aliRes = my.getStorageSync({ key: key });
            if (aliRes.success) {
                var ali_str = aliRes.data;
                try {
                    return JSON.parse(ali_str);
                }
                catch (e) {
                    return ali_str;
                }
            }
            else {
                return '';
            }
        case 'taobao':
            var tbRes = my.getStorageSync({ key: key });
            var tb_str = tbRes.data;
            try {
                return JSON.parse(tb_str);
            }
            catch (e) {
                return tb_str;
            }
        case 'ks':
            var ksRes = ks.getStorageSync(key);
            try {
                return JSON.parse(ksRes) || '';
            }
            catch (e) {
                return ksRes || '';
            }
        case 'bilibili':
            return bl.getStorageSync(key);
        case 'jd':
            return jd.getStorageSync(key);
        case 'douyin':
            return tt.getStorageSync(key);
        case 'gamebox':
            return gamebox.getStorageSync(key);
        case '4399':
            return gamebox.getStorageSync(key);
        case 'meituan':
            return wx.getStorageSync(key);
        default:
            var str = localStorage.getItem(key);
            try {
                return JSON.parse(str);
            }
            catch (e) {
                return str;
            }
    }
};
exports.customGetStorageSync = customGetStorageSync;
var customSetStorageSync = function (key, value) {
    switch (process.env.TYPE) {
        case 'baidu':
            swan.setStorageSync(key, value);
            break;
        case 'alipay':
            my.setStorageSync({
                key: key,
                data: value
            });
            break;
        case 'taobao':
            my.setStorageSync({
                key: key,
                data: value
            });
            break;
        case 'ks':
            ks.setStorageSync(key, value);
            break;
        case 'bilibili':
            bl.setStorageSync(key, value);
            break;
        case 'jd':
            jd.setStorageSync(key, value);
            break;
        case 'douyin':
            tt.setStorageSync(key, value);
            break;
        case 'gamebox':
            gamebox.setStorageSync(key, value);
            break;
        case '4399':
            gamebox.setStorageSync(key, value);
            break;
        case 'meituan':
            wx.setStorageSync(key, value);
            break;
        default:
            localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
    }
};
exports.customSetStorageSync = customSetStorageSync;
var removeStorageSync = function (key) {
    switch (process.env.TYPE) {
        case 'baidu':
            swan.removeStorageSync(key);
            break;
        case 'alipay':
            my.removeStorageSync({ key: key });
            break;
        case 'taobao':
            my.removeStorageSync({ key: key });
            break;
        case 'ks':
            ks.removeStorageSync(key);
            break;
        case 'bilibili':
            bl.removeStorageSync(key);
            break;
        case 'jd':
            jd.removeStorageSync(key);
            break;
        case 'douyin':
            tt.removeStorageSync(key);
            break;
        case 'gamebox':
            gamebox.removeStorageSync(key);
            break;
        case '4399':
            gamebox.removeStorageSync(key);
            break;
        case 'meituan':
            wx.removeStorageSync(key);
            break;
        default:
            localStorage.removeItem(key);
    }
};
exports.removeStorageSync = removeStorageSync;
// 获取localStorage中所有的key
function getAllKeys() {
    var keys = [];
    for (var i = 0; i < localStorage.length; i++) {
        keys.push(localStorage.key(i));
    }
    return keys;
}
var removeStorageByPrefix = function (prefix, predict) {
    var info;
    var targetKeys = [];
    switch (process.env.TYPE) {
        case 'baidu':
            info = swan.getStorageInfoSync();
            targetKeys = info.keys.filter(function (key) { return (0, is_1.isFunction)(predict) ? predict(key) : key.startsWith(prefix); });
            targetKeys.forEach(function (key) { return swan.removeStorageSync(key); });
            break;
        case 'alipay':
            info = my.getStorageInfoSync();
            targetKeys = info.keys.filter(function (key) { return (0, is_1.isFunction)(predict) ? predict(key) : key.startsWith(prefix); });
            targetKeys.forEach(function (key) { return my.removeStorageSync({ key: key }); });
            break;
        case 'taobao':
            info = my.getStorageInfoSync();
            targetKeys = info.keys.filter(function (key) { return (0, is_1.isFunction)(predict) ? predict(key) : key.startsWith(prefix); });
            targetKeys.forEach(function (key) { return my.removeStorageSync({ key: key }); });
            break;
        case 'ks':
            info = ks.getStorageInfoSync();
            targetKeys = info.keys.filter(function (key) { return (0, is_1.isFunction)(predict) ? predict(key) : key.startsWith(prefix); });
            targetKeys.forEach(function (key) { return ks.removeStorageSync(key); });
            break;
        case 'bilibili':
            info = bl.getStorageInfoSync();
            targetKeys = info.keys.filter(function (key) { return (0, is_1.isFunction)(predict) ? predict(key) : key.startsWith(prefix); });
            targetKeys.forEach(function (key) { return bl.removeStorageSync(key); });
            break;
        case 'jd':
            info = jd.getStorageInfoSync();
            targetKeys = info.keys.filter(function (key) { return (0, is_1.isFunction)(predict) ? predict(key) : key.startsWith(prefix); });
            targetKeys.forEach(function (key) { return jd.removeStorageSync(key); });
            break;
        case 'douyin':
            info = tt.getStorageInfoSync();
            targetKeys = info.keys.filter(function (key) { return (0, is_1.isFunction)(predict) ? predict(key) : key.startsWith(prefix); });
            targetKeys.forEach(function (key) { return tt.removeStorageSync(key); });
            break;
        case 'gamebox':
            info = gamebox.getStorageInfoSync();
            targetKeys = info.keys.filter(function (key) { return (0, is_1.isFunction)(predict) ? predict(key) : key.startsWith(prefix); });
            targetKeys.forEach(function (key) { return gamebox.removeStorageSync(key); });
            break;
        case '4399':
            info = gamebox.getStorageInfoSync();
            targetKeys = info.keys.filter(function (key) { return (0, is_1.isFunction)(predict) ? predict(key) : key.startsWith(prefix); });
            targetKeys.forEach(function (key) { return gamebox.removeStorageSync(key); });
            break;
        case 'meituan':
            info = wx.getStorageInfoSync();
            targetKeys = info.keys.filter(function (key) { return (0, is_1.isFunction)(predict) ? predict(key) : key.startsWith(prefix); });
            targetKeys.forEach(function (key) { return wx.removeStorageSync(key); });
            break;
        default:
            targetKeys = getAllKeys().filter(function (key) { return (0, is_1.isFunction)(predict) ? predict(key) : key.startsWith(prefix); });
            targetKeys.forEach(function (key) { return localStorage.removeItem(key); });
    }
};
exports.removeStorageByPrefix = removeStorageByPrefix;
var getDevicecode = function () {
    var devicecode = (0, exports.customGetStorageSync)('rx_devicecode');
    if (devicecode) {
        return devicecode.code;
    }
    else {
        var code = (0, v4_1.default)();
        (0, exports.customSetStorageSync)('rx_devicecode', { code: code });
        return code;
    }
};
exports.getDevicecode = getDevicecode;
// 支付凭证已经使用过
var VOUCHERUSED = 302408;
// 支付凭证无效
var VOUCHEREXPIRED = 302409;
var isDropOrder = function (errCode) {
    return ([152407, 152401, 182001, 142601, 142602, 152403, 152404].includes(errCode) ||
        (errCode >= 1000 && errCode < 2000));
};
exports.isDropOrder = isDropOrder;
exports.expiredVoucherCode = [VOUCHERUSED, VOUCHEREXPIRED];
function validateNumber(num) {
    var numStr = num.toString();
    var isSixDigits = /^\d{6}$/.test(numStr);
    if (!isSixDigits) {
        return false;
    }
    var thirdDigit = parseInt(numStr[2]);
    var fourthDigit = parseInt(numStr[3]);
    return "".concat(thirdDigit).concat(fourthDigit) === '20';
}
var handleTrackError = function (platform, error_action, error, code) {
    if (error_action === void 0) { error_action = ''; }
    var handle_error = (0, utils_1.handleError)(error, code);
    if (validateNumber(handle_error.code) || !handle_error.isServerError) {
        if (!config_1.SYSTEM_INFO.isMatch) {
            (0, apis_1.trackApi)([
                {
                    event: '#rx_error',
                    type: 'track',
                    time: (0, day_1.formatDate)('YYYY-MM-DDTHH:mm:ss.SSSZ'),
                    uuid: (0, v4_1.default)(),
                    sub_channel_id: config_1.USER_INFO.subchannelid,
                    distinct_id: config_1.USER_INFO.openid,
                    platform_id: 4,
                    product_id: config_1.SYSTEM_INFO.productId,
                    cpid: Number(config_1.SYSTEM_INFO.cpid),
                    channel_id: config_1.SYSTEM_INFO.channelId,
                    devicecode: (0, exports.getDevicecode)(),
                    properties: {
                        error_action: error_action,
                        error_type: 'sdk',
                        trace_id: (0, v4_1.default)(),
                        rx_version: config_1.SYSTEM_INFO.__RX_SDK_VERSION,
                        type_tripartite: platform,
                        request_address: handle_error.url || '',
                        request_header: handle_error.request_header || '',
                        request_body: handle_error.request_body || '',
                        error_code: handle_error.code,
                        error_message: handle_error.msg || '',
                        error_code_tripartite: handle_error.thirdcode || '',
                        error_message_tripartite: handle_error.thirdmsg || '',
                        cp_userid: config_1.USER_INFO.cp_user_id,
                        error_ext: '请前往 https://doc.ruixuecloud.com/#/view?path=9e58d663-7313-498c-b95c-f8706ec09bdd 查看解决方案'
                    }
                }
            ]).catch(function (e) {
                console.log(e);
            });
        }
    }
    return {
        code: handle_error.code,
        msg: handle_error.msg,
        thirdcode: handle_error.thirdcode,
        thirdmsg: handle_error.thirdmsg
    };
};
exports.handleTrackError = handleTrackError;
function checkNeedAesEncrypt(url) {
    if (!crypto()) {
        return false;
    }
    if (!config_1.SYSTEM_INFO.CP_OF) {
        return false;
    }
    return !url.includes('/v1/sdkconfig/init');
}
exports.checkNeedAesEncrypt = checkNeedAesEncrypt;
function removeKeyFromObject(obj) {
    return Object.fromEntries(Object.entries(obj).filter(function (_a) {
        var key = _a[0];
        return key !== 'ruixue-encipher';
    }));
}
exports.removeKeyFromObject = removeKeyFromObject;
function isJsonString(str) {
    try {
        var parsed = JSON.parse(str);
        return true;
    }
    catch (e) {
        return false;
    }
}
exports.isJsonString = isJsonString;
function aesEncryptBase64String(data, key) {
    return AesEncryptBase64String(JSON.stringify(data), key, key.slice(0, 16));
}
exports.aesEncryptBase64String = aesEncryptBase64String;
function aesDecryptBase64String(data, key) {
    return AesDecryptBase64String(data, key, key.slice(0, 16));
}
exports.aesDecryptBase64String = aesDecryptBase64String;
function trackEncrypt(options, platform, key) {
    (0, apis_1.trackApi)([
        {
            event: '#rx_error',
            type: 'track',
            time: (0, day_1.formatDate)('YYYY-MM-DDTHH:mm:ss.SSSZ'),
            uuid: (0, v4_1.default)(),
            sub_channel_id: config_1.USER_INFO.subchannelid,
            distinct_id: config_1.USER_INFO.openid,
            platform_id: 4,
            product_id: config_1.SYSTEM_INFO.productId,
            cpid: Number(config_1.SYSTEM_INFO.cpid),
            channel_id: config_1.SYSTEM_INFO.channelId,
            devicecode: (0, exports.getDevicecode)(),
            properties: {
                error_action: 'encrypt',
                error_type: 'sdk',
                trace_id: (0, v4_1.default)(),
                rx_version: config_1.SYSTEM_INFO.__RX_SDK_VERSION,
                type_tripartite: platform,
                request_address: options.url || '',
                request_header: options.header || '',
                request_body: options.data || '',
                key: key
            }
        }
    ]).catch(function (e) {
        console.log(e);
    });
}
exports.trackEncrypt = trackEncrypt;
function trackDecrypt(options, res, platform, key) {
    if (options.url.includes('/v1/data/api/track')) {
        return;
    }
    (0, apis_1.trackApi)([
        {
            event: '#rx_error',
            type: 'track',
            time: (0, day_1.formatDate)('YYYY-MM-DDTHH:mm:ss.SSSZ'),
            uuid: (0, v4_1.default)(),
            sub_channel_id: config_1.USER_INFO.subchannelid,
            distinct_id: config_1.USER_INFO.openid,
            platform_id: 4,
            product_id: config_1.SYSTEM_INFO.productId,
            cpid: Number(config_1.SYSTEM_INFO.cpid),
            channel_id: config_1.SYSTEM_INFO.channelId,
            devicecode: (0, exports.getDevicecode)(),
            properties: {
                error_action: 'decrypt',
                error_type: 'sdk',
                trace_id: (0, v4_1.default)(),
                rx_version: config_1.SYSTEM_INFO.__RX_SDK_VERSION,
                type_tripartite: platform,
                request_address: options.url || '',
                request_header: options.header || '',
                request_body: options.data || '',
                request_response: res === null || res === void 0 ? void 0 : res.data,
                key: key
            }
        }
    ]).catch(function (e) {
        console.log(e);
    });
}
exports.trackDecrypt = trackDecrypt;
//# sourceMappingURL=utils.js.map