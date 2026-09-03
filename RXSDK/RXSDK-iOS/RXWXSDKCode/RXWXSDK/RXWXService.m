//
//  RXWXService.m
//  RXWXSDK
//
//  Created by 陈汉 on 2022/5/30.
//

#import "RXWXService.h"
#import "RXWXTool.h"
#import <WechatOpenSDK/WXApi.h>
#import <WechatOpenSDK/WechatAuthSDK.h>
#import "RXWXShareModel.h"
#import "RXWXFetchShareModel.h"
#import "NSObject+RXWXAddition.h"
#import <RXSDK_Pure/RXErrorTool.h>
#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXSDK_Pure/RXNotificationCenter.h>
#import <RXSDK_Pure/RXSubPackage.h>

typedef void(^ShareCallBack)(BOOL success);
typedef void(^NewShareCallBack)(NSDictionary *response, RX_CommonRequestError *error);
typedef void(^CommonCallBack)(NSDictionary *response, RX_CommonRequestError *error);
typedef void(^OpenMiniProgramBlock)(NSString *extMsg);
typedef void(^OpenBusinessViewBlock)(NSDictionary *response, RX_CommonRequestError *error);

@interface RXWXService () <WXApiDelegate>

@property (nonatomic, copy) ShareCallBack shareCallBack;
@property (nonatomic, copy) NewShareCallBack newShareCallBack;
@property (nonatomic, copy) OpenMiniProgramBlock openMiniProgramBlock;
@property (nonatomic, copy) OpenBusinessViewBlock openBusinessViewBlock;
@property (nonatomic, copy) CommonCallBack bindAccountCallback;
@property (nonatomic, strong) NSString *migrate_args;
@property (nonatomic, strong) NSArray *sign_fields;
@property (nonatomic, assign) BOOL autoReport;
@property (nonatomic, assign) BOOL isSync;
@property (nonatomic, assign) BOOL isBindAccount;
@property (nonatomic, copy) NewShareCallBack syncCallBack;
//调用微信方法是否来源于主库，字符串为YES来源于主库调用，其他情况非源自主库调用
@property (nonatomic, copy) NSString *isFromRXPure;

@end

@implementation RXWXService

static RXWXService *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXWXService alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        
        NSLog(@"RXSDK--RXWXSDK  Version: %@", sdkVersion);
        
        [RXSubPackage sharedSDK].aW = YES;
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(shareAction:) name:rxUserDefault_share_w object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(loginAction:) name:rxUserDefault_login_w object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(bindAction:) name:rxUserDefault_bind_w object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(openUrlAction:) name:rxUserDefault_openurl object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(ulinkAction:) name:rxUserDefault_ulink object:nil];
    }
    return self;
}

#pragma mark -- from main framework
- (void)ulinkAction:(NSNotification *)noti
{
    UIApplication *app = noti.userInfo[@"app"];
    NSUserActivity *url = noti.userInfo[@"userActivity"];
    
    [self handleOpenUniversalLink:url];
}

- (void)openUrlAction:(NSNotification *)noti
{
    UIApplication *app = noti.userInfo[@"app"];
    NSURL *url = noti.userInfo[@"url"];
    NSDictionary *options = noti.userInfo[@"options"];
    
    [self handleOpenUrl:url];
}

- (void)bindAction:(NSNotification *)noti
{
    NSString *appid = noti.userInfo[@"appid"];
    NSDictionary *ext = noti.userInfo[@"ext"];
    
    self.bindAccountCallback = noti.userInfo[@"callback"];
    self.isBindAccount = YES;
    
    [self newLoginReq_wWithWXAppid:appid ext:ext migrate_args:nil sign_fields:nil];
}

- (void)shareAction:(NSNotification *)noti
{
    NSDictionary *shareInfo = noti.userInfo[@"shareInfo"];
    NewShareCallBack callback = noti.userInfo[@"callback"];
    
    [self newShareToWWithShareInfo:shareInfo complete:callback];
}

- (void)loginAction:(NSNotification *)noti
{
    @try {
        NSString *appid = noti.userInfo[@"appid"];
        id migrateArgs = noti.userInfo[@"migrateArgs"];
        NSArray *signFields = noti.userInfo[@"signFields"];
        NSDictionary *ext = noti.userInfo[@"ext"];
        
        [self newLoginReq_wWithWXAppid:appid ext:ext migrate_args:migrateArgs sign_fields:signFields];
    } @catch (NSException *exception) {
        NSLog(@"%@", exception);
    } @finally {
        
    }
}

/**
 * 配置universallink
 */
- (void)configUniversallink:(NSString *)universallink
{
    [RXWXTool saveUniversallink:universallink];
}

/**
 * 微信分享
 * @param shareInfo 获取分享信息返回的内容  必须
 */
