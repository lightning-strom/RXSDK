//
//  RXUniPinPayService.m
//  RXUniPinSDK
//
//  Created by root11 on 2024/5/14.
//

#import "RXUniPinPayService.h"
#import <RXPublicToolKit/RXPublicToolKit.h>

@interface RXUniPinPayService ()<RXWebViewDelegate>

@end


@implementation RXUniPinPayService

static RXUniPinPayService *sharedSDK = nil;

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
        // 初始化属性
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

/**
 *
 * @note 支付方法
 *
 */
- (void)payWithOrderInfo:(NSDictionary *)info{
    [RXToolKit sharedSDK].webViewDelegate = self;
    
    NSString *uniPayUrlString = info[@"url"];
    if (uniPayUrlString.length > 0) {
        [[RXToolKit sharedSDK] openWebView:uniPayUrlString];
    }else{
        NSLog(@"url地址为空");
    }
}

#pragma mark - RXWebViewDelegate
- (void)rx_decidePolicyForNavigationResponse:(NSInteger)code
{
    
}

- (void)rx_didFinishNavigation:(NSString *)urlStr schemeParams:(NSDictionary *)schemeParams
{
    
}

- (void)rx_decidePolicyForNavigationAction:(NSString *)urlStr schemeParams:(NSDictionary *)schemeParams
{
    
}

- (void)rx_closeWebView
{
    
}

@end
