//
//  RXFacebookService.m
//  RXFacebookSDK
//
//  Created by 陈汉 on 2022/8/30.
//

#import "RXFacebookService.h"
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <FBSDKLoginKit/FBSDKLoginKit.h>
#import <FBSDKShareKit/FBSDKShareKit.h>
#import "RXFBShareLinkContent.h"
#import "RXFBSharePhotoContent.h"
#import "RXFBShareVideoContent.h"
#import <RXSDK_Pure/RXNotificationCenter.h>
#import <RXSDK_Pure/RXSubPackage.h>
#import <RXSDK_Pure/RXPrivateService.h>

//#import "RXShareModel.h"
//#import "NSObject+YYModel.h"
//#import "CHDownImage.h"

#define PermissonsKey @"noti_fbPermissions"

typedef void(^NewShareCallBack)(NSDictionary *response, RX_CommonRequestError *error);

@interface RXFacebookService () <FBSDKSharingDelegate>

@property (nonatomic, copy) NewShareCallBack newShareCallBack;
@property (nonatomic, copy) FBShareCallBack shareCallBack;
@property (nonatomic, strong) NSString *migrate_args;
@property (nonatomic, strong) NSString *sign_fields;

- (void)bindAccountWithPermissions:(NSArray *)permissions
                                ext:(NSDictionary *)ext
                           complete:(RequestComplete)complete;

@end

@implementation RXFacebookService

static RXFacebookService *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXFacebookService alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        [RXSubPackage sharedSDK].aFacebook = YES;
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(fbShareAction:) name:rxUserDefault_share_fb object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(fbLoginAction:) name:rxUserDefault_login_fb object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(bindAction:) name:@"rxUserDefault_bind_fb" object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(syncAction:) name:rxUserDefault_osui_sync_fb object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(messengerShareAction:) name:rxUserDefault_share_messenger object:nil];
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
    
    [self FBApplication:app openURL:url options:options];
}

#pragma mark -- from main framework
- (void)fbShareAction:(NSNotification *)noti
{
    NSDictionary *shareInfo = noti.userInfo[@"shareInfo"];
    FBShareCallBack callback = noti.userInfo[@"callback"];
    
    [self FBShareWithShareInfo:shareInfo complete:callback];
}

- (void)fbLoginAction:(NSNotification *)noti
{
    @try {
        NSArray *permissions = noti.userInfo[@"permissions"];
        NSDictionary *ext = noti.userInfo[@"ext"];
        id migrateArgs = noti.userInfo[@"migrateArgs"];
        NSArray *signFields = noti.userInfo[@"signFields"];
        
        [self FBLoginWithPermissions:permissions extDic:ext migrate_args:migrateArgs sign_fields:signFields];
    } @catch (NSException *exception) {
        NSLog(@"%@", exception);
    } @finally {

    }
}

- (void)bindAction:(NSNotification *)noti
{
    @try {
        NSArray *permissions = noti.userInfo[@"permissions"];
        NSDictionary *ext = noti.userInfo[@"ext"];
        RequestComplete callback = noti.userInfo[@"callback"];

        [self bindAccountWithPermissions:permissions ext:ext complete:callback];
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

- (void)messengerShareAction:(NSNotification *)noti
{
    NSDictionary *shareInfo = noti.userInfo[@"shareInfo"];
    FBShareCallBack callback = noti.userInfo[@"callback"];
    
    [self messengerShareWithShareInfo:shareInfo complete:callback];
}

/**
 * 注册Facebook
 */
- (void)FBRegistWithApplication:(UIApplication *)application
                  launchOptions:(NSDictionary *)launchOptions
{
    [[FBSDKApplicationDelegate sharedInstance] application:application
                             didFinishLaunchingWithOptions:launchOptions];
}

/**
 * 跳转openURL
 */
- (BOOL)FBApplication:(UIApplication *)application
              openURL:(NSURL *)url
              options:(NSDictionary<UIApplicationOpenURLOptionsKey, id> *)options
{
    return [[FBSDKApplicationDelegate sharedInstance] application:application
                                                          openURL:url
                                                          options:options];
}

#pragma mark -- <登录>
/**
 * Facebook登录
 * @param permissions 权限  必须
 * @param extDic 扩展字段，可传nil
 * ！app_associated_bussiness facebook 应用是否有关联到 business（facebook商务管理平台），如果有，则允许一个 facebook 用户从（该 business 关联的）多个 facebook 应用登录返回的瑞雪账号信息相同。如果facebook 应用未关联 business，而登录时此字段传 true，则会返回报错    #BOOL类型
 * @param migrate_args 任意合法的 json 类型, 比如 string, nujber，账号迁移用的参数, 调用 CP account-query 及 account-queryandbind 接口时透传给 CP  非必须
 * @param sign_fields 指定对登录成功后返回的特定字段, 使用 CPKEY 计算签名. CP 服务器可重新计算签名并与登录返回的签名比对, 作为对瑞雪登录数据的校验. 支持的字段包括: nickname, avatar, openid, region, sex, age, 计算签名的逻辑会对指定字段进行排序, 此处传参与顺序无关。类型为字符串数组 @[@"nickname",@"avatar"]  非必须
 */
- (void)FBLoginWithPermissions:(NSArray *)permissions
                        extDic:(NSMutableDictionary *)extDic
                  migrate_args:(id _Nullable)migrate_args
                   sign_fields:(NSArray * _Nullable)sign_fields
{
    NSString *idfa = [RXApiService getIDFA];
    
    NSMutableDictionary *extDic1 = [NSMutableDictionary dictionaryWithDictionary:extDic];
    
    FBSDKLoginManager *login = [[FBSDKLoginManager alloc] init];
    [login logOut]; // 防止换一个帐号就无法获取信息的错误
    
    [[NSUserDefaults standardUserDefaults] setValue:permissions forKey:PermissonsKey];
    
    [login logInWithPermissions:permissions fromViewController:[self currentViewController] handler:^(FBSDKLoginManagerLoginResult *result, NSError *error) {
        NSLog(@"facebook login result = %@,error = %@", result, error);
        if (error) {
            NSLog(@"Process error");
            
            RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
            
            NSMutableDictionary *errorRes = [NSMutableDictionary dictionary];
            [errorRes setValue:[RXErrorTool getRXErrorMsg:RXLoginError_third] forKey:@"msg"];
            [errorRes setValue:@(RXLoginError_third) forKey:@"code"];
            
            if (error.localizedDescription) {
                [errorRes setValue:error.localizedDescription forKey:@"thirdmsg"];
            }
            if (error.code) {
                [errorRes setValue:@(error.code) forKey:@"thirdcode"];
            }
            
            err.responesObject = errorRes;
            
            [[NSNotificationCenter defaultCenter] postNotificationName:@"noti_LoginFail" object:nil userInfo:@{@"error" : err}];
            
            [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                           bodyDic:@{}
                                                            action:@"rxlog_error_login"
                                                               url:@""
                                                              code:err.responesObject[@"code"] == nil ? -123 : [err.responesObject[@"code"] integerValue]
                                                               msg:err.responesObject[@"msg"]
                                                         thirdType:@"facebook"
                                                         thirdcode:err.responesObject[@"thirdcode"] == nil ? -123 : [err.responesObject[@"thirdcode"] integerValue]
                                                          thirdmsg:err.responesObject[@"thirdmsg"]
                                                           traceid:@""];
        } else if (result.isCancelled) {
            NSLog(@"Cancelled");

            RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
            
            NSMutableDictionary *errorRes = [NSMutableDictionary dictionary];
            [errorRes setValue:[RXErrorTool getRXErrorMsg:RXLoginError_cancel] forKey:@"msg"];
            [errorRes setValue:@(RXLoginError_cancel) forKey:@"code"];
            
            if (error.localizedDescription) {
                [errorRes setValue:error.localizedDescription forKey:@"thirdmsg"];
            }
            if (error.code) {
                [errorRes setValue:@(error.code) forKey:@"thirdcode"];
            }
            
            err.responesObject = errorRes;
            
            [[NSNotificationCenter defaultCenter] postNotificationName:@"noti_LoginFail" object:nil userInfo:@{@"error" : err}];
            
            [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                           bodyDic:@{}
                                                            action:@"rxlog_error_login"
                                                               url:@""
                                                              code:err.responesObject[@"code"] == nil ? -123 : [err.responesObject[@"code"] integerValue]
                                                               msg:err.responesObject[@"msg"]
                                                         thirdType:@"facebook"
                                                         thirdcode:err.responesObject[@"thirdcode"] == nil ? -123 : [err.responesObject[@"thirdcode"] integerValue]
                                                          thirdmsg:err.responesObject[@"thirdmsg"]
                                                           traceid:@""];
            
        } else {
            NSLog(@"Logged in %@",result.token.userID);
            
            [extDic1 setValue:result.token.tokenString forKey:@"access_token"];
            //facebook sdk 17.0.0 以上新增字段
            [extDic1 setValue:result.authenticationToken.tokenString forKey:@"authentication_token"];
            
            if ([idfa isEqualToString:@""]) {//用户关闭广告权限,传"true"
                [extDic1 setValue:@"true" forKey:@"idfa_disable"];
            }else{//用户开启广告权限,传"false"
                [extDic1 setValue:@"false" forKey:@"idfa_disable"];
            }
            
//            if ([extDic1 valueForKey:@"app_associated_bussiness"]) {
//                [extDic1 setValue:@([[extDic1 valueForKey:@"app_associated_bussiness"] boolValue]) forKey:@"app_associated_bussiness"];
//            }
            
            [extDic1 setValue:result.token.userID forKey:@"user_id"];
            [extDic1 setValue:result.token.appID forKey:@"app_id"];
            [extDic1 setValue:[result.token.permissions allObjects] forKey:@"permissions"];
            NSTimeInterval timeInterval = [result.token.expirationDate timeIntervalSince1970];
            [extDic1 setValue:@([[NSString stringWithFormat:@"%.0f", timeInterval] integerValue]) forKey:@"access_expires"];
            
            [[RXService sharedSDK] loginWithExtDic:extDic1 username:nil password:nil sign_fields:sign_fields loginType:LoginTypeFacebook migrate_args:migrate_args];
            
            
//            //获取用户id, 昵称，大头像
//            NSDictionary *params = @{@"fields" : @"id, name"};
//
//            FBSDKGraphRequest *request = [[FBSDKGraphRequest alloc]
//                                          initWithGraphPath:result.token.userID
//                                          parameters:params
//                                          HTTPMethod:@"GET"];
//
//            [request startWithCompletion:^(id<FBSDKGraphRequestConnecting>  _Nullable connection, id  _Nullable result, NSError * _Nullable error) {
//                if (!error) {
//                    NSLog(@"facebook用户信息信息 %@", result);
//
//                    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
//                    [dic setValue:result[@"id"] forKey:@"id"];
//                    [dic setValue:result[@"name"] forKey:@"name"];
//                    [dic setValue:result[@"gender"] forKey:@"gender"];
//                    [dic setValue:result[@"picture"][@"data"][@"url"] forKey:@"url"];
//                    [[RXService sharedSDK] loginWithExtDic:dic username:nil password:nil sign_fields:sign_fields loginType:LoginTypeFacebook migrate_args:migrate_args];
//                } else {
//
//                    [[NSNotificationCenter defaultCenter] postNotificationName:@"noti_LoginFail" object:nil userInfo:@{@"error" : error}];
//                }
//            }];
        }
    }];
}

- (void)bindAccountWithPermissions:(NSArray *)permissions
                               ext:(NSDictionary *)ext
                          complete:(RequestComplete)complete
{
    NSString *idfa = [RXApiService getIDFA];
    NSMutableDictionary *extDic1 = [NSMutableDictionary dictionary];
    if ([ext isKindOfClass:[NSDictionary class]]) {
        [extDic1 addEntriesFromDictionary:ext];
    }

    NSArray *bindPermissions = [permissions isKindOfClass:[NSArray class]] ? permissions : @[@"public_profile"];

    FBSDKLoginManager *login = [[FBSDKLoginManager alloc] init];
    [login logOut]; // 防止换一个帐号就无法获取信息的错误

    [login logInWithPermissions:bindPermissions fromViewController:[self currentViewController] handler:^(FBSDKLoginManagerLoginResult *result, NSError *error) {
        NSLog(@"facebook bind result = %@,error = %@", result, error);
        if (error) {
            RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];

            NSMutableDictionary *errorRes = [NSMutableDictionary dictionary];
            [errorRes setValue:[RXErrorTool getRXErrorMsg:RXLoginError_third] forKey:@"msg"];
            [errorRes setValue:@(RXLoginError_third) forKey:@"code"];
            [errorRes setValue:error.localizedDescription forKey:@"thirdmsg"];
            [errorRes setValue:@(error.code) forKey:@"thirdcode"];
            err.responesObject = errorRes;

            if (complete) {
                complete(nil, err);
            }
        } else if (result.isCancelled) {
            RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];

            NSMutableDictionary *errorRes = [NSMutableDictionary dictionary];
            [errorRes setValue:[RXErrorTool getRXErrorMsg:RXLoginError_cancel] forKey:@"msg"];
            [errorRes setValue:@(RXLoginError_cancel) forKey:@"code"];
            err.responesObject = errorRes;

            if (complete) {
                complete(nil, err);
            }
        } else {
            [extDic1 setValue:result.token.tokenString forKey:@"access_token"];
            [extDic1 setValue:result.authenticationToken.tokenString forKey:@"authentication_token"];

            if ([idfa isEqualToString:@""]) {
                [extDic1 setValue:@"true" forKey:@"idfa_disable"];
            } else {
                [extDic1 setValue:@"false" forKey:@"idfa_disable"];
            }

            [extDic1 setValue:result.token.userID forKey:@"user_id"];
            [extDic1 setValue:result.token.appID forKey:@"app_id"];
            [extDic1 setValue:[result.token.permissions allObjects] forKey:@"permissions"];
            NSTimeInterval timeInterval = [result.token.expirationDate timeIntervalSince1970];
            [extDic1 setValue:@([[NSString stringWithFormat:@"%.0f", timeInterval] integerValue]) forKey:@"access_expires"];

            [[RXPrivateService sharedSDK] bindThirdAccountWithMethod:@"facebook" ext:extDic1 complete:complete];
        }
    }];
}

