//
//  RXUserInfoModel.h
//  RXSDK
//
//  Created by 陈汉 on 2021/9/29.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

typedef enum : NSUInteger {
    RXUserType_visitor, // 游客登录
    RXUserType_apple,   // 苹果登录
    RXUserType_w,       // 微信登录
    RXUserType_auth,    // 一键登录
    RXUserType_account, // 账号登录
} RXUserType;

@interface RXUserInfoModel : NSObject
@property (nonatomic, assign) RXUserType userType; // 账号类型
@property (nonatomic, copy) NSString *wxAppid; // 微信登录appid
/**
 * 非账号登录方式下面不用传
 */
@property (nonatomic, copy) NSString *userName; // 展示的用户名，不传默认展示手机号
@property (nonatomic, copy) NSString *userIcon;
@property (nonatomic, copy) NSString *userPassword;
@property (nonatomic, copy) NSString *userPhone;
@end

NS_ASSUME_NONNULL_END
