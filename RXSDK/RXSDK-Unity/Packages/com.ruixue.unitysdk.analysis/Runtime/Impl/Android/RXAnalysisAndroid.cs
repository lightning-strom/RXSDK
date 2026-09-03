#if UNITY_ANDROID
using System.Collections.Generic;
using RuiXueLitJson;
using UnityEngine;

namespace RuiXue.Analysis.Impl
{
    internal class RXAnalysisAndroid : IRXAnalysis
    {
        
        private static AndroidJavaClass _unityPlayer;
        private static AndroidJavaObject _rxSdkObj;
        private static AndroidJavaObject _contextObj;
        private static AndroidJavaObject _rxApiObj;
        private static AndroidJavaClass _jSONUtil;

        public RXAnalysisAndroid()
        {
            _unityPlayer = new AndroidJavaClass("com.unity3d.player.UnityPlayer");
            _rxSdkObj = new AndroidJavaClass("com.ruixue.RuiXueSdk");
            _contextObj = _unityPlayer.GetStatic<AndroidJavaObject>("currentActivity");
            _rxApiObj = _rxSdkObj.CallStatic<AndroidJavaObject>("getRXSdkApi");
            _jSONUtil = new AndroidJavaClass("com.ruixue.utils.JSONUtil");
        }


        Dictionary<string, int> _trackResult = new Dictionary<string, int>();
        public void DataTrack(string eventName, string distinctId, Dictionary<string, object> properties, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            AndroidJavaObject extMap = null;
            if (properties != null)
            {
                string jsonStr = JsonMapper.ToJson(properties);
                extMap = _jSONUtil.CallStatic<AndroidJavaObject>("toMap", jsonStr);
            }
            bool result = _rxApiObj.Call<bool>("dataTrack", eventName, distinctId, extMap);
            if (result)
            {
                _trackResult["code"] = 0;
                if (onResponse != null)
                {
                    onResponse(JsonMapper.ToJson(_trackResult));    
                }
            }
            else
            {
                _trackResult["code"] = -1;
                if (onError != null)
                {
                    onError(JsonMapper.ToJson(_trackResult));    
                }
            }
        }

        public void SetPublicProperties(Dictionary<string, object> publicProperties)
        {
            AndroidJavaObject extMap = null;
            if (publicProperties != null)
            {
                string jsonStr = JsonMapper.ToJson(publicProperties);
                extMap = _jSONUtil.CallStatic<AndroidJavaObject>("toMap", jsonStr);
            }
            _rxSdkObj.CallStatic("setPublicProperties", extMap);
        }

        public void UpdatePublicProperties(string key, object value)
        {
            _rxSdkObj.CallStatic("updatePublicProperties", key, value);
        }

        public void DeletePublicProperties(string key)
        {
            _rxSdkObj.CallStatic("deletePublicProperties", key);
        }
    }
}
#endif