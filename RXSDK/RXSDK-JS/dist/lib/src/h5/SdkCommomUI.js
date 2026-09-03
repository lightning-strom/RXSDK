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
var apis_1 = require("./apis");
var utils_1 = require("@/utils/utils");
var config_1 = require("@/config");
var paramsValid_1 = require("@/utils/paramsValid");
var checkConfig_1 = require("@/utils/checkConfig");
var social_1 = require("@/utils/checkConfig/social");
var utils_2 = require("@/h5/utils");
var v4_1 = require("uuid/v4");
var day_1 = require("@/utils/day");
var SdkCommonUI = /** @class */ (function () {
    function SdkCommonUI(platform) {
        this.initConfig = {};
        this.orientation = window.orientation;
        this.game_user_id = '';
        this.theme = 'light';
        this.platform = platform;
    }
    SdkCommonUI.prototype.getDeviceCode = function () {
        return (0, utils_2.getDevicecode)();
    };
    /**
     * 检测是否是微信浏览器
     */
    SdkCommonUI.prototype.isWeChatBrowser = function () {
        return /MicroMessenger/i.test(navigator.userAgent);
    };
    SdkCommonUI.prototype.isMobileWechat = function () {
        var isWeixin = this.isWeChatBrowser();
        var isMobile = this.isMobile();
        return isWeixin && isMobile;
    };
    SdkCommonUI.prototype.isMobile = function () {
        return typeof window.orientation !== 'undefined' || 'ontouchstart' in window;
    };
    // 检测横竖屏并显示提示
    SdkCommonUI.prototype.checkOrientation = function () {
        // 小于这个值认为是竖屏
        var portraitRatio = 0.75;
        // 获取当前窗口的宽高比
        var ratio = window.innerWidth / window.innerHeight;
        return ratio < portraitRatio;
    };
    SdkCommonUI.prototype.getIframeSrc = function (_a) {
        var path = _a.path, base = _a.base;
        // // 本地测试
        // if(base == 'pay') {
        //   return `http://10.10.3.156:666/static/${base}/${path}`
        // } else {
        //   return `${SYSTEM_INFO.baseUrlList[0]}/static/${base}#/${path}`
        // }
        return "".concat(config_1.SYSTEM_INFO.baseUrlList[0], "/static/").concat(base, "#/").concat(path);
    };
    SdkCommonUI.prototype.getInitParams = function () {
        var token = config_1.USER_INFO.token;
        var timezone = config_1.SYSTEM_INFO.timezone, channelId = config_1.SYSTEM_INFO.channelId, productId = config_1.SYSTEM_INFO.productId, cpid = config_1.SYSTEM_INFO.cpid, version = config_1.SYSTEM_INFO.__RX_SDK_VERSION, baseUrlList = config_1.SYSTEM_INFO.baseUrlList, cpof = config_1.SYSTEM_INFO.CP_OF, region_tag = config_1.SYSTEM_INFO.region_tag, cp_role_id = config_1.SYSTEM_INFO.cp_role_id, language = config_1.SYSTEM_INFO.language;
        return __assign(__assign(__assign(__assign({ width: window.innerWidth, height: window.innerHeight, isWechat: this.isWeChatBrowser(), isMobile: this.isMobile(), isMobileWechat: this.isMobileWechat(), isVertical: this.checkOrientation(), orientation: this.orientation, initConfig: this.initConfig, devicecode: (0, utils_2.getDevicecode)(), timezone: timezone, channelId: channelId, productId: productId, cpid: cpid, version: version, baseUrlList: baseUrlList, cpof: cpof, language: language || 'zh' }, (region_tag && { region_tag: "".concat(region_tag) })), (cp_role_id && { cp_role_id: "".concat(cp_role_id) })), ((token === null || token === void 0 ? void 0 : token.access) && { accesstoken: token.access })), { loginData: config_1.USER_INFO });
    };
    SdkCommonUI.prototype.createModalIframe = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        // 常量定义
                        var CONTAINER_ID = 'sdk-container'; // 容器元素ID
                        var IFRAME_ID = 'dynamic-iframe'; // iframe元素ID
                        var IFRAME_NAME = 'dynamicFrame'; // iframe名称
                        // 获取目标容器元素
                        var container = document.getElementById(CONTAINER_ID);
                        if (!container) {
                            reject(new Error('未找到sdk-container元素'));
                            return;
                        }
                        // 保存原始body样式以便后续恢复
                        var originalBodyStyle = {
                            overflow: document.body.style.overflow,
                            position: document.body.style.position,
                            width: document.body.style.width,
                            height: document.body.style.height
                        };
                        // 禁止body滚动
                        document.body.style.overflow = 'hidden';
                        // 设置容器样式 - 固定定位、居中显示
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
                        // 创建iframe元素
                        var iframe = document.createElement('iframe');
                        // 保存当前路径参数以便重载
                        var currentPathParams = {
                            path: params.path,
                            base: params.base || 'passporth5'
                        };
                        // 初始化iframe
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
                        // 重载iframe
                        var reloadIframe = function () {
                            if (container.contains(iframe)) {
                                container.removeChild(iframe);
                            }
                            iframe = document.createElement('iframe');
                            initIframe();
                        };
                        initIframe();
                        // 清理函数 - 移除事件监听、iframe和恢复样式
                        var cleanup = function () {
                            window.removeEventListener('message', handleMessage);
                            window.removeEventListener('resize', handleResize);
                            window.removeEventListener('resize', handleMobileResize);
                            // 移除移动端方向变化监听
                            if (typeof window.orientation !== 'undefined') {
                                window.removeEventListener('orientationchange', handleOrientationChange);
                            }
                            if (container.contains(iframe)) {
                                container.removeChild(iframe);
                            }
                            container.style.cssText = '';
                            // 恢复body原始样式
                            Object.assign(document.body.style, originalBodyStyle);
                        };
                        // 防抖函数
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
                        // 处理屏幕方向/尺寸变化
                        var handleViewportChange = debounce(function () {
                            originHeight = window.innerHeight;
                            updateContainerStyle();
                            reloadIframe();
                        }, 200);
                        // PC端窗口大小变化处理
                        var handleResize = function () {
                            handleViewportChange();
                        };
                        var originHeight = window.innerHeight;
                        // 移动端窗口大小变化处理
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
                        // 移动端方向变化处理
                        var handleOrientationChange = function () {
                            handleViewportChange();
                        };
                        // 消息处理器 - 处理来自iframe的各种消息
                        var handleMessage = function (event) {
                            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
                            console.log('收到来自iframe的消息:', event.data);
                            // 处理iframe加载完成消息
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
                                // 发送初始化参数
                                (_b = iframe.contentWindow) === null || _b === void 0 ? void 0 : _b.postMessage({
                                    type: 'INIT_PARAMS',
                                    data: initParams
                                }, '*');
                                // 根据路径发送不同参数
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
                            // 处理登录成功消息
                            if (((_e = event.data) === null || _e === void 0 ? void 0 : _e.type) === 'login_success') {
                                cleanup();
                                resolve(event.data);
                            }
                            // 处理登录关闭消息
                            if (((_f = event.data) === null || _f === void 0 ? void 0 : _f.type) === 'login_close') {
                                reject(event.data);
                                cleanup();
                            }
                            // 处理实名认证完成消息
                            if (((_g = event.data) === null || _g === void 0 ? void 0 : _g.type) === 'real_name_complete') {
                                (0, apis_1.getInfoApi)()
                                    .then(function (res) {
                                    var _a, _b, _c, _d, _e;
                                    if (res.code === 0) {
                                        // 更新用户信息
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
                            // 处理实名认证关闭消息
                            if (((_h = event.data) === null || _h === void 0 ? void 0 : _h.type) === 'real_name_close') {
                                reject(event.data);
                                cleanup();
                            }
                            // 处理注销完成消息
                            if (((_j = event.data) === null || _j === void 0 ? void 0 : _j.type) === 'log_off_complete') {
                                resolve(event.data);
                                cleanup();
                            }
                            // 处理注销关闭消息
                            if (((_k = event.data) === null || _k === void 0 ? void 0 : _k.type) === 'log_off_close') {
                                reject(event.data);
                                cleanup();
                            }
                            // 处理忘记密码关闭消息
                            if (((_l = event.data) === null || _l === void 0 ? void 0 : _l.type) === 'close_forget') {
                                reject(event.data);
                                cleanup();
                            }
                            // 处理修改密码关闭消息
                            if (((_m = event.data) === null || _m === void 0 ? void 0 : _m.type) === 'close_reset') {
                                reject(event.data);
                                cleanup();
                            }
                            // 处理重置密码成功消息
                            if (((_o = event.data) === null || _o === void 0 ? void 0 : _o.type) === 'reset_password_success') {
                                reject(event.data);
                                cleanup();
                            }
                            // 处理帮助中心关闭消息
                            if (((_p = event.data) === null || _p === void 0 ? void 0 : _p.type) === 'close_help_center') {
                                cleanup();
                            }
                            // 处理跳转客服中心消息
                            if (((_q = event.data) === null || _q === void 0 ? void 0 : _q.type) === 'open_service') {
                                cleanup();
                                _this.openService(__assign({}, event.data.data));
                            }
                            // 处理客服中心关闭消息
                            if (((_r = event.data) === null || _r === void 0 ? void 0 : _r.type) === 'close_service') {
                                cleanup();
                            }
                            // 处理协议弹窗关闭消息
                            if (((_s = event.data) === null || _s === void 0 ? void 0 : _s.type) === 'close_agreement') {
                                cleanup();
                            }
                            // 处理返回帮助中心消息
                            if (((_t = event.data) === null || _t === void 0 ? void 0 : _t.type) === 'close_service_from_help') {
                                cleanup();
                                _this.openHelpCenter({
                                    theme: _this.theme,
                                    game_user_id: _this.game_user_id
                                });
                            }
                            // 处理取消支付消息
                            if (((_u = event.data) === null || _u === void 0 ? void 0 : _u.type) === 'close_pay') {
                                reject(event.data);
                                cleanup();
                            }
                        };
                        // 添加事件监听
                        window.addEventListener('message', handleMessage);
                        // 根据设备类型添加不同的事件监听
                        if (_this.isMobile()) {
                            // 移动设备 - 监听方向变化
                            window.addEventListener('orientationchange', handleOrientationChange);
                            window.addEventListener('resize', handleMobileResize);
                        }
                        else {
                            // PC设备 - 监听窗口大小变化
                            window.addEventListener('resize', handleResize);
                        }
                        // iframe加载完成回调
                        iframe.onload = function () { return console.log('iframe加载完成'); };
                        // iframe加载错误处理
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
    SdkCommonUI.prototype.openAgreement = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.createModalIframe({
                        path: "agreement?agreementKey=".concat(params.agreementKey, "&agreementTitle=").concat(params.agreementTitle),
                        backgroundColor: '#fff'
                    })];
            });
        });
    };
    SdkCommonUI.prototype.openProtocol = function (params) {
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
    SdkCommonUI.prototype.openPay = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.createModalIframe({
                        path: params.hq_type === 'qrcode' && params.pay_type === 'aums' ? "pcPay?url=".concat(encodeURIComponent(params.url)) : "pay?url=".concat(encodeURIComponent(params.url))
                    })];
            });
        });
    };
    SdkCommonUI.prototype.openHelpCenter = function (params) {
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
    SdkCommonUI.prototype.openService = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, channelId, productId, cpid, cpof, region_tag, cp_role_id, accesstoken, devicecode, isMobileWechat, searchQuery, queryParams, queryParams;
            return __generator(this, function (_b) {
                this.theme = params.theme || 'light';
                this.game_user_id = params.game_user_id || '';
                _a = this.getInitParams(), channelId = _a.channelId, productId = _a.productId, cpid = _a.cpid, cpof = _a.cpof, region_tag = _a.region_tag, cp_role_id = _a.cp_role_id, accesstoken = _a.accesstoken, devicecode = _a.devicecode, isMobileWechat = _a.isMobileWechat;
                searchQuery = __assign({ devicecode: devicecode, minimized: 0, region_tag: region_tag || '', theme: params.theme || 'light', game_user_id: cp_role_id || params.game_user_id || '', 'ruixue-language': params.default_lang || 'zh', 'ruixue-accesstoken': accesstoken || '', 'ruixue-cpid': cpid || '', 'ruixue-productid': productId || '', 'ruixue-channelid': channelId || '', 'ruixue-region': region_tag || '', 'ruixue-cp-role-id': cp_role_id || '' }, (cpof ? { cpof: '1' } : {}));
                searchQuery.from_application = params.from_application || 'sdkh5';
                /*const queryParams = new URLSearchParams(searchQuery)
                return this.createModalIframe({
                  path: `?${queryParams.toString()}`,
                  base: 'service',
                  backgroundColor: '#fff',
                  theme: params.theme || 'light',
                  game_user_id: cp_role_id || params.game_user_id || ''
                })*/
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
    SdkCommonUI.prototype.h5Login = function (loginParams) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.createModalIframe({
                        path: 'login',
                        loginParams: loginParams
                    })];
            });
        });
    };
    SdkCommonUI.prototype.realName = function (callback) {
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
    SdkCommonUI.prototype.forgetPassword = function (callback) {
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
    SdkCommonUI.prototype.resetPassword = function (callback) {
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
    SdkCommonUI.prototype.logoffH5Preview = function (callback) {
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
    SdkCommonUI.prototype.logoff = function (callback) {
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
    // 用户管理
    SdkCommonUI.prototype.setcustom = function (params, _a) {
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            var result, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(social_1.setcustomCheck, { complete: complete }, params)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, (0, apis_1.setcustomApi)({ custom: params.custom })];
                    case 2:
                        result = _b.sent();
                        console.log(result);
                        complete(result);
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _b.sent();
                        complete((0, utils_2.handleTrackError)(this.platform, '', err_1));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // 添加自定义关系
    SdkCommonUI.prototype.addRelation = function (params, _a) {
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            var result, err_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(social_1.addRelationCheck, { complete: complete }, params)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, (0, apis_1.addRelationApi)(params)];
                    case 2:
                        result = _b.sent();
                        complete(result);
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _b.sent();
                        complete((0, utils_2.handleTrackError)(this.platform, '', err_2));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // 删除自定义关系
    SdkCommonUI.prototype.deleteRelation = function (params, _a) {
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            var result, err_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(social_1.deleteRelationCheck, { complete: complete }, params)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, (0, apis_1.deleteRelationApi)(params)];
                    case 2:
                        result = _b.sent();
                        complete(result);
                        return [3 /*break*/, 4];
                    case 3:
                        err_3 = _b.sent();
                        complete((0, utils_2.handleTrackError)(this.platform, '', err_3));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // 更新自定关系备注
    SdkCommonUI.prototype.updateremarks = function (params, _a) {
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            var result, err_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(social_1.updateremarksCheck, { complete: complete }, params)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, (0, apis_1.updateremarksApi)(params)];
                    case 2:
                        result = _b.sent();
                        complete(result);
                        return [3 /*break*/, 4];
                    case 3:
                        err_4 = _b.sent();
                        complete((0, utils_2.handleTrackError)(this.platform, '', err_4));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // 判断两用户是否存在某自定关系
    SdkCommonUI.prototype.hasRelation = function (params, _a) {
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            var result, err_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(social_1.hasRelationCheck, { complete: complete }, params)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, (0, apis_1.hasrelationApi)(params)];
                    case 2:
                        result = _b.sent();
                        complete(result);
                        return [3 /*break*/, 4];
                    case 3:
                        err_5 = _b.sent();
                        complete((0, utils_2.handleTrackError)(this.platform, '', err_5));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // 获取自定关系列表
    SdkCommonUI.prototype.relationList = function (params, _a) {
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            var result, err_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(social_1.relationListCheck, { complete: complete }, params)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, (0, apis_1.relationListApi)({ type: params.type })];
                    case 2:
                        result = _b.sent();
                        complete(result);
                        return [3 /*break*/, 4];
                    case 3:
                        err_6 = _b.sent();
                        complete((0, utils_2.handleTrackError)(this.platform, '', err_6));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // 添加好友关系
    SdkCommonUI.prototype.addFriend = function (params, _a) {
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            var result, err_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(social_1.addFriendCheck, { complete: complete }, params)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, (0, apis_1.addfriendApi)(params)];
                    case 2:
                        result = _b.sent();
                        complete(result);
                        return [3 /*break*/, 4];
                    case 3:
                        err_7 = _b.sent();
                        complete((0, utils_2.handleTrackError)(this.platform, '', err_7));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // 删除好友关系
    SdkCommonUI.prototype.delfriend = function (params, _a) {
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            var result, err_8;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(social_1.delfriendCheck, { complete: complete }, params)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, (0, apis_1.delfriendApi)(params)];
                    case 2:
                        result = _b.sent();
                        complete(result);
                        return [3 /*break*/, 4];
                    case 3:
                        err_8 = _b.sent();
                        complete((0, utils_2.handleTrackError)(this.platform, '', err_8));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // 更新好友备注
    SdkCommonUI.prototype.updatefriendremarks = function (params, _a) {
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            var result, err_9;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(social_1.updatefriendremarksCheck, { complete: complete }, params)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, (0, apis_1.updatefriendremarksApi)(params)];
                    case 2:
                        result = _b.sent();
                        complete(result);
                        return [3 /*break*/, 4];
                    case 3:
                        err_9 = _b.sent();
                        complete((0, utils_2.handleTrackError)(this.platform, '', err_9));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // 判断两用户是否为好友
    SdkCommonUI.prototype.isfriend = function (params, _a) {
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            var result, err_10;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(social_1.delfriendCheck, { complete: complete }, params)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, (0, apis_1.isfriendApi)(params)];
                    case 2:
                        result = _b.sent();
                        complete(result);
                        return [3 /*break*/, 4];
                    case 3:
                        err_10 = _b.sent();
                        complete((0, utils_2.handleTrackError)(this.platform, '', err_10));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // 获取好友关系列表
    SdkCommonUI.prototype.friends = function (_a) {
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            var result, err_11;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apis_1.friendsApi)()];
                    case 1:
                        result = _b.sent();
                        complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        err_11 = _b.sent();
                        complete((0, utils_2.handleTrackError)(this.platform, '', err_11));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 排行榜相关接口
     */
    // 增加用户分数
    SdkCommonUI.prototype.addscore = function (params, _a) {
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            var result, err_12;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(social_1.addscoreCheck, { complete: complete }, params)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, (0, apis_1.addscoreApi)(params)];
                    case 2:
                        result = _b.sent();
                        complete(result);
                        return [3 /*break*/, 4];
                    case 3:
                        err_12 = _b.sent();
                        complete((0, utils_2.handleTrackError)(this.platform, '', err_12));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // 设置用户分数
    SdkCommonUI.prototype.setscore = function (params, _a) {
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            var result, err_13;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(social_1.addscoreCheck, { complete: complete }, params)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, (0, apis_1.setscoreApi)(params)];
                    case 2:
                        result = _b.sent();
                        complete(result);
                        return [3 /*break*/, 4];
                    case 3:
                        err_13 = _b.sent();
                        complete((0, utils_2.handleTrackError)(this.platform, '', err_13));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // 查询用户分数
    SdkCommonUI.prototype.queryuserrank = function (params, _a) {
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            var result, err_14;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(social_1.queryuserrankCheck, { complete: complete }, params)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, (0, apis_1.queryuserrankApi)(params)];
                    case 2:
                        result = _b.sent();
                        complete(result);
                        return [3 /*break*/, 4];
                    case 3:
                        err_14 = _b.sent();
                        complete((0, utils_2.handleTrackError)(this.platform, '', err_14));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // 获取排行榜列表
    SdkCommonUI.prototype.getranklist = function (params, _a) {
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            var result, err_15;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(social_1.getranklimitlistCheck, { complete: complete }, params)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, (0, apis_1.getranklistApi)(params)];
                    case 2:
                        result = _b.sent();
                        complete(result);
                        return [3 /*break*/, 4];
                    case 3:
                        err_15 = _b.sent();
                        complete((0, utils_2.handleTrackError)(this.platform, '', err_15));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // 获取好友排行榜列表
    SdkCommonUI.prototype.friendsrank = function (params, _a) {
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            var result, err_16;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(social_1.getranklistCheck, { complete: complete }, params)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, (0, apis_1.friendsrankApi)(params)];
                    case 2:
                        result = _b.sent();
                        complete(result);
                        return [3 /*break*/, 4];
                    case 3:
                        err_16 = _b.sent();
                        complete((0, utils_2.handleTrackError)(this.platform, '', err_16));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 帮助中心
     */
    SdkCommonUI.prototype.getHelpcenterMainLayout = function (_a) {
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            var result, err_17;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apis_1.getMainlayoutApi)()];
                    case 1:
                        result = _b.sent();
                        complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        err_17 = _b.sent();
                        complete((0, utils_2.handleTrackError)(this.platform, '', err_17));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SdkCommonUI.prototype.getHelpcenterQuestionLayout = function (params, _a) {
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            var result, err_18;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apis_1.getListlayoutApi)(params)];
                    case 1:
                        result = _b.sent();
                        complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        err_18 = _b.sent();
                        complete((0, utils_2.handleTrackError)(this.platform, '', err_18));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SdkCommonUI.prototype.getHelpcenterInfoLayout = function (params, _a) {
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            var result, err_19;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apis_1.getInfolayoutApi)(params)];
                    case 1:
                        result = _b.sent();
                        complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        err_19 = _b.sent();
                        complete((0, utils_2.handleTrackError)(this.platform, '', err_19));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SdkCommonUI.prototype.helpcenterResolution = function (params, _a) {
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            var result, err_20;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apis_1.postResolutionApi)(params)];
                    case 1:
                        result = _b.sent();
                        complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        err_20 = _b.sent();
                        complete((0, utils_2.handleTrackError)(this.platform, '', err_20));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 玩家意见反馈
     */
    SdkCommonUI.prototype.addFeedback = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var res, err_21;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apis_1.createFeedbackApi)(params)];
                    case 1:
                        res = _a.sent();
                        console.log(res);
                        callback && callback.complete(res);
                        return [3 /*break*/, 3];
                    case 2:
                        err_21 = _a.sent();
                        callback && callback.complete((0, utils_2.handleTrackError)(this.platform, '', err_21));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SdkCommonUI.prototype.getFeedbackList = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var res, err_22;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apis_1.getFeedbackListApi)(params)];
                    case 1:
                        res = _a.sent();
                        console.log(res);
                        callback && callback.complete(res);
                        return [3 /*break*/, 3];
                    case 2:
                        err_22 = _a.sent();
                        callback && callback.complete((0, utils_2.handleTrackError)(this.platform, '', err_22));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SdkCommonUI.prototype.getFeedbackDetail = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var res, err_23;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apis_1.getFeedbackDetailApi)(params)];
                    case 1:
                        res = _a.sent();
                        console.log(res);
                        callback && callback.complete(res);
                        return [3 /*break*/, 3];
                    case 2:
                        err_23 = _a.sent();
                        callback && callback.complete((0, utils_2.handleTrackError)(this.platform, '', err_23));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 领取道具
    SdkCommonUI.prototype.collectProps = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var res, err_24;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apis_1.collectPropsApi)(params)];
                    case 1:
                        res = _a.sent();
                        console.log(res);
                        callback && callback.complete(res);
                        return [3 /*break*/, 3];
                    case 2:
                        err_24 = _a.sent();
                        callback && callback.complete((0, utils_2.handleTrackError)(this.platform, '', err_24));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 获取公告列表
    SdkCommonUI.prototype.getAnnouncement = function (limit, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var productId, channelId, res, err_25;
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
                        return [4 /*yield*/, (0, apis_1.getNoticeApi)({
                                limit: limit,
                                product_id: productId,
                                channel_id: channelId
                            })];
                    case 2:
                        res = _a.sent();
                        console.log(res);
                        return [3 /*break*/, 4];
                    case 3:
                        err_25 = _a.sent();
                        callback && callback.complete((0, utils_2.handleTrackError)(this.platform, '', err_25));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 用于设置自定义返回错误 Msg
     */
    SdkCommonUI.prototype.setErrorMsg = function (errMsg) {
        config_1.SYSTEM_INFO.errMsg = errMsg;
    };
    /**
     * 清空返回错误 Msg
     */
    SdkCommonUI.prototype.clearErrorMsg = function () {
        config_1.SYSTEM_INFO.errMsg = {
            default: ''
        };
    };
    // 发送验证码
    SdkCommonUI.prototype.sendCaptcha = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apis_1.sendCaptcha)(params)];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        callback.complete((0, utils_2.handleTrackError)(this.platform, '', error_3));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 绑定手机
    SdkCommonUI.prototype.bindPhone = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apis_1.bindPhone)(params)];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        callback.complete((0, utils_2.handleTrackError)(this.platform, '', error_4));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 解绑手机
    SdkCommonUI.prototype.unBindPhone = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apis_1.unBindPhone)(params)];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        callback.complete((0, utils_2.handleTrackError)(this.platform, '', error_5));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 绑定邮箱
    SdkCommonUI.prototype.bindEmail = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apis_1.bindEmail)(params)];
                    case 1:
                        data = _a.sent();
                        callback.complete(data);
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _a.sent();
                        callback.complete((0, utils_2.handleTrackError)(this.platform, '', error_6));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 解绑邮箱
    SdkCommonUI.prototype.UnbindEmail = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apis_1.UnbindEmail)(params)];
                    case 1:
                        data = _a.sent();
                        callback.complete(data);
                        return [3 /*break*/, 3];
                    case 2:
                        error_7 = _a.sent();
                        callback.complete((0, utils_2.handleTrackError)(this.platform, '', error_7));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 注销账号
    SdkCommonUI.prototype.deregister = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apis_1.deregister)(params)];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_8 = _a.sent();
                        callback.complete((0, utils_2.handleTrackError)(this.platform, '', error_8));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 撤销账号注销申请
    SdkCommonUI.prototype.deregisterCancel = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apis_1.deregisterCancel)()];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_9 = _a.sent();
                        callback.complete((0, utils_2.handleTrackError)(this.platform, '', error_9));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 获得用户信息
    SdkCommonUI.prototype.getInfo = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apis_1.getInfoApi)()];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_10 = _a.sent();
                        callback.complete((0, utils_2.handleTrackError)(this.platform, '', error_10));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 获取指定用户信息
    SdkCommonUI.prototype.getUserInfoByField = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apis_1.getUserInfoByFieldApi)(params)];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_11 = _a.sent();
                        callback.complete((0, utils_2.handleTrackError)(this.platform, '', error_11));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 修改瑞雪通行证用户信息。
    SdkCommonUI.prototype.updateInfo = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apis_1.updateInfoApi)(params)];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_12 = _a.sent();
                        callback.complete((0, utils_2.handleTrackError)(this.platform, '', error_12));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 游戏大厅版本检查-get
    SdkCommonUI.prototype.checkAppVersion = function (params, callback) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var req, result, data, region_tag, error_13;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(checkConfig_1.checkAppVersionParams, callback, params)];
                    case 1:
                        _c.sent();
                        req = __assign(__assign({}, params), { productid: config_1.SYSTEM_INFO.productId, channelid: config_1.SYSTEM_INFO.channelId, type: (params === null || params === void 0 ? void 0 : params.type) || 'js', format: (params === null || params === void 0 ? void 0 : params.format) || 'json', region: (params === null || params === void 0 ? void 0 : params.region) || 0 });
                        return [4 /*yield*/, (0, apis_1.checkVersionGameLobbyByGet)(req)];
                    case 2:
                        result = _c.sent();
                        try {
                            if (result.code === 0) {
                                data = JSON.parse(result.data);
                                region_tag = (_b = (_a = data.login_config) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.region_tag;
                                if (region_tag) {
                                    config_1.SYSTEM_INFO.region_tag = region_tag;
                                }
                            }
                        }
                        catch (e) {
                        }
                        callback.complete(result);
                        return [3 /*break*/, 4];
                    case 3:
                        error_13 = _c.sent();
                        callback.complete((0, utils_2.handleTrackError)(this.platform, '', error_13));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // 游戏大厅版本检查-post
    SdkCommonUI.prototype.checkVersion = function (params, callback) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var req, result, data, region_tag, error_14;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(checkConfig_1.checkAppVersionParams, callback, params)];
                    case 1:
                        _c.sent();
                        req = __assign(__assign({}, params), { productid: config_1.SYSTEM_INFO.productId, channelid: config_1.SYSTEM_INFO.channelId, type: (params === null || params === void 0 ? void 0 : params.type) || 'js', format: (params === null || params === void 0 ? void 0 : params.format) || 'json', region: (params === null || params === void 0 ? void 0 : params.region) || 0 });
                        return [4 /*yield*/, (0, apis_1.checkVersionGameLobbyByPost)(req)];
                    case 2:
                        result = _c.sent();
                        try {
                            if (result.code === 0) {
                                data = JSON.parse(result.data);
                                region_tag = (_b = (_a = data.login_config) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.region_tag;
                                if (region_tag) {
                                    config_1.SYSTEM_INFO.region_tag = region_tag;
                                }
                            }
                        }
                        catch (e) {
                        }
                        callback.complete(result);
                        return [3 /*break*/, 4];
                    case 3:
                        error_14 = _c.sent();
                        callback.complete((0, utils_2.handleTrackError)(this.platform, '', error_14));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // 游戏版本检查
    SdkCommonUI.prototype.checkGameVersion = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var req, result, error_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(checkConfig_1.checkGameVersionParams, callback, params)];
                    case 1:
                        _a.sent();
                        req = __assign(__assign({}, params), { gamecheckversion: (params === null || params === void 0 ? void 0 : params.gamecheckversion) || 0, type: (params === null || params === void 0 ? void 0 : params.type) || 'lua', format: (params === null || params === void 0 ? void 0 : params.format) || 'lua' });
                        return [4 /*yield*/, (0, apis_1.checkGameVersion)(req)];
                    case 2:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 4];
                    case 3:
                        error_15 = _a.sent();
                        callback.complete((0, utils_2.handleTrackError)(this.platform, '', error_15));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // 活动版本检查
    SdkCommonUI.prototype.checkActivityVersion = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var req, result, error_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(checkConfig_1.checkActivityVersionParams, callback, params)];
                    case 1:
                        _a.sent();
                        req = __assign(__assign({}, params), { activitycheckversion: (params === null || params === void 0 ? void 0 : params.activitycheckversion) || 0, type: (params === null || params === void 0 ? void 0 : params.type) || 'lua', format: (params === null || params === void 0 ? void 0 : params.format) || 'lua' });
                        return [4 /*yield*/, (0, apis_1.checkActivityVersion)(req)];
                    case 2:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 4];
                    case 3:
                        error_16 = _a.sent();
                        callback.complete((0, utils_2.handleTrackError)(this.platform, '', error_16));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SdkCommonUI.prototype.calculateValueSizeWithEncoding = function (key) {
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
    SdkCommonUI.prototype.track = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var p1, p2, getDevicecode_1, devicecode, type, time, uuids, platform_id, copyCpid, product_id, channel_id, cpid, publicProps, new_properties, reqarr, useCache, size, rx_track_queue, result, err_26;
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
                        platform_id = 4;
                        copyCpid = config_1.SYSTEM_INFO.cpid, product_id = config_1.SYSTEM_INFO.productId, channel_id = config_1.SYSTEM_INFO.channelId;
                        cpid = Number(copyCpid);
                        publicProps = (0, utils_2.customGetStorageSync)('rx_public_props');
                        new_properties = {};
                        if (config_1.SYSTEM_INFO.region_tag) {
                            new_properties.rx_region_tag = "".concat(config_1.SYSTEM_INFO.region_tag);
                        }
                        if (config_1.SYSTEM_INFO.cp_role_id) {
                            new_properties['#role_id'] = "".concat(config_1.SYSTEM_INFO.cp_role_id);
                        }
                        if (config_1.SYSTEM_INFO.third_channel_code) {
                            new_properties.third_channel = "".concat(config_1.SYSTEM_INFO.third_channel_code);
                        }
                        reqarr = [
                            __assign({ type: type, time: time, uuid: uuids, distinct_id: config_1.USER_INFO === null || config_1.USER_INFO === void 0 ? void 0 : config_1.USER_INFO.openid, sub_channel_id: config_1.USER_INFO === null || config_1.USER_INFO === void 0 ? void 0 : config_1.USER_INFO.subchannelid, platform_id: platform_id, product_id: product_id, cpid: cpid, channel_id: channel_id, devicecode: devicecode }, __assign(__assign({}, p1), { properties: __assign(__assign(__assign({}, new_properties), p1.properties), publicProps) }))
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
                        err_26 = _a.sent();
                        p2.complete((0, utils_1.handleError)(err_26));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SdkCommonUI.prototype.multipleTrack = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rx_track_queue, err_27;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        rx_track_queue = (0, utils_2.customGetStorageSync)('rx_track_queue') || [];
                        if (!rx_track_queue.length) return [3 /*break*/, 2];
                        console.log('批量补上报大数据');
                        return [4 /*yield*/, (0, apis_1.trackApi)(rx_track_queue)];
                    case 1:
                        _a.sent();
                        (0, utils_2.removeStorageSync)('rx_track_queue');
                        _a.label = 2;
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        err_27 = _a.sent();
                        console.log(err_27);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // 获取商业化接口
    SdkCommonUI.prototype.getOperationScene = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            var res, err_28;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apis_1.getOperationSceneApi)()];
                    case 1:
                        res = _a.sent();
                        callback && callback.complete(res);
                        return [3 /*break*/, 3];
                    case 2:
                        err_28 = _a.sent();
                        callback && callback.complete((0, utils_2.handleTrackError)(this.platform, '', err_28));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 商业化上报接口
    SdkCommonUI.prototype.reportWindowExposure = function (properties, callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.track({
                    complete: function (data) {
                        callback && callback.complete(data);
                    }
                }, {
                    event: '#window_exposure',
                    properties: properties
                });
                return [2 /*return*/];
            });
        });
    };
    // 游戏区服信息查询
    SdkCommonUI.prototype.getGameArea = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apis_1.getGameAreaApi)(params.area_id)];
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
    // 游戏区服信息修改
    SdkCommonUI.prototype.putGameArea = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_18;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apis_1.putGameAreaApi)(params)];
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
    // 创建游戏区服
    SdkCommonUI.prototype.createGameArea = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_19;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apis_1.createGameAreaApi)(params)];
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
    // 删除游戏区服
    SdkCommonUI.prototype.delGameArea = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_20;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apis_1.delGameAreaApi)(params)];
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
    // 查询区服列表信息
    SdkCommonUI.prototype.getGameAreaList = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_21;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apis_1.getGameAreaListApi)()];
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
    // 创建角色
    SdkCommonUI.prototype.createGameCharacter = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_22;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apis_1.createGameCharacterApi)(params)];
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
    // 修改游戏角色信息
    SdkCommonUI.prototype.putGameCharacter = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_23;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apis_1.putGameCharacterApi)(params)];
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
    // 删除游戏角色
    SdkCommonUI.prototype.delGameCharacter = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_24;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apis_1.delGameCharacterApi)(params)];
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
    // 查询账号下角色信息列表
    SdkCommonUI.prototype.getGameCharacterAccount = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_25;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apis_1.getGameCharacterAccountApi)(params)];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_25 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_25));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 查询账号下某个区服下的角色信息列表
    SdkCommonUI.prototype.getGameCharacter = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_26;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apis_1.getGameCharacterApi)(params)];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_26 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_26));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 查询具体角色信息
    SdkCommonUI.prototype.getGameAccountAreaCharacter = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_27;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apis_1.getGameAccountAreaCharacterApi)(params)];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_27 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_27));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SdkCommonUI.prototype.exchangeItemProp = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_28;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apis_1.itemRedemptionApi)(params)];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_28 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_28));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SdkCommonUI.prototype.getDevicecode = function () {
        try {
            var devicecode = (0, utils_2.customGetStorageSync)('rx_devicecode');
            if (devicecode) {
                // @ts-ignore
                return devicecode.code;
            }
            else {
                var code = (0, v4_1.default)();
                (0, utils_2.customSetStorageSync)('rx_devicecode', { code: code, openIds: {} });
                return code;
            }
        }
        catch (err) {
            return (0, v4_1.default)();
        }
    };
    // 邮件列表
    SdkCommonUI.prototype.getEmailList = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_29;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apis_1.getEmailListApi)(params)];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_29 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_29));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 邮件详情
    SdkCommonUI.prototype.getEmailDetail = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_30;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apis_1.getEmailDetailApi)(params)];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_30 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_30));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 邮件领取
    SdkCommonUI.prototype.receiveEmail = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_31;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apis_1.receiveEmailApi)(params)];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_31 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_31));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 邮件删除
    SdkCommonUI.prototype.delEmail = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_32;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apis_1.delEmailApi)(params)];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_32 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_32));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 新版通用版本检查 v2
    SdkCommonUI.prototype.updateGameVersion = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_33;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apis_1.updateGameVersionApi)(params)];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_33 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_33));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SdkCommonUI.prototype.setCpOf = function (bool) {
        config_1.SYSTEM_INFO.CP_OF = bool;
    };
    SdkCommonUI.prototype.getCpOf = function () {
        return config_1.SYSTEM_INFO.CP_OF || false;
    };
    SdkCommonUI.prototype.setGameInfo = function (cp_role_id, region_tag) {
        config_1.SYSTEM_INFO.cp_role_id = cp_role_id;
        config_1.SYSTEM_INFO.region_tag = region_tag;
    };
    SdkCommonUI.prototype.searchGameAccount = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_34;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apis_1.searchGameAccountApi)()];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_34 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_34));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SdkCommonUI.prototype.getTempNotice = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_35;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apis_1.getTempNoticeApi)(config_1.SYSTEM_INFO.productId, config_1.SYSTEM_INFO.channelId)];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_35 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_35));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SdkCommonUI.prototype.getH5LoginConfig = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_36;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apis_1.getH5LoginConfigApi)(config_1.SYSTEM_INFO.productId, config_1.SYSTEM_INFO.channelId)];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_36 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_36));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SdkCommonUI.prototype.tradeQuery = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_37;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apis_1.tradeQueryApi)(params.order_no)];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_37 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_37));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SdkCommonUI.prototype.setLanguage = function (language) {
        if (language === void 0) { language = 'zh-CN'; }
        config_1.SYSTEM_INFO.language = language;
    };
    return SdkCommonUI;
}());
exports.default = SdkCommonUI;
//# sourceMappingURL=SdkCommomUI.js.map