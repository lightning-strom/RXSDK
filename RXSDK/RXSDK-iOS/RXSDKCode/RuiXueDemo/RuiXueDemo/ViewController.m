//
//  ViewController.m
//  RuiXueDemo
//
//  Created by 陈汉 on 2021/9/26.
//

#import "ViewController.h"
//#import <RXSDK/RXSDK.h>
//#import <RXSDK_OS/RXSDK_OS.h>
#import <objc/runtime.h>
#import "ViewController1.h"
#import "LoginModel.h"
//#import <YYModel/YYModel.h>
#import "RXApiVC.h"
//#import <RXWXSDK/RXWXSDK.h>
#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXPushSDK/RXPushSDK.h>
//#import <RXLineSDK/RXLineSDK.h>
#import <RXSDK_Pure/RX_CommonNetworkExcute.h>
#import <RXContactSDK/RXContactSDK.h>
#import "ViewController2.h"
#import "RuiXueDemo-Swift.h"
#import "TestVC.h"

@interface ViewController () <RXLoginDelegate, UIAlertViewDelegate>
{
    NSDictionary *_customTransmit;
}

@property (nonatomic, strong) NSString *antiFrom; // 防沉迷开始时间
@property (nonatomic, strong) NSString *antiTo;   // 防沉迷结束时间
@property (nonatomic, strong) NSString *loginOpenid;
@property (nonatomic, strong) NSMutableDictionary *payInfo;

@end

@implementation ViewController

- (BOOL)shouldAutorotate
{
    return YES;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    
    int attr = 15;
    attr = attr & ~(1 << 2);
//    attr = attr | 3;
    
//    UIWindow *window = [UIApplication sharedApplication].keyWindow;
//    UIImageView *bgView = [[UIImageView alloc] initWithFrame:CGRectMake(0, 0, CGRectGetWidth(window.frame), CGRectGetHeight(window.frame))];
//    bgView.image = [UIImage imageNamed:@"test2"];
//    [self.view addSubview:bgView];
    
    [self setUI];
    
    self.view.backgroundColor = [UIColor blackColor];
    
    [RXService sharedSDK].loginDelegate = self;
}

- (void)btnAction3
{
    NSArray *productIdentifiers = @[@"com.ruixue.sdk1"];
//    [[StoreManager shared] fetchProductInfoWithProductIdentifiers:productIdentifiers completion:^(NSArray<NSDictionary *> * _Nullable response, NSError * _Nullable error) {
//        NSLog(@"");
//            
//    }];
    
    [[StoreManager shared] purchaseProductWithProductID:@"com.ruixue.sdk1" completion:^(NSDictionary * _Nullable response, NSError * _Nullable error) {
        NSLog(@"");
    }];
//    [[StoreKitManager shared] fetchProductsWithIdentifiers:productIdentifiers completion:^(NSArray<SKProduct *> *products) {
//        for (SKProduct *product in products) {
//            NSLog(@"Product: %@", product.localizedTitle);
//        }
//    }];
}

