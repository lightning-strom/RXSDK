
using System.Collections.Generic;
using RuiXue.Push.Impl;

namespace RuiXue.Push
{
    public static class RXPush
    {
#if UNITY_ANDROID
        private static readonly IRXPush _sdk = new RXPushAndroid();
#elif UNITY_IOS
        private static readonly IRXPush _sdk = new RXPushIOS();
#else
        private static readonly IRXPush _sdk = new RXPushNotSupport();
#endif
        /// <summary>
        /// 初始化
        /// </summary>
        public static void Init(string productId, string channelId, string cpid, List<string> urls)
        {
            _sdk.Init(productId, channelId, cpid, urls);
        }
        
        /// <summary>
        /// 初始化
        /// </summary>
        public static void Init()
        {
            _sdk.Init();
        }

        /// <summary>
        /// 注册瑞雪推送服务（建议瑞雪登录成功后调用一次，不切换账号不用重复调用）
        /// 由于registerToken和瑞雪账号关联绑定，所以请不要在登录前调用
        /// </summary>
        public static void RegisterToken()
        {
            _sdk.RegisterToken();
        }

        /// <summary>
        /// 反注册瑞雪推送服务（建议在登出账号时调用）
        /// </summary>
        public static void UnRegisterToken()
        {
            _sdk.UnRegisterToken();
        }

        /// <summary>
        /// 服务器生成的推送 token/regId
        /// </summary>
        public static string GetDeviceToken()
        {
            return _sdk.GetDeviceToken();
        }

        /// <summary>
        /// 当前设备是否支持推送 init（）后调用
        /// </summary>
        public static bool IsSupport()
        {
            return _sdk.IsSupport();
        }

        /// <summary>
        /// 当前推送的厂商平台 BRAND
        /// </summary>
        public static string GetBrandName()
        {
            return _sdk.GetBrandName();
        }

        /// <summary>
        /// 开发者可以为指定用户设置别名，然后给这个别名推送消息，效果等同于给RegId推送消息
        /// </summary>
        /// <param name="alias"></param>
        public static void BindAlias(string alias)
        {
            _sdk.BindAlias(alias);
        }

        /// <summary>
        /// 开发者可以取消指定用户的某个别名，服务器就不会给这个别名推送消息了
        /// </summary>
        /// <param name="alias"></param>
        public static void UnBindAlias(string alias)
        {
            _sdk.UnBindAlias(alias);
        }


    }
}
