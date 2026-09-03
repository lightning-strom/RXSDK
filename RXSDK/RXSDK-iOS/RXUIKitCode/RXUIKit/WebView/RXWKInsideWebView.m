//
//  RXWKInsideWebView.m
//  RXUIKit
//
//  Created by 陈汉 on 2025/1/20.
//

#import "RXWKInsideWebView.h"
#import "RXUICommonTool.h"
#import "RXUICommonHeader.h"
#import "RXInsideWebViewManager.h"

@interface RXWKInsideWebView () <WKNavigationDelegate, WKUIDelegate>

@property (nonatomic, strong) NSString *loginData;

@end

@implementation RXWKInsideWebView

- (instancetype)initWithWebView:(WKWebView *)webView
{
    self = [super init];
    if (self) {
        
        self.webView = webView;
        
//        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(isShowClose:) name:RXUINoti_resetPwd object:nil];
//        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(setCloseVisible:) name:RXUINoti_userCenterClose object:nil];
        
        [self registJSFunction];
    }
    return self;
}

#pragma mark -- <notiActions>

#pragma mark - 创建桥接
// js调用oc
- (void)registJSFunction
{
    // 帮助中心
    [self.webView.configuration.userContentController addScriptMessageHandler:self name:@"openHelpCenter"];
    
    // 客服
    [self.webView.configuration.userContentController addScriptMessageHandler:self name:@"openCustomerService"];
    
    // 用户中心
    [self.webView.configuration.userContentController addScriptMessageHandler:self name:@"openUserCenter"];
}

// oc调用js
- (void)regisOCToJS
{
//    [self.webView evaluateJavaScript: @"OCCallJSMethod('jsonString')"
//               completionHandler:^(id response, NSError * error) {
//            NSLog(@"response: %@, \nerror: %@", response, error);
//     }];
}

#pragma mark - webView delegate
#pragma mark - 需要响应身份验证时调用 同样在block中需要传入用户身份凭证
// 页面开始加载时调用
- (void)webView:(WKWebView *)webView didStartProvisionalNavigation:(WKNavigation *)navigation
{
    
}

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

- (void)webView:(WKWebView *)webView didFailNavigation:(null_unspecified WKNavigation *)navigation withError:(NSError *)error
{
    NSLog(@"加载失败1");
}

- (void)webView:(WKWebView *)webView didFailProvisionalNavigation:(WKNavigation *)navigation withError:(NSError *)error
{
    NSLog(@"加载失败");
}

- (void)webView:(WKWebView *)webView didFinishNavigation:(WKNavigation *)navigation{
    NSLog(@"加载完成");
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
    [[RXInsideWebViewManager sharedSDK] fetchJSInfoWithMethod:message.name info:message.body webView:self.webView];
}

@end
