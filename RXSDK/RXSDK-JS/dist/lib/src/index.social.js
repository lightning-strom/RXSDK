"use strict";
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
var social_1 = require("@/utils/checkConfig/social");
var social_2 = require("@/api/social");
var utils_1 = require("@/utils/utils");
var paramsValid_1 = require("@/utils/paramsValid");
var const_1 = require("@/config/const");
var api_1 = require("./api/api");
//社交关系
var SdkSocial = /** @class */ (function () {
    function SdkSocial() {
        this.refreshSession = 0; //用于记录刷新session
    }
    Object.defineProperty(SdkSocial, "I", {
        get: function () {
            return this.instance || (this.instance = new SdkSocial());
        },
        enumerable: false,
        configurable: true
    });
    //用户管理
    SdkSocial.prototype.setcustom = function (params, _a) {
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
                        return [4 /*yield*/, (0, social_2.setcustomApi)({ custom: params.custom })];
                    case 2:
                        result = _b.sent();
                        console.log(result);
                        complete(result);
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _b.sent();
                        complete((0, utils_1.handleError)(err_1));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //添加自定义关系
    SdkSocial.prototype.addRelation = function (params, _a) {
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
                        return [4 /*yield*/, (0, social_2.addRelationApi)(params)];
                    case 2:
                        result = _b.sent();
                        complete(result);
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _b.sent();
                        complete((0, utils_1.handleError)(err_2));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //删除自定义关系
    SdkSocial.prototype.deleteRelation = function (params, _a) {
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
                        return [4 /*yield*/, (0, social_2.deleteRelationApi)(params)];
                    case 2:
                        result = _b.sent();
                        complete(result);
                        return [3 /*break*/, 4];
                    case 3:
                        err_3 = _b.sent();
                        complete((0, utils_1.handleError)(err_3));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //更新自定关系备注
    SdkSocial.prototype.updateremarks = function (params, _a) {
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
                        return [4 /*yield*/, (0, social_2.updateremarksApi)(params)];
                    case 2:
                        result = _b.sent();
                        complete(result);
                        return [3 /*break*/, 4];
                    case 3:
                        err_4 = _b.sent();
                        complete((0, utils_1.handleError)(err_4));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //判断两用户是否存在某自定关系
    SdkSocial.prototype.hasRelation = function (params, _a) {
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
                        return [4 /*yield*/, (0, social_2.hasrelationApi)(params)];
                    case 2:
                        result = _b.sent();
                        complete(result);
                        return [3 /*break*/, 4];
                    case 3:
                        err_5 = _b.sent();
                        complete((0, utils_1.handleError)(err_5));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //获取自定关系列表
    SdkSocial.prototype.relationList = function (params, _a) {
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
                        return [4 /*yield*/, (0, social_2.relationListApi)({ type: params.type })];
                    case 2:
                        result = _b.sent();
                        complete(result);
                        return [3 /*break*/, 4];
                    case 3:
                        err_6 = _b.sent();
                        complete((0, utils_1.handleError)(err_6));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //添加好友关系
    SdkSocial.prototype.addFriend = function (params, _a) {
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
                        return [4 /*yield*/, (0, social_2.addfriendApi)(params)];
                    case 2:
                        result = _b.sent();
                        complete(result);
                        return [3 /*break*/, 4];
                    case 3:
                        err_7 = _b.sent();
                        complete((0, utils_1.handleError)(err_7));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //删除好友关系
    SdkSocial.prototype.delfriend = function (params, _a) {
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
                        return [4 /*yield*/, (0, social_2.delfriendApi)(params)];
                    case 2:
                        result = _b.sent();
                        complete(result);
                        return [3 /*break*/, 4];
                    case 3:
                        err_8 = _b.sent();
                        complete((0, utils_1.handleError)(err_8));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //更新好友备注
    SdkSocial.prototype.updatefriendremarks = function (params, _a) {
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
                        return [4 /*yield*/, (0, social_2.updatefriendremarksApi)(params)];
                    case 2:
                        result = _b.sent();
                        complete(result);
                        return [3 /*break*/, 4];
                    case 3:
                        err_9 = _b.sent();
                        complete((0, utils_1.handleError)(err_9));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //判断两用户是否为好友
    SdkSocial.prototype.isfriend = function (params, _a) {
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
                        return [4 /*yield*/, (0, social_2.isfriendApi)(params)];
                    case 2:
                        result = _b.sent();
                        complete(result);
                        return [3 /*break*/, 4];
                    case 3:
                        err_10 = _b.sent();
                        complete((0, utils_1.handleError)(err_10));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //获取好友关系列表
    SdkSocial.prototype.friends = function (_a) {
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            var result, err_11;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, social_2.friendsApi)()];
                    case 1:
                        result = _b.sent();
                        complete(result);
                        return [3 /*break*/, 3];
                    case 2:
                        err_11 = _b.sent();
                        complete((0, utils_1.handleError)(err_11));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 排行榜相关接口
     */
    //增加用户分数
    SdkSocial.prototype.addscore = function (params, _a) {
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
                        return [4 /*yield*/, (0, social_2.addscoreApi)(params)];
                    case 2:
                        result = _b.sent();
                        complete(result);
                        return [3 /*break*/, 4];
                    case 3:
                        err_12 = _b.sent();
                        complete((0, utils_1.handleError)(err_12));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //设置用户分数
    SdkSocial.prototype.setscore = function (params, _a) {
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
                        return [4 /*yield*/, (0, social_2.setscoreApi)(params)];
                    case 2:
                        result = _b.sent();
                        complete(result);
                        return [3 /*break*/, 4];
                    case 3:
                        err_13 = _b.sent();
                        complete((0, utils_1.handleError)(err_13));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //查询用户分数
    SdkSocial.prototype.queryuserrank = function (params, _a) {
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
                        return [4 /*yield*/, (0, social_2.queryuserrankApi)(params)];
                    case 2:
                        result = _b.sent();
                        complete(result);
                        return [3 /*break*/, 4];
                    case 3:
                        err_14 = _b.sent();
                        complete((0, utils_1.handleError)(err_14));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //获取排行榜列表
    SdkSocial.prototype.getranklist = function (params, _a) {
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
                        return [4 /*yield*/, (0, social_2.getranklistApi)(params)];
                    case 2:
                        result = _b.sent();
                        complete(result);
                        return [3 /*break*/, 4];
                    case 3:
                        err_15 = _b.sent();
                        complete((0, utils_1.handleError)(err_15));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //获取好友排行榜列表
    SdkSocial.prototype.friendsrank = function (params, _a) {
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
                        return [4 /*yield*/, (0, social_2.friendsrankApi)(params)];
                    case 2:
                        result = _b.sent();
                        complete(result);
                        return [3 /*break*/, 4];
                    case 3:
                        err_16 = _b.sent();
                        complete((0, utils_1.handleError)(err_16));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 开放数据相关接口
     */
    //是否授权使用你的微信朋友信息
    SdkSocial.prototype.authorizeWxFriendInteraction = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            function authDenyed(err) {
                var error = new Error((err === null || err === void 0 ? void 0 : err.errMsg) || 'authorize WxFriendInteraction:fail auth deny');
                error.code = const_1.COMMON_ERROR_CODE.FRIENDINTERACTION_AUTH_DENY;
                if (callback === null || callback === void 0 ? void 0 : callback.complete) {
                    callback.complete((0, utils_1.handleError)(error));
                    return;
                }
                throw error;
            }
            var authSetting, res, openSetting, err_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 10, , 11]);
                        return [4 /*yield*/, (0, utils_1.asyncFunc)(wx.getSetting)];
                    case 1:
                        authSetting = (_a.sent()).authSetting;
                        console.log('authSetting: ', authSetting['scope.WxFriendInteraction']);
                        if (!(authSetting['scope.WxFriendInteraction'] === true)) return [3 /*break*/, 2];
                        //console.log('已经同意授权授权')
                        (callback === null || callback === void 0 ? void 0 : callback.complete) && callback.complete({ code: 0 });
                        return [2 /*return*/, true];
                    case 2:
                        if (!(authSetting['scope.WxFriendInteraction'] === undefined)) return [3 /*break*/, 4];
                        // scope.WxFriendInteraction === undefined代表用户未授权且第一次登陆
                        //console.log('从未授权过')
                        return [4 /*yield*/, (0, utils_1.asyncFunc)(wx.authorize, { scope: 'scope.WxFriendInteraction' })];
                    case 3:
                        // scope.WxFriendInteraction === undefined代表用户未授权且第一次登陆
                        //console.log('从未授权过')
                        _a.sent();
                        (callback === null || callback === void 0 ? void 0 : callback.complete) && callback.complete({ code: 0 });
                        return [2 /*return*/, true];
                    case 4:
                        if (!(authSetting['scope.WxFriendInteraction'] != undefined &&
                            authSetting['scope.WxFriendInteraction'] != true)) return [3 /*break*/, 9];
                        return [4 /*yield*/, (0, utils_1.asyncFunc)(wx.showModal, {
                                title: '申请使用你的微信朋友信息',
                                // content: '需要获取您的微信朋友信息，请确认授权，否则无法相关功能！',
                                cancelText: '拒绝',
                                confirmText: '允许',
                            })];
                    case 5:
                        res = _a.sent();
                        if (!res.cancel) return [3 /*break*/, 6];
                        wx.showToast({
                            title: '您已拒绝授权!',
                            icon: 'none',
                        });
                        return [3 /*break*/, 8];
                    case 6:
                        if (!res.confirm) return [3 /*break*/, 8];
                        return [4 /*yield*/, (0, utils_1.asyncFunc)(wx.openSetting)];
                    case 7:
                        openSetting = _a.sent();
                        if (openSetting.authSetting['scope.WxFriendInteraction'] === true) {
                            wx.showToast({
                                title: '授权成功!',
                                icon: 'none',
                            });
                            (callback === null || callback === void 0 ? void 0 : callback.complete) && callback.complete({ code: 0 });
                            return [2 /*return*/, true];
                        }
                        else {
                            wx.showToast({
                                title: '授权失败!',
                                icon: 'none',
                            });
                        }
                        _a.label = 8;
                    case 8: return [2 /*return*/, authDenyed()];
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        err_17 = _a.sent();
                        return [2 /*return*/, authDenyed(err_17)];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    SdkSocial.prototype.getUserInteractiveStorage = function (params, _a) {
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            var _b, iv, encryptedData, res, err_18;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.authorizeWxFriendInteraction()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, (0, utils_1.asyncFunc)(wx.getUserInteractiveStorage, {
                                keyList: (params === null || params === void 0 ? void 0 : params.keyList) || [],
                            })];
                    case 2:
                        _b = _c.sent(), iv = _b.iv, encryptedData = _b.encryptedData;
                        return [4 /*yield*/, (0, social_2.opendataAesdecodeApi)({ iv: iv, encrypted_data: encryptedData })];
                    case 3:
                        res = _c.sent();
                        complete(res);
                        return [3 /*break*/, 5];
                    case 4:
                        err_18 = _c.sent();
                        complete((0, utils_1.handleError)(err_18));
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    //是否授权使用你的游戏圈数据
    SdkSocial.prototype.authorizeWxGameClubData = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            function authDenyed(err) {
                var error = new Error((err === null || err === void 0 ? void 0 : err.errMsg) || 'authorize gameClubData:fail auth deny');
                error.code = const_1.COMMON_ERROR_CODE.GAMECLUBDATA_AUTH_DENY;
                if (callback === null || callback === void 0 ? void 0 : callback.complete) {
                    callback.complete((0, utils_1.handleError)(error));
                    return;
                }
                throw error;
            }
            var authSetting, res, openSetting, err_19;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 10, , 11]);
                        return [4 /*yield*/, (0, utils_1.asyncFunc)(wx.getSetting)];
                    case 1:
                        authSetting = (_a.sent()).authSetting;
                        console.log('authSetting: ', authSetting['scope.gameClubData']);
                        if (!(authSetting['scope.gameClubData'] === true)) return [3 /*break*/, 2];
                        //console.log('已经同意授权授权')
                        (callback === null || callback === void 0 ? void 0 : callback.complete) && callback.complete({ code: 0 });
                        return [2 /*return*/, true];
                    case 2:
                        if (!(authSetting['scope.gameClubData'] === undefined)) return [3 /*break*/, 4];
                        //console.log('从未授权过')
                        return [4 /*yield*/, (0, utils_1.asyncFunc)(wx.authorize, { scope: 'scope.gameClubData' })];
                    case 3:
                        //console.log('从未授权过')
                        _a.sent();
                        (callback === null || callback === void 0 ? void 0 : callback.complete) && callback.complete({ code: 0 });
                        return [2 /*return*/, true];
                    case 4:
                        if (!(authSetting['scope.gameClubData'] != undefined &&
                            authSetting['scope.gameClubData'] != true)) return [3 /*break*/, 9];
                        return [4 /*yield*/, (0, utils_1.asyncFunc)(wx.showModal, {
                                title: '申请使用你的游戏圈加入、发表、点赞数据',
                                cancelText: '拒绝',
                                confirmText: '允许',
                            })];
                    case 5:
                        res = _a.sent();
                        if (!res.cancel) return [3 /*break*/, 6];
                        wx.showToast({
                            title: '您已拒绝授权!',
                            icon: 'none',
                        });
                        return [3 /*break*/, 8];
                    case 6:
                        if (!res.confirm) return [3 /*break*/, 8];
                        return [4 /*yield*/, (0, utils_1.asyncFunc)(wx.openSetting)];
                    case 7:
                        openSetting = _a.sent();
                        if (openSetting.authSetting['scope.gameClubData'] === true) {
                            wx.showToast({
                                title: '授权成功!',
                                icon: 'none',
                            });
                            (callback === null || callback === void 0 ? void 0 : callback.complete) && callback.complete({ code: 0 });
                            return [2 /*return*/, true];
                        }
                        else {
                            wx.showToast({
                                title: '授权失败!',
                                icon: 'none',
                            });
                        }
                        _a.label = 8;
                    case 8: return [2 /*return*/, authDenyed()];
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        err_19 = _a.sent();
                        return [2 /*return*/, authDenyed(err_19)];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    //获得游戏圈数据
    SdkSocial.prototype.getGameClubData = function (params, _a) {
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            var sessionOverdue, _b, iv, encryptedData, signature, res, err_20;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
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
                                            this.getGameClubData(params, { complete: complete });
                                        }
                                        else {
                                            complete((0, utils_1.handleError)(err));
                                        }
                                        return [3 /*break*/, 3];
                                    case 2:
                                        complete((0, utils_1.handleError)(err));
                                        _a.label = 3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); };
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, this.authorizeWxGameClubData()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, (0, utils_1.asyncFunc)(wx.getGameClubData, {
                                dataTypeList: (params === null || params === void 0 ? void 0 : params.dataTypeList) || [],
                            })];
                    case 3:
                        _b = _c.sent(), iv = _b.iv, encryptedData = _b.encryptedData, signature = _b.signature;
                        return [4 /*yield*/, (0, social_2.opendataAesdecodeApi)({ iv: iv, encrypted_data: encryptedData })];
                    case 4:
                        res = _c.sent();
                        this.refreshSession = 0;
                        complete(res);
                        return [3 /*break*/, 6];
                    case 5:
                        err_20 = _c.sent();
                        sessionOverdue(err_20);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    SdkSocial.prototype.setUserCloudStorage = function (params, _a) {
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            var err_21;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, utils_1.asyncFunc)(wx.setUserCloudStorage, {
                                KVDataList: (params === null || params === void 0 ? void 0 : params.KVDataList) || [],
                            })];
                    case 1:
                        _b.sent();
                        complete({ code: 0 });
                        return [3 /*break*/, 3];
                    case 2:
                        err_21 = _b.sent();
                        complete((0, utils_1.handleError)(err_21));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SdkSocial.prototype.getUserCloudStorage = function (params, _a) {
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            var res, err_22;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, utils_1.asyncFunc)(wx.getUserCloudStorage, {
                                keyList: (params === null || params === void 0 ? void 0 : params.keyList) || [],
                            })];
                    case 1:
                        res = _b.sent();
                        complete({ code: 0, data: (res === null || res === void 0 ? void 0 : res.KVDataList) || [] });
                        return [3 /*break*/, 3];
                    case 2:
                        err_22 = _b.sent();
                        complete((0, utils_1.handleError)(err_22));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SdkSocial.prototype.removeUserCloudStorage = function (params, _a) {
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            var err_23;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, utils_1.asyncFunc)(wx.removeUserCloudStorage, {
                                keyList: (params === null || params === void 0 ? void 0 : params.keyList) || [],
                            })];
                    case 1:
                        _b.sent();
                        complete({ code: 0 });
                        return [3 /*break*/, 3];
                    case 2:
                        err_23 = _b.sent();
                        complete((0, utils_1.handleError)(err_23));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SdkSocial.prototype.getUserCloudStorageKeys = function (_a) {
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            var res, err_24;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, utils_1.asyncFunc)(wx.getUserCloudStorageKeys)];
                    case 1:
                        res = _b.sent();
                        complete({ code: 0, data: (res === null || res === void 0 ? void 0 : res.keys) || [] });
                        return [3 /*break*/, 3];
                    case 2:
                        err_24 = _b.sent();
                        complete((0, utils_1.handleError)(err_24));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SdkSocial.prototype.getFriendCloudStorage = function (params, _a) {
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            var res, err_25;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, utils_1.asyncFunc)(wx.getFriendCloudStorage, {
                                keyList: (params === null || params === void 0 ? void 0 : params.keyList) || [],
                            })];
                    case 1:
                        res = _b.sent();
                        complete({ code: 0, data: (res === null || res === void 0 ? void 0 : res.data) || [] });
                        return [3 /*break*/, 3];
                    case 2:
                        err_25 = _b.sent();
                        complete((0, utils_1.handleError)(err_25));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SdkSocial.prototype.getPotentialFriendList = function (_a) {
        var complete = _a.complete;
        return __awaiter(this, void 0, void 0, function () {
            var res, err_26;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, utils_1.asyncFunc)(wx.getPotentialFriendList)];
                    case 1:
                        res = _b.sent();
                        complete({ code: 0, data: (res === null || res === void 0 ? void 0 : res.list) || [] });
                        return [3 /*break*/, 3];
                    case 2:
                        err_26 = _b.sent();
                        complete((0, utils_1.handleError)(err_26));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SdkSocial.prototype.refreshSessionFunc = function () {
        return __awaiter(this, void 0, void 0, function () {
            var code, err_27;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, utils_1.asyncFunc)(wx.login)];
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
                        err_27 = _a.sent();
                        return [2 /*return*/, -1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return SdkSocial;
}());
exports.default = SdkSocial;
//# sourceMappingURL=index.social.js.map