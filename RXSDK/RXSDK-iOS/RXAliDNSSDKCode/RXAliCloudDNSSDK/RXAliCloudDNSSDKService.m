//
//  RXAliCloudDNSSDKService.m
//  RXAliCloudDNSSDK
//
//  Created by root11 on 2024/8/6.
//

#import "RXAliCloudDNSSDKService.h"
#import <AlicloudHttpDNS/AlicloudHttpDNS.h>
#import "HttpDnsNSURLProtocolImpl.h"
#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXSDK_Pure/RXNotificationCenter.h>
#import <RXSDK_Pure/RXSubPackage.h>

@interface RXAliCloudDNSSDKService ()<NSURLSessionTaskDelegate, NSURLSessionDataDelegate>

@property (nonatomic, assign) int accountID;
@property (nonatomic, copy) NSString *secretKey;
@property (nonatomic, strong) NSMutableURLRequest *currentRequest;
@property (nonatomic, strong) NSString *dnsRegion;

@end

@implementation RXAliCloudDNSSDKService

static RXAliCloudDNSSDKService *sharedSDK = nil;

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

+ (instancetype)sharedSDK {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedSDK = [[self alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init {
    self = [super init];
    if (self) {
        [RXSubPackage sharedSDK].aAliDNS = YES;
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(aliDNS:) name:rxUserDefault_aliDNS object:nil];
    }
    return self;
}

+ (instancetype)allocWithZone:(struct _NSZone *)zone {
    static dispatch_once_t once_Token;
    dispatch_once(&once_Token, ^{
        sharedSDK = [super allocWithZone:zone];
    });
    return sharedSDK;
}

- (id)copyWithZone:(NSZone *)zone {
    return sharedSDK;
}

- (id)mutableCopyWithZone:(NSZone *)zone {
    return sharedSDK;
}

- (void)aliDNS:(NSNotification *)noti
{
    DNSRequestSuccessBlock successBlock = (DNSRequestSuccessBlock)noti.userInfo[@"sucBlock"];
    DNSRequestFailBlock failBlock = (DNSRequestFailBlock)noti.userInfo[@"failBlock"];
    @try {
        NSMutableURLRequest *request = (NSMutableURLRequest *)noti.userInfo[@"request"];
        [self httpDNSQueryWithRequest:request SuccessBlock:successBlock ErrorBlock:failBlock];
    } @catch (NSException *exception) {
        NSLog(@"RXSDK -- error -- alidns:%@", exception);
        NSDictionary *userInfo = [NSDictionary dictionaryWithObject:@"reslove ip failed" forKey:NSLocalizedDescriptionKey];
        NSError *error = [NSError errorWithDomain:@"errormessage"
                                             code:1120
                                         userInfo:userInfo];
        failBlock(nil, error);
    } @finally {
        
    }

}

- (void)setRegion:(NSString *)region
{
    self.dnsRegion = region;
}

- (void)initWithAccountID:(int)accountID secretKey:(NSString *)secretKey debug:(BOOL)debug{
    self.accountID = accountID;
    self.secretKey = secretKey;
    HttpDnsService *httpdns = [[HttpDnsService alloc] initWithAccountID:self.accountID secretKey:self.secretKey];
    
    // 打开HTTPDNS Log，调试排查问题时使用，线上建议关闭
    [httpdns setLogEnabled:debug];
    
    // 设置HTTPDNS域名解析请求类型(HTTP/HTTPS)，若不调用该接口，默认为HTTP请求；
    // SDK内部HTTP请求基于CFNetwork实现，不受ATS限制。
    // 设置httpdns域名解析网络请求是否需要走HTTPS方式
    [httpdns setHTTPSRequestEnabled:YES];
    
    // 设置开启持久化缓存，使得APP启动后可以复用上次活跃时缓存在本地的IP，提高启动后获取域名解析结果的速度
    [httpdns setPersistentCacheIPEnabled:YES];
    
    // 允许返回过期的IP
    [httpdns setReuseExpiredIPEnabled:YES];
    
    // 设置底层HTTPDNS网络请求超时时间，单位为秒
    [httpdns setTimeoutInterval:2];
    
    // 设置是否支持IPv6地址解析，只有开启这个开关，解析接口才有能力解析域名的IPv6地址并返回
    [httpdns setIPv6Enabled:YES];
    
    // 设置region节点
    if (self.dnsRegion.length > 0) {
        [httpdns setRegion:self.dnsRegion];
    }
}

- (void)httpDNSQueryWithRequest:(NSMutableURLRequest *)originalRequest
                   SuccessBlock:(nullable void (^)(NSURLSessionDataTask * _Nonnull, id _Nullable))successBlock
                     ErrorBlock:(void (^)(NSURLSessionDataTask * _Nullable, NSError * _Nonnull))errorBlock{
    self.currentRequest = [[NSMutableURLRequest alloc] initWithURL:originalRequest.URL];
    NSMutableURLRequest *request = originalRequest;
    
    NSString *resolvedIpAddress = [self resolveAvailableIp:request.URL.host];
    if (resolvedIpAddress) {// 通过HTTPDNS获取IP成功，进行URL替换和HOST头设置
        NSString *originalUrlStr = request.URL.absoluteString;
        NSString *requestUrlStr = [originalUrlStr stringByReplacingOccurrencesOfString:request.URL.host withString:resolvedIpAddress];
        request.URL = [NSURL URLWithString:requestUrlStr];
        
    } else {//解析失败,不降级直接返回block
        NSDictionary *userInfo = [NSDictionary dictionaryWithObject:@"reslove ip failed" forKey:NSLocalizedDescriptionKey];
        NSError *error = [NSError errorWithDomain:@"errormessage"
                                             code:1120
                                         userInfo:userInfo];
        errorBlock(nil, error);
        return;
    }
    [request setValue:self.currentRequest.URL.host forHTTPHeaderField:@"host"];
    
    NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration defaultSessionConfiguration];
    if ([request.URL.absoluteString hasPrefix:@"https:"]) {
        // 为了处理SNI问题，这里替换了NSURLProtocol的实现
        NSMutableArray *protocolsArray = [NSMutableArray arrayWithArray:configuration.protocolClasses];
        [protocolsArray insertObject:[HttpDnsNSURLProtocolImpl class] atIndex:0];
        [configuration setProtocolClasses:protocolsArray];
    }
    NSURLSession *session = [NSURLSession sessionWithConfiguration:configuration delegate:nil delegateQueue:nil];
    __block NSURLSessionDataTask *task = [session dataTaskWithRequest:request completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error){
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error == nil){
                successBlock(task, data);
            }else{
                errorBlock(task, error);
            }
        });
        
    }];
    [task resume];
}

