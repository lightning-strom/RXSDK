using System.Collections.Generic;
using System.Runtime.InteropServices;
using RuiXue.Impl;
using RuiXueLitJson;

#if UNITY_WEBGL
namespace RuiXue.Share.Impl
{
    public class RXShareWebGL:JsCallBackHandlerBase,IRXShare
    {
        public void ShareSchedulingInit(string[] funcs, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            var data = new JsonData
            {
                ["funcs"] = JsonMapper.ToObject(JsonMapper.ToJson(funcs)),
            };
            
            RegisterJsCallBack("rx_shareSchedulingInit", onResponse, onError);
            rx_shareSchedulingInit(data.ToJson());
        }

        public string GetShareScheduling(string[] func)
        {
            var data = new JsonData();
            if (func != null && func.Length > 0)
            {
                data["funcs"] = JsonMapper.ToObject(JsonMapper.ToJson(func));
            }
            
            return rx_getShareScheduling(data.ToJson());
        }

        public void GetShareInfo(RXShareConfig shareConfig, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("GetShareInfo");
        }

        public void GetShareData(RXShareConfig shareConfig, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RegisterJsCallBack("rx_getShareData", onResponse, onError);
            rx_getShareData(JsonMapper.ToJson(shareConfig));
        }

        public void ShareCustom(RXCustomShareConfig shareConfig, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RegisterJsCallBack("rx_share", onResponse, onError);
            rx_share(JsonMapper.ToJson(shareConfig));
        }

        public void ShareForWebglCustom(Dictionary<string, object> shareParams, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RegisterJsCallBack("rx_share", onResponse, onError);
            rx_share(JsonMapper.ToJson(shareParams));
        }

        public void Share(RXShareConfig shareConfig, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RegisterJsCallBack("rx_share", onResponse, onError);
            rx_share(JsonMapper.ToJson(shareConfig));
        }

        public void Share(string func, string platform, string region, bool report, string transmits, Dictionary<string, object> ext,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            var data = new JsonData
            {
                ["func"] = func,
            };

            if (!string.IsNullOrEmpty(region))
            {
                data["region"] = region;
            }

            if (!string.IsNullOrEmpty(transmits))
            {
                data["transmits"] = transmits;
            }

            RegisterJsCallBack("rx_share", onResponse, onError);
            rx_share(data.ToJson());
        }

        public void ShareSchedulingReport(string func, string platform, string region, bool scheduling_event, string scheduling_type,
            string transmits, Dictionary<string, object> properties, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            var data = new JsonData
            {
                ["func"] = func,
                ["transmits"] = transmits,
                ["scheduling_event"] = scheduling_event,
                ["scheduling_type"] = scheduling_type,
                ["platform"] = "mini",
            };

            if (!string.IsNullOrEmpty(region))
            {
                data["region"] = region;
            }

            if (properties != null && properties.Count > 0)
            {
                data["properties"] = JsonMapper.ToObject(JsonMapper.ToJson(properties));
            }
            
            RegisterJsCallBack("rx_shareSchedulingReport", onResponse, onError);
            rx_shareSchedulingReport(data.ToJson());
        }

        public void GetShortUrl(string url, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("GetShortUrl");
        }

        public void GetShortUrl(Dictionary<string, object> dic, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("GetShortUrl");
        }
        
        [DllImport("__Internal")]
        private static extern void rx_getShareData(string json);
        
        [DllImport("__Internal")]
        private static extern void rx_share(string json);
        
        [DllImport("__Internal")]
        private static extern void rx_shareSchedulingInit(string json);
        
        [DllImport("__Internal")]
        private static extern string rx_getShareScheduling(string json);
        
        [DllImport("__Internal")]
        private static extern void rx_shareSchedulingReport(string json);
    }
}
#endif