- (void)shareToWWithShareInfo:(NSDictionary *)shareInfo
                     complete:(void(^)(BOOL success))complete
{
    if (!shareInfo) {
        if (self.newShareCallBack) {
            RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
            
            NSMutableDictionary *errorRes = [NSMutableDictionary dictionary];
            [errorRes setValue:[RXErrorTool getRXErrorMsg:RXShareError_default] forKey:@"msg"];
            [errorRes setValue:@(RXShareError_default) forKey:@"code"];
            err.responesObject = errorRes;
            self.newShareCallBack(nil, err);
            return;
        }
    }
    
    if(![WXApi isWXAppInstalled]) {
        RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
        
        NSMutableDictionary *errorRes = [NSMutableDictionary dictionary];
        [errorRes setValue:[RXErrorTool getRXErrorMsg:RXLimitError_noWechat] forKey:@"msg"];
        [errorRes setValue:@(RXLimitError_noWechat) forKey:@"code"];
        err.responesObject = errorRes;
        
        self.newShareCallBack(nil, err);
        return;
    }
    
    self.isFromRXPure = shareInfo[@"isFromRXPure"];
    
    __block RXWXFetchShareModel *shareContent = [RXWXFetchShareModel rxwx_modelWithDictionary:shareInfo];
//    int scene = (int)shareContent.shareScene - 1;
    int scene = (int)shareContent.shareScene;
    self.shareCallBack = complete;
    NSLog(@"分享数据:\n %@", shareInfo);
    if (scene == 0 || scene == 1) {
        NSLog(@"开始分享 %@", [RXWXTool sharedSDK].universallink);
        if (shareContent.appid.length > 0) {
            [WXApi registerApp:shareContent.appid universalLink:[RXWXTool sharedSDK].universallink];
        }else{
            [WXApi registerApp:shareContent.thirdAppid universalLink:[RXWXTool sharedSDK].universallink];
        }
        
        
//        [WXApi checkUniversalLinkReady:^(WXULCheckStep step, WXCheckULStepResult * _Nonnull result) {
//            NSLog(@"checkUniversalLinkReady:%@, %u, %@, %@", @(step), result.success, result.errorInfo, result.suggestion);
//
//        }];
//            NSLog(@"%@", [RXUserUtility sharedManager].universallink);
        SendMessageToWXReq *req = [[SendMessageToWXReq alloc] init];
        if ([shareContent.material_type isEqualToString:@"text"]) { // 文本
            req.bText = YES;
            req.text = shareContent.content;
            req.scene = scene;
            [WXApi sendReq:req completion:^(BOOL success) {

            }];
        } else if ([shareContent.material_type isEqualToString:@"image"] || [shareContent.material_type isEqualToString:@"langing"] || [shareContent.material_type isEqualToString:@"landing"]) { // 单图
            if ([shareContent.image isKindOfClass:[NSString class]] && [[shareContent.image substringToIndex:4] containsString:@"http"]) {
                __block WXImageObject *imageObj = [WXImageObject object];
                [self downImage:[shareContent.image stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding] complete:^(NSData *imgData) {
                    // 不能大于25m，防止误差压缩到23m
                    NSData *imageData = [RXWXTool dataScaleToBytes:23 * 1024 * 1024 withImageData:imgData];
                    if (shareContent.url && shareContent.url.length > 0) {
                        NSString *shareUrl = shareContent.url;
                        UIImage *qrCodeImg = [RXWXTool rxQRCodeForString:shareUrl size:CGSizeMake(shareContent.width, shareContent.height) fillColor:[UIColor blackColor] iconImage:nil];
                        UIImage *bgView = [UIImage imageWithData:imageData];
                        CGFloat fixelW = CGImageGetWidth(bgView.CGImage);
                        CGFloat fixelH = CGImageGetHeight(bgView.CGImage);
                        UIImageView *shareImgView = [[UIImageView alloc] initWithFrame:CGRectMake(0, 0, fixelW, fixelH)];
                        shareImgView.image = bgView;
                        UIImageView *qrCodeImgView = [[UIImageView alloc] initWithFrame:CGRectMake(shareContent.x, shareContent.y, shareContent.width, shareContent.height)];
                        qrCodeImgView.image = qrCodeImg;
                        [shareImgView addSubview:qrCodeImgView];
                        
                        UIImage *shareImg = [RXWXTool makeImageWithView:shareImgView withSize:shareImgView.frame.size];
                        NSData *shareImgData = UIImagePNGRepresentation(shareImg);
                        imageData = [RXWXTool dataScaleToBytes:23 * 1024 * 1024 withImageData:shareImgData];
                    }

                    imageObj.imageData = imageData;
                    WXMediaMessage *message = [WXMediaMessage message];
                    message.mediaObject = imageObj;
                    req.bText = NO;
                    req.message = message;
                    req.scene = scene;
                    [WXApi sendReq:req completion:^(BOOL success) {

                    }];
                }];
            } else {
                UIImage *shareImage;
                if ([shareContent.image isKindOfClass:[UIImage class]]) {
                    shareImage = shareContent.image;
                } else if ([shareContent.image isKindOfClass:[NSData class]]) {
                    shareImage = [UIImage imageWithData:shareContent.image];
                } else if ([shareContent.image isKindOfClass:[NSString class]]) {
                    NSData *imageData = [NSData dataWithContentsOfFile:shareContent.image];
                    shareImage = [UIImage imageWithData:imageData];
                }
                
                // 不能大于25m，防止误差压缩到23m
                NSData *imageData = [RXWXTool dataScaleToBytes:23 * 1024 * 1024 withImageData:UIImageJPEGRepresentation(shareImage, 1.0)];
                
                WXImageObject *imageObj = [WXImageObject object];
                if (shareContent.url && shareContent.url.length > 0) {
                    NSString *shareUrl = shareContent.url;
                    UIImage *qrCodeImg = [RXWXTool rxQRCodeForString:shareUrl size:CGSizeMake(shareContent.width, shareContent.height) fillColor:[UIColor blackColor] iconImage:nil];
                    UIImage *bgView = [UIImage imageWithData:imageData];
                    CGFloat fixelW = CGImageGetWidth(bgView.CGImage);
                    CGFloat fixelH = CGImageGetHeight(bgView.CGImage);
                    UIImageView *shareImgView = [[UIImageView alloc] initWithFrame:CGRectMake(0, 0, fixelW, fixelH)];
                    shareImgView.image = bgView;
                    UIImageView *qrCodeImgView = [[UIImageView alloc] initWithFrame:CGRectMake(shareContent.x, shareContent.y, shareContent.width, shareContent.height)];
                    qrCodeImgView.image = qrCodeImg;
                    [shareImgView addSubview:qrCodeImgView];
                    
                    UIImage *shareImg = [RXWXTool makeImageWithView:shareImgView withSize:shareImgView.frame.size];
                    NSData *shareImgData = UIImagePNGRepresentation(shareImg);
                    imageData = [RXWXTool dataScaleToBytes:23 * 1024 * 1024 withImageData:shareImgData];
                }

                imageObj.imageData = imageData;
                WXMediaMessage *message = [WXMediaMessage message];
                message.mediaObject = imageObj;
                req.bText = NO;
                req.message = message;
                req.scene = scene;
                [WXApi sendReq:req completion:^(BOOL success) {

                }];
            }
        } else if ([shareContent.material_type isEqualToString:@"link"]) { // 链接
            if ([shareContent.image isKindOfClass:[NSString class]] && [[shareContent.image substringToIndex:4] containsString:@"http"]) {
                [self downImage:[shareContent.image stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding] complete:^(NSData *imgData) {
                    // 缩略图不能大于32k，防止误差压缩到30k
                    NSData *imageData = [RXWXTool dataScaleToBytes:30 * 1024 withImageData:imgData];

                    NSString *shareUrl = shareContent.url;
                    WXWebpageObject *webpageObject = [WXWebpageObject object];
                    webpageObject.webpageUrl = shareUrl;
                    WXMediaMessage *message = [WXMediaMessage message];
                    message.title = shareContent.title;
                    if (scene == 1 && shareContent.show_content_in_circle) {
                        message.title = shareContent.content;
                    }
                    message.description = shareContent.content;
                    [message setThumbImage:[UIImage imageWithData:imageData]];
                    message.mediaObject = webpageObject;
                    req.bText = NO;
                    req.message = message;
                    req.scene = scene;
                    [WXApi sendReq:req completion:^(BOOL success) {
                        
                    }];
                }];
            } else {
                UIImage *shareImage;
                if ([shareContent.image isKindOfClass:[UIImage class]]) {
                    shareImage = shareContent.image;
                } else if ([shareContent.image isKindOfClass:[NSData class]]) {
                    shareImage = [UIImage imageWithData:shareContent.image];
                } else if ([shareContent.image isKindOfClass:[NSString class]]) {
                    NSData *imageData = [NSData dataWithContentsOfFile:shareContent.image];
                    shareImage = [UIImage imageWithData:imageData];
                }
                
                // 缩略图不能大于32k，防止误差压缩到30k
                NSData *imageData = [RXWXTool dataScaleToBytes:30 * 1024 withImageData:UIImageJPEGRepresentation(shareImage, 1.0)];

                NSString *shareUrl = shareContent.url;
                WXWebpageObject *webpageObject = [WXWebpageObject object];
                webpageObject.webpageUrl = shareUrl;
                WXMediaMessage *message = [WXMediaMessage message];
                message.title = shareContent.title;
                if (scene == 1 && shareContent.show_content_in_circle) {
                    message.title = shareContent.content;
                }
                message.description = shareContent.content;
                [message setThumbImage:[UIImage imageWithData:imageData]];
                message.mediaObject = webpageObject;
                req.bText = NO;
                req.message = message;
                req.scene = scene;
                [WXApi sendReq:req completion:^(BOOL success) {
                    
                }];
            }
        } else if ([shareContent.material_type isEqualToString:@"video"]) { // 视频
            WXVideoObject *videoObject = [WXVideoObject object];
            videoObject.videoUrl = shareContent.videoUrl;
            
            WXMediaMessage *message = [WXMediaMessage message];
            message.title = shareContent.title;
            if (scene == 1 && shareContent.show_content_in_circle) {
                message.title = shareContent.content;
            }
            message.description = shareContent.content;

            if ([shareContent.image isKindOfClass:[NSString class]] && [[shareContent.image substringToIndex:4] containsString:@"http"]) {
                [self downImage:[shareContent.image stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding] complete:^(NSData *imgData) {
                    
                    // 缩略图不能大于32k，防止误差压缩到30k
                    NSData *imageData = [RXWXTool dataScaleToBytes:30 * 1024 withImageData:imgData];
                    
                    message.thumbData = imgData;
                    message.mediaObject = videoObject;
                    req.bText = NO;
                    req.message = message;
                    req.scene = scene;
                    [WXApi sendReq:req completion:^(BOOL success) {
                        
                    }];
                }];
            } else {
                UIImage *shareImage;
                if ([shareContent.image isKindOfClass:[UIImage class]]) {
                    shareImage = shareContent.image;
                } else if ([shareContent.image isKindOfClass:[NSData class]]) {
                    shareImage = [UIImage imageWithData:shareContent.image];
                } else if ([shareContent.image isKindOfClass:[NSString class]]) {
                    NSData *imageData = [NSData dataWithContentsOfFile:shareContent.image];
                    shareImage = [UIImage imageWithData:imageData];
                }
                
                // 缩略图不能大于32k，防止误差压缩到30k
                NSData *imageData = [RXWXTool dataScaleToBytes:30 * 1024 withImageData:UIImageJPEGRepresentation(shareImage, 1.0)];
                
                [message setThumbImage:[UIImage imageWithData:imageData]];
                message.mediaObject = videoObject;
                req.bText = NO;
                req.message = message;
                req.scene = scene;
                [WXApi sendReq:req completion:^(BOOL success) {
                    
                }];
            }
        }
    } else {
        if (self.newShareCallBack) {
            RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
            
            NSMutableDictionary *errorRes = [NSMutableDictionary dictionary];
            [errorRes setValue:[RXErrorTool getRXErrorMsg:RXShareError_default] forKey:@"msg"];
            [errorRes setValue:@(RXShareError_default) forKey:@"code"];
            err.responesObject = errorRes;
            self.newShareCallBack(nil, err);
        }
    }
}

