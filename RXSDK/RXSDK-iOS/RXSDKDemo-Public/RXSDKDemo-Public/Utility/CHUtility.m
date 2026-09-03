//
//  CHUtility.m
//  RXSDKDemo-Public
//
//  Created by 陈汉 on 2024/1/2.
//

#import "CHUtility.h"
#import <UIKit/UIKit.h>
#import <CoreTelephony/CTTelephonyNetworkInfo.h>

@implementation CHUtility

static CHUtility *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedManager
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[CHUtility alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        self.loginTypes = [NSMutableArray array];
        [self.loginTypes addObject:@"apple"];
    }
    return self;
}

- (void)checkLoginTypes:(NSArray *)loginTypesArray backBlock:(BackAppInfoBlock)block{
    
    self.block = block;
    NSMutableArray *loginTypes = [NSMutableArray array];
    NSMutableArray *loginTitles = [NSMutableArray array];
    NSMutableArray *loginImgs = [NSMutableArray array];
    
    if (loginTypesArray.count == 0) {//无需验证直接返回
        if (self.block) {
            self.block(loginTypes, loginTitles, loginImgs);
        }
        return;
    }
    
    for (NSString *loginTypeStr in loginTypesArray) {
        if ([loginTypeStr isEqualToString:@"guest"]) {
            [loginTypes addObject: @"guest"];
            [loginTitles addObject: @"游客登录"];
            [loginImgs addObject: @"login_guest"];
        }else if ([loginTypeStr isEqualToString:@"username"]){
            [loginTypes addObject: @"username"];
            [loginTitles addObject: @"账号登录"];
            [loginImgs addObject: @"login_account"];
        }else if ([loginTypeStr isEqualToString:@"code"]){
            [loginTypes addObject: @"code"];
            [loginTitles addObject: @"验证码登录"];
            [loginImgs addObject: @"login_code"];
        }else if ([loginTypeStr isEqualToString:@"wechat"]) {
            if ([[UIApplication sharedApplication] canOpenURL:[NSURL URLWithString:@"wechat://"]]) {
                [loginTypes addObject: @"wechat"];
                [loginTitles addObject: @"微信登录"];
                [loginImgs addObject: @"rx_login_wechat"];
            }
        }else if ([loginTypeStr isEqualToString:@"auth"]) {
            if ([self hasSIMCard]) {
                [loginTypes addObject: @"auth"];
                [loginTitles addObject: @"本机一键登录"];
                [loginImgs addObject: @"rx_login_auth"];
            }
        }else if ([loginTypeStr isEqualToString:@"google"]) {
            [loginTypes addObject: @"google"];
            [loginTitles addObject: @"谷歌登录"];
            [loginImgs addObject: @"rx_login_google"];
        }else if ([loginTypeStr isEqualToString:@"facebook"]) {
            if ([[UIApplication sharedApplication] canOpenURL:[NSURL URLWithString:@"fbapi://"]]) {
                [loginTypes addObject: @"facebook"];
                [loginTitles addObject: @"facebook登录"];
                [loginImgs addObject: @"rx_login_facebook"];
            }
        }else if ([loginTypeStr isEqualToString:@"line"]) {
            if ([[UIApplication sharedApplication] canOpenURL:[NSURL URLWithString:@"line://"]]) {
                [loginTypes addObject: @"line"];
                [loginTitles addObject: @"line登录"];
                [loginImgs addObject: @"rx_login_line"];
            }
        }else if ([loginTypeStr isEqualToString:@"zalo"]) {
            if ([[UIApplication sharedApplication] canOpenURL:[NSURL URLWithString:@"zalosdk://"]]) {
                [loginTypes addObject: @"zalo"];
                [loginTitles addObject: @"zalo登录"];
                [loginImgs addObject: @"rx_login_zalo"];
            }
        }else if ([loginTypeStr isEqualToString:@"tiktok"]) {
            if ([[UIApplication sharedApplication] canOpenURL:[NSURL URLWithString:@"tiktoksharesdk://"]]) {
                [loginTypes addObject: @"tiktok"];
                [loginTitles addObject: @"tiktok登录"];
                [loginImgs addObject: @"rx_login_tiktok"];
            }
        }else if ([loginTypeStr isEqualToString:@"snapchat"]) {//snapchat登录已废弃
            if ([[UIApplication sharedApplication] canOpenURL:[NSURL URLWithString:@"snapchat://"]]) {
                [loginTypes addObject: @"snapchat"];
                [loginTitles addObject: @"snapchat登录"];
                [loginImgs addObject: @"rx_login_snapchat"];
            }
        }else if ([loginTypeStr isEqualToString:@"instagram"]) {
            [loginTypes addObject: @"instagram"];
            [loginTitles addObject: @"instagram登录"];
            [loginImgs addObject: @"rx_login_instagram"];
            
        }else if ([loginTypeStr isEqualToString:@"reddit"]) {
            [loginTypes addObject: @"reddit"];
            [loginTitles addObject: @"reddit登录"];
            [loginImgs addObject: @"rx_login_reddit"];
        }
    }
    if (self.block) {
        self.block(loginTypes, loginTitles, loginImgs);
    }
}

