# rxsdk_qoo — QooApp 插件

## 功能简介

接入 QooApp Open SDK，提供 QooApp 渠道的授权校验、购买记录恢复及消耗型商品消费能力。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_qoo:${version}'
```

## 参数配置

### 初始化参数

QooApp SDK 通过宿主 `AndroidManifest.xml` 的 meta-data 或构建变体配置读取，**无需在 ext 中传入额外字段**。

> 宿主需按 QooApp Open SDK 文档配置 App ID / App Key 到 manifest 中。

### 权限说明

依赖 QooApp SDK AAR 自动合并，宿主无需额外声明。

## 接口调用

业务侧通过瑞雪 SDK 统一入口调用登录、支付、分享等能力；本模块不要求业务直接调用渠道原生 API。

## 测试与验收

- 控制台包名与 `applicationId` 一致。
- Debug / Release 签名已按渠道要求登记。
- `rxconfig.json` 或 `thirdSdkParams/ext` 中的必填参数非空。
- 登录、支付、分享等能力调用前已完成瑞雪 SDK 初始化。
- 支付商品 ID 与渠道后台 SKU 保持一致。

## 常见问题

### 主要接口说明

| 接口 | 说明 |
| --- | --- |
| `QooSdkHelper.checkLicense(callback)` | 校验授权（应在游戏启动时调用） |
| `QooSdkHelper.restorePurchases(callback)` | 恢复历史购买记录 |
| `QooSdkHelper.consume(purchase_id, token, callback)` | 消耗指定购买记录 |

## 版本与构建要求

| 项 | 说明 |
| --- | --- |
| 渠道 SDK 版本 | 以本模块 `build.gradle` 为准 |
| JDK | 默认跟随工程配置，特殊模块以本 README 说明为准 |
| minSdk | 以工程根配置为准 |
| 特殊要求 | 无 |
