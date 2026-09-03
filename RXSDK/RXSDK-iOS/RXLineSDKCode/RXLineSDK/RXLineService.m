//
//  RXLineService.m
//  RXLineSDK
//
//  Created by 陈汉 on 2023/3/8.
//

#import "RXLineService.h"
#import <LineSDK/LineSDK.h>
#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXSDK_Pure/RXNotificationCenter.h>
#import <RXSDK_Pure/RXSubPackage.h>

#define PermissonsKey @"noti_linePermissions"

typedef void(^CallBack)(NSDictionary *response, RX_CommonRequestError *error);

@interface RXLineService () <LineSDKLoginDelegate>

@property (nonatomic, strong) NSArray *sign_fields;
@property (nonatomic, copy) id migrate_args;
@property (nonatomic, assign) BOOL isSyncInfo;
@property (nonatomic, copy) CallBack syncCallBack;

@end

@implementation RXLineService

static RXLineService *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXLineService alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        [LineSDKLogin sharedInstance].delegate = self;
        [RXSubPackage sharedSDK].aLine = YES;
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(shareAction:) name:rxUserDefault_share_line object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(loginAction:) name:rxUserDefault_login_line object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(syncAction:) name:rxUserDefault_osui_sync_line object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(openUrlAction:) name:rxUserDefault_openurl object:nil];
    }
    return self;
}

#pragma mark -- 生命周期
- (void)openUrlAction:(NSNotification *)noti
{
    NSURL *url = noti.userInfo[@"url"];
    
    [self handleOpenURL:url];
}

#pragma mark -- from main framework
- (void)shareAction:(NSNotification *)noti
{
    NSDictionary *shareInfo = noti.userInfo[@"shareInfo"];
    RequestComplete callback = noti.userInfo[@"callback"];
    
    [self shareWithContent:shareInfo[@"content"] url:shareInfo[@"url"] complete:callback];
}

- (void)loginAction:(NSNotification *)noti
{
    @try {
        NSArray *permissions = noti.userInfo[@"permissions"];
        id migrateArgs = noti.userInfo[@"migrateArgs"];
        NSArray *signFields = noti.userInfo[@"signFields"];
        
        [self loginWithPermissions:permissions sign_fields:signFields migrate_args:migrateArgs];
    } @catch (NSException *exception) {
        NSLog(@"%@", exception);
    } @finally {
        
    }
}

- (void)syncAction:(NSNotification *)noti
{
    @try {
        RequestComplete callback = noti.userInfo[@"callback"];
        [self syncInfoWithComplete:callback];
    } @catch (NSException *exception) {
        NSLog(@"%@", exception);
    } @finally {
        
    }
}

- (void)regist
{
    NSLog(@"RXLineSDK 初始化成功");
}

/**
 * 开始登录
 * @param permissions 获取的权限数组
 * @param sign_fields 指定对登录成功后返回的特定字段, 使用 CPKEY 计算签名. CP 服务器可重新计算签名并与登录返回的签名比对, 作为对瑞雪登录数据的校验. 支持的字段包括: nickname, avatar, openid, region, sex, age, 计算签名的逻辑会对指定字段进行排序, 此处传参与顺序无关。类型为字符串数组 @[@"nickname",@"avatar"]  非必须
 * @param migrate_args 任意合法的 json 类型, 比如 string, number，账号迁移用的参数, 调用 CP account-query 及 account-queryandbind 接口时透传给 CP  非必须
 */
- (void)loginWithPermissions:(nonnull NSArray <NSString *>*)permissions
                 sign_fields:(NSArray * _Nullable)sign_fields
                migrate_args:(id _Nullable)migrate_args
{
    self.isSyncInfo = NO;
    [[NSUserDefaults standardUserDefaults] setValue:permissions forKey:PermissonsKey];
    
    self.sign_fields = sign_fields;
    self.migrate_args = migrate_args;
    
    [[LineSDKLogin sharedInstance] startLoginWithPermissions:permissions];
}

/**
 * 处理跳转
 */
- (BOOL)handleOpenURL:(NSURL *)url
{
    return [[LineSDKLogin sharedInstance] handleOpenURL:url];
}