/**
 * Facebook退出登录
 */
- (void)FBLogout
{
    FBSDKLoginManager *login = [[FBSDKLoginManager alloc] init];
    [login logOut]; // 防止换一个帐号就无法获取信息的错误
}

#pragma mark -- <分享>
/**
 * Facebook分享
 * @param shareInfo 获取分享信息返回的内容  必须
 */
- (void)FBShareWithShareInfo:(NSDictionary *)shareInfo
                    complete:(FBShareCallBack)complete
{
    self.shareCallBack = complete;
    
    FBSDKShareDialogMode *shareMode = FBSDKShareDialogModeAutomatic;
    if ([shareInfo[@"shareMode"] integerValue] == 1) {
        shareMode = FBSDKShareDialogModeNative;
    }
    
    if ([shareInfo[@"material_type"] isEqualToString:@"image"]) {
        __block FBSDKSharePhoto *photo = nil;
        if ([shareInfo[@"image"] isKindOfClass:[UIImage class]]) {
            NSData *imageData = UIImagePNGRepresentation(shareInfo[@"image"]);
            // 不能大于12m，防止误差压缩到11m
            imageData = [self dataScaleToBytes:11 * 1024 * 1024 withImageData:imageData];
            imageData = [self fetchShareImageWithShreContent:shareInfo imageData:imageData borderSize:[shareInfo[@"borderSize"] floatValue]];
            UIImage *img = [UIImage imageWithData:imageData];
            photo = [[FBSDKSharePhoto alloc] initWithImage:img isUserGenerated:YES];
            FBSDKSharePhotoContent *photoContent = [[FBSDKSharePhotoContent alloc] init];
            photoContent.photos = @[photo];
            
//            [FBSDKShareDialog showFromViewController:[self currentViewController] withContent:photoContent delegate:self];
            FBSDKShareDialog *dialog = [[FBSDKShareDialog alloc] initWithViewController:[self currentViewController] content:photoContent delegate:self];
            
            dialog.mode = shareMode; // if you don't set this before canShow call, canShow would always return YES
            if (![dialog canShow]) {
                // fallback presentation when there is no FB app
                dialog.mode = FBSDKShareDialogModeFeedBrowser;
            }
            [dialog show];
        } else if ([shareInfo[@"image"] isKindOfClass:[NSData class]]) {
            // 不能大于12m，防止误差压缩到11m
            NSData *imageData = [self dataScaleToBytes:11 * 1024 * 1024 withImageData:shareInfo[@"image"]];
            imageData = [self fetchShareImageWithShreContent:shareInfo imageData:imageData borderSize:[shareInfo[@"borderSize"] floatValue]];
            UIImage *img = [UIImage imageWithData:imageData];
            photo = [[FBSDKSharePhoto alloc] initWithImage:img isUserGenerated:YES];
            FBSDKSharePhotoContent *photoContent = [[FBSDKSharePhotoContent alloc] init];
            photoContent.photos = @[photo];

//            [FBSDKShareDialog showFromViewController:[self currentViewController] withContent:photoContent delegate:self];
            FBSDKShareDialog *dialog = [[FBSDKShareDialog alloc] initWithViewController:[self currentViewController] content:photoContent delegate:self];
            dialog.mode = shareMode; // if you don't set this before canShow call, canShow would always return YES
            if (![dialog canShow]) {
                // fallback presentation when there is no FB app
                dialog.mode = FBSDKShareDialogModeFeedBrowser;
            }
            [dialog show];
        } else if ([shareInfo[@"image"] isKindOfClass:[NSString class]] && [[shareInfo[@"image"] substringToIndex:4] containsString:@"http"]) {
            [self downImage:shareInfo[@"image"] complete:^(NSData *imgData) {
                // 不能大于12m，防止误差压缩到11m
                NSData *imageData = [self dataScaleToBytes:11 * 1024 * 1024 withImageData:imgData];
                imageData = [self fetchShareImageWithShreContent:shareInfo imageData:imageData borderSize:[shareInfo[@"borderSize"] floatValue]];
                UIImage *img = [UIImage imageWithData:imageData];
                photo = [[FBSDKSharePhoto alloc] initWithImage:img isUserGenerated:YES];
                FBSDKSharePhotoContent *photoContent = [[FBSDKSharePhotoContent alloc] init];
                photoContent.photos = @[photo];
                
//                [FBSDKShareDialog showFromViewController:[self currentViewController] withContent:photoContent delegate:self];
                FBSDKShareDialog *dialog = [[FBSDKShareDialog alloc] initWithViewController:[self currentViewController] content:photoContent delegate:self];
                dialog.mode = shareMode; // if you don't set this before canShow call, canShow would always return YES
                if (![dialog canShow]) {
                    // fallback presentation when there is no FB app
                    dialog.mode = FBSDKShareDialogModeFeedBrowser;
                }
                [dialog show];
            }];
        } else {
            NSData *imageData = [NSData dataWithContentsOfFile:shareInfo[@"image"]];
            if (imageData == nil) {
                NSLog(@"图片路径参数存在问题，请仔细检查");
                self.shareCallBack(NO);
                return;
            }
            // 不能大于12m，防止误差压缩到11m
            imageData = [self dataScaleToBytes:11 * 1024 * 1024 withImageData:imageData];
            imageData = [self fetchShareImageWithShreContent:shareInfo imageData:imageData borderSize:[shareInfo[@"borderSize"] floatValue]];
            UIImage *img = [UIImage imageWithData:imageData];
            photo = [[FBSDKSharePhoto alloc] initWithImage:img isUserGenerated:YES];
            FBSDKSharePhotoContent *photoContent = [[FBSDKSharePhotoContent alloc] init];
            photoContent.photos = @[photo];

//            [FBSDKShareDialog showFromViewController:[self currentViewController] withContent:photoContent delegate:self];
            FBSDKShareDialog *dialog = [[FBSDKShareDialog alloc] initWithViewController:[self currentViewController] content:photoContent delegate:self];
            dialog.mode = shareMode; // if you don't set this before canShow call, canShow would always return YES
            if (![dialog canShow]) {
                // fallback presentation when there is no FB app
                dialog.mode = FBSDKShareDialogModeFeedBrowser;
            }
            [dialog show];
        }
    } else if ([shareInfo[@"material_type"] isEqualToString:@"link"]) {
        NSString *shareUrl = shareInfo[@"url"];
        
        FBSDKShareLinkContent *linkContent = [[FBSDKShareLinkContent alloc] init];
        linkContent.contentURL = [NSURL URLWithString:shareUrl];
        linkContent.quote = shareInfo[@"content"];
//        FBSDKHashtag *tag = [[FBSDKHashtag alloc] initWithString:@"33333"];
//        tag.stringRepresentation = @"3333333";
//        linkContent.hashtag = tag;
//        linkContent.ref = @"3333";
//        linkContent.pageID = @"33";
//        linkContent.placeID = @"44";
        
        
//        [FBSDKShareDialog showFromViewController:[self currentViewController] withContent:linkContent delegate:self];
        FBSDKShareDialog *dialog = [[FBSDKShareDialog alloc] initWithViewController:[self currentViewController] content:linkContent delegate:self];
        dialog.mode = shareMode; // if you don't set this before canShow call, canShow would always return YES
        if (![dialog canShow]) {
            // fallback presentation when there is no FB app
            dialog.mode = FBSDKShareDialogModeFeedBrowser;
        }
        [dialog show];
    } else if ([shareInfo[@"material_type"] isEqualToString:@"video"]) {
        
        NSString *shareUrl = shareInfo[@"video"];
        FBSDKShareVideo *video = nil;
        
        // 封面
        __block FBSDKSharePhoto *photo = nil;
        if ([shareInfo[@"image"] isKindOfClass:[UIImage class]]) {
            NSData *imageData = UIImagePNGRepresentation(shareInfo[@"image"]);
            // 不能大于12m，防止误差压缩到11m
            imageData = [self dataScaleToBytes:11 * 1024 * 1024 withImageData:imageData];
            UIImage *img = [UIImage imageWithData:imageData];
            photo = [[FBSDKSharePhoto alloc] initWithImage:img isUserGenerated:YES];
        } else if ([shareInfo[@"image"] isKindOfClass:[NSData class]]) {
            // 不能大于12m，防止误差压缩到11m
            NSData *imageData = [self dataScaleToBytes:11 * 1024 * 1024 withImageData:shareInfo[@"image"]];
            UIImage *img = [UIImage imageWithData:imageData];
            photo = [[FBSDKSharePhoto alloc] initWithImage:img isUserGenerated:YES];
        } else if ([shareInfo[@"image"] isKindOfClass:[NSString class]] && [[shareInfo[@"image"] substringToIndex:4] containsString:@"http"]) {
            NSLock *cpuUsageLock = [[NSLock alloc] init];
            [cpuUsageLock lock];
            [self downImage:shareInfo[@"image"] complete:^(NSData *imgData) {
                // 不能大于12m，防止误差压缩到11m
                NSData *imageData = [self dataScaleToBytes:11 * 1024 * 1024 withImageData:imgData];
                UIImage *img = [UIImage imageWithData:imageData];
                photo = [[FBSDKSharePhoto alloc] initWithImage:img isUserGenerated:YES];
                [cpuUsageLock unlock];
            }];
        } else {
            NSData *imageData = [NSData dataWithContentsOfFile:shareInfo[@"image"]];
            // 不能大于12m，防止误差压缩到11m
            imageData = [self dataScaleToBytes:11 * 1024 * 1024 withImageData:imageData];
            UIImage *img = [UIImage imageWithData:imageData];
            photo = [[FBSDKSharePhoto alloc] initWithImage:img isUserGenerated:YES];
        }
        
        if ([shareInfo[@"video"] isKindOfClass:[NSData class]]) {
            video = [[FBSDKShareVideo alloc] initWithData:shareInfo[@"video"] previewPhoto:photo];
        } else if ([shareInfo[@"video"] isKindOfClass:[NSURL class]]) {
            video = [[FBSDKShareVideo alloc] initWithVideoURL:shareInfo[@"video"] previewPhoto:photo];
        }
        
        FBSDKShareVideoContent *videoContent = [[FBSDKShareVideoContent alloc] init];
        videoContent.video = video;
        
//        [FBSDKShareDialog showFromViewController:[self currentViewController] withContent:linkContent delegate:self];
        FBSDKShareDialog *dialog = [[FBSDKShareDialog alloc] initWithViewController:[self currentViewController] content:videoContent delegate:self];
        dialog.mode = shareMode; // if you don't set this before canShow call, canShow would always return YES
        if (![dialog canShow]) {
            // fallback presentation when there is no FB app
            dialog.mode = FBSDKShareDialogModeFeedBrowser;
        }
        [dialog show];
    }
}

