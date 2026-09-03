# 功能开发规范

## 概述

SDK 功能开发遵循「原生优先，跨平台封装」原则：
1. iOS/Android 原生端先实现完整功能
2. Unity/Cocos2dx 通过 Bridge 层封装调用原生接口

---

## 一、iOS 原生开发规范

### 1.1 接口签名规范

```yaml
signature:
  class: 类名
  singleton: sharedSDK          # 单例方法
  method_name: "方法名:参数:"    # ObjC 风格
  parameters:
    - name: 参数名
      type: 类型
      required: true/false
      description: 描述
```

### 1.2 代码模板

```objc
// ========== [功能名] ==========
#import <RXSDK_Pure/RXSDK_Pure.h>

// 配置对象（如需要）
RXXxxConfig *config = [[RXXxxConfig alloc] init];
config.param1 = @"value1";
config.param2 = @"value2";

// 调用接口
[[RXSDK sharedSDK] xxxWithConfig:config complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    if (error) {
        NSLog(@"失败: code=%ld, msg=%@", (long)error.code, error.msg);
        return;
    }
    NSLog(@"成功: %@", response);
}];
```

### 1.3 回调统一格式

```objc
typedef void (^RXSDKRequestComplete)(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error);
```

---

## 二、Android 原生开发规范

### 2.1 接口签名规范

```yaml
signature:
  class: 类名
  method: methodName
  parameters:
    - name: 参数名
      type: 类型
      required: true/false
      description: 描述
```

### 2.2 代码模板 (Kotlin)

```kotlin
// ========== [功能名] ==========
import com.rxsdk.RXSDK

// 配置对象（如需要）
val config = RXXxxConfig().apply {
    param1 = "value1"
    param2 = "value2"
}

// 调用接口
RXSDK.getInstance().xxx(config) { response, error ->
    if (error != null) {
        Log.e("RXSDK", "失败: ${error.code}, ${error.msg}")
        return@xxx
    }
    Log.d("RXSDK", "成功: $response")
}
```

### 2.3 代码模板 (Java)

```java
// ========== [功能名] ==========
import com.rxsdk.RXSDK;

// 配置对象（如需要）
RXXxxConfig config = new RXXxxConfig();
config.setParam1("value1");
config.setParam2("value2");

// 调用接口
RXSDK.getInstance().xxx(config, (response, error) -> {
    if (error != null) {
        Log.e("RXSDK", "失败: " + error.getCode() + ", " + error.getMsg());
        return;
    }
    Log.d("RXSDK", "成功: " + response);
});
```

---

## 三、Unity 封装规范

### 3.1 目录结构

```
Assets/
└── Plugins/
    └── RXSDK/
        ├── RXSDK.cs           # 主接口类
        ├── RXSDKCallback.cs   # 回调处理
        └── Platforms/
            ├── iOS/
            │   └── RXSDKiOS.cs
            └── Android/
                └── RXSDKAndroid.cs
```

### 3.2 C# Bridge 模板

```csharp
// ========== RXSDK[Feature].cs ==========
using UnityEngine;
using System;
using System.Runtime.InteropServices;

public partial class RXSDK
{
    #region [Feature]
    
#if UNITY_IOS && !UNITY_EDITOR
    [DllImport("__Internal")]
    private static extern void _rx_feature_method(string param1, string param2);
#endif

    /// <summary>
    /// [功能描述]
    /// </summary>
    /// <param name="param1">参数1说明</param>
    /// <param name="param2">参数2说明</param>
    /// <param name="callback">结果回调</param>
    public void FeatureMethod(string param1, string param2, Action<string, string> callback)
    {
#if UNITY_IOS && !UNITY_EDITOR
        _rx_feature_method(param1, param2);
#elif UNITY_ANDROID && !UNITY_EDITOR
        using (var sdk = new AndroidJavaClass("com.rxsdk.RXSDK"))
        {
            var instance = sdk.CallStatic<AndroidJavaObject>("getInstance");
            instance.Call("featureMethod", param1, param2, new RXCallback(callback));
        }
#else
        Debug.Log("[RXSDK] FeatureMethod called in Editor");
        callback?.Invoke("{}", null);
#endif
    }
    
    #endregion
}
```

### 3.3 iOS Native 绑定

```objc
// RXSDKUnityBridge.mm
extern "C" {
    void _rx_feature_method(const char* param1, const char* param2) {
        NSString *p1 = [NSString stringWithUTF8String:param1];
        NSString *p2 = [NSString stringWithUTF8String:param2];
        
        [[RXSDK sharedSDK] featureMethodWithParam1:p1 param2:p2 complete:^(NSDictionary *response, RX_CommonRequestError *error) {
            // 回调给 Unity
            NSString *result = error ? error.msg : [self dictToJson:response];
            UnitySendMessage("RXSDKCallback", "OnFeatureResult", [result UTF8String]);
        }];
    }
}
```

