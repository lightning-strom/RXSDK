//
//  RXOSQuickLoginView.m
//  RXUIKit
//
//  Created by 陈汉 on 2023/3/16.
//

#import "RXOSQuickLoginView.h"
#import "RXOSAccountBtn.h"
#import "RXOSMoreLoginView.h"
#import "RXOSLoginView.h"
#import "RXOSCloseBtn.h"
#import "RXOSHistoryLoginView.h"
#import "RXOSLoginViewManager.h"
#import "RXOSPriView.h"
#import "RXOSLogManager.h"
#import "RXOSEmailLoginView.h"

#define LoginBtnTag 100000

@interface RXOSQuickLoginView ()

@property (nonatomic, assign) NSInteger orientation;  // 屏幕方向 1竖屏 2横屏
@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) RXOSUILoginConfig *loginConfig;
@property (nonatomic, strong) NSMutableArray *loginTypes;
@property (nonatomic, copy) LoginTypeBlock loginTypeBlock;
@property (nonatomic, copy) LoginComplete loginComplete;
@property (nonatomic, strong) RXOSCloseBtn *closeBtn;
@property (nonatomic, strong) RXOSCloseBtn *backBtn;
@property (nonatomic, strong) UIImageView *logoImageView;
@property (nonatomic, strong) UIImage *logoImage;
@property (nonatomic, strong) UILabel *titleLbl;
@property (nonatomic, strong) UIButton *moreBtn;
@property (nonatomic, strong) UIButton *auditAppleLoginBtn;

@end

@implementation RXOSQuickLoginView

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (instancetype)initWithLoginConfig:(RXOSUILoginConfig *)loginConfig
                         loginEvent:(NSDictionary *(^)(NSDictionary *loginEvent, LoginType loginType))loginEvent
                           complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    self = [super initWithFrame:CGRectMake(0, 0, [UIApplication sharedApplication].keyWindow.frame.size.width, [UIApplication sharedApplication].keyWindow.frame.size.height)];
    if (self) {
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
        [[UIApplication sharedApplication].keyWindow addSubview:self];
        
        self.orientation = [RXOSCommonTool getInterfaceOrientation];
        self.loginConfig = loginConfig;
        self.loginTypeBlock = loginEvent;
        self.loginComplete = complete;
        self.logoImage = loginConfig.logoImage;
        self.loginTypes = [NSMutableArray arrayWithArray:[RXOSUserUtility sharedManager].loginTypes];
        
        [self setUI];
        
        [self show];
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
    [RXOSCommonTool transformWithView:self.bgView];
    [UIView animateWithDuration:0.1 animations:^{
        if ([RXOSUserUtility sharedManager].isFirstView) {
            self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.5];
        } else {
            self.backgroundColor = [UIColor clearColor];
        }
        
        [RXOSCommonTool showWithAnimate:self.bgView];
        
        [self layoutSubviews];
    }];
}

- (void)hide
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    [self removeFromSuperview];
    
    [[RXLogService sharedSDK] addLogSingleFirstLoginWithEvent:rxlog_login_page_hide distinctId:@"" properties:nil];
}

