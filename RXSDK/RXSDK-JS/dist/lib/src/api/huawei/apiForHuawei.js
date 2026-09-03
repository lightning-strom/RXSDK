"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGameAreaListApi = exports.delGameAreaApi = exports.createGameAreaApi = exports.putGameAreaApi = exports.getGameAreaApi = exports.getOperationSceneApi = exports.getPublicProps = exports.getServerTime = exports.getInitConf = exports.schedulingInitApi = exports.schedulingReportApi = exports.checkActivityVersion = exports.checkGameVersion = exports.checkVersionGameLobbyByPost = exports.checkVersionGameLobbyByGet = exports.businessOrderApi = exports.getBusinessRules = exports.activated = exports.mediaCheckAsyncApi = exports.msgSecCheckApi = exports.getUserInfoByFieldApi = exports.getInfoApi = exports.trackApi = exports.getNearlyPeasonByRadius = exports.deleteReportLocation = exports.reportLocationUpdata = exports.updateInfoApi = exports.refreshUserInfo = exports.deregisterCancel = exports.deregister = exports.refreshTokenReq = exports.payCallback = exports.UnbindEmail = exports.bindEmail = exports.unBindPhone = exports.bindPhone = exports.sendCaptcha = exports.orderApi = exports.getAdShareDataApi = exports.getShareDataApi = exports.loginByTokenApi = exports.loginByCredentialApi = exports.exchangePromoterCodeApi = exports.getPromoterCodeApi = exports.postPayData = exports.getNoticeApi = exports.collectPropsApi = exports.getFeedbackDetailApi = exports.getFeedbackListApi = exports.createFeedbackApi = void 0;
exports.tradeQueryApi = exports.getH5LoginConfigApi = exports.getTempNoticeApi = exports.searchGameAccountApi = exports.delEmailApi = exports.receiveEmailApi = exports.getEmailDetailApi = exports.getEmailListApi = exports.itemRedemptionApi = exports.getGameAccountAreaCharacterApi = exports.getGameCharacterApi = exports.getGameCharacterAccountApi = exports.delGameCharacterApi = exports.putGameCharacterApi = exports.createGameCharacterApi = void 0;
var requestForHuawei_1 = require("@/api/huawei/requestForHuawei");
function createFeedbackApi(data) {
    return (0, requestForHuawei_1.doRequest)({
        url: '/v1/feedbackapi/player_feedback/create',
        method: 'POST',
        data: data
    });
}
exports.createFeedbackApi = createFeedbackApi;
function getFeedbackListApi(params) {
    return (0, requestForHuawei_1.doRequest)({
        url: '/v1/feedbackapi/player_feedback/list',
        method: 'GET',
        params: params
    });
}
exports.getFeedbackListApi = getFeedbackListApi;
function getFeedbackDetailApi(params) {
    return (0, requestForHuawei_1.doRequest)({
        url: '/v1/feedbackapi/player_feedback/detail',
        method: 'GET',
        params: params
    });
}
exports.getFeedbackDetailApi = getFeedbackDetailApi;
function collectPropsApi(data) {
    return (0, requestForHuawei_1.doRequest)({
        url: '/v1/feedbackapi/player_feedback/getprop',
        method: 'PUT',
        data: data
    });
}
exports.collectPropsApi = collectPropsApi;
function getNoticeApi(params) {
    return (0, requestForHuawei_1.doRequest)({
        url: '/v1/operationtoolsapi/maintain/get',
        method: 'GET',
        params: params
    });
}
exports.getNoticeApi = getNoticeApi;
var postPayData = function (url, data) {
    return (0, requestForHuawei_1.doRequest)({
        method: 'POST',
        url: url,
        data: data
    });
};
exports.postPayData = postPayData;
function getPromoterCodeApi(game_id) {
    return (0, requestForHuawei_1.doRequest)({
        url: '/v1/operationtoolsapi/exchange/game_display',
        method: 'GET',
        params: { game_id: game_id }
    });
}
exports.getPromoterCodeApi = getPromoterCodeApi;
function exchangePromoterCodeApi(cdkey) {
    return (0, requestForHuawei_1.doRequest)({
        url: '/v1/operationtoolsapi/exchange/exchange',
        method: 'POST',
        data: { cdkey: cdkey }
    });
}
exports.exchangePromoterCodeApi = exchangePromoterCodeApi;
function loginByCredentialApi(data) {
    return (0, requestForHuawei_1.doRequest)({
        url: '/v1/passport/account/login_by_credential',
        method: 'POST',
        data: data
    });
}
exports.loginByCredentialApi = loginByCredentialApi;
function loginByTokenApi(data) {
    return (0, requestForHuawei_1.doRequest)({
        url: '/v1/passport/account/login_by_token',
        method: 'POST',
        data: data
    });
}
exports.loginByTokenApi = loginByTokenApi;
function getShareDataApi(data) {
    return (0, requestForHuawei_1.doRequest)({
        url: '/v1/operationapi/share/data',
        method: 'POST',
        data: data
    });
}
exports.getShareDataApi = getShareDataApi;
function getAdShareDataApi(data) {
    return (0, requestForHuawei_1.doRequest)({
        url: '/v1/operationapi/ad/data',
        method: 'POST',
        data: data
    });
}
exports.getAdShareDataApi = getAdShareDataApi;
function orderApi(data) {
    return (0, requestForHuawei_1.doRequest)({
        url: '/v1/ke/order',
        method: 'POST',
        data: data
    });
}
exports.orderApi = orderApi;
//发送验证码
var sendCaptcha = function (data) {
    return (0, requestForHuawei_1.doRequest)({
        url: '/v1/passport/sms/send_captcha',
        method: 'POST',
        data: data
    });
};
exports.sendCaptcha = sendCaptcha;
//绑定手机
var bindPhone = function (data) {
    return (0, requestForHuawei_1.doRequest)({
        url: '/v1/passport/user/bind_phone',
        method: 'POST',
        data: data
    });
};
exports.bindPhone = bindPhone;
//解绑手机
var unBindPhone = function (data) {
    return (0, requestForHuawei_1.doRequest)({
        url: '/v1/passport/user/unbind_phone',
        method: 'POST',
        data: data
    });
};
exports.unBindPhone = unBindPhone;
//绑定邮箱
var bindEmail = function (data) {
    return (0, requestForHuawei_1.doRequest)({
        url: '/v1/passport/user/bind_email',
        method: 'POST',
        data: data
    });
};
exports.bindEmail = bindEmail;
//解绑邮箱
var UnbindEmail = function (data) {
    return (0, requestForHuawei_1.doRequest)({
        url: '/v1/passport/user/unbind_email',
        method: 'POST',
        data: data
    });
};
exports.UnbindEmail = UnbindEmail;
//客户端支付成功回调给服务端
var payCallback = function (url, data) {
    return (0, requestForHuawei_1.doRequest)({
        method: 'POST',
        url: url,
        data: data
    });
};
exports.payCallback = payCallback;
//刷新token
var refreshTokenReq = function () {
    return (0, requestForHuawei_1.doRequest)({
        method: 'POST',
        url: '/v1/passport/token/refresh'
    });
};
exports.refreshTokenReq = refreshTokenReq;
//申请注销
function deregister(data) {
    return (0, requestForHuawei_1.doRequest)({
        url: '/v1/passport/user/deregister',
        method: 'POST',
        data: data
    });
}
exports.deregister = deregister;
//取消注销
function deregisterCancel() {
    return (0, requestForHuawei_1.doRequest)({
        url: '/v1/passport/user/cancel_deregister',
        method: 'POST'
    });
}
exports.deregisterCancel = deregisterCancel;
//同步用户信息
function refreshUserInfo(data) {
    return (0, requestForHuawei_1.doRequest)({
        url: '/v1/passport/user/sync_info',
        method: 'POST',
        data: data
    });
}
exports.refreshUserInfo = refreshUserInfo;
//修改用户信息
function updateInfoApi(data) {
    return (0, requestForHuawei_1.doRequest)({
        url: '/v1/passport/user/update_info',
        method: 'POST',
        data: data
    });
}
exports.updateInfoApi = updateInfoApi;
function reportLocationUpdata(data) {
    return (0, requestForHuawei_1.doRequest)({
        url: '/v1/social/lbs/update',
        method: 'POST',
        data: data
    });
}
exports.reportLocationUpdata = reportLocationUpdata;
function deleteReportLocation(data) {
    return (0, requestForHuawei_1.doRequest)({
        url: '/v1/social/lbs/delete',
        method: 'POST',
        data: data
    });
}
exports.deleteReportLocation = deleteReportLocation;
function getNearlyPeasonByRadius(data) {
    return (0, requestForHuawei_1.doRequest)({
        url: '/v1/social/lbs/radius',
        method: 'POST',
        data: data
    });
}
exports.getNearlyPeasonByRadius = getNearlyPeasonByRadius;
/**
 export function getOpenID(data: any) {
 return request({
 url: '/Social/User/GetOpenID',
 method: 'POST',
 data,
 })
 }
 */
