# RXSDK API 使用指南

> **版本**: 2.0  
> **更新日期**: 2026-01-26

本文档整合 RXSDK 调用方式设计与使用示例，提供完整的接入指南。

---

## 📋 概述

`RXSDK` 提供三种调用方式，满足不同场景的使用需求：

| 方式 | 调用形式 | 适用场景 | 推荐程度 |
|------|----------|----------|----------|
| 统一入口 | `RXSDK.getInstance().接口名()` | 小中型项目 | ⭐⭐⭐ |
| API 对象 | `RXSDK.getApi().接口名()` | 需要底层接口 | ⭐⭐ |
| 功能模块 | `RXSDK.getInstance().passport.接口名()` | 大型项目 | ⭐⭐⭐ |

---

## 🎯 设计目标

- **向后兼容**：保持现有接口调用方式不变
- **灵活使用**：提供多种调用方式，开发者可根据习惯选择
- **清晰组织**：按功能模块组织，提高代码可读性
- **类型安全**：使用强类型，避免过度使用 `Map<String, Object>`

---

## 📚 方式一：统一入口方式（推荐）

所有接口直接通过 `RXSDK.getInstance()` 调用。

**优点**：简单直接，无需记忆模块名称，适合快速开发。

### 登录示例

```java
// 账号密码登录
LoginParams loginParams = new LoginParams.Builder()
    .setLoginType(LoginMethod.USERNAME)
    .setUsername("username")
    .setPassword("password")
    .build();

RXSDK.getInstance().login(activity, loginParams, new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
        int code = jsonObject.optInt("code", -1);
        if (code == 0) {
            // 登录成功
            JSONObject data = jsonObject.optJSONObject("data");
            if (data != null) {
                String openid = data.optString("openid");
                // 处理登录成功逻辑
            }
        } else {
            // 登录失败
            String msg = jsonObject.optString("msg");
        }
    }

    @Override
    public void onError(RXException e) {
        // 处理错误
    }
});
```

### 获取用户信息

```java
RXSDK.getInstance().getUserInfo(new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
        int code = jsonObject.optInt("code", -1);
        if (code == 0) {
            JSONObject data = jsonObject.optJSONObject("data");
            if (data != null) {
                String nickname = data.optString("nickname");
                String avatar = data.optString("avatarurl");
            }
        }
    }
});
```

### LBS 更新

```java
RXSDK.getInstance().lbsUpdate(
    new String[]{"type1", "type2"},
    116.3974f,  // 经度
    39.9093f,   // 纬度
    new RXRequestCallback() {
        @Override
        public void onResponse(JSONObject jsonObject) {
            // 处理响应
        }
    }
);
```

---

## 📚 方式二：API 对象方式

通过 `getApi()` 静态方法获取底层 `RXSdkApi` 对象，直接调用底层接口。

**优点**：直接访问底层 API，性能最优，保持与旧代码的兼容性。

### 登录示例

```java
// 静态方法，无需 getInstance()
RXSdkApi api = RXSDK.getApi();

api.login(
    activity,
    LoginMethod.USERNAME,
    "username",
    "password",
    null,  // captchaCode
    null,  // loginOpenId
    null,  // ext
    new String[]{"openid"},  // signFields
    null,  // migrateArgs
    new RXJSONCallback() {
        @Override
        public void onSuccess(JSONObject data) {
            // 处理成功
        }

        @Override
        public void onFailed(JSONObject cause) {
            // 处理失败
        }

        @Override
        public void onError(RXException e) {
            // 处理错误
        }
    }
);
```

### 获取用户信息

```java
RXSdkApi api = RXSDK.getApi();

api.getUserInfo(new RXJSONCallback() {
    @Override
    public void onSuccess(JSONObject data) {
        // 处理成功
    }

    @Override
    public void onFailed(JSONObject cause) {
        // 处理失败
    }

    @Override
    public void onError(RXException e) {
        // 处理错误
    }
});
```

---

## 📚 方式三：功能模块方式（推荐用于大型项目）

按功能模块组织接口，提高代码可读性和可维护性。

**优点**：代码组织清晰，便于大型项目管理，IDE 自动补全友好。

### 功能模块划分

| 模块 | 说明 | 包含接口 |
|------|------|----------|
| `passport` | 通行证模块 | 登录、注册、用户信息、绑定、验证码等 |
| `social` | 社交模块 | LBS、关系、好友、排行榜等 |
| `gameArea` | 游戏区服模块 | 区服管理、角色管理等 |
| `pay` | 支付模块 | 支付相关接口 |
| `share` | 分享模块 | 分享相关接口 |
| `legal` | 法务模块 | 实名认证、隐私协议等 |
| `track` | 埋点模块 | 数据上报、用户行为等 |
| `update` | 更新模块 | 应用更新、版本检查等 |
| `feedback` | 反馈模块 | 意见反馈、满意度评价等 |

