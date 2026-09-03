using System;
using System.Collections.Generic;
using RuiXue.XingYi;
using UnityEngine;

public class RuiXueXingYiDemo : MonoBehaviour
{
    public void PayApp()
    {
        RXXingYiPay.PayApp(CreateOrder(),
            data => Debug.Log($"星驿 App 支付结果：{data}"),
            error => Debug.LogError($"星驿 App 支付失败：{error}"));
    }

    public void PayH5()
    {
        RXXingYiPay.PayH5(CreateOrder(),
            data => Debug.Log($"星驿 H5 支付结果：{data}"),
            error => Debug.LogError($"星驿 H5 支付失败：{error}"));
    }

    private static Dictionary<string, object> CreateOrder()
    {
        return new Dictionary<string, object>
        {
            ["goods_tag"] = "replace_with_goods_tag",
            ["trade_no"] = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds().ToString(),
            ["currency"] = "CNY",
            ["age"] = 18
        };
    }
}
