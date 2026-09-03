//
//  RXProtocolView.m
//  RXSDK
//
//  Created by 陈汉 on 2021/10/11.
//

#import "RXProtocolView.h"
#import "RXCommonTool.h"
#import "RXCommonHeader.h"
#import <WebKit/WebKit.h>
#import "RXWebViewController.h"
#import "NSObject+YYModel.h"

@interface RXProtocolView () <WKNavigationDelegate, WKUIDelegate>

@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) UILabel *titleLbl;
@property (nonatomic, strong) UIScrollView *desBg;
@property (nonatomic, strong) UILabel *desLbl;
@property (nonatomic, strong) UIButton *confirmBtn;
@property (nonatomic, strong) UIButton *cancelBtn;
@property (nonatomic, strong) UIButton *closeBtn;
@property (nonatomic, assign) NSInteger orientation;  // 屏幕方向 1竖屏 2横屏
@property (nonatomic, strong) NSString *desStr; // 描述文字
@property (nonatomic, strong) NSString *titleStr; // 标题
@property (nonatomic, copy) ProtocolBlock block;

@end

@implementation RXProtocolView

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (instancetype)initWithKey:(NSString *)key
                      block:(ProtocolBlock)block
{
    self = [super initWithFrame:[UIApplication sharedApplication].keyWindow.frame];
    if (self) {
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
        [[UIApplication sharedApplication].keyWindow addSubview:self];
        
        self.orientation = [RXCommonTool getInterfaceOrientation];
        
        RXLegalData *model = [RXLegalData yy_modelWithDictionary:[RXUserUtility sharedManager].legalModel];
        
        for (int i = 0; i < model.terms.count; i++) {
            RXLegalData_term *term = model.terms[i];
            if ([term.key isEqualToString:key]) {
                self.desStr = term.content;
                self.titleStr = term.name;
                break;
            }
        }
        
        self.block = block;
        
        [self setUI];
        [self show];
        
        // 监听屏幕旋转（横竖屏）
//        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onDeviceOrientationDidChange)
//                             name:UIDeviceOrientationDidChangeNotification
//                                                       object:nil];
    }
    return self;
}

- (BOOL)onDeviceOrientationDidChange{
    //获取当前设备Device
    UIDevice *device = [UIDevice currentDevice] ;
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
    [UIView animateWithDuration:0.15 animations:^{
        UIView *window = [UIApplication sharedApplication].keyWindow;
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.6];

        self.bgView.sd_layout.bottomSpaceToView(self, window.frame.size.height / 2 - 260 / 2);
        [self layoutSubviews];
    }];
}

- (void)hide
{
    [UIView animateWithDuration:0.15 animations:^{
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
        self.bgView.sd_layout.bottomSpaceToView(self, -260);
        [self layoutSubviews];
    }];
    
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.15 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        [self removeFromSuperview];
    });
}

#pragma mark -- <setUI>
- (void)setUI
{
    [self sd_addSubviews:@[self.bgView]];
    [self.bgView sd_addSubviews:@[self.titleLbl, self.desBg, self.confirmBtn, self.cancelBtn, self.closeBtn]];
    [self.desBg addSubview:self.desLbl];
    
    if ([self.desStr containsString:@"<p>"]) {
        WKWebView *webView = [[WKWebView alloc] init];
        webView.backgroundColor = [UIColor clearColor];
        webView.navigationDelegate = self;
        [webView loadHTMLString:self.desStr baseURL:nil];
        [self.bgView addSubview:webView];
        
        webView.sd_layout.topSpaceToView(self.titleLbl, 30)
        .leftSpaceToView(self.bgView, 20)
        .rightSpaceToView(self.bgView, 20)
        .heightIs(132);
        
        self.desBg.hidden = YES;
    }
    
    [self layoutViews];
}