/**
 * 微信分享New 返回具体错误码
 */
- (void)newShareToWWithShareInfo:(NSDictionary *)shareInfo
                        complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    self.newShareCallBack = complete;
    [self shareToWWithShareInfo:shareInfo complete:nil];
}

/**
 * 微信分享（直接调用，不需要获取分享信息）
 * @param func 埋点标识  必须
 * @param platform 分享平台 wechat
 * @param region 地区码  非必须
 * @param transmits 透传参数，原样返回， 请使用key=value形式，并对值使用urlencode，返回时会原样返回  非必须
 * @param ext 扩展字段，拼接url用  非必须
 */
- (void)shareToWWithFunc:(NSString *)func
                platform:(NSString *)platform
                  region:(NSString *)region
               transmits:(NSString * _Nullable)transmits
                     ext:(NSDictionary * _Nullable)ext
                complete:(void(^)(BOOL success))complete
{
    if([WXApi isWXAppInstalled]) {
        self.shareCallBack = complete;
        
        if (ext[@"autoReport"]) {
            self.autoReport = [ext[@"autoReport"] boolValue];
        }
        
        [[RXShareService sharedSDK] getShareInfoWithFunc:func platform:platform region:region transmits:transmits ext:ext complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
            if (!error) {
                __block RXWXShareModel *shareModel = [RXWXShareModel rxwx_modelWithDictionary:response[@"data"]];
                RXWXShareContent *shareContent = shareModel.content;
                RXWXSharePlatforms *sharePlatforms = shareModel.platforms;
                int scene = (int)sharePlatforms.wechat - 1;
                
                if (scene == 0 || scene == 1) {
                    
                    [WXApi registerApp:shareModel.identity universalLink:[RXWXTool sharedSDK].universallink];
        //            NSLog(@"%@", [RXUserUtility sharedManager].universallink);
                    SendMessageToWXReq *req = [[SendMessageToWXReq alloc] init];
                    if ([shareContent.material_type isEqualToString:@"text"]) { // 文本
                        req.bText = YES;
                        req.text = shareContent.content;
                        req.scene = scene;
                        [WXApi sendReq:req completion:^(BOOL success) {

                        }];
                    } else if ([shareContent.material_type isEqualToString:@"image"] || [shareContent.material_type isEqualToString:@"langing"] || [shareContent.material_type isEqualToString:@"landing"]) { // 单图
                        if ([shareContent.image containsString:@"http"]) {
                            __block WXImageObject *imageObj = [WXImageObject object];
                            [self downImage:shareContent.image complete:^(NSData *imgData) {
                                // 不能大于25m，防止误差压缩到23m
                                NSData *imageData = [RXWXTool dataScaleToBytes:23 * 1024 * 1024 withImageData:imgData];
                                if (shareContent.url && shareContent.url.length > 0) {
                                    NSString *shareUrl = shareContent.url;
                                    UIImage *qrCodeImg = [RXWXTool rxQRCodeForString:shareUrl size:CGSizeMake(shareContent.width, shareContent.height) fillColor:[UIColor blackColor] iconImage:nil];
                                    UIImage *bgView = [UIImage imageWithData:imageData];
                                    CGFloat fixelW = CGImageGetWidth(bgView.CGImage);
                                    CGFloat fixelH = CGImageGetHeight(bgView.CGImage);
                                    UIImageView *shareImgView = [[UIImageView alloc] initWithFrame:CGRectMake(0, 0, fixelW, fixelH)];
                                    shareImgView.image = bgView;
                                    UIImageView *qrCodeImgView = [[UIImageView alloc] initWithFrame:CGRectMake(shareContent.x, shareContent.y, shareContent.width, shareContent.height)];
                                    qrCodeImgView.image = qrCodeImg;
                                    [shareImgView addSubview:qrCodeImgView];
                                    
                                    UIImage *shareImg = [RXWXTool makeImageWithView:shareImgView withSize:shareImgView.frame.size];
                                    NSData *shareImgData = UIImagePNGRepresentation(shareImg);
                                    imageData = [RXWXTool dataScaleToBytes:23 * 1024 * 1024 withImageData:shareImgData];
                                }

                                imageObj.imageData = imageData;
                                WXMediaMessage *message = [WXMediaMessage message];
                                message.mediaObject = imageObj;
                                req.bText = NO;
                                req.message = message;
                                req.scene = scene;
                                [WXApi sendReq:req completion:^(BOOL success) {
                                    NSLog(@"");
                                     
                                }];
                            }];
                        } else {
                            WXImageObject *imageObj = [WXImageObject object];
                            NSData *shareImgData = [NSData dataWithContentsOfFile:shareContent.image];
                            NSData *imageData = [RXWXTool dataScaleToBytes:23 * 1024 * 1024 withImageData:shareImgData];
                            if (shareContent.url && shareContent.url.length > 0) {
                                NSString *shareUrl = shareContent.url;
                                UIImage *qrCodeImg = [RXWXTool rxQRCodeForString:shareUrl size:CGSizeMake(shareContent.width, shareContent.height) fillColor:[UIColor blackColor] iconImage:nil];
                                UIImage *bgView = [UIImage imageWithData:imageData];
                                CGFloat fixelW = CGImageGetWidth(bgView.CGImage);
                                CGFloat fixelH = CGImageGetHeight(bgView.CGImage);
                                UIImageView *shareImgView = [[UIImageView alloc] initWithFrame:CGRectMake(0, 0, fixelW, fixelH)];
                                shareImgView.image = bgView;
                                UIImageView *qrCodeImgView = [[UIImageView alloc] initWithFrame:CGRectMake(shareContent.x, shareContent.y, shareContent.width, shareContent.height)];
                                qrCodeImgView.image = qrCodeImg;
                                [shareImgView addSubview:qrCodeImgView];
                                
                                UIImage *shareImg = [RXWXTool makeImageWithView:shareImgView withSize:shareImgView.frame.size];
                                NSData *shareImgData = UIImagePNGRepresentation(shareImg);
                                imageData = [RXWXTool dataScaleToBytes:23 * 1024 * 1024 withImageData:shareImgData];
                            }

                            imageObj.imageData = imageData;
                            WXMediaMessage *message = [WXMediaMessage message];
                            message.mediaObject = imageObj;
                            req.bText = NO;
                            req.message = message;
                            req.scene = scene;
                            [WXApi sendReq:req completion:^(BOOL success) {

                            }];
                        }
                    } else if ([shareContent.material_type isEqualToString:@"link"]) { // 链接
                        [self downImage:shareContent.image complete:^(NSData *imgData) {
                            // 缩略图不能大于32k，防止误差压缩到30k
                            NSData *imageData = [RXWXTool dataScaleToBytes:30 * 1024 withImageData:imgData];

                            NSString *shareUrl = shareContent.url;
                            WXWebpageObject *webpageObject = [WXWebpageObject object];
                            webpageObject.webpageUrl = shareUrl;
                            WXMediaMessage *message = [WXMediaMessage message];
                            message.title = shareContent.title;
                            message.description = shareContent.content;
                            [message setThumbImage:[UIImage imageWithData:imageData]];
                            message.mediaObject = webpageObject;
                            req.bText = NO;
                            req.message = message;
                            req.scene = scene;
                            [WXApi sendReq:req completion:^(BOOL success) {
                                
                            }];
                        }];
                    }
                }  else {
                    if (complete) {
                        complete(NO);
                    }
                    if (self.newShareCallBack) {
                        RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
                        
                        NSMutableDictionary *errorRes = [NSMutableDictionary dictionary];
                        [errorRes setValue:[RXErrorTool getRXErrorMsg:RXShareError_default] forKey:@"msg"];
                        [errorRes setValue:@(RXShareError_default) forKey:@"code"];
                        err.responesObject = errorRes;
                        self.newShareCallBack(nil, err);
                    }
                }
            } else {
                if (complete) {
                    complete(NO);
                }
                if (self.newShareCallBack) {
                    self.newShareCallBack(nil, error);
                }
            }
        }];
    } else {
        RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
        
        NSMutableDictionary *errorRes = [NSMutableDictionary dictionary];
        [errorRes setValue:[RXErrorTool getRXErrorMsg:RXLimitError_noWechat] forKey:@"msg"];
        [errorRes setValue:@(RXLimitError_noWechat) forKey:@"code"];
        err.responesObject = errorRes;
        
        self.newShareCallBack(nil, err);
    }
}

