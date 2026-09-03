//
//  RXTecentCloudDNSSDKService.m
//  RXTecentCloudDNSSDK
//
//  Created by root11 on 2024/8/8.
//

#import "RXTecentCloudDNSSDKService.h"
#import <UIKit/UIKit.h>
#import <MSDKDns_C11/MSDKDns.h>
#import <MSDKDns_C11/MSDKDnsHttpMessageTools.h>
#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXSDK_Pure/RXNotificationCenter.h>
#import <RXSDK_Pure/RXSubPackage.h>

@interface RXTecentCloudDNSSDKService ()<NSURLSessionDelegate>

@property (nonatomic, strong) NSMutableURLRequest *currentRequest;

@end

@implementation RXTecentCloudDNSSDKService

static RXTecentCloudDNSSDKService *sharedSDK = nil;

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
        [RXSubPackage sharedSDK].aTencentDNS = YES;
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(tencentDNS:) name:rxUserDefault_tencentDNS object:nil];
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

- (void)tencentDNS:(NSNotification *)noti
{
    DNSRequestSuccessBlock successBlock = (DNSRequestSuccessBlock)noti.userInfo[@"sucBlock"];
    DNSRequestFailBlock failBlock = (DNSRequestFailBlock)noti.userInfo[@"failBlock"];
    @try {
        NSMutableURLRequest *request = (NSMutableURLRequest *)noti.userInfo[@"request"];
        [self httpDNSQueryWithRequest:request SuccessBlock:successBlock ErrorBlock:failBlock];
    } @catch (NSException *exception) {
        NSLog(@"RXSDK -- error -- tencentdns:%@", exception);
        NSDictionary *userInfo = [NSDictionary dictionaryWithObject:@"reslove ip failed" forKey:NSLocalizedDescriptionKey];
        NSError *error = [NSError errorWithDomain:@"errormessage"
                                             code:1120
                                         userInfo:userInfo];
        failBlock(nil, error);
    } @finally {
        
    }
}

- (void)initWithAppID:(NSString *)appID dnsID:(int)dnsID dnsKey:(NSString *)dnsKey debug:(BOOL)debug{
    DnsConfig config = {
        .appId = appID,
        .dnsId = dnsID,
        .dnsKey = dnsKey,
        .encryptType = HttpDnsEncryptTypeDES,
        .debug = debug,
    };
    [[MSDKDns sharedInstance] initConfig:&config];
}

- (void)httpDNSQueryWithRequest:(NSMutableURLRequest *)originalRequest
                   SuccessBlock:(nullable void (^)(NSURLSessionDataTask * _Nonnull, id _Nullable))successBlock
                     ErrorBlock:(void (^)(NSURLSessionDataTask * _Nullable, NSError * _Nonnull))errorBlock{
    self.currentRequest = [[NSMutableURLRequest alloc] initWithURL:originalRequest.URL];
    NSMutableURLRequest *request = originalRequest;
    NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration defaultSessionConfiguration];
    
    if ([request.URL.absoluteString hasPrefix:@"http:"]) {//http场景
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
        
    }else{//https中的SNI场景
        // 注册拦截请求的NSURLProtocol
        [NSURLProtocol registerClass:[MSDKDnsHttpMessageTools class]];
        NSArray *protocolArray = @[[MSDKDnsHttpMessageTools class]];
        configuration.protocolClasses = protocolArray;
    }
    
    NSURLSession *session = [NSURLSession sessionWithConfiguration:configuration delegate:nil delegateQueue:nil];
    __block NSURLSessionDataTask *task = [session dataTaskWithRequest:request completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error){
        dispatch_async(dispatch_get_main_queue(), ^{
            // 取消注册CFHttpMessageURLProtocol，避免拦截其他场景的请求
            [NSURLProtocol unregisterClass:[MSDKDnsHttpMessageTools class]];
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
    NSArray *ipsArray = [[MSDKDns sharedInstance] WGGetHostByName:host];
    if (ipsArray && ipsArray.count > 1) {
        NSString *ipv4 = ipsArray[0];
        NSString *ipv6 = ipsArray[1];
        if (![ipv6 isEqualToString:@"0"]) {
            return [NSString stringWithFormat:@"[%@]", ipv6];
        } else if (![ipv4 isEqualToString:@"0"]){
            return ipv4;
        } else {//异常情况返回为0,0，建议重试一次
            return nil;
        }
    }else{
        return nil;
    }
}
/* https+非SNI场景使用，需先指定代理，再放开此处屏蔽
- (BOOL)evaluateServerTrust:(SecTrustRef)serverTrust forDomain:(NSString *)domain {
    //创建证书校验策略
    NSMutableArray *policies = [NSMutableArray array];
    if (domain) {
        [policies addObject:(__bridge_transfer id)SecPolicyCreateSSL(true, (__bridge CFStringRef)domain)];
    } else {
        [policies addObject:(__bridge_transfer id)SecPolicyCreateBasicX509()];
    }

    //绑定校验策略到服务端的证书上
    SecTrustSetPolicies(serverTrust, (__bridge CFArrayRef)policies);
    //评估当前 serverTrust 是否可信任，
    //官方建议在 result = kSecTrustResultUnspecified 或 kSecTrustResultProceed 的情况下 serverTrust 可以被验证通过，
    //https://developer.apple.com/library/ios/technotes/tn2232/_index.html
    //关于SecTrustResultType的详细信息请参考SecTrust.h
    SecTrustResultType result;
    SecTrustEvaluate(serverTrust, &result);
    return (result == kSecTrustResultUnspecified || result == kSecTrustResultProceed);
}

- (void)URLSession:(NSURLSession *)session task:(NSURLSessionTask *)task didReceiveChallenge:(NSURLAuthenticationChallenge *)challenge completionHandler:(void (^)(NSURLSessionAuthChallengeDisposition disposition, NSURLCredential * __nullable credential))completionHandler {
    if (!challenge) {
        return;
    }

    NSURLSessionAuthChallengeDisposition disposition = NSURLSessionAuthChallengePerformDefaultHandling;
    NSURLCredential *credential = nil;

    //获取原始域名信息
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

    // 对于其他的 challenges 直接使用默认的验证方案
    completionHandler(disposition,credential);
}
*/

@end
