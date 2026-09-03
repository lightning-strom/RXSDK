//
//  NSData+Encrypt.m
//  RXSDK
//
//  Created by 陈汉 on 2023/6/3.
//

#import "NSData+Encrypt.h"
#import <CommonCrypto/CommonCryptor.h>
#import "RXCommonTool.h"
#import "DeviceKey.h"

static NSString const *cbcKey = @"4ca7dacc9332d74e1292c83f0aa3b376";

@implementation NSData (Encrypt)

/**
 * AES256解密方法
 */
- (NSData *)AES256DecryptWithKey:(NSString *)key
{
    
    char keyPtr[kCCKeySizeAES256+1]; // room for terminator (unused)
    
    //  下面这句意思不够 用0填充
    
    bzero(keyPtr, sizeof(keyPtr)); // fill with zeroes (for padding)
    
    // fetch key data (获取关键数据)
    
    [key getCString:keyPtr maxLength:sizeof(keyPtr) encoding:NSUTF8StringEncoding];
    
    // 这里的self 代表调用这个方法的NSData 对象 计算大小
    
    NSUInteger dataLength = [self length];
    
    size_t bufferSize = dataLength + kCCBlockSizeAES128;
    
    void *buffer = malloc(bufferSize);
    
    size_t numBytesDecrypted = 0;
    
    CCCryptorStatus cryptStatus = CCCrypt(kCCDecrypt, kCCAlgorithmAES128, kCCOptionPKCS7Padding | kCCOptionECBMode,
                                          
                                          keyPtr, kCCKeySizeAES128,
                                          
                                          NULL /* initialization vector (optional) */,
                                          
                                          [self bytes], dataLength, /* input */
                                          
                                          buffer, bufferSize, /* output */
                                          
                                          &numBytesDecrypted);
    
    if (cryptStatus == kCCSuccess) {
        
        //  返回的NSData拥有自己的缓冲区并将在delloac时释放掉
        
        //the returned NSData takes ownership of the buffer and will free it on deallocation
        
        return [NSData dataWithBytesNoCopy:buffer length:numBytesDecrypted];
        
    }
    free(buffer); //free the buffer;
    
    return nil;
}

/**
 * AES256加密方法
 */
- (NSData *)AES256EncryptWithKey:(NSString *)key
{
    char keyPtr[kCCKeySizeAES128+1]; // room for terminator (unused)
    
    bzero(keyPtr, sizeof(keyPtr)); // fill with zeroes (for padding)
    
    [key getCString:keyPtr maxLength:sizeof(keyPtr) encoding:NSUTF8StringEncoding];
    
    NSUInteger dataLength = [self length];
    
    size_t bufferSize = dataLength + kCCBlockSizeAES128;
    
    void *buffer = malloc(bufferSize);
    
    size_t numBytesEncrypted = 0;
    
    CCCryptorStatus cryptStatus = CCCrypt(kCCEncrypt, kCCAlgorithmAES128, kCCOptionPKCS7Padding | kCCOptionECBMode,
                                          
                                          keyPtr, kCCKeySizeAES128,
                                          
                                          NULL /* initialization vector (optional) */,
                                          
                                          [self bytes], dataLength, /* input */
                                          
                                          buffer, bufferSize, /* output */
                                          
                                          &numBytesEncrypted);
    
    if (cryptStatus == kCCSuccess) {
        
        //the returned NSData takes ownership of the buffer and will free it on deallocation
        
        return [NSData dataWithBytesNoCopy:buffer length:numBytesEncrypted];
        
    }
    free(buffer); //free the buffer;
    
    return nil;
}

/**
 * data转16进制
 */
+ (NSString *)convertDataToHexStr:(NSData *)data
{
    if (!data || [data length] == 0) {
        return @"";
    }
    NSMutableString *string = [[NSMutableString alloc] initWithCapacity:[data length]];

    [data enumerateByteRangesUsingBlock:^(const void *bytes, NSRange byteRange, BOOL *stop) {
        unsigned char *dataBytes = (unsigned char*)bytes;
        for (NSInteger i = 0; i < byteRange.length; i++) {
            NSString *hexStr = [NSString stringWithFormat:@"%x", (dataBytes[i]) & 0xff];
            if ([hexStr length] == 2) {
                [string appendString:hexStr];
            } else {
                [string appendFormat:@"0%@", hexStr];
            }
        }
    }];

    return string;
}

/**
 * string转16进制
 */
+ (NSString *)hexStringWithString:(NSString *)string
{
    const char *utf8String = [string UTF8String];
    NSUInteger length = strlen(utf8String);
    NSMutableString *hexString = [NSMutableString stringWithCapacity:length * 2];
    
    for (NSUInteger i = 0; i < length; i++) {
        [hexString appendFormat:@"%02x ", (unsigned char)utf8String[i]];
    }
    
    return [hexString copy];
}

