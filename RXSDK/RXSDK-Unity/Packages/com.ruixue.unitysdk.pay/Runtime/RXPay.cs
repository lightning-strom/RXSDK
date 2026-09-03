using System.Collections.Generic;
using RuiXue.Pay.Impl;

namespace RuiXue.Pay
{
    public static class RXPay
    {
#if UNITY_ANDROID
        private static readonly IRXPay _sdk = new RXPayAndroid();
#elif UNITY_IOS
        private static readonly IRXPay _sdk = new RXPayIOS();
#elif UNITY_WEBGL
        private static readonly IRXPay _sdk = new RXPayWebGL();
#else
        private static readonly IRXPay _sdk = new RXPayNotSupport();
#endif
        
        /// <summary>
        /// 下单
        /// </summary>
        /// <param name="dic"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void Pay(Dictionary<string, object> dic, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.Pay(dic, onResponse, onError);
        }
        
#if UNITY_IOS

        /// <summary>
        /// 获取商品信息
        /// </summary>
        /// <param name="productIds"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void IOS_GetProductInfos(List<string> productIds, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            if (_sdk is RXPayIOS iosSdk)
            {
                iosSdk.GetProductInfos(productIds, onResponse, onError);
            }
        }
#endif
    }
}
