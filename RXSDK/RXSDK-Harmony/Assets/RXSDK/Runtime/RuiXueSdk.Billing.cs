using System;
using System.Collections.Generic;

namespace RXSDK
{
    /// <summary>RuiXueSdk 支付相关 API</summary>
    public partial class RuiXueSdk
    {
        [Obsolete("Use RXCallback<object> overload.")]
        public static void Pay(string payType, string goodsTag, Dictionary<string, object> keyValuePairs, Action<int, object, string> callback)
        {
            BillingManager.Instance.Pay(Instance, payType, goodsTag, keyValuePairs, RXUtility.ToRXCallback(callback));
        }

        [Obsolete("Use RXCallback<object> overload.")]
        public static void Pay(PayArgs args, Action<int, object, string> callback)
        {
            BillingManager.Instance.Pay(Instance, args, RXUtility.ToRXCallback(callback));
        }

        public static void Pay(PayArgs args, RXCallback<object> callback)
        {
            BillingManager.Instance.Pay(Instance, args, callback);
        }

        public static void Pay(string payType, string goodsTag, Dictionary<string, object> keyValuePairs, RXCallback<object> callback)
        {
            BillingManager.Instance.Pay(Instance, payType, goodsTag, keyValuePairs, callback);
        }
    }
}
