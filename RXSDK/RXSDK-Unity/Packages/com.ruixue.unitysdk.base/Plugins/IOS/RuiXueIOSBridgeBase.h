#ifndef __RuiXue__IOSBridge__Base__
#define __RuiXue__IOSBridge__Base__


extern "C"
{
typedef void (*RequestResponseCallBack)(const char* func, const char* data);

typedef void (*RequestErrorCallBack)(const char* func, const char* error);

// 初始化
void ios_base_initWithProductId(const char* cpid,
                       const char* productId,
                       const char* channelId,
                       const char* baseUrlList[],
                       int urlcount,
                       RequestResponseCallBack onSuccess,
                       RequestErrorCallBack onError);

//初始化新方法
void ios_base_initWithConfig(const char* config,
                       RequestResponseCallBack onSuccess,
                       RequestErrorCallBack onError);

// 设置当前语言
void ios_base_setLanguage(const char* language);

// 自定义请求
void ios_base_createRequestWithUrl(const char* url, const char* header, const char* body, int method, bool needLogin, RequestResponseCallBack onSuccess, RequestErrorCallBack onError);


// 设置子渠道id
void ios_base_setSubChannelId(const char* channelId);

//设置游戏角色信息
void ios_base_setGameInfo(const char* roleId, const char* regionTag);

//查询游戏角色信息
void ios_base_searchGameAccount(RequestResponseCallBack onSuccess,
                                RequestErrorCallBack onError);

//绑定第三方账号
void ios_base_bindAccount(const char* ext,
                          RequestResponseCallBack onSuccess,
                          RequestErrorCallBack onError);

//获取 IIFAA 支付宝授权跳转地址
void ios_base_getIIFAARedirectURL(const char* appName,
                                  const char* thirdPartSchema,
                                  RequestResponseCallBack onSuccess,
                                  RequestErrorCallBack onError);

//查询 IIFAA 认证结果
void ios_base_getIIFAAResultWithRetryCount(int retryCount,
                                           RequestResponseCallBack onSuccess,
                                           RequestErrorCallBack onError);

//查询 IIFAA 认证结果（新增 source 参数，deregister 表示注销场景，传空表示正常认证逻辑）
void ios_base_getIIFAAResultWithSource(const char* source,
                                       int retryCount,
                                       RequestResponseCallBack onSuccess,
                                       RequestErrorCallBack onError);

//获取邮件列表
void ios_base_getEmailListWithCpUserID(const char* cpUserID,
                           RequestResponseCallBack onSuccess,
                           RequestErrorCallBack onError);

//获取邮件详情
void ios_base_getEmailDetailWithCpUserID(const char* cpUserID,
                           int emailID,    
                           RequestResponseCallBack onSuccess,
                           RequestErrorCallBack onError);

//领取道具
void ios_base_receivePropsWithCpUserID(const char* cpUserID,
                           int type,
                           int emailID,    
                           RequestResponseCallBack onSuccess,
                           RequestErrorCallBack onError);

//删除邮件
void ios_base_deleteEmailWithCpUserID(const char* cpUserID,
                           int type,
                           int emailID,    
                           RequestResponseCallBack onSuccess,
                           RequestErrorCallBack onError);

//获取公告列表
void ios_base_getAnnouncementWithLimitWithLimit(int limit,
                           RequestResponseCallBack onSuccess,
                           RequestErrorCallBack onError);

//获取临时维护公告
void ios_base_getTempNotice(RequestResponseCallBack onSuccess,
                           RequestErrorCallBack onError);

//创建反馈
void ios_base_feedbackCreateWithContent(const char* content,
                           const char* attachments,
                           const char* phone,    
                           RequestResponseCallBack onSuccess,
                           RequestErrorCallBack onError);

//获取反馈列表
void ios_base_getFeedbackListWithPage(int page,
                           int size,
                           int status,    
                           RequestResponseCallBack onSuccess,
                           RequestErrorCallBack onError);

//获取反馈详情
void ios_base_getFeedbackDetailWithFeedbackID(int feedbackID,
                           RequestResponseCallBack onSuccess,
                           RequestErrorCallBack onError);

//领取反馈中的道具
void ios_base_feedbackGetpropWithFeedbackID(int feedbackID,
                           RequestResponseCallBack onSuccess,
                           RequestErrorCallBack onError);

//请求福利码
void ios_base_getPromoDisplayKeyWithAutoRefresh(bool autoRefresh,
                           RequestResponseCallBack onSuccess,
                           RequestErrorCallBack onError);

//获取福利码
void ios_base_exchangePromoCDKEY(const char* cdkey,
                           RequestResponseCallBack onSuccess,
                           RequestErrorCallBack onError);

//获取设备码
void ios_base_getDeviceCode(RequestResponseCallBack onSuccess);

//获取 distinctId
void ios_base_getDistinctId(RequestResponseCallBack onSuccess);

//图形验证码
void ios_base_captchaVerifyUI(const char* appId,
                              RequestResponseCallBack onSuccess,
                              RequestErrorCallBack onError);

// login_openid 是否失效，YES 失效，NO 有效
bool ios_base_loginOpenidExpireInvalid();

//设置自定义错误消息提示
void ios_base_configErrorMsg(const char* errorMsgDicStr);

//设置密码正则
void ios_base_setPwdPattern(const char* pattern);

//设置密码等级
void ios_base_setPasswordStrength(int type);

//设置地区
void ios_base_setArea(const char* area);
    
}

#endif
