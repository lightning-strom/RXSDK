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
exports.setupStOffsetRefreshForMiniGame = exports.setupStOffsetRefreshForH5 = exports.refreshStOffset = exports.updateStOffsetWithServerTime = void 0;
var config_1 = require("@/config");
/**
 * 根据服务器时间字符串计算并刷新 st_offset
 */
var updateStOffsetWithServerTime = function (serverTime) {
    if (!serverTime)
        return;
    var serverTimeNum = Number(serverTime);
    if (!serverTimeNum || isNaN(serverTimeNum))
        return;
    config_1.SYSTEM_INFO.st_offset = String(serverTimeNum - Date.now());
};
exports.updateStOffsetWithServerTime = updateStOffsetWithServerTime;
/**
 * 调用 /v1/sdkconfig/detection 接口刷新 st_offset
 * 各入口按需注入自己的 api 函数（普通包 / 华为包）
 */
var refreshStOffset = function (getServerTimeApi) { return __awaiter(void 0, void 0, void 0, function () {
    var res, serverTime, err_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, getServerTimeApi()];
            case 1:
                res = _b.sent();
                serverTime = (_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.time;
                (0, exports.updateStOffsetWithServerTime)(serverTime);
                return [3 /*break*/, 3];
            case 2:
                err_1 = _b.sent();
                console.warn('refreshStOffset failed', err_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.refreshStOffset = refreshStOffset;
var stOffsetRegistered = false;
/**
 * H5：初始化成功后注册页面可见性监听
 * 切到前台（visibilitychange 且可见）时调用接口刷新 st_offset
 */
var setupStOffsetRefreshForH5 = function (getServerTimeApi) {
    if (stOffsetRegistered)
        return;
    if (typeof document === 'undefined' || typeof document.addEventListener !== 'function')
        return;
    stOffsetRegistered = true;
    document.addEventListener('visibilitychange', function () {
        if (!document.hidden) {
            (0, exports.refreshStOffset)(getServerTimeApi);
        }
    }, false);
};
exports.setupStOffsetRefreshForH5 = setupStOffsetRefreshForH5;
/**
 * 小游戏：初始化成功后注册 onShow 监听
 * 切到前台时调用接口刷新 st_offset
 */
var setupStOffsetRefreshForMiniGame = function (platformGlobal, getServerTimeApi) {
    if (stOffsetRegistered)
        return;
    if (!platformGlobal || typeof platformGlobal.onShow !== 'function')
        return;
    stOffsetRegistered = true;
    platformGlobal.onShow(function () {
        (0, exports.refreshStOffset)(getServerTimeApi);
    });
};
exports.setupStOffsetRefreshForMiniGame = setupStOffsetRefreshForMiniGame;
//# sourceMappingURL=stOffset.js.map