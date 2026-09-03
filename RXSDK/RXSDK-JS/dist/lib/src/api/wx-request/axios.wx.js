"use strict";
/**
 * Axios.js
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
var wxRequest_1 = require("./wxRequest");
var defaults_1 = require("./defaults");
var utils_1 = require("./utils");
var InterceptorManager_1 = require("./InterceptorManager");
var WxAxios = /** @class */ (function () {
    function WxAxios(config) {
        if (config === void 0) { config = defaults_1.default; }
        this.defaults = config;
        this.interceptors = {
            request: new InterceptorManager_1.default(),
            response: new InterceptorManager_1.default(),
        };
    }
    WxAxios.prototype.get = function (url, config) {
        if (config === void 0) { config = {}; }
        var _config = __assign(__assign({}, config), { url: url, method: 'GET' });
        return this.request(_config);
    };
    WxAxios.prototype.post = function (url, data, config) {
        if (data === void 0) { data = {}; }
        if (config === void 0) { config = {}; }
        var _config = __assign(__assign({}, config), { url: url, data: data, method: 'POST' });
        return this.request(_config);
    };
    WxAxios.prototype.request = function (config) {
        // Allow for axios('example/url'[, config]) a la fetch API
        if (typeof config === 'string') {
            config = arguments[1] || {};
            config.url = arguments[0];
        }
        else {
            config = config || {};
        }
        config = (0, utils_1.mergeConfig)(this.defaults, config);
        // Set config.method
        if (config.method) {
            config.method = config.method.toLowerCase();
        }
        else if (this.defaults.method) {
            config.method = this.defaults.method.toLowerCase();
        }
        else {
            config.method = 'GET';
        }
        // filter out skipped interceptors
        var chain = [this.dispatchRequest, undefined];
        var promise = Promise.resolve(config);
        this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
            chain.unshift(interceptor.fulfilled, interceptor.rejected);
        });
        this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
            chain.push(interceptor.fulfilled, interceptor.rejected);
        });
        while (chain.length) {
            promise = promise.then(chain.shift(), chain.shift());
        }
        return promise;
    };
    // _request(config: WXRequestConfig = {}): WXRequestPromise<any> {
    //   const { baseURL = '', url = '', headers, data = {} } = config
    //   console.log('wx.request raw config:', headers)
    //   const computedConfig = {
    //     ...(baseURL && {
    //       url: combineUrl(url, baseURL),
    //     }),
    //     header: {
    //       ...headers,
    //     },
    //     data,
    //   }
    //   console.log('wx.request computedConfig:', computedConfig)
    //   config = mergeConfig(config, computedConfig)
    //   console.log('wx.request config:', config)
    //   return wxRequest(config)
    // }
    WxAxios.prototype.dispatchRequest = function (config) {
        if (config === void 0) { config = {}; }
        return (0, wxRequest_1.default)(config).then(function onAdapterResolution(response) {
            var _response = (0, utils_1.transformResponse)(response, config);
            console.info('======================');
            console.log('wxAxios request transformResponse: ', _response);
            return _response;
        }, function onAdapterRejection(reason) {
            var _error = (0, utils_1.transformError)(reason, config);
            console.info('======================');
            console.log('wxAxios request transformError: ', _error);
            return Promise.reject(_error);
        });
    };
    return WxAxios;
}());
exports.default = WxAxios;
//# sourceMappingURL=axios.wx.js.map