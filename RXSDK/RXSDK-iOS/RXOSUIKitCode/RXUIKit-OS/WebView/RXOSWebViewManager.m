//
//  RXOSWebViewManager.m
//  RXUIKit-OS
//
//  Created by 陈汉 on 2023/6/16.
//

#import "RXOSWebViewManager.h"
#import "RXOSCommonHeader.h"
#import "RXOSWKWebView.h"
#import "RXOSUserUtility.h"
#import "RXOSUserCenterConfig.h"
#import "RXOSUserCenterView.h"
#import "RXOSWKController.h"

@interface RXOSWebViewManager ()

@property (nonatomic, strong) RXOSWKController *chatService;

@end

@implementation RXOSWebViewManager

static RXOSWebViewManager *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXOSWebViewManager alloc] init];
    });
    return sharedSDK;
}

- (void)fetchJSInfoWithMethod:(NSString *)method
                         info:(id)info
                      webView:(WKWebView *)webView
{
    if ([method isEqualToString:@"openWebView"]) {
        
        RXOSWKWebView *webView = [[RXOSWKWebView alloc] initWithFrame:[UIApplication sharedApplication].keyWindow.frame];
        webView.urlStr = info;
        webView.complete = self.complete;
        
        NSArray *urlParams = [info componentsSeparatedByString:@"&"];
        if (urlParams.count > 0) {
            NSString *viewTagParam = [urlParams lastObject];
            NSArray *viewTagParams = [viewTagParam componentsSeparatedByString:@"="];
            if (viewTagParams.count > 0) {
                webView.viewTag = [viewTagParams lastObject];
            }
        }
        
//        webView.urlStr =  @"https://www.baidu.com";
        [[UIApplication sharedApplication].keyWindow addSubview:webView];
        
    } else if ([method isEqualToString:@"openSystemWebView"]) {
        
        NSString *url = [NSString stringWithFormat:@"%@", info];
        if (url.length > 0) {
            [[UIApplication sharedApplication] openURL:[NSURL URLWithString:url] options:nil completionHandler:nil];
        }
        
    } else if ([method isEqualToString:@"openWebViewController"]) {
        
        RXOSWKController *webViewController = [[RXOSWKController alloc] init];
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
        
        NSDictionary *dic = [RXOSCommonTool dictionaryWithJsonString:info];
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
        
//        RXOSWKWebView *webView = [[RXOSWKWebView alloc] initWithFrame:[UIApplication sharedApplication].keyWindow.frame];
//        
//        NSString *getToken = [NSString stringWithFormat:@"%@", [[NSUserDefaults standardUserDefaults] valueForKey:@"rx_access"]];
//        NSString *domain = [[RXService sharedSDK] getFirstBaseUrl];
//        if (![[domain substringWithRange:NSMakeRange(domain.length - 1, 1)] isEqualToString:@"/"]) {
//            domain = [NSString stringWithFormat:@"%@/", domain];
//        }
//        
//        NSString *url = [NSString stringWithFormat: @"%@static/service#/welcome?ruixue-accesstoken=%@&ruixue-channelid=%@&ruixue-cpid=%@&ruixue-productid=%@", domain, getToken, [RXOSUserUtility sharedManager].channelId, [RXOSUserUtility sharedManager].cpid, [RXOSUserUtility sharedManager].productId];
//#warning test -- 测试
////        NSString *url = [NSString stringWithFormat: @"%@static/service#/welcome?ruixue-accesstoken=%@&ruixue-channelid=%@&ruixue-cpid=%@&ruixue-productid=%@&theme=%@", domain, getToken, [RXOSUserUtility sharedManager].channelId, [RXOSUserUtility sharedManager].cpid, [RXOSUserUtility sharedManager].productId, [[NSUserDefaults standardUserDefaults] valueForKey:@"theme"]];
//
//        
//        RXOSUserCenterConfig *config = [RXOSUserUtility sharedManager].userCenterConfig;
//        if (config.transmit_args && config.transmit_args.length > 0) {
//            url = [NSString stringWithFormat:@"%@&param_ui=%@", url, config.transmit_args];
//        }
//        if (config.game_user_id && config.game_user_id.length > 0) {
//            url = [NSString stringWithFormat:@"%@&game_user_id=%@", url, config.game_user_id];
//        }
//        if (config.nickname && config.nickname.length > 0) {
//            url = [NSString stringWithFormat:@"%@&nickname=%@", url, config.nickname];
//        } else {
//            NSDictionary *loginData = [RXOSUserUtility sharedManager].loginData;
//            url = [NSString stringWithFormat:@"%@&nickname=%@", url, loginData[@"nickname"]];
//        }
//        if (config.head_img_url && config.head_img_url.length > 0) {
//            url = [NSString stringWithFormat:@"%@&head_img_url=%@", url, config.head_img_url];
//        }
//        if (config.queue_name && config.queue_name.length > 0) {
//            url = [NSString stringWithFormat:@"%@&queue_name=%@", url, config.queue_name];
//        }
//        
////        url = @"http://10.10.2.116:4043/static/service/#/welcome";
//        
//        webView.urlStr = url;
//        webView.complete = self.complete;
//        
//        [[UIApplication sharedApplication].keyWindow addSubview:webView];
        
        self.chatService = [[RXOSWKController alloc] init];
        self.chatService.type = ServiceType_chat;
        self.chatService.modalPresentationStyle = UIModalPresentationFullScreen;
        [[UIViewController currentViewController] presentViewController:self.chatService animated:NO completion:nil];
        
//        [[UIViewController currentViewController].view addSubview:webView];
        
    } else if ([method isEqualToString:@"getInitParams"]) {
        
        NSMutableDictionary *baseInfo = [NSMutableDictionary dictionary];
        [baseInfo setValue:[RXOSUserUtility sharedManager].cpid forKey:@"cpid"];
        [baseInfo setValue:[RXOSUserUtility sharedManager].productId forKey:@"productid"];
        [baseInfo setValue:[RXOSUserUtility sharedManager].channelId forKey:@"channelid"];
        [baseInfo setValue:[[RXService sharedSDK] getFirstBaseUrl] forKey:@"domain"];
        [baseInfo setValue:[[RXApiService sharedSDK] getDeviceIDInKeychain] forKey:@"devicecode"];
        [baseInfo setValue:[[RXApiService sharedSDK] getTimeZoneOffset] forKey:@"tzoffset"];
        [baseInfo setValue:[[RXApiService sharedSDK] getSystemLanguage] forKey:@"language"];
        
        NSString *jsonStr1 = [RXOSCommonTool getJsonString:baseInfo];
        jsonStr1 = [jsonStr1 stringByReplacingOccurrencesOfString:@"\n" withString:@""];
        NSString *baseInfoJs1 = [NSString stringWithFormat:@"%@", jsonStr1];
        
        NSMutableDictionary *loginDic = [NSMutableDictionary dictionaryWithDictionary:[RXOSUserUtility sharedManager].loginData];
        
        NSString *jsonStr2 = [RXOSCommonTool getJsonString:loginDic];
        jsonStr2 = [jsonStr2 stringByReplacingOccurrencesOfString:@"\n" withString:@""];
        NSString *baseInfoJs2 = [NSString stringWithFormat:@"%@", jsonStr2];
        
        NSMutableDictionary *jsonDic = [NSMutableDictionary dictionary];
        [jsonDic setValue:baseInfoJs1 forKey:@"api_params"];
        [jsonDic setValue:baseInfoJs2 forKey:@"login_data"];
        
        NSString *jsonStr = [RXOSCommonTool getJsonString:jsonDic];
        
        NSString *jsStr = [NSString stringWithFormat:@"getInitParams('%@')", jsonStr];
        [webView evaluateJavaScript:jsStr completionHandler:^(id response, NSError * error) {
               NSLog(@"response: %@, \nerror: %@", response, error);
        }];
        
    } else if ([method isEqualToString:@"resetpwdSuccess"]) {
        
        NSMutableDictionary *dic = [NSMutableDictionary dictionaryWithDictionary:[RXOSCommonTool stringToDic:info]];
        [[NSNotificationCenter defaultCenter] postNotificationName:RXUINoti_resetPwd object:nil userInfo:dic];

    } else if ([method isEqualToString:@"closeWebView"]) {
        
        NSString *viewTag = [NSString stringWithFormat:@"%@", info];
        NSMutableDictionary *dic = [NSMutableDictionary dictionary];
        if (viewTag.length > 0 && [viewTag isEqualToString:@"1"] && [viewTag isEqualToString:@"0"]) {
            [dic setValue:viewTag forKey:@"viewTag"];
        }
        [[NSNotificationCenter defaultCenter] postNotificationName:RXUINoti_closeWebView1 object:nil userInfo:dic];
        
    } else if ([method isEqualToString:@"closeWebViewController"]) {
        
        UIViewController *vc = [UIViewController currentViewController];
        if ([vc isKindOfClass:[RXOSWKController class]]) {
            RXOSWKController *webViewVC = (RXOSWKController *)vc;
            [webViewVC hide];
        }
        
    } else if ([method isEqualToString:@"minimized"]) {
        
        [[NSNotificationCenter defaultCenter] postNotificationName:RXUINoti_minimized object:nil userInfo:nil];
        
    } else if ([method isEqualToString:@"showTip"]) {
        
        [[NSNotificationCenter defaultCenter] postNotificationName:RXUINoti_showTip object:nil userInfo:nil];
        
    } else if ([method isEqualToString:@"setNaviBarVisible"]) {
        
        NSMutableDictionary *dic = [NSMutableDictionary dictionary];
        [dic setValue:@([info boolValue]) forKey:@"isShowNaviBar"];
        [[NSNotificationCenter defaultCenter] postNotificationName:RXUINoti_setNaviBarVisible object:nil userInfo:nil];
        
    } else if ([method isEqualToString:@"syncInfo"]) {
        
        [RXOSCommonTool syncInfo:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
            NSDictionary *result = nil;
            if (!error) {
                result = response;
                
                [[NSNotificationCenter defaultCenter] postNotificationName:RXUINoti_syncInfo object:nil userInfo:nil];
            } else {
                result = error.responesObject;
            }
            
            NSString *jsonString = @"";
            if (result && [result isKindOfClass:[NSDictionary class]]) {
                jsonString = [RXOSCommonTool getJsonString:result];
                jsonString = [jsonString stringByReplacingOccurrencesOfString:@"\n" withString:@""];
            }
            NSString *sss = [NSString stringWithFormat:@"syncInfo('%@')", jsonString];
            [webView evaluateJavaScript:sss
                      completionHandler:^(id response, NSError * error) {
                NSLog(@"response: %@, \nerror: %@", response, error);
            }];
        }];
        
    } else if ([method isEqualToString:@"setTitle"]) {
        
        NSMutableDictionary *dic = [NSMutableDictionary dictionary];
        [dic setValue:info forKey:@"title"];
        [[NSNotificationCenter defaultCenter] postNotificationName:RXUINoti_setTitle object:nil userInfo:dic];
        
    } else if ([method isEqualToString:@"refreshAccessToken"]) {
        
        [RXOSCommonTool refreshToken:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
            NSDictionary *result = nil;
            if (!error) {
                result = response;
            } else {
                result = error.responesObject;
            }
            
            NSString *jsonString = @"";
            if (result && [result isKindOfClass:[NSDictionary class]]) {
                jsonString = [RXOSCommonTool getJsonString:result];
                jsonString = [jsonString stringByReplacingOccurrencesOfString:@"\n" withString:@""];
            }
            NSString *sss = [NSString stringWithFormat:@"refreshAccessToken('%@')", jsonString];
            [webView evaluateJavaScript:sss
                      completionHandler:^(id response, NSError * error) {
                NSLog(@"response: %@, \nerror: %@", response, error);
            }];
        }];
        
    } else if ([method isEqualToString:@"reportUserLog"]) {
        NSDictionary *dic = [RXOSCommonTool dictionaryWithJsonString:info];
        [RXFeedbackService sharedSDK].feedbackId = [dic[@"feedback_id"] integerValue];
        [RXFeedbackService sharedSDK].logPath = dic[@"log_path"];
        [[RXService sharedSDK].publicDelegate rxPublicCallback:feedbakc_report response:nil];
    }
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
        NSMutableDictionary *loginData = [NSMutableDictionary dictionaryWithDictionary:[RXOSUserUtility sharedManager].loginData];
        int flag = [loginData[@"flag"] intValue];
        flag = flag | 32;
        
        [loginData setValue:@(flag) forKey:@"flag"];
        [RXOSUserUtility sharedManager].loginData = loginData;
        
    } else if ([method isEqualToString:@"underegister"]) {
        
        // 撤销注销后修改位运算，flag第六位改为0
        NSMutableDictionary *loginData = [NSMutableDictionary dictionaryWithDictionary:[RXOSUserUtility sharedManager].loginData];
        int flag = [loginData[@"flag"] intValue];
        flag = flag & ~(1 << 5);
        
        [loginData setValue:@(flag) forKey:@"flag"];
        [RXOSUserUtility sharedManager].loginData = loginData;
        
    } else if ([method isEqualToString:@"binding_phone"]) {
        
        // 绑定手机后修改位运算，attr第一位改为1，更换手机号
        NSMutableDictionary *loginData = [NSMutableDictionary dictionaryWithDictionary:[RXOSUserUtility sharedManager].loginData];
        int attr = [loginData[@"attr"] intValue];
        attr = attr | 2;
        
        [loginData setValue:@(attr) forKey:@"attr"];
        
        NSMutableDictionary *extDic = [NSMutableDictionary dictionary];
        if (loginData[@"ext"]) {
            extDic = [NSMutableDictionary dictionaryWithDictionary:loginData[@"ext"]];
        }
        NSString *phone = [ext valueForKey:@"phone"];
        phone = [RXOSCommonTool usernameSec:phone];
        if (phone.length > 4) {
            NSInteger zeroCount = 0;
            for (int i = 1; i < 5; i++) {
                NSString *subStr = [phone substringWithRange:NSMakeRange(i, 1)];
                if ([subStr isEqualToString:@"0"]) {
                    zeroCount++;
                } else {
                    break;
                }
            }
            if (zeroCount > 0) {
                phone = [phone stringByReplacingCharactersInRange:NSMakeRange(1, zeroCount) withString:@""];
            }
        }
        [extDic setValue:phone forKey:@"phone"];
        [loginData setValue:extDic forKey:@"ext"];
        
        [RXOSUserUtility sharedManager].loginData = loginData;
        
        for (UIView *subView in [UIApplication sharedApplication].keyWindow.subviews) {
            if ([subView isKindOfClass:[RXOSUserCenterView class]]) {
                RXOSUserCenterView *v = (RXOSUserCenterView *)subView;
                [v.webView refreshWebView];
            }
        }
        
    } else if ([method isEqualToString:@"change_phone"]) {
        
        // 换绑手机后更换手机号
        NSMutableDictionary *loginData = [NSMutableDictionary dictionaryWithDictionary:[RXOSUserUtility sharedManager].loginData];
        
        NSMutableDictionary *extDic = [NSMutableDictionary dictionary];
        if (loginData[@"ext"]) {
            extDic = [NSMutableDictionary dictionaryWithDictionary:loginData[@"ext"]];
        }
        NSString *phone = [ext valueForKey:@"phone"];
        phone = [RXOSCommonTool usernameSec:phone];
        if (phone.length > 4) {
            NSInteger zeroCount = 0;
            for (int i = 1; i < 5; i++) {
                NSString *subStr = [phone substringWithRange:NSMakeRange(i, 1)];
                if ([subStr isEqualToString:@"0"]) {
                    zeroCount++;
                } else {
                    break;
                }
            }
            if (zeroCount > 0) {
                phone = [phone stringByReplacingCharactersInRange:NSMakeRange(1, zeroCount) withString:@""];
            }
        }

        [extDic setValue:phone forKey:@"phone"];
        [loginData setValue:extDic forKey:@"ext"];
        
        [RXOSUserUtility sharedManager].loginData = loginData;
        
        // 修改登录记录
        NSMutableArray *accounts = [NSMutableArray arrayWithArray:[RXOSUserUtility sharedManager].accounts];
        for (int i = 0; i < accounts.count; i++) {
            NSMutableDictionary *userInfo = [NSMutableDictionary dictionaryWithDictionary:[RXOSUserUtility sharedManager].accounts[i]];
            // 相同openid并且是验证码登录替换手机号
            long loginType = [userInfo[@"loginType"] longValue];
            if ([loginData[@"openid"] isEqualToString:userInfo[@"openid"]] && loginType == 10) {
                [userInfo setValue:[ext valueForKey:@"phone"] forKey:@"username"];
                [userInfo setValue:[ext valueForKey:@"phone"] forKey:@"nickname"];
                [accounts replaceObjectAtIndex:i withObject:userInfo];
                [RXOSUserUtility saveAccounts:accounts];
                
                for (UIView *v in [UIApplication sharedApplication].keyWindow.subviews) {
                    if ([v isKindOfClass:[RXOSUserCenterView class]]) {
                        RXOSUserCenterView *userCenter = (RXOSUserCenterView *)v;
                        userCenter.usernameLbl.text = phone;
                    }
                }
            }
        }
        
        for (UIView *subView in [UIApplication sharedApplication].keyWindow.subviews) {
            if ([subView isKindOfClass:[RXOSUserCenterView class]]) {
                RXOSUserCenterView *v = (RXOSUserCenterView *)subView;
                [v.webView refreshWebView];
            }
        }
        
    } else if ([method isEqualToString:@"binding_email"]) {
        
        // 绑定手机后修改位运算，attr第一位改为1，更换手机号
        NSMutableDictionary *loginData = [NSMutableDictionary dictionaryWithDictionary:[RXOSUserUtility sharedManager].loginData];
        int attr = [loginData[@"attr"] intValue];
        attr = attr | 4;
        
        [loginData setValue:@(attr) forKey:@"attr"];
        
        NSMutableDictionary *extDic = [NSMutableDictionary dictionary];
        if (loginData[@"ext"]) {
            extDic = [NSMutableDictionary dictionaryWithDictionary:loginData[@"ext"]];
        }
        NSString *email = [ext valueForKey:@"email"];

        [extDic setValue:email forKey:@"email"];
        [loginData setValue:extDic forKey:@"ext"];
        
        [RXOSUserUtility sharedManager].loginData = loginData;
        
        for (UIView *subView in [UIApplication sharedApplication].keyWindow.subviews) {
            if ([subView isKindOfClass:[RXOSUserCenterView class]]) {
                RXOSUserCenterView *v = (RXOSUserCenterView *)subView;
                [v.webView refreshWebView];
            }
        }
        
    } else if ([method isEqualToString:@"change_email"]) {
        
        // 换绑邮箱后更换邮箱
        NSMutableDictionary *loginData = [NSMutableDictionary dictionaryWithDictionary:[RXOSUserUtility sharedManager].loginData];
        
        NSMutableDictionary *extDic = [NSMutableDictionary dictionary];
        if (loginData[@"ext"]) {
            extDic = [NSMutableDictionary dictionaryWithDictionary:loginData[@"ext"]];
        }
        NSString *email = [ext valueForKey:@"email"];

        [extDic setValue:email forKey:@"email"];
        [loginData setValue:extDic forKey:@"ext"];
        
        [RXOSUserUtility sharedManager].loginData = loginData;
        
        // 修改登录记录
        NSMutableArray *accounts = [NSMutableArray arrayWithArray:[RXOSUserUtility sharedManager].accounts];
        for (int i = 0; i < accounts.count; i++) {
            NSMutableDictionary *userInfo = [NSMutableDictionary dictionaryWithDictionary:[RXOSUserUtility sharedManager].accounts[i]];
            // 相同openid并且是邮箱登录
            long loginType = [userInfo[@"loginType"] longValue];
            if ([loginData[@"openid"] isEqualToString:userInfo[@"openid"]] && loginType == 1) {
                
                NSString *username = [userInfo valueForKey:@"username"];
//                if ([RXOSCommonTool validateEmail:username]) {
                    [userInfo setValue:email forKey:@"username"];
                    [userInfo setValue:email forKey:@"nickname"];
                    [accounts replaceObjectAtIndex:i withObject:userInfo];
                    [RXOSUserUtility saveAccounts:accounts];
                    
                    for (UIView *v in [UIApplication sharedApplication].keyWindow.subviews) {
                        if ([v isKindOfClass:[RXOSUserCenterView class]]) {
                            RXOSUserCenterView *userCenter = (RXOSUserCenterView *)v;
                            userCenter.usernameLbl.text = email;
                        }
                    }
//                }
            }
        }
        
        for (UIView *subView in [UIApplication sharedApplication].keyWindow.subviews) {
            if ([subView isKindOfClass:[RXOSUserCenterView class]]) {
                RXOSUserCenterView *v = (RXOSUserCenterView *)subView;
                [v.webView refreshWebView];
            }
        }
        
    } else if ([method isEqualToString:@"logBackIn"]) {
        
        for (UIView *v in [UIApplication sharedApplication].keyWindow.subviews) {
            if ([v isKindOfClass:[RXOSUserCenterView class]]) {
                RXOSUserCenterView *userCenter = (RXOSUserCenterView *)v;
                [userCenter hide];
            }
        }
        
    } else if ([method isEqualToString:@"real_auth"]) {
        
        // 实名后修改位运算，attr第一位改为1
        NSMutableDictionary *loginData = [NSMutableDictionary dictionaryWithDictionary:[RXOSUserUtility sharedManager].loginData];
        int attr = [loginData[@"attr"] intValue];
        attr = attr | 1;
        
        [loginData setValue:@(attr) forKey:@"attr"];
        
        [RXOSUserUtility sharedManager].loginData = loginData;
        
    }
}

@end
