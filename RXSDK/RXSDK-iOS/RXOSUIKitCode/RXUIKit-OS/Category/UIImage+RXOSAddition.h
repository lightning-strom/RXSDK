//
//  UIImage+RXOSAddition.h
//  RXUIKit-OS
//
//  Created by 陈汉 on 2023/6/15.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface UIImage (RXOSAddition)

+ (UIImage *)rxOSBundleImageNamed:(NSString *)name;

+ (CGSize)getImageSize:(UIImage *)img;

/**
解释一下前两个参数的含义：
想象一个数轴，最左边是黑色（RGBX：0x000000FF），最右边是白色（0xFFFFFFFF），
nearBlackColor是靠近左边边界的色值，nearWhiteColor是靠近右边边界的色值，
它们中间则是需要被修改的色值范围
*/
- (UIImage *)translatePixelColorByTargetNearBlackColorRGBA:(UInt32)nearBlackRGBA
                                        nearWhiteColorRGBA:(UInt32)nearWhiteRGBA
                                            transColorRGBA:(UInt32)transRGBA
                                                    inRect:(CGRect)rect;

@end

NS_ASSUME_NONNULL_END
