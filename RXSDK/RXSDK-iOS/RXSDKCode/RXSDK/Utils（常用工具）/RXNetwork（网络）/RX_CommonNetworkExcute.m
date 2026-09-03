//
//  RXNetworkExcute.m
//  OverseaSocialApp
//
//  Created by 陈汉 on 2021/4/15.
//

#import "RX_CommonNetworkExcute.h"
#import "RXLoginManager.h"
#import "RXConfig.h"
#import "RX_CommonNetworkExcuteManager.h"
#import "RXErrorTool.h"
#import "RXLogService.h"
#import "RXLogManager.h"
#import "NSData+Encrypt.h"

static NSString * const RETURNCODE         = @"status";
static NSString * const RETURNCODETYPE1    = @"code";

static NSString * const RETURNMESSAGE      = @"returnMessage";
static NSString * const RETURNMESSAGEYPE1  = @"message";
static NSString * const RETURNMESSAGEYPE2  = @"msg";

static NSString * const SUCCESSCODE        = @"0";
static NSString * const STOEKNTIMEOUTCODE  = @"302001";

static NSString * const REQUESTFAILMSG = @"您的网络好像出了问题，请试试切换网络";

#define RETURNMESSAGEARRAY @[RETURNMESSAGE,RETURNMESSAGEYPE1,RETURNMESSAGEYPE2]
#define RETURNCODEARRAY @[RETURNCODE,RETURNCODETYPE1]

@interface RX_CommonNetworkExcute()
@property (nonatomic, strong) NSMutableDictionary * mRequestDic;
@end

@implementation RX_CommonNetworkExcute

- (void)dealloc
{
//    [_tManager.tasks makeObjects:@selector(cancel)];
}

+ (instancetype)shareInstance
{
    static dispatch_once_t onceToken;
    static RX_CommonNetworkExcute *client = nil;
    dispatch_once(&onceToken, ^{
        client = [[RX_CommonNetworkExcute alloc] init];
//        client.configure = configure;
    });
    return client;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
//        _tManager = [AFHTTPSessionManager manager];
//        _tManager.responseSerializer = [AFHTTPResponseSerializer serializer];
//        _tManager.requestSerializer.timeoutInterval = 12.0;
//        _mRequestDic = [[NSMutableDictionary alloc] init];
//        AFSecurityPolicy *securityPolicy = [AFSecurityPolicy defaultPolicy];
//        // 客户端是否信任非法证书
//        securityPolicy.allowInvalidCertificates = YES;
//        // 是否在证书域字段中验证域名
//        securityPolicy.validatesDomainName = NO;
//        _tManager.securityPolicy = securityPolicy;
    }
    return self;
}

- (void)setSubVersion:(NSString *)subVersion
{
    _subVersion = subVersion;
}

/**
 设置请求头
 @param configure 配置文件
 */
- (void)setConfigure:(RX_CommonRequestConfigure *)configure
{
    @try {
        if (configure) {
            _configure = configure;
        }
        
    } @catch (NSException *exception) {
        NSLog(@"%@", exception);
    } @finally {
        
    }
    
//    [_configure.mheadParams enumerateKeysAndObjectsUsingBlock:^(id  _Nonnull key, id  _Nonnull obj, BOOL * _Nonnull stop) {
////        [self.tManager.requestSerializer setValue:obj forHTTPHeaderField:key];
//    }];
}

- (void)setTimeBlock:(RequestTimeExpend)timeBlock
{
    @synchronized (self) {
        _timeBlock = [timeBlock copy];
    }
}

- (void)setHelloBlock:(RequestHelloTimeOut)helloBlock
{
    @synchronized (self) {
        _helloBlock = [helloBlock copy];
    }
}
- (void)setTokenBlock:(RequestTokenExpired)tokenBlock
{
    @synchronized (self) {
        _tokenBlock = [tokenBlock copy];
    }
}

/**
 * 开始网络请求
 * @param request 请求类
 */
- (void)beginRequest:(RX_CommonRequest *)request
{
    [self beginRequest:request success:nil failure:nil];
}

