#if UNITY_ANDROID
using UnityEngine;
namespace RuiXue
{
    public class RuiXueSdkCallbackJavaProxy : AndroidJavaProxy
    {
        LogoutDelegate _logout;
        SwitchAccountDelegate _switchAccount;
        PublicDelegate _publicDelegate;

        public RuiXueSdkCallbackJavaProxy(PublicDelegate publicDelegate, LogoutDelegate logout, SwitchAccountDelegate switchAccount) : base("com.ruixue.unity.UnityRuiXueSdkCallback")
        {
            JavaCallBackToMainThread.CheckInit();
            
            _logout = logout;
            _switchAccount = switchAccount;
            _publicDelegate = publicDelegate;
        }

        public void rxPublicCallback(int type, string mapJson)
        {
            _publicDelegate?.Invoke(type, mapJson);
        }

        public void onLogout(int code, string msg)
        {
            _logout?.Invoke(code, msg);
        }

        public bool onSwitchAccount(int code, string data)
        {
            if (_switchAccount == null)
                return true;
            
            return _switchAccount.Invoke(code, data);
        }
    }
}
#endif