/**
 * 微信分享（直接调用，不需要获取分享信息）New 返回具体错误码
 */
- (void)newShareToWWithFunc:(NSString *)func
                   platform:(NSString *)platform
                     region:(NSString *)region
                  transmits:(NSString * _Nullable)transmits
                        ext:(NSDictionary * _Nullable)ext
                   complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    self.newShareCallBack = complete;
    [self shareToWWithFunc:func platform:platform region:region transmits:transmits ext:ext complete:nil];
}

/**
 * 微信登录
 * @param wxAppid 微信登录appid
 * @param migrate_args 任意合法的 json 类型, 比如 string, nujber，账号迁移用的参数, 调用 CP account-query 及 account-queryandbind 接口时透传给 CP  非必须
 * @param sign_fields 指定对登录成功后返回的特定字段, 使用 CPKEY 计算签名. CP 服务器可重新计算签名并与登录返回的签名比对, 作为对瑞雪登录数据的校验. 支持的字段包括: nickname, avatar, openid, region, sex, age, 计算签名的逻辑会对指定字段进行排序, 此处传参与顺序无关。类型为字符串数组 @[@"nickname",@"avatar"]  非必须
 */
- (void)newLoginReq_wWithWXAppid:(NSString *)wxAppid
                             ext:(NSDictionary *)ext
                    migrate_args:(id _Nullable)migrate_args
                     sign_fields:(NSArray * _Nullable)sign_fields
{
    [RXWXTool sharedSDK].extDic = [NSMutableDictionary dictionaryWithDictionary:ext];
    [self loginReq_wWithWXAppid:wxAppid migrate_args:migrate_args sign_fields:sign_fields];
}

