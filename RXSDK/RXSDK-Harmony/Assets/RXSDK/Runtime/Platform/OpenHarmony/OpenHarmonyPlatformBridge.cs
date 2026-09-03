using System;
using Newtonsoft.Json;
using RXSDK;

namespace RXSDK.Platform.OpenHarmony
{
#if UNITY_OPENHARMONY
    /// <summary>
    /// OpenHarmony 平台下 IPlatformBridge 实现，委托给 HMSAPI。
    /// </summary>
    public sealed class OpenHarmonyPlatformBridge : IPlatformBridge
    {
        public PlatformType PlatformId => PlatformType.OpenHarmony;
        public bool SupportsNativeSdkInit => true;
        public bool SupportsNativeTrack => true;
        public bool SupportsNativeSendCaptcha => true;

        public void RXInit(string initArgsJson, Action<string> callback) =>
            HMSAPI.RXInit(initArgsJson, callback);

        public void InitGameServiceOnUI(Action<string> callback) =>
            HMSAPI.InitGameServiceOnUI(callback);

        public void RXLogin(string loginArgsJson, Action<string> callback) =>
            HMSAPI.RXLogin(loginArgsJson, callback);

        public void RXLogout(string param = "{}") =>
            HMSAPI.RXLogout(param);

        public void UpdateToken(string tokenJson) =>
            HMSAPI.UpdateToken(string.IsNullOrEmpty(tokenJson) ? null : JsonConvert.DeserializeObject<AccessToken>(tokenJson));

        public void UpdateLoginData(string loginDataJson) =>
            HMSAPI.UpdateLoginData(string.IsNullOrEmpty(loginDataJson) ? null : JsonConvert.DeserializeObject<LoginData>(loginDataJson));

        public void SendCaptcha(string argsJson, Action<string> callback)
        {
            var args = string.IsNullOrEmpty(argsJson) ? null : JsonConvert.DeserializeObject<SendCaptchaArgs>(argsJson);
            HMSAPI.SendCaptcha(args, callback);
        }

        public void GamePlayerBindPlayerOnUI(string thirdOpenId, string teamPlayerId, Action<string> callback) =>
            HMSAPI.GamePlayerBindPlayerOnUI(thirdOpenId, teamPlayerId, callback);

        public void GamePlayerUnBindPlayerOnUI(string thirdOpenId, string teamPlayerId, Action<string> callback) =>
            HMSAPI.GamePlayerUnBindPlayerOnUI(thirdOpenId, teamPlayerId, callback);

        public void GamePlayerVerifyLocalPlayerOnUI(string openId, bool? isRealName, Action<string> callback) =>
            HMSAPI.GamePlayerVerifyLocalPlayerOnUI(openId, isRealName, callback);

        public void StartPurchaseUI(int storeType, string storeId, string developerPayload, string reservedInfo, Action<string> callback) =>
            HMSAPI.StartPurchaseUI(storeType, storeId, developerPayload, reservedInfo, callback);

        public void CheckOwnedPurchasesOnUI(string storeType, Action<string> callback) =>
            HMSAPI.CheckOwnedPurchasesOnUI(storeType, callback);

        public void RegisterToken(Action<string> callback) =>
            HMSAPI.RegisterToken(callback);

        public void UnRegisterToken(Action<string> callback) =>
            HMSAPI.UnRegisterToken(callback);

        public void TrackData(string trackDataJson)
        {
            if (string.IsNullOrEmpty(trackDataJson)) return;
            var args = JsonConvert.DeserializeObject<TrackDataArgs>(trackDataJson);
            HMSAPI.TrackData(args);
        }

        public void TrackUserAction(string trackDataJson) =>
            HMSAPI.TrackUserAction(trackDataJson);

        public void StopTrackUserAction() =>
            HMSAPI.StopTrackUserAction();

        public void Share(string param, Action<string> callback) =>
            HMSAPI.Share(param, callback);

        public void OpenBusinessView(string param, Action<string> callback) =>
            HMSAPI.OpenBusinessView(param, callback);

        public void OnKnockShare(string param, Action<string> callback) =>
            HMSAPI.OnKnockShare(param, callback);

        public void OffKnockShare() =>
            HMSAPI.OffKnockShare();

        public void OpenUserCenter(string argsJson, Action<string> callback)
        {
            var args = string.IsNullOrEmpty(argsJson) ? null : JsonConvert.DeserializeObject<UserCenterUIConfig>(argsJson);
            HMSAPI.OpenUserCenter(args, callback);
        }

        public void OpenHelperCenter(string argsJson, Action<string> callback)
        {
            var args = string.IsNullOrEmpty(argsJson) ? null : JsonConvert.DeserializeObject<HelpCenterUIArgs>(argsJson);
            HMSAPI.OpenHelperCenter(args, callback);
        }

        public void OpenWebView(string argsJson, Action<string> callback)
        {
            var args = string.IsNullOrEmpty(argsJson) ? null : JsonConvert.DeserializeObject<WebViewConfig>(argsJson);
            HMSAPI.OpenWebView(args, callback);
        }

        public void ShowPrivacyUI(string argsJson, Action<string> callback)
        {
            var args = string.IsNullOrEmpty(argsJson) ? null : JsonConvert.DeserializeObject<PrivacyKeyArgs>(argsJson);
            HMSAPI.ShowPrivacyUI(args, callback);
        }

        public string GetSdkInfo() =>
            HMSAPI.GetSdkInfo();
    }
#endif
}
