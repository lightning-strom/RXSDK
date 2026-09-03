//
//  RXIMCreditUploadManager.m
//  RXIMSdk
//
//  Created by 陈汉 on 2021/9/23.
//

#import "RXIMCreditUploadManager.h"
#import "NSObject+RXUAddition.h"
#import "RXIMUserUtility.h"
#import <CommonCrypto/CommonDigest.h>
#import "RXIMLogManager.h"

@implementation RXIMCreditUploadManager

+ (instancetype)sharedManager {
    static RXIMCreditUploadManager *_manager = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        _manager = [[RXIMCreditUploadManager alloc] init];
        [_manager initClient];
    });
    return _manager;
}

//初始化
-(void)initClient
{
    _imOSSTaskArray = [NSMutableArray array];
    // 创建 CredentialProvider
    NSString *urlStr = [NSString stringWithFormat:@"%@/v1/ims/media/getststoken",[RXIMUserUtility sharedManager].baseUrl];
    id<OSSCredentialProvider> credential = [[OSSAuthCredentialProvider alloc] initWithAuthServerUrl:urlStr responseDecoder:^NSData * _Nullable(NSData * _Nonnull data) {
        NSDictionary * object = [NSJSONSerialization JSONObjectWithData:data
                                                                options:kNilOptions
                                                                  error:nil];

        int statusCode = [[object objectForKey:@"code"] intValue];
        if (statusCode == 0) {
            NSMutableDictionary *dic = [NSMutableDictionary dictionary];
            NSMutableDictionary *obj = object[@"data"];
            dic[@"StatusCode"] = @(200);
            dic[@"AccessKeyId"] = [obj objectForKey:@"AccessKeyId"];
            dic[@"AccessKeySecret"] = [obj objectForKey:@"AccessKeySecret"];
            dic[@"SecurityToken"] = [obj objectForKey:@"SecurityToken"];
            dic[@"Expiration"] = [NSString stringWithFormat:@"%@", [obj objectForKey:@"Expiration"]];
            return [dic rx_modelToJSONData];
        }else{
            return data;
        }
    }];
    
    OSSClientConfiguration *config = [[OSSClientConfiguration alloc] init];
//    // 网络请求遇到异常失败后的重试次数
    config.maxRetryCount = 3;
    // 网络请求的超时时间
    config.timeoutIntervalForRequest = 15;
    // 允许资源传输的最长时间
    config.timeoutIntervalForResource = 24 * 60 * 60;
    config.isHttpdnsEnable = NO;
    OSSClient *client = [[OSSClient alloc] initWithEndpoint:[RXIMUserUtility sharedManager].ossEndpoint credentialProvider:credential clientConfiguration:config];
    self.imDefaultClient = client;
}

+ (void)RXIMOSSUpload:(NSData *)data path:(NSString *)path folderName:(NSString *)folderName fileType:(NSString *)fileType uploadProgress: (OSSNetworkingUploadProgressBlock)uploadProgress success:(void (^_Nullable)(id result))success failure:(void (^_Nullable)(void))failure
{
    [RXIMCreditUploadManager sharedManager];
    
    NSString *objectKey = [NSString stringWithFormat:@"ims/%@/%@_%@.%@", folderName, [RXIMUserUtility sharedManager].userId, [RXIMCreditUploadManager stringFromMD5:path], fileType];
    
    if([self doesObjectExistInBucketWithObjectKey:objectKey bucket:[RXIMUserUtility sharedManager].ossBucketName]){
        uploadProgress(0,1,1);
    }
    
    NSLog(@"imendpoint:  %@\n imossbucketname:  %@", [RXIMUserUtility sharedManager].ossEndpoint, [RXIMUserUtility sharedManager].ossBucketName);
    
    OSSPutObjectRequest * put = [OSSPutObjectRequest new];
    put.bucketName = [RXIMUserUtility sharedManager].ossBucketName;//图片存储空间
    put.objectKey = objectKey;//存储空间所属文件名字
    put.uploadingData = data;//文件数据
    // 上传进度
    put.uploadProgress = ^(int64_t bytesSent, int64_t totalByteSent, int64_t totalBytesExpectedToSend) {
        // 当前上传段长度、当前已经上传总长度、一共需要上传的总长度
        RXLogInfo(prefixStr, @"%lld, %lld, %lld", bytesSent, totalByteSent, totalBytesExpectedToSend);
        float progress = 1.f * totalByteSent / totalBytesExpectedToSend;
        uploadProgress(bytesSent,totalByteSent,totalBytesExpectedToSend);
        RXLogInfo(prefixStr, @"上传进度: %f", progress);
    };
    OSSTask * putTask = [[RXIMCreditUploadManager sharedManager].imDefaultClient putObject:put];
    [putTask waitUntilFinished]; // 阻塞直到上传完成
    
    [putTask continueWithBlock:^id(OSSTask *task) {
        if (!task.error) {
            RXLogInfo(prefixStr, @"上传成功");
            if(task.result){
                success([NSString stringWithFormat:@"%@/%@", [RXIMUserUtility sharedManager].ossDomain,objectKey]);
            }else{
                failure();
            }
        } else {
            RXLogError(prefixStr, @"上传失败, error: %@" , task.error);
            failure();
        }
        [[RXIMCreditUploadManager sharedManager].imOSSTaskArray removeObject:put];
        return nil;
    }];
    [[RXIMCreditUploadManager sharedManager].imOSSTaskArray addObject:put];
}

+ (BOOL)doesObjectExistInBucketWithObjectKey:(NSString *)objectKey bucket:(NSString *)bucket{
    NSError * error = nil;
    BOOL isExist = [[RXIMCreditUploadManager sharedManager].imDefaultClient doesObjectExistInBucket:bucket objectKey:objectKey error:&error];
    if (!error) {
        if(isExist) {
            RXLogInfo(prefixStr, @"File exists.");
            return YES;
        } else {
            RXLogInfo(prefixStr, @"File not exists.");
            return NO;
        }
    } else {
        return NO;
    }
}

+ (NSString *)stringFromMD5:(NSString *)string
{
    
    if(string == nil || [string length] == 0)
        return nil;
    
    const char *value = [string UTF8String];
    
    unsigned char outputBuffer[CC_MD5_BLOCK_BYTES];
    CC_MD5(value, (int)strlen(value), outputBuffer);
    
    NSMutableString *outputString = [[NSMutableString alloc] initWithCapacity:CC_MD5_DIGEST_LENGTH * 2];
    for(NSInteger count = 0; count < CC_MD5_DIGEST_LENGTH; count++){
        [outputString appendFormat:@"%02x",outputBuffer[count]];
    }
    
    return outputString;
}

@end