/**
 * 微信登录
 * @param wxAppid 微信登录appid
 * @param migrate_args 任意合法的 json 类型, 比如 string, nujber，账号迁移用的参数, 调用 CP account-query 及 account-queryandbind 接口时透传给 CP  非必须
 * @param sign_fields 指定对登录成功后返回的特定字段, 使用 CPKEY 计算签名. CP 服务器可重新计算签名并与登录返回的签名比对, 作为对瑞雪登录数据的校验. 支持的字段包括: nickname, avatar, openid, region, sex, age, 计算签名的逻辑会对指定字段进行排序, 此处传参与顺序无关。类型为字符串数组 @[@"nickname",@"avatar"]  非必须
 */
- (void)loginReq_wWithWXAppid:(NSString *)wxAppid
                 migrate_args:(id _Nullable)migrate_args
                  sign_fields:(NSArray * _Nullable)sign_fields
{
    self.isSync = NO;
    if(![WXApi isWXAppInstalled]) {
        RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
        
        NSMutableDictionary *errorRes = [NSMutableDictionary dictionary];
        [errorRes setValue:[RXErrorTool getRXErrorMsg:RXLimitError_noWechat] forKey:@"msg"];
        [errorRes setValue:@(RXLimitError_noWechat) forKey:@"code"];
        err.responesObject = errorRes;
        
        NSDictionary *notiDic = @{@"loginData" : errorRes,
                                  @"loginType" : @(LoginTypeW)
        };
        [[NSNotificationCenter defaultCenter] postNotificationName:@"noti_rxUILogin" object:nil userInfo:notiDic];
        [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                       bodyDic:@{}
                                                        action:@"rxlog_error_login"
                                                           url:@""
                                                          code:err.responesObject[@"code"] == nil ? -123 : [err.responesObject[@"code"] integerValue]
                                                           msg:err.responesObject[@"msg"]
                                                     thirdType:@"wechat"
                                                     thirdcode:err.responesObject[@"thirdcode"] == nil ? -123 : [err.responesObject[@"thirdcode"] integerValue]
                                                      thirdmsg:err.responesObject[@"thirdmsg"]
                                                       traceid:@""];
        
        // 用户行为上报
        NSMutableDictionary *thirdRes = [NSMutableDictionary dictionary];
        [thirdRes setValue:@"wechat" forKey:@"method"];
        [thirdRes setValue:@{@"msg" : @"wechat uninstall"} forKey:@"third_res"];
        [[RXUserActionLogManager sharedSDK] addUserActionWithScene:@"login" action:@"fail" properties:thirdRes];
        
        [[RXService sharedSDK].loginDelegate rx_LoginCallBackWithResponse:nil error:err];
        return;
    }
    
    self.migrate_args = migrate_args;
    self.sign_fields = sign_fields;
    
    [WXApi registerApp:wxAppid universalLink:[RXWXTool sharedSDK].universallink];
    
//    [WXApi checkUniversalLinkReady:^(WXULCheckStep step, WXCheckULStepResult * _Nonnull result) {
//        NSLog(@"checkUniversalLinkReady:%@, %u, %@, %@", @(step), result.success, result.errorInfo, result.suggestion);
//
//    }];
    NSLog(@"universallink = %@", [RXWXTool sharedSDK].universallink);
    
    SendAuthReq *req = [[SendAuthReq alloc] init];
    req.state = @"wx_oauth_authorization_state";//用于保持请求和回调的状态，授权请求或原样带回
    req.scope = @"snsapi_userinfo";//授权作用域：获取用户个人信息
    [WXApi sendReq:req completion:^(BOOL success) {
        NSLog(@"");
    }];
}

