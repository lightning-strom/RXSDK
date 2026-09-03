using RuiXue.Instagram.Impl;
 
namespace RuiXue.Instagram
{
    public static class RXInstagram
    {
#if UNITY_ANDROID
        private static readonly IRInstagram _sdk = new RXInstagramAndroid();
#elif UNITY_IOS
        private static readonly IRInstagram _sdk = new RXInstagramIOS();
#else
        private static readonly IRInstagram _sdk = new RXInstagramNotSupport();
#endif

        /// <summary>
        /// instagram初始化客户端id与重定向网址
        /// </summary>
        /// <param name="clientID"></param>
        /// <param name="redirectURI"></param>
        /// <returns></returns>
        public static void init(string clientID, string redirectURI)
        {
            _sdk.init(clientID,redirectURI);
        }
        
    }
}