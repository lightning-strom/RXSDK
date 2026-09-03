#if UNITY_ANDROID
using RuiXueLitJson;
using UnityEngine;

namespace RuiXue.Adjust.Impl
{
    public class OnFinishedSessionTrackingSucceededProxy : AndroidJavaProxy
    {
        private AndroidJavaObject jSONUtil = new AndroidJavaObject("com.google.gson.Gson");
        private OnFinishedSessionTrackingSucceededDelegate _onFinishedSessionTrackingSucceededDelegate;
        
        public OnFinishedSessionTrackingSucceededProxy(OnFinishedSessionTrackingSucceededDelegate onFinished)
            : base("com.ruixue.sdk.adjust.callback.OnRxSessionTrackingSucceededListener")
        {
            _onFinishedSessionTrackingSucceededDelegate = onFinished;
        }

        public void onFinishedSessionTrackingSucceeded(AndroidJavaObject androidJavaObject)
        {
            string jsonStr = jSONUtil.Call<string>("toJson", androidJavaObject);
            _onFinishedSessionTrackingSucceededDelegate
                ?.Invoke(JsonMapper.ToObject<RxAdjustSessionSuccess>(jsonStr));
        }

    }
}
#endif