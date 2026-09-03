using System.Collections.Generic;
using RuiXue.WeiXin.Impl;

namespace RuiXue.WeiXin
{
    public class RXWeiXin
    {
#if UNITY_ANDROID
        private static readonly IRXWeiXin _sdk = new RXWeiXinAndroid();
#elif UNITY_IOS
        private static readonly IRXWeiXin _sdk = new RXWeiXinIOS();
#else
        private static readonly IRXWeiXin _sdk = new RXWeiXinNotSupport();
#endif
        
#if UNITY_IOS
        /// <summary>
        /// IOS专用接口，配置UniversalLink
        /// </summary>
        /// <param name="universallink"></param>
        public static void ConfigUniversalLink(string universallink)
        {
            if (_sdk==null || _sdk is not RXWeiXinIOS iosSDK)
            {
                return;
            }
            
            iosSDK.ConfigUniversalLink(universallink);
        }
#endif
        
        /// <summary>
        /// 是否安装有微信
        /// </summary>
        /// <returns></returns>
        public static bool IsWXAppInstalled()
        {
            return _sdk.IsWXAppInstalled();
        }

        /// <summary>
        /// 打开微信
        /// </summary>
        /// <returns></returns>
        public static bool OpenWXApp()
        {
            return _sdk.OpenWXApp();
        }

        /// <summary>
        /// 打开小程序
        /// </summary>
        /// <param name="hashMap"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        /// <returns></returns>
        public static bool OpenMiniProgram(Dictionary<string, object> hashMap,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            return _sdk.OpenMiniProgram(hashMap, onResponse, onError);
        }
    }
}