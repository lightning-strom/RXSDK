# 平台层与多端扩展

业务层通过 `PlatformProvider.Current` 获取 `IPlatformBridge`，不直接依赖具体平台实现；**唯一切入点**为 `PlatformFactory`（在此根据 `#if UNITY_XXX` 创建具体 Bridge）。其余模块通过**能力属性**（`SupportsNativeSdkInit`、`SupportsNativeTrack`、`SupportsNativeSendCaptcha`）分支，**不依赖 `PlatformType.OpenHarmony` 等具体枚举**，便于 Unity / 团结等多引擎兼容。

## 扩展新平台步骤

1. **在 `PlatformType.cs` 中增加枚举值**（若尚未存在）。
2. **新建实现类**：实现 `IPlatformBridge`，将本端原生能力（登录、支付、推送等）封装为接口方法。
3. **在 `PlatformFactory.cs` 中注册**（此处为唯一引用具体平台类型的代码）：
   - 在 `CreateForCurrentPlatform()` 中按 `#if UNITY_XXX` 增加分支并返回新实现；
   - 在 `Create(PlatformType)` 的 switch 中增加对应 case（可选，用于测试或手动指定）。
4. **Init 与分支**：业务层按 `SupportsNativeSdkInit` / `SupportsNativeTrack` / `SupportsNativeSendCaptcha` 分支，无需引用 `PlatformType`；新平台在 Factory 注册并在 Bridge 内实现接口与能力属性即可。

## 文件说明

| 文件 | 说明 |
|------|------|
| `PlatformType.cs` | 平台类型枚举，用于标识与多端分支。 |
| `IPlatformBridge.cs` | 平台能力接口，各端统一实现。 |
| `NullPlatformBridge.cs` | 默认空实现（编辑器或未适配平台）。 |
| `PlatformFactory.cs` | 按当前环境创建桥接，新增平台在此加分支。 |
| `PlatformProvider.cs` | 全局提供者，`Current` / `CurrentPlatform` / `Set` / `Reset`。 |
| `OpenHarmony/OpenHarmonyPlatformBridge.cs` | 鸿蒙端实现（示例）。 |

## 当前支持

- **OpenHarmony（团结等）**：`PlatformFactory` 在 `#if UNITY_OPENHARMONY` 时创建 `OpenHarmonyPlatformBridge`；该实现将 `SupportsNativeSdkInit/Track/SendCaptcha` 置为 true，业务层据此走原生 Init/埋点/验证码，无需引用 `PlatformType.OpenHarmony`。
- **Android / iOS / Steam**：Factory 中已预留分支，当前返回 `NullPlatformBridge`，可按需实现对应 Bridge 并替换。
