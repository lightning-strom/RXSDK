using System;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;
using RXSDK.Data;
using RXSDK.Net;
using UnityEngine;

namespace RXSDK
{
    public class WebParamsObject : DataBean
    {
        public string api_params;
        public string login_data;
        public string config_params;
        public string device;
        public string methods;
        public string custom_params;
        public string passwordStrength;
        public bool setSyncInfoEnable;
        public string protocol;

    }
    public sealed class WebViewManager : Singleton<WebViewManager>
    {
#if UNITY_OPENHARMONY
        private OpenHarmonyJSClass _rxWebViewManagerClass;
        private OpenHarmonyJSCallback _webviewMsgHandler;

        public static object WebViewMsgHandler(params OpenHarmonyJSObject[] args)
        {
            if (args.Length > 0)
            {
                string func = args[0].As<string>();
                string data = "";
                if (args.Length > 1)
                    data = args[1].As<string>();

                Log.D($"WebViewMsgHandler  func:{func}, data:{data}");

                try
                {
                    switch (func)
                    {
                        case "invokeNativeCallback":
                            {
                                HandleJsCallInvokeNativeCallback(data);
                            }
                            break;
                        case "refreshAccessToken":
                            {
                                HandleJsCallRefreshAccessToken();
                            }
                            break;
                        case "reportUserLog":
                            {
                                Log.D("TODO: 汇报玩家日志 reportUserLog");
                            }
                            break;
                        case "syncInfo":
                            {
                                HandleJsCallSyncInfo();
                            }
                            break;
                        default:
                            break;
                    }
                }
                catch (Exception e)
                {
                    Log.E("WebViewMsgHandler error:" + e);
                }
            }
            return null;
        }

        private OpenHarmonyJSCallback GetJsMsgHandler()
        {
            _webviewMsgHandler ??= new OpenHarmonyJSCallback(WebViewMsgHandler);
            return _webviewMsgHandler;
        }

#endif

        public WebViewManager()
        {
#if UNITY_OPENHARMONY
            _rxWebViewManagerClass = new OpenHarmonyJSClass("RXWebViewManager");
            _rxWebViewManagerClass.CallStatic("SetJsCallUnityHandler", GetJsMsgHandler());
#endif
        }

        public void OpenPrivacy(string key, string[] keyList)
        {
            string baseUrl = SDKConfig.Instance.BaseUrls[0];
            string helpCenterUrl = $"{baseUrl}/static/passport/#/protocol/protocollist";
            try
            {

                WebParamsObject webParamsObject = new()
                {
                    protocol = RXUtility.ObjectToJson(new Dictionary<string, object>()
                    {
                        { "key", key },
                        { "key_list", keyList}
                    })
                };
                string initParamJson = GetInitParamJson(webParamsObject);
#if UNITY_OPENHARMONY && (!UNITY_EDITOR)
                _rxWebViewManagerClass.CallStatic("openUrl", helpCenterUrl, initParamJson, true, "隐私政策");
#else
                Application.OpenURL(helpCenterUrl);
#endif
            }
            catch (Exception e)
            {
                Log.D("OpenPrivacy error:" + e);
            }
        }

        public void OpenDeregister(HelpCenterUIArgs args)
        {
#if UNITY_OPENHARMONY
            try
            {
                string baseUrl = SDKConfig.Instance.BaseUrls[0];
                string helpCenterUrl = $"{baseUrl}/static/passport/#/user/unregistercondition";

                string initParamJson = GetInitParamJson(args);
                _rxWebViewManagerClass.CallStatic("openUrl", helpCenterUrl, initParamJson, true, "账号注销");

            }
            catch (Exception e)
            {
                Log.E("OpenUrl error:" + e);
            }
#endif
        }

        public void OpenHelpCenter(HelpCenterUIArgs args)
        {
#if UNITY_OPENHARMONY
            try
            {
                string baseUrl = SDKConfig.Instance.BaseUrls[0];
                string helpCenterUrl = $"{baseUrl}/static/passport/#/helpcenter/questioncatalogue?minimized=0";

                OpenUrl(helpCenterUrl, args);
            }
            catch (Exception e)
            {
                Log.E("OpenHelpCenter error:" + e);
            }
#endif
        }

