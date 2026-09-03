# channel/rxsdk_yofun — 网易 MuMu/Yofun 渠道接入

## 功能简介

接入网易 Yofun（MuMu 模拟器/网易联运）SDK，提供网易账号登录、支付、退出等渠道方接口。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_yofun:${version}'
```

## 参数配置

### 初始化参数

| 字段 | hashMap key | meta-data | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| Yofun 配置 | — | Yofun aar 自带 / `assets` 资源 | **必填** | 由网易 SDK 内部读取 |

具体字段以网易 Yofun 官方接入文档为准。

### AndroidManifest 配置

模块自带网易 SDK 必要的 `Activity`、`Provider` 声明；宿主需保证 `multiDex` 已启用：

```groovy
android {
    defaultConfig {
        multiDexEnabled true
    }
}
```

## 接口调用

### 初始化

初始化由 SDK 主流程通过 `RXSdkApi#initThirdSdk(activity, hashMap, callback)` 内部完成：

```java
mInitCallback = callback;
Api.getInstance().register(mAction);
Api.getInstance().init(activity);
```

业务参数（Yofun AppID、Channel）走 Yofun aar 内置配置 + Manifest meta-data，**不**读 hashMap。

## 测试与验收

- 控制台包名与 `applicationId` 一致。
- Debug / Release 签名已按渠道要求登记。
- `rxconfig.json` 或 `thirdSdkParams/ext` 中的必填参数非空。
- 登录、支付、分享等能力调用前已完成瑞雪 SDK 初始化。
- 支付商品 ID 与渠道后台 SKU 保持一致。

## 常见问题

### 其他说明

- 注销回调通过 `mAction` 接管，触发后内部调用 `Api.getInstance().logout(...)`
- MuMu 场景下 `LoginMethod.MUMU` 会写入登录扩展字段，便于服务端区分模拟器流量

## 版本与构建要求

### 混淆配置

Yofun aar 自带 consumer 混淆规则，宿主无需追加额外 keep；如需自定义，按网易官方文档处理。

### 三方 SDK 版本与依赖

| 依赖 | 版本 | 用途 |
| --- | --- | --- |
| `com.netease.yofun:${channel_version}` | `${yofun_version}` | 网易 Yofun 主体（按打包版本动态选择） |
| `com.android.support:multidex` | `1.0.3` | MultiDex 支持 |
| `:rxsdk_base`（project） | 隐式 | 瑞雪 SDK 基础库（由 Yofun aar 间接使用） |

> `${channel_version}` / `${yofun_version}` 在主工程 `gradle.properties` 中维护。
