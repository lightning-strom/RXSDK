# 瑞雪 SDK iOS 接入规范

> 更新日期：2026-01-22
> 版本：v1.0.0

## 概述

本文档定义 iOS 游戏接入瑞雪 SDK 的详细规范，包含 MCP 工具使用指南和 API 接口说明。

## 系统要求

- **iOS**: 11.0+
- **Xcode**: 14.0+
- **Swift**: 5.0+（支持 Objective-C）

## 1. 依赖配置

### CocoaPods

```ruby
# Podfile
platform :ios, '11.0'
use_frameworks!

target 'YourApp' do
  # 瑞雪 SDK
  pod 'RXSDK_Pure', '~> x.x.x'
  
  # 可选：UI 组件
  pod 'RXUIKitCode', '~> x.x.x'        # 国内版 UI
  pod 'RXOSUIKitCode', '~> x.x.x'      # 海外版 UI
  
  # 可选：第三方登录
  pod 'RXWXSDKCode', '~> x.x.x'        # 微信
  pod 'RXFacebookSDKCode', '~> x.x.x'  # Facebook
  pod 'RXGoogleService', '~> x.x.x'    # Google
end
```

### 手动集成

1. 下载 RXSDK 框架
2. 将 `.framework` 文件拖入项目
3. 配置 `Embed & Sign`
4. 在 `Build Settings` 中配置 `Framework Search Paths`

## 2. SDK 初始化

```objc
#import <RXSDK_Pure/RXSDK_Pure.h>

- (BOOL)application:(UIApplication *)application 
    didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    
    // 配置初始化参数
    RXSdkInitConfig *config = [[RXSdkInitConfig alloc] init];
    config.productId = @"your_product_id";
    config.channelId = @"your_channel_id";
    config.cpid = @"your_cpid";
    config.baseUrlList = @[@"https://api.example.com"];
    
    // 初始化 SDK
    [[RXSDK sharedSDK] initWithConfig:config complete:^(NSDictionary *response, RX_CommonRequestError *error) {
        if (error) {
            NSLog(@"初始化失败: %@", error.responesObject);
            return;
        }
        NSLog(@"初始化成功: %@", response);
    }];
    
    return YES;
}
```

## 3. 登录功能

### 游客登录

```objc
RXLoginConfig *config = [[RXLoginConfig alloc] init];
config.loginType = LoginTypeVisitor;

[[RXSDK sharedSDK] loginWithConfig:config complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    if (error) {
        NSLog(@"登录失败: code=%ld, msg=%@", (long)error.code, error.msg);
        return;
    }
    NSLog(@"登录成功: %@", response);
}];
```

### 账号密码登录

```objc
RXLoginConfig *config = [[RXLoginConfig alloc] init];
config.loginType = LoginTypeAccount;
config.username = @"user@example.com";
config.password = @"password123";

[[RXSDK sharedSDK] loginWithConfig:config complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    if (error) {
        NSLog(@"登录失败: %@", error.msg);
        return;
    }
    NSLog(@"登录成功: %@", response);
}];
```

### Apple 登录

```objc
RXLoginConfig *config = [[RXLoginConfig alloc] init];
config.loginType = LoginTypeApple;

[[RXSDK sharedSDK] loginWithConfig:config complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    if (error) {
        NSLog(@"Apple 登录失败: %@", error.msg);
        return;
    }
    NSLog(@"Apple 登录成功: %@", response);
}];
```

## 4. 内购支付

```objc
NSDictionary *orderDict = @{
    @"trade_no": @"order_12345",        // 订单号
    @"currency": @"CNY",                 // 币种
    @"goods_tag": @"com.app.product1",   // 商品 ID
    @"env": @(0),                        // 0 正式，1 沙盒
    @"notify_url": @"https://your-server.com/pay/notify"
};

[[RXSDK sharedSDK] iap:orderDict complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    if (error) {
        NSLog(@"支付失败: code=%ld, msg=%@", (long)error.code, error.msg);
        return;
    }
    NSLog(@"支付成功: %@", response);
}];
```

## 5. MCP 工具列表

### 用户通行证

