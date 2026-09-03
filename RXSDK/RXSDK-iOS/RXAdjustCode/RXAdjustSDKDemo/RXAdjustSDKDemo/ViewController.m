//
//  ViewController.m
//  RXAdjustSDKDemo
//
//  Created by 陈汉 on 2023/8/10.
//

#import "ViewController.h"
#import <RXAdjustSDK/RXAdjustSDK.h>
#import <RXSDK_Pure/RXSDK_Pure.h>
#import <objc/runtime.h>

@interface ViewController () <RXAdjustDelegate, RXLoginDelegate>

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    
    [RXAdjust sharedSDK].delegate = self;
    
    // 设置日志等级
    [[RXAdjust sharedSDK] setLogLevel:RXADJLogLevelVerbose];
    
    // 初始化
    RXADJConfig *config = [RXADJConfig configWithAppToken:@"a7tay9toq29s" environment:RXADJEnvironmentProduction];
    config.delayStart = 10;
    [[RXAdjust sharedSDK] appDidLaunch:config];
    
    
    [self setUI];
}

- (void)setUI
{
    // 获取adid
    UIButton *btn1 = [[UIButton alloc] initWithFrame:CGRectMake(10, 100, 130, 30)];
    [btn1 setTitle:@"获取adid" forState:UIControlStateNormal];
    [btn1 setBackgroundColor:[UIColor redColor]];
    [btn1 addTarget:self action:@selector(btnAction1) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn1];
    
    // 上报收入
    UIButton *btn2 = [[UIButton alloc] initWithFrame:CGRectMake(10, 150, 130, 30)];
    [btn2 setTitle:@"上报收入" forState:UIControlStateNormal];
    [btn2 setBackgroundColor:[UIColor redColor]];
    [btn2 addTarget:self action:@selector(btnAction2) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn2];
    
    // 一键登录
    UIButton *btn3 = [[UIButton alloc] initWithFrame:CGRectMake(150, 100, 130, 30)];
    [btn3 setTitle:@"一键登录" forState:UIControlStateNormal];
    [btn3 setBackgroundColor:[UIColor redColor]];
    [btn3 addTarget:self action:@selector(btnAction3) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn3];
    
    // 苹果支付
    UIButton *btn4 = [[UIButton alloc] initWithFrame:CGRectMake(150, 150, 130, 30)];
    [btn4 setTitle:@"苹果支付" forState:UIControlStateNormal];
    [btn4 setBackgroundColor:[UIColor redColor]];
    [btn4 addTarget:self action:@selector(btnAction4) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn4];
}

- (void)btnAction4
{
    NSMutableDictionary *dict = [NSMutableDictionary dictionary];
//    [dict setValue:@"iap7" forKey:@"goods_tag"]; // 商品标签
//    [dict setValue:@"830001008" forKey:@"goods_tag"]; // 商品标签
//    [dict setValue:@(20) forKey:@"age"]; // 用户年龄,indulge_auth为1时必传该字段
    
    [dict setValue:@"ios_tag" forKey:@"goods_tag"]; // 商品标签
    [dict setValue:[self getTime] forKey:@"trade_no"]; // 订单号
    [dict setValue:@(1) forKey:@"is_debug"]; // 是否测试订单 默认 0 正式  1 为测试订单
    [dict setValue:@(1) forKey:@"env"]; // 是否使用沙盒环境支付 0 正式  1 沙盒
    [dict setValue:@"CNY" forKey:@"currency"]; // 币种 默认传: CNY
    [dict setValue:@{} forKey:@"ext"]; // 支付扩展字段 三方支付额外传递参数 详见下面具体渠道
    [dict setValue:@"" forKey:@"notify_url"]; // 支付成功通知CP发货地址
    [dict setValue:@"" forKey:@"transmit_args"]; // 客户端透传参数 非必传
    [dict setValue:@(0) forKey:@"indulge_auth"]; // 是否进行防沉迷验证  0不验证，1验证，默认不验证
    [dict setValue:@"CNY" forKey:@"user_real_currency"]; // 实际支付币种
    NSInteger randomNum = arc4random_uniform(100);
    [dict setValue:@(randomNum) forKey:@"user_real_price"]; // 实际支付金额
    NSLog(@"%@",dict);

    UIAlertAction *cancelAction=[UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
    }];
    UIAlertController *alertController=[UIAlertController alertControllerWithTitle:@"开始支付" message:nil preferredStyle:UIAlertControllerStyleAlert];
    [alertController addAction:cancelAction];
    [self presentViewController:alertController animated:YES completion:nil];
    
