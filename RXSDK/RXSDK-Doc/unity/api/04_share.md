# 分享

> **版本**：3.7.x  
> **更新日期**：2026-01-28
>
> 分享调度、发起分享、获取分享数据、短链接

## 📋 接口概览

**入口类**：`RXSDK`（`namespace RuiXue`）

**回调约定**：所有异步接口统一使用 `SdkCallback`，回调自动切换至 **Unity 主线程**。

**主要功能**：

- 分享调度初始化与上报
- 获取分享数据（埋点配置）
- 发起分享（微信、Facebook、LINE、抖音、系统分享等）
- 自定义数据分享
- 获取短链接

---

## 📤 分享调度

### `ShareSchedulingInit`

初始化分享调度，拉取指定埋点的分享策略。需在使用分享前调用。

**方法签名**：

```csharp
void RXSDK.ShareSchedulingInit(string[] funcs, SdkCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `funcs` | `string[]` | 是 | 埋点标识数组，如 `new[] { "maidian3", "sdk_chengjiu" }` |
| `callback` | `SdkCallback` | 是 | 回调 |

**响应结构**：

成功时 `result.IsSuccess = true`，分享调度配置已缓存，后续可直接调用 `GetShareScheduling`。

**示例用法**：

```csharp
RXSDK.ShareSchedulingInit(new[] { "maidian3", "sdk_chengjiu" }, result => result.Match(
    ok:   _ => Debug.Log("分享调度初始化完成"),
    fail: e => Debug.LogError("初始化失败: " + e)
));
```

---

### `GetShareScheduling`

获取分享调度信息（同步，从本地缓存读取，需先调用 `ShareSchedulingInit`）。

**方法签名**：

```csharp
string RXSDK.GetShareScheduling(string[] func)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `func` | `string[]` | 是 | 埋点标识数组 |

**返回值**：

| 类型 | 说明 |
|------|------|
| `string` | 调度信息 JSON 字符串，空字符串表示未初始化或无调度 |

---

### `ShareSchedulingReport`

上报分享/广告结果数据。

**方法签名**：

