//
//  ViewController.m
//  RXGoogleSDKDemo
//
//  Created by 陈汉 on 2024/5/6.
//

#import "ViewController.h"
#import <RXGoogleSDK/RXGoogleSDK.h>
#import <GoogleSignIn/GoogleSignIn.h>
#import <RXSDK_Pure/RXSDK_Pure.h>
@interface ViewController ()<RXLoginDelegate>

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    
    self.view.backgroundColor = [UIColor blackColor];
    
    UIViewController *vc = [self currentViewController];
    
    // google登录
    UIButton *btn1 = [[UIButton alloc] initWithFrame:CGRectMake(10, 100, 130, 30)];
    [btn1 setTitle:@"google登录" forState:UIControlStateNormal];
    [btn1 setBackgroundColor:[UIColor redColor]];
    [btn1 addTarget:self action:@selector(btnAction1) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn1];
    
    // youtube分享
    UIButton *btn2 = [[UIButton alloc] initWithFrame:CGRectMake(150, 100, 130, 30)];
    [btn2 setTitle:@"youtube分享" forState:UIControlStateNormal];
    [btn2 setBackgroundColor:[UIColor redColor]];
    [btn2 addTarget:self action:@selector(btnAction2) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn2];
    
    [RXService sharedSDK].loginDelegate = self;
}

- (void)btnAction2
{
//    GTLRYouTubeQuery_ChannelsList *query =
//        [GTLRYouTubeQuery_ChannelsList queryWithPart:@"snippet,statistics"];
//      query.identifier = @"UC_x5XG1OV2P6uZZ5FSM9Ttw";
//      // To retrieve data for the current user's channel, comment out the previous
//      // line (query.identifier ...) and uncomment the next line (query.mine ...).
//      // query.mine = true;
//
//      [self.service executeQuery:query
//                        delegate:self
//               didFinishSelector:@selector(displayResultWithTicket:finishedWithObject:error:)];
}

- (void)btnAction1
{    
    [[RXService sharedSDK] loginWithLoginType:LoginTypeGoogle username:@"" password:@"" captchaCode:@"" permissions:nil loginOpenId:@"" extDic:nil signFields:@[@"test",@"hh"] migrateArgs:@{@"ss":@"aa"}];
//    [[RXGoogleService sharedSDK] GLoginInWithMigrate_args:nil sign_fields:nil];
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
