/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 
 http://www.cocos2d-x.org
 ****************************************************************************/

#include "HelloWorldScene.h"
#include "RuixueSDK/RuixueBridge.h"
#include "ui/CocosGUI.h"
#include <ctime>

USING_NS_CC;

// 全局指针用于在回调中访问
static HelloWorld* g_helloWorld = nullptr;

// 分组名称
static const std::vector<std::string> TAB_NAMES = {
    "初始化", "UI", "账号", "支付", "分享", "游戏", "数据", "运营"
};

// 颜色定义
static const Color4B COLOR_TAB_NORMAL = Color4B(200, 200, 200, 255);
static const Color4B COLOR_TAB_SELECTED = Color4B(46, 204, 113, 255);
static const Color4B COLOR_BUTTON_NORMAL = Color4B(46, 204, 113, 255);
static const Color4B COLOR_BUTTON_PRESSED = Color4B(39, 174, 96, 255);

Scene* HelloWorld::createScene()
{
    return HelloWorld::create();
}

// 获取当前时间字符串
static std::string getCurrentTimeStr()
{
    time_t now = time(nullptr);
    struct tm* t = localtime(&now);
    char buf[32];
    snprintf(buf, sizeof(buf), "%02d:%02d:%02d", t->tm_hour, t->tm_min, t->tm_sec);
    return std::string(buf);
}

bool HelloWorld::init()
{
    if (!Scene::init())
    {
        return false;
    }
    
    g_helloWorld = this;
    _currentTab = TabType::INIT;
    
    // 初始化 SDK 配置参数
    _cpid = "114";
    _productId = "1002";
#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
    _channelId = "iOS";
#else
    _channelId = "100";
#endif
    _baseUrls = "https://cn-api-test.ruixueyun.com/";

    _visibleSize = Director::getInstance()->getVisibleSize();
    _origin = Director::getInstance()->getVisibleOrigin();
    
    // 获取安全区域 (处理 iPhone 刘海屏 / Android 打孔屏)
    auto glView = Director::getInstance()->getOpenGLView();
    auto safeAreaRect = glView->getSafeAreaRect();
    float topSafeArea = _origin.y + _visibleSize.height - (safeAreaRect.origin.y + safeAreaRect.size.height);
    float bottomSafeArea = safeAreaRect.origin.y - _origin.y;
    
#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
    // Android 平台使用原生方法获取安全区域
    float androidTopSafeArea = ruixue::RuixueBridge::getInstance()->getTopSafeArea();
    if (androidTopSafeArea > topSafeArea) {
        topSafeArea = androidTopSafeArea;
    }
    // Android 额外增加一些安全边距
    topSafeArea += 60;
#endif
    
    // 布局参数
    _titleHeight = 80;
    _tabBarHeight = _visibleSize.height * 0.07f;  // 分组标签栏高度
    _logAreaHeight = _visibleSize.height / 3;
    _bottomOffset = _origin.y + bottomSafeArea;
    
    float safeHeight = _visibleSize.height - topSafeArea - bottomSafeArea;
    _buttonAreaHeight = safeHeight - _titleHeight - _tabBarHeight - _logAreaHeight;

    // 白色背景
    auto background = LayerColor::create(Color4B::WHITE);
    this->addChild(background, -1);

    // ==================== 标题 ====================
    float titleY = _bottomOffset + _logAreaHeight + _buttonAreaHeight + _tabBarHeight + _titleHeight / 2;
    auto titleLabel = Label::createWithSystemFont("RuixueSDK Demo", "sans-serif", 50);
    titleLabel->setTextColor(Color4B::BLACK);
    titleLabel->setPosition(Vec2(_origin.x + _visibleSize.width / 2, titleY));
    this->addChild(titleLabel, 1);

    // ==================== 分组标签栏 ====================
    createTabBar();

    // ==================== 按钮区域 ====================
    float buttonAreaY = _bottomOffset + _logAreaHeight;
    _buttonScrollView = ui::ScrollView::create();
    _buttonScrollView->setDirection(ui::ScrollView::Direction::VERTICAL);
    _buttonScrollView->setContentSize(Size(_visibleSize.width, _buttonAreaHeight));
    _buttonScrollView->setPosition(Vec2(_origin.x, buttonAreaY));
    _buttonScrollView->setBounceEnabled(true);
    _buttonScrollView->setScrollBarEnabled(true);
    this->addChild(_buttonScrollView, 1);
    
    // 按钮容器
    _buttonContainer = Node::create();
    _buttonScrollView->addChild(_buttonContainer);
    
    // 初始化按钮区域
    updateButtonArea();

    // ==================== 日志区域 ====================
    // 日志区域背景
    auto logBg = DrawNode::create();
    logBg->drawSolidRect(Vec2(_origin.x, _bottomOffset), 
                          Vec2(_origin.x + _visibleSize.width, _bottomOffset + _logAreaHeight),
                          Color4F(0.95f, 0.95f, 0.95f, 1.0f));
    this->addChild(logBg, 0);
    
    // 分隔线
    auto separator = DrawNode::create();
    separator->drawLine(Vec2(_origin.x, _bottomOffset + _logAreaHeight),
                        Vec2(_origin.x + _visibleSize.width, _bottomOffset + _logAreaHeight),
                        Color4F(0.8f, 0.8f, 0.8f, 1.0f));
    this->addChild(separator, 1);
    
    // 日志标题
    float logTitleHeight = 50;
    auto logTitleLabel = Label::createWithSystemFont("Log Output", "sans-serif", 28);
    logTitleLabel->setTextColor(Color4B(100, 100, 100, 255));
    logTitleLabel->setAnchorPoint(Vec2(0, 0.5));
    logTitleLabel->setPosition(Vec2(_origin.x + 20, _bottomOffset + _logAreaHeight - logTitleHeight / 2));
    this->addChild(logTitleLabel, 2);
    
    // 日志滚动区域
    float logContentHeight = _logAreaHeight - logTitleHeight - 20;
    _logScrollView = ui::ScrollView::create();
    _logScrollView->setDirection(ui::ScrollView::Direction::VERTICAL);
    _logScrollView->setContentSize(Size(_visibleSize.width - 20, logContentHeight));
    _logScrollView->setInnerContainerSize(Size(_visibleSize.width - 20, logContentHeight));
    _logScrollView->setPosition(Vec2(_origin.x + 10, _bottomOffset + 10));
    _logScrollView->setBounceEnabled(true);
    _logScrollView->setScrollBarEnabled(true);
    this->addChild(_logScrollView, 2);
    
    // 日志文本
    _logLabel = Label::createWithSystemFont("", "monospace", 22);
    _logLabel->setTextColor(Color4B(50, 50, 50, 255));
    _logLabel->setAnchorPoint(Vec2(0, 1));
    _logLabel->setWidth(_visibleSize.width - 40);
    _logScrollView->addChild(_logLabel);
    
    // 初始日志
    appendLog("RuixueSDK Demo 启动");
    
    // 3 秒后自动初始化 SDK
    this->scheduleOnce([this](float dt) {
        appendLog(">>> 自动初始化 SDK...");
        autoInitSDK();
    }, 3.0f, "auto_init_sdk");

    return true;
}

