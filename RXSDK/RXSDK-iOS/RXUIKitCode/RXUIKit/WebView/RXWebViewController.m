//
//  RXWebViewController.m
//  RXSDK
//
//  Created by 陈汉 on 2021/10/21.
//

#import "RXWebViewController.h"
#import "RXUICommonHeader.h"
#import "RXWebViewManager.h"

@interface RXWebViewController () <WKNavigationDelegate, WKUIDelegate>

@property (nonatomic, assign) NSInteger orientation;  // 屏幕方向 1竖屏 2横屏
//@property (nonatomic, strong) WKWebViewJavascriptBridge *bridge;

@end

@implementation RXWebViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    self.orientation = [RXUICommonTool getInterfaceOrientation];
    
    [self setupJsBridge];
    [self setUI];
    [self loadRequest];
}

#pragma mark -- <setUI>
- (void)setUI
{
    [self.view addSubview:[self naviBar]];
    [self.view addSubview:self.webView];
    
    UIWindow *window = [UIApplication sharedApplication].keyWindow;
    _webView.frame = CGRectMake(0, 0, window.frame.size.height, window.frame.size.height);
//    _webView.frame = CGRectMake(0, 0, window.frame.size.height, window.frame.size.height);
//    _webView.sd_layout.spaceToSuperView(UIEdgeInsetsZero);
//    _webView.sd_layout.topSpaceToView(self.view, self.orientation == 2 ? 60 : kRXNavigationAndStatusHeight);
}

- (void)loadRequest{
    NSString *encodeRequest = [self.urlStr stringByAddingPercentEncodingWithAllowedCharacters:[NSCharacterSet characterSetWithCharactersInString:@"!@$^%*+,;'\"`<>()[]{}\\| "].invertedSet];

    NSURL *url = [NSURL URLWithString:encodeRequest];
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url
                                                           cachePolicy:NSURLRequestReloadIgnoringLocalCacheData
                                                       timeoutInterval:40.0];
    [self.webView loadRequest:request];
    
//    NSString *filePath = [[NSBundle mainBundle] pathForResource:@"test-3" ofType:@"html"];
//    NSString *htmlString = [NSString stringWithContentsOfFile:filePath encoding:NSUTF8StringEncoding error:nil];
//    NSURL *url = [[NSURL alloc] initWithString:filePath];
//    [self.webView loadHTMLString:htmlString baseURL:url];
//    [self.webView setJavascriptCloseWindowListener:^{
//        NSLog(@"window.close called");
//    } ];
}

- (void)setUrlStr:(NSString *)urlStr
{
    _urlStr = urlStr;
    [self registJSFunction];
    [self regisOCToJS];
    [self setCookie];
    [self loadRequest];
}

#pragma mark - 创建桥接
- (void)setupJsBridge
{
//#ifdef DEBUG
//    [WKWebViewJavascriptBridge enableLogging];
//#else
//#endif
//    _bridge = [WKWebViewJavascriptBridge bridgeForWebView:self.webView];
//    [_bridge setWebViewDelegate:self];
}

// js调用oc
- (void)registJSFunction
{
    // 打开webView
    [self.webView.configuration.userContentController addScriptMessageHandler:self name:@"openWebView"];
    
    // 通用回调
    [self.webView.configuration.userContentController addScriptMessageHandler:self name:@"callback"];
    
    // 重新登录
    [self.webView.configuration.userContentController addScriptMessageHandler:self name:@"logBackIn"];
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
        // 通过浏览器访问
        RXWebViewController *webVC = [[RXWebViewController alloc] init];
        webVC.urlStr = absoluteString;
        webVC.modalPresentationStyle = UIModalPresentationCustom;
        [[UIViewController currentViewController] presentViewController:webVC animated:YES completion:nil];
        decisionHandler(WKNavigationActionPolicyCancel);
    } else {
        decisionHandler (WKNavigationActionPolicyAllow);
    }
    return ;//不添加会崩溃
}

- (void)userContentController:(WKUserContentController *)userContentController didReceiveScriptMessage:(WKScriptMessage *)message {
    // message.name  添加监听的方法名
//    [RXWebViewManager fetchJSInfoWithMethod:message.name info:message.body];
}

- (void)webView:(WKWebView *)webView runJavaScriptAlertPanelWithMessage:(NSString *)message initiatedByFrame:(WKFrameInfo *)frame completionHandler:(void (^)(void))completionHandler {
    
    UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"alert" message:message preferredStyle:UIAlertControllerStyleAlert];
    [alert addAction:[UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
        completionHandler();
    }]];
    
    [self presentViewController:alert animated:YES completion:NULL];
}

- (void)webView:(WKWebView *)webView runJavaScriptConfirmPanelWithMessage:(NSString *)message initiatedByFrame:(WKFrameInfo *)frame completionHandler:(void (^)(BOOL result))completionHandler {
    
    UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"confirm" message:@"JS调用confirm" preferredStyle:UIAlertControllerStyleAlert];
    [alert addAction:[UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
        completionHandler(YES);
    }]];
    [alert addAction:[UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
        completionHandler(NO);
    }]];
    [self presentViewController:alert animated:YES completion:NULL];
    
}

#pragma mark -- <actions>
- (void)closeBtnAction
{
    [self dismissViewControllerAnimated:YES completion:nil];
}

