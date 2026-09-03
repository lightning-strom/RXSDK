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
var index_social_1 = require("./index.social");
var index_wegame_1 = require("./index.wegame");
var index_helpcenter_1 = require("./index.helpcenter");
//微信小游戏sdk-全量
var SdkWegameFull = /** @class */ (function (_super) {
    __extends(SdkWegameFull, _super);
    function SdkWegameFull(initParams) {
        var _this = _super.call(this, initParams) || this;
        console.log('微信小游戏sdk-全量API');
        return _this;
    }
    Object.defineProperty(SdkWegameFull, "social", {
        //社交关系
        get: function () {
            return index_social_1.default.I;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SdkWegameFull, "helpcenter", {
        //帮助中心
        get: function () {
            return index_helpcenter_1.default.I;
        },
        enumerable: false,
        configurable: true
    });
    SdkWegameFull.prototype.setcustom = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, SdkWegameFull.social.setcustom(params, callback)];
            });
        });
    };
    SdkWegameFull.prototype.addRelation = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, SdkWegameFull.social.addRelation(params, callback)];
            });
        });
    };
    SdkWegameFull.prototype.deleteRelation = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, SdkWegameFull.social.deleteRelation(params, callback)];
            });
        });
    };
    SdkWegameFull.prototype.updateremarks = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, SdkWegameFull.social.updateremarks(params, callback)];
            });
        });
    };
    SdkWegameFull.prototype.hasRelation = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, SdkWegameFull.social.hasRelation(params, callback)];
            });
        });
    };
    SdkWegameFull.prototype.relationList = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, SdkWegameFull.social.relationList(params, callback)];
            });
        });
    };
    SdkWegameFull.prototype.addFriend = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, SdkWegameFull.social.addFriend(params, callback)];
            });
        });
    };
    SdkWegameFull.prototype.delfriend = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, SdkWegameFull.social.delfriend(params, callback)];
            });
        });
    };
    SdkWegameFull.prototype.updatefriendremarks = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, SdkWegameFull.social.updatefriendremarks(params, callback)];
            });
        });
    };
    SdkWegameFull.prototype.isfriend = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, SdkWegameFull.social.isfriend(params, callback)];
            });
        });
    };
    SdkWegameFull.prototype.friends = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, SdkWegameFull.social.friends(callback)];
            });
        });
    };
    SdkWegameFull.prototype.addscore = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, SdkWegameFull.social.addscore(params, callback)];
            });
        });
    };
    SdkWegameFull.prototype.setscore = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, SdkWegameFull.social.setscore(params, callback)];
            });
        });
    };
    SdkWegameFull.prototype.queryuserrank = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, SdkWegameFull.social.queryuserrank(params, callback)];
            });
        });
    };
    SdkWegameFull.prototype.getranklist = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, SdkWegameFull.social.getranklist(params, callback)];
            });
        });
    };
    SdkWegameFull.prototype.friendsrank = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, SdkWegameFull.social.friendsrank(params, callback)];
            });
        });
    };
    SdkWegameFull.prototype.getUserInteractiveStorage = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, SdkWegameFull.social.getUserInteractiveStorage(params, callback)];
            });
        });
    };
    SdkWegameFull.prototype.getGameClubData = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, SdkWegameFull.social.getGameClubData(params, callback)];
            });
        });
    };
    SdkWegameFull.prototype.setUserCloudStorage = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, SdkWegameFull.social.setUserCloudStorage(params, callback)];
            });
        });
    };
    SdkWegameFull.prototype.getUserCloudStorage = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, SdkWegameFull.social.getUserCloudStorage(params, callback)];
            });
        });
    };
    SdkWegameFull.prototype.removeUserCloudStorage = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, SdkWegameFull.social.removeUserCloudStorage(params, callback)];
            });
        });
    };
    SdkWegameFull.prototype.getUserCloudStorageKeys = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, SdkWegameFull.social.getUserCloudStorageKeys(callback)];
            });
        });
    };
    SdkWegameFull.prototype.getFriendCloudStorage = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, SdkWegameFull.social.getFriendCloudStorage(params, callback)];
            });
        });
    };
    SdkWegameFull.prototype.getPotentialFriendList = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, SdkWegameFull.social.getPotentialFriendList(callback)];
            });
        });
    };
    SdkWegameFull.prototype.getHelpcenterMainLayout = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, SdkWegameFull.helpcenter.getHelpcenterMainLayout(callback)];
            });
        });
    };
    SdkWegameFull.prototype.getHelpcenterQuestionLayout = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, SdkWegameFull.helpcenter.getHelpcenterQuestionLayout(params, callback)];
            });
        });
    };
    SdkWegameFull.prototype.getHelpcenterInfoLayout = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, SdkWegameFull.helpcenter.getHelpcenterInfoLayout(params, callback)];
            });
        });
    };
    SdkWegameFull.prototype.helpcenterResolution = function (params, callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, SdkWegameFull.helpcenter.helpcenterResolution(params, callback)];
            });
        });
    };
    return SdkWegameFull;
}(index_wegame_1.default));
exports.default = SdkWegameFull;
//# sourceMappingURL=index.wegame.full.js.map