- (void)layoutViews
{   
    UIView *window = [UIApplication sharedApplication].keyWindow;
    
    _bgView.sd_layout.centerXEqualToView(window)
    .bottomSpaceToView(self, -260)
    .widthIs(335)
    .heightIs(260);
    
    _titleLbl.sd_layout.topSpaceToView(self.bgView, 22)
    .leftSpaceToView(self.bgView, 0)
    .rightSpaceToView(self.bgView, 0)
    .heightIs(24);
    
    CGFloat scrollH = [self.desStr heightForFont:self.desLbl.font width:295] + 5;
    
    _desBg.sd_layout.topSpaceToView(self.titleLbl, 15)
    .leftSpaceToView(self.bgView, 20)
    .rightSpaceToView(self.bgView, 20)
    .heightIs(108);
    
    _desLbl.sd_layout.topSpaceToView(self.desBg, 0)
    .leftSpaceToView(self.desBg, 0)
    .rightSpaceToView(self.desBg, 0)
    .heightIs(scrollH);
    
    _cancelBtn.sd_layout.bottomSpaceToView(self.bgView, 20)
    .leftSpaceToView(self.bgView, 20)
    .widthIs(142)
    .heightIs(40);
    
    _confirmBtn.sd_layout.topEqualToView(self.cancelBtn)
    .leftSpaceToView(self.cancelBtn, 8)
    .widthIs(142)
    .heightIs(40);
    
    _closeBtn.sd_layout.topSpaceToView(self.bgView, 12)
    .rightSpaceToView(self.bgView, 6)
    .widthIs(30)
    .heightEqualToWidth();
    
    [self layoutSubviews];
    _desBg.contentSize = CGSizeMake(_desBg.width_sd, scrollH);
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
#pragma mark -增大字体大小
    [webView evaluateJavaScript:@"document.getElementsByTagName('body')[0].style.webkitTextSizeAdjust= '280%'" completionHandler:nil];
#pragma mark -修改背景颜色
    [webView evaluateJavaScript:@"document.body.style.backgroundColor=\"#fafafa\"" completionHandler:nil];
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

#pragma mark -- <actions>
- (void)confirmBtnAction
{
    if (self.block) {
        self.block(YES);
    }
    [self hide];
}

- (void)cancelBtnAction
{
    if (self.block) {
        self.block(NO);
    }
    [self hide];
}


#pragma mark -- <lazy>
- (UIView *)bgView
{
    if (!_bgView) {
        _bgView = [[UIView alloc] init];
        _bgView.backgroundColor = [UIColor colorWithHexString:@"fafafa"];
        _bgView.layer.cornerRadius = 6;
    }
    return _bgView;
}

- (UILabel *)titleLbl
{
    if (!_titleLbl) {
        _titleLbl = [[UILabel alloc] init];
        _titleLbl.text = self.titleStr;
        _titleLbl.font = [UIFont boldSystemFontOfSize:20];
        _titleLbl.textAlignment = NSTextAlignmentCenter;
    }
    return _titleLbl;
}

- (UIScrollView *)desBg
{
    if (!_desBg) {
        _desBg = [[UIScrollView alloc] init];
        _desBg.showsVerticalScrollIndicator = NO;
//        _desBg.backgroundColor = [UIColor whiteColor];
    }
    return _desBg;
}

- (UILabel *)desLbl
{
    if (!_desLbl) {
        _desLbl = [[UILabel alloc] init];
        _desLbl.textColor = [UIColor colorWithHexString:@"737373"];
        _desLbl.numberOfLines = 0;
        _desLbl.text = self.desStr;
        _desLbl.font = [UIFont systemFontOfSize:12];
    }
    return _desLbl;
}

- (UIButton *)confirmBtn
{
    if (!_confirmBtn) {
        _confirmBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        _confirmBtn.adjustsImageWhenHighlighted = NO;
        [_confirmBtn setBackgroundImage:[UIImage bundleImageNamed:@"confirmBtnBg"] forState:UIControlStateNormal];
        [_confirmBtn setTitle:@"同意" forState:UIControlStateNormal];
        [_confirmBtn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
        _confirmBtn.titleLabel.font = [UIFont systemFontOfSize:15];
        [_confirmBtn addTarget:self action:@selector(confirmBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _confirmBtn;
}

- (UIButton *)cancelBtn
{
    if (!_cancelBtn) {
        _cancelBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        _cancelBtn.adjustsImageWhenHighlighted = NO;
        [_cancelBtn setBackgroundImage:[UIImage bundleImageNamed:@"btnBg1"] forState:UIControlStateNormal];
        [_cancelBtn setTitle:@"不同意" forState:UIControlStateNormal];
        [_cancelBtn setTitleColor:[UIColor colorWithHexString:@"31B14E"] forState:UIControlStateNormal];
        _cancelBtn.titleLabel.font = [UIFont systemFontOfSize:15];
        [_cancelBtn addTarget:self action:@selector(cancelBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _cancelBtn;
}

- (UIButton *)closeBtn
{
    if (!_closeBtn) {
        _closeBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_closeBtn setImage:[UIImage bundleImageNamed:@"close"] forState:UIControlStateNormal];
        [_closeBtn addTarget:self action:@selector(hide) forControlEvents:UIControlEventTouchUpInside];
    }
    return _closeBtn;
}

@end