        public void OpenChatService(HelpCenterUIArgs args, bool isDarkTheme = true)
        {
#if UNITY_OPENHARMONY
            try
            {
                string theme = isDarkTheme ? "dark" : "light";
                string baseUrl = SDKConfig.Instance.BaseUrls[0];
                string charServiceUrl = $"{baseUrl}/static/service/#/welcome?theme={theme}&minimized=0";

                OpenUrl(charServiceUrl, args);
            }
            catch (Exception e)
            {
                Log.E("OpenChatService error:" + e);
            }
#endif
        }

        private void OpenUrl(string url, HelpCenterUIArgs args)
        {
#if UNITY_OPENHARMONY
            string initParamJson = GetInitParamJson(args);
            _rxWebViewManagerClass.CallStatic("openUrl", url, initParamJson);
#endif
        }


        private string GetInitParamJson(HelpCenterUIArgs userCenterConfig)
        {
            WebParamsObject webParamsObject = new WebParamsObject();

            // cpdata
            Dictionary<string, object> cpData = new()
            {
                { "transmit_args", userCenterConfig.transmit_args },
                { "game_user_id", userCenterConfig.game_user_id },
                { "nickname", userCenterConfig.nickname },
                { "head_img_url", userCenterConfig.head_img_url },
                { "queue_name", userCenterConfig.queue_name }
            };
            webParamsObject.custom_params = RXUtility.ObjectToJson(cpData);

            return GetInitParamJson(webParamsObject);

        }


        private string GetInitParamJson(WebParamsObject webParams)
        {
            webParams ??= new();

            if (webParams.api_params == null)
            {
                Dictionary<string, object> apiParams = new()
                {
                    { "cpid", SDKConfig.Instance.CpId },
                    { "productid", SDKConfig.Instance.ProductId },
                    { "channelid", SDKConfig.Instance.ChannelId },
                    { "version", SDKConfig.Instance.SDK_VERSION },
                    { "domain", SDKConfig.Instance.BaseUrls[0] },
                    { "devicecode", DeviceUtility.GetDeviceCode() },
                    { "tzoffset", TimeUtility.GetLocalTimeOffsetString() },
                    { "language", SDKConfig.Instance.Language },
                    { "country_code", DeviceUtility.GetCountry() }
                };
                webParams.api_params ??= RXUtility.ObjectToJson(apiParams);
            }

            webParams.login_data ??= RXUtility.ObjectToJson(PassportManager.Instance.CurrentLoginData);


            if (null == webParams.device)
            {
                //设备信息
                Dictionary<string, object> deviceInfo = new()
                {
                    { "orientation", Screen.orientation == ScreenOrientation.Portrait ? 1 : 2 },
                    { "isPad", 0 }
                };

                float naviBarHeight = Screen.height - UnityEngine.Device.Screen.safeArea.height;
                float naviBarHeightDp = naviBarHeight / (UnityEngine.Device.Screen.dpi / 160);

                deviceInfo.Add("naviBarHeight", naviBarHeightDp);
                deviceInfo.Add("hasSafeZone", (Screen.safeArea.width < Screen.width || Screen.safeArea.height < Screen.height) ? 1 : 0);
                deviceInfo.Add("tabbarSafeHeight", 0);

                webParams.device ??= RXUtility.ObjectToJson(deviceInfo);

            }


            if (PassportManager.Instance.CurrentLoginData != null)
            {
                List<string> methods = new()
                {
                    PassportManager.Instance.CurrentLoginData.method
                };
                webParams.methods ??= RXUtility.ObjectToJson(methods);
            }

            webParams.passwordStrength ??= RXUtility.ObjectToJson(new Dictionary<string, string>()
            {
                { "password_type", "default" },
                { "pattern", "" }
            });

            webParams.protocol ??= RXUtility.ObjectToJson(new Dictionary<string, string>()
            {
                { "key", "" },
                { "key_list", "" }
            });

            return webParams.ToJson();
        }



