//
//  RXAuthLoginConfig.h
//  RXAuthLoginKit
//
//  Created by 陈汉 on 2023/4/4.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXAuthLoginConfig : NSObject

/**
 * 一键登录秘钥
 */
@property (nonatomic, strong) NSString *authKey;
/**
 * 协议默认是否勾选
 */
@property (nonatomic, assign) BOOL checkBoxIsChecked;
/**
 * 协议地址，顺序为 0位用户协议，1位隐私协议
 */
@property (nonatomic, strong) NSArray *privacies;
/**
 * 协议显示名称，顺序为 0位用户协议，1位隐私协议
 */
@property (nonatomic, strong) NSArray *privacieTitles;
/**
 * 登录显示的logo，不配置默认显示标题
 */
@property (nonatomic, strong) UIImage *logoImage;
/**
 * 扩展信息
 */
@property (nonatomic, strong) NSDictionary *ext;
/**
 * 指定对登录成功后返回的特定字段, 使用 CPKEY 计算签名. CP 服务器可重新计算签名并与登录返回的签名比对, 作为对瑞雪登录数据的校验. 支持的字段包括: nickname, avatar, openid, region, sex, age, 计算签名的逻辑会对指定字段进行排序, 此处传参与顺序无关。类型为字符串数组 @[@"nickname",@"avatar"]
 */
@property (nonatomic, strong) NSArray *sign_fields;
/**
 * 任意合法的 json 类型, 比如 string, number，账号迁移用的参数, 调用 CP account-query 及 account-queryandbind 接口时透传给 CP  非必须
 */
@property (nonatomic, assign) id migrate_args;

@end

NS_ASSUME_NONNULL_END
