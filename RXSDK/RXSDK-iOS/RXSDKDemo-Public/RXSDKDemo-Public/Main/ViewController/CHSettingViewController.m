//
//  CHSettingViewController.m
//  RXSDKDemo-Public
//
//  Created by 陈汉 on 2024/1/2.
//

#import "CHSettingViewController.h"
#import "CHMarco.h"
#import "CHSelectLanguageView.h"
#import "CHSettingConfigView.h"
#import "CHSettingLoginView.h"
#import "CHLoginViewController.h"

@interface CHSettingViewController ()

@property (nonatomic, strong) UIScrollView *mScrollView;
@property (nonatomic, strong) UIView *topBgView;
@property (nonatomic, strong) UIImageView *topImageView;
@property (nonatomic, strong) UILabel *topTitleLbl;
@property (nonatomic, strong) UILabel *topDesLbl;
@property (nonatomic, strong) UIButton *backBtn;
@property (nonatomic, strong) CHSelectLanguageView *languageView;
@property (nonatomic, strong) UIButton *startBtn;
@property (nonatomic, assign) BOOL isAC;

@end

@implementation CHSettingViewController

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    [Tool sharedSDK].interface = 2;

    if (@available(iOS 16.0, *)) {
        // setNeedsUpdateOfSupportedInterfaceOrientations 方法是 UIViewController 的方法
        [self setNeedsUpdateOfSupportedInterfaceOrientations];
        NSArray *array = [[[UIApplication sharedApplication] connectedScenes] allObjects];
        UIWindowScene *scene = [array firstObject];
        // 屏幕方向
        UIInterfaceOrientationMask orientation = UIInterfaceOrientationMaskPortrait;
        UIWindowSceneGeometryPreferencesIOS *geometryPreferencesIOS = [[UIWindowSceneGeometryPreferencesIOS alloc] initWithInterfaceOrientations:orientation];
        // 开始切换
        [scene requestGeometryUpdateWithPreferences:geometryPreferencesIOS errorHandler:^(NSError * _Nonnull error) {
            NSLog(@"错误:%@", error);
        }];
    } else {
        [[UIDevice currentDevice] setValue:[NSNumber numberWithInt:UIInterfaceOrientationUnknown] forKey:@"orientation"];
            [[UIDevice currentDevice] setValue:[NSNumber numberWithInt:UIInterfaceOrientationPortrait] forKey:@"orientation"];
    }
}

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    
    //注册海外相关平台
    if ([CHUtility sharedManager].isOS) {
        if ([CHUtility sharedManager].isDebug) {
            [[RXService sharedSDK] initWithProductId:self.model.productId
                                           channelId:self.model.channelId
                                                cpid:self.model.cpid
                                         baseUrlList:@[self.model.baseUrl]
                                            complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                if (!error) {
                    NSLog(@"初始化成功");
                } else {
                    NSLog(@"初始化失败");
                }
            }];
            [[RXPushService sharedSDK] initWithProductId:self.model.productId
                                               channelId:self.model.channelId
                                                    cpid:self.model.cpid
                                             baseUrlList:@[self.model.baseUrl]];
        }else{
            [[RXService sharedSDK] initWithProductId:@"SDKOS"
                                           channelId:@"iOSOS"
                                                cpid:@"119"
                                         baseUrlList:@[@"http://os-api-test.ruixueyun.com"]
                                            complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                if (!error) {
                    NSLog(@"初始化成功");
                } else {
                    NSLog(@"初始化失败");
                }
            }];
            [[RXPushService sharedSDK] initWithProductId:@"SDKOS"
                                               channelId:@"iOSOS"
                                                    cpid:@"119"
                                             baseUrlList:@[@"http://os-api-test.ruixueyun.com"]];
        }
        
        [[RXGoogleService sharedSDK] GRegistWithClientID:@"875255664003-eorr371qavp578ro0beafnfudr4upf1c.apps.googleusercontent.com"];
