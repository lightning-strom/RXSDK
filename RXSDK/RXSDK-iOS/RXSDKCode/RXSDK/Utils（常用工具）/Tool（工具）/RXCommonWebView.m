//
//  RXCommonWebView.m
//  RXSDK
//
//  Created by 陈汉 on 2023/6/10.
//

#import "RXCommonWebView.h"
#import <objc/message.h>
#import "RXCommonHeader.h"

@interface RXCommonWebView () <WKNavigationDelegate, WKUIDelegate>

@end

@implementation RXCommonWebView

- (instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
//        [[UIApplication sharedApplication].keyWindow addSubview:self];
        
        [self setUI];
        [self show];
        
//        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(isShowClose:) name:RXUINoti_resetPwd object:nil];
    }
    return self;
}

- (void)show
{
    [UIView animateWithDuration:0.1 animations:^{
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.5];
        
//        [RXUICommonTool showWithAnimate:self];
        
        [self layoutSubviews];
    }];
}

- (void)hide
{
    if ([RXSubPackage sharedSDK].aRXUI) {
        NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
        [RXNotificationCenter postNoti:rxUserDefault_ui_hidehud object:nil userInfo:notiDic];
    }
    
    if ([RXSubPackage sharedSDK].aRXOSUI) {
        NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
        [RXNotificationCenter postNoti:rxUserDefault_osui_hidehud object:nil userInfo:notiDic];
    }
    
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    [self removeFromSuperview];
}

#pragma mark -- <notiActions>
- (void)closeWebView:(NSNotification *)noti
{
    if (self.tag != 90000) {
        [self hide];
    }
}

#pragma mark -- <setUI>
- (void)setUI
{
    [self addSubview:self.webView];
    
    UIWindow *window = [UIApplication sharedApplication].keyWindow;
    
    
    _webView.frame = CGRectMake(0, 0, window.frame.size.width, window.frame.size.height);
    _webView.center = window.center;
    
    if (@available(iOS 11.0, *)) {
        _webView.scrollView.contentInsetAdjustmentBehavior = UIScrollViewContentInsetAdjustmentNever;
    } else {
        // Fallback on earlier versions
    }
}

- (void)loadRequest{

    NSString *encodeRequest = [self.urlStr stringByAddingPercentEncodingWithAllowedCharacters:[NSCharacterSet characterSetWithCharactersInString:@"!@$^%*+,;'\"`<>()[]{}\\| "].invertedSet];

    NSURL *url = [NSURL URLWithString:encodeRequest];
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url
                                                           cachePolicy:NSURLRequestReloadIgnoringLocalCacheData
                                                       timeoutInterval:40.0];
    [self.webView loadRequest:request];
    [self registJSFunction];
    
//    NSString *filePath = [[NSBundle mainBundle] pathForResource:@"captcha" ofType:@"html"];
//    NSString *htmlString = [NSString stringWithContentsOfFile:filePath encoding:NSUTF8StringEncoding error:nil];
//    NSURL *url = [[NSURL alloc] initWithString:filePath];
//    [self.webView loadHTMLString:htmlString baseURL:url];
//    [self registJSFunction];
//    [self.webView setJavascriptCloseWindowListener:^{
//        NSLog(@"window.close called");
//    } ];
}

- (void)setUrlStr:(NSString *)urlStr
{
    _urlStr = urlStr;
    NSString *captcha_app_id = [self.params valueForKey:@"captcha_app_id"];
    _urlStr = [NSString stringWithFormat:@"%@?captcha_app_id=%@", _urlStr, captcha_app_id];
    [self regisOCToJS];
    [self setCookie];
    [self loadRequest];
}

#pragma mark - 创建桥接
// js调用oc
- (void)registJSFunction
{
    // 滑块验证码获取成功
    [self.webView.configuration.userContentController addScriptMessageHandler:self name:@"sliderCaptcha"];
    

}
// oc调用js
- (void)regisOCToJS
{
//    [self.webView evaluateJavaScript: @"OCCallJSMethod('jsonString')"
//               completionHandler:^(id response, NSError * error) {
//            NSLog(@"response: %@, \nerror: %@", response, error);
//     }];
}