- (void)beginRequest:(RX_CommonRequest *)request
             success:(RequestSuccess)success
             failure:(RequestFailed)failure
{
//    RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
//    err.responesObject = @{@"msg" : @"connection to the server cannot be made",
//                           @"code" : @(-1)
//    };
//    failure ? failure(err) : nil;
    
    // ip 白名单
    if (![request.apiName isEqualToString:@"v1/sdkconfig/init"]) {
        BOOL canContinue = NO;
        if ([RXUserUtility sharedManager].isInit) {
            canContinue = YES;
        } else {
            if ([RXUserUtility sharedManager].isSetInit) {
                if ([request.apiName containsString:@"operationapi/legal"]) {
                    canContinue = YES;
                }
            }
        }
        
        // 内层白名单
        if (request.whiteList ||
            ([request.apiName isEqualToString:@"http://ifconfig.me/ip"] ||
            [request.apiName containsString:@"v1/vcapi/update_module_version"] ||
            [request.apiName containsString:@"v1/vcapi/update"])) {
            canContinue = YES;
        }
        
        if (!canContinue) {
            RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
            err.responesObject = @{@"msg" : [RXErrorTool getRXErrorMsg:RXInitError_init],
                                   @"code" : @(RXInitError_init)
            };
            
            if (err != nil) {
                err.responesObject = [RXCommonTool customErrorMsgReplaceThirdCodeOrMsgWithDic:err.responesObject];
            }
            
            failure ? failure(err) : nil;
            
            [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:request.headParams bodyDic:request.params action:rxlog_error_init url:[NSString stringWithFormat:@"%@%@", request.baseUrl, request.apiName] code:[err.responesObject[@"code"] integerValue] msg:err.responesObject[@"msg"] thirdType:@"" thirdcode:-123 thirdmsg:@"" traceid:@""];
            
            // 用户行为统计
            [[RXUserActionLogManager sharedSDK] addUserActionRequestWithHeader:request.headParams body:request.params url:[NSString stringWithFormat:@"%@%@", request.baseUrl, request.apiName] errorCode:[err.responesObject[@"code"] integerValue] errorMsg:err.responesObject[@"msg"] properties:nil];
            
            return;
        }
    }
    
    if (request.headParams && [NSString rx_isNullToString:self.subVersion].length > 0) {
        NSMutableDictionary *headMut = [NSMutableDictionary dictionaryWithDictionary:request.headParams];
        NSString *version = [NSString stringWithFormat:@"%@-%@", request.headParams[@"ruixue-version"], self.subVersion];
        [headMut setValue:version forKey:@"ruixue-version"];
        request.headParams = headMut;
        self.subVersion = @"";
    }
    
    NSString *baseUrl = request.baseUrl ? request.baseUrl : _configure.baseUrl;
    
    
    NSString *urlStr = [[NSURL URLWithString:[request.apiName stringByAddingPercentEncodingWithAllowedCharacters:[NSCharacterSet URLQueryAllowedCharacterSet]] relativeToURL:[NSURL URLWithString:baseUrl]] absoluteString];
    if (![request.apiName containsString:@"data/api/track"]) {
        NSLog(@"请求头:\n %@", request.headParams);
        NSLog(@"请求参数:\n %@", request.params);
        NSLog(@"请求地址:\n %@", urlStr);
    }
    
    NSURLSessionDataTask *task;
    request.startTime = [[NSDate date] timeIntervalSince1970]*1000;
    
    [[NSUserDefaults standardUserDefaults] setBool:YES forKey:[NSString stringWithFormat:@"isRequesting_%@", urlStr]];
    
    NSString *requestType = @"POST";
    id params;
    switch (request.requestMethod) {
        case RequestMethod_Get:
            requestType = @"GET";
            [RXUserUtility sharedManager].isGZip = NO;
            break;
        case RequestMethod_Post:
        {
            requestType = @"POST";
            if (request.isGzip) {
                params = request.gzipParam;
                [RXUserUtility sharedManager].isGZip = YES;
            } else {
                [RXUserUtility sharedManager].isGZip = NO;
                if (request.params) {
                    params = request.params;
                }
            }
        }
            break;
        case RequestMethod_Put:
            requestType = @"PUT";
            params = request.params;
            break;
        case RequestMethod_Delete:
            requestType = @"DELETE";
            params = request.params;
            break;
        default:
            [RXUserUtility sharedManager].isGZip = NO;
            break;
    }
    
    [RX_CommonRequest rx_requestWithUrl:urlStr parameters:params headers:request.headParams requestType:requestType SuccessBlock:^(NSURLSessionDataTask * _Nonnull task, id _Nullable responseObject, NSURLResponse * _Nullable urlResponse) {
        [self onRespondSuccessWithRequest:request task:task andData:responseObject urlResponse:urlResponse success:success failure:failure];
    } ErrorBlock:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
        NSLog(@"网络请求失败 ----->>>\n%@", error);
        [self failWithError:error retObj:nil request:request success:success failure:failure];
    }];
}

