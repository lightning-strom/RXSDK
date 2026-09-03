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
var v4_1 = require("uuid/v4");
var config_1 = require("@/config");
var config_2 = require("@/rpk/config");
var const_1 = require("@/config/const");
var utils_1 = require("@/utils/utils");
var day_1 = require("@/utils/day");
var is_1 = require("@/utils/is");
var paramsValid_1 = require("@/utils/paramsValid");
var utils_2 = require("@/rpk/utils");
var checkConfig_1 = require("@/rpk/checkConfig");
var apis_1 = require("@/rpk/apis");
var SdkCommon_1 = require("@/rpk/SdkCommon");
var stOffset_1 = require("@/utils/stOffset");
var PLATFORM = 'facebook';
var SdkFacebook = /** @class */ (function (_super) {
    __extends(SdkFacebook, _super);
    function SdkFacebook(initParams) {
        var _this = _super.call(this, PLATFORM) || this;
        _this.funcs = [];
        _this.isPromoter = false;
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
            hit_cache: false
        };
        // 商业化接口是否返回结果
        _this.businessRuleInvoking = false;
        // 条件获取商业化窗口队列
        _this.businessWindowsQueue = [];
        // 上报公共属性接口失败次数
        _this.trackPublicPropsFailCount = 0;
        _this.initConfig = {};
        // 调度埋点
        _this.scheduleInitMap = {};
        // getsharedata func 存储
        _this.getShareDataFunc = '';
        // 获取分享数据缓存调度上报参数
        _this.scheuleReportProps = {};
        // 子渠道id
        _this.subChannelId = null;
        // 是否为推广员
        _this.is_promoter = false;
        _this.game_id = '';
        // 用户唯一标识
        _this.playerId = '';
        // 推广员福利码相关信息
        _this.promoInfo = {
            timer: null,
            refresh_period_exp: 0,
            polling: 0,
            promo_code: ''
        };
        Object.assign(config_1.SYSTEM_INFO, config_2.SYSTEM_INFO, __assign({}, initParams));
        _this.playerId = FBInstant.player.getID();
        _this.getInitConfig({ complete: initParams.complete });
        return _this;
    }
    // 同步用户信息
    SdkFacebook.prototype.infoSync = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                try {
                    FBInstant.login({
                        success: function (res) {
                            FBInstant.getUserInfo({
                                success: function (userInfoResult) { return __awaiter(_this, void 0, void 0, function () {
                                    var result;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, (0, apis_1.refreshUserInfo)({
                                                    code: res.code,
                                                    gender: "".concat(userInfoResult.gender),
                                                    avatarUrl: "".concat(userInfoResult.avatarUrl),
                                                    nickName: "".concat(userInfoResult.nickName),
                                                })];
                                            case 1:
                                                result = _a.sent();
                                                callback.complete(result);
                                                return [2 /*return*/];
                                        }
                                    });
                                }); },
                                fail: function (error) {
                                    callback.complete((0, utils_2.handleTrackError)(PLATFORM, '', error));
                                }
                            });
                        },
                        fail: function (err) {
                            callback.complete((0, utils_1.handleError)(err));
                        }
                    });
                }
                catch (error) {
                    callback.complete((0, utils_2.handleTrackError)(PLATFORM, '', error));
                }
                return [2 /*return*/];
            });
        });
    };
    SdkFacebook.prototype.login = function (params, callback) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function () {
            var queryData, entryPointData, now, distinct_idLocal, distinct_id, requestParams, queryJson, user_info, reflowEnabled, source_ad, reqLogin, _e, custom_ext, rest_ext, err_1;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _f.trys.push([0, 5, , 6]);
                        queryData = this.getLoginQsAndGenerateStruct();
                        entryPointData = FBInstant.getEntryPointData();
                        console.error(entryPointData, 'entryPointData', queryData);
                        console.error(utils_1.qs.parse(entryPointData === null || entryPointData === void 0 ? void 0 : entryPointData.queryParams), 'qs.parse(entryPointData?.queryParams)');
                        // 如果facebook 分享参数存在，则合并到user_source
                        if (entryPointData === null || entryPointData === void 0 ? void 0 : entryPointData.queryParams) {
                            queryData = {
                                user_source: __assign(__assign({}, queryData), { share: __assign({}, utils_1.qs.parse(entryPointData === null || entryPointData === void 0 ? void 0 : entryPointData.queryParams)) })
                            };
                        }
                        now = new Date().getTime();
                        distinct_idLocal = (0, utils_2.customGetStorageSync)('rx_distinct_id');
                        distinct_id = distinct_idLocal || (0, v4_1.default)();
                        if (!distinct_idLocal) {
                            (0, utils_2.customSetStorageSync)('rx_distinct_id', distinct_id);
                        }
                        requestParams = __assign({ ts: now, method: params.method || 'minigame_facebook', distinct_id: distinct_id, ext: __assign(__assign({}, params.ext), { id: this.playerId // 用户唯一标识
                             }) }, queryData);
                        try {
                            if (this.subChannelId !== null) {
                                queryJson = (0, utils_2.getSearchQueries)();
                                requestParams.user_source = {
                                    guide: __assign(__assign({}, queryData), { subchannelid: this.subChannelId })
                                };
                                if (queryJson) {
                                    requestParams.user_source.guide = __assign(__assign({}, requestParams.user_source.guide), queryJson);
                                }
                            }
                        }
                        catch (err) {
                        }
                        user_info = {};
                        if (!params.login_openid) return [3 /*break*/, 2];
                        requestParams.login_openid = params.login_openid;
                        return [4 /*yield*/, (0, apis_1.loginByTokenApi)(this.ActivePrefix(requestParams))];
                    case 1:
                        user_info = _f.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        reflowEnabled = ((_b = (_a = this.initConfig) === null || _a === void 0 ? void 0 : _a.advertise_switch) === null || _b === void 0 ? void 0 : _b.switch) === 1;
                        source_ad = this.getAttributionData();
                        reqLogin = reflowEnabled ? __assign(__assign({}, requestParams), { device: source_ad }) : requestParams;
                        _e = reqLogin.ext || {}, custom_ext = _e.custom_ext, rest_ext = __rest(_e, ["custom_ext"]);
                        reqLogin.custom_ext = custom_ext || {};
                        reqLogin.ext = __assign({}, (rest_ext || {}));
                        console.log('reqLogin', reqLogin);
                        return [4 /*yield*/, (0, apis_1.loginByCredentialApi)(this.ActivePrefix(reqLogin))];
                    case 3:
                        user_info = _f.sent();
                        _f.label = 4;
                    case 4:
                        Object.assign(config_1.USER_INFO, user_info.data);
                        if ((((_c = user_info === null || user_info === void 0 ? void 0 : user_info.data) === null || _c === void 0 ? void 0 : _c.user_flag) & 1) == 1) {
                            this.is_promoter = true;
                            this.game_id = ((_d = user_info === null || user_info === void 0 ? void 0 : user_info.data) === null || _d === void 0 ? void 0 : _d.cp_user_id) || '';
                        }
                        (0, utils_2.customSetStorageSync)('rx-loginState', 1);
                        (0, utils_2.customSetStorageSync)('rxToken', user_info.data.token);
                        (0, utils_2.customSetStorageSync)('rxUserInfo', user_info.data);
                        callback.complete(user_info);
                        return [3 /*break*/, 6];
                    case 5:
                        err_1 = _f.sent();
                        console.log(JSON.stringify(err_1));
                        callback.complete((0, utils_2.handleTrackError)(PLATFORM, 'rxlog_error_login', err_1));
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    SdkFacebook.prototype.pay = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var orderReq, requestMidasPaymentReq, compensateOrderReq, reqOrder, result, res, ext, order_no, requestMidasPaymentParams, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (params.indulge_auth == 1 && !params.age) {
                            throw Error('when indulge_auth equal 1,the age must be required');
                        }
                        reqOrder = __assign(__assign({}, params), { currency: 'CNY', openid: config_1.USER_INFO.openid, sub_channel_id: config_1.USER_INFO.subchannelid, is_debug: params.is_debug || 0, env: params.env || 0 });
                        reqOrder.callback_from = 1;
                        reqOrder.ext = __assign(__assign({}, reqOrder.ext), {
                            wx_openid: config_1.USER_INFO.tid,
                            zone_id: '1',
                            pf: 'android'
                        });
                        orderReq = reqOrder;
                        return [4 /*yield*/, (0, apis_1.orderApi)(reqOrder)];
                    case 1:
                        result = _a.sent();
                        this.track({
                            complete: function () {
                            }
                        }, (0, utils_1.formatTrackParams)(__assign({ eventName: 'requestproduct', apiName: 'pay_order', state: '下单成功', reqParams: params, errorInfo: {}, loginInfo: config_1.USER_INFO, orderReq: orderReq, orderRes: (result === null || result === void 0 ? void 0 : result.data) || {} }, ((result === null || result === void 0 ? void 0 : result.data) || {}))));
                        res = result.data;
                        ext = res.ext, order_no = res.order_no;
                        requestMidasPaymentParams = {
                            appId: ext.appId,
                            mgcId: ext.mgcId,
                            accessToken: ext.accessToken,
                            productId: ext.productId || '',
                            productName: ext.productName || '',
                            productDesc: ext.productDesc || '',
                            productUrl: ext.productUrl || '',
                            bizOrderNo: ext.bizOrderNo || order_no,
                            needRefresh: params.needRefresh || 1
                        };
                        console.info('支付请求参数: ', JSON.stringify(requestMidasPaymentParams));
                        requestMidasPaymentReq = requestMidasPaymentParams;
                        FBInstant.payments.purchaseAsync({
                            productID: (params === null || params === void 0 ? void 0 : params.productId) || '',
                        }).then(function (purchase) {
                            console.info(purchase, 'purchase');
                            callback.complete({ code: 0 });
                        }).catch(function (error) {
                            console.info(error, 'error');
                            callback.complete((0, utils_2.handleTrackError)(PLATFORM, 'rxlog_error_pay', error));
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        err_2 = _a.sent();
                        callback.complete((0, utils_2.handleTrackError)(PLATFORM, 'rxlog_error_pay', err_2));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //分享
    SdkFacebook.prototype.share = function (params, callback) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
        return __awaiter(this, void 0, void 0, function () {
            var query, shareData, isFunc, shareDataDefault, error_1, queryParams;
            var _this = this;
            return __generator(this, function (_1) {
                switch (_1.label) {
                    case 0:
                        query = null // 组装参数
                        ;
                        shareData = null // 分享数据
                        ;
                        isFunc = params === null || params === void 0 ? void 0 : params.func // 是否有埋点
                        ;
                        shareDataDefault = {
                            type: 'rx',
                            user_source: 'share',
                            transmits: (params === null || params === void 0 ? void 0 : params.transmits) || '',
                            share_time: Math.floor(new Date().getTime() / 1000),
                            share_type: 'mini',
                            inviter_region: config_1.USER_INFO.region || '',
                            inviter_openid: config_1.USER_INFO.openid || '',
                            inviter_productid: config_1.SYSTEM_INFO.productId,
                            inviter_channelid: config_1.SYSTEM_INFO.channelId,
                            inviter_subchannelid: (config_1.USER_INFO === null || config_1.USER_INFO === void 0 ? void 0 : config_1.USER_INFO.subchannelid) || '',
                        };
                        _1.label = 1;
                    case 1:
                        _1.trys.push([1, 5, , 6]);
                        if (!isFunc) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getShareData(params, callback, true)];
                    case 2:
                        shareData = _1.sent();
                        query = utils_1.qs.stringify(__assign(__assign({}, shareDataDefault), { platform: ((_a = shareData === null || shareData === void 0 ? void 0 : shareData.data) === null || _a === void 0 ? void 0 : _a.platform) || '', landing_id: ((_c = (_b = shareData === null || shareData === void 0 ? void 0 : shareData.data) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.landing_id) || '', trigger_id: ((_e = (_d = shareData === null || shareData === void 0 ? void 0 : shareData.data) === null || _d === void 0 ? void 0 : _d.trigger) === null || _e === void 0 ? void 0 : _e.id) || '', trigger_tag: ((_g = (_f = shareData === null || shareData === void 0 ? void 0 : shareData.data) === null || _f === void 0 ? void 0 : _f.trigger) === null || _g === void 0 ? void 0 : _g.tag) || '', trigger_type: ((_j = (_h = shareData === null || shareData === void 0 ? void 0 : shareData.data) === null || _h === void 0 ? void 0 : _h.trigger) === null || _j === void 0 ? void 0 : _j.type) || '', material_type: ((_l = (_k = shareData === null || shareData === void 0 ? void 0 : shareData.data) === null || _k === void 0 ? void 0 : _k.content) === null || _l === void 0 ? void 0 : _l.material_type) || '', material_id: ((_o = (_m = shareData === null || shareData === void 0 ? void 0 : shareData.data) === null || _m === void 0 ? void 0 : _m.content) === null || _o === void 0 ? void 0 : _o.material_id) || '', strategy_type: ((_q = (_p = shareData === null || shareData === void 0 ? void 0 : shareData.data) === null || _p === void 0 ? void 0 : _p.strategy) === null || _q === void 0 ? void 0 : _q.type) || '', strategy_id: ((_s = (_r = shareData === null || shareData === void 0 ? void 0 : shareData.data) === null || _r === void 0 ? void 0 : _r.strategy) === null || _s === void 0 ? void 0 : _s.id) || '', material_name: ((_u = (_t = shareData === null || shareData === void 0 ? void 0 : shareData.data) === null || _t === void 0 ? void 0 : _t.content) === null || _u === void 0 ? void 0 : _u.title) || '', trigger_name: ((_w = (_v = shareData === null || shareData === void 0 ? void 0 : shareData.data) === null || _v === void 0 ? void 0 : _v.trigger) === null || _w === void 0 ? void 0 : _w.title) || '', strategy_name: ((_y = (_x = shareData === null || shareData === void 0 ? void 0 : shareData.data) === null || _x === void 0 ? void 0 : _x.strategy) === null || _y === void 0 ? void 0 : _y.name) || '' }));
                        return [3 /*break*/, 4];
                    case 3:
                        // 如果调度埋点存在，则使用调度埋点  自定义分享
                        if (this.scheuleReportProps) {
                            query = utils_1.qs.stringify(__assign(__assign({}, shareDataDefault), this.scheuleReportProps));
                        }
                        _1.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_1 = _1.sent();
                        return [3 /*break*/, 6];
                    case 6:
                        queryParams = isFunc ? "".concat(query, "&").concat((params === null || params === void 0 ? void 0 : params.transmits) || '') : this.scheuleReportProps ? "".concat(query, "&").concat((params === null || params === void 0 ? void 0 : params.transmits) || '') : "".concat((params === null || params === void 0 ? void 0 : params.transmits) || '');
                        console.error('queryParams', queryParams);
                        console.error('`${query}`', "".concat(query));
                        // 分享
                        try {
                            FBInstant.shareAsync({
                                intent: 'SHARE',
                                image: params.imageUrl,
                                // image: isFunc ? shareData?.data?.content?.image : params.imageUrl,
                                text: isFunc ? (_0 = (_z = shareData === null || shareData === void 0 ? void 0 : shareData.data) === null || _z === void 0 ? void 0 : _z.content) === null || _0 === void 0 ? void 0 : _0.content : params.title,
                                data: { queryParams: queryParams },
                            }).then(function () {
                                //
                                // 分享成功 && 一键分享或变量中存在埋点 && 自动上报 && 上报类型存在
                                if ((isFunc || _this.getShareDataFunc) && params.autoReport) {
                                    _this.shareSchedulingReport({
                                        func: params.func || _this.getShareDataFunc,
                                        scheduling_event: true,
                                        scheduling_type: 'share'
                                    }, {
                                        complete: function (res) {
                                            console.log(res);
                                        }
                                    });
                                }
                                callback.complete({ code: 0 });
                            }).catch(function (error) {
                                callback.complete((0, utils_2.handleTrackError)(PLATFORM, 'rxlog_error_share', error));
                            });
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
    /**
     * 版本号比较函数
     * @param currentVersion 当前版本号，如 '12.37.200'
     * @param minVersion 最低要求版本号，如 '12.37.200'
     * @returns 如果当前版本小于最低要求版本，返回 true；否则返回 false
     */
    SdkFacebook.prototype.versionCheck = function (currentVersion, minVersion) {
        // 将版本号字符串按 . 分割成数组
        var v1Parts = currentVersion.split('.').map(Number);
        var v2Parts = minVersion.split('.').map(Number);
        // 获取两个版本号数组的最大长度
        var maxLength = Math.max(v1Parts.length, v2Parts.length);
        // 逐位比较版本号
        for (var i = 0; i < maxLength; i++) {
            // 如果某个版本号数组已经遍历完，对应位置的值视为 0
            var num1 = i < v1Parts.length ? v1Parts[i] : 0;
            var num2 = i < v2Parts.length ? v2Parts[i] : 0;
            if (num1 < num2) {
                return true; // 当前版本小于最低要求版本
            }
            else if (num1 > num2) {
                return false; // 当前版本大于最低要求版本
            }
            // 如果当前位相等，继续比较下一位
        }
        return false; // 两个版本号相等，满足要求
    };
    // 激励视频兜底落地 当前美团版本不支持激励广告，所以需要兜底落地
    SdkFacebook.prototype.supportedAdvertisingVideo = function (callback) {
    };
    // 激励视频
    SdkFacebook.prototype.advertisingVideo = function (params, callback) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var customAd_1;
            var _this = this;
            return __generator(this, function (_c) {
                try {
                    console.warn('SDKVersion', FBInstant.getSystemInfoSync().SDKVersion);
                    if (((_a = FBInstant === null || FBInstant === void 0 ? void 0 : FBInstant.getSystemInfoSync()) === null || _a === void 0 ? void 0 : _a.SDKVersion) && this.versionCheck((_b = FBInstant === null || FBInstant === void 0 ? void 0 : FBInstant.getSystemInfoSync()) === null || _b === void 0 ? void 0 : _b.SDKVersion, '12.37.200') && (FBInstant === null || FBInstant === void 0 ? void 0 : FBInstant.createCustomAd)) {
                        console.warn('当前版本不支持激励广告');
                        this.supportedAdvertisingVideo(callback);
                        return [2 /*return*/];
                    }
                    else {
                        customAd_1 = FBInstant.createCustomAd({
                            posId: (params === null || params === void 0 ? void 0 : params.posId) || '10395' // 填入美团提供的 posId
                        });
                        console.warn('customAd', JSON.stringify(customAd_1));
                        // 如果 posId 没传，customAd 可能为空
                        if (!customAd_1) {
                            callback.complete({
                                code: -1,
                                data: null,
                                msg: '广告位实例创建失败',
                            });
                            return [2 /*return*/];
                        }
                        // 可以在 error 进行监听错误
                        customAd_1.onError(function (res) {
                            console.warn('广告加载异常', JSON.stringify(res));
                            callback.complete({
                                code: -1,
                                data: res,
                                msg: '广告加载异常',
                            });
                            // 广告位实例不再使用时销毁
                            customAd_1 && customAd_1.destroy();
                        });
                        // 可以在 onClose 进行监听关闭
                        customAd_1.onClose(function (res) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                if (res && res.isRewarded) {
                                    // 正常播放结束，可以下发游戏奖励
                                    callback.complete({
                                        code: 0,
                                        data: res,
                                        msg: '正常播放结束，可以下发游戏奖励',
                                    });
                                }
                                else {
                                    // 播放中途退出，不下发游戏奖励
                                    callback.complete({
                                        code: -1,
                                        data: res,
                                        msg: '播放中途退出，不下发游戏奖励',
                                    });
                                }
                                // 广告位实例不再使用时销毁
                                customAd_1 && customAd_1.destroy();
                                return [2 /*return*/];
                            });
                        }); });
                        // // create 时默认进行一次广告拉取，可以在 load 进行监听
                        customAd_1.onLoad(function (res) { return __awaiter(_this, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                console.warn('onLoad', JSON.stringify(res));
                                try {
                                    // adList 不为空，则拉取的是自渲染广告；否则为非自渲染。
                                    if (res && (res === null || res === void 0 ? void 0 : res.adList) && ((_a = res === null || res === void 0 ? void 0 : res.adList) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                                        callback.complete({
                                            code: -1,
                                            data: res,
                                            msg: '自渲染广告, 不进行展示',
                                        });
                                    }
                                    else {
                                        try {
                                            customAd_1.show()
                                                .then(function (res) {
                                                console.warn('show == then', JSON.stringify(res));
                                            })
                                                .catch(function (err) {
                                                console.warn('广告展示失败', JSON.stringify(err));
                                                callback.complete({
                                                    code: -1,
                                                    data: err,
                                                    msg: '广告加载失败',
                                                });
                                            });
                                        }
                                        catch (error) {
                                            console.warn('广告展示失败', JSON.stringify(error));
                                        }
                                    }
                                }
                                catch (error) {
                                    console.warn('onLoad回调处理失败', JSON.stringify(error));
                                }
                                return [2 /*return*/];
                            });
                        }); });
                    }
                }
                catch (error) {
                    console.warn('advertisingVideo error', JSON.stringify(error));
                    callback.complete((0, utils_2.handleTrackError)(PLATFORM, 'rxlog_error_ad', error));
                }
                return [2 /*return*/];
            });
        });
    };
    SdkFacebook.prototype.schedulingAction = function (params, callback) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function () {
            var func, schedulingRes, scheduling_type, shareData, adUnitId, err_3;
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
                        err_3 = _e.sent();
                        callback.complete((0, utils_2.handleTrackError)(PLATFORM, 'rxlog_error_share', err_3));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //获得分享内容
    SdkFacebook.prototype.getAdShareData = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var region, productId, channelId, platform, transmits, func, type, sub_channel_id, open_id, shareData, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        region = (params === null || params === void 0 ? void 0 : params.region) || config_1.USER_INFO.region || '';
                        productId = config_1.SYSTEM_INFO.productId, channelId = config_1.SYSTEM_INFO.channelId;
                        platform = 'facebook';
                        transmits = encodeURI(params.transmits || '');
                        func = params.func;
                        type = 'mini';
                        sub_channel_id = config_1.USER_INFO.subchannelid || '';
                        open_id = config_1.USER_INFO.openid;
                        return [4 /*yield*/, (0, apis_1.getAdShareDataApi)({
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
                        shareData = _a.sent();
                        callback && callback.complete(shareData);
                        return [2 /*return*/, shareData];
                    case 2:
                        err_4 = _a.sent();
                        callback && callback.complete((0, utils_2.handleTrackError)(PLATFORM, '', err_4));
                        return [2 /*return*/, err_4];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //激励广告
    SdkFacebook.prototype.rewardedVideoAd = function (data, _a) {
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2 /*return*/];
            });
        });
    };
    SdkFacebook.prototype.setScheuleReportProps = function (data) {
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
    SdkFacebook.prototype.getPublicProperties = function () {
        var data = (0, utils_2.customGetStorageSync)("rx_public_props");
        return { code: 0, data: data };
    };
    /**
     * 设置公共属性
     * 设置后CP无需每次上报都传，由SDK填入properties中。
     */
    SdkFacebook.prototype.setPublicProperties = function (params) {
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
    SdkFacebook.prototype.updatePublicProperties = function (params) {
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
    SdkFacebook.prototype.deletePublicProperties = function (params) {
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
    //获得分享内容
    SdkFacebook.prototype.getShareData = function (params, callback, stopCallback) {
        return __awaiter(this, void 0, void 0, function () {
            var region, cacheShareData, _a, readCache, cShareData, productId, channelId, platform, transmits, func, type, sub_channel_id, open_id, shareData, err_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 7]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(checkConfig_1.ShareCheckParams, callback, params)];
                    case 1:
                        _b.sent();
                        region = (params === null || params === void 0 ? void 0 : params.region) || config_1.USER_INFO.region || '';
                        cacheShareData = (0, utils_2.customGetStorageSync)("rx_schedule_".concat(config_1.USER_INFO.tid, "_").concat(params.func, "_").concat(region));
                        _a = params.readCache, readCache = _a === void 0 ? true : _a;
                        // 存储func
                        this.getShareDataFunc = params.func;
                        if (readCache && cacheShareData) {
                            cShareData = JSON.parse(cacheShareData);
                            console.info('sdk 缓存分享数据：', cShareData);
                            this.setScheuleReportProps(cShareData === null || cShareData === void 0 ? void 0 : cShareData.data);
                            !stopCallback && callback.complete(cShareData);
                            return [2 /*return*/, cShareData];
                        }
                        productId = config_1.SYSTEM_INFO.productId, channelId = config_1.SYSTEM_INFO.channelId;
                        platform = 'facebook';
                        transmits = encodeURI(params.transmits || '');
                        func = params.func;
                        type = 'mini';
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
                        err_5 = _b.sent();
                        if (!(err_5.code == 305407)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.shareSchedulingInit({}, {
                                complete: function () {
                                    if (!stopCallback) {
                                        callback.complete((0, utils_2.handleTrackError)(PLATFORM, '', err_5));
                                    }
                                }
                            })];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        if (!stopCallback) {
                            callback.complete((0, utils_2.handleTrackError)(PLATFORM, '', err_5));
                        }
                        _b.label = 6;
                    case 6:
                        this.track((0, utils_1.formatTrackParams)({
                            eventName: 'track_err',
                            apiName: 'getShareData',
                            reqParams: params,
                            errorInfo: err_5,
                            loginInfo: config_1.USER_INFO
                        }), {
                            complete: function (data) {
                                console.info('getShareData error add complete func when tracked:', data);
                            }
                        });
                        return [2 /*return*/, (0, utils_2.handleTrackError)(PLATFORM, '', err_5)];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    // 获取埋点调度
    SdkFacebook.prototype.getShareScheduling = function (params) {
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
    SdkFacebook.prototype.shareSchedulingInit = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var req, res, error_2;
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
                        return [4 /*yield*/, (0, apis_1.schedulingInitApi)(req)];
                    case 2:
                        res = _a.sent();
                        this.scheduleInitMap = (res === null || res === void 0 ? void 0 : res.data) || {};
                        (0, utils_2.removeStorageByPrefix)('rx_schedule');
                        callback.complete(res);
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // 看广告完成上报
    SdkFacebook.prototype.shareSchedulingReport = function (params, callback) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var func, region, sub_channel_id, open_id, scheduling_event, Iparams, result_1, remaining_share_count, error_3;
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
                        Iparams = __assign(__assign({ platform: PLATFORM, type: 'mini', sub_channel_id: sub_channel_id, open_id: open_id }, params), { region: region, scheduling_event: scheduling_event, properties: __assign({ region: region }, params === null || params === void 0 ? void 0 : params.properties) });
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
                        error_3 = _d.sent();
                        callback.complete((0, utils_2.handleTrackError)(PLATFORM, '', error_3));
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    SdkFacebook.prototype.getInitConfig = function (callback) {
        var _a, _b, _c, _d, _e, _f, _g;
        return __awaiter(this, void 0, void 0, function () {
            var initParams, res, config, version, _i, _h, key, prop_version, _serverTime, err_6, error;
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
                        // //检查是否需要传递subchannleid
                        this.publicSubchannelCheck(res);
                        (0, utils_2.customSetStorageSync)('rx-init-params', { version: version });
                        config_1.SYSTEM_INFO.SDK_INIT_FINISHED = true;
                        config_1.SYSTEM_INFO.CP_OF = ((_e = (_d = res === null || res === void 0 ? void 0 : res.data) === null || _d === void 0 ? void 0 : _d.cp) === null || _e === void 0 ? void 0 : _e.of) || false;
                        _serverTime = (_g = (_f = res === null || res === void 0 ? void 0 : res.data) === null || _f === void 0 ? void 0 : _f.server) === null || _g === void 0 ? void 0 : _g.time;
                        if (_serverTime) {
                            config_1.SYSTEM_INFO.st_offset = String(Number(_serverTime) - Date.now());
                        }
                        (0, stOffset_1.setupStOffsetRefreshForH5)(apis_1.getServerTime);
                        // // 检查是否需要激活
                        this.checkNeedActivate();
                        this.loopGetPublicProps();
                        callback.complete({ code: 0, data: this.initConfig });
                        return [3 /*break*/, 4];
                    case 3:
                        err_6 = _j.sent();
                        console.info('init err');
                        console.info(err_6);
                        error = __assign(__assign({}, (err_6 || {})), { msg: '初始化错误，或未初始化', code: const_1.COMMON_ERROR_CODE.INIT_PARAMS_ERROR, thirdcode: err_6.code || err_6.errCode, message: err_6.message || err_6.msg || err_6.errMsg, thirdmsg: err_6.message || err_6.msg || err_6.errMsg });
                        callback.complete((0, utils_2.handleTrackError)(PLATFORM, 'rxlog_error_init', error));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SdkFacebook.prototype.publicSubchannelCheck = function (res) {
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
    SdkFacebook.prototype.getAttributionData = function () {
        var universal = (0, utils_2.getSearchQueries)();
        var source_ad = {};
        if (universal === null || universal === void 0 ? void 0 : universal.ad_platform) {
            source_ad.ad_rawargs = (0, is_1.omit)(universal, ['ad_platform']);
            source_ad.ad_platform = universal.ad_platform;
        }
        return source_ad;
    };
    SdkFacebook.prototype.checkNeedActivate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var activeResult, source_ad, distinct_id, req, result, err_7;
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
                        err_7 = _a.sent();
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
    SdkFacebook.prototype.loopGetPublicProps = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var event_public_attr, timerId, repeat, getPublicPropsConfig;
            var _this = this;
            return __generator(this, function (_b) {
                event_public_attr = (_a = this.initConfig) === null || _a === void 0 ? void 0 : _a.event_public_attr;
                if ((0, is_1.isEmpty)(event_public_attr))
                    return [2 /*return*/];
                repeat = function (ms) {
                    timerId && clearTimeout(timerId);
                    timerId = setTimeout(function () { return getPublicPropsConfig(); }, ms || _this.businessRuleDefaultRefreshTime);
                };
                getPublicPropsConfig = function () { return __awaiter(_this, void 0, void 0, function () {
                    var res, _a, _b, refresh, public_attr, _c, version, initParams, error_4;
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
                                error_4 = _d.sent();
                                (0, utils_2.handleTrackError)(PLATFORM, '', error_4);
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
    SdkFacebook.prototype.getLoginQsAndGenerateStruct = function () {
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
    SdkFacebook.prototype.ActivePrefix = function (reqParams) {
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
    SdkFacebook.prototype.setSubChannelId = function (subChannelId) {
        try {
            (0, utils_2.customSetStorageSync)('rx_sub_package_info', { sub_channel_id: subChannelId });
            return { code: 0 };
        }
        catch (error) {
            return (0, utils_2.handleTrackError)(PLATFORM, '', error);
        }
    };
    //商业广告
    SdkFacebook.prototype.getAllBusinessData = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            var data, result;
            return __generator(this, function (_a) {
                try {
                    data = (0, is_1.omit)(this.businessRulesInfo, 'timerId');
                    result = { code: 0, data: data };
                    callback.complete(result);
                }
                catch (error) {
                    callback.complete((0, utils_2.handleTrackError)(PLATFORM, '', error));
                }
                return [2 /*return*/];
            });
        });
    };
    // 条件获取商业化窗口数据
    SdkFacebook.prototype.getBusinessData = function (params, callback) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var checkCache, window_key_1, event_1, _c, before_event, _d, cache_1, cacheKey_1, _e, _f, _g, auto_popups, _h, manual_popups, matchWindows, windows, result, error_5;
            var _this = this;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        // 如果登录接口内部调用的商业化接口没有返回结果，将此接口按调用次序缓存起来，接口结果回来后一次返回
                        // cp 主动调用更新商业化接口不管，需要他们自己在接口返回后条件获取商业化窗口数据
                        if (this.businessRuleInvoking) {
                            this.businessWindowsQueue.push(function () { return _this.getBusinessData(params, callback); });
                            return [2 /*return*/];
                        }
                        checkCache = function () {
                            var currentDate = (0, day_1.formatDate)('YYYY-MM-DD'); //dayjs().format('YYYY-MM-DD')
                            var cacheKeyPrefix = 'rx_business_popup_';
                            var cacheKey = "".concat(cacheKeyPrefix).concat(currentDate);
                            var cache = (0, utils_2.customGetStorageSync)(cacheKey);
                            if (!cache) {
                                cache = {};
                                (0, utils_2.customSetStorageSync)(cacheKey, {});
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
                                    (0, utils_2.customSetStorageSync)(cacheKey_1, cache_1);
                                }
                                return windowInfo;
                            }
                        }));
                        console.log('result windows: ', windows);
                        result = { code: 0, data: windows };
                        callback.complete(result);
                        return [3 /*break*/, 4];
                    case 3:
                        error_5 = _j.sent();
                        callback.complete((0, utils_2.handleTrackError)(PLATFORM, '', error_5));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // 更新商业化窗口数据
    SdkFacebook.prototype.refreshBusinessData = function (callback, isRecord) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data, hit_cache, _a, version, _b, refresh_time, _c, main_window_list, _d, window_list, error_6;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        isRecord && (this.businessRuleInvoking = true);
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, (0, apis_1.getBusinessRules)(this.businessRulesInfo.version)];
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
                        error_6 = _e.sent();
                        (callback === null || callback === void 0 ? void 0 : callback.complete) && callback.complete((0, utils_2.handleTrackError)(PLATFORM, '', error_6));
                        return [3 /*break*/, 5];
                    case 4:
                        isRecord && this.dispatchBusinessWindowsQueue();
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SdkFacebook.prototype.dispatchBusinessWindowsQueue = function () {
        return __awaiter(this, void 0, void 0, function () {
            var execute;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // console.info('sdk 触发商业化窗口队列释放')
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
    SdkFacebook.prototype.requestBusinessOrder = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, err_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(checkConfig_1.checkIReqBusinessOrder, callback, params)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, apis_1.businessOrderApi)(params)];
                    case 2:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 4];
                    case 3:
                        err_8 = _a.sent();
                        callback.complete((0, utils_2.handleTrackError)(PLATFORM, '', err_8));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SdkFacebook.prototype.clearPromoterTimer = function () {
        console.log('clearPromoterTimer');
        if (this.promoInfo.timer) {
            clearTimeout(this.promoInfo.timer);
            this.promoInfo.timer = null;
        }
    };
    // 启动定时器
    SdkFacebook.prototype.startPromoterTimer = function (callback, autoRefresh) {
        var _this = this;
        if (autoRefresh === void 0) { autoRefresh = true; }
        var delay = this.promoInfo.refresh_period_exp < 1 ? (this.promoInfo.polling ? (this.promoInfo.polling * 1000) : 10000) : (this.promoInfo.refresh_period_exp * 1000);
        console.log('startPromoterTimer', delay);
        this.promoInfo.timer = setTimeout(function () {
            _this.getPromoDisplayKEY(callback, autoRefresh, false);
        }, delay);
    };
    // 获取福利码
    SdkFacebook.prototype.getPromoDisplayKEY = function (callback, autoRefresh, immediately) {
        var _this = this;
        if (autoRefresh === void 0) { autoRefresh = false; }
        if (immediately === void 0) { immediately = true; }
        this.clearPromoterTimer();
        var promo_code = this.promoInfo.promo_code;
        (0, apis_1.getPromoterCodeApi)(this.game_id).then(function (res) {
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
                callback && callback.complete((0, utils_2.handleTrackError)(PLATFORM, '', err));
            }
            else {
                if (autoRefresh) {
                    _this.startPromoterTimer(callback, autoRefresh);
                }
                else {
                    callback && callback.complete((0, utils_2.handleTrackError)(PLATFORM, '', err));
                }
            }
        });
    };
    // 兑换福利码
    SdkFacebook.prototype.exchangePromoCDKEY = function (cdkey, callback) {
        (0, apis_1.exchangePromoterCodeApi)(cdkey).then(function (res) {
            callback.complete(res);
        }).catch(function (err) {
            callback.complete((0, utils_2.handleTrackError)(PLATFORM, '', err));
        });
    };
    SdkFacebook.prototype.checkIsPromoter = function () {
        return this.isPromoter;
    };
    //获得设备码接口
    SdkFacebook.prototype.getUserDeviceCode = function () {
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
    /**
     * 添加到桌面
     * @param params 说明如下
     * shortcutType 快捷方式类型 1: 动态快捷方式,Android版本大于24才支持,对应iOS的3D touch 2: 常规桌面快捷方式，会新增一个图标 3: 桌面小插件,常见墨迹天气的桌面插件
     * id 快捷方式唯一标识
     * label 快捷方式显示的名称（shortcutType=1 或 2时必填）
     * icon 快捷方式图片网络路径
     * target 快捷方式跳转目标页面（shortcutType=1 或 2时必填）
     * widgetProviderId 桌面小插件唯一标识
     * interceptSuccess 拦截添加快捷方式成功提示（目前只有addShortcut生效）
     * */
    SdkFacebook.prototype.addShortcut = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, err_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, utils_1.asyncFunc)(FBInstant.addShortcut, {
                                shortcutType: (params === null || params === void 0 ? void 0 : params.shortcutType) || 2,
                                id: (params === null || params === void 0 ? void 0 : params.id) || 'gameid_rx',
                                label: (params === null || params === void 0 ? void 0 : params.label) || 'rx',
                                icon: (params === null || params === void 0 ? void 0 : params.icon) || '',
                                target: (params === null || params === void 0 ? void 0 : params.target) || '',
                                widgetProviderId: (params === null || params === void 0 ? void 0 : params.widgetProviderId) || 'gameid_widget_rx',
                                interceptSuccess: (params === null || params === void 0 ? void 0 : params.interceptSuccess) || false
                            })];
                    case 1:
                        result = _a.sent();
                        if (result.value != null) {
                            console.log('添加桌面原始错误' + JSON.stringify(result));
                            callback.complete((0, utils_1.handleError)({
                                code: const_1.COMMON_ERROR_CODE.ADD_SHORT_CUT,
                                msg: '添加到桌面失败',
                                thirdcode: result.code,
                                thirdmsg: result.msg
                            }));
                        }
                        else {
                            callback.complete({ code: 0 });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_9 = _a.sent();
                        console.log('不支持添加到桌面');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return SdkFacebook;
}(SdkCommon_1.default));
exports.default = SdkFacebook;
//# sourceMappingURL=index.facebook.js.map