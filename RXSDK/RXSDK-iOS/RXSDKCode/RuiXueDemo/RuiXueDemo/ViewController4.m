//
//  ViewController4.m
//  RuiXueDemo
//
//  Created by root11 on 2024/8/13.
//

#import "ViewController4.h"
#import <RXSDK_Pure/RXSDK_Pure.h>

@interface ViewController4 ()<RXLoginDelegate>

@property (nonatomic, strong) NSArray *titleArray;
@property (nonatomic, strong) UITextView *textView1;
@property (nonatomic, strong) UITextView *textView2;
@property (nonatomic, strong) UITextView *textView3;
@property (nonatomic, strong) UITextField *textField;
@property (nonatomic, copy) NSString *loginOpenid;
@property (nonatomic, copy) NSString *wcode;


@end

@implementation ViewController4

- (void)viewDidLoad {
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor whiteColor];
    UIButton *nextBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    nextBtn.backgroundColor = [UIColor clearColor];
    [nextBtn setTitle:@"下一页" forState:UIControlStateNormal];
    nextBtn.titleLabel.font = [UIFont systemFontOfSize:14];
    [nextBtn setTitleColor:[UIColor blueColor] forState:UIControlStateNormal];
    [nextBtn addTarget:self action:@selector(nextBtnClick) forControlEvents:UIControlEventTouchUpInside];
    self.navigationItem.rightBarButtonItem = [[UIBarButtonItem alloc] initWithCustomView:nextBtn];
    
    self.titleArray = @[@"设置语言",@"自定义errorMsg",@"设置密码错误",@"包含default错误",@"上传SDKGPM",@"114初始化",@"test3登录",@"二次登录",@"获取福利码",@"兑换福利码",@"获取公告列表",@"获取邮件列表",@"获取邮件详情",@"领取道具",@"一键领取道具",@"删除邮件",@"一键删除邮件",@"获取反馈列表",@"反馈详情",@"领取道具",@"我要反馈"];
    [self setupGridButtons];
    [self createTextView];
    [self createTextField];
    [RXService sharedSDK].loginDelegate = self;
    
}

