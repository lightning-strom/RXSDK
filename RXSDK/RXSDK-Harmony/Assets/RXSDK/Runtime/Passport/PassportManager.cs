
using System;
using System.Collections.Generic;
using System.Net;
using Newtonsoft.Json.Linq;
using RXSDK.Data;
using RXSDK.Net;
using RXSDK.Platform;
using UnityEngine;

namespace RXSDK
{

    public interface ILoginHandler
    {
        public void DoLogin(string method, Dictionary<string, object> parm, Action<int, Dictionary<string, object>, string> callback);
    }

    interface ILogin
    {
        public void DoLogin(UnionLoginArgs unionLoginArgs, RXCallback<LoginData> callback);
    }

    class LoginHandler
    {
        public static ILoginHandler GetHandler(string method)
        {
            return method switch
            {
                "huawei" or "hwjos" or "harmony" => HMSLoginImpl.Instance,
                "unionlogin" => HMSUnionLoginImpl.Instance,
                _ => DefaultLoginImpl.Instance,
            };
        }
    }

    class LoginFactory
    {
        public static ILogin GetInstance()
        {
            return HMSUnionLogin2Impl.Instance;
        }
    }

    class DefaultLoginImpl : Singleton<DefaultLoginImpl>, ILoginHandler
    {
        public void DoLogin(string method, Dictionary<string, object> parm, Action<int, Dictionary<string, object>, string> callback)
        {
            callback?.Invoke(0, null, null);
        }
    }


    sealed class PassportManager : Singleton<PassportManager>
    {
        private const string IIFAA_SCENE_CODE = "IIFAA_CREDENTIALS_WEILEGAME_ALIPAYUSER";
        private const int IIFAA_RESULT_RETRY_ERROR_CODE = 310039;
        private const int IIFAA_RESULT_DEFAULT_RETRY_COUNT = 3;

        public LoginData CurrentLoginData
        {
            get
            {
                return LoginData.Instance;
            }
            private set
            {
                LoginData.Instance = value;
            }
        }

        public bool IsLoggedIn
        {
            get
            {
                return !string.IsNullOrEmpty(CurrentLoginData?.openid);
            }
        }

        public string CurrentAccessToken
        {
            get
            {
                return CurrentLoginData?.token?.access;
            }
        }
        public bool IsTokenExpired
        {
            get
            {
                return CurrentLoginData?.token?.IsExpired() ?? false;
            }
        }
        public bool IsRefreshTokenExpired
        {
            get
            {
                return (CurrentLoginData?.token?.IsRefreshExpired()) ?? false;
            }
        }

        public PassportManager()
        {

        }

        public string GetDistinctId()
        {
            return CurrentLoginData?.openid ?? DeviceUtility.GetDistinctId();
        }

        public string OpenId { get { return CurrentLoginData?.openid; } }


        /// <summary>
        /// 登录
        /// </summary>
        /// <param name="method"></param>
        /// <param name="keyValuePairs"></param>
        /// <param name="callback"></param>
        public void Login(MonoBehaviour mono, LoginArgs args, RXCallback<LoginData> callback)
        {
            Login(mono, args.method, args.ToDictionary(), callback);
        }

        public void Login(MonoBehaviour mono, string method, Dictionary<string, object> keyValuePairs, RXCallback<LoginData> callback)
        {
            keyValuePairs ??= new();

            LoginHandler.GetHandler(method).DoLogin(method, keyValuePairs, (code, ext, msg) =>
            {
                if (code != 0)
                {
                    // callback?.Invoke(code, null, msg);
                    RXUtility.InvokeCallback(callback, code, null, msg);

                }
                else
                {
                    keyValuePairs.TryAdd("method", method);
                    if (ext != null)
                    {
                        keyValuePairs["ext"] = ext;
                    }
                    DoLogin(mono, APIPath.LOGIN, keyValuePairs, callback);
                }
            });
        }


        public void UnionLogin(MonoBehaviour mono, UnionLoginArgs unionLoginArgs, RXCallback<LoginData> callback)
        {
            LoginFactory.GetInstance().DoLogin(unionLoginArgs, LoginHander(mono, callback));
        }

