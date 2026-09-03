//
//  ViewController.m
//  RXWXSDKDemo
//
//  Created by 陈汉 on 2022/5/30.
//

#import "ViewController.h"
#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXWXSDK/RXWXSDK.h>
#import <RXUIKit/RXUIKit.h>
#import <WechatOpenSDK/WXApi.h>

@interface ViewController () <RXLoginDelegate>

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    BOOL wx = [WXApi isWXAppInstalled];
    
    
    [RXService sharedSDK].loginDelegate = self;
    
    // 微信登录
    UIButton *btn1 = [[UIButton alloc] initWithFrame:CGRectMake(10, 100, 130, 30)];
    [btn1 setTitle:@"微信登录" forState:UIControlStateNormal];
    [btn1 setBackgroundColor:[UIColor redColor]];
    [btn1 addTarget:self action:@selector(btnAction1) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn1];
    
    // 微信分享
    UIButton *btn2 = [[UIButton alloc] initWithFrame:CGRectMake(150, 100, 130, 30)];
    [btn2 setTitle:@"微信分享" forState:UIControlStateNormal];
    [btn2 setBackgroundColor:[UIColor redColor]];
    [btn2 addTarget:self action:@selector(btnAction2) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn2];
    
    // 打开小程序
    UIButton *btn3 = [[UIButton alloc] initWithFrame:CGRectMake(10, 150, 130, 30)];
    [btn3 setTitle:@"打开小程序" forState:UIControlStateNormal];
    [btn3 setBackgroundColor:[UIColor redColor]];
    [btn3 addTarget:self action:@selector(btnAction3) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn3];
    
    // 游客登录
    UIButton *btn4 = [[UIButton alloc] initWithFrame:CGRectMake(150, 150, 130, 30)];
    [btn4 setTitle:@"游客登录" forState:UIControlStateNormal];
    [btn4 setBackgroundColor:[UIColor redColor]];
    [btn4 addTarget:self action:@selector(btnAction4) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn4];
    
    // 绑定微信
    UIButton *btn5 = [[UIButton alloc] initWithFrame:CGRectMake(290, 100, 130, 30)];
    [btn5 setTitle:@"绑定微信" forState:UIControlStateNormal];
    [btn5 setBackgroundColor:[UIColor redColor]];
    [btn5 addTarget:self action:@selector(btnAction5) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn5];
}

- (void)btnAction5
{
    NSDictionary *ext = @{
        @"method" : @"wechat"
    };
    [[RXService sharedSDK] bindAccountWithExt:ext complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        NSLog(@"");
    }];
}

- (void)btnAction4
{
    [[RXService sharedSDK] loginWithExtDic:nil username:@"chenhan114" password:@"111111a" sign_fields:nil loginType:LoginTypeVisitor migrate_args:nil];
}

- (void)btnAction1
{
//    [[ZaloSDK sharedInstance] initializeWithAppId:@"1290303975374472026"];
//    [[ZaloSDK sharedInstance] authenticateZaloWithAuthenType:ZAZaloSDKAuthenTypeViaZaloAppOnly parentController:self codeChallenge:@"1D6lG8P0R-UfQAg4OkRifnSAvN8hMasMaBTIsg91ErE" extInfo:@{@"appVersion" : @"1.0.0"} handler:^(ZOOauthResponseObject *response) {
//        NSLog(@"");
//    }];
//    [[RXService sharedSDK] loginWithExtDic:nil username:nil password:nil sign_fields:nil loginType:LoginTypeVisitor migrate_args:nil];
    // 捕鱼
//    [[RXWXService sharedSDK] loginReq_wWithWXAppid:@"wx595cc057ae448b00" migrate_args:nil sign_fields:nil];
    // 七夜
//    [[RXWXService sharedSDK] loginReq_wWithWXAppid:@"wx5d34c56f0c58e881" migrate_args:nil sign_fields:nil];
    [[RXService sharedSDK] loginWithLoginType:LoginTypeW username:nil password:nil captchaCode:nil permissions:nil loginOpenId:nil extDic:@{@"appid" : @"wx5d34c56f0c58e881"} signFields:nil migrateArgs:@{@"bind_account" : @(1), @"openid" : @"rxuN0z-pQb9YjbWf4osRWk2ZnSp05vK6Vm5vZokl"} complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
            
    }];
    // guiyangmj
