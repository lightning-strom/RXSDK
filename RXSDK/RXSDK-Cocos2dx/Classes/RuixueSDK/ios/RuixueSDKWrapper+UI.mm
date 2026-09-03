/**
 * RuixueSDKWrapper+UI.mm
 * 瑞雪 SDK iOS 原生层实现 - UI 模块
 * 
 * 使用 __has_include 检测 RXUIKit 是否可用：
 * - 可用时：正常调用 RXUIKit API
 * - 不可用时：返回模块未引入的错误响应
 */

#include "cocos2d.h"

#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)

#import "RuixueSDKWrapper+UI.h"

// 检测 RXUIKit 是否可用
#if __has_include(<RXUIKit/RXUIKitService.h>)

// ==================== RXUIKit 可用 ====================
#import <RXUIKit/RXUIKitService.h>
#import <RXUIKit/RXUserCenterConfig.h>
#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXSDK_Pure/RXUpdateCheckService.h>

@implementation RuixueSDKWrapper (UI)

- (void)showLoginUIWithParamsJson:(NSString *)paramsJson {
    NSDictionary *params = [self parseJsonString:paramsJson];
    
    NSLog(@"[RuixueSDK] 调用 UI 登录, params=%@", params);
    
    if (!self.initialized) {
        [self callbackWithAction:@"showLoginUI" code:-1 msg:@"SDK 未初始化" data:nil];
        return;
    }
    
    RXLoginUIModel *uiModel = [[RXLoginUIModel alloc] init];
    
    if (params[@"loginOpenid"]) {
        uiModel.loginOpenid = params[@"loginOpenid"];
    }
    
    [[RXUIKitService sharedSDK] showLoginUIWithConfig:uiModel complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (error) {
            NSLog(@"[RuixueSDK] UI 登录失败: %@", error.responesObject);
            if (error.responesObject) {
                [self callbackWithAction:@"showLoginUI" response:error.responesObject];
            } else {
                [self callbackWithAction:@"showLoginUI" code:-1 msg:@"登录失败" data:nil];
            }
            return;
        }
        
        NSLog(@"[RuixueSDK] UI 登录成功: %@", response);
        
        if (response) {
            [self callbackWithAction:@"showLoginUI" response:response];
        } else {
            [self callbackWithAction:@"showLoginUI" code:0 msg:@"登录成功" data:nil];
        }
    }];
}

- (void)showUserCenterWithParamsJson:(NSString *)paramsJson {
    NSDictionary *params = [self parseJsonString:paramsJson];
    
    NSLog(@"[RuixueSDK] 显示用户中心: params=%@", params);
    
    RXUserCenterConfig *config = [[RXUserCenterConfig alloc] init];
    
    if (params[@"game_user_id"]) {
        id gameUserId = params[@"game_user_id"];
        if ([gameUserId isKindOfClass:[NSNumber class]]) {
            config.game_user_id = [gameUserId stringValue];
        } else if ([gameUserId isKindOfClass:[NSString class]]) {
            config.game_user_id = gameUserId;
        }
    }
    
    if (params[@"nickname"] && [params[@"nickname"] isKindOfClass:[NSString class]]) {
        config.nickname = params[@"nickname"];
    }
    
    if (params[@"head_img_url"] && [params[@"head_img_url"] isKindOfClass:[NSString class]]) {
        config.head_img_url = params[@"head_img_url"];
    }
    
    if (params[@"queue_name"] && [params[@"queue_name"] isKindOfClass:[NSString class]]) {
        config.queue_name = params[@"queue_name"];
    } else {
        config.queue_name = @"default";
    }
    
    if (params[@"transmit_args"] && [params[@"transmit_args"] isKindOfClass:[NSString class]]) {
        config.transmit_args = params[@"transmit_args"];
    }
    
    NSArray *btns = params[@"btns"];
    if (btns && [btns isKindOfClass:[NSArray class]]) {
        config.setConfigParams = @{@"btns": btns};
    } else {
        config.setConfigParams = @{@"btns": @[
            @"real_name",
            @"privacy_policy",
            @"acount_cancel",
            @"phone_management",
            @"change_pwd"
        ]};
    }
    
    [[RXUIKitService sharedSDK] userCenterWithConfig:config complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
        if (!error) {
            NSLog(@"[RuixueSDK] 用户中心回调: %@", response);
            if (response) {
                [self callbackWithAction:@"userCenter" response:response];
            } else {
                [self callbackWithAction:@"userCenter" code:0 msg:@"成功" data:nil];
            }
        } else {
            NSLog(@"[RuixueSDK] 用户中心失败: %@", error.responesObject);
            if (error.responesObject) {
                [self callbackWithAction:@"userCenter" response:error.responesObject];
            } else {
                [self callbackWithAction:@"userCenter" code:-1 msg:@"用户中心失败" data:nil];
            }
        }
    }];
}

