#if UNITY_ANDROID
using System.Collections.Generic;
using RuiXueLitJson;
using UnityEngine;

namespace RuiXue.Legal.Impl
{
    internal class RXLegalAndroid : IRXLegal
    {
        
        private static AndroidJavaObject _rxSdkObj;
        private static AndroidJavaObject _rxApiObj;
        private static AndroidJavaClass _jSONUtil;

        public RXLegalAndroid()
        {
            _rxSdkObj = new AndroidJavaClass("com.ruixue.RuiXueSdk");
            _rxApiObj = _rxSdkObj.CallStatic<AndroidJavaObject>("getRXSdkApi");
            _jSONUtil = new AndroidJavaClass("com.ruixue.utils.JSONUtil");
        }

        public void Legal(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            AndroidJavaObject extMap = null;
            Dictionary<string, object> map = new Dictionary<string, object>();
            if (map != null)
            {
                string jsonStr = JsonMapper.ToJson(map);
                extMap = _jSONUtil.CallStatic<AndroidJavaObject>("toMap", jsonStr);
            }
            _rxApiObj.Call("legal", extMap, new JsonCallbackJavaProxy(onResponse, onError));
        }
    }
}
#endif