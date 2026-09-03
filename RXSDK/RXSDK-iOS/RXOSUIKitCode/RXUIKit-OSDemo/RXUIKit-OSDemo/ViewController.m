//
//  ViewController.m
//  RXUIKit-OSDemo
//
//  Created by 陈汉 on 2023/6/15.
//

#import "ViewController.h"
#import <RXUIKit_OS/RXUIKit_OS.h>
//#import <RXUIKit/RXUIKit.h>
#import <RXSDK_Pure/RXSDK_Pure.h>
//#import <RXFacebookSDK/RXFacebookSDK.h>
//#import "GTLRYouTube.h"
#import "ConfigController.h"
#import "ViewController1.h"

@interface ViewController () <RXOSUILoginDelegate, RXLoginDelegate, UIDocumentInteractionControllerDelegate>
@property (nonatomic, strong) UIDocumentInteractionController * documentInteractionController;
@property (nonatomic, strong) UITextField *tf;
@property (nonatomic, strong) UIButton *unBindingBtn;
//@property (nonatomic, strong) GTLRYouTubeService *service;
@property (nonatomic, strong) UIScrollView *scrollView;
@property (nonatomic, strong) NSString *loginOpenid;
@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    
    
//    [SKStoreReviewController requestReview];

    
    self.view.backgroundColor = [UIColor whiteColor];
    
    [self setUI];
    
//    [RXOSUIKitService sharedSDK].loginDelegate = self;
//    [RXService sharedSDK].loginDelegate = self;
    
    [[RXOSUIKitService sharedSDK] closeLoginView];
    
    UIViewController *vc = [self currentViewController];
    NSLog(@"");
//    [[RXService sharedSDK] loginWithExtDic:nil username:@"vip002" password:@"123456" sign_fields:nil loginType:LoginTypeVisitor migrate_args:nil]; 
}

