//
//  RXLoginViewManager.m
//  RXUIKit
//
//  Created by 陈汉 on 2023/3/15.
//

#import "RXLoginViewManager.h"
#import <RXWXSDK/RXWXSDK.h>
#import "RXUIAuthLoginView.h"
#import "RXLoginView.h"
#import "RXLoginUIConfig.h"
#import "RXApproveView.h"
#import "RXSetPasswordView.h"
#import <RXSDK_Pure/RXErrorTool.h>
#import <RXSDK_Pure/RX_CommonNetworkExcute.h>
#import "RXDestroyAccountView.h"
#import "RXUIKitService.h"
#import "RXHistoryLoginView.h"

//@interface RXLoginViewManager () <RXLoginDelegate>
@interface RXLoginViewManager ()

@property (nonatomic, copy) LoginManagerComplete loginManagerComplete;
@property (nonatomic, assign) long loginType;
@property (nonatomic, strong) NSDictionary *loginInfo;
@property (nonatomic, strong) NSDictionary *notiDic; // 登录的通知数据
@property (nonatomic, assign) BOOL isUIRequest;
@property (nonatomic, assign) BOOL isLoginFail;
@property (nonatomic, assign) BOOL isQuickLogin;
@property (nonatomic, strong) NSString *loginMethod;

@end

@implementation RXLoginViewManager

static RXLoginViewManager *sharedSDK = nil;
static dispatch_once_t onceToken;

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXLoginViewManager alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
//        [RXService sharedSDK].loginDelegate = self;
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(loginCallBack:) name:@"noti_rxUILogin" object:nil];
    }
    return self;
}

- (void)fetchLoginEvent:(LoginType)loginType
              loginInfo:(NSDictionary *)loginInfo
               complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    if (!self.isQuickLogin) {
        [RXHUD showHUD];
    }
    
    self.loginManagerComplete = complete;
    self.loginType = (long)loginType;
    self.isUIRequest = YES;
    
    self.loginMethod = [RXUICommonTool toMethodStr:self.loginType];
    
    [RX_CommonNetworkExcute shareInstance].subVersion = [NSString stringWithFormat:@"RXUIKit-v%@", [RXUICommonTool getVersion]];
    
    switch (loginType) {
        case LoginTypeApple:
        {
            [[RXService sharedSDK] loginWithExtDic:[NSMutableDictionary dictionaryWithDictionary:loginInfo[@"ext"]] username:loginInfo[@"username"] password:loginInfo[@"password"] sign_fields:loginInfo[@"sign_fields"] loginType:LoginTypeApple migrate_args:loginInfo[@"migrate_args"]];
            break;
        }
        case LoginTypeW:
        {
            [RXUIUserUtility saveWXAppid:loginInfo[@"appid"]];
            BOOL iswx = [[RXWXService sharedSDK] isWXAppInstalled];
            if (!iswx) {
                [RXHUD showErrorText:@"未安装微信"];
                return;
            }
            [[RXWXService sharedSDK] loginReq_wWithWXAppid:loginInfo[@"appid"] migrate_args:loginInfo[@"migrate_args"] sign_fields:loginInfo[@"sign_fields"]];
            break;
        }
        case LoginTypeVisitor:
        {
            [[RXService sharedSDK] loginWithExtDic:[NSMutableDictionary dictionaryWithDictionary:loginInfo[@"ext"]] username:loginInfo[@"username"] password:loginInfo[@"password"] sign_fields:loginInfo[@"sign_fields"] loginType:LoginTypeVisitor migrate_args:loginInfo[@"migrate_args"]];
            break;
        }
        case LoginTypeAccount:
        {
            [[RXService sharedSDK] loginWithExtDic:[NSMutableDictionary dictionaryWithDictionary:loginInfo[@"ext"]] username:loginInfo[@"username"] password:loginInfo[@"password"] sign_fields:loginInfo[@"sign_fields"] loginType:LoginTypeAccount migrate_args:loginInfo[@"migrate_args"]];
            break;
        }
        case LoginTypeCapCode:
        {
            [[RXService sharedSDK] loginWithExtDic:[NSMutableDictionary dictionaryWithDictionary:loginInfo[@"ext"]] username:loginInfo[@"username"] password:loginInfo[@"password"] sign_fields:loginInfo[@"sign_fields"] loginType:LoginTypeCapCode migrate_args:loginInfo[@"migrate_args"]];
            break;
        }
        case LoginTypeAuth:
        {
            if ([loginInfo[@"isFirst"] isEqualToString:@"1"]) {
                NSMutableDictionary *extDic = [NSMutableDictionary dictionaryWithDictionary:loginInfo[@"ext"]];
                [extDic setValue:loginInfo[@"token"] forKey:@"access_token"];
                [[RXService sharedSDK] loginWithExtDic:extDic username:loginInfo[@"username"] password:loginInfo[@"password"] sign_fields:loginInfo[@"sign_fields"] loginType:LoginTypeAuth migrate_args:loginInfo[@"migrate_args"]];
            } else {
                RXUIAuthLoginView *authLoginView = [[RXUIAuthLoginView alloc] initWithConfig:[RXUIUserUtility sharedManager].loginConfig authKey:loginInfo[@"appid"] loginEvent:loginInfo complete:^(NSString * _Nonnull token) {
                    NSMutableDictionary *extDic = [NSMutableDictionary dictionaryWithDictionary:loginInfo[@"ext"]];
                    [extDic setValue:token forKey:@"access_token"];
                    [[RXService sharedSDK] loginWithExtDic:extDic username:loginInfo[@"username"] password:loginInfo[@"password"] sign_fields:loginInfo[@"sign_fields"] loginType:LoginTypeAuth migrate_args:loginInfo[@"migrate_args"]];
                }];
                authLoginView.loginComplete = complete;
            }
            
            break;
        }
        default:
            break;
    }
}

