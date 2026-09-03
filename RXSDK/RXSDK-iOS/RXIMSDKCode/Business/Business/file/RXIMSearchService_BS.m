//
//  RXIMSearchService_BS.m
//  Business
//
//  Created by Elbay on 2024/5/28.
//

#import "RXIMSearchService_BS.h"

@implementation RXIMSearchService_BS

+ (instancetype)sharedSDK {
    static RXIMSearchService_BS *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[RXIMSearchService_BS alloc] init];
    });
    return sharedInstance;
}

- (void)searchMessage:(RXIMSearchRequestModel *)requestModel
    completionHandler:(void (^)(RXIMSearchResultData *searchData, RXIMError *error))completionHandler {
    [[RXIMSearchService sharedSDK] searchMessage:requestModel completionHandler:completionHandler];
}

- (NSArray<RXIMMessage *> *)searchLocalMultimedia:(NSString *)convId {
    return [[RXIMSearchService sharedSDK] searchLocalMultimedia:convId];
}

@end
