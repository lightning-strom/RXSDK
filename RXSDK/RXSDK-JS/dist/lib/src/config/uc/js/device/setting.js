"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSystemInfoSync = exports.getSystemInfo = void 0;
var uc = window.uc || null;
/**
 * 获取系统设备信息
 * */
var getSystemInfo = function () {
    if (!uc)
        return Promise.reject();
    return new Promise(function (resolve, reject) {
        uc.getSystemInfo({
            success: function (data) { return resolve(data); },
            fail: function (data) { return reject(data); },
        });
    });
};
exports.getSystemInfo = getSystemInfo;
/**
 * 获取系统设备信息(同步)
 * */
var getSystemInfoSync = function () {
    if (!uc)
        return false;
    try {
        var data = uc.getSystemInfoSync();
        return JSON.parse(data);
    }
    catch (err) {
        /** */
    }
    return false;
};
exports.getSystemInfoSync = getSystemInfoSync;
//# sourceMappingURL=setting.js.map