#if UNITY_ANDROID

using UnityEngine;
namespace RuiXue
{
    public class JsonCallbackJavaProxy : AndroidJavaProxy
    {
        private RequestResponseDelegate _onResponse;
        private RequestErrorDelegate _onError;

        public JsonCallbackJavaProxy(RequestResponseDelegate onResponse, RequestErrorDelegate onError) 
            : base("com.ruixue.unity.UnityRXRequestCallback")
        {
            JavaCallBackToMainThread.CheckInit();
            
            _onResponse = onResponse;
            _onError = onError;
        }
        
        public void onResponse(string data)
        {
            _onResponse?.Invoke(data);
        }

        public void onError(string e)
        {
            _onError?.Invoke(e);
        }
    }
}

#endif