- (void)setCookie
{
//    NSMutableDictionary *baseInfo = [NSMutableDictionary dictionary];
//    [baseInfo setValue:[RXUIUserUtility sharedManager].cpid forKey:@"cpid"];
//    [baseInfo setValue:[RXUIUserUtility sharedManager].productId forKey:@"productid"];
//    [baseInfo setValue:[RXUIUserUtility sharedManager].channelId forKey:@"channelid"];
//    [baseInfo setValue:[[RXService sharedSDK] getFirstBaseUrl] forKey:@"domain"];
//    [baseInfo setValue:[[RXApiService sharedSDK] getDeviceIDInKeychain] forKey:@"devicecode"];
//    [baseInfo setValue:[[RXApiService sharedSDK] getTimeZoneOffset] forKey:@"tzoffset"];
//    [baseInfo setValue:[[RXApiService sharedSDK] getSystemLanguage] forKey:@"language"];
//
//    NSString *jsonStr1 = [RXUICommonTool getJsonString:baseInfo];
//    jsonStr1 = [jsonStr1 stringByReplacingOccurrencesOfString:@"\n" withString:@""];
//    NSString *baseInfoJs1 = [NSString stringWithFormat:@"%@", jsonStr1];
//
//    NSMutableDictionary *loginDic = [NSMutableDictionary dictionaryWithDictionary:[RXUIUserUtility sharedManager].loginData];
//
//    NSString *jsonStr2 = [RXUICommonTool getJsonString:loginDic];
//    jsonStr2 = [jsonStr2 stringByReplacingOccurrencesOfString:@"\n" withString:@""];
//    NSString *baseInfoJs2 = [NSString stringWithFormat:@"%@", jsonStr2];
//
//    NSMutableDictionary *jsonDic = [NSMutableDictionary dictionary];
//    [jsonDic setValue:baseInfoJs1 forKey:@"api_params"];
//    [jsonDic setValue:baseInfoJs2 forKey:@"login_data"];
////
////    NSString *jsonStr = [RXUICommonTool getJsonString:jsonDic];
//    //    NSString *baseInfoJs = [NSString stringWithFormat:@"window.iOSInfo=%@", jsonStr];
//
//    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:jsonDic options:kNilOptions error:nil];
//    NSString *jsonStr = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
//
////        NSString *jsStr = [NSString stringWithFormat:@"getInitParams('%@')", jsonStr];
//    NSString *jsStr = [NSString stringWithFormat:@"var getInitParams = %@", jsonStr];
////
//    WKUserScript *cookieScript = [[WKUserScript alloc] initWithSource:jsStr injectionTime:WKUserScriptInjectionTimeAtDocumentStart forMainFrameOnly:YES];
//    [self.webView.configuration.userContentController addUserScript:cookieScript];
}

#pragma mark - webView delegate
#pragma mark - 需要响应身份验证时调用 同样在block中需要传入用户身份凭证
- (void)webView:(WKWebView *)webView didReceiveAuthenticationChallenge:(NSURLAuthenticationChallenge *)challenge completionHandler:(void (^)(NSURLSessionAuthChallengeDisposition, NSURLCredential * _Nullable))completionHandler {
    
    if ([challenge.protectionSpace.authenticationMethod isEqualToString:NSURLAuthenticationMethodServerTrust]) {
//        判断服务器采用的验证方法
        if (challenge.previousFailureCount == 0) {
//        如果没有错误的情况下 创建一个凭证，并使用证书
            NSURLCredential *credential = [NSURLCredential credentialForTrust:challenge.protectionSpace.serverTrust];
            completionHandler(NSURLSessionAuthChallengeUseCredential, credential);
        } else {
//        验证失败，取消本次验证
            completionHandler(NSURLSessionAuthChallengeUseCredential, nil);
        }
    } else {
        completionHandler(NSURLSessionAuthChallengeUseCredential, nil);
    }
}

