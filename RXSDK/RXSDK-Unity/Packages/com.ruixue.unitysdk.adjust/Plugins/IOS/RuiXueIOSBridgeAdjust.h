#ifndef __RuiXue__IOSBridge__Adjust__
#define __RuiXue__IOSBridge__Adjust__

extern "C"
{
// 初始化
void ios_adjust_init(const char* config);

// 设置delegate
void ios_adjust_setDelegate(DelegateAdjustAttributionChanged onAttributionChanged, DelegateAdjustEventTrackingSucceeded onEventTrackingSucceeded, DelegateAdjustEventTrackingFailed onEventTrackingFailed, DelegateAdjustSessionTrackingSucceeded onSessionTrackingSucceeded, DelegateAdjustSessionTrackingFailed onSessionTrackingFailed);

// 记录事件
void ios_adjust_trackEvent(const char* event);

// 添加默认伙伴参数
void ios_adjust_addSessionPartnerParameter(const char* key, const char* value);

// 删除默认伙伴参数
void ios_adjust_removeSessionPartnerParameter(const char* key);

// 删除所有伙伴参数
void ios_adjust_resetSessionPartnerParameters();

// 添加会话回调参数
void ios_adjust_addSessionCallbackParameter(const char* key, const char* value);

// 从会话包中删除默认回调参数
void ios_adjust_removeSessionCallbackParameter(const char* key);

// 删除所有回调参数
void ios_adjust_resetSessionCallbackParameters();

// 获取用户归因
const char* ios_adjust_getAttribution();
}

#endif
