using System.Runtime.InteropServices;

#if UNITY_IOS
namespace RuiXue.AliDns.Impl
{
    internal class RXAliDnsIOS: IRAliDns
    {
        /// <summary>
        /// 初始化阿里DNS
        /// </summary>
        /// <param name="accountID">accountID</param>
        /// <param name="secretKey">秘钥</param>
        /// <param name="isDebug">调试日志模式，true 开启，false 关闭，默认 false</param>
        public void AliDNSInitAppID(string accountID, string secretKey, bool isDebug)
        {
            ios_AliDns_initWithAppID(accountID:accountID, secretKey:secretKey, isDebug);
        }
        
        
        [DllImport("__Internal")]
        private static extern void ios_AliDns_initWithAppID(string accountID, string secretKey, bool debug);
        
    }
}
#endif