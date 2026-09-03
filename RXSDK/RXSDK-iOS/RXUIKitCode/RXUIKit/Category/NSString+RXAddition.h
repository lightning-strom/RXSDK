//
//  NSString+RXAddition.h
//  RXSDK
//
//  Created by 陈汉 on 2021/9/28.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface NSString (RXAddition)

// 获取宽度
- (CGFloat)widthForFont:(UIFont *)font;
// 指定宽度获取高度
- (CGFloat)heightForFont:(UIFont *)font width:(CGFloat)width;

- (NSString *)urlEncodedString;
- (NSString *)urlDecodedString;

@end

NS_ASSUME_NONNULL_END
