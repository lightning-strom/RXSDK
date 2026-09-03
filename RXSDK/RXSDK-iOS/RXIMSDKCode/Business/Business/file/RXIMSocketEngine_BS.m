//
//  RXIMSocketEngine_BS.m
//  Business
//
//  Created by Elbay on 2024/5/28.
//

#import "RXIMSocketEngine_BS.h"

@interface RXIMSocketEngine(BS)


@end


@implementation RXIMSocketEngine_BS


+ (instancetype)sharedSDK {
    static RXIMSocketEngine_BS *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[RXIMSocketEngine_BS alloc] init];
//        [RXIMSocketEngine sharedSDK].delegate = sharedInstance;
//        sharedInstance.delegate = [RXIMSocketEngine sharedSDK].delegate;

        
    });
    return sharedInstance;
}

- (id<RXIMSocketDelegate>)delegate{
    return [RXIMSocketEngine sharedSDK].delegate;
}

- (void)setDelegate:(id<RXIMSocketDelegate>)delegate{
    [RXIMSocketEngine sharedSDK].delegate = delegate;
}

- (void)onStart {
    [[RXIMSocketEngine sharedSDK] onStart];
}

- (void)onSocketConnectSuccess{
    if ([self.delegate respondsToSelector:@selector(onSocketConnectSuccess)]) {
        [self.delegate onSocketConnectSuccess];
    }
}

- (void)onSocketDisconnect:(RXIMError * _Nullable)error {
    if ([self.delegate respondsToSelector:@selector(onSocketDisconnect:)]) {
        [self.delegate onSocketDisconnect:error];
    }
}

@end
