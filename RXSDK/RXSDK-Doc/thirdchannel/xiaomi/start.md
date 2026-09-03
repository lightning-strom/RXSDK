## SDK集成

```groovy
  implementation 'com.ruixue:rxsdk_xiaomi:${version}'
```

## 配置说明

打开 launcherTemplate.gradle， 在 `defaultConfig{}` 中新增：

```groovy
        manifestPlaceholders = [
           MI_APP_ID       : "2882303761519905875",
           MI_APP_KEY      : "5831990527875"
        ]
```

打开 settingsTemplate.gradle， 打开 settingsTemplate.gradle 文件，在 `dependencyResolutionManagement{repositories{}}` 中新增：

```groovy
        //增加小米游戏SDK的Maven仓库地址
        maven {
            url "https://repos.xiaomi.com/maven"
            credentials {
                username 'mi-gamesdk'
                password 'AKCp8mYeLuhuaGj6bK1XK7t2w4CsPuGwg6GpQdZ9cat7K59y5sD7Tx3dHjJcFrBGj3TQ4vi7g'
            }
        }
```


## 混淆配置

[参考链接](https://dev.mi.com/distribute/doc/details?pId=1420)
在应用级根目录下打开混淆配置文件`proguard-rules.pro`，加入排除SDK的混淆配置

```
#小米SDK
-keep class com.xiaomi.** {*;}
-keep class com.wali.** {*;}
-keep class cn.com.wali.** {*;}
-keep class com.miui.**{*;}

#支付宝SDK
-keep class com.alipay.android.app.IAlixPay{*;}
-keep class com.alipay.android.app.IAlixPay$Stub{*;}
-keep class com.alipay.android.app.IRemoteServiceCallback{*;}
-keep class com.alipay.android.app.IRemoteServiceCallback$Stub{*;}
-keep class com.alipay.sdk.app.PayTask{ public *;}
-keep class com.alipay.sdk.app.AuthTask{ public *;}
-keep class com.alipay.sdk.app.H5PayCallback {
    <fields>;
    <methods>;
}
-keep class com.alipay.android.phone.mrpc.core.** { *; }
-keep class com.alipay.apmobilesecuritysdk.** { *; }
-keep class com.alipay.mobile.framework.service.annotation.** { *; }
-keep class com.alipay.mobilesecuritysdk.face.** { *; }
-keep class com.alipay.tscenter.biz.rpc.** { *; }
-keep class org.json.alipay.** { *; }
-keep class com.alipay.tscenter.** { *; }
-keep class com.ta.utdid2.** { *;}
-keep class com.ut.device.** { *;}

-dontwarn com.ta.utdid2.**
-dontwarn com.ut.device.**

-dontwarn com.alipay.mobilesecuritysdk.**
-dontwarn com.alipay.security.**

-dontwarn android.net.SSLCertificateSocketFactory
```