- (void)webView:(WKWebView *)webView didFinishNavigation:(WKNavigation *)navigation{
#pragma mark -禁止用户选择
    [webView evaluateJavaScript:@"document.documentElement.style.webkitUserSelect='none';" completionHandler:nil];
    [webView evaluateJavaScript:@"document.activeElement.blur();" completionHandler:nil];
#pragma mark -禁止缩放手势
    NSString *injectionJSString = @"var script = document.createElement('meta');"
    "script.name = 'viewport';"
    "script.content=\"width=device-width, user-scalable=no\";"
    "document.getElementsByTagName('head')[0].appendChild(script);";
    [webView evaluateJavaScript:injectionJSString completionHandler:nil];
}

- (void)webView:(WKWebView *)webView decidePolicyForNavigationAction:(WKNavigationAction *)navigationAction decisionHandler:(void (^)(WKNavigationActionPolicy))decisionHandler {
    NSURL *URL = navigationAction.request.URL;
    NSString *scheme = [URL scheme];
    NSString *absoluteString = [navigationAction.request.URL.absoluteString stringByRemovingPercentEncoding];
    NSLog(@"URLSTRING: %@", absoluteString);
    if (navigationAction.navigationType == WKNavigationTypeLinkActivated) {
        decisionHandler(WKNavigationActionPolicyCancel);
    } else {
        decisionHandler (WKNavigationActionPolicyAllow);
    }
    return ;//不添加会崩溃
}

- (void)userContentController:(WKUserContentController *)userContentController didReceiveScriptMessage:(WKScriptMessage *)message {
    // message.name  添加监听的方法名
//    [RXWebViewManager sharedSDK].complete = self.complete;
//    [[RXWebViewManager sharedSDK] fetchJSInfoWithMethod:message.name info:message.body webView:self.webView];
    if ([message.name isEqualToString:@"sliderCaptcha"]) {
        NSData *jsonData = [message.body dataUsingEncoding:NSUTF8StringEncoding];
        NSDictionary *dic = [NSJSONSerialization JSONObjectWithData:jsonData options:NSJSONReadingMutableContainers error:nil];
        if (self.complete) {
            self.complete(dic);
        }
    }
    
    [self hide];
}

#pragma mark -- <actions>
- (void)backBtnAction:(UIButton *)btn
{
    if ([self.webView canGoBack]) {
        [self.webView goBack];
    } else {
        [self hide];
    }
}

- (void)closeBtnAction:(UIButton *)btn
{
    [self hide];
}

#pragma mark -- <lazy>
- (WKWebView *)webView
{
    if (!_webView) {
        UIWindow *window = [UIApplication sharedApplication].keyWindow;
        WKWebViewConfiguration *wkWebConfig = [[WKWebViewConfiguration alloc] init];
//        NSString *jSString = [NSString stringWithFormat:@"var meta = document.createElement('meta'); meta.setAttribute('name', 'viewport'); meta.setAttribute('content', 'width=%f'); document.getElementsByTagName('head')[0].appendChild(meta);", window.frame.size.width];
//        WKUserScript *wkUserScript = [[WKUserScript alloc] initWithSource:jSString injectionTime:WKUserScriptInjectionTimeAtDocumentEnd forMainFrameOnly:YES];
//        [wkWebConfig.userContentController addUserScript:wkUserScript];
        
        _webView = [[WKWebView alloc] initWithFrame:CGRectZero configuration:wkWebConfig];
        _webView.backgroundColor = [UIColor clearColor];
        _webView.scrollView.backgroundColor = [UIColor clearColor];
        _webView.opaque = NO;
        _webView.navigationDelegate = self;
    }
    return _webView;
}

@end