- (NSString *)resolveAvailableIp:(NSString *)host{
    HttpDnsService *httpDnsService = [HttpDnsService sharedInstance];
    HttpdnsResult *result = [httpDnsService resolveHostSyncNonBlocking:host byIpType:HttpdnsQueryIPTypeBoth];

    if (!result) {
        return nil;
    }

    if (result.hasIpv6Address) {
        return [NSString stringWithFormat:@"[%@]", result.firstIpv6Address];
    } else if (result.hasIpv4Address) {
        return result.firstIpv4Address;
    } else {
        return nil;
    }
}

/* https+非SNI场景使用，需先指定代理，再放开此处屏蔽
- (BOOL)evaluateServerTrust:(SecTrustRef)serverTrust
                  forDomain:(NSString *)domain {
    // 创建证书校验策略
    NSMutableArray *policies = [NSMutableArray array];
    if (domain) {
        [policies addObject:(__bridge_transfer id) SecPolicyCreateSSL(true, (__bridge CFStringRef) domain)];
    } else {
        [policies addObject:(__bridge_transfer id) SecPolicyCreateBasicX509()];
    }

    // 绑定校验策略到服务端的证书上
    SecTrustSetPolicies(serverTrust, (__bridge CFArrayRef) policies);
    // 评估当前serverTrust是否可信任，官方建议在result = kSecTrustResultUnspecified 或 kSecTrustResultProceed的情况下serverTrust可以被验证通过，https://developer.apple.com/library/ios/technotes/tn2232/_index.html
    // 关于SecTrustResultType的详细信息请参考SecTrust.h
    SecTrustResultType result;
    SecTrustEvaluate(serverTrust, &result);
    return (result == kSecTrustResultUnspecified || result == kSecTrustResultProceed);
}

#pragma mark - NSURLSessionTaskDelegate
- (void)URLSession:(NSURLSession *)session task:(NSURLSessionTask *)task didReceiveChallenge:(NSURLAuthenticationChallenge *)challenge completionHandler:(void (^)(NSURLSessionAuthChallengeDisposition, NSURLCredential *_Nullable))completionHandler {
    if (!challenge) {
        return;
    }

    NSURLSessionAuthChallengeDisposition disposition = NSURLSessionAuthChallengePerformDefaultHandling;
    NSURLCredential *credential = nil;

    // 获取原始域名信息
    NSString *host = [[self.currentRequest allHTTPHeaderFields] objectForKey:@"host"];
    if (!host) {
        host = self.currentRequest.URL.host;
    }

    if ([challenge.protectionSpace.authenticationMethod isEqualToString:NSURLAuthenticationMethodServerTrust]) {
        if ([self evaluateServerTrust:challenge.protectionSpace.serverTrust forDomain:host]) {
            disposition = NSURLSessionAuthChallengeUseCredential;
            credential = [NSURLCredential credentialForTrust:challenge.protectionSpace.serverTrust];
        } else {
            disposition = NSURLSessionAuthChallengePerformDefaultHandling;
        }
    } else {
        disposition = NSURLSessionAuthChallengePerformDefaultHandling;
    }

    // 对于其他的challenges直接使用默认的验证方案
    completionHandler(disposition, credential);
}
*/

@end
