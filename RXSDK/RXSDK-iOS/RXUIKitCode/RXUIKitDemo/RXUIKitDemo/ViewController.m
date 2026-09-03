//
//  ViewController.m
//  RXUIKitDemo
//
//  Created by 陈汉 on 2022/3/8.
//

#import "ViewController.h"
#import <RXUIKit/RXUIKit.h>
#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXUIKit/RXHUD.h>
#import <RXWXSDK/RXWXSDK.h>
#import "JXQRCodeScanVC.h"
#import "ConfigController.h"
#import <objc/runtime.h>
#import <StoreKit/StoreKit.h>
#import "TestWebView.h"
#import "ViewController2.h"

#define ISPAD [UIDevice currentDevice].model

// 是否横屏
#define RXAC \
({\
    BOOL ISAC = NO;\
    if ([self getInterfaceOrientation] == 2 || [ISPAD isEqualToString:@"iPad"]) {\
        ISAC = YES;\
    }\
    ISAC;\
})

// - 设备屏幕宽
#define RXUScreenWidth          [UIScreen mainScreen].bounds.size.width
// - 设备屏幕高
#define RXUScreenHeight         [UIScreen mainScreen].bounds.size.height

// - 缩放比例
#define RXUScaleWidth(x) \
({ \
    CGFloat scale = 1.0; \
    if ([ISPAD isEqualToString:@"iPad"]) { \
        scale = 1.1; \
    } else { \
        scale = RXAC ? (RXUScreenHeight / 375.0) : (RXUScreenWidth / 375.0); \
    } \
    scale * (x); \
})

@interface ViewController () <RXUILoginDelegate, RXLoginDelegate, RXPublicDelegate, SKPaymentQueueDelegate, SKPaymentTransactionObserver>

@property (nonatomic, strong) UITextField *tf;
@property (nonatomic, strong) UIButton *unBindingBtn;
@property (nonatomic, strong) NSString *loginOpenid;
@property (nonatomic, assign) NSInteger ori;

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    
    self.ori = [self getInterfaceOrientation];
    
//    [SKStoreReviewController requestReview];

//    UIWindow *window = [UIApplication sharedApplication].keyWindow;
//    UIImageView *bgView = [[UIImageView alloc] initWithFrame:CGRectMake(0, 0, CGRectGetWidth(window.frame), CGRectGetHeight(window.frame))];
//    bgView.image = [UIImage imageNamed:@"test2"];
//    [self.view addSubview:bgView];
    
    self.view.backgroundColor = [UIColor blackColor];
    
    [self setUI];
    
    [RXUIKitService sharedSDK].loginDelegate = self;
    [RXService sharedSDK].loginDelegate = self;
    [RXService sharedSDK].publicDelegate = self;
//    [RXBusinessService sharedSDK].delegate = self;
//    [[RXUIKitService sharedSDK] closeLoginView];
    
    NSLog(@"");
//    [[RXService sharedSDK] loginWithExtDic:nil username:@"vip002" password:@"123456" sign_fields:nil loginType:LoginTypeVisitor migrate_args:nil];
}

- (void)rxPublicCallback:(NSInteger)type response:(NSDictionary *)response
{
    if (type == feedbakc_report) {
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:@{@"pay_error":@"支付不到账"} options:NSJSONWritingPrettyPrinted error:nil];
        [[RXFeedbackService sharedSDK] reportFeedbackLogWithData:jsonData complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
            NSLog(@"");
        }];
    }
}

