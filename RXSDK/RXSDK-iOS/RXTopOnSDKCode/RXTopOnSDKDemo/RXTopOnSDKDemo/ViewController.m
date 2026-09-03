//
//  ViewController.m
//  RXTopOnSDKDemo
//
//  Created by root11 on 2024/5/24.
//

#import "ViewController.h"
#import "RewardViewController.h"
#import "BannerViewController.h"
#import "InterstitialViewController.h"
#import "SplashViewController.h"
#import "NativeViewController.h"

@interface ViewController ()

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor whiteColor];
    
    for (int i = 0; i < 5; i ++) {
        UIButton *btn = [UIButton buttonWithType:UIButtonTypeCustom];
        [btn setBackgroundColor:[UIColor blueColor]];
        [btn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
        [btn setFrame:CGRectMake(10, 88 + i * 60, 100, 50)];
        btn.tag = i;
        [btn addTarget:self action:@selector(btnClick:) forControlEvents:UIControlEventTouchUpInside];
        [self.view addSubview:btn];
        if (i == 0) {
            [btn setTitle:@"激励视频" forState:UIControlStateNormal];
        }else if (i == 1) {
            [btn setTitle:@"横幅广告" forState:UIControlStateNormal];
        }else if (i == 2) {
            [btn setTitle:@"插屏广告" forState:UIControlStateNormal];
        }else if (i == 3) {
            [btn setTitle:@"开屏广告" forState:UIControlStateNormal];
        }else if (i == 4) {
            [btn setTitle:@"原生广告" forState:UIControlStateNormal];
        }else{
            NSLog(@"其他");
        }
        
        
    }
}

- (void)btnClick:(UIButton *)btn {
    if (btn.tag == 0) {
        RewardViewController *vc = [[RewardViewController alloc] init];
        [self.navigationController pushViewController:vc animated:YES];
    }else if (btn.tag == 1) {
        BannerViewController *vc = [[BannerViewController alloc] init];
        [self.navigationController pushViewController:vc animated:YES];
    }else if (btn.tag == 2) {
        InterstitialViewController *vc = [[InterstitialViewController alloc] init];
        [self.navigationController pushViewController:vc animated:YES];
    }else if (btn.tag == 3) {
        SplashViewController *vc = [[SplashViewController alloc] init];
        [self.navigationController pushViewController:vc animated:YES];
    }else if (btn.tag == 4) {
        NativeViewController *vc = [[NativeViewController alloc] init];
        [self.navigationController pushViewController:vc animated:YES];
    }else{
        NSLog(@"其他");
    }
}


@end
