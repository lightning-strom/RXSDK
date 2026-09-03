### 接入方式
* Package Manager 导入 RuiXue.Instagram

## SDK 集成

###ios
iOS Instagram相关SDK与工程配置已自动集成，在调用以下初始化方法后，使用时直接参照您所使用的功能模块（例如登录、分享）的Unity文档说明即可。

###android
```
//海外渠道引用此库
implementation 'com.ruixue:rxsdk_instagram:${version}'
```

## 参数说明
| 参数 | 类型 | 说明 |
| ---- | ---- | ---- |
| clientId | Long | launcherTemplate.gradle 中配置 instagram_client_id 值 |
| redirectUrl | String | 在开发者后台查看，配置到下面 com.snap.kit.redirectUrl |

## 配置说明

###ios
无

###android
- 在 `launcherTemplate.gradle` 文件 `defaultConfig` 下
```
    resValue "string", "instagram_client_id", "400197956108491"
```
- 在 AndroidManifest.xml 配置
```
<application>

    <meta-data android:name="com.ruixue.sdk.instagram.clientId"
            android:value="@your clientid" />
    <meta-data android:name="com.ruixue.sdk.instagram.redirectUrl"
            android:value="@your redirecturl" />
           
</application>            
```

## 初始化

###ios
```csharp
RXInstagram.init("@your appid","@your redirect uri");
```

###android::init6
RuiXueSdk.InitThirdSdk(map, InitThirdSdkResponseDelegate, InitThirdSdkErrorDelegate);

## 登录

[点此跳转到 UI 登录方式](https://doc.ruixueyun.com/main/#/view?viewPath=e070867f-1f80-4008-a6e8-5e7e41c7d0a7)
[点此跳转到 API 登录方式](https://doc.ruixueyun.com/main/#/view?viewPath=94779ed0-7178-4d33-912f-82d955fbf3cb)

<br>

## 分享

仅支持系统分享。

[点此跳转到分享 API](https://doc.ruixueyun.com/main/#/view?viewPath=66c434e8-cdee-422a-a112-3c5d5719727e)
