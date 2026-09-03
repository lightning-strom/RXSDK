//
//  RXABManager.h
//  RXSDK-Pure
//
//  Created by 陈汉 on 2024/5/22.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXABManager : NSObject

/**
 * 获取SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/**
 * 上报通讯录
 */
- (void)reportAddressBookList;

@end

NS_ASSUME_NONNULL_END
