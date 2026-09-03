using System;
using System.Collections.Generic;

namespace RXSDK.Platform
{
    /// <summary>
    /// 平台能力抽象，封装各端原生调用，便于业务层解耦、单测与多引擎扩展。
    /// 业务层通过能力属性（SupportsNativeXxx）分支，避免依赖具体 PlatformType，以兼容 Unity/团结等多引擎。
    /// </summary>
    public interface IPlatformBridge
    {
        /// <summary>平台类型标识，用于日志与调试；业务分支请用 SupportsNativeXxx 能力属性。</summary>
        PlatformType PlatformId { get; }

        /// <summary>是否由本桥接负责 SDK 初始化（原生 Init）；否则走 HTTP Init。</summary>
        bool SupportsNativeSdkInit { get; }
        /// <summary>是否由本桥接负责埋点上报；否则走缓存 + HTTP。</summary>
        bool SupportsNativeTrack { get; }
        /// <summary>是否由本桥接负责发送验证码（如原生 UI）；否则走 HTTP。</summary>
        bool SupportsNativeSendCaptcha { get; }

        #region Init / GameService
        void RXInit(string initArgsJson, Action<string> callback);
        void InitGameServiceOnUI(Action<string> callback);
        #endregion

        #region Login / Passport
        void RXLogin(string loginArgsJson, Action<string> callback);
        void RXLogout(string param = "{}");
        void UpdateToken(string tokenJson);
        void UpdateLoginData(string loginDataJson);
        void SendCaptcha(string argsJson, Action<string> callback);
        void GamePlayerBindPlayerOnUI(string thirdOpenId, string teamPlayerId, Action<string> callback);
        void GamePlayerUnBindPlayerOnUI(string thirdOpenId, string teamPlayerId, Action<string> callback);
        void GamePlayerVerifyLocalPlayerOnUI(string openId, bool? isRealName, Action<string> callback);
        #endregion

        #region Billing
        void StartPurchaseUI(int storeType, string storeId, string developerPayload, string reservedInfo, Action<string> callback);
        void CheckOwnedPurchasesOnUI(string storeType, Action<string> callback);
        #endregion

        #region Push
        void RegisterToken(Action<string> callback);
        void UnRegisterToken(Action<string> callback);
        #endregion

        #region Track
        void TrackData(string trackDataJson);
        void TrackUserAction(string trackDataJson);
        void StopTrackUserAction();
        #endregion

        #region Share
        void Share(string param, Action<string> callback);
        void OpenBusinessView(string param, Action<string> callback);
        void OnKnockShare(string param, Action<string> callback);
        void OffKnockShare();
        #endregion

        #region UI
        void OpenUserCenter(string argsJson, Action<string> callback);
        void OpenHelperCenter(string argsJson, Action<string> callback);
        void OpenWebView(string argsJson, Action<string> callback);
        void ShowPrivacyUI(string argsJson, Action<string> callback);
        #endregion

        #region Info
        string GetSdkInfo();
        #endregion
    }
}
