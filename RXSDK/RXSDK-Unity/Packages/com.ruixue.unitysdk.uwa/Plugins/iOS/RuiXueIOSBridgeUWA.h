#ifndef __RuiXue__IOSBridge__UWA__
#define __RuiXue__IOSBridge__UWA__


extern "C"
{
typedef void (*getInfoCallBack)(const char* data);

typedef void (*CallbackDelegate)();

// 保存 C# 回调函数指针
static CallbackDelegate callback = NULL;


//获取UWA开关与上传时间间隔
void ios_uwaGetInfoWithFuncs(getInfoCallBack onGetInfo);

//上传UWA信息
void ios_uploadUwaInfoFunc(const char* uwaInfo);

//携带UWA信息发送通知
void ios_postNotiWithUwaInfoFunc(const char* uwaInfo);

// 传递 C# 回调函数指针
void ios_registerCallback(CallbackDelegate cb);    

}



#endif

#import <Foundation/Foundation.h>

@interface RuiXueIOSBridgeUWA : NSObject

+ (instancetype)sharedSDK;

- (void)callCSharpMethodFunction;

@end