- (void)setUI
{
//    [[RXService sharedSDK] initWithProductId:@"1002"
//                                   channelId:@"iOS"
//                                        cpid:@"114"
//                                     ipv4Url:@""
//                                 baseUrlList:@[@"http://rxapi-test.jilinhaiqi.com"]];
//    [self btnAction10];
//    return;
    
    // 实名认证
    UIButton *btn1 = [[UIButton alloc] initWithFrame:CGRectMake(10, 100, 130, 30)];
    [btn1 setTitle:@"实名认证" forState:UIControlStateNormal];
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
    UIButton *btn7 = [[UIButton alloc] initWithFrame:CGRectMake(150, 200, 130, 30)];
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
    
    // 绑定手机
    UIButton *btn12 = [[UIButton alloc] initWithFrame:CGRectMake(150, 250, 130, 30)];
    [btn12 setTitle:@"设置登录配置" forState:UIControlStateNormal];
    [btn12 setBackgroundColor:[UIColor redColor]];
    [btn12 addTarget:self action:@selector(btnAction12) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn12];
    
    // applepay
    UIButton *btn13 = [[UIButton alloc] initWithFrame:CGRectMake(10, 300, 130, 30)];
    [btn13 setTitle:@"applepay" forState:UIControlStateNormal];
    [btn13 setBackgroundColor:[UIColor redColor]];
    [btn13 addTarget:self action:@selector(btnAction13) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn13];
    
    // 修改用户信息
    UIButton *btn14 = [[UIButton alloc] initWithFrame:CGRectMake(150, 300, 130, 30)];
    [btn14 setTitle:@"修改用户信息" forState:UIControlStateNormal];
    [btn14 setBackgroundColor:[UIColor redColor]];
    [btn14 addTarget:self action:@selector(btnAction14) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn14];
    
    // 修改密码
    UIButton *btn15 = [[UIButton alloc] initWithFrame:CGRectMake(10, 350, 130, 30)];
    [btn15 setTitle:@"修改密码" forState:UIControlStateNormal];
    [btn15 setBackgroundColor:[UIColor redColor]];
    [btn15 addTarget:self action:@selector(btnAction15) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn15];
    
    // 获取验证码
    UIButton *btn16 = [[UIButton alloc] initWithFrame:CGRectMake(150, 350, 130, 30)];
    [btn16 setTitle:@"获取验证码" forState:UIControlStateNormal];
    [btn16 setBackgroundColor:[UIColor redColor]];
    [btn16 addTarget:self action:@selector(btnAction16) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn16];
    
    // 重置密码
    UIButton *btn17 = [[UIButton alloc] initWithFrame:CGRectMake(290, 150, 130, 30)];
    [btn17 setTitle:@"重置密码" forState:UIControlStateNormal];
    [btn17 setBackgroundColor:[UIColor redColor]];
    [btn17 addTarget:self action:@selector(btnAction17) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn17];
    
    // 微信登录
    UIButton *btn18 = [[UIButton alloc] initWithFrame:CGRectMake(290, 200, 130, 30)];
    [btn18 setTitle:@"微信登录" forState:UIControlStateNormal];
    [btn18 setBackgroundColor:[UIColor redColor]];
    [btn18 addTarget:self action:@selector(btnAction18) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn18];
    
    // 苹果登录
    UIButton *btn19 = [[UIButton alloc] initWithFrame:CGRectMake(290, 250, 130, 30)];
    [btn19 setTitle:@"苹果登录" forState:UIControlStateNormal];
    [btn19 setBackgroundColor:[UIColor redColor]];
    [btn19 addTarget:self action:@selector(btnAction19) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn19];
    
    // 一键登录
    UIButton *btn20 = [[UIButton alloc] initWithFrame:CGRectMake(290, 300, 130, 30)];
    [btn20 setTitle:@"自定义请求" forState:UIControlStateNormal];
    [btn20 setBackgroundColor:[UIColor redColor]];
    [btn20 addTarget:self action:@selector(btnAction20) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn20];
    
    // 上报位置信息
    UIButton *btn21 = [[UIButton alloc] initWithFrame:CGRectMake(10, 400, 130, 30)];
    [btn21 setTitle:@"上报商业化" forState:UIControlStateNormal];
    [btn21 setBackgroundColor:[UIColor redColor]];
    [btn21 addTarget:self action:@selector(btnAction21) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn21];
    
    // 查询附近人
    UIButton *btn22 = [[UIButton alloc] initWithFrame:CGRectMake(150, 400, 130, 30)];
    [btn22 setTitle:@"获取商业化窗口" forState:UIControlStateNormal];
    [btn22 setBackgroundColor:[UIColor redColor]];
    [btn22 addTarget:self action:@selector(btnAction22) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn22];
    
    // 删除位置信息
    UIButton *btn23 = [[UIButton alloc] initWithFrame:CGRectMake(10, 450, 130, 30)];
    [btn23 setTitle:@"分享短链接" forState:UIControlStateNormal];
    [btn23 setBackgroundColor:[UIColor redColor]];
    [btn23 addTarget:self action:@selector(btnAction23) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn23];
    
    // 微信分享
    UIButton *btn24 = [[UIButton alloc] initWithFrame:CGRectMake(150, 450, 130, 30)];
    [btn24 setTitle:@"微信分享" forState:UIControlStateNormal];
    [btn24 setBackgroundColor:[UIColor redColor]];
    [btn24 addTarget:self action:@selector(btnAction24) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn24];
    
    // 注销
    UIButton *btn25 = [[UIButton alloc] initWithFrame:CGRectMake(290, 450, 130, 30)];
    [btn25 setTitle:@"注销" forState:UIControlStateNormal];
    [btn25 setBackgroundColor:[UIColor redColor]];
    [btn25 addTarget:self action:@selector(btnAction25) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn25];
    
    // 获取通路配置
    UIButton *btn26 = [[UIButton alloc] initWithFrame:CGRectMake(10, 500, 130, 30)];
    [btn26 setTitle:@"获取通路配置" forState:UIControlStateNormal];
    [btn26 setBackgroundColor:[UIColor redColor]];
    [btn26 addTarget:self action:@selector(btnAction26) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn26];
    
    // 支付宝实名
    UIButton *btn27 = [[UIButton alloc] initWithFrame:CGRectMake(150, 500, 130, 30)];
    [btn27 setTitle:@"支付宝实名" forState:UIControlStateNormal];
    [btn27 setBackgroundColor:[UIColor redColor]];
    [btn27 addTarget:self action:@selector(btnAction27) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn27];
    
    // 支付宝实名结果
    UIButton *btn28 = [[UIButton alloc] initWithFrame:CGRectMake(290, 500, 130, 30)];
    [btn28 setTitle:@"实名结果" forState:UIControlStateNormal];
    [btn28 setBackgroundColor:[UIColor redColor]];
    [btn28 addTarget:self action:@selector(btnAction28) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn28];
    
    // webView测试
    UIButton *pushBtn = [[UIButton alloc] initWithFrame:CGRectMake(150, 650, 130, 30)];
    [pushBtn setTitle:@"webView" forState:UIControlStateNormal];
    [pushBtn setBackgroundColor:[UIColor redColor]];
    [pushBtn addTarget:self action:@selector(pushBtnAction) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:pushBtn];
    
    // apidemo
    UIButton *apiBtn = [[UIButton alloc] initWithFrame:CGRectMake(10, 650, 130, 30)];
    [apiBtn setTitle:@"apiPush" forState:UIControlStateNormal];
    [apiBtn setBackgroundColor:[UIColor redColor]];
    [apiBtn addTarget:self action:@selector(apiBtnAction) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:apiBtn];
    
    UIButton *nextBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    [nextBtn setFrame:CGRectMake(290, 650, 100, 30)];
    nextBtn.backgroundColor = [UIColor redColor];
    [nextBtn setTitle:@"下一页" forState:UIControlStateNormal];
    nextBtn.titleLabel.font = [UIFont systemFontOfSize:14];
    [nextBtn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    [nextBtn addTarget:self action:@selector(nextBtnClick) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:nextBtn];
    
    // 初始化
    UIButton *registBtn = [[UIButton alloc] initWithFrame:CGRectMake(30, 800, 150, 50)];
    [registBtn setTitle:@"初始化" forState:UIControlStateNormal];
    [registBtn setBackgroundColor:[UIColor redColor]];
    [registBtn addTarget:self action:@selector(registBtnAction) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:registBtn];
    
    

    // app启动或者app从后台进入前台都会调用这个方法
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(applicationBecomeActive) name:UIApplicationDidBecomeActiveNotification object:nil];
    // app从后台进入前台都会调用这个方法
//    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(applicationBecomeActive) name:UIApplicationWillEnterForegroundNotification object:nil];
//    // 添加检测app进入后台的观察者
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(applicationEnterBackground) name: UIApplicationWillResignActiveNotification object:nil];
    
//    [self openAntiTimer:1];
    
//https://itunes.apple.com/lookup?id
//    [CHDownImage asyurlToData:@"https://itunes.apple.com/lookup?id=1528147801" withHandler:^(NSURLResponse *response, NSData *data, NSError *connectionError) {
//        NSDictionary *dic = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingAllowFragments error:nil];
//        NSLog(@"");
//    }];
    
//    BOOL isInstall = [self checkAPPIsExist:@"line://"];
//    NSLog(@"");
}

- (BOOL)checkAPPIsExist:(NSString *)URLScheme
{
    NSURL *url = [NSURL URLWithString:@"line://"];
 
    if ([[UIApplication sharedApplication] canOpenURL:url]){
        return YES;
        
    } else {
        return NO;
    }
}

- (void)applicationBecomeActive
{
    NSLog(@"");
}

