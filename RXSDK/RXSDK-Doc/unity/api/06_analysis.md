# 数据分析

> **版本**：3.7.x  
> **更新日期**：2026-01-28
>
> 自定义埋点事件上报、公共属性管理

## 📋 接口概览

**入口类**：`RXSDK`（`namespace RuiXue`）

**主要功能**：

- 上报自定义埋点事件
- 设置 / 更新 / 删除公共属性（每次事件自动携带）

---

## 📊 埋点上报

### `DataTrack`

上报自定义埋点事件。

**方法签名**：

```csharp
void RXSDK.DataTrack(
    string eventName,
    string distinctId,
    Dictionary<string, object> properties,
    SdkCallback callback
)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `eventName` | `string` | 是 | 事件标识，如 `"cl_101001"`、`"level_complete"` |
| `distinctId` | `string` | 是 | 用户唯一标识，一般传登录后的 `open_id`；未登录时传空字符串 |
| `properties` | `Dictionary<string,object>` | 是 | 自定义属性，Value 支持 `string`、`int`、`float`、`bool` |
| `callback` | `SdkCallback` | 是 | 回调 |

**响应结构**：

成功时 `result.IsSuccess = true`，表示事件已上报（或进入上报队列）。

**示例用法**：

```csharp
// 上报关卡完成事件
var props = new Dictionary<string, object> {
    { "level",    10    },
    { "score",    9800  },
    { "duration", 120   },
    { "is_first", false },
};
RXSDK.DataTrack("level_complete", userOpenId, props, result => {
    if (!result) Debug.LogWarning("埋点上报失败: " + result.Error);
});

// 上报多个事件
RXSDK.DataTrack("cl_101001", "", new Dictionary<string, object> { { "test1", "value1" } }, _ => {});
RXSDK.DataTrack("cl_102001", "", new Dictionary<string, object> { { "test2", "value2" } }, _ => {});
```

---

## 🏷️ 公共属性

公共属性会自动附加到后续所有 `DataTrack` 调用中，适合设置用户 ID、服务器、版本等全局信息。

### `SetPublicProperties`

批量设置公共属性（覆盖同名旧值）。

**方法签名**：

```csharp
void RXSDK.SetPublicProperties(Dictionary<string, object> publicProperties)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `publicProperties` | `Dictionary<string,object>` | 是 | 公共属性键值对，Value 支持 `string`、`int`、`float`、`bool` |

**示例用法**：

```csharp
RXSDK.SetPublicProperties(new Dictionary<string, object> {
    { "user_id", "rxu123456" },
    { "server",  "S1"        },
    { "version", "1.0.0"     },
});
```

---

### `UpdatePublicProperties`

更新单个公共属性的值。

**方法签名**：

```csharp
void RXSDK.UpdatePublicProperties(string key, object value)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `key` | `string` | 是 | 属性名 |
| `value` | `object` | 是 | 新的属性值 |

**示例用法**：

```csharp
// 角色升级后更新等级
RXSDK.UpdatePublicProperties("role_level", 25);
```

---

### `DeletePublicProperties`

删除指定公共属性。

**方法签名**：

```csharp
void RXSDK.DeletePublicProperties(string key)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `key` | `string` | 是 | 要删除的属性名 |

**示例用法**：

```csharp
// 登出后清除用户信息
RXSDK.DeletePublicProperties("user_id");
RXSDK.DeletePublicProperties("role_level");
```

---

## 💡 使用建议

1. **登录成功后** 立即调用 `SetPublicProperties` 设置用户 ID、服务器等全局信息
2. **角色信息变更**（升级、换区服）时调用 `UpdatePublicProperties` 保持数据最新
3. **登出后** 调用 `DeletePublicProperties` 清除用户相关公共属性，避免污染下一个用户的数据
4. `distinctId` 建议传 `open_id`，未登录场景传空字符串（SDK 会使用设备 ID）

```csharp
// 完整使用流程示例
void OnLoginSuccess(string openId)
{
    // 1. 设置公共属性
    RXSDK.SetPublicProperties(new Dictionary<string, object> {
        { "user_id", openId },
        { "server",  GameManager.ServerId },
    });

    // 2. 上报登录事件
    RXSDK.DataTrack("user_login", openId, new Dictionary<string, object> {
        { "login_type", "guest" },
    }, _ => {});
}

void OnLogout()
{
    // 清除公共属性
    RXSDK.DeletePublicProperties("user_id");
    RXSDK.DeletePublicProperties("server");
}
```

---

## 🔗 相关文档

- [初始化与配置](./01_init.md)
- [分享](./04_share.md)
- [回调说明](./callback.md)