- (void)setUI
{
    self.scrollView = [[UIScrollView alloc] initWithFrame:CGRectMake(0, 0, [UIScreen mainScreen].bounds.size.width, [UIScreen mainScreen].bounds.size.height)];
    self.scrollView.contentSize = CGSizeMake([UIScreen mainScreen].bounds.size.width, 1000);
    [self.view addSubview:self.scrollView];
    
    // 实名认证
    UIButton *btn1 = [[UIButton alloc] initWithFrame:CGRectMake(10, 100, 130, 30)];
    [btn1 setTitle:@"实名认证" forState:UIControlStateNormal];
    [btn1 setBackgroundColor:[UIColor redColor]];
    [btn1 addTarget:self action:@selector(btnAction1) forControlEvents:UIControlEventTouchUpInside];
    [self.scrollView addSubview:btn1];
    
    // 防沉迷
    UIButton *btn2 = [[UIButton alloc] initWithFrame:CGRectMake(150, 100, 130, 30)];
    [btn2 setTitle:@"防沉迷" forState:UIControlStateNormal];
    [btn2 setBackgroundColor:[UIColor redColor]];
    [btn2 addTarget:self action:@selector(btnAction2) forControlEvents:UIControlEventTouchUpInside];
    [self.scrollView addSubview:btn2];
    
    // 权限
    UIButton *btn3 = [[UIButton alloc] initWithFrame:CGRectMake(10, 150, 130, 30)];
    [btn3 setTitle:@"权限" forState:UIControlStateNormal];
    [btn3 setBackgroundColor:[UIColor redColor]];
    [btn3 addTarget:self action:@selector(btnAction3) forControlEvents:UIControlEventTouchUpInside];
    [self.scrollView addSubview:btn3];
    
    // 切换屏幕方向
    UIButton *btn4 = [[UIButton alloc] initWithFrame:CGRectMake(290, 100, 130, 30)];
    [btn4 setTitle:@"切换屏幕方向" forState:UIControlStateNormal];
    [btn4 setBackgroundColor:[UIColor redColor]];
    [btn4 addTarget:self action:@selector(btnAction4) forControlEvents:UIControlEventTouchUpInside];
    [self.scrollView addSubview:btn4];
    
    // 单条协议
    UIButton *btn5 = [[UIButton alloc] initWithFrame:CGRectMake(10, 200, 130, 30)];
    [btn5 setTitle:@"单条协议" forState:UIControlStateNormal];
    [btn5 setBackgroundColor:[UIColor redColor]];
    [btn5 addTarget:self action:@selector(btnAction5) forControlEvents:UIControlEventTouchUpInside];
    [self.scrollView addSubview:btn5];
    
    // 获取法务信息
    UIButton *btn6 = [[UIButton alloc] initWithFrame:CGRectMake(10, 250, 130, 30)];
    [btn6 setTitle:@"获取法务信息" forState:UIControlStateNormal];
    [btn6 setBackgroundColor:[UIColor redColor]];
    [btn6 addTarget:self action:@selector(btnAction6) forControlEvents:UIControlEventTouchUpInside];
    [self.scrollView addSubview:btn6];
    
    // 声明
    UIButton *btn7 = [[UIButton alloc] initWithFrame:CGRectMake(290, 200, 130, 30)];
    [btn7 setTitle:@"声明" forState:UIControlStateNormal];
    [btn7 setBackgroundColor:[UIColor redColor]];
    [btn7 addTarget:self action:@selector(btnAction7) forControlEvents:UIControlEventTouchUpInside];
    [self.scrollView addSubview:btn7];
    
    // 登录
    UIButton *btn10 = [[UIButton alloc] initWithFrame:CGRectMake(150, 150, 130, 30)];
    [btn10 setTitle:@"登录" forState:UIControlStateNormal];
    [btn10 setBackgroundColor:[UIColor redColor]];
    [btn10 addTarget:self action:@selector(btnAction10) forControlEvents:UIControlEventTouchUpInside];
    [self.scrollView addSubview:btn10];
    
    // 找回密码
    UIButton *btn11 = [[UIButton alloc] initWithFrame:CGRectMake(150, 200, 130, 30)];
    [btn11 setTitle:@"找回密码" forState:UIControlStateNormal];
    [btn11 setBackgroundColor:[UIColor redColor]];
    [btn11 addTarget:self action:@selector(btnAction11) forControlEvents:UIControlEventTouchUpInside];
    [self.scrollView addSubview:btn11];
    
    // 用户中心
    UIButton *btn12 = [[UIButton alloc] initWithFrame:CGRectMake(150, 250, 130, 30)];
    [btn12 setTitle:@"用户中心" forState:UIControlStateNormal];
    [btn12 setBackgroundColor:[UIColor redColor]];
    [btn12 addTarget:self action:@selector(btnAction12) forControlEvents:UIControlEventTouchUpInside];
    [self.scrollView addSubview:btn12];
    
    // 撤销注销
    UIButton *btn13 = [[UIButton alloc] initWithFrame:CGRectMake(290, 250, 130, 30)];
    [btn13 setTitle:@"撤销注销" forState:UIControlStateNormal];
    [btn13 setBackgroundColor:[UIColor redColor]];
    [btn13 addTarget:self action:@selector(btnAction13) forControlEvents:UIControlEventTouchUpInside];
    [self.scrollView addSubview:btn13];
    
    // 设置密码
    UIButton *btn14 = [[UIButton alloc] initWithFrame:CGRectMake(10, 300, 130, 30)];
    [btn14 setTitle:@"设置密码" forState:UIControlStateNormal];
    [btn14 setBackgroundColor:[UIColor redColor]];
    [btn14 addTarget:self action:@selector(btnAction14) forControlEvents:UIControlEventTouchUpInside];
    [self.scrollView addSubview:btn14];
    
    // 解绑手机
    UIButton *btn15 = [[UIButton alloc] initWithFrame:CGRectMake(150, 300, 130, 30)];
    [btn15 setTitle:@"解绑手机" forState:UIControlStateNormal];
    [btn15 setBackgroundColor:[UIColor redColor]];
    [btn15 addTarget:self action:@selector(btnAction15) forControlEvents:UIControlEventTouchUpInside];
    [self.scrollView addSubview:btn15];
    
    // 客服中心
    UIButton *btn16 = [[UIButton alloc] initWithFrame:CGRectMake(290, 300, 130, 30)];
    [btn16 setTitle:@"客服中心" forState:UIControlStateNormal];
    [btn16 setBackgroundColor:[UIColor redColor]];
    [btn16 addTarget:self action:@selector(btnAction16) forControlEvents:UIControlEventTouchUpInside];
    [self.scrollView addSubview:btn16];
    
    // apple pay
    UIButton *btn17 = [[UIButton alloc] initWithFrame:CGRectMake(10, 350, 130, 30)];
    [btn17 setTitle:@"apple pay" forState:UIControlStateNormal];
    [btn17 setBackgroundColor:[UIColor redColor]];
    [btn17 addTarget:self action:@selector(btnAction17) forControlEvents:UIControlEventTouchUpInside];
    [self.scrollView addSubview:btn17];
    
    // 切换客服主题
    UIButton *btn18 = [[UIButton alloc] initWithFrame:CGRectMake(10, 350, 130, 30)];
    [btn18 setTitle:@"切换客服主题" forState:UIControlStateNormal];
    [btn18 setBackgroundColor:[UIColor redColor]];
    [btn18 addTarget:self action:@selector(btnAction18) forControlEvents:UIControlEventTouchUpInside];
//    [self.scrollView addSubview:btn18];
    
    // 申请注销
    UIButton *btn19 = [[UIButton alloc] initWithFrame:CGRectMake(150, 350, 130, 30)];
    [btn19 setTitle:@"申请注销" forState:UIControlStateNormal];
    [btn19 setBackgroundColor:[UIColor redColor]];
    [btn19 addTarget:self action:@selector(btnAction19) forControlEvents:UIControlEventTouchUpInside];
    [self.scrollView addSubview:btn19];
    
    UIButton *bindPhoneBtn = [[UIButton alloc] initWithFrame:CGRectMake(10, 390, 130, 30)];
    [bindPhoneBtn setTitle:@"绑定手机" forState:UIControlStateNormal];
    [bindPhoneBtn setBackgroundColor:[UIColor redColor]];
    [bindPhoneBtn addTarget:self action:@selector(bindPhoneBtnAction) forControlEvents:UIControlEventTouchUpInside];
    [self.scrollView addSubview:bindPhoneBtn];
    
    UIButton *bindAccountBtn = [[UIButton alloc] initWithFrame:CGRectMake(150, 390, 130, 30)];
    [bindAccountBtn setTitle:@"绑定账号" forState:UIControlStateNormal];
    [bindAccountBtn setBackgroundColor:[UIColor redColor]];
    [bindAccountBtn addTarget:self action:@selector(bindAccountBtnAction) forControlEvents:UIControlEventTouchUpInside];
    [self.scrollView addSubview:bindAccountBtn];
    
    // 切换配置
    UIButton *change = [[UIButton alloc] initWithFrame:CGRectMake(10, 650, 130, 30)];
    [change setTitle:@"切换配置" forState:UIControlStateNormal];
    [change setBackgroundColor:[UIColor redColor]];
    [change addTarget:self action:@selector(changeBtnAction) forControlEvents:UIControlEventTouchUpInside];
    [self.scrollView addSubview:change];
    
    UIButton *nextBtn = [[UIButton alloc] initWithFrame:CGRectMake(10, 610, 130, 30)];
    [nextBtn setTitle:@"下一页" forState:UIControlStateNormal];
    [nextBtn setBackgroundColor:[UIColor redColor]];
    [nextBtn addTarget:self action:@selector(nextBtnAction) forControlEvents:UIControlEventTouchUpInside];
    [self.scrollView addSubview:nextBtn];
    
//    NSMutableArray *privacies = [NSMutableArray arrayWithArray:@[@"2", @"3", @"4", @"5"]];
//    if (privacies.count > 3) {
//        [privacies removeObjectsInRange:NSMakeRange(3, privacies.count - 3)];
//    }
//    NSLog(@"");
    
    [[NSUserDefaults standardUserDefaults] setValue:@"light" forKey:@"theme"];
    
//    [[RXService sharedSDK] setLanguage:@"zh"];
    
    [[RXService sharedSDK] setGameInfoWithRoleId:@"111" regionTag:@"default"];
}

