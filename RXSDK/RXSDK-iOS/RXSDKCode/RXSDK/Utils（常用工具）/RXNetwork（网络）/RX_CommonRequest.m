//
//  RXRequest.m
//  OverseaSocialApp
//
//  Created by 陈汉 on 2021/4/15.
//

#import "RX_CommonRequest.h"
#import "RXUserUtility.h"
#import <objc/message.h>
#import "RXLogManager.h"
#import "NSData+Encrypt.h"

@interface RX_CommonRequest () <NSURLSessionTaskDelegate>

@property (nonatomic, copy) ProcessBlock processBlock;

@end

@implementation RX_CommonRequest

static RX_CommonRequest *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RX_CommonRequest alloc] init];
    });
    return sharedSDK;
}

- (instancetype) initWithApiName:(NSString *)apiName andParams:(NSDictionary * __nullable)parmas{
    self = [self initWithApiName:apiName andParams:parmas requsetMethod:RequestMethod_Post];
    return self;
}
- (instancetype) initWithApiName:(NSString *)apiName andParams:(NSDictionary * __nullable)parmas requsetMethod:(RequestMethod)method{
    self= [super init];
    if (self) {
        self.apiName=apiName;
        self.params=[parmas copy];
        self.requestMethod=method;
        self.ssl=YES;
        self.isSetQueryStringSerialization = YES;
        self.failedTimes = 0;
        self.needRetry = YES;
    }
    return self;
}

