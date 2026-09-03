using RuiXue.AliDns.Impl;
 
namespace RuiXue.AliDns
{
    public static class RXAliDns
    {
#if UNITY_ANDROID
        private static readonly IRAliDns _sdk = new RXAliDnsAndroid();
#elif UNITY_IOS
        private static readonly IRAliDns _sdk = new RXAliDnsIOS();
#else
        private static IRAliDns _sdk = new RXAliDnsNotSupport();
#endif

        /// <summary>
        /// 初始化阿里DNS
        /// </summary>
        /// <param name="accountID">accountID</param>
        /// <param name="secretKey">秘钥</param>
        /// <param name="isDebug">调试日志模式，true 开启，false 关闭，默认 false</param>
        public static void AliDNSInitAppID(string accountID, string secretKey, bool isDebug)
        {
            _sdk.AliDNSInitAppID(accountID:accountID, secretKey:secretKey, isDebug:isDebug);
        }
        
    }
}