- (void)bindAccountBtnAction
{
    NSDictionary *dic = @{
        @"method" : @"facebook"
    };
    [[RXService sharedSDK] bindAccountWithExt:dic complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        NSLog(@"");
    }];
}

- (void)shareText:(NSString*)text
{
    NSString *contentKey = (__bridge NSString *)CFURLCreateStringByAddingPercentEscapes(NULL,
                                                                                     
                                                                                     (CFStringRef)text,
                                                                                     
                                                                                     NULL,
                                                                                     
                                                                                     (CFStringRef)@"!*'();:@&=+$,/?%#[]",
                                                                                     
                                                                                     kCFStringEncodingUTF8);
    
    NSString*contentType =@"image";
    
    NSString*urlString = [NSString stringWithFormat:@"line://msg/%@/%@",
                          
                          contentType, contentKey];
    
    [[UIApplication sharedApplication] openURL:[NSURL URLWithString:urlString]];
    
}

- (void)changeBtnAction
{
    [self.navigationController pushViewController:[ConfigController new] animated:YES];
}

- (void)nextBtnAction{
    [self.navigationController pushViewController:[ViewController1 new] animated:YES];
}

- (void)btnAction19
{
    [[RXOSUIKitService sharedSDK] applyForDeregisterWithConfig:nil complete:^(NSDictionary * _Nonnull response) {
            
    }];
}

