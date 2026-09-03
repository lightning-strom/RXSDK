## 支付/兑换（Pay）

### 接口清单（后端 path）

| 功能 | path | 默认需登录 | SDK 调用点 |
|---|---|---:|---|
| 支付下单 | `v1/ke/order` | 是 | `BillingClient` / 插件支付流程（POST，`sign(true)`） |
| 道具兑换（物品核销） | `v1/operationtoolsapi/user_data_operation_platform/item_redemption` | 是 | `RXApiHelper.exchange(...)`（POST，`sign(true)`） |

### 约定（SDK 行为）

- 支付链路通常涉及三方插件（支付宝/微信/渠道等），SDK 仅保证对外回调为统一错误结构。
- 回调线程：网络回调切回主线程（UI 线程）。

