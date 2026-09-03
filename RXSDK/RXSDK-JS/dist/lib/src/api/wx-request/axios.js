"use strict";
/**
 * 基于wx.request封装的类axios请求
 * wx.request 的配置、axios的调用方式
 * @config 配置参数说明 --> ./defaults.js
 * @api axios(config) - 默认get
 */
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
var axios_wx_1 = require("./axios.wx");
var utils_1 = require("./utils");
function createInstance(defaultConfig) {
    console.log('createWxRequestInstance');
    var context = new axios_wx_1.default(defaultConfig);
    var instance = (0, utils_1.bind)(axios_wx_1.default.prototype.request, context);
    // Copy axios.prototype to instance
    (0, utils_1.extend)(instance, axios_wx_1.default.prototype, context);
    // Copy context to instance
    (0, utils_1.extend)(instance, context);
    return instance;
}
var wxAxios = new axios_wx_1.default();
wxAxios.create = function create(instanceConfig) {
    return createInstance(__assign(__assign({}, wxAxios.defaults), instanceConfig));
};
exports.default = wxAxios;
//# sourceMappingURL=axios.js.map