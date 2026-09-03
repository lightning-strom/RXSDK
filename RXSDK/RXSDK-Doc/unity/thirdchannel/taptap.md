## SDK集成

打开 mainTemplate.gradle 文件，在 dependencies 中新增：

```groovy
    //taptap，渠道库必接一个
    implementation 'com.ruixue:rxsdk_taptap:${version}'
```

## 配置说明

```csharp

    Dictionary<string, object> map = new();        
    map.Add("client_id", "@your clientid");
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