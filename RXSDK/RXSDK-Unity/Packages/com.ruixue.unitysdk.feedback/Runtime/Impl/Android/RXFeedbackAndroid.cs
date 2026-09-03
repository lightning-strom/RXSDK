#if UNITY_ANDROID
using System.Collections.Generic;
using RuiXueLitJson;
using UnityEngine;

namespace RuiXue.Feedback.Impl
{
    internal class RXFeedbackAndroid : IRXFeedback
    {
        
        private static AndroidJavaClass _unityPlayer;
        private static AndroidJavaObject _rxSdkObj;
        private static AndroidJavaObject _contextObj;
        private static AndroidJavaObject _rxApiObj;
        private static AndroidJavaClass _jSONUtil;

        public RXFeedbackAndroid()
        {
            _unityPlayer = new AndroidJavaClass("com.unity3d.player.UnityPlayer");
            _rxSdkObj = new AndroidJavaClass("com.ruixue.RuiXueSdk");
            _contextObj = _unityPlayer.GetStatic<AndroidJavaObject>("currentActivity");
            _rxApiObj = _rxSdkObj.CallStatic<AndroidJavaObject>("getRXSdkApi");
            _jSONUtil = new AndroidJavaClass("com.ruixue.utils.JSONUtil");
        }

        public void GetFeedbackKindList(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _rxApiObj.Call("getFeedbackKindList", 
                new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void CreateFeedback(Dictionary<string, object> hashMap, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            AndroidJavaObject extMap = null;
            if (hashMap != null)
            {
                string jsonStr = JsonMapper.ToJson(hashMap);
                extMap = _jSONUtil.CallStatic<AndroidJavaObject>("toMap", jsonStr);
            }
            _rxApiObj.Call("createFeedback", extMap, new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void SatisfactionEvaluation(Dictionary<string, object> hashMap, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            AndroidJavaObject extMap = null;
            if (hashMap != null)
            {
                string jsonStr = JsonMapper.ToJson(hashMap);
                extMap = _jSONUtil.CallStatic<AndroidJavaObject>("toMap", jsonStr);
            }
            _rxApiObj.Call("satisfactionEvaluation", extMap, new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void ReportFeedbackLog(byte[] data, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _rxSdkObj.CallStatic("reportFeedbackLog", _contextObj, data, 
                new JsonCallbackJavaProxy(onResponse, onError));
        }
    }
}
#endif