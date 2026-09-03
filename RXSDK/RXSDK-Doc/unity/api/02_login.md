# 账号登录

> **版本**：3.7.x  
> **更新日期**：2026-01-28
>
> 用户登录、注册、注销、验证码、账号绑定、用户信息、密码管理、实名认证

## 📋 接口概览

**入口类**：`RXSDK`（`namespace RuiXue`）

**回调约定**：所有异步接口统一使用 `SdkCallback`，回调自动切换至 **Unity 主线程**。

**主要功能**：

- 多方式登录（游客、账号密码、验证码、第三方）
- 用户注册
- 退出登录 / 账号注销
- 发送 / 校验验证码
- 手机号 / 邮箱绑定与解绑
- 查询用户信息 / 修改用户信息
- 密码修改 / 重置
- 实名认证

---

## 🔐 登录 / 退出

### `Login`

登录，支持多种登录方式。

**方法签名**：

```csharp
void RXSDK.Login(LoginConfig config, SdkCallback callback)
Task<SdkResult> RXSDK.LoginAsync(LoginConfig config)
```

**参数说明（`LoginConfig`）**：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `loginType` | `string` | 是 | 登录方式，取值见 `LoginMethod` 常量表 |
| `username` | `string` | 否 | 用户名/手机号/邮箱；`username` / `captchacode` 时必填 |
| `password` | `string` | 否 | 密码；`username` 登录时必填 |
| `captchaCode` | `string` | 否 | 验证码；`captchacode` 登录时必填 |
| `loginOpenId` | `string` | 否 | 二次登录凭证（Token 续期使用） |
| `permissions` | `string[]` | 否 | 第三方平台授权权限（如 Google `["email","profile"]`） |
| `ext` | `Dictionary<string,object>` | 否 | 扩展参数，各渠道额外 Key 见下表 |
| `force` | `bool` | 否 | 强制登录（踢下其他设备），默认 `false` |
| `forbid_visitor` | `bool` | 否 | 禁止游客登录，默认 `false` |
| `migrateArgs` | `object` | 否 | 账号迁移参数，透传给 CP 账号查询接口 |
| `signFields` | `string[]` | 否 | 需要签名的字段，可选值：`nickname`、`avatar`、`openid`、`region`、`sex`、`age` |

**`loginType` 常量表（`LoginMethod.*`）**：

| 常量 | 字符串值 | 额外必填字段 | 说明 |
|------|---------|------------|------|
| `LoginMethod.Guest` | `"guest"` | — | 游客（设备码），无需额外参数 |
| `LoginMethod.Username` | `"username"` | `username` + `password` | 账号密码登录 |
| `LoginMethod.CaptchaCode` | `"captchacode"` | `username` + `captchaCode` | 手机/邮箱验证码登录 |
| `LoginMethod.QuickPhone` | `"quickphone"` | `ext.alikey` | 阿里一键登录 |
| `LoginMethod.Virtual` | `"virtual"` | — | 虚拟账号（无通行证） |
| `LoginMethod.Wechat` | `"wechat"` | `ext.appid` | 微信登录 |
| `LoginMethod.Minigame` | `"minigame"` | — | 微信小游戏登录 |
| `LoginMethod.MobileQQ` | `"mobileqq"` | — | QQ 登录 |
| `LoginMethod.YSDK` | `"ysdk"` | `ext.platform_type` | 应用宝登录 |
| `LoginMethod.KuaiShou` | `"kuaishou"` | — | 快手登录 |
| `LoginMethod.Apple` | `"apple"` | — | Apple 登录（iOS） |
| `LoginMethod.HuaWei` | `"huawei"` | — | 华为账号 |
| `LoginMethod.HWJos` | `"hwjos"` | — | 华为拂袖账号 |
| `LoginMethod.HuaWeiH5` | `"huaweih5"` | — | 华为 H5 登录 |
| `LoginMethod.Mi` | `"mi"` | — | 小米账号 |
| `LoginMethod.Vivo` | `"vivo"` | — | vivo 账号 |
| `LoginMethod.Oppo` | `"oppo"` | — | OPPO 账号 |
| `LoginMethod.DouYin` | `"douyin"` | — | 抖音账号 |
| `LoginMethod.DouYinH5` | `"douyinh5"` | `force = true` | 抖音小游戏 |
| `LoginMethod.BiliBili` | `"bilibili"` | — | B 站账号 |
| `LoginMethod.TapTap` | `"taptap"` | — | TapTap |
| `LoginMethod.BaiduNet` | `"baidunet"` | — | 百度网讯 |
| `LoginMethod.WeiLe` | `"weile"` | — | 微乐小游戏 |
| `LoginMethod.Google` | `"google"` | — | Google（海外） |
| `LoginMethod.FaceBook` | `"facebook"` | 可选 `ext.ext.app_associated_bussiness` | Facebook（海外） |
| `LoginMethod.Line` | `"line"` | — | LINE（海外） |
| `LoginMethod.Zalo` | `"zalo"` | — | Zalo（越南） |
| `LoginMethod.Tiktok` | `"tiktok"` | — | TikTok（海外） |
| `LoginMethod.Instagram` | `"instagram"` | — | Instagram（海外） |
| `LoginMethod.Reddit` | `"reddit"` | — | Reddit（海外） |
| `LoginMethod.SnapChat` | `"snapchat"` | — | Snapchat（海外，无登录功能） |
| `LoginMethod.Qoo` | `"qoo"` | — | Qoo（东南亚） |
| `LoginMethod.LEIDIAN` | `"leidian"` | — | 雷电 |
| `LoginMethod.HIHONOR` | `"hihonor"` | — | 荣耀 |
| `LoginMethod.QUICK` | `"quick"` | — | Quick |
| `LoginMethod._4399` | `"4399"` | — | 4399 |