- (void)nextBtnClick{
    
//    [self.navigationController pushViewController:[ViewController4 new] animated:YES];
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

- (void)createTextView{
    CGFloat screenWidth = [UIScreen mainScreen].bounds.size.width;
    CGFloat screenHeight = [UIScreen mainScreen].bounds.size.height;
    self.textView1 = [[UITextView alloc] initWithFrame:CGRectMake(0, screenHeight - 200, 100, 200)];
    self.textView1.editable = NO;
    self.textView1.backgroundColor = [UIColor redColor];
    self.textView1.textColor = [UIColor whiteColor];
    [self.view addSubview:self.textView1];
    
    self.textView2 = [[UITextView alloc] initWithFrame:CGRectMake(110, screenHeight - 200, 100, 200)];
    self.textView2.editable = NO;
    self.textView2.backgroundColor = [UIColor redColor];
    self.textView2.textColor = [UIColor whiteColor];
    [self.view addSubview:self.textView2];
    
    self.textView3 = [[UITextView alloc] initWithFrame:CGRectMake(220, screenHeight - 200, 100, 200)];
    self.textView3.editable = NO;
    self.textView3.backgroundColor = [UIColor redColor];
    self.textView3.textColor = [UIColor whiteColor];
    [self.view addSubview:self.textView3];
}

- (void)createTextField{
    self.textField = [[UITextField alloc] initWithFrame:CGRectMake(0, 400, 300, 30)];
    self.textField.borderStyle = UITextBorderStyleRoundedRect;
    self.textField.placeholder = @"请输入要获取的公告个数";
    self.textField.keyboardType = UIKeyboardTypeNumberPad;
    [self.view addSubview:self.textField];
    
    UIButton *copyBtn = [[UIButton alloc] initWithFrame:CGRectMake(300, 400, 80, 30)];
    copyBtn.backgroundColor = [UIColor redColor];
    copyBtn.titleLabel.textColor = [UIColor whiteColor];
    [copyBtn setTitle:@"复制" forState:UIControlStateNormal];
    [copyBtn addTarget:self action:@selector(copyBtnClick) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:copyBtn];
}

- (void)copyBtnClick{
    [UIPasteboard generalPasteboard].string = self.textView3.text;
}

- (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event{
    [self.textField resignFirstResponder];
}

- (void)buttonTapped:(UIButton *)sender {
    NSInteger tag = sender.tag;
    NSLog(@"Button tag: %ld", (long)tag);
    UIButton *btn = (UIButton *)[self.view viewWithTag:tag];
    NSLog(@"功能:%@", btn.titleLabel.text);
    // 根据 tag 值进行不同的处理
    switch (tag) {
        case 1: {
            [[RXService sharedSDK] setLanguage:@"zh"];
            break;
        }
        case 2: {
            NSMutableDictionary *mDic = [NSMutableDictionary dictionary];
            [mDic setObject:[NSMutableDictionary dictionary] forKey:@"zh"];
            [mDic setObject:[NSMutableDictionary dictionary] forKey:@"tl"];
            [mDic setObject:[NSMutableDictionary dictionary] forKey:@"en"];
            NSMutableDictionary *zhDic = [mDic objectForKey:@"zh"];
            [zhDic setObject:@"测试1" forKey:@"3001"];
            [zhDic setObject:@"测试2" forKey:@"3002"];
            [zhDic setObject:@"测试3 $msg$ $code$ $thirdcode$ $thirdmsg$" forKey:@"3100"];
            [zhDic setObject:@"测试4" forKey:@"3101"];
            [zhDic setObject:@"测试5" forKey:@"3102"];
//            [zhDic setObject:@"测试测试 $code$ $msg$" forKey:@"1100"];
            [zhDic setObject:@"测试66666  $msg$ $code$ $thirdcode$ $thirdmsg$" forKey:@"default"];
            NSMutableDictionary *tlDic = [mDic objectForKey:@"tl"];
            [tlDic setObject:@"哈哈1" forKey:@"3001"];
            [tlDic setObject:@"哈哈2" forKey:@"3002"];
            [tlDic setObject:@"哈哈3" forKey:@"3100"];
            [tlDic setObject:@"哈哈4" forKey:@"3101"];
            [tlDic setObject:@"哈哈5" forKey:@"3102"];
            [tlDic setObject:@"哈哈哈66666" forKey:@"default"];
            NSMutableDictionary *enDic = [mDic objectForKey:@"en"];
            [enDic setObject:@"错误码信息1" forKey:@"3001"];
            [enDic setObject:@"错误码信息2" forKey:@"3002"];
            [enDic setObject:@"错误码信息3" forKey:@"3100"];
            [enDic setObject:@"错误码信息4" forKey:@"3101"];
            [enDic setObject:@"错误码信息5" forKey:@"3102"];
            [enDic setObject:@"默认错误 $code$ $thirdcode$ $thirdmsg$" forKey:@"default"];
            [[RXService sharedSDK] configErrorMsg:mDic];
            break;
        }
        case 3: {
            [[RXApiService sharedSDK] updatePasswordWithOldPwd:@"123" newPwd:@"11" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                            
            }];
            break;
        }
        case 4: {
            [[RXService sharedSDK] initWithProductId:@""
                                           channelId:@""
                                                cpid:@"114"
                                         baseUrlList:@[@""]
                                            complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                if (!error) {
                    NSLog(@"初始化成功");
                } else {
                    NSLog(@"初始化失败");
                }
            }];
            break;
        }
        case 5: {
            [[RXUWAService sharedSDK] configWithReportTime];
            break;
        }
        case 6: {
            __weak typeof(self) weakSelf = self;
            [[RXService sharedSDK] initWithProductId:@"1002"
                                           channelId:@"iOS"
                                                cpid:@"114"
                                         baseUrlList:@[@"http://cn-api-test.ruixuecloud.com/"]
                                            complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                if (!error) {
                    NSLog(@"初始化成功");
                    weakSelf.textView1.text = @"初始化成功";
                } else {
                    NSLog(@"初始化失败");
                    weakSelf.textView1.text = @"初始化失败";
                }
            }];
            break;
        }
        case 7: {
            [[RXService sharedSDK] loginWithExtDic:nil username:@"test3" password:@"111111aA!" sign_fields:nil loginType:LoginTypeVisitor migrate_args:nil];
            break;
        }
        case 8: {
            [[RXService sharedSDK] loginWithLoginOpenId:self.loginOpenid sign_fields:nil extDic:nil];
            break;
        }
        case 9: {
            __weak typeof(self) weakSelf = self;
            [[RXApiService sharedSDK] getPromoDisplayKeyWithAutoRefresh:NO complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                if (error == nil) {
                    NSLog(@"福利码结果：%@", response);
                    weakSelf.wcode = response[@"data"][@"promo_code"];
                    NSData *data = [NSJSONSerialization dataWithJSONObject:response options:NSJSONWritingPrettyPrinted error:nil];
                    weakSelf.textView2.text = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
                }else{
                    NSLog(@"福利码失败结果：%@", error.responesObject);
                    NSData *data = [NSJSONSerialization dataWithJSONObject:error.responesObject options:NSJSONWritingPrettyPrinted error:nil];
                    weakSelf.textView2.text = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
                }
            }];
            break;
        }
        case 10: {
            __weak typeof(self) weakSelf = self;
            [[RXApiService sharedSDK] exchangePromoCDKEY:weakSelf.wcode complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                if (error == nil) {
                    NSLog(@"兑换结果：%@",response);
                    NSData *data = [NSJSONSerialization dataWithJSONObject:response options:NSJSONWritingPrettyPrinted error:nil];
                    weakSelf.textView3.text = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
                }else{
                    NSLog(@"兑换失败：%@",error.responesObject);
                    NSData *data = [NSJSONSerialization dataWithJSONObject:error.responesObject options:NSJSONWritingPrettyPrinted error:nil];
                    weakSelf.textView3.text = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
                }
            }];
            break;
        }
        case 11: {
            __weak typeof(self) weakSelf = self;
            [[RXApiService sharedSDK] getAnnouncementWithLimit:[self.textField.text integerValue] complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                if (error == nil) {
                    NSLog(@"获取公告成功：%@",response);
                    NSData *data = [NSJSONSerialization dataWithJSONObject:response options:NSJSONWritingPrettyPrinted error:nil];
                    weakSelf.textView3.text = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
                }else{
                    NSLog(@"获取公告失败：%@",error.responesObject);
                    NSData *data = [NSJSONSerialization dataWithJSONObject:error.responesObject options:NSJSONWritingPrettyPrinted error:nil];
                    weakSelf.textView3.text = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
                }
            }];
            break;
        }
        case 12: {
//            442132347
            [[RXApiService sharedSDK] getEmailListWithCpUserID:@"442132347" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                if (error == nil) {
                    NSLog(@"%@",response);
                }else{
                    NSLog(@"%@",error.responesObject);
                }
            }];
            break;
        }
        case 13: {
            [[RXApiService sharedSDK] getEmailDetailWithCpUserID:@"442132347" emailID:536 complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                if (error == nil) {
                    NSLog(@"%@",response);
                }else{
                    NSLog(@"%@",error.responesObject);
                }
            }];
            break;;
        }
        case 14: {
            [[RXApiService sharedSDK] receivePropsWithCpUserID:@"442132347" type:1 emailID:536 complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                if (error == nil) {
                    NSLog(@"%@",response);
                }else{
                    NSLog(@"%@",error.responesObject);
                }
            }];
            break;;
        }
        case 15: {
            [[RXApiService sharedSDK] receivePropsWithCpUserID:@"442132347" type:2 emailID:531 complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                if (error == nil) {
                    NSLog(@"%@",response);
                }else{
                    NSLog(@"%@",error.responesObject);
                }
            }];
            break;;
        }
        case 16: {
            [[RXApiService sharedSDK] deleteEmailWithCpUserID:@"442132347" type:1 emailID:536 complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                if (error == nil) {
                    NSLog(@"%@",response);
                }else{
                    NSLog(@"%@",error.responesObject);
                }
            }];
            break;;
        }
        case 17: {
            [[RXApiService sharedSDK] deleteEmailWithCpUserID:@"442132347" type:2 emailID:536 complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                if (error == nil) {
                    NSLog(@"%@",response);
                }else{
                    NSLog(@"%@",error.responesObject);
                }
            }];
            break;;
        }
        case 18: {
            [[RXApiService sharedSDK] getFeedbackListWithPage:1 size:20 status:0 complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                if (!error) {
                    NSLog(@"请求成功：%@",response);
                }else{
                    NSLog(@"请求失败：%@",error.responesObject);
                }
            }];
            break;;
        }
        case 19: {
            [[RXApiService sharedSDK] getFeedbackDetailWithFeedbackID:72 complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                if (!error) {
                    NSLog(@"请求成功：%@",response);
                }else{
                    NSLog(@"请求失败：%@",error.responesObject);
                }
            }];
            break;;
        }
        case 20: {
            [[RXApiService sharedSDK] feedbackGetpropWithFeedbackID:72 complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                if (!error) {
                    NSLog(@"请求成功：%@",response);
                }else{
                    NSLog(@"请求失败：%@",error.responesObject);
                }
            }];
            break;;
        }
        case 21: {
            [[RXApiService sharedSDK] feedbackCreateWithContent:@"111" attachments:@[] phone:@"13233333333" tags:@[] complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                if (!error) {
                    NSLog(@"请求成功：%@",response);
                }else{
                    NSLog(@"请求失败：%@",error.responesObject);
                }
            }];
            break;;
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
        
        self.textView1.text = @"登录成功";
        self.loginOpenid = response[@"data"][@"login_openid"];
        
    } else {
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:error.responesObject options:NSJSONWritingPrettyPrinted error:nil];
        NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        self.textView1.text = @"登录失败:jsonString";
    }
    
}

@end