- (void)showResetPasswordUIWithParamsJson:(NSString *)paramsJson {
    NSDictionary *params = [self parseJsonString:paramsJson];
    
    NSLog(@"[RuixueSDK] 显示找回密码UI: params=%@", params);
    
    [[RXUIKitService sharedSDK] getBackPasswordWithComplete:^(NSDictionary *response, RX_CommonRequestError *error) {
        if (!error) {
            NSLog(@"[RuixueSDK] 找回密码成功: %@", response);
            if (response) {
                [self callbackWithAction:@"resetPassword" response:response];
            } else {
                [self callbackWithAction:@"resetPassword" code:0 msg:@"找回密码成功" data:nil];
            }
        } else {
            NSLog(@"[RuixueSDK] 找回密码失败: %@", error.responesObject);
            if (error.responesObject) {
                [self callbackWithAction:@"resetPassword" response:error.responesObject];
            } else {
                [self callbackWithAction:@"resetPassword" code:-1 msg:@"找回密码失败" data:nil];
            }
        }
    }];
}

- (void)showRealNameAuthUIWithParamsJson:(NSString *)paramsJson {
    NSDictionary *params = [self parseJsonString:paramsJson];
    
    NSLog(@"[RuixueSDK] 显示实名认证UI: params=%@", params);
    
    BOOL canClose = NO;
    if (params[@"cancelable"]) {
        canClose = [params[@"cancelable"] boolValue];
    }
    
    [[RXUIKitService sharedSDK] setRealauthViewWithCanClose:canClose complete:^(NSDictionary *response, RX_CommonRequestError *error) {
        if (!error) {
            NSLog(@"[RuixueSDK] 实名认证成功: %@", response);
            if (response) {
                [self callbackWithAction:@"realNameAuth" response:response];
            } else {
                [self callbackWithAction:@"realNameAuth" code:0 msg:@"实名认证成功" data:nil];
            }
        } else {
            NSLog(@"[RuixueSDK] 实名认证失败: %@", error.responesObject);
            if (error.responesObject) {
                [self callbackWithAction:@"realNameAuth" response:error.responesObject];
            } else {
                [self callbackWithAction:@"realNameAuth" code:-1 msg:@"实名认证失败" data:nil];
            }
        }
    }];
}

- (void)showBindPhoneUI {
    NSLog(@"[RuixueSDK] 显示绑定手机UI");
    
    [[RXUIKitService sharedSDK] bindPhoneWithComplete:^(NSDictionary *response, RX_CommonRequestError *error) {
        if (!error) {
            NSLog(@"[RuixueSDK] 绑定手机成功: %@", response);
            if (response) {
                [self callbackWithAction:@"bindPhone" response:response];
            } else {
                [self callbackWithAction:@"bindPhone" code:0 msg:@"绑定手机成功" data:nil];
            }
        } else {
            NSLog(@"[RuixueSDK] 绑定手机失败: %@", error.responesObject);
            if (error.responesObject) {
                [self callbackWithAction:@"bindPhone" response:error.responesObject];
            } else {
                [self callbackWithAction:@"bindPhone" code:-1 msg:@"绑定手机失败" data:nil];
            }
        }
    }];
}

