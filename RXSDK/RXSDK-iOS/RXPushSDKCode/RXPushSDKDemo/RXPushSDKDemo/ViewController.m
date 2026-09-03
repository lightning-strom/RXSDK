//
//  ViewController.m
//  RXPushSDKDemo
//
//  Created by 陈汉 on 2022/2/16.
//

#import "ViewController.h"
#import <RXPushSDK/RXPushSDK.h>
#import <RXSDK_Pure/RXSDK_Pure.h>
#import <Toast/Toast.h>

@interface ViewController () <RXLoginDelegate, UNUserNotificationCenterDelegate>

@property (nonatomic, strong) NSArray *titleArray;

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
//    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(2 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
//        [[RXPushService sharedSDK] initWithProductId:@"263" channelId:@"101" cpid:@"1000038" baseUrlList:@[@"https://rx-api.weileyurtr.com/"]];
//    });
    
//    [[RXService sharedSDK] loginReq_apple];

    [[RXService sharedSDK] loginWithExtDic:nil username:@"" password:@"" sign_fields:nil loginType:LoginTypeVisitor migrate_args:nil];
    [RXService sharedSDK].loginDelegate = self;
    
    [[RXService sharedSDK] setLanguage:@"zh"];
    self.titleArray = @[@"简体中文",@"日语",@"印尼语",@"繁体中文",@"泰文",@"菲律宾语",@"越南语",@"阿拉伯语",@"英语"];
    [self setupGridButtons];
    
    UIButton *btn1 = [[UIButton alloc] initWithFrame:CGRectMake(10, 100, 150, 30)];
    [btn1 setTitle:@"登录/上报token" forState:UIControlStateNormal];
    [btn1 setBackgroundColor:[UIColor redColor]];
    [btn1 addTarget:self action:@selector(loginAndReport) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn1];
    
    // 分享弹框
    /*
    UIButton *btn1 = [[UIButton alloc] initWithFrame:CGRectMake(10, 100, 130, 30)];
    [btn1 setTitle:@"分享弹框" forState:UIControlStateNormal];
    [btn1 setBackgroundColor:[UIColor redColor]];
    [btn1 addTarget:self action:@selector(btnAction1) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn1];
    */
    
//    [[RXPushService sharedSDK] reliveBindingPushDevice];
//    [[RXPushService sharedSDK] initUserNotificationCenter:self];
}

- (void)btnAction1
{
    UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
    [center requestAuthorizationWithOptions:(UNAuthorizationOptionAlert | UNAuthorizationOptionBadge | UNAuthorizationOptionSound) completionHandler:^(BOOL granted, NSError * _Nullable error) {
        if (granted) {
            //点击允许
//                NSLog(@"注册通知成功");
            dispatch_async(dispatch_get_main_queue(), ^{
                [[UIApplication sharedApplication] registerForRemoteNotifications];
                [center getNotificationSettingsWithCompletionHandler:^(UNNotificationSettings * _Nonnull settings) {
                    NSLog(@"%@", settings);
                }];
            });
        } else {
            //点击不允许
            NSLog(@"注册通知失败");
        }
    }];

    [UNUserNotificationCenter currentNotificationCenter].delegate = self;
    
//    [[RXPushService sharedSDK] initWithProductId:@"1002"
//                                       channelId:@"iOS"
//                                            cpid:@"114"
//                                     baseUrlList:@[@"http://cn-api-test.ruixuecloud.com/"]];
//    
//    [[RXPushService sharedSDK] initUserNotificationCenter:self];
//    [[RXShareKitService sharedManger] showShareWithTypes:@[@(RXShareType_sina), @(RXShareType_wfriend), @(RXShareType_qq), @(RXShareType_wcricle)] round:YES clickBlock:^(RXShareType shareType)  {
//        NSLog(@"");
//    }];
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void(^)(void))completionHandler API_AVAILABLE(ios(10.0))
{
    NSLog(@"接受点击事件");
    NSDictionary *userInfo = response.notification.request.content.userInfo;
    
    
    completionHandler();
}


#pragma mark - delegate
/**
 * 登录回调
 * @param response 返回数据，登录失败返回nil
 * @param error 错误返回，登录成功返回nil
 */
- (void)rx_LoginCallBackWithResponse:(NSDictionary * _Nullable)response error:(RX_CommonRequestError *)error{
    NSData *devicetoken = [[NSUserDefaults standardUserDefaults] valueForKey:@"deciceToken"];
    
    NSString *ttt = [self getDeviceToken:devicetoken];
    
    UILabel *v = [[UILabel alloc] initWithFrame:CGRectMake(100, 100, 300, 200)];
    v.text = ttt;
    v.numberOfLines = 0;
    [self.view addSubview:v];
    
    UIPasteboard *pasteboard = [UIPasteboard generalPasteboard];
    pasteboard.string = ttt;
    
    
//    devicetoken = nil;
//    if (error == nil) {
        [[RXPushService sharedSDK] registerDeviceToken:devicetoken complete:^(NSDictionary * _Nonnull response, NSDictionary * _Nonnull error) {
            NSLog(@"");
            if (error == nil) {
                [self.view makeToast:@"上报devicetoken成功"];
            }else{
                [self.view makeToast:@"上报devicetoken失败"];
            }
        }];
//    }else{
//        [self.view makeToast:@"登录失败"];
//    }
}