- (void)applicationEnterBackground
{
    NSLog(@"11111");
//    [[RXLogService sharedSDK] trackConfigWithReportTime:1 maxCount:1];
//    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
//    [dic setValue:@"record_sharefriendfriend_record_sharefriend_record_sharefriend_record_sharefrie" forKey:@"path1"];
//    [[RXLogService sharedSDK] dataTrackWithEvent:@"rxtest2" distinctId:@"" properties:dic];
}

- (void)apiBtnAction
{
    [self.navigationController pushViewController:[RXApiVC new] animated:YES];
}

- (void)pushBtnAction
{
    [self.navigationController pushViewController:[ViewController1 new] animated:YES];
}

- (void)nextBtnClick{
    [self.navigationController pushViewController:[ViewController2 new] animated:YES];
}

- (void)btnAction28
{
    [[RXSDK sharedSDK] getIIFAAResultWithSource:@"" retryCount:3 complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        NSString *msg = @"";
        if (!error) {
            msg = [NSString stringWithFormat:@"%@", response];
        } else {
            msg = [NSString stringWithFormat:@"%@", error.responesObject];
        }
        
        UIAlertAction *cancelAction=[UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
        }];
        UIAlertController *alertController=[UIAlertController alertControllerWithTitle:@"alert" message:msg preferredStyle:UIAlertControllerStyleAlert];
        [alertController addAction:cancelAction];
        
        [[self currentViewController] presentViewController:alertController animated:YES completion:nil];
    }];
}

- (void)btnAction27
{
//    NSURL *url = [NSURL URLWithString:@"whatsapp://send?phone=+84337061431&text=分享链接\nhttps://www.baidu.com"];
//    NSURL *url = [NSURL URLWithString:@"whatsapp://send?phone=+84337061431&image=https://tpkdfjs.pwypyq.com/share/2025/6/25/1750852951509.png"];
//    NSURL *url = [NSURL URLWithString:@"wlappid142://"];
//    [[UIApplication sharedApplication] openURL:url options:nil completionHandler: ^(BOOL success) {
//        
//    }];
    
//    [[RXApiService share
//    [[RXApiService sharedSDK] refreshTokenWithComplete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
//       
//        NSLog(@"");
//    }];
    
//    [[RXApiService sharedSDK] getServiceChatUnreadCount:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        
//    }];
    
    [[RXSDK sharedSDK] getIIFAARedirectURLWithAppName:@"ruixue" thirdPartSchema:@"" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        NSLog(@"");
        NSURL *url = [NSURL URLWithString:response[@"data"][@"url"]];
        [[UIApplication sharedApplication] openURL:url options:nil completionHandler: ^(BOOL success) {
            
        }];
    }];
}

- (void)dateFromString:(NSString *)string
{
    NSDateFormatter *formatter = [[NSDateFormatter alloc]init];
    [formatter setDateFormat:@"yyyy-MM-dd HH-mm-sss"];
    
    NSDate *resDate = [formatter dateFromString:string];
}

- (int)compareOneDay:(NSDate *)oneDay withAnotherDay:(NSDate *)anotherDay
{

    
    NSCalendar *gregorian = [[NSCalendar alloc] initWithCalendarIdentifier:NSCalendarIdentifierGregorian];
    
    unsigned int unitFlags = NSCalendarUnitYear |
    NSCalendarUnitMonth |
    NSCalendarUnitDay |
    kCFCalendarUnitHour |
    kCFCalendarUnitMinute |
    kCFCalendarUnitSecond;
    
    NSDateComponents *comps = [gregorian components:unitFlags fromDate:oneDay toDate:anotherDay options:0];
    
    NSInteger year = [comps year];
    NSInteger month = [comps month];
    NSInteger day = [comps day];
    NSInteger hour = [comps hour];
    NSInteger min = [comps minute];
    NSInteger second = [comps second];
    if (year > 0) {
        return 0;
    }
    if (month > 0 && year <= 0) {
        return 0;
    }
    if (month <= 0 && year <= 0 && day > 0) {
        return 0;
    }
    if (day <= 0 || month <= 0 || year <= 0) {
        if (day < 0 || month < 0 || year < 0) {
            return 1;
        }
        if (hour < -11) {
            return 1;
        } else if (hour > -11) {
            return 0;
        } else if (hour == -11) {
            if (min > -35) {
                return 0;
            } else if (min < -35){
                return 1;
            } else {
                if (second >= 0) {
                    return 0;
                } else {
                    return 1;
                }
            }
        } else {
            return 0;
        }
    } else {
        return 0;
    }
    
}



- (void)btnAction26
{
    [[RXShareService sharedSDK] getSharePlatformsWithComplete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        NSLog(@"");
    }];
}

- (void)btnAction25
{
    [[RXService sharedSDK] requestActivatedWithSourceAd:nil complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (!error) {
            NSLog(@"激活成功");
        }
    }];
}

- (void)btnAction24
{
    NSString *imageURLString = @"https://ffintpz.weilekuiming.com/share/2026/6/8/1780899837399.jpg";
    [self rx_downloadShareImageWithURLString:imageURLString complete:^(NSString *imagePath) {
        if (imagePath.length <= 0) {
            NSLog(@"分享图片下载失败");
            return;
        }
        
        RXCustomShareConfig *customConfig = [[RXCustomShareConfig alloc] init];
        customConfig.materialType = @"image";
        customConfig.image = imagePath;
        customConfig.platform = @"system";
        
        [[RXSDK sharedSDK] shareCustom:customConfig complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
            NSLog(@"");
        }];
    }];
    
    return;
    
    RXShareConfig *config = [[RXShareConfig alloc] init];
    config.func = @"share_link"; // 链接埋点
//    config.func = @"chengjiu1"; // 图片埋点
//    config.func = @"honor_pass_3d";
    config.platform = @"wechat";
    config.androidScheme = @"gyjljg";
    config.iOSScheme = @"gyjljg";
