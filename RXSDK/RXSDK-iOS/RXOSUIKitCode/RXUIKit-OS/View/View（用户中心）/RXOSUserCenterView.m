//
//  RXOSUserCenterView.m
//  RXUIKit
//
//  Created by 陈汉 on 2023/4/26.
//

#import "RXOSUserCenterView.h"
#import "RXOSCloseBtn.h"

#define WebViewTag 90000

typedef void(^Complete)(NSDictionary *response, RX_CommonRequestError *error);

@interface RXOSUserCenterView ()

@property (nonatomic, copy) Complete complete;
@property (nonatomic, strong) RXOSUserCenterConfig *config;
@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) UIView *bgViewAlpha;
@property (nonatomic, strong) UILabel *titleLbl;
@property (nonatomic, strong) RXOSCloseBtn *closeBtn;
@property (nonatomic, strong) UIImageView *logoImageView;
@property (nonatomic, strong) UIButton *changeBtn;
@property (nonatomic, strong) UIButton *refreshBtn;
@property (nonatomic, strong) UIImageView *iconImageView;
@property (nonatomic, strong) NSDictionary *loginData;

@end

@implementation RXOSUserCenterView

- (instancetype)initWithConfig:(RXOSUserCenterConfig *)config
                      complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    self = [super initWithFrame:CGRectMake(0, 0, [UIApplication sharedApplication].keyWindow.frame.size.width, [UIApplication sharedApplication].keyWindow.frame.size.height)];
    if (self) {
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
        [[UIApplication sharedApplication].keyWindow addSubview:self];
        
        self.config = config;
        self.complete = complete;
        self.loginData = [RXOSUserUtility sharedManager].loginData;
        if (!self.loginData || self.loginData.allKeys.count <= 0) {
            self.loginData = [RXOSUserUtility sharedManager].apiLoginData;
        }
        NSDictionary *loginData = [[NSUserDefaults standardUserDefaults] valueForKey:keyUser_loginData];
        if (loginData) {
            self.loginData = loginData[@"loginData"][@"data"];
        }
        
        [self setUI];
        
        [self show];
    }
    return self;
}

- (void)show
{
    [UIView animateWithDuration:0.1 animations:^{
        self.bgViewAlpha.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.5];
        [RXOSCommonTool showWithAnimate:self];
//        [RXOSCommonTool showWithAnimate:self.bgView];
//        [RXOSCommonTool showWithAnimate:self.webView];
//        [RXOSCommonTool showWithAnimate:self.webView.webView];
//        [RXOSCommonTool showWithAnimate:self.titleLbl];
//        [RXOSCommonTool showWithAnimate:self.closeBtn];
//        [RXOSCommonTool showWithAnimate:self.logoImageView];
//        [RXOSCommonTool showWithAnimate:self.changeBtn];
//        [RXOSCommonTool showWithAnimate:self.iconImageView];
//        [RXOSCommonTool showWithAnimate:self.usernameLbl];
        
        [self layoutSubviews];
    }];
}

- (void)hide
{
    [RXOSHUD hideWebHUD];
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
    [self addSubview:self.refreshBtn];
    
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
    
//    _changeBtn.frame = CGRectMake(CGRectGetMinX(_bgView.frame) + (RXAC ? 485 : 242), CGRectGetMinY(_bgView.frame) + (RXAC ? 73 : 83), RXAC ? 142 : 115, RXAC ? 44 : 36);
    CGFloat changeBtnW = [_changeBtn.titleLabel.text widthForFont:_changeBtn.titleLabel.font] + 10;
    
    _changeBtn.frame = CGRectMake(CGRectGetMaxX(_bgView.frame) - (RXAC ? 30 + changeBtnW : 21 + changeBtnW), CGRectGetMinY(_bgView.frame) + (RXAC ? 62 : 66), changeBtnW, RXAC ? 36 : 30);
    
    _usernameLbl.frame = CGRectMake(CGRectGetMaxX(_iconImageView.frame) + 8, CGRectGetMinY(_iconImageView.frame), CGRectGetWidth(_bgView.frame) - (RXAC ? 29 + changeBtnW + 34 : 25 + changeBtnW + 64), CGRectGetHeight(_iconImageView.frame));
    
    _closeBtn.frame = CGRectMake(CGRectGetMaxX(_bgView.frame) - (RXAC ? 45 - 1 : 37), CGRectGetMinY(_bgView.frame) + (RXAC ? 20 : 16), 28, 28);
    
    _refreshBtn.frame = CGRectMake(CGRectGetMinX(_iconImageView.frame) + (RXAC ? 22 : 16), CGRectGetMinY(_iconImageView.frame) + (RXAC ? 19 : 10), RXAC ? 18 : 16, RXAC ? 18 : 16);
    
    if (self.config.setSyncInfoEnable) {
        _refreshBtn.hidden = NO;
    } else {
        _refreshBtn.hidden = YES;
    }
    
    if (!_webView) {
        __weak __typeof__(self) weakSelf = self;
        _webView = [[RXOSWKWebView alloc] initWithFrame:CGRectMake(CGRectGetMinX(_bgView.frame) + (RXAC ? 19 : 16), CGRectGetMinY(_bgView.frame) + (RXAC ? 116 : 112), CGRectGetWidth(_bgView.frame) - (RXAC ? 38 : 32), RXAC ? 171 : 181)];
        _webView.webView.frame = CGRectMake(5, 5, CGRectGetWidth(_webView.frame) - 10, CGRectGetHeight(_webView.frame) - 10);
        _webView.isUserCenter = YES;
        _webView.needRefreshToken = YES;
        _webView.backgroundColor = [UIColor whiteColor];
        _webView.tag = WebViewTag;
        _webView.layer.cornerRadius = 5;
        _webView.webView.layer.cornerRadius = 5;
        _webView.userCenterConfig = self.config;
        _webView.complete = ^(NSDictionary * _Nonnull response) {
            if (weakSelf.complete) {
                weakSelf.complete(response, nil);
            }
        };
//        _webView.webView.scrollView.scrollEnabled = NO;
        _webView.naviBar.hidden = YES;
        [self addSubview:self.webView];
    }
    
    NSString *username = self.loginData[@"username"];
    if (!username || username.length <= 0) {
        username = self.loginData[@"nickname"];
    }
    
    if ([self.loginData[@"method"] isEqualToString:@"guest"]) {
        username = [RXLocation osLaunguage:@"游客"];
    }
    
    _usernameLbl.text = username;
    
    if (self.loginData[@"avatar"]) {
        _iconImageView.image = [RXOSCommonTool getNormalImageFromURL:(NSString *)self.loginData[@"avatar"]];
        _iconImageView.layer.masksToBounds = YES;
//        _iconImageView.layer.cornerRadius = 12;
    }
    
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
    
    self.webView.urlStr = [NSString stringWithFormat:@"%@static/passport/#/overseausercenter", domain];
//    self.webView.urlStr = @"https://10.10.2.177:8083/static/passport/#/overseausercenter";
    self.urlStr = self.webView.urlStr;
}

