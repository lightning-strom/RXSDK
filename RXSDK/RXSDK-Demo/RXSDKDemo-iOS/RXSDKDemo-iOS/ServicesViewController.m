//
//  ServicesViewController.m
//  RXSDKDemo-iOS
//
//  Created by RXSDK on 2026/1/22.
//
//  API Services 页面
//  按模块分类展示 SDK 提供的各种 API 服务入口
//  支持 API/UI 分类切换
//  SDK 接口调用统一由 RXSDKManager 管理
//
//  模块分类参考：RXSDK-Doc/ios/public_class_methods.md
//

#import "ServicesViewController.h"
#import "RXSDKManager.h"
#import <RXUIKit/RXUIKitService.h>

// 颜色宏
#define UIColorFromHex(hexValue) [UIColor colorWithRed:((float)((hexValue & 0xFF0000) >> 16))/255.0 green:((float)((hexValue & 0xFF00) >> 8))/255.0 blue:((float)(hexValue & 0xFF))/255.0 alpha:1.0]

// 分类类型
typedef NS_ENUM(NSInteger, ServiceCategory) {
    ServiceCategoryAPI = 0,
    ServiceCategoryUI = 1
};

@interface ServicesViewController ()

@property (nonatomic, assign) ServiceCategory currentCategory;

// UI 组件
@property (nonatomic, strong) UIView *headerView;
@property (nonatomic, strong) UIButton *btnCategoryApi;
@property (nonatomic, strong) UIButton *btnCategoryUi;
@property (nonatomic, strong) UIScrollView *scrollView;
@property (nonatomic, strong) UIView *modulesContainer;

@end

@implementation ServicesViewController

// API 模块定义
static NSArray<NSArray<NSString *> *> *_apiModules;
// UI 模块定义
static NSArray<NSArray<NSString *> *> *_uiModules;

+ (void)initialize {
    if (self == [ServicesViewController class]) {
        _apiModules = @[
            @[@"初始化", @"初始化SDK"],
            @[@"登录", @"登录Api", @"获取法务配置", @"自定义请求"],
            @[@"配置", @"设置子渠道ID", @"设置语言", @"设置密码强度", @"设置密码正则", @"设置游戏角色信息", @"设置错误码", @"设置地区"],
            @[@"信息获取", @"获取请求域名", @"获取OpenID", @"获取BaseUrl", @"获取配置数据"],
            @[@"验证码", @"发送验证码", @"校验验证码"],
            @[@"账号绑定", @"绑定邮箱", @"解绑邮箱", @"绑定手机", @"解绑手机", @"修改手机号"],
            @[@"用户信息", @"获取用户信息", @"修改用户信息"],
            @[@"密码", @"修改密码", @"重置密码"],
            @[@"注册", @"注册账号"],
            @[@"实名认证", @"实名认证", @"IIFAA快速实名"],
            @[@"设备信息", @"获取设备码", @"获取时区偏移", @"获取系统语言"],
            @[@"游戏区服", @"查询区服", @"查询区服列表", @"创建区服", @"修改区服", @"删除区服"],
            @[@"游戏角色", @"创建角色", @"修改角色", @"删除角色", @"查询角色列表", @"查询角色信息", @"查询游戏账号"],
            @[@"公告/邮件", @"获取公告列表", @"获取临时公告", @"获取邮件列表", @"获取邮件详情", @"领取道具", @"删除邮件"],
            @[@"反馈", @"创建反馈", @"获取反馈列表", @"获取反馈详情", @"领取反馈道具", @"获取反馈类型", @"创建意见反馈", @"满意度评价", @"上报反馈日志"],
            @[@"福利码", @"请求福利码", @"兑换福利码"],
            @[@"埋点", @"用户行为统计", @"终止行为统计"],
            @[@"支付(IAP)", @"支付", @"查询"],
            @[@"分享", @"一键分享", @"自定义分享"],
            @[@"注销账号", @"申请注销", @"撤销注销"],
            @[@"评分", @"应用内评分", @"跳转商店评分", @"评分弹框"]
        ];
        
        _uiModules = @[
            @[@"登录", @"登录弹窗"],
            @[@"协议/法务", @"协议声明", @"隐私政策弹框"],
            @[@"实名/防沉迷", @"实名认证弹窗", @"防沉迷弹窗"],
            @[@"密码", @"找回密码", @"设置密码"],
            @[@"用户中心", @"用户中心", @"帮助中心"],
            @[@"账号注销", @"申请注销UI", @"撤销注销UI"],
            @[@"其他", @"展示邮件", @"绑定手机UI", @"绑定邮箱UI", @"展示公告"]
        ];
    }
}

- (void)viewDidLoad {
    [super viewDidLoad];
    
    self.view.backgroundColor = UIColorFromHex(0xF9FAFB);
    self.title = @"API Services";
    self.currentCategory = ServiceCategoryAPI;
    
    [self setupUI];
}

- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    // 显示导航栏
    [self.navigationController setNavigationBarHidden:NO animated:animated];
}

#pragma mark - Setup UI

- (void)setupUI {
    // 头部容器（使用 Auto Layout）
    self.headerView = [[UIView alloc] init];
    self.headerView.translatesAutoresizingMaskIntoConstraints = NO;
    [self.view addSubview:self.headerView];
    
    // 标题
    UILabel *titleLabel = [[UILabel alloc] init];
    titleLabel.translatesAutoresizingMaskIntoConstraints = NO;
    titleLabel.text = @"API Services";
    titleLabel.font = [UIFont systemFontOfSize:24 weight:UIFontWeightBold];
    titleLabel.textColor = UIColorFromHex(0x101828);
    titleLabel.textAlignment = NSTextAlignmentCenter;
    [self.headerView addSubview:titleLabel];
    
    // 副标题
    UILabel *subtitleLabel = [[UILabel alloc] init];
    subtitleLabel.translatesAutoresizingMaskIntoConstraints = NO;
    subtitleLabel.text = @"SDK 功能接口测试";
    subtitleLabel.font = [UIFont systemFontOfSize:14];
    subtitleLabel.textColor = UIColorFromHex(0x4A5565);
    subtitleLabel.textAlignment = NSTextAlignmentCenter;
    [self.headerView addSubview:subtitleLabel];
    
    // 分类按钮容器
    UIView *categoryContainer = [[UIView alloc] init];
    categoryContainer.translatesAutoresizingMaskIntoConstraints = NO;
    [self.headerView addSubview:categoryContainer];
    
    // API 按钮
    self.btnCategoryApi = [UIButton buttonWithType:UIButtonTypeCustom];
    self.btnCategoryApi.translatesAutoresizingMaskIntoConstraints = NO;
    [self.btnCategoryApi setTitle:@"API" forState:UIControlStateNormal];
    self.btnCategoryApi.titleLabel.font = [UIFont systemFontOfSize:14 weight:UIFontWeightMedium];
    self.btnCategoryApi.layer.cornerRadius = 8;
    [self.btnCategoryApi addTarget:self action:@selector(categoryButtonTapped:) forControlEvents:UIControlEventTouchUpInside];
    self.btnCategoryApi.tag = ServiceCategoryAPI;
    [categoryContainer addSubview:self.btnCategoryApi];
    
    // UI 按钮
    self.btnCategoryUi = [UIButton buttonWithType:UIButtonTypeCustom];
    self.btnCategoryUi.translatesAutoresizingMaskIntoConstraints = NO;
    [self.btnCategoryUi setTitle:@"UI" forState:UIControlStateNormal];
    self.btnCategoryUi.titleLabel.font = [UIFont systemFontOfSize:14 weight:UIFontWeightMedium];
    self.btnCategoryUi.layer.cornerRadius = 8;
    [self.btnCategoryUi addTarget:self action:@selector(categoryButtonTapped:) forControlEvents:UIControlEventTouchUpInside];
    self.btnCategoryUi.tag = ServiceCategoryUI;
    [categoryContainer addSubview:self.btnCategoryUi];
    
    // 滚动区域
    self.scrollView = [[UIScrollView alloc] init];
    self.scrollView.translatesAutoresizingMaskIntoConstraints = NO;
    self.scrollView.showsVerticalScrollIndicator = YES;
    self.scrollView.alwaysBounceVertical = YES;
    [self.view addSubview:self.scrollView];
    
    // 模块容器
    self.modulesContainer = [[UIView alloc] init];
    self.modulesContainer.translatesAutoresizingMaskIntoConstraints = NO;
    [self.scrollView addSubview:self.modulesContainer];
    
    // 设置约束
    [NSLayoutConstraint activateConstraints:@[
        // 头部容器
        [self.headerView.topAnchor constraintEqualToAnchor:self.view.safeAreaLayoutGuide.topAnchor],
        [self.headerView.leadingAnchor constraintEqualToAnchor:self.view.leadingAnchor],
        [self.headerView.trailingAnchor constraintEqualToAnchor:self.view.trailingAnchor],
        
        // 标题
        [titleLabel.topAnchor constraintEqualToAnchor:self.headerView.topAnchor constant:8],
        [titleLabel.leadingAnchor constraintEqualToAnchor:self.headerView.leadingAnchor constant:16],
        [titleLabel.trailingAnchor constraintEqualToAnchor:self.headerView.trailingAnchor constant:-16],
        [titleLabel.heightAnchor constraintEqualToConstant:30],
        
        // 副标题
        [subtitleLabel.topAnchor constraintEqualToAnchor:titleLabel.bottomAnchor constant:4],
        [subtitleLabel.leadingAnchor constraintEqualToAnchor:self.headerView.leadingAnchor constant:16],
        [subtitleLabel.trailingAnchor constraintEqualToAnchor:self.headerView.trailingAnchor constant:-16],
        [subtitleLabel.heightAnchor constraintEqualToConstant:20],
        
        // 分类按钮容器
        [categoryContainer.topAnchor constraintEqualToAnchor:subtitleLabel.bottomAnchor constant:12],
        [categoryContainer.centerXAnchor constraintEqualToAnchor:self.headerView.centerXAnchor],
        [categoryContainer.heightAnchor constraintEqualToConstant:40],
        [categoryContainer.bottomAnchor constraintEqualToAnchor:self.headerView.bottomAnchor constant:-12],
        
        // API 按钮
        [self.btnCategoryApi.leadingAnchor constraintEqualToAnchor:categoryContainer.leadingAnchor],
        [self.btnCategoryApi.topAnchor constraintEqualToAnchor:categoryContainer.topAnchor],
        [self.btnCategoryApi.bottomAnchor constraintEqualToAnchor:categoryContainer.bottomAnchor],
        [self.btnCategoryApi.widthAnchor constraintEqualToConstant:80],
        
        // UI 按钮
        [self.btnCategoryUi.leadingAnchor constraintEqualToAnchor:self.btnCategoryApi.trailingAnchor constant:12],
        [self.btnCategoryUi.trailingAnchor constraintEqualToAnchor:categoryContainer.trailingAnchor],
        [self.btnCategoryUi.topAnchor constraintEqualToAnchor:categoryContainer.topAnchor],
        [self.btnCategoryUi.bottomAnchor constraintEqualToAnchor:categoryContainer.bottomAnchor],
        [self.btnCategoryUi.widthAnchor constraintEqualToConstant:80],
        
        // 滚动区域
        [self.scrollView.topAnchor constraintEqualToAnchor:self.headerView.bottomAnchor],
        [self.scrollView.leadingAnchor constraintEqualToAnchor:self.view.leadingAnchor],
        [self.scrollView.trailingAnchor constraintEqualToAnchor:self.view.trailingAnchor],
        [self.scrollView.bottomAnchor constraintEqualToAnchor:self.view.safeAreaLayoutGuide.bottomAnchor],
        
        // 模块容器
        [self.modulesContainer.topAnchor constraintEqualToAnchor:self.scrollView.topAnchor],
        [self.modulesContainer.leadingAnchor constraintEqualToAnchor:self.scrollView.leadingAnchor],
        [self.modulesContainer.trailingAnchor constraintEqualToAnchor:self.scrollView.trailingAnchor],
        [self.modulesContainer.bottomAnchor constraintEqualToAnchor:self.scrollView.bottomAnchor],
        [self.modulesContainer.widthAnchor constraintEqualToAnchor:self.scrollView.widthAnchor]
    ]];
    
    // 初始化显示
    [self updateCategoryButtons];
    [self loadModules];
}

#pragma mark - Category Switch

- (void)categoryButtonTapped:(UIButton *)button {
    ServiceCategory category = (ServiceCategory)button.tag;
    if (self.currentCategory == category) return;
    
    self.currentCategory = category;
    [self updateCategoryButtons];
    [self loadModules];
    [self.scrollView setContentOffset:CGPointZero animated:NO];
}

