//
//  RXOSHistoryLoginView.m
//  RXUIKit
//
//  Created by 陈汉 on 2023/3/17.
//

#import "RXOSHistoryLoginView.h"
#import "RXOSCommonTool.h"
#import "RXOSAttributeLabel.h"
#import "RXOSPrivacyView.h"
#import "RXOSPriView.h"
#import "RXOSCommonWKWebView.h"
#import "RXOSGetBackPasswordView.h"
#import "RXOSLoginViewManager.h"
#import "RXOSQuickLoginView.h"
#import "RXOSHistoryListLoginView.h"
#import "RXOSLoginView.h"
#import <RXSDK_Pure/RXErrorTool.h>
#import "RXOSCloseBtn.h"
#import "RXOSMoreLoginView.h"
#import "RXOSEmailLoginView.h"

#define LoginBtnTag 100000

@interface RXOSHistoryLoginView () <RXOSAttributeLabelDelegate>

@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) UILabel *titleLbl;
@property (nonatomic, strong) RXOSCloseBtn *closeBtn;
@property (nonatomic, strong) UIButton *selectBtn;
@property (nonatomic, strong) RXOSAttributeLabel *priLbl;
@property (nonatomic, assign) NSInteger orientation;  // 屏幕方向 1竖屏 2横屏
@property (nonatomic, assign) BOOL isSelect;
@property (nonatomic, copy) LoginTypeBlock loginTypeBlock;
@property (nonatomic, copy) LoginComplete loginComplete;
@property (nonatomic, strong) UIButton *loginBtn;
@property (nonatomic, strong) RXOSUILoginConfig *loginConfig;
@property (nonatomic, strong) UIButton *moreLoginBtn;

@property (nonatomic, strong) UIImageView *logoImageView;
@property (nonatomic, strong) UIImage *logoImage;
@property (nonatomic, strong) RXOSQuickLoginView *quickLoginView;
@property (nonatomic, strong) UIView *accountView;
@property (nonatomic, strong) NSMutableDictionary *selectUserInfo;

@property (nonatomic, strong) NSMutableArray *loginTypes;

@end

@implementation RXOSHistoryLoginView

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (instancetype)initWithConfig:(RXOSUILoginConfig *)config
                    loginEvent:(NSDictionary *(^)(NSDictionary *loginEvent, LoginType loginType))loginEvent
                      complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    self = [super initWithFrame:CGRectMake(0, 0, [UIApplication sharedApplication].keyWindow.frame.size.width, [UIApplication sharedApplication].keyWindow.frame.size.height)];
    if (self) {
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
        [[UIApplication sharedApplication].keyWindow addSubview:self];
        
        UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tapAction:)];
        [self addGestureRecognizer:tap];
        
        self.orientation = [RXOSCommonTool getInterfaceOrientation];
        self.loginConfig = config;
        self.loginTypes = [NSMutableArray arrayWithArray:[RXOSUserUtility sharedManager].loginTypes];
        
//        self.logoImg = applogo;
//        self.addAccountBlock = addAccount;
        self.loginTypeBlock = loginEvent;
        self.loginComplete = complete;
        self.logoImage = config.logoImage;
        
        [self setUI];
        
        [self show];
        
        if (config.isShowClose) {
            self.closeBtn.hidden = NO;
        } else {
            self.closeBtn.hidden = YES;
        }
        
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(accountLoginAction:) name:RXUINoti_accountLogin object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(codeLoginAction:) name:RXUINoti_codeLogin object:nil];
    }
    return self;
}

#pragma mark -- <notifications>
- (void)accountLoginAction:(NSNotification *)noti
{
    NSDictionary *userInfo = noti.userInfo;
    
    NSString *username = userInfo[@"username"];
    
    if ([RXOSCommonTool validateEmail:username]) {
        self.loginConfig.loginViewType = 1;
        RXOSEmailLoginView *loginView = [[RXOSEmailLoginView alloc] initWithConfig:self.loginConfig loginEvent:self.loginTypeBlock complete:self.loginComplete];
        loginView.username = username;
    } else {
        self.loginConfig.loginViewType = 0;
        RXOSLoginView *loginView = [[RXOSLoginView alloc] initWithConfig:self.loginConfig loginEvent:self.loginTypeBlock complete:self.loginComplete];
        loginView.username = username;
    }
}