void HelloWorld::createTabBar()
{
    float tabBarY = _bottomOffset + _logAreaHeight + _buttonAreaHeight;
    
    // 分组标签滚动容器
    _tabScrollView = ui::ScrollView::create();
    _tabScrollView->setDirection(ui::ScrollView::Direction::HORIZONTAL);
    _tabScrollView->setContentSize(Size(_visibleSize.width, _tabBarHeight));
    _tabScrollView->setPosition(Vec2(_origin.x, tabBarY));
    _tabScrollView->setBounceEnabled(true);
    _tabScrollView->setScrollBarEnabled(false);
    this->addChild(_tabScrollView, 1);
    
    // 分组标签背景
    auto tabBg = DrawNode::create();
    tabBg->drawSolidRect(Vec2(0, 0), Vec2(_visibleSize.width * 2, _tabBarHeight),
                          Color4F(0.98f, 0.98f, 0.98f, 1.0f));
    _tabScrollView->addChild(tabBg, -1);
    
    // 创建分组标签按钮 - 根据屏幕宽度动态计算
    float tabWidth = _visibleSize.width / 5.5f;  // 大约能显示5个半标签
    float tabHeight = _visibleSize.height * 0.048f;  // 和功能按钮高度一致
    float tabSpacing = 15;
    float startX = 20;
    float totalWidth = startX;
    
    for (size_t i = 0; i < TAB_NAMES.size(); i++) {
        // 使用 ui::Layout 作为标签容器，确保触摸事件在滚动后仍能正确响应
        auto tabLayout = ui::Layout::create();
        tabLayout->setContentSize(Size(tabWidth, tabHeight));
        tabLayout->setTouchEnabled(true);
        tabLayout->setSwallowTouches(false);  // 不吞掉触摸，允许滚动
        tabLayout->setAnchorPoint(Vec2(0.5f, 0.5f));
        
        float posX = startX + tabWidth / 2 + i * (tabWidth + tabSpacing);
        tabLayout->setPosition(Vec2(posX, _tabBarHeight / 2));
        
        // 绘制背景
        auto bgNode = DrawNode::create();
        if (i == 0) {
            bgNode->drawSolidRect(Vec2(0, 0), Vec2(tabWidth, tabHeight),
                                   Color4F(0.18f, 0.80f, 0.44f, 1.0f));
        } else {
            bgNode->drawSolidRect(Vec2(0, 0), Vec2(tabWidth, tabHeight),
                                   Color4F(0.9f, 0.9f, 0.9f, 1.0f));
        }
        bgNode->setPosition(Vec2(0, 0));
        tabLayout->addChild(bgNode, 0);
        
        // 创建文字标签
        float fontSize = tabHeight * 0.32f;  // 和功能按钮字体大小一致
        auto label = Label::createWithSystemFont(TAB_NAMES[i], "sans-serif", fontSize);
        if (i == 0) {
            label->setTextColor(Color4B::WHITE);
        } else {
            label->setTextColor(Color4B(100, 100, 100, 255));
        }
        label->setPosition(Vec2(tabWidth / 2, tabHeight / 2));
        tabLayout->addChild(label, 1);
        
        // 添加点击事件
        int tabIndex = static_cast<int>(i);
        tabLayout->addClickEventListener([this, tabIndex](Ref* sender) {
            switchToTab(static_cast<TabType>(tabIndex));
        });
        
        _tabScrollView->addChild(tabLayout);
        
        totalWidth = posX + tabWidth / 2 + tabSpacing;
    }
    
    // 设置内容宽度
    _tabScrollView->setInnerContainerSize(Size(totalWidth + 20, _tabBarHeight));
}

void HelloWorld::switchToTab(TabType tab)
{
    if (_currentTab == tab) return;
    
    int oldIndex = static_cast<int>(_currentTab);
    int newIndex = static_cast<int>(tab);
    
    // 计算标签尺寸
    float tabWidth = _visibleSize.width / 5.5f;
    float tabHeight = _visibleSize.height * 0.048f;  // 和功能按钮高度一致
    float fontSize = tabHeight * 0.32f;  // 和功能按钮字体大小一致
    
    // 获取所有标签节点
    auto& children = _tabScrollView->getChildren();
    
    // 更新旧标签样式 (跳过背景节点，索引+1)
    if (oldIndex + 1 < children.size()) {
        auto oldLayout = dynamic_cast<ui::Layout*>(children.at(oldIndex + 1));
        if (oldLayout) {
            oldLayout->removeAllChildren();
            
            auto bgNode = DrawNode::create();
            bgNode->drawSolidRect(Vec2(0, 0), Vec2(tabWidth, tabHeight),
                                   Color4F(0.9f, 0.9f, 0.9f, 1.0f));
            oldLayout->addChild(bgNode, 0);
            
            auto label = Label::createWithSystemFont(TAB_NAMES[oldIndex], "sans-serif", fontSize);
            label->setTextColor(Color4B(100, 100, 100, 255));
            label->setPosition(Vec2(tabWidth / 2, tabHeight / 2));
            oldLayout->addChild(label, 1);
        }
    }
    
    // 更新新标签样式
    if (newIndex + 1 < children.size()) {
        auto newLayout = dynamic_cast<ui::Layout*>(children.at(newIndex + 1));
        if (newLayout) {
            newLayout->removeAllChildren();
            
            auto bgNode = DrawNode::create();
            bgNode->drawSolidRect(Vec2(0, 0), Vec2(tabWidth, tabHeight),
                                   Color4F(0.18f, 0.80f, 0.44f, 1.0f));
            newLayout->addChild(bgNode, 0);
            
            auto label = Label::createWithSystemFont(TAB_NAMES[newIndex], "sans-serif", fontSize);
            label->setTextColor(Color4B::WHITE);
            label->setPosition(Vec2(tabWidth / 2, tabHeight / 2));
            newLayout->addChild(label, 1);
        }
    }
    
    _currentTab = tab;
    updateButtonArea();
    
    appendLog("切换到: " + TAB_NAMES[newIndex]);
}

