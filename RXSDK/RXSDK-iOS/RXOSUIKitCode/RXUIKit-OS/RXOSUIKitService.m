//
//  RXOSUIKitService.m
//  RXUIKit-OS
//
//  Created by 陈汉 on 2023/6/15.
//

#import "RXOSUIKitService.h"
#import "RXOSCommonHeader.h"
#import "RXOSLoginView.h"
#import "RXOSAddLoginView.h"
#import "RXOSPrivacyView.h"
#import "RXOSApproveView.h"
#import "RXOSRegistView.h"
#import "RXOSDestroyAccountView.h"
#import "RXOSGetBackPasswordView.h"
#import "RXOSHistoryLoginView.h"
#import "RXOSUserCenterView.h"
#import "RXOSLoginViewManager.h"
#import "RXOSSetPasswordView.h"
#import "RXOSLegalModel.h"
#import "RXOSQuickLoginView.h"
#import "RXOSWebViewController.h"
//#import "RXSView.h"

#import "NSObject+RXOSAdditon.h"
#import "RXOSMoreLoginView.h"
#import "RXOSPriView.h"
#import "RXCountryList.h"
#import "RXOSCommonWKWebView.h"
#import "RXOSWKController.h"
//#import "RXOSServiceCenterView.h"
#import "RXOSAntiAddictionView.h"
#import "RXOSEmailLoginView.h"
#import "RXOSEmailListView.h"
#import "RXOSAnnouncementView.h"
//#import "RXOSFeedbackListView.h"
//#import "RXOSFeedbackUploadView.h"
#import <RXSDK_Pure/RXNotificationCenter.h>
#import <RXSDK_Pure/RXSubPackage.h>

typedef NSDictionary * (^LoginEventBlock)(NSDictionary *loginEvent, LoginType loginType);
typedef void(^AnnounceBlock)(NSString *link);

@interface RXOSUIKitService ()

@property (nonatomic, strong) NSTimer *timer;
@property (nonatomic, strong) RXOSAddLoginView *addLoginView;
@property (nonatomic, strong) RXOSQuickLoginView *loginView;
@property (nonatomic, strong) RXOSHistoryLoginView *historyView;
@property (nonatomic, strong) RXOSWKController *serviceCenter;
@property (nonatomic, strong) RXOSWKController *chatService;
@property (nonatomic, copy) LoginEventBlock loginEventBlock;
@property (nonatomic, strong) RXOSEmailListView *emailListView;
@property (nonatomic, strong) RXOSAnnouncementView *announcementView;
//@property (nonatomic, strong) RXOSFeedbackListView *feedbackListView;
//@property (nonatomic, strong) RXOSFeedbackUploadView *feedbackUploadView;

@end

@implementation RXOSUIKitService

static RXOSUIKitService *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXOSUIKitService alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        [RXOSLoginViewManager sharedSDK];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(passwordChange:) name:noti_uPasswordChange object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(loginCallBack:) name:noti_rxLogin object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(registerCallBack:) name:noti_register object:nil];

        [RXOSUserUtility sharedManager].loginConfig = [RXOSCommonTool fetchInitProfile];
        [[RXService sharedSDK] getLegalInfo:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
            if (!error) {
                [RXOSUserUtility sharedManager].legalModel = [NSMutableDictionary dictionaryWithDictionary:response];
            }
        }];
        
        [[NSUserDefaults standardUserDefaults] setBool:YES forKey:keyUser_isOS];
        
        [RXSubPackage sharedSDK].aRXUI = YES;
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(hideHUDAction:) name:rxUserDefault_osui_hidehud object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(gonggaoAction:) name:rxUserDefault_osui_gonggao object:nil];
        
        NSLog(@"RXSDK--RXOSUIKit  Version: %@", sdkVersion);
    }
    return self;
}

#pragma mark -- from main framework
- (void)hideHUDAction:(NSNotification *)noti
{
    [RXOSHUD hideHUD];
}

- (void)gonggaoAction:(NSNotification *)noti
{
    AnnounceBlock callback = noti.userInfo[@"callback"];
    NSString *title = noti.userInfo[@"title"];
    NSString *content = noti.userInfo[@"content"];
    
    [self showAnnounceViewWithTitle:title content:content linkCallBack:callback];
}

- (void)regist
{
    NSLog(@"RXOSUIKit 初始化成功");
}

#pragma mark -- <通行证带UI>
/**
 * 调用登录弹窗
 * @param config 登录页基础配置，默认读取后台配置，优先读取代码配置
 * @param complete 登录结果
 */
- (BOOL)showLoginViewWithConfig:(RXOSUILoginConfig *)config
                                  complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    BOOL invalid = [[RXApiService sharedSDK] loginOpenidExpireInvalid];
    
    [self setLoginViewWithConfig:config complete:complete];
    
    return invalid;
}

/**
 * 调用登录弹窗
 * @param config 登录页基础配置，默认读取后台配置，优先读取代码配置
 * @param complete 登录结果
 */