- (void)updateCategoryButtons {
    if (self.currentCategory == ServiceCategoryAPI) {
        self.btnCategoryApi.backgroundColor = UIColorFromHex(0x4285F4);
        [self.btnCategoryApi setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
        self.btnCategoryUi.backgroundColor = UIColorFromHex(0xF3F4F6);
        self.btnCategoryUi.layer.borderWidth = 1;
        self.btnCategoryUi.layer.borderColor = UIColorFromHex(0xE5E7EB).CGColor;
        [self.btnCategoryUi setTitleColor:UIColorFromHex(0x101828) forState:UIControlStateNormal];
        self.btnCategoryApi.layer.borderWidth = 0;
    } else {
        self.btnCategoryUi.backgroundColor = UIColorFromHex(0x4285F4);
        [self.btnCategoryUi setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
        self.btnCategoryApi.backgroundColor = UIColorFromHex(0xF3F4F6);
        self.btnCategoryApi.layer.borderWidth = 1;
        self.btnCategoryApi.layer.borderColor = UIColorFromHex(0xE5E7EB).CGColor;
        [self.btnCategoryApi setTitleColor:UIColorFromHex(0x101828) forState:UIControlStateNormal];
        self.btnCategoryUi.layer.borderWidth = 0;
    }
}

#pragma mark - Load Modules

- (void)loadModules {
    // 清空现有内容
    for (UIView *subview in self.modulesContainer.subviews) {
        [subview removeFromSuperview];
    }
    
    NSArray<NSArray<NSString *> *> *modules = self.currentCategory == ServiceCategoryAPI ? _apiModules : _uiModules;
    
    CGFloat screenWidth = UIScreen.mainScreen.bounds.size.width;
    CGFloat padding = 16;
    CGFloat buttonSpacing = 8;
    CGFloat buttonHeight = 36;
    CGFloat availableWidth = screenWidth - padding * 2;
    CGFloat currentY = padding;
    
    for (NSArray<NSString *> *module in modules) {
        currentY = [self addModuleSection:module atY:currentY width:availableWidth padding:padding buttonSpacing:buttonSpacing buttonHeight:buttonHeight];
    }
    
    // 更新容器高度约束
    CGFloat totalHeight = currentY + padding;
    
    // 移除旧的高度约束
    for (NSLayoutConstraint *constraint in self.modulesContainer.constraints) {
        if (constraint.firstAttribute == NSLayoutAttributeHeight) {
            [self.modulesContainer removeConstraint:constraint];
        }
    }
    
    // 添加新的高度约束
    [self.modulesContainer.heightAnchor constraintEqualToConstant:totalHeight].active = YES;
}

- (CGFloat)addModuleSection:(NSArray<NSString *> *)module 
                        atY:(CGFloat)startY 
                      width:(CGFloat)availableWidth 
                    padding:(CGFloat)padding
              buttonSpacing:(CGFloat)buttonSpacing
               buttonHeight:(CGFloat)buttonHeight {
    
    NSString *moduleTitle = module[0];
    CGFloat currentY = startY;
    
    // 模块标题
    UILabel *titleLabel = [[UILabel alloc] initWithFrame:CGRectMake(padding, currentY, availableWidth, 20)];
    titleLabel.text = moduleTitle;
    titleLabel.font = [UIFont systemFontOfSize:14 weight:UIFontWeightBold];
    titleLabel.textColor = UIColorFromHex(0x101828);
    [self.modulesContainer addSubview:titleLabel];
    currentY += 28;
    
    // 按钮布局（每行2个）
    CGFloat buttonWidth = (availableWidth - buttonSpacing) / 2;
    NSInteger buttonsInRow = 0;
    CGFloat rowStartY = currentY;
    
    for (NSInteger i = 1; i < module.count; i++) {
        NSString *buttonTitle = module[i];
        
        CGFloat x = padding + (buttonsInRow * (buttonWidth + buttonSpacing));
        CGFloat y = rowStartY;
        
        UIButton *button = [self createServiceButton:buttonTitle module:moduleTitle];
        button.frame = CGRectMake(x, y, buttonWidth, buttonHeight);
        [self.modulesContainer addSubview:button];
        
        buttonsInRow++;
        if (buttonsInRow >= 2) {
            buttonsInRow = 0;
            rowStartY += buttonHeight + buttonSpacing;
        }
    }
    
    // 更新 currentY
    if (buttonsInRow > 0) {
        currentY = rowStartY + buttonHeight + buttonSpacing;
    } else {
        currentY = rowStartY;
    }
    
    // 分割线
    UIView *divider = [[UIView alloc] initWithFrame:CGRectMake(padding, currentY, availableWidth, 1)];
    divider.backgroundColor = UIColorFromHex(0xE5E7EB);
    [self.modulesContainer addSubview:divider];
    
    return currentY + 16;
}

- (UIButton *)createServiceButton:(NSString *)title module:(NSString *)moduleTitle {
    UIButton *button = [UIButton buttonWithType:UIButtonTypeCustom];
    [button setTitle:title forState:UIControlStateNormal];
    [button setTitleColor:UIColorFromHex(0x101828) forState:UIControlStateNormal];
    [button setTitleColor:UIColorFromHex(0x4285F4) forState:UIControlStateHighlighted];
    button.titleLabel.font = [UIFont systemFontOfSize:12];
    button.backgroundColor = UIColorFromHex(0xF3F4F6);
    button.layer.cornerRadius = 8;
    button.layer.borderWidth = 1;
    button.layer.borderColor = UIColorFromHex(0xE5E7EB).CGColor;
    
    // 存储模块名称
    button.accessibilityHint = moduleTitle;
    
    [button addTarget:self action:@selector(serviceButtonTapped:) forControlEvents:UIControlEventTouchUpInside];
    
    return button;
}

#pragma mark - Actions

- (void)serviceButtonTapped:(UIButton *)button {
    NSString *service = button.titleLabel.text;
    NSString *module = button.accessibilityHint;
    
    RXSDKManager *manager = [RXSDKManager sharedManager];
    
    // 初始化模块不需要检查 SDK 初始化状态
    if ([module isEqualToString:@"初始化"]) {
        [self handleInitModule:service];
        return;
    }
    
    // 其他功能需要检查 SDK 是否已初始化
    if (!manager.isInitialized) {
        [self showAlert:@"SDK 未初始化" message:@"请先点击「初始化」模块中的「初始化SDK」后再使用其他 API 服务"];
        return;
    }
    
    // 登录模块 (API)
    if ([module isEqualToString:@"登录"] && self.currentCategory == ServiceCategoryAPI) {
        [self handleLoginModule:service];
        return;
    }
    
    // 登录模块 (UI)
    if ([module isEqualToString:@"登录"] && self.currentCategory == ServiceCategoryUI) {
        [self handleLoginUIModule:service];
        return;
    }
    
    // 协议/法务模块 (UI)
    if ([module isEqualToString:@"协议/法务"]) {
        [self handleLegalUIModule:service];
        return;
    }
    
    // 实名/防沉迷模块 (UI)
    if ([module isEqualToString:@"实名/防沉迷"]) {
        [self handleRealAuthUIModule:service];
        return;
    }
    
    // 密码模块 (UI)
    if ([module isEqualToString:@"密码"] && self.currentCategory == ServiceCategoryUI) {
        [self handlePasswordUIModule:service];
        return;
    }
    
    // 用户中心模块 (UI)
    if ([module isEqualToString:@"用户中心"]) {
        [self handleUserCenterUIModule:service];
        return;
    }
    
    // 账号注销模块 (UI)
    if ([module isEqualToString:@"账号注销"] && self.currentCategory == ServiceCategoryUI) {
        [self handleDeregisterUIModule:service];
        return;
    }
    
    // 其他模块 (UI)
    if ([module isEqualToString:@"其他"] && self.currentCategory == ServiceCategoryUI) {
        [self handleOtherUIModule:service];
        return;
    }
    
    // 配置模块
    if ([module isEqualToString:@"配置"]) {
        [self handleConfigModule:service];
        return;
    }
    
    // 信息获取模块
    if ([module isEqualToString:@"信息获取"]) {
        [self handleInfoModule:service];
        return;
    }
    
    // 验证码模块
    if ([module isEqualToString:@"验证码"]) {
        [self handleCaptchaModule:service];
        return;
    }
    
    // 账号绑定模块
    if ([module isEqualToString:@"账号绑定"]) {
        [self handleBindingModule:service];
        return;
    }
    
    // 密码模块
    if ([module isEqualToString:@"密码"]) {
        [self handlePasswordModule:service];
        return;
    }
    
    // 注册模块
    if ([module isEqualToString:@"注册"]) {
        [self handleRegisterModule:service];
        return;
    }
    
    // 实名认证模块
    if ([module isEqualToString:@"实名认证"]) {
        [self handleRealAuthModule:service];
        return;
    }
    
    // 设备信息模块
    if ([module isEqualToString:@"设备信息"]) {
        [self handleDeviceInfoModule:service];
        return;
    }
    
    // 游戏区服模块
    if ([module isEqualToString:@"游戏区服"]) {
        [self handleGameAreaModule:service];
        return;
    }
    
    // 游戏角色模块
    if ([module isEqualToString:@"游戏角色"]) {
        [self handleGameCharacterModule:service];
        return;
    }
    
    // 公告/邮件模块
    if ([module isEqualToString:@"公告/邮件"]) {
        [self handleAnnouncementMailModule:service];
        return;
    }
    
    // 反馈模块
    if ([module isEqualToString:@"反馈"]) {
        [self handleFeedbackModule:service];
        return;
    }
    
    // 福利码模块
    if ([module isEqualToString:@"福利码"]) {
        [self handleWelfareCodeModule:service];
        return;
    }
    
    // 埋点模块
    if ([module isEqualToString:@"埋点"]) {
        [self handleTrackingModule:service];
        return;
    }
    
    // 支付(IAP)模块
    if ([module isEqualToString:@"支付(IAP)"]) {
        [self handlePaymentModule:service];
        return;
    }
    
    // 分享模块
    if ([module isEqualToString:@"分享"]) {
        [self handleShareModule:service];
        return;
    }
    
    // 注销账号模块
    if ([module isEqualToString:@"注销账号"]) {
        [self handleDeregisterModule:service];
        return;
    }
    
    // 评分模块
    if ([module isEqualToString:@"评分"]) {
        [self handleRatingModule:service];
        return;
    }
    
    NSString *categoryName = self.currentCategory == ServiceCategoryAPI ? @"API" : @"UI";
    NSString *title = [NSString stringWithFormat:@"[%@] %@ - %@", categoryName, module, service];
    NSString *message = [NSString stringWithFormat:@"%@ 调用\n\n待实现具体功能", service];
    [self showAlert:title message:message];
}

#pragma mark - 配置模块

- (void)handleConfigModule:(NSString *)service {
    if ([service isEqualToString:@"设置子渠道ID"]) {
        [self configSetSubChannelId];
    } else if ([service isEqualToString:@"设置语言"]) {
        [self configSetLanguage];
    } else if ([service isEqualToString:@"设置密码强度"]) {
        [self configSetPasswordStrength];
    } else if ([service isEqualToString:@"设置密码正则"]) {
        [self configSetPasswordRegex];
    } else if ([service isEqualToString:@"设置游戏角色信息"]) {
        [self configSetGameInfo];
    } else if ([service isEqualToString:@"设置错误码"]) {
        [self configSetErrorCode];
    } else if ([service isEqualToString:@"设置地区"]) {
        [self configSetRegion];
    } else {
        [self showAlert:@"配置模块" message:[NSString stringWithFormat:@"%@\n\n待实现", service]];
    }
}

// ==================== 配置模块实现 ====================

- (void)configSetSubChannelId {
    // ========== 瑞雪 SDK 设置子渠道 ID ==========
    NSString *subChannelId = @"sub_channel_001";  // 子渠道 ID
    
    [[RXSDK sharedSDK] setSubChannelId:subChannelId];
    NSLog(@"[RXSDK] 已设置子渠道 ID: %@", subChannelId);
    
    [self showAlert:@"设置子渠道ID" message:[NSString stringWithFormat:@"子渠道 ID 已设置为: %@", subChannelId]];
}

- (void)configSetLanguage {
    UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"选择语言"
                                                                   message:nil
                                                            preferredStyle:UIAlertControllerStyleActionSheet];
    
    NSArray *languages = @[@"zh-Hans (简体中文)", @"zh-Hant (繁体中文)", @"en (英语)", @"ja (日语)", @"th (泰语)", @"vi (越南语)"];
    NSArray *languageCodes = @[@"zh-Hans", @"zh-Hant", @"en", @"ja", @"th", @"vi"];
    
    for (NSInteger i = 0; i < languages.count; i++) {
        NSString *lang = languages[i];
        NSString *code = languageCodes[i];
        [alert addAction:[UIAlertAction actionWithTitle:lang style:UIAlertActionStyleDefault handler:^(UIAlertAction *action) {
            // ========== 瑞雪 SDK 设置当前语言 ==========
            [[RXSDK sharedSDK] setLanguage:code];
            NSLog(@"[RXSDK] 已设置语言为: %@", code);
            [self showAlert:@"设置语言" message:[NSString stringWithFormat:@"语言已设置为: %@", lang]];
        }]];
    }
    
    [alert addAction:[UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleCancel handler:nil]];
    [self presentViewController:alert animated:YES completion:nil];
}

- (void)configSetPasswordStrength {
    // 密码强度配置（此功能需要根据实际 SDK API 调整）
    UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"选择密码强度"
                                                                   message:nil
                                                            preferredStyle:UIAlertControllerStyleActionSheet];
    
    NSArray *strengthLevels = @[@"弱 (6位以上)", @"中 (8位以上，含数字和字母)", @"强 (8位以上，含大小写字母、数字和特殊字符)"];
    
    for (NSString *level in strengthLevels) {
        [alert addAction:[UIAlertAction actionWithTitle:level style:UIAlertActionStyleDefault handler:^(UIAlertAction *action) {
            NSLog(@"[RXSDK] 密码强度设置为: %@", level);
            [self showAlert:@"设置密码强度" message:[NSString stringWithFormat:@"密码强度已设置为: %@\n\n注：此功能需要根据实际 SDK API 调整", level]];
        }]];
    }
    
    [alert addAction:[UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleCancel handler:nil]];
    [self presentViewController:alert animated:YES completion:nil];
}

- (void)configSetPasswordRegex {
    // 密码正则配置（此功能需要根据实际 SDK API 调整）
    NSString *regex = @"^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$";
    NSLog(@"[RXSDK] 密码正则设置为: %@", regex);
    [self showAlert:@"设置密码正则" message:[NSString stringWithFormat:@"密码正则已设置为:\n\n%@\n\n(8位以上，含字母和数字)\n\n注：此功能需要根据实际 SDK API 调整", regex]];
}

- (void)configSetGameInfo {
    // ========== 瑞雪 SDK 设置游戏信息 ==========
    NSString *roleId = @"role_001";     // 游戏角色 ID
    NSString *regionTag = @"cn";        // 地区标签
    
    [[RXSDK sharedSDK] setGameInfoWithRoleId:roleId regionTag:regionTag];
    NSLog(@"[RXSDK] 已设置游戏信息: roleId=%@, regionTag=%@", roleId, regionTag);
    
    [self showAlert:@"设置游戏角色信息" message:[NSString stringWithFormat:@"游戏信息已设置:\n\n• 角色ID: %@\n• 地区标签: %@", roleId, regionTag]];
}

- (void)configSetErrorCode {
    // ========== 瑞雪 SDK 设置自定义错误码 ==========
    
    // 中文错误消息
    NSDictionary *zh = @{
        @"2002": @"自定义消息 $code$$thirdcode$$thirdmsg$",
        @"2000": @"",
        @"default": @"$msg$:$code$"
    };
    
    // 英文错误消息
    NSDictionary *en = @{
        @"2002": @"custom error $code$$thirdcode$$thirdmsg$",
        @"2000": @"error demo ",
        @"default": @"$msg$:$code$"
    };
    
    NSDictionary *errorMsgDic = @{
        @"zh": zh,
        @"en": en
    };
    
    [[RXSDK sharedSDK] configErrorMsg:errorMsgDic];
    NSLog(@"[RXSDK] 已设置自定义错误码");
    [self showAlert:@"设置错误码" message:@"自定义错误码已设置:\n\n中文:\n• 2002: 自定义消息\n• default: $msg$:$code$\n\n英文:\n• 2002: custom error\n• default: $msg$:$code$"];
}