/**
 * 跳转到微信并打开小程序
 * @param params 跳转参数
 * ！username 小程序id    #NSString类型
 * ！appid 微信appid    #NSString类型
 * ！path 拉起小程序页面的可带参路径，不填默认拉起小程序首页，对于小游戏，可以只传入 query 部分，来实现传参效果，如：传入 "?foo=bar"。    #NSString类型
 * ！miniProgramType 小程序类型  0正式版 1开发版 2体验版    #NSInteger类型
 * ！ext 扩展信息    #NSString类型
 * ！extDic 可存放图片等比较大的数据    #NSDictionary类型
 */
- (void)openMiniProgram:(NSDictionary *)params
               complete:(void(^)(NSString *extMsg))complete
{
    [WXApi registerApp:params[@"appid"] universalLink:[RXWXTool sharedSDK].universallink];
    self.openMiniProgramBlock = complete;

    WXLaunchMiniProgramReq *launchMiniProgramReq = [WXLaunchMiniProgramReq object];
    launchMiniProgramReq.userName = params[@"username"];  //拉起的小程序的username
    launchMiniProgramReq.path = params[@"path"];    ////拉起小程序页面的可带参路径，不填默认拉起小程序首页，对于小游戏，可以只传入 query 部分，来实现传参效果，如：传入 "?foo=bar"。
    
    NSInteger miniType = [params[@"miniProgramType"] integerValue];
    WXMiniProgramType miniProgramType;
    switch (miniType) {
        case 0:
            miniProgramType = WXMiniProgramTypeRelease;
            break;
        case 1:
            miniProgramType = WXMiniProgramTypeTest;
            break;
        case 2:
            miniProgramType = WXMiniProgramTypePreview;
            break;
        default:
            miniProgramType = WXMiniProgramTypeRelease;
            break;
    }
    
    launchMiniProgramReq.miniProgramType = miniProgramType; //拉起小程序的类型
    
    NSString *extMsg = [NSString stringWithFormat:@"%@", params[@"extMsg"]];
    if (extMsg && extMsg.length > 0) {
        launchMiniProgramReq.extMsg = extMsg;
    }
    
    NSDictionary *extDic = (NSDictionary *)params[@"extDic"];
    if (extDic && extDic.allKeys.count > 0) {
        launchMiniProgramReq.extDic = extDic;
    }
    [WXApi sendReq:launchMiniProgramReq completion:^(BOOL success) {
            
    }];
}

/**
 * 检测是否安装微信
 */
- (BOOL)isWXAppInstalled
{
    return [WXApi isWXAppInstalled];
}

