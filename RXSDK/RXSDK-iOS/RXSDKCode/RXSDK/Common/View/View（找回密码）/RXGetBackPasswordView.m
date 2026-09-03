//
//  RXGetBackPasswordView.m
//  RXSDK
//
//  Created by 陈汉 on 2021/10/8.
//

#import "RXGetBackPasswordView.h"
#import "RXCommonTool.h"

@interface RXGetBackPasswordView () <UITextFieldDelegate>

@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) UILabel *titleLbl;
@property (nonatomic, strong) RXTextField *passwordTF1;
@property (nonatomic, strong) RXTextField *passwordTF2;
@property (nonatomic, strong) UIButton *confirmBtn;
@property (nonatomic, strong) UIButton *closeBtn;
@property (nonatomic, assign) NSInteger orientation;  // 屏幕方向 1竖屏 2横屏
@property (nonatomic, assign) GetBackPasswordType type;
@property (nonatomic, assign) NSInteger timeCount;
@property (nonatomic, strong) NSString *phoneStr;
@property (nonatomic, strong) NSString *codeStr;

@end

@implementation RXGetBackPasswordView

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (instancetype)initWithType:(GetBackPasswordType)type
                       phone:(NSString *)phone
                        code:(NSString *)code
{
    if (type == GetBackPasswordType_code) {
        self = [super initWithFrame:CGRectMake(0, 0, [UIApplication sharedApplication].keyWindow.frame.size.width, [UIApplication sharedApplication].keyWindow.frame.size.height)];
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
    } else {
        CGFloat viewX = ([UIApplication sharedApplication].keyWindow.frame.size.width - 335) / 2 + 335;
        self = [super initWithFrame:CGRectMake(viewX, 0, 0, [UIApplication sharedApplication].keyWindow.frame.size.height)];
        self.backgroundColor = [UIColor clearColor];
    }
    
    if (self) {
        [[UIApplication sharedApplication].keyWindow addSubview:self];
        
        self.orientation = [RXCommonTool getInterfaceOrientation];
        self.phoneStr = phone;
        self.codeStr = code;
        self.type = type;
        
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
    if (self.type == GetBackPasswordType_code) {
        [UIView animateWithDuration:0.15 animations:^{
            UIView *window = [UIApplication sharedApplication].keyWindow;
            self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.6];

            self.bgView.sd_layout.bottomSpaceToView(self, window.frame.size.height / 2 - 232 / 2);
            [self layoutSubviews];
        }];
    } else {
        [UIView animateWithDuration:0.15 animations:^{
            self.frame = CGRectMake(0, 0, [UIApplication sharedApplication].keyWindow.frame.size.width, [UIApplication sharedApplication].keyWindow.frame.size.height);
        }];
    }
}

- (void)hide
{
    if (self.type == GetBackPasswordType_code) {
        [UIView animateWithDuration:0.15 animations:^{
            self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];

            self.bgView.sd_layout.bottomSpaceToView(self, -232);
            [self layoutSubviews];
        }];
    } else {
        [UIView animateWithDuration:0.15 animations:^{
            CGFloat viewX = ([UIApplication sharedApplication].keyWindow.frame.size.width - 335) / 2 + 335;
            self.frame = CGRectMake(viewX, 0, 0, [UIApplication sharedApplication].keyWindow.frame.size.height);
        }];
    }
    
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.15 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        [self removeFromSuperview];
    });
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
    NSValue *value = [userInfo objectForKey:UIKeyboardFrameEndUserInfoKey];
    NSNumber *duration = [userInfo objectForKey:UIKeyboardAnimationDurationUserInfoKey];
    
    [UIView animateWithDuration:duration.doubleValue animations:^{
        UIView *window = [UIApplication sharedApplication].keyWindow;
        CGFloat bgH = self.orientation == 2 ? 300 : 266;
        self.bgView.sd_layout.topSpaceToView(self, window.frame.size.height / 2 - bgH / 2 - 35);
        [self layoutSubviews];
    }];
}

