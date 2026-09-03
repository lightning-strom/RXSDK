# 社交 / 关系 / 排行榜

> **版本**：3.7.x  
> **更新日期**：2026-01-28
>
> LBS 位置服务、用户自定义信息、关系管理、好友、排行榜

## 📋 接口概览

**入口类**：`RXSDK`（`namespace RuiXue`）

**回调约定**：所有异步接口统一使用 `SdkCallback`，回调自动切换至 **Unity 主线程**。

**主要功能**：

- LBS 附近的人（获取、上报、删除坐标）
- 用户自定义信息设置
- 自定义关系管理（添加、删除、查询）
- 好友关系管理
- 排行榜（增加/设置分数、查询排名、好友排名）

---

## 📍 LBS 位置服务

### `LbsRadius`

获取附近的用户列表。

**方法签名**：

```csharp
void RXSDK.LbsRadius(
    string type,
    float lon,
    float lat,
    float radius,
    int count,
    int page,
    int page_size,
    SdkCallback callback
)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `type` | `string` | 是 | 查询类型，如 `"friend"`（好友范围）、`"all"` |
| `lon` | `float` | 是 | 经度（WGS84 坐标系） |
| `lat` | `float` | 是 | 纬度 |
| `radius` | `float` | 是 | 查询半径，单位：米 |
| `count` | `int` | 是 | 返回总数限制 |
| `page` | `int` | 是 | 当前页码，从 `1` 开始 |
| `page_size` | `int` | 是 | 每页条数 |
| `callback` | `SdkCallback` | 是 | 回调 |

**响应结构**：

成功时 `result.Data` 为 JSON 字符串，包含附近用户列表（以服务端实际返回为准）：

```json
{
    "total": 10,
    "list": [
        {
            "open_id": "rxuNZP3GnkxYVXMf2xW6UZEKdg0z7wLm",
            "nickname": "玩家A",
            "avatar": "https://cdn.ruixue.com/avatar/xxx.png",
            "distance": 500.0
        }
    ]
}
```

**示例用法**：

```csharp
RXSDK.LbsRadius("friend", 118.196f, 24.483f, 1000f, 10, 1, 10, result => result.Match(
    ok:   data  => Debug.Log("附近用户: " + data),
    fail: error => Debug.LogError("查询失败: " + error)
));
```

---

### `LbsUpdate`

上报/更新当前用户经纬度坐标。

**方法签名**：

```csharp
void RXSDK.LbsUpdate(string[] types, float lon, float lat, SdkCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `types` | `string[]` | 是 | 要更新的坐标类型数组，如 `new[] { "friend" }` |
| `lon` | `float` | 是 | 经度 |
| `lat` | `float` | 是 | 纬度 |
| `callback` | `SdkCallback` | 是 | 回调 |

**响应结构**：成功时 `result.IsSuccess = true`。

---

### `LbsDelete`

删除当前用户的经纬度坐标信息。

**方法签名**：

```csharp
void RXSDK.LbsDelete(string[] types, SdkCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `types` | `string[]` | 是 | 要删除的坐标类型数组 |
| `callback` | `SdkCallback` | 是 | 回调 |

**响应结构**：成功时 `result.IsSuccess = true`。

---

## 👤 用户自定义信息

### `UserSetCustom`

设置当前用户的自定义扩展信息（如游戏角色名、战力等），其他用户可查看。

**方法签名**：

```csharp
void RXSDK.UserSetCustom(string custom, SdkCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `custom` | `string` | 是 | 自定义信息 JSON 字符串（由 CP 自行定义内容） |
| `callback` | `SdkCallback` | 是 | 回调 |

**响应结构**：成功时 `result.IsSuccess = true`。

**示例用法**：

```csharp
var customInfo = JsonUtility.ToJson(new { role = "战士", level = 50, power = 99999 });
RXSDK.UserSetCustom(customInfo, result => result.Match(
    ok:   _ => Debug.Log("自定义信息已更新"),
    fail: e => Debug.LogError(e)
));
```

---

## 🤝 自定义关系

### `RelationAdd`

添加自定义关系（如关注、黑名单等）。

**方法签名**：

```csharp
void RXSDK.RelationAdd(
    string target,
    Dictionary<string, object> types,
    string target_remarks,
    string user_remarks,
    SdkCallback callback
)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `target` | `string` | 是 | 对方用户的 open_id |
| `types` | `Dictionary<string,object>` | 是 | 关系类型 Map，Key 为关系标识，Value 为 `true` |
| `target_remarks` | `string` | 否 | 给对方设置的备注 |
| `user_remarks` | `string` | 否 | 对方给自己设置的备注 |
| `callback` | `SdkCallback` | 是 | 回调 |

**示例用法**：

```csharp
var types = new Dictionary<string, object> { { "follow", true } };
RXSDK.RelationAdd("rxuNZP3GnkxYVXMf2xW6UZEKdg0z7wLm", types, "好友A", null, OnResult);
```

---

### `RelationDelete`

删除自定义关系。

**方法签名**：

```csharp
void RXSDK.RelationDelete(string target, Dictionary<string, object> types, SdkCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `target` | `string` | 是 | 对方用户的 open_id |
| `types` | `Dictionary<string,object>` | 是 | 要删除的关系类型 Map |
| `callback` | `SdkCallback` | 是 | 回调 |

---

### `RelationList`

获取当前用户指定类型的关系列表。

**方法签名**：

```csharp
void RXSDK.RelationList(string type, SdkCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `type` | `string` | 是 | 关系类型标识 |
| `callback` | `SdkCallback` | 是 | 回调 |

**响应结构**：

成功时 `result.Data` 为 JSON 字符串，包含关系用户列表（以服务端实际返回为准）。

---

### `HasRelation`

判断两用户之间是否存在指定关系。

**方法签名**：

```csharp
void RXSDK.HasRelation(string target, string type, SdkCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `target` | `string` | 是 | 对方用户的 open_id |
| `type` | `string` | 是 | 关系类型标识 |
| `callback` | `SdkCallback` | 是 | 回调 |

**响应结构**：

成功时 `result.Data` 为 JSON 字符串，包含 `has_relation` 字段（`true/false`）。

---

## 👫 好友关系

### `AddFriends`

添加好友。

**方法签名**：

```csharp
void RXSDK.AddFriends(string target, string target_remarks, string user_remarks, SdkCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `target` | `string` | 是 | 对方用户的 open_id |
| `target_remarks` | `string` | 否 | 给对方设置的备注 |
| `user_remarks` | `string` | 否 | 对方给自己的备注 |
| `callback` | `SdkCallback` | 是 | 回调 |

---

### `RemoveFriends`

删除好友。

**方法签名**：

```csharp
void RXSDK.RemoveFriends(string target, SdkCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `target` | `string` | 是 | 对方用户的 open_id |
| `callback` | `SdkCallback` | 是 | 回调 |

---

### `RelationFriends`

获取好友列表。

**方法签名**：

```csharp
void RXSDK.RelationFriends(SdkCallback callback)
```

**响应结构**：

成功时 `result.Data` 为 JSON 字符串，包含好友列表（以服务端实际返回为准）：

```json
{
    "list": [
        {
            "open_id": "rxuXxx",
            "nickname": "好友A",
            "avatar": "https://cdn.ruixue.com/avatar/xxx.png",
            "remarks": "我的备注"
        }
    ]
}
```

---

### `IsFriend`

判断指定用户是否为好友。

**方法签名**：

```csharp
void RXSDK.IsFriend(string target, SdkCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `target` | `string` | 是 | 对方用户的 open_id |
| `callback` | `SdkCallback` | 是 | 回调 |

**响应结构**：

成功时 `result.Data` 为 JSON 字符串，包含 `is_friend` 字段（`true/false`）。

---

## 🏆 排行榜

### `AddScore`

增加（累加）用户排行榜分数。

**方法签名**：

```csharp
void RXSDK.AddScore(string rank_id, int score, SdkCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `rank_id` | `string` | 是 | 排行榜 ID，如 `"2023_100_1680_weekly"` |
| `score` | `int` | 是 | 增加的分数值（正整数） |
| `callback` | `SdkCallback` | 是 | 回调 |

**响应结构**：

成功时 `result.Data` 为 JSON 字符串，包含更新后的排名和总分（以服务端实际返回为准）。

**示例用法**：

```csharp
RXSDK.AddScore("2023_100_1680_weekly", 80, result => result.Match(
    ok:   data  => Debug.Log("分数已更新: " + data),
    fail: error => Debug.LogError(error)
));
```

---

### `SetScore`

设置（覆盖）用户排行榜分数。

**方法签名**：

```csharp
void RXSDK.SetScore(string rank_id, int score, SdkCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `rank_id` | `string` | 是 | 排行榜 ID |
| `score` | `int` | 是 | 设置的目标分数（覆盖原值） |
| `callback` | `SdkCallback` | 是 | 回调 |

**响应结构**：同 `AddScore`。

---

### `QueryUserRank`

查询指定用户在排行榜中的名次和分数。

**方法签名**：

```csharp
void RXSDK.QueryUserRank(string rank_id, string open_id, SdkCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `rank_id` | `string` | 是 | 排行榜 ID |
| `open_id` | `string` | 是 | 目标用户的 open_id，传当前用户 open_id 即查自己 |
| `callback` | `SdkCallback` | 是 | 回调 |

**响应结构**：

成功时 `result.Data` 为 JSON 字符串：

```json
{
    "open_id": "rxuNZP3GnkxYVXMf2xW6UZEKdg0z7wLm",
    "rank": 12,
    "score": 9800,
    "nickname": "玩家A"
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `open_id` | `string` | 用户标识 |
| `rank` | `int` | 当前名次（从 1 开始） |
| `score` | `int` | 当前分数 |
| `nickname` | `string` | 用户昵称 |

---

### `GetRankList`

获取排行榜列表（按名次区间）。

**方法签名**：

```csharp
void RXSDK.GetRankList(string rank_id, int start_rank, int end_rank, SdkCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `rank_id` | `string` | 是 | 排行榜 ID |
| `start_rank` | `int` | 是 | 起始名次（从 `1` 开始） |
| `end_rank` | `int` | 是 | 结束名次，如 `1` 到 `100` 表示前 100 名 |
| `callback` | `SdkCallback` | 是 | 回调 |

**响应结构**：

成功时 `result.Data` 为 JSON 字符串：

```json
{
    "total": 1000,
    "list": [
        {
            "rank": 1,
            "open_id": "rxuXxx",
            "nickname": "第一名",
            "avatar": "https://cdn.ruixue.com/avatar/xxx.png",
            "score": 99999
        }
    ]
}
```

**示例用法**：

```csharp
// 获取前 100 名
RXSDK.GetRankList("2023_100_1680_weekly", 1, 100, result => result.Match(
    ok:   data  => Debug.Log("排行榜: " + data),
    fail: error => Debug.LogError(error)
));
```

---

### `FriendsRank`

获取好友排行榜（仅展示当前用户的好友）。

**方法签名**：

```csharp
void RXSDK.FriendsRank(string rank_id, SdkCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `rank_id` | `string` | 是 | 排行榜 ID |
| `callback` | `SdkCallback` | 是 | 回调 |

**响应结构**：

同 `GetRankList`，数据范围限定为当前用户的好友。

---

## 🔗 相关文档

- [账号登录](./02_login.md)
- [数据分析](./06_analysis.md)
- [回调说明](./callback.md)
