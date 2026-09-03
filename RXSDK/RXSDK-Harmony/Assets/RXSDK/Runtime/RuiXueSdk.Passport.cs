using System;
using System.Collections.Generic;
using RXSDK.Platform;
using UnityEngine;

namespace RXSDK
{
    /// <summary>RuiXueSdk 账号/登录/法务/CDKey 相关 API</summary>
    public partial class RuiXueSdk
    {
        #region Login & Account

        [Obsolete("Use RXCallback<LoginData> overload.")]
        public static void Login(LoginMethod method, Dictionary<string, object> keyValuePairs, Action<int, LoginData, string> callback)
        {
            Login(method, keyValuePairs, RXUtility.ToRXCallback(callback));
        }

        public static void Login(LoginMethod method, Dictionary<string, object> keyValuePairs, RXCallback<LoginData> callback)
        {
            PassportManager.Instance.Login(Instance, method.GetString(), keyValuePairs, callback);
        }

        [Obsolete("Use RXCallback<LoginData> overload.")]
        public static void UnionLogin(UnionLoginArgs unionLoginArgs, Action<int, LoginData, string> callback)
        {
            UnionLogin(unionLoginArgs, RXUtility.ToRXCallback(callback));
        }

        public static void UnionLogin(UnionLoginArgs unionLoginArgs, RXCallback<LoginData> callback)
        {
            PassportManager.Instance.UnionLogin(Instance, unionLoginArgs, callback);
        }

        public static void ShowLoginUI(LoginUIConfig loginUIConfig, RXCallback<LoginData> callback)
        {
            UnionLogin(loginUIConfig, callback);
        }

        public static void BindPlayer(string teamPlayerId = null, string thirdOpenId = null, Action<string> callback = null)
        {
            thirdOpenId ??= PassportManager.Instance.CurrentLoginData?.openid;
            teamPlayerId ??= PassportManager.Instance.CurrentLoginData?.tid;
            if (string.IsNullOrEmpty(thirdOpenId) && string.IsNullOrEmpty(teamPlayerId))
            {
                callback?.Invoke("{\"code\":-1,\"msg\":\"Missing player information\"}");
                return;
            }
            PlatformProvider.Current.GamePlayerBindPlayerOnUI(thirdOpenId, teamPlayerId, callback);
        }

        public static void UnBindPlayer(string teamPlayerId = null, string thirdOpenId = null, Action<string> callback = null)
        {
            thirdOpenId ??= PassportManager.Instance.CurrentLoginData?.openid;
            teamPlayerId ??= PassportManager.Instance.CurrentLoginData?.tid;
            Log.D(teamPlayerId + " account binding " + PassportManager.Instance.CurrentLoginData?.IsBinding);
            PlatformProvider.Current.GamePlayerUnBindPlayerOnUI(thirdOpenId, teamPlayerId, callback);
        }

        public static void Logout() => PassportManager.Instance.Logout();

        [Obsolete("Use RXCallback<LoginData> overload.")]
        public static void Login(LoginArgs args, Action<int, LoginData, string> callback)
        {
            PassportManager.Instance.Login(Instance, args, RXUtility.ToRXCallback(callback));
        }

        #endregion

        #region Passport API (Register / Captcha / Bind / Password / UserInfo)

        [Obsolete("Use RXCallback overload.")]
        public static void Register(RegisterArgs args, Action<int, object, string> callback)
        {
            PassportManager.Instance.Register(Instance, args, callback);
        }

        [Obsolete("Use RXCallback overload.")]
        public static void SendCaptcha(SendCaptchaArgs args, Action<int, object, string> callback)
        {
            PassportManager.Instance.SendCaptcha(Instance, args, RXUtility.ToRXCallback(callback));
        }

        [Obsolete("Use RXCallback overload.")]
        public static void VerifyCaptcha(VerifyCaptchaArgs args, Action<int, object, string> callback)
        {
            API.Post(APIPath.VERIFY_CAPTCHA, args, callback);
        }

        [Obsolete("Use RXCallback overload.")]
        public static void SyncInfo(Dictionary<string, object> keyValuePairs, Action<int, object, string> callback)
        {
            PassportManager.Instance.SyncInfo(Instance, keyValuePairs, callback);
        }

        [Obsolete("Use RXCallback overload.")]
        public static void BindPhone(BindPhoneArgs args, Action<int, object, string> callback)
        {
            PassportManager.Instance.BindPhone(Instance, args, callback);
        }

