//
//  LoginViewController.m
//  RXSDKDemo-iOS
//
//  Created by RXSDK on 2026/1/22.
//
//  登录配置页面
//  根据环境配置展示不同的登录方式选择
//  国内：账号密码、验证码、微信、apple、游客
//  海外：账号密码、验证码、apple、google、facebook、line、zalo、instagram、tiktok、reddit
//

#import "LoginViewController.h"
#import "RXSDKManager.h"
#import "ServicesViewController.h"
#import <objc/runtime.h>

// 颜色宏
#define UIColorFromHex(hexValue) [UIColor colorWithRed:((float)((hexValue & 0xFF0000) >> 16))/255.0 green:((float)((hexValue & 0xFF00) >> 8))/255.0 blue:((float)(hexValue & 0xFF))/255.0 alpha:1.0]

@interface LoginViewController ()

@property (nonatomic, strong) UIScrollView *scrollView;
@property (nonatomic, strong) UIView *contentView;

// Header
@property (nonatomic, strong) UIImageView *logoImageView;
@property (nonatomic, strong) UILabel *titleLabel;
@property (nonatomic, strong) UILabel *environmentLabel;

// Login Methods Card
@property (nonatomic, strong) UIView *loginMethodsCard;
@property (nonatomic, strong) NSMutableArray<UIButton *> *loginMethodButtons;
@property (nonatomic, strong) NSMutableSet<NSString *> *selectedMethods;

// Login Button
@property (nonatomic, strong) UIButton *btnLogin;

@end

@implementation LoginViewController

// 国内登录方式
static NSArray<NSArray<NSString *> *> *_domesticLoginMethods;
// 海外登录方式
static NSArray<NSArray<NSString *> *> *_overseasLoginMethods;

+ (void)initialize {
    if (self == [LoginViewController class]) {
        _domesticLoginMethods = @[
            @[@"account", @"账号密码"],
            @[@"captcha", @"验证码"],
            @[@"wechat", @"微信"],
            @[@"apple", @"Apple"],
            @[@"guest", @"游客"]
        ];
        
        _overseasLoginMethods = @[
            @[@"account", @"账号密码"],
            @[@"captcha", @"验证码"],
            @[@"apple", @"Apple"],
            @[@"google", @"Google"],
            @[@"facebook", @"Facebook"],
            @[@"line", @"Line"],
            @[@"zalo", @"Zalo"],
            @[@"instagram", @"Instagram"],
            @[@"tiktok", @"TikTok"],
            @[@"reddit", @"Reddit"]
        ];
    }
}

- (void)viewDidLoad {
    [super viewDidLoad];
    
    self.view.backgroundColor = UIColorFromHex(0xF9FAFB);
    self.title = @"登录配置";
    
    self.loginMethodButtons = [NSMutableArray array];
    self.selectedMethods = [NSMutableSet set];
    
    [self setupUI];
}

- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    // 显示导航栏和返回按钮
    [self.navigationController setNavigationBarHidden:NO animated:animated];
}

#pragma mark - Setup UI

- (void)setupUI {
    // ScrollView
    self.scrollView = [[UIScrollView alloc] init];
    self.scrollView.translatesAutoresizingMaskIntoConstraints = NO;
    self.scrollView.showsVerticalScrollIndicator = NO;
    self.scrollView.alwaysBounceVertical = YES;
    [self.view addSubview:self.scrollView];
    
    self.contentView = [[UIView alloc] init];
    self.contentView.translatesAutoresizingMaskIntoConstraints = NO;
    [self.scrollView addSubview:self.contentView];
    
    [NSLayoutConstraint activateConstraints:@[
        [self.scrollView.topAnchor constraintEqualToAnchor:self.view.safeAreaLayoutGuide.topAnchor],
        [self.scrollView.leadingAnchor constraintEqualToAnchor:self.view.leadingAnchor],
        [self.scrollView.trailingAnchor constraintEqualToAnchor:self.view.trailingAnchor],
        [self.scrollView.bottomAnchor constraintEqualToAnchor:self.view.bottomAnchor],
        
        [self.contentView.topAnchor constraintEqualToAnchor:self.scrollView.topAnchor],
        [self.contentView.leadingAnchor constraintEqualToAnchor:self.scrollView.leadingAnchor],
        [self.contentView.trailingAnchor constraintEqualToAnchor:self.scrollView.trailingAnchor],
        [self.contentView.bottomAnchor constraintEqualToAnchor:self.scrollView.bottomAnchor],
        [self.contentView.widthAnchor constraintEqualToAnchor:self.scrollView.widthAnchor]
    ]];
    
    [self setupHeader];
    [self setupLoginMethodsCard];
    [self setupLoginButton];
}

