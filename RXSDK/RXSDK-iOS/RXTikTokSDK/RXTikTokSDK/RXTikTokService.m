//
//  RXTikTokService.m
//  RXTikTokSDK
//
//  Created by 陈汉 on 2023/7/29.
//

#import "RXTikTokService.h"
#import <TikTokOpenSDK/TikTokOpenSDKApplicationDelegate.h>
#import <TikTokOpenSDK/TikTokOpenSDKShare.h>
#import <TikTokOpenSDK/TikTokOpenSDKAuth.h>
#import <TikTokOpenAuthSDK/TikTokOpenAuthSDK-Swift.h>
#import <Photos/Photos.h>
#import <RXPublicToolKit/RXPublicToolKit.h>
#import <RXSDK_Pure/NSObject+RXAddition.h>
#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXSDK_Pure/RXNotificationCenter.h>
#import <RXSDK_Pure/RXSubPackage.h>

@interface RXTikTokService ()

@property (nonatomic, assign) NSInteger saveCount;
@property (nonatomic, assign) NSInteger mediaCount;
@property (nonatomic, strong) RXCustomShareConfig *shareContent;

@end

@implementation RXTikTokService

static RXTikTokService *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXTikTokService alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        self.saveCount = 0;
        [RXSubPackage sharedSDK].aTikTok = YES;
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(shareAction:) name:rxUserDefault_share_tiktok object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(loginAction:) name:rxUserDefault_login_tiktok object:nil];
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
    
    [self TTApplication:app openURL:url options:options];
}

#pragma mark -- from main framework
- (void)shareAction:(NSNotification *)noti
{
    NSDictionary *shareInfo = noti.userInfo[@"shareInfo"];
    RequestComplete callback = noti.userInfo[@"callback"];
    
    [self shareWithShareInfo:shareInfo complete:callback];
}

- (void)loginAction:(NSNotification *)noti
{
    [self login];
}

/**
 * 注册TikTok
 */
- (void)TTRegistWithApplication:(UIApplication *)application
                  launchOptions:(NSDictionary *)launchOptions
{
    [[TikTokOpenSDKApplicationDelegate sharedInstance] application:application didFinishLaunchingWithOptions:launchOptions];
}

/**
 * 处理跳转参数
 */
- (BOOL)TTApplication:(UIApplication *)application
              openURL:(NSURL *)url
              options:(NSDictionary<UIApplicationOpenURLOptionsKey, id> *)options
{
//    return [[TikTokOpenSDKApplicationDelegate sharedInstance] application:application openURL:url sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey] annotation:options[UIApplicationOpenURLOptionsAnnotationKey]];
    return [[TikTokOpenSDKApplicationDelegate sharedInstance] application:application openURL:url sourceApplication:nil annotation:nil];
}

/**
 * TikTok 登录
 */
