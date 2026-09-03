//
//  RXAddLoginView.m
//  RXSDK
//
//  Created by 陈汉 on 2021/9/29.
//

#import "RXAddLoginView.h"
#import "RXUICommonTool.h"
#import "RXAttributeLabel.h"
#import "RXPrivacyView.h"
#import "RXRegistView.h"
#import "RXGetBackPasswordView.h"

@interface RXAddLoginView () <RXAttributeLabelDelegate, UITextFieldDelegate>

@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) UILabel *titleLbl;
@property (nonatomic, strong) RXTextField *accountTF;
@property (nonatomic, strong) RXTextField *passwordTF;
@property (nonatomic, strong) UIButton *confirmBtn;
@property (nonatomic, strong) UIButton *registBtn;
@property (nonatomic, strong) UIButton *forgetBtn;
@property (nonatomic, strong) UIButton *selectBtn;
@property (nonatomic, strong) UIButton *closeBtn;
@property (nonatomic, strong) RXAttributeLabel *priLbl;
@property (nonatomic, assign) NSInteger orientation;  // 屏幕方向 1竖屏 2横屏
@property (nonatomic, assign) BOOL isShow;
@property (nonatomic, copy) RegistCallBack block;
@property (nonatomic, assign) BOOL needHide;
@property (nonatomic, assign) BOOL isSelect;
@property (nonatomic, strong) NSMutableDictionary *extDic;

@end

@implementation RXAddLoginView

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (instancetype)initWithIsSelect:(BOOL)isSelect
                          extDic:(NSMutableDictionary * __nullable)extDic
                        complete:(void(^)(BOOL success, NSString *username, NSString *password))complete
{
    self = [super initWithFrame:CGRectMake(0, 0, [UIApplication sharedApplication].keyWindow.frame.size.width, [UIApplication sharedApplication].keyWindow.frame.size.height)];
    if (self) {
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
        [[UIApplication sharedApplication].keyWindow addSubview:self];
        
        self.orientation = [RXUICommonTool getInterfaceOrientation];
        self.block = complete;
        self.needHide = YES;
        self.isSelect = isSelect;
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
    self.isShow = YES;
    if (self.needHide) {
        [UIView animateWithDuration:0.1 animations:^{
            UIView *window = [UIApplication sharedApplication].keyWindow;
            self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.5];

//            self.bgView.sd_layout.bottomSpaceToView(self, window.frame.size.height / 2 - 278 / 2);
            [self layoutSubviews];
        }];
    } else {
        self.bgView.hidden = NO;
        [UIView animateWithDuration:0.1 animations:^{
            UIView *window = [UIApplication sharedApplication].keyWindow;
            self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.5];
            
//            self.bgView.sd_layout.bottomSpaceToView(self, window.frame.size.height / 2 - 278 / 2);
            [self layoutSubviews];
        }];
    }
}

- (void)hide
{
    self.isShow = NO;
    if (self.needHide) {
        [UIView animateWithDuration:0.1 animations:^{
            self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
//            self.bgView.sd_layout.bottomSpaceToView(self, -335);
            [self layoutSubviews];
        }];
        
        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.15 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
            [self removeFromSuperview];
        });
    } else {
        [UIView animateWithDuration:0.1 animations:^{
            self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
//            self.bgView.sd_layout.bottomSpaceToView(self, -335);
            [self layoutSubviews];
        }];
        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.15 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
            self.bgView.hidden = YES;
        });
    }
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
        CGFloat bgH = 278;
//        self.bgView.sd_layout.bottomSpaceToView(self, window.frame.size.height / 2 - bgH / 2 + 35);
        [self layoutSubviews];
    }];
}

- (void)keyBoardWillHide:(NSNotification *)notification
{
    NSDictionary *userInfo = [notification userInfo];
    NSNumber *duration = [userInfo objectForKey:UIKeyboardAnimationDurationUserInfoKey];
    
    [UIView animateWithDuration:duration.doubleValue animations:^{
        UIView *window = [UIApplication sharedApplication].keyWindow;
        CGFloat bgH = 278;
//        self.bgView.sd_layout.bottomSpaceToView(self, window.frame.size.height / 2 - bgH / 2);
        [self layoutSubviews];
    }];
}

#pragma mark -- <setUI>
- (void)setUI
{
//    [self sd_addSubviews:@[self.bgView]];
//    [self.bgView sd_addSubviews:@[self.titleLbl, self.accountTF, self.passwordTF, self.confirmBtn, self.registBtn, self.forgetBtn, self.selectBtn, self.priLbl, self.closeBtn]];
    
    [self layoutViews];
}