        [Obsolete("This method overload is deprecated.")]
        public void UnionLogin(MonoBehaviour mono, UnionLoginArgs unionLoginArgs, Dictionary<string, object> keyValuePairs, RXCallback<LoginData> callback)
        {
            string method = LoginMethod.Harmony.GetString();
            LoginHandler.GetHandler("unionlogin").DoLogin(method, unionLoginArgs?.ToDictionary(), (code, ext, msg) =>
            {
                // Log.D("UnionLogin: ext:" + ext);

                if (code != 0)
                {
                    // callback?.Invoke(Error.GetRXCode(code), null, Error.GetMessage(code, msg));
                    RXUtility.InvokeCallback(callback, Error.GetRXCode(code), null, Error.GetMessage(code, msg));

                }
                else
                {
                    // Log.D("UnionLogin: code:" + code + ",msg:" + msg);
                    keyValuePairs ??= new();
                    keyValuePairs.TryAdd("method", method);
                    ext ??= new Dictionary<string, object>();
                    if (ext.ContainsKey("method"))
                    {
                        string extmethod = Convert.ToString(ext[method]);
                        if (extmethod != LoginMethod.Harmony.GetString())
                        {
                            keyValuePairs = ObjectUtility.MergeDic<Dictionary<string, object>, object>(keyValuePairs, ext);
                        }
                        else
                        {
                            keyValuePairs["ext"] = ext;
                        }
                    }
                    else
                    {
                        keyValuePairs["ext"] = ext;
                    }

                    bool needBinding = false;
                    if (ext?.TryGetValue("needBinding", out object rawNeedBinding) ?? false)
                    {
                        needBinding = Convert.ToBoolean(rawNeedBinding);
                    }
                    if (needBinding)
                    {
                        string authorizationCode = ext.ContainsKey("authorizationCode") ? ext["authorizationCode"]?.ToString() : "";
                        var authorizedScopes = ext.ContainsKey("authorizedScopes") ? ext["authorizedScopes"] : "";
                        HandleLoginRelation(mono, authorizationCode, authorizedScopes, (code, data, msg) =>
                        {
                            if (code != 0)
                            {
                                // callback?.Invoke(code, null, msg);
                                RXUtility.InvokeCallback(callback, code, null, msg);


                            }
                            else
                            {
                                string access_token = data != null && data.ContainsKey("access_token") ? data["access_token"]?.ToString() : null;
                                if (!string.IsNullOrEmpty(access_token))
                                {
                                    ext["access_token"] = access_token;
                                    ext.Remove("authorizationCode");
                                    ext.Remove("authorizedScopes");
                                }
                                DoLogin(mono, APIPath.LOGIN, keyValuePairs, callback);
                            }
                        });
                    }
                    else
                    {
                        DoLogin(mono, APIPath.LOGIN, keyValuePairs, callback);
                    }
                }
            });
        }



        public void HandleLoginRelation(MonoBehaviour mono, string authCode, object authorizedScopes, Action<int, Dictionary<string, object>, string> callback)
        {
            RXWebRequest rXWebRequest = RXWebRequest.Create(APIPath.HARMONY_ASSOCIATION);
            Dictionary<string, object> keyValuePairs = new()
            {
                ["code"] = authCode,
                ["scopes"] = authorizedScopes
            };
            rXWebRequest.SetPostData(keyValuePairs);
            rXWebRequest.PostAsync(mono, RXUtility.ToRXCallback(callback));
        }

        public void LoginByToken(MonoBehaviour mono, string loginOpenid, RXCallback<LoginData> callback)
        {
            Dictionary<string, object> keyValuePairs = new()
            {
                { "method", CurrentLoginData.method },
                { "login_openid", loginOpenid }
            };

            DoLogin(mono, APIPath.LOGIN_TOKEN, keyValuePairs, callback);
        }


        public void Logout()
        {
            LoginData.Remove();
            CurrentLoginData = null;
            PlatformProvider.Current.RXLogout();
        }