- (void)configSetRegion {
    UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"选择地区"
                                                                   message:nil
                                                            preferredStyle:UIAlertControllerStyleActionSheet];
    
    NSArray *regions = @[@"CN (中国大陆)", @"HK (香港)", @"TW (台湾)", @"US (美国)", @"JP (日本)", @"KR (韩国)", @"SEA (东南亚)"];
    NSArray *regionCodes = @[@"CN", @"HK", @"TW", @"US", @"JP", @"KR", @"SEA"];
    
    for (NSInteger i = 0; i < regions.count; i++) {
        NSString *region = regions[i];
        NSString *code = regionCodes[i];
        [alert addAction:[UIAlertAction actionWithTitle:region style:UIAlertActionStyleDefault handler:^(UIAlertAction *action) {
            NSLog(@"[RXSDK] 地区设置为: %@", code);
            [self showAlert:@"设置地区" message:[NSString stringWithFormat:@"地区已设置为: %@\n\n注：此功能需要根据实际 SDK API 调整", region]];
        }]];
    }
    
    [alert addAction:[UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleCancel handler:nil]];
    [self presentViewController:alert animated:YES completion:nil];
}

#pragma mark - 信息获取模块

- (void)handleInfoModule:(NSString *)service {
    if ([service isEqualToString:@"获取请求域名"]) {
        [self infoGetApiDomain];
    } else if ([service isEqualToString:@"获取OpenID"]) {
        [self infoGetOpenId];
    } else if ([service isEqualToString:@"获取BaseUrl"]) {
        [self infoGetBaseUrl];
    } else if ([service isEqualToString:@"获取配置数据"]) {
        [self infoGetConfigData];
    } else {
        [self showAlert:@"信息获取" message:[NSString stringWithFormat:@"%@\n\n待实现", service]];
    }
}

// ==================== 信息获取模块实现 ====================

- (void)infoGetApiDomain {
    // ========== 瑞雪 SDK 获取请求域名 ==========
    NSString *domain = [[RXSDK sharedSDK] getApiDomain];
    NSLog(@"[RXSDK] 请求域名: %@", domain);
    [self showAlert:@"获取请求域名" message:[NSString stringWithFormat:@"当前请求域名:\n\n%@", domain ?: @"未获取到"]];
}

- (void)infoGetOpenId {
    // ========== 瑞雪 SDK 获取 OpenID ==========
    NSString *openId = [[RXSDK sharedSDK] getOpenID];
    NSLog(@"[RXSDK] OpenID: %@", openId);
    if (openId && openId.length > 0) {
        [self showAlert:@"获取OpenID" message:[NSString stringWithFormat:@"当前用户 OpenID:\n\n%@", openId]];
    } else {
        [self showAlert:@"获取OpenID" message:@"用户未登录或 OpenID 为空"];
    }
}

- (void)infoGetBaseUrl {
    // ========== 瑞雪 SDK 获取 BaseUrl ==========
    NSString *baseUrl = [[RXSDK sharedSDK] getFirstBaseUrl];
    NSLog(@"[RXSDK] BaseUrl: %@", baseUrl);
    [self showAlert:@"获取BaseUrl" message:[NSString stringWithFormat:@"当前 BaseUrl:\n\n%@", baseUrl ?: @"未获取到"]];
}

- (void)infoGetConfigData {
    // ========== 瑞雪 SDK 获取配置数据 ==========
    NSDictionary *configData = [[RXSDK sharedSDK] getConfigData];
    NSLog(@"[RXSDK] 配置数据: %@", configData);
    if (configData && configData.count > 0) {
        [self showAlert:@"获取配置数据" message:[NSString stringWithFormat:@"配置数据:\n\n%@", configData]];
    } else {
        [self showAlert:@"获取配置数据" message:@"暂无配置数据"];
    }
}

#pragma mark - 验证码模块

- (void)handleCaptchaModule:(NSString *)service {
    if ([service isEqualToString:@"发送验证码"]) {
        [self showSendCaptchaDialog];
    } else if ([service isEqualToString:@"校验验证码"]) {
        [self showVerifyCaptchaDialog];
    } else {
        [self showAlert:@"验证码模块" message:[NSString stringWithFormat:@"%@\n\n待实现", service]];
    }
}

- (void)showSendCaptchaDialog {
    UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"选择验证码用途"
                                                                   message:nil
                                                            preferredStyle:UIAlertControllerStyleActionSheet];
    
    // 用途选项
    NSDictionary *purposes = @{
        @"注册 (register)": @"register",
        @"登录 (login)": @"login",
        @"绑定手机 (bindphone)": @"bindphone",
        @"解绑手机 (unbindphone)": @"unbindphone",
        @"重置密码 (resetpwd)": @"resetpwd",
        @"修改密码 (changepwd)": @"changepwd",
        @"设置密码 (setpwd)": @"setpwd",
        @"绑定邮箱 (bindemail)": @"bindemail",
        @"解绑邮箱 (unbindemail)": @"unbindemail"
    };
    
    NSArray *titles = @[@"注册 (register)", @"登录 (login)", @"绑定手机 (bindphone)", 
                        @"解绑手机 (unbindphone)", @"重置密码 (resetpwd)", @"修改密码 (changepwd)",
                        @"设置密码 (setpwd)", @"绑定邮箱 (bindemail)", @"解绑邮箱 (unbindemail)"];
    
    for (NSString *title in titles) {
        NSString *purpose = purposes[title];
        [alert addAction:[UIAlertAction actionWithTitle:title style:UIAlertActionStyleDefault handler:^(UIAlertAction *action) {
            if ([purpose isEqualToString:@"bindemail"] || [purpose isEqualToString:@"unbindemail"]) {
                [self sendEmailCaptchaWithPurpose:purpose];
            } else {
                [self sendPhoneCaptchaWithPurpose:purpose];
            }
        }]];
    }
    
    [alert addAction:[UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleCancel handler:nil]];
    [self presentViewController:alert animated:YES completion:nil];
}

- (void)sendPhoneCaptchaWithPurpose:(NSString *)purpose {
    // ========== 瑞雪 SDK 发送手机验证码 ==========
    NSString *phone = @"15043052309";  // 测试手机号
    
    [[RXSDK sharedSDK] sendCaptchaWithType:CaptchaType_phone
                                    target:phone
                                   purpose:purpose
                                  complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                NSLog(@"[RXSDK] 验证码发送失败: code=%ld, msg=%@", (long)error.code, error.msg);
                [self showAlert:@"发送验证码失败" message:[NSString stringWithFormat:@"错误码: %ld\n错误信息: %@", (long)error.code, error.msg]];
                return;
            }
            NSLog(@"[RXSDK] 验证码发送成功: %@", response);
            [self showAlert:@"发送验证码成功" message:[NSString stringWithFormat:@"手机号: %@\n用途: %@\n\n请注意查收短信", phone, purpose]];
        });
    }];
}

- (void)sendEmailCaptchaWithPurpose:(NSString *)purpose {
    // ========== 瑞雪 SDK 发送邮箱验证码 ==========
    NSString *email = @"test@example.com";  // 测试邮箱
    
    [[RXSDK sharedSDK] sendCaptchaWithType:CaptchaType_email
                                    target:email
                                   purpose:purpose
                                  complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                NSLog(@"[RXSDK] 邮箱验证码发送失败: code=%ld, msg=%@", (long)error.code, error.msg);
                [self showAlert:@"发送验证码失败" message:[NSString stringWithFormat:@"错误码: %ld\n错误信息: %@", (long)error.code, error.msg]];
                return;
            }
            NSLog(@"[RXSDK] 邮箱验证码发送成功: %@", response);
            [self showAlert:@"发送验证码成功" message:[NSString stringWithFormat:@"邮箱: %@\n用途: %@\n\n请注意查收邮件", email, purpose]];
        });
    }];
}

- (void)showVerifyCaptchaDialog {
    // ========== 瑞雪 SDK 校验验证码 ==========
    NSString *phone = @"15043052309";   // 测试手机号
    NSString *captchaCode = @"1111";    // 测试验证码
    NSString *purpose = @"login";       // 用途
    
    [[RXSDK sharedSDK] verifyCaptchaWithType:CaptchaType_phone
                                      target:phone
                                     purpose:purpose
                                 captchaCode:captchaCode
                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                NSLog(@"[RXSDK] 验证码校验失败: code=%ld, msg=%@", (long)error.code, error.msg);
                [self showAlert:@"校验验证码失败" message:[NSString stringWithFormat:@"错误码: %ld\n错误信息: %@", (long)error.code, error.msg]];
                return;
            }
            NSLog(@"[RXSDK] 验证码校验成功: %@", response);
            [self showAlert:@"校验验证码成功" message:[NSString stringWithFormat:@"手机号: %@\n验证码: %@\n\n校验通过", phone, captchaCode]];
        });
    }];
}

#pragma mark - 账号绑定模块

- (void)handleBindingModule:(NSString *)service {
    if ([service isEqualToString:@"绑定邮箱"]) {
        [self bindEmail];
    } else if ([service isEqualToString:@"解绑邮箱"]) {
        [self unbindEmail];
    } else if ([service isEqualToString:@"绑定手机"]) {
        [self bindPhone];
    } else if ([service isEqualToString:@"解绑手机"]) {
        [self unbindPhone];
    } else if ([service isEqualToString:@"修改手机号"]) {
        [self changePhone];
    } else {
        [self showAlert:@"账号绑定" message:[NSString stringWithFormat:@"%@\n\n待实现", service]];
    }
}

// ==================== 账号绑定模块实现 ====================

- (void)bindEmail {
    // ========== 瑞雪 SDK 绑定邮箱 ==========
    // 前置条件：需要先调用 sendCaptcha 发送验证码（purpose: bindemail）
    NSString *email = @"test@example.com";   // 邮箱地址
    NSString *password = @"123456";          // 密码
    NSString *captchaCode = @"1111";         // 验证码
    
    [[RXSDK sharedSDK] bindEmailWithEmail:email
                                 password:password
                              captchaCode:captchaCode
                              migrateArgs:nil
                                 complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                NSLog(@"[RXSDK] 绑定邮箱失败: code=%ld, msg=%@", (long)error.code, error.msg);
                [self showAlert:@"绑定邮箱失败" message:[NSString stringWithFormat:@"错误码: %ld\n错误信息: %@", (long)error.code, error.msg]];
                return;
            }
            NSLog(@"[RXSDK] 绑定邮箱成功: %@", response);
            [self showAlert:@"绑定邮箱成功" message:[NSString stringWithFormat:@"邮箱: %@\n\n绑定成功", email]];
        });
    }];
}

- (void)unbindEmail {
    // ========== 瑞雪 SDK 解绑邮箱 ==========
    // 前置条件：需要先调用 sendCaptcha 发送验证码（purpose: unbindemail）
    NSString *email = @"test@example.com";   // 当前绑定的邮箱
    NSString *captchaCode = @"1111";         // 验证码
    
    [[RXSDK sharedSDK] unBindEmailWithEmail:email
                                captchaCode:captchaCode
                                   complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                NSLog(@"[RXSDK] 解绑邮箱失败: code=%ld, msg=%@", (long)error.code, error.msg);
                [self showAlert:@"解绑邮箱失败" message:[NSString stringWithFormat:@"错误码: %ld\n错误信息: %@", (long)error.code, error.msg]];
                return;
            }
            NSLog(@"[RXSDK] 解绑邮箱成功: %@", response);
            [self showAlert:@"解绑邮箱成功" message:[NSString stringWithFormat:@"邮箱: %@\n\n解绑成功", email]];
        });
    }];
}

- (void)bindPhone {
    // ========== 瑞雪 SDK 绑定手机 ==========
    // 前置条件：需要先调用 sendCaptcha 发送验证码（purpose: bindphone）
    NSString *phone = @"15043052309";        // 手机号
    NSString *password = @"123456";          // 密码
    NSString *captchaCode = @"1111";         // 验证码
    
    [[RXSDK sharedSDK] bindPhoneWithCaptchaCode:captchaCode
                                       password:password
                                          phone:phone
                                    migrateArgs:nil
                                       complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                NSLog(@"[RXSDK] 绑定手机失败: code=%ld, msg=%@", (long)error.code, error.msg);
                [self showAlert:@"绑定手机失败" message:[NSString stringWithFormat:@"错误码: %ld\n错误信息: %@", (long)error.code, error.msg]];
                return;
            }
            NSLog(@"[RXSDK] 绑定手机成功: %@", response);
            [self showAlert:@"绑定手机成功" message:[NSString stringWithFormat:@"手机号: %@\n\n绑定成功", phone]];
        });
    }];
}

- (void)unbindPhone {
    // ========== 瑞雪 SDK 解绑手机 ==========
    // 前置条件：需要先调用 sendCaptcha 发送验证码（purpose: unbindphone）
    NSString *phone = @"15043052309";        // 当前绑定的手机号
    NSString *captchaCode = @"1111";         // 验证码
    
    [[RXSDK sharedSDK] unBindPhoneWithCaptchaCode:captchaCode
                                            phone:phone
                                         complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                NSLog(@"[RXSDK] 解绑手机失败: code=%ld, msg=%@", (long)error.code, error.msg);
                [self showAlert:@"解绑手机失败" message:[NSString stringWithFormat:@"错误码: %ld\n错误信息: %@", (long)error.code, error.msg]];
                return;
            }
            NSLog(@"[RXSDK] 解绑手机成功: %@", response);
            [self showAlert:@"解绑手机成功" message:[NSString stringWithFormat:@"手机号: %@\n\n解绑成功", phone]];
        });
    }];
}

- (void)changePhone {
    // ========== 瑞雪 SDK 修改手机号 ==========
    // 前置条件：需要先给新旧手机都发送验证码
    NSString *newPhone = @"13900139000";     // 新手机号
    NSString *newPhoneCaptcha = @"1111";     // 新手机验证码
    NSString *oldPhoneCaptcha = @"1111";     // 旧手机验证码
    
    [[RXSDK sharedSDK] changePhoneWithOldPhoneCaptcha:oldPhoneCaptcha
                                             newphone:newPhone
                                      newPhoneCaptcha:newPhoneCaptcha
                                          migrateArgs:nil
                                             complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                NSLog(@"[RXSDK] 修改手机号失败: code=%ld, msg=%@", (long)error.code, error.msg);
                [self showAlert:@"修改手机号失败" message:[NSString stringWithFormat:@"错误码: %ld\n错误信息: %@", (long)error.code, error.msg]];
                return;
            }
            NSLog(@"[RXSDK] 修改手机号成功: %@", response);
            [self showAlert:@"修改手机号成功" message:[NSString stringWithFormat:@"新手机号: %@\n\n修改成功", newPhone]];
        });
    }];
}

#pragma mark - 密码模块

