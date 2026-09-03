# 星驿支付（Cocos2dx）

星驿支付仅支持 Android，最低 RuiXue Android SDK 版本为 `4.0.14`。

## Android 依赖

```gradle
implementation 'com.ruixue:rxsdk_xingyi:4.0.14'
implementation 'com.ruixue:rxsdk_h5pay:4.0.14'
```

同时配置 Volcengine Maven 仓库：

```gradle
maven { url 'https://artifact.bytedance.com/repository/Volcengine/' }
```

## App 支付

```cpp
ruixue::RuixueBridge::getInstance()->pay(R"({
  "payType": "xy",
  "goodsTag": "YOUR_GOODS_TAG",
  "tradeNo": "YOUR_TRADE_NO"
})", callback);
```

## H5 支付

```cpp
ruixue::RuixueBridge::getInstance()->pay(R"({
  "payType": "xy",
  "goodsTag": "YOUR_GOODS_TAG",
  "tradeNo": "YOUR_TRADE_NO",
  "ext": {"is_h5": 1}
})", callback);
```

`is_h5` 必须是 JSON 整数 `1`。iOS 调用 `payType=xy` 会直接返回平台不支持。
