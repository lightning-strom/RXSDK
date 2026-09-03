## SDK集成

打开 mainTemplate.gradle 文件， 在 dependencies{} 中新增：

```json
    // oppo渠道库
    implementation 'com.ruixue:rxsdk_oppo:${version}'
    // oppo 渠道库依赖
    implementation 'com.jakewharton.timber:timber:5.0.1'
    implementation 'com.nearme.game.sdk:signal-sdk:1.0.1'
    implementation 'com.nearme.game.sdk:signal-log:1.0.1'
```

## 初始化第三方渠道

```csharp

       Dictionary<string, object> map = new()
        {
            { "appSecret", "@your appsecret" },
        };
        
        RuiXueSdk.InitThirdSdk(map, InitThirdSdkResponseDelegate, InitThirdSdkErrorDelegate);

        public void InitThirdSdkResponseDelegate(string data)
        {
            LogUtil.Log("EventManager", $"RequestResponseDelegate: {data}");
        }
        public void InitThirdSdkErrorDelegate(string data)
        {
            LogUtil.Log("EventManager", $"RequestErrorDelegate: {data}");
        }

```

## 配置说明

打开 launcherTemplate.gradle 文件，在 `defaultConfig{}` 中新增：

```groovy

        manifestPlaceholders = [
           OPPO_APP_KEY    : "@your appkey"
        ]

```

打开 settingsTemplate.gradle 文件，在 `dependencyResolutionManagement{repositories{}}` 中新增：

```groovy
        maven {
           url 'https://maven.columbus.heytapmobi.com/repository/releases/'
           credentials {
               username 'nexus'
               password 'c0b08da17e3ec36c3870fed674a0bcb36abc2e23'
           }
        }
```

## 混淆配置

[参考链接](https://open.oppomobile.com/new/developmentDoc/info?id=12176)
在应用级根目录下打开混淆配置文件`proguard-rules.pro`，加入排除SDK的混淆配置

```
-keep class com.nearme.** { *; }
-dontwarn com.nearme.**
-keep class com.nearme.** { *; }
-dontwarn com.nearme.**
```