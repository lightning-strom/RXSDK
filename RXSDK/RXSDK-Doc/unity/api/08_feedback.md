# 意见反馈

> **版本**：3.7.x  
> **更新日期**：2026-01-28
>
> 用户意见反馈提交、满意度评价、日志上报

## 📋 接口概览

**入口类**：`RXSDK`（`namespace RuiXue`）

**回调约定**：所有异步接口统一使用 `SdkCallback`，回调自动切换至 **Unity 主线程**。

**主要功能**：

- 获取反馈类型列表
- 提交用户反馈
- 满意度评价
- 上报日志文件
- 底层反馈接口（查询、详情、道具领取）

---

## 💬 高层反馈接口

### `GetFeedbackKindList`

获取反馈类型列表（如"账号问题"、"支付问题"等）。

**方法签名**：

```csharp
void RXSDK.GetFeedbackKindList(SdkCallback callback)
```

**响应结构**：

成功时 `result.Data` 为 JSON 字符串：

```json
{
    "list": [
        {
            "kind_id": 1,
            "kind_name": "账号问题"
        },
        {
            "kind_id": 2,
            "kind_name": "支付问题"
        }
    ]
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `kind_id` | `int` | 反馈类型 ID |
| `kind_name` | `string` | 反馈类型名称 |

**示例用法**：

```csharp
RXSDK.GetFeedbackKindList(result => result.Match(
    ok:   data  => Debug.Log("反馈类型: " + data),
    fail: error => Debug.LogError(error)
));
```

---

### `CreateFeedback`

提交用户反馈。

**方法签名**：

```csharp
void RXSDK.CreateFeedback(Dictionary<string, object> dic, SdkCallback callback)
```

**参数说明**：

| Key | 类型 | 必填 | 说明 |
|-----|------|------|------|
| `game_id` | `int` | 是 | 游戏 ID |
| `kind_id` | `int` | 是 | 反馈类型 ID（从 `GetFeedbackKindList` 获取） |
| `kind_name` | `string` | 是 | 反馈类型名称 |
| `priority` | `int` | 否 | 优先级：`1` 普通，`2` 紧急 |
| `content` | `string` | 是 | 反馈内容文字 |
| `picture` | `string` | 否 | 截图 URL 地址 |
| `player_gameid` | `string` | 否 | 玩家游戏内 ID |
| `send_voided_mails` | `int` | 否 | 是否发送废弃邮件：`1` 是，`0` 否 |

**响应结构**：

成功时 `result.IsSuccess = true`，表示反馈已提交。

**示例用法**：

```csharp
var dic = new Dictionary<string, object> {
    { "game_id",         100              },
    { "kind_id",         1                },
    { "kind_name",       "账号问题"        },
    { "priority",        1                },
    { "content",         "无法登录游戏"    },
    { "picture",         screenshotUrl    },
    { "player_gameid",   "role_123"       },
};
RXSDK.CreateFeedback(dic, result => result.Match(
    ok:   _ => Debug.Log("反馈已提交"),
    fail: e => Debug.LogError("提交失败: " + e)
));
```

---

### `SatisfactionEvaluation`

提交满意度评价。

**方法签名**：

```csharp
void RXSDK.SatisfactionEvaluation(Dictionary<string, object> dic, SdkCallback callback)
```

**参数说明**：

| Key | 类型 | 必填 | 说明 |
|-----|------|------|------|
| `key_number` | `int` | 是 | 客服工单 ID |
| `pleased_status` | `int` | 是 | 满意度：`1` 满意，`2` 不满意，`3` 一般 |
| `reason` | `string` | 否 | 评价原因说明 |

**响应结构**：

成功时 `result.IsSuccess = true`。

**示例用法**：

```csharp
var dic = new Dictionary<string, object> {
    { "key_number",     10     },
    { "pleased_status", 1      },
    { "reason",         "解决得很快" },
};
RXSDK.SatisfactionEvaluation(dic, result => result.Match(
    ok:   _ => Debug.Log("评价已提交"),
    fail: e => Debug.LogError(e)
));
```

---

### `ReportFeedbackLog`

上报反馈日志文件（用于技术排查）。

**方法签名**：

```csharp
void RXSDK.ReportFeedbackLog(byte[] data, SdkCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `data` | `byte[]` | 是 | 日志文件的字节数组 |
| `callback` | `SdkCallback` | 是 | 回调 |

**响应结构**：

成功时 `result.IsSuccess = true`。

**示例用法**：

```csharp
// 读取本地日志文件并上报
byte[] logData = File.ReadAllBytes(Application.persistentDataPath + "/game.log");
RXSDK.ReportFeedbackLog(logData, result => result.Match(
    ok:   _ => Debug.Log("日志已上报"),
    fail: e => Debug.LogError("上报失败: " + e)
));
```

---

## 🔧 底层反馈接口

以下接口为底层直接调用，通常通过高层接口（如 `CreateFeedback`）间接使用。

### `FeedbackCreate`

创建反馈（底层接口）。

**方法签名**：

```csharp
void RXSDK.FeedbackCreate(string content, string[] attachments, string phone, string[] tags, SdkCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `content` | `string` | 是 | 反馈内容 |
| `attachments` | `string[]` | 否 | 附件 URL 数组 |
| `phone` | `string` | 否 | 联系手机号 |
| `tags` | `string[]` | 否 | 标签数组 |
| `callback` | `SdkCallback` | 是 | 回调 |

---

### `GetFeedbackList`

获取反馈列表（底层接口）。

**方法签名**：

```csharp
void RXSDK.GetFeedbackList(int page, int size, int status, SdkCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `page` | `int` | 是 | 页码，从 `1` 开始 |
| `size` | `int` | 是 | 每页条数 |
| `status` | `int` | 是 | 过滤状态：`0` 全部，`1` 待处理，`2` 已处理 |
| `callback` | `SdkCallback` | 是 | 回调 |

---

### `GetFeedbackDetail`

获取反馈详情（底层接口）。

**方法签名**：

```csharp
void RXSDK.GetFeedbackDetail(int id, SdkCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | `int` | 是 | 反馈 ID |
| `callback` | `SdkCallback` | 是 | 回调 |

---

### `FeedbackGetprop`

领取反馈道具奖励（底层接口）。

**方法签名**：

```csharp
void RXSDK.FeedbackGetprop(int id, SdkCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | `int` | 是 | 反馈 ID |
| `callback` | `SdkCallback` | 是 | 回调 |

---

## 🔗 相关文档

- [帮助中心](./09_misc.md#-帮助中心)
- [回调说明](./callback.md)
