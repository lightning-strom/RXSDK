//
//  RXToolKit.m
//  RXPublicToolKit
//
//  Created by 陈汉 on 2022/9/19.
//

#import "RXToolKit.h"
#import <WebKit/WebKit.h>
#import <Photos/Photos.h>
#import "RXPublicWebView.h"
#import "RXToolPrivate.h"

typedef void(^SaveImageBlock)(BOOL result);

@interface RXToolKit () <WKNavigationDelegate, NSURLSessionDelegate>

@property (nonatomic, strong) WKWebView *webView;
@property (nonatomic, strong) NSString *userAgent;
@property (nonatomic, strong) NSString *fullPath;
@property (nonatomic, assign) NSInteger requestCount;
@property (nonatomic, copy) SaveImageBlock saveImageBlock;
@property (nonatomic, strong) NSString *webUrl;
@property (nonatomic, strong) RXPublicWebView *webViewVC;

@end

@implementation RXToolKit

static RXToolKit *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXToolKit alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        self.requestCount = 0;
    }
    return self;
}

/**
 * 获取userAgent
 */
- (void)getUserAgent:(void(^)(id _Nullable result))complete
{
    if (!_webView) {
        WKWebViewConfiguration *configuration = [[WKWebViewConfiguration alloc] init];
        if (@available(iOS 13.0, *)) {
            configuration.defaultWebpagePreferences.preferredContentMode = WKContentModeMobile;
        }
        
        _webView = [[WKWebView alloc] initWithFrame:CGRectZero configuration:configuration];
        _webView.backgroundColor = [UIColor clearColor];
        _webView.navigationDelegate = self;
        
        [_webView evaluateJavaScript:@"navigator.userAgent" completionHandler:^(id _Nullable result, NSError * _Nullable error) {
            if (error == nil && result != nil) {
                self.userAgent = [NSString stringWithFormat:@"%@", result];
                NSLog(@"获取到的ua = %@", self.userAgent);
            } else {
                self.userAgent = @"";
                NSLog(@"获取到的ua = %@", self.userAgent);
            }
            if (complete) {
                complete(result);
            }
        }];
    }
}

/**
 * 跳转到app设置页面
 */
+ (void)jumpAppSetting
{
    NSURL *url = [NSURL URLWithString:UIApplicationOpenSettingsURLString];
    [[UIApplication sharedApplication] openURL:url options:nil completionHandler:^(BOOL success) {
            
    }];
}

/**
 * 保存图片到相册
 * @param img 类型支持 UIImage/NSdata（图片二进制）/NSString（图片url或本地路径）
 */
- (void)saveImage:(id)img
         complete:(void(^)(BOOL result))complete
{
    self.saveImageBlock = complete;
    
    __block UIImage *image = [[UIImage alloc] init];
    if ([img isKindOfClass:[UIImage class]]) {
        image = (UIImage *)img;
        
    } else if ([img isKindOfClass:[NSData class]]) {
        image = [UIImage imageWithData:img];
        
    } else if ([img isKindOfClass:[NSString class]] && [[img substringToIndex:4] containsString:@"http"]) {
        NSURL *url = [NSURL URLWithString:img];
        NSData *data = [[NSData alloc] initWithContentsOfURL:url];
        image = [UIImage imageWithData:data];
        
    } else {
        NSData *imageData = [NSData dataWithContentsOfFile:img];
        image = [UIImage imageWithData:imageData];
    }
    
    //将图片保存到相册
    UIImageWriteToSavedPhotosAlbum(image, self, @selector(saveImage:finishError:contextInfo:), NULL);
}

/**
 * 保存图片到相册
 * @note 可设置二维码
 */
