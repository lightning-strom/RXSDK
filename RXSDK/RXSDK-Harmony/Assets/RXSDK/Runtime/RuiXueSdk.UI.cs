using System;
using System.Collections.Generic;
using RXSDK.Net;
using RXSDK.Platform;

namespace RXSDK
{
    /// <summary>RuiXueSdk 用户中心/帮助中心/WebView/协议/埋点行为/请求工厂 API</summary>
    public partial class RuiXueSdk
    {
        #region 请求与近场传输

        public static IRXRequest CreateRequest(string pathOrUrl) => RXWebRequest.Create(pathOrUrl);
        public static IGameNearbyTransfer GameNearbyTransfer() => GameNearbyTransferFactory.Instance;

        #endregion

        #region UserCenter / HelperCenter / WebView / Protocol

        public static void UserCenterUI(UserCenterUIConfig args, Action<string> callback)
        {
            PlatformProvider.Current.OpenUserCenter(args?.ToJson(), callback);
        }

        public static void HelperCenterUI(HelpCenterUIArgs args, Action<string> callback)
        {
            PlatformProvider.Current.OpenHelperCenter(args?.ToJson(), callback);
        }

        public static void ApplyForDeregisterUI(HelpCenterUIArgs args, Action<string> callback)
        {
            var webViewConfig = new WebViewConfig
            {
                title = "账号注销",
                url = APIPath.GetUrl(APIPath.UNREGISTERCONDITION),
                webParams = new WebParams { custom_params = args.ToJson() }
            };
            PlatformProvider.Current.OpenWebView(webViewConfig?.ToJson(), callback);
        }

        public static void HelpCenterUI(HelpCenterUIArgs args, Action<string> callback) =>
            HelperCenterUI(args, callback);

        [Obsolete("Use HelpCenterUI(HelpCenterUIArgs, Action<string>) instead.")]
        public static void HelpCenterUI(HelpCenterUIArgs args)
        {
            WebViewManager.Instance.OpenHelpCenter(args);
        }

        [Obsolete("Use ApplyForDeregisterUI(HelpCenterUIArgs, Action<string>) instead.")]
        public static void ApplyForDeregisterUI(HelpCenterUIArgs args)
        {
            WebViewManager.Instance.OpenDeregister(args);
        }

        public static void ChatServiceUI(HelpCenterUIArgs args)
        {
            WebViewManager.Instance.OpenChatService(args);
        }

        public static void ProtocolView(string key, string[] keyList, Action<string> callback = null)
        {
            PlatformProvider.Current.ShowPrivacyUI(RXUtility.ObjectToJson(new PrivacyKeyArgs
            {
                key = key,
                key_list = keyList
            }), callback);
        }

        #endregion

        #region UserAction Track

        public static void TrackUserAction(Dictionary<string, object> trackData, string distinctId = null)
        {
            UserActionTracer.TrackUserAction(trackData, distinctId);
        }

        public static void StopTrackUserAction()
        {
            UserActionTracer.StopTrackUserAction();
        }

        #endregion
    }
}
