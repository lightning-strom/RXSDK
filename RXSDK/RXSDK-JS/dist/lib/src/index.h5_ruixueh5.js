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
var config_2 = require("@/h5/config");
var const_1 = require("@/config/const");
var utils_1 = require("@/utils/utils");
var day_1 = require("@/utils/day");
var is_1 = require("@/utils/is");
var utils_2 = require("@/h5/utils");
var apis_1 = require("@/h5/apis");
var SdkCommomUI_1 = require("@/h5/SdkCommomUI");
var stOffset_1 = require("@/utils/stOffset");
var PLATFORM = 'ruixue';
// @ts-ignore
var SdkH5Ruixue = /** @class */ (function (_super) {
    __extends(SdkH5Ruixue, _super);
    function SdkH5Ruixue(initParams) {
        var _this = _super.call(this, PLATFORM) || this;
        _this._hasAd = {
            rewarded: undefined
        };
        _this._ad = null;
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
        _this.funcs = [];
        // 支付消息监听器引用（用于清理）
        _this.payMessageHandler = null;
        // private initConfig: any = {}
        // 调度埋点
        _this.scheduleInitMap = {};
        // 获取分享数据缓存调度上报参数
        _this.scheuleReportProps = {};
        // 子渠道id
        _this.subChannelId = null;
        // 是否为推广员
        _this.is_promoter = false;
        _this.game_id = '';
        // 推广员福利码相关信息
        _this.promoInfo = {
            timer: null,
            refresh_period_exp: 0,
            polling: 0,
            promo_code: ''
        };
        Object.assign(config_1.SYSTEM_INFO, config_2.SYSTEM_INFO, __assign({}, initParams));
        _this.getInitConfig({ complete: initParams.complete });
        console.log('getSearchQueries', (0, utils_2.getSearchQueries)());
        return _this;
    }
    /**
     * 用于设置自定义返回错误 Msg
     */
    SdkH5Ruixue.prototype.setErrorMsg = function (errMsg) {
        config_1.SYSTEM_INFO.errMsg = errMsg;
    };
    /**
     * 清空返回错误 Msg
     */
    SdkH5Ruixue.prototype.clearErrorMsg = function () {
        config_1.SYSTEM_INFO.errMsg = {
            default: ''
        };
    };
    SdkH5Ruixue.prototype.calculateValueSizeWithEncoding = function (key) {
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
    SdkH5Ruixue.prototype.track = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var p1, p2, getDevicecode_1, devicecode, type, time, uuids, platform_id, copyCpid, product_id, channel_id, cpid, publicProps, reqarr, useCache, size, rx_track_queue, result, err_1;
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
    /**
     * H5瑞雪登录方法
     * @param params 登录参数
     * @param callback 可选回调函数
     */
    SdkH5Ruixue.prototype.login = function (params, callback) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function () {
            var user_source, now, distinct_id, requestParams, queryJson, user_info, reflowEnabled, source_ad, reqLogin, _e, custom_ext, rest_ext, err_2;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _f.trys.push([0, 7, , 8]);
                        user_source = this.getLoginQsAndGenerateStruct();
                        now = Date.now();
                        distinct_id = (0, utils_2.customGetStorageSync)('rx_distinct_id') || (0, v4_1.default)() // 获取或生成设备唯一ID
                        ;
                        // 如果本地没有存储过distinct_id，则进行存储
                        if (!(0, utils_2.customGetStorageSync)('rx_distinct_id')) {
                            (0, utils_2.customSetStorageSync)('rx_distinct_id', distinct_id);
                        }
                        requestParams = __assign({ ts: now, method: params === null || params === void 0 ? void 0 : params.method, distinct_id: distinct_id, ext: __assign(__assign({}, params === null || params === void 0 ? void 0 : params.ext), { captcha_code: (params === null || params === void 0 ? void 0 : params.captcha_code) || '' }) }, user_source);
                        // 如果方法为captchacode，则添加用户名
                        if (params.method == 'captchacode' && (params === null || params === void 0 ? void 0 : params.username)) {
                            requestParams.username = (params === null || params === void 0 ? void 0 : params.username) || '';
                        }
                        // 2. 处理子渠道信息
                        try {
                            if (this.subChannelId !== null) {
                                queryJson = (0, utils_2.getSearchQueries)();
                                requestParams.user_source = {
                                    guide: __assign(__assign({}, user_source), { subchannelid: this.subChannelId })
                                };
                                // 合并查询参数
                                if (queryJson) {
                                    requestParams.user_source.guide = __assign(__assign({}, requestParams.user_source.guide), queryJson);
                                }
                            }
                        }
                        catch (err) {
                            // 子渠道信息处理出错时忽略，不影响主流程
                        }
                        user_info = {};
                        if (!params.login_openid) return [3 /*break*/, 2];
                        // 3.1 使用openid登录
                        requestParams.login_openid = params.login_openid;
                        return [4 /*yield*/, (0, apis_1.loginByTokenApi)(this.ActivePrefix(requestParams))];
                    case 1:
                        user_info = _f.sent();
                        return [3 /*break*/, 6];
                    case 2:
                        reflowEnabled = ((_b = (_a = this.initConfig) === null || _a === void 0 ? void 0 : _a.advertise_switch) === null || _b === void 0 ? void 0 : _b.switch) === 1 // 投放开关检查
                        ;
                        source_ad = this.getAttributionData();
                        reqLogin = reflowEnabled ? __assign(__assign({}, requestParams), { device: source_ad }) : requestParams;
                        _e = reqLogin.ext || {}, custom_ext = _e.custom_ext, rest_ext = __rest(_e, ["custom_ext"]);
                        reqLogin.custom_ext = custom_ext || {};
                        reqLogin.ext = __assign({}, (rest_ext || {}));
                        console.log('reqLogin', reqLogin);
                        if (!(params.method == 'ruixue')) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.h5Login(this.ActivePrefix(reqLogin))];
                    case 3:
                        user_info = _f.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, (0, apis_1.loginByCredentialApi)(this.ActivePrefix(reqLogin))];
                    case 5:
                        user_info = _f.sent();
                        _f.label = 6;
                    case 6:
                        // 4. 处理登录结果
                        Object.assign(config_1.USER_INFO, user_info.data);
                        // 检查是否为推广员
                        if ((((_c = user_info === null || user_info === void 0 ? void 0 : user_info.data) === null || _c === void 0 ? void 0 : _c.user_flag) & 1) === 1) {
                            this.is_promoter = true;
                            this.game_id = ((_d = user_info === null || user_info === void 0 ? void 0 : user_info.data) === null || _d === void 0 ? void 0 : _d.cp_user_id) || '';
                        }
                        // 5. 持久化登录状态
                        (0, utils_2.customSetStorageSync)('rx-loginState', 1);
                        (0, utils_2.customSetStorageSync)('rxToken', user_info.data.token);
                        // 6. 执行回调
                        callback === null || callback === void 0 ? void 0 : callback.complete(user_info);
                        return [3 /*break*/, 8];
                    case 7:
                        err_2 = _f.sent();
                        console.error('登录失败:', err_2);
                        // 错误处理回调
                        callback === null || callback === void 0 ? void 0 : callback.complete((0, utils_2.handleTrackError)(PLATFORM, 'rxlog_error_login', err_2));
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * H5瑞雪支付方法（复用 createModalIframe）
     * @param params 支付参数
     * @param callback 回调函数
     *
     * 整体流程：
     * 1. 构建支付参数 payParams（模拟假数据）
     * 2. 注册 message 监听器（先注册，保证不丢消息）
     * 3. 调用 createModalIframe 创建模态框
     * 4. iframe 加载完成后发送 PAY_IFRAME_READY
     * 5. SDK 收到 READY 后发送 payParams 给 iframe
     * 6. 用户完成支付后，iframe 发送 PAY_RESULT
     * 7. SDK 收到结果，调用 callback，清理资源
     */
    SdkH5Ruixue.prototype.pay = function (params, callback) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function () {
            var PATH_URL, BASE_URL, timezone, channelId, productId, cpid, version, baseUrlList, language, devicecode, accesstoken, payParams_1, messageHandler, reqOrder, result, err_3;
            var _this = this;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 4, , 5]);
                        if (params.indulge_auth == 1 && !params.age) {
                            throw Error('when indulge_auth equal 1,the age must be required');
                        }
                        if (!((params === null || params === void 0 ? void 0 : params.pay_type) == 'checkstand')) return [3 /*break*/, 1];
                        PATH_URL = 'pay';
                        BASE_URL = 'pay';
                        timezone = config_1.SYSTEM_INFO.timezone, channelId = config_1.SYSTEM_INFO.channelId, productId = config_1.SYSTEM_INFO.productId, cpid = config_1.SYSTEM_INFO.cpid, version = config_1.SYSTEM_INFO.__RX_SDK_VERSION, baseUrlList = config_1.SYSTEM_INFO.baseUrlList, language = config_1.SYSTEM_INFO.language;
                        devicecode = (0, utils_2.getDevicecode)();
                        accesstoken = ((_a = config_1.USER_INFO.token) === null || _a === void 0 ? void 0 : _a.access) || '';
                        payParams_1 = {
                            type: 'INIT_PAY_PARAMS',
                            api_params: {
                                country_code: language || 'zh',
                                productid: productId || '',
                                devicecode: devicecode || '',
                                cpid: cpid || '',
                                domain: (baseUrlList === null || baseUrlList === void 0 ? void 0 : baseUrlList[0]) || '',
                                language: language || 'zh',
                                platformid: config_2.SYSTEM_INFO.platformid || '1',
                                version: version || '',
                                channelid: channelId || '',
                                tzoffset: timezone ? "".concat(timezone) : '8.00'
                            },
                            request_headers: {
                                'ruixue-channelid': channelId || '',
                                'ruixue-accesstoken': accesstoken || '',
                                'ruixue-devicecode': devicecode || '',
                                'ruixue-traceid': (0, v4_1.default)(),
                                'ruixue-language': language || 'zh',
                                'ruixue-platformid': config_2.SYSTEM_INFO.platformid || '1',
                                'ruixue-tzoffset': timezone ? "".concat(timezone) : '8.00',
                                'ruixue-cpid': cpid || '',
                                'ruixue-version': version || '',
                                'ruixue-productid': productId || ''
                            },
                            order_info: __assign(__assign({}, params), { currency: params.currency || 'CNY', openid: config_1.USER_INFO.openid, sub_channel_id: config_1.USER_INFO === null || config_1.USER_INFO === void 0 ? void 0 : config_1.USER_INFO.subchannelid, is_debug: params.is_debug || 0, env: params.env || 0, ext: __assign({}, params.ext || {}) })
                        };
                        // 移除之前的监听器（防止累积）
                        if (this.payMessageHandler) {
                            window.removeEventListener('message', this.payMessageHandler);
                            this.payMessageHandler = null;
                        }
                        messageHandler = function (event) {
                            var _a;
                            var type = (event.data || {}).type;
                            console.log('[Pay] message:', type);
                            // iframe 准备好了，发送支付参数
                            if (type === 'PAY_IFRAME_READY') {
                                console.log('[Pay] → 发送 payParams');
                                var iframe = document.getElementById('dynamic-iframe');
                                (_a = iframe === null || iframe === void 0 ? void 0 : iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.postMessage(payParams_1, '*');
                            }
                            // 支付关闭
                            if (type === 'close_pay') {
                                console.log('[Pay] ← 用户关闭支付');
                                // 清理监听器
                                if (_this.payMessageHandler) {
                                    window.removeEventListener('message', _this.payMessageHandler);
                                    _this.payMessageHandler = null;
                                }
                            }
                        };
                        // 保存引用
                        this.payMessageHandler = messageHandler;
                        // Step 1: 先注册监听器（保证不丢消息）
                        window.addEventListener('message', messageHandler);
                        // Step 2: 调用 createModalIframe 创建模态框
                        this.createModalIframe({
                            path: PATH_URL,
                            base: BASE_URL
                        }).then(function () {
                            callback.complete({ code: 0 });
                        }).catch(function (err) {
                            callback.complete(err);
                        });
                        return [3 /*break*/, 3];
                    case 1:
                        reqOrder = __assign(__assign({}, params), { currency: params.currency || 'CNY', openid: config_1.USER_INFO.openid, sub_channel_id: config_1.USER_INFO === null || config_1.USER_INFO === void 0 ? void 0 : config_1.USER_INFO.subchannelid, is_debug: params.is_debug || 0, env: params.env || 0, ext: __assign({}, params.ext || {}) });
                        switch (params.pay_type) {
                            case 'aums':
                                reqOrder.ext.hq_type = ((_b = params === null || params === void 0 ? void 0 : params.ext) === null || _b === void 0 ? void 0 : _b.hq_type) || 'minih5';
                                break;
                        }
                        return [4 /*yield*/, (0, apis_1.orderApi)(reqOrder)];
                    case 2:
                        result = _e.sent();
                        if ((params === null || params === void 0 ? void 0 : params.webview) === 1) {
                            if (result.data.ext.url) {
                                window.location.href = result.data.ext.url;
                                callback.complete({ code: 0 });
                                return [2 /*return*/];
                            }
                            else {
                                callback.complete((0, utils_2.handleTrackError)(PLATFORM, 'rxlog_error_pay', {
                                    code: const_1.COMMON_ERROR_CODE.PAY_ERROR,
                                    msg: '支付错误',
                                }));
                            }
                        }
                        this.openPay({
                            url: ((_c = params === null || params === void 0 ? void 0 : params.ext) === null || _c === void 0 ? void 0 : _c.hq_type) === 'qrcode' && (params === null || params === void 0 ? void 0 : params.pay_type) === 'aums' ? result.data.ext.qrcode_url : result.data.ext.url,
                            hq_type: ((_d = params === null || params === void 0 ? void 0 : params.ext) === null || _d === void 0 ? void 0 : _d.hq_type) || 'minih5',
                            pay_type: params === null || params === void 0 ? void 0 : params.pay_type
                        }).then(function () {
                            callback.complete({ code: 0 });
                        }).catch(function (err) {
                            callback.complete(err);
                        });
                        _e.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        err_3 = _e.sent();
                        console.info(err_3);
                        callback.complete((0, utils_2.handleTrackError)(PLATFORM, 'rxlog_error_pay', {
                            code: err_3.code || const_1.COMMON_ERROR_CODE.PAY_ERROR,
                            msg: err_3.msg || '支付错误',
                            thirdcode: err_3.code,
                            thirdmsg: err_3.msg
                        }));
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SdkH5Ruixue.prototype.share = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    // 关闭支付窗口
    SdkH5Ruixue.prototype.closePay = function () {
        var _a;
        try {
            (_a = window === null || window === void 0 ? void 0 : window.parent) === null || _a === void 0 ? void 0 : _a.postMessage({
                type: "close_pay",
                code: -1,
                msg: "关闭支付窗口",
            }, "*");
        }
        catch (err) {
            console.error('关闭支付窗口失败:', err);
        }
    };
    // 激励广告
    SdkH5Ruixue.prototype.rewardedVideoAd = function (data, callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    SdkH5Ruixue.prototype.setScheuleReportProps = function (data) {
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
    SdkH5Ruixue.prototype.getPublicProperties = function () {
        var data = (0, utils_2.customGetStorageSync)("rx_public_props");
        return { code: 0, data: data };
    };
    /**
     * 设置公共属性
     * 设置后CP无需每次上报都传，由SDK填入properties中。
     */
    SdkH5Ruixue.prototype.setPublicProperties = function (params) {
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
    SdkH5Ruixue.prototype.updatePublicProperties = function (params) {
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
    SdkH5Ruixue.prototype.deletePublicProperties = function (params) {
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
    SdkH5Ruixue.prototype.getInitConfig = function (callback) {
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
                        // 检查是否需要激活
                        this.checkNeedActivate();
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
    SdkH5Ruixue.prototype.publicSubchannelCheck = function (res) {
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
            // 忽略错误
        }
    };
    // 获取归因数据
    SdkH5Ruixue.prototype.getAttributionData = function () {
        var universal = (0, utils_2.getSearchQueries)();
        var source_ad = {};
        if (universal === null || universal === void 0 ? void 0 : universal.ad_platform) {
            source_ad.ad_rawargs = (0, is_1.omit)(universal, ['ad_platform']);
            source_ad.ad_platform = universal.ad_platform;
        }
        return source_ad;
    };
    SdkH5Ruixue.prototype.checkNeedActivate = function () {
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
    //格式化queryString
    SdkH5Ruixue.prototype.getLoginQsAndGenerateStruct = function () {
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
    SdkH5Ruixue.prototype.ActivePrefix = function (reqParams) {
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
    SdkH5Ruixue.prototype.setSubChannelId = function (subChannelId) {
        try {
            (0, utils_2.customSetStorageSync)('rx_sub_package_info', { sub_channel_id: subChannelId });
            return { code: 0 };
        }
        catch (error) {
            return (0, utils_2.handleTrackError)(PLATFORM, '', error);
        }
    };
    return SdkH5Ruixue;
}(SdkCommomUI_1.default));
exports.default = SdkH5Ruixue;
//# sourceMappingURL=index.h5_ruixueh5.js.map