### 接入方式
* Package Manager 导入 RuiXue.Reddit

[Reddit开发者](https://www.reddit.com/prefs/apps) 中创建项目项目，并获取相关参数

## SDK集成

###ios
iOS Reddit服务相关的SDK与工程配置已自动集成，在调用以下初始化方法后，使用时直接参照您所使用的功能模块（例如登录、分享）的Unity文档说明即可。

###android
打开 mainTemplate.gradle 文件，在 dependencies 中新增：
```groovy
    implementation 'com.ruixue:rxsdk_reddit:${version}'
```

## 参数说明

| 参数                    | 类型   | 说明                                    |
| ----------------------- | ------ | --------------------------------------- |
| reddit_clientid       | String   | redit 后台获取 |
| reddit_redirecturi    | String   | redit 后台获取                      |

## 初始化

###ios
```csharp
RXReddit.init("@your client id", "@your redirecturi");
```

###android
```csharp
Dictionary<string, object> map = new();
map.Add("reddit_clientid", "@your clienti");
map.Add("reddit_redirecturi", "@your redirecturi");
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

## 登录

[点此跳转到 登录方式](https://doc.ruixueyun.com/main/#/view?viewPath=94779ed0-7178-4d33-912f-82d955fbf3cb)