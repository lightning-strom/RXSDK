# 支付

> **版本**：4.0.0
> **更新日期**：2026-07-31
>
> 发起支付、查询商品信息（iOS）

## 📋 接口概览

**入口类**：`RXSDK`（`namespace RuiXue`）

**回调约定**：所有异步接口统一使用 `SdkCallback`，回调自动切换至 **Unity 主线程**。

**主要功能**：

- 发起支付（支持国内外多种支付方式）
- 查询商品信息（iOS 内购）

> ⚠️ **重要**：客户端支付回调**不得**作为发货依据，必须等待**服务端异步回调**验证订单后再发货。

---

## 💰 支付

### `Pay`

发起支付，支持多渠道多种支付方式。

**方法签名**：

```csharp
void RXSDK.Pay(Dictionary<string, object> dic, SdkCallback callback)
Task<SdkResult> RXSDK.PayAsync(Dictionary<string, object> dic)
Task<SdkResult> RXSDK.PayAsync(Dictionary<string, object> dic, int timeoutMs)
```

**参数说明**：

| 参数 Key | 类型 | 必填 | 说明 |
|----------|------|------|------|
| `hq_type` | `string` | 是 | 支付方式，取值见下方常量表 |
| `goods_tag` | `string` | 是 | 商品标识，与瑞雪后台配置一致 |
| `trade_no` | `string` | 是 | 游戏服务端生成的订单号，全局唯一 |
| `currency` | `string` | 是 | 货币代码，如 `"CNY"`、`"USD"`、`"IDR"` |
| `indulge_auth` | `int` | 是 | 防沉迷校验：`1` 校验，`0` 不校验 |
| `age` | `int` | 是 | 用户年龄（防沉迷用），不确定时传 `30` |
| `notify_url` | `string` | 否 | 支付结果回调地址（Xsolla / UniPay / Aptoide 等必填） |
| `env` | `int` | 否 | 环境：`0` 正式，`1` 测试/沙盒 |
| `is_debug` | `int` | 否 | 调试模式：`1` 开启，`0` 关闭 |
| `transmit_args` | `string` | 否 | CP 透传参数，支付结果原样返回 |
| `ext` | `Dictionary<string,object>` | 否 | 扩展参数，各支付方式额外字段见下表 |
| `game_info` | `Dictionary<string,object>` | 否 | 游戏角色信息（UniPin 等渠道必填） |
| `user_real_currency` | `string` | 否 | 用户实际货币代码（海外归因统计用） |
| `user_real_price` | `string` | 否 | 用户实际支付价格（海外归因统计用） |
| `openid` | `string` | 否 | 用户 openid（Checkout 支付必填） |
| `h5_setting_id` | `int` | 否 | H5 设置 ID（Checkout 支付必填） |
| `h5_platform_id` | `string` | 否 | H5 平台 ID（Checkout 支付必填） |
| `onlyGetOrder` | `bool` | 否 | 仅获取订单号，不拉起支付（抖音 H5 支付场景） |
| `game_money` | `int` | 否 | 游戏币数量（B 站支付必填） |

**`hq_type` 支付方式常量表**：

| 值 | 支付方式 | 适用渠道 | 额外必填字段 |
|----|---------|---------|------------|
| `"wechat"` | 微信支付（App） | 微乐等自运营 | — |
| `"wch"` | 微信 H5 | 通用 | — |
| `"alipay"` | 支付宝（App） | 自运营 | — |
| `"aph"` | 支付宝 H5 | 通用 | — |
| `"iap"` | iOS 内购（App Store） | iOS | — |
| `"google"` | Google Play | 海外 Android | `ext.third_tag`（Google Play ProductID） |
| `"huawei"` / `"hwjos"` | 华为支付 | 华为渠道 | — |
| `"mi"` | 小米支付 | 小米渠道 | — |
| `"vivo"` | vivo 支付 | vivo 渠道 | — |
| `"oppo"` | OPPO 支付 | OPPO 渠道 | — |
| `"bilibili"` | B 站支付 | B 站渠道 | `game_money` |
| `"douyin"` | 抖音支付 | 抖音渠道 | — |
| `"douyinh5"` | 抖音 H5 支付 | 抖音渠道 | `onlyGetOrder`（仅获取订单号时传 `true`） |
| `"xy"` | 星驿 App/H5 支付 | Android | H5 额外传 `ext.is_h5=1`（int） |
| `"baidunet"` | 百度网讯 | 百度渠道 | — |
| `"leidian"` | 雷电 | 雷电渠道 | — |
| `"co"` | Checkout（海外聚合） | 海外通用 | `openid`、`h5_setting_id`、`h5_platform_id`、`ext.country_code`、`ext.return_url` |
| `"xsa"` | Xsolla | 海外 | `notify_url`、`ext.user_name` |
| `"unipin"` | UniPin | 东南亚 | `game_info`（含角色、区服） |
| `"upay"` | UniPay | 海外 | `notify_url`、`ext.type_id`、`ext.vendor` |
| `"aptoide"` | Aptoide | 海外 | `notify_url`、`ext.user_name` |
| `"yeepay"` | 易宝支付 | 海外 | `notify_url`、`ext.user_name` |
| `"a"` | 银联 | 自运营 | `ext.hq_type`（如 `"alipay"`） |

**`game_info` 字段（UniPin 等渠道必填）**：

