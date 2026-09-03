//
//  RXLoginView.m
//  RXSDK
//
//  Created by 陈汉 on 2021/9/29.
//

#import "RXOSEmailLoginView.h"
#import "RXOSCommonTool.h"
#import "RXOSAddLoginView.h"
#import "RXOSCommonWKWebView.h"
#import "RXOSGetBackPasswordView.h"
#import "RXOSLoginViewManager.h"
#import "RXOSQuickLoginView.h"
#import <RXSDK_Pure/RXErrorTool.h>
#import "RXOSCloseBtn.h"
#import "UIView+RXOSShade.h"
#import "RXOSLegalModel.h"
#import "RXOSHistoryLoginView.h"
#import "RXOSWKWebView.h"
#import "RXOSLoginChangeBtn.h"
#import "RXOSSetPasswordView.h"

#define LoginBtnTag 100000
#define AlphaTag 200000
#define BGH RXAC ? 260 : 300

@interface RXOSEmailLoginView () <UITextFieldDelegate, UITextViewDelegate>

@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) UIScrollView *animateBg;
@property (nonatomic, strong) UIView *alphaView;
@property (nonatomic, strong) UILabel *titleLbl;
@property (nonatomic, strong) RXOSCloseBtn *closeBtn;
@property (nonatomic, assign) NSInteger orientation;  // 屏幕方向 1竖屏 2横屏
@property (nonatomic, assign) BOOL needSet;
@property (nonatomic, assign) BOOL isSelect;
@property (nonatomic, assign) BOOL isFirstLoad;
@property (nonatomic, assign) BOOL isFirst;
@property (nonatomic, assign) BOOL isFirstAutoChange;
@property (nonatomic, assign) BOOL isShowKeyboard;
@property (nonatomic, strong) NSString *phoneNum;
@property (nonatomic, copy) LoginTypeBlock loginTypeBlock;
@property (nonatomic, copy) LoginComplete loginComplete;
@property (nonatomic, strong) RXOSAddLoginView *addLoginView;
@property (nonatomic, strong) RXOSTextField *accountTF;
@property (nonatomic, strong) RXOSTextField *passwordTF;
@property (nonatomic, strong) RXOSTextField *codeTF;
@property (nonatomic, strong) UIButton *loginBtn;
@property (nonatomic, strong) UIButton *forgetPasswordBtn;
@property (nonatomic, strong) RXOSCloseBtn *backBtn;
@property (nonatomic, strong) RXOSUILoginConfig *loginConfig;

@property (nonatomic, strong) UIImageView *logoImageView;
@property (nonatomic, strong) UIImage *logoImage;
@property (nonatomic, strong) UILabel *moreLoginTipLbl;
@property (nonatomic, assign) NSInteger timeCount;
@property (nonatomic, assign) CGFloat lineX;
@property (nonatomic, strong) NSMutableArray *selectBtnTextCounts;
@property (nonatomic, assign) CGRect codeLblR;
@property (nonatomic, assign) CGRect codeTFR;
@property (nonatomic, assign) CGRect codePlaceR;
@property (nonatomic, strong) RXOSLoginChangeBtn *changeBtn;

@end

@implementation RXOSEmailLoginView

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
        self.needSet = YES;
        self.isFirst = YES;
        self.loginConfig = config;
        
//        self.logoImg = applogo;
//        self.addAccountBlock = addAccount;
        self.loginTypeBlock = loginEvent;
        self.loginComplete = complete;
        self.logoImage = config.logoImage;
        
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
        
//        if ([RXOSUserUtility sharedManager].isFirstView) {
//            if (config.isShowClose) {
//                self.closeBtn.hidden = NO;
//            } else {
//                self.closeBtn.hidden = YES;
//            }
//        }
        
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(getBackPassword:) name:RXUINoti_changePwd object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(resetPwd:) name:RXUINoti_resetPwd object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(refreshLoginUI:) name:RXUINoti_refreshLoginUI object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyBoardWillShow:) name:UIKeyboardWillShowNotification object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyBoardWillHide:) name:UIKeyboardWillHideNotification object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(slideCodeSuc:) name:noti_slideCodeSuc object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self
                                                     selector:@selector(textFieldTextDidChange:)
                                                         name:UITextFieldTextDidChangeNotification
                                                       object:self.accountTF.tf];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyBoardWillShow:) name:UIKeyboardWillShowNotification object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyBoardWillHide:) name:UIKeyboardWillHideNotification object:nil];
    }
    return self;
}