// 图片添加二维码
- (NSData *)fetchShareImageWithShreContent:(NSDictionary *)shareContent imageData:(NSData *)imageData borderSize:(CGFloat)borderSize
{
    if (shareContent[@"url"] && [NSString stringWithFormat:@"%@", shareContent[@"url"]].length > 0) {
        NSString *shareUrl = shareContent[@"url"];
        UIImage *qrCodeImg = [self rxQRCodeForString:shareUrl size:CGSizeMake([shareContent[@"width"] integerValue], [shareContent[@"height"] integerValue]) fillColor:[UIColor blackColor] iconImage:nil borderSize:borderSize];
        UIImage *bgView = [UIImage imageWithData:imageData];
        CGFloat fixelW = CGImageGetWidth(bgView.CGImage);
        CGFloat fixelH = CGImageGetHeight(bgView.CGImage);
        UIImageView *shareImgView = [[UIImageView alloc] initWithFrame:CGRectMake(0, 0, fixelW, fixelH)];
        shareImgView.image = bgView;
        UIImageView *qrCodeImgView = [[UIImageView alloc] initWithFrame:CGRectMake([shareContent[@"x"] integerValue], [shareContent[@"y"] integerValue], [shareContent[@"width"] integerValue], [shareContent[@"height"] integerValue])];
        qrCodeImgView.image = qrCodeImg;
        [shareImgView addSubview:qrCodeImgView];
        
        UIImage *shareImg = [self makeImageWithView:shareImgView withSize:shareImgView.frame.size];
        NSData *shareImgData = UIImagePNGRepresentation(shareImg);
        imageData = [self dataScaleToBytes:11 * 1024 * 1024 withImageData:shareImgData];
    }
    return imageData;
}

/**
 * Facebook分享
 * @param content 分享的结构体
 * @param mode 分享样式， 0为弹框样式  1为跳转到fb app分享
 */
