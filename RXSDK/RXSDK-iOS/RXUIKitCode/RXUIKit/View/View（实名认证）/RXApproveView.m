//
//  ApproveView.m
//  RXSDK
//
//  Created by 陈汉 on 2021/9/26.
//

#import "RXApproveView.h"
#import "RXUICommonTool.h"
#import "UIView+RXShade.h"
#import "RXUCommonView.h"
#import "RXCloseBtn.h"
#import "RXApproveRewardView.h"

typedef void(^RXUIRequestComplete)(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error);

@interface RXApproveView () <UITextFieldDelegate, RXKeyboardPanelDelegate>

@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) UILabel *titleLbl;
@property (nonatomic, strong) UILabel *desLbl;
@property (nonatomic, strong) RXTextField *nameTF;
@property (nonatomic, strong) RXTextField *cardTF;
@property (nonatomic, strong) UIButton *confirmBtn;
@property (nonatomic, strong) UIButton *aliAuthBtn;
@property (nonatomic, strong) UIButton *manualAuthBtn;
@property (nonatomic, strong) RXCloseBtn *closeBtn;
@property (nonatomic, strong) RXCloseBtn *backBtn;
@property (nonatomic, strong) RXApproveRewardView *rewardView;
@property (nonatomic, assign) NSInteger orientation;  // 屏幕方向 1竖屏 2横屏
@property (nonatomic, copy) RXUIRequestComplete block;
@property (nonatomic, assign) BOOL canClose;
@property (nonatomic, strong) NSDictionary *loginData;
@property (nonatomic, strong) NSString *nameStr;
@property (nonatomic, strong) NSString *cardStr;
@property (nonatomic, strong) RXKeyboardPanel *keyboardPanel;
@property (nonatomic, assign) BOOL isCardTFShow;
@property (nonatomic, assign) BOOL isCardTFEdit;
@property (nonatomic, assign) BOOL isFastAuth;
@property (nonatomic, assign) BOOL isUseFastAuth;
@property (nonatomic, assign) BOOL isManualAuthMode;
@property (nonatomic, assign) BOOL didSetupManualAuthData;
@property (nonatomic, assign) BOOL isWaitingIIFAAResult;
@property (nonatomic, assign) BOOL iifaaVisible;
@property (nonatomic, assign) BOOL isManualAuthFromSelection;

@end

@implementation RXApproveView

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
    
        self.orientation = [RXUICommonTool getInterfaceOrientation];
        self.block = block;
        self.canClose = canClose;
        
        self.isUseFastAuth = [RXService sharedSDK].isUseFastAuth;
        self.iifaaVisible = [self fetchIIFAAVisible];
        self.isManualAuthMode = !self.iifaaVisible;
        
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
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(applicationWillEnterForeground) name:UIApplicationWillEnterForegroundNotification object:nil];
}

#pragma mark -- <notifications>
- (void)keyBoardWillShow:(NSNotification *)notification
{
//    if (self.keyboardPanel && self.isCardTFShow) {
//        [self.keyboardPanel hide];
//    }
    if (!RXAC) return;
    NSDictionary *userInfo = [notification userInfo];
    NSValue *value = [userInfo objectForKey:UIKeyboardFrameEndUserInfoKey];
    NSNumber *duration = [userInfo objectForKey:UIKeyboardAnimationDurationUserInfoKey];
    
    [UIView animateWithDuration:duration.doubleValue animations:^{
        UIView *window = [UIApplication sharedApplication].keyWindow;
        CGFloat bgH = [RXUICommonTool getScreenHeight];
        self.bgView.center = CGPointMake(window.center.x, window.frame.size.height / 2 - bgH / 2 + 30);
        [self layoutSubviews];
    }];
}

