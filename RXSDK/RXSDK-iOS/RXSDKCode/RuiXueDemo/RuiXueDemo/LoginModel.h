//
//  LoginModel.h
//  RuiXueDemo
//
//  Created by 陈汉 on 2021/10/29.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface LoginModel : NSObject

@property (nonatomic, assign) NSInteger code; // 响应码
@property (nonatomic, assign) NSInteger uid;  // 用户id
@property (nonatomic, assign) NSInteger attr;  // 位运算 用户扩展属性（0-未实名未绑定手机号，1-已实名认证，2-已绑定手机）
@property (nonatomic, assign) NSInteger sex;  // 性别
@property (nonatomic, assign) NSInteger flag; // 本次登录逻辑标记位运算（1-是否新用户, 2-是否进行防沉迷控制, 4-游客是否绑定了三方账号(仅在游客登录返回时有效)）
@property (nonatomic, assign) NSInteger aas;  // 防沉迷控制下剩余可游戏秒数(flag字段防沉迷+aas剩余秒数判断是否受限)
@property (nonatomic, copy) NSString *msg;    // 响应消息
@property (nonatomic, copy) NSString *token;  // 令牌
@property (nonatomic, copy) NSString *openid;  // 平台用户标识
@property (nonatomic, copy) NSString *username;  // 用户名
@property (nonatomic, copy) NSString *nickname;  // 昵称
@property (nonatomic, copy) NSString *avatarUrl;  // 头像地址
@property (nonatomic, copy) NSString *realname;  // 真实姓名
@property (nonatomic, copy) NSString *mobilephone;  // 绑定的手机号
@property (nonatomic, copy) NSString *beforemobilephone;  // 上一次绑定的手机号
@property (nonatomic, copy) NSString *idcard;  // 身份证号码
@property (nonatomic, copy) NSString *login_openid; // 加密后的瑞雪openid 二次登录时使用

@end

NS_ASSUME_NONNULL_END
