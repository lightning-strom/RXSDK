//
//  RXSTool.h
//  RXShareKit
//
//  Created by 陈汉 on 2022/5/25.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "RXShareKitService.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXSTool : NSObject

///**
// * 十六进制转RGB
// */
//+ (UIColor *)colorWithHexString:(NSString *)hexString;
//
///**
// * 获取图片
// */
//+ (UIImage *)rxBundleImageNamed:(NSString *)imageName;
//
/**
 * 获取按钮名称
 */
+ (NSString *)getShareTitle:(NSInteger)shareType;

/**
 * 获取图片名称
 */
+ (NSString *)getShareImage:(NSInteger)shareType;

@end

NS_ASSUME_NONNULL_END