| 工具名 | 功能描述 |
|--------|----------|
| `ios_passport` | 用户登录、注册、登出、指定用户信息查询 |
| `ios_captcha` | 发送验证码、校验验证码、图形验证 |
| `ios_real_auth` | 实名认证、防沉迷验证、支付宝 IIFAA 实名 |
| `ios_account_binding` | 绑定第三方账号，绑定/解绑/修改手机号、邮箱 |
| `ios_password` | 修改密码、重置密码 |
| `ios_deregister` | 申请注销、撤销注销 |

### 游戏功能

| 工具名 | 功能描述 |
|--------|----------|
| `ios_game_area` | 游戏区服管理：创建/查询/更新/删除 |
| `ios_game_character` | SetGameInfo 上报瑞雪游戏信息、角色创建/查询/更新/删除；SetThirdGameInfo 不支持 iOS |

### 支付与商业化

| 工具名 | 功能描述 |
|--------|----------|
| `ios_iap` | 内购支付、补单、商品查询 |
| `ios_promo` | 达人福利码获取/兑换 |

### 社交与分享

| 工具名 | 功能描述 |
|--------|----------|
| `ios_share` | 一键分享、系统分享、短链接 |
| `ios_feedback` | 反馈、满意度评价、客服消息 |

### 数据与设备

| 工具名 | 功能描述 |
|--------|----------|
| `ios_tracking` | 数据埋点、用户行为追踪、公共属性 |
| `ios_device` | 设备信息、语言、地区设置 |
| `ios_announcement` | 公告列表、邮件、领取道具 |
| `ios_store_review` | App Store 评分 |

## 6. API 接口速查

### 初始化与登录

```objc
// 获取单例
RXSDK *sdk = [RXSDK sharedSDK];

// 初始化
[sdk initWithConfig:config complete:^(NSDictionary *response, RX_CommonRequestError *error) {}];

// 登录
[sdk loginWithConfig:config complete:^(NSDictionary *response, RX_CommonRequestError *error) {}];

// 获取 OpenID
NSString *openId = [sdk getOpenID];

// 刷新 Token
[sdk refreshTokenWithComplete:^(NSDictionary *response, RX_CommonRequestError *error) {}];

// 检查登录状态
BOOL isExpired = [sdk loginOpenidExpireInvalid];
```

### 用户信息

```objc
// 获取指定用户信息
[sdk getUserInfoByFieldWithParams:@{
    @"user": @[@"openid", @"nickname", @"avatar", @"real_auth_name"],
    @"login": @[@"login_time", @"method"],
    @"current": @[@"ip", @"os"],
    @"aas": @[@"limit", @"aas"]
} complete:^(NSDictionary *response, RX_CommonRequestError *error) {}];

// 获取用户实名信息 + 用户绑定的登录方式信息
[sdk getUserInfoByFieldWithParams:@{
    @"user": @[@"real_auth_id", @"real_auth_name", @"real_auth_id_card", @"real_auth_time", @"age", @"sex"],
    @"account": @[@"method"]
} complete:^(NSDictionary *response, RX_CommonRequestError *error) {}];

// 仅查询用户绑定信息 / 绑定的登录方式
// 注意：“用户绑定的登录方式信息 / 查询用户绑定信息” 对应 account 当前应用下全部登录凭证列表字段。
[sdk getUserInfoByFieldWithParams:@{
    @"account": @[@"method"]
} complete:^(NSDictionary *response, RX_CommonRequestError *error) {}];

// 更新用户信息
[sdk updateUserInfo:avatarUrl nickname:nickname sex:sex region:region ext:ext complete:^(NSDictionary *response, RX_CommonRequestError *error) {}];
```

### 验证码

```objc
// 发送验证码
[sdk sendCaptchaWithType:CaptchaType_phone target:phone purpose:@"login" complete:^(NSDictionary *response, RX_CommonRequestError *error) {}];

// 校验验证码
[sdk verifyCaptchaWithType:CaptchaType_phone target:phone purpose:@"login" captchaCode:code complete:^(NSDictionary *response, RX_CommonRequestError *error) {}];
```

### 账号绑定

```objc
// 绑定手机
[sdk bindPhoneWithCaptchaCode:code password:pwd phone:phone migrateArgs:nil complete:^(NSDictionary *response, RX_CommonRequestError *error) {}];

// 绑定邮箱
[sdk bindEmailWithEmail:email password:pwd captchaCode:code migrateArgs:nil complete:^(NSDictionary *response, RX_CommonRequestError *error) {}];
```

### 内购支付

