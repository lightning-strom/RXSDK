//
//  NSData+Encrypt.h
//  RXSDK
//
//  Created by 陈汉 on 2023/6/3.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface NSData (Encrypt)

/**
 * AES256解密方法
 */
- (NSData *)AES256DecryptWithKey:(NSString *)key;

/**
 * AES256加密方法
 */
- (NSData *)AES256EncryptWithKey:(NSString *)key;

/**
 * data转16进制
 */
+ (NSString *)convertDataToHexStr:(NSData *)data;

/**
 * AES256加密方法 CBC
 */
- (NSString *)AES256CBCEncrypt;

/**
 * AES256解密方法 CBC
 */
+ (NSString *)AES256CBCDecryptWithString:(NSString *)string;

+ (NSString *)getCBCKey;

@end

NS_ASSUME_NONNULL_END
