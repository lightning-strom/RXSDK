//
//  NSString+RXOSAddition.h
//  RXUIKit-OS
//
//  Created by 陈汉 on 2023/6/15.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface NSString (RXOSAddition)

// 获取宽度
- (CGFloat)widthForFont:(UIFont *)font;
// 指定宽度获取高度
- (CGFloat)heightForFont:(UIFont *)font width:(CGFloat)width;

- (NSString *)urlEncodedString;
- (NSString *)urlDecodedString;

@end

NS_ASSUME_NONNULL_END