- (void)layoutViews
{
//    CGFloat selfY = 0;
//    if (!_isShow) {
//        selfY = [UIApplication sharedApplication].keyWindow.frame.size.height;
//    }
//    self.frame = CGRectMake(0, selfY, [UIApplication sharedApplication].keyWindow.frame.size.width, [UIApplication sharedApplication].keyWindow.frame.size.height);
    
    UIView *window = [UIApplication sharedApplication].keyWindow;
    
//    _bgView.sd_layout.bottomSpaceToView(self, -278)
//    .centerXEqualToView(window)
//    .widthIs(335)
//    .heightIs(278);
//    
//    _titleLbl.sd_layout.topSpaceToView(self.bgView, 24)
//    .leftSpaceToView(self.bgView, 0)
//    .rightSpaceToView(self.bgView, 0)
//    .heightIs(21);
//    
//    _accountTF.sd_layout.topSpaceToView(self.titleLbl, 15)
//    .leftSpaceToView(self.bgView, 20)
//    .rightSpaceToView(self.bgView, 20)
//    .heightIs(40);
//    
//    _passwordTF.sd_layout.topSpaceToView(self.accountTF, 8)
//    .leftSpaceToView(self.bgView, 20)
//    .rightSpaceToView(self.bgView, 20)
//    .heightIs(40);
//    
//    _forgetBtn.sd_layout.topSpaceToView(self.passwordTF, 8)
//    .rightEqualToView(self.passwordTF)
//    .widthIs(58)
//    .heightIs(13);
//    
//    _registBtn.sd_layout.topSpaceToView(self.passwordTF, 39)
//    .leftSpaceToView(self.bgView, 20)
//    .widthIs(143)
//    .heightIs(40);
//    
//    _confirmBtn.sd_layout.topEqualToView(self.registBtn)
//    .leftSpaceToView(self.registBtn, 10)
//    .widthIs(143)
//    .heightIs(40);
//    
//    _priLbl.sd_layout.topSpaceToView(self.registBtn, 20)
//    .leftSpaceToView(self.bgView, 50)
//    .widthIs(280)
//    .heightIs(14);
//    
//    _selectBtn.sd_layout.topSpaceToView(self.registBtn, 22)
//    .rightSpaceToView(self.priLbl, 3)
//    .widthIs(12)
//    .heightEqualToWidth();
//    
//    _closeBtn.sd_layout.topSpaceToView(self.bgView, 12)
//    .rightSpaceToView(self.bgView, 8)
//    .widthIs(30)
//    .heightEqualToWidth();
//    
    [self layoutSubviews];
}

#pragma mark -- <UITextFieldDelegate>
- (void)textFieldDidBeginEditing:(UITextField *)textField {
    if (textField == _accountTF.tf) {
        _accountTF.clearBtn.hidden = NO;
        _passwordTF.clearBtn.hidden = YES;
    } else {
        _accountTF.clearBtn.hidden = YES;
        _passwordTF.clearBtn.hidden = NO;
    }
}

- (void)textFieldDidEndEditing:(UITextField *)textField {
    _accountTF.clearBtn.hidden = YES;
    _passwordTF.clearBtn.hidden = YES;
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
        if (textField == _accountTF.tf) {
            _accountTF.placeholderLbl.hidden = YES;
        }
        if (textField == _passwordTF.tf) {
            _passwordTF.placeholderLbl.hidden = YES;
        }
    } else {
        if (textField == _accountTF.tf) {
            _accountTF.placeholderLbl.hidden = NO;
        }
        if (textField == _passwordTF.tf) {
            _passwordTF.placeholderLbl.hidden = NO;
        }
    }
    
    if (_accountTF.placeholderLbl.hidden && _passwordTF.placeholderLbl.hidden) {
        _confirmBtn.userInteractionEnabled = YES;
        [_confirmBtn setBackgroundImage:[UIImage rxBundleImageNamed:@"btnBg2"] forState:UIControlStateNormal];
    } else {
        _confirmBtn.userInteractionEnabled = NO;
        [_confirmBtn setBackgroundImage:[UIImage rxBundleImageNamed:@"btnBg_unSelect"] forState:UIControlStateNormal];
    }
    
    return YES;
}

#pragma mark -- <actions>
- (void)confimBtnAction
{
    [self endEditing:YES];
    if (_accountTF.tf.text.length <= 0) {
        [RXHUD showErrorText:@"用户名不能为空"];
        return;
    } else if (_passwordTF.tf.text.length <= 0) {
        [RXHUD showErrorText:@"密码不能为空"];
        return;
    } else if (!_selectBtn.isSelected) {
        [RXHUD showErrorText:@"请勾选同意用户隐私协议"];
        return;
    }
    
//    [RXUIUserUtility sharedManager].phone = self.accountTF.tf.text;
//    [RXUIUserUtility sharedManager].password = self.passwordTF.tf.text;
    
    
//    [RXLoginManager loginWithExtDic:self.extDic username:self.accountTF.tf.text password:self.passwordTF.tf.text loginOpenId:@"" loginType:LoginTypeAccount complete:^(NSDictionary * _Nonnull response, NSError * _Nonnull error) {
//                    [RXCommonTool saveAccountWithUsername:username password:password];
//    [RXUserUtility savePhone:username];
//    }];
}