- (void)setLoginViewWithConfig:(RXOSUILoginConfig *)config
                      complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    // 事件上报
    config.deregisterType = config.setLoginContinue ? @"login" : @"logout";
    [[RXLogService sharedSDK] addLogSingleFirstLoginWithEvent:rxlog_login_page_show distinctId:@"" properties:nil];
    
    RXOSUILoginConfig *loginConfig = [RXOSCommonTool toConfigNew:[[RXLoginUIModel alloc] init]];
    loginConfig = [RXOSCommonTool configToConfig:config config:loginConfig];

    __block RXOSLegalData *legalModel = [RXOSLegalData rxu_modelWithDictionary:[RXOSUserUtility sharedManager].legalModel];
    if (config.privacies.count <= 0 || !config.privacies) {
        if ([RXOSUserUtility sharedManager].legalModel && [RXOSUserUtility sharedManager].legalModel.allKeys.count > 0) {
            NSString *priContent1 = @"";
            NSString *priContent2 = @"";
            NSString *priTitle1 = @"";
            NSString *priTitle2 = @"";
            for (int i = 0; i < legalModel.terms.count; i++) {
                RXOSLegalData_term *term = legalModel.terms[i];
                if ([term.key isEqualToString:@"00001"]) {
                    if (term.content.length > 0) {
                        priContent1 = term.content;
                    }
                    if (term.title.length > 0) {
                        priTitle1 = term.title;
                    }
                }
                if ([term.key isEqualToString:@"00002"]) {
                    if (term.content.length > 0) {
                        priContent2 = term.content;
                    }
                    if (term.title.length > 0) {
                        priTitle2 = term.title;
                    }
                }
            }
            loginConfig.privacies = @[priContent1, priContent2];
            loginConfig.privacieTitles = @[priTitle1, priTitle2];
        } else {
            [[RXService sharedSDK] getLegalInfo:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
                if (!error) {
                    [RXOSUserUtility sharedManager].legalModel = [NSMutableDictionary dictionaryWithDictionary:response];
                    legalModel = [RXOSLegalData rxu_modelWithDictionary:[RXOSUserUtility sharedManager].legalModel];
                    NSString *priContent1 = @"";
                    NSString *priContent2 = @"";
                    NSString *priTitle1 = @"";
                    NSString *priTitle2 = @"";
                    for (int i = 0; i < legalModel.terms.count; i++) {
                        RXOSLegalData_term *term = legalModel.terms[i];
                        if ([term.key isEqualToString:@"00001"]) {
                            if (term.content.length > 0) {
                                priContent1 = term.content;
                            }
                            if (term.title.length > 0) {
                                priTitle1 = term.title;
                            }
                        }
                        if ([term.key isEqualToString:@"00002"]) {
                            if (term.content.length > 0) {
                                priContent2 = term.content;
                            }
                            if (term.title.length > 0) {
                                priTitle2 = term.title;
                            }
                        }
                    }
                    loginConfig.privacies = @[priContent1, priContent2];
                    loginConfig.privacieTitles = @[priTitle1, priTitle2];
                    [RXOSUserUtility sharedManager].privacies = loginConfig.privacies;
                    [RXOSUserUtility sharedManager].privacieTitles = loginConfig.privacieTitles;
                }
            }];
        }
    }

    if (!loginConfig.logoImage) {
        loginConfig.logoImage = [UIImage rxOSBundleImageNamed:@"rx_logoImage"];
    }

    NSMutableArray *loginTypes = [NSMutableArray arrayWithArray:loginConfig.loginTypes];
    for (int i = 0; i < loginTypes.count; i++) {
        if ([loginTypes[i] isEqualToString:@"captchacode"]) {
            [loginTypes replaceObjectAtIndex:i withObject:@"code"];
        }
    }
    loginConfig.loginTypes = loginTypes;

    [RXOSUserUtility sharedManager].privacies = loginConfig.privacies;
    [RXOSUserUtility sharedManager].privacieTitles = loginConfig.privacieTitles;
    [RXOSUserUtility sharedManager].loginConfig = loginConfig;
    [RXOSUserUtility sharedManager].loginTypes = [NSMutableArray arrayWithArray:loginConfig.loginTypes];

    self.loginEventBlock = ^NSDictionary *(NSDictionary *loginEvent, LoginType loginType) {
        NSMutableDictionary *loginExt = [NSMutableDictionary dictionaryWithDictionary:config.setCustomParams];
        if ([loginConfig.setCustomExt isKindOfClass:[NSDictionary class]] && loginConfig.setCustomExt.allKeys.count > 0) {
            NSMutableDictionary *customExtDic = [NSMutableDictionary dictionary];
            [customExtDic setValue:loginConfig.setCustomExt forKey:@"custom_ext"];
            [loginExt setValue:customExtDic forKey:@"ext"];
        }
        switch (loginType) {
//            case LoginTypeGoogle:
//                [loginExt setValue:config.googleClientid forKey:@"appid"];
//                break;
            case LoginTypeFacebook:
                [loginExt setValue:config.permissionsArray forKey:@"permissions"];
                break;
            case LoginTypeLine:
                [loginExt setValue:config.permissionsArray forKey:@"permissions"];
                break;
            default:
                break;
        }
        NSLog(@"loginExt:%@", loginExt);
        return loginExt;
    };

    [RXOSUserUtility sharedManager].loginTypeBlock = self.loginEventBlock;

    NSMutableArray *accounts = [RXOSUserUtility sharedManager].accounts;
    
    if (config.method && config.method.length > 0 && config.loginOpenid && config.loginOpenid.length > 0) {
        [[RXOSLoginViewManager sharedSDK] loginWithconfig:config complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
            if (complete) {
                complete(response, error);
            }
        }];
        return;
    }

    if (accounts.count > 0) {
        [RXOSUserUtility sharedManager].isFirstView = NO;
        self.historyView = [[RXOSHistoryLoginView alloc] initWithConfig:loginConfig loginEvent:self.loginEventBlock complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
//            if (self.loginDelegate && [self.loginDelegate :@selector(rxu_LoginCallBackWithResponse:error:)]) {
//                [self.loginDelegate rxu_LoginCallBackWithResponse:response error:error];
//            }
            if (complete) {
                complete(response, error);
            }
        }];
    } else {
        self.loginView = [[RXOSQuickLoginView alloc] initWithLoginConfig:loginConfig loginEvent:self.loginEventBlock complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
            if (complete) {
                complete(response, error);
            }
        }];
    }
}

/**
 * 调用登录弹窗
 * @param config 登录页基础配置，默认读取后台配置，优先读取代码配置
 * @param complete 登录结果
 */
