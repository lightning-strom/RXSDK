//
//  RXHistoryListLoginView.m
//  RXUIKit
//
//  Created by 陈汉 on 2023/3/20.
//

#import "RXHistoryListLoginView.h"
#import "RXUIReminderView.h"
#import "RXLoginView.h"
#import "RXCloseBtn.h"
#import "RXUIAuthLoginView.h"
#import "RXHistoryMoreBtn.h"

#define LoginBtnTag 100000
#define DeleteBtnTag 200000

@interface RXHistoryListLoginView () <UITableViewDelegate, UITableViewDataSource>

@property (nonatomic, assign) NSInteger orientation;  // 屏幕方向 1竖屏 2横屏
@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) NSMutableArray *loginTypes;
@property (nonatomic, strong) RXLoginUIConfig *loginConfig;
@property (nonatomic, strong) RXCloseBtn *backBtn;
@property (nonatomic, strong) RXCloseBtn *closeBtn;
@property (nonatomic, strong) UILabel *titleLbl;
@property (nonatomic, strong) UITableView *mTableView;
@property (nonatomic, strong) NSMutableArray *accountList;
@property (nonatomic, assign) NSInteger selectIndex;
@property (nonatomic, copy) SelectAccountBlock selectAccountBlock;
@property (nonatomic, strong) RXHistoryMoreBtn *moreLoginBtn;
@property (nonatomic, assign) LoginMode loginMode;

@end

@implementation RXHistoryListLoginView

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (instancetype)initWithLoginConfig:(RXLoginUIConfig *)loginConfig
                           viewType:(RXUserType)viewType
                      selectAccount:(SelectAccountBlock)selectAccount
{
    self = [super initWithFrame:CGRectMake(0, 0, [UIApplication sharedApplication].keyWindow.frame.size.width, [UIApplication sharedApplication].keyWindow.frame.size.height)];
    if (self) {
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
        [[UIApplication sharedApplication].keyWindow addSubview:self];
        
        self.orientation = [RXUICommonTool getInterfaceOrientation];
        self.loginConfig = loginConfig;
        self.accountList = [NSMutableArray arrayWithArray:[RXUIUserUtility sharedManager].accounts];
        self.selectAccountBlock = selectAccount;
        self.loginMode = LoginModeNormal;
        
        [self setUI];
        
        [self show];
        
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(loginCallBack:) name:noti_rxLogin object:nil];
    }
    return self;
}

