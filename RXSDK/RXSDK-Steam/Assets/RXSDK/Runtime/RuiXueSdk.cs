using System;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;
using RXSDK.Net;
using UnityEngine;

namespace RXSDK
{

    public class RuiXueSdk : MonoBehaviour
    {

        // [Header("SDK Configuration")]
        // [Tooltip("Enable Init SDK Manually")]
        public bool initManually = true;


        // [Tooltip("Enable Log")]
        public bool enableLog = true;

        [HideInInspector]
        SDKConfig configs = SDKConfig.Instance;

        private static RuiXueSdk instance;

        public static RuiXueSdk Instance
        {
            get
            {
                if (instance == null)
                {
                    var go = new GameObject("RuiXueSdk");
                    instance = go.AddComponent<RuiXueSdk>();
                    DontDestroyOnLoad(go);
                }
                return instance;
            }
        }
        public static bool IsInited { get { return SDKConfig.Instance.IsInited; } }
        public static ISocial SocialAPI { get { return RXSDK.SocialAPI.Instance; } }
        public static IRanking RankingAPI { get { return RXSDK.RankingAPI.Instance; } }
        public static IOperationAPI OperationAPI { get { return RXSDK.OperationAPI.Instance; } }
        public static IPush PushAPI { get { return RXSDK.PushManager.Instance; } }
        public static IShare ShareAPI { get { return RXSDK.ShareAPI.Instance; } }
        public static string OpenId { get { return PassportManager.Instance.OpenId; } }
        public static string DistinctId { get { return PassportManager.Instance.GetDistinctId(); } }

        public static int Encipher { set { SDKConfig.Instance.Encipher = value; } }

        public static void SetGameLoginConfig(Dictionary<string, object> value)
        {
            SDKConfig.Instance.GameLoginConfig = value;
        }

        #region  lifecycle
        // [InitializeOnEnterPlayMode]
        // static void OnEnterPlaymodeInEditor(EnterPlayModeOptions options)
        // {
        //     Log.D("Entering PlayMode " + options.HasFlag(EnterPlayModeOptions.DisableDomainReload));
        // }

        // [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.SubsystemRegistration)]
        // [RuntimeInitializeOnLoadMethod]
        // [InitializeOnEnterPlayMode]
        void Awake()
        {
            if (instance != null && instance != this)
            {
                Destroy(gameObject);
                Log.D("RuiXueSdk Destroy duplicate instance");
                return;
            }

            instance = this;
            DontDestroyOnLoad(gameObject);
            Log.D("RuiXueSdk DontDestroyOnLoad");

            if (initManually == false)
            {
                configs?.Init();
                Log.D("RuiXueSdk auto inited");
            }
        }

        // Start is called before the first frame update
        void Start()
        {


        }

        // Update is called once per frame
        void Update()
        {

        }
        // 确认事件, 脚本被加载、启用、禁用、Inspector面板值被修改时, 都会执行一次
        private void OnValidate()
        {
            // Log.D("OnValidate " + this.isActiveAndEnabled);
            if (this.isActiveAndEnabled)
            {
            }
        }

        // 启用事件，只执行 1 次，当脚本组件被启用的时候执行一次
        private void OnEnable()
        {
            // sInstance = this; 移除直接赋值，让 Instance 属性处理实例管理
        }



        // 固定更新事件，每隔 0.02 秒执行一次，所有物理组件相关的更新都在这个事件中处理
        private void FixedUpdate()
        {
            // Log.D("FixedUpdate");
        }



        // 稍后更新事件，每帧执行 1 次，在 Update 事件执行完毕后再执行
        private void LateUpdate()
        {
            // Log.D("LateUpdate");
        }

        // GUI渲染事件，每帧执行 2 次
        private void OnGUI()
        {
            // Log.D("OnGUI");
        }

        // 禁用事件，只执行1 次，在 OnDestroy 事件前执行，或者当该脚本组件被禁用后，也会触发该事件
        private void OnDisable()
        {
            // Log.D("OnDisable");
        }

