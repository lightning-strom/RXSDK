//
//  RXUIKitService.m
//  RXUIKit
//
//  Created by 陈汉 on 2022/2/19.
//

#import "RXUIKitService.h"
#import "RXUICommonHeader.h"
#import "RXLoginView.h"
#import "RXAddLoginView.h"
#import "RXPrivacyView.h"
#import "RXApproveView.h"
#import "RXAntiAddictionView.h"
#import "RXLimitsView.h"
#import "RXRegistView.h"
#import "RXProtocolView.h"
#import "RXDestroyAccountView.h"
#import "RXGetBackPasswordView.h"
#import "RXHistoryLoginView.h"
#import "RXUIAuthLoginView.h"
#import "RXUserCenterView.h"
#import "RXLoginViewManager.h"
#import "RXSetPasswordView.h"
#import "RXSView.h"
#import "RXLegalModel.h"
#import "NSObject+RXUIAdditon.h"
#import "RXMoreLoginView.h"
#import "RXCommonWKWebView.h"
#import "RXWKController.h"
#import "RXPrivacyLimitView.h"
#import "RXWebViewController.h"
#import "RXEmailListView.h"
#import "RXHistoryListLoginView.h"
#import "RXAnnouncementView.h"
#import "RXWKInsideWebView.h"
#import "RXUISingleAuthLoginView.h"
#import "RXSingleLoginView.h"
#import <RXSDK_Pure/RXNotificationCenter.h>
#import <RXSDK_Pure/RXSubPackage.h>

typedef NSDictionary * (^LoginEventBlock)(NSDictionary *loginEvent, LoginType loginType);
typedef void(^PrivacyBlock)(BOOL agree);
typedef void(^AnnounceBlock)(NSString *link);

@interface RXUIKitService ()

@property (nonatomic, strong) NSTimer *timer;
@property (nonatomic, strong) RXAddLoginView *addLoginView;
@property (nonatomic, strong) RXLoginView *loginView;
@property (nonatomic, strong) RXSingleLoginView *singleLoginView;
@property (nonatomic, strong) RXHistoryLoginView *historyView;
@property (nonatomic, strong) RXWKController *serviceCenter;
@property (nonatomic, strong) RXWKController *chatService;
@property (nonatomic, copy) LoginEventBlock loginEventBlock;
@property (nonatomic, strong) RXEmailListView *emailListView;
@property (nonatomic, strong) RXAnnouncementView *announcementView;

@end

@implementation RXUIKitService

static RXUIKitService *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXUIKitService alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        [RXLoginViewManager sharedSDK];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(passwordChange:) name:noti_uPasswordChange object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(loginCallBack:) name:noti_rxLogin object:nil];

        [RXUIUserUtility sharedManager].loginConfig = [RXUICommonTool fetchInitProfile];
        [[RXService sharedSDK] getLegalInfo:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
            if (!error) {            
                [RXUIUserUtility sharedManager].legalModel = [NSMutableDictionary dictionaryWithDictionary:response];
            }
        }];
        
        [[NSUserDefaults standardUserDefaults] setBool:NO forKey:keyUser_isOS];
        
        [RXSubPackage sharedSDK].aRXUI = YES;
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(showPrivacy:) name:rxUserDefault_ui_showPrivacy object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(hideHUDAction:) name:rxUserDefault_ui_hidehud object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(gonggaoAction:) name:rxUserDefault_ui_gonggao object:nil];
        
        NSLog(@"RXSDK--RXUIKit  Version: %@", sdkVersion);
    }
    return self;
}

#pragma mark -- from main framework
- (void)showPrivacy:(NSNotification *)noti
{
    PrivacyBlock callback = noti.userInfo[@"callback"];
    
    [self userPrivacyPolicyWithComplete:callback];
}

- (void)gonggaoAction:(NSNotification *)noti
{
    AnnounceBlock callback = noti.userInfo[@"callback"];
    NSString *title = noti.userInfo[@"title"];
    NSString *content = noti.userInfo[@"content"];
    
    [self showAnnounceViewWithTitle:title content:content linkCallBack:callback];
}

- (void)hideHUDAction:(NSNotification *)noti
{
    [RXHUD hideHUD];
}

- (void)regist
{
    NSLog(@"RXUIKit 初始化成功");
}

#pragma mark -- <通行证带UI>
/**
 * 调用登录弹窗
 * @param config 登录页基础配置，默认读取后台配置，优先读取代码配置
 * @param complete 登录结果
 */
- (BOOL)showLoginViewWithConfig:(RXLoginUIModel *)config
                       complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    [RXUIUserUtility sharedManager].isNewLogin = YES;
    [RXUIUserUtility sharedManager].loginUIModel = config;
    [RXUIUserUtility sharedManager].loginComplete = complete;
    
    BOOL invalid = [[RXApiService sharedSDK] loginOpenidExpireInvalid];
    
    [self showLoginUIWithConfig:config complete:complete];
    
    return invalid;
}

/**
 * 调用登录弹窗
 * @note login_openid 是否失效，YES 失效，NO 有效，config 需要和 showLoginUI 配置相同
 * @param config 登录页基础配置，默认读取后台配置，优先读取代码配置
 * @param complete 登录结果
 */
- (BOOL)loginOpenidExpireInvalidWithConfig:(RXLoginUIModel *)config
                                  complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    [RXUIUserUtility sharedManager].isNewLogin = NO;
    
    BOOL invalid = [[RXApiService sharedSDK] loginOpenidExpireInvalid];
    
    if (invalid) {
        [self showLoginUIWithConfig:config complete:complete];
        return invalid;
    }
    
    return invalid;
}

/**
 * 调用登录弹窗
 * @param config 登录页基础配置，默认读取后台配置，优先读取代码配置
 * @param complete 登录结果
 */
