# 瑞雪 SDK Android 快速接入指南

## 概述

本文档介绍如何快速接入瑞雪 SDK Android 版本。详细 API 说明请参考 [SDK 接入规范](sdk-specification.md)。

## MCP 工具列表

| 工具名称 | 功能描述 |
|---------|---------|
| `android_add_dependency` | 生成 Gradle 依赖配置 (含 Maven 仓库) |
| `android_init` | 生成 SDK 初始化代码 |
| `android_agent` | 生成完整 SDK 接入示例 |

---

## 快速接入流程

### 第一步: 添加依赖

#### 1.1 配置 Maven 仓库

在项目根目录 `build.gradle` 中添加:

```groovy
allprojects {
    repositories {
        google()
        mavenCentral()
        jcenter { url 'https://maven.aliyun.com/nexus/content/repositories/jcenter' }
        
        // 瑞雪库地址
        maven {
            url 'http://60.205.123.114:8081/repository/maven-releases/'
            allowInsecureProtocol = true
        }
    }
}
```

#### 1.2 添加 SDK 依赖

在 `app/build.gradle` 中添加 (根据渠道选择):

```groovy
dependencies {
    // 根据上架渠道选择对应的 SDK
    implementation 'com.ruixue:rxsdk_weile:3.7.33'  // 自运营
    // implementation 'com.ruixue:rxsdk_huawei:3.7.33'  // 华为
    // implementation 'com.ruixue:rxsdk_xiaomi:3.7.33'  // 小米
}
```

#### 1.3 配置 gradle.properties

```properties
android.useAndroidX=true
android.enableJetifier=true
```

---

### 第二步: Application 配置

选择以下任一方式:

#### 方式一: 直接继承 (推荐)

```java
import com.ruixue.openapi.RXApplication;

public class GameApplication extends RXApplication {
    // 你的代码...
}
```

#### 方式二: 间接调用

```java
import com.ruixue.openapi.RXSDK;

public class GameApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        RXSDK.onApplicationCreate(this);
    }

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        RXSDK.attachBaseContext(base);
    }
}
```

#### 方式三: 使用默认 Application

```xml
<application android:name="com.ruixue.openapi.RXApplication">
</application>
```

---

### 第三步: Activity 生命周期

#### 自动监听 (AppCompatActivity)

```java
RXSDK.trackingLifecycle(this);
```

#### 手动调用 (Activity)

```java
import com.ruixue.openapi.RXSDK;

@Override
public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    RXSDK.onCreate(this);
}

@Override
public void onResume() {
    super.onResume();
    RXSDK.onResume(this);
}

@Override
public void onPause() {
    super.onPause();
    RXSDK.onPause(this);
}

// ... 其他生命周期方法
```

---

### 第四步: SDK 初始化

在主 Activity 中初始化 SDK:

```java
import com.ruixue.openapi.RXSDK;
import com.ruixue.RXSdkInitConfig;
import com.ruixue.RXRequestCallback;
import org.json.JSONObject;

import java.util.Arrays;
import java.util.List;

// 必填参数
String cpid = "your_cpid";              // CP 唯一 ID
String productId = "your_product_id";   // 应用 ID
String channelId = "your_channel_id";   // 渠道 ID
List<String> baseUrlList = Arrays.asList(
    "https://api1.ruixueyun.com",
    "https://api2.ruixueyun.com"
);

// 创建初始化配置
RXSdkInitConfig config = new RXSdkInitConfig(
    cpid,
    productId,
    channelId,
    baseUrlList,
    new RXRequestCallback() {
        @Override
        public void onResponse(JSONObject response) {
            int code = response.optInt("code", -1);
            if (code == 0) {
                // 初始化成功，data 可能为空
                // TODO: 可以进行登录等操作
            } else {
                // 初始化失败
                String msg = response.optString("msg");
            }
        }
    }
);

// 可选配置
config.setAutoInitThird(true);   // 是否自动初始化第三方 SDK
config.setUsePrivacy(true);      // 是否展示隐私协议弹窗

// 初始化 SDK
RXSDK.initialize(this, config);
```

---

## 可选配置

### 隐私协议 (可选)

```java
RXSDK.getInstance().setPrivacyAgree(context, new PrivacyCallback() {
    @Override
    public void onPrivacyAgree(boolean userClick) {
        // 用户同意隐私协议后回调
    }
});
```

---

## 渠道列表

| 渠道 | Artifact | 说明 |
|-----|----------|------|
| 自运营 | `rxsdk_weile` | 自运营渠道 |
| 华为 | `rxsdk_huawei` | 华为应用商店 |
| 小米 | `rxsdk_xiaomi` | 小米应用商店 |
| vivo | `rxsdk_vivo` | vivo 应用商店 |
| oppo | `rxsdk_oppo` | oppo 应用商店 |
| 应用宝 | `rxsdk_ysdk` | 腾讯应用宝 |
| TapTap | `rxsdk_taptap` | TapTap 商店 |
| 抖音 | `rxsdk_douyin_gb` | 抖音联运 |
| 快手 | `rxsdk_kwaiallin` | 快手联运 |
| B站 | `rxsdk_bilibili` | 哔哩哔哩 |
| Google Play | `rxsdk_overseas` | 海外 Google Play |

完整渠道列表请参考 [SDK 接入规范](sdk-specification.md)。

---

## 接入检查清单

### 依赖配置
- [ ] Maven 仓库配置
- [ ] SDK 依赖添加
- [ ] Java 版本 >= 1.8
- [ ] 混淆配置
- [ ] gradle.properties 配置

### 代码设置
- [ ] Application 配置
- [ ] AndroidManifest.xml 注册
- [ ] Activity 生命周期监听

### SDK 初始化
- [ ] RXSdkInitConfig 参数配置
- [ ] RXSDK.initialize() 调用

---

## 参考文档

- [SDK 接入规范](sdk-specification.md) - 详细 API 说明
- [瑞雪云官方文档](https://doc.ruixueyun.com)
