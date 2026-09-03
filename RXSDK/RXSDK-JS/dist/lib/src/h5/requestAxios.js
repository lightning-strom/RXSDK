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
exports.doRequest = void 0;
var axios_1 = require("axios");
var config_1 = require("@/config");
var v4_1 = require("uuid/v4");
var const_1 = require("@/config/const");
var utils_1 = require("@/h5/utils");
var utils_2 = require("@/utils/utils");
var requestFetchAdapter_1 = require("./requestFetchAdapter");
// 接口白名单：初始化未成功之前能走请求的接口
var apiWhiteList = ['/v1/sdkconfig/init', '/v1/vcapi/update', '/v1/vcapi/update_module_version', '/v1/data/api/track'];
var refreshCode = [302206, 302207, 302002];
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
            var devicecode = (0, utils_1.customGetStorageSync)('rx_devicecode');
            if (devicecode) {
                // @ts-ignore
                return devicecode.code;
            }
            else {
                var code = (0, v4_1.default)();
                (0, utils_1.customSetStorageSync)('rx_devicecode', { code: code, openIds: {} });
                return code;
            }
        }
        catch (err) {
            return (0, v4_1.default)();
        }
    };
    var devicecode = getDevicecode();
    var headers = (_a = {},
        _a['ruixue-language'] = config_1.SYSTEM_INFO.language || 'zh-CN',
        _a['ruixue-cpid'] = config_1.SYSTEM_INFO.cpid,
        _a['ruixue-productid'] = config_1.SYSTEM_INFO.productId,
        _a['ruixue-channelid'] = config_1.SYSTEM_INFO.channelId,
        _a['ruixue-platformid'] = '4',
        _a['ruixue-devicecode'] = devicecode,
        _a['ruixue-version'] = config_1.SYSTEM_INFO.__RX_SDK_VERSION,
        _a['ruixue-traceid'] = (0, v4_1.default)(),
        _a['ruixue-tzoffset'] = config_1.SYSTEM_INFO.timezone + '',
        _a);
    var rxToken = (0, utils_1.customGetStorageSync)('rxToken');
    if (!accessWhiteSpace.includes(path)) {
        // @ts-ignore
        Reflect.set(headers, 'ruixue-accesstoken', rxToken === null || rxToken === void 0 ? void 0 : rxToken.access);
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
    if ((0, utils_1.checkNeedAesEncrypt)(path)) {
        headers['ruixue-encipher'] = '1';
        headers['ruixue-devicecode'] = devicecode;
        headers['ruixue-version'] = config_1.SYSTEM_INFO.__RX_SDK_VERSION;
        headers['ruixue-platformid'] = '4';
        headers['Content-Type'] = 'text/plan';
    }
    if (config_1.SYSTEM_INFO.region_tag) {
        headers['ruixue-region'] = "".concat(config_1.SYSTEM_INFO.region_tag);
    }
    if (config_1.SYSTEM_INFO.cp_role_id) {
        headers['ruixue-cp-role-id'] = "".concat(config_1.SYSTEM_INFO.cp_role_id);
    }
    if (config_1.SYSTEM_INFO.third_channel_code) {
        headers['ruixue-third-channel'] = "".concat(config_1.SYSTEM_INFO.third_channel_code);
    }
    return headers;
};
var requestAxios = axios_1.default.create(__assign({ timeout: 60000, responseType: 'json', withCredentials: false }, (process.env.TYPE === 'h5_vng' ? { adapter: requestFetchAdapter_1.default } : {})));
var retryRequest = function (options, resolve, reject) {
    var headers = (0, utils_1.removeKeyFromObject)(options.headers);
    (0, utils_2.printLog)("".concat(options.url));
    (0, utils_2.printLog)("options", options);
    requestAxios({
        url: options.url,
        method: options.method,
        headers: headers,
        params: options.params,
        data: options.data
    }).then(function (res) {
        (0, utils_2.printLog)("".concat(options.url));
        (0, utils_2.printLog)("res", res.data);
        resolve(res.data);
    }).catch(function (err) {
        (0, utils_2.printLog)("".concat(options.url));
        (0, utils_2.printLog)("err", JSON.stringify(err));
        reject(err);
    });
};
var myRequest = function (options) {
    var devicecode = (0, utils_1.getDevicecode)();
    var key = (0, utils_1.generateMD5)(devicecode + utils_1.cpkey);
    (0, utils_2.printLog)("".concat(options.url));
    (0, utils_2.printLog)("options", options);
    return new Promise(function (resolve, reject) {
        var data = options.data;
        var isAes = (0, utils_1.checkNeedAesEncrypt)(options.url);
        try {
            data = (isAes && options.method.toLowerCase() != 'get') ? (0, utils_1.aesEncryptBase64String)(options.data, key) : options.data;
            if (isAes && options.method.toLowerCase() != 'get') {
                (0, utils_2.printLog)('Encrypt Data:', data);
                (0, utils_2.printLog)('Self Encrypt Data:', (0, utils_1.aesDecryptBase64String)(data, key));
            }
        }
        catch (e) {
            // @ts-ignore
            (0, utils_1.trackEncrypt)(options, process.env.TYPE, key);
            retryRequest(options, resolve, reject);
            return;
        }
        requestAxios({
            url: options.url,
            method: options.method,
            headers: options.headers,
            params: options.params,
            data: data
        }).then(function (res) {
            var _a, _b, _c, _d;
            if (res.status == 500) {
                return Promise.reject({
                    code: const_1.COMMON_ERROR_CODE.INTERNAL_SERVER_ERROR,
                    msg: res.statusText
                });
            }
            else if ([302015, 302016].includes((_a = res.data) === null || _a === void 0 ? void 0 : _a.code)) {
                (0, utils_2.printLog)('request 解密失败', options.url, (_b = res.data) === null || _b === void 0 ? void 0 : _b.code);
                // @ts-ignore
                (0, utils_1.trackDecrypt)(options, res, process.env.TYPE, key);
                retryRequest(options, resolve, reject);
            }
            else {
                var data_1 = (_c = res.data) === null || _c === void 0 ? void 0 : _c.data;
                if (isAes && data_1) {
                    try {
                        if (((_d = res.data) === null || _d === void 0 ? void 0 : _d.code) === 0) {
                            data_1 = (0, utils_1.aesDecryptBase64String)(data_1, key);
                            (0, utils_2.printLog)('Decrypt Data:', data_1);
                            var result = __assign(__assign({}, res.data), { data: (0, utils_1.isJsonString)(data_1) ? JSON.parse(data_1) : data_1 });
                            (0, utils_2.printLog)("".concat(options.url));
                            (0, utils_2.printLog)("res", result);
                            resolve(result);
                        }
                        else {
                            resolve(res.data);
                        }
                    }
                    catch (e) {
                        (0, utils_2.printLog)('response 解密失败', options.url, e);
                        // @ts-ignore
                        (0, utils_1.trackDecrypt)(options, res, process.env.TYPE, key);
                        retryRequest(options, resolve, reject);
                    }
                }
                else {
                    (0, utils_2.printLog)("".concat(options.url));
                    (0, utils_2.printLog)("res", res.data);
                    resolve(res.data);
                }
            }
        }).catch(function (err) {
            reject(err);
        });
    });
};
function isHttpOrHttps(url) {
    return /^(http:\/\/|https:\/\/)/.test(url);
}
function doRequest(options, urlIndex, refreshNum) {
    if (urlIndex === void 0) { urlIndex = 0; }
    if (refreshNum === void 0) { refreshNum = 0; }
    return __awaiter(this, void 0, void 0, function () {
        var error, path, headers, url, res, msg, error, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    config_1.SYSTEM_INFO.reqUrlIndex = urlIndex;
                    if (!apiWhiteList.find(function (item) { return options.url.startsWith(item); }) && !config_1.SYSTEM_INFO.SDK_INIT_FINISHED) {
                        console.info('sdk doRequest options: ', options);
                        error = new Error('初始化错误，或未初始化');
                        error.code = const_1.COMMON_ERROR_CODE.INIT_PARAMS_ERROR;
                        return [2 /*return*/, Promise.reject(error)];
                    }
                    path = options.url;
                    headers = getHeaders(path);
                    url = isHttpOrHttps(path) ? path : config_1.SYSTEM_INFO.baseUrlList[urlIndex] + path;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, myRequest(__assign(__assign({}, options), { url: url, headers: headers }))];
                case 2:
                    res = _a.sent();
                    if (res.code == 0) {
                        return [2 /*return*/, Promise.resolve(res)];
                    }
                    if (refreshCode.includes(res.code)) {
                        if (refreshNum === 5) {
                            refreshNum = 0;
                            return [2 /*return*/, Promise.reject({ code: 1000000, msg: 'refresh token failed,please login again' })];
                        }
                        else {
                            refreshNum++;
                            return [2 /*return*/, refreshTokenReq().then(function (refreshRes) {
                                    (0, utils_1.customSetStorageSync)('rxToken', refreshRes.data);
                                    return doRequest(options, urlIndex, refreshNum);
                                })];
                        }
                    }
                    else {
                        msg = res.msg || res.message || res.errorMsg || 'Error';
                        error = new Error(msg);
                        error.code = res.code || const_1.COMMON_ERROR_CODE.UNKNOW_NETWORK_ERROR;
                        error.data = res.data || res;
                        error.thirdcode = res.thirdcode;
                        error.thirdmsg = res.thirdmsg;
                        error.isServerError = true;
                        error.url = url;
                        error.request_header = headers;
                        error.request_body = options.data || options.params;
                        return [2 /*return*/, Promise.reject(error)];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    if (urlIndex < config_1.SYSTEM_INFO.baseUrlList.length - 1) {
                        urlIndex++;
                        return [2 /*return*/, doRequest(options, urlIndex, refreshNum)];
                    }
                    if (error_1.message == 'Network Error') {
                        return [2 /*return*/, Promise.reject({
                                code: const_1.COMMON_ERROR_CODE.NETWORK_ERROR,
                                msg: error_1.message
                            })];
                    }
                    if (error_1.message == 'timeout') {
                        return [2 /*return*/, Promise.reject({
                                code: const_1.COMMON_ERROR_CODE.TIMEOUT,
                                msg: error_1.message
                            })];
                    }
                    if (error_1.message == 'Request aborted') {
                        return [2 /*return*/, Promise.reject({
                                code: const_1.COMMON_ERROR_CODE.REQUEST_ABORTED,
                                msg: error_1.message
                            })];
                    }
                    return [2 /*return*/, Promise.reject(__assign({ url: url, request_header: headers, request_body: options.data || options.params, code: error_1.code || const_1.COMMON_ERROR_CODE.UNKNOW_NETWORK_ERROR, msg: error_1.msg || error_1.message || error_1.errMsg || 'Error', thirdcode: error_1.code || const_1.COMMON_ERROR_CODE.UNKNOW_NETWORK_ERROR, thirdmsg: error_1.msg || error_1.message || error_1.errMsg || 'Error' }, error_1))];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.doRequest = doRequest;
//# sourceMappingURL=requestAxios.js.map