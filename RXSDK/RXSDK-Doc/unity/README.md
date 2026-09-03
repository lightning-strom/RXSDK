# Unity SDK 文档

> **版本**：3.7.x  
> **更新日期**：2026-01-28  
> **Unity 最低版本**：2019.4 LTS  
> **平台支持**：Android · iOS · WebGL

瑞雪 Unity SDK 统一包，整合登录、支付、分享、社交等全部游戏发行功能。

---

## 快速导航

| 文档 | 说明 |
|------|------|
| [快速接入指南](./QUICK_START.md) | 环境配置、Package 安装、初始化与基础使用 |
| [Android 渠道与推送配置](./ANDROID.md) | Android 渠道初始化与厂商推送配置 |
| [接口文档总览](./api/README.md) | 全部模块接口文档入口 |
| [回调机制说明](./api/callback.md) | `SdkCallback` / `SdkResult` 使用说明 |

---

## 文档结构

```
unity/
├── README.md                    # 本文档（Unity 文档首页）
├── QUICK_START.md               # 快速接入指南
├── ANDROID.md                   # Android 渠道与推送
└── api/                         # API 详细文档
    ├── README.md                # API 文档导航
    ├── callback.md              # 回调机制说明
    ├── 01_init.md               # 初始化与配置
    ├── 02_login.md              # 账号登录
    ├── 03_pay.md                # 支付
    ├── 04_share.md              # 分享
    ├── 05_social.md             # 社交 / 关系 / 排行榜
    ├── 06_analysis.md           # 数据分析
    ├── 07_ad_push.md            # 广告 / 推送
    ├── 08_feedback.md           # 意见反馈
    ├── 09_misc.md               # 版本检查 / 法务 / 帮助 / 邮件 / 公告 / 福利码 / 其他
    └── API_LIST.md              # 接口清单（旧版速查，仅供参考）
```

---

## 包结构

```
com.ruixue.unitysdk/
├── Runtime/
│   ├── Core/           # 核心功能（初始化、配置）
│   ├── Login/          # 登录注册、用户信息
│   ├── Pay/            # 支付功能
│   ├── Share/          # 分享功能
│   ├── Social/         # 社交、排行榜、LBS
│   ├── Analysis/       # 数据埋点
│   ├── Ad/             # 广告
│   ├── Push/           # 推送通知
│   ├── UI/             # 登录界面（国内/海外）
│   ├── ThirdParty/     # 第三方平台（微信/Google/Facebook 等）
│   ├── Network/        # DNS 解析
│   └── WebGL/          # 小游戏平台
├── Editor/             # 构建脚本
└── Plugins/            # 原生插件
```

---

## 功能模块

| 模块 | 接口数 | 文档 |
|------|--------|------|
| 初始化与配置 | 13 | [01_init.md](./api/01_init.md) |
| 账号登录 | 20 | [02_login.md](./api/02_login.md) |
| 支付 | 2 | [03_pay.md](./api/03_pay.md) |
| 分享 | 7 | [04_share.md](./api/04_share.md) |
| 社交 / 关系 / 排行榜 | 16 | [05_social.md](./api/05_social.md) |
| 数据分析 | 4 | [06_analysis.md](./api/06_analysis.md) |
| 广告 / 推送 | 11 | [07_ad_push.md](./api/07_ad_push.md) |
| 意见反馈 | 8 | [08_feedback.md](./api/08_feedback.md) |
| 版本检查 / 法务 / 其他 | 21 | [09_misc.md](./api/09_misc.md) |
| **合计** | **102+** | — |

---

## 回调规范

所有异步接口统一使用 `SdkCallback`，回调自动切换至 **Unity 主线程**：

```csharp
// 推荐写法（Match 模式）
RXSDK.Login(config, result => result.Match(
    ok:   data  => Debug.Log("登录成功: " + data),
    fail: error => Debug.LogError($"[{result.Code}] {error}")
));

// async / await
var result = await RXSDK.LoginAsync(config);
if (result) Debug.Log(result.Data);
```

详见 [回调机制说明](./api/callback.md)

---

## 平台支持

| 平台 | 支持状态 | 实现方式 |
|------|----------|----------|
| Android | ✅ 完整支持 | AndroidJavaObject 调用原生 |
| iOS | ✅ 完整支持 | DllImport 调用原生 |
| WebGL | ✅ 部分支持 | JavaScript 互操作 |
| Editor / PC | ⚠️ 占位实现 | 返回 `-1001` 不支持 |

---

## 3.x 版本说明

从 **3.0** 版本开始，SDK 对外入口统一为 `RXSDK` 静态类，所有接口均通过 `RXSDK.XXX()` 调用，并引入 `SdkCallback` / `SdkResult` 统一回调体系，替代旧版双回调 `onResponse` / `onError` 模式。

旧版接口（`RuiXueSdk`、`RXLogin`、`RXPay` 等直接调用）在内部仍可用，但推荐迁移至 `RXSDK` 统一入口。

---

## 相关文档

- [Android SDK 文档](../android/README.md)
- [iOS SDK 文档](../ios/README.md)
- [跨端 API 契约文档](../common/api/README.md)
- [错误码规范](../common/specs/error_codes.md)
- [瑞雪开发者文档](https://doc.ruixueyun.com)

---

**维护者**：ROC LEE
