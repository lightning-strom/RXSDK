## SDK集成

打开 mainTemplate.gradle 文件， 在 dependencies 中添加：

```json
    //vivo渠道库
    implementation 'com.ruixue:rxsdk_vivo:${version}'
```

## 配置信息

- 打开 AndroidManifest.xml， 在 `application` 中新增：

```xml
<application>
    <meta-data
    android:name="vivoUnionAppId"
    android:value="@your appid"/>

    <meta-data
    android:name="vivoUnionAppType"
    android:value="1"/>
</application>
```
- 打开 Assets/Plugins/Android 目录，将 `supplierconfig.json` 放在当中

```json
{
  "supplier":{
    "vivo":{
      "appid":"@your vivo appid"
    },
    "xiaomi":{
    },
    "huawei":{
    },
    "oppo":{
    }
  }
}
```

## 混淆配置

[参考链接](https://dev.vivo.com.cn/documentCenter/doc/450)
在应用级根目录下打开混淆配置文件`proguard-rules.pro`，加入排除SDK的混淆配置

```
-keep class com.bun.miitmdid.core.** {*;}
-keep class XI.CA.XI.**{*;}
-keep class XI.K0.XI.**{*;}
-keep class XI.XI.K0.**{*;}
-keep class XI.xo.XI.XI.**{*;}
-keep class com.asus.msa.SupplementaryDID.**{*;}
-keep class com.asus.msa.sdid.**{*;}
-keep class com.bun.lib.**{*;}
-keep class com.bun.miitmdid.**{*;}
-keep class com.huawei.hms.ads.identifier.**{*;}
-keep class com.samsung.android.deviceidservice.**{*;}
-keep class com.zui.opendeviceidlibrary.**{*;}
-keep class org.json.**{*;}
-keep public class com.netease.nis.sdkwrapper.Utils {public <methods>;}
```





