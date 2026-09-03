# rxsdk_kwai_monitor — 快手监测 SDK（MonitorSDK / TurboAgent）

## 功能简介

接入快手监测 SDK（`monitorsdk` / `TurboAgent`），用于买量归因事件上报：激活、注册、付费、创角等。

与 `channel/rxsdk_kwaiallin`、`channel/rxsdk_kwai_buy`（联运登录支付）无关，可叠加使用。

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_kwai_monitor:${version}'
```

工程内：

```groovy
implementation project(':rxsdk_kwai_monitor')
```

第三方 AAR 坐标：`com.kwai.monitor:monitorsdk:1.0.17`（见 `local_repo/kwai_monitor`）。

## 参数配置

由瑞雪后台 `advertise_channel.ks` 下发，配置存在即客户端初始化并自动上报：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `appid` | String | 是 | 快手平台申请的 appId（兼容 `app_id`/`appId`） |
| `app_name` | String | 是 | 申请时填写的英文 appName（兼容 `appName`） |
| `channel` | String | 否 | 自定义渠道（兼容 `app_channel`/`appChannel`） |
| `tm` | int | 否 | 若下发则 `1`=上报、其它跳过；缺省视为启用 |
| `debug` | bool/int | 否 | 开启 SDK debug 日志 |

示例：

```json
{
  "advertise_channel": {
    "ks": {
      "appid": "3967",
      "app_name": "your_app_name",
      "channel": "ruixue"
    }
  }
}
```

### 权限

`INTERNET`、`ACCESS_WIFI_STATE`、`ACCESS_NETWORK_STATE`、`READ_PHONE_STATE`（API≥23 建议动态申请）。

强烈建议先接入信通院 MSA OAID SDK，再初始化本模块，否则 OAID 覆盖不全影响归因。

## 自动事件

| 瑞雪事件 | 快手 API |
| --- | --- |
| ACTIVATED | `TurboAgent.init` + `onAppActive` |
| REGISTER / 新用户 LOGIN | `onRegister` |
| PAY | `onPay(元)` |
| CREATE_GAME_ROLE | `onGameCreateRole` |

## 手动调用

```java
KwaiMonitorSdkWrapper.getInstance().init(context, appId, appName);
KwaiMonitorSdkWrapper.getInstance().reportActive();
KwaiMonitorSdkWrapper.getInstance().reportRegister();
KwaiMonitorSdkWrapper.getInstance().reportPay(6.0);
KwaiMonitorSdkWrapper.getInstance().reportCreateRole("法师");
KwaiMonitorSdkWrapper.getInstance().reportPageResume(activity);
KwaiMonitorSdkWrapper.getInstance().reportPagePause(activity);
```

## 测试与验收

- 快手后台 appId / appName / 包名与安装包一致
- `advertise_channel.ks` 已下发且 `appid`/`app_name` 非空
- 主进程初始化；未 init 的事件不会上报
- Debug 可 `debug=1` 或手动 `setEnableDebug(true)` 对照日志

## 版本与构建要求

| 项 | 说明 |
| --- | --- |
| 监测 SDK | `monitorsdk-1.0.17` |
| 自 | Android RXSDK **4.0.14+**（与当前工程版本对齐） |
| JDK | 跟随工程 |
| minSdk | 跟随工程 |
