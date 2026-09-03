//
//  NSData+RXIMAES.h
//  RXIMSdk
//
//  Created by 陈汉 on 2021/9/2.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface NSData (AES)

/** AES256加密方法 */
+ (NSData *)AEC256EncryptWithPlainText:(NSString *)plainText withKey:(NSString *)keyStr;
+ (NSData *)AEC256EncryptWithData:(NSData *)data withKey:(NSString *)keyStr;

/** AES256解密方法 */
+ (NSData *)AES256DecryptWithCipherData:(NSData *)cipherData withKey:(NSString *)keyStr;

@end

NS_ASSUME_NONNULL_END
