//
//  ApproveView.m
//  RXSDK
//
//  Created by 陈汉 on 2021/9/26.
//

#import "RXOSApproveView.h"
#import "RXOSCommonTool.h"
#import "UIView+RXOSShade.h"
#import "RXOSCommonView.h"
#import "RXOSCloseBtn.h"

typedef void(^RXUIRequestComplete)(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error);

@interface RXOSApproveView () <UITextFieldDelegate>

@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) UILabel *titleLbl;
@property (nonatomic, strong) UILabel *desLbl;
@property (nonatomic, strong) RXOSTextField *nameTF;
@property (nonatomic, strong) RXOSTextField *cardTF;
@property (nonatomic, strong) UIButton *confirmBtn;
@property (nonatomic, strong) RXOSCloseBtn *closeBtn;
@property (nonatomic, assign) NSInteger orientation;  // 屏幕方向 1竖屏 2横屏
@property (nonatomic, copy) RXUIRequestComplete block;
@property (nonatomic, assign) BOOL canClose;

@end

@implementation RXOSApproveView

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (instancetype)initWithCanColose:(BOOL)canClose
                         complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))block
{   
    self = [super initWithFrame:CGRectMake(0, 0, [UIApplication sharedApplication].keyWindow.frame.size.width, [UIApplication sharedApplication].keyWindow.frame.size.height)];
    if (self) {
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
        [[UIApplication sharedApplication].keyWindow addSubview:self];
        
        self.orientation = [RXOSCommonTool getInterfaceOrientation];
        self.block = block;
        self.canClose = canClose;
        
//        RXUCommonView *successV = [[RXUCommonView alloc] initWithDesStr:@"实名认证成功" title:@"实名认证" image:@"rx_success" complete:^{
//
//        }];
        
        [self setUI];
        
        [self show];
        [self addNotifications];
        
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
}

- (void)hide
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    [self removeFromSuperview];
    
}

#pragma mark -- <setUI>
- (void)setUI
{    
    [self addSubview:self.bgView];
    [self.bgView addSubview:self.titleLbl];
    [self.bgView addSubview:self.desLbl];
    [self.bgView addSubview:self.nameTF];
    [self.bgView addSubview:self.cardTF];
    [self.bgView addSubview:self.confirmBtn];
    [self.bgView addSubview:self.closeBtn];
    
    [self layoutViews];
}

- (void)layoutViews
{
    UIView *window = [UIApplication sharedApplication].keyWindow;
    
    CGFloat bgW = [RXOSCommonTool getScreenWidth];
    CGFloat bgH = RXAC ? 302 : 334;

    _bgView.frame = CGRectMake(0, CGRectGetHeight(window.frame), bgW, bgH);
//    _bgView.centerX = window.centerX;
    _bgView.center = window.center;
    
    _titleLbl.frame = CGRectMake(0, 21, CGRectGetWidth(_bgView.frame), 24);
    
    _desLbl.frame = CGRectMake(RXAC ? 29 : 25, CGRectGetMaxY(_titleLbl.frame) + 14, CGRectGetWidth(_bgView.frame) - (RXAC ? 58 : 50), 42);
    
    _nameTF.frame = CGRectMake(CGRectGetMinX(_desLbl.frame), CGRectGetMaxY(_desLbl.frame) + 14, CGRectGetWidth(_desLbl.frame), RXAC ? 36 : 46);
    
    _cardTF.frame = CGRectMake(CGRectGetMinX(_desLbl.frame), CGRectGetMaxY(_nameTF.frame) + (RXAC ? 14 : 14), CGRectGetWidth(_desLbl.frame), CGRectGetHeight(_nameTF.frame));
    
    _confirmBtn.frame = CGRectMake(CGRectGetMinX(_desLbl.frame), CGRectGetMaxY(_cardTF.frame) + (RXAC ? 24 : 37), CGRectGetWidth(_desLbl.frame), RXAC ? 43 : 48);
    
    _closeBtn.frame = CGRectMake(bgW - (RXAC ? 28 + 25 : 28 + 21), 16, 28, 28);
    
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
        [_confirmBtn setBackgroundColor:[UIColor colorWithHexString:@"20C0B3"]];
    } else {
        _confirmBtn.userInteractionEnabled = NO;
        [_confirmBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
    }
    
    return YES;
}

