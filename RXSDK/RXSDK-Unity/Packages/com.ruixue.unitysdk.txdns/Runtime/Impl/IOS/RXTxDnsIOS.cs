using System.Runtime.InteropServices;

#if UNITY_IOS
namespace RuiXue.TxDns.Impl
{
    internal class RXTxDnsIOS: IRTxDns
    {
        /// <summary>
        /// 初始化腾讯DNS
        /// </summary>
        /// <param name="bundleID">bundleID，iOS传bundle id, Android传空字符串</param>
        /// <param name="dnsID">dnsID</param>
        /// <param name="dnsKey">dnsKey</param>
        /// <param name="isDebug">isDebug 调试日志模式，true 开启，false 关闭，默认</param>
        public void TencentDNSInitAppID(string bundleID, string dnsID, string dnsKey, bool isDebug)
        {
            ios_TxDns_initWithAppID(bundleID, dnsID, dnsKey:dnsKey, isDebug);
        }
        
        
        [DllImport("__Internal")]
        private static extern void ios_TxDns_initWithAppID(string appID, string dnsID, string dnsKey, bool debug);
        
    }
}
#endif