**响应结构**：

成功时 `result.Data` 为 JSON 字符串：

```json
{
    "open_id": "rxuNZP3GnkxYVXMf2xW6UZEKdg0z7wLm",
    "token": "eyJhbGci...",
    "login_type": "guest",
    "nickname": "游客_abc",
    "avatar": "https://cdn.ruixue.com/avatar/default.png",
    "sex": 0,
    "is_real_auth": false,
    "is_bind_phone": false,
    "is_bind_email": false
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `open_id` | `string` | 用户唯一标识，需传给游戏服务端验证 |
| `token` | `string` | 登录凭证，用于接口鉴权 |
| `login_type` | `string` | 实际登录方式 |
| `nickname` | `string` | 用户昵称 |
| `avatar` | `string` | 头像 URL |
| `sex` | `int` | 性别：`0` 女，`1` 男 |
| `is_real_auth` | `bool` | 是否已实名认证 |
| `is_bind_phone` | `bool` | 是否已绑定手机号 |
| `is_bind_email` | `bool` | 是否已绑定邮箱 |

**示例用法**：

```csharp
// 游客登录
RXSDK.Login(new LoginConfig { loginType = LoginMethod.Guest }, result => result.Match(
    ok:   data  => Debug.Log("登录成功: " + data),
    fail: error => Debug.LogError($"[{result.Code}] {error}")
));

// 账号密码登录
var config = new LoginConfig {
    loginType = LoginMethod.Username,
    username  = "user@example.com",
    password  = "Abc@123456",
};
RXSDK.Login(config, OnLoginResult);

// 微信登录（需传 appid）
var wxConfig = new LoginConfig {
    loginType = LoginMethod.Wechat,
    ext = new Dictionary<string, object> { { "appid", "wxd9cba83a0a1ef20d" } },
};

// 抖音小游戏登录
var dyConfig = new LoginConfig { loginType = LoginMethod.DouYinH5, force = true };

