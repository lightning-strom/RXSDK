//
//  RXInstagramService.m
//  RXInstagramSDK
//
//  Created by 陈汉 on 2024/4/9.
//

#import "RXInstagramService.h"
#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXPublicToolKit/RXPublicToolKit.h>
#import <RXSDK_Pure/RXNotificationCenter.h>
#import <RXSDK_Pure/RXSubPackage.h>

@interface RXInstagramService () <RXWebViewDelegate>

@property (nonatomic, copy) NSString *clientID;
@property (nonatomic, copy) NSString *redirectURI;

@end

@implementation RXInstagramService

static RXInstagramService *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXInstagramService alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        [RXToolKit sharedSDK].webViewDelegate = self;
        [RXSubPackage sharedSDK].aInstagram = YES;
        
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(loginAction:) name:rxUserDefault_login_ins object:nil];
    }
    return self;
}

#pragma mark -- from main framework
- (void)loginAction:(NSNotification *)noti
{
    [self login];
}

/**
 * 初始化 instagram
 * @param clientID 应用ID
 * @param redirectURI 应用重定向网址
 * 注册应用时自动生成应用ID，并设置重定向网址redirectURI
 */
- (void)initWithClientID:(NSString *)clientID redirectURI:(NSString *)redirectURI{
    self.clientID = clientID;
    self.redirectURI = redirectURI;
}

/**
 * 登录
 */
- (void)login
{
    [[RXToolKit sharedSDK] openWebView:[NSString stringWithFormat:@"https://api.instagram.com/oauth/authorize?client_id=%@&redirect_uri=%@&response_type=code&scope=user_profile", self.clientID, self.redirectURI]];
}

- (void)rx_decidePolicyForNavigationResponse:(NSInteger)code
{
    RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
    
    NSMutableDictionary *errorRes = [NSMutableDictionary dictionary];
    [errorRes setValue:[RXErrorTool getRXErrorMsg:RXLoginError_third] forKey:@"msg"];
    [errorRes setValue:@(RXLoginError_third) forKey:@"code"];
    [errorRes setValue:@(code) forKey:@"thirdcode"];
//    [errorRes setValue:error.localizedDescription forKey:@"thirdmsg"];
    err.responesObject = errorRes;
    
    [[RXService sharedSDK].loginDelegate rx_LoginCallBackWithResponse:nil error:err];
    
    [[RXPrivateService sharedSDK] postLoginError:errorRes loginType:LoginTypeInstagram];
    
    [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                   bodyDic:@{}
                                                    action:@"rxlog_error_login"
                                                       url:@""
                                                      code:err.responesObject[@"code"] == nil ? -123 : [err.responesObject[@"code"] integerValue]
                                                       msg:err.responesObject[@"msg"]
                                                 thirdType:@"instagram"
                                                 thirdcode:err.responesObject[@"thirdcode"] == nil ? -123 : [err.responesObject[@"thirdcode"] integerValue]
                                                  thirdmsg:err.responesObject[@"thirdmsg"]
                                                   traceid:@""];
}

- (void)rx_didFinishNavigation:(NSString *)urlStr schemeParams:(NSDictionary *)schemeParams
{
    if ([urlStr containsString:@"code="]) {
        NSMutableDictionary *extDic = [NSMutableDictionary dictionaryWithDictionary:schemeParams];
        [extDic setValue:@"instagram" forKey:@"method"];
        [[RXService sharedSDK] loginWithExtDic:extDic username:nil password:nil sign_fields:nil loginType:LoginTypeDefault migrate_args:nil];
        
        [[RXToolKit sharedSDK] closeWebView];
    }
}

- (void)rx_decidePolicyForNavigationAction:(NSString *)urlStr schemeParams:(NSDictionary *)schemeParams
{
    NSLog(@"");
}

- (void)rx_closeWebView
{
    RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
    
    NSMutableDictionary *errorRes = [NSMutableDictionary dictionary];
    [errorRes setValue:[RXErrorTool getRXErrorMsg:RXLoginError_cancel] forKey:@"msg"];
    [errorRes setValue:@(RXLoginError_cancel) forKey:@"code"];
    err.responesObject = errorRes;
    
    [[RXService sharedSDK].loginDelegate rx_LoginCallBackWithResponse:nil error:err];
    
    [[RXPrivateService sharedSDK] postLoginError:errorRes loginType:LoginTypeInstagram];
    
    [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                   bodyDic:@{}
                                                    action:@"rxlog_error_login"
                                                       url:@""
                                                      code:err.responesObject[@"code"] == nil ? -123 : [err.responesObject[@"code"] integerValue]
                                                       msg:err.responesObject[@"msg"]
                                                 thirdType:@"instagram"
                                                 thirdcode:err.responesObject[@"thirdcode"] == nil ? -123 : [err.responesObject[@"thirdcode"] integerValue]
                                                  thirdmsg:err.responesObject[@"thirdmsg"]
                                                   traceid:@""];
}

@end
