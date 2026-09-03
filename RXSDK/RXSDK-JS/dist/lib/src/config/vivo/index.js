"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_INFO = exports.SYSTEM_INFO = void 0;
var utils_1 = require("@/utils/vivo/utils");
var systemInfo = (0, utils_1.getSystemInfo)();
var getPlatformId = function () {
    var map = { android: 1, ios: 2, windows: 3, mac: 4 };
    return map[systemInfo.platform] || 0;
};
exports.SYSTEM_INFO = Object.assign({}, systemInfo, {
    fromChannel: 'minigame',
    platformid: getPlatformId(),
});
exports.USER_INFO = {};
//# sourceMappingURL=index.js.map