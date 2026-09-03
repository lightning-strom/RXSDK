//
//  ViewController.m
//  RXSDKDemo-iOS
//
//  Created by RXSDK on 2026/1/21.
//
//  UI 层只负责界面展示和用户交互
//  SDK 接口调用统一由 RXSDKManager 管理
//
//  API 文档关联（详见 RXSDK-Doc/demo/api-mapping.md）
//

#import "ViewController.h"
#import "RXSDKManager.h"
#import "LoginViewController.h"

// 颜色宏
#define UIColorFromHex(hexValue) [UIColor colorWithRed:((float)((hexValue & 0xFF0000) >> 16))/255.0 green:((float)((hexValue & 0xFF00) >> 8))/255.0 blue:((float)(hexValue & 0xFF))/255.0 alpha:1.0]

@interface ViewController () <UIScrollViewDelegate>

@property (nonatomic, strong) UIScrollView *scrollView;
@property (nonatomic, strong) UIView *contentView;

// Logo 区域
@property (nonatomic, strong) UIView *logoContainer;
@property (nonatomic, strong) UIImageView *logoImageView;
@property (nonatomic, strong) UILabel *titleLabel;
@property (nonatomic, strong) UILabel *subtitleLabel;

// SDK Status 卡片
@property (nonatomic, strong) UIView *statusCard;
@property (nonatomic, strong) UILabel *statusTitleLabel;
@property (nonatomic, strong) UIView *statusDot;
@property (nonatomic, strong) UILabel *statusDescLabel;
@property (nonatomic, strong) UIView *mInitButtonsContainer;
@property (nonatomic, strong) UIButton *btnDefaultInit;
@property (nonatomic, strong) UIButton *btnCustomInit;
@property (nonatomic, strong) UIButton *btnResetSdk;

// 语言设置卡片
@property (nonatomic, strong) UIView *languageCard;
@property (nonatomic, strong) UILabel *languageTitleLabel;
@property (nonatomic, strong) UILabel *currentLanguageLabel;
@property (nonatomic, strong) UIButton *btnSelectLanguage;

// 屏幕方向设置卡片
@property (nonatomic, strong) UIView *orientationCard;
@property (nonatomic, strong) UILabel *orientationTitleLabel;
@property (nonatomic, strong) UILabel *currentOrientationLabel;
@property (nonatomic, strong) UIButton *btnPortrait;
@property (nonatomic, strong) UIButton *btnLandscape;

// 环境设置卡片
@property (nonatomic, strong) UIView *environmentCard;
@property (nonatomic, strong) UILabel *environmentTitleLabel;
@property (nonatomic, strong) UILabel *currentEnvironmentLabel;
@property (nonatomic, strong) UIButton *btnDomestic;
@property (nonatomic, strong) UIButton *btnOverseas;

// 配置完成按钮
@property (nonatomic, strong) UIButton *btnConfigComplete;

// Framework 信息
@property (nonatomic, strong) UIView *frameworkInfoCard;

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    self.view.backgroundColor = UIColorFromHex(0xF9FAFB);
    
    [self setupUI];
}

- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    // 主页面隐藏导航栏
    [self.navigationController setNavigationBarHidden:YES animated:animated];
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
    
    [self setupLogoSection];
    [self setupStatusCard];
    [self setupLanguageCard];
    [self setupOrientationCard];
    [self setupEnvironmentCard];
    [self setupConfigCompleteButton];
    [self setupFrameworkInfo];
}

#pragma mark - Logo Section

- (void)setupLogoSection {
    self.logoContainer = [[UIView alloc] init];
    self.logoContainer.translatesAutoresizingMaskIntoConstraints = NO;
    [self.contentView addSubview:self.logoContainer];
    
    // Logo 图标 - 使用 UIImageView
    self.logoImageView = [[UIImageView alloc] init];
    self.logoImageView.translatesAutoresizingMaskIntoConstraints = NO;
    self.logoImageView.image = [UIImage imageNamed:@"ic_logo"];
    self.logoImageView.contentMode = UIViewContentModeScaleAspectFit;
    self.logoImageView.layer.cornerRadius = 24;
    self.logoImageView.clipsToBounds = YES;
    self.logoImageView.layer.shadowColor = [UIColor blackColor].CGColor;
    self.logoImageView.layer.shadowOpacity = 0.1;
    self.logoImageView.layer.shadowOffset = CGSizeMake(0, 4);
    self.logoImageView.layer.shadowRadius = 6;
    [self.logoContainer addSubview:self.logoImageView];
    
    // 标题
    self.titleLabel = [[UILabel alloc] init];
    self.titleLabel.translatesAutoresizingMaskIntoConstraints = NO;
    self.titleLabel.text = @"RXSDK Demo";
    self.titleLabel.font = [UIFont systemFontOfSize:24 weight:UIFontWeightBold];
    self.titleLabel.textColor = UIColorFromHex(0x101828);
    self.titleLabel.textAlignment = NSTextAlignmentCenter;
    [self.logoContainer addSubview:self.titleLabel];
    
    // 副标题
    self.subtitleLabel = [[UILabel alloc] init];
    self.subtitleLabel.translatesAutoresizingMaskIntoConstraints = NO;
    self.subtitleLabel.text = @"Complete iOS Framework Integration";
    self.subtitleLabel.font = [UIFont systemFontOfSize:14];
    self.subtitleLabel.textColor = UIColorFromHex(0x4A5565);
    self.subtitleLabel.textAlignment = NSTextAlignmentCenter;
    [self.logoContainer addSubview:self.subtitleLabel];
    
    [NSLayoutConstraint activateConstraints:@[
        [self.logoContainer.topAnchor constraintEqualToAnchor:self.contentView.topAnchor constant:24],
        [self.logoContainer.leadingAnchor constraintEqualToAnchor:self.contentView.leadingAnchor constant:24],
        [self.logoContainer.trailingAnchor constraintEqualToAnchor:self.contentView.trailingAnchor constant:-24],
        
        [self.logoImageView.topAnchor constraintEqualToAnchor:self.logoContainer.topAnchor],
        [self.logoImageView.centerXAnchor constraintEqualToAnchor:self.logoContainer.centerXAnchor],
        [self.logoImageView.widthAnchor constraintEqualToConstant:80],
        [self.logoImageView.heightAnchor constraintEqualToConstant:80],
        
        [self.titleLabel.topAnchor constraintEqualToAnchor:self.logoImageView.bottomAnchor constant:16],
        [self.titleLabel.centerXAnchor constraintEqualToAnchor:self.logoContainer.centerXAnchor],
        
        [self.subtitleLabel.topAnchor constraintEqualToAnchor:self.titleLabel.bottomAnchor constant:8],
        [self.subtitleLabel.centerXAnchor constraintEqualToAnchor:self.logoContainer.centerXAnchor],
        [self.subtitleLabel.bottomAnchor constraintEqualToAnchor:self.logoContainer.bottomAnchor]
    ]];
}

#pragma mark - Status Card