| Key | 类型 | 说明 |
|-----|------|------|
| `cp_game_character_id` | `string` | 游戏角色 ID |
| `cp_game_area_id` | `string` | 游戏区服 ID |

**`ext` 各支付方式额外字段**：

| 支付方式 | Key | 类型 | 说明 |
|---------|-----|------|------|
| `google` | `third_tag` | `string` | Google Play 商品 ProductID |
| `co`（Checkout） | `country_code` | `string` | 国家代码，如 `"HK"` |
| `co`（Checkout） | `return_url` | `string` | 支付完成跳转地址 |
| `xsa`（Xsolla） | `user_name` | `string` | 用户名 |
| `upay`（UniPay） | `type_id` | `string` | 支付方式类型 ID |
| `upay`（UniPay） | `vendor` | `string` | 支付厂商 |
| `xy`（星驿 H5） | `is_h5` | `int` | 固定传 `1`；App 支付不传 |

**响应结构**：

成功时 `result.Data` 为 JSON 字符串：

```json
{
    "trade_no": "your_server_order_id",
    "rx_order_id": "rx_20240101123456",
    "goods_tag": "vip_month_card",
    "hq_type": "wechat",
    "currency": "CNY",
    "status": 1
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `trade_no` | `string` | 游戏服务端订单号（原样返回） |
| `rx_order_id` | `string` | 瑞雪平台订单号 |
| `goods_tag` | `string` | 商品标识 |
| `hq_type` | `string` | 实际支付方式 |
| `currency` | `string` | 货币代码 |
| `status` | `int` | `1` = 支付成功 |

**示例用法**：

```csharp
// 微信支付（国内）
var dic = new Dictionary<string, object> {
    { "hq_type",      "wechat"         },
    { "goods_tag",    "vip_month_card" },
    { "trade_no",     serverOrderId    },
    { "currency",     "CNY"            },
    { "indulge_auth", 1                },
    { "age",          30               },
};
RXSDK.Pay(dic, result => result.Match(
    ok:   data  => Debug.Log("支付流程完成，等待服务端确认"),
    fail: error => {
        if (result.Code == -2) Debug.Log("用户取消支付");
        else Debug.LogError($"[{result.Code}] {error}");
    }
));

// Google Play 支付（海外）
var dic = new Dictionary<string, object> {
    { "hq_type",      "google"      },
    { "goods_tag",    "coin_100"    },
    { "trade_no",     serverOrderId },
    { "currency",     "USD"         },
    { "indulge_auth", 1             },
    { "age",          30            },
    { "ext", new Dictionary<string, object> {
        { "third_tag", "com.example.coin_100" }
    }},
};

// iOS 内购
var dic = new Dictionary<string, object> {
    { "hq_type",       "iap"          },
    { "goods_tag",     "ios_tag"      },
    { "trade_no",      serverOrderId  },
    { "currency",      "CNY"          },
    { "indulge_auth",  0              },
    { "age",           30             },
    { "env",           0              }, // 0=正式 1=沙盒
    { "game_info", new Dictionary<string, object> {
        { "cp_game_character_id", "role_123" },
        { "cp_game_area_id",      "server_1" },
    }},
};

// 星驿支付（仅 Android，需安装 com.ruixue.unitysdk.xingyi）
var xingYiOrder = new Dictionary<string, object> {
    { "goods_tag", "vip_month_card" },
    { "trade_no",  serverOrderId    },
};
RXXingYiPay.PayApp(xingYiOrder, onSuccess, onError);
RXXingYiPay.PayH5(xingYiOrder, onSuccess, onError);

// async + 超时 120s
var result = await RXSDK.PayAsync(dic, timeoutMs: 120_000);
if (!result) Debug.LogError("支付超时或失败");
```

**常见错误码**：

| Code | 说明 | 处理建议 |
|------|------|---------|
| `-2` | 用户取消支付 | 无需提示或仅轻提示 |
| `-1` | 网络异常 | 提示检查网络后重试 |
| `4000` | 支付失败（通用） | 展示 `result.Error` 内容 |
| `4100` | 订单错误 | 检查服务端订单生成逻辑 |

---

## 🛍️ 商品信息（iOS 专属）

### `GetProductInfos`

查询 App Store 商品信息（仅 iOS 平台）。

**方法签名**：

```csharp
#if UNITY_IOS
void RXSDK.GetProductInfos(List<string> productIds, SdkCallback callback)
#endif
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `productIds` | `List<string>` | 是 | App Store 商品 ID 列表 |
| `callback` | `SdkCallback` | 是 | 回调 |

**响应结构**：

成功时 `result.Data` 为 JSON 字符串，包含商品列表（价格、标题、货币符号等）：

```json
[
    {
        "product_id": "com.example.coin_100",
        "title": "100金币",
        "description": "100金币礼包",
        "price": "6.00",
        "currency_symbol": "¥",
        "currency_code": "CNY"
    }
]
```

**示例用法**：

```csharp
#if UNITY_IOS
var productIds = new List<string> { "com.example.coin_100", "com.example.vip_month" };
RXSDK.GetProductInfos(productIds, result => result.Match(
    ok:   data  => Debug.Log("商品信息: " + data),
    fail: error => Debug.LogError("查询失败: " + error)
));
#endif
```

---

## 🔗 相关文档

- [账号登录](./02_login.md)
- [回调说明](./callback.md)
- [错误码规范](../../common/specs/error_codes.md)
