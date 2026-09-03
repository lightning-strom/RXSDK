//
//  ViewController.m
//  RXBDASignalSDKDemo
//
//  Created by 陈汉 on 2025/3/5.
//

#import "ViewController.h"
#import <RXBDASignalSDK/RXBDASignalSDK.h>
#import <RXSDK_Pure/RXSDK_Pure.h>

@interface ViewController ()

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    // 上报事件
    UIButton *btn1 = [[UIButton alloc] initWithFrame:CGRectMake(10, 100, 130, 30)];
    [btn1 setTitle:@"上报事件" forState:UIControlStateNormal];
    [btn1 setBackgroundColor:[UIColor redColor]];
    [btn1 addTarget:self action:@selector(btnAction1) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn1];
    
    // 防沉迷
    UIButton *btn2 = [[UIButton alloc] initWithFrame:CGRectMake(150, 100, 130, 30)];
    [btn2 setTitle:@"防沉迷" forState:UIControlStateNormal];
    [btn2 setBackgroundColor:[UIColor redColor]];
    [btn2 addTarget:self action:@selector(btnAction2) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn2];
    
    // 权限
    UIButton *btn3 = [[UIButton alloc] initWithFrame:CGRectMake(10, 150, 130, 30)];
    [btn3 setTitle:@"权限" forState:UIControlStateNormal];
    [btn3 setBackgroundColor:[UIColor redColor]];
    [btn3 addTarget:self action:@selector(btnAction3) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn3];
    
    // 切换屏幕方向
    UIButton *btn4 = [[UIButton alloc] initWithFrame:CGRectMake(290, 100, 130, 30)];
    [btn4 setTitle:@"切换屏幕方向" forState:UIControlStateNormal];
    [btn4 setBackgroundColor:[UIColor redColor]];
    [btn4 addTarget:self action:@selector(btnAction4) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn4];
    
    // 单条协议
    UIButton *btn5 = [[UIButton alloc] initWithFrame:CGRectMake(10, 200, 130, 30)];
    [btn5 setTitle:@"单条协议" forState:UIControlStateNormal];
    [btn5 setBackgroundColor:[UIColor redColor]];
    [btn5 addTarget:self action:@selector(btnAction5) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn5];
}

- (void)btnAction1
{
//    UISceneConnectionOptions *conn = [[RXBDAsignalService sharedSDK] connetOptions];
//    NSDictionary *launchDic = [[RXBDAsignalService sharedSDK] launchOptions];
//    
//    [[RXBDAsignalService sharedSDK] trackEssentialEventWithName:@"test" params:@{}];
    
    [[RXService sharedSDK] loginWithLoginType:LoginTypeVisitor username:nil password:nil captchaCode:nil permissions:nil loginOpenId:nil extDic:nil signFields:nil migrateArgs:nil complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
            
    }];
}

@end
