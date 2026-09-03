---
name: unity-module-create
description: 创建 RXSDK Unity 组件库模块。触发场景：新建 Unity SDK 组件包、新建 Unity Package Manager 模块、创建 Unity C# Bridge 封装。涵盖 UPM 包结构、C# Demo、package.json 配置等完整流程。
---

# Unity 组件库创建规范

基于 RXSDK-Unity 工程的 UPM（Unity Package Manager）结构，指导创建新的 Unity SDK 组件包。

## 包组织方式

所有 Unity 组件以 UPM 本地包形式存放在 `RXSDK-Unity/Packages/` 下，命名格式：

```
com.ruixue.unitysdk.[name]
```

### 现有组件包列表

| 包名 | 功能 |
|------|------|
| `com.ruixue.unitysdk.base` | SDK 基础库 |
| `com.ruixue.unitysdk.login` | 登录模块 |
| `com.ruixue.unitysdk.pay` | 支付模块 |
| `com.ruixue.unitysdk.ad` | 广告模块 |
| `com.ruixue.unitysdk.push` | 推送模块 |
| `com.ruixue.unitysdk.share` | 分享模块 |
| `com.ruixue.unitysdk.im` | IM 即时通讯 |
| `com.ruixue.unitysdk.firebase` | Firebase 分析 |
| `com.ruixue.unitysdk.adjust` | Adjust 归因 |
| `com.ruixue.unitysdk.facebook` | Facebook |
| `com.ruixue.unitysdk.google` | Google 登录/支付 |
| `com.ruixue.unitysdk.weixin` | 微信 |
| `com.ruixue.unitysdk.ui` | 国内 UI |
| `com.ruixue.unitysdk.uioverseas` | 海外 UI |
| `com.ruixue.unitysdk.feedback` | 反馈 |
| `com.ruixue.unitysdk.analysis` | 数据分析 |
| `com.ruixue.unitysdk.lbs` | LBS 定位 |
| `com.ruixue.unitysdk.social` | 社交 |
| `com.ruixue.unitysdk.legal` | 合规 |
| `com.ruixue.unitysdk.webgl.weixin` | WebGL 微信 |
| `com.ruixue.unitysdk.webgl.douyin` | WebGL 抖音 |

---

## 创建流程

### 目录结构模板

```
Packages/com.ruixue.unitysdk.[name]/
├── package.json                        # UPM 包描述
├── Runtime/
│   ├── RuiXue[Name].asmdef            # Assembly Definition
│   ├── RuiXue[Name].cs                # C# 主接口类
│   ├── Impl/                           # 平台实现
│   │   ├── RuiXue[Name]Android.cs     # Android Bridge
│   │   └── RuiXue[Name]iOS.cs         # iOS Bridge
│   └── Common/                         # 公共类型
│       ├── [Name]Config.cs
│       └── [Name]Callback.cs
├── Plugins/                            # 原生插件（可选）
│   ├── Android/
│   │   └── rxsdk_[name].aar           # Android AAR
│   └── iOS/
│       └── RX[Name]SDK.framework      # iOS Framework
├── Samples~/                           # 示例（UPM 标准格式）
│   └── Demo/
│       ├── RuiXue[Name]Demo.cs
│       ├── RuiXue[Name]Demo.cs.meta
│       ├── RuiXue[Name]Demo.unity
│       └── RuiXue[Name]Demo.unity.meta
└── Editor/                             # 编辑器扩展（可选）
    └── RuiXue[Name]Editor.cs
```

### Step 1: 创建 package.json

```json
{
  "name": "com.ruixue.unitysdk.[name]",
  "version": "1.0.0",
  "displayName": "RuiXue SDK - [Name]",
  "description": "[Name] module for RuiXue Unity SDK",
  "unity": "2019.4",
  "dependencies": {
    "com.ruixue.unitysdk.base": "1.0.0"
  },
  "samples": [
    {
      "displayName": "Demo",
      "description": "[Name] demo scene",
      "path": "Samples~/Demo"
    }
  ]
}
```

### Step 2: 创建 C# 主接口类

`Runtime/RuiXue[Name].cs`：

```csharp
using System;
using System.Collections.Generic;
using UnityEngine;

namespace RuiXue.[Name]
{
    public class RuiXue[Name]
    {
        public static void Init(Dictionary<string, object> config,
            Action<string> onSuccess = null,
            Action<string> onError = null)
        {
#if UNITY_ANDROID && !UNITY_EDITOR
            RuiXue[Name]Android.Init(config, onSuccess, onError);
#elif UNITY_IOS && !UNITY_EDITOR
            RuiXue[Name]iOS.Init(config, onSuccess, onError);
#endif
        }
    }
}
```

