## 总览

### 目标

把 SDK 对接方真正会用到的“接口契约”固定下来：

- **后端 path 列表**：来自 `RXApiPath`（见 `10_endpoints_used_by_sdk.md`）
- **SDK 对外行为**：来自 `RXSdkApi` / `IPassportApi` 等（入参约束、回调线程、错误结构、鉴权）

### 请求与鉴权（SDK 行为）

- **BaseUrl**：SDK 运行时通过 `RuiXueSdk.getBaseUrls()` 取得并拼接 `RXApiPath` 的相对 path（建议只配置 HTTPS）。
- **AccessToken**：当请求 `needLoggedIn=true` 时，SDK 会自动在 Header 中追加 `ruixue-accesstoken`。
- **RefreshToken**：刷新令牌接口会在 Header 中追加 `ruixue-refreshtoken`（见 `20_passport.md` 的 RefreshToken）。
- **是否需要登录**：默认由 `RXApiPath.needVerifyToken(apiPath)` 决定（即：不在 IGNORE_TOKEN_ARRAY 的接口默认需要登录）。
  - 例外：验证码发送/校验接口会根据是否包含 `email/phone` 动态决定走 `SEND_CAPTCHA` 或 `SEND_CAPTCHA_AUTH`，并动态设置 `needLoggedIn`（详见 `20_passport.md`）。

### 回调线程（SDK 行为）

- **网络请求回调**：SDK 会把 `RXJSONCallback.onSuccess/onFailed/onError` 切回到**主线程**（UI 线程）。
- **插件回调**：三方渠道插件可能在其内部线程回调；SDK 对外层一般会再统一转发（以实际调用链为准）。

### trace_id（排查链路）

- SDK 会为请求生成 UUID，并尽量填充到失败回包的 `trace_id` 字段（便于排查）。

### 响应结构（restfulData）

- SDK 支持两类返回风格：
  - **restfulData=true（默认）**：后端返回形如 `{code,msg,data,trace_id}`；成功时回调 `onSuccess(data)`。
  - **restfulData=false**：后端返回结构可能不是标准 restful；SDK 会把整个 JSON 透传给回调（成功时仍走 `onSuccess`，但数据来源不同）。
