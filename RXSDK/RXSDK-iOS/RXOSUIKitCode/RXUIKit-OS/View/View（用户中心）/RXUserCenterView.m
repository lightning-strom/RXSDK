//
//  RXOSUserCenterView.m
//  RXUIKit
//
//  Created by 陈汉 on 2023/4/26.
//

#import "RXOSUserCenterView.h"
#import "RXCloseBtn.h"
#import "RXWKWebView.h"
//#impo

#define WebViewTag 90000

typedef void(^Complete)(NSDictionary *response, RX_CommonRequestError *error);

@interface RXOSUserCenterView ()

@property (nonatomic, copy) Complete complete;
@property (nonatomic, strong) RXUserCenterConfig *config;
@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) UIView *bgViewAlpha;
@property (nonatomic, strong) UILabel *titleLbl;
@property (nonatomic, strong) UILabel *usernameLbl;
@property (nonatomic, strong) RXCloseBtn *closeBtn;
@property (nonatomic, strong) UIImageView *logoImageView;
@property (nonatomic, strong) UIButton *changeBtn;
@property (nonatomic, strong) UIImageView *iconImageView;
@property (nonatomic, strong) NSDictionary *loginData;
@property (nonatomic, strong) RXWKWebView *webView;

@end

@implementation RXOSUserCenterView

- (instancetype)initWithConfig:(RXUserCenterConfig *)config
                      complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    self = [super initWithFrame:CGRectMake(0, 0, [UIApplication sharedApplication].keyWindow.frame.size.width, [UIApplication sharedApplication].keyWindow.frame.size.height)];
    if (self) {
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
        [[UIApplication sharedApplication].keyWindow addSubview:self];
        
        self.config = config;
        self.complete = complete;
        self.loginData = [RXUIUserUtility sharedManager].loginData;
        
        [self setUI];
        
        [self show];
    }
    return self;
}

- (void)show
{
    [UIView animateWithDuration:0.1 animations:^{
        self.bgViewAlpha.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.5];
        [RXUICommonTool showWithAnimate:self];
//        [RXUICommonTool showWithAnimate:self.bgView];
//        [RXUICommonTool showWithAnimate:self.webView];
//        [RXUICommonTool showWithAnimate:self.webView.webView];
//        [RXUICommonTool showWithAnimate:self.titleLbl];
//        [RXUICommonTool showWithAnimate:self.closeBtn];
//        [RXUICommonTool showWithAnimate:self.logoImageView];
//        [RXUICommonTool showWithAnimate:self.changeBtn];
//        [RXUICommonTool showWithAnimate:self.iconImageView];
//        [RXUICommonTool showWithAnimate:self.usernameLbl];
        
        [self layoutSubviews];
    }];
}

- (void)hide
{
    [RXHUD hideWebHUD];
    [self.bgViewAlpha removeFromSuperview];
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    [self removeFromSuperview];
}

#pragma mark -- <setUI>
- (void)setUI
{
    [self addSubview:self.bgView];
    [self addSubview:self.titleLbl];
    [self addSubview:self.closeBtn];
    [self addSubview:self.logoImageView];
    [self addSubview:self.changeBtn];
    [self addSubview:self.iconImageView];
    [self addSubview:self.usernameLbl];
    
    [self layoutViews];
}

