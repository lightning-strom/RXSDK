//
//  RXQuickLoginView.m
//  RXUIKit
//
//  Created by 陈汉 on 2023/3/16.
//

#import "RXQuickLoginView.h"
#import "RXPriView.h"
#import "RXAccountBtn.h"
#import "RXMoreBtn.h"
#import "RXMoreLoginView.h"
#import "RXLoginView.h"
#import "RXUIAuthLoginView.h"
#import "RXUIAuthLoginFailView.h"
#import "RXAccountBtnPor.h"
#import <QuartzCore/QuartzCore.h>
#import "RXUIKitService.h"
#import "RXAccountBtnNew.h"

#define LoginBtnTag 100000

@interface RXQuickLoginView ()

@property (nonatomic, assign) NSInteger orientation;  // 屏幕方向 1竖屏 2横屏
@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) RXLoginUIConfig *loginConfig;
@property (nonatomic, strong) NSMutableArray *loginTypes;
@property (nonatomic, copy) LoginTypeBlock loginTypeBlock;
@property (nonatomic, copy) LoginComplete loginComplete;
@property (nonatomic, strong) UIButton *auditAppleLoginBtn;
@property (nonatomic, strong) UIImageView *lastLoginImgView;
@property (nonatomic, assign) RXUserType userType;
@property (nonatomic, assign) RXUserType lastLoginUserType;
@property (nonatomic, strong) NSMutableDictionary *userInfo;
@property (nonatomic, assign) BOOL isShow;
@property (nonatomic, assign) BOOL isInit;
@property (nonatomic, assign) BOOL isClick;
@property (nonatomic, assign) NSInteger clickItem;

@end

@implementation RXQuickLoginView

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
        self.backgroundColor = [UIColor clearColor];
        
        self.orientation = [RXUICommonTool getInterfaceOrientation];
        self.loginConfig = loginConfig;
        self.viewType = viewType;
        self.loginTypeBlock = loginEvent;
        self.loginComplete = complete;
        self.loginTypes = [NSMutableArray arrayWithArray:[RXUIUserUtility sharedManager].loginTypes];
        self.clickItem = 0;
        
        // 如果当前是账号密码登录或验证码登录页面，将快捷按钮去掉
        if (viewType == RXUserType_account || viewType == RXUserType_code) {
//            if (self.loginTypes.count > 1) {
//                [self.loginTypes insertObject:@"captchacode" atIndex:1];
//            } else {
//                [self.loginTypes addObject:@"captchacode"];
//            }
//            for (int i = 0; i < self.loginTypes.count; i++) {
//                NSString *type = self.loginTypes[i];
//                if ([type isEqualToString:@"username"]) {
//                    [self.loginTypes removeObjectAtIndex:i];
//                }
//            }
        }
//        if (viewType == RXUserType_code) {
//            for (int i = 0; i < self.loginTypes.count; i++) {
//                NSString *type = self.loginTypes[i];
//                if ([type isEqualToString:@"code"]) {
//                    [self.loginTypes removeObjectAtIndex:i];
//                }
//            }
//        }

        
//        [self setUI];
        [self setUINew];
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

- (void)changeCodeLogin:(NSNotification *)noti
{
    [self fetchClickAction:RXUserType_code];
}