        void DoLogin(MonoBehaviour mono, string api, Dictionary<string, object> keyValuePairs, RXCallback<LoginData> callback)
        {
            HandlePassword(ref keyValuePairs);
            RXWebRequest rXWebRequest = RXWebRequest.Create(api);
            rXWebRequest.SetPostData(keyValuePairs);
            rXWebRequest.PostAsync(mono, LoginExtHandler(mono, keyValuePairs, callback));
        }

        public void SyncInfo(MonoBehaviour mono, Dictionary<string, object> keyValuePairs, Action<int, object, string> callback)
        {
            keyValuePairs ??= new();
            if (!keyValuePairs.ContainsKey("method"))
            {
                keyValuePairs.Add("method", CurrentLoginData.method);
            }
            string method = keyValuePairs["method"]?.ToString();
            if (string.IsNullOrEmpty(method))
            {
                LoginHandler.GetHandler(method).DoLogin(method, keyValuePairs, (code, ext, msg) =>
                {
                    if (ext != null)
                    {
                        keyValuePairs["ext"] = ext;
                    }
                    API.Post(APIPath.SYNC_INFO, keyValuePairs, callback);
                });
            }
            else
            {
                callback?.Invoke((int)RXErrorCode.LoginError, null, "login method null error");
            }

        }
        private static void HandlePassword(ref Dictionary<string, object> keyValuePairs)
        {
            if (keyValuePairs.ContainsKey("password"))
            {
                keyValuePairs["password"] = CryptoUtility.GetMD5(keyValuePairs["password"]?.ToString());
            }
        }

        public void RefreshCurrentAccessToken(MonoBehaviour mono, string refresh, Action<int, AccessToken, string> callback)
        {
            RXWebRequest rXWebRequest = RXWebRequest.Create(APIPath.REFRESH_TOKEN);
            IDictionary<string, string> header = rXWebRequest.Headers ?? new Dictionary<string, string>();
            header["ruixue-refreshtoken"] = refresh ?? CurrentLoginData.Token?.refresh;
            rXWebRequest.Headers = header;
            rXWebRequest.PostAsync(mono, RXUtility.ToRXCallback(TokenHandler(callback)));
        }


        private Action<int, AccessToken, string> TokenHandler(Action<int, AccessToken, string> callback)
        {
            return (code, data, msg) =>
            {
                if (code == 0 && data != null)
                {
                    CurrentLoginData.Token = data;
                    PlatformProvider.Current.UpdateToken(CurrentLoginData.Token?.ToJson());
                }

                callback?.Invoke(code, data, msg);
            };
        }
        private RXCallback<LoginData> LoginHander(MonoBehaviour mono, RXCallback<LoginData> callback)
        {
            return (ret, e) =>
            {
                var code = ret.code;
                var data = ret.data;
                var msg = ret.msg;
                if (code == 0 && data != null)
                {
                    CurrentLoginData = data;
                    CDKeyAPI.Instance.Init(data.cp_user_id, data.IsAnchor);
                    // BillingManager.Instance.RestorePurchase(mono);
                }
                // callback?.Invoke(code, data, msg);
                RXUtility.InvokeCallback(callback, code, data, msg);
            };

        }
        private RXCallback<LoginData> LoginExtHandler(MonoBehaviour mono, Dictionary<string, object> keyValuePairs, RXCallback<LoginData> callback)
        {
            return (ret, e) =>
                {
                    var code = ret.code;
                    var data = ret.data;
                    var msg = ret.msg;
                    if (code == 0 && data != null)
                    {
                        PlatformProvider.Current.UpdateLoginData(data?.ToJson());
                        CurrentLoginData = data;
                        CDKeyAPI.Instance.Init(data.cp_user_id, data.IsAnchor);
                        bool needBinding = false;

                        Dictionary<string, object> ext = keyValuePairs.ContainsKey("ext") ? keyValuePairs["ext"] as Dictionary<string, object> : null;
                        if (ext?.TryGetValue("needBinding", out object rawNeedBinding) ?? false)
                        {
                            needBinding = Convert.ToBoolean(rawNeedBinding);
                        }
                        data.binding = needBinding;
                        if (needBinding)
                        {
                            string teamPlayerId = ext != null && ext.ContainsKey("teamPlayerId") ? ext["teamPlayerId"]?.ToString() : null;
                            PlatformProvider.Current.GamePlayerBindPlayerOnUI(data.openid, teamPlayerId, (json) =>
                            {
                                HadoopManager.Instance.Track(mono, "BindPlayer", RXUtility.JsonToDictionary(json));
                                Dictionary<string, object> res = RXUtility.JsonToDictionary(json);
                                int codeb = (int)(res.TryGetValue("code", out object codeObj) && codeObj is long v ? v : -1);
                                if (codeb == 0)
                                {
                                    HandleVerifyPlayer(mono, data, callback);
                                }
                                else
                                {
                                    string message = res.ContainsKey("message") ? res["message"] as string : null;
                                    // callback?.Invoke(codeb, null, message);
                                    RXUtility.InvokeCallback(callback, codeb, null, message);

                                }
                            });
                        }
                        else
                        {
                            HandleVerifyPlayer(mono, data, callback);
                        }
                    }
                    else
                    {
                        // callback?.Invoke(code, data, msg);
                        RXUtility.InvokeCallback(callback, code, data, msg);

                    }
                };
        }

