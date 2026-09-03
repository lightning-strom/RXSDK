//
//  NSString+RXIMCommon.h
//  RXIMSdk
//
//  Created by 陈汉 on 2021/9/3.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface NSString (RXCommon)

/** data转十六进制 */
+ (NSString *)converDataToString16:(NSData *)data;

/**
 string 十六进制转换为二进制
   
 @param hex 十六进制数
 @return 二进制数
 */
+ (NSString *)getBinaryByHex:(NSString *)hex;

/**
 十六进制转十进制
 
 @return 十进制字符串
 */
+ (NSString *)hexToDecimal:(NSString *)str;

/*
 二进制转十进制
 
 @return 十进制字符串
 */
+ (NSString *)binaryToDecimal:(NSString *)str;

@end

NS_ASSUME_NONNULL_END
