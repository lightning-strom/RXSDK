//
//  ApproveView.m
//  RXSDK
//
//  Created by 陈汉 on 2021/9/26.
//

#import "RXApproveView.h"
#import "RXCommonTool.h"

@interface RXApproveView () <UITextFieldDelegate>

@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) UILabel *titleLbl;
@property (nonatomic, strong) UILabel *desLbl;
@property (nonatomic, strong) RXTextField *nameTF;
@property (nonatomic, strong) RXTextField *cardTF;
@property (nonatomic, strong) UIButton *confirmBtn;
@property (nonatomic, strong) UIButton *closeBtn;
@property (nonatomic, assign) NSInteger orientation;  // 屏幕方向 1竖屏 2横屏
@property (nonatomic, copy) ApproveBlock block;

@end

@implementation RXApproveView

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (instancetype)initWithComplete:(ApproveBlock)block
{   
    self = [super initWithFrame:CGRectMake(0, 0, [UIApplication sharedApplication].keyWindow.frame.size.width, [UIApplication sharedApplication].keyWindow.frame.size.height)];
    if (self) {
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
        [[UIApplication sharedApplication].keyWindow addSubview:self];
        
        self.orientation = [RXCommonTool getInterfaceOrientation];
        self.block = block;
        
        [self setUI];
        [self show];
        [self addNotifications];
        
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
        CGFloat bgH = self.orientation == 2 ? 300 : 266;
        self.bgView.sd_layout.topSpaceToView(self, window.frame.size.height / 2 - bgH / 2);
        [self layoutSubviews];
    }];
}

- (void)show
{
    [UIView animateWithDuration:0.15 animations:^{
        UIView *window = [UIApplication sharedApplication].keyWindow;
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.6];

        self.bgView.sd_layout.bottomSpaceToView(self, window.frame.size.height / 2 - 268 / 2);
        [self layoutSubviews];
    }];
}

- (void)hide
{
    [UIView animateWithDuration:0.15 animations:^{
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
        self.bgView.sd_layout.bottomSpaceToView(self, -268);
        [self layoutSubviews];
    }];
    
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.15 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        [self removeFromSuperview];
    });
}

#pragma mark -- <setUI>
- (void)setUI
{
    [self sd_addSubviews:@[self.bgView]];
    [self.bgView sd_addSubviews:@[self.titleLbl, self.desLbl, self.nameTF, self.cardTF, self.confirmBtn, self.closeBtn]];
    
    [self layoutViews];
}

- (void)layoutViews
{
    UIView *window = [UIApplication sharedApplication].keyWindow;
    
    CGFloat bgW = 335;
    CGFloat bgH = 268;
    
    _bgView.sd_layout.centerXEqualToView(window)
    .bottomSpaceToView(self, -268)
    .widthIs(bgW)
    .heightIs(bgH);
    
    _titleLbl.sd_layout.topSpaceToView(self.bgView, 10)
    .leftSpaceToView(self.bgView, 0)
    .rightSpaceToView(self.bgView, 0)
    .heightIs(25);
    
    _desLbl.sd_layout.topSpaceToView(self.titleLbl, 12)
    .leftSpaceToView(self.bgView, 20)
    .rightSpaceToView(self.bgView, 20)
    .heightIs(36);
    
    _nameTF.sd_layout.topSpaceToView(self.desLbl, 12)
    .leftEqualToView(self.desLbl)
    .rightEqualToView(self.desLbl)
    .heightIs(40);
    
    _cardTF.sd_layout.topSpaceToView(self.nameTF, 10)
    .leftEqualToView(self.nameTF)
    .rightEqualToView(self.nameTF)
    .heightIs(40);
    
    _confirmBtn.sd_layout.topSpaceToView(self.cardTF, 16)
    .centerXEqualToView(self.nameTF)
    .widthIs(142)
    .heightIs(40);
    
    _closeBtn.sd_layout.topEqualToView(self.titleLbl)
    .rightSpaceToView(self.bgView, 10)
    .widthIs(16)
    .heightEqualToWidth();
    
    [self layoutSubviews];
}