void HelloWorld::updateButtonArea()
{
    // 清空按钮容器
    _buttonContainer->removeAllChildren();
    
    // 获取当前分组的按钮配置
    auto buttons = getButtonsForTab(_currentTab);
    
    if (buttons.empty()) {
        float fontSize = _visibleSize.width / 15.0f;
        auto emptyLabel = Label::createWithSystemFont("暂无功能", "sans-serif", fontSize);
        emptyLabel->setTextColor(Color4B(150, 150, 150, 255));
        emptyLabel->setPosition(Vec2(_visibleSize.width / 2, _buttonAreaHeight / 2));
        _buttonContainer->addChild(emptyLabel);
        _buttonScrollView->setInnerContainerSize(Size(_visibleSize.width, _buttonAreaHeight));
        return;
    }
    
    // 按钮参数 - 根据屏幕宽度动态计算，一行三个
    float padding = _visibleSize.width * 0.02f;
    float btnSpacingX = _visibleSize.width * 0.015f;
    float btnSpacingY = _visibleSize.height * 0.012f;
    int cols = 3;
    float btnW = (_visibleSize.width - padding * 2 - btnSpacingX * (cols - 1)) / cols;
    float btnH = _visibleSize.height * 0.048f;
    float paddingTop = _visibleSize.height * 0.012f;
    float fontSize = btnH * 0.32f;
    int rows = (buttons.size() + cols - 1) / cols;
    float contentHeight = paddingTop + rows * (btnH + btnSpacingY) + paddingTop;
    contentHeight = std::max(contentHeight, _buttonAreaHeight);
    
    _buttonScrollView->setInnerContainerSize(Size(_visibleSize.width, contentHeight));
    
    for (size_t i = 0; i < buttons.size(); i++) {
        auto& config = buttons[i];
        
        // 使用 ui::Layout 作为按钮容器
        auto btnLayout = ui::Layout::create();
        btnLayout->setContentSize(Size(btnW, btnH));
        btnLayout->setTouchEnabled(true);
        btnLayout->setSwallowTouches(false);  // 不吞掉触摸，允许滚动
        btnLayout->setAnchorPoint(Vec2(0.5f, 0.5f));
        
        // 绘制绿色背景
        auto bgNode = DrawNode::create();
        bgNode->drawSolidRect(Vec2(0, 0), Vec2(btnW, btnH),
                               Color4F(0.18f, 0.80f, 0.44f, 1.0f));
        btnLayout->addChild(bgNode, 0);
        
        // 创建白色文字
        auto label = Label::createWithSystemFont(config.title, "sans-serif", fontSize);
        label->setTextColor(Color4B::WHITE);
        label->setPosition(Vec2(btnW / 2, btnH / 2));
        btnLayout->addChild(label, 1);
        
        // 计算位置 - 支持任意列数
        int row = i / cols;
        int col = i % cols;
        float posX = padding + btnW / 2 + col * (btnW + btnSpacingX);
        float posY = contentHeight - paddingTop - btnH / 2 - row * (btnH + btnSpacingY);
        
        btnLayout->setPosition(Vec2(posX, posY));
        
        // 添加点击事件
        auto callback = config.callback;
        btnLayout->addClickEventListener([callback](Ref* sender) {
            if (callback) callback();
        });
        
        _buttonContainer->addChild(btnLayout);
    }
}