- (void)setUI
{
    [[NSUserDefaults standardUserDefaults] setValue:@"123" forKey:@"rx_access"];
    
    // 实名认证
    UIButton *btn1 = [[UIButton alloc] initWithFrame:CGRectMake(10, 100, 130, 30)];
    [btn1 setTitle:@"实名认证" forState:UIControlStateNormal];
//    btn1.titleLabel.font = [UIFont systemFontOfSize:RXUScaleWidth(16)];
    [btn1 setBackgroundColor:[UIColor redColor]];
    [btn1 addTarget:self action:@selector(btnAction1) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn1];
    
    // 防沉迷
    UIButton *btn2 = [[UIButton alloc] initWithFrame:CGRectMake(150, 100, 130, 30)];
    [btn2 setTitle:@"防沉迷" forState:UIControlStateNormal];
    [btn2 setBackgroundColor:[UIColor redColor]];
    [btn2 addTarget:self action:@selector(btnAction2) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn2];
    
    // 权限
    UIButton *btn3 = [[UIButton alloc] initWithFrame:CGRectMake(10, 150, 130, 30)];
    [btn3 setTitle:@"权限" forState:UIControlStateNormal];
    [btn3 setBackgroundColor:[UIColor redColor]];
    [btn3 addTarget:self action:@selector(btnAction3) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn3];
    
    // 切换屏幕方向
    UIButton *btn4 = [[UIButton alloc] initWithFrame:CGRectMake(290, 100, 130, 30)];
    [btn4 setTitle:@"切换屏幕方向" forState:UIControlStateNormal];
    [btn4 setBackgroundColor:[UIColor redColor]];
    [btn4 addTarget:self action:@selector(btnAction4) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn4];
    
    // 单条协议
    UIButton *btn5 = [[UIButton alloc] initWithFrame:CGRectMake(10, 200, 130, 30)];
    [btn5 setTitle:@"单条协议" forState:UIControlStateNormal];
    [btn5 setBackgroundColor:[UIColor redColor]];
    [btn5 addTarget:self action:@selector(btnAction5) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn5];
    
    // 获取法务信息
    UIButton *btn6 = [[UIButton alloc] initWithFrame:CGRectMake(10, 250, 130, 30)];
    [btn6 setTitle:@"获取法务信息" forState:UIControlStateNormal];
    [btn6 setBackgroundColor:[UIColor redColor]];
    [btn6 addTarget:self action:@selector(btnAction6) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn6];
    
    // 声明
    UIButton *btn7 = [[UIButton alloc] initWithFrame:CGRectMake(290, 200, 130, 30)];
    [btn7 setTitle:@"声明" forState:UIControlStateNormal];
    [btn7 setBackgroundColor:[UIColor redColor]];
    [btn7 addTarget:self action:@selector(btnAction7) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn7];
    
    // 登录
    UIButton *btn10 = [[UIButton alloc] initWithFrame:CGRectMake(150, 150, 130, 30)];
    [btn10 setTitle:@"登录" forState:UIControlStateNormal];
    [btn10 setBackgroundColor:[UIColor redColor]];
    [btn10 addTarget:self action:@selector(btnAction10) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn10];
    
    // 找回密码
    UIButton *btn11 = [[UIButton alloc] initWithFrame:CGRectMake(150, 200, 130, 30)];
    [btn11 setTitle:@"找回密码" forState:UIControlStateNormal];
    [btn11 setBackgroundColor:[UIColor redColor]];
    [btn11 addTarget:self action:@selector(btnAction11) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn11];
    
    // 用户中心
    UIButton *btn12 = [[UIButton alloc] initWithFrame:CGRectMake(150, 250, 130, 30)];
    [btn12 setTitle:@"用户中心" forState:UIControlStateNormal];
    [btn12 setBackgroundColor:[UIColor redColor]];
    [btn12 addTarget:self action:@selector(btnAction12) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn12];
    
    // 撤销注销
    UIButton *btn13 = [[UIButton alloc] initWithFrame:CGRectMake(290, 250, 130, 30)];
    [btn13 setTitle:@"撤销注销" forState:UIControlStateNormal];
    [btn13 setBackgroundColor:[UIColor redColor]];
    [btn13 addTarget:self action:@selector(btnAction13) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn13];
    
    // 设置密码
    UIButton *btn14 = [[UIButton alloc] initWithFrame:CGRectMake(10, 300, 130, 30)];
    [btn14 setTitle:@"设置密码" forState:UIControlStateNormal];
    [btn14 setBackgroundColor:[UIColor redColor]];
    [btn14 addTarget:self action:@selector(btnAction14) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn14];
    
    // 解绑手机
    UIButton *btn15 = [[UIButton alloc] initWithFrame:CGRectMake(150, 300, 130, 30)];
    [btn15 setTitle:@"客服" forState:UIControlStateNormal];
    [btn15 setBackgroundColor:[UIColor redColor]];
    [btn15 addTarget:self action:@selector(btnAction15) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn15];
    
    // 客服中心
    UIButton *btn16 = [[UIButton alloc] initWithFrame:CGRectMake(290, 300, 130, 30)];
    [btn16 setTitle:@"帮助中心" forState:UIControlStateNormal];
    [btn16 setBackgroundColor:[UIColor redColor]];
    [btn16 addTarget:self action:@selector(btnAction16) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn16];
    
    // 扫一扫
    UIButton *btn17 = [[UIButton alloc] initWithFrame:CGRectMake(10, 350, 130, 30)];
    [btn17 setTitle:@"扫一扫" forState:UIControlStateNormal];
    [btn17 setBackgroundColor:[UIColor redColor]];
    [btn17 addTarget:self action:@selector(btnAction17) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn17];
    
    // 开启简单密码
    UIButton *btn18 = [[UIButton alloc] initWithFrame:CGRectMake(10, 350, 130, 30)];
    [btn18 setTitle:@"简单密码" forState:UIControlStateNormal];
    [btn18 setBackgroundColor:[UIColor redColor]];
    [btn18 addTarget:self action:@selector(btnAction18) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn18];
    
    // 注册账号
    UIButton *btn19 = [[UIButton alloc] initWithFrame:CGRectMake(150, 350, 130, 30)];
    [btn19 setTitle:@"注册账号" forState:UIControlStateNormal];
    [btn19 setBackgroundColor:[UIColor redColor]];
    [btn19 addTarget:self action:@selector(btnAction19) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn19];
    
    // applepay
    UIButton *btn20 = [[UIButton alloc] initWithFrame:CGRectMake(290, 350, 130, 30)];
    [btn20 setTitle:@"apple pay" forState:UIControlStateNormal];
    [btn20 setBackgroundColor:[UIColor redColor]];
    [btn20 addTarget:self action:@selector(btnAction20) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn20];
    
    //绑定手机
    UIButton *bindPhoneBtn = [[UIButton alloc] initWithFrame:CGRectMake(10, 390, 130, 30)];
    [bindPhoneBtn setTitle:@"绑定手机" forState:UIControlStateNormal];
    [bindPhoneBtn setBackgroundColor:[UIColor redColor]];
    [bindPhoneBtn addTarget:self action:@selector(bindPhoneBtnAction) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:bindPhoneBtn];
    
    //邮箱
    UIButton *emailBtn = [[UIButton alloc] initWithFrame:CGRectMake(RXAC ? 430 : 10, RXAC ? 100 : 390, 130, 30)];
    [emailBtn setTitle:@"邮箱" forState:UIControlStateNormal];
    [emailBtn setBackgroundColor:[UIColor redColor]];
    [emailBtn addTarget:self action:@selector(emailBtnClick) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:emailBtn];
    
    //我要反馈
    UIButton *feedbackBtn = [[UIButton alloc] initWithFrame:CGRectMake(150, 390, 130, 30)];
    [feedbackBtn setTitle:@"我要反馈" forState:UIControlStateNormal];
    [feedbackBtn setBackgroundColor:[UIColor redColor]];
    [feedbackBtn addTarget:self action:@selector(feedbackBtnClick) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:feedbackBtn];
    
    //我要反馈
    UIButton *feedbackListBtn = [[UIButton alloc] initWithFrame:CGRectMake(290, 390, 130, 30)];
    [feedbackListBtn setTitle:@"反馈列表" forState:UIControlStateNormal];
    [feedbackListBtn setBackgroundColor:[UIColor redColor]];
    [feedbackListBtn addTarget:self action:@selector(feedbackListBtnClick) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:feedbackListBtn];
    
    // webView
    UIButton *webViewBtn = [[UIButton alloc] initWithFrame:CGRectMake(10, 440, 130, 30)];
    [webViewBtn setTitle:@"webView" forState:UIControlStateNormal];
    [webViewBtn setBackgroundColor:[UIColor redColor]];
    [webViewBtn addTarget:self action:@selector(webViewBtnAction) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:webViewBtn];
    
    // 切换配置
    UIButton *changeBtn = [[UIButton alloc] initWithFrame:CGRectMake(10, 650, 130, 30)];
    [changeBtn setTitle:@"切换配置" forState:UIControlStateNormal];
    [changeBtn setBackgroundColor:[UIColor redColor]];
    [changeBtn addTarget:self action:@selector(changeBtnAction) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:changeBtn];
    
    UIButton *nextBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    [nextBtn setFrame:CGRectMake(290, 650, 100, 30)];
    nextBtn.backgroundColor = [UIColor redColor];
    [nextBtn setTitle:@"下一页" forState:UIControlStateNormal];
    nextBtn.titleLabel.font = [UIFont systemFontOfSize:14];
    [nextBtn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    [nextBtn addTarget:self action:@selector(nextBtnClick) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:nextBtn];
    
//    NSMutableArray *privacies = [NSMutableArray arrayWithArray:@[@"2", @"3", @"4", @"5"]];
//    if (privacies.count > 3) {
//        [privacies removeObjectsInRange:NSMakeRange(3, privacies.count - 3)];
//    }
//    NSLog(@"");
    
//    [[RXUIKitService sharedSDK] syncAccounts:@[@{@"username" : @"18698646213", @"password" : @"123aA!"}, @{@"username" : @"test", @"password" : @"123aA!"}]];
    
//    [[RXUIKitService sharedSDK] getBackPasswordWithComplete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
//            
//    }];
    
    [[RXService sharedSDK] setGameInfoWithRoleId:@"3" regionTag:@"ceshi"];
}

- (void)nextBtnClick{
    [self.navigationController pushViewController:[ViewController2 new] animated:YES];
}

- (void)webViewBtnAction
{
    [[UIApplication sharedApplication] openURL:[NSURL URLWithString:@"https://www.baidu.com"] options:nil completionHandler:nil];
//    TestWebView *webView = [[TestWebView alloc] initWithUrl:@"https://cn-api-test.ruixuecloud.com/static/pay" title:@"测试" content:nil];
//    [[RXUIKitService sharedSDK] setWebView:webView.webView];
}

- (void)feedbackBtnClick{
//    [[RXUIKitService sharedSDK] showCreateFeedbackView];
}

- (void)feedbackListBtnClick{
//    [[RXUIKitService sharedSDK] showFeedbackListView];
}

- (void)emailBtnClick{
//    [[RXUIKitService sharedSDK] showAnnounceViewWithLimit:100 linkCallBack:^(NSString * _Nonnull link) {
//        
//    } isHasCallBack:^(BOOL isHas) {
//        
//    }];
//    return;
    [[RXUIKitService sharedSDK] showEmailViewWithCpUserId:@"442132347" withComplete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
        
    }];
}

