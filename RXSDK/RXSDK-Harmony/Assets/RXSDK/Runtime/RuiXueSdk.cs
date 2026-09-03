using System;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;
using RXSDK.Net;
using RXSDK.Platform;
using UnityEngine;

namespace RXSDK
{
    /// <summary>
    /// 瑞雪 SDK 统一门面，对外静态 API。实现按区域拆分为多个 partial 文件便于维护。
    /// </summary>
    public partial class RuiXueSdk : MonoBehaviour
    {
        [HideInInspector]
        readonly SDKConfig configs = SDKConfig.Instance;

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

        public static bool IsInited => SDKConfig.Instance.IsInited;
        public static ISocial SocialAPI => RXSDK.SocialAPI.Instance;
        public static IRanking RankingAPI => RXSDK.RankingAPI.Instance;
        public static IOperationAPI OperationAPI => RXSDK.OperationAPI.Instance;
        public static IPush PushAPI => PushManager.Instance;
        public static IShare ShareAPI => RXSDK.ShareAPI.Instance;
        public static string OpenId => PassportManager.Instance.OpenId;
        public static string DistinctId => PassportManager.Instance.GetDistinctId();
        public static int Encipher { set => SDKConfig.Instance.Encipher = value; }

        public static void SetGameInfo(string cpRoleId, string regionTag)
        {
            SDKConfig.Instance.CpRoleId = cpRoleId;
            SDKConfig.Instance.RegionTag = regionTag;
        }

        #region Lifecycle

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
        }

        void OnDestroy()
        {
            if (instance == this)
                instance = null;
        }

        /// <summary>推送/Intent 等外部唤起时传入 want 数据，用于上报通知状态等。</summary>
        public void OnWant(string want)
        {
            if (string.IsNullOrEmpty(want)) return;
            Log.D("rxsdk OnWant: " + want);
            try
            {
                var taskId = JObject.Parse(want)["task_id"]?.ToString();
                if (!string.IsNullOrEmpty(taskId))
                    PushManager.Instance.ReportNotifyStatus(taskId);
            }
            catch (Exception ex)
            {
                Log.E("OnWant parse error: " + ex.Message);
            }
        }

        #endregion

        #region Init

        [Obsolete("Use RXCallback<string> overload.")]
        public static void Init(InitArgs args, Action<int, string, string> callback)
        {
            Instance.InitSdk(args, RXUtility.ToRXCallback(callback));
        }

        public static void Init(InitArgs args, RXCallback<string> callback)
        {
            Instance.InitSdk(args, callback);
        }

        [Obsolete("Use RXCallback<string> overload.")]
        public static void Init(string cpId, string productId, string channelId, string[] baseUrls, Action<int, string, string> callback)
        {
            Instance.InitSdk(cpId, productId, channelId, baseUrls, callback);
        }

        public void InitSdk(InitArgs args, RXCallback<string> callback)
        {
            configs?.Init(this, args, callback);
        }

        [Obsolete("Use RXCallback<string> overload.")]
        public void InitSdk(string cpId, string productId, string channelId, string[] baseUrls, Action<int, string, string> callback)
        {
            var initArgs = new InitArgs
            {
                cpId = cpId,
                productId = productId,
                channelId = channelId,
                baseUrls = baseUrls
            };
            configs?.Init(this, initArgs, RXUtility.ToRXCallback(callback));
        }

        #endregion
    }
}
