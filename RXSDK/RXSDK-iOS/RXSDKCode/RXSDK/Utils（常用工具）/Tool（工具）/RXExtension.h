//
//  RXExtension.h
//  RXSDK
//
//  Created by 陈汉 on 2022/5/14.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXExtension : NSObject

/**
 * 转换为JSON 字符串
 */
+ (NSString *)getJsonString:(NSDictionary *)jsonDic;

/**
 * 通用密钥
 */
+ (NSString *)getEncryptKey;

/**
 * AES128 加密
 */
+ (NSString *)encrypt128String:(NSString *)plainText withKey:(NSString *)key andIV:(NSString *)iv;

/**
 * AES128 解密
 */
+ (NSString *)decrypt128String:(NSString *)cipherText withKey:(NSString *)key andIV:(NSString *)iv;

@end

NS_ASSUME_NONNULL_END