#pragma mark -- <setUI>
- (void)setUI
{
    // 如果当前是账号密码登录或验证码登录页面，将快捷按钮去掉
    if (self.viewType == RXUserType_account) {
        for (int i = 0; i < self.loginTypes.count; i++) {
            NSString *type = self.loginTypes[i];
            if ([type isEqualToString:@"username"]) {
                [self.loginTypes removeObjectAtIndex:i];
                if (i == 0) {
                    i = 0;
                } else {
                    i -= 1;
                }
                [self.loginTypes insertObject:@"captchacode" atIndex:i];
            }
//            if ([type isEqualToString:@"captchacode"]) {
//                if (i == 0) {
//                    i = 0;
//                } else {
//                    i -= 1;
//                }
//                [self.loginTypes insertObject:@"captchacode" atIndex:i];
//            }
        }
    }
    if (self.viewType == RXUserType_code) {
        for (int i = 0; i < self.loginTypes.count; i++) {
            NSString *type = self.loginTypes[i];
            if ([type isEqualToString:@"code"] || [type isEqualToString:@"captchacode"]) {
                [self.loginTypes removeObjectAtIndex:i];
                if (i == 0) {
                    i = 0;
                } else {
                    i -= 1;
                }
                [self.loginTypes insertObject:@"username" atIndex:i];
            }
//            if ([type isEqualToString:@"username"]) {
//                if (i == 0) {
//                    i = 0;
//                } else {
//                    i -= 1;
//                }
//                [self.loginTypes insertObject:@"username" atIndex:i];
//            }
        }
    }
    
    [self addSubview:self.bgView];
    
    NSMutableArray *imageArr = [NSMutableArray array];
    NSMutableArray *titleArr = [NSMutableArray array];
    NSMutableArray *colorArr = [NSMutableArray array];
    NSMutableArray *methodArr = [NSMutableArray array];
    NSString *imageName = @"";
    BOOL isAC = RXAC;
    
    // 审核模式只展示 sign in with apple
    if (_loginConfig.isAudit) {
        self.loginTypes = [NSMutableArray arrayWithArray:@[@"apple"]];
        
        [self.bgView addSubview:self.auditAppleLoginBtn];
        
        self.auditAppleLoginBtn.frame = CGRectMake([RXUICommonTool getScreenWidth] / 2 - 20, RXAC ? 0 : 10, 40, 40);
        
        [self layoutViews];
        return;
    }
    
    NSString *guestTitle = self.loginConfig.guestTitle.length > 0 ? self.loginConfig.guestTitle : @"快速开始";
    
    for (int i = 0; i < self.loginTypes.count; i++) {
        RXUserType userType = [RXUICommonTool getUserType:self.loginTypes[i]];
        switch (userType) {
            case RXUserType_visitor:
            {
//                imageName = isAC ? @"rx_login_visitor" : @"rx_loginRound_visitor";
                imageName = isAC ? @"rx_login_visitor" : @"rx_login_visitor";
                [imageArr addObject:imageName];
                [titleArr addObject:guestTitle];
                [colorArr addObject:@"#3B89FD"];
                [methodArr addObject:@"guest"];
                break;
            }
            case RXUserType_apple:
            {
//                imageName = isAC ? @"rx_login_apple" : @"rx_loginRound_apple";
                imageName = isAC ? @"rx_login_apple" : @"rx_login_apple";
                [imageArr addObject:imageName];
                [titleArr addObject:RXAC ? @"Apple" : @"Apple"];
                [colorArr addObject:@"#000000"];
                [methodArr addObject:@"apple"];
                break;
            }
            case RXUserType_w:
            {
//                imageName = isAC ? @"rx_login_wechat" : @"rx_loginRound_wechat";
                imageName = isAC ? @"rx_login_wechat" : @"rx_login_wechat";
                [imageArr addObject:imageName];
                [titleArr addObject:RXAC ? @"微信" : @"微信"];
                [colorArr addObject:@"#20C0B3"];
                [methodArr addObject:@"wechat"];
                break;
            }
            case RXUserType_auth:
            {
//                imageName = isAC ? @"rx_login_auth" : @"rx_loginRound_auth";
                imageName = isAC ? @"rx_login_auth" : @"rx_login_auth";
                [imageArr addObject:imageName];
                [titleArr addObject:@"一键登录"];
                [colorArr addObject:@"#000000"];
                [methodArr addObject:@"quickphone"];
                break;
            }
            case RXUserType_account:
            {
//                imageName = isAC ? @"rx_login_username" : @"rx_loginRound_username";
                imageName = isAC ? @"rx_login_username" : @"rx_login_username";
                [imageArr addObject:imageName];
//                [titleArr addObject:RXAC ? @"账号/验证码" : @"账号"];
                [titleArr addObject:RXAC ? @"账号" : @"账号"];
                [colorArr addObject:@"#000000"];
                [methodArr addObject:@"username"];
                break;
            }
            case RXUserType_code:
            {
//                imageName = isAC ? @"rx_login_code" : @"rx_loginRound_code";
                imageName = isAC ? @"rx_login_code" : @"rx_login_code";
                [imageArr addObject:imageName];
                [titleArr addObject:RXAC ? @"验证码" : @"验证码"];
                [colorArr addObject:@"#000000"];
                [methodArr addObject:@"captchacode"];
                break;
            }
        }
    }
    
    if (!isAC) {
        CGFloat btnX = 40;
        CGFloat btnSpace = 33;
        // 计算边距 （按钮大小*数量 + 按钮间距*间距数量） / 2
        CGFloat leftX = ([RXUICommonTool getScreenWidth] - ((btnX * imageArr.count) + (btnSpace * (imageArr.count - 1)))) / 2;
        // 按钮数量，超过4个变为更多
        NSInteger btnCount = imageArr.count;
        if (imageArr.count > 4) {
            leftX = ([RXUICommonTool getScreenWidth] - ((btnX * 4) + (btnSpace * 3))) / 2;
            btnCount = 3;
        }
        for (int i = 0; i < btnCount; i++) {
            RXAccountBtnPor *button = [RXAccountBtnPor buttonWithType:UIButtonTypeCustom];
            button.tag = LoginBtnTag + i;
            button.layer.cornerRadius = 20;
            [button setBackgroundColor:[UIColor colorWithHexString:@"#F1F3F7"]];
            [button setImage:[UIImage rxBundleImageNamed:imageArr[i]] forState:UIControlStateNormal];
            [button addTarget:self action:@selector(quickLoginBtnAction:) forControlEvents:UIControlEventTouchUpInside];
            [self.bgView addSubview:button];
            
            UILabel *titleLbl = [[UILabel alloc] init];
            titleLbl.text = titleArr[i];
            titleLbl.textColor = [UIColor blackColor];
            titleLbl.font = [UIFont systemFontOfSize:14 weight:UIFontWeightRegular];
            titleLbl.textAlignment = NSTextAlignmentCenter;
            [self.bgView addSubview:titleLbl];
            
            CGFloat x = leftX + (btnX + btnSpace) * i;
            button.frame = CGRectMake(x, 0, btnX, 40);
            titleLbl.frame = CGRectMake(CGRectGetMinX(button.frame) - 7, CGRectGetMaxY(button.frame) + 8, btnX + 18, 16);
            
            // 更多按钮
            if (imageArr.count > 4 && i == 2) {
                UIButton *moreBtn = [UIButton buttonWithType:UIButtonTypeCustom];
                moreBtn.frame = CGRectMake(x + btnX + btnSpace, 0, btnX, 40);
                [moreBtn setImage:[UIImage rxBundleImageNamed:@"rx_login_moreac"] forState:UIControlStateNormal];
                [moreBtn addTarget:self action:@selector(moreBtnAction) forControlEvents:UIControlEventTouchUpInside];
                [self.bgView addSubview:moreBtn];

                UILabel *moreTitleLbl = [[UILabel alloc] init];
                moreTitleLbl.frame = CGRectMake(CGRectGetMinX(moreBtn.frame), CGRectGetMaxY(moreBtn.frame) + 8, btnX, 16);
                moreTitleLbl.text = @"更多";
                moreTitleLbl.textColor = [UIColor blackColor];
                moreTitleLbl.font = [UIFont systemFontOfSize:14 weight:UIFontWeightRegular];
                moreTitleLbl.textAlignment = NSTextAlignmentCenter;
                [self.bgView addSubview:moreTitleLbl];
                
            }
            
            self.userInfo = [NSMutableDictionary dictionary];
            if ([RXUIUserUtility sharedManager].accounts && [RXUIUserUtility sharedManager].accounts.count > 0) {
                self.userInfo = [RXUIUserUtility sharedManager].accounts[0];
                long loginType = [self.userInfo[@"loginType"] longValue];
                NSString *method = [RXUICommonTool toMethodStr:loginType];
                //                if ([method isEqualToString:methodArr[i]] || ([method isEqualToString:@"captchacode"] && [methodArr[i] isEqualToString:@"username"])) {
                if ([method isEqualToString:methodArr[i]]) {
                    // 上次登录
                    UIImageView *lastLoginImgView = [[UIImageView alloc] init];
                    lastLoginImgView.image = [UIImage rxBundleImageNamed:@"rx_login_last"];
                    [self.bgView addSubview:lastLoginImgView];
                    
                    UILabel *lastLoginLbl = [[UILabel alloc] init];
                    lastLoginLbl.text = @"最近使用";
                    lastLoginLbl.textAlignment = NSTextAlignmentCenter;
                    lastLoginLbl.textColor = [UIColor colorWithHexString:@"#C18C00"];
                    lastLoginLbl.font = [UIFont systemFontOfSize:11];
                    [lastLoginImgView addSubview:lastLoginLbl];
                    
                    lastLoginImgView.frame = CGRectMake(0, 0, 55, 19);
                    
                    CGFloat imgY = 28.5;
                    if (self.userType == RXUserType_account) {
                        imgY = 25;
                    }
                    lastLoginImgView.center = CGPointMake(button.center.x, button.center.y - imgY);
                    
                    lastLoginLbl.frame = CGRectMake(0, 0, CGRectGetWidth(lastLoginImgView.frame), 17);
                    self.lastLoginImgView = lastLoginImgView;
                }
            }
        }
    } else {

        NSInteger btnCount = imageArr.count;
        
        // 拿到总长度
        CGFloat totalW = 0;
        for (int i = 0; i < titleArr.count; i++) {
            NSString *title = titleArr[i];
            CGFloat btnW = 22 + 10 + [title widthForFont:[UIFont systemFontOfSize:16 weight:UIFontWeightRegular]] + 12;
            if (imageArr.count > 4) {
                if (i == 3) break;
            }
            totalW += btnW;
        }
        
        CGFloat lastBtnW = 0;
        for (int i = 0; i < btnCount; i++) {
            NSString *title = titleArr[i];
            // 计算边距 （按钮大小*数量 + 按钮间距*间距数量） / 2
            CGFloat btnW = 22 + 10 + [title widthForFont:[UIFont systemFontOfSize:16 weight:UIFontWeightRegular]] + 12;
            
            CGFloat leftX = ([RXUICommonTool getScreenWidth] - (totalW + (8 * (imageArr.count - 1)))) / 2;
            // 按钮数量，超过4个变为更多
            if (imageArr.count > 4) {
                leftX = ([RXUICommonTool getScreenWidth] - (totalW + (8 * 2) + 17 + 30)) / 2;
                btnCount = 3;
            }
            
            RXAccountBtn *button = [RXAccountBtn buttonWithType:UIButtonTypeCustom];
            button.tag = LoginBtnTag + i;
            button.layer.cornerRadius = 4;
            [button setBackgroundColor:[UIColor colorWithHexString:@"#F1F3F7"]];
            [button setImage:[UIImage rxBundleImageNamed:imageArr[i]] forState:UIControlStateNormal];
            [button setTitle:titleArr[i] forState:UIControlStateNormal];
            button.titleLabel.font = [UIFont systemFontOfSize:16 weight:UIFontWeightRegular];
            [button addTarget:self action:@selector(quickLoginBtnAction:) forControlEvents:UIControlEventTouchUpInside];
            [button setTitleColor:[UIColor colorWithHexString:@"#010101"] forState:UIControlStateNormal];
            [self.bgView addSubview:button];
            
            CGFloat x = leftX + lastBtnW;
            lastBtnW += btnW + 8;
            button.frame = CGRectMake(x, 0, btnW, 41);
            
            // 更多按钮
            if (imageArr.count > 4 && i == 2) {
                UIButton *moreBtn = [UIButton buttonWithType:UIButtonTypeCustom];
                moreBtn.frame = CGRectMake(x + btnW + 15, 0, 41, 41);
                [moreBtn setImage:[UIImage rxBundleImageNamed:@"rx_login_moreac"] forState:UIControlStateNormal];
                [moreBtn addTarget:self action:@selector(moreBtnAction) forControlEvents:UIControlEventTouchUpInside];
                [self.bgView addSubview:moreBtn];
            }
            
            self.userInfo = [NSMutableDictionary dictionary];
            
            if ([RXUIUserUtility sharedManager].accounts && [RXUIUserUtility sharedManager].accounts.count > 0) {
                self.userInfo = [RXUIUserUtility sharedManager].accounts[0];
                long loginType = [self.userInfo[@"loginType"] longValue];
                NSString *method = [RXUICommonTool toMethodStr:loginType];
//                if ([method isEqualToString:methodArr[i]] || ([method isEqualToString:@"captchacode"] && [methodArr[i] isEqualToString:@"username"])) {
                if ([method isEqualToString:methodArr[i]]) {
                    // 上次登录
                    UIImageView *lastLoginImgView = [[UIImageView alloc] init];
                    lastLoginImgView.image = [UIImage rxBundleImageNamed:@"rx_login_last"];
                    [self.bgView addSubview:lastLoginImgView];
                    
                    UILabel *lastLoginLbl = [[UILabel alloc] init];
                    lastLoginLbl.text = @"最近使用";
                    lastLoginLbl.textAlignment = NSTextAlignmentCenter;
                    lastLoginLbl.textColor = [UIColor colorWithHexString:@"#C18C00"];
                    lastLoginLbl.font = [UIFont systemFontOfSize:11];
                    [lastLoginImgView addSubview:lastLoginLbl];
                    
                    lastLoginImgView.frame = CGRectMake(0, 0, 55, 19);
                    
                    CGFloat imgY = 22;
                    if (self.userType == RXUserType_account) {
                        imgY = 17.5;
                    }
                    lastLoginImgView.center = CGPointMake(button.center.x, button.center.y - imgY);
                    
                    lastLoginLbl.frame = CGRectMake(0, 0, CGRectGetWidth(lastLoginImgView.frame), 17);
                    self.lastLoginImgView = lastLoginImgView;
                    
                    self.isShow = YES;
                }
            }
            
            // 创建 CABasicAnimation
//            CABasicAnimation *floatAnimation = [CABasicAnimation animationWithKeyPath:@"position.y"];
//            floatAnimation.fromValue = @(lastLoginImgView.layer.position.y - 3); // 上移 10 点
//            floatAnimation.toValue = @(lastLoginImgView.layer.position.y + 3);   // 下移 10 点
//            floatAnimation.duration = 1.0; // 动画持续时间
//            floatAnimation.autoreverses = YES; // 自动反向
//            floatAnimation.repeatCount = HUGE_VALF; // 无限重复
//
//            // 将动画添加到 UILabel 的图层
//            [lastLoginImgView.layer addAnimation:floatAnimation forKey:@"float"];
        }
    }
    
    [self layoutViews];
}