- (void)btnAction18
{
    NSString *theme = [[NSUserDefaults standardUserDefaults] valueForKey:@"theme"];
    if ([theme isEqualToString:@"light"]) {
        [[NSUserDefaults standardUserDefaults] setValue:@"dark" forKey:@"theme"];
    } else {
        [[NSUserDefaults standardUserDefaults] setValue:@"light" forKey:@"theme"];
    }
    
    UIAlertController *alertController = [UIAlertController alertControllerWithTitle:nil message:theme preferredStyle:UIAlertControllerStyleAlert];
    UIAlertAction *cancelAction = [UIAlertAction actionWithTitle:@"OK" style:UIAlertActionStyleCancel handler:nil];
    [alertController addAction:cancelAction];
    
    [self.navigationController presentViewController:alertController animated:YES completion:nil];

}

- (void)btnAction17
{
    NSMutableDictionary *dict = [NSMutableDictionary dictionary];
//    [dict setValue:@"iap7" forKey:@"goods_tag"]; // 商品标签
//    [dict setValue:@"830001008" forKey:@"goods_tag"]; // 商品标签
//    [dict setValue:@(20) forKey:@"age"]; // 用户年龄,indulge_auth为1时必传该字段
    
    [dict setValue:@"ios_tag" forKey:@"goods_tag"]; // 商品标签
//    [dict setValue:@"rxpayid1" forKey:@"goods_tag"]; // 商品标签
    [dict setValue:[self getTime] forKey:@"trade_no"]; // 订单号
    [dict setValue:@(1) forKey:@"is_debug"]; // 是否测试订单 默认 0 正式  1 为测试订单
    [dict setValue:@(1) forKey:@"env"]; // 是否使用沙盒环境支付 0 正式  1 沙盒
    [dict setValue:@"CNY" forKey:@"currency"]; // 币种 默认传: CNY
    [dict setValue:@{} forKey:@"ext"]; // 支付扩展字段 三方支付额外传递参数 详见下面具体渠道
    [dict setValue:@"" forKey:@"notify_url"]; // 支付成功通知CP发货地址
    [dict setValue:@"" forKey:@"transmit_args"]; // 客户端透传参数 非必传
    [dict setValue:@(0) forKey:@"indulge_auth"]; // 是否进行防沉迷验证  0不验证，1验证，默认不验证
    
//    [dict setValue:@"ios_tag" forKey:@"goods_tag"]; // 商品标签
//    [dict setValue:@"110109783300000" forKey:@"trade_no"]; // 订单号
//    [dict setValue:@(1) forKey:@"is_debug"]; // 是否测试订单 默认 0 正式  1 为测试订单
//    [dict setValue:@(1) forKey:@"env"]; // 是否使用沙盒环境支付 0 正式  1 沙盒
//    [dict setValue:@"USD" forKey:@"currency"]; // 币种 默认传: CNY
//    [dict setValue:@{} forKey:@"ext"]; // 支付扩展字段 三方支付额外传递参数 详见下面具体渠道
//    [dict setValue:@"" forKey:@"notify_url"]; // 支付成功通知CP发货地址
//    [dict setValue:@{@"pay_type" : @"apple", @"user_id" : @"110109749800000"} forKey:@"transmit_args"]; // 客户端透传参数 非必传
//    [dict setValue:@(1) forKey:@"indulge_auth"]; // 是否进行防沉迷验证  0不验证，1验证，默认不验证
    
    NSLog(@"%@",dict);
    
//    [[RXPayService sharedSDK] setOpenStoreKit2:YES];
    
    [[RXIAPService sharedSDK] requestWithDict:dict completeHandle:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        
        [[RXLogService sharedSDK] configWithReportTime:10 maxCount:10];
        [[RXLogService sharedSDK] addLogWithEvent:@"test" distinctId:@"" properties:nil];
        
        if(!error){
            NSLog(@"支付成功");
        }else{
            NSLog(@"支付失败");
        }
    }];
}

