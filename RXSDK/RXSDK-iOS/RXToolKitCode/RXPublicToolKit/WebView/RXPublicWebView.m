//
//  RXPublicWebView.m
//  RXPublicToolKit
//
//  Created by 陈汉 on 2024/4/9.
//

#import "RXPublicWebView.h"
#import "RXToolPrivate.h"
#import "RXToolKit.h"
#import "RXPublicWebViewManager.h"

@interface RXPublicWebView () <WKNavigationDelegate, WKUIDelegate>

@property (nonatomic, strong) NSString *cookies;
@property (nonatomic, strong) NSString *defaultTitle;

@end

@implementation RXPublicWebView

- (void)viewDidLoad {
    [super viewDidLoad];
    
    self.view.backgroundColor = [UIColor whiteColor];
    
    if ([RXToolPrivate isRTL]) {
        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
    } else {
        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
    }
    
    [self setUI];
    [self loadRequest];
    [self addNotifications];
}

- (void)addNotifications
{
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(isShowClose:) name:RXToolNoti_showClose object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(isShowBack:) name:RXToolNoti_showBack object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(closeWebView:) name:RXToolNoti_closeWebView object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(setNaviBarVisible:) name:RXToolNoti_setNaviBarVisible object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(setNaviTitle:) name:RXToolNoti_setTitle object:nil];
}

#pragma mark -- <notiActions>
- (void)setNaviTitle:(NSNotification *)noti
{
    NSDictionary *dic = noti.userInfo;
    NSString *title = dic[@"title"];
    
    [self setTitleStr:title];
}

- (void)setNaviBarVisible:(NSNotification *)noti
{
    NSDictionary *dic = noti.userInfo;
    BOOL isShowNaviBar = [dic[@"isShowNaviBar"] boolValue];
    
    UIWindow *window = [UIApplication sharedApplication].keyWindow;
    if (!isShowNaviBar) {
        _webView.frame = CGRectMake(0, 0, CGRectGetWidth(window.frame), CGRectGetHeight(window.frame));
        self.naviBar.hidden = YES;
    } else {
        _webView.frame = CGRectMake(0, CGRectGetMaxY(_naviBar.frame), CGRectGetWidth(window.frame), CGRectGetHeight(window.frame));
        self.naviBar.hidden = NO;
    }
}

- (void)isShowClose:(NSNotification *)noti
{
    NSDictionary *dic = noti.userInfo;
    BOOL isShowClose = [dic[@"isShowClose"] boolValue];
    
    if (!isShowClose) {
        self.naviBar.closeBtn.hidden = YES;
    } else {
        self.naviBar.closeBtn.hidden = NO;
    }
}

- (void)isShowBack:(NSNotification *)noti
{
    NSDictionary *dic = noti.userInfo;
    BOOL isShowClose = [dic[@"isShowBack"] boolValue];
    
    if (!isShowClose) {
        self.naviBar.backBtn.hidden = YES;
    } else {
        self.naviBar.backBtn.hidden = NO;
    }
}

- (void)closeWebView:(NSNotification *)noti
{
    [self closeCallback];
}

- (void)closeCallback
{
    @try {
        [self dismissViewControllerAnimated:YES completion:^{
            [[RXToolKit sharedSDK].webViewDelegate rx_closeWebView];
        }];
    } @catch (NSException *exception) {
        NSLog(@"%@", exception);
    } @finally {
        
    }
}

- (void)decidePolicyForNavigationResponseCallback:(NSInteger)code
{
    @try {
        [[RXToolKit sharedSDK].webViewDelegate rx_decidePolicyForNavigationResponse:code];
    } @catch (NSException *exception) {
        NSLog(@"%@", exception);
    } @finally {
        
    }
}

- (void)didFinishNavigationCallback:(NSString *)string dic:(NSDictionary *)dic
{
    @try {
        [[RXToolKit sharedSDK].webViewDelegate rx_didFinishNavigation:string schemeParams:dic];
    } @catch (NSException *exception) {
        NSLog(@"%@", exception);
    } @finally {
        
    }
}

- (void)decidePolicyForNavigationActionCallback:(NSString *)string dic:(NSDictionary *)dic
{
    @try {
        [[RXToolKit sharedSDK].webViewDelegate rx_decidePolicyForNavigationAction:string schemeParams:dic];
    } @catch (NSException *exception) {
        NSLog(@"%@", exception);
    } @finally {
        
    }
}

