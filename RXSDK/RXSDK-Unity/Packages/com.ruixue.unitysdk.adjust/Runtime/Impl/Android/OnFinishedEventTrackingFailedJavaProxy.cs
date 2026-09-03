#if UNITY_ANDROID
using RuiXueLitJson;
using UnityEngine;

namespace RuiXue.Adjust.Impl
{
    public class OnFinishedEventTrackingFailedJavaProxy : AndroidJavaProxy
    {
        private AndroidJavaObject jSONUtil = new AndroidJavaObject("com.google.gson.Gson");
        private OnFinishedEventTrackingFailedDelegate _onFinishedEventTrackingFailedDelegate;
        
        public OnFinishedEventTrackingFailedJavaProxy(OnFinishedEventTrackingFailedDelegate onFinished)
            : base("com.ruixue.sdk.adjust.callback.OnRxEventTrackingFailedListener")
        {
            _onFinishedEventTrackingFailedDelegate = onFinished;
        }

        void onFinishedEventTrackingFailed(AndroidJavaObject androidJavaObject)
        {
            string jsonStr = jSONUtil.Call<string>("toJson", androidJavaObject);
            _onFinishedEventTrackingFailedDelegate
                ?.Invoke(JsonMapper.ToObject<RxAdjustEventFailure>(jsonStr));
        }

    }
}
#endif