// async 写法
var result = await RXSDK.LoginAsync(config);
if (!result) return;
```

---

### `Logout`

主动退出登录，清除本地登录态。

**方法签名**：

```csharp
void RXSDK.Logout(SdkCallback callback)
Task<SdkResult> RXSDK.LogoutAsync()
```

**响应结构**：

成功时 `result.IsSuccess = true`，无需读取 `result.Data`。

**示例用法**：

```csharp
RXSDK.Logout(result => result.Match(
    ok:   _ => SceneManager.LoadScene("LoginScene"),
    fail: e => Debug.LogError("登出失败: " + e)
));
```

> **注意**：主动登出由游戏侧调用；被动登出（Token 过期、被踢下线）通过 `SetSdkCallback` 的 `onLogout` 回调通知。

---

## 📝 注册

### `Register`

账号注册，注册成功即已登录。

**方法签名**：

```csharp
void RXSDK.Register(
    string username,
    string password,
    string captchaCode,
    Dictionary<string, object> ext,
    SdkCallback callback
)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `username` | `string` | 是 | 用户名/手机号/邮箱 |
| `password` | `string` | 是 | 密码，6-32 位 |
| `captchaCode` | `string` | 否 | 验证码（手机/邮箱注册时填写） |
| `ext` | `Dictionary<string,object>` | 否 | 扩展参数，见下表 |
| `callback` | `SdkCallback` | 是 | 回调 |

**`ext` 常用字段**：

| Key | 类型 | 说明 |
|-----|------|------|
| `nickname` | `string` | 初始昵称 |
| `avatarUrl` | `string` | 初始头像 URL |
| `sex` | `string` | 性别：`"0"` 女，`"1"` 男 |

**响应结构**：

