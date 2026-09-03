using System.Collections.Generic;
using RuiXue.Oaidv2.Impl;
using RuiXue.Oaidv2.Impl.NotSupport;

namespace RuiXue.Oaidv2
{
    public class RXOaidv2
    {
#if UNITY_ANDROID
        private static readonly IRXOaidv2 _sdk = new RXOaidv2Android();
#else
        private static readonly IRXOaidv2 _sdk = new RXOaidv2NotSupport();
#endif

        
#if UNITY_ANDROID
        /// <summary>
        /// 带回调初始化
        /// </summary>
        /// <param name="certString"></param>
        /// <param name="onResponse"></param>
        public static void InitOaidSdk(string certString, RequestResponseDelegate onResponse)
        {
            _sdk.InitOaidSdk(certString, new AppOaidCallbackJavaProxy(onResponse));
        }
#endif
        /// <summary>
        /// 初始化
        /// </summary>
        /// <param name="certString"></param>
        public static void initOaidSdk(string certString)
        {
            _sdk.InitOaidSdk(certString);
        }

        /// <summary>
        /// 当前设备是否支持
        /// </summary>
        /// <returns></returns>
        public static bool IsSupport()
        {
            return _sdk.IsSupport();
        }

        /// <summary>
        /// 设备oaid
        /// </summary>
        /// <returns></returns>
        public static string GetOAID()
        {
            return _sdk.GetOAID();
        }
    }
}