//上报大数据
var trackApi = function (data) {
    return (0, requestForHuawei_1.doRequest)({
        method: 'POST',
        url: '/v1/data/api/track',
        data: data
    });
};
exports.trackApi = trackApi;
var getInfoApi = function () {
    return (0, requestForHuawei_1.doRequest)({
        method: 'POST',
        url: '/v1/passport/user/get_info'
    });
};
exports.getInfoApi = getInfoApi;
var getUserInfoByFieldApi = function (data) {
    if (data === void 0) { data = {}; }
    return (0, requestForHuawei_1.doRequest)({
        method: 'POST',
        url: '/v1/passport/user/info_by_field',
        data: data
    });
};
exports.getUserInfoByFieldApi = getUserInfoByFieldApi;
var msgSecCheckApi = function (data) {
    return (0, requestForHuawei_1.doRequest)({
        method: 'POST',
        url: '/v1/risk/sensitive/weixin_content/scan',
        data: data
    });
};
exports.msgSecCheckApi = msgSecCheckApi;
var mediaCheckAsyncApi = function (data) {
    return (0, requestForHuawei_1.doRequest)({
        method: 'POST',
        url: '/v1/risk/sensitive/media/check',
        data: data
    });
};
exports.mediaCheckAsyncApi = mediaCheckAsyncApi;
var activated = function (data) {
    return (0, requestForHuawei_1.doRequest)({
        method: 'POST',
        url: '/v1/attribution/user/activated',
        data: data
    });
};
exports.activated = activated;
// 获取商业化弹窗信息
var getBusinessRules = function (version) {
    return (0, requestForHuawei_1.doRequest)({
        url: '/v1/business/rule',
        method: 'GET',
        params: {
            version: version
        }
    });
};
exports.getBusinessRules = getBusinessRules;
// 商业化下单
var businessOrderApi = function (data) {
    return (0, requestForHuawei_1.doRequest)({
        method: 'POST',
        url: '/v1/business/p',
        data: data
    });
};
exports.businessOrderApi = businessOrderApi;
//产品包版本检查
var checkVersionGameLobbyByGet = function (data) {
    return (0, requestForHuawei_1.doRequest)({
        url: "/v1/vcapi/update/".concat(data.productid, "/").concat(data.channelid, "/").concat(data.clientversion, "/").concat(data.devicecode, "/").concat(data.region),
        method: 'GET',
        params: {
            type: data.type,
            format: data.format
        }
    });
};
exports.checkVersionGameLobbyByGet = checkVersionGameLobbyByGet;
//产品包版本检查
var checkVersionGameLobbyByPost = function (data) {
    return (0, requestForHuawei_1.doRequest)({
        url: "/v1/vcapi/update/".concat(data.productid, "/").concat(data.channelid, "/").concat(data.clientversion, "/").concat(data.devicecode, "/").concat(data.region),
        method: 'POST',
        params: {
            type: data.type,
            format: data.format
        },
        data: {
            games: data.games,
            activities: data.activities
        }
    });
};
exports.checkVersionGameLobbyByPost = checkVersionGameLobbyByPost;
//游戏版本检查
var checkGameVersion = function (data) {
    return (0, requestForHuawei_1.doRequest)({
        url: "/v1/vcapi/update_game/".concat(data.gameid, "/").concat(data.gameversion, "/").concat(data.gamecheckversion),
        method: 'GET',
        data: {
            type: data.type,
            format: data.format
        }
    });
};
exports.checkGameVersion = checkGameVersion;
//活动版本检查
var checkActivityVersion = function (data) {
    return (0, requestForHuawei_1.doRequest)({
        url: "/v1/vcapi/update_activity/".concat(data.activityshortname, "/").concat(data.activityversion, "/").concat(data.activitycheckversion),
        method: 'GET',
        data: {
            type: data.type,
            format: data.format
        }
    });
};
exports.checkActivityVersion = checkActivityVersion;
//分享/广告结果上报
var schedulingReportApi = function (data) {
    return (0, requestForHuawei_1.doRequest)({
        url: '/v1/operationapi/scheduling_report',
        method: 'POST',
        data: data
    });
};
exports.schedulingReportApi = schedulingReportApi;
//分享调度初始化
var schedulingInitApi = function (data) {
    return (0, requestForHuawei_1.doRequest)({
        url: '/v1/operationapi/scheduling/init',
        method: 'POST',
        data: data
    });
};
exports.schedulingInitApi = schedulingInitApi;
// 获取公共属性
var getInitConf = function (data) {
    return (0, requestForHuawei_1.doRequest)({
        url: '/v1/sdkconfig/init',
        method: 'POST',
        data: data
    });
};
exports.getInitConf = getInitConf;
// 获取服务器时间（用于刷新 st_offset）
var getServerTime = function (data) {
    return (0, requestForHuawei_1.doRequest)({
        url: '/v1/sdkconfig/detection',
        method: 'POST',
        data: data || {}
    });
};
exports.getServerTime = getServerTime;
// 获取公共属性
var getPublicProps = function (version) {
    return (0, requestForHuawei_1.doRequest)({
        url: '/v1/sdkconfig/sync/event_attrs',
        method: 'GET',
        params: {
            version: version
        }
    });
};
exports.getPublicProps = getPublicProps;
// 获取窗口运营全部配置数据
function getOperationSceneApi() {
    return (0, requestForHuawei_1.doRequest)({
        url: '/v1/operationtoolsapi/user_data_operation_platform/scene/all',
        method: 'POST',
        data: {}
    });
}
exports.getOperationSceneApi = getOperationSceneApi;
// 游戏区服信息查询
function getGameAreaApi(area_id) {
    return (0, requestForHuawei_1.doRequest)({
        url: '/v1/report/sdk/cp/game_area',
        method: 'GET',
        params: {
            area_id: area_id
        }
    });
}
exports.getGameAreaApi = getGameAreaApi;
// 游戏区服信息修改
function putGameAreaApi(data) {
    return (0, requestForHuawei_1.doRequest)({
        url: '/v1/report/sdk/cp/game_area',
        method: 'PUT',
        data: data
    });
}
exports.putGameAreaApi = putGameAreaApi;
// 创建游戏区服
function createGameAreaApi(data) {
    return (0, requestForHuawei_1.doRequest)({
        url: '/v1/report/sdk/cp/game_area',
        method: 'POST',
        data: data
    });
}
exports.createGameAreaApi = createGameAreaApi;
// 删除游戏区服
function delGameAreaApi(data) {
    return (0, requestForHuawei_1.doRequest)({
        url: '/v1/report/sdk/cp/game_area',
        method: 'DELETE',
        data: data
    });
}
exports.delGameAreaApi = delGameAreaApi;
// 查询区服列表信息
function getGameAreaListApi() {
    return (0, requestForHuawei_1.doRequest)({
        url: '/v1/report/sdk/cp/game_area/list',
        method: 'GET'
    });
}
exports.getGameAreaListApi = getGameAreaListApi;
// 创建角色
function createGameCharacterApi(data) {
    return (0, requestForHuawei_1.doRequest)({
        url: '/v1/report/sdk/cp/game_character',
        method: 'POST',
        data: data
    });
}
exports.createGameCharacterApi = createGameCharacterApi;
// 修改游戏角色信息
function putGameCharacterApi(data) {
    return (0, requestForHuawei_1.doRequest)({
        url: '/v1/report/sdk/cp/game_character',
        method: 'PUT',
        data: data
    });
}
exports.putGameCharacterApi = putGameCharacterApi;
// 删除游戏角色
function delGameCharacterApi(data) {
    return (0, requestForHuawei_1.doRequest)({
        url: '/v1/report/sdk/cp/game_character',
        method: 'DELETE',
        data: data
    });
}
exports.delGameCharacterApi = delGameCharacterApi;
// 查询账号下角色信息列表
function getGameCharacterAccountApi(params) {
    return (0, requestForHuawei_1.doRequest)({
        url: '/v1/report/sdk/cp/game_character/account',
        method: 'GET',
        params: params
    });
}
exports.getGameCharacterAccountApi = getGameCharacterAccountApi;
// 查询账号下某个区服下的角色信息列表
function getGameCharacterApi(params) {
    return (0, requestForHuawei_1.doRequest)({
        url: '/v1/report/sdk/cp/game_character/account/area',
        method: 'GET',
        params: params
    });
}
exports.getGameCharacterApi = getGameCharacterApi;
// 查询具体角色信息
function getGameAccountAreaCharacterApi(params) {
    return (0, requestForHuawei_1.doRequest)({
        url: '/v1/report/sdk/cp/game_character/account/area/character',
        method: 'GET',
        params: params
    });
}
exports.getGameAccountAreaCharacterApi = getGameAccountAreaCharacterApi;
// 兑换道具
function itemRedemptionApi(data) {
    return (0, requestForHuawei_1.doRequest)({
        url: '/v1/operationtoolsapi/user_data_operation_platform/item_redemption',
        method: 'POST',
        data: data
    });
}
exports.itemRedemptionApi = itemRedemptionApi;
// 邮件列表
function getEmailListApi(data) {
    return (0, requestForHuawei_1.doRequest)({
        url: '/v1/operationtoolsapi/rxmail/cpuser/list',
        method: 'POST',
        data: data
    });
}
exports.getEmailListApi = getEmailListApi;
// 邮件详情
function getEmailDetailApi(data) {
    return (0, requestForHuawei_1.doRequest)({
        url: '/v1/operationtoolsapi/rxmail/cpuser/detail',
        method: 'POST',
        data: data
    });
}
exports.getEmailDetailApi = getEmailDetailApi;
// 邮件领取
function receiveEmailApi(data) {
    return (0, requestForHuawei_1.doRequest)({
        url: '/v1/operationtoolsapi/rxmail/cpuser/receive',
        method: 'POST',
        data: data
    });
}
exports.receiveEmailApi = receiveEmailApi;
// 邮件删除
function delEmailApi(data) {
    return (0, requestForHuawei_1.doRequest)({
        url: '/v1/operationtoolsapi/rxmail/cpuser/delete',
        method: 'POST',
        data: data
    });
}
exports.delEmailApi = delEmailApi;
function searchGameAccountApi() {
    return (0, requestForHuawei_1.doRequest)({
        url: '/v1/report/sdk/cp_role',
        method: 'get'
    });
}
exports.searchGameAccountApi = searchGameAccountApi;
var getTempNoticeApi = function (product_id, channel_id) {
    return (0, requestForHuawei_1.doRequest)({
        url: "/v1/vcapi/maintain/".concat(product_id, "/").concat(channel_id),
        method: 'GET'
    });
};
exports.getTempNoticeApi = getTempNoticeApi;
var getH5LoginConfigApi = function (product_id, channel_id) {
    return (0, requestForHuawei_1.doRequest)({
        url: "/v1/vcapi/h5_login_config/".concat(product_id, "/").concat(channel_id),
        method: 'GET'
    });
};
exports.getH5LoginConfigApi = getH5LoginConfigApi;
var tradeQueryApi = function (order_no) {
    return (0, requestForHuawei_1.doRequest)({
        url: "/v1/ke/sdk/trade_query",
        method: 'GET',
        params: {
            order_no: order_no
        }
    });
};
exports.tradeQueryApi = tradeQueryApi;
//# sourceMappingURL=apiForHuawei.js.map