- (void)FBShareWithContent:(id)content
                      mode:(NSInteger)mode
                  complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    self.newShareCallBack = complete;
    
    FBSDKShareDialogMode *shareMode = FBSDKShareDialogModeAutomatic;
    if (mode == 1) {
        shareMode = FBSDKShareDialogModeNative;
    }
    
    // 图片分享
    if ([content isKindOfClass:[RXFBSharePhotoContent class]]) {
        RXFBSharePhotoContent *rxPhotoContent = (RXFBSharePhotoContent *)content;
        NSMutableArray *rxPhotos = [NSMutableArray array];
        
        for (int i = 0; i < rxPhotoContent.photos.count; i++) {
            NSArray *photos = rxPhotoContent.photos;
            if ([photos[i] isKindOfClass:[UIImage class]]) {
                // 不能大于12m，防止误差压缩到11m
                NSData *imageData = UIImagePNGRepresentation(photos[i]);
                imageData = [self dataScaleToBytes:11 * 1024 * 1024 withImageData:imageData];
                UIImage *img = [UIImage imageWithData:imageData];
                FBSDKSharePhoto *photo = [[FBSDKSharePhoto alloc] initWithImage:img isUserGenerated:YES];
                [rxPhotos addObject:photo];
                
            } else if ([photos[i] isKindOfClass:[NSData class]]) {
                // 不能大于12m，防止误差压缩到11m
                NSData *imageData = [self dataScaleToBytes:11 * 1024 * 1024 withImageData:photos[i]];
                UIImage *img = [UIImage imageWithData:imageData];
                FBSDKSharePhoto *photo = [[FBSDKSharePhoto alloc] initWithImage:img isUserGenerated:YES];
                [rxPhotos addObject:photo];
                
            } else if ([photos[i] isKindOfClass:[NSString class]] && [[photos[i] substringToIndex:4] containsString:@"http"]) {
                FBSDKSharePhoto *photo = [[FBSDKSharePhoto alloc] initWithImageURL:photos[i] isUserGenerated:YES];
                [rxPhotos addObject:photo];
                
            } else {
                NSData *imageData = [NSData dataWithContentsOfFile:photos[i]];
                if (imageData == nil) {
                    NSLog(@"图片路径参数存在问题，请仔细检查");
                    RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
                    
                    NSMutableDictionary *errorRes = [NSMutableDictionary dictionary];
                    [errorRes setValue:[RXErrorTool getRXErrorMsg:RXShareError_default] forKey:@"msg"];
                    [errorRes setValue:@(RXShareError_default) forKey:@"code"];
                    err.responesObject = errorRes;
                    self.newShareCallBack(nil, err);
                    return;
                }
                // 不能大于12m，防止误差压缩到11m
                imageData = [self dataScaleToBytes:11 * 1024 * 1024 withImageData:imageData];
                UIImage *img = [UIImage imageWithData:imageData];
                FBSDKSharePhoto *photo = [[FBSDKSharePhoto alloc] initWithImage:img isUserGenerated:YES];
                [rxPhotos addObject:photo];
            }
        }
        
        FBSDKSharePhotoContent *photoContent = [[FBSDKSharePhotoContent alloc] init];
        photoContent.photos = rxPhotos;
        
        //            [FBSDKShareDialog showFromViewController:[self currentViewController] withContent:photoContent delegate:self];
        FBSDKShareDialog *dialog = [[FBSDKShareDialog alloc] initWithViewController:[self currentViewController] content:photoContent delegate:self];
        
        dialog.mode = shareMode; // if you don't set this before canShow call, canShow would always return YES
        if (![dialog canShow]) {
            // fallback presentation when there is no FB app
            dialog.mode = FBSDKShareDialogModeFeedBrowser;
        }
        [dialog show];
        
    } else if ([content isKindOfClass:[RXFBShareLinkContent class]]) { // 链接分享
        RXFBShareLinkContent *rxLinkContent = (RXFBShareLinkContent *)content;
        
        FBSDKShareLinkContent *linkContent = [[FBSDKShareLinkContent alloc] init];
        linkContent.contentURL = rxLinkContent.contentURL;
        linkContent.quote = rxLinkContent.quote;
        
        //        [FBSDKShareDialog showFromViewController:[self currentViewController] withContent:linkContent delegate:self];
        FBSDKShareDialog *dialog = [[FBSDKShareDialog alloc] initWithViewController:[self currentViewController] content:linkContent delegate:self];
        dialog.mode = shareMode; // if you don't set this before canShow call, canShow would always return YES
        if (![dialog canShow]) {
            // fallback presentation when there is no FB app
            dialog.mode = FBSDKShareDialogModeFeedBrowser;
        }
        [dialog show];
        
    } else if ([content isKindOfClass:[RXFBShareVideoContent class]]) { // 视频分享
        RXFBShareVideoContent *rxVideoContent = (RXFBShareVideoContent *)content;
        
        FBSDKShareVideo *video = nil;
        // 封面
        FBSDKSharePhoto *photo = nil;
        
        if ([rxVideoContent.previewPhoto isKindOfClass:[UIImage class]]) {
            NSData *imageData = UIImagePNGRepresentation(rxVideoContent.previewPhoto);
            // 不能大于12m，防止误差压缩到11m
            imageData = [self dataScaleToBytes:11 * 1024 * 1024 withImageData:imageData];
            UIImage *img = [UIImage imageWithData:imageData];
            photo = [[FBSDKSharePhoto alloc] initWithImage:img isUserGenerated:YES];
            
        } else if ([rxVideoContent.previewPhoto isKindOfClass:[NSData class]]) {
            // 不能大于12m，防止误差压缩到11m
            NSData *imageData = [self dataScaleToBytes:11 * 1024 * 1024 withImageData:rxVideoContent.previewPhoto];
            UIImage *img = [UIImage imageWithData:imageData];
            photo = [[FBSDKSharePhoto alloc] initWithImage:img isUserGenerated:YES];
            
        } else if ([rxVideoContent.previewPhoto isKindOfClass:[NSString class]] && [[rxVideoContent.previewPhoto substringToIndex:4] containsString:@"http"]) {
            photo = [[FBSDKSharePhoto alloc] initWithImageURL:rxVideoContent.previewPhoto isUserGenerated:YES];
        } else {
            NSData *imageData = [NSData dataWithContentsOfFile:rxVideoContent.previewPhoto];
            // 不能大于12m，防止误差压缩到11m
            imageData = [self dataScaleToBytes:11 * 1024 * 1024 withImageData:imageData];
            UIImage *img = [UIImage imageWithData:imageData];
            FBSDKSharePhoto *photo = [[FBSDKSharePhoto alloc] initWithImage:img isUserGenerated:YES];
        }
         
        if (rxVideoContent.videoData) {
            video = [[FBSDKShareVideo alloc] initWithData:rxVideoContent.videoData previewPhoto:photo];
        } else {
            video = [[FBSDKShareVideo alloc] initWithVideoURL:rxVideoContent.videoURL previewPhoto:photo];
        }
        
        FBSDKShareVideoContent *videoContent = [[FBSDKShareVideoContent alloc] init];
        videoContent.video = video;
        
        //        [FBSDKShareDialog showFromViewController:[self currentViewController] withContent:linkContent delegate:self];
        FBSDKShareDialog *dialog = [[FBSDKShareDialog alloc] initWithViewController:[self currentViewController] content:videoContent delegate:self];
        dialog.mode = shareMode; // if you don't set this before canShow call, canShow would always return YES
        if (![dialog canShow]) {
            // fallback presentation when there is no FB app
            dialog.mode = FBSDKShareDialogModeFeedBrowser;
        }
        [dialog show];
    }
    
        
//        if ([shareInfo[@"image"] isKindOfClass:[UIImage class]]) {
//            NSData *imageData = UIImagePNGRepresentation(shareInfo[@"image"]);
//            // 不能大于12m，防止误差压缩到11m
//            imageData = [self dataScaleToBytes:11 * 1024 * 1024 withImageData:imageData];
//            imageData = [self fetchShareImageWithShreContent:shareInfo imageData:imageData];
//            UIImage *img = [UIImage imageWithData:imageData];
//            photo = [[FBSDKSharePhoto alloc] initWithImage:img isUserGenerated:YES];
//            FBSDKSharePhotoContent *photoContent = [[FBSDKSharePhotoContent alloc] init];
//            photoContent.photos = @[photo];
//
////            [FBSDKShareDialog showFromViewController:[self currentViewController] withContent:photoContent delegate:self];
//            FBSDKShareDialog *dialog = [[FBSDKShareDialog alloc] initWithViewController:[self currentViewController] content:photoContent delegate:self];
//
//            dialog.mode = shareMode; // if you don't set this before canShow call, canShow would always return YES
//            if (![dialog canShow]) {
//                // fallback presentation when there is no FB app
//                dialog.mode = FBSDKShareDialogModeFeedBrowser;
//            }
//            [dialog show];
//        } else if ([shareInfo[@"image"] isKindOfClass:[NSData class]]) {
//            // 不能大于12m，防止误差压缩到11m
//            NSData *imageData = [self dataScaleToBytes:11 * 1024 * 1024 withImageData:shareInfo[@"image"]];
//            imageData = [self fetchShareImageWithShreContent:shareInfo imageData:imageData];
//            UIImage *img = [UIImage imageWithData:imageData];
//            photo = [[FBSDKSharePhoto alloc] initWithImage:img isUserGenerated:YES];
//            FBSDKSharePhotoContent *photoContent = [[FBSDKSharePhotoContent alloc] init];
//            photoContent.photos = @[photo];
//
////            [FBSDKShareDialog showFromViewController:[self currentViewController] withContent:photoContent delegate:self];
//            FBSDKShareDialog *dialog = [[FBSDKShareDialog alloc] initWithViewController:[self currentViewController] content:photoContent delegate:self];
//            dialog.mode = shareMode; // if you don't set this before canShow call, canShow would always return YES
//            if (![dialog canShow]) {
//                // fallback presentation when there is no FB app
//                dialog.mode = FBSDKShareDialogModeFeedBrowser;
//            }
//            [dialog show];
//        } else if ([shareInfo[@"image"] isKindOfClass:[NSString class]] && [[shareInfo[@"image"] substringToIndex:4] containsString:@"http"]) {
//            [self downImage:shareInfo[@"image"] complete:^(NSData *imgData) {
//                // 不能大于12m，防止误差压缩到11m
//                NSData *imageData = [self dataScaleToBytes:11 * 1024 * 1024 withImageData:imgData];
//                imageData = [self fetchShareImageWithShreContent:shareInfo imageData:imageData];
//                UIImage *img = [UIImage imageWithData:imageData];
//                photo = [[FBSDKSharePhoto alloc] initWithImage:img isUserGenerated:YES];
//                FBSDKSharePhotoContent *photoContent = [[FBSDKSharePhotoContent alloc] init];
//                photoContent.photos = @[photo];
//
////                [FBSDKShareDialog showFromViewController:[self currentViewController] withContent:photoContent delegate:self];
//                FBSDKShareDialog *dialog = [[FBSDKShareDialog alloc] initWithViewController:[self currentViewController] content:photoContent delegate:self];
//                dialog.mode = shareMode; // if you don't set this before canShow call, canShow would always return YES
//                if (![dialog canShow]) {
//                    // fallback presentation when there is no FB app
//                    dialog.mode = FBSDKShareDialogModeFeedBrowser;
//                }
//                [dialog show];
//            }];
//        } else {
//            NSData *imageData = [NSData dataWithContentsOfFile:shareInfo[@"image"]];
//            // 不能大于12m，防止误差压缩到11m
//            imageData = [self dataScaleToBytes:11 * 1024 * 1024 withImageData:imageData];
//            imageData = [self fetchShareImageWithShreContent:shareInfo imageData:imageData];
//            UIImage *img = [UIImage imageWithData:imageData];
//            photo = [[FBSDKSharePhoto alloc] initWithImage:img isUserGenerated:YES];
//            FBSDKSharePhotoContent *photoContent = [[FBSDKSharePhotoContent alloc] init];
//            photoContent.photos = @[photo];
//
////            [FBSDKShareDialog showFromViewController:[self currentViewController] withContent:photoContent delegate:self];
//            FBSDKShareDialog *dialog = [[FBSDKShareDialog alloc] initWithViewController:[self currentViewController] content:photoContent delegate:self];
//            dialog.mode = shareMode; // if you don't set this before canShow call, canShow would always return YES
//            if (![dialog canShow]) {
//                // fallback presentation when there is no FB app
//                dialog.mode = FBSDKShareDialogModeFeedBrowser;
//            }
//            [dialog show];
//        }
//    } else if ([shareInfo[@"material_type"] isEqualToString:@"link"]) {
//        NSString *shareUrl = shareInfo[@"url"];
//
        FBSDKShareLinkContent *linkContent = [[FBSDKShareLinkContent alloc] init];
