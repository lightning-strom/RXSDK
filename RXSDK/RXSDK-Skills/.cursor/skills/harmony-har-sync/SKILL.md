---
name: harmony-har-sync
description: 编译 RXSDK Harmony Native 的 hmssdk HAR，并在成功构建后同步替换团结引擎工程内置的 hmssdk.har。Use when the user asks to build、compile、更新或替换 Harmony Native/HmsSdk HAR，或修改 HmsSdk 后要求同步团结引擎鸿蒙 SDK。
---

# Harmony HAR 编译与同步

## 固定路径

- 源模块：`RXSDK-Harmony-Native/HmsSdk`
- 团结引擎目标：`RXSDK-Harmony/Assets/Plugins/OpenHarmony/libs/hmssdk.har`
- 目标 `.meta`：`RXSDK-Harmony/Assets/Plugins/OpenHarmony/libs/hmssdk.har.meta`

## 工作流

1. 检查 `RXSDK-Harmony-Native` 和 `RXSDK-Harmony` 的 Git 状态，不覆盖无关改动。
2. 安装或同步 Harmony Native 工程的 OHPM 依赖。
3. 使用工程可用的 Hvigor/DevEco Studio 工具，以 `release` 模式编译 `HmsSdk` HAR 模块。
4. 仅在编译成功后，从 `HmsSdk/build/` 中定位本次生成的 `HmsSdk.har` 或 `hmssdk.har`：
   - 必须是本次构建产生的文件；
   - 不得使用缓存目录中时间更早的同名 HAR；
   - 如果有多个候选且无法确认，停止并报告，不得猜测。
5. 将产物覆盖为：

   `RXSDK-Harmony/Assets/Plugins/OpenHarmony/libs/hmssdk.har`

6. 保留现有 `hmssdk.har.meta`，不要删除、重建或修改其 GUID 和 OpenHarmony PluginImporter 配置。
7. 比较源文件与目标文件的 SHA-256；两者必须完全一致。
8. 确认目标 HAR 非空，并确认团结引擎导出脚本仍递归包含 `Assets/Plugins`。

## 约束

- 每次编译 HmsSdk HAR 后都执行同步，不把“Native 构建成功”当作任务完成。
- HAR 是已编译产物；同步时直接复制，不解压、不重新打包。
- 目标文件名固定为小写 `hmssdk.har`，以匹配团结导出工程中的 OHPM 依赖。
- 不复制到 `HarmonyPublish`；该目录是团结引擎导出产物，不是 SDK 源文件。
- 不提交、不发布、不推送，除非用户明确要求。
- 编译失败时不得替换团结引擎中的现有 HAR。

## 完成报告

报告以下内容：

- HmsSdk 模块版本与构建模式；
- 实际构建产物路径；
- 已替换的团结引擎目标路径；
- 源文件与目标文件 SHA-256；
- 构建、同步和校验结果。
