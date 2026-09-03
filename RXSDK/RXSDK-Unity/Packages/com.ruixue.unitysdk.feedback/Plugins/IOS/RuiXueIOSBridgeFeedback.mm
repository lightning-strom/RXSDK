
#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXSDK_Pure/RX_CommonRequestError.h>
#import "NSString+JSONCategories.h"
#include "RuiXueIOSBridgeBase.h"
#include "RuiXueIOSBridgeUtils.h"
#include "RuiXueIOSBridgeFeedback.h"


// 获取意见反馈类型
void ios_getFeedbackKindList(RequestResponseCallBack onSuccess,
                             RequestErrorCallBack onError)
{
    [[RXFeedbackService sharedSDK] getFeedbackKindListWithComplete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {

        if(!error)
        {
            NSLog(@"获取意见反馈类型成功");
            onSuccess("ios_getFeedbackKindList",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"获取意见反馈类型失败");
            onError("ios_getFeedbackKindList",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}

// 创建意见反馈
void ios_createFeedbackWithParams(const char* paramDicJson,           RequestResponseCallBack onSuccess,
    RequestErrorCallBack onError)
{
    [[RXFeedbackService sharedSDK] createFeedbackWithParams:[RuiXueIOSBridgeUtils toNSDic:paramDicJson] complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error){
       
        if(!error)
        {
            NSLog(@"创建意见反馈成功");
            onSuccess("ios_createFeedbackWithParams",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"创建意见反馈失败");
            onError("ios_createFeedbackWithParams",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}

// 满意度评价
void ios_satisfactionEvaluationWithParams(const char* paramDicJson, RequestResponseCallBack onSuccess,
    RequestErrorCallBack onError)
{
    [[RXFeedbackService sharedSDK] satisfactionEvaluationWithParams:[RuiXueIOSBridgeUtils toNSDic:paramDicJson] complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {

        if(!error)
        {
            NSLog(@"满意度评价成功");
            onSuccess("ios_satisfactionEvaluationWithParams",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"满意度评价失败");
            onError("ios_satisfactionEvaluationWithParams",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}

// 上报反馈日志
void ios_reportFeedbackLogWithData(UInt8* byteData, int length,
                                   RequestResponseCallBack onSuccess,
                                   RequestErrorCallBack onError)
{
    NSData* data = [NSData dataWithBytes:byteData length:length];
    [[RXFeedbackService sharedSDK] reportFeedbackLogWithData:data complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {

        if(!error)
        {
            NSLog(@"满意度评价成功");
            onSuccess("ios_reportFeedbackLogWithData",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"满意度评价失败");
            onError("ios_reportFeedbackLogWithData",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}