//        linkContent.contentURL = [NSURL URLWithString:shareUrl];
//        linkContent.quote = shareInfo[@"content"];
//
////        [FBSDKShareDialog showFromViewController:[self currentViewController] withContent:linkContent delegate:self];
//        FBSDKShareDialog *dialog = [[FBSDKShareDialog alloc] initWithViewController:[self currentViewController] content:linkContent delegate:self];
//        dialog.mode = shareMode; // if you don't set this before canShow call, canShow would always return YES
//        if (![dialog canShow]) {
//            // fallback presentation when there is no FB app
//            dialog.mode = FBSDKShareDialogModeFeedBrowser;
//        }
//        [dialog show];
//    } else if ([shareInfo[@"material_type"] isEqualToString:@"video"]) {
//
//        NSString *shareUrl = shareInfo[@"video"];
//        FBSDKShareVideo *video = nil;
//
//        // 封面
//        __block FBSDKSharePhoto *photo = nil;
//        if ([shareInfo[@"image"] isKindOfClass:[UIImage class]]) {
//            NSData *imageData = UIImagePNGRepresentation(shareInfo[@"image"]);
//            // 不能大于12m，防止误差压缩到11m
//            imageData = [self dataScaleToBytes:11 * 1024 * 1024 withImageData:imageData];
//            imageData = [self fetchShareImageWithShreContent:shareInfo imageData:imageData];
//            UIImage *img = [UIImage imageWithData:imageData];
//            photo = [[FBSDKSharePhoto alloc] initWithImage:img isUserGenerated:YES];
//        } else if ([shareInfo[@"image"] isKindOfClass:[NSData class]]) {
//            // 不能大于12m，防止误差压缩到11m
//            NSData *imageData = [self dataScaleToBytes:11 * 1024 * 1024 withImageData:shareInfo[@"image"]];
//            imageData = [self fetchShareImageWithShreContent:shareInfo imageData:imageData];
//            UIImage *img = [UIImage imageWithData:imageData];
//            photo = [[FBSDKSharePhoto alloc] initWithImage:img isUserGenerated:YES];
//        } else if ([shareInfo[@"image"] isKindOfClass:[NSString class]] && [[shareInfo[@"image"] substringToIndex:4] containsString:@"http"]) {
//            NSLock *cpuUsageLock = [[NSLock alloc] init];
//            [cpuUsageLock lock];
//            [self downImage:shareInfo[@"image"] complete:^(NSData *imgData) {
//                // 不能大于12m，防止误差压缩到11m
//                NSData *imageData = [self dataScaleToBytes:11 * 1024 * 1024 withImageData:imgData];
//                imageData = [self fetchShareImageWithShreContent:shareInfo imageData:imageData];
//                UIImage *img = [UIImage imageWithData:imageData];
//                photo = [[FBSDKSharePhoto alloc] initWithImage:img isUserGenerated:YES];
//                [cpuUsageLock unlock];
//            }];
//        }
//
//        if ([shareInfo[@"video"] isKindOfClass:[NSData class]]) {
//            video = [[FBSDKShareVideo alloc] initWithData:shareInfo[@"video"] previewPhoto:photo];
//        } else if ([shareInfo[@"video"] isKindOfClass:[NSURL class]]) {
//            video = [[FBSDKShareVideo alloc] initWithVideoURL:shareInfo[@"video"] previewPhoto:photo];
//        }
//
//        FBSDKShareVideoContent *videoContent = [[FBSDKShareVideoContent alloc] init];
//        videoContent.video = video;
//
////        [FBSDKShareDialog showFromViewController:[self currentViewController] withContent:linkContent delegate:self];
//        FBSDKShareDialog *dialog = [[FBSDKShareDialog alloc] initWithViewController:[self currentViewController] content:videoContent delegate:self];
//        dialog.mode = shareMode; // if you don't set this before canShow call, canShow would always return YES
//        if (![dialog canShow]) {
//            // fallback presentation when there is no FB app
//            dialog.mode = FBSDKShareDialogModeFeedBrowser;
//        }
//        [dialog show];
//    }
}


/**
 * Messenger分享
 * @param content 分享的结构体
 */
- (void)messengerShareWithContent:(id)content
                         complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    self.newShareCallBack = complete;
    
    // 图片分享
    if ([content isKindOfClass:[RXFBSharePhotoContent class]]) {
        RXFBSharePhotoContent *rxPhotoContent = (RXFBSharePhotoContent *)content;
        NSMutableArray *rxPhotos = [NSMutableArray array];
        
        for (int i = 0; i < rxPhotoContent.photos.count; i++) {
            NSArray *photos = rxPhotoContent.photos;
            if ([photos[i] isKindOfClass:[UIImage class]]) {
                // 不能大于12m，防止误差压缩到11m
                NSData *imageData = UIImagePNGRepresentation(photos[i]);
                imageData = [self dataScaleToBytes:11 * 1024 * 1024 withImageData:imageData];
                UIImage *img = [UIImage imageWithData:imageData];
                FBSDKSharePhoto *photo = [[FBSDKSharePhoto alloc] initWithImage:img isUserGenerated:YES];
                [rxPhotos addObject:photo];
                
            } else if ([photos[i] isKindOfClass:[NSData class]]) {
                // 不能大于12m，防止误差压缩到11m
                NSData *imageData = [self dataScaleToBytes:11 * 1024 * 1024 withImageData:photos[i]];
                UIImage *img = [UIImage imageWithData:imageData];
                FBSDKSharePhoto *photo = [[FBSDKSharePhoto alloc] initWithImage:img isUserGenerated:YES];
                [rxPhotos addObject:photo];
                
            } else if ([photos[i] isKindOfClass:[NSString class]] && [[photos[i] substringToIndex:4] containsString:@"http"]) {
                FBSDKSharePhoto *photo = [[FBSDKSharePhoto alloc] initWithImageURL:photos[i] isUserGenerated:YES];
                [rxPhotos addObject:photo];
                
            } else {
                NSData *imageData = [NSData dataWithContentsOfFile:photos[i]];
                // 不能大于12m，防止误差压缩到11m
                imageData = [self dataScaleToBytes:11 * 1024 * 1024 withImageData:imageData];
                UIImage *img = [UIImage imageWithData:imageData];
                FBSDKSharePhoto *photo = [[FBSDKSharePhoto alloc] initWithImage:img isUserGenerated:YES];
                [rxPhotos addObject:photo];
            }
        }
        
        FBSDKSharePhotoContent *photoContent = [[FBSDKSharePhotoContent alloc] init];
        photoContent.photos = rxPhotos;
        
        FBSDKMessageDialog *dialog = [[FBSDKMessageDialog alloc] initWithContent:photoContent delegate:self];
        
        if (![dialog canShow]) {
            // fallback presentation when there is no FB app
    //                dialog.mode = FBSDKShareDialogModeFeedBrowser;
            RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
            
            NSMutableDictionary *errorRes = [NSMutableDictionary dictionary];
            [errorRes setValue:[RXErrorTool getRXErrorMsg:RXShareError_default] forKey:@"msg"];
            [errorRes setValue:@(RXShareError_default) forKey:@"code"];
            err.responesObject = errorRes;
            self.newShareCallBack(nil, err);
            return;
        }
        [dialog show];
        
    } else if ([content isKindOfClass:[RXFBShareLinkContent class]]) { // 链接分享
        RXFBShareLinkContent *rxLinkContent = (RXFBShareLinkContent *)content;
        
        FBSDKShareLinkContent *linkContent = [[FBSDKShareLinkContent alloc] init];
        linkContent.contentURL = rxLinkContent.contentURL;
        linkContent.quote = rxLinkContent.quote;
        
        FBSDKMessageDialog *dialog = [[FBSDKMessageDialog alloc] initWithContent:linkContent delegate:self];
        if (![dialog canShow]) {
            // fallback presentation when there is no FB app
    //                dialog.mode = FBSDKShareDialogModeFeedBrowser;
            RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
            
            NSMutableDictionary *errorRes = [NSMutableDictionary dictionary];
            [errorRes setValue:[RXErrorTool getRXErrorMsg:RXShareError_default] forKey:@"msg"];
            [errorRes setValue:@(RXShareError_default) forKey:@"code"];
            err.responesObject = errorRes;
            self.newShareCallBack(nil, err);
            return;
        }
        [dialog show];
        
    } else if ([content isKindOfClass:[RXFBShareVideoContent class]]) { // 视频分享
        RXFBShareVideoContent *rxVideoContent = (RXFBShareVideoContent *)content;
        
        FBSDKShareVideo *video = nil;
        // 封面
        FBSDKSharePhoto *photo = nil;
        
        if ([rxVideoContent.previewPhoto isKindOfClass:[UIImage class]]) {
            NSData *imageData = UIImagePNGRepresentation(rxVideoContent.previewPhoto);
            // 不能大于12m，防止误差压缩到11m
            imageData = [self dataScaleToBytes:11 * 1024 * 1024 withImageData:imageData];
            UIImage *img = [UIImage imageWithData:imageData];
            photo = [[FBSDKSharePhoto alloc] initWithImage:img isUserGenerated:YES];
            
        } else if ([rxVideoContent.previewPhoto isKindOfClass:[NSData class]]) {
            // 不能大于12m，防止误差压缩到11m
            NSData *imageData = [self dataScaleToBytes:11 * 1024 * 1024 withImageData:rxVideoContent.previewPhoto];
            UIImage *img = [UIImage imageWithData:imageData];
            photo = [[FBSDKSharePhoto alloc] initWithImage:img isUserGenerated:YES];
            
        } else if ([rxVideoContent.previewPhoto isKindOfClass:[NSString class]] && [[rxVideoContent.previewPhoto substringToIndex:4] containsString:@"http"]) {
            photo = [[FBSDKSharePhoto alloc] initWithImageURL:rxVideoContent.previewPhoto isUserGenerated:YES];
        } else {
            NSData *imageData = [NSData dataWithContentsOfFile:rxVideoContent.previewPhoto];
            // 不能大于12m，防止误差压缩到11m
            imageData = [self dataScaleToBytes:11 * 1024 * 1024 withImageData:imageData];
            UIImage *img = [UIImage imageWithData:imageData];
            FBSDKSharePhoto *photo = [[FBSDKSharePhoto alloc] initWithImage:img isUserGenerated:YES];
        }
        
        if (rxVideoContent.videoData) {
            video = [[FBSDKShareVideo alloc] initWithData:rxVideoContent.videoData previewPhoto:photo];
        } else {
            video = [[FBSDKShareVideo alloc] initWithVideoURL:rxVideoContent.videoURL previewPhoto:photo];
        }
        
        FBSDKShareVideoContent *videoContent = [[FBSDKShareVideoContent alloc] init];
        videoContent.video = video;
        
        FBSDKMessageDialog *dialog = [[FBSDKMessageDialog alloc] initWithContent:videoContent delegate:self];
        if (![dialog canShow]) {
            // fallback presentation when there is no FB app
    //                dialog.mode = FBSDKShareDialogModeFeedBrowser;
            RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
            
            NSMutableDictionary *errorRes = [NSMutableDictionary dictionary];
            [errorRes setValue:[RXErrorTool getRXErrorMsg:RXShareError_default] forKey:@"msg"];
            [errorRes setValue:@(RXShareError_default) forKey:@"code"];
            err.responesObject = errorRes;
            self.newShareCallBack(nil, err);
            return;
        }
        [dialog show];
    }
    
    
