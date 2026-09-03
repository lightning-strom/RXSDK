//
//  RXOSSetPasswordView.m
//  RXUIKit
//
//  Created by 陈汉 on 2023/5/4.
//

#import "RXOSSetPasswordView.h"
#import "RXOSCloseBtn.h"
#import <RXSDK_Pure/RXErrorTool.h>

typedef void(^Complete)(NSDictionary *response, RX_CommonRequestError *error);

@interface RXOSSetPasswordView () <UITextFieldDelegate, UITextViewDelegate>

@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) UILabel *titleLbl;
@property (nonatomic, strong) UILabel *desLbl;
@property (nonatomic, strong) RXOSTextField *passwordTF;
@property (nonatomic, strong) RXOSTextField *passwordTF1;
@property (nonatomic, strong) UIButton *confirmBtn;
@property (nonatomic, strong) RXOSCloseBtn *closeBtn;
@property (nonatomic, copy) Complete complete;

@end

@implementation RXOSSetPasswordView

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (instancetype)initWithComplete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    self = [super initWithFrame:CGRectMake(0, 0, [UIApplication sharedApplication].keyWindow.frame.size.width, [UIApplication sharedApplication].keyWindow.frame.size.height)];
    if (self) {
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
        [[UIApplication sharedApplication].keyWindow addSubview:self];
        
        self.complete = complete;
        
        [self setUI];
        
        [self show];
        
        [self addNotifications];
        
        UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tapAction:)];
        [self addGestureRecognizer:tap];
    }
    return self;
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
        CGFloat bgH = [RXOSCommonTool getScreenHeight];
        self.bgView.center = CGPointMake(window.center.x, window.frame.size.height / 2 - bgH / 2 + 30);
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

- (void)show
{
    [RXOSCommonTool transformWithView:self.bgView];
    [UIView animateWithDuration:0.1 animations:^{
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.5];
        [RXOSCommonTool showWithAnimate:self.bgView];
        [self layoutSubviews];
    }];
    
    [UIView animateWithDuration:0.25 animations:^{
        UIView *window = [UIApplication sharedApplication].keyWindow;
        CGFloat bgH = [RXOSCommonTool getScreenHeight];
        self.bgView.center = CGPointMake(window.center.x, window.frame.size.height / 2 - bgH / 2 + 30);
        [self layoutSubviews];
    }];
}

- (void)hide
{
    [self endEditing:YES];
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    [self removeFromSuperview];
    
}

#pragma mark -- <setUI>
- (void)setUI
{
    [self addSubview:self.bgView];
    [self.bgView addSubview:self.titleLbl];
    [self.bgView addSubview:self.desLbl];
    [self.bgView addSubview:self.passwordTF];
    [self.bgView addSubview:self.passwordTF1];
    [self.bgView addSubview:self.confirmBtn];
    [self.bgView addSubview:self.closeBtn];
    
    [self layoutViews];
}

- (void)layoutViews
{
    UIView *window = [UIApplication sharedApplication].keyWindow;
    
    CGFloat bgW = [RXOSCommonTool getScreenWidth];
    CGFloat bgH = RXAC ? 250 : 285;

    _bgView.frame = CGRectMake(0, CGRectGetHeight(window.frame), bgW, bgH);
    _bgView.center = window.center;
    
    _titleLbl.frame = CGRectMake(0, 21, CGRectGetWidth(_bgView.frame), 24);
    
//    _desLbl.frame = CGRectMake(RXAC ? 25 : 25, CGRectGetMaxY(_titleLbl.frame) + 12, CGRectGetWidth(_bgView.frame) - (RXAC ? 50 : 50), 36);
    
    _passwordTF.frame = CGRectMake(RXAC ? 29 : 25, 73, CGRectGetWidth(_bgView.frame) - (RXAC ? 58 : 50), RXAC ? 36 : 46);
    
    _passwordTF1.frame = CGRectMake(CGRectGetMinX(_passwordTF.frame), CGRectGetMaxY(_passwordTF.frame) + 14, CGRectGetWidth(_passwordTF.frame), CGRectGetHeight(_passwordTF.frame));
    
    _confirmBtn.frame = CGRectMake(CGRectGetMinX(_passwordTF.frame), CGRectGetHeight(_bgView.frame) - (RXAC ? 27 + 43 : 25 + 48), CGRectGetWidth(_bgView.frame) - (RXAC ? 58 : 50), RXAC ? 43 : 48);
    
    _closeBtn.frame = CGRectMake(bgW - (RXAC ? 24 + 28 : 21 + 28), 16, 28, 28);
    
    [self layoutSubviews];
}

