//
//  ViewController.m
//  RXOpeninstallSDKDemo
//
//  Created by 陈汉 on 2025/11/18.
//

#import "ViewController.h"
#import <RXOpeninstallOSSDK/RXOpeninstallOSSDK.h>
#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXUIKit/RXUIKit.h>

@interface ViewController ()

@property (nonatomic, strong) NSString *loginOpenid;

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    
    self.view.backgroundColor = [UIColor blackColor];
    
    // 获取安装参数
    UIButton *btn1 = [[UIButton alloc] initWithFrame:CGRectMake(10, 100, 130, 30)];
    [btn1 setTitle:@"获取安装参数" forState:UIControlStateNormal];
    [btn1 setBackgroundColor:[UIColor redColor]];
    [btn1 addTarget:self action:@selector(btnAction1) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn1];
    
    // 获取启动参数
    UIButton *btn2 = [[UIButton alloc] initWithFrame:CGRectMake(150, 100, 130, 30)];
    [btn2 setTitle:@"获取启动参数" forState:UIControlStateNormal];
    [btn2 setBackgroundColor:[UIColor redColor]];
    [btn2 addTarget:self action:@selector(btnAction2) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn2];
    
    // 登录
    UIButton *btn3 = [[UIButton alloc] initWithFrame:CGRectMake(290, 100, 130, 30)];
    [btn3 setTitle:@"登录" forState:UIControlStateNormal];
    [btn3 setBackgroundColor:[UIColor redColor]];
    [btn3 addTarget:self action:@selector(btnAction3) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn3];
    
    // 二次登录
    UIButton *btn4 = [[UIButton alloc] initWithFrame:CGRectMake(10, 150, 130, 30)];
    [btn4 setTitle:@"二次登录" forState:UIControlStateNormal];
    [btn4 setBackgroundColor:[UIColor redColor]];
    [btn4 addTarget:self action:@selector(btnAction4) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn4];
    
    // 获取分享链接
    UIButton *btn5 = [[UIButton alloc] initWithFrame:CGRectMake(150, 150, 130, 30)];
    [btn5 setTitle:@"获取分享链接" forState:UIControlStateNormal];
    [btn5 setBackgroundColor:[UIColor redColor]];
    [btn5 addTarget:self action:@selector(btnAction5) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn5];
    
    [[RXOpeninstallService sharedSDK] regist];
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        [self btnAction2];
    });
}

- (void)btnAction5
{
    RXShareConfig *config = [[RXShareConfig alloc] init];
    config.func = @"share_link"; // 链接埋点
    config.platform = @"wechat";
    config.androidScheme = @"gyjljg";
    config.iOSScheme = @"gyjljg";
    
//    config.useShortUrl = YES;
    config.readCache = NO;
    
    // 【可选】大数据预置属性透传参数
    config.setCustomExt = @{@"bigdata_ext" : @{@"a" : @"b"}};
    
    config.properties = @{@"key" : @"value"};
    NSString *transmits = @"a=b";
    
    config.transmits = [transmits stringByAddingPercentEncodingWithAllowedCharacters:[NSCharacterSet URLQueryAllowedCharacterSet]];
    
    [[RXShareService sharedSDK] getShareInfoWithConfig:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        
        NSString *url = response[@"data"][@"content"][@"url"];
        
        url = [NSString stringWithFormat:@"https://rxfile-test.ruixueyun.com%@&sdkVersion=test-v5", url];
        
        UIAlertAction *cancelAction=[UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
        }];
        UIAlertController *alertController=[UIAlertController alertControllerWithTitle:@"分享链接" message:[NSString stringWithFormat:@"%@", url] preferredStyle:UIAlertControllerStyleAlert];
        [alertController addAction:cancelAction];
        [self presentViewController:alertController animated:YES completion:nil];
        
        UIPasteboard *pasteboard = [UIPasteboard generalPasteboard];
        pasteboard.string = url;
    }];
}