- (void)showLoginUIWithConfig:(RXLoginUIModel *)config
                     complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    if (!config) {
        config = [[RXLoginUIModel alloc] init];
    }
    RXLoginUIConfig *loginConfig = [RXUICommonTool toConfig:config];
    
    if (config.privacies.count <= 0 || !config.privacies) {
        __block RXLegalData *legalModel = [RXLegalData rxu_modelWithDictionary:[RXUIUserUtility sharedManager].legalModel];
        if ([RXUIUserUtility sharedManager].legalModel && [RXUIUserUtility sharedManager].legalModel.allKeys.count > 0) {
            NSString *priContent1 = @"";
            NSString *priContent2 = @"";
            for (int i = 0; i < legalModel.terms.count; i++) {
                RXLegalData_term *term = legalModel.terms[i];
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
                    [RXUIUserUtility sharedManager].legalModel = [NSMutableDictionary dictionaryWithDictionary:response];
                    legalModel = [RXLegalData rxu_modelWithDictionary:[RXUIUserUtility sharedManager].legalModel];
                    NSString *priContent1 = @"";
                    NSString *priContent2 = @"";
                    for (int i = 0; i < legalModel.terms.count; i++) {
                        RXLegalData_term *term = legalModel.terms[i];
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
        
        if (config.privacies.count > 0) {
            loginConfig.privacies = config.privacies;
        }
    }
    
    if (!loginConfig.logoImage) {
        loginConfig.logoImage = [UIImage rxBundleImageNamed:@"rx_logoImage"];
    }
    
    NSMutableArray *loginTypes = [NSMutableArray arrayWithArray:loginConfig.loginTypes];
    NSMutableArray *removeIndexs = [NSMutableArray array];
    for (int i = 0; i < loginTypes.count; i++) {
        if ([loginTypes[i] isEqualToString:@"captchacode"]) {
            [loginTypes replaceObjectAtIndex:i withObject:@"code"];
        }
//        if ([loginTypes[i] isEqualToString:@"captchacode"] ||
//            [loginTypes[i] isEqualToString:@"code"] ||
//            [loginTypes[i] isEqualToString:@"username"] ||
//            [loginTypes[i] isEqualToString:@"auth"] ||
//            [loginTypes[i] isEqualToString:@"quickphone"]) {
//            [removeIndexs addObject:loginTypes[i]];
//        }
        if ([loginTypes[i] isEqualToString:@"auth"] ||
            [loginTypes[i] isEqualToString:@"quickphone"]) {
            [removeIndexs addObject:loginTypes[i]];
        }
    }
    
    if (removeIndexs.count > 0) {
        for (int i = 0; i < removeIndexs.count; i++) {
            [loginTypes removeObject:removeIndexs[i]];
        }
    }
    
//    [loginTypes insertObject:@"username" atIndex:0];
    
    loginConfig.loginTypes = loginTypes;
    
    [RXUIUserUtility sharedManager].privacies = loginConfig.privacies;
    [RXUIUserUtility sharedManager].privacieTitles = loginConfig.privacieTitles;
    [RXUIUserUtility sharedManager].loginConfig = loginConfig;
    [RXUIUserUtility sharedManager].loginTypes = [NSMutableArray arrayWithArray:loginConfig.loginTypes];
    
    self.loginEventBlock = ^NSDictionary *(NSDictionary *loginEvent, LoginType loginType) {
        NSMutableDictionary *loginExt = [NSMutableDictionary dictionaryWithDictionary:config.setCustomParams];
        if ([loginConfig.setCustomExt isKindOfClass:[NSDictionary class]] && loginConfig.setCustomExt.allKeys.count > 0) {
            NSMutableDictionary *customExtDic = [NSMutableDictionary dictionary];
            [customExtDic setValue:loginConfig.setCustomExt forKey:@"custom_ext"];
            [loginExt setValue:customExtDic forKey:@"ext"];
        }
        switch (loginType) {
            case LoginTypeW:
                [loginExt setValue:config.wxAppid forKey:@"appid"];
                break;
            case LoginTypeAuth:
                [loginExt setValue:config.quickphoneKey forKey:@"appid"];
                break;
            default:
                break;
        }
        NSLog(@"loginExt:%@", loginExt);
        return loginExt;
    };
    
    [RXUIUserUtility sharedManager].loginTypeBlock = self.loginEventBlock;
    
    NSMutableArray *accounts = [RXUIUserUtility sharedManager].accounts;
    
//    BOOL isHistoryViewEnable = config.isHistoryViewEnable;
    
    BOOL isHistoryViewEnable = NO;
    
    if (config.method && config.method.length > 0 && config.loginOpenid && config.loginOpenid.length > 0) {
        [[RXLoginViewManager sharedSDK] loginWithconfig:loginConfig complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
            if (complete) {
                complete(response, error);
            }
        }];
        return;
    }
    
    [RXUIUserUtility sharedManager].isFirstView = YES;
    // 配置了一键登录直接弹一键登录
    BOOL hasAuthLogin = YES;
//        for (int i = 0; i < loginConfig.loginTypes.count; i++) {
//            if ([loginConfig.loginTypes[i] isEqualToString:@"auth"] || [loginConfig.loginTypes[i] isEqualToString:@"quickphone"]) {
//                hasAuthLogin = YES;
//            }
//        }
    
    if (hasAuthLogin) {
        [RXUIUserUtility sharedManager].isAuthFirst = YES;
        RXUIAuthLoginView *authLoginView = [[RXUIAuthLoginView alloc] initWithConfig:loginConfig loginEvent:self.loginEventBlock complete:complete];
        authLoginView.loginComplete = complete;
    } else {
        [RXUIUserUtility sharedManager].isAuthFirst = NO;
        self.loginView = [[RXLoginView alloc] initWithConfig:loginConfig loginEvent:self.loginEventBlock complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
            if (complete) {
                complete(response, error);
            }
            
            if ([error.responesObject[@"code"] integerValue] == 6010) {
                if (self.loginView) {
                    self.loginView = nil;
                }
            }
        }];
    }
    
//    if (accounts.count > 0 && config.loginMode == LoginModeNormal && isHistoryViewEnable) {
//        // 常规模式
//        [RXUIUserUtility sharedManager].isFirstView = NO;
//        [RXUIUserUtility sharedManager].isAuthFirst = NO;
//        self.historyView = [[RXHistoryLoginView alloc] initWithConfig:loginConfig loginEvent:self.loginEventBlock complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
//            if (complete) {
//                complete(response, error);
//            }
//        }];
//        
//    } else if (accounts.count > 0 && config.loginMode == LoginModeQuick) {
//        // 快速模式
//        RXHistoryListLoginView *historyListView = [[RXHistoryListLoginView alloc] initWithLoginConfig:loginConfig loginEvent:self.loginEventBlock complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
//            if (complete) {
//                complete(response, error);
//            }
//        }];
//        
//    } else {
//        [RXUIUserUtility sharedManager].isFirstView = YES;
//        // 配置了一键登录直接弹一键登录
//        BOOL hasAuthLogin = YES;
////        for (int i = 0; i < loginConfig.loginTypes.count; i++) {
////            if ([loginConfig.loginTypes[i] isEqualToString:@"auth"] || [loginConfig.loginTypes[i] isEqualToString:@"quickphone"]) {
////                hasAuthLogin = YES;
////            }
////        }
//        
//        if (hasAuthLogin) {
//            [RXUIUserUtility sharedManager].isAuthFirst = YES;
//            RXUIAuthLoginView *authLoginView = [[RXUIAuthLoginView alloc] initWithConfig:loginConfig loginEvent:self.loginEventBlock complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
//                
//            }];
//            authLoginView.loginComplete = complete;
//        } else {
//            [RXUIUserUtility sharedManager].isAuthFirst = NO;
//            self.loginView = [[RXLoginView alloc] initWithConfig:loginConfig loginEvent:self.loginEventBlock complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
//                if (complete) {
//                    complete(response, error);
//                }
//            }];
//        }
//    }
}