        // 销毁事件，只执行 1 次，当脚本所挂载的游戏物体被销毁时执行
        private void OnDestroy()
        {
            if (instance == this)
            {
                instance = null;
            }
            // Log.D("OnDestroy");
        }
        void OnApplicationFocus(bool hasFocus)
        {
            // Log.D("rxsdk OnApplicationFocus" + hasFocus);
        }
        void OnApplicationPause(bool hasFocus)
        {
            // Log.D("rxsdk OnApplicationPause" + hasFocus);
        }
        public void OnWant(string want)
        {
            Log.D("rxsdk OnWant :" + want);
            if (!string.IsNullOrEmpty(want))
            {

                JObject j = JObject.Parse(want);
                string task_id = j["task_id"]?.ToString();
                if (!string.IsNullOrEmpty(task_id))
                {
                    PushManager.Instance.ReportNotifyStatus(task_id);
                }
            }
        }
        #endregion



        // [Obsolete("This method callback type is deprecated. Please use RXCallback type instead.")]
        public static void Init(InitArgs args, Action<int, string, string> callback)
        {
            Instance.InitSdk(args, RXUtility.ToRXCallback(callback));
        }

        public static void Init(InitArgs args, RXCallback<string> callback)
        {
            Instance.InitSdk(args, callback);
        }

        // [Obsolete("This method callback type is deprecated. Please use RXCallback type instead.")]
        public static void Init(string cpId, string productId, string channelId, string[] baseUrls, Action<int, string, string> callback)
        {
            Instance.InitSdk(cpId, productId, channelId, baseUrls, callback);
        }
        static void Init(SDKConfig config = null)
        {
            config?.Init();
        }


        public void InitSdk(InitArgs args, RXCallback<string> callback)
        {
            configs?.Init(this, args, callback);

        }
        // [Obsolete("This method callback type is deprecated. Please use RXCallback type instead.")]
        public void InitSdk(string cpId, string productId, string channelId, string[] baseUrls, Action<int, string, string> callback)
        {
            InitArgs initArgs = new()
            {
                cpId = cpId,
                productId = productId,
                channelId = channelId,
                baseUrls = baseUrls
            };
            configs?.Init(this, initArgs, RXUtility.ToRXCallback(callback));
        }

        /// <summary>
        /// 登录
        /// </summary>
        /// <param name="method">登录方式</param>
        /// <param name="keyValuePairs">登录参数</param>

        // [Obsolete("This method callback type is deprecated. Please use RXCallback type instead.")]/// <param name="callback">回调</param>
        public static void Login(LoginMethod method, Dictionary<string, object> keyValuePairs, Action<int, LoginData, string> callback)
        {
            Login(method, keyValuePairs, RXUtility.ToRXCallback(callback));
        }
        public static void Login(LoginMethod method, Dictionary<string, object> keyValuePairs, RXCallback<LoginData> callback)
        {
            PassportManager.Instance.Login(Instance, method.GetString(), keyValuePairs, callback);
        }


        /// <summary>
        ///  鸿蒙union登录
        /// </summary>
        /// <param name="unionLoginArgs">登录参数</param>

