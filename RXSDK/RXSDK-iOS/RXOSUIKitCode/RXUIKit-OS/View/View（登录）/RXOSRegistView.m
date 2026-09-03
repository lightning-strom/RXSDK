//
//  RXOSRegistView.m
//  RXSDK
//
//  Created by 陈汉 on 2021/9/30.
//

#import "RXOSRegistView.h"
#import "RXOSCommonTool.h"
#import <RXSDK_Pure/RXErrorTool.h>
#import "RXOSCloseBtn.h"
#import "RXOSCommonView.h"

@interface RXOSRegistView () <UITextFieldDelegate, UITextViewDelegate>

@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) UILabel *titleLbl;
@property (nonatomic, strong) RXOSTextField *accountTF;
@property (nonatomic, strong) RXOSTextField *codeTF;
@property (nonatomic, strong) RXOSTextField *passwordTF;
@property (nonatomic, strong) RXOSTextField *passwordTF1;
@property (nonatomic, strong) UIButton *registBtn;
@property (nonatomic, strong) RXOSCloseBtn *closeBtn;
@property (nonatomic, strong) RXOSCloseBtn *backBtn;
@property (nonatomic, assign) NSInteger orientation;  // 屏幕方向 1竖屏 2横屏
@property (nonatomic, assign) NSInteger timeCount;
@property (nonatomic, copy) RegistCallBack block;
@property (nonatomic, assign) RegistViewType type;
@property (nonatomic, strong) NSMutableDictionary *extDic;
@property (nonatomic, assign) CGRect lineX;
@property (nonatomic, assign) CGRect codeX;

@end

@implementation RXOSRegistView

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (instancetype)initWithType:(RegistViewType)type
                      extDic:(NSMutableDictionary * __nullable)extDic
                    complete:(void(^)(BOOL success, NSString *username, NSString *password))complete
{
    
    self = [super initWithFrame:CGRectMake(0, 0, [UIApplication sharedApplication].keyWindow.frame.size.width, [UIApplication sharedApplication].keyWindow.frame.size.height)];
    if (self) {
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
//        self.backgroundColor = [UIColor clearColor];
        [[UIApplication sharedApplication].keyWindow addSubview:self];
        
        self.orientation = [RXOSCommonTool getInterfaceOrientation];
        self.block = complete;
        self.type = type;
        self.extDic = extDic;
        
        [self setUI];
        [self addNotifications];
        [self show];
        
        // 监听屏幕旋转（横竖屏）
//        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onDeviceOrientationDidChange)
//                             name:UIDeviceOrientationDidChangeNotification
//                                                       object:nil];
        
        UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tapAction:)];
        [self addGestureRecognizer:tap];
    }
    return self;
}

- (BOOL)onDeviceOrientationDidChange{
    //获取当前设备Device
    UIDevice *device = [UIDevice currentDevice];
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
        if (self.type == RegistViewType_password) {
            self.backgroundColor = [UIColor clearColor];
        } else {
            self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.5];
        }
        
        [RXOSCommonTool showWithAnimate:self.bgView];
        
        [self layoutSubviews];
    }];
}

- (void)hide
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    [self removeFromSuperview];
}

#pragma mark -- <add notifications>
-(void)addNotifications
{
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyBoardWillShow:) name:UIKeyboardWillShowNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyBoardWillHide:) name:UIKeyboardWillHideNotification object:nil];
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
        CGFloat bgH = RXAC ? 250 : 285;
        self.bgView.center = CGPointMake(window.center.x, window.frame.size.height / 2 - bgH / 2 + 40);
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
        self.bgView.center = window.center;
        [self layoutSubviews];
    }];
}

#pragma mark -- <setUI>
- (void)setUI
{   
    [self addSubview:self.bgView];
    [self.bgView addSubview:self.titleLbl];
    [self.bgView addSubview:self.registBtn];
    [self.bgView addSubview:self.closeBtn];
    [self.bgView addSubview:self.backBtn];
    
    if (self.type == RegistViewType_password) {
        self.backBtn.hidden = NO;
        self.closeBtn.hidden = NO;
        [self.bgView addSubview:self.passwordTF];
        [self.bgView addSubview:self.passwordTF1];
    } else {
        self.backBtn.hidden = NO;
        self.closeBtn.hidden = YES;
        [self.bgView addSubview:self.accountTF];
        [self.bgView addSubview:self.codeTF];
    }
    
    [self layoutViews];
}

