//
//  NSData+RXIMCommonCategory.h
//  RXIMSdk
//
//  Created by 陈汉 on 2021/9/1.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface NSData (RXCommonCategory)

- (int)kkl_intValue;

// 十六进制转data
+ (NSData *)convertHexStrToData:(NSString *)str;

// data转十六进制
+ (NSString *)convertDataToHexStr:(NSData *)data;

// 字节流转整形
+ (uint32_t)intFromData:(NSData *)data useBig:(BOOL)useBig;

// 计算varint
+ (NSMutableData *)encodeVarint:(UInt64)length;

// 根据varint计算字节长度
+ (NSArray *)decodeVarint:(unsigned char *)buffer index:(int)index ret:(int)ret;

@end

NS_ASSUME_NONNULL_END
