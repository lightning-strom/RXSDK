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
var apis_1 = require("./apis");
var config_1 = require("@/config");
var utils_1 = require("@/h5/utils");
var SdkCommon_1 = require("./SdkCommon");
var SDKUI = /** @class */ (function (_super) {
    __extends(SDKUI, _super);
    function SDKUI(platform) {
        var _this = _super.call(this, platform) || this;
        _this.initConfig = {};
        _this.orientation = window.orientation;
        _this.game_user_id = '';
        _this.theme = 'light';
        return _this;
    }
    /**
     * 检测是否是微信浏览器
     */
    SDKUI.prototype.isWeChatBrowser = function () {
        return /MicroMessenger/i.test(navigator.userAgent);
    };
    SDKUI.prototype.isMobileWechat = function () {
        var isWeixin = this.isWeChatBrowser();
        var isMobile = this.isMobile();
        return isWeixin && isMobile;
    };
    SDKUI.prototype.isMobile = function () {
        return typeof window.orientation !== 'undefined' || 'ontouchstart' in window;
    };
    SDKUI.prototype.checkOrientation = function () {
        var portraitRatio = 0.75;
        var ratio = window.innerWidth / window.innerHeight;
        return ratio < portraitRatio;
    };
    SDKUI.prototype.getIframeSrc = function (_a) {
        var path = _a.path, base = _a.base;
        return "".concat(config_1.SYSTEM_INFO.baseUrlList[0], "/static/").concat(base, "#/").concat(path);
    };
    SDKUI.prototype.getInitParams = function () {
        var token = config_1.USER_INFO.token;
        var timezone = config_1.SYSTEM_INFO.timezone, channelId = config_1.SYSTEM_INFO.channelId, productId = config_1.SYSTEM_INFO.productId, cpid = config_1.SYSTEM_INFO.cpid, version = config_1.SYSTEM_INFO.__RX_SDK_VERSION, baseUrlList = config_1.SYSTEM_INFO.baseUrlList, cpof = config_1.SYSTEM_INFO.CP_OF, region_tag = config_1.SYSTEM_INFO.region_tag, cp_role_id = config_1.SYSTEM_INFO.cp_role_id, language = config_1.SYSTEM_INFO.language;
        return __assign(__assign(__assign(__assign({ width: window.innerWidth, height: window.innerHeight, isWechat: this.isWeChatBrowser(), isMobile: this.isMobile(), isMobileWechat: this.isMobileWechat(), isVertical: this.checkOrientation(), orientation: this.orientation, initConfig: this.initConfig, devicecode: (0, utils_1.getDevicecode)(), timezone: timezone, channelId: channelId, productId: productId, cpid: cpid, version: version, baseUrlList: baseUrlList, cpof: cpof, language: language || 'zh' }, (region_tag && { region_tag: "".concat(region_tag) })), (cp_role_id && { cp_role_id: "".concat(cp_role_id) })), ((token === null || token === void 0 ? void 0 : token.access) && { accesstoken: token.access })), { loginData: config_1.USER_INFO });
    };
    SDKUI.prototype.createModalIframe = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var CONTAINER_ID = 'sdk-container';
                        var IFRAME_ID = 'dynamic-iframe';
                        var IFRAME_NAME = 'dynamicFrame';
                        var container = document.getElementById(CONTAINER_ID);
                        if (!container) {
                            reject(new Error('未找到sdk-container元素'));
                            return;
                        }
                        var originalBodyStyle = {
                            overflow: document.body.style.overflow,
                            position: document.body.style.position,
                            width: document.body.style.width,
                            height: document.body.style.height
                        };
                        document.body.style.overflow = 'hidden';
                        var updateContainerStyle = function () {
                            var width = window.innerWidth;
                            var height = window.innerHeight;
                            Object.assign(container.style, {
                                position: 'fixed',
                                top: '50%',
                                left: '50%',
                                width: "".concat(width, "px"),
                                height: "".concat(height, "px"),
                                zIndex: '9999',
                                backgroundColor: params.backgroundColor || 'rgba(0, 0, 0, 0.3)',
                                overflow: 'hidden',
                                transform: 'translate(-50%, -50%)',
                                margin: '0',
                                padding: '0'
                            });
                        };
                        updateContainerStyle();
                        var iframe = document.createElement('iframe');
                        var currentPathParams = {
                            path: params.path,
                            base: params.base || 'passporth5'
                        };
                        var initIframe = function () {
                            iframe.src = _this.getIframeSrc(currentPathParams);
                            iframe.frameBorder = '0';
                            iframe.id = IFRAME_ID;
                            iframe.name = IFRAME_NAME;
                            Object.assign(iframe.style, {
                                width: '100%',
                                height: '100%',
                                border: 'none',
                                display: 'block'
                            });
                            container.appendChild(iframe);
                        };
                        var reloadIframe = function () {
                            if (container.contains(iframe)) {
                                container.removeChild(iframe);
                            }
                            iframe = document.createElement('iframe');
                            initIframe();
                        };
                        initIframe();
                        var cleanup = function () {
                            window.removeEventListener('message', handleMessage);
                            window.removeEventListener('resize', handleResize);
                            window.removeEventListener('resize', handleMobileResize);
                            if (typeof window.orientation !== 'undefined') {
                                window.removeEventListener('orientationchange', handleOrientationChange);
                            }
                            if (container.contains(iframe)) {
                                container.removeChild(iframe);
                            }
                            container.style.cssText = '';
                            Object.assign(document.body.style, originalBodyStyle);
                        };
                        var debounce = function (func, delay) {
                            var timer;
                            return function () {
                                var _this = this;
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                clearTimeout(timer);
                                timer = window.setTimeout(function () { return func.apply(_this, args); }, delay);
                            };
                        };
                        var handleViewportChange = debounce(function () {
                            originHeight = window.innerHeight;
                            updateContainerStyle();
                            reloadIframe();
                        }, 200);
                        var handleResize = function () {
                            handleViewportChange();
                        };
                        var originHeight = window.innerHeight;
                        var handleMobileResize = function () {
                            var _a, _b;
                            if (currentPathParams.base === 'passporth5') {
                                if (window.innerHeight < originHeight) {
                                    container.style.top = "calc(50% + ".concat(originHeight - container.getBoundingClientRect().bottom, "px)");
                                }
                                else {
                                    container.style.top = '50%';
                                }
                                (_a = iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.postMessage({
                                    type: 'KEY_BOARD_CHANGE_PASSPORT',
                                    data: container.getBoundingClientRect().top
                                }, '*');
                            }
                            if (currentPathParams.base === 'service') {
                                (_b = iframe.contentWindow) === null || _b === void 0 ? void 0 : _b.postMessage({
                                    type: 'KEY_BOARD_CHANGE_SERVICE',
                                    data: window.innerHeight < originHeight ? container.getBoundingClientRect().bottom : 0
                                }, '*');
                            }
                        };
                        var handleOrientationChange = function () {
                            handleViewportChange();
                        };
                        var handleMessage = function (event) {
                            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
                            console.log('收到来自iframe的消息:', event.data);
                            if (((_a = event.data) === null || _a === void 0 ? void 0 : _a.type) === 'LOADED') {
                                var initParams = _this.getInitParams();
                                if (params.theme) {
                                    initParams.theme = params.theme;
                                }
                                if (params.game_user_id) {
                                    initParams.game_user_id = params.game_user_id;
                                }
                                if (params.protocol) {
                                    initParams.protocol = params.protocol;
                                }
                                (_b = iframe.contentWindow) === null || _b === void 0 ? void 0 : _b.postMessage({
                                    type: 'INIT_PARAMS',
                                    data: initParams
                                }, '*');
                                if (['login'].includes(params.path)) {
                                    (_c = iframe.contentWindow) === null || _c === void 0 ? void 0 : _c.postMessage({
                                        type: 'LOGIN_PARAMS',
                                        data: params.loginParams
                                    }, '*');
                                }
                                else {
                                    (_d = iframe.contentWindow) === null || _d === void 0 ? void 0 : _d.postMessage({
                                        type: 'LOGIN_DATA',
                                        data: config_1.USER_INFO || {}
                                    }, '*');
                                }
                            }
                            if (((_e = event.data) === null || _e === void 0 ? void 0 : _e.type) === 'login_success') {
                                cleanup();
                                resolve(event.data);
                            }
                            if (((_f = event.data) === null || _f === void 0 ? void 0 : _f.type) === 'login_close') {
                                reject(event.data);
                                cleanup();
                            }
                            if (((_g = event.data) === null || _g === void 0 ? void 0 : _g.type) === 'real_name_complete') {
                                (0, apis_1.getInfoApi)()
                                    .then(function (res) {
                                    var _a, _b, _c, _d, _e;
                                    if (res.code === 0) {
                                        config_1.USER_INFO.attr = (_a = res.data) === null || _a === void 0 ? void 0 : _a.attr;
                                        config_1.USER_INFO.age = (_b = res.data) === null || _b === void 0 ? void 0 : _b.age;
                                        config_1.USER_INFO.sex = (_c = res.data) === null || _c === void 0 ? void 0 : _c.sex;
                                        config_1.USER_INFO.ext = __assign(__assign({}, config_1.USER_INFO.ext), { idcard: (_d = res.data) === null || _d === void 0 ? void 0 : _d.idCard, realname: (_e = res.data) === null || _e === void 0 ? void 0 : _e.realName });
                                    }
                                })
                                    .catch(console.error)
                                    .finally(function () {
                                    resolve(event.data);
                                });
                                cleanup();
                            }
                            if (((_h = event.data) === null || _h === void 0 ? void 0 : _h.type) === 'real_name_close') {
                                reject(event.data);
                                cleanup();
                            }
                            if (((_j = event.data) === null || _j === void 0 ? void 0 : _j.type) === 'log_off_complete') {
                                resolve(event.data);
                                cleanup();
                            }
                            if (((_k = event.data) === null || _k === void 0 ? void 0 : _k.type) === 'log_off_close') {
                                reject(event.data);
                                cleanup();
                            }
                            if (((_l = event.data) === null || _l === void 0 ? void 0 : _l.type) === 'close_forget') {
                                reject(event.data);
                                cleanup();
                            }
                            if (((_m = event.data) === null || _m === void 0 ? void 0 : _m.type) === 'close_reset') {
                                reject(event.data);
                                cleanup();
                            }
                            if (((_o = event.data) === null || _o === void 0 ? void 0 : _o.type) === 'reset_password_success') {
                                reject(event.data);
                                cleanup();
                            }
                            if (((_p = event.data) === null || _p === void 0 ? void 0 : _p.type) === 'close_help_center') {
                                cleanup();
                            }
                            if (((_q = event.data) === null || _q === void 0 ? void 0 : _q.type) === 'open_service') {
                                cleanup();
                                _this.openService(__assign({}, event.data.data));
                            }
                            if (((_r = event.data) === null || _r === void 0 ? void 0 : _r.type) === 'close_service') {
                                cleanup();
                            }
                            if (((_s = event.data) === null || _s === void 0 ? void 0 : _s.type) === 'close_agreement') {
                                cleanup();
                            }
                            if (((_t = event.data) === null || _t === void 0 ? void 0 : _t.type) === 'close_service_from_help') {
                                cleanup();
                                _this.openHelpCenter({
                                    theme: _this.theme,
                                    game_user_id: _this.game_user_id
                                });
                            }
                            if (((_u = event.data) === null || _u === void 0 ? void 0 : _u.type) === 'close_pay') {
                                reject(event.data);
                                cleanup();
                            }
                        };
                        window.addEventListener('message', handleMessage);
                        if (_this.isMobile()) {
                            window.addEventListener('orientationchange', handleOrientationChange);
                            window.addEventListener('resize', handleMobileResize);
                        }
                        else {
                            window.addEventListener('resize', handleResize);
                        }
                        iframe.onload = function () { return console.log('iframe加载完成'); };
                        iframe.onerror = function () {
                            reject({
                                code: 1000,
                                msg: 'iframe加载失败'
                            });
                            cleanup();
                        };
                    })];
            });
        });
    };
    SDKUI.prototype.openAgreement = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.createModalIframe({
                        path: "agreement?agreementKey=".concat(params.agreementKey, "&agreementTitle=").concat(params.agreementTitle),
                        backgroundColor: '#fff'
                    })];
            });
        });
    };
    SDKUI.prototype.openProtocol = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.createModalIframe({
                        path: "protocol/protocollist",
                        base: 'helpcenterh5',
                        backgroundColor: '#fff',
                        protocol: params.protocol || {}
                    })];
            });
        });
    };
    SDKUI.prototype.openPay = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.createModalIframe({
                        path: params.hq_type === 'qrcode' && params.pay_type === 'aums' ? "pcPay?url=".concat(encodeURIComponent(params.url)) : "pay?url=".concat(encodeURIComponent(params.url))
                    })];
            });
        });
    };
    SDKUI.prototype.openHelpCenter = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.theme = params.theme || 'light';
                this.game_user_id = params.game_user_id || '';
                return [2 /*return*/, this.createModalIframe({
                        path: 'helpcenter/questioncatalogue-new',
                        base: 'helpcenterh5',
                        backgroundColor: '#fff',
                        theme: params.theme || 'light',
                        game_user_id: params.game_user_id || ''
                    })];
            });
        });
    };
    SDKUI.prototype.openService = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, channelId, productId, cpid, cpof, region_tag, cp_role_id, accesstoken, devicecode, isMobileWechat, searchQuery, queryParams, queryParams;
            return __generator(this, function (_b) {
                this.theme = params.theme || 'light';
                this.game_user_id = params.game_user_id || '';
                _a = this.getInitParams(), channelId = _a.channelId, productId = _a.productId, cpid = _a.cpid, cpof = _a.cpof, region_tag = _a.region_tag, cp_role_id = _a.cp_role_id, accesstoken = _a.accesstoken, devicecode = _a.devicecode, isMobileWechat = _a.isMobileWechat;
                searchQuery = __assign({ devicecode: devicecode, minimized: 0, region_tag: region_tag || '', theme: params.theme || 'light', game_user_id: cp_role_id || params.game_user_id || '', 'ruixue-language': params.default_lang || 'zh', 'ruixue-accesstoken': accesstoken || '', 'ruixue-cpid': cpid || '', 'ruixue-productid': productId || '', 'ruixue-channelid': channelId || '', 'ruixue-region': region_tag || '', 'ruixue-cp-role-id': cp_role_id || '' }, (cpof ? { cpof: '1' } : {}));
                searchQuery.from_application = params.from_application || 'sdkh5';
                if (isMobileWechat) {
                    searchQuery.from_application = params.from_application || 'sdkh5';
                    queryParams = new URLSearchParams(searchQuery);
                    return [2 /*return*/, this.createModalIframe({
                            path: "?".concat(queryParams.toString()),
                            base: 'service',
                            backgroundColor: '#fff',
                            theme: params.theme || 'light',
                            game_user_id: cp_role_id || params.game_user_id || ''
                        })];
                }
                else {
                    searchQuery.from_application = 'browser';
                    queryParams = new URLSearchParams(searchQuery);
                    window.open(this.getIframeSrc({
                        path: "?".concat(queryParams.toString()),
                        base: 'service'
                    }));
                }
                return [2 /*return*/];
            });
        });
    };
    SDKUI.prototype.h5Login = function (loginParams) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.createModalIframe({
                        path: 'login',
                        loginParams: loginParams
                    })];
            });
        });
    };
    SDKUI.prototype.realName = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.createModalIframe({
                        path: 'realname?form_application=sdkh5'
                    }).then(function (res) {
                        callback && callback.complete(res);
                    }).catch(function (err) {
                        callback && callback.complete(err);
                    })];
            });
        });
    };
    SDKUI.prototype.forgetPassword = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.createModalIframe({
                        path: 'forget?from_application=sdkh5'
                    }).then(function (res) {
                        callback && callback.complete(res);
                    }).catch(function (err) {
                        callback && callback.complete(err);
                    })];
            });
        });
    };
    SDKUI.prototype.resetPassword = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.createModalIframe({
                        path: 'reset?from_application=sdkh5'
                    }).then(function (res) {
                        callback && callback.complete(res);
                    }).catch(function (err) {
                        callback && callback.complete(err);
                    })];
            });
        });
    };
    SDKUI.prototype.logoffH5Preview = function (callback) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var res, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apis_1.getInfoApi)()];
                    case 1:
                        res = _b.sent();
                        if ((((_a = res.data) === null || _a === void 0 ? void 0 : _a.user_state) & 1) === 1) {
                            this.createModalIframe({
                                path: 'user/unregistercondition?flag=1&type=logoff&isPreview=true',
                                base: 'passport',
                                backgroundColor: '#fff'
                            }).then(function (res) {
                                callback && callback.complete(res);
                            }).catch(function (err) {
                                callback && callback.complete(err);
                            });
                            return [2 /*return*/];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _b.sent();
                        console.log(error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/, this.createModalIframe({
                            path: 'user/unregistercondition?type=logoff&isPreview=true',
                            base: 'passport',
                            backgroundColor: '#fff'
                        }).then(function (res) {
                            callback && callback.complete(res);
                        }).catch(function (err) {
                            callback && callback.complete(err);
                        })];
                }
            });
        });
    };
    SDKUI.prototype.logoff = function (callback) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var res, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apis_1.getInfoApi)()];
                    case 1:
                        res = _b.sent();
                        if ((((_a = res.data) === null || _a === void 0 ? void 0 : _a.user_state) & 1) === 1) {
                            this.createModalIframe({
                                path: 'logoff?flag=1',
                                backgroundColor: '#fff'
                            }).then(function (res) {
                                callback && callback.complete(res);
                            }).catch(function (err) {
                                callback && callback.complete(err);
                            });
                            return [2 /*return*/];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _b.sent();
                        console.log(error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/, this.createModalIframe({
                            path: 'logoff',
                            backgroundColor: '#fff'
                        }).then(function (res) {
                            callback && callback.complete(res);
                        }).catch(function (err) {
                            callback && callback.complete(err);
                        })];
                }
            });
        });
    };
    return SDKUI;
}(SdkCommon_1.default));
exports.default = SDKUI;
//# sourceMappingURL=SDKUI.js.map