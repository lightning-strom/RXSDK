using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using UnityEngine;
namespace RXSDK
{


    public class HMSLoginImpl : Singleton<HMSLoginImpl>, ILoginHandler
    {
        public void DoLogin(string method, Dictionary<string, object> parm, Action<int, Dictionary<string, object>, string> callback)
        {
#if UNITY_OPENHARMONY &&  (!UNITY_EDITOR)

            HMSAPI.LoginOnUI((json) =>
            {
                Log.D(json);
                Dictionary<string, object> res = JsonConvert.DeserializeObject<Dictionary<string, object>>(json);
                int code = (int)(res.TryGetValue("code", out object codeObj) && codeObj is long v ? v : -1);
                Newtonsoft.Json.Linq.JObject jData = res.ContainsKey("data") ? res["data"] as Newtonsoft.Json.Linq.JObject : null;

                Dictionary<string, object> data = jData?.ToObject<Dictionary<string, object>>();
                if (code == 0 && data != null)
                {
                    data.Add("openid", data["openID"]);
                    data.Add("unionid", data["unionID"]);
                    data.Add("serverAuthCode", data["authorizationCode"]);
                    data.Remove("authorizationCode");
                    data.Remove("openID");
                    data.Remove("unionID");
                }
                
                foreach (var kvp in res)
                {
                    Log.D($"{kvp.Key} Type: {kvp.Value.GetType().Name} value:{kvp.Value}");
                }

                string message = res.ContainsKey("message") ? res["message"] as string : null;
                callback?.Invoke(code, data, message);
            });

#else
            callback?.Invoke(-1, null, $"currnet platform {Application.platform} not impl " + method);
#endif
        }
    }

    public class HMSUnionLoginImpl : Singleton<HMSUnionLoginImpl>, ILoginHandler
    {
        public void DoLogin(string method, Dictionary<string, object> parm, Action<int, Dictionary<string, object>, string> callback)
        {
#if UNITY_OPENHARMONY && (!UNITY_EDITOR)

            Log.D("harmony: " + RXUtility.ObjectToJson(parm));
            HMSAPI.UnionLoginOnUI(RXUtility.ObjectToJson(parm), (json) =>
            {

                Dictionary<string, object> res = JsonConvert.DeserializeObject<Dictionary<string, object>>(json);
                int code = (int)(res.TryGetValue("code", out object codeObj) && codeObj is long v ? v : -1);
                Dictionary<string, object> data = null;
                if (code == 0 && res.ContainsKey("data"))
                {
                    Newtonsoft.Json.Linq.JObject jData = res["data"] as Newtonsoft.Json.Linq.JObject;
                    data = jData?.ToObject<Dictionary<string, object>>();
                    data["version"] = "api12+";
                    // foreach (var kvp in res)
                    // {
                    //     Log.D($"{kvp.Key} Type: {kvp.Value.GetType().Name} value:{kvp.Value}");
                    // }
                }
                string message = res.ContainsKey("message") ? res["message"] as string : null;
                callback?.Invoke(code, data, message);

            });
#else
            callback?.Invoke(-1, null, $"currnet platform {Application.platform} not impl " + method);
#endif
        }
    }

    class HMSUnionLogin2Impl : Singleton<HMSUnionLogin2Impl>, ILogin
    {

        public void DoLogin(UnionLoginArgs unionLoginArgs, RXCallback<LoginData> callback)
        {
#if UNITY_OPENHARMONY && (!UNITY_EDITOR)

            string loginParm = unionLoginArgs.ToJson();
            Log.D("harmony2: " + loginParm);
            HMSAPI.RXLogin(loginParm, (json) =>
            {
                var jsonData = JsonConvert.DeserializeObject<RXResult<LoginData>>(json);
                RXUtility.InvokeCallback(callback, jsonData.code, jsonData.Data, jsonData.Msg);

            });
#else
            RXUtility.InvokeCallback(callback, (int)RXErrorCode.LoginError);
#endif
        }
    }


    public static class HMSAPI
    {
        #if UNITY_OPENHARMONY
        private static OpenHarmonyJSCallback _hmsManagerCallback;

        public static Dictionary<string, Action<string>> actionDic = new();

        // private static OpenHarmonyJSObject _login;
        private static readonly string LOGIN_TYPE = "Login";
        private static readonly string UNION_LOGIN = "UnionLogin";
        private static OpenHarmonyJSObject m_HMSManagerObj = null;
        private static OpenHarmonyJSObject m_HMSLoginManagerObj = null;
        private static OpenHarmonyJSObject m_HMSGameServiceManagerObj = null;
        private static OpenHarmonyJSObject m_HMSGetDataManagerObj = null;
        private static OpenHarmonyJSObject m_HMSPushManagerObj = null;
        private static OpenHarmonyJSObject m_RXAPIManagerObj = null;