- (void)bindPhoneBtnAction{
    [[RXUIKitService sharedSDK] bindPhoneWithComplete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
        if (error) {
            NSLog(@"绑定失败:%@",error.responesObject[@"msg"]);
        }else{
            NSLog(@"绑定成功：%@",response);
        }
    }];
}

- (void)changeBtnAction
{
    [self.navigationController pushViewController:[ConfigController new] animated:YES];
}

// 方法1：使用 CFNetwork 检查代理设置
- (BOOL)isUsingProxy {
    NSDictionary *proxySettings = (__bridge NSDictionary *)(CFNetworkCopySystemProxySettings());
    NSArray *proxies = (__bridge NSArray *)(CFNetworkCopyProxiesForURL((__bridge CFURLRef)[NSURL URLWithString:@"http://www.google.com"], (__bridge CFDictionaryRef)proxySettings));
    NSDictionary *settings = [proxies firstObject];
    
    if ([[settings objectForKey:(NSString *)kCFProxyTypeKey] isEqualToString:@"kCFProxyTypeNone"]) {
        return NO;
    } else {
        return YES;
    }
    
//    return [[settings objectForKey:(NSString *)kCFProxyTypeKey] isNotEqualToString:@"kCFProxyTypeNone"];
}

// 方法2：更详细的代理检查
- (NSDictionary *)getProxyStatus {
    NSMutableDictionary *result = [NSMutableDictionary dictionary];
    
    CFDictionaryRef dicRef = CFNetworkCopySystemProxySettings();
    NSDictionary *proxySettings = (__bridge NSDictionary *)dicRef;
    
    // HTTP 代理
    NSString *httpHost = [proxySettings objectForKey:(__bridge NSString *)kCFProxyHostNameKey];
    NSNumber *httpPort = [proxySettings objectForKey:(__bridge NSString *)kCFProxyPortNumberKey];
    
    if (httpHost || httpPort) {
        [result setObject:@{
            @"host": httpHost ?: @"",
            @"port": httpPort ?: @0
        } forKey:@"HTTP"];
    }
    
    // SOCKS 代理
    NSString *socksHost = [proxySettings objectForKey:@"SOCKSProxy"];
    NSNumber *socksPort = [proxySettings objectForKey:@"SOCKSPort"];
    
    if (socksHost || socksPort) {
        [result setObject:@{
            @"host": socksHost ?: @"",
            @"port": socksPort ?: @0
        } forKey:@"SOCKS"];
    }
    
    if (dicRef) {
        CFRelease(dicRef);
    }
    
    return result;
}

// 方法3：简单的 VPN 检查
- (BOOL)isVPNConnected {
    NSDictionary *dict = CFBridgingRelease(CFNetworkCopySystemProxySettings());
    NSArray *keys = [dict[@"__SCOPED__"] allKeys];
    for (NSString *key in keys) {
        if ([key containsString:@"tap"] || [key containsString:@"tun"] || [key containsString:@"ppp"] || [key containsString:@"ipsec"]) {
            return YES;
        }
    }
    return NO;
}

// 使用示例
- (void)checkProxyStatus {
    // 检查是否使用代理
    if ([self isUsingProxy]) {
        NSLog(@"设备正在使用代理");
        
        // 获取详细代理信息
        NSDictionary *proxyStatus = [self getProxyStatus];
        NSLog(@"代理详情: %@", proxyStatus);
    } else {
        NSLog(@"设备未使用代理");
    }
    
    // 检查 VPN
    if ([self isVPNConnected]) {
        NSLog(@"VPN 已连接");
    } else {
        NSLog(@"VPN 未连接");
    }
}

