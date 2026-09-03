//
//  RXASAService.m
//  RXASAKit
//
//  Created by 陈汉 on 2023/10/30.
//

#import "RXASAService.h"
#import <AdServices/AdServices.h>
#import <iAd/iAd.h>
#import <AppTrackingTransparency/AppTrackingTransparency.h>
#import <RXSDK_Pure/RXNotificationCenter.h>
#import <RXSDK_Pure/RXSubPackage.h>
#import <RXSDK_Pure/RXSDK_Pure.h>

typedef void(^RXASABlock)(NSDictionary *response, NSDictionary *error);

@implementation RXASAService

static RXASAService *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXASAService alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        
        [RXSubPackage sharedSDK].aASA = YES;
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(getASAInfo:) name:rxUserDefault_asa object:nil];
    }
    return self;
}

#pragma mark -- from main framework
- (void)getASAInfo:(NSNotification *)noti
{
    RXASABlock callback = noti.userInfo[@"callback"];
    
    [self getInfoWithComplete:callback];
}

- (void)regist
{
    NSLog(@"RXOSUIKit 初始化成功");
}

/**
 * 获取 ASA 数据
 * @note 如果使用瑞雪SDK上报数据需要在初始化前调用，并保证在回调完成后调用初始化，ASA 获取成功或失败不影响瑞雪SDK功能，只影响 ASA 数据统计，请注意处理调用逻辑
 * @note 获取成功后 SDK 内部保存数据，客户端不需要处理
 */
- (void)getInfoWithComplete:(void(^)(NSDictionary *response, NSDictionary *error))complete
{
    if(@available(iOS 14.3, *)) {
        NSError *error;
        NSString *token = [AAAttribution attributionTokenWithError:&error];
        if(token != nil) {
            //用token请求苹果API获取归因数据包;也可以将token发送到Server 端,由Server端完成归因
            //例curlhttps://api-adservices.apple.com/api/vl/ -H Content-Type:application/json' -d 'token string
            //获取AdServices版本的归因数据包后,将数据包与设备唯一标识一起发送到Server 端
            //如果请求成功,则可缓存不再反复归因;否则需根据错误信息做容错性处理;
            NSDictionary *asaInfo = @{
                @"click_id" : token,
                @"ad_platform" : @"apple"
            };
            
            [[NSUserDefaults standardUserDefaults] setValue:asaInfo forKey:@"rx_asaInfo"];
            
            if (complete) {
                complete(asaInfo, nil);
            }
        } else {
            NSLog(@"RXASAKit 没有获取到token");
            NSDictionary *errorRes = @{@"code" : @(9000),
                                       @"msg" : @"未知错误"
            };
            if (complete) {
                complete(nil, errorRes);
            }
        }
    } else {
        Boolean attribution_enable = TRUE;
        if (@available(iOS 14.0,*)) {
            ATTrackingManagerAuthorizationStatus status = [ATTrackingManager trackingAuthorizationStatus];
            attribution_enable = status == ATTrackingManagerAuthorizationStatusNotDetermined | status == ATTrackingManagerAuthorizationStatusAuthorized;
            
            if (@available(iOS 14.5,*)) {
                attribution_enable = status == ATTrackingManagerAuthorizationStatusAuthorized;
            }
        }
        if (attribution_enable) {
#if __IPHONE_OS_VERSION_MAX_ALLOWED < 180000
            if ([[ADClient sharedClient] respondsToSelector:@selector(requestAttributionDetailsWithBlock:)]) {
                [[ADClient sharedClient] requestAttributionDetailsWithBlock:^(NSDictionary<NSString *,NSObject *> * _Nullable attributionDetails, NSError * _Nullable error) {
                    //获取iAd版本的归因数据包后,将数据包与设备唯一标识一起发送到Server 端
                    //如果请求成功,则可缓存不再反复归因;否则需根据错误信息做容错性处理
                    if (!error) {
                        NSDictionary *asaInfo = @{
                            @"ad_rawargs" : attributionDetails,
                            @"ad_platform" : @"apple"
                        };
                        [[NSUserDefaults standardUserDefaults] setValue:asaInfo forKey:@"rx_asaInfo"];
                        if (complete) {
                            complete(asaInfo, nil);
                        }
                    } else {
                        NSLog(@"RXASAKit 没有获取到token");
                        NSDictionary *errorRes = @{@"code" : @(9000),
                                                   @"msg" : @"未知错误"
                        };
                        if (complete) {
                            complete(nil, errorRes);
                        }
                    }
                }];
            } else {
                NSLog(@"RXASAKit 没有获取到token");
                NSDictionary *errorRes = @{@"code" : @(9000),
                                           @"msg" : @"未知错误"
                };
                if (complete) {
                    complete(nil, errorRes);
                }
            }
#endif
            
        }
    }
}

@end
