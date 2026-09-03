//
//  RXWebViewManager.m
//  RXUIKit
//
//  Created by 陈汉 on 2023/4/27.
//

#import "RXWebViewManager.h"
#import "RXUICommonHeader.h"
#import "RXWKWebView.h"
#import "RXUIUserUtility.h"
#import "RXUserCenterConfig.h"
#import "RXUserCenterView.h"
#import "RXWKController.h"

@interface RXWebViewManager ()

@property (nonatomic, strong) RXWKController *chatService;
// 支付宝 IIFAA 实名：是否正在等待从支付宝返回后查询认证结果
@property (nonatomic, assign) BOOL isWaitingIIFAAResult;
// 发起 IIFAA 实名认证的 webView，用于把认证结果回传给 JS
@property (nonatomic, weak) WKWebView *iifaaWebView;

@end

@implementation RXWebViewManager

static RXWebViewManager *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXWebViewManager alloc] init];
    });
    return sharedSDK;
}

- (void)fetchJSInfoWithMethod:(NSString *)method
                         info:(id)info
                      webView:(WKWebView *)webView
{
    if ([method isEqualToString:@"openWebView"]) {
        RXWKWebView *webView = [[RXWKWebView alloc] initWithFrame:[UIApplication sharedApplication].keyWindow.frame];
        webView.urlStr = info;
        webView.complete = self.complete;
//        webView.urlStr =  @"https://www.baidu.com";
        [[UIApplication sharedApplication].keyWindow addSubview:webView];
        
    } else if ([method isEqualToString:@"openSystemWebView"]) {
        
        NSString *url = [NSString stringWithFormat:@"%@", info];
        if (url.length > 0) {
            [[UIApplication sharedApplication] openURL:[NSURL URLWithString:url] options:nil completionHandler:nil];
        }
        
    } else if ([method isEqualToString:@"openWebViewController"]) {
        
        RXWKController *webViewController = [[RXWKController alloc] init];
        webViewController.type = ServiceType_default;
        webViewController.modalPresentationStyle = UIModalPresentationFullScreen;
        webViewController.url = info;
        
        NSArray *webViewParams = [info componentsSeparatedByString:@"&"];
        if (webViewParams.count > 0) {
            NSString *viewTag = [webViewParams lastObject];
            NSArray *viewTagParams = [viewTag componentsSeparatedByString:@"="];
            
            if (viewTagParams.count > 0) {
                webViewController.viewTag = [viewTagParams lastObject];
            }
        }
        
        [[UIViewController currentViewController] presentViewController:webViewController animated:NO completion:nil];
        
    } else if ([method isEqualToString:@"invokeNativeCallback"]) {
        
        NSDictionary *dic = [RXUICommonTool dictionaryWithJsonString:info];
        NSString *method = dic[@"type"];
        if ([method isEqualToString:@"close_webview"]) {
            [[NSNotificationCenter defaultCenter] postNotificationName:RXUINoti_closeWebView object:nil userInfo:dic];
        } else {
            [self fetchJSEventWithInfo:dic];
            if (self.complete) {
                self.complete(dic);
                [[NSNotificationCenter defaultCenter] postNotificationName:RXUINoti_closeWebView object:nil userInfo:dic];
            } else {
                [[NSNotificationCenter defaultCenter] postNotificationName:RXUINoti_closeWebView object:nil userInfo:dic];
            }
            
//            for (UIView *v in [UIApplication sharedApplication].keyWindow.subviews) {
//                if ([v isKindOfClass:[RXUserCenterView class]]) {
//                    RXUserCenterView *webView = (RXUserCenterView *)v;
//                    [webView setCookie];
//                }
//            }
        }
        
    } else if ([method isEqualToString:@"setCloseVisible"]) {
        
        NSMutableDictionary *dic = [NSMutableDictionary dictionary];
        [dic setValue:@([info boolValue]) forKey:@"isShowClose"];
        [[NSNotificationCenter defaultCenter] postNotificationName:RXUINoti_userCenterClose object:nil userInfo:dic];
        
    } else if ([method isEqualToString:@"setBackVisible"]) {
        
        NSMutableDictionary *dic = [NSMutableDictionary dictionary];
        [dic setValue:@([info boolValue]) forKey:@"isShowBack"];
        [[NSNotificationCenter defaultCenter] postNotificationName:RXUINoti_userCenterBack object:nil userInfo:dic];
        
    } else if ([method isEqualToString:@"openChatService"]) {
        
        if ([RXUIUserUtility sharedManager].isShowServiceCenter) {
            [[NSNotificationCenter defaultCenter] postNotificationName:RXUINoti_maxmized object:nil userInfo:nil];
            return;
        }
        
//        RXWKWebView *webView = [[RXWKWebView alloc] initWithFrame:[UIApplication sharedApplication].keyWindow.frame];
//        webView.isService = YES;
//        
//        NSString *getToken = [NSString stringWithFormat:@"%@", [[NSUserDefaults standardUserDefaults] valueForKey:@"rx_access"]];
//        NSString *domain = [[RXService sharedSDK] getFirstBaseUrl];
//        if (![[domain substringWithRange:NSMakeRange(domain.length - 1, 1)] isEqualToString:@"/"]) {
//            domain = [NSString stringWithFormat:@"%@/", domain];
//        }
//        NSString *url = [NSString stringWithFormat: @"%@static/service#/welcome?ruixue-accesstoken=%@&ruixue-channelid=%@&ruixue-cpid=%@&ruixue-productid=%@&minimized=0", domain, getToken, [RXUIUserUtility sharedManager].channelId, [RXUIUserUtility sharedManager].cpid, [RXUIUserUtility sharedManager].productId];
//                
//        RXUserCenterConfig *config = [RXUIUserUtility sharedManager].userCenterConfig;
//        if (config.transmit_args && config.transmit_args.length > 0) {
//            url = [NSString stringWithFormat:@"%@&param_ui=%@", url, config.transmit_args];
//        }
//        if (config.game_user_id && config.game_user_id.length > 0) {
//            url = [NSString stringWithFormat:@"%@&game_user_id=%@", url, config.game_user_id];
//        }
//        if (config.nickname && config.nickname.length > 0) {
//            url = [NSString stringWithFormat:@"%@&nickname=%@", url, config.nickname];
//        } else {
//            NSDictionary *loginData = [RXUIUserUtility sharedManager].loginData;
//            url = [NSString stringWithFormat:@"%@&nickname=%@", url, loginData[@"nickname"]];
//        }
//        if (config.head_img_url && config.head_img_url.length > 0) {
//            url = [NSString stringWithFormat:@"%@&head_img_url=%@", url, config.head_img_url];
//        }
//        if (config.queue_name && config.queue_name.length > 0) {
//            url = [NSString stringWithFormat:@"%@&queue_name=%@", url, config.queue_name];
//        }
//        
//        webView.urlStr = url;
//        webView.complete = self.complete;
        
//        [[UIApplication sharedApplication].keyWindow addSubview:webView];
        
        self.chatService = [[RXWKController alloc] init];
        self.chatService.type = ServiceType_chat;
        self.chatService.modalPresentationStyle = UIModalPresentationFullScreen;
        [[UIViewController currentViewController] presentViewController:self.chatService animated:NO completion:nil];
        
    } else if ([method isEqualToString:@"getInitParams"]) {
        
        NSMutableDictionary *baseInfo = [NSMutableDictionary dictionary];
        [baseInfo setValue:[RXUIUserUtility sharedManager].cpid forKey:@"cpid"];
        [baseInfo setValue:[RXUIUserUtility sharedManager].productId forKey:@"productid"];
        [baseInfo setValue:[RXUIUserUtility sharedManager].channelId forKey:@"channelid"];
        [baseInfo setValue:[[RXService sharedSDK] getFirstBaseUrl] forKey:@"domain"];
        [baseInfo setValue:[[RXApiService sharedSDK] getDeviceIDInKeychain] forKey:@"devicecode"];
        [baseInfo setValue:[[RXApiService sharedSDK] getTimeZoneOffset] forKey:@"tzoffset"];
        [baseInfo setValue:[[RXApiService sharedSDK] getSystemLanguage] forKey:@"language"];
        
        NSString *jsonStr1 = [RXUICommonTool getJsonString:baseInfo];
        jsonStr1 = [jsonStr1 stringByReplacingOccurrencesOfString:@"\n" withString:@""];
        NSString *baseInfoJs1 = [NSString stringWithFormat:@"%@", jsonStr1];
        
        NSMutableDictionary *loginDic = [NSMutableDictionary dictionaryWithDictionary:[RXUIUserUtility sharedManager].loginData];
        
        NSString *jsonStr2 = [RXUICommonTool getJsonString:loginDic];
        jsonStr2 = [jsonStr2 stringByReplacingOccurrencesOfString:@"\n" withString:@""];
        NSString *baseInfoJs2 = [NSString stringWithFormat:@"%@", jsonStr2];
        
        NSMutableDictionary *jsonDic = [NSMutableDictionary dictionary];
        [jsonDic setValue:baseInfoJs1 forKey:@"api_params"];
        [jsonDic setValue:baseInfoJs2 forKey:@"login_data"];
        
        NSString *jsonStr = [RXUICommonTool getJsonString:jsonDic];
        
        NSString *jsStr = [NSString stringWithFormat:@"getInitParams('%@')", jsonStr];
        [webView evaluateJavaScript:jsStr completionHandler:^(id response, NSError * error) {
               NSLog(@"response: %@, \nerror: %@", response, error);
        }];
        
    } else if ([method isEqualToString:@"resetpwdSuccess"]) {
        
        NSMutableDictionary *dic = [NSMutableDictionary dictionaryWithDictionary:[RXUICommonTool stringToDic:info]];
        [[NSNotificationCenter defaultCenter] postNotificationName:RXUINoti_resetPwd object:nil userInfo:dic];

    } else if ([method isEqualToString:@"closeWebView"]) {
        
        [[NSNotificationCenter defaultCenter] postNotificationName:RXUINoti_closeWebView1 object:nil userInfo:nil];
        
    } else if ([method isEqualToString:@"closeWebViewController"]) {
        
        UIViewController *vc = [UIViewController currentViewController];
        if ([vc isKindOfClass:[RXWKController class]]) {
            RXWKController *webViewVC = (RXWKController *)vc;
            [webViewVC hide];
        }
        
    } else if ([method isEqualToString:@"minimized"]) {
        
        [[NSNotificationCenter defaultCenter] postNotificationName:RXUINoti_minimized object:nil userInfo:nil];
        
    } else if ([method isEqualToString:@"showTip"]) {
        
        [[NSNotificationCenter defaultCenter] postNotificationName:RXUINoti_showTip object:nil userInfo:nil];
        
    } else if ([method isEqualToString:@"setNaviBarVisible"]) {
        
        NSMutableDictionary *dic = [NSMutableDictionary dictionary];
        [dic setValue:@([info boolValue]) forKey:@"isShowNaviBar"];
        [[NSNotificationCenter defaultCenter] postNotificationName:RXUINoti_setNaviBarVisible object:webView userInfo:nil];
        
    } else if ([method isEqualToString:@"syncInfo"]) {
        
        [RXUICommonTool syncInfo:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
            NSDictionary *result = nil;
            if (!error) {
                result = response;
                
                [[NSNotificationCenter defaultCenter] postNotificationName:RXUINoti_syncInfo object:nil userInfo:nil];
            } else {
                result = error.responesObject;
            }
            
            NSString *jsonString = @"";
            if (result && [result isKindOfClass:[NSDictionary class]]) {
                jsonString = [RXUICommonTool getJsonString:result];
                jsonString = [jsonString stringByReplacingOccurrencesOfString:@"\n" withString:@""];
            }
            NSString *sss = [NSString stringWithFormat:@"syncInfo('%@')", jsonString];
            [webView evaluateJavaScript:sss
                      completionHandler:^(id response, NSError * error) {
                NSLog(@"response: %@, \nerror: %@", response, error);
            }];
//            [webView evaluateJavaScript:@"onSyncInfoNotify(1)"
//                      completionHandler:^(id response, NSError * error) {
//                NSLog(@"response: %@, \nerror: %@", response, error);
//            }];
        }];
        
    } else if ([method isEqualToString:@"setTitle"]) {
        
        NSMutableDictionary *dic = [NSMutableDictionary dictionary];
        [dic setValue:info forKey:@"title"];
        [[NSNotificationCenter defaultCenter] postNotificationName:RXUINoti_setTitle object:nil userInfo:dic];
        
    } else if ([method isEqualToString:@"refreshAccessToken"]) {
        
        [RXUICommonTool refreshToken:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
            NSDictionary *result = nil;
            if (!error) {
                result = response;
            } else {
                result = error.responesObject;
            }
            
            NSString *jsonString = @"";
            if (result && [result isKindOfClass:[NSDictionary class]]) {
                jsonString = [RXUICommonTool getJsonString:result];
                jsonString = [jsonString stringByReplacingOccurrencesOfString:@"\n" withString:@""];
            }
            NSString *sss = [NSString stringWithFormat:@"refreshAccessToken('%@')", jsonString];
            [webView evaluateJavaScript:sss
                      completionHandler:^(id response, NSError * error) {
                NSLog(@"response: %@, \nerror: %@", response, error);
            }];
        }];

    } else if ([method isEqualToString:@"reportUserLog"]) {
        NSDictionary *dic = [RXUICommonTool dictionaryWithJsonString:info];
        [RXFeedbackService sharedSDK].feedbackId = [dic[@"feedback_id"] integerValue];
        [RXFeedbackService sharedSDK].logPath = dic[@"log_path"];
        [[RXService sharedSDK].publicDelegate rxPublicCallback:feedbakc_report response:nil];
    } else if ([method isEqualToString:@"trackUserAction"]) {
        NSDictionary *dic = [RXUICommonTool dictionaryWithJsonString:info];
        
        if ([dic isKindOfClass:[NSDictionary class]] && dic.allKeys.count > 0) {
            // 用户行为上报
            NSMutableDictionary *thirdRes = [NSMutableDictionary dictionaryWithDictionary:dic];
            [[RXUserActionLogManager sharedSDK] addUserActionWithScene:@"login" action:@"captchacode_send" properties:thirdRes];
        }
    } else if ([method isEqualToString:@"openIIFAAAuth"]) {
        
        [self openIIFAAAuthWithInfo:info webView:webView];
        
    }
}

