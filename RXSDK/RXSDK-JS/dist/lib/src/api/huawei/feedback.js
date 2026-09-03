"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedbackEvalApi = exports.createFeedbackApi = exports.getFeedbackApi = void 0;
var requestForHuawei_1 = require("./requestForHuawei");
var getFeedbackApi = function () {
    return (0, requestForHuawei_1.doRequest)({
        url: '/v1/feedbackapi/kind/list',
        method: 'GET',
    });
};
exports.getFeedbackApi = getFeedbackApi;
var createFeedbackApi = function (data) {
    return (0, requestForHuawei_1.doRequest)({
        url: '/v1/feedbackapi/player/create',
        method: 'POST',
        data: data,
    });
};
exports.createFeedbackApi = createFeedbackApi;
var feedbackEvalApi = function (data) {
    return (0, requestForHuawei_1.doRequest)({
        url: '/v1/feedbackapi/pleased/update',
        method: 'POST',
        data: data
    });
};
exports.feedbackEvalApi = feedbackEvalApi;
//# sourceMappingURL=feedback.js.map