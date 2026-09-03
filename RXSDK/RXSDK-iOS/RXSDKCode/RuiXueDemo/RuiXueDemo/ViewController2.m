//
//  ViewController2.m
//  RuiXueDemo
//
//  Created by root11 on 2024/5/22.
//

#import "ViewController2.h"
#import <RXSDK_Pure/RXSDK_Pure.h>
#import "ViewController3.h"

@interface ViewController2 ()<RXLoginDelegate>

@property (nonatomic, strong) NSArray *titleArray;

@property (nonatomic, strong) NSString *antiFrom; // 防沉迷开始时间
@property (nonatomic, strong) NSString *antiTo;   // 防沉迷结束时间
@property (nonatomic, strong) NSString *loginOpenid;
@property (nonatomic, strong) NSMutableDictionary *payInfo;

@end

@implementation ViewController2

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
    
    self.titleArray = @[@"初始化1",@"初始化2",@"初始化3",@"初始化4",@"激活用户",@"设置子渠道id",@"登录",@"二次登录",@"苹果登录",@"游客登录",@"获取法务信息",@"设置当前语言",@"自定义请求",@"获取验证码",@"获取验证码新",@"校验验证码",@"校验验证码新",@"绑定邮箱",@"绑定邮箱新",@"解绑邮箱",@"解绑邮箱新",@"绑定手机",@"绑定手机新",@"解绑手机",@"解绑手机新",@"修改手机号",@"修改手机号新",@"获取用户信息",@"修改用户信息",@"修改用户信息新",@"修改密码",@"修改密码新", @"重置密码",@"重置密码新",@"注册用户",@"注册用户新",@"实名认证",@"实名认证新",@"查用户拥有账号",@"媒体自定义上报",@"同步三方授权信息",@"获取设备码",@"获取设备码新",@"刷新token", @"区服查询", @"区服列表查询", @"区服修改", @"创建区服", @"删除区服", @"创建角色", @"修改角色", @"查询角色列表", @"区服角色列表", @"角色信息"];
    [self setupGridButtons];
    
    [RXService sharedSDK].loginDelegate = self;
}

