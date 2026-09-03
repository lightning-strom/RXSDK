# RXSDK 结构与命名规范

## 目录结构

```
Runtime/
├── API/           # 对外 API 封装（Share、Social、Ranking、CDKey、Update、Push、Operation）
├── Billing/       # 支付
├── Data/          # 数据模型（DataBean、InitData）
├── Hadoop/        # 埋点
├── Net/           # 网络与请求
├── Passport/      # 账号与登录
├── Platform/      # 平台抽象与多端实现（见 Platform/README_Platform.md）
│   ├── Android/
│   └── OpenHarmony/
├── Utils/         # 工具类（Log、RXUtility、DeviceUtility 等）
└── WebView/       # WebView 能力
```

根目录下为入口与配置：`RuiXueSdk.*`（门面）、`SDKConfig`、`APIPath`、`Constants`、`ArgsBean`、`Define` 等。

## 文件命名

| 类型 | 约定 | 示例 |
|------|------|------|
| 普通类/接口 | PascalCase，与主类型同名 | `API.cs`、`IPlatformBridge.cs` |
| Partial 类 | `主类型.部分名.cs` | `RuiXueSdk.Passport.cs`、`HMSHelper.Login.cs` |
| 类型定义拆分 | `主类型Types.cs` | `GameNearbyTransferTypes.cs` |
| 文档 | `README_*.md` / `Docs/` | `README_Platform.md`、`README_Structure.md`；对外接入见 `Docs/OpenHarmony_接入配置.md` |

- 复合词使用 PascalCase，如 `WebView`、`OpenHarmony`，避免 `Webview`、`Openharmony`。

## 类与成员命名

- **接口**：`I` 前缀，如 `IPlatformBridge`、`IShare`。
- **类型/方法/属性**：PascalCase。
- **私有字段**：camelCase 或 `_camelCase`。
- **常量**：PascalCase 或 UPPER_SNAKE（如 `APIPath` 中的路径常量）。

## 命名空间

- 根命名空间：`RXSDK`。
- 子模块与目录对应：`RXSDK.Net`、`RXSDK.Data`、`RXSDK.Platform`、`RXSDK.Platform.OpenHarmony`。
- 平台相关实现可放在 `RXSDK.Platform` 或 `RXSDK.Platform.OpenHarmony`，与物理路径一致便于查找。

## Partial 与拆分

- 单文件过大时按职责拆成 partial：主文件保留核心与生命周期，其余按领域分文件（如 Passport、Billing、UI）。
- 仅含 DTO/枚举的“类型文件”可与接口/实现分离（如 `GameNearbyTransferTypes.cs` 与 `GameNearbyTransfer.cs`）。

## 代码风格

- 回调参数：新 API 优先使用 `RXCallback<T>`，旧 API 保留 `Action<int, T, string>` 并标记 `[Obsolete]`；仅需结果时用 `Action<string>`。
- 使用 `#region` 按职责折叠，便于导航；避免与 region 重复的块注释。
- 字段能加 `readonly` 的尽量加上；委托/回调参数统一用 `Action<>` 时确保已 `using System`。
