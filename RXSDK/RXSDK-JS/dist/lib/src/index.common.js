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
var api_1 = require("./api/api");
var common_1 = require("@/utils/checkConfig/common");
var utils_1 = require("@/utils/utils");
var checkConfig_1 = require("@/utils/checkConfig");
var config_1 = require("@/config");
var paramsValid_1 = require("@/utils/paramsValid");
var index_feedback_1 = require("./index.feedback");
var SdkCommon = /** @class */ (function () {
    function SdkCommon(initParams) {
        // request.defaults.baseURL = initParams.baseUrlList[0]
        // axios.defaults.baseURL = initParams?.baseUrlList?.[0]
        // axios.defaults.timeout = 5000
    }
    Object.defineProperty(SdkCommon, "feedback", {
        // 意见反馈
        get: function () {
            return index_feedback_1.default.I;
        },
        enumerable: false,
        configurable: true
    });
    //发送验证码
    SdkCommon.prototype.sendCaptcha = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var loginResult, auth, _params, result, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        if (!(params.purpose != 'unbindphone')) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(common_1.sendCaptchaParamsCheck, callback, params)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!params.auth) return [3 /*break*/, 5];
                        return [4 /*yield*/, (0, utils_1.asyncFunc)(wx.login)];
                    case 3:
                        loginResult = _a.sent();
                        auth = params.auth, _params = __rest(params, ["auth"]);
                        return [4 /*yield*/, (0, api_1.sendCaptchaWithCode)(__assign(__assign({}, _params), { minigame_code: loginResult.code }))];
                    case 4:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, (0, api_1.sendCaptcha)(params)];
                    case 6:
                        result = _a.sent();
                        callback.complete(result);
                        _a.label = 7;
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        error_1 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_1));
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    //绑定手机
    SdkCommon.prototype.bindPhone = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(common_1.bindPhoneParamsCheck, callback, params)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, api_1.bindPhone)(params)];
                    case 2:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_2));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SdkCommon.prototype.validateUnbindCode = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(common_1.verifyCodeParamsCheck, callback, params)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, api_1.validateUnbindCodeApi)(params)];
                    case 2:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_3));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SdkCommon.prototype.changePhone = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(common_1.changePhoneParamsCheck, callback, params)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, api_1.changePhone)(params)];
                    case 2:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_4));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //解绑手机
    SdkCommon.prototype.unBindPhone = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(common_1.unBindPhoneParamsCheck, callback, params)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, api_1.unBindPhone)(params)];
                    case 2:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 4];
                    case 3:
                        error_5 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_5));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //绑定邮箱
    SdkCommon.prototype.bindEmail = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(common_1.bindEmailParamsCheck, callback, params)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, api_1.bindEmail)(params)];
                    case 2:
                        data = _a.sent();
                        callback.complete(data);
                        return [3 /*break*/, 4];
                    case 3:
                        error_6 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_6));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //解绑邮箱
    SdkCommon.prototype.UnbindEmail = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(common_1.unbindemailParamsCheck, callback, params)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, api_1.UnbindEmail)(params)];
                    case 2:
                        data = _a.sent();
                        callback.complete(data);
                        return [3 /*break*/, 4];
                    case 3:
                        error_7 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_7));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //注销账号
    SdkCommon.prototype.deregister = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, api_1.deregister)(params)];
                    case 1:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_8 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_8));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //撤销账号注销申请
    SdkCommon.prototype.deregisterCancel = function (CPcallback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, api_1.deregisterCancel)()];
                    case 1:
                        result = _a.sent();
                        CPcallback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_9 = _a.sent();
                        CPcallback.complete((0, utils_1.handleError)(error_9));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //获得用户信息
    SdkCommon.prototype.getInfo = function (CPcallback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, api_1.getInfoApi)()];
                    case 1:
                        result = _a.sent();
                        CPcallback.complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_10 = _a.sent();
                        CPcallback.complete((0, utils_1.handleError)(error_10));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 获取指定用户信息
    SdkCommon.prototype.getUserInfoByField = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, api_1.getUserInfoByFieldApi)(params)];
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
    //修改瑞雪通行证用户信息。
    SdkCommon.prototype.updateInfo = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, api_1.updateInfoApi)(params)];
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
    // 游戏大厅版本检查-get
    SdkCommon.prototype.checkAppVersion = function (params, callback) {
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
                        return [4 /*yield*/, (0, api_1.checkVersionGameLobbyByGet)(req)];
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
                        callback.complete((0, utils_1.handleError)(error_13));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // 游戏大厅版本检查-post
    SdkCommon.prototype.checkVersion = function (params, callback) {
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
                        return [4 /*yield*/, (0, api_1.checkVersionGameLobbyByPost)(req)];
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
                        callback.complete((0, utils_1.handleError)(error_14));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // 新版通用版本检查 v2
    SdkCommon.prototype.updateGameVersion = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, api_1.updateGameVersionApi)(params)];
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
    // 游戏版本检查
    SdkCommon.prototype.checkGameVersion = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var req, result, error_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(checkConfig_1.checkGameVersionParams, callback, params)];
                    case 1:
                        _a.sent();
                        req = __assign(__assign({}, params), { gamecheckversion: (params === null || params === void 0 ? void 0 : params.gamecheckversion) || 0, type: (params === null || params === void 0 ? void 0 : params.type) || 'lua', format: (params === null || params === void 0 ? void 0 : params.format) || 'lua' });
                        return [4 /*yield*/, (0, api_1.checkGameVersion)(req)];
                    case 2:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 4];
                    case 3:
                        error_16 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_16));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // 活动版本检查
    SdkCommon.prototype.checkActivityVersion = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var req, result, error_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(checkConfig_1.checkActivityVersionParams, callback, params)];
                    case 1:
                        _a.sent();
                        req = __assign(__assign({}, params), { activitycheckversion: (params === null || params === void 0 ? void 0 : params.activitycheckversion) || 0, type: (params === null || params === void 0 ? void 0 : params.type) || 'lua', format: (params === null || params === void 0 ? void 0 : params.format) || 'lua' });
                        return [4 /*yield*/, (0, api_1.checkActivityVersion)(req)];
                    case 2:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 4];
                    case 3:
                        error_17 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_17));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SdkCommon.prototype.getFeedbackKindList = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, SdkCommon.feedback.getFeedbackKindList(callback)];
            });
        });
    };
    SdkCommon.prototype.createFeedback = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, SdkCommon.feedback.createFeedback(params, callback)];
            });
        });
    };
    SdkCommon.prototype.satisfactionEvaluation = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, SdkCommon.feedback.satisfactionEvaluation(params, callback)];
            });
        });
    };
    SdkCommon.prototype.getShortUrl = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_18;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, api_1.getShortUrlApi)(params)];
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
    SdkCommon.prototype._getInfo = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_19;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, api_1._getInfoApi)()];
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
    SdkCommon.prototype.getTempNotice = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_20;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, api_1.getTempNoticeApi)(config_1.SYSTEM_INFO.productId, config_1.SYSTEM_INFO.channelId)];
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
    SdkCommon.prototype.getH5LoginConfig = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_21;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, api_1.getH5LoginConfigApi)(config_1.SYSTEM_INFO.productId, config_1.SYSTEM_INFO.channelId)];
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
    SdkCommon.prototype.tradeQuery = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_22;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, api_1.tradeQueryApi)(params.order_no)];
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
    return SdkCommon;
}());
exports.default = SdkCommon;
//# sourceMappingURL=index.common.js.map