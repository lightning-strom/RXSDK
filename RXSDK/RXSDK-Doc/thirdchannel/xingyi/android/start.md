# 星驿支付（Android）

> 最低 Android SDK 版本：`4.0.14`

## 星驿 App 支付

```gradle
implementation 'com.ruixue:rxsdk_xingyi:4.0.14'
```

支付参数传 `hq_type=xy`。

## 星驿 H5 支付

```gradle
implementation 'com.ruixue:rxsdk_h5pay:4.0.14'
```

支付参数传 `hq_type=xy`，并在 `ext` 中传：

```json
{
  "is_h5": 1
}
```

`is_h5` 必须是整数 `1`。旧版 `hq_type=xyh5` 仅用于兼容历史接入，不建议新项目使用。

支付成功或结果未知时，最终到账与发货以后端通知和查单为准。