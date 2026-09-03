//
//  RXLoginView.m
//  RXSDK
//
//  Created by 陈汉 on 2021/9/29.
//

#import "RXLoginView.h"
#import "RXCommonTool.h"
#import "RXLoginBtn.h"
#import "TYAttributedLabel.h"
#import "RXUserInfoModel.h"
#import "RXPrivacyView.h"
#import "RXLoginModel.h"
#import "RXAddLoginView.h"
#import "YYWebImage.h"
#import "YYModel.h"
#import <WechatOpenSDK/WXApi.h>
#import "RXAccountListView.h"

#define LoginBtnTag 100000

@interface RXLoginView ()

@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) RXLoginBtn *loginBtn;
@property (nonatomic, strong) UIButton *closeBtn;
@property (nonatomic, strong) UIButton *downBtn;
@property (nonatomic, strong) RXLoginBtn *accountBtn;
@property (nonatomic, strong) UIButton *selectBtn;
@property (nonatomic, strong) TYAttributedLabel *priLbl;
@property (nonatomic, assign) NSInteger orientation;  // 屏幕方向 1竖屏 2横屏
@property (nonatomic, assign) BOOL needSet;
@property (nonatomic, assign) BOOL isSelect;
@property (nonatomic, strong) NSMutableArray *accounts;
@property (nonatomic, copy) LoginAddAccountBlock addAccountBlock;
@property (nonatomic, copy) LoginTypeBlock loginTypeBlock;
@property (nonatomic, strong) RXAddLoginView *addLoginView;

@end

@implementation RXLoginView

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (instancetype)initWithAccounts:(NSMutableArray <RXUserInfoModel *> *)accounts
                      addAccount:(LoginAddAccountBlock)addAccount
                       loginType:(LoginTypeBlock)loginType
{
    self = [super initWithFrame:CGRectMake(0, 0, [UIApplication sharedApplication].keyWindow.frame.size.width, [UIApplication sharedApplication].keyWindow.frame.size.height)];
    if (self) {
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
        [[UIApplication sharedApplication].keyWindow addSubview:self];
        
        self.orientation = [RXCommonTool getInterfaceOrientation];
        self.needSet = YES;
//        self.logoImg = applogo;
        self.addAccountBlock = addAccount;
        self.loginTypeBlock = loginType;
        self.accounts = accounts;
        
        [self setUI];
        
        [self show];
        
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(addLoginNotiAction:) name:noti_addLogin object:nil];
        
        // 监听屏幕旋转（横竖屏）
//        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onDeviceOrientationDidChange)
//                             name:UIDeviceOrientationDidChangeNotification
//                                                       object:nil];
    }
    return self;
}

