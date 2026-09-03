//
//  RXRegistView.m
//  RXSDK
//
//  Created by 陈汉 on 2021/9/30.
//

#import "RXRegistView.h"
#import "RXUICommonTool.h"
#import <RXSDK_Pure/RXErrorTool.h>

@interface RXRegistView () <UITextFieldDelegate, UITextViewDelegate>

@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) UILabel *titleLbl;
@property (nonatomic, strong) RXTextField *accountTF;
@property (nonatomic, strong) RXTextField *codeTF;
@property (nonatomic, strong) RXTextField *passwordTF;
@property (nonatomic, strong) RXTextField *passwordTF1;
@property (nonatomic, strong) UIButton *registBtn;
@property (nonatomic, strong) UIButton *closeBtn;
@property (nonatomic, assign) NSInteger orientation;  // 屏幕方向 1竖屏 2横屏
@property (nonatomic, assign) NSInteger timeCount;
@property (nonatomic, copy) RegistCallBack block;
@property (nonatomic, assign) RegistViewType type;
@property (nonatomic, strong) NSMutableDictionary *extDic;

@end

@implementation RXRegistView

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
        
        self.orientation = [RXUICommonTool getInterfaceOrientation];
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

#pragma mark -- <add notifications>
-(void)addNotifications
{
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyBoardWillShow:) name:UIKeyboardWillShowNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyBoardWillHide:) name:UIKeyboardWillHideNotification object:nil];
}

#pragma mark -- <notifications>
- (void)keyBoardWillShow:(NSNotification *)notification
{
    NSDictionary *userInfo = [notification userInfo];
    NSNumber *duration = [userInfo objectForKey:UIKeyboardAnimationDurationUserInfoKey];
    
    [UIView animateWithDuration:duration.doubleValue animations:^{
        UIView *window = [UIApplication sharedApplication].keyWindow;
//        self.bgView.sd_layout.bottomSpaceToView(self, window.frame.size.height / 2 - 275 / 2 + 35);
        [self layoutSubviews];
    }];
}

- (void)keyBoardWillHide:(NSNotification *)notification
{
    NSDictionary *userInfo = [notification userInfo];
    NSNumber *duration = [userInfo objectForKey:UIKeyboardAnimationDurationUserInfoKey];
    
    [UIView animateWithDuration:duration.doubleValue animations:^{
        UIView *window = [UIApplication sharedApplication].keyWindow;
//        self.bgView.sd_layout.bottomSpaceToView(self, window.frame.size.height / 2 - 275 / 2);
        [self layoutSubviews];
    }];
}

#pragma mark -- <setUI>
- (void)setUI
{
//    [self sd_addSubviews:@[self.bgView]];
//    [self.bgView sd_addSubviews:@[self.titleLbl, self.accountTF, self.codeTF, self.passwordTF, self.registBtn, self.closeBtn]];
    
    [self addSubview:self.bgView];
    [self.bgView addSubview:self.titleLbl];
    [self.bgView addSubview:self.accountTF];
    [self.bgView addSubview:self.codeTF];
    [self.bgView addSubview:self.passwordTF];
    [self.bgView addSubview:self.registBtn];
    [self.bgView addSubview:self.closeBtn];
    
    [self layoutViews];
}

- (void)layoutViews
{
    UIView *window = [UIApplication sharedApplication].keyWindow;
    
    _bgView.frame = CGRectMake(0, 0, 344, 275);
    _bgView.center = window.center;
    
    _titleLbl.frame = CGRectMake(0, 24, 344, 21);
    
    _accountTF.frame = CGRectMake(30, CGRectGetMaxY(_titleLbl.frame) + 16, 284, 40);
    
    _codeTF.frame = CGRectMake(30, CGRectGetMaxY(_accountTF.frame) + 8, 284, 40);
    
    _passwordTF.frame = CGRectMake(30, CGRectGetMaxY(_codeTF.frame) + 8, 284, 40);
    
    _registBtn.frame = CGRectMake(30, CGRectGetMaxY(_passwordTF.frame) + 16, 284, 40);
    
    _closeBtn.frame = CGRectMake(314, 20, 16, 16);
    
    [self layoutSubviews];
}

