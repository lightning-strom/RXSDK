//
//  TestWebView.m
//  RXUIKitDemo
//
//  Created by 陈汉 on 2025/1/20.
//

#import "TestWebView.h"

@interface TestWebView () <WKNavigationDelegate, WKUIDelegate>

@end

@implementation TestWebView

- (instancetype)initWithUrl:(NSString *)url
                      title:(NSString *)title
                    content:(NSString *)content
{
    self = [super initWithFrame:[UIApplication sharedApplication].keyWindow.frame];
    if (self) {
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
        [[UIApplication sharedApplication].keyWindow addSubview:self];
                
        self.url = url;
        self.content = content;
        
        if (url && url.length > 3 && [[url substringToIndex:4] isEqualToString:@"http"]) {
            self.url = url;
            self.content = @"";
        } else {
            self.content = url;
            self.url = @"";
        }
        
        self.title = title;
        
        [self setUI];
        [self show];
        [self loadRequest];
        
        // 监听屏幕旋转（横竖屏）
//        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onDeviceOrientationDidChange)
//                             name:UIDeviceOrientationDidChangeNotification
//                                                       object:nil];
    }
    return self;
}

- (BOOL)onDeviceOrientationDidChange{
    //获取当前设备Device
    UIDevice *device = [UIDevice currentDevice];
    //识别当前设备的旋转方向
    switch (device.orientation) {
        case UIDeviceOrientationLandscapeLeft:
            NSLog(@"屏幕向左橫置");
            self.orientation = 2;
            [self layoutViews];
            break;

        case UIDeviceOrientationLandscapeRight:
            NSLog(@"屏幕向右橫置");
            self.orientation = 2;
            [self layoutViews];
            break;

        case UIDeviceOrientationPortrait:
            NSLog(@"屏幕直立");
            self.orientation = 1;
            [self layoutViews];
            break;

        case UIDeviceOrientationPortraitUpsideDown:
            NSLog(@"屏幕直立，上下顛倒");
            self.orientation = 1;
            [self layoutViews];
            break;

        default:
            NSLog(@"无法识别");
            break;
    }
    return YES;
}

- (void)show
{
//    [RXUICommonTool transformWithView:self.bgView];
    [UIView animateWithDuration:0.1 animations:^{
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.5];
        
//        [RXUICommonTool showWithAnimate:self.bgView];
        
        [self layoutSubviews];
    }];
}

- (void)hide
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    [self removeFromSuperview];
    
}

#pragma mark - 创建桥接
// js调用oc
- (void)registJSFunction
{
    // 打开webView
    [self.webView.configuration.userContentController addScriptMessageHandler:self name:@"openWebView"];
    
    // 获取初始化及登录数据
    [self.webView.configuration.userContentController addScriptMessageHandler:self name:@"getInitParams"];
    
    // 通用回调
    [self.webView.configuration.userContentController addScriptMessageHandler:self name:@"invokeNativeCallback"];
    
    // 点击客服
//    [self.webView.configuration.userContentController addScriptMessageHandler:self name:@"openCustomerService"];
}

#pragma mark -- <setUI>
- (void)setUI
{
    [self addSubview:self.bgView];
    [self.bgView addSubview:self.titleLbl];
    [self.bgView addSubview:self.closeBtn];
    [self.bgView addSubview:self.webView];
    [self.bgView addSubview:self.line];
        
    [self layoutViews];
    
    [self registJSFunction];
}

- (void)layoutViews
{
    UIView *window = [UIApplication sharedApplication].keyWindow;
    
    _bgView.frame = CGRectMake(0, 0, CGRectGetWidth(window.frame), CGRectGetHeight(window.frame));
    _bgView.center = window.center;
    
    _titleLbl.frame = CGRectMake(0, 44, CGRectGetWidth(_bgView.frame), 44);
    
    _line.frame = CGRectMake(0, CGRectGetMaxY(_titleLbl.frame), CGRectGetWidth(_bgView.frame), 1);
    
    _webView.frame = CGRectMake(0, CGRectGetMaxY(_line.frame), CGRectGetWidth(_bgView.frame), CGRectGetHeight(_bgView.frame) - CGRectGetHeight(_titleLbl.frame) - 1);
    
    _closeBtn.frame = CGRectMake(CGRectGetWidth(_bgView.frame) - 54, 44, 18, 18);
    
    [self layoutSubviews];
//    _desBg.contentSize = CGSizeMake(_desBg.width_sd, scrollH);
}