- (void)beginUploadRequest:(RX_CommonRequest *)request
                   process:(void(^)(float process))process
                   success:(RequestSuccess)success
                   failure:(RequestFailed)failure
{
    // ip 白名单
    if (![request.apiName isEqualToString:@"v1/sdkconfig/init"]) {
        BOOL canContinue = NO;
        if ([RXUserUtility sharedManager].isInit) {
            canContinue = YES;
        } else {
            if ([RXUserUtility sharedManager].isSetInit) {
                if ([request.apiName containsString:@"operationapi/legal"]) {
                    canContinue = YES;
                }
            }
        }
        
        // 内层白名单
        if (request.whiteList ||
            ([request.apiName isEqualToString:@"http://ifconfig.me/ip"] ||
            [request.apiName containsString:@"v1/vcapi/update_module_version"] ||
            [request.apiName containsString:@"v1/vcapi/update"])) {
            canContinue = YES;
        }
        
        if (!canContinue) {
            RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
            err.responesObject = @{@"msg" : [RXErrorTool getRXErrorMsg:RXInitError_init],
                                   @"code" : @(RXInitError_init)
            };
            
            if (err != nil) {
                err.responesObject = [RXCommonTool customErrorMsgReplaceThirdCodeOrMsgWithDic:err.responesObject];
            }
            
            failure ? failure(err) : nil;
            
            [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:request.headParams bodyDic:request.params action:rxlog_error_init url:[NSString stringWithFormat:@"%@%@", request.baseUrl, request.apiName] code:[err.responesObject[@"code"] integerValue] msg:err.responesObject[@"msg"] thirdType:@"" thirdcode:-123 thirdmsg:@"" traceid:@""];
            
            // 用户行为统计
            [[RXUserActionLogManager sharedSDK] addUserActionRequestWithHeader:request.headParams body:request.params url:[NSString stringWithFormat:@"%@%@", request.baseUrl, request.apiName] errorCode:[err.responesObject[@"code"] integerValue] errorMsg:err.responesObject[@"msg"] properties:nil];
            
            return;
        }
    }
    
    if (request.headParams && [NSString rx_isNullToString:self.subVersion].length > 0) {
        NSMutableDictionary *headMut = [NSMutableDictionary dictionaryWithDictionary:request.headParams];
        NSString *version = [NSString stringWithFormat:@"%@-%@", request.headParams[@"ruixue-version"], self.subVersion];
        [headMut setValue:version forKey:@"ruixue-version"];
        request.headParams = headMut;
        self.subVersion = @"";
    }
    
    NSString *baseUrl = request.baseUrl ? request.baseUrl : _configure.baseUrl;
    
    NSString *urlStr = [[NSURL URLWithString:[request.apiName stringByAddingPercentEncodingWithAllowedCharacters:[NSCharacterSet URLQueryAllowedCharacterSet]] relativeToURL:[NSURL URLWithString:baseUrl]] absoluteString];
    if (![request.apiName containsString:@"data/api/track"]) {
        NSLog(@"请求头:\n %@", request.headParams);
        NSLog(@"请求参数:\n %@", request.params);
        NSLog(@"请求地址:\n %@", urlStr);
    }
    
    request.startTime = [[NSDate date] timeIntervalSince1970]*1000;
    
    [[NSUserDefaults standardUserDefaults] setBool:YES forKey:[NSString stringWithFormat:@"isRequesting_%@", urlStr]];
    
    NSString *requestType = @"POST";
    id params;
    switch (request.requestMethod) {
        case RequestMethod_Get:
            requestType = @"GET";
            [RXUserUtility sharedManager].isGZip = NO;
            break;
        case RequestMethod_Post:
        {
            requestType = @"POST";
            if (request.isGzip) {
                params = request.gzipParam;
                [RXUserUtility sharedManager].isGZip = YES;
            } else {
                [RXUserUtility sharedManager].isGZip = NO;
                if (request.params) {
                    params = request.params;
                }
            }
        }
            break;
        case RequestMethod_Put:
            requestType = @"PUT";
            params = request.params;
            break;
        case RequestMethod_Delete:
            requestType = @"DELETE";
            params = request.params;
            break;
        default:
            [RXUserUtility sharedManager].isGZip = NO;
            break;
    }
    
    [RX_CommonRequest rx_uploadRequestWithUrl:urlStr parameters:params headers:request.headParams requestType:requestType processBlock:process SuccessBlock:^(NSURLSessionDataTask * _Nonnull task, id _Nullable responseObject) {
        [self onRespondSuccessWithRequest:request task:task andData:responseObject urlResponse:nil success:success failure:failure];
    } ErrorBlock:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
        NSLog(@"网络请求失败 ----->>>\n%@", error);
        [self failWithError:error retObj:nil request:request success:success failure:failure];
    }];
}