/**
 * 调用登录弹窗
 * @param config 登录页基础配置
 * @param loginEvent 页面操作事件，可回调自定义参数
 * @param complete 登录结果
 */
- (void)setLoginViewWithConfig:(RXLoginUIConfig *)config
                    loginEvent:(NSDictionary *(^)(NSDictionary *loginEvent, LoginType loginType))loginEvent
                      complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    // 没传配置读配置文件
    if (!config) {
        config = [RXUICommonTool fetchInitProfile];
    }
    
    if (config.privacies.count <= 0 || !config.privacies) {
        __block RXLegalData *legalModel = [RXLegalData rxu_modelWithDictionary:[RXUIUserUtility sharedManager].legalModel];
        if ([RXUIUserUtility sharedManager].legalModel && [RXUIUserUtility sharedManager].legalModel.allKeys.count > 0) {
            NSString *priContent1 = @"";
            NSString *priContent2 = @"";
            for (int i = 0; i < legalModel.terms.count; i++) {
                RXLegalData_term *term = legalModel.terms[i];
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
                    [RXUIUserUtility sharedManager].legalModel = [NSMutableDictionary dictionaryWithDictionary:response];
                    legalModel = [RXLegalData rxu_modelWithDictionary:[RXUIUserUtility sharedManager].legalModel];
                    NSString *priContent1 = @"";
                    NSString *priContent2 = @"";
                    for (int i = 0; i < legalModel.terms.count; i++) {
                        RXLegalData_term *term = legalModel.terms[i];
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
    
    if (!config.logoImage) {
        config.logoImage = [UIImage rxBundleImageNamed:@"rx_logoImage"];
    }
    
    NSMutableArray *loginTypes = [NSMutableArray arrayWithArray:config.loginTypes];
    NSMutableArray *removeIndexs = [NSMutableArray array];
    for (int i = 0; i < loginTypes.count; i++) {
        if ([loginTypes[i] isEqualToString:@"captchacode"]) {
            [loginTypes replaceObjectAtIndex:i withObject:@"code"];
        }
        if ([loginTypes[i] isEqualToString:@"captchacode"] ||
            [loginTypes[i] isEqualToString:@"code"] ||
            [loginTypes[i] isEqualToString:@"username"] ||
            [loginTypes[i] isEqualToString:@"auth"] ||
            [loginTypes[i] isEqualToString:@"quickphone"]) {
            [removeIndexs addObject:loginTypes[i]];
        }
    }
    
    if (removeIndexs.count > 0) {
        for (int i = 0; i < removeIndexs.count; i++) {
            [loginTypes removeObject:removeIndexs[i]];
        }
    }
    
    config.loginTypes = loginTypes;
    
    [RXUIUserUtility sharedManager].privacies = config.privacies;
    [RXUIUserUtility sharedManager].privacieTitles = config.privacieTitles;
    [RXUIUserUtility sharedManager].loginConfig = config;
    [RXUIUserUtility sharedManager].loginTypes = [NSMutableArray arrayWithArray:config.loginTypes];
    [RXUIUserUtility sharedManager].loginTypeBlock = loginEvent;
    
    NSMutableArray *accounts = [RXUIUserUtility sharedManager].accounts;
    
    if (accounts.count > 0) {
        [RXUIUserUtility sharedManager].isFirstView = NO;
        [RXUIUserUtility sharedManager].isAuthFirst = NO;
        self.historyView = [[RXHistoryLoginView alloc] initWithConfig:config loginEvent:loginEvent complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
            if (complete) {
                complete(response, error);
            }
        }];
    } else {
        [RXUIUserUtility sharedManager].isFirstView = YES;
        // 配置了一键登录直接弹一键登录
        BOOL hasAuthLogin = YES;
//        for (int i = 0; i < config.loginTypes.count; i++) {
//            if ([config.loginTypes[i] isEqualToString:@"auth"] || [config.loginTypes[i] isEqualToString:@"quickphone"]) {
//                hasAuthLogin = YES;
//            }
//        }
        
        if (hasAuthLogin) {
            [RXUIUserUtility sharedManager].isAuthFirst = YES;
            RXUIAuthLoginView *authLoginView = [[RXUIAuthLoginView alloc] initWithConfig:config loginEvent:loginEvent complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
                
            }];
            authLoginView.loginComplete = complete;
        } else {
            [RXUIUserUtility sharedManager].isAuthFirst = NO;
            self.loginView = [[RXLoginView alloc] initWithConfig:config loginEvent:loginEvent complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
                if (complete) {
                    complete(response, error);
                }
            }];
        }
    }
}

