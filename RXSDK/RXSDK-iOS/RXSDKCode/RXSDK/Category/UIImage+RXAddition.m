//
//  UIImage+RXAddition.m
//  RXSDK
//
//  Created by 陈汉 on 2021/9/28.
//

#import "UIImage+RXAddition.h"
#import "RXCommonTool.h"

@implementation UIImage (RXAddition)

+ (UIImage *)rxPBundleImageNamed:(NSString *)imageName
{
    NSBundle *bundle = [NSBundle bundleForClass:[RXService class]];
    NSURL *url = [bundle URLForResource:@"RXSDK" withExtension:@"bundle"];
    NSBundle *imageBundle = [NSBundle bundleWithURL:url];
    
    UIImage *image = [UIImage imageWithContentsOfFile:[imageBundle pathForResource:imageName ofType:@"png"]];
    
    return image;
}

#pragma mark - 二维码
+ (UIImage *)rxQRCodeForString:(NSString *)tString
                          size:(CGSize)tSize
                     fillColor:(UIColor *)tFillColor
                     iconImage:(UIImage *)tIconImage
                    borderSize:(CGFloat)borderSize
{
    // 内容不能为空
    if (!tString || tString.length == 0) {
        return [UIImage new];
    }

    NSData *stringData = [tString dataUsingEncoding: NSUTF8StringEncoding];
    //生成
    CIFilter *qrFilter = [CIFilter filterWithName:@"CIQRCodeGenerator"];
    [qrFilter setValue:stringData forKey:@"inputMessage"];
    [qrFilter setValue:@"H" forKey:@"inputCorrectionLevel"];
    //上色
    UIColor *onColor = [UIColor blackColor];
    if (tFillColor) {
        onColor = tFillColor;
    }
    UIColor *offColor = [UIColor whiteColor];
    CIFilter *colorFilter = [CIFilter filterWithName:@"CIFalseColor" keysAndValues: @"inputImage",qrFilter.outputImage, @"inputColor0",[CIColor colorWithCGColor:onColor.CGColor], @"inputColor1",[CIColor colorWithCGColor:offColor.CGColor], nil];
    // 生成
    CIImage *qrImage = colorFilter.outputImage;
    CGSize lSize = tSize;// * [UIScreen mainScreen].scale
    CGFloat tScale = MIN(lSize.width/CGRectGetWidth(qrImage.extent), lSize.height/CGRectGetHeight(qrImage.extent));
    CIImage *tTransformImage = [qrImage imageByApplyingTransform:CGAffineTransformMakeScale(tScale,tScale)];
    // 保存
    CIContext *tContext = [CIContext contextWithOptions:nil];
    CGImageRef tImageRef = [tContext createCGImage:tTransformImage fromRect:tTransformImage.extent];
    UIImage *tCodeImage = [UIImage imageWithCGImage:tImageRef];
    // 释放
    CGImageRelease(tImageRef);
//        UIImage *tCodeImage = [self changeImageSizeWithCIImage:[self createQRcodeWithUrlString:tString?tString:@""] size:lSize];
    // 添加icon
    
    if (tIconImage) {
        UIGraphicsBeginImageContext(CGSizeMake(lSize.width, lSize.height));
        [tCodeImage drawInRect:CGRectMake(0, 0, lSize.width, lSize.height)];
        CGFloat iconSize = 1.0/5.5*lSize.width;
        [tIconImage drawInRect:CGRectMake((lSize.width-iconSize)/2.0, (lSize.height-iconSize)/2.0, iconSize, iconSize)];
        UIImage *resultImage = UIGraphicsGetImageFromCurrentImageContext();
        UIGraphicsEndImageContext();
        
        if (borderSize > 0) {
            resultImage = [UIImage addWhiteBorderToQRCode:resultImage withBorderSize:borderSize];
        }
        
        return resultImage;
    }
    
    if (borderSize > 0) {
        tCodeImage = [UIImage addWhiteBorderToQRCode:tCodeImage withBorderSize:borderSize];
    }
    
    return tCodeImage;
}

// 二维码白边
+ (UIImage *)addWhiteBorderToQRCode:(UIImage *)image withBorderSize:(CGFloat)borderSize
{
    CGSize size = CGSizeMake(image.size.width + 2 * borderSize, image.size.height + 2 * borderSize);
    
    UIGraphicsBeginImageContextWithOptions(size, NO, image.scale);
    [[UIColor whiteColor] setFill];
    UIRectFill(CGRectMake(0, 0, size.width, size.height));
    [image drawInRect:CGRectMake(borderSize, borderSize, image.size.width, image.size.height)];
    UIImage *imageWithBorder = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    
    return imageWithBorder;
}

#pragma mark -- <view生成image>
+ (UIImage *)makeImageWithView:(UIView *)view withSize:(CGSize)size
{
    //下面方法，第一个参数表示区域大小。第二个参数表示是否是非透明的。如果需要显示半透明效果，需要传NO，否则传YES。第三个参数就是屏幕密度了，关键就是第三个参数 [UIScreen mainScreen].scale。
    UIGraphicsBeginImageContextWithOptions(size, YES, [UIScreen mainScreen].scale);
    [view.layer renderInContext:UIGraphicsGetCurrentContext()];
    UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return image;
}

@end
