#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXSDK_Pure/RX_CommonRequestError.h>
#import "NSString+JSONCategories.h"
#include "RuiXueIOSBridgeBase.h"
#include "RuiXueIOSBridgeUtils.h"
#include "RuiXueIOSBridgeAnalysis.h"

// 数据埋点
bool ios_analysis_addLogSingleWithEvent(const char* event, const char* distinctId, const char* jsonDicProperties)
{
   return [[RXLogService sharedSDK] addLogSingleWithEvent:[RuiXueIOSBridgeUtils toNSString:event]
                                   distinctId:[RuiXueIOSBridgeUtils toNSString:distinctId]
                                   properties:[RuiXueIOSBridgeUtils toNSDic:jsonDicProperties]];
}

// 设置公共属性
void ios_analysis_setPublicProperties(const char* jsonDicProperties)
{
    [[RXLogService sharedSDK] setPublicProperties: [RuiXueIOSBridgeUtils toNSDic:jsonDicProperties]];
}

// 修改公共属性
void ios_analysis_updatePublicProperties(const char* jsonDicProperties)
{
    [[RXLogService sharedSDK] updatePublicProperties: [RuiXueIOSBridgeUtils toNSDic:jsonDicProperties]];
}

// 删除公共属性
void ios_analysis_deletePublicProperties(const char* jsonArrayPropterties)
{
    [[RXLogService sharedSDK] deletePublicProperties: [RuiXueIOSBridgeUtils toNSArray:jsonArrayPropterties]];
}
