using System;
using System.Collections.Generic;
using UnityEngine;
using RXSDK.Net;
using RXSDK.Data;
using System.Linq;
using Newtonsoft.Json;

namespace RXSDK
{

    class SDKData : RXResult<InitData>
    {
        public Dictionary<string, object> sdk;
        public InitData Save()
        {
            if (Data != null)
            {
                Data.sdk = sdk;
                return Data?.Save();
            }
            else
            {
                return null;
            }

        }

    }
    [Serializable]
    internal class SDKConfig : Singleton<SDKConfig>
    {
        static readonly string version = Version.INFO;

        protected string productId;
        protected string channelId;
        protected string cpId;
        protected List<string> baseUrls;
        protected bool debugEnable = true;
        public bool IsDebugEnable { get { return debugEnable; } private set { debugEnable = value; } }
        public string CpId { get { return cpId; } private set { cpId = value; } }
        public string ChannelId { get { return channelId; } private set { channelId = value; } }
        public string ProductId { get { return productId; } private set { productId = value; } }
        public List<string> BaseUrls { get { return baseUrls; } private set { baseUrls = value; } }
        public Dictionary<string, object> GameLoginConfig { get; set; }
        public string RegionTag { get { return GameLoginConfig?.GetValueOrDefault("region_tag") as string; } }

        public string FirstBaseUrl
        {
            get
            {
                return baseUrls != null && baseUrls.Count > 0 ? baseUrls[0] : null;
            }
        }
        public string Language { get; set; } = "zh";
        public string SDK_VERSION
        {
            get => InitData?.SdkVersion ?? version;
        }

        public int Encipher
        {
            get; set;
        } = 0;

        public int Platform { get { return DeviceUtility.GetPlatformID(); } }
        public InitData InitData { get; private set; }

        private bool _isInited = false;
        public bool IsInited { get { return _isInited; } }
        // public RXConfig()
        // {
        // }
        internal void Init()
        {
            if (!IsInited)
            {
                InitData = InitData.Load();
                HadoopManager.Instance.Init();
            }
            _isInited = true;
        }
        internal void MoveDomainToFirst(int index)
        {
            if (index > 0 && index < BaseUrls?.Count)
            {
                string u = BaseUrls[index];
                BaseUrls.RemoveAt(index);
                BaseUrls.Insert(0, u);
            }
        }

        internal void Init(MonoBehaviour mono, InitArgs initArgs, RXCallback<string> callback)
        {
            Init();
            BaseUrls = initArgs.baseUrls.Select(url => url.TrimEnd('/')).ToList();
            CpId = initArgs.cpId;
            ProductId = initArgs.productId;
            ChannelId = initArgs.channelId;
            debugEnable = initArgs.debugEnable;
            //  RuntimePlatform rp = Application.platform;
            initArgs.login_config = GameLoginConfig;

#if UNITY_OPENHARMONY && (!UNITY_EDITOR)
            HMSAPI.RXInit(initArgs.ToJson(), (json) =>
            {
                Log.D("init result:" + json);
                try
                {
                    var sdkData = JsonConvert.DeserializeObject<SDKData>(json);
                    ProcessInitData(sdkData);
                    RXUtility.InvokeCallback(callback,sdkData.Code, sdkData.Data?.ToString() ?? string.Empty, sdkData.Msg);

                }
                catch (Exception e)
                {
                    var code = (int)RXErrorCode.InitError;
                    var msg = e?.Message ?? "Unknown error";
                    Log.E("An error occurred during initialization: " + e?.ToString());
                    RXUtility.InvokeCallback(callback,code, null, msg);
                }
            });

#else
            Dictionary<string, object> s1 = new();
            Dictionary<string, object> versions = new()
                {
                    { "version", s1 }
                };
            RXWebRequest rXWebRequest = RXWebRequest.Create(APIPath.SDKCONFIG_INIT, 0);
            rXWebRequest.SetPostData(versions);
            // rXWebRequest.Headers = ObjectUtility.MergeDic<IDictionary<string, string>, string>(rXWebRequest.Headers, GetDefaultHeader());
            rXWebRequest.PostAsync(mono, callback: OnInitCallback(mono, callback));
#endif
        }

        private InitData ProcessInitData(RXResult<InitData> res)
        {
            if (res == null)
            {
                Log.D("Error: RXResult is null");
                return null;
            }
            int code = res.code;
            var data = res.data;
            if (code == 0 && data != null)
            {
                InitData = data?.Save();
            }

            Encipher = Convert.ToBoolean(InitData?.cp?.GetValueOrDefault("of") ?? false) == true ? 1 : 0;
            // Log.D("init encipher val:" + Encipher);
            return data;
        }


        private RXCallback<InitData> OnInitCallback(MonoBehaviour mono, RXCallback<string> callback)
        {
            return (res, e) =>
            {
                int code = res.code;
                var data = res.data;
                var msg = res.msg;
                try
                {
                    ProcessInitData(res);
                    if (code == 0)
                    {
                        PassportManager.Instance.Activate();
#if UNITY_OPENHARMONY && (!UNITY_EDITOR)
                        HMSAPI.InitGameServiceOnUI((json) =>
                        {
                            Log.D(json);
                            Dictionary<string, object> res = JsonConvert.DeserializeObject<Dictionary<string, object>>(json);
                            code = (int)(res.TryGetValue("code", out object codeObj) && codeObj is long v ? v : -1);
                            // Newtonsoft.Json.Linq.JObject jData = res.ContainsKey("data") ? res["data"] as Newtonsoft.Json.Linq.JObject : null;
                            // Dictionary<string, object> data1 = jData?.ToObject<Dictionary<string, object>>();
                            if (code != 0)
                            {
                                msg = json;
                            }
                            callback?.Invoke(new RXResult<string> { code = code, data = data?.ToJson(), msg = msg }, e);
                        });
                        return;
      
#endif
                    }
                    callback?.Invoke(new RXResult<string> { code = code, data = data?.ToJson(), msg = msg }, e);
                }
                catch (Exception e1)
                {
                    code = (int)RXErrorCode.InitError;
                    msg = e?.Message;
                    Log.E("An error occurred:" + e?.Message);
                    callback?.Invoke(new RXResult<string> { code = code, data = data?.ToJson(), msg = msg }, e1);
                }
            };
        }

        public Dictionary<string, string> GetConfig()
        {
            Dictionary<string, string> dic = new()
            {
                { "cpid", CpId},
                { "product_id", ProductId},
                { "channel_id", channelId},
                { "platform_id", DeviceUtility.GetPlatformID().ToString()},
                { "devicecode", DeviceUtility.GetDeviceCode()}
            };
            return dic;
        }

    }

}