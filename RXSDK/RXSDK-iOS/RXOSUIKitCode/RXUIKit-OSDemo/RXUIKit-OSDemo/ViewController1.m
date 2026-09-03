//
//  ViewController1.m
//  RXUIKit-OSDemo
//
//  Created by root11 on 2024/7/29.
//

#import "ViewController1.h"
#import <RXUIKit_OS/RXUIKit_OS.h>
#import <RXSDK_Pure/RXSDK_Pure.h>

@interface ViewController1 ()<RXLoginDelegate>

@property (nonatomic, strong) NSArray *titleArray;

@end

@implementation ViewController1

- (void)viewDidAppear:(BOOL)animated{
    [super viewDidAppear:animated];
    self.navigationController.navigationBarHidden = YES;
}

- (void)viewDidDisappear:(BOOL)animated{
    [super viewDidDisappear:animated];
    self.navigationController.navigationBarHidden = NO;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    
    self.view.backgroundColor = [UIColor whiteColor];
    UIButton *nextBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    nextBtn.backgroundColor = [UIColor clearColor];
    [nextBtn setTitle:@"" forState:UIControlStateNormal];
    nextBtn.titleLabel.font = [UIFont systemFontOfSize:14];
    [nextBtn setTitleColor:[UIColor blueColor] forState:UIControlStateNormal];
    [nextBtn addTarget:self action:@selector(nextBtnClick) forControlEvents:UIControlEventTouchUpInside];
    self.navigationItem.rightBarButtonItem = [[UIBarButtonItem alloc] initWithCustomView:nextBtn];
    
    self.titleArray = @[@"--",@"--",@"切换中文",@"英语",@"日语",@"印尼语",@"繁体中文",@"泰文",@"菲律宾语",@"越南语",@"阿拉伯语",@"多条公告", @"单条公告", @"维护公告1", @"公告1隐藏", @"维护公告2", @"公告2隐藏",@"反馈列表",@"我要反馈"];
    [self setupGridButtons];
    
    [RXService sharedSDK].loginDelegate = self;
}

- (void)nextBtnClick{
    
}