std::vector<ButtonConfig> HelloWorld::getButtonsForTab(TabType tab)
{
    std::vector<ButtonConfig> buttons;
    
    switch (tab) {
        case TabType::INIT:
            buttons.push_back({"显示环境", [this]() { onShowEnvClicked(); }});
            buttons.push_back({"切换环境", [this]() { onSwitchEnvClicked(); }});
            buttons.push_back({"初始化SDK", [this]() { onInitSDKClicked(); }});
#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
            buttons.push_back({"初始化虎牙渠道", [this]() { onHuyaInitClicked(); }});
#endif
            break;
            
        case TabType::UI:
            buttons.push_back({"显示登录UI", [this]() { onShowLoginUIClicked(); }});
            buttons.push_back({"用户中心", [this]() { onShowUserCenterClicked(); }});
            buttons.push_back({"找回密码", [this]() { onResetPasswordClicked(); }});
            buttons.push_back({"实名认证", [this]() { onRealNameAuthClicked(); }});
            buttons.push_back({"绑定手机", [this]() { onBindPhoneClicked(); }});
            buttons.push_back({"申请注销", [this]() { onDeleteAccountClicked(); }});
            buttons.push_back({"撤销注销", [this]() { onApplyDeleteClicked(); }});
            buttons.push_back({"协议页面", [this]() { onAgreementPageClicked(); }});
            buttons.push_back({"防沉迷提示", [this]() { onAntiAddictionClicked(); }});
            buttons.push_back({"邮件中心", [this]() { onMailCenterClicked(); }});
            buttons.push_back({"公告页面", [this]() { onAnnouncementClicked(); }});
            buttons.push_back({"版本更新", [this]() { onVersionUpdateClicked(); }});
            buttons.push_back({"版本检查V2", [this]() { onUpdateGameVersionClicked(); }});
            buttons.push_back({"帮助中心", [this]() { onHelpCenterClicked(); }});
            break;
            
        case TabType::ACCOUNT:
            buttons.push_back({"游客登录", [this]() { onGuestLoginClicked(); }});
            buttons.push_back({"账号密码登录", [this]() { onUsernameLoginClicked(); }});
            buttons.push_back({"验证码登录", [this]() { onCaptchaLoginClicked(); }});
            buttons.push_back({"注册", [this]() { onRegisterClicked(); }});
            buttons.push_back({"登出", [this]() { onLogoutClicked(); }});
            buttons.push_back({"获取用户信息", [this]() { onGetUserInfoClicked(); }});
            buttons.push_back({"获取指定用户信息", [this]() { onGetUserInfoByFieldClicked(); }});
            buttons.push_back({"发送验证码", [this]() { onSendCaptchaClicked(); }});
            buttons.push_back({"实名认证API", [this]() { onRealAuthAPIClicked(); }});
            buttons.push_back({"查询绑定账号", [this]() { onSearchBindingClicked(); }});
#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
            buttons.push_back({"虎牙登录", [this]() { onHuyaLoginClicked(); }});
#endif
            break;
            
        case TabType::PAY:
#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
            buttons.push_back({"苹果支付", [this]() { onPayClicked(); }});
#else
            buttons.push_back({"微信支付", [this]() { onPayClicked(); }});
            buttons.push_back({"星驿 App 支付", [this]() { onXingYiAppPayClicked(); }});
            buttons.push_back({"星驿 H5 支付", [this]() { onXingYiH5PayClicked(); }});
            buttons.push_back({"虎牙支付", [this]() { onHuyaPayClicked(); }});
#endif
            buttons.push_back({"查询订单", [this]() { onQueryOrderClicked(); }});
            break;
            
        case TabType::SHARE:
            buttons.push_back({"一键分享", [this]() { onShareClicked(); }});
            buttons.push_back({"自定义分享", [this]() { onShareCustomClicked(); }});
            break;
            
        case TabType::GAME:
            buttons.push_back({"创建区服", [this]() { onCreateGameAreaClicked(); }});
#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
            buttons.push_back({"虎牙角色上报", [this]() { onHuyaReportRoleClicked(); }});
#endif
            buttons.push_back({"查询区服列表", [this]() { onSearchGameAreaListClicked(); }});
            buttons.push_back({"查询区服详情", [this]() { onSearchGameAreaInfoClicked(); }});
            buttons.push_back({"创建角色", [this]() { onCreateGameCharacterClicked(); }});
            buttons.push_back({"查询角色列表", [this]() { onSearchCharacterListClicked(); }});
            buttons.push_back({"查询角色详情", [this]() { onSearchCharacterInfoClicked(); }});
            buttons.push_back({"更新角色", [this]() { onUpdateCharacterClicked(); }});
            buttons.push_back({"删除角色", [this]() { onDeleteCharacterClicked(); }});
            break;
            
        case TabType::DATA:
            buttons.push_back({"设备信息", [this]() { onGetDeviceInfoClicked(); }});
            buttons.push_back({"DistinctId", [this]() { onGetDistinctIdClicked(); }});
            buttons.push_back({"数据埋点", [this]() { onDataTrackClicked(); }});
            buttons.push_back({"行为上报", [this]() { onTrackUserActionClicked(); }});
            break;
            
        case TabType::OPERATION:
            buttons.push_back({"客服", [this]() { onOpenCustomerServiceClicked(); }});
            buttons.push_back({"提交反馈", [this]() { onCreateFeedbackClicked(); }});
            buttons.push_back({"未读消息", [this]() { onUnreadMsgCountClicked(); }});
            buttons.push_back({"达人福利", [this]() { onPromoDisplayKeyClicked(); }});
            buttons.push_back({"清空日志", [this]() { onClearLogClicked(); }});
            break;
    }
    
    return buttons;
}

// ==================== 初始化分组回调 ====================

void HelloWorld::onShowEnvClicked()
{
    appendLog(">>> 显示环境配置");
    appendLog("cpid: " + _cpid);
    appendLog("productId: " + _productId);
    appendLog("channelId: " + _channelId);
    appendLog("baseUrls: " + _baseUrls);
}

void HelloWorld::onSwitchEnvClicked()
{
    appendLog(">>> 切换环境");
    // TODO: 切换环境
    appendLog("<<< 环境切换功能待实现");
}

void HelloWorld::onInitSDKClicked()
{
    appendLog(">>> 初始化 SDK");
    autoInitSDK();
}

void HelloWorld::onHuyaInitClicked()
{
    appendLog(">>> 初始化虎牙渠道");
    ruixue::RuixueBridge::getInstance()->initThirdSdk(R"({
        "game_id": "YOUR_GAME_ID",
        "login_client_id": "YOUR_LOGIN_CLIENT_ID",
        "login_client_secret": "YOUR_LOGIN_CLIENT_SECRET",
        "pay_app_id": "YOUR_PAY_APP_ID",
        "huya_debug_mode": true,
        "landscape_mode": true,
        "show_switch_count_in_game_center": true
    })", [](const std::string& responseJson) {
        if (g_helloWorld) {
            g_helloWorld->appendLog("<<< Huya Init: " + responseJson);
        }
    });
}

void HelloWorld::autoInitSDK(bool isRetry)
{
    auto bridge = ruixue::RuixueBridge::getInstance();
    
    std::string paramsJson = R"({
        "cpid": ")" + _cpid + R"(",
        "productId": ")" + _productId + R"(",
        "channelId": ")" + _channelId + R"(",
        "baseUrls": [")" + _baseUrls + R"("]
    })";
    
    bridge->init(paramsJson, [isRetry](const std::string& responseJson) {
        if (!g_helloWorld) return;
        
        g_helloWorld->appendLog("<<< Init: " + responseJson);
        
#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
        // iOS: 如果初始化失败（code != 0）且不是重试，则 2 秒后重试一次
        if (!isRetry) {
            bool success = (responseJson.find("\"code\":0") != std::string::npos ||
                           responseJson.find("\"code\": 0") != std::string::npos);
            if (!success) {
                g_helloWorld->appendLog(">>> iOS 初始化失败，2秒后重试...");
                g_helloWorld->scheduleOnce([](float dt) {
                    if (g_helloWorld) {
                        g_helloWorld->autoInitSDK(true);
                    }
                }, 2.0f, "auto_init_retry");
            }
        }
#endif
    });
}

// ==================== UI 分组回调 ====================

void HelloWorld::onShowLoginUIClicked()
{
    appendLog(">>> 显示登录 UI");
    
    auto bridge = ruixue::RuixueBridge::getInstance();
    if (!bridge->isInitialized()) {
        appendLog("错误: 请先初始化 SDK");
        return;
    }
    
    bridge->showLoginUI("{}", [](const std::string& responseJson) {
        if (g_helloWorld) {
            g_helloWorld->appendLog("<<< Login: " + responseJson);
        }
    });
}