//        [[RXFacebookService sharedSDK] FBRegistWithApplication:application launchOptions:launchOptions];
//        [[RXTikTokService sharedSDK] TTRegistWithApplication:application launchOptions:launchOptions];
        [[RXZaloService sharedSDK] initWithAppId:@"1290303975374472026"];
        [[RXRedditService sharedSDK] initWithClientID:@"MjsG77lLx0ndS4u8JPjqCw" redirectURI:@"http://localhost"];
        [[RXInstagramService sharedSDK] initWithClientID:@"400197956108491" redirectURI:@"https://ruixue.com/instagram/oauth2"];
        
    }else{//国内平台
        if ([CHUtility sharedManager].isDebug) {
            [[RXService sharedSDK] initWithProductId:self.model.productId
                                           channelId:self.model.channelId
                                                cpid:self.model.cpid
                                         baseUrlList:@[self.model.baseUrl]
                                            complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                if (!error) {
                    NSLog(@"初始化成功");
                } else {
                    NSLog(@"初始化失败");
                }
            }];
            [[RXPushService sharedSDK] initWithProductId:self.model.productId
                                               channelId:self.model.channelId
                                                    cpid:self.model.cpid
                                             baseUrlList:@[self.model.baseUrl]];
        }else{
            [[RXService sharedSDK] initWithProductId:@"1002"
                                           channelId:@"iOS"
                                                cpid:@"114"
                                         baseUrlList:@[@"https://cn-api-test.ruixueyun.com/"]
                                            complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                if (!error) {
                    NSLog(@"初始化成功");
                } else {
                    NSLog(@"初始化失败");
                }
            }];
            [[RXPushService sharedSDK] initWithProductId:@"1002"
                                               channelId:@"iOS"
                                                    cpid:@"114"
                                             baseUrlList:@[@"https://cn-api-test.ruixueyun.com/"]];
            
        }
        
        [[RXWXService sharedSDK] configUniversallink:@"https://api.7nightapp.com/ulink/"];
    }
    
    self.view.backgroundColor = [UIColor colorWithHexString:@"#F6F5FA"];
    
    self.navigationController.navigationBar.hidden = YES;
    
    [CHUtility sharedManager].language = @"zh";
    
    // 延迟设置默认值，需要等待viewWillAppear执行完毕
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        self.isAC = YES;
        [Tool sharedSDK].interface = 1;
        [CHUtility sharedManager].loginType = 1;
    });
    
    [self setUI];
}

