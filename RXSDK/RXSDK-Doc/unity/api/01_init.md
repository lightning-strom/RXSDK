# 初始化与配置

> **版本**：3.7.x  
> **更新日期**：2026-01-28
>
> SDK 初始化、全局配置、全局回调接口定义

## 📋 接口概览

**入口类**：`RXSDK`（`namespace RuiXue`）

**回调约定**：所有异步接口统一使用 `SdkCallback`，回调自动切换至 **Unity 主线程**。

**主要功能**：

- SDK 初始化
- 日志、语言、地区、密码等全局配置
- 防沉迷监听
- 隐私协议
- 全局事件回调设置
- 退出 APP

---

## 🔧 初始化

### `Initialize`

SDK 初始化，必须在所有接口调用前完成。

**方法签名**：

```csharp
// 重载 1：配置对象（推荐）
void RXSDK.Initialize(RXSdkInitConfig config, SdkCallback callback)

// 重载 2：分离参数
void RXSDK.Initialize(string cpid, string productid, string channelid, List<string> urls, SdkCallback callback)

// 重载 3：async
Task<SdkResult> RXSDK.InitializeAsync(RXSdkInitConfig config)

// 重载 4：async + 超时
Task<SdkResult> RXSDK.InitializeAsync(RXSdkInitConfig config, int timeoutMs)
```

**参数说明（`RXSdkInitConfig`）**：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `cpId` | `string` | 是 | CP 唯一 ID，7 位数字（如 `"1000001"`） |
| `productId` | `string` | 是 | 应用 ID，由瑞雪后台创建 |
| `channelId` | `string` | 是 | 渠道 ID（如 `"weile"`、`"huawei"`） |
| `baseUrlList` | `List<string>` | 是 | 服务域名列表，格式 `https://domain.com/`，支持多个备用域名 |
| `isLogEnable` | `bool` | 否 | 是否开启日志，默认 `true`，正式包建议关闭 |
| `usePrivacy` | `bool` | 否 | 首次启动是否展示隐私授权弹窗，默认 `false` |
| `agreementTitle` | `string` | 否 | 隐私弹窗标题，默认 `"用户协议和隐私政策"` |
| `isUseDNS` | `bool` | 否 | 是否开启 DNS 优化，默认 `false` |
| `agreementMap` | `Dictionary<string,object>` | 否 | 自定义协议键值对 |

**响应结构**：

成功时 `result.IsSuccess = true`，`result.Data` 内容通常无需读取。

**示例用法**：

```csharp
var config = new RXSdkInitConfig
{
    cpId        = "1000001",
    productId   = "your_product_id",
    channelId   = "weile",
    baseUrlList = new List<string> { "https://api.example.com/" },
    usePrivacy  = true,
    isLogEnable = Debug.isDebugBuild,
};

RXSDK.Initialize(config, result => result.Match(
    ok:   _ => Debug.Log("初始化成功"),
    fail: e => Debug.LogError("初始化失败: " + e)
));

// async + 超时
var result = await RXSDK.InitializeAsync(config, timeoutMs: 10_000);
if (!result) { Debug.LogError("初始化超时"); return; }
```

---

## ⚙️ 全局配置

### `SetLogEnable`

开关日志输出，建议在 `Initialize` 前调用。

**方法签名**：

```csharp
void RXSDK.SetLogEnable(bool enabled)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `enabled` | `bool` | 是 | `true` 开启，`false` 关闭；正式包建议关闭 |

---

### `SetSubChannelId`

设置子渠道 ID（用于渠道细分统计）。

**方法签名**：

```csharp
void RXSDK.SetSubChannelId(string subChannelId)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `subChannelId` | `string` | 是 | 子渠道标识 |

---

### `SetLanguage`

设置 SDK UI 显示语言。

**方法签名**：

```csharp
void RXSDK.SetLanguage(string language)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `language` | `string` | 是 | 语言代码，如 `"zh-CN"`、`"en-US"`、`"zh-TW"` |

---

### `SetArea`

设置地区，影响合规行为（如防沉迷）。

**方法签名**：

```csharp
void RXSDK.SetArea(string area)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `area` | `string` | 是 | 地区代码 |

---

### `SetScreenCaptureDisable`

