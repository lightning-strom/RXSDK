#if UNITY_ANDROID

using UnityEngine;
namespace RuiXue
{
    public class AppExitCallbackCallbackJavaProxy : AndroidJavaProxy
    {
        ExitConfirmDelegate _exitConfirm;
        ExitCancelDelegate _exitCancel; 

        public AppExitCallbackCallbackJavaProxy(ExitConfirmDelegate exitConfirm, ExitCancelDelegate exitCancel) : base("com.ruixue.unity.UnityOnAppExitCallback")
        {
            JavaCallBackToMainThread.CheckInit();
            _exitConfirm = exitConfirm;
            _exitCancel = exitCancel;
        }

        public void onExitConfirm(string res)
        {
            _exitConfirm?.Invoke(res);
        }

        public void onExitCancel()
        {
            _exitCancel?.Invoke();
        }
    }
}
#endif