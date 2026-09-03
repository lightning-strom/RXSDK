using System.Collections.Generic;
using RuiXue.Share.Impl;

namespace RuiXue.Share
{
    public static class RXShare
    {
#if UNITY_ANDROID
        private static readonly IRXShare _sdk = new RuiXueShareAndroid();
#elif UNITY_IOS
        private static readonly IRXShare _sdk = new RXShareIOS();
 #elif UNITY_WEBGL
        private static readonly IRXShare _sdk = new RXShareWebGL();
#else
        private static readonly IRXShare _sdk = new RXShareNotSupport();
#endif

        /// <summary>
        /// 分享调度初始化
        /// </summary>
        /// <param name="funcs"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void ShareSchedulingInit(string[] funcs,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.ShareSchedulingInit(funcs, onResponse, onError);
        }

        /// <summary>
        /// 获取埋点调度
        /// </summary>
        /// <param name="func"></param>
        /// <returns></returns>
        public static string GetShareScheduling(string[] func)
        {
            return _sdk.GetShareScheduling(func);
        }

        /// <summary>
        /// 获取分享/广告埋点信息
        /// </summary>
        /// <param name="shareConfig"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        // public static void GetShareInfo(RXShareConfig shareConfig,
        //     RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        // {
        //     _sdk.GetShareInfo(shareConfig, onResponse, onError);
        // }

        /// <summary>
        /// 获取埋点数据
        /// </summary>
        /// <param name="shareConfig"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void GetShareData(RXShareConfig shareConfig,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.GetShareData(shareConfig, onResponse, onError);
        }

        /// <summary>
        /// 自定义数据分享
        /// </summary>
        /// <param name="shareConfig"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void ShareCustom(RXCustomShareConfig shareConfig,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.ShareCustom(shareConfig, onResponse, onError);
        }
        
        public static void Share(Dictionary<string, object> shareParams, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.ShareForWebglCustom(shareParams, onResponse, onError);
        }

        /// <summary>
        /// 发起分享
        /// </summary>
        /// <param name="func"></param>
        /// <param name="platform"></param>
        /// <param name="region"></param>
        /// <param name="report"></param>
        /// <param name="transmits"></param>
        /// <param name="ext"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void Share(RXShareConfig shareConfig, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.Share(shareConfig, onResponse, onError);
        }

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
        public static void ShareSchedulingReport(string func, string platform, string region, bool scheduling_event,
            string scheduling_type, string transmits, Dictionary<string, object> properties,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.ShareSchedulingReport(func, platform, region, scheduling_event, scheduling_type, transmits, properties, onResponse, onError);
        }

        /// <summary>
        /// 获取自动重定向短链接
        /// </summary>
        /// <param name="url"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void GetShortUrl(string url, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.GetShortUrl(url, onResponse, onError);
        }

        /// <summary>
        /// 获取自动重定向短链接
        /// </summary>
        /// <param name="url"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void GetShortUrl(Dictionary<string, object> dic,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.GetShortUrl(dic, onResponse, onError);
        }
    }
}
