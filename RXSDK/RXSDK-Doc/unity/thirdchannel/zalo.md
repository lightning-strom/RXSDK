### 接入方式
* Package Manager 导入 RuiXue.Zalo

## SDK 集成
###ios
iOS Snapchat相关SDK已自动集成。

###android
<span style='color:red'>重要：请先查看渠道接入说明！[快速入口](../access.md) </span>

打开 mainTemplate.gradle 文件， 在 dependencies 中添加：

```
//Zalo 引用此库
implementation 'com.ruixue:rxsdk_zalo:${version}'
```


## 参数说明

| 参数 | 类型 | 说明 |
| ---- | ---- | ---- |
| zaloAppId | Long | string.xml 中配置 ZALO_APP_ID 值 |

## 配置说明

###ios
- 打开Assets/RuiXueSettings/RuiXueSDK_ZaloXcodeSetting.asset 文件，在文件中填写
```
zaloAppID: zalo-@your ZaloAppID  // 例如zalo-1234567
```

###android
- 在 launcherTemplate.gradle 的 defaultConfig 新增

```
  resValue "string", "zalo_app_id", "@your zalo appid"
```

- 在 AndroidManifest.xml 配置

```
<application>
    <meta-data
            android:name="com.zing.zalo.zalosdk.appID"
            android:value="@your appid" />

    <activity
            android:name="com.zing.zalo.zalosdk.oauth.BrowserLoginActivity"
            android:exported="true">

            <intent-filter>
                <action android:name="android.intent.action.VIEW" />

                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <!-- 'zalo-' + 'app id' -->
                <data android:scheme="zalo-@your appid" />
            </intent-filter>
        </activity>        
</application>            
```

`注`：由于 meta-data 不支持 long 数据类型，如果配置的值为数字类型，则默认为 int 值，导致无法参数错误，所以参数需要配置在 `launcherTemplate.gradle` 文件内。

## 初始化

###ios
```csharp
RXZalo.init("@your appid");
```

###android
RuiXueSdk.InitThirdSdk(map, InitThirdSdkResponseDelegate, InitThirdSdkErrorDelegate);

## 登录

[点此跳转到 UI 登录方式](https://doc.ruixueyun.com/main/#/view?viewPath=e070867f-1f80-4008-a6e8-5e7e41c7d0a7)
[点此跳转到 API 登录方式](https://doc.ruixueyun.com/main/#/view?viewPath=94779ed0-7178-4d33-912f-82d955fbf3cb)

<br>

## 分享

[点此跳转到分享 API](https://doc.ruixueyun.com/main/#/view?viewPath=66c434e8-cdee-422a-a112-3c5d5719727e)