//    if ([shareInfo[@"material_type"] isEqualToString:@"image"]) {
//        __block FBSDKSharePhoto *photo = nil;
//        if ([shareInfo[@"image"] isKindOfClass:[UIImage class]]) {
//            NSData *imageData = UIImagePNGRepresentation(shareInfo[@"image"]);
//            // 不能大于12m，防止误差压缩到11m
//            imageData = [self dataScaleToBytes:11 * 1024 * 1024 withImageData:imageData];
//            imageData = [self fetchShareImageWithShreContent:shareInfo imageData:imageData];
//            UIImage *img = [UIImage imageWithData:imageData];
//            photo = [[FBSDKSharePhoto alloc] initWithImage:img isUserGenerated:YES];
//            FBSDKSharePhotoContent *photoContent = [[FBSDKSharePhotoContent alloc] init];
//            photoContent.photos = @[photo];
//
////            [FBSDKShareDialog showFromViewController:[self currentViewController] withContent:photoContent delegate:self];
////            FBSDKShareDialog *dialog = [[FBSDKShareDialog alloc] initWithViewController:[self currentViewController] content:photoContent delegate:self];
//
//            FBSDKMessageDialog *dialog = [[FBSDKMessageDialog alloc] initWithContent:photoContent delegate:self];
//
////            dialog.mode = shareMode; // if you don't set this before canShow call, canShow would always return YES
//            if (![dialog canShow]) {
//                // fallback presentation when there is no FB app
////                dialog.mode = FBSDKShareDialogModeFeedBrowser;
//                RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
//
//                NSMutableDictionary *errorRes = [NSMutableDictionary dictionary];
//                [errorRes setValue:[RXErrorTool getRXErrorMsg:RXShareError_default] forKey:@"msg"];
//                [errorRes setValue:@(RXShareError_default) forKey:@"code"];
//                err.responesObject = errorRes;
//                self.shareCallBack(nil, err);
//                return;
//            }
//            [dialog show];
//        } else if ([shareInfo[@"image"] isKindOfClass:[NSData class]]) {
//            // 不能大于12m，防止误差压缩到11m
//            NSData *imageData = [self dataScaleToBytes:11 * 1024 * 1024 withImageData:shareInfo[@"image"]];
//            imageData = [self fetchShareImageWithShreContent:shareInfo imageData:imageData];
//            UIImage *img = [UIImage imageWithData:imageData];
//            photo = [[FBSDKSharePhoto alloc] initWithImage:img isUserGenerated:YES];
//            FBSDKSharePhotoContent *photoContent = [[FBSDKSharePhotoContent alloc] init];
//            photoContent.photos = @[photo];
//
////            [FBSDKShareDialog showFromViewController:[self currentViewController] withContent:photoContent delegate:self];
//            FBSDKMessageDialog *dialog = [[FBSDKMessageDialog alloc] initWithContent:photoContent delegate:self];
//
////            dialog.mode = shareMode; // if you don't set this before canShow call, canShow would always return YES
//            if (![dialog canShow]) {
//                // fallback presentation when there is no FB app
////                dialog.mode = FBSDKShareDialogModeFeedBrowser;
//                RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
//
//                NSMutableDictionary *errorRes = [NSMutableDictionary dictionary];
//                [errorRes setValue:[RXErrorTool getRXErrorMsg:RXShareError_default] forKey:@"msg"];
//                [errorRes setValue:@(RXShareError_default) forKey:@"code"];
//                err.responesObject = errorRes;
//                self.shareCallBack(nil, err);
//                return;
//            }
//            [dialog show];
//        } else if ([shareInfo[@"image"] isKindOfClass:[NSString class]] && [[shareInfo[@"image"] substringToIndex:4] containsString:@"http"]) {
//            [self downImage:shareInfo[@"image"] complete:^(NSData *imgData) {
//                // 不能大于12m，防止误差压缩到11m
//                NSData *imageData = [self dataScaleToBytes:11 * 1024 * 1024 withImageData:imgData];
//                imageData = [self fetchShareImageWithShreContent:shareInfo imageData:imageData];
//                UIImage *img = [UIImage imageWithData:imageData];
//                photo = [[FBSDKSharePhoto alloc] initWithImage:img isUserGenerated:YES];
//                FBSDKSharePhotoContent *photoContent = [[FBSDKSharePhotoContent alloc] init];
//                photoContent.photos = @[photo];
//
////                [FBSDKShareDialog showFromViewController:[self currentViewController] withContent:photoContent delegate:self];
//                FBSDKMessageDialog *dialog = [[FBSDKMessageDialog alloc] initWithContent:photoContent delegate:self];
//
//    //            dialog.mode = shareMode; // if you don't set this before canShow call, canShow would always return YES
//                if (![dialog canShow]) {
//                    // fallback presentation when there is no FB app
//    //                dialog.mode = FBSDKShareDialogModeFeedBrowser;
//                    RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
//
//                    NSMutableDictionary *errorRes = [NSMutableDictionary dictionary];
//                    [errorRes setValue:[RXErrorTool getRXErrorMsg:RXShareError_default] forKey:@"msg"];
//                    [errorRes setValue:@(RXShareError_default) forKey:@"code"];
//                    err.responesObject = errorRes;
//                    self.shareCallBack(nil, err);
//                    return;
//                }
//                [dialog show];
//            }];
//        } else {
//            NSData *imageData = [NSData dataWithContentsOfFile:shareInfo[@"image"]];
//            // 不能大于12m，防止误差压缩到11m
//            imageData = [self dataScaleToBytes:11 * 1024 * 1024 withImageData:imageData];
//            imageData = [self fetchShareImageWithShreContent:shareInfo imageData:imageData];
//            UIImage *img = [UIImage imageWithData:imageData];
//            photo = [[FBSDKSharePhoto alloc] initWithImage:img isUserGenerated:YES];
//            FBSDKSharePhotoContent *photoContent = [[FBSDKSharePhotoContent alloc] init];
//            photoContent.photos = @[photo];
//
////            [FBSDKShareDialog showFromViewController:[self currentViewController] withContent:photoContent delegate:self];
//            FBSDKMessageDialog *dialog = [[FBSDKMessageDialog alloc] initWithContent:photoContent delegate:self];
//
////            dialog.mode = shareMode; // if you don't set this before canShow call, canShow would always return YES
//            if (![dialog canShow]) {
//                // fallback presentation when there is no FB app
////                dialog.mode = FBSDKShareDialogModeFeedBrowser;
//                RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
//
//                NSMutableDictionary *errorRes = [NSMutableDictionary dictionary];
//                [errorRes setValue:[RXErrorTool getRXErrorMsg:RXShareError_default] forKey:@"msg"];
//                [errorRes setValue:@(RXShareError_default) forKey:@"code"];
//                err.responesObject = errorRes;
//                self.shareCallBack(nil, err);
//                return;
//            }
//            [dialog show];
//        }
//    } else if ([shareInfo[@"material_type"] isEqualToString:@"link"]) {
//        NSString *shareUrl = shareInfo[@"url"];
//
//        FBSDKShareLinkContent *linkContent = [[FBSDKShareLinkContent alloc] init];
//        linkContent.contentURL = [NSURL URLWithString:shareUrl];
//        linkContent.quote = shareInfo[@"content"];
//
//        FBSDKMessageDialog *dialog = [[FBSDKMessageDialog alloc] initWithContent:linkContent delegate:self];
//
////            dialog.mode = shareMode; // if you don't set this before canShow call, canShow would always return YES
//        if (![dialog canShow]) {
//            // fallback presentation when there is no FB app
////                dialog.mode = FBSDKShareDialogModeFeedBrowser;
//            RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
//
//            NSMutableDictionary *errorRes = [NSMutableDictionary dictionary];
//            [errorRes setValue:[RXErrorTool getRXErrorMsg:RXShareError_default] forKey:@"msg"];
//            [errorRes setValue:@(RXShareError_default) forKey:@"code"];
//            err.responesObject = errorRes;
//            self.shareCallBack(nil, err);
//            return;
//        }
//        [dialog show];
//    } else if ([shareInfo[@"material_type"] isEqualToString:@"video"]) {
//
//        NSString *shareUrl = shareInfo[@"video"];
//        FBSDKShareVideo *video = nil;
//
//        // 封面
//        __block FBSDKSharePhoto *photo = nil;
//        if ([shareInfo[@"image"] isKindOfClass:[UIImage class]]) {
//            NSData *imageData = UIImagePNGRepresentation(shareInfo[@"image"]);
//            // 不能大于12m，防止误差压缩到11m
//            imageData = [self dataScaleToBytes:11 * 1024 * 1024 withImageData:imageData];
//            imageData = [self fetchShareImageWithShreContent:shareInfo imageData:imageData];
//            UIImage *img = [UIImage imageWithData:imageData];
//            photo = [[FBSDKSharePhoto alloc] initWithImage:img isUserGenerated:YES];
//        } else if ([shareInfo[@"image"] isKindOfClass:[NSData class]]) {
//            // 不能大于12m，防止误差压缩到11m
//            NSData *imageData = [self dataScaleToBytes:11 * 1024 * 1024 withImageData:shareInfo[@"image"]];
//            imageData = [self fetchShareImageWithShreContent:shareInfo imageData:imageData];
//            UIImage *img = [UIImage imageWithData:imageData];
//            photo = [[FBSDKSharePhoto alloc] initWithImage:img isUserGenerated:YES];
//        } else if ([shareInfo[@"image"] isKindOfClass:[NSString class]] && [[shareInfo[@"image"] substringToIndex:4] containsString:@"http"]) {
//            NSLock *cpuUsageLock = [[NSLock alloc] init];
//            [cpuUsageLock lock];
//            [self downImage:shareInfo[@"image"] complete:^(NSData *imgData) {
//                // 不能大于12m，防止误差压缩到11m
//                NSData *imageData = [self dataScaleToBytes:11 * 1024 * 1024 withImageData:imgData];
//                imageData = [self fetchShareImageWithShreContent:shareInfo imageData:imageData];
//                UIImage *img = [UIImage imageWithData:imageData];
//                photo = [[FBSDKSharePhoto alloc] initWithImage:img isUserGenerated:YES];
//                [cpuUsageLock unlock];
//            }];
//        }
//
//        if ([shareInfo[@"video"] isKindOfClass:[NSData class]]) {
//            video = [[FBSDKShareVideo alloc] initWithData:shareInfo[@"video"] previewPhoto:photo];
//        } else if ([shareInfo[@"video"] isKindOfClass:[NSURL class]]) {
//            video = [[FBSDKShareVideo alloc] initWithVideoURL:shareInfo[@"video"] previewPhoto:photo];
//        }
//
//        FBSDKShareVideoContent *videoContent = [[FBSDKShareVideoContent alloc] init];
//        videoContent.video = video;
//////        [FBSDKShareDialog showFromViewController:[self currentViewController] withContent:linkContent delegate:self];
//        FBSDKShareDialog *dialog = [[FBSDKShareDialog alloc] initWithViewController:[self currentViewController] content:videoContent delegate:self];
//        dialog.mode = shareMode; // if you don't set this before canShow call, canShow would always return YES
//        if (![dialog canShow]) {
//            // fallback presentation when there is no FB app
//            dialog.mode = FBSDKShareDialogModeFeedBrowser;
//        }
//        [dialog show];
//    }
}