#pragma mark - Header

- (void)setupHeader {
    // Logo
    self.logoImageView = [[UIImageView alloc] init];
    self.logoImageView.translatesAutoresizingMaskIntoConstraints = NO;
    self.logoImageView.image = [UIImage imageNamed:@"ic_logo"];
    self.logoImageView.contentMode = UIViewContentModeScaleAspectFit;
    self.logoImageView.layer.cornerRadius = 16;
    self.logoImageView.clipsToBounds = YES;
    [self.contentView addSubview:self.logoImageView];
    
    // 标题
    self.titleLabel = [[UILabel alloc] init];
    self.titleLabel.translatesAutoresizingMaskIntoConstraints = NO;
    self.titleLabel.text = @"登录配置";
    self.titleLabel.font = [UIFont systemFontOfSize:20 weight:UIFontWeightBold];
    self.titleLabel.textColor = UIColorFromHex(0x101828);
    self.titleLabel.textAlignment = NSTextAlignmentCenter;
    [self.contentView addSubview:self.titleLabel];
    
    // 环境标签
    self.environmentLabel = [[UILabel alloc] init];
    self.environmentLabel.translatesAutoresizingMaskIntoConstraints = NO;
    NSString *envName = [[RXSDKManager sharedManager] isDomestic] ? @"国内" : @"海外";
    self.environmentLabel.text = [NSString stringWithFormat:@"当前环境: %@", envName];
    self.environmentLabel.font = [UIFont systemFontOfSize:14 weight:UIFontWeightSemibold];
    self.environmentLabel.textColor = UIColorFromHex(0x4285F4);
    self.environmentLabel.textAlignment = NSTextAlignmentCenter;
    [self.contentView addSubview:self.environmentLabel];
    
    [NSLayoutConstraint activateConstraints:@[
        [self.logoImageView.topAnchor constraintEqualToAnchor:self.contentView.topAnchor constant:16],
        [self.logoImageView.centerXAnchor constraintEqualToAnchor:self.contentView.centerXAnchor],
        [self.logoImageView.widthAnchor constraintEqualToConstant:64],
        [self.logoImageView.heightAnchor constraintEqualToConstant:64],
        
        [self.titleLabel.topAnchor constraintEqualToAnchor:self.logoImageView.bottomAnchor constant:12],
        [self.titleLabel.centerXAnchor constraintEqualToAnchor:self.contentView.centerXAnchor],
        
        [self.environmentLabel.topAnchor constraintEqualToAnchor:self.titleLabel.bottomAnchor constant:4],
        [self.environmentLabel.centerXAnchor constraintEqualToAnchor:self.contentView.centerXAnchor]
    ]];
}

#pragma mark - Login Methods Card

