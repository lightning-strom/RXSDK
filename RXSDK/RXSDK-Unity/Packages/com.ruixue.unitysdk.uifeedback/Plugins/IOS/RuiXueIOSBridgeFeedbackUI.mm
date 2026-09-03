
#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXSDK_Pure/RX_CommonRequestError.h>
#import "NSString+JSONCategories.h"
#include "RuiXueIOSBridgeBase.h"
#include "RuiXueIOSBridgeFeedbackUI.h"
#include "RuiXueIOSBridgeUtils.h"
#import <RXFeedbackSDK/RXFeedbackSDK.h>

//玩家意见反馈列表
void ios_showFeedbackListView()
{
    [[RXPlayerFeedbackService sharedSDK] showFeedbackListView];
}

//玩家创建意见反馈
void ios_showCreateFeedbackView()
{
    [[RXPlayerFeedbackService sharedSDK] showCreateFeedbackView];
}
