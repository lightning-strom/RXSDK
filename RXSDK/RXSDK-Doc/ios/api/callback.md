# 回调接口说明

> iOS SDK 回调约定和错误处理规范

## 📋 回调类型

### RequestComplete

通用请求回调 Block，用于大部分 API 接口。

**定义**：

```objc
typedef void(^RequestComplete)(NSDictionary *response, RX_CommonRequestError *error);
```

**参数说明**：

| 参数 | 类型 | 说明 |
|------|------|------|
| `response` | `NSDictionary *` | 请求成功时返回的数据，失败时为 `nil` |
| `error` | `RX_CommonRequestError *` | 请求失败时返回的错误对象，成功时为 `nil` |

**使用示例**：

```objc
[[RXService sharedSDK] initWithConfig:config complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    if (error) {
        NSLog(@"初始化失败: %@", error.msg);
        return;
    }
    NSLog(@"初始化成功: %@", response);
}];
```

---

### RXLoginDelegate

登录相关回调协议。

**定义**：

```objc
@protocol RXLoginDelegate <NSObject>

/**
 * 登录回调
 * @param response 返回数据，登录失败返回nil
 * @param error 错误返回，登录成功返回nil
 */
- (void)rx_LoginCallBackWithResponse:(NSDictionary * _Nullable)response 
                               error:(RX_CommonRequestError *)error;

/**
 * 防沉迷回调
 * @param response 返回数据
 * @param error 错误返回
 */
- (void)rx_antiCallBackWithResponse:(NSDictionary *)response 
                              error:(NSError *)error;

@end
```

**使用示例**：

```objc
// 设置代理
[RXService sharedSDK].loginDelegate = self;

// 实现代理方法
- (void)rx_LoginCallBackWithResponse:(NSDictionary *)response error:(RX_CommonRequestError *)error {
    if (error) {
        NSLog(@"登录失败: %@", error.msg);
        return;
    }
    NSLog(@"登录成功: %@", response);
}
```

---

### RXPublicDelegate

全局通用回调协议。

**定义**：

```objc
@protocol RXPublicDelegate <NSObject>

/**
 * 全局通用回调
 * @param type 回调类型
 * @param response 回调数据
 */
- (void)rxPublicCallback:(NSInteger)type response:(NSDictionary *)response;

@end
```

**回调类型**：

| type 值 | 说明 |
|---------|------|
| `10001` | 上报用户反馈 |

---

## ❌ 错误对象

### RX_CommonRequestError

**属性**：

| 属性 | 类型 | 说明 |
|------|------|------|
| `code` | `NSInteger` | 错误码 |
| `msg` | `NSString *` | 错误信息 |

**错误码规范**：

- 服务端错误码：6 位整数，原样透传
- 客户端错误码：4 位整数

---

## 🔗 相关文档

- [错误码规范](../../common/specs/error_codes.md)