#pragma mark -- setUI
- (void)setUI
{
    UIView *configView = [self configView];
    UIView *loginView = [self loginView];
    
    [self.view addSubview:self.mScrollView];
    [self.mScrollView sd_addSubviews:@[self.topBgView, self.topImageView, self.topTitleLbl, self.topDesLbl, self.backBtn, self.languageView, configView, loginView]];
    [self.view addSubview:self.startBtn];
    
    _mScrollView.sd_layout.topEqualToView(self.view)
    .leftEqualToView(self.view)
    .rightEqualToView(self.view)
    .bottomEqualToView(self.view);
    
    _topBgView.sd_layout.topSpaceToView(self.mScrollView, -kStatusBarHeight)
    .leftSpaceToView(self.mScrollView, 0)
    .rightSpaceToView(self.mScrollView, 0)
    .heightIs(kScaleWidth(181) + kStatusBarHeight);
    
    _backBtn.sd_layout.topSpaceToView(self.mScrollView, kScaleWidth(65))
    .leftSpaceToView(self.mScrollView, 24)
    .widthIs(18)
    .heightIs(18);
    
    _topImageView.sd_layout.topSpaceToView(self.mScrollView, 50)
    .rightSpaceToView(self.mScrollView, 16)
    .widthIs(kScaleWidth(128))
    .heightEqualToWidth();
    
    _topTitleLbl.sd_layout.topSpaceToView(self.mScrollView, kScaleWidth(63))
    .leftSpaceToView(_backBtn, 8)
    .widthIs(200)
    .heightIs(22);
    
    _topDesLbl.sd_layout.topSpaceToView(_topTitleLbl, 8)
    .leftEqualToView(_topTitleLbl)
    .widthIs(200)
    .heightIs(16);
    
    _languageView.sd_layout.topSpaceToView(_topBgView, -32)
    .leftSpaceToView(self.mScrollView, 0)
    .rightSpaceToView(self.mScrollView, 0)
    .heightIs(64);
    
    configView.sd_layout.topSpaceToView(_languageView, 20)
    .leftSpaceToView(self.mScrollView, 0)
    .rightSpaceToView(self.mScrollView, 0)
    .heightIs(250);
    
    __block NSArray *loginTypes = @[@"guest", @"username", @"code", @"wechat", @"auth"];
    if ([CHUtility sharedManager].isOS) {
        loginTypes = @[@"guest", @"username", @"code", @"auth", @"google", @"facebook", @"line", @"zalo", @"tiktok", @"snapchat", @"instagram", @"reddit"];
    }
    [[CHUtility sharedManager] checkLoginTypes:loginTypes backBlock:^(NSArray * _Nonnull sloginTypes, NSArray * _Nonnull sloginTitles, NSArray * _Nonnull sloginImgs) {
        loginTypes = sloginTypes;
    }];
    
    CGFloat loginViewH = (54 + 8) * loginTypes.count + 30;
    loginView.sd_layout.topSpaceToView(configView, 2)
    .leftSpaceToView(self.mScrollView, 0)
    .rightSpaceToView(self.mScrollView, 0)
    .heightIs(loginViewH);
    
    _startBtn.sd_layout.bottomSpaceToView(self.view, 30)
    .leftSpaceToView(self.view, 24)
    .rightSpaceToView(self.view, 24)
    .heightIs(54);
    
    [self.view layoutSubviews];
    [self.mScrollView layoutSubviews];
    
    CGFloat height = 850 + (loginTypes.count - 3) * (54 + 8);
    self.mScrollView.contentSize = CGSizeMake(CGRectGetWidth(self.view.frame), height);
    
    [self.topBgView.layer addSublayer:[UIView setGradualChangingColor:self.topBgView fromColor:[UIColor colorWithHexString:@"#70E1DA"] toColor:[UIColor colorWithHexString:@"#4AC4CE"] gradualType:GradualTypeHorizontal]];
    
    self.topBgView.layer.mask = [UIView drawCornerRadiusWithRect:CGRectMake(0, 0, self.topBgView.width_sd, self.topBgView.height_sd) corners:UIRectCornerBottomLeft | UIRectCornerBottomRight size:CGSizeMake(15, 15)];
}

#pragma mark -- actions
- (void)backBtnAction
{
    [[CHUtility sharedManager].loginTypes removeAllObjects];
    [[CHUtility sharedManager].loginTypes addObject:@"apple"];
    [self.navigationController popViewControllerAnimated:YES];
}

- (void)startBtnAction
{
    if (self.isAC) {
        [Tool sharedSDK].interface = 1;
    }
    CHLoginViewController *loginVC = [[CHLoginViewController alloc] init];
    [self.navigationController pushViewController:loginVC animated:YES];
}