- (void)loginWithLoginType:(long)loginType
                 loginInfo:(NSDictionary *)loginInfo
                  complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    [RX_CommonNetworkExcute shareInstance].subVersion = [NSString stringWithFormat:@"RXUIKit-v%@", [RXUICommonTool getVersion]];
    [RXHUD showHUD];
    self.loginType = (long)loginType;
    self.loginManagerComplete = complete;
    self.loginInfo = loginInfo;
    self.isUIRequest = YES;
    self.loginMethod = [RXUICommonTool toMethodStr:self.loginType];
    
    NSMutableDictionary *extDic = [NSMutableDictionary dictionaryWithDictionary:loginInfo[@"ext"]];
    [extDic setValue:[RXUICommonTool toMethodStr:self.loginType] forKey:@"method"];
    
    [[RXService sharedSDK] loginWithLoginOpenId:loginInfo[@"login_openid"] sign_fields:loginInfo[@"sign_fields"] extDic:extDic];
//    [[RXService sharedSDK] loginWithLoginOpenId:@"" sign_fields:loginInfo[@"sign_fields"] extDic:loginInfo[@"sign_fields"]];
}

- (void)loginWithconfig:(RXLoginUIConfig *)config
               complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    self.isQuickLogin = YES;
    self.loginType = [RXUICommonTool toLoginType:config.method];
    [RX_CommonNetworkExcute shareInstance].subVersion = [NSString stringWithFormat:@"RXUIKit-v%@", [RXUICommonTool getVersion]];
//    [RXHUD showHUD];
    self.loginManagerComplete = complete;
    self.isUIRequest = YES;
    self.loginMethod = [RXUICommonTool toMethodStr:self.loginType];
    
    NSMutableDictionary *extDic = [NSMutableDictionary dictionaryWithDictionary:config.setCustomParams];
    [extDic setValue:config.method forKey:@"method"];
    
    [[RXService sharedSDK] loginWithLoginOpenId:config.loginOpenid sign_fields:config.signFields extDic:extDic];
//    [[RXService sharedSDK] loginWithLoginOpenId:@"" sign_fields:loginInfo[@"sign_fields"] extDic:loginInfo[@"sign_fields"]];
}

