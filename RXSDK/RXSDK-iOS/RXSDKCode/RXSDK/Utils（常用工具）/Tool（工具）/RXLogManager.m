//
//  RXLogManager.m
//  RXSDK-Pure
//
//  Created by 陈汉 on 2024/6/14.
//

#import "RXLogManager.h"
#import "RXLogService.h"
#import "RXCommonHeader.h"

@interface RXLogManager ()

@property (nonatomic, assign) LoginType loginType;
 
@end

@implementation RXLogManager

static RXLogManager *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXLogManager alloc] init];
    });
    return sharedSDK;
}

/**
 * 添加登录日志
 */
- (void)addLoginLogWithLoginType:(LoginType)loginType
                       errorInfo:(NSDictionary *)errorInfo
{
    if (loginType == LoginTypeDefault) {
        loginType = self.loginType;
    }
    switch (loginType) {
        case LoginTypeAccount:
        {
            // 事件上报
            NSMutableDictionary *trackDic = [NSMutableDictionary dictionary];
            [trackDic setValue:@"1" forKey:@"login_type"];
            [trackDic setValue:@"1-1" forKey:@"login_category"];
            if (!errorInfo) {
                [trackDic setValue:@"1-10" forKey:@"login_action"];
            } else {
                [trackDic setValue:@"1-11" forKey:@"login_action"];
                [self fetchErrorTrackDic:trackDic errorInfo:errorInfo];
            }
            [[RXLogService sharedSDK] addLogSingleFirstLoginWithEvent:rxlog_login_process distinctId:@"" properties:trackDic];
            break;
        }
        case LoginTypeCapCode:
        {
            // 事件上报
            NSMutableDictionary *trackDic = [NSMutableDictionary dictionary];
            [trackDic setValue:@"3" forKey:@"login_type"];
            [trackDic setValue:@"3-1" forKey:@"login_category"];
            if (!errorInfo) {
                [trackDic setValue:@"3-5" forKey:@"login_action"];
            } else {
                [trackDic setValue:@"3-6" forKey:@"login_action"];
                [self fetchErrorTrackDic:trackDic errorInfo:errorInfo];
            }
            [[RXLogService sharedSDK] addLogSingleFirstLoginWithEvent:rxlog_login_process distinctId:@"" properties:trackDic];
            break;
        }
        case LoginTypeVisitor:
        {
            // 事件上报
            NSMutableDictionary *trackDic = [NSMutableDictionary dictionary];
            [trackDic setValue:@"4" forKey:@"login_type"];
            [trackDic setValue:@"4-1" forKey:@"login_category"];
            if (!errorInfo) {
                [trackDic setValue:@"4-2" forKey:@"login_action"];
            } else {
                [trackDic setValue:@"4-3" forKey:@"login_action"];
                [self fetchErrorTrackDic:trackDic errorInfo:errorInfo];
            }
            [[RXLogService sharedSDK] addLogSingleFirstLoginWithEvent:rxlog_login_process distinctId:@"" properties:trackDic];
            break;
        }
        case LoginTypeGoogle:
        {
            // 事件上报
            NSMutableDictionary *trackDic = [NSMutableDictionary dictionary];
            [trackDic setValue:@"2" forKey:@"login_type"];
            [trackDic setValue:@"2-1" forKey:@"login_category"];
            if (!errorInfo) {
                [trackDic setValue:@"2-4" forKey:@"login_action"];
            } else {
                [trackDic setValue:@"2-5" forKey:@"login_action"];
                [self fetchErrorTrackDic:trackDic errorInfo:errorInfo];
            }
            [[RXLogService sharedSDK] addLogSingleFirstLoginWithEvent:rxlog_login_process distinctId:@"" properties:trackDic];
            break;
        }
        case LoginTypeFacebook:
        {
            // 事件上报
            NSMutableDictionary *trackDic = [NSMutableDictionary dictionary];
            [trackDic setValue:@"2" forKey:@"login_type"];
            [trackDic setValue:@"2-2" forKey:@"login_category"];
            if (!errorInfo) {
                [trackDic setValue:@"2-4" forKey:@"login_action"];
            } else {
                [trackDic setValue:@"2-5" forKey:@"login_action"];
                [self fetchErrorTrackDic:trackDic errorInfo:errorInfo];
            }
            [[RXLogService sharedSDK] addLogSingleFirstLoginWithEvent:rxlog_login_process distinctId:@"" properties:trackDic];
            break;
        }
        case LoginTypeZalo:
        {
            // 事件上报
            NSMutableDictionary *trackDic = [NSMutableDictionary dictionary];
            [trackDic setValue:@"2" forKey:@"login_type"];
            [trackDic setValue:@"2-3" forKey:@"login_category"];
            if (!errorInfo) {
                [trackDic setValue:@"2-4" forKey:@"login_action"];
            } else {
                [trackDic setValue:@"2-5" forKey:@"login_action"];
                [self fetchErrorTrackDic:trackDic errorInfo:errorInfo];
            }
            [[RXLogService sharedSDK] addLogSingleFirstLoginWithEvent:rxlog_login_process distinctId:@"" properties:trackDic];
            break;
        }
        case LoginTypeLine:
        {
            // 事件上报
            NSMutableDictionary *trackDic = [NSMutableDictionary dictionary];
            [trackDic setValue:@"2" forKey:@"login_type"];
            [trackDic setValue:@"2-6" forKey:@"login_category"];
            if (!errorInfo) {
                [trackDic setValue:@"2-4" forKey:@"login_action"];
            } else {
                [trackDic setValue:@"2-5" forKey:@"login_action"];
                [self fetchErrorTrackDic:trackDic errorInfo:errorInfo];
            }
            [[RXLogService sharedSDK] addLogSingleFirstLoginWithEvent:rxlog_login_process distinctId:@"" properties:trackDic];
            break;
        }
        case LoginTypeApple:
        {
            // 事件上报
            NSMutableDictionary *trackDic = [NSMutableDictionary dictionary];
            [trackDic setValue:@"2" forKey:@"login_type"];
            [trackDic setValue:@"2-7" forKey:@"login_category"];
            if (!errorInfo) {
                [trackDic setValue:@"2-4" forKey:@"login_action"];
            } else {
                [trackDic setValue:@"2-5" forKey:@"login_action"];
                [self fetchErrorTrackDic:trackDic errorInfo:errorInfo];
            }
            [[RXLogService sharedSDK] addLogSingleFirstLoginWithEvent:rxlog_login_process distinctId:@"" properties:trackDic];
            break;
        }
        case LoginTypeTikTok:
        {
            // 事件上报
            NSMutableDictionary *trackDic = [NSMutableDictionary dictionary];
            [trackDic setValue:@"2" forKey:@"login_type"];
            [trackDic setValue:@"2-8" forKey:@"login_category"];
            if (!errorInfo) {
                [trackDic setValue:@"2-4" forKey:@"login_action"];
            } else {
                [trackDic setValue:@"2-5" forKey:@"login_action"];
                [self fetchErrorTrackDic:trackDic errorInfo:errorInfo];
            }
            [[RXLogService sharedSDK] addLogSingleFirstLoginWithEvent:rxlog_login_process distinctId:@"" properties:trackDic];
            break;
        }
        case LoginTypeInstagram:
        {
            // 事件上报
            NSMutableDictionary *trackDic = [NSMutableDictionary dictionary];
            [trackDic setValue:@"2" forKey:@"login_type"];
            [trackDic setValue:@"2-10" forKey:@"login_category"];
            if (!errorInfo) {
                [trackDic setValue:@"2-4" forKey:@"login_action"];
            } else {
                [trackDic setValue:@"2-5" forKey:@"login_action"];
                [self fetchErrorTrackDic:trackDic errorInfo:errorInfo];
            }
            [[RXLogService sharedSDK] addLogSingleFirstLoginWithEvent:rxlog_login_process distinctId:@"" properties:trackDic];
            break;
        }
        case LoginTypeReddit:
        {
            // 事件上报
            NSMutableDictionary *trackDic = [NSMutableDictionary dictionary];
            [trackDic setValue:@"2" forKey:@"login_type"];
            [trackDic setValue:@"2-11" forKey:@"login_category"];
            if (!errorInfo) {
                [trackDic setValue:@"2-4" forKey:@"login_action"];
            } else {
                [trackDic setValue:@"2-5" forKey:@"login_action"];
                [self fetchErrorTrackDic:trackDic errorInfo:errorInfo];
            }
            [[RXLogService sharedSDK] addLogSingleFirstLoginWithEvent:rxlog_login_process distinctId:@"" properties:trackDic];
            break;
        }
        case LoginTypeVK:
        {
            // 事件上报
            NSMutableDictionary *trackDic = [NSMutableDictionary dictionary];
            [trackDic setValue:@"2" forKey:@"login_type"];
            [trackDic setValue:@"2-12" forKey:@"login_category"];
            if (!errorInfo) {
                [trackDic setValue:@"2-4" forKey:@"login_action"];
            } else {
                [trackDic setValue:@"2-5" forKey:@"login_action"];
                [self fetchErrorTrackDic:trackDic errorInfo:errorInfo];
            }
            [[RXLogService sharedSDK] addLogSingleFirstLoginWithEvent:rxlog_login_process distinctId:@"" properties:trackDic];
            break;
        }
        default:
            break;
    }
}

