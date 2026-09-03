//
//  RXServiceCenterView.m
//  RXUIKit
//
//  Created by 陈汉 on 2023/6/27.
//

#import "RXServiceCenterView.h"
#import "RXServiceBackBtn.h"
#import "RXWKWebView.h"
#import "RXDragView.h"

#define WebViewTag 90000

typedef void(^Complete)(NSDictionary *response, RX_CommonRequestError *error);

@interface RXServiceCenterView ()

@property (nonatomic, copy) Complete complete;
@property (nonatomic, strong) RXUserCenterConfig *config;
@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) RXServiceBackBtn *closeBtn;
@property (nonatomic, strong) NSDictionary *loginData;
@property (nonatomic, strong) RXWKWebView *webView;
@property (nonatomic, strong) RXDragView *dragView;
@property (nonatomic, assign) ServiceType type;

@end

@implementation RXServiceCenterView

- (instancetype)initWithConfig:(RXUserCenterConfig *)config
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
        self.loginData = [RXUIUserUtility sharedManager].loginData;
        if (!self.loginData || self.loginData.allKeys.count <= 0) {
            self.loginData = [RXUIUserUtility sharedManager].apiLoginData;
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
    [RXUIUserUtility sharedManager].isShowServiceCenter = YES;
}

- (void)hide
{
    [RXUIUserUtility sharedManager].isShowServiceCenter = NO;
    [RXHUD hideWebHUD];
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
        self.dragView = [[RXDragView alloc] initWithFrame:CGRectMake(CGRectGetMaxX(_bgView.frame) - 80, CGRectGetHeight(_bgView.frame) - 80, 52, 52) vc:[UIViewController currentViewController]];
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
        __weak __typeof__(self) weakSelf = self;
        _webView = [[RXWKWebView alloc] initWithFrame:window.frame];
        _webView.visibleHUD = YES;
        _webView.backgroundColor = [UIColor clearColor];
        _webView.webView.backgroundColor = [UIColor clearColor];
        _webView.tag = WebViewTag;
        _webView.complete = ^(NSDictionary * _Nonnull response) {
            if (weakSelf.complete) {
                weakSelf.complete(response, nil);
            }
        };
        _webView.close = ^{
            [weakSelf hide];
        };
        _webView.webView.scrollView.scrollEnabled = NO;
        [self addSubview:self.webView];
        [self addSubview:self.closeBtn];

        _closeBtn.frame = CGRectMake(CGRectGetMaxX(_bgView.frame) - 100, CGRectGetHeight(_bgView.frame) - 100, 75, 75);
    }
    
    if (self.type == ServiceType_center) {
        _webView.naviBar.hidden = YES;
        [_webView showNavi:NO];
    } else {
        _closeBtn.hidden = YES;
        _webView.naviBar.hidden = NO;
        [_webView showNavi:YES];
        _webView.titleLbl.text = @"客服";
        _webView.titleLbl.textColor = [UIColor whiteColor];
        _webView.closeBtn.hidden = YES;
        _webView.line.hidden = YES;
        _webView.naviBar.backgroundColor = [UIColor colorWithHexString:@"#2E354B"];
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
        self.webView.urlStr = @"http://10.10.2.80:4043/static/service/#/welcome";    // 客服
//        self.webView.urlStr = [NSString stringWithFormat:@"%@static/service/#/welcome", domain];
    } else {
//        self.webView.urlStr = @"http://10.10.3.218:8083/#/helpcenter/questioncatalogue";  // 客服中心首页
        self.webView.urlStr = [NSString stringWithFormat:@"%@static/passport/#/helpcenter/questioncatalogue", domain];
    }
}

#pragma mark -- <actions>
- (void)closeBtnAction
{
    [self hide];
    
//    [self minimized];
//    _dragView.hidden = YES;
//    [_dragView setActionBlock:^{
//    }];
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

- (RXServiceBackBtn *)closeBtn
{
    if (!_closeBtn) {
        _closeBtn = [RXServiceBackBtn buttonWithType:UIButtonTypeCustom];
        _closeBtn.adjustsImageWhenHighlighted = NO;
        [_closeBtn setImage:[UIImage rxBundleImageNamed:@"rx_service_back"] forState:UIControlStateNormal];
        _closeBtn.layer.cornerRadius = 10;
        _closeBtn.backgroundColor = [UIColor whiteColor];
        [_closeBtn setTitle:@"返回游戏" forState:UIControlStateNormal];
        [_closeBtn setTitleColor:[UIColor colorWithHexString:@"161616"] forState:UIControlStateNormal];
        _closeBtn.titleLabel.font = [UIFont systemFontOfSize:14 weight:UIFontWeightMedium];
        [_closeBtn addTarget:self action:@selector(closeBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _closeBtn;
}

@end
