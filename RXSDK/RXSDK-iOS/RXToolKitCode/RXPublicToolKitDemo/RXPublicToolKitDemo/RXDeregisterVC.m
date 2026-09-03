//
//  RXDeregisterVC.m
//  RXPublicToolKitDemo
//
//  Created by 陈汉 on 2025/8/26.
//

#import "RXDeregisterVC.h"
#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXPublicToolKit/RXPublicToolKit.h>

@interface RXDeregisterVC () <RXLoginDelegate>

@property (nonatomic, strong) RXPublicWebView *webView;
@property (nonatomic, strong) NSDictionary *loginData;

@end

@implementation RXDeregisterVC

- (void)viewDidLoad {
    [super viewDidLoad];
    
    [RXService sharedSDK].loginDelegate = self;
    
    UIButton *btn1 = [[UIButton alloc] initWithFrame:CGRectMake(10, 100, 130, 30)];
    [btn1 setTitle:@"申请注销" forState:UIControlStateNormal];
    [btn1 setBackgroundColor:[UIColor redColor]];
    [btn1 addTarget:self action:@selector(btnAction1) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn1];
    
    UIButton *btn2 = [[UIButton alloc] initWithFrame:CGRectMake(10, 150, 130, 30)];
    [btn2 setTitle:@"登录" forState:UIControlStateNormal];
    [btn2 setBackgroundColor:[UIColor redColor]];
    [btn2 addTarget:self action:@selector(btnAction2) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn2];
    
    UIButton *btn3 = [[UIButton alloc] initWithFrame:CGRectMake(10, 200, 130, 30)];
    [btn3 setTitle:@"撤销注销" forState:UIControlStateNormal];
    [btn3 setBackgroundColor:[UIColor redColor]];
    [btn3 addTarget:self action:@selector(btnAction3) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn3];
}

- (void)btnAction3
{
    [[RXDestroyAccountService sharedSDK] deregisterCancelWithComplete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
            
    }];
}

- (void)btnAction2
{
    [[RXService sharedSDK] loginWithExtDic:nil username:nil password:nil sign_fields:nil loginType:LoginTypeVisitor migrate_args:nil];
}

- (void)btnAction1
{
    self.webView = [[RXPublicWebView alloc] init];
    self.webView.titleStyle = RXPublicWebviewTitleStyleDefault;
    self.webView.modalPresentationStyle = UIModalPresentationFullScreen;
    
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    NSMutableDictionary *baseInfo = [NSMutableDictionary dictionary];
    // TODO: cpid 替换成正式
    [baseInfo setValue:@"119" forKey:@"cpid"];
    // TODO: productid 替换成正式
    [baseInfo setValue:@"SDKOS" forKey:@"productid"];
    // TODO: channelid 替换成正式
    [baseInfo setValue:@"iOSOS" forKey:@"channelid"];
    
    [baseInfo setValue:[[RXService sharedSDK] getFirstBaseUrl] forKey:@"domain"];
    [baseInfo setValue:[[RXApiService sharedSDK] getDeviceCode] forKey:@"devicecode"];
    [baseInfo setValue:[[RXApiService sharedSDK] getTimeZoneOffset] forKey:@"tzoffset"];
    
    // TODO: 替换成实际语言
    [baseInfo setValue:@"en" forKey:@"language"];
    
    NSString *jsonStr1 = [RXToolKit toJsonString:baseInfo];
    jsonStr1 = [jsonStr1 stringByReplacingOccurrencesOfString:@"\n" withString:@""];
    NSString *baseInfoJs1 = [NSString stringWithFormat:@"%@", jsonStr1];
    
    // TODO: 登录数据的 data，参考下方登录数据回调
    NSString *jsonStr2 = [RXToolKit toJsonString:self.loginData];
    jsonStr2 = [jsonStr2 stringByReplacingOccurrencesOfString:@"\n" withString:@""];
    NSString *baseInfoJs2 = [NSString stringWithFormat:@"%@", jsonStr2];
    
    [dic setValue:baseInfoJs1 forKey:@"api_params"];
    [dic setValue:baseInfoJs2 forKey:@"login_data"];
    
    [self.webView setCookie:dic];
    
    self.webView.urlStr = [NSString stringWithFormat:@"%@/static/passport/#/oversea/unregistercondition", [[RXService sharedSDK] getFirstBaseUrl]];
    
    if ([RXToolKit currentViewController].navigationController) {
        [[RXToolKit currentViewController].navigationController presentViewController:self.webView animated:YES completion:nil];
    }else{
        [[RXToolKit currentViewController] presentViewController:self.webView animated:YES completion:nil];
    }
    
    self.webView.complete = ^(NSDictionary * _Nonnull response) {
        NSInteger code = [response[@"code"] integerValue];
        NSString *type = [NSString stringWithFormat:@"%@", response[@"type"]];
        if (code == 0 && [type isEqualToString:@"deregister"]) {
            NSLog(@"注销成功");
        } else {
            NSLog(@"注销失败");
        }
    };
}

#pragma mark -- RXLoginDelegate
- (void)rx_LoginCallBackWithResponse:(NSDictionary *)response error:(RX_CommonRequestError *)error
{
    if (!error) {
        self.loginData = response[@"data"];
    }
}

@end