- (void)btnAction16
{
    RXOSUserCenterConfig *config = [[RXOSUserCenterConfig alloc] init];
    config.transmit_args = @"test";
    config.game_user_id = @"1188368";
    config.nickname = @"肖战迷弟";
    config.queue_name = @"肖战迷弟";
    config.head_img_url = @"头像地址";
    config.setSyncInfoEnable = YES;
    
    [[RXOSUIKitService sharedSDK] serviceCenterWithConfig:config complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {

    }];
    

//    [[RXOSUIKitService sharedSDK] chatServiceWithConfig:config complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
//
//    }];
}

- (void)btnAction15
{
    [[RXApiService sharedSDK] getCaptchaCodeWithType:CaptchaType_phone target:@"13522804593" purpose:@"unbindphone" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        self.tf = [[UITextField alloc] initWithFrame:CGRectMake(200, 100, 100, 40)];
        self.tf.backgroundColor = [UIColor yellowColor];
        [[UIApplication sharedApplication].keyWindow addSubview:self.tf];

        self.unBindingBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        self.unBindingBtn.frame = CGRectMake(300, 100, 50, 40);
        [self.unBindingBtn setBackgroundColor:[UIColor yellowColor]];
        [self.unBindingBtn setTitle:@"解绑" forState:UIControlStateNormal];
        [self.unBindingBtn setTitleColor:[UIColor redColor] forState:UIControlStateNormal];
        [self.unBindingBtn addTarget:self action:@selector(unBindingAction) forControlEvents:UIControlEventTouchUpInside];
        [[UIApplication sharedApplication].keyWindow addSubview:self.unBindingBtn];
    }];
}

- (void)unBindingAction
{
    
//    [[RXApiService sharedSDK] bindingPhoneWithCaptchaCode:@"" password:@"" phone:@"13522804593" migrate_args:nil complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//
//    }];
    
    [[RXApiService sharedSDK] reliveBindingPhoneWithCaptchaCode:self.tf.text phone:@"13522804593" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
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
    [[RXOSUIKitService sharedSDK] setPasswordWithComplete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
        NSLog(@"");
    }];
}

- (void)btnAction13
{
    [[RXOSUIKitService sharedSDK] destroyAccountStatusUIWithBtnTitle:@"123" complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
        NSLog(@"");
    }];
    
    
    
//    [[RXOSUIKitService sharedSDK] destroyAccountStatusViewWithDeregisterType:@"123" complete:^(DestroyClickType clickType) {
//        NSLog(@"");
//    }];
//    [[RXOSUIKitService sharedSDK] destroyAccountStatusView:^(DestroyClickType clickType) {
//        
//    }];
//    [[RXOSUIKitService sharedSDK] applyForDeregisterWithConfig:nil complete:^(NSDictionary * _Nonnull response) {
//            
//    }];
}

