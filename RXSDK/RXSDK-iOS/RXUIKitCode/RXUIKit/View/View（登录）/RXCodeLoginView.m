//
//  RXCodeLoginView.m
//  RXUIKit
//
//  Created by 陈汉 on 2023/2/6.
//

#import "RXCodeLoginView.h"
#import "RXUICommonTool.h"
#import "WLUnitField.h"
#import "RXLoginViewManager.h"

@interface RXCodeLoginView () <WLUnitFieldDelegate>

@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) UILabel *titleLbl;
@property (nonatomic, strong) UILabel *tipLbl;
@property (nonatomic, strong) UIButton *closeBtn;
@property (nonatomic, strong) UIButton *backBtn;
@property (nonatomic, assign) NSInteger orientation;  // 屏幕方向 1竖屏 2横屏
@property (nonatomic, strong) NSString *account;
@property (nonatomic, strong) WLUnitField *codeTf;
@property (nonatomic, strong) UILabel *timeLbl;
@property (nonatomic, strong) UIButton *resendBtn;
@property (nonatomic, strong) NSTimer *timer;
@property (nonatomic, assign) NSInteger timeInterval;

@end

@implementation RXCodeLoginView

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (instancetype)initWithAccount:(NSString *)account
{
    self = [super initWithFrame:CGRectMake(0, 0, [UIApplication sharedApplication].keyWindow.frame.size.width, [UIApplication sharedApplication].keyWindow.frame.size.height)];
    if (self) {
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
        [[UIApplication sharedApplication].keyWindow addSubview:self];
        
        self.orientation = [RXUICommonTool getInterfaceOrientation];
        self.account = account;
        self.timeInterval = 60;
        
        [self setUI];
        
        [self show];
        
        [self addMTimer];
        
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(loginCallBack:) name:noti_rxLogin object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyBoardWillShow:) name:UIKeyboardWillShowNotification object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyBoardWillHide:) name:UIKeyboardWillHideNotification object:nil];
        
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

#pragma mark -- <notifications>
- (void)keyBoardWillShow:(NSNotification *)notification
{
    NSDictionary *userInfo = [notification userInfo];
    NSValue *value = [userInfo objectForKey:UIKeyboardFrameEndUserInfoKey];
    NSNumber *duration = [userInfo objectForKey:UIKeyboardAnimationDurationUserInfoKey];
    
    [UIView animateWithDuration:duration.doubleValue animations:^{
        UIView *window = [UIApplication sharedApplication].keyWindow;
        CGFloat bgH = 206;
        self.bgView.center = CGPointMake(window.center.x, window.frame.size.height / 2 - bgH / 2 + 30);
//        self.bgView.frame = CGRectMake(0, window.frame.size.height / 2 - bgH / 2 - 35, 335, 232);

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
    [self.bgView addSubview:self.tipLbl];
//    [self.bgView addSubview:self.timeLbl];
    [self.bgView addSubview:self.resendBtn];
    [self.bgView addSubview:self.codeTf];
    [self.bgView addSubview:self.backBtn];
    
    [self layoutViews];
}

- (void)layoutViews
{
    
    UIView *window = [UIApplication sharedApplication].keyWindow;
    
    _bgView.frame = CGRectMake(0, 0, [RXUICommonTool getScreenWidth], RXAC ? 253 : 244);
    _bgView.center = window.center;
    
    _titleLbl.frame = CGRectMake(0, 24, CGRectGetWidth(_bgView.frame), 26);
    
    _tipLbl.frame = CGRectMake(0, CGRectGetMaxY(_titleLbl.frame) + 24, [RXUICommonTool getScreenWidth], 20);
    
    _codeTf.frame = CGRectMake(RXAC ? 69 : 33, CGRectGetMaxY(_tipLbl.frame) + (RXAC ? 32 : 26), RXAC ? CGRectGetWidth(_bgView.frame) - 138 : CGRectGetWidth(_bgView.frame) - 66, 54);
    
//    _timeLbl.frame = CGRectMake(62, CGRectGetMaxY(_codeTf.frame) + 11, 110, 20);
    
    _resendBtn.frame = CGRectMake(RXAC ? 248 : 194, CGRectGetMaxY(_codeTf.frame) + 22, 170, 20);
        
    _closeBtn.frame = CGRectMake(RXAC ? 405 : 322, 24, 26, 26);
    
    _backBtn.frame = CGRectMake(30, 24, 26, 26);
    
//    _backBtn.sd_layout.topSpaceToView(self.bgView, 14)
//    .leftSpaceToView(self.bgView, 12)
//    .widthIs(15)
//    .heightEqualToWidth();
    
//    NSArray *imageArr = @[@"login_w", @"login_auth", @"login_user", @"login_apple"];
    
    [self layoutSubviews];
    
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.2 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        [self.codeTf becomeFirstResponder];
    });
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
    [self closeTime];
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    [self removeFromSuperview];
    
}

