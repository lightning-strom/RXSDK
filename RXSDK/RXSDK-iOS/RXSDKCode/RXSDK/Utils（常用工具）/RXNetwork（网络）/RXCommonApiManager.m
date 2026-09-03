//
//  RXApiManager.m
//  OverseaSocialApp
//
//  Created by 陈汉 on 2021/4/15.
//

#import "RXCommonApiManager.h"

@implementation RXCommonApiManager

// 法务信息 url
+ (NSString *)getCommonConfigUrl
{
    return @"v1/operationapi/legal";
}

// 登录 url
+ (NSString *)getLoginUrl
{
    return @"v1/passport/account/login_by_credential";
}

// 二次登录 url
+ (NSString *)getQuickLoginUrl
{
    return @"v1/passport/account/login_by_token";
}

// 刷新token url
+ (NSString *)getRefreshTokenUrl
{
    return @"v1/passport/token/refresh";
}

// 绑定邮箱 url
+ (NSString *)getBindingEmailUrl
{
    return @"v1/passport/user/bind_email";
}

// 解绑邮箱 url
+ (NSString *)getReliveBindingEmailUrl
{
    return @"v1/passport/user/unbind_email";
}

// 绑定手机 url
+ (NSString *)getBindingPhoneUrl
{
    return @"v1/passport/user/bind_phone";
}

// 解绑手机 url
+ (NSString *)getReliveBindingPhoneUrl
{
    return @"v1/passport/user/unbind_phone";
}

// 注册 url
+ (NSString *)getRegistUrl
{
    return @"v1/passport/account/register";
}

// 获取验证码 url
+ (NSString *)getCaptchaUrl
{
    return @"v1/passport/captcha/send";
}

// 实名认证 url
+ (NSString *)getApproveUrl
{
    return @"v1/passport/user/realauth";
}

// 获取用户信息 url
+ (NSString *)getUserInfoUrl
{
    return @"v1/passport/user/get_info";
}

// 修改用户信息 url
+ (NSString *)getUpdateUserInfoUrl
{
    return @"v1/passport/user/update_info";
}

// 修改密码 url
+ (NSString *)getUpdatePasswordUrl
{
    return @"v1/passport/user/change_password";
}

// 重置密码 url
+ (NSString *)getResetPasswordUrl
{
    return @"v1/passport/account/reset_password";
}

// 上报定位 url
+ (NSString *)getReportLocationUrl
{
    return @"v1/social/lbs/update";
}

// 删除定位 url
+ (NSString *)getDeleteLocationUrl
{
    return @"v1/social/lbs/delete";
}

// 获取附近人 url
+ (NSString *)getRadiusAccountUrl
{
    return @"v1/social/lbs/radius";
}

// 设置用户自定义信息
+ (NSString *)getSetUserCustomUrl
{
    return @"v1/user/setcustom";
}

// 添加自定义关系 url
+ (NSString *)getAddRelationUrl
{
    return @"v1/social/relation/add";
}

// 删除自定义关系 url
+ (NSString *)getDeleteRelationUrl
{
    return @"v1/social/relation/delete";
}

// 更新自定关系备注 url
+ (NSString *)getUpdateRemarkUrl
{
    return @"v1/social/relation/updateremarks";
}

// 获取自定关系列表 url
+ (NSString *)getRelationListUrl
{
    return @"v1/social/relation/list";
}

// 添加好友 url
+ (NSString *)getAddFriendUrl
{
    return @"v1/social/relation/addfriend";
}

// 删除好友 url
+ (NSString *)getDeleteFriendUrl
{
    return @"v1/social/relation/delfriend";
}

// 更新好友备注 url
+ (NSString *)getUpdateFriendRemarkUrl
{
    return @"v1/relation/updatefriendremarks";
}

// 获取好友列表 url
+ (NSString *)getFriendListUrl
{
    return @"v1/social/relation/friends";
}

// 创建排行榜 url
+ (NSString *)getCreateRankUrl
{
    return @"v1/social/rank/create";
}

// 获取排行榜 url
+ (NSString *)getRankListUrl
{
    return @"v1/social/rank/list";
}

// 上报排行榜分数
+ (NSString *)getReportRankScoreUrl
{
    return @"v1/social/rank/report";
}

// 获取openId url
+ (NSString *)getOpenIdUrl
{
    return @"v1/social/user/getopenid";
}

// 获取分享信息 url
+ (NSString *)getShareInfoUrl
{
    return @"v1/operationapi/share/data";
}

// 大厅更新检查 url
+ (NSString *)getCheckUpdate_appUrl
{
    return @"v1/vcapi/update";
}

// 活动更新检查 url
+ (NSString *)getCheckUpdate_activityUrl
{
    return @"v1/vcapi/update_activity";
}

// 游戏更新检查 url
+ (NSString *)getCheckUpdate_gameUrl
{
    return @"v1/vcapi/update_game";
}

// 申请注销账号 url
+ (NSString *)getDestroyAccountUrl
{
    return @"v1/passport/user/deregister";
}

// 撤销注销申请 url
+ (NSString *)getRepealDestroyAccountUrl
{
    return @"v1/passport/user/cancel_deregister";
}

// 上传推送配置 url
+ (NSString *)getUploadPushInfoUrl
{
    return @"pusher/device/binddevice";
}

// 绑定别名 url
+ (NSString *)getBindingPushAliasUrl
{
    return @"pusher/device/bindalias";
}

// 增加用户标签 url
+ (NSString *)getAddTagsPushUrl
{
    return @"pusher/device/addtags";
}

// 移除用户标签 url
+ (NSString *)getDeleteTagsPushUrl
{
    return @"pusher/device/deltags";
}

// 解绑用户与渠道SDK的关联
+ (NSString *)getReliveBindingPushDeviceUrl
{
    return @"pusher/device/unbinddevice";
}

// 推送日志上报 url
+ (NSString *)getReportPushLogUrl
{
    return @"pusher/notify/device";
}

// 数据埋点 url
+ (NSString *)getReportLogUrl
{
    return @"v1/data/api/track";
}

// 下单 url
+ (NSString *)getPayOrderInfoUrl
{
    return @"v1/ke/order";
}

// 获取通路配置 url
+ (NSString *)getSharePlatformsUrl
{
    return @"v1/operationapi/share/platforms";
}

// 获取用户激活 url
+ (NSString *)getActivatedUrl
{
    return @"v1/attribution/user/activated";
}

// 获取判断两用户是否为好友 url
+ (NSString *)getIsfriendUrl
{
    return @"v1/social/relation/isfriend";
}

// 获取判断两用户是否存在某自定关系 url
+ (NSString *)getHasRelationUrl
{
    return @"v1/social/relation/hasrelation";
}

// 获取ip url
+ (NSString *)getIP
{
    return @"getip";
}

@end
