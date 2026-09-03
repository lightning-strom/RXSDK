## 分享/调度（Share）

### 接口清单（后端 path）

| 功能 | path | 默认需登录 | SDK 调用点 |
|---|---|---:|---|
| 获取分享平台列表 | `v1/operationapi/share/platforms` | 是 | `ShareManager.getPlatforms(...)`（GET） |
| 获取分享数据 | `v1/operationapi/share/data` | 是 | `ShareManager.getData(...)`（POST，`sign(true)`） |
| 调度初始化 | `v1/operationapi/scheduling/init` | 是 | `ShareManager.schedulingInit(...)`（POST） |
| 调度上报 | `v1/operationapi/scheduling_report` | 是 | `ShareManager.schedulingReport(...)`（POST） |
| 看广告完成上报 | `v1/operationapi/ad/scheduling_report` | 是 | `RXApiHelper` 内部调用（POST） |

### 约定（SDK 行为）

- `GET_DATA` 会开启签名：`sign(true)`（重构时保持签名逻辑与字段一致）。
- 回调线程：网络回调切回主线程（UI 线程）。