- (void)showLoginUIWithConfig:(RXLoginUIModel *)config
                     complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    // 事件上报
    [[RXLogService sharedSDK] addLogSingleFirstLoginWithEvent:rxlog_login_page_show distinctId:@"" properties:nil];
    
    if (!config) {
        config = [[RXLoginUIModel alloc] init];
    }
    RXOSUILoginConfig *loginConfig = [RXOSCommonTool toConfig:config];

    __block RXOSLegalData *legalModel = [RXOSLegalData rxu_modelWithDictionary:[RXOSUserUtility sharedManager].legalModel];
    if (config.privacies.count <= 0 || !config.privacies) {
        if ([RXOSUserUtility sharedManager].legalModel && [RXOSUserUtility sharedManager].legalModel.allKeys.count > 0) {
            NSString *priContent1 = @"";
            NSString *priContent2 = @"";
            for (int i = 0; i < legalModel.terms.count; i++) {
                RXOSLegalData_term *term = legalModel.terms[i];
                if ([term.key isEqualToString:@"00001"]) {
                    priContent1 = term.content;
                }
                if ([term.key isEqualToString:@"00002"]) {
                    priContent2 = term.content;
                }
            }
            config.privacies = @[priContent1, priContent2];
        } else {
            [[RXService sharedSDK] getLegalInfo:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
                if (!error) {
                    [RXOSUserUtility sharedManager].legalModel = [NSMutableDictionary dictionaryWithDictionary:response];
                    legalModel = [RXOSLegalData rxu_modelWithDictionary:[RXOSUserUtility sharedManager].legalModel];
                    NSString *priContent1 = @"";
                    NSString *priContent2 = @"";
                    for (int i = 0; i < legalModel.terms.count; i++) {
                        RXOSLegalData_term *term = legalModel.terms[i];
                        if ([term.key isEqualToString:@"00001"]) {
                            priContent1 = term.content;
                        }
                        if ([term.key isEqualToString:@"00002"]) {
                            priContent2 = term.content;
                        }
                    }
                    config.privacies = @[priContent1, priContent2];
                }
            }];
        }
    }

    if (!loginConfig.logoImage) {
        loginConfig.logoImage = [UIImage rxOSBundleImageNamed:@"rx_logoImage"];
    }

    NSMutableArray *loginTypes = [NSMutableArray arrayWithArray:loginConfig.loginTypes];
    for (int i = 0; i < loginTypes.count; i++) {
        if ([loginTypes[i] isEqualToString:@"captchacode"]) {
            [loginTypes replaceObjectAtIndex:i withObject:@"code"];
        }
    }
    config.loginMethods = loginTypes;

    [RXOSUserUtility sharedManager].privacies = loginConfig.privacies;
    [RXOSUserUtility sharedManager].privacieTitles = loginConfig.privacieTitles;
    [RXOSUserUtility sharedManager].loginConfig = loginConfig;
    [RXOSUserUtility sharedManager].loginTypes = [NSMutableArray arrayWithArray:loginConfig.loginTypes];

    self.loginEventBlock = ^NSDictionary *(NSDictionary *loginEvent, LoginType loginType) {
        NSMutableDictionary *loginExt = [NSMutableDictionary dictionaryWithDictionary:config.setCustomParams];
        switch (loginType) {
            case LoginTypeW:
                [loginExt setValue:config.wxAppid forKey:@"appid"];
                break;
            case LoginTypeAuth:
                [loginExt setValue:config.quickphoneKey forKey:@"appid"];
                break;
            case LoginTypeFacebook:
                [loginExt setValue:config.permissionsArray forKey:@"permissions"];
                break;
            case LoginTypeLine:
                [loginExt setValue:config.permissionsArray forKey:@"permissions"];
                break;
            default:
                break;
        }
        NSLog(@"loginExt:%@", loginExt);
        return loginExt;
    };

    [RXOSUserUtility sharedManager].loginTypeBlock = self.loginEventBlock;

    NSMutableArray *accounts = [RXOSUserUtility sharedManager].accounts;

    if (accounts.count > 0) {
        [RXOSUserUtility sharedManager].isFirstView = NO;
        self.historyView = [[RXOSHistoryLoginView alloc] initWithConfig:loginConfig loginEvent:self.loginEventBlock complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
//            if (self.loginDelegate && [self.loginDelegate :@selector(rxu_LoginCallBackWithResponse:error:)]) {
//                [self.loginDelegate rxu_LoginCallBackWithResponse:response error:error];
//            }
            if (complete) {
                complete(response, error);
            }
        }];
    } else {
        self.loginView = [[RXOSQuickLoginView alloc] initWithLoginConfig:loginConfig loginEvent:self.loginEventBlock complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
            if (complete) {
                complete(response, error);
            }
        }];
    }
}

/**
 * 调用登录弹窗
 * @param config 登录页基础配置
 * @param loginEvent 页面操作事件，可回调自定义参数
 * @param complete 登录结果
 */
- (void)setLoginViewWithConfig:(RXOSUILoginConfig *)config
                    loginEvent:(NSDictionary *(^)(NSDictionary *loginEvent, LoginType loginType))loginEvent
                      complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    // 事件上报
    [[RXLogService sharedSDK] addLogSingleFirstLoginWithEvent:rxlog_login_page_show distinctId:@"" properties:nil];
    
    if ([RXOSCommonTool isRTL]) {
        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
    } else {
        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
    }
    
    config.closeEmailRegister = [RXOSUserUtility sharedManager].closeEmailRegister;
    
    // 没传配置读配置文件
    if (!config) {
        config = [RXOSCommonTool fetchInitProfile];
    }
    
    RXOSLegalData *legalModel = [RXOSLegalData rxu_modelWithDictionary:[RXOSUserUtility sharedManager].legalModel];
    if (config.privacies.count <= 0 || !config.privacies) {
        NSString *priContent1 = @"";
        NSString *priContent2 = @"";
        for (int i = 0; i < legalModel.terms.count; i++) {
            RXOSLegalData_term *term = legalModel.terms[i];
            if ([term.key isEqualToString:@"00001"]) {
                priContent1 = term.content;
            }
            if ([term.key isEqualToString:@"00002"]) {
                priContent2 = term.content;
            }
        }
        config.privacies = @[priContent1, priContent2];
    }
    
    if (!config.logoImage) {
        config.logoImage = [UIImage rxOSBundleImageNamed:@"rx_logoImage"];
    }
    
    NSMutableArray *loginTypes = [NSMutableArray arrayWithArray:config.loginTypes];
    for (int i = 0; i < loginTypes.count; i++) {
        if ([loginTypes[i] isEqualToString:@"captchacode"]) {
            [loginTypes replaceObjectAtIndex:i withObject:@"code"];
        }
    }
    config.loginTypes = loginTypes;
    
    [RXOSUserUtility sharedManager].privacies = config.privacies;
    [RXOSUserUtility sharedManager].privacieTitles = config.privacieTitles;
    [RXOSUserUtility sharedManager].loginConfig = config;
    [RXOSUserUtility sharedManager].loginTypes = [NSMutableArray arrayWithArray:config.loginTypes];
    [RXOSUserUtility sharedManager].loginTypeBlock = loginEvent;
    
    NSMutableArray *accounts = [RXOSUserUtility sharedManager].accounts;
    
    if (accounts.count > 0) {
        [RXOSUserUtility sharedManager].isFirstView = NO;
        self.historyView = [[RXOSHistoryLoginView alloc] initWithConfig:config loginEvent:loginEvent complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
//            if (self.loginDelegate && [self.loginDelegate :@selector(rxu_LoginCallBackWithResponse:error:)]) {
//                [self.loginDelegate rxu_LoginCallBackWithResponse:response error:error];
//            }
            if (complete) {
                complete(response, error);
            }
        }];
    } else {
        self.loginView = [[RXOSQuickLoginView alloc] initWithLoginConfig:config loginEvent:loginEvent complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
            if (complete) {
                complete(response, error);
            }
        }];
    }
}