- (void)didLogin:(LineSDKLogin *)login credential:(LineSDKCredential *)credential profile:(LineSDKProfile *)profile error:(NSError *)error
{
    if (error) {
        [[NSNotificationCenter defaultCenter] postNotificationName:@"noti_LoginFail" object:nil userInfo:@{@"error" : error}];
        [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                       bodyDic:@{}
                                                        action:@"rxlog_error_login"
                                                           url:@""
                                                          code:-123
                                                           msg:@""
                                                     thirdType:@"line"
                                                     thirdcode:error.code
                                                      thirdmsg:error.description
                                                       traceid:@""];
    } else {
        
        // Login success. Extracts the access token, user profile ID, display name, status message, and profile picture.
        NSString *accessToken = credential.accessToken.accessToken;
        NSString *userID = profile.userID;
        NSString *displayName = profile.displayName;
        NSString *statusMessage = profile.statusMessage;
        NSURL *pictureURL = profile.pictureURL;
        
        NSString *pictureUrlString;
        
        // If the user doesn't have a profile picture set, pictureURL will be nil
        if (pictureURL) {
            pictureUrlString = profile.pictureURL.absoluteString;
        }
        
        NSMutableDictionary *dic = [NSMutableDictionary dictionary];
        [dic setValue:accessToken forKey:@"access_token"];
        
        if (self.isSyncInfo) {
            [[RXApiService sharedSDK] syncInfoWithParams:dic complete:self.syncCallBack];
        } else {
            [[RXService sharedSDK] loginWithExtDic:dic username:@"" password:@"" sign_fields:self.sign_fields loginType:LoginTypeLine migrate_args:self.migrate_args];
        }
    }
}

/**
 * Line 分享
 * @param content 分享描述
 * @param url 分享链接
 */
- (void)shareWithContent:(NSString *)content
                     url:(NSString *)url
                complete:(RequestComplete)complete
{
//    if (![[UIApplication sharedApplication] canOpenURL:[NSURL URLWithString:@"line://"]]) {
//     
//        RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
//        
//        NSString *errorMsg = [RXErrorTool getRXErrorMsg:RXLimitError_noApp];
//        
//        NSMutableDictionary *errorRes = [NSMutableDictionary dictionary];
//        [errorRes setValue:errorMsg forKey:@"msg"];
//        [errorRes setValue:@(RXShareError_cancel) forKey:@"code"];
//        err.responesObject = errorRes;
//        
//        if (complete) {
//            complete(nil, err);
//        }
//        
//        return;
//    }
    
    NSString *shareMsg = @"";
    
    if (content && content.length > 0) {
        shareMsg = content;
        
        if (url && url.length > 0) {
            shareMsg = [NSString stringWithFormat:@"%@\n%@", content, url];
        }
    } else {
        if (url && url.length > 0) {
            shareMsg = [NSString stringWithFormat:@"%@", url];
        }
    }
    
    if (url && url.length > 0) {
        NSString *contentKey = (__bridge NSString *)CFURLCreateStringByAddingPercentEscapes(NULL,
                                                                                            
                                                                                            (CFStringRef)shareMsg,
                                                                                            
                                                                                            NULL,
                                                                                            
                                                                                            (CFStringRef)@"!*'();:@&=+$,/?%#[]",
                                                                                            
                                                                                            kCFStringEncodingUTF8);
        
        NSString *contentType = @"text";
        
        NSString *urlString = [NSString stringWithFormat:@"line://msg/%@/%@",
                               
                               contentType, contentKey];
        
        if ([[UIApplication sharedApplication] openURL:[NSURL URLWithString:urlString]]) {
            
        } else {
            RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
            
            NSString *errorMsg = [RXErrorTool getRXErrorMsg:RXLimitError_noApp];
            
            NSMutableDictionary *errorRes = [NSMutableDictionary dictionary];
            [errorRes setValue:errorMsg forKey:@"msg"];
            [errorRes setValue:@(RXError_default) forKey:@"code"];
            err.responesObject = errorRes;
            
            if (complete) {
                complete(nil, err);
            }
        }
        
    } else {
        NSLog(@"缺少链接");
    }
    
    if (complete) {
        complete(@{@"code" : @(0)}, nil);
    }
}

/**
 * 同步信息
 * 调用后会跳转到Line授权登录，但不会走登录回调，同步信息通过此接口回调
 */
- (void)syncInfoWithComplete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    self.isSyncInfo = YES;
    self.syncCallBack = complete;
    
    NSArray *permissions = [[NSUserDefaults standardUserDefaults] valueForKey:PermissonsKey];
    
    [[LineSDKLogin sharedInstance] startLoginWithPermissions:permissions];
}

/**
 * 检测line是否安装
 */
- (BOOL)checkLineIsInstall
{
    NSURL *url = [NSURL URLWithString:@"line://"];

    if ([[UIApplication sharedApplication] canOpenURL:url]){
        return YES;
    } else {
        return NO;
    }
}

@end