- (void)checkShareTypes:(NSArray *)shareTypesArray backBlock:(BackAppInfoBlock)block{
    
    self.shareBlock = block;
    NSMutableArray *loginTypes = [NSMutableArray array];
    NSMutableArray *loginTitles = [NSMutableArray array];
    NSMutableArray *loginImgs = [NSMutableArray array];
    
    if (shareTypesArray.count == 0) {//无需验证直接返回
        if (self.shareBlock) {
            self.shareBlock(loginTypes, loginTitles, loginImgs);
        }
        return;
    }
//    wechat、system、facebook、messenger、line、tiktok、zalo、snapchat
    for (NSString *shareTypeStr in shareTypesArray) {
        if ([shareTypeStr hasPrefix:@"wechat"]) {
            if ([[UIApplication sharedApplication] canOpenURL:[NSURL URLWithString:@"wechat://"]]) {
                
                [loginTypes addObject: @"wechat"];
                [loginTitles addObject: @"wechat分享图片(朋友圈)"];
                [loginImgs addObject: @"rx_login_wechat"];
                
                [loginTypes addObject: @"wechat"];
                [loginTitles addObject: @"wechat分享链接(朋友圈)"];
                [loginImgs addObject: @"rx_login_wechat"];
                
                [loginTypes addObject: @"wechat"];
                [loginTitles addObject: @"wechat分享图片(好友)"];
                [loginImgs addObject: @"rx_login_wechat"];
                
                [loginTypes addObject: @"wechat"];
                [loginTitles addObject: @"wechat分享链接(好友)"];
                [loginImgs addObject: @"rx_login_wechat"];
                
            }
        }else if ([shareTypeStr hasPrefix:@"system"]){
            
            [loginTypes addObject: @"system"];
            [loginTitles addObject: @"system分享图片"];
            [loginImgs addObject: @"rx_login_auth"];
            
            [loginTypes addObject: @"system"];
            [loginTitles addObject: @"system分享链接"];
            [loginImgs addObject: @"rx_login_auth"];
            
        }else if ([shareTypeStr hasPrefix:@"facebook"]) {
            if ([[UIApplication sharedApplication] canOpenURL:[NSURL URLWithString:@"fbapi://"]]) {
                
                [loginTypes addObject: @"facebook"];
                [loginTitles addObject: @"facebook分享图片（弹窗）"];
                [loginImgs addObject: @"rx_login_facebook"];
                
                [loginTypes addObject: @"facebook"];
                [loginTitles addObject: @"facebook分享链接（弹窗）"];
                [loginImgs addObject: @"rx_login_facebook"];
                
                [loginTypes addObject: @"facebook"];
                [loginTitles addObject: @"facebook分享图片（跳转）"];
                [loginImgs addObject: @"rx_login_facebook"];
                
                [loginTypes addObject: @"facebook"];
                [loginTitles addObject: @"facebook分享链接（跳转）"];
                [loginImgs addObject: @"rx_login_facebook"];
            }
        }else if ([shareTypeStr hasPrefix:@"messenger"]){
            if ([[UIApplication sharedApplication] canOpenURL:[NSURL URLWithString:@"fb-messenger://"]]) {
                
                [loginTypes addObject: @"messenger"];
                [loginTitles addObject: @"messenger分享图片"];
                [loginImgs addObject: @"rx_login_messenger"];
                
                [loginTypes addObject: @"messenger"];
                [loginTitles addObject: @"messenger分享链接"];
                [loginImgs addObject: @"rx_login_messenger"];
            }
        }else if ([shareTypeStr hasPrefix:@"line"]) {
            if ([[UIApplication sharedApplication] canOpenURL:[NSURL URLWithString:@"line://"]]) {
                
                [loginTypes addObject: @"line"];
                [loginTitles addObject: @"line分享链接"];
                [loginImgs addObject: @"rx_login_line"];
            }
        }else if ([shareTypeStr hasPrefix:@"zalo"]) {
            if ([[UIApplication sharedApplication] canOpenURL:[NSURL URLWithString:@"zalosdk://"]]) {
                
                [loginTypes addObject: @"zalo"];
                [loginTitles addObject: @"zalo分享链接"];
                [loginImgs addObject: @"rx_login_zalo"];
            }
            
        }else if ([shareTypeStr hasPrefix:@"tiktok"]) {
            if ([[UIApplication sharedApplication] canOpenURL:[NSURL URLWithString:@"tiktoksharesdk://"]]) {
                
                [loginTypes addObject: @"tiktok-image"];
                [loginTitles addObject: @"tiktok分享图片"];
                [loginImgs addObject: @"rx_login_tiktok"];
                
                [loginTypes addObject: @"tiktok-images"];
                [loginTitles addObject: @"tiktok分享图集"];
                [loginImgs addObject: @"rx_login_tiktok"];
            }
            
        }else if ([shareTypeStr hasPrefix:@"snapchat"]) {
            if ([[UIApplication sharedApplication] canOpenURL:[NSURL URLWithString:@"snapchat://"]]) {
                
                [loginTypes addObject: @"snapchat-image"];
                [loginTitles addObject: @"snapchat分享图片"];
                [loginImgs addObject: @"rx_login_snapchat"];
            }
        }
    }
    if (self.shareBlock) {
        self.shareBlock(loginTypes, loginTitles, loginImgs);
    }
}