/**
 * 调用登录弹窗
 * 不显示快捷登录页面
 * @param config 登录页基础配置
 * @param loginEvent 页面操作事件，可回调自定义参数
 * @param complete 登录结果
 */
- (void)setNormalLoginViewWithConfig:(RXOSUILoginConfig *)config
                          loginEvent:(NSDictionary *(^)(NSDictionary *loginEvent, LoginType loginType))loginEvent
                            complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    if ([RXOSCommonTool isRTL]) {
        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
    } else {
        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
    }
    
    RXOSLegalData *legalModel = [RXOSLegalData rxu_modelWithDictionary:[RXOSUserUtility sharedManager].legalModel];
    if (config.privacies.count <= 0 || !config.privacies) {
        NSString *priContent1 = @"";
        NSString *priContent2 = @"";
        for (int i = 0; i < legalModel.terms.count; i++) {
            RXOSLegalData_term *term = legalModel.terms[i];
            if ([term.key isEqualToString:@"00001"]) {
                priContent1 = term.content;
            }
            if ([term.key isEqualToString:@"00002"]) {
                priContent2 = term.content;
            }
        }
        config.privacies = @[priContent1, priContent2];
    }
    
    if (!config.logoImage) {
        config.logoImage = [UIImage rxOSBundleImageNamed:@"rx_logoImage"];
    }
    
    NSMutableArray *loginTypes = [NSMutableArray arrayWithArray:config.loginTypes];
    for (int i = 0; i < loginTypes.count; i++) {
        if ([loginTypes[i] isEqualToString:@"captchacode"]) {
            [loginTypes replaceObjectAtIndex:i withObject:@"code"];
        }
    }
    config.loginTypes = loginTypes;
    
    [RXOSUserUtility sharedManager].privacies = config.privacies;
    [RXOSUserUtility sharedManager].privacieTitles = config.privacieTitles;
    [RXOSUserUtility sharedManager].loginConfig = config;
    [RXOSUserUtility sharedManager].loginTypes = [NSMutableArray arrayWithArray:config.loginTypes];
    [RXOSUserUtility sharedManager].loginTypeBlock = loginEvent;
    
    NSMutableArray *accounts = [RXOSUserUtility sharedManager].accounts;
    
    self.loginView = [[RXOSQuickLoginView alloc] initWithLoginConfig:config loginEvent:loginEvent complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
        if (complete) {
            complete(response, error);
        }
    }];
}

// 关闭登陆弹窗
- (void)closeLoginView
{
    if ([RXOSUserUtility sharedManager].accounts.count > 0) {

    } else {
        [self.loginView hide];
    }
}

/**
 * 一键登录弹窗
 * @param privacy1 用户协议url
 * @param privacy2 隐私协议url
 */
- (void)setAuthLoginViewWithPrivacy1:(NSString *)privacy1
                            privacy2:(NSString *)privacy2
{
//    RXAuthLoginView *authLogin = [[RXAuthLoginView alloc] initWithPrivacy1:privacy1 privacy2:privacy2 callBack:self.callBack];
//
//    [RXOSUserUtility sharedManager].loginCompleteBlock = ^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nonnull error) {
//        if (self.loginDelegate && [self.loginDelegate :@selector(rx_LoginCallBackWithResponse:error:)]) {
//            [self.loginDelegate rx_LoginCallBackWithResponse:response error:error];
//        }
//    };
}

/**
 * 注册/添加账号
 * @param extDic 扩展字段，可传nil
 * @param isSelect 协议是否勾选
 */
- (void)setAddAccountViewWithIsSelect:(BOOL)isSelect
                               extDic:(NSMutableDictionary * __nullable)extDic
                             complete:(void(^)(BOOL success, NSString *username, NSString *password))complete
{
    self.addLoginView = [[RXOSAddLoginView alloc] initWithIsSelect:isSelect extDic:extDic complete:complete];
}

/**
 * 协议声明
 * @note 全屏H5样式
 * @param key 默认展示的条款key
 * @param keyList 要展示的协议列表
 */
- (void)setProtocolViewWithKey:(NSString *)key
                       keyList:(NSArray *)keyList
{
    if ([RXOSCommonTool isRTL]) {
        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
    } else {
        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
    }
//    [RXOSUserUtility sharedManager].protocolKey = key;
//    [RXOSUserUtility sharedManager].protocolKeyList = keyList;
    RXOSWKWebView *webView = [[RXOSWKWebView alloc] initWithFrame:[UIApplication sharedApplication].keyWindow.frame];
    webView.protocolKey = key;
    webView.protocolKeyList = keyList;
    
    NSString *domain = [[RXService sharedSDK] getFirstBaseUrl];
    if (![[domain substringWithRange:NSMakeRange(domain.length - 1, 1)] isEqualToString:@"/"]) {
        domain = [NSString stringWithFormat:@"%@/", domain];
    }
    
//    webView.urlStr = @"https://10.10.2.64:8083/static/passport/#/oversea/protocol";
    webView.urlStr = [NSString stringWithFormat:@"%@static/passport/#/oversea/protocol", domain];
    
//    webView.complete = complete;
    [[UIApplication sharedApplication].keyWindow addSubview:webView];
}

