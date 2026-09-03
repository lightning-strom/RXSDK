# Unity SDK 接口文档

> **版本**：3.7.x  
> **更新日期**：2026-01-28  
> **入口类**：`RXSDK`（`namespace RuiXue`）  
> **平台支持**：Android · iOS · WebGL

---

## 推荐阅读顺序

1. **[callback.md](./callback.md)** — 回调机制（`SdkCallback` / `SdkResult`）**必读**
2. **[01_init.md](./01_init.md)** — 初始化与配置
3. **[02_login.md](./02_login.md)** — 账号登录
4. **[03_pay.md](./03_pay.md)** — 支付
5. 其余模块按需阅读

---

## 📚 文档目录

| 文件 | 模块 | 接口数 | 说明 |
|------|------|--------|------|
| [callback.md](./callback.md) | 回调机制 | — | `SdkCallback`、`SdkResult`、错误码说明 |
| [01_init.md](./01_init.md) | 初始化与配置 | 13 | SDK 初始化、语言地区、防沉迷、隐私、全局回调 |
| [02_login.md](./02_login.md) | 账号登录 | 20 | 多方式登录（32 种）、注册、验证码、绑定/解绑、用户信息、实名、注销 |
| [03_pay.md](./03_pay.md) | 支付 | 2 | 国内外多渠道支付（20 种 `hq_type`）、iOS 商品查询 |
| [04_share.md](./04_share.md) | 分享 | 7 | 分享调度、发起分享、自定义分享、短链接 |
| [05_social.md](./05_social.md) | 社交 / 关系 / 排行榜 | 16 | LBS、自定义关系、好友、排行榜 |
| [06_analysis.md](./06_analysis.md) | 数据分析 | 4 | 埋点事件上报、公共属性管理 |
| [07_ad_push.md](./07_ad_push.md) | 广告 / 推送 | 11 | 激励视频、Banner、插屏广告；推送 Token、别名管理 |
| [08_feedback.md](./08_feedback.md) | 意见反馈 | 8 | 反馈类型、提交反馈、满意度评价、日志上报 |
| [09_misc.md](./09_misc.md) | 其他模块 | 21 | 版本检查、法务、帮助中心、邮件、公告、福利码、设备码等 |
| [API_LIST.md](./API_LIST.md) | 接口清单（旧） | — | 旧版接口速查表，仅供参考 |

---

## 🔑 核心概念

### 入口类

所有 API 均通过 `RXSDK` 静态类调用：

```csharp
using RuiXue;
using RuiXue.Login;

RXSDK.Initialize(config, callback);
RXSDK.Login(loginConfig, callback);
RXSDK.Pay(payParams, callback);
```

### 回调约定

```csharp
// 统一回调
delegate void SdkCallback(SdkResult result)

// 推荐用法
RXSDK.Login(config, result => result.Match(
    ok:   data  => Debug.Log("成功: " + data),
    fail: error => Debug.LogError($"[{result.Code}] {error}")
));

// async / await
var result = await RXSDK.LoginAsync(config);
if (result) Debug.Log(result.Data);
```

### 错误码速查

| Code | 说明 |
|------|------|
| `0` | 成功 |
| `-1` | 本地通用失败 |
| `-2` | 用户取消 |
| `-1001` | 当前平台不支持 |
| `1xxx` | 网络错误 |
| `3xxx` | 登录错误 |
| `4xxx` | 支付错误 |
| 6 位正整数 | 服务端业务错误码 |

---

## 📦 核心模块对照

| 模块路径 | 类 | 命名空间 | 说明 |
|----------|-----|----------|------|
| `Runtime/Core` | `RXSDK` | `RuiXue` | 初始化、配置、全局功能 |
| `Runtime/Login` | `RXLogin` | `RuiXue.Login` | 登录、注册、用户信息、绑定 |
| `Runtime/Pay` | `RXPay` | `RuiXue.Pay` | 支付功能 |
| `Runtime/Share` | `RXShare` | `RuiXue.Share` | 分享功能 |
| `Runtime/Social` | `RXSocial` | `RuiXue.Social` | 好友、自定义关系 |
| `Runtime/Social/LBS` | `RXLBS` | `RuiXue.LBS` | 位置服务 |
| `Runtime/Social/Rank` | `RXRank` | `RuiXue.Rank` | 排行榜 |
| `Runtime/Analysis` | `RXAnalysis` | `RuiXue.Analysis` | 数据埋点 |
| `Runtime/Push` | `RXPush` | `RuiXue.Push` | 推送通知 |
| `Runtime/Ad` | `RXAd` | `RuiXue.Ad` | 广告 |
| `Runtime/Feedback` | `RXFeedback` | `RuiXue.Feedback` | 意见反馈 |
| `Runtime/VersionCheck` | `RXVersionCheck` | `RuiXue.VersionCheck` | 版本检查 |
| `Runtime/Legal` | `RXLegal` | `RuiXue.Legal` | 法务协议 |

---

## 🔗 相关文档

- [接入指南](../QUICK_START.md)
- [Android 渠道配置](../ANDROID.md)
- [Android SDK 文档](../../android/README.md)
- [iOS SDK 文档](../../ios/README.md)
- [跨端 API 契约文档](../../common/api/README.md)
- [错误码规范](../../common/specs/error_codes.md)