- (void)login
{
    /* STEP 1: Create the request and set permissions */
    NSArray *scopes = @[@"user.info.basic"]; // list your scopes;
    NSOrderedSet *scopesSet = [NSOrderedSet orderedSetWithArray:scopes];
    TikTokOpenSDKAuthRequest *request = [[TikTokOpenSDKAuthRequest alloc] init];
    request.permissions = scopesSet;

    /* STEP 2: Send the request */
    __weak typeof(self) ws = self;
    [request sendAuthRequestViewController:[self currentViewController]
                    completion:^(TikTokOpenSDKAuthResponse *_Nonnull resp) {
        __strong typeof(ws) sf = ws;

        /* STEP 3: Parse and handle the response */
        if (resp.errCode == 0) {
            NSString *responseCode = resp.code;
            
            if (!responseCode || responseCode.length <= 0) {
                RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
                
                NSMutableDictionary *errorRes = [NSMutableDictionary dictionary];
                [errorRes setValue:[RXErrorTool getRXErrorMsg:RXLoginError_third] forKey:@"msg"];
                [errorRes setValue:@(RXLoginError_third) forKey:@"code"];
                [errorRes setValue:@(resp.errCode) forKey:@"thirdcode"];
                [errorRes setValue:@"OAuthCode Empty" forKey:@"thirdmsg"];
                err.responesObject = errorRes;
                
                [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                               bodyDic:@{}
                                                                action:@"rxlog_error_login"
                                                                   url:@""
                                                                  code:err.responesObject[@"code"] == nil ? -123 : [err.responesObject[@"code"] integerValue]
                                                                   msg:err.responesObject[@"msg"]
                                                             thirdType:@"tiktok"
                                                             thirdcode:err.responesObject[@"thirdcode"] == nil ? -123 : [err.responesObject[@"thirdcode"] integerValue]
                                                              thirdmsg:err.responesObject[@"thirdmsg"]
                                                               traceid:@""];

                if ([RXService sharedSDK].loginDelegate && [[RXService sharedSDK].loginDelegate respondsToSelector:@selector(rx_LoginCallBackWithResponse:error:)]) {
                    [[RXService sharedSDK].loginDelegate rx_LoginCallBackWithResponse:nil error:err];
                }
                return;
            }
            
            NSString *codeVerify = [TTKSDKCodeVerifier generateCodeVerifier];
            
            NSMutableDictionary *dic = [NSMutableDictionary dictionary];
            [dic setValue:responseCode forKey:@"code"];
            [dic setValue:codeVerify forKey:@"code_verifier"];
            [dic setValue:@"tiktok" forKey:@"method"];
            
            [[RXService sharedSDK] loginWithExtDic:dic username:nil password:nil sign_fields:nil loginType:LoginTypeDefault migrate_args:nil];
            
        } else {
            RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
            
            NSMutableDictionary *errorRes = [NSMutableDictionary dictionary];
            [errorRes setValue:[RXErrorTool getRXErrorMsg:RXLoginError_third] forKey:@"msg"];
            [errorRes setValue:@(RXLoginError_third) forKey:@"code"];
            [errorRes setValue:@(resp.errCode) forKey:@"thirdcode"];
            [errorRes setValue:resp.errString forKey:@"thirdmsg"];
            err.responesObject = errorRes;

            [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                           bodyDic:@{}
                                                            action:@"rxlog_error_login"
                                                               url:@""
                                                              code:err.responesObject[@"code"] == nil ? -123 : [err.responesObject[@"code"] integerValue]
                                                               msg:err.responesObject[@"msg"]
                                                         thirdType:@"tiktok"
                                                         thirdcode:err.responesObject[@"thirdcode"] == nil ? -123 : [err.responesObject[@"thirdcode"] integerValue]
                                                          thirdmsg:err.responesObject[@"thirdmsg"]
                                                           traceid:@""];
            
            if ([RXService sharedSDK].loginDelegate && [[RXService sharedSDK].loginDelegate respondsToSelector:@selector(rx_LoginCallBackWithResponse:error:)]) {
                [[RXService sharedSDK].loginDelegate rx_LoginCallBackWithResponse:nil error:err];
            }
        }
    }];
}

/**
 * TikTok 分享
 */
- (void)shareWithShareInfo:(NSDictionary *)shareInfo
                  complete:(RequestComplete)complete
{
    self.shareContent = [RXCustomShareConfig shareConfigWithShareInfo:shareInfo];
    
    RXTTShareType shareType = RXTTShareTypeImage;
    NSMutableArray *mediasArr = [NSMutableArray array];
    if ([self.shareContent.materialType isEqualToString:@"video"]) {
        shareType = RXTTShareTypeVideo;
    } else if ([self.shareContent.materialType isEqualToString:@"image"]) {
        [mediasArr addObject:self.shareContent.image];
    } else if ([self.shareContent.materialType isEqualToString:@"atlas"]) {
        NSArray *atlas = self.shareContent.atlas;
        for (int i = 0; i < atlas.count; i++) {
            NSDictionary *atlasDic = atlas[i];
            NSString *atlasImage = atlasDic[@"image_url"];
            if (atlasImage.length > 0) {
                [mediasArr addObject:atlasImage];
            }
        }
    }
    
    RXTTShareTypeLandedPageType pageType = RXTTShareTypeLandedPageTypePublish;
    
    [self shareWithType:shareType landedPageType:pageType hashTag:@"" medias:mediasArr complete:complete];
}

