//
//  ViewController.m
//  RXFeedbackSDKDemo
//
//  Created by root11 on 2024/10/23.
//

#import "ViewController.h"
//#import <RXUIKit_OS/RXUIKit_OS.h>
#import <RXFeedbackSDK/RXFeedbackSDK.h>
#import <RXUIKit/RXUIKit.h>

@interface ViewController ()

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor whiteColor];
    
    UIButton *btn = [self createBtnWithFrame:CGRectMake(10, 88, 100, 30) backgroundColor:[UIColor redColor] textColor:[UIColor whiteColor] text:@"登录"];
    [btn addTarget:self action:@selector(btnClick) forControlEvents:UIControlEventTouchUpInside];
    
    UIButton *btn1 = [self createBtnWithFrame:CGRectMake(120, 88, 100, 30) backgroundColor:[UIColor redColor] textColor:[UIColor whiteColor] text:@"新增反馈"];
    [btn1 addTarget:self action:@selector(btn1Click) forControlEvents:UIControlEventTouchUpInside];
    
    UIButton *btn2 = [self createBtnWithFrame:CGRectMake(230, 88, 100, 30) backgroundColor:[UIColor redColor] textColor:[UIColor whiteColor] text:@"反馈列表"];
    [btn2 addTarget:self action:@selector(btn2Click) forControlEvents:UIControlEventTouchUpInside];
}

- (UIButton *)createBtnWithFrame:(CGRect)frame backgroundColor:(UIColor *)color textColor:(UIColor *)textColor text:(NSString *)text{
    UIButton *btn = [UIButton buttonWithType:UIButtonTypeCustom];
    [btn setFrame:frame];
    [btn setTitle:text forState:UIControlStateNormal];
    [btn setBackgroundColor:color];
    [btn setTitleColor:textColor forState:UIControlStateNormal];
    [self.view addSubview:btn];
    return btn;
}

- (void)btnClick{
//    RXLoginUIModel *model = [[RXLoginUIModel alloc] init];
//    model.loginMethods = @[@"account",@"username", @"guest", @"google", @"phone", @"facebook", @"snapchat", @"instagram", @"apple"];
//    model.privacieTitles = @[@"用户协议", @"隐私政策"];
//    model.privacies = @[@"https://appstatic.emoney.cn/ymstock/privacy-ymstock/", @"https://appstatic.emoney.cn/ymstock/privacy-ymstock/"];
//    model.setCustomParams = @{@"permissions":@[@"public_profile",@"email"]};
//    
//    [[RXOSUIKitService sharedSDK] showLoginUIWithConfig:model complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
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
    
    RXLoginUIModel *loginConfig = [[RXLoginUIModel alloc] init];
    loginConfig.loginMethods = @[@"guest",@"apple", @"username", @"wechat", @"captchacode", @"quickphone"];
//    loginConfig.loginMethods = @[];
    loginConfig.privacies = @[@"http://rxapi.jilinhaiqi.com/static/landing/#/v1/legal/terms/ccc/jkldajfljalsdfj/00001?lang=zh", @"http://rxapi.jilinhaiqi.com/static/landing/#/v1/legal/terms/ccc/jkldajfljalsdfj/00001?lang=zh"];
    loginConfig.privacieTitles = @[@"用户协议", @"隐私政策"];
//    loginConfig.isAudit = YES;
    loginConfig.loginMode = LoginModeQuick;
    
//    loginConfig.quickphoneKey = @"X5tTAE1YuJP2PNWI1TaBC2ZC+GlKTy14wZudrDChkG3gLBZS8g2Fm8rrkMGKgWHtVVnLhT4sH5GMUMvcpI1cxQCLte9zmqJzMnyfX+T/RfNODf8kherbqlYqvhQ0SlLciehLS8zG+pKiRVKV9n1MR44ktJFNftTP/UKGw0d0Rh83n8M8mtDKIJXgc/UpKnWdhZ5BaXHbUYMMfQRbHdDmPqGSK64RRVS9uWmJ3Btykbdbwj8K7/8A1r4gJtbx8TOK9Jx8P8gbYLs=";
//    loginConfig.setCustomParams = @{@"ext" : @{@"test" : @"1"}};
    
    [[RXUIKitService sharedSDK] showLoginUIWithConfig:loginConfig complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
        NSLog(@"");
    }];
}

- (void)btn1Click{
    [[RXPlayerFeedbackService sharedSDK] showCreateFeedbackView];
}

- (void)btn2Click{
    [[RXPlayerFeedbackService sharedSDK] showFeedbackListView];
}

@end