#pragma mark -- <UITextFieldDelegate>
- (void)textFieldDidBeginEditing:(UITextField *)textField {
    if (textField == _nameTF.tf) {
        _nameTF.clearBtn.hidden = NO;
        _cardTF.clearBtn.hidden = YES;
    } else {
        _nameTF.clearBtn.hidden = YES;
        _cardTF.clearBtn.hidden = NO;
    }
}

- (void)textFieldDidEndEditing:(UITextField *)textField {
    _nameTF.clearBtn.hidden = YES;
    _cardTF.clearBtn.hidden = YES;
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
        if (textField == _nameTF.tf) {
            _nameTF.placeholderLbl.hidden = YES;
        }
        if (textField == _cardTF.tf) {
            _cardTF.placeholderLbl.hidden = YES;
        }
    } else {
        if (textField == _nameTF.tf) {
            _nameTF.placeholderLbl.hidden = NO;
        }
        if (textField == _cardTF.tf) {
            _cardTF.placeholderLbl.hidden = NO;
        }
    }
    
    if (_nameTF.placeholderLbl.hidden && _cardTF.placeholderLbl.hidden) {
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
    if (_nameTF.tf.text.length <= 0) {
        [SVProgressHUD showInfoWithStatus:@"姓名不能为空"];
        return;
    } else if (_cardTF.tf.text.length <= 0) {
        [SVProgressHUD showInfoWithStatus:@"身份证号不能为空"];
        return;
    }
    
    [[RXCommonNetworkExcuteManager commonRequestClient] beginRequest:[RXApiManager approveWithRealName:self.nameTF.tf.text idCard:self.cardTF.tf.text] success:^(id  _Nullable responseObject) {
        NSLog(@"实名认证成功：\n%@", responseObject);
        [SVProgressHUD showSuccessWithStatus:@"认证成功"];
        
        NSMutableDictionary *dic = [NSMutableDictionary dictionary];
        [dic setValue:self.nameTF.tf.text forKey:@"realname"];
        [dic setValue:self.cardTF.tf.text forKey:@"idcard"];
        
        if (self.block) {
            self.block(dic, nil);
        }
        [self hide];
    } failure:^(RXCommonRequestError * _Nullable error) {
        NSLog(@"实名认证失败：\n%@", error.error);
        [SVProgressHUD showErrorWithStatus:@"认证失败"];
        
        if (self.block) {
            self.block(nil, error.error);
        }
    }];
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
        _titleLbl.text = @"游戏实名认证";
        _titleLbl.font = [UIFont boldSystemFontOfSize:18];
        _titleLbl.textAlignment = NSTextAlignmentCenter;
    }
    return _titleLbl;
}

- (UILabel *)desLbl
{
    if (!_desLbl) {
        _desLbl = [[UILabel alloc] init];
        _desLbl.text = @"根据国家最新法规规定，未实名认证的用户不能体验任何游戏内容，请尽快完成实名。";
        _desLbl.numberOfLines = 2;
        _desLbl.textColor = [UIColor colorWithHexString:@"626262"];
        _desLbl.font = [UIFont systemFontOfSize:14];
    }
    return _desLbl;
}

- (RXTextField *)nameTF
{
    if (!_nameTF) {
        _nameTF = [[RXTextField alloc] initWithPlaceholder:@"请输入真实姓名" type:TFType_clear keyboardType:UIKeyboardTypeDefault];
        _nameTF.tf.delegate = self;
    }
    return _nameTF;
}

- (RXTextField *)cardTF
{
    if (!_cardTF) {
        _cardTF = [[RXTextField alloc] initWithPlaceholder:@"请输入身份证号" type:TFType_clear keyboardType:UIKeyboardTypeNumbersAndPunctuation];
        _cardTF.tf.delegate = self;
    }
    return _cardTF;
}

- (UIButton *)confirmBtn
{
    if (!_confirmBtn) {
        _confirmBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        _confirmBtn.userInteractionEnabled = NO;
        [_confirmBtn setBackgroundImage:[UIImage bundleImageNamed:@"btnBg_unSelect"] forState:UIControlStateNormal];
        [_confirmBtn setTitle:@"确认提交" forState:UIControlStateNormal];
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
        [_closeBtn setImage:[UIImage imageNamed:@"close"] forState:UIControlStateNormal];
        _closeBtn.hidden = YES;
    }
    return _closeBtn;
}

@end
