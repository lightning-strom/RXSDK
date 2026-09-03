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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doRequest = exports.generateMD5 = exports.AesDecryptBase64String = exports.AesEncryptBase64String = exports.cpkey = void 0;
var config_1 = require("@/config");
var v4_1 = require("uuid/v4");
var const_1 = require("@/config/const");
var utils_1 = require("@/utils/utils");
var api_1 = require("@/api/api");
var day_1 = require("@/utils/day");
var enum_1 = require("@/config/enum");
// @ts-ignore
// import { cryptoJS } from '../index.crypto.js'
exports.cpkey = '4ca7dacc9332d74e1292c83f0aa3b376';
function crypto() {
    // @ts-ignore
    // return cryptoJS()
    return wx.crypto;
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
var getDevicecode = function () {
    try {
        var devicecode = wx.getStorageSync('rx_devicecode');
        if (devicecode) {
            // @ts-ignore
            return devicecode.code;
        }
        else {
            var code = (0, v4_1.default)();
            wx.setStorageSync('rx_devicecode', { code: code, openIds: {} });
            return code;
        }
    }
    catch (err) {
        return (0, v4_1.default)();
    }
};
function checkNeedAesEncrypt(url) {
    if (!crypto()) {
        return false;
    }
    if (!config_1.SYSTEM_INFO.CP_OF) {
        return false;
    }
    return !url.includes('/v1/sdkconfig/init');
}
// 接口白名单：初始化未成功之前能走请求的接口
var apiWhiteList = ['/v1/sdkconfig/init', '/v1/vcapi/update', '/v1/vcapi/update_module_version'];
var refreshCode = [302206, 302207, 302002];
function moveToStart(arr, index) {
    // 移除指定索引的元素并获取它
    var element = arr.splice(index, 1)[0];
    // 在数组开始位置插入这个元素
    arr.unshift(element);
    return arr;
}
var refreshTokenReq = function () {
    return doRequest({
        method: 'POST',
        url: '/v1/passport/token/refresh'
    });
};
var getHeaders = function (path) {
    var _a, _b;
    var accessWhiteSpace = [
        '/v1/passport/account/login_by_credential',
        '/v1/passport/account/login_by_token'
    ];
    var getDevicecode = function () {
        try {
            var devicecode = wx.getStorageSync('rx_devicecode');
            if (devicecode) {
                // @ts-ignore
                return devicecode.code;
            }
            else {
                var code = (0, v4_1.default)();
                wx.setStorageSync('rx_devicecode', { code: code, openIds: {} });
                return code;
            }
        }
        catch (err) {
            return (0, v4_1.default)();
        }
    };
    var devicecode = getDevicecode();
    var headers = (_a = {},
        _a['ruixue-language'] = 'zh-CN',
        _a['ruixue-cpid'] = config_1.SYSTEM_INFO.cpid,
        _a['ruixue-productid'] = config_1.SYSTEM_INFO.productId,
        _a['ruixue-channelid'] = config_1.SYSTEM_INFO.channelId,
        _a['ruixue-platformid'] = '4',
        _a['ruixue-devicecode'] = devicecode,
        _a['ruixue-version'] = config_1.SYSTEM_INFO.__RX_SDK_VERSION,
        _a['ruixue-traceid'] = (0, v4_1.default)(),
        _a['ruixue-tzoffset'] = config_1.SYSTEM_INFO.timezone + '',
        _a);
    var rxToken = wx.getStorageSync('rxToken');
    if (!accessWhiteSpace.includes(path)) {
        // @ts-ignore
        Reflect.set(headers, 'ruixue-accesstoken', (rxToken === null || rxToken === void 0 ? void 0 : rxToken.access) || '');
    }
    if (path == '/v1/passport/token/refresh') {
        console.log('refresh');
        headers['ruixue-datacount'] = '1';
        // @ts-ignore
        headers['ruixue-refreshtoken'] = rxToken === null || rxToken === void 0 ? void 0 : rxToken.refresh;
    }
    if (path.includes('/v1/data/api/track')) {
        headers = (_b = {},
            _b['ruixue-datacount'] = '1',
            _b);
    }
    if (checkNeedAesEncrypt(path)) {
        headers['ruixue-encipher'] = '1';
        headers['ruixue-devicecode'] = devicecode;
        headers['ruixue-version'] = config_1.SYSTEM_INFO.__RX_SDK_VERSION;
        headers['ruixue-platformid'] = '4';
    }
    if (config_1.SYSTEM_INFO.region_tag) {
        headers['ruixue-region'] = "".concat(config_1.SYSTEM_INFO.region_tag);
    }
    if (config_1.SYSTEM_INFO.cp_role_id) {
        headers['ruixue-cp-role-id'] = "".concat(config_1.SYSTEM_INFO.cp_role_id);
    }
    if (config_1.SYSTEM_INFO.miniVersion) {
        headers['ruixue-appinfo'] = "version=".concat(config_1.SYSTEM_INFO.miniVersion);
    }
    return headers;
};
function removeKeyFromObject(obj) {
    return Object.fromEntries(Object.entries(obj).filter(function (_a) {
        var key = _a[0];
        return key !== 'ruixue-encipher';
    }));
}
function isJsonString(str) {
    try {
        var parsed = JSON.parse(str);
        return true;
    }
    catch (e) {
        return false;
    }
}
var retryRequest = function (options, resolve, reject) {
    var header = removeKeyFromObject(options.header);
    (0, utils_1.printLog)("".concat(options.url));
    (0, utils_1.printLog)("options", options);
    (0, utils_1.printLog)("timeout", config_1.SYSTEM_INFO.timeout);
    wx.request(__assign(__assign({}, options), { header: header, timeout: config_1.SYSTEM_INFO.timeout || 7000, data: options.data, success: function (res) {
            (0, utils_1.printLog)("".concat(options.url));
            (0, utils_1.printLog)("res", res.data);
            resolve(res.data);
        }, fail: function (res) {
            (0, utils_1.printLog)("".concat(options.url));
            (0, utils_1.printLog)("err", res);
            reject(res);
        } }));
};
function trackEncrypt(options, key) {
    (0, api_1.trackApi)([
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
            devicecode: getDevicecode(),
            properties: {
                error_action: 'encrypt',
                error_type: 'sdk',
                trace_id: (0, v4_1.default)(),
                rx_version: config_1.SYSTEM_INFO.__RX_SDK_VERSION,
                type_tripartite: enum_1.PLATFORM.WECHAT,
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
function trackDecrypt(options, res, key) {
    if (options.url.includes('/v1/data/api/track')) {
        return;
    }
    (0, api_1.trackApi)([
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
            devicecode: getDevicecode(),
            properties: {
                error_action: 'decrypt',
                error_type: 'sdk',
                trace_id: (0, v4_1.default)(),
                rx_version: config_1.SYSTEM_INFO.__RX_SDK_VERSION,
                type_tripartite: enum_1.PLATFORM.WECHAT,
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
var myRequest = function (options) {
    var devicecode = getDevicecode();
    var key = generateMD5(devicecode + exports.cpkey);
    (0, utils_1.printLog)("".concat(options.url));
    (0, utils_1.printLog)("options", options);
    return new Promise(function (resolve, reject) {
        var data = options.data;
        var isAes = checkNeedAesEncrypt(options.url);
        try {
            data = (isAes && options.method.toLowerCase() != 'get') ? AesEncryptBase64String(JSON.stringify(options.data), key, key.slice(0, 16)) : options.data;
            if (isAes && options.method.toLowerCase() != 'get') {
                (0, utils_1.printLog)('Encrypt Data:', data);
            }
        }
        catch (e) {
            trackEncrypt(options, key);
            retryRequest(options, resolve, reject);
            return;
        }
        (0, utils_1.printLog)("timeout", config_1.SYSTEM_INFO.timeout);
        wx.request(__assign(__assign({}, options), { data: data, timeout: config_1.SYSTEM_INFO.timeout || 7000, success: function (res) {
                var _a, _b, _c, _d;
                if ([302015, 302016].includes((_a = res.data) === null || _a === void 0 ? void 0 : _a.code)) {
                    (0, utils_1.printLog)('request 解密失败', options.url, (_b = res.data) === null || _b === void 0 ? void 0 : _b.code);
                    trackDecrypt(options, res, key);
                    retryRequest(options, resolve, reject);
                }
                else {
                    var data_1 = (_c = res.data) === null || _c === void 0 ? void 0 : _c.data;
                    if (isAes && data_1) {
                        try {
                            if (((_d = res.data) === null || _d === void 0 ? void 0 : _d.code) === 0) {
                                data_1 = AesDecryptBase64String(data_1, key, key.slice(0, 16));
                                (0, utils_1.printLog)('Decrypt Data:', data_1);
                                var result = __assign(__assign({}, res.data), { data: isJsonString(data_1) ? JSON.parse(data_1) : data_1 });
                                (0, utils_1.printLog)("".concat(options.url));
                                (0, utils_1.printLog)("res", result);
                                resolve(result);
                            }
                            else {
                                resolve(res.data);
                            }
                        }
                        catch (e) {
                            (0, utils_1.printLog)('response 解密失败', options.url, e);
                            trackDecrypt(options, res, key);
                            retryRequest(options, resolve, reject);
                        }
                    }
                    else {
                        (0, utils_1.printLog)("".concat(options.url));
                        (0, utils_1.printLog)("res", res.data);
                        resolve(res.data);
                    }
                }
            }, fail: function (res) {
                (0, utils_1.printLog)("".concat(options.url));
                (0, utils_1.printLog)("err", res);
                reject(res);
            } }));
    });
};
function isHttpOrHttps(url) {
    return /^(http:\/\/|https:\/\/)/.test(url);
}
function resetOptions(options) {
    return __awaiter(this, void 0, void 0, function () {
        var _options, code, e_1, code, e_2, code, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _options = JSON.parse(JSON.stringify(options));
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    if (!(_options.url == '/v1/passport/account/login_by_credential')) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, utils_1.asyncFunc)(wx.login)];
                case 2:
                    code = (_a.sent()).code;
                    _options.data.ext.code = code;
                    _a.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    e_1 = _a.sent();
                    console.log(e_1);
                    return [3 /*break*/, 5];
                case 5:
                    _a.trys.push([5, 8, , 9]);
                    if (!(_options.url == '/v1/passport/user/sync_info')) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, utils_1.asyncFunc)(wx.login)];
                case 6:
                    code = (_a.sent()).code;
                    _options.data.code = code;
                    _a.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    e_2 = _a.sent();
                    console.log(e_2);
                    return [3 /*break*/, 9];
                case 9:
                    _a.trys.push([9, 12, , 13]);
                    if (!(_options.url == '/v1/passport/captcha/send_auth')) return [3 /*break*/, 11];
                    return [4 /*yield*/, (0, utils_1.asyncFunc)(wx.login)];
                case 10:
                    code = (_a.sent()).code;
                    _options.data.minigame_code = code;
                    _a.label = 11;
                case 11: return [3 /*break*/, 13];
                case 12:
                    e_3 = _a.sent();
                    console.log(e_3);
                    return [3 /*break*/, 13];
                case 13: return [2 /*return*/, _options];
            }
        });
    });
}
function doRequest(options, urlIndex, refreshNum, enableHttpDNS) {
    var _a, _b;
    if (urlIndex === void 0) { urlIndex = 0; }
    if (refreshNum === void 0) { refreshNum = 0; }
    if (enableHttpDNS === void 0) { enableHttpDNS = false; }
    return __awaiter(this, void 0, void 0, function () {
        var path, error, headers, useHttpDNS, enableHttpDNSOptions, url, res, refreshRes, _options, msg, error, e_4, _options, _options, url, error;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    config_1.SYSTEM_INFO.reqUrlIndex = urlIndex;
                    path = options.url;
                    if (!apiWhiteList.find(function (item) { return options.url.startsWith(item); }) && !config_1.SYSTEM_INFO.SDK_INIT_FINISHED) {
                        (0, utils_1.printLog)('sdk doRequest options: ', JSON.stringify(options));
                        error = {
                            msg: '初始化错误，或未初始化',
                            code: const_1.COMMON_ERROR_CODE.INIT_PARAMS_ERROR,
                            thirdcode: const_1.COMMON_ERROR_CODE.INIT_PARAMS_ERROR,
                            thrdmsg: '初始化错误，或未初始化',
                            url: options.url
                        };
                        throw error;
                    }
                    headers = getHeaders(path);
                    useHttpDNS = !!config_1.SYSTEM_INFO.httpDNSServiceId && enableHttpDNS;
                    enableHttpDNSOptions = useHttpDNS ? {
                        enableHttpDNS: true,
                        httpDNSServiceId: config_1.SYSTEM_INFO.httpDNSServiceId
                    } : {};
                    if (useHttpDNS) {
                        (0, utils_1.printLog)('---useHttpDNS---');
                        (0, utils_1.printLog)(config_1.SYSTEM_INFO.httpDNSServiceId);
                    }
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 10, , 17]);
                    url = isHttpOrHttps(path) ? path : config_1.SYSTEM_INFO.baseUrlList[urlIndex] + path;
                    return [4 /*yield*/, myRequest(__assign({ url: url, method: options.method, data: options.data || options.params, header: __assign({}, headers), enableHttp2: true }, enableHttpDNSOptions))];
                case 2:
                    res = _c.sent();
                    if (res.code == 0) {
                        return [2 /*return*/, res];
                    }
                    if (!refreshCode.includes(res.code)) return [3 /*break*/, 8];
                    if (!(refreshNum === 5)) return [3 /*break*/, 3];
                    refreshNum = 0;
                    throw { code: 1000000, msg: 'refresh token failed,please login again' };
                case 3:
                    refreshNum++;
                    return [4 /*yield*/, refreshTokenReq()];
                case 4:
                    refreshRes = _c.sent();
                    wx.setStorageSync('rxToken', refreshRes.data);
                    return [4 /*yield*/, resetOptions(options)];
                case 5:
                    _options = _c.sent();
                    return [4 /*yield*/, doRequest(_options, urlIndex, refreshNum, enableHttpDNS)];
                case 6: return [2 /*return*/, _c.sent()];
                case 7: return [3 /*break*/, 9];
                case 8:
                    msg = res.msg || res.message || res.errorMsg || 'Error';
                    error = new Error(msg);
                    error.code = res.code || const_1.COMMON_ERROR_CODE.UNKNOW_NETWORK_ERROR;
                    error.data = res.data || res;
                    error.thirdcode = res.thirdcode;
                    error.thirdmsg = res.thirdmsg;
                    error.client_ip = res.client_ip || '';
                    error.isServerError = true;
                    throw error;
                case 9: return [3 /*break*/, 17];
                case 10:
                    e_4 = _c.sent();
                    if (!(urlIndex < config_1.SYSTEM_INFO.baseUrlList.length - 1)) return [3 /*break*/, 13];
                    urlIndex++;
                    return [4 /*yield*/, resetOptions(options)];
                case 11:
                    _options = _c.sent();
                    return [4 /*yield*/, doRequest(_options, urlIndex, refreshNum, enableHttpDNS)];
                case 12: return [2 /*return*/, _c.sent()];
                case 13:
                    urlIndex = 0;
                    if (!(!enableHttpDNS && (((_a = e_4.errMsg) === null || _a === void 0 ? void 0 : _a.includes('ERR_NAME_NOT_RESOLVED')) || ((_b = e_4.errMsg) === null || _b === void 0 ? void 0 : _b.includes('ERR_CONNECTION_TIMED_OUT'))))) return [3 /*break*/, 16];
                    return [4 /*yield*/, resetOptions(options)];
                case 14:
                    _options = _c.sent();
                    return [4 /*yield*/, doRequest(_options, urlIndex, refreshNum, true)];
                case 15: return [2 /*return*/, _c.sent()];
                case 16:
                    url = isHttpOrHttps(path) ? path : config_1.SYSTEM_INFO.baseUrlList[urlIndex] + path;
                    error = __assign({ url: url, request_header: headers, request_body: options.data || options.params, code: e_4.code || e_4.errno || const_1.COMMON_ERROR_CODE.UNKNOW_NETWORK_ERROR, msg: e_4.msg || e_4.message || e_4.errMsg || 'Error' }, e_4);
                    throw error;
                case 17: return [2 /*return*/];
            }
        });
    });
}
exports.doRequest = doRequest;
//# sourceMappingURL=request.new.js.map