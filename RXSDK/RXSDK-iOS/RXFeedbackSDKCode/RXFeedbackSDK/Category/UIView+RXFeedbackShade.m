//
//  UIView+RXFeedbackShade.m
//  RXUIKit-OS
//
//  Created by 陈汉 on 2023/6/16.
//

#import "UIView+RXFeedbackShade.h"
#import "RXFeedbackTool.h"

@implementation UIView (RXFeedbackShade)

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
