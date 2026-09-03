using RuiXue.Qoo.Impl;
using UnityEngine;

namespace RuiXue.Qoo
{
    public static class RXQoo
    {
        #if UNITY_ANDROID
        private static readonly IRXQoo _sdk = new RXQooAndroid();
        #else
        private static readonly IRXQoo _sdk = new RXQooNotSupport();
        #endif

        /// <summary>
        /// 防盗检测
        /// </summary>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void CheckLicense(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.CheckLicense(onResponse, onError);
        }

        /// <summary>
        /// 恢复已购商品
        /// </summary>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void RestorePurchases(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.RestorePurchases(onResponse, onError);
        }

        /// <summary>
        /// 消耗订单 (可消耗商品)
        /// </summary>
        /// <param name="purchase_id"></param>
        /// <param name="token"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void Consume(string purchase_id, string token,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.Consume(purchase_id, token, onResponse, onError);
        }

        /// <summary>
        /// 获取商品清单 (可选)
        /// </summary>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void QueryProducts(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.QueryProducts(onResponse, onError);
        }

        /// <summary>
        /// 获取部分商品信息 (可选)
        /// </summary>
        /// <param name="productIds"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void QueryProductInfo(string productIds, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            _sdk.QueryProductInfo(productIds, onResponse, onError);
        }

        /// <summary>
        /// 分页获取商品清单(可选)
        /// </summary>
        /// <param name="page"></param>
        /// <param name="size"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void QueryProducts(int page, int size,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.QueryProducts(page, size, onResponse, onError);
        }

        /// <summary>
        /// 从 QooApp 游戏商店开启您的游戏详情页面 (可选)
        /// </summary>
        /// <param name="activity"></param>
        public static void OpenGameDetail()
        {
            _sdk.OpenGameDetail();
        }

        /// <summary>
        /// #从QooApp获取最新的游戏版本号 (可选)
        /// </summary>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void LatestVersionCode(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.LatestVersionCode(onResponse, onError);
        }

        /// <summary>
        /// 設定OpenSDK的語言 (可選)
        /// </summary>
        /// <param name="eng"></param>
        /// <returns></returns>
        public static bool SetLocale(string eng)
        {
            return _sdk.SetLocale(eng);
        }

        /// <summary>
        /// 数据解码
        /// </summary>
        /// <param name="response"></param>
        /// <returns></returns>
        public static string GetDataFromResponse(string response)
        {
            return _sdk.GetDataFromResponse(response);
        }
    }
}

