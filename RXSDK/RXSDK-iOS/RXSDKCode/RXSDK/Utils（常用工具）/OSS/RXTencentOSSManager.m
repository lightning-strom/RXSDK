//
//  RXTencentOSSManager.m
//  RXSDK-Pure
//
//  Created by 陈汉 on 2024/8/19.
//

#import "RXTencentOSSManager.h"
#import <CommonCrypto/CommonDigest.h>
#import <CommonCrypto/CommonHMAC.h>

FOUNDATION_EXTERN NSDictionary *QCloudURLReadQuery(NSURL *url);

@implementation NSDictionary (HeaderFilter)

- (NSDictionary *)filteHeaders
{
    NSMutableDictionary *signedHeaders = [[NSMutableDictionary alloc] init];
    __block const NSArray *shouldSignedHeaderList =
        @[@"Content-Type", @"Content-Length", @"Content-MD5"];
    [self enumerateKeysAndObjectsUsingBlock:^(id _Nonnull key, id _Nonnull obj, BOOL *_Nonnull stop) {
        //签名的Headers列表：x开头的(x-cos-之类的),content-length,content-MD5
        BOOL shouldSigned = NO;
        for (NSString *header in [shouldSignedHeaderList copy]) {
            if ([header isEqualToString:((NSString *)key)]) {
                shouldSigned = YES;
            }
        }
        NSArray *headerSeperatedArray = [key componentsSeparatedByString:@"-"];
        if ([headerSeperatedArray firstObject] && [headerSeperatedArray.firstObject isEqualToString:@"x"]) {
            shouldSigned = YES;
        }
        if (shouldSigned) {
            signedHeaders[key] = obj;
        }
    }];
    return [signedHeaders copy];
}

@end

@implementation RXTencentOSSManager

#pragma mark -- 腾讯云 oss
+ (void)putFileTencentOSSWithBodyData:(NSData *)bodyData response:(NSDictionary *)response ossPath:(NSString *)ossPath process:(void(^)(float process))process complete:(RequestComplete)complete
{
    /* initial each part of content to sign */
    NSString *bucket = response[@"data"][@"bucket"];
    NSString *region = response[@"data"][@"region"];
    __block NSString *domain = response[@"data"][@"domain"];
    NSString *method = @"PUT";
    NSString *contentType = @"application/octet-stream";
    NSString *contentMd5 = @"";

    NSString *fecthPath = ossPath;
    if ([[fecthPath substringToIndex:1] isEqualToString:@"/"]) {
        fecthPath = [fecthPath stringByReplacingCharactersInRange:NSMakeRange(0, 1) withString:@""];
    }

    NSString *urlStr = [NSString stringWithFormat:@"%@/%@", domain, fecthPath];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:urlStr andParams:bodyData requsetMethod:RequestMethod_Put];
    
    NSMutableDictionary *headers = [NSMutableDictionary dictionary];
    [headers setValue:[@([bodyData length]) stringValue] forKey:@"Content-Length"];
    [headers setValue:contentType forKey:@"Content-Type"];
    [headers setValue:QCloudEncrytNSDataMD5Base64(bodyData) forKey:@"Content-MD5"];
    [headers setValue:[RXTencentOSSManager signatureForData:response[@"data"][@"credentials"] httpUrl:urlStr httpHeader:headers httpBody:nil] forKey:@"Authorization"];
    [headers setValue:response[@"data"][@"credentials"][@"security_token"] forKey:@"x-cos-security-token"];
    
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

