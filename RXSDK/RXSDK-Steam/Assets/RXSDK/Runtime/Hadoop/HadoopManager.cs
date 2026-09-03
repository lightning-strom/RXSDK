using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using RXSDK.Net;
using UnityEngine;

namespace RXSDK
{
    class HadoopManager : MonoBehaviour
    {
        private readonly string DATA_CACHE_KEY = "rx_track_data";
        public int MaxCount { get; set; } = 100;
        public float TimeInterval { get; set; } = 60.0f;

        public void DeletePublicProperties(string key)
        {
            if (PublicProperties != null && PublicProperties.ContainsKey(key))
                PublicProperties.Remove(key);
        }
        public void UpdatePublicProperties(string eventName, Dictionary<string, object> properties)
        {
            PublicProperties ??= new();
            if (PublicProperties.ContainsKey(eventName))
            {
                PublicProperties[eventName] = properties;
            }
            else
            {
                PublicProperties.Add(eventName, properties);
            }

        }
        public Dictionary<string, Dictionary<string, object>> PublicProperties { get; set; }

        private List<Dictionary<string, object>> _dataCache;
        protected List<Dictionary<string, object>> DataCache
        {
            get
            {
                _dataCache ??= new();
                return _dataCache;
            }
        }

        private static HadoopManager sInstance = null;
        public static HadoopManager Instance
        {
            get
            {
                if (sInstance == null)
                {
                    return sInstance = new GameObject("HadoopManager").AddComponent<HadoopManager>();
                }
                else
                {
                    return sInstance;
                }
            }
        }

        void OnApplicationFocus(bool hasFocus)
        {
            // Log.D($"OnApplicationFocus {hasFocus}");
            if (hasFocus) return;
            Report();
        }

        void Awake()
        {
            if (sInstance == null || sInstance != this)
            {
                sInstance = this;
                Init();
                DontDestroyOnLoad(gameObject);
                // Log.D("HadoopManager DontDestroyOnLoad");
            }
            else
            {
                Destroy(gameObject);
                Log.D("HadoopManager Destroy");
            }
        }
        void Start()
        {
        }

        private void OnEnable()
        {
            // Log.D("RXAnalytics OnEnable");
        }


        // 禁用事件，只执行1 次，在 OnDestroy 事件前执行，或者当该脚本组件被禁用后，也会触发该事件
        private void OnDisable()
        {
            // Log.D("RXAnalytics OnDisable");
        }

        // 销毁事件，只执行 1 次，当脚本所挂载的游戏物体被销毁时执行
        private void OnDestroy()
        {
            // Log.D("RXAnalytics OnDestroy");
            CancelInvoke(nameof(Report));
        }

        public bool IsInited { get; private set; } = false;

        public void Init()
        {
            if (!IsInited)
            {
                IsInited = true;
                string json = PlayerPrefs.GetString(DATA_CACHE_KEY);
                _dataCache = JsonConvert.DeserializeObject<List<Dictionary<string, object>>>(json);
            }
            // Log.D("start time" + TimeInterval);
            Invoke(nameof(Report), TimeInterval);
        }

        public bool TrackAtTime(MonoBehaviour mono, string eventName, Dictionary<string, object> properties, string distinctId = null, string type = null)
        {
            return Track(mono, eventName, properties, distinctId, null, true);
        }

        public bool Track(MonoBehaviour mono, string eventName, Dictionary<string, object> properties, string distinctId = null, string type = null, bool reportAtTime = false)
        {

            if (!IsInited)
            {
                Log.D("no init error");
                return false;
            }
            if (string.IsNullOrEmpty(eventName))
            {
                Log.D("eventName is null");
                return false;
            }

            Dictionary<string, object> pubDic = PublicProperties?[eventName];
            if (pubDic != null && pubDic.Count > 0)
            {
                RXUtility.MergeDictionary(pubDic, ref properties, false);
            }

            if (SDKConfig.Instance.GameLoginConfig != null)
            {
                RXUtility.MergeDictionary(SDKConfig.Instance.GameLoginConfig, ref properties, false, "rx_");
            }

#if UNITY_OPENHARMONY && (!UNITY_EDITOR)
       
            HMSAPI.TrackData(new TrackDataArgs
            {
                event_name = eventName,
                properties = properties,
                distinct_id = distinctId,
                report_at_time = reportAtTime
            });

#else
            Dictionary<string, object> hashMap = GetBody(eventName, distinctId, type);
            hashMap.Add("properties", properties);
            if (AddToCache(hashMap) >= MaxCount || reportAtTime)
            {
                Report(mono);
            }

#endif
            return true;

        }

        private int AddToCache(Dictionary<string, object> hashMap)
        {
            DataCache.Add(hashMap);
            PlayerPrefs.SetString(DATA_CACHE_KEY, JsonConvert.SerializeObject(DataCache));
            return DataCache.Count;
        }
        private int RemoveCache(int count)
        {
            if (count > 0 && count <= DataCache.Count)
            {
                DataCache.RemoveRange(0, count);
                PlayerPrefs.SetString(DATA_CACHE_KEY, JsonConvert.SerializeObject(DataCache, Formatting.None, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore }));
            }
            return DataCache.Count;
        }
        private void Report()
        {
            Report(this);
        }
        private bool Report(MonoBehaviour mono)
        {
            var count = DataCache.Count;
            if (count > 0)
            {
                mono = mono != null ? mono : this;
                CancelInvoke(nameof(Report));

                RXWebRequest rXWebRequest = RXWebRequest.Create(APIPath.TRACK_DATA_API);
                rXWebRequest.SetPostData(DataCache);
                IDictionary<string, string> headers = rXWebRequest.Headers ?? new Dictionary<string, string>();
                headers["ruixue-datacount"] = count.ToString();
                rXWebRequest.Headers = headers;
                rXWebRequest.Compress = true;
                rXWebRequest.NeedLogin = false;
                rXWebRequest.PostAsync(mono, ReportHandler(count));
                return true;
            }
            else
            {
                var name = nameof(Report);
                if (!IsInvoking(name))
                {
                    Invoke(name, TimeInterval);
                }
                return false;
            }
        }

        private Dictionary<string, object> GetBody(string eventName, string distinctId, string type)
        {
            try
            {

                int.TryParse(SDKConfig.Instance.CpId, out int cpid);
                Dictionary<string, object> hashMap = new()
                {
                    { "type", type ?? "track" },                //事件类型（目前默认为 track）
                    { "time", TimeUtility.GetRFC3339Format() }, //事件发生时间，格式为 yyyy-mm-dd hh:ii:ss.fff
                    { "event", eventName },
                    { "uuid", DeviceUtility.GetNewUUID() },
                    { "distinct_id", distinctId ?? PassportManager.Instance.GetDistinctId() },  //用户唯一标识，一般为 OpenID

                    { "devicecode", DeviceUtility.GetDeviceCode() },
                    { "platform_id", DeviceUtility.GetPlatformID() },
                    { "cpid",  cpid },
                    { "product_id", SDKConfig.Instance.ProductId }
                };


                return hashMap;
            }
            catch (Exception)
            {
                return null;
            }
        }

        private RXCallback<string> ReportHandler(int count)
        {
            return (ret, e) =>
            {
                var code = ret.code;
                var data = ret.data;
                var msg = ret.msg;
                if (code == 0)
                {
                    RemoveCache(count);
                }
                if (data != null)
                {
                }
                Invoke(nameof(Report), TimeInterval);
                // callback?.Invoke(code, data, msg);
            };
        }
    }
}