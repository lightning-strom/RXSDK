//
//  UIImage+RXFeedbackAddition.m
//  RXUIKit-OS
//
//  Created by 陈汉 on 2023/6/15.
//

#import "UIImage+RXFeedbackAddition.h"
#import "RXFeedbackTool.h"
#import "RXPlayerFeedbackService.h"

@implementation UIImage (RXFeedbackAddition)

+ (UIImage *)rxFeedbackBundleImageNamed:(NSString *)imageName
{
    NSBundle *bundle = [NSBundle bundleForClass:[RXPlayerFeedbackService class]];
    NSURL *url = [bundle URLForResource:@"RXOSFeedback" withExtension:@"bundle"];
    NSBundle *imageBundle = [NSBundle bundleWithURL:url];
    
    UIImage *image = [UIImage imageWithContentsOfFile:[imageBundle pathForResource:imageName ofType:@"png"]];
    
    return image;
}

+ (CGSize)getImageSize:(UIImage *)img
{
    CGFloat width = CGImageGetWidth(img.CGImage);
    CGFloat height = CGImageGetHeight(img.CGImage);
    
    return CGSizeMake(width, height);
}

/**
解释一下前两个参数的含义：
想象一个数轴，最左边是黑色（RGBX：0x000000FF），最右边是白色（0xFFFFFFFF），
nearBlackColor是靠近左边边界的色值，nearWhiteColor是靠近右边边界的色值，
它们中间则是需要被修改的色值范围
*/
- (UIImage *)translatePixelColorByTargetNearBlackColorRGBA:(UInt32)nearBlackRGBA
                                        nearWhiteColorRGBA:(UInt32)nearWhiteRGBA
                                            transColorRGBA:(UInt32)transRGBA
                                                   inRect:(CGRect)rect
{
    // 第一步：判断传入的rect是否在图片的bounds内
    CGRect canvas = CGRectMake(0, 0, self.size.width, self.size.height);
    if (!CGRectContainsRect(canvas, rect)) {
        if (CGRectIntersectsRect(canvas, rect)) {
            rect = CGRectIntersection(canvas, rect);    // 取交集
        } else {
            return self;
        }
    }

    UIImage *transImage = nil;

    int imageWidth = self.size.width;
    int imageHeight = self.size.height;

    // 第二步：创建色彩空间、画布上下文，并将图片以bitmap（不含alpha通道）的方式画在画布上。
    size_t bytesPerRow = imageWidth * 4;
    uint32_t *rgbImageBuf = (uint32_t *)malloc(bytesPerRow * imageHeight);
    CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceRGB();

    CGContextRef context = CGBitmapContextCreate(rgbImageBuf, imageWidth, imageHeight, 8, bytesPerRow, colorSpace,
                                                 kCGBitmapByteOrder32Little | kCGImageAlphaNoneSkipLast);

    CGContextDrawImage(context, CGRectMake(0, 0, imageWidth, imageHeight), self.CGImage);

    // 第三步：遍历并修改像素
    uint32_t *pCurPtr = rgbImageBuf;
    pCurPtr += (long)(rect.origin.y*imageWidth);    // 将指针移动到初始行的起始位置

    // 空间复杂度：O(rect.size.width * rect.size.height)
    for (int i = rect.origin.y; i < CGRectGetMaxY(rect); i++) {                     // row
        pCurPtr += (long)rect.origin.x;             // 将指针移动到当前行的起始列

        for (int j = rect.origin.x; j < CGRectGetMaxX(rect); j++, pCurPtr++) {      // column
            if (*pCurPtr < nearBlackRGBA || *pCurPtr > nearWhiteRGBA) { continue; }

            // 将图片转成想要的颜色
            uint8_t *ptr = (uint8_t *)pCurPtr;
            ptr[3] = (transRGBA >> 24) & 0xFF;              // R
            ptr[2] = (transRGBA >> 16) & 0xFF;              // G
            ptr[1] = (transRGBA >> 8)  & 0xFF;              // B
        }

        pCurPtr += (long)(imageWidth - CGRectGetMaxX(rect));    // 将指针移动到下一行的起始列
    }

    // 第四步：输出图片
    CGDataProviderRef dataProvider = CGDataProviderCreateWithData(NULL, rgbImageBuf, bytesPerRow * imageHeight, providerReleaseDataCallback);
    CGImageRef imageRef = CGImageCreate(imageWidth, imageHeight, 8, 32, bytesPerRow, colorSpace,
                                        kCGImageAlphaLast | kCGBitmapByteOrder32Little, dataProvider,
                                        NULL, true, kCGRenderingIntentDefault);
    CGDataProviderRelease(dataProvider);
    transImage = [UIImage imageWithCGImage:imageRef];

    // end：清理空间
    CGImageRelease(imageRef);
    CGContextRelease(context);
    CGColorSpaceRelease(colorSpace);

    return transImage ? : self;
}

void providerReleaseDataCallback (void *info, const void *data, size_t size) {
    free((void*)data);
}


@end
