# ISocialApi 接口文档

> **版本**: 3.7.36  
> **更新日期**: 2026-01-26
>
> 社交（Social）相关 API 接口定义，包含接口签名、参数说明、回调约定

## 📋 接口概览

**接口类**：`com.ruixue.openapi.ISocialApi`

**回调约定**：所有接口统一使用 `RXRequestCallback`，回调在主线程执行。详见[回调接口说明](./callback.md)

**主要功能**：
- LBS（位置服务）：上报/更新/删除经纬度坐标，查询附近用户
- 自定义关系管理：添加/删除/更新/查询自定义关系
- 好友管理：添加/删除/更新好友，查询好友列表
- 排行榜：增加/设置/查询用户分数，获取排行榜列表

---

## 📍 LBS（位置服务）

### `lbsUpdate` (重载方法 1)

上报/更新经纬度坐标（Map 参数）。

**方法签名**：
```java
void lbsUpdate(Map<String, Object> hashMap, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `hashMap` | `Map<String, Object>` | 是 | 参数 Map |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `lbsUpdate` (重载方法 2)

上报/更新经纬度坐标（具体参数）。

**方法签名**：
```java
void lbsUpdate(String[] types, float lon, float lat, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `types` | `String[]` | 是 | 类型数组 |
| `lon` | `float` | 是 | 经度 |
| `lat` | `float` | 是 | 纬度 |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `lbsRadius` (重载方法 1)

获取指定半径内的其他用户信息（Map 参数）。

**方法签名**：
```java
void lbsRadius(Map<String, Object> hashMap, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `hashMap` | `Map<String, Object>` | 是 | 参数 Map |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `lbsRadius` (重载方法 2)

获取指定半径内的其他用户信息（具体参数）。

**方法签名**：
```java
void lbsRadius(String types, float lon, float lat, float radius, int count, int page, int page_size, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `types` | `String` | 是 | 类型 |
| `lon` | `float` | 是 | 经度 |
| `lat` | `float` | 是 | 纬度 |
| `radius` | `float` | 是 | 半径（单位：米） |
| `count` | `int` | 是 | 返回数量 |
| `page` | `int` | 是 | 页码 |
| `page_size` | `int` | 是 | 每页大小 |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `lbsDelete` (重载方法 1)

删除经纬度坐标（Map 参数）。

**方法签名**：
```java
void lbsDelete(Map<String, Object> hashMap, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `hashMap` | `Map<String, Object>` | 是 | 参数 Map |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `lbsDelete` (重载方法 2)

删除经纬度坐标（类型数组）。

**方法签名**：
```java
void lbsDelete(String[] types, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `types` | `String[]` | 是 | 类型数组 |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

## 👥 自定义关系管理

### `userSetCustom` (重载方法 1)

给用户设置 CP 的自定义信息（Map 参数）。

**方法签名**：
```java
void userSetCustom(Map<String, Object> hashMap, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `hashMap` | `Map<String, Object>` | 是 | 参数 Map |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `userSetCustom` (重载方法 2)

给用户设置 CP 的自定义信息（字符串参数）。

**方法签名**：
```java
void userSetCustom(String custom, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `custom` | `String` | 是 | 自定义信息 |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `relationAdd` (重载方法 1)

添加自定义关系（Map 参数）。

**方法签名**：
```java
void relationAdd(Map<String, Object> hashMap, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `hashMap` | `Map<String, Object>` | 是 | 参数 Map，包含：<br>- `target`：对方 OpenID（string，必填）<br>- `types`：CP 自定义关系类型列表（object，必填），格式为 `{类型标识符(string):是否为双向关系}`<br>- `target_remarks`：用户给 Target 设置的备注信息（string，可选，最长 512 字符）<br>- `user_remarks`：Target 给用户设置的备注信息（string，可选，最长 512 字符） |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `relationAdd` (重载方法 2)

添加自定义关系（具体参数）。

**方法签名**：
```java
void relationAdd(String target, Map<String, Object> types, String target_remarks, String user_remarks, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `target` | `String` | 是 | 对方 OpenID |
| `types` | `Map<String, Object>` | 是 | CP 自定义关系类型列表，格式为 `{类型标识符(string):是否为双向关系}` |
| `target_remarks` | `String` | 否 | 用户给 Target 设置的备注信息（最长 512 字符） |
| `user_remarks` | `String` | 否 | Target 给用户设置的备注信息（最长 512 字符） |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `relationDelete` (重载方法 1)

删除自定义关系（Map 参数）。

**方法签名**：
```java
void relationDelete(Map<String, Object> hashMap, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `hashMap` | `Map<String, Object>` | 是 | 参数 Map，包含：<br>- `target`：对方 OpenID（string，必填）<br>- `types`：CP 自定义关系类型列表（object，必填），格式为 `{类型标识符(string):是否为双向关系}` |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `relationDelete` (重载方法 2)

删除自定义关系（具体参数）。

**方法签名**：
```java
void relationDelete(String target, Map<String, Object> types, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `target` | `String` | 是 | 对方 OpenID |
| `types` | `Map<String, Object>` | 是 | CP 自定义关系类型列表，格式为 `{类型标识符(string):是否为双向关系}` |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `updateRemarks` (重载方法 1)

更新自定义关系备注（Map 参数）。

**方法签名**：
```java
void updateRemarks(Map<String, Object> hashMap, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `hashMap` | `Map<String, Object>` | 是 | 参数 Map，包含：<br>- `target`：对方 OpenID（string，必填）<br>- `type`：CP 自定义关系类型（string，必填）<br>- `target_remarks`：用户给 Target 设置的备注信息（string，可选，最长 512 字符） |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `updateRemarks` (重载方法 2)

更新自定义关系备注（具体参数）。

**方法签名**：
```java
void updateRemarks(String target, String type, String target_remarks, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `target` | `String` | 是 | 对方 OpenID |
| `type` | `String` | 是 | CP 自定义关系类型 |
| `target_remarks` | `String` | 否 | 用户给 Target 设置的备注信息（最长 512 字符） |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `hasRelation` (重载方法 1)

判断两用户是否存在某自定义关系（Map 参数）。

**方法签名**：
```java
void hasRelation(Map<String, Object> hashMap, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `hashMap` | `Map<String, Object>` | 是 | 参数 Map，包含：<br>- `target`：对方 OpenID（string，必填）<br>- `type`：CP 自定义关系类型（string，必填） |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `hasRelation` (重载方法 2)

判断两用户是否存在某自定义关系（具体参数）。

**方法签名**：
```java
void hasRelation(String target, String type, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `target` | `String` | 是 | 对方 OpenID |
| `type` | `String` | 是 | CP 自定义关系类型 |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `relationList` (重载方法 1)

获取自定义关系列表（Map 参数）。

**方法签名**：
```java
void relationList(Map<String, Object> hashMap, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `hashMap` | `Map<String, Object>` | 是 | 参数 Map |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `relationList` (重载方法 2)

获取自定义关系列表（类型参数）。

**方法签名**：
```java
void relationList(String type, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `type` | `String` | 是 | CP 自定义关系类型 |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

## 👫 好友管理

### `addFriends` (重载方法 1)

添加好友（Map 参数）。

**方法签名**：
```java
void addFriends(Map<String, Object> hashMap, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `hashMap` | `Map<String, Object>` | 是 | 参数 Map |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `addFriends` (重载方法 2)

添加好友（具体参数）。

**方法签名**：
```java
void addFriends(String target, String target_remarks, String user_remarks, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `target` | `String` | 是 | 对方 OpenID |
| `target_remarks` | `String` | 否 | 用户给 Target 设置的备注信息 |
| `user_remarks` | `String` | 否 | Target 给用户设置的备注信息 |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `removeFriends` (重载方法 1)

删除好友（Map 参数）。

**方法签名**：
```java
void removeFriends(Map<String, Object> hashMap, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `hashMap` | `Map<String, Object>` | 是 | 参数 Map |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `removeFriends` (重载方法 2)

删除好友（具体参数）。

**方法签名**：
```java
void removeFriends(String target, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `target` | `String` | 是 | 对方 OpenID |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `updateFriendRemarks` (重载方法 1)

更新好友关系备注（Map 参数）。

**方法签名**：
```java
void updateFriendRemarks(Map<String, Object> hashMap, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `hashMap` | `Map<String, Object>` | 是 | 参数 Map |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `updateFriendRemarks` (重载方法 2)

更新好友关系备注（具体参数）。

**方法签名**：
```java
void updateFriendRemarks(String target, String target_remarks, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `target` | `String` | 是 | 对方 OpenID |
| `target_remarks` | `String` | 是 | 用户给 Target 设置的备注信息 |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `isFriend` (重载方法 1)

判断两用户是否为好友（Map 参数）。

**方法签名**：
```java
void isFriend(Map<String, Object> hashMap, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `hashMap` | `Map<String, Object>` | 是 | 参数 Map |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `isFriend` (重载方法 2)

判断两用户是否为好友（具体参数）。

**方法签名**：
```java
void isFriend(String target, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `target` | `String` | 是 | 对方 OpenID |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `relationFriends` (重载方法 1)

获取好友列表（Map 参数）。

**方法签名**：
```java
void relationFriends(Map<String, Object> hashMap, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `hashMap` | `Map<String, Object>` | 是 | 参数 Map |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `relationFriends` (重载方法 2)

获取好友列表（无参数）。

**方法签名**：
```java
void relationFriends(RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

## 🏆 排行榜

### `addScore` (重载方法 1)

增加用户分数（Map 参数）。

**方法签名**：
```java
void addScore(Map<String, Object> hashMap, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `hashMap` | `Map<String, Object>` | 是 | 参数 Map，包含：<br>- `rank_id`：字符串本身带有类型信息（string，必填），格式为：`Flag_榜单容量_重置周期_自定义标识`（flag 是一个 int64 位标记，用以扩展和规定绑定属性），例如：`0_100_168_weekly`<br>- `score`：增加的分数值（int，必填），例如：`100` |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `addScore` (重载方法 2)

增加用户分数（具体参数）。

**方法签名**：
```java
void addScore(String rank_id, int score, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `rank_id` | `String` | 是 | 字符串本身带有类型信息，格式为：`Flag_榜单容量_重置周期_自定义标识`（flag 是一个 int64 位标记，用以扩展和规定绑定属性） |
| `score` | `int` | 是 | 增加的分数值 |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `setScore` (重载方法 1)

设置用户分数（Map 参数）。

**方法签名**：
```java
void setScore(Map<String, Object> hashMap, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `hashMap` | `Map<String, Object>` | 是 | 参数 Map，包含：<br>- `rank_id`：字符串本身带有类型信息（string，必填），格式为：`Flag_榜单容量_重置周期_自定义标识`，例如：`0_100_168_weekly`<br>- `score`：设置的分数值（int，必填），例如：`100` |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `setScore` (重载方法 2)

设置用户分数（具体参数）。

**方法签名**：
```java
void setScore(String rank_id, int score, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `rank_id` | `String` | 是 | 字符串本身带有类型信息，格式为：`Flag_榜单容量_重置周期_自定义标识` |
| `score` | `int` | 是 | 设置的分数值 |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `queryUserRank` (重载方法 1)

查询用户分数（Map 参数）。

**方法签名**：
```java
void queryUserRank(Map<String, Object> hashMap, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `hashMap` | `Map<String, Object>` | 是 | 参数 Map，包含：<br>- `rank_id`：字符串本身带有类型信息（string，必填），格式为：`Flag_榜单容量_重置周期_自定义标识`，例如：`0_100_168_weekly`<br>- `open_id`：目标用户 OpenID（string，必填），例如：`rxuSl4QZoNk0G1HY2-Za6GlO7wO-p_ej` |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `queryUserRank` (重载方法 2)

查询用户分数（具体参数）。

**方法签名**：
```java
void queryUserRank(String rank_id, String open_id, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `rank_id` | `String` | 是 | 字符串本身带有类型信息，格式为：`Flag_榜单容量_重置周期_自定义标识` |
| `open_id` | `String` | 是 | 目标用户 OpenID |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `getRankList` (重载方法 1)

获取排行榜列表（Map 参数）。

**方法签名**：
```java
void getRankList(Map<String, Object> hashMap, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `hashMap` | `Map<String, Object>` | 是 | 参数 Map，包含：<br>- `rank_id`：字符串本身带有类型信息（string，必填），格式为：`Flag_榜单容量_重置周期_自定义标识`，例如：`0_100_168_weekly`<br>- `start_rank`：获取排行榜开始排名（int，必填），取值 `[1,榜单容量)`，可以用于分页加载，例如：`1`<br>- `end_rank`：获取排行榜结束排名（int，必填），取值 `[1,榜单容量]`，可以用于分页加载，例如：`2` |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `getRankList` (重载方法 2)

获取排行榜列表（具体参数）。

**方法签名**：
```java
void getRankList(String rank_id, int start_rank, int end_rank, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `rank_id` | `String` | 是 | 字符串本身带有类型信息，格式为：`Flag_榜单容量_重置周期_自定义标识` |
| `start_rank` | `int` | 是 | 获取排行榜开始排名，取值 `[1,榜单容量)`，可以用于分页加载 |
| `end_rank` | `int` | 是 | 获取排行榜结束排名，取值 `[1,榜单容量]`，可以用于分页加载 |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `friendsRank` (重载方法 1)

获取好友排行榜列表（Map 参数）。

**方法签名**：
```java
void friendsRank(Map<String, Object> hashMap, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `hashMap` | `Map<String, Object>` | 是 | 参数 Map，包含：<br>- `rank_id`：字符串本身带有类型信息（string，必填），格式为：`Flag_榜单容量_重置周期_自定义标识`，例如：`0_100_168_weekly` |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `friendsRank` (重载方法 2)

获取好友排行榜列表（具体参数）。

**方法签名**：
```java
void friendsRank(String rank_id, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `rank_id` | `String` | 是 | 字符串本身带有类型信息，格式为：`Flag_榜单容量_重置周期_自定义标识` |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

## 📝 重构注意事项

### 1. 参数重载模式
- 大部分接口提供两种重载方式：
  - **Map 参数版本**：灵活但需要调用方自行构建 Map
  - **具体参数版本**：类型安全，推荐使用
- 重构时建议保留两种重载方式，保持向后兼容

### 2. 错误处理
- 所有接口失败必须返回统一错误结构：`code`（int）、`msg`（string）
- 服务端错误码为 6 位整数，需原样透传
- 客户端错误码使用 4 位（5000-5999 为分享相关错误，社交相关可复用或扩展）

### 3. rank_id 格式规范
- `rank_id` 格式为：`Flag_榜单容量_重置周期_自定义标识`
- `Flag` 是一个 int64 位标记，用以扩展和规定绑定属性
- 重构时需保持该格式的解析与校验逻辑

### 4. 关系类型 Map 格式
- 自定义关系类型列表格式：`{类型标识符(string):是否为双向关系}`
- 重构时需确保该格式的序列化/反序列化正确

### 5. 备注信息长度限制
- `target_remarks` 和 `user_remarks` 最长 512 字符
- 重构时需在接口层做长度校验

---

## 🔗 相关文档

- [回调接口说明](./callback.md)
- [错误码规范](../../common/specs/error_codes.md)
- [错误格式说明](../../common/api/01_error_format.md)
- [Social 接口契约](../../common/api/30_social.md)
