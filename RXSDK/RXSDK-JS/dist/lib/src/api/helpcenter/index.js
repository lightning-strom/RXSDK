"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postResolutionApi = exports.getInfolayoutApi = exports.getListlayoutApi = exports.getMainlayoutApi = void 0;
var request_1 = require("../request");
// 获取帮助中心首页信息
var getMainlayoutApi = function () {
    return (0, request_1.doRequest)({
        url: '/v1/service/helpcenter/mainlayout',
        method: 'GET',
    });
};
exports.getMainlayoutApi = getMainlayoutApi;
// 获取帮助中心问题一级列表页
var getListlayoutApi = function (params) {
    return (0, request_1.doRequest)({
        url: '/v1/service/helpcenter/listlayout',
        method: 'GET',
        params: params,
    });
};
exports.getListlayoutApi = getListlayoutApi;
// 获取帮助中心问题详情
var getInfolayoutApi = function (params) {
    return (0, request_1.doRequest)({
        url: '/v1/service/helpcenter/infolayout',
        method: 'GET',
        params: params,
    });
};
exports.getInfolayoutApi = getInfolayoutApi;
// 设置帮助中心问题解决状态
var postResolutionApi = function (data) {
    return (0, request_1.doRequest)({
        url: '/v1/service/helpcenter/resolution',
        method: 'POST',
        data: data,
    });
};
exports.postResolutionApi = postResolutionApi;
//# sourceMappingURL=index.js.map