//    config.shareScene = 1;
//    config.useShortUrl = YES;
    config.readCache = NO;
    
    // 【可选】大数据预置属性透传参数
    config.setCustomExt = @{@"bigdata_ext" : @{@"a" : @"b"}};
    
    config.properties = @{@"key" : @"value"};
    NSString *transmits = @"a=b";
    
    config.transmits = [transmits stringByAddingPercentEncodingWithAllowedCharacters:[NSCharacterSet URLQueryAllowedCharacterSet]];
    
    
    [[RXSDK sharedSDK] share:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
            
    }];
    return;
    
    [[RXShareService sharedSDK] getShareInfoWithConfig:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        
        RXCustomShareConfig *customConfig = [[RXCustomShareConfig alloc] init];
        customConfig.materialType = @"image";
        customConfig.url = response[@"data"][@"content"][@"url"];
        customConfig.image = response[@"data"][@"content"][@"image"];
        customConfig.platform = @"system";
        customConfig.thirdAppid = @"wx5d34c56f0c58e881";
        customConfig.x = [response[@"data"][@"content"][@"x"] integerValue];
        customConfig.y = [response[@"data"][@"content"][@"y"] integerValue];
        customConfig.width = [response[@"data"][@"content"][@"width"] integerValue];
        customConfig.height = [response[@"data"][@"content"][@"height"] integerValue];
        customConfig.borderSize = 10;
        customConfig.shareScene = 1;
        
        [[RXShareService sharedSDK] shareCustom:customConfig complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
            NSLog(@"");
            
            [[RXShareService sharedSDK] shareSchedulingReportWithFunc:@"dd" platform:@"wechat" region:@"333" transmits:nil scheduling_event:YES scheduling_type:@"share" properties:nil complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                NSLog(@"");
            }];
        }];
        
//        UIAlertAction *cancelAction=[UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
//        }];
//        UIAlertController *alertController=[UIAlertController alertControllerWithTitle:@"alert" message:response[@"data"][@"content"][@"url"] preferredStyle:UIAlertControllerStyleAlert];
//        [alertController addAction:cancelAction];
//        
//        [[self currentViewController] presentViewController:alertController animated:YES completion:nil];
//        
//        UIPasteboard *pasteboard = [UIPasteboard generalPasteboard];
//        pasteboard.string = response[@"data"][@"content"][@"url"];
    }];
//    
//    [[RXShareService sharedSDK] share:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        NSLog(@"");
//        
//    }];
//    
//    return;
    
//    [[RXShareService sharedSDK] share:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        NSLog(@"");
//    }];
    
}

- (void)btnAction23
{
    
    RXShareConfig *config = [[RXShareConfig alloc] init];
    config.func = @"sdk_chengjiushare"; // 链接埋点
//    config.func = @"chengjiu1"; // 图片埋点
    config.platform = @"wechat";
    config.androidScheme = @"weile265gl";
    config.iOSScheme = @"weile265gl";
//    config.useShortUrl = YES;
    config.readCache = NO;
    config.properties = @{@"key" : @"value"};
    NSString *transmits = @"use_url_param=true";
//    config.transmits = [transmits stringByAddingPercentEncodingWithAllowedCharacters:[NSCharacterSet URLQueryAllowedCharacterSet]];
    
    [[RXShareService sharedSDK] getShareInfoWithConfig:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        UIAlertAction *cancelAction=[UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
        }];
        UIAlertController *alertController=[UIAlertController alertControllerWithTitle:@"alert" message:response[@"data"][@"content"][@"url"] preferredStyle:UIAlertControllerStyleAlert];
        [alertController addAction:cancelAction];
        
        [[self currentViewController] presentViewController:alertController animated:YES completion:nil];
        
        UIPasteboard *pasteboard = [UIPasteboard generalPasteboard];
        pasteboard.string = response[@"data"][@"content"][@"url"];
    }];

    
    [[RXShareService sharedSDK] getShareSchedulingWithFuncs:@[] complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        NSLog(@"");
    }];
//    NSString *transmits = @"sharefromtype=value&sharetype=value";
//    NSCharacterSet *encodeSet = [NSCharacterSet characterSetWithCharactersInString:@"!*'();:@&=+$,/?%#[]"];
//    NSString *encode = [transmits stringByAddingPercentEncodingWithAllowedCharacters:encodeSet];
//    
//    [[RXShareService sharedSDK] getShareInfoWithFunc:@"youdao" platform:@"wechat" region:@"" transmits:encode ext:@{@"protocol_android" : @"weile263" , @"protocol_ios" : @"weile263", @"game_info" : @{@"a" : @"b"}} readCache:NO complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        NSString *url = response[@"data"][@"content"][@"url"];
//        NSLog(@"contenturl = %@", url);
//    }];
//    
    [[RXShareService sharedSDK] shareSchedulingReportWithFunc:@"youdao" platform:@"wechat" region:@"" transmits:nil scheduling_event:YES scheduling_type:@"share" properties:nil complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
            
    }];
}

- (void)btnAction22
{
    [[RXApiService sharedSDK] getOperationSceneWithComplete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:response options:NSJSONWritingPrettyPrinted error:nil];
        //
        NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        NSLog(@"");
    }];
    
//    NSString *message = @"这是一个链接：https://www.baidu.com";
//    NSMutableAttributedString *attributedMessage = [[NSMutableAttributedString alloc] initWithString:message];
//    NSURL *url = [NSURL URLWithString:@"https://www.baidu.com"];
//    [attributedMessage addAttribute:NSLinkAttributeName value:url range:[message rangeOfString:@"https://www.baidu.com"]];
//
//    UIAlertAction *cancelAction=[UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
//    }];
//    UIAlertController *alertController=[UIAlertController alertControllerWithTitle:@"alert" message:@"" preferredStyle:UIAlertControllerStyleAlert];
//    [alertController addAction:cancelAction];
//    
//    UIViewController* viewController1 = [[UIViewController alloc]init];
//        UITextView* textView = [[UITextView alloc]initWithFrame:CGRectMake(13, 0, CGRectGetWidth(viewController1.view.frame) - 26, 130)];
//        [viewController1.view addSubview:textView];
//        [alertController setValue:viewController1 forKey:@"contentViewController"];
//    [[self currentViewController] presentViewController:alertController animated:YES completion:nil];
    
    
//    [[RXBusinessService sharedSDK] requestBusinessOrderWithTrade_no:@"test" sign:@"test" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//
//    }];
    // 手动
//    [[RXBusinessService sharedSDK] getBusinessDataWithWindow_key:@"sfnj" event:@"dwt" before_event:@"#share_get_data" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        NSLog(@"%@", response);
//    }];
//
//    [[RXBusinessService sharedSDK] getBusinessDataWithWindow_key:@"nmlyd" event:@"qgn" before_event:@"#paid" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        NSLog(@"%@", response);
//    }];
//
//    [[RXBusinessService sharedSDK] getBusinessDataWithWindow_key:@"sfnj" event:@"qgn" before_event:@"#paid" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        NSLog(@"%@", response);
//    }];
    
    // 自动
//    [[RXBusinessService sharedSDK] getBusinessDataWithWindow_key:@"balt_hall_jbpj" event:@"se_505001" before_event:@""];
    
