//
//  ViewController.m
//  RXUniPinSDKDemo
//
//  Created by root11 on 2024/5/14.
//

#import "ViewController.h"
#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXUniPinSDK/RXUniPinSDK.h>

@interface ViewController ()<RXLoginDelegate>

@property (nonatomic, copy) NSString *loginOpenid;

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    [RXService sharedSDK].loginDelegate = self;
    
    UIButton *btn = [[UIButton alloc] initWithFrame:CGRectMake(0, 100, 130, 30)];
    [btn setTitle:@"游客登录" forState:UIControlStateNormal];
    [btn setBackgroundColor:[UIColor redColor]];
    [btn addTarget:self action:@selector(btnAction) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn];
    
    // 登录
    UIButton *btn1 = [[UIButton alloc] initWithFrame:CGRectMake(140, 100, 130, 30)];
    [btn1 setTitle:@"unipin支付" forState:UIControlStateNormal];
    [btn1 setBackgroundColor:[UIColor redColor]];
    [btn1 addTarget:self action:@selector(btnAction1) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn1];
}

- (void)btnAction{
    [[RXService sharedSDK] loginWithExtDic:@{@"method":@"guest"} username:@"rxaccount" password:@"111111aA!" sign_fields:nil loginType:LoginTypeVisitor migrate_args:nil];
}

- (void)btnAction1{
    NSMutableDictionary *dict = [NSMutableDictionary dictionary];
//    [dict setValue:@"iap7" forKey:@"goods_tag"]; // 商品标签
//    [dict setValue:@"831000076" forKey:@"goods_tag"]; // 商品标签
//    [dict setValue:@(20) forKey:@"age"]; // 用户年龄,indulge_auth为1时必传该字段
    
    [dict setValue:@"ios_tag" forKey:@"goods_tag"]; // 商品标签
    [dict setValue:[self getTime] forKey:@"trade_no"]; // 订单号
    [dict setValue:@(1) forKey:@"is_debug"]; // 是否测试订单 默认 0 正式  1 为测试订单
    [dict setValue:@(1) forKey:@"env"]; // 是否使用沙盒环境支付 0 正式  1 沙盒
    [dict setValue:@"IDR" forKey:@"currency"]; // 币种 默认传: CNY
//    [dict setValue:@{@"pay_type" : @"wechat", @"pay_way" : @"SDK_PAY"} forKey:@"ext"]; // 支付扩展字段 三方支付额外传递参数 详见下面具体渠道
    [dict setValue:@"" forKey:@"notify_url"]; // 支付成功通知CP发货地址
    [dict setValue:@"" forKey:@"transmit_args"]; // 客户端透传参数 非必传
    [dict setValue:@(0) forKey:@"indulge_auth"]; // 是否进行防沉迷验证  0不验证，1验证，默认不验证
    [dict setValue:@{@"cp_game_character_id" : @"123", @"cp_game_area_id" : @"456"} forKey:@"game_info"];
    [dict setValue:@"unipin" forKey:@"pay_type"];
    [[RXPayService sharedSDK] requestWithDict:dict completeHandle:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        NSString *str = [NSString stringWithFormat:@"%@", response];
        if(!error){
            NSLog(@"支付成功");
        }else{
            NSLog(@"支付失败");
            str = [NSString stringWithFormat:@"%@", error.responesObject];
        }
        
        UIAlertAction *cancelAction=[UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
        }];
        UIAlertController *alertController=[UIAlertController alertControllerWithTitle:@"支付结果" message:str preferredStyle:UIAlertControllerStyleAlert];
        [alertController addAction:cancelAction];
        [[self currentViewController] presentViewController:alertController animated:YES completion:nil];
    }];
}

#pragma mark -- <登录回调>
- (void)rx_LoginCallBackWithResponse:(NSDictionary *)response error:(RX_CommonRequestError *)error
{
    if (!error) {
        self.loginOpenid = response[@"data"][@"login_openid"];
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:response options:NSJSONWritingPrettyPrinted error:nil];
        NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        NSString *log = [[RXLogService sharedSDK] getSDKLog];
        NSLog(@"");
    } else {
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:error.responesObject options:NSJSONWritingPrettyPrinted error:nil];
        NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        NSLog(@"");
    }
    
//
//    UIAlertAction *cancelAction=[UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
//    }];
//    UIAlertController *alertController=[UIAlertController alertControllerWithTitle:@"登录结果" message:[NSString stringWithFormat:@"%@", error.error] preferredStyle:UIAlertControllerStyleAlert];
//    [alertController addAction:cancelAction];
//    [[self currentViewController] presentViewController:alertController animated:YES completion:nil];
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

- (NSString *)getTime{
    NSDate* date = [NSDate dateWithTimeIntervalSinceNow:0];
    NSTimeInterval a=[date timeIntervalSince1970]*1000; // *1000 是精确到毫秒，不乘就是精确到秒
    NSString *timeString = [NSString stringWithFormat:@"%.0f", a]; //转为字符型
    return timeString;
}

@end
