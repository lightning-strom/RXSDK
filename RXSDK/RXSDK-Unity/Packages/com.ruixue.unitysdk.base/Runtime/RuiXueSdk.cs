using System.Collections.Generic;
using RuiXue.Impl;

namespace RuiXue
{
    public static class RuiXueSdk
    {
        public const string ChannelActionShowSplash = "showSplash";
        public const string ChannelActionShowFloatView = "showFloatView";
        public const string ChannelActionHideFloatView = "hideFloatView";

#if UNITY_ANDROID
        private static readonly IRuiXueSdk _sdk = new RuiXueSdkAndroid();
#elif UNITY_IOS
        private static readonly IRuiXueSdk _sdk = new RuiXueSdkIOS();
#elif UNITY_WEBGL
        private static readonly IRuiXueSdk _sdk = new RuiXueSdkWebGL();
#else
        private static IRuiXueSdk _sdk = new RuiXueSdkNotSupport();
#endif

        /// <summary>
        ///     日志开关
        /// </summary>
        /// <param name="logEnabled"></param>
        public static void SetLogEnable(bool logEnabled)
        {
            _sdk.SetLogEnable(logEnabled);
        }

     
        /// <summary>
        /// SDK 初始化
        /// </summary>
        /// <param name="cpid"></param>
        /// <param name="productid"></param>
        /// <param name="channelid"></param>
        /// <param name="urls"></param>
        /// <param name="onSuccess"></param>
        /// <param name="onFail"></param>
        public static void Initialize(string cpid, string productid, string channelid, List<string> urls,
            RequestResponseDelegate onSuccess, RequestErrorDelegate onFail)
        {
            RuiXueSdkDriver.CacheInitParamCpid = cpid;
            RuiXueSdkDriver.CacheInitParamProductid = productid;
            RuiXueSdkDriver.CacheInitParamChannelid = channelid;
            RuiXueSdkDriver.CacheInitParamBaseUrlList = urls;
            
            _sdk.Initialize(cpid, productid, channelid, urls, onSuccess, onFail);
        }

        /// <summary>
        /// 初始化SDK (配置文件)
        /// </summary>
        /// <param name="rxSdkInitConfig"></param>
        public static void Initialize(RXSdkInitConfig rxSdkInitConfig, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            _sdk.Initialize(rxSdkInitConfig, onResponse, onError);
        }

        /// <summary>
        ///     设置子渠道ID
        /// </summary>
        /// <param name="subChannelId"></param>
        public static void SetSubChannelId(string subChannelId)
        {
            _sdk.SetSubChannelId(subChannelId);
        }

        /// <summary>
        ///     设置游戏角色信息
        /// </summary>
        /// <param name="roleId">游戏角色 id</param>
        /// <param name="regionTag">区服信息</param>
        public static void SetGameInfo(string roleId, string regionTag)
        {
            _sdk.SetGameInfo(roleId, regionTag);
        }

        /// <summary>
        /// 设置第三方渠道游戏角色信息。
        /// Android 上报完整字段；iOS 使用 roleId 和 serverId 更新角色与区服信息。
        /// </summary>
        /// <param name="gameInfo">完整游戏角色信息</param>
        public static void SetThirdGameInfo(GameInfo gameInfo)
        {
            _sdk.SetThirdGameInfo(gameInfo);
        }

        /// <summary>
        ///     查询游戏角色信息
        /// </summary>
        /// <param name="onResponse">成功回调方法</param>
        /// <param name="onError">失败回调方法</param>
        public static void SearchGameAccount(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.SearchGameAccount(onResponse, onError);
        }

        /// <summary>
        ///     绑定第三方账号
        /// </summary>
        /// <param name="ext">绑定参数，包含 method、scene 等字段</param>
        /// <param name="onResponse">成功回调方法</param>
        /// <param name="onError">失败回调方法</param>
        public static void BindAccount(Dictionary<string, object> ext, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            _sdk.BindAccount(ext, onResponse, onError);
        }

        /// <summary>
        ///     获取 IIFAA 支付宝授权跳转地址
        /// </summary>
        /// <param name="appName">应用名称</param>
        /// <param name="thirdPartSchema">第三方回调 schema</param>
        /// <param name="onResponse">成功回调方法</param>
        /// <param name="onError">失败回调方法</param>
        public static void GetIIFAARedirectURL(string appName, string thirdPartSchema,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.GetIIFAARedirectURL(appName, thirdPartSchema, onResponse, onError);
        }

        /// <summary>
        ///     查询 IIFAA 认证结果
        /// </summary>
        /// <param name="retryCount">310039 错误重试次数</param>
        /// <param name="onResponse">成功回调方法</param>
        /// <param name="onError">失败回调方法</param>
        public static void GetIIFAAResultWithRetryCount(int retryCount, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            _sdk.GetIIFAAResultWithRetryCount(retryCount, onResponse, onError);
        }

