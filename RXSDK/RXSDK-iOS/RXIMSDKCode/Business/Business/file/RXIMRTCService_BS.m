//
//  RXIMRTCService_BS.m
//  Business
//
//  Created by Elbay on 2024/5/28.
//

#import "RXIMRTCService_BS.h"

@implementation RXIMRTCService_BS

+ (instancetype)sharedSDK {
    static RXIMRTCService_BS *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[RXIMRTCService_BS alloc] init];
    });
    return sharedInstance;
}

- (void)getRtcAuthInfo:(NSString * _Nullable)channelId completionHandler:(void (^)(RXIMRTCAuthInfo *authInfo, RXIMError *error))completionHandler {
    [[RXIMRTCService sharedSDK] getRtcAuthInfo:channelId completionHandler:completionHandler];
}

@end
