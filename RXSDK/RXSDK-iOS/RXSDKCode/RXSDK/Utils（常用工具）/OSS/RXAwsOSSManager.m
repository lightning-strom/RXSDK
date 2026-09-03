//
//  RXAwsOSSManager.m
//  RXSDK-Pure
//
//  Created by 陈汉 on 2024/8/27.
//

#import "RXAwsOSSManager.h"
#import <CommonCrypto/CommonHMAC.h>

@implementation RXAwsOSSManager

+ (void)putFileAmazonOSSWithBodyData:(NSData *)bodyData response:(NSDictionary *)response ossPath:(NSString *)ossPath process:(void(^)(float process))process complete:(RequestComplete)complete
{
    __block NSString *domain = response[@"data"][@"domain"];
    NSString *contentType = @"application/octet-stream";
    NSString *payloadHash = [self SHA256HashFromData:bodyData];
    
    NSString *fecthPath = ossPath;
    if ([[fecthPath substringToIndex:1] isEqualToString:@"/"]) {
        fecthPath = [fecthPath stringByReplacingCharactersInRange:NSMakeRange(0, 1) withString:@""];
    }

    NSString *urlStr = [NSString stringWithFormat:@"%@/%@", domain, fecthPath];
    NSURL *url = [NSURL URLWithString:urlStr];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:urlStr andParams:bodyData requsetMethod:RequestMethod_Put];
    
    NSMutableDictionary *headers = [NSMutableDictionary dictionary];
    [headers setValue:[@([bodyData length]) stringValue] forKey:@"Content-Length"];
    [headers setValue:contentType forKey:@"Content-Type"];
    [headers setValue:payloadHash forKey:@"x-amz-content-sha256"];
    [headers setValue:response[@"data"][@"credentials"][@"security_token"] forKey:@"x-amz-security-token"];
    [headers setValue:[self currentDateTimeString] forKey:@"x-amz-date"];
    [headers setValue:[url host] forKey:@"Host"];
    [headers setValue:[self signatureForData:response[@"data"] httpUrl:urlStr httpHeader:headers objectKey:ossPath] forKey:@"Authorization"];
    
    request.headParams = headers;

    [[RX_CommonNetworkExcuteManager commonRequestClient] beginUploadRequest:request process:process success:^(id  _Nullable responseObject) {
        NSLog(@"文件上传成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        if (error.error.code == 200) {
            NSString *uploadUrl = [NSString stringWithFormat:@"%@/%@", domain, fecthPath];
            NSDictionary *responseObject = @{@"url" : uploadUrl};
            NSLog(@"文件上传成功:\n %@", responseObject);
            if (complete) {
                complete(responseObject, nil);
            }
        } else {
            NSLog(@"文件上传失败:\n %@", error.error);
            if (complete) {
                complete(nil, error);
            }
        }
    }];
}

+ (NSString *)signatureForData:(NSDictionary *)data httpUrl:(NSString *)httpUrl httpHeader:(NSDictionary *)httpHeader objectKey:(NSString *)objectKey
{
    NSString *bucket = data[@"bucket"];
    NSString *region = data[@"region"];
    NSString *secretKey = data[@"credentials"][@"access_key_secret"];
    NSString *accessKey = data[@"credentials"][@"access_key_id"];
    NSString *securityToken = data[@"credentials"][@"security_token"];
    NSString *method = @"PUT";
    NSString *service = @"s3";
    NSString *host = [NSString stringWithFormat:@"%@.s3.%@.amazonaws.com", bucket, region];
    NSString *date = [self currentDateTimeString];
    NSString *dataStamp = [self currentDateStampString];
    NSString *credentialScope = [NSString stringWithFormat:@"%@/%@/%@/aws4_request", dataStamp, region, service];
    
    // MD5 hash of the payload
    NSString *payloadHash = httpHeader[@"x-amz-content-sha256"];
    NSString *contentLength = httpHeader[@"Content-Length"];
    NSString *contentType = httpHeader[@"Content-Type"];
    
    NSString *canonicalHeaders = [NSString stringWithFormat:@"content-length:%@\ncontent-type:%@\nhost:%@\nx-amz-content-sha256:%@\nx-amz-date:%@\nx-amz-security-token:%@\n", contentLength, contentType, host, payloadHash, date, securityToken];
    NSString *signedHeaders = @"content-length;content-type;host;x-amz-content-sha256;x-amz-date;x-amz-security-token";
    
    NSString *canonicalRequest = [NSString stringWithFormat:@"%@\n/%@\n\n%@\n%@\n%@", method, objectKey, canonicalHeaders, signedHeaders, payloadHash];
    NSLog(@"canonicalRequest >> %@", canonicalRequest);
    
    NSString *stringToSign = [NSString stringWithFormat:@"AWS4-HMAC-SHA256\n%@\n%@\n%@", date, credentialScope, [self hashString:canonicalRequest]];
    
    NSLog(@"stringToSign >> %@", stringToSign);
    
    NSData *signingKey = [self getSignatureKeyWithKey:secretKey date:dataStamp region:region service:service];
    
    NSData *signatureData = [self HMACSHA256WithKey:signingKey data:stringToSign];
    const unsigned char *dataBuffer = [signatureData bytes];
    NSUInteger dataLength = [signatureData length];
    NSMutableString *hexString = [NSMutableString stringWithCapacity:(dataLength * 2)];

    for (NSUInteger i = 0; i < dataLength; i++) {
        [hexString appendFormat:@"%02x", dataBuffer[i]];
    }
    NSString *signature = [hexString lowercaseString];
    
    NSString *authorizationHeader = [NSString stringWithFormat:@"AWS4-HMAC-SHA256 Credential=%@/%@, SignedHeaders=%@, Signature=%@", accessKey, credentialScope, signedHeaders, signature];
    
    return authorizationHeader;

}

