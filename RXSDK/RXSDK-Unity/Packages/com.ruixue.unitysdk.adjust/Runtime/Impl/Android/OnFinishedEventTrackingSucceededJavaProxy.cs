#if UNITY_ANDROID
using RuiXueLitJson;
using UnityEngine;

namespace RuiXue.Adjust.Impl
{
    public class OnFinishedEventTrackingSucceededJavaProxy : AndroidJavaProxy
    {
        private AndroidJavaObject jSONUtil = new AndroidJavaObject("com.google.gson.Gson");
        private OnFinishedEventTrackingSucceededDelegate _onFinishedEventTrackingSucceededDelegate;
        
        public OnFinishedEventTrackingSucceededJavaProxy(OnFinishedEventTrackingSucceededDelegate onFinished)
            : base("com.ruixue.sdk.adjust.callback.OnRxEventTrackingSucceededListener")
        {
            _onFinishedEventTrackingSucceededDelegate = onFinished;
        }

        void onFinishedEventTrackingSucceeded(AndroidJavaObject androidJavaObject)
        {
            string jsonStr = jSONUtil.Call<string>("toJson", androidJavaObject);
            _onFinishedEventTrackingSucceededDelegate
                ?.Invoke(JsonMapper.ToObject<RxAdjustEventSuccess>(jsonStr));
        }

    }
}
#endif