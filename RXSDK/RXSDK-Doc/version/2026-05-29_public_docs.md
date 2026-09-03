# 改动记录 - 对外接入文档整理

- **日期**：2026-05-29
- **作者**：AI Assistant
- **影响范围**：`RXSDK-Doc/public`

## 改动内容

### `RXSDK-Doc/public/README.md`

新增对外接入文档首页，按能力列出公开文档、适用平台、版本要求和使用建议。

### `RXSDK-Doc/public/get-userinfo-by-field.md`

新增获取指定用户信息接入文档，覆盖 Android、iOS、Unity、JSSDK/小游戏、Cocos2dx 示例。

重点说明：

- 用户实名信息使用 `user` 分组。
- 用户绑定的登录方式信息使用 `account: ["method"]`。
- `login.method` 表示上次登录方式，不等同于绑定登录方式列表。

### `RXSDK-Doc/public/alipay-iifaa-real-auth.md`

补充文档信息和快速导航，方便外部接入方快速定位版本要求、关键流程和平台接入示例。

## 备注

本次只整理对外文档，不修改 SDK 代码。