- (void)btnAction20
{
//    [[RXUIKitService sharedSDK] openWebViewWithUrl:nil title:nil];
//
//    [self checkProxyStatus];
//    return;
//
    
//    [[RXApiService sharedSDK] getServiceChatUnreadCount:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        NSLog(@"");
//    }];
    
//    NSString *link = @"https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzI4MTU5MjgwMQ==&scene=110#wechat_redirect"; // 替换为你的目标链接
//    NSString *weixinScheme = [NSString stringWithFormat:@"weixin://dl/business/?t=%@", link];
////    
//    [[UIApplication sharedApplication] openURL:[NSURL URLWithString:@" weixin://dl/business/?path=pages/index/index&appid=wxcea90a65f0ca6775&env_version=trial"] options:nil completionHandler:nil];
//
////    weixin://dl/business/?path=pages/index/index&appid=wxcea90a65f0ca6775&env_version=trial
//    return;
    
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
    [dict setValue:@"" forKey:@"notify_url"]; // 支付成功通知CP发货地址
    [dict setValue:@"" forKey:@"transmit_args"]; // 客户端透传参数 非必传
    [dict setValue:@(0) forKey:@"indulge_auth"]; // 是否进行防沉迷验证  0不验证，1验证，默认不验证
//    [dict setValue:@"yeepay" forKey:@"pay_type"];
//    [dict setValue:@"HKD" forKey:@"user_real_currency"]; // 实际支付币种
    
    NSLog(@"%@",dict);
    
//    [[RXPayService sharedSDK] setOpenStoreKit2:YES];
    
//    [[RXService sharedSDK] setLanguage:@"zh-cn"];

    UIAlertAction *cancelAction=[UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
    }];
    UIAlertController *alertController=[UIAlertController alertControllerWithTitle:@"开始支付" message:@"" preferredStyle:UIAlertControllerStyleAlert];
    [alertController addAction:cancelAction];
    [[self currentViewController] presentViewController:alertController animated:YES completion:nil];
    
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(20 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
//        [[RXService sharedSDK] loginWithLoginOpenId:self.loginOpenid sign_fields:nil extDic:nil];
    });
    
    [[RXIAPService sharedSDK] requestWithDict:dict completeHandle:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        NSString *str = [NSString stringWithFormat:@"%@", response];
        if(!error){
            NSLog(@"支付成功");
        }else{
            NSLog(@"支付失败");
            str = [NSString stringWithFormat:@"%@", error.responesObject];
        }
        
//        UIAlertAction *cancelAction=[UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
//        }];
//        UIAlertController *alertController=[UIAlertController alertControllerWithTitle:@"支付结果" message:str preferredStyle:UIAlertControllerStyleAlert];
//        [alertController addAction:cancelAction];
//        [[self currentViewController] presentViewController:alertController animated:YES completion:nil];
    }];
}

- (void)btnAction19
{
    __block NSInteger count = [[NSUserDefaults standardUserDefaults] integerForKey:@"rxsdk_test_account"];
    NSString *account = [NSString stringWithFormat:@"rxaccount%ld", count];
    [[RXApiService sharedSDK] registWithUsername:account
                                        password:@"111111aA!"
                                     captchaCode:nil
                                             ext:nil
                                        complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        NSString *text = @"";
        NSString *title = @"注册成功";
        
        count++;
        [[NSUserDefaults standardUserDefaults] setInteger:count forKey:@"rxsdk_test_account"];
        
        if (!error) {
            
            text = [NSString stringWithFormat:@"账号: %@\n密码: 111111aA!", account];
        } else {
            title = @"注册失败";
            NSData *jsonData = [NSJSONSerialization dataWithJSONObject:error.responesObject options:NSJSONWritingPrettyPrinted error:nil];
            NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
            text = [NSString stringWithFormat:@"%@", jsonString];
        }
        
        UIAlertController *alert = [UIAlertController alertControllerWithTitle:title message:text preferredStyle:UIAlertControllerStyleAlert];
        [alert addAction:[UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {

        }]];

        [self presentViewController:alert animated:YES completion:NULL];
    }];
}

- (void)btnAction18
{
    [[RXService sharedSDK] setPasswordStrength:Default];
    [RXHUD showText:@"开启简单密码"];
}

- (void)btnAction17
{
    [self.navigationController pushViewController:[JXQRCodeScanVC new] animated:YES];
}

- (void)btnAction16
{
    RXUserCenterConfig *config = [[RXUserCenterConfig alloc] init];
//    [[RXUIKitService sharedSDK] chatServiceWithConfig:config complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
//
//    }];
    
//    config.transmit_args = nil;
//    config.game_user_id = nil;
//    config.nickname = nil;
//    config.queue_name = nil;
//    config.head_img_url = nil;
//    config.setLightTheme = YES;
    config.setSyncInfoEnable = NO;
    config.orientationVisible = YES;
    
    [[RXUIKitService sharedSDK] serviceCenterWithConfig:config complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
        if (!error) {
            
        }else{
            NSLog(@"%@",error.responesObject);
        }
    }];
    
//    [[RXUIKitService sharedSDK] chatServiceWithConfig:config complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
//
//    }];
}

- (void)btnAction15
{
    RXUserCenterConfig *config = [[RXUserCenterConfig alloc] init];
//    [[RXUIKitService sharedSDK] chatServiceWithConfig:config complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
//
//    }];
    
//    config.transmit_args = nil;
//    config.game_user_id = nil;
//    config.nickname = nil;
//    config.queue_name = nil;
//    config.head_img_url = nil;
    config.setLightTheme = YES;
    config.setSyncInfoEnable = NO;
    config.orientationVisible = YES;
    
    [[RXUIKitService sharedSDK] chatServiceWithConfig:config complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {

    }];
    
//    [[UIApplication sharedApplication] openURL:[NSURL URLWithString:@"jx57://"] options:nil completionHandler:nil];
    
//    [[RXApiService sharedSDK] bindingPhoneWithCaptchaCode:@"7548" password:@"" phone:@"18626666507" migrate_args:nil complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//
//    }];
//    return;
    
//    [[RXApiService sharedSDK] getCaptchaCodeWithType:CaptchaType_phone target:@"18626666507" purpose:@"unbindphone" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        self.tf = [[UITextField alloc] initWithFrame:CGRectMake(200, 100, 100, 40)];
//        self.tf.backgroundColor = [UIColor yellowColor];
//        [[UIApplication sharedApplication].keyWindow addSubview:self.tf];
//
//        self.unBindingBtn = [UIButton buttonWithType:UIButtonTypeCustom];
//        self.unBindingBtn.frame = CGRectMake(300, 100, 50, 40);
//        [self.unBindingBtn setBackgroundColor:[UIColor yellowColor]];
//        [self.unBindingBtn setTitle:@"解绑" forState:UIControlStateNormal];
//        [self.unBindingBtn setTitleColor:[UIColor redColor] forState:UIControlStateNormal];
//        [self.unBindingBtn addTarget:self action:@selector(unBindingAction) forControlEvents:UIControlEventTouchUpInside];
//        [[UIApplication sharedApplication].keyWindow addSubview:self.unBindingBtn];
//    }];
}