- (void)textFieldTextDidChange:(NSNotification *)notification {
    UITextField *textField = (UITextField *)notification.object;
    UIPasteboard *pasteboard = [UIPasteboard generalPasteboard];
    
    if (textField.text.length <= 0) {
        _accountTF.placeholderLbl.hidden = NO;
        _loginBtn.userInteractionEnabled = NO;
        self.accountTF.placehoder = @"请输入您的邮箱";
        [_loginBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
    }
}

- (void)tapAction:(UITapGestureRecognizer *)tap
{
    [self endEditing:YES];
    
//    if ([RXOSCommonTool validateEmail:self.accountTF.tf.text] && !self.isFirstAutoChange && self.passwordTF.tf.text.length <= 0 && !self.codeLoginBtn.selected) {
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
        CGFloat bgH = self.orientation == 2 ? 300 : 266;
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
        CGFloat bgH = 232;
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
//    [self.bgView addSubview:self.passwordTF];
//    [self.bgView addSubview:self.codeTF];
    [self.bgView addSubview:self.changeBtn];
    [self.bgView addSubview:self.loginBtn];
    [self.bgView addSubview:self.codeLoginBtn];
//    [self.bgView addSubview:self.forgetPasswordBtn];
    [self.bgView addSubview:self.backBtn];
    [self.bgView addSubview:self.moreLoginTipLbl];
    
    [self.bgView addSubview:self.animateBg];
    [self.animateBg addSubview:self.passwordTF];
    [self.animateBg addSubview:self.codeTF];
    
    [self layoutViews];
}

- (void)layoutViews
{
    UIView *window = [UIApplication sharedApplication].keyWindow;
    
    CGFloat bgH = BGH;
 
    _bgView.frame = CGRectMake(0, 0, [RXOSCommonTool getScreenWidth], bgH);
    _bgView.center = window.center;
    
//    if (self.logoImage) {
    _titleLbl.hidden = YES;
    _logoImageView.hidden = NO;
    _logoImageView.frame = CGRectMake(CGRectGetWidth(_bgView.frame) / 2 - 108 / 2 - 1.6, RXAC ? 15.2 : 24, RXAC ? 110.4 : 110.2, 23.6);
    if ([self.logoImage isKindOfClass:[UIImage class]]) {
        _logoImageView.image = self.logoImage;
    } else {
        _logoImageView.image = [RXOSCommonTool getImageFromURL:(NSString *)self.logoImage];
    }

    _logoImageView.frame = CGRectMake([RXOSCommonTool getScreenWidth] / 2 - 108 / 2 - 1.6, RXAC ? 15.2 : 24, RXAC ? 110.4 : 110.2, 23.6);
    _accountTF.frame = CGRectMake(RXAC ? 29 : 25, RXAC ? 57 : 68, [RXOSCommonTool getScreenWidth] - (RXAC ? 59 : 50), RXAC ? 36 : 46);
    _animateBg.frame = CGRectMake(CGRectGetMinX(_accountTF.frame), CGRectGetMaxY(_accountTF.frame) + 12, CGRectGetWidth(self.accountTF.frame), CGRectGetHeight(_accountTF.frame));
    _codeTF.frame = CGRectMake(0, 0, CGRectGetWidth(_animateBg.frame), CGRectGetHeight(_animateBg.frame));
    _passwordTF.frame = CGRectMake(CGRectGetWidth(_codeTF.frame) + (RXAC ? 18 : 30), 0, CGRectGetWidth(_animateBg.frame) + (RXAC ? 14 : 0), CGRectGetHeight(_animateBg.frame));
    _loginBtn.frame = CGRectMake(CGRectGetMinX(_accountTF.frame), CGRectGetMaxY(_animateBg.frame) + (RXAC ? 18 : 24), CGRectGetWidth(_accountTF.frame), RXAC ? 43 : 48);
    
    if ([RXOSCommonTool isRTL]) {
        _backBtn.frame = CGRectMake(CGRectGetWidth(self.bgView.frame) - 24 - 28, RXAC ? 16 : 17, 28, 28);
    } else {
        _backBtn.frame = CGRectMake(RXAC ? 24 : 24, RXAC ? 16 : 17, 28, 28);
    }
    
    _moreLoginTipLbl.frame = CGRectMake(0, CGRectGetMaxY(_loginBtn.frame) + (RXAC ? 14 : 14), CGRectGetWidth(_bgView.frame), 30);
    
    _changeBtn.frame = CGRectMake(CGRectGetMinX(_loginBtn.frame), CGRectGetMaxY(_loginBtn.frame) + 13, CGRectGetWidth(_loginBtn.frame), 30);
    
    if (RXAC) {
        _animateBg.contentSize = CGSizeMake((CGRectGetWidth(_bgView.frame) - 59) * 2, 0);
    } else {
        _animateBg.contentSize = CGSizeMake((CGRectGetWidth(_bgView.frame) - 50) * 2 + 30, 0);
    }

    [self layoutSubviews];
}

- (void)show
{
    [RXOSCommonTool transformWithView:self.bgView];
    UIView *window = [UIApplication sharedApplication].keyWindow;
    [window addSubview:self.alphaView];
    [window bringSubviewToFront:self];
//    self.layer.zPosition = 100000000000000;
    [UIView animateWithDuration:0.1 animations:^{
        if ([RXOSUserUtility sharedManager].isFirstView) {
            self.alphaView.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.5];
            [RXOSCommonTool showWithAnimate:self.bgView];
        } else {
            self.alphaView.backgroundColor = [UIColor clearColor];
            [RXOSCommonTool showWithAnimate:self.bgView duration:0];
        }
        
       
        [self layoutSubviews];
    }];
}

