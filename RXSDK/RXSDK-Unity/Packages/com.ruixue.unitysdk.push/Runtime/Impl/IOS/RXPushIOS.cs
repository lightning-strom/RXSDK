using System.Collections.Generic;
using System.Runtime.InteropServices;

#if UNITY_IOS
namespace RuiXue.Push.Impl
{
    internal class RXPushIOS : IRXPush
    {
        public void Init()
        {
            string urlJson = RXJsonUtil.ToJson(RuiXueSdkDriver.CacheInitParamBaseUrlList);
            ios_push_initWithProductId(RuiXueSdkDriver.CacheInitParamProductid, RuiXueSdkDriver.CacheInitParamChannelid, 
                RuiXueSdkDriver.CacheInitParamCpid, urlJson);
        }

        public void Init(string productId, string channelId, string cpid, List<string> urls)
        {
            string urlsJson = RXJsonUtil.ToJson(urls);
            ios_push_initWithProductId(productId, channelId, cpid, urlsJson);
        }

        public void RegisterToken()
        {
            ios_push_registerDeviceToken();
        }

        public void UnRegisterToken()
        {
            ios_push_reliveBindingPushDevice();
        }

        public string GetDeviceToken()
        {
            return ios_push_getDeviceToken();
        }

        public bool IsSupport()
        {
            return true;
        }

        public string GetBrandName()
        {
            return "ios";
        }

        public void BindAlias(string alias)
        {
            ios_push_bindingAlias(alias);
        }

        public void UnBindAlias(string alias)
        {
            ios_push_reliveBinding();
        }
        
        // 分享调度初始化
        [DllImport("__Internal")]
        public static extern void ios_push_initWithProductId(string productId,
            string channelId, string cpid, string baseUrlArrayJson);
        
        // 注册通知
        [DllImport("__Internal")]
        public static extern void ios_push_registerDeviceToken();
        
        // 解绑用户与渠道SDK的关联
        [DllImport("__Internal")]
        public static extern void ios_push_reliveBindingPushDevice();
        
        // 获取DeviceToken
        [DllImport("__Internal")]
        public static extern string ios_push_getDeviceToken();
        
        // 绑定别名
        [DllImport("__Internal")]
        public static extern void ios_push_bindingAlias(string alias);

        // 解绑别名
        [DllImport("__Internal")]
        public static extern void ios_push_reliveBinding();
        
        // 增加用户标签
        [DllImport("__Internal")]
        public static extern void ios_push_addTags(string tags);

        // 移除用户标签
        [DllImport("__Internal")]
        public static extern void ios_push_deleteTags(string tags);
    }
}

#endif