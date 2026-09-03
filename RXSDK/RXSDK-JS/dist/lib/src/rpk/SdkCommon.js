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
var common_1 = require("@/utils/checkConfig/common");
var utils_1 = require("@/utils/utils");
var config_1 = require("@/config");
var paramsValid_1 = require("@/utils/paramsValid");
var checkConfig_1 = require("@/utils/checkConfig");
var social_1 = require("@/utils/checkConfig/social");
var utils_2 = require("@/rpk/utils");
var v4_1 = require("uuid/v4");
var day_1 = require("@/utils/day");
// @ts-ignore
// import drawQrcode from './qrcode.js'
var SdkCommon = /** @class */ (function () {
    function SdkCommon(platform) {
        this.platform = platform;
    }
    // 用户管理
    SdkCommon.prototype.setcustom = function (params, _a) {
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
    SdkCommon.prototype.addRelation = function (params, _a) {
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
    SdkCommon.prototype.deleteRelation = function (params, _a) {
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
    SdkCommon.prototype.updateremarks = function (params, _a) {
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
    SdkCommon.prototype.hasRelation = function (params, _a) {
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
    SdkCommon.prototype.relationList = function (params, _a) {
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
    SdkCommon.prototype.addFriend = function (params, _a) {
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
    SdkCommon.prototype.delfriend = function (params, _a) {
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
    SdkCommon.prototype.updatefriendremarks = function (params, _a) {
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
    SdkCommon.prototype.isfriend = function (params, _a) {
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
    SdkCommon.prototype.friends = function (_a) {
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
    SdkCommon.prototype.addscore = function (params, _a) {
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
    SdkCommon.prototype.setscore = function (params, _a) {
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
    SdkCommon.prototype.queryuserrank = function (params, _a) {
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
    SdkCommon.prototype.getranklist = function (params, _a) {
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
    SdkCommon.prototype.friendsrank = function (params, _a) {
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
    SdkCommon.prototype.getHelpcenterMainLayout = function (_a) {
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
    SdkCommon.prototype.getHelpcenterQuestionLayout = function (params, _a) {
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
    SdkCommon.prototype.getHelpcenterInfoLayout = function (params, _a) {
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
    SdkCommon.prototype.helpcenterResolution = function (params, _a) {
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
    SdkCommon.prototype.addFeedback = function (params, callback) {
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
    SdkCommon.prototype.getFeedbackList = function (params, callback) {
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
    SdkCommon.prototype.getFeedbackDetail = function (params, callback) {
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
    SdkCommon.prototype.collectProps = function (params, callback) {
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
    SdkCommon.prototype.getAnnouncement = function (limit, callback) {
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
    SdkCommon.prototype.setErrorMsg = function (errMsg) {
        config_1.SYSTEM_INFO.errMsg = errMsg;
    };
    /**
     * 清空返回错误 Msg
     */
    SdkCommon.prototype.clearErrorMsg = function () {
        config_1.SYSTEM_INFO.errMsg = {
            default: ''
        };
    };
    // 发送验证码
    SdkCommon.prototype.sendCaptcha = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(common_1.sendCaptchaParamsCheck, callback, params)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, apis_1.sendCaptcha)(params)];
                    case 2:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        callback.complete((0, utils_2.handleTrackError)(this.platform, '', error_1));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // 绑定手机
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
                        return [4 /*yield*/, (0, apis_1.bindPhone)(params)];
                    case 2:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        callback.complete((0, utils_2.handleTrackError)(this.platform, '', error_2));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // 解绑手机
    SdkCommon.prototype.unBindPhone = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(common_1.unBindPhoneParamsCheck, callback, params)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, apis_1.unBindPhone)(params)];
                    case 2:
                        result = _a.sent();
                        callback.complete(result);
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        callback.complete((0, utils_2.handleTrackError)(this.platform, '', error_3));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // 绑定邮箱
    SdkCommon.prototype.bindEmail = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(common_1.bindEmailParamsCheck, callback, params)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, apis_1.bindEmail)(params)];
                    case 2:
                        data = _a.sent();
                        callback.complete(data);
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        callback.complete((0, utils_2.handleTrackError)(this.platform, '', error_4));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // 解绑邮箱
    SdkCommon.prototype.UnbindEmail = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, paramsValid_1.pubCheck)(common_1.unbindemailParamsCheck, callback, params)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, apis_1.UnbindEmail)(params)];
                    case 2:
                        data = _a.sent();
                        callback.complete(data);
                        return [3 /*break*/, 4];
                    case 3:
                        error_5 = _a.sent();
                        callback.complete((0, utils_2.handleTrackError)(this.platform, '', error_5));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // 注销账号
    SdkCommon.prototype.deregister = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_6;
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
                        error_6 = _a.sent();
                        callback.complete((0, utils_2.handleTrackError)(this.platform, '', error_6));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 撤销账号注销申请
    SdkCommon.prototype.deregisterCancel = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_7;
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
                        error_7 = _a.sent();
                        callback.complete((0, utils_2.handleTrackError)(this.platform, '', error_7));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 获得用户信息
    SdkCommon.prototype.getInfo = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_8;
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
                        error_8 = _a.sent();
                        callback.complete((0, utils_2.handleTrackError)(this.platform, '', error_8));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 修改瑞雪通行证用户信息。
    SdkCommon.prototype.updateInfo = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_9;
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
                        error_9 = _a.sent();
                        callback.complete((0, utils_2.handleTrackError)(this.platform, '', error_9));
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
            var req, result, data, region_tag, error_10;
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
                        error_10 = _c.sent();
                        callback.complete((0, utils_2.handleTrackError)(this.platform, '', error_10));
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
            var req, result, data, region_tag, error_11;
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
                        error_11 = _c.sent();
                        callback.complete((0, utils_2.handleTrackError)(this.platform, '', error_11));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // 游戏版本检查
    SdkCommon.prototype.checkGameVersion = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var req, result, error_12;
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
                        error_12 = _a.sent();
                        callback.complete((0, utils_2.handleTrackError)(this.platform, '', error_12));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // 活动版本检查
    SdkCommon.prototype.checkActivityVersion = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var req, result, error_13;
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
                        error_13 = _a.sent();
                        callback.complete((0, utils_2.handleTrackError)(this.platform, '', error_13));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SdkCommon.prototype.track = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var p1, p2, getDevicecode, devicecode, type, time, uuids, platform_id, copyCpid, product_id, channel_id, cpid, publicProps, new_properties, version, reqarr, result, err_26;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (config_1.SYSTEM_INFO.isMatch) {
                            callback.complete({ code: 0 });
                            return [2 /*return*/];
                        }
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
                        platform_id = 4;
                        copyCpid = config_1.SYSTEM_INFO.cpid, product_id = config_1.SYSTEM_INFO.productId, channel_id = config_1.SYSTEM_INFO.channelId;
                        cpid = Number(copyCpid);
                        publicProps = (0, utils_2.customGetStorageSync)('rx_public_props');
                        new_properties = {};
                        if (params.ip) {
                            new_properties.ipv4 = params.ip;
                        }
                        if (config_1.SYSTEM_INFO.region_tag) {
                            new_properties.rx_region_tag = "".concat(config_1.SYSTEM_INFO.region_tag);
                        }
                        if (config_1.SYSTEM_INFO.cp_role_id) {
                            new_properties['#role_id'] = "".concat(config_1.SYSTEM_INFO.cp_role_id);
                        }
                        try {
                            version = config_1.SYSTEM_INFO.miniVersion;
                            if (version) {
                                new_properties['rx_app_info'] = {
                                    version: version
                                };
                            }
                        }
                        catch (e) {
                        }
                        reqarr = [
                            __assign({ type: type, time: time, uuid: uuids, distinct_id: config_1.USER_INFO === null || config_1.USER_INFO === void 0 ? void 0 : config_1.USER_INFO.openid, sub_channel_id: config_1.USER_INFO === null || config_1.USER_INFO === void 0 ? void 0 : config_1.USER_INFO.subchannelid, platform_id: platform_id, product_id: product_id, cpid: cpid, channel_id: channel_id, devicecode: devicecode }, __assign(__assign({}, p1), { properties: __assign(__assign(__assign({}, new_properties), p1.properties), publicProps) }))
                        ];
                        !config_1.USER_INFO.subchannelid || (reqarr[0].sub_channel_id = config_1.USER_INFO.subchannelid);
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
    // 获取商业化接口
    SdkCommon.prototype.getOperationScene = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            var res, err_27;
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
                        err_27 = _a.sent();
                        callback && callback.complete((0, utils_2.handleTrackError)(this.platform, '', err_27));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 商业化上报接口
    SdkCommon.prototype.reportWindowExposure = function (properties, callback) {
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
    SdkCommon.prototype.getGameArea = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_14;
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
                        error_14 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_14));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 游戏区服信息修改
    SdkCommon.prototype.putGameArea = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_15;
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
                        error_15 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_15));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 创建游戏区服
    SdkCommon.prototype.createGameArea = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_16;
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
                        error_16 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_16));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 删除游戏区服
    SdkCommon.prototype.delGameArea = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_17;
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
                        error_17 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_17));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 查询区服列表信息
    SdkCommon.prototype.getGameAreaList = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_18;
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
                        error_18 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_18));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 创建角色
    SdkCommon.prototype.createGameCharacter = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_19;
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
                        error_19 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_19));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 修改游戏角色信息
    SdkCommon.prototype.putGameCharacter = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_20;
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
                        error_20 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_20));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 删除游戏角色
    SdkCommon.prototype.delGameCharacter = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_21;
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
                        error_21 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_21));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 查询账号下角色信息列表
    SdkCommon.prototype.getGameCharacterAccount = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_22;
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
                        error_22 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_22));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 查询账号下某个区服下的角色信息列表
    SdkCommon.prototype.getGameCharacter = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_23;
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
                        error_23 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_23));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 查询具体角色信息
    SdkCommon.prototype.getGameAccountAreaCharacter = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_24;
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
                        error_24 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_24));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SdkCommon.prototype.exchangeItemProp = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_25;
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
                        error_25 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_25));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 邮件列表
    SdkCommon.prototype.getEmailList = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_26;
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
                        error_26 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_26));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 邮件详情
    SdkCommon.prototype.getEmailDetail = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_27;
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
                        error_27 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_27));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 邮件领取
    SdkCommon.prototype.receiveEmail = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_28;
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
                        error_28 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_28));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 邮件删除
    SdkCommon.prototype.delEmail = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_29;
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
                        error_29 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_29));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SdkCommon.prototype.getShortUrl = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_30;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apis_1.getShortUrlApi)(params)];
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
    SdkCommon.prototype._getInfo = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_31;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, apis_1._getInfoApi)()];
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
    // 获取指定用户信息
    SdkCommon.prototype.getUserInfoByField = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_32;
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
                        error_32 = _a.sent();
                        callback.complete((0, utils_1.handleError)(error_32));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 新版通用版本检查 v2
    SdkCommon.prototype.updateGameVersion = function (params, callback) {
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
    SdkCommon.prototype.setCpOf = function (bool) {
        config_1.SYSTEM_INFO.CP_OF = bool;
    };
    SdkCommon.prototype.getCpOf = function () {
        return config_1.SYSTEM_INFO.CP_OF || false;
    };
    SdkCommon.prototype.setGameInfo = function (cp_role_id, region_tag) {
        config_1.SYSTEM_INFO.cp_role_id = cp_role_id;
        config_1.SYSTEM_INFO.region_tag = region_tag;
    };
    SdkCommon.prototype.searchGameAccount = function (callback) {
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
    SdkCommon.prototype.getTempNotice = function (callback) {
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
    SdkCommon.prototype.getH5LoginConfig = function (callback) {
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
    SdkCommon.prototype.tradeQuery = function (params, callback) {
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
    return SdkCommon;
}());
exports.default = SdkCommon;
//# sourceMappingURL=SdkCommon.js.map