+ (NSString *)signatureForData:(NSDictionary *)credential httpUrl:(NSString *)httpUrl httpHeader:(NSDictionary *)httpHeader httpBody:(NSDictionary *)httpBody {
    int64_t nowInterval = 0;
    if (credential[@"start_unix_time"]) {
        nowInterval = [RXTencentOSSManager convertTimeInterval: [credential[@"start_unix_time"] doubleValue]];
    }
    nowInterval = [[NSDate date] timeIntervalSince1970];
    //  默认一个签名为10分钟有效，防止签名时间过长，导致泄露
    NSTimeInterval experationInterVal = nowInterval + 10 * 60;
    if (credential[@"expiration_unix_time"]) {
        experationInterVal = [RXTencentOSSManager convertTimeInterval: [credential[@"expiration_unix_time"] doubleValue]];
    }
    NSString *signTime = [NSString stringWithFormat:@"%lld;%lld", (int64_t)nowInterval, (int64_t)experationInterVal];
    NSDictionary *headers = [httpHeader filteHeaders];
    NSDictionary *urlParamters = QCloudURLReadQuery([NSURL URLWithString:httpUrl]);
//    if (self.shouldSignedList) {
//        NSMutableDictionary *shouldSignedHeaderDic = [NSMutableDictionary dictionary];
//        NSMutableDictionary *shouldSignedParamsDic = [NSMutableDictionary dictionary];
//        for (NSString *key in self.shouldSignedList) {
//            if ([headers objectForKey:key]) {
//                shouldSignedHeaderDic[key] = [headers objectForKey:key];
//            } else if ([urlParamters objectForKey:key]) {
//                shouldSignedParamsDic[key] = [urlParamters objectForKey:key];
//            }
//        }
//        headers = [shouldSignedHeaderDic copy];
//        urlParamters = [shouldSignedParamsDic copy];
//    }
    NSDictionary * (^LowcaseDictionary)(NSDictionary *origin) = ^(NSDictionary *origin) {
        NSMutableDictionary *aim = [NSMutableDictionary new];
        NSArray *allKeys = origin.allKeys;

        for (NSString *key in allKeys) {
            NSString *transKey = key;
            if (![key isKindOfClass:[NSString class]]) {
                transKey = [NSString stringWithFormat:@"%@", key];
            }
            NSString *value = origin[key];
            aim[transKey.lowercaseString] = value;
        }
        return [aim copy];
    };

    // 11第一步生成signKey
    NSString *signKey = [RXTencentOSSManager qcloudHMACHexsha1:signTime secret:credential[@"access_key_secret"]];
    // Step2 构成FormatString
    NSString *headerFormat = QCloudURLEncodeParamters(LowcaseDictionary(headers), YES, NSUTF8StringEncoding);
//    NSString *urlFormat = QCloudURLEncodeParamters(LowcaseDictionary(urlParamters), YES, NSUTF8StringEncoding);
    NSString *urlFormat = QCloudURLEncodeParamters(LowcaseDictionary(urlParamters), YES, NSUTF8StringEncoding);

    NSMutableString *formatString = [NSMutableString new];

    void (^AppendFormatString)(NSString *) = ^(NSString *part) {
        [formatString appendFormat:@"%@\n", part];
    };

    AppendFormatString(@"put");
    NSString *path = [RXTencentOSSManager qcloud_path:[NSURL URLWithString:httpUrl]];
    if (path.length == 0) {
        path = @"/";
    }
    AppendFormatString(path);
    AppendFormatString(urlFormat);
    AppendFormatString(headerFormat);

    NSString *formatStringSHA = [RXTencentOSSManager qcloud_sha1:formatString];
    NSLog(@"format string is %@", formatString);
    // step 3 计算StringToSign

    NSString *stringToSign = [NSString stringWithFormat:@"%@\n%@\n%@\n", @"sha1", signTime, formatStringSHA];
    NSLog(@"StringToSign is %@", stringToSign);
    // step 4 计算签名

    NSString *signatureStr = [RXTencentOSSManager qcloudHMACHexsha1:stringToSign secret:signKey];

    // step 5 构造Authorization

    NSString * (^DumpAllKeys)(NSDictionary *) = ^(NSDictionary *info) {
        NSArray *keys = info.allKeys;

        NSMutableArray *redirectKeys = [NSMutableArray new];
        for (NSString *key in keys) {
            [redirectKeys addObject:key.lowercaseString];
        }
        [redirectKeys sortUsingComparator:^NSComparisonResult(id _Nonnull obj1, id _Nonnull obj2) {
            return [obj1 compare:obj2];
        }];

        NSString *keyString = @"";
        for (int i = 0; i < redirectKeys.count; i++) {
            keyString = [keyString stringByAppendingString:redirectKeys[i]];
            if (i < (int)redirectKeys.count - 1) {
                keyString = [keyString stringByAppendingString:@";"];
            }
        }
        return keyString;
    };

    // key有效期
    NSString *keyTime = signTime;
    NSString *authoration =
        [NSString stringWithFormat:@"q-sign-algorithm=sha1&q-ak=%@&q-sign-time=%@&q-key-time=%@&q-header-list=%@&q-url-param-list=%@&q-signature=%@",
         credential[@"access_key_id"], signTime, signTime, DumpAllKeys(headers), DumpAllKeys(urlParamters), signatureStr];
    NSLog(@"authoration is %@", authoration);
//    signature.token = self.credential.token;
    return authoration;
}

