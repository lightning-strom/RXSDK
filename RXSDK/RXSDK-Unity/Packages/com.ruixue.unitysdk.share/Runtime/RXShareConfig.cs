using System.Collections.Generic;

namespace RuiXue.Share
{
    public class RXShareConfig
    {
        public string func;       //"埋点标识"     // string
        public string platform;       //"分享平台" // string
        public string region;      //"地区码"     // string
        public string transmits;      //"透传参数，原样返回"    // string
        public string protocol_ios;      //"iOS唤醒协议"         // string
        public string protocol_android;      //"android唤醒协议" // string
        public string use_scheme;      //"由cp控制是否使用游戏协议，如传0则在落地页上操作不会尝试打开应用，直接跳转到对应商店，如传1则会尝试打开应用" // string
        public bool read_cache;      //"是否读取缓存，默认不读取" // bool
        public bool auto_report = true; //是否自动上报
        public int shareScene; // 分享场景
        public string channel;
        public bool useShortUrl = false; // 是否使用短链接
        public Dictionary<string, object> ext; // 自定义参数
        public Dictionary<string, object> properties;
        public string templateId; // 抖音需要
        public string query; //抖音需要
        public string title;
        public string desc;
        public string imageUrl;
        public Dictionary<string, object> extra; // 抖音附加参数 瑞雪小游戏 sdk 是通过这个参数获取的
    }
}