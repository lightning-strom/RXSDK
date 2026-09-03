# IPassportApi 接口文档

> **版本**: 3.7.36  
> **更新日期**: 2026-01-26
>
> 通行证（Passport）相关 API 接口定义，包含接口签名、参数说明、回调约定

## 📋 接口概览

**接口类**：`com.ruixue.openapi.IPassportApi`

**回调约定**：所有接口统一使用 `RXRequestCallback`，回调在主线程执行。详见[回调接口说明](./callback.md)

**主要功能**：

- 用户登录/登出
- 账号注册/注销
- 验证码发送/验证
- 用户信息管理
- 手机/邮箱绑定/解绑
- 密码管理
- 实名认证

---

## 🔐 登录相关

### `login`

登录请求（支持多种登录方式）。

**方法签名**：

```java
void login(
    Activity activity,
    String loginType,
    String username,
    String password,
    String captchaCode,
    String loginOpenId,
    Map<String, Object> ext,
    String[] signFields,
    Object migrateArgs,
    RXRequestCallback callback
)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `activity` | `Activity` | 是 | 应用上下文 |
| `loginType` | `String` | 是 | 登录类型，参考 `LoginMethod` 常量：<br>- `GUEST`：游客登录<br>- `WECHAT`：微信登录<br>- `USERNAME`：账号登录<br>- `QUICKPHONE`：快速手机登录<br>- `CAPTCHACODE`：验证码登录<br>- `VIRTUAL`：虚拟账号<br>- `OPPO`、`HUAWEI`、`HWJOS`、`MI`、`VIVO`：厂商登录<br>- `BAIDUNET`、`DOUYIN`、`KUAISHOU`、`YSDK`、`BILIBILI`、`TAPTAP`：渠道登录<br>- `GOOGLE`、`FACEBOOK`、`LINE`：海外登录 |
| `username` | `String` | 否 | 用户名（非账号登录传空/null）<br>- 账号注册为账号<br>- 手机注册为手机号<br>- 邮箱注册为邮箱 |
| `password` | `String` | 否 | 密码（非账号登录传空/null） |
| `captchaCode` | `String` | 否 | 验证码 |
| `loginOpenId` | `String` | 否 | 二次登录使用的 `login_openid`，null 或空为普通登录 |
| `ext` | `Map<String, Object>` | 否 | 扩展字段，可传 null |
| `signFields` | `String[]` | 否 | 指定对登录成功后返回的特定字段使用 CPKEY 计算签名<br>支持的字段：`nickname`、`avatar`、`openid`、`region`、`sex`、`age`<br>计算签名的逻辑会对指定字段进行排序，传参与顺序无关 |
| `migrateArgs` | `Object` | 否 | 账号迁移用的参数，任意合法的 JSON 类型（如 string、number）<br>调用 CP `account-query` 及 `account-queryandbind` 接口时透传给 CP |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

---

### `logout`

登出。

**方法签名**：

```java
void logout(OnLogoutCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `callback` | `OnLogoutCallback` | 是 | 登出回调 |

---

### `searchHasAccounts`

查询账号是否存在。

**方法签名**：

```java
void searchHasAccounts(String method, String devicecode, int states, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `method` | `String` | 是 | 登录方式 |
| `devicecode` | `String` | 是 | 设备码 |
| `states` | `int` | 是 | 账号的位标记 |
| `callback` | `RXRequestCallback` | 是 | 回调接口 |

---

## 📝 注册相关

### `register`

用户注册。

**方法签名**：

```java
void register(String username, String password, String captchaCode, Map<String, Object> ext, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `username` | `String` | 是 | 用户名 |
| `password` | `String` | 是 | 密码 |
| `captchaCode` | `String` | 是 | 验证码 |
| `ext` | `Map<String, Object>` | 否 | 扩展字段，支持：<br>- `nickname`：昵称（string）<br>- `avatarUrl`：头像地址（string）<br>- `sex`：性别（number，0 男 1 女） |
| `callback` | `RXRequestCallback` | 是 | 回调接口 |

---

## 🔑 密码管理

### `resetPassword`

重置密码。

**方法签名**：

```java
void resetPassword(String username, String password, String captcha_code, Object migrate_args, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `username` | `String` | 是 | 手机号 |
| `password` | `String` | 是 | 新密码 |
| `captcha_code` | `String` | 是 | 验证码 |
| `migrate_args` | `Object` | 否 | 账号迁移用的参数，任意合法的 JSON 类型<br>调用 CP `account-query` 及 `account-queryandbind` 接口时透传给 CP |
| `callback` | `RXRequestCallback` | 是 | 回调接口 |

---

### `changePassword`

修改密码。

**方法签名**：

```java
void changePassword(String old_password, String new_password, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `old_password` | `String` | 是 | 旧密码 |
| `new_password` | `String` | 是 | 新密码 |
| `callback` | `RXRequestCallback` | 是 | 回调接口 |

---

## 📧 验证码相关

### `sendCaptcha`

发送验证码。

**方法签名**：

```java
boolean sendCaptcha(CaptchaType type, String target, String purpose, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `type` | `CaptchaType` | 是 | 验证码类型枚举：<br>- `CaptchaType_email`：邮箱<br>- `CaptchaType_phone`：手机 |
| `target` | `String` | 是 | 手机号或邮箱 |
| `purpose` | `String` | 是 | 意图（用途） |
| `callback` | `RXRequestCallback` | 是 | 回调接口 |

**返回值**：`boolean`（是否成功发送）

---

### `verifyCaptcha`

验证验证码。

**方法签名**：

```java
boolean verifyCaptcha(CaptchaType type, String target, String purpose, String captcha_code, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `type` | `CaptchaType` | 是 | 验证码类型枚举 |
| `target` | `String` | 是 | 手机号或邮箱 |
| `purpose` | `String` | 是 | 意图（用途） |
| `captcha_code` | `String` | 是 | 验证码 |
| `callback` | `RXRequestCallback` | 是 | 回调接口 |

**返回值**：`boolean`（是否验证成功）

---

## 👤 用户信息管理

### `getUserInfo`

获取用户信息。

**方法签名**：

```java
void getUserInfo(RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `callback` | `RXRequestCallback` | 是 | 回调接口 |

---

### `updateUserInfo`

修改用户信息（重载方法 1）。

**方法签名**：

```java
void updateUserInfo(String nickname, String avatarUrl, String region, int sex, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `nickname` | `String` | 否 | 用户昵称 |
| `avatarUrl` | `String` | 否 | 头像 URL |
| `region` | `String` | 否 | 地区码 |
| `sex` | `int` | 否 | 性别（1 男 0 女） |
| `callback` | `RXRequestCallback` | 是 | 回调接口 |

---

### `updateUserInfo` (重载方法 2)

修改用户信息（带扩展字段）。

**方法签名**：

```java
void updateUserInfo(String nickname, String avatarUrl, String region, int sex, Map<String, Object> ext, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `nickname` | `String` | 否 | 用户昵称 |
| `avatarUrl` | `String` | 否 | 头像 URL |
| `region` | `String` | 否 | 地区码 |
| `sex` | `int` | 否 | 性别（1 男 0 女） |
| `ext` | `Map<String, Object>` | 否 | 扩展字段 |
| `callback` | `RXRequestCallback` | 是 | 回调接口 |

---

## 📱 手机绑定/解绑

### `bindPhone`

绑定手机。

**方法签名**：

```java
void bindPhone(String phone, String password, String captcha_code, Object migrate_args, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `phone` | `String` | 是 | 手机号 |
| `password` | `String` | 是 | 密码 |
| `captcha_code` | `String` | 是 | 验证码 |
| `migrate_args` | `Object` | 否 | 账号迁移用的参数，任意合法的 JSON 类型 |
| `callback` | `RXRequestCallback` | 是 | 回调接口 |

---

### `changePhone`

修改手机号。

**方法签名**：

```java
void changePhone(String newPhone, String newPhoneCaptcha, String oldPhoneCaptcha, Object migrateArgs, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `newPhone` | `String` | 是 | 新手机号 |
| `newPhoneCaptcha` | `String` | 是 | 新手机号验证码 |
| `oldPhoneCaptcha` | `String` | 是 | 旧手机号验证码 |
| `migrateArgs` | `Object` | 否 | 账号迁移用的参数 |
| `callback` | `RXRequestCallback` | 是 | 回调接口 |

---

### `unBindPhone`

解绑手机。

**方法签名**：

```java
void unBindPhone(String phone, String captcha_code, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `phone` | `String` | 是 | 手机号 |
| `captcha_code` | `String` | 是 | 验证码 |
| `callback` | `RXRequestCallback` | 是 | 回调接口 |

---

## 📧 邮箱绑定/解绑

### `bindEmail`

绑定邮箱。

**方法签名**：

```java
void bindEmail(String email, String password, String captcha_code, Object migrate_args, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `email` | `String` | 是 | 邮箱 |
| `password` | `String` | 是 | 密码 |
| `captcha_code` | `String` | 是 | 验证码 |
| `migrate_args` | `Object` | 否 | 账号迁移用的参数 |
| `callback` | `RXRequestCallback` | 是 | 回调接口 |

---

### `changeEmail`

修改邮箱。

**方法签名**：

```java
void changeEmail(String newEmail, String newEmailCaptcha, String oldEmailCaptcha, Object migrateArgs, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `newEmail` | `String` | 是 | 新邮箱 |
| `newEmailCaptcha` | `String` | 是 | 新邮箱验证码 |
| `oldEmailCaptcha` | `String` | 是 | 旧邮箱验证码 |
| `migrateArgs` | `Object` | 否 | 账号迁移用的参数 |
| `callback` | `RXRequestCallback` | 是 | 回调接口 |

---

### `unBindEmail`

解绑邮箱。

**方法签名**：

```java
void unBindEmail(String email, String captcha_code, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `email` | `String` | 是 | 邮箱 |
| `captcha_code` | `String` | 是 | 验证码 |
| `callback` | `RXRequestCallback` | 是 | 回调接口 |

---

## 🆔 实名认证

### `realAuth` (重载方法 1)

实名认证（标准模式）。

**方法签名**：

```java
void realAuth(String realname, String idcard, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `realname` | `String` | 是 | 姓名 |
| `idcard` | `String` | 是 | 身份证号 |
| `callback` | `RXRequestCallback` | 是 | 回调接口 |

---

### `realAuth` (重载方法 2)

实名认证（支持快速认证）。

**方法签名**：

```java
void realAuth(String realname, String idcard, boolean isFastRealAuth, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `realname` | `String` | 是 | 姓名 |
| `idcard` | `String` | 是 | 身份证号 |
| `isFastRealAuth` | `boolean` | 否 | 是否使用快速认证（默认值为 false） |
| `callback` | `RXRequestCallback` | 是 | 回调接口 |

---

## 🗑️ 账号注销

### `deregister`

申请注销账号。

**方法签名**：

```java
void deregister(RXDeregisterConfig deregisterConfig, RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `deregisterConfig` | `RXDeregisterConfig` | 是 | 注销配置对象，包含：<br>- `idcard`：身份证号（String）<br>- `realname`：真实姓名（String）<br>- `cpdata`：CP 数据（String）<br>- `thirdParams`：第三方参数（Map<String, Object>） |
| `callback` | `RXRequestCallback` | 是 | 回调接口 |

---

### `deregisterCancel`

撤销注销申请。

**方法签名**：

```java
void deregisterCancel(RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `callback` | `RXRequestCallback` | 是 | 回调接口 |

---

## 🔍 查询相关

### `searchBindingAccounts`

查询绑定账号列表。

**方法签名**：

```java
void searchBindingAccounts(RXRequestCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `callback` | `RXRequestCallback` | 是 | 回调接口 |

---

## ⚙️ 其他配置

### `setRuiXueSdkCallback`

设置 SDK 全局回调。

**方法签名**：

```java
void setRuiXueSdkCallback(RuiXueSdkCallback ruiXueSdkCallback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `ruiXueSdkCallback` | `RuiXueSdkCallback` | 是 | SDK 回调对象，包含：<br>- `onLogout(int code, String msg)`：登出回调<br>- `onSwitchAccount(int code, String data)`：切换账号回调<br>- `exitApp()`：退出应用回调 |

---

### `exitApp`

退出应用。

**方法签名**：

```java
boolean exitApp(Activity activity, OnAppExitCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `activity` | `Activity` | 是 | 应用上下文 |
| `callback` | `OnAppExitCallback` | 是 | 退出应用回调 |

**返回值**：`boolean`（是否成功退出）

---

### `setSubChannelId`

设置子渠道 ID。

**方法签名**：

```java
void setSubChannelId(String subChannelid)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `subChannelid` | `String` | 是 | 子渠道 ID |

---

## 📝 重构注意事项

### 1. 参数校验

- 必填参数需在接口层做非空校验
- 校验失败应返回统一错误码（参考错误码规范）

### 2. 错误处理

- 所有接口失败必须返回统一错误结构：`code`（int）、`msg`（string）
- 服务端错误码为 6 位整数，需原样透传
- 客户端错误码使用 4 位（3000-3999 为登录相关错误）

### 3. 扩展字段

- `ext`、`migrateArgs` 等扩展字段需支持任意合法 JSON 类型
- 重构时保持向后兼容，避免破坏现有调用

### 4. 登录方式枚举

- `LoginType` 注解定义了所有支持的登录方式
- 新增登录方式需同步更新枚举定义

### 5. 账号迁移参数

- `migrateArgs` 用于账号迁移场景，需透传给 CP 服务器
- 重构时需保持透传逻辑不变

---

## 🔗 相关文档

- [回调接口说明](./callback.md)
- [错误码规范](../../common/specs/error_codes.md)
- [错误格式说明](../../common/api/01_error_format.md)
- [Passport 接口契约](../../common/api/20_passport.md)
