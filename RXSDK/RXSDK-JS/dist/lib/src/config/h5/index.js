"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SYSTEM_INFO = void 0;
var getPlatformId = function () {
    var map = { Android: 1, iOS: 2 };
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        return map.iOS;
    }
    if (/Android/i.test(navigator.userAgent)) {
        return map.Android;
    }
};
exports.SYSTEM_INFO = {
    platformid: getPlatformId(),
    fromChannel: 'weile',
};
//# sourceMappingURL=index.js.map