#pragma mark -- <UITextFieldDelegate>
- (void)textViewDidChangeSelection:(UITextView *)textView
{
    NSString *str = textView.text;
    if (str.length > 0) {
        if (textView == _passwordTF.tf) {
            _passwordTF.placeholderLbl.hidden = YES;
        }
        if (textView == _accountTF.tf) {
            _accountTF.placeholderLbl.hidden = YES;
        }
        if (textView == _codeTF.tf) {
            _codeTF.placeholderLbl.hidden = YES;
        }
    } else {
        if (textView == _passwordTF.tf) {
            _passwordTF.placeholderLbl.hidden = NO;
        }
        if (textView == _accountTF.tf) {
            _accountTF.placeholderLbl.hidden = NO;
        }
        if (textView == _codeTF.tf) {
            _codeTF.placeholderLbl.hidden = NO;
        }
    }
    
    if (_passwordTF.tf.text.length > 0 && _accountTF.tf.text.length > 0 && _codeTF.tf.text.length > 0) {
        _registBtn.userInteractionEnabled = YES;
        [_registBtn setBackgroundColor:[UIColor colorWithHexString:@"20C0B3"]];
    } else {
        _registBtn.userInteractionEnabled = NO;
        [_registBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
    }
}

//- (void)textFieldDidChangeSelection:(UITextField *)textField
//{
//    NSString *str = textField.text;
//    if (str.length > 0) {
//        if (textField == _passwordTF.tf) {
//            _passwordTF.placeholderLbl.hidden = YES;
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
//        }
//        if (textField == _accountTF.tf) {
//            _accountTF.placeholderLbl.hidden = NO;
//        }
//        if (textField == _codeTF.tf) {
//            _codeTF.placeholderLbl.hidden = NO;
//        }
//    }
//
//    if (_passwordTF.tf.text.length > 0 && _accountTF.tf.text.length > 0 && _codeTF.tf.text.length > 0) {
//        _registBtn.userInteractionEnabled = YES;
//        [_registBtn setBackgroundColor:[UIColor colorWithHexString:@"20C0B3"]];
//    } else {
//        _registBtn.userInteractionEnabled = NO;
//        [_registBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
//    }
//}

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

- (BOOL)textField:(UITextField *)textField shouldChangeCharactersInRange:(NSRange)range replacementString:(NSString *)string
{
//    NSString * str = [textField.text stringByReplacingCharactersInRange:range withString:string];
//    if (str.length > 0) {
//        if (textField == _accountTF.tf) {
//            _accountTF.placeholderLbl.hidden = YES;
//        }
//        if (textField == _codeTF.tf) {
//            _codeTF.placeholderLbl.hidden = YES;
//        }
//        if (textField == _passwordTF.tf) {
//            _passwordTF.placeholderLbl.hidden = YES;
//        }
//        if (textField == _passwordTF1.tf) {
//            _passwordTF1.placeholderLbl.hidden = YES;
//        }
//    } else {
//        if (textField == _accountTF.tf) {
//            _accountTF.placeholderLbl.hidden = NO;
//        }
//        if (textField == _codeTF.tf) {
//            _codeTF.placeholderLbl.hidden = NO;
//        }
//        if (textField == _passwordTF.tf) {
//            _passwordTF.placeholderLbl.hidden = NO;
//        }
//        if (textField == _passwordTF1.tf) {
//            _passwordTF1.placeholderLbl.hidden = NO;
//        }
//    }
//
//    if (_accountTF.placeholderLbl.hidden && _passwordTF.placeholderLbl.hidden && _codeTF.placeholderLbl.hidden) {
//        _registBtn.userInteractionEnabled = YES;
//        [_registBtn setBackgroundImage:[UIImage rxBundleImageNamed:@"btnBg2"] forState:UIControlStateNormal];
//    } else {
//        _registBtn.userInteractionEnabled = NO;
//        [_registBtn setBackgroundImage:[UIImage rxBundleImageNamed:@"btnBg_unSelect"] forState:UIControlStateNormal];
//    }
    
    return YES;
}

#pragma mark -- <actions>
- (void)codeAction
{
    if(self.accountTF.tf.text == nil || [self.accountTF.tf.text isEqualToString:@""]){
//        [SVProgressHUD showInfoWithStatus:@"请输入手机号"];
        
        return;
    }
    self.codeTF.codeLbl.enabled = NO;
    self.timeCount = 60;
    
    
    NSString *text = [NSString stringWithFormat:@"重新获取(%ld)",(long)self.timeCount];
    NSDictionary *attribtDic = @{NSUnderlineStyleAttributeName: [NSNumber numberWithInteger:NSUnderlineStyleSingle],NSUnderlineColorAttributeName:[UIColor colorWithHexString:@"31B14E"]};

    NSMutableAttributedString *attribtStr = [[NSMutableAttributedString alloc]initWithString:text attributes:attribtDic];
    self.codeTF.codeLbl.attributedText = attribtStr;
    self.codeTF.codeLbl.textColor = [UIColor colorWithHexString:@"31B14E"];
    
    NSTimer *timer  =  [NSTimer timerWithTimeInterval:1.0 target:self selector:@selector(timered:) userInfo:nil repeats:YES];
    [[NSRunLoop mainRunLoop] addTimer:timer forMode:NSDefaultRunLoopMode];
    
    [[RXApiService sharedSDK] getCaptchaCodeWithType:CaptchaType_phone target:self.accountTF.tf.text purpose:@"register" complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if(error != nil){
//                [SVProgressHUD showErrorWithStatus:@"获取验证码失败"];
                return;
            }
        });
    }];
}