- (void)addLoginNotiAction:(NSNotification *)noti
{
    if (self.loginTypeBlock) {
        self.loginTypeBlock(LoginTypeAccount);
    }
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

#pragma mark -- <setUI>
- (void)setUI
{
    [self addSubview:self.bgView];
    [self.bgView sd_addSubviews:@[self.closeBtn, self.loginBtn, self.accountBtn, self.selectBtn, self.priLbl]];
    [self.accountBtn addSubview:self.downBtn];
    
    [self layoutViews];
}

- (void)layoutViews
{
    
    UIView *window = [UIApplication sharedApplication].keyWindow;
    
    _bgView.sd_layout.centerXEqualToView(window)
    .topSpaceToView(self, window.frame.size.height)
    .widthIs(320)
    .heightIs(262);
    
    _accountBtn.sd_layout.topSpaceToView(self.bgView, 30)
    .leftSpaceToView(self.bgView, 27)
    .widthIs(266)
    .heightIs(41);
    
    _downBtn.sd_layout.topSpaceToView(self.accountBtn, 14)
    .rightSpaceToView(self.accountBtn, 24)
    .widthIs(12)
    .heightEqualToWidth();
    
    _loginBtn.sd_layout.topSpaceToView(self.accountBtn, 15)
    .leftEqualToView(self.accountBtn)
    .widthIs(266)
    .heightIs(41);
    
    _priLbl.sd_layout.topSpaceToView(self.loginBtn, 90)
    .leftSpaceToView(self.bgView, 50)
    .widthIs(280)
    .heightIs(16);
    
    _selectBtn.sd_layout.topSpaceToView(self.loginBtn, 91)
    .rightSpaceToView(self.priLbl, 3)
    .widthIs(16)
    .heightEqualToWidth();
    
    _closeBtn.sd_layout.topSpaceToView(self.bgView, -10)
    .rightSpaceToView(self.bgView, -10)
    .widthIs(38)
    .heightEqualToWidth();
    
//    NSArray *imageArr = @[@"login_w", @"login_auth", @"login_user", @"login_apple"];
    
    NSMutableArray *imageArr = [NSMutableArray array];
    for (int i = 0; i < self.accounts.count; i++) {
        RXUserInfoModel *userInfo = self.accounts[i];
        switch (userInfo.userType) {
            case RXUserType_visitor:
            {
                [imageArr addObject:@"login_user"];
            }
                break;
            case RXUserType_apple:
            {
                [imageArr addObject:@"login_apple"];
            }
                break;
            case RXUserType_w:
            {
                [imageArr addObject:@"login_w"];
            }
                break;
            case RXUserType_auth:
            {
                [imageArr addObject:@"login_auth"];
            }
                break;
        }
    }
    
    for (int i = 0; i < imageArr.count; i++) {
        UIButton *button = [UIButton buttonWithType:UIButtonTypeCustom];
        button.tag = LoginBtnTag + i;
        [button setBackgroundImage:[UIImage bundleImageNamed:imageArr[i]] forState:UIControlStateNormal];
        [button addTarget:self action:@selector(quickLoginBtnAction:) forControlEvents:UIControlEventTouchUpInside];
        [self.bgView addSubview:button];
        
        CGFloat x = 56 + 58 * i;
        button.sd_layout.topSpaceToView(self.loginBtn, 26)
        .leftSpaceToView(self.bgView, x)
        .widthIs(40)
        .heightEqualToWidth();
    }
    
    [self layoutSubviews];
}

- (void)show
{
    [UIView animateWithDuration:0.15 animations:^{
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.6];
        UIView *window = [UIApplication sharedApplication].keyWindow;
        self.bgView.sd_layout.topSpaceToView(self, window.frame.size.height / 2 - 262 / 2);
        [self layoutSubviews];
    }];
}

- (void)hide
{
    [UIView animateWithDuration:0.15 animations:^{
        UIView *window = [UIApplication sharedApplication].keyWindow;
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
        self.bgView.sd_layout.topSpaceToView(self, window.frame.size.height);
        [self layoutSubviews];
    }];
    
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.15 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        [self removeFromSuperview];
    });
}


#pragma mark -- <actions>
- (void)selectBtnAction:(UIButton *)btn
{
    btn.selected = !btn.selected;
    self.isSelect = btn.selected;
    if (btn.isSelected) {
        [_selectBtn setImage:[UIImage bundleImageNamed:@"greenSelect"] forState:UIControlStateNormal];
    } else {
        [_selectBtn setImage:[UIImage bundleImageNamed:@"greenUnSelect"] forState:UIControlStateNormal];
    }
}

- (void)quickLoginBtnAction:(UIButton *)btn
{
    if (!self.isSelect) {
        [SVProgressHUD showInfoWithStatus:@"请勾选阅读并同意用户协议与隐私政策"];
        return;
    }
    NSInteger i = btn.tag - LoginBtnTag;
    RXUserInfoModel *userInfo = self.accounts[i];
    LoginType loginType;
    switch (userInfo.userType) {
        case RXUserType_visitor:
        {
            loginType = LoginTypeVisitor;
        }
            break;
        case RXUserType_apple:
        {
            loginType = LoginTypeApple;
        }
            break;
        case RXUserType_w:
        {
            loginType = LoginTypeW;
            [WXApi registerApp:userInfo.wxAppid universalLink:[RXUserUtility sharedManager].universallink];
        }
            break;
        case RXUserType_auth:
        {
            loginType = LoginTypeAuth;
        }
            break;
    }
    
    if (self.loginTypeBlock) {
        self.loginTypeBlock(loginType);
    }
}

- (void)priTapAction:(UITapGestureRecognizer *)tap
{
    RXPrivacyView *priView = [[RXPrivacyView alloc] init];
}

- (void)loginBtnAction
{
    if (self.addAccountBlock) {
        self.addAccountBlock();
    }
}

- (void)accountListBtnAction
{
    RXAccountListView *accountListView = [[RXAccountListView alloc] initWithAddAccount:self.addAccountBlock loginType:self.loginTypeBlock];
}

