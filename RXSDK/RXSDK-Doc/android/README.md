# Android SDK 文档

> **版本**: 3.7.38  
> **更新日期**: 2026-02-04

Android 平台 SDK 的完整文档。

---

## 快速导航

**接入与配置**

| 文档 | 说明 |
|------|------|
| [快速接入指南](./QUICK_START.md) | 集成步骤、工程配置、初始化与基础使用 |
| [渠道接入说明](./CHANNEL_INTEGRATION.md) | 渠道列表、三方初始化、防沉迷、so 处理 |
| [版本更新日志](./CHANGELOG.md) | 各版本功能更新与 Bug 修复 |

**API 与接口**

| 文档 | 说明 |
|------|------|
| [API 使用指南](./api/RXSDK_GUIDE.md) | 三种调用方式与代码示例 |
| [接口清单](./api/API_LIST.md) | 全部接口按模块分类 |
| [H5 支付接入](./api/pay_h5.md) | H5 支付 doPay 接口与参数 |
| [公共类方法列表](./public_class_methods.md) | RXSDK / RXSdkApi / RXSdkUI 方法签名 |

---

## 文档结构

```
android/
├── README.md                    # 本文档（Android 文档首页）
├── QUICK_START.md               # 快速接入指南
├── CHANNEL_INTEGRATION.md       # 渠道接入说明（渠道列表、初始化、防沉迷）
├── CHANGELOG.md                 # 版本更新日志
├── public_class_methods.md      # 公共类方法列表（250+ 方法）
└── api/                         # API 详细文档
    ├── README.md                # API 文档导航
    ├── RXSDK_GUIDE.md           # RXSDK 使用指南（推荐首读）
    ├── API_LIST.md              # 接口清单（144 个接口）
    ├── callback.md              # 回调接口说明
    ├── passport_api.md          # 通行证 API
    ├── social_api.md            # 社交 API
    ├── gamearea_api.md          # 游戏区服 API
    ├── rxsdk_api.md             # RXSDK 基础 API
    ├── rxsdk_ui_api.md          # UI 组件 API
    ├── ruixue_sdk.md            # RuiXueSdk 初始化类
    ├── passport_api_quick_start.md  # 登录快速接入
    └── pay_h5.md                # H5 支付接入（doPay 接口与参数）
```

---

## 核心入口类

| 类名 | 说明 | 获取方式 |
|------|------|----------|
| `RXSDK` | 统一入口类 | `RXSDK.getInstance()` |
| `RXSdkApi` | 底层 API 服务 | `RXSDK.getApi()` |
| `RXSdkUI` | UI 组件库 | `RXSdkUI.getInstance()` |
| `RuiXueSdk` | 初始化/生命周期 | 静态方法调用 |

---

## 功能模块

| 模块 | 接口数 | 主要功能 |
|------|--------|----------|
| **通行证** | 25+ | 登录、注册、验证码、绑定、密码、实名认证 |
| **社交** | 19+ | LBS、好友、关系、排行榜 |
| **游戏区服** | 12+ | 区服管理、角色管理 |
| **支付** | 3+ | 支付、订单查询 |
| **分享** | 11+ | 分享、短链接、分享调度 |
| **埋点** | 6+ | 数据上报、用户行为 |
| **反馈** | 7+ | 意见反馈、满意度评价 |
| **公告邮件** | 6+ | 公告、邮件、道具领取 |
| **法务** | 4+ | 隐私协议、法务条款 |
| **版本更新** | 4+ | 应用更新、活动更新 |

---

## 回调规范

所有异步接口统一使用 `RXRequestCallback`：

```java
new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
        int code = jsonObject.optInt("code");
        if (code == 0) {
            // 成功：data 在 jsonObject.optJSONObject("data")
        } else {
            // 失败：msg 在 jsonObject.optString("msg")
        }
    }
    
    @Override
    public void onError(RXException e) {
        // 异常：网络错误、解析错误等
    }
}
```

详见 [回调接口说明](./api/callback.md)

---

## 相关文档

- [跨端 API 契约文档](../common/api/README.md)
- [错误码规范](../common/specs/error_codes.md)
- [API 设计规范](../common/guidelines/api_design_spec.md)
- [iOS 文档](../ios/README.md)

---

**文档维护**：部分内容基于瑞雪官方文档导出整理，与 [QUICK_START](./QUICK_START.md)、[api](./api/README.md) 保持一致。维护者：ROC LEE
