//
//  UIColor+ColorUtility.h
//  OverseaSocialApp
//
//  Created by 陈汉 on 2021/4/16.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface UIColor (RXColorUtility)

+ (UIColor *)colorWithHexString:(NSString *)hexString;

+ (UIColor *)getColor:(NSString *)hexColor;

+ (UIColor *)colorWithHexStringToRGB:(NSString *)hexString withAlpha:(CGFloat)alpha;

+ (UIColor *)randomColor;

+ (UIImage *)createImageWithColor:(UIColor *)color size:(CGSize)size radius:(CGFloat)radius;

@end

NS_ASSUME_NONNULL_END
