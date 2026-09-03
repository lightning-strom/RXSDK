//
//  RXOSMoreLoginView.m
//  RXUIKit
//
//  Created by 陈汉 on 2023/3/16.
//

#import "RXOSMoreLoginView.h"
#import "RXOSPriView.h"
#import "RXOSMoreLoginBtn.h"
#import "RXOSLoginView.h"
#import "RXOSCloseBtn.h"
#import "RXOSEmailLoginView.h"

#define LoginBtnTag 100000

@interface RXOSMoreLoginView ()

@property (nonatomic, assign) NSInteger orientation;  // 屏幕方向 1竖屏 2横屏
@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) NSMutableArray *loginTypes;
@property (nonatomic, strong) RXOSUILoginConfig *loginConfig;
@property (nonatomic, strong) RXOSCloseBtn *backBtn;
@property (nonatomic, strong) UILabel *titleLbl;
@property (nonatomic, copy) LoginTypeBlock loginTypeBlock;
@property (nonatomic, copy) LoginComplete loginComplete;
@property (nonatomic, strong) UIButton *auditAppleLoginBtn;

@end

@implementation RXOSMoreLoginView

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (instancetype)initWithLoginConfig:(RXOSUILoginConfig *)loginConfig
                  showAllLoginTypes:(BOOL)showAllLoginTypes
                         loginEvent:(NSDictionary *(^)(NSDictionary *loginEvent, LoginType loginType))loginEvent
                           complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    self = [super initWithFrame:CGRectMake(0, 0, [UIApplication sharedApplication].keyWindow.frame.size.width, [UIApplication sharedApplication].keyWindow.frame.size.height)];
    if (self) {
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
        [[UIApplication sharedApplication].keyWindow addSubview:self];
        
        self.orientation = [RXOSCommonTool getInterfaceOrientation];
        self.loginConfig = loginConfig;
        
        self.loginTypes = [NSMutableArray arrayWithArray:loginConfig.loginTypes];
        if (!showAllLoginTypes) {
            [self.loginTypes removeObjectsInRange:NSMakeRange(0, 4)];
        }
        
        self.loginTypeBlock = loginEvent;
        self.loginComplete = complete;
        
        [self setUI];
        
        [self show];
        
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(loginCallBack:) name:noti_rxLogin object:nil];
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
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.5];
        
        [RXOSCommonTool showWithAnimate:self.bgView];
        
        [self layoutSubviews];
    }];
}

- (void)hide
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    [self removeFromSuperview];
    
}

