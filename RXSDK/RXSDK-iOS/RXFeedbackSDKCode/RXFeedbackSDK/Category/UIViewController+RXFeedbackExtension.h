//
//  UIViewController+RXFeedbackExtension.h
//  RXUIKit-OS
//
//  Created by 陈汉 on 2023/6/15.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface UIViewController (RXFeedbackExtension)

/**
 *  返回当前控制器
 *  @return 控制器
 */
+ (UIViewController *)currentViewController;

@end

NS_ASSUME_NONNULL_END
