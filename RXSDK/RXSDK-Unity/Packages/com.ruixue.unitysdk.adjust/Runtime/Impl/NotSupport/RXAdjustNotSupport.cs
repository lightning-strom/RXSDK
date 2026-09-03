namespace RuiXue.Adjust.Impl
{
    public class RXAdjustNotSupport:IRXAdjust
    {
        public void Init(RxAdjustConfig rxAdjustConfig)
        {
            LogUtil.WarningNotSupport("Init");
        }

        public void OnResume()
        {
            LogUtil.WarningNotSupport("OnResume");
        }

        public void OnPause()
        {
            LogUtil.WarningNotSupport("OnPause");
        }

        public void TrackEvent(RxAdjustEvent rxAdjustEvent)
        {
            LogUtil.WarningNotSupport("TrackEvent");
        }

        public string GetData()
        {
            LogUtil.WarningNotSupport("GetData");
            return "";
        }

        public void AppWillOpenUrl(string data)
        {
            LogUtil.WarningNotSupport("AppWillOpenUrl");
        }

        public void ResolveLink(string url, string[] arr)
        {
            LogUtil.WarningNotSupport("ResolveLink");
        }

        public void AddSessionCallbackParameter(string key, string val)
        {
            LogUtil.WarningNotSupport("AddSessionCallbackParameter");
        }

        public void RemoveSessionCallbackParameter(string key)
        {
            LogUtil.WarningNotSupport("RemoveSessionCallbackParameter");
        }

        public void ResetSessionCallbackParameters()
        {
            LogUtil.WarningNotSupport("ResetSessionCallbackParameters");
        }

        public void AddSessionPartnerParameter(string key, string val)
        {
            LogUtil.WarningNotSupport("AddSessionPartnerParameter");
        }

        public void RemoveSessionPartnerParameter(string key)
        {
            LogUtil.WarningNotSupport("RemoveSessionPartnerParameter");
        }

        public void ResetSessionPartnerParameters()
        {
            LogUtil.WarningNotSupport("ResetSessionPartnerParameters");
        }

        public void SendFirstPackages()
        {
            LogUtil.WarningNotSupport("SendFirstPackages");
        }

        public RxAdjustAttribution GetAttribution()
        {
            LogUtil.WarningNotSupport("GetAttribution");
            return null;
        }
    }
}