//
//  ViewController.m
//  RXZaloSDKDemo
//
//  Created by 陈汉 on 2024/3/22.
//

#import "ViewController.h"
#import <RXZaloSDK/RXZaloSDK.h>
#import <RXSDK_Pure/RXSDK_Pure.h>
#import <ZaloSDK/ZaloSDK.h>

@interface ViewController () <RXLoginDelegate>

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    
    [RXService sharedSDK].loginDelegate = self;
    
    // 一键登录
    UIButton *btn1 = [[UIButton alloc] initWithFrame:CGRectMake(10, 100, 130, 30)];
    [btn1 setTitle:@"一键登录" forState:UIControlStateNormal];
    [btn1 setBackgroundColor:[UIColor redColor]];
    [btn1 addTarget:self action:@selector(btnAction1) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn1];
    
    // 分享
    UIButton *btn2 = [[UIButton alloc] initWithFrame:CGRectMake(150, 100, 130, 30)];
    [btn2 setTitle:@"分享好友" forState:UIControlStateNormal];
    [btn2 setBackgroundColor:[UIColor redColor]];
    [btn2 addTarget:self action:@selector(btnAction2) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn2];
    
    // 分享
    UIButton *btn3 = [[UIButton alloc] initWithFrame:CGRectMake(290, 100, 130, 30)];
    [btn3 setTitle:@"分享朋友圈" forState:UIControlStateNormal];
    [btn3 setBackgroundColor:[UIColor redColor]];
    [btn3 addTarget:self action:@selector(btnAction3) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn3];
    
//    [[RXZaloService sharedSDK] isZaloInstalled];
    
    NSURL *zaloURL = [NSURL URLWithString:@"zalo://"];
    [[UIApplication sharedApplication] canOpenURL:zaloURL];
    
}

- (void)btnAction3
{
//    [[RXShareService sharedSDK] getShareInfoWithFunc:@"zalo" platform:@"zalo" region:@"" transmits:nil ext:nil readCache:NO complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        NSString *url = response[@"data"][@"content"][@"url"];
//        NSLog(@"contenturl = %@", url);
//        
//        UIAlertAction *cancelAction=[UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
//        }];
//        UIAlertController *alertController=[UIAlertController alertControllerWithTitle:@"alert" message:url preferredStyle:UIAlertControllerStyleAlert];
//        [alertController addAction:cancelAction];
//        
////        [[self currentViewController] presentViewController:alertController animated:YES completion:nil];
//        
//        UIPasteboard *pasteboard = [UIPasteboard generalPasteboard];
//        pasteboard.string = url;
//        
//    }];
//    return;
    
    RXCustomShareConfig *customConfig = [[RXCustomShareConfig alloc] init];
    customConfig.materialType = @"url";
    customConfig.url = @"https://www.baidu.com";
    customConfig.image = @"https://rxfile-test.ruixuecloud.com/2024/06/26/1719382570898.jpg";
    customConfig.platform = @"system";
    customConfig.shareScene = 1;
    customConfig.x = 1577;
    customConfig.y = 757;
    customConfig.width = 200;
    customConfig.height = 200;
    customConfig.borderSize = 10;
    
    [[RXShareService sharedSDK] shareCustom:customConfig complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
            
    }];
}

- (void)btnAction2
{
//    NSDictionary *dic = @{
//        @"url" : @"https://www.baidu.com",
//        @"title" : @"title",
//        @"content" : @"desc",
//        
////        @"url" : @"http://developers.zalo.me/",
////        @"title" : @"Tên Của App Tích Hợp",
////        @"content" : @"Câu message muốn chia sẻ",
//        @"shareScene" : @(-1)
//    };
//    
//    [[RXZaloService sharedSDK] shareWithShareInfo:dic complete:^(NSDictionary * _Nonnull response) {
//        NSLog(@"");
//    }];
    
//    RXCustomShareConfig *config = [[RXCustomShareConfig alloc] init];
//    config.platform = @"zalo";
//    config.url = @"http://developers.zalo.me/";
//    config.title = @"Tên Của App Tích Hợp";
//    config.content = @"Câu message muốn chia sẻ";
//    config.shareScene = 1;
//    
//    [[RXShareService sharedSDK] shareCustom:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        NSLog(@"");
//        
//    }];
//    [[ZaloSDK sharedInstance] initializeWithAppId:@"1290303975374472026"];
//    
    RXShareConfig *config = [[RXShareConfig alloc] init];
    config.func = @"active_invitefri_zalo";
    config.platform = @"zalo";
    config.shareScene = 1;
    
    [[RXShareService sharedSDK] share:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        NSLog(@"");
    }];
    return;
    
    
//    ZOFeed *feed = [[ZOFeed alloc] initWithLink:@"http://developers.zalo.me/" appName:@"Tên Của App Tích Hợp" message:@"Câu message muốn chia sẻ" others:nil];
//    feed.linkSource = @"http://developers.zalo.me/";
//    feed.linkTitle = @"Tên Của App Tích Hợp";
//    feed.linkDesc = @"Câu message muốn chia sẻ";
    
//    [[ZaloSDK sharedInstance] shareFeed:feed inController:self callback:^(ZOShareResponseObject *response) {
//        NSLog(@"");
//    }];
    
//    [[ZaloSDK sharedInstance] sendMessage:feed inController:self callback:^(ZOShareResponseObject *response) {
//        NSLog(@"");
//    }];
        
}

- (void)btnAction1
{
//    [[RXService sharedSDK] loginWithExtDic:nil username:nil password:nil sign_fields:nil loginType:LoginTypeVisitor migrate_args:nil];
//    return;
    
    
//    [[RXZaloService sharedSDK] loginWithAuthenType:RXZaloSDKAuthenTypeViaZaloAppOnly ext:nil];
    [[RXService sharedSDK] loginWithExtDic:nil username:nil password:nil sign_fields:nil loginType:LoginTypeZalo migrate_args:nil];
}

- (void)rx_LoginCallBackWithResponse:(NSDictionary *)response error:(RX_CommonRequestError *)error
{
    if (!error) {
        
    }
}

@end