- (void)loginCallBack:(NSNotification *)noti
{
    NSLog(@"登录回调");
    if (!self.isUIRequest) {
        [RXHUD hideHUD];
        NSMutableDictionary *notiDic = [NSMutableDictionary dictionaryWithDictionary:noti.userInfo];
        NSDictionary *loginModel = notiDic[@"loginData"];
        NSDictionary *loginData = loginModel[@"data"];
        
        if ([loginModel[@"code"] integerValue] == 0) {
            [RXUIUserUtility sharedManager].apiLoginData = [NSMutableDictionary dictionaryWithDictionary:loginData];
            [RXUIUserUtility sharedManager].loginData = nil;
        }
        
        NSMutableArray *accounts = [NSMutableArray arrayWithArray:[RXUIUserUtility sharedManager].accounts];
        
        if (accounts.count > 0) {
            
            RXLoginUIConfig *config = [RXUIUserUtility sharedManager].loginConfig;

            if (!self.loginType && [[NSUserDefaults standardUserDefaults] valueForKey:keyUserData_methodenum]) {
                self.loginType = [[[NSUserDefaults standardUserDefaults] valueForKey:keyUserData_methodenum] longValue];
            }
            
            if (config.loginMode == LoginModeQuick) {
                self.loginType = [[[NSUserDefaults standardUserDefaults] valueForKey:keyUserData_methodenum] longValue];
            }

            NSDictionary *accessDic = loginData[@"data"][@"access"];
            
            for (int i = 0; i < accounts.count; i++) {
                NSMutableDictionary *userInfo_old = [NSMutableDictionary dictionaryWithDictionary:accounts[i]];
                /**
                 * 更新用户信息
                 */
                if (self.loginType == [userInfo_old[@"loginType"] longValue]) {
                    if ([loginData[@"openid"] isEqualToString:userInfo_old[@"openid"]]) {
                        [userInfo_old setValue:loginData[@"login_openid"] forKey:@"login_openid"];
                        [accounts removeObjectAtIndex:i];
                        [accounts insertObject:userInfo_old atIndex:0];
                    }
                }
            }
 
        }
        
        [RXUIUserUtility saveAccounts:accounts];
        
        return;
    }
    
    self.isUIRequest = NO;
        
    NSMutableDictionary *notiDic = [NSMutableDictionary dictionaryWithDictionary:noti.userInfo];
    
    NSMutableDictionary *loginModel = [NSMutableDictionary dictionaryWithDictionary:notiDic[@"loginData"]];
    NSInteger code = [loginModel[@"code"] integerValue];
    
    if ([RXUIUserUtility sharedManager].isNewLogin) {
        if (code == 302203 || code == 302204) {
            RXLoginUIModel *loginUIModel = [RXUIUserUtility sharedManager].loginUIModel;
            loginUIModel.loginOpenid = @"";
            loginUIModel.method = @"";
            [[RXUIKitService sharedSDK] showLoginUIWithConfig:loginUIModel complete:[RXUIUserUtility sharedManager].loginComplete];
            return;
        }
    }
    
    if (loginModel && code == 0) {
        self.isQuickLogin = NO;
        [[NSNotificationCenter defaultCenter] postNotificationName:RXUINoti_closeAuthView object:nil userInfo:nil];
        
        NSMutableDictionary *loginData = [NSMutableDictionary dictionaryWithDictionary:loginModel[@"data"]];
    
        NSMutableDictionary *userInfo = [NSMutableDictionary dictionary];
        [userInfo setValue:@(self.loginType) forKey:@"loginType"];
        [userInfo setValue:loginData[@"openid"] forKey:@"openid"];
        [userInfo setValue:loginData[@"login_openid"] forKey:@"login_openid"];
        [userInfo setValue:loginData[@"cp_user_id"] forKey:@"cp_user_id"];
        
        if (self.loginType == 0) {
            NSString *guestTitle = [RXUIUserUtility sharedManager].loginConfig.guestTitle.length > 0 ? [RXUIUserUtility sharedManager].loginConfig.guestTitle : @"快速开始账号";
            [userInfo setValue:guestTitle forKey:@"nickname"];
        } else if (self.loginType == 1 || self.loginType == 2 || self.loginType == 10) {
            // 账号、邮箱、验证码类型 nickname 保存手机号或邮箱
            [userInfo setValue:[RXUIUserUtility sharedManager].username forKey:@"nickname"];
        } else if (self.loginType == 3) {
            [userInfo setValue:loginData[@"username"] forKey:@"nickname"];
//            [[NSNotificationCenter defaultCenter] postNotificationName:RXUINoti_closeAuthView object:nil userInfo:nil];
        }
        else {
            [userInfo setValue:loginData[@"nickname"] forKey:@"nickname"];
        }
        
        [userInfo setValue:loginData[@"nickname"] forKey:@"cpNickname"];
        
        [userInfo setValue:[RXUIUserUtility sharedManager].username forKey:@"username"];
        
        if ([RXUIUserUtility sharedManager].password && [RXUIUserUtility sharedManager].password.length > 0) {
            [userInfo setValue:[RXUIUserUtility sharedManager].password forKey:@"password"];
        }
        
        NSMutableArray *accounts = [NSMutableArray arrayWithArray:[RXUIUserUtility sharedManager].accounts];
        
        if (accounts.count > 0) {
            BOOL needRemove = NO;
            NSInteger removeIndex = 0;
            for (int i = 0; i < accounts.count; i++) {
                NSMutableDictionary *userInfo_old = accounts[i];
                /**
                 * 相同登录方式进行同openid去重，并移到数组第一位
                 * 不同登录方式相同openid保留
                 */
                if (self.loginType == [userInfo_old[@"loginType"] longValue]) {
                    NSString *oldOpenid = userInfo[@"oldopenid"];
                    if ([userInfo[@"openid"] isEqualToString:userInfo_old[@"openid"]]) {
                        needRemove = YES;
                        removeIndex = i;
                        
                        if (self.loginType == 1 || self.loginType == 10) {
                            [userInfo setValue:userInfo_old[@"username"] forKey:@"username"];
                        }
                        if (self.loginType == 1) {
                            [userInfo setValue:userInfo_old[@"password"] forKey:@"password"];
                        }
                        
                    } else if ([userInfo_old[@"sync"] integerValue] == 1 && [userInfo[@"username"] isEqualToString:userInfo_old[@"username"]]) {
                        needRemove = YES;
                        removeIndex = i;
                        
                        if (self.loginType == 1 || self.loginType == 10) {
                            [userInfo setValue:userInfo_old[@"username"] forKey:@"username"];
                        }
                        if (self.loginType == 1) {
                            [userInfo setValue:userInfo_old[@"password"] forKey:@"password"];
                        }
                    } else {
                        if (oldOpenid.length > 0 && [oldOpenid isEqualToString:userInfo_old[@"openid"]]) {
                            needRemove = YES;
                            removeIndex = i;
                        }
                    }
                }
//                else {
//                    [accounts insertObject:userInfo atIndex:0];
//                    break;
//                }
            }
            if (needRemove) {
                [accounts removeObjectAtIndex:removeIndex];
                [accounts insertObject:userInfo atIndex:0];
            } else {
                [accounts insertObject:userInfo atIndex:0];
            }
        } else {
            [accounts addObject:userInfo];
        }
        
        
        if (self.loginType == 1 || self.loginType == 10) {
            [loginData setValue:userInfo[@"username"] forKey:@"username"];
        }
        if (self.loginType == 1) {
            [loginData setValue:@"username" forKey:@"method"];
            
            NSMutableDictionary *accountInfo = [NSMutableDictionary dictionary];
            [accountInfo setValue:userInfo[@"username"] forKey:@"username"];
            [accountInfo setValue:userInfo[@"password"] forKey:@"password"];
            
            [loginData setValue:accountInfo forKey:@"account"];
        } else if (self.loginType == 10) {
            [loginData setValue:@"captchacode" forKey:@"method"];
        }
        
        if (self.loginMethod.length > 0) {
            [loginData setValue:self.loginMethod forKey:@"login_method"];
        }
        
        [loginModel setValue:loginData forKey:@"data"];
        
        [RXUIUserUtility sharedManager].loginData = [NSMutableDictionary dictionaryWithDictionary:loginData];
        [RXUIUserUtility saveAccounts:accounts];
        
        NSDictionary *notiDic = @{@"loginData" : loginData,
                                  @"loginType" : @(self.loginType)
        };
        
        RXLoginUIConfig *config = [RXUIUserUtility sharedManager].loginConfig;
        
        // 需要实名强制弹出实名认证
        BOOL isApprove = ([loginData[@"attr"] integerValue] & 1) == 1; // 是否实名认证 NO为未实名
        // 是否新用户
        BOOL isNew = ([loginData[@"flag"] integerValue] & 1) == 1;
        // 是否处于注销中
        BOOL isDeregister = ([loginData[@"flag"] integerValue] & 32) == 32;
        // 是否设置过密码
        BOOL passwordSet = [loginData[@"password_set"] boolValue];
        
        // 验证码登录的新用户并且没有设置过密码弹出设置密码
        if (self.loginType == 10 && isNew && config.needSetPassword && !passwordSet) {
//        if (config.needSetPassword) {
            [RXHUD hideHUD];
            RXSetPasswordView *setPasswordView = [[RXSetPasswordView alloc] initWithComplete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
                // 设置成功或取消设置判断是否需要实名认证
                if (!error) {
                    if (config.needRealAuth && !isApprove) {
//                    if (!isApprove) {
                        [self approveWithLoginModel:loginModel];
                    } else {
                        [[NSNotificationCenter defaultCenter] postNotificationName:noti_rxLogin object:nil userInfo:loginModel];
                        
                        if (self.loginManagerComplete) {
                            self.loginManagerComplete(loginModel, nil);
                        }
                    }
                    
                } else {
                    NSInteger errorCode = [error.responesObject[@"code"] integerValue];
                    if (errorCode == RXLimitError_closeView) {
                        if (config.needRealAuth && !isApprove) {
//                        if (!isApprove) {
                            [self approveWithLoginModel:loginModel];
                        } else {
                            [[NSNotificationCenter defaultCenter] postNotificationName:noti_rxLogin object:nil userInfo:loginModel];
                            
                            if (self.loginManagerComplete) {
                                self.loginManagerComplete(loginModel, nil);
                            }
                        }
                    }
                }
            }];
        } else if (isDeregister && config.isShowDeregister) {
            [RXHUD hideHUD];
            // 处于注销流程的用户根据设置弹出注销页面
            RXDestroyAccountView *desAccountView = [[RXDestroyAccountView alloc] initWithType:DestroyType_repeal reason:@"已提交注销申请" clickBlock:^(DestroyClickType clickType) {
                
                if ([config.deregisterType isEqualToString:@"logout"]) {
                    
                } else {
                    [[NSNotificationCenter defaultCenter] postNotificationName:noti_rxLogin object:nil userInfo:loginModel];
                    
                    if (self.loginManagerComplete) {
                        self.loginManagerComplete(loginModel, nil);
                    }
                }
            }];
        } else {
            [RXHUD hideHUD];
            if (config.needRealAuth && !isApprove) {
//            if (!isApprove) {
                [self approveWithLoginModel:loginModel];
            } else {
                [[NSNotificationCenter defaultCenter] postNotificationName:noti_rxLogin object:nil userInfo:loginModel];
                
                if (self.loginManagerComplete) {
                    self.loginManagerComplete(loginModel, nil);
                }
            }
        }
        
    } else {
        NSString *msg = loginModel[@"msg"];
        if (code == 1120) {
            msg = @"网络请求失败，请重试或检查网络设置";
        }
        
        NSDictionary *errorRes = (NSDictionary *)loginModel;
        NSInteger errorCode = [errorRes[@"code"] integerValue];
        /**
         * login_openid失效或过期重新调用登录
         */
        if (errorCode == 302204 || errorCode == 302205 || errorCode == 302202) {
            BOOL hasHistoryView = NO;
            for (UIView *subViews in [UIApplication sharedApplication].keyWindow.subviews) {
                if ([subViews isKindOfClass:[RXHistoryLoginView class]]) {
                    hasHistoryView = YES;
                }
            }
//             验证码登录需调用发送验证码
            if (self.loginType == 10) {
                self.isQuickLogin = YES;
                [RXHUD hideHUD];
                if (hasHistoryView) {
                    [[NSNotificationCenter defaultCenter] postNotificationName:RXUINoti_codeLogin object:nil userInfo:self.loginInfo];
                } else {
//                    [self codeLoginAction];
                    [self authLoginAction];
                }
//                [RXHUD showErrorText:@"登录失效，请重新登录"];
            } else if (self.loginType == 3) {
                self.isQuickLogin = YES;
                [RXHUD hideHUD];
                if (hasHistoryView) {
                    [[NSNotificationCenter defaultCenter] postNotificationName:RXUINoti_authLogin object:nil userInfo:self.loginInfo];
                } else {
                    [self authLoginAction];
                }
//                [RXHUD showErrorText:@"登录失效，请重新登录"];
            } else if (self.loginType == 1 && !self.loginInfo[@"password"]) {
                self.isQuickLogin = YES;
                [RXHUD hideHUD];
                if (hasHistoryView) {
                    [[NSNotificationCenter defaultCenter] postNotificationName:RXUINoti_accountLogin object:nil userInfo:self.loginInfo];
                } else {
//                    [self accountLoginAction];
                    [self authLoginAction];
                }
                //                [SVProgressHUD showErrorWithStatus:@"登录错误，请使用账号密码重新登录"];
//                [RXHUD showErrorText:@"登录失效，请使用账号密码重新登录"];
            } else {
                self.isLoginFail = YES;
                NSDictionary *loginExt = [NSDictionary dictionary];
                loginExt = [NSMutableDictionary dictionaryWithDictionary:[RXUIUserUtility sharedManager].loginTypeBlock(loginExt, self.loginType)];
                [self fetchLoginEvent:self.loginType loginInfo:loginExt complete:self.loginManagerComplete];
            }
            return;
        }
        
        /**
         * 账号密码登录并且账号为手机号时如果和上一次登录的设备码不一致直接跳转到验证码登录页面
         */
        if (errorCode == 322201) {
            dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
                [RXHUD showText:msg delay:3];
            });
            self.loginInfo = [NSMutableDictionary dictionary];
            [self.loginInfo setValue:[RXUIUserUtility sharedManager].username forKey:@"username"];
            
            BOOL hasLoginView = NO;
            for (UIView *v in [UIApplication sharedApplication].keyWindow.subviews) {
                if ([v isKindOfClass:[RXLoginView class]]) {
                    hasLoginView = YES;
                }
            }
            
            if (hasLoginView) {
                [[NSNotificationCenter defaultCenter] postNotificationName:RXUINoti_changeCodeLogin object:nil userInfo:self.loginInfo];
            } else {
                [[NSNotificationCenter defaultCenter] postNotificationName:RXUINoti_codeLogin object:nil userInfo:self.loginInfo];
            }
            
            return;
        }
        
        /**
         * 密码错误或账号不存在跳转到账号登录页面
         */
        BOOL needPostNoti = YES;
        for (UIView *subView in [UIApplication sharedApplication].keyWindow.subviews) {
            if ([subView isKindOfClass:[RXLoginView class]]) {
                needPostNoti = NO;
            }
        }
        if (needPostNoti) {
            if (errorCode == 312215 || errorCode == 312204) {
                if (self.loginType == 1) {
                    self.isQuickLogin = NO;
                    [[NSNotificationCenter defaultCenter] postNotificationName:RXUINoti_accountLogin object:nil userInfo:self.loginInfo];
                }
            }
        }
        
        [RXHUD showErrorText:msg];
        
        NSDictionary *notiDic = @{@"data" : loginModel,
                                  @"loginType" : @(self.loginType)
        };
        [[NSNotificationCenter defaultCenter] postNotificationName:noti_rxLogin object:nil userInfo:notiDic];
        
        RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
        
        err.responesObject = loginModel;
        if (self.loginManagerComplete) {
            self.loginManagerComplete(nil, err);
        }
    }
}

