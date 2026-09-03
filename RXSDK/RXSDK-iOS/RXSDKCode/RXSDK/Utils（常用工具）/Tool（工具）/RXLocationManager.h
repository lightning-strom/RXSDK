//
//  RXLocationManager.h
//  RXSDK
//
//  Created by 陈汉 on 2021/11/26.
//

#import <Foundation/Foundation.h>
#import "RXLocationModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXLocationManager : NSObject

+ (instancetype)sharedManger;

// 上报定位
- (void)openWithDuration:(NSInteger)duration
                   types:(NSArray *)types;

// 停止上报
- (void)stop;

// 获取当前定位
- (void)getLocationInfo:(void(^)(RXLocationModel *locationModel))complete;

@end

NS_ASSUME_NONNULL_END
