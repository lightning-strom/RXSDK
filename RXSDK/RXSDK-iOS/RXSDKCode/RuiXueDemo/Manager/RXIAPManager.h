//
//  RXIAPManager.h
//  RXSDK
//
//  Created by 陈汉 on 2024/5/7.
//

#import <Foundation/Foundation.h>
#import "RXPublicHeader.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXIAPManager : NSObject

/**
 * 获取SDK实例（单例）
 */
+ (instancetype)sharedSDK;

- (void)type:(NSString *)type
        info:(NSDictionary *)dicm
    complete:(RequestComplete)complete;

+ (NSString *)fetchType:(NSString *)type;

/**
 * 保存商品信息
 */
- (void)saveProductInfo;

/**
 * 获取初始化保存的计费点
 */
- (NSDictionary *)getProductInfo;

/**
 * 兑换
 */
- (void)exchangeWithDic:(NSDictionary *)dic
               complete:(RequestComplete)complete;

@end

NS_ASSUME_NONNULL_END
