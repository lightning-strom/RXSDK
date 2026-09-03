//
//  UIView+Shade.h
//  OverseaSocialApp
//
//  Created by 陈汉 on 2021/4/17.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

typedef enum : NSInteger {
    GradualTypeVertical, //垂直渐变
    GradualTypeHorizontal, //水平渐变
} GradualType;


@interface UIView (Shade)

//渐变
+ (CAGradientLayer *)setGradualChangingColor:(UIView *)view fromColor:(UIColor *)fromColor toColor:(UIColor *)toColor gradualType:(GradualType)gradualType;

+ (CAGradientLayer *)setGradualSizeChangingColor:(CGSize)viewSize fromColor:(UIColor *)fromColor toColor:(UIColor *)toColor gradualType:(GradualType)gradualType;

//设置view指定边框样式
+ (UIView *)setDirectionBorderWithView:(UIView *)view top:(BOOL)hasTopBorder left:(BOOL)hasLeftBorder bottom:(BOOL)hasBottomBorder right:(BOOL)hasRightBorder borderColor:(UIColor *)borderColor withBorderWidth:(CGFloat)borderWidth;

//设置指定圆角
+ (CAShapeLayer *)drawCornerRadiusWithRect:(CGRect)rect corners:(UIRectCorner)corners size:(CGSize)size;

@end

NS_ASSUME_NONNULL_END
