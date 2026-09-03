### 接入方式
* Package Manager 导入 RuiXue.Line

## SDK集成

###ios
iOS Line相关SDK已自动集成。

###android
```groovy
    // 海外渠道引用此库
    implementation 'com.ruixue:rxsdk_overseas:${version}'
    // 接入line
    implementation 'com.ruixue:rxsdk_line:${version}'
```


## 配置说明

###ios
- 打开Assets/RuiXueSettings/RuiXueSDK_LineXcodeSetting.asset 文件，在文件中填写
```
ChannelID: @your channelid
```

###android
```csharp

    Dictionary<string, object> map = new();        
    map.Add("line_channel_id", "@your channelid");
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