- (void)keyBoardWillHide:(NSNotification *)notification
{
    if (!RXAC || self.isCardTFShow) return;
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
    // 用户行为上报
    [[RXUserActionLogManager sharedSDK] addUserActionWithScene:@"realauth" action:@"show" properties:@{}];
    
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

#pragma mark -- <setUI>
- (void)setUI
{    
    [self addSubview:self.bgView];
    [self.bgView addSubview:self.titleLbl];
    [self.bgView addSubview:self.desLbl];
    [self.bgView addSubview:self.aliAuthBtn];
    [self.bgView addSubview:self.manualAuthBtn];
    [self.bgView addSubview:self.nameTF];
    [self.bgView addSubview:self.cardTF];
    [self.bgView addSubview:self.confirmBtn];
    [self.bgView addSubview:self.closeBtn];
    [self.bgView addSubview:self.backBtn];
    
    if (self.isManualAuthMode) {
        [self setupManualAuthDataIfNeeded];
    }
    [self layoutViews];
}

- (BOOL)fetchIIFAAVisible
{
    if ([[NSUserDefaults standardUserDefaults] objectForKey:@"rx_iifaa_visible"]) {
        return [[NSUserDefaults standardUserDefaults] boolForKey:@"rx_iifaa_visible"];
    }
    
    NSDictionary *channelInfo = [[NSUserDefaults standardUserDefaults] valueForKey:@"rx_channel"];
    if (![channelInfo isKindOfClass:[NSDictionary class]]) {
        return NO;
    }
    
    NSDictionary *realAuthInfo = channelInfo[@"ra"];
    if (![realAuthInfo isKindOfClass:[NSDictionary class]]) {
        return NO;
    }
    
    id iifaaVisible = realAuthInfo[@"iifaa"];
    if (!iifaaVisible || iifaaVisible == [NSNull null]) {
        return NO;
    }
    
    return [iifaaVisible boolValue];
}

- (void)setupManualAuthDataIfNeeded
{
    if (self.didSetupManualAuthData) {
        return;
    }
    self.didSetupManualAuthData = YES;
    
    if (self.isUseFastAuth) {
        NSMutableDictionary *loginDic = [NSMutableDictionary dictionaryWithDictionary:[RXUIUserUtility sharedManager].loginData];
        if (!loginDic || loginDic.allKeys.count <= 0) {
            loginDic = [NSMutableDictionary dictionaryWithDictionary:[RXUIUserUtility sharedManager].apiLoginData];
        }
        if (!loginDic || loginDic.allKeys.count <= 0) {
            NSDictionary *loginData = [[NSUserDefaults standardUserDefaults] valueForKey:keyUser_loginData];
            loginDic = [NSMutableDictionary dictionaryWithDictionary:loginData[@"loginData"][@"data"]];
        }
        NSDictionary *ext = loginDic[@"ext"];
        if ([ext isKindOfClass:[NSDictionary class]] && ext.allKeys.count > 0) {
            if (ext[@"realname"]) {
                self.nameStr = [NSString stringWithFormat:@"%@", ext[@"realname"]];
            }
            if (ext[@"idcard"]) {
                self.cardStr = [NSString stringWithFormat:@"%@", ext[@"idcard"]];
            }
        }
        
        if (self.nameStr.length > 0 && self.cardStr.length > 0) {
            self.nameTF.placeholderLbl.hidden = YES;
            self.cardTF.placeholderLbl.hidden = YES;
            
            self.nameTF.tf.text = self.nameStr;
            self.cardTF.tf.text = self.cardStr;
            
            _confirmBtn.userInteractionEnabled = YES;
            [_confirmBtn setBackgroundColor:[UIColor colorWithHexString:@"20C0B3"]];
        }
    } else {
        self.nameStr = @"";
        self.cardStr = @"";
    }
}

- (void)layoutViews
{
    UIView *window = [UIApplication sharedApplication].keyWindow;
    
//    CGFloat bgW = [RXUICommonTool getScreenWidth];
    CGFloat bgW = 370;
    CGFloat bgH = self.isManualAuthMode ? (RXAC ? 302 : 302) : 252;

    _bgView.frame = CGRectMake(0, CGRectGetHeight(window.frame), bgW, bgH);
//    _bgView.centerX = window.centerX;
    _bgView.center = window.center;
    
    _titleLbl.frame = CGRectMake(0, 21, CGRectGetWidth(_bgView.frame), 24);
    
    _desLbl.frame = CGRectMake(RXAC ? 29 : 25, CGRectGetMaxY(_titleLbl.frame) + 14, CGRectGetWidth(_bgView.frame) - (RXAC ? 58 : 58), 42);
    
    _closeBtn.frame = CGRectMake(bgW - (RXAC ? 28 + 25 : 28 + 25), 16, 28, 28);
    _backBtn.frame = CGRectMake(RXAC ? 25 : 25, 16, 28, 28);
    
    if (!self.isManualAuthMode) {
        _aliAuthBtn.hidden = NO;
        _manualAuthBtn.hidden = NO;
        _nameTF.hidden = YES;
        _cardTF.hidden = YES;
        _confirmBtn.hidden = YES;
        _rewardView.hidden = YES;
        _backBtn.hidden = YES;
        _closeBtn.hidden = !self.canClose;
        
        _aliAuthBtn.frame = CGRectMake(CGRectGetMinX(_desLbl.frame), CGRectGetMaxY(_desLbl.frame) + 24, CGRectGetWidth(_desLbl.frame), 50);
        _manualAuthBtn.frame = CGRectMake(CGRectGetMinX(_desLbl.frame), CGRectGetMaxY(_aliAuthBtn.frame) + (RXAC ? 12 : 12), CGRectGetWidth(_desLbl.frame), RXAC ? 46 : 46);
        
        [self layoutSubviews];
        return;
    }
    
    _aliAuthBtn.hidden = YES;
    _manualAuthBtn.hidden = YES;
    _nameTF.hidden = NO;
    _cardTF.hidden = NO;
    _confirmBtn.hidden = NO;
    _rewardView.hidden = NO;
    _backBtn.hidden = !self.isManualAuthFromSelection;
    _closeBtn.hidden = self.isManualAuthFromSelection ? YES : !self.canClose;
    
    _nameTF.frame = CGRectMake(CGRectGetMinX(_desLbl.frame), CGRectGetMaxY(_desLbl.frame) + 14, CGRectGetWidth(_desLbl.frame), RXAC ? 40 : 40);
    
    _cardTF.frame = CGRectMake(CGRectGetMinX(_desLbl.frame), CGRectGetMaxY(_nameTF.frame) + (RXAC ? 10 : 10), CGRectGetWidth(_desLbl.frame), CGRectGetHeight(_nameTF.frame));
    
    _confirmBtn.frame = CGRectMake(CGRectGetMinX(_desLbl.frame), CGRectGetMaxY(_cardTF.frame) + (RXAC ? 24 : 24), CGRectGetWidth(_desLbl.frame), RXAC ? 46 : 46);
    
    self.loginData = [RXUIUserUtility sharedManager].loginData;
    if (!self.loginData || self.loginData.allKeys.count <= 0) {
        self.loginData = [RXUIUserUtility sharedManager].apiLoginData;
    }
    NSDictionary *loginData = [[NSUserDefaults standardUserDefaults] valueForKey:keyUser_loginData];
    if (!loginData || self.loginData.allKeys.count <= 0) {
        self.loginData = loginData[@"loginData"][@"data"];
    }
    
    if (!self.loginData) {
        self.loginData = [RXUIUserUtility sharedManager].loginData;
    }
    
    if (self.loginData[@"reward"]) {
        NSDictionary *rewardInfo = self.loginData[@"reward"];
        
        if ([rewardInfo isKindOfClass:[NSDictionary class]] && rewardInfo.allKeys.count > 0) {
            NSString *kind = rewardInfo[@"kind"];
            NSArray *list = rewardInfo[@"list"];
            
            if ([kind isEqualToString:@"realauth"] && [list isKindOfClass:[NSArray class]] && list.count > 0) {
                
                if (!self.rewardView) {
                    self.rewardView = [[RXApproveRewardView alloc] initWithFrame:CGRectZero];
                    [_bgView addSubview:self.rewardView];
                }
                
                _bgView.frame = CGRectMake(0, CGRectGetHeight(window.frame), bgW, bgH + 52);
                _bgView.center = window.center;
                self.rewardView.hidden = NO;
                self.rewardView.frame = CGRectMake(CGRectGetMinX(_nameTF.frame), CGRectGetMaxY(_cardTF.frame) + (RXAC ? 18 : 18), CGRectGetWidth(_nameTF.frame), 52);
                _confirmBtn.frame = CGRectMake(CGRectGetMinX(_desLbl.frame), CGRectGetMaxY(self.rewardView.frame) + (RXAC ? 14 : 14), CGRectGetWidth(_desLbl.frame), RXAC ? 46 : 46);
                
                [_confirmBtn setTitle:@"认证并领取奖励" forState:normal];
            }
        }
    }
    
    [self layoutSubviews];
}

#pragma mark -- <UITextFieldDelegate>
- (BOOL)textFieldShouldBeginEditing:(UITextField *)textField
{
    if ([RXService sharedSDK].useCustomKeyboard) {
        if (self.keyboardPanel && self.isCardTFShow) {
            [self.keyboardPanel hide];
        }
    }

    return YES;
}

- (void)textFieldDidBeginEditing:(UITextField *)textField {
    
    NSString *action = @"";
    
    if (textField == _nameTF.tf) {
        action = @"name_tf";
        
        _nameTF.clearBtn.hidden = NO;
        _cardTF.clearBtn.hidden = YES;
        
        _nameTF.placeholderLbl.textColor = [UIColor colorWithHexString:@"#A5CACA"];
        _nameTF.placeholderLbl.text = @"请输入真实姓名";
                
    } else {
        action = @"idcard_tf";
        
        _nameTF.clearBtn.hidden = YES;
        _cardTF.clearBtn.hidden = NO;
        
        _cardTF.placeholderLbl.textColor = [UIColor colorWithHexString:@"#A5CACA"];
        _cardTF.placeholderLbl.text = @"请输入身份证号";
    }
    
    // 用户行为上报
    [[RXUserActionLogManager sharedSDK] addUserActionWithScene:@"realauth" action:action properties:@{}];
}

- (void)textFieldDidEndEditing:(UITextField *)textField {
    _nameTF.clearBtn.hidden = YES;
    _cardTF.clearBtn.hidden = YES;
}

- (BOOL)textFieldShouldReturn:(UITextField *)textField
{
    [textField endEditing:YES];
//    [self resetPlaceholder];
    return YES;
}

- (void)textFieldDidEndEditing:(UITextField *)textField reason:(UITextFieldDidEndEditingReason)reason
{
    NSLog(@"");
}

/**
 * @note 兼容微信输入法，shouldChangeCharactersInRange 监听不到微信输入法中文输入事件
 */
- (void)textFieldDidChangeSelection:(UITextField *)textField
{
    NSString * str = textField.text;
    
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
}

- (BOOL)textField:(UITextField *)textField shouldChangeCharactersInRange:(NSRange)range replacementString:(NSString *)string
{
    if (self.nameStr.length > 0 && self.cardStr.length > 0) {
        if (string.length == 0) {
            if (textField == _nameTF.tf) {
                if (!_nameTF.isFirstDelete) {
                    _nameTF.tf.text = @"";
                    range = NSMakeRange(0, 0);
                }
                _nameTF.isFirstDelete = YES;
            }
            if (textField == _cardTF.tf) {
                if (!_cardTF.isFirstDelete) {
                    _cardTF.tf.text = @"";
                    range = NSMakeRange(0, 0);
                }
                _cardTF.isFirstDelete = YES;
            }
        }
    }

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
- (void)aliAuthBtnAction
{
    // 用户行为上报
    [[RXUserActionLogManager sharedSDK] addUserActionWithScene:@"realauth" action:@"alipay_auth" properties:@{}];
    
    NSString *appName = [self iifaaAppName];
    if (appName.length <= 0) {
        [RXHUD showErrorText:@"缺少支付宝实名回调配置"];
        return;
    }
    
    [RXHUD showHUD];
    [[RXSDK sharedSDK] getIIFAARedirectURLWithAppName:appName thirdPartSchema:@"" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (error) {
            NSString *errorMsg = [self errorMessageWithError:error defaultMsg:@"获取支付宝认证地址失败"];
            [RXHUD showErrorText:errorMsg];
            if (self.block) {
                self.block(nil, error);
            }
            return;
        }
        
        [RXHUD hideHUD];
        NSString *urlStr = [NSString stringWithFormat:@"%@", response[@"data"][@"url"]];
        NSURL *url = [NSURL URLWithString:urlStr];
        if (urlStr.length <= 0 || !url) {
            [RXHUD showErrorText:@"获取支付宝认证地址失败"];
            return;
        }
        
        self.isWaitingIIFAAResult = YES;
        [[UIApplication sharedApplication] openURL:url options:@{} completionHandler:^(BOOL success) {
            if (!success) {
                self.isWaitingIIFAAResult = NO;
                [RXHUD showErrorText:@"无法打开支付宝认证"];
            }
        }];
    }];
}

- (void)manualAuthBtnAction
{
    // 用户行为上报
    [[RXUserActionLogManager sharedSDK] addUserActionWithScene:@"realauth" action:@"manual_auth" properties:@{}];
    
    self.isManualAuthMode = YES;
    self.isManualAuthFromSelection = YES;
    [self setupManualAuthDataIfNeeded];
    [self layoutViews];
}

- (void)applicationWillEnterForeground
{
    if (!self.isWaitingIIFAAResult) {
        return;
    }
    
    self.isWaitingIIFAAResult = NO;
    [RXHUD showHUD];
    [[RXSDK sharedSDK] getIIFAAResultWithRetryCount:3 complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (error) {
            NSString *errorMsg = [self errorMessageWithError:error defaultMsg:@"支付宝实名认证失败"];
            [RXHUD showErrorText:errorMsg];
            if (self.block) {
                self.block(nil, error);
            }
            return;
        }
        
        [self handleApproveSuccessWithResponse:response realName:nil idCard:nil];
    }];
}