/**
 * 调用登录弹窗
 * 不显示快捷登录页面
 * @param config 登录页基础配置
 * @param loginEvent 页面操作事件，可回调自定义参数
 * @param complete 登录结果
 */
- (void)setNormalLoginViewWithConfig:(RXLoginUIConfig *)config
                              isAuth:(BOOL)isAuth
                          loginEvent:(NSDictionary *(^)(NSDictionary *loginEvent, LoginType loginType))loginEvent
                            complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    // 没传配置读配置文件
    if (!config) {
        config = [RXUICommonTool fetchInitProfile];
    }
    
    if (config.privacies.count <= 0 || !config.privacies) {
        RXLegalData *legalModel = [RXLegalData rxu_modelWithDictionary:[RXUIUserUtility sharedManager].legalModel];
        NSString *priContent1 = @"";
        NSString *priContent2 = @"";
        for (int i = 0; i < legalModel.terms.count; i++) {
            RXLegalData_term *term = legalModel.terms[i];
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
        config.logoImage = [UIImage rxBundleImageNamed:@"rx_logoImage"];
    }
    
    NSMutableArray *loginTypes = [NSMutableArray arrayWithArray:config.loginTypes];
    for (int i = 0; i < loginTypes.count; i++) {
        if ([loginTypes[i] isEqualToString:@"captchacode"]) {
            [loginTypes replaceObjectAtIndex:i withObject:@"code"];
        }
    }
    config.loginTypes = loginTypes;
    
    [RXUIUserUtility sharedManager].privacies = config.privacies;
    [RXUIUserUtility sharedManager].privacieTitles = config.privacieTitles;
    [RXUIUserUtility sharedManager].loginConfig = config;
    [RXUIUserUtility sharedManager].loginTypes = [NSMutableArray arrayWithArray:config.loginTypes];
    [RXUIUserUtility sharedManager].loginTypeBlock = loginEvent;
    
//    [RXUIUserUtility sharedManager].isFirstView = YES;
    // 配置了一键登录直接弹一键登录
    BOOL hasAuthLogin = YES;
    for (int i = 0; i < config.loginTypes.count; i++) {
        if ([config.loginTypes[i] isEqualToString:@"auth"] || [config.loginTypes[i] isEqualToString:@"quickphone"]) {
            hasAuthLogin = YES;
        }
    }
    
    if (hasAuthLogin && isAuth) {
        [RXUIUserUtility sharedManager].isAuthFirst = YES;
        RXUIAuthLoginView *authLoginView = [[RXUIAuthLoginView alloc] initWithConfig:config loginEvent:loginEvent complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
            
        }];
        authLoginView.loginComplete = complete;
        
    } else {
        [RXUIUserUtility sharedManager].isAuthFirst = NO;
        self.loginView = [[RXLoginView alloc] initWithConfig:config loginEvent:loginEvent complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
            if (complete) {
                complete(response, error);
            }
        }];
        
//        NSMutableArray *accounts = [NSMutableArray arrayWithArray:[RXUIUserUtility sharedManager].accounts];
        if ([RXUIUserUtility sharedManager].accounts && [RXUIUserUtility sharedManager].accounts.count > 0) {
            NSMutableDictionary *userInfo = [RXUIUserUtility sharedManager].accounts[0];
            if (userInfo && userInfo.allKeys.count > 0) {
                long loginType = [userInfo[@"loginType"] longValue];
                NSString *method = [RXUICommonTool toMethodStr:loginType];
                if ([method isEqualToString:@"captchacode"] || [method isEqualToString:@"code"]) {
                    if (userInfo[@"username"]) {
                        self.loginView.username = userInfo[@"username"];
                    }
                    
                    BOOL hasCode = NO;
                    for (int i = 0; i < loginTypes.count; i++) {
                        if ([loginTypes[i] isEqualToString:@"captchacode"] || [loginTypes[i] isEqualToString:@"code"]) {
                            hasCode = YES;
                        }
                    }
                    
                    if (hasCode) {
                        config.loginViewType = 1;
                        self.loginView.codeLoginBtn.selected = NO;
                        [self.loginView codeLoginBtnAction:self.loginView.codeLoginBtn];
                    }
                }
                if ([method isEqualToString:@"username"]) {
                    if (self.loginView.username.length > 0) {
                        self.loginView.username = @"";
                    } else {
                        if (userInfo[@"username"]) {
                            self.loginView.username = userInfo[@"username"];
                        }
                    }
                    
                    BOOL hasAccount = NO;
                    for (int i = 0; i < loginTypes.count; i++) {
                        if ([loginTypes[i] isEqualToString:@"username"]) {
                            hasAccount = YES;
                        }
                    }
                    
                    if (!hasAccount) {
                        config.loginViewType = 1;
                        self.loginView.codeLoginBtn.selected = NO;
                        [self.loginView codeLoginBtnAction:self.loginView.codeLoginBtn];
                    }
                }
                
                BOOL hasAccount = NO;
                for (int i = 0; i < loginTypes.count; i++) {
                    if ([loginTypes[i] isEqualToString:@"username"]) {
                        hasAccount = YES;
                    }
                }
                
                if (![method isEqualToString:@"captchacode"] && ![method isEqualToString:@"username"] && !hasAccount) {
                    config.loginViewType = 1;
                    self.loginView.codeLoginBtn.selected = NO;
                    [self.loginView codeLoginBtnAction:self.loginView.codeLoginBtn];
                }
            }
        }
    }
}

