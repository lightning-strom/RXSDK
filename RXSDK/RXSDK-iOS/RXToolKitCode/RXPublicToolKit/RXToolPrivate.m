//
//  RXToolPrivate.m
//  RXPublicToolKit
//
//  Created by 陈汉 on 2024/4/9.
//

#import "RXToolPrivate.h"
#import "RXToolKit.h"

@implementation RXToolPrivate

/**
 * 获取图片资源
 */
+ (UIImage *)rxToolBundleImageNamed:(NSString *)imageName
{
    NSBundle *bundle = [NSBundle bundleForClass:[RXToolKit class]];
    NSURL *url = [bundle URLForResource:@"RXPublicToolKit" withExtension:@"bundle"];
    NSBundle *imageBundle = [NSBundle bundleWithURL:url];
    
    UIImage *image = [UIImage imageWithContentsOfFile:[imageBundle pathForResource:imageName ofType:@"png"]];
    
    return image;
}

/** appdelegate */
+ (id<UIApplicationDelegate>)applicationDelegate {
    return [UIApplication sharedApplication].delegate;
}

/** 返回当前控制器 */
+ (UIViewController *)currentViewController {
    
    UIViewController *rootViewController = [RXToolPrivate applicationDelegate].window.rootViewController;
    return [RXToolPrivate currentViewControllerFrom:rootViewController];
}

/** 返回当前的导航控制器 */
+ (UINavigationController *)currentNavigationViewController {
    
    UIViewController *currentViewController = [RXToolPrivate currentViewController];
    return currentViewController.navigationController;
}

/** 通过递归拿到当前控制器 */
+ (UIViewController *)currentViewControllerFrom:(UIViewController*)viewController {
    
    // 如果传入的控制器是导航控制器,则返回最后一个
    if ([viewController isKindOfClass:[UINavigationController class]]) {
        
        UINavigationController *navigationController = (UINavigationController *)viewController;
        return [RXToolPrivate currentViewControllerFrom:navigationController.viewControllers.lastObject];
    }
    // 如果传入的控制器是tabBar控制器,则返回选中的那个
    else if([viewController isKindOfClass:[UITabBarController class]]) {
        
        UITabBarController *tabBarController = (UITabBarController *)viewController;
        return [RXToolPrivate currentViewControllerFrom:tabBarController.selectedViewController];
    }
    // 如果传入的控制器发生了modal,则就可以拿到modal的那个控制器
    else if(viewController.presentedViewController != nil) {
        return [RXToolPrivate currentViewControllerFrom:viewController.presentedViewController];
    }
    else {
        return viewController;
    }
}

/** 获取当前屏幕方向 */
+ (NSInteger)getInterfaceOrientation
{
    NSInteger ori = 0;
    UIInterfaceOrientation orientation = [UIApplication sharedApplication].statusBarOrientation;
    
    if(orientation == 0) { //Default orientation
    
    }
    else if(orientation == UIInterfaceOrientationPortrait) { //竖屏
        ori = 1;
    }
    else if(orientation == UIInterfaceOrientationLandscapeLeft) { // 左横屏
        ori = 2;
    }
    else if(orientation == UIInterfaceOrientationLandscapeRight) { //右横屏
        ori = 2;
    }
    return ori;
}

/**
 * 处理 webView scheme 数据
 */
+ (NSDictionary *)fetchWebViewSchemes:(NSString *)url
{
    NSMutableDictionary *resDic = [NSMutableDictionary dictionary];
    NSArray *schemes = [url componentsSeparatedByString:@"?"];
    
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

+ (NSString *)urlEncodedString:(NSString *)string
{
    
    CFStringRef encodedCFString = CFURLCreateStringByAddingPercentEscapes(kCFAllocatorDefault,
                                                                          (__bridge CFStringRef) string,
                                                                          nil,
                                                                          CFSTR("?!@#$^&%*+,:;='\"`<>()[]{}/\\| "),
                                                                          kCFStringEncodingUTF8);
    
    NSString *encodedString = [[NSString alloc] initWithString:(__bridge_transfer NSString*) encodedCFString];
    
    if(!encodedString)
        encodedString = @"";
    
    return encodedString;
}

/**
 * 获取当前设置的语言
 */
+ (NSString *)getLanguage
{
    NSString *setLanguage = [[NSUserDefaults standardUserDefaults] valueForKey:RXToolUser_setLanguage];
    return setLanguage;
}

/**
 * 是否为RTL布局
 */
+ (BOOL)isRTL
{
    NSString *language = [RXToolPrivate getLanguage];
    if ([language isEqualToString:@"ar"]) {
        return YES;
    }
    return NO;
}

/**
 * NSDictionary to jsonString
 */
+ (NSString *)toJsonString:(NSDictionary *)dic
{
    @try {
        if ([dic isKindOfClass:[NSDictionary class]] && dic.allKeys.count > 0) {
            NSData *jsonData = [NSJSONSerialization dataWithJSONObject:dic options:kNilOptions error:nil];
            NSString *jsonStr = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
            
            return jsonStr;
        } else {
            return @"";
        }
    } @catch (NSException *exception) {
        NSLog(@"%@", exception);
        return @"";
    } @finally {
        
    }
}

/**
 * jsonString to NSDictionary
 */
+ (NSDictionary *)dictionaryWithJsonString:(NSString *)jsonString
{
    if (jsonString == nil) {
        return nil;
    }

    NSData *jsonData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
    NSError *err;
    NSDictionary *dic = [NSJSONSerialization JSONObjectWithData:jsonData
                                                        options:NSJSONReadingMutableContainers
                                                          error:&err];
    if(err)
    {
        NSLog(@"json解析失败：%@",err);
        return nil;
    }
    return dic;
}

@end
