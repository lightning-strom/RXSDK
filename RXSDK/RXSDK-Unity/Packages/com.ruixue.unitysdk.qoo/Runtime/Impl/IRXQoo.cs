using UnityEngine;
namespace RuiXue.Qoo.Impl
{
    internal interface IRXQoo
    {
        /// <summary>
        /// 防盗检测
        /// </summary>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void CheckLicense(RequestResponseDelegate onResponse, RequestErrorDelegate onError);

        /// <summary>
        /// 恢复已购商品
        /// </summary>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void RestorePurchases(RequestResponseDelegate onResponse, RequestErrorDelegate onError);

        /// <summary>
        /// 消耗订单 (可消耗商品)
        /// </summary>
        /// <param name="purchase_id"></param>
        /// <param name="token"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void Consume(string purchase_id, string token, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError);

        /// <summary>
        /// 获取商品清单 (可选)
        /// </summary>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void QueryProducts(RequestResponseDelegate onResponse, RequestErrorDelegate onError);

        /// <summary>
        /// 获取部分商品信息 (可选)
        /// </summary>
        /// <param name="productIds"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void QueryProductInfo(string productIds, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError);

        /// <summary>
        /// 分页获取商品清单(可选)
        /// </summary>
        /// <param name="page"></param>
        /// <param name="size"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void QueryProducts(int page, int size, RequestResponseDelegate onResponse, RequestErrorDelegate onError);

        /// <summary>
        /// 从 QooApp 游戏商店开启您的游戏详情页面 (可选)
        /// </summary>
        /// <param name="activity"></param>
        public void OpenGameDetail();

        /// <summary>
        /// #从QooApp获取最新的游戏版本号 (可选)
        /// </summary>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void LatestVersionCode(RequestResponseDelegate onResponse, RequestErrorDelegate onError);

        /// <summary>
        /// 設定OpenSDK的語言 (可選)
        /// </summary>
        /// <param name="eng"></param>
        /// <returns></returns>
        public bool SetLocale(string eng);

        /// <summary>
        /// 数据解码
        /// </summary>
        /// <param name="response"></param>
        /// <returns></returns>
        public string GetDataFromResponse(string response);
    }
}