### Step 3: 创建平台 Bridge

Android Bridge `Runtime/Impl/RuiXue[Name]Android.cs`：

```csharp
#if UNITY_ANDROID
using UnityEngine;
using System;
using System.Collections.Generic;

namespace RuiXue.[Name]
{
    public class RuiXue[Name]Android
    {
        private static AndroidJavaObject _plugin;

        public static void Init(Dictionary<string, object> config,
            Action<string> onSuccess, Action<string> onError)
        {
            using (var pluginClass = new AndroidJavaClass("com.ruixue.sdk.[name].[Name]Helper"))
            {
                // 调用 Android 原生方法
            }
        }
    }
}
#endif
```

iOS Bridge `Runtime/Impl/RuiXue[Name]iOS.cs`：

```csharp
#if UNITY_IOS
using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;

namespace RuiXue.[Name]
{
    public class RuiXue[Name]iOS
    {
        [DllImport("__Internal")]
        private static extern void rx_[name]_init(string config);

        public static void Init(Dictionary<string, object> config,
            Action<string> onSuccess, Action<string> onError)
        {
            rx_[name]_init(JsonUtility.ToJson(config));
        }
    }
}
#endif
```

### Step 4: 创建 Demo

`Samples~/Demo/RuiXue[Name]Demo.cs`：

```csharp
using System;
using System.Collections.Generic;
using RuiXue;
using RuiXue.[Name];
using UnityEngine;
using UnityEngine.UI;

public class RuiXue[Name]Demo : MonoBehaviour
{
    public Button _Button_Init;

    private void Awake()
    {
        _Button_Init?.onClick.AddListener(OnInit);
    }

    private void OnInit()
    {
        Dictionary<string, object> config = new();
        // 配置参数
        RuiXue[Name].Init(config,
            data => Debug.Log("Init Success: " + data),
            error => Debug.LogError("Init Error: " + error));
    }
}
```

### Step 5: 创建 Assembly Definition

`Runtime/RuiXue[Name].asmdef`：

```json
{
  "name": "RuiXue.[Name]",
  "rootNamespace": "RuiXue.[Name]",
  "references": [
    "RuiXue.Base"
  ],
  "includePlatforms": [],
  "excludePlatforms": [],
  "allowUnsafeCode": false,
  "overrideReferences": false,
  "precompiledReferences": [],
  "autoReferenced": true,
  "defineConstraints": [],
  "versionDefines": [],
  "noEngineReferences": false
}
```

---

## 命名规范

| 项目 | 格式 | 示例 |
|------|------|------|
| 包名 | `com.ruixue.unitysdk.[name]` | `com.ruixue.unitysdk.firebase` |
| 命名空间 | `RuiXue.[Name]` | `RuiXue.Firebase` |
| 主接口类 | `RuiXue[Name]` | `RuiXueFirebase` |
| Android Bridge | `RuiXue[Name]Android` | `RuiXueFirebaseAndroid` |
| iOS Bridge | `RuiXue[Name]iOS` | `RuiXueFirebaseiOS` |
| Demo 类 | `RuiXue[Name]Demo` | `RuiXueFirebaseDemo` |
| asmdef | `RuiXue.[Name]` | `RuiXue.Firebase` |

## 与原生 SDK 的对应关系

| Unity | Android | iOS |
|-------|---------|-----|
| `com.ruixue.unitysdk.[name]` | `rxsdk_[name]` 模块 | `RX[Name]SDKCode` |
| `RuiXue[Name].cs` | `[Name]Helper.java` | `RX[Prefix].h/.m` |
| `Plugins/Android/*.aar` | build 产物 | build 产物 |
| `Plugins/iOS/*.framework` | — | build 产物 |

---

## 执行清单

```
Unity 组件创建清单：[组件名]

[ ] 1. 确认组件功能和原生依赖
[ ] 2. 创建 Packages/com.ruixue.unitysdk.[name] 目录
[ ] 3. 创建 package.json
[ ] 4. 创建 C# 主接口类（Runtime/）
[ ] 5. 创建 Android Bridge（Runtime/Impl/）
[ ] 6. 创建 iOS Bridge（Runtime/Impl/）
[ ] 7. 放入原生插件（Plugins/ —— AAR/Framework）
[ ] 8. 创建 Assembly Definition
[ ] 9. 创建 Demo（Samples~/Demo/）
[ ] 10. 编译验证
```