#pragma mark -- <actions>
- (void)selectBtnAction:(UIButton *)btn
{
    btn.selected = !btn.selected;
    if (btn.isSelected) {
        [_selectBtn setImage:[UIImage rxBundleImageNamed:@"greenSelect"] forState:UIControlStateNormal];
    } else {
        [_selectBtn setImage:[UIImage rxBundleImageNamed:@"greenUnSelect"] forState:UIControlStateNormal];
    }
}

- (void)priTapAction:(UITapGestureRecognizer *)tap
{
//    RXPrivacyView *priView = [[RXPrivacyView alloc] initWithKey:@"00001"];
    [self endEditing:YES];
}

- (void)registAction
{
    RXRegistView *registView = [[RXRegistView alloc] initWithType:RegistViewType_regist extDic:self.extDic complete:self.block];
    [self endEditing:YES];
}

- (void)forgetBtnAction
{
    self.needHide = NO;
//    [self hide];
    RXGetBackPasswordView *getBackView = [[RXGetBackPasswordView alloc] initWithType:GetBackPasswordType_code phone:@"" code:@""];
    [self endEditing:YES];
}

- (void)closeBtnAction
{
    self.needHide = YES;
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
        _titleLbl.text = @"登录";
        _titleLbl.font = [UIFont boldSystemFontOfSize:18];
        _titleLbl.textAlignment = NSTextAlignmentCenter;
    }
    return _titleLbl;
}

- (RXTextField *)accountTF
{
    if (!_accountTF) {
        _accountTF = [[RXTextField alloc] initWithPlaceholder:@"请输入账号" type:TFType_clear keyboardType:UIKeyboardTypeNumbersAndPunctuation];
        _accountTF.tf.delegate = self;
        _accountTF.tf.returnKeyType = UIReturnKeyDone;
    }
    return _accountTF;
}

- (RXTextField *)passwordTF
{
    if (!_passwordTF) {
        _passwordTF = [[RXTextField alloc] initWithPlaceholder:@"请输入密码" type:TFType_clear keyboardType:UIKeyboardTypeDefault];
        _passwordTF.tf.secureTextEntry = YES;
        _passwordTF.tf.delegate = self;
    }
    return _passwordTF;
}

- (UIButton *)confirmBtn
{
    if (!_confirmBtn) {
        _confirmBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        _confirmBtn.userInteractionEnabled = NO;
        [_confirmBtn setBackgroundImage:[UIImage rxBundleImageNamed:@"btnBg_unSelect"] forState:UIControlStateNormal];
        [_confirmBtn setTitle:@"登录" forState:UIControlStateNormal];
        [_confirmBtn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
        _confirmBtn.titleLabel.font = [UIFont systemFontOfSize:16];
        [_confirmBtn addTarget:self action:@selector(confimBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _confirmBtn;
}

- (UIButton *)registBtn
{
    if (!_registBtn) {
        _registBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_registBtn setBackgroundImage:[UIImage rxBundleImageNamed:@"btnBg1"] forState:UIControlStateNormal];
        [_registBtn setTitle:@"注册" forState:UIControlStateNormal];
        [_registBtn setTitleColor:[UIColor colorWithHexString:@"31B14E"] forState:UIControlStateNormal];
        _registBtn.titleLabel.font = [UIFont systemFontOfSize:16];
        [_registBtn addTarget:self action:@selector(registAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _registBtn;
}

- (UIButton *)forgetBtn
{
    if (!_forgetBtn) {
        _forgetBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_forgetBtn setTitle:@"找回密码" forState:UIControlStateNormal];
        [_forgetBtn setTitleColor:[UIColor colorWithHexString:@"737373"] forState:UIControlStateNormal];
        _forgetBtn.titleLabel.font = [UIFont systemFontOfSize:12];
        [_forgetBtn addTarget:self action:@selector(forgetBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _forgetBtn;
}

- (UIButton *)selectBtn
{
    if (!_selectBtn) {
        _selectBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        _selectBtn.selected = self.isSelect;
        NSString *image = @"greenUnSelect";
        if (self.isSelect) {
            image = @"greenSelect";
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
        _priLbl.text = @"我已详细阅读并同意《用户协议与隐私政策》";
        _priLbl.textColor = [UIColor colorWithHexString:@"737373"];
        _priLbl.backgroundColor = [UIColor clearColor];
        _priLbl.font = [UIFont systemFontOfSize:12];
        _priLbl.userInteractionEnabled = YES;
        UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(priTapAction:)];
        [_priLbl addGestureRecognizer:tap];
    }
    return _priLbl;
}

- (UIButton *)closeBtn
{
    if (!_closeBtn) {
        _closeBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_closeBtn setImage:[UIImage rxBundleImageNamed:@"close"] forState:UIControlStateNormal];
        [_closeBtn addTarget:self action:@selector(closeBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _closeBtn;
}

@end
