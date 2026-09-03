## 接入方式
* Package Manager 导入 RuiXue.TikTok

## SDK 集成

###ios
编辑 Podfile 文件，添加如下配置：

```objectivec
pod 'RXTikTokSDK'
```

###android
```
implementation 'com.ruixue:rxsdk_tiktok:${version}'
```

## 参数说明
| 参数 | 类型 | 说明 |
| ---- | ---- | ---- |
| clientKey | String | 在开发者后台查看，配置到下面 meta-data com.ruixue.sdk.tiktok.clientKey |
| scheme | String | 跳转回应用的 uri，授权成功后，用户将通过与之关联的活动返回到您的应用，配置到下面 meta-data com.ruixue.sdk.tiktok.auth.scheme |


## 配置说明

###ios
- 打开Assets/RuiXueSettings/RuiXueSDK_TikTokXcodeSetting.asset 文件，在文件中填写
```
TikTokAppID: @your tiktok appID
```

###android
- 在 AndroidManifest.xml 配置
```
<application>
     <meta-data
        android:name="com.ruixue.sdk.tiktok.clientKey"
        android:value="@your clientkey" />

    <meta-data
        android:name="com.ruixue.sdk.tiktok.auth.scheme"
        <!-- 此处 "ruixue://sdkresponse" 为 SDK 示例，请填写项目实际 uri 配置-->
        android:value="@your uri" />
    
    <activity android:name="com.ruixue.sdk.tiktok.AuthResultActivity"
            android:exported="true">
            <intent-filter>
              <action android:name="android.intent.action.VIEW" />

              <category android:name="android.intent.category.DEFAULT" />
              <category android:name="android.intent.category.BROWSABLE" />

              <!-- 这里与上面配置的 scheme 相对应，注意别填错了 -->
              <!-- 此处 "ruixue" "sdkresponse" 为 SDK 示例，请填写项目实际 uri 配置-->
              <data
                  android:host="sdkresponse"
                  android:scheme="@your scheme" />
          </intent-filter>
  </activity>

</application>            
```


## 登录

[点此跳转到 UI 登录方式](https://doc.ruixueyun.com/main/#/view?viewPath=e070867f-1f80-4008-a6e8-5e7e41c7d0a7)
[点此跳转到 API 登录方式](https://doc.ruixueyun.com/main/#/view?viewPath=94779ed0-7178-4d33-912f-82d955fbf3cb)

<br>

## 分享

[点此跳转到分享 API](https://doc.ruixueyun.com/main/#/view?viewPath=66c434e8-cdee-422a-a112-3c5d5719727e)