/**
 * 协议声明
 * @param key 默认展示的条款key
 * @param legalData 法务信息api返回的数据
 */
- (void)setPrivacyViewWithKey:(NSString *)key
                    legalData:(NSDictionary *)legalData
{
    if ([RXOSCommonTool isRTL]) {
        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
    } else {
        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
    }
    
    RXOSPrivacyView *pricacyView = [[RXOSPrivacyView alloc] initWithKey:key legalData:legalData];
}

/**
 * 实名认证
 * @param canClose 是否展示关闭按钮，默认不展示
 */
- (void)setRealauthViewWithCanClose:(BOOL)canClose
                           complete:(void(^)(NSDictionary *backData, RX_CommonRequestError *error))complete
{
    if ([RXOSCommonTool isRTL]) {
        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
    } else {
        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
    }
    
    RXOSApproveView *approve = [[RXOSApproveView alloc] initWithCanColose:canClose complete:complete];
}

/**
 * 实名认证 H5
 * @note 不同地区的实名认证样式不同
 * @param region 地区
 * @param canClose 是否展示关闭按钮，默认不展示
 */
- (void)setRealauthViewH5WithRegion:(NSString *)region
                           canClose:(BOOL)canClose
                           complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    if ([RXOSCommonTool isRTL]) {
        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
    } else {
        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
    }
    
    RXOSWKWebView *webView = [[RXOSWKWebView alloc] initWithFrame:[UIApplication sharedApplication].keyWindow.frame];
    webView.region = region;
    webView.backBtn.hidden = YES;
    webView.closeBtn.hidden = !canClose;
    
    NSString *domain = [[RXService sharedSDK] getFirstBaseUrl];
    if (![[domain substringWithRange:NSMakeRange(domain.length - 1, 1)] isEqualToString:@"/"]) {
        domain = [NSString stringWithFormat:@"%@/", domain];
    }
//    webView.urlStr = @"https://10.10.2.213:8083/static/passport/#/oversea/unregistercondition";
    webView.urlStr = [NSString stringWithFormat:@"%@static/passport/#/oversea/realname", domain];
    
    webView.commonComplete = complete;
    
    webView.complete = ^(NSDictionary * _Nonnull response) {
        if (complete) {
            if ([response[@"code"] integerValue] == 0) {
                NSMutableDictionary *success = [NSMutableDictionary dictionaryWithDictionary:response];
                complete(success, nil);
            } else {
                RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
                err.responesObject = response;
                complete(nil, err);
            }
        }
    };
    
    webView.rightClose = ^(RX_CommonRequestError * _Nonnull error) {
        if (complete) {
            complete(nil, error);
        }
    };
    
    [[UIApplication sharedApplication].keyWindow addSubview:webView];
}

/**
 * 绑定手机
 */
- (void)bindingPhoneWithComplete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    if ([RXOSCommonTool isRTL]) {
        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
    } else {
        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
    }
    
    RXOSRegistView *regist = [[RXOSRegistView alloc] initWithType:RegistViewType_binding extDic:nil complete:nil];
    regist.bindingBlock = complete;
}

/**
 * 申请注销
 * @param config 基础配置
 */
- (void)applyForDeregisterWithConfig:(RXOSUserCenterConfig *)config
                            complete:(void(^)(NSDictionary *response))complete
{
    if ([RXOSCommonTool isRTL]) {
        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
    } else {
        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
    }
    
    [RXOSUserUtility sharedManager].userCenterConfig = config;
    RXOSWKWebView *webView = [[RXOSWKWebView alloc] initWithFrame:[UIApplication sharedApplication].keyWindow.frame];
    
    NSString *domain = [[RXService sharedSDK] getFirstBaseUrl];
    if (![[domain substringWithRange:NSMakeRange(domain.length - 1, 1)] isEqualToString:@"/"]) {
        domain = [NSString stringWithFormat:@"%@/", domain];
    }
//    webView.urlStr = @"https://10.10.2.213:8083/static/passport/#/oversea/unregistercondition";
    webView.urlStr = [NSString stringWithFormat:@"%@static/passport/#/oversea/unregistercondition", domain];
    
    webView.complete = complete;
//        webView.urlStr =  @"https://www.baidu.com";
    [[UIApplication sharedApplication].keyWindow addSubview:webView];
}

/**
 * 撤销注销
 */
- (void)destroyAccountStatusView:(void(^)(DestroyClickType clickType))complete
{
    if ([RXOSCommonTool isRTL]) {
        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
    } else {
        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
    }
    
    RXOSDestroyAccountView *desAccountView = [[RXOSDestroyAccountView alloc] initWithType:DestroyType_repeal reason:@"已提交注销申请" clickBlock:complete];
}

/**
 * 撤销注销
 * @param deregisterType login登录，logout退出登录
 */
- (void)destroyAccountStatusViewWithDeregisterType:(NSString *)deregisterType
                                          complete:(void(^)(DestroyClickType clickType))complete
{
    RXOSDestroyAccountView *desAccountView = [[RXOSDestroyAccountView alloc] initWithType:DestroyType_repeal reason:@"已提交注销申请" clickBlock:complete];
    desAccountView.deregisterType = deregisterType;
}

/**
 * 撤销注销  自定义非撤销注销按钮文案
 * @param btnTitle 按钮标题
 * @param complete 点击回调
 * btnTitle 传入的按钮标题
 */
- (void)destroyAccountStatusViewWithBtnTitle:(NSString *)btnTitle
                                    complete:(void(^)(NSString *btnTitle))complete
{
    RXOSDestroyAccountView *desAccountView = [[RXOSDestroyAccountView alloc] initWithBtnTitle:btnTitle reason:@"已提交注销申请" diyClickBlock:complete];
}

/**
 * 撤销注销  自定义非撤销注销按钮文案
 * @param btnTitle 按钮标题
 * @param complete 点击回调
 * btnTitle 传入的按钮标题
 */