        private static void HandleVerifyPlayer(MonoBehaviour mono, LoginData data, RXCallback<LoginData> callback)
        {
            PlatformProvider.Current.GamePlayerVerifyLocalPlayerOnUI(data.openid, data.IsRealName, (json) =>
            {
                Dictionary<string, object> res = RXUtility.JsonToDictionary(json);
                int codeb = (int)(res.TryGetValue("code", out object codeObj) && codeObj is long v ? v : -1);
                string msg = res.ContainsKey("message") ? res["message"] as string : null;
                // callback?.Invoke(codeb, data, msg);
                RXUtility.InvokeCallback(callback, codeb, data, msg);

            });
            // BillingManager.Instance.RestorePurchase(mono);
        }

        #region passport
        static readonly string CLIP_KEY = "type=rx&";

        public Dictionary<string, object> GetClipDataDic()
        {
            Dictionary<string, object> clipDic = new();
            string clip = DeviceUtility.GetClipboard();
            if (clip.StartsWith(CLIP_KEY))
            {
                string[] arrs = clip[CLIP_KEY.Length..].Split("&");
                Array.ForEach(arrs, item =>
                {
                    if (item.Contains("="))
                    {
                        string[] kv = item.Split("=");
                        if (kv != null && kv.Length > 1)
                        {
                            clipDic.TryAdd(kv[0], WebUtility.UrlDecode(kv[1]));
                        }
                    }
                });
            }
            return clipDic;
        }

        private bool isActivated = false;
        public void Activate(Dictionary<string, object> keyValuePairs = null, RXCallback<object> callback = null)
        {
            if (!isActivated && CurrentLoginData?.LoginCount <= 0)
            {
                isActivated = true;
                keyValuePairs ??= new();
                Dictionary<string, object> dic = GetClipDataDic();
                if (dic.ContainsKey("source_ad") || (dic.ContainsKey("user_source") && "ad".Equals(dic["user_source"])))
                {
                    keyValuePairs.TryAdd("source_ad", dic);
                }


                RXWebRequest rXWebRequest = RXWebRequest.Create(APIPath.FIRST_ACTIVATED);

                rXWebRequest.SetPostData(keyValuePairs);

                rXWebRequest.PostAsync(callback);
            }
        }

        public void Register(MonoBehaviour mono, RegisterArgs args, Action<int, object, string> callback)
        {
            API.Post(APIPath.REGISTER, args.HandPasswordHash(), callback);
        }
        public void SendCaptcha(MonoBehaviour mono, SendCaptchaArgs args, RXCallback<object> callback)
        {
            if (PlatformProvider.Current.SupportsNativeSendCaptcha)
            {
                PlatformProvider.Current.SendCaptcha(args?.ToJson(), (json) =>
                {
                    var ret = RXUtility.JsonToObject<RXResult<object>>(json);
                    callback?.Invoke(ret);
                });
                return;
            }
            var req = RXWebRequest.Create(APIPath.SEND_CAPTCHA);
            req.SetPostData(args);
            req.PostAsync(mono, callback);
        }
        public void VerifyCaptcha(MonoBehaviour mono, Dictionary<string, object> keyValuePairs, Action<int, object, string> callback)
        {
            API.Post(APIPath.VERIFY_CAPTCHA, keyValuePairs, callback);
        }


