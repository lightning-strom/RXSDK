#if UNITY_ANDROID
using System.Collections.Generic;
using RuiXue.Instagram.Impl;
using UnityEngine;

namespace RuiXue.Instagram.Impl
{
    internal class RXInstagramAndroid : IRInstagram
    {
        
        /// <summary>
        /// instagram初始化客户端id与重定向网址
        /// </summary>
        /// <param name="clientID"></param>
        /// <param name="redirectURI"></param>
        /// <returns></returns>
        public void init(string clientID, string redirectURI)
        {
            LogUtil.WarningNotSupport("init");
        }
        
        
    }
}
#endif