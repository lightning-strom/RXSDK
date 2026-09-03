# RXIAPService 订阅类型支付改动记录

## 日期：2026-03-31

### 改动文件

- `RXIAPService.m`
- `RXStoreKit.swift`

---

### 一、验证订单接口新增参数

#### 1. 新增 `original` 参数

- 订阅类型支付（`order_type == "subscribe"`）：传 `original: "1"`
- 非订阅类型支付：不传该参数
- **改动位置**：`verifyTransactionResult:transaction:` 方法，构建验证请求参数处

#### 2. 新增 `price`（价格）和 `currency`（币种）参数

- 类型：`NSString`
- 订阅类型支付：优先判断是否有优惠价格（`introductoryPrice`），有则传优惠价格，没有传正常价格
- 非订阅类型支付：传正常价格
- **改动位置**：
  - **SK1 路径**：`productsRequest:didReceiveResponse:` 中从 `SKProduct` 获取价格和币种，保存到 `orderInfo`
  - **SK2 路径**：`sk2VerifyJws:jwsList:isRe:isOrder:` 中从 StoreKit2Manager 回调的 `response` 获取价格和币种
  - **验证请求**：`verifyTransactionResult:transaction:` 中将 `price` 和 `currency` 加入请求字典

---

### 二、下单接口新增 `order_type` 字段

- 服务端下单接口返回值新增 `order_type` 字段
- 订阅类型：`order_type = "subscribe"`
- 非订阅类型：该字段不存在
- `order_type` 随 `dataDic` 自动保存到 `self.orderInfo`，贯穿整个支付和验证流程

---

### 三、订阅类型独立补单机制

#### 1. 独立存储

- 新增存储 key `kSaveSubscribeReceiptData`，订阅订单凭证与普通订单凭证隔离存储
- `saveReceiptData:` 根据 `order_type` 自动路由到对应存储 key
- 新增方法：
  - `+getSubscribeReceiptData` — 获取订阅订单本地凭证
  - `-removeSubscribeReceiptData` — 清除订阅订单本地凭证

#### 2. 统一补单逻辑

订阅补单统一使用 `restoreCompletedTransactions` 从苹果重新获取凭证再验证，覆盖以下两种场景：

- **场景一**：苹果回调支付成功，验证订单失败
- **场景二**：付款成功，苹果回调失败

统一流程：

```
timer 触发 → timerAction 检测到订阅订单
  → restoreCompletedTransactions（从苹果重新获取凭证）
  → SKPaymentTransactionStateRestored 回调
  → 从订阅独立存储读取订单信息，匹配订单号
  → buyAppleStoreProductSucceed... → checkAppStoreResult...
  → verifyTransactionResult（携带 original/price/currency 参数）
```

#### 3. 改动的补单入口

| 方法 | 改动说明 |
|------|----------|
| `timerAction` | 订阅订单调用 `restoreCompletedTransactions`，非订阅走原逻辑 |
| `checkOrderStatus:` | 订阅订单调用 `restoreCompletedTransactions`，非订阅走原逻辑 |
| `reFailOrderWithMaxCount:complete:` | 统一由 timer 触发，首次 fire 时自动处理订阅 |
| `checkHasFailedOrder` | 同时检查普通订单和订阅订单存储 |
| `fetchOrderWithDict:completeHandle:` | 同时检查普通订单和订阅订单存储 |
| `SKPaymentTransactionStateRestored` | 新增订阅补单处理：恢复订单信息 → 走验证流程 |

#### 4. 新增属性

| 属性 | 说明 |
|------|------|
| `isSubscribeRestore` | 标记当前 restore 是否由订阅补单触发 |

#### 5. 凭证清除逻辑

以下位置均根据 `order_type` 路由到对应的清除方法：

- `verifyTransactionResult:` 验证成功
- `verifyTransactionResult:` 验证失败（不可重试的错误码）
- `verifyTransactionResult:` 数据格式错误（不含 ext）
- `checkAppStoreResultWithBase64String:` 凭证为空
- `timerAction` 超过最大重试次数

---

### 四、StoreKit2Manager 新增订阅恢复方法（RXStoreKit.swift）

新增 `restoreSubscriptionReceipts(completion:)` 方法，专门用于订阅补单：

1. **先查 `Transaction.unfinished`**：覆盖场景二（付款成功但回调失败），交易尚未 finish
2. **再查 `Transaction.currentEntitlements`**：覆盖场景一（交易已 finish 但服务端验证失败），通过活跃订阅权益获取 JWS
3. 仅筛选 `.autoRenewable` 类型交易，避免误处理非订阅商品
4. 使用 `foundProductIDs` 去重，防止同一商品返回多条凭证

原有 `finishUncompletedTransactions` 方法不变，仍用于非订阅场景。

---

### 五、非订阅类型影响

非订阅类型的支付和补单逻辑**完全不受影响**，所有改动均通过 `order_type == "subscribe"` 条件判断隔离。