//    [[RXBusinessService sharedSDK] refreshBusinessData];
}

- (void)btnAction21
{
    
//    [self.navigationController pushViewController:[TestVC new] animated:YES];
    
    NSDictionary *dic = @{
        @"modules": @[
            @{
                @"module_tag": @"dsa",
                @"category_tag": @"dass",
                @"clientversion": @(0),
                @"checkversion": @(0)
            },
            @{
                @"module_tag": @"_nNNN",
                @"category_tag": @"default",
                @"clientversion": @(0),
                @"checkversion": @(0)
            }
        ],
        @"type": @"js"
    };
    [[RXUpdateCheckService sharedSDK] updateGameVersionWithInfo:dic complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        
    }];
//    [[RXApiService sharedSDK] reportWindowExposureWithWindowData:@{} complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        NSLog(@"");
//    }];
//    [[RXLogService sharedSDK] setPublicProperties:@{
//        @"property1" : @"test1",
//        @"property2" : @"test2",
//        @"property3" : @"test3",
//        @"property4" : @"test4",
//    }];
//    
//    [[RXLogService sharedSDK] setTrackEnv:NO];
//    [[RXLogService sharedSDK] addLogWithEvent:@"event4" distinctId:@"" properties:@{@"property1" : @"33"}];
//    
//    [[RXContactService sharedSDK] openLocationReportWithDuration:30 types:@[@"boy"]];
    
//    [[RXContactService sharedSDK] addRelationWithTarget:@"" types:@{} target_remarks:@"" user_remarks:@"" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//            
//    }];
    
//    [[RXContactService sharedSDK] deleteRelationWithTarget:@"" types:@{} complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//            
//    }];
    
//    [[RXContactService sharedSDK] updateRemarksWithTarget:@"" target_remarks:@"" type:@"" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//
//    }];
    
//    [[RXContactService sharedSDK] addFriendWithTarget:@"" target_remarks:@"" user_remarks:@"" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//            
//    }];
    
//    [[RXContactService sharedSDK] deleteFriendWithTarget:@"" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//            
//    }];
    
//    [[RXContactService sharedSDK] updateFriendRemarkWithTarget:@"" target_remarks:@"" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//            
//    }];
    
//    [[RXContactService sharedSDK] getRankListWithRankId:@"" userId:@"" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//            
//    }];
    
//    [[RXContactService sharedSDK] reportRankScoreWithRankId:@"" openId:@"" score:0 userId:0 complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//            
//    }];
}

- (void)btnAction20
{
    [[RXSDK sharedSDK] feedbackCreateWithContent:@"114 test" attachments:@[] phone:@"18698646213" tags:@[] complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        NSLog(@"");
    }];
    return;
    
    // body
    NSMutableDictionary *body = [NSMutableDictionary dictionary];
    [body setValue:@"123" forKey:@"product_id"];
    [body setValue:@"123" forKey:@"channel_id"];
    [body setValue:@"1" forKey:@"kind_name"];
    
    [[RXService sharedSDK] createRequestWithUrl:@"v1/feedbackapi/player_feedback/create" header:nil body:body method:1 needLogin:YES complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
        if (!error) {
//            NSLog(@"修改手机号成功:\n %@", responseObject);
        } else {
//            NSLog(@"修改手机号失败:\n %@", error);
        }
    }];
}

- (void)btnAction19
{
    [[RXService sharedSDK] loginReq_appleWithMigrate_args:nil sign_fields:nil];
//    [[RXDestroyAccountService sharedSDK] destroyAccountWithIDCard:@"360402198611133850" realname:@"黄文杰" cpdata:@"{\"uid\":3356802,\"openid\":\"rxuL281WvMzwkoUBNZdSO9gn6_4VPp-o\",\"nick_name\":\"凉凉计时风\",\"sign\":\"7717F2948EC82F0A5DF03FCA24B33D7F\"}" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//
//    }];
}

- (void)btnAction18
{
//    [[RXService sharedSDK] loginReq_wWithWXAppid:@"wx242f30ff90bb6668"];
//    [[RXWXService sharedSDK] loginReq_wWithWXAppid:@"wxe3ed3ebb142026cd"];
//    [[RXWXService sharedSDK] loginReq_wWithWXAppid:@"wx5d34c56f0c58e881" migrate_args:nil sign_fields:nil];
}

- (void)btnAction17
{
//    [[RXLogService sharedSDK] trackConfigWithReportTime:10
//                                               maxCount:10];
//    [[RXLogService sharedSDK] addLogWithEvent:@"123" distinctId:nil properties:nil];
//    [[RXLogService sharedSDK] addLogWithEvent:@"1234" distinctId:nil properties:nil];
//    return;
    
    // 先获取验证码
//    [[RXApiService sharedSDK] resetPasswordWithUsername:@"18698646213" password:@"111111b@" captchaCode:@"6213" migrate_args:nil complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        NSLog(@"");
//    }];
    
    [[RXApiService sharedSDK] getCaptchaCodeWithType:CaptchaType_phone target:@"18698646213" purpose:@"login" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (!error) {
            
        }
    }];
}

- (void)btnAction16
{
    [[RXApiService sharedSDK] getCaptchaCodeWithType:CaptchaType_phone target:@"18698646213" purpose:@"login" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (!error) {
            
        }
    }];
    
    
//    [[RXApiService sharedSDK] verifyCaptchaCodeWithType:CaptchaType_phone target:@"18698646213" purpose:@"unbindphone" captcha_code:@"" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        NSLog(@"");
//    }];
//    [[RXApiService sharedSDK] captchaVerifyUIWithAppid:@"193923813" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        if (error) {
//            NSLog(@"验证失败");
//        } else {
//            if ([response[@"code"] integerValue] == 0) {
//                NSLog(@"验证成功：%@",response);
//                

//                
//            } else {
//                NSLog(@"验证失败：%@",response);
//            }
//        }
//    }];
//    return;
    
//    [[RXApiService sharedSDK] getCaptchaCodeWithType:CaptchaType_email target:@"894306571@qq.com" purpose:@"register" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        if (!error) {
//            
//        }
//    }];
}

