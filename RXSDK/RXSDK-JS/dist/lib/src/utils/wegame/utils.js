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
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeStorageByPrefix = exports.listenVisibilityChange = exports.getSearchQueries = exports.getSystemInfo = void 0;
var utils_1 = require("@/utils/utils");
var is_1 = require("@/utils/is");
var getSystemInfo = function () {
    try {
        if (typeof window !== 'undefined' && !window.wx)
            return {
                system: '',
            };
        return wx.getSystemInfoSync();
    }
    catch (e) {
        return {};
    }
};
exports.getSystemInfo = getSystemInfo;
function getSearchQueries(ifStringify) {
    var _a = wx.getLaunchOptionsSync(), query = _a.query, extraData = _a.referrerInfo.extraData;
    extraData = extraData || {};
    query = __assign(__assign({}, query), extraData);
    return ifStringify ? utils_1.qs.stringify(query) : query;
}
exports.getSearchQueries = getSearchQueries;
/**
 * @name listenVisibilityChange
 * @desc 监听显示/隐藏
 */
var listenVisibilityChange = function (callbak) {
    wx.onShow(function () {
        callbak(true);
    });
    wx.onHide(function () {
        callbak(false);
    });
};
exports.listenVisibilityChange = listenVisibilityChange;
/**
 * @name removeStorageByPrefix
 * @desc 删除指定前缀的storage缓存
 */
var removeStorageByPrefix = function (prefix, predict) {
    var info = wx.getStorageInfoSync();
    // console.log('wx.getStorageInfoSync: ', info)
    var targetKeys = info.keys.filter(function (key) { return (0, is_1.isFunction)(predict) ? predict(key) : key.startsWith(prefix); });
    targetKeys.forEach(function (key) { return wx.removeStorageSync(key); });
};
exports.removeStorageByPrefix = removeStorageByPrefix;
//# sourceMappingURL=utils.js.map