#pragma mark -- setter && getter
- (UIView *)configView
{
    UIView *configView = [[UIView alloc] init];
    
    UILabel *titleLbl = [[UILabel alloc] init];
    titleLbl.text = @"基础配置";
    titleLbl.font = [UIFont boldSystemFontOfSize:16];
    titleLbl.textColor = [UIColor blackColor];
    
    // subView1
    CHSettingCellModel *model1 = [[CHSettingCellModel alloc] init];
    model1.title = @"屏幕方向";
    model1.btntitle1 = @"横版";
    model1.btntitle2 = @"竖版";
    model1.img = @"setting_screen";
    
    CHSettingConfigView *subView1 = [[CHSettingConfigView alloc] init];
    subView1.backgroundColor = [UIColor whiteColor];
    subView1.layer.cornerRadius = 15;
    [subView1 setModel:model1];
    subView1.selectBlock = ^(NSInteger index) {
        [Tool sharedSDK].interface = index;
        self.isAC = index == 1 ? YES : NO;
    };
    
    // subView2
    CHSettingCellModel *model2 = [[CHSettingCellModel alloc] init];
    model2.title = @"默认登录 -- 暂不支持";
    model2.img = @"setting_login";
//    if ([Tool sharedSDK].isAudit) {
//        model2.btntitle1 = @"苹果登录";
//        model2.btntitle2 = @"";
//    }else{
        model2.btntitle1 = @"验证码登录";
        model2.btntitle2 = @"账号登录";
//    }
    
    CHSettingConfigView *subView2 = [[CHSettingConfigView alloc] init];
    subView2.backgroundColor = [UIColor whiteColor];
    subView2.layer.cornerRadius = 15;
    [subView2 setModel:model2];
    subView2.selectBlock = ^(NSInteger index) {
        [CHUtility sharedManager].loginType = index;
    };
//    if ([Tool sharedSDK].isAudit) {
//        subView2.selectBtn.hidden = NO;
//        subView2.selectBtn1.hidden = YES;
//    }else{
        subView2.selectBtn.hidden = NO;
        subView2.selectBtn1.hidden = NO;
//    }
    
    [configView sd_addSubviews:@[titleLbl, subView1, subView2]];
    
    titleLbl.sd_layout.topSpaceToView(configView, 0)
    .leftSpaceToView(configView, 24)
    .widthIs(100)
    .heightIs(18);
    
    subView1.sd_layout.topSpaceToView(titleLbl, 18)
    .leftEqualToView(titleLbl)
    .rightSpaceToView(configView, 24)
    .heightIs(88);
    
    subView2.sd_layout.topSpaceToView(subView1, 18)
    .leftEqualToView(titleLbl)
    .rightSpaceToView(configView, 24)
    .heightIs(88);
    
    return configView;
}

- (UIView *)loginView
{
    UIView *loginView = [[UIView alloc] init];
    
    UILabel *titleLbl = [[UILabel alloc] init];
    titleLbl.text = @"快捷登录方式";
    titleLbl.font = [UIFont boldSystemFontOfSize:16];
    titleLbl.textColor = [UIColor blackColor];
    
    UILabel *subTitle = [[UILabel alloc] init];
    subTitle.backgroundColor = [UIColor colorWithHexString:@"#EFEDF3"];
    subTitle.text = @"可多选";
    subTitle.textAlignment = NSTextAlignmentCenter;
    subTitle.textColor = [UIColor colorWithHexString:@"#A29FAC"];
    subTitle.font = [UIFont systemFontOfSize:12];
    subTitle.layer.masksToBounds = YES;
    subTitle.layer.cornerRadius = 11;
    
    [loginView sd_addSubviews:@[titleLbl, subTitle]];
    
    titleLbl.sd_layout.topSpaceToView(loginView, 0)
    .leftSpaceToView(loginView, 24)
    .widthIs(100)
    .heightIs(18);
    
    subTitle.sd_layout.topSpaceToView(loginView, 0)
    .rightSpaceToView(loginView, 24)
    .widthIs(56)
    .heightIs(22);
    
    /*
     loginTypes = @[@"guest", @"username", @"code", @"wechat", @"auth", @"google", @"facebook", @"line", @"zalo", @"tiktok", @"snapchat", @"instagram", @"reddit"];
     loginTitles = @[@"游客登录", @"账号登录", @"验证码登录", @"微信登录", @"本机一键登录", @"谷歌登录", @"facebook登录", @"line登录", @"zalo登录", @"tiktok登录", @"snapchat登录", @"instagram登录", @"reddit登录"];
     loginImgs = @[@"login_guest", @"login_account", @"login_code", @"rx_login_wechat", @"rx_login_auth", @"rx_login_google", @"rx_login_facebook", @"rx_login_line", @"rx_login_zalo", @"rx_login_tiktok", @"rx_login_snapchat", @"rx_login_instagram", @"rx_login_reddit"];
     */
    __block NSArray *loginTypes = @[@"guest", @"username", @"code", @"wechat", @"auth"];
    __block NSArray *loginTitles = [NSArray array];
    __block NSArray *loginImgs = [NSArray array];
    
    if ([CHUtility sharedManager].isOS) {
        loginTypes = @[@"guest", @"username", @"code", @"auth", @"google", @"facebook", @"line", @"zalo", @"tiktok", @"snapchat", @"instagram", @"reddit"];
    }
    
    [[CHUtility sharedManager] checkLoginTypes:loginTypes backBlock:^(NSArray * _Nonnull sloginTypes, NSArray * _Nonnull sloginTitles, NSArray * _Nonnull sloginImgs) {
        loginTypes = sloginTypes;
        loginTitles = sloginTitles;
        loginImgs = sloginImgs;
    }];
    
    CGFloat itemY = 18;
    
    for (int i = 0; i < loginTypes.count; i++) {
        CHSettingCellModel *model = [[CHSettingCellModel alloc] init];
        model.title = loginTitles[i];
        model.img = loginImgs[i];
        model.loginType = loginTypes[i];
        
        CHSettingLoginView *subView = [[CHSettingLoginView alloc] init];
        subView.backgroundColor = [UIColor whiteColor];
        subView.layer.cornerRadius = 15;
        [subView setModel:model];
        subView.selectBlock = ^(BOOL isSelected) {
            NSString *loginType = model.loginType;
            if (isSelected) {
                [[CHUtility sharedManager].loginTypes addObject:loginType];
            } else {
                [[CHUtility sharedManager].loginTypes removeObject:loginType];
            }
        };
        
        [loginView addSubview:subView];
        
        subView.sd_layout.topSpaceToView(titleLbl, itemY)
        .leftSpaceToView(loginView, 24)
        .rightSpaceToView(loginView, 24)
        .heightIs(54);
        
        itemY = itemY + 8 + 54;
    }
//    if ([Tool sharedSDK].isAudit) {
//        loginView.hidden = YES;
//    }else{
        loginView.hidden = NO;
//    }
    
    return loginView;
}