/**
 * Messenger分享
 * 推荐使用 messengerShareWithContent:complete
 * @param shareInfo 获取分享信息返回的内容  必须
 */
- (void)messengerShareWithShareInfo:(NSDictionary *)shareInfo
                           complete:(FBShareCallBack)complete
{
    self.shareCallBack = complete;
    if ([shareInfo[@"material_type"] isEqualToString:@"image"]) {
        __block FBSDKSharePhoto *photo = nil;
        if ([shareInfo[@"image"] isKindOfClass:[UIImage class]]) {
            NSData *imageData = UIImagePNGRepresentation(shareInfo[@"image"]);
            // 不能大于12m，防止误差压缩到11m
            imageData = [self dataScaleToBytes:11 * 1024 * 1024 withImageData:imageData];
            imageData = [self fetchShareImageWithShreContent:shareInfo imageData:imageData borderSize:[shareInfo[@"borderSize"] floatValue]];
            UIImage *img = [UIImage imageWithData:imageData];
            photo = [[FBSDKSharePhoto alloc] initWithImage:img isUserGenerated:YES];
            FBSDKSharePhotoContent *photoContent = [[FBSDKSharePhotoContent alloc] init];
            photoContent.photos = @[photo];
            
            //            [FBSDKShareDialog showFromViewController:[self currentViewController] withContent:photoContent delegate:self];
            //            FBSDKShareDialog *dialog = [[FBSDKShareDialog alloc] initWithViewController:[self currentViewController] content:photoContent delegate:self];
            
            FBSDKMessageDialog *dialog = [[FBSDKMessageDialog alloc] initWithContent:photoContent delegate:self];
            
            //            dialog.mode = shareMode; // if you don't set this before canShow call, canShow would always return YES
            if (![dialog canShow]) {

                self.shareCallBack(NO);
                return;
            }
            [dialog show];
        } else if ([shareInfo[@"image"] isKindOfClass:[NSData class]]) {
            // 不能大于12m，防止误差压缩到11m
            NSData *imageData = [self dataScaleToBytes:11 * 1024 * 1024 withImageData:shareInfo[@"image"]];
            imageData = [self fetchShareImageWithShreContent:shareInfo imageData:imageData borderSize:[shareInfo[@"borderSize"] floatValue]];
            UIImage *img = [UIImage imageWithData:imageData];
            photo = [[FBSDKSharePhoto alloc] initWithImage:img isUserGenerated:YES];
            FBSDKSharePhotoContent *photoContent = [[FBSDKSharePhotoContent alloc] init];
            photoContent.photos = @[photo];
            
            //            [FBSDKShareDialog showFromViewController:[self currentViewController] withContent:photoContent delegate:self];
            FBSDKMessageDialog *dialog = [[FBSDKMessageDialog alloc] initWithContent:photoContent delegate:self];
            
            //            dialog.mode = shareMode; // if you don't set this before canShow call, canShow would always return YES
            if (![dialog canShow]) {
                self.shareCallBack(NO);
                return;
            }
            [dialog show];
        } else if ([shareInfo[@"image"] isKindOfClass:[NSString class]] && [[shareInfo[@"image"] substringToIndex:4] containsString:@"http"]) {
            [self downImage:shareInfo[@"image"] complete:^(NSData *imgData) {
                // 不能大于12m，防止误差压缩到11m
                NSData *imageData = [self dataScaleToBytes:11 * 1024 * 1024 withImageData:imgData];
                imageData = [self fetchShareImageWithShreContent:shareInfo imageData:imageData borderSize:[shareInfo[@"borderSize"] floatValue]];
                UIImage *img = [UIImage imageWithData:imageData];
                photo = [[FBSDKSharePhoto alloc] initWithImage:img isUserGenerated:YES];
                FBSDKSharePhotoContent *photoContent = [[FBSDKSharePhotoContent alloc] init];
                photoContent.photos = @[photo];
                
                //                [FBSDKShareDialog showFromViewController:[self currentViewController] withContent:photoContent delegate:self];
                FBSDKMessageDialog *dialog = [[FBSDKMessageDialog alloc] initWithContent:photoContent delegate:self];
                
                //            dialog.mode = shareMode; // if you don't set this before canShow call, canShow would always return YES
                if (![dialog canShow]) {
                    self.shareCallBack(NO);
                    return;
                }
                [dialog show];
            }];
        } else {
            NSData *imageData = [NSData dataWithContentsOfFile:shareInfo[@"image"]];
            // 不能大于12m，防止误差压缩到11m
            imageData = [self dataScaleToBytes:11 * 1024 * 1024 withImageData:imageData];
            imageData = [self fetchShareImageWithShreContent:shareInfo imageData:imageData borderSize:[shareInfo[@"borderSize"] floatValue]];
            UIImage *img = [UIImage imageWithData:imageData];
            photo = [[FBSDKSharePhoto alloc] initWithImage:img isUserGenerated:YES];
            FBSDKSharePhotoContent *photoContent = [[FBSDKSharePhotoContent alloc] init];
            photoContent.photos = @[photo];
            
            //            [FBSDKShareDialog showFromViewController:[self currentViewController] withContent:photoContent delegate:self];
            FBSDKMessageDialog *dialog = [[FBSDKMessageDialog alloc] initWithContent:photoContent delegate:self];
            
            //            dialog.mode = shareMode; // if you don't set this before canShow call, canShow would always return YES
            if (![dialog canShow]) {
                self.shareCallBack(NO);
                return;
            }
            [dialog show];
        }
    } else if ([shareInfo[@"material_type"] isEqualToString:@"link"]) {
        NSString *shareUrl = shareInfo[@"url"];
        
        FBSDKShareLinkContent *linkContent = [[FBSDKShareLinkContent alloc] init];
        linkContent.contentURL = [NSURL URLWithString:shareUrl];
        linkContent.quote = shareInfo[@"content"];
        
        FBSDKMessageDialog *dialog = [[FBSDKMessageDialog alloc] initWithContent:linkContent delegate:self];
        
//                    dialog.mode = shareMode; // if you don't set this before canShow call, canShow would always return YES
        if (![dialog canShow]) {
            self.shareCallBack(NO);
            return;
        }
        [dialog show];
    } else if ([shareInfo[@"material_type"] isEqualToString:@"video"]) {
        
        NSString *shareUrl = shareInfo[@"video"];
        FBSDKShareVideo *video = nil;
        
        // 封面
        __block FBSDKSharePhoto *photo = nil;
        if ([shareInfo[@"image"] isKindOfClass:[UIImage class]]) {
            NSData *imageData = UIImagePNGRepresentation(shareInfo[@"image"]);
            // 不能大于12m，防止误差压缩到11m
            imageData = [self dataScaleToBytes:11 * 1024 * 1024 withImageData:imageData];
            UIImage *img = [UIImage imageWithData:imageData];
            photo = [[FBSDKSharePhoto alloc] initWithImage:img isUserGenerated:YES];
        } else if ([shareInfo[@"image"] isKindOfClass:[NSData class]]) {
            // 不能大于12m，防止误差压缩到11m
            NSData *imageData = [self dataScaleToBytes:11 * 1024 * 1024 withImageData:shareInfo[@"image"]];
            UIImage *img = [UIImage imageWithData:imageData];
            photo = [[FBSDKSharePhoto alloc] initWithImage:img isUserGenerated:YES];
        } else if ([shareInfo[@"image"] isKindOfClass:[NSString class]] && [[shareInfo[@"image"] substringToIndex:4] containsString:@"http"]) {
            NSLock *cpuUsageLock = [[NSLock alloc] init];
            [cpuUsageLock lock];
            [self downImage:shareInfo[@"image"] complete:^(NSData *imgData) {
                // 不能大于12m，防止误差压缩到11m
                NSData *imageData = [self dataScaleToBytes:11 * 1024 * 1024 withImageData:imgData];
                UIImage *img = [UIImage imageWithData:imageData];
                photo = [[FBSDKSharePhoto alloc] initWithImage:img isUserGenerated:YES];
                [cpuUsageLock unlock];
            }];
        }
        
        if ([shareInfo[@"video"] isKindOfClass:[NSData class]]) {
            video = [[FBSDKShareVideo alloc] initWithData:shareInfo[@"video"] previewPhoto:photo];
        } else if ([shareInfo[@"video"] isKindOfClass:[NSURL class]]) {
            video = [[FBSDKShareVideo alloc] initWithVideoURL:shareInfo[@"video"] previewPhoto:photo];
        }
        
        FBSDKShareVideoContent *videoContent = [[FBSDKShareVideoContent alloc] init];
        videoContent.video = video;
        
        //        [FBSDKShareDialog showFromViewController:[self currentViewController] withContent:linkContent delegate:self];
        FBSDKShareDialog *dialog = [[FBSDKShareDialog alloc] initWithViewController:[self currentViewController] content:videoContent delegate:self];
        if (![dialog canShow]) {
            // fallback presentation when there is no FB app
            dialog.mode = FBSDKShareDialogModeFeedBrowser;
        }
        [dialog show];
    }
}