- (void)handlePasswordModule:(NSString *)service {
    if ([service isEqualToString:@"修改密码"]) {
        [self changePasswordAction];
    } else if ([service isEqualToString:@"重置密码"]) {
        [self resetPasswordAction];
    } else {
        [self showAlert:@"密码模块" message:[NSString stringWithFormat:@"%@\n\n待实现", service]];
    }
}

// ==================== 密码模块实现 ====================

- (void)changePasswordAction {
    // ========== 瑞雪 SDK 修改密码 ==========
    NSString *oldPassword = @"111111";       // 旧密码
    NSString *newPassword = @"123456";       // 新密码
    
    [[RXSDK sharedSDK] changePasswordWithNewPwd:newPassword
                                         oldPwd:oldPassword
                                       complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                NSLog(@"[RXSDK] 修改密码失败: code=%ld, msg=%@", (long)error.code, error.msg);
                [self showAlert:@"修改密码失败" message:[NSString stringWithFormat:@"错误码: %ld\n错误信息: %@", (long)error.code, error.msg]];
                return;
            }
            NSLog(@"[RXSDK] 修改密码成功: %@", response);
            [self showAlert:@"修改密码成功" message:@"密码已修改\n\n建议重新登录"];
        });
    }];
}

- (void)resetPasswordAction {
    // ========== 瑞雪 SDK 重置密码 ==========
    // 前置条件：需要先调用 sendCaptcha 发送验证码（purpose: resetpwd）
    NSString *phone = @"15043052309";        // 手机号
    NSString *newPassword = @"123456";       // 新密码
    NSString *captchaCode = @"1111";         // 验证码
    
    [[RXSDK sharedSDK] resetPasswordWithUsername:phone
                                        password:newPassword
                                     captchaCode:captchaCode
                                     migrateArgs:nil
                                        complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                NSLog(@"[RXSDK] 重置密码失败: code=%ld, msg=%@", (long)error.code, error.msg);
                [self showAlert:@"重置密码失败" message:[NSString stringWithFormat:@"错误码: %ld\n错误信息: %@", (long)error.code, error.msg]];
                return;
            }
            NSLog(@"[RXSDK] 重置密码成功: %@", response);
            [self showAlert:@"重置密码成功" message:[NSString stringWithFormat:@"手机号: %@\n\n密码已重置，请重新登录", phone]];
        });
    }];
}

#pragma mark - 注册模块

- (void)handleRegisterModule:(NSString *)service {
    if ([service isEqualToString:@"注册账号"]) {
        [self registerAccount];
    } else {
        [self showAlert:@"注册模块" message:[NSString stringWithFormat:@"%@\n\n待实现", service]];
    }
}

// ==================== 注册模块实现 ====================

- (void)registerAccount {
    // ========== 瑞雪 SDK 用户注册 ==========
    // 前置条件：需要先调用 sendCaptcha 发送验证码（purpose: register）
    NSString *phone = @"15043052309";        // 手机号
    NSString *password = @"123456";          // 密码
    NSString *captchaCode = @"1111";         // 验证码
    
    NSDictionary *ext = @{
        @"nickname": @"测试用户",  // 可选，昵称
    };
    
    [[RXSDK sharedSDK] registerWithUsername:phone
                                   password:password
                                captchaCode:captchaCode
                                        ext:ext
                                   complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                NSLog(@"[RXSDK] 注册失败: code=%ld, msg=%@", (long)error.code, error.msg);
                [self showAlert:@"注册失败" message:[NSString stringWithFormat:@"错误码: %ld\n错误信息: %@", (long)error.code, error.msg]];
                return;
            }
            NSLog(@"[RXSDK] 注册成功: %@", response);
            [self showAlert:@"注册成功" message:[NSString stringWithFormat:@"手机号: %@\n\n注册成功，可以使用该账号登录", phone]];
        });
    }];
}

#pragma mark - 实名认证模块

- (void)handleRealAuthModule:(NSString *)service {
    if ([service isEqualToString:@"实名认证"]) {
        [self realAuth];
    } else if ([service isEqualToString:@"IIFAA快速实名"]) {
        [self getIIFAARedirectURL];
    } else {
        [self showAlert:@"实名认证模块" message:[NSString stringWithFormat:@"%@\n\n待实现", service]];
    }
}

// ==================== 实名认证模块实现 ====================

- (void)realAuth {
    // ========== 瑞雪 SDK 实名认证 ==========
    NSString *realName = @"张三";                  // 必填，真实姓名
    NSString *idCard = @"110101199001011234";      // 必填，18位身份证号码
    
    [[RXSDK sharedSDK] realAuthWithRealName:realName
                                     idCard:idCard
                                   complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                NSLog(@"[RXSDK] 实名认证失败: code=%ld, msg=%@", (long)error.code, error.msg);
                [self showAlert:@"实名认证失败" message:[NSString stringWithFormat:@"错误码: %ld\n错误信息: %@", (long)error.code, error.msg]];
                return;
            }
            
            NSLog(@"[RXSDK] 实名认证成功: %@", response);
            NSDictionary *data = response[@"data"];
            NSInteger age = [data[@"age"] integerValue];
            BOOL isAdult = age >= 18;
            NSString *pi = data[@"pi"] ?: @"";
            
            NSString *maskedIdCard = [NSString stringWithFormat:@"%@****%@", 
                                      [idCard substringToIndex:6], 
                                      [idCard substringFromIndex:14]];
            
            NSString *message = [NSString stringWithFormat:@"姓名: %@\n身份证: %@\n年龄: %ld\n是否成年: %@\nPI: %@",
                                realName, maskedIdCard, (long)age, isAdult ? @"是" : @"否", pi];
            [self showAlert:@"实名认证成功" message:message];
        });
    }];
}

- (void)getIIFAARedirectURL {
    // ========== 瑞雪 SDK 获取 IIFAA 支付宝授权跳转地址（快速实名）==========
    NSString *appName = @"测试应用";                    // 必填，应用名称
    NSString *thirdPartSchema = @"rxsdkdemo://";       // 必填，第三方回调 schema
    
    [[RXSDK sharedSDK] getIIFAARedirectURLWithAppName:appName
                                      thirdPartSchema:thirdPartSchema
                                             complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                NSLog(@"[RXSDK] 获取IIFAA跳转地址失败: code=%ld, msg=%@", (long)error.code, error.msg);
                [self showAlert:@"IIFAA快速实名失败" message:[NSString stringWithFormat:@"错误码: %ld\n错误信息: %@", (long)error.code, error.msg]];
                return;
            }
            
            NSLog(@"[RXSDK] 获取IIFAA跳转地址成功: %@", response);
            NSDictionary *data = response[@"data"];
            NSString *redirectURL = data[@"redirect_url"] ?: @"";
            
            NSString *message = [NSString stringWithFormat:@"跳转地址:\n%@", redirectURL];
            [self showAlert:@"IIFAA快速实名" message:message];
        });
    }];
}

#pragma mark - 设备信息模块

- (void)handleDeviceInfoModule:(NSString *)service {
    if ([service isEqualToString:@"获取设备码"]) {
        [self getDeviceCode];
    } else if ([service isEqualToString:@"获取时区偏移"]) {
        [self getTimeZoneOffset];
    } else if ([service isEqualToString:@"获取系统语言"]) {
        [self getSystemLanguageInfo];
    } else {
        [self showAlert:@"设备信息模块" message:[NSString stringWithFormat:@"%@\n\n待实现", service]];
    }
}

// ==================== 设备信息模块实现 ====================

- (void)getDeviceCode {
    // ========== 瑞雪 SDK 获取设备码 ==========
    NSString *deviceCode = [[RXSDK sharedSDK] getDeviceCode];
    NSLog(@"[RXSDK] 设备码: %@", deviceCode);
    [self showAlert:@"获取设备码" message:[NSString stringWithFormat:@"设备码:\n%@", deviceCode]];
}

- (void)getTimeZoneOffset {
    // ========== 瑞雪 SDK 获取时区偏移 ==========
    NSString *offset = [[RXSDK sharedSDK] getTimeZoneOffset];
    NSLog(@"[RXSDK] 时区偏移: %@", offset);
    [self showAlert:@"获取时区偏移" message:[NSString stringWithFormat:@"时区偏移: %@", offset]];
}

- (void)getSystemLanguageInfo {
    // ========== 瑞雪 SDK 获取系统语言 ==========
    NSString *language = [[RXSDK sharedSDK] getSystemLanguage];
    NSLog(@"[RXSDK] 系统语言: %@", language);
    [self showAlert:@"获取系统语言" message:[NSString stringWithFormat:@"系统语言: %@", language]];
}

#pragma mark - 游戏区服模块

- (void)handleGameAreaModule:(NSString *)service {
    if ([service isEqualToString:@"查询区服"]) {
        [self searchGameAreaInfo];
    } else if ([service isEqualToString:@"查询区服列表"]) {
        [self searchGameAreaListInfo];
    } else if ([service isEqualToString:@"创建区服"]) {
        [self createGameArea];
    } else if ([service isEqualToString:@"修改区服"]) {
        [self updateGameAreaInfo];
    } else if ([service isEqualToString:@"删除区服"]) {
        [self deleteGameArea];
    } else {
        [self showAlert:@"游戏区服模块" message:[NSString stringWithFormat:@"%@\n\n待实现", service]];
    }
}

// ==================== 游戏区服模块实现 ====================

- (void)searchGameAreaInfo {
    // ========== 瑞雪 SDK 查询区服信息 ==========
    NSString *areaId = @"server_001";
    
    [[RXSDK sharedSDK] searchGameAreaInfoWithAreaId:areaId
                                           complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                [self showAlert:@"查询区服失败" message:[NSString stringWithFormat:@"错误码: %ld\n%@", (long)error.code, error.msg]];
                return;
            }
            NSDictionary *data = response[@"data"];
            NSString *areaName = data[@"area_name"] ?: @"";
            NSString *areaStatus = data[@"area_status"] ?: @"";
            NSString *areaType = data[@"area_type"] ?: @"";
            [self showAlert:@"查询区服成功" message:[NSString stringWithFormat:@"区服ID: %@\n区服名称: %@\n状态: %@\n类型: %@", areaId, areaName, areaStatus, areaType]];
        });
    }];
}

- (void)searchGameAreaListInfo {
    // ========== 瑞雪 SDK 查询区服列表 ==========
    [[RXSDK sharedSDK] searchGameAreaListInfoWithComplete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                [self showAlert:@"查询区服列表失败" message:[NSString stringWithFormat:@"错误码: %ld\n%@", (long)error.code, error.msg]];
                return;
            }
            NSArray *list = response[@"data"][@"list"];
            if (list && list.count > 0) {
                NSMutableString *msg = [NSMutableString stringWithFormat:@"共 %lu 个区服:\n\n", (unsigned long)list.count];
                for (NSDictionary *area in list) {
                    [msg appendFormat:@"• %@ - %@ [%@]\n", area[@"area_id"], area[@"area_name"], area[@"area_status"]];
                }
                [self showAlert:@"区服列表" message:msg];
            } else {
                [self showAlert:@"区服列表" message:@"暂无区服数据"];
            }
        });
    }];
}

- (void)createGameArea {
    // ========== 瑞雪 SDK 创建区服 ==========
    NSString *areaId = [NSString stringWithFormat:@"server_%ld", (long)[[NSDate date] timeIntervalSince1970]];
    NSString *areaName = @"测试区服";
    NSString *areaStatus = @"1";
    NSString *areaType = @"1";
    
    NSDictionary *extension = @{@"max_players": @10000};
    
    [[RXSDK sharedSDK] createGameAreaWithAreaId:areaId
                                       areaName:areaName
                                     areaStatus:areaStatus
                                       areaType:areaType
                                      extension:extension
                                       complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                [self showAlert:@"创建区服失败" message:[NSString stringWithFormat:@"错误码: %ld\n%@", (long)error.code, error.msg]];
                return;
            }
            [self showAlert:@"创建区服成功" message:[NSString stringWithFormat:@"区服ID: %@\n区服名称: %@\n状态: %@", areaId, areaName, areaStatus]];
        });
    }];
}

- (void)updateGameAreaInfo {
    // ========== 瑞雪 SDK 更新区服信息 ==========
    NSString *areaId = @"server_001";
    NSString *areaName = @"更新后的名称";
    NSString *areaStatus = @"2";
    NSString *areaType = @"1";
    
    [[RXSDK sharedSDK] updateGameAreaInfoWithAreaId:areaId
                                           areaName:areaName
                                         areaStatus:areaStatus
                                           areaType:areaType
                                          extension:nil
                                           complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                [self showAlert:@"修改区服失败" message:[NSString stringWithFormat:@"错误码: %ld\n%@", (long)error.code, error.msg]];
                return;
            }
            [self showAlert:@"修改区服成功" message:[NSString stringWithFormat:@"区服ID: %@\n新状态: %@", areaId, areaStatus]];
        });
    }];
}

- (void)deleteGameArea {
    // ========== 瑞雪 SDK 删除区服 ==========
    NSString *areaId = @"server_001";
    
    [[RXSDK sharedSDK] deleteGameAreaWithAreaId:areaId
                                       complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                [self showAlert:@"删除区服失败" message:[NSString stringWithFormat:@"错误码: %ld\n%@", (long)error.code, error.msg]];
                return;
            }
            [self showAlert:@"删除区服成功" message:[NSString stringWithFormat:@"已删除区服: %@", areaId]];
        });
    }];
}

#pragma mark - 游戏角色模块

- (void)handleGameCharacterModule:(NSString *)service {
    if ([service isEqualToString:@"创建角色"]) {
        [self createGameCharacter];
    } else if ([service isEqualToString:@"修改角色"]) {
        [self updateGameCharacter];
    } else if ([service isEqualToString:@"删除角色"]) {
        [self deleteGameCharacter];
    } else if ([service isEqualToString:@"查询角色列表"]) {
        [self searchGameCharacterList];
    } else if ([service isEqualToString:@"查询角色信息"]) {
        [self searchGameCharacterInfoAction];
    } else if ([service isEqualToString:@"查询游戏账号"]) {
        [self searchGameAccount];
    } else {
        [self showAlert:@"游戏角色模块" message:[NSString stringWithFormat:@"%@\n\n待实现", service]];
    }
}

// ==================== 游戏角色模块实现 ====================