禁止系统截屏（Android 有效）。

**方法签名**：

```csharp
void RXSDK.SetScreenCaptureDisable(bool disable)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `disable` | `bool` | 是 | `true` 禁止截屏，`false` 允许 |

---

### `SetPasswordStrength`

设置密码强度等级。

**方法签名**：

```csharp
void RXSDK.SetPasswordStrength(RXPasswordStrength type)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `type` | `RXPasswordStrength` | 是 | 强度等级，见下表 |

**`RXPasswordStrength` 枚举**：

| 值 | 说明 |
|----|------|
| `Default` (0) | 默认，6-32 位任意字符 |
| `Custom` (1) | 自定义正则，配合 `SetPwdPattern` 使用 |
| `Average` (2) | 简易，6-32 位任意字符 |
| `Strong` (3) | 强密码，6-32 位，须含数字 + 字母 + 特殊符号 |

---

### `SetPwdPattern`

设置自定义密码正则，需先调用 `SetPasswordStrength(RXPasswordStrength.Custom)`。

**方法签名**：

```csharp
void RXSDK.SetPwdPattern(string pattern)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `pattern` | `string` | 是 | 正则表达式字符串 |

---

### `DisableReadSensitiveInfo`

关闭敏感信息采集（GDPR 场景）。

**方法签名**：

```csharp
void RXSDK.DisableReadSensitiveInfo(bool disabled)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `disabled` | `bool` | 是 | `true` 关闭采集（GDPR），`false` 正常采集 |

---

### `ConfigErrorMsg`

自定义 SDK 错误提示文案。

**方法签名**：