#pragma mark -- <setUI>
- (void)setUI
{   
    [self addSubview:self.bgView];
    [self.bgView addSubview:self.closeBtn];
    [self.bgView addSubview:self.logoImageView];
    [self.bgView addSubview:self.titleLbl];
    [self.bgView addSubview:self.moreBtn];
    [self.bgView addSubview:self.backBtn];
    
    // 审核模式只展示 sign in with apple
    if (_loginConfig.isAudit) {
        [self.bgView addSubview:self.auditAppleLoginBtn];
        
        CGFloat x = (RXAC ? 433 - 342 : 346 - 322) / 2;
        self.auditAppleLoginBtn.frame = CGRectMake(x, RXAC ? 120 : 124, RXAC ? 342 : 322, 54);
        [self layoutViews];
        
        return;
    }
    
    NSMutableArray *imageArr = [NSMutableArray array];
    NSMutableArray *titleArr = [NSMutableArray array];
    NSMutableArray *colorArr = [NSMutableArray array];
    NSString *imageName = @"";
    BOOL isAC = RXAC;
    for (int i = 0; i < self.loginTypes.count; i++) {
        RXUserType userType = [RXOSCommonTool getUserType:self.loginTypes[i]];
        switch (userType) {
            case RXUserType_visitor:
            {
                imageName = isAC ? @"rx_login_visitor" : @"rx_login_visitor";
                [imageArr addObject:imageName];
                [titleArr addObject:@"游客"];
                [colorArr addObject:@"#DEEEEC"];
                break;
            }
            case RXUserType_apple:
            {
                imageName = isAC ? @"rx_login_apple" : @"rx_login_apple";
                [imageArr addObject:imageName];
                [titleArr addObject:@"Apple"];
                [colorArr addObject:@"#EEEEEE"];
                break;
            }
            case RXUserType_w:
            {
                imageName = isAC ? @"rx_login_wechat" : @"rx_login_wechat";
                [imageArr addObject:imageName];
                [titleArr addObject:@"微信"];
                [colorArr addObject:@"#EEEEEE"];
                break;
            }
            case RXUserType_google:
            {
                imageName = isAC ? @"rx_login_google" : @"rx_login_google";
                [imageArr addObject:imageName];
                [titleArr addObject:@"Google"];
                [colorArr addObject:@"#DEEEEC"];
                break;
            }
            case RXUserType_account:
            {
                imageName = isAC ? @"rx_login_mail" : @"rx_login_mail";
                [imageArr addObject:imageName];
                [titleArr addObject:@"邮箱"];
                [colorArr addObject:@"#EEEEEE"];
                break;
            }
            case RXUserType_code:
            {
                imageName = isAC ? @"rx_login_code" : @"rx_login_code";
                [imageArr addObject:imageName];
                [titleArr addObject:@"手机号"];
                [colorArr addObject:@"#EEEEEE"];
                break;
            }
            case RXUserType_facebook:
            {
                imageName = isAC ? @"rx_login_facebook" : @"rx_login_facebook";
                [imageArr addObject:imageName];
                [titleArr addObject:@"Facebook"];
                [colorArr addObject:@"#EEEEEE"];
                break;
            }
            case RXUserType_line:
            {
                imageName = isAC ? @"rx_login_line" : @"rx_login_line";
                [imageArr addObject:imageName];
                [titleArr addObject:@"Line"];
                [colorArr addObject:@"#EEEEEE"];
                break;
            }
            case RXUserType_zalo:
            {
                imageName = isAC ? @"rx_login_zalo" : @"rx_login_zalo";
                [imageArr addObject:imageName];
                [titleArr addObject:@"Zalo"];
                [colorArr addObject:@"#EEEEEE"];
                break;
            }
            case RXUserType_tiktok:
            {
                imageName = isAC ? @"rx_login_tiktok" : @"rx_login_tiktok";
                [imageArr addObject:imageName];
                [titleArr addObject:@"TikTok"];
                [colorArr addObject:@"#EEEEEE"];
                break;
            }
            case RXUserType_snapchat:
            {
                imageName = isAC ? @"rx_login_snapchat" : @"rx_login_snapchat";
                [imageArr addObject:imageName];
                [titleArr addObject:@"SnapChat"];
                [colorArr addObject:@"#EEEEEE"];
                break;
            }
            case RXUserType_instagram:
            {
                imageName = isAC ? @"rx_login_instagram" : @"rx_login_instagram";
                [imageArr addObject:imageName];
                [titleArr addObject:@"Instagram"];
                [colorArr addObject:@"#EEEEEE"];
                break;
            }
            case RXUserType_reddit:
            {
                imageName = isAC ? @"rx_login_reddit" : @"rx_login_reddit";
                [imageArr addObject:imageName];
                [titleArr addObject:@"Reddit"];
                [colorArr addObject:@"#EEEEEE"];
                break;
            }
        }
    }
    
    NSInteger btnCount = imageArr.count;
    
    // 拿到总长度
    CGFloat btnW = RXAC ? 160 : 136;
    CGFloat space = 17;
    if (imageArr.count == 3) {
        btnW = RXAC ? 98 : 84;
        space = RXAC ? 24 : 17;
    } else if (imageArr.count > 3) {
        btnW = RXAC ? 68 : 60;
    }
    
    if (btnCount > 4) {
        btnCount = 4;
    }
    
    CGFloat leftX = ((RXAC ? 433 : 346) - ((btnW * btnCount) + (space * (btnCount - 1)))) / 2;
    for (int i = 0; i < btnCount; i++) {
        RXOSAccountBtn *button = [RXOSAccountBtn buttonWithType:UIButtonTypeCustom];
        button.tag = LoginBtnTag + i;
        button.layer.cornerRadius = 13;
        button.layer.borderColor = [UIColor colorWithHexString:colorArr[i]].CGColor;
        button.layer.borderWidth = 1;
        [button setImage:[UIImage rxOSBundleImageNamed:imageArr[i]] forState:UIControlStateNormal];
        [button addTarget:self action:@selector(quickLoginBtnAction:) forControlEvents:UIControlEventTouchUpInside];
        [self.bgView addSubview:button];
        
        UILabel *titleLbl = [[UILabel alloc] init];
        titleLbl.text = titleArr[i];
        titleLbl.textColor = [UIColor colorWithHexString:@"#70807E"];
        titleLbl.font = [UIFont systemFontOfSize:12 weight:UIFontWeightSemibold];
        titleLbl.textAlignment = NSTextAlignmentCenter;
        [self.bgView addSubview:titleLbl];
        
        CGFloat x = leftX + (space + btnW) * i;
        button.frame = CGRectMake(x, RXAC ? 105 : 110, btnW, RXAC ? 68 : 60);
        titleLbl.frame = CGRectMake(CGRectGetMinX(button.frame), CGRectGetMaxY(button.frame) + (RXAC ? 8 : 10), btnW, 15);
    }
    
    [self layoutViews];
}

