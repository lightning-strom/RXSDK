//
//  RXBusinessManager.h
//  RXSDK
//
//  Created by 陈汉 on 2023/5/29.
//

#import <Foundation/Foundation.h>
#import "RXCommonTool.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXBusinessManager : NSObject

/**
 * 获取SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/**
 * 获取商业化数据
 */
- (void)getBusinessInfo;

/**
 * 商业化下单
 * @param trade_no CP订单号
 * @param sign 获取商业化数据返回的sign
 */
- (void)requestBusinessOrderWithTrade_no:(NSString *)trade_no
                                    sign:(NSString *)sign
                                complete:(RequestComplete)complete;

@end

NS_ASSUME_NONNULL_END