- (void)confimBtnAction
{
    // 用户行为上报
    [[RXUserActionLogManager sharedSDK] addUserActionWithScene:@"realauth" action:@"confirm" properties:@{}];
    
    if (_nameTF.tf.text.length <= 0) {
        [RXHUD showErrorText:@"姓名不能为空"];
        return;
    } else if (_cardTF.tf.text.length <= 0) {
        [RXHUD showErrorText:@"身份证号不能为空"];
        return;
    }
    
    [RXHUD showHUD];
    
    self.isFastAuth = NO;
    if ([self.nameTF.tf.text isEqualToString:self.nameStr] && [self.cardTF.tf.text isEqualToString:self.cardStr]) {
        self.isFastAuth = YES;
    }
    
    [[RXApiService sharedSDK] approveWithRealName:self.nameTF.tf.text idCard:self.cardTF.tf.text isFastAuth:self.isFastAuth complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (error) {
            NSLog(@"实名认证失败：\n%@", error.error);
            NSString *errorMsg = error.responesObject[@"msg"];
            if (errorMsg.length <= 0) {
                errorMsg = @"认证失败";
            }
            [RXHUD showErrorText:errorMsg];
            
            if (self.block) {
                self.block(nil, error);
            }
        } else {
            [RXHUD hideHUD];
            NSLog(@"实名认证成功：\n%@", response);
//            [SVProgressHUD showSuccessWithStatus:@"认证成功"];
            [self handleApproveSuccessWithResponse:response realName:self.nameTF.tf.text idCard:self.cardTF.tf.text];
        }
    }];
}

