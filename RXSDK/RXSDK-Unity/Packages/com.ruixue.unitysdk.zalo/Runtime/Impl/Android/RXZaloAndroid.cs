#if UNITY_ANDROID
using System.Collections.Generic;
using RuiXue.Zalo.Impl;
using UnityEngine;

namespace RuiXue.Zalo.Impl
{
    internal class RXZaloAndroid : IRZalo
    {
        
        /// <summary>
        /// zalo初始化客户端appID
        /// </summary>
        /// <param name="appID"></param>
        /// <returns></returns>
        public void init(string appID)
        {
            LogUtil.WarningNotSupport("init");
        }
        
        
    }
}
#endif