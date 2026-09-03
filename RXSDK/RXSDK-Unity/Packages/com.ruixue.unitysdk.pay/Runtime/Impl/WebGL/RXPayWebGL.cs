using System.Collections.Generic;
using System.Runtime.InteropServices;
using RuiXue.Impl;

#if UNITY_WEBGL
namespace RuiXue.Pay.Impl
{
    public class RXPayWebGL:JsCallBackHandlerBase,IRXPay
    {
        public void Pay(Dictionary<string, object> dic, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            string json = RXJsonUtil.ToJson(dic);
            RegisterJsCallBack("rx_pay", onResponse, onError);
            rx_pay(json);
        }

        [DllImport("__Internal")]
        private static extern void rx_pay(string json);
    }
}
#endif