void HelloWorld::onShowUserCenterClicked()
{
    appendLog(">>> 显示用户中心");
    
    auto bridge = ruixue::RuixueBridge::getInstance();
    if (!bridge->isInitialized()) {
        appendLog("错误: 请先初始化 SDK");
        return;
    }
    
    // 构建用户中心配置 JSON
    std::string paramsJson = R"({
        "game_user_id": "1000",
        "nickname": "测试用户",
        "head_img_url": "",
        "queue_name": "default",
        "transmit_args": "透传参数",
        "btns": ["real_name", "privacy_policy", "acount_cancel", "phone_management", "change_pwd"]
    })";
    
    bridge->showUserCenter(paramsJson, [](const std::string& responseJson) {
        if (g_helloWorld) {
            g_helloWorld->appendLog("<<< UserCenter: " + responseJson);
        }
    });
}

void HelloWorld::onResetPasswordClicked()
{
    appendLog(">>> 找回密码");
    
    auto bridge = ruixue::RuixueBridge::getInstance();
    if (!bridge->isInitialized()) {
        appendLog("错误: 请先初始化 SDK");
        return;
    }
    
    // 构建找回密码配置 JSON
    std::string paramsJson = R"({
        "account_type": 2
    })";
    
    bridge->showResetPasswordUI(paramsJson, [](const std::string& responseJson) {
        if (g_helloWorld) {
            g_helloWorld->appendLog("<<< ResetPassword: " + responseJson);
        }
    });
}

void HelloWorld::onRealNameAuthClicked()
{
    appendLog(">>> 实名认证");
    
    auto bridge = ruixue::RuixueBridge::getInstance();
    if (!bridge->isInitialized()) {
        appendLog("错误: 请先初始化 SDK");
        return;
    }
    
    // 构建实名认证配置 JSON
    std::string paramsJson = R"({
        "cancelable": true
    })";
    
    bridge->showRealNameAuthUI(paramsJson, [](const std::string& responseJson) {
        if (g_helloWorld) {
            g_helloWorld->appendLog("<<< RealNameAuth: " + responseJson);
        }
    });
}

void HelloWorld::onBindPhoneClicked()
{
    appendLog(">>> 绑定手机");
    
    auto bridge = ruixue::RuixueBridge::getInstance();
    if (!bridge->isInitialized()) {
        appendLog("错误: 请先初始化 SDK");
        return;
    }
    
    bridge->showBindPhoneUI([](const std::string& responseJson) {
        if (g_helloWorld) {
            g_helloWorld->appendLog("<<< BindPhone: " + responseJson);
        }
    });
}

void HelloWorld::onDeleteAccountClicked()
{
    appendLog(">>> 申请注销");
    
    auto bridge = ruixue::RuixueBridge::getInstance();
    if (!bridge->isInitialized()) {
        appendLog("错误: 请先初始化 SDK");
        return;
    }
    
    // 构建注销配置 JSON
    std::string paramsJson = R"({
        "game_user_id": "1000",
        "nickname": "测试用户"
    })";
    
    bridge->showDeleteAccountUI(paramsJson, [](const std::string& responseJson) {
        if (g_helloWorld) {
            g_helloWorld->appendLog("<<< DeleteAccount: " + responseJson);
        }
    });
}

void HelloWorld::onApplyDeleteClicked()
{
    appendLog(">>> 撤销注销");
    
    auto bridge = ruixue::RuixueBridge::getInstance();
    if (!bridge->isInitialized()) {
        appendLog("错误: 请先初始化 SDK");
        return;
    }
    
    // 构建撤销注销配置 JSON
    std::string paramsJson = R"({
        "is_login_continue": true
    })";
    
    bridge->showCancelDeleteUI(paramsJson, [](const std::string& responseJson) {
        if (g_helloWorld) {
            g_helloWorld->appendLog("<<< CancelDelete: " + responseJson);
        }
    });
}

void HelloWorld::onAgreementPageClicked()
{
    appendLog(">>> 协议页面");
    
    auto bridge = ruixue::RuixueBridge::getInstance();
    if (!bridge->isInitialized()) {
        appendLog("错误: 请先初始化 SDK");
        return;
    }
    
    // 构建协议页面配置 JSON
    // key: 默认展示的协议（00001: 用户协议，00002: 隐私政策）
    // key_list: 要展示的协议列表
    std::string paramsJson = R"({
        "key": "00001",
        "key_list": ["00001", "00002"]
    })";
    
    bridge->showProtocolUI(paramsJson);
    appendLog("已打开协议页面");
}

void HelloWorld::onAntiAddictionClicked()
{
    appendLog(">>> 防沉迷提示");
    
    auto bridge = ruixue::RuixueBridge::getInstance();
    if (!bridge->isInitialized()) {
        appendLog("错误: 请先初始化 SDK");
        return;
    }
    
    // 构建防沉迷提示配置 JSON
    std::string paramsJson = R"({
        "title": "防沉迷提示",
        "content": "根据国家相关规定，您的游戏时间已到限制，请合理安排时间。",
        "btn_text": "知道了"
    })";
    
    bridge->showAntiAddictionUI(paramsJson, [](const std::string& responseJson) {
        if (g_helloWorld) {
            g_helloWorld->appendLog("<<< AntiAddiction: " + responseJson);
        }
    });
}

void HelloWorld::onMailCenterClicked()
{
    appendLog(">>> 邮件中心");
    
    auto bridge = ruixue::RuixueBridge::getInstance();
    if (!bridge->isInitialized()) {
        appendLog("错误: 请先初始化 SDK");
        return;
    }
    
    // 构建邮件中心配置 JSON
    // cp_user_id: CP 用户 ID（可选）
    std::string paramsJson = R"({
        "cp_user_id": "1000"
    })";
    
    bridge->showMailCenterUI(paramsJson, [](const std::string& responseJson) {
        if (g_helloWorld) {
            g_helloWorld->appendLog("<<< MailCenter: " + responseJson);
        }
    });
}

void HelloWorld::onAnnouncementClicked()
{
    appendLog(">>> 公告页面");
    
    auto bridge = ruixue::RuixueBridge::getInstance();
    if (!bridge->isInitialized()) {
        appendLog("错误: 请先初始化 SDK");
        return;
    }
    
    // 构建公告页面配置 JSON
    // limit: 展示公告条数
    std::string paramsJson = R"({
        "limit": 10
    })";
    
    bridge->showAnnouncementUI(paramsJson, [](const std::string& responseJson) {
        if (g_helloWorld) {
            g_helloWorld->appendLog("<<< Announcement: " + responseJson);
        }
    });
}

