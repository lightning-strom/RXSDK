using RuiXue.Adjust.Impl;

namespace RuiXue.Adjust
{
    public static class RXAdjust
    {
#if UNITY_ANDROID
        private static readonly IRXAdjust _sdk = new RXAdjustAndroid();
#elif UNITY_IOS
        private static readonly IRXAdjust _sdk = new RXAdjustIOS();
#else
        private static readonly IRXAdjust _sdk = new RXAdjustNotSupport();
#endif
        /// <summary>
        /// 初始化
        /// </summary>
        /// <param name="rxAdjustConfig"></param>
        public static void Init(RxAdjustConfig rxAdjustConfig)
        {
            _sdk.Init(rxAdjustConfig);
        }

        /// <summary>
        /// 页面可见
        /// </summary>
        public static void OnResume()
        {
            _sdk.OnResume();
        }

        /// <summary>
        /// 页面不可见
        /// </summary>
        public static void OnPause()
        {
            _sdk.OnPause();
        }

        /// <summary>
        /// 事件跟踪
        /// </summary>
        /// <param name="rxAdjustEvent"></param>
        public static void TrackEvent(RxAdjustEvent rxAdjustEvent)
        {
            _sdk.TrackEvent(rxAdjustEvent);
        }

        /// <summary>
        /// 获取深度链接
        /// </summary>
        /// <returns></returns>
        public static string GetData()
        {
            return _sdk.GetData();
        }

        /// <summary>
        /// 深度链接再归因
        /// </summary>
        /// <param name="data"></param>
        public static void AppWillOpenUrl(string data)
        {
            _sdk.AppWillOpenUrl(data);
        }

        /// <summary>
        /// 链接解析
        /// </summary>
        /// <param name="url"></param>
        /// <param name="arr"></param>
        public static void ResolveLink(string url, string[] arr)
        {
            _sdk.ResolveLink(url, arr);
        }

        /// <summary>
        /// 会话回传参数
        /// </summary>
        /// <param name="key"></param>
        /// <param name="val"></param>
        public static void AddSessionCallbackParameter(string key, string val)
        {
            _sdk.AddSessionCallbackParameter(key, val);
        }

        /// <summary>
        /// 移除特定的会话回传参数
        /// </summary>
        /// <param name="key"></param>
        public static void RemoveSessionCallbackParameter(string key)
        {
            _sdk.RemoveSessionCallbackParameter(key);
        }

        /// <summary>
        /// 清除所有的会话回传参数
        /// </summary>
        public static void ResetSessionCallbackParameters()
        {
            _sdk.ResetSessionCallbackParameters();
        }

        /// <summary>
        /// 新增会话合作伙伴参数
        /// </summary>
        /// <param name="key"></param>
        /// <param name="val"></param>
        public static void AddSessionPartnerParameter(string key, string val)
        {
            _sdk.AddSessionPartnerParameter(key, val);
        }

        /// <summary>
        /// 移除会话合作伙伴参数
        /// </summary>
        /// <param name="key"></param>
        public static void RemoveSessionPartnerParameter(string key)
        {
            _sdk.RemoveSessionPartnerParameter(key);
        }

        /// <summary>
        /// 清除会话合作伙伴参数
        /// </summary>
        public static void ResetSessionPartnerParameters()
        {
            _sdk.ResetSessionPartnerParameters();
        }

        /// <summary>
        /// 启动延迟前，向后端发送消息
        /// </summary>
        public static void SendFirstPackages()
        {
            _sdk.SendFirstPackages();
        }

        /// <summary>
        /// 直接获取用户归因
        /// </summary>
        /// <returns></returns>
        public static RxAdjustAttribution GetAttribution()
        {
            return _sdk.GetAttribution();
        }

    }
}