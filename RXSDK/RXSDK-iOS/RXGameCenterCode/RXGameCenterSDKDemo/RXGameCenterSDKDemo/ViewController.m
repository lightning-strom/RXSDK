//
//  ViewController.m
//  RXGameCenterSDKDemo
//
//  Created by 陈汉 on 2025/9/15.
//

#import "ViewController.h"
#import <RXGameCenterSDK/RXGameCenterSDK.h>

@interface ViewController ()

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    
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

- (void)btnClick
{
    [[RXGameCenterService sharedSDK] showGameCenterWithComplete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (!error) {
            NSLog(@"Game Center 展示主界面成功");
        } else {
            NSLog(@"Game Center 展示主界面成功失败 %@", error.responesObject);
        }
    }];
    
//    [[RXGameCenterService sharedSDK] authenticateWithComplete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        if (!error) {
//            NSLog(@"Game Center 登录成功");
//        } else {
//            NSLog(@"Game Center 登录失败 %@", error.responesObject);
//        }
//    }];
    
//    [[RXGameCenterService sharedSDK] submitScoreWithScore:分数 leaderboardID:排行榜 id complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        if (!error) {
//            NSLog(@"Game Center 上传排行榜成功");
//        } else {
//            NSLog(@"Game Center 上传排行榜失败 %@", error.responesObject);
//        }
//    }];
    
//    [[RXGameCenterService sharedSDK] unlockGKAchievementWithAchievementID: 成就 id percentComplete:进度 complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        if (!error) {
//            NSLog(@"Game Center 解锁成就进度成功");
//        } else {
//            NSLog(@"Game Center 解锁成就进度失败 %@", error.responesObject);
//        }
//    }];
}

@end
