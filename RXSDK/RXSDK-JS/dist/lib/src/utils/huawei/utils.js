"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDevicecode = exports.trackDecrypt = exports.trackEncrypt = exports.aesDecryptBase64String = exports.aesEncryptBase64String = exports.isJsonString = exports.removeKeyFromObject = exports.checkNeedAesEncrypt = exports.getCacheKey = exports.asyncFunc = exports.removeStorageByPrefix = exports.storage = exports.getSearchQueries = exports.getSystemInfo = exports.AesDecryptBase64String = exports.AesEncryptBase64String = exports.cpkey = void 0;
var is_1 = require("@/utils/is");
// @ts-ignore
var index_crypto_js_1 = require("@/index.crypto.js");
var config_1 = require("@/config");
var apis_1 = require("@/h5/apis");
var day_1 = require("@/utils/day");
var v4_1 = require("uuid/v4");
exports.cpkey = '4ca7dacc9332d74e1292c83f0aa3b376';
function crypto() {
    // @ts-ignore
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
var getSystemInfo = function () {
    if (typeof window !== 'undefined' && !window.qg)
        return {
            system: ''
        };
    return qg.getSystemInfoSync();
};
exports.getSystemInfo = getSystemInfo;
function getSearchQueries(ifStringify) {
    return {};
    // let { query, extra } = qg?.getLaunchOptionsSync()
    // extra = extra || {}
    // query = {
    //   ...query,
    //   ...extra,
    // }
    // console.log('测试携带参数', query)
    // return ifStringify ? qs.stringify(query) : query
}
exports.getSearchQueries = getSearchQueries;
exports.storage = {
    get: function (key) {
        var objstr = localStorage.getItem(key);
        if (objstr) {
            try {
                return JSON.parse(objstr) || undefined;
            }
            catch (e) {
                return objstr;
            }
        }
        return undefined;
    },
    set: function (key, value) {
        try {
            return localStorage.setItem(key, JSON.stringify(value));
        }
        catch (e) {
            return localStorage.setItem(key, value);
        }
    },
    remove: function (key) {
        localStorage.removeItem(key);
    },
    clear: function () {
        localStorage.clear();
    }
};
/**
 * @name removeStorageByPrefix
 * @desc 删除指定前缀的storage缓存
 */
var removeStorageByPrefix = function (prefix, predict) {
    var keys = Object.keys(localStorage);
    var targetKeys = keys.filter(function (key) { return (0, is_1.isFunction)(predict) ? predict(key) : key.startsWith(prefix); });
    targetKeys.forEach(function (key) { return exports.storage.remove(key); });
};
exports.removeStorageByPrefix = removeStorageByPrefix;
var asyncFunc = function (func, options, params) {
    return new Promise(function (resolve, reject) {
        func.apply(void 0, __spreadArray([Object.assign({}, options, { success: resolve, fail: function (msg, code) { return reject({ code: code, msg: msg }); } })], (params || []), false));
    });
};
exports.asyncFunc = asyncFunc;
var getCacheKey = function (key, USER_INFO) {
    return "".concat(key, "_").concat(USER_INFO.tid);
};
exports.getCacheKey = getCacheKey;
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
var getDevicecode = function () {
    var devicecode = exports.storage.get('rx_devicecode');
    if (devicecode) {
        return devicecode.code;
    }
    else {
        var code = (0, v4_1.default)();
        exports.storage.set('rx_devicecode', { code: code });
        return code;
    }
};
exports.getDevicecode = getDevicecode;
//# sourceMappingURL=utils.js.map