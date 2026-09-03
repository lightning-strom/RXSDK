#ifndef __RuiXue__IOSBridge__LoginUI__
#define __RuiXue__IOSBridge__LoginUI__

extern "C"
{
typedef void (*LinkCallBack)(const char* link);

typedef void (*HasAnnounceCallBack)(bool hasAnnounce);

// 显示登录界面
void ios_showLoginUIWithConfig(const char* config,
                               RequestResponseCallBack onSuccess,
                               RequestErrorCallBack onError);


// 关闭登录
void ios_closeLoginView();

// 同步账号
void ios_syncAccounts(const char* json);

// 找回账号
void ios_getBackPasswordWithComplete(RequestResponseCallBack onSuccess, RequestErrorCallBack onError);

// 撤销账号注销
void ios_destroyAccountStatusViewWithDeregisterType(bool isLoginContinue, RequestResponseCallBack onSuccess, RequestErrorCallBack onError);

// 撤销账号注销
void ios_destroyAccountStatusUIWithBtnTitle(const char* title, RequestResponseCallBack onSuccess, RequestErrorCallBack onError);


// 协议声明
void ios_setProtocolViewWithKey(const char* key, const char* keyList);


// 实名认证
void ios_setRealauthView(RequestResponseCallBack onSuccess, RequestErrorCallBack onError);

// 防沉迷
void ios_setAntiAdditionViewWithTitle(const char* title, const char* des, const char* btnTitle, RequestResponseCallBack onSuccess, RequestErrorCallBack onError);

// 用户中心
void ios_userCenterWithConfig(const char* config,RequestResponseCallBack onSuccess,
                              RequestErrorCallBack onError);

// 申请注销
void ios_applyForDeregisterWithConfig(const char* config, RequestResponseCallBack onResponse);


// 帮助中心
void ios_serviceCenterWithConfig(const char* config,
                                 RequestResponseCallBack onSuccess,
                                 RequestErrorCallBack onError);
// 客服
void ios_chatServiceWithConfig(const char* config,
                               RequestResponseCallBack onSuccess,
                               RequestErrorCallBack onError);

//展示邮箱
void ios_showEmailViewWithCpUserId(const char* cpUserId);

//展示公告
void ios_showAnnounceViewWithLimit(int limit, LinkCallBack linkCallBackBlock, HasAnnounceCallBack hasAnnounceCallback);

//大厅更新检查 - 展示维护公告（GET版本）
void ios_checkUpdate_AppWithRegion_get(const char* region, const char* client_version, const char* type, const char* json, bool isShow, LinkCallBack linkCallBackBlock, RequestResponseCallBack onSuccess, RequestErrorCallBack onError);

//大厅更新检查 - 展示维护公告（POST版本)
void ios_checkUpdate_AppWithRegion_post(const char* region, const char* client_version, const char* games, const char* activities, const char* type, const char* json, bool isShow, LinkCallBack linkCallBackBlock, RequestResponseCallBack onSuccess, RequestErrorCallBack onError);

//绑定/换绑手机
void ios_bindPhone(RequestResponseCallBack onSuccess,
                   RequestErrorCallBack onError);
}

#endif

