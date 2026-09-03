//
//  ViewController3.m
//  RuiXueDemo
//
//  Created by root11 on 2024/5/22.
//

#import "ViewController3.h"
#import "ViewController4.h"
#import <RXSDK_Pure/RXSDK_Pure.h>

@interface ViewController3 ()

@property (nonatomic, strong) NSArray *titleArray;

@property (nonatomic, strong) NSString *loginOpenid;
@property (nonatomic, strong) NSMutableDictionary *payInfo;


@end

@implementation ViewController3

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
    
    self.titleArray = @[@"版本更新get",@"商业化窗口数据",@"商业化窗口数据block",@"更新商业化窗口数据",@"商业化下单",@"申请注销账号",@"申请注销账号新",@"撤销注销申请",@"撤销注销申请新",@"埋点配置",@"埋点配置新",@"批量上报",@"批量上报新",@"逐条上报",@"设置公共属性",@"修改公共属性",@"删除公共属性",@"获取日志",@"查询商品信息",@"下单支付",@"补单",@"一键分享",@"自定义分享",@"系统分享",@"分享调度初始化",@"获取埋点调度",@"获取分享信息1",@"获取分享信息2",@"获取分享信息3",@"分享上报",@"分享上报新",@"生成短链接",@"获取意见类型",@"创建意见反馈",@"满意度评价",@"上报反馈日志"];
    [self setupGridButtons];
    
//    [RXBusinessService sharedSDK].delegate = self;
}