- (void)checkPlatformShareTypes:(NSArray *)shareTypesArray backBlock:(BackAppInfoBlock)block{
    
    self.platformShareBlock = block;
    NSMutableArray *loginTypes = [NSMutableArray array];
    NSMutableArray *loginTitles = [NSMutableArray array];
    NSMutableArray *loginImgs = [NSMutableArray array];
    
    if (shareTypesArray.count == 0) {//无需验证直接返回
        if (self.platformShareBlock) {
            self.platformShareBlock(loginTypes, loginTitles, loginImgs);
        }
        return;
    }
//    wechat、system、facebook、messenger、line、tiktok、zalo、snapchat
    for (NSString *shareTypeStr in shareTypesArray) {
        if ([shareTypeStr hasPrefix:@"wechat"]) {
            if ([[UIApplication sharedApplication] canOpenURL:[NSURL URLWithString:@"wechat://"]]) {
                
                [loginTypes addObject: @"wechat"];
                [loginTitles addObject: @"wechat分享"];
                [loginImgs addObject: @"rx_login_wechat"];
                
            }
        }else if ([shareTypeStr hasPrefix:@"system"]){
            
            [loginTypes addObject: @"system"];
            [loginTitles addObject: @"system分享"];
            [loginImgs addObject: @"rx_login_auth"];
            
        }else if ([shareTypeStr hasPrefix:@"facebook"]) {
            if ([[UIApplication sharedApplication] canOpenURL:[NSURL URLWithString:@"fbapi://"]]) {
                
                [loginTypes addObject: @"facebook"];
                [loginTitles addObject: @"facebook分享"];
                [loginImgs addObject: @"rx_login_facebook"];
            }
        }else if ([shareTypeStr hasPrefix:@"messenger"]){
            if ([[UIApplication sharedApplication] canOpenURL:[NSURL URLWithString:@"fb-messenger://"]]) {
                
                [loginTypes addObject: @"messenger"];
                [loginTitles addObject: @"messenger分享"];
                [loginImgs addObject: @"rx_login_messenger"];
            }
        }else if ([shareTypeStr hasPrefix:@"line"]) {
            if ([[UIApplication sharedApplication] canOpenURL:[NSURL URLWithString:@"line://"]]) {
                
                [loginTypes addObject: @"line"];
                [loginTitles addObject: @"line分享"];
                [loginImgs addObject: @"rx_login_line"];
            }
        }else if ([shareTypeStr hasPrefix:@"zalo"]) {
            if ([[UIApplication sharedApplication] canOpenURL:[NSURL URLWithString:@"zalosdk://"]]) {
                
                [loginTypes addObject: @"zalo"];
                [loginTitles addObject: @"zalo分享"];
                [loginImgs addObject: @"rx_login_zalo"];
            }
            
        }else if ([shareTypeStr hasPrefix:@"tiktok"]) {
            if ([[UIApplication sharedApplication] canOpenURL:[NSURL URLWithString:@"tiktoksharesdk://"]]) {
                
                [loginTypes addObject: @"tiktok-image"];
                [loginTitles addObject: @"tiktok分享"];
                [loginImgs addObject: @"rx_login_tiktok"];
            }
            
        }else if ([shareTypeStr hasPrefix:@"snapchat"]) {
            if ([[UIApplication sharedApplication] canOpenURL:[NSURL URLWithString:@"snapchat://"]]) {
                
                [loginTypes addObject: @"snapchat-image"];
                [loginTitles addObject: @"snapchat分享"];
                [loginImgs addObject: @"rx_login_snapchat"];
            }
        }
    }
    if (self.platformShareBlock) {
        self.platformShareBlock(loginTypes, loginTitles, loginImgs);
    }
}