/**
 * 添加注册日志
 */
- (void)addRegisterLogWithErrorInfo:(NSDictionary *)errorInfo
{
    // 事件上报
    NSMutableDictionary *trackDic = [NSMutableDictionary dictionary];
    
    [trackDic setValue:@"1" forKey:@"login_type"];
    [trackDic setValue:@"1-1" forKey:@"login_category"];
    
    if (!errorInfo) {
        [trackDic setValue:@"1-8" forKey:@"login_action"];
    } else {
        [trackDic setValue:@"1-9" forKey:@"login_action"];
        [self fetchErrorTrackDic:trackDic errorInfo:errorInfo];
    }
    
    [[RXLogService sharedSDK] addLogSingleFirstLoginWithEvent:rxlog_login_process distinctId:@"" properties:trackDic];
}

/**
 * 添加获取验证码日志
 */
- (void)addCaptchaCodeLogWithPurpose:(NSString *)purpose
                           errorInfo:(NSDictionary *)errorInfo
{
    // 事件上报
    NSMutableDictionary *trackDic = [NSMutableDictionary dictionary];
    
    if ([purpose isEqualToString:@"register"]) {
        
        [trackDic setValue:@"1" forKey:@"login_type"];
        [trackDic setValue:@"1-1" forKey:@"login_category"];
        
        if (!errorInfo) {
            [trackDic setValue:@"1-3" forKey:@"login_action"];
        } else {
            [trackDic setValue:@"1-4" forKey:@"login_action"];
            [self fetchErrorTrackDic:trackDic errorInfo:errorInfo];
        }
    } else if ([purpose isEqualToString:@"login"]) {
        
        [trackDic setValue:@"3" forKey:@"login_type"];
        [trackDic setValue:@"3-1" forKey:@"login_category"];
        
        if (!errorInfo) {
            [trackDic setValue:@"3-2" forKey:@"login_action"];
        } else {
            [trackDic setValue:@"3-3" forKey:@"login_action"];
            [self fetchErrorTrackDic:trackDic errorInfo:errorInfo];
        }
    }
    
    [[RXLogService sharedSDK] addLogSingleFirstLoginWithEvent:rxlog_login_process distinctId:@"" properties:trackDic];
}

