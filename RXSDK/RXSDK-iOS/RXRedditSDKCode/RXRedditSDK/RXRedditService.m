//
//  RXRedditService.m
//  RxRedditSDK
//
//  Created by root11 on 2024/4/9.
//

#import "RXRedditService.h"
#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <RXPublicToolKit/RXPublicToolKit.h>
#import <RXSDK_Pure/RXSDK_Pure.h>
#import "RXRedditAuthManager.h"
#import <RXSDK_Pure/RXNotificationCenter.h>
#import <RXSDK_Pure/RXSubPackage.h>

//reddit OAuth2认证页面地址及相关参数
#define redditLoginWebUrl(clientID, randomState, redirectURI, scope) \
[NSString stringWithFormat:@"https://www.reddit.com/api/v1/authorize.compact?client_id=%@&response_type=token&state=%@&redirect_uri=%@&scope=%@", clientID, randomState, redirectURI, scope]
//reddit scope
//#define scopeArray @[@"identity", @"submit"]
#define scopeArray @[@"identity", @"edit",  @"read", @"save", @"submit", @"subscribe",@"mysubreddits"]
//reddit 分享(提交)帖子使用的请求地址
#define redditShareUrl @"https://oauth.reddit.com/api/submit"

/**
 * 用户操作类型，登录or分享
 */
typedef NS_ENUM(NSUInteger, RxRedditAuthOrShareType) {
    RXRedditAuth = 0,     // 登录授权
    RXRedditShare = 1,     // 分享
};

@interface RXRedditService ()<RXWebViewDelegate>

@property (nonatomic, copy) NSString *randomLoginState;
@property (nonatomic, copy) NSString *clientID;
@property (nonatomic, copy) NSString *redirectURI;

@property (nonatomic, assign) RxRedditAuthOrShareType authOrShareType;//0登录；1分享
@property (nonatomic, assign) RXRedditShareType shareType;
@property (nonatomic, copy) NSString *title;
@property (nonatomic, copy) NSString *text;
@property (nonatomic, copy) NSString *url;
@property (nonatomic, copy) NSString *sr;
@property (nonatomic, copy) resposeBlock resultBlock;
@property (nonatomic, strong) RXCustomShareConfig *shareContent;//分享内容

@end


@implementation RXRedditService

static RXRedditService *sharedSDK = nil;

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
        [RXSubPackage sharedSDK].aReddit = YES;
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(shareAction:) name:rxUserDefault_share_reddit object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(loginAction:) name:rxUserDefault_login_reddit object:nil];
    }
    return self;
}

#pragma mark -- from main framework
- (void)shareAction:(NSNotification *)noti
{
    NSDictionary *shareInfo = noti.userInfo[@"shareInfo"];
    NewShareCallBack callback = noti.userInfo[@"callback"];
    
    [self shareWithShareInfo:shareInfo complete:callback];
}

