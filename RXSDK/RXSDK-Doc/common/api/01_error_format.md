## 统一错误结构与错误码

### 统一错误结构（跨端一致）

SDK 对外失败必须可映射为统一 JSON 字段（Android/iOS/Unity/小游戏一致）：

- `code`：int
- `msg`：string
- 可选：`trace_id`、`thirdcode`、`thirdmsg`、`data`

示例：

```json
{
  "code": 4000,
  "msg": "支付失败",
  "trace_id": "xxxx",
  "thirdcode": "WX_ERROR",
  "thirdmsg": "微信返回错误",
  "data": {
    "scene": "pay"
  }
}
```

### 错误码来源与位数

- **服务端错误码（强制）**：6 位整数，SDK 必须原样透传，不改写位数、不复用语义。
- **客户端错误码（SDK 3.2.x+ 约定）**：4 位整数，按区间区分场景：
  - 1000–1999：网络相关
  - 2000–2999：初始化相关
  - 3000–3999：登录相关
  - 4000–4999：支付相关
  - 5000–5999：分享相关
  - 6000–6999：权限与未安装相关

### 三方错误码

- 三方 SDK / 渠道的原始错误码与文案分别放在 `thirdcode` / `thirdmsg`，不要塞进 `code`。

### SDK 内部对应关系（便于重构校验）

- **`RXErrorCode`**：SDK 客户端错误码（例如 `DISAGREE_PRIVACY=6000`、`LOGIN_ERROR=3000`、`PASSWORD_FORMAT_ERROR=3100` 等）。
- **`RXException`**：网络/运行时类错误码（例如 `DEFAULT_ERROR=1000`、`IO_ERROR=1100`、`JSON_ERROR=9030` 等）。

> 重构原则：对外 `code/msg` 语义保持稳定；新增错误码只能新增枚举值，不可复用历史含义。
