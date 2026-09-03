using System.Runtime.InteropServices;
using RuiXue.Zalo.Impl;

#if UNITY_IOS
namespace RuiXue.Zalo.Impl
{
    internal class RXZaloIOS: IRZalo
    {
        /// <summary>
        /// zalo初始化appID
        /// </summary>
        /// <param name="appID"></param>
        /// <returns></returns>
        public void init(string appID)
        {
            iOS_zalo_init(appID);
        }
        
        // zalo初始化客户端id与重定向网址
        [DllImport("__Internal")]
        private static extern void iOS_zalo_init(string appID);
    }
}
#endif