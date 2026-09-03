# 广告 / 推送

> **版本**：3.7.x  
> **更新日期**：2026-01-28
>
> 广告展示（激励视频、Banner、插屏）、推送通知管理

## 📋 接口概览

**入口类**：`RXSDK`（`namespace RuiXue`）

**回调约定**：所有异步接口统一使用 `SdkCallback`，回调自动切换至 **Unity 主线程**。

**主要功能**：

- 展示广告（激励视频、Banner、插屏）
- 推送初始化、注册/反注册 Token
- 推送别名绑定（定向推送）

---

## 📢 广告

### `RewardedVideoAd`

展示激励视频广告（用户看完视频后发放奖励）。

**方法签名**：

```csharp
void RXSDK.RewardedVideoAd(string adUnitId, bool isCheck, SdkCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `adUnitId` | `string` | 是 | 广告位 ID，从瑞雪后台获取，如 `"74o0968j3n53wnrla9"` |
| `isCheck` | `bool` | 是 | 是否启用服务端校验：`true` 服务端回调确认后发奖，`false` 客户端直接发奖 |
| `callback` | `SdkCallback` | 是 | 回调 |

**响应结构**：

成功时 `result.IsSuccess = true`，表示用户已完整观看广告。

> ⚠️ **发奖建议**：`isCheck = true` 时，须等待服务端回调后再发奖，不可直接在客户端回调中发奖。

**示例用法**：

```csharp
RXSDK.RewardedVideoAd("74o0968j3n53wnrla9", false, result => result.Match(
    ok:   _ => {
        Debug.Log("广告观看完成");
        GiveReward(); // isCheck = false 时可在此发奖
    },
    fail: error => Debug.LogWarning($"广告失败 [{result.Code}]: {error}")
));
```

---

### `BannerAd`

展示 Banner 广告（展示于指定位置的横幅广告）。

**方法签名**：

```csharp
void RXSDK.BannerAd(string adUnitId, Rect pos, float adIntervals, bool isCheck, SdkCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `adUnitId` | `string` | 是 | 广告位 ID |
| `pos` | `Rect` | 是 | 广告位置（屏幕坐标），如 `new Rect(0, 0, Screen.width, 100)` |
| `adIntervals` | `float` | 是 | 广告刷新间隔，单位：秒，`0` 表示不自动刷新 |
| `isCheck` | `bool` | 是 | 是否服务端校验 |
| `callback` | `SdkCallback` | 是 | 回调（Banner 展示状态或点击事件） |

**响应结构**：

成功时 `result.IsSuccess = true`，表示 Banner 已成功展示。

**示例用法**：

```csharp
// 在屏幕顶部展示 Banner，每 30 秒刷新一次
var pos = new Rect(0, 0, Screen.width, 100);
RXSDK.BannerAd("your_banner_unit_id", pos, 30f, false, result => result.Match(
    ok:   _ => Debug.Log("Banner 已展示"),
    fail: e => Debug.LogWarning("Banner 失败: " + e)
));
```

---

### `InterstitialAd`

展示插屏广告（全屏展示的广告，可关闭）。

**方法签名**：

```csharp
void RXSDK.InterstitialAd(string adUnitId, bool isCheck, SdkCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `adUnitId` | `string` | 是 | 广告位 ID |
| `isCheck` | `bool` | 是 | 是否服务端校验 |
| `callback` | `SdkCallback` | 是 | 回调 |

**响应结构**：

成功时 `result.IsSuccess = true`，表示插屏广告已展示并关闭。

**示例用法**：

```csharp
RXSDK.InterstitialAd("your_interstitial_unit_id", false, result => result.Match(
    ok:   _ => Debug.Log("插屏广告已关闭"),
    fail: e => Debug.LogWarning("插屏广告失败: " + e)
));
```

---

## 🔔 推送

### `PushInit`

初始化推送服务。

**方法签名**：

```csharp
// 重载 1：使用 SDK 初始化参数（推荐）
void RXSDK.PushInit()

// 重载 2：手动指定参数
void RXSDK.PushInit(string productId, string channelId, string cpid, List<string> urls)
```

**参数说明（重载 2）**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `productId` | `string` | 是 | 应用 ID |
| `channelId` | `string` | 是 | 渠道 ID |
| `cpid` | `string` | 是 | CP ID |
| `urls` | `List<string>` | 是 | 服务域名列表 |

**示例用法**：

```csharp
// 在 SDK 初始化成功后调用
RXSDK.PushInit();
```

---

### `PushRegisterToken`

向推送服务注册设备 Token（允许接收推送）。

**方法签名**：

```csharp
void RXSDK.PushRegisterToken()
```

**示例用法**：

```csharp
// 登录成功后注册推送
void OnLoginSuccess()
{
    RXSDK.PushRegisterToken();
}
```

---

### `PushUnRegisterToken`

反注册推送 Token（取消接收推送）。

**方法签名**：

```csharp
void RXSDK.PushUnRegisterToken()
```

**示例用法**：

```csharp
// 用户关闭推送通知时调用
RXSDK.PushUnRegisterToken();
```

---

### `PushGetDeviceToken`

获取当前设备的推送 Token。

**方法签名**：

```csharp
string RXSDK.PushGetDeviceToken()
```

**返回值**：

| 类型 | 说明 |
|------|------|
| `string` | 设备推送 Token，未注册时返回空字符串 |

**示例用法**：

```csharp
var token = RXSDK.PushGetDeviceToken();
Debug.Log("推送 Token: " + token);
```

---

### `PushIsSupport`

检查当前设备是否支持推送。

**方法签名**：

```csharp
bool RXSDK.PushIsSupport()
```

**返回值**：

| 类型 | 说明 |
|------|------|
| `bool` | `true` 支持，`false` 不支持 |

---

### `PushGetBrandName`

获取当前设备的推送厂商名称。

**方法签名**：

```csharp
string RXSDK.PushGetBrandName()
```

**返回值**：

| 类型 | 说明 |
|------|------|
| `string` | 厂商名称，如 `"huawei"`、`"xiaomi"`、`"oppo"`、`"vivo"`、`"honor"`、`"fcm"`（Firebase） |

**示例用法**：

```csharp
Debug.Log("推送厂商: " + RXSDK.PushGetBrandName());
```

---

### `PushBindAlias`

绑定推送别名（用于按别名定向推送，如按用户 ID 推送）。

**方法签名**：

```csharp
void RXSDK.PushBindAlias(string alias)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `alias` | `string` | 是 | 别名字符串，如用户 open_id、游戏角色 ID |

**示例用法**：

```csharp
// 登录后绑定用户别名
RXSDK.PushBindAlias(userOpenId);
```

---

### `PushUnBindAlias`

解绑推送别名。

**方法签名**：

```csharp
void RXSDK.PushUnBindAlias(string alias)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `alias` | `string` | 是 | 要解绑的别名 |

**示例用法**：

```csharp
// 登出后解绑别名
RXSDK.PushUnBindAlias(userOpenId);
```

---

## 💡 推送使用建议

```csharp
// 推荐的推送初始化流程
void OnSDKReady()
{
    if (RXSDK.PushIsSupport())
    {
        RXSDK.PushInit();
        Debug.Log("推送厂商: " + RXSDK.PushGetBrandName());
    }
}

void OnLoginSuccess(string openId)
{
    RXSDK.PushRegisterToken();
    RXSDK.PushBindAlias(openId); // 绑定用户 ID 以便精准推送
}

void OnLogout(string openId)
{
    RXSDK.PushUnBindAlias(openId);
    // 可选：取消注册，用户登出后不再接收推送
    // RXSDK.PushUnRegisterToken();
}
```

---

## 🔗 相关文档

- [初始化与配置](./01_init.md)
- [账号登录](./02_login.md)
- [回调说明](./callback.md)