- (void)showDeleteAccountUIWithParamsJson:(NSString *)paramsJson {
    NSDictionary *params = [self parseJsonString:paramsJson];
    
    NSLog(@"[RuixueSDK] 显示申请注销UI: params=%@", params);
    
    [self callbackWithAction:@"deleteAccount" code:0 msg:@"请在用户中心中申请注销" data:nil];
}

- (void)showCancelDeleteUIWithParamsJson:(NSString *)paramsJson {
    NSDictionary *params = [self parseJsonString:paramsJson];
    
    NSLog(@"[RuixueSDK] 显示撤销注销UI: params=%@", params);
    
    NSString *deregisterType = @"login";
    if (params[@"is_login_continue"]) {
        BOOL isLoginContinue = [params[@"is_login_continue"] boolValue];
        deregisterType = isLoginContinue ? @"login" : @"logout";
    }
    
    [[RXUIKitService sharedSDK] destroyAccountStatusViewWithDeregisterType:deregisterType complete:^(DestroyClickType clickType) {
        if (clickType == DestroyClickType_login) {
            NSLog(@"[RuixueSDK] 用户选择继续登录");
            [self callbackWithAction:@"cancelDelete" code:0 msg:@"撤销成功，继续登录" data:nil];
        } else if (clickType == DestroyClickType_logout) {
            NSLog(@"[RuixueSDK] 用户选择退出登录");
            [self callbackWithAction:@"cancelDelete" code:0 msg:@"撤销成功，退出登录" data:nil];
        }
    }];
}

- (void)showProtocolUIWithParamsJson:(NSString *)paramsJson {
    NSDictionary *params = [self parseJsonString:paramsJson];
    
    NSLog(@"[RuixueSDK] 显示协议页面: params=%@", params);
    
    NSString *key = params[@"key"];
    if (!key || ![key isKindOfClass:[NSString class]]) {
        key = @"00001";
    }
    
    NSArray *keyList = params[@"key_list"];
    if (!keyList || ![keyList isKindOfClass:[NSArray class]] || keyList.count == 0) {
        keyList = @[@"00001", @"00002"];
    }
    
    [[RXUIKitService sharedSDK] setProtocolViewWithKey:key keyList:keyList];
}

- (void)showAntiAddictionUIWithParamsJson:(NSString *)paramsJson {
    NSDictionary *params = [self parseJsonString:paramsJson];
    
    NSLog(@"[RuixueSDK] 显示防沉迷提示: params=%@", params);
    
    NSString *title = params[@"title"];
    if (!title || ![title isKindOfClass:[NSString class]]) {
        title = @"防沉迷提示";
    }
    
    NSString *content = params[@"content"];
    if (!content || ![content isKindOfClass:[NSString class]]) {
        content = @"根据国家相关规定，您的游戏时间已到限制。";
    }
    
    NSString *btnText = params[@"btn_text"];
    if (!btnText || ![btnText isKindOfClass:[NSString class]]) {
        btnText = @"知道了";
    }
    
    [[RXUIKitService sharedSDK] setAntiAdditionViewWithTitle:title
                                                         des:content
                                                    btnTitle:btnText
                                                    complete:^{
        NSLog(@"[RuixueSDK] 防沉迷弹窗确认");
        [self callbackWithAction:@"antiAddiction" code:0 msg:@"用户确认" data:nil];
    }];
}

- (void)showMailCenterUIWithParamsJson:(NSString *)paramsJson {
    NSDictionary *params = [self parseJsonString:paramsJson];
    
    NSLog(@"[RuixueSDK] 显示邮件中心: params=%@", params);
    
    NSString *cpUserId = params[@"cp_user_id"];
    if (!cpUserId || ![cpUserId isKindOfClass:[NSString class]]) {
        cpUserId = @"";
    }
    
    [[RXUIKitService sharedSDK] showEmailViewWithCpUserId:cpUserId withComplete:^(NSDictionary *response, RX_CommonRequestError *error) {
        if (error) {
            NSLog(@"[RuixueSDK] 邮件中心错误: %@", error.msg);
            [self callbackWithAction:@"mailCenter" code:-1 msg:error.msg ?: @"邮件中心错误" data:nil];
        } else {
            NSLog(@"[RuixueSDK] 邮件中心操作完成: %@", response);
            if (response) {
                [self callbackWithAction:@"mailCenter" response:response];
            } else {
                [self callbackWithAction:@"mailCenter" code:0 msg:@"邮件中心已关闭" data:nil];
            }
        }
    }];
}