```csharp
void RXSDK.ShareSchedulingReport(
    string func,
    string platform,
    string region,
    bool scheduling_event,
    string scheduling_type,
    string transmits,
    Dictionary<string, object> properties,
    SdkCallback callback
)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `func` | `string` | 是 | 埋点标识，如 `"wake_game_honor_1"` |
| `platform` | `string` | 是 | 分享平台，如 `"wechat"`、`"facebook"` |
| `region` | `string` | 是 | 地区码，如 `"220101"` |
| `scheduling_event` | `bool` | 是 | 是否为调度事件 |
| `scheduling_type` | `string` | 是 | 调度类型，如 `"share"`、`"ad"` |
| `transmits` | `string` | 是 | 透传参数，传空字符串 `""` 表示无 |
| `properties` | `Dictionary<string,object>` | 是 | 自定义属性，无属性传空字典 |
| `callback` | `SdkCallback` | 是 | 回调 |

**响应结构**：成功时 `result.IsSuccess = true`。

**示例用法**：

```csharp
RXSDK.ShareSchedulingReport(
    "wake_game_honor_1", "wechat", "220101",
    true, "share", "",
    new Dictionary<string, object>(),
    result => result.Match(ok: _ => { }, fail: e => Debug.LogError(e))
);
```

---

## 🔗 获取分享数据

### `GetShareData`

获取分享埋点配置数据（分享链接、标题、图片等）。

**方法签名**：

```csharp
void RXSDK.GetShareData(RXShareConfig shareConfig, SdkCallback callback)
```

**参数说明（`RXShareConfig`）**：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `func` | `string` | 是 | 埋点标识 |
| `platform` | `string` | 是 | 分享平台：`"wechat"`、`"facebook"`、`"line"`、`"tiktok"`、`"zalo"`、`"system"`、`"messenger"` |
| `region` | `string` | 否 | 地区码 |
| `transmits` | `string` | 否 | 透传参数，分享完成后原样返回 |
| `protocol_ios` | `string` | 否 | iOS 唤醒游戏的 URL Scheme |
| `protocol_android` | `string` | 否 | Android 唤醒游戏的 URL Scheme |
| `use_scheme` | `string` | 否 | 是否使用游戏协议：`"0"` 不使用（直接跳商店），`"1"` 使用 |
| `read_cache` | `bool` | 否 | 是否读取本地缓存，默认 `false` |
| `auto_report` | `bool` | 否 | 是否自动上报分享行为，默认 `true` |
| `shareScene` | `int` | 否 | 分享场景：`0` 好友，`1` 朋友圈 |
| `useShortUrl` | `bool` | 否 | 是否将分享链接转为短链接，默认 `false` |
| `title` | `string` | 否 | 分享标题（覆盖服务端配置） |
| `desc` | `string` | 否 | 分享描述 |
| `imageUrl` | `string` | 否 | 分享图片 URL |
| `templateId` | `string` | 否 | 分享模板 ID（抖音需要） |
| `query` | `string` | 否 | 附加 query 参数（抖音需要） |
| `channel` | `string` | 否 | 渠道标识，如 `"invite"` |
| `ext` | `Dictionary<string,object>` | 否 | 自定义扩展参数 |
| `properties` | `Dictionary<string,object>` | 否 | 额外属性，用于数据分析 |

**响应结构**：

成功时 `result.Data` 为 JSON 字符串，包含服务端配置的分享信息：

```json
{
    "url": "https://share.ruixue.com/xxx",
    "short_url": "https://rx.cc/abc",
    "title": "来和我一起玩",
    "desc": "快来加入游戏",
    "image": "https://cdn.ruixue.com/share/xxx.png",
    "transmitargs": "透传数据原样返回"
}
```

**示例用法**：

```csharp
var shareConfig = new RXShareConfig {
    func        = "urltest",
    platform    = "wechat",
    useShortUrl = true,
    auto_report = true,
    shareScene  = 0,
    ext = new Dictionary<string, object> { { "invite_code", "ABC123" } },
};
RXSDK.GetShareData(shareConfig, result => result.Match(
    ok:   data  => Debug.Log("分享数据: " + data),
    fail: error => Debug.LogError("获取失败: " + error)
));
```

---

## 📲 发起分享

### `Share`

发起分享（拉起对应 APP 分享界面）。

**方法签名**：

```csharp
void RXSDK.Share(RXShareConfig shareConfig, SdkCallback callback)
```

**参数说明**：

与 `GetShareData` 的 `RXShareConfig` 完全一致，见上方参数说明表。

**响应结构**：

成功时 `result.IsSuccess = true`，表示分享操作已执行（用户是否真正完成分享取决于第三方 APP）。

**支持的分享平台（`platform` 字段）**：

| 值 | 平台 |
|----|------|
| `"wechat"` | 微信好友 / 朋友圈（由 `shareScene` 决定） |
| `"facebook"` | Facebook |
| `"messenger"` | Facebook Messenger |
| `"line"` | LINE |
| `"tiktok"` | TikTok |
| `"zalo"` | Zalo（越南） |
| `"system"` | 系统分享（调用系统原生分享菜单） |

**示例用法**：

```csharp
// 微信好友分享
var config = new RXShareConfig {
    func        = "sdk_chengjiu",
    platform    = "wechat",
    shareScene  = 0, // 好友
    auto_report = true,
    useShortUrl = true,
};
RXSDK.Share(config, result => result.Match(
    ok:   _ => Debug.Log("分享成功"),
    fail: e => Debug.LogError("分享失败: " + e)
));

// 微信朋友圈分享
config.shareScene = 1;

// 系统分享
RXSDK.Share(new RXShareConfig { func = "sdk_chengjiu", platform = "system" }, OnResult);

