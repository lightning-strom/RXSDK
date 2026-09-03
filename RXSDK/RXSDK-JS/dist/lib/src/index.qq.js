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
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var axios_miniprogram_adapter_1 = require("axios-miniprogram-adapter");
var index_common_1 = require("./index.common");
var paramsValid_1 = require("@/utils/paramsValid");
var checkConfig_1 = require("@/utils/checkConfig");
var qq_1 = require("@/utils/checkConfig/qq");
var utils_1 = require("@/utils/utils");
var utils_2 = require("@/utils/qq/utils");
var api_1 = require("@/api/api");
var config_1 = require("@/config");
var qq_2 = require("@/config/qq");
var stOffset_1 = require("@/utils/stOffset");
var is_1 = require("@/utils/is");
var const_1 = require("@/config/const");
// import dayjs from 'dayjs'
var day_1 = require("@/utils/day");
var v4_1 = require("uuid/v4");
var enum_1 = require("@/config/enum");
axios_1.default.defaults.adapter = axios_miniprogram_adapter_1.default;
var SdkQQ = /** @class */ (function (_super) {
    __extends(SdkQQ, _super);
    function SdkQQ(initParams) {
        var _this = _super.call(this, initParams) || this;
        _this._rewardAd = null;
        _this._bannerAd = null;
        _this._interstitialAd = null;
        _this._hasAd = {
            banner: undefined,
            interstitial: undefined,
            rewarded: undefined,
        };
        // private _shareMessageToFriendCallback?: WechatMinigame.OnShareMessageToFriendCallback
        _this._userInfoButton = null;
        _this.locationInfomation = null;
        _this.reportLocationTimer = null;
        //用于记录刷新session
        _this.refreshSession = 0;
        // 默认刷新时间 10 分钟
        _this.businessRuleDefaultRefreshTime = 600000;
        // 商业广告规则信息
        _this.businessRulesInfo = {
            // 定时器的编号
            timerId: 0,
            // 时间间隔
            refresh_time: _this.businessRuleDefaultRefreshTime,
            // 主窗口配置信息
            main_window_list: [],
            // 窗口配置信息
            window_list: [],
            // 版本-服务端缓存使用
            version: '',
            // 是否命中缓存
            hit_cache: false,
        };
        // 接口失败次数
        // private businessRuleFailCount = 0
        // test 轮询获取商业化接口数据
        // private intervalNum = 0
        // 商业化接口是否返回结果
        _this.businessRuleInvoking = false;
        // 条件获取商业化窗口队列
        _this.businessWindowsQueue = [];
        // 上报公共属性接口失败次数
        _this.trackPublicPropsFailCount = 0;
        /**
          * initConfig: SDK初始化配置
          * {
          *    [configKey]: 后端配置结构
          * }
          *
          * 例如：sdkconfig/init
          * {
          * "event_public_attr": {
                 "public_attr": {
                   "pay_over": ["property1", "scenes_id", "a"],
                   "event2": ["property1", "property2"],
                   "event3": ["property1", "property2"]
                 },
                 "refresh": 6000,
                 "version": "string"
             }
          *
          * */
        _this.initConfig = {};
        // 调度埋点
        _this.scheduleInitMap = {};
        // 获取分享数据缓存调度上报参数
        _this.scheuleReportProps = {};
        _this.subChannelId = null;
        _this.isPromoter = false;
        _this.game_id = '';
        _this.promoInfo = {
            timer: null,
            refresh_period_exp: 0,
            polling: 0,
            promo_code: ''
        };
        (0, paramsValid_1.invalidInitParams)(initParams, checkConfig_1.initParamsCheck);
        console.info('channel sdk check params passed');
        Object.assign(config_1.SYSTEM_INFO, qq_2.SYSTEM_INFO, __assign(__assign({}, initParams), { index: 0 }));
        console.info('SYSTEM_INFO: ', config_1.SYSTEM_INFO);
        // 获取初始化配置
        _this.getInitConfig({ complete: initParams.complete });
        return _this;
    }
    SdkQQ.prototype.addFeedback = function (params, callback) {
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
                        callback && callback.complete((0, utils_1.handleError)(err_1));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SdkQQ.prototype.getFeedbackList = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var res, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, api_1.getFeedbackListApi)(params)];
                    case 1:
                        res = _a.sent();
                        console.log(res);
                        return [3 /*break*/, 3];
                    case 2:
                        err_2 = _a.sent();
                        callback && callback.complete((0, utils_1.handleError)(err_2));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SdkQQ.prototype.getFeedbackDetail = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var res, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, api_1.getFeedbackDetailApi)(params)];
                    case 1:
                        res = _a.sent();
                        console.log(res);
                        return [3 /*break*/, 3];
                    case 2:
                        err_3 = _a.sent();
                        callback && callback.complete((0, utils_1.handleError)(err_3));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SdkQQ.prototype.collectProps = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var res, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, api_1.collectPropsApi)(params)];
                    case 1:
                        res = _a.sent();
                        console.log(res);
                        return [3 /*break*/, 3];
                    case 2:
                        err_4 = _a.sent();
                        callback && callback.complete((0, utils_1.handleError)(err_4));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SdkQQ.prototype.getAnnouncement = function (limit, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var productId, channelId, res, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(Number.isInteger(limit) && limit >= 1 && limit <= 100)) {
                            callback && callback.complete((0, utils_1.handleError)({
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
                        console.log(res);
                        return [3 /*break*/, 4];
                    case 3:
                        err_5 = _a.sent();
                        callback && callback.complete((0, utils_1.handleError)(err_5));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SdkQQ.prototype.clearPromoterTimer = function () {
        console.log('clearPromoterTimer');
        if (this.promoInfo.timer) {
            clearTimeout(this.promoInfo.timer);
            this.promoInfo.timer = null;
        }
    };
    // 启动定时器
    SdkQQ.prototype.startPromoterTimer = function (callback, autoRefresh) {
        var _this = this;
        if (autoRefresh === void 0) { autoRefresh = true; }
        var delay = this.promoInfo.refresh_period_exp < 1 ? (this.promoInfo.polling ? (this.promoInfo.polling * 1000) : 10000) : (this.promoInfo.refresh_period_exp * 1000);
        console.log('startPromoterTimer', delay);
        this.promoInfo.timer = setTimeout(function () {
            _this.getPromoDisplayKEY(callback, autoRefresh, false);
        }, delay);
    };
    SdkQQ.prototype.getPromoDisplayKEY = function (callback, autoRefresh, immediately) {
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
                callback && callback.complete((0, utils_1.handleError)(err));
            }
            else {
                if (autoRefresh) {
                    _this.startPromoterTimer(callback, autoRefresh);
                }
                else {
                    callback && callback.complete((0, utils_1.handleError)(err));
                }
            }
        });
    };
    SdkQQ.prototype.exchangePromoCDKEY = function (cdkey, callback) {
        (0, api_1.exchangePromoterCodeApi)(cdkey).then(function (res) {
            callback.complete(res);
        }).catch(function (err) {
            callback.complete((0, utils_1.handleError)(err));
        });
    };
    SdkQQ.prototype.publicSubchannelCheck = function (res) {
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
    SdkQQ.prototype.getInitConfig = function (callback) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function () {
            var initParams, res, config, version, _i, _f, key, prop_version, _serverTime, err_6, error;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        initParams = qq.getStorageSync('rx-init-params') || {};
                        _g.label = 1;
                    case 1:
                        _g.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, (0, api_1.getInitConf)({ version: (_a = initParams === null || initParams === void 0 ? void 0 : initParams.version) !== null && _a !== void 0 ? _a : {} })];
                    case 2:
                        res = _g.sent();
                        config = res.data || {};
                        version = {};
                        for (_i = 0, _f = Object.keys(config); _i < _f.length; _i++) {
                            key = _f[_i];
                            prop_version = (_c = (_b = config[key]) === null || _b === void 0 ? void 0 : _b.version) !== null && _c !== void 0 ? _c : '';
                            if (prop_version) {
                                version[key] = prop_version;
                                this.initConfig[key] = { timerId: 0 };
                            }
                            this.initConfig[key] = __assign(__assign({}, config[key]), this.initConfig[key]);
                        }
                        console.info('SDK initConfig: ', this.initConfig);
                        //检查是否需要传递subchannleid
                        this.publicSubchannelCheck(res);
                        qq.setStorageSync('rx-init-params', { version: version });
                        config_1.SYSTEM_INFO.SDK_INIT_FINISHED = true;
                        _serverTime = (_e = (_d = res === null || res === void 0 ? void 0 : res.data) === null || _d === void 0 ? void 0 : _d.server) === null || _e === void 0 ? void 0 : _e.time;
                        if (_serverTime) {
                            config_1.SYSTEM_INFO.st_offset = String(Number(_serverTime) - Date.now());
                        }
                        // 初始化成功后监听应用进入前台，刷新 st_offset
                        (0, stOffset_1.setupStOffsetRefreshForMiniGame)(typeof qq !== 'undefined' ? qq : null, api_1.getServerTime);
                        // 检查是否需要激活
                        this.checkNeedActivate();
                        this.loopGetPublicProps();
                        callback.complete({ code: 0 });
                        return [3 /*break*/, 4];
                    case 3:
                        err_6 = _g.sent();
                        error = new Error('初始化错误，或未初始化');
                        error.code = const_1.COMMON_ERROR_CODE.INIT_PARAMS_ERROR;
                        // data: 保留原始错误
                        error.data = {
                            data: err_6,
                        };
                        callback.complete((0, utils_1.handleError)(error));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // 获取归因数据
    SdkQQ.prototype.getAttributionData = function () {
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
    //检查是否需要激活
    SdkQQ.prototype.checkNeedActivate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var activeResult, source_ad, distinct_id, req, result, err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        activeResult = qq.getStorageSync('rx-active-result');
                        if (!!activeResult) return [3 /*break*/, 4];
                        source_ad = this.getAttributionData();
                        distinct_id = (0, v4_1.default)();
                        qq.setStorageSync('rx_distinct_id', distinct_id);
                        req = {
                            stage: 'init',
                            distinct_id: distinct_id,
                            source_ad: source_ad,
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, (0, api_1.activated)(req)];
                    case 2:
                        result = _a.sent();
                        qq.setStorageSync('rx-active-result', { isSuccess: true, activeResult: result.data });
                        return [3 /*break*/, 4];
                    case 3:
                        err_7 = _a.sent();
                        qq.setStorageSync('rx-active-result', { isSuccess: false, activeResult: req });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //格式化queryString
    SdkQQ.prototype.getLoginQsAndGenerateStruct = function () {
        var _a;
        var universal = (0, utils_2.getSearchQueries)();
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
                        user_attrs: leftProps,
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
        var subPackageInfo = qq.getStorageSync('rx_sub_package_info');
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
    SdkQQ.prototype.ActivePrefix = function (reqParams) {
        var loginState = qq.getStorageSync('rx-loginState');
        var activeSave = qq.getStorageSync('rx-active-result');
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
    SdkQQ.prototype.setSubChannelId = function (subChannelId) {
        try {
            qq.setStorageSync('rx_sub_package_info', { sub_channel_id: subChannelId });
            return { code: 0 };
        }
        catch (error) {
            return (0, utils_1.handleError)(error);
        }
    };
    /**
     * 用于设置自定义返回错误 Msg
     */
    SdkQQ.prototype.setErrorMsg = function (errMsg) {
        config_1.SYSTEM_INFO.errMsg = errMsg;
    };
    /**
     * 清空返回错误 Msg
     */
    SdkQQ.prototype.clearErrorMsg = function () {
        config_1.SYSTEM_INFO.errMsg = {
            default: ''
        };
    };
    // 登录接口
    SdkQQ.prototype.login = function (params, callback) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var needAuth, reqLoginData, code, userInfo, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        needAuth = (params === null || params === void 0 ? void 0 : params.version) === 'normal';
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 8, , 9]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(qq_1.qqgameLoginParamsCheck, callback, params)];
                    case 2:
                        _c.sent();
                        if (!needAuth) return [3 /*break*/, 4];
                        if (this._userInfoButton)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.authorize(params, callback)];
                    case 3:
                        _c.sent();
                        return [2 /*return*/];
                    case 4:
                        reqLoginData = {
                            ext: {},
                        };
                        if (!!params.login_openid) return [3 /*break*/, 6];
                        return [4 /*yield*/, (0, utils_1.asyncFunc)(qq.login)];
                    case 5:
                        code = (_c.sent()).code;
                        reqLoginData.ext.code = code;
                        _c.label = 6;
                    case 6:
                        console.info('sdk login without authorize');
                        console.info('=====================');
                        return [4 /*yield*/, this._login(params, reqLoginData)];
                    case 7:
                        userInfo = _c.sent();
                        try {
                            if ((((_a = userInfo === null || userInfo === void 0 ? void 0 : userInfo.data) === null || _a === void 0 ? void 0 : _a.user_flag) & 1) == 1) {
                                this.isPromoter = true;
                                this.game_id = (_b = userInfo === null || userInfo === void 0 ? void 0 : userInfo.data) === null || _b === void 0 ? void 0 : _b.cp_user_id;
                            }
                        }
                        catch (e) { }
                        callback.complete(userInfo);
                        return [3 /*break*/, 9];
                    case 8:
                        error_1 = _c.sent();
                        callback.complete((0, utils_1.handleError)(error_1));
                        this.track({
                            complete: function (data) {
                                console.info('login error add complete func when tracked:', data);
                            },
                        }, (0, utils_1.formatTrackParams)({
                            eventName: 'track_err',
                            apiName: 'login',
                            reqParams: params,
                            errorInfo: error_1,
                            loginInfo: config_1.USER_INFO,
                        }));
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    // 授权登录接口
    SdkQQ.prototype.authorize = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var reqLoginData, code, data, error_2, userInfo, error_3;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.info('sdk trigger authorize: ', params);
                        console.info('=====================');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 9, , 10]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(qq_1.qqgameLoginParamsCheck, callback, params)];
                    case 2:
                        _a.sent();
                        if (this._userInfoButton)
                            return [2 /*return*/];
                        reqLoginData = {
                            ext: {},
                        };
                        if (!!params.login_openid) return [3 /*break*/, 4];
                        return [4 /*yield*/, (0, utils_1.asyncFunc)(qq.login)];
                    case 3:
                        code = (_a.sent()).code;
                        reqLoginData.ext.code = code;
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, (0, utils_2.getUserInfo)({
                                screenWidth: config_1.SYSTEM_INFO.screenWidth,
                                screenHeight: config_1.SYSTEM_INFO.screenHeight,
                                button: params === null || params === void 0 ? void 0 : params.button,
                                withCredentials: true,
                                setInstance: function (instance) {
                                    _this._userInfoButton = instance;
                                    return instance;
                                },
                                autoClose: params === null || params === void 0 ? void 0 : params.autoClose,
                                isCheck: params === null || params === void 0 ? void 0 : params.isCheck,
                            })];
                    case 5:
                        data = _a.sent();
                        reqLoginData.ext.encryptedData = data.encryptedData;
                        reqLoginData.ext.iv = data.iv;
                        return [3 /*break*/, 7];
                    case 6:
                        error_2 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_2));
                        return [2 /*return*/];
                    case 7:
                        console.info('sdk login after authorize data: ', reqLoginData);
                        console.info('=====================');
                        return [4 /*yield*/, this._login(params, reqLoginData)];
                    case 8:
                        userInfo = _a.sent();
                        callback.complete(userInfo);
                        return [2 /*return*/, userInfo];
                    case 9:
                        error_3 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_3));
                        this.track({
                            complete: function (data) {
                                console.info('authorize error add complete func when tracked:', data);
                            },
                        }, (0, utils_1.formatTrackParams)({
                            eventName: 'track_err',
                            apiName: 'authorize',
                            reqParams: params,
                            errorInfo: error_3,
                            loginInfo: config_1.USER_INFO,
                        }));
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    SdkQQ.prototype._login = function (params, loginData) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var user_source, source_ad, version, sign_fields, now, distinct_idLocal, distinct_id, reqLoginData, userInfo, reflowEnabled, reqLogin, error_4;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 5, , 6]);
                        user_source = this.getLoginQsAndGenerateStruct();
                        source_ad = this.getAttributionData();
                        version = params.version, sign_fields = params.sign_fields;
                        now = new Date().getTime();
                        distinct_idLocal = qq.getStorageSync('rx_distinct_id');
                        distinct_id = distinct_idLocal || (0, v4_1.default)();
                        if (!distinct_idLocal) {
                            qq.setStorageSync('rx_distinct_id', distinct_id);
                        }
                        reqLoginData = __assign(__assign({ ts: now, method: (params === null || params === void 0 ? void 0 : params.method) || 'mobileqq', distinct_id: distinct_id }, user_source), { sign_fields: sign_fields, ext: __assign(__assign({}, loginData === null || loginData === void 0 ? void 0 : loginData.ext), { version: version }) });
                        userInfo = null;
                        if (!params.login_openid) return [3 /*break*/, 2];
                        //二次登录
                        reqLoginData.login_openid = params.login_openid;
                        console.info('sdk 二次登录 api req: ', reqLoginData);
                        return [4 /*yield*/, (0, api_1.loginByTokenApi)(this.ActivePrefix(reqLoginData))];
                    case 1:
                        userInfo = _c.sent();
                        qq.setStorageSync('rx-loginState', 1);
                        return [3 /*break*/, 4];
                    case 2:
                        reflowEnabled = ((_b = (_a = this.initConfig) === null || _a === void 0 ? void 0 : _a.advertise_switch) === null || _b === void 0 ? void 0 : _b.switch) === 1;
                        reqLogin = reflowEnabled
                            ? __assign(__assign({}, reqLoginData), { device: source_ad }) : __assign({}, reqLoginData);
                        console.info('sdk normal login api req: ', reqLogin);
                        return [4 /*yield*/, (0, api_1.loginByCredentialApi)(this.ActivePrefix(reqLogin))];
                    case 3:
                        userInfo = _c.sent();
                        qq.setStorageSync('rx-loginState', 1);
                        _c.label = 4;
                    case 4:
                        Object.assign(config_1.USER_INFO, userInfo.data);
                        console.info('sdk USER_INFO :', config_1.USER_INFO);
                        qq.setStorageSync('rxToken', userInfo.data.token);
                        !(params === null || params === void 0 ? void 0 : params.reconnect_login) &&
                            this.refreshBusinessData({
                                complete: function () { },
                            }, !(params === null || params === void 0 ? void 0 : params.cancel_business_queue));
                        return [2 /*return*/, userInfo];
                    case 5:
                        error_4 = _c.sent();
                        throw error_4;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    // 支付
    SdkQQ.prototype.pay = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var error, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(qq_1.qqgamePayCheckParams, callback, params)];
                    case 1:
                        _a.sent();
                        if (params.indulge_auth == 1 && !params.age) {
                            error = new Error('when indulge_auth equal 1,the age must be required');
                            error.code = const_1.COMMON_ERROR_CODE.PAY_PARAMS_ERROR;
                            throw error;
                        }
                        this.order(params, callback);
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_5));
                        this.track({
                            complete: function (data) {
                                console.info('pay error add complete func when tracked:', data);
                            },
                        }, (0, utils_1.formatTrackParams)({
                            eventName: 'track_err',
                            apiName: 'pay',
                            reqParams: params,
                            errorInfo: error_5,
                            loginInfo: config_1.USER_INFO,
                        }));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SdkQQ.prototype.order = function (params, _a) {
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            var reqOrder, ext, _b, amount, prepayId, error_6;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        params.ext = (params === null || params === void 0 ? void 0 : params.ext) || {};
                        reqOrder = __assign(__assign({}, params), { currency: 'CNY', openid: config_1.USER_INFO.openid, sub_channel_id: config_1.USER_INFO.subchannelid, is_debug: params.is_debug || 0, env: params.env || 0, callback_from: 0, ext: __assign(__assign({}, params.ext), { qq_openid: config_1.USER_INFO.tid }) });
                        return [4 /*yield*/, (0, api_1.orderApi)(reqOrder)];
                    case 1:
                        ext = (_c.sent()).data.ext;
                        _b = ext || {}, amount = _b.amount, prepayId = _b.prepayId;
                        return [4 /*yield*/, (0, utils_1.asyncFunc)(qq.requestMidasPayment, {
                                prepayId: prepayId,
                                setEnv: params.env || 0,
                                starCurrency: amount,
                            })];
                    case 2:
                        _c.sent();
                        complete({ code: 0 });
                        this.refreshSession = 0;
                        return [3 /*break*/, 4];
                    case 3:
                        error_6 = _c.sent();
                        if ((error_6 === null || error_6 === void 0 ? void 0 : error_6.code) == 152413 && this.refreshSession < 2) {
                            // session 过期处理
                            this.refreshSession++;
                            this.refreshSessionFunc().then(function () {
                                _this.pay(params, { complete: complete });
                            });
                        }
                        else {
                            if (error_6.errCode == -2) {
                                error_6.code = 4001;
                                error_6.thirdcode = -2;
                            }
                            if (error_6.errCode == -1 || error_6.errCode == -3 || error_6.errCode == -4) {
                                error_6.code = const_1.COMMON_ERROR_CODE.PAY_ERROR;
                                error_6.thirdcode = -1;
                            }
                            complete((0, utils_1.handleError)(error_6));
                            this.track({
                                complete: function (data) {
                                    console.info('order error add complete func when tracked:', data);
                                },
                            }, (0, utils_1.formatTrackParams)({
                                eventName: 'track_err',
                                apiName: 'order',
                                reqParams: params,
                                errorInfo: error_6,
                                loginInfo: config_1.USER_INFO,
                            }));
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // private async payIos(
    //   { params, desc = '', func, title, image, reconfirm, sessionFrom }: ConversationParams,
    //   { complete }: Partial<IMethodParams>
    // ) {
    //   if (func) {
    //     const { data } = await getShareDataApi({
    //       product_id: SYSTEM_INFO.productId,
    //       channel_id: SYSTEM_INFO.channelId,
    //       sub_channel_id: USER_INFO.subchannelid || '',
    //       region: USER_INFO.region || '',
    //       func,
    //       platform: 'wechat',
    //       type: 'mini',
    //     })
    //     if (data) {
    //       title = data.content?.content
    //       image = data.content?.image
    //     }
    //   }
    //   // await asyncFunc(qq.showModal, {
    //   //   title: MODAL_TITLE,
    //   //   content: '请点击确定进入[客服会话]进行充值!',
    //   //   showCancel: false,
    //   // })
    //   const openConversation = async () => {
    //     try {
    //       await asyncFunc(qq.openCustomerServiceConversation, {
    //         showMessageCard: true,
    //         sessionFrom: params,
    //         sendMessageTitle: title,
    //         sendMessagePath: params,
    //         sendMessageImg: image,
    //       })
    //     } catch (error: any) {
    //       const { errMsg } = error
    //       if (errMsg && !errMsg.includes('cancel')) {
    //         throw error
    //       }
    //       const { confirm } = await asyncFunc(qq.showModal, {
    //         title: MODAL_TITLE,
    //         content: `因版本限制, 需通过[客服会话]${desc}, 请您谅解!`,
    //         cancelText: '我知道了',
    //         confirmText: '前往充值',
    //       })
    //       if (confirm) {
    //         await openConversation()
    //       } else {
    //         throw new Error('用户取消')
    //       }
    //     }
    //   }
    //   await openConversation()
    // }
    SdkQQ.prototype.refreshSessionFunc = function () {
        return __awaiter(this, void 0, void 0, function () {
            var code, res, err_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, utils_1.asyncFunc)(qq.login)];
                    case 1:
                        code = (_a.sent()).code;
                        return [4 /*yield*/, (0, api_1.refreshUserInfo)({
                                version: 'base',
                                code: code,
                            })];
                    case 2:
                        res = _a.sent();
                        return [2 /*return*/, res];
                    case 3:
                        err_8 = _a.sent();
                        this.track({
                            complete: function (data) {
                                console.info('refreshSessionFunc error add complete func when tracked:', data);
                            },
                        }, (0, utils_1.formatTrackParams)({
                            eventName: 'track_err',
                            apiName: 'refreshSessionFunc',
                            reqParams: {},
                            errorInfo: err_8,
                            loginInfo: config_1.USER_INFO,
                        }));
                        return [2 /*return*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SdkQQ.prototype.setScheuleReportProps = function (data) {
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
            platform: (data === null || data === void 0 ? void 0 : data.platform) || enum_1.PLATFORM.QQ,
        };
    };
    //获得分享内容
    SdkQQ.prototype.getShareData = function (params, callback, stopCallback) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var region, cacheShareData, _c, readCache, cShareData, productId, channelId, platform, transmits, func, type, sub_channel_id, open_id, shareData_1, err_9;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(qq_1.qqgameShareCheckParams, callback, params)];
                    case 1:
                        _d.sent();
                        region = (params === null || params === void 0 ? void 0 : params.region) || config_1.USER_INFO.region || '';
                        cacheShareData = qq.getStorageSync("rx_schedule_".concat(config_1.USER_INFO.tid, "_").concat(params.func, "_").concat(region));
                        _c = params.readCache, readCache = _c === void 0 ? true : _c;
                        if (readCache && cacheShareData) {
                            cShareData = JSON.parse(cacheShareData);
                            console.info('sdk 缓存分享数据：', cShareData);
                            this.setScheuleReportProps(cShareData === null || cShareData === void 0 ? void 0 : cShareData.data);
                            !stopCallback && callback.complete(cShareData);
                            return [2 /*return*/, cShareData];
                        }
                        productId = config_1.SYSTEM_INFO.productId, channelId = config_1.SYSTEM_INFO.channelId;
                        platform = enum_1.PLATFORM.QQ;
                        transmits = encodeURI(params.transmits || '');
                        func = params.func;
                        type = 'mini';
                        sub_channel_id = config_1.USER_INFO.subchannelid || '';
                        open_id = config_1.USER_INFO.openid;
                        return [4 /*yield*/, (0, api_1.getShareDataApi)({
                                func: func,
                                transmits: transmits,
                                product_id: productId,
                                channel_id: channelId,
                                platform: platform,
                                type: type,
                                region: region,
                                sub_channel_id: sub_channel_id,
                                open_id: open_id,
                            })];
                    case 2:
                        shareData_1 = _d.sent();
                        if (((_b = (_a = shareData_1 === null || shareData_1 === void 0 ? void 0 : shareData_1.data) === null || _a === void 0 ? void 0 : _a.scheduling) === null || _b === void 0 ? void 0 : _b.remaining_share_count) <= 0) {
                            this.shareSchedulingInit({}, {
                                complete: function () {
                                    if (!stopCallback) {
                                        callback.complete(shareData_1);
                                    }
                                    _this.setScheuleReportProps(shareData_1 === null || shareData_1 === void 0 ? void 0 : shareData_1.data);
                                }
                            });
                            return [2 /*return*/, shareData_1];
                        }
                        if (!stopCallback) {
                            callback.complete(shareData_1);
                        }
                        this.setScheuleReportProps(shareData_1 === null || shareData_1 === void 0 ? void 0 : shareData_1.data);
                        return [2 /*return*/, shareData_1];
                    case 3:
                        err_9 = _d.sent();
                        callback.complete((0, utils_1.handleError)(err_9));
                        this.track({
                            complete: function (data) {
                                console.info('getShareData error add complete func when tracked:', data);
                            },
                        }, (0, utils_1.formatTrackParams)({
                            eventName: 'track_err',
                            apiName: 'getShareData',
                            reqParams: params,
                            errorInfo: err_9,
                            loginInfo: config_1.USER_INFO,
                        }));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //分享接口
    SdkQQ.prototype.share = function (params, _a) {
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            var shareData_2, timeout_1, onHide_1, onShow_1, query, err_10;
            var _this = this;
            return __generator(this, function (_y) {
                switch (_y.label) {
                    case 0:
                        _y.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(qq_1.qqgameShareCheckParams, { complete: complete }, params)];
                    case 1:
                        _y.sent();
                        return [4 /*yield*/, this.getShareData(params, { complete: complete }, true)];
                    case 2:
                        shareData_2 = _y.sent();
                        console.info('sdk getShareData info: ', shareData_2);
                        timeout_1 = setTimeout(function () {
                            var error = new Error('分享拉起超时');
                            error.code = const_1.COMMON_ERROR_CODE.SHARE_TRIGGER_OVERTIME;
                            error.data = shareData_2;
                            complete((0, utils_1.handleError)(error));
                        }, 2000);
                        onHide_1 = function () {
                            clearTimeout(timeout_1);
                            qq.offHide(onHide_1);
                        };
                        onShow_1 = function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                qq.offShow(onShow_1);
                                complete(shareData_2);
                                return [2 /*return*/];
                            });
                        }); };
                        query = utils_1.qs.stringify({
                            type: 'rx',
                            user_source: 'share',
                            platform: ((_b = shareData_2 === null || shareData_2 === void 0 ? void 0 : shareData_2.data) === null || _b === void 0 ? void 0 : _b.platform) || '',
                            transmits: encodeURIComponent((params === null || params === void 0 ? void 0 : params.transmits) || ''),
                            landing_id: (_d = (_c = shareData_2 === null || shareData_2 === void 0 ? void 0 : shareData_2.data) === null || _c === void 0 ? void 0 : _c.content) === null || _d === void 0 ? void 0 : _d.landing_id,
                            trigger_id: (_f = (_e = shareData_2 === null || shareData_2 === void 0 ? void 0 : shareData_2.data) === null || _e === void 0 ? void 0 : _e.trigger) === null || _f === void 0 ? void 0 : _f.id,
                            trigger_tag: (_h = (_g = shareData_2 === null || shareData_2 === void 0 ? void 0 : shareData_2.data) === null || _g === void 0 ? void 0 : _g.trigger) === null || _h === void 0 ? void 0 : _h.tag,
                            trigger_type: (_k = (_j = shareData_2 === null || shareData_2 === void 0 ? void 0 : shareData_2.data) === null || _j === void 0 ? void 0 : _j.trigger) === null || _k === void 0 ? void 0 : _k.type,
                            material_type: (_m = (_l = shareData_2 === null || shareData_2 === void 0 ? void 0 : shareData_2.data) === null || _l === void 0 ? void 0 : _l.content) === null || _m === void 0 ? void 0 : _m.material_type,
                            material_id: (_p = (_o = shareData_2 === null || shareData_2 === void 0 ? void 0 : shareData_2.data) === null || _o === void 0 ? void 0 : _o.content) === null || _p === void 0 ? void 0 : _p.material_id,
                            strategy_type: (_r = (_q = shareData_2 === null || shareData_2 === void 0 ? void 0 : shareData_2.data) === null || _q === void 0 ? void 0 : _q.strategy) === null || _r === void 0 ? void 0 : _r.type,
                            strategy_id: (_t = (_s = shareData_2 === null || shareData_2 === void 0 ? void 0 : shareData_2.data) === null || _s === void 0 ? void 0 : _s.strategy) === null || _t === void 0 ? void 0 : _t.id,
                            share_time: Math.floor(new Date().getTime() / 1000),
                            share_type: 'mini',
                            inviter_region: config_1.USER_INFO.region || '',
                            inviter_openid: config_1.USER_INFO.openid,
                            inviter_productid: config_1.SYSTEM_INFO.productId,
                            inviter_channelid: config_1.SYSTEM_INFO.channelId,
                            inviter_subchannelid: config_1.USER_INFO === null || config_1.USER_INFO === void 0 ? void 0 : config_1.USER_INFO.subchannelid,
                        });
                        qq.onHide(onHide_1);
                        qq.onShow(onShow_1);
                        console.log('params: ', params);
                        qq.shareAppMessage({
                            title: params.title || ((_v = (_u = shareData_2 === null || shareData_2 === void 0 ? void 0 : shareData_2.data) === null || _u === void 0 ? void 0 : _u.content) === null || _v === void 0 ? void 0 : _v.content),
                            imageUrl: params.imageUrl || ((_x = (_w = shareData_2 === null || shareData_2 === void 0 ? void 0 : shareData_2.data) === null || _w === void 0 ? void 0 : _w.content) === null || _x === void 0 ? void 0 : _x.image),
                            query: params.query ? "".concat(query, "&").concat(params.query) : query,
                            shareAppType: params.shareAppType || 'qq',
                            complete: function () {
                                clearTimeout(timeout_1);
                            },
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        err_10 = _y.sent();
                        complete((0, utils_1.handleError)(err_10));
                        this.track({
                            complete: function (data) {
                                console.info('share error add complete func when tracked:', data);
                            },
                        }, (0, utils_1.formatTrackParams)({
                            eventName: 'track_err',
                            apiName: 'share',
                            reqParams: params,
                            errorInfo: err_10,
                            loginInfo: config_1.USER_INFO,
                        }));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //数据上报
    SdkQQ.prototype.track = function (callback, params) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var getDevicecode, devicecode, type, time, uuids, platform_id, copyCpid, product_id, cpid, publicPropskey, publicPropsByCache, publicProps, reqarr, result, err_11;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(checkConfig_1.checkTrackParams, callback, params)];
                    case 1:
                        _d.sent();
                        getDevicecode = function () {
                            var devicecode = qq.getStorageSync('rx_devicecode');
                            if (devicecode) {
                                return devicecode.code;
                            }
                            else {
                                var code = (0, v4_1.default)();
                                qq.setStorageSync('rx_devicecode', { code: code, openIds: {} });
                                return code;
                            }
                        };
                        devicecode = getDevicecode();
                        type = 'track';
                        time = (0, day_1.formatDate)('YYYY-MM-DDTHH:mm:ss.SSSZ');
                        uuids = (0, v4_1.default)();
                        platform_id = 4;
                        copyCpid = config_1.SYSTEM_INFO.cpid, product_id = config_1.SYSTEM_INFO.productId;
                        cpid = Number(copyCpid);
                        publicPropskey = ((_c = (_b = (_a = this.initConfig) === null || _a === void 0 ? void 0 : _a.event_public_attr) === null || _b === void 0 ? void 0 : _b.public_attr) === null || _c === void 0 ? void 0 : _c[params.event]) || [];
                        publicPropsByCache = qq.getStorageSync('rx_public_props');
                        publicProps = (0, is_1.pick)(publicPropsByCache, publicPropskey);
                        console.log('公共属性:', publicProps);
                        reqarr = [
                            __assign({ type: type, time: time, uuid: uuids, distinct_id: config_1.USER_INFO.openid, sub_channel_id: config_1.USER_INFO.subchannelid, platform_id: platform_id, product_id: product_id, ip: '127.0.0.1', cpid: cpid, channel_id: config_1.SYSTEM_INFO.channelId, devicecode: devicecode }, __assign(__assign({}, params), { properties: __assign(__assign({}, publicProps), params.properties) })),
                        ];
                        !config_1.USER_INFO.subchannelid || (reqarr[0].sub_channel_id = config_1.USER_INFO.subchannelid);
                        return [4 /*yield*/, (0, api_1.trackApi)(reqarr)];
                    case 2:
                        result = _d.sent();
                        callback.complete(__assign(__assign({}, result), { data: null, msg: 'track success' }));
                        return [3 /*break*/, 4];
                    case 3:
                        err_11 = _d.sent();
                        callback.complete((0, utils_1.handleError)(err_11));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //商业广告
    SdkQQ.prototype.getAllBusinessData = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            var data, result;
            return __generator(this, function (_a) {
                try {
                    data = (0, is_1.omit)(this.businessRulesInfo, 'timerId');
                    result = { code: 0, data: data };
                    callback.complete(result);
                }
                catch (error) {
                    callback.complete((0, utils_1.handleError)(error));
                }
                return [2 /*return*/];
            });
        });
    };
    // 轮训商业化广告信息
    // private async loopGetBusinessRules() {
    //   const repeat = (ms: number) => {
    //     this.businessRulesInfo.timerId && clearTimeout(this.businessRulesInfo.timerId)
    //     this.businessRulesInfo.timerId = setTimeout(() => {
    //       // this.intervalNum++
    //       // console.log("setInterval", this.intervalNum);
    //       getRules()
    //       // repeat(ms)
    //     }, ms)
    //   }
    //   const getRules = async () => {
    //     try {
    //       const res = await getBusinessRules(this.businessRulesInfo.version)
    //       const {
    //         refresh_time = this.businessRuleDefaultRefreshTime,
    //         main_window_list = [],
    //         window_list = [],
    //       } = res?.data || {}
    //       this.businessRulesInfo.refresh_time = refresh_time
    //       this.businessRulesInfo.main_window_list = main_window_list
    //       this.businessRulesInfo.window_list = window_list
    //       repeat(this.businessRulesInfo.refresh_time)
    //     } catch (error) {
    //       handleError(error)
    //       if (this.businessRuleFailCount < 1) {
    //         // 首次获取失败3秒后重试
    //         this.businessRuleFailCount += 1
    //         repeat(3000)
    //       } else {
    //         // 再失败每十分钟后重试，直至成功
    //         this.businessRuleFailCount += 1
    //         repeat(600000)
    //       }
    //     }
    //   }
    //   getRules()
    // }
    // 条件获取商业化窗口数据
    SdkQQ.prototype.getBusinessData = function (params, callback) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var checkCache, window_key_1, event_1, _c, before_event, _d, cache_1, cacheKey_1, _e, _f, _g, auto_popups, _h, manual_popups, matchWindows, windows, result, error_7;
            var _this = this;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        // console.log('sdk businessRulesInfo: ', this.businessRulesInfo)
                        // 如果登录接口内部调用的商业化接口没有返回结果，将此接口按调用次序缓存起来，接口结果回来后一次返回
                        // cp 主动调用商业化接口不管，需要他们自己在接口返回后条件获取商业化窗口数据
                        if (this.businessRuleInvoking) {
                            this.businessWindowsQueue.push(function () { return _this.getBusinessData(params, callback); });
                            return [2 /*return*/];
                        }
                        checkCache = function () {
                            var currentDate = (0, day_1.formatDate)('YYYY-MM-DD');
                            var cacheKeyPrefix = 'rx_business_popup_';
                            var cacheKey = "".concat(cacheKeyPrefix).concat(currentDate);
                            var cache = qq.getStorageSync(cacheKey);
                            if (!cache) {
                                cache = {};
                                qq.setStorageSync(cacheKey, {});
                            }
                            // 删除当天之前的商业化窗口缓存
                            (0, utils_2.removeStorageByPrefix)(cacheKeyPrefix, function (key) { return key.startsWith(cacheKeyPrefix) && !key.endsWith(currentDate); });
                            console.info('sdk business window cacheKey: ', cacheKey, ' cache: ', cache);
                            return { cache: cache, cacheKey: cacheKey };
                        };
                        _j.label = 1;
                    case 1:
                        _j.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(checkConfig_1.checkIReqBusinessData, callback, params)];
                    case 2:
                        _j.sent();
                        window_key_1 = params.window_key, event_1 = params.event, _c = params.before_event, before_event = _c === void 0 ? '' : _c;
                        _d = checkCache(), cache_1 = _d.cache, cacheKey_1 = _d.cacheKey;
                        _e = ((_a = this.businessRulesInfo.main_window_list) === null || _a === void 0 ? void 0 : _a.filter(function (window) { return window.window_key === window_key_1; }))[0], _f = _e === void 0 ? {} : _e, _g = _f.auto_popups, auto_popups = _g === void 0 ? {} : _g, _h = _f.manual_popups, manual_popups = _h === void 0 ? {} : _h;
                        matchWindows = [];
                        // 匹配自动窗口, 匹配到自动窗口，忽略前置事件
                        matchWindows = (auto_popups === null || auto_popups === void 0 ? void 0 : auto_popups[event_1]) || [];
                        // 匹配手动窗口
                        if (!(matchWindows === null || matchWindows === void 0 ? void 0 : matchWindows.length)) {
                            matchWindows = ((_b = manual_popups === null || manual_popups === void 0 ? void 0 : manual_popups[event_1]) === null || _b === void 0 ? void 0 : _b[before_event]) || [];
                        }
                        console.info('sdk matchWindows: ', matchWindows);
                        windows = (0, is_1.compact)(matchWindows.map(function (matWindow) {
                            var _a;
                            var windowInfo = (_a = _this.businessRulesInfo.window_list) === null || _a === void 0 ? void 0 : _a.find(function (window) { return window.window_key === matWindow.window_key; });
                            if (windowInfo) {
                                if (!(0, is_1.isNil)(matWindow === null || matWindow === void 0 ? void 0 : matWindow.day_limit)) {
                                    // daily_limit 存在说明是自动弹窗
                                    var key = "".concat(window_key_1, "_").concat(event_1, "_").concat(matWindow.window_key);
                                    var count = cache_1[key] || 0;
                                    if ((matWindow === null || matWindow === void 0 ? void 0 : matWindow.day_limit) === count)
                                        return;
                                    cache_1[key] = count + 1;
                                    // console.log(key, cache[key])
                                    qq.setStorageSync(cacheKey_1, cache_1);
                                }
                                return windowInfo;
                            }
                        }));
                        console.log('result windows: ', windows);
                        result = { code: 0, data: windows };
                        callback.complete(result);
                        return [3 /*break*/, 4];
                    case 3:
                        error_7 = _j.sent();
                        callback.complete((0, utils_1.handleError)(error_7));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // 更新商业化窗口数据
    SdkQQ.prototype.refreshBusinessData = function (callback, isRecord) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data, hit_cache, _a, version, _b, refresh_time, _c, main_window_list, _d, window_list, error_8;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        // this.loopGetBusinessRules()
                        isRecord && (this.businessRuleInvoking = true);
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, (0, api_1.getBusinessRules)(this.businessRulesInfo.version)];
                    case 2:
                        res = _e.sent();
                        data = (res === null || res === void 0 ? void 0 : res.data) || {};
                        hit_cache = data.hit_cache, _a = data.version, version = _a === void 0 ? '' : _a, _b = data.refresh_time, refresh_time = _b === void 0 ? this.businessRuleDefaultRefreshTime : _b;
                        _c = data.main_window_list, main_window_list = _c === void 0 ? [] : _c, _d = data.window_list, window_list = _d === void 0 ? [] : _d;
                        if (!hit_cache) {
                            this.businessRulesInfo.main_window_list = main_window_list;
                            this.businessRulesInfo.window_list = window_list;
                        }
                        this.businessRulesInfo.refresh_time = refresh_time;
                        this.businessRulesInfo.version = version;
                        this.businessRulesInfo.hit_cache = hit_cache;
                        (callback === null || callback === void 0 ? void 0 : callback.complete) && callback.complete({ code: 0 });
                        return [3 /*break*/, 5];
                    case 3:
                        error_8 = _e.sent();
                        (callback === null || callback === void 0 ? void 0 : callback.complete) && callback.complete((0, utils_1.handleError)(error_8));
                        return [3 /*break*/, 5];
                    case 4:
                        isRecord && this.dispatchBusinessWindowsQueue();
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SdkQQ.prototype.dispatchBusinessWindowsQueue = function () {
        return __awaiter(this, void 0, void 0, function () {
            var execute;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.businessRuleInvoking = false;
                        execute = function () {
                            while (_this.businessWindowsQueue.length) {
                                var queueGetBusinessData = _this.businessWindowsQueue.shift();
                                queueGetBusinessData();
                            }
                        };
                        return [4 /*yield*/, Promise.resolve(execute())];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // 商业化下单
    SdkQQ.prototype.requestBusinessOrder = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, err_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(checkConfig_1.checkIReqBusinessOrder, callback, params)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, api_1.businessOrderApi)(params)];
                    case 2:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 4];
                    case 3:
                        err_12 = _a.sent();
                        callback.complete((0, utils_1.handleError)(err_12));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //同步用户信息
    SdkQQ.prototype.infoSync = function (_a, params) {
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            var code, _b, encryptedData, iv, data, error_9;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, (0, utils_1.asyncFunc)(qq.login)];
                    case 1:
                        code = (_c.sent()).code;
                        return [4 /*yield*/, (0, utils_2.getUserInfo)({
                                screenWidth: config_1.SYSTEM_INFO.screenWidth,
                                screenHeight: config_1.SYSTEM_INFO.screenHeight,
                                button: params === null || params === void 0 ? void 0 : params.button,
                                withCredentials: true,
                                lang: params === null || params === void 0 ? void 0 : params.lang,
                                setInstance: function (instance) {
                                    _this._userInfoButton = instance;
                                    return instance;
                                },
                                autoClose: params === null || params === void 0 ? void 0 : params.autoClose,
                                isCheck: params === null || params === void 0 ? void 0 : params.isCheck,
                            })];
                    case 2:
                        _b = _c.sent(), encryptedData = _b.encryptedData, iv = _b.iv;
                        return [4 /*yield*/, (0, api_1.refreshUserInfo)({
                                code: code,
                                encryptedData: encryptedData,
                                iv: iv,
                                version: (params === null || params === void 0 ? void 0 : params.version) || 'normal',
                            })];
                    case 3:
                        data = _c.sent();
                        complete(data);
                        return [3 /*break*/, 5];
                    case 4:
                        error_9 = _c.sent();
                        complete((0, utils_1.handleError)(error_9));
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // 检测是否授权用户信息
    SdkQQ.prototype.isAuthorizeUserInfo = function (_a) {
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                try {
                    qq.getSetting({
                        success: function (res) {
                            complete({
                                code: 0,
                                isAuthorize: res.authSetting['scope.userInfo'] === undefined
                                    ? false
                                    : res.authSetting['scope.userInfo'],
                            });
                        },
                        fail: function (err) {
                            complete({ code: 0, isAuthorize: false });
                        },
                    });
                }
                catch (error) {
                    complete((0, utils_1.handleError)(error));
                }
                return [2 /*return*/];
            });
        });
    };
    // 取消用户授权
    SdkQQ.prototype.cancelUserInfoAuthorize = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this._userInfoButton && this._userInfoButton.destroy();
                this._userInfoButton = null;
                return [2 /*return*/];
            });
        });
    };
    /**
     * 广告相关接口
     */
    //激励广告
    SdkQQ.prototype.rewardedVideoAd = function (data, _a) {
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            var fail, ad_1, onClose_1, catchLoadAndShowError_1, error_10;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
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
                            complete((0, utils_1.handleError)(err));
                            _this.track({
                                complete: function (data) {
                                    console.info('rewardedVideoAd error add complete func when tracked:', data);
                                },
                            }, (0, utils_1.formatTrackParams)({
                                eventName: 'track_err',
                                apiName: 'rewardedVideoAd',
                                reqParams: data,
                                errorInfo: error,
                                loginInfo: config_1.USER_INFO,
                            }));
                        };
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        onClose_1 = function (_a) {
                            var isEnded = _a.isEnded;
                            return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_b) {
                                    ad_1.offClose(onClose_1);
                                    complete({
                                        code: 0,
                                        isEnded: isEnded,
                                    });
                                    return [2 /*return*/];
                                });
                            });
                        };
                        if (!!this._rewardAd) return [3 /*break*/, 3];
                        ad_1 = qq.createRewardedVideoAd({
                            adUnitId: data.adUnitId,
                        });
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                var timer = setTimeout(function () {
                                    reject({ code: const_1.COMMON_ERROR_CODE.AD_LOAD_OVERTIME, msg: '广告加载超时' });
                                    clearTimeout(timer);
                                    timer = null;
                                }, 10000);
                                ad_1.onLoad(function () {
                                    _this._rewardAd = ad_1;
                                    _this._hasAd.rewarded = true;
                                    resolve();
                                });
                                ad_1.onError(function (error) {
                                    _this._hasAd.rewarded = false;
                                    reject(error);
                                });
                                ad_1.load();
                            })];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        ad_1 = this._rewardAd;
                        if (data.isCheck) {
                            complete(__assign(__assign({ code: 0 }, data), { isEnded: false, ad: ad_1 }));
                        }
                        else {
                            ad_1.onClose(onClose_1);
                            catchLoadAndShowError_1 = function (error) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    fail(error);
                                    return [2 /*return*/];
                                });
                            }); };
                            // 前面广告如果没加载成功的话，先load加载广告，成功后调用show展示广告
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
                            // 前面广告如果加载成功的话并且不是只检测是否有广告，调用show展示广告
                            if (!data.isCheck) {
                                ad_1.show().catch(function () {
                                    // 失败重试
                                    ad_1.load()
                                        .then(function () { return ad_1.show(); })
                                        .catch(catchLoadAndShowError_1);
                                });
                            }
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        error_10 = _b.sent();
                        fail(error_10);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // banner 广告
    SdkQQ.prototype.bannerAd = function (data, _a) {
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            var ad_2, error_11, err;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 6, , 7]);
                        if (!this._bannerAd) return [3 /*break*/, 1];
                        ad_2 = this._bannerAd;
                        return [3 /*break*/, 3];
                    case 1:
                        ad_2 = qq.createBannerAd({
                            adIntervals: data.adIntervals,
                            adUnitId: data.adUnitId,
                            style: data.style,
                        });
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                ad_2.onLoad(function () {
                                    _this._bannerAd = ad_2;
                                    _this._hasAd.banner = true;
                                    resolve();
                                });
                                ad_2.onError(function (error) {
                                    _this._hasAd.banner = false;
                                    reject(error);
                                });
                            })];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        if (!!data.isCheck) return [3 /*break*/, 5];
                        return [4 /*yield*/, ad_2.show()];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5:
                        complete(__assign(__assign({ code: 0 }, data), { ad: ad_2 }));
                        return [3 /*break*/, 7];
                    case 6:
                        error_11 = _b.sent();
                        error_11.message = const_1.AD_ERROR_MAP[error_11.errCode] || error_11.message || error_11.errMsg;
                        err = new Error(error_11.message);
                        // data: 保留原始错误
                        err.data = {
                            data: error_11
                        };
                        complete((0, utils_1.handleError)(err));
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    SdkQQ.prototype.hasAd = function (type) {
        if (!type)
            return this._hasAd.rewarded;
        return this._hasAd[type];
    };
    SdkQQ.prototype.getAd = function (type) {
        switch (type) {
            case 'banner':
                return this._bannerAd;
            case 'interstitial':
                return this._interstitialAd;
            default:
                return this._rewardAd;
        }
    };
    // 分享调度初始化
    SdkQQ.prototype.shareSchedulingInit = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var req, res, error_12;
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
                            open_id: config_1.USER_INFO.openid || '',
                        };
                        return [4 /*yield*/, (0, api_1.schedulingInitApi)(req)];
                    case 2:
                        res = _a.sent();
                        this.scheduleInitMap = (res === null || res === void 0 ? void 0 : res.data) || {};
                        (0, utils_2.removeStorageByPrefix)('rx_schedule');
                        callback.complete(res);
                        return [3 /*break*/, 4];
                    case 3:
                        error_12 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // 获取埋点调度
    SdkQQ.prototype.getShareScheduling = function (params) {
        var funcs = params === null || params === void 0 ? void 0 : params.funcs;
        if (!funcs)
            return { code: 0, data: this.scheduleInitMap };
        if (funcs && !(0, is_1.isArray)(funcs)) {
            var error = new Error('funcs must be Array');
            error.code = const_1.COMMON_ERROR_CODE.PARAMS_ERROR;
            return (0, utils_1.handleError)(error);
        }
        try {
            console.log('sdk getShareScheduling: ', params, this.scheduleInitMap);
            var data = (0, is_1.pick)(this.scheduleInitMap, funcs);
            return { code: 0, data: data };
        }
        catch (error) {
            return (0, utils_1.handleError)(error);
        }
    };
    // 看广告完成上报
    SdkQQ.prototype.shareSchedulingReport = function (params, callback) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var func, region, sub_channel_id, open_id, scheduling_event, Iparams, result_1, error_13;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(checkConfig_1.shareScheduleReportParams, callback, params)];
                    case 1:
                        _b.sent();
                        func = params.func;
                        region = (params === null || params === void 0 ? void 0 : params.region) || config_1.USER_INFO.region || '';
                        sub_channel_id = config_1.USER_INFO.subchannelid || '';
                        open_id = config_1.USER_INFO.openid || '';
                        scheduling_event = (params === null || params === void 0 ? void 0 : params.scheduling_event) === true ? 'done' : 'fail';
                        Iparams = __assign(__assign({ platform: enum_1.PLATFORM.QQ, type: 'mini', sub_channel_id: sub_channel_id, open_id: open_id }, params), { region: region, scheduling_event: scheduling_event, properties: __assign(__assign({ region: region }, this.scheuleReportProps), params === null || params === void 0 ? void 0 : params.properties) });
                        return [4 /*yield*/, (0, api_1.schedulingReportApi)(Iparams)];
                    case 2:
                        result_1 = _b.sent();
                        if ((0, is_1.isEmpty)(result_1 === null || result_1 === void 0 ? void 0 : result_1.data)) {
                            this.scheduleInitMap = (0, is_1.omit)(this.scheduleInitMap, func);
                            qq.removeStorageSync("rx_schedule_".concat(config_1.USER_INFO.tid, "_").concat(func, "_").concat(region));
                            this.shareSchedulingInit({}, {
                                complete: function () {
                                    callback.complete(result_1);
                                }
                            });
                            return [2 /*return*/];
                        }
                        else {
                            this.scheduleInitMap[func] = (_a = result_1 === null || result_1 === void 0 ? void 0 : result_1.data) === null || _a === void 0 ? void 0 : _a.scheduling;
                            qq.setStorageSync("rx_schedule_".concat(config_1.USER_INFO.tid, "_").concat(func, "_").concat(region), JSON.stringify(result_1));
                        }
                        callback.complete(result_1);
                        return [3 /*break*/, 4];
                    case 3:
                        error_13 = _b.sent();
                        callback.complete((0, utils_1.handleError)(error_13));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 地理位置相关接口
     */
    //获得qq的地理位置
    SdkQQ.prototype.handleLocation = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, err_13, error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, utils_1.asyncFunc)(qq.getLocation, { type: 'wgs84' })];
                    case 1:
                        result = _a.sent();
                        this.locationInfomation = result;
                        return [2 /*return*/, result];
                    case 2:
                        err_13 = _a.sent();
                        error = new Error((err_13 === null || err_13 === void 0 ? void 0 : err_13.errMsg) || 'qq.getLocation fail');
                        if (err_13 === null || err_13 === void 0 ? void 0 : err_13.errMsg.includes('deny')) {
                            error.code = const_1.COMMON_ERROR_CODE.LOCATION_AUTH_DENY;
                        }
                        else {
                            error.code = const_1.COMMON_ERROR_CODE.LOCATION_FAIL;
                        }
                        throw error;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //获得地理位置授权 (获得地理位置公共方法)
    SdkQQ.prototype.authorizeLocation = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            var authSetting, location_1, location_2, res, openSetting, location_3, error, error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 13, , 14]);
                        return [4 /*yield*/, (0, utils_1.asyncFunc)(qq.getSetting)];
                    case 1:
                        authSetting = (_a.sent()).authSetting;
                        if (!(authSetting['scope.userLocation'] === true)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.handleLocation()];
                    case 2:
                        location_1 = _a.sent();
                        (callback === null || callback === void 0 ? void 0 : callback.complete) && callback.complete({ code: 0, data: location_1 });
                        return [2 /*return*/, location_1];
                    case 3:
                        if (!(authSetting['scope.userLocation'] === undefined)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.handleLocation()];
                    case 4:
                        location_2 = _a.sent();
                        (callback === null || callback === void 0 ? void 0 : callback.complete) && callback.complete({ code: 0, data: location_2 });
                        return [2 /*return*/, location_2];
                    case 5:
                        if (!(authSetting['scope.userLocation'] != undefined &&
                            authSetting['scope.userLocation'] != true)) return [3 /*break*/, 12];
                        return [4 /*yield*/, (0, utils_1.asyncFunc)(qq.showModal, {
                                title: '是否授权当前位置',
                                content: '需要获取您的地理位置，请确认授权，否则无法相关功能！',
                            })];
                    case 6:
                        res = _a.sent();
                        if (!res.cancel) return [3 /*break*/, 7];
                        qq.showToast({
                            title: '您已拒绝授权!',
                            icon: 'none',
                        });
                        return [3 /*break*/, 11];
                    case 7:
                        if (!res.confirm) return [3 /*break*/, 11];
                        return [4 /*yield*/, (0, utils_1.asyncFunc)(qq.openSetting)];
                    case 8:
                        openSetting = _a.sent();
                        if (!(openSetting.authSetting['scope.userLocation'] === true)) return [3 /*break*/, 10];
                        qq.showToast({
                            title: '授权成功!',
                            icon: 'none',
                        });
                        return [4 /*yield*/, this.handleLocation()];
                    case 9:
                        location_3 = _a.sent();
                        (callback === null || callback === void 0 ? void 0 : callback.complete) && callback.complete({ code: 0, data: location_3 });
                        return [2 /*return*/, location_3];
                    case 10:
                        qq.showToast({
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
                        error_14 = _a.sent();
                        if (callback === null || callback === void 0 ? void 0 : callback.complete) {
                            callback.complete((0, utils_1.handleError)(error_14));
                        }
                        else {
                            throw error_14;
                        }
                        return [3 /*break*/, 14];
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    //上报的http接口
    SdkQQ.prototype.reportLocationHttpFun = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var location_4, report, error_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.authorizeLocation()];
                    case 1:
                        location_4 = _a.sent();
                        return [4 /*yield*/, (0, api_1.reportLocationUpdata)({
                                lon: location_4.longitude,
                                lat: location_4.latitude,
                                types: params.types,
                            })];
                    case 2:
                        report = _a.sent();
                        return [2 /*return*/, report];
                    case 3:
                        error_15 = _a.sent();
                        if (callback === null || callback === void 0 ? void 0 : callback.complete) {
                            callback.complete((0, utils_1.handleError)(error_15));
                        }
                        else {
                            throw error_15;
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //开始上报经纬度坐标
    SdkQQ.prototype.startReportLoaction = function (params, _a) {
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            var resReport, error_16;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(qq_1.ReportLoactionCheckParams, { complete: complete }, params)];
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
                        error_16 = _b.sent();
                        complete((0, utils_1.handleError)(error_16));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //停止上报经纬度
    SdkQQ.prototype.stopReportLocation = function () {
        clearInterval(this.reportLocationTimer);
        this.reportLocationTimer = null;
    };
    //删除经纬度坐标
    SdkQQ.prototype.deleteReportLocation = function (params, _a) {
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            var result, error_17;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(qq_1.DeleteLoactionCheckParams2, { complete: complete }, params)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, (0, api_1.deleteReportLocation)(params)];
                    case 2:
                        result = _b.sent();
                        complete(result);
                        return [3 /*break*/, 4];
                    case 3:
                        error_17 = _b.sent();
                        complete((0, utils_1.handleError)(error_17));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //获得半径内用户
    SdkQQ.prototype.getNearlyPeasonByRadius = function (params, _a) {
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            var location_5, result, error_18;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        location_5 = this.locationInfomation;
                        if (!(location_5 == null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.authorizeLocation()];
                    case 1:
                        location_5 = _b.sent();
                        _b.label = 2;
                    case 2: return [4 /*yield*/, (0, paramsValid_1.pubCheck)(qq_1.getNearlyRediusCheckParams, { complete: complete }, params)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, (0, api_1.getNearlyPeasonByRadius)(__assign({ lon: location_5.longitude, lat: location_5.latitude }, params))];
                    case 4:
                        result = _b.sent();
                        complete(result);
                        return [3 /*break*/, 6];
                    case 5:
                        error_18 = _b.sent();
                        complete((0, utils_1.handleError)(error_18));
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 轮训获取公共属性
     *
     */
    SdkQQ.prototype.loopGetPublicProps = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var event_public_attr, repeat, getPublicPropsConfig;
            var _this = this;
            return __generator(this, function (_b) {
                event_public_attr = (_a = this.initConfig) === null || _a === void 0 ? void 0 : _a.event_public_attr;
                if ((0, is_1.isEmpty)(event_public_attr))
                    return [2 /*return*/];
                repeat = function (ms) {
                    event_public_attr.timerId && clearTimeout(event_public_attr.timerId);
                    event_public_attr.timerId = setTimeout(function () { return getPublicPropsConfig(); }, ms);
                };
                getPublicPropsConfig = function () { return __awaiter(_this, void 0, void 0, function () {
                    var res, _a, _b, refresh, public_attr, _c, version, initParams, error_19;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                _d.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, (0, api_1.getPublicProps)(event_public_attr.version)];
                            case 1:
                                res = _d.sent();
                                _a = (res === null || res === void 0 ? void 0 : res.data) || {}, _b = _a.refresh, refresh = _b === void 0 ? this.businessRuleDefaultRefreshTime : _b, public_attr = _a.public_attr, _c = _a.version, version = _c === void 0 ? '' : _c;
                                event_public_attr.public_attr = public_attr || event_public_attr.public_attr;
                                event_public_attr.refresh = refresh;
                                event_public_attr.version = version;
                                initParams = qq.getStorageSync('rx-init-params');
                                // 获取到最新的version后更新到缓存中，下次初始化的时候用这个最新的version请求初始化配置接口
                                qq.setStorageSync('rx-init-params', __assign(__assign({}, initParams), { version: __assign(__assign({}, initParams.version), { event_public_attr: version }) }));
                                repeat(event_public_attr.refresh);
                                return [3 /*break*/, 3];
                            case 2:
                                error_19 = _d.sent();
                                (0, utils_1.handleError)(error_19);
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
    /**
     * 设置公共属性
     * 设置后CP无需每次上报都传，由SDK填入properties中。
     */
    SdkQQ.prototype.setPublicProperties = function (params) {
        if (!(0, is_1.isObject)(params) || Array.isArray(params)) {
            var error = new Error('params must be object');
            error.code = const_1.COMMON_ERROR_CODE.PAY_PARAMS_ERROR;
            return (0, utils_1.handleError)(error);
        }
        try {
            qq.setStorageSync('rx_public_props', params);
            return { code: 0 };
        }
        catch (error) {
            return (0, utils_1.handleError)(error);
        }
    };
    /**
     * 修改设置的公共数据。
     */
    SdkQQ.prototype.updatePublicProperties = function (params) {
        if (!(0, is_1.isObject)(params) || Array.isArray(params)) {
            var error = new Error('params must be object');
            error.code = const_1.COMMON_ERROR_CODE.PAY_PARAMS_ERROR;
            return (0, utils_1.handleError)(error);
        }
        try {
            var cache = qq.getStorageSync('rx_public_props');
            qq.setStorageSync('rx_public_props', __assign(__assign({}, cache), params));
            return { code: 0 };
        }
        catch (error) {
            return (0, utils_1.handleError)(error);
        }
    };
    /**
     * 删除公共属性
     */
    SdkQQ.prototype.deletePublicProperties = function (params) {
        if (!Array.isArray(params)) {
            var error = new Error('params must be array');
            error.code = const_1.COMMON_ERROR_CODE.PARAMS_ERROR;
            return (0, utils_1.handleError)(error);
        }
        try {
            var cache = qq.getStorageSync('rx_public_props');
            var rest = (0, is_1.omit)(cache, params);
            qq.setStorageSync('rx_public_props', rest);
            return { code: 0 };
        }
        catch (error) {
            return (0, utils_1.handleError)(error);
        }
    };
    SdkQQ.prototype.getPublicProperties = function () {
        var data = qq.getStorageSync("rx_public_props");
        return { code: 0, data: data };
    };
    return SdkQQ;
}(index_common_1.default));
exports.default = SdkQQ;
//# sourceMappingURL=index.qq.js.map