+ (NSString *)hashString:(NSString *)input {
    const char *ptr = [input UTF8String];
    unsigned char md[CC_SHA256_DIGEST_LENGTH];
    CC_SHA256(ptr, (CC_LONG)strlen(ptr), md);
    
    NSMutableString *output = [NSMutableString stringWithCapacity:CC_SHA256_DIGEST_LENGTH * 2];
    for(int i = 0; i < CC_SHA256_DIGEST_LENGTH; i++) {
        [output appendFormat:@"%02x",md[i]];
    }
    return output;
}

+ (NSData *)getSignatureKeyWithKey:(NSString *)key date:(NSString *)date region:(NSString *)region service:(NSString *)service {
    NSData *kSecret = [[NSString stringWithFormat:@"AWS4%@", key] dataUsingEncoding:NSUTF8StringEncoding];
    NSData *kDate = [self HMACSHA256WithKey:kSecret data:date];
    NSData *kRegion = [self HMACSHA256WithKey:kDate data:region];
    NSData *kService = [self HMACSHA256WithKey:kRegion data:service];
    NSData *kSigning = [self HMACSHA256WithKey:kService data:@"aws4_request"];
        
    return kSigning;
}

+ (NSData *)HMACSHA256WithKey:(NSData *)key data:(NSString *)data {
    const char *cData = [data cStringUsingEncoding:NSUTF8StringEncoding];
    unsigned char cHMAC[CC_SHA256_DIGEST_LENGTH];

    CCHmac(kCCHmacAlgSHA256, key.bytes, key.length, cData, strlen(cData), cHMAC);

    return [NSData dataWithBytes:cHMAC length:sizeof(cHMAC)];
}

+ (NSString *)currentDateTimeString {
    NSDate *now = [NSDate date];
    NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
    
    // Set the date format to ISO 8601 basic format
    [dateFormatter setDateFormat:@"yyyyMMdd'T'HHmmss'Z'"];
    [dateFormatter setTimeZone:[NSTimeZone timeZoneWithAbbreviation:@"UTC"]];
    
    return [dateFormatter stringFromDate:now];
}

+ (NSString *)currentDateStampString {
    NSDate *now = [NSDate date];
    NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
    
    [dateFormatter setDateFormat:@"yyyyMMdd"];
    [dateFormatter setTimeZone:[NSTimeZone timeZoneWithAbbreviation:@"UTC"]];
    
    return [dateFormatter stringFromDate:now];
}


+ (NSString *)SHA256HashFromData:(NSData *)data {
    unsigned char digest[CC_SHA256_DIGEST_LENGTH];
    CC_SHA256(data.bytes, (CC_LONG)data.length, digest);

    NSMutableString *output = [NSMutableString stringWithCapacity:CC_SHA256_DIGEST_LENGTH * 2];
    for (int i = 0; i < CC_SHA256_DIGEST_LENGTH; i++) {
        [output appendFormat:@"%02x", digest[i]];
    }

    return output;
}

@end