- (instancetype)initWithLoginConfig:(RXLoginUIConfig *)loginConfig
                         loginEvent:(LoginTypeBlock)loginEvent
                           complete:(LoginComplete)complete
{
    self = [super initWithFrame:CGRectMake(0, 0, [UIApplication sharedApplication].keyWindow.frame.size.width, [UIApplication sharedApplication].keyWindow.frame.size.height)];
    if (self) {
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
        [[UIApplication sharedApplication].keyWindow addSubview:self];
        
        self.orientation = [RXUICommonTool getInterfaceOrientation];
        self.loginConfig = loginConfig;
        self.accountList = [NSMutableArray arrayWithArray:[RXUIUserUtility sharedManager].accounts];
        //        self.selectAccountBlock = selectAccount;
        self.loginComplete = complete;
        self.loginTypeBlock = loginEvent;
        self.loginMode = LoginModeQuick;
        self.loginTypes = [NSMutableArray arrayWithArray:[RXUIUserUtility sharedManager].loginTypes];
        
        [self setUI];
        
        [self show];
        
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(loginCallBack:) name:noti_rxLogin object:nil];
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
    NSLog(@"bgframe1 = %@", self.bgView);
    [RXUICommonTool transformWithView:self.bgView];
    NSLog(@"bgframe2 = %@", self.bgView);
    [UIView animateWithDuration:0.1 animations:^{
        
        if (self.loginMode == LoginModeQuick) {
            self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.5];
        } else {
            self.backgroundColor = [UIColor clearColor];
        }
        
        [RXUICommonTool showWithAnimate:self.bgView];
        NSLog(@"bgframe3 = %@", self.bgView);
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
    [self.bgView addSubview:self.backBtn];
    [self.bgView addSubview:self.closeBtn];
    [self.bgView addSubview:self.mTableView];
    [self.bgView addSubview:self.moreLoginBtn];
    
    NSMutableArray *imageArr = [NSMutableArray array];
    NSMutableArray *titleArr = [NSMutableArray array];
    NSMutableArray *colorArr = [NSMutableArray array];
    for (int i = 0; i < self.loginTypes.count; i++) {
        RXUserType userType = [RXUICommonTool getUserType:self.loginTypes[i]];
        switch (userType) {
            case RXUserType_visitor:
            {
                [imageArr addObject:@"rx_loginMore_visitor"];
                [titleArr addObject:@"游客"];
                [colorArr addObject:@"#3B89FD"];
                break;
            }
            case RXUserType_apple:
            {
                [imageArr addObject:@"rx_loginMore_apple"];
                [titleArr addObject:@"Apple"];
                [colorArr addObject:@"#000000"];
                break;
            }
            case RXUserType_w:
            {
                [imageArr addObject:@"rx_loginMore_wechat"];
                [titleArr addObject:@"微信"];
                [colorArr addObject:@"#20C0B3"];
                break;
            }
            case RXUserType_auth:
            {
                [imageArr addObject:@"rx_loginMore_auth"];
                [titleArr addObject:@"一键登录"];
                [colorArr addObject:@"#000000"];
                break;
            }
            case RXUserType_account:
            {
                [imageArr addObject:@"rx_loginMore_username"];
                [titleArr addObject:@"账号"];
                [colorArr addObject:@"#000000"];
                break;
            }
            case RXUserType_code:
            {
                [imageArr addObject:@"rx_loginMore_code"];
                [titleArr addObject:@"验证码"];
                [colorArr addObject:@"#000000"];
                break;
            }
        }
    }
    
    [self layoutViews];
}

- (void)layoutViews
{
    UIView *window = [UIApplication sharedApplication].keyWindow;
    
//    self.bgView.frame = CGRectMake(0, 0, 344, 240);
    self.bgView.frame = CGRectMake(0, 0, [RXUICommonTool getScreenWidth], RXAC ? 302 : 334);
    self.bgView.center = window.center;
    
    self.backBtn.frame = CGRectMake(RXAC ? 24 : 21, 16, 28, 28);
    
    self.closeBtn.frame = CGRectMake(CGRectGetWidth(_bgView.frame) - (RXAC ? 24 + 28 : 28 + 20), RXAC ? 12 : 16, 28, 28);
    
    self.titleLbl.frame = CGRectMake(0, 21, [RXUICommonTool getScreenWidth], 24);
    
    self.moreLoginBtn.frame = CGRectMake(CGRectGetWidth(_bgView.frame) / 2 - 66, CGRectGetHeight(_bgView.frame) - 34 - 12, 132, 34);
    
    self.mTableView.frame = CGRectMake(0, CGRectGetMaxY(_titleLbl.frame) + 10, [RXUICommonTool getScreenWidth], CGRectGetHeight(self.bgView.frame) - 83);
    
    if (self.loginMode == LoginModeQuick) {
        self.titleLbl.frame = CGRectMake(0, 19, [RXUICommonTool getScreenWidth], 24);
        
        self.mTableView.frame = CGRectMake(0, CGRectGetMaxY(_titleLbl.frame) + 6, [RXUICommonTool getScreenWidth], CGRectGetHeight(self.bgView.frame) - 83 - 34 + 10);
    }
    
    [self layoutSubviews];
}

#pragma mark -- <UITableViewDelegate && UITableViewDataSource>
- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    return 1;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return [NSMutableArray arrayWithArray:[RXUIUserUtility sharedManager].accounts].count;
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    return RXAC ? 48 : 55;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"cell"];
//    if (!cell) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:@"cell"];
        cell.selectionStyle = UITableViewCellSelectionStyleNone;
    cell.backgroundColor = _bgView.backgroundColor;
//    }
    
    
    NSMutableArray *arr = [NSMutableArray arrayWithArray:[RXUIUserUtility sharedManager].accounts];
    NSMutableDictionary *userInfo = [RXUIUserUtility sharedManager].accounts[indexPath.row];
    
    UIView *cellBg = [[UIView alloc] init];
