using System;
using System.Collections.Generic;

namespace RuiXue.Oaidv2.Impl
{
    internal interface IRXOaidv2
    {
        #if UNITY_ANDROID
        /// <summary>
        /// 带回调初始化
        /// </summary>
        /// <param name="certString"></param>
        /// <param name="onResponse"></param>
        public void InitOaidSdk(string certString, AppOaidCallbackJavaProxy onResponse);
        #endif
        /// <summary>
        /// 初始化
        /// </summary>
        /// <param name="certString"></param>
        public void InitOaidSdk(string certString);

        /// <summary>
        /// 当前设备是否支持
        /// </summary>
        /// <returns></returns>
        public bool IsSupport();

        /// <summary>
        /// 设备oaid
        /// </summary>
        /// <returns></returns>
        public string GetOAID();
    }
}