/**
 * 添加校验验证码日志
 * @param type 0 邮箱 1 手机
 */
- (void)addVerifyCaptchaCodeLogWithErrorInfo:(NSDictionary *)errorInfo
                                        type:(CaptchaType)type
{
    // 事件上报
    NSMutableDictionary *trackDic = [NSMutableDictionary dictionary];
    
    if (type == CaptchaType_email) {
        
        [trackDic setValue:@"1" forKey:@"login_type"];
        [trackDic setValue:@"1-1" forKey:@"login_category"];
        
        if (!errorInfo) {
            [trackDic setValue:@"1-5" forKey:@"login_action"];
        } else {
            [trackDic setValue:@"1-6" forKey:@"login_action"];
            [self fetchErrorTrackDic:trackDic errorInfo:errorInfo];
        }
        
    } else if (type == CaptchaType_phone) {
        
        [trackDic setValue:@"3" forKey:@"login_type"];
        [trackDic setValue:@"3-1" forKey:@"login_category"];
        
        if (!errorInfo) {
            
        } else {
            [trackDic setValue:@"3-4" forKey:@"login_action"];
            [self fetchErrorTrackDic:trackDic errorInfo:errorInfo];
        }
        
    }
    
    [[RXLogService sharedSDK] addLogSingleFirstLoginWithEvent:rxlog_login_process distinctId:@"" properties:trackDic];
}

- (void)fetchErrorTrackDic:(NSMutableDictionary *)trackDic
                  errorInfo:(NSDictionary *)errorInfo
{
    for (int i = 0; i < errorInfo.allKeys.count; i++) {
        
        if (errorInfo.allKeys[i] && errorInfo.allValues[i]) {
            [trackDic setValue:errorInfo.allValues[i] forKey:errorInfo.allKeys[i]];
        }
    }
}

/**
 * 添加三方授权日志
 */
