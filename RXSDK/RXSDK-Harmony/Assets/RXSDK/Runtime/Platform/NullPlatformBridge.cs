using System;

namespace RXSDK.Platform
{
    /// <summary>
    /// 非 OpenHarmony 平台或编辑器下的空实现，所有回调给出默认/失败结果。
    /// </summary>
    public sealed class NullPlatformBridge : IPlatformBridge
    {
        public static readonly NullPlatformBridge Instance = new NullPlatformBridge();

        private NullPlatformBridge() { }

        public PlatformType PlatformId => PlatformType.None;
        public bool SupportsNativeSdkInit => false;
        public bool SupportsNativeTrack => false;
        public bool SupportsNativeSendCaptcha => false;

        #region Init / GameService
        public void RXInit(string initArgsJson, Action<string> callback) =>
            callback?.Invoke("{\"code\":0}");
        public void InitGameServiceOnUI(Action<string> callback) =>
            callback?.Invoke("{\"code\":0}");
        #endregion

        #region Login / Passport
        public void RXLogin(string loginArgsJson, Action<string> callback) =>
            callback?.Invoke("{\"code\":0}");

        public void RXLogout(string param = "{}") { }

        public void UpdateToken(string tokenJson) { }

        public void UpdateLoginData(string loginDataJson) { }

        public void SendCaptcha(string argsJson, Action<string> callback) =>
            callback?.Invoke("{\"code\":0}");

        public void GamePlayerBindPlayerOnUI(string thirdOpenId, string teamPlayerId, Action<string> callback) =>
            callback?.Invoke("{\"code\":0}");

        public void GamePlayerUnBindPlayerOnUI(string thirdOpenId, string teamPlayerId, Action<string> callback) =>
            callback?.Invoke("{\"code\":-1,\"msg\":\"Platform not supported\"}");

        public void GamePlayerVerifyLocalPlayerOnUI(string openId, bool? isRealName, Action<string> callback) =>
            callback?.Invoke("{\"code\":0}");
        #endregion

        #region Billing
        public void StartPurchaseUI(int storeType, string storeId, string developerPayload, string reservedInfo, Action<string> callback) =>
            callback?.Invoke("{\"code\":-1,\"msg\":\"Platform not supported\"}");

        public void CheckOwnedPurchasesOnUI(string storeType, Action<string> callback) =>
            callback?.Invoke("{\"code\":0}");
        #endregion

        #region Push
        public void RegisterToken(Action<string> callback) =>
            callback?.Invoke("{\"code\":0}");

        public void UnRegisterToken(Action<string> callback) =>
            callback?.Invoke("{\"code\":0}");
        #endregion

        #region Track
        public void TrackData(string trackDataJson) { }

        public void TrackUserAction(string trackDataJson) { }

        public void StopTrackUserAction() { }
        #endregion

        #region Share
        public void Share(string param, Action<string> callback) =>
            callback?.Invoke("{\"code\":0}");

        public void OpenBusinessView(string param, Action<string> callback) =>
            callback?.Invoke("{\"code\":0}");

        public void OnKnockShare(string param, Action<string> callback) =>
            callback?.Invoke("{\"code\":0}");

        public void OffKnockShare() { }
        #endregion

        #region UI
        public void OpenUserCenter(string argsJson, Action<string> callback) =>
            callback?.Invoke("{\"code\":0}");

        public void OpenHelperCenter(string argsJson, Action<string> callback) =>
            callback?.Invoke("{\"code\":0}");

        public void OpenWebView(string argsJson, Action<string> callback) =>
            callback?.Invoke("{\"code\":0}");

        public void ShowPrivacyUI(string argsJson, Action<string> callback) =>
            callback?.Invoke("{\"code\":0}");
        #endregion

        #region Info
        public string GetSdkInfo() => "";
        #endregion
    }
}
