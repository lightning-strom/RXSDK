//
//  RXNotificationCenter.h
//  RXSDK-Pure
//
//  Created by 陈汉 on 2025/9/24.
//

#import <Foundation/Foundation.h>
#import "RXPublicHeader.h"

NS_ASSUME_NONNULL_BEGIN

static NSString *const rxUserDefault_aliDNS = @"rxUserDefault_aliDNS";

static NSString *const rxUserDefault_tencentDNS = @"rxUserDefault_tencentDNS";

static NSString *const rxUserDefault_adjust_init = @"rxUserDefault_adjust_init";
static NSString *const rxUserDefault_adjust_event = @"rxUserDefault_adjust_event";
static NSString *const rxUserDefault_adjust_session = @"rxUserDefault_adjust_session";
static NSString *const rxUserDefault_adjust_phone = @"rxUserDefault_adjust_phone";
static NSString *const rxUserDefault_adjust_email = @"rxUserDefault_adjust_email";

static NSString *const rxUserDefault_firebase_instanceid = @"rxUserDefault_firebase_instanceid";

typedef void(^DNSRequestSuccessBlock)(NSURLSessionDataTask * _Nonnull, id _Nullable);
typedef void(^DNSRequestFailBlock)(NSURLSessionDataTask * _Nullable, NSError * _Nonnull);

@interface RXNotificationCenter : NSObject

+ (void)postNoti:(NSString *)name object:(nullable id)anObject userInfo:(nullable NSDictionary *)aUserInfo;

@property (nonatomic, copy) DNSRequestSuccessBlock dnsSuccessBlock;
@property (nonatomic, copy) DNSRequestFailBlock dnsFailBlock;
@property (nonatomic, copy) RequestComplete shareDNSBlock;

@end

NS_ASSUME_NONNULL_END
