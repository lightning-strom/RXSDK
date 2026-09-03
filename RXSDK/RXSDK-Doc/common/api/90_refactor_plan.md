## 基于契约的 AI 重构计划（建议）

### 目标

在不破坏已发布对外 API 的前提下，提高 SDK 的可维护性、可测试性与一致性（错误结构/鉴权/回调线程）。

### 约束（必须遵守）

- **只增不改**：对外公开 API（如 `RXSdkApi`、`IPassportApi`）不改签名/不改语义；扩展用新增方法/新增类/新增字段。
- **错误结构稳定**：失败始终可映射为 `code/msg/trace_id/thirdcode/thirdmsg/data`。
- **安全合规**：日志脱敏；禁止把敏感信息写进仓库。

### 推荐落地步骤（从低风险到高收益）

#### 1) 建立契约基线（已完成）

- `docs/api/10_endpoints_used_by_sdk.md`：从 `RXApiPath` 自动生成的接口清单
- `docs/api/20_passport.md`：通行证核心链路的行为说明

> 后续每次重构前先更新文档，重构后再比对差异，确保契约不漂移。

#### 2) Map 入参逐步 DTO 化（不破坏兼容）

现状：大量接口用 `Map<String,Object>` 传参，易错、难测试。

做法：
- 保留旧 Map 方法
- 新增 DTO/Request（例如 `RegisterParams/LoginParams` 的模式）
- 旧方法内部转 DTO（或 DTO 转 Map）统一入口，降低分叉

#### 3) 统一“参数 key”与校验

- 抽离常用字段名常量（如 `username/password/captcha_code/trace_id`），避免散落字符串
- 对敏感接口（注册/登录/改密/绑定）做一致的非空/格式/范围校验，并统一返回错误码（不抛底层异常）

#### 4) 统一网络层行为（可观测性）

- 固化 `trace_id` 生成与透传策略（请求头/失败回包字段）
- 对 `restfulData=false` 接口保留 raw JSON（重构时不能丢）
- 增加“请求日志开关”，默认关闭敏感字段

#### 5) 增量补测试（保护重构）

建议优先补：
- `password` 的 MD5/大写处理逻辑（注册/登录/改密/绑手机/绑邮箱）
- `SEND_CAPTCHA` vs `SEND_CAPTCHA_AUTH` 的路由逻辑
- `needLoggedIn` 的默认判定与 header 注入

### 你需要给我确认的重构范围（避免过度重构）

- 你希望这次 AI 重构优先解决哪一类问题？
  - A. Public API 整理（参数 DTO 化/文档完善）
  - B. 网络层稳定性（trace_id、错误结构、线程一致性）
  - C. 多模块解耦（Core/Channel/Plugin 依赖方向治理）
  - D. 安全整改（移除仓库中的敏感配置、日志脱敏）