#pragma mark -- <notifications>
- (void)loginCallBack:(NSNotification *)noti
{
    NSMutableDictionary *notiDic = [NSMutableDictionary dictionaryWithDictionary:noti.userInfo];

    NSDictionary *loginModel = notiDic[@"data"];
    NSInteger code = [loginModel[@"code"] integerValue];
    NSString *tipString = loginModel[@"msg"];
    
    if (loginModel && code == 0) {
        [self hide];
    } else {
        [RXHUD showErrorText:tipString];
    }
}

#pragma mark - <WLUnitFieldDelegate>
- (void)editFinished:(NSString *)string
{
    [self.codeTf endEditing:YES];
    NSDictionary *loginExt = [NSDictionary dictionary];
    if (self.loginTypeBlock) {
        loginExt = self.loginTypeBlock(loginExt, LoginTypeCapCode);
        NSMutableDictionary *loginInfo = [NSMutableDictionary dictionaryWithDictionary:loginExt];
        [loginInfo setValue:self.account forKey:@"username"];
        
        NSMutableDictionary *extDic = [NSMutableDictionary dictionary];
        for (int i = 0; i < loginInfo.allKeys.count; i++) {
            if ([loginInfo.allKeys[i] isEqualToString:@"ext"]) {
                extDic = [NSMutableDictionary dictionaryWithDictionary:loginInfo.allValues[i]];
            }
        }
        [extDic setValue:self.codeTf.text forKey:@"captcha_code"];
        [loginInfo setValue:extDic forKey:@"ext"];
        
        CaptchaType captchaType = CaptchaType_phone;
        if ([RXUICommonTool validateEmail:self.account]) {
            captchaType = CaptchaType_email;
        }
        [RXHUD showHUD];
        [[RXApiService sharedSDK] verifyCaptchaCodeWithType:captchaType target:self.account purpose:@"login" captcha_code:self.codeTf.text complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
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
    }
}

- (BOOL)unitField:(WLUnitField *)uniField shouldChangeCharactersInRange:(NSRange)range replacementString:(NSString *)string
{
    NSLog(@"");
    return YES;
}

#pragma mark -- timer
-(void)addMTimer
{
    if (!_timer) {
        _timer = [NSTimer timerWithTimeInterval:1 target:self selector:@selector(timerAction) userInfo:nil repeats:YES];
        [[NSRunLoop mainRunLoop] addTimer:_timer forMode:NSRunLoopCommonModes];
        [_timer fire];
    }
}

- (void)closeTime
{
    if (self.timer.isValid) {
        [self.timer invalidate];
        self.timer = nil;
    }
}

#pragma mark -- <actions>
- (void)timerAction
{
    if (self.timeInterval <= 0) {
        [self closeTime];
        self.timeInterval = 60;
        [self.resendBtn setTitle:@"重新发送验证码" forState:UIControlStateNormal];
        self.resendBtn.userInteractionEnabled = YES;
        [self.resendBtn setTitleColor:[UIColor colorWithHexString:@"#25B2A6"] forState:UIControlStateNormal];
        return;
    }
    NSString *timerStr = [NSString stringWithFormat:@"%ds后可重新发送", self.timeInterval];
    [self.resendBtn setTitle:timerStr forState:UIControlStateNormal];
    [self.resendBtn setTitleColor:[UIColor colorWithHexString:@"#A3A3A3"] forState:UIControlStateNormal];
    self.timeInterval--;
}

- (NSString *)fetchAccount
{
    if (self.account && self.account.length >= 11) {
        NSString *replaceStr = self.account;
        NSInteger startLocation = 3;
        for (int i = 0; i < 4; i++) {
            NSRange range = NSMakeRange(startLocation, 1);
            
            replaceStr = [replaceStr stringByReplacingCharactersInRange:range withString:@"*"];
            
            startLocation ++;
        }
        return replaceStr;
        
    } else return self.account;
}

- (void)resendBtnAction
{
    CaptchaType captchaType = CaptchaType_phone;
    if ([RXUICommonTool validateEmail:self.account]) {
        captchaType = CaptchaType_email;
    }
    
    [RXHUD showHUD];
    [[RXApiService sharedSDK] getCaptchaCodeWithType:captchaType target:self.account purpose:@"login" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (!error) {
            [RXHUD hideHUD];
            [self addMTimer];
        } else {
            [RXHUD showErrorText:error.responesObject[@"msg"]];
        }
    }];
}

