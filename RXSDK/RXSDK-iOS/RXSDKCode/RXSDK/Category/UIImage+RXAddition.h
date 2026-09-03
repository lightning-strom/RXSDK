//
//  UIImage+RXAddition.h
//  RXSDK
//
//  Created by 陈汉 on 2021/9/28.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface UIImage (RXAddition)

+ (UIImage *)rxPBundleImageNamed:(NSString *)imageName;

/**
 * 生成二维码图
 * tString:   内容
 * tSize:     大小
 * fillColor: 填充色
 * iconImage: 中间小图标
 */
+ (UIImage *)rxQRCodeForString:(NSString *)tString
                          size:(CGSize)tSize
                     fillColor:(UIColor *)tFillColor
                     iconImage:(UIImage * _Nullable)tIconImage
                    borderSize:(CGFloat)borderSize;

// 二维码白边
+ (UIImage *)addWhiteBorderToQRCode:(UIImage *)image withBorderSize:(CGFloat)borderSize;

/**
 * view生成image
 */
+ (UIImage *)makeImageWithView:(UIView *)view withSize:(CGSize)size;

@end

NS_ASSUME_NONNULL_END
