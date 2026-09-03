//
//  RXOSLoginView.m
//  RXSDK
//
//  Created by 陈汉 on 2021/9/29.
//

#import "RXOSLoginView.h"
#import "RXOSCommonTool.h"
#import "RXOSAddLoginView.h"
#import "RXOSCommonWKWebView.h"
#import "RXOSGetBackPasswordView.h"
#import "RXOSLoginViewManager.h"
#import <RXSDK_Pure/RXErrorTool.h>
#import "RXOSCloseBtn.h"
#import "UIView+RXOSShade.h"
#import "RXOSHistoryLoginView.h"
#import "RXOSWKWebView.h"
#import "RXOSRegistView.h"

#define LoginBtnTag 100000
#define AlphaTag 200000

@interface RXOSLoginView () <UITextFieldDelegate, UITextViewDelegate>

@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) UIView *alphaView;
@property (nonatomic, strong) UILabel *titleLbl;
@property (nonatomic, strong) RXOSCloseBtn *closeBtn;
@property (nonatomic, assign) NSInteger orientation;  // 屏幕方向 1竖屏 2横屏
@property (nonatomic, assign) BOOL needSet;
@property (nonatomic, assign) BOOL isSelect;
@property (nonatomic, assign) BOOL isFirstLoad;
@property (nonatomic, copy) LoginTypeBlock loginTypeBlock;
@property (nonatomic, copy) LoginComplete loginComplete;
@property (nonatomic, strong) RXOSAddLoginView *addLoginView;
@property (nonatomic, strong) RXOSTextField *accountTF;
@property (nonatomic, strong) RXOSTextField *passwordTF;
@property (nonatomic, strong) UIButton *loginBtn;
@property (nonatomic, strong) UIButton *forgetPasswordBtn;
@property (nonatomic, strong) RXOSCloseBtn *backBtn;
@property (nonatomic, strong) RXOSUILoginConfig *loginConfig;

@property (nonatomic, strong) UIImageView *logoImageView;
@property (nonatomic, strong) UIImage *logoImage;
@property (nonatomic, assign) NSInteger timeCount;
@property (nonatomic, assign) CGRect codeLblR;
@property (nonatomic, assign) CGRect codeTFR;
@property (nonatomic, assign) CGRect codePlaceR;
@property (nonatomic, strong) UIButton *registBtn;

@end

@implementation RXOSLoginView

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
    }
    return self;
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

- (void)keyBoardWillShow:(NSNotification *)notification
{
    if (!RXAC) return;
    NSDictionary *userInfo = [notification userInfo];
    NSValue *value = [userInfo objectForKey:UIKeyboardFrameEndUserInfoKey];
    NSNumber *duration = [userInfo objectForKey:UIKeyboardAnimationDurationUserInfoKey];
    
    [UIView animateWithDuration:duration.doubleValue animations:^{
        UIView *window = [UIApplication sharedApplication].keyWindow;
        CGFloat bgH = self.orientation == 2 ? 271 : 271;
        self.bgView.center = CGPointMake(window.center.x, window.frame.size.height / 2 - 40);
//        self.bgView.frame = CGRectMake(0, window.frame.size.height / 2 - bgH / 2 - 35, 335, 232);

        [self layoutSubviews];
    }];
}

- (void)keyBoardWillHide:(NSNotification *)notification
{
    if (!RXAC) return;
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
    [self.bgView addSubview:self.passwordTF];
    [self.bgView addSubview:self.loginBtn];
    [self.bgView addSubview:self.codeLoginBtn];
    [self.bgView addSubview:self.backBtn];
    [self.bgView addSubview:self.registBtn];
    [self.bgView addSubview:self.forgetPasswordBtn];
    
    [self layoutViews];
}

