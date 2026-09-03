//
//  RXOSLoginViewManager.m
//  RXUIKit
//
//  Created by 陈汉 on 2023/3/15.
//

#import "RXOSLoginViewManager.h"
#import "RXOSLoginView.h"
#import "RXOSUILoginConfig.h"
#import "RXOSSetPasswordView.h"
#import <RXSDK_Pure/RXErrorTool.h>
#import <RXSDK_Pure/RX_CommonNetworkExcute.h>
#import "RXOSDestroyAccountView.h"
#import <RXSDK_Pure/RXLogManager.h>
#import "RXOSLogManager.h"
#import "RXOSEmailLoginView.h"
#import "RXOSApproveView.h"
#import "RXOSUIKitService.h"
#import <RXSDK_Pure/RXSubPackage.h>

//@interface RXOSLoginViewManager () <RXLoginDelegate>
@interface RXOSLoginViewManager ()

@property (nonatomic, copy) LoginManagerComplete loginManagerComplete;
@property (nonatomic, assign) long loginType;
@property (nonatomic, strong) NSDictionary *loginInfo;
@property (nonatomic, strong) NSDictionary *notiDic; // 登录的通知数据
@property (nonatomic, assign) BOOL isUIRequest;
@property (nonatomic, assign) BOOL isQuickLogin;
@property (nonatomic, strong) NSString *loginMethod;

@end

@implementation RXOSLoginViewManager

static RXOSLoginViewManager *sharedSDK = nil;
static dispatch_once_t onceToken;

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXOSLoginViewManager alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
//        [RXService sharedSDK].loginDelegate = self;
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(loginCallBack:) name:@"noti_rxUILogin" object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(loginFail:) name:@"noti_LoginFail" object:nil];
    }
    return self;
}

