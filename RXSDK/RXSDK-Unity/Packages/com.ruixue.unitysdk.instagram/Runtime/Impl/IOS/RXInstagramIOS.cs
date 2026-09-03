using System.Runtime.InteropServices;
using RuiXue.Instagram.Impl;

#if UNITY_IOS
namespace RuiXue.Instagram.Impl
{
    internal class RXInstagramIOS: IRInstagram
    {
        /// <summary>
        /// instagram初始化客户端id与重定向网址
        /// </summary>
        /// <param name="clientID"></param>
        /// <param name="redirectURI"></param>
        /// <returns></returns>
        public void init(string clientID, string redirectURI)
        {
            iOS_Instagram_init(clientID,redirectURI);
        }
        
        
        // instagram初始化客户端id与重定向网址
        [DllImport("__Internal")]
        private static extern void iOS_Instagram_init(string clientID, string redirectURI);
    }
}
#endif