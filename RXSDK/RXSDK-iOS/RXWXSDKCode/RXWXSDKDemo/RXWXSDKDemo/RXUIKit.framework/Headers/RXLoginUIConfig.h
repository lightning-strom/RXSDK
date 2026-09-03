//
//  RXLoginUIConfig.h
//  RXUIKit
//
//  Created by 陈汉 on 2023/3/15.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXLoginUIConfig : NSObject
/**
 * @param loginTypes 要配置的登录类型，按照数组顺序展示
 * wechat    微信
 * visitor      游客登录
 * apple       苹果登录
 * auth         一键登录
 * account   账号登录
 * history     历史账号
 */
@property (nonatomic, strong) NSArray *loginTypes;
/**
 * 协议地址，顺序为 0位用户协议，1位隐私协议
 */
@property (nonatomic, strong) NSArray *privacies;
/**
 * 登录显示的logo，不配置默认显示标题
 */
@property (nonatomic, strong) UIImage *logoImage;

@end

NS_ASSUME_NONNULL_END
