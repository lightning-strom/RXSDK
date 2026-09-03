## 法务（Legal）

### 接口清单（后端 path）

| 功能 | path | 默认需登录 | SDK 调用点 |
|---|---|---:|---|
| 法务数据 | `v1/operationapi/legal` | 否 | `RXApiHelper.legal(...)`（GET） |
| 法务条款（terms） | `v1/operationapi/legal/terms` | 是* | `RXApiHelper.legalTerms(...)`（GET） |

> 说明：`LEGAL_TERMS` 在 `RXApiPath` 里默认“需要登录”，但调用方是否真的必须登录依赖后端；重构时建议以线上真实要求为准，并保留兼容（必要时允许显式 `setNeedLoggedIn(false)` 的安全扩展）。

