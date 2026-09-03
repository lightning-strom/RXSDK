//
//  ViewController.m
//  RXPublicToolKitDemo
//
//  Created by 陈汉 on 2022/9/23.
//

#import "ViewController.h"
#import <RXPublicToolKit/RXPublicToolKit.h>
#import <RXSDK_Pure/RXSDK_Pure.h>
#import "RXDeregisterVC.h"

@interface ViewController () <RXWebViewDelegate, RXLoginDelegate>

@property (nonatomic, strong) NSMutableDictionary *payInfo;
@property (nonatomic, strong) RXPublicWebView *webView;
@property (nonatomic, strong) NSDictionary *loginData;

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    
    self.view.backgroundColor = [UIColor blackColor];
    
    [RXToolKit sharedSDK].webViewDelegate = self;
    [RXService sharedSDK].loginDelegate = self;
    
    [[RXToolKit sharedSDK] getUserAgent:^(id  _Nullable result) {
        NSLog(@"ua = %@", result);
    }];
    
//    [RXToolKit jumpAppSetting];
    
//    [[RXToolKit sharedSDK] isCanVisitPhotoLibrary:^(BOOL result) {
////        NSString *filePath = [[NSBundle mainBundle] pathForResource:@"local" ofType:@"mp4"];
//        NSString *filePath = @"http://guanwangyun.oss-cn-beijing.aliyuncs.com/document/460_1712035728.mp4";
//        NSURL *url = [NSURL URLWithString:[filePath stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding]];
//        
//        [[RXToolKit sharedSDK] saveVideo:filePath complete:^(BOOL result) {
//            NSLog(@"");
//        }];
//    }];
    
    // openWebView
    UIButton *btn1 = [[UIButton alloc] initWithFrame:CGRectMake(10, 100, 130, 30)];
    [btn1 setTitle:@"openWebView" forState:UIControlStateNormal];
    [btn1 setBackgroundColor:[UIColor redColor]];
    [btn1 addTarget:self action:@selector(btnAction1) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn1];
    
    // close
    UIButton *btn2 = [[UIButton alloc] initWithFrame:CGRectMake(10, 150, 130, 30)];
    [btn2 setTitle:@"close" forState:UIControlStateNormal];
    [btn2 setBackgroundColor:[UIColor redColor]];
    [btn2 addTarget:self action:@selector(btnAction2) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn2];
    
    UIButton *btn3 = [[UIButton alloc] initWithFrame:CGRectMake(10, 200, 130, 30)];
    [btn3 setTitle:@"跳转注销" forState:UIControlStateNormal];
    [btn3 setBackgroundColor:[UIColor redColor]];
    [btn3 addTarget:self action:@selector(btnAction3) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn3];
}

- (void)btnAction3
{
    [self.navigationController pushViewController:[RXDeregisterVC new] animated:YES];
}

- (void)btnAction2
{
//    [[RXToolKit sharedSDK] closeWebView];
    
    [[RXService sharedSDK] loginWithExtDic:nil username:nil password:nil sign_fields:nil loginType:LoginTypeVisitor migrate_args:nil];
    
}

