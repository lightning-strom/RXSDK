//
//  NSData+RXIMAES.m
//  RXIMSdk
//
//  Created by 陈汉 on 2021/9/2.
//

#import "NSData+RXIMAES.h"
#import <CommonCrypto/CommonCryptor.h>

@implementation NSData (AES)

/** AES256加密方法 */
+ (NSData *)AEC256EncryptWithPlainText:(NSString *)plainText withKey:(NSString *)keyStr
{
    NSData *key = [NSData getData:keyStr];
    if (plainText == nil) {
        return nil;
    }
    NSData *plainData = [plainText dataUsingEncoding:NSUTF8StringEncoding];
    
    char keyPtr[kCCKeySizeAES256+1];
    bzero(keyPtr, sizeof(keyPtr));

    NSUInteger dataLength = [plainData length];
    size_t bufferSize = dataLength + kCCBlockSizeAES128;
    void *buffer = malloc(bufferSize);
    bzero(buffer, sizeof(buffer));
    
    size_t numBytesEncrypted = 0;
    
    unsigned char *iv = malloc( 16 * sizeof(unsigned char) );
    [key getBytes:iv length:16];

    CCCryptorStatus cryptStatus = CCCrypt(kCCEncrypt,
                                          kCCAlgorithmAES,
                                          kCCOptionPKCS7Padding,
                                          [key bytes],
                                          [key length],
                                          iv /* initialization vector (optional) */,
                                          [plainData bytes], dataLength, /* input */
                                          buffer, bufferSize, /* output */
                                          &numBytesEncrypted);
    NSData *encryptData;
    if (cryptStatus == kCCSuccess) {
         encryptData = [NSData dataWithBytesNoCopy:buffer length:numBytesEncrypted];
    }
//     free the buffer;
//    free(buffer);
    free(iv);
    return encryptData;
}

+ (NSData *)AEC256EncryptWithData:(NSData *)data withKey:(NSString *)keyStr
{
    NSData *key = [NSData getData:keyStr];
    if (data == nil) {
        return nil;
    }
    
    char keyPtr[kCCKeySizeAES256+1];
    bzero(keyPtr, sizeof(keyPtr));

    NSUInteger dataLength = [data length];
    size_t bufferSize = dataLength + kCCBlockSizeAES128;
    void *buffer = malloc(bufferSize);
    bzero(buffer, sizeof(buffer));
    
    size_t numBytesEncrypted = 0;
    
    unsigned char *iv = malloc( 16 * sizeof(unsigned char) );
    [key getBytes:iv length:16];

    CCCryptorStatus cryptStatus = CCCrypt(kCCEncrypt,
                                          kCCAlgorithmAES,
                                          kCCOptionPKCS7Padding,
                                          [key bytes],
                                          [key length],
                                          iv /* initialization vector (optional) */,
                                          [data bytes],
                                          dataLength, /* input */
                                          buffer, bufferSize, /* output */
                                          &numBytesEncrypted);
    NSData *encryptData;
    if (cryptStatus == kCCSuccess) {
         encryptData = [NSData dataWithBytesNoCopy:buffer length:numBytesEncrypted];
    }
//     free the buffer;
//    free(buffer);
    free(iv);
    return encryptData;
}

/** AES256解密方法 */
+ (NSData *)AES256DecryptWithCipherData:(NSData *)cipherData withKey:(NSString *)keyStr
{
    NSData *key = [NSData getData:keyStr];
    
    if (!cipherData) {
        return nil;
    }
    // 'key' should be 32 bytes for AES256, will be null-padded otherwise
    char keyPtr[kCCKeySizeAES256+1]; // room for terminator (unused)
    bzero(keyPtr, sizeof(keyPtr)); // fill with zeroes (for padding)
    
    NSUInteger dataLength = [cipherData length];
    
    size_t bufferSize = dataLength + kCCBlockSizeAES128;
    void *buffer = malloc(bufferSize);
    
    unsigned char *iv = malloc( 16 * sizeof(unsigned char) );
    [key getBytes:iv length:16];
    
    size_t numBytesDecrypted = 0;
    CCCryptorStatus cryptStatus = CCCrypt(kCCDecrypt,
                                          kCCAlgorithmAES,
                                          kCCOptionPKCS7Padding,
                                          [key bytes],
                                          kCCKeySizeAES256,
                                          iv ,/* initialization vector (optional) */
                                          [cipherData bytes],
                                          dataLength, /* input */
                                          buffer, bufferSize, /* output */
                                          &numBytesDecrypted);
    NSData *encryptData;
    if (cryptStatus == kCCSuccess) {
         encryptData= [NSData dataWithBytesNoCopy:buffer length:numBytesDecrypted];
    }
//    free(buffer);
     //free the buffer;
    free(iv);
    return encryptData;
}

/** hex转换 */
+ (NSData *)getData:(NSString*)str
{
    if (!str || [str length] == 0) {
        
        return nil;
        
    }
    
    NSMutableData *hexData = [[NSMutableData alloc] initWithCapacity:8];
    
    NSRange range;
    
    if ([str length] % 2 == 0) {
        range = NSMakeRange(0, 2);
    } else {
        range = NSMakeRange(0, 1);
    }
    
    for (NSInteger i = range.location; i < [str length]; i+= 2){
        
        unsigned int anInt;
        
        NSString *hexCharStr= [str substringWithRange:range];
        
        NSScanner *scanner= [[NSScanner alloc] initWithString:hexCharStr];
        
        [scanner scanHexInt:&anInt];
        
        NSData*entity= [[NSData alloc] initWithBytes:&anInt length:1];
        
        [hexData appendData:entity];
        
        range.location+= range.length;
        range.length= 2;
    }
    
    return hexData;
}

@end