#pragma mark -- <actions>
- (void)confimBtnAction
{
    if (_nameTF.tf.text.length <= 0) {
        [RXOSHUD showErrorText:@"姓名不能为空"];
        return;
    } else if (_cardTF.tf.text.length <= 0) {
        [RXOSHUD showErrorText:@"身份证号不能为空"];
        return;
    }
    
    [[RXApiService sharedSDK] approveWithRealName:self.nameTF.tf.text idCard:self.cardTF.tf.text isFastAuth:NO complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (error) {
            NSLog(@"实名认证失败：\n%@", error.error);
            NSString *errorMsg = error.responesObject[@"msg"];
            if (errorMsg.length <= 0) {
                errorMsg = @"认证失败";
            }
            [RXOSHUD showErrorText:errorMsg];
            
            if (self.block) {
                self.block(nil, error);
            }
        } else {
            NSLog(@"实名认证成功：\n%@", response);
//            [SVProgressHUD showSuccessWithStatus:@"认证成功"];
            
            NSMutableDictionary *dic = [NSMutableDictionary dictionaryWithDictionary:response[@"data"]];
            [dic setValue:self.nameTF.tf.text forKey:@"realname"];
            [dic setValue:self.cardTF.tf.text forKey:@"idcard"];
            
            RXOSCommonView *successV = [[RXOSCommonView alloc] initWithDesStr:@"实名认证成功" title:@"实名认证" image:@"rx_success" complete:^{
                if (self.block) {
                    self.block(dic, nil);
                }
            }];
            
            // 实名后修改位运算，attr第一位改为1
            NSMutableDictionary *loginData = [NSMutableDictionary dictionaryWithDictionary:[RXOSUserUtility sharedManager].loginData];
            int attr = [loginData[@"attr"] intValue];
            attr = attr | 1;
            
            [loginData setValue:@(attr) forKey:@"attr"];
            
            [loginData setValue:@([response[@"aas"] integerValue]) forKey:@"aas"];
            
            int flag = [loginData[@"flag"] intValue];
            BOOL limit = [response[@"limit"] boolValue];
            if (limit) {
                flag = flag | 2;
            } else {
                flag = flag & ~(1 << 1);
            }
            
            [loginData setValue:@(flag) forKey:@"flag"];
            
            [RXOSUserUtility sharedManager].loginData = loginData;
            
            [self hide];
        }
    }];
}

- (void)closeBtnAction:(UIButton *)btn
{
    RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
    
    NSString *errorMsg = [RXErrorTool getRXErrorMsg:RXLimitError_closeView];
    err.responesObject = @{@"msg" : errorMsg,
                           @"code" : @(RXLimitError_closeView)
    };
    
    if (self.block) {
        self.block(nil, err);
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
        _bgView.layer.cornerRadius = 6;
    }
    return _bgView;
}

- (UILabel *)titleLbl
{
    if (!_titleLbl) {
        _titleLbl = [[UILabel alloc] init];
        _titleLbl.text = @"实名认证";
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
        _desLbl.text = @"根据国家最新法规规定，未实名认证的用户不能体验任何游戏内容，请尽快完成实名认证。";
        _desLbl.textColor = [UIColor blackColor];
        _desLbl.numberOfLines = 0;
        _desLbl.font = [UIFont systemFontOfSize:15 weight:UIFontWeightRegular];
    }
    return _desLbl;
}

- (RXOSTextField *)nameTF
{
    if (!_nameTF) {
        _nameTF = [[RXOSTextField alloc] initWithPlaceholder:@"请输入真实姓名" type:TFType_clear keyboardType:UIKeyboardTypeDefault];
        _nameTF.tf.delegate = self;
    }
    return _nameTF;
}

- (RXOSTextField *)cardTF
{
    if (!_cardTF) {
        _cardTF = [[RXOSTextField alloc] initWithPlaceholder:@"请输入身份证号" type:TFType_clear keyboardType:UIKeyboardTypeNumbersAndPunctuation];
        _cardTF.tf.delegate = self;
    }
    return _cardTF;
}

- (UIButton *)confirmBtn
{
    if (!_confirmBtn) {
        _confirmBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        _confirmBtn.userInteractionEnabled = NO;
        [_confirmBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
        [_confirmBtn setTitle:[RXLocation osLaunguage:@"确认提交"] forState:UIControlStateNormal];
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
        _closeBtn.hidden = !self.canClose;
        [_closeBtn addTarget:self action:@selector(closeBtnAction:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _closeBtn;
}

@end