- (void)layoutViews
{
    UIView *window = [UIApplication sharedApplication].keyWindow;
    
    CGFloat bgH = RXAC ? 250 : 285;

    _bgView.frame = CGRectMake(0, CGRectGetHeight(window.frame), [RXOSCommonTool getScreenWidth], bgH);
    _bgView.center = window.center;
    
    _titleLbl.frame = CGRectMake(0, 21, CGRectGetWidth(_bgView.frame), 24);

    _accountTF.frame = CGRectMake(RXAC ? 29 : 25, 73, CGRectGetWidth(_bgView.frame) - (RXAC ? 58 : 50), RXAC ? 36 : 46);
    
    _codeTF.frame = CGRectMake(CGRectGetMinX(_accountTF.frame), CGRectGetMaxY(_accountTF.frame) + 14, CGRectGetWidth(_accountTF.frame), RXAC ? 36 : 46);
    
    _passwordTF.frame = CGRectMake(RXAC ? 29 : 25, 73, CGRectGetWidth(_bgView.frame) - (RXAC ? 58 : 50), RXAC ? 36 : 46);
    
    _passwordTF1.frame = CGRectMake(CGRectGetMinX(_passwordTF.frame), CGRectGetMaxY(_passwordTF.frame) + 14, CGRectGetWidth(_passwordTF.frame), RXAC ? 36 : 46);
    
    _registBtn.frame = CGRectMake(RXAC ? 29 : 25, CGRectGetHeight(_bgView.frame) - (RXAC ? 27 + 43 : 25 + 48), CGRectGetWidth(_bgView.frame) - (RXAC ? 58 : 50), RXAC ? 43 : 48);
    
    _closeBtn.frame = CGRectMake(CGRectGetWidth(_bgView.frame) - (RXAC ? 24 + 18 : 21 + 28), RXAC ? 12 : 16, 28, 28);
    
    _backBtn.frame = CGRectMake(RXAC ? 24 : 21, CGRectGetMinY(_closeBtn.frame), 28, 28);
    
    [_codeTF changeType:TFType_loginCode];
    
    [self layoutSubviews];
}

#pragma mark -- <UITextFieldDelegate>
//- (void)textFieldDidChangeSelection:(UITextField *)textField
//{
//    NSString *str = textField.text;
//    if (str.length > 0) {
//        if (textField == _passwordTF.tf) {
//            _passwordTF.placeholderLbl.hidden = YES;
//            _passwordTF.showPwdBtn.hidden = NO;
//        }
//        if (textField == _passwordTF1.tf) {
//            _passwordTF1.placeholderLbl.hidden = YES;
//            _passwordTF1.showPwdBtn.hidden = NO;
//        }
//        if (textField == _accountTF.tf) {
//            _accountTF.placeholderLbl.hidden = YES;
//        }
//        if (textField == _codeTF.tf) {
//            _codeTF.placeholderLbl.hidden = YES;
//        }
//    } else {
//        if (textField == _passwordTF.tf) {
//            _passwordTF.placeholderLbl.hidden = NO;
//            _passwordTF.showPwdBtn.hidden = YES;
//        }
//        if (textField == _passwordTF1.tf) {
//            _passwordTF1.placeholderLbl.hidden = NO;
//            _passwordTF1.showPwdBtn.hidden = YES;
//        }
//        if (textField == _accountTF.tf) {
//            _accountTF.placeholderLbl.hidden = NO;
//        }
//        if (textField == _codeTF.tf) {
//            _codeTF.placeholderLbl.hidden = NO;
//        }
//    }
//
//    if (self.type == RegistViewType_password) {
//        if (_passwordTF.tf.text.length > 0 && _passwordTF1.tf.text.length > 0) {
//            _registBtn.userInteractionEnabled = YES;
//            [_registBtn setBackgroundColor:[UIColor colorWithHexString:@"20C0B3"]];
//        } else {
//            _registBtn.userInteractionEnabled = NO;
//            [_registBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
//        }
//    } else {
//        if (_accountTF.tf.text.length > 0 && _codeTF.tf.text.length > 0) {
//            _registBtn.userInteractionEnabled = YES;
//            [_registBtn setBackgroundColor:[UIColor colorWithHexString:@"20C0B3"]];
//        } else {
//            _registBtn.userInteractionEnabled = NO;
//            [_registBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
//        }
//    }
//}

