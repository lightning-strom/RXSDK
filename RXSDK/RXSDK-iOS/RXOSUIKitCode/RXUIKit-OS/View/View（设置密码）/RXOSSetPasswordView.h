//
//  RXOSSetPasswordView.h
//  RXUIKit
//
//  Created by 陈汉 on 2023/5/4.
//

#import <UIKit/UIKit.h>
#import "RXOSCommonHeader.h"
#import "RXOSCommonTool.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXOSSetPasswordView : UIView

- (instancetype)initWithComplete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

@end

NS_ASSUME_NONNULL_END