- (void)unBindingAction
{
    
//    [[RXApiService sharedSDK] bindingPhoneWithCaptchaCode:@"" password:@"" phone:@"18626666507" migrate_args:nil complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//
//    }];
    [[RXApiService sharedSDK] reliveBindingPhoneWithCaptchaCode:@"1592" phone:@"18698646213" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        [self.tf removeFromSuperview];
        [self.unBindingBtn removeFromSuperview];
        NSString *title = @"解绑成功";
        NSString *msg = @"";
        if (!error) {

        } else {
            title = @"解绑失败";
            NSData *jsonData = [NSJSONSerialization dataWithJSONObject:error.responesObject options:NSJSONWritingPrettyPrinted error:nil];
            if (error) {
                NSLog(@"json解析失败:%@", error);
            }
            msg = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        }
        UIAlertController *alert = [UIAlertController alertControllerWithTitle:title message:msg preferredStyle:UIAlertControllerStyleAlert];
        [alert addAction:[UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {

        }]];

        [self presentViewController:alert animated:YES completion:NULL];
    }];
}

- (void)btnAction14
{
    RXLoginUIModel *loginConfig = [[RXLoginUIModel alloc] init];
    loginConfig.loginMethods = @[@"wechat", @"apple"];
    
    // 二次登录传，正常调用登录 UI 不传，其他参数不变
//    loginConfig.method = @"phone";
//    loginConfig.loginOpenid = self.loginOpenid;
    loginConfig.needRealAuth = YES;
    loginConfig.canCloseRealAuth = YES;
    
    loginConfig.privacies = @[@"http://rxapi.jilinhaiqi.com/static/landing/#/v1/legal/terms/ccc/jkldajfljalsdfj/00001?lang=zh", @"http://rxapi.jilinhaiqi.com/static/landing/#/v1/legal/terms/ccc/jkldajfljalsdfj/00001?lang=zh", @"http://rxapi.jilinhaiqi.com/static/landing/#/v1/legal/terms/ccc/jkldajfljalsdfj/00001?lang=zh"];
    loginConfig.privacieTitles = @[@"用户协议", @"隐私政策", @"儿童协议"];
    
    [[RXUIKitService sharedSDK] showAccountLoginViewWithConfig:loginConfig complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
        NSLog(@"");
    }];
    
    return;
    
    [[RXUIKitService sharedSDK] setPasswordWithComplete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
        NSLog(@"");
    }];
}

- (void)btnAction13
{
    [[RXUIKitService sharedSDK] destroyAccountStatusViewWithDeregisterType:@"logout" complete:^(DestroyClickType clickType) {
        NSLog(@"");
    }];
    
//    [[RXUIKitService sharedSDK] destroyAccountStatusViewWithBtnTitle:@"test" complete:^(NSString * _Nonnull btnTitle) {
//        NSLog(@"");
//    }];
}

- (void)btnAction12
{
//    if (@available(iOS 13.0, *)) {
//        SKStorefront *storefront = SKPaymentQueue.defaultQueue.storefront;
//        if (storefront) {
//            NSLog(@"Storefront country code: %@", storefront.countryCode);
//            NSLog(@"Storefront identifier: %@", storefront.identifier);
//        } else {
//            NSLog(@"Storefront information is not available.");
//        }
//    } else {
//        NSLog(@"SKStorefront is not supported on this iOS version.");
//    }
//    
//    return;
    
    
    RXUserCenterConfig *config = [[RXUserCenterConfig alloc] init];
    config.logoImage = [UIImage imageNamed:@"qrcode_scan"];
    config.transmit_args = @"test";
    config.game_user_id = @"1188368";
    config.nickname = @"肖战迷弟";
    config.queue_name = @"肖战迷弟";
    config.setSyncInfoEnable = YES;
    config.setConfigParams = @{@"btns" : @[
        @"real_name",
        @"privacy_policy",
        @"acount_cancel",
        @"phone_management",
        @"change_pwd"
    ]};
    
//    [[RXUIKitService sharedSDK] applyForDeregisterWithConfig:config complete:^(NSDictionary * _Nonnull response) {
//        
//    }];
//    return;
    
    [[RXUIKitService sharedSDK] userCenterUIWithConfig:config complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
        if (!error) {
            NSString *type = response[@"type"];
            if (type && type.length > 0) {
                NSLog(@"切换账号");
            }
        } else {
            NSLog(@"用户中心错误 %@", error.error);
        }
    }];
}

- (void)btnAction11
{
//    [[RXApiService sharedSDK] getUserInfoWithComplete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        NSLog(@"");
//    }];
//    return;
    
    self.loginOpenid = [[NSUserDefaults standardUserDefaults] valueForKey:@"loginopenid"];
//    [[RXService sharedSDK] loginWithLoginOpenId:self.loginOpenid sign_fields:nil extDic:nil];
    
//    [[RXService sharedSDK] loginWithLoginOpenId:@"3333" sign_fields:nil extDic:nil];
//    return;
    
    RXLoginUIModel *loginConfig = [[RXLoginUIModel alloc] init];
    loginConfig.loginMethods = @[@"wechat", @"apple"];
    
    // 二次登录传，正常调用登录 UI 不传，其他参数不变
//    loginConfig.method = @"phone";
//    loginConfig.loginOpenid = self.loginOpenid;
    loginConfig.needRealAuth = YES;
    loginConfig.canCloseRealAuth = YES;
    
    loginConfig.privacies = @[@"http://rxapi.jilinhaiqi.com/static/landing/#/v1/legal/terms/ccc/jkldajfljalsdfj/00001?lang=zh", @"http://rxapi.jilinhaiqi.com/static/landing/#/v1/legal/terms/ccc/jkldajfljalsdfj/00001?lang=zh", @"http://rxapi.jilinhaiqi.com/static/landing/#/v1/legal/terms/ccc/jkldajfljalsdfj/00001?lang=zh"];
    loginConfig.privacieTitles = @[@"用户协议", @"隐私政策", @"儿童协议"];
    
    [[RXUIKitService sharedSDK] showAuthLoginViewWithConfig:loginConfig complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
            
    }];
    
//    [[RXUIKitService sharedSDK] showLoginUIWithConfig:loginConfig complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
//        NSLog(@"");
//    }];
//    
//    BOOL isInvalid = [[RXUIKitService sharedSDK] loginOpenidExpireInvalidWithConfig:loginConfig complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
//        NSLog(@"");
//    }];
//    
//    NSLog(@"");
//    
    return;
