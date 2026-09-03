# Android SDK API 文档

> **版本**: 3.7.36  
> **更新日期**: 2026-01-26

Android 平台 API 实现文档，与 [跨端契约文档](../../common/api/README.md) 对应。

---

## 推荐阅读顺序

1. **[RXSDK_GUIDE.md](./RXSDK_GUIDE.md)** — RXSDK 使用指南（三种调用方式详解）
2. **[API_LIST.md](./API_LIST.md)** — 接口清单（144 个接口按模块分类）
3. **[callback.md](./callback.md)** — 回调接口规范

---

## 接口定义文档

| 文档 | 类 | 说明 |
|------|-----|------|
| [ruixue_sdk.md](./ruixue_sdk.md) | `RuiXueSdk` | 初始化、配置、生命周期管理 |
| [rxsdk_api.md](./rxsdk_api.md) | `IRXSdkApi` | 基础、支付、分享、法务、埋点等 |
| [passport_api.md](./passport_api.md) | `IPassportApi` | 登录、注册、用户信息、绑定 |
| [social_api.md](./social_api.md) | `ISocialApi` | LBS、关系、好友、排行榜 |
| [gamearea_api.md](./gamearea_api.md) | `IGameAreaApi` | 游戏区服、角色管理 |
| [rxsdk_ui_api.md](./rxsdk_ui_api.md) | `IRXSdkUIApi` | UI 组件接口 |

---

## 快速接入

| 场景 | 文档 |
|------|------|
| 登录接入 | [passport_api_quick_start.md](./passport_api_quick_start.md) |
| H5 支付 | [pay_h5.md](./pay_h5.md) |
| 完整集成 | [../QUICK_START.md](../QUICK_START.md) |

---

## 设计规范

- [多端通用接口设计规范](../../common/guidelines/api_design_spec.md)

---

## 文档维护

1. **契约变更** → 先更新 `common/api/` 契约文档
2. **实现更新** → 再更新本目录 Android 实现细节
3. **保持同步** → 确保实现与契约一致