/**
 * TikTok 分享
 */
- (void)sendShareWithType:(RXTTShareType)type
           landedPageType:(RXTTShareTypeLandedPageType)landedPageType
                  hashTag:(NSString *)hasTag
         localIdentifiers:(NSArray *)localIdentifiers
                 complete:(void(^)(NSDictionary *response, NSDictionary *error))complete
{
    TikTokOpenSDKShareMediaType mediaType = TikTokOpenSDKShareMediaTypeVideo;
    if (type == RXTTShareTypeImage) {
        mediaType = TikTokOpenSDKShareMediaTypeImage;
    }
    
    TikTokOpenSDKShareRequest *req = [[TikTokOpenSDKShareRequest alloc] init];
    req.mediaType = mediaType;
    req.localIdentifiers = localIdentifiers;
    req.landedPageType = [self fetchLandedPageType:landedPageType];
    [req sendShareRequestWithCompletionBlock:^(TikTokOpenSDKShareResponse * _Nonnull Response) {
        if (Response.errCode == 0){
            NSLog(@"分享成功");
            
            if (complete) {
                NSMutableDictionary *dic = [NSMutableDictionary dictionary];
                [dic setValue:@(0) forKey:@"code"];
                complete(dic, nil);
            }
        } else {
            if (complete) {
                NSMutableDictionary *dic = [NSMutableDictionary dictionary];
                [dic setValue:@(Response.errCode) forKey:@"code"];
                [dic setValue:Response.errString forKey:@"msg"];
                complete(nil, dic);
            }
     
            NSLog(@"分享失败，错误码：%li",Response.errCode);
            NSLog(@"分享失败，shareState：%li",Response.shareState);
            NSString *msgTemp = [NSString stringWithFormat:@"1|0|errorCode:%li,shareState:%li",Response.errCode,Response.shareState];
        }
    }];
}

/**
 * TikTok 分享
 * @param type 分享类型
 * @param landedPageType 在TikTok中的状态
 * @param medias 分享资源，支持 url、本地路径
 */
- (void)shareWithType:(RXTTShareType)type
       landedPageType:(RXTTShareTypeLandedPageType)landedPageType
              hashTag:(NSString *)hasTag
               medias:(NSArray *)medias
             complete:(RequestComplete)complete
{
    // 检查是否有相册权限
    [[RXToolKit sharedSDK] isCanVisitPhotoLibrary:^(BOOL result) {
        if (result) {
            NSInteger shareType = 1;
            if (type == RXTTShareTypeImage) {
                shareType = 1;
            } else if (type == RXTTShareTypeVideo) {
                shareType = 2;
            }
            // 将图片保存到相册
            [self saveMedias:medias type:shareType complete:^(BOOL result) {
                if (result) {
                    [self getMediasWithType:shareType complete:^(NSMutableArray<PHAsset *> *assets) {
                        // 取图片在相册的标识
                        NSMutableArray<NSString *> *mediaLocalIdentifiers = [NSMutableArray array];
                        for (int i = 0; i < assets.count; i++) {
                            PHAsset *asset = assets[i];
                            [mediaLocalIdentifiers addObject:asset.localIdentifier];
                        }
                        // 发起分享
                        [self sendShareWithType:type landedPageType:landedPageType hashTag:hasTag localIdentifiers:mediaLocalIdentifiers complete:^(NSDictionary * _Nonnull response, NSDictionary * _Nonnull error) {
                            if (!error) {
                                if (complete) {
                                    complete(response, nil);
                                }
                            } else {
                                if (complete) {
                                    RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
                                    err.responesObject = error;
                                    complete(nil, err);
                                }
                            }
                        }];
                    }];
                }
            }];
        } else {
            NSLog(@"没有相册权限");
            if (complete) {
                NSMutableDictionary *dic = [NSMutableDictionary dictionary];
                [dic setValue:@(RXLimitError_notOpen) forKey:@"code"];
                [dic setValue:[RXErrorTool getRXErrorMsg:RXLimitError_notOpen] forKey:@"msg"];
                
                RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
                err.responesObject = dic;
                complete(nil, err);
            }
        }
    }];
}