+ (NSTimeInterval)convertTimeInterval:(double) value {
    NSDate *date = [NSDate dateWithTimeIntervalSince1970:value];
    return [date timeIntervalSince1970];
}

+ (NSString *)qcloudHMACHexsha1:(NSString *)data secret:(NSString *)key {
    
    const char *cKey  = [key cStringUsingEncoding:NSASCIIStringEncoding];
    const char *cData = [data cStringUsingEncoding:NSASCIIStringEncoding];
    
    unsigned char cHMAC[CC_SHA1_DIGEST_LENGTH];
    
    CCHmac(kCCHmacAlgSHA1, cKey, strlen(cKey), cData, strlen(cData), cHMAC);
    
    NSData *HMAC = [[NSData alloc] initWithBytes:cHMAC length:sizeof(cHMAC)];
    const unsigned char *dataBuffer = (const unsigned char *)[HMAC bytes];
    
    if (!dataBuffer) {
        return [NSString string];
    }
    
    NSUInteger dataLength = [HMAC length];
    NSMutableString *hexString = [NSMutableString stringWithCapacity:(dataLength * 2)];
    
    for (int i = 0; i < dataLength; ++i) {
        [hexString appendFormat:@"%02x", (unsigned int)dataBuffer[i]];
    }
    
    return [NSString stringWithString:hexString];
}

NSString * (^DumpAllKeys)(NSDictionary *) = ^(NSDictionary *info) {
    NSArray *keys = info.allKeys;

    NSMutableArray *redirectKeys = [NSMutableArray new];
    for (NSString *key in keys) {
        [redirectKeys addObject:key.lowercaseString];
    }
    [redirectKeys sortUsingComparator:^NSComparisonResult(id _Nonnull obj1, id _Nonnull obj2) {
        return [obj1 compare:obj2];
    }];

    NSString *keyString = @"";
    for (int i = 0; i < redirectKeys.count; i++) {
        keyString = [keyString stringByAppendingString:redirectKeys[i]];
        if (i < (int)redirectKeys.count - 1) {
            keyString = [keyString stringByAppendingString:@";"];
        }
    }
    return keyString;
};

NSString *QCloudURLEncodeParamters(NSDictionary *dic, BOOL willUrlEncoding, NSStringEncoding stringEncoding) {
    NSArray *allKeys = dic.allKeys;
    allKeys = [allKeys sortedArrayUsingComparator:^NSComparisonResult(id _Nonnull obj1, id _Nonnull obj2) {
        return [obj1 compare:obj2];
    }];
    NSMutableString *path = [NSMutableString new];
    for (int i = 0; i < allKeys.count; i++) {
        if (i > 0) {
            [path appendString:@"&"];
        }
        NSString *key = allKeys[i];
        NSString *value = dic[key];
        if (willUrlEncoding) {
            key = QCloudStrigngURLEncode(key, stringEncoding);
            value = QCloudStrigngURLEncode(value, stringEncoding);
        }

        NSString *segement = [NSString stringWithFormat:@"%@=%@", key, value];
        [path appendString:segement];
    }
    return [path copy];
}

NSString *QCloudURLAppendParamters(NSString *base, NSString *paramters) {
    if (paramters.length == 0) {
        return base;
    }
    if ([paramters hasPrefix:@"?"]) {
        paramters = [paramters substringFromIndex:1];
    }

    NSRange range = [base rangeOfString:@"?"];
    if (range.location != NSNotFound) {
        if ([base hasSuffix:@"?"]) {
            return [NSString stringWithFormat:@"%@%@", base, paramters];
        } else {
            if ([base hasSuffix:@"&"]) {
                return [NSString stringWithFormat:@"%@%@", base, paramters];
            } else {
                return [NSString stringWithFormat:@"%@&%@", base, paramters];
            }
        }
    } else {
        return [NSString stringWithFormat:@"%@?%@", base, paramters];
    }
}

NSString *QCloudStrigngURLEncode(NSString *string, NSStringEncoding stringEncoding) {
    NSString *escaped_value = (NSString *)CFBridgingRelease(CFURLCreateStringByAddingPercentEscapes(
        NULL, (CFStringRef)string, NULL, CFSTR(":/?#[]@!$ &'()*+,;=\"<>%{}|\\^`"), CFStringConvertNSStringEncodingToEncoding(stringEncoding)));
    if (escaped_value) {
        return escaped_value;
    }
    return @"";
}

