using System.Collections.Generic;

namespace RuiXue.Push.Impl
{
    internal interface IRXPush
    {
        /// <summary>
        /// 初始化
        /// </summary>
        public void Init();
        
        /// <summary>
        /// 初始化
        /// </summary>
        /// <param name="productId"></param>
        /// <param name="channelId"></param>
        /// <param name="cpid"></param>
        /// <param name="urls"></param>
        public void Init(string productId, string channelId, string cpid, List<string> urls);
        
        /// <summary>
        /// 注册瑞雪推送服务（建议瑞雪登录成功后调用一次，不切换账号不用重复调用）
        /// 由于registerToken和瑞雪账号关联绑定，所以请不要在登录前调用
        /// </summary>
        public void RegisterToken();

        /// <summary>
        /// 反注册瑞雪推送服务（建议在登出账号时调用）
        /// </summary>
        public void UnRegisterToken();

        /// <summary>
        /// 服务器生成的推送 token/regId
        /// </summary>
        public string GetDeviceToken();

        /// <summary>
        /// 当前设备是否支持推送 init（）后调用
        /// </summary>
        public bool IsSupport();

        /// <summary>
        /// 当前推送的厂商平台 BRAND
        /// </summary>
        public string  GetBrandName();

        /// <summary>
        /// 开发者可以为指定用户设置别名，然后给这个别名推送消息，效果等同于给RegId推送消息
        /// </summary>
        /// <param name="alias"></param>
        public void BindAlias(string alias);

        /// <summary>
        /// 开发者可以取消指定用户的某个别名，服务器就不会给这个别名推送消息了
        /// </summary>
        /// <param name="alias"></param>
        public void UnBindAlias(string alias);
    }
}
