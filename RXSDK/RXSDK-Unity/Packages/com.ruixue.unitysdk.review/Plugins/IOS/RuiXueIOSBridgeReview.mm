#include "RuiXueIOSBridgeReview.h"
#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXSDK_Pure/RX_CommonRequestError.h>
#import "NSString+JSONCategories.h"
#include "RuiXueIOSBridgeUtils.h"


void ios_inAppStoreReview(const char* appid)
{
    [[RXStoreKitService sharedSDK] inAppStoreReview:[RuiXueIOSBridgeUtils toNSString:appid] complete:^{
            NSLog(@"inAppStoreReview 点击了完成或取消");
    }];
}
