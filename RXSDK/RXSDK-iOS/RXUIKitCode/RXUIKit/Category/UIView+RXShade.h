//
//  UIView+RXShade.h
//  RXSDK
//
//  Created by 陈汉 on 2021/10/25.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface UIView (RXShade)

//设置指定圆角
+ (CAShapeLayer *)drawCornerRadiusWithRect:(CGRect)rect corners:(UIRectCorner)corners size:(CGSize)size;

- (void)viewTransform;

@end

NS_ASSUME_NONNULL_END
