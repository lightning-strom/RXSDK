### 接入方式
* Package Manager 导入 RuiXue.Google

## SDK集成
```groovy
    //海外渠道引用此库
    implementation 'com.ruixue:rxsdk_overseas:${version}'
```

**版本支持**
- Unity: 4.0.1
- Android: 4.0.18

## 配置说明

- 初始化

```csharp

    Dictionary<string, object> map = new();        
    map.Add("clientId", "681389341105-1gjar2pgmg0vvlik0in4job178l0bamc.apps.googleusercontent.com");
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

- google-services.json

需要引入 google-services.json 文件， 将其放入  Assets/Plugins/Android目录下 

## 方法API

**接口原型**

```csharp
    public void QueryProductDetailsAsync(List<string> skusList, RequestResponseDelegate onResponse, 
        RequestExtDelegates channelCallback);
```

**调用示例**

```csharp
    public void OnQueryProductDetailsAsync()
    {
        List<string> productIdList = new();
        productIdList.Add("com.weile.bombchicken.1001");
        productIdList.Add("com.weile.bombchicken.1002");
        productIdList.Add("com.weile.bombchicken.1003");
        productIdList.Add("com.weile.bombchicken.1004");
        productIdList.Add("com.weile.bombchicken.1005");
        productIdList.Add("com.weile.bombchicken.1006");
        productIdList.Add("com.weile.bombchicken.1007");
        
        RequestExtDelegates extDelegates = new RequestExtDelegates
        {
            AndroidStringFail = GoogleStringFailForAndroid
        };
        
        RXGoogle.QueryProductDetailsAsync(productIdList, GoogleResponseDelegate, extDelegates);
    }
    
    private void GoogleResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"GoogleResponseDelegate: {data}");
    }
    
    
    public void GoogleStringFailForAndroid(int code, string msg, string traceId)
    {
        LogUtil.Log("EventManager", $"GoogleResponseDelegate: {code} - {msg} = {traceId}");
    }
```

**响应示例**

```json
[
  {
    "productId": "com.weile.bombchicken.1001",
    "type": "inapp",
    "title": "Diamonds * 10 (Bomb Chick)",
    "name": "Diamonds * 10",
    "description": "Spend $0.99 to get 10 diamonds",
    "price": "US$0.99",
    "price_amount_micros": 990000,
    "price_currency_code": "USD",
    "skuDetailsToken": "AEuhp4I3ayCb4X43SoGuAG4Gg9FvkeQhFJeDXqIbDnc59o7nSSCEAJjnW78m7SMN3_6X"
  },
  {
    "productId": "com.weile.bombchicken.1002",
    "type": "inapp",
    "title": "Diamonds * 90 (Bomb Chick)",
    "name": "Diamonds * 90",
    "description": "Spend $6.99 to get 90 diamonds",
    "price": "US$6.99",
    "price_amount_micros": 6990000,
    "price_currency_code": "USD",
    "skuDetailsToken": "AEuhp4KzN0I3q_PcTW91D4iN1mXQfQl0Qzu61Wv6yQgMRJ6M4nwM3nMfylKk-bJuDNse"
  }
]
```