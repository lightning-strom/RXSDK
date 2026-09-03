//
//  UIView+RXShade.m
//  RXSDK
//
//  Created by 陈汉 on 2021/10/25.
//

#import "UIView+RXShade.h"
#import "RXUICommonTool.h"

@implementation UIView (RXShade)

+ (CAShapeLayer *)drawCornerRadiusWithRect:(CGRect)rect corners:(UIRectCorner)corners size:(CGSize)size
{
    CAShapeLayer *shapeLayer = [CAShapeLayer layer];
    shapeLayer.path = [UIBezierPath bezierPathWithRoundedRect:rect byRoundingCorners:corners cornerRadii:size].CGPath;
    
    return shapeLayer;
}

- (void)viewTransform
{
    double scale = (RXAC ? RXUScreenHeight : RXUScreenWidth) / 375.0;
    self.transform = CGAffineTransformMakeScale(scale, scale);
    for (UIView *v in self.subviews) {
        v.transform = CGAffineTransformMakeScale(scale, scale);
    }
}

@end
