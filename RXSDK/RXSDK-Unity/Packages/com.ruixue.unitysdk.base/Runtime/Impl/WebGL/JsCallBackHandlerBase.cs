#if UNITY_WEBGL
using System.Collections.Generic;
using System.Text.RegularExpressions;
using RuiXueLitJson;
using UnityEngine;

namespace RuiXue.Impl
{
    public abstract class JsCallBackHandlerBase
    {
        protected struct JsCallBack
        {
            public RequestResponseDelegate onSuccess;
            public RequestErrorDelegate onError;
        }

        protected Dictionary<string, JsCallBack> CallBacks => _callBacks;
        private Dictionary<string, JsCallBack> _callBacks = new();

        public virtual void HandleJsCallBack(string api, string jsonData)
        {
            JsonData jo = JsonMapper.ToObject(jsonData);
            int code = (int)jo["code"];
            if (code == 0)
                CallBacks[api].onSuccess?.Invoke(jsonData);
            else
                CallBacks[api].onError?.Invoke(jsonData);
        }
        
        public void RegisterJsCallBack(string api, RequestResponseDelegate onSuccess, RequestErrorDelegate onError)
        {
            _callBacks[api] = new JsCallBack()
            {
                onSuccess = onSuccess,
                onError = onError,
            };
        
            RuiXueSdkDriver.RegisterJsCallBack(api, HandleJsCallBack);
        }
    }
    
        
    public class JsCallBackHelper : JsCallBackHandlerBase
    {
    }

}
#endif