- (void)setUINew
{
    // 如果当前是账号密码登录或验证码登录页面，将快捷按钮去掉
//    if (self.viewType == RXUserType_account) {
//        BOOL hasAccount = NO;
//        BOOL hasCode = NO;
//        NSInteger accountItem = 0;
//        NSInteger codeItem = 0;
//        for (int i = 0; i < self.loginTypes.count; i++) {
//            NSString *type = self.loginTypes[i];
//            if ([type isEqualToString:@"username"]) {
//                hasAccount = YES;
//                accountItem = i;
////                [self.loginTypes removeObjectAtIndex:i];
////                if (i == 0) {
////                    i = 0;
////                } else {
////                    i -= 1;
////                }
////                [self.loginTypes insertObject:@"captchacode" atIndex:i];
//            }
//            if ([type isEqualToString:@"captchacode"] || [type isEqualToString:@"code"]) {
//                hasCode = YES;
//                codeItem = i;
////                if (i == 0) {
////                    i = 0;
////                } else {
////                    i -= 1;
////                }
////                [self.loginTypes insertObject:@"captchacode" atIndex:i];
//            }
//        }
//        
//        if (hasAccount) {
//            [self.loginTypes removeObjectAtIndex:accountItem];
//        }
//        if (hasCode) {
////            [self.loginTypes insertObject:@"captchacode" atIndex:accountItem];
//        }
//    }
//    
    if (self.viewType == RXUserType_code) {
        BOOL hasAccount = NO;
        BOOL hasCode = NO;
        NSInteger accountItem = 0;
        NSInteger codeItem = 0;
        for (int i = 0; i < self.loginTypes.count; i++) {
            NSString *type = self.loginTypes[i];
            if ([type isEqualToString:@"code"] || [type isEqualToString:@"captchacode"]) {
                hasCode = YES;
                codeItem = i;
//                [self.loginTypes removeObjectAtIndex:i];
//                if (i == 0) {
//                    i = 0;
//                } else {
//                    i -= 1;
//                }
//                [self.loginTypes insertObject:@"username" atIndex:i];
            }
            if ([type isEqualToString:@"username"]) {
                hasAccount = YES;
                accountItem = i;
//                if (i == 0) {
//                    i = 0;
//                } else {
//                    i -= 1;
//                }
//                [self.loginTypes insertObject:@"username" atIndex:i];
            }
        }
        
        if (hasCode) {
            [self.loginTypes removeObjectAtIndex:codeItem];
        }
        if (hasAccount) {
            self.isInit = YES;
//            [self.loginTypes insertObject:@"username" atIndex:codeItem];
        }
    }
    
//    if (self.viewType == RXUserType_auth) {
//        BOOL hasAccount = NO;
//        BOOL hasCode = NO;
//        NSInteger codeItem = 0;
//        for (int i = 0; i < self.loginTypes.count; i++) {
//            NSString *type = self.loginTypes[i];
//            if ([type isEqualToString:@"code"] || [type isEqualToString:@"captchacode"]) {
//                hasCode = YES;
//                codeItem = i;
//            }
//            if ([type isEqualToString:@"username"]) {
//                hasAccount = YES;
//            }
//        }
//        
//        if (hasAccount && hasCode) {
//            [self.loginTypes removeObjectAtIndex:codeItem];
//        }
//    }

    [self addSubview:self.quickBgView];
    [self addSubview:self.bgView];
    
    CGFloat bgW = RXAC ? 16 : 14;
    _quickBgView.frame = CGRectMake(bgW, RXAC ? -8 : -4, [RXUICommonTool getScreenWidth] - bgW * 2, RXAC ? 75 : 69);

    NSMutableArray *imageArr = [NSMutableArray array];
    NSMutableArray *titleArr = [NSMutableArray array];
    NSMutableArray *colorArr = [NSMutableArray array];
    NSMutableArray *methodArr = [NSMutableArray array];
    NSString *imageName = @"";
    BOOL isAC = RXAC;

    // 审核模式只展示 sign in with apple
    if (_loginConfig.isAudit) {
        self.loginTypes = [NSMutableArray arrayWithArray:@[@"apple"]];

        [self.bgView addSubview:self.auditAppleLoginBtn];

        self.auditAppleLoginBtn.frame = CGRectMake([RXUICommonTool getScreenWidth] / 2 - 20, RXAC ? 6 : 10, 40, 40);

        [self layoutViews];
        return;
    }

    NSString *guestTitle = self.loginConfig.guestTitle.length > 0 ? self.loginConfig.guestTitle : @"快速开始";
    for (int i = 0; i < self.loginTypes.count; i++) {
        RXUserType userType = [RXUICommonTool getUserType:self.loginTypes[i]];
        switch (userType) {
            case RXUserType_visitor:
            {
//                imageName = isAC ? @"rx_login_visitor" : @"rx_loginRound_visitor";
                imageName = isAC ? @"rx_login_visitor" : @"rx_login_visitor";
                [imageArr addObject:imageName];
                [titleArr addObject:guestTitle];
                [colorArr addObject:@"#3B89FD"];
                [methodArr addObject:@"guest"];
                break;
            }
            case RXUserType_apple:
            {
//                imageName = isAC ? @"rx_login_apple" : @"rx_loginRound_apple";
                imageName = isAC ? @"rx_login_apple" : @"rx_login_apple";
                [imageArr addObject:imageName];
                [titleArr addObject:RXAC ? @"Apple" : @"Apple"];
                [colorArr addObject:@"#000000"];
                [methodArr addObject:@"apple"];
                break;
            }
            case RXUserType_w:
            {
//                imageName = isAC ? @"rx_login_wechat" : @"rx_loginRound_wechat";
                imageName = isAC ? @"rx_login_wechat" : @"rx_login_wechat";
                [imageArr addObject:imageName];
                [titleArr addObject:RXAC ? @"微信" : @"微信"];
                [colorArr addObject:@"#20C0B3"];
                [methodArr addObject:@"wechat"];
                break;
            }
            case RXUserType_auth:
            {
//                imageName = isAC ? @"rx_login_auth" : @"rx_loginRound_auth";
                imageName = isAC ? @"rx_login_auth" : @"rx_login_auth";
                [imageArr addObject:imageName];
                [titleArr addObject:@"一键登录"];
                [colorArr addObject:@"#000000"];
                [methodArr addObject:@"quickphone"];
                break;
            }
            case RXUserType_account:
            {
//                imageName = isAC ? @"rx_login_username" : @"rx_loginRound_username";
                imageName = isAC ? @"rx_login_username" : @"rx_login_username";
                [imageArr addObject:imageName];
//                [titleArr addObject:RXAC ? @"账号/验证码" : @"账号"];
                [titleArr addObject:RXAC ? @"账号" : @"账号"];
                [colorArr addObject:@"#000000"];
                [methodArr addObject:@"username"];
                break;
            }
            case RXUserType_code:
            {
//                imageName = isAC ? @"rx_login_code" : @"rx_loginRound_code";
                imageName = isAC ? @"rx_login_code" : @"rx_login_code";
                [imageArr addObject:imageName];
                [titleArr addObject:RXAC ? @"验证码" : @"验证码"];
                [colorArr addObject:@"#000000"];
                [methodArr addObject:@"captchacode"];
                break;
            }
        }
    }

    CGFloat btnTitleFont = 16;
    CGFloat guestW = [guestTitle widthForFont:[UIFont systemFontOfSize:btnTitleFont]] + 2;
    
    CGFloat btnX = RXAC ? guestW : guestW;
    CGFloat btnH = RXAC ? 70 : 70;
    CGFloat btnSpace = RXAC ? 0 : 0;
    
    if (guestW <= 50) {
        guestW = 50;
        btnX = RXAC ? 50 : 50;
        btnSpace = RXAC ? 27 : 27;
    } else if (guestW > 50 && guestW < 70) {
        btnSpace = RXAC ? 10 : 10;
    }
    
    if (imageArr.count == 5) {
        btnSpace = RXAC ? 0 : 0;
    }
    
    // 计算边距 （按钮大小*数量 + 按钮间距*间距数量） / 2
    CGFloat leftX = ([RXUICommonTool getScreenWidth] - ((btnX * imageArr.count) + (btnSpace * (imageArr.count - 1)))) / 2;
    // 按钮数量，超过4个变为更多
    NSInteger btnCount = imageArr.count;
    if (imageArr.count > 5) {
        leftX = ([RXUICommonTool getScreenWidth] - ((btnX * 5) + (btnSpace * 4))) / 2;
        btnCount = 4;
    }
    
    
    
    for (int i = 0; i < btnCount; i++) {
        RXAccountBtnNew *button = [RXAccountBtnNew buttonWithType:UIButtonTypeCustom];
        button.tag = LoginBtnTag + i;
        [button setImage:[UIImage rxBundleImageNamed:imageArr[i]] forState:UIControlStateNormal];
        [button setTitle:titleArr[i] forState:normal];
        [button setTitleColor:[UIColor colorWithHexString:@"#555555"] forState:normal];
        button.titleLabel.textAlignment = NSTextAlignmentCenter;
        button.titleLabel.font = [UIFont systemFontOfSize:btnTitleFont];
        [button addTarget:self action:@selector(quickLoginBtnAction:) forControlEvents:UIControlEventTouchUpInside];
        [self.bgView addSubview:button];

        CGFloat x = leftX + (btnX + btnSpace) * i;
        button.frame = CGRectMake(x, 0, btnX, btnH);

        // 更多按钮
        if (imageArr.count > 5 && i == 2) {
            UIButton *moreBtn = [UIButton buttonWithType:UIButtonTypeCustom];
            moreBtn.frame = CGRectMake(x + btnX + btnSpace, 0, btnX, btnH);
            [moreBtn setImage:[UIImage rxBundleImageNamed:@"rx_login_moreac"] forState:UIControlStateNormal];
            [moreBtn addTarget:self action:@selector(moreBtnAction) forControlEvents:UIControlEventTouchUpInside];
            [self.bgView addSubview:moreBtn];

            UILabel *moreTitleLbl = [[UILabel alloc] init];
            moreTitleLbl.frame = CGRectMake(CGRectGetMinX(moreBtn.frame), CGRectGetMaxY(moreBtn.frame) + 8, btnX, 16);
            moreTitleLbl.text = @"更多";
            moreTitleLbl.textColor = [UIColor blackColor];
            moreTitleLbl.font = [UIFont systemFontOfSize:16 weight:UIFontWeightRegular];
            moreTitleLbl.textAlignment = NSTextAlignmentCenter;
            [self.bgView addSubview:moreTitleLbl];

        }

        self.userInfo = [NSMutableDictionary dictionary];
        if ([RXUIUserUtility sharedManager].accounts && [RXUIUserUtility sharedManager].accounts.count > 0) {
            self.userInfo = [RXUIUserUtility sharedManager].accounts[0];
            long loginType = [self.userInfo[@"loginType"] longValue];
            NSString *method = [RXUICommonTool toMethodStr:loginType];
            
            BOOL isShowTip = [method isEqualToString:methodArr[i]];
            if (self.viewType == RXUserType_auth) {
//                isShowTip = [method isEqualToString:methodArr[i]] || ([method isEqualToString:@"captchacode"] && [methodArr[i] isEqualToString:@"username"]);
            }
//            if ([method isEqualToString:methodArr[i]] || ([method isEqualToString:@"captchacode"] && [methodArr[i] isEqualToString:@"username"])) {
//            if ([method isEqualToString:methodArr[i]]) {
            if (isShowTip) {
                self.lastLoginUserType = [RXUICommonTool getUserType:method];
                // 上次登录
                UIImageView *lastLoginImgView = [[UIImageView alloc] init];
                lastLoginImgView.image = [UIImage rxBundleImageNamed:@"rx_login_last"];
                [self.bgView addSubview:lastLoginImgView];

                UILabel *lastLoginLbl = [[UILabel alloc] init];
                lastLoginLbl.text = @"最近使用";
                lastLoginLbl.textAlignment = NSTextAlignmentCenter;
                lastLoginLbl.textColor = [UIColor colorWithHexString:@"#C18C00"];
                lastLoginLbl.font = [UIFont systemFontOfSize:11];
                [lastLoginImgView addSubview:lastLoginLbl];

                lastLoginImgView.frame = CGRectMake(0, 0, 55, 19);

                CGFloat imgY = 34.5;
                if (self.userType == RXUserType_account) {
//                    imgY = 25;
                }
                lastLoginImgView.center = CGPointMake(button.center.x, button.center.y - imgY);

                lastLoginLbl.frame = CGRectMake(0, 0, CGRectGetWidth(lastLoginImgView.frame), 17);
                self.lastLoginImgView = lastLoginImgView;
            }
        }
    }

    [self layoutViews];
}