- (void)fetchLoginEvent:(LoginType)loginType
              loginInfo:(NSDictionary *)loginInfo
               complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    if (!self.isQuickLogin) {
        [RXOSHUD showHUD];
    }
    
    self.loginManagerComplete = complete;
    self.loginType = (long)loginType;
    self.isUIRequest = YES;
    
    self.loginMethod = [RXOSCommonTool toMethodStr:self.loginType];
    
    [RX_CommonNetworkExcute shareInstance].subVersion = [NSString stringWithFormat:@"RXUIKit-v%@", [RXOSCommonTool getVersion]];
    
    switch (loginType) {
        case LoginTypeApple:
        {
            [[RXService sharedSDK] loginWithExtDic:[NSMutableDictionary dictionaryWithDictionary:loginInfo[@"ext"]] username:loginInfo[@"username"] password:loginInfo[@"password"] sign_fields:loginInfo[@"sign_fields"] loginType:LoginTypeApple migrate_args:loginInfo[@"migrate_args"]];
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
        case LoginTypeGoogle:
        {
            if (![RXSubPackage sharedSDK].aGoogle) {
                NSLog(@"未接入RXGoogleSDK");
                [RXOSHUD hideHUD];
                return;
            }
            
            [[RXService sharedSDK] loginWithLoginType:LoginTypeGoogle username:loginInfo[@"username"] password:loginInfo[@"password"] captchaCode:nil permissions:nil loginOpenId:nil extDic:[NSMutableDictionary dictionaryWithDictionary:loginInfo[@"ext"]] signFields:loginInfo[@"sign_fields"] migrateArgs:loginInfo[@"migrate_args"]];
            break;
        }
        case LoginTypeFacebook:
        {
            if (![RXSubPackage sharedSDK].aFacebook) {
                NSLog(@"未接入RXFacebookSDK");
                [RXOSHUD hideHUD];
                return;
            }
            
            NSArray *permissions = loginInfo[@"permissions"];
            if (permissions.count > 0) {
                //
            } else {
                permissions = @[@"public_profile"];
            }

            [[RXService sharedSDK] loginWithLoginType:LoginTypeFacebook username:loginInfo[@"username"] password:loginInfo[@"password"] captchaCode:nil permissions:permissions loginOpenId:nil extDic:[NSMutableDictionary dictionaryWithDictionary:loginInfo[@"ext"]] signFields:loginInfo[@"sign_fields"] migrateArgs:loginInfo[@"migrate_args"]];
            
            break;
        }
        case LoginTypeLine:
        {
            if (![RXSubPackage sharedSDK].aLine) {
                NSLog(@"未接入RXLineSDK");
                [RXOSHUD hideHUD];
                return;
            }
            
            NSArray *permissions = loginInfo[@"permissions"];
            if (permissions.count > 0) {
                //
            } else {
                permissions = @[@"profile"];
            }
            
            [[RXService sharedSDK] loginWithLoginType:LoginTypeLine username:loginInfo[@"username"] password:loginInfo[@"password"] captchaCode:nil permissions:permissions loginOpenId:nil extDic:[NSMutableDictionary dictionaryWithDictionary:loginInfo[@"ext"]] signFields:loginInfo[@"sign_fields"] migrateArgs:loginInfo[@"migrate_args"]];
            break;
        }
        case LoginTypeZalo:
        {
            if (![RXSubPackage sharedSDK].aZalo) {
                NSLog(@"未接入RXZaloSDK");
                [RXOSHUD hideHUD];
                return;
            }
            
            [[RXService sharedSDK] loginWithLoginType:LoginTypeZalo username:loginInfo[@"username"] password:loginInfo[@"password"] captchaCode:nil permissions:nil loginOpenId:nil extDic:[NSMutableDictionary dictionaryWithDictionary:loginInfo[@"ext"]] signFields:loginInfo[@"sign_fields"] migrateArgs:loginInfo[@"migrate_args"]];
            
            break;
        }
        case LoginTypeTikTok:
        {
            if (![RXSubPackage sharedSDK].aTikTok) {
                NSLog(@"未接入RXTikTokSDK");
                [RXOSHUD hideHUD];
                return;
            }
            
            [[RXService sharedSDK] loginWithLoginType:LoginTypeTikTok username:loginInfo[@"username"] password:loginInfo[@"password"] captchaCode:nil permissions:nil loginOpenId:nil extDic:[NSMutableDictionary dictionaryWithDictionary:loginInfo[@"ext"]] signFields:loginInfo[@"sign_fields"] migrateArgs:loginInfo[@"migrate_args"]];
            break;
        }
        case LoginTypeSnapChat:
        {
            if (![RXSubPackage sharedSDK].aSnapchat) {
                NSLog(@"未接入RXSnapChatSDK");
                [RXOSHUD hideHUD];
                return;
            }
            
            [[RXService sharedSDK] loginWithLoginType:LoginTypeSnapChat username:loginInfo[@"username"] password:loginInfo[@"password"] captchaCode:nil permissions:nil loginOpenId:nil extDic:[NSMutableDictionary dictionaryWithDictionary:loginInfo[@"ext"]] signFields:loginInfo[@"sign_fields"] migrateArgs:loginInfo[@"migrate_args"]];
            break;
        }
        case LoginTypeInstagram:
        {
            if (![RXSubPackage sharedSDK].aInstagram) {
                NSLog(@"未接入RXInstagramSDK");
                [RXOSHUD hideHUD];
                return;
            }
            
            [[RXService sharedSDK] loginWithLoginType:LoginTypeInstagram username:loginInfo[@"username"] password:loginInfo[@"password"] captchaCode:nil permissions:nil loginOpenId:nil extDic:[NSMutableDictionary dictionaryWithDictionary:loginInfo[@"ext"]] signFields:loginInfo[@"sign_fields"] migrateArgs:loginInfo[@"migrate_args"]];
            break;
        }
        case LoginTypeReddit:
        {
            if (![RXSubPackage sharedSDK].aReddit) {
                NSLog(@"未接入RXRedditSDK");
                [RXOSHUD hideHUD];
                return;
            }
            
            [[RXService sharedSDK] loginWithLoginType:LoginTypeReddit username:loginInfo[@"username"] password:loginInfo[@"password"] captchaCode:nil permissions:nil loginOpenId:nil extDic:[NSMutableDictionary dictionaryWithDictionary:loginInfo[@"ext"]] signFields:loginInfo[@"sign_fields"] migrateArgs:loginInfo[@"migrate_args"]];
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
    [RX_CommonNetworkExcute shareInstance].subVersion = [NSString stringWithFormat:@"RXUIKit-v%@", [RXOSCommonTool getVersion]];
    [RXOSHUD showHUD];
    self.loginType = (long)loginType;
    self.loginManagerComplete = complete;
    self.loginInfo = loginInfo;
    self.isUIRequest = YES;
    self.loginMethod = [RXOSCommonTool toMethodStr:self.loginType];
    
    NSMutableDictionary *extDic = [NSMutableDictionary dictionaryWithDictionary:loginInfo[@"ext"]];
    [extDic setValue:[RXOSCommonTool toMethodStr:self.loginType] forKey:@"method"];
    
    [[RXService sharedSDK] loginWithLoginOpenId:loginInfo[@"login_openid"] sign_fields:loginInfo[@"sign_fields"] extDic:extDic];
//    [[RXService sharedSDK] loginWithLoginOpenId:@"" sign_fields:loginInfo[@"sign_fields"] extDic:loginInfo[@"sign_fields"]];
}

- (void)loginWithconfig:(RXOSUILoginConfig *)config
               complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    self.isQuickLogin = YES;
    self.loginType = [RXOSCommonTool toLoginType:config.method];
    [RX_CommonNetworkExcute shareInstance].subVersion = [NSString stringWithFormat:@"RXOSUIKit-v%@", [RXOSCommonTool getVersion]];
//    [RXHUD showHUD];
    self.loginManagerComplete = complete;
    self.isUIRequest = YES;
    self.loginMethod = [RXOSCommonTool toMethodStr:self.loginType];
    
    NSMutableDictionary *extDic = [NSMutableDictionary dictionaryWithDictionary:config.setCustomParams];
    [extDic setValue:config.method forKey:@"method"];
    
    [[RXService sharedSDK] loginWithLoginOpenId:config.loginOpenid sign_fields:config.signFields extDic:extDic];
//    [[RXService sharedSDK] loginWithLoginOpenId:@"" sign_fields:loginInfo[@"sign_fields"] extDic:loginInfo[@"sign_fields"]];
}

- (void)loginCallBack:(NSNotification *)noti
{
    if (!self.isUIRequest) {
        [RXOSHUD hideHUD];
        NSMutableDictionary *notiDic = [NSMutableDictionary dictionaryWithDictionary:noti.userInfo];
        NSDictionary *loginModel = notiDic[@"loginData"];
        NSDictionary *loginData = loginModel[@"data"];
        
        if ([loginModel[@"code"] integerValue] == 0) {
            [RXOSUserUtility sharedManager].apiLoginData = [NSMutableDictionary dictionaryWithDictionary:loginData];
            [RXOSUserUtility sharedManager].loginData = nil;
        }
        
        NSMutableArray *accounts = [NSMutableArray arrayWithArray:[RXOSUserUtility sharedManager].accounts];
        
        if (accounts.count > 0) {
            
            if (!self.loginType && [[NSUserDefaults standardUserDefaults] valueForKey:keyUserData_methodenum]) {
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
        
        [RXOSUserUtility saveAccounts:accounts];
      
        return;
    }
    self.isUIRequest = NO;
        
    NSMutableDictionary *notiDic = [NSMutableDictionary dictionaryWithDictionary:noti.userInfo];
    
    NSDictionary *loginModel = notiDic[@"loginData"];
    NSInteger code = [loginModel[@"code"] integerValue];
    
    if (loginModel && code == 0) {
        self.isQuickLogin = NO;
        NSMutableDictionary *loginData = [NSMutableDictionary dictionaryWithDictionary:loginModel[@"data"]];
        [RXOSUserUtility sharedManager].loginData = [NSMutableDictionary dictionaryWithDictionary:loginData];
    
        NSMutableDictionary *userInfo = [NSMutableDictionary dictionary];
        [userInfo setValue:@(self.loginType) forKey:@"loginType"];
        [userInfo setValue:loginData[@"openid"] forKey:@"openid"];
        [userInfo setValue:loginData[@"login_openid"] forKey:@"login_openid"];
        if (self.loginType == 0) {
            [userInfo setValue:@"游客账号" forKey:@"nickname"];
        } else if (self.loginType == 1 || self.loginType == 2 || self.loginType == 10) {
            // 账号、邮箱、验证码类型 nickname 保存手机号或邮箱
            [userInfo setValue:[RXOSUserUtility sharedManager].username forKey:@"nickname"];
        } else if (self.loginType == 3) {
            [userInfo setValue:@"一键登录" forKey:@"nickname"];
        }
        else {
            [userInfo setValue:loginData[@"nickname"] forKey:@"nickname"];
        }
        [userInfo setValue:[RXOSUserUtility sharedManager].username forKey:@"username"];
        [userInfo setValue:[RXOSUserUtility sharedManager].password forKey:@"password"];
        
        NSMutableArray *accounts = [NSMutableArray arrayWithArray:[RXOSUserUtility sharedManager].accounts];
        
        if (accounts.count > 0) {
            BOOL needRemove = NO;
            NSInteger removeIndex = 0;
            for (int i = 0; i < accounts.count; i++) {
                NSMutableDictionary *userInfo_old = accounts[i];
                /**
                 * 相同登录方式进行同openid去重，并移到数组第一位
                 * 不同登录方式相同openid保留
                 */
//                if (self.loginType == [userInfo_old[@"loginType"] longValue]) {
                    NSString *oldOpenid = userInfo[@"oldopenid"];
                    if ([userInfo[@"openid"] isEqualToString:userInfo_old[@"openid"]]) {
                        needRemove = YES;
                        removeIndex = i;
                    }  else if ([userInfo_old[@"sync"] integerValue] == 1 && [userInfo[@"username"] isEqualToString:userInfo_old[@"username"]]) {
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
//                }
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
        
        [RXOSUserUtility saveAccounts:accounts];
        
        if (self.loginMethod.length > 0) {
            [loginData setValue:self.loginMethod forKey:@"login_method"];
        }
        
        NSDictionary *notiDic = @{@"loginData" : loginData,
                                  @"loginType" : @(self.loginType)
        };
        
        RXOSUILoginConfig *config = [RXOSUserUtility sharedManager].loginConfig;
        
        // 需要实名强制弹出实名认证
        BOOL isApprove = ([loginData[@"attr"] integerValue] & 1) == 1; // 是否实名认证 NO为未实名
        // 是否新用户
        BOOL isNew = ([loginData[@"flag"] integerValue] & 1) == 1;
        // 是否处于注销中
        BOOL isDeregister = ([loginData[@"flag"] integerValue] & 32) == 32;
        
        // 验证码登录的新用户弹出设置密码
        if (self.loginType == 10 && isNew && config.needSetPassword) {
//        if (config.needSetPassword) {
            [RXOSHUD hideHUD];
            RXOSSetPasswordView *setPasswordView = [[RXOSSetPasswordView alloc] initWithComplete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
                // 设置成功或取消设置判断是否需要实名认证
                if (!error) {
                    if (config.needRealAuth && !isApprove) {
                        [self approveWithLoginModel:loginModel];
                    } else {
                        [[NSNotificationCenter defaultCenter] postNotificationName:noti_rxLogin object:nil userInfo:loginModel];
                        
                        if (self.loginManagerComplete) {
                            self.loginManagerComplete(loginModel, nil);
                        }
                    }
                    
                } else {
                    if (config.needRealAuth && !isApprove) {
                        [self approveWithLoginModel:loginModel];
                    } else {
                        NSInteger errorCode = [error.responesObject[@"code"] integerValue];
                        if (errorCode == RXLimitError_closeView) {
                            [[NSNotificationCenter defaultCenter] postNotificationName:noti_rxLogin object:nil userInfo:loginModel];
                            
                            if (self.loginManagerComplete) {
                                self.loginManagerComplete(loginModel, nil);
                            }
                        }
                    }
                }
            }];
        } else if (isDeregister && config.isShowDeregister) {
            [RXOSHUD hideHUD];
            // 处于注销流程的用户根据设置弹出注销页面
            RXOSDestroyAccountView *desAccountView = [[RXOSDestroyAccountView alloc] initWithType:DestroyType_repeal reason:@"已提交注销申请" clickBlock:^(DestroyClickType clickType) {
                
                if ([config.deregisterType isEqualToString:@"logout"]) {
                    
                } else {
                    [[NSNotificationCenter defaultCenter] postNotificationName:noti_rxLogin object:nil userInfo:loginModel];
                    
                    if (self.loginManagerComplete) {
                        self.loginManagerComplete(loginModel, nil);
                    }
                }
            }];
        } else {
            [RXOSHUD hideHUD];
            if (config.needRealAuth && !isApprove) {
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
        if (errorCode == 302204 || errorCode == 302205) {
//             验证码登录需调用发送验证码
            if (self.loginType == 10) {
                self.isQuickLogin = YES;
                [[NSNotificationCenter defaultCenter] postNotificationName:RXUINoti_codeLogin object:nil userInfo:self.loginInfo];
                [RXOSHUD showErrorText:@"登录失效，请重新登录"];
            } else if (self.loginType == 1 && !self.loginInfo[@"password"]) {
                self.isQuickLogin = YES;
                //                [SVProgressHUD showErrorWithStatus:@"登录错误，请使用账号密码重新登录"];
                [[NSNotificationCenter defaultCenter] postNotificationName:RXUINoti_accountLogin object:nil userInfo:self.loginInfo];
                [RXOSHUD showErrorText:@"登录失效，请重新登录"];
            }else {
                [self fetchLoginEvent:self.loginType loginInfo:self.loginInfo complete:self.loginManagerComplete];
            }
            return;
        }
        /**
         * 密码错误或账号不存在跳转到账号登录页面
         */
        BOOL needPostNoti = YES;
        for (UIView *subView in [UIApplication sharedApplication].keyWindow.subviews) {
            if ([subView isKindOfClass:[RXOSEmailLoginView class]]) {
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
        
        [RXOSHUD showErrorText:msg];
        
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

- (void)loginFail:(NSNotification *)noti
{
    [RXOSHUD hideHUD];
    
    NSDictionary *errorInfo = noti.userInfo;
    
    if (self.loginType == 7) { // google 登录
        NSError *error = (NSError *)noti.userInfo[@"error"];
        [[RXOSLogManager sharedSDK] addThirdLoginLogWithLoginType:LoginTypeGoogle begin:NO errorInfo:@{@"msg" : error.localizedDescription, @"code" : @(error.code)}];
    } else if (self.loginType == 8) { // facebook 登录
        RX_CommonRequestError *error = (RX_CommonRequestError *)noti.userInfo[@"error"];
        NSDictionary *errDic = (NSDictionary *)error.responesObject;
        [RXOSHUD showErrorText:errDic[@"msg"]];
        [[RXOSLogManager sharedSDK] addThirdLoginLogWithLoginType:LoginTypeFacebook begin:NO errorInfo:@{@"msg" : errDic[@"msg"], @"code" : @([errDic[@"code"] integerValue])}];
    } else if (self.loginType == 11) { // line 登录
        NSError *error = (NSError *)noti.userInfo[@"error"];
        [[RXOSLogManager sharedSDK] addThirdLoginLogWithLoginType:LoginTypeFacebook begin:NO errorInfo:@{@"msg" : error.localizedDescription, @"code" : @(error.code)}];
    }
}

- (void)approveWithLoginModel:(NSDictionary *)loginModel
{
    RXOSUILoginConfig *config = [RXOSUserUtility sharedManager].loginConfig;
    
    [[RXOSUIKitService sharedSDK] setRealauthViewH5WithRegion:config.realAuthRegion canClose:config.canCloseRealAuth complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
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
            [RXOSUserUtility saveLoginModel:loginModel];
            if ([error.responesObject[@"code"] integerValue] == RXLimitError_closeView) {
                
            } else {
                [RXOSHUD showErrorText:error.responesObject[@"msg"]];
            }
        }
    }];
}

@end