#pragma mark -- <actions>
- (void)closeBtnAction
{
    RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
    
    NSString *errorMsg = [RXErrorTool getRXErrorMsg:RXLimitError_closeView];
    err.responesObject = @{@"msg" : errorMsg,
                           @"code" : @(RXLimitError_closeView)
    };
    
    if (self.complete) {
        self.complete(nil, err);
    }
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

- (void)syncInfoAction
{
    [RXOSCommonTool syncInfo:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
        if (!error) {
            NSDictionary *userInfo = response[@"data"];
            NSString *nickname = userInfo[@"nickname"];
            NSString *avatarUrl = userInfo[@"avatar"];
            if (nickname && nickname.length > 0) {
                self.usernameLbl.text = nickname;
            }
            if (avatarUrl && avatarUrl.length > 0) {
                self.iconImageView.image = [RXOSCommonTool getNormalImageFromURL:avatarUrl];
            }
            [RXOSHUD showText:@"用户信息已更新"];
        } else {
            [RXOSHUD showText:@"用户信息更新失败，请重新操作"];
        }
    }];
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

- (RXOSCloseBtn *)closeBtn
{
    if (!_closeBtn) {
        _closeBtn = [RXOSCloseBtn buttonWithType:UIButtonTypeCustom];
        _closeBtn.adjustsImageWhenHighlighted = NO;
        [_closeBtn setImage:[UIImage rxOSBundleImageNamed:@"rx_close"] forState:UIControlStateNormal];
        [_closeBtn addTarget:self action:@selector(closeBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _closeBtn;
}

- (UIButton *)changeBtn
{
    if (!_changeBtn) {
        _changeBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_changeBtn setTitle:[RXLocation osLaunguage:@"切换账号"] forState:UIControlStateNormal];
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
        _iconImageView.image = [UIImage rxOSBundleImageNamed:@"rx_headIcon"];
        _iconImageView.layer.cornerRadius = RXAC ? 36 / 2 : 25 / 2;
    }
    return _iconImageView;
}

- (UIImageView *)logoImageView
{
    if (!_logoImageView) {
        _logoImageView = [[UIImageView alloc] init];
        
        if (_config.logoImage) {
            _logoImageView.image = _config.logoImage;
        } else {
            RXOSUILoginConfig *config = [RXOSUserUtility sharedManager].loginConfig;
            
            if (config.logoImage) {
                if ([config.logoImage isKindOfClass:[UIImage class]]) {
                    _logoImageView.image = config.logoImage;
                } else {
                    _logoImageView.image = [RXOSCommonTool getImageFromURL:(NSString *)config.logoImage];
                }
            } else {
                _logoImageView.image = [UIImage rxOSBundleImageNamed:@"rx_logoImage"];
            }
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

- (UIButton *)refreshBtn
{
    if (!_refreshBtn) {
        _refreshBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_refreshBtn setImage:[UIImage rxOSBundleImageNamed:@"rx_usercenter_refresh"] forState:UIControlStateNormal];
        [_refreshBtn addTarget:self action:@selector(syncInfoAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _refreshBtn;
}

@end
