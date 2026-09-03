"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_INFO = exports.SYSTEM_INFO = void 0;
var utils_1 = require("@/utils/qq/utils");
var systemInfo = (0, utils_1.getSystemInfo)();
var getPlatformId = function () {
    var map = { Android: 1, iOS: 2 };
    return (systemInfo.system && map[systemInfo.system.split(' ')[0]]) || 0;
};
exports.SYSTEM_INFO = Object.assign({}, systemInfo, {
    fromChannel: 'qq',
    platformid: getPlatformId(),
});
exports.USER_INFO = {};
//# sourceMappingURL=index.js.map