#pragma mark -- <getters && setters>
- (UIView *)naviBar
{
    UIView *naviBg = [[UIView alloc] init];
    naviBg.backgroundColor = [UIColor whiteColor];
    
//    naviBg.sd_layout.topSpaceToView(self.view, 0)
//    .widthIs(__MainScreen_Width)
//    .heightIs(self.orientation == 2 ? 60 : kRXNavigationAndStatusHeight);
    
    UIButton *closeBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    [closeBtn setImage:[UIImage rxBundleImageNamed:@"close"] forState:UIControlStateNormal];
    [closeBtn addTarget:self action:@selector(closeBtnAction) forControlEvents:UIControlEventTouchUpInside];
    [naviBg addSubview:closeBtn];
    
//    closeBtn.sd_layout.topSpaceToView(naviBg, self.orientation == 2 ? 30 :kRXStatusBarHeight + 10)
//    .leftSpaceToView(naviBg, 14)
//    .widthIs(18)
//    .heightEqualToWidth();
//
//    UILabel *titleLbl = [[UILabel alloc] init];
//    titleLbl.text = @"隐私声明";
//    titleLbl.font = [UIFont systemFontOfSize:20];
//    titleLbl.textAlignment = NSTextAlignmentCenter;
//    [naviBg addSubview:titleLbl];
//
//    titleLbl.sd_layout.topSpaceToView(naviBg, self.orientation == 2 ? 20 : kRXStatusBarHeight)
//    .widthIs(__MainScreen_Width)
//    .heightIs(self.orientation == 2 ? 40 : kRXNavigationAndStatusHeight - kRXStatusBarHeight);
    
    return naviBg;
}

- (void)setCookie
{
    NSMutableDictionary *baseInfo = [NSMutableDictionary dictionary];
    [baseInfo setValue:[RXUIUserUtility sharedManager].cpid forKey:@"cpid"];
    [baseInfo setValue:[RXUIUserUtility sharedManager].productId forKey:@"productid"];
    [baseInfo setValue:[RXUIUserUtility sharedManager].channelId forKey:@"channelid"];
    [baseInfo setValue:[[RXService sharedSDK] getFirstBaseUrl] forKey:@"domain"];
    [baseInfo setValue:[[RXApiService sharedSDK] getDeviceIDInKeychain] forKey:@"devicecode"];
    
    NSString *jsonStr1 = [RXUICommonTool getJsonString:baseInfo];
    jsonStr1 = [jsonStr1 stringByReplacingOccurrencesOfString:@"\n" withString:@""];
    NSString *baseInfoJs1 = [NSString stringWithFormat:@"%@", jsonStr1];
    
    NSString *jsonStr2 = [RXUICommonTool getJsonString:[RXUIUserUtility sharedManager].loginData];
    jsonStr2 = [jsonStr2 stringByReplacingOccurrencesOfString:@"\n" withString:@""];
    NSString *baseInfoJs2 = [NSString stringWithFormat:@"%@", jsonStr2];
    
    
    NSMutableDictionary *jsonDic = [NSMutableDictionary dictionary];
    [jsonDic setValue:baseInfoJs1 forKey:@"api_params"];
    [jsonDic setValue:baseInfoJs2 forKey:@"login_data"];
    
    NSString *jsonStr = [RXUICommonTool getJsonString:jsonDic];
    NSString *baseInfoJs = [NSString stringWithFormat:@"window.iOSInfo=%@", jsonStr];
    
    WKUserScript *cookieScript = [[WKUserScript alloc] initWithSource:baseInfoJs injectionTime:WKUserScriptInjectionTimeAtDocumentStart forMainFrameOnly:YES];
    [self.webView.configuration.userContentController addUserScript:cookieScript];
    
    //设置cookie
    // 将所有cookie以document.cookie = 'key=value';形式进行拼接
    NSMutableString *cookie = @"".mutableCopy;
    if (jsonDic) {
        for (NSString *key in jsonDic.allKeys) {
            [cookie appendFormat:@"document.cookie = '%@=%@';\n",key,jsonDic[key]];
        }
    }

    WKUserScript *cookieInfoScript = [[WKUserScript alloc] initWithSource:cookie injectionTime:WKUserScriptInjectionTimeAtDocumentStart forMainFrameOnly:NO];
    [self.webView.configuration.userContentController addUserScript:cookieInfoScript];
}

#pragma mark -- <lazy>
- (WKWebView *)webView
{
    if (!_webView) {
        WKWebViewConfiguration *wkWebConfig = [[WKWebViewConfiguration alloc] init];
        NSString *jSString = [NSString stringWithFormat:@"var meta = document.createElement('meta'); meta.setAttribute('name', 'viewport'); meta.setAttribute('content', 'width=%f'); document.getElementsByTagName('head')[0].appendChild(meta);", __MainScreen_Width];
        WKUserScript *wkUserScript = [[WKUserScript alloc] initWithSource:jSString injectionTime:WKUserScriptInjectionTimeAtDocumentEnd forMainFrameOnly:YES];
        [wkWebConfig.userContentController addUserScript:wkUserScript];
        
        _webView = [[WKWebView alloc] initWithFrame:CGRectZero configuration:wkWebConfig];
        _webView.backgroundColor = [UIColor clearColor];
        _webView.navigationDelegate = self;
    }
    return _webView;
}

@end
