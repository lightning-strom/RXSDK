using System.Collections.Generic;

namespace RuiXue.Push.Impl
{
    internal class RXPushNotSupport : IRXPush
    {
        public void Init()
        {
            LogUtil.WarningNotSupport("Init");
        }

        public void Init(string productId, string channelId, string cpid, List<string> urls)
        {
            LogUtil.WarningNotSupport("Init");
        }

        public void RegisterToken()
        {
            LogUtil.WarningNotSupport("RegisterToken");
        }

        public void UnRegisterToken()
        {
            LogUtil.WarningNotSupport("UnRegisterToken");
        }

        public string GetDeviceToken()
        {
            LogUtil.WarningNotSupport("GetDeviceToken");
            return "";
        }

        public bool IsSupport()
        {
            LogUtil.WarningNotSupport("IsSupport");
            return false;
        }

        public string GetBrandName()
        {
            LogUtil.WarningNotSupport("GetBrandName");
            return "";
        }

        public void BindAlias(string alias)
        {
            LogUtil.WarningNotSupport("BindAlias");
        }

        public void UnBindAlias(string alias)
        {
            LogUtil.WarningNotSupport("UnBindAlias");
        }
    } 
}