- (void)handleApproveSuccessWithResponse:(NSDictionary *)response
                                realName:(NSString *)realName
                                  idCard:(NSString *)idCard
{
    [RXHUD hideHUD];
    
    NSMutableDictionary *dic = [NSMutableDictionary dictionaryWithDictionary:response[@"data"]];
    if (realName.length > 0) {
        [dic setValue:realName forKey:@"realname"];
    }
    if (idCard.length > 0) {
        [dic setValue:idCard forKey:@"idcard"];
    }
    if (!dic[@"aas"] && response[@"aas"]) {
        [dic setValue:response[@"aas"] forKey:@"aas"];
    }
    if (!dic[@"limit"] && response[@"limit"]) {
        [dic setValue:response[@"limit"] forKey:@"limit"];
    }
    
    __unused RXUCommonView *successV = [[RXUCommonView alloc] initWithDesStr:@"实名认证成功" title:@"实名认证" image:@"rx_success" complete:^{
        if (self.block) {
            self.block(dic, nil);
        }
    }];
    
    [self updateLoginDataWithApproveResponse:response authData:dic];
    [self hide];
}

- (void)updateLoginDataWithApproveResponse:(NSDictionary *)response
                                  authData:(NSDictionary *)authData
{
    NSMutableDictionary *loginData = [NSMutableDictionary dictionaryWithDictionary:[RXUIUserUtility sharedManager].loginData];
    if (!loginData || loginData.allKeys.count <= 0) {
        loginData = [NSMutableDictionary dictionaryWithDictionary:[RXUIUserUtility sharedManager].apiLoginData];
    }
    if (!loginData) {
        loginData = [NSMutableDictionary dictionary];
    }
    
    int attr = [loginData[@"attr"] intValue];
    attr = attr | 1;
    [loginData setValue:@(attr) forKey:@"attr"];
    
    id aasValue = response[@"aas"] ?: authData[@"aas"];
    if (aasValue) {
        [loginData setValue:@([aasValue integerValue]) forKey:@"aas"];
    }
    
    id limitValue = response[@"limit"] ?: authData[@"limit"];
    if (limitValue) {
        int flag = [loginData[@"flag"] intValue];
        BOOL limit = [limitValue boolValue];
        if (limit) {
            flag = flag | 2;
        } else {
            flag = flag & ~(1 << 1);
        }
        [loginData setValue:@(flag) forKey:@"flag"];
    }
    
    [RXUIUserUtility sharedManager].loginData = loginData;
}