        public static void SetCallback(string type, Action<string> callback)
        {
            Log.D($"SetCallback {type}");
            actionDic.Remove(type);
            actionDic.Add(type, callback);
        }

        public static OpenHarmonyJSCallback GetJSCallback()
        {
            _hmsManagerCallback ??= new OpenHarmonyJSCallback(HMSManagerCallback);
            return _hmsManagerCallback;
        }

        public static OpenHarmonyJSObject GetHMSPushManager()
        {
            m_HMSPushManagerObj ??= CreateHMSPushManager();
            return m_HMSPushManagerObj;
        }

        public static OpenHarmonyJSObject GetRXAPIManager()
        {
            m_RXAPIManagerObj ??= CreateRXAPIManager();
            return m_RXAPIManagerObj;
        }

        public static OpenHarmonyJSObject GetHMSIAPManager()
        {
            m_HMSManagerObj ??= CreateHMSIAPManager();
            return m_HMSManagerObj;
        }

        public static OpenHarmonyJSObject GetHMSLoginManager()
        {
            m_HMSLoginManagerObj ??= CreateHMSLoginManager();
            return m_HMSLoginManagerObj;
        }


        public static OpenHarmonyJSObject GetHMSGameServiceManager()
        {
            m_HMSGameServiceManagerObj ??= CreateHMSGameServiceManager();
            return m_HMSGameServiceManagerObj;
        }

        public static OpenHarmonyJSObject GetHMSGetDataManager()
        {
            m_HMSGetDataManagerObj ??= CreateHMSGetDataManager();
            return m_HMSGetDataManagerObj;
        }
        public static OpenHarmonyJSObject CreateHMSPushManager()
        {
            var hMSPushManager = new OpenHarmonyJSClass("HMSPushManager");
            var hMSPushManagerObj = hMSPushManager.CallStatic<OpenHarmonyJSObject>("getInstance");

            return hMSPushManagerObj;
        }

        public static OpenHarmonyJSObject CreateRXAPIManager()
        {
            var hManager = new OpenHarmonyJSClass("RXAPIManager");
            var hManagerObj = hManager.CallStatic<OpenHarmonyJSObject>("getInstance");

            return hManagerObj;
        }

        public static OpenHarmonyJSObject CreateHMSIAPManager()
        {
            var hMSIAPManager = new OpenHarmonyJSClass("HMSIAPManager");
            var hMSIAPManagerObj = hMSIAPManager.CallStatic<OpenHarmonyJSObject>("getInstance");

            return hMSIAPManagerObj;
        }

        public static OpenHarmonyJSObject CreateHMSLoginManager()
        {
            var loginClass = new OpenHarmonyJSClass("HMSLoginManager");
            var hmsLoginManagerObj = loginClass.CallStatic<OpenHarmonyJSObject>("getInstance");

            return hmsLoginManagerObj;
        }

        public static OpenHarmonyJSObject CreateHMSGameServiceManager()
        {
            var hMSGameServiceManager = new OpenHarmonyJSClass("HMSGameServiceManager");
            var hMSGameServiceManagerObj = hMSGameServiceManager.CallStatic<OpenHarmonyJSObject>("getInstance");

            return hMSGameServiceManagerObj;
        }

        public static OpenHarmonyJSObject CreateHMSGetDataManager()
        {
            var hMSGetDataManager = new OpenHarmonyJSClass("HMSGetDataManager");
            var hMSGetDataManagerObj = hMSGetDataManager.CallStatic<OpenHarmonyJSObject>("getInstance");

            return hMSGetDataManagerObj;
        }

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

        public static void ShowPrivacyUI(PrivacyKeyAgrs args, Action<string> callback)
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
            {
                trackData["distinct_id"] = distinctId;
            }
#if UNITY_OPENHARMONY && (!UNITY_EDITOR)
           GetRXAPIManager().Call("TrackUserAction", RXUtility.ObjectToJson(trackData));
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
#else
            Log.D($"currnet platform {Application.platform} not impl ");
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


        public static void InitIAPOnUI()
        {
            GetHMSIAPManager().Call("InitIAPOnUI", GetJSCallback());
        }

        /**
         * 查询商品列表
         * CONSUMABLE：消耗型商品;
         * NONCONSUMABLE：非消耗型商品; 
         */
        public static void QueryIAPListOnUI(string storeType, string[] storeIDList)
        {
            GetHMSIAPManager().Call("QueryIAPListOnUI", storeType, storeIDList, GetJSCallback());
        }

