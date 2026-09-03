/**
 * RuixueSDKExample.h
 * 瑞雪 SDK 使用示例
 * 
 * 所有回调返回完整 JSON 响应（code, msg, data）
 */

#ifndef __RUIXUE_SDK_EXAMPLE_H__
#define __RUIXUE_SDK_EXAMPLE_H__

#include "RuixueBridge.h"
#include "cocos2d.h"

/**
 * 瑞雪 SDK 使用示例
 * 
 * 回调响应格式:
 * {
 *   "code": 0,           // 0 成功，其他失败
 *   "msg": "success",    // 提示信息
 *   "data": {...}        // 业务数据
 * }
 */
class RuixueSDKExample {
public:
    
    /**
     * 初始化 SDK 示例
     */
    static void initSDK() {
        auto bridge = ruixue::RuixueBridge::getInstance();
        
#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
        std::string channelId = "iOS";
#else
        std::string channelId = "100";
#endif
        
        std::string paramsJson = R"({
            "cpid": "114",
            "productId": "1002",
            "channelId": ")" + channelId + R"(",
            "baseUrls": ["https://cn-api-test.ruixueyun.com/"]
        })";
        
        bridge->init(paramsJson, [](const std::string& responseJson) {
            CCLOG("Init response: %s", responseJson.c_str());
            
            // 解析响应 JSON
            // responseJson 格式: {"code":0,"msg":"初始化成功","data":{}}
            
            // 简单判断成功
            bool success = (responseJson.find("\"code\":0") != std::string::npos);
            if (success) {
                CCLOG("瑞雪 SDK 初始化成功");
            } else {
                CCLOG("瑞雪 SDK 初始化失败");
            }
        });
    }

    /**
     * GDT 手动初始化及事件上报示例
     */
    static void reportGDTEvents() {
        auto bridge = ruixue::RuixueBridge::getInstance();

        bridge->gdtInitialize("your_action_set_id", "your_secret_key",
                              "tencent", "tencent");
        bridge->gdtReportRegister("guest", true);
        bridge->gdtReportLogin("guest", true);
        bridge->gdtReportCreateRole("role-id");
        bridge->gdtReportCheckout("item", "礼包", "sku-1", 1,
                                  false, "", "CNY", true);
        // valueInCents 的金额单位为分，此处 600 表示 6.00 CNY。
        bridge->gdtReportPurchase("item", "礼包", "sku-1", 1,
                                  "wechat", "CNY", 600, true);
        bridge->gdtReportQuestFinish("tutorial-1", "tutorial", "新手教学",
                                     1, "完成新手教学", true);
        bridge->gdtReportShare("wechat", true);
        bridge->gdtReportUpdateLevel(10);
        bridge->gdtReportRateApp(5.0f);
        bridge->gdtReportViewContent("item", "礼包", "sku-1");
        bridge->gdtReportAddToCart("item", "礼包", "sku-1", 1, true);
    }
    
    /**
     * UI 登录示例
     */
    static void showLoginUI() {
        auto bridge = ruixue::RuixueBridge::getInstance();
        
        if (!bridge->isInitialized()) {
            CCLOG("SDK 未初始化，请先初始化");
            return;
        }
        
        std::string paramsJson = R"({})";
        
        bridge->showLoginUI(paramsJson, [](const std::string& responseJson) {
            CCLOG("Login response: %s", responseJson.c_str());
            
            // responseJson 格式: {"code":0,"msg":"登录成功","data":{"openid":"xxx","token":"yyy"}}
            // 可以使用 JSON 库解析获取 data.openid 和 data.token
        });
    }
    
    /**
     * 游客登录示例
     */
    static void guestLogin() {
        auto bridge = ruixue::RuixueBridge::getInstance();
        
        if (!bridge->isInitialized()) {
            CCLOG("SDK 未初始化，请先初始化");
            return;
        }
        
        std::string paramsJson = R"({"loginType": "guest"})";
        
        bridge->login(paramsJson, [](const std::string& responseJson) {
            CCLOG("Guest login response: %s", responseJson.c_str());
        });
    }

    /**
     * 栩腾第三方 SDK 初始化。当前渠道可传空 JSON；若交付包要求运行时参数，
     * 将栩腾提供的参数 JSON 原样传入。
     */
    static void initXutengThirdSdk(const std::string& paramsJson = "{}") {
        ruixue::RuixueBridge::getInstance()->initThirdSdk(
            paramsJson,
            [](const std::string& responseJson) {
                CCLOG("Xuteng initThirdSdk response: %s", responseJson.c_str());
            });
    }

    static void loginXuteng() {
        ruixue::RuixueBridge::getInstance()->login(
            R"({"loginType":"xuteng"})",
            [](const std::string& responseJson) {
                CCLOG("Xuteng login response: %s", responseJson.c_str());
            });
    }

    static void payXuteng() {
        ruixue::RuixueBridge::getInstance()->pay(
            R"({"payType":"xuteng","goodsTag":"replace_with_goods_tag","age":18})",
            [](const std::string& responseJson) {
                CCLOG("Xuteng pay response: %s", responseJson.c_str());
            });
    }

    static void setXutengGameInfo() {
        ruixue::RuixueBridge::getInstance()->setGameInfo(
            R"({"type":2,"roleId":"role_1001","roleName":"角色名","serverId":"1","serverName":"服务器名","gameRoleLevel":"10"})",
            [](const std::string& responseJson) {
                CCLOG("Xuteng setGameInfo response: %s", responseJson.c_str());
            });
    }

    static void logoutXuteng() {
        ruixue::RuixueBridge::getInstance()->logout(
            [](const std::string& responseJson) {
                CCLOG("Xuteng logout response: %s", responseJson.c_str());
            });
    }

    static void exitXuteng() {
        ruixue::RuixueBridge::getInstance()->exitApp(
            [](const std::string& responseJson) {
                CCLOG("Xuteng exitApp response: %s", responseJson.c_str());
            });
    }

    /**
     * 当前 Android 渠道闪屏示例。
     * 百度传 {}，MuMu 传 {"splashType":0}；切换渠道不改业务调用。
     * 百度示例：showCurrentChannelSplash(false)
     * MuMu 示例：showCurrentChannelSplash(true)
     */
    static void showCurrentChannelSplash(bool useMumuParams) {
#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
        auto bridge = ruixue::RuixueBridge::getInstance();
        const std::string paramsJson =
            useMumuParams ? R"({"splashType":0})" : R"({})";
        bridge->invokeChannelAction(
            ruixue::ChannelAction::SHOW_SPLASH,
            paramsJson,
            [](const std::string& responseJson) {
                CCLOG("Channel splash response: %s", responseJson.c_str());
            });
#else
        CCLOG("Channel actions are only supported on Android");
#endif
    }
    
    /**
     * 账号密码登录示例
     */
    static void loginWithUsername(const std::string& username, const std::string& password) {
        auto bridge = ruixue::RuixueBridge::getInstance();
        
        if (!bridge->isInitialized()) {
            CCLOG("SDK 未初始化，请先初始化");
            return;
        }
        
        std::string paramsJson = R"({
            "loginType": "username",
            "username": ")" + username + R"(",
            "password": ")" + password + R"("
        })";
        
        bridge->login(paramsJson, [](const std::string& responseJson) {
            CCLOG("Username login response: %s", responseJson.c_str());
        });
    }
    
    /**
     * 支付示例
     */
    static void pay(const std::string& productId, const std::string& productName, int price) {
        auto bridge = ruixue::RuixueBridge::getInstance();
        
        if (!bridge->isLoggedIn()) {
            CCLOG("用户未登录，请先登录");
            return;
        }
        
        std::string paramsJson = R"({
            "productId": ")" + productId + R"(",
            "productName": ")" + productName + R"(",
            "price": )" + std::to_string(price) + R"(,
            "extra": {"orderId": "game_order_123"}
        })";
        
        bridge->pay(paramsJson, [](const std::string& responseJson) {
            CCLOG("Pay response: %s", responseJson.c_str());
            
            // responseJson 格式: {"code":0,"msg":"支付成功","data":{"orderId":"xxx"}}
        });
    }
    
    /**
     * 分享示例
     */
    static void share() {
        auto bridge = ruixue::RuixueBridge::getInstance();
        
        std::string paramsJson = R"({
            "shareType": 2,
            "title": "我在玩一款超好玩的游戏！",
            "content": "快来和我一起玩吧！",
            "imageUrl": "https://example.com/share_image.png"
        })";
        
        bridge->share(paramsJson, [](const std::string& responseJson) {
            CCLOG("Share response: %s", responseJson.c_str());
        });
    }
    
    /**
     * 获取临时维护公告示例
     */
    static void getTempNotice() {
        auto bridge = ruixue::RuixueBridge::getInstance();
        bridge->getTempNotice([](const std::string& responseJson) {
            CCLOG("Temp notice response: %s", responseJson.c_str());
        });
    }
    
    /**
     * 获取设备信息示例
     */
    static void printDeviceInfo() {
        auto bridge = ruixue::RuixueBridge::getInstance();
        std::string deviceInfo = bridge->getDeviceInfo();
        CCLOG("设备信息: %s", deviceInfo.c_str());
    }
    
    /**
     * 打开客服示例
     */
    static void openCustomerService() {
        auto bridge = ruixue::RuixueBridge::getInstance();
        bridge->openCustomerService();
    }
    
    /**
     * 登出示例
     */
    static void logout() {
        auto bridge = ruixue::RuixueBridge::getInstance();
        bridge->logout([](const std::string& responseJson) {
            CCLOG("Logout response: %s", responseJson.c_str());
        });
    }
};

#endif // __RUIXUE_SDK_EXAMPLE_H__