- (void)saveImage:(id)img
              url:(NSString *)url
            width:(NSInteger)width
           height:(NSInteger)height
                x:(NSInteger)x
                y:(NSInteger)y
         complete:(void(^)(BOOL result))complete
{
    self.saveImageBlock = complete;
    
    __block UIImage *image = [[UIImage alloc] init];
    if ([img isKindOfClass:[UIImage class]]) {
        image = (UIImage *)img;
        
    } else if ([img isKindOfClass:[NSData class]]) {
        image = [UIImage imageWithData:img];
        
    } else if ([img isKindOfClass:[NSString class]] && [[img substringToIndex:4] containsString:@"http"]) {
        NSURL *url = [NSURL URLWithString:img];
        NSData *data = [[NSData alloc] initWithContentsOfURL:url];
        image = [UIImage imageWithData:data];
        
    } else {
        NSData *imageData = [NSData dataWithContentsOfFile:img];
        image = [UIImage imageWithData:imageData];
    }
    
    if (url && url.length > 0) {
        NSString *shareUrl = url;
        UIImage *qrCodeImg = [RXToolKit rxQRCodeForString:shareUrl size:CGSizeMake(width, height) fillColor:[UIColor blackColor] iconImage:nil];
        UIImage *bgView = image;
        UIWindow *window = [UIApplication sharedApplication].keyWindow;
//        CGFloat fixelW = CGRectGetWidth(window.frame);
//        CGFloat fixelH = CGRectGetHeight(window.frame);
        CGFloat fixelW = CGImageGetWidth(bgView.CGImage);
        CGFloat fixelH = CGImageGetHeight(bgView.CGImage);
        UIImageView *shareImgView = [[UIImageView alloc] initWithFrame:CGRectMake(0, 0, fixelW, fixelH)];
        shareImgView.image = bgView;
        UIImageView *qrCodeImgView = [[UIImageView alloc] initWithFrame:CGRectMake(x, y, width, height)];
        qrCodeImgView.image = qrCodeImg;
        [shareImgView addSubview:qrCodeImgView];
        
//        [[UIApplication sharedApplication].keyWindow addSubview:shareImgView];
        
        image = [RXToolKit makeImageWithView:shareImgView withSize:shareImgView.frame.size];
    }
    
    //将图片保存到相册
    UIImageWriteToSavedPhotosAlbum(image, self, @selector(saveImage:finishError:contextInfo:), NULL);
}

- (void)saveImage:(UIImage *)image finishError:(NSError *)error contextInfo:(void *)contextInfo
{
    NSString *msg = nil;
    if(error != NULL){
        NSLog(@"保存图片失败 %@", error);
        if (self.saveImageBlock) {
            self.saveImageBlock(NO);
        }
    }else{
        NSLog(@"保存图片成功");
        if (self.saveImageBlock) {
            self.saveImageBlock(YES);
        }
    }
}

/**
 * 请求相册权限
 * @note 首次调用会拉起授权弹框
 */
- (void)isCanVisitPhotoLibrary:(void(^)(BOOL result))result 
{
    PHAuthorizationStatus status = [PHPhotoLibrary authorizationStatus];
    if (status == PHAuthorizationStatusAuthorized) {
        result(YES);
        return;
    }
    if (status == PHAuthorizationStatusRestricted || status == PHAuthorizationStatusDenied) {
        result(NO);
        return ;
    }
    
    if (status == PHAuthorizationStatusNotDetermined) {
        [PHPhotoLibrary requestAuthorization:^(PHAuthorizationStatus status) {
            // 回调是在子线程的
            NSLog(@"%@",[NSThread currentThread]);
            dispatch_async(dispatch_get_main_queue(), ^{
                if (status != PHAuthorizationStatusAuthorized) {
                    NSLog(@"未开启相册权限,请到设置中开启");
                    result(NO);
                    return ;
                }
                result(YES);
            }); 
        }];
    }
}

/**
 * 保存视频到相册
 * @param video 图片url或本地路径
 */
- (void)saveVideo:(NSString *)video
         complete:(void(^)(BOOL result))complete
{
    self.saveImageBlock = complete;
    if ([[video substringToIndex:4] containsString:@"http"]) {
        [self createDownloadTaskWithUrlStr:video];
    } else {
        UISaveVideoAtPathToSavedPhotosAlbum(video, self,
                    @selector(UISaveVideoAtPathToSavedPhotosAlbum_videoPath:didFinishSavingWithError:contextInfo:), nil);
    }
}

