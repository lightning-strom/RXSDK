//
//  RXSnapChatService.m
//  RXSnapChatSDK
//
//  Created by 陈汉 on 2024/4/3.
//

#import "RXSnapChatService.h"
#import "RXSnapChatTool.h"
#import <SCSDKLoginKit/SCSDKLoginKit.h>
#import <SCSDKCreativeKit/SCSDKCreativeKit.h>
#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXSDK_Pure/NSObject+RXAddition.h>
#import <RXPublicToolKit/RXPublicToolKit.h>
#import <RXSDK_Pure/RXNotificationCenter.h>
#import <RXSDK_Pure/RXSubPackage.h>

@implementation RXSnapChatService

static RXSnapChatService *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXSnapChatService alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        [RXSubPackage sharedSDK].aSnapchat = YES;
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(shareAction:) name:rxUserDefault_share_snapchat object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(loginAction:) name:rxUserDefault_login_snapchat object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(openUrlAction:) name:rxUserDefault_openurl object:nil];
    }
    return self;
}

#pragma mark -- 生命周期
- (void)openUrlAction:(NSNotification *)noti
{
    UIApplication *app = noti.userInfo[@"app"];
    NSURL *url = noti.userInfo[@"url"];
    NSDictionary *options = noti.userInfo[@"options"];
    
    [self application:app openURL:url options:options];
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

- (void)regist
{
    NSLog(@"RXSnapChatSDK 初始化成功");
}

/**
 * 处理跳转参数 openUrl 方式
 */
- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey, id> *)options
{
    return [SCSDKLoginClient application:application openURL:url options:options];
}

/**
 * 登录
 */
- (void)login
{
    [SCSDKLoginClient loginFromViewController:[RXSnapChatTool currentViewController]
                                   completion:^(BOOL success, NSError * _Nullable error) {
        if (success) {
            [self fetchUserData];
        } else {
            RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
            
            NSMutableDictionary *errorRes = [NSMutableDictionary dictionary];
            [errorRes setValue:[RXErrorTool getRXErrorMsg:RXLoginError_third] forKey:@"msg"];
            [errorRes setValue:@(RXLoginError_third) forKey:@"code"];
            [errorRes setValue:@(error.code) forKey:@"thirdcode"];
            [errorRes setValue:error.localizedDescription forKey:@"thirdmsg"];
            err.responesObject = errorRes;

            if ([RXService sharedSDK].loginDelegate && [[RXService sharedSDK].loginDelegate respondsToSelector:@selector(rx_LoginCallBackWithResponse:error:)]) {
                [[RXService sharedSDK].loginDelegate rx_LoginCallBackWithResponse:nil error:err];
            }
            
            [[RXPrivateService sharedSDK] postLoginError:errorRes loginType:LoginTypeInstagram];
            
            [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                           bodyDic:@{}
                                                            action:@"rxlog_error_login"
                                                               url:@""
                                                              code:err.responesObject[@"code"] == nil ? -123 : [err.responesObject[@"code"] integerValue]
                                                               msg:err.responesObject[@"msg"]
                                                         thirdType:@"snapchat"
                                                         thirdcode:err.responesObject[@"thirdcode"] == nil ? -123 : [err.responesObject[@"thirdcode"] integerValue]
                                                          thirdmsg:err.responesObject[@"thirdmsg"]
                                                           traceid:@""];
        }
    }];
}

- (void)fetchUserData {
    SCSDKUserDataQueryBuilder *builder = [[[SCSDKUserDataQueryBuilder alloc] init] withExternalId];
    SCSDKUserDataQuery *userDataQuery = [builder build];

    [SCSDKLoginClient fetchAccessToken:^(NSString * _Nullable accessToken, NSError * _Nullable error) {
        if (!error) {
            NSMutableDictionary *dic = [NSMutableDictionary dictionary];
            [dic setValue:accessToken forKey:@"access_token"];
            
            [[RXService sharedSDK] loginWithExtDic:dic username:nil password:nil sign_fields:nil loginType:LoginTypeDefault migrate_args:nil];
        } else {
            RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
            
            NSMutableDictionary *errorRes = [NSMutableDictionary dictionary];
            [errorRes setValue:[RXErrorTool getRXErrorMsg:RXLoginError_third] forKey:@"msg"];
            [errorRes setValue:@(RXLoginError_third) forKey:@"code"];
            [errorRes setValue:@(error.code) forKey:@"thirdcode"];
            [errorRes setValue:error.localizedDescription forKey:@"thirdmsg"];
            err.responesObject = errorRes;

            if ([RXService sharedSDK].loginDelegate && [[RXService sharedSDK].loginDelegate respondsToSelector:@selector(rx_LoginCallBackWithResponse:error:)]) {
                [[RXService sharedSDK].loginDelegate rx_LoginCallBackWithResponse:nil error:err];
            }
            
            [[RXPrivateService sharedSDK] postLoginError:errorRes loginType:LoginTypeInstagram];
            
            [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                           bodyDic:@{}
                                                            action:@"rxlog_error_login"
                                                               url:@""
                                                              code:err.responesObject[@"code"] == nil ? -123 : [err.responesObject[@"code"] integerValue]
                                                               msg:err.responesObject[@"msg"]
                                                         thirdType:@"snapchat"
                                                         thirdcode:err.responesObject[@"thirdcode"] == nil ? -123 : [err.responesObject[@"thirdcode"] integerValue]
                                                          thirdmsg:err.responesObject[@"thirdmsg"]
                                                           traceid:@""];
        }
        
    }];
    
    [SCSDKLoginClient fetchUserDataWithQuery:userDataQuery success:^(SCSDKUserData * _Nullable userData, NSError * _Nullable partialError) {
        NSString *externalId = userData.externalID;
    } failure:^(NSError * _Nullable error, BOOL isUserLoggedOut) {
        NSLog(@"");
    }];
}

