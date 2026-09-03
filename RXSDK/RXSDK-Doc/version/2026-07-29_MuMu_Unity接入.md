# 改动记录 - MuMu Unity Android 接入

- **日期**：2026-07-29
- **作者**：Cursor
- **影响范围**：RXSDK Unity Base、MuMu UPM 包、MuMu 渠道文档

## 改动内容

### RXSDK-Unity/Packages/com.ruixue.unitysdk.mumu

- 新增 `com.ruixue.unitysdk.mumu` UPM 包。
- 新增 `RXMuMu.SetDebugMode`、`DisplayChannelLogo` 和 `ResumeUnityPlayer`。
- 新增 Yofun APP_ID、固定 Android SDK 版本和包名后缀构建校验。
- Android 导出时自动注入 Yofun Maven、`rxsdk_yofun`、MultiDex、Manifest、
  Application/Activity 生命周期和混淆规则。
- 新增初始化、登录、UI 保活和角色事件示例。
- 未创建 MuMu 配置或配置内容全空时跳过校验和注入，避免阻塞其他 Android 渠道构建。

### RXSDK-Unity/Packages/com.ruixue.unitysdk.base

- 新增 `LoginMethod.MuMu = "mumu"`。
- 补充 `GameInfo.type` 的 MuMu 事件说明。

### RXSDK-Doc/thirdchannel/mumu/mumu.md

- 新增 Unity UPM 安装、Android 构建配置、初始化、闪屏、登录、渠道 UI
  回调和角色事件章节。

## 备注

- MuMu 为 Android 专属渠道，未修改 iOS、JS 和 Cocos2dx。
- `rxsdk_yofun` 必须由业务工程显式配置固定版本，不提供动态或隐式默认版本。
- MuMu 环境中的登录、支付和角色事件仍需使用正式 APP_ID、包名和签名验收。
