//
//  RXLoginView.m
//  RXSDK
//
//  Created by 陈汉 on 2021/9/29.
//

#import "RXLoginView.h"
#import "RXUICommonTool.h"
#import "RXAttributeLabel.h"
#import "RXPrivacyView.h"
#import "RXCodeLoginView.h"
#import "RXAddLoginView.h"
//#import <WechatOpenSDK/WXApi.h>
#import "RXPriView.h"
#import "RXCommonWKWebView.h"
#import "RXGetBackPasswordView.h"
#import "RXLoginViewManager.h"
#import "RXQuickLoginView.h"
#import "RXUIAuthLoginView.h"
#import <RXSDK_Pure/RXErrorTool.h>
#import <RXSDK_Pure/RXSDK_Pure.h>
#import "RXCloseBtn.h"
#import "UIView+RXShade.h"
#import "RXSelectBtn.h"
#import "RXLegalModel.h"
#import "RXHistoryLoginView.h"
#import "RXWKWebView.h"
#import "RXLoginChangeBtn.h"

#define LoginBtnTag 100000
#define AlphaTag 200000

@interface RXLoginView () <RXAttributeLabelDelegate, UITextFieldDelegate, UITextViewDelegate>

@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) UIScrollView *animateBg;
@property (nonatomic, strong) UIView *alphaView;
@property (nonatomic, strong) UILabel *titleLbl;
@property (nonatomic, strong) RXCloseBtn *closeBtn;
@property (nonatomic, strong) RXSelectBtn *selectBtn;
@property (nonatomic, strong) RXAttributeLabel *priLbl;
@property (nonatomic, assign) NSInteger orientation;  // 屏幕方向 1竖屏 2横屏
@property (nonatomic, assign) BOOL needSet;
@property (nonatomic, assign) BOOL isSelect;
@property (nonatomic, assign) BOOL isFirstLoad;
@property (nonatomic, assign) BOOL isFirst;
@property (nonatomic, assign) BOOL isFirstAutoChange;
@property (nonatomic, assign) BOOL isShowKeyboard;
@property (nonatomic, assign) BOOL isTimeStart;
@property (nonatomic, assign) BOOL isFromNoti;
@property (nonatomic, strong) NSString *phoneNum;
@property (nonatomic, copy) LoginTypeBlock loginTypeBlock;
@property (nonatomic, copy) LoginComplete loginComplete;
@property (nonatomic, strong) RXAddLoginView *addLoginView;
@property (nonatomic, strong) RXTextField *accountTF;
@property (nonatomic, strong) RXTextField *passwordTF;
@property (nonatomic, strong) RXTextField *codeTF;
@property (nonatomic, strong) UIButton *loginBtn;
@property (nonatomic, strong) UIButton *forgetPasswordBtn;
@property (nonatomic, strong) RXCloseBtn *backBtn;
@property (nonatomic, strong) RXLoginUIConfig *loginConfig;

@property (nonatomic, strong) UIImageView *logoImageView;
@property (nonatomic, strong) UIImage *logoImage;
@property (nonatomic, strong) RXQuickLoginView *quickLoginView;
@property (nonatomic, strong) UILabel *moreLoginTipLbl;
@property (nonatomic, assign) NSInteger timeCount;
@property (nonatomic, assign) CGFloat lineX;
@property (nonatomic, assign) CGFloat passwordlineX;
@property (nonatomic, assign) CGRect codeLblFrame;
@property (nonatomic, strong) NSString *priText;
@property (nonatomic, strong) NSMutableArray *selectBtnTextCounts;

@property (nonatomic, strong) RXLoginChangeBtn *changeBtn;

@property (nonatomic, strong) NSString *inputStr;

@end

@implementation RXLoginView

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (instancetype)initWithConfig:(RXLoginUIConfig *)config
                    loginEvent:(NSDictionary *(^)(NSDictionary *loginEvent, LoginType loginType))loginEvent
                      complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    self = [super initWithFrame:CGRectMake(0, 0, [UIApplication sharedApplication].keyWindow.frame.size.width, [UIApplication sharedApplication].keyWindow.frame.size.height)];
    if (self) {
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
        [[UIApplication sharedApplication].keyWindow addSubview:self];
        
        UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tapAction:)];
        [self addGestureRecognizer:tap];
        
        self.orientation = [RXUICommonTool getInterfaceOrientation];
        self.needSet = YES;
        self.isFirst = YES;
        self.loginConfig = config;
        
//        self.logoImg = applogo;
//        self.addAccountBlock = addAccount;
        self.loginTypeBlock = loginEvent;
        self.loginComplete = complete;
        self.logoImage = config.logoImage;
        self.isSelect = config.isPrivacySelected;
        
        [self setUI];
        
        if (config.loginViewType == 1) {
            _codeLoginBtn.selected = NO;
            self.isFirstLoad = YES;
            if (config.loginTypes.count == 1 && ([config.loginTypes[0] isEqualToString:@"code"] || [config.loginTypes[0] isEqualToString:@"captchacode"])) {
                self.loginConfig.loginTypes = @[];
            }
            [self codeLoginBtnAction:_codeLoginBtn];
        } else {
            if (config.loginTypes.count == 1 && ([config.loginTypes[0] isEqualToString:@"username"])) {
                self.loginConfig.loginTypes = @[];
            }
            _codeLoginBtn.selected = YES;
            self.isFirstLoad = NO;
            [self codeLoginBtnAction:_codeLoginBtn];
        }
    
        [self show];
        
        if ([RXUIUserUtility sharedManager].isFirstView) {
            if (config.isShowClose) {
                self.closeBtn.hidden = NO;
            } else {
                self.closeBtn.hidden = YES;
            }
        }
        
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(getBackPassword:) name:RXUINoti_changePwd object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(resetPwd:) name:RXUINoti_resetPwd object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(refreshLoginUI:) name:RXUINoti_refreshLoginUI object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyBoardWillShow:) name:UIKeyboardWillShowNotification object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyBoardWillHide:) name:UIKeyboardWillHideNotification object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(slideCodeSuc:) name:noti_slideCodeSuc object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(changeCodeLogin:) name:RXUINoti_changeCodeLogin object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self
                                                     selector:@selector(textFieldTextDidChange:)
                                                         name:UITextFieldTextDidChangeNotification
                                                       object:self.accountTF.tf];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyBoardWillShow:) name:UIKeyboardWillShowNotification object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyBoardWillHide:) name:UIKeyboardWillHideNotification object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(applicationBecomeActive) name:UIApplicationWillEnterForegroundNotification object:nil];
    }
    return self;
}

- (void)applicationBecomeActive
{
    if (self.quickLoginView) {
        [self.quickLoginView startInfiniteAnimationForLabel:nil];
    }
}

