using System.Collections.Generic;

namespace RuiXue
{
    public class RXSdkInitConfig
    {
        // CP 唯一 ID，从 7 位数 1000000 开始递增
        public string cpId;
        
        // 瑞雪内部的应用 ID，由各 CP 自行在后台创建，字符串类型
        public string productId;
            
        // 瑞雪内部 CP 某应用的渠道 ID，由各 CP 自行在后台创建，字符串类型
        public string channelId;
        
        // 日志开关
        public bool isLogEnable = true;

        // 是否自动初始化第三方 SDK
        public bool autoInitThird = false;
            
        // 瑞雪域名地址 https://domain.com/ 格式
        public List<string> baseUrlList;
        
        // 首次启动是否展示用户隐私授权页面
        public bool usePrivacy = false;

        // 协议标题
        public string agreementTitle = "用户协议和隐私政策";

        //  是否打开DNS
        public bool isUseDNS = false;

        // 自定义协议键值对
        public Dictionary<string, object> agreementMap;

        // 第三方 SDK 初始化参数
        public Dictionary<string, object> thirdSdkParams;
    }
}