- (void)layoutViews
{
    UIView *window = [UIApplication sharedApplication].keyWindow;

    _bgView.frame = CGRectMake(0, 0, [RXOSCommonTool getScreenWidth], RXAC ? 271 : 271);
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
    
    _accountTF.frame = CGRectMake(RXAC ? 29 : 25, RXAC ? 57 : 70, CGRectGetWidth(_bgView.frame) - (RXAC ? 59 : 50), RXAC ? 36 : 46);

    _passwordTF.frame = CGRectMake(CGRectGetMinX(_accountTF.frame), CGRectGetMaxY(_accountTF.frame) + 14, CGRectGetWidth(_accountTF.frame), CGRectGetHeight(_accountTF.frame));
    
    _loginBtn.frame = CGRectMake(CGRectGetMinX(_accountTF.frame), CGRectGetMaxY(_passwordTF.frame) + (RXAC ? 14 : 58), CGRectGetWidth(_accountTF.frame), RXAC ? 43 : 42);
    
    _codeLoginBtn.frame = CGRectMake(40, CGRectGetMaxY(_loginBtn.frame) + 10, 72, 22);

    _forgetPasswordBtn.frame = CGRectMake(250, CGRectGetMinY(_codeLoginBtn.frame), 58, 22);
    
    _closeBtn.frame = CGRectMake(CGRectGetWidth(_bgView.frame) - (RXAC ? 24 + 28 : 21 + 28), RXAC ? 16 : 17, 28, 28);
    
    if ([RXOSCommonTool isRTL]) {
        _backBtn.frame = CGRectMake(CGRectGetWidth(self.bgView.frame) - 24 - 28, RXAC ? 16 : 17, 28, 28);
    } else {
        _backBtn.frame = CGRectMake(RXAC ? 24 : 24, RXAC ? 16 : 17, 28, 28);
    }
    
    _registBtn.frame = CGRectMake(CGRectGetWidth(_bgView.frame) - (RXAC ? 29 + 100 : 25 + 100), CGRectGetMinY(_passwordTF.frame) + 10, 100, 30);
    
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
        if (!RXAC) {
            if ([RXOSUserUtility sharedManager].isFirstView) {
                self.alphaView.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.5];
                [RXOSCommonTool showWithAnimate:self.bgView];
            } else {
                self.alphaView.backgroundColor = [UIColor clearColor];
                [RXOSCommonTool showWithAnimate:self.bgView duration:0];
            }
        } else {
            self.alphaView.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.5];
            [RXOSCommonTool showWithAnimate:self.bgView];
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

- (void)setUsername:(NSString *)username
{
    if (self.isReLogin) {
        self.accountTF.tf.text = [username substringFromIndex:5];
        [self.accountTF changeArea:[username substringToIndex:5]];
        
    } else {
        self.accountTF.tf.text = username;
    }
    self.accountTF.placeholderLbl.hidden = YES;
}