- (void)destroyAccountStatusUIWithBtnTitle:(NSString *)btnTitle
                                  complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    [self destroyAccountStatusViewWithBtnTitle:btnTitle complete:^(NSString *btnTitle) {
        if (complete) {
            NSString *callbackBtnTitle = btnTitle ?: @"";
            NSInteger btnType = [callbackBtnTitle isEqualToString:@"撤销注销"] ? 1 : 0;
            complete(@{@"code" : @(0), @"data" : @{@"btn_title" : callbackBtnTitle, @"btn_type" : @(btnType)}}, nil);
        }
    }];
}

/**
 * 找回密码
 */
- (void)getBackPasswordWithComplete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    if ([RXOSCommonTool isRTL]) {
        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
    } else {
        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
    }
    
    RXOSGetBackPasswordView *getBackView = [[RXOSGetBackPasswordView alloc] initWithType:GetBackPasswordType_code phone:@"" code:@""];
    getBackView.complete = complete;
}

/**
 * 设置密码
 */
- (void)setPasswordWithComplete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    if ([RXOSCommonTool isRTL]) {
        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
    } else {
        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
    }
    
    RXOSSetPasswordView *setPasswordView = [[RXOSSetPasswordView alloc] initWithComplete:complete];
}

/**
 * 找回密码
 * @param params 页面配置信息
 * ！username 默认填充的账号
 * ！password_regex 密码校验正则表达式
 */
- (void)getBackPasswordWithParams:(NSDictionary *)params
                    requestParams:(NSMutableDictionary *(^)(NSMutableDictionary *params))requestParams
                         complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    if ([RXOSCommonTool isRTL]) {
        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
    } else {
        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
    }
    
    RXOSGetBackPasswordView *getBackView = [[RXOSGetBackPasswordView alloc] initWithType:GetBackPasswordType_code phone:@"" code:@""];
    getBackView.params = params;
    getBackView.requestBlock = requestParams;
    getBackView.complete = complete;
}

/**
 * 用户中心
 * @param config 基础配置
 */
- (void)userCenterWithConfig:(RXOSUserCenterConfig *)config
                    complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    if ([RXOSCommonTool isRTL]) {
        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
    } else {
        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
    }
    
    if (!config) {
        config = [[RXOSUserCenterConfig alloc] init];
    }
    NSDictionary *channelInfo = [[NSUserDefaults standardUserDefaults] valueForKey:keyUser_channel];
    NSArray *list = channelInfo[@"uc"][@"list"];
    if (list && [list isKindOfClass:[NSArray class]] && list.count > 0) {
        NSMutableDictionary *configParams = [NSMutableDictionary dictionaryWithDictionary:config.setConfigParams];
        if ([configParams isKindOfClass:[NSDictionary class]] && configParams.allKeys.count <= 0) {
            [configParams setValue:list forKey:@"btns"];
            config.setConfigParams = configParams;
        }
    }
    
    [RXOSUserUtility sharedManager].userCenterConfig = config;
    RXOSUserCenterView *userCenter = [[RXOSUserCenterView alloc] initWithConfig:config complete:complete];
}

/**
 * 用户中心
 * @param config 基础配置
 */
- (void)userCenterUIWithConfig:(RXOSUserCenterConfig *)config
                      complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    [self userCenterWithConfig:config complete:^(NSDictionary *response, RX_CommonRequestError *error) {
        if (!complete) {
            return;
        }
        
        if (error) {
            complete(response, error);
            return;
        }
        
        BOOL isResponseDictionary = [response isKindOfClass:[NSDictionary class]];
        NSDictionary *data = isResponseDictionary ? response[@"data"] : nil;
        BOOL isCommonResponse = isResponseDictionary &&
                                response[@"code"] &&
                                [data isKindOfClass:[NSDictionary class]] &&
                                [data[@"type"] isKindOfClass:[NSString class]];
        if (isCommonResponse) {
            complete(response, error);
        } else {
            NSDictionary *responseData = [response isKindOfClass:[NSDictionary class]] ? response : @{};
            complete(@{@"code" : @(0), @"data" : responseData}, error);
        }
    }];
}

/**
 * 关闭用户中心
 */
- (void)closeUserCenter
{
    for (UIView *subView in [UIApplication sharedApplication].keyWindow.subviews) {
        if ([subView isKindOfClass:[RXOSUserCenterView class]]) {
            RXOSUserCenterView *userCenter = (RXOSUserCenterView *)subView;
            [userCenter hide];
        }
    }
}

/**
 * 帮助中心
 * @param config 基础配置
 */
- (void)serviceCenterWithConfig:(RXOSUserCenterConfig *)config
                       complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    if ([RXOSCommonTool isRTL]) {
        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
    } else {
        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
    }
    
    [RXOSUserUtility sharedManager].userCenterConfig = config;
    if ([RXOSUserUtility sharedManager].isShowServiceCenter) {
        [self.serviceCenter showView];
    } else {
//        self.serviceCenter = [[RXOSServiceCenterView alloc] initWithConfig:config type:ServiceType_center complete:complete];
        
        self.serviceCenter = [[RXOSWKController alloc] init];
        self.serviceCenter.type = ServiceType_center;
        self.serviceCenter.modalPresentationStyle = UIModalPresentationFullScreen;
        [[UIViewController currentViewController] presentViewController:self.serviceCenter animated:NO completion:nil];
    }
    
//    RXOSWKController *webView = [[RXOSWKController alloc] init];
//    webView.modalPresentationStyle = UIModalPresentationFullScreen;
//    [[UIViewController currentViewController] presentViewController:webView animated:NO completion:nil];
}

/**
 * 客服
 * @param config 基础配置
 */
- (void)chatServiceWithConfig:(RXOSUserCenterConfig *)config
                     complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    if ([RXOSCommonTool isRTL]) {
        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
    } else {
        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
    }
    
    [RXOSUserUtility sharedManager].userCenterConfig = config;
    if ([RXOSUserUtility sharedManager].isShowServiceCenter) {
        [self.chatService showView];
    } else {
//        self.serviceCenter = [[RXOSServiceCenterView alloc] initWithConfig:config type:ServiceType_chat complete:complete];
        
        self.chatService = [[RXOSWKController alloc] init];
        self.chatService.type = ServiceType_chat;
        self.chatService.modalPresentationStyle = UIModalPresentationFullScreen;
        [[UIViewController currentViewController] presentViewController:self.chatService animated:NO completion:nil];
    }
}

