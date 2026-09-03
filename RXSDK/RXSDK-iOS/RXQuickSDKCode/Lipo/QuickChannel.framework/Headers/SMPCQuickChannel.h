//
//  SMPCQuickPlatform.h
//  QuickPlatforms
//
//  Created by C.Maverick on 14/11/26.
//
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
//#import <QuickChannel/SMPCQuickChannelDefines.h>
//#import <QuickChannel/SMPCQuickChannelShareInfo.h>
//#import <QuickChannel/SMPCQuickRoleInfo.h>
#import "SMPCQuickChannelDefines.h"
#import "SMPCQuickRoleInfo.h"
#import "SMPCQuickChannelShareInfo.h"

#pragma mark 基本信息


@interface SMPCQuickChannel : NSObject {
    NSArray *unsupportedFunctionList;
}

+ (SMPCQuickChannel *)defaultChannel;

- (NSString *)channelName;
- (NSString *)channelVersion;
- (NSString *)channelCode;
- (NSString *)cpsChannelId;
- (NSString *)frameworkVersion;

- (int)callFunction:(int)type args:(va_list)list;
-(NSString *)getPaayParams;//QuickSDK的充值额外参数获取发给QuickSDK服务器端
@end

#pragma mark 初始化 接入产品信息

@interface SMPCQuickChannel(Base)

#pragma mark 初始化

/**
 @brief 应用初始化 完成后会发送kSmpcQPInitDidFinishedNotification
 @param dictionary 读取的配置文件值Channel.plist
 @result 错误码
 */
- (SMPC_CHANNEL_RESULT_CODE)initWithDictionary:(NSDictionary *)dictionary;

- (SMPC_CHANNEL_RESULT_CODE)initWithDictionary:(NSDictionary *)dictionary application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions;

//调用插件功能
- (int)callPlug:(NSString *)name params:(NSArray *)args;
// 进入暂停页
- (SMPC_CHANNEL_RESULT_CODE)pause;

#pragma mark 是否打开调试模式
- (SMPC_CHANNEL_RESULT_CODE)setDebugMode;

@end



#pragma mark 用户部分 登录 注册 登出

@interface SMPCQuickChannel(Account)

#pragma mark 登陆

/**
 @brief 登录平台,默认自动登陆，支持游客账号登陆 登陆后会发送kSmpcQPLoginNotification
 @result 错误码
 */
- (SMPC_CHANNEL_RESULT_CODE)login;

#pragma mark 注销

/**
 @brief 注销
 @result 错误码
 */
- (SMPC_CHANNEL_RESULT_CODE)logout;

#pragma mark 登陆用户信息
- (NSString *)userId;
- (NSString *)userNick;
- (NSString *)sessionId;
- (NSDictionary *)realNameInfo;
- (int)realAuth;
- (int)userType;
- (NSDictionary *)userExtInfo;
- (void)updateUserId:(NSString *)userId; //如果渠道本地有uid就不用使用服务器端的更新
- (void)updateUserNick:(NSString *)userNick; //如果渠道本地有用户名就不用使用服务器端的更新
- (void)updateUserDict:(NSDictionary *)dict;

#pragma mark 更新角色信息
- (void)updateRoleInfoWith:(SMPCQuickRoleInfo *)info;
- (void)updateRoleInfoWith:(SMPCQuickRoleInfo *)info isCreate:(BOOL)isCreate;

// 登录校验等级
- (SMPC_CHANNEL_LOGINCHECK_LEVEL)loginCheckLevel;

/**
 * 是否开启第三方登录
 */
-(void)openThirdLogin:(BOOL)thirdLogin;
/**
 *  获取当前用户的ID
 *
 *  @return 获取当前用户的ID，如未登录则返回空
 */
- (NSString *)getIdCode;
/**
 *  是否游客账号
 *
 *  @return 获取当前用户的ID，如未登录则返回空
 */
-(BOOL)isGuester;
/**
 * 绑定身份证
 */
-(void)ShowCertification;
/**
 * 游客绑定并绑定身份证
 */
-(void) BindCertification;

@end




#pragma mark -
#pragma mark 各种中心

@interface SMPCQuickChannel(Centers)

/**
 @brief 进入用户中心 如用户注销登录会发送kSmpcQPLogoutNotification（可多次触发）
 @result 错误码
 //渠道支持才去实现这个接口
 */
- (SMPC_CHANNEL_RESULT_CODE)enterUserCenter;
- (SMPC_CHANNEL_RESULT_CODE)callSpecifyFunction:(NSInteger)functionName parameters:(NSDictionary *)parameterDict;
//打开渠道SDK的BBS，渠道支持才去实现这个接口
- (SMPC_CHANNEL_RESULT_CODE)enterBBS;

//打开渠道SDK的客服界面，渠道支持才去实现这个接口
- (SMPC_CHANNEL_RESULT_CODE)enterCustomerServiceCenter;

