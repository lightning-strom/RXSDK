namespace RuiXue.Adjust.Impl
{
    public interface IRXAdjust
    {
        /// <summary>
        /// 初始化
        /// </summary>
        /// <param name="rxAdjustConfig"></param>
        public void Init(RxAdjustConfig rxAdjustConfig);

        /// <summary>
        /// 页面可见
        /// </summary>
        public void OnResume();

        /// <summary>
        /// 页面不可见
        /// </summary>
        public void OnPause();

        /// <summary>
        /// 事件跟踪
        /// </summary>
        /// <param name="rxAdjustEvent"></param>
        public void TrackEvent(RxAdjustEvent rxAdjustEvent);

        /// <summary>
        /// 获取深度链接
        /// </summary>
        /// <returns></returns>
        public string GetData();

        /// <summary>
        /// 深度链接再归因
        /// </summary>
        /// <param name="data"></param>
        public void AppWillOpenUrl(string data);

        /// <summary>
        /// 链接解析
        /// </summary>
        /// <param name="url"></param>
        /// <param name="arr"></param>
        public void ResolveLink(string url, string[] arr);

        /// <summary>
        /// 会话回传参数
        /// </summary>
        /// <param name="key"></param>
        /// <param name="val"></param>
        public void AddSessionCallbackParameter(string key, string val);

        /// <summary>
        /// 移除特定的会话回传参数
        /// </summary>
        /// <param name="key"></param>
        public void RemoveSessionCallbackParameter(string key);

        /// <summary>
        /// 清除所有的会话回传参数
        /// </summary>
        public void ResetSessionCallbackParameters();

        /// <summary>
        /// 新增会话合作伙伴参数
        /// </summary>
        /// <param name="key"></param>
        /// <param name="val"></param>
        public void AddSessionPartnerParameter(string key, string val);

        /// <summary>
        /// 移除会话合作伙伴参数
        /// </summary>
        /// <param name="key"></param>
        public void RemoveSessionPartnerParameter(string key);

        /// <summary>
        /// 清除会话合作伙伴参数
        /// </summary>
        public void ResetSessionPartnerParameters();

        /// <summary>
        /// 启动延迟前，向后端发送消息
        /// </summary>
        public void SendFirstPackages();

        /// <summary>
        /// 直接获取用户归因
        /// </summary>
        /// <returns></returns>
        public RxAdjustAttribution GetAttribution();




    }
}