- (void)btnAction15
{
    [[RXApiService sharedSDK] searchGameAccountWithComplete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        NSLog(@"");
    }];
    return;
    
    [[RXApiService sharedSDK] updatePasswordWithOldPwd:@"123aA!" newPwd:@"qq123456!" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
            
    }];
    
    // 插入行为统计
    // @{@"scene" : @"game", @"action" : @"win"} 仅为示例
    
    [[RXApiService sharedSDK] trackUserActionWithDistinctId:@"" properties:@{@"scene" : @"game", @"action" : @"win"}];
    
    // 终止行为统计
    [[RXApiService sharedSDK] stopTrackUserAction];
    
}

- (void)btnAction14
{
//    [[RXApiService sharedSDK] unBindPhoneWithCaptchaCode:@"0001" phone:@"18600000001" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        NSLog(@"");
//    }];
//    return;
    
//    [[RXIAPService sharedSDK] getProductInfoWithProductIdArr:@[@"com.ruixue.sdkdemo2"] complete:^(NSArray<SKProduct *> *productInfoList) {
//        SKProduct *skP = productInfoList[0];
//        // 获取商品币种
//        NSLocale *locale = skP.priceLocale;
//        NSString *currency = locale.localeIdentifier;
//        NSArray *currencyArr = [currency componentsSeparatedByString:@"="];
//        if (currencyArr.count > 1) {
//            currency = currencyArr[1];
//        }
//        // 获取商品金额
//        NSString *price = [skP.price description];
//        
//        NSString *identifier = skP.productIdentifier;
//
//        NSLog(@"");
//    }];
    
//    [[RXIAPService sharedSDK] getLocaleIdentifierWithProductId:@"com.ruixue.sdkdemo2" timeout:2 complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        NSLog(@"");
//    }];
//    return;
    
    NSDictionary *ext = @{
        @"old_avatarUrl" : @"旧头像",
        @"old_nickname" : @"旧昵称",
        @"old_sex" : @"旧性别"
    };
    
    NSInteger i = [[[NSUserDefaults standardUserDefaults] valueForKey:@"testNickName"] integerValue];
    i++;
    [[NSUserDefaults standardUserDefaults] setValue:@(i) forKey:@"testNickName"];
    NSString *nickname = [NSString stringWithFormat:@"rxtest%ld", i];
    [[RXApiService sharedSDK] updateUserInfo:nil nickname:nickname sex:nil region:@"123" ext:@{@"old_nickname" : @"test"} complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        NSString *msg = @"";
        if (!error) {
            msg = @"修改成功";
        } else {
            msg = @"修改失败";
        }
        UIAlertAction *cancelAction=[UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
        }];
        UIAlertController *alertController=[UIAlertController alertControllerWithTitle:@"修改结果" message:[NSString stringWithFormat:@"%@", msg] preferredStyle:UIAlertControllerStyleAlert];
        [alertController addAction:cancelAction];
        [[self currentViewController] presentViewController:alertController animated:YES completion:nil];
    }];    
}

- (void)btnAction13
{
    NSMutableDictionary *dict = [NSMutableDictionary dictionary];
//    [dict setValue:@"iap7" forKey:@"goods_tag"]; // 商品标签
//    [dict setValue:@"831000076" forKey:@"goods_tag"]; // 商品标签
//    [dict setValue:@(20) forKey:@"age"]; // 用户年龄,indulge_auth为1时必传该字段
    
//    [dict setValue:@"ios_tag2" forKey:@"goods_tag"]; // 商品标签
    [dict setValue:@"com.game.ginrummymaster.vip_499" forKey:@"goods_tag"]; // 商品标签
//    [dict setValue:@"rxdy1" forKey:@"goods_tag"]; // 商品标签
//    [dict setValue:@"goods_diamond_3dpay_30" forKey:@"goods_tag"]; // 商品标签
    [dict setValue:[self getTime] forKey:@"trade_no"]; // 订单号
//    [dict setValue:@(0) forKey:@"is_debug"]; // 是否测试订单 默认 0 正式  1 为测试订单
//    [dict setValue:@(1) forKey:@"env"]; // 是否使用沙盒环境支付 0 正式  1 沙盒
    [dict setValue:@"CNY" forKey:@"currency"]; // 币种 默认传: CNY
//    [dict setValue:@{@"pay_type" : @"wechat", @"pay_way" : @"SDK_PAY"} forKey:@"ext"]; // 支付扩展字段 三方支付额外传递参数 详见下面具体渠道
    [dict setValue:@{@"hq_type" : @"uac"} forKey:@"ext"];
    [dict setValue:@"" forKey:@"notify_url"]; // 支付成功通知CP发货地址
    [dict setValue:@"" forKey:@"transmit_args"]; // 客户端透传参数 非必传
    [dict setValue:@(1) forKey:@"indulge_auth"]; // 是否进行防沉迷验证  0不验证，1验证，默认不验证
    [dict setValue:@(NO) forKey:@"storeKit2"];
    
//    [dict setValue:@YES forKey:@"exchange"];
//    
//    // 道具兑换
//    [dict setValue:@(1) forKey:@"mode"]; // 扣除发放模式 1 一次性事务扣除, 默认1
//    [dict setValue:@"cjtag1" forKey:@"scene_tag"]; // 场景标识
//    [dict setValue:@(20008) forKey:@"window_id"]; // 窗口id
//    [dict setValue:@"8fcd03a965c9104b62b209fca6d18fa0" forKey:@"window_version"]; // 是否使用沙盒环境支付 0 正式  1 沙盒
//    [dict setValue:@"a3" forKey:@"cp_gift_tag"]; // cp侧礼包标识
//    [dict setValue:@"hi" forKey:@"cp_prop_tag"]; // cp侧待消费的 道具标识
//    [dict setValue:@(11) forKey:@"cp_prop_number"]; // cp侧待消费的 道具数量
//    [dict setValue:@[@{@"number" : @(100), @"tag" : @"60006"}, @{@"number" : @(88), @"tag" : @"Dj016"}, @{@"number" : @(999), @"tag" : @"71005"}] forKey:@"item_list"]; // 待兑换道具列表
    
    // 商业化窗口支付
//    NSMutableDictionary *businessPayDic = [NSMutableDictionary dictionary];
//    [businessPayDic setValue:@"场景标识" forKey:@"scene_identifier"];
//    [businessPayDic setValue:@"场景名称" forKey:@"scene_name"];
//    [businessPayDic setValue:@"触发按钮标识" forKey:@"trigger_button_identifier"];
//    [businessPayDic setValue:@"触发按钮名称" forKey:@"trigger_button_name"];
//    [businessPayDic setValue:@"窗口标识" forKey:@"window_identifier"];
//    [businessPayDic setValue:@"窗口名称" forKey:@"window_name"];
//    [businessPayDic setValue:@"窗口展示顺序" forKey:@"window_sequence"];
    
    // 商业化窗口礼包
//    NSMutableDictionary *businessGiftPayDic = [NSMutableDictionary dictionary];
//    [businessGiftPayDic setValue:@"礼包标识" forKey:@"identifier"];
//    [businessGiftPayDic setValue:@"礼包名称" forKey:@"name"];
//    [businessGiftPayDic setValue:@"购买礼包介质" forKey:@"purchase_medium"];
//    [businessGiftPayDic setValue:@(礼包价格) forKey:@"price"];
//    [businessGiftPayDic setValue:@"礼包计费点" forKey:@"billing_point"];
//    
//    [businessPayDic setValue:businessGiftPayDic forKey:@"gift_package"];
//    [dict setValue:businessPayDic forKey:@"bigdata_report"];
    
//    // 大数据预置事件透传参数
//    NSMutableDictionary *bigDataExtDic = [NSMutableDictionary dictionary];
//    [bigDataExtDic setValue:@"b" forKey:@"a"];
    
//    [dict setValue:@{@"cp_game_character_id" : @"123", @"cp_game_area_id" : @"456"} forKey:@"game_info"];
//    [dict setValue:@"unipin" forKey:@"pay_type"];
//    [dict setValue:@"ruixue_h5_trade" forKey:@"pay_type"];
//    [dict setValue:@"AD" forKey:@"country_code"];
//    [dict setValue:@"月卡" forKey:@"goods_name"];
//    [dict setValue:@"apple" forKey:@"scene"];
//    [dict setValue:@"https://cn-api-test.ruixuecloud.com/static/pay/#/result?status=SUCCESS" forKey:@"return_url"];
//    [dict setValue:@"1" forKey:@"rxTest"];
//    [dict setValue:@(1.99) forKey:@"user_real_price"]; // 实际支付币种
    
//    [[RXIAPService sharedSDK] setOpenStoreKit2:false];
//    self.payInfo = dict;
//    
//    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"选择环境" message:@"" delegate:self cancelButtonTitle:@"测试" otherButtonTitles:@"正式", nil];
//    [alert show];
//    
//    return;
    
//    [[RXIAPService sharedSDK] setOpenStoreKit2:YES];
    
//    [[RXIAPService sharedSDK] requestWithDict:dict completeHandle:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        NSString *str = [NSString stringWithFormat:@"%@", response];
//        if(!error){
//            NSLog(@"支付成功");
//        }else{
//            NSLog(@"支付失败");
//            str = [NSString stringWithFormat:@"%@", error.responesObject];
//        }
//    }];
    
    [[RXIAPService sharedSDK] iap:dict complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        NSString *str = [NSString stringWithFormat:@"%@", response];
        if(!error){
            NSLog(@"支付成功");
//            [self btnAction13];
        }else{
            NSLog(@"支付失败");
            str = [NSString stringWithFormat:@"%@", error.responesObject];
        }
        
        UIAlertAction *cancelAction=[UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
        }];
        UIAlertController *alertController=[UIAlertController alertControllerWithTitle:@"登录结果" message:str preferredStyle:UIAlertControllerStyleAlert];
        [alertController addAction:cancelAction];
        [[self currentViewController] presentViewController:alertController animated:YES completion:nil];
    }];
}

