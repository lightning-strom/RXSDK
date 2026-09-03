"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.opendataAesdecodeApi = exports.friendsrankApi = exports.getranklistApi = exports.queryuserrankApi = exports.setscoreApi = exports.addscoreApi = exports.friendsApi = exports.isfriendApi = exports.updatefriendremarksApi = exports.delfriendApi = exports.addfriendApi = exports.relationListApi = exports.hasrelationApi = exports.updateremarksApi = exports.deleteRelationApi = exports.addRelationApi = exports.setcustomApi = void 0;
var request_1 = require("../request");
var setcustomApi = function (data) {
    return (0, request_1.doRequest)({
        url: '/v1/social/user/setcustom',
        method: 'POST',
        data: data,
    });
};
exports.setcustomApi = setcustomApi;
var addRelationApi = function (data) {
    return (0, request_1.doRequest)({
        url: '/v1/social/relation/add',
        method: 'POST',
        data: data,
    });
};
exports.addRelationApi = addRelationApi;
var deleteRelationApi = function (data) {
    return (0, request_1.doRequest)({
        url: '/v1/social/relation/delete',
        method: 'POST',
        data: data,
    });
};
exports.deleteRelationApi = deleteRelationApi;
var updateremarksApi = function (data) {
    return (0, request_1.doRequest)({
        url: '/v1/social/relation/updateremarks',
        method: 'POST',
        data: data,
    });
};
exports.updateremarksApi = updateremarksApi;
var hasrelationApi = function (data) {
    return (0, request_1.doRequest)({
        url: '/v1/social/relation/hasrelation',
        method: 'POST',
        data: data,
    });
};
exports.hasrelationApi = hasrelationApi;
var relationListApi = function (data) {
    return (0, request_1.doRequest)({
        url: '/v1/social/relation/list',
        method: 'POST',
        data: data,
    });
};
exports.relationListApi = relationListApi;
var addfriendApi = function (data) {
    return (0, request_1.doRequest)({
        url: '/v1/social/relation/addfriend',
        method: 'POST',
        data: data,
    });
};
exports.addfriendApi = addfriendApi;
var delfriendApi = function (data) {
    return (0, request_1.doRequest)({
        url: '/v1/social/relation/delfriend',
        method: 'POST',
        data: data,
    });
};
exports.delfriendApi = delfriendApi;
var updatefriendremarksApi = function (data) {
    return (0, request_1.doRequest)({
        url: '/v1/social/relation/updatefriendremarks',
        method: 'POST',
        data: data,
    });
};
exports.updatefriendremarksApi = updatefriendremarksApi;
var isfriendApi = function (data) {
    return (0, request_1.doRequest)({
        url: '/v1/social/relation/isfriend',
        method: 'POST',
        data: data,
    });
};
exports.isfriendApi = isfriendApi;
var friendsApi = function () {
    return (0, request_1.doRequest)({
        url: '/v1/social/relation/friends',
        method: 'POST',
    });
};
exports.friendsApi = friendsApi;
var addscoreApi = function (data) {
    return (0, request_1.doRequest)({
        url: '/v1/social/rank/addscore',
        method: 'POST',
        data: data,
    });
};
exports.addscoreApi = addscoreApi;
var setscoreApi = function (data) {
    return (0, request_1.doRequest)({
        url: '/v1/social/rank/setscore',
        method: 'POST',
        data: data,
    });
};
exports.setscoreApi = setscoreApi;
var queryuserrankApi = function (data) {
    return (0, request_1.doRequest)({
        url: '/v1/social/rank/queryuserrank',
        method: 'POST',
        data: data,
    });
};
exports.queryuserrankApi = queryuserrankApi;
var getranklistApi = function (data) {
    return (0, request_1.doRequest)({
        url: '/v1/social/rank/getranklist',
        method: 'POST',
        data: data,
    });
};
exports.getranklistApi = getranklistApi;
var friendsrankApi = function (data) {
    return (0, request_1.doRequest)({
        url: '/v1/social/rank/friendsrank',
        method: 'POST',
        data: data,
    });
};
exports.friendsrankApi = friendsrankApi;
var opendataAesdecodeApi = function (data) {
    return (0, request_1.doRequest)({
        url: '/v1/social/wxrank/aesdecode',
        method: 'POST',
        data: data,
    });
};
exports.opendataAesdecodeApi = opendataAesdecodeApi;
//# sourceMappingURL=index.js.map