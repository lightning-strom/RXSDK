//
//  ViewController.m
//  RXAliCloudDNSSDKDemo
//
//  Created by root11 on 2024/8/6.
//

#import "ViewController.h"
#import <RXAliCloudDNSSDK/RXAliCloudDNSSDK.h>

@interface ViewController ()

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    UIButton *btn = [UIButton buttonWithType:UIButtonTypeCustom];
    [btn setFrame:CGRectMake(0, 100, 100, 30)];
    [btn setTitle:@"解析" forState:UIControlStateNormal];
    [btn setBackgroundColor:[UIColor redColor]];
    [btn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    [btn addTarget:self action:@selector(btnClick) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn];
    
    UIButton *btn1 = [UIButton buttonWithType:UIButtonTypeCustom];
    [btn1 setFrame:CGRectMake(140, 100, 150, 30)];
    [btn1 setTitle:@"解析发送http" forState:UIControlStateNormal];
    [btn1 setBackgroundColor:[UIColor redColor]];
    [btn1 setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    [btn1 addTarget:self action:@selector(btn1Click) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn1];
    
    UIButton *btn2 = [UIButton buttonWithType:UIButtonTypeCustom];
    [btn2 setFrame:CGRectMake(0, 140, 150, 30)];
    [btn2 setTitle:@"解析发送https" forState:UIControlStateNormal];
    [btn2 setBackgroundColor:[UIColor redColor]];
    [btn2 setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    [btn2 addTarget:self action:@selector(btn2Click) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn2];
}

- (void)btnClick{
    NSString *ip = [[RXAliCloudDNSSDKService sharedSDK] resolveAvailableIp:@"cn-api-test.ruixuecloud.com"];
    NSLog(@"===%@",ip);
}

- (void)btn1Click{
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:@"http://cn-api-test.ruixuecloud.com"]];
    [[RXAliCloudDNSSDKService sharedSDK] httpDNSQueryWithRequest:request SuccessBlock:^(NSURLSessionDataTask * _Nonnull task, id _Nullable data) {
        NSLog(@"%@", data);
    } ErrorBlock:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
        NSLog(@"%@", error.description);
    }];
}

- (void)btn2Click{
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:@"https://cn-api-test.ruixuecloud.com"]];
    [[RXAliCloudDNSSDKService sharedSDK] httpDNSQueryWithRequest:request SuccessBlock:^(NSURLSessionDataTask * _Nonnull task, id _Nullable data) {
        NSLog(@"%@", data);
    } ErrorBlock:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
        NSLog(@"%@", error.description);
    }];
}



@end
