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
var config_1 = require("@/config");
var index_common_1 = require("@/index.common");
var utils_1 = require("@/utils/utils");
var utils_2 = require("@/utils/h5/utils");
var user_1 = require("@/api/user");
var pay_1 = require("@/api/pay");
var SdkWeiLe = /** @class */ (function (_super) {
    __extends(SdkWeiLe, _super);
    function SdkWeiLe(params) {
        var _this = _super.call(this, params) || this;
        console.info('update version time is 2022-05-16');
        config_1.SYSTEM_INFO.appid = params.appId;
        config_1.SYSTEM_INFO.type = 1;
        _this.__h5Init();
        return _this;
    }
    SdkWeiLe.prototype.setFormChannel = function () {
        this.__type = 'weile';
    };
    SdkWeiLe.prototype.__h5Init = function () {
        var _this = this;
        this.setFormChannel();
        config_1.SYSTEM_INFO.fromChannel = this.__type;
        var queries = (0, utils_2.getSearchQueries)();
        this.__queries = queries;
        if (!queries.apiSvr) {
            // throw 'can\'t get apiSvr from URI.'
        }
        var script = document.createElement('script');
        script.src = "//".concat(atob(queries.apiSvr), "/file/jssdk?v=").concat(queries.jssdkVersion || '2.0.0', "&t=").concat(new Date().getTime());
        script.onload = function () {
            _this.__sdk = window.webgameWL;
        };
        document.body.appendChild(script);
    };
    SdkWeiLe.prototype.login = function (_a) {
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            var data, userInfo, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (typeof complete !== 'function')
                            throw 'login complete must be function.';
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        data = {
                            // openid: this.__queries.openId,
                            ext: __assign(__assign({}, this.__queries), { token: this.__queries.accessToken }),
                            type: this.__type,
                        };
                        return [4 /*yield*/, (0, user_1.login)(data)];
                    case 2:
                        userInfo = _b.sent();
                        this.setUserInfo(userInfo);
                        Object.assign(config_1.USER_INFO, userInfo);
                        complete(userInfo);
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _b.sent();
                        complete((0, utils_1.handleError)(error_1));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SdkWeiLe.prototype.closeGame = function (methodParams) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    this.__sdk.closeWL();
                    methodParams === null || methodParams === void 0 ? void 0 : methodParams.complete({ code: 0 });
                }
                catch (error) {
                    methodParams === null || methodParams === void 0 ? void 0 : methodParams.complete((0, utils_1.handleError)(error));
                }
                return [2 /*return*/];
            });
        });
    };
    SdkWeiLe.prototype.pay = function (_a, data) {
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            var firstJudgment_1, config_2, diamondNumber_1, isRMBPayEnable_1, pay_2, payJudgmentMethod_1, error_2;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        firstJudgment_1 = true;
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                _this.__sdk.getConfigWL(function (data) {
                                    console.info('测试wlconfig', data);
                                    if (data.code === 0) {
                                        resolve(data);
                                    }
                                    else {
                                        reject(data);
                                    }
                                });
                            })];
                    case 1:
                        config_2 = (_b.sent()).data;
                        console.info('测试1config', config_2);
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                _this.__sdk.getDiamondNumberWL(function (callbakData) {
                                    if (callbakData.code === 0) {
                                        resolve(callbakData);
                                    }
                                    else {
                                        reject(callbakData);
                                    }
                                });
                            })];
                    case 2:
                        diamondNumber_1 = (_b.sent()).data;
                        console.info('测试2钻石数', diamondNumber_1);
                        console.info('测试3config', config_2);
                        if (config_2) {
                            isRMBPayEnable_1 = config_2.isRMBPayEnable;
                            console.info('通过config', config_2);
                            console.info('config.payChannelFromCmd由大厅传入的值', config_2.payChannelFromCmd);
                            pay_2 = function (func, feedType, payChannel) { return __awaiter(_this, void 0, void 0, function () {
                                var transaction_id, payRes;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!data.ext)
                                                data.ext = {};
                                            data.ext['ext.feeType'] = feedType;
                                            if (feedType == 2 && config_2.payChannelFromCmd !== undefined && config_2.payChannelFromCmd !== null) {
                                                data.ext['ext.payChannel'] = config_2.payChannelFromCmd;
                                            }
                                            else {
                                                data.ext['ext.payChannel'] = payChannel;
                                            }
                                            data.ext.openId = this.__queries.openId;
                                            return [4 /*yield*/, (0, pay_1.order)(this.__type, data)
                                                // pay in diamond
                                            ];
                                        case 1:
                                            transaction_id = (_a.sent()).ext.transaction_id;
                                            return [4 /*yield*/, new Promise(function (resolve, reject) {
                                                    func(transaction_id, function (callbakData) {
                                                        callbakData.code === 0 && resolve(callbakData) || reject(callbakData);
                                                    });
                                                })];
                                        case 2:
                                            payRes = _a.sent();
                                            complete(payRes);
                                            return [2 /*return*/];
                                    }
                                });
                            }); };
                            payJudgmentMethod_1 = function () { return __awaiter(_this, void 0, void 0, function () {
                                var newDiamondNumber, count_1;
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                                                _this.__sdk.getDiamondNumberWL(function (callbakData) {
                                                    if (callbakData.code === 0) {
                                                        resolve(callbakData);
                                                    }
                                                    else {
                                                        reject(callbakData);
                                                    }
                                                });
                                            })];
                                        case 1:
                                            newDiamondNumber = (_a.sent()).data;
                                            if (!(data.amount / 10 <= newDiamondNumber && this.__sdk.checkIsClientWL())) return [3 /*break*/, 3];
                                            return [4 /*yield*/, pay_2(this.__sdk.payInDiamondWL, 1, 0)];
                                        case 2:
                                            _a.sent();
                                            return [3 /*break*/, 10];
                                        case 3:
                                            if (!isRMBPayEnable_1) return [3 /*break*/, 5];
                                            return [4 /*yield*/, pay_2(this.__sdk.payInRMBWL, 2, 1)];
                                        case 4:
                                            _a.sent();
                                            return [3 /*break*/, 10];
                                        case 5:
                                            if (!data.autoExchange) return [3 /*break*/, 9];
                                            if (!!firstJudgment_1) return [3 /*break*/, 6];
                                            if (newDiamondNumber >= diamondNumber_1) {
                                                // 充值了钻石
                                                complete({ code: 0 });
                                            }
                                            else {
                                                // 没有充值钻石
                                                complete({ code: 1000000 });
                                            }
                                            return [3 /*break*/, 8];
                                        case 6:
                                            count_1 = Number(data.amount / 10) - Number(diamondNumber_1);
                                            return [4 /*yield*/, new Promise(function (resolve, reject) {
                                                    _this.__sdk.doPayDiamondWL(count_1, function (callbakData) {
                                                        if (callbakData.code === 0) {
                                                            firstJudgment_1 = false;
                                                            payJudgmentMethod_1();
                                                            resolve(callbakData);
                                                        }
                                                        else {
                                                            reject(callbakData);
                                                        }
                                                    });
                                                })];
                                        case 7:
                                            _a.sent();
                                            _a.label = 8;
                                        case 8: return [3 /*break*/, 10];
                                        case 9:
                                            this.__sdk.showDiamondStoreWL(function () { });
                                            _a.label = 10;
                                        case 10: return [2 /*return*/];
                                    }
                                });
                            }); };
                            payJudgmentMethod_1();
                        }
                        else {
                            throw 'Can\'t get config.';
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _b.sent();
                        complete((0, utils_1.handleError)(error_2));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SdkWeiLe.prototype.getBeanNumber = function (_a) {
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                try {
                    this.__sdk.getBeanNumberWL(function (data) {
                        complete(data);
                    });
                }
                catch (error) {
                    complete((0, utils_1.handleError)(error));
                }
                return [2 /*return*/];
            });
        });
    };
    SdkWeiLe.prototype.getIsPlayingGame = function (_a) {
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                try {
                    this.__sdk.getIsPlayingGameWL(function (data) {
                        complete(data);
                    });
                }
                catch (error) {
                    complete((0, utils_1.handleError)(error));
                }
                return [2 /*return*/];
            });
        });
    };
    SdkWeiLe.prototype.getDiamondNumber = function (_a) {
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                try {
                    this.__sdk.getDiamondNumberWL(function (data) {
                        complete(data);
                    });
                }
                catch (error) {
                    complete((0, utils_1.handleError)(error));
                }
                return [2 /*return*/];
            });
        });
    };
    SdkWeiLe.prototype.showDiamondStore = function (_a) {
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                try {
                    this.__sdk.showDiamondStoreWL(function (data) {
                        complete(data);
                    });
                }
                catch (error) {
                    complete((0, utils_1.handleError)(error));
                }
                return [2 /*return*/];
            });
        });
    };
    SdkWeiLe.prototype.roleLogin = function (_a, data) {
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                complete((0, utils_1.handleError)(new Error('share: 暂不支持')));
                return [2 /*return*/];
            });
        });
    };
    SdkWeiLe.prototype.share = function (_a, data) {
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                complete((0, utils_1.handleError)(new Error('share: 暂不支持')));
                return [2 /*return*/];
            });
        });
    };
    SdkWeiLe.prototype.ad = function (_a, data) {
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                complete((0, utils_1.handleError)(new Error('ad: 暂不支持')));
                return [2 /*return*/];
            });
        });
    };
    return SdkWeiLe;
}(index_common_1.default));
exports.default = SdkWeiLe;
//# sourceMappingURL=index.weile.js.map