void HelloWorld::onVersionUpdateClicked()
{
    appendLog(">>> 版本更新");
    
    // 构建版本更新参数
    std::string paramsJson = "{";
    paramsJson += "\"version\":\"1.0.0\",";
    paramsJson += "\"region\":\"150000\",";
    paramsJson += "\"show_ui\":true";
    paramsJson += "}";
    
    ruixue::RuixueBridge::getInstance()->showVersionUpdateUI(paramsJson, [this](const std::string& responseJson) {
        appendLog("版本更新回调: " + responseJson);
    });
}

void HelloWorld::onUpdateGameVersionClicked()
{
    appendLog(">>> 游戏版本检查 V2");

    std::string paramsJson =
        "{\"modules\":["
        "{\"module_tag\":\"dsa\",\"category_tag\":\"dass\",\"clientversion\":0,\"checkversion\":0},"
        "{\"module_tag\":\"_nNNN\",\"category_tag\":\"default\",\"clientversion\":0,\"checkversion\":0}"
        "],"
        "\"type\":\"cocos2dx\"}";

    ruixue::RuixueBridge::getInstance()->updateGameVersion(paramsJson, [this](const std::string& responseJson) {
        appendLog("游戏版本检查 V2 回调: " + responseJson);
    });
}

void HelloWorld::onHelpCenterClicked()
{
    appendLog(">>> 帮助中心");
    
    // 构建帮助中心参数
    std::string paramsJson = "{";
    paramsJson += "\"game_user_id\":1000,";
    paramsJson += "\"nickname\":\"测试用户\",";
    paramsJson += "\"queue_name\":\"default\"";
    paramsJson += "}";
    
    ruixue::RuixueBridge::getInstance()->showHelpCenterUI(paramsJson, [this](const std::string& responseJson) {
        appendLog("帮助中心回调: " + responseJson);
    });
}

// ==================== 账号分组回调 ====================

void HelloWorld::onGuestLoginClicked()
{
    appendLog(">>> 游客登录");
    
    auto bridge = ruixue::RuixueBridge::getInstance();
    if (!bridge->isInitialized()) {
        appendLog("错误: 请先初始化 SDK");
        return;
    }
    
    bridge->login(R"({"loginType": "guest"})", [](const std::string& responseJson) {
        if (g_helloWorld) {
            g_helloWorld->appendLog("<<< Guest Login: " + responseJson);
        }
    });
}

void HelloWorld::onHuyaLoginClicked()
{
    appendLog(">>> 虎牙登录");
    ruixue::RuixueBridge::getInstance()->login(
        R"({"loginType":"huya"})", [](const std::string& responseJson) {
            if (g_helloWorld) {
                g_helloWorld->appendLog("<<< Huya Login: " + responseJson);
            }
        });
}

void HelloWorld::onLogoutClicked()
{
    appendLog(">>> 登出");
    
    auto bridge = ruixue::RuixueBridge::getInstance();
    bridge->logout([this](const std::string& responseJson) {
        appendLog("<<< 登出结果: " + responseJson);
    });
}

void HelloWorld::onGetUserInfoClicked()
{
    appendLog(">>> 获取用户信息");
    
    auto bridge = ruixue::RuixueBridge::getInstance();
    if (!bridge->isLoggedIn()) {
        appendLog("<<< 用户未登录");
        return;
    }
    
    bridge->getUserInfo([this](const std::string& responseJson) {
        appendLog("<<< 用户信息: " + responseJson);
    });
}

void HelloWorld::onGetUserInfoByFieldClicked()
{
    appendLog(">>> 获取指定用户信息");
    
    auto bridge = ruixue::RuixueBridge::getInstance();
    if (!bridge->isLoggedIn()) {
        appendLog("<<< 用户未登录");
        return;
    }
    
    bridge->getUserInfoByField(R"({"openid":"replace_with_openid"})", [this](const std::string& responseJson) {
        appendLog("<<< 指定用户信息: " + responseJson);
    });
}

void HelloWorld::onUsernameLoginClicked()
{
    appendLog(">>> 账号密码登录");
    auto bridge = ruixue::RuixueBridge::getInstance();
    bridge->login(R"({"loginType":"username","username":"test_user","password":"test123"})", [](const std::string& r) {
        if (g_helloWorld) g_helloWorld->appendLog("<<< Username Login: " + r);
    });
}

void HelloWorld::onCaptchaLoginClicked()
{
    appendLog(">>> 验证码登录");
    auto bridge = ruixue::RuixueBridge::getInstance();
    bridge->login(R"({"loginType":"phone","username":"13800138000","captchaCode":"123456"})", [](const std::string& r) {
        if (g_helloWorld) g_helloWorld->appendLog("<<< Captcha Login: " + r);
    });
}

void HelloWorld::onRegisterClicked()
{
    appendLog(">>> 注册");
    auto bridge = ruixue::RuixueBridge::getInstance();
    bridge->registerAccount(R"({"username":"13800138000","password":"test123","captchaCode":"123456"})", [](const std::string& r) {
        if (g_helloWorld) g_helloWorld->appendLog("<<< Register: " + r);
    });
}

void HelloWorld::onSendCaptchaClicked()
{
    appendLog(">>> 发送验证码");
    auto bridge = ruixue::RuixueBridge::getInstance();
    bridge->sendCaptcha(R"({"type":"phone","target":"13800138000","purpose":"login"})", [](const std::string& r) {
        if (g_helloWorld) g_helloWorld->appendLog("<<< SendCaptcha: " + r);
    });
}

void HelloWorld::onRealAuthAPIClicked()
{
    appendLog(">>> 实名认证 API");
    auto bridge = ruixue::RuixueBridge::getInstance();
    bridge->realAuth(R"({"realname":"张三","idcard":"110101199001011234"})", [](const std::string& r) {
        if (g_helloWorld) g_helloWorld->appendLog("<<< RealAuth: " + r);
    });
}

void HelloWorld::onSearchBindingClicked()
{
    appendLog(">>> 查询绑定账号");
    auto bridge = ruixue::RuixueBridge::getInstance();
    bridge->searchBindingAccounts([](const std::string& r) {
        if (g_helloWorld) g_helloWorld->appendLog("<<< BindingAccounts: " + r);
    });
}

// ==================== 支付分组回调 ====================