//    [[RXPayService sharedSDK] requestWithDict:dict completeHandle:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        NSString *str = [NSString stringWithFormat:@"%@", response];
//        if(!error){
//            NSLog(@"支付成功");
//        }else{
//            NSLog(@"支付失败");
//            str = [NSString stringWithFormat:@"%@", error.responesObject];
//        }
//        
//        UIAlertAction *cancelAction=[UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
//        }];
//        UIAlertController *alertController=[UIAlertController alertControllerWithTitle:@"支付结果" message:str preferredStyle:UIAlertControllerStyleAlert];
//        [alertController addAction:cancelAction];
//        [self presentViewController:alertController animated:YES completion:nil];
//    }];
}


- (void)btnAction3
{
    [[RXService sharedSDK] loginWithExtDic:@{} username:@"rxaccount" password:@"111111" sign_fields:nil loginType:LoginTypeVisitor migrate_args:nil];
}

- (void)btnAction1
{
    RXADJAttribution *adj = [RXAdjust sharedSDK].attribution;
//    NSDictionary *dic = [self dicFromObject:adj];
    
    // adid
    NSString *adid = [[RXAdjust sharedSDK] getAdidWithAppToken:@"a7tay9toq29s" delayStart:10];
    NSLog(@"adid = %@", adid);
    
    UIPasteboard *pasteboard = [UIPasteboard generalPasteboard];
    pasteboard.string = adid;
    
    UIAlertAction *cancel = [UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
        
    }];
    UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"adid" message:adid preferredStyle:UIAlertControllerStyleAlert];
    [alert addAction:cancel];
    [self presentViewController:alert animated:YES completion:nil];
}

- (void)btnAction2
{
    // 记录事件
    RXADJEvent *event = [RXADJEvent eventWithEventToken:@"mytndy"];
    [event setRevenue:0.01 currency:@"USD"];
    [[RXAdjust sharedSDK] trackEvent:event];
}

- (void)adjustAttributionChanged:(RXADJAttribution *)attribution
{
    NSLog(@"");
}

#pragma mark -- <登录回调>
- (void)rx_LoginCallBackWithResponse:(NSDictionary *)response error:(RX_CommonRequestError *)error
{
    if (!error) {
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:response options:NSJSONWritingPrettyPrinted error:nil];
        if (error) {
            NSLog(@"json解析失败:%@", error);
        }
        NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        NSLog(@"");
        
        UIAlertAction *cancelAction=[UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
        }];
        UIAlertController *alertController=[UIAlertController alertControllerWithTitle:@"登录结果" message:[NSString stringWithFormat:@"%@", jsonString] preferredStyle:UIAlertControllerStyleAlert];
        [alertController addAction:cancelAction];
        [self presentViewController:alertController animated:YES completion:nil];
        
    } else {
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:error.responesObject options:NSJSONWritingPrettyPrinted error:nil];
        if (error) {
            NSLog(@"json解析失败:%@", error);
        }
        NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
    }
}

- (NSString *)getTime{
    NSDate* date = [NSDate dateWithTimeIntervalSinceNow:0];
    NSTimeInterval a=[date timeIntervalSince1970]*1000; // *1000 是精确到毫秒，不乘就是精确到秒
    NSString *timeString = [NSString stringWithFormat:@"%.0f", a]; //转为字符型
    return timeString;
}

@end
