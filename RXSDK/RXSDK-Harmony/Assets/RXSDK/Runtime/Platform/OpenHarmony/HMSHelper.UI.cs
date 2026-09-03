using System;
using System.Collections.Generic;
using UnityEngine;

namespace RXSDK
{
    public static partial class HMSAPI
    {
        public static void OpenUserCenter(UserCenterUIConfig args, Action<string> callback)
        {
#if UNITY_OPENHARMONY
            SetCallback("showUserCenterUI", callback);
            GetRXAPIManager().Call("RXUserCenter", args.ToJson(), GetJSCallback());
#else
            Log.D($"currnet platform {Application.platform} not impl ");
            callback?.Invoke("{\"code\":0}");
#endif
        }

        public static void OpenHelperCenter(HelpCenterUIArgs args, Action<string> callback)
        {
#if UNITY_OPENHARMONY
            SetCallback("showHelperCenterUI", callback);
            GetRXAPIManager().Call("RXHelperCenter", args.ToJson(), GetJSCallback());
#else
            Log.D($"currnet platform {Application.platform} not impl ");
            callback?.Invoke("{\"code\":0}");
#endif
        }

        public static void OpenWebView(WebViewConfig args, Action<string> callback)
        {
#if UNITY_OPENHARMONY
            SetCallback("showWebView", callback);
            GetRXAPIManager().Call("RXWebView", args.ToJson(), GetJSCallback());
#else
            Log.D($"currnet platform {Application.platform} not impl ");
            callback?.Invoke("{\"code\":0}");
#endif
        }

        public static void ShowPrivacyUI(PrivacyKeyArgs args, Action<string> callback)
        {
#if UNITY_OPENHARMONY
            SetCallback("showPrivacyUI", callback);
            GetRXAPIManager().Call("RXShowPrivacyUI", args.ToJson(), GetJSCallback());
#else
            Log.D($"currnet platform {Application.platform} not impl ");
            callback?.Invoke("{\"code\":0}");
#endif
        }

        public static void SendCaptcha(SendCaptchaArgs args, Action<string> callback)
        {
#if UNITY_OPENHARMONY
            SetCallback("sendCaptcha", callback);
            GetRXAPIManager().Call("RXSendCaptcha", args.ToJson(), GetJSCallback());
#else
            Log.D($"currnet platform {Application.platform} not impl ");
            callback?.Invoke("{\"code\":0}");
#endif
        }

        public static void UpdateToken(AccessToken token)
        {
#if UNITY_OPENHARMONY && (!UNITY_EDITOR)
            GetRXAPIManager().Call("UpdateToken", token?.ToJson());
#endif
        }

        public static void UpdateLoginData(LoginData data)
        {
#if UNITY_OPENHARMONY && (!UNITY_EDITOR)
            GetRXAPIManager().Call("UpdateLoginData", data?.ToJson());
#endif
        }

        public static void TrackData(TrackDataArgs trackData)
        {
#if UNITY_OPENHARMONY && (!UNITY_EDITOR)
            GetRXAPIManager().Call("TrackData", trackData?.ToJson());
#endif
        }

        public static void TrackUserAction(Dictionary<string, object> trackData, string distinctId = null)
        {
            if (distinctId != null)
                trackData["distinct_id"] = distinctId;
#if UNITY_OPENHARMONY && (!UNITY_EDITOR)
            GetRXAPIManager().Call("TrackUserAction", RXUtility.ObjectToJson(trackData));
#endif
        }

        /// <summary>供 IPlatformBridge 调用，直接传 json 串。</summary>
        public static void TrackUserAction(string trackDataJson)
        {
#if UNITY_OPENHARMONY && (!UNITY_EDITOR)
            if (!string.IsNullOrEmpty(trackDataJson))
                GetRXAPIManager().Call("TrackUserAction", trackDataJson);
#endif
        }

        public static void StopTrackUserAction()
        {
#if UNITY_OPENHARMONY && (!UNITY_EDITOR)
            GetRXAPIManager().Call("StopTrackUserAction");
#endif
        }

        public static void Share(string param, Action<string> callback)
        {
#if UNITY_OPENHARMONY && (!UNITY_EDITOR)
            SetCallback("Share", callback);
            GetRXAPIManager().Call("Share", param, GetJSCallback());
#else
            Log.D($"currnet platform {Application.platform} not impl ");
            callback?.Invoke("{\"code\":0}");
#endif
        }

        public static void OpenBusinessView(string param, Action<string> callback)
        {
#if UNITY_OPENHARMONY && (!UNITY_EDITOR)
            SetCallback("OpenBusinessView", callback);
            GetRXAPIManager().Call("OpenBusinessView", param, GetJSCallback());
#else
            Log.D($"currnet platform {Application.platform} not impl ");
            callback?.Invoke("{\"code\":0}");
#endif
        }

        public static void OnKnockShare(string param, Action<string> callback)
        {
#if UNITY_OPENHARMONY && (!UNITY_EDITOR)
            SetCallback("OnKnockShare", callback);
            GetRXAPIManager().Call("OnKnockShare", param, GetJSCallback());
#else
            Log.D($"currnet platform {Application.platform} not impl ");
            callback?.Invoke("{\"code\":0}");
#endif
        }

        public static void OffKnockShare()
        {
#if UNITY_OPENHARMONY && (!UNITY_EDITOR)
            GetRXAPIManager().Call("OffKnockShare");
#endif
        }
    }
}