- (void)textFieldTextDidChange:(NSNotification *)notification {
    UITextField *textField = (UITextField *)notification.object;
    UIPasteboard *pasteboard = [UIPasteboard generalPasteboard];
    
    if (textField.text.length <= 0) {
        _accountTF.placeholderLbl.hidden = NO;
        _loginBtn.userInteractionEnabled = NO;
        if (!self.codeLoginBtn.selected) {
            self.accountTF.placehoder = @"请输入您的账号";
        } else {
            self.accountTF.placehoder = @"请输入您的手机号";
        }
        [_loginBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
    }
}

- (void)tapAction:(UITapGestureRecognizer *)tap
{
    [self endEditing:YES];
    
//    if ([RXUICommonTool validateMobile:self.accountTF.tf.text] && !self.isFirstAutoChange && self.passwordTF.tf.text.length <= 0 && !self.codeLoginBtn.selected) {
//        
//        self.phoneNum = self.accountTF.tf.text;
//        [self codeLoginBtnAction:self.changeBtn];
//        self.isFirstAutoChange = YES;
//    }
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

- (void)keyBoardWillShow:(NSNotification *)notification
{
    self.isShowKeyboard = YES;
    
    if (!RXAC || self.loginConfig.loginTypes.count > 0) return;
    NSDictionary *userInfo = [notification userInfo];
    NSValue *value = [userInfo objectForKey:UIKeyboardFrameEndUserInfoKey];
    NSNumber *duration = [userInfo objectForKey:UIKeyboardAnimationDurationUserInfoKey];
    
    [UIView animateWithDuration:duration.doubleValue animations:^{
        UIView *window = [UIApplication sharedApplication].keyWindow;
        self.bgView.center = CGPointMake(window.center.x, window.frame.size.height / 2 - 30);
//        self.bgView.frame = CGRectMake(0, window.frame.size.height / 2 - bgH / 2 - 35, 335, 232);

        [self layoutSubviews];
    }];
}

- (void)keyBoardWillHide:(NSNotification *)notification
{
    self.isShowKeyboard = NO;
    
    if (!RXAC || self.loginConfig.loginTypes.count > 0) return;
    NSDictionary *userInfo = [notification userInfo];
    NSNumber *duration = [userInfo objectForKey:UIKeyboardAnimationDurationUserInfoKey];
    
    [UIView animateWithDuration:duration.doubleValue animations:^{
        UIView *window = [UIApplication sharedApplication].keyWindow;
        self.bgView.center = window.center;
//        self.bgView.sd_layout.topSpaceToView(self, window.frame.size.height / 2 - bgH / 2);
        [self layoutSubviews];
    }];
}

#pragma mark -- <setUI>
- (void)setUI
{
    [self addSubview:self.bgView];
    [self.bgView addSubview:self.closeBtn];
    [self.bgView addSubview:self.titleLbl];
    [self.bgView addSubview:self.logoImageView];
    [self.bgView addSubview:self.accountTF];
    [self.bgView addSubview:self.passwordTF];
    [self.bgView addSubview:self.codeTF];
    [self.bgView addSubview:self.changeBtn];
    [self.bgView addSubview:self.loginBtn];
    [self.bgView addSubview:self.codeLoginBtn];
    [self.bgView addSubview:self.priLbl];
    [self.bgView addSubview:self.selectBtn];
//    [self.bgView addSubview:self.forgetPasswordBtn];
    [self.bgView addSubview:self.backBtn];
    [self.bgView addSubview:self.moreLoginTipLbl];
    [self.bgView addSubview:[self otherLoginTip]];
    
//    [self.bgView addSubview:self.animateBg];
//    [self.animateBg addSubview:self.passwordTF];
//    [self.animateBg addSubview:self.codeTF];
    
    [self layoutViews];
}

- (void)layoutViews
{
    UIView *window = [UIApplication sharedApplication].keyWindow;
    
    CGFloat bgH = RXAC ? 323 : 360;
    if (!self.loginConfig.isQuickButtonBarVisible || self.loginConfig.loginTypes.count <= 0) {
        bgH -= RXAC ? 45 : 90;
    }
    _bgView.frame = CGRectMake(0, 0, [RXUICommonTool getScreenWidth], bgH);
    _bgView.center = window.center;
    
//    if (self.logoImage) {
    _titleLbl.hidden = YES;
    _logoImageView.hidden = NO;
    _logoImageView.frame = CGRectMake(CGRectGetWidth(_bgView.frame) / 2 - 108 / 2 - 1.6, RXAC ? 12 : 4, RXAC ? 110.4 : 110.2, 23.6);
    if ([self.logoImage isKindOfClass:[UIImage class]]) {
        _logoImageView.image = self.logoImage;
    } else {
        _logoImageView.image = [RXUICommonTool getImageFromURL:(NSString *)self.logoImage];
    }
    
    _accountTF.frame = CGRectMake(RXAC ? 29 : 25, RXAC ? 57 : 70, CGRectGetWidth(_bgView.frame) - (RXAC ? 59 : 50), RXAC ? 36 : 46);
    
    _loginBtn.frame = CGRectMake(CGRectGetMinX(_accountTF.frame), CGRectGetMaxY(_passwordTF.frame) + (RXAC ? 6 : 24), CGRectGetWidth(_accountTF.frame), RXAC ? 44 : 48);
    
    CGFloat priY = RXAC ? 36.5 : 44.5;
    if (!RXAC && self.loginConfig.privacieTitles.count >= 3) {
        priY -= 1.5;
    }
    
    if (!RXAC && self.loginConfig.privacieTitles.count >= 3) {
        priY -= 1.5;
    }
    CGFloat size = RXAC ? 12 : (self.loginConfig.privacieTitles.count >= 3 ? 12 : 13);
    CGFloat btnW = [self.priText widthForFont:[UIFont systemFontOfSize:size weight:UIFontWeightRegular]] + (RXAC ? 10 : 10);
    _priLbl.frame = CGRectMake([RXUICommonTool getScreenWidth] / 2 - btnW / 2 + (RXAC ? 5 : 3) + 5, CGRectGetHeight(_bgView.frame) - priY, btnW, 18);
    _selectBtn.frame = CGRectMake(CGRectGetMinX(_priLbl.frame) - 52, CGRectGetHeight(_bgView.frame) - (RXAC ? 47 : 52), [RXUICommonTool getScreenWidth], 50);
    _selectBtn.center = CGPointMake(CGRectGetMinX(_priLbl.frame) + (RXAC ? 139 : 121), _priLbl.center.y + 5.5);
    
    _loginBtn.frame = CGRectMake(CGRectGetMinX(_accountTF.frame), CGRectGetMaxY(_passwordTF.frame) + (RXAC ? 14 : 58), CGRectGetWidth(_accountTF.frame), RXAC ? 43 : 42);
    
    _codeLoginBtn.frame = CGRectMake(40, CGRectGetMaxY(_loginBtn.frame) + 10, 72, 22);

    _forgetPasswordBtn.frame = CGRectMake(250, CGRectGetMinY(_codeLoginBtn.frame), 58, 22);
    
    _closeBtn.frame = CGRectMake(RXAC ? 323 : 302.5, RXAC ? 13.5 : 11.5, 21, 21);
    
    _backBtn.frame = CGRectMake(RXAC ? 24 : 20, RXAC ? 16 : 16, 28, 28);
    
    _moreLoginTipLbl.frame = CGRectMake(0, CGRectGetMaxY(_loginBtn.frame) + (RXAC ? 14 : 14), CGRectGetWidth(_bgView.frame), 30);
    
    if (RXAC) {
        _animateBg.contentSize = CGSizeMake((CGRectGetWidth(_bgView.frame) - 41) * 2 - 78 - 86, 0);
    } else {
        _animateBg.contentSize = CGSizeMake((CGRectGetWidth(_bgView.frame) - 50) * 2 + 30, 0);
    }
    
    // 底部快速登录按钮
    RXUserType userType = RXUserType_account;
    if (self.loginConfig.loginViewType == 1) {
        userType = RXUserType_code;
    }
    RXQuickLoginView *quickLoginView = [[RXQuickLoginView alloc] initWithLoginConfig:self.loginConfig viewType:userType loginEvent:self.loginTypeBlock complete:self.loginComplete];
    self.quickLoginView = quickLoginView;
    quickLoginView.frame = CGRectMake(0, CGRectGetMaxY(_codeLoginBtn.frame) + 12, 344, 40);
    quickLoginView.viewType = RXUserType_account;
    
    __weak __typeof__(self) weakSelf = self;
    quickLoginView.clickBlock = ^(LoginType loginType) {
        if (loginType == LoginTypeAuth) {
            NSDictionary *loginExt = [NSDictionary dictionary];
            if (weakSelf.loginTypeBlock) {
                loginExt = weakSelf.loginTypeBlock(loginExt, loginType);
                [[RXLoginViewManager sharedSDK] fetchLoginEvent:loginType loginInfo:loginExt complete:self.loginComplete];
            }
        } else {
            if (!weakSelf.isSelect && loginType != LoginTypeAuth) {
                RXPriView *priView = [[RXPriView alloc] init];
                priView.agreeBlock = ^{
//                    self.isSelect = !self.isSelect;
//                    self.loginConfig.isPrivacySelected = self.isSelect;
                    [self selectBtnAction:self.selectBtn];
                    NSDictionary *loginExt = [NSDictionary dictionary];
                    if (weakSelf.loginTypeBlock) {
                        loginExt = weakSelf.loginTypeBlock(loginExt, loginType);
                        [[RXLoginViewManager sharedSDK] fetchLoginEvent:loginType loginInfo:loginExt complete:self.loginComplete];
                    }
                };
            } else {
                NSDictionary *loginExt = [NSDictionary dictionary];
                if (weakSelf.loginTypeBlock) {
                    loginExt = weakSelf.loginTypeBlock(loginExt, loginType);
                    [[RXLoginViewManager sharedSDK] fetchLoginEvent:loginType loginInfo:loginExt complete:self.loginComplete];
                }
            }
        }
    };
    if (self.loginConfig.isQuickButtonBarVisible && self.loginConfig.loginTypes.count > 0) {
        [self.bgView addSubview:self.quickLoginView];
        [self.quickLoginView startInfiniteAnimationForLabel:nil];
    }
    
    [self.bgView bringSubviewToFront:self.selectBtn];
    [self.bgView bringSubviewToFront:self.priLbl];

    [self layoutSubviews];
}

- (void)show
{
    [RXUIUserUtility sharedManager].isLoginViewShow = YES;
    [RXUICommonTool transformWithView:self.bgView];
    UIView *window = [UIApplication sharedApplication].keyWindow;
    [window addSubview:self.alphaView];
    [window bringSubviewToFront:self];
//    self.layer.zPosition = 100000000000000;
    [UIView animateWithDuration:0.1 animations:^{
        if ([RXUIUserUtility sharedManager].isFirstView) {
            self.alphaView.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.5];
            [RXUICommonTool showWithAnimate:self.bgView];
        } else {
            self.alphaView.backgroundColor = [UIColor clearColor];
            [RXUICommonTool showWithAnimate:self.bgView duration:0];
        }
        
       
        [self layoutSubviews];
    }];
}

- (void)hide
{
    [RXUIUserUtility sharedManager].isLoginViewShow = NO;
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    
    UIView *window = [UIApplication sharedApplication].keyWindow;
    for (UIView *v in window.subviews) {
        if (v.tag == AlphaTag) {
            [v removeFromSuperview];
        }
    }
    
    [self.quickLoginView removeFromSuperview];
    self.quickLoginView = nil;
    [self removeFromSuperview];
}

// 输入框动画效果，type 表示当前输入框状态，0 账号密码，1 验证码
- (void)changeTFAnimateWithType:(NSInteger)type
{
    if (self.isFirst) {
//        self.passwordTF.frame = CGRectMake(CGRectGetMinX(self.accountTF.frame), CGRectGetMaxY(self.accountTF.frame) + 14, CGRectGetWidth(self.accountTF.frame) - 92, CGRectGetHeight(self.accountTF.frame));
//        self.passwordTF.frame = CGRectMake(0, 0, CGRectGetWidth(self.animateBg.frame), CGRectGetHeight(self.animateBg.frame));
        self.isFirst = NO;
        self.hideAnimate = NO;
        return;
    }
    if (type == 0) {
        [self.animateBg setContentOffset:CGPointMake(0, 0) animated:YES];
    } else {
        if (self.hideAnimate) {
            [self.animateBg setContentOffset:CGPointMake([RXUICommonTool getScreenWidth] - (RXAC ? 40 + 76: 50 - 30), 0) animated:YES];
            self.hideAnimate = NO;
            return;
        }
        [self.animateBg setContentOffset:CGPointMake([RXUICommonTool getScreenWidth] - (RXAC ? 40 + 76: 50 - 30), 0) animated:YES];
//        self.animateBg.contentOffset = CGPointMake(100, 0);
    }
    return;
    
    [UIView animateWithDuration:0.3 animations:^{
        if (type == 0) {
//            [self.animateBg setContentOffset:CGPointMake(0, 0) animated:YES];
//            self.codeTF.frame = CGRectMake(CGRectGetWidth(self.accountTF.frame) - 57, CGRectGetMaxY(self.accountTF.frame) + 14, 0, CGRectGetHeight(self.accountTF.frame));
//            self.codeTF.frame = CGRectMake(CGRectGetWidth(self.animateBg.frame) + 10, 0, CGRectGetWidth(self.animateBg.frame), CGRectGetHeight(self.animateBg.frame));
        } else {
//            self.passwordTF.frame = CGRectMake(CGRectGetWidth(self.animateBg.frame) + 10, 0, CGRectGetWidth(self.animateBg.frame), CGRectGetHeight(self.animateBg.frame));
//            self.passwordTF.frame = CGRectMake(CGRectGetMinX(self.accountTF.frame), CGRectGetMaxY(self.accountTF.frame) + 14, 0, CGRectGetHeight(self.accountTF.frame));
        }
        [self layoutSubviews];
    }];
    
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        [UIView animateWithDuration:0.3 animations:^{
            if (type == 0) {
//                self.passwordTF.frame = CGRectMake(CGRectGetMinX(self.accountTF.frame), CGRectGetMaxY(self.accountTF.frame) + 14, CGRectGetWidth(self.accountTF.frame) - 92, CGRectGetHeight(self.accountTF.frame));
//                self.passwordTF.frame = CGRectMake(0, 0, CGRectGetWidth(self.animateBg.frame), CGRectGetHeight(self.animateBg.frame));
                [self.passwordTF refreshView];
            } else {
//                self.codeTF.frame = CGRectMake(CGRectGetMinX(self.accountTF.frame), CGRectGetMaxY(self.accountTF.frame) + 14, CGRectGetWidth(self.accountTF.frame) - 78, CGRectGetHeight(self.accountTF.frame));
//                self.codeTF.frame = CGRectMake(0, 0, CGRectGetWidth(self.animateBg.frame), CGRectGetHeight(self.animateBg.frame));
                [self.codeTF refreshView];
            }
            [self layoutSubviews];
        }];
    });
    
//    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.15 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
//        if (type == 0) {
//            self.passwordTF.hidden = YES;
//        } else {
//            self.codeTF.hidden = YES;
//        }
//    });
}

- (void)setUsername:(NSString *)username
{
    _username = username;
    if (username.length <= 0 || self.isChange) {
//        _username = @"";
        return;
    }
    self.accountTF.tf.text = username;
    self.accountTF.placehoder = @"";
}

#pragma mark -- <notiActions>
- (void)refreshLoginUI:(NSNotification *)noti
{
//    self.loginConfig.loginTypes = @[];
    self.isFromNoti = YES;
    _codeLoginBtn.selected = !_codeLoginBtn.selected;
    [self codeLoginBtnAction:_codeLoginBtn];
}

- (void)getBackPassword:(NSNotification *)noti
{
    if (!_codeLoginBtn.selected) {
        self.accountTF.tf.text = noti.userInfo[@"username"];
        self.accountTF.placehoder = @"";
    }
}

- (void)resetPwd:(NSNotification *)noti
{
    if (!_codeLoginBtn.selected) {
        self.accountTF.tf.text = noti.userInfo[@"username"];
        self.accountTF.placehoder = @"";
        
        NSString *password = noti.userInfo[@"password"];
        if (password && password.length > 0) {
            self.passwordTF.tf.text = password;
            self.passwordTF.placehoder = @"";
        }
    }
}

- (void)slideCodeSuc:(NSNotification *)noti
{
    [RXHUD showHUD];
}

#pragma mark -- <actions>
- (void)changeCodeLogin:(NSNotification *)noti
{
    NSDictionary *userInfo = noti.userInfo;
    _codeLoginBtn.selected = NO;
    [self codeLoginBtnAction:_changeBtn];
    self.username = userInfo[@"username"];
}