- (void)timered:(NSTimer*)time
{
    NSString *text = [NSString stringWithFormat:@"重新获取(%ld)",(long)self.timeCount];
    NSDictionary *attribtDic = @{NSUnderlineStyleAttributeName: [NSNumber numberWithInteger:NSUnderlineStyleSingle],NSUnderlineColorAttributeName:[UIColor whiteColor]};

    NSMutableAttributedString *attribtStr = [[NSMutableAttributedString alloc]initWithString:text attributes:attribtDic];
    self.codeTF.codeLbl.attributedText = attribtStr;
    self.codeTF.codeLbl.textColor = [UIColor colorWithHexString:@"31B14E"];
    
    self.timeCount--;
    if(self.timeCount < 0){
        
        NSString *text = @"获取验证码";
        NSDictionary *attribtDic = @{NSUnderlineStyleAttributeName: [NSNumber numberWithInteger:NSUnderlineStyleSingle],NSUnderlineColorAttributeName:[UIColor whiteColor]};

        NSMutableAttributedString *attribtStr = [[NSMutableAttributedString alloc]initWithString:text attributes:attribtDic];
        self.codeTF.codeLbl.attributedText = attribtStr;
        self.codeTF.codeLbl.textColor = [UIColor colorWithHexString:@"31B14E"];
        
        self.codeTF.codeLbl.enabled = YES;
        [time invalidate];
    }
}