### 通行证模块示例

```java
// 登录
LoginParams loginParams = new LoginParams.Builder()
    .setLoginType(LoginMethod.USERNAME)
    .setUsername("username")
    .setPassword("password")
    .build();

RXSDK.getInstance().passport.login(activity, loginParams, callback);

// 注册
RegisterParams registerParams = new RegisterParams.Builder()
    .setUsername("username")
    .setPassword("password")
    .setCaptchaCode("captcha_code")
    .build();

RXSDK.getInstance().passport.register(registerParams, callback);

// 获取用户信息
RXSDK.getInstance().passport.getUserInfo(callback);

// 发送验证码
RXSDK.getInstance().passport.sendCaptcha(
    CaptchaType.CaptchaType_phone,
    "手机号",
    "register",
    callback
);

// 绑定手机
RXSDK.getInstance().passport.bindPhone("手机号", "密码", "验证码", null, callback);

// 修改密码
RXSDK.getInstance().passport.changePassword("旧密码", "新密码", callback);

// 实名认证
RXSDK.getInstance().passport.realAuth("姓名", "身份证号", callback);
```

### 社交模块示例

```java
// LBS 更新
RXSDK.getInstance().social.lbsUpdate(
    new String[]{"type1", "type2"},
    116.3974f, 39.9093f, callback
);

// LBS 半径查询
RXSDK.getInstance().social.lbsRadius(
    "type1", 116.3974f, 39.9093f,
    1000.0f,  // 半径（米）
    10, 1, 20, callback
);

// 添加好友
RXSDK.getInstance().social.addFriends("对方OpenID", "我给对方的备注", "对方给我的备注", callback);

// 获取好友列表
RXSDK.getInstance().social.relationFriends(callback);

// 增加分数
RXSDK.getInstance().social.addScore("rankId", 100, callback);

// 获取排行榜列表
RXSDK.getInstance().social.getRankList("rankId", 1, 10, callback);
```

### 游戏区服模块示例

```java
// 查询游戏区服信息
RXSDK.getInstance().gameArea.searchGameAreaInfo("areaId", callback);

// 查询区服列表
RXSDK.getInstance().gameArea.searchGameAreaListInfo(callback);

// 创建游戏区服
Map<String, Object> extension = new HashMap<>();
RXSDK.getInstance().gameArea.createGameArea(
    "areaId", "区服名称", "区服状态", "区服类型", extension, callback
);

// 创建游戏角色
RXSDK.getInstance().gameArea.createGameCharacter(
    "areaId", "角色名称", "角色等级", "角色阵营",
    "角色职业", "角色状态", "角色类型", "VIP等级",
    "cpUserId", extension, callback
);

// 查询角色信息列表
RXSDK.getInstance().gameArea.searchGameCharacterListInfo("cpUserId", callback);
```

---

## 🔄 三种方式的关系

```
RXSDK (统一入口)
├── 直接方法调用 (方式一)
│   ├── login()
│   ├── getUserInfo()
│   └── ...
├── getApi() (静态方法) → RXSdkApi (方式二)
│   ├── login() (底层实现)
│   └── ...
└── 功能模块 (方式三)
    ├── passport → PassportModule
    ├── social → SocialModule
    ├── gameArea → GameAreaModule
    └── ...
```

**内部实现**：所有三种方式最终都委托给底层的 `RXSdkApi` 实现，确保行为一致。

---

## 💡 使用建议

| 项目规模 | 推荐方式 | 原因 |
|----------|----------|------|
| 小型项目 | 方式一（统一入口） | 简单直接，代码量少 |
| 中型项目 | 方式一或方式三 | 根据团队习惯选择 |
| 大型项目 | 方式三（功能模块） | 代码组织清晰，便于维护 |
| 需要底层接口 | 方式二（API 对象） | 直接访问底层实现 |

---

## ✅ 兼容性说明

- **向后兼容**：所有现有代码无需修改
- **渐进式迁移**：可逐步迁移到功能模块方式
- **性能一致**：三种方式最终调用相同底层实现

---

## 📚 相关文档

- [接口清单](./API_LIST.md)（144 个接口）
- [通行证 API](./passport_api.md)
- [社交 API](./social_api.md)
- [游戏区服 API](./gamearea_api.md)
- [回调接口说明](./callback.md)
- [快速接入指南](../QUICK_START.md)