/**
 * 保存到相册
 * type 1图片 2视频
 */
- (void)saveMedias:(NSArray *)medias
              type:(NSInteger)type
          complete:(void(^)(BOOL result))complete
{
    if (self.saveCount >= medias.count) {
        self.mediaCount = self.saveCount - 1;
        self.saveCount = 0;
        if (complete) {
            complete(YES);
        }
        return;
    }
    
    if (type == 1) {
        
        NSInteger width = 0;
        NSInteger height = 0;
        NSInteger x = 0;
        NSInteger y = 0;
        NSString *url = @"";

        if ([self.shareContent.materialType isEqualToString:@"image"]) {
            width = self.shareContent.width;
            height = self.shareContent.height;
            x = self.shareContent.x;
            y = self.shareContent.y;
            url = self.shareContent.url;
        } else if ([self.shareContent.materialType isEqualToString:@"atlas"]) {
            NSArray *atlas = self.shareContent.atlas;
            NSDictionary *atlasDic = atlas[self.saveCount];
            width = [atlasDic[@"width"] integerValue];
            height = [atlasDic[@"height"] integerValue];
            x = [atlasDic[@"x"] integerValue];
            y = [atlasDic[@"y"] integerValue];
            url = [NSString stringWithFormat:@"%@", atlasDic[@"landing_url"]];
        }
        
        [[RXToolKit sharedSDK] saveImage:medias[self.saveCount] url:self.shareContent.url width:width height:height x:x y:y complete:^(BOOL result) {
            // 成功失败都进行计数，防止卡死
            self.saveCount++;
            [self saveMedias:medias type:type complete:complete];
        }];
    } else {
        [[RXToolKit sharedSDK] saveVideo:medias[self.saveCount] complete:^(BOOL result) {
            // 成功失败都进行计数，防止卡死
            self.saveCount++;
            [self saveMedias:medias type:type complete:complete];
        }];
    }
}

- (TikTokOpenSDKLandedPageType)fetchLandedPageType:(RXTTShareTypeLandedPageType)landedPageType
{
    TikTokOpenSDKLandedPageType ttLandedPageType;
    if (landedPageType == RXTTShareTypeLandedPageTypeClip) {
        return TikTokOpenSDKLandedPageClip;
    } else if (landedPageType == RXTTShareTypeLandedPageTypeEdit) {
        return TikTokOpenSDKLandedPageEdit;
    } else {
        return TikTokOpenSDKLandedPagePublish;
    }
}

#pragma mark -- <fetch>
- (void)downImage:(NSString *)imageUrl
         complete:(void(^)(NSData *imgData))complete
{
    if (imageUrl&&imageUrl.length>0) {
        [self asyurlToData:imageUrl withHandler:^(NSURLResponse *response, NSData *data, NSError *connectionError) {
            if (complete) {
                dispatch_async(dispatch_get_main_queue(), ^{
                    complete(data);
                });
            }
        }];
    }else{
        if (complete) {
            complete(nil);
        }
    }
}

