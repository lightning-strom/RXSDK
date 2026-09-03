# IGameAreaApi 接口文档

> **版本**: 3.7.36  
> **更新日期**: 2026-01-26
>
> 游戏区服和角色相关 API 接口定义，包含接口签名、参数说明、回调约定

## 📋 接口概览

**接口类**：`com.ruixue.openapi.IGameAreaApi`

**回调约定**：所有接口统一使用 `RXRequestCallback`，回调在主线程执行。详见[回调接口说明](./callback.md)

**主要功能**：

- 游戏区服管理：查询/创建/更新/删除游戏区服
- 游戏角色管理：创建/更新/删除/查询游戏角色

---

## 🎮 游戏区服管理

### `searchGameAreaInfo`

查询游戏区服信息。

**方法签名**：

```java
void searchGameAreaInfo(String areaId, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `areaId` | `String` | 是 | 游戏区服的唯一标识符，例如：`"1001"` |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

**示例用法**：

```java
RuiXueSdk.getApi().searchGameAreaInfo("1001", new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
        // TODO: 处理业务逻辑
    }
});
```

---

### `searchGameAreaListInfo`

查询区服列表信息。

**方法签名**：

```java
void searchGameAreaListInfo(RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

**示例用法**：

```java
RuiXueSdk.getApi().searchGameAreaListInfo(new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
        // TODO: 处理业务逻辑
    }
});
```

---

### `updateGameAreaInfo`

修改游戏区服信息。

**方法签名**：

```java
void updateGameAreaInfo(
    String areaId,
    String areaName,
    String areaStatus,
    String areaType,
    Map<String, Object> extension,
    RXRequestCallback callback
)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `areaId` | `String` | 否 | 区服 ID，例如：`"1001"`。如果为空表示修改所有相关区服 |
| `areaName` | `String` | 否 | 区服名称，例如：`"一区"` |
| `areaStatus` | `String` | 否 | 区服状态，例如：`"active"` 或 `"inactive"` |
| `areaType` | `String` | 否 | 区服类型，例如：`"PVP"` 或 `"PVE"` |
| `extension` | `Map<String, Object>` | 否 | 扩展字段 |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

**示例用法**：

```java
RuiXueSdk.getApi().updateGameAreaInfo(
    "1001", "新区服", "active", "PVP",
    List.of(1, 2, 3),
    new RXRequestCallback() {
        @Override
        public void onResponse(JSONObject jsonObject) {
            // TODO: 处理业务逻辑
        }
    }
);
```

---

### `createGameArea`

创建游戏区服。

**方法签名**：

```java
void createGameArea(
    String areaId,
    String areaName,
    String areaStatus,
    String areaType,
    Map<String, Object> extension,
    RXRequestCallback callback
)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `areaId` | `String` | 是 | 区服 ID，例如：`"1001"` |
| `areaName` | `String` | 是 | 区服名称，例如：`"一区"` |
| `areaStatus` | `String` | 是 | 区服状态，例如：`"active"` 或 `"inactive"` |
| `areaType` | `String` | 是 | 区服类型，例如：`"PVP"` 或 `"PVE"` |
| `extension` | `Map<String, Object>` | 否 | 扩展字段 |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

**示例用法**：

```java
RuiXueSdk.getApi().createGameArea(
    "1002", "二区", "active", "PVE",
    List.of(4, 5, 6),
    new RXRequestCallback() {
        @Override
        public void onResponse(JSONObject jsonObject) {
            // TODO: 处理业务逻辑
        }
    }
);
```

---

### `deleteGameArea`

删除游戏区服。

**方法签名**：

```java
void deleteGameArea(String areaId, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `areaId` | `String` | 是 | 游戏区服的唯一标识符，例如：`"1001"` |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

**示例用法**：

```java
RuiXueSdk.getApi().deleteGameArea("1001", new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
        // TODO: 处理业务逻辑
    }
});
```

---

## 👤 游戏角色管理

### `createGameCharacter`

创建游戏角色。

**方法签名**：

```java
void createGameCharacter(
    String areaId,                // 区服 ID
    String characterName,         // 角色名称
    String characterLevel,        // 角色等级
    String characterFaction,      // 角色阵营
    String characterProfession,   // 角色职业
    String characterStatus,       // 角色状态
    String characterType,         // 角色类型
    String characterVipLevel,     // 角色 VIP 等级
    String cpUserId,              // CP 用户 ID
    Map<String, Object> extension,// 扩展字段
    RXRequestCallback callback       // 回调接口
)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `areaId` | `String` | 是 | 区服 ID |
| `characterName` | `String` | 是 | 角色名称 |
| `characterLevel` | `String` | 是 | 角色等级 |
| `characterFaction` | `String` | 是 | 角色阵营（如：联盟、部落等） |
| `characterProfession` | `String` | 是 | 角色职业（如：战士、法师等） |
| `characterStatus` | `String` | 是 | 角色状态（如：在线、离线） |
| `characterType` | `String` | 是 | 角色类型（如：普通角色、VIP角色等） |
| `characterVipLevel` | `String` | 是 | 角色 VIP 等级 |
| `cpUserId` | `String` | 是 | CP 用户 ID（开发者用户唯一标识） |
| `extension` | `Map<String, Object>` | 否 | 扩展字段，用于传递额外信息，键值对形式 |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `updateGameCharacterInfo`

