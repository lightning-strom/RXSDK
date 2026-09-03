#if UNITY_ANDROID
using System.Dynamic;
using UnityEngine;

namespace RuiXue.Performance.Impl
{
    public class PerformManceCallbackJavaProxy : AndroidJavaProxy
    {
        
        public OnPerformanceCallback _performCallback;
        
        public PerformManceCallbackJavaProxy(OnPerformanceCallback callback) : base("com.ruixue.performancereport.PerformUnityCallBack")
        {
            this._performCallback = callback;
        }

        public string onResponseCallback()
        {
             return this._performCallback?.Invoke();
        }

    }
}
#endif