- (void)hide
{
    [RXOSUserUtility sharedManager].isCodeTFLoad = NO;
    
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    
    UIView *window = [UIApplication sharedApplication].keyWindow;
    for (UIView *v in window.subviews) {
        if (v.tag == AlphaTag) {
            [v removeFromSuperview];
        }
    }
    
    [self removeFromSuperview];
}

// 输入框动画效果，type 表示当前输入框状态，0 账号密码，1 验证码
- (void)changeTFAnimateWithType:(NSInteger)type
{
//    if (self.isFirst) {
//        self.isFirst = NO;
//        self.hideAnimate = NO;
//        return;
//    }
    if (type == 1) {
        [self.animateBg setContentOffset:CGPointMake(0, 0) animated:YES];
    } else {
        if (self.hideAnimate) {
            [self.animateBg setContentOffset:CGPointMake([RXOSCommonTool getScreenWidth] - (RXAC ? 41: 50 - 30), 0) animated:YES];
            self.hideAnimate = NO;
            return;
        }
        [self.animateBg setContentOffset:CGPointMake([RXOSCommonTool getScreenWidth] - (RXAC ? 41 : 50 - 30), 0) animated:YES];
//        self.animateBg.contentOffset = CGPointMake(100, 0);
    }
    return;
    
    [UIView animateWithDuration:0.3 animations:^{
        [self layoutSubviews];
    }];
    
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        [UIView animateWithDuration:0.3 animations:^{
            if (type == 0) {
                [self.passwordTF refreshView];
            } else {
                [self.codeTF refreshView];
            }
            [self layoutSubviews];
        }];
    });
}

- (void)setUsername:(NSString *)username
{
    self.accountTF.tf.text = username;
    self.accountTF.placehoder = @"";
}

#pragma mark -- <notiActions>
- (void)refreshLoginUI:(NSNotification *)noti
{
//    self.loginConfig.loginTypes = @[];
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
    [RXOSHUD showHUD];
}

#pragma mark -- <actions>
- (void)changeCodeLogin:(NSNotification *)noti
{
    NSDictionary *userInfo = noti.userInfo;
    _codeLoginBtn.selected = NO;
    [self codeLoginBtnAction:_changeBtn];
    self.username = userInfo[@"username"];
}

