//
//  RXLineService.h
//  RXLineSDK
//
//  Created by 陈汉 on 2023/3/8.
//

#import <Foundation/Foundation.h>
#import <RXSDK_Pure/RXSDK_Pure.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXLineService : NSObject

/**
 * 获取SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/**
 * 开始登录
 * @param permissions 获取的权限数组
 * @param sign_fields 指定对登录成功后返回的特定字段, 使用 CPKEY 计算签名. CP 服务器可重新计算签名并与登录返回的签名比对, 作为对瑞雪登录数据的校验. 支持的字段包括: nickname, avatar, openid, region, sex, age, 计算签名的逻辑会对指定字段进行排序, 此处传参与顺序无关。类型为字符串数组 @[@"nickname",@"avatar"]  非必须
 * @param migrate_args 任意合法的 json 类型, 比如 string, number，账号迁移用的参数, 调用 CP account-query 及 account-queryandbind 接口时透传给 CP  非必须
 */
- (void)loginWithPermissions:(nonnull NSArray <NSString *>*)permissions
                 sign_fields:(NSArray * _Nullable)sign_fields
                migrate_args:(id _Nullable)migrate_args;

/**
 * 处理跳转
 */
- (BOOL)handleOpenURL:(NSURL *)url;

/**
 * Line 分享
 * @param content 分享描述
 * @param url 分享链接
 */
- (void)shareWithContent:(NSString *)content
                     url:(NSString *)url
                complete:(RequestComplete)complete;

/**
 * 检测line是否安装
 */
- (BOOL)checkLineIsInstall;

/**
 * 同步信息
 * 调用后会跳转到Line授权登录，但不会走登录回调，同步信息通过此接口回调
 */
- (void)syncInfoWithComplete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

@end

NS_ASSUME_NONNULL_END