- (NSString *)iifaaAppName
{
    NSDictionary *infoDictionary = [NSBundle mainBundle].infoDictionary;
    NSString *displayName = infoDictionary[@"CFBundleDisplayName"];
    if (displayName.length > 0) {
        return displayName;
    }
    
    NSString *bundleName = infoDictionary[@"CFBundleName"];
    if (bundleName.length > 0) {
        return bundleName;
    }
    
    return [self iifaaFirstURLScheme];
}

- (NSString *)iifaaThirdPartSchema
{
    NSString *scheme = [self iifaaFirstURLScheme];
    if (scheme.length <= 0) {
        return @"";
    }
    if ([scheme hasSuffix:@"://"]) {
        return scheme;
    }
    return [NSString stringWithFormat:@"%@://", scheme];
}

- (NSString *)iifaaFirstURLScheme
{
    NSArray *urlTypes = [NSBundle mainBundle].infoDictionary[@"CFBundleURLTypes"];
    for (NSDictionary *urlType in urlTypes) {
        NSArray *schemes = urlType[@"CFBundleURLSchemes"];
        for (NSString *scheme in schemes) {
            if ([scheme isKindOfClass:[NSString class]] && scheme.length > 0) {
                return scheme;
            }
        }
    }
    return @"";
}

- (NSString *)errorMessageWithError:(RX_CommonRequestError *)error
                         defaultMsg:(NSString *)defaultMsg
{
    NSString *errorMsg = error.responesObject[@"msg"];
    if (errorMsg.length <= 0) {
        errorMsg = defaultMsg;
    }
    return errorMsg;
}