NSString *QCloudPercentEscapedStringFromString(NSString *string) {
    static NSString *const kAFCharactersGeneralDelimitersToEncode = @":#[]@"; // does not include "?" or "/" due to RFC 3986 - Section 3.4
    static NSString *const kAFCharactersSubDelimitersToEncode = @"?!$&'()*+,;=";

    NSMutableCharacterSet *allowedCharacterSet = [[NSCharacterSet URLQueryAllowedCharacterSet] mutableCopy];
    [allowedCharacterSet
        removeCharactersInString:[kAFCharactersGeneralDelimitersToEncode stringByAppendingString:kAFCharactersSubDelimitersToEncode]];

    // FIXME: https://github.com/AFNetworking/AFNetworking/pull/3028
    // return [string stringByAddingPercentEncodingWithAllowedCharacters:allowedCharacterSet];

    static NSUInteger const batchSize = 50;

    NSUInteger index = 0;
    NSMutableString *escaped = @"".mutableCopy;

    while (index < string.length) {
        NSUInteger length = MIN(string.length - index, batchSize);
        NSRange range = NSMakeRange(index, length);

        // To avoid breaking up character sequences such as 👴🏻👮🏽
        range = [string rangeOfComposedCharacterSequencesForRange:range];

        NSString *substring = [string substringWithRange:range];
        NSString *encoded = [substring stringByAddingPercentEncodingWithAllowedCharacters:allowedCharacterSet];
        [escaped appendString:encoded];

        index += range.length;
    }

    return escaped;
}

NSDictionary *QCloudURLReadQuery(NSURL *url) {
    NSString *query = url.query;
    if (!query) {
        return @ {};
    }
    NSMutableDictionary *queryDic = [NSMutableDictionary new];
    NSArray *keyvalues = [query componentsSeparatedByString:@"&"];
    for (NSString *kv in keyvalues) {
        if (!kv.length) {
            continue;
        }
        NSArray <NSString *>*vs = [kv componentsSeparatedByString:@"="];
        if (vs.count == 2) {
            if(vs.lastObject.length>0){
                queryDic[QCloudStringURLDecode(vs[0], NSUTF8StringEncoding)] = QCloudStringURLDecode(vs[1], NSUTF8StringEncoding);
            }
        } else if (vs.count == 1) {
            queryDic[QCloudStringURLDecode(vs.firstObject, NSUTF8StringEncoding)] = @"";
        }
    }
    return queryDic;
}

NSString* QCloudEncrytNSDataMD5Base64(NSData* data)
{
    if (!data) {
        return nil;
    }
    
    unsigned char result[CC_MD5_DIGEST_LENGTH];
    CC_MD5( data.bytes, (CC_LONG)data.length, result ); // This is the md5 call
    NSData* md5data = [NSData dataWithBytes:result length:CC_MD5_DIGEST_LENGTH];
    return [md5data base64EncodedStringWithOptions:0];
}

NSString *QCloudStringURLDecode(NSString *string, NSStringEncoding encoding) {
    NSString *decoded = [string stringByReplacingPercentEscapesUsingEncoding:encoding];
    return decoded;
}

+ (NSString *)qcloud_path:(NSURL *)url {
    NSString *path = QCloudPercentEscapedStringFromString(url.path);
    // absoluteString in NSURL is URLEncoded
    NSRange pathRange = [url.absoluteString rangeOfString:path];
    NSUInteger URLLength = url.absoluteString.length;
    if (pathRange.location == NSNotFound) {
        return url.path;
    }
    NSUInteger pathLocation = pathRange.location + pathRange.length;
    if (pathLocation >= URLLength) {
        return url.path;
    }
    if ([url.absoluteString characterAtIndex:(pathLocation)] == '/') {
        path = [url.path stringByAppendingString:@"/"];
        return path;
    }

    return url.path;
}

+ (NSString *)qcloud_sha1:(NSString *)str
{
    NSData *data = [str dataUsingEncoding:NSUTF8StringEncoding];
    uint8_t digest[CC_SHA1_DIGEST_LENGTH];
    
    CC_SHA1(data.bytes,(CC_LONG) data.length, digest);
    
    NSMutableString *output = [NSMutableString stringWithCapacity:CC_SHA1_DIGEST_LENGTH * 2];
    
    for (int i = 0; i < CC_SHA1_DIGEST_LENGTH; i++)
    {
        [output appendFormat:@"%02x", digest[i]];
    }
    
    return output;
}

@end