#pragma mark -- <UITextFieldDelegate>
- (BOOL)textFieldShouldReturn:(UITextField *)textField
{
    [textField endEditing:YES];
    return YES;
}

//- (void)textFieldDidChangeSelection:(UITextField *)textField
//{
//    NSString *str = textField.text;
//    if (str.length > 0) {
//        if (textField == _passwordTF.tf) {
//            if (str.length > 32) {
//                _passwordTF.tf.text = [str substringToIndex:32];
////                [RXOSHUD showText:@"密码长度不能超过32位"];
//            }
//            _passwordTF.placeholderLbl.hidden = YES;
//            _passwordTF.showPwdBtn.hidden = NO;
//        }
//        if (textField == _passwordTF1.tf) {
//            if (str.length > 32) {
//                _passwordTF1.tf.text = [str substringToIndex:32];
////                [RXOSHUD showText:@"密码长度不能超过32位"];
//            }
//            _passwordTF1.placeholderLbl.hidden = YES;
//            _passwordTF1.showPwdBtn.hidden = NO;
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
//    }
//
//    if (str.length > 32) {
//        _passwordTF.tf.text = [str substringToIndex:32];
////        [RXOSHUD showText:@"密码长度不能超过32位"];
//    }
//
//    if (_passwordTF.tf.text.length > 0 && _passwordTF1.tf.text.length > 0) {
//        _confirmBtn.userInteractionEnabled = YES;
//        [_confirmBtn setBackgroundColor:[UIColor colorWithHexString:@"20C0B3"]];
//    } else {
//        _confirmBtn.userInteractionEnabled = NO;
//        [_confirmBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
//    }
//}

