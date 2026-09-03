# 瑞雪 SDK Unity 接入规范

> 说明：Unity MCP 优先根据 `version` 自动分流：`1.x` 走 `rxsdk-mcp-server/templates/unity/`（`RuiXueSdk` / `RXLogin` / `RXPay` + 双回调），`2.x`/`3.x` 走 `rxsdk-mcp-server/templates/unity_v2/`（`RXSDK` / `SdkCallback`，部分模块保留 `RX*` 门面类）；`sdkApiVersion=tj` / `tuanjie` / `openharmony` 走团结 OpenHarmony 版（`RXSDK.RuiXueSdk` + `RXCallback<T>`）。`sdkApiVersion` 仅作为显式覆盖参数保留。

## 0. 版本路由

| SDK 版本 | MCP 参数 | 入口 | 备注 |
|---|---|---|---|
| Unity v1 | `version=1.x` 或 `sdkApiVersion=v1` | `RuiXueSdk` / `RXLogin` / `RXPay` | UPM 分模块 |
| Unity v2/v3 | `version=2.x/3.x` 或 `sdkApiVersion=v2` | `RXSDK` / `SdkCallback` | 统一包 |
| 团结 OpenHarmony | `sdkApiVersion=tj` / `tuanjie` / `openharmony` | `RXSDK.RuiXueSdk` | 当前 MCP 覆盖 `init/dependency/setup/agent/login/payment/share/tracking` |

团结 OpenHarmony 版注意事项：

- 命名空间是 `RXSDK`，不是普通 v1 文档里的 `RuiXue`。
- 不使用 `RXLogin` / `RXPay` 分模块入口，登录与支付都从 `RuiXueSdk` 静态方法进入。
- 优先使用 `RXCallback<T>`，旧 `Action<int, data, msg>` 重载只作为兼容接口。

## 1. 依赖配置

### 1.1 UPM 安装（推荐）

#### 方法 A：通过 Scoped Registry

在项目 `Packages/manifest.json` 中添加瑞雪 Registry：

```json
{
  "scopedRegistries": [
    {
      "name": "RuiXue SDK",
      "url": "http://60.205.123.114:4873",
      "scopes": ["com.ruixue"]
    }
  ],
  "dependencies": {
    "com.ruixue.unitysdk": "3.0.0"
  }
}
```

#### 方法 B：通过本地路径

```json
{
  "dependencies": {
    "com.ruixue.unitysdk": "file:../com.ruixue.unitysdk"
  }
}
```

#### 方法 C：通过 Unity 编辑器

1. 打开 `Window > Package Manager`
2. 点击 `+` 按钮，选择 `Add package by name...`
3. 输入：`com.ruixue.unitysdk`

### 1.2 .unitypackage 安装

1. 获取 `RuiXueSDK.unitypackage` 文件
2. 菜单栏：`Assets > Import Package > Custom Package...`
3. 选择下载的 `.unitypackage` 文件
4. 勾选所有文件，点击 `Import`

> **注意**：UPM 与 .unitypackage 二选一，不要同时使用。

### 1.3 包信息

| 项目 | 说明 |
|------|------|
| 包名 | com.ruixue.unitysdk |
| 命名空间 | RuiXue（及 RuiXue.Login、RuiXue.Pay 等子命名空间） |
| 主要入口类 | RXSDK（静态类） |

---

## 2. 环境要求

| 项目 | 要求 |
|------|------|
| Unity 版本 | 2019.4 LTS 或更高 |
| .NET | .NET Standard 2.1 或 .NET Framework 4.x |
| Android | API Level 21+（Android 5.0+） |
| iOS | 11.0+ |
| WebGL | 支持微信小游戏、抖音小游戏 |

### 2.1 平台构建配置

#### Android

- Player Settings > Other Settings：
  - Minimum API Level: 21
  - Target API Level: 推荐 33+
  - Scripting Backend: IL2CPP（推荐）或 Mono

#### iOS

- Player Settings > Other Settings：
  - Target minimum iOS Version: 11.0
  - Architecture: ARM64
  - Scripting Backend: IL2CPP

---

## 3. SDK 初始化

### 3.1 初始化方法

```csharp
/**
 * 使用配置初始化 SDK
 * @param config   初始化配置对象 RXSdkInitConfig
 * @param callback 初始化结果回调 SdkCallback
 */
RXSDK.Initialize(RXSdkInitConfig config, SdkCallback callback);

// 或者（直接传参）
RXSDK.Initialize(string cpid, string productid, string channelid, List<string> urls, SdkCallback callback);
```

