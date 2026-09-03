using System.Collections.Generic;
using Newtonsoft.Json;
using UnityEngine;

namespace RXSDK.Data
{

    //{"data":{"event_public_attr":{"public_attr":{},"refresh":600000,"version":"1697786858545"},"advertise_switch":{"switch":2},"pay_third_goods":{"third_goods":{},"version":""}},"code":0}
    public class InitData : DataBean
    {
        public static bool IsInited { get; private set; } = false;
        public Dictionary<string, object> sdk;
        public string SdkVersion { get { return sdk?["version"] as string; } }
        public PublicAttrData event_public_attr;
        public PublicAttrData EventPublicAttr { get { return event_public_attr; } }

        public Dictionary<string, object> advertise_switch;
        public Dictionary<string, object> AdvertiseSwitch { get { return advertise_switch; } }
        public Dictionary<string, object> cp;

        public PayThirdGoods pay_third_goods;
        public PayThirdGoods PayThirdGoods { get { return pay_third_goods; } }

        public static InitData FromJson(string jsonData)
        {
            return JsonConvert.DeserializeObject<InitData>(jsonData);
        }

        public static InitData Load()
        {
            IsInited = true;
            // string cfg = PlayerPrefs.GetString(Constants.INIR_CONFIG_KEY);
            // if (!string.IsNullOrEmpty(cfg) && cfg != "null")
            // {
            //     return FromJson(cfg);
            // }

            return null;
        }
        public InitData Save()
        {
            // string cfg = JsonConvert.SerializeObject(this, Formatting.None, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });
            // Log.D("save InitData:" + cfg);
            // if (!string.IsNullOrEmpty(cfg))
            // {
            //     PlayerPrefs.SetString(Constants.INIR_CONFIG_KEY, cfg ?? "");
            // }
            return this;
        }
    }

    public class PublicAttrData : DataBean
    {
        public Dictionary<string, object> public_attr;
        public int refresh;
        public string version;
        public Dictionary<string, object> PublicAttr { get { return public_attr; } }
        public int Refresh { get { return refresh; } }
        public string Version { get { return version; } }
    }

    public class PayThirdGoods : DataBean
    {
        public Dictionary<string, object> third_goods;
        public Dictionary<string, object> ThirdGoods { get { return third_goods; } }
        public string version;
        public string Veriosn { get { return version; } }

    }
}