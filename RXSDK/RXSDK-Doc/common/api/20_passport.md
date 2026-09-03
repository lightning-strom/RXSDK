## 通行证（Passport）

> 参考业务文档：[`#/view?path=b7477167-e1a1-426a-81c1-083fd64ef4aa`](https://doc.ruixueyun.com/main/#/view?path=b7477167-e1a1-426a-81c1-083fd64ef4aa)

### 接口清单（后端 path）

| 功能 | path | 默认需登录 | SDK 主要调用点 |
|---|---|---:|---|
| 用户激活（首次启动归因） | `v1/attribution/user/activated` | 否 | `UserActivateManager.userActivated(...)` |
| 注册 | `v1/passport/account/register` | 否 | `RXSdkApi.register(...)` → `PassportManager.register(...)` |
| 登录（凭证） | `v1/passport/account/login_by_credential` | 否 | `RXSdkApi.login(...)` → `PassportManager.startLogin(...)` |
| 登录（二次凭证） | `v1/passport/account/login_by_token` | 否 | `PassportManager.startLogin(...)` |
| 发送验证码（免登录） | `v1/passport/captcha/send` | 否 | `RXApiHelper.Passport.sendCaptcha(...)` |
| 发送验证码（需登录） | `v1/passport/captcha/send_auth` | 是 | `RXApiHelper.Passport.sendCaptcha(...)` |
| 校验验证码 | `v1/passport/captcha/verify` | 是 | `RXApiHelper.Passport.verifyCaptcha(...)` |
| 刷新令牌 | `v1/passport/token/refresh` | 否 | `AccessTokenManager.refreshCurrentAccessToken(...)` |
| 获取用户信息 | `v1/passport/user/get_info` | 是 | `RXSdkApi.getUserInfo(...)` → `PassportManager.getUserInfo(...)` |
| 获取指定用户信息 | `v1/passport/user/info_by_field` | 是 | `RXSdkApi.getUserInfoByField(...)` → `PassportManager.getUserInfoByField(...)`；JSSDK `getUserInfoByField(...)` |
| 同步应用信息 | `v1/passport/user/sync_app_info` | 是 | `PassportManager.syncInfo(...)` |
| 修改用户信息 | `v1/passport/user/update_info` | 是 | `RXSdkApi.updateUserInfo(...)` → `PassportManager.updateUserInfo(...)` |
| 绑定手机 | `v1/passport/user/bind_phone` | 是 | `PassportManager.bindPhone(...)` |
| 解绑手机 | `v1/passport/user/unbind_phone` | 是 | `PassportManager.unbindPhone(...)` |
| 修改手机 | `v1/passport/user/change_phone` | 是 | `PassportManager.changePhone(...)` |
| 绑定邮箱 | `v1/passport/user/bind_email` | 是 | `PassportManager.bindEmail(...)` |
| 解绑邮箱 | `v1/passport/user/unbind_email` | 是 | `PassportManager.unbindEmail(...)` |
| 修改邮箱 | `v1/passport/user/change_email` | 是 | `PassportManager.changeEmail(...)` |
| 修改密码 | `v1/passport/user/change_password` | 是 | `PassportManager.changePwd(...)` |
| 重置密码 | `v1/passport/user/reset_password` | 否 | `PassportManager.resetPwd(...)` |
| 实名认证 | `v1/passport/user/realauth` | 是 | `PassportManager.certification(...)` |
| 注销账号 | `v1/passport/user/deregister` | 是 | `PassportManager.deregister(...)` |
| 撤销注销申请 | `v1/passport/user/cancel_deregister` | 是 | `PassportManager.deregisterCancel(...)` |
| 查询账号 | `v1/passport/user/query` | 否 | `RXSdkApi.searchHasAccounts(...)`（`restfulData=false`） |
| 查询已绑定账号 | `v1/passport/user/bound_accounts` | 是 | `RXSdkApi.searchBindingAccounts(...)`（`restfulData=false`） |

### 对外通用约束（SDK 行为）

- **隐私协议**：未同意隐私协议时，登录/注册会直接失败（`code=6000 DISAGREE_PRIVACY`）。
- **回调线程**：网络接口回调会切到主线程（UI 线程）。
- **敏感字段**：`password/captcha_code/token` 等禁止落日志；重构时要保持日志脱敏。

---

### 注册（Register）

- **后端 path**：`v1/passport/account/register`
- **默认需登录**：否
- **SDK 入口**：
  - `RXSdkApi.register(Map<String,Object>, RXJSONCallback)`
  - `RXSdkApi.register(RegisterParams, RXJSONCallback)`
  - `RXSdkApi.register(String username, String password, String captchaCode, Map<String,Object> ext, RXJSONCallback)`

#### 请求字段（Body Map/JSON）

| 字段 | 类型 | 必填 | 说明 |
|---|---|---:|---|
| `type` | int | 是 | `1`=账号注册，`2`=手机号注册，`3`=邮箱注册 |
| `username` | string | 是 | 账号/手机号/邮箱（取决于 type） |
| `password` | string | 是 | **调用方建议传明文**；SDK 内部会做 MD5 并转大写后再请求 |
| `captcha_code` | string | 条件必填 | type=`2/3` 必填；type=`1` 可传空字符串 |
| `nickname` | string | 否 | 昵称 |
| `avatarUrl` | string | 否 | 头像地址（也兼容 `avatar_url` → 自动映射为 `avatarUrl`） |
| `birthday` | string | 否 | 出生年份 |
| `sex` | string/int | 否 | 性别（历史上有 string/number 混用；重构时保持兼容） |
| `device` | object | 否 | 设备标识信息（SDK 可能自动补齐） |
| `user_source` | object | 否 | 来源/分享等扩展 |
| `migrate_args` | any | 否 | 账号迁移透传字段 |
| `ignore_check_password` | bool/string/int | 否 | 跳过密码格式校验（不会跳过 MD5 处理） |

#### 响应与回调

- 成功：`callback.onSuccess(data)`（data 为后端 `data`，SDK 可能把部分请求字段合并回去）
- 失败：`callback.onFailed({code,msg,trace_id,...})`
- 异常：`callback.onError(RXException)`（网络/解析等）

---

### 登录（Login）

- **后端 path**：
  - `v1/passport/account/login_by_credential`
  - `v1/passport/account/login_by_token`
- **默认需登录**：否
- **SDK 入口**：
  - `RXSdkApi.login(Activity, Map<String,Object>, RXJSONCallback)`
  - `RXSdkApi.login(Activity, LoginParams, RXJSONCallback)`

#### 请求字段（常见）

| 字段 | 类型 | 必填 | 说明 |
|---|---|---:|---|
| `method` | string | 是 | 登录方式（账号/游客/渠道等，参考 `LoginMethod`） |
| `ts` | long/int | 否 | 时间戳（SDK 侧会补齐） |
| `username` | string | 条件必填 | method=`username` 时必填 |
| `password` | string | 条件必填 | method=`username` 时必填；SDK 内部会做 MD5 并转大写 |
| `login_openid` | string | 否 | 二次登录凭证（首次登录成功后返回） |
| `bind_thirdparty` | int | 否 | 本次是否为绑定三方登录方式（1/0） |
| `appid` | string | 否 | 微信等三方登录的 appid |
| `ext` | object | 否 | 三方渠道登录成功后的扩展数据（SDK 内部可能自动填充） |
| `sign_fields` | string[] | 否 | 指定字段参与签名校验（CPKEY） |
| `user_source` | object | 否 | 来源/分享扩展 |
| `migrate_args` | any | 否 | 账号迁移透传字段 |
| `device` | object | 否 | 设备标识信息 |

#### 典型返回字段（data）

> 登录成功后返回字段较多，核心关注：`token(access/refresh/expire)`、`openid`、`login_openid`、`flag/attr` 等（详见 `LoginData` / `AccessToken`）。

---

### 发送验证码（SendCaptcha）

- **后端 path**：
  - `v1/passport/captcha/send`：当 `email/phone` 存在时（免登录）
  - `v1/passport/captcha/send_auth`：当 `email/phone` 都不存在时（需要登录 token）
- **SDK 入口**：
  - `RXSdkApi.sendCaptcha(...)` 系列
  - `RXApiHelper.Passport.sendCaptcha(Map, callback)`

#### 请求字段

| 字段 | 类型 | 必填 | 说明 |
|---|---|---:|---|
| `email` | string | 二选一 | 与 `phone` 二选一 |
| `phone` | string | 二选一 | 与 `email` 二选一 |
| `purpose` | string | 是 | 用途标识（参考 `CaptchaPurpose`：`register/bindphone/resetpwd/...`） |
| `tencent_captcha.randstr` | string | 否 | 图形验证码随机串 |
| `tencent_captcha.ticket` | string | 否 | 图形验证码 ticket |

#### 特殊错误处理（SDK 行为）

- 当失败码为 `312241` 时，SDK 会尝试弹出 `CaptchaVerifyView` 进行图形验证码校验（并从 `cause.data.captcha_app_id` 读取 appId）。

---

### 校验验证码（VerifyCaptcha）

- **后端 path**：`v1/passport/captcha/verify`
- **鉴权**：当 `email/phone` 都不存在时需要登录 token（SDK 会动态设置）
- **请求字段**：`email/phone` + `purpose` + `captcha_code`

---

### 刷新令牌（RefreshToken）

- **后端 path**：`v1/passport/token/refresh`
- **鉴权**：不需要 access token；但需要 Header `ruixue-refreshtoken: <refresh_token>`

---

### 修改/重置密码（ChangePwd / ResetPwd）

- **修改密码 path**：`v1/passport/user/change_password`（需登录）
  - 典型字段：`old_password`、`new_password`（SDK 会做 MD5 大写）
- **重置密码 path**：`v1/passport/user/reset_password`（免登录）
  - 典型字段：`username`、`password`、`captcha_code`（SDK 会做 MD5 大写）

---

### 实名认证（Certification）

- **后端 path**：`v1/passport/user/realauth`（需登录）
- **典型字段**：`realname`、`idcard`、`isFastRealAuth`（可选）
- **SDK 行为**：成功/失败回调会尽量附带回传 `realname/idcard`（便于业务侧显示/排查）。