- (void)createGameCharacter {
    // ========== 瑞雪 SDK 创建游戏角色 ==========
    NSString *areaId = @"server_001";                                                              // 必填，区服 ID
    NSString *characterId = [NSString stringWithFormat:@"char_%ld", (long)[[NSDate date] timeIntervalSince1970]];  // 必填，角色 ID
    NSString *characterName = @"测试角色";                                                          // 必填，角色名称
    NSString *cpUserId = @"cp_user_001";                                                           // 必填，CP 用户 ID
    NSString *characterFaction = @"联盟";                                                           // 可选，阵营
    NSString *characterLevel = @"1";                                                               // 可选，角色等级
    NSString *characterProfession = @"战士";                                                        // 可选，职业
    NSString *characterStatus = @"1";                                                              // 可选，状态
    NSString *characterType = @"1";                                                                // 可选，类型
    NSString *characterVipLevel = @"0";                                                            // 可选，VIP 等级
    
    [[RXSDK sharedSDK] createGameCharacterWithAreaId:areaId               // 区服 ID
                                    characterFaction:characterFaction     // 阵营
                                         characterId:characterId          // 角色 ID
                                      characterLevel:characterLevel       // 角色等级
                                       characterName:characterName        // 角色名称
                                 characterProfession:characterProfession  // 职业
                                     characterStatus:characterStatus      // 状态
                                       characterType:characterType        // 类型
                                   characterVipLevel:characterVipLevel    // VIP 等级
                                            cpUserId:cpUserId             // CP 用户 ID
                                           extension:nil                  // 扩展字段（可选）
                                            complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                [self showAlert:@"创建角色失败" message:[NSString stringWithFormat:@"错误码: %ld\n%@", (long)error.code, error.msg]];
                return;
            }
            [self showAlert:@"创建角色成功" message:[NSString stringWithFormat:@"角色ID: %@\n角色名: %@\n等级: %@\n职业: %@", characterId, characterName, characterLevel, characterProfession]];
        });
    }];
}

- (void)updateGameCharacter {
    // ========== 瑞雪 SDK 更新游戏角色 ==========
    NSString *areaId = @"server_001";       // 必填，区服 ID
    NSString *characterId = @"char_001";    // 必填，角色 ID
    NSString *cpUserId = @"cp_user_001";    // 必填，CP 用户 ID
    NSString *characterLevel = @"50";       // 新等级
    
    [[RXSDK sharedSDK] updateGameCharacterInfoWithAreaId:areaId               // 区服 ID
                                        characterFaction:nil                  // 阵营（不修改传 nil）
                                             characterId:characterId          // 角色 ID
                                          characterLevel:characterLevel       // 角色等级
                                           characterName:nil                  // 角色名称（不修改传 nil）
                                     characterProfession:nil                  // 职业（不修改传 nil）
                                         characterStatus:nil                  // 状态（不修改传 nil）
                                           characterType:nil                  // 类型（不修改传 nil）
                                       characterVipLevel:nil                  // VIP 等级（不修改传 nil）
                                                cpUserId:cpUserId             // CP 用户 ID
                                               extension:nil                  // 扩展字段（可选）
                                                complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                [self showAlert:@"修改角色失败" message:[NSString stringWithFormat:@"错误码: %ld\n%@", (long)error.code, error.msg]];
                return;
            }
            [self showAlert:@"修改角色成功" message:[NSString stringWithFormat:@"角色ID: %@\n新等级: %@", characterId, characterLevel]];
        });
    }];
}

- (void)deleteGameCharacter {
    // ========== 瑞雪 SDK 删除游戏角色 ==========
    NSString *areaId = @"server_001";       // 必填，区服 ID
    NSString *characterId = @"char_001";    // 必填，角色 ID
    NSString *cpUserId = @"cp_user_001";    // 必填，CP 用户 ID
    
    [[RXSDK sharedSDK] deleteGameCharacterWithAreaId:areaId         // 区服 ID
                                         characterId:characterId    // 角色 ID
                                            cpUserId:cpUserId       // CP 用户 ID
                                            complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                [self showAlert:@"删除角色失败" message:[NSString stringWithFormat:@"错误码: %ld\n%@", (long)error.code, error.msg]];
                return;
            }
            [self showAlert:@"删除角色成功" message:[NSString stringWithFormat:@"已删除角色: %@", characterId]];
        });
    }];
}

- (void)searchGameCharacterList {
    // ========== 瑞雪 SDK 查询角色列表 ==========
    NSString *cpUserId = @"cp_user_001";  // 必填，CP 用户 ID
    
    [[RXSDK sharedSDK] searchGameCharacterListInfoWithCpUserId:cpUserId  // CP 用户 ID
                                                      complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                [self showAlert:@"查询角色列表失败" message:[NSString stringWithFormat:@"错误码: %ld\n%@", (long)error.code, error.msg]];
                return;
            }
            NSArray *list = response[@"data"][@"list"];
            if (list && list.count > 0) {
                NSMutableString *msg = [NSMutableString stringWithFormat:@"共 %lu 个角色:\n\n", (unsigned long)list.count];
                for (NSDictionary *character in list) {
                    [msg appendFormat:@"• %@ Lv.%@ [%@]\n", character[@"character_name"], character[@"character_level"], character[@"area_id"]];
                }
                [self showAlert:@"角色列表" message:msg];
            } else {
                [self showAlert:@"角色列表" message:@"暂无角色数据"];
            }
        });
    }];
}

- (void)searchGameCharacterInfoAction {
    // ========== 瑞雪 SDK 查询角色信息 ==========
    NSString *areaId = @"server_001";       // 必填，区服 ID
    NSString *cpUserId = @"cp_user_001";    // 必填，CP 用户 ID
    NSString *characterId = @"char_001";    // 必填，角色 ID
    
    [[RXSDK sharedSDK] searchGameCharacterInfoWithAreaId:areaId         // 区服 ID
                                                cpUserId:cpUserId       // CP 用户 ID
                                             characterId:characterId    // 角色 ID
                                                complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                [self showAlert:@"查询角色信息失败" message:[NSString stringWithFormat:@"错误码: %ld\n%@", (long)error.code, error.msg]];
                return;
            }
            NSDictionary *data = response[@"data"];
            if (data) {
                [self showAlert:@"角色信息" message:[NSString stringWithFormat:@"角色ID: %@\n角色名: %@\n等级: %@\n职业: %@\nVIP: %@", 
                    data[@"character_id"], data[@"character_name"], data[@"character_level"], 
                    data[@"character_profession"], data[@"character_vip_level"]]];
            } else {
                [self showAlert:@"角色信息" message:@"数据为空"];
            }
        });
    }];
}

- (void)searchGameAccount {
    // ========== 瑞雪 SDK 查询游戏账号 ==========
    [[RXSDK sharedSDK] searchGameAccountWithComplete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                [self showAlert:@"查询游戏账号失败" message:[NSString stringWithFormat:@"错误码: %ld\n%@", (long)error.code, error.msg]];
                return;
            }
            NSDictionary *data = response[@"data"];
            [self showAlert:@"游戏账号信息" message:data ? [data description] : @"无数据"];
        });
    }];
}

#pragma mark - 公告/邮件模块

- (void)handleAnnouncementMailModule:(NSString *)service {
    if ([service isEqualToString:@"获取公告列表"]) {
        [self getAnnouncementList];
    } else if ([service isEqualToString:@"获取临时公告"]) {
        [self getTempNotice];
    } else if ([service isEqualToString:@"获取邮件列表"]) {
        [self getEmailListAction];
    } else if ([service isEqualToString:@"获取邮件详情"]) {
        [self getEmailDetail];
    } else if ([service isEqualToString:@"领取道具"]) {
        [self receiveProps];
    } else if ([service isEqualToString:@"删除邮件"]) {
        [self deleteEmailAction];
    } else {
        [self showAlert:@"公告/邮件模块" message:[NSString stringWithFormat:@"%@\n\n待实现", service]];
    }
}

// ==================== 公告/邮件模块实现 ====================

- (void)getAnnouncementList {
    // ========== 瑞雪 SDK 获取公告列表 ==========
    int limit = 10;  // 必填，获取条数（1-100）
    
    [[RXSDK sharedSDK] getAnnouncementWithLimit:limit  // 获取条数
                                       complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                [self showAlert:@"获取公告失败" message:[NSString stringWithFormat:@"错误码: %ld\n%@", (long)error.code, error.msg]];
                return;
            }
            NSArray *list = response[@"data"][@"list"];
            if (list && list.count > 0) {
                NSMutableString *msg = [NSMutableString stringWithFormat:@"共 %lu 条公告:\n\n", (unsigned long)list.count];
                for (NSInteger i = 0; i < MIN(list.count, 5); i++) {
                    NSDictionary *item = list[i];
                    [msg appendFormat:@"• %@\n", item[@"title"]];
                }
                [self showAlert:@"公告列表" message:msg];
            } else {
                [self showAlert:@"公告列表" message:@"暂无公告"];
            }
        });
    }];
}

- (void)getTempNotice {
    // ========== 瑞雪 SDK 获取临时公告 ==========
    [[RXSDK sharedSDK] getTempNotice:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                [self showAlert:@"获取临时公告失败" message:[NSString stringWithFormat:@"错误码: %ld\n%@", (long)error.code, error.msg]];
                return;
            }
            NSDictionary *data = response[@"data"];
            if (data && data.count > 0) {
                NSString *title = data[@"title"] ?: @"";
                NSString *content = data[@"content"] ?: @"";
                [self showAlert:@"临时公告" message:[NSString stringWithFormat:@"标题: %@\n\n内容: %@", title, content]];
            } else {
                [self showAlert:@"临时公告" message:@"暂无临时公告"];
            }
        });
    }];
}

- (void)getEmailListAction {
    // ========== 瑞雪 SDK 获取邮件列表 ==========
    NSString *cpUserID = @"cp_user_001";  // 必填，CP 用户 ID
    
    [[RXSDK sharedSDK] getEmailListWithCpUserID:cpUserID  // CP 用户 ID
                                       complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                [self showAlert:@"获取邮件列表失败" message:[NSString stringWithFormat:@"错误码: %ld\n%@", (long)error.code, error.msg]];
                return;
            }
            NSArray *list = response[@"data"][@"list"];
            if (list && list.count > 0) {
                NSMutableString *msg = [NSMutableString stringWithFormat:@"共 %lu 封邮件:\n\n", (unsigned long)list.count];
                for (NSInteger i = 0; i < MIN(list.count, 5); i++) {
                    NSDictionary *item = list[i];
                    [msg appendFormat:@"• [%@] %@\n", item[@"id"], item[@"title"]];
                }
                [self showAlert:@"邮件列表" message:msg];
            } else {
                [self showAlert:@"邮件列表" message:@"暂无邮件"];
            }
        });
    }];
}

- (void)getEmailDetail {
    // ========== 瑞雪 SDK 获取邮件详情 ==========
    NSString *cpUserID = @"cp_user_001";  // 必填，CP 用户 ID
    NSInteger emailID = 12345;             // 必填，邮件 ID
    
    [[RXSDK sharedSDK] getEmailDetailWithCpUserID:cpUserID  // CP 用户 ID
                                          emailID:emailID   // 邮件 ID
                                         complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                [self showAlert:@"获取邮件详情失败" message:[NSString stringWithFormat:@"错误码: %ld\n%@", (long)error.code, error.msg]];
                return;
            }
            NSDictionary *data = response[@"data"];
            if (data) {
                NSString *title = data[@"title"] ?: @"";
                NSString *content = data[@"content"] ?: @"";
                [self showAlert:@"邮件详情" message:[NSString stringWithFormat:@"标题: %@\n\n内容: %@", title, content]];
            } else {
                [self showAlert:@"邮件详情" message:@"数据为空"];
            }
        });
    }];
}

- (void)receiveProps {
    // ========== 瑞雪 SDK 领取道具 ==========
    NSString *cpUserID = @"cp_user_001";  // 必填，CP 用户 ID
    NSInteger type = 1;                    // 必填，领取类型（1=领取当前，2=一键领取所有）
    NSInteger emailID = 12345;             // 必填，邮件 ID（type=2 时可传 0）
    
    [[RXSDK sharedSDK] receivePropsWithCpUserID:cpUserID  // CP 用户 ID
                                           type:type      // 领取类型
                                        emailID:emailID   // 邮件 ID
                                       complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                [self showAlert:@"领取道具失败" message:[NSString stringWithFormat:@"错误码: %ld\n%@", (long)error.code, error.msg]];
                return;
            }
            [self showAlert:@"领取道具成功" message:[NSString stringWithFormat:@"邮件ID: %ld\n\n道具已领取", (long)emailID]];
        });
    }];
}

- (void)deleteEmailAction {
    // ========== 瑞雪 SDK 删除邮件 ==========
    NSString *cpUserID = @"cp_user_001";  // 必填，CP 用户 ID
    NSInteger type = 1;                    // 必填，删除类型（1=删除当前，2=一键删除所有）
    NSInteger emailID = 12345;             // 必填，邮件 ID（type=2 时可传 0）
    
    [[RXSDK sharedSDK] deleteEmailWithCpUserID:cpUserID  // CP 用户 ID
                                          type:type      // 删除类型
                                       emailID:emailID   // 邮件 ID
                                      complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                [self showAlert:@"删除邮件失败" message:[NSString stringWithFormat:@"错误码: %ld\n%@", (long)error.code, error.msg]];
                return;
            }
            [self showAlert:@"删除邮件成功" message:[NSString stringWithFormat:@"邮件ID: %ld\n\n已删除", (long)emailID]];
        });
    }];
}

#pragma mark - 反馈模块

- (void)handleFeedbackModule:(NSString *)service {
    if ([service isEqualToString:@"创建反馈"]) {
        [self createFeedbackAction];
    } else if ([service isEqualToString:@"获取反馈列表"]) {
        [self getFeedbackList];
    } else if ([service isEqualToString:@"获取反馈详情"]) {
        [self getFeedbackDetail];
    } else if ([service isEqualToString:@"领取反馈道具"]) {
        [self getFeedbackProp];
    } else if ([service isEqualToString:@"获取反馈类型"]) {
        [self getFeedbackKindList];
    } else if ([service isEqualToString:@"创建意见反馈"]) {
        [self createOpinionFeedback];
    } else if ([service isEqualToString:@"满意度评价"]) {
        [self satisfactionEvaluation];
    } else if ([service isEqualToString:@"上报反馈日志"]) {
        [self reportFeedbackLog];
    } else {
        [self showAlert:@"反馈模块" message:[NSString stringWithFormat:@"%@\n\n待实现", service]];
    }
}

// ==================== 反馈模块实现 ====================