/**
 * 分享弹窗
 * @param shareInfo 分享数据，传nil则由SDK调用埋点数据
 * @param needReport 分享成功后是否需要自动上报
 * @param ext 扩展数据
 * ！ext：
 * ！
 */
- (void)shareWithShareInfo:(NSDictionary *)shareInfo
                needReport:(BOOL)needReport
                       ext:(NSDictionary *)ext
                  complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
//    RXSView *shareView = [[RXSView alloc] initWithShareTypes:types round:round clickBlock:clickBlock];
}

/**
 * 自定义webView
 * @param url 链接
 * @param title 标题
 */
- (void)openWebViewWithUrl:(NSString *)url
                     title:(NSString *)title
{
    if ([RXOSCommonTool isRTL]) {
        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
    } else {
        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
    }
    
    RXOSCommonWKWebView *webView = [[RXOSCommonWKWebView alloc] initWithUrl:url title:@"用户协议" content:nil];
}

/**
 * 协议
 */
- (void)setPrivacyWithComplete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    if ([RXOSCommonTool isRTL]) {
        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
    } else {
        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
    }
    
    RXOSPriView *priView = [[RXOSPriView alloc] init];
}

/**
 * 防沉迷
 * @param title 标题
 * @param des 内容
 * @param btnTitle 按钮标题，点击后block回调
 */
- (void)setAntiAdditionViewWithTitle:(NSString *)title
                                 des:(NSString *)des
                            btnTitle:(NSString *)btnTitle
                            complete:(void(^)(void))complete

{
    RXOSAntiAddictionView *anti = [[RXOSAntiAddictionView alloc] initWithDesStr:des title:title btnTitle:btnTitle block:complete];
}

/**
 * 同步账号登录记录
 * @param accounts 账号数组
 * ！accounts结构说明:
 * @[@{@"username" : @"", @"password" : @""}]
 */
- (void)syncAccounts:(NSArray <NSDictionary *> *)accounts
{
    NSMutableArray *localAccounts = [NSMutableArray arrayWithArray:[RXOSUserUtility sharedManager].accounts];
    
    for (int i = 0; i < accounts.count; i++) {
        NSDictionary *syncUserInfo = accounts[i];
        NSMutableDictionary *userInfo = [NSMutableDictionary dictionary];
        [userInfo setValue:@(1) forKey:@"loginType"];
        [userInfo setValue:syncUserInfo[@"username"] forKey:@"nickname"];
        [userInfo setValue:syncUserInfo[@"username"] forKey:@"username"];
        [userInfo setValue:syncUserInfo[@"password"] forKey:@"password"];
        [userInfo setValue:@(1) forKey:@"sync"];

        BOOL hasAccount = NO;
        for (int j = 0; j < localAccounts.count; j++) {
            NSDictionary *localUserInfo = localAccounts[j];
            if ([localUserInfo[@"loginType"] longValue] == 1 && [localUserInfo[@"username"] isEqualToString:syncUserInfo[@"username"]]) {
                hasAccount = YES;
            }
        }
        
        if (!hasAccount) {
            [localAccounts addObject:userInfo];
        }
    }
    
    [RXOSUserUtility saveAccounts:localAccounts];
}

#pragma mark -- <notiActions>
- (void)registerCallBack:(NSNotification *)noti
{
    NSDictionary *registerCallBack = noti.userInfo;
    
    NSDictionary *error = registerCallBack[@"error"];
    NSDictionary *response = registerCallBack[@"response"];
    
    if (response) {
        [self.loginDelegate rxu_registerCallBackWithResponse:response error:nil];
    } else {
        [self.loginDelegate rxu_registerCallBackWithResponse:nil error:error];
    }
}

- (void)passwordChange:(NSNotification *)noti
{
    NSString *password = noti.userInfo[@"password"];
//    [RXOSCommonTool saveAccountWithUsername:[RXOSUserUtility sharedManager].phone password:password];
}

- (void)loginCallBack:(NSNotification *)noti
{
//    NSMutableDictionary *notiDic = [NSMutableDictionary dictionaryWithDictionary:noti.userInfo];
//
//
//    NSDictionary *loginModel = notiDic[@"loginData"];
////    NSDictionary *loginModel = @{@"code" : @312215,
////                                 @"data" : @{},
////                   @"msg" : @"密码错误"
////    };
//    [RXOSUserUtility saveLoginModel:loginModel];
//
//    NSNumber *loginType = notiDic[@"loginType"];
//    [RXOSUserUtility saveLoginType:loginType];
    
    
    
    
    
    NSMutableDictionary *notiDic = [NSMutableDictionary dictionaryWithDictionary:noti.userInfo];

    NSDictionary *loginModel = notiDic[@"data"];
    NSInteger code = [loginModel[@"code"] integerValue];
    NSString *tipString = loginModel[@"msg"];
    if (loginModel && code == 0) {
        for (UIView *subView in [UIApplication sharedApplication].keyWindow.subviews) {
            if ([subView isKindOfClass:[RXOSQuickLoginView class]]) {
                self.loginView = (RXOSQuickLoginView *)subView;
            }
        }
//        [SVProgressHUD showSuccessWithStatus:@"登录成功"];
        [RXOSHUD hideHUD];
        [RXOSUserUtility saveLoginModel:loginModel];
        [self.loginView hide];
        [self.historyView hide];
        
        for (UIView *v in [UIApplication sharedApplication].keyWindow.subviews) {
            if ([v isKindOfClass:[RXOSMoreLoginView class]]) {
                [v removeFromSuperview];
            }
        }
        
        for (UIView *v in [UIApplication sharedApplication].keyWindow.subviews) {
            if ([v isKindOfClass:[RXOSLoginView class]]) {
                [v removeFromSuperview];
            }
        }
        
        for (UIView *v in [UIApplication sharedApplication].keyWindow.subviews) {
            if ([v isKindOfClass:[RXOSEmailLoginView class]]) {
                [v removeFromSuperview];
            }
        }
        
        for (UIView *v in [UIApplication sharedApplication].keyWindow.subviews) {
            if (v.tag == 200000) {
                [v removeFromSuperview];
            }
        }
        
        [self.loginDelegate rxu_LoginCallBackWithResponse:notiDic error:nil];
    } else {
        NSString *msg = loginModel[@"msg"];
        if (code == 1120) {
            msg = @"网络请求失败，请重试或检查网络设置";
        }
        
        if (code == 302204 || code == 302205) {
            return;
        } else {
//            [RXOSHUD showErrorText:tipString];
        }
        RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
        
        err.responesObject = loginModel;
        [self.loginDelegate rxu_LoginCallBackWithResponse:nil error:err];
    }

    NSNumber *loginType = notiDic[@"loginType"];
    if (loginType) {
        [RXOSUserUtility saveLoginType:loginType];
    }
}