        /// <summary>
        ///     查询 IIFAA 认证结果，相比 GetIIFAAResultWithRetryCount 新增 source 参数
        /// </summary>
        /// <param name="source">业务场景，deregister 表示注销场景，传空表示正常认证逻辑</param>
        /// <param name="retryCount">310039 错误重试次数</param>
        /// <param name="onResponse">成功回调方法</param>
        /// <param name="onError">失败回调方法</param>
        public static void GetIIFAAResultWithSource(string source, int retryCount, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            _sdk.GetIIFAAResultWithSource(source, retryCount, onResponse, onError);
        }

        /// <summary>
        ///     设置防沉迷监听
        /// </summary>
        /// <param name="addictDelegate"></param>
        public static void SetupAddictDelegate(IAntiAddictDelegate addictDelegate)
        {
            _sdk.SetupAddictDelegate(addictDelegate);
        }

        /// <summary>
        ///     是否关闭敏感信息采集
        /// </summary>
        /// <param name="disabled"></param>
        public static void DisableReadSensitiveInfo(bool disabled)
        {
            _sdk.DisableReadSensitiveInfo(disabled);
        }

        /// <summary>
        ///     判断用户是否已经点击同意隐私
        /// </summary>
        /// <returns></returns>
        public static bool IsAgreedPrivacy()
        {
            return _sdk.IsAgreedPrivacy();
        }

        /// <summary>
        ///     通知sdk已同意隐私协议
        /// </summary>
        /// <param name="callback"></param>
        public static void SetPrivacyAgree(PrivacyAgreeDelegate callback)
        {
            _sdk.SetPrivacyAgree(callback);
        }

        /// <summary>
        ///     设置语言
        /// </summary>
        /// <param name="language"></param>
        public static void SetLanguage(string language)
        {
            _sdk.SetLanguage(language);
        }

        /// <summary>
        ///     设置是否禁止截屏
        /// </summary>
        /// <param name="disable"></param>
        public static void SetScreenCaptureDisable(bool disable)
        {
            _sdk.SetScreenCaptureDisable(disable);
        }

        /// <summary>
        /// 自定义接口请求
        /// </summary>
        /// <param name="url"></param>
        /// <param name="header"></param>
        /// <param name="body"></param>
        /// <param name="method"></param>
        /// <param name="needLogin"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void CreateRequest(string url, Dictionary<string, string> header, Dictionary<string, string> body,
            HttpMethod method, bool needLogin, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.CreateRequest(url, header, body, method, needLogin, onResponse, onError);
        }
        
