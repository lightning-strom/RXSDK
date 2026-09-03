# 改动记录 - getDistinctId 跨平台封装

- **日期**：2026-06-01
- **作者**：AI Assistant
- **影响范围**：Unity Base 包、Cocos2dx 桥接、Unity API 文档

## 改动内容

### Unity

- 新增 `RuiXueSdk.GetDistinctId(RequestResponseDelegate onResponse)` 公开入口。
- Android 实现调用 `RuiXueSdk.getDistinctId()`。
- iOS 实现通过 `ios_base_getDistinctId` 桥接到 `[[RXSDK sharedSDK] getDistinctId]`。
- WebGL / NotSupport 按现有风格输出不支持警告。
- Demo 补充 `GetDistinctId` 调用示例。

### Cocos2dx

- 新增 `RuixueBridge::getDistinctId(ResultCallback callback)`。
- Android JNI 封装调用 `RXSDK.getDistinctId()` 并返回 `{ "distinctId": "..." }`。
- iOS ObjC++ 封装调用 `[[RXSDK sharedSDK] getDistinctId]` 并返回 `{ "distinctId": "..." }`。
- Demo 数据分组补充 `DistinctId` 按钮示例。

### 文档

- 更新 Unity API 列表、杂项接口文档和 MCP Unity specification。

## 备注

- 原生 iOS / Android SDK 已存在 `getDistinctId` 公开接口，本次只补跨平台封装。