        // [Obsolete("This method callback type is deprecated. Please use RXCallback type instead.")]/// <param name="callback"></param>
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
                string errorJson = "{\"code\":-1,\"msg\":\"Missing player information\"}";
                callback?.Invoke(errorJson);
            }
            else
            {
#if UNITY_OPENHARMONY
                HMSAPI.GamePlayerBindPlayerOnUI(thirdOpenId, teamPlayerId, callback);
#endif
            }
        }


        /// <summary>
        /// 调用此接口可以将游戏官方账号与华为teamPlayerId的解绑结果上报给华为游戏服务器。
        /// 该方法可以根据传入的鸿蒙团队玩家 ID 和第三方开放 ID 来解除相应的绑定。
        /// 解除绑定操作完成后，会通过回调函数返回操作结果的 JSON 字符串。
        /// </summary>
        /// <param name="teamPlayerId">华为teamPlayerId。若不指定，可传入 null，默认去瑞雪账号下的tid</param>
        /// <param name="thirdOpenId">第三方开放 ID，用于指定要解除绑定的第三方平台的开放 ID。若不指定，可传入 null，默认取瑞雪openid</param>
        /// <param name="callback">解除绑定操作完成后的回调函数，接受一个字符串类型的参数，该参数为解除绑定操作结果的 JSON 字符串。若不需要回调，可传入 null。</param>
        public static void UnBindPlayer(string teamPlayerId = null, string thirdOpenId = null, Action<string> callback = null)
        {
            thirdOpenId ??= PassportManager.Instance.CurrentLoginData?.openid;
            teamPlayerId ??= PassportManager.Instance.CurrentLoginData?.tid;
            bool binding = (bool)(PassportManager.Instance.CurrentLoginData?.IsBinding);
            Log.D(teamPlayerId + " account binding" + binding);
#if UNITY_OPENHARMONY
            HMSAPI.GamePlayerUnBindPlayerOnUI(thirdOpenId, teamPlayerId, callback);
#endif
        }

        public static void Logout()
        {
            PassportManager.Instance.Logout();
        }

        // [Obsolete("This method callback type is deprecated. Please use RXCallback type instead.")]
        public static void Login(LoginArgs args, Action<int, LoginData, string> callback)
        {
            PassportManager.Instance.Login(Instance, args, RXUtility.ToRXCallback(callback));
        }

        [Obsolete("This method callback type is deprecated. Please use RXCallback type instead.")]
        public static void Pay(string payType, string goodsTag, Dictionary<string, object> keyValuePairs, Action<int, object, string> callback)
        {
            BillingManager.Instance.Pay(Instance, payType, goodsTag, keyValuePairs, RXUtility.ToRXCallback(callback));

        }
        [Obsolete("This method callback type is deprecated. Please use RXCallback type instead.")]
        public static void Pay(PayArgs args, Action<int, object, string> callback)
        {
            BillingManager.Instance.Pay(Instance, args, RXUtility.ToRXCallback(callback));
        }

        public static void Pay(PayArgs args, RXCallback<object> callback)
        {
            BillingManager.Instance.Pay(Instance, args, callback);
        }
        public static void Pay(string payType, string goodsTag, Dictionary<string, object> keyValuePairs, RXCallback<object> callback)
        {
            BillingManager.Instance.Pay(Instance, payType, goodsTag, keyValuePairs, callback);
        }


        // [Obsolete("This method callback type is deprecated. Please use RXCallback type instead.")]
        #region  version api


        public static void UpdateGameVersion(Dictionary<string, object> queryMap, Action<int, object, string> callback)
        {
            UpdateAPI.UpdateGameVersion(queryMap, callback);

        }

        public static void CheckUpdateApp(string version, int region, string type, Dictionary<string, object> queryMap, Action<int, object, string> callback, string method = "GET")
        {
            UpdateAPI.CheckUpdateApp(version, region, type, queryMap, callback, method);

        }

        // [Obsolete("This method callback type is deprecated. Please use RXCallback type instead.")]
        public static void CheckUpdateGame(int gameId, int gameVersion, int gameCheckVersion, Dictionary<string, object> queryMap, Action<int, object, string> callback)
        {
            UpdateAPI.CheckUpdateGame(gameId, gameVersion, gameCheckVersion, queryMap, callback);
        }

        // [Obsolete("This method callback type is deprecated. Please use RXCallback type instead.")]
        public static void CheckUpdateActivity(string activityShortname, int activityVersion, int activityCheckVersion, Dictionary<string, object> queryMap, Action<int, object, string> callback)
        {
            UpdateAPI.CheckUpdateActivity(activityShortname, activityVersion, activityCheckVersion, queryMap, callback);
        }

        #endregion


        public static void Share(RXShareConfig rXShareConfig, RXCallback<object> callback)
        {
            ShareAPI.Share(rXShareConfig, callback);
        }

        #region track
        public static void SetPublicProperties(Dictionary<string, Dictionary<string, object>> publicPro)
        {
            HadoopManager.Instance.PublicProperties = publicPro;
        }
        public static void UpdatePublicProperties(string eventName, Dictionary<string, object> properties)
        {
            HadoopManager.Instance.UpdatePublicProperties(eventName, properties);
        }
        public static void DeletePublicProperties(string key)
        {
            HadoopManager.Instance.DeletePublicProperties(key);
        }
        public static bool Track(string eventName, Dictionary<string, object> keyValuePairs, string distinctId = null)
        {
            return HadoopManager.Instance.Track(Instance, eventName, keyValuePairs, distinctId);
        }
        public static void ReportWindowExposure(Dictionary<string, object> properties, string distinctId = null)
        {
            HadoopManager.Instance.TrackAtTime(Instance, "#window_exposure", properties, distinctId);
        }

        public static void GetOperationScene(RXCallback<object> callback)
        {
            API.Post(APIPath.DATA_OPERATION_SCENE, (Dictionary<string, object>)null, callback);
        }


        #endregion

        // [Obsolete("This method callback type is deprecated. Please use RXCallback type instead.")]
        #region  passport api
        public static void Register(RegisterArgs args, Action<int, object, string> callback)
        {
            PassportManager.Instance.Register(Instance, args, callback);

        }
        // [Obsolete("This method callback type is deprecated. Please use RXCallback type instead.")]
        public static void SendCaptcha(SendCaptchaArgs args, Action<int, object, string> callback)
        {
            PassportManager.Instance.SendCaptcha(Instance, args, RXUtility.ToRXCallback(callback));
        }

        // [Obsolete("This method callback type is deprecated. Please use RXCallback type instead.")]
        public static void VerifyCaptcha(VerifyCaptchaArgs args, Action<int, object, string> callback)
        {
            API.Post(APIPath.VERIFY_CAPTCHA, args, callback);

        }
        // [Obsolete("This method callback type is deprecated. Please use RXCallback type instead.")]
        public static void SyncInfo(Dictionary<string, object> keyValuePairs, Action<int, object, string> callback)
        {
            PassportManager.Instance.SyncInfo(Instance, keyValuePairs, callback);
        }

        // [Obsolete("This method callback type is deprecated. Please use RXCallback type instead.")]
        public static void BindPhone(BindPhoneArgs args, Action<int, object, string> callback)
        {
            PassportManager.Instance.BindPhone(Instance, args, callback);
        }

        // [Obsolete("This method callback type is deprecated. Please use RXCallback type instead.")]
        public static void UnBindPhone(UnBindPhoneArgs args, Action<int, object, string> callback)
        {
            PassportManager.Instance.UnBindPhone(Instance, args, callback);

        }
        // [Obsolete("This method callback type is deprecated. Please use RXCallback type instead.")]
        public static void ChangePhone(ChangePasswordArgs args, Action<int, object, string> callback)
        {
            PassportManager.Instance.ChangeBindPhone(Instance, args, callback);

        }
        // [Obsolete("This method callback type is deprecated. Please use RXCallback type instead.")]
        public static void BindEmail(BindEmailArgs args, Action<int, object, string> callback)
        {
            PassportManager.Instance.BindEmail(Instance, args, callback);

        }
        // [Obsolete("This method callback type is deprecated. Please use RXCallback type instead.")]
        public static void UnBindEmail(UnBindEmailArgs args, Action<int, object, string> callback)
        {
            PassportManager.Instance.UnBindEmail(Instance, args, callback);

        }
        // [Obsolete("This method callback type is deprecated. Please use RXCallback type instead.")]
        public static void ChangePassword(ChangePasswordArgs args, Action<int, object, string> callback)
        {
            PassportManager.Instance.ChangePassword(Instance, args, callback);
        }

        // [Obsolete("This method callback type is deprecated. Please use RXCallback type instead.")]
        public static void ResetPassword(ResetPasswordArgs args, Action<int, object, string> callback)
        {
            PassportManager.Instance.ResetPassword(Instance, args, callback);

        }
        // [Obsolete("This method callback type is deprecated. Please use RXCallback type instead.")]
        public static void GetUserInfo(Action<int, object, string> callback)
        {
            PassportManager.Instance.GetUserInfo(Instance, callback);

        }
        // [Obsolete("This method callback type is deprecated. Please use RXCallback type instead.")]
        public static void UpdateUserInfo(UpdateUserInfoArgs args, Action<int, object, string> callback)
        {
            PassportManager.Instance.UpdateUserInfo(Instance, args, callback);
        }

        // [Obsolete("This method callback type is deprecated. Please use RXCallback type instead.")]
        public static void RealAuth(RealAuthArgs args, Action<int, object, string> callback)
        {
            PassportManager.Instance.RealAuth(Instance, args, callback);

        }
        // [Obsolete("This method callback type is deprecated. Please use RXCallback type instead.")]
        public static void DeregisterCancel(Action<int, object, string> callback)
        {
            PassportManager.Instance.DeregisterCancel(Instance, callback);
        }

        public static string GetSdkVersion()
        {
            return SDKConfig.Instance.SDK_VERSION;
        }

        public static string GetSdkInfo()
        {
#if UNITY_OPENHARMONY
            return HMSAPI.GetSdkInfo();
#else
            return "";
#endif
        }

        #endregion
        /// <summary>
        /// 获取法务信息（条款+未成年保护）
        /// </summary>

        // [Obsolete("This method callback type is deprecated. Please use RXCallback type instead.")]/// <param name="callback"> code 状态码0时成功 data 返回的数据 msg 错误消息 </param>
        public static void Legal(Action<int, object, string> callback)
        {
            Dictionary<string, object> keyValuePairs = new()
            {
                {"channel_id",SDKConfig.Instance.ChannelId},
                {"product_id",SDKConfig.Instance.ProductId},
            };
            API.GetUnAuth(APIPath.LEGAL, keyValuePairs, callback);
        }

        /// <summary>
        /// 获取法务条款
        /// </summary>
        /// <param name="args">法务条款key，多个使用【,】分隔； 例如：00001,00002</param>

        // [Obsolete("This method callback type is deprecated. Please use RXCallback type instead.")]/// <param name="callback"></param>
        public static void LegalTerms(LegalArgs args, Action<int, object, string> callback)
        {
            // IDictionary<string, string> header = SDKConfig.Instance.GetDefaultHeader();
            args.channel_id ??= SDKConfig.Instance.ChannelId;
            args.product_id ??= SDKConfig.Instance.ProductId;
            API.GetUnAuth(APIPath.LEGAL_TERMS, args.ToDictionary(), callback);
        }

        public static bool IsLoggedIn()
        {
            return PassportManager.Instance.IsLoggedIn;

        }
        // [Obsolete("This method callback type is deprecated. Please use RXCallback type instead.")]
        public static void GetPromoDisplayKEY(Action<int, PromoCodeBean, string> callback, bool autoRefresh = false)
        {
            CDKeyAPI.Instance.GetPromoDisplayKEY(callback, autoRefresh);
        }


        // [Obsolete("This method callback type is deprecated. Please use RXCallback type instead.")]
        public static void ExchangePromoCDKEY(string cdKey, Action<int, object, string> callback)
        {
            CDKeyAPI.Instance.ExchangePromoCDKEY(cdKey, RXUtility.ToRXCallback(callback));
        }

        public static IRXRequest CreateRequest(string pathOrUrl)
        {
            return RXWebRequest.Create(pathOrUrl);
        }



        /// <summary>
        /// 用户中心UI
        /// </summary>
        /// <param name="args"></param>
        /// <param name="callback"></param>
        public static void UserCenterUI(UserCenterUIConfig args, Action<string> callback)
        {
#if UNITY_OPENHARMONY
            HMSAPI.OpenUserCenter(args, callback);
#endif

        }
        public static void HelperCenterUI(HelpCenterUIArgs args, Action<string> callback)
        {
#if UNITY_OPENHARMONY
            HMSAPI.OpenHelperCenter(args, callback);
#endif
        }
        public static void ApplyForDeregisterUI(HelpCenterUIArgs args, Action<string> callback)
        {

            WebViewConfig webViewConfig = new()
            {
                title = "账号注销",
                url = APIPath.GetUrl(APIPath.UNREGISTERCONDITION),
                webParams = new WebParams() { custom_params = args.ToJson() }
            };
#if UNITY_OPENHARMONY
            HMSAPI.OpenWebView(webViewConfig, callback);
#endif

            // WebViewManager.Instance.OpenDeregister(args);
        }

        public static void HelpCenterUI(HelpCenterUIArgs args, Action<string> callback)
        {
#if UNITY_OPENHARMONY
            HMSAPI.OpenHelperCenter(args, callback);
#endif
        }
        #region deprecated methods
        [Obsolete("This method is deprecated. Please use other HelpCenterUI  override method instead.")]
        public static void HelpCenterUI(HelpCenterUIArgs args)
        {
            WebViewManager.Instance.OpenHelpCenter(args);
        }
        [Obsolete("This method is deprecated. Please use other ApplyForDeregisterUI  override method instead.")]
        public static void ApplyForDeregisterUI(HelpCenterUIArgs args)
        {
            WebViewManager.Instance.OpenDeregister(args);

        }
        #endregion
        public static void ChatServiceUI(HelpCenterUIArgs args)
        {
            WebViewManager.Instance.OpenChatService(args);
        }

        public static void ProtocolView(string key, string[] keyList, Action<string> callback = null)
        {
            // WebViewManager.Instance.OpenPrivacy(key, keyList);
#if UNITY_OPENHARMONY
            HMSAPI.ShowPrivacyUI(new PrivacyKeyAgrs
            {
                key = key,
                key_list = keyList
            }, callback);
#endif
        }

        public static void TrackUserAction(Dictionary<string, object> trackData, string distinctId = null)
        {
            UserActionTracer.TrackUserAction(trackData, distinctId);
        }

        public static void StopTrackUserAction()
        {
            UserActionTracer.StopTrackUserAction();
        }

    }

}
