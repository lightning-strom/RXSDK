//
//  RXOSGetBackPasswordView.m
//  RXSDK
//
//  Created by 陈汉 on 2021/10/8.
//

#import "RXOSGetBackPasswordView.h"
#import "RXOSCommonTool.h"
#import <RXSDK_Pure/RXErrorTool.h>
#import "RXOSCloseBtn.h"
#import "RXOSCommonView.h"

@interface RXOSGetBackPasswordView () <UITextFieldDelegate, UITextViewDelegate>

@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) UILabel *titleLbl;
@property (nonatomic, strong) RXOSTextField *passwordTF1;
@property (nonatomic, strong) RXOSTextField *passwordTF2;
@property (nonatomic, strong) UIButton *confirmBtn;
@property (nonatomic, strong) RXOSCloseBtn *closeBtn;
@property (nonatomic, assign) NSInteger orientation;  // 屏幕方向 1竖屏 2横屏
@property (nonatomic, assign) GetBackPasswordType type;
@property (nonatomic, assign) NSInteger timeCount;
@property (nonatomic, strong) NSString *phoneStr;
@property (nonatomic, strong) NSString *codeStr;
@property (nonatomic, assign) CGRect codeLblR;
@property (nonatomic, assign) CGRect codeTFR;
@property (nonatomic, assign) CGRect codePlaceR;

@end

@implementation RXOSGetBackPasswordView

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (instancetype)initWithType:(GetBackPasswordType)type
                       phone:(NSString *)phone
                        code:(NSString *)code
{
    self = [super initWithFrame:CGRectMake(0, 0, [UIApplication sharedApplication].keyWindow.frame.size.width, [UIApplication sharedApplication].keyWindow.frame.size.height)];
    
    if (type == GetBackPasswordType_code) {
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
    } else {
        self.backgroundColor = [UIColor clearColor];
    }
    
    if (self) {
        [[UIApplication sharedApplication].keyWindow addSubview:self];
        
        self.orientation = [RXOSCommonTool getInterfaceOrientation];
        self.phoneStr = phone;
        self.codeStr = code;
        self.type = type;
        
        [self setUI];
        [self addNotifications];
        [self show];
        
        UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tapAction:)];
        [self addGestureRecognizer:tap];
        
        // 监听屏幕旋转（横竖屏）
//        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onDeviceOrientationDidChange)
//                             name:UIDeviceOrientationDidChangeNotification
//                                                       object:nil];
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
    if (self.type == GetBackPasswordType_code) {
        [UIView animateWithDuration:0.1 animations:^{
            self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.5];
            [RXOSCommonTool showWithAnimate:self.bgView];
            [self layoutSubviews];
        }];
    } else {
        [UIView animateWithDuration:0.1 animations:^{
            [RXOSCommonTool showWithAnimate:self.bgView];
            [self layoutSubviews];
        }];
    }
}

- (void)hide
{
    if (self.type == GetBackPasswordType_code) {
        [[NSNotificationCenter defaultCenter] removeObserver:self];
        [self removeFromSuperview];
        
    } else {
        [UIView animateWithDuration:0.1 animations:^{
            CGFloat viewX = ([UIApplication sharedApplication].keyWindow.frame.size.width - 335) / 2 + 335;
            self.frame = CGRectMake(viewX, 0, 0, [UIApplication sharedApplication].keyWindow.frame.size.height);
        }];
        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.15 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
            [[NSNotificationCenter defaultCenter] removeObserver:self];
            [self removeFromSuperview];
            
        });
    }
}

#pragma mark -- <add notifications>
-(void)addNotifications
{
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyBoardWillShow:) name:UIKeyboardWillShowNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyBoardWillHide:) name:UIKeyboardWillHideNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(slideCodeSuc:) name:noti_slideCodeSuc object:nil];
}