---

## 四、Cocos2dx 封装规范

### 4.1 目录结构

```
Classes/
└── RuixueSDK/
    ├── RuixueBridge.h         # 跨平台接口声明
    ├── RuixueBridge.cpp       # 通用实现
    ├── ios/
    │   ├── RuixueBridge_ios.mm
    │   └── RuixueSDKWrapper.mm
    └── android/
        └── RuixueBridge_android.cpp
```

### 4.2 头文件模板

```cpp
// RuixueBridge.h
#ifndef __RUIXUE_BRIDGE_H__
#define __RUIXUE_BRIDGE_H__

#include <string>
#include <functional>

namespace ruixue {

class RuixueBridge {
public:
    static RuixueBridge* getInstance();
    
    // [功能名]
    // @param param1 参数1说明
    // @param param2 参数2说明
    // @param callback 结果回调 (json, error)
    void featureMethod(const std::string& param1, 
                       const std::string& param2,
                       std::function<void(const std::string&, const std::string&)> callback);
                       
private:
    RuixueBridge() {}
    static RuixueBridge* _instance;
};

} // namespace ruixue

#endif
```

### 4.3 iOS 实现模板

```objc
// RuixueBridge_ios.mm
#import "RuixueBridge.h"
#import <RXSDK_Pure/RXSDK_Pure.h>

namespace ruixue {

void RuixueBridge::featureMethod(const std::string& param1,
                                  const std::string& param2,
                                  std::function<void(const std::string&, const std::string&)> callback) {
    NSString *p1 = [NSString stringWithUTF8String:param1.c_str()];
    NSString *p2 = [NSString stringWithUTF8String:param2.c_str()];
    
    [[RXSDK sharedSDK] featureMethodWithParam1:p1 param2:p2 complete:^(NSDictionary *response, RX_CommonRequestError *error) {
        std::string result = "";
        std::string err = "";
        
        if (error) {
            err = [error.msg UTF8String] ?: "";
        } else {
            NSData *jsonData = [NSJSONSerialization dataWithJSONObject:response options:0 error:nil];
            result = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding].UTF8String ?: "";
        }
        
        if (callback) {
            callback(result, err);
        }
    }];
}

} // namespace ruixue
```

### 4.4 Android 实现模板

```cpp
// RuixueBridge_android.cpp
#include "RuixueBridge.h"
#include "platform/android/jni/JniHelper.h"

namespace ruixue {

void RuixueBridge::featureMethod(const std::string& param1,
                                  const std::string& param2,
                                  std::function<void(const std::string&, const std::string&)> callback) {
    cocos2d::JniMethodInfo methodInfo;
    if (cocos2d::JniHelper::getStaticMethodInfo(methodInfo,
            "com/rxsdk/RXSDK",
            "featureMethod",
            "(Ljava/lang/String;Ljava/lang/String;)V")) {
        
        jstring jParam1 = methodInfo.env->NewStringUTF(param1.c_str());
        jstring jParam2 = methodInfo.env->NewStringUTF(param2.c_str());
        
        methodInfo.env->CallStaticVoidMethod(methodInfo.classID, methodInfo.methodID, jParam1, jParam2);
        
        methodInfo.env->DeleteLocalRef(jParam1);
        methodInfo.env->DeleteLocalRef(jParam2);
        methodInfo.env->DeleteLocalRef(methodInfo.classID);
    }
    
    // 回调处理需要通过 JNI 回调机制
    // ...
}

} // namespace ruixue
```

---

## 五、命名规范

### 5.1 文件命名

| 平台 | 规范 | 示例 |
|------|------|------|
| iOS | RX[Feature]Service | RXShareService |
| Android | RX[Feature]Manager | RXShareManager |
| Unity | RXSDK[Feature].cs | RXSDKShare.cs |
| Cocos2dx | RuixueBridge_[feature] | RuixueBridge_share |

### 5.2 方法命名

| 平台 | 规范 | 示例 |
|------|------|------|
| iOS | featureWithConfig:complete: | shareWithConfig:complete: |
| Android | featureMethod(config, callback) | share(config, callback) |
| Unity | FeatureMethod(params, callback) | Share(config, callback) |
| Cocos2dx | featureMethod(params, callback) | share(config, callback) |

---

## 六、接口一致性检查

确保所有平台的接口保持一致：

```
接口一致性检查：[功能名]

[ ] 参数名称一致
[ ] 参数类型对应正确
[ ] 回调格式统一
[ ] 错误码定义一致
[ ] 功能行为一致
```
