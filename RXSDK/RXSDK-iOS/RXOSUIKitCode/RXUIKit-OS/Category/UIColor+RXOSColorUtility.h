//
//  UIColor+RXOSColorUtility.h
//  RXUIKit-OS
//
//  Created by 陈汉 on 2023/6/15.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface UIColor (RXOSColorUtility)

+ (UIColor *)colorWithHexString:(NSString *)hexString;

+ (UIColor *)getColor:(NSString *)hexColor;

+ (UIColor *)colorWithHexStringToRGB:(NSString *)hexString withAlpha:(CGFloat)alpha;

+ (UIColor *)randomColor;

+ (UIImage *)createImageWithColor:(UIColor *)color size:(CGSize)size radius:(CGFloat)radius;

@end

NS_ASSUME_NONNULL_END