- (void)btnAction12
{
//    RXOSUILoginConfig *config1 = [[RXOSUILoginConfig alloc] init];
//    config1.logoImage = [UIImage imageNamed:@"passlogo"];
    
    RXOSUserCenterConfig *config = [[RXOSUserCenterConfig alloc] init];
    config.setSyncInfoEnable = YES;
    config.logoImage = [UIImage imageNamed:@"passlogo"];
//    NSArray *bntsArray = @[@"real_name"];
//    NSDictionary *setConfigParams = @{@"btns": bntsArray};
//    config.setConfigParams = setConfigParams;
    config.openWebViewLog = YES;
    
    [[RXOSUIKitService sharedSDK] userCenterWithConfig:config complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
        NSLog(@"");
    }];
    
//    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(3 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
//        [[RXOSUIKitService sharedSDK] closeUserCenter];
//    });
}

- (void)btnAction11
{
//    [[RXOSUIKitService sharedSDK] setRealauthViewWithCanClose:NO complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
//
//    }];
    
//    self.loginOpenid = [[NSUserDefaults standardUserDefaults] valueForKey:@"loginopenid"];
//    [[RXService sharedSDK] loginWithLoginOpenId:self.loginOpenid sign_fields:nil extDic:nil];
//    return;
    
//    NSDictionary *dic = @{@"username" : @"18698646213",
//                          @"account_type" : @(2),
//                          @"password_hint" : @"请输入",};
    [[RXOSUIKitService sharedSDK] getBackPasswordWithParams:nil requestParams:^NSMutableDictionary * _Nonnull(NSMutableDictionary * _Nonnull params) {
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
//    [[RXService sharedSDK] loginWithExtDic:nil username:nil password:nil sign_fields:nil loginType:LoginTypeVisitor migrate_args:nil];
//    return;
    
//    [[RXService sharedSDK] setLanguage:@"zh"];
    
//    RXLoginUIModel *model = [[RXLoginUIModel alloc] init];
//    model.loginMethods = @[@"username", @"guest", @"google", @"phone", @"facebook", @"snapchat", @"instagram", @"apple"];
//    model.privacieTitles = @[@"用户协议", @"隐私政策"];
//    model.privacies = @[@"https://appstatic.emoney.cn/ymstock/privacy-ymstock/", @"https://appstatic.emoney.cn/ymstock/privacy-ymstock/"];
//    model.setCustomParams = @{@"permissions":@[@"public_profile",@"email"]};
    
    RXOSUILoginConfig *config = [[RXOSUILoginConfig alloc] init];
    config.loginTypes = @[@"username", @"guest", @"captchacode", @"phone", @"facebook", @"google"];
//    config.loginTypes = @[@"guest", @"apple", @"facebook", @"google"];
//    config.logoImage = [UIImage imageNamed:@"passlogo"];
    config.loginViewType = 1;
//    config.isAudit = YES;
    config.privacieTitles = @[@"用户协议", @"隐私政策"];
    config.privacies = @[@"https://appstatic.emoney.cn/ymstock/privacy-ymstock/", @"https://appstatic.emoney.cn/ymstock/privacy-ymstock/"];
    config.keyboardType = 3;
    config.needRealAuth = NO;
    config.needSetPassword = YES;
//    config.language_default = @"ja";
    config.isShowDeregister = YES;
    config.realAuthRegion = @"vn";
    config.isShowClose = YES;
    config.loginViewType = 1;
//    config.setShowPrivacy = NO;
//    config.isQuickButtonBarVisible = NO;
//    [[RXService sharedSDK] setLanguage:@"en"];
    config.setCustomExt = @{@"bigdata_ext" : @{@"a" : @"b"}};
    
    [[RXOSUIKitService sharedSDK] setLoginViewWithConfig:config complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
        if (!error) {
            NSData *data = [NSJSONSerialization dataWithJSONObject:response options:NSJSONWritingPrettyPrinted error:nil];
            NSString *dicStr = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
            NSLog(@"收到回调11111111111111");
        }else{
            NSData *data = [NSJSONSerialization dataWithJSONObject:error.responesObject options:NSJSONWritingPrettyPrinted error:nil];
            NSString *dicStr = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
            NSLog(@"%@",dicStr);
        }
    }];
    
    return;
    
//    [[RXOSUIKitService sharedSDK] setLoginViewWithConfig:config loginEvent:^NSDictionary * _Nonnull(NSDictionary * _Nonnull loginEvent, LoginType loginType) {
//        NSMutableDictionary *loginExt = [NSMutableDictionary dictionary];
//        switch (loginType) {
//            case LoginTypeW:
//                [loginExt setValue:@"wx5d34c56f0c58e881" forKey:@"appid"];
//                break;
//            case LoginTypeAuth:
//                [loginExt setValue:@"LpVkmU/Q/njQJWx9oB49wvnoU0IodcCAQy1RiHQ7LfL6ULeQUAct69QqlM26Xyw2QBYsIwr1Nk35aE+wE/pGjHClpxerHknOtW6ggie8ah/hU0GzV22Or3SVhRiWT23f+rI8Lg91AH/Zaios8dOgRHPKpYHtF5bnMFO/FecsUZwsixdbryeb6DT0ynKvrMggB8aykmkD+75EUhI6SDPEY9dj2gyCicQTC4f2mV26W9rXRW+7TBmms+yozWs0q4iw+piTJv69O4M=" forKey:@"appid"];
//                break;
//            case LoginTypeCapCode:
//                [loginExt setValue:@{} forKey:@"ext"];
//                break;
//            case LoginTypeGoogle:
//                [loginExt setValue:@"875255664003-eorr371qavp578ro0beafnfudr4upf1c.apps.googleusercontent.com" forKey:@"appid"];
//                break;
//            case LoginTypeFacebook:
//                [loginExt setValue:@[@"public_profile",@"email"] forKey:@"permissions"];
//                break;
//            case LoginTypeLine:
//                [loginExt setValue:@[@"profile"] forKey:@"permissions"];
//                break;
//            default:
//                break;
//        }
//        return loginExt;
//    } complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
//        if (!error) {
//            NSData *data = [NSJSONSerialization dataWithJSONObject:response options:NSJSONWritingPrettyPrinted error:nil];
//            NSString *dicStr = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
//            NSLog(@"收到回调11111111111111");
//        }else{
//            NSData *data = [NSJSONSerialization dataWithJSONObject:error.responesObject options:NSJSONWritingPrettyPrinted error:nil];
//            NSString *dicStr = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
//            NSLog(@"%@",dicStr);
//        }
//    }];
}

- (void)bindPhoneBtnAction{
    [[RXOSUIKitService sharedSDK] bindEmailWithComplete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
        if (error) {
            NSLog(@"绑定失败:%@",error.responesObject[@"msg"]);
        }else{
            NSLog(@"绑定成功：%@",response);
//            {
//                code = 0;
//                ext =     {
//                    email = "2051991872@qq.com";
//                };
//                type = "binding_email";
//            }
        }
    }];
    return;
    [[RXOSUIKitService sharedSDK] bindPhoneWithComplete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
        if (error) {
            NSLog(@"绑定失败:%@",error.responesObject[@"msg"]);
        }else{
            NSLog(@"绑定成功：%@",response);
        }
    }];
}