- (void)codeLoginBtnAction:(UIButton *)btn
{
    _codeLoginBtn.selected = !_codeLoginBtn.selected;
    if (_codeLoginBtn.selected) {
        
        if (_accountTF.tf.text.length > 0 && _passwordTF.tf.text.length > 0) {
            _loginBtn.userInteractionEnabled = YES;
            [_loginBtn setBackgroundColor:[UIColor colorWithHexString:@"20C0B3"]];
        } else {
            _loginBtn.userInteractionEnabled = NO;
            [_loginBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
        }
        
        [self.loginBtn setTitle:[RXLocation osLaunguage:@"登录"] forState:UIControlStateNormal];
        self.passwordTF.tf.secureTextEntry = YES;
        self.accountTF.placeholderLbl.hidden = NO;
        self.passwordTF.placeholderLbl.hidden = YES;
        if (self.passwordTF.tf.text.length <= 0) {
            self.passwordTF.placehoder = @"请输入密码";
            self.passwordTF.placeholderLbl.hidden = NO;
        }
        [self.changeBtn setTitle:[RXLocation osLaunguage:@"验证码登录"] forState: normal];
        self.passwordTF.hidden = NO;
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
        
        UIView *window = [UIApplication sharedApplication].keyWindow;
        
        _bgView.center = window.center;
        _logoImageView.frame = CGRectMake([RXOSCommonTool getScreenWidth] / 2 - 108 / 2 - 1.6, RXAC ? 15.2 : 24, RXAC ? 110.4 : 110.2, 23.6);
        _accountTF.frame = CGRectMake(RXAC ? 29 : 25, RXAC ? 57 : 68, [RXOSCommonTool getScreenWidth] - (RXAC ? 59 : 50), RXAC ? 36 : 46);
        _animateBg.frame = CGRectMake(CGRectGetMinX(_accountTF.frame), CGRectGetMaxY(_accountTF.frame) + 12, CGRectGetWidth(self.accountTF.frame), CGRectGetHeight(_accountTF.frame));
//        _codeTF.frame = CGRectMake(0, 0, CGRectGetWidth(_animateBg.frame), CGRectGetHeight(_animateBg.frame));
//        _passwordTF.frame = CGRectMake(CGRectGetWidth(_passwordTF.frame) + (RXAC ? 18 : 30), 0, CGRectGetWidth(_animateBg.frame) + (RXAC ? 14 : 0), CGRectGetHeight(_animateBg.frame));
        _loginBtn.frame = CGRectMake(CGRectGetMinX(_accountTF.frame), CGRectGetMaxY(_animateBg.frame) + (RXAC ? 18 : 24), CGRectGetWidth(_accountTF.frame), RXAC ? 43 : 48);

        _moreLoginTipLbl.frame = CGRectMake(0, CGRectGetMaxY(_loginBtn.frame) + (RXAC ? 14 : 10), [RXOSCommonTool getScreenWidth], 30);
        _changeBtn.frame = CGRectMake(CGRectGetMinX(_loginBtn.frame), CGRectGetMaxY(_loginBtn.frame) + 11, CGRectGetWidth(_loginBtn.frame), 30);
        
        [self changeTFAnimateWithType:0];
        
    } else {
        
        if (_accountTF.tf.text.length > 0 && _codeTF.tf.text.length > 0) {
            _loginBtn.userInteractionEnabled = YES;
            [_loginBtn setBackgroundColor:[UIColor colorWithHexString:@"20C0B3"]];
        } else {
            _loginBtn.userInteractionEnabled = NO;
            [_loginBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
        }
        
        self.codeTF.tf.keyboardType = UIKeyboardTypeNumberPad;
        self.accountTF.tf.keyboardType = UIKeyboardTypeEmailAddress;
        
        if (self.isShowKeyboard && [self.accountTF.tf isEditing]) {
            [self.accountTF.tf endEditing:YES];
            dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.3 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
                [self.accountTF.tf becomeFirstResponder];
            });
        }
        
        if ([self.passwordTF.tf isEditing]) {
            [self.passwordTF.tf endEditing:YES];
        }
        
        [self.loginBtn setTitle:[RXLocation osLaunguage:@"登录"] forState:UIControlStateNormal];
        self.accountTF.placeholderLbl.hidden = NO;
        
        self.codeTF.placeholderLbl.hidden = YES;
        
        if (self.codeTF.tf.text.length <= 0) {
            self.codeTF.placehoder = @"请输入您的验证码";
            self.codeTF.placeholderLbl.hidden = NO;
        }
        [self.changeBtn setTitle:[RXLocation osLaunguage:@"密码登录"] forState: normal];
        self.forgetPasswordBtn.hidden = YES;
        
        if (!self.isFirstAutoChange && self.phoneNum.length > 0) {
            self.accountTF.tf.text = self.phoneNum;
        }
        
        if (self.accountTF.tf.text.length > 0) {
            self.accountTF.placehoder = @"";
        }
        
        BOOL isAC = RXAC;
        if (!isAC) {
//            self.moreLoginTipLbl.hidden = NO;
        } else {
            self.moreLoginTipLbl.hidden = YES;
        }
        
        UIView *window = [UIApplication sharedApplication].keyWindow;

        _bgView.center = window.center;
        _logoImageView.frame = CGRectMake([RXOSCommonTool getScreenWidth] / 2 - 108 / 2 - 1.6, RXAC ? 15.2 : 24, RXAC ? 110.4 : 110.2, 23.6);
        _accountTF.frame = CGRectMake(RXAC ? 29 : 25, RXAC ? 57 : 68, [RXOSCommonTool getScreenWidth] - (RXAC ? 59 : 50), RXAC ? 36 : 46);
        _animateBg.frame = CGRectMake(CGRectGetMinX(_accountTF.frame), CGRectGetMaxY(_accountTF.frame) + 12, CGRectGetWidth(self.accountTF.frame), CGRectGetHeight(_accountTF.frame));
        _codeTF.frame = CGRectMake(0, 0, CGRectGetWidth(_animateBg.frame), CGRectGetHeight(_animateBg.frame));
        _passwordTF.frame = CGRectMake(CGRectGetWidth(_codeTF.frame) + (RXAC ? 18 : 30), 0, CGRectGetWidth(_animateBg.frame) + (RXAC ? 14 : 0), CGRectGetHeight(_animateBg.frame));
        _loginBtn.frame = CGRectMake(CGRectGetMinX(_accountTF.frame), CGRectGetMaxY(_animateBg.frame) + (RXAC ? 18 : 24), CGRectGetWidth(_accountTF.frame), RXAC ? 43 : 48);

        _moreLoginTipLbl.frame = CGRectMake(0, CGRectGetMaxY(_loginBtn.frame) + (RXAC ? 14 : 10), [RXOSCommonTool getScreenWidth], 30);
        _changeBtn.frame = CGRectMake(CGRectGetMinX(_loginBtn.frame), CGRectGetMaxY(_loginBtn.frame) + 11, CGRectGetWidth(_loginBtn.frame), 30);
        
        [self changeTFAnimateWithType:1];
    }
}