/**
 * 调用一键登录登录弹窗
 * @note 仅弹出一键登录，不支持配置多登录方式
 * @param config 登录页基础配置，默认读取后台配置，优先读取代码配置
 * @param complete 登录结果
 */
- (void)showAuthLoginViewWithConfig:(RXLoginUIModel *)config
                           complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    if (!config) {
        config = [[RXLoginUIModel alloc] init];
    }
    RXLoginUIConfig *loginConfig = [RXUICommonTool toConfig:config];
    
    if (config.privacies.count <= 0 || !config.privacies) {
        __block RXLegalData *legalModel = [RXLegalData rxu_modelWithDictionary:[RXUIUserUtility sharedManager].legalModel];
        if ([RXUIUserUtility sharedManager].legalModel && [RXUIUserUtility sharedManager].legalModel.allKeys.count > 0) {
            NSString *priContent1 = @"";
            NSString *priContent2 = @"";
            for (int i = 0; i < legalModel.terms.count; i++) {
                RXLegalData_term *term = legalModel.terms[i];
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
                    [RXUIUserUtility sharedManager].legalModel = [NSMutableDictionary dictionaryWithDictionary:response];
                    legalModel = [RXLegalData rxu_modelWithDictionary:[RXUIUserUtility sharedManager].legalModel];
                    NSString *priContent1 = @"";
                    NSString *priContent2 = @"";
                    for (int i = 0; i < legalModel.terms.count; i++) {
                        RXLegalData_term *term = legalModel.terms[i];
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
        
        if (config.privacies.count > 0) {
            loginConfig.privacies = config.privacies;
        }
    }
    
    if (!loginConfig.logoImage) {
        loginConfig.logoImage = [UIImage rxBundleImageNamed:@"rx_logoImage"];
    }
    
    loginConfig.loginTypes = @[];
    
    [RXUIUserUtility sharedManager].privacies = loginConfig.privacies;
    [RXUIUserUtility sharedManager].privacieTitles = loginConfig.privacieTitles;
    [RXUIUserUtility sharedManager].loginConfig = loginConfig;
    [RXUIUserUtility sharedManager].loginUIModel = config;
    
    self.loginEventBlock = ^NSDictionary *(NSDictionary *loginEvent, LoginType loginType) {
        NSMutableDictionary *loginExt = [NSMutableDictionary dictionaryWithDictionary:config.setCustomParams];
        if ([loginConfig.setCustomExt isKindOfClass:[NSDictionary class]] && loginConfig.setCustomExt.allKeys.count > 0) {
            NSMutableDictionary *customExtDic = [NSMutableDictionary dictionary];
            [customExtDic setValue:loginConfig.setCustomExt forKey:@"custom_ext"];
            [loginExt setValue:customExtDic forKey:@"ext"];
        }
        switch (loginType) {
            case LoginTypeAuth:
                [loginExt setValue:config.quickphoneKey forKey:@"appid"];
                break;
            default:
                break;
        }
        NSLog(@"loginExt:%@", loginExt);
        return loginExt;
    };
    
    [RXUIUserUtility sharedManager].loginTypeBlock = self.loginEventBlock;
    
    if (config.method && config.method.length > 0 && config.loginOpenid && config.loginOpenid.length > 0) {
        [[RXLoginViewManager sharedSDK] loginWithconfig:loginConfig complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
            if (complete) {
                complete(response, error);
            }
        }];
        return;
    }
    
    [RXUIUserUtility sharedManager].isFirstView = YES;
    [RXUIUserUtility sharedManager].isAuthFirst = YES;
    
    RXUISingleAuthLoginView *authLoginView = [[RXUISingleAuthLoginView alloc] initWithConfig:loginConfig loginEvent:self.loginEventBlock complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
        
    }];
    authLoginView.loginComplete = complete;
}

/**
 * 调用验证码/账号密码登录弹窗
 * @note 仅弹出验证码/账号密码登录，不支持配置多登录方式
 * @param config 登录页基础配置，默认读取后台配置，优先读取代码配置
 * @param complete 登录结果
 */