- (void)selectBtnAction:(UIButton *)btn
{
    btn.selected = !btn.selected;
    self.isSelect = btn.selected;
    
    [[NSNotificationCenter defaultCenter] postNotificationName:noti_privacySelected object:nil userInfo:@{@"selected" : @(self.isSelect)}];
    
    if (btn.isSelected) {
        [_selectBtn setImage:[UIImage rxBundleImageNamed:@"rx_priSelect"] forState:UIControlStateNormal];
    } else {
        [_selectBtn setImage:[UIImage rxBundleImageNamed:@"rx_priUnSelect"] forState:UIControlStateNormal];
    }
}

- (void)priTapAction:(UITapGestureRecognizer *)tap
{
    RXPrivacyView *priView = [[RXPrivacyView alloc] init];
}

- (void)codeLoginBtnAction:(UIButton *)btn
{
    _codeLoginBtn.selected = !_codeLoginBtn.selected;
    if (_codeLoginBtn.selected) {
        
        // 用户行为上报
        NSMutableDictionary *thirdRes = [NSMutableDictionary dictionary];
        [thirdRes setValue:@"captchacode" forKey:@"method"];
        [[RXUserActionLogManager sharedSDK] addUserActionWithScene:@"login" action:@"show" properties:thirdRes];
        
        if (_accountTF.tf.text.length > 0 && _codeTF.tf.text.length > 0) {
            _loginBtn.userInteractionEnabled = YES;
            [_loginBtn setBackgroundColor:[UIColor colorWithHexString:@"20C0B3"]];
        } else {
            _loginBtn.userInteractionEnabled = NO;
            [_loginBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
        }
        
        self.codeTF.tf.keyboardType = UIKeyboardTypeNumberPad;
        self.accountTF.tf.keyboardType = UIKeyboardTypeNumberPad;
        
        if (self.isShowKeyboard && [self.accountTF.tf isEditing]) {
            [self.accountTF.tf endEditing:YES];
            dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.3 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
                [self.accountTF.tf becomeFirstResponder];
            });
        }
        
        if ([self.passwordTF.tf isEditing]) {
            [self.passwordTF.tf endEditing:YES];
        }
        
//        [btn setTitle:@"密码登录" forState:UIControlStateNormal];
        [self.loginBtn setTitle:@"登录" forState:UIControlStateNormal];
//        self.accountTF.tf.text = @"";
//        self.passwordTF.tf.text = @"";
        self.passwordTF.tf.secureTextEntry = NO;
        self.accountTF.placeholderLbl.hidden = NO;
        self.passwordTF.hidden = YES;
        self.codeTF.hidden = NO;
        
        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.01 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
            if (self.isTimeStart) {
                self.codeTF.bgView.frame = CGRectMake(CGRectGetMinX(self.codeTF.bgView.frame) - 5, CGRectGetMinY(self.codeTF.bgView.frame), CGRectGetWidth(self.passwordTF.bgView.frame), CGRectGetHeight(self.codeTF.bgView.frame));
                self.codeTF.codeLbl.frame = CGRectMake(CGRectGetMinX(self.codeTF.codeLbl.frame) - 2, CGRectGetMinY(self.codeTF.codeLbl.frame), CGRectGetWidth(self.codeTF.codeLbl.frame), CGRectGetHeight(self.codeTF.codeLbl.frame));
            } else {
                self.lineX = CGRectGetMinX(self.codeTF.bgView.frame);
                
                self.codeTF.bgView.frame = CGRectMake(self.lineX, CGRectGetMinY(self.codeTF.bgView.frame), CGRectGetWidth(self.codeTF.bgView.frame), CGRectGetHeight(self.codeTF.bgView.frame));
            }
        });
//        self.passwordTF.bgView.hidden = YES;
//        self.codeTF.bgView.hidden = NO;
        
//        self.codeTF.placeholderLbl.hidden = YES;
        self.codeTF.placeholderLbl.hidden = NO;
        self.accountTF.placehoder = @"请输入您的手机号";
        
        if (self.codeTF.tf.text.length <= 0) {
            self.codeTF.placehoder = @"请输入您的验证码";
            self.codeTF.placeholderLbl.hidden = NO;
        }
        [self.changeBtn setTitle:@"密码登录" forState: normal];
//        [self.codeTF changeType:TFType_loginCode];
        self.forgetPasswordBtn.hidden = YES;
        
        if (!self.isFirstAutoChange && self.phoneNum.length > 0) {
            self.accountTF.tf.text = self.phoneNum;
        }
        
        if (self.accountTF.tf.text.length > 0) {
            self.accountTF.placehoder = @"";
        }
        if (self.codeTF.tf.text.length > 0) {
            self.codeTF.placehoder = @"";
        }
        
//        if (!self.isChange) {
////            dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
//                self.accountTF.tf.text = @"";
//                self.accountTF.placeholderLbl.hidden = NO;
//                self.accountTF.placehoder = @"请输入您的手机号";
////            });
//        }
        
        NSArray *privacieTitles = [RXUIUserUtility sharedManager].privacieTitles;
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
//            title = [NSString stringWithFormat:@"%@; 未注册的手机号将自动注册", title];
        } else {
            title = @"我已阅读并同意 用户协议、隐私政策";
        }
        
        self.priLbl.text = title;
        self.priLbl.clickTextlist = clickTextList;
        self.quickLoginView.viewType = RXUserType_code;
        if (!self.isFirstLoad && self.loginConfig.loginTypes.count > 0 && !self.isFromNoti) {
            [self.quickLoginView refreshUIWithViewType:RXUserType_code];
        }
        
        self.isFromNoti = NO;
        
        BOOL isAC = RXAC;
        if (!isAC) {
//            self.moreLoginTipLbl.hidden = NO;
        } else {
            self.moreLoginTipLbl.hidden = YES;
        }
        
        UIView *window = [UIApplication sharedApplication].keyWindow;
        CGFloat bgH = RXAC ? 290 : 390;
        if (!self.loginConfig.isQuickButtonBarVisible || self.loginConfig.loginTypes.count <= 0) {
            bgH -= RXAC ? 45 : 90;
        }
//        _bgView.frame = CGRectMake(0, 0, [RXUICommonTool getScreenWidth], bgH);
        _bgView.center = window.center;
        _logoImageView.frame = CGRectMake([RXUICommonTool getScreenWidth] / 2 - 108 / 2 - 1.6, RXAC ? 13.3 : 12, RXAC ? 114 : 110.2, RXAC ? 24.6 : 23.6);
        _accountTF.frame = CGRectMake(RXAC ? 21 : 25, RXAC ? 50 : 53, [RXUICommonTool getScreenWidth] - (RXAC ? 42 : 50), RXAC ? 37.2 : 47);
        _animateBg.frame = CGRectMake(CGRectGetMinX(_accountTF.frame), CGRectGetMaxY(_accountTF.frame) + 10, CGRectGetWidth(self.accountTF.frame) - (RXAC ? 93 : 0), CGRectGetHeight(_accountTF.frame));
        _codeTF.frame = CGRectMake(CGRectGetMinX(_accountTF.frame), CGRectGetMaxY(_accountTF.frame) + (RXAC ? 6 : 8), CGRectGetWidth(_accountTF.frame), CGRectGetHeight(_accountTF.frame));
        _passwordTF.frame = CGRectMake(CGRectGetMinX(_accountTF.frame), CGRectGetMaxY(_accountTF.frame) + (RXAC ? 6 : 8), CGRectGetWidth(_accountTF.frame), CGRectGetHeight(_accountTF.frame));
        _changeBtn.frame = CGRectMake(CGRectGetWidth(_accountTF.frame) - (RXAC ? 70.5 :  68), (RXAC ? CGRectGetMinY(_animateBg.frame) : CGRectGetMaxY(_animateBg.frame) + 1.5), 94, 36);
//        _loginBtn.frame = CGRectMake(CGRectGetMinX(_accountTF.frame), CGRectGetMaxY(_animateBg.frame) + (RXAC ? 12 : 40), CGRectGetWidth(_accountTF.frame), RXAC ? 44 : 48);
        _loginBtn.frame = CGRectMake(CGRectGetMinX(_accountTF.frame), CGRectGetMaxY(_passwordTF.frame) + (RXAC ? 6 : 10), CGRectGetWidth(_accountTF.frame), RXAC ? 44.5 : 43);

        CGFloat priY = RXAC ? 47 : 42;
        if (!RXAC && self.loginConfig.privacieTitles.count >= 3) {
            priY -= 1.5;
        }
        CGFloat size = RXAC ? 16 : (privacieTitles.count >= 3 ? 14 : 16);
        CGFloat btnW = [self.priText widthForFont:[UIFont systemFontOfSize:size weight:UIFontWeightRegular]] + (RXAC ? 2 : 10);
        
        _priLbl.frame = CGRectMake(CGRectGetMinX(_loginBtn.frame) + (RXAC ? 23.3 : 21), CGRectGetMaxY(_loginBtn.frame) + (RXAC ? 6.5 : 10), CGRectGetWidth(_loginBtn.frame) - 7.5, 50);
        _selectBtn.frame = CGRectMake(CGRectGetMinX(_priLbl.frame) - (RXAC ? 66 : 48), CGRectGetMinX(_priLbl.frame), [RXUICommonTool getScreenWidth], 50);
        _selectBtn.center = CGPointMake(CGRectGetMinX(_priLbl.frame) + (RXAC ? 128 : 116), _priLbl.center.y - (RXAC ? 10.5 : 10.5));
        _quickLoginView.frame = CGRectMake(0, CGRectGetMaxY(_loginBtn.frame) + (RXAC ? 71 : 80), [RXUICommonTool getScreenWidth], 40);
        if (btnW > CGRectGetWidth(_loginBtn.frame) + (RXAC ? 15 : 5)) {
            _priLbl.frame = CGRectMake(CGRectGetMinX(_loginBtn.frame) + (RXAC ? 23.3 : 21), CGRectGetMaxY(_loginBtn.frame) + (RXAC ? -1.5 : 2), CGRectGetWidth(_loginBtn.frame) - (RXAC ? 20 : 10), 50);
            _selectBtn.center = CGPointMake(CGRectGetMinX(_priLbl.frame) + (RXAC ? 128 : 116), _priLbl.center.y - (RXAC ? 10 : 10.5));
//            _quickLoginView.frame = CGRectMake(0, CGRectGetMaxY(_loginBtn.frame) + (RXAC ? 11 : 19), [RXUICommonTool getScreenWidth], 40);
        }
        
        _moreLoginTipLbl.frame = CGRectMake(0, CGRectGetMaxY(_loginBtn.frame) + (RXAC ? 14 : 10), [RXUICommonTool getScreenWidth], 30);
        