- (void)UISaveVideoAtPathToSavedPhotosAlbum_videoPath:(NSString *)videoPath didFinishSavingWithError:(NSError *)error contextInfo:(void *)contextInfo
{
    if (error) {
        NSLog(@"保存视频失败 %@", error);
        if (self.saveImageBlock) {
            self.saveImageBlock(NO);
        }
    } else {
        NSLog(@"保存视频成功");
        if (self.saveImageBlock) {
            self.saveImageBlock(YES);
        }
    }
}

/**
 * 创建下载任务
 */
- (void)createDownloadTaskWithUrlStr:(NSString *)urlStr
{
    NSURLSessionConfiguration *config = [NSURLSessionConfiguration defaultSessionConfiguration];
    NSURLSession *session = [NSURLSession sessionWithConfiguration:config
                                                          delegate:self
                                                     delegateQueue:[NSOperationQueue mainQueue]];

    NSURL *urlNew = [NSURL URLWithString:urlStr];
//    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask,YES);
//    NSString *documentsDirectory = [paths objectAtIndex:0];
    
//    NSDate * nowdate = [NSDate date];
//    NSTimeZone *zone = [NSTimeZone systemTimeZone];
//    NSInteger interval = [zone secondsFromGMTForDate:nowdate];
//    NSDate *localeDate = [nowdate dateByAddingTimeInterval: interval];
//    NSDateFormatter * formatter = [[NSDateFormatter alloc]init];
//    [formatter setDateFormat:@"yyyyMMddhhmmss"];
//    NSString * dateStr = [formatter stringFromDate:localeDate];
//    self.fullPath = [NSString stringWithFormat:@"%@/%@%@", documentsDirectory, dateStr, urlStr];
//    NSURLRequest *request = [NSURLRequest requestWithURL:urlNew];
//    
//    NSURLSessionDownloadTask *downloadTask = [session downloadTaskWithRequest:request];
//    [downloadTask resume];
    
    NSURLRequest *request = [NSURLRequest requestWithURL:urlNew cachePolicy:1.0 timeoutInterval:5.0];
    [[session downloadTaskWithRequest:request] resume];
    
    NSURLSessionDownloadTask *task = [session downloadTaskWithURL:urlNew completionHandler:^(NSURL *location, NSURLResponse *response, NSError *error) {
        NSLog(@"下载完成 %@", [location path]);
        ///[self.hud setLabelText:[NSString stringWithFormat:@"下载成功"]];
        NSFileManager *fileManger = [NSFileManager defaultManager];
        ///沙盒Documents路径
        NSString *documents = [NSHomeDirectory() stringByAppendingPathComponent:@"Documents"];
        //拼接文件绝对路径
        NSString *path = [documents stringByAppendingPathComponent:response.suggestedFilename];
        //视频存放到这个位置
        [fileManger moveItemAtURL:location toURL:[NSURL fileURLWithPath:path] error:nil];
        ///保存到相册
        UISaveVideoAtPathToSavedPhotosAlbum(path, self, @selector(UISaveVideoAtPathToSavedPhotosAlbum_videoPath:didFinishSavingWithError:contextInfo:), nil);
    }];
    ///开始下载任务
    [task resume];
}

// 从服务器接收数据，下载进度回调
- (void)URLSession:(NSURLSession *)session
      downloadTask:(NSURLSessionDownloadTask *)downloadTask
      didWriteData:(int64_t)bytesWritten
 totalBytesWritten:(int64_t)totalBytesWritten
totalBytesExpectedToWrite:(int64_t)totalBytesExpectedToWrite {
    
    CGFloat progress = (CGFloat)totalBytesWritten / (CGFloat)totalBytesExpectedToWrite;
    NSLog(@"下载进度 %.2f", progress);
}

// 下载完成后回调
- (void)URLSession:(NSURLSession *)session 
      downloadTask:(NSURLSessionDownloadTask *)downloadTask
