//
//  ConfigController.m
//  RXUIKitDemo
//
//  Created by 陈汉 on 2023/11/28.
//

#import "ConfigController.h"
#import <RXSDK_Pure/RXSDK_Pure.h>

@interface ConfigController ()

@end

@implementation ConfigController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    
    self.view.backgroundColor = [UIColor whiteColor];
    
    [self setUI];
}

- (void)setUI
{
    UILabel *label1 = [[UILabel alloc] initWithFrame:CGRectMake(10, 110, CGRectGetWidth(self.view.frame), 30)];
    label1.textAlignment = NSTextAlignmentCenter;
    label1.text = @"渠道配置(设置成功后会自动返回上级页面)";
    label1.font = [UIFont systemFontOfSize:18];
    [self.view addSubview:label1];
    
    // 渠道配置
    UIButton *btn1 = [[UIButton alloc] initWithFrame:CGRectMake(10, 150, 130, 30)];
    [btn1 setTitle:@"12" forState:UIControlStateNormal];
    [btn1 setBackgroundColor:[UIColor redColor]];
    [btn1 addTarget:self action:@selector(btnAction1:) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn1];
    
    UIButton *btn2 = [[UIButton alloc] initWithFrame:CGRectMake(150, 150, 130, 30)];
    [btn2 setTitle:@"100" forState:UIControlStateNormal];
    [btn2 setBackgroundColor:[UIColor redColor]];
    [btn2 addTarget:self action:@selector(btnAction1:) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn2];
    
    UIButton *btn3 = [[UIButton alloc] initWithFrame:CGRectMake(290, 150, 130, 30)];
    [btn3 setTitle:@"iOS" forState:UIControlStateNormal];
    [btn3 setBackgroundColor:[UIColor redColor]];
    [btn3 addTarget:self action:@selector(btnAction1:) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn3];
    
    UILabel *label2 = [[UILabel alloc] initWithFrame:CGRectMake(10, CGRectGetMaxY(btn3.frame) + 10, CGRectGetWidth(self.view.frame), 30)];
    label2.textAlignment = NSTextAlignmentCenter;
    label2.text = @"语言配置(设置成功后会自动返回上级页面)";
    label2.font = [UIFont systemFontOfSize:18];
    [self.view addSubview:label2];
    
    // 切换语言
    UIButton *btn4 = [[UIButton alloc] initWithFrame:CGRectMake(10, CGRectGetMaxY(label2.frame) + 10, 130, 30)];
    [btn4 setTitle:@"中文" forState:UIControlStateNormal];
    [btn4 setBackgroundColor:[UIColor redColor]];
    [btn4 addTarget:self action:@selector(btnAction4) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn4];
    
    UIButton *btn5 = [[UIButton alloc] initWithFrame:CGRectMake(150, CGRectGetMinY(btn4.frame), 130, 30)];
    [btn5 setTitle:@"日文" forState:UIControlStateNormal];
    [btn5 setBackgroundColor:[UIColor redColor]];
    [btn5 addTarget:self action:@selector(btnAction5) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn5];
    
    UIButton *btn6 = [[UIButton alloc] initWithFrame:CGRectMake(290, CGRectGetMinY(btn4.frame), 130, 30)];
    [btn6 setTitle:@"英文" forState:UIControlStateNormal];
    [btn6 setBackgroundColor:[UIColor redColor]];
    [btn6 addTarget:self action:@selector(btnAction6) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn6];
}

- (void)btnAction6
{
    [[RXService sharedSDK] setLanguage:@"en"];
    [self.navigationController popViewControllerAnimated:YES];
}

- (void)btnAction5
{
    [[RXService sharedSDK] setLanguage:@"ja"];
    [self.navigationController popViewControllerAnimated:YES];
}

- (void)btnAction4
{
    [[RXService sharedSDK] setLanguage:@"zh"];
    [self.navigationController popViewControllerAnimated:YES];
}

- (void)btnAction1:(UIButton *)btn
{
    [[RXService sharedSDK] initWithProductId:@"SDK"
                                   channelId:btn.titleLabel.text
                                        cpid:@"120"
                                 baseUrlList:@[@"http://os-api-demo.ruixuecloud.com"] complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        [self.navigationController popViewControllerAnimated:YES];
    }];
}

@end