        /// <summary>
        /// 发起购买
        /// </summary>
        /// <param name="storeType">商品类型 CONSUMABLE 消耗型商品|NONCONSUMABLE非消耗型商品</param>
        /// <param name="storeID">商品ID</param>
        /// <param name="GetHMSIAPManager()"></param>
        public static void StartPurchaseOnUI(string storeType, string storeID)
        {
            GetHMSIAPManager().Call("StartPurchaseOnUI", storeType, storeID, GetJSCallback());
        }


        public static void StartPurchaseUI(int storeType, string storeID, string developerPayload, string reservedInfo, Action<string> callback)
        {
            // const param = {
            //   productId: storeId,
            //   productType: storeType,
            //   developerPayload: developerPayload,
            //   reservedInfo: reservedInfo,
            // }

            Dictionary<string, object> param = new()
            {
                {"productId",storeID},
                {"productType",(int)storeType},
                {"developerPayload",developerPayload},
                {"reservedInfo",reservedInfo}
            };
            string jsonParam = RXUtility.ObjectToJson(param);
            SetCallback("StartPurchase", callback);
            GetHMSIAPManager().Call("StartPurchaseUI", jsonParam, GetJSCallback());
        }

        /// <summary>
        /// 核销购买 客户端发货后调用
        /// </summary>
        /// <param name="purchaseToken">发起购买后回调内商品单号Token</param>

        public static void ConsumePurchaseOnUI(string purchaseToken, Action<string> callback)
        {
            SetCallback("ConsumePurchase", callback);
            GetHMSIAPManager().Call("ConsumePurchaseOnUI", purchaseToken, GetJSCallback());
        }

        /// <summary>
        /// 检测已购买服务
        /// </summary>
        /// <param name="storeType">商品类型 CONSUMABLE 消耗型商品|NONCONSUMABLE 非消耗型商品
        ///NONCONSUMABLE 可以检测已购买的非消耗品服务 关卡解锁等 可每次初始化时调用
        ///CONSUMABLE 可以检测是否存在掉单现象 purchaseState 0 时 需要核销
        /// </param>
        public static void CheckOwnedPurchasesOnUI(string storeType, Action<string> callback)
        {
#if UNITY_OPENHARMONY && (!UNITY_EDITOR)
            SetCallback("CheckOwnedPurchases", callback);
            GetHMSIAPManager().Call("CheckOwnedPurchasesOnUI", storeType, GetJSCallback());
#else
            callback?.Invoke("{\"code\":0}");
#endif
        }

        public static void InitGameServiceOnUI(Action<string> callback)
        {
            //todo add init params
#if UNITY_OPENHARMONY && (!UNITY_EDITOR)
            string param = "";
            SetCallback("GamePlayerInit", callback);
            GetHMSGameServiceManager().Call("GamePlayerInitOnUI", param,GetJSCallback());
#else
            callback?.Invoke("{\"code\":0}");
#endif
        }

        public static void GamePlayerSaveOnUI(string thirdOpenId, string gamePlayerId = null)
        {
            Dictionary<string, object> playerInfo = new()
            {
                ["thirdOpenId"] = thirdOpenId,
            };
            if (!string.IsNullOrEmpty(gamePlayerId))
            {
                playerInfo["gamePlayerId"] = gamePlayerId;
            }
            GetHMSGameServiceManager().Call("GamePlayerSaveOnUI", RXUtility.ObjectToJson(playerInfo), GetJSCallback());
        }

        public static void GamePlayerGetLocalOnUI()
        {
            GetHMSGameServiceManager().Call("GamePlayerGetLocalOnUI", GetJSCallback());
        }
        public static void GamePlayerBindPlayerOnUI(string thirdOpenId, string teamPlayerId = null, Action<string> callback = null)
        {
            if (callback != null)
            {
                SetCallback("BindPlayer", callback);
            }
            Dictionary<string, object> playerInfo = new()
            {
                ["thirdOpenId"] = thirdOpenId,

            };
            if (!string.IsNullOrEmpty(teamPlayerId))
            {
                playerInfo["teamPlayerId"] = teamPlayerId;
            }
            GetHMSGameServiceManager().Call("GamePlayerBindPlayerOnUI", RXUtility.ObjectToJson(playerInfo), GetJSCallback());
        }