+ (void)rx_requestWithUrl:(NSString *)urlString
               parameters:(nullable id)parameters
                  headers:(nullable NSDictionary <NSString *, NSString *> *)headers
              requestType:(NSString *)requestType
             SuccessBlock:(nullable void (^)(NSURLSessionDataTask * _Nonnull, id _Nullable, NSURLResponse * _Nullable urlResponse))successBlock
               ErrorBlock:(void (^)(NSURLSessionDataTask * _Nullable, NSError * _Nonnull))errorBlock
{
    NSURLSession *session = [NSURLSession sharedSession];

    id params;
    if ([parameters isKindOfClass:[NSArray class]]) {
        params = [NSJSONSerialization dataWithJSONObject:parameters options:NSJSONWritingPrettyPrinted error:nil];
    } else if ([parameters isKindOfClass:[NSData class]]) {
        params = parameters;
    } else {
        params = [NSMutableDictionary dictionaryWithDictionary:parameters];
    }
    
    // 是否需要加密，初始化不加密
    if (![urlString containsString:@"v1/sdkconfig/init"]) {
        NSString *needCrypt = headers[@"ruixue-encipher"];
        if ([[NSString rx_isNullToString:needCrypt] isEqualToString:@"1"]) {
            if ([params isKindOfClass:[NSArray class]] || [params isKindOfClass:[NSDictionary class]]) {
                NSData *jsonData = [NSJSONSerialization dataWithJSONObject:params options:0 error:nil];
                NSString *encrypt = [jsonData AES256CBCEncrypt];
                if ([NSString rx_isNullToString:encrypt].length > 0) {
                    params = encrypt;
                } else {
                    // 加密失败明文请求
                    NSMutableDictionary *requestHeader = [NSMutableDictionary dictionaryWithDictionary:headers];
                    [requestHeader setValue:@"application/json" forKey:@"Content-Type"];
                    [requestHeader setValue:@"0" forKey:@"ruixue-encipher"];
                    
                    headers = requestHeader;
                    
                    // 上报事件
                    NSMutableDictionary *properties = [NSMutableDictionary dictionary];
                    [properties setValue:[NSData getCBCKey] forKey:@"key"];
                    [[RXLogManager sharedSDK] trackErrorPrivateMsgWithRequestHeader:headers bodyDic:params action:@"encrypt" url:urlString code:0 msg:@"" thirdType:@"" thirdcode:0 thirdmsg:@"" traceid:@"" properties:properties];
                }
                
            } else {
                NSString *encrypt = [params AES256CBCEncrypt];
                if ([NSString rx_isNullToString:encrypt].length > 0) {
                    params = encrypt;
                } else {
                    // 上报事件
                    NSMutableDictionary *properties = [NSMutableDictionary dictionary];
                    [properties setValue:[NSData getCBCKey] forKey:@"key"];
                    [[RXLogManager sharedSDK] trackErrorPrivateMsgWithRequestHeader:headers bodyDic:params action:@"encrypt" url:urlString code:0 msg:@"" thirdType:@"" thirdcode:0 thirdmsg:@"" traceid:@"" properties:properties];
                    
                    // 加密失败明文请求
                    NSMutableDictionary *requestHeader = [NSMutableDictionary dictionaryWithDictionary:headers];
                    [requestHeader setValue:@"application/json" forKey:@"Content-Type"];
                    [requestHeader setValue:@"0" forKey:@"ruixue-encipher"];
                    
                    headers = requestHeader;
                }
            }
        }
    } else {
        NSMutableDictionary *requestHeader = [NSMutableDictionary dictionaryWithDictionary:headers];
        [requestHeader setValue:@"application/json" forKey:@"Content-Type"];
        [requestHeader setValue:@"0" forKey:@"ruixue-encipher"];
        
        headers = requestHeader;
    }

    //创建对象 采用可变的网络请求对象
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:urlString]];
    //如果请求方式是POST
    if ([requestType isEqualToString:@"POST"]){
        [request setHTTPMethod:requestType];//设置请求方式
        if (params){
            if ([params isKindOfClass:[NSData class]]) {
                if ([RXUserUtility sharedManager].isGZip) {
                    [request setHTTPBody:params];
                } else {
                    NSString *dataStr = [[NSString alloc] initWithData:params encoding:NSUTF8StringEncoding];
                    [request setHTTPBody:[dataStr dataUsingEncoding:NSUTF8StringEncoding]];
                }
            } else if ([params isKindOfClass:[NSString class]]) {
                [request setHTTPBody:[params dataUsingEncoding:NSUTF8StringEncoding]];
            } else {
                NSData *jsonData = [NSJSONSerialization dataWithJSONObject:params options:0 error:nil];
                NSString *dataStr =[[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
                [request setHTTPBody:[dataStr dataUsingEncoding:NSUTF8StringEncoding]];
            }
        }
    } else if ([requestType isEqualToString:@"PUT"]) {
        [request setHTTPMethod:requestType];
        if ([params isKindOfClass:[NSDictionary class]]) {
            NSData *jsonData = [NSJSONSerialization dataWithJSONObject:params options:0 error:nil];
            NSString *dataStr =[[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
            [request setHTTPBody:[dataStr dataUsingEncoding:NSUTF8StringEncoding]];
        } else {
            [request setHTTPBody:params];
        }
    } else if ([requestType isEqualToString:@"DELETE"]) {
        [request setHTTPMethod:requestType];
        if ([params isKindOfClass:[NSDictionary class]]) {
            NSData *jsonData = [NSJSONSerialization dataWithJSONObject:params options:0 error:nil];
            NSString *dataStr =[[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
            [request setHTTPBody:[dataStr dataUsingEncoding:NSUTF8StringEncoding]];
        } else {
            [request setHTTPBody:params];
        }
    }
    
    for (int i = 0; i < headers.allKeys.count; i++) {
        [request setValue:headers.allValues[i] forHTTPHeaderField:headers.allKeys[i]];
    }
    
    NSString *ua = [RXUserUtility sharedManager].userAgent;
    if ([NSString rx_isNullToString:ua].length > 0) {
        [request setValue:ua forHTTPHeaderField:@"user-agent"];
    }
    
    // 超时时间
    request.timeoutInterval = 7;
    
    if (![urlString containsString:@"data/api/track"]) {
        NSLog(@"请求头:\n %@", headers);
        NSLog(@"请求参数:\n %@", params);
        NSLog(@"请求地址:\n %@", urlString);
    }
    
    __block NSURLSessionDataTask *task = [session dataTaskWithRequest:request completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error){
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error == nil){
                successBlock(task, data, response);
                //网关错误上报
                NSError *error = nil;
                NSDictionary *resultDictionary = [NSJSONSerialization JSONObjectWithData:data options:kNilOptions error:&error];
                NSString *errorCodeStr = [NSString stringWithFormat:@"%@", resultDictionary[@"code"]];
                if (errorCodeStr.length == 6 && [[errorCodeStr substringWithRange:NSMakeRange(2, 2)] isEqualToString:@"20"]) {
                    NSString *traceid = [headers valueForKey:@"ruixue-traceid"];
                    NSDictionary *bodyParam = [NSDictionary dictionary];
                    if ([requestType isEqualToString:@"POST"] || [requestType isEqualToString:@"PUT"]) {
                        bodyParam = parameters;
                    }else{
                        bodyParam = [RXCommonTool parseQueryParametersFromURL:request.URL.absoluteString];
                    }
                    [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:headers bodyDic:bodyParam action:@"" url:request.URL.absoluteString code:resultDictionary[@"code"] == nil ? -123 : [resultDictionary[@"code"] integerValue] msg:resultDictionary[@"msg"] thirdType:@"" thirdcode:-123 thirdmsg:@"" traceid:traceid];
                }
            }else{
//NSURLErrorDNSLookupFailed：表示 DNS 查找失败，即无法解析域名导致的错误。
//NSURLErrorCannotFindHost：表示无法找到主机，可能是由于 DNS 解析失败或主机名无效。
//NSURLErrorCannotConnectToHost：表示无法连接到主机，常由于网络连接问题、主机不可达或端口不可访问等原因导致的错误。
                if ((error.code == NSURLErrorDNSLookupFailed) || (error.code == NSURLErrorCannotFindHost) || (error.code == NSURLErrorCannotConnectToHost)) {
                    if ([RXUserUtility sharedManager].isUseDNS) {
                        NSURLSessionDataTask *backTask = task;//用于DNS失败时，避免task为nil，做为返回的task
                        
                        BOOL hasAliDNS = [RXSubPackage sharedSDK].aAliDNS;
                        BOOL hasTencentDNS = [RXSubPackage sharedSDK].aTencentDNS;
                        
                        if (hasAliDNS && hasTencentDNS) {//两个SDK都安装了
                            DNSRequestSuccessBlock tencentSucBlock = ^(NSURLSessionDataTask * _Nonnull task, id _Nullable data) {
                                dispatch_async(dispatch_get_main_queue(), ^{
                                    successBlock(task, data, nil);
                                });
                            };
                            
                            //腾讯云DNS解析失败后，继续使用阿里云DNS解析，如果还失败，则返回失败回调
                            DNSRequestFailBlock tecentFailBlock = ^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
                                DNSRequestSuccessBlock aliSucBlock = ^(NSURLSessionDataTask * _Nonnull task, id _Nullable data) {
                                    dispatch_async(dispatch_get_main_queue(), ^{
                                        successBlock(task, data, nil);
                                    });
                                };
                                DNSRequestFailBlock aliFailBlock = ^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
                                    dispatch_async(dispatch_get_main_queue(), ^{
                                        if (task == nil) {
                                            errorBlock(backTask, error);
                                        }else{
                                            errorBlock(task, error);
                                        }
                                    });
                                    
                                    [RXLogManager addErrorLogWithRequest:request parameters:params headers:headers requestType:requestType thirdType:@"" error:error];
                                };
                                dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
                                    NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
                                    [notiDic setValue:request forKey:@"request"];
                                    [notiDic setValue:aliSucBlock forKey:@"sucBlock"];
                                    [notiDic setValue:aliFailBlock forKey:@"failBlock"];
                                    [RXNotificationCenter postNoti:rxUserDefault_aliDNS object:nil userInfo:notiDic];
                                });
                            };
                            
                            dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
                                NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
                                [notiDic setValue:request forKey:@"request"];
                                [notiDic setValue:tencentSucBlock forKey:@"sucBlock"];
                                [notiDic setValue:tecentFailBlock forKey:@"failBlock"];
                                [RXNotificationCenter postNoti:rxUserDefault_tencentDNS object:nil userInfo:notiDic];
                            });
                            
                        } else if (hasTencentDNS && !hasAliDNS) {//腾讯
                            DNSRequestSuccessBlock tencentSucBlock = ^(NSURLSessionDataTask * _Nonnull task, id _Nullable data) {
                                dispatch_async(dispatch_get_main_queue(), ^{
                                    successBlock(task, data, nil);
                                });
                            };
                            DNSRequestFailBlock tecentFailBlock = ^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
                                dispatch_async(dispatch_get_main_queue(), ^{
                                    if (task == nil) {
                                        errorBlock(backTask, error);
                                    }else{
                                        errorBlock(task, error);
                                    }
                                });
                                
                                [RXLogManager addErrorLogWithRequest:request parameters:params headers:headers requestType:requestType thirdType:@"" error:error];
                            };
                            dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
                                NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
                                [notiDic setValue:request forKey:@"request"];
                                [notiDic setValue:tencentSucBlock forKey:@"sucBlock"];
                                [notiDic setValue:tecentFailBlock forKey:@"failBlock"];
                                [RXNotificationCenter postNoti:rxUserDefault_tencentDNS object:nil userInfo:notiDic];
                            });
                            
                        }else if (!hasTencentDNS && hasAliDNS) {//阿里
                            DNSRequestSuccessBlock aliSucBlock = ^(NSURLSessionDataTask * _Nonnull task, id _Nullable data) {
                                dispatch_async(dispatch_get_main_queue(), ^{
                                    successBlock(task, data, nil);
                                });
                            };
                            DNSRequestFailBlock aliFailBlock = ^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
                                dispatch_async(dispatch_get_main_queue(), ^{
                                    if (task == nil) {
                                        errorBlock(backTask, error);
                                    }else{
                                        errorBlock(task, error);
                                    }
                                });
                                
                                [RXLogManager addErrorLogWithRequest:request parameters:params headers:headers requestType:requestType thirdType:@"" error:error];
                            };
                            dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
                                NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
                                [notiDic setValue:request forKey:@"request"];
                                [notiDic setValue:aliSucBlock forKey:@"sucBlock"];
                                [notiDic setValue:aliFailBlock forKey:@"failBlock"];
                                [RXNotificationCenter postNoti:rxUserDefault_aliDNS object:nil userInfo:notiDic];
                            });
                        }else{//腾讯阿里SDK均不存在，仍正常执行失败回调
                            errorBlock(task, error);
                            
                            [RXLogManager addErrorLogWithRequest:request parameters:params headers:headers requestType:requestType thirdType:@"" error:error];
                        }
                    }else{//DNS开关关闭，仍正常执行失败回调
                        errorBlock(task, error);
                        
                        [RXLogManager addErrorLogWithRequest:request parameters:params headers:headers requestType:requestType thirdType:@"" error:error];
                    }
                }else{//不是DNS相关错误，仍正常执行失败回调
                    errorBlock(task, error);
                    
                    [RXLogManager addErrorLogWithRequest:request parameters:params headers:headers requestType:requestType thirdType:@"" error:error];
                }
            }
        });
        
    }];
    [task resume];
}

