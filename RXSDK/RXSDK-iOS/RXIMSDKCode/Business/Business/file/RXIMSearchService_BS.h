//
//  RXIMSearchService_BS.h
//  Business
//
//  Created by Elbay on 2024/5/28.
//

#import <Foundation/Foundation.h>
@import RXIMSdk_business.RXIMSearchService;

NS_ASSUME_NONNULL_BEGIN

@interface RXIMSearchService_BS : RXIMSearchService
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
