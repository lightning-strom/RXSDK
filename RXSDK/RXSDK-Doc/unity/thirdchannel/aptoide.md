## 参数说明

| 参数   | 类型   | 说明          |
| ------ | ------ | ------------- |
| catappult_public_key  | String | catappult API密钥 InitThirdSdk 接口传入  |

## SDK集成

```groovy
  implementation 'com.ruixue:rxsdk_catappult:${version}'
```

## 配置说明

## 初始化

```java

    Dictionary<string, object> map = new();
    map.Add("catappult_public_key","@your catappult_public_key");
    RuiXueSdk.InitThirdSdk(map, InitThirdSdkResponseDelegate, InitThirdSdkErrorDelegate);

```

## 支付

[点击跳转到支付 API](https://doc.ruixueyun.com/main/#/view?viewPath=19f058a4-7068-4c54-847d-f11e987ccf3f)