- (UIImage *)resizedImage:(UIImage *)image
                     size:(CGSize)size
{
    if (!image) {
        return nil;
    }
    
    UIGraphicsBeginImageContextWithOptions(size, NO, 0);
    [image drawInRect:CGRectMake(0, 0, size.width, size.height)];
    UIImage *resizedImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return resizedImage;
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

- (void)backBtnAction:(UIButton *)btn
{
    [self endEditing:YES];
    
    if (self.isCardTFShow) {
        [self.keyboardPanel hide];
    }
    
    self.isManualAuthMode = NO;
    self.isManualAuthFromSelection = NO;
    [self layoutViews];
}

- (void)tapAction:(UITapGestureRecognizer *)tap
{
//    [self resetPlaceholder];
    [self endEditing:YES];
    
    if (self.isCardTFShow) {
        [self.keyboardPanel hide];
    }
}

- (void)resetPlaceholder
{
    if (self.nameStr.length > 0 && self.cardStr.length > 0) {
        self.nameTF.placeholderLbl.textColor = [UIColor blackColor];
        self.cardTF.placeholderLbl.textColor = [UIColor blackColor];
        
        self.nameTF.placeholderLbl.text = self.nameStr;
        self.cardTF.placeholderLbl.text = self.cardStr;
        
        _confirmBtn.userInteractionEnabled = YES;
        [_confirmBtn setBackgroundColor:[UIColor colorWithHexString:@"20C0B3"]];
    }
}

- (void)cardTFAction:(UITapGestureRecognizer *)tap
{
    if (self.isCardTFShow) {
        [self.keyboardPanel hide];
        return;
    }
    if (!self.keyboardPanel) {
        self.keyboardPanel = [[RXKeyboardPanel alloc] initWithKeyboardStyle:RXKeyboardStyleLight];
    }
    
    self.keyboardPanel.animationDuration = 0.25;
    self.keyboardPanel.delegate = self;
    
    if ([self.cardTF.tf.text isEqualToString:self.cardStr] && !self.isCardTFEdit) {
        self.keyboardPanel.defaultText = @"";
    } else {
        self.keyboardPanel.defaultText = self.cardTF.tf.text;
    }
    
    [self.keyboardPanel showInView:self];
}

#pragma mark -- <keyboard panel delegate>
- (void)rxKeyboardPanelDidShow
{
    self.isCardTFShow = YES;
 
    if (!RXAC) return;
    
    [UIView animateWithDuration:self.keyboardPanel.animationDuration animations:^{
        UIView *window = [UIApplication sharedApplication].keyWindow;
        CGFloat bgH = [RXUICommonTool getScreenHeight];
        self.bgView.center = CGPointMake(window.center.x, window.frame.size.height / 2 - bgH / 2 + 30);
        [self layoutSubviews];
    }];
    
    // 用户行为上报
    [[RXUserActionLogManager sharedSDK] addUserActionWithScene:@"realauth" action:@"idcard_tf" properties:@{}];
}

- (void)rxKeyboardPanelDidHide
{
    self.isCardTFShow = NO;
    
    [UIView animateWithDuration:self.keyboardPanel.animationDuration animations:^{
        UIView *window = [UIApplication sharedApplication].keyWindow;
        self.bgView.center = window.center;
        [self layoutSubviews];
    }];
}

- (void)rxKeyboardPanelDidFinish:(NSString *)result
{
    if (result.length > 0) {
        self.cardTF.placeholderLbl.hidden = YES;
        self.cardTF.tf.text = result;
        self.isCardTFEdit = YES;
        
        if (self.nameTF.tf.text.length > 0) {
            _confirmBtn.userInteractionEnabled = YES;
            [_confirmBtn setBackgroundColor:[UIColor colorWithHexString:@"20C0B3"]];
        }
    } else {
        if (self.isCardTFEdit) {
            self.cardTF.tf.text = @"";
            self.cardTF.placeholderLbl.hidden = NO;
            
            _confirmBtn.userInteractionEnabled = NO;
            [_confirmBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
        } else {
            if (self.nameStr.length > 0) {
                self.cardTF.placeholderLbl.hidden = YES;
                
                if (self.nameTF.tf.text.length > 0) {
                    _confirmBtn.userInteractionEnabled = YES;
                    [_confirmBtn setBackgroundColor:[UIColor colorWithHexString:@"20C0B3"]];
                }
            } else {
                self.cardTF.placeholderLbl.hidden = NO;
                
                _confirmBtn.userInteractionEnabled = NO;
                [_confirmBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
            }
        }
    }
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
        _titleLbl.font = [UIFont systemFontOfSize:22 weight:UIFontWeightMedium];
        _titleLbl.textAlignment = NSTextAlignmentCenter;
    }
    return _titleLbl;
}

- (UILabel *)desLbl
{
    if (!_desLbl) {
        _desLbl = [[UILabel alloc] init];
        _desLbl.text = @"根据国家最新法规规定，未实名认证的用户不能体验任何游戏内容，请尽快完成实名。";
        _desLbl.textColor = [UIColor blackColor];
        _desLbl.numberOfLines = 0;
        _desLbl.font = [UIFont systemFontOfSize:15.5 weight:UIFontWeightRegular];
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
        
        if ([RXService sharedSDK].useCustomKeyboard) {
            _cardTF.tf.userInteractionEnabled = NO;
            
            UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(cardTFAction:)];
            [_cardTF addGestureRecognizer:tap];
        } else {
            _cardTF.tf.userInteractionEnabled = YES;
        }
    }
    return _cardTF;
}

- (UIButton *)confirmBtn
{
    if (!_confirmBtn) {
        _confirmBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        _confirmBtn.userInteractionEnabled = NO;
        [_confirmBtn setBackgroundColor:[UIColor colorWithHexString:@"b3e6e2"]];
        [_confirmBtn setTitle:@"确认提交" forState:UIControlStateNormal];
        [_confirmBtn setTitleColor:[UIColor colorWithHexString:@"F2FFFB"] forState:UIControlStateNormal];
        _confirmBtn.titleLabel.font = [UIFont systemFontOfSize:18 weight:UIFontWeightMedium];
        [_confirmBtn addTarget:self action:@selector(confimBtnAction) forControlEvents:UIControlEventTouchUpInside];
        _confirmBtn.layer.cornerRadius = 5;
    }
    return _confirmBtn;
}

- (UIButton *)aliAuthBtn
{
    if (!_aliAuthBtn) {
        _aliAuthBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_aliAuthBtn setBackgroundColor:[UIColor colorWithHexString:@"3876F5"]];
        [_aliAuthBtn setTitle:@"支付宝实名认证" forState:UIControlStateNormal];
        [_aliAuthBtn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
        UIImage *aliIcon = [self resizedImage:[UIImage rxBundleImageNamed:@"rx_ali"] size:CGSizeMake(50, 50)];
        [_aliAuthBtn setImage:aliIcon forState:UIControlStateNormal];
        _aliAuthBtn.titleLabel.font = [UIFont systemFontOfSize:18 weight:UIFontWeightMedium];
        _aliAuthBtn.layer.cornerRadius = 5;
        _aliAuthBtn.imageEdgeInsets = UIEdgeInsetsMake(0, -8, 0, 8);
        _aliAuthBtn.titleEdgeInsets = UIEdgeInsetsMake(0, 8, 0, -8);
        [_aliAuthBtn addTarget:self action:@selector(aliAuthBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _aliAuthBtn;
}

- (UIButton *)manualAuthBtn
{
    if (!_manualAuthBtn) {
        _manualAuthBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_manualAuthBtn setBackgroundColor:[UIColor clearColor]];
        UIFont *font = [UIFont systemFontOfSize:16 weight:UIFontWeightMedium];
        NSDictionary *attributes = @{NSForegroundColorAttributeName : [UIColor colorWithHexString:@"A3A3A3"],
                                     NSFontAttributeName : font,
                                     NSUnderlineStyleAttributeName : @(NSUnderlineStyleSingle)};
        NSAttributedString *title = [[NSAttributedString alloc] initWithString:@"手动实名认证" attributes:attributes];
        [_manualAuthBtn setAttributedTitle:title forState:UIControlStateNormal];
        _manualAuthBtn.titleLabel.font = font;
        _manualAuthBtn.layer.cornerRadius = 5;
        [_manualAuthBtn addTarget:self action:@selector(manualAuthBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _manualAuthBtn;
}

- (RXCloseBtn *)closeBtn
{
    if (!_closeBtn) {
        _closeBtn = [RXCloseBtn buttonWithType:UIButtonTypeCustom];
        [_closeBtn setImage:[UIImage rxBundleImageNamed:@"rx_close"] forState:UIControlStateNormal];
        _closeBtn.hidden = !self.canClose;
        [_closeBtn addTarget:self action:@selector(closeBtnAction:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _closeBtn;
}

- (RXCloseBtn *)backBtn
{
    if (!_backBtn) {
        _backBtn = [RXCloseBtn buttonWithType:UIButtonTypeCustom];
        [_backBtn setImage:[UIImage rxBundleImageNamed:@"rx_back"] forState:UIControlStateNormal];
        _backBtn.hidden = YES;
        [_backBtn addTarget:self action:@selector(backBtnAction:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _backBtn;
}

@end