- (void)addThirdLoginLogWithLoginType:(LoginType)loginType
                                begin:(BOOL)begin
                            errorInfo:(NSDictionary *)errorInfo
{
    self.loginType = loginType;
    
    // 事件上报
    NSMutableDictionary *trackDic = [NSMutableDictionary dictionary];
    [trackDic setValue:@"2" forKey:@"login_type"];
    
    if (begin) {
        [trackDic setValue:@"2-1" forKey:@"login_action"];
    } else {
        if (!errorInfo) {
            [trackDic setValue:@"2-3-1" forKey:@"login_action"];
        } else {
            [trackDic setValue:@"2-3-2" forKey:@"login_action"];
            [self fetchErrorTrackDic:trackDic errorInfo:errorInfo];
        }
    }
    
    BOOL isThird = YES;
    
    switch (loginType) {
        case LoginTypeGoogle:
        {
            [trackDic setValue:@"2-1" forKey:@"login_category"];
            break;
        }
        case LoginTypeFacebook:
        {
            [trackDic setValue:@"2-2" forKey:@"login_category"];
            break;
        }
        case LoginTypeZalo:
        {
            [trackDic setValue:@"2-3" forKey:@"login_category"];
            break;
        }
        case LoginTypeLine:
        {
            [trackDic setValue:@"2-6" forKey:@"login_category"];
            break;
        }
        case LoginTypeApple:
        {
            [trackDic setValue:@"2-7" forKey:@"login_category"];
            break;
        }
        case LoginTypeTikTok:
        {
            [trackDic setValue:@"2-8" forKey:@"login_category"];
            break;
        }
        case LoginTypeInstagram:
        {
            [trackDic setValue:@"2-10" forKey:@"login_category"];
            break;
        }
        case LoginTypeReddit:
        {
            [trackDic setValue:@"2-11" forKey:@"login_category"];
            break;
        }
        case LoginTypeVK:
        {
            [trackDic setValue:@"2-12" forKey:@"login_category"];
            break;
        }
        default:
            isThird = NO;
            break;
    }
    
    if (isThird) {
        [[RXLogService sharedSDK] addLogSingleFirstLoginWithEvent:rxlog_login_process distinctId:@"" properties:trackDic];
    }
}

#pragma mark - 将 三方返回的 登录、分享，以及一些客户端错误码上报到大数据中
/**
 * 将 三方返回的 登录、分享，以及一些客户端错误码上报到大数据中，此处仅上传瑞雪code < 2000的网络错误
 */
+ (void)addErrorLogWithRequest:(NSMutableURLRequest *)request
                    parameters:(id)parameters
                       headers:(nullable NSDictionary <NSString *, NSString *> *)headers
                   requestType:(NSString *)requestType
                     thirdType:(NSString *)thirdType
                         error:(NSError * _Nullable)error{
    if (![request.URL.absoluteString containsString:@"v1/data/api/track"]) {
        NSInteger errorCode = [RXErrorTool getNetworkError:error.code];
        
        if (errorCode < 2000) {
            NSDictionary *bodyParam = [NSDictionary dictionary];
            if ([requestType isEqualToString:@"POST"] || [requestType isEqualToString:@"PUT"]) {
                bodyParam = parameters;
            }else{
                bodyParam = [RXCommonTool parseQueryParametersFromURL:request.URL.absoluteString];
            }
            
            [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:headers bodyDic:bodyParam action:@"" url:request.URL.absoluteString code:errorCode msg:error.description thirdType:thirdType thirdcode:-123 thirdmsg:@"" traceid:@""];
        }
        
    }
}


/**
 * 将 三方返回的 登录、分享，以及一些客户端错误码上报到大数据中
 * @param headerDic 请求头
 * @param bodyDic 请求体
 * @param action 动作
 * @param url 请求地址
 * @param type 三方类型
 * @param code 错误码
 * @param msg 错误信息
 * @param thirdcode 三方错误码
 * @param thirdmsg 三方错误信息
 * @param traceid 唯一标识
 */
- (void)addErrorMsgWithRequestHeader:(NSDictionary *)headerDic
                             bodyDic:(NSDictionary *)bodyDic
                              action:(NSString *)action
                                 url:(NSString *)url
                                code:(NSInteger)code
                                 msg:(NSString *)msg
                           thirdType:(NSString *)type
                           thirdcode:(NSInteger)thirdcode
                            thirdmsg:(NSString *)thirdmsg
                             traceid:(NSString *)traceid
{
    @try {
        if ([url containsString:@"v1/data/api/track"]) {
//            dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(60 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
//                [self trackErrorPrivateMsgWithRequestHeader:headerDic bodyDic:bodyDic action:action url:url code:code msg:msg thirdType:type thirdcode:thirdcode thirdmsg:thirdmsg traceid:traceid];
//            });
        } else {
            [self trackErrorPrivateMsgWithRequestHeader:headerDic bodyDic:bodyDic action:action url:url code:code msg:msg thirdType:type thirdcode:thirdcode thirdmsg:thirdmsg traceid:traceid properties:nil];
        }
    } @catch (NSException *exception) {
        NSLog(@"RXCatch addErrorMsgWithRequestHeader %@", exception);
    } @finally {
        
    }
}