- (BOOL)textField:(UITextField *)textField shouldChangeCharactersInRange:(NSRange)range replacementString:(NSString *)string
{
    NSString *str = textField.text;
    if (string.length > 0) {
        if (textField == _passwordTF.tf) {
            _passwordTF.placeholderLbl.hidden = YES;
            _passwordTF.showPwdBtn.hidden = NO;
        }
        if (textField == _passwordTF1.tf) {
            _passwordTF1.placeholderLbl.hidden = YES;
            _passwordTF1.showPwdBtn.hidden = NO;
        }
        if (textField == _accountTF.tf) {
            _accountTF.placeholderLbl.hidden = YES;
        }
        if (textField == _codeTF.tf) {
            _codeTF.placeholderLbl.hidden = YES;
        }
    } else {
        if (str.length == 1) {
            if (textField == _passwordTF.tf) {
                _passwordTF.placeholderLbl.hidden = NO;
                _passwordTF.showPwdBtn.hidden = YES;
            }
            if (textField == _passwordTF1.tf) {
                _passwordTF1.placeholderLbl.hidden = NO;
                _passwordTF1.showPwdBtn.hidden = YES;
            }
            if (textField == _accountTF.tf) {
                _accountTF.placeholderLbl.hidden = NO;
            }
            if (textField == _codeTF.tf) {
                _codeTF.placeholderLbl.hidden = NO;
            }
        }
    }
    
    if (self.type == RegistViewType_password) {
        if (string.length > 0) {
            if (textField == _passwordTF.tf) {
                if (_passwordTF1.tf.text.length > 0) {
                    _registBtn.userInteractionEnabled = YES;
                    [_registBtn setBackgroundColor:[UIColor colorWithHexString:@"20C0B3"]];
                } else {
                    _registBtn.userInteractionEnabled = NO;
                    [_registBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
                }
            }
            if (textField == _passwordTF1.tf) {
                if (_passwordTF.tf.text.length > 0) {
                    _registBtn.userInteractionEnabled = YES;
                    [_registBtn setBackgroundColor:[UIColor colorWithHexString:@"20C0B3"]];
                } else {
                    _registBtn.userInteractionEnabled = NO;
                    [_registBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
                }
            }
        } else {
            if (textField.text.length == 1) {
                _registBtn.userInteractionEnabled = NO;
                [_registBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
            }
        }
    } else {
        if (string.length > 0) {
            if (textField == _accountTF.tf) {
                if (_codeTF.tf.text.length > 0) {
                    _registBtn.userInteractionEnabled = YES;
                    [_registBtn setBackgroundColor:[UIColor colorWithHexString:@"20C0B3"]];
                } else {
                    _registBtn.userInteractionEnabled = NO;
                    [_registBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
                }
            }
            if (textField == _codeTF.tf) {
                if (_accountTF.tf.text.length > 0) {
                    _registBtn.userInteractionEnabled = YES;
                    [_registBtn setBackgroundColor:[UIColor colorWithHexString:@"20C0B3"]];
                } else {
                    _registBtn.userInteractionEnabled = NO;
                    [_registBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
                }
            }
        } else {
            if (textField.text.length == 1) {
                _registBtn.userInteractionEnabled = NO;
                [_registBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
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

- (void)textFieldDidEndEditing:(UITextField *)textField {
    _accountTF.clearBtn.hidden = YES;
    _passwordTF.clearBtn.hidden = YES;
    _passwordTF1.clearBtn.hidden = YES;
}

- (BOOL)textFieldShouldReturn:(UITextField *)textField
{
    [textField endEditing:YES];
    return YES;
}

#pragma mark -- <actions>
- (void)codeAction
{
    if(self.accountTF.tf.text == nil || [self.accountTF.tf.text isEqualToString:@""]){
        [RXOSHUD showErrorText:@"请输入您的邮箱"];
        return;
    }
    
    if (![RXOSCommonTool validateEmail:self.accountTF.tf.text]) {
        [RXOSHUD showErrorText:@"邮箱格式错误，请重新输入"];
        return;
    }
    [RXOSHUD showHUD];
    [[RXApiService sharedSDK] getCaptchaCodeWithType:CaptchaType_email target:self.accountTF.tf.text purpose:@"register" complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if(error){
                NSString *msg = error.responesObject[@"msg"];
                NSInteger errorCode = [error.responesObject[@"code"] integerValue];
                if (errorCode >= 1000 && errorCode < 2000) {
                    msg = [NSString stringWithFormat:@"网络请求失败，请重试或检查网络设置  （code = %ld）", errorCode];
                }

                [RXOSHUD showErrorText:msg];
                return;
            } else {
                [RXOSHUD showSuccessText:@"已发送验证码"];
                
                self.codeTF.codeLbl.enabled = NO;
                self.timeCount = 60;
                
                NSString *text = [NSString stringWithFormat:@"%@(%ld)", [RXLocation osLaunguage:@"重新获取"], (long)self.timeCount];
                NSDictionary *attribtDic = @{NSUnderlineStyleAttributeName : [NSNumber numberWithInteger:NSUnderlineStyleSingle], NSUnderlineColorAttributeName : [UIColor clearColor]};

                NSMutableAttributedString *attribtStr = [[NSMutableAttributedString alloc] initWithString:text attributes:attribtDic];
                [attribtStr addAttribute:NSForegroundColorAttributeName value:[UIColor colorWithHexString:@"#AFAFAF"] range:NSMakeRange(0, text.length)];
                self.codeTF.codeLbl.attributedText = attribtStr;
                
                CGFloat codeW = [text widthForFont:self.codeTF.codeLbl.font] + 1;
                
                self.lineX = self.codeTF.line.frame;
                self.codeX = self.codeTF.codeLbl.frame;
                
                self.codeTF.codeLbl.frame = CGRectMake(CGRectGetWidth(self.codeTF.frame) - codeW - 10, 0, codeW, RXAC ? 36 : 46);
                self.codeTF.line.frame = CGRectMake(CGRectGetWidth(self.codeTF.frame) - codeW - 15, CGRectGetMinY(self.codeTF.line.frame), CGRectGetWidth(self.codeTF.line.frame), CGRectGetHeight(self.codeTF.line.frame));
                
                NSTimer *timer  =  [NSTimer timerWithTimeInterval:1.0 target:self selector:@selector(timered:) userInfo:nil repeats:YES];
                [[NSRunLoop mainRunLoop] addTimer:timer forMode:NSDefaultRunLoopMode];
            }
        });
    }];
}

- (void)timered:(NSTimer*)time
{
    self.timeCount--;
    if(self.timeCount < 1){
        
        NSString *text = @"获取验证码";
        NSDictionary *attribtDic = @{NSUnderlineStyleAttributeName: [NSNumber numberWithInteger:NSUnderlineStyleSingle],NSUnderlineColorAttributeName:[UIColor whiteColor]};

        NSMutableAttributedString *attribtStr = [[NSMutableAttributedString alloc]initWithString:text attributes:attribtDic];
        self.codeTF.codeLbl.attributedText = attribtStr;
        self.codeTF.codeLbl.textColor = [UIColor colorWithHexString:@"74D2CB"];
        
        self.codeTF.codeLbl.frame = self.codeX;
        self.codeTF.line.frame = self.lineX;
        self.codeTF.codeLbl.enabled = YES;
        [time invalidate];
        return;
    }
    
    NSString *text = [NSString stringWithFormat:@"%@(%ld)", [RXLocation osLaunguage:@"重新获取"], (long)self.timeCount];
    NSDictionary *attribtDic = @{NSUnderlineStyleAttributeName : [NSNumber numberWithInteger:NSUnderlineStyleSingle], NSUnderlineColorAttributeName : [UIColor clearColor]};

    NSMutableAttributedString *attribtStr = [[NSMutableAttributedString alloc] initWithString:text attributes:attribtDic];
    [attribtStr addAttribute:NSForegroundColorAttributeName value:[UIColor colorWithHexString:@"#AFAFAF"] range:NSMakeRange(0, text.length)];
    self.codeTF.codeLbl.attributedText = attribtStr;
}

- (void)registAction
{
    [self endEditing:YES];
    
//    RXOSRegistView *registView = [[RXOSRegistView alloc] initWithType:RegistViewType_password extDic:self.extDic complete:self.block];
//    registView.username = self.accountTF.tf.text;
//    registView.captchaCode = self.codeTF.tf.text;
//    
//    return;
    if (self.type == RegistViewType_regist) {
        [RXOSHUD showHUD];
        [[RXApiService sharedSDK] verifyCaptchaCodeWithType:CaptchaType_email target:self.accountTF.tf.text purpose:@"register" captcha_code:self.codeTF.tf.text complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
            [RXOSHUD hideHUD];
            if (!error) {
                RXOSRegistView *registView = [[RXOSRegistView alloc] initWithType:RegistViewType_password extDic:self.extDic complete:self.block];
                registView.username = self.accountTF.tf.text;
                registView.captchaCode = self.codeTF.tf.text;
            } else {
                NSString *msg = error.responesObject[@"msg"];
                if ([error.responesObject[@"code"] integerValue] == 1120) {
                    msg = @"网络请求失败，请重试或检查网络设置";
                }
                [RXOSHUD showErrorText:msg];
            }
        }];
            
    } else if (self.type == RegistViewType_binding) {
        NSMutableDictionary *dict = [NSMutableDictionary dictionary];
        [dict setValue:self.accountTF.tf.text forKey:@"phone"];
        [dict setValue:self.passwordTF.tf.text forKey:@"password"];
        [dict setValue:self.codeTF.tf.text forKey:@"captcha_code"];
        
        [[RXApiService sharedSDK] bindingPhoneWithCaptchaCode:self.codeTF.tf.text password:self.passwordTF.tf.text phone:self.accountTF.tf.text migrate_args:nil complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
            
            if (error) {
//                [SVProgressHUD showErrorWithStatus:error.responesObject[@"msg"]];
                if (self.bindingBlock) {
                    self.bindingBlock(nil, error);
                }
                
            } else {
//                [RXOSUserUtility sharedManager].phone = self.accountTF.tf.text;
//                [RXOSUserUtility sharedManager].password = self.passwordTF.tf.text;
//                [SVProgressHUD showSuccessWithStatus:@"绑定成功"];
                if (self.bindingBlock) {
                    self.bindingBlock(response, nil);
                }
            }
        }];
    } else if (self.type == RegistViewType_password) {
        
        if (![RXOSCommonTool checkPasswordWithPwd:self.passwordTF.tf.text]) {
            [RXOSHUD showErrorText:@"6-32位，数字+字母+特殊字符"];
            
            // 事件上报
            NSMutableDictionary *trackDic = [NSMutableDictionary dictionary];
            [trackDic setValue:@"1" forKey:@"login_type"];
            [trackDic setValue:@"1-1" forKey:@"login_category"];
            [trackDic setValue:@"1-7" forKey:@"login_action"];
            [trackDic setValue:@"6-32位，数字+字母+特殊字符" forKey:@"msg"];
            
            [[RXLogService sharedSDK] addLogSingleFirstLoginWithEvent:rxlog_agreement_process distinctId:@"" properties:trackDic];
            
            return;
        }
        
        if (![self.passwordTF.tf.text isEqual:self.passwordTF1.tf.text]){
            
            // 事件上报
            NSMutableDictionary *trackDic = [NSMutableDictionary dictionary];
            [trackDic setValue:@"1" forKey:@"login_type"];
            [trackDic setValue:@"1-1" forKey:@"login_category"];
            [trackDic setValue:@"1-7" forKey:@"login_action"];
            [trackDic setValue:@"两次密码输入不一致，请重新输入" forKey:@"msg"];
            
            [[RXLogService sharedSDK] addLogSingleFirstLoginWithEvent:rxlog_agreement_process distinctId:@"" properties:trackDic];
            
            return;
        }
        
//        894306571@qq.com
//        123aA!
        [[RXApiService sharedSDK] registWithUsername:self.username password:self.passwordTF.tf.text captchaCode:self.captchaCode ext:self.extDic complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
            NSMutableDictionary *userInfo = [NSMutableDictionary dictionary];
            if (self.block) {
                if (error) {
                    self.block(NO, self.accountTF.tf.text, self.passwordTF.tf.text);
                    [RXOSHUD showErrorText:error.responesObject[@"msg"]];
                    
                    [userInfo setValue:error.responesObject forKey:@"error"];
                    [[NSNotificationCenter defaultCenter] postNotificationName:noti_register object:nil userInfo:userInfo];
                } else {
                    RXOSCommonView *successV = [[RXOSCommonView alloc] initWithDesStr:@"邮箱账号注册成功" title:@"注册账号" image:@"rx_success" complete:^{
                        if (self.block) {
                            self.block(YES, self.username, self.passwordTF.tf.text);
                        }
                        [userInfo setValue:response forKey:@"response"];
                        
                        [[NSNotificationCenter defaultCenter] postNotificationName:noti_register object:nil userInfo:userInfo];
                        [self closeBtnAction];
                    }];
                }
            }
            
        }];
    }
}

- (void)closeBtnAction
{
    if (self.bindingBlock) {
        RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
        
        NSString *errorMsg = [RXErrorTool getRXErrorMsg:RXLimitError_closeView];
        err.responesObject = @{@"msg" : errorMsg,
                               @"code" : @(RXLimitError_closeView)
        };
        self.bindingBlock(nil, err);
    }
    
    if (self.type == RegistViewType_password) {
        for (UIView *v in [UIApplication sharedApplication].keyWindow.subviews) {
            if ([v isKindOfClass:[RXOSRegistView class]]) {
                RXOSRegistView *registView = (RXOSRegistView *)v;
                [registView hide];
            }
        }
    } else {
        [self hide];
    }
    
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
        NSString *title;
        if (self.type == RegistViewType_regist) {
            title = @"注册账号";
        } else if (self.type == RegistViewType_binding) {
            title = @"绑定手机";
        } else if (self.type == RegistViewType_password) {
            title = @"设置密码";
        }
        _titleLbl.text = title;
        _titleLbl.textColor = [UIColor blackColor];
        _titleLbl.font = [UIFont systemFontOfSize:21 weight:UIFontWeightMedium];
        _titleLbl.textAlignment = NSTextAlignmentCenter;
    }
    return _titleLbl;
}

- (RXOSTextField *)accountTF
{
    if (!_accountTF) {

        UIKeyboardType keyboard = UIKeyboardTypeEmailAddress;
        NSString *title = @"请输入您的邮箱账号";
        if (self.type == RegistViewType_password) {
            keyboard = UIKeyboardTypeNumbersAndPunctuation;
            title = @"6-32位，数字+字母+特殊字符";
        }
        
        _accountTF = [[RXOSTextField alloc] initWithPlaceholder:@"请输入您的邮箱账号" type:TFType_clear keyboardType:keyboard];
        _accountTF.tf.delegate = self;
    }
    return _accountTF;
}

- (RXOSTextField *)codeTF
{
    if (!_codeTF) {
        
        UIKeyboardType keyboard = UIKeyboardTypeEmailAddress;
        TFType type = TFType_loginCode;
        NSString *title = @"请输入邮箱验证码";
        if (self.type == RegistViewType_password) {
            keyboard = UIKeyboardTypeNumberPad;
            type = TFType_clear;
            title = @"请输入您的密码";
        }
        _codeTF = [[RXOSTextField alloc] initWithPlaceholder:@"请输入邮箱验证码" type:type keyboardType:UIKeyboardTypeNumbersAndPunctuation];
        _codeTF.tf.delegate = self;
        __weak __typeof__(self) weakSelf = self;
        _codeTF.clearBlock = ^{
            [weakSelf codeAction];
        };
    }
    return _codeTF;
}

- (RXOSTextField *)passwordTF
{
    if (!_passwordTF) {
        _passwordTF = [[RXOSTextField alloc] initWithPlaceholder:@"请输入密码" type:TFType_pwdNormal keyboardType:UIKeyboardTypeNumbersAndPunctuation];
        _passwordTF.tf.delegate = self;
        [_passwordTF.tf setSecureTextEntry:YES];
        _passwordTF.showPwdBtn.hidden = YES;
//        _passwordTF.hidden = YES;
    }
    return _passwordTF;
}

- (RXOSTextField *)passwordTF1
{
    if (!_passwordTF1) {
        _passwordTF1 = [[RXOSTextField alloc] initWithPlaceholder:@"请再次输入密码" type:TFType_pwdNormal keyboardType:UIKeyboardTypeNumbersAndPunctuation];
        _passwordTF1.tf.delegate = self;
        [_passwordTF1.tf setSecureTextEntry:YES];
        _passwordTF1.showPwdBtn.hidden = YES;
//        _passwordTF1.hidden = YES;
    }
    return _passwordTF1;
}

- (UIButton *)registBtn
{
    if (!_registBtn) {
        _registBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        _registBtn.userInteractionEnabled = NO;
        [_registBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
        NSString *title;
        if (self.type == RegistViewType_regist) {
            title = @"下一步";
        } else if (self.type == RegistViewType_binding) {
            title = @"完成";
        } else if (self.type == RegistViewType_password) {
            title = @"确认";
        }
        [_registBtn setTitle:[RXLocation osLaunguage:title] forState:UIControlStateNormal];
        [_registBtn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
        _registBtn.titleLabel.font = [UIFont systemFontOfSize:18 weight:UIFontWeightMedium];
        _registBtn.layer.cornerRadius = 5;
        [_registBtn addTarget:self action:@selector(registAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _registBtn;
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
        _backBtn.hidden = YES;
    }
    return _backBtn;
}

@end