- (void)nextBtnClick{
    
    [self.navigationController pushViewController:[ViewController3 new] animated:YES];
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
        case 1: {//初始化1
            RXSdkInitConfig *config = [[RXSdkInitConfig alloc] init];
            config.productId = @"1002";
            config.channelId = @"iOS";
            config.cpId = @"114";
            config.baseUrlList = @[@"http://cn-api-test.ruixuecloud.com/"];
            config.isUseDNS = YES;
            [[RXService sharedSDK] initWithConfig:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                if (!error) {
                    NSLog(@"初始化成功");
                } else {
                    NSLog(@"初始化失败");
                }
            }];
            break;
        }
        case 2: {//初始化2
            [[RXService sharedSDK] initWithProductId:@"1002"
                                           channelId:@"iOS"
                                                cpid:@"114"
                                         baseUrlList:@[@"http://cn-api-test.ruixuecloud.com/"]
                                            complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                if (!error) {
                    NSLog(@"初始化成功");
                } else {
                    NSLog(@"初始化失败");
                }
            }];
            break;
        }
        case 3: {//初始化3  待后续找到合适的jsonstring再测试
            NSDictionary *dict = [NSDictionary dictionary];
            NSData *jsonData = [NSJSONSerialization dataWithJSONObject:dict options:NSJSONWritingPrettyPrinted error:nil];
        
            NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];

            [[RXService sharedSDK] initWithProfile:jsonString complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                if (!error) {
                    NSLog(@"初始化成功");
                } else {
                    NSLog(@"初始化失败");
                }
            }];
            break;
        }
        case 4: {//初始化4
            [[RXService sharedSDK] setInitParamsWithProductId:@"1002" channelId:@"iOS" cpid:@"114" baseUrlList:@[@"http://cn-api-test.ruixuecloud.com/"] complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                if (!error) {
                    NSLog(@"初始化成功");
                } else {
                    NSLog(@"初始化失败");
                }
            }];
            break;
        }
        case 5: {//激活用户
            [[RXService sharedSDK] requestActivatedWithSourceAd:nil complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                if (!error) {
                    NSLog(@"激活成功");
                }
            }];
            break;
        }
        case 6: {//设置子渠道id
            [[RXService sharedSDK] setSubChannelId:@"123123123"];
            break;
        }
        case 7: {//登录
            [[RXService sharedSDK] loginWithExtDic:nil username:@"test3" password:@"111111aA!" sign_fields:nil loginType:LoginTypeAccount migrate_args:@{@"app_id":@(1002),@"channel_id":@(100)}];
            break;
        }
        case 8: {//@"二次登录"
            [[RXService sharedSDK] loginWithLoginOpenId:self.loginOpenid sign_fields:nil extDic:nil];
            break;
        }
        case 9: {//@"苹果登录" 苹果登录未配置未授权，后续再测试
            [[RXService sharedSDK] loginReq_appleWithMigrate_args:nil sign_fields:nil];
            break;
        }
        case 10: {//@"新登录"
            [[RXService sharedSDK] loginWithLoginType:LoginTypeVisitor username:@"" password:@"" captchaCode:@"" permissions:@[@"profile"] loginOpenId:@"" extDic:nil signFields:nil migrateArgs:nil];
//            [[RXService sharedSDK] loginWithLoginType:LoginTypeVisitor username:@"" password:@"" captchaCode:@"" loginOpenId:@"" extDic:nil signFields:nil migrateArgs:nil];
            break;
        }
        case 11: {//获取法务信息
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
            break;
        }
        case 12: {//设置当前语言
            [[RXService sharedSDK] setLanguage:@"zh"];
            break;
        }
        case 13: {//自定义请求
            NSMutableDictionary *dic = [NSMutableDictionary dictionary];
            [dic setValue:@"https://blog.51cto.com/u_13066/6704306" forKey:@"jump_url"];
            [dic setValue:@"新的手机号。" forKey:@"newphone"];
            [dic setValue:@"新手机号的 bindphone 验证码。" forKey:@"newphone_captcha"];
            [dic setValue:@"账号迁移用的参数, 调用 CP account-query 及 account-queryandbind 接口时透传给 CP." forKey:@"migrate_args"];
            [[RXService sharedSDK] createRequestWithUrl:@"http://rxapi-test.jilinhaiqi.com/v1/url/short" header:nil body:dic method:1 needLogin:YES complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
                    if (!error) {
                        NSLog(@"修改手机号成功:\n %@", response);
                    } else {
                        NSLog(@"修改手机号失败:\n %@", error);
                    }
                }];
            break;
        }
        case 14: {//获取验证码
            [[RXApiService sharedSDK] getCaptchaCodeWithType:CaptchaType_phone target:@"18698646213" purpose:@"register" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                if (!error) {
                    
                }
            }];
            break;
        }
        case 15: {//获取验证码新方法
            [[RXApiService sharedSDK] sendCaptchaWithType:CaptchaType_phone target:@"18698646213" purpose:@"register" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                if (!error) {
                    NSLog(@"%@", response);
                }else{
                    NSLog(@"%@", error.responesObject);
                }
            }];
            break;
        }
        case 16: {//校验验证码
            [[RXApiService sharedSDK] verifyCaptchaCodeWithType:CaptchaType_phone target:@"18698646213" purpose:@"login" captcha_code:@"6213" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                if (!error) {
                    NSLog(@"%@", response);
                } else {
                    NSString *msg = error.responesObject[@"msg"];
                    if ([error.responesObject[@"code"] integerValue] == 1120) {
                        msg = @"网络请求失败，请重试或检查网络设置";
                    }
                    
                }
            }];
            break;
        }
        case 17: {//校验验证码新方法
            [[RXApiService sharedSDK] verifyCaptchaWithType:CaptchaType_phone target:@"18698646213" purpose:@"login" captchaCode:@"6213" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                if (!error) {
                    
                }else{
                    NSString *msg = error.responesObject[@"msg"];
                    if ([error.responesObject[@"code"] integerValue] == 1120) {
                        msg = @"网络请求失败，请重试或检查网络设置";
                    }
                }
            }];
            break;
        }
        case 18: {//绑定邮箱
            [[RXApiService sharedSDK] bindingEmailWithCaptchaCode:@"9938" password:nil email:@"894306571@qq.com" migrate_args:nil complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
            
                }];
            break;
        }
        case 19: {//绑定邮箱新方法
            [[RXApiService sharedSDK] bindEmailWithEmail:@"894306571@qq.com" password:nil captchaCode:@"9938" migrateArgs:nil complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                
            }];
            break;
        }
        case 20: {//解绑邮箱
            [[RXApiService sharedSDK] reliveBindingEmailWithCaptchaCode:@"6813" email:@"894306571@qq.com" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                NSLog(@"");
                
                NSDictionary *errorRes = (NSDictionary *)error.responesObject;
            }];
            break;
        }
        case 21: {//解绑邮箱
            [[RXApiService sharedSDK] unBindEmailWithEmail:@"894306571@qq.com" captchaCode:@"6813" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                
            }];
            break;
        }
        case 22: {//绑定手机
            [[RXApiService sharedSDK] bindingPhoneWithCaptchaCode:@"3702" password:@"111111aA!" phone:@"18698646213" migrate_args:nil complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        
            }];
            break;
        }
        case 23: {//绑定手机新
            [[RXApiService sharedSDK] bindPhoneWithCaptchaCode:@"3702" password:@"111111aA!" phone:@"18698646213" migrateArgs:nil complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                
            }];
            break;
        }
        case 24: {//解绑手机
            [[RXApiService sharedSDK] reliveBindingPhoneWithCaptchaCode:@"0013" phone:@"18698646213" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        
            }];
            break;
        }
        case 25: {//解绑手机新
            [[RXApiService sharedSDK] unBindPhoneWithCaptchaCode:@"0013" phone:@"18698646213" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                            
            }];
            break;
        }
        case 26: {//修改手机号
            [[RXApiService sharedSDK] changePhoneWithOldphone_captcha:@"0013" newphone:@"18698646299" newphone_captcha:@"1111" migrate_args:nil complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                
            }];
            
            break;
        }
        case 27: {//修改手机号新
            [[RXApiService sharedSDK] changePhoneWithOldPhoneCaptcha:@"0013" newphone:@"18698646299" newPhoneCaptcha:@"1111" migrateArgs:nil complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                
            }];
            break;
        }
        case 28: {//获取用户信息
            [[RXApiService sharedSDK] getUserInfoWithComplete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                            
            }];
            break;
        }
        case 29: {//修改用户信息
            [[RXApiService sharedSDK] updateUserInfoWithAvatarUrl:nil nickname:@"dddd" sex:nil w_avatarurl:nil complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                NSString *msg = @"";
                if (!error) {
                    msg = @"修改成功";
                } else {
                    msg = @"修改失败";
                }
        
            }];
            
            break;
        }
        case 30: {//修改用户信息新
            [[RXApiService sharedSDK] updateUserInfo:nil nickname:@"dddd" sex:nil region:nil complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                NSString *msg = @"";
                if (!error) {
                    msg = @"修改成功";
                } else {
                    msg = @"修改失败";
                }
            }];
            break;
        }
        case 31: {//修改密码
            [[RXApiService sharedSDK] updatePasswordWithOldPwd:@"123aA!" newPwd:@"qq123456!" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                    
            }];
            break;
        }
        case 32: {//修改密码新
            [[RXApiService sharedSDK] changePasswordWithNewPwd:@"qq123456!" oldPwd:@"123aA!" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                            
            }];
            break;
        }
        case 33: {//重置密码
            // 先获取验证码
            [[RXApiService sharedSDK] resetPasswordWithUsername:@"18698646213" password:@"111111b@" captchaCode:@"6213" migrate_args:nil complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                NSLog(@"");
            }];
            break;
        }
        case 34: {//重置密码新
            // 先获取验证码
            [[RXApiService sharedSDK] resetPasswordWithUsername:@"18698646213" password:@"111111b@" captchaCode:@"6213" migrateArgs:nil complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                
            }];
            break;
        }
        case 35: {//注册用户
            [[RXApiService sharedSDK] registWithUsername:@"testbbb2"
                                                password:@"111111aA!"
                                             captchaCode:@"6213"
                                                     ext:@{@"nickname" : @"newun",
                                                           @"avatarUrl" : @"https://oss-anchor-v2.weile.com/share/link_contents/13.png",
                                                           @"sex" : @"1"
                                                         }
                                                complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                    
            }];
            break;
        }
        case 36: {//注册用户新
            [[RXApiService sharedSDK] registerWithUsername:@"testbbb2"                                                  password:@"111111aA!"                                              captchaCode:@"6213"                                                           ext:@{@"nickname" : @"newun",
                                                            @"avatarUrl" : @"https://oss-anchor-v2.weile.com/share/link_contents/13.png", @"sex" : @"1"}
                                                complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                            
            }];
            
            break;
        }
        case 37: {//实名认证
            [[RXApiService sharedSDK] approveWithRealName:@"陈汉" idCard:@"220581199403050975" isFastAuth:NO complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                        
            }];
            break;
        }
        case 38: {//实名认证新
            [[RXApiService sharedSDK] realAuthWithRealName:@"陈汉" idCard:@"220581199403050975" isFastAuth:NO complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                
            }];
            break;
        }
        case 39: {//查询用户拥有的账号
            [[RXApiService sharedSDK] searchHasAccountsWithMethod:@"wechat" devicecode:@"" states:@"0" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                
            }];
            break;
        }
        case 40: {//媒体平台自定义上报
            [[RXApiService sharedSDK] addAttributionWithParams:@{@"abc":@"test"} complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                            
            }];
            break;
        }
        case 41: {//同步三方授权信息
            [[RXApiService sharedSDK] syncInfoWithParams:@{@"abc":@"test"} complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                
            }];
            break;
        }
        case 42: {//获取设备码
            NSString *deviceCode = [[RXApiService sharedSDK] getDeviceIDInKeychain];
            break;
        }
        case 43: {//获取设备码新
            NSString *deviceCode = [[RXApiService sharedSDK] getDeviceCode];
            break;
        }
        case 44: {//刷新token
            [[RXApiService sharedSDK] refreshTokenWithComplete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
                
            }];
            break;
        }
        case 45: {//区服查询
            [[RXApiService sharedSDK] searchGameAreaInfoWithAreaId:@"ruixue" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                NSLog(@"");
            }];
            break;
        }
        case 46: {//区服列表查询
            [[RXApiService sharedSDK] searchGameAreaListInfoWithComplete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                NSLog(@"");
            }];
            break;
        }
        case 47: {//区服修改
            [[RXApiService sharedSDK] updateGameAreaInfoWithAreaId:@"ruixue" areaName:@"areaName" areaStatus:@"areaStatus" areaType:@"areaType" extension:nil complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                NSLog(@"");
            }];
            break;
        }
        case 48: {//创建区服
            [[RXApiService sharedSDK] createGameAreaWithAreaId:@"ruixue" areaName:@"areaName" areaStatus:@"areaStatus" areaType:@"areaType" extension:@[] complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                NSLog(@"");
            }];
            break;
        }
        case 49: {//删除区服
            [[RXApiService sharedSDK] deleteGameAreaWithAreaId:@"ruixue" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                NSLog(@"");
            }];
            break;
        }
        case 50: {// 创建角色
            [[RXApiService sharedSDK] createGameCharacterWithAreaId:@"ruixue" characterFaction:@"characterFaction" characterId:@"characterId" characterLevel:@"characterLevel" characterName:@"characterName" characterProfession:@"characterProfession" characterStatus:@"characterStatus" characterType:@"characterType" characterVipLevel:@"characterVipLevel" cpUserId:@"cpUserId" extension:nil complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                NSLog(@"");
            }];
            break;
        }
        case 51: {// 修改角色
            [[RXApiService sharedSDK]  updateGameCharacterInfoWithAreaId:@"ruixue" characterFaction:@"characterFaction" characterId:@"characterId" characterLevel:@"characterLevel" characterName:@"characterName" characterProfession:@"characterProfession" characterStatus:@"characterStatus" characterType:@"characterType" characterVipLevel:@"characterVipLevel" cpUserId:@"cpUserId" extension:nil complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                NSLog(@"");
            }];

            [[RXApiService sharedSDK] deleteGameCharacterWithAreaId:@"ruixue" characterId:@"characterId" cpUserId:@"cpUserId" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                            
            }];
            break;
        }
        case 52: {// 查询区服角色列表
            [[RXApiService sharedSDK]  searchGameCharacterListInAreaWithAreaId:@"ruixue" cpUserId:@"cpUserId" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                NSLog(@"");
            }];
            break;
        }
        case 53: {// 查询角色列表
            [[RXApiService sharedSDK] searchGameCharacterListInfoWithCpUserId:@"" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                NSLog(@"");
            }];
            break;
        }
        case 54: {// 查询角色信息
            [[RXApiService sharedSDK] searchGameCharacterInfoWithAreaId:@"ruixue" cpUserId:@"cpUserId" characterId:@"characterId" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                NSLog(@"");
            }];
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
        self.loginOpenid = response[@"data"][@"login_openid"];
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:response options:NSJSONWritingPrettyPrinted error:nil];
        NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        NSString *log = [[RXLogService sharedSDK] getSDKLog];
        NSLog(@"");
    } else {
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:error.responesObject options:NSJSONWritingPrettyPrinted error:nil];
        NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        NSLog(@"");
    }
    
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


@end