- (uint8_t *)hexToUint8Array:(NSString *)hexString
{
    NSUInteger length = hexString.length / 2;
    uint8_t *bytes = malloc(length);
    
    for (NSUInteger i = 0; i < length; i++) {
        NSString *byteString = [hexString substringWithRange:NSMakeRange(i * 2, 2)];
        bytes[i] = (uint8_t)strtol([byteString UTF8String], NULL, 16);
    }
    
    return bytes;
}

/**
 * AES256加密方法 CBC
 */
- (NSString *)AES256CBCEncrypt
{
    uint8_t *key = [self hexToUint8Array:[NSData getCBCKey]];
    NSData *ivData = [NSData dataWithBytes:key length:16];
    
//    NSData *keyData = [[self getCBCKey] dataUsingEncoding:NSUTF8StringEncoding];
//    NSData *ivData = [[self getCBCIV] dataUsingEncoding:NSUTF8StringEncoding];
    
    // 设置加密参数
    size_t bufferSize = [self length] + kCCBlockSizeAES128;
    void *buffer = malloc(bufferSize);
    size_t numBytesEncrypted = 0;
    
    // 执行加密
    CCCryptorStatus cryptStatus = CCCrypt(kCCEncrypt,
                                          kCCAlgorithmAES,
                                          kCCOptionPKCS7Padding,
                                          key,
                                          kCCKeySizeAES256,
                                          ivData.bytes,
                                          self.bytes,
                                          self.length,
                                          buffer,
                                          bufferSize,
                                          &numBytesEncrypted);
    
    NSString *encryptedString = nil;
    if (cryptStatus == kCCSuccess) {
        NSData *encryptedData = [NSData dataWithBytes:buffer
                                               length:numBytesEncrypted];
        // 转换为 base64 字符串
        encryptedString = [encryptedData base64EncodedStringWithOptions:0];
    } else {
        free(buffer);
        NSLog(@"加密失败");
        return nil;
    }
    
    free(buffer);
    return encryptedString;
}

/**
 * AES256解密方法 CBC
 */
+ (NSString *)AES256CBCDecryptWithString:(NSString *)string
{
    NSData *data = [[NSData alloc] initWithBase64EncodedString:string options:0];
    if (!data) return nil;
    
    uint8_t *key = [data hexToUint8Array:[NSData getCBCKey]];
    NSData *ivData = [NSData dataWithBytes:key length:16];
    
    // 设置解密参数
    size_t bufferSize = [data length] + kCCBlockSizeAES128;
    void *buffer = malloc(bufferSize);
    if (!buffer) return nil;
    
    size_t numBytesDecrypted = 0;
    
    // 执行解密
    CCCryptorStatus cryptStatus = CCCrypt(kCCDecrypt,
                                          kCCAlgorithmAES,
                                          kCCOptionPKCS7Padding,
                                          key,
                                          kCCKeySizeAES256,
                                          ivData.bytes,
                                          data.bytes,
                                          data.length,
                                          buffer,
                                          bufferSize,
                                          &numBytesDecrypted);
    
    NSString *decryptedString = nil;
    if (cryptStatus == kCCSuccess) {
        // 使用 dataWithBytes 而不是 dataWithBytesNoCopy
        NSData *decryptedData = [NSData dataWithBytes:buffer length:numBytesDecrypted];
        decryptedString = [[NSString alloc] initWithData:decryptedData
                                                encoding:NSUTF8StringEncoding];
    }
    
    // 确保释放内存
    if (buffer) {
        free(buffer);
        buffer = NULL;
    }
    
    if ([NSString rx_isNullToString:decryptedString].length <= 0) {
        NSLog(@"解密失败");
    }
    
    return decryptedString;
}

- (NSString *)getCBCIV
{
    NSString *iv = @"";
    
    NSString *ivStr = [NSString stringWithFormat:@"%@%@", [DeviceKey getDeviceIDInKeychain], cbcKey];
    
    NSString *ivMD5 = [RXCommonTool md532BitlowerWithStr:ivStr];
    
    iv = [NSData hexStringWithString:ivMD5];
    
    NSArray *ivArr = [iv componentsSeparatedByString:@" "];
    
    if (ivArr.count > 0) {
        NSString *appendIv = @"";
        for (int i = 0; i < ivArr.count; i++) {
            NSString *str = ivArr[i];
            
            if (i < 16) {
                appendIv = [NSString stringWithFormat:@"%@%@", appendIv, str];
                iv = appendIv;
            }
        }
    }
    
    return iv;
}

+ (NSString *)getCBCKey
{
    NSString *keyStr = [NSString stringWithFormat:@"%@%@", [DeviceKey getDeviceIDInKeychain], cbcKey];
    
    NSString *keyMD5 = [RXCommonTool md532BitlowerWithStr:keyStr];
    
    keyMD5 = [NSData hexStringWithString:keyMD5];
    
    keyMD5 = [keyMD5 stringByReplacingOccurrencesOfString:@" " withString:@""];
    
    return keyMD5;
}

@end