#pragma mark - 文件上传
+ (void)rx_uploadRequestWithUrl:(NSString *)urlString
                     parameters:(nullable id)parameters
                        headers:(nullable NSDictionary <NSString *, NSString *> *)headers
                    requestType:(NSString *)requestType
                   processBlock:(ProcessBlock)processBlock
                   SuccessBlock:(nullable void (^)(NSURLSessionDataTask * _Nonnull, id _Nullable))successBlock
                     ErrorBlock:(void (^)(NSURLSessionDataTask * _Nullable, NSError * _Nonnull))errorBlock
{
    [RX_CommonRequest sharedSDK].processBlock = processBlock;
    
    NSURLSession *session = [NSURLSession sharedSession];
    NSURLSessionConfiguration *config = [NSURLSessionConfiguration defaultSessionConfiguration];
    session = [NSURLSession sessionWithConfiguration:config delegate:[RX_CommonRequest sharedSDK] delegateQueue:0];
    
    id params;
    if ([parameters isKindOfClass:[NSArray class]]) {
        params = [NSJSONSerialization dataWithJSONObject:parameters options:NSJSONWritingPrettyPrinted error:nil];
    } else if ([parameters isKindOfClass:[NSData class]]) {
        params = parameters;
    } else {
        params = [NSMutableDictionary dictionaryWithDictionary:parameters];
    }

    //创建对象 采用可变的网络请求对象
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:urlString]];
    //如果请求方式是POST
    if ([requestType isEqualToString:@"POST"]){
        [request setHTTPMethod:requestType];//设置请求方式
        if (params){
            if ([params isKindOfClass:[NSData class]]) {
                if ([RXUserUtility sharedManager].isGZip) {
                    [request setHTTPBody:params];
                } else {
                    NSString *dataStr = [[NSString alloc] initWithData:params encoding:NSUTF8StringEncoding];
                    [request setHTTPBody:[dataStr dataUsingEncoding:NSUTF8StringEncoding]];
                }
            } else {
                NSData *jsonData = [NSJSONSerialization dataWithJSONObject:params options:0 error:nil];
                NSString *dataStr =[[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
                [request setHTTPBody:[dataStr dataUsingEncoding:NSUTF8StringEncoding]];
            }
        }
    } else if ([requestType isEqualToString:@"PUT"]) {
        [request setHTTPMethod:requestType];
        [request setHTTPBody:params];
    } else if ([requestType isEqualToString:@"DELETE"]) {
        [request setHTTPMethod:requestType];
        [request setHTTPBody:params];
    }
    
    for (int i = 0; i < headers.allKeys.count; i++) {
        [request setValue:headers.allValues[i] forHTTPHeaderField:headers.allKeys[i]];
    }
    
    NSString *ua = [RXUserUtility sharedManager].userAgent;
    if ([NSString rx_isNullToString:ua].length > 0) {
        [request setValue:ua forHTTPHeaderField:@"user-agent"];
    }
    
    // 超时时间
    request.timeoutInterval = 600;
    
    __block NSURLSessionDataTask *task = [session uploadTaskWithRequest:request fromData:request.HTTPBody completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error == nil){
                successBlock(task, data);
            } else {
                errorBlock(task, error);
            }
        });
    }];
    [task resume];
}

// 上传进度
- (void)URLSession:(NSURLSession *)session task:(NSURLSessionTask *)task didSendBodyData:(int64_t)bytesSent totalBytesSent:(int64_t)totalBytesSent totalBytesExpectedToSend:(int64_t)totalBytesExpectedToSend {
    // 进度 = 已发送的 / 一共需要发送的
    float process = totalBytesSent * 1.0 / totalBytesExpectedToSend;
    
    if (self.processBlock) {
        self.processBlock(process);
    }
//    NSLog(@"%f", process);
}

// 上传完成
- (void)URLSession:(NSURLSession *)session task:(NSURLSessionTask *)task didCompleteWithError:(NSError *)error {
//    NSLog(@"上传完成");
}

@end