```csharp
void RXSDK.ConfigErrorMsg(Dictionary<string, object> errorMsgMap)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `errorMsgMap` | `Dictionary<string,object>` | 是 | 错误码与自定义文案的映射，Key 为错误码字符串，Value 为显示文案 |

---

### `LoginOpenidExpireInvalid`

检查 `login_openid` 是否已失效（用于 Token 续期场景）。

**方法签名**：

```csharp
bool RXSDK.LoginOpenidExpireInvalid()
```

**返回值**：

| 类型 | 说明 |
|------|------|
| `bool` | `true` 表示已失效，需重新登录 |

---

### `InitThirdSdk`

初始化第三方 SDK（微信、百度、抖音、快手、YSDK、Google、Facebook 等）。需在 `Initialize` 成功后调用。

**方法签名**：

```csharp
void RXSDK.InitThirdSdk(Dictionary<string, object> map, SdkCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `map` | `Dictionary<string,object>` | 是 | 各第三方 SDK Key，见下表 |
| `callback` | `SdkCallback` | 是 | 初始化回调 |

**`map` 各平台 Key**：

| Key | 类型 | 说明 |
|-----|------|------|
| `clientId` | `string` | Google OAuth2 ClientID |
| `line_channel_id` | `string` | LINE Channel ID |
| `reddit_clientid` | `string` | Reddit ClientID |
| `reddit_redirecturi` | `string` | Reddit 授权回调地址 |
| `appSecret` | `string` | OPPO AppSecret |
| `server_id` | `string` | B 站服务器 ID |
| `server_name` | `string` | B 站服务器名称 |
| `merchant_id` | `string` | B 站商户 ID |
| `appkey` | `string` | B 站 / 4399 AppKey |
| `ld_app_key` | `string` | 雷电 AppKey |
| `honor_appid` | `string` | 荣耀 AppID |
| `honor_cpid` | `string` | 荣耀 CP ID |
| `client_id` | `string` | 百度 / 其他平台 Client ID |

**响应结构**：

成功时 `result.IsSuccess = true`，`result.Data` 内容通常无需读取。

**示例用法**：

```csharp
var map = new Dictionary<string, object>
{
    { "clientId",   "your-google-client-id.apps.googleusercontent.com" },
    { "line_channel_id", "1660717706" },
    { "appSecret",  "your-oppo-secret" },
};
RXSDK.InitThirdSdk(map, result => result.Match(
    ok:   _ => Debug.Log("第三方 SDK 初始化完成"),
    fail: e => Debug.LogWarning("第三方 SDK 初始化失败: " + e)
));
```

---

## 🔒 隐私协议

### `IsAgreedPrivacy`

查询用户是否已同意隐私协议。

**方法签名**：

```csharp
bool RXSDK.IsAgreedPrivacy()
```

**返回值**：

| 类型 | 说明 |
|------|------|
| `bool` | `true` 已同意，`false` 未同意 |

---

### `SetPrivacyAgree`

通知 SDK 用户已同意隐私协议。

**方法签名**：

```csharp
void RXSDK.SetPrivacyAgree(PrivacyCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `callback` | `PrivacyCallback` | 是 | 隐私协议弹窗结果回调，`bool agreed` 表示用户是否点击同意 |

**示例用法**：

```csharp
if (!RXSDK.IsAgreedPrivacy())
{
    RXSDK.SetPrivacyAgree(agreed => {
        if (agreed) Debug.Log("用户已同意隐私协议");
        else Debug.Log("用户拒绝");
    });
}
```

---

## 🛡️ 防沉迷

### `SetupAddictDelegate`

设置防沉迷监听，在 `Initialize` 前调用。

**方法签名**：

```csharp
void RXSDK.SetupAddictDelegate(IAntiAddictDelegate addictDelegate)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `addictDelegate` | `IAntiAddictDelegate` | 是 | 防沉迷回调实现，见下方接口定义 |

**`IAntiAddictDelegate` 接口**：

```csharp
public interface IAntiAddictDelegate
{
    // 返回当前用户是否在游戏中（防沉迷系统用于判断状态）
    bool IsGaming();

    // 防沉迷状态变化通知，json 为状态详情
    void AddictInfoUpdate(string json);

    // 是否使用 CP 自定义防沉迷 UI
    // 返回 true：游戏自行处理弹窗；返回 false：使用 SDK 默认 UI
    bool EnableCustomUI();
}
```

**示例用法**：

```csharp
public class AntiAddictHandler : IAntiAddictDelegate
{
    public bool IsGaming() => GameManager.IsInGame;

    public void AddictInfoUpdate(string json)
    {
        // 解析防沉迷状态，展示提示
        Debug.Log("防沉迷状态: " + json);
    }

    public bool EnableCustomUI() => false; // 使用 SDK 默认 UI
}

// 在 Initialize 前调用
RXSDK.SetupAddictDelegate(new AntiAddictHandler());
```

---

## 🔔 全局回调

### `SetSdkCallback`

设置全局 SDK 事件回调（登录态变化、被动登出、切换账号）。

**方法签名**：

```csharp
void RXSDK.SetSdkCallback(
    EventCallback         onEvent,
    Action<int, string>   onLogout,
    SwitchAccountCallback onSwitchAccount
)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `onEvent` | `EventCallback` | 是 | 全局事件回调 `(int type, string json)`，`type` 为事件类型，`json` 为事件数据 |
| `onLogout` | `Action<int, string>` | 是 | 被动登出回调 `(int code, string msg)`，触发后需引导用户重新登录 |
| `onSwitchAccount` | `SwitchAccountCallback` | 是 | 切换账号请求回调 `(int code, string data) => bool`，返回 `true` 接受切换，`false` 拒绝 |

**示例用法**：

```csharp
RXSDK.SetSdkCallback(
    onEvent: (type, json) => Debug.Log($"SDK 事件 type={type}: {json}"),
    onLogout: (code, msg) => {
        Debug.LogWarning($"被动登出 [{code}]: {msg}");
        SceneManager.LoadScene("LoginScene");
    },
    onSwitchAccount: (code, data) => {
        Debug.Log($"切换账号请求 [{code}]");
        return true; // 接受切换
    }
);
```

---

### `ExitApp`

弹出退出确认框，由用户决定是否退出。

**方法签名**：

```csharp
void RXSDK.ExitApp(ExitCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `callback` | `ExitCallback` | 是 | 退出回调 `(bool confirmed, string data)`：<br>- `confirmed = true`：用户确认退出<br>- `confirmed = false`：用户取消 |

**示例用法**：

```csharp
RXSDK.ExitApp((confirmed, data) => {
    if (confirmed) Application.Quit();
});
```

---

## 🔗 相关文档

- [回调说明](./callback.md)
- [账号登录](./02_login.md)
- [错误码规范](../../common/specs/error_codes.md)
