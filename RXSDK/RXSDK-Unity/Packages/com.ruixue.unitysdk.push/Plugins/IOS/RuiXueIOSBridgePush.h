#ifndef __RuiXue__IOSBridge__Push__
#define __RuiXue__IOSBridge__Push__


extern "C"
{

// 初始化
void ios_push_initWithProductId(const char* productid,
                                const char* channelid,
                                const char* cpid,
                                const char* baseUrlArrayJson);

// 注册通知
void ios_push_registerDeviceToken();

// 获取DeviceToken
const char* ios_push_getDeviceToken();

// 绑定别名
void ios_push_bindingAlias(const char* alias);

// 解绑别名
void ios_push_reliveBinding();

// 增加用户标签
void ios_push_addTags(const char* tags);

// 移除用户标签
void ios_push_deleteTags(const char* tags);

// 解绑用户与渠道SDK的关联
void ios_push_reliveBindingPushDevice();

}





#endif