#pragma mark -- <lazy>
- (UIView *)bgView
{
    if (!_bgView) {
        _bgView = [[UIView alloc] init];
        _bgView.backgroundColor = [UIColor colorWithHexString:@"fafafa"];
        _bgView.layer.cornerRadius = 8;
    }
    return _bgView;
}

- (RXLoginBtn *)accountBtn
{
    if (!_accountBtn) {
        _accountBtn = [RXLoginBtn buttonWithType:UIButtonTypeCustom];
        _accountBtn.adjustsImageWhenHighlighted = NO;
        [_accountBtn setImage:[UIImage bundleImageNamed:@"rx_accountLogin"] forState:UIControlStateNormal];
        [_accountBtn setTitle:@"账号密码登录" forState:UIControlStateNormal];
        [_accountBtn setTitleColor:[UIColor blackColor] forState:UIControlStateNormal];
        _accountBtn.titleLabel.font = [UIFont boldSystemFontOfSize:15];
        _accountBtn.backgroundColor = [UIColor whiteColor];
        _accountBtn.layer.cornerRadius = 4;
        _accountBtn.layer.borderColor = [UIColor colorWithHexString:@"e1e1e1"].CGColor;
        _accountBtn.layer.borderWidth = 0.5;
        [_accountBtn addTarget:self action:@selector(accountListBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _accountBtn;
}

- (UIButton *)downBtn
{
    if (!_downBtn) {
        _downBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_downBtn setImage:[UIImage bundleImageNamed:@"rx_downarrow"] forState:UIControlStateNormal];
        [_downBtn addTarget:self action:@selector(loginBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _downBtn;
}

- (RXLoginBtn *)loginBtn
{
    if (!_loginBtn) {
        _loginBtn = [RXLoginBtn buttonWithType:UIButtonTypeCustom];
        _loginBtn.adjustsImageWhenHighlighted = NO;
        [_loginBtn setImage:[UIImage bundleImageNamed:@"login_add"] forState:UIControlStateNormal];
        [_loginBtn setTitle:@"注册/添加账号" forState:UIControlStateNormal];
        [_loginBtn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
        _loginBtn.titleLabel.font = [UIFont systemFontOfSize:16];
        _loginBtn.backgroundColor = [UIColor colorWithHexString:@"31B14E"];
        _loginBtn.layer.cornerRadius = 4;
        [_loginBtn addTarget:self action:@selector(loginBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _loginBtn;
}

- (UIButton *)selectBtn
{
    if (!_selectBtn) {
        _selectBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        _selectBtn.adjustsImageWhenHighlighted = NO;
        _selectBtn.selected = self.isSelect;
        NSString *image = @"greenUnSelect";
        if (self.isSelect) {
            image = @"greenSelect";
        }
        [_selectBtn setImage:[UIImage bundleImageNamed:image] forState:UIControlStateNormal];
        [_selectBtn addTarget:self action:@selector(selectBtnAction:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _selectBtn;
}

- (TYAttributedLabel *)priLbl
{
    if (!_priLbl) {
        _priLbl = [[TYAttributedLabel alloc] init];
        _priLbl.text = @"我已详细阅读并同意用户协议与隐私政策";
        _priLbl.textColor = [UIColor colorWithHexString:@"737373"];
        _priLbl.backgroundColor = [UIColor clearColor];
        _priLbl.font = [UIFont systemFontOfSize:13];
        _priLbl.verticalAlignment = TYVerticalAlignmentCenter;
        _priLbl.userInteractionEnabled = YES;
//        [_priLbl appendLinkWithText:@"《七夜用户协议》" linkFont:[UIFont systemFontOfSize:12] linkColor:[UIColor colorWithHexString:@"31B14E"] linkData:nil];
        
        UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(priTapAction:)];
        [_priLbl addGestureRecognizer:tap];
    }
    return _priLbl;
}

- (UIButton *)closeBtn
{
    if (!_closeBtn) {
        _closeBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        _closeBtn.adjustsImageWhenHighlighted = NO;
        [_closeBtn setImage:[UIImage bundleImageNamed:@"rx_close"] forState:UIControlStateNormal];
        [_closeBtn addTarget:self action:@selector(hide) forControlEvents:UIControlEventTouchUpInside];
    }
    return _closeBtn;
}

- (NSMutableArray *)accounts
{
    if (!_accounts) {
        _accounts = [NSMutableArray array];
    }
    return _accounts;
}

@end