//    cellBg.backgroundColor = [UIColor colorWithHexString:@"#F4FAFA"];
    cellBg.layer.borderColor = [UIColor colorWithHexString:@"#E2F2F1"].CGColor;
    cellBg.layer.borderWidth = 1;
    cellBg.layer.cornerRadius = 5;
    [cell.contentView addSubview:cellBg];
    
    UIImageView *headImgView = [[UIImageView alloc] init];
    headImgView.image = [UIImage rxBundleImageNamed:[RXUICommonTool getIconWithLoginType:[userInfo[@"loginType"] integerValue]]];
    [cellBg addSubview:headImgView];
    
    UILabel *nameLbl = [[UILabel alloc] init];
    nameLbl.textColor = [UIColor blackColor];
    nameLbl.text = userInfo[@"nickname"];
    long loginType = [userInfo[@"loginType"] longValue];
    if (loginType == 1 || loginType == 10) {
        if ([RXUICommonTool validateMobile:userInfo[@"nickname"]]) {
            nameLbl.text = [RXUICommonTool usernameSec:userInfo[@"nickname"]];
        }
    }
    
    nameLbl.font = [UIFont systemFontOfSize:16 weight:UIFontWeightRegular];
    [cellBg addSubview:nameLbl];
    
    UIButton *deleteBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    deleteBtn.tag = DeleteBtnTag + indexPath.row;
    [deleteBtn setImage:[UIImage rxBundleImageNamed:@"rx_login_delete"] forState:UIControlStateNormal];
    [deleteBtn addTarget:self action:@selector(deleteBtnAction:) forControlEvents:UIControlEventTouchUpInside];
    
    [cellBg addSubview:deleteBtn];
    
    cellBg.frame = CGRectMake(RXAC ? 29 : 25, 8, CGRectGetWidth(_mTableView.frame) - (RXAC ? 58 : 50), RXAC ? 39 : 46);
    headImgView.frame = CGRectMake(11, RXAC ? 8 : 11.5, 23, 23);
    nameLbl.frame = CGRectMake(42, 0, 190, RXAC ? 39 : 46);
    deleteBtn.frame = CGRectMake(CGRectGetWidth(cellBg.frame) - 33, RXAC ? 7 : 10.5, 25, 25);
    
    self.selectIndex = indexPath.row;
    
    return cell;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    NSMutableDictionary *selectDic = [NSMutableDictionary dictionaryWithDictionary:[RXUIUserUtility sharedManager].accounts[indexPath.row]];
    
    if ([selectDic[@"loginType"] integerValue] == 1) {
        [RXUIUserUtility sharedManager].username = selectDic[@"username"];
        [RXUIUserUtility sharedManager].password = selectDic[@"password"];
    } else {
        [RXUIUserUtility sharedManager].username = selectDic[@"username"];
    }
    
    if (self.loginMode == LoginModeNormal) {
        if (self.selectAccountBlock) {
            self.selectAccountBlock(selectDic);
        }
    } else {
        if (self.loginComplete) {
            
            [[NSUserDefaults standardUserDefaults] setValue:@([selectDic[@"loginType"] integerValue]) forKey:keyUserData_methodenum];
            
            NSString *method = [RXUICommonTool toMethodStr:[selectDic[@"loginType"] integerValue]];
            [selectDic setValue:method forKey:@"method"];
            [selectDic setValue:@(1) forKey:@"login_type"];
            NSDictionary *response = @{
                @"code" : @(0),
                @"data" : selectDic
            };
            self.loginComplete(response, nil);
        }
    }
    
    [self hide];
}

#pragma mark -- <actions>
- (void)moreLoginBtnAction
{
    [RXUIUserUtility sharedManager].isFirstView = NO;
    [RXUIUserUtility sharedManager].loginTypes = self.loginTypes;
//    self.loginConfig.loginViewType = 1;
//    RXLoginView *loginView = [[RXLoginView alloc] initWithConfig:self.loginConfig loginEvent:self.loginTypeBlock complete:self.loginComplete];
    
    RXUIAuthLoginView *authLoginView = [[RXUIAuthLoginView alloc] initWithConfig:self.loginConfig loginEvent:self.loginTypeBlock complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
        
    }];
    authLoginView.loginComplete = self.loginComplete;
    
    [RXUIUserUtility sharedManager].isAuthFirst = YES;
}

- (void)closeBtnAction
{
    RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
    
    NSString *errorMsg = [RXErrorTool getRXErrorMsg:RXLimitError_closeView];
    err.responesObject = @{@"msg" : errorMsg,
                           @"code" : @(RXLimitError_closeView)
    };
    if (self.loginComplete) {
        self.loginComplete(nil, err);
    }
    [[RXService sharedSDK].loginDelegate rx_LoginCallBackWithResponse:nil error:err];
    [self hide];
}

- (void)deleteBtnAction:(UIButton *)btn
{
    RXUIReminderView *reMinderView = [[RXUIReminderView alloc] initWithDesStr:@"确定删除该账号？" title:@"提示" complete:^{
        NSMutableArray *accounts = [NSMutableArray arrayWithArray:[RXUIUserUtility sharedManager].accounts];
        if (accounts.count > 0) {
            [accounts removeObjectAtIndex:btn.tag - DeleteBtnTag];
            [RXUIUserUtility saveAccounts:accounts];
            [self.mTableView reloadData];
            
            if (accounts.count <= 0) {
                [RXUIUserUtility sharedManager].isFirstView = YES;
                [RXUIUserUtility sharedManager].isAuthFirst = YES;
//                RXLoginView *loginView = [[RXLoginView alloc] initWithConfig:self.loginConfig loginEvent:self.loginTypeBlock complete:self.loginComplete];
                
                if (self.deleteBlock) {
                    self.deleteBlock();
                }
                
                [self hide];
                
                dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
                    RXUIAuthLoginView *authLoginView = [[RXUIAuthLoginView alloc] initWithConfig:self.loginConfig loginEvent:self.loginTypeBlock complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
                        
                    }];
                    authLoginView.loginComplete = self.loginComplete;
                });
     
            } else {
                NSMutableDictionary *selectDic = accounts[0];
                
                if (self.selectAccountBlock) {
                    self.selectAccountBlock(selectDic);
                }
            }
        }
    }];
}