- (void)accountListBtnAction
{
//    RXAccountListView *accountListView = [[RXAccountListView alloc] initWithAddAccount:self.addAccountBlock loginType:self.loginTypeBlock];
}

- (void)loginBtnAction
{
    [self endEditing:YES];
    
    if (_accountTF.tf.text.length <= 0) {
        [RXOSHUD showErrorText:@"用户名不能为空"];
        return;
    } else if (self.codeLoginBtn.selected && _passwordTF.tf.text.length <= 0) {
        NSString *title = @"密码不能为空";
        [RXOSHUD showErrorText:title];
        return;
    } else if (!self.codeLoginBtn.selected && _codeTF.tf.text.length <= 0) {
        NSString *title = @"验证码不能为空";
        [RXOSHUD showErrorText:title];
        return;
    } else {
        
        if (!self.codeLoginBtn.selected) {
            [RXOSUserUtility sharedManager].username = self.accountTF.tf.text;
            
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
            
            CaptchaType captchaType = CaptchaType_email;
            if ([RXOSCommonTool validateEmail:self.accountTF.tf.text]) {
                captchaType = CaptchaType_email;
            }
            [RXOSHUD showHUD];
            [[RXApiService sharedSDK] verifyCaptchaCodeWithType:captchaType target:self.accountTF.tf.text purpose:@"login" captcha_code:self.codeTF.tf.text complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                if (!error) {
                    [RXOSHUD hideHUD];
                    [[RXOSLoginViewManager sharedSDK] fetchLoginEvent:LoginTypeCapCode loginInfo:loginInfo complete:self.loginComplete];
                } else {
                    NSString *msg = error.responesObject[@"msg"];
                    if ([error.responesObject[@"code"] integerValue] == 1120) {
                        msg = @"网络请求失败，请重试或检查网络设置";
                    }
                    
                    [RXOSHUD showErrorText:msg];
                }
            }];
        } else {
            [RXOSUserUtility sharedManager].username = self.accountTF.tf.text;
            [RXOSUserUtility sharedManager].password = self.passwordTF.tf.text;
            
            NSDictionary *loginExt = [NSDictionary dictionary];
            if (self.loginTypeBlock) {
                loginExt = self.loginTypeBlock(loginExt, LoginTypeAccount);
                NSMutableDictionary *loginInfo = [NSMutableDictionary dictionaryWithDictionary:loginExt];
                [loginInfo setValue:self.accountTF.tf.text forKey:@"username"];
                [loginInfo setValue:self.passwordTF.tf.text forKey:@"password"];
                [[RXOSLoginViewManager sharedSDK] fetchLoginEvent:LoginTypeAccount loginInfo:loginInfo complete:self.loginComplete];
            }
        }
    }
}

- (void)forgetPasswordBtnAction
{
    [self endEditing:YES];
//    RXOSGetBackPasswordView *getBackView = [[RXOSGetBackPasswordView alloc] initWithType:GetBackPasswordType_code phone:@"" code:@""];
    NSString *domain = [[RXService sharedSDK] getFirstBaseUrl];
    if (![[domain substringWithRange:NSMakeRange(domain.length - 1, 1)] isEqualToString:@"/"]) {
        domain = [NSString stringWithFormat:@"%@/", domain];
    }
    
    RXOSWKWebView *webView = [[RXOSWKWebView alloc] initWithFrame:[UIApplication sharedApplication].keyWindow.frame];
//    webView.urlStr = @"https://10.10.2.177:8083/static/passport/#/oversea/forgetpassword";
    webView.urlStr = [NSString stringWithFormat:@"%@static/passport/#/oversea/forgetpassword", domain];
    [[UIApplication sharedApplication].keyWindow addSubview:webView];
}

