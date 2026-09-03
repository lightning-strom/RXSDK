#if UNITY_ANDROID
using UnityEngine;

namespace RuiXue.Adjust.Impl
{
    public class LaunchReceivedDeeplinkJavaProxy : AndroidJavaProxy
    {

        private LaunchReceivedDeeplinkDelegate _launchReceivedDeeplinkDelegate;
        
        public LaunchReceivedDeeplinkJavaProxy(LaunchReceivedDeeplinkDelegate launchReceivedDeeplinkDelegate)
            : base("com.ruixue.sdk.adjust.callback.OnRxDeeplinkResponseListener")
        {
            _launchReceivedDeeplinkDelegate = launchReceivedDeeplinkDelegate;
        }

        bool launchReceivedDeeplink(AndroidJavaObject deeplink)
        {
            if (_launchReceivedDeeplinkDelegate == null)
            {
                return false;
            }
            return _launchReceivedDeeplinkDelegate.Invoke(deeplink.Call<string>("toString"));

        }

    }
}
#endif