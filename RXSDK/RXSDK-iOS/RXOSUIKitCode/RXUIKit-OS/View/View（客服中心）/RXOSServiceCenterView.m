//
//  RXOSServiceCenterView.m
//  RXUIKit
//
//  Created by 陈汉 on 2023/6/27.
//

#import "RXOSServiceCenterView.h"
#import "RXOSServiceBackBtn.h"
#import "RXOSWKWebView.h"
#import "RXOSDragView.h"
#import "RXOSWKController.h"

#define WebViewTag 90000

typedef void(^Complete)(NSDictionary *response, RX_CommonRequestError *error);

@interface RXOSServiceCenterView ()

@property (nonatomic, copy) Complete complete;
@property (nonatomic, strong) RXOSUserCenterConfig *config;
@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) RXOSServiceBackBtn *closeBtn;
@property (nonatomic, strong) NSDictionary *loginData;
//@property (nonatomic, strong) RXOSWKWebView *webView;
@property (nonatomic, strong) RXOSDragView *dragView;
@property (nonatomic, assign) ServiceType type;
@property (nonatomic, strong) RXOSWKController *webView;

@end

@implementation RXOSServiceCenterView

- (instancetype)initWithConfig:(RXOSUserCenterConfig *)config
                          type:(ServiceType)type
                      complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    self = [super initWithFrame:CGRectMake(0, 0, [UIApplication sharedApplication].keyWindow.frame.size.width, [UIApplication sharedApplication].keyWindow.frame.size.height)];
    if (self) {
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
        [[UIApplication sharedApplication].keyWindow addSubview:self];
        
        self.config = config;
        self.complete = complete;
        self.type = type;
        self.loginData = [RXOSUserUtility sharedManager].loginData;
        if (!self.loginData || self.loginData.allKeys.count <= 0) {
            self.loginData = [RXOSUserUtility sharedManager].apiLoginData;
        }
        if (!self.loginData || self.loginData.allKeys.count <= 0) {
            NSDictionary *loginData = [[NSUserDefaults standardUserDefaults] valueForKey:keyUser_loginData];
            self.loginData = loginData[@"loginData"][@"data"];
        }
        
        [self setUI];
        
        [self show];
        
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(hide) name:RXUINoti_closeWebView1 object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(minimized) name:RXUINoti_minimized object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(setCloseVisible:) name:RXUINoti_userCenterClose object:nil];
    }
    return self;
}

- (void)show
{
    [RXOSUserUtility sharedManager].isShowServiceCenter = YES;
}

- (void)hide
{
    [RXOSUserUtility sharedManager].isShowServiceCenter = NO;
    [RXOSHUD hideWebHUD];
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    [self removeFromSuperview];
}

#pragma mark -- <notiActions>
- (void)setCloseVisible:(NSNotification *)noti
{
    NSDictionary *dic = noti.userInfo;
    BOOL isHide = [dic[@"isShowClose"] boolValue];
    self.closeBtn.hidden = !isHide;
}

- (void)minimized
{
    self.hidden = YES;
    
    if (!self.dragView) {
        self.dragView = [[RXOSDragView alloc] initWithFrame:CGRectMake(CGRectGetMaxX(_bgView.frame) - 100, CGRectGetHeight(_bgView.frame) - 100, 75, 75) vc:[UIViewController currentViewController]];
        __weak __typeof__(self) weakSelf = self;
        [self.dragView setActionBlock:^{
//            weakSelf.hidden = NO;
//            weakSelf.dragView.hidden = YES;
//            weakSelf.dragView.redTip.hidden = YES;
            [weakSelf showView];
        }];
        [[UIApplication sharedApplication].keyWindow addSubview:self.dragView];
    } else {
        self.dragView.hidden = NO;
    }
}

// 最大化
- (void)showView
{
    self.hidden = NO;
    self.dragView.hidden = YES;
    self.dragView.redTip.hidden = YES;
}

#pragma mark -- <setUI>
- (void)setUI
{
    [self addSubview:self.bgView];
    
    [self layoutViews];
}

- (void)layoutViews
{
    UIView *window = [UIApplication sharedApplication].keyWindow;
    _bgView.frame = window.frame;
    
    if (!_webView) {
        _webView = [[RXOSWKController alloc] init];
        __weak __typeof__(self) weakSelf = self;
//        _webView.webView = [[RXOSWKWebView alloc] initWithFrame:window.frame];
        _webView.webView.visibleHUD = YES;
        _webView.webView.backgroundColor = [UIColor clearColor];
        _webView.webView.webView.backgroundColor = [UIColor clearColor];
        _webView.webView.tag = WebViewTag;
        _webView.webView.complete = ^(NSDictionary * _Nonnull response) {
            if (weakSelf.complete) {
                weakSelf.complete(response, nil);
            }
        };
        _webView.webView.close = ^{
            [weakSelf hide];
        };
//        [self addSubview:self.webView];
        _webView.modalPresentationStyle = UIModalPresentationFullScreen;
        [[UIViewController currentViewController] presentViewController:_webView animated:NO completion:nil];
        [self addSubview:self.closeBtn];

//        _closeBtn.frame = CGRectMake(CGRectGetMaxX(_bgView.frame) - 100, CGRectGetHeight(_bgView.frame) - 100, 75, 75);
    }
    
    if (self.type == ServiceType_center) {
        _webView.webView.naviBar.hidden = YES;
        [_webView.webView showNavi:NO];
    } else {
//        _closeBtn.hidden = YES;
        _webView.closeBtn.hidden = YES;
        _webView.webView.naviBar.hidden = NO;
        [_webView.webView showNavi:YES];
        _webView.webView.titleLbl.text = @"客服";
        _webView.webView.titleLbl.textColor = [UIColor whiteColor];
        _webView.webView.closeBtn.hidden = YES;
        _webView.webView.line.hidden = YES;
        _webView.webView.naviBar.backgroundColor = [UIColor colorWithHexString:@"#2E354B"];
    }
    
    [self loadWebView];
}

- (void)loadWebView
{
    NSString *domain = [[RXService sharedSDK] getFirstBaseUrl];
    if (![[domain substringWithRange:NSMakeRange(domain.length - 1, 1)] isEqualToString:@"/"]) {
        domain = [NSString stringWithFormat:@"%@/", domain];
    }
//    self.webView.urlStr = [NSString stringWithFormat:@"%@static/passport/#/userCenter", domain];
    if (self.type == ServiceType_chat) {
//        self.webView.webView.urlStr = @"http://10.10.2.80:4043/static/service/#/welcome";    // 客服
        self.webView.webView.urlStr = [NSString stringWithFormat:@"%@static/service/#/welcome", domain];
    } else {
//        self.webView.urlStr = @"http://10.10.2.193:8083/#/helpcenter/questioncatalogue";  // 客服中心首页
        self.webView.webView.urlStr = [NSString stringWithFormat:@"%@static/passport/#/helpcenter/questioncatalogue", domain];
    }
}

#pragma mark -- <actions>
- (void)closeBtnAction
{
    [self hide];

}

#pragma mark -- <lazy>
- (UIView *)bgView
{
    if (!_bgView) {
        _bgView = [[UIView alloc] init];
//        _bgView.backgroundColor = [UIColor colorWithHexString:@"#2E354B"];
        _bgView.layer.cornerRadius = 5;
    }
    return _bgView;
}

@end