void HelloWorld::onPayClicked()
{
    auto bridge = ruixue::RuixueBridge::getInstance();
    
    // 统一支付参数（两端通用）
    // goodsTag: 瑞雪后台配置的计费点名称（必填）
    // tradeNo: CP 订单号（必填）
    // payType: 支付类型，Android 用（wechat / alipay），iOS 忽略此字段走 Apple IAP
    // gameCharacterId: 角色 ID（可选）
    // gameServerId: 区服 ID（可选）
#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
    appendLog(">>> 发起苹果支付 (IAP)");
    std::string paramsJson = R"({
        "goodsTag": "com.game.product001",
        "tradeNo": "test_order_001",
        "currency": "CNY",
        "gameCharacterId": "role_001",
        "gameServerId": "server_001"
    })";
#else
    appendLog(">>> 发起微信支付");
    std::string paramsJson = R"({
        "payType": "wechat",
        "goodsTag": "100钻石",
        "tradeNo": "test_order_001",
        "gameCharacterId": "role_001",
        "gameServerId": "server_001"
    })";
#endif
    
    bridge->pay(paramsJson, [](const std::string& responseJson) {
        if (g_helloWorld) {
            g_helloWorld->appendLog("<<< Pay: " + responseJson);
        }
    });
}

void HelloWorld::onXingYiAppPayClicked()
{
    appendLog(">>> 发起星驿 App 支付");
    std::string paramsJson = R"({
        "payType": "xy",
        "goodsTag": "replace_with_goods_tag",
        "tradeNo": "xingyi_app_order_001",
        "gameCharacterId": "role_001",
        "gameServerId": "server_001"
    })";
    ruixue::RuixueBridge::getInstance()->pay(paramsJson,
        [](const std::string& responseJson) {
            if (g_helloWorld) {
                g_helloWorld->appendLog("<<< XingYi App Pay: " + responseJson);
            }
        });
}

void HelloWorld::onXingYiH5PayClicked()
{
    appendLog(">>> 发起星驿 H5 支付");
    std::string paramsJson = R"({
        "payType": "xy",
        "goodsTag": "replace_with_goods_tag",
        "tradeNo": "xingyi_h5_order_001",
        "ext": {
            "is_h5": 1
        }
    })";
    ruixue::RuixueBridge::getInstance()->pay(paramsJson,
        [](const std::string& responseJson) {
            if (g_helloWorld) {
                g_helloWorld->appendLog("<<< XingYi H5 Pay: " + responseJson);
            }
        });
}

void HelloWorld::onHuyaPayClicked()
{
    appendLog(">>> 发起虎牙支付");
    ruixue::RuixueBridge::getInstance()->pay(R"({
        "payType": "huya",
        "goodsTag": "replace_with_goods_tag",
        "tradeNo": "replace_with_server_order",
        "gameCharacterId": "role_10001",
        "gameServerId": "server_1"
    })", [](const std::string& responseJson) {
        if (g_helloWorld) {
            g_helloWorld->appendLog("<<< Huya Pay: " + responseJson);
        }
    });
}

void HelloWorld::onQueryOrderClicked()
{
    appendLog(">>> 查询订单");
    // TODO: 查询订单
    appendLog("<<< 查询订单功能待实现");
}

// ==================== 分享分组回调 ====================

void HelloWorld::onShareClicked()
{
    appendLog(">>> 一键分享");
    
    auto bridge = ruixue::RuixueBridge::getInstance();
    
    // 一键分享参数
    // func: 埋点标识（必填，后台配置）
    // platform: 分享平台（必填）: wechat/system/facebook/messenger/line/tiktok/zalo
    // shareScene: 0 好友, 1 朋友圈（可选）
    std::string paramsJson = R"({
        "func": "share_invite",
        "platform": "wechat",
        "shareScene": 0,
        "useShortUrl": true,
        "autoReport": true
    })";
    
    bridge->share(paramsJson, [](const std::string& responseJson) {
        if (g_helloWorld) {
            g_helloWorld->appendLog("<<< Share: " + responseJson);
        }
    });
}

void HelloWorld::onShareCustomClicked()
{
    appendLog(">>> 自定义分享");
    
    auto bridge = ruixue::RuixueBridge::getInstance();
    
    // 自定义分享参数
    // platform: 分享平台（必填）: wechat/system/facebook 等
    // type: 分享类型（必填）: text/image/link/video
    // title/content/url/image: 分享内容（可选）
    // shareScene: 0 好友, 1 朋友圈（可选）
    std::string paramsJson = R"({
        "platform": "wechat",
        "type": "link",
        "title": "我在玩 RX Game!",
        "content": "快来一起玩吧!",
        "url": "https://example.com/share",
        "image": "https://example.com/share.png",
        "shareScene": 0
    })";
    
    bridge->shareCustom(paramsJson, [](const std::string& responseJson) {
        if (g_helloWorld) {
            g_helloWorld->appendLog("<<< ShareCustom: " + responseJson);
        }
    });
}

// ==================== 游戏分组回调 ====================

void HelloWorld::onCreateGameAreaClicked()
{
    appendLog(">>> 创建区服");
    auto bridge = ruixue::RuixueBridge::getInstance();
    bridge->createGameArea(R"({"areaId":"server_001","areaName":"风云一区","areaStatus":"new","areaType":"pve"})", [](const std::string& r) {
        if (g_helloWorld) g_helloWorld->appendLog("<<< CreateArea: " + r);
    });
}

void HelloWorld::onHuyaReportRoleClicked()
{
    appendLog(">>> 上报虎牙角色信息");
    ruixue::RuixueBridge::getInstance()->setGameInfo(R"({
        "type": 2,
        "roleId": "role_10001",
        "roleName": "角色名",
        "serverId": "server_1",
        "serverName": "一区",
        "gameRoleLevel": "12",
        "attach": "{\"career\":\"战士\",\"chapter\":\"第一章\",\"realm_id\":\"1\",\"realm_name\":\"人界\",\"sdk_channel_id\":\"huya\"}"
    })", [](const std::string& responseJson) {
        if (g_helloWorld) {
            g_helloWorld->appendLog("<<< Huya Role: " + responseJson);
        }
    });
}

void HelloWorld::onSearchGameAreaListClicked()
{
    appendLog(">>> 查询区服列表");
    auto bridge = ruixue::RuixueBridge::getInstance();
    bridge->searchGameAreaList([](const std::string& r) {
        if (g_helloWorld) g_helloWorld->appendLog("<<< AreaList: " + r);
    });
}

void HelloWorld::onSearchGameAreaInfoClicked()
{
    appendLog(">>> 查询区服详情");
    auto bridge = ruixue::RuixueBridge::getInstance();
    bridge->searchGameAreaInfo(R"({"areaId":"server_001"})", [](const std::string& r) {
        if (g_helloWorld) g_helloWorld->appendLog("<<< AreaInfo: " + r);
    });
}