- (void)showAnnouncementUIWithParamsJson:(NSString *)paramsJson {
    NSDictionary *params = [self parseJsonString:paramsJson];
    
    NSLog(@"[RuixueSDK] 显示公告页面: params=%@", params);
    
    int limit = 10;
    if (params[@"limit"] && [params[@"limit"] isKindOfClass:[NSNumber class]]) {
        limit = [params[@"limit"] intValue];
    }
    
    [[RXUIKitService sharedSDK] showAnnounceViewWithLimit:limit linkCallBack:^(NSString *link) {
        NSLog(@"[RuixueSDK] 公告链接点击: %@", link);
        NSDictionary *data = @{@"link": link ?: @""};
        [self callbackWithAction:@"announcement" code:0 msg:@"链接点击" data:data];
    } isHasCallBack:^(BOOL isHas) {
        NSLog(@"[RuixueSDK] 是否有公告: %@", isHas ? @"是" : @"否");
        NSDictionary *data = @{@"has_notice": @(isHas)};
        [self callbackWithAction:@"announcement" code:0 msg:isHas ? @"有公告" : @"无公告" data:data];
    }];
}

- (void)showVersionUpdateUIWithParamsJson:(NSString *)paramsJson {
    NSDictionary *params = [self parseJsonString:paramsJson];
    
    NSLog(@"[RuixueSDK] 显示版本更新: params=%@", params);
    
    NSString *version = params[@"version"];
    if (!version || ![version isKindOfClass:[NSString class]]) {
        version = @"1.0.0";
    }
    
    NSString *region = params[@"region"];
    if (!region || ![region isKindOfClass:[NSString class]]) {
        region = @"150000";
    }
    
    BOOL showUI = YES;
    if (params[@"show_ui"] && [params[@"show_ui"] isKindOfClass:[NSNumber class]]) {
        showUI = [params[@"show_ui"] boolValue];
    }
    
    [[RXUpdateCheckService sharedSDK] checkUpdate_AppWithRegion:region
                                                 client_version:version
                                                          games:nil
                                                     activities:nil
                                                           type:@"json"
                                                           json:@"{\"type\":\"json\"}"
                                                         isShow:showUI
                                                   linkCallBack:^(NSString *link) {
        NSLog(@"[RuixueSDK] 版本更新链接点击: %@", link);
        NSDictionary *data = @{@"link": link ?: @""};
        [self callbackWithAction:@"versionUpdate" code:0 msg:@"链接点击" data:data];
    } complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (error) {
            NSLog(@"[RuixueSDK] 版本更新失败: %@", error.responesObject);
            [self callbackWithAction:@"versionUpdate" code:(int)error.code msg:error.msg ?: @"检查失败" data:nil];
        } else {
            NSLog(@"[RuixueSDK] 版本更新成功: %@", response);
            [self callbackWithAction:@"versionUpdate" code:0 msg:@"检查成功" data:response];
        }
    }];
}