#pragma mark -- <setUI>
- (void)setUI
{
    [self addSubview:self.bgView];
    [self.bgView addSubview:self.titleLbl];
    [self.bgView addSubview:self.backBtn];
    
    // 审核模式只展示 sign in with apple
    if (_loginConfig.isAudit) {
        [self.bgView addSubview:self.auditAppleLoginBtn];
        
        CGFloat x = ([RXOSCommonTool getScreenWidth] - (RXAC ? 322 : 302)) / 2;
        self.auditAppleLoginBtn.frame = CGRectMake(x, RXAC ? 90 : 94, RXAC ? 322 : 302, 54);
        [self layoutViews];
        
        return;
    }
    
    NSMutableArray *imageArr = [NSMutableArray array];
    NSMutableArray *titleArr = [NSMutableArray array];
    NSMutableArray *colorArr = [NSMutableArray array];
    for (int i = 0; i < self.loginTypes.count; i++) {
        RXUserType userType = [RXOSCommonTool getUserType:self.loginTypes[i]];
        switch (userType) {
            case RXUserType_visitor:
            {
                [imageArr addObject:@"rx_loginMore_visitor"];
                [titleArr addObject:@"游客"];
                [colorArr addObject:@"#3B89FD"];
                break;
            }
            case RXUserType_apple:
            {
                [imageArr addObject:@"rx_loginMore_apple"];
                [titleArr addObject:@"Apple"];
                [colorArr addObject:@"#000000"];
                break;
            }
            case RXUserType_w:
            {
                [imageArr addObject:@"rx_loginMore_wechat"];
                [titleArr addObject:@"微信"];
                [colorArr addObject:@"#20C0B3"];
                break;
            }
            case RXUserType_auth:
            {
                [imageArr addObject:@"rx_loginMore_auth"];
                [titleArr addObject:@"一键登录"];
                [colorArr addObject:@"#000000"];
                break;
            }
            case RXUserType_account:
            {
                [imageArr addObject:@"rx_loginMore_mail"];
                [titleArr addObject:@"邮箱"];
                [colorArr addObject:@"#000000"];
                break;
            }
            case RXUserType_code:
            {
                [imageArr addObject:@"rx_loginMore_code"];
                [titleArr addObject:@"手机号"];
                [colorArr addObject:@"#000000"];
                break;
            }
            case RXUserType_google:
            {
                [imageArr addObject:@"rx_loginMore_google"];
                [titleArr addObject:@"Google"];
                [colorArr addObject:@"#000000"];
                break;
            }
            case RXUserType_facebook:
            {
                [imageArr addObject:@"rx_login_facebook"];
                [titleArr addObject:@"Facebook"];
                [colorArr addObject:@"#EEEEEE"];
                break;
            }
            case RXUserType_line:
            {
                [imageArr addObject:@"rx_login_line"];
                [titleArr addObject:@"Line"];
                [colorArr addObject:@"#EEEEEE"];
                break;
            }
            case RXUserType_zalo:
            {
                [imageArr addObject:@"rx_login_zalo"];
                [titleArr addObject:@"Zalo"];
                [colorArr addObject:@"#EEEEEE"];
                break;
            }
            case RXUserType_tiktok:
            {
                [imageArr addObject:@"rx_login_tiktok"];
                [titleArr addObject:@"TikTok"];
                [colorArr addObject:@"#EEEEEE"];
                break;
            }
            case RXUserType_snapchat:
            {
                [imageArr addObject:@"rx_login_snapchat"];
                [titleArr addObject:@"SnapChat"];
                [colorArr addObject:@"#EEEEEE"];
                break;
            }
            case RXUserType_instagram:
            {
                [imageArr addObject:@"rx_login_instagram"];
                [titleArr addObject:@"Instagram"];
                [colorArr addObject:@"#EEEEEE"];
                break;
            }
            case RXUserType_reddit:
            {
                [imageArr addObject:@"rx_login_reddit"];
                [titleArr addObject:@"Reddit"];
                [colorArr addObject:@"#EEEEEE"];
                break;
            }
        }
    }
    
    // (总宽 - 间距*数量 - 按钮宽*数量) / 2
    NSInteger imageCount = imageArr.count;
    if (imageCount > 4) {
        imageCount = 4;
    }
    CGFloat leftSpace = ([RXOSCommonTool getScreenWidth] - (23 * (imageCount - 1)) - (60 * imageCount)) / 2;
    NSLog(@"%lu", (23 * imageArr.count - 1));
    for (int i = 0; i < imageArr.count; i++) {
        RXOSMoreLoginBtn *button = [RXOSMoreLoginBtn buttonWithType:UIButtonTypeCustom];
        button.tag = LoginBtnTag + i;
        [button setImage:[UIImage rxOSBundleImageNamed:imageArr[i]] forState:UIControlStateNormal];
        [button setTitle:[RXLocation osLaunguage:titleArr[i]] forState:UIControlStateNormal];
        button.titleLabel.font = [UIFont systemFontOfSize:12 weight:UIFontWeightSemibold];
        [button addTarget:self action:@selector(quickLoginBtnAction:) forControlEvents:UIControlEventTouchUpInside];
        [button setTitleColor:[UIColor colorWithHexString:@"#70807E"] forState:UIControlStateNormal];

        [self.bgView addSubview:button];
        
        CGFloat x = leftSpace + (60 + 23) * i;
        
        CGFloat y = 82;
        if (i > 3) {
            x = leftSpace + (60 + 23) * (i - 4);
            y = 180;
        }
        button.frame = CGRectMake(x, y, 60, 82);
    }
    
    [self layoutViews];
}

