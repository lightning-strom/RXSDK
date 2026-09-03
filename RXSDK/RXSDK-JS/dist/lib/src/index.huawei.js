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
var apiForHuawei_1 = require("@/api/huawei/apiForHuawei");
var checkConfig_1 = require("@/utils/checkConfig");
var axios_1 = require("axios");
var index_common_1 = require("./utils/huawei/index.common");
var stOffset_1 = require("@/utils/stOffset");
var huawei_1 = require("@/utils/checkConfig/huawei");
var paramsValid_1 = require("@/utils/paramsValid");
var config_1 = require("@/config");
var huawei_2 = require("@/config/huawei");
var is_1 = require("@/utils/is");
var enum_1 = require("@/config/enum");
var utils_1 = require("@/utils/utils");
var const_1 = require("@/config/const");
var v4_1 = require("uuid/v4");
var day_1 = require("@/utils/day");
var utils_2 = require("./utils/huawei/utils");
// 华为错误code转换到公共code
var HUAWEIERRORCODEMAP = {
    '60000': '4001' //取消支付
};
var getDevicecode = function () {
    var devicecode = utils_2.storage.get('rx_devicecode');
    if (devicecode) {
        return devicecode.code;
    }
    else {
        var code = (0, v4_1.default)();
        utils_2.storage.set('rx_devicecode', { code: code, openIds: {} });
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
var handleTrackError = function (error_action, error, code) {
    if (error_action === void 0) { error_action = ''; }
    var handle_error = (0, utils_1.handleError)(error, code);
    if (validateNumber(handle_error.code) || !handle_error.isServerError) {
        (0, apiForHuawei_1.trackApi)([
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
                    error_action: error_action,
                    error_type: 'sdk',
                    trace_id: (0, v4_1.default)(),
                    rx_version: config_1.SYSTEM_INFO.__RX_SDK_VERSION,
                    type_tripartite: enum_1.PLATFORM.MINIGAMEHUAWEI,
                    request_address: handle_error.url || '',
                    request_header: handle_error.request_header || '',
                    request_body: handle_error.request_body || '',
                    error_code: handle_error.code,
                    error_message: handle_error.msg || '',
                    error_code_tripartite: handle_error.thirdcode || '',
                    error_message_tripartite: handle_error.thirdmsg || '',
                    cp_userid: config_1.USER_INFO.cp_user_id,
                    error_ext: '请前往 https://doc.ruixueyun.com/#/view?path=9e58d663-7313-498c-b95c-f8706ec09bdd 查看解决方案'
                }
            }
        ]).catch(function (e) {
            console.log(e);
        });
    }
    return {
        code: handle_error.code,
        msg: handle_error.msg,
        thirdcode: handle_error.thirdcode,
        thirdmsg: handle_error.thirdmsg
    };
};
var SdkClass = /** @class */ (function (_super) {
    __extends(SdkClass, _super);
    function SdkClass(initParams) {
        var _this_1 = _super.call(this, initParams) || this;
        _this_1.initConfig = {};
        // 默认刷新时间 10 分钟
        _this_1.businessRuleDefaultRefreshTime = 600000;
        // 上报公共属性接口失败次数
        _this_1.trackPublicPropsFailCount = 0;
        _this_1._hasAd = {
            rewarded: undefined
        };
        //子渠道id
        _this_1.subChannelId = null;
        _this_1._ad = null;
        // 调度埋点
        _this_1.scheduleInitMap = {};
        // 获取分享数据缓存调度上报参数
        _this_1.scheuleReportProps = {};
        _this_1.GameRecorderManager = null;
        _this_1.isPromoter = false;
        _this_1.game_id = '';
        _this_1.promoInfo = {
            timer: null,
            refresh_period_exp: 0,
            polling: 0,
            promo_code: ''
        };
        _this_1.request = axios_1.default;
        _this_1.SYSTEM_INFO = config_1.SYSTEM_INFO;
        (0, paramsValid_1.invalidInitParams)(initParams, checkConfig_1.huaweiInitParamsCheck);
        console.info('channel sdk check params passed');
        Object.assign(config_1.SYSTEM_INFO, huawei_2.SYSTEM_INFO, __assign(__assign({}, initParams), { index: 0 }));
        _this_1.getInitConfig({ complete: initParams.complete });
        return _this_1;
    }
    SdkClass.prototype.addFeedback = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var res, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apiForHuawei_1.createFeedbackApi)(params)];
                    case 1:
                        res = _a.sent();
                        console.log(res);
                        callback && callback.complete(res);
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
    SdkClass.prototype.getFeedbackList = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var res, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apiForHuawei_1.getFeedbackListApi)(params)];
                    case 1:
                        res = _a.sent();
                        console.log(res);
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
    SdkClass.prototype.getFeedbackDetail = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var res, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apiForHuawei_1.getFeedbackDetailApi)(params)];
                    case 1:
                        res = _a.sent();
                        console.log(res);
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
    SdkClass.prototype.collectProps = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var res, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apiForHuawei_1.collectPropsApi)(params)];
                    case 1:
                        res = _a.sent();
                        console.log(res);
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
    SdkClass.prototype.getAnnouncement = function (limit, callback) {
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
                        return [4 /*yield*/, (0, apiForHuawei_1.getNoticeApi)({
                                limit: limit,
                                product_id: productId,
                                channel_id: channelId
                            })];
                    case 2:
                        res = _a.sent();
                        console.log(res);
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
    SdkClass.prototype.clearPromoterTimer = function () {
        console.log('clearPromoterTimer');
        if (this.promoInfo.timer) {
            clearTimeout(this.promoInfo.timer);
            this.promoInfo.timer = null;
        }
    };
    // 启动定时器
    SdkClass.prototype.startPromoterTimer = function (callback, autoRefresh) {
        var _this_1 = this;
        if (autoRefresh === void 0) { autoRefresh = true; }
        var delay = this.promoInfo.refresh_period_exp < 1 ? (this.promoInfo.polling ? (this.promoInfo.polling * 1000) : 10000) : (this.promoInfo.refresh_period_exp * 1000);
        console.log('startPromoterTimer', delay);
        this.promoInfo.timer = setTimeout(function () {
            _this_1.getPromoDisplayKEY(callback, autoRefresh, false);
        }, delay);
    };
    SdkClass.prototype.getPromoDisplayKEY = function (callback, autoRefresh, immediately) {
        var _this_1 = this;
        if (autoRefresh === void 0) { autoRefresh = false; }
        if (immediately === void 0) { immediately = true; }
        this.clearPromoterTimer();
        var promo_code = this.promoInfo.promo_code;
        (0, apiForHuawei_1.getPromoterCodeApi)(this.game_id).then(function (res) {
            try {
                if (res.code == 0) {
                    _this_1.promoInfo.refresh_period_exp = res.data.refresh_period_exp || 0;
                    _this_1.promoInfo.polling = res.data.polling || 0;
                    promo_code = res.data.promo_code;
                }
            }
            catch (e) {
                _this_1.promoInfo.refresh_period_exp = 0;
                _this_1.promoInfo.polling = 0;
            }
            if (autoRefresh) {
                _this_1.startPromoterTimer(callback, autoRefresh);
            }
            if (!immediately && promo_code == _this_1.promoInfo.promo_code) {
                return;
            }
            else {
                _this_1.promoInfo.promo_code = promo_code;
            }
            callback && callback.complete(res);
        }).catch(function (err) {
            if (err.isServerError) {
                _this_1.clearPromoterTimer();
                callback && callback.complete(handleTrackError('', err));
            }
            else {
                if (autoRefresh) {
                    _this_1.startPromoterTimer(callback, autoRefresh);
                }
                else {
                    callback && callback.complete(handleTrackError('', err));
                }
            }
        });
    };
    SdkClass.prototype.exchangePromoCDKEY = function (cdkey, callback) {
        (0, apiForHuawei_1.exchangePromoterCodeApi)(cdkey).then(function (res) {
            callback.complete(res);
        }).catch(function (err) {
            callback.complete(handleTrackError('', err));
        });
    };
    SdkClass.prototype.checkIsPromoter = function () {
        return this.isPromoter;
    };
    /**
     * 用于设置自定义返回错误 Msg
     */
    SdkClass.prototype.setErrorMsg = function (errMsg) {
        config_1.SYSTEM_INFO.errMsg = errMsg;
    };
    /**
     * 清空返回错误 Msg
     */
    SdkClass.prototype.clearErrorMsg = function () {
        config_1.SYSTEM_INFO.errMsg = {
            default: ''
        };
    };
    /**
     * 轮训获取公共属性
     *
     */
    SdkClass.prototype.loopGetPublicProps = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var event_public_attr, repeat, getPublicPropsConfig;
            var _this_1 = this;
            return __generator(this, function (_b) {
                event_public_attr = (_a = this.initConfig) === null || _a === void 0 ? void 0 : _a.event_public_attr;
                if ((0, is_1.isEmpty)(event_public_attr))
                    return [2 /*return*/];
                repeat = function (ms) {
                    event_public_attr.timerId && clearTimeout(event_public_attr.timerId);
                    event_public_attr.timerId = setTimeout(function () { return getPublicPropsConfig(); }, ms || _this_1.businessRuleDefaultRefreshTime);
                };
                getPublicPropsConfig = function () { return __awaiter(_this_1, void 0, void 0, function () {
                    var res, _a, _b, refresh, public_attr, _c, version, initParams, error_1;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                _d.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, (0, apiForHuawei_1.getPublicProps)(event_public_attr.version)];
                            case 1:
                                res = _d.sent();
                                _a = (res === null || res === void 0 ? void 0 : res.data) || {}, _b = _a.refresh, refresh = _b === void 0 ? this.businessRuleDefaultRefreshTime : _b, public_attr = _a.public_attr, _c = _a.version, version = _c === void 0 ? '' : _c;
                                event_public_attr.public_attr = public_attr || event_public_attr.public_attr;
                                event_public_attr.refresh = refresh;
                                event_public_attr.version = version;
                                initParams = utils_2.storage.get('rx-init-params');
                                // 获取到最新的version后更新到缓存中，下次初始化的时候用这个最新的version请求初始化配置接口
                                utils_2.storage.set('rx-init-params', __assign(__assign({}, initParams), { version: __assign(__assign({}, initParams.version), { event_public_attr: version }) }));
                                repeat(event_public_attr.refresh);
                                return [3 /*break*/, 3];
                            case 2:
                                error_1 = _d.sent();
                                handleTrackError('', error_1);
                                if (this.trackPublicPropsFailCount < 1) {
                                    // 首次获取失败3秒后重试
                                    this.trackPublicPropsFailCount += 1;
                                    repeat(3000);
                                }
                                else {
                                    // 再失败每十分钟后重试，直至成功
                                    this.trackPublicPropsFailCount += 1;
                                    repeat(600000);
                                }
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); };
                repeat(event_public_attr === null || event_public_attr === void 0 ? void 0 : event_public_attr.refresh);
                return [2 /*return*/];
            });
        });
    };
    // 获取归因数据
    SdkClass.prototype.getAttributionData = function () {
        var universal = (0, utils_2.getSearchQueries)();
        var source_ad = {};
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
            }
            source_ad.ad_platform = universal.ad_platform;
        }
        return source_ad;
    };
    //检查是否需要更新
    SdkClass.prototype.checkNeedActivate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var activeResult, source_ad, distinct_id, req, result, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        activeResult = utils_2.storage.get('rx-active-result');
                        if (!!activeResult) return [3 /*break*/, 4];
                        source_ad = this.getAttributionData();
                        distinct_id = (0, v4_1.default)();
                        utils_2.storage.set('rx_distinct_id', distinct_id);
                        req = {
                            stage: 'init',
                            distinct_id: distinct_id,
                            source_ad: source_ad
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, (0, apiForHuawei_1.activated)(req)];
                    case 2:
                        result = _a.sent();
                        utils_2.storage.set('rx-active-result', { isSuccess: true, activeResult: result.data });
                        return [3 /*break*/, 4];
                    case 3:
                        err_6 = _a.sent();
                        utils_2.storage.set('rx-active-result', { isSuccess: false, activeResult: req });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SdkClass.prototype.ActivePrefix = function (reqParams) {
        var loginState = utils_2.storage.get('rx-loginState');
        var activeSave = utils_2.storage.get('rx-active-result');
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
    SdkClass.prototype.publicSubchannelCheck = function (res) {
        var _a, _b;
        try {
            var sub_channel = (_b = (_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.subcq) === null || _b === void 0 ? void 0 : _b.subc;
            var queryString = (0, utils_2.getSearchQueries)(true);
            var query = queryString ? queryString.split('&') : [];
            console.log(query);
            if ((sub_channel === null || sub_channel === void 0 ? void 0 : sub_channel.length) && (query === null || query === void 0 ? void 0 : query.length)) {
                for (var a = 0; a < sub_channel.length; a++) {
                    var item = sub_channel[a];
                    var reflectStringArr = item === null || item === void 0 ? void 0 : item.map;
                    if (reflectStringArr === null || reflectStringArr === void 0 ? void 0 : reflectStringArr.length) {
                        var arr = item === null || item === void 0 ? void 0 : item.map;
                        var sub_channel_id = item === null || item === void 0 ? void 0 : item.id;
                        for (var k in arr) {
                            var str = arr[k];
                            console.log(str);
                            for (var c in query) {
                                if (str.includes(query[c])) {
                                    this.subChannelId = sub_channel_id;
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
    SdkClass.prototype.switchIsSinglePlayer = function (status) {
        return __awaiter(this, void 0, void 0, function () {
            var _this_1 = this;
            return __generator(this, function (_a) {
                config_1.SYSTEM_INFO.single_player_mode = status;
                if (typeof this.handleSdkInitCallback == 'function') {
                    if (!config_1.SYSTEM_INFO.single_player_mode && !config_1.SYSTEM_INFO.SDK_INIT_FINISHED) {
                        this.getInitConfig({
                            complete: function (res) {
                                _this_1.handleSdkInitCallback({
                                    code: res.code,
                                    single_player_mode: config_1.SYSTEM_INFO.single_player_mode
                                });
                            }
                        });
                    }
                    else {
                        this.handleSdkInitCallback({ code: 0, single_player_mode: config_1.SYSTEM_INFO.single_player_mode });
                    }
                }
                if (!config_1.SYSTEM_INFO.single_player_mode) {
                    this.multipleTrack();
                }
                return [2 /*return*/];
            });
        });
    };
    SdkClass.prototype.multipleTrack = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rx_track_queue, err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        rx_track_queue = utils_2.storage.get('rx_track_queue') || [];
                        if (!rx_track_queue.length) return [3 /*break*/, 2];
                        console.log('批量补上报大数据');
                        return [4 /*yield*/, (0, apiForHuawei_1.trackApi)(rx_track_queue)];
                    case 1:
                        _a.sent();
                        utils_2.storage.remove('rx_track_queue');
                        _a.label = 2;
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        err_7 = _a.sent();
                        console.log(err_7);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SdkClass.prototype.getInitConfig = function (callback) {
        var _a, _b, _c, _d, _e, _f, _g;
        return __awaiter(this, void 0, void 0, function () {
            var initParams, res, config, version, _i, _h, key, prop_version, _serverTime, err_8, error;
            var _this_1 = this;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        if (config_1.SYSTEM_INFO.single_player_mode) {
                            callback.complete({
                                code: 0,
                                single_player_mode: config_1.SYSTEM_INFO.single_player_mode
                            });
                            setTimeout(function () {
                                _this_1.handleSdkInitCallback = callback.complete;
                            }, 50);
                            return [2 /*return*/];
                        }
                        initParams = utils_2.storage.get('rx-init-params');
                        _j.label = 1;
                    case 1:
                        _j.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, (0, apiForHuawei_1.getInitConf)({ version: (_a = initParams === null || initParams === void 0 ? void 0 : initParams.version) !== null && _a !== void 0 ? _a : {} })];
                    case 2:
                        res = _j.sent();
                        config = res.data || {};
                        version = {};
                        for (_i = 0, _h = Object.keys(config); _i < _h.length; _i++) {
                            key = _h[_i];
                            prop_version = (_c = (_b = config[key]) === null || _b === void 0 ? void 0 : _b.version) !== null && _c !== void 0 ? _c : '';
                            if (prop_version) {
                                version[key] = prop_version;
                                this.initConfig[key] = { timerId: 0 };
                            }
                            this.initConfig[key] = config[key];
                        }
                        console.log('SDK initConfig: ', this.initConfig);
                        // //检查是否需要传递subchannleid
                        this.publicSubchannelCheck(res);
                        // console.log('测试',this.subChannelId)
                        utils_2.storage.set('rx-init-params', JSON.stringify({ version: version }));
                        config_1.SYSTEM_INFO.SDK_INIT_FINISHED = true;
                        config_1.SYSTEM_INFO.CP_OF = ((_e = (_d = res === null || res === void 0 ? void 0 : res.data) === null || _d === void 0 ? void 0 : _d.cp) === null || _e === void 0 ? void 0 : _e.of) || false;
                        _serverTime = (_g = (_f = res === null || res === void 0 ? void 0 : res.data) === null || _f === void 0 ? void 0 : _f.server) === null || _g === void 0 ? void 0 : _g.time;
                        if (_serverTime) {
                            config_1.SYSTEM_INFO.st_offset = String(Number(_serverTime) - Date.now());
                        }
                        (0, stOffset_1.setupStOffsetRefreshForMiniGame)(typeof qg !== 'undefined' ? qg : null, apiForHuawei_1.getServerTime);
                        // 检查是否需要激活
                        this.checkNeedActivate();
                        this.loopGetPublicProps();
                        callback.complete({ code: 0 });
                        return [3 /*break*/, 5];
                    case 3:
                        err_8 = _j.sent();
                        error = __assign(__assign({}, (err_8 || {})), { msg: '初始化错误，或未初始化', code: const_1.COMMON_ERROR_CODE.INIT_PARAMS_ERROR, thirdcode: err_8.code || err_8.errCode, message: err_8.message || err_8.msg || err_8.errMsg, thirdmsg: err_8.message || err_8.msg || err_8.errMsg });
                        callback.complete(handleTrackError('rxlog_error_init', error));
                        return [3 /*break*/, 5];
                    case 4:
                        this.handleSdkInitCallback = callback.complete;
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SdkClass.prototype.calculateValueSizeWithEncoding = function (key) {
        var value = localStorage.getItem(key);
        if (value === null) {
            return 0;
        }
        var size = 0;
        for (var i = 0; i < value.length; i++) {
            var charCode = value.charCodeAt(i);
            if (charCode <= 127) {
                size++;
            }
            else {
                size += 3;
            }
        }
        return size;
    };
    SdkClass.prototype.getRxDevicecode = function () {
        try {
            var devicecode = utils_2.storage.get('rx_devicecode');
            if (devicecode) {
                // @ts-ignore
                return devicecode.code;
            }
            else {
                var code = (0, v4_1.default)();
                utils_2.storage.set('rx_devicecode', { code: code, openIds: {} });
                return code;
            }
        }
        catch (err) {
            return (0, v4_1.default)();
        }
    };
    // 同步用户信息
    SdkClass.prototype.infoSync = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            var loginResult, result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, utils_2.asyncFunc)(qg.gameLoginWithReal, {
                                appid: config_1.SYSTEM_INFO.appid,
                                forceLogin: 1
                            })];
                    case 1:
                        loginResult = _a.sent();
                        return [4 /*yield*/, (0, apiForHuawei_1.refreshUserInfo)(__assign({}, loginResult))];
                    case 2:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        callback.complete(handleTrackError('', error_2));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //华为登录
    SdkClass.prototype.login = function (loginParams, callback) {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function () {
            var params, user_source, source_ad, distinct_idLocal, distinct_id, now, reqLogin, queryJson, loginTokenRx, loginResult, _g, custom_ext, rest_ext, reflowEnabled, loginRx, err_9;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        if (config_1.SYSTEM_INFO.single_player_mode) {
                            callback.complete({
                                code: 0,
                                data: {
                                    single_player_mode: true,
                                    nickname: '游客',
                                    devicecode: this.getRxDevicecode()
                                }
                            });
                            return [2 /*return*/];
                        }
                        _h.label = 1;
                    case 1:
                        _h.trys.push([1, 8, , 9]);
                        params = {
                            appid: config_1.SYSTEM_INFO.appid,
                            method: (loginParams === null || loginParams === void 0 ? void 0 : loginParams.method) || 'minigame_huawei',
                            login_openid: loginParams.login_openid
                        };
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(huawei_1.huaweiQuickLoginParamsCheck, callback, params)];
                    case 2:
                        _h.sent();
                        user_source = this.getLoginQsAndGenerateStruct();
                        source_ad = this.getAttributionData();
                        distinct_idLocal = utils_2.storage.get('rx_distinct_id');
                        distinct_id = distinct_idLocal || (0, v4_1.default)();
                        if (!distinct_idLocal) {
                            utils_2.storage.set('rx_distinct_id', distinct_id);
                        }
                        now = new Date().getTime();
                        reqLogin = __assign(__assign(__assign({}, (0, is_1.omit)(params, 'force')), user_source), { distinct_id: distinct_id, ts: now });
                        try {
                            if (this.subChannelId !== null) {
                                queryJson = (0, utils_2.getSearchQueries)();
                                reqLogin.user_source = {
                                    guide: __assign(__assign({}, user_source), { subchannelid: this.subChannelId })
                                };
                                if (queryJson) {
                                    reqLogin.user_source.guide = __assign(__assign({}, reqLogin.user_source.guide), queryJson);
                                }
                            }
                        }
                        catch (err) {
                        }
                        if (!params.login_openid) return [3 /*break*/, 4];
                        console.log('再次登录。。。。');
                        return [4 /*yield*/, (0, apiForHuawei_1.loginByTokenApi)(this.ActivePrefix(reqLogin))];
                    case 3:
                        loginTokenRx = _h.sent();
                        Object.assign(config_1.USER_INFO, loginTokenRx.data);
                        utils_2.storage.set('rxToken', loginTokenRx.data.token);
                        utils_2.storage.set('rx-loginState', 1);
                        try {
                            if ((((_a = loginTokenRx === null || loginTokenRx === void 0 ? void 0 : loginTokenRx.data) === null || _a === void 0 ? void 0 : _a.user_flag) & 1) == 1) {
                                this.isPromoter = true;
                                this.game_id = (_b = loginTokenRx === null || loginTokenRx === void 0 ? void 0 : loginTokenRx.data) === null || _b === void 0 ? void 0 : _b.cp_user_id;
                            }
                        }
                        catch (e) {
                        }
                        callback.complete(loginTokenRx);
                        return [3 /*break*/, 7];
                    case 4: return [4 /*yield*/, (0, utils_2.asyncFunc)(qg.gameLoginWithReal, {
                            appid: config_1.SYSTEM_INFO.appid,
                            forceLogin: 1
                        })];
                    case 5:
                        loginResult = _h.sent();
                        _g = reqLogin.ext || {}, custom_ext = _g.custom_ext, rest_ext = __rest(_g, ["custom_ext"]);
                        reqLogin.custom_ext = custom_ext || {};
                        reqLogin.ext = __assign(__assign({}, (rest_ext || {})), loginResult);
                        reflowEnabled = ((_d = (_c = this.initConfig) === null || _c === void 0 ? void 0 : _c.advertise_switch) === null || _d === void 0 ? void 0 : _d.switch) === 1;
                        reqLogin = reflowEnabled ? __assign(__assign({}, reqLogin), { device: source_ad }) : __assign({}, reqLogin);
                        return [4 /*yield*/, (0, apiForHuawei_1.loginByCredentialApi)(this.ActivePrefix(reqLogin))];
                    case 6:
                        loginRx = _h.sent();
                        Object.assign(config_1.USER_INFO, loginRx.data);
                        utils_2.storage.set('rxToken', loginRx.data.token);
                        utils_2.storage.set('rx-loginState', 1);
                        try {
                            if ((((_e = loginRx === null || loginRx === void 0 ? void 0 : loginRx.data) === null || _e === void 0 ? void 0 : _e.user_flag) & 1) == 1) {
                                this.isPromoter = true;
                                this.game_id = (_f = loginRx === null || loginRx === void 0 ? void 0 : loginRx.data) === null || _f === void 0 ? void 0 : _f.cp_user_id;
                            }
                        }
                        catch (e) {
                        }
                        callback.complete(loginRx);
                        _h.label = 7;
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        err_9 = _h.sent();
                        callback.complete(handleTrackError('rxlog_error_login', err_9, const_1.COMMON_ERROR_CODE.LOGIN_FAIL));
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    //用户协议设置
    SdkClass.prototype.getIsAgree = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, utils_2.storage.get('isAgree')];
            });
        });
    };
    SdkClass.prototype.setIsAgree = function (flag) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, utils_2.storage.set('isAgree', flag)];
            });
        });
    };
    SdkClass.prototype.getLoginQsAndGenerateStruct = function () {
        var _a;
        var universal = (0, utils_2.getSearchQueries)();
        // console.log('===============queryString', universal)
        var user_source = {};
        if (universal.hasOwnProperty('user_source')) {
            var omitKeys = (universal === null || universal === void 0 ? void 0 : universal.user_source) === 'transmits'
                ? ['user_source']
                : ['user_source', 'type', 'transmits'];
            var leftProps = __assign({}, (0, is_1.omit)(universal, omitKeys));
            /**
             * url 上有user_source字段并且除了'user_source', 'type', 'transmits'等字段外还有属性，则将剩余属性全部放到universal['user_source']属性下
             * 多包了一层'user_source',使用的地方直接 ...
             */
            if (!(0, is_1.isEmpty)(leftProps)) {
                // 用户透传参数
                if ((universal === null || universal === void 0 ? void 0 : universal.user_source) == 'transmits') {
                    user_source = {
                        user_transmits: Object.assign(leftProps, {
                            transmits: decodeURIComponent(leftProps.transmits || '')
                        })
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
                            _a)
                    };
                }
                return user_source;
            }
        }
        var subPackageInfo = utils_2.storage.get('rx_sub_package_info');
        if (!(0, is_1.isEmpty)(subPackageInfo)) {
            user_source = {
                user_source: {
                    sub_package: subPackageInfo
                }
            };
            return user_source;
        }
        return null;
    };
    //数据上报
    SdkClass.prototype.track = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var p1, p2, getDevicecode_1, devicecode, type, time, uuids, platform_id, copyCpid, product_id, channel_id, cpid, publicProps, new_properties, reqarr, useCache, size, rx_track_queue, result, err_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        p1 = null;
                        p2 = null;
                        try {
                            if (params.complete) {
                                p2 = params;
                                p1 = callback;
                            }
                            else {
                                p1 = params;
                                p2 = callback;
                            }
                        }
                        catch (err) {
                            p1 = params;
                            p2 = callback;
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        getDevicecode_1 = function () {
                            var devicecode = utils_2.storage.get('rx_devicecode');
                            if (devicecode) {
                                return devicecode.code;
                            }
                            else {
                                var code = (0, v4_1.default)();
                                utils_2.storage.set('rx_devicecode', { code: code, openIds: {} });
                                return code;
                            }
                        };
                        devicecode = getDevicecode_1();
                        type = 'track';
                        time = (0, day_1.formatDate)('YYYY-MM-DDTHH:mm:ss.SSSZ');
                        uuids = (0, v4_1.default)();
                        platform_id = 4;
                        copyCpid = config_1.SYSTEM_INFO.cpid, product_id = config_1.SYSTEM_INFO.productId, channel_id = config_1.SYSTEM_INFO.channelId;
                        cpid = Number(copyCpid);
                        publicProps = utils_2.storage.get('rx_public_props');
                        new_properties = {};
                        if (config_1.SYSTEM_INFO.region_tag) {
                            new_properties.rx_region_tag = "".concat(config_1.SYSTEM_INFO.region_tag);
                        }
                        if (config_1.SYSTEM_INFO.cp_role_id) {
                            new_properties['#role_id'] = "".concat(config_1.SYSTEM_INFO.cp_role_id);
                        }
                        reqarr = [
                            __assign({ type: type, time: time, uuid: uuids, distinct_id: config_1.USER_INFO.openid, sub_channel_id: config_1.USER_INFO === null || config_1.USER_INFO === void 0 ? void 0 : config_1.USER_INFO.subchannelid, platform_id: platform_id, product_id: product_id, ip: '127.0.0.1', cpid: cpid, channel_id: channel_id, devicecode: devicecode }, __assign(__assign({}, p1), { properties: __assign(__assign(__assign({}, new_properties), p1.properties), publicProps) }))
                        ];
                        !config_1.USER_INFO.subchannelid || (reqarr[0].sub_channel_id = config_1.USER_INFO.subchannelid);
                        useCache = config_1.SYSTEM_INFO.single_player_mode;
                        size = this.calculateValueSizeWithEncoding('rx_track_queue');
                        console.log('rx_track_queue size:', size);
                        if (useCache && size <= 2 * 1024 * 1024) {
                            rx_track_queue = utils_2.storage.get('rx_track_queue') || [];
                            rx_track_queue = rx_track_queue.concat(reqarr);
                            utils_2.storage.set('rx_track_queue', rx_track_queue);
                            p2.complete({ code: 0, data: null, msg: 'track cache' });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, (0, apiForHuawei_1.trackApi)(reqarr)];
                    case 2:
                        result = _a.sent();
                        p2.complete(__assign(__assign({}, result), { data: null, msg: 'track success' }));
                        return [3 /*break*/, 4];
                    case 3:
                        err_10 = _a.sent();
                        p2.complete((0, utils_1.handleError)(err_10));
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
    SdkClass.prototype.setPublicProperties = function (params) {
        if (!(0, is_1.isObject)(params)) {
            var error = new Error('params must be object');
            error.code = const_1.COMMON_ERROR_CODE.PAY_PARAMS_ERROR;
            return handleTrackError('', error);
        }
        try {
            utils_2.storage.set('rx_public_props', params);
            return { code: 0 };
        }
        catch (error) {
            return handleTrackError('', error);
        }
    };
    /**
     * 修改设置的公共数据。
     */
    SdkClass.prototype.updatePublicProperties = function (params) {
        if (!(0, is_1.isObject)(params)) {
            var error = new Error('params must be object');
            error.code = const_1.COMMON_ERROR_CODE.PAY_PARAMS_ERROR;
            return handleTrackError('', error);
        }
        try {
            var cache = utils_2.storage.get('rx_public_props');
            utils_2.storage.set('rx_public_props', __assign(__assign({}, cache), params));
            return { code: 0 };
        }
        catch (error) {
            return handleTrackError('', error);
        }
    };
    /**
     * 删除公共属性
     */
    SdkClass.prototype.deletePublicProperties = function (params) {
        try {
            var cache = utils_2.storage.get('rx_public_props');
            var rest = (0, is_1.omit)(cache, params);
            utils_2.storage.set('rx_public_props', rest);
            return { code: 0 };
        }
        catch (error) {
            return handleTrackError('', error);
        }
    };
    SdkClass.prototype.setScheuleReportProps = function (data) {
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
            platform: (data === null || data === void 0 ? void 0 : data.platform) || enum_1.PLATFORM.MINIGAMEHUAWEI
        };
    };
    //获得公共属性
    SdkClass.prototype.getPublicProperties = function () {
        var data = utils_2.storage.get("rx_public_props");
        return { code: 0, data: data };
    };
    SdkClass.prototype.exchangeItemProp = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apiForHuawei_1.itemRedemptionApi)(params)];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_3));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /*支付*/
    //支付消耗型商品
    //华为支付
    SdkClass.prototype.pay = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var _this, reqOrder, result, res, error_4, payErrorCode, err_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _this = this;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 12, , 13]);
                        console.log('进入支付。。。');
                        reqOrder = __assign(__assign({}, params), { currency: 'CNY', openid: config_1.USER_INFO.openid, sub_channel_id: config_1.USER_INFO === null || config_1.USER_INFO === void 0 ? void 0 : config_1.USER_INFO.subchannelid, is_debug: params.is_debug || 0, env: params.env || 0, ext: {} });
                        return [4 /*yield*/, (0, apiForHuawei_1.orderApi)(reqOrder)
                            //unity 兼容逻辑
                        ];
                    case 2:
                        result = _a.sent();
                        //unity 兼容逻辑
                        if (params.onlyGetOrder) {
                            callback.complete({ code: 0, data: result });
                            return [2 /*return*/];
                        }
                        //检查用户的登录态是否有效
                        return [4 /*yield*/, (0, utils_2.asyncFunc)(qg.isEnvReady, {
                                isEnvReadyReq: {
                                    applicationID: config_1.SYSTEM_INFO.appid
                                }
                            })];
                    case 3:
                        //检查用户的登录态是否有效
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 7, , 11]);
                        utils_2.storage.set((0, utils_2.getCacheKey)('order_params', config_1.USER_INFO), result.data);
                        return [4 /*yield*/, (0, utils_2.asyncFunc)(qg.createPurchaseIntent, {
                                purchaseIntentReq: {
                                    applicationID: config_1.SYSTEM_INFO.appid,
                                    productId: result.data.ext.third_tag,
                                    publicKey: config_1.SYSTEM_INFO.publicKey,
                                    priceType: 0,
                                    developerPayload: result.data.order_no
                                }
                            })];
                    case 5:
                        res = _a.sent();
                        return [4 /*yield*/, (0, apiForHuawei_1.postPayData)(result.data.notify_url, {
                                inAppDataSignature: res.inAppDataSignature,
                                inAppPurchaseData: res.inAppPurchaseData
                            })];
                    case 6:
                        _a.sent();
                        this.track((0, utils_1.formatTrackParams)(__assign({ eventName: 'requestproduct', apiName: 'pay_order', state: '下单成功', reqParams: params, errorInfo: {}, loginInfo: config_1.USER_INFO, orderRes: (result === null || result === void 0 ? void 0 : result.data) || {} }, ((result === null || result === void 0 ? void 0 : result.data) || {}))), {
                            complete: function () {
                            }
                        });
                        utils_2.storage.remove((0, utils_2.getCacheKey)('order_params', config_1.USER_INFO));
                        callback.complete({ code: 0 });
                        return [3 /*break*/, 11];
                    case 7:
                        error_4 = _a.sent();
                        payErrorCode = [-1, 60051];
                        utils_2.storage.remove((0, utils_2.getCacheKey)('order_params', config_1.USER_INFO));
                        if (!(payErrorCode.includes(error_4.code) && result.data.ext.third_tag)) return [3 /*break*/, 9];
                        console.log('开始补单');
                        return [4 /*yield*/, _this.supplementaryOrder(result.data.ext.third_tag, {
                                url: result.data.notify_url
                            })];
                    case 8:
                        _a.sent();
                        console.log('补单成功');
                        callback.complete({ code: 0 });
                        return [2 /*return*/];
                    case 9:
                        if (HUAWEIERRORCODEMAP[error_4.code]) {
                            callback.complete(__assign(__assign({}, error_4), { code: HUAWEIERRORCODEMAP[error_4.code] }));
                            return [2 /*return*/];
                        }
                        else if ((0, utils_1.isDropOrder)(error_4.code)) {
                            utils_2.storage.set((0, utils_2.getCacheKey)('order_params', config_1.USER_INFO), result.data);
                        }
                        _a.label = 10;
                    case 10:
                        callback.complete(handleTrackError('rxlog_error_pay', error_4));
                        return [3 /*break*/, 11];
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        err_11 = _a.sent();
                        callback.complete(handleTrackError('', err_11));
                        return [3 /*break*/, 13];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    //华为支付时掉单需要补单
    SdkClass.prototype.supplementaryOrder = function (productId, params) {
        return __awaiter(this, void 0, void 0, function () {
            var res, index, purchaseData, rest, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        console.log('productId...', productId);
                        return [4 /*yield*/, (0, utils_2.asyncFunc)(qg.obtainOwnedPurchases, {
                                ownedPurchasesReq: {
                                    priceType: 0,
                                    publicKey: config_1.SYSTEM_INFO.publicKey,
                                    applicationID: config_1.SYSTEM_INFO.appid
                                }
                            })];
                    case 1:
                        res = _a.sent();
                        index = res.inAppPurchaseDataList.findIndex(function (objstr) {
                            var item = JSON.parse(objstr);
                            return item.productId == productId;
                        });
                        purchaseData = res.inAppPurchaseDataList[index] && JSON.parse(res.inAppPurchaseDataList[index]);
                        if (!((purchaseData === null || purchaseData === void 0 ? void 0 : purchaseData.purchaseState) == 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, apiForHuawei_1.postPayData)(params.url, {
                                inAppDataSignature: res.inAppSignature[index],
                                inAppPurchaseData: res.inAppPurchaseDataList[index]
                            })];
                    case 2:
                        rest = _a.sent();
                        return [2 /*return*/, rest];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_5 = _a.sent();
                        console.log('补单错误1', JSON.stringify(error_5));
                        throw error_5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    //查询已购买商品
    SdkClass.prototype.obtainOwnedPurchases = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, utils_2.asyncFunc)(qg.obtainOwnedPurchases, {
                            ownedPurchasesReq: __assign(__assign({}, params), { publicKey: config_1.SYSTEM_INFO.publicKey, applicationID: config_1.SYSTEM_INFO.appid })
                        })];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data
                            // qg.obtainOwnedPurchases({
                            //   ownedPurchasesReq: {
                            //     ...params,
                            //     publicKey: SYSTEM_INFO.publicKey,
                            //     applicationID: SYSTEM_INFO.appid,
                            //   },
                            //   success(data: any) {
                            //     if (data.continuationToken) {
                            //       this.obtainOwnedPurchases(
                            //         {
                            //           continuationToken: data.continuationToken,
                            //           ...params,
                            //         },
                            //         callback
                            //       )
                            //     } else {
                            //       callback.complete?.({code:0,data})
                            //     }
                            //   },
                            //   fail(msg: any, code: any) {
                            //     callback.complete?.({code,msg})
                            //   },
                            // })
                        ];
                }
            });
        });
    };
    //查询是否需要补单
    SdkClass.prototype.checkHasCompensatePayOrder = function () {
        var check = utils_2.storage.get((0, utils_2.getCacheKey)('order_params', config_1.USER_INFO));
        if ((0, is_1.isEmpty)(check)) {
            return { code: -1, msg: 'null', data: null };
        }
        else {
            return { code: 0, msg: 'had', check: check };
        }
    };
    // cp方主动补单
    SdkClass.prototype.compensatePayOrder = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var data, order_params, notify_url, reqList, i, item, res, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('开始主动补单');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.obtainOwnedPurchases({
                                priceType: 0
                            })];
                    case 2:
                        data = _a.sent();
                        if (!data.inAppPurchaseDataList || data.inAppPurchaseDataList.length == 0) {
                            utils_2.storage.remove((0, utils_2.getCacheKey)('order_params', config_1.USER_INFO));
                            callback === null || callback === void 0 ? void 0 : callback.complete({ code: -1, msg: '不需要补单' });
                            return [2 /*return*/];
                        }
                        order_params = utils_2.storage.get((0, utils_2.getCacheKey)('order_params', config_1.USER_INFO));
                        notify_url = order_params.notify_url;
                        reqList = [];
                        for (i = 0; i < data.inAppPurchaseDataList.length; i++) {
                            console.log('data[i]', data.inAppPurchaseDataList[i]);
                            item = JSON.parse(data.inAppPurchaseDataList[i]);
                            reqList.push(this.supplementaryOrder(item.productId, {
                                url: notify_url
                            }));
                        }
                        return [4 /*yield*/, Promise.all(reqList)];
                    case 3:
                        res = _a.sent();
                        utils_2.storage.remove((0, utils_2.getCacheKey)('order_params', config_1.USER_INFO));
                        callback === null || callback === void 0 ? void 0 : callback.complete({ code: 0, msg: '补单完成' });
                        return [3 /*break*/, 5];
                    case 4:
                        error_6 = _a.sent();
                        callback.complete(handleTrackError('rxlog_error_pay', error_6));
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SdkClass.prototype.schedulingAction = function (params, callback) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function () {
            var func, schedulingRes, scheduling_type, shareData, adUnitId, err_12;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 2, , 3]);
                        func = params === null || params === void 0 ? void 0 : params.func;
                        schedulingRes = this.getShareScheduling({ funcs: [func] });
                        scheduling_type = ((_b = (_a = schedulingRes === null || schedulingRes === void 0 ? void 0 : schedulingRes.data) === null || _a === void 0 ? void 0 : _a[func]) === null || _b === void 0 ? void 0 : _b.scheduling_type) || 'share';
                        console.log('sdk schedulingAction scheduling_type:', func, scheduling_type);
                        return [4 /*yield*/, this.getShareData(params, callback, true)];
                    case 1:
                        shareData = _e.sent();
                        console.log('sdk getShareData:', shareData);
                        if (scheduling_type === 'ad') {
                            adUnitId = params.adUnitId || ((_d = (_c = shareData === null || shareData === void 0 ? void 0 : shareData.data) === null || _c === void 0 ? void 0 : _c.ad_content) === null || _d === void 0 ? void 0 : _d.identify);
                            this.rewardedVideoAd({
                                adUnitId: adUnitId,
                                custom_ext: params.custom_ext
                            }, {
                                complete: 
                                // @ts-ignore
                                function (args) {
                                    callback.complete(__assign({ scheduling_type: 'ad' }, (args || {})));
                                }
                            });
                        }
                        else if (scheduling_type === 'share') {
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_12 = _e.sent();
                        callback.complete(handleTrackError('rxlog_error_share', err_12));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //获得分享内容
    SdkClass.prototype.getAdShareData = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var region, productId, channelId, platform, transmits, func, type, sub_channel_id, open_id, shareData, err_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        region = (params === null || params === void 0 ? void 0 : params.region) || config_1.USER_INFO.region || '';
                        productId = config_1.SYSTEM_INFO.productId, channelId = config_1.SYSTEM_INFO.channelId;
                        platform = 'huawei';
                        transmits = encodeURI(params.transmits || '');
                        func = params.func;
                        type = 'mini';
                        sub_channel_id = config_1.USER_INFO.subchannelid || '';
                        open_id = config_1.USER_INFO.openid;
                        return [4 /*yield*/, (0, apiForHuawei_1.getAdShareDataApi)({
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
                        err_13 = _a.sent();
                        callback && callback.complete(handleTrackError('', err_13));
                        return [2 /*return*/, err_13];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /*广告*/
    //激励广告
    SdkClass.prototype.rewardedVideoAd = function (params, callback) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var RETRYMAX, retryed, adShareData, adUnitId, load;
            var _this_1 = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        RETRYMAX = 1;
                        retryed = 0;
                        adShareData = {};
                        if (!(!params.adUnitId && params.func)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getAdShareData({
                                func: params.func,
                                custom_ext: params.custom_ext || {}
                            })];
                    case 1:
                        adShareData = _c.sent();
                        console.log('ad share data', adShareData);
                        _c.label = 2;
                    case 2:
                        adUnitId = params.adUnitId || ((_b = (_a = adShareData === null || adShareData === void 0 ? void 0 : adShareData.data) === null || _a === void 0 ? void 0 : _a.ad_content) === null || _b === void 0 ? void 0 : _b.identify);
                        if (!this._rewardedVideoAd) {
                            this._rewardedVideoAd = qg.createRewardedVideoAd({
                                adUnitId: adUnitId,
                                fail: function (data, code) {
                                    callback.complete && callback.complete(handleTrackError('rxlog_error_ad', data, code));
                                    callback.fail && callback.fail(handleTrackError('rxlog_error_ad', data, code));
                                    _this_1.track((0, utils_1.formatTrackParams)({
                                        eventName: 'track_err',
                                        apiName: 'rewardedVideoAd',
                                        reqParams: params,
                                        errorInfo: {
                                            code: code,
                                            data: data
                                        },
                                        loginInfo: config_1.USER_INFO
                                    }), {
                                        complete: function (data) {
                                            console.info('rewardedVideoAd error add complete func when tracked:', data);
                                        }
                                    });
                                }
                            });
                            this._rewardedVideoAd.onLoad(function () {
                                _this_1._rewardedVideoAd.show();
                            });
                            //视频加载失败
                            this._rewardedVideoAd.onError(function (e) {
                                if (retryed >= RETRYMAX) {
                                    console.log('重新尝试加载视频');
                                    callback.complete && callback.complete(handleTrackError('rxlog_error_ad', e));
                                    return;
                                }
                                retryed++;
                                load();
                            });
                            this._rewardedVideoAd.onClose(function (res) {
                                var _a;
                                var isEnded = (res && res.isEnded) || res === undefined;
                                _this_1._rewardedVideoAd.offLoad();
                                _this_1._rewardedVideoAd.destroy();
                                _this_1._rewardedVideoAd = null;
                                (_a = callback.complete) === null || _a === void 0 ? void 0 : _a.call(callback, {
                                    code: isEnded ? 0 : -1,
                                    data: null,
                                    msg: isEnded,
                                    isEnded: isEnded
                                });
                            });
                        }
                        load = function () {
                            _this_1._rewardedVideoAd.load();
                        };
                        load();
                        return [2 /*return*/];
                }
            });
        });
    };
    //获得分享内容
    SdkClass.prototype.getShareData = function (params, callback, stopCallback) {
        return __awaiter(this, void 0, void 0, function () {
            var region, cacheShareData, _a, readCache, cShareData, productId, channelId, platform, transmits, func, type, sub_channel_id, open_id, shareData, err_14;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        region = (params === null || params === void 0 ? void 0 : params.region) || config_1.USER_INFO.region || '';
                        cacheShareData = utils_2.storage.get("rx_schedule_".concat(config_1.USER_INFO.tid, "_").concat(params.func, "_").concat(region));
                        _a = params.readCache, readCache = _a === void 0 ? true : _a;
                        if (readCache && cacheShareData) {
                            cShareData = JSON.parse(cacheShareData);
                            console.info('sdk 缓存分享数据：', cShareData);
                            this.setScheuleReportProps(cShareData === null || cShareData === void 0 ? void 0 : cShareData.data);
                            !stopCallback && callback.complete(cShareData);
                            return [2 /*return*/, cShareData];
                        }
                        productId = config_1.SYSTEM_INFO.productId, channelId = config_1.SYSTEM_INFO.channelId;
                        platform = 'huawei';
                        transmits = encodeURI(params.transmits || '');
                        func = params.func;
                        type = 'mini';
                        sub_channel_id = config_1.USER_INFO.subchannelid || '';
                        open_id = config_1.USER_INFO.openid;
                        return [4 /*yield*/, (0, apiForHuawei_1.getShareDataApi)({
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
                            })];
                    case 1:
                        shareData = _b.sent();
                        if (!stopCallback) {
                            callback.complete(shareData);
                        }
                        this.setScheuleReportProps(shareData === null || shareData === void 0 ? void 0 : shareData.data);
                        return [2 /*return*/, shareData];
                    case 2:
                        err_14 = _b.sent();
                        callback.complete(handleTrackError('', err_14));
                        this.track((0, utils_1.formatTrackParams)({
                            eventName: 'track_err',
                            apiName: 'getShareData',
                            reqParams: params,
                            errorInfo: err_14,
                            loginInfo: config_1.USER_INFO
                        }), {
                            complete: function (data) {
                                console.info('getShareData error add complete func when tracked:', data);
                            }
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 看广告完成上报
    SdkClass.prototype.shareSchedulingReport = function (params, callback) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var func, region, sub_channel_id, open_id, scheduling_event, Iparams, result_1, remaining_share_count, error_7;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 7, , 8]);
                        func = params.func;
                        region = (params === null || params === void 0 ? void 0 : params.region) || config_1.USER_INFO.region || '';
                        sub_channel_id = config_1.USER_INFO.subchannelid || '';
                        open_id = config_1.USER_INFO.openid || '';
                        scheduling_event = (params === null || params === void 0 ? void 0 : params.scheduling_event) === true ? 'done' : 'fail';
                        Iparams = __assign(__assign({ platform: enum_1.PLATFORM.MINIGAMEHUAWEI, type: 'mini', sub_channel_id: sub_channel_id, open_id: open_id }, params), { region: region, scheduling_event: scheduling_event, properties: __assign(__assign({ region: region }, this.scheuleReportProps), params === null || params === void 0 ? void 0 : params.properties) });
                        return [4 /*yield*/, (0, apiForHuawei_1.schedulingReportApi)(Iparams)];
                    case 1:
                        result_1 = _d.sent();
                        if (!(0, is_1.isEmpty)(result_1 === null || result_1 === void 0 ? void 0 : result_1.data)) return [3 /*break*/, 3];
                        this.scheduleInitMap = (0, is_1.omit)(this.scheduleInitMap, func);
                        utils_2.storage.remove("rx_schedule_".concat(config_1.USER_INFO.tid, "_").concat(func, "_").concat(region));
                        return [4 /*yield*/, this.shareSchedulingInit({}, {
                                complete: function () {
                                    console.log('shareSchedulingInit');
                                    callback.complete(result_1);
                                }
                            })];
                    case 2:
                        _d.sent();
                        return [2 /*return*/];
                    case 3:
                        remaining_share_count = ((_b = (_a = result_1 === null || result_1 === void 0 ? void 0 : result_1.data) === null || _a === void 0 ? void 0 : _a.scheduling) === null || _b === void 0 ? void 0 : _b.remaining_share_count) || 0;
                        if (!(remaining_share_count <= 0)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.shareSchedulingInit({}, {
                                complete: function () {
                                    console.log('shareSchedulingInit');
                                    callback.complete(result_1);
                                }
                            })];
                    case 4:
                        _d.sent();
                        return [2 /*return*/];
                    case 5:
                        this.scheduleInitMap[func] = (_c = result_1 === null || result_1 === void 0 ? void 0 : result_1.data) === null || _c === void 0 ? void 0 : _c.scheduling;
                        utils_2.storage.set("rx_schedule_".concat(config_1.USER_INFO.tid, "_").concat(func, "_").concat(region), JSON.stringify(result_1));
                        _d.label = 6;
                    case 6:
                        callback.complete(result_1);
                        return [3 /*break*/, 8];
                    case 7:
                        error_7 = _d.sent();
                        callback.complete(handleTrackError('', error_7));
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    // 分享调度初始化
    SdkClass.prototype.shareSchedulingInit = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var req, res, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(checkConfig_1.shareScheduleInitParams, callback, params)];
                    case 1:
                        _a.sent();
                        req = {
                            func: (params === null || params === void 0 ? void 0 : params.funcs) || [],
                            type: 'mini',
                            open_id: config_1.USER_INFO.openid || ''
                        };
                        return [4 /*yield*/, (0, apiForHuawei_1.schedulingInitApi)(req)];
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
    SdkClass.prototype.getShareScheduling = function (params) {
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
    // 获取商业化接口
    SdkClass.prototype.getOperationScene = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            var res, err_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apiForHuawei_1.getOperationSceneApi)()];
                    case 1:
                        res = _a.sent();
                        callback && callback.complete(res);
                        return [3 /*break*/, 3];
                    case 2:
                        err_15 = _a.sent();
                        callback && callback.complete(handleTrackError('', err_15));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 商业化上报接口
    SdkClass.prototype.reportWindowExposure = function (properties, callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.track({
                    event: '#window_exposure',
                    properties: properties
                }, {
                    complete: function (data) {
                        callback && callback.complete(data);
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    // 游戏区服信息查询
    SdkClass.prototype.getGameArea = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apiForHuawei_1.getGameAreaApi)(params.area_id)];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_9 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_9));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 游戏区服信息修改
    SdkClass.prototype.putGameArea = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apiForHuawei_1.putGameAreaApi)(params)];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_10 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_10));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 创建游戏区服
    SdkClass.prototype.createGameArea = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apiForHuawei_1.createGameAreaApi)(params)];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_11 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_11));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 删除游戏区服
    SdkClass.prototype.delGameArea = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apiForHuawei_1.delGameAreaApi)(params)];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_12 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_12));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 查询区服列表信息
    SdkClass.prototype.getGameAreaList = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apiForHuawei_1.getGameAreaListApi)()];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_13 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_13));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 创建角色
    SdkClass.prototype.createGameCharacter = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apiForHuawei_1.createGameCharacterApi)(params)];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_14 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_14));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 修改游戏角色信息
    SdkClass.prototype.putGameCharacter = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apiForHuawei_1.putGameCharacterApi)(params)];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_15 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_15));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 删除游戏角色
    SdkClass.prototype.delGameCharacter = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apiForHuawei_1.delGameCharacterApi)(params)];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_16 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_16));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 查询账号下角色信息列表
    SdkClass.prototype.getGameCharacterAccount = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apiForHuawei_1.getGameCharacterAccountApi)(params)];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_17 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_17));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 查询账号下某个区服下的角色信息列表
    SdkClass.prototype.getGameCharacter = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_18;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apiForHuawei_1.getGameCharacterApi)(params)];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_18 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_18));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 查询具体角色信息
    SdkClass.prototype.getGameAccountAreaCharacter = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_19;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apiForHuawei_1.getGameAccountAreaCharacterApi)(params)];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_19 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_19));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 邮件列表
    SdkClass.prototype.getEmailList = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_20;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apiForHuawei_1.getEmailListApi)(params)];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_20 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_20));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 邮件详情
    SdkClass.prototype.getEmailDetail = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_21;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apiForHuawei_1.getEmailDetailApi)(params)];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_21 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_21));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 邮件领取
    SdkClass.prototype.receiveEmail = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_22;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apiForHuawei_1.receiveEmailApi)(params)];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_22 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_22));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 邮件删除
    SdkClass.prototype.delEmail = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_23;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apiForHuawei_1.delEmailApi)(params)];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_23 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_23));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SdkClass.prototype.setGameInfo = function (cp_role_id, region_tag) {
        config_1.SYSTEM_INFO.cp_role_id = cp_role_id;
        config_1.SYSTEM_INFO.region_tag = region_tag;
    };
    SdkClass.prototype.searchGameAccount = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_24;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apiForHuawei_1.searchGameAccountApi)()];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_24 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_24));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return SdkClass;
}(index_common_1.default));
exports.default = SdkClass;
//# sourceMappingURL=index.huawei.js.map