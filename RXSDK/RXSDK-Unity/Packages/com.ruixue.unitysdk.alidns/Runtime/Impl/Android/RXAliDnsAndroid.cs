#if UNITY_ANDROID
using System.Collections.Generic;
using RuiXue.AliDns.Impl;
using UnityEngine;

namespace RuiXue.AliDns.Impl
{
    internal class RXAliDnsAndroid : IRAliDns
    {
        /// <summary>
        /// 初始化阿里DNS
        /// </summary>
        /// <param name="accountID">accountID</param>
        /// <param name="secretKey">秘钥</param>
        /// <param name="isDebug">调试日志模式，true 开启，false 关闭，默认 false</param>
        public void AliDNSInitAppID(string accountID, string secretKey, bool isDebug)
        {
            AndroidJavaObject aliCloudDnsObj = new AndroidJavaClass("com.ruixue.aliyundns.AliCloudDnsManager");
            AndroidJavaObject instance = aliCloudDnsObj.CallStatic<AndroidJavaObject>("getInstance");
            instance.Call("initAppID", accountID, secretKey, isDebug);
        }
        
    }
}
#endif