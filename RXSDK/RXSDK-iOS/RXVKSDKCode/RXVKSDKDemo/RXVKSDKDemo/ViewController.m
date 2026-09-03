//
//  ViewController.m
//  RXVKSDKDemo
//
//  Created by 陈汉 on 2024/5/6.
//

#import "ViewController.h"
#import <RXVKSDK/RXVKSDK.h>
#import <RXSDK_Pure/RXSDK_Pure.h>
@interface ViewController ()<RXLoginDelegate>

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    
    self.view.backgroundColor = [UIColor blackColor];
    
    UIViewController *vc = [self currentViewController];
    
    // VK 登录
    UIButton *btn1 = [[UIButton alloc] initWithFrame:CGRectMake(10, 100, 130, 30)];
    [btn1 setTitle:@"VK登录" forState:UIControlStateNormal];
    [btn1 setBackgroundColor:[UIColor redColor]];
    [btn1 addTarget:self action:@selector(btnAction1) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn1];
    
    [RXService sharedSDK].loginDelegate = self;
}

- (void)btnAction1
{    
    [[RXService sharedSDK] loginWithLoginType:LoginTypeVK username:@"" password:@"" captchaCode:@"" permissions:nil loginOpenId:@"" extDic:nil signFields:@[@"test",@"hh"] migrateArgs:@{@"ss":@"aa"}];
//    [[RXVKService sharedSDK] VKLoginWithMigrate_args:nil sign_fields:nil];
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

- (void)rx_LoginCallBackWithResponse:(NSDictionary *)response error:(RX_CommonRequestError *)error
{
    NSLog(@"");
}

@end