- (void)checkPayTypes:(NSArray *)payTypesArray backBlock:(BackAppInfoBlock)block{
    
    self.shareBlock = block;
    NSMutableArray *payTypes = [NSMutableArray array];
    NSMutableArray *payTitles = [NSMutableArray array];
    NSMutableArray *payImgs = [NSMutableArray array];
    
    if (payTypesArray.count == 0) {//无需验证直接返回
        if (self.shareBlock) {
            self.shareBlock(payTypes, payTitles, payImgs);
        }
        return;
    }
//支付平台：appstore、yeepay（wechat）、wechat、ruixue_h5_trade、unipin
    for (NSString *payTypeStr in payTypesArray) {
        if ([payTypeStr hasPrefix:@"appstore"]) {
            [payTypes addObject: @"appstore"];
//此处将”苹果支付"或”苹果内购"直接修改为内购的产品名称，避免误导审核员和用户
            [payTitles addObject: @"瑞雪产品1"];
            [payImgs addObject: @"rx_login_apple"];
            
        }else if ([payTypeStr hasPrefix:@"yeepay"]){
            
            [payTypes addObject: @"yeepay"];
            [payTitles addObject: @"易宝支付"];
            [payImgs addObject: @"rx_pay_yeebaopay"];
            
        }else if ([payTypeStr hasPrefix:@"wechat"]) {
            if ([[UIApplication sharedApplication] canOpenURL:[NSURL URLWithString:@"wechat://"]]) {
                
                [payTypes addObject: @"wechat"];
                [payTitles addObject: @"微信支付"];
                [payImgs addObject: @"rx_login_wechat"];
            }
        }else if ([payTypeStr hasPrefix:@"ruixue_h5_trade"]){
                
                [payTypes addObject: @"ruixue_h5_trade"];
                [payTitles addObject: @"H5收银台支付"];
                [payImgs addObject: @"rx_login_auth"];
                
        }else if ([payTypeStr hasPrefix:@"unipin"]) {
            [payTypes addObject: @"unipin"];
            [payTitles addObject: @"unipin支付"];
            [payImgs addObject: @"rx_pay_unipin"];
            
        }
        
    }
    if (self.shareBlock) {
        self.shareBlock(payTypes, payTitles, payImgs);
    }
}

#pragma mark - other function
//是否包含SIM卡，不准确
- (BOOL)hasSIMCard {
    CTTelephonyNetworkInfo *networkInfo = [[CTTelephonyNetworkInfo alloc] init];
    NSDictionary *providers = [networkInfo serviceSubscriberCellularProviders];
    for (NSString *key in providers) {
        CTCarrier *carrier = [providers objectForKey:key];
        if (carrier) {
            return YES;
        }
    }
    return NO;
}

@end
