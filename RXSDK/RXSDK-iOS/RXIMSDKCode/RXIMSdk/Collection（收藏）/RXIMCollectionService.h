//
//  RXIMCollection.h
//  RXIMSdk
//
//  Created by weiyongjian on 2022/12/13.
//

#import <Foundation/Foundation.h>
#import "RXIMMessage.h"
#import "RXIMError.h"


NS_ASSUME_NONNULL_BEGIN

@interface RXIMCollectionService : NSObject

/**
 * 获取收藏操作SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/** ###### 以下为扩展业务（暂不支持）######  */
/**
 * 添加收藏
 * @param msgIds 消息id数组
 */
- (void)addCollection:(NSArray * _Nonnull)msgIds
    completionHandler:(void (^)(RXIMError *error))completionHandler;

/**
 * 删除收藏
 * @param msgIds 消息id数组
 */
- (void)deleteCollection:(NSArray * _Nonnull)msgIds
       completionHandler:(void (^)(RXIMError *error))completionHandler;

/**
 * 获取收藏的消息信息列表
 */
- (void)getCollectionList:(void (^)(NSArray<RXIMMessage *> *msgs, RXIMError *error))completionHandler;

@end

NS_ASSUME_NONNULL_END
