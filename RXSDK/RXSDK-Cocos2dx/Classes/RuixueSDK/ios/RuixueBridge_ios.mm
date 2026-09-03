/**
 * RuixueBridge_ios.mm
 * 瑞雪 SDK iOS 平台实现 - Objective-C++ 桥接
 * 
 * 模块化设计：
 * - 核心方法（含 IAP 支付、分享）直接调用 RuixueSDKWrapper（必选，基础库自带）
 * - UI 可选模块通过 @try/@catch 安全调用
 *   模块未编译时方法调用会抛出 NSInvalidArgumentException，
 *   catch 后返回模块不可用的错误 JSON，不会崩溃。
 */

#include "cocos2d.h"

#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)

#include "../RuixueBridge.h"
#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "RuixueSDKWrapper.h"

// 条件引入可选模块 Category 头文件
#import "RuixueSDKWrapper+UI.h"

// 模块不可用时的错误响应
static const char* MODULE_NOT_AVAILABLE_UI = R"({"code":-2,"msg":"UI module not available. Please add RXUIKit pod.","data":{}})";

namespace ruixue {

// ==================== 核心模块 ====================

void RuixueBridge::init(const std::string& paramsJson, ResultCallback callback) {
    _initCallback = callback;
    
    NSString* nsParamsJson = [NSString stringWithUTF8String:paramsJson.c_str()];
    [[RuixueSDKWrapper sharedInstance] initWithParamsJson:nsParamsJson];
}

void RuixueBridge::initThirdSdk(const std::string& paramsJson, ResultCallback callback) {
    if (callback) {
        callback(R"({"code":2001,"msg":"Third-party channel initialization is not supported on iOS","data":{}})");
    }
}

void RuixueBridge::login(const std::string& paramsJson, ResultCallback callback) {
    _loginCallback = callback;
    
    NSString* nsParamsJson = [NSString stringWithUTF8String:paramsJson.c_str()];
    [[RuixueSDKWrapper sharedInstance] loginWithParamsJson:nsParamsJson];
}

void RuixueBridge::logout(ResultCallback callback) {
    _logoutCallback = callback;
    _loggedIn = false;
    _userId = "";
    _token = "";
    
    [[RuixueSDKWrapper sharedInstance] logout];
}

void RuixueBridge::exitApp(ResultCallback callback) {
    if (callback) {
        callback(R"({"code":-2,"msg":"exitApp is not supported on iOS","data":{}})");
    }
}

void RuixueBridge::getUserInfo(ResultCallback callback) {
    _userInfoCallback = callback;
    
    [[RuixueSDKWrapper sharedInstance] getUserInfo];
}

void RuixueBridge::getUserInfoByField(const std::string& paramsJson, ResultCallback callback) {
    _userInfoByFieldCallback = callback;
    
    NSString* nsParamsJson = [NSString stringWithUTF8String:paramsJson.c_str()];
    [[RuixueSDKWrapper sharedInstance] getUserInfoByFieldWithParamsJson:nsParamsJson];
}

std::string RuixueBridge::getDeviceInfo() {
    NSString* deviceInfo = [[RuixueSDKWrapper sharedInstance] getDeviceInfo];
    return deviceInfo ? std::string([deviceInfo UTF8String]) : "{}";
}

float RuixueBridge::getTopSafeArea() {
    return 0.0f;
}


// ==================== UI 模块（可选） ====================

void RuixueBridge::showLoginUI(const std::string& paramsJson, ResultCallback callback) {
    _loginCallback = callback;
    
    RuixueSDKWrapper* wrapper = [RuixueSDKWrapper sharedInstance];
    @try {
        NSString* nsParamsJson = [NSString stringWithUTF8String:paramsJson.c_str()];
        [wrapper showLoginUIWithParamsJson:nsParamsJson];
    } @catch (NSException *exception) {
        CCLOG("RuixueBridge::showLoginUI: UI module not available");
        callback(MODULE_NOT_AVAILABLE_UI);
    }
}

void RuixueBridge::showUserCenter(const std::string& paramsJson, ResultCallback callback) {
    _userCenterCallback = callback;
    
    RuixueSDKWrapper* wrapper = [RuixueSDKWrapper sharedInstance];
    @try {
        NSString* nsParamsJson = [NSString stringWithUTF8String:paramsJson.c_str()];
        [wrapper showUserCenterWithParamsJson:nsParamsJson];
    } @catch (NSException *exception) {
        callback(MODULE_NOT_AVAILABLE_UI);
    }
}

void RuixueBridge::showResetPasswordUI(const std::string& paramsJson, ResultCallback callback) {
    _resetPasswordCallback = callback;
    
    RuixueSDKWrapper* wrapper = [RuixueSDKWrapper sharedInstance];
    @try {
        NSString* nsParamsJson = [NSString stringWithUTF8String:paramsJson.c_str()];
        [wrapper showResetPasswordUIWithParamsJson:nsParamsJson];
    } @catch (NSException *exception) {
        callback(MODULE_NOT_AVAILABLE_UI);
    }
}

void RuixueBridge::showRealNameAuthUI(const std::string& paramsJson, ResultCallback callback) {
    _realNameAuthCallback = callback;
    
    RuixueSDKWrapper* wrapper = [RuixueSDKWrapper sharedInstance];
    @try {
        NSString* nsParamsJson = [NSString stringWithUTF8String:paramsJson.c_str()];
        [wrapper showRealNameAuthUIWithParamsJson:nsParamsJson];
    } @catch (NSException *exception) {
        callback(MODULE_NOT_AVAILABLE_UI);
    }
}

void RuixueBridge::showBindPhoneUI(ResultCallback callback) {
    _bindPhoneCallback = callback;
    
    RuixueSDKWrapper* wrapper = [RuixueSDKWrapper sharedInstance];
    @try {
        [wrapper showBindPhoneUI];
    } @catch (NSException *exception) {
        callback(MODULE_NOT_AVAILABLE_UI);
    }
}

void RuixueBridge::showDeleteAccountUI(const std::string& paramsJson, ResultCallback callback) {
    _deleteAccountCallback = callback;
    
    RuixueSDKWrapper* wrapper = [RuixueSDKWrapper sharedInstance];
    @try {
        NSString* nsParamsJson = [NSString stringWithUTF8String:paramsJson.c_str()];
        [wrapper showDeleteAccountUIWithParamsJson:nsParamsJson];
    } @catch (NSException *exception) {
        callback(MODULE_NOT_AVAILABLE_UI);
    }
}

void RuixueBridge::showCancelDeleteUI(const std::string& paramsJson, ResultCallback callback) {
    _cancelDeleteCallback = callback;
    
    RuixueSDKWrapper* wrapper = [RuixueSDKWrapper sharedInstance];
    @try {
        NSString* nsParamsJson = [NSString stringWithUTF8String:paramsJson.c_str()];
        [wrapper showCancelDeleteUIWithParamsJson:nsParamsJson];
    } @catch (NSException *exception) {
        callback(MODULE_NOT_AVAILABLE_UI);
    }
}

void RuixueBridge::showProtocolUI(const std::string& paramsJson) {
    RuixueSDKWrapper* wrapper = [RuixueSDKWrapper sharedInstance];
    @try {
        NSString* nsParamsJson = [NSString stringWithUTF8String:paramsJson.c_str()];
        [wrapper showProtocolUIWithParamsJson:nsParamsJson];
    } @catch (NSException *exception) {
        CCLOG("RuixueBridge::showProtocolUI: UI module not available");
    }
}

void RuixueBridge::showAntiAddictionUI(const std::string& paramsJson, ResultCallback callback) {
    _antiAddictionCallback = callback;
    
    RuixueSDKWrapper* wrapper = [RuixueSDKWrapper sharedInstance];
    @try {
        NSString* nsParamsJson = [NSString stringWithUTF8String:paramsJson.c_str()];
        [wrapper showAntiAddictionUIWithParamsJson:nsParamsJson];
    } @catch (NSException *exception) {
        callback(MODULE_NOT_AVAILABLE_UI);
    }
}

void RuixueBridge::showMailCenterUI(const std::string& paramsJson, ResultCallback callback) {
    _mailCenterCallback = callback;
    
    RuixueSDKWrapper* wrapper = [RuixueSDKWrapper sharedInstance];
    @try {
        NSString* nsParamsJson = [NSString stringWithUTF8String:paramsJson.c_str()];
        [wrapper showMailCenterUIWithParamsJson:nsParamsJson];
    } @catch (NSException *exception) {
        callback(MODULE_NOT_AVAILABLE_UI);
    }
}

void RuixueBridge::showAnnouncementUI(const std::string& paramsJson, ResultCallback callback) {
    _announcementCallback = callback;
    
    RuixueSDKWrapper* wrapper = [RuixueSDKWrapper sharedInstance];
    @try {
        NSString* nsParamsJson = [NSString stringWithUTF8String:paramsJson.c_str()];
        [wrapper showAnnouncementUIWithParamsJson:nsParamsJson];
    } @catch (NSException *exception) {
        callback(MODULE_NOT_AVAILABLE_UI);
    }
}

void RuixueBridge::showVersionUpdateUI(const std::string& paramsJson, ResultCallback callback) {
    _versionUpdateCallback = callback;
    
    RuixueSDKWrapper* wrapper = [RuixueSDKWrapper sharedInstance];
    @try {
        NSString* nsParamsJson = [NSString stringWithUTF8String:paramsJson.c_str()];
        [wrapper showVersionUpdateUIWithParamsJson:nsParamsJson];
    } @catch (NSException *exception) {
        callback(MODULE_NOT_AVAILABLE_UI);
    }
}

void RuixueBridge::updateGameVersion(const std::string& paramsJson, ResultCallback callback) {
    _updateGameVersionCallback = callback;

    NSString* nsParamsJson = [NSString stringWithUTF8String:paramsJson.c_str()];
    [[RuixueSDKWrapper sharedInstance] updateGameVersionWithParamsJson:nsParamsJson];
}

void RuixueBridge::showHelpCenterUI(const std::string& paramsJson, ResultCallback callback) {
    _helpCenterCallback = callback;
    
    RuixueSDKWrapper* wrapper = [RuixueSDKWrapper sharedInstance];
    @try {
        NSString* nsParamsJson = [NSString stringWithUTF8String:paramsJson.c_str()];
        [wrapper showHelpCenterUIWithParamsJson:nsParamsJson];
    } @catch (NSException *exception) {
        callback(MODULE_NOT_AVAILABLE_UI);
    }
}

// ==================== 支付模块（IAP，基础库自带） ====================

void RuixueBridge::pay(const std::string& paramsJson, ResultCallback callback) {
    NSData* data = [[NSString stringWithUTF8String:paramsJson.c_str()]
        dataUsingEncoding:NSUTF8StringEncoding];
    NSDictionary* params = data
        ? [NSJSONSerialization JSONObjectWithData:data options:0 error:nil]
        : nil;
    if ([params isKindOfClass:[NSDictionary class]] &&
        [params[@"payType"] isEqualToString:@"xy"]) {
        if (callback) {
            callback(R"({"code":4001,"msg":"XingYi payment is not supported on iOS"})");
        }
        return;
    }

    _payCallback = callback;
    
    RuixueSDKWrapper* wrapper = [RuixueSDKWrapper sharedInstance];
    NSString* nsParamsJson = [NSString stringWithUTF8String:paramsJson.c_str()];
    [wrapper payWithParamsJson:nsParamsJson];
}

// ==================== 分享模块（基础库自带） ====================

void RuixueBridge::share(const std::string& paramsJson, ResultCallback callback) {
    _shareCallback = callback;
    
    RuixueSDKWrapper* wrapper = [RuixueSDKWrapper sharedInstance];
    NSString* nsParamsJson = [NSString stringWithUTF8String:paramsJson.c_str()];
    [wrapper shareWithParamsJson:nsParamsJson];
}

void RuixueBridge::shareCustom(const std::string& paramsJson, ResultCallback callback) {
    _shareCustomCallback = callback;
    
    RuixueSDKWrapper* wrapper = [RuixueSDKWrapper sharedInstance];
    NSString* nsParamsJson = [NSString stringWithUTF8String:paramsJson.c_str()];
    [wrapper shareCustomWithParamsJson:nsParamsJson];
}

void RuixueBridge::openCustomerService() {
    // TODO: 调用瑞雪 SDK 客服功能
    CCLOG("RuixueBridge::openCustomerService: not implemented");
}

// ==================== 账号扩展（基础库自带） ====================

#define IOS_BRIDGE_CALL_STRING(sel, field) \
    field = callback; \
    RuixueSDKWrapper* w = [RuixueSDKWrapper sharedInstance]; \
    NSString* ns = [NSString stringWithUTF8String:paramsJson.c_str()]; \
    [w sel:ns];

#define IOS_BRIDGE_CALL_VOID(sel, field) \
    field = callback; \
    RuixueSDKWrapper* w = [RuixueSDKWrapper sharedInstance]; \
    [w sel];

void RuixueBridge::registerAccount(const std::string& paramsJson, ResultCallback callback) {
    IOS_BRIDGE_CALL_STRING(registerAccountWithParamsJson, _registerCallback)
}

void RuixueBridge::sendCaptcha(const std::string& paramsJson, ResultCallback callback) {
    IOS_BRIDGE_CALL_STRING(sendCaptchaWithParamsJson, _sendCaptchaCallback)
}

void RuixueBridge::realAuth(const std::string& paramsJson, ResultCallback callback) {
    IOS_BRIDGE_CALL_STRING(realAuthWithParamsJson, _realAuthCallback)
}

void RuixueBridge::getIIFAARedirectURL(const std::string& paramsJson, ResultCallback callback) {
    IOS_BRIDGE_CALL_STRING(getIIFAARedirectURLWithParamsJson, _getIIFAARedirectURLCallback)
}

void RuixueBridge::searchBindingAccounts(ResultCallback callback) {
    IOS_BRIDGE_CALL_VOID(searchBindingAccounts, _searchBindingCallback)
}

// ==================== 游戏区服/角色（基础库自带） ====================

void RuixueBridge::createGameArea(const std::string& paramsJson, ResultCallback callback) {
    IOS_BRIDGE_CALL_STRING(createGameAreaWithParamsJson, _createGameAreaCallback)
}

void RuixueBridge::searchGameAreaList(ResultCallback callback) {
    IOS_BRIDGE_CALL_VOID(searchGameAreaList, _searchGameAreaListCallback)
}

void RuixueBridge::searchGameAreaInfo(const std::string& paramsJson, ResultCallback callback) {
    IOS_BRIDGE_CALL_STRING(searchGameAreaInfoWithParamsJson, _searchGameAreaInfoCallback)
}

void RuixueBridge::createGameCharacter(const std::string& paramsJson, ResultCallback callback) {
    IOS_BRIDGE_CALL_STRING(createGameCharacterWithParamsJson, _createGameCharacterCallback)
}

void RuixueBridge::searchGameCharacterList(const std::string& paramsJson, ResultCallback callback) {
    IOS_BRIDGE_CALL_STRING(searchGameCharacterListWithParamsJson, _searchCharacterListCallback)
}

void RuixueBridge::searchGameCharacterInfo(const std::string& paramsJson, ResultCallback callback) {
    IOS_BRIDGE_CALL_STRING(searchGameCharacterInfoWithParamsJson, _searchCharacterInfoCallback)
}

void RuixueBridge::updateGameCharacter(const std::string& paramsJson, ResultCallback callback) {
    IOS_BRIDGE_CALL_STRING(updateGameCharacterWithParamsJson, _updateCharacterCallback)
}

void RuixueBridge::deleteGameCharacter(const std::string& paramsJson, ResultCallback callback) {
    IOS_BRIDGE_CALL_STRING(deleteGameCharacterWithParamsJson, _deleteCharacterCallback)
}

void RuixueBridge::setGameInfo(const std::string& paramsJson, ResultCallback callback) {
    NSString *json = [NSString stringWithUTF8String:paramsJson.c_str()];
    RuixueSDKWrapper *wrapper = [RuixueSDKWrapper sharedInstance];
    NSDictionary *params = [wrapper parseJsonString:json];
    NSString *roleId = [params[@"roleId"] isKindOfClass:[NSString class]]
        ? params[@"roleId"] : [params[@"roleId"] description];
    NSString *serverId = [params[@"serverId"] isKindOfClass:[NSString class]]
        ? params[@"serverId"] : [params[@"serverId"] description];
    [wrapper setGameInfoWithRoleId:roleId ?: @"" serverId:serverId ?: @"default"];
    if (callback) {
        callback(R"({"code":0,"msg":"Game info set successfully","data":{}})");
    }
}

void RuixueBridge::invokeChannelAction(const std::string& action,
                                       const std::string& paramsJson,
                                       ResultCallback callback) {
    (void)action;
    (void)paramsJson;
    if (callback) {
        callback(R"({"code":-2,"msg":"Channel actions are not supported on iOS","data":{}})");
    }
}

// ==================== GDT 转化归因 ====================

void RuixueBridge::gdtRegisterSdk() {
    [[RuixueSDKWrapper sharedInstance] gdtRegisterSdk];
}

void RuixueBridge::gdtInitialize(const std::string& actionSetId, const std::string& secretKey,
                                 const std::string& channel, const std::string& channelId) {
    (void)channel;
    (void)channelId;
    [[RuixueSDKWrapper sharedInstance]
        gdtInitializeWithActionSetId:[NSString stringWithUTF8String:actionSetId.c_str()]
                          secretKey:[NSString stringWithUTF8String:secretKey.c_str()]];
}

void RuixueBridge::gdtReportRegister(const std::string& method, bool success) {
    [[RuixueSDKWrapper sharedInstance]
        gdtReportRegisterWithMethod:[NSString stringWithUTF8String:method.c_str()]
                            success:success];
}

void RuixueBridge::gdtReportLogin(const std::string& method, bool success) {
    [[RuixueSDKWrapper sharedInstance]
        gdtReportLoginWithMethod:[NSString stringWithUTF8String:method.c_str()]
                         success:success];
}

void RuixueBridge::gdtReportCreateRole(const std::string& role) {
    [[RuixueSDKWrapper sharedInstance]
        gdtReportCreateRole:[NSString stringWithUTF8String:role.c_str()]];
}

void RuixueBridge::gdtReportCheckout(const std::string& type, const std::string& name,
                                     const std::string& contentId, int number,
                                     bool isVirtualCurrency,
                                     const std::string& virtualCurrencyType,
                                     const std::string& currency, bool success) {
    [[RuixueSDKWrapper sharedInstance]
        gdtReportCheckoutWithType:[NSString stringWithUTF8String:type.c_str()]
                            name:[NSString stringWithUTF8String:name.c_str()]
                       contentId:[NSString stringWithUTF8String:contentId.c_str()]
                          number:number
                 virtualCurrency:isVirtualCurrency
             virtualCurrencyType:[NSString stringWithUTF8String:virtualCurrencyType.c_str()]
                        currency:[NSString stringWithUTF8String:currency.c_str()]
                         success:success];
}

void RuixueBridge::gdtReportPurchase(const std::string& goodsType,
                                     const std::string& goodsName,
                                     const std::string& goodsId, int number,
                                     const std::string& goodsChannel,
                                     const std::string& currency,
                                     int valueInCents, bool success) {
    [[RuixueSDKWrapper sharedInstance]
        gdtReportPurchaseWithType:[NSString stringWithUTF8String:goodsType.c_str()]
                            name:[NSString stringWithUTF8String:goodsName.c_str()]
                       contentId:[NSString stringWithUTF8String:goodsId.c_str()]
                          number:number
                         channel:[NSString stringWithUTF8String:goodsChannel.c_str()]
                        currency:[NSString stringWithUTF8String:currency.c_str()]
                    valueInCents:valueInCents
                         success:success];
}

void RuixueBridge::gdtReportQuestFinish(const std::string& id, const std::string& type,
                                        const std::string& name, int number,
                                        const std::string& description, bool success) {
    [[RuixueSDKWrapper sharedInstance]
        gdtReportQuestFinishWithId:[NSString stringWithUTF8String:id.c_str()]
                             type:[NSString stringWithUTF8String:type.c_str()]
                             name:[NSString stringWithUTF8String:name.c_str()]
                           number:number
                      description:[NSString stringWithUTF8String:description.c_str()]
                          success:success];
}

void RuixueBridge::gdtReportShare(const std::string& channel, bool success) {
    [[RuixueSDKWrapper sharedInstance]
        gdtReportShareWithChannel:[NSString stringWithUTF8String:channel.c_str()]
                         success:success];
}

void RuixueBridge::gdtReportUpdateLevel(int level) {
    [[RuixueSDKWrapper sharedInstance] gdtReportUpdateLevel:level];
}

void RuixueBridge::gdtReportRateApp(float value) {
    [[RuixueSDKWrapper sharedInstance] gdtReportRateApp:value];
}

void RuixueBridge::gdtReportViewContent(const std::string& type, const std::string& name,
                                        const std::string& contentId) {
    [[RuixueSDKWrapper sharedInstance]
        gdtReportViewContentWithType:[NSString stringWithUTF8String:type.c_str()]
                               name:[NSString stringWithUTF8String:name.c_str()]
                          contentId:[NSString stringWithUTF8String:contentId.c_str()]];
}

void RuixueBridge::gdtReportAddToCart(const std::string& type, const std::string& name,
                                      const std::string& contentId, int number, bool success) {
    [[RuixueSDKWrapper sharedInstance]
        gdtReportAddToCartWithType:[NSString stringWithUTF8String:type.c_str()]
                             name:[NSString stringWithUTF8String:name.c_str()]
                        contentId:[NSString stringWithUTF8String:contentId.c_str()]
                           number:number
                          success:success];
}

// ==================== 数据埋点（基础库自带） ====================

void RuixueBridge::getDistinctId(ResultCallback callback) {
    IOS_BRIDGE_CALL_VOID(getDistinctId, _getDistinctIdCallback)
}

void RuixueBridge::dataTrack(const std::string& paramsJson, ResultCallback callback) {
    IOS_BRIDGE_CALL_STRING(dataTrackWithParamsJson, _dataTrackCallback)
}

void RuixueBridge::trackUserAction(const std::string& paramsJson, ResultCallback callback) {
    IOS_BRIDGE_CALL_STRING(trackUserActionWithParamsJson, _trackUserActionCallback)
}

// ==================== 运营功能（基础库自带） ====================

void RuixueBridge::createFeedback(const std::string& paramsJson, ResultCallback callback) {
    IOS_BRIDGE_CALL_STRING(createFeedbackWithParamsJson, _createFeedbackCallback)
}

void RuixueBridge::getTempNotice(ResultCallback callback) {
    IOS_BRIDGE_CALL_VOID(getTempNotice, _tempNoticeCallback)
}

void RuixueBridge::getUnreadMessageCount(ResultCallback callback) {
    IOS_BRIDGE_CALL_VOID(getUnreadMessageCount, _unreadMsgCountCallback)
}

void RuixueBridge::getPromoDisplayKey(ResultCallback callback) {
    IOS_BRIDGE_CALL_VOID(getPromoDisplayKey, _promoDisplayKeyCallback)
}

} // namespace ruixue

#endif // CC_TARGET_PLATFORM == CC_PLATFORM_IOS