// 创建无限重复动画方法
- (void)startInfiniteAnimationForLabel:(UIImageView *)label
{
    if (self.lastLoginImgView) {
        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
            CABasicAnimation *animation = [CABasicAnimation animationWithKeyPath:@"position.y"];
            animation.fromValue = @(self.lastLoginImgView.layer.position.y);
            animation.toValue = @(self.lastLoginImgView.layer.position.y - 3);
            animation.duration = 0.4;
            animation.autoreverses = YES; // 自动反转动画
            animation.repeatCount = HUGE_VALF; // 无限循环
            [self.lastLoginImgView.layer addAnimation:animation forKey:@"bounce"];
        });
    }
    
//    [UIView animateWithDuration:0.4
//                          delay:0
//                        options:UIViewAnimationOptionCurveEaseInOut
//                     animations:^{
//        // 设置平移动画 - 假设水平位移 20 点
//        self.lastLoginImgView.transform = CGAffineTransformTranslate(self.lastLoginImgView.transform, 0, 3);
//    }
//                     completion:^(BOOL finished) {
//        // 反向平移回原位
//        [UIView animateWithDuration:0.4
//                              delay:0
//                            options:UIViewAnimationOptionCurveEaseInOut
//                         animations:^{
//            self.lastLoginImgView.transform = CGAffineTransformTranslate(self.lastLoginImgView.transform, 0, -3);
//        }
//                         completion:^(BOOL finished) {
//            if (finished) {
//                // 递归调用实现无限重复
//                [self startInfiniteAnimationForLabel:self.lastLoginImgView];
//            }
//        }];
//    }];
}