        public static void GamePlayerUnBindPlayerOnUI(string thirdOpenId, string teamPlayerId, Action<string> callback)
        {
            if (string.IsNullOrEmpty(thirdOpenId))
            {
                string msg = "UnBindPlayer thirdOpenId is null or empty error，please login first";
                Log.D(msg);
                callback?.Invoke("{\"code\":-1 ,\"msg\":" + msg + "}");
                return;
            }
            if (callback != null)
            {
                SetCallback("UnBindPlayer", callback);
            }

            Dictionary<string, object> playerInfo = new()
            {
                ["thirdOpenId"] = thirdOpenId,
            };
            if (!string.IsNullOrEmpty(teamPlayerId))
            {
                playerInfo["teamPlayerId"] = teamPlayerId;
            }
            GetHMSGameServiceManager().Call("GamePlayerUnBindPlayerOnUI", RXUtility.ObjectToJson(playerInfo), GetJSCallback());
        }

        public static void GamePlayerVerifyLocalPlayerOnUI(string openID, bool? isRealName, Action<string> callback)
        {
#if UNITY_OPENHARMONY && (!UNITY_EDITOR)
            openID ??= PassportManager.Instance.CurrentLoginData?.openid;
            isRealName ??= PassportManager.Instance.CurrentLoginData?.IsRealName;
            Dictionary<string, object> playerInfo = new()
            {
                ["thirdOpenId"] = openID,
                ["isRealName"] = isRealName
            };
            string jsonParam = RXUtility.ObjectToJson(playerInfo);
            SetCallback("VerifyLocalPlayer", callback);
            GetHMSGameServiceManager().Call("GamePlayerVerifyLocalPlayerOnUI", jsonParam, GetJSCallback());
#else
            callback?.Invoke("{\"code\":0}");
#endif
        }

        /// <summary>
        /// 查询数据
        /// </summary>
        /// <param name="key">查询key值</param>
        /// <param name="value">未找到或报错的默认值</param>
        public static string GetData(string key, string value)
        {
            try
            {
                var ret = GetHMSGetDataManager().Call<string>("GetData", key, value);
                return ret;
            }
            catch (SystemException e)
            {
                Log.E("Get js data error" + e.Message);
            }

            return "";
        }


        /// <summary>
        /// 查询数据
        /// </summary>
        /// <param name="key">查询key值</param>
        /// <param name="value">未找到或报错的默认值</param>
        public static string GetSdkInfo()
        {
            try
            {
                var ret = GetRXAPIManager().Call<string>("GetSdkInfo");

                return ret;
            }
            catch (SystemException e)
            {
                Log.E("Get js data error" + e.Message);
            }
            return "";
        }
        public static string RegisterToken(Action<string> callback)
        {
            try
            {
                SetCallback("RegisterToken", callback);
                var ret = GetHMSPushManager().Call<string>("RegisterToken", GetJSCallback());
                return ret;
            }
            catch (SystemException e)
            {
                Log.E("Get js data error" + e.Message);
            }

            return "";
        }
        public static string UnRegisterToken(Action<string> callback)
        {
            try
            {
                SetCallback("UnRegisterToken", callback);
                var ret = GetHMSPushManager().Call<string>("UnRegisterToken", GetJSCallback());
                return ret;
            }
            catch (SystemException e)
            {
                Log.E("Get js data error" + e.Message);
            }

            return "";
        }
        public static string BindAlias(string alias)
        {
            try
            {
                var ret = GetHMSPushManager().Call<string>("BindAlias", alias, GetJSCallback());
                return ret;
            }
            catch (SystemException e)
            {
                Log.E("Get js data error" + e.Message);
            }

            return "";
        }
        public static string UnBindAlias(string alias)
        {
            try
            {
                var ret = GetHMSPushManager().Call<string>("UnBindAlias", alias, GetJSCallback());
                return ret;
            }
            catch (SystemException e)
            {
                Log.E("Get js data error" + e.Message);
            }

            return "";
        }


        private static object HMSManagerCallback(params OpenHarmonyJSObject[] args)
        {
            if (args.Length >= 2)
            {
                string type = args[0].As<string>();
                string status = args[1].As<string>();
                string data = args[2].As<string>();
                Log.D("invoke " + type + ": params: " + args[2].As<string>());
                // HMSHelperCallBack?.Invoke(args[0].As<string>(), args[1].As<string>(), args[2].As<string>());
                if (actionDic.ContainsKey(type))
                {
                    actionDic[type]?.Invoke(args[2].As<string>());
                    // actionDic.Remove(type);
                }
                else
                {
                    Log.D("native callback no exists " + type + " : callback: " + actionDic.ToString());
                }
                // int code = string.Equals(args[1].As<string>(), "success", StringComparison.OrdinalIgnoreCase) ? 0 : -1;
                // Dictionary<string, object> ext = JsonConvert.DeserializeObject<Dictionary<string, object>>(args[2].As<string>());
            }
            else
            {
                Log.D("HMSManagerCallback args error length " + args.Length);

            }
            return null;
        }
#endif
    }
}