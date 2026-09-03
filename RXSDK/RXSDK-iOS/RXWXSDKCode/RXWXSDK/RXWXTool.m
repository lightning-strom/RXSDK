//
//  RXWXTool.m
//  RXWXSDK
//
//  Created by 陈汉 on 2022/5/30.
//

#import "RXWXTool.h"

static NSString *const rxwx_universallink = @"rxwx_universallink";

@implementation RXWXTool

static RXWXTool *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXWXTool alloc] init];
    });
    return sharedSDK;
}

/**
 * 保存universallink
 */
+ (void)saveUniversallink:(NSString *)universallink
{
    [[NSUserDefaults standardUserDefaults] setValue:universallink forKey:rxwx_universallink];
}

- (NSString *)universallink
{
    NSString *ulink = [[NSUserDefaults standardUserDefaults] valueForKey:rxwx_universallink];
    return ulink.length > 0 ? ulink : @"";
}

/** appdelegate */
- (id<UIApplicationDelegate>)applicationDelegate
{
    return [UIApplication sharedApplication].delegate;
}

/** 返回当前控制器 */
- (UIViewController *)currentViewController
{
    UIViewController *rootViewController = [self applicationDelegate].window.rootViewController;
    return [self currentViewControllerFrom:rootViewController];
}

/** 返回当前的导航控制器 */
- (UINavigationController *)currentNavigationViewController
{
    UIViewController *currentViewController = [self currentViewController];
    return currentViewController.navigationController;
}

/** 通过递归拿到当前控制器 */
- (UIViewController *)currentViewControllerFrom:(UIViewController*)viewController
{
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

+ (NSData *)urlToData:(NSString *)imageUrl
{
    NSURLRequest *request = [NSURLRequest requestWithURL:[NSURL URLWithString:imageUrl] cachePolicy:NSURLRequestUseProtocolCachePolicy timeoutInterval:20.0];
    NSURLResponse *response;
    NSData *data = [NSURLConnection sendSynchronousRequest:request returningResponse:&response error:nil];
    return data;
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

+ (NSData *)urlScaledToDataBytes:(long)bytes withImageUrl:(NSString *)imageUrl
{
    NSURLRequest *request = [NSURLRequest requestWithURL:[NSURL URLWithString:imageUrl] cachePolicy:NSURLRequestUseProtocolCachePolicy timeoutInterval:20.0];
    NSURLResponse *response;
    NSData *data = [NSURLConnection sendSynchronousRequest:request returningResponse:&response error:nil];

    while (data.length >= bytes)
    {
        UIImage *image = [UIImage imageWithData:data];
        CGSize newSize = CGSizeMake(image.size.width / 1.1, image.size.height / 1.1);
        UIGraphicsBeginImageContext(newSize);
        [image drawInRect:CGRectMake(0, 0, newSize.width, newSize.height)];
        UIImage *newImage = UIGraphicsGetImageFromCurrentImageContext();
        UIGraphicsEndImageContext();
        data = UIImageJPEGRepresentation(newImage, 1);
        
    }
    return data;
}

+ (NSData *)dataScaleToBytes:(long)bytes withImageData:(NSData *)imageData
{
    while (imageData.length >= bytes)
    {
        UIImage *image = [UIImage imageWithData:imageData];
        CGSize newSize = CGSizeMake(image.size.width / 1.1, image.size.height / 1.1);
        UIGraphicsBeginImageContext(newSize);
        [image drawInRect:CGRectMake(0, 0, newSize.width, newSize.height)];
        UIImage* newImage = UIGraphicsGetImageFromCurrentImageContext();
        UIGraphicsEndImageContext();
        imageData = UIImageJPEGRepresentation(newImage, 1);
    }
    return imageData;
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

#pragma mark -- 获取图片
+ (UIImage *)bundleImageWithName:(NSString *)name
{
    NSBundle *bundle = [NSBundle bundleForClass:[self class]];
    UIImage *image = [UIImage imageNamed:[NSString stringWithFormat:@"Support.bundle/%@", name] inBundle:bundle compatibleWithTraitCollection:nil];
    return image;
}

// jsonString 转 dic
+ (NSDictionary *)rxwx_stringToDictionary:(NSString *)jsonString
{
    @try {
        if (jsonString.length <= 0) {
            return nil;
        }
        NSData *data = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
        NSError *error = nil;
        NSDictionary *dictionary = [NSJSONSerialization JSONObjectWithData:data options:0 error:&error];
        
        if (error) {
            NSLog(@"JSON 解析错误: %@", error.localizedDescription);
            return nil; // 解析失败时返回 nil
        }
        
        return dictionary; // 返回转换后的 NSDictionary
    } @catch (NSException *exception) {
        NSLog(@"%@", exception);
        return nil;
    } @finally {
        
    }
}

@end