- (void)loadRequest
{
    NSString *filePath = [[NSBundle mainBundle] pathForResource:@"index 2" ofType:@"html"];
    NSString *htmlString = [NSString stringWithContentsOfFile:filePath encoding:NSUTF8StringEncoding error:nil];
    NSURL *url = [[NSURL alloc] initWithString:filePath];
    [self.webView loadHTMLString:htmlString baseURL:url];
//    [self.webView setJavascriptCloseWindowListener:^{
//        NSLog(@"window.close called");
//    }];
    return;
    if (self.url.length > 0) {
        NSString *encodeRequest = [self.url stringByAddingPercentEncodingWithAllowedCharacters:[NSCharacterSet characterSetWithCharactersInString:@"!@$^%*+,;'\"`<>()[]{}\\| "].invertedSet];

        NSURL *url = [NSURL URLWithString:encodeRequest];
        NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url
                                                               cachePolicy:NSURLRequestReloadIgnoringLocalCacheData
                                                           timeoutInterval:40.0];
        [self.webView loadRequest:request];
    } else {
        [self.webView loadHTMLString:self.content baseURL:nil];
    }
}

#pragma mark - <WKWebView delegate>
// 页面开始加载时调用
- (void)webView:(WKWebView *)webView didStartProvisionalNavigation:(WKNavigation *)navigation{
//    if (self.wk_mWebView.canGoBack == YES) {
//        self.backBtn.hidden = NO;
//    } else {
//        self.backBtn.hidden = YES;
//    }
#pragma mark -修改字体颜色
    [webView evaluateJavaScript:@"document.getElementsByTagName('body')[0].style.webkitTextFillColor= \"#455452\"" completionHandler:nil];
#pragma mark -修改背景颜色
    [webView evaluateJavaScript:@"document.body.style.backgroundColor=\"#F4FCFB\"" completionHandler:nil];
    
    NSString *script = @"document.getElementsByTagName('body')[0].style.webkitTextSizeAdjust= '100%'";
  
    [webView evaluateJavaScript:script completionHandler:nil];
}

// 当内容开始返回时调用
- (void)webView:(WKWebView *)webView didCommitNavigation:(WKNavigation *)navigation{

}

// 页面加载失败时调用
- (void)webView:(WKWebView *)webView didFailProvisionalNavigation:(WKNavigation *)navigation{
    NSLog(@"加载失败");
}

// 接收到服务器跳转请求之后调用
- (void)webView:(WKWebView *)webView didReceiveServerRedirectForProvisionalNavigation:(WKNavigation *)navigation{

}

// 在收到响应后，决定是否跳转
- (void)webView:(WKWebView *)webView decidePolicyForNavigationResponse:(WKNavigationResponse *)navigationResponse decisionHandler:(void (^)(WKNavigationResponsePolicy))decisionHandler{

    NSLog(@"webview跳转:\n %@",navigationResponse.response.URL.absoluteString);
    
    //允许跳转
    decisionHandler(WKNavigationResponsePolicyAllow);
    //不允许跳转
    //decisionHandler(WKNavigationResponsePolicyCancel);
}

// 在发送请求之前，决定是否跳转
- (void)webView:(WKWebView *)webView decidePolicyForNavigationAction:(WKNavigationAction *)navigationAction decisionHandler:(void (^)(WKNavigationActionPolicy))decisionHandler{
    
    NSURL *URL = navigationAction.request.URL;
    NSString *scheme = [URL scheme];
    NSString *absoluteString = [navigationAction.request.URL.absoluteString stringByRemovingPercentEncoding];
    NSLog(@"URLSTRING: %@", absoluteString);
    if (navigationAction.navigationType == WKNavigationTypeLinkActivated) {
        // 通过浏览器访问
        TestWebView *webView = [[TestWebView alloc] initWithUrl:scheme title:self.title content:nil];
        decisionHandler(WKNavigationActionPolicyCancel);
    } else {
        decisionHandler (WKNavigationActionPolicyAllow);
    }
    return ;
}

- (void)userContentController:(WKUserContentController *)userContentController didReceiveScriptMessage:(WKScriptMessage *)message {
    // message.name  添加监听的方法名
    NSLog(@"");
//    [RXWebViewManager sharedSDK].complete = self.complete;
//    [[RXWebViewManager sharedSDK] fetchJSInfoWithMethod:message.name info:message.body webView:self.webView];
//    
//    if ([message.name isEqualToString:@"getNativeInitParams"]) {
//        
//        NSString *cookie = [[self setCookie] urlEncodedString];
//        
//        [self.webView evaluateJavaScript:[NSString stringWithFormat:@"getNativeInitParams('%@')", self.loginData]
//                       completionHandler:^(id response, NSError * error) {
//            NSLog(@"response: %@, \nerror: %@", response, error);
//        }];
//    }
}

#pragma mark - WKUIDelegate
- (WKWebView *)webView:(WKWebView *)webView createWebViewWithConfiguration:(WKWebViewConfiguration *)configuration forNavigationAction:(WKNavigationAction *)navigationAction windowFeatures:(WKWindowFeatures *)windowFeatures{
    //该方法是说不需要新建,我只需要在我自己的上加载界面
    WKFrameInfo *frameInfo = navigationAction.targetFrame;
    if (![frameInfo isMainFrame]) {
        [webView loadRequest:navigationAction.request];
    }
    return nil;
}