didFinishDownloadingToURL:(NSURL *)location {
    
//    NSURL *fetchUrl = [NSURL fileURLWithPath:self.fullPath];
    NSLog(@"下载完成 %@", [location path]);
    
//    //将下载好的.tmp缓存文件, 存成
//    NSString *cachesPath = NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES).lastObject;
//    //创建新文件路径
//    NSString *filePath = [cachesPath stringByAppendingString:@"/333331111/video.mp4"];
//    //文件管理器
//    NSFileManager *fileManger = [NSFileManager defaultManager];
//    //将下载号的缓存文件caches移动到新文件里
//    [fileManger moveItemAtPath:location.path toPath:filePath error:nil];
//    NSLog(@"转存后的路径 = %@", filePath);
//    
//    if (UIVideoAtPathIsCompatibleWithSavedPhotosAlbum(filePath)) {
//        NSLog(@"");
//    }
    
//    UISaveVideoAtPathToSavedPhotosAlbum([location path], self, @selector(UISaveVideoAtPathToSavedPhotosAlbum_videoPath:didFinishSavingWithError:contextInfo:), nil);
//
//    UISaveVideoAtPathToSavedPhotosAlbum(filePath, self,
//                @selector(UISaveVideoAtPathToSavedPhotosAlbum_videoPath:didFinishSavingWithError:contextInfo:), nil);
}

//异步下载
+ (void)asyurlToData:(NSString *)imageUrl withHandler:(void (^)(NSURLResponse* response, NSData* data, NSError* connectionError)) handler
{
    NSURLRequest *request = [NSURLRequest requestWithURL:[NSURL URLWithString:imageUrl] cachePolicy:NSURLRequestUseProtocolCachePolicy timeoutInterval:20.0];
    NSOperationQueue *queue = [[NSOperationQueue alloc] init];
    [NSURLConnection sendAsynchronousRequest:request queue:queue completionHandler:^(NSURLResponse *response, NSData *data, NSError *connectionError) {
        if (handler) {
            handler(response,data,connectionError);
        }
    }];
}

//异步下载视频到本地document中
+ (void)downloadVideo:(NSString *)videoUrl localDirectoryName:(NSString *)directoryName withHandler:(void (^)(NSURLResponse* response, NSString* filePath, NSString* fileName, NSError* connectionError)) handler{
    NSURL *url = [NSURL URLWithString:videoUrl];
    NSURLRequest *request = [NSURLRequest requestWithURL:url];
        
    NSURLSessionDataTask *downloadTask = [[NSURLSession sharedSession] dataTaskWithRequest:request completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
        if (error) {
            dispatch_async(dispatch_get_main_queue(), ^{
                if (handler) {
                    handler(response,@"",@"",error);
                }
            });
        } else {
            NSString *documentsPath = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) firstObject];
            NSString *directoryPath = [documentsPath stringByAppendingPathComponent:directoryName];
                        
            // 检查目录是否存在，如果不存在则创建目录
            NSFileManager *fileManager = [NSFileManager defaultManager];
            if (![fileManager fileExistsAtPath:directoryPath]) {
                NSError *createError;
                if (![fileManager createDirectoryAtPath:directoryPath withIntermediateDirectories:YES attributes:nil error:&createError]) {
                    dispatch_async(dispatch_get_main_queue(), ^{
                        if (handler) {
                            handler(response,@"",@"",createError);
                        }
                    });
                    return;
                }
            }
            
            NSString *videoFileName = [url lastPathComponent]; // 获取视频文件名
            NSString *videoFilePath = [directoryPath stringByAppendingPathComponent:videoFileName];
            
            // 如果文件已存在，则先删除原文件
            if ([fileManager fileExistsAtPath:videoFilePath]) {
                NSError *removeError;
                if (![fileManager removeItemAtPath:videoFilePath error:&removeError]) {
                    dispatch_async(dispatch_get_main_queue(), ^{
                        if (handler) {
                            handler(response,@"",@"",error);
                        }
                    });
                    return;
                }
            }
            
            // 将新的视频数据写入文件
            if (![data writeToFile:videoFilePath atomically:YES]) {
                NSError *writeError = [NSError errorWithDomain:@"VideoDownloader" code:-1 userInfo:@{NSLocalizedDescriptionKey: @"Failed to write video file."}];
                dispatch_async(dispatch_get_main_queue(), ^{
                    if (handler) {
                        handler(response,@"",@"",error);
                    }
                });
                return;
            }
            
            dispatch_async(dispatch_get_main_queue(), ^{
                if (handler) {
                    handler(response,videoFilePath,videoFileName,error);
                }
            });
        }
    }];
    
    [downloadTask resume];
}

