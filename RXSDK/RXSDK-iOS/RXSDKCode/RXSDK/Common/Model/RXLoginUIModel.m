//
//  RXLoginUIModel.m
//  RXSDK
//
//  Created by 陈汉 on 2023/12/18.
//

#import "RXLoginUIModel.h"
#import "RXCommonHeader.h"

@implementation RXLoginUIModel

- (instancetype)init
{
    self = [super init];
    if (self) {
        [self fetchConfigParams];
        self.isShowClose = YES;
        self.setQuickButtonBarVisible = YES;
        self.loginViewType = 0;
        self.keyboardType = 1;
//        self.isHistoryViewEnable = YES;
//        self.loginMode = LoginModeNormal;
    }
    return self;
}

- (void)fetchConfigParams
{
    // 初始化下发的登录配置
    NSMutableArray *loginMethods = [RXUserUtility sharedManager].loginMethods;
    
    NSMutableArray *fetchLoginMethods = [NSMutableArray array];
    
    for (int i = 0; i < loginMethods.count; i++) {
        NSDictionary *dic = loginMethods[i];
        NSString *method = dic[@"method"];
        [fetchLoginMethods addObject:dic[@"method"]];
        
        // 一键登录
        if ([method isEqualToString:@"quickphone"]) {
            NSString *quickKey = dic[@"quickphone_key"];
            if ([NSString rx_isNullToString:quickKey].length > 0) {
                self.quickphoneKey = quickKey;
            }
        }
        // 微信登录
        if ([method isEqualToString:@"wechat"]) {
            NSString *appid = dic[@"wx_appid"];
            if ([NSString rx_isNullToString:appid].length > 0) {
                self.wxAppid = appid;
            }
        }
        // google登录
        if ([method isEqualToString:@"google"]) {
            NSString *clientid = dic[@"google_clientid"];
            if ([NSString rx_isNullToString:clientid].length > 0) {
                self.googleClientid = clientid;
            }
        }
    }
    
    self.loginMethods = fetchLoginMethods;
    
    // 是否展示邮箱注册
    self.closeEmailRegister = [RXUserUtility sharedManager].closeEmailRegister;
    
    NSDictionary *channelInfo = [RXUserUtility valueForKey:keyUserData_channel];
    
//     未实名用户登录成功后是否需要强制实名认证，默认强制
    self.needRealAuth = YES;
    self.needRealAuth = [channelInfo[@"ra"][@"of"] boolValue];
    
    // 实名认证是否可关闭
    self.canCloseRealAuth = NO;
    self.canCloseRealAuth = [channelInfo[@"ra"][@"cof"] boolValue];
    
    // 验证码登录的新用户是否弹出设置密码，默认不弹出
    self.setFirstNeedSetPassword = NO;
    self.setFirstNeedSetPassword = [channelInfo[@"sp"][@"of"] boolValue];
    
    // 处于注销中的用户登录后是否显示注销窗口，默认不显示
    self.setDeregisterShow = NO;
    self.setDeregisterShow = [channelInfo[@"dr"][@"of"] boolValue];
    
    // 注销按钮显示 "继续登录" 或 "退出登录"
    NSInteger deregisterType = [channelInfo[@"dr"][@"type"] integerValue];
    self.setLoginContinue = YES;
    switch (deregisterType) {
        case 1:
            self.setLoginContinue = YES;
            break;
        case 2:
            self.setLoginContinue = NO;
            break;
        default:
            break;
    }
}

@end