        public void BindPhone(MonoBehaviour mono, BindPhoneArgs args, Action<int, object, string> callback)
        {
            SendRequest(mono, APIPath.BIND_PHONE, args.HandPasswordHash(), callback);
        }

        public void UnBindPhone(MonoBehaviour mono, UnBindPhoneArgs args, Action<int, object, string> callback)
        {
            SendRequest(mono, APIPath.UNBIND_PHONE, args, callback);
        }
        public void ChangeBindPhone(MonoBehaviour mono, ChangePasswordArgs args, Action<int, object, string> callback)
        {
            SendRequest(mono, APIPath.CHANGE_PHONE, args, callback);
        }
        public void BindEmail(MonoBehaviour mono, BindEmailArgs args, Action<int, object, string> callback)
        {
            SendRequest(mono, APIPath.BIND_EMAIL, args.HandPasswordHash(), callback);
        }
        public void UnBindEmail(MonoBehaviour mono, UnBindEmailArgs args, Action<int, object, string> callback)
        {
            SendRequest(mono, APIPath.UNBIND_EMAIL, args, callback);
        }
        public void ChangePassword(MonoBehaviour mono, ChangePasswordArgs args, Action<int, object, string> callback)
        {
            SendRequest(mono, APIPath.CHANGE_PWD, args.HandPasswordHash(), callback);
        }


        public void ResetPassword(MonoBehaviour mono, ResetPasswordArgs args, Action<int, object, string> callback)
        {
            SendRequest(mono, APIPath.RESET_PWD, args.HandPasswordHash(), callback);
        }

        public void RealAuth(MonoBehaviour mono, RealAuthArgs args, Action<int, object, string> callback)
        {
            SendRequest(mono, APIPath.CERTIFICATION, args, callback);
        }

        public void GetIIFAARedirectURL(MonoBehaviour mono, string appName, string thirdPartSchema, Action<int, object, string> callback)
        {
            string resolvedThirdPartSchema = ResolveIifaaThirdPartSchema(thirdPartSchema);
            if (string.IsNullOrEmpty(resolvedThirdPartSchema))
            {
                Log.E("IIFAA third_part_schema is empty, check init config channel.sh");
            }

            var body = new Dictionary<string, object>
            {
                ["app_name"] = appName ?? string.Empty,
                ["scene_code"] = IIFAA_SCENE_CODE,
                ["third_part_schema"] = resolvedThirdPartSchema ?? string.Empty
            };

            var request = RXWebRequest.Create(APIPath.IIFAA_REDIRECT_URL);
            request.SetPostData(body);
            request.PostAsync(mono, RXUtility.ToRXCallback(callback));
        }

        public void GetIIFAAResult(MonoBehaviour mono, Action<int, object, string> callback)
        {
            GetIIFAAResultWithRetryCount(mono, IIFAA_RESULT_DEFAULT_RETRY_COUNT, callback);
        }

        public void GetIIFAAResultWithRetryCount(MonoBehaviour mono, int retryCount, Action<int, object, string> callback)
        {
            DispatchIifaaResult(mono, Math.Max(0, retryCount), 0, RXUtility.ToRXCallback(callback));
        }

        public void DeregisterCancel(MonoBehaviour mono, Action<int, object, string> callback)
        {
            SendRequest(mono, APIPath.USER_DEREGISTER_CANCEL, null, callback);
        }
        public void GetUserInfo(MonoBehaviour mono, Action<int, object, string> callback)
        {
            SendRequest(mono, APIPath.USER_INFO, null, callback);
        }

        public void UpdateUserInfo(MonoBehaviour mono, UpdateUserInfoArgs args, Action<int, object, string> callback)
        {
            SendRequest(mono, APIPath.UPDATE_USER, args, callback);
        }