- (void)loginCallBack:(NSNotification *)noti
{
    if (self.loginMode == LoginModeNormal) {
        NSMutableDictionary *notiDic = [NSMutableDictionary dictionaryWithDictionary:noti.userInfo];
        NSDictionary *loginModel = notiDic[@"loginData"];
        NSInteger code = [loginModel[@"code"] integerValue];
        NSString *tipString = loginModel[@"msg"];
        if (loginModel && code == 0) {
    //        [SVProgressHUD showSuccessWithStatus:@"登录成功"];
            [RXHUD hideHUD];
            
            [RXUIUserUtility saveLoginModel:loginModel];
            [self hide];
        } else {
            [RXHUD showErrorText:tipString];
        }
        
        NSNumber *loginType = notiDic[@"loginType"];
        if (loginType) {
            [RXUIUserUtility saveLoginType:loginType];
        }
    } else {
        [self hide];
    }
}

#pragma mark -- <lazy>
- (UIView *)bgView
{
    if (!_bgView) {
        _bgView = [[UIView alloc] init];
        _bgView.backgroundColor = [UIColor whiteColor];
        _bgView.layer.cornerRadius = 7;
    }
    return _bgView;
}

- (RXCloseBtn *)backBtn
{
    if (!_backBtn) {
        _backBtn = [RXCloseBtn buttonWithType:UIButtonTypeCustom];
        [_backBtn setImage:[UIImage rxBundleImageNamed:@"rx_back"] forState:UIControlStateNormal];
        [_backBtn addTarget:self action:@selector(hide) forControlEvents:UIControlEventTouchUpInside];
        if (self.loginMode == LoginModeQuick) {
            _backBtn.hidden = YES;
        }
    }
    return _backBtn;
}

- (RXCloseBtn *)closeBtn
{
    if (!_closeBtn) {
        _closeBtn = [RXCloseBtn buttonWithType:UIButtonTypeCustom];
        _closeBtn.adjustsImageWhenHighlighted = NO;
        [_closeBtn setImage:[UIImage rxBundleImageNamed:@"rx_close"] forState:UIControlStateNormal];
        [_closeBtn addTarget:self action:@selector(closeBtnAction) forControlEvents:UIControlEventTouchUpInside];
        
        if (self.loginMode == LoginModeNormal) {
            _closeBtn.hidden = YES;
        }
    }
    return _closeBtn;
}

- (UILabel *)titleLbl
{
    if (!_titleLbl) {
        _titleLbl = [[UILabel alloc] init];
        _titleLbl.text = @"切换账号";
        _titleLbl.textColor = [UIColor blackColor];
        _titleLbl.font = [UIFont systemFontOfSize:21 weight:UIFontWeightMedium];
        _titleLbl.textAlignment = NSTextAlignmentCenter;
    }
    return _titleLbl;
}

- (UITableView *)mTableView
{
    if (!_mTableView) {
        _mTableView = [[UITableView alloc] initWithFrame:CGRectZero style:UITableViewCellStyleDefault];
        _mTableView.backgroundColor = _bgView.backgroundColor;
        _mTableView.dataSource = self;
        _mTableView.delegate = self;
        _mTableView.separatorStyle = UITableViewCellSeparatorStyleNone;
    }
    return _mTableView;
}

- (RXHistoryMoreBtn *)moreLoginBtn
{
    if (!_moreLoginBtn) {
        _moreLoginBtn = [RXHistoryMoreBtn buttonWithType:UIButtonTypeCustom];
        [_moreLoginBtn setTitle:@"更多登录方式" forState:UIControlStateNormal];
        [_moreLoginBtn setTitleColor:[UIColor colorWithHexString:@"#010101"] forState:UIControlStateNormal];
        [_moreLoginBtn setImage:[UIImage rxBundleImageNamed:@"rx_login_hisMore"] forState:UIControlStateNormal];
        [_moreLoginBtn setBackgroundColor:[UIColor colorWithHexString:@"#F1F3F7"]];
        _moreLoginBtn.titleLabel.font = [UIFont systemFontOfSize:14 weight:UIFontWeightRegular];
        _moreLoginBtn.layer.cornerRadius = 4;
        [_moreLoginBtn addTarget:self action:@selector(moreLoginBtnAction) forControlEvents:UIControlEventTouchUpInside];
        
        if (self.loginMode == LoginModeNormal) {
            _moreLoginBtn.hidden = YES;
        }
    }
    return _moreLoginBtn;
}

@end