        [Obsolete("Use RXCallback overload.")]
        public static void UnBindPhone(UnBindPhoneArgs args, Action<int, object, string> callback)
        {
            PassportManager.Instance.UnBindPhone(Instance, args, callback);
        }

        [Obsolete("Use RXCallback overload.")]
        public static void ChangePhone(ChangePasswordArgs args, Action<int, object, string> callback)
        {
            PassportManager.Instance.ChangeBindPhone(Instance, args, callback);
        }

        [Obsolete("Use RXCallback overload.")]
        public static void BindEmail(BindEmailArgs args, Action<int, object, string> callback)
        {
            PassportManager.Instance.BindEmail(Instance, args, callback);
        }

        [Obsolete("Use RXCallback overload.")]
        public static void UnBindEmail(UnBindEmailArgs args, Action<int, object, string> callback)
        {
            PassportManager.Instance.UnBindEmail(Instance, args, callback);
        }

        [Obsolete("Use RXCallback overload.")]
        public static void ChangePassword(ChangePasswordArgs args, Action<int, object, string> callback)
        {
            PassportManager.Instance.ChangePassword(Instance, args, callback);
        }

        [Obsolete("Use RXCallback overload.")]
        public static void ResetPassword(ResetPasswordArgs args, Action<int, object, string> callback)
        {
            PassportManager.Instance.ResetPassword(Instance, args, callback);
        }

        [Obsolete("Use RXCallback overload.")]
        public static void GetUserInfo(Action<int, object, string> callback)
        {
            PassportManager.Instance.GetUserInfo(Instance, callback);
        }

        [Obsolete("Use RXCallback overload.")]
        public static void UpdateUserInfo(UpdateUserInfoArgs args, Action<int, object, string> callback)
        {
            PassportManager.Instance.UpdateUserInfo(Instance, args, callback);
        }

        [Obsolete("Use RXCallback overload.")]
        public static void RealAuth(RealAuthArgs args, Action<int, object, string> callback)
        {
            PassportManager.Instance.RealAuth(Instance, args, callback);
        }

        public static void GetIIFAARedirectURL(string appName, string thirdPartSchema, Action<int, object, string> callback)
        {
            PassportManager.Instance.GetIIFAARedirectURL(Instance, appName, thirdPartSchema, callback);
        }

        public static void GetIIFAAResult(Action<int, object, string> callback)
        {
            PassportManager.Instance.GetIIFAAResult(Instance, callback);
        }

        public static void GetIIFAAResultWithRetryCount(int retryCount, Action<int, object, string> callback)
        {
            PassportManager.Instance.GetIIFAAResultWithRetryCount(Instance, retryCount, callback);
        }

        [Obsolete("Use RXCallback overload.")]
        public static void DeregisterCancel(Action<int, object, string> callback)
        {
            PassportManager.Instance.DeregisterCancel(Instance, callback);
        }

        public static string GetSdkVersion() => SDKConfig.Instance.SDK_VERSION;
        public static string GetSdkInfo() => PlatformProvider.Current.GetSdkInfo();

        #endregion

        #region Legal & CDKey

        [Obsolete("Use RXCallback overload.")]
        public static void Legal(Action<int, object, string> callback)
        {
            var keyValuePairs = new Dictionary<string, object>
            {
                { "channel_id", SDKConfig.Instance.ChannelId },
                { "product_id", SDKConfig.Instance.ProductId }
            };
            API.GetUnAuth(APIPath.LEGAL, keyValuePairs, callback);
        }

        [Obsolete("Use RXCallback overload.")]
        public static void LegalTerms(LegalArgs args, Action<int, object, string> callback)
        {
            args.channel_id ??= SDKConfig.Instance.ChannelId;
            args.product_id ??= SDKConfig.Instance.ProductId;
            API.GetUnAuth(APIPath.LEGAL_TERMS, args.ToDictionary(), callback);
        }

        public static bool IsLoggedIn => PassportManager.Instance.IsLoggedIn;

        [Obsolete("Use RXCallback overload.")]
        public static void GetPromoDisplayKEY(Action<int, PromoCodeBean, string> callback, bool autoRefresh = false)
        {
            CDKeyAPI.Instance.GetPromoDisplayKEY(callback, autoRefresh);
        }

        [Obsolete("Use RXCallback overload.")]
        public static void ExchangePromoCDKEY(string cdKey, Action<int, object, string> callback)
        {
            CDKeyAPI.Instance.ExchangePromoCDKEY(cdKey, RXUtility.ToRXCallback(callback));
        }

        #endregion
    }
}