/**
 * 将 三方返回的 登录、分享，以及一些客户端错误码上报到大数据中
 * @param headerDic 请求头
 * @param bodyDic 请求体
 * @param action 动作
 * @param url 请求地址
 * @param type 三方类型
 * @param code 错误码
 * @param msg 错误信息
 * @param thirdcode 三方错误码
 * @param thirdmsg 三方错误信息
 * @param traceid 唯一标识
 */
- (void)trackErrorPrivateMsgWithRequestHeader:(NSDictionary *)headerDic
                                      bodyDic:(NSDictionary *)bodyDic
                                       action:(NSString *)action
                                          url:(NSString *)url
                                         code:(NSInteger)code
                                          msg:(NSString *)msg
                                    thirdType:(NSString *)type
                                    thirdcode:(NSInteger)thirdcode
                                     thirdmsg:(NSString *)thirdmsg
                                      traceid:(NSString *)traceid
                                   properties:(NSDictionary *)properties
{
    @try {
        NSMutableDictionary *logInfo = [RXUserUtility valueForKey:keyUserData_localLogInfo];
        BOOL of = [logInfo[@"ce"] boolValue];
        
        if ([RXUserUtility sharedManager].isInit && !of) {
            NSLog(@"已关闭客户端日志上报");
            return;
        }
        
        NSMutableDictionary *properties = [NSMutableDictionary dictionary];
        [properties setValue:sdkVersion forKey:@"rx_version"];
        [properties setValue:@"sdk" forKey:@"error_type"];
        [properties setValue:@"请前往 https://doc.ruixueyun.com/main/#/view?path=1e320cec-2bd2-4ae1-9c7b-3c44a645ead5 查看解决方案" forKey:@"error_ext"];
        
        if ([RXUserUtility sharedManager].cp_user_id.length > 0) {
            [properties setValue:[RXUserUtility sharedManager].cp_user_id forKey:@"cp_userid"];
        }
        if ([NSString rx_isNullToString:action].length > 0) {
            [properties setValue:action forKey:@"error_action"];
        }
        if ([NSString rx_isNullToString:type].length > 0) {
            [properties setValue:type forKey:@"type_tripartite"];
        }
        if ([NSString rx_isNullToString:url].length > 0) {
            [properties setValue:url forKey:@"request_address"];
        }
        if ([headerDic isKindOfClass:[NSDictionary class]] && headerDic.allKeys.count > 0) {
            [properties setValue:headerDic forKey:@"request_header"];
        }
        if ([bodyDic isKindOfClass:[NSDictionary class]] && bodyDic.allKeys.count > 0) {
            [properties setValue:bodyDic forKey:@"request_body"];
        }
        if (code != -123) {
            [properties setValue:@(code) forKey:@"error_code"];
        }
        if ([NSString rx_isNullToString:msg].length > 0){
            [properties setValue:msg forKey:@"error_message"];
        }
        if (thirdcode != -123) {
            [properties setValue:@(thirdcode) forKey:@"error_code_tripartite"];
        }
        if ([NSString rx_isNullToString:thirdmsg].length > 0) {
            [properties setValue:thirdmsg forKey:@"error_message_tripartite"];
        }
        if ([NSString rx_isNullToString:traceid].length > 0) {
            [properties setValue:traceid forKey:@"trace_id"];
        }else{
            if ([headerDic isKindOfClass:[NSDictionary class]] && [NSString rx_isNullToString:headerDic[@"ruixue-traceid"]].length > 0) {
                [properties setValue:headerDic[@"ruixue-traceid"] forKey:@"trace_id"];
            }else{
                [properties setValue:[RXCommonTool uuid] forKey:@"trace_id"];
            }
        }
        
        [[RXLogService sharedSDK] dataTrackWithEvent:rxlog_error distinctId:@"" properties:properties];
    } @catch (NSException *exception) {
        NSLog(@"RXCatch addErrorMsgWithRequestHeader %@", exception);
    } @finally {
        
    }
}

@end
