//
//  ViewController.m
//  RXGDTSDKDemo
//
//  Created by 陈汉 on 2025/12/1.
//

#import "ViewController.h"
#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXUIKit/RXUIKit.h>
#import <RXGDTSDK/RXGDTSDK.h>

@interface ViewController ()

@property (nonatomic, strong) NSString *loginOpenid;

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    
    self.view.backgroundColor = [UIColor blackColor];
    
    // 登录
    UIButton *btn1 = [[UIButton alloc] initWithFrame:CGRectMake(10, 100, 130, 30)];
    [btn1 setTitle:@"登录" forState:UIControlStateNormal];
    [btn1 setBackgroundColor:[UIColor redColor]];
    [btn1 addTarget:self action:@selector(btnAction1) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn1];
    
    // 二次登录
    UIButton *btn2 = [[UIButton alloc] initWithFrame:CGRectMake(150, 100, 130, 30)];
    [btn2 setTitle:@"二次登录" forState:UIControlStateNormal];
    [btn2 setBackgroundColor:[UIColor redColor]];
    [btn2 addTarget:self action:@selector(btnAction2) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn2];
    
    // 注册
    UIButton *btn3 = [[UIButton alloc] initWithFrame:CGRectMake(290, 100, 130, 30)];
    [btn3 setTitle:@"注册" forState:UIControlStateNormal];
    [btn3 setBackgroundColor:[UIColor redColor]];
    [btn3 addTarget:self action:@selector(btnAction3) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn3];
}

- (void)btnAction1
{
    RXLoginUIModel *model = [[RXLoginUIModel alloc] init];
    model.loginMethods = @[@"captchacode", @"username", @"guest"];
    
    [[RXUIKitService sharedSDK] showLoginViewWithConfig:model complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
        self.loginOpenid = response[@"data"][@"login_openid"];
    }];
}

- (void)btnAction2
{
    [[RXService sharedSDK] loginWithLoginType:LoginTypeVisitor username:nil password:nil captchaCode:nil permissions:nil loginOpenId:self.loginOpenid extDic:nil signFields:nil migrateArgs:nil complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        self.loginOpenid = response[@"data"][@"login_openid"];
    }];
}

- (void)btnAction3
{
    RXGDTService *gdtService = [RXGDTService sharedSDK];
    
    // 需要手动上报时，使用业务后台分配的参数初始化并上报注册、登录事件。
    [gdtService initWithActionSetId:@"your_action_set_id" secretKey:@"your_secret_key"];
    [gdtService reportRegisterActionWithMethod:@"phone" isSuccess:YES];
    [gdtService reportLoginActionWithMethod:@"game_account" isSuccess:YES];
    
    [gdtService reportCreateRoleActionWithRole:@"role_1001"];
    
    [gdtService reportCheckoutActionWithContentType:@"equipment"
                                       contentName:@"starter_pack"
                                         contentID:@"sku_1001"
                                     contentNumber:1
                                 isVirtualCurrency:NO
                               virtualCurrencyType:@"gold"
                                  realCurrencyType:@"CNY"
                                         isSuccess:YES];
    
    [gdtService reportPurchaseActionWithContentType:@"equipment"
                                       contentName:@"starter_pack"
                                         contentID:@"sku_1001"
                                     contentNumber:1
                                    paymentChannel:@"wechat_pay"
                                      realCurrency:@"CNY"
                                    currencyAmount:600
                                         isSuccess:YES];
    
    [gdtService reportFinishQuestActionWithQuestID:@"quest_1001"
                                         questType:@"tutorial"
                                         questName:@"new_player_tutorial"
                                        questNumer:1
                                       description:@"complete_first_battle"
                                         isSuccess:YES];
    
    [gdtService reportShareActionWithChannel:@"wechat" isSuccess:YES];
    [gdtService reportUpgradeLevelActionWithLevel:10];
    [gdtService reportRateActionWithRate:5.0];
    
    [gdtService reportViewContentActionWithContentType:@"equipment"
                                          contentName:@"starter_pack"
                                            contentID:@"sku_1001"];
    
    [gdtService reportAddingToCartActionWithContentType:@"equipment"
                                           contentName:@"starter_pack"
                                             contentID:@"sku_1001"
                                         contentNumber:1
                                             isSuccess:YES];
}

@end
