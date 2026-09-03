//
//  RXLBSKitService.h
//  RXLBSKit
//
//  Created by 陈汉 on 2022/4/26.
//

#import <Foundation/Foundation.h>
#import "RXLBSModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXLBSKitService : NSObject

/**
 * 获取SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/**
 * 注册高德key
 */
- (void)registeAMWithAppkey:(NSString *)appkey;

/**
 * 判断定位权限
 * @return YES有定位权限，NO没有定位权限
 */
- (BOOL)enableLocationAuthorizationStatus;

/**
 * 请求定位权限
 */
- (void)requestLocationAuthorization:(void(^)(BOOL authorization))complete;

/**
 * 获取位置信息
 */
- (void)getLocationInfo:(void(^)(RXLBSModel *location, NSError *error))complete;

/**
 * 是否允许后台定位  默认为NO不开启后台定位
 */
- (void)setAllowsBackgroundLocationUpdates:(BOOL)allow;

/**
 * 设置定位超时时间  默认为2秒
 */
- (void)setLocationTimeout:(NSInteger)locationTimeout;

@end

NS_ASSUME_NONNULL_END
