//
//  RXAliOSSManager.m
//  RXSDK-Pure
//
//  Created by 陈汉 on 2024/8/19.
//

#import "RXAliOSSManager.h"
#import <CommonCrypto/CommonDigest.h>
#import <CommonCrypto/CommonHMAC.h>

@implementation RXAliOSSManager

#pragma mark -- 阿里云 oss
+ (void)putFileAliOSSWithBodyData:(NSData *)bodyData response:(NSDictionary *)response ossPath:(NSString *)ossPath process:(void(^)(float process))process complete:(RequestComplete)complete
{
    /* initial each part of content to sign */
    NSString *bucket = response[@"data"][@"bucket"];
    NSString *region = response[@"data"][@"region"];
    __block NSString *domain = response[@"data"][@"domain"];
    NSString *method = @"PUT";
    NSString *contentType = @"application/octet-stream";
    NSString *contentMd5 = @"";
    NSString *date = [RXAliOSSManager oss_asStringValue];

    NSString *fecthPath = ossPath;
    if ([[fecthPath substringToIndex:1] isEqualToString:@"/"]) {
        fecthPath = [fecthPath stringByReplacingCharactersInRange:NSMakeRange(0, 1) withString:@""];
    }
    NSString *resource = [NSString stringWithFormat:@"/%@/%@", bucket, fecthPath];
    NSString *token = response[@"data"][@"credentials"][@"security_token"];
    NSString *xossHeader = [NSString stringWithFormat:@"x-oss-security-token:%@\n", token];
    
    /* now, join every part of content and sign */
    NSString *stringToSign = [NSString stringWithFormat:@"%@\n%@\n%@\n%@\n%@%@", method, contentMd5, contentType, date, xossHeader, resource];
    
    NSString *secret = response[@"data"][@"credentials"][@"access_key_secret"];
    NSString *signature = [RXAliOSSManager calBase64Sha1WithData:stringToSign withSecret:secret];
    
    NSString *keyid = response[@"data"][@"credentials"][@"access_key_id"];
    NSString *authorization = [NSString stringWithFormat:@"OSS %@:%@", keyid, signature];
    
    NSMutableDictionary *headers = [NSMutableDictionary dictionary];
    [headers setValue:authorization forKey:@"Authorization"];
    [headers setValue:contentType forKey:@"Content-Type"];
    [headers setValue:token forKey:@"x-oss-security-token"];
    [headers setValue:date forKey:@"Date"];
    
    NSString *urlStr = [NSString stringWithFormat:@"%@/%@", domain, fecthPath];
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:urlStr andParams:bodyData requsetMethod:RequestMethod_Put];
//    request.baseUrl = [RXConfig sharedManager].apiDomain;
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

+ (NSString *)calBase64Sha1WithData:(NSString *)data withSecret:(NSString *)key {
    NSData *secretData = [key dataUsingEncoding:NSUTF8StringEncoding];
    NSData *clearTextData = [data dataUsingEncoding:NSUTF8StringEncoding];
    uint8_t input[20];
    CCHmac(kCCHmacAlgSHA1, [secretData bytes], [secretData length], [clearTextData bytes], [clearTextData length], input);

    return [RXAliOSSManager calBase64WithData:input];
}

+ (NSString*)calBase64WithData:(uint8_t *)data {
    static char b[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    NSInteger a = 20;
    NSMutableData* c = [NSMutableData dataWithLength:((a + 2) / 3) * 4];
    uint8_t* d = (uint8_t*)c.mutableBytes;
    NSInteger i;
    for (i=0; i < a; i += 3) {
        NSInteger e = 0;
        NSInteger j;
        for (j = i; j < (i + 3); j++) {
            e <<= 8;
            if (j < a) {
                e |= (0xFF & data[j]);
            }
        }
        NSInteger index = (i / 3) * 4;
        d[index + 0] = b[(e >> 18) & 0x3F];
        d[index + 1] = b[(e >> 12) & 0x3F];
        if ((i + 1) < a) {
            d[index + 2] = b[(e >> 6) & 0x3F];
        } else {
            d[index + 2] = '=';
        }
        if ((i + 2) < a) {
            d[index + 3] = b[(e >> 0) & 0x3F];
        } else {
            d[index + 3] = '=';
        }
    }
    NSString *result = [[NSString alloc] initWithData:c encoding:NSASCIIStringEncoding];
    return result;
}

+ (NSString *)oss_asStringValue {
    NSDateFormatter *dateFormatter = [NSDateFormatter new];
    dateFormatter.timeZone = [NSTimeZone timeZoneWithName:@"GMT"];
    dateFormatter.locale = [NSLocale localeWithLocaleIdentifier:@"en_US"];
    dateFormatter.dateFormat = @"EEE, dd MMM yyyy HH:mm:ss z";
    
    return [dateFormatter stringFromDate:[NSDate date]];
}

@end