// Facebook 分享
RXSDK.Share(new RXShareConfig {
    func             = "sunurl",
    platform         = "facebook",
    protocol_android = "mygame://",
    read_cache       = true,
}, OnResult);
```

---

### `ShareCustom`

自定义数据分享（绕过服务端分享配置，直接指定分享内容）。

**方法签名**：

```csharp
void RXSDK.ShareCustom(RXCustomShareConfig shareConfig, SdkCallback callback)
```

**参数说明（`RXCustomShareConfig`）**：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `platform` | `string` | 是 | 分享平台，默认 `"wechat"` |
| `shareScene` | `int` | 是 | 分享场景：`0` 好友，`1` 朋友圈 |
| `material_type` | `string` | 是 | 素材类型：`"text"`、`"image"`、`"link"`、`"miniprogram"` |
| `title` | `string` | 否 | 标题 |
| `content` | `string` | 否 | 内容/描述 |
| `image` | `string` | 否 | 图片 URL 或本地路径 |
| `url` | `string` | 否 | 链接地址（`material_type = "link"` 时使用） |
| `appid` | `string` | 否 | 微信小程序 AppID（`material_type = "miniprogram"` 时使用） |
| `openId` | `string` | 否 | 微信 OpenID |
| `username` | `string` | 否 | 微信小程序原始 ID |
| `path` | `string` | 否 | 小程序页面路径，默认 `""` |
| `withShareTicket` | `bool` | 否 | 是否带 ShareTicket，默认 `true` |
| `show_content_in_circle` | `bool` | 否 | 朋友圈是否显示内容，默认 `false` |
| `use_scheme` | `string` | 否 | 是否使用游戏协议 |
| `protocol_ios` | `string` | 否 | iOS 唤醒协议 |
| `protocol_android` | `string` | 否 | Android 唤醒协议 |
| `extData` | `string` | 否 | 扩展数据 |
| `x` | `int` | 否 | 图片裁剪 X 坐标 |
| `y` | `int` | 否 | 图片裁剪 Y 坐标 |
| `width` | `int` | 否 | 图片裁剪宽度 |
| `height` | `int` | 否 | 图片裁剪高度 |

**响应结构**：成功时 `result.IsSuccess = true`。

**示例用法**：

```csharp
// 微信自定义文字分享
var config = new RXCustomShareConfig {
    platform      = "wechat",
    material_type = "text",
    content       = "来和我一起玩！",
    shareScene    = 0,
};
RXSDK.ShareCustom(config, OnResult);

// 微信小程序分享
var mpConfig = new RXCustomShareConfig {
    platform      = "wechat",
    material_type = "miniprogram",
    appid         = "wx8755e7b80be19d33",
    title         = "分享标题",
    shareScene    = 0,
};
RXSDK.ShareCustom(mpConfig, OnResult);
```

---

## 🔗 短链接

### `GetShortUrl`

将原始 URL 转换为短链接。

**方法签名**：

```csharp
// 重载 1：字符串 URL
void RXSDK.GetShortUrl(string url, SdkCallback callback)

// 重载 2：字典参数（附带分享素材）
void RXSDK.GetShortUrl(Dictionary<string, object> dic, SdkCallback callback)
```

**参数说明（重载 2 `dic`）**：

| Key | 类型 | 必填 | 说明 |
|-----|------|------|------|
| `url` | `string` | 是 | 原始 URL |
| `title` | `string` | 否 | 分享标题 |
| `content` | `string` | 否 | 分享内容 |
| `image` | `string` | 否 | 分享图片 URL |
| `ext` | `Dictionary<string,object>` | 否 | 扩展参数 |

**响应结构**：

成功时 `result.Data` 为 JSON 字符串：

```json
{
    "short_url": "https://rx.cc/AbCd12"
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `short_url` | `string` | 生成的短链接地址 |

**示例用法**：

```csharp
// 简单 URL 转短链
RXSDK.GetShortUrl("https://example.com/invite?code=ABC", result => result.Match(
    ok:   data  => Debug.Log("短链: " + data),
    fail: error => Debug.LogError(error)
));

// 带分享素材
var dic = new Dictionary<string, object> {
    { "url",     "https://example.com/invite" },
    { "title",   "快来加入游戏" },
    { "content", "我在游戏里等你！" },
    { "image",   "https://cdn.example.com/share.png" },
    { "ext",     new Dictionary<string, object> { { "invite_code", "ABC123" } } },
};
RXSDK.GetShortUrl(dic, OnResult);
```

---

## 🔗 相关文档

- [账号登录](./02_login.md)
- [数据分析](./06_analysis.md)
- [回调说明](./callback.md)