#pragma mark -- <notifications>
- (void)keyBoardWillShow:(NSNotification *)notification
{
    if (!RXAC) return;
    NSDictionary *userInfo = [notification userInfo];
    NSValue *value = [userInfo objectForKey:UIKeyboardFrameEndUserInfoKey];
    NSNumber *duration = [userInfo objectForKey:UIKeyboardAnimationDurationUserInfoKey];
    
    [UIView animateWithDuration:duration.doubleValue animations:^{
        UIView *window = [UIApplication sharedApplication].keyWindow;
        CGFloat bgH = RXAC ? 258 : 290;
        self.bgView.center = CGPointMake(window.center.x, window.frame.size.height / 2 - bgH / 2 + 40);
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

- (void)slideCodeSuc:(NSNotification *)noti
{
    [RXOSHUD showHUD];
}

#pragma mark -- <setUI>
- (void)setUI
{
    [self addSubview:self.bgView];
    [self.bgView addSubview:self.titleLbl];
    [self.bgView addSubview:self.passwordTF1];
    [self.bgView addSubview:self.passwordTF2];
    [self.bgView addSubview:self.confirmBtn];
    [self.bgView addSubview:self.closeBtn];
    
    [self layoutViews];
}

- (void)layoutViews
{
    UIView *window = [UIApplication sharedApplication].keyWindow;
    
    CGFloat bgW = [RXOSCommonTool getScreenWidth];
    CGFloat bgH = RXAC ? 258 : 290;
    
    _bgView.frame = CGRectMake(0, 0, bgW, bgH);
    _bgView.center = window.center;

    _titleLbl.frame = CGRectMake(0, 21, bgW, 24);
    
    _passwordTF1.frame = CGRectMake(RXAC ? 29 : 25, CGRectGetMaxY(_titleLbl.frame) + 26, bgW - (RXAC ? 58 : 50), RXAC ? 36 : 46);
    
    _passwordTF2.frame = CGRectMake(CGRectGetMinX(_passwordTF1.frame), CGRectGetMaxY(_passwordTF1.frame) + (RXAC ? 14 : 16), CGRectGetWidth(_passwordTF1.frame), CGRectGetHeight(_passwordTF1.frame));

    _confirmBtn.frame = CGRectMake(RXAC ? 29 : 25, CGRectGetHeight(_bgView.frame) - (RXAC ? 27 + 43 : 25 + 48), bgW - (RXAC ? 58 : 50), RXAC ? 43 : 48);

//    if (self.type == GetBackPasswordType_code) {
//        _closeBtn.frame = CGRectMake(bgW - 43, 18, 26, 26);
//    } else {
    _closeBtn.frame = CGRectMake(RXAC ? 24 : 21, 16, 28, 28);
//    }
    
    if (self.type == GetBackPasswordType_code) {
        
    } else {
        _passwordTF1.showPwdBtn.hidden = YES;
        _passwordTF2.showPwdBtn.hidden = YES;
    }
    
    [self layoutSubviews];
}

- (void)setParams:(NSDictionary *)params
{
    _params = params;
    if (self.type == GetBackPasswordType_code) {
        BOOL hasAccountType = NO;
        for (int i = 0; i < params.allKeys.count; i++) {
            if ([params.allKeys[i] isEqualToString:@"account_type"]) {
                hasAccountType = YES;
            }
        }
        
        if (hasAccountType) {
            NSInteger account_type = [params[@"account_type"] integerValue];
            switch (account_type) {
                case 1:
                    self.passwordTF1.placehoder = @"请输入您的手机号或邮箱";
                    self.passwordTF1.tf.keyboardType = UIKeyboardTypeDefault;
                    break;
                case 2:
                    self.passwordTF1.placehoder = @"请输入您的手机号";
                    self.passwordTF1.tf.keyboardType = UIKeyboardTypeNumberPad;
                    break;
                case 3:
                    self.passwordTF1.placehoder = @"请输入您的邮箱";
                    self.passwordTF1.tf.keyboardType = UIKeyboardTypeDefault;
                    break;
                default:
                    self.passwordTF1.placehoder = @"请输入您的手机号";
                    self.passwordTF1.tf.keyboardType = UIKeyboardTypeNumberPad;
                    break;
            }
        }
        self.passwordTF1.placehoder = @"请输入您的邮箱";
        self.passwordTF1.tf.keyboardType = UIKeyboardTypeEmailAddress;
        
        NSString *username = params[@"username"];
        if (username && username.length > 0) {
            self.passwordTF1.tf.text = username;
            self.passwordTF1.placeholderLbl.hidden = YES;
        }
    } else {
//        NSString *password_hint = params[@"password_hint"];
//        if (password_hint && password_hint.length > 0) {
//            self.passwordTF1.placehoder = password_hint;
//        }
    }
}

- (void)setPlaceHolder:(NSString *)placeHolder
{
    self.passwordTF1.placehoder = placeHolder;
}

#pragma mark -- <UITextFieldDelegate>
//- (void)textFieldDidChangeSelection:(UITextField *)textField
//{
//    NSString *str = textField.text;
//    if (str.length > 0) {
//        if (textField == _passwordTF1.tf) {
//            if (str.length > 32) {
//                _passwordTF1.tf.text = [str substringToIndex:32];
////                [RXOSHUD showText:@"密码长度不能超过32位"];
//            }
//            _passwordTF1.placeholderLbl.hidden = YES;
//            _passwordTF1.showPwdBtn.hidden = NO;
//        }
//        if (textField == _passwordTF2.tf) {
//            if (str.length > 32) {
//                _passwordTF2.tf.text = [str substringToIndex:32];
////                [RXOSHUD showText:@"密码长度不能超过32位"];
//            }
//            _passwordTF2.placeholderLbl.hidden = YES;
//            _passwordTF2.showPwdBtn.hidden = NO;
//        }
//    } else {
//        if (textField == _passwordTF1.tf) {
//            _passwordTF1.placeholderLbl.hidden = NO;
//            _passwordTF1.showPwdBtn.hidden = YES;
//        }
//        if (textField == _passwordTF2.tf) {
//            _passwordTF2.placeholderLbl.hidden = NO;
//            _passwordTF2.showPwdBtn.hidden = YES;
//        }
//    }
//
//    if (_passwordTF1.tf.text.length > 0 && _passwordTF2.tf.text.length > 0) {
//        _confirmBtn.userInteractionEnabled = YES;
//        [_confirmBtn setBackgroundColor:[UIColor colorWithHexString:@"20C0B3"]];
//    } else {
//        _confirmBtn.userInteractionEnabled = NO;
//        [_confirmBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
//    }
//}

- (BOOL)textFieldShouldReturn:(UITextField *)textField
{
    [textField endEditing:YES];
    return YES;
}

- (BOOL)textField:(UITextField *)textField shouldChangeCharactersInRange:(NSRange)range replacementString:(NSString *)string
{
    NSString *str = textField.text;
    if (string.length > 0) {
        if (textField == _passwordTF1.tf) {
            if (str.length > 31 && string.length > 0) {
                return NO;
//                _passwordTF1.tf.text = [str substringToIndex:32];
                //                [RXHUD showText:@"密码长度不能超过32位"];
            }
            _passwordTF1.placeholderLbl.hidden = YES;
            
            if (_passwordTF2.tf.text.length > 0) {
                _confirmBtn.userInteractionEnabled = YES;
                [_confirmBtn setBackgroundColor:[UIColor colorWithHexString:@"20C0B3"]];
            } else {
                _confirmBtn.userInteractionEnabled = NO;
                [_confirmBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
            }
        }
        if (textField == _passwordTF2.tf) {
            if (str.length > 31 && string.length > 0) {
                return NO;
//                _passwordTF2.tf.text = [str substringToIndex:32];
                //                [RXHUD showText:@"密码长度不能超过32位"];
            }
            _passwordTF2.placeholderLbl.hidden = YES;
            
            if (_passwordTF1.tf.text.length > 0) {
                _confirmBtn.userInteractionEnabled = YES;
                [_confirmBtn setBackgroundColor:[UIColor colorWithHexString:@"20C0B3"]];
            } else {
                _confirmBtn.userInteractionEnabled = NO;
                [_confirmBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
            }
        }
    } else {
        if (str.length == 1) {
            
            _confirmBtn.userInteractionEnabled = NO;
            [_confirmBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
            
            if (textField == _passwordTF1.tf) {
                _passwordTF1.placeholderLbl.hidden = NO;
            }
            if (textField == _passwordTF2.tf) {
                _passwordTF2.placeholderLbl.hidden = NO;
            }
        }
    }
    
    if (string.length > 0) {
//        textField.text = [NSString stringWithFormat:@"%@%@", textField.text, string];
    } else {
        if (textField.text.length > 1) {
            [self changeText:textField];
            return NO;
        }
    }
    
    return YES;
}

- (void)changeText:(UITextField *)textField
{
    textField.text = [textField.text substringToIndex:textField.text.length - 1];
}

#pragma mark -- <actions>
- (void)confimBtnAction
{
    [self endEditing:YES];
    
    if (_passwordTF1.tf.text.length <= 0) {
        NSString *titleStr = @"";
        if (self.type == GetBackPasswordType_code) {
            titleStr = @"手机号不能为空";
        } else {
            titleStr = @"密码不能为空";
        }
        [RXOSHUD showErrorText:titleStr];
        return;
    } else if (_passwordTF2.tf.text.length <= 0) {
        NSString *titleStr = @"";
        if (self.type == GetBackPasswordType_code) {
            titleStr = @"验证码不能为空";
        } else {
            titleStr = @"密码不能为空";
        }
        [RXOSHUD showErrorText:titleStr];
        return;
    }
    
    if (self.type == GetBackPasswordType_code) {
        CaptchaType captchaType = CaptchaType_phone;
        if ([RXOSCommonTool validateEmail:self.passwordTF1.tf.text]) {
            captchaType = CaptchaType_email;
        }
        
        [[RXApiService sharedSDK] verifyCaptchaCodeWithType:captchaType target:self.passwordTF1.tf.text purpose:@"resetpwd" captcha_code:self.passwordTF2.tf.text complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
            if (!error) {
                RXOSGetBackPasswordView *getBackPasswordView = [[RXOSGetBackPasswordView alloc] initWithType:GetBackPasswordType_default phone:self.passwordTF1.tf.text code:self.passwordTF2.tf.text];
                getBackPasswordView.complete = self.complete;
                getBackPasswordView.doneBlock = self.doneBlock;
                
                NSString *placeHolder = self.params[@"password_hint"];
                if (placeHolder && placeHolder.length > 0) {
                    getBackPasswordView.placeHolder = placeHolder;
                }
                getBackPasswordView.requestBlock = self.requestBlock;
                __weak __typeof__(self) weakSelf = self;
                getBackPasswordView.doneBlock = ^(NSString * _Nonnull username) {
                    [self hide];
                };
                
            } else {
                NSString *msg = error.responesObject[@"msg"];
                if ([error.responesObject[@"code"] integerValue] == 1120) {
                    msg = @"网络请求失败，请重试或检查网络设置";
                }
                [RXOSHUD showErrorText:msg];
            }
        }];
    } else {
        
        NSString *msg = @"密码输入6-32位，包含数字+字母+特殊符号";
        // 是否开启简单密码
        RXPasswordStrength passwordType = [RXOSUserUtility sharedManager].passwordType;
        if (passwordType == Default || passwordType == Average) {
            msg = @"密码输入6-32位，包含数字+字母+特殊符号";
        } else if (passwordType == Custom) {
            msg = @"密码正则验证错误";
        }
        
        if (![self.passwordTF1.tf.text isEqual:self.passwordTF2.tf.text]){
            [RXOSHUD showErrorText:@"两次密码输入不一致，请重新输入"];
            return;
        }
        if (![RXOSCommonTool checkPasswordWithPwd:self.passwordTF1.tf.text]) {
            [RXOSHUD showErrorText:msg];
            return;
        }
        
        NSMutableDictionary *dict = [NSMutableDictionary dictionary];
        [dict setValue:self.phoneStr forKey:@"username"];
        [dict setValue:self.passwordTF1.tf.text forKey:@"password"];
        [dict setValue:self.codeStr forKey:@"captcha_code"];
        
        NSDictionary *requestParams = @{@"username" : self.phoneStr,
                                        @"password" : self.passwordTF1.tf.text,
                                        @"captcha_code" : self.codeStr
        };
        if (self.requestBlock) {
            requestParams = self.requestBlock(requestParams);
            BOOL needBreak = [requestParams[@"needBreak"] boolValue];
            
            if (needBreak) {
                return;
            } else {
                [[RXApiService sharedSDK] resetPasswordWithUsername:self.phoneStr password:self.passwordTF1.tf.text captchaCode:self.codeStr migrate_args:nil complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                    if (error) {
                        if ([error.responesObject[@"code"] integerValue] == RXLoginError_passwordRuleFail) {
                            [RXOSHUD showErrorText:@"密码输入6-32位，包含数字+字母+特殊符号"];
                        } else {
                            [RXOSHUD showErrorText:error.responesObject[@"msg"]];
                        }
                        if (self.complete) {
                            self.complete(nil, error);
                        }
                    } else {
//                        [SVProgressHUD showSuccessWithStatus:@"修改成功"];
                        [[NSNotificationCenter defaultCenter] postNotificationName:RXUINoti_changePwd object:nil userInfo:@{@"username" : self.phoneStr}];
                        RXOSCommonView *successV = [[RXOSCommonView alloc] initWithDesStr:@"密码重置成功" title:@"重置密码" image:@"rx_common_success" complete:^{
//                            if (self.doneBlock) {
//                                self.doneBlock(self.phoneStr);
//                            }
//                            [[NSNotificationCenter defaultCenter] postNotificationName:@"test" object:nil userInfo:@{@"username" : self.phoneStr}];
                            if (self.complete) {
                                self.complete(response, nil);
                            }
                            
                            for (UIView *subView in [UIApplication sharedApplication].keyWindow.subviews) {
                                if ([subView isKindOfClass:[RXOSGetBackPasswordView class]]) {
                                    RXOSGetBackPasswordView *getBackPasswordView = (RXOSGetBackPasswordView *)subView;
                                    [getBackPasswordView hide];
                                }
                            }
                        }];
                        [RXOSCommonTool saveAccountWithUsername:self.phoneStr password:self.passwordTF1.tf.text];
                        self.type = GetBackPasswordType_default;
                        [self hide];
//                        if (self.doneBlock) {
//                            self.doneBlock();
//                        }
//                        if (self.complete) {
//                            self.complete(response, nil);
//                        }
                    }
                }];
                return;
            }
        }
        
        [[RXApiService sharedSDK] resetPasswordWithUsername:self.phoneStr password:self.passwordTF1.tf.text captchaCode:self.codeStr migrate_args:nil complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
            if (error) {
                if ([error.responesObject[@"code"] integerValue] == RXLoginError_passwordRuleFail) {
                    [RXOSHUD showErrorText:@"密码输入6-32位，包含数字+字母+特殊符号"];
                } else {
                    [RXOSHUD showErrorText:error.responesObject[@"msg"]];
                }
                if (self.complete) {
                    self.complete(nil, error);
                }
            } else {
//                [SVProgressHUD showSuccessWithStatus:@"修改成功"];
                [[NSNotificationCenter defaultCenter] postNotificationName:RXUINoti_changePwd object:nil userInfo:@{@"username" : self.phoneStr}];
                RXOSCommonView *successV = [[RXOSCommonView alloc] initWithDesStr:@"密码重置成功" title:@"重置密码" image:@"rx_common_success" complete:^{
                    if (self.doneBlock) {
                        self.doneBlock(self.phoneStr);
                    }
                    if (self.complete) {
                        self.complete(response, nil);
                    }
                }];
                
                [RXOSCommonTool saveAccountWithUsername:self.phoneStr password:self.passwordTF1.tf.text];
                self.type = GetBackPasswordType_default;
                [self hide];
//                if (self.doneBlock) {
//                    self.doneBlock();
//                }
//                if (self.complete) {
//                    self.complete(response, nil);
//                }
            }
        }];
    }
}

- (void)codeAction
{
    [self endEditing:YES];
    if(self.passwordTF1.tf.text == nil || [self.passwordTF1.tf.text isEqualToString:@""]){
        [RXOSHUD showErrorText:@"请输入您的手机号"];
        return;
    }
    
    if (self.type == GetBackPasswordType_code) {
        NSInteger account_type = [self.params[@"account_type"] integerValue];
        switch (account_type) {
            case 1:
                self.passwordTF1.placehoder = @"请输入您的手机号或邮箱";
                break;
            case 2:
                self.passwordTF1.placehoder = @"请输入您的手机号";
                break;
            case 3:
                self.passwordTF1.placehoder = @"请输入您的邮箱";
                break;
            default:
                self.passwordTF1.placehoder = @"请输入您的手机号";
                break;
        }
//        if (account_type == 0 || account_type == 1) {
//            if (![RXOSCommonTool validateMobile:self.passwordTF1.tf.text]) {
//                [RXOSHUD showErrorText:@"手机号格式错误，请重新输入"];
//                return;
//            }
//        }
    }
    
//    if (![RXOSCommonTool hasNetwork]) {
//        [SVProgressHUD showInfoWithStatus:@"网络请求失败，请重试或检查网络设置"];
//        return;
//    }
    

    
    CaptchaType captchaType = CaptchaType_phone;
    if ([RXOSCommonTool validateEmail:self.passwordTF1.tf.text]) {
        captchaType = CaptchaType_email;
    }
    
    [[RXApiService sharedSDK] getCaptchaCodeWithType:captchaType target:self.passwordTF1.tf.text purpose:@"resetpwd" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
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
            
            self.codeTFR = self.passwordTF2.tf.frame;
            self.codeLblR = self.passwordTF2.codeLbl.frame;
            self.codePlaceR = self.passwordTF2.placeholderLbl.frame;
            
            self.passwordTF2.codeLbl.enabled = NO;
            self.timeCount = 60;
            NSString *text = [NSString stringWithFormat:@"%@(%ld)", [RXLocation osLaunguage:@"重新获取"], (long)self.timeCount];
            NSDictionary *attribtDic = @{NSUnderlineStyleAttributeName : [NSNumber numberWithInteger:NSUnderlineStyleSingle], NSUnderlineColorAttributeName : [UIColor clearColor]};

            NSMutableAttributedString *attribtStr = [[NSMutableAttributedString alloc] initWithString:text attributes:attribtDic];
            [attribtStr addAttribute:NSForegroundColorAttributeName value:[UIColor colorWithHexString:@"#AFAFAF"] range:NSMakeRange(0, text.length)];
            self.passwordTF2.codeLbl.attributedText = attribtStr;
            
            CGFloat codeW = [text widthForFont:self.passwordTF2.codeLbl.font] + 6;
            
            if ([RXOSCommonTool isRTL]) {
                self.passwordTF2.codeLbl.frame = CGRectMake(0, 0, codeW, RXAC ? 36 : 46);
                self.passwordTF2.tf.frame = CGRectMake(codeW, CGRectGetMinY(self.passwordTF2.tf.frame), CGRectGetWidth(self.passwordTF2.frame) - codeW, CGRectGetHeight(self.passwordTF2.tf.frame));
//                self.codeTF.placeholderLbl.frame = CGRectMake(0, 0, CGRectGetWidth(self.codeTF.tf.frame) - (RXAC ? 13 : 13), CGRectGetHeight(self.codeTF.tf.frame));
            } else {
//                codeW = [text widthForFont:self.codeTF.codeLbl.font] + 20;
                self.passwordTF2.codeLbl.frame = CGRectMake(CGRectGetWidth(self.passwordTF2.frame) - codeW, 0, codeW, RXAC ? 36 : 46);
                self.passwordTF2.tf.frame = CGRectMake(CGRectGetMinX(self.passwordTF2.tf.frame), CGRectGetMinY(self.passwordTF2.tf.frame), CGRectGetWidth(self.passwordTF2.tf.frame) - codeW, CGRectGetHeight(self.passwordTF2.tf.frame));
                
                NSLog(@"");
            }
            
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
        self.passwordTF2.codeLbl.attributedText = attribtStr;
        self.passwordTF2.codeLbl.textColor = [UIColor colorWithHexString:@"#74D2CB"];
        
        self.passwordTF2.tf.frame = self.codeTFR;
        self.passwordTF2.codeLbl.frame = self.codeLblR;
        self.passwordTF2.placeholderLbl.frame = self.codePlaceR;
        
        self.passwordTF2.codeLbl.enabled = YES;
        [time invalidate];
        return;
    }
    
    NSString *text = [NSString stringWithFormat:@"%@(%ld)", [RXLocation osLaunguage:@"重新获取"], (long)self.timeCount];
    NSDictionary *attribtDic = @{NSUnderlineStyleAttributeName : [NSNumber numberWithInteger:NSUnderlineStyleSingle], NSUnderlineColorAttributeName : [UIColor clearColor]};

    NSMutableAttributedString *attribtStr = [[NSMutableAttributedString alloc] initWithString:text attributes:attribtDic];
    [attribtStr addAttribute:NSForegroundColorAttributeName value:[UIColor colorWithHexString:@"#AFAFAF"] range:NSMakeRange(0, text.length)];
    self.passwordTF2.codeLbl.attributedText = attribtStr;
//    self.passwordTF2.codeLbl.textColor = [UIColor colorWithHexString:@"#74D2CB"];
}

- (void)closeBtnAction
{
    if (self.complete) {
        RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
        
        NSString *errorMsg = [RXErrorTool getRXErrorMsg:RXLimitError_closeView];
        err.responesObject = @{@"msg" : errorMsg,
                               @"code" : @(RXLimitError_closeView)
        };
        self.complete(nil, err);
    }
    [self hide];
}

- (void)tapAction:(UITapGestureRecognizer *)tap
{
    [self endEditing:YES];
}

#pragma mark -- <lazy>
- (UIView *)bgView
{
    if (!_bgView) {
        _bgView = [[UIView alloc] init];
        _bgView.backgroundColor = [UIColor whiteColor];
//        _bgView.backgroundColor = [UIColor redColor];
        _bgView.layer.cornerRadius = 5;
    }
    return _bgView;
}

- (UILabel *)titleLbl
{
    if (!_titleLbl) {
        _titleLbl = [[UILabel alloc] init];
        _titleLbl.text = @"重置密码";
        if (self.type == GetBackPasswordType_code) {
            _titleLbl.text = @"忘记密码";
        }
        _titleLbl.textColor = [UIColor blackColor];
        _titleLbl.font = [UIFont systemFontOfSize:21 weight:UIFontWeightMedium];
        _titleLbl.textAlignment = NSTextAlignmentCenter;
    }
    return _titleLbl;
}

- (RXOSTextField *)passwordTF1
{
    if (!_passwordTF1) {
        NSString *placeStr = @"";
        UIKeyboardType keyboardType = UIKeyboardTypeDefault;
        TFType tfType = TFType_clear;
        if (self.type == GetBackPasswordType_code) {
            placeStr = @"请输入您的邮箱账号";
            keyboardType = UIKeyboardTypeNumbersAndPunctuation;
        } else {
            tfType = TFType_pwdNormal;
            // 是否开启简单密码
            RXPasswordStrength passwordType = [RXOSUserUtility sharedManager].passwordType;
            if (passwordType == Default || passwordType == Average) {
                placeStr = @"请输入6-32位密码";
            } else if (passwordType == Custom) {
                placeStr = @"请输入密码";
            }
        }
        
        _passwordTF1 = [[RXOSTextField alloc] initWithPlaceholder:placeStr type:tfType keyboardType:keyboardType];
//        if (self.type == GetBackPasswordType_default) {
//            _passwordTF1.tf.secureTextEntry = YES;
//        }
        _passwordTF1.tf.delegate = self;
    }
    return _passwordTF1;
}

- (RXOSTextField *)passwordTF2
{
    if (!_passwordTF2) {
        NSString *placeStr = @"";
        UIKeyboardType keyboardType = UIKeyboardTypeDefault;
        TFType tfType = TFType_code;
        if (self.type == GetBackPasswordType_code) {
            placeStr = @"请输入邮箱验证码";
            keyboardType = UIKeyboardTypeNumberPad;
        } else {
            placeStr = @"请再次输入密码";
            tfType = TFType_pwdNormal;
        }
        
        _passwordTF2 = [[RXOSTextField alloc] initWithPlaceholder:placeStr type:tfType keyboardType:keyboardType];
//        if (self.type == GetBackPasswordType_default) {
//            _passwordTF2.tf.secureTextEntry = YES;
//        }
        _passwordTF2.tf.delegate = self;
        if (self.type == GetBackPasswordType_code) {
            __weak __typeof__(self) weakSelf = self;
            _passwordTF2.clearBlock = ^{
                [weakSelf codeAction];
            };
        }
    }
    return _passwordTF2;
}

- (UIButton *)confirmBtn
{
    if (!_confirmBtn) {
        NSString *titleStr = @"";
        if (self.type == GetBackPasswordType_code) {
            titleStr = @"下一步";
        } else {
            titleStr = @"确认";
        }
        
        _confirmBtn = [UIButton buttonWithType:UIButtonTypeCustom];
//        [_confirmBtn setBackgroundColor:[UIColor colorWithHexString:@"20C0B3"]];
        [_confirmBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
        [_confirmBtn setTitle:[RXLocation osLaunguage:titleStr] forState:UIControlStateNormal];
        [_confirmBtn setTitleColor:[UIColor colorWithHexString:@"F2FFFB"] forState:UIControlStateNormal];
        _confirmBtn.titleLabel.font = [UIFont systemFontOfSize:18 weight:UIFontWeightRegular];
        _confirmBtn.layer.cornerRadius = 5;
        _confirmBtn.userInteractionEnabled = NO;
        [_confirmBtn addTarget:self action:@selector(confimBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _confirmBtn;
}

- (RXOSCloseBtn *)closeBtn
{
    if (!_closeBtn) {
        _closeBtn = [RXOSCloseBtn buttonWithType:UIButtonTypeCustom];
        NSString *imageStr = @"";
//        if (self.type == GetBackPasswordType_code) {
//            imageStr = @"rx_close";
//        } else {
            imageStr = @"rx_back";
//        }
        [_closeBtn setImage:[UIImage rxOSBundleImageNamed:imageStr] forState:UIControlStateNormal];
        [_closeBtn addTarget:self action:@selector(closeBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _closeBtn;
}

@end
