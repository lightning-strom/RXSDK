//
//  RXSingleLoginView.m
//  RXUIKit
//
//  Created by 陈汉 on 2025/6/24.
//

#import "RXSingleLoginView.h"
#import "RXUICommonTool.h"
#import "RXAttributeLabel.h"
#import "RXPrivacyView.h"
#import "RXPriView.h"
#import "RXCommonWKWebView.h"
#import "RXLoginViewManager.h"
#import <RXSDK_Pure/RXErrorTool.h>
#import <RXSDK_Pure/RXSDK_Pure.h>
#import "RXCloseBtn.h"
#import "UIView+RXShade.h"
#import "RXSelectBtn.h"
#import "RXLegalModel.h"
#import "RXWKWebView.h"
#import "RXSingleTextField.h"

#define LoginBtnTag 100000
#define AlphaTag 200000

@interface RXSingleSelectBtn : UIButton

@end

@implementation RXSingleSelectBtn

- (void)layoutSubviews
{
    [super layoutSubviews];
    
    self.imageView.frame = CGRectMake(40, 18.4, 17, 17);
}

@end

@interface RXSingleLoginView () <RXAttributeLabelDelegate, UITextFieldDelegate, UITextViewDelegate>

@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) UIView *alphaView;
@property (nonatomic, strong) UILabel *titleLbl;
@property (nonatomic, strong) RXCloseBtn *closeBtn;
@property (nonatomic, strong) RXSingleSelectBtn *selectBtn;
@property (nonatomic, strong) RXAttributeLabel *priLbl;
@property (nonatomic, assign) NSInteger orientation;  // 屏幕方向 1竖屏 2横屏
@property (nonatomic, assign) BOOL needSet;
@property (nonatomic, assign) BOOL isSelect;
@property (nonatomic, assign) BOOL isFirstAutoChange;
@property (nonatomic, assign) BOOL isShowKeyboard;
@property (nonatomic, assign) BOOL isTimeStart;
@property (nonatomic, assign) BOOL isFromNoti;
@property (nonatomic, assign) BOOL isSecret;
@property (nonatomic, assign) BOOL isShowPwd;
@property (nonatomic, assign) BOOL isChangeStatus;
@property (nonatomic, strong) NSString *phoneNum;
@property (nonatomic, copy) LoginTypeBlock loginTypeBlock;
@property (nonatomic, copy) LoginComplete loginComplete;
@property (nonatomic, strong) RXSingleTextField *accountTF;
@property (nonatomic, strong) RXSingleTextField *codeTF;
@property (nonatomic, strong) UIButton *loginBtn;
@property (nonatomic, strong) UILabel *forgetPasswordBtn;
@property (nonatomic, strong) RXLoginUIConfig *loginConfig;

@property (nonatomic, strong) UIImageView *logoImageView;
@property (nonatomic, strong) UIImage *logoImage;
@property (nonatomic, assign) NSInteger timeCount;
@property (nonatomic, assign) CGFloat lineX;
@property (nonatomic, assign) CGFloat passwordlineX;
@property (nonatomic, assign) CGRect codeLblFrame;
@property (nonatomic, strong) NSString *priText;
@property (nonatomic, strong) NSMutableArray *selectBtnTextCounts;

@property (nonatomic, strong) NSString *inputStr;

@end

@implementation RXSingleLoginView

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
        self.loginConfig = config;
        
        self.loginTypeBlock = loginEvent;
        self.loginComplete = complete;
        self.logoImage = config.logoImage;
        self.isSelect = config.isPrivacySelected;
        
        [self setUI];
        [self show];
        
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(resetPwd:) name:RXUINoti_resetPwd object:nil];
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
        self.accountTF.placehoder = @"请输入您的手机号/账号";
        [_loginBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
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

        [self layoutSubviews];
    }];
}