#pragma mark -- <setUI>
- (void)setUI
{
    [self.view addSubview:self.webView];
    
    UIWindow *window = [UIApplication sharedApplication].keyWindow;
    
    _naviBar = [[RXPublicWebViewNaviBarView alloc] initWithFrame:CGRectMake(0, 0, CGRectGetWidth(window.frame), RXToolAC ? 44 : kRXToolNavigationAndStatusHeight)];
    _naviBar.titleStr = _titleStr;
    _naviBar.isShowBackBtn = NO;
    _naviBar.titleStyle = _titleStyle;
    
    __weak typeof(self) weakSelf = self;
    _naviBar.backBlock = ^{
        if ([weakSelf.webView canGoBack]) {
            [weakSelf.webView goBack];
        } else {
            [weakSelf dismissViewControllerAnimated:YES completion:^{
                [self closeCallback];
            }];
        }
    };
    _naviBar.closeBlock = ^{
        [weakSelf dismissViewControllerAnimated:YES completion:^{
            [self closeCallback];
        }];
    };
    
    [self.view addSubview:self.naviBar];
    
    _webView.frame = CGRectMake(0, CGRectGetMaxY(_naviBar.frame), CGRectGetWidth(window.frame), CGRectGetHeight(window.frame) - CGRectGetMaxY(_naviBar.frame));
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
//    _urlStr = @"https://www.baidu.com";
    [self registJSFunction];
    [self regisOCToJS];
    [self loadRequest];
}

- (void)setTitleStr:(NSString *)titleStr
{
    if (_defaultTitle.length <= 0) {
        _defaultTitle = titleStr;
    }
    _titleStr = titleStr;
    if (self.naviBar) {
        self.naviBar.titleStr = titleStr;
    }
}

- (void)setIsShowBackBtn:(BOOL)isShowBackBtn
{
    _isShowBackBtn = isShowBackBtn;
}

- (void)setTitleStyle:(RXPublicWebviewTitleStyle)titleStyle
{
    _titleStyle = titleStyle;
}

#pragma mark - 创建桥接
// js调用oc
- (void)registJSFunction
{
    // 打开webView
    [self.webView.configuration.userContentController addScriptMessageHandler:self name:@"openWebView"];
    
    // 获取初始化及登录数据
    [self.webView.configuration.userContentController addScriptMessageHandler:self name:@"getInitParams"];
    
    // 控制关闭按钮
    [self.webView.configuration.userContentController addScriptMessageHandler:self name:@"setCloseVisible"];
    
    // 控制返回按钮
    [self.webView.configuration.userContentController addScriptMessageHandler:self name:@"setBackVisible"];
    
    // 关闭webView
    [self.webView.configuration.userContentController addScriptMessageHandler:self name:@"closeWebView"];
    
    // 隐藏原生头
    [self.webView.configuration.userContentController addScriptMessageHandler:self name:@"setNaviBarVisible"];
    
    // 设置标题
    [self.webView.configuration.userContentController addScriptMessageHandler:self name:@"setTitle"];
    
    // 通用回调
    [self.webView.configuration.userContentController addScriptMessageHandler:self name:@"invokeNativeCallback"];
}
// oc调用js
- (void)regisOCToJS
{
    
}

/**
 * 设置写入数据
 */
- (NSString *)setCookie:(NSDictionary *)cookie
{
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:cookie options:kNilOptions error:nil];
    NSString *jsonStr = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
    
    //        NSString *jsStr = [NSString stringWithFormat:@"getInitParams('%@')", jsonStr];
    NSString *jsStr = [NSString stringWithFormat:@"var getInitParams = %@", jsonStr];
    //
    WKUserScript *cookieScript = [[WKUserScript alloc] initWithSource:jsStr injectionTime:WKUserScriptInjectionTimeAtDocumentStart forMainFrameOnly:YES];
    [self.webView.configuration.userContentController addUserScript:cookieScript];
    
    self.cookies = jsonStr;
    
    return jsonStr;
}

#pragma mark - webView delegate
- (void)webView:(WKWebView *)webView decidePolicyForNavigationResponse:(WKNavigationResponse *)navigationResponse decisionHandler:(void (^)(WKNavigationResponsePolicy))decisionHandler
{
    NSInteger code = ((NSHTTPURLResponse *)navigationResponse.response).statusCode;
    if (code == 200)
    {
        
    } else {
        [self decidePolicyForNavigationResponseCallback:code];
    }
    
    decisionHandler(WKNavigationResponsePolicyAllow);
}