/**
 * 分享
 */
- (void)shareWithShareInfo:(NSDictionary *)shareInfo
                  complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    RXCustomShareConfig *shareContent = [RXCustomShareConfig shareConfigWithShareInfo:shareInfo];
    
    if ([shareContent.materialType isEqualToString:@"image"]) { // 单图
        if ([shareContent.image isKindOfClass:[NSString class]] && [[shareContent.image substringToIndex:4] containsString:@"http"]) {
            __block UIImage *shareImg = [[UIImage alloc] init];
            [RXSnapChatTool downImage:[shareContent.image stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding] complete:^(NSData *imgData) {
                if (shareContent.url && shareContent.url.length > 0) {
                    NSString *shareUrl = shareContent.url;
                    UIImage *qrCodeImg = [RXToolKit rxQRCodeForString:shareUrl size:CGSizeMake(shareContent.width, shareContent.height) fillColor:[UIColor blackColor] iconImage:nil];
                    UIImage *bgView = [UIImage imageWithData:imgData];
                    CGFloat fixelW = CGImageGetWidth(bgView.CGImage);
                    CGFloat fixelH = CGImageGetHeight(bgView.CGImage);
                    UIImageView *shareImgView = [[UIImageView alloc] initWithFrame:CGRectMake(0, 0, fixelW, fixelH)];
                    shareImgView.image = bgView;
                    UIImageView *qrCodeImgView = [[UIImageView alloc] initWithFrame:CGRectMake(shareContent.x, shareContent.y, shareContent.width, shareContent.height)];
                    qrCodeImgView.image = qrCodeImg;
                    [shareImgView addSubview:qrCodeImgView];
                    
                    shareImg = [RXToolKit makeImageWithView:shareImgView withSize:shareImgView.frame.size];
                } else {
                    shareImg = [UIImage imageWithData:imgData];
                }
                [self shareWithImage:shareImg complete:complete];
            }];
        } else {
            UIImage *shareImg = [UIImage imageWithContentsOfFile:shareContent.image];
            [self shareWithImage:shareImg complete:complete];
        }
    } else if ([shareContent.materialType isEqualToString:@"video"]) { // 视频
        if ([shareContent.video isKindOfClass:[NSString class]] && [[shareContent.video substringToIndex:4] containsString:@"http"]) {
            
            dispatch_queue_t queue = dispatch_queue_create(@"com.RXSnapChatSDK", DISPATCH_QUEUE_CONCURRENT);
            dispatch_async(queue, ^{
                [self shareWithVideoUrl:shareContent.video complete:complete];
            });
        }
    }
}

- (void)shareWithImage:(UIImage *)image
              complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    SCSDKSnapPhoto *photo = [[SCSDKSnapPhoto alloc] initWithImage:image];
    SCSDKPhotoSnapContent *content = [[SCSDKPhotoSnapContent alloc] initWithSnapPhoto:photo];
    SCSDKSnapAPI *snapApi = [[SCSDKSnapAPI alloc] initWithContent:content];

    [snapApi startSnappingWithCompletionHandler:^(NSError * _Nullable error) {
        if (!error) {
            if (complete) {
                complete(@{@"code" : @(0)}, nil);
            }
        } else {
            RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
            
            NSMutableDictionary *errorRes = [NSMutableDictionary dictionary];
            [errorRes setValue:[RXErrorTool getRXErrorMsg:RXShareError_third] forKey:@"msg"];
            [errorRes setValue:@(RXShareError_third) forKey:@"code"];
            [errorRes setValue:@(error.code) forKey:@"thirdcode"];
            [errorRes setValue:error.localizedDescription forKey:@"thirdmsg"];
            err.responesObject = errorRes;
            
            if (complete) {
                complete(nil, err);
            }
        }
    }];
}

- (void)shareWithVideoUrl:(NSString *)videoUrl
                 complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    SCSDKSnapVideo *video = [[SCSDKSnapVideo alloc] initWithVideoUrl:[NSURL URLWithString:videoUrl]];
    SCSDKVideoSnapContent *content = [[SCSDKVideoSnapContent alloc] initWithSnapVideo:video];
    SCSDKSnapAPI *snapApi = [[SCSDKSnapAPI alloc] initWithContent:content];


    [snapApi startSnappingWithCompletionHandler:^(NSError * _Nullable error) {
        if (!error) {
            if (complete) {
                complete(@{@"code" : @(0)}, nil);
            }
        } else {
            RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
            
            NSMutableDictionary *errorRes = [NSMutableDictionary dictionary];
            [errorRes setValue:[RXErrorTool getRXErrorMsg:RXShareError_third] forKey:@"msg"];
            [errorRes setValue:@(RXShareError_third) forKey:@"code"];
            [errorRes setValue:@(error.code) forKey:@"thirdcode"];
            [errorRes setValue:error.localizedDescription forKey:@"thirdmsg"];
            err.responesObject = errorRes;
            
            if (complete) {
                complete(nil, err);
            }
        }
    }];
}

@end
