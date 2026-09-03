//
//  RXUISingleAuthLoginView.m
//  RXUIKit
//
//  Created by 陈汉 on 2025/6/23.
//

#import "RXUISingleAuthLoginView.h"
#import "RXUICommonTool.h"
#import "RXQuickLoginView.h"
#import "RXPriView.h"
#import "RXLoginViewManager.h"
#import "RXLoginView.h"
#import "RXUIKitService.h"
#import "RXCommonWKWebView.h"
#import "RXUIAuthLoginFailView.h"

typedef void(^CallBack)(NSString *token);

#define SCALE 0.0001

@interface RXUISingleAuthLoginView ()

@property (nonatomic, strong) TXCustomModel *customModel;
@property (nonatomic, strong) NSString *atauth_appkey;
@property (nonatomic, copy) CallBack callBack;
@property (nonatomic, strong) NSMutableDictionary *loginExt;
@property (nonatomic, assign) BOOL isSelect;
@property (nonatomic, strong) RXLoginUIConfig *loginConfig;
@property (nonatomic, assign) BOOL isFirstView; // 是否直接展示
@property (nonatomic, assign) BOOL isCanShow;
@property (nonatomic, assign) BOOL isFirstViewLoad; // 是否直接展示

@end

@implementation RXUISingleAuthLoginView

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (instancetype)initWithConfig:(RXLoginUIConfig *)config
                       authKey:(NSString *)authKey
                    loginEvent:(NSDictionary *)loginEvent
                      complete:(void(^)(NSString *token))complete
{
    self = [super init];
    if (self) {
        self.callBack = complete;
        self.atauth_appkey = authKey;
        self.isSelect = NO;
        self.loginConfig = config;
        self.loginTypeBlock = [RXUIUserUtility sharedManager].loginTypeBlock;
        
        NSDictionary *loginExt = [NSDictionary dictionary];
        if (self.loginTypeBlock) {
            loginExt = self.loginTypeBlock(loginExt, LoginTypeAuth);
            self.loginExt = [NSMutableDictionary dictionaryWithDictionary:loginExt];
        }
        
        [RXLoginViewManager sharedSDK];
        
        [self configATAuth];
        
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(hide) name:RXUINoti_closeAuthView object:nil];
    }
    return self;
}

- (instancetype)initWithConfig:(RXLoginUIConfig *)config
                    loginEvent:(LoginTypeBlock)loginEvent
                      complete:(LoginComplete)complete
{
    self = [super init];
    if (self) {
        self.loginComplete = complete;
        self.isSelect = NO;
        self.loginConfig = config;
        self.loginTypeBlock = [RXUIUserUtility sharedManager].loginTypeBlock;
        self.isFirstView = YES;
        
        [RXLoginViewManager sharedSDK];
        
        NSDictionary *loginExt = [NSDictionary dictionary];
        if (self.loginTypeBlock) {
            loginExt = self.loginTypeBlock(loginExt, LoginTypeAuth);
            self.loginExt = [NSMutableDictionary dictionaryWithDictionary:loginExt];
            self.atauth_appkey = loginExt[@"appid"];
            [self configATAuth];
        }
        
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(hide) name:RXUINoti_closeAuthView object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(privacySelectAction:) name:noti_privacySelected object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(applicationBecomeActive) name:UIApplicationWillEnterForegroundNotification object:nil];
    }
    return self;
}

- (void)privacySelectAction:(NSNotification *)noti
{
    self.isSelect = [noti.userInfo[@"selected"] boolValue];
    self.loginConfig.isPrivacySelected = self.isSelect;
    [[TXCommonHandler sharedInstance] setCheckboxIsChecked:self.isSelect];
}

- (void)hide
{
    [RXUIUserUtility sharedManager].isAuthShow = NO;
    self.isCanShow = NO;
    [[TXCommonHandler sharedInstance] cancelLoginVCAnimated:NO complete:^{
        NSLog(@"关闭一键登录页面");
        [RXUIUserUtility sharedManager].isClickQuickAuth = NO;
    }];
}

- (void)clickBgAction
{
    self.isCanShow = NO;
    [[TXCommonHandler sharedInstance] cancelLoginVCAnimated:YES complete:^{
        NSLog(@"关闭一键登录页面");
        [RXUIUserUtility sharedManager].isClickQuickAuth = NO;
    }];
}