- (void)createFeedbackAction {
    // ========== 瑞雪 SDK 创建反馈 ==========
    NSDictionary *params = @{
        @"game_id": @(1001),              // 游戏 ID
        @"kind_id": @(1),                 // 反馈类型 ID
        @"kind_name": @"Bug 反馈",         // 反馈类型名称
        @"priority": @(1),                // 紧急程度：1 紧急 2 不紧急
        @"content": @"遇到了一个问题...",   // 反馈内容
        @"player_gameid": @"player_001"   // 玩家游戏 ID
    };
    
    [[RXSDK sharedSDK] createFeedbackWithParams:params
                                       complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                [self showAlert:@"创建反馈失败" message:[NSString stringWithFormat:@"错误码: %ld\n%@", (long)error.code, error.msg]];
                return;
            }
            NSInteger feedbackId = [response[@"data"][@"id"] integerValue];
            [self showAlert:@"创建反馈成功" message:[NSString stringWithFormat:@"反馈ID: %ld\n\n反馈已提交", (long)feedbackId]];
        });
    }];
}

- (void)getFeedbackList {
    // ========== 瑞雪 SDK 获取反馈列表 ==========
    int page = 1;    // 必填，页数
    int size = 10;   // 必填，每页个数
    int status = 0;  // 必填，状态（0=所有，1=未处理，2=已处理）
    
    [[RXSDK sharedSDK] getFeedbackListWithPage:page   // 页数
                                          size:size   // 每页个数
                                        status:status // 状态
                                      complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                [self showAlert:@"获取反馈列表失败" message:[NSString stringWithFormat:@"错误码: %ld\n%@", (long)error.code, error.msg]];
                return;
            }
            NSArray *list = response[@"data"][@"list"];
            if (list && list.count > 0) {
                NSMutableString *msg = [NSMutableString stringWithFormat:@"共 %lu 条反馈:\n\n", (unsigned long)list.count];
                for (NSInteger i = 0; i < MIN(list.count, 5); i++) {
                    NSDictionary *item = list[i];
                    NSString *content = item[@"content"] ?: @"";
                    NSString *shortContent = content.length > 20 ? [content substringToIndex:20] : content;
                    [msg appendFormat:@"• [%@] %@...\n", item[@"id"], shortContent];
                }
                [self showAlert:@"反馈列表" message:msg];
            } else {
                [self showAlert:@"反馈列表" message:@"暂无反馈记录"];
            }
        });
    }];
}

- (void)getFeedbackDetail {
    // ========== 瑞雪 SDK 获取反馈详情 ==========
    int feedbackID = 12345;  // 必填，反馈 ID
    
    [[RXSDK sharedSDK] getFeedbackDetailWithFeedbackID:feedbackID  // 反馈 ID
                                              complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                [self showAlert:@"获取反馈详情失败" message:[NSString stringWithFormat:@"错误码: %ld\n%@", (long)error.code, error.msg]];
                return;
            }
            NSDictionary *data = response[@"data"];
            if (data) {
                [self showAlert:@"反馈详情" message:[NSString stringWithFormat:@"ID: %@\n内容: %@\n状态: %@", 
                    data[@"id"], data[@"content"], data[@"status"]]];
            } else {
                [self showAlert:@"反馈详情" message:@"数据为空"];
            }
        });
    }];
}

- (void)getFeedbackProp {
    // ========== 瑞雪 SDK 领取反馈道具 ==========
    int feedbackID = 12345;  // 必填，反馈 ID
    
    [[RXSDK sharedSDK] feedbackGetpropWithFeedbackID:feedbackID  // 反馈 ID
                                            complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                [self showAlert:@"领取道具失败" message:[NSString stringWithFormat:@"错误码: %ld\n%@", (long)error.code, error.msg]];
                return;
            }
            [self showAlert:@"领取道具成功" message:[NSString stringWithFormat:@"反馈ID: %d\n\n道具已领取", feedbackID]];
        });
    }];
}

- (void)getFeedbackKindList {
    // ========== 瑞雪 SDK 获取反馈类型 ==========
    [[RXSDK sharedSDK] getFeedbackKindListWithComplete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                [self showAlert:@"获取反馈类型失败" message:[NSString stringWithFormat:@"错误码: %ld\n%@", (long)error.code, error.msg]];
                return;
            }
            NSArray *kindList = response[@"data"][@"list"];
            if (kindList && kindList.count > 0) {
                NSMutableString *msg = [NSMutableString stringWithFormat:@"共 %lu 种反馈类型:\n\n", (unsigned long)kindList.count];
                for (NSDictionary *kind in kindList) {
                    [msg appendFormat:@"• %@ - %@\n", kind[@"id"], kind[@"name"]];
                }
                [self showAlert:@"反馈类型" message:msg];
            } else {
                [self showAlert:@"反馈类型" message:@"暂无反馈类型"];
            }
        });
    }];
}

- (void)createOpinionFeedback {
    // ========== 瑞雪 SDK 创建意见反馈 ==========
    NSString *content = @"这是一条意见反馈";  // 必填，反馈内容
    NSString *phone = @"13800138000";          // 必填，手机号
    
    [[RXSDK sharedSDK] feedbackCreateWithContent:content     // 反馈内容
                                     attachments:nil         // 附件地址数组（可选）
                                           phone:phone       // 手机号
                                            tags:nil         // 游戏透传标识（可选）
                                        complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                [self showAlert:@"创建意见反馈失败" message:[NSString stringWithFormat:@"错误码: %ld\n%@", (long)error.code, error.msg]];
                return;
            }
            [self showAlert:@"创建意见反馈成功" message:[NSString stringWithFormat:@"反馈内容: %@\n联系方式: %@", content, phone]];
        });
    }];
}

- (void)satisfactionEvaluation {
    // ========== 瑞雪 SDK 满意度评价 ==========
    NSInteger feedbackId = 12345;   // 必填，反馈 ID
    BOOL pleased = YES;             // 必填，是否满意
    NSString *reason = @"服务很好"; // 可选，评价理由
    
    NSDictionary *params = @{
        @"key_number": @(feedbackId),          // 反馈 ID
        @"pleased_status": @(pleased ? 1 : 2), // 1 满意 2 不满意
        @"reason": reason ?: @""               // 理由
    };
    
    [[RXSDK sharedSDK] satisfactionEvaluationWithParams:params  // 评价参数
                                               complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                [self showAlert:@"满意度评价失败" message:[NSString stringWithFormat:@"错误码: %ld\n%@", (long)error.code, error.msg]];
                return;
            }
            [self showAlert:@"满意度评价成功" message:[NSString stringWithFormat:@"反馈ID: %ld\n评价: %@\n理由: %@", 
                (long)feedbackId, pleased ? @"满意" : @"不满意", reason]];
        });
    }];
}

- (void)reportFeedbackLog {
    // ========== 瑞雪 SDK 上报反馈日志 ==========
    // 注意：实际使用时需要传入真实的日志文件数据
    [self showAlert:@"上报反馈日志" message:@"请在实际项目中读取日志文件并调用:\n\n[[RXSDK sharedSDK] reportFeedbackLogWithData:logData complete:callback]"];
}

#pragma mark - 福利码模块

- (void)handleWelfareCodeModule:(NSString *)service {
    if ([service isEqualToString:@"请求福利码"]) {
        [self getPromoDisplayKey];
    } else if ([service isEqualToString:@"兑换福利码"]) {
        [self exchangePromoCode];
    } else {
        [self showAlert:@"福利码模块" message:[NSString stringWithFormat:@"%@\n\n待实现", service]];
    }
}

// ==================== 福利码模块实现 ====================

- (void)getPromoDisplayKey {
    // ========== 瑞雪 SDK 获取福利码展示 KEY ==========
    BOOL autoRefresh = YES;  // 必填，YES 自动刷新并返回福利码，NO 不自动刷新
    
    [[RXSDK sharedSDK] getPromoDisplayKeyWithAutoRefresh:autoRefresh  // 是否自动刷新
                                                complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                [self showAlert:@"获取福利码失败" message:[NSString stringWithFormat:@"错误码: %ld\n%@", (long)error.code, error.msg]];
                return;
            }
            NSDictionary *data = response[@"data"];
            if (data) {
                NSString *displayKey = data[@"display_key"] ?: @"";
                NSNumber *expireTime = data[@"expire_time"];
                BOOL isPromoUser = [data[@"is_promo_user"] boolValue];
                
                if (isPromoUser) {
                    [self showAlert:@"获取福利码成功" message:[NSString stringWithFormat:@"福利码: %@\n过期时间: %@", displayKey, expireTime]];
                } else {
                    [self showAlert:@"获取福利码" message:@"当前用户不是达人"];
                }
            } else {
                [self showAlert:@"获取福利码" message:@"数据为空"];
            }
        });
    }];
}

- (void)exchangePromoCode {
    // ========== 瑞雪 SDK 兑换福利码 ==========
    NSString *cdkey = @"PROMO123456";  // 必填，福利码
    
    [[RXSDK sharedSDK] exchangePromoCDKEY:cdkey  // 福利码
                                 complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                [self showAlert:@"兑换福利码失败" message:[NSString stringWithFormat:@"错误码: %ld\n%@\n\n常见原因:\n• 福利码无效\n• 已被使用\n• 已过期", (long)error.code, error.msg]];
                return;
            }
            NSDictionary *data = response[@"data"];
            [self showAlert:@"兑换福利码成功" message:[NSString stringWithFormat:@"福利码: %@\n\n奖励: %@", cdkey, data ?: @"无"]];
        });
    }];
}

#pragma mark - 埋点模块

- (void)handleTrackingModule:(NSString *)service {
    if ([service isEqualToString:@"用户行为统计"]) {
        [self trackUserAction];
    } else if ([service isEqualToString:@"终止行为统计"]) {
        [self stopTrackUserAction];
    } else {
        [self showAlert:@"埋点模块" message:[NSString stringWithFormat:@"%@\n\n待实现", service]];
    }
}

// ==================== 埋点模块实现 ====================

- (void)trackUserAction {
    // ========== 瑞雪 SDK 用户行为追踪 ==========
    NSString *distinctId = nil;  // 可选，用户唯一标识，传空默认为 openID
    
    NSDictionary *properties = @{
        @"action": @"button_click",          // 行为类型
        @"button_name": @"purchase",         // 按钮名称
        @"page": @"shop"                     // 页面名称
    };
    
    [[RXSDK sharedSDK] trackUserActionWithDistinctId:distinctId  // 用户 ID
                                          properties:properties]; // 属性
    
    [self showAlert:@"用户行为统计" message:@"行为已上报\n\n行为: button_click\n按钮: purchase\n页面: shop"];
}

- (void)stopTrackUserAction {
    // ========== 瑞雪 SDK 停止用户行为追踪 ==========
    [[RXSDK sharedSDK] stopTrackUserAction];
    
    [self showAlert:@"终止行为统计" message:@"用户行为上报已停止"];
}

#pragma mark - 支付(IAP)模块

- (void)handlePaymentModule:(NSString *)service {
    if ([service isEqualToString:@"支付"]) {
        [self doIAPPayment];
    } else if ([service isEqualToString:@"查询"]) {
        [self tradeQueryAction];
    } else {
        [self showAlert:@"支付(IAP)模块" message:[NSString stringWithFormat:@"%@\n\n待实现", service]];
    }
}

// ==================== 支付模块实现 ====================

- (void)doIAPPayment {
    // ========== 瑞雪 SDK IAP 内购支付 ==========
    NSString *tradeNo = [NSString stringWithFormat:@"order_%ld", (long)[[NSDate date] timeIntervalSince1970]];  // 必填，订单号
    NSString *productId = @"com.game.product001";  // 必填，商品 ID
    NSString *currency = @"CNY";                    // 币种

    NSDictionary *orderDict = @{
        @"trade_no": tradeNo,              // 必填，订单号
        @"currency": currency,             // 币种，默认 CNY
        @"goods_tag": productId,           // 商品标签
        @"env": @(0),                      // 0 正式 1 沙盒
        @"indulge_auth": @(0),             // 0 不验证防沉迷 1 验证
        @"is_debug": @(0),                 // 0 正式订单 1 测试订单
        @"ext": @{                         // 扩展字段
            @"custom_field": @"自定义值"
        },
        @"transmit_args": @"透传参数"       // 可选，透传参数
    };

    // 【可选】微信支付（需额外配置）
    // NSDictionary *wechatDict = @{
    //     @"hq_type": @"wechat",
    //     @"trade_no": tradeNo,
    //     @"goods_tag": productId
    // };

    [[RXSDK sharedSDK] iap:orderDict  // 订单参数
                  complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                [self showAlert:@"支付失败" message:[NSString stringWithFormat:@"错误码: %ld\n%@", (long)error.code, error.msg]];
                return;
            }
            NSInteger code = [response[@"code"] integerValue];
            if (code == 0) {
                [self showAlert:@"支付成功" message:[NSString stringWithFormat:@"订单号: %@\n\n注意: 实际发货以服务端回调为准", tradeNo]];
            } else {
                [self showAlert:@"支付业务失败" message:[NSString stringWithFormat:@"错误码: %ld\n%@", (long)code, response[@"msg"]]];
            }
        });
    }];
}

- (void)tradeQueryAction {
    // ========== 瑞雪 SDK 查询订单状态 ==========
    NSString *orderNo = @"order_12345";  // 必填，订单号

    [[RXSDK sharedSDK] tradeQueryWithOrderNo:orderNo  // 订单号
                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                [self showAlert:@"查询订单失败" message:[NSString stringWithFormat:@"错误码: %ld\n%@", (long)error.code, error.msg]];
                return;
            }
            NSDictionary *data = response[@"data"];
            NSInteger status = [data[@"status"] integerValue];
            [self showAlert:@"查询订单成功" message:[NSString stringWithFormat:@"订单号: %@\n状态: %ld", orderNo, (long)status]];
        });
    }];
}

#pragma mark - 分享模块

- (void)handleShareModule:(NSString *)service {
    if ([service isEqualToString:@"一键分享"]) {
        [self doShare];
    } else if ([service isEqualToString:@"自定义分享"]) {
        [self doShareCustom];
    } else {
        [self showAlert:@"分享模块" message:[NSString stringWithFormat:@"%@\n\n待实现", service]];
    }
}

// ==================== 分享模块实现 ====================

- (void)doShare {
    // ========== 瑞雪 SDK 一键分享 ==========
    // 注意：需要配置对应分享平台的 SDK
    
    RXShareConfig *config = [[RXShareConfig alloc] init];
    config.func = @"share_func_id";           // 必填，埋点标识
    config.platform = @"wechat";              // 必填，分享平台：wechat/system/facebook/messenger/line/tiktok/zalo
    config.region = @"CN";                    // 可选，地区码
    config.transmits = @"custom_data";        // 可选，透传参数
    config.shareScene = 0;                    // 可选，0 好友，1 朋友圈
    config.useShortUrl = YES;                 // 可选，是否使用短链接
    config.autoReport = YES;                  // 可选，是否自动上报，默认 YES
    
    [[RXSDK sharedSDK] share:config  // 分享配置
                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                [self showAlert:@"分享失败" message:[NSString stringWithFormat:@"错误码: %ld\n%@", (long)error.code, error.msg]];
                return;
            }
            [self showAlert:@"分享成功" message:@"分享到微信成功"];
        });
    }];
}