//    [[RXUIKitService sharedSDK] openWebViewWithUrl:@"http://10.10.3.218:8083/#/helpcenter/questioncatalogue" title:@"测试标题"];
//    [[RXService sharedSDK] loginReq_appleWithMigrate_args:nil sign_fields:nil];
//
//    [[RXWXService sharedSDK] loginReq_wWithWXAppid:@"wx5d34c56f0c58e881" migrate_args:nil sign_fields:nil];
//
//    return;
    
    NSDictionary *dic = @{@"username" : @"18698646213",
                          @"account_type" : @(2),
                          @"password_hint" : @"请输入",};
    
    [[RXUIKitService sharedSDK] getBackPasswordWithParams:dic requestParams:^NSMutableDictionary * _Nonnull(NSMutableDictionary * _Nonnull params) {
        NSLog(@"params = %@", params);
        NSMutableDictionary *dic = [NSMutableDictionary dictionaryWithDictionary:params];
        [dic setValue:@NO forKey:@"needBreak"];
        return dic;
    } complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
        if (error) {
            NSLog(@"修改失败");
        } else {
            NSLog(@"修改成功");
        }
    }];
}

- (void)btnAction10
{
    RXLoginUIModel *loginConfig = [[RXLoginUIModel alloc] init];
    loginConfig.loginMethods = @[@"username", @"captchacode", @"wechat", @"guest", @"apple"];
    loginConfig.logoImage = [UIImage imageNamed:@"图片名称"];
    loginConfig.wxAppid = @"wx5d34c56f0c58e881";
    loginConfig.loginViewType = 0;
//    loginConfig.quickphoneKey = @"123";
//    loginConfig.privacieTitles = @[@"用户协议", @"隐私政策", @"儿童隐私协议"];
//    loginConfig.privacies = @[@"http://rxapi.jilinhaiqi.com/static/landing/#/v1/legal/terms/ccc/jkldajfljalsdfj/00001?lang=zh", @"http://rxapi.jilinhaiqi.com/static/landing/#/v1/legal/terms/ccc/jkldajfljalsdfj/00001?lang=zh", @"http://rxapi.jilinhaiqi.com/static/landing/#/v1/legal/terms/ccc/jkldajfljalsdfj/00001?lang=zh"];
    
    NSString *loginOpenid = [[NSUserDefaults standardUserDefaults] valueForKey:@"loginOpenid"];
    if (loginOpenid.length > 0) {
//        loginConfig.loginOpenid = loginOpenid;
    }
    
    NSString *loginMethod = [[NSUserDefaults standardUserDefaults] valueForKey:@"loginMethod"];
    if (loginMethod.length > 0) {
        loginConfig.method = loginMethod;
    }
    loginConfig.canCloseRealAuth = YES;
    
    [[RXUIKitService sharedSDK] showLoginUIWithConfig:loginConfig complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
        NSLog(@"");
    }];
    
    return;
    
//    BOOL isInvalid = [[RXUIKitService sharedSDK] loginOpenidExpireInvalidWithConfig:loginConfig complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
//        NSLog(@"");
//    }];
//    
//    if (!isInvalid) {
//            [[RXUIKitService sharedSDK] showLoginUIWithConfig:loginConfig complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
//        //        [[RXService sharedSDK] loginWithLoginOpenId:response[@"data"][@"login_openid"] sign_fields:nil extDic:nil];
//            }];
//    }
//    
//    NSLog(@"");
//    return;
    
    RXLoginUIConfig *config = [[RXLoginUIConfig alloc] init];
    config.loginTypes = @[@"apple", @"guest", @"username", @"captchacode", @"wechat"];
//    config.loginViewType = 0;
//    config.privacieTitles = @[@"用户协议", @"隐私政策", @"儿童隐私协议"];
//    config.privacies = @[@"http://rxapi.jilinhaiqi.com/static/landing/#/v1/legal/terms/ccc/jkldajfljalsdfj/00001?lang=zh", @"http://rxapi.jilinhaiqi.com/static/landing/#/v1/legal/terms/ccc/jkldajfljalsdfj/00001?lang=zh", @"http://rxapi.jilinhaiqi.com/static/landing/#/v1/legal/terms/ccc/jkldajfljalsdfj/00001?lang=zh"];
    config.keyboardType = 2;
//    config.needRealAuth = NO;
    config.needSetPassword = YES;
    config.isShowDeregister = YES;
//    config.isQuickButtonBarVisible = YES;
//    [[RXService sharedSDK] setLanguage:@"zh"];
    
//    [[RXUIKitService sharedSDK] setNormalLoginViewWithConfig:config isAuth:NO loginEvent:^NSDictionary * _Nonnull(NSDictionary * _Nonnull loginEvent, LoginType loginType) {
//        NSMutableDictionary *dic = [NSMutableDictionary dictionary];
//        return dic;
//    } complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
//        
//    }];
//    return;
    
    [[RXUIKitService sharedSDK] setLoginViewWithConfig:config loginEvent:^NSDictionary * _Nonnull(NSDictionary * _Nonnull loginEvent, LoginType loginType) {
        NSMutableDictionary *loginExt = [NSMutableDictionary dictionary];
        switch (loginType) {
            case LoginTypeW:
                [loginExt setValue:@"wx8755e7b80be19d33" forKey:@"appid"];
                break;
            case LoginTypeAuth:
                [loginExt setValue:@"X5tTAE1YuJP2PNWI1TaBC2ZC+GlKTy14wZudrDChkG3gLBZS8g2Fm8rrkMGKgWHtVVnLhT4sH5GMUMvcpI1cxQCLte9zmqJzMnyfX+T/RfNODf8kherbqlYqvhQ0SlLciehLS8zG+pKiRVKV9n1MR44ktJFNftTP/UKGw0d0Rh83n8M8mtDKIJXgc/UpKnWdhZ5BaXHbUYMMfQRbHdDmPqGSK64RRVS9uWmJ3Btykbdbwj8K7/8A1r4gJtbx8TOK9Jx8P8gbYLs=" forKey:@"appid"];
                
//                [loginExt setValue:@"test" forKey:@"sign_fields"];
                [loginExt setValue:@"33333" forKey:@"migrate_args"];
                break;
            case LoginTypeCapCode:
                [loginExt setValue:@{} forKey:@"ext"];
                break;
            case LoginTypeVisitor:
//                [loginExt setValue:@"test" forKey:@"sign_fields"];
                break;
            default:
                break;
        }
        NSLog(@"loginExt:%@", loginExt);
        return loginExt;
    } complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
        NSDictionary *res = response;
        NSString *retData = nil;
        if (!error) {
            
        } else {
            res = error.responesObject;
        }
        
        if (!res || ![res isKindOfClass:[NSDictionary class]]) {
            retData = @"{\"code\" : -1, \"msg\" : \"登录失败\"}";
        } else {
            NSData *data = [NSJSONSerialization dataWithJSONObject:res options:NSJSONWritingPrettyPrinted error:nil];
            retData = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
        }
        
//        NSLog(@"登录回调");
    }];
    
    
    
