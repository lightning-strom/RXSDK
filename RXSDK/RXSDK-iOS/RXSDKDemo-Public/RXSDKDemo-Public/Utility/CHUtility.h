//
//  CHUtility.h
//  RXSDKDemo-Public
//
//  Created by 陈汉 on 2024/1/2.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN
typedef void(^BackAppInfoBlock)(NSArray *sloginTypes, NSArray *sloginTitles, NSArray *sloginImgs);

@interface CHUtility : NSObject

@property (nonatomic, assign) BOOL isOS;
@property (nonatomic, assign) NSInteger loginType; // 1验证码 2账号密码
@property (nonatomic, strong) NSString *language;
@property (nonatomic, strong) NSMutableArray *loginTypes;
@property (nonatomic, copy) BackAppInfoBlock block;
@property (nonatomic, copy) BackAppInfoBlock shareBlock;
@property (nonatomic, copy) BackAppInfoBlock platformShareBlock;
@property (nonatomic, assign) BOOL isDebug;//YES Debug模式；NO release模式，默认为NO

+ (instancetype)sharedManager;

/**
 * 根据传入的登录方式集合，判断手机端是否安装了对应的app，并返回对应信息
 * 已安装的app则返回对应登录方式、图标、名称；未安装则不返回对应登录方式对应的登录方式、图标、名称
 * @param loginTypesArray 登录方式数组 e.g. @[@"guest", @"username", @"code"]
 * @param block 登录方式中已安装的平台信息
 *
 */
- (void)checkLoginTypes:(NSArray *)loginTypesArray backBlock:(BackAppInfoBlock)block;

/**
 * 根据传入的分享方式集合，返回对应的分享平台数组，包含对应的model。此方法分享类型、参数固定，例如 微信分享链接(朋友圈)、微信分享图片(对话)
 * 已安装的app则返回对应登录方式、图标、名称；未安装则不返回对应登录方式对应的登录方式、图标、名称
 * @param shareTypesArray 登录方式数组 e.g. @[@"wechat", @"tiktok", @"snapchat"]
 * @param block 分享方式中已安装的平台信息
 */
- (void)checkShareTypes:(NSArray *)shareTypesArray backBlock:(BackAppInfoBlock)block;

/**
 * 根据传入的分享方式集合，返回对应的分享平台数组，包含对应的model。此方法只返回平台分享，例如 微信分享
 * 已安装的app则返回对应登录方式、图标、名称；未安装则不返回对应登录方式对应的登录方式、图标、名称
 * @param shareTypesArray 登录方式数组 e.g. @[@"wechat", @"tiktok", @"snapchat"]
 * @param block 分享方式中已安装的平台信息
 */
- (void)checkPlatformShareTypes:(NSArray *)shareTypesArray backBlock:(BackAppInfoBlock)block;

/**
 * 根据传入的支付方式集合，返回对应的支付平台数组，包含对应的model
 * 已安装的app则返回对应支付方式、图标、名称；未安装则不返回对应支付方式对应的复制方式、图标、名称
 * @param payTypesArray 登录方式数组 e.g. @[@"appstore", @"wechat"]
 * @param block 支付方式中已安装的平台信息
 */
- (void)checkPayTypes:(NSArray *)payTypesArray backBlock:(BackAppInfoBlock)block;


@end

NS_ASSUME_NONNULL_END
