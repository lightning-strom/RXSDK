/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 
 http://www.cocos2d-x.org
 ****************************************************************************/

#ifndef __HELLOWORLD_SCENE_H__
#define __HELLOWORLD_SCENE_H__

#include "cocos2d.h"
#include "ui/CocosGUI.h"
#include <string>
#include <vector>
#include <functional>

// 分组类型枚举
enum class TabType {
    INIT = 0,       // 初始化
    UI,             // UI
    ACCOUNT,        // 账号
    PAY,            // 支付
    SHARE,          // 分享
    GAME,           // 游戏
    DATA,           // 数据
    OPERATION       // 运营
};

// 按钮配置
struct ButtonConfig {
    std::string title;
    std::function<void()> callback;
};

class HelloWorld : public cocos2d::Scene
{
public:
    static cocos2d::Scene* createScene();

    virtual bool init();
    
    // a selector callback
    void menuCloseCallback(cocos2d::Ref* pSender);
    
    // 日志输出
    void appendLog(const std::string& log);
    
    // implement the "static create()" method manually
    CREATE_FUNC(HelloWorld);
    
private:
    // 创建分组标签
    void createTabBar();
    
    // 切换分组
    void switchToTab(TabType tab);
    
    // 更新按钮区域
    void updateButtonArea();
    
    // 获取当前分组的按钮配置
    std::vector<ButtonConfig> getButtonsForTab(TabType tab);
    
    // ==================== 初始化分组按钮回调 ====================
    void onShowEnvClicked();
    void onSwitchEnvClicked();
    void onInitSDKClicked();
    void onHuyaInitClicked();
    void autoInitSDK(bool isRetry = false);
    
    // ==================== UI 分组按钮回调 ====================
    void onShowLoginUIClicked();
    void onShowUserCenterClicked();
    void onCloseUserCenterClicked();
    void onResetPasswordClicked();      // 找回密码
    void onRealNameAuthClicked();       // 实名认证
    void onBindPhoneClicked();          // 绑定手机
    void onDeleteAccountClicked();      // 注销账号
    void onApplyDeleteClicked();        // 申请注销
    void onAgreementPageClicked();      // 协议页面
    void onAntiAddictionClicked();      // 防沉迷提示
    void onMailCenterClicked();         // 邮件中心
    void onAnnouncementClicked();       // 公告页面
    void onVersionUpdateClicked();      // 版本更新
    void onUpdateGameVersionClicked();  // 游戏版本检查 V2
    void onHelpCenterClicked();         // 帮助中心
    
    // ==================== 账号分组按钮回调 ====================
    void onGuestLoginClicked();
    void onUsernameLoginClicked();
    void onCaptchaLoginClicked();
    void onRegisterClicked();
    void onLogoutClicked();
    void onGetUserInfoClicked();
    void onGetUserInfoByFieldClicked();
    void onSendCaptchaClicked();
    void onRealAuthAPIClicked();
    void onSearchBindingClicked();
    void onHuyaLoginClicked();
    
    // ==================== 支付分组按钮回调 ====================
    void onPayClicked();
    void onXingYiAppPayClicked();
    void onXingYiH5PayClicked();
    void onHuyaPayClicked();
    void onQueryOrderClicked();
    
    // ==================== 分享分组按钮回调 ====================
    void onShareClicked();
    void onShareCustomClicked();
    
    // ==================== 游戏分组按钮回调 ====================
    void onCreateGameAreaClicked();
    void onHuyaReportRoleClicked();
    void onSearchGameAreaListClicked();
    void onSearchGameAreaInfoClicked();
    void onCreateGameCharacterClicked();
    void onSearchCharacterListClicked();
    void onSearchCharacterInfoClicked();
    void onUpdateCharacterClicked();
    void onDeleteCharacterClicked();
    
    // ==================== 数据分组按钮回调 ====================
    void onGetDeviceInfoClicked();
    void onGetDistinctIdClicked();
    void onDataTrackClicked();
    void onTrackUserActionClicked();
    
    // ==================== 运营分组按钮回调 ====================
    void onOpenCustomerServiceClicked();
    void onCreateFeedbackClicked();
    void onUnreadMsgCountClicked();
    void onPromoDisplayKeyClicked();
    void onClearLogClicked();
    
private:
    // 当前选中的分组
    TabType _currentTab;
    
    // 分组标签容器
    cocos2d::ui::ScrollView* _tabScrollView;
    
    // 按钮区域
    cocos2d::ui::ScrollView* _buttonScrollView;
    cocos2d::Node* _buttonContainer;
    
    // 日志区域
    cocos2d::ui::ScrollView* _logScrollView;
    cocos2d::Label* _logLabel;
    std::vector<std::string> _logLines;
    
    // 布局参数
    float _logAreaHeight;
    float _tabBarHeight;
    float _titleHeight;
    float _buttonAreaHeight;
    float _bottomOffset;
    cocos2d::Size _visibleSize;
    cocos2d::Vec2 _origin;
    
    // SDK 配置参数
    std::string _cpid;
    std::string _productId;
    std::string _channelId;
    std::string _baseUrls;
};

#endif // __HELLOWORLD_SCENE_H__
