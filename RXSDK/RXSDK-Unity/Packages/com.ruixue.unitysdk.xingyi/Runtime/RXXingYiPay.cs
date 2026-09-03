using System.Collections.Generic;
using RuiXue.Pay;

namespace RuiXue.XingYi
{
    /// <summary>
    /// 星驿支付入口，仅支持 Android。
    /// </summary>
    public static class RXXingYiPay
    {
        public const string PayType = "xy";

        /// <summary>
        /// 发起星驿 App 支付。
        /// </summary>
        public static void PayApp(Dictionary<string, object> parameters,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            Pay(parameters, false, onResponse, onError);
        }

        /// <summary>
        /// 发起星驿 H5 支付。
        /// </summary>
        public static void PayH5(Dictionary<string, object> parameters,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            Pay(parameters, true, onResponse, onError);
        }

        private static void Pay(Dictionary<string, object> parameters, bool isH5,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
#if UNITY_ANDROID && !UNITY_EDITOR
            var request = parameters == null
                ? new Dictionary<string, object>()
                : new Dictionary<string, object>(parameters);
            request["hq_type"] = PayType;

            var ext = CopyExt(request);
            if (isH5)
            {
                ext["is_h5"] = 1;
                request["ext"] = ext;
            }
            else if (ext.Remove("is_h5"))
            {
                request["ext"] = ext;
            }

            RXPay.Pay(request, onResponse, onError);
#else
            onError?.Invoke(
                "{\"code\":4001,\"msg\":\"星驿支付仅支持 Android 平台\"}");
#endif
        }

        private static Dictionary<string, object> CopyExt(
            Dictionary<string, object> request)
        {
            if (request.TryGetValue("ext", out object value) &&
                value is Dictionary<string, object> ext)
            {
                return new Dictionary<string, object>(ext);
            }
            return new Dictionary<string, object>();
        }
    }
}