// 停止动画
- (void)stopAnimation
{
    [self.lastLoginImgView.layer removeAnimationForKey:@"bounce"];
}

- (void)layoutViews
{
    self.bgView.frame = CGRectMake(0, 0, CGRectGetWidth(self.frame) + 100, 40);
    
    [self layoutSubviews];
}

- (void)refreshUIWithViewType:(RXUserType)viewType
{
//    if (self.isShow) {
//        return;
//    }
    self.userType = viewType;
    
//    self.clickItem = 0;
    // 如果当前是账号密码登录或验证码登录页面，将快捷按钮去掉
    if (self.viewType == RXUserType_account) {
        BOOL hasAccount = NO;
        BOOL hasCode = NO;
        NSInteger accountItem = 0;
        NSInteger codeItem = 0;
        for (int i = 0; i < self.loginTypes.count; i++) {
            NSString *type = self.loginTypes[i];
            if ([type isEqualToString:@"username"]) {
                hasAccount = YES;
                accountItem = i;
//                [self.loginTypes removeObjectAtIndex:i];
//                if (i == 0) {
//                    i = 0;
//                } else {
//                    i -= 1;
//                }
//                [self.loginTypes insertObject:@"captchacode" atIndex:i];
            }
            if ([type isEqualToString:@"captchacode"] || [type isEqualToString:@"code"]) {
                hasCode = YES;
                codeItem = i;
//                if (i == 0) {
//                    i = 0;
//                } else {
//                    i -= 1;
//                }
//                [self.loginTypes insertObject:@"captchacode" atIndex:i];
            }
        }
        
        if (hasAccount) {
            [self.loginTypes removeObjectAtIndex:accountItem];
        }
        if (!self.isClick) {
            self.clickItem = accountItem;
            self.isClick = YES;
        }
        if (self.isInit) {
            BOOL hasCodeNormal = NO;
            for (int i = 0; i < [RXUIUserUtility sharedManager].loginTypes.count; i++) {
                if ([[RXUIUserUtility sharedManager].loginTypes[i] isEqualToString:@"captchacode"] || [[RXUIUserUtility sharedManager].loginTypes[i] isEqualToString:@"code"]) {
                    hasCodeNormal = YES;
                }
            }
            if (hasCodeNormal) {
                [self.loginTypes insertObject:@"captchacode" atIndex:self.clickItem];
            }
//            [self.loginTypes insertObject:@"captchacode" atIndex:accountItem];
        }
    }
    
    self.isInit = YES;
    
    if (self.viewType == RXUserType_code) {
        BOOL hasAccount = NO;
        BOOL hasCode = NO;
        NSInteger accountItem = 0;
        NSInteger codeItem = 0;
        for (int i = 0; i < self.loginTypes.count; i++) {
            NSString *type = self.loginTypes[i];
            if ([type isEqualToString:@"code"] || [type isEqualToString:@"captchacode"]) {
                hasCode = YES;
                codeItem = i;
                //                [self.loginTypes removeObjectAtIndex:i];
                //                if (i == 0) {
                //                    i = 0;
                //                } else {
                //                    i -= 1;
                //                }
                //                [self.loginTypes insertObject:@"username" atIndex:i];
            }
            if ([type isEqualToString:@"username"]) {
                hasAccount = YES;
                accountItem = i;
                //                if (i == 0) {
                //                    i = 0;
                //                } else {
                //                    i -= 1;
                //                }
                //                [self.loginTypes insertObject:@"username" atIndex:i];
                //            }
            }
        }
        
        if (hasCode) {
            [self.loginTypes removeObjectAtIndex:codeItem];
        }
        if (!self.isClick) {
            self.clickItem = accountItem;
            self.isClick = YES;
        }
        if (self.isInit) {
            BOOL hasCodeNormal = NO;
            for (int i = 0; i < [RXUIUserUtility sharedManager].loginTypes.count; i++) {
                if ([[RXUIUserUtility sharedManager].loginTypes[i] isEqualToString:@"username"]) {
                    hasCodeNormal = YES;
                }
            }
            if (hasCodeNormal) {
                if (self.clickItem == self.loginTypes.count + 1) {
                    self.clickItem -= 1;
                }
                [self.loginTypes insertObject:@"username" atIndex:self.clickItem];
            }
            //            [self.loginTypes insertObject:@"username" atIndex:codeItem];
        }
    }
    
    // 如果当前是账号密码登录或验证码登录页面，将快捷按钮去掉
//    if (viewType == RXUserType_account) {
//        for (int i = 0; i < self.loginTypes.count; i++) {
//            NSString *type = self.loginTypes[i];
//            if ([type isEqualToString:@"username"]) {
//                [self.loginTypes removeObjectAtIndex:i];
//                
//                [self.loginTypes insertObject:@"captchacode" atIndex:0];
//            }
//        }
//        
//        // 如果原来有username或code或auth方式重新插入
//        BOOL needInsert = YES;
//        for (int i = 0; i < [RXUIUserUtility sharedManager].loginTypes.count; i++) {
//            if ([[RXUIUserUtility sharedManager].loginTypes[i] isEqualToString:@"code"]) {
//                for (int j = 0; j < self.loginTypes.count; j++) {
//                    NSString *type = self.loginTypes[j];
//                    if ([type isEqualToString:@"code"]) {
//                        needInsert = NO;
//                    }
//                }
//                if (needInsert) {
//                    if (i == 0) {
//                        i = 0;
//                    } else {
//                        i -= 1;
//                    }
//                    [self.loginTypes insertObject:@"code" atIndex:i];
//                }
//            }
//        }
//    }
//    if (viewType == RXUserType_code) {
//        for (int i = 0; i < self.loginTypes.count; i++) {
//            NSString *type = self.loginTypes[i];
//            if ([type isEqualToString:@"code"] || [type isEqualToString:@"captchacode"]) {
//                [self.loginTypes removeObjectAtIndex:i];
//                
//                [self.loginTypes insertObject:@"username" atIndex:0];
//            }
//        }
//        
//        // 如果原来有username或code或auth方式重新插入
//        BOOL needInsert = YES;
//        for (int i = 0; i < [RXUIUserUtility sharedManager].loginTypes.count; i++) {
//            if ([[RXUIUserUtility sharedManager].loginTypes[i] isEqualToString:@"username"]) {
//                for (int j = 0; j < self.loginTypes.count; j++) {
//                    NSString *type = self.loginTypes[j];
//                    if ([type isEqualToString:@"username"]) {
//                        needInsert = NO;
//                    }
//                }
//                if (needInsert) {
//                    if (i == 0) {
//                        i = 0;
//                    } else {
//                        i -= 1;
//                    }
//                    [self.loginTypes insertObject:@"username" atIndex:i];
//                }
//            }
//        }
//    }
    if (viewType == RXUserType_auth) {
        for (int i = 0; i < self.loginTypes.count; i++) {
            NSString *type = self.loginTypes[i];
            if ([type isEqualToString:@"auth"] || [type isEqualToString:@"quickphone"]) {
                [self.loginTypes removeObjectAtIndex:i];
            }
        }
    }
    
    for (UIView *subview in self.bgView.subviews) {
        [subview removeFromSuperview];
    }
    if (self.loginTypes.count <= 0) {
        [[NSNotificationCenter defaultCenter] postNotificationName:RXUINoti_refreshLoginUI object:nil userInfo:nil];
    }
//    [self setUI];
    [self setUINew];
}

