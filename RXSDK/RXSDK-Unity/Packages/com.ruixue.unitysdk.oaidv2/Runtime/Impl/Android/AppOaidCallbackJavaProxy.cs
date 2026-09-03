#if UNITY_ANDROID
using UnityEngine;
namespace RuiXue
{
    public class AppOaidCallbackJavaProxy : AndroidJavaProxy
    {
        private RequestResponseDelegate _onResponse;

        public AppOaidCallbackJavaProxy(RequestResponseDelegate onResponse) 
            : base("com.ruixue.mdid.OaidSdkWrapperV2$AppOAIDListener")
        {
            JavaCallBackToMainThread.CheckInit();
            
            _onResponse = onResponse;
        }
        
        public void onOAIDReply(string data)
        {
            _onResponse?.Invoke(data);
        }
    }
}
#endif