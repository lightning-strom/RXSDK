using System.Collections.Generic;

namespace RuiXue.Pay.Impl
{
    internal interface IRXPay
    {
        /// <summary>
        /// 支付
        /// </summary>
        /// <param name="dic"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void Pay(Dictionary<string, object> dic, RequestResponseDelegate onResponse, RequestErrorDelegate onError);
    }
}