- (void)loginAction:(NSNotification *)noti
{
    [self login];
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

- (void)initWithClientID:(NSString *)clientID redirectURI:(NSString *)redirectURI{
    self.clientID = clientID;
    self.redirectURI = redirectURI;
}

/**
 * Reddit登录
 */
- (void)login {
    self.authOrShareType = RXRedditAuth;
    
    [RXToolKit sharedSDK].webViewDelegate = self;
    
    self.randomLoginState = [self generateRandomString:6];
//    @[@"identity", @"edit", @"flair", @"history", @"modconfig", @"modflair", @"modlog", @"modposts", @"modwiki", @"mysubreddits", @"privatemessages", @"read", @"report", @"save", @"submit", @"subscribe", @"vote", @"wikiedit", @"wikiread"]
    
    NSString *scopeString = [scopeArray componentsJoinedByString:@","];
    NSString *authorizationURLString = redditLoginWebUrl(self.clientID, self.randomLoginState, self.redirectURI, scopeString);
    dispatch_async(dispatch_get_main_queue(), ^{
        [[RXToolKit sharedSDK] openWebView:authorizationURLString];
    });
}

#pragma mark - reddit本地获取accesstoken后的分享

/**
 * reddit 分享
 */
- (void)shareWithShareInfo:(NSDictionary *)shareInfo
                  complete:(RequestComplete)complete{
    self.shareContent = [RXCustomShareConfig shareConfigWithShareInfo:shareInfo];
    
    RXRedditShareType shareType = RXRedditShareTypeUrl;
    if ([self.shareContent.materialType isEqualToString:@"text"]) {
        shareType = RXRedditShareTypeText;
        
        [self sendShareTypeWithType:shareType title:self.shareContent.title url:@"" text:self.shareContent.content sr:@"" completion:^(NSDictionary * _Nonnull response, NSDictionary * _Nonnull error) {
            if (!error) {
                if (complete) {
                    complete(response, nil);
                }
            }else{
                if (complete) {
                    RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
                    err.responesObject = error;
                    complete(nil, err);
                }
            }
        }];
        
    } else if ([self.shareContent.materialType isEqualToString:@"link"]) {
        [self sendShareTypeWithType:shareType title:self.shareContent.title url:self.shareContent.url text:@"" sr:@"" completion:^(NSDictionary * _Nonnull response, NSDictionary * _Nonnull error) {
            if (!error) {
                if (complete) {
                    complete(response, nil);
                }
            }else{
                if (complete) {
                    RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
                    err.responesObject = error;
                    complete(nil, err);
                }
            }
        }];
    }
        
}


- (void)sendShareTypeWithType:(RXRedditShareType)type
                        title:(NSString *)title
                          url:(NSString *)url
                         text:(NSString *)text
                           sr:(NSString *)srString
                   completion:(void (^)(NSDictionary *response, NSDictionary *error))completion{
    self.resultBlock = completion;
    self.shareType = type;
    self.title = title;
    self.text = text;
    self.url = url;
    self.sr = srString;
    self.authOrShareType = RXRedditShare;
    
    __weak typeof(self) weakSelf = self;
    [[RXRedditAuthManager sharedSDK] checkAccessTokenAndModHashWithCompletion:^(BOOL isNeedLogin, NSString * _Nonnull accesstoken, NSDictionary * _Nonnull errorDic) {
        __strong typeof(weakSelf) strongSelf = weakSelf;
        if (strongSelf) {
            if (errorDic == nil) {
                if (isNeedLogin) {//需登录授权后分享
                    [strongSelf shareLogin];
                    
                }else{//获取modhash直接分享
                    [strongSelf realSendShareTypeWithType:self.shareType title:self.title url:self.url text:self.text sr:self.sr assesToken:accesstoken];
                }
            }else{//获取token失败
                NSMutableDictionary *failDic = [NSMutableDictionary dictionary];
                [failDic setValue:@(RXShareError_third) forKey:@"code"];
                [failDic setValue:@"获取本地存储token失败" forKey:@"msg"];
                NSDictionary *successDic = nil;
                if (strongSelf.resultBlock) {
                    strongSelf.resultBlock(successDic, failDic);
                }
            }
        }
        
    }];
    
}

//分享时调用登录
- (void)shareLogin {
    [RXToolKit sharedSDK].webViewDelegate = self;
    
    self.randomLoginState = [self generateRandomString:6];
    NSString *scopeString = [scopeArray componentsJoinedByString:@","];
    NSString *authorizationURLString = redditLoginWebUrl(self.clientID, self.randomLoginState, self.redirectURI, scopeString);
    dispatch_async(dispatch_get_main_queue(), ^{
        [[RXToolKit sharedSDK] openWebView:authorizationURLString];
    });
}

//调用分享方法
- (void)realSendShareTypeWithType:(RXRedditShareType)type
                        title:(NSString *)title
                          url:(NSString *)url
                         text:(NSString *)text
                           sr:(NSString *)srString
                   assesToken:(NSString *)accessToken{
    
    NSString *bodyString = @"";
    NSString *shareType = @"";
    if (type == RXRedditShareTypeUrl) {//url类型，文本必须为空
        shareType = @"link";
        text = @"";
//       eg. sr programming
        bodyString = [NSString stringWithFormat:@"title=%@&url=%@&kind=%@&sr=%@", title, url, shareType, srString];
    }else{//文本类型，url必须为空
        shareType = @"self";
        url = @"";
        bodyString = [NSString stringWithFormat:@"title=%@&text=%@&kind=%@&sr=%@", title, text, shareType, srString];
    }
    
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:redditShareUrl]];
    request.HTTPMethod = @"POST";
    // 设置请求头
    [request setValue:@"application/x-www-form-urlencoded" forHTTPHeaderField:@"Content-Type"];
    // 设置用户凭证
    [request setValue:[NSString stringWithFormat:@"bearer %@", accessToken] forHTTPHeaderField:@"Authorization"];
    [request setValue:@"reixue" forHTTPHeaderField:@"User-Agent"];

    // 设置请求体数据
    [request setHTTPBody:[bodyString dataUsingEncoding:NSUTF8StringEncoding]];

    // 发送请求
    __weak typeof(self) weakSelf = self;
    NSURLSession *session = [NSURLSession sharedSession];
    NSURLSessionDataTask *task = [session dataTaskWithRequest:request completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
        __strong typeof(weakSelf) strongSelf = weakSelf;
        if (strongSelf) {
            if (error == nil) {
                NSDictionary *responseDict = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingMutableContainers error:nil];
                BOOL ret = responseDict[@"success"];
                
                if (ret) {//分享成功
                    NSMutableDictionary *successDic = [NSMutableDictionary dictionary];
                    [successDic setValue:@(0) forKey:@"code"];
                    [successDic setValue:@"分享成功" forKey:@"msg"];
                    NSDictionary *failDic = nil;
                    if (strongSelf.resultBlock) {
                        strongSelf.resultBlock(successDic, failDic);
                    }
                    
                }else{
                    NSArray *jqueryArray = responseDict[@"jquery"];
                    NSArray *resultArray = [[jqueryArray objectAtIndex:jqueryArray.count - 3] lastObject];
                    NSString *errorString = [resultArray lastObject];
                    NSMutableDictionary *failDic = [NSMutableDictionary dictionary];
                    [failDic setValue:@(RXShareError_default) forKey:@"code"];
                    [failDic setValue:errorString forKey:@"msg"];
                    
                    NSDictionary *successDic = nil;
                    if (strongSelf.resultBlock) {
                        strongSelf.resultBlock(successDic, failDic);
                    }
                }
            }else{//分享失败
                NSDictionary *successDic = nil;
                NSMutableDictionary *failDic = [NSMutableDictionary dictionary];
                [failDic setValue:@(RXShareError_third) forKey:@"code"];
                [failDic setValue:@"submit request failed" forKey:@"msg"];
                if (strongSelf.resultBlock) {
                    strongSelf.resultBlock(successDic, failDic);
                }
            }
        }
    }];
    [task resume];
    
}

