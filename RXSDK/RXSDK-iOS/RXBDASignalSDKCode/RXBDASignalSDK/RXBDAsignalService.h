//
//  RXBDAsignalService.h
//  RXBDASignalSDK
//
//  Created by 陈汉 on 2025/3/5.
//

#import <Foundation/Foundation.h>
#import <BDASignalSDK/BDASignalSDK.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXBDAsignalService : NSObject

@property (nonatomic, assign) BOOL isRegist;
@property (nonatomic, assign) BOOL isWindowRegist;
@property (nonatomic, strong) NSDictionary *launchOptions;
@property (nonatomic, strong) UISceneConnectionOptions *connetOptions;

/**
 * 获取SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/**
 * 注册可选参数
 */
- (void)registerWithOptionalData:(NSDictionary *)data;

/**
 * 上报冷启动事件（激活）
 * @note 立即上报
 */
- (void)didFinishLaunchingWithOptions:(NSDictionary *)launchOptions connectOptions:(UISceneConnectionOptions *)connetOptions;

/**
 * 上报冷启动事件（激活）
 * @note 调用后不会立即激活，根据窗口期上报
 */
- (void)windowDidFinishLaunchingWithOptions:(NSDictionary *)launchOptions connectOptions:(UISceneConnectionOptions *)connetOptions;

/**
 * 开启 IDFA 采集，默认关闭
 */
- (void)enableIdfa:(BOOL)enable;

/**
 * 获取 clickid
 */
- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options;

/**
 * 开启延时上报
 */
- (void)enableDelayUpload;

/**
 * 允许数据上报
 */
- (void)startSendingEvents;

/**
 * 上报关键事件
 */
- (void)trackEssentialEventWithName:(NSString *)key params:(NSDictionary *)params;

- (UISceneConnectionOptions *)connetOptions;
- (NSDictionary *)launchOptions;

@end

NS_ASSUME_NONNULL_END
