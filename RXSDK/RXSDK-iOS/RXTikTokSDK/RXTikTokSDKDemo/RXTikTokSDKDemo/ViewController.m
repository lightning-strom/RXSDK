//
//  ViewController.m
//  RXTikTokSDKDemo
//
//  Created by 陈汉 on 2023/7/29.
//

#import "ViewController.h"
#import <RXTikTokSDK/RXTikTokSDK.h>
//#import <TikTokOpenSDK/TikTokOpenSDKApplicationDelegate.h>
//#import <TikTokOpenSDK/TikTokOpenSDKAuth.h>
//#import "RXTikTokSDKDemo-Bridging-Header.h"
#import <RXSDK_Pure/RXSDK_Pure.h>

@interface ViewController () <RXLoginDelegate>

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    
    [RXService sharedSDK].loginDelegate = self;
    
    // 登录
    UIButton *btn1 = [[UIButton alloc] initWithFrame:CGRectMake(10, 100, 130, 30)];
    [btn1 setTitle:@"登录" forState:UIControlStateNormal];
    [btn1 setBackgroundColor:[UIColor redColor]];
    [btn1 addTarget:self action:@selector(btnAction1) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn1];
    
    // 分享
    UIButton *btn2 = [[UIButton alloc] initWithFrame:CGRectMake(150, 100, 130, 30)];
    [btn2 setTitle:@"分享单图" forState:UIControlStateNormal];
    [btn2 setBackgroundColor:[UIColor redColor]];
    [btn2 addTarget:self action:@selector(btnAction2) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn2];
    
    //分享多图
    UIButton *btn3 = [[UIButton alloc] initWithFrame:CGRectMake(10, 140, 130, 30)];
    [btn3 setTitle:@"分享多图" forState:UIControlStateNormal];
    [btn3 setBackgroundColor:[UIColor redColor]];
    [btn3 addTarget:self action:@selector(btnAction3) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn3];
    
}

- (void)btnAction1
{
//    [[RXTikTokService sharedSDK] login];
    [[RXService sharedSDK] loginWithExtDic:nil username:nil password:nil sign_fields:nil loginType:LoginTypeTikTok migrate_args:nil];
}

- (void)btnAction2
{
//    [[UIApplication sharedApplication] openURL:[NSURL URLWithString:@"snssdk1233://"] options:nil completionHandler:nil];
    
//    NSString *filePath = [[NSBundle mainBundle] pathForResource:@"1707115720680814" ofType:@"mp4"];
//    NSString *filePath = @"https://rx-wlqipai-jiaxiang-v3.oss-cn-beijing.aliyuncs.com/ruixue/feedback/1711200843942/充值.mp4";
//    NSString *filePath = @"https://oss-anchor-v2.weile.com/share/link_contents/13.png";
//    NSString *filePath = [[NSBundle mainBundle] pathForResource:@"test.mp4" ofType:nil];
//    NSString *filePath = @"http://guanwangyun.oss-cn-beijing.aliyuncs.com/document/460_1712035728.mp4";
//    [[RXTikTokService sharedSDK] shareWithType:RXTTShareTypeVideo landedPageType:RXTTShareTypeLandedPageTypePublish hashTag:@"ffff" medias:@[filePath] complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//            
//    }];
    
    RXShareConfig *config = [[RXShareConfig alloc] init];
    config.func = @"sdk_chengjiu";
    config.platform = @"tiktok";
    
    [[RXShareService sharedSDK] share:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        NSLog(@"55555");
    }];
}

- (void)btnAction3{
    RXShareConfig *config = [[RXShareConfig alloc] init];
    config.func = @"sdk_chengjius";
    config.platform = @"tiktok";
    
    [[RXShareService sharedSDK] share:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        NSLog(@"55555");
    }];
}

- (void)rx_LoginCallBackWithResponse:(NSDictionary *)response error:(RX_CommonRequestError *)error
{
    if (!error) {
        
    }
}

@end