- (void)configATAuth
{
    [RXHUD showHUD];
    
    // 用户行为上报
    NSMutableDictionary *thirdRes = [NSMutableDictionary dictionary];
    [thirdRes setValue:@"quickphone" forKey:@"method"];
    [[RXUserActionLogManager sharedSDK] addUserActionWithScene:@"login" action:@"show" properties:thirdRes];
    
    if (self.atauth_appkey.length > 0) {
        [[TXCommonHandler sharedInstance] setAuthSDKInfo:self.atauth_appkey
                                                complete:^(NSDictionary * _Nonnull resultDic) {
            NSLog(@"设置秘钥结果：%@", resultDic);
            if (![PNSCodeSuccess isEqualToString:[resultDic objectForKey:@"resultCode"]]) {
                self.isCanShow = NO;
    //            [RXHUD showErrorText:resultDic[@"msg"]];
                [RXHUD hideHUD];
                
                [[RXUIKitService sharedSDK] showAccountLoginViewWithConfig:[RXUIUserUtility sharedManager].loginUIModel complete:self.loginComplete];
                
                // 授权失败上报
                NSMutableDictionary *properties = [NSMutableDictionary dictionary];
                [properties setValue:@"quickphone_ali" forKey:@"method"];
                [properties setValue:rxlog_error_login_ui forKey:@"error_action"];
                if ([resultDic isKindOfClass:[NSDictionary class]] && resultDic.allKeys.count > 0) {
                    [properties setValue:resultDic forKey:@"result"];
                }
                [[RXLogService sharedSDK] dataTrackWithEvent:rxlog_error_ui distinctId:@"" properties:properties];
                
                // 用户行为上报
                NSMutableDictionary *thirdRes = [NSMutableDictionary dictionary];
                [thirdRes setValue:@"quickphone" forKey:@"method"];
                if ([resultDic isKindOfClass:[NSDictionary class]] && resultDic.allKeys.count > 0) {
                    [thirdRes setValue:resultDic forKey:@"third_res"];
                }
                [[RXUserActionLogManager sharedSDK] addUserActionWithScene:@"login" action:@"show_fail" properties:thirdRes];
                return;
            }
            
            //环境检查，异步返回
            [[TXCommonHandler sharedInstance] checkEnvAvailableWithAuthType:PNSAuthTypeLoginToken
                                                                   complete:^(NSDictionary * _Nullable resultDic) {
                NSLog(@"环境检查返回：%@", resultDic);
                if ([PNSCodeSuccess isEqualToString:[resultDic objectForKey:@"resultCode"]]) {
                    [[TXCommonHandler sharedInstance] accelerateLoginPageWithTimeout:3 complete:^(NSDictionary * _Nonnull resultDic) {
                        NSLog(@"为后面授权页拉起加个速，加速结果：%@", resultDic);
                        if ([PNSCodeSuccess isEqualToString:[resultDic objectForKey:@"resultCode"]] == NO) {
                            [RXUIUserUtility sharedManager].isAuthShow = NO;
                            
                            if ([RXUIUserUtility sharedManager].isFirstView) {
                                BOOL hasAccountLoginType = YES;
                                if (hasAccountLoginType) {
                                    [RXHUD hideHUD];
                                    
                                    // 用户行为上报
                                    NSMutableDictionary *thirdRes = [NSMutableDictionary dictionary];
                                    [thirdRes setValue:@"quickphone" forKey:@"method"];
                                    if ([resultDic isKindOfClass:[NSDictionary class]] && resultDic.allKeys.count > 0) {
                                        [thirdRes setValue:resultDic forKey:@"third_res"];
                                    }
                                    [[RXUserActionLogManager sharedSDK] addUserActionWithScene:@"login" action:@"show_fail" properties:thirdRes];
                                    
                                    [[RXUIKitService sharedSDK] showAccountLoginViewWithConfig:[RXUIUserUtility sharedManager].loginUIModel complete:self.loginComplete];
                                    
                                    // 授权失败上报
                                    NSMutableDictionary *properties = [NSMutableDictionary dictionary];
                                    [properties setValue:@"quickphone_ali" forKey:@"method"];
                                    [properties setValue:rxlog_error_login_ui forKey:@"error_action"];
                                    if ([resultDic isKindOfClass:[NSDictionary class]] && resultDic.allKeys.count > 0) {
                                        [properties setValue:resultDic forKey:@"result"];
                                    }
                                    [[RXLogService sharedSDK] dataTrackWithEvent:rxlog_error_ui distinctId:@"" properties:properties];
                                    
                                } else {
                                    [RXHUD showErrorText:resultDic[@"msg"]];
                                }
                                [RXUIUserUtility sharedManager].isFirstView = NO;
                            } else {
//                                [RXHUD showErrorText:resultDic[@"msg"]];
                                [RXHUD hideHUD];
                                
                                // 用户行为上报
                                NSMutableDictionary *thirdRes = [NSMutableDictionary dictionary];
                                [thirdRes setValue:@"quickphone" forKey:@"method"];
                                if ([resultDic isKindOfClass:[NSDictionary class]] && resultDic.allKeys.count > 0) {
                                    [thirdRes setValue:resultDic forKey:@"third_res"];
                                }
                                [[RXUserActionLogManager sharedSDK] addUserActionWithScene:@"login" action:@"show_fail" properties:thirdRes];
                                
                                [[RXUIKitService sharedSDK] showAccountLoginViewWithConfig:[RXUIUserUtility sharedManager].loginUIModel complete:self.loginComplete];
                                
                                // 授权失败上报
                                NSMutableDictionary *properties = [NSMutableDictionary dictionary];
                                [properties setValue:@"quickphone_ali" forKey:@"method"];
                                [properties setValue:rxlog_error_login_ui forKey:@"error_action"];
                                if ([resultDic isKindOfClass:[NSDictionary class]] && resultDic.allKeys.count > 0) {
                                    [properties setValue:resultDic forKey:@"result"];
                                }
                                [[RXLogService sharedSDK] dataTrackWithEvent:rxlog_error_ui distinctId:@"" properties:properties];
                            }
                        } else {
                            [self didLoginWithATAuth];
                            [RXUIUserUtility sharedManager].isAuthShow = YES;
                            [RXUIUserUtility sharedManager].isFirstView = NO;
                        }
                    }];
                    
    #warning t
    //                [[TXCommonHandler sharedInstance] debugLoginUIWithController:[UIViewController currentViewController] model:self.customModel complete:^(NSDictionary * _Nonnull resultDic) {
    //                    [UIView animateKeyframesWithDuration:0 delay:0 options:nil animations:^{
    //                        [UIView addKeyframeWithRelativeStartTime:0.15 relativeDuration:0 animations:^{
    //            //                [UIApplication sharedApplication].keyWindow.transform = CGAffineTransformMakeScale(0.5, 0.5);
    //
    //                            UIViewController *vc  = [UIViewController currentViewController];
    ////                            Class v = NSClassFromString(@"PNSLoginView");
    ////                            UIView *vd = (UIView *)v;
    //                            vc.view.transform = CGAffineTransformMakeScale(0.9, 0.9);
    //                            vc.view.center = [UIApplication sharedApplication].keyWindow.center;
    //                            for (UIView *v in vc.view.subviews) {
    //                                NSLog(@"%@", vc.class);
    //                                if ([v isKindOfClass:NSClassFromString(@"PNSLoginView")]) {
    //
    //                                    v.center = [UIApplication sharedApplication].keyWindow.center;
    //                                }
    //                            }
    //                            NSLog(@"");
    //                        }];
    //                    } completion:^(BOOL finished) {
    //                        self.customModel.contentViewFrameBlock = ^CGRect(CGSize screenSize, CGSize contentSize, CGRect frame) {
    //
    //                            CGFloat alertWidth = [RXUICommonTool getSingleScreenWidth];
    //                            CGFloat alertHeight = RXAC ? 358 : 361;
    //                            CGFloat alertX = RXUScreenWidth / 2 - alertWidth / 2;
    //                            CGFloat alertY = RXUScreenHeight / 2 - alertHeight / 2;
    //
    //                            alertX = RXUScreenWidth / 2 - (alertWidth * 0.9) / 2;
    //                            return CGRectMake(alertX + 100, alertY, alertWidth, alertHeight);
    //                        };
    //                    }];
    //                }];
                    
                } else {
                    self.isCanShow = NO;
                    if ([RXUIUserUtility sharedManager].isFirstView && ![RXUIUserUtility sharedManager].isClickQuickAuth) {
                        BOOL hasAccountLoginType = YES;
                        // 有账号密码或验证码登录弹直接弹出，没有则弹错误提示
                        for (int i = 0; i < self.loginConfig.loginTypes.count; i++) {
                            if ([self.loginConfig.loginTypes[i] isEqualToString:@"username"] ||
                                [self.loginConfig.loginTypes[i] isEqualToString:@"code"] ||
                                [self.loginConfig.loginTypes[i] isEqualToString:@"captchacode"]) {
                                hasAccountLoginType = YES;
                            }
                        }
                        
                        if (hasAccountLoginType) {
                            [RXHUD hideHUD];
                            
                            // 用户行为上报
                            NSMutableDictionary *thirdRes = [NSMutableDictionary dictionary];
                            [thirdRes setValue:@"quickphone" forKey:@"method"];
                            if ([resultDic isKindOfClass:[NSDictionary class]] && resultDic.allKeys.count > 0) {
                                [thirdRes setValue:resultDic forKey:@"third_res"];
                            }
                            [[RXUserActionLogManager sharedSDK] addUserActionWithScene:@"login" action:@"show_fail" properties:thirdRes];
                            
                            [[RXUIKitService sharedSDK] showAccountLoginViewWithConfig:[RXUIUserUtility sharedManager].loginUIModel complete:self.loginComplete];
                            
                            // 授权失败上报
                            NSMutableDictionary *properties = [NSMutableDictionary dictionary];
                            [properties setValue:@"quickphone_ali" forKey:@"method"];
                            [properties setValue:rxlog_error_login_ui forKey:@"error_action"];
                            if ([resultDic isKindOfClass:[NSDictionary class]] && resultDic.allKeys.count > 0) {
                                [properties setValue:resultDic forKey:@"result"];
                            }
                            [[RXLogService sharedSDK] dataTrackWithEvent:rxlog_error_ui distinctId:@"" properties:properties];
                        } else {
                            [RXHUD showErrorText:resultDic[@"msg"]];
                        }
    //                    [RXUIUserUtility sharedManager].isFirstView = NO;
                    } else {
                        if (!self.isCanShow && ![RXUIUserUtility sharedManager].isLoginViewShow) {
                            BOOL hasAccountLoginType = YES;
                            // 有账号密码或验证码登录弹直接弹出，没有则弹错误提示
                            for (int i = 0; i < self.loginConfig.loginTypes.count; i++) {
                                if ([self.loginConfig.loginTypes[i] isEqualToString:@"username"] ||
                                    [self.loginConfig.loginTypes[i] isEqualToString:@"code"] ||
                                    [self.loginConfig.loginTypes[i] isEqualToString:@"captchacode"]) {
                                    hasAccountLoginType = YES;
                                }
                            }
                            
                            if (hasAccountLoginType) {
                                [RXHUD hideHUD];
                                
                                // 用户行为上报
                                NSMutableDictionary *thirdRes = [NSMutableDictionary dictionary];
                                [thirdRes setValue:@"quickphone" forKey:@"method"];
                                if ([resultDic isKindOfClass:[NSDictionary class]] && resultDic.allKeys.count > 0) {
                                    [thirdRes setValue:resultDic forKey:@"third_res"];
                                }
                                [[RXUserActionLogManager sharedSDK] addUserActionWithScene:@"login" action:@"show_fail" properties:thirdRes];
                                
                                [[RXUIKitService sharedSDK] showAccountLoginViewWithConfig:[RXUIUserUtility sharedManager].loginUIModel complete:self.loginComplete];
                                
                                // 授权失败上报
                                NSMutableDictionary *properties = [NSMutableDictionary dictionary];
                                [properties setValue:@"quickphone_ali" forKey:@"method"];
                                [properties setValue:rxlog_error_login_ui forKey:@"error_action"];
                                if ([resultDic isKindOfClass:[NSDictionary class]] && resultDic.allKeys.count > 0) {
                                    [properties setValue:resultDic forKey:@"result"];
                                }
                                [[RXLogService sharedSDK] dataTrackWithEvent:rxlog_error_ui distinctId:@"" properties:properties];
                            } else {
                                [RXHUD showErrorText:resultDic[@"msg"]];
                            }
                            [RXUIUserUtility sharedManager].isFirstView = NO;
                        } else {
//                            [RXHUD showErrorText:resultDic[@"msg"]];
                            [RXHUD hideHUD];
                            
                            // 用户行为上报
                            NSMutableDictionary *thirdRes = [NSMutableDictionary dictionary];
                            [thirdRes setValue:@"quickphone" forKey:@"method"];
                            if ([resultDic isKindOfClass:[NSDictionary class]] && resultDic.allKeys.count > 0) {
                                [thirdRes setValue:resultDic forKey:@"third_res"];
                            }
                            [[RXUserActionLogManager sharedSDK] addUserActionWithScene:@"login" action:@"show_fail" properties:thirdRes];
                            
                            [[RXUIKitService sharedSDK] showAccountLoginViewWithConfig:[RXUIUserUtility sharedManager].loginUIModel complete:self.loginComplete];
                            
                            // 授权失败上报
                            NSMutableDictionary *properties = [NSMutableDictionary dictionary];
                            [properties setValue:@"quickphone_ali" forKey:@"method"];
                            [properties setValue:rxlog_error_login_ui forKey:@"error_action"];
                            if ([resultDic isKindOfClass:[NSDictionary class]] && resultDic.allKeys.count > 0) {
                                [properties setValue:resultDic forKey:@"result"];
                            }
                            [[RXLogService sharedSDK] dataTrackWithEvent:rxlog_error_ui distinctId:@"" properties:properties];
                        }
                    }
                }
            }];
        }];
    } else {
        [RXHUD hideHUD];
        
        // 用户行为上报
        NSMutableDictionary *thirdRes = [NSMutableDictionary dictionary];
        [thirdRes setValue:@"quickphone" forKey:@"method"];
        [thirdRes setValue:@{@"msg" : @"key is null"} forKey:@"third_res"];
        [[RXUserActionLogManager sharedSDK] addUserActionWithScene:@"login" action:@"show_fail" properties:thirdRes];
        
        [[RXUIKitService sharedSDK] showAccountLoginViewWithConfig:[RXUIUserUtility sharedManager].loginUIModel complete:self.loginComplete];
    }
    
}