- (void)keyBoardWillHide:(NSNotification *)notification
{
    NSDictionary *userInfo = [notification userInfo];
    NSNumber *duration = [userInfo objectForKey:UIKeyboardAnimationDurationUserInfoKey];
    
    [UIView animateWithDuration:duration.doubleValue animations:^{
        UIView *window = [UIApplication sharedApplication].keyWindow;
        CGFloat bgH = 232;
        self.bgView.sd_layout.topSpaceToView(self, window.frame.size.height / 2 - bgH / 2);
        [self layoutSubviews];
    }];
}

#pragma mark -- <setUI>
- (void)setUI
{
    [self sd_addSubviews:@[self.bgView]];
    [self.bgView sd_addSubviews:@[self.titleLbl, self.passwordTF1, self.passwordTF2, self.confirmBtn, self.closeBtn]];
    
    [self layoutViews];
}

- (void)layoutViews
{
    UIView *window = [UIApplication sharedApplication].keyWindow;
    
    CGFloat bgW = 335;
    CGFloat bgH = 232;
    
    if (self.type == GetBackPasswordType_code) {
        _bgView.sd_layout.centerXEqualToView(window)
        .bottomSpaceToView(self, -bgH)
        .widthIs(bgW)
        .heightIs(bgH);
    } else {
        _bgView.sd_layout.centerXEqualToView(window)
        .centerYEqualToView(window)
        .widthIs(bgW)
        .heightIs(bgH);
    }
    
    _titleLbl.sd_layout.topSpaceToView(self.bgView, 20)
    .leftSpaceToView(self.bgView, 0)
    .rightSpaceToView(self.bgView, 0)
    .heightIs(25);
    
    _passwordTF1.sd_layout.topSpaceToView(self.titleLbl, 14)
    .leftSpaceToView(self.bgView, 20)
    .rightSpaceToView(self.bgView, 20)
    .heightIs(40);
    
    _passwordTF2.sd_layout.topSpaceToView(self.passwordTF1, 10)
    .leftEqualToView(self.passwordTF1)
    .rightEqualToView(self.passwordTF1)
    .heightIs(40);
    
    _confirmBtn.sd_layout.topSpaceToView(self.passwordTF2, 16)
    .centerXEqualToView(self.passwordTF1)
    .widthIs(142)
    .heightIs(40);
    
    if (self.type == GetBackPasswordType_code) {
        _closeBtn.sd_layout.topSpaceToView(self.bgView, 12)
        .rightSpaceToView(self.bgView, 8)
        .widthIs(30)
        .heightEqualToWidth();
    } else {
        _closeBtn.sd_layout.topSpaceToView(self.bgView, 2)
        .leftSpaceToView(self.bgView, 7)
        .widthIs(28)
        .heightEqualToWidth();
    }
    
    [self layoutSubviews];
}

#pragma mark -- <UITextFieldDelegate>
- (void)textFieldDidBeginEditing:(UITextField *)textField {
//    if (textField == _nameTF.tf) {
//        _nameTF.clearBtn.hidden = NO;
//        _cardTF.clearBtn.hidden = YES;
//    } else {
//        _nameTF.clearBtn.hidden = YES;
//        _cardTF.clearBtn.hidden = NO;
//    }
}

- (void)textFieldDidEndEditing:(UITextField *)textField {
//    _nameTF.clearBtn.hidden = YES;
//    _cardTF.clearBtn.hidden = YES;
}

- (BOOL)textFieldShouldReturn:(UITextField *)textField
{
    [textField endEditing:YES];
    return YES;
}

