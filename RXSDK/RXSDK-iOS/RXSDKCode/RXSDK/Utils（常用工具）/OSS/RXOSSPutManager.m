//
//  RXOSSPutManager.m
//  RXSDK
//
//  Created by 陈汉 on 2023/12/8.
//

#import "RXOSSPutManager.h"
#import "RXAliOSSManager.h"
#import "RXTencentOSSManager.h"
#import "RXAwsOSSManager.h"

@interface RXOSSPutManager ()

@end

@implementation RXOSSPutManager

static RXOSSPutManager *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXOSSPutManager alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init
{
    self = [super init];
    if (self) {

    }
    return self;
}

// 获取sts
- (void)getSTS:(RequestComplete)complete
{
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"/v1/thirdparty/api/oss_sts" andParams:nil requsetMethod:RequestMethod_Get];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"获取STS成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"获取STS失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 上传文件
 * @param bodyData 文件二进制
 */
- (void)uploadWithBodyData:(NSData *)bodyData ossPath:(NSString *)ossPath process:(void(^)(float process))process complete:(RequestComplete)complete
{
    [self getSTS:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (!error) {
            // 获取服务商
            NSString *provider = response[@"data"][@"provider"];
            if ([provider isEqualToString:@"ali"]) {
                [RXAliOSSManager putFileAliOSSWithBodyData:bodyData response:response ossPath:ossPath process:process complete:complete];
            } else if ([provider isEqualToString:@"tencent"]) {
                [RXTencentOSSManager putFileTencentOSSWithBodyData:bodyData response:response ossPath:ossPath process:process complete:complete];
            } else if ([provider isEqualToString:@"aws"]) {
                [RXAwsOSSManager putFileAmazonOSSWithBodyData:bodyData response:response ossPath:ossPath process:process complete:complete];
            }
        } else {
            if (complete) {
                complete(nil, error);
            }
        }
    }];
}

@end
