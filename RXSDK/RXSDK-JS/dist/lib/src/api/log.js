"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("@/config");
var SDK_VERSION = config_1.SYSTEM_INFO.__RX_SDK_VERSION;
var logger = null;
var getLogger = function () { return (wx === null || wx === void 0 ? void 0 : wx.getLogManager) ? logger = logger || (wx === null || wx === void 0 ? void 0 : wx.getLogManager({ level: 0 })) : null; };
/**
 * 从基础库2.7.1开始，微信小程序端即可使用实时日志，微信小游戏端则从基础库2.14.4开始支持。
 */
// const realtimeLogger = wx.getRealtimeLogManager ? wx.getRealtimeLogManager() : null
exports.default = {
    info: function (identifier) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        getLogger();
        if (!logger)
            return;
        logger.info.apply(logger, __spreadArray(["[RX_SDK_LOG_".concat(SDK_VERSION, "]"), identifier, " >>> "], args, true));
    },
    warn: function (identifier) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        getLogger();
        if (!logger)
            return;
        logger.warn.apply(logger, __spreadArray(["[RX_SDK_LOG_".concat(SDK_VERSION, "]"), identifier, " >>> "], args, true));
    },
    // error(identifier: string, ...args: any[]) {
    //   if (!logger) return
    //   logger.error.apply(logger, [`[RX_SDK_LOG_${SDK_VERSION}]`, identifier, " >>> ", ...args])
    // },
};
//# sourceMappingURL=log.js.map