#pragma mark - 二维码
+ (UIImage *)rxQRCodeForString:(NSString *)tString
                          size:(CGSize)tSize
                     fillColor:(UIColor *)tFillColor
                     iconImage:(UIImage *)tIconImage
{
    // 内容不能为空
    if (!tString || tString.length == 0) {
        return [UIImage new];
    }

    NSData *stringData = [tString dataUsingEncoding:NSUTF8StringEncoding];
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
    CIFilter *colorFilter = [CIFilter filterWithName:@"CIFalseColor" keysAndValues:@"inputImage", qrFilter.outputImage, @"inputColor0", [CIColor colorWithCGColor:onColor.CGColor], @"inputColor1", [CIColor colorWithCGColor:offColor.CGColor], nil];
    // 生成
    CIImage *qrImage = colorFilter.outputImage;
    CGSize lSize = tSize;// * [UIScreen mainScreen].scale
    CGFloat tScale = MIN(lSize.width / CGRectGetWidth(qrImage.extent), lSize.height / CGRectGetHeight(qrImage.extent));
    CIImage *tTransformImage = [qrImage imageByApplyingTransform:CGAffineTransformMakeScale(tScale, tScale)];
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
        CGFloat iconSize = 1.0 / 5.5 * lSize.width;
        [tIconImage drawInRect:CGRectMake((lSize.width - iconSize) / 2.0, (lSize.height - iconSize) / 2.0, iconSize, iconSize)];
        UIImage *resultImage = UIGraphicsGetImageFromCurrentImageContext();
        UIGraphicsEndImageContext();
        return resultImage;
    }
    return tCodeImage;
}

#pragma mark -- <view生成image>
+ (UIImage *)makeImageWithView:(UIView *)view withSize:(CGSize)size
{
    //下面方法，第一个参数表示区域大小。第二个参数表示是否是非透明的。如果需要显示半透明效果，需要传NO，否则传YES。第三个参数就是屏幕密度了，关键就是第三个参数 [UIScreen mainScreen].scale。
    UIGraphicsBeginImageContextWithOptions(size, YES, [UIScreen mainScreen].scale);
    [view.layer renderInContext:UIGraphicsGetCurrentContext()];
    UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return image;
}

/**
 * OpenWebView
 */
- (void)openWebView:(NSString *)url
{
    self.webViewVC = [[RXPublicWebView alloc] init];
    self.webViewVC.modalPresentationStyle = UIModalPresentationFullScreen;
    
    self.webViewVC.urlStr = url;
    
    if ([RXToolPrivate currentViewController].navigationController) {
        [[RXToolPrivate currentViewController].navigationController presentViewController:self.webViewVC animated:YES completion:nil];
    }else{
        [[RXToolPrivate currentViewController] presentViewController:self.webViewVC animated:YES completion:nil];
    }
    
//    self.webUrl = url;
//    NSThread *thread = [[NSThread alloc] initWithTarget:self selector:@selector(openWebView) object:nil];
//    // 启动线程
//    [thread start];
}

- (void)openWebView
{           
    self.webViewVC = [[RXPublicWebView alloc] init];
    self.webViewVC.modalPresentationStyle = UIModalPresentationFullScreen;
    
    self.webViewVC.urlStr = self.webUrl;
    
    if ([RXToolPrivate currentViewController].navigationController) {
        [[RXToolPrivate currentViewController].navigationController presentViewController:self.webViewVC animated:YES completion:nil];
    }else{
        [[RXToolPrivate currentViewController] presentViewController:self.webViewVC animated:YES completion:nil];
    }
}

/**
 * CloseWebView
 */
- (void)closeWebView
{
    [self.webViewVC dismiss];
}

/**
 返回当前视图控制器
 */
+ (UIViewController *)currentViewController{
    return [RXToolPrivate currentViewController];
}

/**
 * NSDictionary to jsonString
 */
+ (NSString *)toJsonString:(NSDictionary *)dic
{
    return [RXToolPrivate toJsonString:dic];
}

@end