//分享
- (SMPC_CHANNEL_RESULT_CODE)callSDKShare:(SMPCQuickChannelShareInfo *)shareInfo;
//隐私弹窗
- (void)showPrivacyView:(void (^)(BOOL isAgreed))isAgreed;

/*  facebook分享连接
 *  @param url  分享网址
 *  @param quote  网页说明
 */
-(void)FBShareLink:(NSString*)url quote:(NSString*)quote;

/*  facebook分享图片
 *  @param filePath  图片路径
 */
-(void)FBShareImage:(NSString*)filePath;

/*  微信分享文本
 *  @param test  分享文本
 *  @param scene 发送场景：0 聊天界面，1 朋友圈，2 收藏
 */
-(void)WXShareText:(NSString*)test sencetype:(int) scene;

/*  微信分享图片
 *  @param filePath  图片路径
 *  @param width  缩略图宽
 *  @param height  缩略图高
 *  @param scene 发送场景：0 聊天界面，1 朋友圈，2 收藏
 */
-(void)WXShareImage:(NSString*)filePath thumbWidth:(float) width thumbHeight:(float) height sencetype:(int) scene;

@end


#pragma mark 充值、 支付

@class SMPCQuickProductInfo;
@class SMPCQuickRoleInfo;

@interface SMPCQuickChannel(Pay)

#pragma mark 代币充值
//基础库向QuickChannel传递从服务器下单回来的数据。
- (void)updatePayDict:(NSDictionary *)dict;
/**
 @brief 进入虚拟币充值界面 如果渠道没有充值回调，就模拟一个QuickChannel充值回调，实际充值结果以服务器同步为准
 @result 错误码 通常为0，也不必关心
 */
- (SMPC_CHANNEL_RESULT_CODE)buyOrderId:(NSString *)orderId
      productInfo:(SMPCQuickProductInfo *)product
         roleInfo:(SMPCQuickRoleInfo *)role;

//2017.7.25 add begin
- (NSString *)getProductDescFromProduct:(SMPCQuickProductInfo *)product;
//
//探娱海外获取商品信息APi:传入的时候是productId如果多个用，分割，如：vol01,chips01,chips02,返回值监听kSmpcQCGetLocalizedNotification

//
-(void)Getlocalized:(NSString *)productIds;
@end


#pragma mark 界面控制
@interface SMPCQuickChannel(UISetting)

#pragma mark 方向控制
/**
 //deprecated
 @brief 设定平台为横屏或者竖屏
 @note  1、其中设置的方向需要在 app plist文件Supported interface orientations 中支持
 */
- (SMPC_CHANNEL_RESULT_CODE)setChannelOrientation:(UIInterfaceOrientationMask)orientation;

/**
 //deprecated
 @brief 设置是否自动旋转。
 @note  1、设置NO后，平台页面使用setPlatformOrientation设置的方向
 2、设置Yes后，平台页面自适应旋转。
 */
- (SMPC_CHANNEL_RESULT_CODE)setAutoRotation:(BOOL)isAutoRotate;

#pragma mark 浮动条
//显示浮动菜单
- (SMPC_CHANNEL_RESULT_CODE)showToolBar:(SMPC_CHANNEL_TOOLBAR_PLACE)place;
//隐藏浮动菜单
- (SMPC_CHANNEL_RESULT_CODE)hideToolBar;

@end


#pragma mark 回调处理

@interface SMPCQuickChannel (URL)


- (SMPC_CHANNEL_RESULT_CODE)openURL:(NSURL *)url sourceApplication:(NSString *)sourceApp application:(UIApplication *)application annotation:(id)annotation;
// add
- (SMPC_CHANNEL_RESULT_CODE)openURL:(NSURL *)url application:(UIApplication *)application;
- (SMPC_CHANNEL_RESULT_CODE)openURL:(NSURL *)url application:(UIApplication *)app options:(NSDictionary <NSString *, id> *)options;
//推送
- (SMPC_CHANNEL_RESULT_CODE)application:(UIApplication*)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData*)deviceToken;
- (SMPC_CHANNEL_RESULT_CODE)application:(UIApplication*)application didFailToRegisterForRemoteNotificationsWithError:(NSError*)error;
- (SMPC_CHANNEL_RESULT_CODE)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo;
//AppDelegate事件
- (SMPC_CHANNEL_RESULT_CODE)applicationWillResignActive:(UIApplication *)application;

- (SMPC_CHANNEL_RESULT_CODE)applicationDidEnterBackground:(UIApplication *)application;

- (SMPC_CHANNEL_RESULT_CODE)applicationWillEnterForeground:(UIApplication *)application;
- (SMPC_CHANNEL_RESULT_CODE)applicationDidBecomeActive:(UIApplication *)application;
- (SMPC_CHANNEL_RESULT_CODE)applicationWillTerminate:(UIApplication *)application;
- (NSUInteger)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window;
- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void(^)(NSArray * restorableObjects))restorationHandler;

@end




