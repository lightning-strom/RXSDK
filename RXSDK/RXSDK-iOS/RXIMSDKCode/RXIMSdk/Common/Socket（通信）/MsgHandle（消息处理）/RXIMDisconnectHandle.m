//
//  RXIMDisconnectHandle.m
//  RXIMSdk
//
//  Created by weiyongjian on 2022/2/18.
//

#import "RXIMDisconnectHandle.h"
#import "RXIMUserUtility.h"
#import "RXIMSDKApi.h"
#import "RXModelTransform.h"
#import "RXIMSession.h"
#import "RXIMChatService.h"
#import "RXIMChatService+Inner.h"
#import "RXIMSessionService+Inner.h"
#import "RXIMWCDB.h"
#import "RXIMLogManager.h"

@implementation RXIMDisconnectHandle

static RXIMDisconnectHandle *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXIMDisconnectHandle alloc] init];

    });
    return sharedSDK;
}

-(void)messageHandle
{
    RXLogDebug(prefixStr,nil);
    RXLogInfo(prefixStr, @"sync startInboxId4 = %ld,endInboxId = %ld",[RXIMUserUtility sharedManager].maxInboxId+1,0);
    [[RXIMChatService sharedSDK] getServerOfflineMsgWithStartinboxId:[RXIMUserUtility sharedManager].maxInboxId+1 endinboxId:0 limit:30];
}

@end
