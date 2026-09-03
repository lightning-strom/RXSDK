#if UNITY_ANDROID
using RuiXueLitJson;
using UnityEngine;

namespace RuiXue.Adjust.Impl
{
    public class OnFinishedSessionTrackingFailedJavaProxy : AndroidJavaProxy
    {
        private AndroidJavaObject jSONUtil = new AndroidJavaObject("com.google.gson.Gson");
        private OnFinishedSessionTrackingFailedDelegate _onFinishedSessionTrackingFailedDelegate;
        
        public OnFinishedSessionTrackingFailedJavaProxy(OnFinishedSessionTrackingFailedDelegate onFinished)
            : base("com.ruixue.sdk.adjust.callback.OnRxSessionTrackingFailedListener")
        {
            _onFinishedSessionTrackingFailedDelegate = onFinished;
        }

        public void onFinishedSessionTrackingFailed(AndroidJavaObject androidJavaObject)
        {
            string jsonStr = jSONUtil.Call<string>("toJson", androidJavaObject);
            _onFinishedSessionTrackingFailedDelegate
                ?.Invoke(JsonMapper.ToObject<RxAdjustSessionFailure>(jsonStr));
        }

    }
}
#endif