#if UNITY_ANDROID
using UnityEngine;

namespace RuiXue.Impl
{
    internal class PrivacyJavaProxy : AndroidJavaProxy
    {
        private PrivacyAgreeDelegate _callback;
    
        public PrivacyJavaProxy(PrivacyAgreeDelegate callback) : base("com.ruixue.legal.PrivacyCallback")
        {
            _callback = callback;
        }

        public void onPrivacyAgree(bool userClick)
        {
            _callback?.Invoke(userClick);
        }
    }
}
#endif

