//
//  NSString+Secret.h
//  JXIMSdk
//
//  Created by 陈汉 on 2021/9/2.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface NSString (Secret)

+ (NSData *)RD_EncryptWithData:(NSData *)data WithM1:(NSString *)m1 withM2:(const void *)m2;
+ (NSString *)RD_EncodeHash:(NSString *)key text:(NSString *)text;

/**
 *  加密
 *
 *  @param string 需要加密的string
 *
 *  @return 加密后的字符串
 */
+ (NSString *)AES128EncryptStrig:(NSString *)string key:(NSString *)key iv:(NSString *)iv;
+ (NSString *)AES256EncryptStrig:(NSString *)string key:(NSString *)key iv:(NSString *)iv;

/**
 *  解密
 *
 *  @param string 加密的字符串
 *
 *  @return 解密后的内容
 */
+ (NSString *)AES128DecryptString:(NSString *)string key:(NSString *)key iv:(NSString *)iv;
+ (NSString *)AES256DecryptString:(NSString *)string key:(NSString *)key iv:(NSString *)iv;

@end

NS_ASSUME_NONNULL_END