- (void)layoutViews
{
    UIView *window = [UIApplication sharedApplication].keyWindow;
    
    self.bgViewAlpha.frame = window.frame;
    [window addSubview:self.bgViewAlpha];
    [window bringSubviewToFront:self];
    
    _bgView.frame = CGRectMake(0, 0, RXAC ? 545 : 346, RXAC ? 307 : 309);
    _bgView.center = window.center;
    
//    _titleLbl.frame = CGRectMake(0, 10, CGRectGetWidth(_bgView.frame), 20);
    
    _logoImageView.frame = CGRectMake(CGRectGetMinX(_bgView.frame) + CGRectGetWidth(_bgView.frame) / 2 - 108 / 2, CGRectGetMinY(_bgView.frame) + 18, 108, 25);
    
    _iconImageView.frame = CGRectMake(CGRectGetMinX(_bgView.frame) + (RXAC ? 30 : 21), CGRectGetMinY(_bgView.frame) + (RXAC ? 62 : 68), RXAC ? 36 : 25, RXAC ? 36 : 25);
    
    _usernameLbl.frame = CGRectMake(CGRectGetMaxX(_iconImageView.frame) + 8, CGRectGetMinY(_iconImageView.frame), RXAC ? 360 : 175 , CGRectGetHeight(_iconImageView.frame));
    
//    _changeBtn.frame = CGRectMake(CGRectGetMinX(_bgView.frame) + (RXAC ? 485 : 242), CGRectGetMinY(_bgView.frame) + (RXAC ? 73 : 83), RXAC ? 142 : 115, RXAC ? 44 : 36);
    _changeBtn.frame = CGRectMake(CGRectGetMaxX(_bgView.frame) - (RXAC ? 30 + 119 : 21 + 78), CGRectGetMinY(_bgView.frame) + (RXAC ? 62 : 66), RXAC ? 119 : 78, RXAC ? 36 : 30);
    
    _closeBtn.frame = CGRectMake(CGRectGetMaxX(_bgView.frame) - (RXAC ? 45 - 1 : 37), CGRectGetMinY(_bgView.frame) + 20, 28, 28);
    
    if (!_webView) {
        __weak __typeof__(self) weakSelf = self;
        _webView = [[RXWKWebView alloc] initWithFrame:CGRectMake(CGRectGetMinX(_bgView.frame) + (RXAC ? 19 : 16), CGRectGetMinY(_bgView.frame) + (RXAC ? 116 : 112), CGRectGetWidth(_bgView.frame) - (RXAC ? 38 : 32), RXAC ? 171 : 181)];
        _webView.webView.frame = CGRectMake(5, 5, CGRectGetWidth(_webView.frame) - 10, CGRectGetHeight(_webView.frame) - 10);
        _webView.backgroundColor = [UIColor whiteColor];
        _webView.tag = WebViewTag;
        _webView.layer.cornerRadius = 5;
        _webView.webView.layer.cornerRadius = 5;
        _webView.complete = ^(NSDictionary * _Nonnull response) {
            if (weakSelf.complete) {
                weakSelf.complete(response, nil);
            }
        };
        _webView.webView.scrollView.scrollEnabled = NO;
        _webView.naviBar.hidden = YES;
        [self addSubview:self.webView];
    }
    
    NSString *username = self.loginData[@"username"];
    if (!username || username.length <= 0) {
        username = self.loginData[@"nickname"];
    }
    
    if ([self.loginData[@"method"] isEqualToString:@"guest"]) {
        username = @"游客账号";
    }
    
    _usernameLbl.text = username;
    
    // 设置渐变
    CAGradientLayer *gradientLayer = [CAGradientLayer layer];
    gradientLayer.colors = @[(__bridge id)[UIColor colorWithHexString:@"#EDFFEA"].CGColor,
                             (__bridge id)[UIColor colorWithHexString:@"#EBFFF5"].CGColor,
                             (__bridge id)[UIColor colorWithHexString:@"#F6FAF9"].CGColor];
    gradientLayer.locations = @[@0,
                                @0.5,
                                @1.0];// 区间
    gradientLayer.startPoint = CGPointMake(0,
                                           0);// 开始点
    gradientLayer.endPoint = CGPointMake(0,
                                         1);// 结束点
    gradientLayer.frame = CGRectMake(0,
                                     0,
                                     CGRectGetWidth(_bgView.frame),
                                     CGRectGetHeight(_bgView.frame));
    [_bgView.layer addSublayer:gradientLayer];
    
    CAShapeLayer *shapeLayer = [CAShapeLayer layer];
    shapeLayer.path = [UIBezierPath bezierPathWithRoundedRect:CGRectMake(0, 0, CGRectGetWidth(_bgView.frame), CGRectGetHeight(_bgView.frame)) byRoundingCorners:UIRectCornerAllCorners cornerRadii:CGSizeMake(4, 4)].CGPath;
    _bgView.layer.mask = shapeLayer;
    
    
    [self loadWebView];
}