//    [[RXUIKitService sharedSDK] setLoginViewWithAccounts:arr privacies:nil loginType:^(LoginType loginType) {
//        // 业务端可根据不同登录方式传定制extDic
//        // 登录接口
//        NSString *username;
//        NSString *password;
//        switch (loginType) {
//            case LoginTypeAuth:
////                [[RXService sharedSDK] setAuthLoginViewWithPrivacy1:@"" privacy2:@""];
//                break;
//            case LoginTypeAccount:
//            {
//                NSDictionary *accountInfo = [[RXUIKitService sharedSDK] getAccountInfo];
//                username = accountInfo[@"username"];
//                password = accountInfo[@"password"];
//                NSLog(@"");
//            }
//                break;
//            default:
//                break;
//        }
//        [[RXService sharedSDK] loginWithExtDic:nil username:username password:password sign_fields:nil loginType:loginType migrate_args:nil];
//    }];
}

#pragma mark -- <登录回调>
- (void)rxu_LoginCallBackWithResponse:(NSDictionary *)response error:(RX_CommonRequestError *)error
{
    NSLog(@"");
//    if (!error) {
//        NSLog(@"登录成功");
//        NSDictionary *dic = response;
//        self.loginOpenid = dic[@"data"][@"login_openid"];
//        
//        [[NSUserDefaults standardUserDefaults] setValue:dic[@"data"][@"login_openid"] forKey:@"loginopenid"];
//        
//        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:response options:NSJSONWritingPrettyPrinted error:nil];
//        NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
//        
//        UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"登录成功" message:jsonString preferredStyle:UIAlertControllerStyleAlert];
//        [alert addAction:[UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
//
//        }]];
//
//        [self presentViewController:alert animated:YES completion:NULL];
//        
//    } else {
//        // 服务端返回错误
//        NSDictionary *errorRes = error.responesObject;
//        NSString *errorMsg = errorRes[@"msg"];
//        NSInteger errorCode = [errorRes[@"code"] integerValue];
//        NSLog(@"登录失败");
//    }
}

- (void)rx_LoginCallBackWithResponse:(NSDictionary *)response error:(RX_CommonRequestError *)error
{
//    if (!error) {
//        NSLog(@"登录成功");
//        NSDictionary *dic = response;
//        self.loginOpenid = dic[@"data"][@"login_openid"];
//        
//        [[NSUserDefaults standardUserDefaults] setValue:dic[@"data"][@"login_openid"] forKey:@"loginopenid"];
//        
//        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:response options:NSJSONWritingPrettyPrinted error:nil];
//        NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
//        
//        UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"登录成功" message:jsonString preferredStyle:UIAlertControllerStyleAlert];
//        [alert addAction:[UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
//
//        }]];
//
//        [self presentViewController:alert animated:YES completion:NULL];
//        
//    } else {
//        // 服务端返回错误
//        NSDictionary *errorRes = error.responesObject;
//        NSString *errorMsg = errorRes[@"msg"];
//        NSInteger errorCode = [errorRes[@"code"] integerValue];
//        NSLog(@"登录失败");
//    }
}

#pragma mark -- <开启防沉迷>
//- (void)openAntiTimer:(NSInteger)aas
//{
//    NSTimer *antiTimer = [NSTimer scheduledTimerWithTimeInterval:aas target:self selector:@selector(antimerAction:) userInfo:nil repeats:YES];
//    [[NSRunLoop currentRunLoop] addTimer:antiTimer forMode:NSRunLoopCommonModes];
//}
//
//- (void)antimerAction:(NSTimer *)timer
//{
//    NSInteger antiTime = [self pleaseInsertStarTime:self.antiFrom andInsertEndTime:self.antiTo];
////    [[RXService sharedSDK] setAntiAdditionViewWithTitle:@"未成年人防沉迷登录限制提示" des:[NSString stringWithFormat:@"仅可在周五，周六，周日和法定节假日每日%@至%@向未成年人提供%ld小时网络游戏服务，目前已达到下线要求时间，请您退出游戏", self.antiFrom, self.antiTo, (long)antiTime] type:AntiBtnType_logout complete:^{
////
////    }];
//    [timer invalidate];
//
//}

#pragma mark -- <getter>
// 获取时间差
- (NSInteger)pleaseInsertStarTime:(NSString *)starTime andInsertEndTime:(NSString *)endTime{
    NSDateFormatter* formater = [[NSDateFormatter alloc] init];
    [formater setDateFormat:@"mm:ss"];//根据自己的需求定义格式
    NSDate* startDate = [formater dateFromString:starTime];
    NSDate* endDate = [formater dateFromString:endTime];
    NSTimeInterval timeInterval = [endDate timeIntervalSinceDate:startDate];
    NSInteger time = (int)timeInterval / 60;
    return time;
}

- (void)btnAction1
{
#warning test -- 系统分享测试
//    UIActivityViewController *vc = [[UIActivityViewController alloc]initWithActivityItems:@[@"123",[NSURL URLWithString:@"https://www.baidu.com"]] applicationActivities:nil];
//    vc.view.frame = CGRectMake(0, 0, 300, 100);
//    vc.excludedActivityTypes = @[UIActivityTypePostToFacebook, UIActivityTypePostToTwitter, UIActivityTypePostToWeibo, UIActivityTypeMessage,UIActivityTypeMail,UIActivityTypePrint,UIActivityTypeCopyToPasteboard,UIActivityTypeAssignToContact,UIActivityTypeSaveToCameraRoll,UIActivityTypeAddToReadingList,UIActivityTypePostToFlickr,UIActivityTypePostToVimeo,UIActivityTypePostToTencentWeibo,UIActivityTypeAirDrop,UIActivityTypeOpenInIBooks];
//    [vc setValue:@(100) forKeyPath:@"_collectionView.frame.size.height"];
//    vc.modalPresentationStyle = UIModalPresentationFullScreen;
//    [self presentViewController:vc animated:YES completion:nil];
//    for (UIView *v in [UIApplication sharedApplication].keyWindow.subviews) {
//        NSLog(@"%@", [v class]);
//        UILayoutContainerView *layout = (UILayoutContainerView *)v;
//    }
    
    [[RXUIKitService sharedSDK] setRealauthViewWithCanClose:YES complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
        NSLog(@"");
    }];
    
