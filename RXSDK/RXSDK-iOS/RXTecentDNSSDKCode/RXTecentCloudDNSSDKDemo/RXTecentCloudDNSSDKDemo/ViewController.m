//
//  ViewController.m
//  RXTecentCloudDNSSDKDemo
//
//  Created by root11 on 2024/8/8.
//

#import "ViewController.h"
#import <RXTecentCloudDNSSDK/RXTecentCloudDNSSDK.h>
@interface ViewController ()

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor whiteColor];
    UIButton *btn = [[UIButton alloc] initWithFrame:CGRectMake(0, 100, 150, 30)];
    [btn setTitle:@"解析http请求" forState:UIControlStateNormal];
    btn.backgroundColor = [UIColor redColor];
    [btn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    [btn addTarget:self action:@selector(btnClick) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn];
    
    UIButton *btn1 = [[UIButton alloc] initWithFrame:CGRectMake(160, 100, 150, 30)];
    [btn1 setTitle:@"解析https请求" forState:UIControlStateNormal];
    btn1.backgroundColor = [UIColor redColor];
    [btn1 setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    [btn1 addTarget:self action:@selector(btn1Click) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn1];
}

- (void)btnClick{
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:@"http://cn-api-test.ruixuecloud.com"]];
    [[RXTecentCloudDNSSDKService sharedSDK] httpDNSQueryWithRequest:request SuccessBlock:^(NSURLSessionDataTask * _Nonnull task, id _Nullable data) {
        NSLog(@"%@", data);
    } ErrorBlock:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
        NSLog(@"%@", error.description);
    }];
}

- (void)btn1Click{
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:@"https://cn-api-test.ruixuecloud.com"]];
    [[RXTecentCloudDNSSDKService sharedSDK] httpDNSQueryWithRequest:request SuccessBlock:^(NSURLSessionDataTask * _Nonnull task, id _Nullable data) {
        NSLog(@"%@", data);
    } ErrorBlock:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
        NSLog(@"%@", error.description);
    }];
}

@end