#pragma mark - 其他方法
///生成随机字符串
- (NSString *)generateRandomString:(int)length {
    NSString *letters = @"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    NSMutableString *randomString = [NSMutableString stringWithCapacity:length];
    for (int i = 0; i < length; i++) {
        NSUInteger index = arc4random_uniform((uint32_t)[letters length]);
        [randomString appendFormat:@"%C", [letters characterAtIndex:index]];
    }
    return randomString;
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
    if ([urlStr hasPrefix:self.redirectURI]) {
        NSDictionary *redditSchemeParams = [self fetchWebViewSchemes:urlStr];
        
        if ([urlStr containsString:@"error"]) {//获取token失败
            NSString *errorValue = redditSchemeParams[@"error"];
            if (errorValue.length == 0) {
                errorValue = @"reddit unknown error";
            }
            
            if (self.authOrShareType == RXRedditShare) {
                NSMutableDictionary *failDic = [NSMutableDictionary dictionary];
                if ([errorValue containsString:@"please login"]) {
                    [failDic setValue:@(RXLoginError_third) forKey:@"code"];
                    [failDic setValue:errorValue forKey:@"msg"];
                }else{
                    [failDic setValue:@(RXShareError_third) forKey:@"code"];
                    [failDic setValue:errorValue forKey:@"msg"];
                }
                NSDictionary *successDic = nil;
                if (self.resultBlock) {
                    self.resultBlock(successDic, failDic);
                }
                
                [[RXToolKit sharedSDK] closeWebView];
                
            }else{//登录失败
                RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
                NSMutableDictionary *errorRes = [NSMutableDictionary dictionary];
                [errorRes setValue:[RXErrorTool getRXErrorMsg:RXLoginError_third] forKey:@"msg"];
                [errorRes setValue:@(RXLoginError_third) forKey:@"code"];
    //            [errorRes setValue:@(resp.errCode) forKey:@"thirdcode"];
                [errorRes setValue:errorValue forKey:@"thirdmsg"];
                err.responesObject = errorRes;
                
                if ([RXService sharedSDK].loginDelegate && [[RXService sharedSDK].loginDelegate respondsToSelector:@selector(rx_LoginCallBackWithResponse:error:)]) {
                    [[RXService sharedSDK].loginDelegate rx_LoginCallBackWithResponse:nil error:err];
                    [[RXToolKit sharedSDK] closeWebView];
                    
                    [[RXPrivateService sharedSDK] postLoginError:errorRes loginType:LoginTypeInstagram];
                }
                
                [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                               bodyDic:@{}
                                                                action:@"rxlog_error_login"
                                                                   url:@""
                                                                  code:err.responesObject[@"code"] == nil ? -123 : [err.responesObject[@"code"] integerValue]
                                                                   msg:err.responesObject[@"msg"]
                                                             thirdType:@"reddit"
                                                             thirdcode:err.responesObject[@"thirdcode"] == nil ? -123 : [err.responesObject[@"thirdcode"] integerValue]
                                                              thirdmsg:err.responesObject[@"thirdmsg"]
                                                               traceid:@""];
            }
            
        }else{
            if ([redditSchemeParams[@"state"] isEqualToString:self.randomLoginState]) {//获取token成功
                NSString *access_token = redditSchemeParams[@"access_token"];
                NSString *expires_in = redditSchemeParams[@"expires_in"];
                
                if (self.authOrShareType == RXRedditShare) {//分享
                    //存储accesstoken和过期时间
                    [[RXRedditAuthManager sharedSDK] saveAccessToken:access_token expires_inSeconds:expires_in operationType:1];
                    
                }else{//传给后台走第三方登录流程
                    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
                    [dic setValue:access_token forKey:@"access_token"];
                    [dic setValue:self.clientID forKey:@"client_id"];
                    [dic setValue:self.redirectURI forKey:@"redirect_uri"];
                    [dic setValue:@"reddit" forKey:@"method"];
                    
                    [[RXService sharedSDK] loginWithExtDic:dic username:nil password:nil sign_fields:nil loginType:LoginTypeDefault migrate_args:nil];
                    //存储accesstoken和过期时间
                    [[RXRedditAuthManager sharedSDK] saveAccessToken:access_token expires_inSeconds:expires_in operationType:0];
                    
                }
//                dispatch_async(dispatch_get_main_queue(), ^{
                    [[RXToolKit sharedSDK] closeWebView];
//                });
                
            }else{//state不匹配，失败
                NSString *errorValue = @"state mismatch";
                
                if (self.authOrShareType == RXRedditShare) {
                    NSMutableDictionary *failDic = [NSMutableDictionary dictionary];
                    [failDic setValue:@(RXLoginError_third) forKey:@"code"];
                    [failDic setValue:errorValue forKey:@"msg"];
                    NSDictionary *successDic = nil;
                    if (self.resultBlock) {
                        self.resultBlock(successDic, failDic);
                    }
                    [[RXToolKit sharedSDK] closeWebView];
                    
                }else{
                    RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
                    NSMutableDictionary *errorRes = [NSMutableDictionary dictionary];
                    [errorRes setValue:[RXErrorTool getRXErrorMsg:RXLoginError_third] forKey:@"msg"];
                    [errorRes setValue:@(RXLoginError_third) forKey:@"code"];
        //            [errorRes setValue:@(resp.errCode) forKey:@"thirdcode"];
                    [errorRes setValue:errorValue forKey:@"thirdmsg"];
                    err.responesObject = errorRes;
                    
                    if ([RXService sharedSDK].loginDelegate && [[RXService sharedSDK].loginDelegate respondsToSelector:@selector(rx_LoginCallBackWithResponse:error:)]) {
                        [[RXService sharedSDK].loginDelegate rx_LoginCallBackWithResponse:nil error:err];
                        [[RXToolKit sharedSDK] closeWebView];
                        
                        [[RXPrivateService sharedSDK] postLoginError:errorRes loginType:LoginTypeInstagram];
                    }
                    
                    [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                                   bodyDic:@{}
                                                                    action:@"rxlog_error_login"
                                                                       url:@""
                                                                      code:err.responesObject[@"code"] == nil ? -123 : [err.responesObject[@"code"] integerValue]
                                                                       msg:err.responesObject[@"msg"]
                                                                 thirdType:@"reddit"
                                                                 thirdcode:err.responesObject[@"thirdcode"] == nil ? -123 : [err.responesObject[@"thirdcode"] integerValue]
                                                                  thirdmsg:err.responesObject[@"thirdmsg"]
                                                                   traceid:@""];
                }
            }
        }
    }
    
}