- (BOOL)textField:(UITextField *)textField shouldChangeCharactersInRange:(NSRange)range replacementString:(NSString *)string
{
    NSString * str = [textField.text stringByReplacingCharactersInRange:range withString:string];
    if (str.length > 0) {
        if (textField == _passwordTF1.tf) {
            _passwordTF1.placeholderLbl.hidden = YES;
        }
        if (textField == _passwordTF2.tf) {
            _passwordTF2.placeholderLbl.hidden = YES;
        }
    } else {
        if (textField == _passwordTF1.tf) {
            _passwordTF1.placeholderLbl.hidden = NO;
        }
        if (textField == _passwordTF2.tf) {
            _passwordTF2.placeholderLbl.hidden = NO;
        }
    }
    
    if (_passwordTF1.placeholderLbl.hidden && _passwordTF2.placeholderLbl.hidden) {
        _confirmBtn.userInteractionEnabled = YES;
        [_confirmBtn setBackgroundImage:[UIImage bundleImageNamed:@"btnBg2"] forState:UIControlStateNormal];
    } else {
        _confirmBtn.userInteractionEnabled = NO;
        [_confirmBtn setBackgroundImage:[UIImage bundleImageNamed:@"btnBg_unSelect"] forState:UIControlStateNormal];
    }
    
    return YES;
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
        [SVProgressHUD showInfoWithStatus:titleStr];
        return;
    } else if (_passwordTF2.tf.text.length <= 0) {
        NSString *titleStr = @"";
        if (self.type == GetBackPasswordType_code) {
            titleStr = @"验证码不能为空";
        } else {
            titleStr = @"密码不能为空";
        }
        [SVProgressHUD showInfoWithStatus:titleStr];
        return;
    }
    
    if (self.type == GetBackPasswordType_code) {
        RXGetBackPasswordView *getBackPasswordView = [[RXGetBackPasswordView alloc] initWithType:GetBackPasswordType_default phone:self.passwordTF1.tf.text code:self.passwordTF2.tf.text];
        __weak __typeof__(self) weakSelf = self;
        getBackPasswordView.doneBlock = ^{
            [self hide];
        };
    } else {
        if (![self.passwordTF1.tf.text isEqual:self.passwordTF2.tf.text]){
            ToastView *toastView  = [[ToastView alloc]init];
            [toastView showWithTitle:@"两次密码不一致" andY:__MainScreen_Height / 2];
            return;
        }
        
        NSMutableDictionary *dict = [NSMutableDictionary dictionary];
        [dict setValue:self.phoneStr forKey:@"username"];
        [dict setValue:self.passwordTF1.tf.text forKey:@"password"];
        [dict setValue:self.codeStr forKey:@"captcha_code"];
        
        [[RXCommonNetworkExcuteManager commonRequestClient] beginRequest:[RXApiManager resetPasswordWithUsername:self.phoneStr password:self.passwordTF1.tf.text captchaCode:self.codeStr] success:^(id  _Nullable responseObject) {
            self.type = GetBackPasswordType_default;
            [self hide];
            if (self.doneBlock) {
                self.doneBlock();
            }
        } failure:^(RXCommonRequestError * _Nullable error) {
            ToastView *toastView  = [[ToastView alloc]init];
            [toastView showWithTitle:error.responesObject[@"msg"] andY:__MainScreen_Height / 2];
        }];
    }
}

- (void)codeAction
{
    if(self.passwordTF1.tf.text == nil || [self.passwordTF1.tf.text isEqualToString:@""]){
        ToastView *toast =  [[ToastView alloc]init];
        [toast showWithTitle:@"请输入手机号" andY:__MainScreen_Height / 2];
        return;
    }
    self.passwordTF2.codeLbl.enabled = NO;
    self.timeCount = 60;
    
    
    NSString *text = [NSString stringWithFormat:@"重新获取(%ld)",(long)self.timeCount];
    NSDictionary *attribtDic = @{NSUnderlineStyleAttributeName: [NSNumber numberWithInteger:NSUnderlineStyleSingle],NSUnderlineColorAttributeName:[UIColor colorWithHexString:@"31B14E"]};

    NSMutableAttributedString *attribtStr = [[NSMutableAttributedString alloc]initWithString:text attributes:attribtDic];
    self.passwordTF2.codeLbl.attributedText = attribtStr;
    self.passwordTF2.codeLbl.textColor = [UIColor colorWithHexString:@"31B14E"];
    
    NSTimer *timer  =  [NSTimer timerWithTimeInterval:1.0 target:self selector:@selector(timered:) userInfo:nil repeats:YES];
    [[NSRunLoop mainRunLoop] addTimer:timer forMode:NSDefaultRunLoopMode];
    
    [[RXApiService sharedSDK] getCaptchaCodeWithType:CaptchaType_phone target:self.passwordTF1.tf.text purpose:@"resetpwd" complete:^(NSDictionary * _Nullable response, RXCommonRequestError * _Nullable error) {
        if(error != nil){
            ToastView *toast =  [[ToastView alloc]init];
            [toast showWithTitle:@"获取验证码失败" andY:__MainScreen_Height / 2];
            return;
        }
    }];
}

