# RuiXue.Base

基础库

## 包信息

| 项 | 内容 |
|----|------|
| UPM 名称 | `com.ruixue.unitysdk.base` |
| 依赖 | 无（根基础库） |

## 安装

1. 在 Unity 工程 **Packages/manifest.json** 中配置瑞雪 Scoped Registry（见仓库根目录 README）。
2. 在 `dependencies` 中加入（版本号与项目统一）：

```json
"com.ruixue.unitysdk.base": "x.y.z"
```

3. 若依赖中包含其它 `com.ruixue.*` 包，**版本号需与 `com.ruixue.unitysdk.base` 保持一致**。

## 使用说明

- 本包为 **SDK 基础库**：请先阅读 `RuiXueSdk` 初始化流程，其它 `com.ruixue.*` 模块均依赖本包。
- 详细接入与平台差异以**瑞雪内部接口文档**为准；本 README 仅作仓库导航。

## 示例（Samples）

- **RuiXueBaseDemo**：示例工程（`Samples~/Demo`）
- **RuiXueChannelDemo**：百度/MuMu 通用渠道初始化、登录、闪屏和浮窗示例
- **RuiXueXutengDemo**：使用公共 Base/Login/Pay `4.0.3` 接入栩腾渠道的示例

## Android 渠道混淆

导出 Android 工程时，Base 包会自动将百度和 MuMu/Yofun 的渠道混淆规则复制到
`launcher/ruixue-channel-proguard.pro`，并应用到全部 buildType。业务工程无需再安装
百度或 MuMu 专属 UPM；只需选择对应 Android 渠道库并完成 Manifest 配置。Base 还会
在导出工程中合并百度 FileProvider 所需的 `provider_paths.xml`，并补充虎牙联运所需
的 Volcengine Maven 仓库。虎牙同样不需要专属 UPM。

### 栩腾渠道

栩腾不提供独立 UPM，也不需要把混淆规则加入 Base 模板；其 AAR
`consumer-rules.pro` 会自动透传。Unity 工程统一使用公共
`com.ruixue.unitysdk.base`、`com.ruixue.unitysdk.login` 和
`com.ruixue.unitysdk.pay` `4.0.3`，Android 侧仅选择
`com.ruixue:rxsdk_xuteng:4.0.19`，不得与其它渠道库并存。

宿主必须在 launcher Gradle 配置真实的 `CHANNELSDK_ID` 和
`CHANNELSDK_GAME_VERSION` Manifest placeholder，并放入栩腾母包工具生成的
`assets/brsdk.cfg`；仓库不保存这些渠道参数。检测到导出的
`unityLibrary/build.gradle` 包含 `rxsdk_xuteng` 时，Base 导出处理器会将
`unityLibrary/src/main/AndroidManifest.xml` 的 Application 设为
`com.ruixue.sdk.XTApplication`，非栩腾渠道不会修改。

## 相关文件

- 变更记录：同目录下 `CHANGELOG.md`（若有）
- 仓库总览：[`README.md`](../../README.md)


---

## 基础库说明（本包专用）

- **命名空间**：`RuiXue`，主入口为静态类 `RuiXueSdk`。
- **平台**：Android / iOS / WebGL 等通过宏选择实现（`UNITY_ANDROID`、`UNITY_IOS`、`UNITY_WEBGL` 等），编辑器下非目标平台使用占位实现。
- **原生依赖**：Android 需在 `mainTemplate.gradle` 中配置瑞雪 Maven 与 `rxsdk_*` 依赖；iOS 使用 CocoaPods / 工程内插件，详见内部工程规范。
