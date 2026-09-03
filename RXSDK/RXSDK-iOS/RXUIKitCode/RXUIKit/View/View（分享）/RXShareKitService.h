//
//  RXShareKitService.h
//  RXShareKit
//
//  Created by 陈汉 on 2022/5/25.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN


typedef enum : NSUInteger {
    RXShareType_wfriend, // 微信好友
    RXShareType_wcricle, // 微信朋友圈
    RXShareType_qq,      // qq
    RXShareType_sina     // 微博
} RXShareType;


typedef void(^RXShareClickBlock)(RXShareType shareType);


@interface RXShareKitService : NSObject

+ (instancetype)sharedManger;

/**
 * @param types 分享类型
 * @param round 是否设置圆形背景，默认NO
 * @param clickBlock 点击回调
 */
- (void)showShareWithTypes:(NSArray *)types
                     round:(BOOL)round
                clickBlock:(RXShareClickBlock)clickBlock;

@end

NS_ASSUME_NONNULL_END