- (void)rx_closeWebView
{
    if (self.authOrShareType == RXRedditShare){//分享
        NSDictionary *successDic = nil;
        NSMutableDictionary *failDic = [NSMutableDictionary dictionary];
        [failDic setValue:@(RXShareError_cancel) forKey:@"code"];
        [failDic setValue:[RXErrorTool getRXErrorMsg:RXShareError_cancel] forKey:@"msg"];
        if (self.resultBlock) {
            self.resultBlock(successDic, failDic);
        }
    }else{//登录
        RX_CommonRequestError *err =[[RX_CommonRequestError alloc] init];
        NSMutableDictionary *errorRes =[NSMutableDictionary dictionary];
        [errorRes setValue:[RXErrorTool getRXErrorMsg:RXLoginError_cancel] forKey:@"msg"];
        [errorRes setValue:@(RXLoginError_cancel) forKey:@"code"];
        err.responesObject = errorRes;
        
        if([RXService sharedSDK].loginDelegate && [[RXService sharedSDK].loginDelegate respondsToSelector:@selector(rx_LoginCallBackWithResponse:error:)]){
            [[RXService sharedSDK].loginDelegate rx_LoginCallBackWithResponse:nil error:err];
        }
        [[RXPrivateService sharedSDK] postLoginError:errorRes loginType:LoginTypeInstagram];
        
        [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                       bodyDic:@{}
                                                        action:@"rxlog_error_login"
                                                           url:@""
                                                          code:err.responesObject[@"code"] == nil ? -123 : [err.responesObject[@"code"] integerValue]
                                                           msg:err.responesObject[@"msg"]
                                                     thirdType:@"reddit"
                                                     thirdcode:err.responesObject[@"thirdcode"] == nil ? -123 : [err.responesObject[@"thirdcode"] integerValue]
                                                      thirdmsg:err.responesObject[@"thirdmsg"]
                                                       traceid:@""];
    }
}