- (void)layoutViews
{
    UIView *window = [UIApplication sharedApplication].keyWindow;
    
    CGFloat bgH = RXAC ? 232 : 232;
    if (self.loginConfig.loginTypes.count > 4 && !self.loginConfig.isAudit) {
        bgH = RXAC ? 260 : 260;
        self.moreBtn.hidden = NO;
    }
    
    self.bgView.frame = CGRectMake(0, 0, RXAC ? 433 : 346, bgH);
    self.bgView.center = window.center;
    
    self.closeBtn.frame = CGRectMake(CGRectGetWidth(_bgView.frame) - (RXAC ? 29 + 18 : 25 + 18), RXAC ? 12 : 16, 28, 28);
    
    self.backBtn.frame = CGRectMake(RXAC ? 24 : 21, CGRectGetMinY(_closeBtn.frame), 28, 28);
    
    _logoImageView.frame = CGRectMake(CGRectGetWidth(_bgView.frame) / 2 - 108 / 2, RXAC ? 16 : 16, 108, 25);
    if ([self.logoImage isKindOfClass:[UIImage class]]) {
        _logoImageView.image = self.logoImage;
    } else {
        _logoImageView.image = [RXOSCommonTool getImageFromURL:(NSString *)self.logoImage];
    }
    
    self.titleLbl.frame = CGRectMake(0, RXAC ? 66 : 66, CGRectGetWidth(_bgView.frame), 25);
    
    self.moreBtn.frame = CGRectMake(CGRectGetWidth(_bgView.frame) / 2 - 126, RXAC ? 210 : 210, 252, 40);
    
    [self layoutSubviews];
}