- (void)setupGridButtons {
    CGFloat screenWidth = [UIScreen mainScreen].bounds.size.width;
    CGFloat buttonHeight = 30;
    CGFloat buttonSpacing = 10;
    int buttonsPerRow = 3;
    CGFloat buttonWidth = (screenWidth - (buttonsPerRow + 1) * buttonSpacing) / buttonsPerRow;
    // 假设我们需要20个按钮，您可以根据需要调整这个数字
    int numberOfButtons = [self.titleArray count];
    
    for (int i = 0; i < numberOfButtons; i++) {
        UIButton *button = [UIButton buttonWithType:UIButtonTypeCustom];
        
        // 计算按钮的行和列
        int row = i / buttonsPerRow;
        int col = i % buttonsPerRow;
        
        // 设置按钮的框架
        CGFloat x = buttonSpacing + col * (buttonWidth + buttonSpacing);
        CGFloat y = 88 + buttonSpacing + row * (buttonHeight + buttonSpacing);
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
    NSLog(@"Button tag: %ld", (long)tag);
    UIButton *btn = (UIButton *)[self.view viewWithTag:tag];
    NSLog(@"功能:%@", btn.titleLabel.text);
    // 根据 tag 值进行不同的处理
    switch (tag) {
        case 1: {//初始化
            [[RXService sharedSDK] initWithProductId:@"unity_test"
                                           channelId:@"unity_test"
                                                cpid:@"114"
                                         baseUrlList:@[@"https://cn-api-test.ruixuecloud.com"]
                                            complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                if (!error) {
                    NSLog(@"初始化成功");
                } else {
                    NSLog(@"初始化失败");
                }
            }];
            break;
        }
        case 2: {
            RXLoginUIModel *model = [[RXLoginUIModel alloc] init];
            model.loginMethods = @[@"username", @"guest", @"google", @"phone", @"facebook", @"snapchat", @"instagram", @"apple"];
            model.privacieTitles = @[@"用户协议", @"隐私政策"];
            model.privacies = @[@"https://appstatic.emoney.cn/ymstock/privacy-ymstock/", @"https://appstatic.emoney.cn/ymstock/privacy-ymstock/"];
            model.setCustomParams = @{@"permissions":@[@"public_profile",@"email"]};
            
            [[RXOSUIKitService sharedSDK] showLoginUIWithConfig:model complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
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
            break;
        }
        case 3: {
            [[RXService sharedSDK] setLanguage:@"zh"];
            break;
        }
        case 4: {
            [[RXService sharedSDK] setLanguage:@"en"];
            break;
        }
        case 5: {
            [[RXService sharedSDK] setLanguage:@"ja"];
            break;
        }
        case 6: {
            [[RXService sharedSDK] setLanguage:@"id"];
            break;
        }
        case 7: {
            [[RXService sharedSDK] setLanguage:@"tc"];
            break;
        }
        case 8: {
            [[RXService sharedSDK] setLanguage:@"th"];
            break;
        }
        case 9: {
            [[RXService sharedSDK] setLanguage:@"tl"];
            break;
        }
        case 10: {
            [[RXService sharedSDK] setLanguage:@"vi"];
            break;
        }
        case 11: {
            [[RXService sharedSDK] setLanguage:@"ar"];
            break;
        }
        case 12: {
            [[RXOSUIKitService sharedSDK] showEmailViewWithCpUserId:@"442099939" withComplete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
                
            }];
//            [[RXOSUIKitService sharedSDK] showAnnounceViewWithLimit:100 linkCallBack:^(NSString * _Nonnull link) {
//                
//            } isHasCallBack:^(BOOL isHas) {
//                
//            }];
            break;
        }
        case 13: {
            [[RXOSUIKitService sharedSDK] showAnnounceViewWithLimit:1 linkCallBack:^(NSString * _Nonnull link) {
                
            } isHasCallBack:^(BOOL isHas) {
                
            }];
            break;
        }
        case 14: {
            [[RXUpdateCheckService sharedSDK] checkUpdate_AppWithRegion:@"150000" client_version:@"1.0.1" games:nil activities:nil type:@"js" json:@"{\"type\":\"json\"}" isShow:YES linkCallBack:^(NSString * _Nonnull link) {
                
            } complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                
            }];
            break;
        }
        case 15: {
            [[RXUpdateCheckService sharedSDK] checkUpdate_AppWithRegion:@"150000" client_version:@"1.0.1" games:nil activities:nil type:@"js" json:@"{\"type\":\"json\"}" isShow:NO linkCallBack:^(NSString * _Nonnull link) {
                
            } complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                
            }];
            break;
        }
        case 16: {
            [[RXUpdateCheckService sharedSDK] checkUpdate_AppWithRegion:@"150000" client_version:@"1.0.1" games:nil activities:nil type:@"js" json:@"{\"type\":\"json\"}" isShow:YES linkCallBack:^(NSString * _Nonnull link) {
                
            } complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                
            }];
            break;
        }
        case 17: {
            [[RXUpdateCheckService sharedSDK] checkUpdate_AppWithRegion:@"150000" client_version:@"1.0.1" games:nil activities:nil type:@"js" json:@"{\"type\":\"json\"}" isShow:NO linkCallBack:^(NSString * _Nonnull link) {
                
            } complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                
            }];
            break;
        }
        case 18: {
//            [[RXOSUIKitService sharedSDK] showFeedbackListView];
            break;
        }
        case 19:{
//            [[RXOSUIKitService sharedSDK] showCreateFeedbackView];
            break;
        }
        default: {
            NSLog(@"Button %ld action", (long)tag);
            break;
        }
    }
}

#pragma mark -- <登录回调>
- (void)rx_LoginCallBackWithResponse:(NSDictionary *)response error:(RX_CommonRequestError *)error
{
    if (!error) {
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:response options:NSJSONWritingPrettyPrinted error:nil];
        NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        NSString *log = [[RXLogService sharedSDK] getSDKLog];
        NSLog(@"登录成功:%@",jsonString);
    } else {
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:error.responesObject options:NSJSONWritingPrettyPrinted error:nil];
        NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        NSLog(@"登录失败：%@",jsonString);
    }
    
}


@end
