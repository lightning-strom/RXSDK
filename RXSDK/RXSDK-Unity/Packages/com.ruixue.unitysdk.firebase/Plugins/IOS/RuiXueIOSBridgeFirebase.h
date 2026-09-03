#ifndef __RuiXue__IOSBridge__Firebase__
#define __RuiXue__IOSBridge__Firebase__

extern "C"
{
// 初始化
void ios_firebase_configure();

// 发送事件
void ios_firebase_logEvent(const char* name, const char* parameters);

// 设置默认事件参数
void ios_firebase_setDefaultEventParameters(const char* parameters);

// 设置用户属性
void ios_firebase_setUserProperty(const char* name, const char* value);

// 设置用户id
void ios_firebase_setUserID(const char* userID);

// 是否启用数据收集
void ios_firebase_setAnalyticsCollectionEnabled(bool enable);

}

#endif