- (void)doShareCustom {
    // ========== 瑞雪 SDK 自定义分享 ==========
    // 注意：需要配置对应分享平台的 SDK
    
    RXCustomShareConfig *config = [[RXCustomShareConfig alloc] init];
    config.platform = @"wechat";                      // 必填，分享平台
    config.materialType = @"link";                    // 必填，分享类型：text/image/landing/link/video
    config.title = @"分享标题";                        // 可选，分享标题
    config.content = @"分享描述";                      // 可选，分享描述
    config.url = @"https://example.com/share";        // 可选，分享链接
    config.image = @"https://example.com/image.png";  // 可选，图片 url 或本地路径
    config.shareScene = 0;                            // 可选，0 好友，1 朋友圈
    
    [[RXSDK sharedSDK] shareCustom:config  // 自定义分享配置
                          complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                [self showAlert:@"自定义分享失败" message:[NSString stringWithFormat:@"错误码: %ld\n%@", (long)error.code, error.msg]];
                return;
            }
            [self showAlert:@"自定义分享成功" message:@"分享成功"];
        });
    }];
}

#pragma mark - 登录 UI 模块

- (void)handleLoginUIModule:(NSString *)service {
    if ([service isEqualToString:@"登录弹窗"]) {
        [self showLoginUI];
    } else {
        [self showAlert:@"登录UI模块" message:[NSString stringWithFormat:@"%@\n\n待实现", service]];
    }
}

// ==================== 登录 UI 模块实现 ====================

/**
 * 显示登录弹窗 UI
 * 注意：需要添加 pod 依赖 pod 'RXUIKit'
 */
- (void)showLoginUI {
    // ========== 瑞雪 SDK 登录弹窗 UI ==========
    // 注意：需要在 Podfile 中添加 pod 'RXUIKit'
    
    // 构造登录 UI 配置
    RXLoginUIModel *config = [[RXLoginUIModel alloc] init];
    // config.loginTypes = @[@"phone", @"wechat"];  // 可选，登录方式列表
    // config.logoImage = [UIImage imageNamed:@"logo"];  // 可选，自定义 Logo
    
    // 显示登录弹窗
    [[RXUIKitService sharedSDK] showLoginViewWithConfig:config complete:^(NSDictionary *response, RX_CommonRequestError *error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                [self showAlert:@"登录失败" message:[NSString stringWithFormat:@"错误: %@", error.responesObject[@"msg"]]];
            } else {
                NSString *openid = response[@"data"][@"openid"] ?: @"";
                [self showAlert:@"登录成功" message:[NSString stringWithFormat:@"openid: %@", openid]];
            }
        });
    }];
}

#pragma mark - 协议/法务 UI 模块

- (void)handleLegalUIModule:(NSString *)service {
    if ([service isEqualToString:@"协议声明"]) {
        [self showProtocolView];
    } else if ([service isEqualToString:@"隐私政策弹框"]) {
        [self showPrivacyPolicyDialog];
    } else {
        [self showAlert:@"协议/法务模块" message:[NSString stringWithFormat:@"%@\n\n待实现", service]];
    }
}

// ==================== 协议/法务 UI 模块实现 ====================

/**
 * 显示协议声明（全屏 H5 样式）
 */
- (void)showProtocolView {
    // ========== 瑞雪 SDK 协议声明 ==========
    // 注意：需要在 Podfile 中添加 pod 'RXUIKit'
    
    // 要展示的协议 key 列表
    // 常用 key: @"00001" - 服务协议, @"00002" - 隐私政策
    NSArray *keyList = @[@"00001", @"00002"];
    NSString *defaultKey = @"00001";  // 默认展示服务协议
    
    [[RXUIKitService sharedSDK] setProtocolViewWithKey:defaultKey keyList:keyList];
}

/**
 * 显示隐私政策弹窗
 */
- (void)showPrivacyPolicyDialog {
    // ========== 瑞雪 SDK 隐私政策弹窗 ==========
    // 注意：需要在 Podfile 中添加 pod 'RXUIKit'
    
    [[RXUIKitService sharedSDK] userPrivacyPolicyWithComplete:^(BOOL agree) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (agree) {
                [self showAlert:@"隐私政策" message:@"用户同意协议"];
            } else {
                [self showAlert:@"隐私政策" message:@"用户拒绝协议"];
            }
        });
    }];
}

#pragma mark - 实名/防沉迷 UI 模块

- (void)handleRealAuthUIModule:(NSString *)service {
    if ([service isEqualToString:@"实名认证弹窗"]) {
        [self showRealAuthUI];
    } else if ([service isEqualToString:@"防沉迷弹窗"]) {
        [self showAntiAddictionUI];
    } else {
        [self showAlert:@"实名/防沉迷模块" message:[NSString stringWithFormat:@"%@\n\n待实现", service]];
    }
}

// ==================== 实名/防沉迷 UI 模块实现 ====================

/**
 * 显示实名认证弹窗
 */
- (void)showRealAuthUI {
    // ========== 瑞雪 SDK 实名认证弹窗 ==========
    // 注意：需要在 Podfile 中添加 pod 'RXUIKit'

    BOOL canClose = YES;  // 是否可关闭，NO 表示强制实名

    [[RXUIKitService sharedSDK] setRealauthViewWithCanClose:canClose complete:^(NSDictionary *response, RX_CommonRequestError *error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                [self showAlert:@"实名认证" message:[NSString stringWithFormat:@"实名认证失败: %@", error.responesObject[@"msg"]]];
            } else {
                [self showAlert:@"实名认证" message:@"实名认证成功"];
            }
        });
    }];
}

/**
 * 显示防沉迷弹窗
 */
- (void)showAntiAddictionUI {
    // ========== 瑞雪 SDK 防沉迷弹窗 ==========

    NSString *title = @"防沉迷提示";
    NSString *content = @"根据国家最新法规规定，未进行实名认证的用户不能体验任何游戏内容。当前账号游戏累计时间已超过限制，请合理安排游戏时间，做适当的身体活动。";
    NSString *buttonTitle = @"我知道了";

    [[RXUIKitService sharedSDK] setAntiAdditionViewWithTitle:title
                                                         des:content
                                                    btnTitle:buttonTitle
                                                    complete:^{
        dispatch_async(dispatch_get_main_queue(), ^{
            [self showAlert:@"防沉迷" message:@"用户点击确认"];
        });
    }];
}

#pragma mark - 密码 UI 模块

- (void)handlePasswordUIModule:(NSString *)service {
    if ([service isEqualToString:@"找回密码"]) {
        [self showForgotPasswordUI];
    } else if ([service isEqualToString:@"设置密码"]) {
        [self showSetPasswordUI];
    } else {
        [self showAlert:@"密码模块" message:[NSString stringWithFormat:@"%@\n\n待实现", service]];
    }
}

// ==================== 密码 UI 模块实现 ====================

/**
 * 显示找回密码弹窗
 */
- (void)showForgotPasswordUI {
    // ========== 瑞雪 SDK 找回密码弹窗 ==========
    // 注意：需要在 Podfile 中添加 pod 'RXUIKit'

    [[RXUIKitService sharedSDK] getBackPasswordWithComplete:^(NSDictionary *response, RX_CommonRequestError *error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                [self showAlert:@"找回密码" message:[NSString stringWithFormat:@"操作失败: %@", error.responesObject[@"msg"]]];
            } else {
                [self showAlert:@"找回密码" message:@"密码重置成功"];
            }
        });
    }];
}

/**
 * 显示设置密码弹窗
 */
- (void)showSetPasswordUI {
    // ========== 瑞雪 SDK 设置密码弹窗 ==========

    [[RXUIKitService sharedSDK] setPasswordWithComplete:^(NSDictionary *response, RX_CommonRequestError *error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                [self showAlert:@"设置密码" message:[NSString stringWithFormat:@"操作失败: %@", error.responesObject[@"msg"]]];
            } else {
                [self showAlert:@"设置密码" message:@"密码设置成功"];
            }
        });
    }];
}

#pragma mark - 用户中心 UI 模块

- (void)handleUserCenterUIModule:(NSString *)service {
    if ([service isEqualToString:@"用户中心"]) {
        [self showUserCenterUI];
    } else if ([service isEqualToString:@"帮助中心"]) {
        [self showHelperCenterUI];
    } else {
        [self showAlert:@"用户中心模块" message:[NSString stringWithFormat:@"%@\n\n待实现", service]];
    }
}

// ==================== 用户中心 UI 模块实现 ====================

/**
 * 显示用户中心弹窗
 */
- (void)showUserCenterUI {
    // ========== 瑞雪 SDK 用户中心弹窗 ==========
    // 注意：需要在 Podfile 中添加 pod 'RXUIKit'

    RXUserCenterConfig *config = [[RXUserCenterConfig alloc] init];
    config.game_user_id = @"demo_user_001";    // 游戏用户 ID
    config.nickname = @"Demo用户";              // 用户昵称
    config.head_img_url = @"";                  // 用户头像 URL（可选）
    config.queue_name = @"default";             // 队列名称
    // config.setLightTheme = YES;              // 是否使用浅色主题

    [[RXUIKitService sharedSDK] userCenterWithConfig:config complete:^(NSDictionary *response, RX_CommonRequestError *error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                [self showAlert:@"用户中心" message:[NSString stringWithFormat:@"操作失败: %@", error.responesObject[@"msg"]]];
            } else {
                [self showAlert:@"用户中心" message:@"操作成功"];
            }
        });
    }];
}

/**
 * 显示帮助中心弹窗
 */
- (void)showHelperCenterUI {
    // ========== 瑞雪 SDK 帮助中心弹窗 ==========

    RXUserCenterConfig *config = [[RXUserCenterConfig alloc] init];
    config.game_user_id = @"demo_user_001";
    config.nickname = @"Demo用户";

    [[RXUIKitService sharedSDK] serviceCenterWithConfig:config complete:^(NSDictionary *response, RX_CommonRequestError *error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                [self showAlert:@"帮助中心" message:[NSString stringWithFormat:@"操作失败: %@", error.responesObject[@"msg"]]];
            } else {
                [self showAlert:@"帮助中心" message:@"操作成功"];
            }
        });
    }];
}

#pragma mark - 账号注销 UI 模块

- (void)handleDeregisterUIModule:(NSString *)service {
    if ([service isEqualToString:@"申请注销UI"]) {
        [self showApplyDeregisterUI];
    } else if ([service isEqualToString:@"撤销注销UI"]) {
        [self showDestroyAccountStatusUI];
    } else {
        [self showAlert:@"账号注销UI模块" message:[NSString stringWithFormat:@"%@\n\n待实现", service]];
    }
}

// ==================== 账号注销 UI 模块实现 ====================

/**
 * 显示申请注销 UI
 * 注意：iOS 申请注销使用 API 接口，展示弹窗提示
 */
- (void)showApplyDeregisterUI {
    // iOS 的申请注销是通过 API 接口实现的，这里展示一个提示
    UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"申请注销"
                                                                   message:@"确定要申请注销账号吗？\n\n注销有冷静期，期间可以撤销。"
                                                            preferredStyle:UIAlertControllerStyleAlert];
    
    [alert addAction:[UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleCancel handler:nil]];
    [alert addAction:[UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleDestructive handler:^(UIAlertAction * _Nonnull action) {
        // 调用 API 申请注销
        [self applyDeregister];
    }]];
    
    [self presentViewController:alert animated:YES completion:nil];
}

/**
 * 显示撤销注销弹窗
 */
- (void)showDestroyAccountStatusUI {
    // ========== 瑞雪 SDK 撤销注销弹窗 ==========
    // deregisterType: @"login" 继续登录，@"logout" 退出登录

    NSString *deregisterType = @"login";

    [[RXUIKitService sharedSDK] destroyAccountStatusViewWithDeregisterType:deregisterType complete:^(DestroyClickType clickType) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (clickType == DestroyClickType_login) {
                [self showAlert:@"撤销注销" message:@"撤销成功，继续登录"];
            } else if (clickType == DestroyClickType_logout) {
                [self showAlert:@"撤销注销" message:@"撤销成功，退出登录"];
            }
        });
    }];
}

#pragma mark - 其他 UI 模块

- (void)handleOtherUIModule:(NSString *)service {
    if ([service isEqualToString:@"展示邮件"]) {
        [self showMailCenterUI];
    } else if ([service isEqualToString:@"绑定手机UI"]) {
        [self showBindPhoneUI];
    } else if ([service isEqualToString:@"绑定邮箱UI"]) {
        [self showBindEmailUI];
    } else if ([service isEqualToString:@"展示公告"]) {
        [self showAnnounceUI];
    } else {
        [self showAlert:@"其他UI模块" message:[NSString stringWithFormat:@"%@\n\n待实现", service]];
    }
}

// ==================== 其他 UI 模块实现 ====================

/**
 * 展示邮件中心
 */
- (void)showMailCenterUI {
    // ========== 瑞雪 SDK 展示邮件中心 ==========
    NSString *cpUserId = @"demo_user_001";  // 游戏用户 ID

    [[RXUIKitService sharedSDK] showEmailViewWithCpUserId:cpUserId withComplete:^(NSDictionary *response, RX_CommonRequestError *error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                [self showAlert:@"邮件中心" message:[NSString stringWithFormat:@"操作失败: %@", error.msg]];
            } else {
                [self showAlert:@"邮件中心" message:@"操作完成"];
            }
        });
    }];
}

/**
 * 绑定手机 UI
 */
- (void)showBindPhoneUI {
    // ========== 瑞雪 SDK 绑定手机 UI ==========
    // 注意：如果已绑定手机会跳转到换绑页面

    [[RXUIKitService sharedSDK] bindPhoneWithComplete:^(NSDictionary *response, RX_CommonRequestError *error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                [self showAlert:@"绑定手机" message:[NSString stringWithFormat:@"操作失败: %@", error.msg]];
            } else {
                [self showAlert:@"绑定手机" message:@"绑定成功"];
            }
        });
    }];
}

/**
 * 绑定邮箱 UI
 */
