# RXIAPService 接口文档

> iOS 内购支付相关 API 接口定义  
> 用于重构参考：接口签名、参数说明、回调约定

## 📋 接口概览

**接口类**：`RXIAPService`

**获取实例**：`[RXIAPService sharedSDK]`

**回调约定**：所有接口统一使用 `RequestComplete`，详见[回调接口说明](./callback.md)

**主要功能**：
- 内购支付（IAP）
- 商品信息查询
- 订单补单
- 货币信息获取

---

## 💰 支付

### `sharedSDK`

获取 SDK 单例实例。

**方法签名**：

```objc
+ (instancetype)sharedSDK;
```

---

### `iap:complete:`

发起内购支付。

**方法签名**：

```objc
- (void)iap:(NSDictionary *)dict complete:(RequestComplete)complete;
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `dict` | `NSDictionary *` | 是 | 支付参数字典 |
| `complete` | `RequestComplete` | 是 | 回调接口 |

**dict 参数说明**：

| 键 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `currency` | `NSString` | 是 | 币种，默认 `CNY` |
| `goods_tag` | `NSString` | 是 | 商品标签 |
| `trade_no` | `NSString` | 是 | 订单号 |
| `env` | `NSString` | 否 | 是否使用沙盒环境：`0` 正式，`1` 沙盒 |
| `indulge_auth` | `NSString` | 否 | 是否进行防沉迷验证：`0` 不验证，`1` 验证，默认不验证 |
| `is_debug` | `NSString` | 否 | 是否测试订单：`0` 正式，`1` 测试，默认 `0` |
| `ext` | `NSDictionary` | 否 | 扩展字段 |
| `notify_url` | `NSString` | 否 | 通知 CP 发货地址 |
| `transmit_args` | `NSString` | 否 | 客户端透传参数 |

**示例用法**：

```objc
NSDictionary *payParams = @{
    @"currency": @"CNY",
    @"goods_tag": @"diamond_100",
    @"trade_no": @"order_123456",
    @"env": @"0",
    @"indulge_auth": @"0",
    @"is_debug": @"0",
    @"notify_url": @"https://your-server.com/notify"
};

[[RXIAPService sharedSDK] iap:payParams complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    if (error) {
        NSLog(@"支付失败: %@", error.msg);
        return;
    }
    NSLog(@"支付成功: %@", response);
}];
```

---

### `setInterval:`

设置重复下单间隔。

**方法签名**：

```objc
- (void)setInterval:(NSInteger)interval;
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `interval` | `NSInteger` | 是 | 间隔时间（秒），默认 300s |

> 防止结果回调前重复下单导致订单验证错误

---

## 📦 商品信息

### `getProductInfoWithProductIdArr:complete:`

查询商品信息。

**方法签名**：

```objc
- (void)getProductInfoWithProductIdArr:(NSArray *)productIdArr
                              complete:(void(^)(NSArray<SKProduct *> *productInfoList))complete;
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `productIdArr` | `NSArray *` | 是 | 商品 ID 数组 |
| `complete` | `Block` | 是 | 回调，返回 `SKProduct` 数组 |

**示例用法**：

```objc
[[RXIAPService sharedSDK] getProductInfoWithProductIdArr:@[@"com.app.diamond100", @"com.app.diamond500"]
                                                complete:^(NSArray<SKProduct *> *productInfoList) {
    for (SKProduct *product in productInfoList) {
        NSLog(@"商品: %@, 价格: %@", product.localizedTitle, product.price);
    }
}];
```

---

### `getProductInfo`

获取初始化保存的计费点。

**方法签名**：

```objc
- (NSDictionary *)getProductInfo;
```

---

### `getLocaleIdentifierWithProductId:timeout:complete:`

获取地区货币符号。

**方法签名**：

```objc
- (void)getLocaleIdentifierWithProductId:(NSString *)productId
                                 timeout:(NSInteger)timeout
                                complete:(RequestComplete)complete;
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `productId` | `NSString *` | 是 | 商品 ID |
| `timeout` | `NSInteger` | 否 | 请求超时时间，默认 2 秒，小于 0 为默认时间 |
| `complete` | `RequestComplete` | 是 | 回调接口 |

---

## 🔄 补单

### `checkHasFailedOrder`

查询是否需要补单。

**方法签名**：

```objc
- (BOOL)checkHasFailedOrder;
```

**返回值**：

| 类型 | 说明 |
|------|------|
| `BOOL` | `YES` 需要补单，`NO` 不需要 |

---

### `reFailOrderWithMaxCount:complete:`

执行补单。

**方法签名**：

```objc
- (void)reFailOrderWithMaxCount:(NSInteger)maxCount
                       complete:(RequestComplete)complete;
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `maxCount` | `NSInteger` | 是 | 最大重试次数，默认 5 次 |
| `complete` | `RequestComplete` | 是 | 回调接口 |

**示例用法**：

```objc
if ([[RXIAPService sharedSDK] checkHasFailedOrder]) {
    [[RXIAPService sharedSDK] reFailOrderWithMaxCount:5 complete:^(NSDictionary *response, RX_CommonRequestError *error) {
        if (error) {
            NSLog(@"补单失败: %@", error.msg);
            return;
        }
        NSLog(@"补单成功");
    }];
}
```

---

### `sk2UnfinishUncompletedTransactionsWithOrderInfo:completeHandle:`

StoreKit2 查询未完成交易。

**方法签名**：

```objc
- (void)sk2UnfinishUncompletedTransactionsWithOrderInfo:(NSDictionary *)orderInfo
                                         completeHandle:(RequestComplete)handle;
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `orderInfo` | `NSDictionary *` | 是 | 订单信息 |
| `handle` | `RequestComplete` | 是 | 回调接口 |

---

## 📝 重构注意事项

### 1. 沙盒环境

- 开发测试时设置 `env = 1` 使用沙盒环境
- 正式发布时设置 `env = 0`

### 2. 补单机制

- 每次启动应用时调用 `checkHasFailedOrder` 检查是否需要补单
- 如果需要，调用 `reFailOrderWithMaxCount:complete:` 执行补单

### 3. 防沉迷验证

- 国内版本建议开启 `indulge_auth = 1`
- 海外版本可关闭

### 4. StoreKit2

- iOS 15+ 支持 StoreKit2
- 使用 `sk2UnfinishUncompletedTransactionsWithOrderInfo:` 处理 SK2 交易

---

## 🔗 相关文档

- [回调接口说明](./callback.md)
- [RXService 接口文档](./rxservice_api.md)
