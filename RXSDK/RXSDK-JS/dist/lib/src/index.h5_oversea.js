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
var v4_1 = require("uuid/v4");
var config_1 = require("@/config");
var config_2 = require("@/h5/config");
var const_1 = require("@/config/const");
var utils_1 = require("@/utils/utils");
var day_1 = require("@/utils/day");
var is_1 = require("@/utils/is");
var utils_2 = require("@/h5/utils");
var apis_1 = require("@/h5/apis");
var google_1 = require("@/oversea/google");
var apple_1 = require("@/oversea/apple");
var facebook_1 = require("@/oversea/facebook");
var paramsValid_1 = require("@/utils/paramsValid");
var checkConfig_1 = require("@/h5/checkConfig");
var tiktok_1 = require("@/oversea/tiktok");
var instagram_1 = require("@/oversea/instagram");
var zalo_1 = require("@/oversea/zalo");
var stOffset_1 = require("@/utils/stOffset");
var PLATFORM = 'oversea';
var SdkH5Oversea = /** @class */ (function () {
    function SdkH5Oversea(initParams) {
        this._hasAd = {
            rewarded: undefined
        };
        this._ad = null;
        // 默认刷新时间 10 分钟
        this.businessRuleDefaultRefreshTime = 600000;
        // 商业广告规则信息
        this.businessRulesInfo = {
            // 定时器的编号
            timerId: 0,
            // 时间间隔
            refresh_time: this.businessRuleDefaultRefreshTime,
            // 主窗口配置信息
            main_window_list: [],
            // 窗口配置信息
            window_list: [],
            // 版本-服务端缓存使用
            version: '',
            // 是否命中缓存
            hit_cache: false
        };
        // 商业化接口是否返回结果
        this.businessRuleInvoking = false;
        // 条件获取商业化窗口队列
        this.businessWindowsQueue = [];
        // 上报公共属性接口失败次数
        this.trackPublicPropsFailCount = 0;
        this.funcs = [];
        this.initConfig = {};
        // 调度埋点
        this.scheduleInitMap = {};
        // 获取分享数据缓存调度上报参数
        this.scheuleReportProps = {};
        // 子渠道id
        this.subChannelId = null;
        // 是否为推广员
        this.is_promoter = false;
        this.game_id = '';
        // 推广员福利码相关信息
        this.promoInfo = {
            timer: null,
            refresh_period_exp: 0,
            polling: 0,
            promo_code: ''
        };
        // super(PLATFORM)
        Object.assign(config_1.SYSTEM_INFO, config_2.SYSTEM_INFO, __assign({}, initParams));
        this.getInitConfig({ complete: initParams.complete });
        console.log('getSearchQueries', (0, utils_2.getSearchQueries)());
    }
    /**
     * 用于设置自定义返回错误 Msg
     */
    SdkH5Oversea.prototype.setErrorMsg = function (errMsg) {
        config_1.SYSTEM_INFO.errMsg = errMsg;
    };
    /**
     * 清空返回错误 Msg
     */
    SdkH5Oversea.prototype.clearErrorMsg = function () {
        config_1.SYSTEM_INFO.errMsg = {
            default: ''
        };
    };
    SdkH5Oversea.prototype.calculateValueSizeWithEncoding = function (key) {
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
    SdkH5Oversea.prototype.track = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var p1, p2, getDevicecode, devicecode, type, time, uuids, platform_id, copyCpid, product_id, channel_id, cpid, publicProps, reqarr, useCache, size, rx_track_queue, result, err_1;
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
                        getDevicecode = function () {
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
                        devicecode = getDevicecode();
                        type = 'track';
                        time = (0, day_1.formatDate)('YYYY-MM-DDTHH:mm:ss.SSSZ');
                        uuids = (0, v4_1.default)();
                        platform_id = 3;
                        copyCpid = config_1.SYSTEM_INFO.cpid, product_id = config_1.SYSTEM_INFO.productId, channel_id = config_1.SYSTEM_INFO.channelId;
                        cpid = Number(copyCpid);
                        publicProps = (0, utils_2.customGetStorageSync)('rx_public_props');
                        reqarr = [
                            __assign({ type: type, time: time, uuid: uuids, distinct_id: config_1.USER_INFO === null || config_1.USER_INFO === void 0 ? void 0 : config_1.USER_INFO.openid, sub_channel_id: config_1.USER_INFO === null || config_1.USER_INFO === void 0 ? void 0 : config_1.USER_INFO.subchannelid, platform_id: platform_id, product_id: product_id, cpid: cpid, channel_id: channel_id, devicecode: devicecode }, __assign(__assign({}, p1), { properties: __assign(__assign({}, p1.properties), publicProps) }))
                        ];
                        !config_1.USER_INFO.subchannelid || (reqarr[0].sub_channel_id = config_1.USER_INFO.subchannelid);
                        useCache = config_1.SYSTEM_INFO.single_player_mode;
                        size = this.calculateValueSizeWithEncoding('rx_track_queue');
                        console.log('rx_track_queue size:', size);
                        if (useCache && size <= 2 * 1024 * 1024) {
                            rx_track_queue = (0, utils_2.customGetStorageSync)('rx_track_queue') || [];
                            rx_track_queue = rx_track_queue.concat(reqarr);
                            (0, utils_2.customSetStorageSync)('rx_track_queue', rx_track_queue);
                            p2.complete({ code: 0, data: null, msg: 'track cache' });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, (0, apis_1.trackApi)(reqarr)];
                    case 2:
                        result = _a.sent();
                        p2.complete(__assign(__assign({}, result), { data: null, msg: 'track success' }));
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        p2.complete((0, utils_1.handleError)(err_1));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SdkH5Oversea.prototype.checkInstagramRedirect = function (callback) {
        var result = (0, instagram_1.checkInstagramRedirect)();
        callback.complete({
            code: result ? 0 : -1
        });
    };
    SdkH5Oversea.prototype.login = function (params, callback) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function () {
            var user_source, now, distinct_idLocal, distinct_id, requestParams, queryJson, user_info, login_info, _e, reflowEnabled, source_ad, reqLogin, _f, custom_ext, rest_ext, err_2;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        _g.trys.push([0, 14, , 15]);
                        user_source = this.getLoginQsAndGenerateStruct();
                        now = new Date().getTime();
                        distinct_idLocal = (0, utils_2.customGetStorageSync)('rx_distinct_id');
                        distinct_id = distinct_idLocal || (0, v4_1.default)();
                        if (!distinct_idLocal) {
                            (0, utils_2.customSetStorageSync)('rx_distinct_id', distinct_id);
                        }
                        requestParams = __assign(__assign({ ts: now, method: params.method, distinct_id: distinct_id }, user_source), (params.custom_params || {}));
                        try {
                            if (this.subChannelId !== null) {
                                queryJson = (0, utils_2.getSearchQueries)();
                                requestParams.user_source = {
                                    guide: __assign(__assign({}, user_source), { subchannelid: this.subChannelId })
                                };
                                if (queryJson) {
                                    requestParams.user_source.guide = __assign(__assign({}, requestParams.user_source.guide), queryJson);
                                }
                            }
                        }
                        catch (err) {
                        }
                        user_info = {};
                        login_info = {};
                        _e = params.method;
                        switch (_e) {
                            case 'apple': return [3 /*break*/, 1];
                            case 'zalo': return [3 /*break*/, 3];
                            case 'google': return [3 /*break*/, 5];
                            case 'facebook': return [3 /*break*/, 6];
                            case 'instagram': return [3 /*break*/, 8];
                            case 'tiktok': return [3 /*break*/, 10];
                        }
                        return [3 /*break*/, 12];
                    case 1: return [4 /*yield*/, (0, apple_1.appleLogin)(params.apple_config)];
                    case 2:
                        login_info = _g.sent();
                        return [3 /*break*/, 12];
                    case 3: return [4 /*yield*/, (0, zalo_1.zaloLogin)(params.zalo_config)];
                    case 4:
                        login_info = _g.sent();
                        return [3 /*break*/, 12];
                    case 5:
                        login_info = {
                            idToken: params.idToken
                        };
                        return [3 /*break*/, 12];
                    case 6: return [4 /*yield*/, (0, facebook_1.facebookLogin)(params.facebook_config)];
                    case 7:
                        login_info = _g.sent();
                        return [3 /*break*/, 12];
                    case 8: return [4 /*yield*/, (0, instagram_1.instagramAuthByCode)()];
                    case 9:
                        login_info = _g.sent();
                        if (login_info.code === -1) {
                            (0, instagram_1.instagramLogin)(params.instagram_config);
                            return [2 /*return*/];
                        }
                        return [3 /*break*/, 12];
                    case 10: return [4 /*yield*/, (0, tiktok_1.tiktokAuthByCode)()];
                    case 11:
                        login_info = _g.sent();
                        if (login_info.code === -1) {
                            (0, tiktok_1.tiktokLogin)(params.tiktok_config);
                            return [2 /*return*/];
                        }
                        return [3 /*break*/, 12];
                    case 12:
                        reflowEnabled = ((_b = (_a = this.initConfig) === null || _a === void 0 ? void 0 : _a.advertise_switch) === null || _b === void 0 ? void 0 : _b.switch) === 1;
                        source_ad = this.getAttributionData();
                        reqLogin = reflowEnabled ? __assign(__assign({}, requestParams), { device: source_ad }) : requestParams;
                        _f = reqLogin.ext || {}, custom_ext = _f.custom_ext, rest_ext = __rest(_f, ["custom_ext"]);
                        reqLogin.custom_ext = custom_ext || {};
                        reqLogin.ext = __assign(__assign({}, (rest_ext || {})), login_info);
                        return [4 /*yield*/, (0, apis_1.loginByCredentialApi)(this.ActivePrefix(reqLogin))];
                    case 13:
                        user_info = _g.sent();
                        Object.assign(config_1.USER_INFO, user_info.data);
                        if ((((_c = user_info === null || user_info === void 0 ? void 0 : user_info.data) === null || _c === void 0 ? void 0 : _c.user_flag) & 1) == 1) {
                            this.is_promoter = true;
                            this.game_id = ((_d = user_info === null || user_info === void 0 ? void 0 : user_info.data) === null || _d === void 0 ? void 0 : _d.cp_user_id) || '';
                        }
                        (0, utils_2.customSetStorageSync)('rx-loginState', 1);
                        (0, utils_2.customSetStorageSync)('rxToken', user_info.data.token);
                        (0, utils_2.customSetStorageSync)('rxUserInfo', user_info.data);
                        callback && callback.complete(user_info);
                        return [3 /*break*/, 15];
                    case 14:
                        err_2 = _g.sent();
                        callback && callback.complete((0, utils_2.handleTrackError)(PLATFORM, 'rxlog_error_login', err_2));
                        return [3 /*break*/, 15];
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    // 获取埋点调度
    SdkH5Oversea.prototype.getShareScheduling = function (params) {
        var funcs = params === null || params === void 0 ? void 0 : params.funcs;
        if (!funcs)
            return { code: 0, data: this.scheduleInitMap };
        if (funcs && !(0, is_1.isArray)(funcs)) {
            var error = new Error('funcs must be Array');
            error.code = const_1.COMMON_ERROR_CODE.PARAMS_ERROR;
            return (0, utils_2.handleTrackError)(PLATFORM, '', error);
        }
        try {
            console.log('sdk getShareScheduling: ', params, this.scheduleInitMap);
            var data = (0, is_1.pick)(this.scheduleInitMap, funcs);
            return { code: 0, data: data };
        }
        catch (error) {
            return (0, utils_2.handleTrackError)(PLATFORM, '', error);
        }
    };
    // 分享调度初始化
    SdkH5Oversea.prototype.shareSchedulingInit = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var req, res, error_1;
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
                            type: 'app',
                            open_id: config_1.USER_INFO.openid || ''
                        };
                        return [4 /*yield*/, (0, apis_1.schedulingInitApi)(req)];
                    case 2:
                        res = _a.sent();
                        this.scheduleInitMap = (res === null || res === void 0 ? void 0 : res.data) || {};
                        (0, utils_2.removeStorageByPrefix)('rx_schedule');
                        callback.complete(res);
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // 看广告完成上报
    SdkH5Oversea.prototype.shareSchedulingReport = function (params, callback) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var func, region, sub_channel_id, open_id, scheduling_event, Iparams, result_1, remaining_share_count, error_2;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 8, , 9]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(checkConfig_1.shareScheduleReportParams, callback, params)];
                    case 1:
                        _d.sent();
                        func = params.func;
                        region = (params === null || params === void 0 ? void 0 : params.region) || config_1.USER_INFO.region || '';
                        sub_channel_id = config_1.USER_INFO.subchannelid || '';
                        open_id = config_1.USER_INFO.openid || '';
                        scheduling_event = (params === null || params === void 0 ? void 0 : params.scheduling_event) === true ? 'done' : 'fail';
                        Iparams = __assign(__assign({ platform: PLATFORM, type: 'app', sub_channel_id: sub_channel_id, open_id: open_id }, params), { region: region, scheduling_event: scheduling_event, properties: __assign({ region: region }, params === null || params === void 0 ? void 0 : params.properties) });
                        // ad不上报上一次的分享数据
                        if (params.scheduling_type == 'share') {
                            Iparams.properties = __assign(__assign({}, this.scheuleReportProps), Iparams.properties);
                        }
                        return [4 /*yield*/, (0, apis_1.schedulingReportApi)(Iparams)];
                    case 2:
                        result_1 = _d.sent();
                        if (!(0, is_1.isEmpty)(result_1 === null || result_1 === void 0 ? void 0 : result_1.data)) return [3 /*break*/, 4];
                        console.log('上报返回为空，对应埋点删除');
                        this.scheduleInitMap = (0, is_1.omit)(this.scheduleInitMap, func);
                        (0, utils_2.removeStorageSync)("rx_schedule_".concat(config_1.USER_INFO.tid, "_").concat(func, "_").concat(region));
                        return [4 /*yield*/, this.shareSchedulingInit({}, {
                                complete: function () {
                                    console.log('shareSchedulingInit');
                                    callback.complete(result_1);
                                }
                            })];
                    case 3:
                        _d.sent();
                        return [2 /*return*/];
                    case 4:
                        remaining_share_count = ((_b = (_a = result_1 === null || result_1 === void 0 ? void 0 : result_1.data) === null || _a === void 0 ? void 0 : _a.scheduling) === null || _b === void 0 ? void 0 : _b.remaining_share_count) || 0;
                        console.log('上报后剩余次数为' + remaining_share_count);
                        if (!(remaining_share_count <= 0)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.shareSchedulingInit({}, {
                                complete: function () {
                                    console.log('shareSchedulingInit');
                                    callback.complete(result_1);
                                }
                            })];
                    case 5:
                        _d.sent();
                        return [2 /*return*/];
                    case 6:
                        this.scheduleInitMap[func] = (_c = result_1 === null || result_1 === void 0 ? void 0 : result_1.data) === null || _c === void 0 ? void 0 : _c.scheduling;
                        (0, utils_2.customSetStorageSync)("rx_schedule_".concat(config_1.USER_INFO.tid, "_").concat(func, "_").concat(region), JSON.stringify(result_1));
                        _d.label = 7;
                    case 7:
                        callback.complete(result_1);
                        return [3 /*break*/, 9];
                    case 8:
                        error_2 = _d.sent();
                        callback.complete((0, utils_2.handleTrackError)(PLATFORM, '', error_2));
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    //获得分享内容
    SdkH5Oversea.prototype.getShareData = function (params, callback, stopCallback) {
        return __awaiter(this, void 0, void 0, function () {
            var region, cacheShareData, _a, readCache, cShareData, productId, channelId, platform, transmits, func, type, sub_channel_id, open_id, shareData, err_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 7]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(checkConfig_1.H5ShareCheckParams, callback, params)];
                    case 1:
                        _b.sent();
                        region = (params === null || params === void 0 ? void 0 : params.region) || config_1.USER_INFO.region || '';
                        cacheShareData = (0, utils_2.customGetStorageSync)("rx_schedule_".concat(config_1.USER_INFO.tid, "_").concat(params.func, "_").concat(region));
                        _a = params.readCache, readCache = _a === void 0 ? true : _a;
                        if (readCache && cacheShareData) {
                            cShareData = JSON.parse(cacheShareData);
                            console.info('sdk 缓存分享数据：', cShareData);
                            this.setScheuleReportProps(cShareData === null || cShareData === void 0 ? void 0 : cShareData.data);
                            !stopCallback && callback.complete(cShareData);
                            return [2 /*return*/, cShareData];
                        }
                        productId = config_1.SYSTEM_INFO.productId, channelId = config_1.SYSTEM_INFO.channelId;
                        platform = params.platform;
                        transmits = encodeURI(params.transmits || '');
                        func = params.func;
                        type = 'app';
                        sub_channel_id = config_1.USER_INFO.subchannelid || '';
                        open_id = config_1.USER_INFO.openid;
                        return [4 /*yield*/, (0, apis_1.getShareDataApi)({
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
                    case 2:
                        shareData = _b.sent();
                        if (!stopCallback) {
                            callback.complete(shareData);
                        }
                        this.setScheuleReportProps(shareData === null || shareData === void 0 ? void 0 : shareData.data);
                        return [2 /*return*/, shareData];
                    case 3:
                        err_3 = _b.sent();
                        if (!(err_3.code == 305407)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.shareSchedulingInit({}, {
                                complete: function () {
                                    if (!stopCallback) {
                                        callback.complete((0, utils_2.handleTrackError)(PLATFORM, '', err_3));
                                    }
                                }
                            })];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        if (!stopCallback) {
                            callback.complete((0, utils_2.handleTrackError)(PLATFORM, '', err_3));
                        }
                        _b.label = 6;
                    case 6:
                        this.track((0, utils_1.formatTrackParams)({
                            eventName: 'track_err',
                            apiName: 'getShareData',
                            reqParams: params,
                            errorInfo: err_3,
                            loginInfo: config_1.USER_INFO
                        }), {
                            complete: function (data) {
                                console.info('getShareData error add complete func when tracked:', data);
                            }
                        });
                        return [2 /*return*/, (0, utils_2.handleTrackError)(PLATFORM, '', err_3)];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    SdkH5Oversea.prototype.shareTo = function (platform, params) {
        var url = encodeURIComponent(window.location.href);
        var text = encodeURIComponent('分享内容'); // 替换为您想分享的内容
        var shareUrl = '';
        switch (platform) {
            case 'whatsapp':
                shareUrl = "https://api.whatsapp.com/send?text=".concat(text, " ").concat(url);
                break;
            case 'facebook':
                shareUrl = "https://www.facebook.com/sharer/sharer.php?u=".concat(url);
                break;
            case 'zalo':
                shareUrl = "https://zalo.me/share?link=".concat(url);
                break;
            case 'line':
                shareUrl = "https://line.me/R/msg/text/?".concat(text, " ").concat(url);
                break;
            default:
                return;
        }
        window.open(shareUrl, '_blank');
    };
    SdkH5Oversea.prototype.facebookInit = function (params) {
        (0, facebook_1.facebookInit)(params);
    };
    SdkH5Oversea.prototype.googleInit = function (params) {
        (0, google_1.googleInit)(params);
    };
    SdkH5Oversea.prototype.share = function (params, callback) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        return __awaiter(this, void 0, void 0, function () {
            var shareData, query, href, _q, _href, _query, shareUrl, title, description, image, shareText, whatsappShareUrl, lineShareUrl, zaloShareUrl;
            return __generator(this, function (_r) {
                switch (_r.label) {
                    case 0:
                        shareData = params.shareData || { code: 0 };
                        query = params.query;
                        if (!params.func) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getShareData(params, callback, true)];
                    case 1:
                        shareData = _r.sent();
                        _r.label = 2;
                    case 2:
                        href = params.href;
                        if (params.href || ((_b = (_a = shareData === null || shareData === void 0 ? void 0 : shareData.data) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.material_type) === 'link' || ((_d = (_c = shareData === null || shareData === void 0 ? void 0 : shareData.data) === null || _c === void 0 ? void 0 : _c.content) === null || _d === void 0 ? void 0 : _d.material_type) === 'image' || ((_f = (_e = shareData === null || shareData === void 0 ? void 0 : shareData.data) === null || _e === void 0 ? void 0 : _e.content) === null || _f === void 0 ? void 0 : _f.url)) {
                            _q = (params.href || ((_h = (_g = shareData === null || shareData === void 0 ? void 0 : shareData.data) === null || _g === void 0 ? void 0 : _g.content) === null || _h === void 0 ? void 0 : _h.url)).split('?'), _href = _q[0], _query = _q[1];
                            href = _href;
                            if (_query) {
                                query = query ? "".concat(query, "&").concat(_query) : _query;
                            }
                        }
                        shareUrl = href + (query ? "?".concat(query) : '');
                        title = params.title || ((_k = (_j = shareData === null || shareData === void 0 ? void 0 : shareData.data) === null || _j === void 0 ? void 0 : _j.content) === null || _k === void 0 ? void 0 : _k.title) || '';
                        description = params.desc || ((_m = (_l = shareData === null || shareData === void 0 ? void 0 : shareData.data) === null || _l === void 0 ? void 0 : _l.content) === null || _m === void 0 ? void 0 : _m.content) || '';
                        image = params.imageUrl || ((_p = (_o = shareData === null || shareData === void 0 ? void 0 : shareData.data) === null || _o === void 0 ? void 0 : _o.content) === null || _p === void 0 ? void 0 : _p.image) || '';
                        shareText = '';
                        if (title && description) {
                            shareText = "".concat(title, " ").concat(description);
                        }
                        else if (title && !description) {
                            shareText = title;
                        }
                        else if (description && !title) {
                            shareText = description;
                        }
                        console.info({
                            href: shareUrl,
                            title: title,
                            description: description,
                            image: image
                        });
                        try {
                            switch (params.platform) {
                                case 'facebook':
                                    // @ts-ignore
                                    (0, facebook_1.facebookShare)({
                                        href: shareUrl,
                                        title: title,
                                        description: description,
                                        image: image
                                    });
                                    callback.complete(shareData);
                                    break;
                                case 'whatsapp':
                                    whatsappShareUrl = "https://api.whatsapp.com/send?text=".concat(encodeURIComponent("".concat(shareText, " ").concat(shareUrl)));
                                    window.open(whatsappShareUrl, '_blank');
                                    callback.complete(shareData);
                                    break;
                                case 'line':
                                    lineShareUrl = "https://line.me/R/msg/text/?".concat(encodeURIComponent("".concat(shareText, " ").concat(shareUrl)));
                                    window.open(lineShareUrl, '_blank');
                                    callback.complete(shareData);
                                    break;
                                case 'zalo':
                                    zaloShareUrl = "https://zalo.me/share?link=".concat(encodeURIComponent(shareUrl));
                                    window.open(zaloShareUrl, '_blank');
                                    callback.complete(shareData);
                                    break;
                            }
                        }
                        catch (err) {
                            callback.complete((0, utils_2.handleTrackError)(PLATFORM, 'rxlog_error_share', err));
                            this.track((0, utils_1.formatTrackParams)({
                                eventName: 'track_err',
                                apiName: 'share',
                                reqParams: params,
                                errorInfo: err,
                                loginInfo: config_1.USER_INFO
                            }), {
                                complete: function (data) {
                                    console.info('share error add complete func when tracked:', data);
                                }
                            });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    // 激励广告
    SdkH5Oversea.prototype.rewardedVideoAd = function (data, callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    SdkH5Oversea.prototype.setScheuleReportProps = function (data) {
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
            platform: (data === null || data === void 0 ? void 0 : data.platform) || PLATFORM
        };
    };
    // 获得公共属性
    SdkH5Oversea.prototype.getPublicProperties = function () {
        var data = (0, utils_2.customGetStorageSync)("rx_public_props");
        return { code: 0, data: data };
    };
    /**
     * 设置公共属性
     * 设置后CP无需每次上报都传，由SDK填入properties中。
     */
    SdkH5Oversea.prototype.setPublicProperties = function (params) {
        if (!(0, is_1.isObject)(params)) {
            var error = new Error('params must be object');
            error.code = const_1.COMMON_ERROR_CODE.PAY_PARAMS_ERROR;
            return (0, utils_2.handleTrackError)(PLATFORM, '', error);
        }
        try {
            (0, utils_2.customSetStorageSync)('rx_public_props', params);
            return { code: 0 };
        }
        catch (error) {
            return (0, utils_2.handleTrackError)(PLATFORM, '', error);
        }
    };
    /**
     * 修改设置的公共数据。
     */
    SdkH5Oversea.prototype.updatePublicProperties = function (params) {
        if (!(0, is_1.isObject)(params)) {
            var error = new Error('params must be object');
            error.code = const_1.COMMON_ERROR_CODE.PAY_PARAMS_ERROR;
            return (0, utils_2.handleTrackError)(PLATFORM, '', error);
        }
        try {
            var cache = (0, utils_2.customGetStorageSync)('rx_public_props');
            // @ts-ignore
            (0, utils_2.customSetStorageSync)('rx_public_props', __assign(__assign({}, cache), params));
            return { code: 0 };
        }
        catch (error) {
            return (0, utils_2.handleTrackError)(PLATFORM, '', error);
        }
    };
    /**
     * 删除公共属性
     */
    SdkH5Oversea.prototype.deletePublicProperties = function (params) {
        try {
            var cache = (0, utils_2.customGetStorageSync)('rx_public_props');
            // @ts-ignore
            var rest = (0, is_1.omit)(cache, params);
            (0, utils_2.customSetStorageSync)('rx_public_props', rest);
            return { code: 0 };
        }
        catch (error) {
            return (0, utils_2.handleTrackError)(PLATFORM, '', error);
        }
    };
    SdkH5Oversea.prototype.getInitConfig = function (callback) {
        var _a, _b, _c, _d, _e, _f, _g;
        return __awaiter(this, void 0, void 0, function () {
            var initParams, res, config, version, _i, _h, key, prop_version, _serverTime, err_4, error;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        initParams = (0, utils_2.customGetStorageSync)('rx-init-params') || {};
                        _j.label = 1;
                    case 1:
                        _j.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, (0, apis_1.getInitConf)({ version: (_a = initParams === null || initParams === void 0 ? void 0 : initParams.version) !== null && _a !== void 0 ? _a : {} })];
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
                        //检查是否需要传递subchannleid
                        this.publicSubchannelCheck(res);
                        (0, utils_2.customSetStorageSync)('rx-init-params', { version: version });
                        config_1.SYSTEM_INFO.SDK_INIT_FINISHED = true;
                        config_1.SYSTEM_INFO.CP_OF = ((_e = (_d = res === null || res === void 0 ? void 0 : res.data) === null || _d === void 0 ? void 0 : _d.cp) === null || _e === void 0 ? void 0 : _e.of) || false;
                        _serverTime = (_g = (_f = res === null || res === void 0 ? void 0 : res.data) === null || _f === void 0 ? void 0 : _f.server) === null || _g === void 0 ? void 0 : _g.time;
                        if (_serverTime) {
                            config_1.SYSTEM_INFO.st_offset = String(Number(_serverTime) - Date.now());
                        }
                        (0, stOffset_1.setupStOffsetRefreshForH5)(apis_1.getServerTime);
                        if (config_1.SYSTEM_INFO.need_active) {
                            // 检查是否需要激活
                            this.checkNeedActivate();
                        }
                        this.loopGetPublicProps();
                        callback.complete({ code: 0, data: this.initConfig });
                        return [3 /*break*/, 4];
                    case 3:
                        err_4 = _j.sent();
                        error = __assign(__assign({}, (err_4 || {})), { msg: '初始化错误，或未初始化', code: const_1.COMMON_ERROR_CODE.INIT_PARAMS_ERROR, thirdcode: err_4.code || err_4.errCode, message: err_4.message || err_4.msg || err_4.errMsg, thirdmsg: err_4.message || err_4.msg || err_4.errMsg });
                        callback.complete((0, utils_2.handleTrackError)(PLATFORM, 'rxlog_error_init', error));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SdkH5Oversea.prototype.publicSubchannelCheck = function (res) {
        var _a, _b;
        try {
            var sub_channel = (_b = (_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.subcq) === null || _b === void 0 ? void 0 : _b.subc;
            var queryString = (0, utils_2.getSearchQueries)(true);
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
    // 获取归因数据
    SdkH5Oversea.prototype.getAttributionData = function () {
        var universal = (0, utils_2.getSearchQueries)();
        var source_ad = {};
        if (universal === null || universal === void 0 ? void 0 : universal.ad_platform) {
            source_ad.ad_rawargs = (0, is_1.omit)(universal, ['ad_platform']);
            source_ad.ad_platform = universal.ad_platform;
        }
        return source_ad;
    };
    SdkH5Oversea.prototype.checkNeedActivate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var activeResult, source_ad, distinct_id, req, result, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        activeResult = (0, utils_2.customGetStorageSync)('rx-active-result');
                        if (!!activeResult) return [3 /*break*/, 4];
                        source_ad = this.getAttributionData();
                        distinct_id = (0, v4_1.default)();
                        (0, utils_2.customSetStorageSync)('rx_distinct_id', distinct_id);
                        req = {
                            stage: 'init',
                            distinct_id: distinct_id,
                            source_ad: source_ad
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, (0, apis_1.activated)(req)];
                    case 2:
                        result = _a.sent();
                        (0, utils_2.customSetStorageSync)('rx-active-result', { isSuccess: true, activeResult: result.data });
                        return [3 /*break*/, 4];
                    case 3:
                        err_5 = _a.sent();
                        (0, utils_2.customSetStorageSync)('rx-active-result', { isSuccess: false, activeResult: req });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 轮训获取公共属性
     *
     */
    SdkH5Oversea.prototype.loopGetPublicProps = function () {
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
                    event_public_attr.timerId = setTimeout(function () { return getPublicPropsConfig(); }, ms || _this.businessRuleDefaultRefreshTime);
                };
                getPublicPropsConfig = function () { return __awaiter(_this, void 0, void 0, function () {
                    var res, _a, _b, refresh, public_attr, _c, version, initParams, error_3;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                _d.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, (0, apis_1.getPublicProps)(event_public_attr.version)];
                            case 1:
                                res = _d.sent();
                                _a = (res === null || res === void 0 ? void 0 : res.data) || {}, _b = _a.refresh, refresh = _b === void 0 ? this.businessRuleDefaultRefreshTime : _b, public_attr = _a.public_attr, _c = _a.version, version = _c === void 0 ? '' : _c;
                                event_public_attr.public_attr = public_attr || event_public_attr.public_attr;
                                event_public_attr.refresh = refresh;
                                event_public_attr.version = version;
                                initParams = (0, utils_2.customGetStorageSync)('rx-init-params');
                                // 获取到最新的version后更新到缓存中，下次初始化的时候用这个最新的version请求初始化配置接口
                                (0, utils_2.customSetStorageSync)('rx-init-params', __assign(__assign({}, initParams), { version: __assign(__assign({}, initParams.version), { event_public_attr: version }) }));
                                repeat(event_public_attr.refresh);
                                return [3 /*break*/, 3];
                            case 2:
                                error_3 = _d.sent();
                                (0, utils_2.handleTrackError)(PLATFORM, '', error_3);
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
    //格式化queryString
    SdkH5Oversea.prototype.getLoginQsAndGenerateStruct = function () {
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
        var subPackageInfo = (0, utils_2.customGetStorageSync)('rx_sub_package_info');
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
    SdkH5Oversea.prototype.ActivePrefix = function (reqParams) {
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
    SdkH5Oversea.prototype.setSubChannelId = function (subChannelId) {
        try {
            (0, utils_2.customSetStorageSync)('rx_sub_package_info', { sub_channel_id: subChannelId });
            return { code: 0 };
        }
        catch (error) {
            return (0, utils_2.handleTrackError)(PLATFORM, '', error);
        }
    };
    return SdkH5Oversea;
}());
exports.default = SdkH5Oversea;
//# sourceMappingURL=index.h5_oversea.js.map