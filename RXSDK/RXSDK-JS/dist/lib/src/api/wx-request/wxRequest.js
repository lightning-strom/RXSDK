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
var utils_1 = require("./utils");
function wxRequest(config) {
    var _a = config.baseURL, baseURL = _a === void 0 ? '' : _a, _b = config.url, url = _b === void 0 ? '' : _b, headers = config.headers, _c = config.data, data = _c === void 0 ? {} : _c;
    config.header = config.headers;
    delete config.headers;
    var computedConfig = __assign(__assign({}, (baseURL && {
        // url: combineUrl(url, baseURL),
        url: (0, utils_1.buildURL)((0, utils_1.buildFullPath)(baseURL, url), config.params, config.paramsSerializer),
    })), { data: data });
    config = (0, utils_1.mergeConfig)(config, computedConfig);
    console.info('======================');
    console.info('wxAxios wx.request config:', config);
    return new Promise(function (resolve, reject) {
        wx.request(__assign(__assign({}, config), { success: function (res) {
                console.info('======================');
                console.info('wxAxios wx.request success res:', res);
                return resolve(res);
            }, fail: function (reason) {
                console.info('======================');
                console.info('wxAxios wx.request fail reason:', reason);
                return reject(reason);
            } }));
    });
}
exports.default = wxRequest;
//# sourceMappingURL=wxRequest.js.map