- (void)codeAction
{
    [self endEditing:YES];
    if(self.accountTF.tf.text == nil || [self.accountTF.tf.text isEqualToString:@""]){
        [RXOSHUD showErrorText:@"邮箱格式错误，请重新输入"];
        return;
    }
    
    if (![RXOSCommonTool validateEmail:self.accountTF.tf.text]) {
        [RXOSHUD showErrorText:@"邮箱格式错误，请重新输入"];
        return;
    }
    
    CaptchaType captchaType = CaptchaType_email;
    if ([RXOSCommonTool validateEmail:self.accountTF.tf.text]) {
        captchaType = CaptchaType_email;
    }
    [RXOSHUD showHUD];
    
    [[RXApiService sharedSDK] getCaptchaCodeWithType:captchaType target:self.accountTF.tf.text purpose:@"login" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if(error != nil){
            NSString *msg = error.responesObject[@"msg"];
            NSInteger errorCode = [error.responesObject[@"code"] integerValue];
            if (errorCode >= 1000 && errorCode < 2000) {
                msg = [NSString stringWithFormat:@"网络请求失败，请重试或检查网络设置  （code = %ld）", errorCode];
            }

            [RXOSHUD showErrorText:msg];
            return;
        } else {
            [RXOSHUD showSuccessText:@"已发送验证码"];
            
            self.codeTFR = self.codeTF.tf.frame;
            self.codeLblR = self.codeTF.codeLbl.frame;
            self.codePlaceR = self.codeTF.placeholderLbl.frame;
            
            self.codeTF.codeLbl.enabled = NO;
            self.timeCount = 60;
            NSString *text = [NSString stringWithFormat:@"%@(%ld)", [RXLocation osLaunguage:@"重新获取"], (long)self.timeCount];
            NSDictionary *attribtDic = @{NSUnderlineStyleAttributeName : [NSNumber numberWithInteger:NSUnderlineStyleSingle], NSUnderlineColorAttributeName : [UIColor clearColor]};

            NSMutableAttributedString *attribtStr = [[NSMutableAttributedString alloc] initWithString:text attributes:attribtDic];
            [attribtStr addAttribute:NSForegroundColorAttributeName value:[UIColor colorWithHexString:@"#AFAFAF"] range:NSMakeRange(0, text.length)];
            self.codeTF.codeLbl.attributedText = attribtStr;
            
            CGFloat codeW = [text widthForFont:self.codeTF.codeLbl.font] + 6;
            
            if ([RXOSCommonTool isRTL]) {
                self.codeTF.codeLbl.frame = CGRectMake(0, 0, codeW, RXAC ? 36 : 46);
                self.codeTF.tf.frame = CGRectMake(codeW, CGRectGetMinY(self.codeTF.tf.frame), CGRectGetWidth(self.codeTF.frame) - codeW, CGRectGetHeight(self.codeTF.tf.frame));
//                self.codeTF.placeholderLbl.frame = CGRectMake(0, 0, CGRectGetWidth(self.codeTF.tf.frame) - (RXAC ? 13 : 13), CGRectGetHeight(self.codeTF.tf.frame));
            } else {
//                codeW = [text widthForFont:self.codeTF.codeLbl.font] + 20;
                self.codeTF.codeLbl.frame = CGRectMake(CGRectGetWidth(self.codeTF.frame) - codeW, 0, codeW, RXAC ? 36 : 46);
                self.codeTF.tf.frame = CGRectMake(CGRectGetMinX(self.codeTF.tf.frame), CGRectGetMinY(self.codeTF.frame), CGRectGetWidth(self.codeTF.tf.frame) - 26, CGRectGetHeight(self.codeTF.tf.frame));
            }
            [RXOSUserUtility sharedManager].isCodeTFLoad = YES;
            
            NSTimer *timer  =  [NSTimer timerWithTimeInterval:1.0 target:self selector:@selector(timered:) userInfo:nil repeats:YES];
            [[NSRunLoop mainRunLoop] addTimer:timer forMode:NSDefaultRunLoopMode];
        }
    }];
}

