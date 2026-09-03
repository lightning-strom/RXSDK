using System.Collections.Generic;

namespace RuiXue.Google.Impl
{
    public class RXGoogleNotSupport:IRXGoogle
    {
        public void Regist(string clientID)
        {
            LogUtil.WarningNotSupport("Regist");
        }

        public void QueryProductDetailsAsync(List<string> skusList, RequestResponseDelegate onResponse, 
            RequestErrorDelegate errorDelegate)
        {
            LogUtil.WarningNotSupport("QueryProductDetailsAsync");
        }
    }
}