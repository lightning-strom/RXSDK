### 接入方式
* Package Manager 导入 RuiXue.SnapChat

## SDK集成

###ios
iOS Snapchat相关SDK已自动集成。

###android
打开 mainTemplate.gradle 文件，在 dependencies 中新增：
```groovy
    implementation 'com.ruixue:rxsdk_snapchat:${version}'
```

## 配置说明

###ios
- 打开Assets/RuiXueSettings/RuiXueSDK_SnapChatXcodeSetting.asset 文件，在文件中填写
```
  SCSDKClientId: @your client id 
  SCSDKRedirectUrl: @your redirect url
  SCSDKScopes: 您需要的权限，例如：["https://auth.snapchat.com/oauth2/api/user.bitmoji.avatar","https://auth.snapchat.com/oauth2/api/user.display_name","https://auth.snapchat.com/oauth2/api/user.external_id"]

```

###android
- 打开 AndroidManifest.xml 文件， 在 application 标签下新增：

```
<application>
    <meta-data android:name="com.snap.kit.clientId" android:value="@your clientid" />

    <meta-data android:name="com.snap.kit.redirectUrl" android:value="@your app scheme + ://snap-kit/oauth2" />
    
    <activity
        android:name="com.snap.corekit.SnapKitActivity"
        android:launchMode="singleTask"
        >
        <intent-filter>
            <action android:name="android.intent.action.VIEW" />
            <category android:name="android.intent.category.DEFAULT" />
            <category android:name="android.intent.category.BROWSABLE" />
            <!--
                Enter the parts of your redirect url below
                e.g., if your redirect url is myapp://snap-kit/oauth2
                    android:scheme="myapp"
                    android:host="snap-kit"
                    android:path="oauth2"
            !-->
            <data
                android:scheme="myapp"
                android:host="snap-kit"
                android:path="/oauth2"
                />
        </intent-filter>

    </activity>
           
</application> 
```

## 分享

[点此跳转到分享 API](https://doc.ruixueyun.com/main/#/view?viewPath=66c434e8-cdee-422a-a112-3c5d5719727e)