        private void DispatchIifaaResult(MonoBehaviour mono, int retryCount, int retriedCount, RXCallback<object> callback)
        {
            var request = RXWebRequest.Create(APIPath.IIFAA_VALIDATE_BY_BIZID);
            request.SetPostData(new Dictionary<string, object>());
            request.PostAsync<object>(mono, (ret, e) =>
            {
                if (ret != null && ret.code == (int)RXErrorCode.Success)
                {
                    ApplyIifaaRealNameResult(ret.data);
                }

                if (ShouldRetryIifaaResult(ret, retryCount, retriedCount))
                {
                    DispatchIifaaResult(mono, retryCount, retriedCount + 1, callback);
                    return;
                }

                callback?.Invoke(ret, e);
            });
        }

        private static bool ShouldRetryIifaaResult(RXResult<object> result, int retryCount, int retriedCount)
        {
            return result?.code == IIFAA_RESULT_RETRY_ERROR_CODE && retriedCount < retryCount;
        }

        private void ApplyIifaaRealNameResult(object data)
        {
            var loginData = CurrentLoginData;
            var json = ToJObject(data);
            if (loginData == null || json == null)
            {
                return;
            }

            loginData.SetRealName(GetOptionalInt(json, "age"), GetOptionalInt(json, "aas"));
            PlatformProvider.Current.UpdateLoginData(loginData.ToJson());
        }

        private static JObject ToJObject(object data)
        {
            try
            {
                return data switch
                {
                    null => null,
                    JObject obj => obj,
                    string json when !string.IsNullOrEmpty(json) => JObject.Parse(json),
                    _ => JObject.FromObject(data)
                };
            }
            catch (Exception e)
            {
                Log.E("IIFAA real auth result parse error: " + e.Message);
                return null;
            }
        }

        private static int? GetOptionalInt(JObject obj, string key)
        {
            var token = obj[key];
            if (token == null || token.Type == JTokenType.Null)
            {
                return null;
            }
            return int.TryParse(token.ToString(), out var value) ? value : null;
        }

        private static string ResolveIifaaThirdPartSchema(string thirdPartSchema)
        {
            string resolvedThirdPartSchema;
            if (!string.IsNullOrEmpty(thirdPartSchema))
            {
                resolvedThirdPartSchema = thirdPartSchema.Trim();
            }
            else
            {
                resolvedThirdPartSchema = GetInitConfigString("sh") ?? GetNestedInitConfigString("ra", "sh");
            }

            return NormalizeIifaaThirdPartSchema(resolvedThirdPartSchema);
        }

        private static string NormalizeIifaaThirdPartSchema(string thirdPartSchema)
        {
            if (string.IsNullOrEmpty(thirdPartSchema) || thirdPartSchema.Contains("://"))
            {
                return thirdPartSchema;
            }
            return thirdPartSchema + "://";
        }

        private static string GetInitConfigString(string key)
        {
            var channel = SDKConfig.Instance.InitData?.channel;
            if (channel == null || !channel.TryGetValue(key, out var raw))
            {
                return null;
            }

            var value = raw?.ToString();
            return string.IsNullOrEmpty(value) ? null : value.Trim();
        }

        private static string GetNestedInitConfigString(string objectKey, string key)
        {
            var channel = SDKConfig.Instance.InitData?.channel;
            if (channel == null || !channel.TryGetValue(objectKey, out var raw))
            {
                return null;
            }

            string value = raw switch
            {
                JObject obj => obj[key]?.ToString(),
                Dictionary<string, object> dict when dict.TryGetValue(key, out var nested) => nested?.ToString(),
                _ => null
            };
            return string.IsNullOrEmpty(value) ? null : value.Trim();
        }

        private static void SendRequest(MonoBehaviour mono, string path, DataBean args, Action<int, object, string> callback)
        {
            RXWebRequest rXWebRequest = RXWebRequest.Create(path);

            rXWebRequest.SetPostData(args);

            rXWebRequest.PostAsync(mono, RXUtility.ToRXCallback(callback));
        }
    }
    #endregion

}