- (void)setupLoginMethodsCard {
    self.loginMethodsCard = [[UIView alloc] init];
    self.loginMethodsCard.translatesAutoresizingMaskIntoConstraints = NO;
    self.loginMethodsCard.backgroundColor = [UIColor whiteColor];
    self.loginMethodsCard.layer.cornerRadius = 16;
    self.loginMethodsCard.layer.borderWidth = 1;
    self.loginMethodsCard.layer.borderColor = UIColorFromHex(0xE5E7EB).CGColor;
    [self.contentView addSubview:self.loginMethodsCard];
    
    // 标题
    UILabel *cardTitle = [[UILabel alloc] init];
    cardTitle.translatesAutoresizingMaskIntoConstraints = NO;
    cardTitle.text = @"选择登录方式";
    cardTitle.font = [UIFont systemFontOfSize:14 weight:UIFontWeightSemibold];
    cardTitle.textColor = UIColorFromHex(0x364153);
    [self.loginMethodsCard addSubview:cardTitle];
    
    // 副标题
    UILabel *cardSubtitle = [[UILabel alloc] init];
    cardSubtitle.translatesAutoresizingMaskIntoConstraints = NO;
    cardSubtitle.text = @"可多选，将按选中顺序展示";
    cardSubtitle.font = [UIFont systemFontOfSize:12];
    cardSubtitle.textColor = UIColorFromHex(0x4A5565);
    [self.loginMethodsCard addSubview:cardSubtitle];
    
    [NSLayoutConstraint activateConstraints:@[
        [self.loginMethodsCard.topAnchor constraintEqualToAnchor:self.environmentLabel.bottomAnchor constant:24],
        [self.loginMethodsCard.leadingAnchor constraintEqualToAnchor:self.contentView.leadingAnchor constant:24],
        [self.loginMethodsCard.trailingAnchor constraintEqualToAnchor:self.contentView.trailingAnchor constant:-24],
        
        [cardTitle.topAnchor constraintEqualToAnchor:self.loginMethodsCard.topAnchor constant:18],
        [cardTitle.leadingAnchor constraintEqualToAnchor:self.loginMethodsCard.leadingAnchor constant:18],
        
        [cardSubtitle.topAnchor constraintEqualToAnchor:cardTitle.bottomAnchor constant:4],
        [cardSubtitle.leadingAnchor constraintEqualToAnchor:self.loginMethodsCard.leadingAnchor constant:18]
    ]];
    
    // 创建登录方式按钮
    NSArray<NSArray<NSString *> *> *methods = [[RXSDKManager sharedManager] isDomestic] ? _domesticLoginMethods : _overseasLoginMethods;
    
    UIView *lastButton = nil;
    
    for (NSInteger i = 0; i < methods.count; i++) {
        NSArray<NSString *> *method = methods[i];
        UIButton *button = [self createLoginMethodButton:method[1] methodId:method[0]];
        button.translatesAutoresizingMaskIntoConstraints = NO;
        [self.loginMethodsCard addSubview:button];
        [self.loginMethodButtons addObject:button];
        
        // 默认选中第一个
        if (i == 0) {
            [self selectMethod:method[0] button:button];
        }
        
        if (lastButton) {
            [button.topAnchor constraintEqualToAnchor:lastButton.bottomAnchor constant:8].active = YES;
        } else {
            [button.topAnchor constraintEqualToAnchor:cardSubtitle.bottomAnchor constant:16].active = YES;
        }
        
        [NSLayoutConstraint activateConstraints:@[
            [button.leadingAnchor constraintEqualToAnchor:self.loginMethodsCard.leadingAnchor constant:18],
            [button.trailingAnchor constraintEqualToAnchor:self.loginMethodsCard.trailingAnchor constant:-18],
            [button.heightAnchor constraintEqualToConstant:48]
        ]];
        
        lastButton = button;
    }
    
    // 设置卡片底部约束
    if (lastButton) {
        [lastButton.bottomAnchor constraintEqualToAnchor:self.loginMethodsCard.bottomAnchor constant:-18].active = YES;
    }
}