- (void)showBindEmailUI {
    // ========== 瑞雪 SDK 绑定邮箱 UI ==========
    // 注意：如果已绑定邮箱会跳转到换绑页面

    [[RXUIKitService sharedSDK] bindEmailWithComplete:^(NSDictionary *response, RX_CommonRequestError *error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                [self showAlert:@"绑定邮箱" message:[NSString stringWithFormat:@"操作失败: %@", error.msg]];
            } else {
                [self showAlert:@"绑定邮箱" message:@"绑定成功"];
            }
        });
    }];
}

/**
 * 展示公告 UI
 */
- (void)showAnnounceUI {
    // ========== 瑞雪 SDK 展示公告 UI ==========

    int limit = 10;  // 展示公告条数

    [[RXUIKitService sharedSDK] showAnnounceViewWithLimit:limit linkCallBack:^(NSString *link) {
        dispatch_async(dispatch_get_main_queue(), ^{
            [self showAlert:@"公告链接" message:[NSString stringWithFormat:@"用户点击: %@", link]];
        });
    } isHasCallBack:^(BOOL isHas) {
        if (!isHas) {
            dispatch_async(dispatch_get_main_queue(), ^{
                [self showAlert:@"公告" message:@"暂无公告"];
            });
        }
    }];
}

#pragma mark - 注销账号模块

- (void)handleDeregisterModule:(NSString *)service {
    if ([service isEqualToString:@"申请注销"]) {
        [self applyDeregister];
    } else if ([service isEqualToString:@"撤销注销"]) {
        [self cancelDeregister];
    } else {
        [self showAlert:@"注销账号模块" message:[NSString stringWithFormat:@"%@\n\n待实现", service]];
    }
}

// ==================== 注销账号模块实现 ====================

- (void)applyDeregister {
    // ========== 瑞雪 SDK 申请注销账号 ==========
    // 注意：注销有冷静期，期间可以撤销
    
    RXDeregisterConfig *config = [[RXDeregisterConfig alloc] init];
    config.idCard = @"xxxxxx";     // 必填，身份证号码
    config.realname = @"测试用户";  // 必填，真实姓名
    // config.cpdata = @"custom_data";  // 可选，CP 自定义数据
    
    [[RXSDK sharedSDK] deregisterWithConfig:config  // 注销配置
                                   complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                [self showAlert:@"申请注销失败" message:[NSString stringWithFormat:@"错误码: %ld\n%@", (long)error.code, error.msg]];
                return;
            }
            NSDictionary *data = response[@"data"];
            NSString *cancelDeadline = data[@"cancel_deadline"] ?: @"";
            [self showAlert:@"申请注销成功" message:[NSString stringWithFormat:@"注销申请已提交\n\n冷静期截止: %@\n\n冷静期内可撤销注销", cancelDeadline]];
        });
    }];
}

- (void)cancelDeregister {
    // ========== 瑞雪 SDK 撤销注销申请 ==========
    // 在冷静期内可以撤销注销申请
    
    [[RXSDK sharedSDK] deregisterCancelWithComplete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                [self showAlert:@"撤销注销失败" message:[NSString stringWithFormat:@"错误码: %ld\n%@\n\n可能已超过冷静期", (long)error.code, error.msg]];
                return;
            }
            [self showAlert:@"撤销注销成功" message:@"账号已恢复正常"];
        });
    }];
}

#pragma mark - 评分模块

- (void)handleRatingModule:(NSString *)service {
    if ([service isEqualToString:@"应用内评分"]) {
        [self inAppStoreReview];
    } else if ([service isEqualToString:@"跳转商店评分"]) {
        [self toAppStoreReview];
    } else if ([service isEqualToString:@"评分弹框"]) {
        [self alertAppReview];
    } else {
        [self showAlert:@"评分模块" message:[NSString stringWithFormat:@"%@\n\n待实现", service]];
    }
}

// ==================== 评分模块实现 ====================

- (void)inAppStoreReview {
    // ========== 瑞雪 SDK 应用内评分 ==========
    // 注意：此处点击完成并不代表用户已完成评分，仅监听 VC dismiss
    
    NSString *appid = @"xxxxxx";  // 必填，App Store 中的 App ID
    
    [[RXSDK sharedSDK] inAppStoreReview:appid  // App ID
                               complete:^{
        dispatch_async(dispatch_get_main_queue(), ^{
            [self showAlert:@"应用内评分" message:@"评分页面已关闭"];
        });
    }];
}

- (void)toAppStoreReview {
    // ========== 瑞雪 SDK 跳转 App Store 评分 ==========
    NSString *appid = @"xxxxxx";  // 必填，App Store 中的 App ID
    BOOL writeReview = YES;       // 必填，YES 直接拉起评论页，NO 显示 App 详情页
    
    [[RXSDK sharedSDK] toAppStoreReview:appid      // App ID
                            writeReview:writeReview]; // 是否直接拉起评论页
    
    [self showAlert:@"跳转商店评分" message:@"已跳转到 App Store"];
}

- (void)alertAppReview {
    // ========== 瑞雪 SDK 应用内评分弹框 ==========
    // 注意：使用 SKStoreReviewController 的系统评分弹框
    // 注意：每年每个 App 最多弹出 3 次
    
    [[RXSDK sharedSDK] alertAppReview];
    
    [self showAlert:@"评分弹框" message:@"已调用系统评分弹框\n\n注意：每年每个 App 最多弹出 3 次"];
}

#pragma mark - 初始化模块

- (void)handleInitModule:(NSString *)service {
    if ([service isEqualToString:@"初始化SDK"]) {
        [self showInitDialog];
    } else {
        [self showAlert:@"初始化模块" message:[NSString stringWithFormat:@"%@\n\n待实现", service]];
    }
}

- (void)showInitDialog {
    RXSDKManager *manager = [RXSDKManager sharedManager];
    
    if (manager.isInitialized) {
        // 已初始化，显示当前参数
        NSString *message = [NSString stringWithFormat:@"SDK 已经初始化成功\n\n当前参数：\n• CPID: %@\n• Product ID: %@\n• Channel ID: %@\n• Base URL: %@",
                             manager.currentCpid, manager.currentProductId, manager.currentChannelId, manager.currentBaseUrl];
        
        UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"SDK 已初始化"
                                                                       message:message
                                                                preferredStyle:UIAlertControllerStyleAlert];
        [alert addAction:[UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleDefault handler:nil]];
        [alert addAction:[UIAlertAction actionWithTitle:@"重置 SDK" style:UIAlertActionStyleDestructive handler:^(UIAlertAction *action) {
            [manager reset];
            [self showAlert:@"SDK 已重置" message:@"现在可以重新初始化"];
        }]];
        [self presentViewController:alert animated:YES completion:nil];
        return;
    }
    
    // 选择初始化方式
    UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"初始化 SDK"
                                                                   message:@"请选择初始化方式"
                                                            preferredStyle:UIAlertControllerStyleAlert];
    [alert addAction:[UIAlertAction actionWithTitle:@"默认参数" style:UIAlertActionStyleDefault handler:^(UIAlertAction *action) {
        [self showDefaultInitConfirm];
    }]];
    [alert addAction:[UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleCancel handler:nil]];
    [self presentViewController:alert animated:YES completion:nil];
}

- (void)showDefaultInitConfirm {
    RXSDKManager *manager = [RXSDKManager sharedManager];
    NSString *envName = [manager isDomestic] ? @"国内" : @"海外";
    NSString *message = [NSString stringWithFormat:@"即将使用%@环境默认参数初始化 SDK：\n\n• CPID: %@\n• Product ID: %@\n• Channel ID: %@\n• Base URL: %@",
                         envName, [manager envDefaultCpid], [manager envDefaultProductId], [manager envDefaultChannelId], [manager envDefaultBaseUrl]];
    
    UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"默认初始化参数"
                                                                   message:message
                                                            preferredStyle:UIAlertControllerStyleAlert];
    [alert addAction:[UIAlertAction actionWithTitle:@"确认初始化" style:UIAlertActionStyleDefault handler:^(UIAlertAction *action) {
        [self startDefaultInit];
    }]];
    [alert addAction:[UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleCancel handler:nil]];
    [self presentViewController:alert animated:YES completion:nil];
}

- (void)startDefaultInit {
    RXSDKManager *manager = [RXSDKManager sharedManager];
    
    [manager initWithDefaultParamsWithCallback:^(BOOL success, NSDictionary *response, NSError *error) {
        if (success) {
            NSString *message = [NSString stringWithFormat:@"SDK 初始化成功！\n\n使用参数：\n• CPID: %@\n• Product ID: %@\n• Channel ID: %@\n• Base URL: %@",
                                 manager.currentCpid, manager.currentProductId, manager.currentChannelId, manager.currentBaseUrl];
            [self showAlert:@"初始化成功" message:message];
        } else {
            NSString *errorMsg = error.localizedDescription ?: @"未知错误";
            [self showAlert:@"初始化失败" message:errorMsg];
        }
    }];
}

#pragma mark - 登录模块

- (void)handleLoginModule:(NSString *)service {
    if ([service isEqualToString:@"登录Api"]) {
        [self showLoginApiDialog];
    } else if ([service isEqualToString:@"获取法务配置"]) {
        [self getLegalConfig];
    } else if ([service isEqualToString:@"自定义请求"]) {
        [self showCustomRequestDemo];
    } else {
        [self showAlert:@"登录模块" message:[NSString stringWithFormat:@"%@\n\n待实现", service]];
    }
}

- (void)showLoginApiDialog {
    UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"选择登录方式"
                                                                   message:nil
                                                            preferredStyle:UIAlertControllerStyleActionSheet];
    [alert addAction:[UIAlertAction actionWithTitle:@"游客登录" style:UIAlertActionStyleDefault handler:^(UIAlertAction *action) {
        [self loginAsGuest];
    }]];
    [alert addAction:[UIAlertAction actionWithTitle:@"账号密码登录" style:UIAlertActionStyleDefault handler:^(UIAlertAction *action) {
        [self loginWithUsername];
    }]];
    [alert addAction:[UIAlertAction actionWithTitle:@"验证码登录" style:UIAlertActionStyleDefault handler:^(UIAlertAction *action) {
        [self loginWithCaptcha];
    }]];
    [alert addAction:[UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleCancel handler:nil]];
    [self presentViewController:alert animated:YES completion:nil];
}

- (void)loginAsGuest {
    RXSDKManager *manager = [RXSDKManager sharedManager];
    [manager loginAsGuestWithCallback:^(NSDictionary *response, NSError *error) {
        [self handleLoginResponse:response error:error loginType:@"游客"];
    }];
}

- (void)loginWithUsername {
    // 使用测试账号
    RXSDKManager *manager = [RXSDKManager sharedManager];
    [manager loginWithUsername:@"wltest001" password:@"123456" callback:^(NSDictionary *response, NSError *error) {
        [self handleLoginResponse:response error:error loginType:@"账号密码"];
    }];
}

- (void)loginWithCaptcha {
    // 先发送验证码，成功后再登录
    RXSDKManager *manager = [RXSDKManager sharedManager];
    NSString *phone = @"15043052309";
    NSString *captcha = @"1111";
    
    [manager sendCaptchaWithPhone:phone callback:^(NSDictionary *response, NSError *error) {
        if (error) {
            [self showAlert:@"验证码发送失败" message:error.localizedDescription];
            return;
        }
        // 验证码发送成功，执行登录
        [manager loginWithPhone:phone captcha:captcha callback:^(NSDictionary *loginResponse, NSError *loginError) {
            [self handleLoginResponse:loginResponse error:loginError loginType:@"验证码"];
        }];
    }];
}

- (void)handleLoginResponse:(NSDictionary *)response error:(NSError *)error loginType:(NSString *)loginType {
    if (error) {
        NSString *errorMsg = [NSString stringWithFormat:@"错误码: %ld\n错误信息: %@", (long)error.code, error.localizedDescription];
        [self showAlert:@"登录失败" message:errorMsg];
        return;
    }
    
    NSString *openid = response[@"data"][@"openid"] ?: @"";
    NSString *token = response[@"data"][@"token"] ?: @"";
    if (token.length > 20) {
        token = [NSString stringWithFormat:@"%@...", [token substringToIndex:20]];
    }
    
    NSString *successMsg = [NSString stringWithFormat:@"%@登录成功！\n\nOpenID: %@\nToken: %@", loginType, openid, token];
    [self showAlert:@"登录成功" message:successMsg];
}

- (void)getLegalConfig {
    RXSDKManager *manager = [RXSDKManager sharedManager];
    [manager getLegalInfoWithCallback:^(NSDictionary *response, NSError *error) {
        if (error) {
            [self showAlert:@"获取失败" message:error.localizedDescription];
            return;
        }
        NSString *dataStr = response[@"data"] ? [NSString stringWithFormat:@"%@", response[@"data"]] : @"无数据";
        [self showAlert:@"法务配置" message:[NSString stringWithFormat:@"获取成功\n\n%@", dataStr]];
    }];
}

- (void)showCustomRequestDemo {
    // ========== 瑞雪 SDK 自定义请求 ==========
    NSString *url = @"/api/custom/endpoint";  // 接口地址
    NSInteger method = 1;  // 1=POST 2=GET
    BOOL needLogin = YES;  // 是否需要登录态
    
    NSMutableDictionary *header = [NSMutableDictionary dictionary];
    header[@"Custom-Header"] = @"value";
    
    NSMutableDictionary *body = [NSMutableDictionary dictionary];
    body[@"param1"] = @"value1";
    body[@"param2"] = @"value2";
    
    [[RXSDK sharedSDK] createRequestWithUrl:url
                                     header:header
                                       body:body
                                     method:method
                                  needLogin:needLogin
                                   complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (error) {
            NSLog(@"[RXSDK] 自定义请求失败: code=%ld, msg=%@", (long)error.code, error.msg);
            [self showAlert:@"自定义请求失败" message:[NSString stringWithFormat:@"错误码: %ld\n错误信息: %@", (long)error.code, error.msg ?: @"未知错误"]];
            return;
        }
        NSLog(@"[RXSDK] 自定义请求成功: %@", response);
        NSString *dataStr = response[@"data"] ? [NSString stringWithFormat:@"%@", response[@"data"]] : @"无数据";
        [self showAlert:@"自定义请求成功" message:[NSString stringWithFormat:@"返回数据:\n%@", dataStr]];
    }];
}

- (void)showAlert:(NSString *)title message:(NSString *)message {
    UIAlertController *alert = [UIAlertController alertControllerWithTitle:title
                                                                   message:message
                                                            preferredStyle:UIAlertControllerStyleAlert];
    
    UIAlertAction *okAction = [UIAlertAction actionWithTitle:@"确定"
                                                       style:UIAlertActionStyleDefault
                                                     handler:nil];
    [alert addAction:okAction];
    
    [self presentViewController:alert animated:YES completion:nil];
}

@end
