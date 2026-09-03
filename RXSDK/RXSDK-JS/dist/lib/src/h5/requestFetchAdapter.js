"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var buildUrl = function (url, params, paramsSerializer) {
    if (!params)
        return url;
    var query = paramsSerializer
        ? paramsSerializer(params)
        : Object.keys(params)
            .filter(function (key) { return params[key] !== undefined && params[key] !== null; })
            .map(function (key) { return "".concat(encodeURIComponent(key), "=").concat(encodeURIComponent(params[key])); })
            .join('&');
    if (!query)
        return url;
    return "".concat(url).concat(url.includes('?') ? '&' : '?').concat(query);
};
var normalizeHeaders = function (headers) {
    if (headers === void 0) { headers = {}; }
    var result = {};
    Object.keys(headers).forEach(function (key) {
        if (headers[key] !== undefined && headers[key] !== null) {
            result[key] = headers[key];
        }
    });
    return result;
};
function fetchAdapter(config) {
    return new Promise(function (resolve, reject) {
        if (typeof fetch === 'undefined') {
            reject(new Error('fetch is not supported'));
            return;
        }
        var method = (config.method || 'get').toUpperCase();
        var isGetLike = method === 'GET' || method === 'HEAD';
        var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
        var timer = config.timeout && controller
            ? setTimeout(function () { return controller.abort(); }, config.timeout)
            : null;
        var url = buildUrl(config.url, config.params, config.paramsSerializer);
        var requestOptions = {
            method: method,
            headers: normalizeHeaders(config.headers),
            body: isGetLike ? undefined : config.data,
            credentials: config.withCredentials ? 'include' : 'same-origin',
            signal: controller ? controller.signal : undefined
        };
        fetch(url, requestOptions).then(function (response) {
            if (timer)
                clearTimeout(timer);
            var responseHeaders = {};
            response.headers.forEach(function (value, key) {
                responseHeaders[key] = value;
            });
            return response.text().then(function (data) {
                var axiosResponse = {
                    data: data,
                    status: response.status,
                    statusText: response.statusText,
                    headers: responseHeaders,
                    config: config,
                    request: requestOptions
                };
                var validateStatus = config.validateStatus;
                if (!response.status || !validateStatus || validateStatus(response.status)) {
                    resolve(axiosResponse);
                }
                else {
                    var error = new Error("Request failed with status code ".concat(response.status));
                    error.config = config;
                    error.request = requestOptions;
                    error.response = axiosResponse;
                    error.isAxiosError = true;
                    reject(error);
                }
            });
        }).catch(function (error) {
            if (timer)
                clearTimeout(timer);
            var normalizedError = new Error((error === null || error === void 0 ? void 0 : error.name) === 'AbortError' ? 'timeout' : ((error === null || error === void 0 ? void 0 : error.message) || 'Network Error'));
            normalizedError.config = config;
            normalizedError.request = requestOptions;
            normalizedError.code = (error === null || error === void 0 ? void 0 : error.name) === 'AbortError' ? 'ECONNABORTED' : error === null || error === void 0 ? void 0 : error.code;
            normalizedError.isAxiosError = true;
            reject(normalizedError);
        });
    });
}
exports.default = fetchAdapter;
//# sourceMappingURL=requestFetchAdapter.js.map