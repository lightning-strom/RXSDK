#if UNITY_ANDROID
using System.Collections.Generic;
using UnityEngine;

namespace RuiXue.Push.Impl
{
    internal class RXPushAndroid : IRXPush
    {
        private static AndroidJavaClass _pushManager;

        public RXPushAndroid()
        {
            _pushManager = new AndroidJavaClass("com.ruixue.push.RxPushManager");
        }

        public void Init()
        {
           LogUtil.WarningNotSupport("Init");
        }

        public void Init(string productId, string channelId, string cpid, List<string> urls)
        {
            LogUtil.WarningNotSupport("Init");
        }

        public void RegisterToken()
        {
            _pushManager.CallStatic("registerToken");
        }

        public void UnRegisterToken()
        {
            _pushManager.CallStatic("unRegisterToken");
        }

        public string GetDeviceToken()
        {
            return _pushManager.CallStatic<string>("getDeviceToken");
        }

        public bool IsSupport()
        {
            return _pushManager.CallStatic<bool>("isSupport");
        }

        public string GetBrandName()
        {
            return _pushManager.CallStatic<string>("getBrandName");
        }

        public void BindAlias(string alias)
        {
            _pushManager.CallStatic("bindAlias", alias);
        }

        public void UnBindAlias(string alias)
        {
            _pushManager.CallStatic("unBindAlias", alias);
        }
    }
}
#endif