#pragma mark -- <actions>
- (void)auditAppleLoginAction:(UIButton *)btn
{
    // 用户行为上报
    NSMutableDictionary *thirdRes = [NSMutableDictionary dictionary];
    [thirdRes setValue:@"apple" forKey:@"method"];
    [[RXUserActionLogManager sharedSDK] addUserActionWithScene:@"login" action:@"click" properties:thirdRes];
    
    if (self.clickBlock) {
        self.clickBlock(LoginTypeApple);
    }
}

- (void)quickLoginBtnAction:(UIButton *)btn
{
    NSInteger i = btn.tag - LoginBtnTag;
    RXUserType userType = [RXUICommonTool getUserType:self.loginTypes[i]];
    
    [RXUIUserUtility sharedManager].isClickQuickAuth = YES;
    
    [self fetchClickAction:userType];
    
    // 用户行为上报
    NSString *method = self.loginTypes[i];
    if ([method isEqualToString:@"apple"] ||
        [method isEqualToString:@"wechat"] ||
        [method isEqualToString:@"guest"]) {
        
        NSMutableDictionary *thirdRes = [NSMutableDictionary dictionary];
        [thirdRes setValue:method forKey:@"method"];
        [[RXUserActionLogManager sharedSDK] addUserActionWithScene:@"login" action:@"click" properties:thirdRes];
    }
}

