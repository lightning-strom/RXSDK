//
//  RXIMCollectionService_BS.m
//  Business
//
//  Created by Elbay on 2024/5/28.
//

#import "RXIMCollectionService_BS.h"

@implementation RXIMCollectionService_BS

+ (instancetype)sharedSDK {
    static RXIMCollectionService_BS *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[RXIMCollectionService_BS alloc] init];
    });
    return sharedInstance;
}

- (void)addCollection:(NSArray * _Nonnull)msgIds completionHandler:(void (^)(RXIMError *error))completionHandler {
    [[RXIMCollectionService sharedSDK] addCollection:msgIds completionHandler:completionHandler];
}

- (void)deleteCollection:(NSArray * _Nonnull)msgIds completionHandler:(void (^)(RXIMError *error))completionHandler {
    [[RXIMCollectionService sharedSDK] deleteCollection:msgIds completionHandler:completionHandler];
}

- (void)getCollectionList:(void (^)(NSArray<RXIMMessage *> *msgs, RXIMError *error))completionHandler {
    [[RXIMCollectionService sharedSDK] getCollectionList:completionHandler];
}
@end