- (void)showAccountLoginViewWithConfig:(RXLoginUIModel *)config
                              complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    if (!config) {
        config = [[RXLoginUIModel alloc] init];
    }
    RXLoginUIConfig *loginConfig = [RXUICommonTool toConfig:config];
    
    if (config.privacies.count <= 0 || !config.privacies) {
        __block RXLegalData *legalModel = [RXLegalData rxu_modelWithDictionary:[RXUIUserUtility sharedManager].legalModel];
        if ([RXUIUserUtility sharedManager].legalModel && [RXUIUserUtility sharedManager].legalModel.allKeys.count > 0) {
            NSString *priContent1 = @"";
            NSString *priContent2 = @"";
            for (int i = 0; i < legalModel.terms.count; i++) {
                RXLegalData_term *term = legalModel.terms[i];
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
                    [RXUIUserUtility sharedManager].legalModel = [NSMutableDictionary dictionaryWithDictionary:response];
                    legalModel = [RXLegalData rxu_modelWithDictionary:[RXUIUserUtility sharedManager].legalModel];
                    NSString *priContent1 = @"";
                    NSString *priContent2 = @"";
                    for (int i = 0; i < legalModel.terms.count; i++) {
                        RXLegalData_term *term = legalModel.terms[i];
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
        
        if (config.privacies.count > 0) {
            loginConfig.privacies = config.privacies;
        }
    }
    
    if (!loginConfig.logoImage) {
        loginConfig.logoImage = [UIImage rxBundleImageNamed:@"rx_logoImage"];
    }
    
    loginConfig.loginTypes = @[];
    
    [RXUIUserUtility sharedManager].privacies = loginConfig.privacies;
    [RXUIUserUtility sharedManager].privacieTitles = loginConfig.privacieTitles;
    [RXUIUserUtility sharedManager].loginConfig = loginConfig;
    
    self.loginEventBlock = ^NSDictionary *(NSDictionary *loginEvent, LoginType loginType) {
        NSMutableDictionary *loginExt = [NSMutableDictionary dictionaryWithDictionary:config.setCustomParams];
        if ([loginConfig.setCustomExt isKindOfClass:[NSDictionary class]] && loginConfig.setCustomExt.allKeys.count > 0) {
            NSMutableDictionary *customExtDic = [NSMutableDictionary dictionary];
            [customExtDic setValue:loginConfig.setCustomExt forKey:@"custom_ext"];
            [loginExt setValue:customExtDic forKey:@"ext"];
        }
        NSLog(@"loginExt:%@", loginExt);
        return loginExt;
    };
    
    [RXUIUserUtility sharedManager].loginTypeBlock = self.loginEventBlock;
    
    if (config.method && config.method.length > 0 && config.loginOpenid && config.loginOpenid.length > 0) {
        [[RXLoginViewManager sharedSDK] loginWithconfig:loginConfig complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
            if (complete) {
                complete(response, error);
            }
        }];
        return;
    }
    
    [RXUIUserUtility sharedManager].isFirstView = YES;
    [RXUIUserUtility sharedManager].isAuthFirst = NO;
    
    self.singleLoginView = [[RXSingleLoginView alloc] initWithConfig:loginConfig loginEvent:self.loginEventBlock complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {

        if (complete) {
            complete(response, error);
        }
        
        if ([error.responesObject[@"code"] integerValue] == 6010) {
            if (self.singleLoginView) {
                self.singleLoginView = nil;
            }
        }
    }];
    
    if ([RXUIUserUtility sharedManager].accounts && [RXUIUserUtility sharedManager].accounts.count > 0) {
        NSMutableDictionary *userInfo = [RXUIUserUtility sharedManager].accounts[0];
        if (userInfo && userInfo.allKeys.count > 0) {
            if (self.singleLoginView.username.length > 0) {
                self.singleLoginView.username = @"";
            } else {
                if (userInfo[@"username"]) {
                    self.singleLoginView.username = userInfo[@"username"];
                }
            }
        }
    }
}

// 关闭登陆弹窗
- (void)closeLoginView
{
    if ([RXUIUserUtility sharedManager].accounts.count > 0) {

    } else {
        if (self.loginView) {
            [self.loginView hide];
        }
        if (self.singleLoginView) {
            [self.singleLoginView hide];
        }
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
    self.addLoginView = [[RXAddLoginView alloc] initWithIsSelect:isSelect extDic:extDic complete:complete];
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
//    [RXUIUserUtility sharedManager].protocolKey = key;
//    [RXUIUserUtility sharedManager].protocolKeyList = keyList;
    RXWKWebView *webView = [[RXWKWebView alloc] initWithFrame:[UIApplication sharedApplication].keyWindow.frame];
    webView.protocolKey = key;
    webView.protocolKeyList = keyList;
    
    NSString *domain = [[RXService sharedSDK] getFirstBaseUrl];
    if (![[domain substringWithRange:NSMakeRange(domain.length - 1, 1)] isEqualToString:@"/"]) {
        domain = [NSString stringWithFormat:@"%@/", domain];
    }
    
//    webView.urlStr = @"https://10.10.2.64:8083/static/passport/#/protocol/protocollist";
    webView.urlStr = [NSString stringWithFormat:@"%@static/passport/#/protocol/protocollist", domain];
    
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
    RXPrivacyView *pricacyView = [[RXPrivacyView alloc] initWithKey:key legalData:legalData];
}

/**
 * 实名认证
 * @param canClose 是否展示关闭按钮，默认不展示
 */
- (void)setRealauthViewWithCanClose:(BOOL)canClose
                           complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    RXApproveView *approve = [[RXApproveView alloc] initWithCanColose:canClose complete:complete];
}

/**
 * 实名认证
 */
- (void)setRealauthViewWithComplete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    RXApproveView *approve = [[RXApproveView alloc] initWithCanColose:NO complete:complete];
}

/**
 * 关闭实名认证弹窗
 */
- (void)closeRealauthView
{
    for (UIView *v in [UIApplication sharedApplication].keyWindow.subviews) {
        if ([v isKindOfClass:[RXApproveView class]]) {
            RXApproveView *approView = (RXApproveView *)v;
            [approView hide];
        }
    }
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
    RXAntiAddictionView *anti = [[RXAntiAddictionView alloc] initWithDesStr:des title:title btnTitle:btnTitle block:complete];
}