### 3.2 RXSdkInitConfig 属性

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| cpId | string | 是 | CP 唯一 ID |
| productId | string | 是 | 产品 ID |
| channelId | string | 是 | 渠道 ID |
| baseUrlList | List\<string\> | 是 | 请求域名队列 |
| isLogEnable | bool | 否 | 日志开关，默认 true |
| autoInitThird | bool | 否 | 是否自动初始化第三方 SDK，默认 true；对应 Android `setAutoInitThird` |
| thirdSdkParams | Dictionary\<string, object\> | 否 | 第三方 SDK 初始化参数；对应 Android `setThirdSdkParams` |
| usePrivacy | bool | 否 | 首次启动是否展示用户隐私授权页面，默认 false |
| agreementTitle | string | 否 | 协议标题，默认 "用户协议和隐私政策" |
| isUseDNS | bool | 否 | 是否打开 DNS |
| agreementMap | Dictionary\<string, object\> | 否 | 自定义协议键值对 |

### 3.3 初始化代码示例

```csharp
using System.Collections.Generic;
using UnityEngine;
using RuiXue;

public class GameManager : MonoBehaviour
{
    void Start()
    {
        var config = new RXSdkInitConfig
        {
            cpId = "your_cpid",
            productId = "your_product_id",
            channelId = "your_channel_id",
            baseUrlList = new List<string>
            {
                "https://api1.ruixueyun.com",
                "https://api2.ruixueyun.com"
            },
            isLogEnable = true,
            autoInitThird = true,
            thirdSdkParams = new Dictionary<string, object>
            {
                { "your_third_sdk_key", "your_third_sdk_value" }
            },
            usePrivacy = false
        };

        RXSDK.Initialize(config, result =>
        {
            if (result.IsSuccess)
            {
                Debug.Log("SDK 初始化成功: " + result.Data);
            }
            else
            {
                Debug.LogError($"SDK 初始化失败 [{result.Code}]: {result.Error}");
            }
        });
    }
}
```

### 3.4 异步初始化

```csharp
// 使用 async/await
var result = await RXSDK.InitializeAsync(config);

// 带超时（毫秒）
var resultWithTimeout = await RXSDK.InitializeAsync(config, 10000);
```

---

## 4. 登录

### 4.1 LoginConfig 配置类

| 属性 | 类型 | 说明 |
|------|------|------|
| loginType | string | 登录类型，使用 LoginMethod 常量 |
| username | string | 用户名（账号密码/验证码登录时必填） |
| password | string | 密码（账号密码登录时必填） |
| captchaCode | string | 验证码（验证码登录时必填） |
| loginOpenId | string | 二次登录 openId |
| ext | Dictionary\<string, object\> | 扩展字段 |
| signFields | string[] | 签名字段 |
| migrateArgs | object | 迁移参数 |
| permissions | string[] | 权限列表（Facebook、Line 等） |
| force | bool | 强制登录 |
| forbid_visitor | bool | 是否禁止游客登录 |

### 4.2 LoginMethod 常量

| 常量 | 说明 |
|------|------|
| Guest | 游客登录 |
| Username | 账号密码登录 |
| CaptchaCode | 手机/邮箱验证码登录 |
| Wechat | 微信登录 |
| Apple | Apple 登录 |
| Google | Google 登录 |
| FaceBook | Facebook 登录 |
| Line | LINE 登录 |
| QuickPhone | 阿里一键登录 |
| MobileQQ | QQ 登录 |
| HuaWei, Mi, Vivo, Oppo | 国内渠道登录 |
| DouYin, DouYinH5 | 抖音 / 抖音小游戏 |
| Minigame | 微信小游戏 |
| TapTap, BiliBili | TapTap、哔哩哔哩 |
| 等 | 详见 LoginMethod 类 |

### 4.3 登录代码示例