#pragma mark - 支付宝 IIFAA 实名认证
// 获取支付宝授权地址并跳转支付宝，从支付宝返回前台后查询认证结果并回传给 JS
- (void)openIIFAAAuthWithInfo:(id)info webView:(WKWebView *)webView
{
    NSString *appName = @"";
    NSString *scheme = @"";
    
    NSDictionary *params = nil;
    if ([info isKindOfClass:[NSDictionary class]]) {
        params = (NSDictionary *)info;
    } else if ([info isKindOfClass:[NSString class]] && [(NSString *)info length] > 0) {
        params = [RXUICommonTool dictionaryWithJsonString:info];
    }
    if ([params isKindOfClass:[NSDictionary class]]) {
        if ([params[@"app_name"] isKindOfClass:[NSString class]]) {
            appName = params[@"app_name"];
        }
        if ([params[@"scheme"] isKindOfClass:[NSString class]]) {
            scheme = params[@"scheme"];
        }
    }
    
    if (appName.length <= 0) {
        appName = [self iifaaAppName];
    }
    
    if (appName.length <= 0) {
        [RXHUD showErrorText:@"缺少支付宝实名回调配置"];
        return;
    }
    
    self.iifaaWebView = webView;
    
    [RXHUD showHUD];
    [[RXSDK sharedSDK] getIIFAARedirectURLWithAppName:appName thirdPartSchema:scheme complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (error) {
            NSString *errorMsg = error.responesObject[@"msg"];
            if (errorMsg.length <= 0) {
                errorMsg = @"获取支付宝认证地址失败";
            }
            [RXHUD showErrorText:errorMsg];
            return;
        }
        
        [RXHUD hideHUD];
        NSString *urlStr = [NSString stringWithFormat:@"%@", response[@"data"][@"url"]];
        NSURL *url = [NSURL URLWithString:urlStr];
        if (urlStr.length <= 0 || !url) {
            [RXHUD showErrorText:@"获取支付宝认证地址失败"];
            return;
        }
        
        // 跳转支付宝进行认证，回到前台后再查询认证结果
        [self addIIFAAForegroundObserver];
        self.isWaitingIIFAAResult = YES;
        [[UIApplication sharedApplication] openURL:url options:@{} completionHandler:^(BOOL success) {
            if (!success) {
                self.isWaitingIIFAAResult = NO;
                [RXHUD showErrorText:@"无法打开支付宝认证"];
            }
        }];
    }];
}