- (void)beginRequestWithArray:(NSArray<RX_CommonRequest *> *)array
{
    for (int i = 0; i < array.count; i++) {
        RX_CommonRequest *request = array[i];
        [self beginRequest:request];
    }
}

#pragma mark - <网络请求返回数据处理>
//网络请求成功返回
- (void)onRespondSuccessWithRequest:(RX_CommonRequest *)request task:(NSURLSessionDataTask *)task andData:(id)responseObject urlResponse:(NSURLResponse * _Nullable)urlResponse success:(RequestSuccess)success failure:(RequestFailed)failure
{
    // 获取 ip 没有数据结构，单独构造
    if ([request.apiName isEqualToString:rx_publicUrl]) {
        NSString *publicIP = [[NSString alloc] initWithData:responseObject encoding:NSUTF8StringEncoding];
        
        NSMutableDictionary *resultMutableDic = [NSMutableDictionary dictionary];
        [resultMutableDic setValue:publicIP forKey:@"publicIP"];
        success ? success(resultMutableDic) : nil;
        return;
    }
    
    NSError *error = nil;
    NSDictionary *resultDictionary = [NSJSONSerialization JSONObjectWithData:responseObject options:kNilOptions error:&error];
    
    [[NSUserDefaults standardUserDefaults] setBool:NO forKey:[NSString stringWithFormat:@"isRequesting_%@%@", request.baseUrl, request.apiName]];
    if (resultDictionary) {
        if ([resultDictionary isKindOfClass:[NSDictionary class]]) {
            NSMutableDictionary *resultMutableDic = [NSMutableDictionary dictionaryWithDictionary:resultDictionary];
            NSString *tracelid = request.headParams[@"ruixue-traceid"];
            [resultMutableDic setValue:tracelid forKey:@"trace_id"];
            NSString *returnCode = [self tranformReturnCode:resultDictionary];
            NSString *returnMessage = [self transformReturnMessage:resultDictionary];
            
            if ([NSString rx_isNullToString:returnCode].length <= 0) {
                returnCode = @"0";
            }
            
            // 是否需要解密
            BOOL needDecrypt = NO;
            if (urlResponse && [urlResponse isKindOfClass:[NSHTTPURLResponse class]]) {
                NSHTTPURLResponse *httpResponse = (NSHTTPURLResponse *)urlResponse;
                NSDictionary *headers = httpResponse.allHeaderFields; // 获取响应头信息
                
                if ([headers isKindOfClass:[NSDictionary class]] && headers.allKeys.count > 0) {
                    if ([headers[@"ruixue-encipher"] isEqualToString:@"1"]) {
                        needDecrypt = YES;
                    }
                }
            }
            if (needDecrypt) {
                if ([resultDictionary valueForKey:@"data"] && [[resultDictionary valueForKey:@"data"] isKindOfClass:[NSString class]]) {
                    NSString *bodyStr = [resultDictionary valueForKey:@"data"];
                    // 有 data 解密
                    if ([NSString rx_isNullToString:bodyStr].length > 0) {
                        NSString *decryptDataStr = [NSData AES256CBCDecryptWithString:bodyStr];
                        
                        // 解密成功替换原有 data
                        if ([NSString rx_isNullToString:decryptDataStr].length > 0) {
                            NSString *dataType = [self dataTypeWithJsonString:decryptDataStr];
                            if ([dataType isEqualToString:@"dic"]) {
                                NSDictionary *decryptDataDic = [RXCommonTool stringToDictionary:decryptDataStr];
                                [resultMutableDic setValue:decryptDataDic forKey:@"data"];
                            } else if ([dataType isEqualToString:@"arr"]) {
                                NSArray *decryptDataArr = [RXCommonTool stringToArray:decryptDataStr];
                                [resultMutableDic setValue:decryptDataArr forKey:@"data"];
                            } else if ([dataType isEqualToString:@"jsonString"]) {
                                decryptDataStr = [self reduceJsonEscapeCharacters:decryptDataStr];
                                [resultMutableDic setValue:decryptDataStr forKey:@"data"];
                            }
                        } else {
                            // 上报事件
                            NSMutableDictionary *properties = [NSMutableDictionary dictionary];
                            [properties setValue:[NSData getCBCKey] forKey:@"key"];
                            [properties setValue:bodyStr forKey:@"request_response"];
                            [[RXLogManager sharedSDK] trackErrorPrivateMsgWithRequestHeader:request.headParams bodyDic:request.params action:@"decrypt" url:request.apiName code:0 msg:@"" thirdType:@"" thirdcode:0 thirdmsg:@"" traceid:@"" properties:properties];
                            
                            // 解密失败不加密重新请求
                            NSMutableDictionary *requestHeader = [NSMutableDictionary dictionaryWithDictionary:request.headParams];
                            [requestHeader setValue:@"application/json" forKey:@"Content-Type"];
                            [requestHeader setValue:@"0" forKey:@"ruixue-encipher"];
                            request.headParams = requestHeader;
                            [self beginRequest:request success:success failure:failure];
                            
                            return;
                        }
                    }
                }
            }
            
            if ([request.apiName containsString:@"getip"] || (returnCode && [returnCode isEqualToString:SUCCESSCODE])) {
                [self.delegate requestInterfaceExcuteSuccess:resultMutableDic apiName:request.apiName apiFlag:request.apiFlag];
                success ? success(resultMutableDic) : nil;
                
                // 用户行为统计
                [[RXUserActionLogManager sharedSDK] addUserActionRequestWithHeader:request.headParams body:request.params url:[NSString stringWithFormat:@"%@%@", request.baseUrl, request.apiName] errorCode:[returnCode integerValue] errorMsg:@"" properties:nil];
            } else {
                NSDictionary *userInfo = [NSDictionary dictionaryWithObject:returnMessage forKey:NSLocalizedDescriptionKey];
                NSError *error = [NSError errorWithDomain:@"errormessage"
                                                     code:[returnCode integerValue]
                                                 userInfo:userInfo];
                [self failWithError:error retObj:resultDictionary request:request success:success failure:failure];
            }
        }
    } else {
        //        NSString *ddd = [[NSString alloc] initWithData:responseObject encoding:NSUTF8StringEncoding];
        //        NSLog(@"json解析失败:\n %@", ddd);
        
        if (request.requestMethod == RequestMethod_Put) {
            NSLog(@"解析失败:\n %@", error);
        }
        
        NSDictionary *userInfo = [NSDictionary dictionaryWithObject:[RXCommonTool osLaunguage:REQUESTFAILMSG] forKey:NSLocalizedDescriptionKey];
        NSHTTPURLResponse *responses = (NSHTTPURLResponse *)task.response;
        NSError *error = [NSError errorWithDomain:@"errormessage"
                                             code:responses.statusCode
                                         userInfo:userInfo];
        [self failWithError:error retObj:resultDictionary request:request success:success failure:failure];
    }
    //返回api耗时统计
    NSTimeInterval endTime = [[NSDate date] timeIntervalSince1970] * 1000;
    if (self.timeBlock && request.startTime > 0) {
        self.timeBlock(endTime - request.startTime, request.apiName);
    }
}

