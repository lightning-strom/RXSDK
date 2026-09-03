using System;
using System.Collections.Generic;

namespace RuiXue.Impl
{
    internal interface IRuiXueSdk
    {
        /// <summary>
        ///     Log开启
        /// </summary>
        /// <param name="logEnabled"></param>
        void SetLogEnable(bool logEnabled);

        /// <summary>
        /// 初始化SDK
        /// </summary>
        /// <param name="cpid"></param>
        /// <param name="productid"></param>
        /// <param name="channelid"></param>
        /// <param name="urls"></param>
        /// <param name="callBack"></param>
        void Initialize(string cpid, string productid, string channelid, List<string> urls,
            RequestResponseDelegate onSuccess, RequestErrorDelegate onFail);

        /// <summary>
        /// 初始化SDK (配置文件)
        /// </summary>
        /// <param name="rxSdkInitConfig">初始化数据配置</param>
        /// <param name="onResponse">成功回调方法</param>
        /// <param name="onError">失败回调方法</param>
        void Initialize(RXSdkInitConfig rxSdkInitConfig, RequestResponseDelegate onResponse, RequestErrorDelegate onError);

        /// <summary>
        ///     设置子渠道
        /// </summary>
        /// <param name="subChannelId"></param>
        void SetSubChannelId(string subChannelId);

        /// <summary>
        ///     设置游戏角色信息
        /// </summary>
        /// <param name="roleId">游戏角色 id</param>
        /// <param name="regionTag">区服信息</param>
        void SetGameInfo(string roleId, string regionTag);

        /// <summary>
        /// 设置第三方渠道游戏角色信息。
        /// Android 使用完整字段，iOS 回退为 roleId/serverId。
        /// </summary>
        /// <param name="gameInfo">完整游戏角色信息</param>
        void SetThirdGameInfo(GameInfo gameInfo);

        /// <summary>
        ///     查询游戏角色信息
        /// </summary>
        /// <param name="onResponse">成功回调方法</param>
        /// <param name="onError">失败回调方法</param>
        void SearchGameAccount(RequestResponseDelegate onResponse, RequestErrorDelegate onError);

        /// <summary>
        ///     绑定第三方账号
        /// </summary>
        /// <param name="ext">绑定参数，包含 method、scene 等字段</param>
        /// <param name="onResponse">成功回调方法</param>
        /// <param name="onError">失败回调方法</param>
        void BindAccount(Dictionary<string, object> ext, RequestResponseDelegate onResponse, RequestErrorDelegate onError);

        /// <summary>
        ///     获取 IIFAA 支付宝授权跳转地址
        /// </summary>
        /// <param name="appName">应用名称</param>
        /// <param name="thirdPartSchema">第三方回调 schema</param>
        /// <param name="onResponse">成功回调方法</param>
        /// <param name="onError">失败回调方法</param>
        void GetIIFAARedirectURL(string appName, string thirdPartSchema, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError);

        /// <summary>
        ///     查询 IIFAA 认证结果
        /// </summary>
        /// <param name="retryCount">310039 错误重试次数</param>
        /// <param name="onResponse">成功回调方法</param>
        /// <param name="onError">失败回调方法</param>
        void GetIIFAAResultWithRetryCount(int retryCount, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError);

        /// <summary>
        ///     查询 IIFAA 认证结果，相比 GetIIFAAResultWithRetryCount 新增 source 参数
        /// </summary>
        /// <param name="source">业务场景，deregister 表示注销场景，传空表示正常认证逻辑</param>
        /// <param name="retryCount">310039 错误重试次数</param>
        /// <param name="onResponse">成功回调方法</param>
        /// <param name="onError">失败回调方法</param>
        void GetIIFAAResultWithSource(string source, int retryCount, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError);


        //void TrackingLifecycle(AndroidJavaObject lifecycleOwnerObj);

        /// <summary>
        ///     设置防沉迷监听
        /// </summary>
        /// <param name="addictDelegate"></param>
        void SetupAddictDelegate(IAntiAddictDelegate addictDelegate);

        /// <summary>
        ///     是否关闭敏感信息采集
        /// </summary>
        /// <param name="disabled"></param>
        void DisableReadSensitiveInfo(bool disabled);

        /// <summary>
        ///     判断用户是否已经点击同意隐私
        /// </summary>
        /// <returns></returns>
        bool IsAgreedPrivacy();

        /// <summary>
        ///     通知sdk已同意隐私协议
        /// </summary>
        /// <param name="callback"></param>
        void SetPrivacyAgree(PrivacyAgreeDelegate callback);

        /// <summary>
        ///     设置语言
        /// </summary>
        /// <param name="language"></param>
        void SetLanguage(string language);

        /// <summary>
        ///     设置是否禁止截屏
        /// </summary>
        /// <param name="disable"></param>
        void SetScreenCaptureDisable(bool disable);

        /// <summary>
        ///     自定义接口请求
        /// </summary>
        /// <param name="url"></param>
        /// <param name="header"></param>
        /// <param name="body"></param>
        /// <param name="method"></param>
        /// <param name="needLogin"></param>
        /// <param name="callBack"></param>
        void CreateRequest(string url, Dictionary<string, string> header, Dictionary<string, string> body, HttpMethod method,
            bool needLogin, RequestResponseDelegate onResponse, RequestErrorDelegate onError);
        
        
        public void InitThirdSdk(Dictionary<string, object> map, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError);