- (void)fetchClickAction:(RXUserType)userType
{
//    if (self.viewType == RXUserType_auth && self.lastLoginUserType == RXUserType_code) {
//        userType = RXUserType_code;
//    }
    
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
            for (UIView *subView in [UIApplication sharedApplication].keyWindow.subviews) {
                if ([subView isKindOfClass:[RXUIAuthLoginView class]]) {
                    RXUIAuthLoginView *authLoginView = (RXUIAuthLoginView *)subView;
//                    loginView.codeLoginBtn.selected = !loginView.codeLoginBtn.selected;
                    [[UIApplication sharedApplication].keyWindow bringSubviewToFront:authLoginView];
//                    [self refreshUIWithViewType:self.viewType];
                    return;
                }
            }
            
            if ([RXUIUserUtility sharedManager].isAuthFirst && [RXUIUserUtility sharedManager].isAuthShow) {
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
            }
            
            break;
//            return;
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
                    [loginView codeLoginBtnAction:loginView.codeLoginBtn];
                    
                    NSMutableDictionary *userInfo = self.userInfo;
                    if (userInfo && userInfo.allKeys.count > 0) {
                        long loginType = [userInfo[@"loginType"] longValue];
                        NSString *method = [RXUICommonTool toMethodStr:loginType];
    //                    if ([method isEqualToString:@"captchacode"]) {
    //                        if (userInfo[@"username"]) {
    //                            loginView.username = userInfo[@"username"];
    //                        }
    //
    ////                        self.loginConfig.loginViewType = 1;
    ////                        loginView.codeLoginBtn.selected = NO;
    ////                        [loginView codeLoginBtnAction:loginView.codeLoginBtn];
    //                    }
                        if ([method isEqualToString:@"username"]) {
                            if (loginView.username.length > 0) {
                                loginView.username = @"";
                            } else {
                                if (userInfo[@"username"]) {
                                    loginView.username = userInfo[@"username"];
                                }
                            }
                            
                            if (!loginView.isChange) {
                                if (userInfo[@"username"]) {
                                    loginView.username = userInfo[@"username"];
                                }
                            }
                        }
                    }
//                    [loginView removeFromSuperview];
//                    UIView *window = [UIApplication sharedApplication].keyWindow;
//                    for (UIView *v in window.subviews) {
//                        if (v.tag == 200000) {
//                            [v removeFromSuperview];
//                        }
//                    }
                    [self startInfiniteAnimationForLabel:nil];
                    return;
                }
            }
            if (!hasAccount) {
                NSMutableDictionary *userInfo = self.userInfo;
                
                RXLoginView *loginView = [[RXLoginView alloc] initWithConfig:self.loginConfig loginEvent:self.loginTypeBlock complete:self.loginComplete];
                
                if (userInfo && userInfo.allKeys.count > 0) {
                    long loginType = [userInfo[@"loginType"] longValue];
                    NSString *method = [RXUICommonTool toMethodStr:loginType];
//                    if ([method isEqualToString:@"captchacode"]) {
//                        if (userInfo[@"username"]) {
//                            loginView.username = userInfo[@"username"];
//                        }
//                        
////                        self.loginConfig.loginViewType = 1;
////                        loginView.codeLoginBtn.selected = NO;
////                        [loginView codeLoginBtnAction:loginView.codeLoginBtn];
//                    }
                    if ([method isEqualToString:@"username"]) {
                        if (userInfo[@"username"]) {
                            loginView.username = userInfo[@"username"];
                        }
                    }
                    
                }
                if (self.viewType == RXUserType_auth) {
                    if (self.isFirstViewLoad) {
                        loginView.isShowBack = NO;
                    } else {
                        loginView.isShowBack = NO;
                    }
                }
                [self startInfiniteAnimationForLabel:nil];
            }
            
            if (![RXUIUserUtility sharedManager].isAuthFirst) {
                [[NSNotificationCenter defaultCenter] postNotificationName:RXUINoti_closeAuthView object:nil userInfo:nil];
            }
            
            for (UIView *subViews in [UIApplication sharedApplication].keyWindow.subviews) {
                if ([subViews isKindOfClass:[RXUIAuthLoginFailView class]]) {
                    RXUIAuthLoginFailView *subView = (RXUIAuthLoginFailView *)subViews;
                    [subView hide];
                }
            }
            
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
                    if ([RXUIUserUtility sharedManager].username.length > 0) {
                        loginView.username = [RXUIUserUtility sharedManager].username;
                    }
                    
                    [loginView codeLoginBtnAction:loginView.codeLoginBtn];
                    
                    NSMutableDictionary *userInfo = self.userInfo;
                    if (userInfo && userInfo.allKeys.count > 0) {
                        long loginType = [userInfo[@"loginType"] longValue];
                        NSString *method = [RXUICommonTool toMethodStr:loginType];
    //                    if ([method isEqualToString:@"captchacode"]) {
    //                        if (userInfo[@"username"]) {
    //                            loginView.username = userInfo[@"username"];
    //                        }
    //
    ////                        self.loginConfig.loginViewType = 1;
    ////                        loginView.codeLoginBtn.selected = NO;
    ////                        [loginView codeLoginBtnAction:loginView.codeLoginBtn];
    //                    }
                        if ([method isEqualToString:@"captchacode"]) {
                            if (userInfo[@"username"]) {
                                if (loginView.username.length > 0) {
                                    loginView.username = @"";
                                } else {
                                    if (userInfo[@"username"]) {
                                        loginView.username = userInfo[@"username"];
                                    }
                                }
                                
                                if (!loginView.isChange) {
                                    if (userInfo[@"username"]) {
                                        loginView.username = userInfo[@"username"];
                                    }
                                }
                            }
                        }
                        
                    }
