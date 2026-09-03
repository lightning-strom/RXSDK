//
//  RXFacebookService.h
//  RXFacebookSDK
//
//  Created by 陈汉 on 2022/8/30.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <RXSDK_Pure/RXSDK_Pure.h>

NS_ASSUME_NONNULL_BEGIN

typedef void(^FBShareCallBack)(BOOL success);

@interface RXFacebookService : NSObject

/**
 * 获取SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/**
 * 注册Facebook
 */
- (void)FBRegistWithApplication:(UIApplication *)application
                  launchOptions:(NSDictionary *)launchOptions;

/**
 * 处理跳转参数
 */
- (BOOL)FBApplication:(UIApplication *)application
              openURL:(NSURL *)url
              options:(NSDictionary<UIApplicationOpenURLOptionsKey, id> *)options;

#pragma mark -- <登录>
/**
 * Facebook登录
 * @param permissions 权限  必须
 * @param extDic 扩展字段，可传nil
 * ！app_associated_bussiness facebook 应用是否有关联到 business（facebook商务管理平台），如果有，则允许一个 facebook 用户从（该 business 关联的）多个 facebook 应用登录返回的瑞雪账号信息相同。如果facebook 应用未关联 business，而登录时此字段传 true，则会返回报错    #BOOL类型
 * @param migrate_args 任意合法的 json 类型, 比如 string, nujber，账号迁移用的参数, 调用 CP account-query 及 account-queryandbind 接口时透传给 CP  非必须
 * @param sign_fields 指定对登录成功后返回的特定字段, 使用 CPKEY 计算签名. CP 服务器可重新计算签名并与登录返回的签名比对, 作为对瑞雪登录数据的校验. 支持的字段包括: nickname, avatar, openid, region, sex, age, 计算签名的逻辑会对指定字段进行排序, 此处传参与顺序无关。类型为字符串数组 @[@"nickname",@"avatar"]  非必须
 */
- (void)FBLoginWithPermissions:(NSArray *)permissions
                        extDic:(NSMutableDictionary *)extDic
                  migrate_args:(id _Nullable)migrate_args
                   sign_fields:(NSArray * _Nullable)sign_fields;

/**
 * Facebook退出登录
 */
- (void)FBLogout;

/**
 * 同步信息
 * 调用后会跳转到Facebook授权登录，但不会走登录回调，同步信息通过此接口回调
 */
- (void)syncInfoWithComplete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

#pragma mark -- <分享>
/**
 * Facebook分享
 * 推荐使用 FBShareWithContent:complete
 * @param shareInfo 获取分享信息返回的内容  必须
 */
- (void)FBShareWithShareInfo:(NSDictionary *)shareInfo
                    complete:(FBShareCallBack)complete DEPRECATED_MSG_ATTRIBUTE("use FBShareWithContent:mode:complete: instead");

/**
 * Facebook分享
 * @param content 分享的结构体
 * @param mode 分享样式， 0为弹框样式  1为跳转到fb app分享
 */
- (void)FBShareWithContent:(id)content
                      mode:(NSInteger)mode
                  complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/**
 * Messenger分享
 * 推荐使用 messengerShareWithContent:complete
 * @param shareInfo 获取分享信息返回的内容  必须
 */
- (void)messengerShareWithShareInfo:(NSDictionary *)shareInfo
                           complete:(FBShareCallBack)complete DEPRECATED_MSG_ATTRIBUTE("use FBShareWithContent:mode:complete: instead");

/**
 * Messenger分享
 * @param content 分享的结构体
 */
- (void)messengerShareWithContent:(id)content
                         complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

@end

NS_ASSUME_NONNULL_END
