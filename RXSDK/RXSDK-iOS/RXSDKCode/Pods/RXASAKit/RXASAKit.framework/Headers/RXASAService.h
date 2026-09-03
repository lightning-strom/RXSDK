//
//  RXASAService.h
//  RXASAKit
//
//  Created by 陈汉 on 2023/10/30.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXASAService : NSObject

/**
 * 获取SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/**
 * 初始化
 */
- (void)regist;

/**
 * 获取 ASA 数据
 * @note 如果使用瑞雪SDK上报数据需要在初始化前调用，并保证在回调完成后调用初始化，ASA 获取成功或失败不影响瑞雪SDK功能，只影响 ASA 数据统计，请注意处理调用逻辑
 * @note 获取成功后 SDK 内部保存数据，客户端不需要处理
 */
- (void)getInfoWithComplete:(void(^)(NSDictionary *response, NSDictionary *error))complete;

@end

NS_ASSUME_NONNULL_END
