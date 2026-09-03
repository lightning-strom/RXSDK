using System.Collections.Generic;

namespace RuiXue.Pay.Impl
{
    internal class RXPayNotSupport : IRXPay
    {
        public void Pay(Dictionary<string, object> dic, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("Pay");
        }
    }
}

