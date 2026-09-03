//
//  ApproveView.h
//  RXSDK
//
//  Created by 陈汉 on 2021/9/26.
//

#import <UIKit/UIKit.h>
#import "RXCommonRequestError.h"

NS_ASSUME_NONNULL_BEGIN

typedef void(^ApproveBlock)(NSDictionary * _Nullable backData, RXCommonRequestError * _Nullable error);

@interface RXApproveView : UIView

- (instancetype)initWithComplete:(ApproveBlock)block;

@end

NS_ASSUME_NONNULL_END