#pragma mark - <错误处理，Hello超时，Token过期，网络错误>
- (void)failWithError:(NSError *)error retObj:(id)retObj request:(RX_CommonRequest *)request success:(RequestSuccess)success failure:(RequestFailed)failure
{
    [[NSUserDefaults standardUserDefaults] setBool:NO forKey:[NSString stringWithFormat:@"isRequesting_%@%@", request.baseUrl, request.apiName]];
    // token 失效刷新 token
    if (error.code == [STOEKNTIMEOUTCODE integerValue] && self.tokenBlock) {
        //        self.tokenBlock();
//        NSLock *cpuUsageLock = [[NSLock alloc] init];
//        [cpuUsageLock lock];
        
        [RXLoginManager refreshTokenWithComplete:^(NSDictionary *response, RX_CommonRequestError *error) {
//            [cpuUsageLock unlock];
            if (!error) {
                request.headParams = [RX_CommonNetworkExcuteManager headParams];
                //                [self beginRequest:request success:success failure:failure];
            } else {
                failure ? failure(error) : nil;
            }
        }];
        
        return;
    }
    /**
     * 网络异常导致请求失败时更换域名重新请求
     */
    else if (!retObj) {
        if (request.needRetry) {
            //        request.failedTimes++;
            [RXUserUtility sharedManager].requestFailCount++;
            [RXUserUtility sharedManager].baseUrlCount++;
            
            // 轮询一次不再调用
            if ([RXUserUtility sharedManager].requestFailCount > [RXUserUtility sharedManager].baseUrlList.count - 1) {
                [RXUserUtility sharedManager].requestFailCount = 0;
                RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
                err.error = error;
                
                NSInteger errorCode = [RXErrorTool getNetworkError:error.code];
                NSString *errorMsg = error.localizedDescription ? error.localizedDescription : @"Undefind";
                NSString *customMsg = [RXErrorTool getCustomRXErrorMsg:errorCode withNetWorkErrorMsg:error.localizedDescription];
                if ([NSString rx_isNullToString:customMsg].length == 0) {
                    customMsg = errorMsg;
                }
                err.responesObject = @{@"msg" : customMsg,
                                       @"systemMsg" : errorMsg,
                                       @"code" : @(errorCode)
                };
                
                if (err != nil) {
                    err.responesObject = [RXCommonTool customErrorMsgReplaceThirdCodeOrMsgWithDic:err.responesObject];
                }
                
                failure ? failure(err) : nil;
                
                if (![request.apiName containsString:@"v1/data/api/track"]) {
                    if ([request.apiName isEqualToString:rx_publicUrl]) {
                        NSMutableDictionary *properties = [NSMutableDictionary dictionary];
                        [properties setValue:@(error.code) forKey:@"code"];
                        [properties setValue:error.localizedDescription forKey:@"msg"];
                        [properties setValue:[NSString stringWithFormat:@"%@%@", request.baseUrl, request.apiName] forKey:@"url"];
                        
                        [[RXLogService sharedSDK] addLogWithEvent:rxlog_networkError distinctId:@"" properties:properties];
                        return;
                    }
                    [RXCommonTool getPublicIPWithComplete:^(NSString *publicIP) {
                        // 错误收集
                        NSMutableDictionary *properties = [NSMutableDictionary dictionary];
                        if ([NSString rx_isNullToString:publicIP].length > 0) {
                            [properties setValue:publicIP forKey:@"ip"];
                        }
                        [properties setValue:@(error.code) forKey:@"code"];
                        [properties setValue:error.localizedDescription forKey:@"msg"];
                        [properties setValue:[NSString stringWithFormat:@"%@%@", request.baseUrl, request.apiName] forKey:@"url"];
                        
                        [[RXLogService sharedSDK] addLogWithEvent:rxlog_networkError distinctId:@"" properties:properties];
                    }];
                    
                    // 用户行为统计
                    [[RXUserActionLogManager sharedSDK] addUserActionRequestWithHeader:request.headParams body:request.params url:[NSString stringWithFormat:@"%@%@", request.baseUrl, request.apiName] errorCode:error.code errorMsg:error.localizedDescription properties:nil];
                }
                
                return;
            }
            request.baseUrl = [RXConfig sharedManager].apiDomain;
            [self beginRequest:request success:success failure:failure];
            
            if (![request.apiName containsString:@"v1/data/api/track"]) {
                if ([request.apiName isEqualToString:rx_publicUrl]) {
                    NSMutableDictionary *properties = [NSMutableDictionary dictionary];
                    [properties setValue:@(error.code) forKey:@"code"];
                    [properties setValue:error.localizedDescription forKey:@"msg"];
                    [properties setValue:[NSString stringWithFormat:@"%@%@", request.baseUrl, request.apiName] forKey:@"url"];
                    
                    [[RXLogService sharedSDK] addLogWithEvent:rxlog_networkError distinctId:@"" properties:properties];
                    return;
                }
                [RXCommonTool getPublicIPWithComplete:^(NSString *publicIP) {
                    // 错误收集
                    NSMutableDictionary *properties = [NSMutableDictionary dictionary];
                    if ([NSString rx_isNullToString:publicIP].length > 0) {
                        [properties setValue:publicIP forKey:@"ip"];
                    }
                    [properties setValue:@(error.code) forKey:@"code"];
                    [properties setValue:error.localizedDescription forKey:@"msg"];
                    [properties setValue:[NSString stringWithFormat:@"%@%@", request.baseUrl, request.apiName] forKey:@"url"];
                    
                    [[RXLogService sharedSDK] addLogWithEvent:rxlog_networkError distinctId:@"" properties:properties];
                }];
                
                // 用户行为统计
                [[RXUserActionLogManager sharedSDK] addUserActionRequestWithHeader:request.headParams body:request.params url:[NSString stringWithFormat:@"%@%@", request.baseUrl, request.apiName] errorCode:error.code errorMsg:error.localizedDescription properties:nil];
            }
            
            return;
        }
    }
    // 普通错误回调
    if ([retObj isKindOfClass:[NSDictionary class]]) {
        NSMutableDictionary *resultMutableDic = [NSMutableDictionary dictionaryWithDictionary:retObj];
        NSString *tracelid = request.headParams[@"ruixue-traceid"];
        [resultMutableDic setValue:tracelid forKey:@"trace_id"];
        retObj = resultMutableDic;
        
        NSInteger errorCode = [[resultMutableDic valueForKey:@"code"] integerValue];
        // 解密失败不加密重试
        if (errorCode == 302015 || errorCode == 302016) {
            NSMutableDictionary *requestHeader = [NSMutableDictionary dictionaryWithDictionary:request.headParams];
            [requestHeader setValue:@"application/json" forKey:@"Content-Type"];
            [requestHeader setValue:@"0" forKey:@"ruixue-encipher"];
            request.headParams = requestHeader;
            [self beginRequest:request success:success failure:failure];
            return;
        }
    }
    
    [self.delegate requestInterfaceExcuteError:error apiName:request.apiName apiFlag:request.apiFlag retObj:retObj];
    
    [self.delegate requestInterfaceExcuteError:error apiName:request.apiName apiFlag:request.apiFlag];
    
    RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
    err.error = error;
    err.responesObject = retObj;
    failure ? failure(err) : nil;
    
    // 用户行为统计
    [[RXUserActionLogManager sharedSDK] addUserActionRequestWithHeader:request.headParams body:request.params url:[NSString stringWithFormat:@"%@%@", request.baseUrl, request.apiName] errorCode:[retObj[@"code"] integerValue] errorMsg:retObj[@"msg"] properties:nil];
}