void HelloWorld::onCreateGameCharacterClicked()
{
    appendLog(">>> 创建角色");
    auto bridge = ruixue::RuixueBridge::getInstance();
    bridge->createGameCharacter(R"({"areaId":"server_001","characterName":"勇者小明","characterLevel":"1","cpUserId":"cp_user_001"})", [](const std::string& r) {
        if (g_helloWorld) g_helloWorld->appendLog("<<< CreateChar: " + r);
    });
}

void HelloWorld::onSearchCharacterListClicked()
{
    appendLog(">>> 查询角色列表");
    auto bridge = ruixue::RuixueBridge::getInstance();
    bridge->searchGameCharacterList(R"({"cpUserId":"cp_user_001"})", [](const std::string& r) {
        if (g_helloWorld) g_helloWorld->appendLog("<<< CharList: " + r);
    });
}

void HelloWorld::onSearchCharacterInfoClicked()
{
    appendLog(">>> 查询角色详情");
    auto bridge = ruixue::RuixueBridge::getInstance();
    bridge->searchGameCharacterInfo(R"({"cpUserId":"cp_user_001","areaId":"server_001","characterId":"char_001"})", [](const std::string& r) {
        if (g_helloWorld) g_helloWorld->appendLog("<<< CharInfo: " + r);
    });
}

void HelloWorld::onUpdateCharacterClicked()
{
    appendLog(">>> 更新角色");
    auto bridge = ruixue::RuixueBridge::getInstance();
    bridge->updateGameCharacter(R"({"characterId":"char_001","areaId":"server_001","characterLevel":"50","cpUserId":"cp_user_001"})", [](const std::string& r) {
        if (g_helloWorld) g_helloWorld->appendLog("<<< UpdateChar: " + r);
    });
}

void HelloWorld::onDeleteCharacterClicked()
{
    appendLog(">>> 删除角色");
    auto bridge = ruixue::RuixueBridge::getInstance();
    bridge->deleteGameCharacter(R"({"areaId":"server_001","characterId":"char_001","cpUserId":"cp_user_001"})", [](const std::string& r) {
        if (g_helloWorld) g_helloWorld->appendLog("<<< DeleteChar: " + r);
    });
}

// ==================== 数据分组回调 ====================

void HelloWorld::onGetDeviceInfoClicked()
{
    appendLog(">>> 获取设备信息");
    
    auto bridge = ruixue::RuixueBridge::getInstance();
    std::string deviceInfo = bridge->getDeviceInfo();
    appendLog("<<< Device: " + deviceInfo);
}

void HelloWorld::onGetDistinctIdClicked()
{
    appendLog(">>> 获取 DistinctId");
    auto bridge = ruixue::RuixueBridge::getInstance();
    bridge->getDistinctId([](const std::string& r) {
        if (g_helloWorld) g_helloWorld->appendLog("<<< DistinctId: " + r);
    });
}

void HelloWorld::onDataTrackClicked()
{
    appendLog(">>> 数据埋点");
    auto bridge = ruixue::RuixueBridge::getInstance();
    bridge->dataTrack(R"({"eventName":"level_pass","distinctId":"user_001","properties":{"level":10,"score":9999}})", [](const std::string& r) {
        if (g_helloWorld) g_helloWorld->appendLog("<<< DataTrack: " + r);
    });
}

void HelloWorld::onTrackUserActionClicked()
{
    appendLog(">>> 行为上报");
    auto bridge = ruixue::RuixueBridge::getInstance();
    bridge->trackUserAction(R"({"distinctId":"user_001","properties":{"action":"button_click","page":"game_hall"}})", [](const std::string& r) {
        if (g_helloWorld) g_helloWorld->appendLog("<<< TrackAction: " + r);
    });
}

// ==================== 运营分组回调 ====================

void HelloWorld::onOpenCustomerServiceClicked()
{
    appendLog(">>> 打开客服");
    
    auto bridge = ruixue::RuixueBridge::getInstance();
    bridge->openCustomerService();
    appendLog("<<< 已打开客服");
}

void HelloWorld::onCreateFeedbackClicked()
{
    appendLog(">>> 提交反馈");
    auto bridge = ruixue::RuixueBridge::getInstance();
    bridge->createFeedback(R"({"kindId":"bug_report","content":"测试反馈内容","contact":"13800138000"})", [](const std::string& r) {
        if (g_helloWorld) g_helloWorld->appendLog("<<< Feedback: " + r);
    });
}

void HelloWorld::onUnreadMsgCountClicked()
{
    appendLog(">>> 获取未读消息数");
    auto bridge = ruixue::RuixueBridge::getInstance();
    bridge->getUnreadMessageCount([](const std::string& r) {
        if (g_helloWorld) g_helloWorld->appendLog("<<< UnreadMsg: " + r);
    });
}

void HelloWorld::onPromoDisplayKeyClicked()
{
    appendLog(">>> 获取达人福利码");
    auto bridge = ruixue::RuixueBridge::getInstance();
    bridge->getPromoDisplayKey([](const std::string& r) {
        if (g_helloWorld) g_helloWorld->appendLog("<<< PromoKey: " + r);
    });
}

void HelloWorld::onClearLogClicked()
{
    _logLines.clear();
    _logLabel->setString("");
    appendLog("日志已清空");
}

// ==================== 日志 ====================

void HelloWorld::appendLog(const std::string& log)
{
    std::string logLine = "[" + getCurrentTimeStr() + "] " + log;
    _logLines.push_back(logLine);
    
    if (_logLines.size() > 100) {
        _logLines.erase(_logLines.begin());
    }
    
    std::string allLogs;
    for (const auto& line : _logLines) {
        allLogs += line + "\n";
    }
    _logLabel->setString(allLogs);
    
    float labelHeight = _logLabel->getContentSize().height;
    float scrollHeight = _logScrollView->getContentSize().height;
    float innerHeight = std::max(labelHeight + 20, scrollHeight);
    
    _logScrollView->setInnerContainerSize(Size(_logScrollView->getContentSize().width, innerHeight));
    _logLabel->setPosition(Vec2(10, innerHeight - 10));
    
    _logScrollView->scrollToBottom(0.1f, false);
    
    CCLOG("%s", logLine.c_str());
}

void HelloWorld::menuCloseCallback(Ref* pSender)
{
    Director::getInstance()->end();
}