- (void)loadWebView
{
    NSString *domain = [[RXService sharedSDK] getFirstBaseUrl];
    if (![[domain substringWithRange:NSMakeRange(domain.length - 1, 1)] isEqualToString:@"/"]) {
        domain = [NSString stringWithFormat:@"%@/", domain];
    }
    self.webView.urlStr = [NSString stringWithFormat:@"%@static/passport/#/userCenter", domain];
//    self.webView.urlStr = @"http://10.10.2.64:8083/#/userCenter";
}

#pragma mark -- <actions>
- (void)closeBtnAction
{
    [self hide];
}

- (void)changeBtnAction
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:@"switch_user" forKey:@"type"];
    if (self.complete) {
        self.complete(dic, nil);
    }
    [self hide];
}

#pragma mark -- <lazy>
- (UIView *)bgView
{
    if (!_bgView) {
        _bgView = [[UIView alloc] init];
        _bgView.backgroundColor = [UIColor whiteColor];
        _bgView.layer.cornerRadius = 5;
    }
    return _bgView;
}

- (UIView *)bgViewAlpha
{
    if (!_bgViewAlpha) {
        _bgViewAlpha = [[UIView alloc] init];
        _bgViewAlpha.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
        _bgViewAlpha.layer.cornerRadius = 5;
    }
    return _bgViewAlpha;
}

- (UILabel *)titleLbl
{
    if (!_titleLbl) {
        _titleLbl = [[UILabel alloc] init];
        _titleLbl.text = @"用户中心";
        _titleLbl.font = [UIFont boldSystemFontOfSize:24];
        _titleLbl.textAlignment = NSTextAlignmentCenter;
    }
    return _titleLbl;
}

- (RXCloseBtn *)closeBtn
{
    if (!_closeBtn) {
        _closeBtn = [RXCloseBtn buttonWithType:UIButtonTypeCustom];
        _closeBtn.adjustsImageWhenHighlighted = NO;
        [_closeBtn setImage:[UIImage rxBundleImageNamed:@"rx_close"] forState:UIControlStateNormal];
        [_closeBtn addTarget:self action:@selector(closeBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _closeBtn;
}

- (UIButton *)changeBtn
{
    if (!_changeBtn) {
        _changeBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_changeBtn setTitle:@"切换账号" forState:UIControlStateNormal];
        [_changeBtn setTitleColor:[UIColor colorWithHexString:@"#20C0B3"] forState:UIControlStateNormal];
        _changeBtn.titleLabel.font = [UIFont systemFontOfSize:RXAC ? 18 : 14 weight:UIFontWeightMedium];
        [_changeBtn setBackgroundColor:[UIColor clearColor]];
        _changeBtn.layer.borderWidth = 1;
        _changeBtn.layer.borderColor = [UIColor colorWithHexString:@"#20C0B3"].CGColor;
        _changeBtn.layer.cornerRadius = 5;
        [_changeBtn addTarget:self action:@selector(changeBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _changeBtn;
}

- (UIImageView *)iconImageView
{
    if (!_iconImageView) {
        _iconImageView = [[UIImageView alloc] init];
        _iconImageView.image = [UIImage rxBundleImageNamed:@"rx_headIcon"];
    }
    return _iconImageView;
}

- (UIImageView *)logoImageView
{
    if (!_logoImageView) {
        _logoImageView = [[UIImageView alloc] init];
        RXLoginUIConfig *config = [RXUIUserUtility sharedManager].loginConfig;
        
        if ([config.logoImage isKindOfClass:[UIImage class]]) {
            _logoImageView.image = config.logoImage;
        } else {
            _logoImageView.image = [RXUICommonTool getImageFromURL:(NSString *)config.logoImage];
        }
    }
    return _logoImageView;
}

- (UILabel *)usernameLbl
{
    if (!_usernameLbl) {
        _usernameLbl = [[UILabel alloc] init];
        _usernameLbl.textColor = [UIColor blackColor];
        _usernameLbl.font = [UIFont systemFontOfSize:RXAC ? 18 : 16 weight:UIFontWeightMedium];
    }
    return _usernameLbl;
}

@end