- (void)approveWithLoginModel:(NSDictionary *)loginModel
{    
    RXLoginUIConfig *config = [RXUIUserUtility sharedManager].loginConfig;
    RXApproveView *approve = [[RXApproveView alloc] initWithCanColose:config.canCloseRealAuth complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
        if (!error) {
            NSMutableDictionary *mutableNotiDic = [NSMutableDictionary dictionaryWithDictionary:loginModel];
            NSMutableDictionary *loginDataDic = [NSMutableDictionary dictionaryWithDictionary:loginModel[@"data"]];
            [loginDataDic setValue:@([response[@"age"] integerValue]) forKey:@"age"];
            int attr = [loginDataDic[@"attr"] intValue];
            attr = attr | 1;
            
            [loginDataDic setValue:@(attr) forKey:@"attr"];
            [loginDataDic setValue:@([response[@"aas"] integerValue]) forKey:@"aas"];
            
            int flag = [loginDataDic[@"flag"] intValue];
            BOOL limit = [response[@"limit"] boolValue];
            if (limit) {
                flag = flag | 2;
            } else {
                flag = flag & ~(1 << 1);
            }
            
            [loginDataDic setValue:@(flag) forKey:@"flag"];
            [mutableNotiDic setValue:loginDataDic forKey:@"data"];
            [[NSNotificationCenter defaultCenter] postNotificationName:noti_rxLogin object:nil userInfo:mutableNotiDic];

            if (self.loginManagerComplete) {
                self.loginManagerComplete(mutableNotiDic, nil);
            }
        } else {
//                    [RXHUD showErrorText:error.responesObject[@"msg"]];
            [RXUIUserUtility saveLoginModel:loginModel];
            if ([error.responesObject[@"code"] integerValue] == RXLimitError_closeView) {
                
            } else {
                [RXHUD showErrorText:error.responesObject[@"msg"]];
            }
        }
    }];
}

