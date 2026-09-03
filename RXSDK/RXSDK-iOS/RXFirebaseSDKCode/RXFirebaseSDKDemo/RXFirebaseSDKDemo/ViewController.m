//
//  ViewController.m
//  RXFirebaseSDKDemo
//
//  Created by 陈汉 on 2023/8/12.
//

#import "ViewController.h"
#import <RXFirebaseSDK/RXFirebaseSDK.h>

@interface ViewController ()

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    
    NSString *instanceid = [[RXFirebaseService sharedSDK] getInstanceId];
    NSLog(@"instanceid = %@", instanceid);
    
    // 授权登录
    UIButton *btn1 = [[UIButton alloc] initWithFrame:CGRectMake(10, 100, 130, 30)];
    [btn1 setTitle:@"授权登录" forState:UIControlStateNormal];
    [btn1 setBackgroundColor:[UIColor redColor]];
    [btn1 addTarget:self action:@selector(btnAction1) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn1];
    
    // 监听用户状态
    UIButton *btn2 = [[UIButton alloc] initWithFrame:CGRectMake(10, 150, 130, 30)];
    [btn2 setTitle:@"监听用户状态" forState:UIControlStateNormal];
    [btn2 setBackgroundColor:[UIColor redColor]];
    [btn2 addTarget:self action:@selector(btnAction2) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn2];
}

- (void)btnAction2
{
    [[RXFIRAuthService sharedSDK] addAuthStateDidChangeListener];
}

- (void)btnAction1
{
    [[RXFIRAuthService sharedSDK] signInWithEmail];
}

@end
