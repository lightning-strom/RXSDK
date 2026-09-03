//
//  RXZaloService.h
//  RXZaloSDK
//
//  Created by 陈汉 on 2024/3/22.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

typedef enum : NSUInteger {
    RXZaloSDKAuthenTypeViaZaloAppOnly = 0,
    RXZaloSDKAuthenTypeViaWebViewOnly = 1,
    RXZAloSDKAuthenTypeViaZaloAppAndWebView = 2
} RXZAloSDKAuthenType;


@interface RXZaloService : NSObject

/**
 * 获取SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/**
 * 初始化 Zalo
 */
- (void)initWithAppId:(NSString *)appid;

/**
 * openUrl 处理跳转信息
 */
- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options;

/**
 * Zalo 登录
 * @param type 登录类型
 */
- (void)loginWithAuthenType:(RXZAloSDKAuthenType)type
                        ext:(NSDictionary * _Nullable)ext;

/**
 * Zalo 分享
 */
- (void)shareWithShareInfo:(NSDictionary *)shareInfo
                  complete:(void(^)(NSDictionary *response))complete;

@end

NS_ASSUME_NONNULL_END
