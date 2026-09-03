using System.Collections.Generic;

namespace RuiXue.Help.Impl
{
    public class RXHelpNotSupport:IRXHelp
    {
        public void HelperCenterUI(Dictionary<string, object> dic, RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate)
        {
            LogUtil.WarningNotSupport("HelperCenterUI");
        }

        public void ChatServiceUI(Dictionary<string, object> dic, RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate)
        {
            LogUtil.WarningNotSupport("ChatServiceUI");
        }

        public void CloseLoginUI()
        {
            LogUtil.WarningNotSupport("CloseLoginUI");
        }
    }
}