//    [[RXWXService sharedSDK] loginReq_wWithWXAppid:@"wx8755e7b80be19d33" migrate_args:nil sign_fields:nil];
    
    
//    RXLoginUIConfig *config = [[RXLoginUIConfig alloc] init];
//    config.loginTypes = @[@"wechat", @"apple"];
//    config.logoImage = [UIImage imageNamed:@"logoImage"];
//
//    [[RXUIKitService sharedSDK] setLoginViewWithConfig:config loginEvent:^NSDictionary * _Nonnull(NSDictionary *(^)(NSDictionary *loginEvent, LoginType loginType)) {
//        return @{};
//    } complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
//
//    }];
    
//    [[RXUIKitService sharedSDK] setLoginViewWithConfig:config loginEvent:^NSDictionary * _Nonnull(NSDictionary * _Nonnull loginEvent, LoginType loginType) {
//        NSDictionary *loginExt = @{@"wxid" : @"wx5d34c56f0c58e881"};
//        return loginExt;
//    } complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
//        NSLog(@"");
//    }];
}

- (void)btnAction2
{
//    RXShareConfig *config = [[RXShareConfig alloc] init];
//    config.func = @"share_link";
//    config.platform = @"wechat";
//    config.useShortUrl = YES;
//    config.shareScene = 1;
////    config.show_content_in_circle = YES;
//    [[RXShareService sharedSDK] share:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        BOOL ret = NO;
//        if (error == nil) {
//            ret = YES;
//        }
//    }];
//    return;
    
    
//    NSDictionary *dic = @{ @"appid" : @"wx5d34c56f0c58e881",
//                           @"content" : @"手速越快，红包越大！",
//                           @"extData" : @"",
//                           @"image" : @"https://ffintpz.weilekuiming.com/share/2026/6/8/1780899837399.jpg",
//                           @"material_type" : @"link",
//                           @"openId" : @"<null>",
//                           @"path" : @"",
//                           @"platform" : @"wechat",
//                           @"protocol_android" : @"<null>",
//                           @"protocol_ios" : @"<null>",
//                           @"shareScene" : @(1),
//                           @"show_content_in_circle" : @(0),
//                           @"title" : @"红包雨来袭！手慢无~",
//                           @"url" : @"https://jiaxiangfriend.com/landing/local/FuAcTEVAUQhU5fqMYKipsj/1780899784/dist/index.html?identity=Mbp-lQaDR&json_date=2026-06-22&protocol_ios=wlappid1001&protocol_android=weile1001&api=https://sryvxguo.jiaxiangxm.com/&shareStatisticObj=eyJhcHBfaWQiOjEwMDIsImNoYW5uZWxfaWQiOiIxMDEiLCJwcm9kdWN0X2lkIjoxMDAxLCJzaGFyZV91c2VyX2lkIjo5Mjg0MTAzNDcsImdhbWVfaWQiOjAsInJvb21faWQiOjAsIm1hdGVyaWFsX2lkIjoxOTEwLCJtYXRlcmlhbCI6ImxpbmsiLCJzaGFyZV91c2VyX29wZW5faWQiOiIiLCJzaGFyZV91c2VyX3Byb3AiOjEsInNoYXJlX3VzZXJfc291cmNlIjoiIiwic2hhcmVfdmlwX3ZhbHVlIjowLCJzaGFyZV9nX2NvdW50IjoxNiwic2hhcmVfdGltZSI6MTc4MjExMTkwOCwiZnJvbXVuaW9uaWQiOiIiLCJ1c2VsaW1pdCI6MCwibWV0aG9kIjoyLCJ2ZXIiOjEsImJhc2Vfb3BlbmlkIjoiIiwidHlwZSI6InNoYXJlIiwiZnVuYyI6ImpwcV9mcmVlX3NoYXJlMiIsInd4aWQiOiJ3eGUyYzQ1YzZlMDM0ZjRhZjciLCJzdHJhdGVneV9pZCI6NTYxLCJzdHJhdGVneV90eXBlIjoxLCJsYW5kaW5nX2lkIjoyNDMxLCJmdW5jX3R5cGUiOjEsInNoYXJlX3RpbWVfcngiOiIyMDI2LTA2LTIyIDE1OjA1OjA4In0.",
//                           @"use_scheme" : @"<null>",
//                           @"username" : @"<null>",
//                           @"height" : @(100),
//                           @"width" : @(100),
//                           @"withShareTicket" : @(1),
//                           @"x" : @(100),
//                           @"y" : @(100)
//    };
//    RXCustomShareConfig *shareConfig = [[RXCustomShareConfig alloc] init];
//    shareConfig.platform = (NSString*)[dic objectForKey:@"platform"];
//    shareConfig.thirdAppid = (NSString*)[dic objectForKey:@"appid"];
//    shareConfig.iOSScheme = (NSString*)[dic objectForKey:@"protocol_ios"];
//    shareConfig.androidScheme =(NSString*)[dic objectForKey:@"protocol_android"];
//    shareConfig.useScheme = (NSString*)[dic objectForKey:@"use_scheme"];
//    shareConfig.materialType = (NSString*)[dic objectForKey:@"material_type"];
//    shareConfig.image = (NSString*)[dic objectForKey:@"image"];
//    shareConfig.url = (NSString*)[dic objectForKey:@"url"];
//    shareConfig.title = (NSString*)[dic objectForKey:@"title"];
//    shareConfig.content = (NSString*)[dic objectForKey:@"content"];
//    shareConfig.shareScene = [[dic objectForKey:@"shareScene"] intValue];
//    shareConfig.x = [[dic objectForKey:@"x"] intValue];
//    shareConfig.y = [[dic objectForKey:@"y"] intValue];
//    shareConfig.width = [[dic objectForKey:@"width"] intValue];
//    shareConfig.height = [[dic objectForKey:@"height"] intValue];
////    shareConfig.show_content_in_circle = YES;
//    
//    [[RXShareService sharedSDK] shareCustom:shareConfig complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        NSLog(@"");
//    }];
//    return;

//    return;
    NSDictionary *dic = @{
        @"thirdAppid":@"wx5d34c56f0c58e881",
        @"wxid": @"wx5d34c56f0c58e881",
        @"shareScene": @(1),
        @"type": @"image",
        @"materialid": @(14),
        @"material_type": @"link",
        @"image": @"https://oss-anchor-v2.weile.com/share/link_contents/14.png",
        @"webpageUrl": @"http://dl2.jixiang61.cn/fish/jx/1213A/index.html",
        @"url": @"http://s.jixiangweb.com/jixiang/fish/general/index.html?identity=3zUJBR&rtag=20220127B",
        @"title": @"",
        @"description": @"",
        @"qrCodeX": @(50),
        @"qrCodeY": @(50),
        @"qrCodeW": @(100),
        @"qrCodeH": @(100),
        @"ext" : @{@"test" : @"22"},
//        @"protocol_ios": @"111"
    };

    [[RXWXService sharedSDK] shareToWWithShareInfo:dic complete:^(BOOL success) {
        NSLog(@"分享结果:\n %@", success ? @"YES" : @"NO");
        
    }];
//
}

