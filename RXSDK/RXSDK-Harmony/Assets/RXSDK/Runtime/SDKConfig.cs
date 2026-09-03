using System;
using System.Collections.Generic;
using UnityEngine;
using RXSDK.Net;
using RXSDK.Data;
using RXSDK.Platform;
using System.Linq;

namespace RXSDK
{

    class SDKData : RXResult<InitData>
    {
        public Dictionary<string, object> sdk;
        public InitData Save()
        {
            if (Data == null) return null;
            Data.sdk = sdk;
            return Data.Save();
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
        public bool IsDebugEnable { get => debugEnable; private set => debugEnable = value; }
        public string CpId { get => cpId; private set => cpId = value; }
        public string ChannelId { get => channelId; private set => channelId = value; }
        public string ProductId { get => productId; private set => productId = value; }
        public List<string> BaseUrls { get => baseUrls; private set => baseUrls = value; }

        public string RegionTag { get; internal set; }
        public string CpRoleId { get; internal set; }

        public string FirstBaseUrl => baseUrls != null && baseUrls.Count > 0 ? baseUrls[0] : null;
        public string Language { get; set; } = "zh";
        public string SDK_VERSION
        {
            get => InitData?.SdkVersion ?? version;
        }

        public int Encipher
        {
            get; set;
        } = 0;

        public int Platform => DeviceUtility.GetPlatformID();
        public InitData InitData { get; private set; }

        private bool _isInited;
        public bool IsInited => _isInited;

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
            initArgs.cpRoleId ??= CpRoleId;
            initArgs.regionTag ??= RegionTag;

            PlatformProvider.Set(PlatformFactory.CreateForCurrentPlatform());

            if (PlatformProvider.Current.SupportsNativeSdkInit)
            {
                PlatformProvider.Current.RXInit(initArgs.ToJson(), (json) =>
                {
                    Log.D("init result:" + json);
                    int code;
                    string data;
                    string msg;
                    try
                    {
                        var sdkData = RXUtility.JsonToObject<SDKData>(json);
                        ProcessInitData(sdkData);
                        code = sdkData.Code;
                        data = sdkData.Data?.ToString() ?? string.Empty;
                        msg = sdkData.Msg;
                    }
                    catch (Exception e)
                    {
                        Log.E("An error occurred during initialization: " + e?.ToString());
                        code = (int)RXErrorCode.InitError;
                        data = null;
                        msg = e?.Message ?? "Unknown error";
                    }

                    RXUtility.InvokeCallback(callback, code, data, msg);
                });
                return;
            }

            var versions = new Dictionary<string, object> { { "version", new Dictionary<string, object>() } };
            var rXWebRequest = RXWebRequest.Create(APIPath.SDKCONFIG_INIT, 0);
            rXWebRequest.SetPostData(versions);
            rXWebRequest.PostAsync(mono, callback: OnInitCallback(mono, callback));
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
                InitData = data.Save();

            Encipher = (InitData?.cp?.GetValueOrDefault("of") is true) ? 1 : 0;
            return data;
        }


        private RXCallback<InitData> OnInitCallback(MonoBehaviour mono, RXCallback<string> callback)
        {
            return (res, e) =>
            {
                int code = res.code;
                var data = res.data;
                var msg = res.msg;
                Exception err = e;
                try
                {
                    ProcessInitData(res);
                    if (code == 0)
                    {
                        PassportManager.Instance.Activate();
                        if (PlatformProvider.Current.SupportsNativeSdkInit)
                        {
                            PlatformProvider.Current.InitGameServiceOnUI((json) =>
                            {
                                Log.D(json);
                                int gsCode;
                                string gsMsg = msg;
                                try
                                {
                                    var gsRes = RXUtility.JsonToObject<Dictionary<string, object>>(json);
                                    gsCode = (int)(gsRes != null && gsRes.TryGetValue("code", out object codeObj) && codeObj is long v ? v : -1);
                                    if (gsCode != 0 && !string.IsNullOrEmpty(json)) gsMsg = json;
                                }
                                catch (Exception e2)
                                {
                                    Log.E("An error occurred during game service init: " + e2);
                                    gsCode = (int)RXErrorCode.InitError;
                                    gsMsg = e2.Message;
                                }
                                callback?.Invoke(new RXResult<string> { code = gsCode, data = data?.ToJson(), msg = gsMsg }, e);
                            });
                            return;
                        }
                    }
                }
                catch (Exception e1)
                {
                    Log.E("An error occurred during initialization: " + e1);
                    code = (int)RXErrorCode.InitError;
                    msg = e1.Message;
                    err = e1;
                }
                callback?.Invoke(new RXResult<string> { code = code, data = data?.ToJson(), msg = msg }, err);
            };
        }

        public Dictionary<string, string> GetConfig() => new()
        {
            { "cpid", CpId },
            { "product_id", ProductId },
            { "channel_id", channelId },
            { "platform_id", DeviceUtility.GetPlatformID().ToString() },
            { "devicecode", DeviceUtility.GetDeviceCode() }
        };

    }

}