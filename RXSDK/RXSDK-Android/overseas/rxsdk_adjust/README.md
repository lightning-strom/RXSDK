# rxsdk_adjust — Adjust 数据归因插件

## 功能简介

接入 Adjust SDK，提供安装归因、事件上报、深链处理及设备 ID 读取能力。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_adjust:${version}'
```

## 参数配置

### 初始化参数

通过服务端下发的 `ext` 配置传入，字段名参考下表：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `app_token` | String | **必填** | Adjust 后台的 App Token（唯一标识） |
| `switch_of` | int | 可选 | 归因开关：`1` 开启（默认），`0` 关闭 |

> 也支持通过宿主 `AndroidManifest.xml` 的 `<meta-data>` 备用读取：
> ```xml
> <meta-data android:name="adjust_app_token" android:value="YOUR_TOKEN" />
> ```

### 权限说明

模块自动声明以下权限（会合并到宿主）：

- `ACCESS_NETWORK_STATE`
- `INTERNET`
- `WAKE_LOCK`
- `ACCESS_WIFI_STATE`
- `com.adjust.preinstall.READ_PERMISSION`

## 接口调用

业务侧通过瑞雪 SDK 统一入口调用登录、支付、分享等能力；本模块不要求业务直接调用渠道原生 API。

## 测试与验收

- 控制台包名与 `applicationId` 一致。
- Debug / Release 签名已按渠道要求登记。
- `rxconfig.json` 或 `thirdSdkParams/ext` 中的必填参数非空。
- 登录、支付、分享等能力调用前已完成瑞雪 SDK 初始化。
- 支付商品 ID 与渠道后台 SKU 保持一致。

## 常见问题

### 其他说明

- 内置 Install Referrer Receiver，无需宿主额外声明
- 默认环境为 `PRODUCTION`；调试阶段可在代码中切换为 `SANDBOX`

## 版本与构建要求

| 项 | 说明 |
| --- | --- |
| 渠道 SDK 版本 | 以本模块 `build.gradle` 为准 |
| JDK | 默认跟随工程配置，特殊模块以本 README 说明为准 |
| minSdk | 以工程根配置为准 |
| 特殊要求 | 无 |