- (void)btnAction1
{
    
//    RXPublicWebView *webView = [[RXPublicWebView alloc] init];
//    webView.urlStr = @"http://10.10.2.34:666/static/pay";
//    webView.modalPresentationStyle = UIModalPresentationFullScreen;
//    
//    [self.navigationController presentViewController:webView animated:YES completion:nil];
//    
//    webView.naviBar.titleStyle = RXPublicWebviewTitleStyleLeft;
    
    NSMutableDictionary *dict = [NSMutableDictionary dictionary];
//    [dict setValue:@"iap7" forKey:@"goods_tag"]; // 商品标签
//    [dict setValue:@"831000076" forKey:@"goods_tag"]; // 商品标签
//    [dict setValue:@(20) forKey:@"age"]; // 用户年龄,indulge_auth为1时必传该字段
    
    [dict setValue:@"ios_tag" forKey:@"goods_tag"]; // 商品标签
    [dict setValue:[self getTime] forKey:@"trade_no"]; // 订单号
    [dict setValue:@(1) forKey:@"is_debug"]; // 是否测试订单 默认 0 正式  1 为测试订单
    [dict setValue:@(1) forKey:@"env"]; // 是否使用沙盒环境支付 0 正式  1 沙盒
    [dict setValue:@"CNY" forKey:@"currency"]; // 币种 默认传: CNY
//    [dict setValue:@{@"pay_type" : @"wechat", @"pay_way" : @"SDK_PAY"} forKey:@"ext"]; // 支付扩展字段 三方支付额外传递参数 详见下面具体渠道
    [dict setValue:@{@"country_code" : @"KR"} forKey:@"ext"];
    [dict setValue:@"" forKey:@"notify_url"]; // 支付成功通知CP发货地址
    [dict setValue:@"" forKey:@"transmit_args"]; // 客户端透传参数 非必传
    [dict setValue:@(0) forKey:@"indulge_auth"]; // 是否进行防沉迷验证  0不验证，1验证，默认不验证
    [dict setValue:@{@"cp_game_character_id" : @"123", @"cp_game_area_id" : @"456"} forKey:@"game_info"];
//    [dict setValue:@"yeepay" forKey:@"pay_type"];
    [dict setValue:@"ruixue_h5_trade" forKey:@"pay_type"];
    [dict setValue:@"AD" forKey:@"country"];
    [dict setValue:@"月卡" forKey:@"goods_name"];
//    [dict setValue:@"1" forKey:@"rxTest"];
//    [dict setValue:@"HKD" forKey:@"user_real_currency"]; // 实际支付币种
    
    self.payInfo = dict;
    
    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"选择环境" message:@"" delegate:self cancelButtonTitle:@"测试" otherButtonTitles:@"正式", nil];
    [alert show];
    
    return;
    
    [[RXPayService sharedSDK] requestWithDict:dict completeHandle:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        NSString *str = [NSString stringWithFormat:@"%@", response];
        if(!error){
            NSLog(@"支付成功");
        }else{
            NSLog(@"支付失败");
            str = [NSString stringWithFormat:@"%@", error.responesObject];
        }
    }];
}

- (void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex
{
    if (buttonIndex == 0) {
        [self.payInfo setValue:@"1" forKey:@"rxTest"];
    } else {
        [self.payInfo setValue:@"0" forKey:@"rxTest"];
    }
    
    [[RXPayService sharedSDK] requestWithDict:self.payInfo completeHandle:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        NSString *str = [NSString stringWithFormat:@"%@", response];
        if(!error){
            NSLog(@"支付成功");
        }else{
            NSLog(@"支付失败");
            str = [NSString stringWithFormat:@"%@", error.responesObject];
        }
    }];
}


- (void)rx_decidePolicyForNavigationResponse:(NSInteger)code
{
    NSLog(@"");
}

- (void)rx_didFinishNavigation:(NSString *)urlStr schemeParams:(NSDictionary *)schemeParams
{
    NSLog(@"");
}

- (void)rx_decidePolicyForNavigationAction:(NSString *)urlStr schemeParams:(NSDictionary *)schemeParams
{
    NSLog(@"");
}

- (void)rx_closeWebView
{
    NSLog(@"");
}

- (NSString *)getTime{
    NSDate* date = [NSDate dateWithTimeIntervalSinceNow:0];
    NSTimeInterval a=[date timeIntervalSince1970]*1000; // *1000 是精确到毫秒，不乘就是精确到秒
    NSString *timeString = [NSString stringWithFormat:@"%.0f", a]; //转为字符型
    return timeString;
}

- (void)rx_LoginCallBackWithResponse:(NSDictionary *)response error:(RX_CommonRequestError *)error
{
    if (!error) {
        self.loginData = response[@"data"];
    }
}

@end