- (BOOL)textField:(UITextField *)textField shouldChangeCharactersInRange:(NSRange)range replacementString:(NSString *)string
{
    NSString *str = textField.text;
    if (string.length > 0) {
        if (textField == _passwordTF.tf) {
            if (str.length > 31 && string.length > 0) {
                return NO;
//                _passwordTF.tf.text = [str substringToIndex:32];
                //                [RXHUD showText:@"密码长度不能超过32位"];
            }
            _passwordTF.placeholderLbl.hidden = YES;
            _passwordTF.showPwdBtn.hidden = NO;
            
            if (_passwordTF1.tf.text.length > 0) {
                _confirmBtn.userInteractionEnabled = YES;
                [_confirmBtn setBackgroundColor:[UIColor colorWithHexString:@"20C0B3"]];
            } else {
                _confirmBtn.userInteractionEnabled = NO;
                [_confirmBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
            }
        }
        if (textField == _passwordTF1.tf) {
            if (str.length > 31 && string.length > 0) {
                return NO;
//                _passwordTF1.tf.text = [str substringToIndex:32];
                //                [RXHUD showText:@"密码长度不能超过32位"];
            }
            _passwordTF1.placeholderLbl.hidden = YES;
            _passwordTF1.showPwdBtn.hidden = NO;
            
            if (_passwordTF.tf.text.length > 0) {
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
            
            if (textField == _passwordTF.tf) {
                _passwordTF.placeholderLbl.hidden = NO;
                _passwordTF.showPwdBtn.hidden = YES;
            }
            if (textField == _passwordTF1.tf) {
                _passwordTF1.placeholderLbl.hidden = NO;
                _passwordTF1.showPwdBtn.hidden = YES;
            }
        }
    }
    
    if (str.length > 31 && string.length > 0) {
        return NO;
//        _passwordTF.tf.text = [str substringToIndex:32];
        //        [RXHUD showText:@"密码长度不能超过32位"];
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
    
    NSString *msg = @"密码输入6-32位，包含数字+字母+特殊符号";
    // 是否开启简单密码
    RXPasswordStrength passwordType = [RXOSUserUtility sharedManager].passwordType;
    if (passwordType == Default || passwordType == Average) {
        msg = @"密码输入6-32位，包含数字+字母+特殊符号";
    } else if (passwordType == Custom) {
        msg = @"密码正则验证错误";
    }
    
    if (![self.passwordTF.tf.text isEqual:self.passwordTF1.tf.text]){
        [RXOSHUD showErrorText:@"两次密码输入不一致，请重新输入"];
        return;
    }
    if (![RXOSCommonTool checkPasswordWithPwd:self.passwordTF.tf.text]) {
        [RXOSHUD showErrorText:msg];
        return;
    }
    
    [[RXApiService sharedSDK] updatePasswordWithOldPwd:@"" newPwd:self.passwordTF.tf.text complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (error) {
            NSLog(@"设置密码失败：\n%@", error.error);
            
            if ([error.responesObject[@"code"] integerValue] == RXLoginError_passwordRuleFail) {
                [RXOSHUD showErrorText:@"密码输入6-32位，包含数字+字母+特殊符号"];
            } else {
                [RXOSHUD showErrorText:error.responesObject[@"msg"]];
            }
            
            if (self.complete) {
                self.complete(nil, error);
            }
        } else {
            NSLog(@"设置密码成功：\n%@", response);
            [RXOSHUD showSuccessText:@"设置成功"];
            [self hide];
            if (self.complete) {
                self.complete(response, nil);
            }
        }
    }];
}

- (void)closeBtnAction
{
    RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
    
    NSString *errorMsg = [RXErrorTool getRXErrorMsg:RXLimitError_closeView];
    err.responesObject = @{@"msg" : errorMsg,
                           @"code" : @(RXLimitError_closeView)
    };
    if (self.complete) {
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
        _titleLbl.text = @"请输入密码";
        _titleLbl.textColor = [UIColor blackColor];
        _titleLbl.font = [UIFont systemFontOfSize:21 weight:UIFontWeightMedium];
        _titleLbl.textAlignment = NSTextAlignmentCenter;
    }
    return _titleLbl;
}

- (UILabel *)desLbl
{
    if (!_desLbl) {
        _desLbl = [[UILabel alloc] init];
        _desLbl.text = @"8-32位，数字+字母+特殊字符";
        _desLbl.numberOfLines = 2;
        _desLbl.font = [UIFont systemFontOfSize:13];
        _desLbl.textAlignment = NSTextAlignmentCenter;
        _desLbl.hidden = YES;
    }
    return _desLbl;
}

- (RXOSTextField *)passwordTF
{
    if (!_passwordTF) {
        _passwordTF = [[RXOSTextField alloc] initWithPlaceholder:@"请输入密码" type:TFType_pwdNormal keyboardType:UIKeyboardTypeDefault];
        _passwordTF.tf.delegate = self;
        [_passwordTF.tf becomeFirstResponder];
        _passwordTF.showPwdBtn.hidden = YES;
    }
    return _passwordTF;
}

- (RXOSTextField *)passwordTF1
{
    if (!_passwordTF1) {
        _passwordTF1 = [[RXOSTextField alloc] initWithPlaceholder:@"请再次输入密码" type:TFType_pwdNormal keyboardType:UIKeyboardTypeDefault];
        _passwordTF1.tf.delegate = self;
        _passwordTF1.showPwdBtn.hidden = YES;
    }
    return _passwordTF1;
}

- (UIButton *)confirmBtn
{
    if (!_confirmBtn) {
        _confirmBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        _confirmBtn.userInteractionEnabled = NO;
        [_confirmBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
        [_confirmBtn setTitle:[RXLocation osLaunguage:@"确认"] forState:UIControlStateNormal];
        [_confirmBtn setTitleColor:[UIColor colorWithHexString:@"F2FFFB"] forState:UIControlStateNormal];
        _confirmBtn.titleLabel.font = [UIFont systemFontOfSize:18 weight:UIFontWeightMedium];
        [_confirmBtn addTarget:self action:@selector(confimBtnAction) forControlEvents:UIControlEventTouchUpInside];
        _confirmBtn.layer.cornerRadius = 5;
    }
    return _confirmBtn;
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

@end
