#if UNITY_ANDROID
using RuiXueLitJson;
using UnityEngine;

namespace RuiXue
{
    public class LoginOutJavaProxy : AndroidJavaProxy
    {
        private RequestResponseDelegate _response;
        private RequestErrorDelegate _onError;

        public LoginOutJavaProxy(RequestResponseDelegate onResponse, RequestErrorDelegate onError) 
            : base("com.ruixue.callback.OnLogoutCallback")
        {
            this._response = onResponse;
            this._onError = onError;
        }

        public void onSuccess(string data)
        {
            _response?.Invoke(data);
        }

        public void onFailed(int code, string msg)
        {
            FailObj obj = new FailObj(code, msg);
            _onError?.Invoke(JsonMapper.ToJson(obj));
        }
    }

    class FailObj
    {
        public int code;
        public string msg;
        public FailObj(int code, string msg)
        {
            this.code = code;
            this.msg = msg;
        }
    }
    
}
#endif
