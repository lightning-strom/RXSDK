//
//  RXIMSearchService.h
//  RXIMSdk
//
//  Created by weiyongjian on 2023/1/18.
//

#import <Foundation/Foundation.h>
#import "RXIMSearchRequestModel.h"
#import "RXIMSearchResultModel.h"
#import "RXIMError.h"
#import "RXIMMessage.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXIMSearchService : NSObject

/**
 * 获取RTC操作SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/**
 * 搜索
 * @param requestModel 搜索请求模型
 */
- (void)searchMessage:(RXIMSearchRequestModel *)requestModel completionHandler:(void (^)(RXIMSearchResultData *searchData,RXIMError *error))completionHandler;

/**
 * 搜索本地多媒体数据
 */
- (NSArray <RXIMMessage *> *)searchLocalMultimedia:(NSString *)convId;

@end

NS_ASSUME_NONNULL_END