// 输入框
- (void)webView:(WKWebView *)webView runJavaScriptTextInputPanelWithPrompt:(NSString *)prompt defaultText:(nullable NSString *)defaultText initiatedByFrame:(WKFrameInfo *)frame completionHandler:(void (^)(NSString * __nullable result))completionHandler{
    completionHandler(@"http");
}

// 确认框
- (void)webView:(WKWebView *)webView runJavaScriptConfirmPanelWithMessage:(NSString *)message initiatedByFrame:(WKFrameInfo *)frame completionHandler:(void (^)(BOOL result))completionHandler{
    completionHandler(YES);
}

// 警告框
- (void)webView:(WKWebView *)webView runJavaScriptAlertPanelWithMessage:(NSString *)message initiatedByFrame:(WKFrameInfo *)frame completionHandler:(void (^)(void))completionHandler{
    NSLog(@"%@",message);
    completionHandler();
}

- (void)webView:(WKWebView *)webView didFinishNavigation:(WKNavigation *)navigation{
#pragma mark -禁止用户选择
    [webView evaluateJavaScript:@"document.documentElement.style.webkitUserSelect='none';" completionHandler:nil];
    [webView evaluateJavaScript:@"document.activeElement.blur();" completionHandler:nil];
#pragma mark -增大字体大小
//    NSString *script = @"document.getElementsByTagName('body')[0].style.webkitTextSizeAdjust= '100%'";
//    if (RXAC) {
//        script = @"document.getElementsByTagName('body')[0].style.webkitTextSizeAdjust= '120%'";
//    } else {
//        script = @"document.getElementsByTagName('body')[0].style.webkitTextSizeAdjust= '220%'";
//    }
//    if ([ISPAD isEqualToString:@"iPad"]) {
//        script = @"document.getElementsByTagName('body')[0].style.webkitTextSizeAdjust= '120%'";
//    }
//    [webView evaluateJavaScript:script completionHandler:nil];


//#pragma mark -修改字体颜色
//    [webView evaluateJavaScript:@"document.getElementsByTagName('body')[0].style.webkitTextFillColor= \"#455452\"" completionHandler:nil];
//#pragma mark -修改背景颜色
//    [webView evaluateJavaScript:@"document.body.style.backgroundColor=\"#F4FCFB\"" completionHandler:nil];
}

#pragma mark -- <actions>


#pragma mark -- <lazy>
- (UIView *)bgView
{
    if (!_bgView) {
        _bgView = [[UIView alloc] init];
        _bgView.backgroundColor = [UIColor whiteColor];
        _bgView.layer.cornerRadius = 6;
    }
    return _bgView;
}

- (UILabel *)titleLbl
{
    if (!_titleLbl) {
        _titleLbl = [[UILabel alloc] init];
        if (self.title.length > 0) {
            _titleLbl.text = self.title;
        } else {
            _titleLbl.text = @"用户协议和隐私政策";
        }
        _titleLbl.textColor = [UIColor blackColor];
        _titleLbl.font = [UIFont systemFontOfSize:18 weight:UIFontWeightMedium];
        _titleLbl.textAlignment = NSTextAlignmentCenter;
    }
    return _titleLbl;
}

- (UIButton *)closeBtn
{
    if (!_closeBtn) {
        _closeBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_closeBtn setImage:[UIImage imageNamed:@"logoImage"] forState:UIControlStateNormal];
        [_closeBtn addTarget:self action:@selector(hide) forControlEvents:UIControlEventTouchUpInside];
    }
    return _closeBtn;
}

- (WKWebView *)webView
{
    if (!_webView) {
        WKWebViewConfiguration *wkWebConfig = [[WKWebViewConfiguration alloc] init];
//        NSString *jSString = [NSString stringWithFormat:@"var meta = document.createElement('meta'); meta.setAttribute('name', 'viewport'); meta.setAttribute('content', 'width=%f'); document.getElementsByTagName('head')[0].appendChild(meta);", 280.0f];
//        WKUserScript *wkUserScript = [[WKUserScript alloc] initWithSource:jSString injectionTime:WKUserScriptInjectionTimeAtDocumentEnd forMainFrameOnly:YES];
//        [wkWebConfig.userContentController addUserScript:wkUserScript];
        
        _webView = [[WKWebView alloc] initWithFrame:CGRectZero configuration:wkWebConfig];
//        _webView.backgroundColor = [UIColor colorWithHexString:@"F4FCFB"];
//        _webView.navigationDelegate = self;
//        _webView.scrollView.delegate = self;
        _webView.hidden = NO;
    }
    return _webView;
}

- (UIView *)line
{
    if (!_line) {
        _line = [[UIView alloc] init];
        _line.backgroundColor = [UIColor grayColor];
    }
    return _line;
}

@end