- (void)timered:(NSTimer *)time
{
    self.timeCount--;
    if(self.timeCount < 1){
        
        NSString *text = @"获取验证码";
        NSDictionary *attribtDic = @{NSUnderlineStyleAttributeName: [NSNumber numberWithInteger:NSUnderlineStyleSingle],NSUnderlineColorAttributeName:[UIColor clearColor]};

        NSMutableAttributedString *attribtStr = [[NSMutableAttributedString alloc]initWithString:text attributes:attribtDic];
        self.codeTF.codeLbl.attributedText = attribtStr;
        self.codeTF.codeLbl.textColor = [UIColor colorWithHexString:@"#74D2CB"];
        
        self.codeTF.tf.frame = self.codeTFR;
        self.codeTF.codeLbl.frame = self.codeLblR;
        self.codeTF.placeholderLbl.frame = self.codePlaceR;
        
        self.codeTF.codeLbl.enabled = YES;
        [time invalidate];
        return;
    }
    
    NSString *text = [NSString stringWithFormat:@"%@(%ld)", [RXLocation osLaunguage:@"重新获取"], (long)self.timeCount];
    NSDictionary *attribtDic = @{NSUnderlineStyleAttributeName : [NSNumber numberWithInteger:NSUnderlineStyleSingle], NSUnderlineColorAttributeName : [UIColor clearColor]};
    
//    self.passwordTF.line.frame = CGRectMake(CGRectGetMinX(self.passwordTF.line.frame) - 10, CGRectGetMinY(self.passwordTF.line.frame), CGRectGetWidth(self.passwordTF.line.frame), CGRectGetHeight(self.passwordTF.line.frame));

    NSMutableAttributedString *attribtStr = [[NSMutableAttributedString alloc] initWithString:text attributes:attribtDic];
    [attribtStr addAttribute:NSForegroundColorAttributeName value:[UIColor colorWithHexString:@"#AFAFAF"] range:NSMakeRange(0, text.length)];
    self.codeTF.codeLbl.attributedText = attribtStr;
//    self.passwordTF2.codeLbl.textColor = [UIColor colorWithHexString:@"#74D2CB"];
}


#pragma mark -- <UITextFieldDelegate>
- (BOOL)textFieldShouldReturn:(UITextField *)textField
{
    [textField endEditing:YES];
    
//    if ([RXOSCommonTool validateMobile:self.accountTF.tf.text] && !self.isFirstAutoChange && self.passwordTF.tf.text.length <= 0 && !self.codeLoginBtn.selected) {
//        
//        self.phoneNum = self.accountTF.tf.text;
//        [self codeLoginBtnAction:self.changeBtn];
//        self.isFirstAutoChange = YES;
//    }
    
    return YES;
}

