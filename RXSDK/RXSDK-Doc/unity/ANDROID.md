# Unity Android 渠道与推送

> **版本**：与 [README](./README.md) 一致  
> **适用**：Unity 打 Android 包时的渠道初始化与厂商推送接入。

本文整合 Unity Android 渠道接入说明与 Push 配置要点，详细参数与厂商文档请以瑞雪文档中心为准。

---

## 渠道列表

每个 Android 包**必须有且仅能集成一个渠道**，自运营与三方渠道二选一。

| 名称       | 依赖模块             | 说明     |
| ---------- | -------------------- | -------- |
| 自运营     | rxsdk_weile          | 自运营渠道库 |
| 百度网讯   | rxsdk_baidu_wahngxun | 百度游戏中心 |
| YSDK 应用宝 | rxsdk_ysdk           | 应用宝上架 |
| vivo       | rxsdk_vivo           | vivo 应用商店 |
| oppo       | rxsdk_oppo           | oppo 应用商店 |
| 华为       | rxsdk_huawei         | 华为应用商店 |
| 小米       | rxsdk_xiaomi         | 小米应用商店 |
| 抖音       | rxsdk_douyin_gb      | 抖音联运 |
| 快手       | rxsdk_kwaiallin      | 快手联运 |
| taptap     | rxsdk_taptap         | taptap 上架 |
| googleplay | rxsdk_overseas       | Google Play |
| qoo        | rxsdk_qoo            | qoo 上架 |
| 雷电       | rxsdk_ld             | 雷电应用商店 |

---

## 渠道初始化（C# API）

- 部分渠道需在用户同意《服务协议和隐私政策》后再调用渠道初始化。
- 部分三方渠道要求实现退出提示（`ExitApp`、`Logout`）。
- 冷启动时不建议用 `login_openid` 做二次登录，以免跳过三方授权导致审核被拒。
- `InitThirdSdk` 尽量提前调用，不要与登录接口同步；部分渠道（如 vivo）同步调用会导致登录无回调。

### 接口原型

```csharp
/// <summary>初始化三方渠道</summary>
public static void InitThirdSdk(
    Dictionary<string, object> map,
    RequestResponseDelegate onResponse,
    RequestErrorDelegate onError);

/// <summary>退出 app 时，由渠道组件调用对应渠道退出接口</summary>
public static void ExitApp(
    ExitConfirmDelegate onExitConfirm,
    ExitCancelDelegate onExitCancel);

/// <summary>登出账号（当前为 Android 端逻辑）</summary>
public static void Logout(
    RequestResponseDelegate onResponse,
    RequestErrorDelegate onError);
```

参数：`map` 参照对应渠道参数表；使用配置初始化时传 `null`。

### 示例

```csharp
// 通知 SDK 已同意隐私协议
RuiXueSdk.SetPrivacyAgree(OnPrivacyAgree);

// 退出 app 时
RuiXueSdk.ExitApp(ExitConfirm, ExitCancel);
```

---

## 厂商推送（Push）

Unity 工程需通过 Package Manager 接入 RuiXue.Push，并在 Android 侧配置依赖与占位符。

- **依赖**：在 `mainTemplate.gradle` 的 `dependencies` 中按需添加  
  `implementation "com.ruixue.push:rxsdk_push_xxx:${version}"`  
  （如 rxsdk_push_mi、rxsdk_push_oppo、rxsdk_push_vivo、rxsdk_push_huawei、rxsdk_push_meizu 等）。
- **占位符**：在 `launcherTemplate.gradle` 的 `android.defaultConfig.manifestPlaceholders` 中配置各厂商的 APP_ID、APP_KEY 等（从各厂商开放平台申请）。
- **混淆**：在 `proguard-rules.pro` 中按瑞雪 Push 文档添加对应 keep 规则（如小米、魅族、华为、OPPO、VIVO、FCM 等）。
- **初始化**：在 `UnityPlayerActivity` 的 `onCreate` 中调用 `RxPushManager.init(this)`，在 `onCreate`/`onNewIntent` 中调用 `RxPushManager.openAppCallback(intent)`。
- **C# 调用**：登录成功后调用 `RXPush.RegisterToken()`；登出时调用 `RXPush.UnRegisterToken()`。获取设备 token 使用 `RXPush.GetDeviceToken()`。

完整厂商参数、仓库配置与混淆规则请参考：[SDK 更新日志与 Android Unity 接入](https://doc.ruixueyun.com/main/#/view?path=8dce8a66-3711-4819-a80e-e3c385b3f0c1)。

---

## 相关文档

- [Unity 快速接入](./QUICK_START.md)
- [Android 快速接入](../android/QUICK_START.md)（原生 Android 视角）
- [瑞雪文档中心](https://doc.ruixueyun.com)