#pragma mark - <returnCode returnMessage兼容编码>
- (NSString *)transformReturnMessage:(NSDictionary *)retObj
{
    NSString *returnMessage = @"";
    for (NSString *message in RETURNMESSAGEARRAY) {
        if (retObj[message]) {
            returnMessage = retObj[message];
            break;
        }
    }
    return returnMessage;
}

- (NSString *)tranformReturnCode:(NSDictionary *)retObj
{
    NSString *returnCode = @"0000";
    for (NSString *code in RETURNCODEARRAY) {
        if (retObj[code]) {
            returnCode = [NSString stringWithFormat:@"%@", retObj[code]];
            break;
        }
    }
    return returnCode;
}

#pragma mark -- <functions>
- (NSString *)dataTypeWithJsonString:(NSString *)jsonString
{
    NSString *type = @"";
    NSString *dataType = @"";
    
    if ([NSString rx_isNullToString:jsonString].length > 0) {
        dataType = [jsonString substringToIndex:1];
        
        if ([dataType isEqualToString:@"{"]) {
            type = @"dic";
        } else if ([dataType isEqualToString:@"["]) {
            type = @"arr";
        } else if ([dataType isEqualToString:@"\""]) {
            type = @"jsonString";
        }
    }
    
    return type;
}

- (NSString *)reduceJsonEscapeCharacters:(NSString *)jsonString
{
    // 使用正则表达式替换多层转义符为单层
    NSString *pattern = @"(\\\\)+";
    NSRegularExpression *regex = [NSRegularExpression regularExpressionWithPattern:pattern options:0 error:nil];
    NSString *reducedString = [regex stringByReplacingMatchesInString:jsonString options:0 range:NSMakeRange(0, jsonString.length) withTemplate:@"\\"]; // 保留一层转义符
    
    if ([reducedString hasPrefix:@"\""] && [reducedString hasSuffix:@"\""]) {
        return [reducedString substringWithRange:NSMakeRange(1, reducedString.length - 2)]; // 去除前后引号
    }
    
    return reducedString;
}

@end
