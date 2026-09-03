//
//  RXFeedbackUserUtility.m
//  RXUIKit-OS
//
//  Created by 陈汉 on 2023/6/15.
//

#import "RXFeedbackUserUtility.h"

static NSString *const rxUIKey_universallink = @"rx_universallink";
static NSString *const rxUIKey_legal = @"rx_legal";
static NSString *const keyUserData_accounts = @"rx_accounts";
static NSString *const keyUserData_phone = @"rx_phone";
static NSString *const keyUserData_password = @"rx_password";
static NSString *const keyUserData_loginModel = @"rx_loginModel";
static NSString *const keyUserData_loginType = @"rx_loginType";
static NSString *const keyUserData_logoImage = @"rx_logoImage";

@implementation RXFeedbackUserUtility

static RXFeedbackUserUtility *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedManager
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXFeedbackUserUtility alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        self.isFirstView = YES;
        self.inProfile = [[NSUserDefaults standardUserDefaults] valueForKey:@"rx_initProfile"];
        self.loginTypes = [NSMutableArray array];
    }
    return self;
}

- (NSString *)universallink
{
    NSString *ulink = [[NSUserDefaults standardUserDefaults] valueForKey:rxUIKey_universallink];
    return ulink.length > 0 ? ulink : @"";
}

- (NSMutableDictionary *)legalModel
{
    return [[NSUserDefaults standardUserDefaults] valueForKey:rxUIKey_legal];
}

/** 保存accounts */
+ (void)saveAccounts:(NSMutableArray *)accounts
{
    [[NSUserDefaults standardUserDefaults] setValue:accounts forKey:keyUserData_accounts];
}

- (NSMutableArray *)accounts
{
    NSMutableArray *arr = [NSMutableArray array];
    arr = [[NSUserDefaults standardUserDefaults] valueForKey:keyUserData_accounts];
    return arr ? arr : [NSMutableArray array];
}

/** 保存loginModel */
+ (void)saveLoginModel:(NSDictionary *)loginModel
{
    [[NSUserDefaults standardUserDefaults] setValue:loginModel forKey:keyUserData_loginModel];
}

- (NSDictionary *)loginModel
{
    return [[NSUserDefaults standardUserDefaults] valueForKey:keyUserData_loginModel];
}

/** 保存LoginType */
+ (void)saveLoginType:(NSNumber *)loginType
{
    [[NSUserDefaults standardUserDefaults] setValue:loginType forKey:keyUserData_loginType];
}

- (NSNumber *)loginType
{
    return [[NSUserDefaults standardUserDefaults] valueForKey:keyUserData_loginType];
}

- (NSString *)cpid
{
    return [[NSUserDefaults standardUserDefaults] valueForKey:@"rx_cpId"];
}

- (NSString *)channelId
{
    return [[NSUserDefaults standardUserDefaults] valueForKey:@"rx_channelId"];
}

- (NSString *)productId
{
    return [[NSUserDefaults standardUserDefaults] valueForKey:@"rx_productId"];
}

- (NSArray *)baseUrlList
{
    return [[NSUserDefaults standardUserDefaults] valueForKey:@"rx_baseUrlList"];
}

/** 保存logo */
+ (void)saveLogoImage:(UIImage *)logoImage
{
    NSData *imageData = UIImageJPEGRepresentation(logoImage, 1.0);

    [[NSUserDefaults standardUserDefaults] setValue:imageData forKey:keyUserData_logoImage];
}

- (UIImage *)logoImage
{
    UIImage *image = [UIImage imageWithData:[[NSUserDefaults standardUserDefaults] valueForKey:keyUserData_logoImage]];
    return image;
}

- (BOOL)closeEmailRegister
{
    return [[NSUserDefaults standardUserDefaults] boolForKey:keyUser_closeEmailRegister];
}

@end

