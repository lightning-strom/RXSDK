//
//  RXPrivacyLimitView.h
//  RXUIKit
//
//  Created by 陈汉 on 2024/1/30.
//

#import <UIKit/UIKit.h>
#import "RXUICommonTool.h"

NS_ASSUME_NONNULL_BEGIN

typedef void(^PrivacyLimitClickBlock)(BOOL agree);

@interface RXPrivacyLimitView : UIView

- (instancetype)initWithClickBlock:(PrivacyLimitClickBlock)clickBlock;

@end

NS_ASSUME_NONNULL_END