- (void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex
{
    if (buttonIndex == 0) {
        [self.payInfo setValue:@"1" forKey:@"rxTest"];
    } else {
        [self.payInfo setValue:@"0" forKey:@"rxTest"];
    }
    
    [[RXIAPService sharedSDK] requestWithDict:self.payInfo completeHandle:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        NSString *str = [NSString stringWithFormat:@"%@", response];
        if(!error){
            NSLog(@"支付成功");
        }else{
            NSLog(@"支付失败");
            str = [NSString stringWithFormat:@"%@", error.responesObject];
        }
    }];
}

- (void)btnAction12
{
    NSDictionary *dic = @{
        @"account" : @[@"method"],
        @"login" : @[@"product_id"]
    };
    [[RXSDK sharedSDK] getUserInfoByFieldWithParams:dic complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        NSLog(@"");
    }];
//    NSMutableDictionary *extDic = [NSMutableDictionary dictionary];
//    NSMutableDictionary *customExt = [NSMutableDictionary dictionary];
//    [customExt setValue:@{@"ios" : @"1"} forKey:@"bigdata_ext"];
//    [extDic setValue:customExt forKey:@"custom_ext"];
//
//    NSString *loginopenid = [[NSUserDefaults standardUserDefaults] valueForKey:@"loginopenid"];
//    
//    [[RXService sharedSDK] loginWithLoginOpenId:loginopenid sign_fields:nil extDic:nil];
//    return;
}

- (void)btnAction10
{
//    [[RXApiService sharedSDK] getTempNotice:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        NSLog(@"");
//    }];
    
    RXLoginUIModel *model = [[RXLoginUIModel alloc] init];

    BOOL isInvalid = [[RXApiService sharedSDK] loginOpenidExpireInvalid];
    
    NSMutableDictionary *extDic = [NSMutableDictionary dictionary];
    NSMutableDictionary *customExt = [NSMutableDictionary dictionary];
    [customExt setValue:@{@"ios" : @"1"} forKey:@"bigdata_ext"];
    [extDic setValue:customExt forKey:@"custom_ext"];
//    [[RXService sharedSDK] loginWithExtDic:nil username:@"" password:@"" sign_fields:nil loginType:LoginTypeApple migrate_args:nil];
//    [[RXService sharedSDK] loginWithExtDic:extDic username:@"18698646213" password:@"A123456!" sign_fields:nil loginType:LoginTypeVisitor migrate_args:nil];
    
    [[RXService sharedSDK] loginWithLoginType:LoginTypeVisitor username:@"18698646213" password:@"A123456!" captchaCode:@"6213" permissions:nil loginOpenId:nil extDic:@{@"appid" : @"wx5d34c56f0c58e881"} signFields:nil migrateArgs:nil complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        NSLog(@"");
    }];
    
//    [[RXService sharedSDK] loginWithLoginType:LoginTypeVisitor username:@"" password:@"" captchaCode:@"" permissions:@[] loginOpenId:@"" extDic:extDic signFields:nil migrateArgs:nil];
    
//    [[RXService sharedSDK] loginWithLoginOpenId:self.loginOpenid sign_fields:nil extDic:extDic];
}