#pragma mark -- lazy
- (UIScrollView *)mScrollView
{
    if (!_mScrollView) {
        _mScrollView = [[UIScrollView alloc] init];
        _mScrollView.backgroundColor = [UIColor colorWithHexString:@"#F6F5FA"];
        _mScrollView.bounces = NO;
    }
    return _mScrollView;
}

- (UIView *)topBgView
{
    if (!_topBgView) {
        _topBgView = [[UIView alloc] init];
    }
    return _topBgView;
}

- (UIImageView *)topImageView
{
    if (!_topImageView) {
        _topImageView = [[UIImageView alloc] init];
        _topImageView.image = kImageNamed(@"setting_bg");
    }
    return _topImageView;
}

- (UILabel *)topTitleLbl
{
    if (!_topTitleLbl) {
        _topTitleLbl = [[UILabel alloc] init];
        _topTitleLbl.textColor = [UIColor whiteColor];
        _topTitleLbl.font = [UIFont boldSystemFontOfSize:20];
        _topTitleLbl.text = @"Welcome";
    }
    return _topTitleLbl;
}

- (UILabel *)topDesLbl
{
    if (!_topDesLbl) {
        _topDesLbl = [[UILabel alloc] init];
        _topDesLbl.textColor = [UIColor whiteColor];
        _topDesLbl.font = [UIFont systemFontOfSize:12];
        _topDesLbl.text = [NSString stringWithFormat:@"version - %@", Version];
    }
    return _topDesLbl;
}

- (UIButton *)backBtn
{
    if (!_backBtn) {
        _backBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_backBtn setImage:kImageNamed(@"back") forState:UIControlStateNormal];
        [_backBtn addTarget:self action:@selector(backBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _backBtn;
}

- (CHSelectLanguageView *)languageView
{
    if (!_languageView) {
        _languageView = [[CHSelectLanguageView alloc] init];
    }
    return _languageView;
}

- (UIButton *)startBtn
{
    if (!_startBtn) {
        _startBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_startBtn setTitle:@"开始体验" forState:UIControlStateNormal];
        [_startBtn setTitleColor:[UIColor colorWithHexString:@"#F2FFFB"] forState:normal];
        _startBtn.titleLabel.font = [UIFont boldSystemFontOfSize:20];
        [self.startBtn setBackgroundColor:[UIColor colorWithHexString:@"70E1DA"]];
        [_startBtn addTarget:self action:@selector(startBtnAction) forControlEvents:UIControlEventTouchUpInside];
        _startBtn.layer.cornerRadius = 15;
    }
    return _startBtn;
}

@end
