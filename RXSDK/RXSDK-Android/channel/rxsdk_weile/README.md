# channel/rxsdk_weile — 玩乐（Weile）渠道接入

## 功能简介

玩乐渠道适配模块。本模块自身不引入第三方渠道 SDK，主要职责是组合 `rxsdk_base` / `rxsdk_base_ui` / `rxsdk_alimobile` / `rxsdk_h5pay`，通过 H5 收银台 + 阿里实名 + 自定义 UI 完成玩乐渠道的整体功能。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_weile:${version}'
```

## 参数配置

### 初始化参数

本模块自身不需要新增 `hashMap` 字段；阿里一键登录、H5 支付的参数沿用各自模块文档。

| 来源 | 必填字段 | 说明 |
| --- | --- | --- |
| `:rxsdk_alimobile` | `auth_secret` | 阿里一键登录密钥 |
| `:rxsdk_h5pay` | `pay_url` 等 | H5 收银台地址、回调 |

### AndroidManifest 配置

无渠道方专属组件；遵循各被组合模块的 manifest 要求。

## 接口调用

### 初始化

初始化由 SDK 主流程串联以下子模块：
- `:rxsdk_base` 主链路（账号、订单、上报）
- `:rxsdk_base_ui` 渠道 UI
- `:rxsdk_alimobile` 阿里一键登录 / 实名（参数见 `rxsdk_alimobile/README.md`）
- `:rxsdk_h5pay` H5 收银台（参数见 `rxsdk_h5pay/README.md`）

业务侧无需直接调用任何渠道方原生 API。

## 测试与验收

- 控制台包名与 `applicationId` 一致。
- Debug / Release 签名已按渠道要求登记。
- `rxconfig.json` 或 `thirdSdkParams/ext` 中的必填参数非空。
- 登录、支付、分享等能力调用前已完成瑞雪 SDK 初始化。
- 支付商品 ID 与渠道后台 SKU 保持一致。

## 常见问题

### 其他说明

- 玩乐渠道走我方账号体系 + H5 收银台，不接入任何第三方账号 SDK
- 如需接入额外的渠道支付通道，建议在 `:rxsdk_h5pay` 配置层做扩展

## 版本与构建要求

### 混淆配置

模块未追加自定义 `proguard-rules.pro`；如宿主开启 R8，按 `:rxsdk_alimobile` / `:rxsdk_h5pay` 各自的混淆建议合并即可。

### 三方 SDK 版本与依赖

| 依赖 | 版本 | 用途 |
| --- | --- | --- |
| `:rxsdk_base`（project） | — | 主链路 |
| `:rxsdk_base_ui`（project） | — | 渠道 UI |
| `:rxsdk_alimobile`（project） | — | 阿里一键登录 / 实名 |
| `:rxsdk_h5pay`（project） | — | H5 支付 |
