#ifndef __RuiXue__IOSBridge__Feedback__
#define __RuiXue__IOSBridge__Feedback__


extern "C"
{

// 获取意见反馈类型
void ios_getFeedbackKindList(RequestResponseCallBack onSuccess,
                             RequestErrorCallBack onError);

// 创建意见反馈
void ios_createFeedbackWithParams(const char* paramDicJson,           RequestResponseCallBack onSuccess,
    RequestErrorCallBack onError);

// 满意度评价
void ios_satisfactionEvaluationWithParams(const char* paramDicJson, RequestResponseCallBack onSuccess,
    RequestErrorCallBack onError);

// 上报反馈日志
void ios_reportFeedbackLogWithData(UInt8* byteData, int length,
                                   RequestResponseCallBack onSuccess,
                                   RequestErrorCallBack onError);
                        
}

#endif