//                    [loginView removeFromSuperview];
//                    UIView *window = [UIApplication sharedApplication].keyWindow;
//                    for (UIView *v in window.subviews) {
//                        if (v.tag == 200000) {
//                            [v removeFromSuperview];
//                        }
//                    }
                    [self startInfiniteAnimationForLabel:nil];
                    return;
                }
            }
            if (!hasAccount) {
                RXLoginView *loginView = [[RXLoginView alloc] initWithConfig:self.loginConfig loginEvent:self.loginTypeBlock complete:self.loginComplete];
                NSMutableDictionary *userInfo = self.userInfo;
                
                if (userInfo && userInfo.allKeys.count > 0) {
                    long loginType = [userInfo[@"loginType"] longValue];
                    NSString *method = [RXUICommonTool toMethodStr:loginType];
                    if ([method isEqualToString:@"captchacode"]) {
                        if (userInfo[@"username"]) {
                            if (loginView.username.length > 0) {
                                loginView.username = @"";
                            } else {
                                if (userInfo[@"username"]) {
                                    loginView.username = userInfo[@"username"];
                                }
                            }
                            
                            if (!loginView.isChange) {
                                if (userInfo[@"username"]) {
                                    loginView.username = userInfo[@"username"];
                                }
                            }
                        }
                    } else if ([method isEqualToString:@"username"]) {
                        loginView.username = @"";
                    }
                }
                
//                if (userInfo && userInfo.allKeys.count > 0) {
//                    userInfo = [RXUIUserUtility sharedManager].accounts[0];
//                    if (userInfo[@"username"]) {
//                        loginView.username = userInfo[@"username"];
//                    }
//                }
//                if ([RXUIUserUtility sharedManager].username.length > 0) {
//                    loginView.username = [RXUIUserUtility sharedManager].username;
//                }
                
//                if (userInfo && userInfo.allKeys.count > 0) {
//                    long loginType = [userInfo[@"loginType"] longValue];
//                    NSString *method = [RXUICommonTool toMethodStr:loginType];
//                    if ([method isEqualToString:@"username"]) {
//                        loginView.username = @"";
//                    }
//                }
                [self startInfiniteAnimationForLabel:nil];
            }
            
            if (![RXUIUserUtility sharedManager].isAuthFirst) {
                [[NSNotificationCenter defaultCenter] postNotificationName:RXUINoti_closeAuthView object:nil userInfo:nil];
            }
            
            for (UIView *subViews in [UIApplication sharedApplication].keyWindow.subviews) {
                if ([subViews isKindOfClass:[RXUIAuthLoginFailView class]]) {
                    RXUIAuthLoginFailView *subView = (RXUIAuthLoginFailView *)subViews;
                    [subView hide];
                }
            }
            
            return;
        }
    }
    
    if (self.clickBlock) {
        self.clickBlock(loginType);
    }
}

- (void)moreBtnAction
{
    self.loginConfig.loginTypes = self.loginTypes;
    RXMoreLoginView *moreLoginView = [[RXMoreLoginView alloc] initWithLoginConfig:self.loginConfig viewType:self.viewType loginEvent:self.loginTypeBlock complete:self.loginComplete];
    moreLoginView.clickBlock = self.clickBlock;
}

#pragma mark -- <lazy>
- (UIView *)bgView
{
    if (!_bgView) {
        _bgView = [[UIView alloc] init];
        _bgView.backgroundColor = [UIColor clearColor];
        _bgView.layer.cornerRadius = 4;
    }
    return _bgView;
}

- (UIButton *)auditAppleLoginBtn
{
    if (!_auditAppleLoginBtn) {
        _auditAppleLoginBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_auditAppleLoginBtn setImage:[UIImage rxBundleImageNamed:@"rx_sign_in_with_apple"] forState:normal];
        [_auditAppleLoginBtn addTarget:self action:@selector(auditAppleLoginAction:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _auditAppleLoginBtn;
}

- (UIView *)quickBgView
{
    if (!_quickBgView) {
        _quickBgView = [[UIView alloc] init];
        _quickBgView.layer.cornerRadius = 4;
        _quickBgView.backgroundColor = [[UIColor colorWithHexString:@"#CFE7E5"] colorWithAlphaComponent:0.23];
        _quickBgView.hidden = YES;
    }
    return _quickBgView;
}

@end
