using RuiXue.Zalo.Impl;
 
namespace RuiXue.Zalo
{
    public static class RXZalo
    {
#if UNITY_ANDROID
        private static readonly IRZalo _sdk = new RXZaloAndroid();
#elif UNITY_IOS
        private static readonly IRZalo _sdk = new RXZaloIOS();
#else
        private static readonly IRZalo _sdk = new RXZaloNotSupport();
#endif

        /// <summary>
        /// zalo初始化appID
        /// </summary>
        /// <param name="appID"></param>
        /// <returns></returns>
        public static void init(string appID)
        {
            _sdk.init(appID);
        }
        
    }
}