//        [self changeTFAnimateWithType:1];
    } else {
        
        // 用户行为上报
        NSMutableDictionary *thirdRes = [NSMutableDictionary dictionary];
        [thirdRes setValue:@"username" forKey:@"method"];
        [[RXUserActionLogManager sharedSDK] addUserActionWithScene:@"login" action:@"show" properties:thirdRes];
        
        if (_accountTF.tf.text.length > 0 && _passwordTF.tf.text.length > 0) {
            _loginBtn.userInteractionEnabled = YES;
            [_loginBtn setBackgroundColor:[UIColor colorWithHexString:@"20C0B3"]];
        } else {
            _loginBtn.userInteractionEnabled = NO;
            [_loginBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
        }
        
//        [btn setTitle:@"验证码登录" forState:UIControlStateNormal];
        [self.loginBtn setTitle:@"登录" forState:UIControlStateNormal];
        self.passwordTF.tf.secureTextEntry = YES;
        self.accountTF.placeholderLbl.hidden = NO;
        self.passwordTF.placeholderLbl.hidden = YES;
        self.accountTF.placehoder = @"请输入您的账号";
        if (self.passwordTF.tf.text.length <= 0) {
            self.passwordTF.placehoder = @"请输入您的密码";
            self.passwordTF.placeholderLbl.hidden = NO;
        }
        [self.changeBtn setTitle:@"验证码登录" forState: normal];
        self.passwordTF.hidden = NO;
        self.codeTF.hidden = YES;
//        self.passwordTF.bgView.hidden = NO;
//        self.codeTF.bgView.hidden = YES;
//        self.codeTF.line.hidden = YES;
        self.lineX = CGRectGetMinX(self.codeTF.bgView.frame);
        
//        if (!self.isChange) {
////            dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.001 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
//                self.accountTF.tf.text = @"";
//                self.accountTF.placeholderLbl.hidden = NO;
//                self.accountTF.placehoder = @"请输入您的账号";
////            });
//        }
        
        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.01 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
            if (self.isTimeStart) {
                self.codeTF.bgView.frame = CGRectMake(CGRectGetMinX(self.codeTF.bgView.frame) - 5, CGRectGetMinY(self.codeTF.bgView.frame), CGRectGetWidth(self.passwordTF.bgView.frame), CGRectGetHeight(self.codeTF.bgView.frame));
                self.codeTF.codeLbl.frame = CGRectMake(CGRectGetMinX(self.codeTF.codeLbl.frame) - 2, CGRectGetMinY(self.codeTF.codeLbl.frame), CGRectGetWidth(self.codeTF.codeLbl.frame), CGRectGetHeight(self.codeTF.codeLbl.frame));
            } else {
                self.codeTF.bgView.frame = CGRectMake(self.lineX, CGRectGetMinY(self.codeTF.bgView.frame), CGRectGetWidth(self.codeTF.bgView.frame), CGRectGetHeight(self.codeTF.bgView.frame));
            }
        });
        
        self.forgetPasswordBtn.hidden = YES;
        self.isFirstLoad = NO;
        if (self.accountTF.tf.text.length > 0) {
            self.accountTF.placehoder = @"";
        }
        self.accountTF.tf.keyboardType = UIKeyboardTypeEmailAddress;
        self.passwordTF.tf.keyboardType = UIKeyboardTypeEmailAddress;
        
        if (self.isShowKeyboard && [self.accountTF.tf isEditing]) {
            [self.accountTF.tf endEditing:YES];
            dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.3 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
                [self.accountTF.tf becomeFirstResponder];
            });
        }
        
        if ([self.codeTF.tf isEditing]) {
            [self.codeTF.tf endEditing:YES];
        }
        
        NSArray *privacieTitles = [RXUIUserUtility sharedManager].privacieTitles;
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
        
        self.priLbl.text = title;
        self.priLbl.clickTextlist = clickTextList;
        self.quickLoginView.viewType = RXUserType_account;
        if (!self.isFirstLoad && self.loginConfig.loginTypes.count > 0) {
            [self.quickLoginView refreshUIWithViewType:RXUserType_account];
        }
        
        UIView *window = [UIApplication sharedApplication].keyWindow;
        CGFloat bgH = RXAC ? 290 : 390;
        if (!self.loginConfig.isQuickButtonBarVisible || self.loginConfig.loginTypes.count <= 0) {
            bgH -= RXAC ? 45 : 90;
        }
        _bgView.center = window.center;
        _logoImageView.frame = CGRectMake([RXUICommonTool getScreenWidth] / 2 - 108 / 2 - 1.6, RXAC ? 13.3 : 12, RXAC ? 114 : 110.2, RXAC ? 24.6 : 23.6);
        _accountTF.frame = CGRectMake(RXAC ? 21 : 25, RXAC ? 50 : 53, [RXUICommonTool getScreenWidth] - (RXAC ? 42 : 50), RXAC ? 37.2 : 47);
        _animateBg.frame = CGRectMake(CGRectGetMinX(_accountTF.frame), CGRectGetMaxY(_accountTF.frame) + 10, CGRectGetWidth(self.accountTF.frame) - (RXAC ? 93 : 0), CGRectGetHeight(_accountTF.frame));
//        _passwordTF.frame = CGRectMake(0, 0, CGRectGetWidth(_animateBg.frame), CGRectGetHeight(_animateBg.frame));
        _passwordTF.frame = CGRectMake(CGRectGetMinX(_accountTF.frame), CGRectGetMaxY(_accountTF.frame) + (RXAC ? 6 : 8), CGRectGetWidth(_accountTF.frame), CGRectGetHeight(_accountTF.frame));
        _codeTF.frame = CGRectMake(CGRectGetWidth(_passwordTF.frame) + (RXAC ? 18 : 30), 0, CGRectGetWidth(_animateBg.frame) + (RXAC ? 14 : 0), CGRectGetHeight(_animateBg.frame));
        _changeBtn.frame = CGRectMake(CGRectGetWidth(_accountTF.frame) - (RXAC ? 70.5 :  68), (RXAC ? CGRectGetMinY(_animateBg.frame) : CGRectGetMaxY(_animateBg.frame) + 1.5), 94, 36);
//        _loginBtn.frame = CGRectMake(CGRectGetMinX(_accountTF.frame), CGRectGetMaxY(_animateBg.frame) + (RXAC ? 12 : 40), CGRectGetWidth(_accountTF.frame), RXAC ? 44 : 48);
        _loginBtn.frame = CGRectMake(CGRectGetMinX(_accountTF.frame), CGRectGetMaxY(_passwordTF.frame) + (RXAC ? 6 : 10), CGRectGetWidth(_accountTF.frame), RXAC ? 44.5 : 43);
        
        CGFloat priY = RXAC ? 47 : 42;
        if (!RXAC && self.loginConfig.privacieTitles.count >= 3) {
            priY -= 1.5;
        }
        CGFloat size = RXAC ? 16 : (privacieTitles.count >= 3 ? 14 : 16);
//        CGFloat btnW = [self.priText widthForFont:[UIFont systemFontOfSize:size weight:UIFontWeightRegular]] + (RXAC ? 10 : 10);
        CGFloat btnW = [self.priText widthForFont:[UIFont systemFontOfSize:size weight:UIFontWeightRegular]] + (RXAC ? 2 : 10);
        
        _priLbl.frame = CGRectMake(CGRectGetMinX(_loginBtn.frame) + (RXAC ? 23.3 : 21), CGRectGetMaxY(_loginBtn.frame) + (RXAC ? 6.5 : 10), CGRectGetWidth(_loginBtn.frame) - 7.5, 50);
        _selectBtn.frame = CGRectMake(CGRectGetMinX(_priLbl.frame) - (RXAC ? 66 : 48), CGRectGetMinX(_priLbl.frame), [RXUICommonTool getScreenWidth], 50);
        _selectBtn.center = CGPointMake(CGRectGetMinX(_priLbl.frame) + (RXAC ? 128 : 116), _priLbl.center.y - (RXAC ? 10.5 : 10.5));
        _quickLoginView.frame = CGRectMake(0, CGRectGetMaxY(_loginBtn.frame) + (RXAC ? 71 : 80), [RXUICommonTool getScreenWidth], 40);
        
        CGFloat totalW = CGRectGetWidth(_loginBtn.frame) + (RXAC ? 15 : 5);
        
        if (btnW > CGRectGetWidth(_loginBtn.frame) + (RXAC ? 15 : 5)) {
            _priLbl.frame = CGRectMake(CGRectGetMinX(_loginBtn.frame) + (RXAC ? 23.3 : 21), CGRectGetMaxY(_loginBtn.frame) + (RXAC ? -1.5 : 2), CGRectGetWidth(_loginBtn.frame) - (RXAC ? 20 : 10), 50);
            _selectBtn.center = CGPointMake(CGRectGetMinX(_priLbl.frame) + (RXAC ? 128 : 116), _priLbl.center.y - (RXAC ? 10 : 10.5));
//            _quickLoginView.frame = CGRectMake(0, CGRectGetMaxY(_loginBtn.frame) + (RXAC ? 11 : 19), [RXUICommonTool getScreenWidth], 40);
        }
        
        _moreLoginTipLbl.frame = CGRectMake(0, CGRectGetMaxY(_loginBtn.frame) + (RXAC ? 14 : 10), [RXUICommonTool getScreenWidth], 30);
        
//        [self changeTFAnimateWithType:0];
    }
}

- (void)accountListBtnAction
{
//    RXAccountListView *accountListView = [[RXAccountListView alloc] initWithAddAccount:self.addAccountBlock loginType:self.loginTypeBlock];
}

