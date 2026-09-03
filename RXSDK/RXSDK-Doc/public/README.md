# 瑞雪 SDK 对外接入文档

本文档目录用于存放可直接提供给 CP 或外部接入方的 SDK 接入说明。

## 文档列表

| 文档 | 适用范围 | 说明 |
| --- | --- | --- |
| [获取指定用户信息](./get-userinfo-by-field.md) | iOS / Android / Unity / JSSDK / Cocos2dx | 按字段组合查询用户资料、实名信息、登录记录、绑定登录方式、防沉迷信息等 |
| [支付宝 IIFAA 实名认证](./alipay-iifaa-real-auth.md) | Android / iOS / Unity | 接入支付宝 IIFAA 实名认证，支持 SDK UI 和自定义 UI 两种方式 |

## 使用建议

- 新接入项目先确认平台和 SDK 版本，再按对应文档选择接入方式。
- 涉及用户信息查询时，优先使用 `getUserInfoByField` / `getUserInfoByFieldApi` 按需取字段。
- 涉及账号绑定查询时，“用户绑定的登录方式信息”对应 `account` 分组，例如 `account: ["method"]`。
- 对外文档只保留稳定 API、必要参数和可直接复制的示例；内部实现细节放在 `apis/`、`android/`、`ios/`、`unity/` 等目录。

## 版本说明

| 能力 | iOS | Android | Unity | JSSDK |
| --- | --- | --- | --- | --- |
| 获取指定用户信息 | `RXSDK_Pure >= 4.0.4` | `>= 4.0.9` | `>= 1.6.26` | 需包含 `getUserInfoByFieldApi` |
| 支付宝 IIFAA 实名认证 | `RXSDK_Pure >= 4.0.3`，UI 需 `RXUIKit >= 4.0.4` | `>= 4.0.9` | `>= 1.6.24` | 不适用 |
