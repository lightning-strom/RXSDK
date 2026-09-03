//
//  RXPlayerFeedbackService.h
//  RXFeedbackSDK
//
//  Created by root11 on 2024/10/23.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXPlayerFeedbackService : NSObject

/**
 * 获取SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/**
 * 我的意见反馈列表
 */
- (void)showFeedbackListView;

/**
 * 创建意见反馈
 */
- (void)showCreateFeedbackView;


@end

NS_ASSUME_NONNULL_END