/**
 * 权限说明弹框
 * @param keys 要展示的权限key 传空展示所有权限
 * @param clickBlock 点击事件回调   status 0拒绝  1同意
 */
- (void)setLimitViewWithKeys:(NSArray * _Nullable)keys
                  clickBlock:(void(^)(NSInteger status))clickBlock
{
    RXLimitsView *limit = [[RXLimitsView alloc] initWithKeys:keys clickBlock:clickBlock];
}

/**
 * 权限说明弹框
 * @param legalData 法务信息api返回的数据
 * @param clickBlock 点击事件回调   status 0拒绝  1同意
 */
- (void)setPermissionViewWithLegalData:(NSDictionary *)legalData
                            clickBlock:(void(^)(NSInteger status))clickBlock
{
    RXLimitsView *limit = [[RXLimitsView alloc] initWithLegalData:legalData clickBlock:clickBlock];
}

/**
 * 绑定手机
 */
- (void)bindingPhoneWithComplete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    RXRegistView *regist = [[RXRegistView alloc] initWithType:RegistViewType_binding extDic:nil complete:nil];
    regist.bindingBlock = complete;
}

/**
 * 申请注销
 * @param config 基础配置
 */
- (void)applyForDeregisterWithConfig:(RXUserCenterConfig *)config
                            complete:(void(^)(NSDictionary *response))complete
{
    [RXUIUserUtility sharedManager].userCenterConfig = config;
    RXWKWebView *webView = [[RXWKWebView alloc] initWithFrame:[UIApplication sharedApplication].keyWindow.frame];
    
    NSString *domain = [[RXService sharedSDK] getFirstBaseUrl];
    if (![[domain substringWithRange:NSMakeRange(domain.length - 1, 1)] isEqualToString:@"/"]) {
        domain = [NSString stringWithFormat:@"%@/", domain];
    }
    
//    webView.urlStr = @"https://10.10.2.64:8083/static/passport/#/user/unregistercondition";
    webView.urlStr = [NSString stringWithFormat:@"%@static/passport/#/user/unregistercondition", domain];
    
    webView.complete = complete;
//        webView.urlStr =  @"https://www.baidu.com";
    [[UIApplication sharedApplication].keyWindow addSubview:webView];
}

/**
 * 撤销注销
 * @param deregisterType login登录，logout退出登录
 */
- (void)destroyAccountStatusViewWithDeregisterType:(NSString *)deregisterType
                                          complete:(void(^)(DestroyClickType clickType))complete
{
    RXDestroyAccountView *desAccountView = [[RXDestroyAccountView alloc] initWithType:DestroyType_repeal reason:@"已提交注销申请" clickBlock:complete];
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
    RXDestroyAccountView *desAccountView = [[RXDestroyAccountView alloc] initWithBtnTitle:btnTitle reason:@"已提交注销申请" diyClickBlock:complete];
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
    RXGetBackPasswordView *getBackView = [[RXGetBackPasswordView alloc] initWithType:GetBackPasswordType_code phone:@"" code:@""];
    getBackView.complete = complete;
}

/**
 * 设置密码
 */
- (void)setPasswordWithComplete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    RXSetPasswordView *setPasswordView = [[RXSetPasswordView alloc] initWithComplete:complete];
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
    RXGetBackPasswordView *getBackView = [[RXGetBackPasswordView alloc] initWithType:GetBackPasswordType_code phone:@"" code:@""];
    getBackView.params = params;
    getBackView.requestBlock = requestParams;
    getBackView.complete = complete;
}

/**
 * 用户中心
 * @param config 基础配置
 */
- (void)userCenterWithConfig:(RXUserCenterConfig *)config
                    complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    if (!config) {
        config = [[RXUserCenterConfig alloc] init];
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
    
    [RXUIUserUtility sharedManager].userCenterConfig = config;
    RXUserCenterView *userCenter = [[RXUserCenterView alloc] initWithConfig:config complete:complete];
}

/**
 * 用户中心
 * @param config 基础配置
 */
- (void)userCenterUIWithConfig:(RXUserCenterConfig *)config
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
        if ([subView isKindOfClass:[RXUserCenterView class]]) {
            RXUserCenterView *userCenter = (RXUserCenterView *)subView;
            [userCenter hide];
        }
    }
}

/**
 * 帮助中心
 * @param config 基础配置
 */
- (void)serviceCenterWithConfig:(RXUserCenterConfig *)config
                       complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    [RXUIUserUtility sharedManager].userCenterConfig = config;
    if ([RXUIUserUtility sharedManager].isShowServiceCenter) {
        [self.serviceCenter showView];
    } else {    
//        self.serviceCenter = [[RXServiceCenterView alloc] initWithConfig:config type:ServiceType_center complete:complete];
        
        self.serviceCenter = [[RXWKController alloc] init];
        self.serviceCenter.type = ServiceType_center;
        self.serviceCenter.modalPresentationStyle = UIModalPresentationFullScreen;
        [[UIViewController currentViewController] presentViewController:self.serviceCenter animated:NO completion:nil];
    }
}

/**
 * 客服
 * @param config 基础配置
 */
- (void)chatServiceWithConfig:(RXUserCenterConfig *)config
                     complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    [RXUIUserUtility sharedManager].userCenterConfig = config;
    if ([RXUIUserUtility sharedManager].isShowServiceCenter) {
        [self.chatService showView];
    } else {
//        self.serviceCenter = [[RXServiceCenterView alloc] initWithConfig:config type:ServiceType_chat complete:complete];
        
        self.chatService = [[RXWKController alloc] init];
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
    RXCommonWKWebView *webView = [[RXCommonWKWebView alloc] initWithUrl:url title:title content:nil];
}