#pragma mark -- <FBSDKSharingDelegate>
- (void)sharer:(id<FBSDKSharing>)sharer didCompleteWithResults:(NSDictionary<NSString *,id> *)results
{
    NSLog(@"分享成功");
    if (self.shareCallBack) {
        self.shareCallBack(YES);
    }

    if (self.newShareCallBack) {
        NSMutableDictionary *successRes = [NSMutableDictionary dictionary];
        [successRes setValue:@(0) forKey:@"code"];
//        [successRes setValue:@"分享成功" forKey:@"msg"];
        self.newShareCallBack(successRes, nil);
    }
}

- (void)sharer:(id<FBSDKSharing>)sharer didFailWithError:(NSError *)error
{
    NSLog(@"分享失败");
    if (self.shareCallBack) {
        self.shareCallBack(NO);
    }
    
    if (self.newShareCallBack) {
        RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
        
        NSMutableDictionary *errorRes = [NSMutableDictionary dictionary];
        [errorRes setValue:[RXErrorTool getRXErrorMsg:RXShareError_third] forKey:@"msg"];
        [errorRes setValue:@(RXShareError_third) forKey:@"code"];
        [errorRes setValue:error.localizedDescription forKey:@"thirdmsg"];
        [errorRes setValue:@(error.code) forKey:@"thirdcode"];
        err.responesObject = errorRes;
        self.newShareCallBack(nil, err);
    }
}

- (void)sharerDidCancel:(id<FBSDKSharing>)sharer
{
    NSLog(@"取消分享");
    if (self.shareCallBack) {
        self.shareCallBack(NO);
    }
    
    if (self.newShareCallBack) {
        RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
        
        NSMutableDictionary *errorRes = [NSMutableDictionary dictionary];
        [errorRes setValue:[RXErrorTool getRXErrorMsg:RXShareError_cancel] forKey:@"msg"];
        [errorRes setValue:@(RXShareError_cancel) forKey:@"code"];
        err.responesObject = errorRes;
        self.newShareCallBack(nil, err);
    }
}

/**
 * 同步信息
 * 调用后会跳转到Facebook授权登录，但不会走登录回调，同步信息通过此接口回调
 */
- (void)syncInfoWithComplete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    NSMutableDictionary *extDic1 = [NSMutableDictionary dictionary];
    
    FBSDKLoginManager *login = [[FBSDKLoginManager alloc] init];
    [login logOut]; // 防止换一个帐号就无法获取信息的错误
    
    NSArray *permissions = [[NSUserDefaults standardUserDefaults] valueForKey:PermissonsKey];
    
    [login logInWithPermissions:permissions fromViewController:[self currentViewController] handler:^(FBSDKLoginManagerLoginResult *result, NSError *error) {
        NSLog(@"facebook login result = %@,error = %@", result, error);
        if (error) {
            NSLog(@"Process error");
//            [[NSNotificationCenter defaultCenter] postNotificationName:@"noti_LoginFail" object:nil userInfo:@{@"error" : error}];
            
        } else if (result.isCancelled) {
            NSLog(@"Cancelled");
            NSString *domain = @"com.rx.fbapi";
            NSMutableDictionary *userInfo = [NSMutableDictionary dictionary];
            userInfo[@"msg"] = @"登录取消";
            NSError *error = [NSError errorWithDomain:domain code:RXLoginError_cancel userInfo:userInfo];

//            [[NSNotificationCenter defaultCenter] postNotificationName:@"noti_LoginFail" object:nil userInfo:@{@"error" : error}];
            
        } else {
            NSLog(@"Logged in %@",result.token.userID);
            
            [extDic1 setValue:result.token.tokenString forKey:@"access_token"];
            [extDic1 setValue:result.token.userID forKey:@"user_id"];
            [extDic1 setValue:result.token.appID forKey:@"app_id"];
            [extDic1 setValue:[result.token.permissions allObjects] forKey:@"permissions"];
            NSTimeInterval timeInterval = [result.token.expirationDate timeIntervalSince1970];
            [extDic1 setValue:@([[NSString stringWithFormat:@"%.0f", timeInterval] integerValue]) forKey:@"access_expires"];
            
            [[RXApiService sharedSDK] syncInfoWithParams:extDic1 complete:complete];
        }
    }];
}

#pragma mark - 二维码
- (UIImage *)rxQRCodeForString:(NSString *)tString
                          size:(CGSize)tSize
                     fillColor:(UIColor *)tFillColor
                     iconImage:(UIImage *)tIconImage
                    borderSize:(CGFloat)borderSize
{
    // 内容不能为空
    if (!tString || tString.length == 0) {
        return [UIImage new];
    }

    NSData *stringData = [tString dataUsingEncoding: NSUTF8StringEncoding];
    //生成
    CIFilter *qrFilter = [CIFilter filterWithName:@"CIQRCodeGenerator"];
    [qrFilter setValue:stringData forKey:@"inputMessage"];
    [qrFilter setValue:@"H" forKey:@"inputCorrectionLevel"];
    //上色
    UIColor *onColor = [UIColor blackColor];
    if (tFillColor) {
        onColor = tFillColor;
    }
    UIColor *offColor = [UIColor whiteColor];
    CIFilter *colorFilter = [CIFilter filterWithName:@"CIFalseColor" keysAndValues: @"inputImage",qrFilter.outputImage, @"inputColor0",[CIColor colorWithCGColor:onColor.CGColor], @"inputColor1",[CIColor colorWithCGColor:offColor.CGColor], nil];
    // 生成
    CIImage *qrImage = colorFilter.outputImage;
    CGSize lSize = tSize;// * [UIScreen mainScreen].scale
    CGFloat tScale = MIN(lSize.width/CGRectGetWidth(qrImage.extent), lSize.height/CGRectGetHeight(qrImage.extent));
    CIImage *tTransformImage = [qrImage imageByApplyingTransform:CGAffineTransformMakeScale(tScale,tScale)];
    // 保存
    CIContext *tContext = [CIContext contextWithOptions:nil];
    CGImageRef tImageRef = [tContext createCGImage:tTransformImage fromRect:tTransformImage.extent];
    UIImage *tCodeImage = [UIImage imageWithCGImage:tImageRef];
    // 释放
    CGImageRelease(tImageRef);
//        UIImage *tCodeImage = [self changeImageSizeWithCIImage:[self createQRcodeWithUrlString:tString?tString:@""] size:lSize];
    // 添加icon
    if (tIconImage) {
        UIGraphicsBeginImageContext(CGSizeMake(lSize.width, lSize.height));
        [tCodeImage drawInRect:CGRectMake(0, 0, lSize.width, lSize.height)];
        CGFloat iconSize = 1.0/5.5*lSize.width;
        [tIconImage drawInRect:CGRectMake((lSize.width-iconSize)/2.0, (lSize.height-iconSize)/2.0, iconSize, iconSize)];
        UIImage *resultImage = UIGraphicsGetImageFromCurrentImageContext();
        UIGraphicsEndImageContext();
        
        if (borderSize > 0) {
            resultImage = [self addWhiteBorderToQRCode:resultImage withBorderSize:borderSize];
        }
        
        return resultImage;
    }
    
    if (borderSize > 0) {
        tCodeImage = [self addWhiteBorderToQRCode:tCodeImage withBorderSize:borderSize];
    }
    
    return tCodeImage;
}

// 二维码白边
- (UIImage *)addWhiteBorderToQRCode:(UIImage *)image withBorderSize:(CGFloat)borderSize
{
    CGSize size = CGSizeMake(image.size.width + 2 * borderSize, image.size.height + 2 * borderSize);
    
    UIGraphicsBeginImageContextWithOptions(size, NO, image.scale);
    [[UIColor whiteColor] setFill];
    UIRectFill(CGRectMake(0, 0, size.width, size.height));
    [image drawInRect:CGRectMake(borderSize, borderSize, image.size.width, image.size.height)];
    UIImage *imageWithBorder = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    
    return imageWithBorder;
}

#pragma mark -- <view生成image>
- (UIImage *)makeImageWithView:(UIView *)view withSize:(CGSize)size
{
    //下面方法，第一个参数表示区域大小。第二个参数表示是否是非透明的。如果需要显示半透明效果，需要传NO，否则传YES。第三个参数就是屏幕密度了，关键就是第三个参数 [UIScreen mainScreen].scale。
    UIGraphicsBeginImageContextWithOptions(size, YES, [UIScreen mainScreen].scale);
    [view.layer renderInContext:UIGraphicsGetCurrentContext()];
    UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return image;
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

// 图片压缩
- (NSData *)dataScaleToBytes:(long)bytes withImageData:(NSData *)imageData
{
    while (imageData.length >= bytes)
    {
        UIImage *image = [UIImage imageWithData:imageData];
        CGSize newSize = CGSizeMake(image.size.width/1.1, image.size.height/1.1);
        UIGraphicsBeginImageContext(newSize);
        [image drawInRect:CGRectMake(0,0,newSize.width,newSize.height)];
        UIImage* newImage = UIGraphicsGetImageFromCurrentImageContext();
        UIGraphicsEndImageContext();
        imageData = UIImageJPEGRepresentation(newImage, 1);
    }
    return imageData;
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
