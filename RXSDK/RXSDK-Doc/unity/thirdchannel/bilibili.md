## SDK集成

```json
    //bilibili渠道库
    implementation 'com.ruixue:rxsdk_bilibili:${version}'
```

## 配置说明

- 请将以下内容全部复制到 AndroidManifest.xml 的 application 标签下 

```xml
    <!--是否为付费下载游戏,如果是付费下载游戏value值为true,否则value值为false --> 
    <!--游戏付费下载指的是⽤户需要先购买才能下载游戏，与⽤户可以免费下载但是游戏内有内购是不同的 --> 
    <meta-data android:name="BSGameSdk_PaidGame" android:value="false"/>
```

- 支付功能

打开 AndroidManifest.xml, 在 application 中添加

```xml

    <activity
            android:name="com.ruixue.sdk.BiliBiliWXEntryActivity"
            android:enabled="true"
            android:exported="true"
            android:launchMode="singleTask"
            android:theme="@android:style/Theme.Translucent.NoTitleBar" />

```

- 生命周期接口(必接)

在 AndroidManifest.xml文件application中配置 android:name="com.ruixue.openapi.RXApplication

- 初始化第三方 SDK

```csharp

    Dictionary<string, object> map = new();
    map.Add("server_id", "@your server_id");
    map.Add("server_name", "@your server_name");
    map.Add("merchant_id", "@your merchant_id");
    map.Add("appid", "@your appid");
    map.Add("appkey", "@your appkey");
    
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


- 账号注销接口

请传入平台账号下所有角色信息，包含哔哩哔哩 iOS、哔哩哔哩 Android平台，如果传入空数据或空数组，则SDK会展示默认的提示文案.

参考瑞雪账号注销接口。


## 三方工具接口
::: tip
目前 Unity 没有封装 bilibili 的三方工具接口，如果有需要，请联系我们。
:::