/**
 * 同步账号登录记录
 * @param accounts 账号数组
 * ！accounts结构说明:
 * @[@{@"username" : @"", @"password" : @""}]
 */
- (void)syncAccounts:(NSArray <NSDictionary *> *)accounts
{
    NSMutableArray *localAccounts = [NSMutableArray arrayWithArray:[RXUIUserUtility sharedManager].accounts];
    
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
    
    [RXUIUserUtility saveAccounts:localAccounts];
}

/**
 * 隐私政策弹框
 * @param agree YES 同意，NO 拒绝
 */
- (void)userPrivacyPolicyWithComplete:(void(^)(BOOL agree))complete
{
    RXPrivacyLimitView *limitView = [[RXPrivacyLimitView alloc] initWithClickBlock:complete];
}

/**
 * 展示邮件
 * cpUserId cp方userID
 */
- (void)showEmailViewWithCpUserId:(NSString *)cpUserId
                     withComplete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complet
{
    self.emailListView = [[RXEmailListView alloc] initWithCpUserId:cpUserId ];
}

/**
 * 绑定手机，如果已绑定手机会跳转到换绑页面
 */
- (void)bindPhoneWithComplete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete{
    RXWKWebView *webView = [[RXWKWebView alloc] initWithFrame:[UIApplication sharedApplication].keyWindow.frame];
    
    NSString *domain = [[RXService sharedSDK] getFirstBaseUrl];
    if (![[domain substringWithRange:NSMakeRange(domain.length - 1, 1)] isEqualToString:@"/"]) {
        domain = [NSString stringWithFormat:@"%@/", domain];
    }
    webView.urlStr = [NSString stringWithFormat:@"%@static/passport/#/user/changephone", domain];
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
 * 是否允许使用三方键盘
 */
- (BOOL)allowExtensionPointIdentifier
{
    return [RXUIUserUtility sharedManager].allowExtensionPointIdentifier;
}

#pragma mark -- <notiActions>
- (void)passwordChange:(NSNotification *)noti
{
    NSString *password = noti.userInfo[@"password"];
//    [RXUICommonTool saveAccountWithUsername:[RXUIUserUtility sharedManager].phone password:password];
}

- (void)loginCallBack:(NSNotification *)noti
{
    NSMutableDictionary *notiDic = [NSMutableDictionary dictionaryWithDictionary:noti.userInfo];

    NSDictionary *loginModel = notiDic[@"data"];
    NSInteger code = [loginModel[@"code"] integerValue];
    NSString *tipString = loginModel[@"msg"];
    if (loginModel && code == 0) {
        for (UIView *subView in [UIApplication sharedApplication].keyWindow.subviews) {
            if ([subView isKindOfClass:[RXLoginView class]]) {
                self.loginView = (RXLoginView *)subView;
            }
            if ([subView isKindOfClass:[RXSingleLoginView class]]) {
                self.singleLoginView = (RXSingleLoginView *)subView;
            }
        }
//        [SVProgressHUD showSuccessWithStatus:@"登录成功"];
        [RXHUD hideHUD];
        [RXUIUserUtility saveLoginModel:loginModel];
        [self.loginView hide];
        [self.historyView hide];
        
        if (self.singleLoginView) {
            [self.singleLoginView hide];
        }
        
        for (UIView *v in [UIApplication sharedApplication].keyWindow.subviews) {
            if ([v isKindOfClass:[RXMoreLoginView class]]) {
                [v removeFromSuperview];
            }
        }
        
//        [[TXCommonHandler sharedInstance] cancelLoginVCAnimated:NO complete:^{
//            NSLog(@"关闭一键登录页面");
//        }];
        
        [self.loginDelegate rxu_LoginCallBackWithResponse:notiDic error:nil];
    } else {
        NSString *msg = loginModel[@"msg"];
        if (code == 1120) {
            msg = @"网络请求失败，请重试或检查网络设置";
        }
        
        if (code == 302204 || code == 302205) {
            return;
        } else {
//            [RXHUD showErrorText:tipString];
        }
        RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
        
        err.responesObject = loginModel;
        [self.loginDelegate rxu_LoginCallBackWithResponse:nil error:err];
    }

    NSNumber *loginType = notiDic[@"loginType"];
    if (loginType) {
        [RXUIUserUtility saveLoginType:loginType];
    }
}

/**
 * 展示公告
 * limit 展示公告条数
 * linkCallBack 如果用户点击了链接，则链接由此返回，后续可使用此链接做业务处理
 * ishasCallBack 是否有公告，YES有，NO没有
 */
- (void)showAnnounceViewWithLimit:(int)limit linkCallBack:(void(^)(NSString *link))linkCallBack isHasCallBack:(void(^)(BOOL isHas))ishasCallBack{
    self.announcementView = [[RXAnnouncementView alloc] initWithAnnouncementWithLimit:limit linkCallBack:^(NSString * _Nonnull link) {
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
    self.announcementView = [[RXAnnouncementView alloc] initWithAnnouncementWithLimit:1 title:title content:content linkCallBack:^(NSString * _Nonnull link) {
        if (linkCallBack) {
            linkCallBack(link);
        }
    }];
}

/**
 * 设置 webView
 */
- (void)setWebView:(WKWebView *)webView
{
    RXWKInsideWebView *insideWebView = [[RXWKInsideWebView alloc] initWithWebView:webView];
}

///**
// * 我的意见反馈列表
// */
//- (void)showFeedbackListView{
//    self.feedbackListView = [[RXFeedbackListView alloc] init];
//}
//
///**
// * 创建意见反馈
// */
//- (void)showCreateFeedbackView{
//    self.feedbackUploadView = [[RXFeedbackUploadView alloc] init];
//}

@end
