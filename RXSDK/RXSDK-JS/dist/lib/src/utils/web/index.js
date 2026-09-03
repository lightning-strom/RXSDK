"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listenVisibilityChange = exports.getSearchQueries = exports.setSystemInfo = void 0;
var config_1 = require("@/config");
var utils_1 = require("@/utils/utils");
var setSystemInfo = function (info) {
    var appVersion = window.navigator.appVersion;
    var map = {
        Android: 1,
        Mac: 2,
    };
    Object.assign(config_1.SYSTEM_INFO, {
        platformid: map[appVersion.replace(/^\S.*?(Android|Mac).*?\S$/g, '$1')] || 0
    }, info);
};
exports.setSystemInfo = setSystemInfo;
/**
 * @name getSearchQueries
 * @desc 解析并存储 URL 参数
 */
var getSearchQueries = function (isString) {
    var search = window.location.search.slice(1);
    return (isString ? search : utils_1.qs.parse(search));
};
exports.getSearchQueries = getSearchQueries;
/**
 * @name listenVisibilityChange
 * @desc 监听显示/隐藏
 */
var listenVisibilityChange = function (callbak) {
    document.addEventListener('visibilitychange', function () {
        callbak(!document.hidden);
    }, false);
};
exports.listenVisibilityChange = listenVisibilityChange;
//# sourceMappingURL=index.js.map