// 一键登录
- (void)didLoginWithATAuth
{
    [[TXCommonHandler sharedInstance] getLoginTokenWithTimeout:3.0
                                                    controller:[UIViewController currentViewController]
                                                         model:self.customModel
                                                      complete:^(NSDictionary * _Nonnull resultDic) {
        [RXHUD hideHUD];
        NSString *resultCode = [resultDic objectForKey:@"resultCode"];
        if ([PNSCodeLoginControllerPresentSuccess isEqualToString:resultCode]) {
            self.isCanShow = YES;
            NSLog(@"授权页拉起成功回调：%@", resultDic);
            
            for (UIView *subViews in [UIViewController currentViewController].view.subviews) {
                [RXUICommonTool transformWithView:[UIViewController currentViewController].view];
                [UIView animateWithDuration:0.1 animations:^{
                    self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.5];
                    
                    [RXUICommonTool showWithAnimate:[UIViewController currentViewController].view addScale:SCALE];
                    
                    [self layoutSubviews];
                }];
            }
            
            // 用户行为上报
            [[RXUserActionLogManager sharedSDK] addUserActionWithScene:@"login" action:@"show_success" properties:@{@"method" : @"quickphone"}];
            
        } else if ([PNSCodeCallPreLoginInAuthPage isEqualToString:resultCode]) {
            
            NSLog(@"授权页已加载时不允许调用加速或预取号接口");
            
        } else if ([PNSCodeLoginControllerSuspendDisMissVC isEqualToString:resultCode]) {
            
            NSLog(@"中断页面消失的时候，也就是suspendDisMissVC设置为YES的时候，点击左上角返回按钮时透出的状态码回调");
            
        } else if ([PNSCodeLoginPrivacyAlertViewClose isEqualToString:resultCode]) {
            
            NSLog(@"隐私协议二次弹窗关闭");
            
        } else if ([PNSCodeLoginClickPrivacyAlertView isEqualToString:resultCode]) {
            
            NSLog(@"点击一键登录拉起授权页二次弹窗");
                        
        } else if ([PNSCodeLoginPrivacyAlertViewClickContinue isEqualToString:resultCode]) {
            
            NSLog(@"隐私协议二次弹窗点击确认并继续");
            self.isSelect = !self.isSelect;
            self.loginConfig.isPrivacySelected = self.isSelect;
            
        } else if ([PNSCodeLoginPrivacyAlertViewPrivacyContentClick isEqualToString:resultCode]) {
            
            NSLog(@"点击隐私协议二次弹窗上的协议富文本文字");
            
        } else if ([PNSCodeLoginControllerClickCancel isEqualToString:resultCode]) {
            NSLog(@"页面点击事件回调：%@", resultDic);
            
            // 用户行为上报
            NSMutableDictionary *thirdRes = [NSMutableDictionary dictionary];
            [thirdRes setValue:@"quickphone" forKey:@"method"];
            [[RXUserActionLogManager sharedSDK] addUserActionWithScene:@"login" action:@"close" properties:thirdRes];
            
            if (self.isFirstViewLoad) {
                RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
                
                NSString *errorMsg = [RXErrorTool getRXErrorMsg:RXLimitError_closeView];
                err.responesObject = @{@"msg" : errorMsg,
                                       @"code" : @(RXLimitError_closeView)
                };
                if (self.loginComplete) {
                    self.loginComplete(nil, err);
                }
                [[RXService sharedSDK].loginDelegate rx_LoginCallBackWithResponse:nil error:err];
                
                [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                               bodyDic:@{}
                                                                action:@"rxlog_error_login"
                                                                   url:@""
                                                                  code:err.responesObject[@"code"] == nil ? -123 : [err.responesObject[@"code"] integerValue]
                                                                   msg:err.responesObject[@"msg"]
                                                             thirdType:@""
                                                             thirdcode:err.responesObject[@"thirdcode"] == nil ? -123 : [err.responesObject[@"thirdcode"] integerValue]
                                                              thirdmsg:err.responesObject[@"thirdmsg"]
                                                               traceid:@""];
            }
            
            [RXHUD hideHUD];
        } else if ([PNSCodeLoginControllerClickLoginBtn isEqualToString:resultCode]) {
            
//            if (!self.isSelect) {
//                RXPriView *priView = [[RXPriView alloc] init];
//                priView.agreeBlock = ^{
//                    self.isSelect = !self.isSelect;
//                    [[TXCommonHandler sharedInstance] setCheckboxIsChecked:self.isSelect];
//
//                    [self.loginExt setValue:@"1" forKey:@"isFirst"];
//                    [[TXCommonHandler sharedInstance] getVerifyTokenWithTimeout:3.0 complete:^(NSDictionary * _Nonnull resultDic) {
//                        [self.loginExt setValue:[resultDic objectForKey:@"token"] forKey:@"token"];
//                        [[RXLoginViewManager sharedSDK] fetchLoginEvent:LoginTypeAuth loginInfo:self.loginExt complete:self.loginComplete];
//                    }];
//                };
//            } else {
//
//            }
            
        } else if ([PNSCodeLoginControllerClickChangeBtn isEqualToString:resultCode]) {
//            [[TXCommonHandler sharedInstance] cancelLoginVCAnimated:NO complete:^{
//                NSLog(@"关闭一键登录页面");
//            }];
            
            RXLoginView *loginView = [[RXLoginView alloc] initWithConfig:self.loginConfig loginEvent:self.loginTypeBlock complete:self.loginComplete];
        } else if ([PNSCodeSuccess isEqualToString:resultCode]) {
            NSLog(@"获取LoginToken成功回调：%@", resultDic);
            
            // 用户行为上报
            NSMutableDictionary *thirdRes = [NSMutableDictionary dictionary];
            [thirdRes setValue:@"quickphone" forKey:@"method"];
            if ([resultDic isKindOfClass:[NSDictionary class]] && resultDic.allKeys.count > 0) {
                [thirdRes setValue:resultDic forKey:@"third_res"];
            }
            [[RXUserActionLogManager sharedSDK] addUserActionWithScene:@"login" action:@"success" properties:thirdRes];
            
            if (self.isFirstView) {
                [self.loginExt setValue:@"1" forKey:@"isFirst"];
            } else {
                [self.loginExt setValue:@"1" forKey:@"isFirst"];
                NSString *token = [resultDic objectForKey:@"token"];
                if (self.callBack) {
                    self.callBack(token);
                    return;
                }
            }
//
//            RXUIAuthLoginFailView *failView = [[RXUIAuthLoginFailView alloc] initWithConfig:self.loginConfig titile:@"很抱歉，一键登录失败" content:@"请选择以下登录方式进行操作" loginEvent:self.loginTypeBlock complete:self.loginComplete];
//            return;
            
            [self.loginExt setValue:[resultDic objectForKey:@"token"] forKey:@"token"];
            [[RXLoginViewManager sharedSDK] fetchLoginEvent:LoginTypeAuth loginInfo:self.loginExt complete:self.loginComplete];
            
        } else if ([PNSCodeLoginControllerClickCheckBoxBtn isEqualToString:resultCode]) {
            self.isSelect = !self.isSelect;
            self.loginConfig.isPrivacySelected = self.isSelect;
        } else if ([PNSCodeLoginControllerClickProtocol isEqualToString:resultCode]) {
            // 用户行为上报
            NSMutableDictionary *thirdRes = [NSMutableDictionary dictionary];
            [thirdRes setValue:@"quickphone" forKey:@"method"];
            if ([resultDic isKindOfClass:[NSDictionary class]] && resultDic.allKeys.count > 0 && resultDic[@"url"]) {
                [thirdRes setValue:resultDic[@"url"] forKey:@"url"];
            }
            [[RXUserActionLogManager sharedSDK] addUserActionWithScene:@"login" action:@"privacy" properties:thirdRes];
            
            RXCommonWKWebView *webView = [[RXCommonWKWebView alloc] initWithUrl:resultDic[@"url"] title:resultDic[@"urlName"] content:nil];
        } else if ([PNSCodeInterfaceTimeout isEqualToString:resultCode] ||
                   [PNSCodeGetOperatorInfoFailed isEqualToString:resultCode] ||
                   [PNSCodeNoSIMCard isEqualToString:resultCode] ||
                   [PNSCodeNoCellularNetwork isEqualToString:resultCode] ||
                   [PNSCodeUnknownOperator isEqualToString:resultCode] ||
                   [PNSCodeUnknownError isEqualToString:resultCode] ||
                   [PNSCodeGetTokenFailed isEqualToString:resultCode] ||
                   [PNSCodeGetMaskPhoneFailed isEqualToString:resultCode] ||
                   [PNSCodeInterfaceDemoted isEqualToString:resultCode] ||
                   [PNSCodeInterfaceLimited isEqualToString:resultCode] ||
                   [PNSCodeDecodeAppInfoFailed isEqualToString:resultCode] ||
                   [PNSCodePhoneBlack isEqualToString:resultCode] ||
                   [PNSCodeCarrierChanged isEqualToString:resultCode] ||
                   [PNSCodeEnvCheckFail isEqualToString:resultCode] ||
                   [PNSCodeLoginControllerPresentFailed isEqualToString:resultCode]) {
            [RXHUD hideHUD];
            
            // 用户行为上报
            NSMutableDictionary *thirdRes = [NSMutableDictionary dictionary];
            [thirdRes setValue:@"quickphone" forKey:@"method"];
            if ([resultDic isKindOfClass:[NSDictionary class]] && resultDic.allKeys.count > 0) {
                [thirdRes setValue:resultDic forKey:@"third_res"];
            }
            [[RXUserActionLogManager sharedSDK] addUserActionWithScene:@"login" action:@"fail" properties:thirdRes];
            
//            RXUIAuthLoginFailView *failView = [[RXUIAuthLoginFailView alloc] initWithConfig:self.loginConfig titile:@"很抱歉，一键登录失败" content:@"请选择以下登录方式进行操作" loginEvent:self.loginTypeBlock complete:self.loginComplete];
            
            [RXHUD showErrorText:@"授权失败，请使用其他登录方式"];
            
            // 授权失败上报
            NSMutableDictionary *properties = [NSMutableDictionary dictionary];
            [properties setValue:@"quickphone_ali" forKey:@"method"];
            [properties setValue:rxlog_error_login_ui forKey:@"error_action"];
            if ([resultDic isKindOfClass:[NSDictionary class]] && resultDic.allKeys.count > 0) {
                [properties setValue:resultDic forKey:@"result"];
            }
            [[RXLogService sharedSDK] dataTrackWithEvent:rxlog_error_ui distinctId:@"" properties:properties];
            
        } else {
//            self.isCanShow = NO;
            NSLog(@"获取LoginToken或拉起授权页失败回调：%@", resultDic);
//            [RXHUD showErrorText:resultDic[@"msg"]];
//            [RXUIUserUtility sharedManager].isClickQuickAuth = NO;
            
            [RXHUD hideHUD];
            
            // 用户行为上报
            NSMutableDictionary *thirdRes = [NSMutableDictionary dictionary];
            [thirdRes setValue:@"quickphone" forKey:@"method"];
            if ([resultDic isKindOfClass:[NSDictionary class]] && resultDic.allKeys.count > 0) {
                [thirdRes setValue:resultDic forKey:@"third_res"];
            }
            [[RXUserActionLogManager sharedSDK] addUserActionWithScene:@"login" action:@"fail" properties:thirdRes];
            
            [[RXUIKitService sharedSDK] showAccountLoginViewWithConfig:[RXUIUserUtility sharedManager].loginUIModel complete:self.loginComplete];
            
            // 授权失败上报
            NSMutableDictionary *properties = [NSMutableDictionary dictionary];
            [properties setValue:@"quickphone_ali" forKey:@"method"];
            [properties setValue:rxlog_error_login_ui forKey:@"error_action"];
            if ([resultDic isKindOfClass:[NSDictionary class]] && resultDic.allKeys.count > 0) {
                [properties setValue:resultDic forKey:@"result"];
            }
            [[RXLogService sharedSDK] dataTrackWithEvent:rxlog_error_ui distinctId:@"" properties:properties];
        }
    }];
}