//    [[RXUIKitService sharedSDK] setRealauthViewWithComplete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
//        NSLog(@"");
//    }];
    
//    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
//        [[RXUIKitService sharedSDK] closeRealauthView];
//        
//    });
}

- (void)btnAction2
{
    UIPasteboard *pasteboard = [UIPasteboard generalPasteboard];
    pasteboard.string = @"https://cn-api-test.ruixueyun.com/static/retrieve#/retrieve?uuid=uNMRXtUHR";
//    [[RXUIKitService sharedSDK] openWebViewWithUrl:@"https://u1oodq.jixiangweb.com/invite/?identity=WAd0BN8NR&region=-1&protocol_android=sxb666&protocol_ios=sxb666&api=https%3A%2F%2Fwafv72.jixiangweb.com%2F&customAction=invite&inviteCode=28818" title:@"测试标题"];
    [[RXUIKitService sharedSDK] openWebViewWithUrl:@"https://cn-api-test.ruixueyun.com/static/retrieve#/retrieve?uuid=uNMRXtUHR" title:@"测试标题"];
    return;
    
    [[RXUIKitService sharedSDK] setAntiAdditionViewWithTitle:@"提示" des:@"根据国家最新法规规定，未进行实名认证的用户不能体验任何游戏内容，请尽快完成实名。当前账号未进行实名认证，游戏累计时间超过1小时将强制下线休息，且无法进行充值操作。请合理安排游戏时间，做适当的身体活动。" btnTitle:@"test" complete:^{

    }];
}

- (void)btnAction3
{
    // @[@"phone", camera]
    // 取配置接口下的permission list key
    [[RXUIKitService sharedSDK] setLimitViewWithKeys:@[@"phone", @"locate", @"call", @"camera"] clickBlock:^(NSInteger status) {

    }];
//    [[RXUIKitService sharedSDK] bindingPhoneWithComplete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
//
//    }];
//    [[RXUIKitService sharedSDK] destroyAccountStatusView];
}

- (void)btnAction4
{
    BOOL rota = [[NSUserDefaults standardUserDefaults] boolForKey:@"rotation"];
    [[NSUserDefaults standardUserDefaults] setBool:!rota forKey:@"rotation"];
    exit(0);
}

- (void)btnAction5
{
//    [[RXUIKitService sharedSDK] setProtocolViewWithKey:@"00006" complete:^(BOOL isAgree) {
//
//    }];
}

- (void)btnAction6
{
    [[RXService sharedSDK] getLegalInfo:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
        
    // 权限弹框
        [[RXUIKitService sharedSDK] setPermissionViewWithLegalData:response clickBlock:^(NSInteger status) {
                    
        }];
    }];
}

- (void)btnAction7
{
    
//    [[RXService sharedSDK] getLegalInfo:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
//        [[RXUIKitService sharedSDK] setPrivacyViewWithKey:@"00001" legalData:response];
//    }];
    
//    [[RXUIKitService sharedSDK]setProtocolViewWithKey:@"00001" keyList:@[@"00001", @"00002", @"00005"]];
//    [[RXService sharedSDK] setInitParamsWithProductId:@"263" channelId:@"101" cpid:@"1000038" baseUrlList:@[@"https://yh9gc7be1n.hitoffapp.com/"] complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//    }];
    [[RXUIKitService sharedSDK] setProtocolViewWithKey:@"00002" keyList:@[]];
}

- (void)businessCallBackWithResponse:(NSDictionary *)response error:(RX_CommonRequestError *)error
{
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:response options:NSJSONWritingPrettyPrinted error:nil];
    NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
    NSLog(@"获取到的数据商业化数据 = %@", jsonString);
}

/** appdelegate */
- (id<UIApplicationDelegate>)applicationDelegate {
    return [UIApplication sharedApplication].delegate;
}

/** 返回当前控制器 */
- (UIViewController *)currentViewController {
    
    UIViewController *rootViewController = [self applicationDelegate].window.rootViewController;
    return [self currentViewControllerFrom:rootViewController];
}

/** 返回当前的导航控制器 */
- (UINavigationController *)currentNavigationViewController {
    
    UIViewController *currentViewController = [self currentViewController];
    return currentViewController.navigationController;
}

/** 通过递归拿到当前控制器 */
- (UIViewController *)currentViewControllerFrom:(UIViewController*)viewController {
    
    // 如果传入的控制器是导航控制器,则返回最后一个
    if ([viewController isKindOfClass:[UINavigationController class]]) {
        
        UINavigationController *navigationController = (UINavigationController *)viewController;
        return [self currentViewControllerFrom:navigationController.viewControllers.lastObject];
    }
    // 如果传入的控制器是tabBar控制器,则返回选中的那个
    else if([viewController isKindOfClass:[UITabBarController class]]) {
        
        UITabBarController *tabBarController = (UITabBarController *)viewController;
        return [self currentViewControllerFrom:tabBarController.selectedViewController];
    }
    // 如果传入的控制器发生了modal,则就可以拿到modal的那个控制器
    else if(viewController.presentedViewController != nil) {
        return [self currentViewControllerFrom:viewController.presentedViewController];
    }
    else {
        return viewController;
    }
}

-(NSString *)getTime{
    NSDate* date = [NSDate dateWithTimeIntervalSinceNow:0];
    NSTimeInterval a=[date timeIntervalSince1970]*1000; // *1000 是精确到毫秒，不乘就是精确到秒
    NSString *timeString = [NSString stringWithFormat:@"%.0f", a]; //转为字符型
    return timeString;
}

/** 获取当前屏幕方向 */
- (NSInteger)getInterfaceOrientation
{
    NSInteger ori = 0;
    UIInterfaceOrientation orientation = [UIApplication sharedApplication].statusBarOrientation;
    
    if(orientation == 0) { //Default orientation
    
    }
    else if(orientation == UIInterfaceOrientationPortrait) { //竖屏
        ori = 1;
    }
    else if(orientation == UIInterfaceOrientationLandscapeLeft) { // 左横屏
        ori = 2;
    }
    else if(orientation == UIInterfaceOrientationLandscapeRight) { //右横屏
        ori = 2;
    }
    return ori;
}

@end
