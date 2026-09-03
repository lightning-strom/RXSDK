"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_INFO = exports.SYSTEM_INFO = exports.getSystemInfo = void 0;
var getSystemInfo = function () {
    switch (process.env.TYPE) {
        case 'baidu':
            if (typeof window !== 'undefined' && !window.swan)
                return {
                    system: ''
                };
            return swan.getSystemInfoSync();
        case 'alipay':
            if (typeof window !== 'undefined' && !window.my)
                return {
                    system: ''
                };
            return my.getSystemInfoSync();
        case 'taobao':
            if (typeof window !== 'undefined' && !window.my)
                return {
                    system: ''
                };
            return my.getSystemInfoSync();
        case 'ks':
            if (typeof window !== 'undefined' && !window.ks)
                return {
                    system: ''
                };
            return ks.getSystemInfoSync();
        case 'jd':
            if (typeof window !== 'undefined' && !window.ks)
                return {
                    system: ''
                };
            return jd.getSystemInfoSync();
        case 'bilibili':
            if (typeof window !== 'undefined' && !window.bl)
                return {
                    system: ''
                };
            return bl.getSystemInfoSync();
        case 'douyin':
            if (typeof window !== 'undefined' && !window.tt)
                return {
                    system: ''
                };
            return tt.getSystemInfoSync();
        case 'gamebox':
            if (typeof window !== 'undefined' && !window.gamebox)
                return {
                    system: ''
                };
            return gamebox.getSystemInfoSync();
        case '4399':
            if (typeof window !== 'undefined' && !window.gamebox)
                return {
                    system: ''
                };
            return gamebox.getSystemInfoSync();
        case 'meituan':
            if (typeof window !== 'undefined' && !window.wx)
                return {
                    system: ''
                };
            return wx.getSystemInfoSync();
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