```csharp
using RuiXue;
using RuiXue.Login;

// 游客登录
var guestConfig = new LoginConfig { loginType = LoginMethod.Guest };
RXSDK.Login(guestConfig, result =>
{
    if (result.IsSuccess) Debug.Log("登录成功: " + result.Data);
    else Debug.LogError($"登录失败: {result.Error}");
});

// 账号密码登录
var accountConfig = new LoginConfig
{
    loginType = LoginMethod.Username,
    username = "user@example.com",
    password = "password123"
};
RXSDK.Login(accountConfig, result => { /* 处理结果 */ });

// 验证码登录
var captchaConfig = new LoginConfig
{
    loginType = LoginMethod.CaptchaCode,
    username = "13800138000",
    captchaCode = "123456"
};
RXSDK.Login(captchaConfig, result => { /* 处理结果 */ });

// 第三方登录
var wechatConfig = new LoginConfig { loginType = LoginMethod.Wechat };
var appleConfig = new LoginConfig { loginType = LoginMethod.Apple };
var googleConfig = new LoginConfig { loginType = LoginMethod.Google };
```

### 4.4 异步登录

```csharp
var result = await RXSDK.LoginAsync(config);
```

---

## 5. 支付

### 5.1 支付接口

```csharp
RXSDK.Pay(Dictionary<string, object> dic, SdkCallback callback);
var result = await RXSDK.PayAsync(dic);
```

### 5.2 支付参数

| 参数 | 类型 | 说明 |
|------|------|------|
| trade_no | string | CP 订单号 |
| goods_tag | string | 商品 ID / 计费点 |
| hq_type | string | 支付类型（wechat、alipay、apple、google 等） |
| currency | string | 币种（CNY、USD 等） |
| ext_info | string | 透传参数 |

### 5.3 支付代码示例

```csharp
using RuiXue;
using System.Collections.Generic;

var payParams = new Dictionary<string, object>
{
    { "trade_no", "order_12345" },
    { "goods_tag", "product_001" },
    { "hq_type", "wechat" },
    { "currency", "CNY" },
    { "ext_info", "{\"role_id\":\"123\"}" }
};

RXSDK.Pay(payParams, result =>
{
    if (result.IsSuccess)
        Debug.Log("支付成功（以服务端回调为准）");
    else
        Debug.LogError($"支付失败: {result.Error}");
});
```

---

## 6. 分享、社交、排行榜等

### 6.1 分享

```csharp
RXSDK.Share(RXShareConfig shareConfig, SdkCallback callback);
RXSDK.ShareCustom(RXCustomShareConfig shareConfig, SdkCallback callback);
RXSDK.GetShareData(RXShareConfig shareConfig, SdkCallback callback);
RXSDK.GetShortUrl(string url, SdkCallback callback);
```

### 6.2 社交

```csharp
RXSDK.AddFriends(string target, string targetRemarks, string userRemarks, SdkCallback callback);
RXSDK.RemoveFriends(string target, SdkCallback callback);
RXSDK.RelationFriends(SdkCallback callback);
RXSDK.IsFriend(string target, SdkCallback callback);
RXSDK.LbsUpdate(string[] types, float lon, float lat, SdkCallback callback);
RXSDK.LbsRadius(string type, float lon, float lat, float radius, int count, int page, int page_size, SdkCallback callback);
RXSDK.RelationAdd(string target, Dictionary<string, object> types, ...);
RXSDK.RelationDelete(string target, Dictionary<string, object> types, SdkCallback callback);
```

### 6.3 排行榜

```csharp
RXSDK.AddScore(string rank_id, int score, SdkCallback callback);
RXSDK.SetScore(string rank_id, int score, SdkCallback callback);
RXSDK.QueryUserRank(string rank_id, string open_id, SdkCallback callback);
RXSDK.GetRankList(string rank_id, int start_rank, int end_rank, SdkCallback callback);
RXSDK.FriendsRank(string rank_id, SdkCallback callback);
```

### 6.4 数据分析

```csharp
RXSDK.DataTrack(string eventName, string distinctId, Dictionary<string, object> properties, SdkCallback callback);
RXSDK.SetPublicProperties(Dictionary<string, object> publicProperties);
```

### 6.5 反馈

```csharp
RXSDK.GetFeedbackKindList(SdkCallback callback);
RXSDK.CreateFeedback(Dictionary<string, object> dic, SdkCallback callback);
RXSDK.SatisfactionEvaluation(Dictionary<string, object> dic, SdkCallback callback);
```

### 6.6 法务

```csharp
RXSDK.GetLegal(SdkCallback callback);
```

### 6.7 推送

```csharp
RXSDK.PushInit();
RXSDK.PushRegisterToken();
RXSDK.PushUnRegisterToken();
RXSDK.PushGetDeviceToken();
RXSDK.PushBindAlias(string alias);
RXSDK.PushUnBindAlias(string alias);
```