- (void)addIIFAAForegroundObserver
{
    [[NSNotificationCenter defaultCenter] removeObserver:self name:UIApplicationWillEnterForegroundNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(applicationWillEnterForegroundForIIFAA) name:UIApplicationWillEnterForegroundNotification object:nil];
}

// 从支付宝返回前台，查询 IIFAA 认证结果（注销场景 source 传 deregister），逻辑与实名认证一致
- (void)applicationWillEnterForegroundForIIFAA
{
    if (!self.isWaitingIIFAAResult) {
        return;
    }
    self.isWaitingIIFAAResult = NO;
    [[NSNotificationCenter defaultCenter] removeObserver:self name:UIApplicationWillEnterForegroundNotification object:nil];
    
    [RXHUD showHUD];
    [[RXSDK sharedSDK] getIIFAAResultWithSource:@"deregister" retryCount:3 complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        [RXHUD hideHUD];
        
        NSDictionary *result = nil;
        if (!error) {
            result = response;
        } else {
            result = error.responesObject;
        }
        
        [self sendIIFAAResultToJS:result];
    }];
}

// 新增原生调用 JS 方法 iifaaResult，将实名认证结果传给 JS
- (void)sendIIFAAResultToJS:(NSDictionary *)result
{
    WKWebView *webView = self.iifaaWebView;
    if (!webView) {
        return;
    }
    
    NSString *jsonString = @"";
    if ([result isKindOfClass:[NSDictionary class]] && result.allKeys.count > 0) {
        jsonString = [RXUICommonTool getJsonString:result];
        jsonString = [jsonString stringByReplacingOccurrencesOfString:@"\n" withString:@""];
    }
    
    NSString *jsStr = [NSString stringWithFormat:@"iifaaResult('%@')", jsonString];
    [webView evaluateJavaScript:jsStr completionHandler:^(id response, NSError * error) {
        NSLog(@"response: %@, \nerror: %@", response, error);
    }];
}