#pragma mark -- <actions>
- (void)quickLoginBtnAction:(UIButton *)btn
{
    RXOSPriView *priView = [[RXOSPriView alloc] init];
    priView.agreeBlock = ^{
        NSInteger i = btn.tag - LoginBtnTag;
        RXUserType userType = [RXOSCommonTool getUserType:self.loginTypes[i]];
        LoginType loginType;
        switch (userType) {
            case RXUserType_visitor:
            {
                loginType = LoginTypeVisitor;
                NSDictionary *loginExt = [NSDictionary dictionary];
                if (self.loginTypeBlock) {
                    loginExt = self.loginTypeBlock(loginExt, loginType);
                    [[RXOSLoginViewManager sharedSDK] fetchLoginEvent:loginType loginInfo:loginExt complete:self.loginComplete];
                }
                break;
            }
            case RXUserType_apple:
            {
                loginType = LoginTypeApple;
                NSDictionary *loginExt = [NSDictionary dictionary];
                if (self.loginTypeBlock) {
                    loginExt = self.loginTypeBlock(loginExt, loginType);
                    [[RXOSLoginViewManager sharedSDK] fetchLoginEvent:loginType loginInfo:loginExt complete:self.loginComplete];
                }
                break;
            }
            case RXUserType_w:
            {
                loginType = LoginTypeW;
                break;
            }
            case RXUserType_auth:
            {
                loginType = LoginTypeAuth;
    //            for (UIView *subView in [UIApplication sharedApplication].keyWindow.subviews) {
    //                if ([subView isKindOfClass:[RXUIAuthLoginView class]]) {
    //                    RXUIAuthLoginView *authLoginView = (RXUIAuthLoginView *)subView;
    ////                    loginView.codeLoginBtn.selected = !loginView.codeLoginBtn.selected;
    //                    [[UIApplication sharedApplication].keyWindow bringSubviewToFront:authLoginView];
    ////                    [self refreshUIWithViewType:self.viewType];
    //                    return;
    //                }
    //            }
                break;
            }
            case RXUserType_account:
            {   
                loginType = LoginTypeAccount;
                self.loginConfig.loginViewType = 0;
//                RXOSLoginView *loginView = [[RXOSLoginView alloc] initWithConfig:self.loginConfig loginEvent:self.loginTypeBlock complete:self.loginComplete];
                RXOSEmailLoginView *loginView = [[RXOSEmailLoginView alloc] initWithConfig:self.loginConfig loginEvent:self.loginTypeBlock complete:self.loginComplete];
                break;
            }
            case RXUserType_code:
            {
                loginType = LoginTypeCapCode;
                self.loginConfig.loginViewType = 1;
                RXOSLoginView *loginView = [[RXOSLoginView alloc] initWithConfig:self.loginConfig loginEvent:self.loginTypeBlock complete:self.loginComplete];
                break;
            }
            case RXUserType_google:
            {
                loginType = LoginTypeGoogle;
                NSDictionary *loginExt = [NSDictionary dictionary];
                if (self.loginTypeBlock) {
                    loginExt = self.loginTypeBlock(loginExt, loginType);
                    [[RXOSLoginViewManager sharedSDK] fetchLoginEvent:loginType loginInfo:loginExt complete:self.loginComplete];
                }
                break;
            }
            case RXUserType_facebook:
            {
                loginType = LoginTypeFacebook;
                NSDictionary *loginExt = [NSDictionary dictionary];
                if (self.loginTypeBlock) {
                    loginExt = self.loginTypeBlock(loginExt, loginType);
                    [[RXOSLoginViewManager sharedSDK] fetchLoginEvent:loginType loginInfo:loginExt complete:self.loginComplete];
                }
                break;
            }
            case RXUserType_line:
            {
                loginType = LoginTypeLine;
                NSDictionary *loginExt = [NSDictionary dictionary];
                if (self.loginTypeBlock) {
                    loginExt = self.loginTypeBlock(loginExt, loginType);
                    [[RXOSLoginViewManager sharedSDK] fetchLoginEvent:loginType loginInfo:loginExt complete:self.loginComplete];
                }
                break;
            }
            case RXUserType_zalo:
            {
                loginType = LoginTypeZalo;
                NSDictionary *loginExt = [NSDictionary dictionary];
                if (self.loginTypeBlock) {
                    loginExt = self.loginTypeBlock(loginExt, loginType);
                    [[RXOSLoginViewManager sharedSDK] fetchLoginEvent:loginType loginInfo:loginExt complete:self.loginComplete];
                }
                break;
            }
            case RXUserType_tiktok:
            {
                loginType = LoginTypeTikTok;
                NSDictionary *loginExt = [NSDictionary dictionary];
                if (self.loginTypeBlock) {
                    loginExt = self.loginTypeBlock(loginExt, loginType);
                    [[RXOSLoginViewManager sharedSDK] fetchLoginEvent:loginType loginInfo:loginExt complete:self.loginComplete];
                }
                break;
            }
            case RXUserType_snapchat:
            {
                loginType = LoginTypeSnapChat;
                NSDictionary *loginExt = [NSDictionary dictionary];
                if (self.loginTypeBlock) {
                    loginExt = self.loginTypeBlock(loginExt, loginType);
                    [[RXOSLoginViewManager sharedSDK] fetchLoginEvent:loginType loginInfo:loginExt complete:self.loginComplete];
                }
                break;
            }
            case RXUserType_instagram:
            {
                loginType = LoginTypeInstagram;
                NSDictionary *loginExt = [NSDictionary dictionary];
                if (self.loginTypeBlock) {
                    loginExt = self.loginTypeBlock(loginExt, loginType);
                    [[RXOSLoginViewManager sharedSDK] fetchLoginEvent:loginType loginInfo:loginExt complete:self.loginComplete];
                }
                break;
            }
            case RXUserType_reddit:
            {
                loginType = LoginTypeReddit;
                NSDictionary *loginExt = [NSDictionary dictionary];
                if (self.loginTypeBlock) {
                    loginExt = self.loginTypeBlock(loginExt, loginType);
                    [[RXOSLoginViewManager sharedSDK] fetchLoginEvent:loginType loginInfo:loginExt complete:self.loginComplete];
                }
                break;
            }
        }
        
        [[RXOSLogManager sharedSDK] addClickLoginLogWithLoginType:loginType];
    };
}

