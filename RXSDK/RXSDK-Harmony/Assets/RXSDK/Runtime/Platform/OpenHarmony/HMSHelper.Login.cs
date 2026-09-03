using System;
using UnityEngine;

namespace RXSDK
{
    public static partial class HMSAPI
    {
        public static void LoginOnUI(Action<string> callback)
        {
            SetCallback(LOGIN_TYPE, callback);
            GetHMSLoginManager().Call("LoginOnUI", GetJSCallback());
        }

        public static void LogoutOnUI()
        {
#if UNITY_OPENHARMONY && (!UNITY_EDITOR)
            GetHMSLoginManager().Call("LogoutOnUI", GetJSCallback());
#endif
        }

        public static void RXInit(string param, Action<string> callback)
        {
            SetCallback("RXInit", callback);
            GetRXAPIManager().Call("RXInit", param, GetJSCallback());
        }

        public static void RXLogin(string param, Action<string> callback)
        {
#if UNITY_OPENHARMONY && (!UNITY_EDITOR)
            SetCallback("RXLogin", callback);
            GetRXAPIManager().Call("RXLogin", param, GetJSCallback());
#else
            Log.D($"currnet platform {Application.platform} not impl ");
            callback?.Invoke("{\"code\":0}");
#endif
        }

        public static void RXLogout(string param = "{}")
        {
#if UNITY_OPENHARMONY && (!UNITY_EDITOR)
            GetRXAPIManager().Call("RXLogout", param);
#endif
        }

        public static void UnionLoginOnUI(string param, Action<string> callback)
        {
            SetCallback(UNION_LOGIN, callback);
            GetHMSLoginManager().Call("UnionLoginOnUI", param, GetJSCallback());
        }

        public static void GamePlayerGetLocalPlayerOnUI(Action<string> callback)
        {
            SetCallback("GetLocalPlayer", callback);
            GetHMSLoginManager().Call("GamePlayerGetLocalPlayerOnUI", GetJSCallback());
        }
    }
}
