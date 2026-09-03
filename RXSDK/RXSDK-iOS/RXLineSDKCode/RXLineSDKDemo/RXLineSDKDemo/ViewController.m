//
//  ViewController.m
//  RXLineSDKDemo
//
//  Created by 陈汉 on 2023/3/8.
//

#import "ViewController.h"
#import <RXLineSDK/RXLineSDK.h>
#import <RXSDK_Pure/RXSDK_Pure.h>

@interface ViewController () <RXLoginDelegate>

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    [self setUI];
}

- (void)setUI
{
    // line登录
    UIButton *btn1 = [[UIButton alloc] initWithFrame:CGRectMake(10, 100, 130, 30)];
    [btn1 setTitle:@"line登录" forState:UIControlStateNormal];
    [btn1 setBackgroundColor:[UIColor redColor]];
    [btn1 addTarget:self action:@selector(btnAction1) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn1];
    
    [RXService sharedSDK].loginDelegate = self;
    
    
}

- (void)btnAction1
{
    [[RXLineService sharedSDK] loginWithPermissions:@[@"profile"] sign_fields:nil migrate_args:nil];
    
    [[RXLineService sharedSDK] shareWithContent:@"快快下载，和我一起来玩吧！" url:@"https://iwn478abe.fishinggamezone.com/landing/third/LBwCfDfGEdF7DBfKDzZXfS/1694160696/06-vi/index.html?identity=6lA8FViSg&api=wygzt.homelandfishingarcade.com" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        
    }];
}

- (void)rx_LoginCallBackWithResponse:(NSDictionary *)response error:(RX_CommonRequestError *)error
{
    NSLog(@"");
}

@end