- (void)registAction
{
    if([self.accountTF.tf.text isEqualToString:@""] || self.accountTF.tf.text == nil){
//        [SVProgressHUD showInfoWithStatus:@"请输入手机号码"];
        return;
    }
    if([self.passwordTF.tf.text isEqualToString:@""] || self.passwordTF.tf.text == nil){
//        [SVProgressHUD showInfoWithStatus:@"请输入密码"];
        return;
    }
//    if([self.passwordTF1.tf.text isEqualToString:@""] || self.passwordTF1.tf.text == nil){
//        ToastView *toastView  = [[ToastView alloc]init];
//        [toastView showWithTitle:@"请输入确认密码" andY:__MainScreen_Height / 2];
//        return;
//    }
    if([self.codeTF.tf.text isEqualToString:@""] || self.codeTF.tf.text == nil){
//        [SVProgressHUD showInfoWithStatus:@"请输入验证码"];
        return;
    }
//    if (![self.passwordTF.tf.text isEqualToString:self.passwordTF1.tf.text]) {
//        ToastView *toastView  = [[ToastView alloc]init];
//        [toastView showWithTitle:@"密码不一致" andY:__MainScreen_Height / 2];
//        return;
//    }
    
    if (self.type == RegistViewType_regist) {
        [[RXApiService sharedSDK] registWithUsername:self.accountTF.tf.text password:self.passwordTF.tf.text captchaCode:self.codeTF.tf.text ext:self.extDic complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
            if (self.block) {
                if (error) {
//                    [SVProgressHUD showErrorWithStatus:error.responesObject[@"msg"]];
                    self.block(NO, self.accountTF.tf.text, self.passwordTF.tf.text);
                } else {
//                    [SVProgressHUD showSuccessWithStatus:@"注册成功"];
                    [self hide];
                    
                    self.block(YES, self.accountTF.tf.text, self.passwordTF.tf.text);
                }
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
//                [RXUIUserUtility sharedManager].phone = self.accountTF.tf.text;
//                [RXUIUserUtility sharedManager].password = self.passwordTF.tf.text;
//                [SVProgressHUD showSuccessWithStatus:@"绑定成功"];
                if (self.bindingBlock) {
                    self.bindingBlock(response, nil);
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
    [self hide];
}

#pragma mark -- <lazy>
- (UIView *)bgView
{
    if (!_bgView) {
        _bgView = [[UIView alloc] init];
        _bgView.backgroundColor = [UIColor colorWithHexString:@"fafafa"];
//        _bgView.backgroundColor = [UIColor redColor];
        _bgView.layer.cornerRadius = 6;
    }
    return _bgView;
}

- (UILabel *)titleLbl
{
    if (!_titleLbl) {
        _titleLbl = [[UILabel alloc] init];
        NSString *title;
        if (self.type == RegistViewType_regist) {
            title = @"手机注册";
        } else if (self.type == RegistViewType_binding) {
            title = @"绑定手机";
        }
        _titleLbl.text = title;
        _titleLbl.textColor = [UIColor blackColor];
        _titleLbl.font = [UIFont boldSystemFontOfSize:18];
        _titleLbl.textAlignment = NSTextAlignmentCenter;
    }
    return _titleLbl;
}

- (RXTextField *)accountTF
{
    if (!_accountTF) {
        _accountTF = [[RXTextField alloc] initWithPlaceholder:@"请输入手机号" type:TFType_clear keyboardType:UIKeyboardTypeNumbersAndPunctuation];
        _accountTF.tf.delegate = self;
    }
    return _accountTF;
}

- (RXTextField *)codeTF
{
    if (!_codeTF) {
        _codeTF = [[RXTextField alloc] initWithPlaceholder:@"请输入验证码" type:TFType_code keyboardType:UIKeyboardTypeNumbersAndPunctuation];
        _codeTF.tf.delegate = self;
        __weak __typeof__(self) weakSelf = self;
        _codeTF.clearBlock = ^{
            [weakSelf codeAction];
        };
    }
    return _codeTF;
}

- (RXTextField *)passwordTF
{
    if (!_passwordTF) {
        _passwordTF = [[RXTextField alloc] initWithPlaceholder:@"设置密码" type:TFType_clear keyboardType:UIKeyboardTypeNumbersAndPunctuation];
        _passwordTF.tf.delegate = self;
        [_passwordTF.tf setSecureTextEntry:YES];
    }
    return _passwordTF;
}

- (RXTextField *)passwordTF1
{
    if (!_passwordTF1) {
        _passwordTF1 = [[RXTextField alloc] initWithPlaceholder:@"确认密码" type:TFType_clear keyboardType:UIKeyboardTypeNumberPad];
        _passwordTF1.tf.delegate = self;
        [_passwordTF1.tf setSecureTextEntry:YES];
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
            title = @"注册";
        } else if (self.type == RegistViewType_binding) {
            title = @"完成";
        }
        [_registBtn setTitle:title forState:UIControlStateNormal];
        [_registBtn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
        _registBtn.titleLabel.font = [UIFont systemFontOfSize:16];
        _registBtn.layer.cornerRadius = 21;
        [_registBtn addTarget:self action:@selector(registAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _registBtn;
}

- (UIButton *)closeBtn
{
    if (!_closeBtn) {
        _closeBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_closeBtn setImage:[UIImage rxBundleImageNamed:@"rx_close"] forState:UIControlStateNormal];
        [_closeBtn addTarget:self action:@selector(closeBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _closeBtn;
}

@end