// 异步下载
- (void)asyurlToData:(NSString *)imageUrl withHandler:(void (^)(NSURLResponse* response, NSData* data, NSError* connectionError)) handler
{
    NSURLRequest *request = [NSURLRequest requestWithURL:[NSURL URLWithString:imageUrl] cachePolicy:NSURLRequestUseProtocolCachePolicy timeoutInterval:20.0];
    NSOperationQueue *queue=[[NSOperationQueue alloc] init];
    [NSURLConnection sendAsynchronousRequest:request queue:queue completionHandler:^(NSURLResponse *response, NSData *data, NSError *connectionError) {
        if (handler) {
            handler(response,data,connectionError);
        }
    }];
}

- (void)saveImage:(UIImage *)image finishError: (NSError *) error contextInfo:(void *)contextInfo{
    NSString *msg = nil ;
    if(error != NULL){
        msg = @"保存图片失败" ;
    }else{
        msg = @"图片已保存到相册" ;
    }
    
    NSLog(@"%@", msg);
}

- (void)getMediasWithType:(NSInteger)type complete:(void(^)(NSMutableArray <PHAsset *> *assets))complete
{
    NSMutableArray *medias = [NSMutableArray array];
    PHAuthorizationStatus status = [PHPhotoLibrary authorizationStatus];
    if (status == PHAuthorizationStatusRestricted || status == PHAuthorizationStatusDenied) {
        NSLog(@"相册权限未开放");
        return;
    }
    // 获取最近的照片
    for (int i = 0; i <= self.mediaCount; i++) {
        PHAsset *asset = [self getAsset:i type:type];
        [medias addObject:asset];
    }
    
    if (medias.count == 0) {
        NSLog(@"相册里没有照片");
        return;
    }

    if (complete) {
        complete(medias);
    }
}

- (PHAsset *)getAsset:(NSInteger)index type:(NSInteger)type
{
    // 创建 PHFetchOptions 对象，用于配置获取照片或视频的选项
    PHFetchOptions *fetchOptions = [[PHFetchOptions alloc] init];
    fetchOptions.sortDescriptors = @[[NSSortDescriptor sortDescriptorWithKey:@"creationDate" ascending:NO]];
    
    // 获取相册中所有的照片
    PHAssetMediaType mediaType = PHAssetMediaTypeImage;
    if (type == 1) {
        mediaType = PHAssetMediaTypeImage;
    } else {
        mediaType = PHAssetMediaTypeVideo;
    }
    
    PHFetchResult *fetchResult = [PHAsset fetchAssetsWithMediaType:mediaType options:fetchOptions];
    
    // 获取最后一张照片
    PHAsset *lastAsset = [fetchResult objectAtIndex:index];
    return lastAsset;
}

/** appdelegate */
- (id<UIApplicationDelegate>)applicationDelegate {
    return [UIApplication sharedApplication].delegate;
}

/** 返回当前控制器 */
- (UIViewController *)currentViewController {
    
    UIViewController *rootViewController = [self applicationDelegate].window.rootViewController;
    return [self currentViewControllerFrom:rootViewController];
}

/** 返回当前的导航控制器 */
- (UINavigationController *)currentNavigationViewController {
    
    UIViewController *currentViewController = [self currentViewController];
    return currentViewController.navigationController;
}

/** 通过递归拿到当前控制器 */
- (UIViewController *)currentViewControllerFrom:(UIViewController*)viewController {
    
    // 如果传入的控制器是导航控制器,则返回最后一个
    if ([viewController isKindOfClass:[UINavigationController class]]) {
        
        UINavigationController *navigationController = (UINavigationController *)viewController;
        return [self currentViewControllerFrom:navigationController.viewControllers.lastObject];
    }
    // 如果传入的控制器是tabBar控制器,则返回选中的那个
    else if([viewController isKindOfClass:[UITabBarController class]]) {
        
        UITabBarController *tabBarController = (UITabBarController *)viewController;
        return [self currentViewControllerFrom:tabBarController.selectedViewController];
    }
    // 如果传入的控制器发生了modal,则就可以拿到modal的那个控制器
    else if(viewController.presentedViewController != nil) {
        return [self currentViewControllerFrom:viewController.presentedViewController];
    }
    else {
        return viewController;
    }
}

@end
