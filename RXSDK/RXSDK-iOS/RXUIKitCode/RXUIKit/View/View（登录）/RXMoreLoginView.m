//
//  RXMoreLoginView.m
//  RXUIKit
//
//  Created by 陈汉 on 2023/3/16.
//

#import "RXMoreLoginView.h"
#import "RXPriView.h"
#import "RXMoreLoginBtn.h"
#import "RXLoginView.h"
#import "RXCloseBtn.h"

#define LoginBtnTag 100000

@interface RXMoreLoginView ()

@property (nonatomic, assign) NSInteger orientation;  // 屏幕方向 1竖屏 2横屏
@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) NSMutableArray *loginTypes;
@property (nonatomic, strong) RXLoginUIConfig *loginConfig;
@property (nonatomic, strong) RXCloseBtn *backBtn;
@property (nonatomic, strong) UILabel *titleLbl;
@property (nonatomic, copy) LoginTypeBlock loginTypeBlock;
@property (nonatomic, copy) LoginComplete loginComplete;

@end

@implementation RXMoreLoginView

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (instancetype)initWithLoginConfig:(RXLoginUIConfig *)loginConfig
                           viewType:(RXUserType)viewType
                         loginEvent:(NSDictionary *(^)(NSDictionary *loginEvent, LoginType loginType))loginEvent
                           complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    self = [super initWithFrame:CGRectMake(0, 0, [UIApplication sharedApplication].keyWindow.frame.size.width, [UIApplication sharedApplication].keyWindow.frame.size.height)];
    if (self) {
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
        [[UIApplication sharedApplication].keyWindow addSubview:self];
        
        self.orientation = [RXUICommonTool getInterfaceOrientation];
        self.loginConfig = loginConfig;
        
        self.loginTypes = [NSMutableArray arrayWithArray:loginConfig.loginTypes];
        [self.loginTypes removeObjectsInRange:NSMakeRange(0, 3)];
        // 如果当前是账号密码登录或验证码登录页面，将快捷按钮去掉
        if (viewType == RXUserType_account) {
            for (int i = 0; i < self.loginTypes.count; i++) {
                NSString *type = self.loginTypes[i];
                if ([type isEqualToString:@"username"]) {
                    [self.loginTypes removeObjectAtIndex:i];
                }
            }
        }
        if (viewType == RXUserType_code) {
            for (int i = 0; i < self.loginTypes.count; i++) {
                NSString *type = self.loginTypes[i];
                if ([type isEqualToString:@"code"]) {
                    [self.loginTypes removeObjectAtIndex:i];
                }
            }
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
    [RXUICommonTool transformWithView:self.bgView];
    [UIView animateWithDuration:0.1 animations:^{
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.5];
        
        [RXUICommonTool showWithAnimate:self.bgView];
        
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
    
    NSMutableArray *imageArr = [NSMutableArray array];
    NSMutableArray *titleArr = [NSMutableArray array];
    NSMutableArray *colorArr = [NSMutableArray array];
    for (int i = 0; i < self.loginTypes.count; i++) {
        RXUserType userType = [RXUICommonTool getUserType:self.loginTypes[i]];
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
                [imageArr addObject:@"rx_loginMore_username"];
                [titleArr addObject:@"账号"];
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
        }
    }
    
    // (总宽 - 间距*数量 - 按钮宽*数量) / 2
    NSInteger imageCount = imageArr.count;
    if (imageCount > 4) {
        imageCount = 4;
    }
    CGFloat leftSpace = ([RXUICommonTool getScreenWidth] - (23 * (imageCount - 1)) - (59 * imageCount)) / 2;
    NSLog(@"%lu", (23 * imageArr.count - 1));
    for (int i = 0; i < imageArr.count; i++) {
        RXMoreLoginBtn *button = [RXMoreLoginBtn buttonWithType:UIButtonTypeCustom];
        button.tag = LoginBtnTag + i;
        [button setImage:[UIImage rxBundleImageNamed:imageArr[i]] forState:UIControlStateNormal];
        [button setTitle:titleArr[i] forState:UIControlStateNormal];
        button.titleLabel.font = [UIFont systemFontOfSize:12 weight:UIFontWeightRegular];
        [button addTarget:self action:@selector(quickLoginBtnAction:) forControlEvents:UIControlEventTouchUpInside];
        [button setTitleColor:[UIColor colorWithHexString:@"#70807E"] forState:UIControlStateNormal];

        [self.bgView addSubview:button];
        
        CGFloat x = leftSpace + (59 + 23) * i;
        
        CGFloat y = 82;
        if (i > 3) {
            x = leftSpace + (59 + 23) * (i - 4);
            y = 180;
        }
        button.frame = CGRectMake(x, y, 59, 82);
    }
    
    [self layoutViews];
}

- (void)layoutViews
{
    UIView *window = [UIApplication sharedApplication].keyWindow;
    
//    self.bgView.frame = CGRectMake(0, 0, 344, 240);
    CGFloat bgH = 201;
    
    if (self.loginTypes.count > 4) {
        bgH = RXAC ? 302 : 283;
    }
    
    self.bgView.frame = CGRectMake(0, 0, [RXUICommonTool getScreenWidth], bgH);
    self.bgView.center = window.center;
    
//    self.backBtn.frame = CGRectMake(RXAC ? 24 : 15, 16, 28, 28);
    
    self.backBtn.frame = CGRectMake(CGRectGetWidth(_bgView.frame) - (RXAC ? 15 + 28 : 21 + 28), RXAC ? 9 : 16, 28, 28);
    
    self.titleLbl.frame = CGRectMake(0, RXAC ? 21 : 25, [RXUICommonTool getScreenWidth], 24);
    
    [self layoutSubviews];
}

#pragma mark -- <actions>
- (void)quickLoginBtnAction:(UIButton *)btn
{
    NSInteger i = btn.tag - LoginBtnTag;
    RXUserType userType = [RXUICommonTool getUserType:self.loginTypes[i]];
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
            if ([RXUIUserUtility sharedManager].isAuthFirst && [RXUIUserUtility sharedManager].isAuthShow) {
                [self hide];
                for (UIView *v in [UIApplication sharedApplication].keyWindow.subviews) {
                    if ([v isKindOfClass:[RXLoginView class]]) {
    //                    hasAccount = YES;
                        RXLoginView *loginView = (RXLoginView *)v;
    //                    [loginView codeLoginBtnAction:loginView.codeLoginBtn];
                        [loginView removeFromSuperview];
                        UIView *window = [UIApplication sharedApplication].keyWindow;
                        for (UIView *v in window.subviews) {
                            if (v.tag == 200000) {
                                [v removeFromSuperview];
                                return;
                            }
                        }
                    }
                }
                return;
            }
            break;
        }
        case RXUserType_account:
        {
            loginType = LoginTypeAccount;
            
            self.loginConfig.loginViewType = 0;
            BOOL hasAccount = NO;
            for (UIView *v in [UIApplication sharedApplication].keyWindow.subviews) {
                if ([v isKindOfClass:[RXLoginView class]]) {
//                    hasAccount = YES;
                    RXLoginView *loginView = (RXLoginView *)v;
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
                RXLoginView *loginView = [[RXLoginView alloc] initWithConfig:self.loginConfig loginEvent:self.loginTypeBlock complete:self.loginComplete];
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
                if ([v isKindOfClass:[RXLoginView class]]) {
//                    hasAccount = YES;
                    RXLoginView *loginView = (RXLoginView *)v;
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
                RXLoginView *loginView = [[RXLoginView alloc] initWithConfig:self.loginConfig loginEvent:self.loginTypeBlock complete:self.loginComplete];
            }
            return;
        }
    }

    if (self.clickBlock) {
        self.clickBlock(loginType);
    }
    
    [self hide];
}

- (void)loginCallBack:(NSNotification *)noti
{
    NSMutableDictionary *notiDic = [NSMutableDictionary dictionaryWithDictionary:noti.userInfo];
    
    NSDictionary *loginModel = notiDic[@"loginData"];
    NSInteger code = [loginModel[@"code"] integerValue];
    NSString *tipString = loginModel[@"msg"];
    if (loginModel && code == 0) {
//        [SVProgressHUD showSuccessWithStatus:@"登录成功"];
        [RXHUD hideHUD];
        [RXUIUserUtility saveLoginModel:loginModel];
        [self hide];
    } else {
//        [RXHUD showErrorText:tipString];
    }
    
    NSNumber *loginType = notiDic[@"loginType"];
    if (loginType) {
        [RXUIUserUtility saveLoginType:loginType];
    }
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

- (RXCloseBtn *)backBtn
{
    if (!_backBtn) {
        _backBtn = [RXCloseBtn buttonWithType:UIButtonTypeCustom];
        [_backBtn setImage:[UIImage rxBundleImageNamed:@"rx_close"] forState:UIControlStateNormal];
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

@end