同 [Login 响应结构](#响应结构)，注册成功即自动登录。

**示例用法**：

```csharp
var ext = new Dictionary<string, object> { { "nickname", "小明" }, { "sex", "1" } };
RXSDK.Register("user@example.com", "Abc@123456", "1234", ext, result => result.Match(
    ok:   data  => Debug.Log("注册成功"),
    fail: error => Debug.LogError($"[{result.Code}] {error}")
));
```

---

## 🔑 验证码

### `SendCaptcha`

发送短信/邮件验证码。

**方法签名**：

```csharp
void RXSDK.SendCaptcha(CaptchaType type, string target, string purpose, SdkCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `type` | `CaptchaType` | 是 | 验证码类型：`CaptchaType_email`（邮箱）或 `CaptchaType_phone`（手机） |
| `target` | `string` | 是 | 目标邮箱地址或手机号 |
| `purpose` | `string` | 是 | 用途标识，如 `"login"`、`"bind"`、`"reset_password"` |
| `callback` | `SdkCallback` | 是 | 回调 |

**响应结构**：

成功时 `result.IsSuccess = true`，无需读取 `result.Data`。

**示例用法**：

```csharp
// 发送邮箱验证码
RXSDK.SendCaptcha(CaptchaType.CaptchaType_email, "user@example.com", "login", result => result.Match(
    ok:   _ => Debug.Log("验证码已发送"),
    fail: e => Debug.LogError("发送失败: " + e)
));

// 发送手机验证码
RXSDK.SendCaptcha(CaptchaType.CaptchaType_phone, "18243088053", "login", OnResult);
```

---

### `VerifyCaptcha`

校验验证码。

**方法签名**：

```csharp
void RXSDK.VerifyCaptcha(CaptchaType type, string target, string purpose, string code, SdkCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `type` | `CaptchaType` | 是 | 验证码类型 |
| `target` | `string` | 是 | 目标邮箱或手机号 |
| `purpose` | `string` | 是 | 用途标识（须与 `SendCaptcha` 一致） |
| `code` | `string` | 是 | 用户输入的验证码 |
| `callback` | `SdkCallback` | 是 | 回调 |

**响应结构**：

成功时 `result.IsSuccess = true`，无需读取 `result.Data`。

---

## 📱 账号绑定 / 解绑

### `BindPhone`

绑定手机号。

**方法签名**：

```csharp
void RXSDK.BindPhone(string phone, string password, string captchaCode, object migrateArgs, SdkCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `phone` | `string` | 是 | 手机号 |
| `password` | `string` | 否 | 密码（绑定手机号时可设置密码） |
| `captchaCode` | `string` | 是 | 手机验证码 |
| `migrateArgs` | `object` | 否 | 账号迁移参数 |
| `callback` | `SdkCallback` | 是 | 回调 |

**响应结构**：成功时 `result.IsSuccess = true`。

---

### `UnBindPhone`

解绑手机号。

**方法签名**：

```csharp
void RXSDK.UnBindPhone(string phone, string captchaCode, SdkCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `phone` | `string` | 是 | 已绑定的手机号 |
| `captchaCode` | `string` | 是 | 手机验证码 |
| `callback` | `SdkCallback` | 是 | 回调 |

---

### `ChangePhone`

修改绑定的手机号。

**方法签名**：

```csharp
void RXSDK.ChangePhone(string newPhone, string newCaptcha, string oldCaptcha, object migrateArgs, SdkCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `newPhone` | `string` | 是 | 新手机号 |
| `newCaptcha` | `string` | 是 | 新手机号收到的验证码 |
| `oldCaptcha` | `string` | 是 | 旧手机号收到的验证码 |
| `migrateArgs` | `object` | 否 | 账号迁移参数 |
| `callback` | `SdkCallback` | 是 | 回调 |

---

### `BindEmail`

绑定邮箱。

**方法签名**：

```csharp
void RXSDK.BindEmail(string email, string password, string captchaCode, object migrateArgs, SdkCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `email` | `string` | 是 | 邮箱地址 |
| `password` | `string` | 否 | 密码 |
| `captchaCode` | `string` | 是 | 邮箱验证码 |
| `migrateArgs` | `object` | 否 | 账号迁移参数 |
| `callback` | `SdkCallback` | 是 | 回调 |

---

### `UnBindEmail`

解绑邮箱。

**方法签名**：

```csharp
void RXSDK.UnBindEmail(string email, string captchaCode, SdkCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `email` | `string` | 是 | 已绑定的邮箱 |
| `captchaCode` | `string` | 是 | 邮箱验证码 |
| `callback` | `SdkCallback` | 是 | 回调 |

---

### `SearchBindingAccounts`

查询当前用户已绑定的账号列表（手机号、邮箱、第三方）。

**方法签名**：

```csharp
void RXSDK.SearchBindingAccounts(SdkCallback callback)
```

**响应结构**：

成功时 `result.Data` 为 JSON 字符串，包含各绑定账号信息（以服务端实际返回为准）。

---

## 👤 用户信息

### `GetUserInfo`

获取当前登录用户信息。

**方法签名**：

```csharp
void RXSDK.GetUserInfo(SdkCallback callback)
Task<SdkResult> RXSDK.GetUserInfoAsync()
```

**响应结构**：

成功时 `result.Data` 为 JSON 字符串：

```json
{
    "open_id": "rxuNZP3GnkxYVXMf2xW6UZEKdg0z7wLm",
    "nickname": "用户昵称",
    "avatar": "https://cdn.ruixue.com/avatar/xxx.png",
    "sex": 1,
    "region": "CN",
    "is_real_auth": true,
    "is_bind_phone": true,
    "is_bind_email": false,
    "login_type": "username"
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `open_id` | `string` | 用户唯一标识 |
| `nickname` | `string` | 昵称 |
| `avatar` | `string` | 头像 URL |
| `sex` | `int` | 性别：`0` 女，`1` 男 |
| `region` | `string` | 地区 |
| `is_real_auth` | `bool` | 是否已实名 |
| `is_bind_phone` | `bool` | 是否已绑定手机 |
| `is_bind_email` | `bool` | 是否已绑定邮箱 |
| `login_type` | `string` | 当前登录方式 |

---

### `UpdateUserInfo`

修改用户信息。

**方法签名**：

```csharp
void RXSDK.UpdateUserInfo(string nickname, string avatarUrl, string region, int sex, SdkCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `nickname` | `string` | 否 | 新昵称，传空字符串表示不修改 |
| `avatarUrl` | `string` | 否 | 新头像 URL，传空字符串表示不修改 |
| `region` | `string` | 否 | 地区，传空字符串表示不修改 |
| `sex` | `int` | 否 | 性别：`0` 女，`1` 男，传 `-1` 表示不修改 |
| `callback` | `SdkCallback` | 是 | 回调 |

**示例用法**：

```csharp
RXSDK.UpdateUserInfo("新昵称", "https://example.com/avatar.png", "CN", 1, result => result.Match(
    ok:   _ => Debug.Log("修改成功"),
    fail: e => Debug.LogError("修改失败: " + e)
));
```

---

## 🔐 密码管理

### `ChangePassword`

修改密码（需要旧密码验证）。

**方法签名**：

```csharp
void RXSDK.ChangePassword(string oldPassword, string newPassword, SdkCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `oldPassword` | `string` | 是 | 当前密码 |
| `newPassword` | `string` | 是 | 新密码，6-32 位 |
| `callback` | `SdkCallback` | 是 | 回调 |

---

### `ResetPassword`

重置密码（忘记密码场景，通过验证码验证）。

**方法签名**：

```csharp
void RXSDK.ResetPassword(string username, string password, string captchaCode, object migrateArgs, SdkCallback callback)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `username` | `string` | 是 | 手机号或邮箱 |
| `password` | `string` | 是 | 新密码 |
| `captchaCode` | `string` | 是 | 验证码 |
| `migrateArgs` | `object` | 否 | 账号迁移参数 |
| `callback` | `SdkCallback` | 是 | 回调 |

---

## 📋 实名认证

### `RealAuth`

提交实名认证信息。

**方法签名**：

```csharp
void RXSDK.RealAuth(string realname, string idcard, SdkCallback callback)
Task<SdkResult> RXSDK.RealAuthAsync(string realname, string idcard)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `realname` | `string` | 是 | 真实姓名 |
| `idcard` | `string` | 是 | 身份证号 |
| `callback` | `SdkCallback` | 是 | 回调 |

**响应结构**：

成功时 `result.IsSuccess = true`，实名认证状态更新后，`GetUserInfo` 中 `is_real_auth` 将为 `true`。

---

### `GetIIFAARedirectURL`

获取 IIFAA 支付宝快速实名跳转地址（国内防沉迷场景）。

**方法签名**：

```csharp
void RXSDK.GetIIFAARedirectURL(string appName, string thirdPartSchema, SdkCallback callback)
Task<SdkResult> RXSDK.GetIIFAARedirectURLAsync(string appName, string thirdPartSchema)
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `appName` | `string` | 是 | 应用名称 |
| `thirdPartSchema` | `string` | 是 | 游戏自定义 URL Scheme，用于支付宝完成后回跳 |
| `callback` | `SdkCallback` | 是 | 回调 |

**响应结构**：

成功时 `result.Data` 为跳转 URL 字符串，游戏侧需调用 `Application.OpenURL()` 打开。

---

## 🗑️ 账号注销

### `Deregister`

申请注销账号（注销需审核周期）。

**方法签名**：

```csharp
void RXSDK.Deregister(RXDeregisterConfig config, SdkCallback callback)
```

**参数说明（`RXDeregisterConfig`）**：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `idcard` | `string` | 否 | 身份证号 |
| `realname` | `string` | 否 | 真实姓名 |
| `cpdata` | `string` | 否 | CP 自定义数据，透传给 CP 账号注销接口 |
| `thirdParams` | `Dictionary<string,object>` | 否 | 第三方扩展参数 |

**响应结构**：

成功时 `result.IsSuccess = true`，表示注销申请已提交。

**示例用法**：

```csharp
var config = new RXDeregisterConfig
{
    idcard    = "220281199103162215",
    realname  = "张三",
    cpdata    = "game_role_id_123",
};
RXSDK.Deregister(config, result => result.Match(
    ok:   _ => Debug.Log("注销申请已提交"),
    fail: e => Debug.LogError("注销失败: " + e)
));
```

---

### `DeregisterCancel`

撤销注销申请。

**方法签名**：

```csharp
void RXSDK.DeregisterCancel(SdkCallback callback)
```

**响应结构**：

成功时 `result.IsSuccess = true`。

---

## 🔗 相关文档

- [初始化与配置](./01_init.md)
- [支付](./03_pay.md)
- [回调说明](./callback.md)
- [错误码规范](../../common/specs/error_codes.md)