- (void)moreBtnAction
{
    self.loginConfig.loginTypes = self.loginTypes;
    RXOSMoreLoginView *moreLoginView = [[RXOSMoreLoginView alloc] initWithLoginConfig:self.loginConfig showAllLoginTypes:NO loginEvent:self.loginTypeBlock complete:self.loginComplete];
    __weak __typeof__(self) weakSelf = self;
    moreLoginView.clickBlock = ^(LoginType loginType) {
        NSDictionary *loginExt = [NSDictionary dictionary];
        if (weakSelf.loginTypeBlock) {
            loginExt = weakSelf.loginTypeBlock(loginExt, loginType);
            [[RXOSLoginViewManager sharedSDK] fetchLoginEvent:loginType loginInfo:loginExt complete:self.loginComplete];
        }
    };
}

- (void)closeBtnAction
{
    NSMutableArray *accounts = [RXOSUserUtility sharedManager].accounts;
    
    if (accounts.count > 0) {
        for (UIView *v in [UIApplication sharedApplication].keyWindow.subviews) {
            if ([v isKindOfClass:[RXOSHistoryLoginView class]]) {
                [v removeFromSuperview];
            }
        }
    } else {

    }
    
    RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
    
    NSString *errorMsg = [RXErrorTool getRXErrorMsg:RXLimitError_closeView];
    err.responesObject = @{@"msg" : errorMsg,
                           @"code" : @(RXLimitError_closeView)
    };
    if (self.loginComplete) {
        self.loginComplete(nil, err);
    }
    [[RXService sharedSDK].loginDelegate rx_LoginCallBackWithResponse:nil error:err];
    
    [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                   bodyDic:@{}
                                                    action:@"rxlog_error_login"
                                                       url:@""
                                                      code:err.responesObject[@"code"] == nil ? -123 : [err.responesObject[@"code"] integerValue]
                                                       msg:err.responesObject[@"msg"]
                                                 thirdType:@""
                                                 thirdcode:err.responesObject[@"thirdcode"] == nil ? -123 : [err.responesObject[@"thirdcode"] integerValue]
                                                  thirdmsg:err.responesObject[@"thirdmsg"]
                                                   traceid:@""];
    
    [self hide];
}