#pragma mark -- <登录回调>
- (void)rx_LoginCallBackWithResponse:(NSDictionary *)response error:(RX_CommonRequestError *)error
{
    if (!error) {
        [[RXService sharedSDK] setLanguage:@"en"];
        
        self.loginOpenid = response[@"data"][@"login_openid"];
        
        [[NSUserDefaults standardUserDefaults] setValue:self.loginOpenid forKey:@"loginopenid"];
        
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:response options:NSJSONWritingPrettyPrinted error:nil];
        NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        NSString *log = [[RXLogService sharedSDK] getSDKLog];
        
        NSData *devicetoken = [[NSUserDefaults standardUserDefaults] valueForKey:@"deciceToken"];
        
        [[RXPushService sharedSDK] registerDeviceToken:devicetoken complete:^(NSDictionary * _Nonnull response, NSDictionary * _Nonnull error) {
            NSLog(@"");
            if (error == nil) {
                
            }else{
                
            }
        }];
        
        [[RXLogService sharedSDK] configWithReportTime:10 maxCount:100];
        [[RXLogService sharedSDK] dataTrackWithEvent:@"test" distinctId:@"" properties:@{@"property1" : @"33"}];
        
        NSLog(@"");
    } else {
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:error.responesObject options:NSJSONWritingPrettyPrinted error:nil];
        NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        NSLog(@"");
    }
    
//
//    UIAlertAction *cancelAction=[UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
//    }];
//    UIAlertController *alertController=[UIAlertController alertControllerWithTitle:@"登录结果" message:[NSString stringWithFormat:@"%@", error.error] preferredStyle:UIAlertControllerStyleAlert];
//    [alertController addAction:cancelAction];
//    [[self currentViewController] presentViewController:alertController animated:YES completion:nil];
}

#pragma mark -- <开启防沉迷>
- (void)openAntiTimer:(NSInteger)aas
{
    NSTimer *antiTimer = [NSTimer scheduledTimerWithTimeInterval:aas target:self selector:@selector(antimerAction:) userInfo:nil repeats:YES];
    [[NSRunLoop currentRunLoop] addTimer:antiTimer forMode:NSRunLoopCommonModes];
}

- (void)antimerAction:(NSTimer *)timer
{
    NSLog(@"timer");
//    NSInteger antiTime = [self pleaseInsertStarTime:self.antiFrom andInsertEndTime:self.antiTo];
//    [[RXService sharedSDK] setAntiAdditionViewWithTitle:@"未成年人防沉迷登录限制提示" des:[NSString stringWithFormat:@"仅可在周五，周六，周日和法定节假日每日%@至%@向未成年人提供%ld小时网络游戏服务，目前已达到下线要求时间，请您退出游戏", self.antiFrom, self.antiTo, (long)antiTime] type:AntiBtnType_logout complete:^{
//
//    }];
//    [timer invalidate];
    
}

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
    [[RXApiService sharedSDK] approveWithRealName:@"陈汉" idCard:@"220581199403050975" isFastAuth:NO complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                
    }];
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
    
//    [[RXService sharedSDK] setApproveViewWithComplete:^(NSDictionary * _Nonnull backData, RX_CommonRequestError * _Nonnull error) {
//
//    }];
}

- (void)btnAction2
{
//    [[RXService sharedSDK] setAntiAdditionViewWithTitle:@"提示" des:@"未满18不能充值" type:AntiBtnType_default complete:^{
//
//    }];
    
    [[RXSDK sharedSDK] bindAccountWithExt:@{@"method" : @"apple"} complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        NSLog(@"");
    }];
}

- (void)btnAction4
{
    BOOL rota = [[NSUserDefaults standardUserDefaults] boolForKey:@"rotation"];
    [[NSUserDefaults standardUserDefaults] setBool:!rota forKey:@"rotation"];
    exit(0);
}

- (void)btnAction5
{
//    [[RXService sharedSDK] setProtocolViewWithKey:@"00006" complete:^(BOOL isAgree) {
//
//    }];
}

- (void)btnAction6
{
    
    [[RXService sharedSDK] getLegalInfo:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:response options:NSJSONWritingPrettyPrinted error:nil];
        if (error) {
            NSLog(@"json解析失败:%@", error);
        }
        NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        NSDictionary *antiDic = response[@"antiAddiction"];
        NSDictionary *userLimitDic = antiDic[@"useLimit"];
        self.antiFrom = userLimitDic[@"timeFrom"];
        self.antiTo = userLimitDic[@"timeTo"];
        // TODO: 先获取法务信息后调用登录
        
    }];
}

- (void)btnAction7
{
//    [[RXService sharedSDK] setPrivacyViewWithKey:@"00004"];
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

- (NSString *)getTime
{
    NSDate* date = [NSDate dateWithTimeIntervalSinceNow:0];
    NSTimeInterval a=[date timeIntervalSince1970]*1000; // *1000 是精确到毫秒，不乘就是精确到秒
    NSString *timeString = [NSString stringWithFormat:@"%.0f", a]; //转为字符型
    return timeString;
}

- (void)rx_downloadShareImageWithURLString:(NSString *)urlString complete:(void (^)(NSString *imagePath))complete
{
    NSURL *url = [NSURL URLWithString:urlString];
    if (!url) {
        if (complete) {
            complete(nil);
        }
        return;
    }
    
    NSString *fileName = url.lastPathComponent.length > 0 ? url.lastPathComponent : @"share_image.jpg";
    NSString *cachePath = NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES).firstObject;
    NSString *imageDirectory = [cachePath stringByAppendingPathComponent:@"RXDemoShareImages"];
    NSString *imagePath = [imageDirectory stringByAppendingPathComponent:fileName];
    
    NSFileManager *fileManager = [NSFileManager defaultManager];
    if ([fileManager fileExistsAtPath:imagePath]) {
        if (complete) {
            complete(imagePath);
        }
        return;
    }
    
    [fileManager createDirectoryAtPath:imageDirectory withIntermediateDirectories:YES attributes:nil error:nil];
    [[[NSURLSession sharedSession] dataTaskWithURL:url completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
        NSString *localImagePath = nil;
        if (!error && data.length > 0 && [data writeToFile:imagePath atomically:YES]) {
            localImagePath = imagePath;
        }
        
        dispatch_async(dispatch_get_main_queue(), ^{
            if (complete) {
                complete(localImagePath);
            }
        });
    }] resume];
}

@end