#pragma mark - 处理 webView scheme 的特殊情况，有#分割的http://abc/#accesstoken=....
- (NSDictionary *)fetchWebViewSchemes:(NSString *)url
{
    NSString *resultString = @"";
    NSRange range = [url rangeOfString:@"#"];
    if ((range.location != NSNotFound) && [url containsString:@"#access_token"]) {
        resultString = [url stringByReplacingCharactersInRange:range withString:@"?"];
    }else{
        resultString = url;
    }
    
    NSMutableDictionary *resDic = [NSMutableDictionary dictionary];
    NSArray *schemes = [resultString componentsSeparatedByString:@"?"];
    
    if (schemes.count >= 1) {
        NSString *schemeStr = [schemes lastObject];
        
        NSArray *subSchemes = [schemeStr componentsSeparatedByString:@"&"];
        
        for (int i = 0; i < subSchemes.count; i++) {
            NSString *subParam = subSchemes[i];
            NSArray *subParams = [subParam componentsSeparatedByString:@"="];
            
            if (subParams.count > 1) {
                NSString *key = [NSString stringWithFormat:@"%@", subParams[0]];
                NSString *value = [NSString stringWithFormat:@"%@", subParams[1]];
                
                [resDic setValue:value forKey:key];
            }
        }
    }
    
    return resDic.copy;
}

@end
