//
//  RXServiceCenterView.h
//  RXUIKit
//
//  Created by 陈汉 on 2023/6/27.
//

#import <UIKit/UIKit.h>
#import "RXUserCenterConfig.h"
#import "RXUICommonHeader.h"

typedef enum : NSUInteger {
    ServiceType_chat,
    ServiceType_center,
} ServiceType;

NS_ASSUME_NONNULL_BEGIN

@interface RXServiceCenterView : UIView

- (instancetype)initWithConfig:(RXUserCenterConfig *)config
                          type:(ServiceType)type
                      complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

// 最大化
- (void)showView;

@end

NS_ASSUME_NONNULL_END
