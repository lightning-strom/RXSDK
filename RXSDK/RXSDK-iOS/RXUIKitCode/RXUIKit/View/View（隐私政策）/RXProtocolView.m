//
//  RXProtocolView.m
//  RXSDK
//
//  Created by 陈汉 on 2021/10/11.
//

#import "RXProtocolView.h"
#import "RXUICommonTool.h"
#import "RXUICommonHeader.h"
#import <WebKit/WebKit.h>
#import "RXWebViewController.h"
#import "RXLegalModel.h"

@interface RXProtocolView () <WKNavigationDelegate, WKUIDelegate>

@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) UILabel *titleLbl;
@property (nonatomic, strong) UILabel *desLbl;
@property (nonatomic, strong) UIButton *confirmBtn;
@property (nonatomic, strong) UIButton *cancelBtn;
@property (nonatomic, strong) UIButton *closeBtn;
@property (nonatomic, assign) NSInteger orientation;  // 屏幕方向 1竖屏 2横屏
@property (nonatomic, strong) NSString *titleStr; // 标题
@property (nonatomic, strong) NSString *type; // 0正常登录 1移动 2电信 3联通
@property (nonatomic, copy) ProtocolBlock block;

@end

@implementation RXProtocolView

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (instancetype)initWithType:(NSString *)type
                       block:(ProtocolBlock)block
{
    self = [super initWithFrame:[UIApplication sharedApplication].keyWindow.frame];
    if (self) {
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
        [[UIApplication sharedApplication].keyWindow addSubview:self];
        
        self.orientation = [RXUICommonTool getInterfaceOrientation];
        
//        NSMutableDictionary *dic = [[NSUserDefaults standardUserDefaults] valueForKey:@"rx_legal"];
//
//        RXLegalData *model = [RXLegalData yy_modelWithDictionary:dic];
//
//        for (int i = 0; i < model.terms.count; i++) {
//            RXLegalData_term *term = model.terms[i];
//            if ([term.key isEqualToString:key]) {
//                self.desStr = term.content;
//                self.titleStr = term.title;
//                break;
//            }
//        }
        
        self.type = type;
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
//    [UIView animateWithDuration:0.1 animations:^{
//        UIView *window = [UIApplication sharedApplication].keyWindow;
//        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.5];
//
//        self.bgView.sd_layout.bottomSpaceToView(self, window.frame.size.height / 2 - 260 / 2);
//        [self layoutSubviews];
//    }];
}

- (void)hide
{
//    [UIView animateWithDuration:0.1 animations:^{
//        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
//        self.bgView.sd_layout.bottomSpaceToView(self, -260);
//        [self layoutSubviews];
//    }];
//
//    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.15 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    [self removeFromSuperview];
    
//    });
}

#pragma mark -- <setUI>
- (void)setUI
{
    [self addSubview:self.bgView];
    [self.bgView addSubview:self.titleLbl];
    [self.bgView addSubview:self.confirmBtn];
    [self.bgView addSubview:self.cancelBtn];
    [self.bgView addSubview:self.closeBtn];
    
//    if ([self.desStr containsString:@"<p>"]) {
//        WKWebView *webView = [[WKWebView alloc] init];
//        webView.backgroundColor = [UIColor clearColor];
//        webView.navigationDelegate = self;
//        [webView loadHTMLString:self.desStr baseURL:nil];
//        [self.bgView addSubview:webView];
//
//        webView.sd_layout.topSpaceToView(self.titleLbl, 30)
//        .leftSpaceToView(self.bgView, 20)
//        .rightSpaceToView(self.bgView, 20)
//        .heightIs(132);
//
//        self.desBg.hidden = YES;
//    }
    
    [self layoutViews];
}

- (void)layoutViews
{   
    UIView *window = [UIApplication sharedApplication].keyWindow;
    
    _bgView.frame = CGRectMake(0, 0, 344, 202);
    _bgView.center = window.center;
    
    _titleLbl.frame = CGRectMake(0, 16, CGRectGetWidth(_bgView.frame), 20);
    
    _desLbl.frame = CGRectMake(30, CGRectGetMaxY(_titleLbl.frame) + 28, CGRectGetWidth(_bgView.frame) - 60, 40);
    
    _cancelBtn.frame = CGRectMake(30, CGRectGetHeight(_bgView.frame) - 70, 137, 40);
    
    _confirmBtn.frame = CGRectMake(CGRectGetWidth(_bgView.frame) - 167, CGRectGetMinY(_cancelBtn.frame), 137, 40);
    
    _closeBtn.frame = CGRectMake(CGRectGetWidth(_bgView.frame) - 46, 23, 16, 16);
    
    [self layoutSubviews];
//    _desBg.contentSize = CGSizeMake(_desBg.width_sd, scrollH);
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
        _bgView.backgroundColor = [UIColor whiteColor];
        _bgView.layer.cornerRadius = 6;
    }
    return _bgView;
}

