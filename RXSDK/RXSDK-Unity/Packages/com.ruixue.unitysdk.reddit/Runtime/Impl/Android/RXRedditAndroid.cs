#if UNITY_ANDROID
using System.Collections.Generic;
using RuiXue.Reddit.Impl;
using UnityEngine;

namespace RuiXue.Reddit.Impl
{
    internal class RXRedditAndroid : IRReddit
    {
        
        /// <summary>
        /// reddit初始化客户端id与重定向网址
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