#pragma mark -- <登录回调>
//- (void)rxu_LoginCallBackWithResponse:(NSDictionary *)response error:(RX_CommonRequestError *)error
//{
//    NSLog(@"收到回调11111111111111");
//    if (!error) {
//
//        [[RXService sharedSDK] getLegalInfo:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
//            NSLog(@"");
//        }];
//
//    } else {
//    }
//}
//
//- (void)rx_LoginCallBackWithResponse:(NSDictionary *)response error:(RX_CommonRequestError *)error
//{
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
////        UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"登录成功" message:jsonString preferredStyle:UIAlertControllerStyleAlert];
////        [alert addAction:[UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
////
////        }]];
////
////        [self presentViewController:alert animated:YES completion:NULL];
//        
//    } else {
//        // 服务端返回错误
//        NSDictionary *errorRes = error.responesObject;
//        NSString *errorMsg = errorRes[@"msg"];
//        NSInteger errorCode = [errorRes[@"code"] integerValue];
//        NSLog(@"登录失败");
//    }
//}

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
    
//    [[RXOSUIKitService sharedSDK] setRealauthViewWithCanClose:YES
//                                                  complete:^(NSDictionary * _Nonnull backData, RX_CommonRequestError * _Nonnull error) {
//        NSLog(@"");
//    }];
    
    [[RXOSUIKitService sharedSDK] setRealauthViewH5WithRegion:@"VN" canClose:YES complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
        NSLog(@"");
    }];
}

