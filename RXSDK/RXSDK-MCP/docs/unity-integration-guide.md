# 瑞雪 SDK Unity v1 快速接入指南

## 概述

本文档介绍如何快速接入瑞雪 SDK Unity v1（UPM 分模块）。详细 API 说明请参考 [Unity 接入规范](unity-specification.md)。

## MCP 工具

使用 MCP 工具 `unity` 时，需传入 `feature` 参数指定功能模块：

| feature | 功能描述 |
|---------|---------|
| `init` | 生成 SDK 初始化代码 |
| `agent` | 接入流程指南 |
| `dependency` | 依赖配置（v1 推荐 UPM） |
| `setup` | 自动化接入（需 workspacePath） |
| `login` | 登录代码 |
| `payment` | 支付代码 |

---

## 快速接入流程

### 第一步：安装 SDK

#### 1.1 方式一：UPM（推荐，v1）

编辑 `Packages/manifest.json`：

```json
{
  "scopedRegistries": [
    {
      "name": "RuiXueUnitySdk",
      "url": "http://60.205.123.114:4873",
      "scopes": ["com.ruixue"]
    }
  ],
  "dependencies": {
    "com.ruixue.unitysdk.base": "1.6.17",
    "com.ruixue.unitysdk.login": "1.6.17",
    "com.ruixue.unitysdk.pay": "1.6.17"
  }
}
```

保存后 Unity 将自动下载导入。

#### 1.2 方式二：.unitypackage（兼容旧项目）

v1 推荐 UPM 分模块接入，新项目不建议继续使用 `.unitypackage`。

---

### 第二步：SDK 初始化

在游戏启动场景的 `MonoBehaviour.Start()` 中初始化：

```csharp
using System.Collections.Generic;
using UnityEngine;
using RuiXue;

public class GameManager : MonoBehaviour
{
    void Start()
    {
        var config = new RXSdkInitConfig
        {
            cpId = "your_cpid",
            productId = "your_product_id",
            channelId = "your_channel_id",
            baseUrlList = new List<string>
            {
                "https://api1.ruixueyun.com",
                "https://api2.ruixueyun.com"
            },
            isLogEnable = true,
            autoInitThird = true,
            thirdSdkParams = new Dictionary<string, object>
            {
                { "your_third_sdk_key", "your_third_sdk_value" }
            },
            usePrivacy = false
        };

        RuiXueSdk.Initialize(
            config,
            data =>
            {
                Debug.Log("SDK 初始化成功: " + data);
                // 可进行登录等操作
            },
            error =>
            {
                Debug.LogError("SDK 初始化失败: " + error);
            }
        );
    }
}
```

---

### 第三步：登录

```csharp
using RuiXue.Login;
using RuiXue;

// 游客登录
var config = new LoginConfig { loginType = LoginMethod.Guest };
RXLogin.Login(
    config,
    data => Debug.Log("登录成功: " + data),
    error => Debug.LogError("登录失败: " + error)
);

// 账号密码登录
var accountConfig = new LoginConfig
{
    loginType = LoginMethod.Username,
    username = "user@example.com",
    password = "password123"
};
RXLogin.Login(accountConfig, data => { }, error => Debug.LogError(error));
```

---

### 第四步：支付（可选）

```csharp
using System.Collections.Generic;
using RuiXue.Pay;
using UnityEngine;

var payParams = new Dictionary<string, object>
{
    { "trade_no", "order_12345" },
    { "goods_tag", "product_001" },
    { "hq_type", "wechat" },
    { "currency", "CNY" }
};

RXPay.Pay(
    payParams,
    data => Debug.Log("支付请求成功: " + data),
    error => Debug.LogError("支付请求失败: " + error)
);
```

---

## 平台配置

### Android

- Player Settings > Other Settings：
  - Minimum API Level: 21
  - Scripting Backend: IL2CPP（推荐）

### iOS

- Player Settings > Other Settings：
  - Target minimum iOS Version: 11.0
  - Architecture: ARM64
  - Scripting Backend: IL2CPP

---

## 接入检查清单

### 依赖配置
- [ ] UPM 安装完成
- [ ] 包 `com.ruixue.unitysdk.base` 已导入

### SDK 初始化
- [ ] RXSdkInitConfig 参数已配置
- [ ] RuiXueSdk.Initialize() 在启动时调用

### 登录
- [ ] LoginConfig 已配置
- [ ] RXLogin.Login() 在初始化成功后调用

---

## 参考文档

- [Unity 接入规范](unity-specification.md) - 详细 API 说明
- [Unity 提示词指南](unity-prompts.md) - MCP 提示词示例
- [瑞雪云官方文档](https://doc.ruixueyun.com)
