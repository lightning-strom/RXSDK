//
//  RXPrivateService.m
//  RXSDK
//
//  Created by 陈汉 on 2024/4/10.
//

#import "RXPrivateService.h"
#import "RXCommonHeader.h"

@implementation RXPrivateService

static RXPrivateService *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXPrivateService alloc] init];
    });
    return sharedSDK;
}

/**
 * 发送失败通知
 * @note UIKit 专用
 */
- (void)postLoginError:(NSDictionary *)error
             loginType:(LoginType)loginType
{
    NSDictionary *notiDic = @{@"loginData" : error,
                              @"loginType" : @(loginType)
    };
    [[NSNotificationCenter defaultCenter] postNotificationName:noti_rxUILogin object:nil userInfo:notiDic];
}

/**
 * 获取请求地区
 */
- (NSString *)getRequestArea
{
    return [RXCommonTool getRequestArea];
}

/**
 * 绑定账号
 */
- (void)bindThirdAccountWithMethod:(NSString *)method
                               ext:(NSDictionary *)ext
                          complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:method forKey:@"method"];
    [dic setValue:ext forKey:@"ext"];
    
    NSString *scene = ext[@"scene"] ? [NSString stringWithFormat:@"%@", ext[@"scene"]] : @"";
    if (scene.length <= 0) {
        scene = @"authorization";
    }
    
    [dic setValue:scene forKey:@"scene"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/passport/user/bind_account" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"绑定成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"绑定失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 处理 URL Scheme 回调
 * @param app 应用实例
 * @param url 回调 URL
 * @param options 附加参数
 * @return 是否成功处理
 * @note 需在 AppDelegate 的 application:openURL:options: 方法中调用
 */
- (BOOL)application:(UIApplication *)app
            openURL:(NSURL *)url
            options:(NSDictionary<NSString *, id> *)options
{
    NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
    [notiDic setValue:app forKey:@"app"];
    [notiDic setValue:url forKey:@"url"];
    [notiDic setValue:options forKey:@"options"];
    
    [RXNotificationCenter postNoti:rxUserDefault_openurl object:nil userInfo:notiDic];
    return YES;
}

/**
 * 处理 Universal Link 回调
 * @param application 应用实例
 * @param userActivity 用户活动对象
 * @param restorationHandler 恢复处理回调
 * @return 是否成功处理
 * @note 需在 AppDelegate 的 application:continueUserActivity:restorationHandler: 方法中调用
 */
- (BOOL)application:(UIApplication *)application
continueUserActivity:(NSUserActivity *)userActivity
  restorationHandler:(void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler
{
    NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
    [notiDic setValue:application forKey:@"app"];
    [notiDic setValue:userActivity forKey:@"userActivity"];
    
    [RXNotificationCenter postNoti:rxUserDefault_ulink object:nil userInfo:notiDic];
    return YES;
}

@end