        /// <summary>
        /// 初始化三方渠道，会调用接入三方渠道的初始化接口
        /// </summary>
        /// <param name="map"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void InitThirdSdk(Dictionary<string, object> map, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk?.InitThirdSdk(map, onResponse, onError);
        }

        /// <summary>
        /// 调用当前 Android 渠道库提供的渠道专属能力。
        /// </summary>
        public static void InvokeChannelAction(string action, Dictionary<string, object> parameters,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk?.InvokeChannelAction(action, parameters, onResponse, onError);
        }

        public static void InvokeChannelAction(string action, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            InvokeChannelAction(action, null, onResponse, onError);
        }
        
        /// <summary>
        /// 添加回调函数
        /// </summary>
        /// <param name="publicDelegate"></param>
        /// <param name="onLogout"></param>
        /// <param name="onSwitchAccount"></param>
        public static void SetSdkCallback(PublicDelegate publicDelegate, LogoutDelegate onLogout, SwitchAccountDelegate onSwitchAccount)
        {
            _sdk?.SetSdkCallback(publicDelegate, onLogout, onSwitchAccount);
        }

        /// <summary>
        /// //退出 app时，接入相应三方渠道组件会调用对应渠道退出接口
        /// </summary>
        /// <param name="onExitConfirm"></param>
        /// <param name="onExitCancel"></param>
        public static void ExitApp(ExitConfirmDelegate onExitConfirm, ExitCancelDelegate onExitCancel)
        {
            _sdk?.ExitApp(onExitConfirm, onExitCancel);
        }

        /// <summary>
        /// 获取邮件列表
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="onResponse"></param>
        public static void GetEmailList(string userId, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk?.GetEmailList(userId, onResponse, onError);
        }

        /// <summary>
        /// 删除邮件
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="type"></param>
        /// <param name="mailId"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void DeleteEmail(string userId, int type, int mailId, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            _sdk?.DeleteEmail(userId, type, mailId, onResponse, onError);
        }

        /// <summary>
        /// 获取邮件详情
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="mailId"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void GetEmailDetail(string userId, int mailId, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            _sdk?.GetEmailDetail(userId, mailId, onResponse, onError);
        }

        /// <summary>
        /// 获取附件
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="type"></param>
        /// <param name="mailId"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void GetEmailAward(string userId, int type, int mailId,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk?.GetEmailAward(userId, type, mailId, onResponse, onError);
        }

        /// <summary>
        /// 获取公告
        /// </summary>
        /// <param name="limit"></param> 获取条数
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void GetAnnouncement(int limit, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk?.GetAnnouncement(limit, onResponse, onError);
        }

        /// <summary>
        /// 获取临时维护公告
        /// </summary>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void GetTempNotice(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk?.GetTempNotice(onResponse, onError);
        }

        /// <summary>
        /// 创建意见反馈
        /// </summary>
        /// <param name="content">返回内容</param>
        /// <param name="attachments">上传附件</param>
        /// <param name="phone">电话号</param>
        /// <param name="tags">标签标识， 游戏透传</param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void FeedbackCreate(string content, string[] attachments, string phone, string[] tags,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk?.FeedbackCreate(content, attachments, phone, tags, onResponse, onError);
        }

        /// <summary>
        /// 获取列表
        /// </summary>
        /// <param name="page">页数， 从1开始</param>
        /// <param name="size">每页大小</param>
        /// <param name="status">1 未处理 2已处理</param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void GetFeedbackList(int page, int size, int status,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk?.GetFeedbackList(page, size, status, onResponse, onError);
        }

        /// <summary>
        /// 获取反馈详情
        /// </summary>
        /// <param name="id">反馈id</param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void GetFeedbackDetail(int id,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk?.GetFeedbackDetail(id, onResponse, onError);
        }

        /// <summary>
        /// 领取道具
        /// </summary>
        /// <param name="id">反馈id</param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void FeedbackGetprop(int id,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk?.FeedbackGetprop(id, onResponse, onError);
        }

        /// <summary>
        /// 获取达人游戏内显示福利码
        /// </summary>
        /// <param name="authRefresh">是否自动刷新</param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void GetPromoDisplayKEY(bool authRefresh, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            _sdk?.GetPromoDisplayKEY(authRefresh, onResponse, onError);
        }
        
        /// <summary>
        /// 兑换福利码
        /// </summary>
        /// <param name="cdKey">福利码</param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void ExchangePromoCDKEY(string cdKey, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            _sdk?.ExchangePromoCDKEY(cdKey, onResponse, onError);
        }
        
        /// <summary>
        /// 获取设备码（设备唯一标识）
        /// </summary>
        /// <param name="onResponse"></param>
        public static void GetDeviceCode(RequestResponseDelegate onResponse)
        {
            _sdk?.GetDeviceCode(onResponse);
        }

        /// <summary>
        /// 获取客户端随机生成的 distinctId
        /// </summary>
        /// <param name="onResponse"></param>
        public static void GetDistinctId(RequestResponseDelegate onResponse)
        {
            _sdk?.GetDistinctId(onResponse);
        }

        /// <summary>
        /// 展示图形验证码
        /// </summary>
        /// <param name="appId"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void ShowCaptchaVerifyUI(string appId, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            _sdk?.ShowCaptchaVerifyUI(appId, onResponse, onError);
        }

        public static void CheckQuickAp(RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            _sdk?.CheckQuickAp(onResponse, onError);
        }

        /// <summary>
        /// 向渠道合规系统上报充值金额（单位：分），建议在服务端到账确认后调用。
        /// </summary>
        public static void SubmitChannelPayment(int amountFen, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            _sdk?.SubmitChannelPayment(amountFen, onResponse, onError);
        }

        /// <summary>
        /// 上报充值金额；overrideFields 可补充 trade_no/order_no 等字段。
        /// </summary>
        public static void SubmitChannelPayment(int amountFen, Dictionary<string, object> overrideFields,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk?.SubmitChannelPayment(amountFen, overrideFields, onResponse, onError);
        }

        /// <summary>
        /// 支付前检查渠道充值限额（单位：分）。
        /// </summary>
        public static void CheckChannelPaymentLimit(int amountFen, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            _sdk?.CheckChannelPaymentLimit(amountFen, onResponse, onError);
        }
        
        /// <summary>
        /// 设置自定义错误消息提示
        /// </summary>
        /// <param name="errorMsgMap">错误消息字典</param>
        public static void configErrorMsg(Dictionary<string, object> errorMsgMap)
        {
            _sdk.configErrorMsg(errorMsgMap);
        }

        /// <summary>
        /// 判断 login_openid 是否失效
        /// </summary>
        /// <returns>login_openid true 失效， false 有效</returns>
        public static bool LoginOpenidExpireInvalid()
        {
            return _sdk.LoginOpenidExpireInvalid();
        }

        /// <summary>
        /// 设置密码等级
        /// </summary>
        /// <returns>type 密码强度等级枚举</returns>
        public static void SetPasswordStrength(RXPasswordStrength type)
        {
            _sdk.SetPasswordStrength(type);
        }

        /// <summary>
        /// 设置密码正则
        /// 需要先将密码强度设置为自定义
        /// </summary>
        /// <returns>pattern 密码正则</returns>
        public static void SetPwdPattern(string pattern)
        {
            _sdk.SetPwdPattern(pattern);
        }
        
        /// <summary>
        /// 设置地区
        /// </summary>
        /// <returns>area 地区</returns>
        public static void SetArea(string area)
        {
            _sdk.SetArea(area);
        }
    }
}