- (void)loginBtnAction
{
    [self endEditing:YES];
    
    // 用户行为上报
    NSMutableDictionary *thirdRes = [NSMutableDictionary dictionary];
    NSString *method = @"";
    
    if (!self.codeLoginBtn.selected) {
        method = @"username";
    } else {
        method = @"captchacode";
    }
    
    [thirdRes setValue:method forKey:@"method"];

    [[RXUserActionLogManager sharedSDK] addUserActionWithScene:@"login" action:@"login" properties:thirdRes];
    
    if (_accountTF.tf.text.length <= 0) {
        [RXHUD showErrorText:@"用户名不能为空"];
        return;
    } else if (!self.codeLoginBtn.selected && _passwordTF.tf.text.length <= 0) {
        NSString *title = @"密码不能为空";
        [RXHUD showErrorText:title];
        return;
    } else if (self.codeLoginBtn.selected && _codeTF.tf.text.length <= 0) {
        NSString *title = @"验证码不能为空";
        [RXHUD showErrorText:title];
        return;
    } else if (!_selectBtn.isSelected) {
        //            [SVProgressHUD showInfoWithStatus:@"请勾选同意用户隐私协议"];
        RXPriView *priView = [[RXPriView alloc] init];
        
        priView.agreeBlock = ^{
//            self.isSelect = !self.isSelect;
//            self.loginConfig.isPrivacySelected = self.isSelect;
            [self selectBtnAction:self.selectBtn];
            [RXHUD hideHUD];
            
//            if (![RXUICommonTool validateMobile:self.accountTF.tf.text]) {
//                [RXHUD showErrorText:@"手机号格式错误，请重新输入"];
//                return;
//            }
            
            if (self.codeLoginBtn.selected) {
                [RXUIUserUtility sharedManager].username = self.accountTF.tf.text;
                
                NSDictionary *loginExt = [NSDictionary dictionary];
                loginExt = self.loginTypeBlock(loginExt, LoginTypeCapCode);
                NSMutableDictionary *loginInfo = [NSMutableDictionary dictionaryWithDictionary:loginExt];
                [loginInfo setValue:self.accountTF.tf.text forKey:@"username"];
                
                NSMutableDictionary *extDic = [NSMutableDictionary dictionary];
                for (int i = 0; i < loginInfo.allKeys.count; i++) {
                    if ([loginInfo.allKeys[i] isEqualToString:@"ext"]) {
                        extDic = [NSMutableDictionary dictionaryWithDictionary:loginInfo.allValues[i]];
                    }
                }
                [extDic setValue:self.codeTF.tf.text forKey:@"captcha_code"];
                [loginInfo setValue:extDic forKey:@"ext"];
                
                CaptchaType captchaType = CaptchaType_phone;
                if ([RXUICommonTool validateEmail:self.accountTF.tf.text]) {
                    captchaType = CaptchaType_email;
                }
                [RXHUD showHUD];
                [[RXApiService sharedSDK] verifyCaptchaCodeWithType:captchaType target:self.accountTF.tf.text purpose:@"login" captcha_code:self.codeTF.tf.text complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                    if (!error) {
                        [RXHUD hideHUD];
                        [[RXLoginViewManager sharedSDK] fetchLoginEvent:LoginTypeCapCode loginInfo:loginInfo complete:self.loginComplete];
                    } else {
                        NSString *msg = error.responesObject[@"msg"];
                        if ([error.responesObject[@"code"] integerValue] == 1120) {
                            msg = @"网络请求失败，请重试或检查网络设置";
                        }
                        
                        [RXHUD showErrorText:msg];
                    }
                }];
                    
            } else {
                [RXUIUserUtility sharedManager].username = self.accountTF.tf.text;
                [RXUIUserUtility sharedManager].password = self.passwordTF.tf.text;
                
                NSDictionary *loginExt = [NSDictionary dictionary];
                if (self.loginTypeBlock) {
                    loginExt = self.loginTypeBlock(loginExt, LoginTypeAccount);
                    NSMutableDictionary *loginInfo = [NSMutableDictionary dictionaryWithDictionary:loginExt];
                    [loginInfo setValue:self.accountTF.tf.text forKey:@"username"];
                    [loginInfo setValue:self.passwordTF.tf.text forKey:@"password"];
                    [[RXLoginViewManager sharedSDK] fetchLoginEvent:LoginTypeAccount loginInfo:loginInfo complete:self.loginComplete];
                }
            }
            
            return;
        };
    } else {
//        if (![RXUICommonTool validateMobile:self.accountTF.tf.text]) {
//            [RXHUD showErrorText:@"手机号格式错误，请重新输入"];
//            return;
//        }
        
        if (self.codeLoginBtn.selected) {
            [RXUIUserUtility sharedManager].username = self.accountTF.tf.text;
            
            NSDictionary *loginExt = [NSDictionary dictionary];
            loginExt = self.loginTypeBlock(loginExt, LoginTypeCapCode);
            NSMutableDictionary *loginInfo = [NSMutableDictionary dictionaryWithDictionary:loginExt];
            [loginInfo setValue:self.accountTF.tf.text forKey:@"username"];
            
            NSMutableDictionary *extDic = [NSMutableDictionary dictionary];
            for (int i = 0; i < loginInfo.allKeys.count; i++) {
                if ([loginInfo.allKeys[i] isEqualToString:@"ext"]) {
                    extDic = [NSMutableDictionary dictionaryWithDictionary:loginInfo.allValues[i]];
                }
            }
            [extDic setValue:self.codeTF.tf.text forKey:@"captcha_code"];
            [loginInfo setValue:extDic forKey:@"ext"];
            
            CaptchaType captchaType = CaptchaType_phone;
            if ([RXUICommonTool validateEmail:self.accountTF.tf.text]) {
                captchaType = CaptchaType_email;
            }
            [RXHUD showHUD];
            [[RXApiService sharedSDK] verifyCaptchaCodeWithType:captchaType target:self.accountTF.tf.text purpose:@"login" captcha_code:self.codeTF.tf.text complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                if (!error) {
                    [RXHUD hideHUD];
                    [[RXLoginViewManager sharedSDK] fetchLoginEvent:LoginTypeCapCode loginInfo:loginInfo complete:self.loginComplete];
                } else {
                    NSString *msg = error.responesObject[@"msg"];
                    if ([error.responesObject[@"code"] integerValue] == 1120) {
                        msg = @"网络请求失败，请重试或检查网络设置";
                    }
                    
                    [RXHUD showErrorText:msg];
                }
            }];
        } else {
            [RXUIUserUtility sharedManager].username = self.accountTF.tf.text;
            [RXUIUserUtility sharedManager].password = self.passwordTF.tf.text;
            
            NSDictionary *loginExt = [NSDictionary dictionary];
            if (self.loginTypeBlock) {
                loginExt = self.loginTypeBlock(loginExt, LoginTypeAccount);
                NSMutableDictionary *loginInfo = [NSMutableDictionary dictionaryWithDictionary:loginExt];
                [loginInfo setValue:self.accountTF.tf.text forKey:@"username"];
                [loginInfo setValue:self.passwordTF.tf.text forKey:@"password"];
                [[RXLoginViewManager sharedSDK] fetchLoginEvent:LoginTypeAccount loginInfo:loginInfo complete:self.loginComplete];
            }
        }
    }
}

- (void)forgetPasswordBtnAction
{
    [self endEditing:YES];
    
    // 用户行为上报
    NSMutableDictionary *thirdRes = [NSMutableDictionary dictionary];
    [thirdRes setValue:@"username" forKey:@"method"];
    [[RXUserActionLogManager sharedSDK] addUserActionWithScene:@"login" action:@"forgot_password" properties:thirdRes];
    
//    RXGetBackPasswordView *getBackView = [[RXGetBackPasswordView alloc] initWithType:GetBackPasswordType_code phone:@"" code:@""];
    NSString *domain = [[RXService sharedSDK] getFirstBaseUrl];
    if (![[domain substringWithRange:NSMakeRange(domain.length - 1, 1)] isEqualToString:@"/"]) {
        domain = [NSString stringWithFormat:@"%@/", domain];
    }
    
    RXWKWebView *webView = [[RXWKWebView alloc] initWithFrame:[UIApplication sharedApplication].keyWindow.frame];
//    webView.urlStr = @"https://10.10.2.64:8083/static/passport/#/user/forgetpassword";
    webView.urlStr = [NSString stringWithFormat:@"%@static/passport/#/user/forgetpassword", domain];
    [[UIApplication sharedApplication].keyWindow addSubview:webView];
}

- (void)codeAction
{
    [self endEditing:YES];
    
    // 用户行为上报
    NSMutableDictionary *thirdRes = [NSMutableDictionary dictionary];
    [thirdRes setValue:@"captchacode" forKey:@"method"];
    [[RXUserActionLogManager sharedSDK] addUserActionWithScene:@"login" action:@"captchacode_send" properties:thirdRes];
    
    if(self.accountTF.tf.text == nil || [self.accountTF.tf.text isEqualToString:@""]){
        [RXHUD showErrorText:@"请输入您的手机号"];
        return;
    }
    
    if (![RXUICommonTool validateMobile:self.accountTF.tf.text]) {
        [RXHUD showErrorText:@"手机号格式错误，请重新输入"];
        return;
    }
    
    if (!_selectBtn.isSelected) {
        RXPriView *priView = [[RXPriView alloc] init];
        priView.agreeBlock = ^{
//            self.isSelect = !self.isSelect;
//            self.loginConfig.isPrivacySelected = self.isSelect;
            
//            - (void)selectBtnAction:(UIButton *)btn
//            [self selectBtnAction:self.selectBtn];
            
            [RXHUD showHUD];
            
            [self selectBtnAction:self.selectBtn];
            
            CaptchaType captchaType = CaptchaType_phone;
            if ([RXUICommonTool validateEmail:self.accountTF.tf.text]) {
                captchaType = CaptchaType_email;
            }
            
            [[RXApiService sharedSDK] getCaptchaCodeWithType:captchaType target:self.accountTF.tf.text purpose:@"login" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                if(error != nil){
                    NSString *msg = error.responesObject[@"msg"];
                    NSInteger errorCode = [error.responesObject[@"code"] integerValue];
                    if (errorCode >= 1000 && errorCode < 2000) {
                        msg = [NSString stringWithFormat:@"网络请求失败，请重试或检查网络设置  （code = %ld）", errorCode];
                    }

                    [RXHUD showErrorText:msg];
                    return;
                } else {
                    [RXHUD showSuccessText:@"已发送验证码"];
                    
                    self.isTimeStart = YES;
                    self.passwordTF.codeLbl.enabled = NO;
                    self.timeCount = 60;
                    NSString *text = [NSString stringWithFormat:@"重新获取(%ld)", (long)self.timeCount];
                    NSDictionary *attribtDic = @{NSUnderlineStyleAttributeName : [NSNumber numberWithInteger:NSUnderlineStyleSingle], NSUnderlineColorAttributeName : [UIColor clearColor]};

                    NSMutableAttributedString *attribtStr = [[NSMutableAttributedString alloc] initWithString:text attributes:attribtDic];
                    [attribtStr addAttribute:NSForegroundColorAttributeName value:[UIColor colorWithHexString:@"#AFAFAF"] range:NSMakeRange(0, text.length)];
                    self.codeTF.codeLbl.attributedText = attribtStr;
                    self.lineX = CGRectGetMinX(self.codeTF.bgView.frame);
                    self.passwordlineX = CGRectGetMinX(self.passwordTF.line.frame);
                    self.codeLblFrame = self.codeTF.codeLbl.frame;
                    
//                    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
//                        self.codeTF.line.frame = CGRectMake(CGRectGetMinX(self.codeTF.line.frame) - 5, CGRectGetMinY(self.codeTF.line.frame), CGRectGetWidth(self.passwordTF.line.frame), CGRectGetHeight(self.codeTF.line.frame));
//                        self.codeTF.codeLbl.frame = CGRectMake(CGRectGetMinX(self.codeTF.codeLbl.frame) - 2, CGRectGetMinY(self.codeTF.codeLbl.frame), CGRectGetWidth(self.codeTF.codeLbl.frame), CGRectGetHeight(self.codeTF.codeLbl.frame));
//                    });
//                    self.passwordTF.line.frame = CGRectMake(CGRectGetMinX(self.codeTF.line.frame) - 5, CGRectGetMinY(self.codeTF.line.frame), CGRectGetWidth(self.passwordTF.line.frame), CGRectGetHeight(self.codeTF.line.frame));
//                    self.codeTF.line.hidden = YES;
//                    self.codeTF.line.frame = CGRectMake(CGRectGetMinX(self.codeTF.line.frame) - 5, CGRectGetMinY(self.codeTF.line.frame), CGRectGetWidth(self.passwordTF.line.frame), CGRectGetHeight(self.codeTF.line.frame));
                    self.codeTF.bgView.frame = CGRectMake(CGRectGetMinX(self.codeTF.bgView.frame) - 5, CGRectGetMinY(self.codeTF.bgView.frame), CGRectGetWidth(self.passwordTF.bgView.frame), CGRectGetHeight(self.codeTF.bgView.frame));
                    self.codeTF.codeLbl.frame = CGRectMake(CGRectGetMinX(self.codeTF.codeLbl.frame) - 2, CGRectGetMinY(self.codeTF.codeLbl.frame), CGRectGetWidth(self.codeTF.codeLbl.frame), CGRectGetHeight(self.codeTF.codeLbl.frame));
                    
                    NSTimer *timer  =  [NSTimer timerWithTimeInterval:1.0 target:self selector:@selector(timered:) userInfo:nil repeats:YES];
                    [[NSRunLoop mainRunLoop] addTimer:timer forMode:NSDefaultRunLoopMode];
                }
            }];
        };
    } else {
        [RXHUD showHUD];
        
        CaptchaType captchaType = CaptchaType_phone;
        if ([RXUICommonTool validateEmail:self.accountTF.tf.text]) {
            captchaType = CaptchaType_email;
        }
        
        [[RXApiService sharedSDK] getCaptchaCodeWithType:captchaType target:self.accountTF.tf.text purpose:@"login" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
            if(error != nil){
                NSString *msg = error.responesObject[@"msg"];
                NSInteger errorCode = [error.responesObject[@"code"] integerValue];
                if (errorCode >= 1000 && errorCode < 2000) {
                    msg = [NSString stringWithFormat:@"网络请求失败，请重试或检查网络设置  （code = %ld）", errorCode];
                }

                [RXHUD showErrorText:msg];
                return;
            } else {
                [RXHUD showSuccessText:@"已发送验证码"];
                
                self.isTimeStart = YES;
                
                self.passwordTF.codeLbl.enabled = NO;
                self.timeCount = 60;
                NSString *text = [NSString stringWithFormat:@"重新获取(%ld)", (long)self.timeCount];
                NSDictionary *attribtDic = @{NSUnderlineStyleAttributeName : [NSNumber numberWithInteger:NSUnderlineStyleSingle], NSUnderlineColorAttributeName : [UIColor clearColor]};

                NSMutableAttributedString *attribtStr = [[NSMutableAttributedString alloc] initWithString:text attributes:attribtDic];
                [attribtStr addAttribute:NSForegroundColorAttributeName value:[UIColor colorWithHexString:@"#AFAFAF"] range:NSMakeRange(0, text.length)];
                self.codeTF.codeLbl.attributedText = attribtStr;
                self.lineX = CGRectGetMinX(self.codeTF.bgView.frame);
                self.passwordlineX = CGRectGetMinX(self.passwordTF.line.frame);
                self.codeLblFrame = self.codeTF.codeLbl.frame;
//                dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
//                    self.codeTF.line.frame = CGRectMake(CGRectGetMinX(self.codeTF.line.frame) - 5, CGRectGetMinY(self.codeTF.line.frame), CGRectGetWidth(self.passwordTF.line.frame), CGRectGetHeight(self.codeTF.line.frame));
//                    self.codeTF.codeLbl.frame = CGRectMake(CGRectGetMinX(self.codeTF.codeLbl.frame) - 2, CGRectGetMinY(self.codeTF.codeLbl.frame), CGRectGetWidth(self.codeTF.codeLbl.frame), CGRectGetHeight(self.codeTF.codeLbl.frame));
//                });
//                self.passwordTF.line.frame = CGRectMake(CGRectGetMinX(self.codeTF.line.frame) - 5, CGRectGetMinY(self.codeTF.line.frame), CGRectGetWidth(self.passwordTF.line.frame), CGRectGetHeight(self.codeTF.line.frame));
                self.codeTF.line.hidden = YES;
//                self.codeTF.line.frame = CGRectMake(CGRectGetMinX(self.codeTF.line.frame) - 5, CGRectGetMinY(self.codeTF.line.frame), CGRectGetWidth(self.passwordTF.line.frame), CGRectGetHeight(self.codeTF.line.frame));
                self.codeTF.bgView.frame = CGRectMake(CGRectGetMinX(self.codeTF.bgView.frame) - 5, CGRectGetMinY(self.codeTF.bgView.frame), CGRectGetWidth(self.passwordTF.bgView.frame), CGRectGetHeight(self.codeTF.bgView.frame));
                self.codeTF.codeLbl.frame = CGRectMake(CGRectGetMinX(self.codeTF.codeLbl.frame) - 2, CGRectGetMinY(self.codeTF.codeLbl.frame), CGRectGetWidth(self.codeTF.codeLbl.frame), CGRectGetHeight(self.codeTF.codeLbl.frame));
                
                NSTimer *timer  =  [NSTimer timerWithTimeInterval:1.0 target:self selector:@selector(timered:) userInfo:nil repeats:YES];
                [[NSRunLoop mainRunLoop] addTimer:timer forMode:NSDefaultRunLoopMode];
            }
        }];
    }
}

