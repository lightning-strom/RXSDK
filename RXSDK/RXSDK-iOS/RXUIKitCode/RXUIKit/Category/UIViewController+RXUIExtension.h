//
//  UIViewController+Extension.h
//  RXSDK
//
//  Created by 陈汉 on 2021/9/26.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface UIViewController (RXExtension)

/**
 *  返回当前控制器
 *  @return 控制器
 */
+ (UIViewController *)currentViewController;

@end

NS_ASSUME_NONNULL_END