- (void)textViewDidChangeSelection:(UITextView *)textView
{
    NSString *str = textView.text;
    if (str.length > 0) {
        if (textView == _accountTF.tf) {
            _accountTF.placeholderLbl.hidden = YES;
        }
        if (textView == _passwordTF.tf) {
            _passwordTF.placeholderLbl.hidden = YES;
            if (self.codeLoginBtn.selected) {
                _passwordTF.showPwdBtn.hidden = NO;
            }
        }
        if (textView == _codeTF.tf) {
            _codeTF.placeholderLbl.hidden = YES;
            if (self.codeLoginBtn.selected) {
                _codeTF.showPwdBtn.hidden = NO;
            }
        }
    } else {
        if (textView == _accountTF.tf) {
            _accountTF.placeholderLbl.hidden = NO;
        }
        if (textView == _passwordTF.tf) {
            _passwordTF.placeholderLbl.hidden = NO;
            if (self.codeLoginBtn.selected) {
                _passwordTF.showPwdBtn.hidden = YES;
            }
        }
        if (textView == _codeTF.tf) {
            _codeTF.placeholderLbl.hidden = NO;
            if (self.codeLoginBtn.selected) {
                _codeTF.showPwdBtn.hidden = YES;
            }
        }
    }
    
    if (self.codeLoginBtn.selected) {
        if (textView == _passwordTF.tf && str.length > 32) {
            _passwordTF.tf.text = [str substringToIndex:32];
//            [RXOSHUD showText:@"密码长度不能超过32位"];
        }
        if (_accountTF.tf.text.length > 0 && _passwordTF.tf.text.length > 0) {
            _loginBtn.userInteractionEnabled = YES;
            [_loginBtn setBackgroundColor:[UIColor colorWithHexString:@"20C0B3"]];
        } else {
            _loginBtn.userInteractionEnabled = NO;
            [_loginBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
        }
    } else {
        if (textView == _codeTF.tf && str.length > 6) {
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
////            [RXOSHUD showText:@"密码长度不能超过32位"];
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
    NSString *str = textField.text;
    if (string.length > 0) {
        if (textField == _accountTF.tf) {
            _accountTF.placeholderLbl.hidden = YES;
            
            if (!self.codeLoginBtn.selected) {
                if (_codeTF.tf.text.length > 0) {
                    _loginBtn.userInteractionEnabled = YES;
                    [_loginBtn setBackgroundColor:[UIColor colorWithHexString:@"20C0B3"]];
                } else {
                    _loginBtn.userInteractionEnabled = NO;
                    [_loginBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
                }
            } else {
                if (_passwordTF.tf.text.length > 0) {
                    _loginBtn.userInteractionEnabled = YES;
                    [_loginBtn setBackgroundColor:[UIColor colorWithHexString:@"20C0B3"]];
                } else {
                    _loginBtn.userInteractionEnabled = NO;
                    [_loginBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
                }
            }
            
            
            NSString *fetchStr = [NSString stringWithFormat:@"%@%@", str, string];
//            if (fetchStr.length >= 11) {
//                if ([RXOSCommonTool validateMobile:fetchStr] && !self.isFirstAutoChange && self.passwordTF.tf.text.length <= 0 && !self.codeLoginBtn.selected) {
//                    self.phoneNum = self.accountTF.tf.text;
//                    [self codeLoginBtnAction:self.changeBtn];
//                    self.isFirstAutoChange = YES;
//                }
//            }
        }
        if (textField == _passwordTF.tf) {
            _passwordTF.placeholderLbl.hidden = YES;
            if (self.codeLoginBtn.selected) {
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
            if (self.codeLoginBtn.selected) {
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
                if (self.codeLoginBtn.selected) {
                    _passwordTF.showPwdBtn.hidden = YES;
                }
            }
            if (textField == _codeTF.tf) {
                _codeTF.placeholderLbl.hidden = NO;
                if (self.codeLoginBtn.selected) {
                    _codeTF.showPwdBtn.hidden = YES;
                }
            }
            [RXOSUserUtility sharedManager].username = @"";
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
//                    [RXOSUserUtility sharedManager].username = @"";
//                }
//            });
        }
    }
    
    if (self.codeLoginBtn.selected) {
        if (textField == _passwordTF.tf && str.length > 31 && string.length > 0) {
            return NO;
//            _passwordTF.tf.text = [str substringToIndex:32];
            //            [RXOSHUD showText:@"密码长度不能超过32位"];
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
        if (textField == _codeTF.tf && str.length > 5 && string.length > 0) {
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
    RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
    
    NSString *errorMsg = [RXErrorTool getRXErrorMsg:RXLimitError_closeView];
    err.responesObject = @{@"msg" : errorMsg,
                           @"code" : @(RXLimitError_closeView)
    };
    if (self.loginComplete) {
        self.loginComplete(nil, err);
    }
    [[RXService sharedSDK].loginDelegate rx_LoginCallBackWithResponse:nil error:err];
    
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

- (RXOSCloseBtn *)closeBtn
{
    if (!_closeBtn) {
        _closeBtn = [RXOSCloseBtn buttonWithType:UIButtonTypeCustom];
        _closeBtn.adjustsImageWhenHighlighted = NO;
        [_closeBtn setImage:[UIImage rxOSBundleImageNamed:@"rx_close"] forState:UIControlStateNormal];
        [_closeBtn addTarget:self action:@selector(closeBtnAction) forControlEvents:UIControlEventTouchUpInside];
//        if ([RXOSUserUtility sharedManager].isFirstView) {
//            _closeBtn.hidden = NO;
//        } else {
            _closeBtn.hidden = YES;
//        }
    }
    return _closeBtn;
}

- (RXOSTextField *)accountTF
{
    if (!_accountTF) {
        _accountTF = [[RXOSTextField alloc] initWithPlaceholder:@"请输入您的邮箱" type:TFType_clear keyboardType:UIKeyboardTypeNumbersAndPunctuation];
        _accountTF.tf.delegate = self;
        _accountTF.tf.returnKeyType = UIReturnKeyDone;
    }
    return _accountTF;
}

- (RXOSTextField *)passwordTF
{
    if (!_passwordTF) {
        _passwordTF = [[RXOSTextField alloc] initWithPlaceholder:@"请输入密码" type:TFType_pwd keyboardType:UIKeyboardTypeDefault];
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

- (RXOSTextField *)codeTF
{
    if (!_codeTF) {
        _codeTF = [[RXOSTextField alloc] initWithPlaceholder:@"请输入验证码" type:TFType_loginCode keyboardType:UIKeyboardTypeDefault];
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
        [_loginBtn setTitle:[RXLocation osLaunguage:@"登录"] forState:UIControlStateNormal];
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
//        if ([RXOSUserUtility sharedManager].isFirstView) {
//            _backBtn.hidden = YES;
//        } else {
            _backBtn.hidden = NO;
//        }
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

- (RXOSLoginChangeBtn *)changeBtn
{
    if (!_changeBtn) {
        _changeBtn = [RXOSLoginChangeBtn buttonWithType:UIButtonTypeCustom];
        [_changeBtn setImage:[UIImage rxOSBundleImageNamed:@"rx_login_change_new"] forState:normal];
        [_changeBtn setTitle:[RXLocation osLaunguage:@"验证码登录"] forState:normal];
//        _changeBtn.titleLabel.textAlignment = NSTextAlignmentCenter;
        _changeBtn.titleLabel.font = [UIFont systemFontOfSize:15];
        [_changeBtn setTitleColor:[UIColor colorWithHexString:@"#315E5A"] forState:normal];
        [_changeBtn addTarget:self action:@selector(codeLoginBtnAction:) forControlEvents:UIControlEventTouchUpInside];
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

@end