- (void)accountLoginAction
{
    RXLoginUIConfig *config = [RXUIUserUtility sharedManager].loginConfig;
    config.loginViewType = 0;
    RXLoginView *loginView = [[RXLoginView alloc] initWithConfig:config loginEvent:[RXUIUserUtility sharedManager].loginTypeBlock complete:self.loginManagerComplete];
    if (self.loginInfo[@"username"]) {
        loginView.username = self.loginInfo[@"username"];
    }
}

- (void)codeLoginAction
{
    RXLoginUIConfig *config = [RXUIUserUtility sharedManager].loginConfig;
    config.loginViewType = 1;
    RXLoginView *loginView = [[RXLoginView alloc] initWithConfig:config loginEvent:[RXUIUserUtility sharedManager].loginTypeBlock complete:self.loginManagerComplete];
    loginView.hideAnimate = YES;
    loginView.codeLoginBtn.selected = NO;
    [loginView codeLoginBtnAction:loginView.codeLoginBtn];
    if (self.loginInfo[@"username"]) {
        loginView.username = self.loginInfo[@"username"];
    }
}

- (void)authLoginAction
{
    [RXUIUserUtility sharedManager].isFirstView = YES;
    RXLoginUIConfig *config = [RXUIUserUtility sharedManager].loginConfig;
    
    [[RXUIKitService sharedSDK] setNormalLoginViewWithConfig:config isAuth:YES loginEvent:[RXUIUserUtility sharedManager].loginTypeBlock complete:self.loginManagerComplete];
//    self.loginConfig.loginViewType = 1;
//    RXLoginView *loginView = [[RXLoginView alloc] initWithConfig:self.loginConfig loginEvent:self.loginTypeBlock complete:self.loginComplete];
//    loginView.username = userInfo[@"username"];
}

@end