- (void)btnAction4
{
    [[RXService sharedSDK] loginWithLoginType:LoginTypeVisitor username:nil password:nil captchaCode:nil permissions:nil loginOpenId:self.loginOpenid extDic:nil signFields:nil migrateArgs:nil complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        self.loginOpenid = response[@"data"][@"login_openid"];
    }];
}

- (void)btnAction3
{
    RXSdkInitConfig *config = [[RXSdkInitConfig alloc] init];
    config.productId = @"1002";
    config.channelId = @"iOS";
    config.cpId = @"114";
    config.baseUrlList = @[@"https://cn-api-test.ruixueyun.com/"];
    config.isUseDNS = YES;
    config.openRacing = NO;
    [[RXService sharedSDK] initWithConfig:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (!error) {
            NSLog(@"初始化成功");
            RXLoginUIModel *model = [[RXLoginUIModel alloc] init];
            model.loginMethods = @[@"captchacode", @"username", @"guest"];
            
            [[RXUIKitService sharedSDK] showLoginViewWithConfig:model complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
                self.loginOpenid = response[@"data"][@"login_openid"];
                
                NSString *msg = @"";
                if (!error) {
                    msg = [NSString stringWithFormat:@"%@", response];
                } else {
                    msg = [NSString stringWithFormat:@"%@", error.responesObject];
                }
                UIAlertAction *cancelAction=[UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
                }];
                UIAlertController *alertController=[UIAlertController alertControllerWithTitle:@"登录结果" message:msg preferredStyle:UIAlertControllerStyleAlert];
                [alertController addAction:cancelAction];
                [self presentViewController:alertController animated:YES completion:nil];
            }];
        } else {
            NSLog(@"初始化失败");
        }
    }];
    
    return;
//    [[RXService sharedSDK] loginWithLoginType:LoginTypeVisitor username:nil password:nil captchaCode:nil permissions:nil loginOpenId:nil extDic:nil signFields:nil migrateArgs:nil complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        self.loginOpenid = response[@"data"][@"login_openid"];
//    }];
    
    RXLoginUIModel *model = [[RXLoginUIModel alloc] init];
    model.loginMethods = @[@"captchacode", @"username", @"guest"];
    
    [[RXUIKitService sharedSDK] showLoginViewWithConfig:model complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
        self.loginOpenid = response[@"data"][@"login_openid"];
        
        NSString *msg = @"";
        if (!error) {
            msg = [NSString stringWithFormat:@"%@", response];
        } else {
            msg = [NSString stringWithFormat:@"%@", error.responesObject];
        }
        UIAlertAction *cancelAction=[UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
        }];
        UIAlertController *alertController=[UIAlertController alertControllerWithTitle:@"登录结果" message:msg preferredStyle:UIAlertControllerStyleAlert];
        [alertController addAction:cancelAction];
        [self presentViewController:alertController animated:YES completion:nil];
    }];
}

- (void)btnAction1
{
    [[RXOpeninstallService sharedSDK] regist];
    [[RXOpeninstallService sharedSDK] getInstallParamsWithComplete:^(NSDictionary * _Nonnull params) {
        UIAlertAction *cancelAction=[UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
        }];
        UIAlertController *alertController=[UIAlertController alertControllerWithTitle:@"透传参数" message:[NSString stringWithFormat:@"%@", params] preferredStyle:UIAlertControllerStyleAlert];
        [alertController addAction:cancelAction];
        [self presentViewController:alertController animated:YES completion:nil];
    }];
}

- (void)btnAction2
{
    [RXOpeninstallService sharedSDK].installParamsBlock = ^(NSDictionary * _Nonnull params) {
        UIAlertAction *cancelAction=[UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
        }];
        UIAlertController *alertController=[UIAlertController alertControllerWithTitle:@"透传参数" message:[NSString stringWithFormat:@"%@", params[@"data"]] preferredStyle:UIAlertControllerStyleAlert];
        [alertController addAction:cancelAction];
        [self presentViewController:alertController animated:YES completion:nil];
    };
}

@end
