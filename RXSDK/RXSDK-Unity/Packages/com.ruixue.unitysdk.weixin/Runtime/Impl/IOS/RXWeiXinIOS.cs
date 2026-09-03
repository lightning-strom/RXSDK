using System.Collections.Generic;
using System.Runtime.InteropServices;
#if UNITY_IOS
namespace RuiXue.WeiXin.Impl
{
    internal class RXWeiXinIOS:IRXWeiXin
    {
        public void ConfigUniversalLink(string universalLink)
        {
            ios_configUniversallink(universalLink);
        }
        
        public bool IsWXAppInstalled()
        {
            return ios_isWXAppInstalled();
        }

        public bool OpenWXApp()
        {
            LogUtil.WarningNotSupport("OpenWXApp");
            return false;
        }

        public bool OpenMiniProgram(Dictionary<string, object> hashMap, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            string json = RXJsonUtil.ToJson(hashMap);
            ios_openMiniProgram(json);
            
            // TODO: ios 需要返回值
            return true;
        }
        
        // 配置universallink
        [DllImport("__Internal")]
        public static extern void ios_configUniversallink(string universallink);

        // 检测是否安装微信
        [DllImport("__Internal")]
        public static extern bool ios_isWXAppInstalled();
        
        // 跳转到微信并打开小程序
        [DllImport("__Internal")]
        public static extern void ios_openMiniProgram(string jsonDicParams);
    }
}
#endif