- (void)btnAction2
{
    [[RXOSUIKitService sharedSDK] setAntiAdditionViewWithTitle:@"提示" des:@"根据国家最新法规规定，未进行实名认证的用户不能体验任何游戏内容，请尽快完成实名。当前账号未进行实名认证，游戏累计时间超过1小时将强制下线休息，且无法进行充值操作。请合理安排游戏时间，做适当的身体活动。" btnTitle:@"test" complete:^{

    }];
}

- (void)btnAction3
{
    // @[@"phone", camera]
    // 取配置接口下的permission list key
//    [[RXOSUIKitService sharedSDK] setLimitViewWithKeys:@[@"phone", @"locate", @"call", @"camera"] clickBlock:^(NSInteger status) {
//
//    }];
//    [[RXOSUIKitService sharedSDK] bindingPhoneWithComplete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
//
//    }];
//    [[RXOSUIKitService sharedSDK] destroyAccountStatusView];
}

- (void)btnAction4
{
    BOOL rota = [[NSUserDefaults standardUserDefaults] boolForKey:@"rotation"];
    [[NSUserDefaults standardUserDefaults] setBool:!rota forKey:@"rotation"];
    exit(0);
}

- (void)btnAction5
{
    [[RXOSUIKitService sharedSDK] setPrivacyWithComplete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
            
    }];
    
    
//    [[RXOSUIKitService sharedSDK] setProtocolViewWithKey:@"00006" complete:^(BOOL isAgree) {
//
//    }];
}

- (void)btnAction6
{
//    GTLRYouTubeQuery_ChannelsList *query =
//    [GTLRYouTubeQuery_ChannelsList queryWithPart:@[@"snippet", @"statistics"]];
//    query.identifier = @[@"UC_x5XG1OV2P6uZZ5FSM9Ttw"];
//    // To retrieve data for the current user's channel, comment out the previous
//    // line (query.identifier ...) and uncomment the next line (query.mine ...).
//    // query.mine = true;
//    
//    [self.service executeQuery:query
//                      delegate:self
//             didFinishSelector:@selector(displayResultWithTicket:finishedWithObject:error:)];
    
//    [[RXService sharedSDK] getLegalInfo:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
//
//    // 权限弹框
//    }];
}

// Process the response and display output
//- (void)displayResultWithTicket:(GTLRServiceTicket *)ticket
//             finishedWithObject:(GTLRYouTube_ChannelListResponse *)channels
//                          error:(NSError *)error {
//  if (error == nil) {
//    NSMutableString *output = [[NSMutableString alloc] init];
//    if (channels.items.count > 0) {
//      [output appendString:@"Channel information:\n"];
//      for (GTLRYouTube_Channel *channel in channels) {
//        NSString *title = channel.snippet.title;
//        NSString *description = channel.snippet.description;
//        NSNumber *viewCount = channel.statistics.viewCount;
//        [output appendFormat:@"Title: %@\nDescription: %@\nViewCount: %@\n", title, description, viewCount];
//      }
//    } else {
//      [output appendString:@"Channel not found."];
//    }
////    self.output.text = output;
//  } else {
////    [self showAlert:@"Error" message:error.localizedDescription];
//  }
//}

- (void)btnAction7
{
//    [[RXService sharedSDK] getLegalInfo:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
//
//        [[RXOSUIKitService sharedSDK] setPrivacyViewWithKey:@"00001" legalData:response];
//    }];
    
    [[RXOSUIKitService sharedSDK] setProtocolViewWithKey:@"00001" keyList:@[@"00001"]];
}

- (void)rxu_registerCallBackWithResponse:(NSDictionary *)response error:(RX_CommonRequestError *)error
{
    if (!error) {
        NSLog(@"注册成功");
    } else {
        NSLog(@"注册失败");
    }
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

@end
