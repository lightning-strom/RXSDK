//
//  RXIMSocketEngine.m
//  RXIMSdk
//
//  Created by weiyongjian on 2022/9/27.
//

#import "RXIMSocketEngine.h"
#import "RXIMSocket.h"
#import "RXIMWebSocket.h"
#import "RXIMUserUtility.h"

@interface RXIMSocketEngine()<RXIMSocketInternalDelegate>

@end

@implementation RXIMSocketEngine

static RXIMSocketEngine *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXIMSocketEngine alloc] init];
    });
    return sharedSDK;
}

-(void)onStart
{
    if ([RXIMUserUtility sharedManager].socketType == RXIMSocketType_webSocket) {
        [RXIMWebSocket sharedSDK].connectDelegate = self;
        [[RXIMWebSocket sharedSDK] connectSocketWithAddrs:[RXIMUserUtility sharedManager].entryAddress timeout:0];
    }else{
        [RXIMSocket sharedSDK].connectDelegate = self;
        [[RXIMSocket sharedSDK] connectSocketWithAddrs:[RXIMUserUtility sharedManager].entryAddress timeout:[RXIMUserUtility sharedManager].entryTimeout];
    }
}

#pragma mark - <RXIMSocketInternalDelegate>

- (void)socketConnectSuccess
{
    if (self.delegate) {
        [self.delegate onSocketConnectSuccess];
    }
}

- (void)socketDisconnect:(RXIMError *)error
{
    if (self.delegate) {
        [self.delegate onSocketDisconnect:error];
    }
}

@end