- (void)webView:(WKWebView *)webView didFinishNavigation:(WKNavigation *)navigation{
    NSURL *URL = webView.URL;
    NSString *scheme = [URL scheme];
    NSString *absoluteString = [webView.URL.absoluteString stringByRemovingPercentEncoding];
    NSLog(@"finish scheme: %@", absoluteString);
    
    [self changeBackBtnStatus];

    NSDictionary *resDic = [RXToolPrivate fetchWebViewSchemes:absoluteString];
    
    [self didFinishNavigationCallback:absoluteString dic:resDic];
    
//#pragma mark -禁止用户选择
//    [webView evaluateJavaScript:@"document.documen1tElement.style.webkitUserSelect='none';" completionHandler:nil];
//    [webView evaluateJavaScript:@"document.activeElement.blur();" completionHandler:nil];
//#pragma mark -禁止缩放手势
//    NSString *injectionJSString = @"var script = document.createElement('meta');"
//    "script.name = 'viewport';"
//    "script.content=\"width=device-width, user-scalable=no\";"
//    "document.getElementsByTagName('head')[0].appendChild(script);";
//    [webView evaluateJavaScript:injectionJSString completionHandler:nil];
}

- (void)webView:(WKWebView *)webView decidePolicyForNavigationAction:(WKNavigationAction *)navigationAction decisionHandler:(void (^)(WKNavigationActionPolicy))decisionHandler {
    NSURL *URL = navigationAction.request.URL;
    NSString *scheme = [URL scheme];
    NSString *absoluteString = [navigationAction.request.URL.absoluteString stringByRemovingPercentEncoding];
    
    NSDictionary *resDic = [RXToolPrivate fetchWebViewSchemes:absoluteString];
    
    [self decidePolicyForNavigationActionCallback:absoluteString dic:resDic];
    
    if (![[absoluteString substringToIndex:4] containsString:@"http"]) {
        if (self.resultBlock) {
            self.resultBlock(absoluteString);
        }
    }
    
    [self changeBackBtnStatus];
    
//    NSLog(@"URLSTRING: %@", absoluteString);
    if (navigationAction.navigationType == WKNavigationTypeLinkActivated) {
        decisionHandler(WKNavigationActionPolicyCancel);
    } else {
        if (![[absoluteString substringToIndex:4] containsString:@"http"]) {
            if (self.resultBlock) {
                self.resultBlock(absoluteString);
            }
        }
        
        decisionHandler (WKNavigationActionPolicyAllow);
    }
    return ;//不添加会崩溃
}

- (void)userContentController:(WKUserContentController *)userContentController didReceiveScriptMessage:(WKScriptMessage *)message {
    // message.name  添加监听的方法名
    [RXPublicWebViewManager sharedSDK].complete = self.complete;
    [[RXPublicWebViewManager sharedSDK] fetchJSInfoWithMethod:message.name info:message.body webView:self.webView];
    
    if ([message.name isEqualToString:@"getNativeInitParams"]) {
        
        [self.webView evaluateJavaScript:[NSString stringWithFormat:@"getNativeInitParams('%@')", self.cookies]
                       completionHandler:^(id response, NSError * error) {
            NSLog(@"response: %@, \nerror: %@", response, error);
        }];
    }
}

- (void)changeBackBtnStatus
{
    if ([self.webView canGoBack]) {
        self.naviBar.isShowBackBtn = YES;
    } else {
        if (_defaultTitle.length > 0) {
//            [self setTitleStr:_defaultTitle];
        }
        self.naviBar.isShowBackBtn = NO;
    }
}

#pragma mark -- <actions>
- (void)dismiss
{
    // 主动关闭不回调
    [self dismissViewControllerAnimated:YES completion:^{
        
    }];
}

#pragma mark -- <lazy>
- (WKWebView *)webView
{
    if (!_webView) {
        WKWebViewConfiguration *wkWebConfig = [[WKWebViewConfiguration alloc] init];
        _webView = [[WKWebView alloc] initWithFrame:CGRectZero configuration:wkWebConfig];
        _webView.backgroundColor = [UIColor clearColor];
        _webView.navigationDelegate = self;
        _webView.scrollView.contentInsetAdjustmentBehavior = UIScrollViewContentInsetAdjustmentNever;
    }
    return _webView;
}

@end