- (NSString *)iifaaAppName
{
    NSDictionary *infoDictionary = [NSBundle mainBundle].infoDictionary;
    NSString *displayName = infoDictionary[@"CFBundleDisplayName"];
    if (displayName.length > 0) {
        return displayName;
    }
    
    NSString *bundleName = infoDictionary[@"CFBundleName"];
    if (bundleName.length > 0) {
        return bundleName;
    }
    
    return [self iifaaFirstURLScheme];
}

- (NSString *)iifaaFirstURLScheme
{
    NSArray *urlTypes = [NSBundle mainBundle].infoDictionary[@"CFBundleURLTypes"];
    for (NSDictionary *urlType in urlTypes) {
        NSArray *schemes = urlType[@"CFBundleURLSchemes"];
        for (NSString *scheme in schemes) {
            if ([scheme isKindOfClass:[NSString class]] && scheme.length > 0) {
                return scheme;
            }
        }
    }
    return @"";
}

// 处理js特殊事件
- (void)fetchJSEventWithInfo:(NSDictionary *)info
{
    NSString *method = info[@"type"];
    NSMutableDictionary *ext = [NSMutableDictionary dictionary];
    if (info[@"ext"]) {
        ext = [NSMutableDictionary dictionaryWithDictionary:info[@"ext"]];
    }
    if ([method isEqualToString:@"deregister"]) {
        
        // 注销后修改位运算，flag第六位改为1
        NSMutableDictionary *loginData = [NSMutableDictionary dictionaryWithDictionary:[RXUIUserUtility sharedManager].loginData];
        int flag = [loginData[@"flag"] intValue];
        flag = flag | 32;
        
        [loginData setValue:@(flag) forKey:@"flag"];
        [RXUIUserUtility sharedManager].loginData = loginData;
        
    } else if ([method isEqualToString:@"underegister"]) {
        
        // 撤销注销后修改位运算，flag第六位改为0
        NSMutableDictionary *loginData = [NSMutableDictionary dictionaryWithDictionary:[RXUIUserUtility sharedManager].loginData];
        int flag = [loginData[@"flag"] intValue];
        flag = flag & ~(1 << 5);
        
        [loginData setValue:@(flag) forKey:@"flag"];
        [RXUIUserUtility sharedManager].loginData = loginData;
        
    } else if ([method isEqualToString:@"binding_phone"]) {
        
        // 绑定手机后修改位运算，attr第一位改为1，更换手机号
        NSMutableDictionary *loginData = [NSMutableDictionary dictionaryWithDictionary:[RXUIUserUtility sharedManager].loginData];
        int attr = [loginData[@"attr"] intValue];
        attr = attr | 2;
        
        [loginData setValue:@(attr) forKey:@"attr"];
        
        NSMutableDictionary *extDic = [NSMutableDictionary dictionary];
        if (loginData[@"ext"]) {
            extDic = [NSMutableDictionary dictionaryWithDictionary:loginData[@"ext"]];
        }
        NSString *phone = [ext valueForKey:@"phone"];
        if (phone.length >= 11) {
            phone = [phone stringByReplacingCharactersInRange:NSMakeRange(3, 4) withString:@"****"];
        }
        [extDic setValue:phone forKey:@"phone"];
        [loginData setValue:extDic forKey:@"ext"];
        
        [RXUIUserUtility sharedManager].loginData = loginData;
        
    } else if ([method isEqualToString:@"change_phone"]) {
        
        // 换绑手机后更换手机号
        NSMutableDictionary *loginData = [NSMutableDictionary dictionaryWithDictionary:[RXUIUserUtility sharedManager].loginData];
        
        NSMutableDictionary *extDic = [NSMutableDictionary dictionary];
        if (loginData[@"ext"]) {
            extDic = [NSMutableDictionary dictionaryWithDictionary:loginData[@"ext"]];
        }
        NSString *phone = [ext valueForKey:@"phone"];
        if (phone.length >= 11) {
            phone = [phone stringByReplacingCharactersInRange:NSMakeRange(3, 4) withString:@"****"];
        }
        [extDic setValue:phone forKey:@"phone"];
        [loginData setValue:extDic forKey:@"ext"];
        
        [RXUIUserUtility sharedManager].loginData = loginData;
        
        // 修改登录记录
        NSMutableArray *accounts = [NSMutableArray arrayWithArray:[RXUIUserUtility sharedManager].accounts];
        for (int i = 0; i < accounts.count; i++) {
            NSMutableDictionary *userInfo = [NSMutableDictionary dictionaryWithDictionary:[RXUIUserUtility sharedManager].accounts[i]];
            // 相同openid并且是验证码登录替换手机号
            long loginType = [userInfo[@"loginType"] longValue];
            if ([loginData[@"openid"] isEqualToString:userInfo[@"openid"]] && loginType == 10) {
                [userInfo setValue:[ext valueForKey:@"phone"] forKey:@"username"];
                [userInfo setValue:[ext valueForKey:@"phone"] forKey:@"nickname"];
                [accounts replaceObjectAtIndex:i withObject:userInfo];
                [RXUIUserUtility saveAccounts:accounts];
                
                for (UIView *v in [UIApplication sharedApplication].keyWindow.subviews) {
                    if ([v isKindOfClass:[RXUserCenterView class]]) {
                        RXUserCenterView *userCenter = (RXUserCenterView *)v;
                        userCenter.usernameLbl.text = [RXUICommonTool usernameSec:userInfo[@"nickname"]];
                    }
                }
            }
            if ([loginData[@"openid"] isEqualToString:userInfo[@"openid"]] && loginType == 1) {
                NSString *username = [userInfo valueForKey:@"username"];
                if ([RXUICommonTool validateMobile:username]) {
                    [userInfo setValue:[ext valueForKey:@"phone"] forKey:@"username"];
                    [userInfo setValue:[ext valueForKey:@"phone"] forKey:@"nickname"];
                    [accounts replaceObjectAtIndex:i withObject:userInfo];
                    [RXUIUserUtility saveAccounts:accounts];
                    
                    for (UIView *v in [UIApplication sharedApplication].keyWindow.subviews) {
                        if ([v isKindOfClass:[RXUserCenterView class]]) {
                            RXUserCenterView *userCenter = (RXUserCenterView *)v;
                            userCenter.usernameLbl.text = [RXUICommonTool usernameSec:userInfo[@"nickname"]];
                        }
                    }
                }
            }
        }
        
    } else if ([method isEqualToString:@"logBackIn"]) {
        
        for (UIView *v in [UIApplication sharedApplication].keyWindow.subviews) {
            if ([v isKindOfClass:[RXUserCenterView class]]) {
                RXUserCenterView *userCenter = (RXUserCenterView *)v;
                [userCenter hide];
            }
        }
        
    } else if ([method isEqualToString:@"real_auth"]) {
        
        // 实名后修改位运算，attr第一位改为1
        NSMutableDictionary *loginData = [NSMutableDictionary dictionaryWithDictionary:[RXUIUserUtility sharedManager].loginData];
        int attr = [loginData[@"attr"] intValue];
        attr = attr | 1;
        
        [loginData setValue:@(attr) forKey:@"attr"];
        [RXUIUserUtility sharedManager].loginData = loginData;
        
    }
}

@end