更新游戏角色信息。

**方法签名**：

```java
void updateGameCharacterInfo(
    String characterId,
    String areaId,
    String characterFaction,
    String characterLevel,
    String characterName,
    String characterProfession,
    String characterStatus,
    String characterType,
    String characterVipLevel,
    String cpUserId,
    Map<String, Object> extension,
    RXRequestCallback callback
)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `characterId` | `String` | 是 | 角色唯一标识 |
| `areaId` | `String` | 是 | 区服 ID |
| `characterFaction` | `String` | 是 | 角色阵营（如：联盟、部落等） |
| `characterLevel` | `String` | 是 | 角色等级 |
| `characterName` | `String` | 是 | 角色名称 |
| `characterProfession` | `String` | 是 | 角色职业（如：战士、法师等） |
| `characterStatus` | `String` | 是 | 角色状态（如：在线、离线） |
| `characterType` | `String` | 是 | 角色类型（如：普通角色、VIP角色等） |
| `characterVipLevel` | `String` | 是 | 角色 VIP 等级 |
| `cpUserId` | `String` | 是 | CP 用户 ID（开发者用户唯一标识） |
| `extension` | `Map<String, Object>` | 否 | 扩展字段，用于传递额外信息，键值对形式 |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `deleteGameCharacter`

删除游戏角色。

**方法签名**：

```java
void deleteGameCharacter(String areaId, String characterId, String cpUserId, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `areaId` | `String` | 是 | 区服 ID |
| `characterId` | `String` | 是 | 角色唯一标识符，例如：`"char12345"` |
| `cpUserId` | `String` | 是 | CP 用户 ID |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `searchGameCharacterListInfo`

查询账号下角色信息列表。

**方法签名**：

```java
void searchGameCharacterListInfo(String cpUserId, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `cpUserId` | `String` | 是 | CP 用户 ID |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `searchGameCharacterListInArea`

查询账号下某个区服下的角色信息列表。

**方法签名**：

```java
void searchGameCharacterListInArea(String cpUserId, String areaId, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `cpUserId` | `String` | 是 | CP 用户 ID |
| `areaId` | `String` | 是 | 区服 ID |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `searchGameCharacterInfo`

查询具体角色信息。

**方法签名**：

```java
void searchGameCharacterInfo(String cpUserId, String areaId, String characterId, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `cpUserId` | `String` | 是 | CP 用户 ID |
| `areaId` | `String` | 是 | 区服 ID |
| `characterId` | `String` | 是 | 角色唯一标识符 |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

## 📝 重构注意事项

### 1. 错误处理

- 所有接口失败必须返回统一错误结构：`code`（int）、`msg`（string）
- 服务端错误码为 6 位整数，需原样透传
- 客户端错误码使用 4 位（可扩展新的错误码区间）

### 2. 参数类型

- 大部分参数使用 `String` 类型，即使语义上是数字（如等级、VIP等级）
- 重构时需保持类型一致性，避免类型转换导致的兼容性问题

### 3. 扩展字段

- `extension` 字段用于传递额外信息，键值对形式
- 重构时需保持扩展字段的序列化/反序列化逻辑

### 4. 区服状态和类型

- `areaStatus` 和 `areaType` 为字符串枚举，建议在文档中明确可选值
- 重构时可考虑使用枚举类型，但需保持向后兼容

### 5. 角色信息字段

- 角色相关字段（等级、阵营、职业、状态、类型、VIP等级）均为字符串类型
- 重构时需保持字段语义和格式的一致性

### 6. CP 用户 ID

- `cpUserId` 为开发者用户唯一标识，在多个接口中作为必填参数
- 重构时需确保该参数的传递和校验逻辑

---

## 🔗 相关文档

- [回调接口说明](./callback.md)
- [错误码规范](../../common/specs/error_codes.md)
- [错误格式说明](../../common/api/01_error_format.md)
