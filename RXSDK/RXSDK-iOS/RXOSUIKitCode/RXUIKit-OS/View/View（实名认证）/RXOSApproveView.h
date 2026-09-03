//
//  ApproveView.h
//  RXSDK
//
//  Created by 陈汉 on 2021/9/26.
//

#import <UIKit/UIKit.h>
#import "RXOSCommonTool.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXOSApproveView : UIView

- (instancetype)initWithCanColose:(BOOL)canClose
                         complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))block;

@end

NS_ASSUME_NONNULL_END

