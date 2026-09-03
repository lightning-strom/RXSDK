//
//  ViewController.m
//  RXAddressBookSDKDemo
//
//  Created by 陈汉 on 2024/5/22.
//

#import "ViewController.h"
#import <RXAddressBookSDK/RXAddressBookSDK.h>

@interface ViewController ()

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    // 获取通讯录
    UIButton *btn1 = [[UIButton alloc] initWithFrame:CGRectMake(10, 100, 130, 30)];
    [btn1 setTitle:@"获取通讯录" forState:UIControlStateNormal];
    [btn1 setBackgroundColor:[UIColor redColor]];
    [btn1 addTarget:self action:@selector(btnAction1) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn1];
}

- (void)btnAction1
{
    [[RXAddressBookService sharedSDK] fetchContacts:^(NSMutableArray * _Nonnull addressBooks, NSString * _Nonnull hash) {
        NSLog(@"");
    }];
}

@end