- (void)btnAction3
{
    RXWXBusinessModel *model = [[RXWXBusinessModel alloc] init];
    model.businessType = @"";
    model.query = @"";
    [[RXWXService sharedSDK] openBusinessViewWithModel:model complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
        NSLog(@"");
    }];
    
    return;
    //    原始 ID：gh_491db65a4fa1
    //    AppID：wxb44249b59b3984c4
    //    路径：pages/share_cp_1/index
//    NSDictionary *dic = @{@"username" : @"gh_491db65a4fa1",
//                          @"appid" : @"wx5d34c56f0c58e881",
//                          @"path" : @"pages/share_cp_6/index",
//                          @"miniProgramType" : @(2)
//    };
    
    NSDictionary *dic = @{@"username" : @"gh_bf9cd8cf50b5",
                          @"appid" : @"wx5d34c56f0c58e881",
                          @"path" : @"pages/fromAppPay/index?state=bca7b9ab-f74a-4186-af88-bfdf2323a3fb&customerNo=10089891566&goodsName=831000076&customerRequestNo=2402053225158958v1&orderAmount=0.01&launchSource=MINI_PROGRAM",
                          @"miniProgramType" : @(0)
    };
    [[RXWXService sharedSDK] openMiniProgram:dic complete:^(NSString * _Nonnull extMsg) {
        NSLog(@"");
    }];
}

- (void)rx_LoginCallBackWithResponse:(NSDictionary *)response error:(RX_CommonRequestError *)error
{
    NSLog(@"");
}

@end