#pragma mark -- <notiActions>
- (void)refreshLoginUI:(NSNotification *)noti
{
    self.loginConfig.loginTypes = @[];
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
- (void)codeLoginBtnAction:(UIButton *)btn
{
    _codeLoginBtn.selected = !_codeLoginBtn.selected;
    if (_codeLoginBtn.selected) {
        if (_accountTF.tf.text.length > 0) {
            _loginBtn.userInteractionEnabled = YES;
            [_loginBtn setBackgroundColor:[UIColor colorWithHexString:@"20C0B3"]];
        } else {
            _loginBtn.userInteractionEnabled = NO;
            [_loginBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
        }
        
        self.passwordTF.tf.keyboardType = UIKeyboardTypeNumberPad;
        
//        [btn setTitle:@"密码登录" forState:UIControlStateNormal];
        [self.loginBtn setTitle:[RXLocation osLaunguage:@"登录"] forState:UIControlStateNormal];
        self.accountTF.tf.text = @"";
        self.passwordTF.tf.text = @"";
        self.passwordTF.tf.secureTextEntry = NO;
        self.accountTF.placeholderLbl.hidden = NO;
        self.passwordTF.placeholderLbl.hidden = NO;
        self.accountTF.placehoder = @"请输入您的手机号";
        self.passwordTF.placehoder = @"请输入您的验证码";
        [self.passwordTF changeType:TFType_loginCode];
        [self.accountTF changeType:TFType_loginArea];
        self.registBtn.hidden = YES;
        self.forgetPasswordBtn.hidden = YES;
        if (self.accountTF.tf.text.length > 0) {
            self.accountTF.placehoder = @"";
        }
        
        NSArray *privacieTitles = [RXOSUserUtility sharedManager].privacieTitles;
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
        
        UIView *window = [UIApplication sharedApplication].keyWindow;
        _bgView.frame = CGRectMake(0, 0, [RXOSCommonTool getScreenWidth], RXAC ? 236 : 270);
        _bgView.center = window.center;
        _logoImageView.frame = CGRectMake(CGRectGetWidth(_bgView.frame) / 2 - 108 / 2, RXAC ? 16 : 24, 108, 25);
        _accountTF.frame = CGRectMake(RXAC ? 29 : 25, RXAC ? 57 : 70, CGRectGetWidth(_bgView.frame) - (RXAC ? 59 : 50), RXAC ? 36 : 46);
        _passwordTF.frame = CGRectMake(CGRectGetMinX(_accountTF.frame), CGRectGetMaxY(_accountTF.frame) + 14, CGRectGetWidth(_accountTF.frame), CGRectGetHeight(_accountTF.frame));
        _loginBtn.frame = CGRectMake(CGRectGetMinX(_accountTF.frame), CGRectGetMaxY(_passwordTF.frame) + (RXAC ? 23 : 23), CGRectGetWidth(_accountTF.frame), RXAC ? 43 : 48);
    } else {
        if (_accountTF.tf.text.length > 0 && _passwordTF.tf.text.length > 0) {
            _loginBtn.userInteractionEnabled = YES;
            [_loginBtn setBackgroundColor:[UIColor colorWithHexString:@"20C0B3"]];
        } else {
            _loginBtn.userInteractionEnabled = NO;
            [_loginBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
        }
        
//        [btn setTitle:@"验证码登录" forState:UIControlStateNormal];
        [self.loginBtn setTitle:[RXLocation osLaunguage:@"登录"] forState:UIControlStateNormal];
        self.accountTF.tf.text = @"";
        self.passwordTF.tf.text = @"";
        self.passwordTF.tf.secureTextEntry = YES;
        self.accountTF.placeholderLbl.hidden = NO;
        self.passwordTF.placeholderLbl.hidden = NO;
        self.accountTF.placehoder = @"请输入您的邮箱账号";
        self.passwordTF.placehoder = @"请输入您的密码";
        self.passwordTF.hidden = NO;
        self.forgetPasswordBtn.hidden = NO;
        
        if (_loginConfig.closeEmailRegister) {
            self.registBtn.hidden = YES;
        } else {
            self.registBtn.hidden = NO;
        }
        
        [self.passwordTF changeType:TFType_pwdNormal];
        self.passwordTF.showPwdBtn.hidden = YES;
//        self.passwordTF.tf.frame = CGRectMake(10, 0, CGRectGetWidth(self.frame) - 130, CGRectGetHeight(self.frame));
        self.isFirstLoad = NO;
        if (self.accountTF.tf.text.length > 0) {
            self.accountTF.placehoder = @"";
        }
        if (self.loginConfig.keyboardType == 2) {
            self.accountTF.tf.keyboardType = UIKeyboardTypeNumberPad;
        } else if (self.loginConfig.keyboardType == 3) {
            self.accountTF.tf.keyboardType = UIKeyboardTypeEmailAddress;
        } else {
            self.accountTF.tf.keyboardType = UIKeyboardTypeNumbersAndPunctuation;
        }
        
        NSArray *privacieTitles = [RXOSUserUtility sharedManager].privacieTitles;
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
        
        UIView *window = [UIApplication sharedApplication].keyWindow;
        _bgView.frame = CGRectMake(0, 0, [RXOSCommonTool getScreenWidth], RXAC ? 271 : 291);
        _bgView.center = window.center;
        _logoImageView.frame = CGRectMake(CGRectGetWidth(_bgView.frame) / 2 - 108 / 2, RXAC ? 16 : 16, 108, 25);
        _accountTF.frame = CGRectMake(RXAC ? 29 : 25, RXAC ? 57 : 57, CGRectGetWidth(_bgView.frame) - (RXAC ? 59 : 50), RXAC ? 36 : 46);
        _passwordTF.frame = CGRectMake(CGRectGetMinX(_accountTF.frame), CGRectGetMaxY(_accountTF.frame) + 16, CGRectGetWidth(_accountTF.frame), CGRectGetHeight(_accountTF.frame));
        
        CGFloat registBtnW = [[RXLocation osLaunguage:_registBtn.titleLabel.text] widthForFont:_registBtn.titleLabel.font] + 1;
        _registBtn.frame = CGRectMake(RXAC ? 29 : 25, CGRectGetMaxY(_passwordTF.frame) + 14, registBtnW, 30);
        
        CGFloat forgetBtnW = [[RXLocation osLaunguage:_forgetPasswordBtn.titleLabel.text] widthForFont:_forgetPasswordBtn.titleLabel.font] + 1;
        _forgetPasswordBtn.frame = CGRectMake(CGRectGetWidth(_bgView.frame) - (RXAC ? 29 + forgetBtnW : 25 + forgetBtnW), CGRectGetMaxY(_passwordTF.frame) + 14, forgetBtnW, 30);
        
        _loginBtn.frame = CGRectMake(CGRectGetMinX(_accountTF.frame), CGRectGetMaxY(_registBtn.frame) + 16, CGRectGetWidth(_accountTF.frame), RXAC ? 43 : 48);
    }
}

- (void)accountListBtnAction
{
//    RXAccountListView *accountListView = [[RXAccountListView alloc] initWithAddAccount:self.addAccountBlock loginType:self.loginTypeBlock];
}

- (void)loginBtnAction
{
    [self endEditing:YES];
    
    
    //    RXCodeLoginView *codeLogin = [[RXCodeLoginView alloc] initWithAccount:self.accountTF.tf.text];
    //    codeLogin.loginTypeBlock = self.loginTypeBlock;
    //    codeLogin.loginComplete = self.loginComplete;
    //    return;
    
    
    //    if (!self.codeLoginBtn.selected) {
    if (_accountTF.tf.text.length <= 0) {
        [RXOSHUD showErrorText:@"用户名不能为空"];
        return;
    }
    if (_passwordTF.tf.text.length <= 0) {
        [RXOSHUD showErrorText:@"密码不能为空"];
        return;
    }
    
    if (self.codeLoginBtn.selected) {
        NSString *areaCode = [RXOSUserUtility sharedManager].areaCode;
        if ([RXOSCommonTool isRTL]) {
            areaCode = [areaCode stringByReplacingOccurrencesOfString:@"+" withString:@""];
            areaCode = [NSString stringWithFormat:@"+%@", areaCode];
        }
        
        [RXOSUserUtility sharedManager].username = [NSString stringWithFormat:@"%@%@", areaCode, self.accountTF.tf.text];
        
        NSDictionary *loginExt = [NSDictionary dictionary];
        loginExt = self.loginTypeBlock(loginExt, LoginTypeCapCode);
        NSMutableDictionary *loginInfo = [NSMutableDictionary dictionaryWithDictionary:loginExt];
        [loginInfo setValue:[RXOSUserUtility sharedManager].username forKey:@"username"];
        
        NSMutableDictionary *extDic = [NSMutableDictionary dictionary];
        for (int i = 0; i < loginInfo.allKeys.count; i++) {
            if ([loginInfo.allKeys[i] isEqualToString:@"ext"]) {
                extDic = [NSMutableDictionary dictionaryWithDictionary:loginInfo.allValues[i]];
            }
        }
        [extDic setValue:self.passwordTF.tf.text forKey:@"captcha_code"];
        [loginInfo setValue:extDic forKey:@"ext"];
        
        CaptchaType captchaType = CaptchaType_phone;
//        if ([RXOSCommonTool validateEmail:self.accountTF.tf.text]) {
//            captchaType = CaptchaType_email;
//        }
        [RXOSHUD showHUD];
        [[RXApiService sharedSDK] verifyCaptchaCodeWithType:CaptchaType_phone target:[RXOSUserUtility sharedManager].username purpose:@"login" captcha_code:self.passwordTF.tf.text complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
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
//    if(self.accountTF.tf.text == nil || [self.accountTF.tf.text isEqualToString:@""]){
//        [RXOSHUD showErrorText:@"请输入您的手机号"];
//        return;
//    }
    
//    if (![RXOSCommonTool validateMobile:self.accountTF.tf.text]) {
//        [RXOSHUD showErrorText:@"手机号格式错误，请重新输入"];
//        return;
//    }
//    [RXOSHUD showHUD];
    
    CaptchaType captchaType = CaptchaType_phone;
    if ([RXOSCommonTool validateEmail:self.accountTF.tf.text]) {
        captchaType = CaptchaType_email;
    }
    [RXOSHUD showHUD];
    
    NSString *areaCode = [RXOSUserUtility sharedManager].areaCode;
    if ([RXOSCommonTool isRTL]) {
        areaCode = [areaCode stringByReplacingOccurrencesOfString:@"+" withString:@""];
        areaCode = [NSString stringWithFormat:@"+%@", areaCode];
    }
    NSString *phone = [NSString stringWithFormat:@"%@%@", areaCode, self.accountTF.tf.text];
    [[RXApiService sharedSDK] getCaptchaCodeWithType:captchaType target:phone purpose:@"login" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
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
            
            self.codeTFR = self.passwordTF.tf.frame;
            self.codeLblR = self.passwordTF.codeLbl.frame;
            self.codePlaceR = self.passwordTF.placeholderLbl.frame;
            
            self.passwordTF.codeLbl.enabled = NO;
            self.timeCount = 60;
            NSString *text = [NSString stringWithFormat:@"%@(%ld)", [RXLocation osLaunguage:@"重新获取"],(long)self.timeCount];
            NSDictionary *attribtDic = @{NSUnderlineStyleAttributeName : [NSNumber numberWithInteger:NSUnderlineStyleSingle], NSUnderlineColorAttributeName : [UIColor clearColor]};

            NSMutableAttributedString *attribtStr = [[NSMutableAttributedString alloc] initWithString:text attributes:attribtDic];
            [attribtStr addAttribute:NSForegroundColorAttributeName value:[UIColor colorWithHexString:@"#AFAFAF"] range:NSMakeRange(0, text.length)];
            self.passwordTF.codeLbl.attributedText = attribtStr;
            
            CGFloat codeW = [text widthForFont:self.passwordTF.codeLbl.font] + 6;
            
            if ([RXOSCommonTool isRTL]) {
                self.passwordTF.codeLbl.frame = CGRectMake(0, 0, codeW, RXAC ? 36 : 46);
                self.passwordTF.tf.frame = CGRectMake(codeW, CGRectGetMinY(self.passwordTF.tf.frame), CGRectGetWidth(self.passwordTF.tf.frame) - 50, CGRectGetHeight(self.passwordTF.tf.frame));
//                self.passwordTF.placeholderLbl.frame = CGRectMake(CGRectGetMinX(self.passwordTF.tf.frame), 0, CGRectGetWidth(self.passwordTF.tf.frame) - (RXAC ? 13 : 13), CGRectGetHeight(self.passwordTF.tf.frame));
            } else {
//                codeW = [text widthForFont:self.codeTF.codeLbl.font] + 20;
                self.passwordTF.codeLbl.frame = CGRectMake(CGRectGetWidth(self.passwordTF.frame) - codeW, 0, codeW, RXAC ? 36 : 46);
                self.passwordTF.tf.frame = CGRectMake(CGRectGetMinX(self.passwordTF.tf.frame), CGRectGetMinY(self.passwordTF.tf.frame), CGRectGetWidth(self.passwordTF.tf.frame) - 26, CGRectGetHeight(self.passwordTF.tf.frame));
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
        
        NSString *text = [RXLocation osLaunguage:@"获取验证码"];
        NSDictionary *attribtDic = @{NSUnderlineStyleAttributeName: [NSNumber numberWithInteger:NSUnderlineStyleSingle],NSUnderlineColorAttributeName:[UIColor clearColor]};

        NSMutableAttributedString *attribtStr = [[NSMutableAttributedString alloc]initWithString:text attributes:attribtDic];
        self.passwordTF.codeLbl.attributedText = attribtStr;
        self.passwordTF.codeLbl.textColor = [UIColor colorWithHexString:@"#74D2CB"];
        
//        self.passwordTF.codeLbl.frame = CGRectMake(self.codeX, CGRectGetMinY(self.passwordTF.codeLbl.frame), CGRectGetWidth(self.passwordTF.codeLbl.frame), CGRectGetHeight(self.passwordTF.codeLbl.frame));
//        self.passwordTF.line.frame = CGRectMake(self.lineX, CGRectGetMinY(self.passwordTF.line.frame), CGRectGetWidth(self.passwordTF.line.frame), CGRectGetHeight(self.passwordTF.line.frame));
        self.passwordTF.tf.frame = self.codeTFR;
        self.passwordTF.codeLbl.frame = self.codeLblR;
        self.passwordTF.placeholderLbl.frame = self.codePlaceR;
        
        self.passwordTF.codeLbl.enabled = YES;
        [time invalidate];
        return;
    }
    
    NSString *text = [NSString stringWithFormat:@"%@(%ld)", [RXLocation osLaunguage:@"重新获取"],(long)self.timeCount];
    NSDictionary *attribtDic = @{NSUnderlineStyleAttributeName : [NSNumber numberWithInteger:NSUnderlineStyleSingle], NSUnderlineColorAttributeName : [UIColor clearColor]};
    
//    self.passwordTF.line.frame = CGRectMake(CGRectGetMinX(self.passwordTF.line.frame) - 10, CGRectGetMinY(self.passwordTF.line.frame), CGRectGetWidth(self.passwordTF.line.frame), CGRectGetHeight(self.passwordTF.line.frame));

    NSMutableAttributedString *attribtStr = [[NSMutableAttributedString alloc] initWithString:text attributes:attribtDic];
    [attribtStr addAttribute:NSForegroundColorAttributeName value:[UIColor colorWithHexString:@"#AFAFAF"] range:NSMakeRange(0, text.length)];
    self.passwordTF.codeLbl.attributedText = attribtStr;
//    self.passwordTF2.codeLbl.textColor = [UIColor colorWithHexString:@"#74D2CB"];
}


#pragma mark -- <UITextFieldDelegate>
- (void)textViewDidChangeSelection:(UITextView *)textView
{
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
    }

    if (!self.codeLoginBtn.selected) {
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
        if (textView == _passwordTF.tf && str.length > 6) {
            _passwordTF.tf.text = [str substringToIndex:6];
        }
        if (textView == _accountTF.tf) {
            // 过滤空格
            _accountTF.tf.text = [_accountTF.tf.text stringByReplacingOccurrencesOfString:@" " withString:@""];
        }
        if (_accountTF.tf.text.length > 0 && _passwordTF.tf.text.length > 0) {
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
            
            if (_passwordTF.tf.text.length > 0) {
                _loginBtn.userInteractionEnabled = YES;
                [_loginBtn setBackgroundColor:[UIColor colorWithHexString:@"20C0B3"]];
            } else {
                _loginBtn.userInteractionEnabled = NO;
                [_loginBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
            }
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
                [self changeText:textField];
                return NO;
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

- (void)registBtnAction
{
    // 事件上报
    NSMutableDictionary *trackDic = [NSMutableDictionary dictionary];
    [trackDic setValue:@"1" forKey:@"login_type"];
    [trackDic setValue:@"1-1" forKey:@"login_category"];
    [trackDic setValue:@"1-2" forKey:@"login_action"];
    [[RXLogService sharedSDK] addLogSingleFirstLoginWithEvent:rxlog_login_process distinctId:@"" properties:trackDic];
    
    RXOSRegistView *registView = [[RXOSRegistView alloc] initWithType:RegistViewType_regist extDic:nil complete:^(BOOL success, NSString * _Nonnull username, NSString * _Nonnull password) {
        self.accountTF.tf.text = username;
//        self.accountTF.placehoder = @"";
        self.accountTF.placeholderLbl.hidden = YES;
    }];
    [self endEditing:YES];
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
        _accountTF = [[RXOSTextField alloc] initWithPlaceholder:@"请输入您的邮箱账号" type:TFType_clear keyboardType:UIKeyboardTypeNumbersAndPunctuation];
        _accountTF.tf.delegate = self;
        _accountTF.tf.returnKeyType = UIReturnKeyDone;
    }
    return _accountTF;
}

- (RXOSTextField *)passwordTF
{
    if (!_passwordTF) {
        _passwordTF = [[RXOSTextField alloc] initWithPlaceholder:@"请输入您的密码" type:TFType_loginCode keyboardType:UIKeyboardTypeDefault];
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
        [_forgetPasswordBtn setTitle:[RXLocation osLaunguage:@"忘记密码"] forState:UIControlStateNormal];
        _forgetPasswordBtn.titleLabel.textAlignment = NSTextAlignmentRight;
        [_forgetPasswordBtn setTitleColor:[UIColor colorWithHexString:@"#20C0B3"] forState:UIControlStateNormal];
        _forgetPasswordBtn.titleLabel.font = [UIFont systemFontOfSize:16 weight:UIFontWeightMedium];
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

- (UIView *)alphaView
{
    if (!_alphaView) {
        _alphaView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, [UIApplication sharedApplication].keyWindow.frame.size.width, [UIApplication sharedApplication].keyWindow.frame.size.height)];
        _alphaView.tag = AlphaTag;
    }
    return _alphaView;
}

- (UIButton *)registBtn
{
    if (!_registBtn) {
        _registBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_registBtn setTitle:[RXLocation osLaunguage:@"立即注册"] forState:UIControlStateNormal];
        _registBtn.titleLabel.textAlignment = NSTextAlignmentLeft;
        [_registBtn setTitleColor:[UIColor colorWithHexString:@"#20C0B3"] forState:UIControlStateNormal];
        _registBtn.titleLabel.font = [UIFont systemFontOfSize:16 weight:UIFontWeightMedium];
        [_registBtn addTarget:self action:@selector(registBtnAction) forControlEvents:UIControlEventTouchUpInside];
        _registBtn.hidden = YES;
    }
    return _registBtn;
}

@end
