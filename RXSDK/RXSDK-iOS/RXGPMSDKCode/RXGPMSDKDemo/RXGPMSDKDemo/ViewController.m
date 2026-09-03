//
//  ViewController.m
//  RXGPMSDKDemo
//
//  Created by root11 on 2024/8/27.
//

#import "ViewController.h"
#import <RXGPMSDK/RXGPMSDK.h>

@interface ViewController ()

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor whiteColor];
    UIButton *btn = [UIButton buttonWithType:UIButtonTypeCustom];
    [btn setFrame:CGRectMake(0, 88, 120, 30)];
    [btn setBackgroundColor:[UIColor redColor]];
    [btn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    [btn setTitle:@"FPS" forState:UIControlStateNormal];
    [btn addTarget:self action:@selector(btnClick) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn];
    
    UIButton *btn1 = [UIButton buttonWithType:UIButtonTypeCustom];
    [btn1 setFrame:CGRectMake(130, 88, 120, 30)];
    [btn1 setBackgroundColor:[UIColor redColor]];
    [btn1 setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    [btn1 setTitle:@"占用内存" forState:UIControlStateNormal];
    [btn1 addTarget:self action:@selector(btn1Click) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn1];
    
    UIButton *btn2 = [UIButton buttonWithType:UIButtonTypeCustom];
    [btn2 setFrame:CGRectMake(260, 88, 120, 30)];
    [btn2 setBackgroundColor:[UIColor redColor]];
    [btn2 setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    [btn2 setTitle:@"剩余电量" forState:UIControlStateNormal];
    [btn2 addTarget:self action:@selector(btn2Click) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn2];
}

- (void)btnClick{
    [[RXGPMService sharedSDK] getAllInfoWithCompletion:^(NSDictionary * _Nonnull propertiesDict) {
        NSLog(@"%@",propertiesDict);
    }];
    return;
    [[RXGPMService sharedSDK] getCurrentFPSAndJankWithBlock:^(int FPS, int JANK) {
        NSLog(@"%d",FPS);
        NSLog(@"%d",JANK);
    }];
}

- (void)btn1Click{
    double memeory = [[RXGPMService sharedSDK] memoryUsage];
    NSLog(@"memory:%f",memeory);
}

- (void)btn2Click{
    int batteryLevel = [[RXGPMService sharedSDK] getBatteryLevel];
    NSLog(@"剩余电量：%d",batteryLevel);
}


@end
