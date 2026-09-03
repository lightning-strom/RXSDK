//
//  RXZaloTool.m
//  RXZaloSDK
//
//  Created by 陈汉 on 2024/3/22.
//

#import "RXZaloTool.h"
#import <CommonCrypto/CommonCrypto.h>
#import <UIKit/UIKit.h>

@implementation RXZaloTool

+ (NSString *)generateCodeVerifier
{
    NSMutableData *bufferData = [NSMutableData dataWithLength:32];
    int result = SecRandomCopyBytes(kSecRandomDefault, bufferData.length, bufferData.mutableBytes);
    if (result != 0) {
        return nil; // Failed to generate random bytes
    }
    
    NSString *base64String = [bufferData base64EncodedStringWithOptions:0];
    NSString *codeVerifier = [[base64String stringByReplacingOccurrencesOfString:@"+" withString:@"-"]
                              stringByReplacingOccurrencesOfString:@"/" withString:@"_"];
    codeVerifier = [codeVerifier stringByReplacingOccurrencesOfString:@"=" withString:@""];
    codeVerifier = [codeVerifier stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceCharacterSet]];

    return codeVerifier;
}

+ (NSString *)generateCodeChallengeWithCodeVerifier:(NSString *)codeVerifier
{
    if (!codeVerifier) {
        return nil;
    }
    
    NSData *data = [codeVerifier dataUsingEncoding:NSUTF8StringEncoding];
    if (!data) {
        return nil;
    }
    
#if !TARGET_OS_LINUX
    uint8_t buffer[CC_SHA256_DIGEST_LENGTH];
    CC_SHA256(data.bytes, (CC_LONG)data.length, buffer);
    NSData *hashData = [NSData dataWithBytes:buffer length:CC_SHA256_DIGEST_LENGTH];
#else
    NSMutableData *buffer = [NSMutableData dataWithLength:SHA256_DIGEST_LENGTH];
    HMAC<SHA256> *sha = [HMAC<SHA256> authenticationCodeForBytes:buffer.bytes
                                                     bytesLength:(unsigned int)buffer.length
                                                          keyBytes:NULL
                                                     keyBytesLength:0];
    NSData *hashData = [NSData dataWithBytes:sha.bytes length:sha.length];
#endif

    NSString *base64String = [hashData base64EncodedStringWithOptions:0];
    NSString *challenge = [[base64String stringByReplacingOccurrencesOfString:@"+" withString:@"-"]
                              stringByReplacingOccurrencesOfString:@"/" withString:@"_"];
    challenge = [challenge stringByReplacingOccurrencesOfString:@"=" withString:@""];
    challenge = [challenge stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceCharacterSet]];

    return challenge;
}

+ (BOOL)isZaloInstalled {
    NSURL *zaloURL = [NSURL URLWithString:@"zalo://"];
    return [[UIApplication sharedApplication] canOpenURL:zaloURL];
}

@end