### 6.8 版本检查

```csharp
RXSDK.UpdateApp(string version, string region, string type, SdkCallback callback);
RXSDK.CheckUpdateApp(string version, string region, string type, ...);
RXSDK.UpdateGame(string gameId, string gameVersion, ...);
RXSDK.UpdateActivity(string activityShortname, ...);
```

### 6.9 广告

```csharp
RXSDK.RewardedVideoAd(string adUnitId, bool isCheck, SdkCallback callback);
RXSDK.BannerAd(string adUnitId, Rect pos, float adIntervals, bool isCheck, SdkCallback callback);
RXSDK.InterstitialAd(string adUnitId, bool isCheck, SdkCallback callback);
```

### 6.10 评价

```csharp
RXSDK.JumpToAppStore();  // 跳转应用商店
```

---

## 7. 设备配置 API

### 7.1 配置类

```csharp
RXSDK.SetLogEnable(bool enabled);
RXSDK.SetSubChannelId(string subChannelId);
RXSDK.SetLanguage(string language);
RXSDK.SetArea(string area);
RXSDK.SetPasswordStrength(RXPasswordStrength type);
RXSDK.SetPwdPattern(string pattern);
RXSDK.SetScreenCaptureDisable(bool disable);
RXSDK.SetPrivacyAgree(PrivacyCallback callback);
RXSDK.SetupAddictDelegate(IAntiAddictDelegate addictDelegate);
RXSDK.ConfigErrorMsg(Dictionary<string, object> errorMsgMap);
```

### 7.2 设备信息

```csharp
RXSDK.GetDeviceCode(SdkCallback callback);
RXSDK.GetDistinctId(SdkCallback callback);
RXSDK.IsAgreedPrivacy();
RXSDK.LoginOpenidExpireInvalid();
```

---

## 8. 回调与结果

### 8.1 SdkCallback 委托

```csharp
public delegate void SdkCallback(SdkResult result);
```

### 8.2 SdkResult 结构

| 属性 | 类型 | 说明 |
|------|------|------|
| IsSuccess | bool | 是否成功 |
| Data | string | 成功时的 JSON 数据 |
| Error | string | 失败时的错误信息 |
| Code | int | 错误码 |

### 8.3 回调处理示例

```csharp
RXSDK.Login(config, result =>
{
    if (result.IsSuccess)
    {
        Debug.Log("成功: " + result.Data);
    }
    else
    {
        Debug.LogError($"失败 [{result.Code}]: {result.Error}");
    }
});
```

---

## 9. MCP 工具列表

瑞雪 SDK MCP 服务器提供 `unity` 工具，通过 `feature` 参数生成不同模块的 C# 代码。

### 9.1 工具调用方式

```text
unity feature=<feature_name> [version=1.6.17|3.0.0|tuanjie-openharmony] [sdkApiVersion=v1|v2|tj] [installType=upm|unitypackage] [workspacePath=项目路径]
```

团结 OpenHarmony 版示例：

```text
unity feature=init sdkApiVersion=tj
unity feature=payment version=ruixue_tj_unity
```

### 9.2 基础接入

| feature | 说明 |
|---------|------|
| init | SDK 初始化代码 |
| agent | 接入流程指南 |
| dependency | 依赖配置说明（UPM / .unitypackage） |
| setup | 自动化接入 |

### 9.3 用户通行证

| feature | 说明 |
|---------|------|
| login | 登录（游客/账号密码/验证码/第三方） |
| passport | 登录/注册/指定用户信息 |
| captcha | 验证码（手机/邮箱） |
| real_auth | 实名认证 / 支付宝 IIFAA 实名 |
| account_binding | 账号绑定（第三方账号/手机/邮箱） |
| password | 密码管理 |
| deregister | 账号注销 |

常见 `getUserInfoByField` 字段组合：

```csharp
// 获取用户实名信息 + 用户绑定的登录方式信息
Dictionary<string, object> param = new()
{
    { "user", new[] { "real_auth_id", "real_auth_name", "real_auth_id_card", "real_auth_time", "age", "sex" } },
    { "account", new[] { "method" } }
};

// 仅查询用户绑定信息 / 绑定的登录方式
Dictionary<string, object> bindParam = new()
{
    { "account", new[] { "method" } }
};

// 注意：“用户绑定的登录方式信息 / 查询用户绑定信息” 对应 account 当前应用下全部登录凭证列表字段。
```