- (void)auditAppleLoginAction:(UIButton *)btn
{
    RXOSPriView *priView = [[RXOSPriView alloc] init];
    priView.agreeBlock = ^{
        LoginType loginType = LoginTypeApple;
        NSDictionary *loginExt = [NSDictionary dictionary];
        if (self.loginTypeBlock) {
            loginExt = self.loginTypeBlock(loginExt, loginType);
            [[RXOSLoginViewManager sharedSDK] fetchLoginEvent:loginType loginInfo:loginExt complete:self.loginComplete];
        }
    };
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

- (RXOSCloseBtn *)closeBtn
{
    if (!_closeBtn) {
        _closeBtn = [RXOSCloseBtn buttonWithType:UIButtonTypeCustom];
        [_closeBtn setImage:[UIImage rxOSBundleImageNamed:@"rx_close"] forState:UIControlStateNormal];
        [_closeBtn addTarget:self action:@selector(closeBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _closeBtn;
}

- (RXOSCloseBtn *)backBtn
{
    if (!_backBtn) {
        _backBtn = [RXOSCloseBtn buttonWithType:UIButtonTypeCustom];
        [_backBtn setImage:[UIImage rxOSBundleImageNamed:@"rx_back"] forState:UIControlStateNormal];
        [_backBtn addTarget:self action:@selector(hide) forControlEvents:UIControlEventTouchUpInside];
        if ([RXOSUserUtility sharedManager].isFirstView) {
            _backBtn.hidden = YES;
        } else {
            _backBtn.hidden = NO;
        }
//        _backBtn.hidden = YES;
    }
    return _backBtn;
}

- (UIImageView *)logoImageView
{
    if (!_logoImageView) {
        _logoImageView = [[UIImageView alloc] init];
    }
    return _logoImageView;
}

- (UILabel *)titleLbl
{
    if (!_titleLbl) {
        _titleLbl = [[UILabel alloc] init];
        _titleLbl.text = @"登录";
        _titleLbl.textColor = [UIColor blackColor];
        _titleLbl.font = [UIFont systemFontOfSize:21 weight:UIFontWeightMedium];
        _titleLbl.textAlignment = NSTextAlignmentCenter;
    }
    return _titleLbl;
}

- (UIButton *)moreBtn
{
    if (!_moreBtn) {
        _moreBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_moreBtn setTitle:[RXLocation osLaunguage:@"更多登录方式 >"] forState:UIControlStateNormal];
        _moreBtn.titleLabel.textAlignment = NSTextAlignmentCenter;
        _moreBtn.titleLabel.font = [UIFont systemFontOfSize:14 weight:UIFontWeightSemibold];
        [_moreBtn setTitleColor:[UIColor colorWithHexString:@"#20C0B3"] forState:UIControlStateNormal];
        [_moreBtn addTarget:self action:@selector(moreBtnAction) forControlEvents:UIControlEventTouchUpInside];
        _moreBtn.hidden = YES;
    }
    return _moreBtn;
}

- (UIButton *)auditAppleLoginBtn
{
    if (!_auditAppleLoginBtn) {
        _auditAppleLoginBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_auditAppleLoginBtn setImage:[UIImage rxOSBundleImageNamed:@"rx_sign_in_with_apple"] forState:normal];
        [_auditAppleLoginBtn addTarget:self action:@selector(auditAppleLoginAction:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _auditAppleLoginBtn;
}

@end
