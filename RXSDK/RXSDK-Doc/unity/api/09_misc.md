# 版本检查 / 法务 / 帮助中心 / 邮件 / 公告 / 福利码 / 其他

> **版本**：3.7.x  
> **更新日期**：2026-01-28

## 📋 接口概览

**入口类**：`RXSDK`（`namespace RuiXue`）

**回调约定**：所有异步接口统一使用 `SdkCallback`，回调自动切换至 **Unity 主线程**。

本文件涵盖以下模块：

- [版本检查](#-版本检查)
- [法务协议](#-法务协议)
- [帮助中心](#-帮助中心)
- [应用评价](#-应用评价)
- [自定义网络请求](#-自定义网络请求)
- [邮件](#-邮件)
- [公告](#-公告)
- [福利码](#-福利码)
- [其他](#-其他)

---

## 🔄 版本检查

### `UpdateApp`

检查产品包版本，返回热更新脚本数据（简化版）。

**方法签名**：

```csharp
void RXSDK.UpdateApp(string version, string region, string type, SdkCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `version` | `string` | 是 | 当前客户端版本号，3 段或 4 段，如 `"1.0.0"` |
| `region` | `string` | 是 | 地区码，如 `"0"`（默认）、`"220101"` |
| `type` | `string` | 是 | 脚本类型：`"u3d"`（Unity）、`"lua"`、`"json"` |
| `callback` | `SdkCallback` | 是 | 回调 |

**响应结构**：

成功时 `result.Data` 为热更新配置 JSON（以服务端实际返回为准）：

```json
{
    "version": "1.0.1",
    "url": "https://cdn.ruixue.com/hotfix/v1.0.1.zip",
    "force": false,
    "description": "修复若干 Bug"
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `version` | `string` | 最新版本号 |
| `url` | `string` | 更新包下载地址 |
| `force` | `bool` | 是否强制更新 |
| `description` | `string` | 更新说明 |

**示例用法**：

```csharp
RXSDK.UpdateApp("1.0.0", "0", "u3d", result => result.Match(
    ok:   data  => Debug.Log("版本检查结果: " + data),
    fail: error => Debug.LogError(error)
));
```

---

### `CheckUpdateApp`

检查产品包版本（详细版，支持游戏子包和活动包）。

**方法签名**：

```csharp
void RXSDK.CheckUpdateApp(
    string version,
    string region,
    string type,
    Dictionary<string, int> games,
    Dictionary<string, int> activities,
    SdkCallback callback
)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `version` | `string` | 是 | 主包版本号 |
| `region` | `string` | 是 | 地区码 |
| `type` | `string` | 是 | 脚本类型 |
| `games` | `Dictionary<string,int>` | 否 | 游戏子包版本映射，如 `{ "123": 123 }` |
| `activities` | `Dictionary<string,int>` | 否 | 活动包版本映射，如 `{ "activity_name": 1 }` |
| `callback` | `SdkCallback` | 是 | 回调 |

**示例用法**：

```csharp
var games = new Dictionary<string, int> { { "123", 123 } };
var activities = new Dictionary<string, int> { { "spring_festival", 1 } };
RXSDK.CheckUpdateApp("1.0.1", "0", "u3d", games, activities, OnVersionResult);
```

---

### `UpdateGame`

检查游戏子包版本。

**方法签名**：

```csharp
void RXSDK.UpdateGame(string gameId, string gameVersion, string gameCheckVersion, string type, SdkCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `gameId` | `string` | 是 | 游戏 ID |
| `gameVersion` | `string` | 是 | 当前客户端游戏版本号 |
| `gameCheckVersion` | `string` | 是 | 优先检查此版本，若不存在则返回最新版 |
| `type` | `string` | 是 | 脚本类型：`"u3d"`、`"lua"`、`"json"` |
| `callback` | `SdkCallback` | 是 | 回调 |

**示例用法**：

```csharp
RXSDK.UpdateGame("123", "1", "0", "u3d", OnVersionResult);
```

---

### `UpdateActivity`

检查活动包版本。

**方法签名**：

```csharp
void RXSDK.UpdateActivity(string activityShortname, string activityVersion, string activityCheckVersion, string type, SdkCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `activityShortname` | `string` | 是 | 活动别名，如 `"spring_festival"` |
| `activityVersion` | `string` | 是 | 当前客户端活动版本号 |
| `activityCheckVersion` | `string` | 是 | 优先检查此版本 |
| `type` | `string` | 是 | 脚本类型 |
| `callback` | `SdkCallback` | 是 | 回调 |

**示例用法**：

```csharp
RXSDK.UpdateActivity("spring_festival", "1", "0", "u3d", OnVersionResult);
```

---

## ⚖️ 法务协议

### `GetLegal`

获取法务配置（用户协议、隐私政策等协议列表）。

**方法签名**：

```csharp
void RXSDK.GetLegal(SdkCallback callback)
Task<SdkResult> RXSDK.GetLegalAsync()
```

**响应结构**：

成功时 `result.Data` 为 JSON 字符串，包含各协议内容或 URL（以服务端实际返回为准）：

```json
{
    "list": [
        {
            "key": "user_agreement",
            "title": "用户协议",
            "url": "https://docs.ruixue.com/user_agreement.html"
        },
        {
            "key": "privacy_policy",
            "title": "隐私政策",
            "url": "https://docs.ruixue.com/privacy.html"
        }
    ]
}
```

**示例用法**：

```csharp
var result = await RXSDK.GetLegalAsync();
if (result) Debug.Log("法务配置: " + result.Data);
```

---

## 🆘 帮助中心

### `HelperCenterUI`

展示帮助中心 UI（客服知识库）。

**方法签名**：

```csharp
void RXSDK.HelperCenterUI(Dictionary<string, object> dic, SdkCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `dic` | `Dictionary<string,object>` | 否 | 扩展参数，无特殊需求可传空字典 `new Dictionary<string, object>()` |
| `callback` | `SdkCallback` | 是 | UI 关闭后的回调 |

**响应结构**：成功时 `result.IsSuccess = true`，表示帮助中心 UI 已关闭。

**示例用法**：

```csharp
RXSDK.HelperCenterUI(new Dictionary<string, object>(), result => {
    Debug.Log("帮助中心已关闭");
});
```

---

### `ChatServiceUI`

打开客服会话 UI（人工客服聊天）。

**方法签名**：

```csharp
void RXSDK.ChatServiceUI(Dictionary<string, object> dic, SdkCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `dic` | `Dictionary<string,object>` | 否 | 扩展参数 |
| `callback` | `SdkCallback` | 是 | UI 关闭后的回调 |

**示例用法**：

```csharp
RXSDK.ChatServiceUI(new Dictionary<string, object>(), result => {
    Debug.Log("客服会话已关闭");
});
```

---

## ⭐ 应用评价

### `JumpToAppStore`

跳转到应用商店评价页。

**方法签名**：

```csharp
bool RXSDK.JumpToAppStore()
```

**返回值**：

| 类型 | 说明 |
|------|------|
| `bool` | `true` 跳转成功，`false` 不支持（如当前渠道无对应商店） |

**示例用法**：

```csharp
if (!RXSDK.JumpToAppStore())
    Debug.Log("当前渠道不支持跳转商店");
```

---

## 🌐 自定义网络请求

### `CreateRequest`

发起携带 SDK 登录态的自定义 HTTP 请求。

**方法签名**：

```csharp
void RXSDK.CreateRequest(
    string url,
    Dictionary<string, string> header,
    Dictionary<string, string> body,
    HttpMethod method,
    bool needLogin,
    SdkCallback callback
)

Task<SdkResult> RXSDK.CreateRequestAsync(
    string url,
    Dictionary<string, string> header,
    Dictionary<string, string> body,
    HttpMethod method,
    bool needLogin
)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `url` | `string` | 是 | 完整请求地址 |
| `header` | `Dictionary<string,string>` | 否 | 自定义请求头，传 `null` 表示无额外请求头 |
| `body` | `Dictionary<string,string>` | 否 | 请求体键值对，GET 请求传 `null` |
| `method` | `HttpMethod` | 是 | 请求方式：`HttpMethod.GET` 或 `HttpMethod.POST` |
| `needLogin` | `bool` | 是 | `true` 自动注入登录 Token，`false` 不注入 |
| `callback` | `SdkCallback` | 是 | 回调 |

**响应结构**：

成功时 `result.Data` 为服务端响应的原始 JSON 字符串。

**示例用法**：

```csharp
// POST 请求（携带登录态）
var body = new Dictionary<string, string> {
    { "level",    "10" },
    { "score",    "9800" },
};
RXSDK.CreateRequest(
    "https://api.example.com/game/data",
    null, body,
    HttpMethod.POST, true,
    result => result.Match(
        ok:   data  => Debug.Log("响应: " + data),
        fail: error => Debug.LogError(error)
    )
);

// async 写法
var result = await RXSDK.CreateRequestAsync(
    "https://api.example.com/user/info",
    null, null,
    HttpMethod.GET, true
);
```

---

## 📬 邮件

### `GetEmailList`

获取用户邮件列表。

**方法签名**：

```csharp
void RXSDK.GetEmailList(string userId, SdkCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `userId` | `string` | 是 | 用户 open_id |
| `callback` | `SdkCallback` | 是 | 回调 |

**响应结构**：成功时 `result.Data` 包含邮件列表 JSON。

---

### `GetEmailDetail`

获取邮件详情。

**方法签名**：

```csharp
void RXSDK.GetEmailDetail(string userId, int mailId, SdkCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `userId` | `string` | 是 | 用户 open_id |
| `mailId` | `int` | 是 | 邮件 ID |
| `callback` | `SdkCallback` | 是 | 回调 |

---

### `GetEmailAward`

领取邮件附件/奖励。

**方法签名**：

```csharp
void RXSDK.GetEmailAward(string userId, int type, int mailId, SdkCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `userId` | `string` | 是 | 用户 open_id |
| `type` | `int` | 是 | 邮件类型 |
| `mailId` | `int` | 是 | 邮件 ID |
| `callback` | `SdkCallback` | 是 | 回调 |

---

### `DeleteEmail`

删除邮件。

**方法签名**：

```csharp
void RXSDK.DeleteEmail(string userId, int type, int mailId, SdkCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `userId` | `string` | 是 | 用户 open_id |
| `type` | `int` | 是 | 邮件类型 |
| `mailId` | `int` | 是 | 邮件 ID |
| `callback` | `SdkCallback` | 是 | 回调 |

---

## 📣 公告

### `GetAnnouncement`

获取公告列表。

**方法签名**：

```csharp
void RXSDK.GetAnnouncement(int limit, SdkCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `limit` | `int` | 是 | 返回公告条数上限 |
| `callback` | `SdkCallback` | 是 | 回调 |

**响应结构**：

成功时 `result.Data` 为 JSON 字符串：

```json
{
    "list": [
        {
            "id": 1,
            "title": "春节活动开启",
            "content": "活动详情...",
            "link": "https://example.com/activity",
            "created_at": "2026-01-28T10:00:00Z"
        }
    ]
}
```

**示例用法**：

```csharp
RXSDK.GetAnnouncement(10, result => result.Match(
    ok:   data  => Debug.Log("公告: " + data),
    fail: error => Debug.LogError(error)
));
```

---

## 🎁 福利码

### `GetPromoDisplayKEY`

获取达人专属福利码（用于主播/达人游戏内展示）。

**方法签名**：

```csharp
void RXSDK.GetPromoDisplayKEY(bool authRefresh, SdkCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `authRefresh` | `bool` | 是 | `true` 自动刷新 Token 后再获取，`false` 直接获取 |
| `callback` | `SdkCallback` | 是 | 回调 |

**响应结构**：

成功时 `result.Data` 为 JSON 字符串，包含福利码信息：

```json
{
    "cdkey": "RXPROMO-ABC123",
    "expire_time": "2026-12-31T23:59:59Z"
}
```

---

### `ExchangePromoCDKEY`

兑换福利码（用户输入福利码兑换奖励）。

**方法签名**：

```csharp
void RXSDK.ExchangePromoCDKEY(string cdKey, SdkCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `cdKey` | `string` | 是 | 用户输入的福利码 |
| `callback` | `SdkCallback` | 是 | 回调 |

**响应结构**：

成功时 `result.IsSuccess = true`，奖励已发放到用户账号。

**示例用法**：

```csharp
RXSDK.ExchangePromoCDKEY("RXPROMO-ABC123", result => result.Match(
    ok:   _ => Debug.Log("兑换成功"),
    fail: e => Debug.LogError($"[{result.Code}] {e}")
));
```

---

## 🔮 其他

### `GetDeviceCode`

获取设备码（用于游客账号绑定等场景）。

**方法签名**：

```csharp
void RXSDK.GetDeviceCode(SdkCallback callback)
```

**响应结构**：

成功时 `result.Data` 为设备码字符串。

---

### `GetDistinctId`

获取客户端随机生成的 distinctId，可用于未登录前的埋点用户标识。

**方法签名**：

```csharp
void RXSDK.GetDistinctId(SdkCallback callback)
```

**响应结构**：

成功时 `result.Data` 为 distinctId 字符串。

---

### `ShowCaptchaVerifyUI`

展示图形验证码 UI（人机验证）。

**方法签名**：

```csharp
void RXSDK.ShowCaptchaVerifyUI(string appId, SdkCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `appId` | `string` | 是 | 验证码服务 AppID |
| `callback` | `SdkCallback` | 是 | 回调 |

**响应结构**：

成功时 `result.Data` 包含验证 Token，传给服务端校验。

---

### `CheckQuickAp`

查询当前用户是否支持免密支付。

**方法签名**：

```csharp
void RXSDK.CheckQuickAp(SdkCallback callback)
```

**响应结构**：

成功时 `result.Data` 包含是否支持免密支付的状态。

---

## 🔗 相关文档

- [初始化与配置](./01_init.md)
- [账号登录](./02_login.md)
- [意见反馈](./08_feedback.md)
- [回调说明](./callback.md)
- [错误码规范](../../common/specs/error_codes.md)