- (void)nextBtnClick{
    
    [self.navigationController pushViewController:[ViewController4 new] animated:YES];
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
        case 1: {//商业窗口全量数据
//            [[RXBusinessService sharedSDK] getAllBusinessData];
            [[RXUpdateCheckService sharedSDK] checkUpdate_AppWithRegion:@"150000" client_version:@"1.0.1" type:@"js" json:@"{\"type\":\"json\"}" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
            
                }];
            break;
        }
        case 2: {//获取商业化窗口数据
//                [[RXBusinessService sharedSDK] getBusinessDataWithWindow_key:@"balt_hall_jbpj" event:@"se_505001" before_event:@""];
            break;
        }
        case 3: {//获取商业化窗口数据 block
//            [[RXBusinessService sharedSDK] getBusinessDataWithWindow_key:@"sfnj" event:@"qgn" before_event:@"#paid" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//                NSLog(@"%@", response);
//            }];
            break;
        }
        case 4: {//更新商业化窗口数据
//            [[RXBusinessService sharedSDK] refreshBusinessData];
            break;
        }
        case 5: {//商业化下单
//            [[RXBusinessService sharedSDK] requestBusinessOrderWithTrade_no:@"test" sign:@"test" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//                if (!error) {
//                    NSLog(@"%@",response);
//                }else{
//                    NSLog(@"%@",error.responesObject);
//                }
//            }];
            break;
        }
        case 6: {//申请注销账号
            [[RXDestroyAccountService sharedSDK] destroyAccountWithIDCard:@"360402198611133850" realname:@"黄文杰" cpdata:@"{\"uid\":3356802,\"openid\":\"rxuL281WvMzwkoUBNZdSO9gn6_4VPp-o\",\"nick_name\":\"凉凉计时风\",\"sign\":\"7717F2948EC82F0A5DF03FCA24B33D7F\"}" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
            
                }];
            break;
        }
        case 7: {//申请注销账号新
            RXDeregisterConfig *config = [[RXDeregisterConfig alloc] init];
            config.idCard = @"360402198611133850";
            config.realname = @"黄文杰";
            config.cpdata = @"{\"uid\":3356802,\"openid\":\"rxuL281WvMzwkoUBNZdSO9gn6_4VPp-o\",\"nick_name\":\"凉凉计时风\",\"sign\":\"7717F2948EC82F0A5DF03FCA24B33D7F\"}";
            [[RXDestroyAccountService sharedSDK] deregisterWithConfig:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                if (!error) {
                    NSLog(@"%@",response);
                }else{
                    NSLog(@"%@",error.responesObject);
                }
            }];
            break;
        }
        case 8: {//撤销注销申请
            [[RXDestroyAccountService sharedSDK] repealDestroyAccountWithComplete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                NSString *msg;
                if ([response[@"code"] integerValue] == 0) {
                    msg = @"撤销注销成功";
                } else {
                    msg = error.responesObject[@"msg"];
                }
            }];
            break;
        }
        case 9: {//撤销注销申请新
            [[RXDestroyAccountService sharedSDK] deregisterCancelWithComplete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                NSString *msg;
                if ([response[@"code"] integerValue] == 0) {
                    msg = @"撤销注销成功";
                } else {
                    msg = error.responesObject[@"msg"];
                }
            }];
            break;
        }
        case 10: {//埋点配置
            [[RXLogService sharedSDK] configWithReportTime:10 maxCount:3];
            break;
        }
        case 11: {//埋点配置新
            [[RXLogService sharedSDK] trackConfigWithReportTime:5 maxCount:3];
            break;
        }
        case 12: {//批量上报
            NSString *distinctId = [[RXService sharedSDK] getOpenID];
            if (!distinctId || distinctId.length <= 0) {
                distinctId = [[RXLogService sharedSDK] getDistinctId];
            }
            [[RXLogService sharedSDK] addLogWithEvent:@"test1111" distinctId:@"" properties:@{@"public" : @"33"}];
            break;
        }
        case 13: {//批量上报新
            NSString *distinctId = [[RXService sharedSDK] getOpenID];
            if (!distinctId || distinctId.length <= 0) {
                distinctId = [[RXLogService sharedSDK] getDistinctId];
            }
            [[RXLogService sharedSDK] dataTrackWithEvent:@"test1111" distinctId:@"" properties:@{@"public" : @"33"}];
            break;
        }
        case 14: {//逐条上报
            NSString *distinctId = [[RXService sharedSDK] getOpenID];
            if (!distinctId || distinctId.length <= 0) {
                distinctId = [[RXLogService sharedSDK] getDistinctId];
            }
            [[RXLogService sharedSDK] addLogSingleWithEvent:@"testsingle" distinctId:@"" properties:@{@"public" : @"33"}];
            break;
        }
        case 15: {//设置公共属性
            [[RXLogService sharedSDK] setPublicProperties:@{@"public" : @"11"}];
            break;
        }
        case 16: {//修改公共属性
            [[RXLogService sharedSDK] updatePublicProperties:@{@"public":@"33"}];
            break;
        }
        case 17: {//删除公共属性
            [[RXLogService sharedSDK] deletePublicProperties:@[@"public"]];
            break;
        }
        case 18: {//获取日志
            NSString *log = [[RXLogService sharedSDK] getSDKLog];
            NSLog(@"log:%@",log);
            break;
        }
        case 19: {//查询商品
            [[RXIAPService sharedSDK] getProductInfoWithProductIdArr:@[@"com.ruixue.sdk1"] complete:^(NSArray<SKProduct *> *productInfoList) {
                
            }];
            break;
        }
        case 20: {//下单支付
            NSMutableDictionary *dict = [NSMutableDictionary dictionary];
            
            [dict setValue:@"ios_tag" forKey:@"goods_tag"];//商品标签
            [dict setValue:[self getTime] forKey:@"trade_no"];//订单号，此处仅为示例，具体以您的应用侧订单号规则为准
            [dict setValue:@(1) forKey:@"is_debug"];//是否测试订单 默认 0 正式；1 测试订单
            [dict setValue:@(1) forKey:@"env"];//是否使用沙盒环境支付 0 正式；1 测试
            [dict setValue:@"" forKey:@"notify_url"];//支付成功通知CP发货地址，以您的应用侧为准
            [dict setValue:@"" forKey:@"transmit_args"];//客户端透传参数 非必传
            [dict setValue:@(0) forKey:@"indulge_auth"];//是否进行防沉迷验证  0不验证，1验证，默认不验证
            [dict setValue:@{@"cp_game_character_id" : @"123", @"cp_game_area_id" : @"456"} forKey:@"game_info"];
            
            [dict setValue:@"appstore" forKey:@"pay_type"];//支付类型，传错或不支持的类型默认为appstore
            
            [dict setValue:@"CNY" forKey:@"currency"];
//            [dict setValue:@"yeepay" forKey:@"pay_type"];
//            [dict setValue:@{@"pay_type" : @"wechat"} forKey:@"ext"];
            
            [[RXIAPService sharedSDK] requestWithDict:dict completeHandle:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                NSString *str = [NSString stringWithFormat:@"%@", response];
                if(!error){
                    NSLog(@"支付成功");
                }else{
                    NSLog(@"支付失败");
                    str = [NSString stringWithFormat:@"%@", error.responesObject];
                }
            }];
            break;
        }
        case 21: {//补单
            BOOL needRepay = [[RXIAPService sharedSDK] checkHasFailedOrder];
            if(needRepay)
            {
                [[RXIAPService sharedSDK] reFailOrderWithMaxCount:5 complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {

                }];
            }
            break;
        }
        case 22: {//一键分享
            RXShareConfig *config = [[RXShareConfig alloc] init];
//            config.func = @"sdk_chengjiushare";
//            config.platform = @"wechat";
            config.func = @"sunshare2";
            config.platform = @"system";
            [[RXShareService sharedSDK] share:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                BOOL ret = NO;
                if (error == nil) {
                    ret = YES;
                }
                [[RXShareService sharedSDK] shareSchedulingReportWithFunc:@"sdk_chengjiushare" platform:@"wechat" region:@"" transmits:@"" scheduling_event:ret scheduling_type:@"share" properties:nil complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                        
                }];
            }];
            break;
        }
        case 23: {//自定义分享 sunshare2 system ;sdk_chengjiu  wechat
            [[RXShareService sharedSDK] getShareInfoWithFunc:@"sdk_chengjiushare" platform:@"wechat" region:@"" transmits:@"" ext:nil complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                NSString *url = response[@"data"][@"content"][@"url"];
                NSLog(@"contenturl = %@", url);
                
                RXCustomShareConfig *customConfig = [[RXCustomShareConfig alloc] init];
                customConfig.platform = @"wechat";
                customConfig.url = url;
                customConfig.title = @"title";
                customConfig.content = @"content";
                customConfig.materialType = @"link";
                customConfig.shareScene = 1;
                customConfig.thirdAppid = response[@"data"][@"identity"];
                [[RXShareService sharedSDK] shareCustom:customConfig complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                     BOOL ret = NO;
                     if (error == nil) {
                         ret = YES;
                     }
                    [[RXShareService sharedSDK] shareSchedulingReportWithFunc:@"sdk_chengjiu" platform:@"wechat" region:@"" transmits:@"" scheduling_event:ret scheduling_type:@"share" properties:nil complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                            
                    }];
                }];
            }];
            break;
        }
        case 24: {//系统分享
            [[RXShareService sharedSDK] SystemShareWithFunc:@"sunshare2" platform:@"system" region:@"" transmits:@"" ext:nil complete:^(BOOL success) {
                
            }];
            break;
        }
        case 25: {//分享调度初始化
            [[RXShareService sharedSDK] shareSchedulingInitWithFuncs:@[] complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                NSLog(@"");
            }];
            break;
        }
        case 26: {//获取埋点调度
            [[RXShareService sharedSDK] getShareSchedulingWithFuncs:@[] complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                    NSLog(@"");
                }];
            break;
        }
        case 27: {//获取分享信息1
            [[RXShareService sharedSDK] getShareInfoWithFunc:@"maidian" platform:@"wechat" region:@"" transmits:@"" ext:@{@"a":@"b", @"use_scheme" : @"1"} complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                    NSLog(@"");
                }];
            break;
        }
        case 28: {//获取分享信息2  有问题，没有对应的实现
            [[RXShareService sharedSDK] getShareInfoWithFunc:@"youdao" platform:@"wechat" region:@"" transmits:nil ext:@{} readCache:NO complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                    
            }];
            
            break;
        }
        case 29: {//获取分享信息3
            RXShareConfig *config = [[RXShareConfig alloc] init];
            config.func = @"youdao";
            config.platform = @"wechat";
            [[RXShareService sharedSDK] getShareInfoWithConfig:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                            
            }];
            
            break;
        }
        case 30: {//分享上报
            [[RXShareService sharedSDK] shareReportWithDistinctId:@"" properties:nil complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                            
            }];
            break;
        }
        case 31: {//分享上报新
            [[RXShareService sharedSDK] shareSchedulingReportWithFunc:@"youdao" platform:@"wechat" region:@"" transmits:nil scheduling_event:YES scheduling_type:@"share" properties:nil complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                    
            }];
            break;
        }
        case 32: {//生成短链接
            [[RXShareService sharedSDK] getShortUrl:@"https://blog.51cto.com/u_13066/6704306" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                NSLog(@"");
            }];
            break;
        }
        case 33: {//@"获取意见类型"
            [[RXFeedbackService sharedSDK] getFeedbackKindListWithComplete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                NSLog(@"");
            }];
            break;
        }
        case 34: {//@"创建意见反馈"
            NSDictionary *dic = @{
                                  @"game_id": @(1),
                                  @"kind_id": @(1000000012),
                                  @"kind_name": @"土豆土豆",
                                  @"priority": @(1),
                                  @"content": @"我是从接口来的",
                                  @"picture": @"pic1,pic2,pic3",
                                  @"player_gameid": @"123456"
            };
            NSData *jsonData = [NSJSONSerialization dataWithJSONObject:dic options:NSJSONWritingPrettyPrinted error:nil];
        
            NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
            [[RXFeedbackService sharedSDK] createFeedbackWithParams:dic complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                NSLog(@"");
            }];
            break;
        }
        case 35: {//@"满意度评价"
            NSDictionary *dic1 = @{
                      @"key_number": @(10),
                      @"pleased_status": @(1),
                      @"reason": @"good"
                };
            [[RXFeedbackService sharedSDK] satisfactionEvaluationWithParams:dic1 complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                NSLog(@"");
            }];
            break;
        }
        case 36: {//@"上报反馈日志"
            NSData *jsonData = [NSJSONSerialization dataWithJSONObject:@{@"sdk":@"2"} options:NSJSONWritingPrettyPrinted error:nil];
            [[RXFeedbackService sharedSDK] reportFeedbackLogWithData:jsonData complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
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

#pragma mark - 商业化数据回调
- (void)businessCallBackWithResponse:(NSDictionary *)response error:(RX_CommonRequestError *)error
{
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:response options:NSJSONWritingPrettyPrinted error:nil];
    NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
    NSLog(@"获取到的数据商业化数据 = %@", jsonString);
}

#pragma mark - 其他方法
- (NSString *)getTime{
    NSDate* date = [NSDate dateWithTimeIntervalSinceNow:0];
    NSTimeInterval a=[date timeIntervalSince1970]*1000; // *1000 是精确到毫秒，不乘就是精确到秒
    NSString *timeString = [NSString stringWithFormat:@"%.0f", a]; //转为字符型
    return timeString;
}

@end