- (void)timered:(NSTimer *)time
{
    self.timeCount--;
    if(self.timeCount < 1){
        
        self.isTimeStart = NO;
        
        NSString *text = @"获取验证码";
        NSDictionary *attribtDic = @{NSUnderlineStyleAttributeName: [NSNumber numberWithInteger:NSUnderlineStyleSingle],NSUnderlineColorAttributeName:[UIColor clearColor]};

        NSMutableAttributedString *attribtStr = [[NSMutableAttributedString alloc]initWithString:text attributes:attribtDic];
        self.codeTF.codeLbl.attributedText = attribtStr;
        self.codeTF.codeLbl.textColor = [UIColor colorWithHexString:@"#74D2CB"];
        
//        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
//            self.codeTF.line.frame = CGRectMake(self.lineX, CGRectGetMinY(self.codeTF.line.frame), CGRectGetWidth(self.codeTF.line.frame), CGRectGetHeight(self.codeTF.line.frame));
//            self.codeTF.codeLbl.frame = self.codeLblFrame;
//        });
//        self.passwordTF.line.frame = CGRectMake(self.passwordlineX, CGRectGetMinY(self.passwordTF.line.frame), CGRectGetWidth(self.passwordTF.line.frame), CGRectGetHeight(self.passwordTF.line.frame));
        self.passwordTF.line.hidden = NO;
        self.codeTF.line.hidden = NO;
        self.codeTF.bgView.frame = CGRectMake(self.lineX, CGRectGetMinY(self.codeTF.bgView.frame), CGRectGetWidth(self.codeTF.bgView.frame), CGRectGetHeight(self.codeTF.bgView.frame));
        self.codeTF.codeLbl.frame = self.codeLblFrame;
        self.codeTF.codeLbl.enabled = YES;
        [time invalidate];
        return;
    }
    
    NSString *text = [NSString stringWithFormat:@"重新获取(%ld)", (long)self.timeCount];
    NSDictionary *attribtDic = @{NSUnderlineStyleAttributeName : [NSNumber numberWithInteger:NSUnderlineStyleSingle], NSUnderlineColorAttributeName : [UIColor clearColor]};
    
//    self.passwordTF.line.frame = CGRectMake(CGRectGetMinX(self.passwordTF.line.frame) - 10, CGRectGetMinY(self.passwordTF.line.frame), CGRectGetWidth(self.passwordTF.line.frame), CGRectGetHeight(self.passwordTF.line.frame));

    NSMutableAttributedString *attribtStr = [[NSMutableAttributedString alloc] initWithString:text attributes:attribtDic];
    [attribtStr addAttribute:NSForegroundColorAttributeName value:[UIColor colorWithHexString:@"#AFAFAF"] range:NSMakeRange(0, text.length)];
    self.codeTF.codeLbl.attributedText = attribtStr;
//    self.passwordTF2.codeLbl.textColor = [UIColor colorWithHexString:@"#74D2CB"];
}


#pragma mark -- <UITextFieldDelegate>
- (void)textFieldDidBeginEditing:(UITextField *)textField
{
    // 用户行为上报
    NSMutableDictionary *thirdRes = [NSMutableDictionary dictionary];
    
    NSString *action = @"";
    NSString *method = @"";
    
    if (!self.codeLoginBtn.selected) {
        method = @"username";
        if (textField == _accountTF.tf) {
            action = @"account_tf";
        }
        if (textField == _passwordTF.tf) {
            action = @"password_tf";
        }
    } else {
        method = @"captchacode";
        if (textField == _accountTF.tf) {
            action = @"phone_tf";
        }
        if (textField == _codeTF.tf) {
            action = @"captchacode_tf";
        }
    }
    
    [thirdRes setValue:method forKey:@"method"];
    
    [[RXUserActionLogManager sharedSDK] addUserActionWithScene:@"login" action:action properties:thirdRes];
}

- (BOOL)textFieldShouldReturn:(UITextField *)textField
{
    [textField endEditing:YES];
    
//    if ([RXUICommonTool validateMobile:self.accountTF.tf.text] && !self.isFirstAutoChange && self.passwordTF.tf.text.length <= 0 && !self.codeLoginBtn.selected) {
//        
//        self.phoneNum = self.accountTF.tf.text;
//        [self codeLoginBtnAction:self.changeBtn];
//        self.isFirstAutoChange = YES;
//    }
    
    return YES;
}

