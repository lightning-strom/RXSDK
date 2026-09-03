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
exports.removeStorageByPrefix = exports.listenVisibilityChange = exports.getSearchQueries = exports.getUserInfo = exports.getSystemInfo = void 0;
var const_1 = require("@/config/const");
var utils_1 = require("@/utils/utils");
var lodash_es_1 = require("lodash-es");
var getSystemInfo = function () {
    if (typeof window !== 'undefined' && !window.qq)
        return {
            system: '',
        };
    return qq.getSystemInfoSync();
};
exports.getSystemInfo = getSystemInfo;
var getUserInfo = function (_a) {
    var screenWidth = _a.screenWidth, screenHeight = _a.screenHeight, button = _a.button, _b = _a.withCredentials, withCredentials = _b === void 0 ? true : _b, _c = _a.lang, lang = _c === void 0 ? 'zh_CN' : _c, _d = _a.autoClose, autoClose = _d === void 0 ? true : _d, _e = _a.isCheck, isCheck = _e === void 0 ? true : _e, setInstance = _a.setInstance;
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var auth, data, width, height, instance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!isCheck) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, utils_1.asyncFunc)(qq.getSetting)];
                case 1:
                    auth = _a.sent();
                    if (!auth.authSetting['scope.userInfo']) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, utils_1.asyncFunc)(qq.getUserInfo, {
                            withCredentials: withCredentials,
                            lang: lang,
                        })];
                case 2:
                    data = _a.sent();
                    console.info('sdk getUserInfo by qq.getUserInfo: ', data);
                    console.info('=====================');
                    resolve(data);
                    return [2 /*return*/];
                case 3:
                    width = 200;
                    height = 40;
                    instance = setInstance(qq.createUserInfoButton(Object.assign({
                        type: 'text',
                        text: '允许获取头像昵称',
                        style: {
                            left: (screenWidth - width) / 2,
                            top: screenHeight - 80 - height / 2,
                            width: width,
                            height: height,
                            lineHeight: height,
                            backgroundColor: '#ffffff',
                            color: '#0bb20c',
                            textAlign: 'center',
                            fontSize: 16,
                            borderRadius: 4,
                            borderColor: '#d9d9da',
                            borderWidth: 1,
                        },
                        withCredentials: withCredentials,
                        lang: lang,
                    }, button)));
                    console.log('instance:', instance);
                    instance &&
                        instance.onTap(function (res) {
                            if (res.errMsg.includes(':ok')) {
                                console.info('sdk getUserInfo by qq.createUserInfoButton: ', res);
                                console.info('=====================');
                                resolve(res);
                            }
                            else {
                                var error = new Error(res.errMsg);
                                error.code = const_1.COMMON_ERROR_CODE.USER_INFO_AUTH_DENY;
                                reject(error);
                            }
                            if (autoClose) {
                                instance && instance.destroy();
                                setInstance(null);
                            }
                        });
                    return [2 /*return*/];
            }
        });
    }); });
};
exports.getUserInfo = getUserInfo;
function getSearchQueries(ifStringify) {
    var _a = wx.getLaunchOptionsSync(), query = _a.query, extraData = _a.referrerInfo.extraData;
    extraData = extraData || {};
    query = __assign(__assign({}, query), extraData);
    return ifStringify ? utils_1.qs.stringify(query) : query;
}
exports.getSearchQueries = getSearchQueries;
/**
 * @name listenVisibilityChange
 * @desc 监听显示/隐藏
 */
var listenVisibilityChange = function (callbak) {
    qq.onShow(function () {
        callbak(true);
    });
    qq.onHide(function () {
        callbak(false);
    });
};
exports.listenVisibilityChange = listenVisibilityChange;
/**
 * @name removeStorageByPrefix
 * @desc 删除指定前缀的storage缓存
 */
var removeStorageByPrefix = function (prefix, predict) {
    var info = qq.getStorageInfoSync();
    var targetKeys = info.keys.filter(function (key) { return (0, lodash_es_1.isFunction)(predict) ? predict(key) : key.startsWith(prefix); });
    targetKeys.forEach(function (key) { return qq.removeStorageSync(key); });
};
exports.removeStorageByPrefix = removeStorageByPrefix;
//# sourceMappingURL=utils.js.map