#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXSDK_Pure/RX_CommonRequestError.h>
#import "NSString+JSONCategories.h"
#include "RuiXueIOSBridgeBase.h"
#include "RuiXueIOSBridgeUtils.h"
#include "RuiXueIOSBridgeLegal.h"

// 获取法务配置信息
void getLegalInfo(RequestResponseCallBack onSuccess, RequestErrorCallBack onError)
{
    [[RXService sharedSDK] getLegalInfo:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
            
        if(!error)
        {
            NSLog(@"获取法务配置信息 成功");
            onSuccess("getLegalInfo", [RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"获取法务配置信息 失败");
            onError("getLegalInfo", [RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}
