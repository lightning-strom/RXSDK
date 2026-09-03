"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_common_1 = require("./index.common");
var request_1 = require("./api/request");
var paramsValid_1 = require("@/utils/paramsValid");
var checkConfig_1 = require("@/utils/checkConfig");
var wegame_1 = require("@/utils/checkConfig/wegame");
var utils_1 = require("@/utils/wegame/utils");
var order_1 = require("@/utils/wegame/order");
var api_1 = require("@/api/api");
var config_1 = require("@/config");
var wegame_2 = require("@/config/wegame");
var stOffset_1 = require("@/utils/stOffset");
var is_1 = require("@/utils/is");
var utils_2 = require("@/utils/utils");
var const_1 = require("@/config/const");
var day_1 = require("@/utils/day");
var v4_1 = require("uuid/v4");
var enum_1 = require("@/config/enum");
var social_1 = require("./api/social");
var showMap = {};
function arrayBufferToJson(arrayBuffer) {
    try {
        var uint8Array = new Uint8Array(arrayBuffer);
        var text = '';
        for (var i = 0; i < uint8Array.length; i++) {
            text += String.fromCharCode(uint8Array[i]);
        }
        try {
            return JSON.parse(text);
        }
        catch (error) {
            return {};
        }
    }
    catch (err) {
        return {};
    }
}
function minutesToDays(minutes) {
    // 一天有 24 小时，一小时有 60 分钟，所以一天有 24 * 60 分钟
    var minutesInADay = 24 * 60;
    // 使用 Math.floor 向下取整
    return Math.floor(minutes / minutesInADay);
}
function timestampToDateTime(timestamp) {
    // 创建一个 Date 对象，将时间戳作为参数传入
    var date = new Date(timestamp);
    // 获取年
    var year = date.getFullYear();
    // 月份从 0 开始，所以要加 1
    var month = date.getMonth() + 1;
    // 获取日
    var day = date.getDate();
    // 获取小时
    var hour = date.getHours();
    // 获取分钟
    var minute = date.getMinutes();
    // 获取秒
    var second = date.getSeconds();
    // 为了保证月份、日期、小时、分钟、秒的显示格式，小于 10 的数字前面添加 0
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    hour = hour < 10 ? '0' + hour : hour;
    minute = minute < 10 ? '0' + minute : minute;
    second = second < 10 ? '0' + second : second;
    // 拼接成字符串
    return "".concat(year, "-").concat(month, "-").concat(day, " ").concat(hour, ":").concat(minute, ":").concat(second);
}
function formatTime(milliseconds) {
    var totalSeconds = Math.floor(milliseconds / 1000);
    var hours = Math.floor(totalSeconds / 3600);
    totalSeconds = totalSeconds % 3600;
    var minutes = Math.floor(totalSeconds / 60);
    var seconds = totalSeconds % 60;
    return "".concat(hours, "\u5C0F\u65F6").concat(minutes, "\u5206").concat(seconds, "\u79D2");
}
var _a = (0, order_1.useSupplementOrder)(), expiredVoucherCode = _a.expiredVoucherCode, isDropOrder = _a.isDropOrder, handleDynamicSupplementOrder = _a.handleDynamicSupplementOrder;
var getDevicecode = function () {
    var devicecode = (0, utils_2.customGetStorageSync)('rx_devicecode');
    if (devicecode) {
        return devicecode.code;
    }
    else {
        var code = (0, v4_1.default)();
        (0, utils_2.customSetStorageSync)('rx_devicecode', { code: code, openIds: {} });
        return code;
    }
};
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
var handleTrackError = function (error_action, error, code, type) {
    if (error_action === void 0) { error_action = ''; }
    var error_exception = '';
    try {
        error_exception = JSON.stringify(error.exception || {});
    }
    catch (e) {
    }
    var handle_error = (0, utils_2.handleError)(error, code);
    if (validateNumber(handle_error.code) || !handle_error.isServerError) {
        // 使用实例的 subChannelId
        var sub_channel_id = (sdkWegameInstance === null || sdkWegameInstance === void 0 ? void 0 : sdkWegameInstance.subChannelId) || '';
        (0, api_1.trackApi)([
            {
                event: '#rx_error',
                type: 'track',
                time: (0, day_1.formatDate)('YYYY-MM-DDTHH:mm:ss.SSSZ'),
                uuid: (0, v4_1.default)(),
                sub_channel_id: sub_channel_id,
                distinct_id: config_1.USER_INFO.openid,
                platform_id: 4,
                product_id: config_1.SYSTEM_INFO.productId,
                cpid: Number(config_1.SYSTEM_INFO.cpid),
                channel_id: config_1.SYSTEM_INFO.channelId,
                devicecode: getDevicecode(),
                properties: __assign(__assign({}, (type ? { type: type } : {})), { error_action: error_action, error_exception: error_exception, error_type: 'sdk', trace_id: (0, v4_1.default)(), rx_version: config_1.SYSTEM_INFO.__RX_SDK_VERSION, type_tripartite: enum_1.PLATFORM.WECHAT, request_address: handle_error.url || '', request_header: handle_error.request_header || '', request_body: handle_error.request_body || '', error_code: handle_error.code, error_message: handle_error.msg || '', error_code_tripartite: handle_error.thirdcode || '', error_message_tripartite: handle_error.thirdmsg || '', cp_userid: config_1.USER_INFO.cp_user_id, error_ext: '请前往 https://doc.ruixueyun.com/#/view?path=9e58d663-7313-498c-b95c-f8706ec09bdd 查看解决方案' })
            }
        ]).catch(function (e) {
            console.log(e);
        });
    }
    return __assign(__assign(__assign({ code: handle_error.code, msg: handle_error.msg }, (handle_error.thirdcode !== undefined ? { thirdcode: handle_error.thirdcode } : {})), (handle_error.thirdmsg !== undefined ? { thirdmsg: handle_error.thirdmsg } : {})), { thirdexception: error.exception || {} });
};
var onReportFail = function (result) {
    console.error('onReportFail', result);
    handleTrackError('rxlog_error_ad', __assign(__assign({}, result), { exception: result }), undefined, 'rxlog_error_gdt');
};
var handleGdtTrackResult = function (result) {
    console.log('handleGdtTrackResult', result);
    if (result && result.code !== 0) {
        onReportFail(result);
    }
    return result;
};
var tencent_sdk = null;
// 存储 SdkWegame 实例，供 handleTrackError 使用
var sdkWegameInstance = null;
//微信小游戏sdk
var SdkWegame = /** @class */ (function (_super) {
    __extends(SdkWegame, _super);
    function SdkWegame(initParams) {
        var _this = this;
        var _a, _b, _c;
        _this = _super.call(this, initParams) || this;
        _this._ad = null;
        _this._bannerAd = null;
        _this._interstitialAd = null;
        _this._hasAd = {
            banner: undefined,
            interstitial: undefined,
            rewarded: undefined,
        };
        _this.locationInfomation = null;
        _this.reportLocationTimer = null;
        _this.refreshSession = 0; //用于记录刷新session
        // 上报公共属性接口失败次数
        _this.trackPublicPropsFailCount = 0;
        _this.funcs = [];
        _this.back_flow_day = 0;
        _this.directAdStatus = {};
        _this.directAdGdtReportQueue = [];
        _this.initConfig = {};
        // 调度埋点
        _this.scheduleInitMap = {};
        // 获取分享数据缓存调度上报参数
        _this.scheuleReportProps = {};
        // 将请求实例暴露
        _this.requestInstance = request_1.doRequest;
        // 海报分享参数
        _this.queryPoster = {};
        // 是否支持支付广点通上报
        _this.isSupportGDTReport = true;
        //子渠道id
        _this.subChannelId = null;
        // 上报大数据类型
        _this.dataTrackType = [];
        _this.deviceInfo = null;
        /**
         * 是否登录
         * 使用场景：登录后不允许通过SDK设置子渠道id
         */
        _this.isLogin = false;
        _this.isPromoter = false;
        _this.game_id = '';
        _this.promoInfo = {
            timer: null,
            refresh_period_exp: 0,
            polling: 0,
            promo_code: ''
        };
        // 腾讯广告sdk实例
        _this.tencent_sdk = null;
        _this.create_conn = false;
        // 定义全局的SocketTask实例
        _this.socket_task = null;
        // 心跳检测的时间间隔（单位：毫秒）
        _this.HEARTBEAT_INTERVAL = 3 * 60 * 1000;
        // 存储心跳定时器的标识
        _this.heartbeat_timer = null;
        // 最大重连次数
        _this.MAX_CONNECT_NUMBER = 20;
        // 已经连接次数
        _this.socket_connect_number = 1;
        // 重连时间间隔（单位：毫秒）
        _this.RECONNECT_INTERVAL = 5000;
        // socket游标
        _this.socket_index = 0;
        // socket游标列表
        _this.socket_ws_list = [];
        // socket是否正在发起重连中
        _this.reconnecting = false;
        // socket是否断开不再重连
        _this.no_more_reconnection = false;
        try {
            // 保存实例到全局变量，供 handleTrackError 使用
            sdkWegameInstance = _this;
            wx.setStorageSync('check_support_setStorageSync', 'Support setStorageSync');
            (0, utils_2.printLog)('Support setStorageSync');
            config_1.SYSTEM_INFO.isWxAvailable = true;
        }
        catch (e) {
            config_1.SYSTEM_INFO.isWxAvailable = false;
            (0, utils_2.printLog)('Not supported setStorageSync', e);
        }
        console.log('微信小游戏sdk-基础API');
        (0, paramsValid_1.invalidInitParams)(initParams, checkConfig_1.initParamsCheck);
        console.info('channel sdk check params passed');
        Object.assign(config_1.SYSTEM_INFO, wegame_2.SYSTEM_INFO, __assign(__assign({}, initParams), { index: 0 }));
        _this.isSupportGDTReport = (_a = config_1.SYSTEM_INFO === null || config_1.SYSTEM_INFO === void 0 ? void 0 : config_1.SYSTEM_INFO.isSupportGDTReport) !== null && _a !== void 0 ? _a : true;
        try {
            var accountInfo = wx.getAccountInfoSync();
            console.info(accountInfo === null || accountInfo === void 0 ? void 0 : accountInfo.miniProgram);
            if ((_b = accountInfo === null || accountInfo === void 0 ? void 0 : accountInfo.miniProgram) === null || _b === void 0 ? void 0 : _b.version) {
                config_1.SYSTEM_INFO.miniVersion = (_c = accountInfo === null || accountInfo === void 0 ? void 0 : accountInfo.miniProgram) === null || _c === void 0 ? void 0 : _c.version;
            }
        }
        catch (e) {
        }
        // 获取初始化配置
        _this.getInitConfig({ complete: initParams.complete });
        return _this;
    }
    SdkWegame.prototype.saveDeviceInfo = function () {
        try {
            // @ts-ignore
            this.deviceInfo = wx.getDeviceInfo();
        }
        catch (e) {
            return;
        }
    };
    SdkWegame.prototype.addFeedback = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var res, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, api_1.createFeedbackApi)(params)];
                    case 1:
                        res = _a.sent();
                        console.log(res);
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        callback && callback.complete(handleTrackError('', err_1));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SdkWegame.prototype.getPhoneNumber = function (params, callback) {
        // @ts-ignore
        wx.getPhoneNumber({
            isRealtime: params.isRealtime || false,
            phoneNumberNoQuotaToast: params.phoneNumberNoQuotaToast || true,
            complete: function (res) {
                if (res.code) {
                    (0, api_1.getPhoneNumberApi)(res.code).then(function (res) {
                        callback && callback.complete(res);
                    }).catch(function (err) {
                        callback && callback.complete(handleTrackError('', err));
                    });
                }
                else {
                    callback && callback.complete(handleTrackError('', res));
                }
            }
        });
    };
    SdkWegame.prototype.changePhoneNumber = function (params, callback) {
        // @ts-ignore
        wx.getPhoneNumber({
            isRealtime: params.isRealtime || false,
            phoneNumberNoQuotaToast: params.phoneNumberNoQuotaToast || true,
            complete: function (res) {
                if (res.code) {
                    (0, api_1.changePhoneNumberApi)(res.code).then(function (res) {
                        callback && callback.complete(res);
                    }).catch(function (err) {
                        callback && callback.complete(handleTrackError('', err));
                    });
                }
                else {
                    callback && callback.complete(handleTrackError('', res));
                }
            }
        });
    };
    SdkWegame.prototype.getFeedbackList = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var res, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, api_1.getFeedbackListApi)(params)];
                    case 1:
                        res = _a.sent();
                        callback && callback.complete(res);
                        return [3 /*break*/, 3];
                    case 2:
                        err_2 = _a.sent();
                        callback && callback.complete(handleTrackError('', err_2));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SdkWegame.prototype.getFeedbackDetail = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var res, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, api_1.getFeedbackDetailApi)(params)];
                    case 1:
                        res = _a.sent();
                        callback && callback.complete(res);
                        return [3 /*break*/, 3];
                    case 2:
                        err_3 = _a.sent();
                        callback && callback.complete(handleTrackError('', err_3));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SdkWegame.prototype.collectProps = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var res, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, api_1.collectPropsApi)(params)];
                    case 1:
                        res = _a.sent();
                        callback && callback.complete(res);
                        return [3 /*break*/, 3];
                    case 2:
                        err_4 = _a.sent();
                        callback && callback.complete(handleTrackError('', err_4));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SdkWegame.prototype.getAnnouncement = function (limit, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var productId, channelId, res, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(Number.isInteger(limit) && limit >= 1 && limit <= 100)) {
                            callback && callback.complete(handleTrackError('', {
                                code: 2000,
                                data: null,
                                message: 'limit 必须填1 - 100整数'
                            }));
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        productId = config_1.SYSTEM_INFO.productId, channelId = config_1.SYSTEM_INFO.channelId;
                        return [4 /*yield*/, (0, api_1.getNoticeApi)({
                                limit: limit,
                                product_id: productId,
                                channel_id: channelId
                            })];
                    case 2:
                        res = _a.sent();
                        callback && callback.complete(res);
                        return [3 /*break*/, 4];
                    case 3:
                        err_5 = _a.sent();
                        callback && callback.complete(handleTrackError('', err_5));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SdkWegame.prototype.clearPromoterTimer = function () {
        console.log('clearPromoterTimer');
        if (this.promoInfo.timer) {
            clearTimeout(this.promoInfo.timer);
            this.promoInfo.timer = null;
        }
    };
    // 启动定时器
    SdkWegame.prototype.startPromoterTimer = function (callback, autoRefresh) {
        var _this = this;
        if (autoRefresh === void 0) { autoRefresh = true; }
        var delay = this.promoInfo.refresh_period_exp < 1 ? (this.promoInfo.polling ? (this.promoInfo.polling * 1000) : 10000) : (this.promoInfo.refresh_period_exp * 1000);
        console.log('startPromoterTimer', delay);
        this.promoInfo.timer = setTimeout(function () {
            _this.getPromoDisplayKEY(callback, autoRefresh, false);
        }, delay);
    };
    SdkWegame.prototype.getPromoDisplayKEY = function (callback, autoRefresh, immediately) {
        var _this = this;
        if (autoRefresh === void 0) { autoRefresh = false; }
        if (immediately === void 0) { immediately = true; }
        this.clearPromoterTimer();
        var promo_code = this.promoInfo.promo_code;
        (0, api_1.getPromoterCodeApi)(this.game_id).then(function (res) {
            try {
                if (res.code == 0) {
                    _this.promoInfo.refresh_period_exp = res.data.refresh_period_exp || 0;
                    _this.promoInfo.polling = res.data.polling || 0;
                    promo_code = res.data.promo_code;
                }
            }
            catch (e) {
                _this.promoInfo.refresh_period_exp = 0;
                _this.promoInfo.polling = 0;
            }
            if (autoRefresh) {
                _this.startPromoterTimer(callback, autoRefresh);
            }
            if (!immediately && promo_code == _this.promoInfo.promo_code) {
                return;
            }
            else {
                _this.promoInfo.promo_code = promo_code;
            }
            callback && callback.complete(res);
        }).catch(function (err) {
            if (err.isServerError) {
                _this.clearPromoterTimer();
                callback && callback.complete(handleTrackError('', err));
            }
            else {
                if (autoRefresh) {
                    _this.startPromoterTimer(callback, autoRefresh);
                }
                else {
                    callback && callback.complete(handleTrackError('', err));
                }
            }
        });
    };
    SdkWegame.prototype.exchangePromoCDKEY = function (cdkey, callback) {
        (0, api_1.exchangePromoterCodeApi)(cdkey).then(function (res) {
            callback.complete(res);
        }).catch(function (err) {
            callback.complete(handleTrackError('', err));
        });
    };
    SdkWegame.prototype.checkIsPromoter = function () {
        return this.isPromoter;
    };
    SdkWegame.prototype.publicSubchannelCheck = function (res) {
        var _a, _b;
        try {
            var sub_channel = (_b = (_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.subcq) === null || _b === void 0 ? void 0 : _b.subc;
            var queryString = (0, utils_1.getSearchQueries)(true);
            var query = queryString ? queryString.split('&') : [];
            if ((sub_channel === null || sub_channel === void 0 ? void 0 : sub_channel.length) && (query === null || query === void 0 ? void 0 : query.length)) {
                for (var a = 0; a < sub_channel.length; a++) {
                    var item = sub_channel[a];
                    var reflectStringArr = item === null || item === void 0 ? void 0 : item.map;
                    if (reflectStringArr === null || reflectStringArr === void 0 ? void 0 : reflectStringArr.length) {
                        var arr = item === null || item === void 0 ? void 0 : item.map;
                        var sub_channel_id = item === null || item === void 0 ? void 0 : item.id;
                        for (var k in arr) {
                            var str = arr[k];
                            for (var c in query) {
                                if (str.includes(query[c])) {
                                    this.subChannelId = sub_channel_id;
                                    console.log(this.subChannelId);
                                    return;
                                }
                            }
                        }
                    }
                }
            }
        }
        catch (err) {
        }
    };
    SdkWegame.prototype.getDirectAdStatusSync = function () {
        var wxInstance = typeof wx !== 'undefined' ? wx : null;
        if (typeof (wxInstance === null || wxInstance === void 0 ? void 0 : wxInstance.getDirectAdStatusSync) !== 'function')
            return;
        return wxInstance.getDirectAdStatusSync();
    };
    SdkWegame.prototype.onDirectAdStatusChange = function (listener) {
        var wxInstance = typeof wx !== 'undefined' ? wx : null;
        if (typeof (wxInstance === null || wxInstance === void 0 ? void 0 : wxInstance.onDirectAdStatusChange) !== 'function')
            return;
        wxInstance.onDirectAdStatusChange(listener);
    };
    SdkWegame.prototype.normalizeDirectAdStatus = function (statusInfo) {
        var status = {};
        var keys = ['isInMask', 'isInDirectGameAd', 'isEndByAbnormal'];
        keys.forEach(function (key) {
            if (typeof (statusInfo === null || statusInfo === void 0 ? void 0 : statusInfo[key]) === 'boolean') {
                status[key] = statusInfo[key];
            }
        });
        return status;
    };
    SdkWegame.prototype.getDirectAdStatusParams = function (statusInfo) {
        if (statusInfo === void 0) { statusInfo = this.directAdStatus; }
        var status = this.normalizeDirectAdStatus(statusInfo);
        var params = {};
        var keyMap = {
            isInMask: 'is_in_mask',
            isInDirectGameAd: 'is_in_direct_game_ad',
            isEndByAbnormal: 'is_end_by_abnormal',
        };
        Object.keys(status).forEach(function (key) {
            params[keyMap[key]] = status[key] ? '1' : '0';
        });
        return params;
    };
    SdkWegame.prototype.withDirectAdStatus = function (params) {
        var _a, _b, _c;
        var directAdStatus = this.getDirectAdStatusParams();
        if (Object.keys(directAdStatus).length === 0)
            return params;
        return __assign(__assign({}, params), { ext: __assign(__assign({}, ((params === null || params === void 0 ? void 0 : params.ext) || {})), { custom_ext: __assign(__assign({}, (((_a = params === null || params === void 0 ? void 0 : params.ext) === null || _a === void 0 ? void 0 : _a.custom_ext) || {})), { bigdata_ext: __assign(__assign({}, (((_c = (_b = params === null || params === void 0 ? void 0 : params.ext) === null || _b === void 0 ? void 0 : _b.custom_ext) === null || _c === void 0 ? void 0 : _c.bigdata_ext) || {})), directAdStatus) }) }) });
    };
    SdkWegame.prototype.withDirectAdBigdataExt = function (params) {
        var _a;
        var directAdStatus = this.getDirectAdStatusParams();
        if (Object.keys(directAdStatus).length === 0)
            return params;
        return __assign(__assign({}, params), { custom_ext: __assign(__assign({}, ((params === null || params === void 0 ? void 0 : params.custom_ext) || {})), { bigdata_ext: __assign(__assign({}, (((_a = params === null || params === void 0 ? void 0 : params.custom_ext) === null || _a === void 0 ? void 0 : _a.bigdata_ext) || {})), directAdStatus) }) });
    };
    SdkWegame.prototype.trackDirectAdStatus = function (statusInfo) {
        if (!statusInfo || typeof statusInfo !== 'object')
            return;
        this.track({
            complete: function () { },
        }, {
            event: '#direct_ad',
            properties: this.getDirectAdStatusParams(statusInfo),
        });
    };
    SdkWegame.prototype.reportOrQueueDirectAdGdtEvent = function (report) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.directAdStatus.isInMask && this.directAdStatus.isInDirectGameAd) {
                            this.directAdGdtReportQueue.push(report);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, report()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SdkWegame.prototype.flushDirectAdGdtReportQueue = function () {
        return __awaiter(this, void 0, void 0, function () {
            var reports, _i, reports_1, report, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        reports = this.directAdGdtReportQueue.splice(0);
                        _i = 0, reports_1 = reports;
                        _a.label = 1;
                    case 1:
                        if (!(_i < reports_1.length)) return [3 /*break*/, 6];
                        report = reports_1[_i];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, report()];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        console.error('direct ad gdt report error:', e_1);
                        return [3 /*break*/, 5];
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    SdkWegame.prototype.handleDirectAdStatus = function (statusInfo, isStatusChange) {
        if (isStatusChange === void 0) { isStatusChange = false; }
        if (!statusInfo || typeof statusInfo !== 'object')
            return;
        this.directAdStatus = this.normalizeDirectAdStatus(statusInfo);
        this.trackDirectAdStatus(statusInfo);
        var isMaskBroken = !this.directAdStatus.isInMask && this.directAdStatus.isInDirectGameAd;
        var isContinuePlaying = isStatusChange
            && statusInfo.isInMask === false
            && statusInfo.isInDirectGameAd === false
            && statusInfo.isEndByAbnormal === false;
        if (isMaskBroken || isContinuePlaying) {
            this.flushDirectAdGdtReportQueue();
        }
    };
    SdkWegame.prototype.setupDirectAdStatus = function () {
        var _this = this;
        try {
            var statusInfo = this.getDirectAdStatusSync();
            if (statusInfo) {
                console.log('getDirectAdStatusSync:', statusInfo);
                this.handleDirectAdStatus(statusInfo);
            }
        }
        catch (e) {
            console.error('getDirectAdStatusSync error:', e);
        }
        try {
            this.onDirectAdStatusChange(function (res) {
                console.log('onDirectAdStatusChange:', res);
                _this.handleDirectAdStatus(res, true);
            });
        }
        catch (e) {
            console.error('onDirectAdStatusChange error:', e);
        }
    };
    SdkWegame.prototype.getInitConfig = function (callback) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        return __awaiter(this, void 0, void 0, function () {
            var initParams, res, config, version, _i, _q, key, prop_version, _serverTime, e_2, err_6, error;
            return __generator(this, function (_r) {
                switch (_r.label) {
                    case 0:
                        initParams = (0, utils_2.customGetStorageSync)('rx-init-params') || {};
                        _r.label = 1;
                    case 1:
                        _r.trys.push([1, 8, , 9]);
                        return [4 /*yield*/, (0, api_1.getInitConf)({ version: (_a = initParams === null || initParams === void 0 ? void 0 : initParams.version) !== null && _a !== void 0 ? _a : {} })];
                    case 2:
                        res = _r.sent();
                        config = res.data || {};
                        version = {};
                        for (_i = 0, _q = Object.keys(config); _i < _q.length; _i++) {
                            key = _q[_i];
                            prop_version = (_c = (_b = config[key]) === null || _b === void 0 ? void 0 : _b.version) !== null && _c !== void 0 ? _c : '';
                            if (prop_version) {
                                version[key] = prop_version;
                                this.initConfig[key] = { timerId: 0 };
                            }
                            this.initConfig[key] = config[key];
                        }
                        // console.info('SDK initConfig: ', this.initConfig)
                        //检查是否需要传递subchannleid
                        this.publicSubchannelCheck(res);
                        (0, utils_2.customSetStorageSync)('rx-init-params', { version: version });
                        config_1.SYSTEM_INFO.SDK_INIT_FINISHED = true;
                        config_1.SYSTEM_INFO.CP_OF = ((_e = (_d = res === null || res === void 0 ? void 0 : res.data) === null || _d === void 0 ? void 0 : _d.cp) === null || _e === void 0 ? void 0 : _e.of) || false;
                        _serverTime = (_g = (_f = res === null || res === void 0 ? void 0 : res.data) === null || _f === void 0 ? void 0 : _f.server) === null || _g === void 0 ? void 0 : _g.time;
                        if (_serverTime) {
                            config_1.SYSTEM_INFO.st_offset = String(Number(_serverTime) - Date.now());
                        }
                        // 初始化成功后监听应用进入前台，刷新 st_offset
                        (0, stOffset_1.setupStOffsetRefreshForMiniGame)(typeof wx !== 'undefined' ? wx : null, api_1.getServerTime);
                        this.setupDirectAdStatus();
                        this.saveDeviceInfo();
                        if (!config_1.SYSTEM_INFO.isWxAvailable) {
                            this.track({
                                complete: function (data) {
                                    console.log(data);
                                },
                            }, {
                                event: "#storage_error",
                                properties: {},
                            });
                        }
                        // 检查是否需要激活
                        this.checkNeedActivate();
                        if (!(((_k = (_j = (_h = this.initConfig) === null || _h === void 0 ? void 0 : _h.advertise_channel) === null || _j === void 0 ? void 0 : _j.gdt) === null || _k === void 0 ? void 0 : _k.tm) == const_1.TM_TYPE.CLIENT)) return [3 /*break*/, 7];
                        _r.label = 3;
                    case 3:
                        _r.trys.push([3, 6, , 7]);
                        if (((_m = (_l = this.initConfig) === null || _l === void 0 ? void 0 : _l.advertise_switch) === null || _m === void 0 ? void 0 : _m.switch) == 1) {
                            this.back_flow_day = ((_p = (_o = this.initConfig) === null || _o === void 0 ? void 0 : _o.advertise_switch) === null || _p === void 0 ? void 0 : _p.window_days) || 0;
                        }
                        return [4 /*yield*/, this.initTencentSdk()];
                    case 4:
                        _r.sent();
                        return [4 /*yield*/, this.reportOrQueueDirectAdGdtEvent(function () {
                                handleGdtTrackResult(tencent_sdk === null || tencent_sdk === void 0 ? void 0 : tencent_sdk.onAppStart());
                            })];
                    case 5:
                        _r.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        e_2 = _r.sent();
                        console.log(e_2);
                        return [3 /*break*/, 7];
                    case 7:
                        // 启动定时上报定时器，默认每隔1分钟上报一次收集的数据（使用压缩）
                        (0, utils_2.startTrackReportTimer)(api_1.trackCompressedApi);
                        // 小程序隐藏时触发一次上报（切后台、退出等场景）
                        try {
                            wx.onHide(function () {
                                (0, utils_2.triggerImmediateReport)();
                            });
                        }
                        catch (e) {
                            console.error('注册 onHide 上报失败:', e);
                        }
                        callback.complete({ code: 0 });
                        return [3 /*break*/, 9];
                    case 8:
                        err_6 = _r.sent();
                        error = __assign(__assign({}, (err_6 || {})), { msg: '初始化错误，或未初始化', code: const_1.COMMON_ERROR_CODE.INIT_PARAMS_ERROR, thirdcode: err_6.code || err_6.errCode, message: err_6.message || err_6.msg || err_6.errMsg, thirdmsg: err_6.message || err_6.msg || err_6.errMsg });
                        // data: 保留原始错误
                        error.data = {
                            data: err_6
                        };
                        callback.complete(handleTrackError('rxlog_error_init', error));
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    SdkWegame.prototype.setCpOf = function (bool) {
        config_1.SYSTEM_INFO.CP_OF = bool;
    };
    SdkWegame.prototype.getCpOf = function () {
        return config_1.SYSTEM_INFO.CP_OF || false;
    };
    // 获取归因数据
    SdkWegame.prototype.getAttributionData = function () {
        var universal = (0, utils_1.getSearchQueries)();
        var source_ad = {};
        var deviceInfo = {};
        try {
            // @ts-ignore
            deviceInfo = wx.getDeviceInfo();
            source_ad.device_info = deviceInfo;
        }
        catch (e) {
        }
        if (universal === null || universal === void 0 ? void 0 : universal.ad_platform) {
            switch (universal === null || universal === void 0 ? void 0 : universal.ad_platform) {
                case 'tencent':
                    source_ad.click_id = universal.gdt_vid;
                    source_ad.ad_rawargs = (0, is_1.omit)(universal, ['ad_platform', 'gdt_vid']);
                    break;
                case 'oceanengine':
                    source_ad.click_id = universal.req_id;
                    source_ad.ad_rawargs = (0, is_1.omit)(universal, ['ad_platform', 'req_id']);
                    break;
                case 'kuaishou':
                    source_ad.ad_rawargs = (0, is_1.omit)(universal, ['ad_platform']);
                    break;
                case 'baidu':
                    source_ad.click_id = universal.bd_vid;
                    source_ad.ad_rawargs = (0, is_1.omit)(universal, ['ad_platform', 'bd_vid']);
                    break;
                case 'bili':
                    source_ad.click_id = universal.trackid;
                    break;
                case 'xiaohongshu':
                    source_ad.click_id = universal.click_id;
                    break;
                default:
                    source_ad.ad_rawargs = (0, is_1.omit)(universal, ['ad_platform']);
                    source_ad.ad_platform = universal.ad_platform;
            }
            source_ad.ad_platform = universal.ad_platform;
        }
        else {
            return {
                device_info: deviceInfo,
                ad_rawargs: universal
            };
        }
        return source_ad;
    };
    SdkWegame.prototype.checkNeedActivate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var activeResult, source_ad, user_source, distinct_id, req, result, err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        activeResult = (0, utils_2.customGetStorageSync)('rx-active-result');
                        if (!!activeResult) return [3 /*break*/, 4];
                        source_ad = this.getAttributionData();
                        user_source = this.getAttributionData();
                        distinct_id = (0, v4_1.default)();
                        (0, utils_2.customSetStorageSync)('rx_distinct_id', distinct_id);
                        req = {
                            stage: 'init',
                            distinct_id: distinct_id,
                            source_ad: source_ad,
                            user_source: user_source,
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, (0, api_1.activated)(req)];
                    case 2:
                        result = _a.sent();
                        (0, utils_2.customSetStorageSync)('rx-active-result', { isSuccess: true, activeResult: result.data });
                        return [3 /*break*/, 4];
                    case 3:
                        err_7 = _a.sent();
                        (0, utils_2.customSetStorageSync)('rx-active-result', { isSuccess: false, activeResult: req });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //格式化queryString
    SdkWegame.prototype.getLoginQsAndGenerateStruct = function (query) {
        var _a;
        if (query === void 0) { query = ''; }
        var universal = query || (0, utils_1.getSearchQueries)();
        console.info('===============queryString', universal);
        var user_source = {};
        if (universal.hasOwnProperty('user_source')) {
            var omitKeys = (universal === null || universal === void 0 ? void 0 : universal.user_source) === 'transmits' ? ['user_source'] : ['user_source', 'type', 'transmits'];
            var leftProps = __assign({}, (0, is_1.omit)(universal, omitKeys));
            /**
             * url 上有user_source字段并且除了'user_source', 'type', 'transmits'等字段外还有属性，则将剩余属性全部放到universal['user_source']属性下
             * 多包了一层'user_source',使用的地方直接 ...
             */
            if (!(0, is_1.isEmpty)(leftProps)) {
                // 用户透传参数
                if ((universal === null || universal === void 0 ? void 0 : universal.user_source) == 'transmits') {
                    user_source = {
                        user_transmits: Object.assign(leftProps, { transmits: decodeURIComponent(leftProps.transmits || '') })
                    };
                }
                else if ((universal === null || universal === void 0 ? void 0 : universal.user_source) == 'attr') {
                    user_source = {
                        user_attrs: leftProps
                    };
                }
                else {
                    user_source = {
                        user_source: (_a = {},
                            _a[universal['user_source']] = leftProps,
                            _a),
                    };
                }
                return user_source;
            }
        }
        var subPackageInfo = (0, utils_2.customGetStorageSync)('rx_sub_package_info');
        if (!(0, is_1.isEmpty)(subPackageInfo)) {
            user_source = {
                user_source: {
                    sub_package: subPackageInfo,
                }
            };
            return user_source;
        }
        return null;
    };
    SdkWegame.prototype.ActivePrefix = function (reqParams) {
        var loginState = (0, utils_2.customGetStorageSync)('rx-loginState');
        var activeSave = (0, utils_2.customGetStorageSync)('rx-active-result');
        if (loginState || !activeSave) {
            return reqParams;
        }
        else {
            if (activeSave === null || activeSave === void 0 ? void 0 : activeSave.isSuccess) {
                return __assign(__assign({}, reqParams), { activate: { result: activeSave === null || activeSave === void 0 ? void 0 : activeSave.activeResult } });
            }
            else {
                return __assign(__assign({}, reqParams), { activate: { args: activeSave === null || activeSave === void 0 ? void 0 : activeSave.activeResult } });
            }
        }
    };
    /**
     * 用于设置子渠道，通行证记录来源（分包）、子渠道参数
     */
    SdkWegame.prototype.setSubChannelId = function (subChannelId) {
        try {
            // 登录后不允许设置子渠道id
            if (this.isLogin) {
                return { code: -1, msg: '登录后不允许设置子渠道id' };
            }
            (0, utils_2.customSetStorageSync)('rx_sub_package_info', { sub_channel_id: subChannelId });
            return { code: 0 };
        }
        catch (error) {
            return handleTrackError('', error);
        }
    };
    /**
     * 用于设置自定义返回错误 Msg
     */
    SdkWegame.prototype.setErrorMsg = function (errMsg) {
        config_1.SYSTEM_INFO.errMsg = errMsg;
    };
    /**
     * 清空返回错误 Msg
     */
    SdkWegame.prototype.clearErrorMsg = function () {
        config_1.SYSTEM_INFO.errMsg = {
            default: ''
        };
    };
    SdkWegame.prototype.login = function (params, callback) {
        return this.authorize(params, callback);
    };
    //授权接口
    SdkWegame.prototype.authorize = function (params, callback) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        return __awaiter(this, void 0, void 0, function () {
            var user_source, source_ad, messageToFriendQuery, queryResult, e_3, version, desc, sign_fields, now, distinct_idLocal, distinct_id, _q, custom_ext, rest_ext, reqLoginData, queryJson, code, data, userInfo, getLaunchParams, query, scene, sceneParams, rxValue, _r, error_1, err_8, query, reflowEnabled, reqLogin, e_4, e_5, e_6, err_9;
            return __generator(this, function (_s) {
                switch (_s.label) {
                    case 0:
                        user_source = this.getLoginQsAndGenerateStruct();
                        source_ad = this.getAttributionData();
                        _s.label = 1;
                    case 1:
                        _s.trys.push([1, 4, , 5]);
                        messageToFriendQuery = this.getMessageToFriendQuery().query;
                        if (!messageToFriendQuery) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, api_1.getShortTextApi)(messageToFriendQuery)];
                    case 2:
                        queryResult = _s.sent();
                        if (queryResult.code === 0 && queryResult.data.text) {
                            // @ts-ignore
                            user_source = this.getLoginQsAndGenerateStruct(utils_2.qs.parse(queryResult.data.text));
                        }
                        _s.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        e_3 = _s.sent();
                        console.log(e_3);
                        return [3 /*break*/, 5];
                    case 5:
                        _s.trys.push([5, 33, 34, 35]);
                        // await pubCheck(wegameLoginParamsCheck, callback, params)
                        params.version = params.version || 'normal';
                        version = params.version, desc = params.desc, sign_fields = params.sign_fields;
                        now = new Date().getTime();
                        distinct_idLocal = (0, utils_2.customGetStorageSync)('rx_distinct_id');
                        distinct_id = distinct_idLocal || (0, v4_1.default)();
                        if (!distinct_idLocal) {
                            (0, utils_2.customSetStorageSync)('rx_distinct_id', distinct_id);
                        }
                        _q = params.ext || {}, custom_ext = _q.custom_ext, rest_ext = __rest(_q, ["custom_ext"]);
                        reqLoginData = __assign(__assign({ ts: now, method: 'minigame', distinct_id: distinct_id }, user_source), { sign_fields: sign_fields, migrate_args: params === null || params === void 0 ? void 0 : params.migrate_args, custom_ext: custom_ext || {}, ext: __assign(__assign({}, (rest_ext || {})), { version: version }) });
                        try {
                            if (this.subChannelId !== null) {
                                queryJson = (0, utils_1.getSearchQueries)();
                                if ((user_source === null || user_source === void 0 ? void 0 : user_source.user_source) === 'guide' || !(user_source === null || user_source === void 0 ? void 0 : user_source.user_source)) {
                                    reqLoginData.user_source = {
                                        guide: __assign(__assign({}, user_source), { subchannelid: this.subChannelId })
                                    };
                                    if (queryJson) {
                                        reqLoginData.user_source.guide = __assign(__assign({}, reqLoginData.user_source.guide), queryJson);
                                    }
                                }
                            }
                        }
                        catch (err) {
                        }
                        if (!!params.login_openid) return [3 /*break*/, 7];
                        return [4 /*yield*/, (0, utils_2.asyncFunc)(wx.login)];
                    case 6:
                        code = (_s.sent()).code;
                        reqLoginData.ext.code = code;
                        _s.label = 7;
                    case 7:
                        if (!(version == 'normal')) return [3 /*break*/, 9];
                        return [4 /*yield*/, (0, utils_2.asyncFunc)(wx.getUserProfile, {
                                lang: 'zh_CN',
                                desc: desc || '用于获取昵称和头像',
                            })];
                    case 8:
                        data = _s.sent();
                        reqLoginData.ext.encryptedData = data.encryptedData;
                        reqLoginData.ext.iv = data.iv;
                        _s.label = 9;
                    case 9:
                        userInfo = null;
                        try {
                            getLaunchParams = wx.getLaunchOptionsSync();
                            reqLoginData.open_source = (getLaunchParams === null || getLaunchParams === void 0 ? void 0 : getLaunchParams.scene) ? (getLaunchParams === null || getLaunchParams === void 0 ? void 0 : getLaunchParams.scene) + '' : undefined;
                        }
                        catch (err) { }
                        _s.label = 10;
                    case 10:
                        _s.trys.push([10, 15, , 16]);
                        query = wx.getLaunchOptionsSync().query;
                        scene = decodeURIComponent((query === null || query === void 0 ? void 0 : query.scene) || '');
                        sceneParams = scene ? utils_2.qs === null || utils_2.qs === void 0 ? void 0 : utils_2.qs.parse(scene) : {};
                        if (!('rx' in sceneParams)) return [3 /*break*/, 14];
                        rxValue = sceneParams === null || sceneParams === void 0 ? void 0 : sceneParams.rx;
                        _s.label = 11;
                    case 11:
                        _s.trys.push([11, 13, , 14]);
                        _r = this;
                        return [4 /*yield*/, (0, api_1.getUrlParseApi)({ identity: rxValue })];
                    case 12:
                        _r.queryPoster = _s.sent();
                        reqLoginData.user_source = __assign(__assign({}, reqLoginData === null || reqLoginData === void 0 ? void 0 : reqLoginData.user_source), (_a = this.queryPoster) === null || _a === void 0 ? void 0 : _a.data);
                        return [3 /*break*/, 14];
                    case 13:
                        error_1 = _s.sent();
                        return [3 /*break*/, 14];
                    case 14: return [3 /*break*/, 16];
                    case 15:
                        err_8 = _s.sent();
                        return [3 /*break*/, 16];
                    case 16:
                        try {
                            query = (0, utils_1.getSearchQueries)();
                            if (query.subscribetaskid) {
                                reqLoginData.async_msg = {
                                    minigame_subscribe: {
                                        subscribe_task_id: query.subscribetaskid
                                    }
                                };
                            }
                        }
                        catch (err) {
                        }
                        reqLoginData = this.withDirectAdBigdataExt(reqLoginData);
                        if (!params.login_openid) return [3 /*break*/, 18];
                        //二次登录
                        reqLoginData.login_openid = params.login_openid;
                        console.info('double login req: ', reqLoginData);
                        return [4 /*yield*/, (0, api_1.loginByTokenApi)(this.ActivePrefix(reqLoginData))];
                    case 17:
                        userInfo = _s.sent();
                        (0, utils_2.customSetStorageSync)('rx-loginState', 1);
                        return [3 /*break*/, 20];
                    case 18:
                        reflowEnabled = ((_c = (_b = this.initConfig) === null || _b === void 0 ? void 0 : _b.advertise_switch) === null || _c === void 0 ? void 0 : _c.switch) === 1;
                        reqLogin = reflowEnabled ? __assign(__assign({}, reqLoginData), { device: source_ad }) : __assign({}, reqLoginData);
                        return [4 /*yield*/, (0, api_1.loginByCredentialApi)(this.ActivePrefix(reqLogin))];
                    case 19:
                        // console.info('normal login req: ', reqLogin)
                        userInfo = _s.sent();
                        (0, utils_2.customSetStorageSync)('rx-loginState', 1);
                        _s.label = 20;
                    case 20:
                        Object.assign(config_1.USER_INFO, userInfo.data);
                        (0, utils_2.customSetStorageSync)('rxToken', userInfo.data.token);
                        //测试逻辑开始
                        // customSetStorageSync('userinfotest',userInfo.data.login_openid)
                        //测试逻辑结束
                        // console.log('我是一个rxToken',customGetStorageSync('rxToken'))
                        handleDynamicSupplementOrder();
                        try {
                            if ((((_d = userInfo === null || userInfo === void 0 ? void 0 : userInfo.data) === null || _d === void 0 ? void 0 : _d.user_flag) & 1) == 1) {
                                this.isPromoter = true;
                                this.game_id = (_e = userInfo === null || userInfo === void 0 ? void 0 : userInfo.data) === null || _e === void 0 ? void 0 : _e.cp_user_id;
                            }
                        }
                        catch (e) { }
                        if (!(((_h = (_g = (_f = this.initConfig) === null || _f === void 0 ? void 0 : _f.advertise_channel) === null || _g === void 0 ? void 0 : _g.gdt) === null || _h === void 0 ? void 0 : _h.tm) == const_1.TM_TYPE.CLIENT)) return [3 /*break*/, 32];
                        _s.label = 21;
                    case 21:
                        _s.trys.push([21, 23, , 24]);
                        return [4 /*yield*/, this.reportGdtLogin((_j = userInfo.data) === null || _j === void 0 ? void 0 : _j.tid)];
                    case 22:
                        _s.sent();
                        return [3 /*break*/, 24];
                    case 23:
                        e_4 = _s.sent();
                        console.log(e_4);
                        return [3 /*break*/, 24];
                    case 24:
                        _s.trys.push([24, 27, , 28]);
                        if (!((((_k = userInfo.data) === null || _k === void 0 ? void 0 : _k.flag) & (1 << 0)) == 1)) return [3 /*break*/, 26];
                        return [4 /*yield*/, this.reportRegister()];
                    case 25:
                        _s.sent();
                        _s.label = 26;
                    case 26: return [3 /*break*/, 28];
                    case 27:
                        e_5 = _s.sent();
                        console.log(e_5);
                        return [3 /*break*/, 28];
                    case 28:
                        _s.trys.push([28, 31, , 32]);
                        console.log('距离上次登录相差：', formatTime(Math.floor((Date.now() - (((_l = userInfo.data) === null || _l === void 0 ? void 0 : _l.last_login_time) || 0) * 1000))));
                        if (!(((_m = userInfo.data) === null || _m === void 0 ? void 0 : _m.last_login_time) && this.back_flow_day && (Date.now() - (((_o = userInfo.data) === null || _o === void 0 ? void 0 : _o.last_login_time) || 0) * 1000) >= (this.back_flow_day * 3600 * 24 * 1000))) return [3 /*break*/, 30];
                        return [4 /*yield*/, this.reportReActive(this.back_flow_day)];
                    case 29:
                        _s.sent();
                        _s.label = 30;
                    case 30: return [3 /*break*/, 32];
                    case 31:
                        e_6 = _s.sent();
                        console.log(e_6);
                        return [3 /*break*/, 32];
                    case 32:
                        callback.complete(userInfo);
                        try {
                            this.reportPurchaseByCache();
                        }
                        catch (e) {
                        }
                        try {
                            // 更改登录状态为已登录
                            this.isLogin = true;
                        }
                        catch (error) {
                        }
                        return [2 /*return*/, userInfo];
                    case 33:
                        err_9 = _s.sent();
                        callback.complete(handleTrackError('rxlog_error_login', err_9, ((_p = err_9.errMsg) === null || _p === void 0 ? void 0 : _p.includes('fail auth deny')) ? const_1.COMMON_ERROR_CODE.LOGIN_DENY : const_1.COMMON_ERROR_CODE.LOGIN_FAIL));
                        this.track({
                            complete: function (data) {
                                console.info('authorize error add complete func when tracked:', data);
                            },
                        }, (0, utils_2.formatTrackParams)({
                            eventName: 'track_err',
                            apiName: 'authorize',
                            reqParams: params,
                            errorInfo: err_9,
                            loginInfo: config_1.USER_INFO,
                        }));
                        return [3 /*break*/, 35];
                    case 34:
                        // 清理上报支付订单接口所有队列和缓存
                        (0, request_1.clearAllQueuesAndCache)();
                        // 清空rx_sub_package_info
                        (0, utils_2.customRemoveStorageSync)('rx_sub_package_info');
                        return [7 /*endfinally*/];
                    case 35: return [2 /*return*/];
                }
            });
        });
    };
    SdkWegame.prototype.setScheuleReportProps = function (data) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        this.scheuleReportProps = {
            trigger_tag: ((_a = data === null || data === void 0 ? void 0 : data.trigger) === null || _a === void 0 ? void 0 : _a.tag) || '',
            trigger_id: ((_b = data === null || data === void 0 ? void 0 : data.trigger) === null || _b === void 0 ? void 0 : _b.id) || 0,
            trigger_type: ((_c = data === null || data === void 0 ? void 0 : data.trigger) === null || _c === void 0 ? void 0 : _c.type) || 0,
            material_type: ((_d = data === null || data === void 0 ? void 0 : data.content) === null || _d === void 0 ? void 0 : _d.material_type) || '',
            material_id: ((_e = data === null || data === void 0 ? void 0 : data.content) === null || _e === void 0 ? void 0 : _e.material_id) || 0,
            landing_id: ((_f = data === null || data === void 0 ? void 0 : data.content) === null || _f === void 0 ? void 0 : _f.landing_id) || 0,
            strategy_id: ((_g = data === null || data === void 0 ? void 0 : data.strategy) === null || _g === void 0 ? void 0 : _g.id) || 0,
            strategy_type: ((_h = data === null || data === void 0 ? void 0 : data.strategy) === null || _h === void 0 ? void 0 : _h.type) || 0,
            platform: (data === null || data === void 0 ? void 0 : data.platform) || enum_1.PLATFORM.WECHAT,
        };
    };
    // 获得海报分享参数
    SdkWegame.prototype.getQueryPoster = function (callback) {
        try {
            callback.complete(this.queryPoster);
        }
        catch (error) {
            callback.complete(error);
        }
    };
    //获得分享内容
    SdkWegame.prototype.getShareData = function (params, callback, stopCallback) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var region, cacheShareData, _c, readCache, cShareData, productId, channelId, platform, transmits, func, type, sub_channel_id, open_id, shareData_1, remaining_share_count, err_10;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 5, , 9]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(wegame_1.wegameShareCheckParams, callback, params)];
                    case 1:
                        _d.sent();
                        region = (params === null || params === void 0 ? void 0 : params.region) || config_1.USER_INFO.region || '';
                        cacheShareData = (0, utils_2.customGetStorageSync)("rx_schedule_".concat(config_1.USER_INFO.tid, "_").concat(params.func, "_").concat(region));
                        _c = params.readCache, readCache = _c === void 0 ? false : _c;
                        if (readCache && cacheShareData) {
                            cShareData = JSON.parse(cacheShareData);
                            console.info('sdk 缓存分享数据：', cShareData);
                            this.setScheuleReportProps(cShareData === null || cShareData === void 0 ? void 0 : cShareData.data);
                            !stopCallback && callback.complete(cShareData);
                            return [2 /*return*/, cShareData];
                        }
                        productId = config_1.SYSTEM_INFO.productId, channelId = config_1.SYSTEM_INFO.channelId;
                        platform = enum_1.PLATFORM.WECHAT;
                        transmits = encodeURI(params.transmits || '');
                        func = params.func;
                        type = 'mini';
                        sub_channel_id = this.subChannelId || '';
                        open_id = config_1.USER_INFO.openid;
                        return [4 /*yield*/, (0, api_1.getShareDataApi)(this.withDirectAdStatus({
                                func: func,
                                transmits: transmits,
                                product_id: productId,
                                channel_id: channelId,
                                platform: platform,
                                type: type,
                                region: region,
                                sub_channel_id: sub_channel_id,
                                open_id: open_id,
                                custom_ext: params.custom_ext || {}
                            }))];
                    case 2:
                        shareData_1 = _d.sent();
                        remaining_share_count = ((_b = (_a = shareData_1 === null || shareData_1 === void 0 ? void 0 : shareData_1.data) === null || _a === void 0 ? void 0 : _a.scheduling) === null || _b === void 0 ? void 0 : _b.remaining_share_count) || 0;
                        console.log('getShareData剩余次数为' + remaining_share_count);
                        if (!(remaining_share_count <= 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.shareSchedulingInit({}, {
                                complete: function () {
                                    if (!stopCallback) {
                                        callback.complete(shareData_1);
                                    }
                                    _this.setScheuleReportProps(shareData_1 === null || shareData_1 === void 0 ? void 0 : shareData_1.data);
                                    console.log('shareSchedulingInit');
                                }
                            })];
                    case 3:
                        _d.sent();
                        return [2 /*return*/, shareData_1];
                    case 4:
                        if (!stopCallback) {
                            callback.complete(shareData_1);
                        }
                        this.setScheuleReportProps(shareData_1 === null || shareData_1 === void 0 ? void 0 : shareData_1.data);
                        return [2 /*return*/, shareData_1];
                    case 5:
                        err_10 = _d.sent();
                        if (!(err_10.code == 305407)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.shareSchedulingInit({}, {
                                complete: function () {
                                    if (!stopCallback) {
                                        callback.complete(handleTrackError('rxlog_error_share', err_10));
                                    }
                                }
                            })];
                    case 6:
                        _d.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        if (!stopCallback) {
                            callback.complete(handleTrackError('rxlog_error_share', err_10));
                        }
                        _d.label = 8;
                    case 8:
                        this.track({
                            complete: function (data) {
                                console.info('getShareData error add complete func when tracked:', data);
                            },
                        }, (0, utils_2.formatTrackParams)({
                            eventName: 'track_err',
                            apiName: 'getShareData',
                            reqParams: params,
                            errorInfo: err_10,
                            loginInfo: config_1.USER_INFO,
                        }));
                        return [2 /*return*/, handleTrackError('rxlog_error_share', err_10)];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    SdkWegame.prototype.isImageUrl = function (url) {
        // 定义常见图片文件扩展名的正则表达式
        var imageExtensions = /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i;
        // 定义 URL 协议的正则表达式，通常为 http 或 https
        var urlProtocol = /^(http|https):\/\//i;
        // 先检查是否有有效的协议
        if (!urlProtocol.test(url)) {
            return false;
        }
        // 再检查是否包含图片扩展名
        return imageExtensions.test(url);
    };
    SdkWegame.prototype.downloadImage = function (imageUrl) {
        return new Promise(function (resolve, reject) {
            wx.downloadFile({
                // @ts-ignore
                url: imageUrl,
                success: function (res) {
                    console.log('tempFilePath', res.tempFilePath);
                    resolve(res.tempFilePath);
                },
                fail: function (err) {
                    reject(err);
                }
            });
        });
    };
    SdkWegame.prototype.getMessageToFriendQuery = function () {
        var query = (0, utils_1.getSearchQueries)();
        return {
            query: query.query,
            shareMessageToFriendScene: query.shareMessageToFriendScene
        };
    };
    SdkWegame.prototype.fetchMessageToFriendQuery = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            var messageToFriendQuery, shareMessageToFriendScene, queryResult, err_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        messageToFriendQuery = this.getMessageToFriendQuery().query;
                        shareMessageToFriendScene = this.getMessageToFriendQuery().shareMessageToFriendScene;
                        if (!messageToFriendQuery) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, api_1.getShortTextApi)(messageToFriendQuery)];
                    case 1:
                        queryResult = _a.sent();
                        if (queryResult.code === 0 && queryResult.data.text) {
                            callback.complete({
                                code: 0,
                                data: {
                                    query: utils_2.qs.parse(queryResult.data.text),
                                    shareMessageToFriendScene: shareMessageToFriendScene
                                }
                            });
                            return [2 /*return*/];
                        }
                        _a.label = 2;
                    case 2:
                        callback.complete({
                            code: 0,
                            data: {
                                query: {},
                                shareMessageToFriendScene: ''
                            }
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        err_11 = _a.sent();
                        callback.complete(handleTrackError('', err_11));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SdkWegame.prototype.shareMessageToFriend = function (params, callback) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2;
        return __awaiter(this, void 0, void 0, function () {
            var shareCheckParams, shareData_2, imageUrl, image, _3, query, queryResult, e_7, ctx, onShareMessageToFriend_1, err_12;
            var _this = this;
            return __generator(this, function (_4) {
                switch (_4.label) {
                    case 0:
                        _4.trys.push([0, 10, , 11]);
                        shareCheckParams = {
                            func: {
                                type: 'string',
                                required: true,
                            },
                            shareMessageToFriendScene: {
                                type: 'number',
                                required: true,
                            }
                        };
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(shareCheckParams, callback, params)];
                    case 1:
                        _4.sent();
                        return [4 /*yield*/, this.getShareData(params, callback, true)];
                    case 2:
                        shareData_2 = _4.sent();
                        console.log('sdk getShareData:', shareData_2);
                        imageUrl = params.imageUrl || ((_b = (_a = shareData_2 === null || shareData_2 === void 0 ? void 0 : shareData_2.data) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.image);
                        if (!this.isImageUrl(imageUrl)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.downloadImage(imageUrl)];
                    case 3:
                        _3 = _4.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        _3 = imageUrl;
                        _4.label = 5;
                    case 5:
                        image = _3;
                        wx.updateShareMenu({
                            isUpdatableMessage: false
                        });
                        query = utils_2.qs.stringify({
                            type: 'rx',
                            user_source: 'share',
                            platform: ((_c = shareData_2 === null || shareData_2 === void 0 ? void 0 : shareData_2.data) === null || _c === void 0 ? void 0 : _c.platform) || '',
                            transmits: encodeURIComponent((params === null || params === void 0 ? void 0 : params.transmits) || ''),
                            landing_id: ((_e = (_d = shareData_2 === null || shareData_2 === void 0 ? void 0 : shareData_2.data) === null || _d === void 0 ? void 0 : _d.content) === null || _e === void 0 ? void 0 : _e.landing_id) || '',
                            trigger_id: ((_g = (_f = shareData_2 === null || shareData_2 === void 0 ? void 0 : shareData_2.data) === null || _f === void 0 ? void 0 : _f.trigger) === null || _g === void 0 ? void 0 : _g.id) || '',
                            trigger_tag: ((_j = (_h = shareData_2 === null || shareData_2 === void 0 ? void 0 : shareData_2.data) === null || _h === void 0 ? void 0 : _h.trigger) === null || _j === void 0 ? void 0 : _j.tag) || '',
                            trigger_type: ((_l = (_k = shareData_2 === null || shareData_2 === void 0 ? void 0 : shareData_2.data) === null || _k === void 0 ? void 0 : _k.trigger) === null || _l === void 0 ? void 0 : _l.type) || '',
                            material_type: ((_o = (_m = shareData_2 === null || shareData_2 === void 0 ? void 0 : shareData_2.data) === null || _m === void 0 ? void 0 : _m.content) === null || _o === void 0 ? void 0 : _o.material_type) || '',
                            material_id: ((_q = (_p = shareData_2 === null || shareData_2 === void 0 ? void 0 : shareData_2.data) === null || _p === void 0 ? void 0 : _p.content) === null || _q === void 0 ? void 0 : _q.material_id) || '',
                            strategy_type: ((_s = (_r = shareData_2 === null || shareData_2 === void 0 ? void 0 : shareData_2.data) === null || _r === void 0 ? void 0 : _r.strategy) === null || _s === void 0 ? void 0 : _s.type) || '',
                            strategy_id: ((_u = (_t = shareData_2 === null || shareData_2 === void 0 ? void 0 : shareData_2.data) === null || _t === void 0 ? void 0 : _t.strategy) === null || _u === void 0 ? void 0 : _u.id) || '',
                            material_name: ((_w = (_v = shareData_2 === null || shareData_2 === void 0 ? void 0 : shareData_2.data) === null || _v === void 0 ? void 0 : _v.content) === null || _w === void 0 ? void 0 : _w.title) || '',
                            trigger_name: ((_y = (_x = shareData_2 === null || shareData_2 === void 0 ? void 0 : shareData_2.data) === null || _x === void 0 ? void 0 : _x.trigger) === null || _y === void 0 ? void 0 : _y.title) || '',
                            strategy_name: ((_0 = (_z = shareData_2 === null || shareData_2 === void 0 ? void 0 : shareData_2.data) === null || _z === void 0 ? void 0 : _z.strategy) === null || _0 === void 0 ? void 0 : _0.name) || '',
                            share_time: Math.floor(new Date().getTime() / 1000),
                            share_type: 'mini',
                            inviter_region: config_1.USER_INFO.region || '',
                            inviter_openid: config_1.USER_INFO.openid || '',
                            inviter_productid: config_1.SYSTEM_INFO.productId,
                            inviter_channelid: config_1.SYSTEM_INFO.channelId,
                            inviter_subchannelid: this.subChannelId || '',
                        });
                        query = params.query ? "".concat(query, "&").concat(params.query) : query;
                        _4.label = 6;
                    case 6:
                        _4.trys.push([6, 8, , 9]);
                        return [4 /*yield*/, (0, api_1.setShortTextApi)(query)];
                    case 7:
                        queryResult = _4.sent();
                        query = queryResult.data.short_name;
                        console.log('queryResult', queryResult);
                        return [3 /*break*/, 9];
                    case 8:
                        e_7 = _4.sent();
                        query = '';
                        return [3 /*break*/, 9];
                    case 9:
                        wx.setMessageToFriendQuery({
                            shareMessageToFriendScene: params.shareMessageToFriendScene,
                            // @ts-ignore
                            query: query
                        });
                        ctx = wx.getOpenDataContext();
                        ctx.postMessage({
                            event: 'rx_shareMessageToFriend',
                            openid: params.openId || '',
                            imageUrl: image,
                            title: params.title || ((_2 = (_1 = shareData_2 === null || shareData_2 === void 0 ? void 0 : shareData_2.data) === null || _1 === void 0 ? void 0 : _1.content) === null || _2 === void 0 ? void 0 : _2.content)
                        });
                        onShareMessageToFriend_1 = function (res) {
                            console.log(res);
                            // @ts-ignore
                            wx.offShareMessageToFriend(onShareMessageToFriend_1);
                            if (res.success) {
                                callback.complete(shareData_2);
                                _this.reportShareAppMessage('APP_MESSAGE');
                            }
                            else {
                                if (res.errMsg.includes('cancel')) {
                                    callback.complete(handleTrackError('rxlog_error_share', res, 5001));
                                }
                                else {
                                    callback.complete(handleTrackError('rxlog_error_share', res));
                                }
                            }
                        };
                        wx.onShareMessageToFriend(onShareMessageToFriend_1);
                        return [3 /*break*/, 11];
                    case 10:
                        err_12 = _4.sent();
                        callback.complete(handleTrackError('rxlog_error_share', err_12));
                        return [3 /*break*/, 11];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    SdkWegame.prototype.showShareImageMenu = function (params, callback) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var shareData_3, imageUrl, image, _c, err_13;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(wegame_1.wegameShareCheckParams, callback, params)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, this.getShareData(params, callback, true)];
                    case 2:
                        shareData_3 = _d.sent();
                        console.log('sdk getShareData:', shareData_3);
                        imageUrl = params.imageUrl || ((_b = (_a = shareData_3 === null || shareData_3 === void 0 ? void 0 : shareData_3.data) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.image);
                        if (!this.isImageUrl(imageUrl)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.downloadImage(imageUrl)];
                    case 3:
                        _c = _d.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        _c = imageUrl;
                        _d.label = 5;
                    case 5:
                        image = _c;
                        wx.updateShareMenu({
                            isUpdatableMessage: false
                        });
                        wx.showShareImageMenu({
                            path: image,
                            needShowEntrance: params.needShowEntrance || true,
                            style: params.style || 'default',
                            success: function (res) {
                                callback.complete(shareData_3);
                                _this.reportShareAppMessage('APP_MESSAGE');
                            },
                            fail: function (err) {
                                console.log(err);
                                if (err.errMsg.includes('cancel')) {
                                    callback.complete(handleTrackError('rxlog_error_share', err, 5001));
                                }
                                else {
                                    callback.complete(handleTrackError('rxlog_error_share', err));
                                }
                            }
                        });
                        return [3 /*break*/, 7];
                    case 6:
                        err_13 = _d.sent();
                        callback.complete(handleTrackError('rxlog_error_share', err_13));
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    //分享接口
    SdkWegame.prototype.share = function (params, callback) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4;
        return __awaiter(this, void 0, void 0, function () {
            var key, key_1, shareData_4, _5, autoReport_1, onHide_1, onShow_1, query, err_14;
            var _this = this;
            return __generator(this, function (_6) {
                switch (_6.label) {
                    case 0:
                        _6.trys.push([0, 6, , 7]);
                        if (!params.func) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(wegame_1.wegameShareCheckParams, callback, params)];
                    case 1:
                        _6.sent();
                        _6.label = 2;
                    case 2:
                        key = Date.now() + '';
                        for (key_1 in showMap) {
                            try {
                                wx.offShow(showMap[key_1]);
                            }
                            catch (e) {
                                console.log(e);
                            }
                        }
                        if (!params.func) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.getShareData(params, callback, true)];
                    case 3:
                        _5 = _6.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        _5 = { code: 0 };
                        _6.label = 5;
                    case 5:
                        shareData_4 = _5;
                        console.log('sdk getShareData:', shareData_4);
                        autoReport_1 = (_b = (_a = params.autoReport) !== null && _a !== void 0 ? _a : params.auto_report) !== null && _b !== void 0 ? _b : true;
                        wx.updateShareMenu({
                            isUpdatableMessage: false
                        });
                        onHide_1 = function () {
                            wx.offHide(onHide_1);
                        };
                        onShow_1 = function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                wx.offShow(onShow_1);
                                callback.complete(shareData_4);
                                if (params.func && autoReport_1) {
                                    this.shareSchedulingReport({
                                        func: params.func,
                                        region: params.region,
                                        transmits: params.transmits,
                                        scheduling_event: true,
                                        scheduling_type: 'share',
                                        properties: params.properties
                                    }, {
                                        complete: function (res) {
                                            console.log(res);
                                        }
                                    });
                                }
                                return [2 /*return*/];
                            });
                        }); };
                        query = utils_2.qs.stringify({
                            type: 'rx',
                            user_source: 'share',
                            platform: ((_c = shareData_4 === null || shareData_4 === void 0 ? void 0 : shareData_4.data) === null || _c === void 0 ? void 0 : _c.platform) || '',
                            transmits: encodeURIComponent((params === null || params === void 0 ? void 0 : params.transmits) || ''),
                            landing_id: ((_e = (_d = shareData_4 === null || shareData_4 === void 0 ? void 0 : shareData_4.data) === null || _d === void 0 ? void 0 : _d.content) === null || _e === void 0 ? void 0 : _e.landing_id) || '',
                            trigger_id: ((_g = (_f = shareData_4 === null || shareData_4 === void 0 ? void 0 : shareData_4.data) === null || _f === void 0 ? void 0 : _f.trigger) === null || _g === void 0 ? void 0 : _g.id) || '',
                            trigger_tag: ((_j = (_h = shareData_4 === null || shareData_4 === void 0 ? void 0 : shareData_4.data) === null || _h === void 0 ? void 0 : _h.trigger) === null || _j === void 0 ? void 0 : _j.tag) || '',
                            trigger_type: ((_l = (_k = shareData_4 === null || shareData_4 === void 0 ? void 0 : shareData_4.data) === null || _k === void 0 ? void 0 : _k.trigger) === null || _l === void 0 ? void 0 : _l.type) || '',
                            material_type: ((_o = (_m = shareData_4 === null || shareData_4 === void 0 ? void 0 : shareData_4.data) === null || _m === void 0 ? void 0 : _m.content) === null || _o === void 0 ? void 0 : _o.material_type) || '',
                            material_id: ((_q = (_p = shareData_4 === null || shareData_4 === void 0 ? void 0 : shareData_4.data) === null || _p === void 0 ? void 0 : _p.content) === null || _q === void 0 ? void 0 : _q.material_id) || '',
                            strategy_type: ((_s = (_r = shareData_4 === null || shareData_4 === void 0 ? void 0 : shareData_4.data) === null || _r === void 0 ? void 0 : _r.strategy) === null || _s === void 0 ? void 0 : _s.type) || '',
                            strategy_id: ((_u = (_t = shareData_4 === null || shareData_4 === void 0 ? void 0 : shareData_4.data) === null || _t === void 0 ? void 0 : _t.strategy) === null || _u === void 0 ? void 0 : _u.id) || '',
                            material_name: ((_w = (_v = shareData_4 === null || shareData_4 === void 0 ? void 0 : shareData_4.data) === null || _v === void 0 ? void 0 : _v.content) === null || _w === void 0 ? void 0 : _w.title) || '',
                            trigger_name: ((_y = (_x = shareData_4 === null || shareData_4 === void 0 ? void 0 : shareData_4.data) === null || _x === void 0 ? void 0 : _x.trigger) === null || _y === void 0 ? void 0 : _y.title) || '',
                            strategy_name: ((_0 = (_z = shareData_4 === null || shareData_4 === void 0 ? void 0 : shareData_4.data) === null || _z === void 0 ? void 0 : _z.strategy) === null || _0 === void 0 ? void 0 : _0.name) || '',
                            share_time: Math.floor(new Date().getTime() / 1000),
                            share_type: 'mini',
                            inviter_region: config_1.USER_INFO.region || '',
                            inviter_openid: config_1.USER_INFO.openid || '',
                            inviter_productid: config_1.SYSTEM_INFO.productId,
                            inviter_channelid: config_1.SYSTEM_INFO.channelId,
                            inviter_subchannelid: this.subChannelId || '',
                        });
                        query = params.query ? "".concat(query, "&").concat(params.query) : query;
                        wx.onHide(onHide_1);
                        wx.onShow(onShow_1);
                        showMap[key] = onShow_1;
                        this.reportShareAppMessage('APP_MESSAGE');
                        wx.shareAppMessage({
                            title: params.title || params.content || ((_2 = (_1 = shareData_4 === null || shareData_4 === void 0 ? void 0 : shareData_4.data) === null || _1 === void 0 ? void 0 : _1.content) === null || _2 === void 0 ? void 0 : _2.content),
                            imageUrl: params.imageUrl || params.image || ((_4 = (_3 = shareData_4 === null || shareData_4 === void 0 ? void 0 : shareData_4.data) === null || _3 === void 0 ? void 0 : _3.content) === null || _4 === void 0 ? void 0 : _4.image),
                            query: query,
                        });
                        return [3 /*break*/, 7];
                    case 6:
                        err_14 = _6.sent();
                        callback.complete(handleTrackError('rxlog_error_share', err_14));
                        this.track({
                            complete: function (data) {
                                console.info('share error add complete func when tracked:', data);
                            },
                        }, (0, utils_2.formatTrackParams)({
                            eventName: 'track_err',
                            apiName: 'share',
                            reqParams: params,
                            errorInfo: err_14,
                            loginInfo: config_1.USER_INFO,
                        }));
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    //分享海报接口
    SdkWegame.prototype.sharePoster = function (params, callback) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var shareData, err_15;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 4, , 5]);
                        // 判断params中至少存在func或者imageUrl中的一个
                        if (!(params === null || params === void 0 ? void 0 : params.func) && !(params === null || params === void 0 ? void 0 : params.imageUrl)) {
                            callback.complete({ code: 5000, msg: '参数错误 至少存在func或者imageUrl中的一个' });
                            return [2 /*return*/];
                        }
                        if (!(params === null || params === void 0 ? void 0 : params.func)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getShareData(__assign(__assign({}, params), { get_qrcode: true }), callback, true)];
                    case 1:
                        shareData = _c.sent();
                        wx.downloadFile({
                            url: (_b = (_a = shareData === null || shareData === void 0 ? void 0 : shareData.data) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.image,
                            success: function (res) {
                                _this.handleShareImageMenu(res === null || res === void 0 ? void 0 : res.tempFilePath, params === null || params === void 0 ? void 0 : params.needShowEntrance, callback);
                            }
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        // 使用传入的图片url，url需要时本地地址或者微信下载的临时地址
                        this.handleShareImageMenu(params === null || params === void 0 ? void 0 : params.imageUrl, params === null || params === void 0 ? void 0 : params.needShowEntrance, callback);
                        _c.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        err_15 = _c.sent();
                        callback.complete(handleTrackError('rxlog_error_share', err_15));
                        this.track({
                            complete: function (data) {
                                console.info('share error add complete func when tracked:', data);
                            },
                        }, (0, utils_2.formatTrackParams)({
                            eventName: 'track_err',
                            apiName: 'share',
                            reqParams: params,
                            errorInfo: err_15,
                            loginInfo: config_1.USER_INFO,
                        }));
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // 海报分享图片
    SdkWegame.prototype.handleShareImageMenu = function (imageUrl, needShowEntrance, callback) {
        if (needShowEntrance === void 0) { needShowEntrance = false; }
        wx.showShareImageMenu({
            path: imageUrl,
            needShowEntrance: needShowEntrance,
            success: function (data) {
                callback.complete({ code: 0, msg: '分享成功', data: data });
            },
            fail: function (err) {
                var _a;
                handleTrackError('rxlog_error_share', err);
                if ((_a = err === null || err === void 0 ? void 0 : err.errMsg) === null || _a === void 0 ? void 0 : _a.includes('fail cancel')) {
                    callback.complete({ code: 5001, msg: '取消分享' });
                }
                else {
                    callback.complete(__assign({ code: 5002, msg: '三方分享错误', thirdmsg: err === null || err === void 0 ? void 0 : err.errMsg }, ((err === null || err === void 0 ? void 0 : err.errno) && { thirdcode: err.errno })));
                }
            }
        });
    };
    //cp方主动补单
    SdkWegame.prototype.compensatePayOrder = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var notify_url, wx_openid, order_no, amount, env, zone_id, pf, err_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(wegame_1.compensateOrderCheckParams, callback, params)];
                    case 1:
                        _a.sent();
                        notify_url = params.notify_url, wx_openid = params.wx_openid, order_no = params.order_no, amount = params.amount, env = params.env, zone_id = params.zone_id, pf = params.pf;
                        return [4 /*yield*/, (0, api_1.payCallback)(notify_url, {
                                wx_openid: wx_openid,
                                order_no: order_no,
                                amount: amount,
                                env: env,
                                zone_id: zone_id,
                                pf: pf,
                            })];
                    case 2:
                        _a.sent();
                        (0, utils_2.removeStorageSync)("rx_".concat(config_1.USER_INFO.tid));
                        callback.complete({ code: 0 });
                        return [3 /*break*/, 4];
                    case 3:
                        err_16 = _a.sent();
                        if (expiredVoucherCode.includes(err_16 === null || err_16 === void 0 ? void 0 : err_16.code)) {
                            // 如果支付回调接口失败的原因是支付凭证已经用过或者是失效，清除补单支付凭证
                            (0, utils_2.removeStorageSync)("rx_".concat(config_1.USER_INFO.tid));
                            callback.complete({ code: 0, originErr: handleTrackError('rxlog_error_pay', err_16) });
                            return [2 /*return*/];
                        }
                        callback.complete(handleTrackError('rxlog_error_pay', err_16));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //查询是否需要补单
    SdkWegame.prototype.checkHasCompensatePayOrder = function () {
        var check = (0, utils_2.customGetStorageSync)("rx_".concat(config_1.USER_INFO.tid));
        if ((0, is_1.isEmpty)(check)) {
            return { code: -1, msg: 'null', data: null };
        }
        else {
            return { code: 0, msg: 'had', check: check };
        }
    };
    SdkWegame.prototype.exchangeItemProp = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, api_1.itemRedemptionApi)(params)];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        callback.complete((0, utils_2.handleError)(error_2));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SdkWegame.prototype.requestMerchantTransfer = function (params, callback) {
        try {
            // @ts-ignore
            wx.requestMerchantTransfer({
                mchId: params.mchId,
                appId: params.appId || wx.getAccountInfoSync().miniProgram.appId,
                package: params.package,
                success: function (res) {
                    console.log('success:', res);
                    callback.complete({
                        code: 0,
                        msg: res.errMsg
                    });
                },
                fail: function (err) {
                    console.log('fail:', err);
                    handleTrackError('requestMerchantTransfer', err);
                    callback.complete({
                        code: err.errno,
                        msg: err.errMsg,
                        thirdcode: err.errno,
                        thirdmsg: err.errMsg,
                    });
                }
            });
        }
        catch (err) {
            callback.complete(handleTrackError('requestMerchantTransfer', err));
        }
    };
    // 获取同玩互动好友列表
    SdkWegame.prototype.getRelationFriendList = function (params, callback) {
        var _this = this;
        if (params === void 0) { params = {}; }
        var _a = params || {}, _b = _a.guideAuthWhenDeny, guideAuthWhenDeny = _b === void 0 ? true : _b, _c = _a.authModalTitle, authModalTitle = _c === void 0 ? '授权提示' : _c, _d = _a.authModalContent, authModalContent = _d === void 0 ? '需要获取互动好友信息，请在设置中开启授权' : _d;
        // getRelationFriendList 需基础库 3.16.0 及以上，低版本需做兼容处理
        // @ts-ignore
        if (typeof wx.getRelationFriendList !== 'function') {
            var errMsg = 'getRelationFriendList:fail 当前微信版本过低，请升级到最新微信版本后重试（需基础库 3.16.2 及以上）';
            console.warn(errMsg);
            callback.complete(handleTrackError('', { errMsg: errMsg }));
            return;
        }
        // @ts-ignore
        wx.getRelationFriendList({
            success: function (res) { return __awaiter(_this, void 0, void 0, function () {
                var result, err_17;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            console.log('getRelationFriendList success:', res);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, (0, api_1.uploadGameInteractionInfoApi)({
                                    iv: res.iv,
                                    encrypted_data: res.encryptedData,
                                    signature: res.signature,
                                    raw_data: res.rawData || params.raw_data || '',
                                    cp_user_id: params.cp_user_id,
                                })];
                        case 2:
                            result = _a.sent();
                            callback.complete(result);
                            return [3 /*break*/, 4];
                        case 3:
                            err_17 = _a.sent();
                            callback.complete(handleTrackError('', err_17));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); },
            fail: function (err) {
                console.log('getRelationFriendList fail:', err);
                // 判断是否为用户拒绝授权导致的失败，引导用户前往设置页面重新开启授权
                if (guideAuthWhenDeny && err.errMsg && err.errMsg.indexOf('auth deny') !== -1) {
                    // @ts-ignore
                    wx.showModal({
                        title: authModalTitle,
                        content: authModalContent,
                        success: function (modalRes) {
                            if (modalRes.confirm) {
                                // @ts-ignore
                                wx.openSetting();
                            }
                        },
                    });
                }
                callback.complete(handleTrackError('', err));
            },
        });
    };
    //支付接口
    SdkWegame.prototype.pay = function (params, callback) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __awaiter(this, void 0, void 0, function () {
            var orderReq, requestMidasPaymentReq, compensateOrderReq, sessionOverdue, pay_type, reqOrder_1, _j, isHasCompensateOrder, notify_url, wx_openid, order_no_1, amount, env, zone_id, pf, orderForTrack, err_18, result_1, res_1, ext, notify_url, order_no_2, price_1, requestMidasPaymentParams, payCallbackReq, err_19, key, payParams, result, res_2, ext, price_2, requestMidasPaymentParams, err_20, miniorder, changeNumberKey, key, _k, goods_tag, order_nos, price, path, existingData, cacheList, onHide_2, onShow_2, shareInfo, short_url, appId, res_3, onShow_3, resData, _l, goods_tags, order_no, priceFen, url, sessionFromStr, err_21;
            var _this = this;
            return __generator(this, function (_m) {
                switch (_m.label) {
                    case 0:
                        console.log(config_1.SYSTEM_INFO.baseUrlList[config_1.SYSTEM_INFO.reqUrlIndex]);
                        sessionOverdue = function (err, trackEvent) { return __awaiter(_this, void 0, void 0, function () {
                            var result;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!((err === null || err === void 0 ? void 0 : err.code) == 152413 && this.refreshSession < 2)) return [3 /*break*/, 2];
                                        this.refreshSession++;
                                        return [4 /*yield*/, this.refreshSessionFunc()];
                                    case 1:
                                        result = _a.sent();
                                        if (result == 1) {
                                            this.pay(params, callback);
                                        }
                                        else {
                                            callback.complete(handleTrackError('rxlog_error_pay', err));
                                            this.track({
                                                complete: function (data) {
                                                    console.info('refresh sessionKey fail when sessionKey expires in pay :', data);
                                                },
                                            }, (0, utils_2.formatTrackParams)({
                                                eventName: trackEvent || 'track_err',
                                                apiName: 'pay',
                                                reqParams: params,
                                                errorInfo: err,
                                                loginInfo: config_1.USER_INFO,
                                                orderReq: orderReq,
                                                requestMidasPaymentReq: requestMidasPaymentReq,
                                                compensateOrderReq: compensateOrderReq,
                                            }));
                                        }
                                        return [3 /*break*/, 3];
                                    case 2:
                                        console.log('err 123');
                                        console.log(err);
                                        if (err.errCode == -2) {
                                            err.code = 4001;
                                            err.thirdcode = -2;
                                            callback.complete(handleTrackError('rxlog_error_pay', err));
                                            return [2 /*return*/];
                                        }
                                        callback.complete(handleTrackError('rxlog_error_pay', err, const_1.COMMON_ERROR_CODE.PAY_ERROR));
                                        this.track({
                                            complete: function (data) {
                                                console.info('pay error add complete func when tracked:', data);
                                            },
                                        }, (0, utils_2.formatTrackParams)({
                                            eventName: trackEvent || 'track_err',
                                            apiName: 'pay',
                                            reqParams: params,
                                            errorInfo: err,
                                            loginInfo: config_1.USER_INFO,
                                            orderReq: orderReq,
                                            requestMidasPaymentReq: requestMidasPaymentReq,
                                            compensateOrderReq: compensateOrderReq,
                                        }));
                                        _a.label = 3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); };
                        _m.label = 1;
                    case 1:
                        _m.trys.push([1, 46, 48, 49]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(wegame_1.wegamePayCheckParams, callback, params)];
                    case 2:
                        _m.sent();
                        if (params.indulge_auth == 1 && !params.age) {
                            throw Error('when indulge_auth equal 1,the age must be required');
                        }
                        pay_type = params.pay_type;
                        reqOrder_1 = __assign(__assign(__assign({}, params), { currency: 'CNY', openid: config_1.USER_INFO.openid, sub_channel_id: this.subChannelId, is_debug: params.is_debug || 0, env: params.env || 0 }), (!(0, is_1.isEmpty)(this.deviceInfo) ? { device_info: this.deviceInfo } : {}));
                        _j = pay_type;
                        switch (_j) {
                            case 'minigame': return [3 /*break*/, 3];
                            case 'minigame_v2': return [3 /*break*/, 3];
                            case 'midas_game_item': return [3 /*break*/, 21];
                            case 'minigame_friend': return [3 /*break*/, 30];
                            case 'wxpub': return [3 /*break*/, 33];
                            case 'jump_miniprogram': return [3 /*break*/, 36];
                            case 'wechath5': return [3 /*break*/, 38];
                            case 'aums': return [3 /*break*/, 40];
                            case 'midas_payment_game_item': return [3 /*break*/, 43];
                        }
                        return [3 /*break*/, 44];
                    case 3:
                        isHasCompensateOrder = (0, utils_2.customGetStorageSync)("rx_".concat(config_1.USER_INFO.tid));
                        if (!isHasCompensateOrder) return [3 /*break*/, 9];
                        console.info('sdk 支付pay进入补单');
                        _m.label = 4;
                    case 4:
                        _m.trys.push([4, 6, , 8]);
                        notify_url = isHasCompensateOrder.notify_url, wx_openid = isHasCompensateOrder.wx_openid, order_no_1 = isHasCompensateOrder.order_no, amount = isHasCompensateOrder.amount, env = isHasCompensateOrder.env, zone_id = isHasCompensateOrder.zone_id, pf = isHasCompensateOrder.pf;
                        orderForTrack = (0, utils_2.customGetStorageSync)("rx_".concat(config_1.USER_INFO.tid, "_track"));
                        compensateOrderReq = isHasCompensateOrder;
                        try {
                            this.track({
                                complete: function () { },
                            }, (0, utils_2.formatTrackParams)(__assign({ eventName: 'notify', apiName: 'pay_callback', reqParams: params, errorInfo: {}, loginInfo: config_1.USER_INFO, payCallbackReq: __assign({}, compensateOrderReq), state: '开始验证', desc: 'enter supplement order process from invoking pay' }, orderForTrack)));
                        }
                        catch (err) { }
                        return [4 /*yield*/, (0, api_1.payCallback)(notify_url, {
                                wx_openid: wx_openid,
                                order_no: order_no_1,
                                amount: amount,
                                env: env,
                                zone_id: zone_id,
                                pf: pf,
                            })];
                    case 5:
                        _m.sent();
                        try {
                            this.track({
                                complete: function () { },
                            }, (0, utils_2.formatTrackParams)({
                                eventName: 'removeTransactionObserver',
                                apiName: 'pay_success',
                                reqParams: params,
                                errorInfo: {},
                                loginInfo: config_1.USER_INFO,
                            }));
                        }
                        catch (err) { }
                        (0, utils_2.removeStorageSync)("rx_".concat(config_1.USER_INFO.tid));
                        callback.complete({ code: 0 });
                        return [3 /*break*/, 8];
                    case 6:
                        err_18 = _m.sent();
                        if (expiredVoucherCode.includes(err_18 === null || err_18 === void 0 ? void 0 : err_18.code)) {
                            // 如果支付回调接口失败的原因是支付凭证已经用过或者是失效，清除补单支付凭证，直接下单
                            (0, utils_2.removeStorageSync)("rx_".concat(config_1.USER_INFO.tid));
                            this.pay(params, callback);
                            return [2 /*return*/];
                        }
                        //新加入的逻辑
                        return [4 /*yield*/, sessionOverdue(err_18, 'payresult')
                            //新加入的逻辑
                        ];
                    case 7:
                        //新加入的逻辑
                        _m.sent();
                        //新加入的逻辑
                        return [2 /*return*/];
                    case 8: return [3 /*break*/, 20];
                    case 9:
                        reqOrder_1.callback_from = 1;
                        reqOrder_1.ext = __assign(__assign({}, reqOrder_1.ext), {
                            wx_openid: config_1.USER_INFO.tid,
                            zone_id: '1',
                            pf: 'android',
                        });
                        orderReq = reqOrder_1;
                        return [4 /*yield*/, (0, api_1.orderApi)(this.withDirectAdStatus(reqOrder_1))];
                    case 10:
                        result_1 = _m.sent();
                        this.track({
                            complete: function () { },
                        }, (0, utils_2.formatTrackParams)(__assign({ eventName: 'requestproduct', apiName: 'pay_order', state: '下单成功', reqParams: params, errorInfo: {}, loginInfo: config_1.USER_INFO, orderReq: orderReq, orderRes: (result_1 === null || result_1 === void 0 ? void 0 : result_1.data) || {} }, ((result_1 === null || result_1 === void 0 ? void 0 : result_1.data) || {}))));
                        res_1 = result_1.data;
                        ext = res_1.ext, notify_url = res_1.notify_url, order_no_2 = res_1.order_no, price_1 = res_1.price;
                        if (!(ext.amount > ext.balance)) return [3 /*break*/, 12];
                        requestMidasPaymentParams = {
                            mode: 'game',
                            offerId: ext.offer_id,
                            currencyType: 'CNY',
                            platform: 'android',
                            buyQuantity: ext.amount,
                            zoneId: params.zoneId || '1',
                            env: params.env || 0,
                            outTradeNo: order_no_2,
                        };
                        console.info('wx.requestMidasPayment params: ', requestMidasPaymentParams);
                        requestMidasPaymentReq = requestMidasPaymentParams;
                        return [4 /*yield*/, (0, utils_2.asyncFunc)(wx.requestMidasPayment, requestMidasPaymentParams)];
                    case 11:
                        _m.sent();
                        this._reportPurchase(price_1);
                        _m.label = 12;
                    case 12:
                        if (!callback.paySuccCallback) return [3 /*break*/, 14];
                        return [4 /*yield*/, Promise.resolve(callback.paySuccCallback())];
                    case 13:
                        _m.sent();
                        _m.label = 14;
                    case 14:
                        _m.trys.push([14, 16, , 20]);
                        payCallbackReq = {
                            wx_openid: config_1.USER_INFO.tid,
                            order_no: order_no_2,
                            amount: ext.amount,
                            env: params.env || 0,
                            zone_id: params.zoneId || '1',
                            pf: 'android',
                        };
                        this.track({
                            complete: function () { },
                        }, (0, utils_2.formatTrackParams)(__assign({ eventName: 'notify', apiName: 'pay_callback', reqParams: params, errorInfo: {}, loginInfo: config_1.USER_INFO, payCallbackReq: __assign({ notify_url: notify_url }, payCallbackReq), state: '开始验证' }, ((result_1 === null || result_1 === void 0 ? void 0 : result_1.data) || {}))));
                        return [4 /*yield*/, (0, api_1.payCallback)(notify_url, payCallbackReq)];
                    case 15:
                        _m.sent();
                        return [3 /*break*/, 20];
                    case 16:
                        err_19 = _m.sent();
                        if (!isDropOrder(err_19 === null || err_19 === void 0 ? void 0 : err_19.code)) return [3 /*break*/, 17];
                        key = "rx_".concat(config_1.USER_INFO.tid);
                        payParams = {
                            notify_url: notify_url,
                            wx_openid: config_1.USER_INFO.tid,
                            order_no: order_no_2,
                            amount: ext.amount,
                            env: params.env || 0,
                            zone_id: params.zoneId || '1',
                            pf: 'android',
                        };
                        this.track({
                            complete: function () { },
                        }, (0, utils_2.formatTrackParams)(__assign(__assign({ eventName: 'payresult', apiName: 'pay_callback_fail', reqParams: params, errorInfo: err_19, loginInfo: config_1.USER_INFO, payCallbackReq: __assign({}, payParams) }, ((result_1 === null || result_1 === void 0 ? void 0 : result_1.data) || {})), { desc: 'paycallback dropped order, about to enter the automatic supplement order process' })));
                        (0, utils_2.customSetStorageSync)(key, payParams);
                        try {
                            (0, utils_2.customSetStorageSync)(key + '_track', result_1 === null || result_1 === void 0 ? void 0 : result_1.data);
                        }
                        catch (err) {
                        }
                        err_19.data = err_19.data || {};
                        err_19.data = __assign(__assign({}, err_19.data), { payParams: payParams });
                        handleDynamicSupplementOrder();
                        callback.complete(handleTrackError('rxlog_error_pay', err_19));
                        // await sessionOverdue(err)
                        return [2 /*return*/];
                    case 17: 
                    //非补单的逻辑
                    return [4 /*yield*/, sessionOverdue(err_19, 'payresult')];
                    case 18:
                        //非补单的逻辑
                        _m.sent();
                        return [2 /*return*/];
                    case 19: return [3 /*break*/, 20];
                    case 20: return [3 /*break*/, 45];
                    case 21:
                        reqOrder_1.callback_from = 1;
                        reqOrder_1.ext = __assign(__assign({}, reqOrder_1.ext), {
                            wx_openid: config_1.USER_INFO.tid,
                            zone_id: '1',
                            pf: 'android',
                        });
                        orderReq = reqOrder_1;
                        return [4 /*yield*/, (0, api_1.orderApi)(this.withDirectAdStatus(reqOrder_1))];
                    case 22:
                        result = _m.sent();
                        this.track({
                            complete: function () { },
                        }, (0, utils_2.formatTrackParams)(__assign({ eventName: 'requestproduct', apiName: 'pay_order', state: '下单成功', reqParams: params, errorInfo: {}, loginInfo: config_1.USER_INFO, orderReq: orderReq, orderRes: (result === null || result === void 0 ? void 0 : result.data) || {} }, ((result === null || result === void 0 ? void 0 : result.data) || {}))));
                        _m.label = 23;
                    case 23:
                        _m.trys.push([23, 27, , 29]);
                        res_2 = result.data;
                        ext = res_2.ext, price_2 = res_2.price;
                        requestMidasPaymentParams = {
                            paySig: ext.paySig,
                            signData: ext.signData,
                            signature: ext.signature
                        };
                        console.info('wx.requestMidasPaymentGameItem params: ', requestMidasPaymentParams);
                        requestMidasPaymentReq = requestMidasPaymentParams;
                        // @ts-ignore
                        return [4 /*yield*/, (0, utils_2.asyncFunc)(wx.requestMidasPaymentGameItem, requestMidasPaymentParams)];
                    case 24:
                        // @ts-ignore
                        _m.sent();
                        this._reportPurchase(price_2);
                        if (!callback.paySuccCallback) return [3 /*break*/, 26];
                        return [4 /*yield*/, Promise.resolve(callback.paySuccCallback())];
                    case 25:
                        _m.sent();
                        _m.label = 26;
                    case 26: return [3 /*break*/, 29];
                    case 27:
                        err_20 = _m.sent();
                        //非补单的逻辑
                        return [4 /*yield*/, sessionOverdue(err_20, 'payresult')];
                    case 28:
                        //非补单的逻辑
                        _m.sent();
                        return [2 /*return*/];
                    case 29: return [3 /*break*/, 45];
                    case 30:
                        reqOrder_1.ext = __assign(__assign({}, reqOrder_1.ext), {
                            wx_openid: config_1.USER_INFO.tid,
                            zone_id: '1',
                            pf: 'android',
                        });
                        orderReq = reqOrder_1;
                        return [4 /*yield*/, (0, api_1.orderApi)(this.withDirectAdStatus(reqOrder_1))];
                    case 31:
                        miniorder = (_m.sent()).data.ext.miniorder;
                        changeNumberKey = ['env', 'buyQuantity', 'timeStamp'];
                        for (key in miniorder) {
                            if (changeNumberKey.includes(key)) {
                                miniorder[key] = Number(miniorder[key]);
                            }
                        }
                        return [4 /*yield*/, (0, utils_2.asyncFunc)(wx.requestMidasFriendPayment, __assign({}, miniorder))];
                    case 32:
                        _m.sent();
                        return [3 /*break*/, 45];
                    case 33:
                        if (params.direct_send) {
                            reqOrder_1.ext = {
                                customer: 1,
                                'direct_send': params.direct_send,
                                'title': params.title,
                                'desc': params.desc,
                                'image': params.image,
                                'latest_order_valid': (params === null || params === void 0 ? void 0 : params.latest_order_valid) || false
                            };
                        }
                        else {
                            reqOrder_1.ext = {
                                customer: 1
                            };
                        }
                        orderReq = reqOrder_1;
                        return [4 /*yield*/, (0, api_1.orderApi)(this.withDirectAdStatus(reqOrder_1))];
                    case 34:
                        _k = (_m.sent()).data, goods_tag = _k.goods_tag, order_nos = _k.order_no, price = _k.price;
                        path = config_1.SYSTEM_INFO.baseUrlList[config_1.SYSTEM_INFO.reqUrlIndex] +
                            "/v1/ke/wa/wxpub/order?order_no=".concat(order_nos, "&channel_id=").concat(config_1.SYSTEM_INFO.channelId, "&money=").concat(price, "&product_id=").concat(config_1.SYSTEM_INFO.productId, "&time=") +
                            Math.ceil(new Date().getTime() / 1000) +
                            "&rx_openid=".concat(config_1.USER_INFO.openid, "&goods_tag=").concat(goods_tag);
                        console.info('sdk 跳转链接: ', path);
                        try {
                            existingData = (0, utils_2.customGetStorageSync)('rx_cache_order_price');
                            cacheList = [];
                            // 如果存在数据，确保是数组格式
                            if (existingData) {
                                cacheList = Array.isArray(existingData) ? existingData : [existingData];
                            }
                            // 将新数据插入到数组最前面
                            cacheList.unshift({
                                order_nos: order_nos,
                                price: price
                            });
                            // 如果超过5条数据，只保留前5条
                            if (cacheList.length > 5) {
                                cacheList = cacheList.slice(0, 5);
                            }
                            // 保存更新后的数据
                            (0, utils_2.customSetStorageSync)('rx_cache_order_price', cacheList);
                            onHide_2 = function () {
                                wx.offHide(onHide_2);
                            };
                            onShow_2 = function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    wx.offShow(onShow_2);
                                    this.reportPurchaseByCache();
                                    return [2 /*return*/];
                                });
                            }); };
                            wx.onHide(onHide_2);
                            wx.onShow(onShow_2);
                        }
                        catch (e) {
                        }
                        return [4 /*yield*/, this._openCustomerServiceConversation({}, {
                                params: "",
                                desc: '充值',
                                func: params.func,
                                reconfirm: true,
                                sessionFrom: JSON.stringify(__assign(__assign({}, params === null || params === void 0 ? void 0 : params.sessionFromExt), { ruixue_openid: config_1.USER_INFO.openid, sub_channel_id: this.subChannelId, url: path, ui: 'ruixue_pay_wxpub', goods_tag: goods_tag, order_no: order_nos, price: String(price), priceYuan: String(price / 100) })),
                            }, !!params.func)];
                    case 35:
                        shareInfo = _m.sent();
                        try {
                            this.track({
                                complete: function () { },
                            }, (0, utils_2.formatTrackParams)({
                                eventName: 'opencustomer',
                                apiName: 'pay_callback',
                                reqParams: {
                                    params: "",
                                    desc: '客服调用参数上报',
                                    func: params.func,
                                    reconfirm: true,
                                    sessionFrom: JSON.stringify(__assign(__assign({}, params === null || params === void 0 ? void 0 : params.sessionFromExt), { ruixue_openid: config_1.USER_INFO.openid, sub_channel_id: this.subChannelId, url: path, ui: 'ruixue_pay_wxpub', goods_tag: goods_tag, order_no: order_nos, price: String(price), priceYuan: String(price / 100) })),
                                    shareInfo: JSON.stringify(shareInfo)
                                },
                                errorInfo: {},
                                loginInfo: config_1.USER_INFO,
                                payCallbackReq: {},
                                order_no: order_nos,
                                goods_tag: goods_tag,
                                goods_price: String(price),
                            }));
                        }
                        catch (err) { }
                        return [3 /*break*/, 45];
                    case 36:
                        short_url = config_1.SYSTEM_INFO.short_domain || params.short_url;
                        if (params.preview_image && !short_url) {
                            throw Error('when preview_image is true,the short_domain must be required');
                        }
                        if (!params.miniprogram_name) {
                            throw Error('when pay_type is jump_miniprogram,the miniprogram_name must be required');
                        }
                        appId = wx.getAccountInfoSync().miniProgram.appId;
                        reqOrder_1.ext = __assign(__assign({}, reqOrder_1.ext), { short_url: short_url || '', miniprogram_appid: appId, miniprogram_args: params.miniprogram_args || {}, miniprogram_name: params.miniprogram_name || '' });
                        console.log('order params');
                        console.log(reqOrder_1);
                        return [4 /*yield*/, (0, api_1.orderApi)(this.withDirectAdStatus(reqOrder_1))];
                    case 37:
                        res_3 = _m.sent();
                        onShow_3 = function (_a) {
                            var referrerInfo = _a.referrerInfo;
                            return __awaiter(_this, void 0, void 0, function () {
                                var appid, status, err;
                                var _b;
                                return __generator(this, function (_c) {
                                    console.log('---referrerInfo---', referrerInfo);
                                    wx.offShow(onShow_3);
                                    appid = referrerInfo === null || referrerInfo === void 0 ? void 0 : referrerInfo.appId;
                                    status = (_b = referrerInfo === null || referrerInfo === void 0 ? void 0 : referrerInfo.extraData) === null || _b === void 0 ? void 0 : _b.status;
                                    err = {};
                                    if (appid == res_3.data.ext.jump_appid) {
                                        if (status === 0) {
                                            callback.complete({
                                                code: 0
                                            });
                                        }
                                        else if (status == 4002) {
                                            err.code = const_1.COMMON_ERROR_CODE.PAY_ERROR;
                                            err.thirdcode = -1;
                                            err.msg = '支付失败';
                                            callback.complete(handleTrackError('rxlog_error_pay', err));
                                        }
                                        else if (status == 4001) {
                                            err.code = 4001;
                                            err.thirdcode = -2;
                                            err.msg = '取消支付';
                                            callback.complete(handleTrackError('rxlog_error_pay', err));
                                        }
                                        else {
                                            err.code = const_1.COMMON_ERROR_CODE.UNKNOWN_PAY_ERROR;
                                            err.thirdcode = const_1.COMMON_ERROR_CODE.UNKNOWN_PAY_ERROR;
                                            err.msg = '未知支付状态';
                                            callback.complete(handleTrackError('rxlog_error_pay', err));
                                        }
                                    }
                                    else {
                                        err.code = const_1.COMMON_ERROR_CODE.UNKNOWN_PAY_ERROR;
                                        err.thirdcode = const_1.COMMON_ERROR_CODE.UNKNOWN_PAY_ERROR;
                                        err.msg = '未知支付状态';
                                        callback.complete(handleTrackError('rxlog_error_pay', err));
                                    }
                                    return [2 /*return*/];
                                });
                            });
                        };
                        if (params.preview_image) {
                            wx.previewImage({
                                current: 'data:image/png;base64,' + ((_b = (_a = res_3.data) === null || _a === void 0 ? void 0 : _a.ext) === null || _b === void 0 ? void 0 : _b.wxacode_base64),
                                urls: ['data:image/png;base64,' + ((_d = (_c = res_3.data) === null || _c === void 0 ? void 0 : _c.ext) === null || _d === void 0 ? void 0 : _d.wxacode_base64)],
                                success: function () {
                                    wx.onShow(onShow_3);
                                },
                                fail: function (err) {
                                    callback.complete(handleTrackError('rxlog_error_pay', err));
                                }
                            });
                        }
                        else {
                            try {
                                wx.navigateToMiniProgram({
                                    appId: (_f = (_e = res_3.data) === null || _e === void 0 ? void 0 : _e.ext) === null || _f === void 0 ? void 0 : _f.jump_appid,
                                    path: "pages/order/order-detail/index?data=".concat(res_3.data.ext.data, "&domain=").concat(encodeURIComponent(config_1.SYSTEM_INFO.baseUrlList[config_1.SYSTEM_INFO.reqUrlIndex]), "&goods_name=").concat(res_3.data.goods_name, "&price=").concat(res_3.data.price, "&name=").concat(params.miniprogram_name),
                                    envVersion: params.envVersion || 'release',
                                    success: function () {
                                        wx.onShow(onShow_3);
                                    },
                                    fail: function (e) {
                                        console.log(e);
                                        wx.offShow(onShow_3);
                                        if (e.errMsg == 'navigateToMiniProgramWithoutTapCheck:fail cancel') {
                                            callback.complete(handleTrackError('rxlog_error_pay', {
                                                code: const_1.COMMON_ERROR_CODE.CANCEL_JUMP_MINIGAME,
                                                msg: '取消跳转小程序支付',
                                                thirdcode: const_1.COMMON_ERROR_CODE.CANCEL_JUMP_MINIGAME
                                            }));
                                        }
                                        else {
                                            callback.complete(handleTrackError('rxlog_error_pay', e));
                                        }
                                    }
                                });
                            }
                            catch (e) {
                                console.log(e);
                                wx.offShow(onShow_3);
                                callback.complete(handleTrackError('rxlog_error_pay', e));
                            }
                        }
                        return [2 /*return*/];
                    case 38:
                        reqOrder_1.ext = {
                            "miniprogram": true
                        };
                        orderReq = reqOrder_1;
                        return [4 /*yield*/, (0, api_1.orderApi)(this.withDirectAdStatus(reqOrder_1))];
                    case 39:
                        resData = _m.sent();
                        callback.complete({
                            code: 0,
                            pay_url: (_h = (_g = resData.data) === null || _g === void 0 ? void 0 : _g.ext) === null || _h === void 0 ? void 0 : _h.pay_url
                        });
                        return [2 /*return*/];
                    case 40:
                        reqOrder_1.ext = {
                            pay_type: 'h5',
                        };
                        orderReq = reqOrder_1;
                        return [4 /*yield*/, (0, api_1.orderApi)(this.withDirectAdStatus(reqOrder_1))];
                    case 41:
                        _l = (_m.sent()).data, goods_tags = _l.goods_tag, order_no = _l.order_no, priceFen = _l.price, url = _l.ext.url;
                        sessionFromStr = JSON.stringify(__assign(__assign({}, params === null || params === void 0 ? void 0 : params.sessionFromExt), { url: url, ui: 'ruixue_pay_aums_h5', ruixue_openid: config_1.USER_INFO.openid, goods_tag: goods_tags, order_no: order_no, price: String(priceFen), priceYuan: String(priceFen / 100) }));
                        console.log('sdk 打开客服 sessionFrom参数', sessionFromStr);
                        try {
                            this.track({
                                complete: function () { },
                            }, (0, utils_2.formatTrackParams)({
                                eventName: 'opencustomer',
                                apiName: 'pay_callback',
                                reqParams: {
                                    params: "",
                                    desc: '云闪付 客服调用参数上报',
                                    func: params.func,
                                    reconfirm: true,
                                    sessionFrom: JSON.stringify(__assign(__assign({}, params === null || params === void 0 ? void 0 : params.sessionFromExt), { ruixue_openid: config_1.USER_INFO.openid, url: url, ui: 'ruixue_pay_wxpub', goods_tag: goods_tag, order_no: order_nos, price: String(price), priceYuan: String(price / 100) })),
                                },
                                errorInfo: {},
                                loginInfo: config_1.USER_INFO,
                                payCallbackReq: {},
                                order_no: order_nos,
                                goods_tag: goods_tag,
                                goods_price: String(price),
                            }));
                        }
                        catch (err) { }
                        return [4 /*yield*/, this._openCustomerServiceConversation({}, {
                                params: "",
                                desc: '充值',
                                func: params.func,
                                reconfirm: true,
                                sessionFrom: sessionFromStr,
                            })];
                    case 42:
                        _m.sent();
                        return [3 /*break*/, 45];
                    case 43:
                        // 判断是否支持 Ios wx.requestMidasPaymentGameItem
                        try {
                            // @ts-ignore
                            if (wx.checkIsSupportMidasPayment) {
                                // @ts-ignore
                                wx.checkIsSupportMidasPayment({
                                    success: function (res) { return __awaiter(_this, void 0, void 0, function () {
                                        var result_order, res_4, ext, price_3, requestMidasPaymentParams, err_22;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    if (!res.data.allow_pay) return [3 /*break*/, 9];
                                                    reqOrder_1.callback_from = 1;
                                                    reqOrder_1.ext = __assign(__assign({}, reqOrder_1.ext), {
                                                        wx_openid: config_1.USER_INFO.tid,
                                                        zone_id: '1',
                                                        pf: 'android',
                                                    });
                                                    orderReq = reqOrder_1;
                                                    // mode 为 coins 时，使用 minigame_v2 支付，否则使用 midas_game_item 支付
                                                    reqOrder_1.pay_type = (params === null || params === void 0 ? void 0 : params.mode) === 'coins' ? 'minigame_v2' : 'midas_game_item';
                                                    return [4 /*yield*/, (0, api_1.orderApi)(this.withDirectAdStatus(reqOrder_1))];
                                                case 1:
                                                    result_order = _a.sent();
                                                    this.track({
                                                        complete: function () { },
                                                    }, (0, utils_2.formatTrackParams)(__assign({ eventName: 'requestproduct', apiName: 'pay_order', state: '下单成功', reqParams: params, errorInfo: {}, loginInfo: config_1.USER_INFO, orderReq: orderReq, orderRes: (result_order === null || result_order === void 0 ? void 0 : result_order.data) || {} }, ((result_order === null || result_order === void 0 ? void 0 : result_order.data) || {}))));
                                                    _a.label = 2;
                                                case 2:
                                                    _a.trys.push([2, 6, , 8]);
                                                    res_4 = result_order.data;
                                                    ext = res_4.ext, price_3 = res_4.price;
                                                    requestMidasPaymentParams = {
                                                        paySig: ext.paySig,
                                                        signData: __assign({ mode: params === null || params === void 0 ? void 0 : params.mode }, ext.signData),
                                                        signature: ext.signature
                                                    };
                                                    console.info('wx.requestMidasPaymentGameItem params: ', requestMidasPaymentParams);
                                                    requestMidasPaymentReq = requestMidasPaymentParams;
                                                    // @ts-ignore
                                                    return [4 /*yield*/, (0, utils_2.asyncFunc)(wx.requestMidasPaymentGameItem, requestMidasPaymentParams)];
                                                case 3:
                                                    // @ts-ignore
                                                    _a.sent();
                                                    this._reportPurchase(price_3);
                                                    if (!callback.paySuccCallback) return [3 /*break*/, 5];
                                                    return [4 /*yield*/, Promise.resolve(callback.paySuccCallback())];
                                                case 4:
                                                    _a.sent();
                                                    _a.label = 5;
                                                case 5: return [3 /*break*/, 8];
                                                case 6:
                                                    err_22 = _a.sent();
                                                    //非补单的逻辑
                                                    return [4 /*yield*/, sessionOverdue(err_22, 'payresult')];
                                                case 7:
                                                    //非补单的逻辑
                                                    _a.sent();
                                                    return [2 /*return*/];
                                                case 8: return [3 /*break*/, 10];
                                                case 9:
                                                    callback.complete({ code: const_1.COMMON_ERROR_CODE.PAY_TYPE_ERROR, msg: '当前环境不支持该支付方式', data: params });
                                                    _a.label = 10;
                                                case 10: return [2 /*return*/];
                                            }
                                        });
                                    }); },
                                    fail: function (err) {
                                        callback.complete({ code: -1, msg: 'requestMidasPaymentGameItem 支付方式支付失败', data: params });
                                    }
                                });
                            }
                            else {
                                callback.complete({ code: const_1.COMMON_ERROR_CODE.PAY_TYPE_ERROR, msg: '当前环境不支持该支付方式', data: params });
                            }
                        }
                        catch (error) {
                            callback.complete({ code: -1, msg: '支付失败' });
                        }
                        return [3 /*break*/, 45];
                    case 44:
                        callback.complete(handleTrackError('rxlog_error_pay', { code: 4000, msg: "\u672A\u77E5\u7684\u652F\u4ED8\u65B9\u5F0F ".concat(pay_type) }));
                        return [2 /*return*/];
                    case 45:
                        callback.complete({ code: 0 });
                        this.refreshSession = 0;
                        return [3 /*break*/, 49];
                    case 46:
                        err_21 = _m.sent();
                        //新加入的逻辑
                        return [4 /*yield*/, sessionOverdue(err_21, 'payresult')];
                    case 47:
                        //新加入的逻辑
                        _m.sent();
                        return [3 /*break*/, 49];
                    case 48:
                        // 清理上报支付订单接口所有队列和缓存
                        (0, request_1.clearAllQueuesAndCache)();
                        return [7 /*endfinally*/];
                    case 49: return [2 /*return*/];
                }
            });
        });
    };
    SdkWegame.prototype._openCustomerServiceConversation = function (_a, _b, showMessageCard) {
        var _c, _d;
        var complete = _a.complete;
        var params = _b.params, _e = _b.desc, desc = _e === void 0 ? '' : _e, func = _b.func, title = _b.title, image = _b.image, reconfirm = _b.reconfirm, _f = _b.sessionFrom, sessionFrom = _f === void 0 ? "{}" : _f;
        if (showMessageCard === void 0) { showMessageCard = true; }
        return __awaiter(this, void 0, void 0, function () {
            var shareInfo, infoResult, ip, access_token, devicecode, e_8, e_9, data, openConversation_1, error_3;
            var _this = this;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        shareInfo = {};
                        infoResult = {};
                        ip = '';
                        access_token = '';
                        devicecode = getDevicecode();
                        if (!(desc !== '充值')) return [3 /*break*/, 8];
                        _g.label = 1;
                    case 1:
                        _g.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, (0, api_1.getIpApi)()];
                    case 2:
                        _g.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_8 = _g.sent();
                        ip = e_8.client_ip;
                        return [3 /*break*/, 4];
                    case 4:
                        _g.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, (0, api_1._getInfoApi)()];
                    case 5:
                        infoResult = _g.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        e_9 = _g.sent();
                        console.log(e_9);
                        return [3 /*break*/, 7];
                    case 7:
                        try {
                            access_token = (0, utils_2.customGetStorageSync)('rxToken').access;
                        }
                        catch (e) {
                            console.log(e);
                        }
                        console.log('sessionFrom', sessionFrom);
                        if (typeof sessionFrom === 'object') {
                            sessionFrom = __assign(__assign({}, sessionFrom), { r_mode: "".concat((infoResult === null || infoResult === void 0 ? void 0 : infoResult.data.r_mode) || 0), ip: ip, devicecode: devicecode, access_token: access_token });
                        }
                        else {
                            try {
                                sessionFrom = __assign(__assign({}, JSON.parse(sessionFrom)), { r_mode: "".concat((infoResult === null || infoResult === void 0 ? void 0 : infoResult.data.r_mode) || 0), ip: ip, devicecode: devicecode, access_token: access_token });
                                sessionFrom = JSON.stringify(sessionFrom);
                            }
                            catch (e) {
                                console.log(e);
                            }
                        }
                        _g.label = 8;
                    case 8:
                        try {
                            console.info(JSON.parse(sessionFrom));
                        }
                        catch (e) {
                            console.info(sessionFrom);
                        }
                        _g.label = 9;
                    case 9:
                        _g.trys.push([9, 13, , 14]);
                        if (!func) return [3 /*break*/, 11];
                        return [4 /*yield*/, (0, api_1.getShareDataApi)(this.withDirectAdStatus({
                                product_id: config_1.SYSTEM_INFO.productId,
                                channel_id: config_1.SYSTEM_INFO.channelId,
                                sub_channel_id: this.subChannelId || '',
                                region: config_1.USER_INFO.region || '',
                                func: func,
                                platform: enum_1.PLATFORM.WECHAT,
                                type: 'mini',
                            }))];
                    case 10:
                        data = (_g.sent()).data;
                        if (data) {
                            title = (_c = data.content) === null || _c === void 0 ? void 0 : _c.content;
                            image = (_d = data.content) === null || _d === void 0 ? void 0 : _d.image;
                            shareInfo = data.content || {};
                        }
                        _g.label = 11;
                    case 11:
                        openConversation_1 = function () { return __awaiter(_this, void 0, void 0, function () {
                            var result, error_4, errMsg, confirm_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 8]);
                                        return [4 /*yield*/, (0, utils_2.asyncFunc)(wx.openCustomerServiceConversation, {
                                                showMessageCard: showMessageCard,
                                                sessionFrom: sessionFrom,
                                                sendMessageTitle: title,
                                                sendMessagePath: params,
                                                sendMessageImg: image,
                                            })
                                            //新增逻辑
                                        ];
                                    case 1:
                                        result = _a.sent();
                                        //新增逻辑
                                        complete && complete({ code: 0, data: __assign(__assign({}, result), { params: params }) });
                                        return [3 /*break*/, 8];
                                    case 2:
                                        error_4 = _a.sent();
                                        errMsg = error_4.errMsg;
                                        if (errMsg && !errMsg.includes('cancel')) {
                                            if (complete) {
                                                complete(handleTrackError('', error_4));
                                            }
                                            else {
                                                throw error_4;
                                            }
                                        }
                                        if (!reconfirm) return [3 /*break*/, 4];
                                        ;
                                        return [4 /*yield*/, (0, utils_2.asyncFunc)(wx.showModal, {
                                                title: const_1.MODAL_TITLE,
                                                content: "\u56E0\u7248\u672C\u9650\u5236, \u9700\u901A\u8FC7[\u5BA2\u670D\u4F1A\u8BDD]".concat(desc, ", \u8BF7\u60A8\u8C05\u89E3!"),
                                                cancelText: '我知道了',
                                                confirmText: '立即前往',
                                            })];
                                    case 3:
                                        (confirm_1 = (_a.sent()).confirm);
                                        _a.label = 4;
                                    case 4:
                                        if (!confirm_1) return [3 /*break*/, 6];
                                        return [4 /*yield*/, openConversation_1()];
                                    case 5:
                                        _a.sent();
                                        return [3 /*break*/, 7];
                                    case 6:
                                        if (complete) {
                                            console.log('触发2');
                                            complete(handleTrackError('', error_4));
                                        }
                                        else {
                                            throw new Error('用户取消');
                                        }
                                        _a.label = 7;
                                    case 7: return [3 /*break*/, 8];
                                    case 8: return [2 /*return*/];
                                }
                            });
                        }); };
                        return [4 /*yield*/, openConversation_1()];
                    case 12:
                        _g.sent();
                        return [3 /*break*/, 14];
                    case 13:
                        error_3 = _g.sent();
                        if (complete) {
                            complete(handleTrackError('', error_3));
                        }
                        else {
                            handleTrackError('', error_3);
                        }
                        this.track({
                            complete: function (data) {
                                console.info('_openCustomerServiceConversation error add complete func when tracked:', data);
                            },
                        }, (0, utils_2.formatTrackParams)({
                            eventName: 'track_err',
                            apiName: '_openCustomerServiceConversation',
                            reqParams: {
                                params: params,
                                desc: desc,
                                func: func,
                                title: title,
                                image: image,
                                reconfirm: reconfirm,
                                sessionFrom: sessionFrom,
                            },
                            errorInfo: error_3,
                            loginInfo: config_1.USER_INFO,
                        }));
                        return [3 /*break*/, 14];
                    case 14: return [2 /*return*/, shareInfo];
                }
            });
        });
    };
    SdkWegame.prototype.schedulingAction = function (params, callback) {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function () {
            var func, schedulingRes, scheduling_type, shareData, adUnitId, ad_type_1, err_23;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        _g.trys.push([0, 2, , 3]);
                        func = params === null || params === void 0 ? void 0 : params.func;
                        schedulingRes = this.getShareScheduling({ funcs: [func] });
                        scheduling_type = ((_b = (_a = schedulingRes === null || schedulingRes === void 0 ? void 0 : schedulingRes.data) === null || _a === void 0 ? void 0 : _a[func]) === null || _b === void 0 ? void 0 : _b.scheduling_type) || 'share';
                        console.log('sdk schedulingAction scheduling_type:', func, scheduling_type);
                        return [4 /*yield*/, this.getShareData(params, callback, true)];
                    case 1:
                        shareData = _g.sent();
                        console.log('sdk getShareData:', shareData);
                        if (scheduling_type === 'ad') {
                            adUnitId = params.adUnitId || ((_d = (_c = shareData === null || shareData === void 0 ? void 0 : shareData.data) === null || _c === void 0 ? void 0 : _c.ad_content) === null || _d === void 0 ? void 0 : _d.identify);
                            ad_type_1 = params.adUnitId || ((_f = (_e = shareData === null || shareData === void 0 ? void 0 : shareData.data) === null || _e === void 0 ? void 0 : _e.ad_content) === null || _f === void 0 ? void 0 : _f.ad_type);
                            switch (ad_type_1) {
                                case 'custom_cell':
                                    this.createCustomAd({
                                        adUnitId: adUnitId,
                                        custom_ext: params.custom_ext,
                                        style: params.cellStyle || params.style || {}
                                    }, {
                                        complete: 
                                        // @ts-ignore
                                        function (args) {
                                            callback.complete(__assign({ scheduling_type: 'ad', ad_type: ad_type_1 }, (args || {})));
                                        }
                                    });
                                    break;
                                case 'custom_cells':
                                    this.createCustomAd({
                                        adUnitId: adUnitId,
                                        custom_ext: params.custom_ext,
                                        style: params.cellsStyle || params.style || {}
                                    }, {
                                        complete: 
                                        // @ts-ignore
                                        function (args) {
                                            callback.complete(__assign({ scheduling_type: 'ad', ad_type: ad_type_1 }, (args || {})));
                                        }
                                    });
                                    break;
                                case 'custom_matrix':
                                    this.createCustomAd({
                                        adUnitId: adUnitId,
                                        custom_ext: params.custom_ext,
                                        style: params.matrixStyle || params.style || {}
                                    }, {
                                        complete: 
                                        // @ts-ignore
                                        function (args) {
                                            callback.complete(__assign({ scheduling_type: 'ad', ad_type: ad_type_1 }, (args || {})));
                                        }
                                    });
                                    break;
                                case 'custom_banner':
                                    this.createCustomAd({
                                        adUnitId: adUnitId,
                                        custom_ext: params.custom_ext,
                                        style: params.bannerStyle || params.style || {}
                                    }, {
                                        complete: 
                                        // @ts-ignore
                                        function (args) {
                                            callback.complete(__assign({ scheduling_type: 'ad', ad_type: ad_type_1 }, (args || {})));
                                        }
                                    });
                                    break;
                                case 'interstitial':
                                    this.interstitialAd({
                                        adUnitId: adUnitId,
                                        custom_ext: params.custom_ext
                                    }, {
                                        complete: 
                                        // @ts-ignore
                                        function (args) {
                                            callback.complete(__assign({ scheduling_type: 'ad', ad_type: ad_type_1 }, (args || {})));
                                        }
                                    });
                                    break;
                                default:
                                    this.rewardedVideoAd({
                                        adUnitId: adUnitId,
                                        custom_ext: params.custom_ext
                                    }, {
                                        complete: 
                                        // @ts-ignore
                                        function (args) {
                                            callback.complete(__assign({ scheduling_type: 'ad', ad_type: ad_type_1 }, (args || {})));
                                        }
                                    });
                            }
                        }
                        else if (scheduling_type === 'share') {
                            this.share(params, {
                                complete: 
                                // @ts-ignore
                                function (args) {
                                    callback.complete(__assign({ scheduling_type: 'share' }, (args || {})));
                                }
                            });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_23 = _g.sent();
                        callback.complete(handleTrackError('rxlog_error_share', err_23));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //获得分享内容
    SdkWegame.prototype.getAdShareData = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var region, productId, channelId, platform, transmits, func, type, sub_channel_id, open_id, shareData, err_24;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        region = (params === null || params === void 0 ? void 0 : params.region) || config_1.USER_INFO.region || '';
                        productId = config_1.SYSTEM_INFO.productId, channelId = config_1.SYSTEM_INFO.channelId;
                        platform = 'wechat';
                        transmits = encodeURI(params.transmits || '');
                        func = params.func;
                        type = 'mini';
                        sub_channel_id = this.subChannelId || '';
                        open_id = config_1.USER_INFO.openid;
                        return [4 /*yield*/, (0, api_1.getAdShareDataApi)({
                                func: func,
                                transmits: transmits,
                                product_id: productId,
                                channel_id: channelId,
                                platform: platform,
                                type: type,
                                region: region,
                                sub_channel_id: sub_channel_id,
                                open_id: open_id,
                                custom_ext: params.custom_ext
                            })];
                    case 1:
                        shareData = _a.sent();
                        callback && callback.complete(shareData);
                        return [2 /*return*/, shareData];
                    case 2:
                        err_24 = _a.sent();
                        callback && callback.complete(handleTrackError('', err_24));
                        return [2 /*return*/, err_24];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SdkWegame.prototype.createCustomAd = function (data, _a) {
        var _b, _c;
        var complete = _a.complete, failCallback = _a.fail;
        return __awaiter(this, void 0, void 0, function () {
            var adShareData, adUnitId, customAd, p, _error;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        console.log('createCustomAd');
                        adShareData = {};
                        if (!(!data.adUnitId && data.func)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getAdShareData({
                                func: data.func,
                                custom_ext: data.custom_ext || {}
                            })];
                    case 1:
                        adShareData = _d.sent();
                        console.log('ad share data', adShareData);
                        _d.label = 2;
                    case 2:
                        adUnitId = data.adUnitId || ((_c = (_b = adShareData === null || adShareData === void 0 ? void 0 : adShareData.data) === null || _b === void 0 ? void 0 : _b.ad_content) === null || _c === void 0 ? void 0 : _c.identify);
                        console.log('adUnitId:', adUnitId);
                        customAd = wx.createCustomAd({ adUnitId: adUnitId, style: data.style });
                        if (customAd) {
                            customAd.onClose(function (res) {
                                customAd.destroy();
                                // complete({
                                //   code: 1,
                                //   msg: '原生模板广告关闭'
                                // })
                            });
                            customAd.onError(function (err) {
                                console.log(err);
                                customAd.destroy();
                            });
                            p = customAd.show();
                            p.then(function () {
                                complete && complete({
                                    code: 0,
                                    msg: '原生模板广告显示',
                                    ad: customAd
                                });
                            }).catch(function (error) {
                                console.log("show custom ad failed, error");
                                console.log(error);
                                var _error = handleTrackError('rxlog_error_ad', {
                                    code: -1,
                                    msg: error.errMsg,
                                    thirdcode: error.errCode,
                                    thirdmsg: error.errMsg,
                                });
                                complete(_error);
                                failCallback && failCallback(_error);
                            });
                        }
                        else {
                            _error = handleTrackError('rxlog_error_ad', {
                                code: -1,
                                msg: '创建广告组件失败'
                            });
                            complete(_error);
                            failCallback && failCallback(_error);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    //激励广告
    SdkWegame.prototype.rewardedVideoAd = function (data, _a) {
        var _b, _c;
        var complete = _a.complete, failCallback = _a.fail;
        return __awaiter(this, void 0, void 0, function () {
            var adShareData, adUnitId, fail, ad_1, onClose_1, catchLoadAndShowError_1, error_5;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        console.log('rewardedVideoAd');
                        adShareData = {};
                        if (!(!data.adUnitId && data.func)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getAdShareData({
                                func: data.func,
                                custom_ext: data.custom_ext || {}
                            })];
                    case 1:
                        adShareData = _d.sent();
                        console.log('ad share data', adShareData);
                        _d.label = 2;
                    case 2:
                        adUnitId = data.adUnitId || ((_c = (_b = adShareData === null || adShareData === void 0 ? void 0 : adShareData.data) === null || _b === void 0 ? void 0 : _b.ad_content) === null || _c === void 0 ? void 0 : _c.identify);
                        console.log('adUnitId:', adUnitId);
                        fail = function (error) {
                            /**
                             * 广告错误码两种字段
                             * 字段1: err_code
                             * errMsg: "operateWXDataForAd:fail invalid scope"
                             * err_code: -12001
                             *
                             * 字段2: errCode
                             * errMsg: "广告单元无效"
                             * errCode: 1002
                             */
                            error.message = const_1.AD_ERROR_MAP[error.errCode] || error.message || error.errMsg;
                            var err = new Error(error.message);
                            // data: 保留原始错误
                            err.data = {
                                data: error
                            };
                            var handle_err = handleTrackError('rxlog_error_ad', error);
                            complete(handle_err);
                            failCallback && failCallback(handle_err);
                            _this.track({
                                complete: function (data) {
                                    console.info('rewardedVideoAd error add complete func when tracked:', data);
                                },
                            }, (0, utils_2.formatTrackParams)({
                                eventName: 'track_err',
                                apiName: 'rewardedVideoAd',
                                reqParams: data,
                                errorInfo: error,
                                loginInfo: config_1.USER_INFO,
                            }));
                        };
                        _d.label = 3;
                    case 3:
                        _d.trys.push([3, 6, , 7]);
                        onClose_1 = function (_a) {
                            var isEnded = _a.isEnded;
                            return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_b) {
                                    ad_1.offClose(onClose_1);
                                    if (isEnded) {
                                        complete({
                                            code: 0,
                                            data: null,
                                            msg: isEnded,
                                            isEnded: isEnded,
                                        });
                                    }
                                    else {
                                        complete({
                                            code: -1,
                                            data: null,
                                            msg: isEnded,
                                            isEnded: isEnded,
                                        });
                                    }
                                    try {
                                        if (data.destroyAd) {
                                            ad_1.destroy();
                                            console.info('destroy ad');
                                            this._ad = null;
                                            // @ts-ignore
                                            ad_1 = null;
                                        }
                                    }
                                    catch (e) {
                                    }
                                    return [2 /*return*/];
                                });
                            });
                        };
                        if (!!this._ad) return [3 /*break*/, 5];
                        ad_1 = wx.createRewardedVideoAd({
                            adUnitId: adUnitId,
                            multiton: data.multiton || false
                        });
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                var timer = setTimeout(function () {
                                    reject({ code: 1000000, msg: 'adLoadTimeout' });
                                    clearTimeout(timer);
                                    timer = null;
                                }, 10000);
                                ad_1.onLoad(function () {
                                    _this._ad = ad_1;
                                    _this._hasAd.rewarded = true;
                                    resolve();
                                });
                                ad_1.onError(function (error) {
                                    _this._hasAd.rewarded = false;
                                    reject(error);
                                    try {
                                        if (data.destroyAd) {
                                            ad_1.destroy();
                                            console.info('destroy ad');
                                            _this._ad = null;
                                            // @ts-ignore
                                            ad_1 = null;
                                        }
                                    }
                                    catch (e) {
                                    }
                                });
                                ad_1.load();
                            })];
                    case 4:
                        _d.sent();
                        console.info(this._ad);
                        _d.label = 5;
                    case 5:
                        ad_1 = this._ad;
                        if (data.isCheck) {
                            complete(__assign(__assign({ code: 0 }, data), { adUnitId: adUnitId, isEnded: false, ad: ad_1 }));
                        }
                        else {
                            ad_1.onClose(onClose_1);
                            catchLoadAndShowError_1 = function (error) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    fail(error);
                                    return [2 /*return*/];
                                });
                            }); };
                            if (!this._hasAd.rewarded) {
                                ad_1.load()
                                    .then(function () {
                                    ad_1.show().catch(function () {
                                        // 失败重试
                                        ad_1.load()
                                            .then(function () { return ad_1.show(); })
                                            .catch(catchLoadAndShowError_1);
                                    });
                                })
                                    .catch(catchLoadAndShowError_1);
                                return [2 /*return*/];
                            }
                            if (!data.isCheck) {
                                ad_1.show().catch(function () {
                                    // 失败重试
                                    ad_1.load()
                                        .then(function () { return ad_1.show(); })
                                        .catch(catchLoadAndShowError_1);
                                });
                            }
                        }
                        return [3 /*break*/, 7];
                    case 6:
                        error_5 = _d.sent();
                        fail(error_5);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    //插入广告
    SdkWegame.prototype.interstitialAd = function (data, _a) {
        var _b, _c;
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            var adShareData, adUnitId, ad_2, error_6, err;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        console.log('interstitialAd');
                        adShareData = {};
                        if (!(!data.adUnitId && data.func)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getAdShareData({
                                func: data.func,
                                custom_ext: data.custom_ext || {}
                            })];
                    case 1:
                        adShareData = _d.sent();
                        console.log('ad share data', adShareData);
                        _d.label = 2;
                    case 2:
                        adUnitId = data.adUnitId || ((_c = (_b = adShareData === null || adShareData === void 0 ? void 0 : adShareData.data) === null || _b === void 0 ? void 0 : _b.ad_content) === null || _c === void 0 ? void 0 : _c.identify);
                        console.log('adUnitId:', adUnitId);
                        _d.label = 3;
                    case 3:
                        _d.trys.push([3, 9, , 10]);
                        if (!this._interstitialAd) return [3 /*break*/, 4];
                        ad_2 = this._interstitialAd;
                        return [3 /*break*/, 6];
                    case 4:
                        ad_2 = wx.createInterstitialAd({
                            adUnitId: adUnitId,
                        });
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                ad_2.onLoad(function () {
                                    _this._interstitialAd = ad_2;
                                    _this._hasAd.interstitial = true;
                                    resolve(undefined);
                                });
                                ad_2.onError(function (error) {
                                    _this._hasAd.interstitial = false;
                                    reject(error);
                                });
                            })];
                    case 5:
                        _d.sent();
                        _d.label = 6;
                    case 6:
                        if (!!data.isCheck) return [3 /*break*/, 8];
                        return [4 /*yield*/, ad_2.show()];
                    case 7:
                        _d.sent();
                        _d.label = 8;
                    case 8:
                        complete(__assign(__assign({ code: 0 }, data), { ad: ad_2 }));
                        return [3 /*break*/, 10];
                    case 9:
                        error_6 = _d.sent();
                        error_6.message = const_1.AD_ERROR_MAP[error_6.errCode] || error_6.message || error_6.errMsg;
                        err = new Error(error_6.message);
                        // data: 保留原始错误
                        err.data = {
                            data: error_6
                        };
                        complete(handleTrackError('rxlog_error_ad', error_6));
                        this.track({
                            complete: function (data) {
                                console.info('interstitialAd error add complete func when tracked:', data);
                            },
                        }, (0, utils_2.formatTrackParams)({
                            eventName: 'track_err',
                            apiName: 'interstitialAd',
                            reqParams: data,
                            errorInfo: error_6,
                            loginInfo: config_1.USER_INFO,
                        }));
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    //banner 广告
    SdkWegame.prototype.bannerAd = function (data, _a) {
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            var ad_3, error_7, err;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 6, , 7]);
                        if (!this._bannerAd) return [3 /*break*/, 1];
                        ad_3 = this._bannerAd;
                        return [3 /*break*/, 3];
                    case 1:
                        ad_3 = wx.createBannerAd({
                            adIntervals: data.adIntervals,
                            adUnitId: data.adUnitId,
                            style: data.style,
                        });
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                ad_3.onLoad(function () {
                                    _this._bannerAd = ad_3;
                                    _this._hasAd.banner = true;
                                    resolve(undefined);
                                });
                                ad_3.onError(function (error) {
                                    _this._hasAd.banner = false;
                                    reject(error);
                                });
                            })];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        if (!!data.isCheck) return [3 /*break*/, 5];
                        return [4 /*yield*/, ad_3.show()];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5:
                        complete(__assign(__assign({ code: 0 }, data), { ad: ad_3 }));
                        return [3 /*break*/, 7];
                    case 6:
                        error_7 = _b.sent();
                        error_7.message = const_1.AD_ERROR_MAP[error_7.errCode] || error_7.message || error_7.errMsg;
                        err = new Error(error_7.message);
                        // data: 保留原始错误
                        err.data = {
                            data: error_7
                        };
                        complete(handleTrackError('rxlog_error_ad', error_7));
                        this.track({
                            complete: function (data) {
                                console.info('bannerAd error add complete func when tracked:', data);
                            },
                        }, (0, utils_2.formatTrackParams)({
                            eventName: 'track_err',
                            apiName: 'bannerAd',
                            reqParams: data,
                            errorInfo: error_7,
                            loginInfo: config_1.USER_INFO,
                        }));
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    // 分享调度初始化
    SdkWegame.prototype.shareSchedulingInit = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var req, res, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(checkConfig_1.shareScheduleInitParams, callback, params)];
                    case 1:
                        _a.sent();
                        this.funcs = (params === null || params === void 0 ? void 0 : params.funcs) || [];
                        req = {
                            func: this.funcs,
                            type: 'mini',
                            open_id: config_1.USER_INFO.openid || ''
                        };
                        return [4 /*yield*/, (0, api_1.schedulingInitApi)(req)];
                    case 2:
                        res = _a.sent();
                        this.scheduleInitMap = (res === null || res === void 0 ? void 0 : res.data) || {};
                        (0, utils_2.removeStorageByPrefix)('rx_schedule');
                        callback.complete(res);
                        return [3 /*break*/, 4];
                    case 3:
                        error_8 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // 获取埋点调度
    SdkWegame.prototype.getShareScheduling = function (params) {
        var funcs = params === null || params === void 0 ? void 0 : params.funcs;
        if (!funcs)
            return { code: 0, data: this.scheduleInitMap };
        if (funcs && !(0, is_1.isArray)(funcs)) {
            var error = new Error('funcs must be Array');
            error.code = const_1.COMMON_ERROR_CODE.PARAMS_ERROR;
            return handleTrackError('', error);
        }
        try {
            console.log('sdk getShareScheduling: ', params, this.scheduleInitMap);
            var data = (0, is_1.pick)(this.scheduleInitMap, funcs);
            return { code: 0, data: data };
        }
        catch (error) {
            return handleTrackError('', error);
        }
    };
    // 看广告完成上报
    SdkWegame.prototype.shareSchedulingReport = function (params, callback) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var func, region, sub_channel_id, open_id, scheduling_event, Iparams, result_2, remaining_share_count, error_9;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 8, , 9]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(checkConfig_1.shareScheduleReportParams, callback, params)];
                    case 1:
                        _d.sent();
                        func = params.func;
                        region = (params === null || params === void 0 ? void 0 : params.region) || config_1.USER_INFO.region || '';
                        sub_channel_id = this.subChannelId || '';
                        open_id = config_1.USER_INFO.openid || '';
                        scheduling_event = (params === null || params === void 0 ? void 0 : params.scheduling_event) === true ? 'done' : 'fail';
                        Iparams = this.withDirectAdBigdataExt(__assign(__assign({ platform: enum_1.PLATFORM.WECHAT, type: 'mini', sub_channel_id: sub_channel_id, open_id: open_id }, params), { region: region, scheduling_event: scheduling_event, properties: __assign({ region: region }, params === null || params === void 0 ? void 0 : params.properties) }));
                        //ad不上报上一次的分享数据
                        if (params.scheduling_type == 'share') {
                            Iparams.properties = __assign(__assign({}, this.scheuleReportProps), Iparams.properties);
                        }
                        return [4 /*yield*/, (0, api_1.schedulingReportApi)(Iparams)];
                    case 2:
                        result_2 = _d.sent();
                        if (!(0, is_1.isEmpty)(result_2 === null || result_2 === void 0 ? void 0 : result_2.data)) return [3 /*break*/, 4];
                        console.log('上报返回为空，对应埋点删除');
                        this.scheduleInitMap = (0, is_1.omit)(this.scheduleInitMap, func);
                        (0, utils_2.removeStorageSync)("rx_schedule_".concat(config_1.USER_INFO.tid, "_").concat(func, "_").concat(region));
                        return [4 /*yield*/, this.shareSchedulingInit({}, {
                                complete: function () {
                                    console.log('shareSchedulingInit');
                                    callback.complete(result_2);
                                }
                            })];
                    case 3:
                        _d.sent();
                        return [2 /*return*/];
                    case 4:
                        remaining_share_count = ((_b = (_a = result_2 === null || result_2 === void 0 ? void 0 : result_2.data) === null || _a === void 0 ? void 0 : _a.scheduling) === null || _b === void 0 ? void 0 : _b.remaining_share_count) || 0;
                        console.log('上报后剩余次数为' + remaining_share_count);
                        if (!(remaining_share_count <= 0)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.shareSchedulingInit({}, {
                                complete: function () {
                                    console.log('shareSchedulingInit');
                                    callback.complete(result_2);
                                }
                            })];
                    case 5:
                        _d.sent();
                        return [2 /*return*/];
                    case 6:
                        this.scheduleInitMap[func] = (_c = result_2 === null || result_2 === void 0 ? void 0 : result_2.data) === null || _c === void 0 ? void 0 : _c.scheduling;
                        (0, utils_2.customSetStorageSync)("rx_schedule_".concat(config_1.USER_INFO.tid, "_").concat(func, "_").concat(region), JSON.stringify(result_2));
                        _d.label = 7;
                    case 7:
                        callback.complete(result_2);
                        return [3 /*break*/, 9];
                    case 8:
                        error_9 = _d.sent();
                        callback.complete(handleTrackError('', error_9));
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    SdkWegame.prototype.refreshSessionFunc = function () {
        return __awaiter(this, void 0, void 0, function () {
            var code, err_25;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, utils_2.asyncFunc)(wx.login)];
                    case 1:
                        code = (_a.sent()).code;
                        return [4 /*yield*/, (0, api_1.refreshUserInfo)({
                                version: 'base',
                                code: code,
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, 1];
                    case 3:
                        err_25 = _a.sent();
                        return [2 /*return*/, -1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //同步用户信息
    SdkWegame.prototype.infoSync = function (CPcallback, info) {
        return __awaiter(this, void 0, void 0, function () {
            var code, _a, encryptedData, iv, result, error_10;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, (0, utils_2.asyncFunc)(wx.login)];
                    case 1:
                        code = (_b.sent()).code;
                        return [4 /*yield*/, (0, utils_2.asyncFunc)(wx.getUserProfile, {
                                lang: 'zh_CN',
                                desc: (info === null || info === void 0 ? void 0 : info.desc) || '用于获取昵称和头像',
                            })];
                    case 2:
                        _a = _b.sent(), encryptedData = _a.encryptedData, iv = _a.iv;
                        return [4 /*yield*/, (0, api_1.refreshUserInfo)({
                                code: code,
                                encryptedData: encryptedData,
                                iv: iv,
                                version: (info === null || info === void 0 ? void 0 : info.version) || 'normal'
                            })];
                    case 3:
                        result = _b.sent();
                        CPcallback.complete(result);
                        return [3 /*break*/, 5];
                    case 4:
                        error_10 = _b.sent();
                        CPcallback.complete(handleTrackError('', error_10));
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SdkWegame.prototype.userInfoSilentSync = function (CPcallback, info) {
        return __awaiter(this, void 0, void 0, function () {
            var authSetting, methodParams, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, (0, utils_2.asyncFunc)(wx.getSetting)
                            // console.info('======scope.userInfo======', authSetting['scope.userInfo'])
                        ];
                    case 1:
                        authSetting = (_a.sent()).authSetting;
                        methodParams = (CPcallback === null || CPcallback === void 0 ? void 0 : CPcallback.complete) ? { complete: CPcallback.complete } : {};
                        if (!(authSetting['scope.userInfo'] === true)) return [3 /*break*/, 3];
                        // 允许授权过
                        return [4 /*yield*/, this._userInfoSilentSync(methodParams, info)];
                    case 2:
                        // 允许授权过
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3: 
                    // 从未进入过小游戏（authSetting['scope.userInfo'] === undefined） 和 拒绝授权过（authSetting['scope.userInfo'] === false）
                    // 小游戏内使用 wx.authorize({scope: "scope.userInfo"})，不会弹出授权窗口(本地开发者工具会弹出来，真机调试不行)
                    return [4 /*yield*/, this.infoSync(methodParams, info)];
                    case 4:
                        // 从未进入过小游戏（authSetting['scope.userInfo'] === undefined） 和 拒绝授权过（authSetting['scope.userInfo'] === false）
                        // 小游戏内使用 wx.authorize({scope: "scope.userInfo"})，不会弹出授权窗口(本地开发者工具会弹出来，真机调试不行)
                        _a.sent();
                        _a.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_11 = _a.sent();
                        (CPcallback === null || CPcallback === void 0 ? void 0 : CPcallback.complete) && CPcallback.complete(handleTrackError('', error_11));
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    SdkWegame.prototype._userInfoSilentSync = function (callback, info) {
        return __awaiter(this, void 0, void 0, function () {
            var code, _a, encryptedData, iv, result, error_12;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, (0, utils_2.asyncFunc)(wx.login)];
                    case 1:
                        code = (_b.sent()).code;
                        return [4 /*yield*/, (0, utils_2.asyncFunc)(wx.getUserInfo, {
                                lang: 'zh_CN',
                            })];
                    case 2:
                        _a = _b.sent(), encryptedData = _a.encryptedData, iv = _a.iv;
                        return [4 /*yield*/, (0, api_1.refreshUserInfo)({
                                code: code,
                                encryptedData: encryptedData,
                                iv: iv,
                                version: (info === null || info === void 0 ? void 0 : info.version) || 'normal'
                            })];
                    case 3:
                        result = _b.sent();
                        (callback === null || callback === void 0 ? void 0 : callback.complete) && callback.complete(result);
                        return [3 /*break*/, 5];
                    case 4:
                        error_12 = _b.sent();
                        (callback === null || callback === void 0 ? void 0 : callback.complete) && callback.complete(handleTrackError('', error_12));
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    //获得wx的地理位置
    SdkWegame.prototype.handleLoacation = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error, result, err_26, error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(wx.getFuzzyLocation)) {
                            error = new Error('wx.getFuzzyLocation not exist');
                            error.code = const_1.COMMON_ERROR_CODE.API_NOT_EXIST;
                            throw error;
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, (0, utils_2.asyncFunc)(wx.getFuzzyLocation, { type: 'wgs84' })];
                    case 2:
                        result = _a.sent();
                        this.locationInfomation = { longitude: result.longitude, latitude: result.latitude };
                        return [2 /*return*/, result];
                    case 3:
                        err_26 = _a.sent();
                        error = new Error((err_26 === null || err_26 === void 0 ? void 0 : err_26.errMsg) || 'wx.getLocation fail');
                        if (err_26 === null || err_26 === void 0 ? void 0 : err_26.errMsg.includes('deny')) {
                            error.code = const_1.COMMON_ERROR_CODE.LOCATION_AUTH_DENY;
                        }
                        else {
                            error.code = const_1.COMMON_ERROR_CODE.LOCATION_FAIL;
                        }
                        throw error;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //获得地理位置授权 (获得地理位置公共方法)
    SdkWegame.prototype.authorizeLocation = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            var authSetting, location_1, location_2, res, openSetting, location_3, error, error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 13, , 14]);
                        return [4 /*yield*/, (0, utils_2.asyncFunc)(wx.getSetting)];
                    case 1:
                        authSetting = (_a.sent()).authSetting;
                        if (!(authSetting['scope.userFuzzyLocation'] === true)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.handleLoacation()];
                    case 2:
                        location_1 = _a.sent();
                        (callback === null || callback === void 0 ? void 0 : callback.complete) && callback.complete({ code: 0, data: location_1 });
                        return [2 /*return*/, location_1];
                    case 3:
                        if (!(authSetting['scope.userFuzzyLocation'] === undefined)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.handleLoacation()];
                    case 4:
                        location_2 = _a.sent();
                        (callback === null || callback === void 0 ? void 0 : callback.complete) && callback.complete({ code: 0, data: location_2 });
                        return [2 /*return*/, location_2];
                    case 5:
                        if (!(authSetting['scope.userFuzzyLocation'] != undefined &&
                            authSetting['scope.userFuzzyLocation'] != true)) return [3 /*break*/, 12];
                        return [4 /*yield*/, (0, utils_2.asyncFunc)(wx.showModal, {
                                title: '是否授权当前位置',
                                content: '需要获取您的地理位置，请确认授权，否则无法相关功能！',
                            })];
                    case 6:
                        res = _a.sent();
                        if (!res.cancel) return [3 /*break*/, 7];
                        wx.showToast({
                            title: '您已拒绝授权!',
                            icon: 'none',
                        });
                        return [3 /*break*/, 11];
                    case 7:
                        if (!res.confirm) return [3 /*break*/, 11];
                        return [4 /*yield*/, (0, utils_2.asyncFunc)(wx.openSetting)];
                    case 8:
                        openSetting = _a.sent();
                        if (!(openSetting.authSetting['scope.userFuzzyLocation'] === true)) return [3 /*break*/, 10];
                        wx.showToast({
                            title: '授权成功!',
                            icon: 'none',
                        });
                        return [4 /*yield*/, this.handleLoacation()];
                    case 9:
                        location_3 = _a.sent();
                        (callback === null || callback === void 0 ? void 0 : callback.complete) && callback.complete({ code: 0, data: location_3 });
                        return [2 /*return*/, location_3];
                    case 10:
                        wx.showToast({
                            title: '授权失败!',
                            icon: 'none',
                        });
                        _a.label = 11;
                    case 11:
                        error = new Error('您已拒绝授权');
                        error.code = const_1.COMMON_ERROR_CODE.LOCATION_AUTH_DENY;
                        throw error;
                    case 12: return [3 /*break*/, 14];
                    case 13:
                        error_13 = _a.sent();
                        // 传了回调函数就不往后透传错误
                        if (callback === null || callback === void 0 ? void 0 : callback.complete) {
                            callback.complete(handleTrackError('', error_13));
                        }
                        else {
                            throw error_13;
                        }
                        return [3 /*break*/, 14];
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    //上报的http接口
    SdkWegame.prototype.reportLocationHttpFun = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, report, error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.authorizeLocation()];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, (0, api_1.reportLocationUpdata)({
                                lon: result.longitude,
                                lat: result.latitude,
                                types: params.types,
                            })];
                    case 2:
                        report = _a.sent();
                        return [2 /*return*/, report];
                    case 3:
                        error_14 = _a.sent();
                        if (callback === null || callback === void 0 ? void 0 : callback.complete) {
                            callback.complete(handleTrackError('', error_14));
                        }
                        else {
                            throw error_14;
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //开始上报经纬度坐标
    SdkWegame.prototype.startReportLoaction = function (params, _a) {
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            var resReport, error_15;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(wegame_1.ReportLoactionCheckParams, { complete: complete }, params)];
                    case 1:
                        _b.sent();
                        if (this.reportLocationTimer != null)
                            return [2 /*return*/];
                        params.reportSpace =
                            params.reportSpace < 30000 || params.reportSpace == undefined ? 30000 : params.reportSpace;
                        return [4 /*yield*/, this.reportLocationHttpFun(params)];
                    case 2:
                        resReport = _b.sent();
                        complete(resReport);
                        this.reportLocationTimer = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.reportLocationHttpFun(params)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }, params.reportSpace);
                        return [3 /*break*/, 4];
                    case 3:
                        error_15 = _b.sent();
                        complete(handleTrackError('', error_15));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //停止上报经纬度
    SdkWegame.prototype.stopReportLocation = function () {
        clearInterval(this.reportLocationTimer);
        this.reportLocationTimer = null;
    };
    //删除经纬度坐标
    SdkWegame.prototype.deleteReportLocation = function (params, _a) {
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            var result, error_16;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(wegame_1.DeleteLoactionCheckParams2, { complete: complete }, params)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, (0, api_1.deleteReportLocation)(params)];
                    case 2:
                        result = _b.sent();
                        complete(result);
                        return [3 /*break*/, 4];
                    case 3:
                        error_16 = _b.sent();
                        complete(handleTrackError('', error_16));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //获得半径内用户
    SdkWegame.prototype.getNearlyPeasonByRadius = function (params, _a) {
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            var location_4, result, error_17;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        location_4 = this.locationInfomation;
                        if (!(location_4 == null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.authorizeLocation()];
                    case 1:
                        location_4 = _b.sent();
                        _b.label = 2;
                    case 2: return [4 /*yield*/, (0, paramsValid_1.pubCheck)(wegame_1.getNearlyRediusCheckParams, { complete: complete }, params)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, (0, api_1.getNearlyPeasonByRadius)(__assign({ lon: location_4.longitude, lat: location_4.latitude }, params))];
                    case 4:
                        result = _b.sent();
                        complete(result);
                        return [3 /*break*/, 6];
                    case 5:
                        error_17 = _b.sent();
                        complete(handleTrackError('', error_17));
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    //大数据上报
    //数据上报
    SdkWegame.prototype.track = function (callback, params) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var getDevicecode_1, devicecode, type, time, uuids, platform_id, copyCpid, product_id, cpid, publicPropskey, publicPropsByCache, publicProps, new_properties, version, reqarr, result, err_27;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(checkConfig_1.checkTrackParams, callback, params)];
                    case 1:
                        _d.sent();
                        getDevicecode_1 = function () {
                            var devicecode = (0, utils_2.customGetStorageSync)('rx_devicecode');
                            if (devicecode) {
                                return devicecode.code;
                            }
                            else {
                                var code = (0, v4_1.default)();
                                (0, utils_2.customSetStorageSync)('rx_devicecode', { code: code, openIds: {} });
                                return code;
                            }
                        };
                        devicecode = getDevicecode_1();
                        type = 'track';
                        time = (0, day_1.formatDate)('YYYY-MM-DDTHH:mm:ss.SSSZ');
                        uuids = (0, v4_1.default)();
                        platform_id = 4;
                        copyCpid = config_1.SYSTEM_INFO.cpid, product_id = config_1.SYSTEM_INFO.productId;
                        cpid = Number(copyCpid);
                        publicPropskey = ((_c = (_b = (_a = this.initConfig) === null || _a === void 0 ? void 0 : _a.event_public_attr) === null || _b === void 0 ? void 0 : _b.public_attr) === null || _c === void 0 ? void 0 : _c[params.event]) || [];
                        publicPropsByCache = (0, utils_2.customGetStorageSync)('rx_public_props');
                        publicProps = (0, is_1.pick)(publicPropsByCache, publicPropskey);
                        console.log('公共属性:', publicProps);
                        new_properties = {};
                        if (config_1.SYSTEM_INFO.region_tag) {
                            new_properties.rx_region_tag = "".concat(config_1.SYSTEM_INFO.region_tag);
                        }
                        if (config_1.SYSTEM_INFO.cp_role_id) {
                            new_properties['#role_id'] = "".concat(config_1.SYSTEM_INFO.cp_role_id);
                        }
                        try {
                            version = config_1.SYSTEM_INFO.miniVersion;
                            if (version) {
                                new_properties['rx_app_info'] = {
                                    version: version
                                };
                            }
                        }
                        catch (e) {
                        }
                        new_properties.st_offset = "".concat(config_1.SYSTEM_INFO.st_offset || '');
                        reqarr = [
                            __assign({ type: type, time: time, uuid: uuids, sub_channel_id: this.subChannelId || '', distinct_id: config_1.USER_INFO.openid, platform_id: platform_id, product_id: product_id, cpid: cpid, channel_id: config_1.SYSTEM_INFO.channelId, devicecode: devicecode }, __assign(__assign({}, params), { properties: __assign(__assign(__assign(__assign({}, new_properties), publicProps), params.properties), this.getDirectAdStatusParams()) })),
                        ];
                        !this.subChannelId || (reqarr[0].sub_channel_id = this.subChannelId);
                        return [4 /*yield*/, (0, api_1.trackApi)(reqarr)];
                    case 2:
                        result = _d.sent();
                        callback.complete(__assign(__assign({}, result), { data: null, msg: 'track success' }));
                        return [3 /*break*/, 4];
                    case 3:
                        err_27 = _d.sent();
                        callback.complete((0, utils_2.handleError)(err_27));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //大数据上报 数据上报 V2
    SdkWegame.prototype.dataTrack = function (callback, params) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var flushIntervalNum, intervalMs, maxCacheCountNum, getDevicecode_2, devicecode, type, time, uuids, platform_id, copyCpid, product_id, cpid, publicPropskey, publicPropsByCache, publicProps, new_properties, version, reqarr, err_28;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(checkConfig_1.checkTrackParams, callback, params)
                            // 如果传递了flushInterval参数，动态更新上报间隔
                            // flushInterval单位是秒，需要转换成毫秒，只能是正整数
                        ];
                    case 1:
                        _d.sent();
                        // 如果传递了flushInterval参数，动态更新上报间隔
                        // flushInterval单位是秒，需要转换成毫秒，只能是正整数
                        if ((params === null || params === void 0 ? void 0 : params.flushInterval) !== undefined) {
                            flushIntervalNum = Number(params.flushInterval);
                            // 检查是否可以转换为有效数字且为正数
                            if (!isNaN(flushIntervalNum) && isFinite(flushIntervalNum) && flushIntervalNum > 0) {
                                intervalMs = Math.round(flushIntervalNum) * 1000;
                                (0, utils_2.updateTrackReportInterval)(intervalMs);
                            }
                            // 如果无法转换或值不符合条件，不更新间隔，使用默认值
                        }
                        // 如果传递了maxCacheCount参数，更新缓存数据上限
                        // maxCacheCount只能是正整数，范围100-1000
                        if ((params === null || params === void 0 ? void 0 : params.maxCacheCount) !== undefined) {
                            maxCacheCountNum = Number(params.maxCacheCount);
                            // 检查是否可以转换为有效数字且为正数
                            if (!isNaN(maxCacheCountNum) && isFinite(maxCacheCountNum) && maxCacheCountNum > 0) {
                                // 四舍五入转换为正整数
                                (0, utils_2.updateMaxCacheCount)(Math.round(maxCacheCountNum));
                            }
                            // 如果无法转换或值不符合条件，不更新，使用默认值
                        }
                        getDevicecode_2 = function () {
                            var devicecode = (0, utils_2.customGetStorageSync)('rx_devicecode');
                            if (devicecode) {
                                return devicecode.code;
                            }
                            else {
                                var code = (0, v4_1.default)();
                                (0, utils_2.customSetStorageSync)('rx_devicecode', { code: code, openIds: {} });
                                return code;
                            }
                        };
                        devicecode = getDevicecode_2();
                        type = ((params === null || params === void 0 ? void 0 : params.type) && this.dataTrackType.includes(params === null || params === void 0 ? void 0 : params.type)) ? params === null || params === void 0 ? void 0 : params.type : 'track';
                        time = (0, day_1.formatDate)('YYYY-MM-DDTHH:mm:ss.SSSZ');
                        uuids = (0, v4_1.default)();
                        platform_id = 4;
                        copyCpid = config_1.SYSTEM_INFO.cpid, product_id = config_1.SYSTEM_INFO.productId;
                        cpid = Number(copyCpid);
                        publicPropskey = ((_c = (_b = (_a = this.initConfig) === null || _a === void 0 ? void 0 : _a.event_public_attr) === null || _b === void 0 ? void 0 : _b.public_attr) === null || _c === void 0 ? void 0 : _c[params.event]) || [];
                        publicPropsByCache = (0, utils_2.customGetStorageSync)('rx_public_props');
                        publicProps = (0, is_1.pick)(publicPropsByCache, publicPropskey);
                        console.log('公共属性:', publicProps);
                        new_properties = {};
                        if (config_1.SYSTEM_INFO.region_tag) {
                            new_properties.rx_region_tag = "".concat(config_1.SYSTEM_INFO.region_tag);
                        }
                        if (config_1.SYSTEM_INFO.cp_role_id) {
                            new_properties['#role_id'] = "".concat(config_1.SYSTEM_INFO.cp_role_id);
                        }
                        try {
                            version = config_1.SYSTEM_INFO.miniVersion;
                            if (version) {
                                new_properties['rx_app_info'] = {
                                    version: version
                                };
                            }
                        }
                        catch (e) {
                        }
                        new_properties.st_offset = "".concat(config_1.SYSTEM_INFO.st_offset || '');
                        reqarr = [
                            __assign({ type: type, time: time, uuid: uuids, sub_channel_id: this.subChannelId || '', distinct_id: config_1.USER_INFO.openid, platform_id: platform_id, product_id: product_id, cpid: cpid, channel_id: config_1.SYSTEM_INFO.channelId, devicecode: devicecode }, __assign(__assign({}, params), { properties: __assign(__assign(__assign(__assign({}, new_properties), publicProps), params.properties), this.getDirectAdStatusParams()) })),
                        ];
                        !this.subChannelId || (reqarr[0].sub_channel_id = this.subChannelId);
                        // let result = await trackApi(reqarr)
                        // 收集reqarr数据，用于后续上报
                        (0, utils_2.saveTrackDataToStorage)(reqarr[0]);
                        // 检查缓存数据是否达到上限，如果达到则立即上报
                        if ((0, utils_2.shouldTriggerImmediateReport)()) {
                            console.log('缓存数据达到上限，触发立即上报');
                            (0, utils_2.triggerImmediateReport)();
                        }
                        callback.complete({ code: 0, data: null, msg: 'trackDelay success' });
                        return [3 /*break*/, 3];
                    case 2:
                        err_28 = _d.sent();
                        callback.complete((0, utils_2.handleError)(err_28));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //内容安全
    SdkWegame.prototype.msgSecCheck = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, err_29;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(wegame_1.msgSecCheck, callback, params)];
                    case 1:
                        _a.sent();
                        params = Object.assign(params, { openid: config_1.USER_INFO.tid, version: 2 });
                        return [4 /*yield*/, (0, api_1.msgSecCheckApi)(params)];
                    case 2:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 4];
                    case 3:
                        err_29 = _a.sent();
                        callback.complete(handleTrackError('', err_29));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // 内容安全 - 异步校验图片/音频是否含有违法违规内容。
    SdkWegame.prototype.mediaCheckAsync = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, err_30;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(wegame_1.mediaCheckAsyncCheck, callback, params)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, api_1.mediaCheckAsyncApi)(params)];
                    case 2:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 4];
                    case 3:
                        err_30 = _a.sent();
                        callback.complete(handleTrackError('', err_30));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 设置公共属性
     * 设置后CP无需每次上报都传，由SDK填入properties中。
     */
    SdkWegame.prototype.setPublicProperties = function (params) {
        if (!(0, is_1.isObject)(params) || Array.isArray(params)) {
            var error = new Error('params must be object');
            error.code = const_1.COMMON_ERROR_CODE.PARAMS_ERROR;
            return handleTrackError('', error);
        }
        try {
            (0, utils_2.customSetStorageSync)('rx_public_props', params);
            return { code: 0 };
        }
        catch (error) {
            return handleTrackError('', error);
        }
    };
    /**
     * 修改设置的公共数据。
     */
    SdkWegame.prototype.updatePublicProperties = function (params) {
        if (!(0, is_1.isObject)(params) || Array.isArray(params)) {
            var error = new Error('params must be object');
            error.code = const_1.COMMON_ERROR_CODE.PARAMS_ERROR;
            return handleTrackError('', error);
        }
        try {
            var cache = (0, utils_2.customGetStorageSync)('rx_public_props');
            (0, utils_2.customSetStorageSync)('rx_public_props', __assign(__assign({}, cache), params));
            return { code: 0 };
        }
        catch (error) {
            return handleTrackError('', error);
        }
    };
    /**
     * 删除公共属性
     */
    SdkWegame.prototype.deletePublicProperties = function (params) {
        if (!Array.isArray(params)) {
            var error = new Error('params must be array');
            error.code = const_1.COMMON_ERROR_CODE.PARAMS_ERROR;
            return handleTrackError('', error);
        }
        try {
            var cache = (0, utils_2.customGetStorageSync)('rx_public_props');
            var rest = (0, is_1.omit)(cache, params);
            (0, utils_2.customSetStorageSync)('rx_public_props', rest);
            return { code: 0 };
        }
        catch (error) {
            return handleTrackError('', error);
        }
    };
    SdkWegame.prototype.getPublicProperties = function () {
        var data = (0, utils_2.customGetStorageSync)("rx_public_props");
        return { code: 0, data: data };
    };
    //公共的解密接口
    SdkWegame.prototype.decryptionDate = function (params, _a) {
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            var sessionOverdue, res, err_31;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        sessionOverdue = function (err) { return __awaiter(_this, void 0, void 0, function () {
                            var result;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!((err === null || err === void 0 ? void 0 : err.code) == 192802 && this.refreshSession < 2)) return [3 /*break*/, 2];
                                        this.refreshSession++;
                                        return [4 /*yield*/, this.refreshSessionFunc()];
                                    case 1:
                                        result = _a.sent();
                                        if (result == 1) {
                                            this.decryptionDate(params, { complete: complete });
                                        }
                                        else {
                                            complete(handleTrackError('', err));
                                        }
                                        return [3 /*break*/, 3];
                                    case 2:
                                        complete(handleTrackError('', err));
                                        _a.label = 3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); };
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, (0, social_1.opendataAesdecodeApi)({ iv: params.iv, encrypted_data: params.encrypted_data })];
                    case 2:
                        res = _b.sent();
                        this.refreshSession = 0;
                        complete(res);
                        return [3 /*break*/, 4];
                    case 3:
                        err_31 = _b.sent();
                        sessionOverdue(err_31);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //获得设备码接口
    SdkWegame.prototype.getUserDeviceCode = function () {
        try {
            var devicecode = (0, utils_2.customGetStorageSync)('rx_devicecode');
            if (devicecode) {
                return { code: 0, data: devicecode.code };
            }
            else {
                var devicecode_1 = (0, v4_1.default)();
                (0, utils_2.customSetStorageSync)('rx_devicecode', { code: devicecode_1, openIds: {} });
                return { code: 0, data: devicecode_1 };
            }
        }
        catch (err) {
            return (0, v4_1.default)();
        }
    };
    SdkWegame.prototype.getHeaders = function () {
        var _a;
        var _b;
        return _a = {},
            _a['ruixue-language'] = 'zh-CN',
            _a['ruixue-cpid'] = config_1.SYSTEM_INFO.cpid,
            _a['ruixue-productid'] = config_1.SYSTEM_INFO.productId,
            _a['ruixue-channelid'] = config_1.SYSTEM_INFO.channelId,
            _a['ruixue-platformid'] = '4',
            _a['ruixue-devicecode'] = getDevicecode(),
            _a['ruixue-version'] = config_1.SYSTEM_INFO.__RX_SDK_VERSION,
            _a['ruixue-traceid'] = (0, v4_1.default)(),
            _a['ruixue-tzoffset'] = config_1.SYSTEM_INFO.timezone + '',
            _a['ruixue-accesstoken'] = (_b = config_1.USER_INFO.token) === null || _b === void 0 ? void 0 : _b.access,
            _a;
    };
    SdkWegame.prototype.initTencentSdk = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
            // 0服务端上报 1客户端上报
            if (((_c = (_b = (_a = _this.initConfig) === null || _a === void 0 ? void 0 : _a.advertise_channel) === null || _b === void 0 ? void 0 : _b.gdt) === null || _c === void 0 ? void 0 : _c.tm) == const_1.TM_TYPE.CLIENT || _this.create_conn) {
                // @ts-ignore
                if (!tencent_sdk && wx.TencentSDK && ((_f = (_e = (_d = _this.initConfig) === null || _d === void 0 ? void 0 : _d.advertise_channel) === null || _e === void 0 ? void 0 : _e.gdt) === null || _f === void 0 ? void 0 : _f.sid)) {
                    var params = {
                        user_action_set_id: Number((_h = (_g = _this.initConfig) === null || _g === void 0 ? void 0 : _g.advertise_channel) === null || _h === void 0 ? void 0 : _h.gdt.sid),
                        secret_key: (_k = (_j = _this.initConfig) === null || _j === void 0 ? void 0 : _j.advertise_channel) === null || _k === void 0 ? void 0 : _k.gdt.sk,
                        appid: (_m = (_l = _this.initConfig) === null || _l === void 0 ? void 0 : _l.advertise_channel) === null || _m === void 0 ? void 0 : _m.gdt.wxid,
                        auto_track: true,
                        on_report_fail: onReportFail
                    };
                    if (config_1.USER_INFO.tid) {
                        params.openid = config_1.USER_INFO.tid;
                    }
                    // @ts-ignore
                    tencent_sdk = new wx.TencentSDK(params);
                    var initResult = tencent_sdk === null || tencent_sdk === void 0 ? void 0 : tencent_sdk.getInitResult();
                    if (initResult && !initResult.inited) {
                        handleTrackError('rxlog_error_ad', __assign(__assign({}, initResult), { message: initResult.initErrMsg, exception: initResult }), undefined, 'rxlog_error_gdt');
                    }
                    setTimeout(function () {
                        resolve(true);
                    }, 100);
                }
                else {
                    resolve(true);
                }
            }
            else {
                resolve(true);
            }
        });
    };
    SdkWegame.prototype.reportAddToFavorites = function (type) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.initTencentSdk()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.reportOrQueueDirectAdGdtEvent(function () {
                                console.log('on_add_to_wishlist', type);
                                handleGdtTrackResult(tencent_sdk === null || tencent_sdk === void 0 ? void 0 : tencent_sdk.track('ADD_TO_WISHLIST', {
                                    type: type,
                                }));
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SdkWegame.prototype.reportShareAppMessage = function (target) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.initTencentSdk()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.reportOrQueueDirectAdGdtEvent(function () {
                                console.log('on_share', target);
                                handleGdtTrackResult(tencent_sdk === null || tencent_sdk === void 0 ? void 0 : tencent_sdk.track('SHARE', {
                                    target: target,
                                }));
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SdkWegame.prototype.reportPurchase = function (amount, needReportMidas) {
        if (needReportMidas === void 0) { needReportMidas = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!needReportMidas) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._reportPurchase(amount)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    SdkWegame.prototype._reportPurchase = function (amount) {
        return __awaiter(this, void 0, void 0, function () {
            var e_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.initTencentSdk()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.reportOrQueueDirectAdGdtEvent(function () {
                                handleGdtTrackResult(tencent_sdk === null || tencent_sdk === void 0 ? void 0 : tencent_sdk.onPurchase(amount));
                            })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_10 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SdkWegame.prototype.compareVersions = function (version1, version2) {
        // 将版本号字符串按 . 分割成数组
        var v1Parts = version1.replace('v', '').split('.').map(Number);
        var v2Parts = version2.replace('v', '').split('.').map(Number);
        // 获取两个版本号数组的最大长度
        var maxLength = Math.max(v1Parts.length, v2Parts.length);
        // 逐位比较版本号
        for (var i = 0; i < maxLength; i++) {
            // 如果某个版本号数组已经遍历完，对应位置的值视为 0
            var num1 = i < v1Parts.length ? v1Parts[i] : 0;
            var num2 = i < v2Parts.length ? v2Parts[i] : 0;
            if (num1 > num2) {
                return 1; // version1 大于 version2
            }
            else if (num1 < num2) {
                return -1; // version1 小于 version2
            }
            // 如果当前位相等，继续比较下一位
        }
        return 0; // 两个版本号相等
    };
    SdkWegame.prototype.getOrderStatus = function (order_nos) {
        return __awaiter(this, void 0, void 0, function () {
            var res, e_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, api_1.getOrderStatusApi)(order_nos)];
                    case 1:
                        res = _a.sent();
                        console.info(res);
                        return [3 /*break*/, 3];
                    case 2:
                        e_11 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SdkWegame.prototype.reportPurchaseByCache = function () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __awaiter(this, void 0, void 0, function () {
            var rx_cache_order, uniqueOrders, MAX_PROCESS_COUNT, ordersToProcess, remainingOrders, _i, ordersToProcess_1, order, res, error_18, e_12;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        _j.trys.push([0, 8, 9, 10]);
                        if (!this.isSupportGDTReport)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.initTencentSdk()];
                    case 1:
                        _j.sent();
                        rx_cache_order = (0, utils_2.customGetStorageSync)("rx_cache_order_price") || [];
                        // 验证数据格式并限制处理数量，防止死循环
                        if (!rx_cache_order || !Array.isArray(rx_cache_order) || rx_cache_order.length === 0) {
                            // removeStorageSync('rx_cache_order_price')
                            return [2 /*return*/];
                        }
                        uniqueOrders = (_a = rx_cache_order === null || rx_cache_order === void 0 ? void 0 : rx_cache_order.filter) === null || _a === void 0 ? void 0 : _a.call(rx_cache_order, function (order, index, self) {
                            return index === (self === null || self === void 0 ? void 0 : self.findIndex(function (t) { return (t === null || t === void 0 ? void 0 : t.order_nos) === (order === null || order === void 0 ? void 0 : order.order_nos); }));
                        });
                        MAX_PROCESS_COUNT = 5;
                        ordersToProcess = (_b = uniqueOrders === null || uniqueOrders === void 0 ? void 0 : uniqueOrders.slice) === null || _b === void 0 ? void 0 : _b.call(uniqueOrders, 0, MAX_PROCESS_COUNT);
                        remainingOrders = [];
                        _i = 0, ordersToProcess_1 = ordersToProcess;
                        _j.label = 2;
                    case 2:
                        if (!(_i < ordersToProcess_1.length)) return [3 /*break*/, 7];
                        order = ordersToProcess_1[_i];
                        // 验证订单数据格式，防止无效数据导致错误
                        if (!order || typeof order !== 'object' || !(order === null || order === void 0 ? void 0 : order.order_nos) || !(order === null || order === void 0 ? void 0 : order.price)) {
                            // 无效数据不保留，直接丢弃
                            return [3 /*break*/, 6];
                        }
                        _j.label = 3;
                    case 3:
                        _j.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, (0, api_1.getOrderStatusApi)(order === null || order === void 0 ? void 0 : order.order_nos)
                            // 订单支付成功
                        ];
                    case 4:
                        res = _j.sent();
                        // 订单支付成功
                        if (res && (res === null || res === void 0 ? void 0 : res.code) === 0 && ((_c = res === null || res === void 0 ? void 0 : res.data) === null || _c === void 0 ? void 0 : _c.status) && ((_d = res === null || res === void 0 ? void 0 : res.data) === null || _d === void 0 ? void 0 : _d.status) > 1) {
                            try {
                                this._reportPurchase(order === null || order === void 0 ? void 0 : order.price);
                                // 支付成功，不添加到保留数组中（即从缓存中移除）
                            }
                            catch (reportError) {
                                // 上报失败不影响其他订单处理，但保留当前订单
                                (_e = remainingOrders === null || remainingOrders === void 0 ? void 0 : remainingOrders.push) === null || _e === void 0 ? void 0 : _e.call(remainingOrders, order);
                            }
                        }
                        else {
                            // 支付未成功，保留订单
                            if (res && (res === null || res === void 0 ? void 0 : res.code) !== 101) {
                                (_f = remainingOrders === null || remainingOrders === void 0 ? void 0 : remainingOrders.push) === null || _f === void 0 ? void 0 : _f.call(remainingOrders, order);
                            }
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        error_18 = _j.sent();
                        // 查询失败，保留在数组中（单个订单失败不影响其他订单）
                        (_g = remainingOrders === null || remainingOrders === void 0 ? void 0 : remainingOrders.push) === null || _g === void 0 ? void 0 : _g.call(remainingOrders, order);
                        return [3 /*break*/, 6];
                    case 6:
                        _i++;
                        return [3 /*break*/, 2];
                    case 7:
                        // 保存剩余数据，添加容错处理
                        try {
                            if ((remainingOrders === null || remainingOrders === void 0 ? void 0 : remainingOrders.length) > 0) {
                                // 有剩余订单数据，保留剩余数据
                                console.info('有剩余订单数据，保留剩余数据', remainingOrders);
                                (0, utils_2.customSetStorageSync)('rx_cache_order_price', (_h = remainingOrders === null || remainingOrders === void 0 ? void 0 : remainingOrders.slice) === null || _h === void 0 ? void 0 : _h.call(remainingOrders, 0, MAX_PROCESS_COUNT));
                            }
                            else {
                                // 如果没有剩余数据，清除缓存
                                (0, utils_2.removeStorageSync)('rx_cache_order_price');
                            }
                        }
                        catch (saveError) {
                            // 保存失败不影响其他功能，只记录日志
                            console.info('保存缓存订单失败', saveError);
                        }
                        return [3 /*break*/, 10];
                    case 8:
                        e_12 = _j.sent();
                        // 外层异常捕获，确保不影响其他功能
                        console.info('reportPurchaseByCache 执行异常', e_12);
                        return [3 /*break*/, 10];
                    case 9: return [7 /*endfinally*/];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    SdkWegame.prototype.reportRegister = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.reportOrQueueDirectAdGdtEvent(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.initTencentSdk()];
                                    case 1:
                                        _a.sent();
                                        console.log('on_register');
                                        handleGdtTrackResult(tencent_sdk === null || tencent_sdk === void 0 ? void 0 : tencent_sdk.onRegister());
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SdkWegame.prototype.reportGdtLogin = function (openid) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.reportOrQueueDirectAdGdtEvent(function () {
                            console.log('set_open_id:', openid);
                            handleGdtTrackResult(tencent_sdk === null || tencent_sdk === void 0 ? void 0 : tencent_sdk.setOpenId(openid));
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SdkWegame.prototype.reportGdt = function (key, object) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.initTencentSdk()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.reportOrQueueDirectAdGdtEvent(function () {
                                if (object) {
                                    handleGdtTrackResult(tencent_sdk === null || tencent_sdk === void 0 ? void 0 : tencent_sdk.track(key, object));
                                }
                                else {
                                    handleGdtTrackResult(tencent_sdk === null || tencent_sdk === void 0 ? void 0 : tencent_sdk.track(key));
                                }
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SdkWegame.prototype.reportCreateRole = function (role_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.initTencentSdk()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.reportOrQueueDirectAdGdtEvent(function () {
                                console.log('on_create_role:', role_id);
                                handleGdtTrackResult(tencent_sdk === null || tencent_sdk === void 0 ? void 0 : tencent_sdk.onCreateRole(role_id));
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SdkWegame.prototype.reportTutorialFinish = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.initTencentSdk()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.reportOrQueueDirectAdGdtEvent(function () {
                                console.log('on_tutorial_finish');
                                handleGdtTrackResult(tencent_sdk === null || tencent_sdk === void 0 ? void 0 : tencent_sdk.onTutorialFinish());
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SdkWegame.prototype.reportReActive = function (back_flow_day) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.reportOrQueueDirectAdGdtEvent(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.initTencentSdk()];
                                    case 1:
                                        _a.sent();
                                        console.log('on_re_active:', back_flow_day);
                                        handleGdtTrackResult(tencent_sdk === null || tencent_sdk === void 0 ? void 0 : tencent_sdk.track('RE_ACTIVE', { backFlowDay: back_flow_day }));
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SdkWegame.prototype.reportUpdateLevel = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.initTencentSdk()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.reportOrQueueDirectAdGdtEvent(function () {
                                console.log('on_update_level:', data);
                                handleGdtTrackResult(tencent_sdk === null || tencent_sdk === void 0 ? void 0 : tencent_sdk.track('UPDATE_LEVEL', data));
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SdkWegame.prototype.reportViewContent = function (item) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.initTencentSdk()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.reportOrQueueDirectAdGdtEvent(function () {
                                console.log('on_view_content:', item);
                                handleGdtTrackResult(tencent_sdk === null || tencent_sdk === void 0 ? void 0 : tencent_sdk.track('VIEW_CONTENT', {
                                    // 关键场景访问：商城
                                    item: item
                                }));
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SdkWegame.prototype.initWebSocket = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                (0, api_1.getAdSourceApi)().then(function (ad_source) { return __awaiter(_this, void 0, void 0, function () {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                    return __generator(this, function (_l) {
                        this.create_conn = ((_a = ad_source === null || ad_source === void 0 ? void 0 : ad_source.data) === null || _a === void 0 ? void 0 : _a.create_conn) || false;
                        console.log('服务端上报，连接websocket，create_conn：', this.create_conn);
                        if (((_b = ad_source === null || ad_source === void 0 ? void 0 : ad_source.data) === null || _b === void 0 ? void 0 : _b.create_conn) && ((_e = (_d = (_c = this.initConfig) === null || _c === void 0 ? void 0 : _c.advertise_channel) === null || _d === void 0 ? void 0 : _d.gdt) === null || _e === void 0 ? void 0 : _e.sid) && ((_h = (_g = (_f = this.initConfig) === null || _f === void 0 ? void 0 : _f.websocket) === null || _g === void 0 ? void 0 : _g.ws_list) === null || _h === void 0 ? void 0 : _h.length)) {
                            this.socket_index = 0;
                            this.socket_ws_list = (_k = (_j = this.initConfig) === null || _j === void 0 ? void 0 : _j.websocket) === null || _k === void 0 ? void 0 : _k.ws_list;
                            this.socket_connect_number = 1;
                            this.reconnecting = false;
                            this.no_more_reconnection = false;
                            this.connectWebSocket();
                        }
                        return [2 /*return*/];
                    });
                }); }).catch(function (e) {
                    console.log(e);
                });
                return [2 /*return*/];
            });
        });
    };
    // 连接WebSocket服务器
    SdkWegame.prototype.connectWebSocket = function () {
        var _this = this;
        // WebSocket已设置断开不再重连，后续不做处理
        if (this.no_more_reconnection) {
            console.log('WebSocket已设置断开不再重连');
            return;
        }
        // WebSocket连接次数已到20次，后续不做处理
        if (this.socket_connect_number > this.MAX_CONNECT_NUMBER) {
            console.log('WebSocket连接次数已到20次');
            return;
        }
        var socket_header = this.getHeaders();
        var socket_url = this.socket_ws_list[this.socket_index];
        console.log('WebSocket连接次数：', this.socket_connect_number);
        console.log('WebSocket连接参数：', {
            socket_url: socket_url,
            socket_header: socket_header
        });
        this.no_more_reconnection = false;
        this.socket_task = wx.connectSocket({
            url: socket_url,
            header: socket_header,
            success: function (res) {
                console.log('WebSocket连接创建成功：', res);
            },
            fail: function () { }
        });
        // 监听WebSocket连接打开事件
        this.socket_task.onOpen(function (res) {
            console.log('WebSocket连接打开：', res);
            // 开启心跳检测
            _this.startHeartbeat();
        });
        // 监听WebSocket连接错误事件
        this.socket_task.onError(function (err) {
            console.log('WebSocket连接错误：', err);
            _this.reconnectWebSocket(err);
        });
        // 监听WebSocket连接关闭事件
        this.socket_task.onClose(function (err) {
            console.log('WebSocket连接已关闭：', err);
            // WebSocket已设置断开不再重连，后续不做处理
            if (_this.no_more_reconnection) {
                console.log('WebSocket已设置断开不再重连');
                return;
            }
            _this.reconnectWebSocket(err, false);
        });
        // 监听WebSocket接收到消息事件
        this.socket_task.onMessage(function (res) { return __awaiter(_this, void 0, void 0, function () {
            var data_1, uuid, _a, e_13;
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 22, , 23]);
                        data_1 = arrayBufferToJson(res.data);
                        console.log('收到服务端消息data：', data_1);
                        if (!((data_1 === null || data_1 === void 0 ? void 0 : data_1.msg_type) === 1)) return [3 /*break*/, 20];
                        uuid = data_1.uuid;
                        console.log('收到服务端消息uuid：', uuid, (0, utils_2.customGetStorageSync)('rx_socket_uuid'));
                        if (!['start', 're_active', 'tutorial_finish', 'pay', 'register'].includes((_b = data_1.body) === null || _b === void 0 ? void 0 : _b.event)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.initTencentSdk()];
                    case 1:
                        _d.sent();
                        _d.label = 2;
                    case 2:
                        if (!((0, utils_2.customGetStorageSync)('rx_socket_uuid') != uuid)) return [3 /*break*/, 18];
                        _a = (_c = data_1.body) === null || _c === void 0 ? void 0 : _c.event;
                        switch (_a) {
                            case 'start': return [3 /*break*/, 3];
                            case 're_active': return [3 /*break*/, 5];
                            case 'tutorial_finish': return [3 /*break*/, 7];
                            case 'pay': return [3 /*break*/, 9];
                            case 'register': return [3 /*break*/, 11];
                            case 'create_game_role': return [3 /*break*/, 13];
                        }
                        return [3 /*break*/, 15];
                    case 3: return [4 /*yield*/, this.reportOrQueueDirectAdGdtEvent(function () {
                            handleGdtTrackResult(tencent_sdk === null || tencent_sdk === void 0 ? void 0 : tencent_sdk.onAppStart());
                        })];
                    case 4:
                        _d.sent();
                        this.socketTaskSend('on_app_start');
                        return [3 /*break*/, 17];
                    case 5: return [4 /*yield*/, this.reportOrQueueDirectAdGdtEvent(function () {
                            var _a, _b;
                            handleGdtTrackResult(tencent_sdk === null || tencent_sdk === void 0 ? void 0 : tencent_sdk.track('RE_ACTIVE', { backFlowDay: parseInt((_b = (_a = data_1.body) === null || _a === void 0 ? void 0 : _a.info) === null || _b === void 0 ? void 0 : _b.back_flow_day) }));
                        })];
                    case 6:
                        _d.sent();
                        this.socketTaskSend('on_re_active');
                        return [3 /*break*/, 17];
                    case 7: return [4 /*yield*/, this.reportOrQueueDirectAdGdtEvent(function () {
                            handleGdtTrackResult(tencent_sdk === null || tencent_sdk === void 0 ? void 0 : tencent_sdk.onTutorialFinish());
                        })];
                    case 8:
                        _d.sent();
                        this.socketTaskSend('on_tutorial_finish');
                        return [3 /*break*/, 17];
                    case 9: return [4 /*yield*/, this.reportOrQueueDirectAdGdtEvent(function () {
                            var _a, _b;
                            handleGdtTrackResult(tencent_sdk === null || tencent_sdk === void 0 ? void 0 : tencent_sdk.onPurchase(parseInt((_b = (_a = data_1.body) === null || _a === void 0 ? void 0 : _a.info) === null || _b === void 0 ? void 0 : _b.amount)));
                        })];
                    case 10:
                        _d.sent();
                        this.socketTaskSend('on_purchase');
                        return [3 /*break*/, 17];
                    case 11: return [4 /*yield*/, this.reportOrQueueDirectAdGdtEvent(function () {
                            handleGdtTrackResult(tencent_sdk === null || tencent_sdk === void 0 ? void 0 : tencent_sdk.onRegister());
                        })];
                    case 12:
                        _d.sent();
                        this.socketTaskSend('on_register');
                        return [3 /*break*/, 17];
                    case 13: return [4 /*yield*/, this.reportOrQueueDirectAdGdtEvent(function () {
                            var _a, _b;
                            handleGdtTrackResult(tencent_sdk === null || tencent_sdk === void 0 ? void 0 : tencent_sdk.onCreateRole((_b = (_a = data_1.body) === null || _a === void 0 ? void 0 : _a.info) === null || _b === void 0 ? void 0 : _b.role_id));
                        })];
                    case 14:
                        _d.sent();
                        this.socketTaskSend('create_game_role');
                        return [3 /*break*/, 17];
                    case 15:
                        this.socketTaskSend('on_other_event');
                        return [4 /*yield*/, this.reportOrQueueDirectAdGdtEvent(function () {
                                var _a, _b;
                                handleGdtTrackResult(tencent_sdk === null || tencent_sdk === void 0 ? void 0 : tencent_sdk.track((_a = data_1.body) === null || _a === void 0 ? void 0 : _a.event, (_b = data_1.body) === null || _b === void 0 ? void 0 : _b.info));
                            })];
                    case 16:
                        _d.sent();
                        _d.label = 17;
                    case 17: return [3 /*break*/, 19];
                    case 18:
                        this.socketTaskSend('on_not_handled');
                        _d.label = 19;
                    case 19:
                        (0, utils_2.customSetStorageSync)('rx_socket_uuid', uuid);
                        return [3 /*break*/, 21];
                    case 20:
                        if ((data_1 === null || data_1 === void 0 ? void 0 : data_1.msg_type) === -1) {
                            this.socketTaskSend('on_close');
                            this.disconnectWebSocket();
                        }
                        _d.label = 21;
                    case 21: return [3 /*break*/, 23];
                    case 22:
                        e_13 = _d.sent();
                        console.log(e_13);
                        return [3 /*break*/, 23];
                    case 23: return [2 /*return*/];
                }
            });
        }); });
    };
    // 开启心跳检测
    SdkWegame.prototype.startHeartbeat = function () {
        var _this = this;
        clearTimeout(this.heartbeat_timer);
        this.heartbeat_timer = setInterval(function () {
            _this.socket_task.send({
                data: JSON.stringify({
                    msg_type: 1000,
                    msg: 'on_heartbeat'
                })
            });
            console.log('on_heartbeat');
        }, this.HEARTBEAT_INTERVAL);
    };
    // 断开存在的WebSocket连接
    SdkWegame.prototype.disconnectWebSocket = function (no_more_reconnection) {
        if (no_more_reconnection === void 0) { no_more_reconnection = true; }
        this.no_more_reconnection = no_more_reconnection;
        clearTimeout(this.heartbeat_timer);
        try {
            if (this.socket_task) {
                this.socket_task.close();
            }
        }
        catch (e) {
            console.log(e);
        }
    };
    // 断开WebSocket后主动重连
    SdkWegame.prototype.activeWebSocket = function () {
        if (!this.no_more_reconnection) {
            return;
        }
        console.log('断开WebSocket后主动重连');
        this.no_more_reconnection = false;
        this.connectWebSocket();
    };
    SdkWegame.prototype.reconnectWebSocket = function (err, plus_socket_index) {
        var _this = this;
        if (plus_socket_index === void 0) { plus_socket_index = true; }
        // 如果重连中，不做处理
        if (this.reconnecting) {
            return;
        }
        // socket正在发起重连中
        this.reconnecting = true;
        // 关闭心跳检测定时器
        clearInterval(this.heartbeat_timer);
        // 连接失败后可以设置重试机制，比如延迟一段时间后重新连接
        setTimeout(function () {
            console.log('尝试重新连接WebSocket...');
            if (plus_socket_index) {
                // 连接游标加一，如果游标越界则上报
                _this.socket_index++;
                if (_this.socket_index > _this.socket_ws_list.length - 1) {
                    _this.track({
                        complete: function (data) {
                            console.info(data);
                        },
                    }, (0, utils_2.formatTrackParams)({
                        eventName: 'wssFail',
                        apiName: 'connectWebSocket',
                        errorInfo: err,
                        loginInfo: config_1.USER_INFO,
                    }));
                    return;
                }
            }
            // socket连接次数加一
            _this.socket_connect_number++;
            // 重新发起连接
            _this.connectWebSocket();
            // socket已发起重连
            _this.reconnecting = false;
        }, this.RECONNECT_INTERVAL);
    };
    // 通知服务端当前消息已处理
    SdkWegame.prototype.socketTaskSend = function (msg) {
        if (msg === void 0) { msg = ''; }
        console.log(msg);
        this.socket_task.send({
            data: JSON.stringify({
                msg_type: 99,
                msg: msg
            })
        });
    };
    // 调起客户端订阅消息界面
    SdkWegame.prototype.requestSubscribeMessage = function (params, callback) {
        console.log('tmplIds', params.tmplIds);
        wx.requestSubscribeMessage({
            tmplIds: params.tmplIds,
            success: function (res) {
                console.log(res);
                var errMsg = res.errMsg, _template_map = __rest(res, ["errMsg"]);
                wx.getSetting({
                    withSubscriptions: true,
                    success: function (res) {
                        var _a;
                        console.log(res);
                        var template_map = __assign(__assign({}, _template_map), (((_a = res.subscriptionsSetting) === null || _a === void 0 ? void 0 : _a.itemSettings) || {}));
                        (0, api_1.requestSubscribeMessageApi)({
                            rx_open_id: config_1.USER_INFO.openid,
                            template_map: template_map
                        }).then(function () {
                            callback && callback.complete({
                                code: 0,
                                data: template_map
                            });
                        }).catch(function (err) {
                            callback && callback.complete(handleTrackError('', err));
                        });
                    },
                    fail: function (err) {
                        callback && callback.complete(handleTrackError('', err));
                    }
                });
            },
            fail: function (err) {
                callback && callback.complete(handleTrackError('', err));
            }
        });
    };
    // 游戏区服信息查询
    SdkWegame.prototype.getGameArea = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_19;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, api_1.getGameAreaApi)(params.area_id)];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_19 = _a.sent();
                        callback.complete((0, utils_2.handleError)(error_19));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 游戏区服信息修改
    SdkWegame.prototype.putGameArea = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_20;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, api_1.putGameAreaApi)(params)];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_20 = _a.sent();
                        callback.complete((0, utils_2.handleError)(error_20));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 创建游戏区服
    SdkWegame.prototype.createGameArea = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_21;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, api_1.createGameAreaApi)(params)];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_21 = _a.sent();
                        callback.complete((0, utils_2.handleError)(error_21));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 删除游戏区服
    SdkWegame.prototype.delGameArea = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_22;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, api_1.delGameAreaApi)(params)];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_22 = _a.sent();
                        callback.complete((0, utils_2.handleError)(error_22));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 查询区服列表信息
    SdkWegame.prototype.getGameAreaList = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_23;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, api_1.getGameAreaListApi)()];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_23 = _a.sent();
                        callback.complete((0, utils_2.handleError)(error_23));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 创建角色
    SdkWegame.prototype.createGameCharacter = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, e_14, error_24;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, (0, api_1.createGameCharacterApi)(__assign(__assign({}, params), { rx_openid: params.rx_openid || config_1.USER_INFO.openid }))];
                    case 1:
                        result = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.reportCreateRole(params.character_id)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_14 = _a.sent();
                        console.log(e_14);
                        return [3 /*break*/, 5];
                    case 5:
                        callback.complete(result);
                        return [3 /*break*/, 7];
                    case 6:
                        error_24 = _a.sent();
                        callback.complete((0, utils_2.handleError)(error_24));
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    // 修改游戏角色信息
    SdkWegame.prototype.putGameCharacter = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, extension, rest, e_15, error_25;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, (0, api_1.putGameCharacterApi)(__assign(__assign({}, params), { rx_openid: params.rx_openid || config_1.USER_INFO.openid }))];
                    case 1:
                        result = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        extension = params.extension, rest = __rest(params, ["extension"]);
                        if (!(params.character_level || params.character_vip_level)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.reportUpdateLevel(__assign(__assign({}, rest), { rx_openid: params.rx_openid || config_1.USER_INFO.openid }))];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        e_15 = _a.sent();
                        console.log(e_15);
                        return [3 /*break*/, 6];
                    case 6:
                        callback.complete(result);
                        return [3 /*break*/, 8];
                    case 7:
                        error_25 = _a.sent();
                        callback.complete((0, utils_2.handleError)(error_25));
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    // 删除游戏角色
    SdkWegame.prototype.delGameCharacter = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_26;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, api_1.delGameCharacterApi)(params)];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_26 = _a.sent();
                        callback.complete((0, utils_2.handleError)(error_26));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 查询账号下角色信息列表
    SdkWegame.prototype.getGameCharacterAccount = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_27;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, api_1.getGameCharacterAccountApi)(params)];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_27 = _a.sent();
                        callback.complete((0, utils_2.handleError)(error_27));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 查询账号下某个区服下的角色信息列表
    SdkWegame.prototype.getGameCharacter = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_28;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, api_1.getGameCharacterApi)(params)];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_28 = _a.sent();
                        callback.complete((0, utils_2.handleError)(error_28));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 查询具体角色信息
    SdkWegame.prototype.getGameAccountAreaCharacter = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_29;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, api_1.getGameAccountAreaCharacterApi)(params)];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_29 = _a.sent();
                        callback.complete((0, utils_2.handleError)(error_29));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 邮件列表
    SdkWegame.prototype.getEmailList = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_30;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, api_1.getEmailListApi)(params)];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_30 = _a.sent();
                        callback.complete((0, utils_2.handleError)(error_30));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 邮件详情
    SdkWegame.prototype.getEmailDetail = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_31;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, api_1.getEmailDetailApi)(params)];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_31 = _a.sent();
                        callback.complete((0, utils_2.handleError)(error_31));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 邮件领取
    SdkWegame.prototype.receiveEmail = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_32;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, api_1.receiveEmailApi)(params)];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_32 = _a.sent();
                        callback.complete((0, utils_2.handleError)(error_32));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 邮件删除
    SdkWegame.prototype.delEmail = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_33;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, api_1.delEmailApi)(params)];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_33 = _a.sent();
                        callback.complete((0, utils_2.handleError)(error_33));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SdkWegame.prototype.getDynamicShareActivityId = function (callback) {
        var query = (0, utils_1.getSearchQueries)();
        return query.activityId;
    };
    SdkWegame.prototype.setDynamicShareMsg = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var checkParams, parameter_list, result, error_34;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        checkParams = {
                            target_state: {
                                type: 'enum',
                                required: true,
                                enum: [0, 1],
                            },
                            activity_id: {
                                type: 'string',
                                required: true,
                            },
                            member_count: {
                                type: 'number',
                                required: params.target_state === 0,
                            },
                            room_limit: {
                                type: 'number',
                                required: params.target_state === 0,
                            },
                            version_type: {
                                type: 'enum',
                                required: params.target_state === 1,
                                enum: ['develop', 'trial', 'release'],
                            }
                        };
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(checkParams, callback, params)];
                    case 1:
                        _a.sent();
                        if (params.target_state == 0 && params.member_count > params.room_limit) {
                            throw Error('room_limit 不可小于 member_count');
                        }
                        parameter_list = [];
                        if (params.member_count) {
                            parameter_list.push({
                                name: 'member_count',
                                value: "".concat(params.member_count)
                            });
                        }
                        if (params.room_limit) {
                            parameter_list.push({
                                name: 'room_limit',
                                value: "".concat(params.room_limit)
                            });
                        }
                        if (params.target_state === 1) {
                            parameter_list.push({
                                name: 'path',
                                value: params.path || '?foo=bar'
                            });
                        }
                        if (params.version_type) {
                            parameter_list.push({
                                name: 'version_type',
                                value: params.version_type
                            });
                        }
                        return [4 /*yield*/, (0, api_1.setDynamicMsgApi)({
                                activity_id: params.activity_id,
                                target_state: params.target_state,
                                template_info: {
                                    parameter_list: parameter_list
                                }
                            })];
                    case 2:
                        result = _a.sent();
                        callback.complete(__assign(__assign({}, result), { msg: result.msg || result.message }));
                        return [3 /*break*/, 4];
                    case 3:
                        error_34 = _a.sent();
                        callback.complete((0, utils_2.handleError)(error_34));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SdkWegame.prototype.createActivityId = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var reqParam, result, err_32;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        reqParam = {};
                        if (params.isPrivateMessage) {
                            reqParam.openid = config_1.USER_INFO.tid;
                        }
                        return [4 /*yield*/, (0, api_1.createActivityIdApi)(reqParam)];
                    case 1:
                        result = _a.sent();
                        callback.complete(__assign(__assign({}, result), { msg: result.msg || result.message }));
                        return [3 /*break*/, 3];
                    case 2:
                        err_32 = _a.sent();
                        callback.complete((0, utils_2.handleError)(err_32));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SdkWegame.prototype.dynamicShare = function (params, callback) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2;
        return __awaiter(this, void 0, void 0, function () {
            var key, key_2, checkParams, shareData_5, onHide_3, onShow_4, query, error_35;
            var _this = this;
            return __generator(this, function (_3) {
                switch (_3.label) {
                    case 0:
                        key = Date.now() + '';
                        for (key_2 in showMap) {
                            try {
                                wx.offShow(showMap[key_2]);
                            }
                            catch (e) {
                                console.log(e);
                            }
                        }
                        _3.label = 1;
                    case 1:
                        _3.trys.push([1, 4, , 5]);
                        checkParams = {
                            activity_id: {
                                type: 'string',
                                required: true,
                            },
                            member_count: {
                                type: 'number',
                                required: true,
                            },
                            room_limit: {
                                type: 'number',
                                required: true,
                            }
                        };
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(checkParams, callback, params)];
                    case 2:
                        _3.sent();
                        return [4 /*yield*/, this.getShareData(params, callback, true)];
                    case 3:
                        shareData_5 = _3.sent();
                        if (params.member_count > params.room_limit) {
                            throw Error('room_limit 不可小于 member_count');
                        }
                        wx.updateShareMenu({
                            withShareTicket: params.withShareTicket || true,
                            isUpdatableMessage: true,
                            activityId: params.activity_id,
                            templateInfo: {
                                parameterList: [{
                                        name: 'member_count',
                                        value: "".concat(params.member_count)
                                    }, {
                                        name: 'room_limit',
                                        value: "".concat(params.room_limit)
                                    }]
                            }
                        });
                        console.log('sdk getShareData:', shareData_5);
                        onHide_3 = function () {
                            wx.offHide(onHide_3);
                        };
                        onShow_4 = function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                wx.offShow(onShow_4);
                                callback.complete(shareData_5);
                                return [2 /*return*/];
                            });
                        }); };
                        query = utils_2.qs.stringify({
                            type: 'rx',
                            user_source: 'share',
                            activityId: params.activity_id,
                            platform: ((_a = shareData_5 === null || shareData_5 === void 0 ? void 0 : shareData_5.data) === null || _a === void 0 ? void 0 : _a.platform) || '',
                            transmits: encodeURIComponent((params === null || params === void 0 ? void 0 : params.transmits) || ''),
                            landing_id: ((_c = (_b = shareData_5 === null || shareData_5 === void 0 ? void 0 : shareData_5.data) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.landing_id) || '',
                            trigger_id: ((_e = (_d = shareData_5 === null || shareData_5 === void 0 ? void 0 : shareData_5.data) === null || _d === void 0 ? void 0 : _d.trigger) === null || _e === void 0 ? void 0 : _e.id) || '',
                            trigger_tag: ((_g = (_f = shareData_5 === null || shareData_5 === void 0 ? void 0 : shareData_5.data) === null || _f === void 0 ? void 0 : _f.trigger) === null || _g === void 0 ? void 0 : _g.tag) || '',
                            trigger_type: ((_j = (_h = shareData_5 === null || shareData_5 === void 0 ? void 0 : shareData_5.data) === null || _h === void 0 ? void 0 : _h.trigger) === null || _j === void 0 ? void 0 : _j.type) || '',
                            material_type: ((_l = (_k = shareData_5 === null || shareData_5 === void 0 ? void 0 : shareData_5.data) === null || _k === void 0 ? void 0 : _k.content) === null || _l === void 0 ? void 0 : _l.material_type) || '',
                            material_id: ((_o = (_m = shareData_5 === null || shareData_5 === void 0 ? void 0 : shareData_5.data) === null || _m === void 0 ? void 0 : _m.content) === null || _o === void 0 ? void 0 : _o.material_id) || '',
                            strategy_type: ((_q = (_p = shareData_5 === null || shareData_5 === void 0 ? void 0 : shareData_5.data) === null || _p === void 0 ? void 0 : _p.strategy) === null || _q === void 0 ? void 0 : _q.type) || '',
                            strategy_id: ((_s = (_r = shareData_5 === null || shareData_5 === void 0 ? void 0 : shareData_5.data) === null || _r === void 0 ? void 0 : _r.strategy) === null || _s === void 0 ? void 0 : _s.id) || '',
                            material_name: ((_u = (_t = shareData_5 === null || shareData_5 === void 0 ? void 0 : shareData_5.data) === null || _t === void 0 ? void 0 : _t.content) === null || _u === void 0 ? void 0 : _u.title) || '',
                            trigger_name: ((_w = (_v = shareData_5 === null || shareData_5 === void 0 ? void 0 : shareData_5.data) === null || _v === void 0 ? void 0 : _v.trigger) === null || _w === void 0 ? void 0 : _w.title) || '',
                            strategy_name: ((_y = (_x = shareData_5 === null || shareData_5 === void 0 ? void 0 : shareData_5.data) === null || _x === void 0 ? void 0 : _x.strategy) === null || _y === void 0 ? void 0 : _y.name) || '',
                            share_time: Math.floor(new Date().getTime() / 1000),
                            share_type: 'mini',
                            inviter_region: config_1.USER_INFO.region || '',
                            inviter_openid: config_1.USER_INFO.openid || '',
                            inviter_productid: config_1.SYSTEM_INFO.productId,
                            inviter_channelid: config_1.SYSTEM_INFO.channelId,
                            inviter_subchannelid: this.subChannelId || '',
                        });
                        query = params.query ? "".concat(query, "&").concat(params.query) : query;
                        // console.log('==============share query: ', query)
                        wx.onHide(onHide_3);
                        wx.onShow(onShow_4);
                        showMap[key] = onShow_4;
                        wx.shareAppMessage({
                            title: params.title || ((_0 = (_z = shareData_5 === null || shareData_5 === void 0 ? void 0 : shareData_5.data) === null || _z === void 0 ? void 0 : _z.content) === null || _0 === void 0 ? void 0 : _0.content),
                            imageUrl: params.imageUrl || ((_2 = (_1 = shareData_5 === null || shareData_5 === void 0 ? void 0 : shareData_5.data) === null || _1 === void 0 ? void 0 : _1.content) === null || _2 === void 0 ? void 0 : _2.image),
                            query: query
                        });
                        this.reportShareAppMessage('APP_MESSAGE');
                        return [3 /*break*/, 5];
                    case 4:
                        error_35 = _3.sent();
                        callback.complete((0, utils_2.handleError)(error_35));
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SdkWegame.prototype.setGameInfo = function (cp_role_id, region_tag) {
        config_1.SYSTEM_INFO.cp_role_id = cp_role_id;
        config_1.SYSTEM_INFO.region_tag = region_tag;
    };
    SdkWegame.prototype.searchGameAccount = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_36;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, api_1.searchGameAccountApi)()];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_36 = _a.sent();
                        callback.complete((0, utils_2.handleError)(error_36));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SdkWegame.prototype.openChatTool = function (params, callback) {
        var _params = {};
        if (params.roomid) {
            _params.roomid = params.roomid;
        }
        if (params.chatType) {
            _params.chatType = params.chatType;
        }
        // @ts-ignore
        wx.openChatTool(__assign(__assign({}, _params), { success: function () {
                callback.complete({
                    code: 0
                });
            }, fail: function (err) {
                callback.complete((0, utils_2.handleError)(err));
            } }));
    };
    SdkWegame.prototype.isChatTool = function () {
        // @ts-ignore
        var result = wx.isChatTool();
        return result;
    };
    SdkWegame.prototype.exitChatTool = function (callback) {
        // @ts-ignore
        wx.exitChatTool({
            success: function () {
                callback.complete({
                    code: 0
                });
            },
            fail: function (err) {
                callback.complete((0, utils_2.handleError)(err));
            }
        });
    };
    SdkWegame.prototype.chatToolShare = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var shareData_6, _params, error_37;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getShareData(params, callback, true)];
                    case 1:
                        shareData_6 = _a.sent();
                        _params = {
                            withShareTicket: params.withShareTicket || true,
                            isUpdatableMessage: true,
                            useForChatTool: true,
                            activityId: params.activity_id,
                            chooseType: params.chooseType || 1,
                            participant: params.members || [],
                            templateInfo: {
                                // @ts-ignore
                                templateId: params.templateId || '4A68CBB88A92B0A9311848DBA1E94A199B166463'
                            }
                        };
                        console.info(__assign({}, _params));
                        wx.updateShareMenu(__assign(__assign({}, _params), { success: function (res) {
                                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2;
                                console.info('updateShareMenu', res);
                                var query = utils_2.qs.stringify({
                                    type: 'rx',
                                    user_source: 'share',
                                    is_chat_tool: '1',
                                    activityId: params.activity_id,
                                    platform: ((_a = shareData_6 === null || shareData_6 === void 0 ? void 0 : shareData_6.data) === null || _a === void 0 ? void 0 : _a.platform) || '',
                                    transmits: encodeURIComponent((params === null || params === void 0 ? void 0 : params.transmits) || ''),
                                    landing_id: ((_c = (_b = shareData_6 === null || shareData_6 === void 0 ? void 0 : shareData_6.data) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.landing_id) || '',
                                    trigger_id: ((_e = (_d = shareData_6 === null || shareData_6 === void 0 ? void 0 : shareData_6.data) === null || _d === void 0 ? void 0 : _d.trigger) === null || _e === void 0 ? void 0 : _e.id) || '',
                                    trigger_tag: ((_g = (_f = shareData_6 === null || shareData_6 === void 0 ? void 0 : shareData_6.data) === null || _f === void 0 ? void 0 : _f.trigger) === null || _g === void 0 ? void 0 : _g.tag) || '',
                                    trigger_type: ((_j = (_h = shareData_6 === null || shareData_6 === void 0 ? void 0 : shareData_6.data) === null || _h === void 0 ? void 0 : _h.trigger) === null || _j === void 0 ? void 0 : _j.type) || '',
                                    material_type: ((_l = (_k = shareData_6 === null || shareData_6 === void 0 ? void 0 : shareData_6.data) === null || _k === void 0 ? void 0 : _k.content) === null || _l === void 0 ? void 0 : _l.material_type) || '',
                                    material_id: ((_o = (_m = shareData_6 === null || shareData_6 === void 0 ? void 0 : shareData_6.data) === null || _m === void 0 ? void 0 : _m.content) === null || _o === void 0 ? void 0 : _o.material_id) || '',
                                    strategy_type: ((_q = (_p = shareData_6 === null || shareData_6 === void 0 ? void 0 : shareData_6.data) === null || _p === void 0 ? void 0 : _p.strategy) === null || _q === void 0 ? void 0 : _q.type) || '',
                                    strategy_id: ((_s = (_r = shareData_6 === null || shareData_6 === void 0 ? void 0 : shareData_6.data) === null || _r === void 0 ? void 0 : _r.strategy) === null || _s === void 0 ? void 0 : _s.id) || '',
                                    material_name: ((_u = (_t = shareData_6 === null || shareData_6 === void 0 ? void 0 : shareData_6.data) === null || _t === void 0 ? void 0 : _t.content) === null || _u === void 0 ? void 0 : _u.title) || '',
                                    trigger_name: ((_w = (_v = shareData_6 === null || shareData_6 === void 0 ? void 0 : shareData_6.data) === null || _v === void 0 ? void 0 : _v.trigger) === null || _w === void 0 ? void 0 : _w.title) || '',
                                    strategy_name: ((_y = (_x = shareData_6 === null || shareData_6 === void 0 ? void 0 : shareData_6.data) === null || _x === void 0 ? void 0 : _x.strategy) === null || _y === void 0 ? void 0 : _y.name) || '',
                                    share_time: Math.floor(new Date().getTime() / 1000),
                                    share_type: 'mini',
                                    inviter_region: config_1.USER_INFO.region || '',
                                    inviter_openid: config_1.USER_INFO.openid || '',
                                    inviter_productid: config_1.SYSTEM_INFO.productId,
                                    inviter_channelid: config_1.SYSTEM_INFO.channelId,
                                    inviter_subchannelid: this.subChannelId || '',
                                });
                                query = params.query ? "".concat(query, "&").concat(params.query) : query;
                                // @ts-ignore
                                wx.shareAppMessageToGroup({
                                    title: params.title || ((_0 = (_z = shareData_6 === null || shareData_6 === void 0 ? void 0 : shareData_6.data) === null || _z === void 0 ? void 0 : _z.content) === null || _0 === void 0 ? void 0 : _0.content),
                                    imageUrl: params.imageUrl || ((_2 = (_1 = shareData_6 === null || shareData_6 === void 0 ? void 0 : shareData_6.data) === null || _1 === void 0 ? void 0 : _1.content) === null || _2 === void 0 ? void 0 : _2.image),
                                    path: params.path || "?".concat(query),
                                    success: function (res) {
                                        callback.complete(shareData_6);
                                    },
                                    fail: function (err) {
                                        callback.complete((0, utils_2.handleError)(err));
                                    }
                                });
                                this.reportShareAppMessage('APP_MESSAGE');
                            } }));
                        return [3 /*break*/, 3];
                    case 2:
                        error_37 = _a.sent();
                        callback.complete((0, utils_2.handleError)(error_37));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SdkWegame.prototype.selectGroupMembers = function (params, callback) {
        var _params = {};
        if (params.maxSelectCount != null) {
            _params.maxSelectCount = params.maxSelectCount;
        }
        // @ts-ignore
        wx.selectGroupMembers(__assign(__assign({}, _params), { success: function (res) {
                callback.complete({
                    code: 0,
                    data: res.members
                });
            }, fail: function (err) {
                callback.complete((0, utils_2.handleError)(err));
            } }));
    };
    SdkWegame.prototype.checkIsChatToolEnter = function (callback) {
        var query = (0, utils_1.getSearchQueries)();
        return !!query.is_chat_tool;
    };
    SdkWegame.prototype.getGroupEnterInfo = function (params, callback) {
        var _params = {};
        if (params.allowSingleChat != null) {
            _params.allowSingleChat = params.allowSingleChat;
        }
        if (params.needGroupOpenID != null) {
            _params.needGroupOpenID = params.needGroupOpenID;
        }
        // @ts-ignore
        wx.getGroupEnterInfo(__assign(__assign({}, _params), { success: function (res) {
                callback.complete({
                    code: 0
                });
            }, fail: function (err) {
                callback.complete((0, utils_2.handleError)(err));
            } }));
    };
    SdkWegame.prototype.getChatToolInfo = function (callback) {
        var that = this;
        // @ts-ignore
        wx.getChatToolInfo({
            success: function (res) {
                that.decryptionDate({
                    encrypted_data: res.encryptedData,
                    iv: res.iv
                }, {
                    complete: function (res) {
                        console.log(res);
                        callback.complete({
                            code: 0,
                            data: JSON.parse(res.data.decode_data)
                        });
                    }
                });
            },
            fail: function (err) {
                callback.complete((0, utils_2.handleError)(err));
            }
        });
    };
    SdkWegame.prototype.chatToolMsgSend = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var _params, result, error_38;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        _params = {
                            activity_id: params.activity_id,
                            target_state: params.target_state,
                            version_type: params.version_type,
                            template_id: params.template_id || '4A68CBB88A92B0A9311848DBA1E94A199B166463',
                        };
                        if (params.participator_info_list) {
                            _params.participator_info_list = params.participator_info_list;
                        }
                        if (params.template_id) {
                            _params.template_id = params.template_id;
                        }
                        console.info(_params);
                        return [4 /*yield*/, (0, api_1.setChatToolMsgApi)(_params)];
                    case 1:
                        result = _a.sent();
                        callback.complete(__assign(__assign({}, result), { msg: result.msg || result.message }));
                        return [3 /*break*/, 3];
                    case 2:
                        error_38 = _a.sent();
                        callback.complete((0, utils_2.handleError)(error_38));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return SdkWegame;
}(index_common_1.default));
// 通过Object.getOwnPropertyNames获取wx对象所有自身属性名（包括方法和非方法属性）
try {
    Object.getOwnPropertyNames(wx).forEach(function (key) {
        // @ts-ignore
        var value = wx[key];
        if (typeof value === 'function') {
            // 如果是函数类型，就在MyWxWrapper类的原型上添加对应的方法
            // @ts-ignore
            if (SdkWegame.prototype[key] || SdkWegame[key]) {
                // @ts-ignore
                wx["ori".concat(key)] = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return value.apply(wx, args);
                };
                // @ts-ignore
                SdkWegame.prototype["ori".concat(key)] = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return value.apply(wx, args);
                };
            }
            else {
                // @ts-ignore
                SdkWegame.prototype[key] = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return value.apply(wx, args);
                };
            }
        }
    });
}
catch (e) {
}
exports.default = SdkWegame;
//# sourceMappingURL=index.wegame.js.map