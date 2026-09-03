using RuiXue.Reddit.Impl;
 
namespace RuiXue.Reddit
{
    public static class RXReddit
    {
#if UNITY_ANDROID
        private static readonly IRReddit _sdk = new RXRedditAndroid();
#elif UNITY_IOS
        private static readonly IRReddit _sdk = new RXRedditIOS ();
#else
        private static readonly IRReddit _sdk = new RXRedditNotSupport();
#endif

        /// <summary>
        /// reddit初始化客户端id与重定向网址
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