- (void)codeLoginAction:(NSNotification *)noti
{
    NSDictionary *userInfo = noti.userInfo;
    
    NSString *username = userInfo[@"username"];
    
    if ([RXOSCommonTool validateEmail:username]) {
        self.loginConfig.loginViewType = 0;
        RXOSEmailLoginView *loginView = [[RXOSEmailLoginView alloc] initWithConfig:self.loginConfig loginEvent:self.loginTypeBlock complete:self.loginComplete];
        loginView.username = username;
    } else {
        self.loginConfig.loginViewType = 1;
        RXOSLoginView *loginView = [[RXOSLoginView alloc] initWithConfig:self.loginConfig loginEvent:self.loginTypeBlock complete:self.loginComplete];
        loginView.isReLogin = YES;
        loginView.username = username;
    }
}

- (void)tapAction:(UITapGestureRecognizer *)tap
{
    [self endEditing:YES];
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

#pragma mark -- <setUI>
- (void)setUI
{
    [self addSubview:self.bgView];
    [self.bgView addSubview:self.closeBtn];
    [self.bgView addSubview:self.titleLbl];
    [self.bgView addSubview:self.logoImageView];
    [self.bgView addSubview:self.loginBtn];
    [self.bgView addSubview:self.selectBtn];
    [self.bgView addSubview:self.priLbl];
    [self.bgView addSubview:self.moreLoginBtn];
    
    [self layoutViews];
}

- (void)layoutViews
{
    UIView *window = [UIApplication sharedApplication].keyWindow;
    
    _bgView.frame = CGRectMake(0, 0, [RXOSCommonTool getScreenWidth], RXAC ? 224 : 248);
    _bgView.center = window.center;
    
//    if (self.logoImage) {
    _titleLbl.hidden = YES;
    _logoImageView.hidden = NO;
    _logoImageView.frame = CGRectMake(CGRectGetWidth(_bgView.frame) / 2 - 108 / 2, RXAC ? 16 : 24, 108, 25);
    if ([self.logoImage isKindOfClass:[UIImage class]]) {    
        _logoImageView.image = self.logoImage;
    } else {
        _logoImageView.image = [RXOSCommonTool getImageFromURL:(NSString *)self.logoImage];
    }
//    } else {
//        _titleLbl.hidden = NO;
//        _logoImageView.hidden = YES;
//        _titleLbl.frame = CGRectMake(0, 20, CGRectGetWidth(_bgView.frame), 26);
//    }
    
    if (!_accountView) {
        self.accountView = [self setAccountView];
    }
    
//    _selectBtn.frame = CGRectMake(RXAC ? 44 : 27, CGRectGetMaxY(self.accountView.frame) + 22, 12, 12);
//
//    _priLbl.frame = CGRectMake(CGRectGetMaxX(_selectBtn.frame), CGRectGetMaxY(self.accountView.frame) + 13, 233, 40);
    
    _loginBtn.frame = CGRectMake(RXAC ? 29 : 25, CGRectGetMaxY(self.accountView.frame) + 14, CGRectGetWidth(_bgView.frame) - (RXAC ? 58 : 50), RXAC ? 43 : 48);
    
    if ([RXOSCommonTool isRTL]) {
        _closeBtn.frame = CGRectMake(RXAC ? 24 : 28, RXAC ? 12 : 16, 28, 28);
    } else {
        _closeBtn.frame = CGRectMake(CGRectGetWidth(_bgView.frame) - (RXAC ? 24 + 28 : 28 + 20), RXAC ? 12 : 16, 28, 28);
    }
    
    _moreLoginBtn.frame = CGRectMake(CGRectGetWidth(_bgView.frame) / 2 - 126, RXAC ? 171 : 195, 252, 34);
    
    if (self.loginConfig.isShowClose) {
        self.closeBtn.hidden = NO;
    } else {
        self.closeBtn.hidden = YES;
    }
    
    // 底部快速登录按钮
//    RXOSQuickLoginView *quickLoginView = [[RXOSQuickLoginView alloc] initWithLoginConfig:self.loginConfig viewType:RXUserType_history loginEvent:self.loginTypeBlock complete:self.loginComplete];
//    quickLoginView.frame = CGRectMake(0, CGRectGetMaxY(_loginBtn.frame) + 26, 344, 40);
//    __weak __typeof__(self) weakSelf = self;
//    quickLoginView.clickBlock = ^(LoginType loginType) {
//        if (!weakSelf.isSelect && loginType != LoginTypeAuth) {
//            RXOSPriView *priView = [[RXOSPriView alloc] init];
//            priView.agreeBlock = ^{
//                NSDictionary *loginExt = [NSDictionary dictionary];
//                if (weakSelf.loginTypeBlock) {
//                    loginExt = weakSelf.loginTypeBlock(loginExt, loginType);
//                    [[RXOSLoginViewManager sharedSDK] fetchLoginEvent:loginType loginInfo:loginExt complete:self.loginComplete];
//                }
//            };
//        } else {
//            NSDictionary *loginExt = [NSDictionary dictionary];
//            if (weakSelf.loginTypeBlock) {
//                loginExt = weakSelf.loginTypeBlock(loginExt, loginType);
//                [[RXOSLoginViewManager sharedSDK] fetchLoginEvent:loginType loginInfo:loginExt complete:self.loginComplete];
//            }
//        }
//    };
//    [self.bgView addSubview:quickLoginView];

    [self layoutSubviews];
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

- (UIView *)setAccountView
{
    NSMutableDictionary *userInfo = [RXOSUserUtility sharedManager].accounts[0];
    self.selectUserInfo = [NSMutableDictionary dictionaryWithDictionary:userInfo];
    
    UIView *accountView = [[UIView alloc] init];
    accountView.backgroundColor = [UIColor clearColor];
    accountView.layer.borderColor = [UIColor colorWithHexString:@"#E2F2F1"].CGColor;
    accountView.layer.borderWidth = 1;
    accountView.layer.cornerRadius = 6;
    [self.bgView addSubview:accountView];
    
    UIImageView *leftImgView = [[UIImageView alloc] init];
    leftImgView.tag = 90000;
    leftImgView.image = [UIImage rxOSBundleImageNamed:[RXOSCommonTool getIconWithLoginType:[userInfo[@"loginType"] integerValue] username:userInfo[@"username"]]];
    [accountView addSubview:leftImgView];
    
    UILabel *titleLbl = [[UILabel alloc] init];
    titleLbl.tag = 90001;
    
    NSString *nickname = userInfo[@"nickname"];
    long loginType = [userInfo[@"loginType"] longValue];
    if ((loginType == 1 || loginType == 10) && [[nickname substringToIndex:1] isEqualToString:@"+"]) {
        nickname = [RXOSCommonTool usernameSec:nickname];
        if (nickname.length > 4) {
            NSInteger zeroCount = 0;
            for (int i = 1; i < 5; i++) {
                NSString *subStr = [nickname substringWithRange:NSMakeRange(i, 1)];
                if ([subStr isEqualToString:@"0"]) {
                    zeroCount++;
                } else {
                    break;
                }
            }
            if (zeroCount > 0) {
                nickname = [nickname stringByReplacingCharactersInRange:NSMakeRange(1, zeroCount) withString:@""];
            }
        }
    }
    
    titleLbl.text = nickname;
    
    titleLbl.textColor = [UIColor blackColor];
    titleLbl.font = [UIFont systemFontOfSize:16 weight:UIFontWeightRegular];
    [accountView addSubview:titleLbl];
    
    UIImageView *rightImgView = [[UIImageView alloc] init];
    rightImgView.image = [UIImage rxOSBundleImageNamed:@"rx_login_change"];
    rightImgView.userInteractionEnabled = YES;
    UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(historyListAction)];
    [rightImgView addGestureRecognizer:tap];
    [accountView addSubview:rightImgView];
    
    if ([RXOSCommonTool isRTL]) {
        accountView.frame = CGRectMake(RXAC ? 29 : 25, RXAC ? 59 : 70, CGRectGetWidth(_bgView.frame) - (RXAC ? 58 : 50), RXAC ? 36 : 46);
        rightImgView.frame = CGRectMake(RXAC ? 11 : 12, RXAC ? 7.5 : 12.5, 21, 21);
        titleLbl.frame = CGRectMake(41, 0, CGRectGetWidth(accountView.frame) - 76, CGRectGetHeight(accountView.frame));
        leftImgView.frame = CGRectMake(CGRectGetWidth(accountView.frame) - (RXAC ? 29 : 32), RXAC ? 9 : 14, 18, 18);
        
        titleLbl.textAlignment = NSTextAlignmentRight;
    } else {
        accountView.frame = CGRectMake(RXAC ? 29 : 25, RXAC ? 59 : 70, CGRectGetWidth(_bgView.frame) - (RXAC ? 58 : 50), RXAC ? 36 : 46);
        leftImgView.frame = CGRectMake(RXAC ? 11 : 12, RXAC ? 7.5 : 12.5, 21, 21);
        titleLbl.frame = CGRectMake(41, 0, CGRectGetWidth(accountView.frame) - 76, CGRectGetHeight(accountView.frame));
        rightImgView.frame = CGRectMake(CGRectGetWidth(accountView.frame) - (RXAC ? 29 : 32), RXAC ? 9 : 14, 18, 18);
    }
    
    return accountView;
}

#pragma mark -- <actions>
- (void)historyListAction
{
    RXOSHistoryListLoginView *historyListView = [[RXOSHistoryListLoginView alloc] initWithLoginConfig:self.loginConfig viewType:0 selectAccount:^(NSMutableDictionary * _Nonnull userInfo) {
        
        self.selectUserInfo = [NSMutableDictionary dictionaryWithDictionary:userInfo];
        
        for (UIView *subView in self.accountView.subviews) {
            if (subView.tag == 90000) {
                UIImageView *imgView = (UIImageView *)subView;
                imgView.image = [UIImage rxOSBundleImageNamed:[RXOSCommonTool getIconWithLoginType:[userInfo[@"loginType"] integerValue] username:userInfo[@"username"]]];
            }
            if (subView.tag == 90001) {
                UILabel *label = (UILabel *)subView;
                
                NSString *nickname = userInfo[@"nickname"];
                long loginType = [userInfo[@"loginType"] longValue];
                if ((loginType == 1 || loginType == 10) && [[nickname substringToIndex:1] isEqualToString:@"+"]) {
                    nickname = [RXOSCommonTool usernameSec:nickname];
                    if (nickname.length > 4) {
                        NSInteger zeroCount = 0;
                        for (int i = 1; i < 5; i++) {
                            NSString *subStr = [nickname substringWithRange:NSMakeRange(i, 1)];
                            if ([subStr isEqualToString:@"0"]) {
                                zeroCount++;
                            } else {
                                break;
                            }
                        }
                        if (zeroCount > 0) {
                            nickname = [nickname stringByReplacingCharactersInRange:NSMakeRange(1, zeroCount) withString:@""];
                        }
                    }
                }
                
                label.text = nickname;
            }
        }
    }];
    historyListView.loginComplete = self.loginComplete;
    historyListView.loginTypeBlock = self.loginTypeBlock;
    historyListView.deleteBlock = ^{
        [self hide];
    };
}

- (void)selectBtnAction:(UIButton *)btn
{
    btn.selected = !btn.selected;
    self.isSelect = btn.selected;
    if (btn.isSelected) {
        [_selectBtn setImage:[UIImage rxOSBundleImageNamed:@"rx_priSelect"] forState:UIControlStateNormal];
    } else {
        [_selectBtn setImage:[UIImage rxOSBundleImageNamed:@"rx_priUnSelect"] forState:UIControlStateNormal];
    }
}

- (void)priTapAction:(UITapGestureRecognizer *)tap
{
    RXOSPrivacyView *priView = [[RXOSPrivacyView alloc] init];
}

- (void)loginBtnAction
{
    [self endEditing:YES];

//    if (!_selectBtn.isSelected) {
//        RXOSPriView *priView = [[RXOSPriView alloc] init];
//        priView.isQuickLogin = YES;
//
//        __weak __typeof__(self) weakSelf = self;
//        priView.quickAgreeBlock = ^{
//            [SVProgressHUD show];
//
//            NSDictionary *loginExt = [NSDictionary dictionary];
//            if (weakSelf.loginTypeBlock) {
//                loginExt = weakSelf.loginTypeBlock(loginExt, [weakSelf.selectUserInfo[@"loginType"] integerValue]);
//                NSMutableDictionary *loginExtM = [NSMutableDictionary dictionaryWithDictionary:loginExt];
//                for (int i = 0; i < loginExtM.allKeys.count; i++) {
//                    [weakSelf.selectUserInfo setValue:loginExtM.allValues[i] forKey:loginExtM.allKeys[i]];
//                }
//
//                [[RXOSLoginViewManager sharedSDK] loginWithLoginType:[weakSelf.selectUserInfo[@"loginType"] longValue] loginInfo:weakSelf.selectUserInfo complete:weakSelf.loginComplete];
//            }
//        };
//    } else {
        NSDictionary *loginExt = [NSDictionary dictionary];
        [RXOSUserUtility sharedManager].username = self.selectUserInfo[@"username"];
        if (self.loginTypeBlock) {
            loginExt = self.loginTypeBlock(loginExt, [self.selectUserInfo[@"loginType"] integerValue]);
            for (int i = 0; i < loginExt.allKeys.count; i++) {
                [self.selectUserInfo setValue:loginExt.allValues[i] forKey:loginExt.allKeys[i]];
            }
            [[RXOSLoginViewManager sharedSDK] loginWithLoginType:[self.selectUserInfo[@"loginType"] longValue] loginInfo:self.selectUserInfo complete:self.loginComplete];

        }
//    }
}

- (void)closeBtnAction
{
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

- (void)moreLoginBtnAction
{
    [RXOSUserUtility sharedManager].loginTypes = self.loginTypes;
    self.loginConfig.loginTypes = self.loginTypes;
    RXOSMoreLoginView *moreLoginView = [[RXOSMoreLoginView alloc] initWithLoginConfig:self.loginConfig showAllLoginTypes:YES loginEvent:self.loginTypeBlock complete:self.loginComplete];
    __weak __typeof__(self) weakSelf = self;
    moreLoginView.clickBlock = ^(LoginType loginType) {
        NSDictionary *loginExt = [NSDictionary dictionary];
        if (weakSelf.loginTypeBlock) {
            loginExt = weakSelf.loginTypeBlock(loginExt, loginType);
            [[RXOSLoginViewManager sharedSDK] fetchLoginEvent:loginType loginInfo:loginExt complete:self.loginComplete];
        }

    };
//    moreLoginView.clickBlock = self.clickBlock;
}

#pragma mark -- <RXOSAttributeLabelDelegate>
- (void)rxAttributeClick:(NSString *)text
{
    NSString *url = @"";
    NSArray *privacies = [RXOSUserUtility sharedManager].privacies;
    NSArray *privacieTitles = self.loginConfig.privacieTitles;
    
    if (privacieTitles.count > 0) {
        for (int i = 0; i < privacieTitles.count; i++) {
            if ([text isEqualToString:privacieTitles[i]]) {
                if (privacies && privacies.count > 0) {
                    NSString *title = privacieTitles[i];
                    title = [title stringByReplacingOccurrencesOfString:@"《" withString:@""];
                    title = [title stringByReplacingOccurrencesOfString:@"》" withString:@""];
                    RXOSCommonWKWebView *webView = [[RXOSCommonWKWebView alloc] initWithUrl:privacies[i] title:title content:nil];
                }
            }
        }
    } else {
        if ([text isEqualToString:@"用户协议"]) {
            if (privacies && privacies.count > 0) {
                url = privacies[0];
                RXOSCommonWKWebView *webView = [[RXOSCommonWKWebView alloc] initWithUrl:url title:@"用户协议" content:nil];
            } else {
                NSMutableDictionary *dic = [[NSUserDefaults standardUserDefaults] valueForKey:@"rx_legal"];
                NSMutableArray *terms = dic[@"terms"];
                NSString *content = @"";
                for (int i = 0; i < terms.count; i++) {
                    NSMutableDictionary *termInfo = terms[i];
                    NSString *key = termInfo[@"key"];
                    if ([key isEqualToString:@"00001"]) {
                        content = termInfo[@"content"];
                    }
                }
                RXOSCommonWKWebView *webView = [[RXOSCommonWKWebView alloc] initWithUrl:nil title:@"用户协议" content:content];
            }
            
        } else if ([text isEqualToString:@"隐私政策"]) {
            if (privacies && privacies.count > 1) {
                url = privacies[1];
                RXOSCommonWKWebView *webView = [[RXOSCommonWKWebView alloc] initWithUrl:url title:@"隐私政策" content:nil];
            } else {
                NSMutableDictionary *dic = [[NSUserDefaults standardUserDefaults] valueForKey:@"rx_legal"];
                NSMutableArray *terms = dic[@"terms"];
                NSString *content = @"";
                for (int i = 0; i < terms.count; i++) {
                    NSMutableDictionary *termInfo = terms[i];
                    NSString *key = termInfo[@"key"];
                    if ([key isEqualToString:@"00002"]) {
                        content = termInfo[@"content"];
                    }
                }
                RXOSCommonWKWebView *webView = [[RXOSCommonWKWebView alloc] initWithUrl:nil title:@"隐私政策" content:content];
            }
        }
    }
}

#pragma mark -- <lazy>
- (UIView *)bgView
{
    if (!_bgView) {
        _bgView = [[UIView alloc] init];
        _bgView.backgroundColor = [UIColor colorWithHexString:@"ffffff"];
        _bgView.layer.cornerRadius = 5;
    }
    return _bgView;
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

- (UIButton *)selectBtn
{
    if (!_selectBtn) {
        _selectBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        _selectBtn.adjustsImageWhenHighlighted = NO;
        _selectBtn.selected = self.isSelect;
        NSString *image = @"rx_priUnSelect";
        if (self.isSelect) {
            image = @"rx_priSelect";
        }
        [_selectBtn setImage:[UIImage rxOSBundleImageNamed:image] forState:UIControlStateNormal];
        [_selectBtn addTarget:self action:@selector(selectBtnAction:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _selectBtn;
}

- (RXOSAttributeLabel *)priLbl
{
    if (!_priLbl) {
        _priLbl = [[RXOSAttributeLabel alloc] init];
        
        NSArray *privacieTitles = self.loginConfig.privacieTitles;
        NSArray *clickTextList = @[@"用户协议", @"隐私政策"];
        NSString *title = @"我已阅读并同意";
        if (privacieTitles.count > 0) {
            for (int i = 0; i < privacieTitles.count; i++) {
                if (i == 0) {
                    title = [NSString stringWithFormat:@"%@ %@", title, privacieTitles[i]];
                } else {
                    title = [NSString stringWithFormat:@"%@、%@", title, privacieTitles[i]];
                }
            }
            clickTextList = privacieTitles;
        } else {
            title = @"我已阅读并同意 用户协议、隐私政策";
        }
        
        _priLbl.text = title;
        _priLbl.clickTextlist = clickTextList;
        _priLbl.clickTextColor = [UIColor colorWithHexString:@"20C0B3"];
        _priLbl.textColor = [UIColor colorWithHexString:@"000000"];
        _priLbl.delegate = self;
        _priLbl.font = [UIFont systemFontOfSize:RXUScaleWidth(12)];
    }
    return _priLbl;
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

- (UIButton *)loginBtn
{
    if (!_loginBtn) {
        _loginBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_loginBtn setTitle:[RXLocation osLaunguage:@"开始游戏"] forState:UIControlStateNormal];
        [_loginBtn setTitleColor:[UIColor colorWithHexString:@"F2FFFB"] forState:UIControlStateNormal];
        [_loginBtn setBackgroundColor:[UIColor colorWithHexString:@"20C0B3"]];
        _loginBtn.titleLabel.font = [UIFont systemFontOfSize:18 weight:UIFontWeightMedium];
        _loginBtn.layer.cornerRadius = 5;
        [_loginBtn addTarget:self action:@selector(loginBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _loginBtn;
}

- (UIImageView *)logoImageView
{
    if (!_logoImageView) {
        _logoImageView = [[UIImageView alloc] init];
    }
    return _logoImageView;
}

- (NSMutableDictionary *)selectUserInfo
{
    if (!_selectUserInfo) {
        _selectUserInfo = [NSMutableDictionary dictionary];
    }
    return _selectUserInfo;
}

- (UIButton *)moreLoginBtn
{
    if (!_moreLoginBtn) {
        _moreLoginBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_moreLoginBtn setTitle:[RXLocation osLaunguage:@"更多登录方式 >"] forState:UIControlStateNormal];
        [_moreLoginBtn setTitleColor:[UIColor colorWithHexString:@"#20C0B3"] forState:UIControlStateNormal];
        _moreLoginBtn.titleLabel.font = [UIFont systemFontOfSize:14 weight:UIFontWeightSemibold];
        [_moreLoginBtn addTarget:self action:@selector(moreLoginBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _moreLoginBtn;
}

@end
