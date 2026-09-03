#if UNITY_ANDROID
using RuiXueLitJson;
using UnityEngine;

namespace RuiXue
{
    public class ConvertRXStringCallbackProxy : AndroidJavaProxy
    {
        private RequestResponseDelegate _onResponse;
        private RequestErrorDelegate _onError;
        
        public ConvertRXStringCallbackProxy(RequestResponseDelegate onResponse, RequestErrorDelegate onError) 
            : base("com.ruixue.unity.UnityConvertRXStringCallback")
        {
            _onResponse = onResponse;
            _onError = onError;
        }

        public void onSuccess(string data)
        {
            if (_onResponse != null)
            {
                _onResponse.Invoke(data);
            }
        }

        public void onFailed(int code, string msg, string traceId)
        {
            if (_onError != null)
            {
                FailEntity failEntity = new FailEntity();
                failEntity.code = code;
                failEntity.msg = msg;
                failEntity.traceId = traceId;
                string failJson = JsonMapper.ToJson(failEntity);
                _onError.Invoke(failJson);
            }
        }

        class FailEntity
        {
            public int code;
            public string msg;
            public string traceId;
        }

    }

}
#endif