using System.Collections.Generic;
using System.Runtime.InteropServices;
#if UNITY_IOS
namespace RuiXue.Pay.Impl
{
    internal class RXPayIOS : IRXPay
    {
        /// <summary>
        ///  下单
        /// </summary>
        /// <param name="dic"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void Pay(Dictionary<string, object> dic, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            string json = RXJsonUtil.ToJson(dic);
            RuiXueSdkDriver.RegisterIOSCallBack("ios_pay_requestWithDict", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
        
            ios_iap_requestWithDict(json, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        /// <summary>
        ///  获取商品信息
        /// </summary>
        /// <param name="productIds"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void GetProductInfos(List<string> productIds, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            string json = RXJsonUtil.ToJson(productIds);
            RuiXueSdkDriver.RegisterIOSCallBack("ios_getProductInfoWithProductIdArr", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });

            ios_getProductInfoWithProductIdArr(json, RuiXueSdkDriver.IOSCallBackOnResponse,
                RuiXueSdkDriver.IOSCallBackOnError);
        }
    
        // 下单
        [DllImport("__Internal")]
        public static extern void ios_iap_requestWithDict(string dictJson,
            IOSCallBackCommonDelegate requestResponse,
            IOSCallBackCommonDelegate requestError
        );
        
        // 获取商品信息
        [DllImport("__Internal")]
        public static extern void ios_getProductInfoWithProductIdArr(string productIdArr, IOSCallBackCommonDelegate requestResponse,
            IOSCallBackCommonDelegate requestError);
    }
}

#endif