- (UIButton *)createLoginMethodButton:(NSString *)title methodId:(NSString *)methodId {
    UIButton *button = [UIButton buttonWithType:UIButtonTypeCustom];
    [button setTitle:title forState:UIControlStateNormal];
    [button setTitleColor:UIColorFromHex(0x364153) forState:UIControlStateNormal];
    button.titleLabel.font = [UIFont systemFontOfSize:16];
    button.contentHorizontalAlignment = UIControlContentHorizontalAlignmentLeft;
    button.contentEdgeInsets = UIEdgeInsetsMake(0, 16, 0, 16);
    button.layer.cornerRadius = 8;
    button.layer.borderWidth = 1;
    button.layer.borderColor = UIColorFromHex(0xE5E7EB).CGColor;
    button.backgroundColor = [UIColor whiteColor];
    button.tag = [methodId hash];
    
    // 添加自定义属性存储 methodId
    objc_setAssociatedObject(button, "methodId", methodId, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
    
    [button addTarget:self action:@selector(loginMethodButtonTapped:) forControlEvents:UIControlEventTouchUpInside];
    
    return button;
}

- (void)loginMethodButtonTapped:(UIButton *)button {
    NSString *methodId = objc_getAssociatedObject(button, "methodId");
    
    if ([self.selectedMethods containsObject:methodId]) {
        [self deselectMethod:methodId button:button];
    } else {
        [self selectMethod:methodId button:button];
    }
}

- (void)selectMethod:(NSString *)methodId button:(UIButton *)button {
    [self.selectedMethods addObject:methodId];
    button.backgroundColor = UIColorFromHex(0xEFF6FF);
    button.layer.borderColor = UIColorFromHex(0x4285F4).CGColor;
    [button setTitleColor:UIColorFromHex(0x4285F4) forState:UIControlStateNormal];
}

- (void)deselectMethod:(NSString *)methodId button:(UIButton *)button {
    [self.selectedMethods removeObject:methodId];
    button.backgroundColor = [UIColor whiteColor];
    button.layer.borderColor = UIColorFromHex(0xE5E7EB).CGColor;
    [button setTitleColor:UIColorFromHex(0x364153) forState:UIControlStateNormal];
}

#pragma mark - Login Button

- (void)setupLoginButton {
    self.btnLogin = [UIButton buttonWithType:UIButtonTypeCustom];
    self.btnLogin.translatesAutoresizingMaskIntoConstraints = NO;
    [self.btnLogin setTitle:@"登录" forState:UIControlStateNormal];
    [self.btnLogin setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    self.btnLogin.titleLabel.font = [UIFont systemFontOfSize:16 weight:UIFontWeightBold];
    self.btnLogin.layer.cornerRadius = 12;
    self.btnLogin.clipsToBounds = YES;
    self.btnLogin.backgroundColor = UIColorFromHex(0x4285F4);
    [self.btnLogin addTarget:self action:@selector(loginButtonTapped) forControlEvents:UIControlEventTouchUpInside];
    [self.contentView addSubview:self.btnLogin];
    
    [NSLayoutConstraint activateConstraints:@[
        [self.btnLogin.topAnchor constraintEqualToAnchor:self.loginMethodsCard.bottomAnchor constant:24],
        [self.btnLogin.leadingAnchor constraintEqualToAnchor:self.contentView.leadingAnchor constant:24],
        [self.btnLogin.trailingAnchor constraintEqualToAnchor:self.contentView.trailingAnchor constant:-24],
        [self.btnLogin.heightAnchor constraintEqualToConstant:56],
        [self.btnLogin.bottomAnchor constraintEqualToAnchor:self.contentView.bottomAnchor constant:-24]
    ]];
}

#pragma mark - Actions

- (void)loginButtonTapped {
    if (self.selectedMethods.count == 0) {
        [self showAlert:@"提示" message:@"请至少选择一种登录方式"];
        return;
    }
    
    // 获取第一个选中的登录方式
    NSString *loginMethod = [self.selectedMethods anyObject];
    
    // 显示登录中
    self.btnLogin.enabled = NO;
    [self.btnLogin setTitle:@"登录中..." forState:UIControlStateNormal];
    
    // TODO: 调用 SDK 登录
    // RXLoginConfig *config = [[RXLoginConfig alloc] init];
    // config.loginType = [self getLoginTypeFromMethod:loginMethod];
    // [[RXSDK sharedSDK] loginWithConfig:config complete:^(NSDictionary *response, RX_CommonRequestError *error) { ... }];
    
    // 模拟登录成功
    __weak typeof(self) weakSelf = self;
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        __strong typeof(weakSelf) strongSelf = weakSelf;
        if (!strongSelf) return;
        
        strongSelf.btnLogin.enabled = YES;
        [strongSelf.btnLogin setTitle:@"登录" forState:UIControlStateNormal];
        
        // 登录成功，直接跳转到服务页面
        ServicesViewController *servicesVC = [[ServicesViewController alloc] init];
        [strongSelf.navigationController pushViewController:servicesVC animated:YES];
    });
}

- (void)showAlert:(NSString *)title message:(NSString *)message {
    UIAlertController *alert = [UIAlertController alertControllerWithTitle:title
                                                                   message:message
                                                            preferredStyle:UIAlertControllerStyleAlert];
    
    UIAlertAction *okAction = [UIAlertAction actionWithTitle:@"OK"
                                                       style:UIAlertActionStyleDefault
                                                     handler:nil];
    [alert addAction:okAction];
    
    [self presentViewController:alert animated:YES completion:nil];
}

@end