- (NSString *)getDeviceToken:(NSData *)deviceTokenData
{
    NSString *pushToken=@"";
    if ([[[UIDevice currentDevice] systemVersion] floatValue] >= 13.0) {
        const unsigned *tokenBytes = [deviceTokenData bytes];
        pushToken = [NSString stringWithFormat:@"%08x %08x %08x %08x %08x %08x %08x %08x",
                     ntohl(tokenBytes[0]), ntohl(tokenBytes[1]), ntohl(tokenBytes[2]),
                     ntohl(tokenBytes[3]), ntohl(tokenBytes[4]), ntohl(tokenBytes[5]),
                     ntohl(tokenBytes[6]), ntohl(tokenBytes[7])];
    }
    else{
        pushToken = [NSString stringWithFormat:@"%@", deviceTokenData];
        if (pushToken != nil && pushToken.length> 3) {
            pushToken = [pushToken substringFromIndex:1];
            pushToken = [pushToken substringToIndex:pushToken.length -1];
        }
    }
    return pushToken;
}

- (void)rx_antiCallBackWithResponse:(nonnull NSDictionary *)response error:(nonnull NSError *)error { 
    
}


#pragma mark - UI
- (void)setupGridButtons {
    CGFloat screenWidth = [UIScreen mainScreen].bounds.size.width;
    CGFloat buttonHeight = 30;
    CGFloat buttonSpacing = 10;
    int buttonsPerRow = 3;
    CGFloat buttonWidth = (screenWidth - (buttonsPerRow + 1) * buttonSpacing) / buttonsPerRow;
    // 假设我们需要20个按钮，您可以根据需要调整这个数字
    NSInteger numberOfButtons = [self.titleArray count];
    
    for (int i = 0; i < numberOfButtons; i++) {
        UIButton *button = [UIButton buttonWithType:UIButtonTypeCustom];
        
        // 计算按钮的行和列
        int row = i / buttonsPerRow;
        int col = i % buttonsPerRow;
        
        // 设置按钮的框架
        CGFloat x = buttonSpacing + col * (buttonWidth + buttonSpacing);
        CGFloat y = 130 + buttonSpacing + row * (buttonHeight + buttonSpacing);
        button.frame = CGRectMake(x, y, buttonWidth, buttonHeight);
        
        // 设置按钮的属性
        button.backgroundColor = [UIColor redColor];
        [button setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
        button.titleLabel.font = [UIFont systemFontOfSize:16];
        [button setTitle:self.titleArray[i] forState:UIControlStateNormal];
        
        // 设置按钮的 tag
        button.tag = i + 1;
        
        // 添加点击事件
        [button addTarget:self action:@selector(buttonTapped:) forControlEvents:UIControlEventTouchUpInside];
        
        // 将按钮添加到视图中
        [self.view addSubview:button];
    }
}

- (void)buttonTapped:(UIButton *)sender {
    NSInteger tag = sender.tag;
    UIButton *btn = (UIButton *)[self.view viewWithTag:tag];
    NSLog(@"语言:%@", btn.titleLabel.text);
    switch (tag) {
        case 1:{
            [[RXService sharedSDK] setLanguage:@"zh"];
            break;
        }
        case 2:{
            [[RXService sharedSDK] setLanguage:@"ja"];
            break;
        }
        case 3:{
            [[RXService sharedSDK] setLanguage:@"id"];
            break;
        }
        case 4:{
            [[RXService sharedSDK] setLanguage:@"tc"];
            break;
        }
        case 5:{
            [[RXService sharedSDK] setLanguage:@"th"];
            break;
        }
        case 6:{
            [[RXService sharedSDK] setLanguage:@"tl"];
            break;
        }
        case 7:{
            [[RXService sharedSDK] setLanguage:@"vi"];
            break;
        }
        case 8:{
            [[RXService sharedSDK] setLanguage:@"ar"];
            break;
        }
        case 9:{
            [[RXService sharedSDK] setLanguage:@"en"];
            break;
        }
        default:
            break;
    }
    [self.view makeToast:[NSString stringWithFormat:@"已设置%@",btn.titleLabel.text]];
}

- (void)loginAndReport{
    [[RXService sharedSDK] loginWithExtDic:nil username:@"" password:@"" sign_fields:nil loginType:LoginTypeVisitor migrate_args:nil];
}


@end