### 9.4 社交功能

| feature | 说明 |
|---------|------|
| social | 社交关系 |
| friends | 好友管理 |
| lbs | 瑞雪 LBS 高德定位（`RuiXue.LBS`，Android `RXLBSAndroid` / iOS `RXLBSIOS`） |
| rank | 排行榜 |

> `lbs` 指基于高德 SDK 获取设备位置，并负责对应的 Android/iOS 工程配置说明。
> `RXSocial.LbsUpdate/LbsRadius/LbsDelete` 属于独立的社交 LBS 上报与附近人能力，不应作为高德定位接口生成。

### 9.5 游戏功能

| feature | 说明 |
|---------|------|
| game_area | 游戏区服 |
| game_character | 游戏信息与角色：SetGameInfo 上报瑞雪，SetThirdGameInfo 上报三方渠道 |
| mumu | MuMu/Yofun Unity Android 渠道（Unity 1.6.37+、Android 4.0.16+） |

### 9.6 其他功能

| feature | 说明 |
|---------|------|
| payment | 支付功能 |
| share | 分享 |
| feedback | 反馈/客服 |
| tracking | 数据埋点 |
| legal_ui | 法务（协议、隐私） |
| promo | 达人福利 |
| announcement | 公告/邮件（含临时维护公告 getTempNotice，Unity SDK >= 1.6.28） |
| device | 设备信息与配置 |
| user_center | 帮助中心/客服会话 |
| ad | 广告（激励/Banner/插屏） |
| push | 推送 |
| version_check | 瑞雪版本检查 v2（Unity SDK >= 1.6.29） |
| review | 应用商店评分 |

---

## 10. 接入检查清单

### 依赖配置
- [ ] UPM 或 .unitypackage 安装完成
- [ ] 包名 com.ruixue.unitysdk 正确
- [ ] manifest.json 配置正确（如使用 UPM）

### 环境
- [ ] Unity 版本 >= 2019.4
- [ ] Android API Level >= 21（如有 Android 构建）
- [ ] iOS Target >= 11.0（如有 iOS 构建）

### SDK 初始化
- [ ] 配置 RXSdkInitConfig 参数（cpId、productId、channelId、baseUrlList）
- [ ] 在游戏启动时调用 RXSDK.Initialize()
- [ ] 初始化成功后再调用登录等功能

### 登录
- [ ] 根据需求选择 LoginMethod（游客/账号密码/验证码/第三方）
- [ ] 配置 LoginConfig 并调用 RXSDK.Login()

### 其他功能
- [ ] 按需接入支付、分享、社交、排行榜等
- [ ] 平台构建配置（Android/iOS）正确

---

## 11. 模板文件列表

MCP 服务器使用以下模板文件生成代码：

| 模板文件 | 功能分类 |
|----------|----------|
| init.tpl | SDK 初始化 |
| dependency.tpl | 依赖配置 |
| agent_example.tpl | 接入流程指南 |
| setup.tpl | 自动化接入 |
| login.tpl | 登录 |
| payment.tpl | 支付 |
| passport.tpl | 用户通行证 |
| captcha.tpl | 验证码 |
| real_auth.tpl | 实名认证 |
| account_binding.tpl | 账号绑定 |
| password.tpl | 密码管理 |
| deregister.tpl | 账号注销 |
| social.tpl | 社交关系 |
| friends.tpl | 好友管理 |
| lbs.tpl | 瑞雪 LBS 高德定位 |
| rank.tpl | 排行榜 |
| game_area.tpl | 游戏区服 |
| game_character.tpl | 游戏角色 |
| mumu.tpl | MuMu/Yofun Android 渠道 |
| share.tpl | 分享 |
| feedback.tpl | 反馈 |
| tracking.tpl | 数据埋点 |
| legal_ui.tpl | 法务 |
| promo.tpl | 达人福利 |
| announcement.tpl | 公告/邮件 |
| device.tpl | 设备信息 |
| user_center_ui.tpl | 帮助中心 |
| ad.tpl | 广告 |
| push.tpl | 推送 |
| version_check.tpl | 瑞雪版本检查 v2 |
| review.tpl | 应用商店评分 |

模板位置：`rxsdk-mcp/rxsdk-mcp-server/templates/unity/`