- (UILabel *)titleLbl
{
    if (!_titleLbl) {
        _titleLbl = [[UILabel alloc] init];
        _titleLbl.text = @"用户协议和隐私政策";
        _titleLbl.textColor = [UIColor blackColor];
        _titleLbl.font = [UIFont boldSystemFontOfSize:18];
        _titleLbl.textAlignment = NSTextAlignmentCenter;
    }
    return _titleLbl;
}

- (UILabel *)desLbl
{
    if (!_desLbl) {
        _desLbl = [[UILabel alloc] init];
        _desLbl.numberOfLines = 0;
        
        NSString *desStr = @"请确认已阅读并同意 用户协议、隐私政策";
        if ([self.type integerValue] == 1) {
            desStr = [NSString stringWithFormat:@"%@《中国移动服务协议》", desStr];
        } else if ([self.type integerValue] == 2) {
            desStr = [NSString stringWithFormat:@"%@《中国电信服务协议》", desStr];
        } else if ([self.type integerValue] == 3) {
            desStr = [NSString stringWithFormat:@"%@《中国联通服务协议》", desStr];
        }
        _desLbl.text = desStr;
        _desLbl.font = [UIFont systemFontOfSize:13];
    }
    return _desLbl;
}

- (UIButton *)confirmBtn
{
    if (!_confirmBtn) {
        _confirmBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        _confirmBtn.adjustsImageWhenHighlighted = NO;
        [_confirmBtn setBackgroundColor:[UIColor colorWithHexString:@"20C0B3"]];
        [_confirmBtn setTitle:@"同意" forState:UIControlStateNormal];
        [_confirmBtn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
        _confirmBtn.titleLabel.font = [UIFont systemFontOfSize:16];
        [_confirmBtn addTarget:self action:@selector(confirmBtnAction) forControlEvents:UIControlEventTouchUpInside];
        _confirmBtn.layer.cornerRadius = 20;
    }
    return _confirmBtn;
}

- (UIButton *)cancelBtn
{
    if (!_cancelBtn) {
        _cancelBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        _cancelBtn.adjustsImageWhenHighlighted = NO;
        [_cancelBtn setTitle:@"不同意" forState:UIControlStateNormal];
        [_cancelBtn setTitleColor:[UIColor colorWithHexString:@"20C0B3"] forState:UIControlStateNormal];
        _cancelBtn.titleLabel.font = [UIFont systemFontOfSize:16];
        [_cancelBtn addTarget:self action:@selector(cancelBtnAction) forControlEvents:UIControlEventTouchUpInside];
        _cancelBtn.layer.cornerRadius = 20;
        _cancelBtn.layer.borderColor = [UIColor colorWithHexString:@"20C0B3"].CGColor;
        _cancelBtn.layer.borderWidth = 1;
    }
    return _cancelBtn;
}

- (UIButton *)closeBtn
{
    if (!_closeBtn) {
        _closeBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_closeBtn setImage:[UIImage rxBundleImageNamed:@"rx_close"] forState:UIControlStateNormal];
        [_closeBtn addTarget:self action:@selector(hide) forControlEvents:UIControlEventTouchUpInside];
    }
    return _closeBtn;
}

@end