- (void)timered:(NSTimer*)time
{
    NSString *text = [NSString stringWithFormat:@"重新获取(%ld)",(long)self.timeCount];
    NSDictionary *attribtDic = @{NSUnderlineStyleAttributeName: [NSNumber numberWithInteger:NSUnderlineStyleSingle],NSUnderlineColorAttributeName:[UIColor whiteColor]};

    NSMutableAttributedString *attribtStr = [[NSMutableAttributedString alloc]initWithString:text attributes:attribtDic];
    self.passwordTF2.codeLbl.attributedText = attribtStr;
    self.passwordTF2.codeLbl.textColor = [UIColor colorWithHexString:@"31B14E"];
    
    self.timeCount--;
    if(self.timeCount < 0){
        
        NSString *text = @"获取验证码";
        NSDictionary *attribtDic = @{NSUnderlineStyleAttributeName: [NSNumber numberWithInteger:NSUnderlineStyleSingle],NSUnderlineColorAttributeName:[UIColor whiteColor]};

        NSMutableAttributedString *attribtStr = [[NSMutableAttributedString alloc]initWithString:text attributes:attribtDic];
        self.passwordTF2.codeLbl.attributedText = attribtStr;
        self.passwordTF2.codeLbl.textColor = [UIColor colorWithHexString:@"31B14E"];
        
        self.passwordTF2.codeLbl.enabled = YES;
        [time invalidate];
    }
}

- (void)closeBtnAction
{
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
        _titleLbl.text = @"找回密码";
        _titleLbl.font = [UIFont boldSystemFontOfSize:18];
        _titleLbl.textAlignment = NSTextAlignmentCenter;
    }
    return _titleLbl;
}

- (RXTextField *)passwordTF1
{
    if (!_passwordTF1) {
        NSString *placeStr = @"";
        UIKeyboardType keyboardType = UIKeyboardTypeDefault;
        if (self.type == GetBackPasswordType_code) {
            placeStr = @"请输入手机号";
            keyboardType = UIKeyboardTypeNumbersAndPunctuation;
        } else {
            placeStr = @"设置新密码";
        }
        
        _passwordTF1 = [[RXTextField alloc] initWithPlaceholder:placeStr type:TFType_clear keyboardType:keyboardType];
        if (self.type == GetBackPasswordType_default) {
            _passwordTF1.tf.secureTextEntry = YES;
        }
        _passwordTF1.tf.delegate = self;
    }
    return _passwordTF1;
}

- (RXTextField *)passwordTF2
{
    if (!_passwordTF2) {
        NSString *placeStr = @"";
        UIKeyboardType keyboardType = UIKeyboardTypeDefault;
        TFType tfType = TFType_code;
        if (self.type == GetBackPasswordType_code) {
            placeStr = @"请输入验证码";
            keyboardType = UIKeyboardTypeNumbersAndPunctuation;
        } else {
            placeStr = @"确认新密码";
            tfType = TFType_clear;
        }
        
        _passwordTF2 = [[RXTextField alloc] initWithPlaceholder:placeStr type:tfType keyboardType:keyboardType];
        if (self.type == GetBackPasswordType_default) {
            _passwordTF2.tf.secureTextEntry = YES;
        }
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
            titleStr = @"完成";
        }
        
        _confirmBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        _confirmBtn.userInteractionEnabled = NO;
        [_confirmBtn setBackgroundImage:[UIImage bundleImageNamed:@"btnBg_unSelect"] forState:UIControlStateNormal];
        [_confirmBtn setTitle:titleStr forState:UIControlStateNormal];
        [_confirmBtn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
        _confirmBtn.titleLabel.font = [UIFont systemFontOfSize:16];
        [_confirmBtn addTarget:self action:@selector(confimBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _confirmBtn;
}

- (UIButton *)closeBtn
{
    if (!_closeBtn) {
        _closeBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        NSString *imageStr = @"";
        if (self.type == GetBackPasswordType_code) {
            imageStr = @"close";
        } else {
            imageStr = @"leftBack";
        }
        [_closeBtn setImage:[UIImage bundleImageNamed:imageStr] forState:UIControlStateNormal];
        [_closeBtn addTarget:self action:@selector(closeBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _closeBtn;
}

@end
