//
//  ApproveView.h
//  RXSDK
//
//  Created by 陈汉 on 2021/9/26.
//

#import <UIKit/UIKit.h>
#import "RXUICommonTool.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXApproveView : UIView

- (instancetype)initWithCanColose:(BOOL)canClose
                         complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))block;

- (void)hide;

@end

NS_ASSUME_NONNULL_END

