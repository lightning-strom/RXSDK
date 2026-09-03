using System.Collections.Generic;

namespace RuiXue.Share.Impl
{
    internal class RXShareNotSupport : IRXShare
    {
        public void ShareSchedulingInit(string[] funcs, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("ShareSchedulingInit");
        }

        public string GetShareScheduling(string[] func)
        {
            LogUtil.WarningNotSupport("GetShareScheduling");
            return "";
        }

        public void GetShareInfo(RXShareConfig shareConfig, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("GetShareInfo");
        }

        public void GetShareData(RXShareConfig shareConfig, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("GetShareData");
        }

        public void ShareCustom(RXCustomShareConfig shareConfig, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("ShareCustom");
        }

        public void ShareForWebglCustom(Dictionary<string, object> shareParams, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("ShareForWebglCustom");
        }

        public void Share(RXShareConfig shareConfig, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("Share");
        }

        public void ShareSchedulingReport(string func, string platform, string region, bool scheduling_event, string scheduling_type,
            string transmits, Dictionary<string, object> properties, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("ShareSchedulingReport");
        }

        public void GetShortUrl(string url, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("GetShortUrl");
        }

        public void GetShortUrl(Dictionary<string, object> dic, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("GetShortUrl");
        }
    }
}

