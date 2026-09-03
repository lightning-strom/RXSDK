using System.Runtime.InteropServices;
using RuiXue.Reddit.Impl;

#if UNITY_IOS
namespace RuiXue.Reddit.Impl
{
    internal class RXRedditIOS: IRReddit
    {
        /// <summary>
        /// reddit初始化客户端id与重定向网址
        /// </summary>
        /// <param name="clientID"></param>
        /// <param name="redirectURI"></param>
        /// <returns></returns>
        public void init(string clientID, string redirectURI)
        {
            iOS_reddit_init(clientID,redirectURI);
        }
        
        
        // reddit初始化客户端id与重定向网址
        [DllImport("__Internal")]
        private static extern void iOS_reddit_init(string clientID, string redirectURI);
    }
}
#endif