        private static void HandleJsCallRefreshAccessToken()
        {
#if UNITY_OPENHARMONY
            PassportManager.Instance.RefreshCurrentAccessToken(RXWebRequest.DefaultCoroutineHost, null, (code, accessToken, msg) =>
            {
                if (accessToken != null)
                {
                    string json = RXUtility.ObjectToJson(accessToken);
                    string jsonNoNewLines = json.Replace(Environment.NewLine, "");
                    string javaScript = $"(function() {{ return window.refreshAccessToken!=undefined ? refreshAccessToken('{jsonNoNewLines}'):undefined; }})();";
                    Instance?._rxWebViewManagerClass.CallStatic("runJavaScript", javaScript);
                }
            });
#endif
        }

        private static void HandleJsCallSyncInfo()
        {
#if UNITY_OPENHARMONY
            Dictionary<string, object> param = new();
            param["method"] = PassportManager.Instance.CurrentLoginData.method;
            RuiXueSdk.SyncInfo(param, (code, data, msg) =>
            {
                if (data != null)
                {
                    JObject jsonObj = data as JObject;
                    if (jsonObj.TryGetValue("avatar", out var avatar))
                    {
                        // TODO:avatar
                        //PassportManager.Instance.CurrentLoginData.
                    }

                    if (jsonObj.TryGetValue("nickname", out var nickname))
                    {
                        PassportManager.Instance.CurrentLoginData.nickname = nickname.Value<string>();
                    }

                    string jsonAsString = jsonObj.ToString();
                    string jsonNoNewLines = jsonAsString.Replace(Environment.NewLine, "");
                    string javaScript = $"(function() {{ return window.syncInfo!=undefined ? syncInfo('{jsonNoNewLines}'):undefined; }})();";
                    Instance?._rxWebViewManagerClass.CallStatic("runJavaScript", javaScript);
                }
            });
#endif
        }

        private static void HandleJsCallInvokeNativeCallback(string jsonData)
        {
            Log.D("HandleJsCallInvokeNativeCallback " + jsonData);
            JObject jsonObj = JObject.Parse(jsonData);

            if (!jsonObj.TryGetValue("type", out var type))
            {
                return;
            }

            if (PassportManager.Instance.CurrentLoginData == null)
            {
                return;
            }

            string typeStr = type.Value<string>();
            var extToken = jsonObj["ext"];

            if (typeStr == "real_auth")
            {
                var ageToken = jsonObj["data"]["age"];
                if (ageToken != null)
                {
                    int age = ageToken.Value<int>();
                    if (age > 0)
                    {
                        PassportManager.Instance.CurrentLoginData.age = age;
                    }
                }
            }
            else if (typeStr == "deregister")
            {
                PassportManager.Instance.CurrentLoginData.SetDeregister(true);
            }
            else if (typeStr == "underegister")
            {
                PassportManager.Instance.CurrentLoginData.SetDeregister(false);
            }
            else if (typeStr == "binding_phone" && extToken != null)
            {
                PassportManager.Instance.CurrentLoginData.SetExtPhone(extToken["phone"]?.Value<string>());
                PassportManager.Instance.CurrentLoginData.SetAttr(LoginData.LoginAttrMask.BIND_PHONE);
            }
            else if (typeStr == "change_phone" && extToken != null)
            {
                PassportManager.Instance.CurrentLoginData.SetExtPhone(extToken["phone"]?.Value<string>());
                PassportManager.Instance.CurrentLoginData.SetAttr(LoginData.LoginAttrMask.BIND_PHONE);
            }
            else if (typeStr == "binding_email" && extToken != null)
            {
                PassportManager.Instance.CurrentLoginData.SetExtEmail(extToken["email"]?.Value<string>());
                PassportManager.Instance.CurrentLoginData.SetAttr(LoginData.LoginAttrMask.BIND_email);
            }
            else if (typeStr == "change_email" && extToken != null)
            {
                PassportManager.Instance.CurrentLoginData.SetExtEmail(extToken["email"]?.Value<string>());
                PassportManager.Instance.CurrentLoginData.SetAttr(LoginData.LoginAttrMask.BIND_email);
            }
            else if (typeStr == "reset_password")
            {
                //TODO:
            }
            else if (typeStr == "close_webview")
            {
#if UNITY_OPENHARMONY
                Instance?._rxWebViewManagerClass.CallStatic("close");
#endif
            }
            else if (typeStr == "sync_info")
            {
                HandleJsCallSyncInfo();
            }

        }
    }
}