- (void)tapAction:(UITapGestureRecognizer *)tap
{
    [self.codeTf endEditing:YES];
}

#pragma mark -- <lazy>
- (UIView *)bgView
{
    if (!_bgView) {
        _bgView = [[UIView alloc] init];
        _bgView.backgroundColor = [UIColor whiteColor];
        _bgView.layer.cornerRadius = 6;
    }
    return _bgView;
}

- (UILabel *)titleLbl
{
    if (!_titleLbl) {
        _titleLbl = [[UILabel alloc] init];
        _titleLbl.text = @"请输入验证码";
        _titleLbl.textColor = [UIColor blackColor];
        _titleLbl.font = [UIFont systemFontOfSize:16];
        _titleLbl.textAlignment = NSTextAlignmentCenter;
    }
    return _titleLbl;
}

- (UILabel *)tipLbl
{
    if (!_tipLbl) {
        _tipLbl = [[UILabel alloc] init];
        _tipLbl.text = [NSString stringWithFormat:@"验证码已发送至%@", [self fetchAccount]];
        _tipLbl.font = [UIFont systemFontOfSize:16];
        _tipLbl.textAlignment = NSTextAlignmentCenter;
    }
    return _tipLbl;
}

- (WLUnitField *)codeTf
{
    if (!_codeTf) {
        _codeTf = [[WLUnitField alloc] initWithStyle:WLUnitFieldStyleBorder inputUnitCount:4];
        _codeTf.unitSpace = RXAC ? 36 : 28;
        _codeTf.borderRadius = 6;
        _codeTf.unitSize = CGSizeMake(54, 54);
        _codeTf.textColor = [UIColor colorWithHexString:@"#064E48"];
        _codeTf.tintColor = [UIColor colorWithHexString:@"#20C0B3"];
        _codeTf.cursorColor = [UIColor colorWithHexString:@"#20C0B3"];
        _codeTf.trackTintColor = [UIColor colorWithHexString:@"#20C0B3"];
        _codeTf.delegate = self;
        [_codeTf sizeToFit];
    }
    return _codeTf;
}

- (UILabel *)timeLbl
{
    if (!_timeLbl) {
        _timeLbl = [[UILabel alloc] init];
        _timeLbl.text = @"60s后可重新发送";
        _timeLbl.textColor = [UIColor colorWithHexString:@"#A3A3A3"];
        _timeLbl.font = [UIFont systemFontOfSize:14];
    }
    return _timeLbl;
}

- (UIButton *)resendBtn
{
    if (!_resendBtn) {
        _resendBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_resendBtn setTitle:@"60s后可重新发送" forState:UIControlStateNormal];
        [_resendBtn setTitleColor:[UIColor colorWithHexString:@"#25B2A6"] forState:UIControlStateNormal];
        _resendBtn.titleLabel.font = [UIFont systemFontOfSize:16];
        _resendBtn.titleLabel.textAlignment = NSTextAlignmentRight;
        _resendBtn.userInteractionEnabled = NO;
        [_resendBtn addTarget:self action:@selector(resendBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _resendBtn;
}

- (UIButton *)closeBtn
{
    if (!_closeBtn) {
        _closeBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        _closeBtn.adjustsImageWhenHighlighted = NO;
        [_closeBtn setImage:[UIImage rxBundleImageNamed:@"rx_close"] forState:UIControlStateNormal];
        [_closeBtn addTarget:self action:@selector(hide) forControlEvents:UIControlEventTouchUpInside];
        _closeBtn.hidden = YES;
    }
    return _closeBtn;
}

- (UIButton *)backBtn
{
    if (!_backBtn) {
        _backBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_backBtn setImage:[UIImage rxBundleImageNamed:@"rx_back"] forState:UIControlStateNormal];
        [_backBtn addTarget:self action:@selector(hide) forControlEvents:UIControlEventTouchUpInside];
        if ([RXUIUserUtility sharedManager].accounts.count > 0) {
            _backBtn.hidden = NO;
        } else {
            _backBtn.hidden = YES;
        }
    }
    return _backBtn;
}

@end
