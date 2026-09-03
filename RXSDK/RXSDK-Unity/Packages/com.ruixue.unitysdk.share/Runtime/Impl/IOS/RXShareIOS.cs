using System.Collections.Generic;
using System.Runtime.InteropServices;

#if UNITY_IOS
namespace RuiXue.Share.Impl
{
    internal class RXShareIOS : IRXShare
    {
        public void ShareSchedulingInit(string[] funcs, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_shareSchedulingInitWithFuncs", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });

            var json = RXJsonUtil.ToJson(funcs);
            ios_shareSchedulingInitWithFuncs(json, RuiXueSdkDriver.IOSCallBackOnResponse,
                RuiXueSdkDriver.IOSCallBackOnError);
        }

        public string GetShareScheduling(string[] func)
        {
            var json = RXJsonUtil.ToJson(func);

            // TODO: 需要检查回调是否可以同步返回结果
            var ret = string.Empty;
            RuiXueSdkDriver.RegisterIOSCallBack("ios_shareSchedulingInitWithFuncs", new IOSCallBackWrapper
            {
                onResponse = rsp => { ret = rsp; },
                onError = err => { ret = ""; }
            });

            ios_getShareSchedulingWithFuncs(json, RuiXueSdkDriver.IOSCallBackOnResponse,
                RuiXueSdkDriver.IOSCallBackOnError);
            return ret;
        }

        public void GetShareInfo(RXShareConfig shareConfig, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_getShareInfoWithConfig", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            
            string config = RXJsonUtil.ToJson(shareConfig);
            ios_getShareInfoWithConfig(config, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void GetShareData(RXShareConfig shareConfig, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_getShareInfoWithConfig", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            
            string config = RXJsonUtil.ToJson(shareConfig);
            ios_getShareInfoWithConfig(config, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void ShareCustom(RXCustomShareConfig shareConfig, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_shareCustom", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            
            string config = RXJsonUtil.ToJson(shareConfig);
            
            ios_shareCustom(config, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void ShareForWebglCustom(Dictionary<string, object> shareParams, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("ShareForWebglCustom");
        }


        public void Share(RXShareConfig shareConfig, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_share", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            
            string config = RXJsonUtil.ToJson(shareConfig);
            
            ios_share(config, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void ShareSchedulingReport(string func, string platform, string region, bool scheduling_event,
            string scheduling_type,
            string transmits, Dictionary<string, object> properties, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_shareSchedulingReportWithFunc", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });

            ios_shareSchedulingReportWithFunc(func, platform, region, transmits, scheduling_event, scheduling_type,
                RXJsonUtil.ToJson(properties), RuiXueSdkDriver.IOSCallBackOnResponse,
                RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void GetShortUrl(string url, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_getShortUrl", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });

            ios_getShortUrl(url, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void GetShortUrl(Dictionary<string, object> dic,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("GetShortUrl");
        }

        // 分享调度初始化
        [DllImport("__Internal")]
        public static extern void ios_shareSchedulingInitWithFuncs(string funcArryJson,
            IOSCallBackCommonDelegate requestResponse,
            IOSCallBackCommonDelegate requestError
        );


        // 获取埋点调度
        [DllImport("__Internal")]
        public static extern void ios_getShareSchedulingWithFuncs(string funcArryJson,
            IOSCallBackCommonDelegate requestResponse,
            IOSCallBackCommonDelegate requestError
        );

        // 分享
        [DllImport("__Internal")]
        public static extern void ios_share(string config,
            IOSCallBackCommonDelegate requestResponse,
            IOSCallBackCommonDelegate requestError);
        
        // 自定义分享
        [DllImport("__Internal")]
        public static extern void ios_shareCustom(string config,
            IOSCallBackCommonDelegate requestResponse,
            IOSCallBackCommonDelegate requestError);

        // 获取分享信息
        [DllImport("__Internal")]
        public static extern void ios_getShareInfoWithConfig(string config,
            IOSCallBackCommonDelegate requestResponse,
            IOSCallBackCommonDelegate requestError);

        // 分享/广告结果上报
        [DllImport("__Internal")]
        public static extern void ios_shareSchedulingReportWithFunc(string func,
            string platform,
            string region,
            string transmits,
            bool schedulingEvent,
            string schedulingType,
            string propertiesDicJson,
            IOSCallBackCommonDelegate requestResponse,
            IOSCallBackCommonDelegate requestError
        );

        [DllImport("__Internal")]
        public static extern void ios_getShortUrl(string url,
            IOSCallBackCommonDelegate requestResponse,
            IOSCallBackCommonDelegate requestError);
    }
}

#endif