```objc
// IAP 支付
[sdk iap:orderDict complete:^(NSDictionary *response, RX_CommonRequestError *error) {}];

// 检查补单
BOOL needReFailOrder = [sdk checkHasFailedOrder];

// 执行补单
[sdk reFailOrderWithMaxCount:5 complete:^(NSDictionary *response, RX_CommonRequestError *error) {}];

// 查询商品信息
[sdk getProductInfoWithProductIdArr:productIds complete:^(NSArray<SKProduct *> *products) {}];
```

### 数据埋点

```objc
// 数据埋点
[sdk dataTrackWithEvent:@"event_name" distinctId:nil properties:@{@"key": @"value"}];

// 单条上报
[sdk addLogSingleWithEvent:@"event_name" distinctId:nil properties:props complete:^(NSDictionary *response, RX_CommonRequestError *error) {}];

// 设置公共属性
[sdk setPublicProperties:@{@"app_version": @"1.0.0"}];
```

### 分享

```objc
// 一键分享
RXShareConfig *config = [[RXShareConfig alloc] init];
config.platform = @"wechat";
config.title = @"分享标题";
[sdk share:config complete:^(NSDictionary *response, RX_CommonRequestError *error) {}];

// 获取短链接
[sdk getShortUrl:@"https://example.com" complete:^(NSDictionary *response, RX_CommonRequestError *error) {}];
```

## 7. 模板文件列表

| 模板文件 | 功能类别 |
|----------|----------|
| `passport.tpl` | 用户通行证：登录、注册、指定用户信息 |
| `captcha.tpl` | 验证码：发送、校验、图形验证 |
| `account_binding.tpl` | 账号绑定：手机、邮箱 |
| `password.tpl` | 密码管理：修改、重置 |
| `real_auth.tpl` | 实名认证 |
| `deregister.tpl` | 账号注销 |
| `game_area.tpl` | 游戏区服 |
| `game_character.tpl` | 游戏角色 |
| `iap.tpl` | 内购支付 |
| `share.tpl` | 分享功能 |
| `feedback.tpl` | 反馈功能 |
| `tracking.tpl` | 数据埋点 |
| `promo.tpl` | 达人福利 |
| `announcement.tpl` | 公告/邮件 |
| `device.tpl` | 设备信息 |
| `store_review.tpl` | App Store 评分 |

## 8. 接入检查清单

- [ ] 添加 SDK 依赖（CocoaPods / 手动）
- [ ] 配置 Info.plist（URL Schemes、权限等）
- [ ] 配置 Capabilities（Sign in with Apple、IAP 等）
- [ ] 初始化 SDK
- [ ] 实现登录功能
- [ ] 实现支付功能
- [ ] 实现分享功能（可选）
- [ ] 实现数据埋点
- [ ] 测试验证

## 9. 常见问题

### Q: 如何处理登录 Token 过期？

```objc
// 检查 token 是否过期
if ([[RXSDK sharedSDK] loginOpenidExpireInvalid]) {
    // 刷新 token
    [[RXSDK sharedSDK] refreshTokenWithComplete:^(NSDictionary *response, RX_CommonRequestError *error) {
        if (error) {
            // 刷新失败，重新登录
            [self showLoginView];
        }
    }];
}
```

### Q: 如何实现补单功能？

```objc
// 应用启动时检查补单
- (void)checkReFailOrder {
    if ([[RXSDK sharedSDK] checkHasFailedOrder]) {
        [[RXSDK sharedSDK] reFailOrderWithMaxCount:5 complete:^(NSDictionary *response, RX_CommonRequestError *error) {
            if (!error) {
                NSLog(@"补单成功");
            }
        }];
    }
}
```

### Q: 如何获取设备 IDFA？

```objc
// iOS 14+ 需要请求 ATT 授权
#import <AppTrackingTransparency/AppTrackingTransparency.h>

if (@available(iOS 14, *)) {
    [ATTrackingManager requestTrackingAuthorizationWithCompletionHandler:^(ATTrackingManagerAuthorizationStatus status) {
        if (status == ATTrackingManagerAuthorizationStatusAuthorized) {
            NSString *idfa = [RXSDK getIDFA];
            NSLog(@"IDFA: %@", idfa);
        }
    }];
}
```

---

**文档版本**：v1.0.0  
**更新日期**：2026-01-22
