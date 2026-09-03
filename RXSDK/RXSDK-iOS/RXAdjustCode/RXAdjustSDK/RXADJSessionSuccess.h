//
//  RXADJSessionSuccess.h
//  RXAdjustSDK
//
//  Created by 陈汉 on 2023/8/11.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXADJSessionSuccess : NSObject

/**
 * @brief 来自调整后端的消息
 */
@property (nonatomic, copy) NSString *message;

/**
 * @brief 来自调整后端的时间戳
 */
@property (nonatomic, copy) NSString *timeStamp;

/**
 * @brief 调整设备标识符
 */
@property (nonatomic, copy) NSString *adid;

/**
 * @brief JSON格式的后端响应
 */
@property (nonatomic, strong) NSDictionary *jsonResponse;

@end

NS_ASSUME_NONNULL_END
