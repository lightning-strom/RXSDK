//
//  Tool.m
//  RXSDKDemo
//
//  Created by 陈汉 on 2023/5/11.
//

#import "Tool.h"
#import <UIKit/UIKit.h>
#import <CommonCrypto/CommonDigest.h>

@implementation Tool

static Tool *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[Tool alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        self.interface = 2;
    }
    return self;
}

- (NSString *)getLanguage:(NSString *)language
{
    NSString *mLanguage = @"zh";
//    stringPickerView.dataSourceArr = @[@"简体中文", @"繁体中文", @"英语", @"日语", @"印尼语", @"菲律宾语", @"泰语"];
    if ([language isEqualToString:@"简体中文"]) {
        mLanguage = @"zh";
    } else if ([language isEqualToString:@"繁体中文"]) {
        mLanguage = @"tc";
    } else if ([language isEqualToString:@"英语"]) {
        mLanguage = @"en";
    } else if ([language isEqualToString:@"日语"]) {
        mLanguage = @"ja";
    } else if ([language isEqualToString:@"印尼语"]) {
        mLanguage = @"id";
    } else if ([language isEqualToString:@"菲律宾语"]) {
        mLanguage = @"tl";
    } else if ([language isEqualToString:@"泰语"]) {
        mLanguage = @"th";
    } else if ([language isEqualToString:@"越南语"]) {
        mLanguage = @"vi";
    } else if ([language isEqualToString:@"阿拉伯语"]) {
        mLanguage = @"ar";
    }
    
    return mLanguage;
}

- (void)alertWithTitle:(NSString *)title
               content:(NSString *)content
          sureBtnTitle:(NSString *)btnTitle{
    UIAlertAction *cancelAction=[UIAlertAction actionWithTitle:btnTitle style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
    }];
    UIAlertController *alertController=[UIAlertController alertControllerWithTitle:title message:content preferredStyle:UIAlertControllerStyleAlert];
    [alertController addAction:cancelAction];
    [[self currentViewController] presentViewController:alertController animated:YES completion:nil];
}

/**
 * 获取状态栏高度
 */
+ (CGFloat)getStatusBarHeight {
    if (@available(iOS 13.0, *)) {
        UIStatusBarManager *statusBarManager = [UIApplication sharedApplication].windows.firstObject.windowScene.statusBarManager;
        return statusBarManager.statusBarFrame.size.height;
    } else {
        return [UIApplication sharedApplication].statusBarFrame.size.height;
    }
}

/**
 * 获取当前时间字符串
 */
- (NSString *)getTime{
    NSDate* date = [NSDate dateWithTimeIntervalSinceNow:0];
    NSTimeInterval a=[date timeIntervalSince1970]*1000; // *1000 是精确到毫秒，不乘就是精确到秒
    NSString *timeString = [NSString stringWithFormat:@"%.0f", a]; //转为字符型
    return timeString;
}

/** 返回当前控制器 */
- (UIViewController *)currentViewController {
    
    UIViewController *rootViewController = [UIApplication sharedApplication].delegate.window.rootViewController;
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

//md5加密然后转大写
+ (NSString *)md532BitUpperWithStr:(NSString *)str
{
    const char *cStr = [str UTF8String];
    unsigned char result[16];
    NSNumber *num = [NSNumber numberWithUnsignedLong:strlen(cStr)];
    CC_MD5( cStr,[num intValue], result );
    return [[NSString stringWithFormat:
             @"%02X%02X%02X%02X%02X%02X%02X%02X%02X%02X%02X%02X%02X%02X%02X%02X",
             result[0], result[1], result[2], result[3],
             result[4], result[5], result[6], result[7],
             result[8], result[9], result[10], result[11],
             result[12], result[13], result[14], result[15]
             ] uppercaseString];
}

// NSDictionary 转 UTF-8 字符串
+ (NSString *)dictionaryToUTF8String:(NSDictionary *)dictionary
{
    if (!dictionary) {
        NSLog(@"❌ Dictionary is nil");
        return nil;
    }
    
    NSError *error;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:dictionary
                                                       options:NSJSONWritingPrettyPrinted
                                                         error:&error];
    
    if (error) {
        NSLog(@"❌ JSON serialization error: %@", error.localizedDescription);
        return nil;
    }
    
    NSString *utf8String = [[NSString alloc] initWithData:jsonData
                                                 encoding:NSUTF8StringEncoding];
    
    if (!utf8String) {
        NSLog(@"❌ Failed to create UTF-8 string");
        return nil;
    }
    
    NSLog(@"✅ Dictionary converted to UTF-8 string successfully");
    return utf8String;
}

@end
