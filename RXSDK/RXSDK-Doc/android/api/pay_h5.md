# Android H5 支付接入

> **版本**：与 [README](../README.md) 一致  
> **来源**：基于官方导出文档整理  
> **适用**：SDK v3.6.x 及以上，使用 `HQSdkWrapper.getInstance().doPay` 单独拉起 H5 支付。

---

## 依赖

```gradle
implementation 'com.ruixue:rxsdk_h5pay:${version}'
```

---

## 接口说明

```java
/**
 * H5 支付
 * SDK v3.6.x 后使用 HQSdkWrapper.getInstance().doPay 单独拉起 H5 支付
 * @param activity 应用上下文
 * @param hashMap  HQParams 参数，见下方参数说明
 * @param callback 回调
 */
doPay(Activity activity, Map<String, Object> hashMap, RXRequestCallback callback)
```

---

## 参数说明（Map）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| hq_type | string | 否 | 支付类型 |
| goods_tag | string | 是 | 瑞雪计费点标识 |
| trade_no | string | 是 | 商户订单号 |
| transmit_args | string | 否 | 透传参数 |
| notify_url | string | 否 | 支付成功通知 CP 发货地址 |
| currency | string | 是 | 币种，国内传 `CNY`，见 [国家编码币种字典](https://doc.ruixueyun.com/main/#/view?viewPath=1e52c53c-04c2-485d-9d07-ce752d4490bc) |
| ext | object | 否 | 支付下单扩展信息，按渠道对接 |
| indulge_auth | int | 否 | 是否防沉迷验证，0 不验证、1 验证；自运营默认 1，三方默认 0 |
| age | int | 否 | 默认取登录返回 age |
| game_info | object | 否 | 游戏自定义数据；上报区服角色需在此传入，见下方 game_info 说明 |
| bigdata_report | HashMap | 否 | 商业化支付参数，商业化触发的支付需传，否则统计可能丢失，见下方说明 |
| custom_ext | Map | 否 | 自定义透传，可含 bigdata_ext 等 |

### game_info 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| cp_game_character_id | string | 否 | 角色 ID |
| cp_game_area_id | string | 否 | 区服 ID |

### bigdata_report 字段说明（商业化）

| 字段 | 类型 | 说明 |
|------|------|------|
| scene_identifier | string | 场景标识 |
| scene_name | string | 场景名称 |
| trigger_button_identifier | string | 触发按钮标识 |
| trigger_button_name | string | 触发按钮名称 |
| window_identifier | string | 窗口标识 |
| window_name | string | 窗口名称 |
| window_sequence | string | 窗口展示顺序 |
| gift_package | HashMap | 礼包信息（identifier、name、purchase_medium、price、billing_point 等） |

### hq_type 取值示例

| hq_type | 说明 |
|---------|------|
| wch_hw | 微信海外 H5 支付 |

---

## 调用示例

```java
Activity activity; // 应用上下文
String goods_tag;  // 瑞雪后台计费点名称
String pay_type = "wch_hw";
Map<String, Object> extmap = new HashMap<>();

PayParams.GameInfo gameInfo = new PayParams.GameInfo();
gameInfo.setCpGameCharacterId("角色 id");
gameInfo.setCpGameAreaId("区服 id");

Map<String, Object> payParams = new HashMap<>();
payParams.put("hq_type", pay_type);
payParams.put("goods_tag", goods_tag);
payParams.put("trade_no", "cp订单号");
payParams.put("transmit_args", "cp透传参数，非必传");
payParams.put("ext", extmap);
payParams.put("game_info", gameInfo.toMap());
payParams.put("indulge_auth", 1);
payParams.put("currency", "CNY");
payParams.put("user_real_currency", "CNY");
payParams.put("user_real_price", 100);

RXRequestCallback callback = new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
        int code = jsonObject.optInt("code", -1);
        if (code == 0) {
            JSONObject data = jsonObject.optJSONObject("data");
            // 处理成功逻辑
        } else {
            String msg = jsonObject.optString("msg");
            String thirdcode = String.valueOf(jsonObject.opt("thirdcode"));
            String thirdmsg = String.valueOf(jsonObject.opt("thirdmsg"));
            // 处理失败逻辑
        }
    }

    @Override
    public void onError(RXException e) {
        // 异常处理
    }
};
HQSdkWrapper.getInstance().doPay(activity, payParams, callback);
```

---

## 响应结构

成功时返回示例：

```json
{
    "code": 0
}
```

---

## 其他支付（Quick 渠道）

Quick 渠道使用 `pay(Activity, Map, RXJSONCallback)` 接口，参数与 H5 支付类似（含 `game_info`、`bigdata_report` 等）。瑞雪后台配置与三方接入说明请参考：[Quick 支付配置](https://doc.ruixueyun.com/main/#/view?path=9ea39ce6-7b01-40a7-8a28-f29c512b5b36)、[Quick 快速入口](https://doc.ruixueyun.com/main/#/view?path=07fb9417-9319-4920-9e35-ea7b301a0869)。

---

## 相关文档

- [回调接口说明](./callback.md)
- [快速接入](../QUICK_START.md)
- [跨端支付契约](../../common/api/50_pay.md)
