//
//  RXAppListService.h
//  RXAppListSDK
//
//  Created by 陈汉 on 2024/3/28.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

typedef void(^GetAppInfoBlock)(NSArray *result);

@interface RXAppListService : NSObject

/**
 * 获取SDK实例（单例）
 */
+ (instancetype)sharedSDK;

- (void)regist;

- (void)getAppInfoWithConfig:(NSDictionary *)config
                    complete:(GetAppInfoBlock)complete;

@end

NS_ASSUME_NONNULL_END
