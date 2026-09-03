//
//  RXWXService.h
//  RXWXSDK
//
//  Created by 陈汉 on 2022/5/30.
//

#import <Foundation/Foundation.h>
#import <RXSDK_Pure/RXSDK_Pure.h>
#import "RXWXBusinessModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXWXService : NSObject

/**
 * 获取SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/**
 * 配置universallink
 */
- (void)configUniversallink:(NSString *)universallink;

/**
 * 微信分享
 * @param shareInfo 获取分享信息返回的内容  必须
 * ！shareInfo参数说明：
 * ！title 链接标题
 * ！url 分享链接
 * ！material_type 分享类型
 * ！image 分享图片
 * ！content 分享文案
 */
- (void)shareToWWithShareInfo:(NSDictionary *)shareInfo
                     complete:(void(^)(BOOL success))complete;

/**
 * 微信分享New 返回具体错误码
 * @param shareInfo 获取分享信息返回的内容  必须
 * ！shareInfo参数说明：
 * ！title 链接标题
 * ！url 分享链接
 * ！material_type 分享类型
 * ！image 分享图片
 * ！content 分享文案
 */
- (void)newShareToWWithShareInfo:(NSDictionary *)shareInfo
                        complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/**
 * 微信分享（直接调用，不需要获取分享信息）
 * @param func 埋点标识  必须
 * @param platform 分享平台 wechat
 * @param region 地区码  非必须
 * @param transmits 透传参数，原样返回， 请使用key=value形式，并对值使用urlencode，返回时会原样返回  非必须
 * @param ext 扩展字段，拼接url用  非必须
 */
- (void)shareToWWithFunc:(NSString *)func
                platform:(NSString *)platform
                  region:(NSString *)region
               transmits:(NSString * _Nullable)transmits
                     ext:(NSDictionary * _Nullable)ext
                complete:(void(^)(BOOL success))complete DEPRECATED_MSG_ATTRIBUTE("use newShareToWWithFunc:platform:region:transmits:ext:complete instead");

/**
 * 微信分享（直接调用，不需要获取分享信息）New 返回具体错误码
 * @param func 埋点标识  必须
 * @param platform 分享平台 wechat
 * @param region 地区码  非必须
 * @param transmits 透传参数，原样返回， 请使用key=value形式，并对值使用urlencode，返回时会原样返回  非必须
 * @param ext 扩展字段，拼接url用  非必须
 */
- (void)newShareToWWithFunc:(NSString *)func
                   platform:(NSString *)platform
                     region:(NSString *)region
                  transmits:(NSString * _Nullable)transmits
                        ext:(NSDictionary * _Nullable)ext
                   complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/**
 * 微信登录
 * @param wxAppid 微信登录appid
 * @param migrate_args 任意合法的 json 类型, 比如 string, nujber，账号迁移用的参数, 调用 CP account-query 及 account-queryandbind 接口时透传给 CP  非必须
 * @param sign_fields 指定对登录成功后返回的特定字段, 使用 CPKEY 计算签名. CP 服务器可重新计算签名并与登录返回的签名比对, 作为对瑞雪登录数据的校验. 支持的字段包括: nickname, avatar, openid, region, sex, age, 计算签名的逻辑会对指定字段进行排序, 此处传参与顺序无关。类型为字符串数组 @[@"nickname",@"avatar"]  非必须
 */
- (void)loginReq_wWithWXAppid:(NSString *)wxAppid
                 migrate_args:(id _Nullable)migrate_args
                  sign_fields:(NSArray * _Nullable)sign_fields;

/**
 * 检测是否安装微信
 */
- (BOOL)isWXAppInstalled;

/**
 * 跳转到微信并打开小程序
 * @param params 跳转参数
 * ！username 小程序id    #NSString类型
 * ！appid 微信appid    #NSString类型
 * ！path 拉起小程序页面的可带参路径，不填默认拉起小程序首页，对于小游戏，可以只传入 query 部分，来实现传参效果，如：传入 "?foo=bar"。    #NSString类型
 * ！miniProgramType 小程序类型  0正式版 1开发版 2体验版    #NSInteger类型
 * ！ext 扩展信息    #NSString类型
 * ！extDic 可存放图片等比较大的数据    #NSDictionary类型
 * @param complete 回调，需要小程序接入跳转回到app的功能，否则回调不会执行
 */
- (void)openMiniProgram:(NSDictionary *)params
               complete:(void(^)(NSString *extMsg))complete;

/**
 * 处理旧版微信通过URL启动App时传递的数据
 * 需要在 application:openURL:sourceApplication:annotation:或者application:handleOpenURL中调用。
 * @param url 微信启动第三方应用时传递过来的URL
 */
- (BOOL)handleOpenUrl:(NSURL *)url;

/**
 * 处理微信通过Universal Link启动App时传递的数据
 * 需要在 application:continueUserActivity:restorationHandler:中调用。
 * @param userActivity 启动第三方应用时系统API传递过来的userActivity
 */
- (BOOL)handleOpenUniversalLink:(NSUserActivity *)userActivity;

/**
 * 同步信息
 * 调用后会跳转到微信授权登录，但不会走登录回调，同步信息通过此接口回调
 * @param wxAppid 微信登录appid
 */
- (void)syncInfoWithWXAppid:(NSString *)wxAppid
                   complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/**
 * business
 */
- (void)openBusinessViewWithModel:(RXWXBusinessModel *)model;

@end

NS_ASSUME_NONNULL_END