        public void InvokeChannelAction(string action, Dictionary<string, object> parameters,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError);
        
        /// <summary>
        /// 全局通用回调
        /// </summary>
        /// <param name="publicDelegate"></param>
        /// <param name="onLogout"></param>
        /// <param name="onSwitchAccount"></param>
        public void SetSdkCallback(PublicDelegate publicDelegate, LogoutDelegate onLogout, SwitchAccountDelegate onSwitchAccount);

        public void ExitApp(ExitConfirmDelegate onExitConfirm, ExitCancelDelegate onExitCancel);

        /// <summary>
        /// 获取邮件列表
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="onResponse"></param>
        public void GetEmailList(string userId, RequestResponseDelegate onResponse, RequestErrorDelegate onError);

        /// <summary>
        /// 删除邮件
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="type"></param>
        /// <param name="mailId"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void DeleteEmail(string userId, int type, int mailId, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError);

        /// <summary>
        /// 获取邮件详情
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="mailId"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void GetEmailDetail(string userId, int mailId,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError);

        /// <summary>
        /// 获取附件
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="type"></param>
        /// <param name="mailId"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void GetEmailAward(string userId, int type, int mailId,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError);

        /// <summary>
        /// 获取公告
        /// </summary>
        /// <param name="limit"></param> 获取条数
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void GetAnnouncement(int limit, RequestResponseDelegate onResponse, RequestErrorDelegate onError);

        /// <summary>
        /// 获取临时维护公告
        /// </summary>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void GetTempNotice(RequestResponseDelegate onResponse, RequestErrorDelegate onError);


        /// <summary>
        /// 创建意见反馈
        /// </summary>
        /// <param name="content">返回内容</param>
        /// <param name="attachments">上传附件</param>
        /// <param name="phone">电话号</param>
        /// <param name="tags">标签标识， 游戏透传</param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void FeedbackCreate(string content, string[] attachments, string phone, string[] tags,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError);
        
        /// <summary>
        /// 获取列表
        /// </summary>
        /// <param name="page">页数， 从1开始</param>
        /// <param name="size">每页大小</param>
        /// <param name="status">1 未处理 2已处理</param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void GetFeedbackList(int page, int size, int status, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError);

        /// <summary>
        /// 获取反馈详情
        /// </summary>
        /// <param name="id">反馈id</param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void GetFeedbackDetail(int id, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError);

        /// <summary>
        /// 领取道具
        /// </summary>
        /// <param name="id">反馈id</param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void FeedbackGetprop(int id, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError);

        /// <summary>
        /// 获取达人游戏内显示福利码
        /// </summary>
        /// <param name="authRefresh">是否自动刷新</param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void GetPromoDisplayKEY(bool authRefresh, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError);
        
        /// <summary>
        /// 兑换福利码
        /// </summary>
        /// <param name="cdKey">福利码</param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void ExchangePromoCDKEY(string cdKey, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError);
        
        /// <summary>
        /// 获取设备码（设备唯一标识）
        /// </summary>
        /// <param name="onResponse"></param>
        public void GetDeviceCode(RequestResponseDelegate onResponse);

        /// <summary>
        /// 获取客户端随机生成的 distinctId
        /// </summary>
        /// <param name="onResponse"></param>
        public void GetDistinctId(RequestResponseDelegate onResponse);

        /// <summary>
        /// 展示图形验证码
        /// </summary>
        /// <param name="appId"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void ShowCaptchaVerifyUI(string appId, RequestResponseDelegate onResponse, RequestErrorDelegate onError);

        /// <summary>
        /// 查询是否支持免密支付
        /// </summary>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void CheckQuickAp(RequestResponseDelegate onResponse, RequestErrorDelegate onError);

        /// <summary>
        /// 向渠道合规系统上报充值金额（单位：分），建议在服务端到账确认后调用。
        /// </summary>
        public void SubmitChannelPayment(int amountFen, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError);

        /// <summary>
        /// 上报充值金额；overrideFields 可补充 trade_no/order_no 等字段。
        /// </summary>
        public void SubmitChannelPayment(int amountFen, Dictionary<string, object> overrideFields,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError);

        /// <summary>
        /// 支付前检查渠道充值限额（单位：分）。
        /// </summary>
        public void CheckChannelPaymentLimit(int amountFen, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError);

        /// <summary>
        /// 设置自定义错误消息提示
        /// </summary>
        /// <param name="errorMsgMap">错误消息字典</param>
        public void configErrorMsg(Dictionary<string, object> errorMsgMap);

        /// <summary>
        /// 判断 login_openid 是否失效
        /// </summary>
        /// <returns>login_openid true 失效， false 有效</returns>
        public bool LoginOpenidExpireInvalid();
        
        /// <summary>
        /// 设置密码等级
        /// </summary>
        /// <returns>type 密码强度等级枚举</returns>
        public void SetPasswordStrength(RXPasswordStrength type);
        
        /// <summary>
        /// 设置密码正则
        /// 需要先将密码强度设置为自定义
        /// </summary>
        /// <returns>type 密码强度等级枚举</returns>
        public void SetPwdPattern(string pattern);
        
        /// <summary>
        /// 设置地区
        /// </summary>
        /// <returns>area 地区</returns>
        public void SetArea(string area);
    }
}