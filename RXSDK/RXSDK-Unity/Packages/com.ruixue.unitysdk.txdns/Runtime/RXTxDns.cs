using RuiXue.TxDns.Impl;
 
namespace RuiXue.TxDns
{
    public static class RXTxDns
    {
#if UNITY_ANDROID
        private static readonly IRTxDns _sdk = new RXTxDnsAndroid();
#elif UNITY_IOS
        private static readonly IRTxDns _sdk = new RXTxDnsIOS();
#else
        private static IRTxDns _sdk = new RXTxDnsNotSupport();
#endif
        
        /// <summary>
        /// 初始化腾讯DNS
        /// </summary>
        /// <param name="bundleID">bundleID，iOS传bundle id, Android传空字符串</param>
        /// <param name="dnsID">dnsID</param>
        /// <param name="dnsKey">dnsKey</param>
        /// <param name="isDebug">isDebug 调试日志模式，true 开启，false 关闭，默认</param>
        public static void TencentDNSInitAppID(string bundleID, string dnsID, string dnsKey, bool isDebug)
        {
            _sdk?.TencentDNSInitAppID(bundleID:bundleID, dnsID:dnsID, dnsKey:dnsKey, isDebug:isDebug);
        }
        
    }
}