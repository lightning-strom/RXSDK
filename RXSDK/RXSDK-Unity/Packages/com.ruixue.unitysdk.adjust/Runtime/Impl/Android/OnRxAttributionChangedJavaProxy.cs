#if UNITY_ANDROID
using RuiXueLitJson;
using UnityEngine;

namespace RuiXue.Adjust.Impl
{
    public class OnRxAttributionChangedJavaProxy : AndroidJavaProxy
    {
        private AndroidJavaObject jSONUtil = new AndroidJavaObject("com.google.gson.Gson");
        private OnAttributionChangedDelegate _onAttributionChangedDelegate;

        public OnRxAttributionChangedJavaProxy(OnAttributionChangedDelegate onAttributionChangedDelegate) : base("com.ruixue.sdk.adjust.callback.OnRxAttributionChangedListener")
        {
            _onAttributionChangedDelegate = onAttributionChangedDelegate;
        }

        public void onAttributionChanged(AndroidJavaObject androidJavaObject)
        {
            string jsonStr = jSONUtil.Call<string>("toJson", androidJavaObject);
            _onAttributionChangedDelegate?.Invoke(JsonMapper.ToObject<RxAdjustAttribution>(jsonStr));
        }

    }
}
#endif