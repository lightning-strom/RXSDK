using System.Collections.Generic;

namespace RuiXue.WeiXin.Impl
{
    public class RXWeiXinNotSupport:IRXWeiXin
    {
        public bool IsWXAppInstalled()
        {
            LogUtil.WarningNotSupport("IsWXAppInstalled");
            return false;
        }

        public bool OpenWXApp()
        {
            LogUtil.WarningNotSupport("OpenWXApp");
            return false;
        }

        public bool OpenMiniProgram(Dictionary<string, object> hashMap, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("OpenMiniProgram");
            return false;
        }
    }
}