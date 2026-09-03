//
//  RXOpeninstallService.h
//  RXOpeninstallSDK
//
//  Created by 陈汉 on 2025/11/18.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

typedef void(^InstallParamsBlock)(NSDictionary *params);

@interface RXOpeninstallService : NSObject

@property (nonatomic, copy) InstallParamsBlock installParamsBlock;

/**
 * 获取SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/**
 * 初始化
 */
- (void)regist;

/**
 * 处理 openUrl 唤起数据
 */
- (void)handleOpenUrl:(NSURL *)url;

/**
 * 处理 通用链接
 * @param userActivity 存储了页面信息，包括url
 * @return bool URL是否被OpenInstall识别
 */
- (BOOL)continueUserActivity:(NSUserActivity *_Nullable)userActivity;

/**
 * 获取安装参数
 */
- (void)getInstallParamsWithComplete:(InstallParamsBlock)complete;

@end

NS_ASSUME_NONNULL_END