#pragma mark -- <fetch>
- (void)downImage:(NSString *)imageUrl
         complete:(void(^)(NSData *imgData))complete
{
    if (imageUrl && imageUrl.length > 0) {
        [RXWXTool asyurlToData:imageUrl withHandler:^(NSURLResponse *response, NSData *data, NSError *connectionError) {
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

/**
 * 同步信息
 * 调用后会跳转到微信授权登录，但不会走登录回调，同步信息通过此接口回调
 */
- (void)syncInfoWithWXAppid:(NSString *)wxAppid
                   complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    [WXApi registerApp:wxAppid universalLink:[RXWXTool sharedSDK].universallink];
    self.isSync = YES;
    self.syncCallBack = complete;
    
    SendAuthReq *req = [[SendAuthReq alloc] init];
    req.state = @"wx_oauth_authorization_state";//用于保持请求和回调的状态，授权请求或原样带回
    req.scope = @"snsapi_userinfo";//授权作用域：获取用户个人信息
    [WXApi sendReq:req completion:^(BOOL success) {
        NSLog(@"");
    }];
}

/**
 * business
 */
- (void)openBusinessViewWithModel:(RXWXBusinessModel *)model
{
    [WXApi registerApp:model.appid universalLink:[RXWXTool sharedSDK].universallink];
    WXOpenBusinessViewReq *req = [WXOpenBusinessViewReq object];
    req.businessType = model.businessType ?: @"requestMerchantTransfer";
    req.query = model.query;
    [WXApi sendReq:req completion:^(BOOL success) {
            
    }];
}

- (void)openBusinessViewWithModel:(RXWXBusinessModel *)model
                         complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    [WXApi registerApp:model.appid universalLink:[RXWXTool sharedSDK].universallink];
    self.openBusinessViewBlock = complete;
    WXOpenBusinessViewReq *req = [WXOpenBusinessViewReq object];
    req.businessType = model.businessType.length > 0 ? model.businessType : @"requestMerchantTransfer";
    req.query = model.query;
    [WXApi sendReq:req completion:^(BOOL success) {
        if (success) {
            if (self.openBusinessViewBlock) {
                NSMutableDictionary *successRes = [NSMutableDictionary dictionary];
                [successRes setValue:@(0) forKey:@"code"];
                [successRes setValue:@"展示页面成功" forKey:@"msg"];
                self.openBusinessViewBlock(successRes, nil);
            }
        } else {
            if (self.openBusinessViewBlock) {
                RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
                NSMutableDictionary *errRes = [NSMutableDictionary dictionary];
                [errRes setValue:@(RXShareError_third) forKey:@"code"];
                [errRes setValue:@"展示页面失败" forKey:@"msg"];
                err.responesObject = errRes;
                self.openBusinessViewBlock(nil, err);
            }
        }
    }];
}

#pragma mark -- wx回调
- (void)onResp:(id)resp {
    NSLog(@"-----%@",resp);
    if([resp isKindOfClass:[SendMessageToWXResp class]]){
        
        SendMessageToWXResp *req = (SendMessageToWXResp *)resp;
        //这里不再返回用户是否分享完成事件，即原先的cancel事件和success事件将统一为success事件
        if(req.errCode == 0){
            //分享成功
            NSLog(@"分享成功");
            if (self.shareCallBack) {
                self.shareCallBack(YES);
            }
            if (self.newShareCallBack) {
                NSMutableDictionary *successRes = [NSMutableDictionary dictionary];
                [successRes setValue:@(0) forKey:@"code"];
                [successRes setValue:@"分享成功" forKey:@"msg"];
                self.newShareCallBack(successRes, nil);
            }
            
//            if (self.autoReport) {
            if (![self.isFromRXPure isEqualToString:@"YES"]) {//不是由主库调用的分享可以单独上报
                [[RXShareService sharedSDK] shareReportWithDistinctId:@"" properties:nil complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                    NSLog(@"分享上报成功");
                }];
            }
//            }
            
        }else{
            NSLog(@"分享失败");
            if (self.shareCallBack) {
                self.shareCallBack(NO);
            }
            
            if (self.newShareCallBack) {
                RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
                
                NSMutableDictionary *errorRes = [NSMutableDictionary dictionary];
                [errorRes setValue:[RXErrorTool getRXErrorMsg:RXShareError_third] forKey:@"msg"];
                [errorRes setValue:@(RXShareError_third) forKey:@"code"];
                [errorRes setValue:req.errStr forKey:@"thirdmsg"];
                [errorRes setValue:@(req.errCode) forKey:@"thirdcode"];
                err.responesObject = errorRes;
                self.newShareCallBack(nil, err);
            }
        }
    }
    if([resp isKindOfClass:[SendAuthResp class]]){//判断是否为授权登录类
        SendAuthResp *req = (SendAuthResp *)resp;
        NSLog(@"获取微信信息%@",req);
        if([req.state isEqualToString:@"wx_oauth_authorization_state"]){//微信授权成功
            if(req.errCode == 0){
                // 避免授权跳回网络中断
                dispatch_async(dispatch_get_main_queue(), ^{
                    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.2 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
                        // 用户行为上报
                        NSMutableDictionary *thirdRes = [NSMutableDictionary dictionary];
                        [thirdRes setValue:@"wechat" forKey:@"method"];
                        [thirdRes setValue:@{@"code" : req.code} forKey:@"third_res"];
                        [[RXUserActionLogManager sharedSDK] addUserActionWithScene:@"login" action:@"success" properties:thirdRes];
                        
                        NSMutableDictionary *extDic = [NSMutableDictionary dictionaryWithDictionary:[RXWXTool sharedSDK].extDic];
                        [extDic setValue:req.code forKey:@"code"];
                        
                        if (self.isSync) {
                            [[RXApiService sharedSDK] syncInfoWithParams:extDic complete:self.syncCallBack];
                        } else if (self.isBindAccount) {
                            [[RXPrivateService sharedSDK] bindThirdAccountWithMethod:@"wechat" ext:extDic complete:self.bindAccountCallback];
                        } else {
                            [[RXService sharedSDK] loginWithExtDic:extDic username:@"" password:@"" sign_fields:self.sign_fields loginType:LoginTypeW migrate_args:self.migrate_args];
                        }
                        
                        [RXWXTool sharedSDK].extDic = nil;
                    });
                });
            }
        } else {
            NSInteger rxErrCode = RXLoginError_third;
            if (req.errCode == -2 || req.errCode == -4) {
                rxErrCode = RXLoginError_cancel;
            }
            
            RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
            
            NSMutableDictionary *errorRes = [NSMutableDictionary dictionary];
            [errorRes setValue:[RXErrorTool getRXErrorMsg:rxErrCode] forKey:@"msg"];
            [errorRes setValue:@(rxErrCode) forKey:@"code"];
            [errorRes setValue:req.errStr forKey:@"thirdmsg"];
            [errorRes setValue:@(req.errCode) forKey:@"thirdcode"];
            err.responesObject = errorRes;
            
            NSDictionary *notiDic = @{@"loginData" : errorRes,
                                      @"loginType" : @(LoginTypeW)
            };
            [[NSNotificationCenter defaultCenter] postNotificationName:@"noti_rxUILogin" object:nil userInfo:notiDic];
            
            [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                           bodyDic:@{}
                                                            action:@"rxlog_error_login"
                                                               url:@""
                                                              code:err.responesObject[@"code"] == nil ? -123 : [err.responesObject[@"code"] integerValue]
                                                               msg:err.responesObject[@"msg"]
                                                         thirdType:@"wechat"
                                                         thirdcode:err.responesObject[@"thirdcode"] == nil ? -123 : [err.responesObject[@"thirdcode"] integerValue]
                                                          thirdmsg:err.responesObject[@"thirdmsg"]
                                                           traceid:@""];
            
            // 用户行为上报
            NSMutableDictionary *thirdRes = [NSMutableDictionary dictionary];
            [thirdRes setValue:@"wechat" forKey:@"method"];
            [thirdRes setValue:errorRes forKey:@"third_res"];
            [[RXUserActionLogManager sharedSDK] addUserActionWithScene:@"login" action:@"fail" properties:thirdRes];
            
            if (self.isSync) {
                if (self.syncCallBack) {
                    self.syncCallBack(nil, err);
                }
            } else {
                [[RXService sharedSDK].loginDelegate rx_LoginCallBackWithResponse:nil error:err];
            }
        }
        self.isBindAccount = NO;
    }
    if ([resp isKindOfClass:[WXLaunchMiniProgramResp class]])
    {
        WXLaunchMiniProgramResp *req = (WXLaunchMiniProgramResp *)resp;
        NSString *string = req.extMsg;
        if (self.openMiniProgramBlock) {
            self.openMiniProgramBlock(string);
        }
        // 对应小程序组件 <button open-type="launchApp"> 中的 app-parameter 属性
    }
    if ([resp isKindOfClass:[WXOpenBusinessViewResp class]]) { // 商业化类型
        WXOpenBusinessViewResp *req = (WXOpenBusinessViewResp *)resp;
        NSString *string = req.extMsg;
        
        NSLog(@"WXOpenBusinessViewResp result = %@", string);
        
        NSDictionary *reqDic = [RXWXTool rxwx_stringToDictionary:string];
        if ([reqDic isKindOfClass:[NSDictionary class]] && reqDic.allKeys.count > 0) {
            NSString *result = reqDic[@"result"];
            
            if ([result isEqualToString:@"success"]) {
                if (self.openBusinessViewBlock) {
                    NSMutableDictionary *successRes = [NSMutableDictionary dictionary];
                    [successRes setValue:@(0) forKey:@"code"];
                    [successRes setValue:@"展示页面成功" forKey:@"msg"];
                    self.openBusinessViewBlock(successRes, nil);
                }
            } else if ([result isEqualToString:@"cancel"]) {
                if (self.openBusinessViewBlock) {
                    RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
                    NSMutableDictionary *errRes = [NSMutableDictionary dictionary];
                    [errRes setValue:@(RXShareError_cancel) forKey:@"code"];
                    [errRes setValue:@"取消" forKey:@"msg"];
                    err.responesObject = errRes;
                    self.openBusinessViewBlock(nil, err);
                }
            } else {
                if (self.openBusinessViewBlock) {
                    RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
                    NSMutableDictionary *errRes = [NSMutableDictionary dictionary];
                    [errRes setValue:@(RXShareError_third) forKey:@"code"];
                    [errRes setValue:@"展示页面失败" forKey:@"msg"];
                    err.responesObject = errRes;
                    self.openBusinessViewBlock(nil, err);
                }
            }
        } else {
            if (self.openBusinessViewBlock) {
                RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
                NSMutableDictionary *errRes = [NSMutableDictionary dictionary];
                [errRes setValue:@(RXShareError_third) forKey:@"code"];
                [errRes setValue:@"展示页面失败" forKey:@"msg"];
                err.responesObject = errRes;
                self.openBusinessViewBlock(nil, err);
            }
        }
    }
}

/**
 * 处理旧版微信通过URL启动App时传递的数据
 * 需要在 application:openURL:sourceApplication:annotation:或者application:handleOpenURL中调用。
 * @param url 微信启动第三方应用时传递过来的URL
 */
- (BOOL)handleOpenUrl:(NSURL *)url
{
    return [WXApi handleOpenURL:url delegate:self];
}

/**
 * 处理微信通过Universal Link启动App时传递的数据
 * 需要在 application:continueUserActivity:restorationHandler:中调用。
 * @param userActivity 启动第三方应用时系统API传递过来的userActivity
 */
- (BOOL)handleOpenUniversalLink:(NSUserActivity *)userActivity
{
    return [WXApi handleOpenUniversalLink:userActivity delegate:self];
}

@end
