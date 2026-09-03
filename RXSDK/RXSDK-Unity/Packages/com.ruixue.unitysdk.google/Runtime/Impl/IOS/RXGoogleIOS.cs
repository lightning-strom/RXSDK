using System.Collections.Generic;
using System.Runtime.InteropServices;
#if UNITY_IOS
namespace RuiXue.Google.Impl
{
    public class RXGoogleIOS:IRXGoogle
    {
        public void Regist(string clientID)
        {
            ios_GRegistWithClientID(clientID);
        }

        public void QueryProductDetailsAsync(List<string> skusList, RequestResponseDelegate onResponse, RequestErrorDelegate errorDelegate)
        {
            LogUtil.WarningNotSupport("QueryProductDetailsAsync");
        }
        
        // 注册谷歌
        // 配置universallink
        [DllImport("__Internal")]
        public static extern  void ios_GRegistWithClientID(string clientID);
    }
}
#endif