using System.Collections.Generic;

namespace RuiXue.Share.Impl
{
    internal interface IRXShare
    {
        /// <summary>
        /// 分享调度初始化
        /// </summary>
        /// <param name="funcs"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void ShareSchedulingInit(string[] funcs, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError);

        /// <summary>
        /// 获取埋点调度
        /// </summary>
        /// <param name="func"></param>
        /// <returns></returns>
        public string GetShareScheduling(string[] func);

        /// <summary>
        /// 获取分享/广告埋点信息
        /// </summary>
        /// <param name="shareConfig"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void GetShareInfo(RXShareConfig shareConfig,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError);
        
        /// <summary>
        /// 获取埋点数据
        /// </summary>
        /// <param name="shareConfig"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void GetShareData(RXShareConfig shareConfig,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError);
        
        /// <summary>
        /// 自定义数据分享
        /// </summary>
        /// <param name="shareConfig"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void ShareCustom(RXCustomShareConfig shareConfig,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError);
        
        /// <summary>
        /// 发起 webgl 自定义分享
        /// </summary>
        /// <param name="shareParams"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void ShareForWebglCustom(Dictionary<string, object> shareParams, RequestResponseDelegate onResponse, RequestErrorDelegate onError);

        /// <summary>
        /// 发起分享
        /// </summary>
        /// <param name="shareConfig"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void Share(RXShareConfig shareConfig, RequestResponseDelegate onResponse, RequestErrorDelegate onError);
        
        /// <summary>
        /// 分享/广告结果上报
        /// </summary>
        /// <param name="func"></param>
        /// <param name="platform"></param>
        /// <param name="region"></param>
        /// <param name="scheduling_event"></param>
        /// <param name="scheduling_type"></param>
        /// <param name="transmits"></param>
        /// <param name="properties"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void ShareSchedulingReport(string func, string platform, string region, bool scheduling_event, 
            string scheduling_type, string transmits, Dictionary<string, object> properties, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError);

        /// <summary>
        /// 获取自动重定向短链接
        /// </summary>
        /// <param name="url"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void GetShortUrl(string url, RequestResponseDelegate onResponse, RequestErrorDelegate onError);
        
        /// <summary>
        /// 获取自动重定向短链接
        /// </summary>
        /// <param name="url"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void GetShortUrl(Dictionary<string, object> dic, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError);
    }
}