- (void)setupStatusCard {
    self.statusCard = [[UIView alloc] init];
    self.statusCard.translatesAutoresizingMaskIntoConstraints = NO;
    self.statusCard.backgroundColor = [UIColor whiteColor];
    self.statusCard.layer.cornerRadius = 16;
    self.statusCard.layer.borderWidth = 2;
    self.statusCard.layer.borderColor = UIColorFromHex(0xE5E7EB).CGColor;
    [self.contentView addSubview:self.statusCard];
    
    // SDK Status 标题
    self.statusTitleLabel = [[UILabel alloc] init];
    self.statusTitleLabel.translatesAutoresizingMaskIntoConstraints = NO;
    self.statusTitleLabel.text = @"SDK Status";
    self.statusTitleLabel.font = [UIFont systemFontOfSize:14 weight:UIFontWeightMedium];
    self.statusTitleLabel.textColor = UIColorFromHex(0x364153);
    [self.statusCard addSubview:self.statusTitleLabel];
    
    // 状态点
    self.statusDot = [[UIView alloc] init];
    self.statusDot.translatesAutoresizingMaskIntoConstraints = NO;
    self.statusDot.backgroundColor = UIColorFromHex(0x99A1AF);
    self.statusDot.layer.cornerRadius = 6;
    [self.statusCard addSubview:self.statusDot];
    
    // 状态描述
    self.statusDescLabel = [[UILabel alloc] init];
    self.statusDescLabel.translatesAutoresizingMaskIntoConstraints = NO;
    self.statusDescLabel.text = @"Initialize SDK to begin";
    self.statusDescLabel.font = [UIFont systemFontOfSize:12];
    self.statusDescLabel.textColor = UIColorFromHex(0x4A5565);
    [self.statusCard addSubview:self.statusDescLabel];
    
    // 初始化按钮容器
    self.mInitButtonsContainer = [[UIView alloc] init];
    self.mInitButtonsContainer.translatesAutoresizingMaskIntoConstraints = NO;
    [self.statusCard addSubview:self.mInitButtonsContainer];
    
    // 默认初始化按钮（使用纯色背景）
    self.btnDefaultInit = [UIButton buttonWithType:UIButtonTypeCustom];
    self.btnDefaultInit.translatesAutoresizingMaskIntoConstraints = NO;
    [self.btnDefaultInit setTitle:@"默认初始化" forState:UIControlStateNormal];
    [self.btnDefaultInit setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    self.btnDefaultInit.titleLabel.font = [UIFont systemFontOfSize:14 weight:UIFontWeightMedium];
    self.btnDefaultInit.layer.cornerRadius = 12;
    self.btnDefaultInit.clipsToBounds = YES;
    self.btnDefaultInit.backgroundColor = UIColorFromHex(0x4285F4);
    [self.btnDefaultInit addTarget:self action:@selector(defaultInitTapped) forControlEvents:UIControlEventTouchUpInside];
    [self.mInitButtonsContainer addSubview:self.btnDefaultInit];
    
    // 自定义初始化按钮
    self.btnCustomInit = [UIButton buttonWithType:UIButtonTypeCustom];
    self.btnCustomInit.translatesAutoresizingMaskIntoConstraints = NO;
    [self.btnCustomInit setTitle:@"自定义初始化" forState:UIControlStateNormal];
    [self.btnCustomInit setTitleColor:UIColorFromHex(0x4285F4) forState:UIControlStateNormal];
    self.btnCustomInit.titleLabel.font = [UIFont systemFontOfSize:14 weight:UIFontWeightMedium];
    self.btnCustomInit.layer.cornerRadius = 12;
    self.btnCustomInit.layer.borderWidth = 1.5;
    self.btnCustomInit.layer.borderColor = UIColorFromHex(0x4285F4).CGColor;
    self.btnCustomInit.backgroundColor = [UIColor whiteColor];
    [self.btnCustomInit addTarget:self action:@selector(customInitTapped) forControlEvents:UIControlEventTouchUpInside];
    [self.mInitButtonsContainer addSubview:self.btnCustomInit];
    
    // 重置按钮（初始隐藏）
    self.btnResetSdk = [UIButton buttonWithType:UIButtonTypeCustom];
    self.btnResetSdk.translatesAutoresizingMaskIntoConstraints = NO;
    [self.btnResetSdk setTitle:@"重置 SDK" forState:UIControlStateNormal];
    [self.btnResetSdk setTitleColor:UIColorFromHex(0x4A5565) forState:UIControlStateNormal];
    self.btnResetSdk.titleLabel.font = [UIFont systemFontOfSize:14 weight:UIFontWeightMedium];
    self.btnResetSdk.layer.cornerRadius = 12;
    self.btnResetSdk.layer.borderWidth = 1.5;
    self.btnResetSdk.layer.borderColor = UIColorFromHex(0xE5E7EB).CGColor;
    self.btnResetSdk.backgroundColor = [UIColor whiteColor];
    self.btnResetSdk.hidden = YES;
    [self.btnResetSdk addTarget:self action:@selector(resetSdkTapped) forControlEvents:UIControlEventTouchUpInside];
    [self.statusCard addSubview:self.btnResetSdk];
    
    [NSLayoutConstraint activateConstraints:@[
        [self.statusCard.topAnchor constraintEqualToAnchor:self.logoContainer.bottomAnchor constant:24],
        [self.statusCard.leadingAnchor constraintEqualToAnchor:self.contentView.leadingAnchor constant:24],
        [self.statusCard.trailingAnchor constraintEqualToAnchor:self.contentView.trailingAnchor constant:-24],
        
        [self.statusTitleLabel.topAnchor constraintEqualToAnchor:self.statusCard.topAnchor constant:18],
        [self.statusTitleLabel.leadingAnchor constraintEqualToAnchor:self.statusCard.leadingAnchor constant:18],
        
        [self.statusDot.centerYAnchor constraintEqualToAnchor:self.statusTitleLabel.centerYAnchor],
        [self.statusDot.trailingAnchor constraintEqualToAnchor:self.statusCard.trailingAnchor constant:-18],
        [self.statusDot.widthAnchor constraintEqualToConstant:12],
        [self.statusDot.heightAnchor constraintEqualToConstant:12],
        
        [self.statusDescLabel.topAnchor constraintEqualToAnchor:self.statusTitleLabel.bottomAnchor constant:8],
        [self.statusDescLabel.leadingAnchor constraintEqualToAnchor:self.statusCard.leadingAnchor constant:18],
        
        [self.mInitButtonsContainer.topAnchor constraintEqualToAnchor:self.statusDescLabel.bottomAnchor constant:12],
        [self.mInitButtonsContainer.leadingAnchor constraintEqualToAnchor:self.statusCard.leadingAnchor constant:18],
        [self.mInitButtonsContainer.trailingAnchor constraintEqualToAnchor:self.statusCard.trailingAnchor constant:-18],
        [self.mInitButtonsContainer.heightAnchor constraintEqualToConstant:48],
        [self.mInitButtonsContainer.bottomAnchor constraintEqualToAnchor:self.statusCard.bottomAnchor constant:-18],
        
        [self.btnDefaultInit.leadingAnchor constraintEqualToAnchor:self.mInitButtonsContainer.leadingAnchor],
        [self.btnDefaultInit.topAnchor constraintEqualToAnchor:self.mInitButtonsContainer.topAnchor],
        [self.btnDefaultInit.bottomAnchor constraintEqualToAnchor:self.mInitButtonsContainer.bottomAnchor],
        [self.btnDefaultInit.trailingAnchor constraintEqualToAnchor:self.mInitButtonsContainer.centerXAnchor constant:-6],
        
        [self.btnCustomInit.trailingAnchor constraintEqualToAnchor:self.mInitButtonsContainer.trailingAnchor],
        [self.btnCustomInit.topAnchor constraintEqualToAnchor:self.mInitButtonsContainer.topAnchor],
        [self.btnCustomInit.bottomAnchor constraintEqualToAnchor:self.mInitButtonsContainer.bottomAnchor],
        [self.btnCustomInit.leadingAnchor constraintEqualToAnchor:self.mInitButtonsContainer.centerXAnchor constant:6],
        
        [self.btnResetSdk.topAnchor constraintEqualToAnchor:self.statusDescLabel.bottomAnchor constant:12],
        [self.btnResetSdk.leadingAnchor constraintEqualToAnchor:self.statusCard.leadingAnchor constant:18],
        [self.btnResetSdk.trailingAnchor constraintEqualToAnchor:self.statusCard.trailingAnchor constant:-18],
        [self.btnResetSdk.heightAnchor constraintEqualToConstant:48]
    ]];
}

#pragma mark - Language Settings Card

- (void)setupLanguageCard {
    self.languageCard = [[UIView alloc] init];
    self.languageCard.translatesAutoresizingMaskIntoConstraints = NO;
    self.languageCard.backgroundColor = [UIColor whiteColor];
    self.languageCard.layer.cornerRadius = 16;
    self.languageCard.layer.borderWidth = 1;
    self.languageCard.layer.borderColor = UIColorFromHex(0xE5E7EB).CGColor;
    [self.contentView addSubview:self.languageCard];
    
    // 标题
    self.languageTitleLabel = [[UILabel alloc] init];
    self.languageTitleLabel.translatesAutoresizingMaskIntoConstraints = NO;
    self.languageTitleLabel.text = @"语言设置";
    self.languageTitleLabel.font = [UIFont systemFontOfSize:14 weight:UIFontWeightSemibold];
    self.languageTitleLabel.textColor = UIColorFromHex(0x364153);
    [self.languageCard addSubview:self.languageTitleLabel];
    
    // 当前语言显示
    self.currentLanguageLabel = [[UILabel alloc] init];
    self.currentLanguageLabel.translatesAutoresizingMaskIntoConstraints = NO;
    self.currentLanguageLabel.text = [[RXSDKManager sharedManager] currentLanguageDisplayName];
    self.currentLanguageLabel.font = [UIFont systemFontOfSize:14 weight:UIFontWeightSemibold];
    self.currentLanguageLabel.textColor = UIColorFromHex(0x4285F4);
    [self.languageCard addSubview:self.currentLanguageLabel];
    
    // 选择语言按钮
    self.btnSelectLanguage = [UIButton buttonWithType:UIButtonTypeSystem];
    self.btnSelectLanguage.translatesAutoresizingMaskIntoConstraints = NO;
    [self.btnSelectLanguage setTitle:@"选择语言" forState:UIControlStateNormal];
    [self.btnSelectLanguage setTitleColor:UIColorFromHex(0x4285F4) forState:UIControlStateNormal];
    self.btnSelectLanguage.titleLabel.font = [UIFont systemFontOfSize:14 weight:UIFontWeightSemibold];
    self.btnSelectLanguage.backgroundColor = [UIColor clearColor];
    self.btnSelectLanguage.layer.cornerRadius = 8;
    self.btnSelectLanguage.layer.borderWidth = 1;
    self.btnSelectLanguage.layer.borderColor = UIColorFromHex(0x4285F4).CGColor;
    [self.btnSelectLanguage addTarget:self action:@selector(selectLanguageTapped) forControlEvents:UIControlEventTouchUpInside];
    [self.languageCard addSubview:self.btnSelectLanguage];
    
    [NSLayoutConstraint activateConstraints:@[
        // Language Card
        [self.languageCard.topAnchor constraintEqualToAnchor:self.statusCard.bottomAnchor constant:16],
        [self.languageCard.leadingAnchor constraintEqualToAnchor:self.contentView.leadingAnchor constant:24],
        [self.languageCard.trailingAnchor constraintEqualToAnchor:self.contentView.trailingAnchor constant:-24],
        
        // 标题
        [self.languageTitleLabel.topAnchor constraintEqualToAnchor:self.languageCard.topAnchor constant:18],
        [self.languageTitleLabel.leadingAnchor constraintEqualToAnchor:self.languageCard.leadingAnchor constant:18],
        
        // 当前语言
        [self.currentLanguageLabel.centerYAnchor constraintEqualToAnchor:self.languageTitleLabel.centerYAnchor],
        [self.currentLanguageLabel.trailingAnchor constraintEqualToAnchor:self.languageCard.trailingAnchor constant:-18],
        
        // 选择按钮
        [self.btnSelectLanguage.topAnchor constraintEqualToAnchor:self.languageTitleLabel.bottomAnchor constant:12],
        [self.btnSelectLanguage.leadingAnchor constraintEqualToAnchor:self.languageCard.leadingAnchor constant:18],
        [self.btnSelectLanguage.trailingAnchor constraintEqualToAnchor:self.languageCard.trailingAnchor constant:-18],
        [self.btnSelectLanguage.heightAnchor constraintEqualToConstant:48],
        [self.btnSelectLanguage.bottomAnchor constraintEqualToAnchor:self.languageCard.bottomAnchor constant:-18],
    ]];
}

#pragma mark - Orientation Settings Card

- (void)setupOrientationCard {
    self.orientationCard = [[UIView alloc] init];
    self.orientationCard.translatesAutoresizingMaskIntoConstraints = NO;
    self.orientationCard.backgroundColor = [UIColor whiteColor];
    self.orientationCard.layer.cornerRadius = 16;
    self.orientationCard.layer.borderWidth = 1;
    self.orientationCard.layer.borderColor = UIColorFromHex(0xE5E7EB).CGColor;
    [self.contentView addSubview:self.orientationCard];
    
    // 标题
    self.orientationTitleLabel = [[UILabel alloc] init];
    self.orientationTitleLabel.translatesAutoresizingMaskIntoConstraints = NO;
    self.orientationTitleLabel.text = @"屏幕方向";
    self.orientationTitleLabel.font = [UIFont systemFontOfSize:14 weight:UIFontWeightSemibold];
    self.orientationTitleLabel.textColor = UIColorFromHex(0x364153);
    [self.orientationCard addSubview:self.orientationTitleLabel];
    
    // 当前方向显示
    self.currentOrientationLabel = [[UILabel alloc] init];
    self.currentOrientationLabel.translatesAutoresizingMaskIntoConstraints = NO;
    self.currentOrientationLabel.text = [[RXSDKManager sharedManager] currentOrientationDisplayName];
    self.currentOrientationLabel.font = [UIFont systemFontOfSize:14 weight:UIFontWeightSemibold];
    self.currentOrientationLabel.textColor = UIColorFromHex(0x4285F4);
    [self.orientationCard addSubview:self.currentOrientationLabel];
    
    // 按钮容器
    UIView *buttonContainer = [[UIView alloc] init];
    buttonContainer.translatesAutoresizingMaskIntoConstraints = NO;
    [self.orientationCard addSubview:buttonContainer];
    
    // 竖屏按钮（默认选中样式 - 使用背景色作为初始样式）
    self.btnPortrait = [UIButton buttonWithType:UIButtonTypeSystem];
    self.btnPortrait.translatesAutoresizingMaskIntoConstraints = NO;
    [self.btnPortrait setTitle:@"竖屏" forState:UIControlStateNormal];
    self.btnPortrait.titleLabel.font = [UIFont systemFontOfSize:14 weight:UIFontWeightSemibold];
    self.btnPortrait.layer.cornerRadius = 8;
    self.btnPortrait.clipsToBounds = YES;
    self.btnPortrait.backgroundColor = UIColorFromHex(0x4285F4); // 初始背景色
    [self.btnPortrait setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    [self.btnPortrait addTarget:self action:@selector(portraitTapped) forControlEvents:UIControlEventTouchUpInside];
    [buttonContainer addSubview:self.btnPortrait];
    
    // 横屏按钮（默认未选中样式）
    self.btnLandscape = [UIButton buttonWithType:UIButtonTypeSystem];
    self.btnLandscape.translatesAutoresizingMaskIntoConstraints = NO;
    [self.btnLandscape setTitle:@"横屏" forState:UIControlStateNormal];
    self.btnLandscape.titleLabel.font = [UIFont systemFontOfSize:14 weight:UIFontWeightSemibold];
    self.btnLandscape.layer.cornerRadius = 8;
    self.btnLandscape.clipsToBounds = YES;
    self.btnLandscape.backgroundColor = [UIColor clearColor];
    self.btnLandscape.layer.borderWidth = 1;
    self.btnLandscape.layer.borderColor = UIColorFromHex(0x4285F4).CGColor;
    [self.btnLandscape setTitleColor:UIColorFromHex(0x4285F4) forState:UIControlStateNormal];
    [self.btnLandscape addTarget:self action:@selector(landscapeTapped) forControlEvents:UIControlEventTouchUpInside];
    [buttonContainer addSubview:self.btnLandscape];
    
    [NSLayoutConstraint activateConstraints:@[
        // Orientation Card
        [self.orientationCard.topAnchor constraintEqualToAnchor:self.languageCard.bottomAnchor constant:16],
        [self.orientationCard.leadingAnchor constraintEqualToAnchor:self.contentView.leadingAnchor constant:24],
        [self.orientationCard.trailingAnchor constraintEqualToAnchor:self.contentView.trailingAnchor constant:-24],
        
        // 标题
        [self.orientationTitleLabel.topAnchor constraintEqualToAnchor:self.orientationCard.topAnchor constant:18],
        [self.orientationTitleLabel.leadingAnchor constraintEqualToAnchor:self.orientationCard.leadingAnchor constant:18],
        
        // 当前方向
        [self.currentOrientationLabel.centerYAnchor constraintEqualToAnchor:self.orientationTitleLabel.centerYAnchor],
        [self.currentOrientationLabel.trailingAnchor constraintEqualToAnchor:self.orientationCard.trailingAnchor constant:-18],
        
        // 按钮容器
        [buttonContainer.topAnchor constraintEqualToAnchor:self.orientationTitleLabel.bottomAnchor constant:12],
        [buttonContainer.leadingAnchor constraintEqualToAnchor:self.orientationCard.leadingAnchor constant:18],
        [buttonContainer.trailingAnchor constraintEqualToAnchor:self.orientationCard.trailingAnchor constant:-18],
        [buttonContainer.heightAnchor constraintEqualToConstant:48],
        [buttonContainer.bottomAnchor constraintEqualToAnchor:self.orientationCard.bottomAnchor constant:-18],
        
        // 竖屏按钮
        [self.btnPortrait.leadingAnchor constraintEqualToAnchor:buttonContainer.leadingAnchor],
        [self.btnPortrait.topAnchor constraintEqualToAnchor:buttonContainer.topAnchor],
        [self.btnPortrait.bottomAnchor constraintEqualToAnchor:buttonContainer.bottomAnchor],
        [self.btnPortrait.widthAnchor constraintEqualToAnchor:buttonContainer.widthAnchor multiplier:0.48],
        
        // 横屏按钮
        [self.btnLandscape.trailingAnchor constraintEqualToAnchor:buttonContainer.trailingAnchor],
        [self.btnLandscape.topAnchor constraintEqualToAnchor:buttonContainer.topAnchor],
        [self.btnLandscape.bottomAnchor constraintEqualToAnchor:buttonContainer.bottomAnchor],
        [self.btnLandscape.widthAnchor constraintEqualToAnchor:buttonContainer.widthAnchor multiplier:0.48],
    ]];
}

#pragma mark - Environment Settings Card

- (void)setupEnvironmentCard {
    self.environmentCard = [[UIView alloc] init];
    self.environmentCard.translatesAutoresizingMaskIntoConstraints = NO;
    self.environmentCard.backgroundColor = [UIColor whiteColor];
    self.environmentCard.layer.cornerRadius = 16;
    self.environmentCard.layer.borderWidth = 1;
    self.environmentCard.layer.borderColor = UIColorFromHex(0xE5E7EB).CGColor;
    [self.contentView addSubview:self.environmentCard];
    
    // 标题
    self.environmentTitleLabel = [[UILabel alloc] init];
    self.environmentTitleLabel.translatesAutoresizingMaskIntoConstraints = NO;
    self.environmentTitleLabel.text = @"环境配置";
    self.environmentTitleLabel.font = [UIFont systemFontOfSize:14 weight:UIFontWeightSemibold];
    self.environmentTitleLabel.textColor = UIColorFromHex(0x364153);
    [self.environmentCard addSubview:self.environmentTitleLabel];
    
    // 当前环境显示
    self.currentEnvironmentLabel = [[UILabel alloc] init];
    self.currentEnvironmentLabel.translatesAutoresizingMaskIntoConstraints = NO;
    self.currentEnvironmentLabel.text = [[RXSDKManager sharedManager] currentEnvironmentDisplayName];
    self.currentEnvironmentLabel.font = [UIFont systemFontOfSize:14 weight:UIFontWeightSemibold];
    self.currentEnvironmentLabel.textColor = UIColorFromHex(0x4285F4);
    [self.environmentCard addSubview:self.currentEnvironmentLabel];
    
    // 按钮容器
    UIView *envButtonContainer = [[UIView alloc] init];
    envButtonContainer.translatesAutoresizingMaskIntoConstraints = NO;
    [self.environmentCard addSubview:envButtonContainer];
    
    // 国内按钮（默认选中样式）
    self.btnDomestic = [UIButton buttonWithType:UIButtonTypeSystem];
    self.btnDomestic.translatesAutoresizingMaskIntoConstraints = NO;
    [self.btnDomestic setTitle:@"国内" forState:UIControlStateNormal];
    self.btnDomestic.titleLabel.font = [UIFont systemFontOfSize:14 weight:UIFontWeightSemibold];
    self.btnDomestic.layer.cornerRadius = 8;
    self.btnDomestic.clipsToBounds = YES;
    self.btnDomestic.backgroundColor = UIColorFromHex(0x4285F4);
    [self.btnDomestic setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    [self.btnDomestic addTarget:self action:@selector(domesticTapped) forControlEvents:UIControlEventTouchUpInside];
    [envButtonContainer addSubview:self.btnDomestic];
    
    // 海外按钮（默认未选中样式）
    self.btnOverseas = [UIButton buttonWithType:UIButtonTypeSystem];
    self.btnOverseas.translatesAutoresizingMaskIntoConstraints = NO;
    [self.btnOverseas setTitle:@"海外" forState:UIControlStateNormal];
    self.btnOverseas.titleLabel.font = [UIFont systemFontOfSize:14 weight:UIFontWeightSemibold];
    self.btnOverseas.layer.cornerRadius = 8;
    self.btnOverseas.clipsToBounds = YES;
    self.btnOverseas.backgroundColor = [UIColor clearColor];
    self.btnOverseas.layer.borderWidth = 1;
    self.btnOverseas.layer.borderColor = UIColorFromHex(0x4285F4).CGColor;
    [self.btnOverseas setTitleColor:UIColorFromHex(0x4285F4) forState:UIControlStateNormal];
    [self.btnOverseas addTarget:self action:@selector(overseasTapped) forControlEvents:UIControlEventTouchUpInside];
    [envButtonContainer addSubview:self.btnOverseas];
    
    [NSLayoutConstraint activateConstraints:@[
        // Environment Card
        [self.environmentCard.topAnchor constraintEqualToAnchor:self.orientationCard.bottomAnchor constant:16],
        [self.environmentCard.leadingAnchor constraintEqualToAnchor:self.contentView.leadingAnchor constant:24],
        [self.environmentCard.trailingAnchor constraintEqualToAnchor:self.contentView.trailingAnchor constant:-24],
        
        // 标题
        [self.environmentTitleLabel.topAnchor constraintEqualToAnchor:self.environmentCard.topAnchor constant:18],
        [self.environmentTitleLabel.leadingAnchor constraintEqualToAnchor:self.environmentCard.leadingAnchor constant:18],
        
        // 当前环境
        [self.currentEnvironmentLabel.centerYAnchor constraintEqualToAnchor:self.environmentTitleLabel.centerYAnchor],
        [self.currentEnvironmentLabel.trailingAnchor constraintEqualToAnchor:self.environmentCard.trailingAnchor constant:-18],
        
        // 按钮容器
        [envButtonContainer.topAnchor constraintEqualToAnchor:self.environmentTitleLabel.bottomAnchor constant:12],
        [envButtonContainer.leadingAnchor constraintEqualToAnchor:self.environmentCard.leadingAnchor constant:18],
        [envButtonContainer.trailingAnchor constraintEqualToAnchor:self.environmentCard.trailingAnchor constant:-18],
        [envButtonContainer.heightAnchor constraintEqualToConstant:48],
        [envButtonContainer.bottomAnchor constraintEqualToAnchor:self.environmentCard.bottomAnchor constant:-18],
        
        // 国内按钮
        [self.btnDomestic.leadingAnchor constraintEqualToAnchor:envButtonContainer.leadingAnchor],
        [self.btnDomestic.topAnchor constraintEqualToAnchor:envButtonContainer.topAnchor],
        [self.btnDomestic.bottomAnchor constraintEqualToAnchor:envButtonContainer.bottomAnchor],
        [self.btnDomestic.widthAnchor constraintEqualToAnchor:envButtonContainer.widthAnchor multiplier:0.48],
        
        // 海外按钮
        [self.btnOverseas.trailingAnchor constraintEqualToAnchor:envButtonContainer.trailingAnchor],
        [self.btnOverseas.topAnchor constraintEqualToAnchor:envButtonContainer.topAnchor],
        [self.btnOverseas.bottomAnchor constraintEqualToAnchor:envButtonContainer.bottomAnchor],
        [self.btnOverseas.widthAnchor constraintEqualToAnchor:envButtonContainer.widthAnchor multiplier:0.48],
    ]];
}

#pragma mark - Config Complete Button

- (void)setupConfigCompleteButton {
    self.btnConfigComplete = [UIButton buttonWithType:UIButtonTypeCustom];
    self.btnConfigComplete.translatesAutoresizingMaskIntoConstraints = NO;
    [self.btnConfigComplete setTitle:@"前往登录配置" forState:UIControlStateNormal];
    [self.btnConfigComplete setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    self.btnConfigComplete.titleLabel.font = [UIFont systemFontOfSize:16 weight:UIFontWeightBold];
    self.btnConfigComplete.layer.cornerRadius = 12;
    self.btnConfigComplete.clipsToBounds = YES;
    self.btnConfigComplete.backgroundColor = UIColorFromHex(0x4285F4);
    [self.btnConfigComplete addTarget:self action:@selector(configCompleteTapped) forControlEvents:UIControlEventTouchUpInside];
    [self.contentView addSubview:self.btnConfigComplete];
    
    [NSLayoutConstraint activateConstraints:@[
        [self.btnConfigComplete.topAnchor constraintEqualToAnchor:self.environmentCard.bottomAnchor constant:24],
        [self.btnConfigComplete.leadingAnchor constraintEqualToAnchor:self.contentView.leadingAnchor constant:24],
        [self.btnConfigComplete.trailingAnchor constraintEqualToAnchor:self.contentView.trailingAnchor constant:-24],
        [self.btnConfigComplete.heightAnchor constraintEqualToConstant:56]
    ]];
}

#pragma mark - Framework Info

- (void)setupFrameworkInfo {
    self.frameworkInfoCard = [[UIView alloc] init];
    self.frameworkInfoCard.translatesAutoresizingMaskIntoConstraints = NO;
    self.frameworkInfoCard.backgroundColor = UIColorFromHex(0xEFF6FF);
    self.frameworkInfoCard.layer.cornerRadius = 16;
    self.frameworkInfoCard.layer.borderWidth = 1;
    self.frameworkInfoCard.layer.borderColor = UIColorFromHex(0xDBEAFE).CGColor;
    [self.contentView addSubview:self.frameworkInfoCard];
    
    // Framework 信息
    NSArray *infos = @[
        @{@"label": @"Framework:", @"value": @"RXSDK_Pure.framework"},
        @{@"label": @"Version:", @"value": @"3.2.1"},
        @{@"label": @"Entry Class:", @"value": @"RXSDK (singleton)"}
    ];
    
    UIView *lastLabel = nil;
    
    for (NSDictionary *info in infos) {
        UILabel *label = [[UILabel alloc] init];
        label.translatesAutoresizingMaskIntoConstraints = NO;
        label.font = [UIFont systemFontOfSize:12 weight:UIFontWeightSemibold];
        label.textColor = UIColorFromHex(0x193CB8);
        label.text = info[@"label"];
        [self.frameworkInfoCard addSubview:label];
        
        UILabel *value = [[UILabel alloc] init];
        value.translatesAutoresizingMaskIntoConstraints = NO;
        value.font = [UIFont systemFontOfSize:12];
        value.textColor = UIColorFromHex(0x193CB8);
        value.text = info[@"value"];
        [self.frameworkInfoCard addSubview:value];
        
        if (lastLabel) {
            [label.topAnchor constraintEqualToAnchor:lastLabel.bottomAnchor constant:2].active = YES;
        } else {
            [label.topAnchor constraintEqualToAnchor:self.frameworkInfoCard.topAnchor constant:17].active = YES;
        }
        
        [NSLayoutConstraint activateConstraints:@[
            [label.leadingAnchor constraintEqualToAnchor:self.frameworkInfoCard.leadingAnchor constant:17],
            [value.leadingAnchor constraintEqualToAnchor:label.trailingAnchor constant:4],
            [value.centerYAnchor constraintEqualToAnchor:label.centerYAnchor]
        ]];
        
        lastLabel = label;
    }
    
    [NSLayoutConstraint activateConstraints:@[
        [self.frameworkInfoCard.topAnchor constraintEqualToAnchor:self.btnConfigComplete.bottomAnchor constant:24],
        [self.frameworkInfoCard.leadingAnchor constraintEqualToAnchor:self.contentView.leadingAnchor constant:24],
        [self.frameworkInfoCard.trailingAnchor constraintEqualToAnchor:self.contentView.trailingAnchor constant:-24],
        [self.frameworkInfoCard.heightAnchor constraintEqualToConstant:82],
        [self.frameworkInfoCard.bottomAnchor constraintEqualToAnchor:self.contentView.bottomAnchor constant:-24]
    ]];
}

#pragma mark - Actions

/**
 * 选择语言按钮点击
 */
- (void)selectLanguageTapped {
    NSArray<NSDictionary *> *languages = [RXSDKManager supportedLanguages];
    NSInteger currentIndex = [[RXSDKManager sharedManager] languageIndex];
    
    UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"选择语言"
                                                                   message:nil
                                                            preferredStyle:UIAlertControllerStyleActionSheet];
    
    for (NSInteger i = 0; i < languages.count; i++) {
        NSDictionary *lang = languages[i];
        NSString *title = lang[@"name"];
        
        // 当前选中的语言加标记
        if (i == currentIndex) {
            title = [NSString stringWithFormat:@"✓ %@", title];
        }
        
        UIAlertAction *action = [UIAlertAction actionWithTitle:title
                                                         style:UIAlertActionStyleDefault
                                                       handler:^(UIAlertAction * _Nonnull action) {
            [[RXSDKManager sharedManager] setLanguage:lang[@"code"]];
            [self updateLanguageDisplay];
            [self showAlert:@"语言设置" message:[NSString stringWithFormat:@"语言已设置为: %@", lang[@"name"]]];
        }];
        [alert addAction:action];
    }
    
    UIAlertAction *cancelAction = [UIAlertAction actionWithTitle:@"取消"
                                                           style:UIAlertActionStyleCancel
                                                         handler:nil];
    [alert addAction:cancelAction];
    
    // iPad 支持
    if (alert.popoverPresentationController) {
        alert.popoverPresentationController.sourceView = self.btnSelectLanguage;
        alert.popoverPresentationController.sourceRect = self.btnSelectLanguage.bounds;
    }
    
    [self presentViewController:alert animated:YES completion:nil];
}

/**
 * 更新语言显示
 */
- (void)updateLanguageDisplay {
    self.currentLanguageLabel.text = [[RXSDKManager sharedManager] currentLanguageDisplayName];
}

// ==================== 屏幕方向设置 ====================

/**
 * 竖屏按钮点击
 */
- (void)portraitTapped {
    [[RXSDKManager sharedManager] setOrientation:RXSDKOrientationPortrait];
    [self updateOrientationDisplay];
    [self applyOrientation:RXSDKOrientationPortrait];
    [self showAlert:@"屏幕方向" message:@"屏幕方向已设置为: 竖屏"];
}

/**
 * 横屏按钮点击
 */
- (void)landscapeTapped {
    [[RXSDKManager sharedManager] setOrientation:RXSDKOrientationLandscape];
    [self updateOrientationDisplay];
    [self applyOrientation:RXSDKOrientationLandscape];
    [self showAlert:@"屏幕方向" message:@"屏幕方向已设置为: 横屏"];
}

/**
 * 更新屏幕方向显示
 */
- (void)updateOrientationDisplay {
    self.currentOrientationLabel.text = [[RXSDKManager sharedManager] currentOrientationDisplayName];
    [self updateOrientationButtonStyles];
}

/**
 * 更新屏幕方向按钮样式
 */
- (void)updateOrientationButtonStyles {
    BOOL isPortrait = [[RXSDKManager sharedManager] isPortrait];
    
    if (isPortrait) {
        // 竖屏按钮选中样式
        self.btnPortrait.backgroundColor = UIColorFromHex(0x4285F4);
        [self.btnPortrait setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
        self.btnPortrait.layer.borderWidth = 0;
        
        // 横屏按钮未选中样式
        self.btnLandscape.backgroundColor = [UIColor clearColor];
        [self.btnLandscape setTitleColor:UIColorFromHex(0x4285F4) forState:UIControlStateNormal];
        self.btnLandscape.layer.borderWidth = 1;
        self.btnLandscape.layer.borderColor = UIColorFromHex(0x4285F4).CGColor;
    } else {
        // 横屏按钮选中样式
        self.btnLandscape.backgroundColor = UIColorFromHex(0x4285F4);
        [self.btnLandscape setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
        self.btnLandscape.layer.borderWidth = 0;
        
        // 竖屏按钮未选中样式
        self.btnPortrait.backgroundColor = [UIColor clearColor];
        [self.btnPortrait setTitleColor:UIColorFromHex(0x4285F4) forState:UIControlStateNormal];
        self.btnPortrait.layer.borderWidth = 1;
        self.btnPortrait.layer.borderColor = UIColorFromHex(0x4285F4).CGColor;
    }
}

/**
 * 应用屏幕方向
 */
- (void)applyOrientation:(RXSDKOrientation)orientation {
    if (@available(iOS 16.0, *)) {
        // iOS 16+ 使用新 API
        UIWindowScene *windowScene = self.view.window.windowScene;
        if (windowScene) {
            UIInterfaceOrientationMask orientationMask = (orientation == RXSDKOrientationPortrait) 
                ? UIInterfaceOrientationMaskPortrait 
                : UIInterfaceOrientationMaskLandscape;
            UIWindowSceneGeometryPreferencesIOS *preferences = [[UIWindowSceneGeometryPreferencesIOS alloc] initWithInterfaceOrientations:orientationMask];
            [windowScene requestGeometryUpdateWithPreferences:preferences errorHandler:^(NSError * _Nonnull error) {
                NSLog(@"屏幕旋转失败: %@", error.localizedDescription);
            }];
        }
    } else {
        // iOS 15 及以下使用旧方式
        if (orientation == RXSDKOrientationPortrait) {
            NSNumber *value = [NSNumber numberWithInt:UIInterfaceOrientationPortrait];
            [[UIDevice currentDevice] setValue:value forKey:@"orientation"];
        } else {
            NSNumber *value = [NSNumber numberWithInt:UIInterfaceOrientationLandscapeRight];
            [[UIDevice currentDevice] setValue:value forKey:@"orientation"];
        }
        // 仅 iOS 15 及以下需要触发旋转
        [UIViewController attemptRotationToDeviceOrientation];
    }
}

#pragma mark - 屏幕旋转支持

- (BOOL)shouldAutorotate {
    return YES;
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations {
    if ([[RXSDKManager sharedManager] isPortrait]) {
        return UIInterfaceOrientationMaskPortrait;
    } else {
        return UIInterfaceOrientationMaskLandscape;
    }
}

- (UIInterfaceOrientation)preferredInterfaceOrientationForPresentation {
    if ([[RXSDKManager sharedManager] isPortrait]) {
        return UIInterfaceOrientationPortrait;
    } else {
        return UIInterfaceOrientationLandscapeRight;
    }
}

// ==================== 环境设置 ====================

/**
 * 国内按钮点击
 */
- (void)domesticTapped {
    RXSDKManager *manager = [RXSDKManager sharedManager];
    
    if (manager.isInitialized) {
        [self showAlert:@"提示" message:@"请先重置 SDK 再切换环境"];
        return;
    }
    
    [manager setEnvironment:RXSDKEnvironmentDomestic];
    [self updateEnvironmentDisplay];
    [self showAlert:@"环境配置" message:@"环境已切换为: 国内"];
}

/**
 * 海外按钮点击
 */
- (void)overseasTapped {
    RXSDKManager *manager = [RXSDKManager sharedManager];
    
    if (manager.isInitialized) {
        [self showAlert:@"提示" message:@"请先重置 SDK 再切换环境"];
        return;
    }
    
    [manager setEnvironment:RXSDKEnvironmentOverseas];
    [self updateEnvironmentDisplay];
    [self showAlert:@"环境配置" message:@"环境已切换为: 海外"];
}

/**
 * 更新环境显示
 */
- (void)updateEnvironmentDisplay {
    self.currentEnvironmentLabel.text = [[RXSDKManager sharedManager] currentEnvironmentDisplayName];
    [self updateEnvironmentButtonStyles];
}

/**
 * 更新环境按钮样式
 */
- (void)updateEnvironmentButtonStyles {
    BOOL isDomestic = [[RXSDKManager sharedManager] isDomestic];
    
    if (isDomestic) {
        // 国内按钮选中样式
        self.btnDomestic.backgroundColor = UIColorFromHex(0x4285F4);
        [self.btnDomestic setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
        self.btnDomestic.layer.borderWidth = 0;
        
        // 海外按钮未选中样式
        self.btnOverseas.backgroundColor = [UIColor clearColor];
        [self.btnOverseas setTitleColor:UIColorFromHex(0x4285F4) forState:UIControlStateNormal];
        self.btnOverseas.layer.borderWidth = 1;
        self.btnOverseas.layer.borderColor = UIColorFromHex(0x4285F4).CGColor;
    } else {
        // 海外按钮选中样式
        self.btnOverseas.backgroundColor = UIColorFromHex(0x4285F4);
        [self.btnOverseas setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
        self.btnOverseas.layer.borderWidth = 0;
        
        // 国内按钮未选中样式
        self.btnDomestic.backgroundColor = [UIColor clearColor];
        [self.btnDomestic setTitleColor:UIColorFromHex(0x4285F4) forState:UIControlStateNormal];
        self.btnDomestic.layer.borderWidth = 1;
        self.btnDomestic.layer.borderColor = UIColorFromHex(0x4285F4).CGColor;
    }
}

/**
 * 默认初始化按钮点击
 * 使用预设参数初始化 SDK
 */
- (void)defaultInitTapped {
    RXSDKManager *manager = [RXSDKManager sharedManager];
    
    if (manager.isInitialized) {
        [self showAlert:@"提示" message:@"SDK 已初始化，请先重置"];
        return;
    }
    
    // 显示确认对话框（根据当前环境显示对应参数）
    NSString *envName = [manager isDomestic] ? @"国内" : @"海外";
    NSString *message = [NSString stringWithFormat:
        @"即将使用%@环境默认参数初始化 SDK：\n\n"
        @"• CPID: %@\n"
        @"• Product ID: %@\n"
        @"• Channel ID: %@\n"
        @"• Base URL: %@",
        envName, [manager envDefaultCpid], [manager envDefaultProductId], 
        [manager envDefaultChannelId], [manager envDefaultBaseUrl]];
    
    UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"默认初始化参数"
                                                                   message:message
                                                            preferredStyle:UIAlertControllerStyleAlert];
    
    UIAlertAction *confirmAction = [UIAlertAction actionWithTitle:@"确认初始化"
                                                            style:UIAlertActionStyleDefault
                                                          handler:^(UIAlertAction * _Nonnull action) {
        [self startDefaultInitialization];
    }];
    
    UIAlertAction *cancelAction = [UIAlertAction actionWithTitle:@"取消"
                                                           style:UIAlertActionStyleCancel
                                                         handler:nil];
    
    [alert addAction:confirmAction];
    [alert addAction:cancelAction];
    
    [self presentViewController:alert animated:YES completion:nil];
}

/**
 * 自定义初始化按钮点击
 * 弹出参数输入对话框
 */
- (void)customInitTapped {
    RXSDKManager *manager = [RXSDKManager sharedManager];
    
    if (manager.isInitialized) {
        [self showAlert:@"提示" message:@"SDK 已初始化，请先重置"];
        return;
    }
    
    UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"自定义初始化参数"
                                                                   message:@"请输入 SDK 初始化所需的参数"
                                                            preferredStyle:UIAlertControllerStyleAlert];
    
    // 添加输入框（带标题，根据当前环境预填充）
    [alert addTextFieldWithConfigurationHandler:^(UITextField * _Nonnull textField) {
        textField.placeholder = @"瑞雪分配的唯一 ID";
        textField.text = [manager envDefaultCpid];
        textField.leftView = [self createTextFieldLabel:@"CPID:"];
        textField.leftViewMode = UITextFieldViewModeAlways;
    }];
    
    [alert addTextFieldWithConfigurationHandler:^(UITextField * _Nonnull textField) {
        textField.placeholder = @"产品 ID";
        textField.text = [manager envDefaultProductId];
        textField.leftView = [self createTextFieldLabel:@"Product ID:"];
        textField.leftViewMode = UITextFieldViewModeAlways;
    }];
    
    [alert addTextFieldWithConfigurationHandler:^(UITextField * _Nonnull textField) {
        textField.placeholder = @"渠道 ID";
        textField.text = [manager envDefaultChannelId];
        textField.leftView = [self createTextFieldLabel:@"Channel ID:"];
        textField.leftViewMode = UITextFieldViewModeAlways;
    }];
    
    [alert addTextFieldWithConfigurationHandler:^(UITextField * _Nonnull textField) {
        textField.placeholder = @"API 域名";
        textField.text = [manager envDefaultBaseUrl];
        textField.keyboardType = UIKeyboardTypeURL;
        textField.leftView = [self createTextFieldLabel:@"Base URL:"];
        textField.leftViewMode = UITextFieldViewModeAlways;
    }];
    
    UIAlertAction *confirmAction = [UIAlertAction actionWithTitle:@"初始化"
                                                            style:UIAlertActionStyleDefault
                                                          handler:^(UIAlertAction * _Nonnull action) {
        NSString *cpid = alert.textFields[0].text;
        NSString *productId = alert.textFields[1].text;
        NSString *channelId = alert.textFields[2].text;
        NSString *baseUrl = alert.textFields[3].text;
        
        // 验证输入
        if (cpid.length == 0 || productId.length == 0 || channelId.length == 0 || baseUrl.length == 0) {
            [self showAlert:@"错误" message:@"请填写所有参数"];
            return;
        }
        
        // 执行自定义参数初始化
        [self startCustomInitializationWithCpid:cpid productId:productId channelId:channelId baseUrl:baseUrl];
    }];
    
    UIAlertAction *cancelAction = [UIAlertAction actionWithTitle:@"取消"
                                                           style:UIAlertActionStyleCancel
                                                         handler:nil];
    
    [alert addAction:confirmAction];
    [alert addAction:cancelAction];
    
    [self presentViewController:alert animated:YES completion:nil];
}

/**
 * 重置 SDK 按钮点击
 */
- (void)resetSdkTapped {
    [[RXSDKManager sharedManager] reset];
    
    self.statusDot.backgroundColor = UIColorFromHex(0x99A1AF);
    self.statusDescLabel.text = @"Initialize SDK to begin";
    
    // 切换按钮显示
    self.mInitButtonsContainer.hidden = NO;
    self.btnResetSdk.hidden = YES;
    
    [self showAlert:@"提示" message:@"SDK 状态已重置"];
}

/**
 * 使用默认参数初始化
 */
- (void)startDefaultInitialization {
    // 显示初始化中状态
    self.statusDescLabel.text = @"Initializing...";
    self.btnDefaultInit.enabled = NO;
    self.btnCustomInit.enabled = NO;
    
    // 调用 SDK 管理器初始化
    [[RXSDKManager sharedManager] initWithDefaultParamsWithCallback:^(BOOL success, NSDictionary * _Nullable response, NSError * _Nullable error) {
        [self onInitComplete:success response:response error:error];
    }];
}

/**
 * 使用自定义参数初始化
 */
- (void)startCustomInitializationWithCpid:(NSString *)cpid
                                productId:(NSString *)productId
                                channelId:(NSString *)channelId
                                  baseUrl:(NSString *)baseUrl {
    // 显示初始化中状态
    self.statusDescLabel.text = @"Initializing...";
    self.btnDefaultInit.enabled = NO;
    self.btnCustomInit.enabled = NO;
    
    // 调用 SDK 管理器初始化
    [[RXSDKManager sharedManager] initWithCpid:cpid
                                     productId:productId
                                     channelId:channelId
                                       baseUrl:baseUrl
                                      callback:^(BOOL success, NSDictionary * _Nullable response, NSError * _Nullable error) {
        [self onInitComplete:success response:response error:error];
    }];
}

/**
 * 初始化完成回调
 */
- (void)onInitComplete:(BOOL)success response:(NSDictionary *)response error:(NSError *)error {
    self.btnDefaultInit.enabled = YES;
    self.btnCustomInit.enabled = YES;
    
    if (success) {
        self.statusDot.backgroundColor = UIColorFromHex(0x05DF72);
        self.statusDescLabel.text = @"SDK initialized successfully";
        
        // 切换按钮显示
        self.mInitButtonsContainer.hidden = YES;
        self.btnResetSdk.hidden = NO;
        
        RXSDKManager *manager = [RXSDKManager sharedManager];
        NSString *successMsg = [NSString stringWithFormat:
            @"SDK 初始化成功！\n\n使用参数：\n"
            @"• CPID: %@\n"
            @"• Product ID: %@\n"
            @"• Channel ID: %@\n"
            @"• Base URL: %@",
            manager.currentCpid, manager.currentProductId, manager.currentChannelId, manager.currentBaseUrl];
        
        [self showAlert:@"RXSDK Initialized" message:successMsg];
    } else {
        self.statusDot.backgroundColor = UIColorFromHex(0x99A1AF);
        self.statusDescLabel.text = @"Initialize SDK to begin";
        [self showAlert:@"初始化失败" message:error.localizedDescription ?: @"未知错误"];
    }
}

/**
 * 前往登录配置按钮点击
 * 跳转到登录配置页面
 */
- (void)configCompleteTapped {
    RXSDKManager *manager = [RXSDKManager sharedManager];
    
    if (!manager.isInitialized) {
        [self showAlert:@"提示" message:@"请先初始化"];
        return;
    }
    
    LoginViewController *loginVC = [[LoginViewController alloc] init];
    [self.navigationController pushViewController:loginVC animated:YES];
}

/**
 * 创建输入框左侧标题标签
 */
- (UIView *)createTextFieldLabel:(NSString *)text {
    UILabel *label = [[UILabel alloc] init];
    label.text = text;
    label.font = [UIFont systemFontOfSize:14 weight:UIFontWeightMedium];
    label.textColor = UIColorFromHex(0x333333);
    [label sizeToFit];
    
    // 添加右边距
    UIView *container = [[UIView alloc] initWithFrame:CGRectMake(0, 0, label.frame.size.width + 8, label.frame.size.height)];
    label.frame = CGRectMake(0, 0, label.frame.size.width, label.frame.size.height);
    [container addSubview:label];
    
    return container;
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