- (void)showHelpCenterUIWithParamsJson:(NSString *)paramsJson {
    NSDictionary *params = [self parseJsonString:paramsJson];
    
    NSLog(@"[RuixueSDK] 显示帮助中心: params=%@", params);
    
    RXUserCenterConfig *config = [[RXUserCenterConfig alloc] init];
    
    if (params[@"game_user_id"] && [params[@"game_user_id"] isKindOfClass:[NSString class]]) {
        config.game_user_id = params[@"game_user_id"];
    } else if (params[@"game_user_id"] && [params[@"game_user_id"] isKindOfClass:[NSNumber class]]) {
        config.game_user_id = [params[@"game_user_id"] stringValue];
    }
    
    if (params[@"nickname"] && [params[@"nickname"] isKindOfClass:[NSString class]]) {
        config.nickname = params[@"nickname"];
    }
    
    if (params[@"queue_name"] && [params[@"queue_name"] isKindOfClass:[NSString class]]) {
        config.queue_name = params[@"queue_name"];
    } else {
        config.queue_name = @"default";
    }
    
    [[RXUIKitService sharedSDK] serviceCenterWithConfig:config complete:^(NSDictionary *response, RX_CommonRequestError *error) {
        if (error) {
            NSLog(@"[RuixueSDK] 帮助中心失败: %@", error.responesObject);
            [self callbackWithAction:@"helpCenter" code:(int)error.code msg:error.msg ?: @"失败" data:nil];
        } else {
            NSLog(@"[RuixueSDK] 帮助中心回调: %@", response);
            [self callbackWithAction:@"helpCenter" code:0 msg:@"成功" data:response];
        }
    }];
}

@end

#else

// ==================== RXUIKit 不可用 - Stub 实现 ====================

@implementation RuixueSDKWrapper (UI)

#define UI_NOT_AVAILABLE_MSG @"UI module not available. Please add RXUIKit pod."

- (void)showLoginUIWithParamsJson:(NSString *)paramsJson {
    [self callbackWithAction:@"showLoginUI" code:-2 msg:UI_NOT_AVAILABLE_MSG data:nil];
}

- (void)showUserCenterWithParamsJson:(NSString *)paramsJson {
    [self callbackWithAction:@"userCenter" code:-2 msg:UI_NOT_AVAILABLE_MSG data:nil];
}

- (void)showResetPasswordUIWithParamsJson:(NSString *)paramsJson {
    [self callbackWithAction:@"resetPassword" code:-2 msg:UI_NOT_AVAILABLE_MSG data:nil];
}

- (void)showRealNameAuthUIWithParamsJson:(NSString *)paramsJson {
    [self callbackWithAction:@"realNameAuth" code:-2 msg:UI_NOT_AVAILABLE_MSG data:nil];
}

- (void)showBindPhoneUI {
    [self callbackWithAction:@"bindPhone" code:-2 msg:UI_NOT_AVAILABLE_MSG data:nil];
}

- (void)showDeleteAccountUIWithParamsJson:(NSString *)paramsJson {
    [self callbackWithAction:@"deleteAccount" code:-2 msg:UI_NOT_AVAILABLE_MSG data:nil];
}

- (void)showCancelDeleteUIWithParamsJson:(NSString *)paramsJson {
    [self callbackWithAction:@"cancelDelete" code:-2 msg:UI_NOT_AVAILABLE_MSG data:nil];
}

- (void)showProtocolUIWithParamsJson:(NSString *)paramsJson {
    NSLog(@"[RuixueSDK] %@", UI_NOT_AVAILABLE_MSG);
}

- (void)showAntiAddictionUIWithParamsJson:(NSString *)paramsJson {
    [self callbackWithAction:@"antiAddiction" code:-2 msg:UI_NOT_AVAILABLE_MSG data:nil];
}

- (void)showMailCenterUIWithParamsJson:(NSString *)paramsJson {
    [self callbackWithAction:@"mailCenter" code:-2 msg:UI_NOT_AVAILABLE_MSG data:nil];
}

- (void)showAnnouncementUIWithParamsJson:(NSString *)paramsJson {
    [self callbackWithAction:@"announcement" code:-2 msg:UI_NOT_AVAILABLE_MSG data:nil];
}

- (void)showVersionUpdateUIWithParamsJson:(NSString *)paramsJson {
    [self callbackWithAction:@"versionUpdate" code:-2 msg:UI_NOT_AVAILABLE_MSG data:nil];
}

- (void)showHelpCenterUIWithParamsJson:(NSString *)paramsJson {
    [self callbackWithAction:@"helpCenter" code:-2 msg:UI_NOT_AVAILABLE_MSG data:nil];
}

@end

#endif // __has_include(<RXUIKit/RXUIKitService.h>)

#endif // CC_TARGET_PLATFORM == CC_PLATFORM_IOS
