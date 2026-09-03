---
name: harmony-sdk-release
description: 发布 RXSDK 鸿蒙 SDK，将同版本的 hmssdk.har 与团结引擎 unitypackage 放入 HarmonySDKFile 的版本目录，校验产物后提交并推送到 GitHub。Use when the user asks to 发布鸿蒙版本、更新 HarmonySDKFile、归档鸿蒙 HAR/package 或提交鸿蒙 SDK 发布物。
---

# 鸿蒙 SDK 发布

## 发布仓库

- 独立仓库：`HarmonySDKFile`
- GitHub：`https://github.com/ruixueyun/HarmonySDKFile`
- 版本目录：`HarmonySDKFile/v<version>/`
- HAR：`HarmonySDKFile/v<version>/hmssdk.har`
- 团结包：`HarmonySDKFile/v<version>/rxsdk_harmony_v<version>.unitypackage`

## 版本来源

发布前确认以下版本完全一致：

- `RXSDK-Harmony-Native/HmsSdk/oh-package.json5` 的 `version`
- `RXSDK-Harmony/Assets/RXSDK/Runtime/Version.cs` 的 `Version.INFO`
- 团结包文件名中的版本

版本不一致时停止发布并报告，不得自行选择其中一个版本。

## 发布流程

1. 分别检查 `RXSDK-Harmony-Native`、`RXSDK-Harmony`、`HarmonySDKFile` 的 Git 状态。
   - 不覆盖或提交无关改动。
   - 发布仓库必须与 `origin` 同步；只允许安全的 fast-forward 更新。
2. 按 `harmony-har-sync` Skill 执行 release HAR 构建、团结引擎 HAR 替换和 SHA-256 校验。
3. 使用团结引擎执行：

   `ExportPackage.ExportUnityPackage`

   生成：

   `RXSDK-Harmony/publish/rxsdk_harmony_v<version>.unitypackage`

   必须使用本次构建产物；未成功导出时不得使用历史 package。
4. 检查 `.unitypackage` 内容，确认包含：

   `Assets/Plugins/OpenHarmony/libs/hmssdk.har`

   提取或读取包内 HAR，确认其 SHA-256 与
   `RXSDK-Harmony/Assets/Plugins/OpenHarmony/libs/hmssdk.har`
   完全一致。
5. 如果 `HarmonySDKFile/v<version>/` 已存在，停止并询问用户是否覆盖；默认不覆盖已发布版本。
6. 创建 `HarmonySDKFile/v<version>/`，复制并规范命名：
   - `hmssdk.har`
   - `rxsdk_harmony_v<version>.unitypackage`
7. 校验两个发布文件存在、非空，并记录文件大小与 SHA-256。
8. 检查发布物是否符合 GitHub 单文件大小限制及仓库现有 Git LFS 规则。不要自行修改 Git/LFS 配置。
9. 只在 `HarmonySDKFile` 独立仓库中暂存本次版本目录，确认 diff 不包含其他文件。
10. 提交信息使用：

    `release: add Harmony SDK v<version>`

11. 将当前分支正常推送到 `origin`；禁止 force push。认证、权限或 GitHub 大小限制失败时报告阻塞，不得把本地提交描述为发布成功。

## 发布验证

- `HarmonySDKFile` 工作区提交后保持干净。
- 本地分支与远程分支一致。
- GitHub 远程提交中包含版本目录及两个发布物。
- HAR 的三个副本 SHA-256 一致：
  - Harmony Native 本次构建产物
  - 团结引擎 `Assets/Plugins/OpenHarmony/libs/hmssdk.har`
  - `HarmonySDKFile/v<version>/hmssdk.har`
- `.unitypackage` 内嵌 HAR 与上述 HAR 一致。

## 约束

- 不提交签名文件、密码、Token、证书或本地配置。
- 不修改已发布历史版本，除非用户明确批准。
- 不创建 Git tag 或 GitHub Release，除非用户明确要求。
- 不将 `HarmonyPublish` 中的临时导出文件作为原始发布源。
- 构建、导出、校验、提交或推送任一步失败，均不得宣称发布完成。

## 完成报告

报告版本、版本目录、两个文件的大小与 SHA-256、提交哈希、推送结果和 GitHub 仓库链接。