- (void)showEmailViewWithCpUserId:(NSString *)cpUserId
                     withComplete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complet
{
    if ([RXOSCommonTool isRTL]) {
        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
    } else {
        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
    }
    
    self.emailListView = [[RXOSEmailListView alloc] initWithCpUserId:cpUserId ];
}

/**
 * 绑定手机，如果已绑定手机会跳转到换绑页面
 */
- (void)bindPhoneWithComplete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete{
    
    if ([RXOSCommonTool isRTL]) {
        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
    } else {
        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
    }
    
    RXOSWKWebView *webView = [[RXOSWKWebView alloc] initWithFrame:[UIApplication sharedApplication].keyWindow.frame];
    
    NSString *domain = [[RXService sharedSDK] getFirstBaseUrl];
    if (![[domain substringWithRange:NSMakeRange(domain.length - 1, 1)] isEqualToString:@"/"]) {
        domain = [NSString stringWithFormat:@"%@/", domain];
    }
    webView.urlStr = [NSString stringWithFormat:@"%@static/passport/#/oversea/changephone", domain];
    webView.complete = ^(NSDictionary * _Nonnull response) {
        if ([response[@"code"] integerValue] == 0) {
            if (complete) {
                complete(response, nil);
            }
        }else{
            if (complete) {
                RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
                err.responesObject = response;
                complete(nil, err);
            }
        }
    };
    webView.rightClose = ^(RX_CommonRequestError * _Nonnull error) {
        if (complete) {
            complete(nil, error);
        }
    };
    [[UIApplication sharedApplication].keyWindow addSubview:webView];
}

/**
 * 绑定邮箱，如果已绑定邮箱会跳转到换绑页面
 */
- (void)bindEmailWithComplete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete{
    if ([RXOSCommonTool isRTL]) {
        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
    } else {
        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
    }
    
    RXOSWKWebView *webView = [[RXOSWKWebView alloc] initWithFrame:[UIApplication sharedApplication].keyWindow.frame];
    
    NSString *domain = [[RXService sharedSDK] getFirstBaseUrl];
    if (![[domain substringWithRange:NSMakeRange(domain.length - 1, 1)] isEqualToString:@"/"]) {
        domain = [NSString stringWithFormat:@"%@/", domain];
    }
    webView.urlStr = [NSString stringWithFormat:@"%@static/passport/#/oversea/changeemail", domain];
    webView.complete = ^(NSDictionary * _Nonnull response) {
        if ([response[@"code"] integerValue] == 0) {
            if (complete) {
                complete(response, nil);
            }
        }else{
            if (complete) {
                RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
                err.responesObject = response;
                complete(nil, err);
            }
        }
    };
    webView.rightClose = ^(RX_CommonRequestError * _Nonnull error) {
        if (complete) {
            complete(nil, error);
        }
    };
    [[UIApplication sharedApplication].keyWindow addSubview:webView];
}

/**
 * 展示公告
 * limit 展示公告条数
 * linkCallBack 如果用户点击了链接，则链接由此返回，后续可使用此链接做业务处理
 * ishasCallBack 是否有公告，YES有，NO没有
 */
- (void)showAnnounceViewWithLimit:(int)limit linkCallBack:(void(^)(NSString *link))linkCallBack isHasCallBack:(void(^)(BOOL isHas))ishasCallBack{
    if ([RXOSCommonTool isRTL]) {
        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
    } else {
        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
    }
    
    self.announcementView = [[RXOSAnnouncementView alloc] initWithAnnouncementWithLimit:limit linkCallBack:^(NSString * _Nonnull link) {
        if (linkCallBack) {
            linkCallBack(link);
        }
    } isHasCallBack:^(BOOL isHas) {
        if (ishasCallBack) {
            ishasCallBack(isHas);
        }
    }];
    
}

/**
 * 展示维护公告，默认为1条
 * linkCallBack 如果用户点击了链接，则链接由此返回，后续可使用此链接做业务处理
 * title 维护公告标题
 * content 维护公告内容
 */
- (void)showAnnounceViewWithTitle:(NSString *)title content:(NSString *)content linkCallBack:(void(^)(NSString *link))linkCallBack{
    if ([RXOSCommonTool isRTL]) {
        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
    } else {
        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
    }
    
    self.announcementView = [[RXOSAnnouncementView alloc] initWithAnnouncementWithLimit:1 title:title content:content linkCallBack:^(NSString * _Nonnull link) {
        if (linkCallBack) {
            linkCallBack(link);
        }
    }];
}

///**
// * 我的意见反馈列表
// */
//- (void)showFeedbackListView{
//    if ([RXOSCommonTool isRTL]) {
//        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
//        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
//    } else {
//        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
//        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
//    }
//    self.feedbackListView = [[RXOSFeedbackListView alloc] init];
//}
//
///**
// * 创建意见反馈
// */
//- (void)showCreateFeedbackView{
//    if ([RXOSCommonTool isRTL]) {
//        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
//        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
//    } else {
//        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
//        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
//    }
//    self.feedbackUploadView = [[RXOSFeedbackUploadView alloc] init];
//}

@end
