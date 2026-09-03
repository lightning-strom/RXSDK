using System.Collections.Generic;
using RuiXue.Google.Impl;

namespace RuiXue.Google
{
    public static class RXGoogle
    {
        
#if UNITY_ANDROID
        private static readonly IRXGoogle _sdk = new RXGoogleAndroid();
#elif UNITY_IOS
        private static readonly IRXGoogle _sdk = new RXGoogleIOS();
#else
        private static readonly IRXGoogle _sdk = new RXGoogleNotSupport();
#endif

        /// <summary>
        /// 注册ClientID,
        /// </summary>
        /// <param name="clientID"></param>
        public static void Regist(string clientID)
        {
            _sdk.Regist(clientID);
        }
        
        /// <summary>
        /// Google 商品详情查询
        /// </summary>
        /// <param name="skusList"></param>
        /// <param name="onResponse"></param>
        /// <param name="channelCallback"></param>
        public static void QueryProductDetailsAsync(List<string> skusList, RequestResponseDelegate onResponse,
            RequestErrorDelegate errorDelegate)
        {
            _sdk.QueryProductDetailsAsync(skusList, onResponse, errorDelegate);
        }
    }
}