- (void)keyBoardWillHide:(NSNotification *)notification
{
    self.isShowKeyboard = NO;
    [RXUIUserUtility sharedManager].allowExtensionPointIdentifier = YES;
    
    if (!RXAC || self.loginConfig.loginTypes.count > 0) return;
    NSDictionary *userInfo = [notification userInfo];
    NSNumber *duration = [userInfo objectForKey:UIKeyboardAnimationDurationUserInfoKey];
    
    [UIView animateWithDuration:duration.doubleValue animations:^{
        UIView *window = [UIApplication sharedApplication].keyWindow;
        self.bgView.center = window.center;

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
    [self.bgView addSubview:self.codeTF];
    [self.bgView addSubview:self.loginBtn];
    [self.bgView addSubview:self.priLbl];
    [self.bgView addSubview:self.selectBtn];
    [self.bgView addSubview:self.forgetPasswordBtn];
    
    [self layoutViews];
}

- (void)layoutViews
{
    UIView *window = [UIApplication sharedApplication].keyWindow;
    
    CGFloat bgH = RXAC ? 308 : 308;
    
    _bgView.frame = CGRectMake(0, 0, [RXUICommonTool getSingleScreenWidth], bgH);
    _bgView.center = window.center;
    
//    if (self.logoImage) {
    _titleLbl.hidden = YES;
    _logoImageView.hidden = NO;
    _logoImageView.frame = CGRectMake(CGRectGetWidth(_bgView.frame) / 2 - 146 / 2, RXAC ? 24 : 24, 146, 33);
    if ([self.logoImage isKindOfClass:[UIImage class]]) {
        _logoImageView.image = self.logoImage;
    } else {
        _logoImageView.image = [RXUICommonTool getImageFromURL:(NSString *)self.logoImage];
    }
    
    _accountTF.frame = CGRectMake(RXAC ? 21 : 21, RXAC ? 74 : 74, [RXUICommonTool getSingleScreenWidth] - (RXAC ? 42 : 42), RXAC ? 39 : 39);
    
    _codeTF.frame = CGRectMake(CGRectGetMinX(_accountTF.frame), CGRectGetMaxY(_accountTF.frame) + 8, CGRectGetWidth(_accountTF.frame), CGRectGetHeight(_accountTF.frame));
    
    _loginBtn.frame = CGRectMake(CGRectGetMinX(_accountTF.frame), CGRectGetMaxY(_codeTF.frame) + (RXAC ? 6 : 6), CGRectGetWidth(_accountTF.frame), RXAC ? 46 : 46);
    
    CGFloat priY = RXAC ? 47 : 47;
    if (!RXAC && self.loginConfig.privacieTitles.count >= 3) {
        priY -= 1.5;
    }
    CGFloat size = RXAC ? 16 : (self.loginConfig.privacieTitles.count >= 3 ? 16 : 16);
    CGFloat btnW = [self.priText widthForFont:[UIFont systemFontOfSize:size weight:UIFontWeightRegular]] + (RXAC ? 2 : 2);
    
    _priLbl.frame = CGRectMake(CGRectGetMinX(_loginBtn.frame) + (RXAC ? 14 : 14), CGRectGetMaxY(_loginBtn.frame) + (RXAC ? 14 : 14), CGRectGetWidth(_loginBtn.frame) - 7.5, 50);
    _selectBtn.frame = CGRectMake(CGRectGetMinX(_priLbl.frame) - (RXAC ? 66 : 66), CGRectGetMinX(_priLbl.frame), [RXUICommonTool getScreenWidth], 50);
    _selectBtn.center = CGPointMake(CGRectGetMinX(_priLbl.frame) + (RXAC ? 128 : 118), _priLbl.center.y - (RXAC ? 10.5 : 10.5));
    
    _loginBtn.frame = CGRectMake(CGRectGetMinX(_accountTF.frame), CGRectGetMaxY(_codeTF.frame) + (RXAC ? 14 : 14), CGRectGetWidth(_accountTF.frame), RXAC ? 45 : 45);

    _forgetPasswordBtn.frame = CGRectMake(CGRectGetWidth(_bgView.frame) / 2 - 50, CGRectGetHeight(_bgView.frame) - 40, 100, 24);
    
    _closeBtn.frame = CGRectMake(RXAC ? 335 : 310, RXAC ? 14 : 14, 21, 21);
    
//    [self.bgView bringSubviewToFront:self.selectBtn];
//    [self.bgView bringSubviewToFront:self.priLbl];
    
    __weak typeof(self) weakSelf = self;
    _codeTF.showPwdBtnBlock = ^(BOOL isSecret) {
        weakSelf.isShowPwd = !isSecret;
        weakSelf.isSecret = isSecret;
//        if (isSecret) {
//            dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
//                weakSelf.codeTF.tf.secureTextEntry = NO;
//            });
//        }
    };

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

    [self removeFromSuperview];
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
- (void)resetPwd:(NSNotification *)noti
{
    self.accountTF.tf.text = noti.userInfo[@"username"];
    self.accountTF.placehoder = @"";
    
    NSString *password = noti.userInfo[@"password"];
    if (password && password.length > 0) {
        self.codeTF.tf.text = password;
        self.codeTF.placehoder = @"";
    }
}

- (void)slideCodeSuc:(NSNotification *)noti
{
    [RXHUD showHUD];
}

#pragma mark -- <actions>
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

- (void)loginBtnAction
{
    [self endEditing:YES];
    
    // 用户行为上报
    NSMutableDictionary *thirdRes = [NSMutableDictionary dictionary];
    NSString *method = @"username";
    __block BOOL isCode = YES;
    
    if ([RXUICommonTool validateMobile:self.accountTF.tf.text] && self.codeTF.tf.text.length == 4) {
        isCode = YES;
    } else {
        isCode = NO;
    }
    
    [thirdRes setValue:method forKey:@"method"];

    [[RXUserActionLogManager sharedSDK] addUserActionWithScene:@"login" action:@"login" properties:thirdRes];
    
    if (_accountTF.tf.text.length <= 0) {
        [RXHUD showErrorText:@"用户名不能为空"];
        return;
    } else if (_codeTF.tf.text.length <= 0) {
        NSString *title = @"验证码/密码不能为空";
        [RXHUD showErrorText:title];
        return;
    } else if (!_selectBtn.isSelected) {
        
        RXPriView *priView = [[RXPriView alloc] init];
        
        priView.agreeBlock = ^{

            [self selectBtnAction:self.selectBtn];
            [RXHUD hideHUD];
            
            if (isCode) {
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
                [RXUIUserUtility sharedManager].password = self.codeTF.tf.text;
                
                NSDictionary *loginExt = [NSDictionary dictionary];
                if (self.loginTypeBlock) {
                    loginExt = self.loginTypeBlock(loginExt, LoginTypeAccount);
                    NSMutableDictionary *loginInfo = [NSMutableDictionary dictionaryWithDictionary:loginExt];
                    [loginInfo setValue:self.accountTF.tf.text forKey:@"username"];
                    [loginInfo setValue:self.codeTF.tf.text forKey:@"password"];
                    [[RXLoginViewManager sharedSDK] fetchLoginEvent:LoginTypeAccount loginInfo:loginInfo complete:self.loginComplete];
                }
            }
            
            return;
        };
    } else {

        if (isCode) {
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
            [RXUIUserUtility sharedManager].password = self.codeTF.tf.text;
            
            NSDictionary *loginExt = [NSDictionary dictionary];
            if (self.loginTypeBlock) {
                loginExt = self.loginTypeBlock(loginExt, LoginTypeAccount);
                NSMutableDictionary *loginInfo = [NSMutableDictionary dictionaryWithDictionary:loginExt];
                [loginInfo setValue:self.accountTF.tf.text forKey:@"username"];
                [loginInfo setValue:self.codeTF.tf.text forKey:@"password"];
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
        [RXHUD showErrorText:@"请输入您的手机号/账号"];
        return;
    }
    
    if (![RXUICommonTool validateMobile:self.accountTF.tf.text]) {
        [RXHUD showErrorText:@"手机号格式错误，请重新输入"];
        return;
    }
    
    if (!_selectBtn.isSelected) {
        RXPriView *priView = [[RXPriView alloc] init];
        priView.agreeBlock = ^{
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
                    self.codeTF.codeLbl.enabled = NO;
                    self.timeCount = 60;
                    NSString *text = [NSString stringWithFormat:@"重新获取(%ld)", (long)self.timeCount];
                    NSDictionary *attribtDic = @{NSUnderlineStyleAttributeName : [NSNumber numberWithInteger:NSUnderlineStyleSingle], NSUnderlineColorAttributeName : [UIColor clearColor]};

                    NSMutableAttributedString *attribtStr = [[NSMutableAttributedString alloc] initWithString:text attributes:attribtDic];
                    [attribtStr addAttribute:NSForegroundColorAttributeName value:[UIColor colorWithHexString:@"#AFAFAF"] range:NSMakeRange(0, text.length)];
                    self.codeTF.codeLbl.attributedText = attribtStr;
                    self.lineX = CGRectGetMinX(self.codeTF.bgView.frame);
                    self.passwordlineX = CGRectGetMinX(self.codeTF.line.frame);
                    self.codeLblFrame = self.codeTF.codeLbl.frame;
                    
                    self.codeTF.bgView.frame = CGRectMake(CGRectGetMinX(self.codeTF.bgView.frame) - 5, CGRectGetMinY(self.codeTF.bgView.frame), CGRectGetWidth(self.codeTF.bgView.frame), CGRectGetHeight(self.codeTF.bgView.frame));
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
                
                self.codeTF.codeLbl.enabled = NO;
                self.timeCount = 60;
                NSString *text = [NSString stringWithFormat:@"重新获取(%ld)", (long)self.timeCount];
                NSDictionary *attribtDic = @{NSUnderlineStyleAttributeName : [NSNumber numberWithInteger:NSUnderlineStyleSingle], NSUnderlineColorAttributeName : [UIColor clearColor]};

                NSMutableAttributedString *attribtStr = [[NSMutableAttributedString alloc] initWithString:text attributes:attribtDic];
                [attribtStr addAttribute:NSForegroundColorAttributeName value:[UIColor colorWithHexString:@"#AFAFAF"] range:NSMakeRange(0, text.length)];
                self.codeTF.codeLbl.attributedText = attribtStr;
                self.lineX = CGRectGetMinX(self.codeTF.bgView.frame);
                self.passwordlineX = CGRectGetMinX(self.codeTF.line.frame);
                self.codeLblFrame = self.codeTF.codeLbl.frame;

                self.codeTF.line.hidden = YES;
                self.codeTF.bgView.frame = CGRectMake(CGRectGetMinX(self.codeTF.bgView.frame) - 5, CGRectGetMinY(self.codeTF.bgView.frame), CGRectGetWidth(self.codeTF.bgView.frame), CGRectGetHeight(self.codeTF.bgView.frame));
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
        
        self.codeTF.line.hidden = NO;
        self.codeTF.line.hidden = NO;
        self.codeTF.bgView.frame = CGRectMake(self.lineX, CGRectGetMinY(self.codeTF.bgView.frame), CGRectGetWidth(self.codeTF.bgView.frame), CGRectGetHeight(self.codeTF.bgView.frame));
        self.codeTF.codeLbl.frame = self.codeLblFrame;
        self.codeTF.codeLbl.enabled = YES;
        [time invalidate];
        return;
    }
    
    NSString *text = [NSString stringWithFormat:@"重新获取(%ld)", (long)self.timeCount];
    NSDictionary *attribtDic = @{NSUnderlineStyleAttributeName : [NSNumber numberWithInteger:NSUnderlineStyleSingle], NSUnderlineColorAttributeName : [UIColor clearColor]};

    NSMutableAttributedString *attribtStr = [[NSMutableAttributedString alloc] initWithString:text attributes:attribtDic];
    [attribtStr addAttribute:NSForegroundColorAttributeName value:[UIColor colorWithHexString:@"#AFAFAF"] range:NSMakeRange(0, text.length)];
    self.codeTF.codeLbl.attributedText = attribtStr;
}


#pragma mark -- <UITextFieldDelegate>
- (void)textFieldDidBeginEditing:(UITextField *)textField
{
    if (textField == _codeTF.tf) {
        [RXUIUserUtility sharedManager].allowExtensionPointIdentifier = NO;
        
//        if (self.isShowPwd) {
//            self.isSecret = NO;
//        }
        
        if (self.isSecret) {
            if (textField.text.length < 4) {
                _codeTF.showPwdBtn.hidden = YES;
                _codeTF.tf.secureTextEntry = NO;
                self.isSecret = NO;
            }
            
            self.isChangeStatus = YES;
        }
    } else {
        [RXUIUserUtility sharedManager].allowExtensionPointIdentifier = YES;
    }
    
    // 用户行为上报
    NSMutableDictionary *thirdRes = [NSMutableDictionary dictionary];
    
    NSString *action = @"";
    NSString *method = @"";
    
    method = @"captchacode";
    if (textField == _accountTF.tf) {
        action = @"phone_tf";
    }
    if (textField == _codeTF.tf) {
        action = @"captchacode_tf";
    }
    
    [thirdRes setValue:method forKey:@"method"];
    
    [[RXUserActionLogManager sharedSDK] addUserActionWithScene:@"login" action:action properties:thirdRes];
}

- (BOOL)textFieldShouldReturn:(UITextField *)textField
{
    [textField endEditing:YES];
    
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
        if (textView == _codeTF.tf) {
            _codeTF.placeholderLbl.hidden = YES;
            _codeTF.showPwdBtn.hidden = NO;
        }
        if (textView == _codeTF.tf) {
            _codeTF.placeholderLbl.hidden = YES;
            _codeTF.showPwdBtn.hidden = NO;
        }
    } else {
        if (textView == _accountTF.tf) {
            _accountTF.placeholderLbl.hidden = NO;
        }
        if (textView == _codeTF.tf) {
            _codeTF.placeholderLbl.hidden = NO;
            _codeTF.showPwdBtn.hidden = YES;
            _codeTF.showPwdBtn.selected = YES;
            [_codeTF showPwdBtnAction:_codeTF.showPwdBtn];
        }
        if (textView == _codeTF.tf) {
            _codeTF.placeholderLbl.hidden = NO;
            _codeTF.showPwdBtn.hidden = YES;
            _codeTF.showPwdBtn.selected = YES;
            [_codeTF showPwdBtnAction:_codeTF.showPwdBtn];
        }
    }
    
    if (textView == _codeTF.tf && str.length > 32) {
        _codeTF.tf.text = [str substringToIndex:32];
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

- (BOOL)textField:(UITextField *)textField shouldChangeCharactersInRange:(NSRange)range replacementString:(NSString *)string
{
    self.isChange = YES;
    NSString *str = textField.text;
    NSString *tfStr = _codeTF.tf.text;
    
//    NSLog(@"%@", tfStr);
    
    if (string.length > 0) {
        if (textField == _accountTF.tf) {
            _accountTF.placeholderLbl.hidden = YES;
            
            if (_codeTF.tf.text.length > 0) {
                _loginBtn.userInteractionEnabled = YES;
                [_loginBtn setBackgroundColor:[UIColor colorWithHexString:@"20C0B3"]];
            } else {
                _loginBtn.userInteractionEnabled = NO;
                [_loginBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
            }
            
            NSString *fetchStr = [NSString stringWithFormat:@"%@%@", str, string];
        }
        if (textField == _codeTF.tf) {
            _codeTF.placeholderLbl.hidden = YES;
            
            if (str.length > 3) {
                if (!self.isSecret && !self.isShowPwd) {
                    _codeTF.showPwdBtn.hidden = NO;
                    _codeTF.tf.secureTextEntry = YES;
                    
                    tfStr = [NSString stringWithFormat:@"%@%@", tfStr, string];
                    
                    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
                        if (self.codeTF.tf.text.length < str.length) {
                            
                            NSLog(@"tf = %@\nstr = %@", self.codeTF.tf.text, str);
                            self.codeTF.tf.text = tfStr;
                        }
                    });
                    
                    self.isSecret = YES;
                    self.isShowPwd = YES;
                }
            } else {
                _codeTF.showPwdBtn.hidden = YES;
                _codeTF.tf.secureTextEntry = NO;
                self.isSecret = NO;
                self.isShowPwd = NO;
            }
            
            dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
                if ((self.isSecret && !self.isShowPwd) || self.isChangeStatus) {
                    self.codeTF.showPwdBtn.hidden = YES;
                    self.codeTF.tf.secureTextEntry = NO;
                    self.isSecret = NO;
                    self.isShowPwd = NO;
                    self.isChangeStatus = NO;
                }
            });
            
            
            if (_accountTF.tf.text.length > 0) {
                _loginBtn.userInteractionEnabled = YES;
                [_loginBtn setBackgroundColor:[UIColor colorWithHexString:@"20C0B3"]];
            } else {
                _loginBtn.userInteractionEnabled = NO;
                [_loginBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
            }
        }
    } else {
        if (str.length < 6) {
            _codeTF.showPwdBtn.hidden = YES;
            _codeTF.showPwdBtn.selected = YES;
            [_codeTF showPwdBtnAction:_codeTF.showPwdBtn];
            _codeTF.tf.secureTextEntry = NO;
            self.isSecret = NO;
            self.isShowPwd = NO;
        } else {
            if (self.isChangeStatus && self.isSecret) {
                _codeTF.placeholderLbl.hidden = NO;
                _codeTF.showPwdBtn.hidden = YES;
                _codeTF.showPwdBtn.selected = YES;
                [_codeTF showPwdBtnAction:_codeTF.showPwdBtn];
                
                self.isSecret = NO;
                self.isShowPwd = NO;
                self.isChangeStatus = NO;
            }
        }
        
        if (str.length == 1) {
            _loginBtn.userInteractionEnabled = NO;
            [_loginBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
            
            if (textField == _accountTF.tf) {
                _accountTF.placeholderLbl.hidden = NO;
            }
            if (textField == _codeTF.tf) {
                _codeTF.placeholderLbl.hidden = NO;
//                _codeTF.showPwdBtn.hidden = YES;
//                _codeTF.showPwdBtn.selected = YES;
//                [_codeTF showPwdBtnAction:_codeTF.showPwdBtn];
            }
            [RXUIUserUtility sharedManager].username = @"";
        } else {
            
        }
    }
    
    if (textField == _codeTF.tf && str.length > 31 && string.length > 0) {
        return NO;
    }
    if (textField == _accountTF.tf) {
        if ([string isEqualToString:@" "]) {
            return NO;
        }
        // 过滤空格
        _accountTF.tf.text = [_accountTF.tf.text stringByReplacingOccurrencesOfString:@" " withString:@""];
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
    NSString *method = @"username";
    
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
        NSString *method = @"username";
        
        [thirdRes setValue:method forKey:@"method"];
        
        if (reportUrl.length > 0) {
            [thirdRes setValue:reportUrl forKey:@"url"];
        }

        [[RXUserActionLogManager sharedSDK] addUserActionWithScene:@"login" action:@"privacy" properties:thirdRes];
        
    } else {
        [self selectBtnAction:self.selectBtn];
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

- (RXSingleSelectBtn *)selectBtn
{
    if (!_selectBtn) {
        _selectBtn = [RXSingleSelectBtn buttonWithType:UIButtonTypeCustom];
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
        _priLbl.textColor = [UIColor blackColor];
        _priLbl.delegate = self;
        CGFloat size = RXAC ? 14.5 : (privacieTitles.count >= 3 ? 14 : 16);
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
        _closeBtn.hidden = NO;
    }
    return _closeBtn;
}

- (RXSingleTextField *)accountTF
{
    if (!_accountTF) {
        _accountTF = [[RXSingleTextField alloc] initWithPlaceholder:@"请输入您的手机号/账号" type:SingleTFType_clear keyboardType:UIKeyboardTypeNumbersAndPunctuation];
        _accountTF.tf.delegate = self;
        _accountTF.tf.returnKeyType = UIReturnKeyDone;
    }
    return _accountTF;
}

- (RXSingleTextField *)codeTF
{
    if (!_codeTF) {
        _codeTF = [[RXSingleTextField alloc] initWithPlaceholder:@"请输入您的验证码/密码" type:SingleTFType_loginCode keyboardType:UIKeyboardTypeNumbersAndPunctuation];
        _codeTF.tf.delegate = self;
        
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
        [_loginBtn setTitle:@"登录/注册" forState:UIControlStateNormal];
        [_loginBtn setTitleColor:[UIColor colorWithHexString:@"F2FFFB"] forState:UIControlStateNormal];
        [_loginBtn setBackgroundColor:[UIColor colorWithHexString:@"20C0B3"]];
        _loginBtn.titleLabel.font = [UIFont systemFontOfSize:19 weight:UIFontWeightMedium];
        _loginBtn.layer.cornerRadius = 5;
        [_loginBtn addTarget:self action:@selector(loginBtnAction) forControlEvents:UIControlEventTouchUpInside];
        _loginBtn.userInteractionEnabled = NO;
        [_loginBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
    }
    return _loginBtn;
}

- (UILabel *)forgetPasswordBtn
{
    if (!_forgetPasswordBtn) {
        _forgetPasswordBtn = [[UILabel alloc] init];
        
        NSString *btnTitle = @"忘记密码？";
        NSMutableAttributedString *attributedString = [[NSMutableAttributedString alloc] initWithString:btnTitle];
        NSDictionary *attributes = @{
            NSBaselineOffsetAttributeName: @(3), // 值越大，间距越大
            
            // 设置下划线样式
            NSUnderlineStyleAttributeName: @(NSUnderlineStyleSingle),
            
            // 设置下划线颜色
            NSUnderlineColorAttributeName: [UIColor colorWithHexString:@"666666"]
        };
        
        [attributedString addAttributes:attributes range:NSMakeRange(0, [btnTitle length])];
        
        _forgetPasswordBtn.attributedText = attributedString;
        _forgetPasswordBtn.font = [UIFont systemFontOfSize:14.5];
        _forgetPasswordBtn.textColor = [UIColor colorWithHexString:@"666666"];
        _forgetPasswordBtn.textAlignment = NSTextAlignmentCenter;
        _forgetPasswordBtn.userInteractionEnabled = YES;
        
        UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(forgetPasswordBtnAction)];
        [_forgetPasswordBtn addGestureRecognizer:tap];
    }
    return _forgetPasswordBtn;
}

- (UIImageView *)logoImageView
{
    if (!_logoImageView) {
        _logoImageView = [[UIImageView alloc] init];
        _logoImageView.contentMode = UIViewContentModeScaleAspectFill;
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

- (NSMutableArray *)selectBtnTextCounts
{
    if (!_selectBtnTextCounts) {
        _selectBtnTextCounts = [NSMutableArray array];
    }
    return _selectBtnTextCounts;
}

@end