- (void)textViewDidChangeSelection:(UITextView *)textView
{
    self.isChange = YES;
    NSString *str = textView.text;
    if (str.length > 0) {
        if (textView == _accountTF.tf) {
            _accountTF.placeholderLbl.hidden = YES;
        }
        if (textView == _passwordTF.tf) {
            _passwordTF.placeholderLbl.hidden = YES;
            if (!self.codeLoginBtn.selected) {
                _passwordTF.showPwdBtn.hidden = NO;
            }
        }
        if (textView == _codeTF.tf) {
            _codeTF.placeholderLbl.hidden = YES;
            if (!self.codeLoginBtn.selected) {
                _codeTF.showPwdBtn.hidden = NO;
            }
        }
    } else {
        if (textView == _accountTF.tf) {
            _accountTF.placeholderLbl.hidden = NO;
        }
        if (textView == _passwordTF.tf) {
            _passwordTF.placeholderLbl.hidden = NO;
            if (!self.codeLoginBtn.selected) {
                _passwordTF.showPwdBtn.hidden = YES;
            }
        }
        if (textView == _codeTF.tf) {
            _codeTF.placeholderLbl.hidden = NO;
            if (!self.codeLoginBtn.selected) {
                _codeTF.showPwdBtn.hidden = YES;
            }
        }
    }
    
    if (!self.codeLoginBtn.selected) {
        if (textView == _passwordTF.tf && str.length > 32) {
            _passwordTF.tf.text = [str substringToIndex:32];
//            [RXHUD showText:@"密码长度不能超过32位"];
        }
        if (_accountTF.tf.text.length > 0 && _passwordTF.tf.text.length > 0) {
            _loginBtn.userInteractionEnabled = YES;
            [_loginBtn setBackgroundColor:[UIColor colorWithHexString:@"20C0B3"]];
        } else {
            _loginBtn.userInteractionEnabled = NO;
            [_loginBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
        }
    } else {
        if (textView == _passwordTF.tf && str.length > 6) {
            _codeTF.tf.text = [str substringToIndex:6];
        }
        if (textView == _accountTF.tf) {
            // 过滤空格
            _accountTF.tf.text = [_accountTF.tf.text stringByReplacingOccurrencesOfString:@" " withString:@""];
        }
        if (_accountTF.tf.text.length > 0 && _codeTF.tf.text.length > 0) {
            _loginBtn.userInteractionEnabled = YES;
            [_loginBtn setBackgroundColor:[UIColor colorWithHexString:@"20C0B3"]];
        } else {
            _loginBtn.userInteractionEnabled = NO;
            [_loginBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
        }
    }
}

//- (void)textFieldDidChangeSelection:(UITextField *)textField
//{
//    NSString *str = textField.text;
//    if (str.length > 0) {
//        if (textField == _accountTF.tf) {
//            _accountTF.placeholderLbl.hidden = YES;
//        }
//        if (textField == _passwordTF.tf) {
//            _passwordTF.placeholderLbl.hidden = YES;
//            if (!self.codeLoginBtn.selected) {
//                _passwordTF.showPwdBtn.hidden = NO;
//            }
//        }
//    } else {
//        if (textField == _accountTF.tf) {
//            _accountTF.placeholderLbl.hidden = NO;
//        }
//        if (textField == _passwordTF.tf) {
//            _passwordTF.placeholderLbl.hidden = NO;
//            if (!self.codeLoginBtn.selected) {
//                _passwordTF.showPwdBtn.hidden = YES;
//            }
//        }
//    }
//
//    if (!self.codeLoginBtn.selected) {
//        if (textField == _passwordTF.tf && str.length > 32) {
//            _passwordTF.tf.text = [str substringToIndex:32];
////            [RXHUD showText:@"密码长度不能超过32位"];
//        }
//        if (_accountTF.tf.text.length > 0 && _passwordTF.tf.text.length > 0) {
//            _loginBtn.userInteractionEnabled = YES;
//            [_loginBtn setBackgroundColor:[UIColor colorWithHexString:@"20C0B3"]];
//        } else {
//            _loginBtn.userInteractionEnabled = NO;
//            [_loginBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
//        }
//    } else {
//        if (textField == _passwordTF.tf && str.length > 6) {
//            _passwordTF.tf.text = [str substringToIndex:6];
//        }
//        if (textField == _accountTF.tf) {
//            // 过滤空格
//            _accountTF.tf.text = [_accountTF.tf.text stringByReplacingOccurrencesOfString:@" " withString:@""];
//        }
//        if (_accountTF.tf.text.length > 0 && _passwordTF.tf.text.length > 0) {
//            _loginBtn.userInteractionEnabled = YES;
//            [_loginBtn setBackgroundColor:[UIColor colorWithHexString:@"20C0B3"]];
//        } else {
//            _loginBtn.userInteractionEnabled = NO;
//            [_loginBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
//        }
//    }
//}

- (BOOL)textField:(UITextField *)textField shouldChangeCharactersInRange:(NSRange)range replacementString:(NSString *)string
{
    self.isChange = YES;
    NSString *str = textField.text;
    if (string.length > 0) {
        if (textField == _accountTF.tf) {
            _accountTF.placeholderLbl.hidden = YES;
            
            if (_passwordTF.tf.text.length > 0) {
                _loginBtn.userInteractionEnabled = YES;
                [_loginBtn setBackgroundColor:[UIColor colorWithHexString:@"20C0B3"]];
            } else {
                _loginBtn.userInteractionEnabled = NO;
                [_loginBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
            }
            
            NSString *fetchStr = [NSString stringWithFormat:@"%@%@", str, string];
//            if (fetchStr.length >= 11) {
//                if ([RXUICommonTool validateMobile:fetchStr] && !self.isFirstAutoChange && self.passwordTF.tf.text.length <= 0 && !self.codeLoginBtn.selected) {
//                    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{                    
//                        [self codeLoginBtnAction:self.changeBtn];
//                    });
//                    self.phoneNum = self.accountTF.tf.text;
//                    self.isFirstAutoChange = YES;
//                }
//            }
        }
        if (textField == _passwordTF.tf) {
            _passwordTF.placeholderLbl.hidden = YES;
            if (!self.codeLoginBtn.selected) {
                _passwordTF.showPwdBtn.hidden = NO;
            }
            
            if (_accountTF.tf.text.length > 0) {
                _loginBtn.userInteractionEnabled = YES;
                [_loginBtn setBackgroundColor:[UIColor colorWithHexString:@"20C0B3"]];
            } else {
                _loginBtn.userInteractionEnabled = NO;
                [_loginBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
            }
        }
        if (textField == _codeTF.tf) {
            _codeTF.placeholderLbl.hidden = YES;
            if (!self.codeLoginBtn.selected) {
                _passwordTF.showPwdBtn.hidden = NO;
            }
            
            if (_accountTF.tf.text.length > 0) {
                _loginBtn.userInteractionEnabled = YES;
                [_loginBtn setBackgroundColor:[UIColor colorWithHexString:@"20C0B3"]];
            } else {
                _loginBtn.userInteractionEnabled = NO;
                [_loginBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
            }
        }
    } else {
        if (str.length == 1) {
            _loginBtn.userInteractionEnabled = NO;
            [_loginBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
            
            if (textField == _accountTF.tf) {
                _accountTF.placeholderLbl.hidden = NO;
            }
            if (textField == _passwordTF.tf) {
                _passwordTF.placeholderLbl.hidden = NO;
                if (!self.codeLoginBtn.selected) {
                    _passwordTF.showPwdBtn.hidden = YES;
                }
            }
            if (textField == _codeTF.tf) {
                _codeTF.placeholderLbl.hidden = NO;
                if (!self.codeLoginBtn.selected) {
                    _codeTF.showPwdBtn.hidden = YES;
                }
            }
            [RXUIUserUtility sharedManager].username = @"";
        } else {
//            dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.2 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
//                if (textField.text.length <= 0) {
//                    self.loginBtn.userInteractionEnabled = NO;
//                    [self.loginBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
//                    
//                    if (textField == self.accountTF.tf) {
//                        self.accountTF.placeholderLbl.hidden = NO;
//                    }
//                    if (textField == self.passwordTF.tf) {
//                        self.passwordTF.placeholderLbl.hidden = NO;
//                        if (!self.codeLoginBtn.selected) {
//                            self.passwordTF.showPwdBtn.hidden = YES;
//                        }
//                    }
//                    [RXUIUserUtility sharedManager].username = @"";
//                }
//            });
        }
    }
    
    if (!self.codeLoginBtn.selected) {
        if (textField == _passwordTF.tf && str.length > 31 && string.length > 0) {
            return NO;
//            _passwordTF.tf.text = [str substringToIndex:32];
            //            [RXHUD showText:@"密码长度不能超过32位"];
        }
        
        if (string.length > 0) {
    //        textField.text = [NSString stringWithFormat:@"%@%@", textField.text, string];
        } else {
            if (textField.text.length > 1) {
//                [self changeText:textField];
//                return NO;
            }
        }
        
//        if (_accountTF.tf.text.length > 0 && _passwordTF.tf.text.length > 0) {
//            _loginBtn.userInteractionEnabled = YES;
//            [_loginBtn setBackgroundColor:[UIColor colorWithHexString:@"20C0B3"]];
//        } else {
//            _loginBtn.userInteractionEnabled = NO;
//            [_loginBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
//        }
    } else {
        if (textField == _passwordTF.tf && str.length > 5 && string.length > 0) {
            return NO;
//            _passwordTF.tf.text = [str substringToIndex:6];
        }
        if (textField == _accountTF.tf) {
            if ([string isEqualToString:@" "]) {
                return NO;
            }
            // 过滤空格
            _accountTF.tf.text = [_accountTF.tf.text stringByReplacingOccurrencesOfString:@" " withString:@""];
        }
//        if (_accountTF.tf.text.length > 0 && _passwordTF.tf.text.length > 0) {
//            _loginBtn.userInteractionEnabled = YES;
//            [_loginBtn setBackgroundColor:[UIColor colorWithHexString:@"20C0B3"]];
//        } else {
//            _loginBtn.userInteractionEnabled = NO;
//            [_loginBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
//        }
    }
    return YES;
}

- (void)changeText:(UITextField *)textField
{
    textField.text = [textField.text substringToIndex:textField.text.length - 1];
}

- (void)closeBtnAction
{
//    if ([RXUIUserUtility sharedManager].isAuthFirst) {
//        [[NSNotificationCenter defaultCenter] postNotificationName:RXUINoti_closeAuthView object:nil userInfo:nil];
//    }
    
    NSMutableArray *accounts = [RXUIUserUtility sharedManager].accounts;
    
    if (accounts.count > 0) {
        for (UIView *v in [UIApplication sharedApplication].keyWindow.subviews) {
            if ([v isKindOfClass:[RXHistoryLoginView class]]) {
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
    
    // 用户行为上报
    NSMutableDictionary *thirdRes = [NSMutableDictionary dictionary];
    NSString *method = @"";
    
    if (!self.codeLoginBtn.selected) {
        method = @"username";
    } else {
        method = @"captchacode";
    }
    
    [thirdRes setValue:method forKey:@"method"];

    [[RXUserActionLogManager sharedSDK] addUserActionWithScene:@"login" action:@"close" properties:thirdRes];
    
    [self hide];
}

#pragma mark -- <RXAttributeLabelDelegate>
- (void)rxAttributeClick:(NSString *)text offset:(NSInteger)offset
{
    NSString *url = @"";
    NSString *reportUrl = @"";
    NSArray *privacies = [RXUIUserUtility sharedManager].privacies;
    NSArray *privacieTitles = self.loginConfig.privacieTitles;
    
    for (int i = 0; i < self.selectBtnTextCounts.count; i++) {
        NSInteger selectBtnCount = [self.selectBtnTextCounts[i] integerValue];
        if (offset == selectBtnCount) {
            [self selectBtnAction:self.selectBtn];
            return;
        }
    }
    
    if (text.length > 0) {
        if (privacieTitles.count > 0) {
            for (int i = 0; i < privacieTitles.count; i++) {
                if ([text isEqualToString:privacieTitles[i]]) {
                    if (privacies && privacies.count > 0) {
                        reportUrl = privacies[i];
                        NSString *title = privacieTitles[i];
                        title = [title stringByReplacingOccurrencesOfString:@"《" withString:@""];
                        title = [title stringByReplacingOccurrencesOfString:@"》" withString:@""];
                        RXCommonWKWebView *webView = [[RXCommonWKWebView alloc] initWithUrl:privacies[i] title:title content:nil];
                    }
                }
            }
        } else {
            if ([text isEqualToString:@"用户协议"]) {
                if (privacies && privacies.count > 0) {
                    url = privacies[0];
                    reportUrl = url;
                    RXCommonWKWebView *webView = [[RXCommonWKWebView alloc] initWithUrl:url title:@"用户协议" content:nil];
                } else {
                    NSMutableDictionary *dic = [[NSUserDefaults standardUserDefaults] valueForKey:@"rx_legal"];
                    NSMutableArray *terms = dic[@"terms"];
                    NSString *content = @"";
                    if (self.loginConfig.privacies.count > 0) {
                        content = self.loginConfig.privacies[0];
                    }
    //                for (int i = 0; i < terms.count; i++) {
    //                    NSMutableDictionary *termInfo = terms[i];
    //                    NSString *key = termInfo[@"key"];
    //                    if ([key isEqualToString:@"00001"]) {
    //                        content = termInfo[@"content"];
    //                    }
    //                }
                    reportUrl = @"00001";
                    RXCommonWKWebView *webView = [[RXCommonWKWebView alloc] initWithUrl:nil title:@"用户协议" content:content];
                }
                
            } else if ([text isEqualToString:@"隐私政策"]) {
                if (privacies && privacies.count > 1) {
                    url = privacies[1];
                    reportUrl = url;
                    RXCommonWKWebView *webView = [[RXCommonWKWebView alloc] initWithUrl:url title:@"隐私政策" content:nil];
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
                    reportUrl = @"00002";
                    RXCommonWKWebView *webView = [[RXCommonWKWebView alloc] initWithUrl:nil title:@"隐私政策" content:content];
                }
            } else {
                if (privacies && privacies.count > 2) {
                    url = privacies[2];
                    reportUrl = url;
                    RXCommonWKWebView *webView = [[RXCommonWKWebView alloc] initWithUrl:url title:privacieTitles[2] content:nil];
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
                    reportUrl = @"00002";
                    RXCommonWKWebView *webView = [[RXCommonWKWebView alloc] initWithUrl:nil title:privacieTitles[2] content:content];
                }
            }
        }
        
        // 用户行为上报
        NSMutableDictionary *thirdRes = [NSMutableDictionary dictionary];
        NSString *method = @"";
        
        if (!self.codeLoginBtn.selected) {
            method = @"username";
        } else {
            method = @"captchacode";
        }
        
        [thirdRes setValue:method forKey:@"method"];
        
        if (reportUrl.length > 0) {
            [thirdRes setValue:reportUrl forKey:@"url"];
        }

        [[RXUserActionLogManager sharedSDK] addUserActionWithScene:@"login" action:@"privacy" properties:thirdRes];
        
    } else {
        [self selectBtnAction:self.selectBtn];
    }
}

- (void)setIsShowBack:(BOOL)isShowBack
{
    if (isShowBack) {
        self.backBtn.hidden = NO;
        self.closeBtn.hidden = YES;
    } else {
        self.backBtn.hidden = YES;
        self.closeBtn.hidden = NO;
    }
}

#pragma mark -- <lazy>
- (UIView *)bgView
{
    if (!_bgView) {
        _bgView = [[UIView alloc] init];
        _bgView.backgroundColor = [UIColor whiteColor];
        _bgView.layer.cornerRadius = 4;
    }
    return _bgView;
}

- (UILabel *)titleLbl
{
    if (!_titleLbl) {
        _titleLbl = [[UILabel alloc] init];
        _titleLbl.text = @"登录";
        _titleLbl.font = [UIFont boldSystemFontOfSize:18];
        _titleLbl.textAlignment = NSTextAlignmentCenter;
    }
    return _titleLbl;
}

- (RXSelectBtn *)selectBtn
{
    if (!_selectBtn) {
        _selectBtn = [RXSelectBtn buttonWithType:UIButtonTypeCustom];
        _selectBtn.adjustsImageWhenHighlighted = NO;
        _selectBtn.selected = self.isSelect;
        NSString *image = @"rx_priUnSelect";
        if (self.isSelect) {
            image = @"rx_priSelect";
        }
        [_selectBtn setImage:[UIImage rxBundleImageNamed:image] forState:UIControlStateNormal];
        [_selectBtn addTarget:self action:@selector(selectBtnAction:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _selectBtn;
}

- (RXAttributeLabel *)priLbl
{
    if (!_priLbl) {
        _priLbl = [[RXAttributeLabel alloc] init];
        
        NSArray *privacieTitles = self.loginConfig.privacieTitles;
        NSArray *clickTextList = @[@"用户协议", @"隐私政策"];
        NSString *title = @"我已阅读并同意";
        
        if (privacieTitles.count > 0) {
            for (int i = 0; i < privacieTitles.count; i++) {
                if (i == 0) {
                    [self.selectBtnTextCounts addObject:@(title.length + 2)];
                    title = [NSString stringWithFormat:@"%@%@", title, privacieTitles[i]];
                    if ([NSString stringWithFormat:@"%@", privacieTitles[i]].length >= 3) {
                        [self.selectBtnTextCounts addObject:@(title.length)];
                    }
                } else {
                    if ([NSString stringWithFormat:@"%@", privacieTitles[i]].length >= 3) {
                        [self.selectBtnTextCounts addObject:@(title.length + 2)];
                    }
                    title = [NSString stringWithFormat:@"%@、%@", title, privacieTitles[i]];
                    if ([NSString stringWithFormat:@"%@", privacieTitles[i]].length >= 3) {
                        [self.selectBtnTextCounts addObject:@(title.length)];
                    }
                }
            }
            clickTextList = privacieTitles;
        } else {
            title = @"我已阅读并同意 用户协议、隐私政策";
        }
        self.priText = title;
        _priLbl.text = title;
        _priLbl.clickTextlist = clickTextList;
        _priLbl.clickTextColor = [UIColor colorWithHexString:@"20C0B3"];
        _priLbl.textColor = [UIColor colorWithHexString:@"999999"];
        _priLbl.delegate = self;
        CGFloat size = RXAC ? 14 : (privacieTitles.count >= 3 ? 14 : 16);
        _priLbl.font = [UIFont systemFontOfSize:size weight:UIFontWeightRegular];
    }
    return _priLbl;
}

- (RXCloseBtn *)closeBtn
{
    if (!_closeBtn) {
        _closeBtn = [RXCloseBtn buttonWithType:UIButtonTypeCustom];
        _closeBtn.adjustsImageWhenHighlighted = NO;
        [_closeBtn setImage:[UIImage rxBundleImageNamed:@"rx_close"] forState:UIControlStateNormal];
        [_closeBtn addTarget:self action:@selector(closeBtnAction) forControlEvents:UIControlEventTouchUpInside];
//        if ([RXUIUserUtility sharedManager].isFirstView) {
//            _closeBtn.hidden = NO;
//        } else {
//            _closeBtn.hidden = YES;
//        }
        _closeBtn.hidden = NO;
    }
    return _closeBtn;
}

- (RXTextField *)accountTF
{
    if (!_accountTF) {
        _accountTF = [[RXTextField alloc] initWithPlaceholder:@"请输入您的账号" type:TFType_clear keyboardType:UIKeyboardTypeNumbersAndPunctuation];
        _accountTF.tf.delegate = self;
        _accountTF.tf.returnKeyType = UIReturnKeyDone;
    }
    return _accountTF;
}

- (RXTextField *)passwordTF
{
    if (!_passwordTF) {
        _passwordTF = [[RXTextField alloc] initWithPlaceholder:@"请输入您的密码" type:TFType_pwd keyboardType:UIKeyboardTypeDefault];
        _passwordTF.tf.secureTextEntry = YES;
        _passwordTF.tf.delegate = self;
        
        __weak __typeof__(self) weakSelf = self;
        _passwordTF.forgetBlock = ^{
            [weakSelf forgetPasswordBtnAction];
        };
        _passwordTF.clearBlock = ^{
            [weakSelf codeAction];
        };
    }
    return _passwordTF;
}

- (RXTextField *)codeTF
{
    if (!_codeTF) {
        _codeTF = [[RXTextField alloc] initWithPlaceholder:@"请输入您的验证码" type:TFType_loginCode keyboardType:UIKeyboardTypeDefault];
        _codeTF.tf.delegate = self;
//        _codeTF.hidden = YES;
        
        __weak __typeof__(self) weakSelf = self;
        _codeTF.forgetBlock = ^{
            [weakSelf forgetPasswordBtnAction];
        };
        _codeTF.clearBlock = ^{
            [weakSelf codeAction];
        };
    }
    return _codeTF;
}

- (UIButton *)loginBtn
{
    if (!_loginBtn) {
        _loginBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_loginBtn setTitle:@"登录" forState:UIControlStateNormal];
        [_loginBtn setTitleColor:[UIColor colorWithHexString:@"F2FFFB"] forState:UIControlStateNormal];
        [_loginBtn setBackgroundColor:[UIColor colorWithHexString:@"20C0B3"]];
        _loginBtn.titleLabel.font = [UIFont systemFontOfSize:18 weight:UIFontWeightMedium];
        _loginBtn.layer.cornerRadius = 5;
        [_loginBtn addTarget:self action:@selector(loginBtnAction) forControlEvents:UIControlEventTouchUpInside];
        _loginBtn.userInteractionEnabled = NO;
        [_loginBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
    }
    return _loginBtn;
}

- (UIButton *)codeLoginBtn
{
    if (!_codeLoginBtn) {
        _codeLoginBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        _codeLoginBtn.userInteractionEnabled = NO;
        [_codeLoginBtn setTitle:@"" forState:UIControlStateNormal];
        [_codeLoginBtn setTitleColor:[UIColor colorWithHexString:@"25B2A6"] forState:UIControlStateNormal];
        _codeLoginBtn.titleLabel.font = [UIFont systemFontOfSize:14];
        [_codeLoginBtn addTarget:self action:@selector(codeLoginBtnAction:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _codeLoginBtn;
}

- (UIButton *)forgetPasswordBtn
{
    if (!_forgetPasswordBtn) {
        _forgetPasswordBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_forgetPasswordBtn setTitle:@"忘记密码" forState:UIControlStateNormal];
        [_forgetPasswordBtn setTitleColor:[UIColor colorWithHexString:@"25B2A6"] forState:UIControlStateNormal];
        _forgetPasswordBtn.titleLabel.font = [UIFont systemFontOfSize:14];
        [_forgetPasswordBtn addTarget:self action:@selector(forgetPasswordBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _forgetPasswordBtn;
}

- (RXCloseBtn *)backBtn
{
    if (!_backBtn) {
        _backBtn = [RXCloseBtn buttonWithType:UIButtonTypeCustom];
        [_backBtn setImage:[UIImage rxBundleImageNamed:@"rx_back"] forState:UIControlStateNormal];
        [_backBtn addTarget:self action:@selector(hide) forControlEvents:UIControlEventTouchUpInside];
//        if ([RXUIUserUtility sharedManager].isFirstView) {
//            _backBtn.hidden = YES;
//        } else {
//            _backBtn.hidden = NO;
//        }
        _backBtn.hidden = YES;
    }
    return _backBtn;
}

- (UIImageView *)logoImageView
{
    if (!_logoImageView) {
        _logoImageView = [[UIImageView alloc] init];
        _logoImageView.contentMode = UIViewContentModeScaleAspectFill;
    }
    return _logoImageView;
}

- (UILabel *)moreLoginTipLbl
{
    if (!_moreLoginTipLbl) {
        _moreLoginTipLbl = [[UILabel alloc] init];
        _moreLoginTipLbl.text = @"其他登录方式";
        _moreLoginTipLbl.textColor = [UIColor colorWithHexString:@"#8DAAAA"];
        _moreLoginTipLbl.font = [UIFont systemFontOfSize:16];
        _moreLoginTipLbl.textAlignment = NSTextAlignmentCenter;
        _moreLoginTipLbl.hidden = YES;
    }
    return _moreLoginTipLbl;
}

- (UIView *)alphaView
{
    if (!_alphaView) {
        _alphaView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, [UIApplication sharedApplication].keyWindow.frame.size.width, [UIApplication sharedApplication].keyWindow.frame.size.height)];
        _alphaView.tag = AlphaTag;
    }
    return _alphaView;
}

- (NSMutableArray *)selectBtnTextCounts
{
    if (!_selectBtnTextCounts) {
        _selectBtnTextCounts = [NSMutableArray array];
    }
    return _selectBtnTextCounts;
}

- (RXLoginChangeBtn *)changeBtn
{
    if (!_changeBtn) {
        _changeBtn = [RXLoginChangeBtn buttonWithType:UIButtonTypeCustom];
        [_changeBtn setImage:[UIImage rxBundleImageNamed:@"rx_login_change_new"] forState:normal];
        [_changeBtn setTitle:@"验证码登录" forState:normal];
        _changeBtn.titleLabel.font = [UIFont systemFontOfSize:15.5];
        [_changeBtn setTitleColor:[UIColor colorWithHexString:@"#315E5A"] forState:normal];
        [_changeBtn addTarget:self action:@selector(codeLoginBtnAction:) forControlEvents:UIControlEventTouchUpInside];
        
        _changeBtn.hidden = YES;
    }
    return _changeBtn;
}

- (UIScrollView *)animateBg
{
    if (!_animateBg) {
        _animateBg = [[UIScrollView alloc] init];
//        _animateBg.clipsToBounds = NO;
        _animateBg.scrollEnabled = NO;
    }
    return _animateBg;
}

// 更多登录方式分割线
- (UIView *)otherLoginTip
{
    UIView *tipView = [[UIView alloc] initWithFrame:CGRectMake(RXAC ? 21 : 25, RXAC ? 228 : 263, [RXUICommonTool getScreenWidth] - (RXAC ? 42 : 50), 16)];
    
    CGFloat lblW = 100;
    CGFloat space = 4;
    
    UIView *leftLine = [[UIView alloc] initWithFrame:CGRectMake(0, CGRectGetHeight(tipView.frame) / 2 - 0.25, CGRectGetWidth(tipView.frame) / 2 - lblW / 2 - space, 0.75)];
    leftLine.backgroundColor = [UIColor colorWithHexString:@"#D8D8D8"];
    
    UILabel *tipLbl = [[UILabel alloc] initWithFrame:CGRectMake(CGRectGetWidth(tipView.frame) / 2 - (lblW / 2), 0, lblW, CGRectGetHeight(tipView.frame))];
    tipLbl.text = @"其他登录方式";
    tipLbl.textColor = [UIColor colorWithHexString:@"#A3A3A3"];
    tipLbl.font = [UIFont systemFontOfSize:12.75];
//    tipLbl.backgroundColor = [UIColor whiteColor];
    tipLbl.textAlignment = NSTextAlignmentCenter;
    
    UIView *rightLine = [[UIView alloc] initWithFrame:CGRectMake(CGRectGetMaxX(tipLbl.frame) + space, CGRectGetHeight(tipView.frame) / 2 - 0.25, CGRectGetWidth(leftLine.frame), 0.75)];
    rightLine.backgroundColor = [UIColor colorWithHexString:@"#D8D8D8"];
    
    [tipView addSubview:leftLine];
    [tipView addSubview:tipLbl];
    [tipView addSubview:rightLine];
    
    return tipView;
}

@end