- (NSString *)getSDCardType
{
    if ([TXCommonUtils isChinaMobile]) {
        return @"中国移动";
    } else if ([TXCommonUtils isChinaUnicom]) {
        return @"中国联通";
    } else return @"中国电信";
}

- (NSAttributedString *)attributedStringWithTitle:(NSString *)title
                                            color:(NSString *)color
                                             font:(UIFont *)font
{
    NSMutableParagraphStyle *style = [[NSMutableParagraphStyle alloc] init];
    style.alignment = NSTextAlignmentCenter;
    
    NSAttributedString *attr = [[NSAttributedString alloc] initWithString:title attributes:@{
        NSForegroundColorAttributeName:[UIColor colorWithHexString:color],
        NSFontAttributeName:font,
        NSParagraphStyleAttributeName:style
    }];
    
    return attr;
}

- (void)customTapAction:(UITapGestureRecognizer *)tap
{
    RXLoginView *loginView = [[RXLoginView alloc] initWithConfig:self.loginConfig loginEvent:self.loginTypeBlock complete:self.loginComplete];
}

- (TXCustomModel *)customModel
{
    if (!_customModel) {
        _customModel = [[TXCustomModel alloc] init];
//        _customModel.alertBarIsHidden = YES;
        _customModel.animationDuration = 0;
        _customModel.alertTitleBarColor = [UIColor clearColor];
        
        if (self.loginConfig.logoImage) {
            _customModel.logoImage = self.loginConfig.logoImage;
            _customModel.alertTitle = [[NSAttributedString alloc] initWithString:@"" attributes:@{NSForegroundColorAttributeName : UIColor.blackColor,NSFontAttributeName : [UIFont boldSystemFontOfSize:18.0]}];
            _customModel.logoFrameBlock = ^CGRect(CGSize screenSize, CGSize superViewSize, CGRect frame) {
                frame = CGRectMake([RXUICommonTool getSingleScreenWidth] / 2 - 76, RXAC ? -30 : -30, RXAC ? 152 : 152, RXAC ? 59 : 59);
//                frame = CGRectMake([RXUICommonTool getSingleScreenWidth] / 2 - 60, RXAC ? -38 : -30, RXAC ? 120 : 120, RXAC ? 60 : 60);
                return frame;
            };
        } else {
            _customModel.alertTitle = [[NSAttributedString alloc] initWithString:@"一键登录" attributes:@{NSForegroundColorAttributeName : UIColor.blackColor,NSFontAttributeName : [UIFont boldSystemFontOfSize:18.0]}];
            _customModel.alertTitleFrameBlock = ^CGRect(CGSize screenSize, CGSize superViewSize, CGRect frame) {
                frame = CGRectMake(0, 22, [RXUICommonTool getSingleScreenWidth], 22);
                return frame;
            };
        }
        
        self.isFirstViewLoad = YES;
        _customModel.alertCloseImage = [UIImage rxBundleImageNamed:@"rx_close"];
        _customModel.alertCloseItemFrameBlock = ^CGRect(CGSize screenSize, CGSize superViewSize, CGRect frame) {
            frame = CGRectMake(RXAC ? 336.5 : 310.5, RXAC ? 17.5 : 17.5, 21, 21);
            return frame;
        };

        _customModel.alertCornerRadiusArray = @[@2,@2,@2,@2];
        
        // 号码
        _customModel.numberColor = [UIColor blackColor];
//        _customModel.numberFont = [UIFont boldSystemFontOfSize:25];
        _customModel.numberFont = [UIFont boldSystemFontOfSize:RXAC ? 30 : 30];
        _customModel.numberFrameBlock = ^CGRect(CGSize screenSize, CGSize superViewSize, CGRect frame) {
//            frame = CGRectMake([RXUICommonTool getSingleScreenWidth] / 2 - (RXAC ? 72 : 75), RXAC ? 16 : 32, 200, 30);
            frame = CGRectMake([RXUICommonTool getSingleScreenWidth] / 2 - (RXAC ? 88 : 88), RXAC ? 37 : 37, 200, 30);
            return frame;
        };
        
        // slogan
        _customModel.sloganText = [self attributedStringWithTitle:[NSString stringWithFormat:@"%@提供认证服务", [self getSDCardType]] color:@"A3A3A3" font:[UIFont systemFontOfSize:RXAC ? 13 : 14]];
        _customModel.sloganFrameBlock = ^CGRect(CGSize screenSize, CGSize superViewSize, CGRect frame) {
//            frame = CGRectMake([RXUICommonTool getSingleScreenWidth] / 2 - 89, RXAC ? 52 : 71, 180, 16);
            frame = CGRectMake([RXUICommonTool getSingleScreenWidth] / 2 - 90.5, RXAC ? 84 : 84, 180, 16);
            return frame;
        };
        
        // 登录
        _customModel.loginBtnText = [[NSAttributedString alloc] initWithString:@"本机号码一键登录" attributes:@{NSForegroundColorAttributeName : UIColor.whiteColor, NSFontAttributeName : [UIFont boldSystemFontOfSize:18.5]}];
//        _customModel.loginBtnBgImgs = @[[UIImage rxBundleImageNamed:@"rx_login_select"], [UIImage rxBundleImageNamed:@"rx_login_unSelect"], [UIImage rxBundleImageNamed:@"rx_login_unSelect"]];
        _customModel.loginBtnBgImgs = @[[UIImage rxBundleImageNamed:@"rx_login_select"], [UIImage rxBundleImageNamed:@"rx_login_select"], [UIImage rxBundleImageNamed:@"rx_login_select"]];
        _customModel.loginBtnFrameBlock = ^CGRect(CGSize screenSize, CGSize superViewSize, CGRect frame) {
//            frame = CGRectMake(RXAC ? 29 : 25, RXAC ? 78 : 110, [RXUICommonTool getSingleScreenWidth] - (RXAC ? 58 : 50), RXAC ? 43 : 43);
            frame = CGRectMake(RXAC ? 21 : 21, RXAC ? 115 : 115, [RXUICommonTool getSingleScreenWidth] - (RXAC ? 42 : 42), RXAC ? 45 : 45);
            return frame;
        };
        
        CGFloat alertHeight = RXAC ? 281 : 281;
        CGFloat alertWidth = [RXUICommonTool getSingleScreenWidth];
        
        _customModel.contentViewFrameBlock = ^CGRect(CGSize screenSize, CGSize contentSize, CGRect frame) {
            
            float scale = (RXAC ? RXUScreenHeight : RXUScreenWidth) / 428.0;
            if (scale > 1.0) {
                scale = 1.0;
            }
            if ([ISPAD isEqualToString:@"iPad"]) {
                scale = 1.1;
            }
            scale += SCALE;
            
            if (scale < 1.0) {
                scale = 1.0;
            }
            
            CGFloat alertX = RXUScreenWidth / 2 - (alertWidth * scale) / 2;
            CGFloat alertY = RXUScreenHeight / 2 - (alertHeight * scale) / 2;
            
            return CGRectMake(alertX / scale, alertY / scale, alertWidth, alertHeight);
        };
        
        // 协议
        NSArray *privacies = [RXUIUserUtility sharedManager].privacies;
        NSArray *privacieTitles = [RXUIUserUtility sharedManager].privacieTitles;
        
        _customModel.privacyPreText = @"我已阅读并同意";
        NSString *priText = [NSString stringWithFormat:@"%@", _customModel.privacyPreText];
        for (int i = 0; i < privacies.count; i++) {
            NSString *pri = privacies[i];
            if (pri.length <= 0) continue;
            if (![[pri substringToIndex:4] containsString:@"http"]) continue;
            switch (i) {
                case 0:
                {
                    NSString *url = privacies[0];
                    if ([url containsString:@"?"]) {
                        url = [NSString stringWithFormat:@"%@&title=%@", url, privacieTitles[0]];
                    } else {
                        url = [NSString stringWithFormat:@"%@?title=%@", url, privacieTitles[0]];
                    }
                    _customModel.privacyOne = @[privacieTitles[0], url];
                    priText = [NSString stringWithFormat:@"%@%@", priText, privacieTitles[0]];
                }
                    break;
                case 1:
                {
                    NSString *url = privacies[1];
                    if ([url containsString:@"?"]) {
                        url = [NSString stringWithFormat:@"%@&title=%@", url, privacieTitles[1]];
                    } else {
                        url = [NSString stringWithFormat:@"%@?title=%@", url, privacieTitles[1]];
                    }
                    _customModel.privacyTwo = @[privacieTitles[1], url];
                    priText = [NSString stringWithFormat:@"%@%@", priText, privacieTitles[1]];
                }
                    break;
                case 2:
                {
                    NSString *url = privacies[2];
                    if ([url containsString:@"?"]) {
                        url = [NSString stringWithFormat:@"%@&title=%@", url, privacieTitles[2]];
                    } else {
                        url = [NSString stringWithFormat:@"%@?title=%@", url, privacieTitles[2]];
                    }
                    _customModel.privacyThree = @[privacieTitles[2], url];
                    priText = [NSString stringWithFormat:@"%@%@", priText, privacieTitles[2]];
                }
                    break;
                default:
                    break;
            }
        }

        _customModel.expandAuthPageCheckedScope = YES;
        _customModel.privacyVCIsCustomized = YES;
        _customModel.privacyFont = [UIFont systemFontOfSize:14];
        _customModel.privacyNavBackImage = [UIImage rxBundleImageNamed:@"rx_close"];
        _customModel.privacyLineSpaceDp = 4;
        _customModel.checkBoxImages = @[[UIImage rxBundleImageNamed:@"rx_priUnSelect"], [UIImage rxBundleImageNamed:@"rx_priSelect"]];
        _customModel.checkBoxWH = 18;
        _customModel.checkBoxImageEdgeInsets = UIEdgeInsetsMake(0, 0, 0, 0);
//        _customModel.checkBoxIsChecked = YES;
//        _customModel.privacyOperatorPreText = @"《";
//        _customModel.privacyOperatorSufText = @"》";
        _customModel.privacyColors = @[[UIColor blackColor], [UIColor colorWithHexString:@"#20C0B3"]];
        _customModel.privacyAlignment = NSTextAlignmentLeft;
//        _customModel.privacyColors = @[[self colorWithHexString:@"#20C0B3"], [self colorWithHexString:@"#20C0B3"]];
        _customModel.privacyFrameBlock = ^CGRect(CGSize screenSize, CGSize superViewSize, CGRect frame) {
            CGFloat size = RXAC ? 16 : (self.loginConfig.privacieTitles.count >= 3 ? 16 : 16);
            CGFloat btnW = [priText widthForFont:[UIFont systemFontOfSize:size weight:UIFontWeightRegular]] + 170;
            
            if (privacieTitles.count <= 0) {
                btnW += 26;
            }
            
            if (btnW > ([RXUICommonTool getSingleScreenWidth] - (RXAC ? 42 : 42))) {
                btnW = [RXUICommonTool getSingleScreenWidth] - (RXAC ? 40 : 40)
                ;
            }
            
            CGFloat btnY = RXAC ? 176 : 176;
            
            if (privacieTitles.count <= 0) {
                btnY += 14;
            }
            
            CGRect privacyRect = CGRectMake([RXUICommonTool getSingleScreenWidth] / 2 - btnW / 2 + (RXAC ? 0 : 0), btnY, btnW, 45);
            
            return privacyRect;
        };
        
        // 二次协议
        _customModel.privacyAlertIsNeedShow = YES;
        _customModel.privacyAlertCornerRadiusArray = @[@4,@4,@4,@4];
        CABasicAnimation *showAnimation = [CABasicAnimation animationWithKeyPath:@"transform.scale"];
        showAnimation.fromValue = @(1);  // 初始大小
        showAnimation.toValue = @(1.0);    // 缩放后的大小
        showAnimation.duration = 0.1;      // 动画持续时间
        
        CABasicAnimation *hideAnimation = [CABasicAnimation animationWithKeyPath:@"transform.scale"];
        hideAnimation.fromValue = @(1.0);  // 初始大小
        hideAnimation.toValue = @(0);    // 缩放后的大小
        hideAnimation.duration = 0.001;      // 动画持续时间

        _customModel.privacyAlertEntryAnimation = showAnimation;
        _customModel.privacyAlertExitAnimation = hideAnimation;
//
        CABasicAnimation *showAnimation1 = [CABasicAnimation animationWithKeyPath:@"opacity"];
        showAnimation.fromValue = @(1);  // 初始大小
        showAnimation.toValue = @(1);    // 缩放后的大小
        showAnimation.duration = 0.1;      // 动画持续时间
//
//        CABasicAnimation *hideAnimation1 = [CABasicAnimation animationWithKeyPath:@"transform.alpha"];
//        hideAnimation.fromValue = @(0.5);  // 初始大小
//        hideAnimation.toValue = @(0);    // 缩放后的大小
//        hideAnimation.duration = 0.0001;      // 动画持续时间
        
        _customModel.privacyAlertMaskEntryAnimation = showAnimation;
        
        _customModel.privacyAlertTitleContent = @"用户协议和隐私政策";
        _customModel.privacyAlertTitleFont = [UIFont systemFontOfSize:21 weight:UIFontWeightMedium];
        _customModel.privacyAlertTitleColor = [UIColor blackColor];
        _customModel.privacyAlertTitleBackgroundColor = [UIColor whiteColor];
        _customModel.privacyAlertContentFont = [UIFont systemFontOfSize:15 weight:UIFontWeightRegular];
        _customModel.privacyAlertContentBackgroundColor = [UIColor whiteColor];
        _customModel.privacyAlertBtnContent = @"同意";
        _customModel.privacyAlertBtnBackgroundImages = @[[UIImage rxBundleImageNamed:@"rx_login_select"], [UIImage rxBundleImageNamed:@"rx_login_select"]];
        _customModel.privacyAlertButtonTextColors = @[[UIColor whiteColor], [UIColor whiteColor]];
        _customModel.privacyAlertButtonFont = [UIFont systemFontOfSize:18 weight:UIFontWeightMedium];
        _customModel.privacyAlertCloseButtonIsNeedShow = NO;
        _customModel.tapPrivacyAlertMaskCloseAlert = NO;
        _customModel.privacyAlertLineSpaceDp = 2;
        
        float scale = (RXAC ? RXUScreenHeight : RXUScreenWidth) / 428.0;
        if (scale > 1.0) {
            scale = 1.0;
        }
        if ([ISPAD isEqualToString:@"iPad"]) {
            scale = 1.1;
        }
        scale += SCALE;
        
        CGFloat privacyAlertH = RXAC ? 198 : 195;
        
        _customModel.privacyAlertFrameBlock = ^CGRect(CGSize screenSize, CGSize superViewSize, CGRect frame) {
            
            CGFloat alertX = RXUScreenWidth / 2 - alertWidth / 2;
            CGFloat alertY = RXUScreenHeight / 2 - privacyAlertH / 2;
            
            return CGRectMake(alertX, alertY, alertWidth, privacyAlertH);
        };
        
        _customModel.privacyAlertTitleFrameBlock = ^CGRect(CGSize screenSize, CGSize superViewSize, CGRect frame) {
            
            return CGRectMake(0, 21, alertWidth, 24);
        };
        
        _customModel.privacyAlertPrivacyContentFrameBlock = ^CGRect(CGSize screenSize, CGSize superViewSize, CGRect frame) {
            // 标题 y + height + 间距
            CGFloat desY = 10 + 24 + 30;

            return CGRectMake(RXAC ? 29 : 25, RXAC ? desY : desY - 5, alertWidth - (RXAC ? 58 : 50), 48);
        };
        
        _customModel.privacyAlertButtonFrameBlock = ^CGRect(CGSize screenSize, CGSize superViewSize, CGRect frame) {
          
            CGFloat width = RXAC ? 146 : 143;
            CGFloat x = alertWidth - width - (RXAC ? 29 : 25);
            CGFloat y = privacyAlertH - (RXAC ? 43 + 29 : 43 + 25);
            CGFloat height = RXAC ? 43 : 43;
            
            return CGRectMake(x, y, width, height);
        };
                
        // 自定义取消按钮
        UIButton *cancelBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [cancelBtn setTitle:@"不同意" forState:UIControlStateNormal];
        [cancelBtn setTitleColor:[UIColor colorWithHexString:@"#20C0B3"] forState:UIControlStateNormal];
        cancelBtn.titleLabel.font = [UIFont systemFontOfSize:18 weight:UIFontWeightMedium];
        cancelBtn.layer.borderColor = [UIColor colorWithHexString:@"#20C0B3"].CGColor;
        cancelBtn.layer.borderWidth = 1;
        cancelBtn.layer.cornerRadius = 4;
        [cancelBtn addTarget:self action:@selector(cancelAction) forControlEvents:UIControlEventTouchUpInside];
        _customModel.privacyAlertCustomViewBlock = ^(UIView * _Nonnull superPrivacyAlertCustomView) {
            [superPrivacyAlertCustomView addSubview:cancelBtn];
        };
        _customModel.privacyAlertCustomViewLayoutBlock = ^(CGRect privacyAlertFrame, CGRect privacyAlertTitleFrame, CGRect privacyAlertPrivacyContentFrame, CGRect privacyAlertButtonFrame, CGRect privacyAlertCloseFrame) {
            
            CGFloat x = RXAC ? 29 : 25;
            CGFloat y = privacyAlertH - (RXAC ? 43 + 29 : 43 + 25);
            CGFloat width = RXAC ? 146 : 143;
            CGFloat height = RXAC ? 43 : 43;
            
            cancelBtn.frame = CGRectMake(x, y, width, height);
        };
        
        // 横竖屏切换
        _customModel.supportedInterfaceOrientations = UIInterfaceOrientationMaskAll;
    }
    return _customModel;
}

- (void)cancelAction
{
    [[TXCommonHandler sharedInstance] closePrivactAlertView];
}

@end
