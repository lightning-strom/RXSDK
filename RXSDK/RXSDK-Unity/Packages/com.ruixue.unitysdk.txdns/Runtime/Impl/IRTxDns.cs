namespace RuiXue.TxDns.Impl
{
    internal interface IRTxDns
    {
        /// <summary>
        /// 初始化腾讯DNS
        /// </summary>
        /// <param name="bundleID">bundleID，iOS传bundle id, Android传空字符串</param>
        /// <param name="dnsID">dnsID</param>
        /// <param name="dnsKey">dnsKey</param>
        /// <param name="isDebug">isDebug 调试日志模式，true 开启，false 关闭，默认</param>
        public void TencentDNSInitAppID(string bundleID, string dnsID, string dnsKey, bool isDebug);

    }
}
