//
//  RXExtension.m
//  RXSDK
//
//  Created by 陈汉 on 2022/5/14.
//

#import "RXExtension.h"
#import "RXCommonHeader.h"
#import <CommonCrypto/CommonCryptor.h>
#import "DeviceKey.h"

@implementation RXExtension

/**
 * 转换为JSON 字符串
 */
+ (NSString *)getJsonString:(NSDictionary *)jsonDic
{
    NSError *error;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:jsonDic options:NSJSONWritingPrettyPrinted error:&error];
    if (error) {
        NSLog(@"json解析失败:%@", error);
        return nil;
    }
    NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
    return jsonString;
}

+ (NSString *)getEncryptKey
{
    NSString *device = [DeviceKey getDeviceIDInKeychain];
    NSString *openid = [RXUserUtility valueForKey:keyUserData_openId];
    
    NSString *encrypt = [NSString stringWithFormat:@"%@%@", device, openid];
    
    encrypt = [RXCommonTool md532BitlowerWithStr:encrypt];
    
    return encrypt;
}

#pragma mark -- AES256
+ (NSData *)AES256EncryptData:(NSData *)data withKey:(NSData *)key iv:(NSData *)iv {
    return [self AES256Operation:kCCEncrypt data:data key:key iv:iv];
}

+ (NSData *)AES256DecryptData:(NSData *)data withKey:(NSData *)key iv:(NSData *)iv {
    return [self AES256Operation:kCCDecrypt data:data key:key iv:iv];
}

+ (NSData *)AES256Operation:(CCOperation)operation data:(NSData *)data key:(NSData *)key iv:(NSData *)iv {
    // Ensure the key length is 32 bytes (256 bits)
    if (key.length != kCCKeySizeAES256) {
        NSLog(@"Error: Key length must be 32 bytes for AES-256");
        return nil;
    }

    // Ensure the IV length is 16 bytes (128 bits)
//    if (iv.length != kCCBlockSizeAES128) {
//        NSLog(@"Error: IV length must be 16 bytes for AES");
//        return nil;
//    }

    size_t outLength;
    NSMutableData *output = [NSMutableData dataWithLength:data.length + kCCBlockSizeAES128];

    CCCryptorStatus result = CCCrypt(operation,
                                     kCCAlgorithmAES,
                                     kCCOptionPKCS7Padding | kCCOptionECBMode,
                                     key.bytes,
                                     kCCKeySizeAES256,
                                     NULL,
                                     data.bytes,
                                     data.length,
                                     output.mutableBytes,
                                     output.length,
                                     &outLength);

    if (result == kCCSuccess) {
        output.length = outLength;
        return output;
    } else {
        NSLog(@"Error: Failed to perform AES operation, status: %d", result);
        return nil;
    }
}

#pragma mark -- AES128
/**
 * AES128 加密
 */
+ (NSString *)encrypt128String:(NSString *)plainText withKey:(NSString *)key andIV:(NSString *)iv {
    NSData *data = [plainText dataUsingEncoding:NSUTF8StringEncoding];
    NSData *encryptedData = [self encryptData:data withKey:[key dataUsingEncoding:NSUTF8StringEncoding] andIV:[iv dataUsingEncoding:NSUTF8StringEncoding]];
    return [encryptedData base64EncodedStringWithOptions:0];
}

/**
 * AES128 解密
 */
+ (NSString *)decrypt128String:(NSString *)cipherText withKey:(NSString *)key andIV:(NSString *)iv {
    NSData *data = [[NSData alloc] initWithBase64EncodedString:cipherText options:0];
    NSData *decryptedData = [self decryptData:data withKey:[key dataUsingEncoding:NSUTF8StringEncoding] andIV:[iv dataUsingEncoding:NSUTF8StringEncoding]];
    NSDictionary *dic = [NSJSONSerialization JSONObjectWithData:decryptedData options:NSJSONReadingAllowFragments error:nil];
    id object = [NSKeyedUnarchiver unarchiveObjectWithData:decryptedData];
     return [[NSString alloc] initWithData:decryptedData encoding:NSUTF8StringEncoding];
}

+ (NSData *)encryptData:(NSData *)data withKey:(NSData *)key andIV:(NSData *)iv {
    return [self performCryptoOperation:kCCEncrypt onData:data withKey:key andIV:iv];
}

+ (NSData *)decryptData:(NSData *)data withKey:(NSData *)key andIV:(NSData *)iv {
    return [self performCryptoOperation:kCCDecrypt onData:data withKey:key andIV:iv];
}

+ (NSData *)performCryptoOperation:(CCOperation)operation onData:(NSData *)data withKey:(NSData *)key andIV:(NSData *)iv {
//    NSAssert(key.length == kCCKeySizeAES128, @"Key length must be 128 bits (16 bytes)");
//    NSAssert(iv.length == kCCBlockSizeAES128, @"IV length must be 128 bits (16 bytes)");
    
    size_t outLength;
    NSMutableData *outputData = [NSMutableData dataWithLength:data.length + kCCBlockSizeAES128];
    
    CCCryptorStatus result = CCCrypt(
                                     operation, // Operation: Encrypt or Decrypt
                                     kCCAlgorithmAES128, // Algorithm: AES
                                     kCCOptionPKCS7Padding, // Options: PKCS7 padding
                                     key.bytes, // Key
                                     key.length, // Key length
                                     iv.bytes, // Initialization vector
                                     data.bytes, // Input data
                                     data.length, // Input data length
                                     outputData.mutableBytes, // Output buffer
                                     outputData.length, // Output buffer length
                                     &outLength // Output buffer length used
                                     );
    
    if (result == kCCSuccess) {
        outputData.length = outLength;
    } else {
        // Handle encryption/decryption error
        return nil;
    }
    
    return outputData;
}
@end