- (void)layoutViews
{
    UIView *window = [UIApplication sharedApplication].keyWindow;
    
//    self.bgView.frame = CGRectMake(0, 0, 344, 240);
    CGFloat bgH = 201;
    
    if (self.loginTypes.count > 4 && !self.loginConfig.isAudit) {
        bgH = RXAC ? 302 : 283;
    }
    
    self.bgView.frame = CGRectMake(0, 0, [RXOSCommonTool getScreenWidth], bgH);
    self.bgView.center = window.center;
    
    if ([RXOSCommonTool isRTL]) {
        self.backBtn.frame = CGRectMake(CGRectGetWidth(self.bgView.frame) - (RXAC ? 24 + 28: 15 + 28), 16, 28, 28);
    } else {
        self.backBtn.frame = CGRectMake(RXAC ? 24 : 15, 16, 28, 28);
    }
    
    self.titleLbl.frame = CGRectMake(0, RXAC ? 21 : 25, [RXOSCommonTool getScreenWidth], 24);
    
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
                break;
            }
            case RXUserType_apple:
            {
                loginType = LoginTypeApple;
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
                break;
            }
            case RXUserType_facebook:
            {
                loginType = LoginTypeFacebook;
                break;
            }
            case RXUserType_google:
            {
                loginType = LoginTypeGoogle;
                break;
            }
            case RXUserType_line:
            {
                loginType = LoginTypeLine;
                break;
            }
            case RXUserType_zalo:
            {
                loginType = LoginTypeZalo;
                break;
            }
            case RXUserType_tiktok:
            {
                loginType = LoginTypeTikTok;
                break;
            }
            case RXUserType_snapchat:
            {
                loginType = LoginTypeSnapChat;
                break;
            }
            case RXUserType_instagram:
            {
                loginType = LoginTypeInstagram;
                break;
            }
            case RXUserType_reddit:
            {
                loginType = LoginTypeReddit;
                break;
            }
            case RXUserType_account:
            {
                loginType = LoginTypeAccount;
                
                self.loginConfig.loginViewType = 0;
                BOOL hasAccount = NO;
                for (UIView *v in [UIApplication sharedApplication].keyWindow.subviews) {
                    if ([v isKindOfClass:[RXOSLoginView class]]) {
    //                    hasAccount = YES;
                        RXOSLoginView *loginView = (RXOSLoginView *)v;
    //                    [loginView codeLoginBtnAction:loginView.codeLoginBtn];
                        [loginView removeFromSuperview];
                        [self hide];
                        UIView *window = [UIApplication sharedApplication].keyWindow;
                        for (UIView *v in window.subviews) {
                            if (v.tag == 200000) {
                                [v removeFromSuperview];
                            }
                        }
                    }
                }
                if (!hasAccount) {
//                    RXOSLoginView *loginView = [[RXOSLoginView alloc] initWithConfig:self.loginConfig loginEvent:self.loginTypeBlock complete:self.loginComplete];
                    RXOSEmailLoginView *loginView = [[RXOSEmailLoginView alloc] initWithConfig:self.loginConfig loginEvent:self.loginTypeBlock complete:self.loginComplete];
                }
                
                [self hide];
                return;
            }
            case RXUserType_code:
            {
                loginType = LoginTypeCapCode;
                
                self.loginConfig.loginViewType = 1;
                BOOL hasAccount = NO;
                for (UIView *v in [UIApplication sharedApplication].keyWindow.subviews) {
                    if ([v isKindOfClass:[RXOSLoginView class]]) {
    //                    hasAccount = YES;
                        RXOSLoginView *loginView = (RXOSLoginView *)v;
    //                    [loginView codeLoginBtnAction:loginView.codeLoginBtn];
                        [loginView removeFromSuperview];
                        [self hide];
                        UIView *window = [UIApplication sharedApplication].keyWindow;
                        for (UIView *v in window.subviews) {
                            if (v.tag == 200000) {
                                [v removeFromSuperview];
                            }
                        }
                    }
                }
                if (!hasAccount) {
                    RXOSLoginView *loginView = [[RXOSLoginView alloc] initWithConfig:self.loginConfig loginEvent:self.loginTypeBlock complete:self.loginComplete];
                }
                return;
            }
        }

        if (self.clickBlock) {
            self.clickBlock(loginType);
        }
    };
}

- (void)loginCallBack:(NSNotification *)noti
{
    NSMutableDictionary *notiDic = [NSMutableDictionary dictionaryWithDictionary:noti.userInfo];
    
    NSDictionary *loginModel = notiDic[@"loginData"];
    NSInteger code = [loginModel[@"code"] integerValue];
    NSString *tipString = loginModel[@"msg"];
    if (loginModel && code == 0) {
//        [SVProgressHUD showSuccessWithStatus:@"登录成功"];
        [RXOSHUD hideHUD];
        [RXOSUserUtility saveLoginModel:loginModel];
        [self hide];
    } else {
//        [RXOSHUD showErrorText:tipString];
    }
    
    NSNumber *loginType = notiDic[@"loginType"];
    if (loginType) {
        [RXOSUserUtility saveLoginType:loginType];
    }
}

- (void)auditAppleLoginAction:(UIButton *)btn
{
    RXOSPriView *priView = [[RXOSPriView alloc] init];
    priView.agreeBlock = ^{
        NSInteger i = btn.tag - LoginBtnTag;
//        RXUserType userType = [RXOSCommonTool getUserType:self.loginTypes[i]];
        LoginType loginType = LoginTypeApple;
        
        if (self.clickBlock) {
            self.clickBlock(loginType);
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

- (RXOSCloseBtn *)backBtn
{
    if (!_backBtn) {
        _backBtn = [RXOSCloseBtn buttonWithType:UIButtonTypeCustom];
        UIImage *backImage = [UIImage rxOSBundleImageNamed:@"rx_back"];
        if ([RXOSCommonTool isRTL]) {
            UIImage *flipImage = [UIImage imageWithCGImage:backImage.CGImage scale:backImage.scale orientation:UIImageOrientationDown];
            [_backBtn setImage:flipImage forState:UIControlStateNormal];
        } else {
            [_backBtn setImage:backImage forState:UIControlStateNormal];
        }
        [_backBtn addTarget:self action:@selector(hide) forControlEvents:UIControlEventTouchUpInside];
    }
    return _backBtn;
}

- (UILabel *)titleLbl
{
    if (!_titleLbl) {
        _titleLbl = [[UILabel alloc] init];
        _titleLbl.text = @"更多登录方式";
        _titleLbl.font = [UIFont systemFontOfSize:21 weight:UIFontWeightMedium];
        _titleLbl.textAlignment = NSTextAlignmentCenter;
    }
    return _titleLbl;
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
