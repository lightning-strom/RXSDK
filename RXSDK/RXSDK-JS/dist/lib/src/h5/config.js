"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_INFO = exports.SYSTEM_INFO = exports.getSystemInfo = void 0;
var utils_1 = require("@/h5/utils");
var getSystemInfo = function () {
    switch (process.env.TYPE) {
        case 'h5_uc':
            return (0, utils_1.getUCSystemInfoSync)();
        default:
            return {};
    }
};
exports.getSystemInfo = getSystemInfo;
var systemInfo = (0, exports.getSystemInfo)();
var getPlatformId = function () {
    var map = { android: 1, ios: 2, windows: 3, mac: 4 };
    return map[systemInfo.platform] || 0;
};
exports.SYSTEM_INFO = Object.assign(exports.getSystemInfo, {
    fromChannel: 'minigame',
    platformid: getPlatformId()
});
exports.USER_INFO = {};
//# sourceMappingURL=config.js.map