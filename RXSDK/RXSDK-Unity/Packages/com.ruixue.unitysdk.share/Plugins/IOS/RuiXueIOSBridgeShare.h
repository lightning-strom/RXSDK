#ifndef __RuiXue__IOSBridge__Share__
#define __RuiXue__IOSBridge__Share__


extern "C"
{

// 分享调度初始化
void ios_shareSchedulingInitWithFuncs(const char* funcsJson,
                       RequestResponseCallBack onSuccess,
                       RequestErrorCallBack onError);


// 获取埋点调度
void ios_getShareSchedulingWithFuncs(const char* funcsJson,
                                     RequestResponseCallBack onSuccess,
                                     RequestErrorCallBack onError);
// 分享
void ios_share(const char* config,
                       RequestResponseCallBack onSuccess,
                       RequestErrorCallBack onError);
// 自定义分享
void ios_shareCustom(const char* config,
                       RequestResponseCallBack onSuccess,
                       RequestErrorCallBack onError);

// 获取分享信息
void ios_getShareInfoWithConfig(const char* config,
                              RequestResponseCallBack onSuccess,
                              RequestErrorCallBack onError);

// 分享/广告结果上报
void ios_shareSchedulingReportWithFunc(const char* func,
                                       const char* platform,
                                       const char* region,
                                       const char* transmits,
                                       bool schedulingEvent,
                                       const char* schedulingType,
                                       const char* propertiesDicJson,
                                       RequestResponseCallBack onSuccess,
                                       RequestErrorCallBack onError
                                       );

void ios_getShortUrl(const char* url,
                     RequestResponseCallBack onSuccess,
                     RequestErrorCallBack onError);
}

#endif
